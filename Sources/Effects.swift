import SceneKit
import AppKit
import simd

/// Rotate a node so that its local +Z axis points along `dir`.
func orientZ(_ node: SCNNode, to dir: V3) {
    let d = safeNorm(dir)
    if d.z < -0.9999 {
        node.simdOrientation = simd_quatf(angle: .pi, axis: V3(0, 1, 0))
    } else {
        node.simdOrientation = simd_quatf(from: V3(0, 0, 1), to: d)
    }
}

/// Rotation that maps +Y onto `dir` (for particle bursts along a surface normal).
func transformY(to dir: V3, at pos: V3) -> SCNMatrix4 {
    let d = safeNorm(dir, V3(0, 1, 0))
    let q: simd_quatf = d.y < -0.9999 ? simd_quatf(angle: .pi, axis: V3(1, 0, 0)) : simd_quatf(from: V3(0, 1, 0), to: d)
    var m = simd_float4x4(q)
    m.columns.3 = SIMD4<Float>(pos.x, pos.y, pos.z, 1)
    return SCNMatrix4(m)
}

final class Effects {
    let scene: SCNScene
    let root = SCNNode()
    var trauma: Float = 0

    private struct FxLight { var node: SCNNode; var t: Float; var dur: Float; var peak: Float }
    private var lights: [FxLight] = []
    private var lightIdx = 0

    private let sparks: SCNParticleSystem
    private let fire: SCNParticleSystem
    private let smoke: SCNParticleSystem
    private let embers: SCNParticleSystem
    private let shards: SCNParticleSystem
    private let unitBox = Geo.box(1, 1, 1)
    private var beamMats: [String: SCNMaterial] = [:]
    private var debrisCount = 0

    init(scene: SCNScene) {
        self.scene = scene
        scene.rootNode.addChildNode(root)
        for _ in 0..<3 {
            let n = SCNNode()
            let l = SCNLight()
            l.type = .omni
            l.intensity = 0
            l.attenuationStartDistance = 0.5
            l.attenuationEndDistance = 16
            l.attenuationFalloffExponent = 2
            l.categoryBitMask = 1
            n.light = l
            root.addChildNode(n)
            lights.append(FxLight(node: n, t: 1, dur: 1, peak: 0))
        }

        func fadeAnim(_ values: [Float], _ times: [Float]) -> SCNParticlePropertyController {
            let a = CAKeyframeAnimation()
            a.values = values.map { NSNumber(value: $0) }
            a.keyTimes = times.map { NSNumber(value: $0) }
            return SCNParticlePropertyController(animation: a)
        }

        sparks = SCNParticleSystem()
        sparks.particleImage = Tex.softDot
        sparks.loops = false
        sparks.emissionDuration = 0.03
        sparks.birthRate = 16
        sparks.particleLifeSpan = 0.32
        sparks.particleLifeSpanVariation = 0.2
        sparks.particleVelocity = 7
        sparks.particleVelocityVariation = 5
        sparks.emittingDirection = SCNVector3(0, 1, 0)
        sparks.spreadingAngle = 55
        sparks.particleSize = 0.035
        sparks.particleSizeVariation = 0.02
        sparks.stretchFactor = 0.06
        sparks.isAffectedByGravity = true
        sparks.blendMode = .additive
        sparks.isLightingEnabled = false
        sparks.particleColor = color(1.0, 0.8, 0.4)
        sparks.propertyControllers = [.opacity: fadeAnim([1, 1, 0], [0, 0.6, 1])]

        fire = SCNParticleSystem()
        fire.particleImage = Tex.glow
        fire.loops = false
        fire.emissionDuration = 0.06
        fire.birthRate = 34
        fire.particleLifeSpan = 0.5
        fire.particleLifeSpanVariation = 0.25
        fire.particleVelocity = 3.5
        fire.particleVelocityVariation = 3
        fire.spreadingAngle = 180
        fire.particleSize = 1.0
        fire.particleSizeVariation = 0.6
        fire.blendMode = .additive
        fire.isLightingEnabled = false
        fire.particleColor = color(1.0, 0.55, 0.18)
        fire.particleColorVariation = SCNVector4(0.04, 0.1, 0.1, 0)
        fire.dampingFactor = 2.5
        fire.propertyControllers = [.opacity: fadeAnim([0.9, 0.7, 0], [0, 0.35, 1]), .size: fadeAnim([0.5, 1.5, 2.0], [0, 0.4, 1])]

        smoke = SCNParticleSystem()
        smoke.particleImage = Tex.smoke
        smoke.loops = false
        smoke.emissionDuration = 0.1
        smoke.birthRate = 14
        smoke.particleLifeSpan = 1.6
        smoke.particleLifeSpanVariation = 0.6
        smoke.particleVelocity = 1.6
        smoke.particleVelocityVariation = 1.2
        smoke.spreadingAngle = 180
        smoke.particleSize = 1.3
        smoke.particleSizeVariation = 0.6
        smoke.particleAngleVariation = 180
        smoke.particleAngularVelocityVariation = 40
        smoke.acceleration = SCNVector3(0, 0.9, 0)
        smoke.dampingFactor = 1.2
        smoke.blendMode = .alpha
        smoke.isLightingEnabled = false
        smoke.particleColor = color(0.12, 0.13, 0.15, 0.7)
        smoke.propertyControllers = [.opacity: fadeAnim([0, 0.6, 0], [0, 0.2, 1]), .size: fadeAnim([0.8, 2.2, 3.2], [0, 0.5, 1])]

        embers = SCNParticleSystem()
        embers.particleImage = Tex.softDot
        embers.loops = false
        embers.emissionDuration = 0.05
        embers.birthRate = 60
        embers.particleLifeSpan = 0.9
        embers.particleLifeSpanVariation = 0.5
        embers.particleVelocity = 12
        embers.particleVelocityVariation = 8
        embers.spreadingAngle = 180
        embers.particleSize = 0.05
        embers.particleSizeVariation = 0.03
        embers.stretchFactor = 0.05
        embers.isAffectedByGravity = true
        embers.dampingFactor = 0.8
        embers.blendMode = .additive
        embers.isLightingEnabled = false
        embers.particleColor = color(1.0, 0.7, 0.3)
        embers.propertyControllers = [.opacity: fadeAnim([1, 1, 0], [0, 0.5, 1])]

        shards = SCNParticleSystem()
        shards.particleImage = Tex.softDot
        shards.loops = false
        shards.emissionDuration = 0.05
        shards.birthRate = 40
        shards.particleLifeSpan = 0.55
        shards.particleLifeSpanVariation = 0.3
        shards.particleVelocity = 5
        shards.particleVelocityVariation = 4
        shards.spreadingAngle = 180
        shards.particleSize = 0.09
        shards.particleSizeVariation = 0.06
        shards.dampingFactor = 3
        shards.blendMode = .additive
        shards.isLightingEnabled = false
        shards.propertyControllers = [.opacity: fadeAnim([1, 0.8, 0], [0, 0.5, 1])]
    }

    func update(_ dt: Float) {
        trauma = max(0, trauma - dt * 1.6)
        for i in lights.indices where lights[i].t < lights[i].dur {
            lights[i].t += dt
            let k = max(0, 1 - lights[i].t / lights[i].dur)
            lights[i].node.light?.intensity = CGFloat(lights[i].peak * k * k)
        }
    }

    func shake(_ amount: Float) { trauma = min(1, trauma + amount) }

    func flash(at p: V3, _ c: V3, intensity: Float, duration: Float, range: Float = 16) {
        lightIdx = (lightIdx + 1) % lights.count
        let l = lights[lightIdx]
        l.node.simdPosition = p
        l.node.light?.color = color(c)
        l.node.light?.intensity = CGFloat(intensity)
        l.node.light?.attenuationEndDistance = CGFloat(range)
        lights[lightIdx].t = 0; lights[lightIdx].dur = duration; lights[lightIdx].peak = intensity
    }

    private func beamMat(_ c: V3, _ intensity: Float, glow: Bool = false) -> SCNMaterial {
        let key = "\(c.x),\(c.y),\(c.z),\(intensity),\(glow)"
        if let m = beamMats[key] { return m }
        let m = Mat.additive(glow ? Tex.glow : nil, c, intensity)
        beamMats[key] = m
        return m
    }

    /// Fading streak between two points.
    func tracer(from a: V3, to b: V3, _ c: V3, width: Float = 0.025, life: Double = 0.08, intensity: Float = 2.5) {
        let v = b - a
        let l = simd_length(v)
        if l < 0.05 { return }
        let n = SCNNode(geometry: unitBox.copy() as? SCNGeometry)
        n.geometry?.materials = [beamMat(c, intensity)]
        n.simdPosition = (a + b) * 0.5
        orientZ(n, to: v / l)
        n.simdScale = V3(width, width, l)
        n.castsShadow = false
        root.addChildNode(n)
        n.runAction(.sequence([.fadeOut(duration: life), .removeFromParentNode()]))
    }

    func railBeam(from a: V3, to b: V3, _ c: V3) {
        tracer(from: a, to: b, V3(1, 1, 1), width: 0.035, life: 0.35, intensity: 4)
        tracer(from: a, to: b, c, width: 0.085, life: 0.5, intensity: 2.0)
        let v = b - a
        let l = simd_length(v)
        let steps = min(Int(l / 2.2), 26)
        if steps > 0 {
            for i in 1...steps {
                let p = a + v * (Float(i) / Float(steps + 1))
                let r = Geo.glowSprite(0.7, c, 1.6, image: Tex.ring)
                r.constraints = nil
                orientZ(r, to: v / l)
                r.simdPosition = p
                root.addChildNode(r)
                let grow = SCNAction.scale(to: 2.4, duration: 0.5)
                grow.timingMode = .easeOut
                r.runAction(.sequence([.wait(duration: Double(i) * 0.008), .group([grow, .fadeOut(duration: 0.5)]), .removeFromParentNode()]))
            }
        }
    }

    func glowPop(at p: V3, _ c: V3, size: Float, intensity: Float = 1.5, life: Double = 0.18, image: CGImage? = nil) {
        let s = Geo.glowSprite(size, c, intensity, image: image)
        s.simdPosition = p
        root.addChildNode(s)
        let grow = SCNAction.scale(to: 1.8, duration: life)
        grow.timingMode = .easeOut
        s.runAction(.sequence([.group([grow, .fadeOut(duration: life)]), .removeFromParentNode()]))
    }

    /// Bullet impact on level geometry.
    func impact(at p: V3, normal n: V3, _ c: V3, big: Bool = false) {
        let s = sparks.copy() as! SCNParticleSystem
        s.particleColor = color(mix3(c, V3(1, 0.85, 0.6), 0.5))
        if big { s.birthRate = 40; s.particleVelocity = 10 }
        scene.addParticleSystem(s, transform: transformY(to: n, at: p + n * 0.03))
        glowPop(at: p + n * 0.06, c, size: big ? 1.4 : 0.55, intensity: 1.6, life: 0.12)
        // glowing scorch that cools down
        let d = Geo.plane(big ? 0.9 : 0.32, big ? 0.9 : 0.32)
        d.materials = [beamMat(mix3(c, V3(1.0, 0.45, 0.1), 0.6), 1.2, glow: true)]
        let dn = SCNNode(geometry: d)
        dn.simdPosition = p + n * 0.012
        orientZ(dn, to: n)
        dn.castsShadow = false
        root.addChildNode(dn)
        dn.runAction(.sequence([.fadeOut(duration: big ? 2.2 : 1.2), .removeFromParentNode()]))
    }

    /// Sparks when an enemy is hit.
    func hitSparks(at p: V3, dir: V3, _ c: V3, crit: Bool) {
        let s = shards.copy() as! SCNParticleSystem
        s.particleColor = color(crit ? V3(1, 0.9, 0.5) : c)
        s.birthRate = crit ? 22 : 9
        scene.addParticleSystem(s, transform: transformY(to: -dir, at: p))
        if crit { glowPop(at: p, V3(1, 0.9, 0.6), size: 0.8, intensity: 1.5, life: 0.12) }
    }

    func explosion(at p: V3, radius: Float, _ c: V3, shakeAmount: Float = 0.5) {
        let m = SCNMatrix4MakeTranslation(CGFloat(p.x), CGFloat(p.y), CGFloat(p.z))
        let f = fire.copy() as! SCNParticleSystem
        f.particleColor = color(c)
        f.particleSize = CGFloat(radius * 0.38)
        f.particleVelocity = CGFloat(radius * 1.3)
        scene.addParticleSystem(f, transform: m)
        let e = embers.copy() as! SCNParticleSystem
        e.particleColor = color(mix3(c, V3(1, 0.9, 0.7), 0.4))
        e.particleVelocity = CGFloat(6 + radius * 2.4)
        scene.addParticleSystem(e, transform: m)
        let s = smoke.copy() as! SCNParticleSystem
        s.particleSize = CGFloat(radius * 0.45)
        scene.addParticleSystem(s, transform: m)
        glowPop(at: p, mix3(c, V3(1, 1, 1), 0.5), size: radius * 2.4, intensity: 2.2, life: 0.22)
        // ground shockwave
        let ring = Geo.plane(1, 1)
        ring.materials = [Mat.additive(Tex.ring, c, 1.6)]
        let rn = SCNNode(geometry: ring)
        rn.simdEulerAngles = V3(-.pi / 2, 0, 0)
        rn.simdPosition = V3(p.x, max(p.y - radius * 0.3, 0.06), p.z)
        rn.castsShadow = false
        rn.renderingOrder = 30
        root.addChildNode(rn)
        let grow = SCNAction.scale(to: CGFloat(radius * 3.4), duration: 0.45)
        grow.timingMode = .easeOut
        rn.runAction(.sequence([.group([grow, .fadeOut(duration: 0.45)]), .removeFromParentNode()]))
        flash(at: p + V3(0, 0.6, 0), c, intensity: min(1600 * radius, 7000), duration: 0.45, range: 8 + radius * 4)
        shake(shakeAmount)
    }

    /// Flying chunks with physics.
    func debris(at p: V3, count: Int, material: SCNMaterial, size: Float, force: Float) {
        if debrisCount > 70 { return }
        for _ in 0..<count {
            let s = size * frand(0.5, 1.3)
            let g = Geo.box(s, s * frand(0.4, 1), s * frand(0.5, 1.2), chamfer: s * 0.1)
            g.materials = [material]
            let n = SCNNode(geometry: g)
            n.simdPosition = p + randUnit() * size
            let body = SCNPhysicsBody(type: .dynamic, shape: SCNPhysicsShape(geometry: Geo.box(s, s, s), options: nil))
            body.mass = 1
            body.restitution = 0.35
            body.friction = 0.8
            var v = randUnit() * force * frand(0.4, 1)
            v.y = abs(v.y) * 0.8 + force * 0.35
            body.velocity = SCNVector3(v)
            let av = randUnit()
            body.angularVelocity = SCNVector4(CGFloat(av.x), CGFloat(av.y), CGFloat(av.z), CGFloat(frand(4, 14)))
            n.physicsBody = body
            root.addChildNode(n)
            debrisCount += 1
            n.runAction(.sequence([.wait(duration: Double(frand(1.8, 3.0))), .scale(to: 0.01, duration: 0.35), .removeFromParentNode()])) { [weak self] in
                self?.debrisCount -= 1
            }
        }
    }

    func spawnFlash(at p: V3, _ c: V3) {
        glowPop(at: p + V3(0, 1, 0), c, size: 3.5, intensity: 1.6, life: 0.35)
        let ring = Geo.plane(1, 1)
        ring.materials = [Mat.additive(Tex.ring, c, 1.4)]
        let rn = SCNNode(geometry: ring)
        rn.simdEulerAngles = V3(-.pi / 2, 0, 0)
        rn.simdPosition = V3(p.x, p.y + 0.06, p.z)
        rn.simdScale = V3(4, 4, 4)
        rn.castsShadow = false
        root.addChildNode(rn)
        rn.runAction(.sequence([.group([.scale(to: 0.3, duration: 0.35), .fadeOut(duration: 0.4)]), .removeFromParentNode()]))
    }

    func clear() {
        for c in root.childNodes where c.light == nil { c.removeAllActions(); c.removeFromParentNode() }
        debrisCount = 0
    }
}
