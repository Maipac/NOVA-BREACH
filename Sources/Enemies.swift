import SceneKit
import simd

enum EnemyKind: Int, CaseIterable {
    case skitter, drone, trooper, roller, brute, boss

    var displayName: String {
        switch self {
        case .skitter: return "SKITTER"
        case .drone: return "DROHNE"
        case .trooper: return "TROOPER"
        case .roller: return "ROLLMINE"
        case .brute: return "KOLOSS"
        case .boss: return "OVERSEER"
        }
    }
    var hp: Float { [38, 30, 95, 45, 420, 2600][rawValue] }
    var speed: Float { [6.6, 6.0, 3.6, 8.6, 2.3, 3.0][rawValue] }
    var radius: Float { [0.6, 0.6, 0.45, 0.6, 1.0, 2.3][rawValue] }
    var height: Float { [0.9, 1.0, 1.95, 1.1, 3.1, 4.0][rawValue] }
    var score: Int { [50, 75, 150, 100, 500, 5000][rawValue] }
    var cost: Float { [1, 1.5, 3, 2, 9, 0][rawValue] }
    var flies: Bool { self == .drone || self == .boss }
    var glow: V3 {
        switch self {
        case .skitter: return V3(1.0, 0.2, 0.1)
        case .drone: return V3(1.0, 0.55, 0.1)
        case .trooper: return V3(1.0, 0.15, 0.4)
        case .roller: return V3(1.0, 0.8, 0.1)
        case .brute: return V3(1.0, 0.32, 0.05)
        case .boss: return V3(1.0, 0.1, 0.18)
        }
    }
}

struct HitSphere { var offset: V3; var r: Float; var crit: Bool }

final class Enemy {
    let kind: EnemyKind
    let node = SCNNode()
    let model = SCNNode()
    var pos: V3
    var vel = V3(0, 0, 0)
    var yaw: Float = 0
    var hp: Float
    let maxHp: Float
    let radius: Float
    let height: Float
    var speed: Float
    var attackCD: Float = frand(0.8, 2.0)
    var burst = 0
    var burstT: Float = 0
    var flash: Float = 0
    var anim: Float = frand(0, 10)
    var strafe: Float = frand() < 0.5 ? -1 : 1
    var strafeT: Float = frand(1.5, 4)
    var spawnT: Float = 0.45
    var dead = false
    var state = 0
    var stateT: Float = 0
    var sees = false
    var losT: Float = frand(0, 0.2)
    var side = 0
    var armor: [SCNMaterial] = []
    var legs: [SCNNode] = []
    var spinners: [SCNNode] = []
    var hits: [HitSphere] = []
    var muzzles: [V3] = []
    var debrisMat: SCNMaterial

    var forward: V3 { V3(sin(yaw), 0, cos(yaw)) }
    var right: V3 { V3(cos(yaw), 0, -sin(yaw)) }
    /// local (right, up, forward) offset to world space
    func world(_ o: V3) -> V3 { pos + right * o.x + V3(0, o.y, 0) + forward * o.z }
    var center: V3 { pos + V3(0, kind.flies ? 0 : height * 0.55, 0) }

    init(kind: EnemyKind, pos: V3, hpScale: Float) {
        self.kind = kind
        self.pos = pos
        maxHp = kind.hp * hpScale
        hp = maxHp
        radius = kind.radius
        height = kind.height
        speed = kind.speed * frand(0.92, 1.08)
        debrisMat = Mat.metal(V3(0.16, 0.16, 0.18), rough: 0.4)
        node.addChildNode(model)
        build()
        node.simdPosition = pos
        node.simdScale = V3(0.01, 0.01, 0.01)
    }

    private func armorMat(_ c: V3, rough: Float = 0.38) -> SCNMaterial {
        let m = Mat.metal(c, rough: rough, plating: 1)
        m.normal.intensity = 0.45
        armor.append(m)
        return m
    }

    private func build() {
        let dark = armorMat(V3(0.075, 0.078, 0.09), rough: 0.3)
        let glowC = kind.glow
        let glow = Mat.glow(glowC, 5)
        switch kind {
        case .skitter:
            let paint = armorMat(V3(0.20, 0.035, 0.03), rough: 0.34)
            let body = Geo.part(model, Geo.sphere(0.5, segments: 20), paint, V3(0, 0.48, 0))
            body.simdScale = V3(0.95, 0.5, 1.3)
            let head = Geo.part(model, Geo.sphere(0.3, segments: 16), dark, V3(0, 0.46, 0.6))
            head.simdScale = V3(1, 0.7, 1)
            Geo.part(model, Geo.box(0.36, 0.07, 0.1), glow, V3(0, 0.5, 0.86), shadow: false)
            Geo.part(model, Geo.box(0.06, 0.05, 0.9), glow, V3(0, 0.74, -0.05), shadow: false)
            Geo.part(model, Geo.pyramid(0.16, 0.5, 0.16), dark, V3(0.14, 0.4, 0.82), rot: V3(.pi / 2, 0, 0))
            Geo.part(model, Geo.pyramid(0.16, 0.5, 0.16), dark, V3(-0.14, 0.4, 0.82), rot: V3(.pi / 2, 0, 0))
            for (i, z) in [Float(0.4), 0.0, -0.4].enumerated() {
                for sd in [Float(-1), 1] {
                    let pivot = SCNNode()
                    pivot.simdPosition = V3(sd * 0.36, 0.5, z)
                    model.addChildNode(pivot)
                    Geo.part(pivot, Geo.box(0.55, 0.08, 0.09), dark, V3(sd * 0.25, 0.14, 0), rot: V3(0, 0, sd * 0.55))
                    Geo.part(pivot, Geo.box(0.07, 0.72, 0.07), dark, V3(sd * 0.56, -0.1, 0), rot: V3(0, 0, sd * 0.22))
                    pivot.name = "\(i)"
                    legs.append(pivot)
                }
            }
            hits = [HitSphere(offset: V3(0, 0.5, 0), r: 0.68, crit: false)]
            let g = Geo.glowSprite(1.6, glowC, 0.35); g.simdPosition = V3(0, 0.5, 0.5); model.addChildNode(g)
        case .drone:
            let paint = armorMat(V3(0.24, 0.13, 0.03), rough: 0.32)
            Geo.part(model, Geo.sphere(0.42), dark, V3(0, 0, 0))
            Geo.part(model, Geo.sphere(0.17, segments: 16), glow, V3(0, 0.02, 0.33), shadow: false)
            let ringHolder = SCNNode(); model.addChildNode(ringHolder)
            Geo.part(ringHolder, Geo.torus(0.68, 0.055), paint, V3(0, 0, 0))
            for a in 0..<3 {
                let ang = Float(a) / 3 * 2 * .pi
                Geo.part(ringHolder, Geo.box(0.12, 0.05, 0.32), glow, V3(sin(ang) * 0.68, 0, cos(ang) * 0.68), rot: V3(0, ang, 0), shadow: false)
            }
            spinners.append(ringHolder)
            for sd in [Float(-1), 1] {
                Geo.part(model, Geo.box(0.16, 0.16, 0.6, chamfer: 0.04), paint, V3(sd * 0.52, -0.05, -0.05))
                Geo.part(model, Geo.cyl(0.05, 0.06, segments: 10), Mat.glow(V3(0.3, 0.8, 1), 5), V3(sd * 0.52, -0.05, -0.37), rot: V3(.pi / 2, 0, 0), shadow: false)
            }
            Geo.part(model, Geo.cyl(0.05, 0.45, segments: 10), dark, V3(0, -0.3, 0.3), rot: V3(.pi / 2, 0, 0))
            let g = Geo.glowSprite(1.5, glowC, 0.4); g.simdPosition = V3(0, 0, 0.35); model.addChildNode(g)
            hits = [HitSphere(offset: V3(0, 0, 0), r: 0.7, crit: false)]
            muzzles = [V3(0, -0.3, 0.55)]
        case .trooper:
            let paint = armorMat(V3(0.17, 0.03, 0.07), rough: 0.32)
            for sd in [Float(-1), 1] {
                let hip = SCNNode(); hip.simdPosition = V3(sd * 0.17, 0.98, 0); model.addChildNode(hip)
                Geo.part(hip, Geo.capsule(0.105, 0.55), dark, V3(0, -0.25, 0))
                let knee = SCNNode(); knee.simdPosition = V3(0, -0.5, 0); hip.addChildNode(knee)
                Geo.part(knee, Geo.capsule(0.085, 0.52), paint, V3(0, -0.22, 0))
                Geo.part(knee, Geo.box(0.15, 0.09, 0.3, chamfer: 0.02), dark, V3(0, -0.45, 0.06))
                legs.append(hip); legs.append(knee)
                Geo.part(model, Geo.sphere(0.16, segments: 14), paint, V3(sd * 0.37, 1.62, 0))
                Geo.part(model, Geo.capsule(0.075, 0.6), dark, V3(sd * 0.36, 1.38, 0.22), rot: V3(1.15, 0, 0))
            }
            Geo.part(model, Geo.box(0.42, 0.2, 0.28, chamfer: 0.04), dark, V3(0, 1.02, 0))
            Geo.part(model, Geo.box(0.58, 0.56, 0.36, chamfer: 0.07), paint, V3(0, 1.4, 0))
            Geo.part(model, Geo.box(0.22, 0.05, 0.03), glow, V3(0, 1.5, 0.185), shadow: false)
            Geo.part(model, Geo.box(0.3, 0.42, 0.14, chamfer: 0.03), dark, V3(0, 1.42, -0.22))
            let head = Geo.part(model, Geo.sphere(0.175, segments: 16), dark, V3(0, 1.84, 0.02))
            head.simdScale = V3(1, 1.1, 1.1)
            Geo.part(model, Geo.box(0.26, 0.065, 0.12), glow, V3(0, 1.86, 0.13), shadow: false)
            Geo.part(model, Geo.box(0.09, 0.13, 0.8, chamfer: 0.02), dark, V3(0.2, 1.28, 0.55))
            Geo.part(model, Geo.box(0.05, 0.05, 0.3), glow, V3(0.2, 1.36, 0.6), shadow: false)
            let g = Geo.glowSprite(0.9, glowC, 0.4); g.simdPosition = V3(0, 1.86, 0.2); model.addChildNode(g)
            hits = [HitSphere(offset: V3(0, 0.55, 0), r: 0.42, crit: false), HitSphere(offset: V3(0, 1.2, 0), r: 0.5, crit: false),
                    HitSphere(offset: V3(0, 1.84, 0), r: 0.26, crit: true)]
            muzzles = [V3(0.2, 1.3, 1.0)]
        case .roller:
            let ball = SCNNode(); ball.simdPosition = V3(0, 0.55, 0); model.addChildNode(ball)
            Geo.part(ball, Geo.sphere(0.55), dark, V3(0, 0, 0))
            Geo.part(ball, Geo.torus(0.555, 0.04), glow, V3(0, 0, 0), shadow: false)
            Geo.part(ball, Geo.torus(0.555, 0.04), glow, V3(0, 0, 0), rot: V3(0, 0, .pi / 2), shadow: false)
            Geo.part(ball, Geo.torus(0.555, 0.04), glow, V3(0, 0, 0), rot: V3(.pi / 2, 0, 0), shadow: false)
            for a in 0..<6 {
                let d = [V3(1, 0, 0), V3(-1, 0, 0), V3(0, 1, 0), V3(0, -1, 0), V3(0, 0, 1), V3(0, 0, -1)][a]
                let sp = Geo.part(ball, Geo.cone(0, 0.09, 0.3, segments: 8), dark, d * 0.62)
                orientZ(sp, to: d); sp.simdOrientation = sp.simdOrientation * simd_quatf(angle: .pi / 2, axis: V3(1, 0, 0))
            }
            spinners.append(ball)
            let g = Geo.glowSprite(2.2, glowC, 0.5); g.simdPosition = V3(0, 0.55, 0); g.name = "blink"; model.addChildNode(g)
            hits = [HitSphere(offset: V3(0, 0.55, 0), r: 0.66, crit: false)]
        case .brute:
            let paint = armorMat(V3(0.20, 0.07, 0.025), rough: 0.34)
            for sd in [Float(-1), 1] {
                let hip = SCNNode(); hip.simdPosition = V3(sd * 0.5, 1.3, 0); model.addChildNode(hip)
                Geo.part(hip, Geo.capsule(0.3, 1.3), dark, V3(0, -0.6, 0))
                Geo.part(hip, Geo.box(0.5, 0.5, 0.62, chamfer: 0.12), paint, V3(0, -0.45, 0.06))
                Geo.part(hip, Geo.box(0.56, 0.3, 0.75, chamfer: 0.06), paint, V3(0, -1.15, 0.08))
                legs.append(hip)
                Geo.part(model, Geo.sphere(0.52, segments: 20), paint, V3(sd * 1.18, 2.55, 0)).simdScale = V3(1, 0.85, 1.15)
                Geo.part(model, Geo.capsule(0.22, 1.15), dark, V3(sd * 1.25, 1.75, 0.1))
                Geo.part(model, Geo.sphere(0.3, segments: 14), paint, V3(sd * 1.25, 1.18, 0.12))
                Geo.part(model, Geo.cyl(0.17, 1.1, segments: 14), dark, V3(sd * 1.18, 2.95, 0.4), rot: V3(.pi / 2, 0, 0))
                Geo.part(model, Geo.cyl(0.12, 0.05, segments: 14), glow, V3(sd * 1.18, 2.95, 0.96), rot: V3(.pi / 2, 0, 0), shadow: false)
                muzzles.append(V3(sd * 1.18, 2.95, 1.1))
            }
            Geo.part(model, Geo.box(1.35, 0.42, 0.85, chamfer: 0.08), dark, V3(0, 1.35, 0))
            Geo.part(model, Geo.box(1.75, 1.25, 1.15, chamfer: 0.34), dark, V3(0, 2.15, 0))
            Geo.part(model, Geo.box(1.25, 0.42, 0.3, chamfer: 0.1), paint, V3(0, 2.5, 0.5))
            Geo.part(model, Geo.box(0.9, 0.3, 0.2, chamfer: 0.08), paint, V3(0, 1.62, 0.5))
            Geo.part(model, Geo.sphere(0.27, segments: 16), glow, V3(0, 2.0, 0.52), shadow: false)
            Geo.part(model, Geo.torus(0.34, 0.05), paint, V3(0, 2.0, 0.56), rot: V3(.pi / 2, 0, 0))
            Geo.part(model, Geo.box(0.42, 0.32, 0.42, chamfer: 0.06), dark, V3(0, 2.92, 0.2))
            Geo.part(model, Geo.box(0.3, 0.07, 0.05), glow, V3(0, 2.94, 0.42), shadow: false)
            let g = Geo.glowSprite(2.2, glowC, 0.45); g.simdPosition = V3(0, 2.0, 0.7); model.addChildNode(g)
            hits = [HitSphere(offset: V3(0, 0.8, 0), r: 0.8, crit: false), HitSphere(offset: V3(0, 2.1, 0), r: 1.15, crit: false),
                    HitSphere(offset: V3(0, 2.0, 0.6), r: 0.4, crit: true), HitSphere(offset: V3(0, 2.92, 0.2), r: 0.3, crit: true)]
        case .boss:
            let paint = armorMat(V3(0.16, 0.02, 0.04), rough: 0.3)
            Geo.part(model, Geo.sphere(1.8, segments: 36), dark, V3(0, 0, 0))
            Geo.part(model, Geo.sphere(0.72, segments: 24), glow, V3(0, 0, 1.38), shadow: false)
            Geo.part(model, Geo.torus(0.85, 0.12), paint, V3(0, 0, 1.55), rot: V3(.pi / 2, 0, 0))
            Geo.part(model, Geo.sphere(0.25, segments: 12), Mat.glow(V3(1, 0.9, 0.7), 8), V3(0, 0, 2.02), shadow: false)
            for (i, r) in [Float(2.7), 3.2, 3.7].enumerated() {
                let h = SCNNode(); model.addChildNode(h)
                Geo.part(h, Geo.torus(r, 0.11), paint, V3(0, 0, 0))
                Geo.part(h, Geo.torus(r, 0.045), glow, V3(0, 0.13, 0), shadow: false)
                h.simdEulerAngles = V3(Float(i) * 0.5 + 0.2, 0, Float(i) * 0.4)
                spinners.append(h)
            }
            for a in 0..<4 {
                let ang = Float(a) / 4 * 2 * .pi + .pi / 4
                let fin = Geo.part(model, Geo.box(0.22, 2.6, 1.2, chamfer: 0.1), dark, V3(sin(ang) * 1.9, 0.3, cos(ang) * 1.9), rot: V3(0, ang, 0))
                fin.simdEulerAngles = V3(0, ang, 0.0)
                Geo.part(model, Geo.box(0.08, 2.2, 0.08), glow, V3(sin(ang) * 2.06, 0.3, cos(ang) * 2.06), shadow: false)
            }
            Geo.part(model, Geo.cone(0.2, 1.3, 1.6), dark, V3(0, -2.2, 0))
            Geo.part(model, Geo.cyl(1.0, 0.08), glow, V3(0, -3.0, 0), shadow: false)
            Geo.part(model, Geo.cone(0.0, 0.5, 1.8, segments: 12), dark, V3(0, 2.4, 0))
            let g = Geo.glowSprite(7, glowC, 0.5); g.simdPosition = V3(0, 0, 1.6); model.addChildNode(g)
            let g2 = Geo.glowSprite(5, V3(1, 0.4, 0.1), 0.5); g2.simdPosition = V3(0, -3.1, 0); model.addChildNode(g2)
            hits = [HitSphere(offset: V3(0, 0, 0), r: 2.0, crit: false), HitSphere(offset: V3(0, 0, 1.45), r: 0.85, crit: true)]
            muzzles = [V3(0, 0, 2.2), V3(1.6, -0.6, 1.4), V3(-1.6, -0.6, 1.4)]
        }
        debrisMat = armor.last ?? dark
    }

    func setFlash(_ on: Bool) {
        for m in armor {
            m.emission.contents = on ? NSColor.white : NSColor.black
            m.emission.intensity = on ? 1.6 : 0
        }
    }

    /// Ray against the hit spheres. Returns distance along the ray and whether it was a weak point.
    func rayHit(_ o: V3, _ d: V3, _ maxT: Float, inflate: Float = 0) -> (t: Float, crit: Bool)? {
        var body = Float.greatestFiniteMagnitude, weak = Float.greatestFiniteMagnitude
        for h in hits {
            let c = world(h.offset)
            let r = h.r + inflate
            let oc = o - c
            let b = simd_dot(oc, d)
            let cc = simd_dot(oc, oc) - r * r
            let disc = b * b - cc
            if disc < 0 { continue }
            var t = -b - sqrt(disc)
            if t < 0 { t = cc < 0 ? 0 : -1 }
            if t < 0 || t > maxT { continue }
            if h.crit { weak = min(weak, t) } else { body = min(body, t) }
        }
        // a weak point counts when the ray reaches it before (or just inside) the body shell
        if weak < Float.greatestFiniteMagnitude && weak <= body + 0.7 { return (min(weak, body), true) }
        if body < Float.greatestFiniteMagnitude { return (body, false) }
        return nil
    }
}
