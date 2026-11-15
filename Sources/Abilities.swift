import SceneKit
import AppKit
import simd

// The active ability on E (chosen in the Labor): Splittergranate, Geschützturm, Zeitlupe, Kraftfeld.

final class Turret {
    let node: SCNNode
    /// turns around Y; the gun is on `pitchNode` below it and tilts around X
    let yawNode: SCNNode
    let pitchNode: SCNNode
    let pos: V3
    var life: Float
    var age: Float = 0
    var yaw: Float
    var pitch: Float = 0
    var fireT: Float = 0.5
    var scanT: Float = 0
    weak var target: Enemy?
    init(node: SCNNode, yawNode: SCNNode, pitchNode: SCNNode, pos: V3, life: Float, yaw: Float) {
        self.node = node; self.yawNode = yawNode; self.pitchNode = pitchNode
        self.pos = pos; self.life = life; self.yaw = yaw
    }
    /// height of the gun's pivot above the floor
    static let gunY: Float = 0.95
}

final class Barrier {
    let node: SCNNode
    /// centre on the floor, the dome reaches `radius` in every direction
    let pos: V3
    let radius: Float
    let life: Float
    var t: Float = 0
    init(node: SCNNode, pos: V3, radius: Float, life: Float) { self.node = node; self.pos = pos; self.radius = radius; self.life = life }
}

extension Game {

    func updateAbility(_ dt: Float, _ inp: InputFrame) {
        abilityCD = max(0, abilityCD - dt)
        if inp.hit(Key.e) {
            if abilityCD <= 0 {
                useAbility()
            } else {
                audio.play("empty", vol: 0.6)
            }
        }
        if slowT > 0 {
            slowT -= dt
            if slowT <= 0 {
                slowT = 0
                audio.play("dash", vol: 0.7)
            }
        }
        // Zeitlupe drains the colour out of the world
        let sat: Float = slowT > 0 ? 0.3 : 1.12
        if abs(Float(camera.saturation) - sat) > 0.01 { camera.saturation = CGFloat(Float(camera.saturation) + (sat - Float(camera.saturation)) * min(1, dt * 6)) }
    }

    func useAbility() {
        let a = meta.ability
        abilityCD = abilityCooldown
        let c = a.color
        switch a {
        case .grenade:
            let k = 1 + 0.4 * Float(perk(.abilityPower))
            let d = viewDir
            let start = eye + d * 0.7 - rightV * 0.18 - V3(0, 0.12, 0)
            let g = spawnProjectile(pos: start, vel: d * 24 + V3(0, 4.5, 0) + V3(vel.x, 0, vel.z) * 0.5, damage: 150 * damageMul * k,
                                    splash: 6 * k.squareRoot(), fromPlayer: true, life: 4, radius: 0.16, color: c, gravity: 18, big: true)
            g.sub = true
            g.selfDamage = 0
            audio.play("launcher", vol: 0.6)
            kickRot = min(0.3, kickRot + 0.12)
        case .turret:
            placeTurret()
        case .slowmo:
            slowT = 5 * abilityPower
            hud.flash(color(c), 0.3, 0.6)
            hud.announce("ZEITLUPE", sub: "", color: color(c), hold: 0.6)
            audio.play("power", vol: 0.8)
        case .barrier:
            raiseBarrier()
        }
    }

    // MARK: Geschützturm

    func placeTurret() {
        var p = pos + fwd * 1.8
        p.y = level.groundHeight(p.x, p.z, radius: 0.3, feetY: pos.y + 0.6)
        level.resolve(&p, radius: 0.45, feetY: p.y, height: 1.3)
        // at most two at once: the oldest makes room
        if turrets.count >= 2 {
            let old = turrets.removeFirst()
            fx.explosion(at: old.pos + V3(0, 0.8, 0), radius: 1.4, AbilityID.turret.color, shakeAmount: 0.05)
            old.node.removeFromParentNode()
        }
        let t = buildTurret(at: p, yaw: yaw + .pi)
        scene.rootNode.addChildNode(t.node)
        turrets.append(t)
        fx.spawnFlash(at: p, AbilityID.turret.color)
        audio.play("spawn", at: p, listener: pos, yaw: yaw, vol: 1)
    }

    func buildTurret(at p: V3, yaw facing: Float) -> Turret {
        let c = AbilityID.turret.color
        let dark = Mat.metal(V3(0.12, 0.125, 0.14), rough: 0.32, plating: 2)
        let steel = Mat.metal(V3(0.4, 0.42, 0.46), rough: 0.25, plating: 2)
        let glow = Mat.glow(c, 5)
        let root = SCNNode()
        // tripod with the feet spread outward
        for k in 0..<3 {
            let a = Float(k) / 3 * 2 * .pi
            Geo.part(root, Geo.box(0.07, 0.8, 0.07, chamfer: 0.01), dark, V3(sin(a) * 0.3, 0.36, cos(a) * 0.3),
                     rot: V3(-0.45 * cos(a), 0, 0.45 * sin(a)))
            Geo.part(root, Geo.box(0.1, 0.04, 0.1), glow, V3(sin(a) * 0.46, 0.02, cos(a) * 0.46), shadow: false)
        }
        Geo.part(root, Geo.cyl(0.17, 0.22, segments: 18), dark, V3(0, 0.74, 0))
        Geo.part(root, Geo.torus(0.18, 0.02), glow, V3(0, 0.83, 0), shadow: false)
        let yawNode = SCNNode()
        yawNode.simdPosition = V3(0, Turret.gunY, 0)
        root.addChildNode(yawNode)
        let pitchNode = SCNNode()
        yawNode.addChildNode(pitchNode)
        Geo.part(pitchNode, Geo.box(0.34, 0.24, 0.46, chamfer: 0.04), dark, V3(0, 0, 0))
        Geo.part(pitchNode, Geo.box(0.36, 0.04, 0.3), glow, V3(0, 0.07, -0.02), shadow: false)
        for sx in [Float(-0.08), 0.08] {
            Geo.part(pitchNode, Geo.cyl(0.035, 0.5, segments: 12), steel, V3(sx, -0.02, 0.44), rot: V3(.pi / 2, 0, 0))
            Geo.part(pitchNode, Geo.cyl(0.028, 0.01, segments: 12), glow, V3(sx, -0.02, 0.69), rot: V3(.pi / 2, 0, 0), shadow: false)
        }
        Geo.part(pitchNode, Geo.sphere(0.05, segments: 10), glow, V3(0, 0.1, 0.2), shadow: false)
        let halo = Geo.glowSprite(1.4, c, 0.45)
        halo.simdPosition = V3(0, Turret.gunY, 0)
        root.addChildNode(halo)
        root.simdPosition = p
        root.simdScale = V3(0.01, 0.01, 0.01)
        let life: Float = 14 * abilityPower
        return Turret(node: root, yawNode: yawNode, pitchNode: pitchNode, pos: p, life: life, yaw: facing)
    }

    func updateTurrets(_ dt: Float) {
        guard !turrets.isEmpty else { return }
        let c = AbilityID.turret.color
        let rate: Float = 1 + 0.3 * Float(perk(.abilityPower))
        var i = 0
        while i < turrets.count {
            let t = turrets[i]
            t.life -= dt
            t.age += dt
            if t.life <= 0 {
                fx.explosion(at: t.pos + V3(0, 0.8, 0), radius: 1.6, c, shakeAmount: 0.08)
                audio.play("enemyDie", at: t.pos, listener: pos, yaw: yaw, vol: 0.7)
                t.node.removeFromParentNode()
                turrets.remove(at: i)
                continue
            }
            let k = min(1, t.age / 0.3)
            let s = max(0.01, k * k * (3 - 2 * k))
            t.node.simdScale = V3(s, s, s)
            // blink in the last two seconds
            t.node.opacity = t.life < 2 ? CGFloat(0.55 + 0.45 * abs(sin(t.life * 9))) : 1
            let gun = t.pos + V3(0, Turret.gunY, 0)
            t.scanT -= dt
            if t.scanT <= 0 {
                t.scanT = 0.25
                t.target = nil
                var bd: Float = 34
                for e in enemies where !e.dead && e.spawnT <= 0 {
                    let d = simd_distance(e.center, gun)
                    if d < bd && level.lineOfSight(gun, e.center) { bd = d; t.target = e }
                }
            }
            t.fireT -= dt
            if let e = t.target, !e.dead {
                let to = e.center - gun
                let wantYaw = atan2(to.x, to.z)
                let wantPitch = -atan2(to.y, max(len2(to), 0.1))
                t.yaw += wrapAngle(wantYaw - t.yaw) * min(1, dt * 12)
                t.pitch += (wantPitch - t.pitch) * min(1, dt * 12)
                if t.fireT <= 0 && abs(wrapAngle(wantYaw - t.yaw)) < 0.25 && k >= 1 {
                    t.fireT = 0.16 / rate
                    turretShot(t, at: e, color: c)
                }
            } else {
                t.yaw += dt * 0.9
                t.pitch += (0 - t.pitch) * min(1, dt * 4)
            }
            t.yawNode.simdEulerAngles = V3(0, t.yaw, 0)
            t.pitchNode.simdEulerAngles = V3(t.pitch, 0, 0)
            i += 1
        }
    }

    private func turretShot(_ t: Turret, at e: Enemy, color c: V3) {
        let gun = t.pos + V3(0, Turret.gunY, 0)
        let f = V3(sin(t.yaw) * cos(t.pitch), -sin(t.pitch), cos(t.yaw) * cos(t.pitch))
        let muzzle = gun + f * 0.66
        let d = safeNorm(e.center + randUnit() * 0.25 - muzzle)
        // the first thing along the line takes the hit
        let wall = level.raycast(muzzle, d, 40)
        var bt = wall?.t ?? 40
        var hitE: Enemy? = nil
        var crit = false
        for x in enemies where !x.dead {
            if let h = x.rayHit(muzzle, d, bt) { bt = h.t; hitE = x; crit = h.crit }
        }
        let end = muzzle + d * bt
        fx.tracer(from: muzzle, to: end, c, width: 0.02, life: 0.06, intensity: 2.4)
        fx.glowPop(at: muzzle, c, size: 0.6, intensity: 1.6, life: 0.06)
        if let x = hitE {
            fx.hitSparks(at: end, dir: d, x.kind.glow, crit: crit)
            damageEnemy(x, 9 * damageMul * (crit ? 2 : 1), at: end, dir: d, crit: crit, silent: true)
        } else if let wl = wall {
            fx.impact(at: end, normal: wl.n, c)
        }
        audio.play("rifle", at: muzzle, listener: pos, yaw: yaw, vol: 0.32)
    }

    // MARK: Kraftfeld

    func raiseBarrier() {
        let c = AbilityID.barrier.color
        let r: Float = 4.5 * (1 + 0.25 * Float(perk(.abilityPower)))
        barrier?.node.removeFromParentNode()
        let n = SCNNode()
        let dome = Geo.sphere(r, segments: 48)
        dome.materials = [Mat.additive(Tex.hex, c, 0.42)]
        let dn = SCNNode(geometry: dome)
        dn.castsShadow = false
        dn.renderingOrder = 40
        n.addChildNode(dn)
        let ring = Geo.plane(r * 2.3, r * 2.3)
        ring.materials = [Mat.additive(Tex.ring, c, 1.2)]
        let rn = SCNNode(geometry: ring)
        rn.simdEulerAngles = V3(-.pi / 2, 0, 0)
        rn.simdPosition = V3(0, 0.05, 0)
        rn.castsShadow = false
        n.addChildNode(rn)
        let p = V3(pos.x, pos.y, pos.z)
        n.simdPosition = p
        n.simdScale = V3(0.01, 0.01, 0.01)
        scene.rootNode.addChildNode(n)
        barrier = Barrier(node: n, pos: p, radius: r, life: 6 * abilityPower)
        fx.spawnFlash(at: p, c)
        hud.flash(color(c), 0.2, 0.4)
        audio.play("power", vol: 0.7)
    }

    func updateBarrier(_ dt: Float) {
        guard let b = barrier else { return }
        b.t += dt
        if b.t >= b.life {
            b.node.removeFromParentNode()
            barrier = nil
            audio.play("shieldHit", vol: 0.6)
            return
        }
        let grow = min(1, b.t / 0.25)
        let s = max(0.01, grow * grow * (3 - 2 * grow))
        b.node.simdScale = V3(s, s, s)
        let left = b.life - b.t
        // gentle shimmer, flickers before it collapses
        let flicker: Float = left < 1.2 ? 0.5 + 0.5 * abs(sin(left * 14)) : 1
        b.node.opacity = CGFloat((0.8 + 0.2 * sin(b.t * 5)) * flicker)
    }

    // MARK: shared

    /// Takes down everything the ability left in the world (new run, back to the menu).
    func resetAbilityEffects() {
        for t in turrets { t.node.removeFromParentNode() }
        turrets.removeAll()
        barrier?.node.removeFromParentNode()
        barrier = nil
        slowT = 0
        camera.saturation = 1.12
    }

    func updateAbilityHUD() {
        let a = meta.ability
        let maxCD = max(abilityCooldown, 0.01)
        var status = abilityCD <= 0 ? "BEREIT" : "\(Int(abilityCD.rounded(.up))) s"
        switch a {
        case .slowmo where slowT > 0:
            status = "AKTIV  \(Int(slowT.rounded(.up))) s"
        case .barrier:
            if let b = barrier { status = "AKTIV  \(Int((b.life - b.t).rounded(.up))) s" }
        case .turret:
            if let t = turrets.last, abilityCD > 0 { status = "TURM \(Int(t.life.rounded(.up))) s  ·  \(Int(abilityCD.rounded(.up))) s" }
        default:
            break
        }
        hud.setAbility(name: a.name, charge: 1 - abilityCD / maxCD, status: status, color: a.color)
    }
}
