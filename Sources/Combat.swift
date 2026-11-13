import SceneKit
import AppKit
import simd

extension Game {

    // MARK: - weapon models

    func buildWeapons() {
        let dark = Mat.metal(V3(0.11, 0.115, 0.13), rough: 0.32, plating: 2)
        let steel = Mat.metal(V3(0.36, 0.38, 0.42), rough: 0.24, plating: 2)

        func finish(_ def: WeaponDef, _ n: SCNNode, muzzleAt: V3, flashSize: Float) {
            let muzzle = SCNNode(); muzzle.simdPosition = muzzleAt
            n.addChildNode(muzzle)
            let fl = Geo.plane(flashSize, flashSize)
            fl.materials = [Mat.additive(Tex.flare, mix3(def.color, V3(1, 1, 1), 0.35), 3.0, depthTest: false)]
            let flash = SCNNode(geometry: fl)
            flash.constraints = [SCNBillboardConstraint()]
            flash.isHidden = true
            muzzle.addChildNode(flash)
            // category 2: effect lights (muzzle flash, explosions) skip the view model so it never blows out
            n.enumerateHierarchy { c, _ in c.castsShadow = false; c.categoryBitMask = 2 }
            n.isHidden = true
            weaponHolder.addChildNode(n)
            weapons.append(Weapon(def, n, muzzle, flash))
        }

        // 1 – pulse rifle
        do {
            let c = V3(0.25, 0.9, 1.0)
            let def = WeaponDef(name: "PULSGEWEHR", short: "PULS", kind: .hitscan, damage: 13, pellets: 1, spread: 0.008, interval: 0.092,
                                mag: 40, reload: 1.25, color: c, kick: 0.035, sound: "rifle", reserveMax: -1, reserveStart: -1)
            let n = SCNNode(), glow = Mat.glow(c, 5)
            Geo.part(n, Geo.box(0.09, 0.14, 0.5, chamfer: 0.015), dark, V3(0, 0, 0))
            Geo.part(n, Geo.box(0.07, 0.05, 0.64, chamfer: 0.01), steel, V3(0, 0.09, -0.1))
            Geo.part(n, Geo.cyl(0.024, 0.42, segments: 14), steel, V3(0, 0.02, -0.46), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.box(0.078, 0.09, 0.3, chamfer: 0.02), dark, V3(0, 0.02, -0.36))
            Geo.part(n, Geo.box(0.094, 0.018, 0.3), glow, V3(0, 0.035, -0.04))
            Geo.part(n, Geo.box(0.082, 0.012, 0.2), glow, V3(0, 0.0, -0.36))
            Geo.part(n, Geo.box(0.06, 0.22, 0.1, chamfer: 0.01), steel, V3(0, -0.16, -0.03), rot: V3(0.16, 0, 0))
            Geo.part(n, Geo.box(0.06, 0.17, 0.085, chamfer: 0.015), dark, V3(0, -0.13, 0.18), rot: V3(-0.32, 0, 0))
            Geo.part(n, Geo.box(0.07, 0.11, 0.26, chamfer: 0.02), dark, V3(0, -0.02, 0.36))
            Geo.part(n, Geo.box(0.03, 0.05, 0.06), dark, V3(0, 0.135, 0.06))
            Geo.part(n, Geo.box(0.012, 0.012, 0.012), glow, V3(0, 0.165, 0.06))
            finish(def, n, muzzleAt: V3(0, 0.02, -0.7), flashSize: 0.55)
        }
        // 2 – scatter cannon
        do {
            let c = V3(1.0, 0.55, 0.12)
            let def = WeaponDef(name: "STREUKANONE", short: "STREU", kind: .hitscan, damage: 9.5, pellets: 10, spread: 0.07, interval: 0.72,
                                mag: 8, reload: 1.6, color: c, kick: 0.16, sound: "shotgun", reserveMax: 56, reserveStart: 24)
            let n = SCNNode(), glow = Mat.glow(c, 5)
            Geo.part(n, Geo.box(0.115, 0.14, 0.46, chamfer: 0.02), dark, V3(0, 0, 0.02))
            for sx in [Float(-0.036), 0.036] {
                Geo.part(n, Geo.cyl(0.036, 0.62, segments: 16), steel, V3(sx, 0.03, -0.46), rot: V3(.pi / 2, 0, 0))
                Geo.part(n, Geo.cyl(0.027, 0.01, segments: 16), Mat.glow(c, 2), V3(sx, 0.03, -0.772), rot: V3(.pi / 2, 0, 0))
            }
            Geo.part(n, Geo.box(0.13, 0.085, 0.22, chamfer: 0.02), steel, V3(0, -0.035, -0.4))
            Geo.part(n, Geo.box(0.134, 0.016, 0.16), glow, V3(0, -0.035, -0.4))
            Geo.part(n, Geo.box(0.12, 0.02, 0.3), glow, V3(0, 0.05, 0.04))
            Geo.part(n, Geo.box(0.065, 0.18, 0.09, chamfer: 0.015), dark, V3(0, -0.14, 0.2), rot: V3(-0.35, 0, 0))
            Geo.part(n, Geo.box(0.08, 0.12, 0.28, chamfer: 0.02), dark, V3(0, -0.03, 0.38))
            Geo.part(n, Geo.box(0.02, 0.03, 0.4), steel, V3(0, 0.085, -0.3))
            finish(def, n, muzzleAt: V3(0, 0.03, -0.8), flashSize: 0.95)
        }
        // 3 – railgun
        do {
            let c = V3(0.72, 0.42, 1.0)
            let def = WeaponDef(name: "RAILGUN", short: "RAIL", kind: .rail, damage: 190, pellets: 1, spread: 0, interval: 1.05,
                                mag: 4, reload: 1.9, color: c, kick: 0.2, sound: "rail", reserveMax: 24, reserveStart: 8)
            let n = SCNNode(), glow = Mat.glow(c, 6)
            Geo.part(n, Geo.box(0.12, 0.17, 0.42, chamfer: 0.02), dark, V3(0, 0, 0.12))
            for sx in [Float(-0.046), 0.046] {
                Geo.part(n, Geo.box(0.03, 0.06, 0.95, chamfer: 0.005), steel, V3(sx, 0.03, -0.4))
            }
            Geo.part(n, Geo.box(0.028, 0.028, 0.9), glow, V3(0, 0.03, -0.4))
            for i in 0..<5 {
                Geo.part(n, Geo.torus(0.078, 0.013), dark, V3(0, 0.03, -0.12 - Float(i) * 0.17), rot: V3(.pi / 2, 0, 0))
            }
            Geo.part(n, Geo.cyl(0.03, 0.26, segments: 14), dark, V3(0, 0.14, 0.1), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.cyl(0.022, 0.01, segments: 14), glow, V3(0, 0.14, -0.035), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.box(0.124, 0.02, 0.24), glow, V3(0, -0.02, 0.12))
            Geo.part(n, Geo.box(0.065, 0.18, 0.09, chamfer: 0.015), dark, V3(0, -0.15, 0.22), rot: V3(-0.32, 0, 0))
            Geo.part(n, Geo.box(0.08, 0.12, 0.22, chamfer: 0.02), dark, V3(0, -0.02, 0.42))
            finish(def, n, muzzleAt: V3(0, 0.03, -0.9), flashSize: 0.9)
        }
        // 4 – plasma launcher
        do {
            let c = V3(0.35, 1.0, 0.45)
            let def = WeaponDef(name: "PLASMAWERFER", short: "PLASMA", kind: .launcher, damage: 135, pellets: 1, spread: 0, interval: 0.85,
                                mag: 4, reload: 2.1, color: c, kick: 0.2, sound: "launcher", reserveMax: 20, reserveStart: 8)
            let n = SCNNode(), glow = Mat.glow(c, 5)
            Geo.part(n, Geo.cyl(0.085, 0.62, segments: 20), dark, V3(0, 0.04, -0.3), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.torus(0.09, 0.018), glow, V3(0, 0.04, -0.6), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.torus(0.092, 0.014), steel, V3(0, 0.04, -0.35), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.torus(0.092, 0.014), steel, V3(0, 0.04, -0.15), rot: V3(.pi / 2, 0, 0))
            Geo.part(n, Geo.box(0.14, 0.16, 0.36, chamfer: 0.025), dark, V3(0, -0.01, 0.16))
            Geo.part(n, Geo.sphere(0.075, segments: 16), glow, V3(0, 0.1, 0.12))
            Geo.part(n, Geo.torus(0.085, 0.012), steel, V3(0, 0.1, 0.12))
            Geo.part(n, Geo.torus(0.085, 0.012), steel, V3(0, 0.1, 0.12), rot: V3(0, 0, .pi / 2))
            Geo.part(n, Geo.box(0.065, 0.18, 0.09, chamfer: 0.015), dark, V3(0, -0.16, 0.24), rot: V3(-0.32, 0, 0))
            Geo.part(n, Geo.box(0.06, 0.14, 0.08, chamfer: 0.015), steel, V3(0, -0.12, -0.2), rot: V3(0.2, 0, 0))
            finish(def, n, muzzleAt: V3(0, 0.04, -0.66), flashSize: 0.8)
        }
    }

    // MARK: - weapon logic

    func selectWeapon(_ i: Int) {
        guard i != cur, i >= 0, i < weapons.count, switchT <= 0 else { return }
        pendingWeapon = i
        switchT = 0.28
        reloadT = 0
        audio.play("swap", vol: 0.7)
    }

    func startReload() {
        let w = weapons[cur]
        guard reloadT <= 0, w.ammo < w.def.mag, w.def.reserveMax < 0 || w.reserve > 0 else { return }
        reloadDur = w.def.reload
        reloadT = reloadDur
        audio.play("reload", vol: 0.8)
    }

    func updateWeapons(_ dt: Float, _ inp: InputFrame) {
        for (i, k) in [Key.n1, Key.n2, Key.n3, Key.n4].enumerated() where inp.hit(k) { selectWeapon(i) }
        if inp.scroll != 0 && switchT <= 0 { selectWeapon((cur + (inp.scroll > 0 ? weapons.count - 1 : 1)) % weapons.count) }

        if switchT > 0 {
            let before = switchT
            switchT -= dt
            if before > 0.14 && switchT <= 0.14 && pendingWeapon >= 0 {
                weapons[cur].node.isHidden = true
                weapons[cur].flash.isHidden = true
                cur = pendingWeapon; pendingWeapon = -1
                weapons[cur].node.isHidden = false
            }
        }
        let w = weapons[cur]
        for x in weapons { x.cooldown = max(0, x.cooldown - dt) }
        bloom = max(0, bloom - dt * 0.05)
        hitSoundT = max(0, hitSoundT - dt)

        if reloadT > 0 {
            reloadT -= dt
            if reloadT <= 0 {
                let need = w.def.mag - w.ammo
                if w.def.reserveMax < 0 { w.ammo = w.def.mag } else {
                    let take = min(need, w.reserve)
                    w.ammo += take; w.reserve -= take
                }
            }
            return
        }
        if switchT > 0 { return }
        if inp.hit(Key.r) { startReload(); return }
        if inp.fire && w.cooldown <= 0 {
            if w.ammo <= 0 {
                if w.def.reserveMax < 0 || w.reserve > 0 { startReload() } else if inp.clicked {
                    audio.play("empty")
                    hud.feedLine("\(w.def.name): keine Munition", NSColor(srgbRed: 1, green: 0.4, blue: 0.3, alpha: 1))
                    // fall back to the rifle so the player is never stuck
                    selectWeapon(0)
                }
                return
            }
            fire(w)
        }
    }

    private func spreadDir(_ s: Float) -> V3 {
        if s <= 0 { return viewDir }
        let d = viewDir
        let r = safeNorm(simd_cross(d, V3(0, 1, 0)), V3(1, 0, 0))
        let u = simd_cross(r, d)
        let a = frand(0, 2 * .pi), m = sqrt(frand()) * s
        return simd_normalize(d + r * (cos(a) * m) + u * (sin(a) * m))
    }

    private func fire(_ w: Weapon) {
        let def = w.def
        w.ammo -= 1
        w.cooldown = def.interval * (overcharge > 0 ? 0.8 : 1)
        shotsFired += 1
        let dmgMul: Float = overcharge > 0 ? 2 : 1
        kickZ = min(0.13, kickZ + def.kick * 0.7)
        kickRot = min(0.3, kickRot + def.kick * 0.9)
        recoilPitch += def.kick * 0.12
        fx.shake(def.kick * 0.9)
        audio.play(def.sound, vol: def.kind == .hitscan && def.pellets == 1 ? 0.55 : 0.9)

        // muzzle flash
        w.flash.isHidden = false
        w.flash.simdEulerAngles = V3(0, 0, frand(0, 6.28))
        let fs = frand(0.8, 1.25)
        w.flash.simdScale = V3(fs, fs, fs)
        flashT = 0.045
        let o = eye
        // muzzle direction in camera space (node transforms lag one frame behind the simulation, so stay local)
        let ml = safeNorm(camNode.simdConvertPosition(V3(0, 0, 0), from: w.muzzle))
        let upV = simd_cross(rightV, viewDir)
        let tracerStart = o + (rightV * ml.x + upV * ml.y - viewDir * ml.z) * 1.5
        fx.flash(at: o + viewDir * 0.8, def.color, intensity: 500 + def.kick * 4000, duration: 0.09, range: 9)

        var anyHit = false
        switch def.kind {
        case .hitscan:
            let movePenalty: Float = (onGround ? 0 : 0.012) + min(len2(vel) / 9.6, 1) * 0.004
            for _ in 0..<def.pellets {
                let d = spreadDir(def.spread + bloom + movePenalty)
                let wall = level.raycast(o, d, 220)
                var bestT = wall?.t ?? 220
                var bestE: Enemy? = nil
                var crit = false
                for e in enemies where !e.dead {
                    if let h = e.rayHit(o, d, bestT) { bestT = h.t; bestE = e; crit = h.crit }
                }
                let end = o + d * bestT
                fx.tracer(from: tracerStart, to: end, def.color, width: def.pellets > 1 ? 0.018 : 0.024, life: 0.07, intensity: def.pellets > 1 ? 1.6 : 2.6)
                if let e = bestE {
                    var dmg = def.damage * dmgMul
                    if def.pellets > 1 { dmg *= clampf(1.25 - bestT / 34, 0.35, 1) }
                    damageEnemy(e, dmg * (crit ? 2 : 1), at: end, dir: d, crit: crit)
                    anyHit = true
                } else if let wl = wall {
                    fx.impact(at: end, normal: wl.n, def.color)
                }
            }
            if def.pellets == 1 { bloom = min(0.028, bloom + 0.0045) }
        case .rail:
            let d = viewDir
            let wall = level.raycast(o, d, 260)
            let maxT = wall?.t ?? 260
            for e in enemies where !e.dead {
                if let h = e.rayHit(o, d, maxT, inflate: 0.12) {
                    damageEnemy(e, def.damage * dmgMul * (h.crit ? 1.6 : 1), at: o + d * h.t, dir: d, crit: h.crit)
                    anyHit = true
                }
            }
            let end = o + d * maxT
            fx.railBeam(from: tracerStart, to: end, def.color)
            if let wl = wall { fx.impact(at: end, normal: wl.n, def.color, big: true) }
        case .launcher:
            let d = viewDir
            let start = o + d * 0.9 + rightV * 0.16 - V3(0, 0.14, 0)
            spawnProjectile(pos: start, vel: d * 40 + V3(0, 1.2, 0), damage: def.damage * dmgMul, splash: 5.5, fromPlayer: true,
                            life: 5, radius: 0.22, color: def.color, gravity: 5, big: true)
            anyHit = false
        }
        if anyHit { shotsHit += 1 }
    }

    // MARK: - damage

    func damageEnemy(_ e: Enemy, _ amount: Float, at p: V3, dir: V3, crit: Bool, silent: Bool = false) {
        if e.dead { return }
        e.hp -= amount
        if e.flash <= 0 { e.setFlash(true) }
        e.flash = 0.07
        e.sees = true
        let killed = e.hp <= 0
        if !silent {
            fx.hitSparks(at: p, dir: dir, e.kind.glow, crit: crit)
            hud.hit(kill: killed, crit: crit)
            if hitSoundT <= 0 { audio.play(crit ? "crit" : "hit", vol: 0.5); hitSoundT = 0.04 }
        }
        if !e.kind.isBoss && e.kind != .brute {
            e.vel += V3(dir.x, 0, dir.z) * min(amount * 0.06, 4)
        }
        if killed { killEnemy(e) }
    }

    func killEnemy(_ e: Enemy, scoreIt: Bool = true) {
        if e.dead { return }
        e.dead = true
        e.node.removeFromParentNode()
        let c = e.center
        let size: Float
        switch e.kind {
        case .skitter, .drone: size = 1.3
        case .trooper: size = 1.6
        case .roller: size = 4.2
        case .brute: size = 3.4
        case .boss: size = 7
        case .tyrant: size = 9
        }
        fx.explosion(at: c, radius: size, e.kind == .roller ? V3(1.0, 0.7, 0.2) : mix3(e.kind.glow, V3(1, 0.6, 0.2), 0.5), shakeAmount: min(0.9, size * 0.12))
        fx.debris(at: c, count: e.kind.isBoss ? 28 : (e.kind == .brute ? 12 : 5), material: e.debrisMat, size: e.kind.isBoss ? 0.6 : (e.kind == .brute ? 0.4 : 0.2), force: 4 + size * 1.6)
        audio.play(size > 3 ? "explosion" : "enemyDie", at: c, listener: pos, yaw: yaw, vol: size > 3 ? 1 : 0.8)

        if e.kind == .roller {
            // volatile: hurts everything nearby, including other machines
            radialDamage(at: c, radius: 5, damage: 70, playerDamage: 26, exclude: e)
        }
        if e.kind.isBoss {
            let tyrant = e.kind == .tyrant
            for k in 0..<(tyrant ? 9 : 5) {
                // the giant comes apart from the boots up to the head
                let o = tyrant ? e.pos + V3(frand(-1.5, 1.5), 1 + Float(k) * 0.9, frand(-1.2, 1.2)) : c + randUnit() * 2.5
                let node = SCNNode()
                scene.rootNode.addChildNode(node)
                node.runAction(.sequence([.wait(duration: 0.15 + Double(k) * 0.18), .run { [weak self] _ in
                    self?.fx.explosion(at: o, radius: 4, V3(1, 0.5, 0.2), shakeAmount: 0.4)
                    self?.audio.play("explosion", vol: 0.8)
                }, .removeFromParentNode()]))
            }
            hud.flash(.white, 0.5, 0.6)
            hud.announce(tyrant ? "HITLER BESIEGT" : "OVERSEER ZERSTÖRT", sub: "+\(e.kind.score * comboMult)", color: NSColor(srgbRed: 1, green: 0.8, blue: 0.3, alpha: 1), hold: tyrant ? 3 : 2)
            if tyrant { audio.play("waveClear") }
            for _ in 0..<(tyrant ? 4 : 3) { spawnPickup([.health, .ammo, .power].randomElement()!, at: V3(c.x + frand(-3, 3), 0, c.z + frand(-3, 3))) }
        }
        guard scoreIt else { return }
        kills += 1
        combo += 1
        comboT = 1
        let pts = e.kind.score * comboMult
        score += pts
        hud.feedLine("\(e.kind.displayName)  +\(pts)")
        if hitSoundT <= 0.03 { audio.play("kill", vol: 0.6) }
        // drops
        let roll = frand()
        let chance: Float = e.kind == .brute ? 1 : (e.kind == .trooper ? 0.3 : 0.15)
        if !e.kind.isBoss && roll < chance {
            let r = frand()
            let hpNeed = hp < 60
            let kind: PickupKind = r < (hpNeed ? 0.6 : 0.35) ? .health : (r < 0.92 ? .ammo : .power)
            spawnPickup(kind, at: V3(c.x, level.groundHeight(c.x, c.z, radius: 0.2, feetY: 2.5), c.z))
        }
    }

    /// Explosion damage against enemies and (optionally) the player.
    func radialDamage(at p: V3, radius: Float, damage: Float, playerDamage: Float, exclude: Enemy? = nil) {
        for e in enemies where !e.dead && e !== exclude {
            let d = simd_distance(e.center, p) - e.radius
            if d < radius {
                let k = clampf(1 - d / radius, 0, 1)
                damageEnemy(e, damage * (0.35 + 0.65 * k), at: e.center, dir: safeNorm(e.center - p), crit: false, silent: true)
            }
        }
        if playerDamage > 0 {
            let d = simd_distance(pos + V3(0, 0.9, 0), p)
            if d < radius {
                let k = clampf(1 - d / radius, 0, 1)
                hurtPlayer(playerDamage * (0.3 + 0.7 * k), from: p)
                let push = safeNorm(pos + V3(0, 0.9, 0) - p) * (9 * k)
                vel += V3(push.x, max(push.y, 0) + 3 * k, push.z)
                onGround = false
            }
        }
    }

    // MARK: - projectiles

    func spawnProjectile(pos p: V3, vel v: V3, damage: Float, splash: Float, fromPlayer: Bool, life: Float, radius: Float, color c: V3, gravity: Float, big: Bool) {
        let n = SCNNode()
        let core = Geo.sphere(radius * 0.7, segments: 10)
        core.materials = [Mat.additive(nil, mix3(c, V3(1, 1, 1), 0.6), 3)]
        let cn = SCNNode(geometry: core); cn.castsShadow = false
        n.addChildNode(cn)
        n.addChildNode(Geo.glowSprite(radius * (big ? 9 : 7), c, big ? 1.5 : 1.2))
        if big {
            let t = trail.copy() as! SCNParticleSystem
            t.particleColor = color(c)
            t.particleSize = CGFloat(radius * 1.6)
            n.addParticleSystem(t)
        }
        n.simdPosition = p
        scene.rootNode.addChildNode(n)
        projectiles.append(Projectile(pos: p, vel: v, damage: damage, splash: splash, fromPlayer: fromPlayer, life: life, radius: radius, color: c, gravity: gravity, node: n))
    }

    func updateProjectiles(_ dt: Float) {
        var i = 0
        while i < projectiles.count {
            let p = projectiles[i]
            p.life -= dt
            if p.gravity != 0 { p.vel.y -= p.gravity * dt }
            let step = p.vel * dt
            let l = simd_length(step)
            let d = l > 1e-6 ? step / l : V3(0, -1, 0)
            var hitT = l
            var hitN: V3? = nil
            var hitE: Enemy? = nil
            var hitPlayer = false
            var crit = false
            if let w = level.raycast(p.pos, d, l) { hitT = w.t; hitN = w.n }
            if p.fromPlayer {
                for e in enemies where !e.dead {
                    if let h = e.rayHit(p.pos, d, hitT, inflate: p.radius) { hitT = h.t; hitE = e; crit = h.crit }
                }
            } else if phase == .playing {
                for (c, r) in [(pos + V3(0, 0.75, 0), Float(0.7)), (pos + V3(0, 1.5, 0), Float(0.42))] {
                    let oc = p.pos - c
                    let b = simd_dot(oc, d)
                    let cc = simd_dot(oc, oc) - (r + p.radius) * (r + p.radius)
                    let disc = b * b - cc
                    if disc < 0 { continue }
                    var t = -b - sqrt(disc)
                    if t < 0 && cc < 0 { t = 0 }
                    if t >= 0 && t <= hitT { hitT = t; hitPlayer = true }
                }
            }
            let hitSomething = hitN != nil || hitE != nil || hitPlayer
            if hitSomething || p.life <= 0 {
                let at = p.pos + d * hitT
                if p.splash > 0 {
                    fx.explosion(at: at, radius: p.splash * 0.8, p.color, shakeAmount: p.fromPlayer ? 0.35 : 0.3)
                    audio.play("explosion", at: at, listener: pos, yaw: yaw, vol: 0.9)
                    if p.fromPlayer {
                        var hitAny = false
                        for e in enemies where !e.dead && simd_distance(e.center, at) - e.radius < p.splash { hitAny = true; break }
                        if hitAny { shotsHit += 1; hud.hit(kill: false, crit: false) }
                        radialDamage(at: at, radius: p.splash, damage: p.damage, playerDamage: p.damage * 0.22)
                    } else {
                        let dist = simd_distance(pos + V3(0, 0.9, 0), at)
                        if dist < p.splash { hurtPlayer(p.damage * clampf(1.15 - dist / p.splash, 0.25, 1), from: at) }
                    }
                } else if hitSomething {
                    if let e = hitE {
                        damageEnemy(e, p.damage * (crit ? 2 : 1), at: at, dir: d, crit: crit)
                    } else if hitPlayer {
                        hurtPlayer(p.damage, from: at - d * 3)
                        fx.glowPop(at: at, p.color, size: 1.0)
                    } else if let n = hitN {
                        fx.impact(at: at, normal: n, p.color)
                    }
                }
                p.node.removeFromParentNode()
                projectiles.remove(at: i)
                continue
            }
            p.pos += step
            p.node.simdPosition = p.pos
            i += 1
        }
    }

    // MARK: - pickups

    func spawnPickup(_ kind: PickupKind, at p: V3) {
        let n = SCNNode()
        let c: V3
        let spin = SCNNode()
        n.addChildNode(spin)
        switch kind {
        case .health:
            c = V3(0.3, 1.0, 0.5)
            let m = Mat.glow(c, 4)
            Geo.part(spin, Geo.box(0.5, 0.16, 0.16, chamfer: 0.03), m, V3(0, 0, 0), shadow: false)
            Geo.part(spin, Geo.box(0.16, 0.5, 0.16, chamfer: 0.03), m, V3(0, 0, 0), shadow: false)
        case .ammo:
            c = V3(1.0, 0.6, 0.15)
            Geo.part(spin, Geo.box(0.42, 0.3, 0.3, chamfer: 0.04), Mat.metal(V3(0.2, 0.2, 0.22), rough: 0.35), V3(0, 0, 0))
            Geo.part(spin, Geo.box(0.44, 0.06, 0.32), Mat.glow(c, 4), V3(0, 0.05, 0), shadow: false)
            Geo.part(spin, Geo.box(0.1, 0.32, 0.32), Mat.glow(c, 4), V3(0, 0, 0), shadow: false)
        case .power:
            c = V3(0.75, 0.4, 1.0)
            let m = Mat.glow(c, 5)
            Geo.part(spin, Geo.pyramid(0.4, 0.38, 0.4), m, V3(0, 0, 0), shadow: false)
            Geo.part(spin, Geo.pyramid(0.4, 0.38, 0.4), m, V3(0, 0, 0), rot: V3(.pi, 0, 0), shadow: false)
        }
        spin.runAction(.repeatForever(.rotateBy(x: 0, y: 2 * .pi, z: 0, duration: 2.4)))
        let g = Geo.glowSprite(1.7, c, 0.7); n.addChildNode(g)
        let ring = Geo.plane(1.5, 1.5)
        ring.materials = [Mat.additive(Tex.ring, c, 0.9)]
        let rn = SCNNode(geometry: ring); rn.simdEulerAngles = V3(-.pi / 2, 0, 0); rn.simdPosition = V3(0, -0.84, 0); rn.castsShadow = false
        n.addChildNode(rn)
        let shaft = Geo.cone(0.05, 0.55, 1.8, segments: 16)
        shaft.materials = [Mat.additive(Tex.shaft, c, 0.35)]
        let sn = SCNNode(geometry: shaft); sn.simdPosition = V3(0, 0.0, 0); sn.castsShadow = false
        n.addChildNode(sn)
        var q = p
        q.y = level.groundHeight(p.x, p.z, radius: 0.2, feetY: p.y + 0.3) + 0.9
        n.simdPosition = q
        scene.rootNode.addChildNode(n)
        pickups.append(Pickup(kind: kind, pos: q, node: n))
    }

    func updatePickups(_ dt: Float) {
        var i = 0
        while i < pickups.count {
            let p = pickups[i]
            p.life -= dt
            p.t += dt
            var remove = p.life <= 0
            let chest = pos + V3(0, 0.9, 0)
            let d = simd_distance(chest, p.pos)
            if phase == .playing {
                var wanted = true
                switch p.kind {
                case .health: wanted = hp < 100
                case .ammo: wanted = weapons.contains { $0.def.reserveMax > 0 && $0.reserve < $0.def.reserveMax }
                case .power: wanted = true
                }
                if wanted && d < 4.5 { p.pos += safeNorm(chest - p.pos) * min(d, dt * (4 + (4.5 - d) * 5)) }
                if wanted && d < 1.3 {
                    remove = true
                    switch p.kind {
                    case .health:
                        hp = min(100, hp + 30)
                        hud.feedLine("+30 Vital", NSColor(srgbRed: 0.4, green: 1, blue: 0.6, alpha: 1))
                        hud.flash(NSColor(srgbRed: 0.3, green: 1, blue: 0.5, alpha: 1), 0.18, 0.35)
                        audio.play("pickup")
                    case .ammo:
                        for w in weapons where w.def.reserveMax > 0 {
                            w.reserve = min(w.def.reserveMax, w.reserve + max(1, Int(Float(w.def.reserveMax) * 0.35)))
                        }
                        hud.feedLine("Munition aufgefüllt", NSColor(srgbRed: 1, green: 0.7, blue: 0.3, alpha: 1))
                        hud.flash(NSColor(srgbRed: 1, green: 0.6, blue: 0.2, alpha: 1), 0.15, 0.35)
                        audio.play("pickup")
                    case .power:
                        overcharge = 12
                        hud.announce("ÜBERLADUNG", sub: "Doppelter Schaden · schnellere Feuerrate", color: NSColor(srgbRed: 0.8, green: 0.5, blue: 1, alpha: 1), hold: 1.2)
                        hud.flash(NSColor(srgbRed: 0.7, green: 0.4, blue: 1, alpha: 1), 0.3, 0.5)
                        audio.play("power")
                    }
                }
            }
            if remove {
                p.node.removeFromParentNode()
                pickups.remove(at: i)
                continue
            }
            p.node.simdPosition = p.pos + V3(0, sin(p.t * 2.2) * 0.12, 0)
            p.node.opacity = p.life < 4 ? CGFloat(0.35 + 0.65 * abs(sin(p.life * 6))) : 1
            i += 1
        }
    }

    // MARK: - enemy AI

    private func faceToward(_ e: Enemy, _ dir: V2, _ dt: Float, rate: Float = 8) {
        if simd_length(dir) < 1e-4 { return }
        let target = atan2(dir.x, dir.y)
        e.yaw += wrapAngle(target - e.yaw) * min(1, dt * rate)
    }

    private func moveGround(_ e: Enemy, _ dir: V2, _ speed: Float, _ dt: Float) {
        let desired = V3(dir.x, 0, dir.y) * speed
        let k = min(1, dt * 7)
        e.vel.x += (desired.x - e.vel.x) * k
        e.vel.z += (desired.z - e.vel.z) * k
        var p = V3(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt)
        level.resolve(&p, radius: min(e.radius, 0.6) * 0.75, feetY: e.pos.y, height: e.height, step: 0.55)
        let g = level.groundHeight(p.x, p.z, radius: 0.15, feetY: e.pos.y, step: 0.55)
        p.y = g > e.pos.y ? min(g, e.pos.y + dt * 7) : max(g, e.pos.y - dt * 14)
        e.pos = p
    }

    private func enemyShoot(_ e: Enemy, muzzle: V3, speed: Float, damage: Float, inaccuracy: Float, splash: Float = 0, lead: Float = 0.6, gravity: Float = 0) {
        let from = e.world(muzzle)
        let dist = simd_distance(from, pos)
        var target = pos + V3(0, 1.15, 0) + V3(vel.x, 0, vel.z) * (dist / speed) * lead
        if splash > 0 { target.y = pos.y + 0.3 }
        var d = safeNorm(target - from)
        d = simd_normalize(d + randUnit() * inaccuracy)
        spawnProjectile(pos: from, vel: d * speed, damage: damage, splash: splash, fromPlayer: false, life: 6, radius: splash > 0 ? 0.2 : 0.11,
                        color: splash > 0 ? V3(1.0, 0.45, 0.1) : e.kind.glow, gravity: gravity, big: splash > 0)
        fx.glowPop(at: from, e.kind.glow, size: splash > 0 ? 1.6 : 0.9, intensity: 1.5, life: 0.1)
        audio.play(splash > 0 ? "launcher" : "enemyShot", at: from, listener: pos, yaw: yaw, vol: 0.75)
    }

    func updateEnemies(_ dt: Float) {
        let alive = phase == .playing
        let playerChest = pos + V3(0, 1.1, 0)
        // soft separation so they do not stack
        let n = enemies.count
        if n > 1 {
            for i in 0..<(n - 1) {
                let a = enemies[i]
                if a.kind.isBoss { continue }
                for j in (i + 1)..<n {
                    let b = enemies[j]
                    if b.kind.isBoss || a.kind.flies != b.kind.flies { continue }
                    let dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z
                    let minD = (a.radius + b.radius) * 0.9
                    let d2 = dx * dx + dz * dz
                    if d2 < minD * minD && d2 > 1e-5 {
                        let d = sqrt(d2)
                        let push = (minD - d) * 0.5 * min(1, dt * 12)
                        a.pos.x -= dx / d * push; a.pos.z -= dz / d * push
                        b.pos.x += dx / d * push; b.pos.z += dz / d * push
                    }
                }
            }
        }

        for e in enemies where !e.dead {
            e.anim += dt
            if e.flash > 0 {
                e.flash -= dt
                if e.flash <= 0 { e.setFlash(false) }
            }
            if e.spawnT > 0 {
                e.spawnT -= dt
                let k = 1 - max(0, e.spawnT) / 0.45
                let s = max(0.01, k * k * (3 - 2 * k))
                e.node.simdScale = V3(s, s, s)
                e.node.simdPosition = e.pos
                e.node.simdEulerAngles = V3(0, e.yaw, 0)
                continue
            }
            e.losT -= dt
            if e.losT <= 0 {
                e.losT = 0.2
                e.sees = level.lineOfSight(e.kind.flies ? e.pos : e.pos + V3(0, e.height * 0.8, 0), playerChest)
            }
            e.attackCD -= dt
            let to = V2(pos.x - e.pos.x, pos.z - e.pos.z)
            let dist = simd_length(to)
            let toN = dist > 1e-3 ? to / dist : V2(0, 1)
            let tangent = V2(-toN.y, toN.x)
            e.strafeT -= dt
            if e.strafeT <= 0 { e.strafeT = frand(1.5, 4); e.strafe = -e.strafe }

            switch e.kind {
            case .skitter:
                let direct = e.sees && dist < 7
                let dir = direct ? toN : level.nav.direction(from: e.pos, toward: pos)
                // little zig-zag makes them harder to hit
                let zig = direct ? tangent * sin(e.anim * 5) * 0.35 : V2(0, 0)
                let dn = simd_normalize(dir + zig)
                moveGround(e, dn, dist < 1.2 ? 0 : e.speed, dt)
                faceToward(e, dist < 3 ? toN : dn, dt, rate: 10)
                if alive && dist < 1.75 && abs(e.pos.y - pos.y) < 2.3 && e.attackCD <= 0 {
                    e.attackCD = 0.8
                    hurtPlayer(9 + Float(wave) * 0.3, from: e.pos)
                    audio.play("melee", vol: 0.8)
                    e.state = 1; e.stateT = 0.2
                }
                if e.stateT > 0 { e.stateT -= dt }
                let sp = len2(e.vel)
                for (i, leg) in e.legs.enumerated() {
                    let ph = e.anim * (6 + sp * 2.2) + Float(i) * 2.1
                    leg.simdEulerAngles = V3(sin(ph) * 0.12, cos(ph) * 0.45 * min(1, sp / 2 + 0.2), sin(ph) * 0.18 * (i % 2 == 0 ? 1 : -1))
                }
                e.model.simdPosition = V3(0, abs(sin(e.anim * 14)) * 0.03 * sp / 6, e.stateT > 0 ? 0.3 : 0)

            case .roller:
                let dir = (e.sees && dist < 10) ? toN : level.nav.direction(from: e.pos, toward: pos)
                let desired = V3(dir.x, 0, dir.y) * e.speed
                e.vel.x += (desired.x - e.vel.x) * min(1, dt * 2.2)
                e.vel.z += (desired.z - e.vel.z) * min(1, dt * 2.2)
                var p = V3(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt)
                let before = p
                level.resolve(&p, radius: 0.5, feetY: e.pos.y, height: 1, step: 0.55)
                if simd_distance(before, p) > 1e-4 { e.vel *= 0.82 }
                let g = level.groundHeight(p.x, p.z, radius: 0.15, feetY: e.pos.y, step: 0.55)
                p.y = g > e.pos.y ? min(g, e.pos.y + dt * 7) : max(g, e.pos.y - dt * 14)
                e.pos = p
                let sp = len2(e.vel)
                if sp > 0.2, let ball = e.spinners.first {
                    let axis = simd_normalize(simd_cross(V3(0, 1, 0), V3(e.vel.x, 0, e.vel.z)))
                    ball.simdOrientation = simd_quatf(angle: sp * dt / 0.55, axis: axis) * ball.simdOrientation
                }
                let blinkRate: Float = dist < 8 ? 14 : 4
                e.model.childNode(withName: "blink", recursively: false)?.opacity = CGFloat(0.4 + 0.6 * abs(sin(e.anim * blinkRate)))
                if alive && simd_distance(e.center, playerChest) < 2.4 {
                    killEnemy(e, scoreIt: false)
                    continue
                }

            case .drone:
                var want = V2(0, 0)
                if dist > 15 { want = toN } else if dist < 8 { want = -toN } else { want = tangent * e.strafe }
                if !e.sees { want = level.nav.direction(from: e.pos, toward: pos) }
                want = simd_normalize(want + tangent * e.strafe * 0.4)
                let targetY = pos.y + 3.0 + sin(e.anim * 1.3) * 0.6
                let desired = V3(want.x * e.speed, (targetY - e.pos.y) * 2.5, want.y * e.speed)
                e.vel += (desired - e.vel) * min(1, dt * 2.5)
                var p = e.pos + e.vel * dt
                level.resolve(&p, radius: 0.6, feetY: p.y - 0.5, height: 1.0, step: 0)
                p.y = max(p.y, level.groundHeight(p.x, p.z, radius: 0.6, feetY: p.y + 3, step: 0) + 1.2)
                e.pos = p
                faceToward(e, toN, dt, rate: 6)
                e.spinners.first?.simdEulerAngles = V3(0, e.anim * 5, 0)
                e.model.simdEulerAngles = V3(clampf(simd_dot(V2(e.vel.x, e.vel.z), toN) * 0.04, -0.3, 0.3), 0, clampf(-simd_dot(V2(e.vel.x, e.vel.z), tangent) * 0.05, -0.4, 0.4))
                if alive && e.sees && e.attackCD <= 0 && dist < 32 {
                    e.attackCD = frand(1.5, 2.4) * max(0.6, 1 - Float(wave) * 0.02)
                    enemyShoot(e, muzzle: e.muzzles[0], speed: 21, damage: 8, inaccuracy: 0.03)
                }

            case .trooper:
                var dir: V2
                var speed = e.speed
                if !e.sees || dist > 22 {
                    dir = level.nav.direction(from: e.pos, toward: pos)
                } else if dist < 8 {
                    dir = simd_normalize(-toN + tangent * e.strafe * 0.8); speed *= 0.8
                } else {
                    dir = simd_normalize(tangent * e.strafe + toN * 0.25); speed *= 0.65
                }
                if e.burst > 0 { speed *= 0.3 }
                moveGround(e, dir, speed, dt)
                faceToward(e, e.sees ? toN : dir, dt, rate: 7)
                if alive && e.sees && dist < 34 {
                    if e.burst == 0 && e.attackCD <= 0 { e.burst = 3; e.burstT = 0.25 }
                    if e.burst > 0 {
                        e.burstT -= dt
                        if e.burstT <= 0 {
                            e.burstT = 0.15; e.burst -= 1
                            enemyShoot(e, muzzle: e.muzzles[0], speed: 27, damage: 7, inaccuracy: 0.035)
                            if e.burst == 0 { e.attackCD = frand(1.8, 2.8) * max(0.6, 1 - Float(wave) * 0.02) }
                        }
                    }
                } else { e.burst = 0 }
                let sp = len2(e.vel)
                let ph = e.anim * (3 + sp * 1.6)
                let amp = min(1, sp / 2.5) * 0.65
                e.legs[0].simdEulerAngles = V3(sin(ph) * amp, 0, 0)
                e.legs[1].simdEulerAngles = V3(max(0, -cos(ph)) * amp * 1.3, 0, 0)
                e.legs[2].simdEulerAngles = V3(-sin(ph) * amp, 0, 0)
                e.legs[3].simdEulerAngles = V3(max(0, cos(ph)) * amp * 1.3, 0, 0)
                e.model.simdPosition = V3(0, abs(sin(ph)) * 0.04 * amp, 0)

            case .brute:
                let close = e.sees && dist < 15
                let dir = (e.sees && dist < 9) ? toN : level.nav.direction(from: e.pos, toward: pos)
                moveGround(e, dir, close ? e.speed * 0.55 : e.speed, dt)
                faceToward(e, e.sees ? toN : dir, dt, rate: 3)
                if alive && e.sees && dist < 40 && dist > 4.5 && e.attackCD <= 0 {
                    e.side = 1 - e.side
                    enemyShoot(e, muzzle: e.muzzles[e.side], speed: 15, damage: 28, inaccuracy: 0.02, splash: 3.6, lead: 0.5)
                    e.burst += 1
                    e.attackCD = e.burst % 2 == 0 ? frand(2.6, 3.4) : 0.45
                }
                if alive && dist < 3.3 && abs(e.pos.y - pos.y) < 3 && e.stateT <= 0 {
                    e.stateT = 1.5
                    hurtPlayer(26, from: e.pos)
                    vel += V3(toN.x, 0, toN.y) * 11 + V3(0, 4.5, 0)
                    onGround = false
                    fx.spawnFlash(at: e.pos + V3(toN.x, 0, toN.y) * 1.5, e.kind.glow)
                    fx.shake(0.5)
                    audio.play("melee")
                }
                e.stateT -= dt
                let sp = len2(e.vel)
                let ph = e.anim * (2 + sp * 1.3)
                let amp = min(1, sp / 1.5) * 0.4
                e.legs[0].simdEulerAngles = V3(sin(ph) * amp, 0, 0)
                e.legs[1].simdEulerAngles = V3(-sin(ph) * amp, 0, 0)
                e.model.simdPosition = V3(0, abs(cos(ph)) * 0.07 * amp, 0)
                e.model.simdEulerAngles = V3(0, 0, sin(ph) * 0.04 * amp)

            case .boss:
                updateBoss(e, dt, toN: toN, tangent: tangent, dist: dist, alive: alive)
            case .tyrant:
                updateTyrant(e, dt, toN: toN, dist: dist, alive: alive)
            }
            e.node.simdPosition = e.pos
            e.node.simdEulerAngles = V3(0, e.yaw, 0)
        }
        enemies.removeAll { $0.dead }
    }

    /// Eases a joint's Euler angles toward a target (smooth switches between walking, aiming and ranting).
    private func pose(_ n: SCNNode, _ target: V3, _ dt: Float, rate: Float = 8) {
        n.simdEulerAngles += (target - n.simdEulerAngles) * min(1, dt * rate)
    }

    /// Wave-15 boss. States: 0 walk, 1 stomp, 2 hand rockets, 3 eye lasers + fist shaking, 4 call reinforcements.
    private func updateTyrant(_ e: Enemy, _ dt: Float, toN: V2, dist: Float, alive: Bool) {
        let rage: Float = e.hp < e.maxHp * 0.4 ? 0.7 : 1
        let k: Float = 4.6
        var speed: Float = 0
        var dir = toN
        e.stateT -= dt
        if alive && e.stateT <= 0 {
            if e.state == 0 {
                // pick the next attack: stomp when close, otherwise cycle through ranged attacks
                if dist < 9 { e.state = 1; e.stateT = 1.6 * rage }
                else {
                    let cycle = [2, 3, 2, 4, 3]
                    e.state = cycle[e.burst % cycle.count]; e.burst += 1
                    e.stateT = e.state == 4 ? 1.2 : 3.0
                }
                e.burstT = 0.4
                e.side = 0
            } else {
                e.state = 0; e.stateT = frand(2.0, 3.2) * rage
            }
        }
        if alive && e.state == 0 && dist < 5.5 { e.state = 1; e.stateT = 1.6 * rage; e.side = 0 }

        let hipL = e.legs[0], kneeL = e.legs[1], hipR = e.legs[2], kneeR = e.legs[3]
        let shL = e.spinners[0], elL = e.spinners[1], shR = e.spinners[2], elR = e.spinners[3], head = e.spinners[4]
        switch e.state {
        case 0:
            dir = (e.sees && dist < 12) ? toN : level.nav.direction(from: e.pos, toward: pos)
            speed = dist > 8 ? e.speed / rage : 0
        case 1: // stomp: lift the right leg, slam it down, shockwave along the floor
            let total = 1.6 * rage
            let t = total - e.stateT
            let lift = t < 0.7 * rage ? sstep(0, 0.7 * rage, t) : max(0, 1 - (t - 0.7 * rage) / 0.12)
            pose(hipR, V3(-0.9 * lift, 0, 0), dt, rate: 20)
            pose(kneeR, V3(1.1 * lift, 0, 0), dt, rate: 20)
            pose(hipL, V3(0, 0, 0), dt); pose(kneeL, V3(0, 0, 0), dt)
            pose(shL, V3(0, 0, -0.5), dt); pose(shR, V3(0, 0, 0.5), dt)
            if e.side == 0 && t >= 0.7 * rage + 0.1 {
                e.side = 1
                let foot = e.world(V3(0.11 * k, 0.2, 0.25 * k))
                fx.explosion(at: foot, radius: 2.6, V3(1.0, 0.45, 0.12), shakeAmount: 0.85)
                fx.spawnFlash(at: V3(foot.x, e.pos.y, foot.z), e.kind.glow)
                audio.play("explosion", at: foot, listener: pos, yaw: yaw, vol: 1)
                let d = simd_length(V2(pos.x - foot.x, pos.z - foot.z))
                // jumping over the shockwave avoids it
                if alive && d < 9 && onGround && abs(pos.y - e.pos.y) < 0.8 {
                    hurtPlayer(14 + 22 * (1 - d / 9), from: foot)
                    let away = d > 0.01 ? V2(pos.x - foot.x, pos.z - foot.z) / d : toN
                    vel += V3(away.x, 0, away.y) * 9 + V3(0, 5, 0)
                    onGround = false
                }
            }
        case 2: // rockets from both raised hands
            pose(shL, V3(-1.45, 0, 0), dt); pose(shR, V3(-1.45, 0, 0), dt)
            pose(elL, V3(0, 0, 0), dt); pose(elR, V3(0, 0, 0), dt)
            speed = dist > 16 ? e.speed * 0.5 : 0
            e.burstT -= dt
            if alive && e.sees && e.burstT <= 0 {
                e.burstT = 0.55 * rage
                e.side = 1 - e.side
                enemyShoot(e, muzzle: e.muzzles[e.side], speed: 16, damage: 24, inaccuracy: 0.03, splash: 3.6, lead: 0.5)
            }
        case 3: // eye lasers while shaking a fist
            pose(shR, V3(-2.5, 0, 0.25), dt)
            pose(elR, V3(-0.9 + sin(e.anim * 14) * 0.35, 0, 0), dt, rate: 14)
            pose(shL, V3(-0.3, 0, -0.15), dt); pose(elL, V3(-0.5, 0, 0), dt)
            e.burstT -= dt
            if alive && e.sees && e.burstT <= 0 {
                e.burstT = 0.08 * rage
                e.side = 1 - e.side
                enemyShoot(e, muzzle: e.muzzles[2 + e.side], speed: 42, damage: 5, inaccuracy: 0.025)
            }
        default: // reinforcements
            pose(shR, V3(-2.7, 0, 0.1), dt); pose(elR, V3(0, 0, 0), dt)
            if e.side == 0 {
                e.side = 1
                if alive && enemies.count < 16 {
                    for k in [EnemyKind.trooper, .trooper, .skitter, .skitter] { spawnEnemy(k) }
                    hud.feedLine("HITLER ruft Verstärkung", NSColor(srgbRed: 1, green: 0.4, blue: 0.3, alpha: 1))
                    audio.play("wave", vol: 0.8)
                }
            }
        }

        // walking: own movement with a wider collision radius than moveGround (the giant should not wade through cover)
        let desired = V3(dir.x, 0, dir.y) * speed
        let kk = min(1, dt * 4)
        e.vel.x += (desired.x - e.vel.x) * kk
        e.vel.z += (desired.z - e.vel.z) * kk
        var p = V3(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt)
        level.resolve(&p, radius: 1.0, feetY: e.pos.y, height: e.height, step: 0.55)
        let g = level.groundHeight(p.x, p.z, radius: 0.3, feetY: e.pos.y, step: 0.55)
        p.y = g > e.pos.y ? min(g, e.pos.y + dt * 4) : max(g, e.pos.y - dt * 10)
        e.pos = p
        faceToward(e, e.state == 0 && dist > 12 ? dir : toN, dt, rate: 2.2)

        let sp = len2(e.vel)
        let ph = e.anim * 2.4
        let amp = min(1, sp / 1.5) * 0.38
        if e.state != 1 {
            pose(hipL, V3(sin(ph) * amp, 0, 0), dt, rate: 12)
            pose(kneeL, V3(max(0, -cos(ph)) * amp * 1.3, 0, 0), dt, rate: 12)
            pose(hipR, V3(-sin(ph) * amp, 0, 0), dt, rate: 12)
            pose(kneeR, V3(max(0, cos(ph)) * amp * 1.3, 0, 0), dt, rate: 12)
        }
        if e.state == 0 {
            pose(shL, V3(-sin(ph) * amp * 0.9, 0, -0.08), dt); pose(shR, V3(sin(ph) * amp * 0.9, 0, 0.08), dt)
            pose(elL, V3(-0.25, 0, 0), dt); pose(elR, V3(-0.25, 0, 0), dt)
        }
        e.model.simdPosition = V3(0, abs(sin(ph)) * 0.18 * amp, 0)
        // head looks down at the player
        let lookDown = atan2(e.pos.y + 1.73 * k - (pos.y + eyeY), max(dist, 1))
        pose(head, V3(clampf(lookDown, -0.2, 0.6), 0, 0), dt, rate: 5)
        // footsteps shake the arena
        let s: Float = sin(ph) >= 0 ? 1 : -1
        if amp > 0.1 && s != e.stepSign {
            e.stepSign = s
            if dist < 25 { fx.shake(0.07 * (1 - dist / 25) + 0.02) }
            audio.play("land", at: e.pos, listener: pos, yaw: yaw, vol: 1)
        }
    }

    private func updateBoss(_ e: Enemy, _ dt: Float, toN: V2, tangent: V2, dist: Float, alive: Bool) {
        // hover around the player at mid range
        var want = tangent * e.strafe * 0.7
        if dist > 20 { want += toN } else if dist < 12 { want -= toN }
        // hover relative to the player, so a raised platform (Orbital-Dock hub) never puts the camera inside the boss
        let targetY: Float = max(5.6, pos.y + 5.2) + sin(e.anim * 0.8) * 0.7
        let desired = V3(want.x * e.speed, (targetY - e.pos.y) * 2, want.y * e.speed)
        e.vel += (desired - e.vel) * min(1, dt * 1.5)
        var p = e.pos + e.vel * dt
        level.resolve(&p, radius: 2.4, feetY: p.y - 2, height: 4, step: 0)
        // never closer than 4.5 m horizontally while its body overlaps the player's height
        let off = V2(p.x - pos.x, p.z - pos.z)
        let hd = simd_length(off)
        if hd < 4.5 && p.y - 2.3 < pos.y + 2.2 {
            let n = hd > 1e-3 ? off / hd : V2(1, 0)
            p.x = pos.x + n.x * 4.5; p.z = pos.z + n.y * 4.5
        }
        e.pos = p
        faceToward(e, toN, dt, rate: 2.5)
        for (i, s) in e.spinners.enumerated() {
            s.simdEulerAngles = V3(Float(i) * 0.5 + 0.2 + e.anim * (0.5 + Float(i) * 0.25), e.anim * (i % 2 == 0 ? 0.9 : -0.7), Float(i) * 0.4)
        }
        guard alive else { return }
        let rage: Float = e.hp < e.maxHp * 0.4 ? 0.7 : 1
        e.stateT -= dt
        if e.stateT <= 0 {
            e.state = (e.state + 1) % 4
            e.stateT = [3.2, 1.6, 3.0, 1.8][e.state]
            e.burst = 0
            e.burstT = 0.5
            if e.state == 3 && enemies.count < 14 {
                for _ in 0..<(2 + bossCount) { spawnEnemy(.drone, at: e.pos + randUnit() * 3 + V3(0, 1, 0)) }
                hud.feedLine("OVERSEER setzt Drohnen ab", NSColor(srgbRed: 1, green: 0.4, blue: 0.3, alpha: 1))
            }
        }
        e.burstT -= dt
        switch e.state {
        case 0: // aimed volleys
            if e.burstT <= 0 && e.sees {
                e.burstT = 0.2 * rage
                e.side = (e.side + 1) % 3
                enemyShoot(e, muzzle: e.muzzles[e.side], speed: 26, damage: 9, inaccuracy: 0.04)
            }
        case 1: // ground nova: ring of bolts that must be jumped or dodged through the gaps
            if e.burst == 0 && e.burstT <= 0 {
                e.burst = 1
                let c = V3(e.pos.x, 1.0, e.pos.z)
                fx.spawnFlash(at: V3(e.pos.x, 0, e.pos.z), e.kind.glow)
                fx.tracer(from: e.pos - V3(0, 2.5, 0), to: V3(e.pos.x, 0.1, e.pos.z), e.kind.glow, width: 0.5, life: 0.4, intensity: 2)
                audio.play("rail", at: c, listener: pos, yaw: yaw, vol: 0.8)
                let count = 30
                let gap = Int.random(in: 0..<count)
                for k in 0..<count {
                    if (k + gap) % 10 < 2 { continue }
                    let a = Float(k) / Float(count) * 2 * .pi
                    spawnProjectile(pos: c + V3(sin(a), 0, cos(a)) * 2.5, vel: V3(sin(a), 0, cos(a)) * 12, damage: 14, splash: 0, fromPlayer: false,
                                    life: 4.5, radius: 0.16, color: e.kind.glow, gravity: 0, big: false)
                }
            }
        case 2: // rockets
            if e.burstT <= 0 && e.sees {
                e.burstT = 0.75 * rage
                e.side = (e.side + 1) % 3
                enemyShoot(e, muzzle: e.muzzles[1 + e.side % 2], speed: 17, damage: 26, inaccuracy: 0.03, splash: 3.8, lead: 0.5)
            }
        default: break
        }
    }
}
