import SceneKit
import AppKit
import simd

// Perks of the current run, the upgrade choice after each wave, cores, the Labor and wave events.

extension Game {

    // MARK: - perk values

    func perk(_ p: PerkID) -> Int { perkLevels[p] ?? 0 }
    func hasPerk(_ p: PerkID) -> Bool { perk(p) > 0 }

    var damageMul: Float { 1 + 0.12 * Float(perk(.damage)) }
    var reloadMul: Float { pow(0.8, Float(perk(.reload))) }
    var fireRateMul: Float { 1 + 0.1 * Float(perk(.fireRate)) }
    var moveMul: Float { 1 + 0.08 * Float(perk(.speed)) }
    var dashCooldown: Float { 2.2 * pow(0.75, Float(perk(.dash))) }
    var shieldRegenMul: Float { 1 + 0.25 * Float(perk(.shield)) }
    var abilityCooldown: Float { meta.ability.cooldown * pow(0.75, Float(perk(.abilityCooldown))) }
    /// duration multiplier from VERSTÄRKUNG (the grenade scales damage and radius instead, see useAbility)
    var abilityPower: Float { 1 + 0.5 * Float(perk(.abilityPower)) }
    var enemyTimeScale: Float { slowT > 0 ? 0.3 : 1 }
    var gravityScale: Float { event == .lowGravity ? 0.4 : 1 }

    func applyPerk(_ p: PerkID) {
        perkLevels[p, default: 0] += 1
        switch p {
        case .vital:
            maxHp += 25
            hp = min(maxHp, hp + 25)
        case .shield:
            maxShield += 25
            shield = min(maxShield, shield + 25)
        case .magazine:
            let k = 1 + 0.25 * Float(perk(.magazine))
            for w in weapons {
                w.mag = Int((Float(w.def.mag) * k).rounded())
                w.ammo = w.mag
            }
        case .ammo:
            let k = 1 + 0.5 * Float(perk(.ammo))
            for w in weapons where w.def.reserveMax > 0 {
                w.reserveMax = Int(Float(w.def.reserveMax) * k)
                w.reserve = w.reserveMax
            }
        default: break
        }
    }

    /// Up to n different perks the player can still take, weighted so stats come up a bit more often than mods.
    func rollPerks(_ n: Int) -> [PerkID] {
        var pool: [(perk: PerkID, weight: Float)] = PerkID.allCases.compactMap { p in
            guard meta.has(p), perk(p) < p.maxLevel else { return nil }
            switch p.category {
            case .stat: return (p, 1.0)
            case .mod: return (p, 0.85)
            case .ability: return (p, 0.6)
            }
        }
        var out: [PerkID] = []
        while out.count < n && !pool.isEmpty {
            let total = pool.reduce(Float(0)) { $0 + $1.weight }
            var r = frand(0, total)
            var pick = pool.count - 1
            for (i, e) in pool.enumerated() {
                r -= e.weight
                if r <= 0 { pick = i; break }
            }
            out.append(pool[pick].perk)
            pool.remove(at: pick)
        }
        return out
    }

    // MARK: - upgrade choice after a wave

    func openPerkChoice() {
        guard phase == .playing else { return }
        perkChoices = rollPerks(3)
        guard !perkChoices.isEmpty else { return }   // everything maxed out
        phase = .perks
        perkT = 0
        scene.isPaused = true
        input.releaseAll()
        let a = meta.ability
        let cards = perkChoices.map { p in
            PerkCard(tag: p.tag, name: p.name, desc: p.desc(a), level: perk(p), maxLevel: p.maxLevel, color: p.color(a))
        }
        hud.showPerks(cards, wave: wave, cores: meta.cores, next: nextWavePreview())
        audio.play("power", vol: 0.6)
        audio.musicVolume = 0.25
        DispatchQueue.main.async { self.onCapture?(false) }
    }

    /// What the upgrade screen says about the coming wave.
    func nextWavePreview() -> (text: String, color: V3) {
        let n = wave + 1
        if n == 15 { return ("NÄCHSTE WELLE:  ENDGEGNER", V3(1, 0.3, 0.25)) }
        if n % 5 == 0 { return ("NÄCHSTE WELLE:  BOSS – OVERSEER", V3(1, 0.3, 0.25)) }
        if let ev = nextEvent { return ("NÄCHSTE WELLE:  \(ev.name)  –  \(ev.desc)  ·  +\(ev.bonusCores) Kerne", ev.color) }
        return ("NÄCHSTE WELLE:  keine besonderen Vorkommnisse", V3(0.6, 0.75, 0.85))
    }

    func updatePerkChoice(_ dt: Float, _ inp: InputFrame) {
        perkT += dt
        if demo {
            if perkT > 0.6 { choosePerk(Int.random(in: 0..<perkChoices.count)) }
            return
        }
        // ignore keys and clicks that were already on their way when the screen opened
        guard perkT > 0.35 else { return }
        for (i, k) in [Key.n1, Key.n2, Key.n3].enumerated() where inp.hit(k) && i < perkChoices.count {
            choosePerk(i)
            return
        }
        if let c = inp.click, case .perk(let i)? = hud.menuHit(c) { choosePerk(i) }
    }

    func choosePerk(_ i: Int) {
        guard phase == .perks, perkChoices.indices.contains(i) else { return }
        let p = perkChoices[i]
        applyPerk(p)
        perkChoices.removeAll()
        phase = .playing
        scene.isPaused = false
        hud.showGame()
        let lv = perk(p)
        hud.feedLine("UPGRADE  \(p.name)" + (p.maxLevel > 1 ? "  \(lv)/\(p.maxLevel)" : ""), color(p.color(meta.ability)))
        audio.play("pickup")
        audio.musicVolume = 0.42
        // the countdown kept running behind the upgrade screen: leave time to get ready
        intermission = max(intermission, 3.5)
        input.releaseAll()
        DispatchQueue.main.async { self.onCapture?(true) }
    }

    // MARK: - cores

    func earnCores(_ n: Int) {
        guard n > 0 else { return }
        runCores += n
        meta.earn(n)
    }

    /// NOTFALLPROTOKOLL: instead of dying, restart with half health and blast the enemies back.
    func triggerSecondWind() {
        secondWindUsed = true
        hp = 50
        shield = maxShield
        invulnT = 2
        let c = pos + V3(0, 1, 0)
        radialDamage(at: c, radius: 7, damage: 120, playerDamage: 0)
        for e in enemies where !e.dead && !e.kind.isBoss {
            let away = safeNorm(V3(e.pos.x - pos.x, 0, e.pos.z - pos.z), V3(1, 0, 0))
            if simd_distance(e.pos, pos) < 9 { e.vel += away * 14 }
        }
        fx.explosion(at: c, radius: 3, V3(0.4, 1.0, 0.6), shakeAmount: 0.7)
        hud.flash(NSColor(srgbRed: 0.4, green: 1, blue: 0.6, alpha: 1), 0.5, 0.8)
        hud.announce("NOTFALLPROTOKOLL", sub: "Systeme neu gestartet  ·  2 Sekunden unverwundbar", color: NSColor(srgbRed: 0.4, green: 1, blue: 0.6, alpha: 1), hold: 1.6)
        audio.play("power")
    }

    // MARK: - Labor (main menu)

    func openLabor() {
        guard phase == .menu else { return }
        labor = true
        showLabor()
        audio.play("ui")
    }

    func closeLabor() {
        labor = false
        showMainMenu()
        audio.play("ui")
    }

    func showLabor() {
        let abilities = AbilityID.allCases.map { a in
            LaborItem(tag: "ABKLINGZEIT \(Int(a.cooldown)) s", name: a.name, desc: a.desc, cost: a.cost, owned: meta.has(a),
                      equipped: meta.ability == a, affordable: meta.cores >= a.cost, color: a.color)
        }
        let research = PerkID.research.map { p in
            LaborItem(tag: p.tag, name: p.name, desc: p.desc(meta.ability), cost: p.cost, owned: meta.has(p),
                      equipped: false, affordable: meta.cores >= p.cost, color: p.color(meta.ability))
        }
        hud.showLabor(cores: meta.cores, abilities: abilities, research: research)
    }

    func updateLabor(_ inp: InputFrame) {
        if inp.hit(Key.esc) || inp.hit(Key.l) || inp.hit(Key.backspace) { closeLabor(); return }
        guard let c = inp.click, let h = hud.menuHit(c) else { return }
        switch h {
        case .back:
            closeLabor()
        case .ability(let i):
            guard AbilityID.allCases.indices.contains(i) else { return }
            let a = AbilityID.allCases[i]
            if meta.has(a) {
                if meta.ability != a { meta.equip(a); audio.play("swap") }
            } else if meta.buy(a) {
                audio.play("power")
            } else {
                audio.play("empty")
            }
            showLabor()
        case .research(let i):
            guard PerkID.research.indices.contains(i) else { return }
            let p = PerkID.research[i]
            if meta.has(p) { return }
            audio.play(meta.buy(p) ? "power" : "empty")
            showLabor()
        default:
            break
        }
    }

    // MARK: - wave events

    /// Events start at wave 3, never on boss waves and never twice in a row.
    func rollEvent(for w: Int) -> WaveEvent? {
        if w % 5 == 0 { return nil }
        if let t = testEvent { return t }
        guard w >= 3, frand() < 0.45 else { return nil }
        return WaveEvent.allCases.filter { $0 != lastEvent }.randomElement()
    }

    func beginEvent(_ ev: WaveEvent) {
        switch ev {
        case .blackout:
            setBlackout(true)
        case .lowGravity:
            scene.physicsWorld.gravity = SCNVector3(0, -6.5, 0)
        case .emp:
            shield = 0
            hud.flash(NSColor(srgbRed: 0.3, green: 0.9, blue: 1, alpha: 1), 0.35, 0.6)
            audio.play("shieldHit")
        case .swarm, .frenzy, .coreRush:
            break
        }
    }

    /// Ends the running event (also called when a run starts or the player leaves to the menu).
    func endEvent() {
        setBlackout(false)
        scene.physicsWorld.gravity = SCNVector3(0, -16, 0)
        event = nil
    }

    /// Dims every light of the map plus sky and reflections, switches the helmet lamp on. Neon glow stays.
    func setBlackout(_ on: Bool) {
        if on {
            guard dimmedLights.isEmpty else { return }
            level.root.enumerateHierarchy { n, _ in
                if let l = n.light {
                    self.dimmedLights.append((l, l.intensity))
                    l.intensity *= 0.07
                }
            }
            savedEnvironment = (scene.lightingEnvironment.intensity, scene.background.intensity)
            scene.lightingEnvironment.intensity *= 0.12
            scene.background.intensity *= 0.3
            flashlight.isHidden = false
            audio.play("death", vol: 0.35)
        } else {
            for d in dimmedLights { d.light.intensity = d.intensity }
            dimmedLights.removeAll()
            if let s = savedEnvironment {
                scene.lightingEnvironment.intensity = s.light
                scene.background.intensity = s.sky
                savedEnvironment = nil
            }
            flashlight.isHidden = true
        }
    }

    // MARK: - weapon mods

    /// QUERSCHLÄGER: the beam jumps from a hit to the closest other visible enemy.
    func ricochet(from p: V3, after hit: Enemy, damage: Float, color c: V3) {
        var best: Enemy? = nil
        var bd: Float = 8
        for e in enemies where !e.dead && e !== hit && e.spawnT <= 0 {
            let d = simd_distance(e.center, p)
            if d < bd && level.lineOfSight(p, e.center) { bd = d; best = e }
        }
        guard let t = best else { return }
        fx.tracer(from: p, to: t.center, mix3(c, V3(1, 1, 1), 0.4), width: 0.016, life: 0.09, intensity: 2.2)
        damageEnemy(t, damage, at: t.center, dir: safeNorm(t.center - p), crit: false)
    }

    /// BRANDMUNITION: sets an enemy on fire (refreshes, does not stack).
    func ignite(_ e: Enemy) {
        if e.dead { return }
        e.burnT = 3
        e.burnDps = 14 * damageMul
    }

    /// ABPRALLER: a pellet that hit a wall bounces once, bent toward the best target in front of the bounce.
    func bounce(from p: V3, dir d: V3, normal n: V3, damage: Float, color c: V3) -> Bool {
        let o = p + n * 0.05
        var rd = safeNorm(d - 2 * simd_dot(d, n) * n)
        var target: Enemy? = nil
        var bestDot: Float = 0.55
        for e in enemies where !e.dead && e.spawnT <= 0 {
            let to = e.center - o
            let l = simd_length(to)
            if l > 26 || l < 0.3 { continue }
            let k = simd_dot(to / l, rd)
            if k > bestDot && level.lineOfSight(o, e.center) { bestDot = k; target = e }
        }
        if let t = target { rd = safeNorm(t.center + randUnit() * 0.15 - o) }
        let wall = level.raycast(o, rd, 30)
        var bt = wall?.t ?? 30
        var hitE: Enemy? = nil
        var crit = false
        for e in enemies where !e.dead {
            if let h = e.rayHit(o, rd, bt) { bt = h.t; hitE = e; crit = h.crit }
        }
        let end = o + rd * bt
        fx.tracer(from: o, to: end, c, width: 0.014, life: 0.07, intensity: 1.6)
        guard let e = hitE else { return false }
        damageEnemy(e, damage * (crit ? 2 : 1), at: end, dir: rd, crit: crit)
        if hasPerk(.scatterBurn) { ignite(e) }
        return true
    }

    /// KETTENBLITZ: every enemy the rail hit arcs to up to three more nearby.
    func chainLightning(from struck: [Enemy], damage: Float, color c: V3) {
        var done = Set(struck.map { ObjectIdentifier($0) })
        for s in struck {
            let from = s.center
            let near = enemies.filter { !$0.dead && $0.spawnT <= 0 && !done.contains(ObjectIdentifier($0)) && simd_distance($0.center, from) < 9 }
                .sorted { simd_distance($0.center, from) < simd_distance($1.center, from) }
            for t in near.prefix(3) {
                done.insert(ObjectIdentifier(t))
                bolt(from: from, to: t.center, c)
                damageEnemy(t, damage, at: t.center, dir: safeNorm(t.center - from), crit: false, silent: true)
            }
        }
    }

    /// Jagged lightning made of short tracer segments.
    func bolt(from a: V3, to b: V3, _ c: V3) {
        var p = a
        let n = 5
        for i in 1...n {
            var q = a + (b - a) * (Float(i) / Float(n))
            if i < n { q += randUnit() * 0.35 }
            fx.tracer(from: p, to: q, mix3(c, V3(1, 1, 1), 0.5), width: 0.03, life: 0.16, intensity: 3)
            p = q
        }
        fx.glowPop(at: b, c, size: 1.2, intensity: 1.8, life: 0.15)
    }

    /// STREUBOMBE: five bomblets fly out of a plasma explosion.
    func scatterBomblets(at p: V3, color c: V3) {
        for k in 0..<5 {
            let a = Float(k) / 5 * 2 * .pi + frand(-0.3, 0.3)
            let h = frand(5, 8)
            let v = V3(cos(a) * h, frand(5, 8), sin(a) * h)
            let b = spawnProjectile(pos: p + V3(0, 0.3, 0), vel: v, damage: 40 * damageMul, splash: 2.6, fromPlayer: true,
                                    life: 3, radius: 0.12, color: c, gravity: 16, big: false)
            b.sub = true
            b.selfDamage = 0
        }
    }

    // MARK: - test hooks

    /// --perks a,b,c|all   --ability turret   --event blackout (autotest and headless runs)
    func applyTestArgs() {
        if let s = argValue("--perks") {
            testPerks = s == "all" ? PerkID.allCases : s.split(separator: ",").compactMap { PerkID(rawValue: String($0)) }
        }
        if let a = argValue("--ability").flatMap({ AbilityID(rawValue: $0) }) { meta.force(a) }
        if let e = argValue("--event").flatMap({ WaveEvent(rawValue: $0) }) { testEvent = e }
    }
}
