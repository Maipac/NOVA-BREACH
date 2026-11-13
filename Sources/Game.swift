import SceneKit
import SpriteKit
import AppKit
import simd

// MARK: - Input (written on the main thread, consumed on the render thread)

enum Key {
    static let a: UInt16 = 0, s: UInt16 = 1, d: UInt16 = 2, f: UInt16 = 3, q: UInt16 = 12, w: UInt16 = 13
    static let e: UInt16 = 14, r: UInt16 = 15, n1: UInt16 = 18, n2: UInt16 = 19, n3: UInt16 = 20, n4: UInt16 = 21
    static let ret: UInt16 = 36, m: UInt16 = 46, space: UInt16 = 49, esc: UInt16 = 53, shift: UInt16 = 56
    static let left: UInt16 = 123, right: UInt16 = 124
}

struct InputFrame {
    var keys = Set<UInt16>()
    var pressed: [UInt16] = []
    var dx: Float = 0, dy: Float = 0
    var fire = false, clicked = false
    var scroll: Float = 0
    /// where the last click landed, in view coordinates (origin bottom-left, like the HUD scene)
    var click: CGPoint? = nil
    func down(_ k: UInt16) -> Bool { keys.contains(k) }
    func hit(_ k: UInt16) -> Bool { pressed.contains(k) }
}

final class Input {
    private let lock = NSLock()
    private var f = InputFrame()

    func key(_ k: UInt16, _ down: Bool) {
        lock.lock(); defer { lock.unlock() }
        if down {
            if f.keys.insert(k).inserted { f.pressed.append(k) }
        } else {
            f.keys.remove(k)
        }
    }
    func mouse(_ x: Float, _ y: Float) { lock.lock(); f.dx += x; f.dy += y; lock.unlock() }
    func button(_ down: Bool, at p: CGPoint? = nil) {
        lock.lock(); f.fire = down; if down { f.clicked = true; f.click = p }; lock.unlock()
    }
    func scroll(_ v: Float) { lock.lock(); f.scroll += v; lock.unlock() }
    func releaseAll() { lock.lock(); f.keys.removeAll(); f.fire = false; lock.unlock() }
    /// Returns the accumulated state and resets the one-shot parts.
    func frame() -> InputFrame {
        lock.lock(); defer { lock.unlock() }
        let out = f
        f.pressed.removeAll(keepingCapacity: true)
        f.dx = 0; f.dy = 0; f.clicked = false; f.scroll = 0; f.click = nil
        return out
    }
}

// MARK: - Weapons

enum WeaponKind { case hitscan, rail, launcher }

struct WeaponDef {
    let name: String, short: String
    let kind: WeaponKind
    let damage: Float
    let pellets: Int
    let spread: Float
    let interval: Float
    let mag: Int
    let reload: Float
    let color: V3
    let kick: Float
    let sound: String
    let reserveMax: Int      // -1 = unlimited
    let reserveStart: Int
}

final class Weapon {
    let def: WeaponDef
    let node: SCNNode
    let muzzle: SCNNode
    let flash: SCNNode
    var ammo: Int
    var reserve: Int
    var cooldown: Float = 0
    init(_ def: WeaponDef, _ node: SCNNode, _ muzzle: SCNNode, _ flash: SCNNode) {
        self.def = def; self.node = node; self.muzzle = muzzle; self.flash = flash
        ammo = def.mag; reserve = def.reserveStart
    }
    func reset() { ammo = def.mag; reserve = def.reserveStart; cooldown = 0 }
}

final class Projectile {
    var pos: V3
    var vel: V3
    let damage: Float
    let splash: Float
    let fromPlayer: Bool
    var life: Float
    let radius: Float
    let color: V3
    let gravity: Float
    let node: SCNNode
    init(pos: V3, vel: V3, damage: Float, splash: Float, fromPlayer: Bool, life: Float, radius: Float, color: V3, gravity: Float, node: SCNNode) {
        self.pos = pos; self.vel = vel; self.damage = damage; self.splash = splash; self.fromPlayer = fromPlayer
        self.life = life; self.radius = radius; self.color = color; self.gravity = gravity; self.node = node
    }
}

enum PickupKind { case health, ammo, power }

final class Pickup {
    let kind: PickupKind
    var pos: V3
    let node: SCNNode
    var life: Float = 28
    var t: Float = frand(0, 6)
    init(kind: PickupKind, pos: V3, node: SCNNode) { self.kind = kind; self.pos = pos; self.node = node }
}

enum Phase { case menu, playing, paused, dead }

// MARK: - Game

final class Game: NSObject, SCNSceneRendererDelegate {
    let scene = SCNScene()
    var level: Level
    /// selected map, remembered between launches
    var mapID: MapID = MapID(rawValue: UserDefaults.standard.integer(forKey: "map")) ?? .helix
    let fx: Effects
    let hud: HUD
    let audio: Audio
    let input = Input()

    // camera rig
    let camNode = SCNNode()
    let camera = SCNCamera()
    let weaponRoot = SCNNode()
    let weaponHolder = SCNNode()

    // callbacks into the app shell (always invoked on the main thread)
    var onCapture: ((Bool) -> Void)?
    var onToggleFullscreen: (() -> Void)?

    var phase = Phase.menu
    var time: Float = 0
    var lastRenderTime: TimeInterval = 0
    var demo = false
    /// set from the main thread when the app loses focus
    var pauseRequested = false
    var autoStart = false
    /// autopilot without invulnerability (tests the game-over path)
    var demoMortal = false
    var fpsAverage: Double = 0
    var menuAngle: Float = 0.6

    // player
    var pos = V3(0, 0, 15)
    var vel = V3(0, 0, 0)
    var yaw: Float = 0
    var pitch: Float = 0
    var hp: Float = 100
    var shield: Float = 100
    var sinceHurt: Float = 10
    var onGround = true
    var coyote: Float = 0
    var jumpBuffer: Float = 0
    var dashCD: Float = 0
    var dashT: Float = 0
    var dashDir = V3(0, 0, -1)
    var eyeY: Float = 1.7
    var bob: Float = 0
    var fov: Float = 64
    var overcharge: Float = 0
    var deadT: Float = 0
    var stepT: Float = 0

    // weapons
    var weapons: [Weapon] = []
    var cur = 0
    var pendingWeapon = -1
    var switchT: Float = 0
    var reloadT: Float = 0
    var reloadDur: Float = 1
    var kickZ: Float = 0
    var kickRot: Float = 0
    var bloom: Float = 0
    var sway = V2(0, 0)
    var recoilPitch: Float = 0
    var flashT: Float = 0
    var hitSoundT: Float = 0

    // world
    var enemies: [Enemy] = []
    var projectiles: [Projectile] = []
    var pickups: [Pickup] = []
    var navT: Float = 0
    var trail: SCNParticleSystem!
    var gateBoost: [Float] = [0, 0, 0, 0]

    // waves / score
    var wave = 0
    var spawnQueue: [EnemyKind] = []
    var spawnT: Float = 0
    var intermission: Float = 3
    var waveActive = false
    var score = 0
    var combo = 0
    var comboT: Float = 0
    var kills = 0
    var shotsFired = 0
    var shotsHit = 0
    var timeAlive: Float = 0
    var bossCount = 0

    var eye: V3 { V3(pos.x, pos.y + eyeY, pos.z) }
    var viewDir: V3 { V3(-sin(yaw) * cos(pitch), sin(pitch), -cos(yaw) * cos(pitch)) }
    var fwd: V3 { V3(-sin(yaw), 0, -cos(yaw)) }
    var rightV: V3 { V3(cos(yaw), 0, -sin(yaw)) }

    init(viewSize: CGSize, audioEnabled: Bool) {
        Tex.preload()
        level = Level(scene: scene, map: mapID)
        fx = Effects(scene: scene)
        hud = HUD(size: viewSize)
        audio = Audio(enabled: audioEnabled)
        super.init()
        setupCamera()
        buildWeapons()
        setupTrail()
        scene.physicsWorld.gravity = SCNVector3(0, -16, 0)
        showMainMenu()
        weaponRoot.isHidden = true
        updateMenuCamera(0)
    }

    private func setupCamera() {
        camera.wantsHDR = true
        camera.wantsExposureAdaptation = false
        camera.exposureOffset = 0.1
        camera.bloomIntensity = 0.55
        camera.bloomThreshold = 1.0
        camera.bloomBlurRadius = 12
        camera.screenSpaceAmbientOcclusionIntensity = 0.75
        camera.screenSpaceAmbientOcclusionRadius = 0.7
        camera.screenSpaceAmbientOcclusionBias = 0.03
        camera.vignettingIntensity = 0.55
        camera.vignettingPower = 1.3
        camera.colorFringeStrength = 0.6
        camera.colorFringeIntensity = 0.35
        camera.saturation = 1.12
        camera.contrast = 0.18
        camera.zNear = 0.03
        camera.zFar = 600
        camera.fieldOfView = CGFloat(fov)
        camNode.camera = camera
        scene.rootNode.addChildNode(camNode)
        weaponRoot.simdScale = V3(0.2, 0.2, 0.2)
        camNode.addChildNode(weaponRoot)
        weaponRoot.addChildNode(weaponHolder)
    }

    private func setupTrail() {
        let t = SCNParticleSystem()
        t.particleImage = Tex.glow
        t.birthRate = 70
        t.particleLifeSpan = 0.3
        t.particleLifeSpanVariation = 0.1
        t.particleSize = 0.28
        t.particleSizeVariation = 0.1
        t.particleVelocity = 0.3
        t.spreadingAngle = 180
        t.blendMode = .additive
        t.isLightingEnabled = false
        let a = CAKeyframeAnimation(); a.values = [0.7, 0]; a.keyTimes = [0, 1]
        let sz = CAKeyframeAnimation(); sz.values = [1, 0.2]; sz.keyTimes = [0, 1]
        t.propertyControllers = [.opacity: SCNParticlePropertyController(animation: a), .size: SCNParticlePropertyController(animation: sz)]
        trail = t
    }

    // MARK: render loop entry

    func renderer(_ renderer: SCNSceneRenderer, updateAtTime t: TimeInterval) {
        var dt = lastRenderTime == 0 ? 1.0 / 60 : t - lastRenderTime
        lastRenderTime = t
        if dt > 0.001 { fpsAverage = fpsAverage == 0 ? 1 / dt : fpsAverage * 0.98 + (1 / dt) * 0.02 }
        dt = min(max(dt, 0.0005), 1.0 / 20)
        tick(Float(dt))
    }

    func tick(_ dtReal: Float) {
        var inp = input.frame()
        if demo { demoInput(&inp) }
        hud.resizeIfNeeded()
        if pauseRequested {
            pauseRequested = false
            if phase == .playing { setPaused(true); return }
        }

        if inp.hit(Key.m) { audio.musicOn.toggle(); audio.play("ui") }
        if inp.hit(Key.f) { DispatchQueue.main.async { self.onToggleFullscreen?() } }

        switch phase {
        case .menu:
            updateMenuCamera(dtReal)
            fx.update(dtReal)
            let n = MapID.allCases.count
            if inp.hit(Key.left) || inp.hit(Key.a) { setMap(MapID(rawValue: (mapID.rawValue + n - 1) % n)!) }
            if inp.hit(Key.right) || inp.hit(Key.d) { setMap(MapID(rawValue: (mapID.rawValue + 1) % n)!) }
            for (i, k) in [Key.n1, Key.n2, Key.n3, Key.n4].enumerated() where inp.hit(k) { if let m = MapID(rawValue: i) { setMap(m) } }
            var start = inp.hit(Key.ret) || inp.hit(Key.space) || autoStart
            if let c = inp.click {
                switch hud.menuHit(c) {
                case .map(let i)?:
                    // clicking the selected card starts it, clicking the other one selects it
                    if i == mapID.rawValue { start = true } else if let m = MapID(rawValue: i) { setMap(m) }
                case .start?: start = true
                case nil: break
                }
            }
            if start { autoStart = false; startGame() }
        case .paused:
            if inp.hit(Key.q) { goToMenu(); return }
            if inp.clicked || inp.hit(Key.esc) || inp.hit(Key.ret) { setPaused(false) }
        case .playing:
            if inp.hit(Key.esc) { setPaused(true); return }
            time += dtReal
            timeAlive += dtReal
            simulate(dtReal, inp)
        case .dead:
            deadT += dtReal
            let dt = dtReal * 0.4
            time += dt
            updateWorld(dt)
            fx.update(dtReal)
            updateDeathCamera(dtReal)
            updateHUD(dtReal)
            if deadT > 1.4 && inp.hit(Key.q) { goToMenu(); return }
            if deadT > 1.4 && (inp.clicked || inp.hit(Key.ret) || inp.hit(Key.space)) { startGame() }
        }
    }

    func setPaused(_ p: Bool) {
        guard phase == .playing || phase == .paused else { return }
        phase = p ? .paused : .playing
        scene.isPaused = p
        audio.play("ui")
        if p { hud.showPause() } else { hud.showGame() }
        audio.musicVolume = p ? 0.15 : 0.42
        input.releaseAll()
        DispatchQueue.main.async { self.onCapture?(!p) }
    }


    /// Removes everything a round left behind (enemies, shots, pickups, effects).
    private func clearWorld() {
        for e in enemies { e.node.removeFromParentNode() }
        for p in projectiles { p.node.removeFromParentNode() }
        for p in pickups { p.node.removeFromParentNode() }
        enemies.removeAll(); projectiles.removeAll(); pickups.removeAll()
        fx.clear()
        for i in 0..<gateBoost.count { gateBoost[i] = 0 }
        for m in level.portalMaterials { m.setValue(NSNumber(value: 0.0), forKey: "u_boost") }
    }

    func showMainMenu() {
        let d = UserDefaults.standard
        let maps = MapID.allCases.map { (id: $0, best: d.integer(forKey: $0.scoreKey), wave: d.integer(forKey: $0.waveKey)) }
        hud.showMenu(maps: maps, selected: mapID.rawValue)
    }

    /// Switches the arena while the main menu is open (the menu camera orbits the selected map).
    func setMap(_ id: MapID) {
        guard phase == .menu, id != mapID else { return }
        level.remove()
        level = Level(scene: scene, map: id)
        mapID = id
        if !demo { UserDefaults.standard.set(id.rawValue, forKey: "map") }
        gateBoost = Array(repeating: 0, count: level.gates.count)
        navT = 0
        showMainMenu()
        audio.play("swap", vol: 0.8)
    }

    func goToMenu() {
        clearWorld()
        phase = .menu
        scene.isPaused = false
        weaponRoot.isHidden = true
        hud.resetTransient()
        showMainMenu()
        audio.play("ui")
        audio.musicVolume = 0.42
        input.releaseAll()
        DispatchQueue.main.async { self.onCapture?(false) }
    }

    func startGame() {
        clearWorld()
        hud.resetTransient()
        pos = level.playerStart; vel = V3(0, 0, 0); yaw = level.playerYaw; pitch = 0
        hp = 100; shield = 100; sinceHurt = 10; onGround = true
        dashCD = 0; dashT = 0; overcharge = 0; eyeY = 1.7; deadT = 0
        for w in weapons { w.reset(); w.node.isHidden = true }
        cur = 0; pendingWeapon = -1; switchT = 0; reloadT = 0; bloom = 0; kickZ = 0; kickRot = 0
        weapons[0].node.isHidden = false
        weaponRoot.isHidden = false
        wave = 0; spawnQueue.removeAll(); intermission = 2.5; waveActive = false
        score = 0; combo = 0; comboT = 0; kills = 0; shotsFired = 0; shotsHit = 0; timeAlive = 0; bossCount = 0
        scene.isPaused = false
        phase = .playing
        hud.showGame()
        hud.announce("BEREIT MACHEN", sub: "Gegner nähern sich über die roten Portale", hold: 1.8)
        audio.play("power", vol: 0.7)
        audio.musicVolume = 0.42
        input.releaseAll()
        DispatchQueue.main.async { self.onCapture?(true) }
    }

    func die() {
        guard phase == .playing else { return }
        phase = .dead
        deadT = 0
        hp = 0
        weaponRoot.isHidden = true
        audio.play("death")
        audio.musicVolume = 0.2
        fx.shake(1)
        hud.flash(NSColor(srgbRed: 1, green: 0.1, blue: 0.05, alpha: 1), 0.6, 0.8)
        let d = UserDefaults.standard
        let best = d.integer(forKey: mapID.scoreKey)
        let newBest = score > best
        if newBest && !demo { d.set(score, forKey: mapID.scoreKey) }
        if wave > d.integer(forKey: mapID.waveKey) && !demo { d.set(wave, forKey: mapID.waveKey) }
        let acc = shotsFired > 0 ? Int(Float(shotsHit) / Float(shotsFired) * 100) : 0
        hud.showGameOver(GameOverStats(score: score, wave: wave, kills: kills, accuracy: min(acc, 100), best: max(best, score), newBest: newBest, time: Int(timeAlive), mapName: mapID.name))
        DispatchQueue.main.async { self.onCapture?(false) }
    }

    // MARK: cameras

    func updateMenuCamera(_ dt: Float) {
        menuAngle += dt * 0.09
        let r = level.menuRadius
        camNode.simdPosition = V3(cos(menuAngle) * r, level.menuHeight + sin(menuAngle * 0.7) * 1.5, sin(menuAngle) * r)
        camNode.simdLook(at: V3(0, level.menuLookY, 0))
        camera.fieldOfView = 62
    }

    /// yaw around the world up axis first, then pitch, then roll – explicit so it never depends on Euler order
    func setCameraRotation(_ p: Float, _ y: Float, _ r: Float) {
        camNode.simdOrientation = simd_quatf(angle: y, axis: V3(0, 1, 0)) * simd_quatf(angle: p, axis: V3(1, 0, 0)) * simd_quatf(angle: r, axis: V3(0, 0, 1))
    }

    func updateDeathCamera(_ dt: Float) {
        let k = min(deadT / 1.1, 1)
        let e = k * k * (3 - 2 * k)
        let y = mixf(eyeY, 0.45, e)
        camNode.simdPosition = V3(pos.x, pos.y + y, pos.z)
        setCameraRotation(pitch * (1 - e) + 0.25 * e, yaw, 0.9 * e)
    }

    // MARK: simulation

    func simulate(_ dt: Float, _ inp: InputFrame) {
        updatePlayer(dt, inp)
        updateWeapons(dt, inp)
        updateWorld(dt)
        updateWaves(dt)
        fx.update(dt)
        updateCamera(dt, inp)
        updateHUD(dt)
    }

    func updateWorld(_ dt: Float) {
        navT -= dt
        if navT <= 0 {
            navT = 0.14
            level.nav.rebuild(target: pos)
        }
        updateEnemies(dt)
        updateProjectiles(dt)
        updatePickups(dt)
        for i in 0..<min(gateBoost.count, level.portalMaterials.count) where gateBoost[i] > 0 {
            gateBoost[i] = max(0, gateBoost[i] - dt * 1.5)
            level.portalMaterials[i].setValue(NSNumber(value: gateBoost[i]), forKey: "u_boost")
        }
    }

    func updatePlayer(_ dt: Float, _ inp: InputFrame) {
        let sens: Float = 0.0021
        yaw -= inp.dx * sens
        pitch = clampf(pitch - inp.dy * sens, -1.5, 1.5)
        yaw = wrapAngle(yaw)

        var wish = V3(0, 0, 0)
        if inp.down(Key.w) { wish += fwd }
        if inp.down(Key.s) { wish -= fwd }
        if inp.down(Key.d) { wish += rightV }
        if inp.down(Key.a) { wish -= rightV }
        let wl = simd_length(wish)
        if wl > 0 { wish /= wl }
        let sprint = inp.down(Key.shift) && inp.down(Key.w) && wl > 0
        let maxSpeed: Float = sprint ? 9.6 : 6.6

        // dash
        dashCD = max(0, dashCD - dt)
        if inp.hit(Key.q) && dashCD <= 0 {
            dashDir = wl > 0 ? wish : fwd
            dashT = 0.17; dashCD = 2.2
            audio.play("dash")
            fx.shake(0.12)
        }
        if dashT > 0 {
            dashT -= dt
            vel.x = dashDir.x * 25; vel.z = dashDir.z * 25
            if dashT <= 0 { vel.x = dashDir.x * maxSpeed; vel.z = dashDir.z * maxSpeed }
        } else {
            let target = wish * maxSpeed
            var dv = V3(target.x - vel.x, 0, target.z - vel.z)
            let accel: Float = onGround ? (wl > 0 ? 70 : 55) : (wl > 0 ? 22 : 2)
            let l = simd_length(dv)
            let maxDv = accel * dt
            if l > maxDv { dv *= maxDv / l }
            vel += dv
        }

        // jump (buffered, with coyote time)
        jumpBuffer = inp.hit(Key.space) ? 0.12 : max(0, jumpBuffer - dt)
        coyote = onGround ? 0.1 : max(0, coyote - dt)
        if jumpBuffer > 0 && coyote > 0 {
            vel.y = 7.8; onGround = false; coyote = 0; jumpBuffer = 0
            audio.play("jump", vol: 0.5)
        }
        vel.y -= 21 * dt

        // horizontal move + collision
        var p = V3(pos.x + vel.x * dt, pos.y, pos.z + vel.z * dt)
        level.resolve(&p, radius: 0.45, feetY: pos.y, height: 1.8)
        for e in enemies where !e.dead && !e.kind.flies {
            let d = V2(p.x - e.pos.x, p.z - e.pos.z)
            let l = simd_length(d), minD = e.radius + 0.4
            if l < minD && l > 1e-3 && abs(e.pos.y - pos.y) < 1.6 {
                let push = d / l * (minD - l) * 0.5
                p.x += push.x; p.z += push.y
            }
        }
        // vertical
        var ny = pos.y + vel.y * dt
        let g = level.groundHeight(p.x, p.z, radius: 0.3, feetY: max(pos.y, ny), step: onGround ? 0.5 : 0.08)
        if ny <= g {
            if !onGround && vel.y < -7 { audio.play("land", vol: min(1, -vel.y / 16)); fx.shake(min(0.25, -vel.y / 60)) }
            ny = g; vel.y = 0; onGround = true
        } else if onGround && ny - g < 0.5 && vel.y <= 0 {
            ny = g; vel.y = 0      // stick to stairs when walking down
        } else {
            onGround = false
        }
        // actual velocity after collision (keeps sliding along walls sane)
        vel.x = (p.x - pos.x) / dt * 0.5 + vel.x * 0.5
        vel.z = (p.z - pos.z) / dt * 0.5 + vel.z * 0.5
        pos = V3(p.x, ny, p.z)

        let sp = len2(vel)
        if onGround && sp > 1 { bob += dt * sp * 1.25 }
        sinceHurt += dt
        if sinceHurt > 4 && shield < 100 { shield = min(100, shield + 24 * dt) }
        if overcharge > 0 { overcharge = max(0, overcharge - dt) }
        if combo > 0 { comboT -= dt / 4.5; if comboT <= 0 { combo = 0 } }
        let targetFov: Float = 64 + (sprint ? 5 : 0) + (dashT > 0 ? 10 : 0)
        fov += (targetFov - fov) * min(1, dt * 9)
    }

    func updateCamera(_ dt: Float, _ inp: InputFrame) {
        // eye height follows smoothly so steps don't snap the view
        let targetEye: Float = 1.7
        eyeY += (targetEye - eyeY) * min(1, dt * 12)
        let sp = min(len2(vel) / 6.6, 1.4)
        let bobY = onGround ? sin(bob * 2) * 0.035 * sp : 0
        let bobX = onGround ? cos(bob) * 0.02 * sp : 0
        let tr = fx.trauma * fx.trauma
        let sh = V3(frand(-1, 1), frand(-1, 1), frand(-1, 1)) * tr * 0.045
        recoilPitch = max(0, recoilPitch - dt * 0.9 - recoilPitch * dt * 9)
        let strafeRoll = -simd_dot(vel, rightV) / 9.6 * 0.022
        camNode.simdPosition = eye + V3(0, bobY, 0) + rightV * bobX
        setCameraRotation(pitch + recoilPitch + sh.x, yaw + sh.y, strafeRoll + sh.z)
        camera.fieldOfView = CGFloat(fov)

        // view model motion
        sway.x += (clampf(-inp.dx * 0.0012, -0.06, 0.06) - sway.x) * min(1, dt * 10)
        sway.y += (clampf(inp.dy * 0.0012, -0.05, 0.05) - sway.y) * min(1, dt * 10)
        kickZ = max(0, kickZ - dt * 1.4 - kickZ * dt * 14)
        kickRot = max(0, kickRot - dt * 0.8 - kickRot * dt * 12)
        var off = V3(0.30 + sway.x + bobX * 0.6, -0.30 + sway.y - bobY * 0.7 - (onGround ? 0 : clampf(vel.y * 0.006, -0.05, 0.05)), -0.84 + kickZ)
        var rot = V3(kickRot + sway.y * 0.6, sway.x * 0.8, sway.x * 0.5)
        if reloadT > 0 {
            let k = sin((1 - reloadT / reloadDur) * .pi)
            off.y -= 0.22 * k; rot.x -= 0.5 * k; rot.z += 0.35 * k
        }
        if switchT > 0 {
            // first half: lower the old weapon, second half: raise the new one
            let k = switchT > 0.14 ? (0.28 - switchT) / 0.14 : switchT / 0.14
            off.y -= 0.45 * k; rot.x -= 0.7 * k
        }
        if inp.down(Key.shift) && inp.down(Key.w) && onGround && reloadT <= 0 { rot.y += 0.25; off.x -= 0.03; off.y -= 0.03 }
        weaponHolder.simdPosition = off
        weaponHolder.simdEulerAngles = rot
        if flashT > 0 {
            flashT -= dt
            if flashT <= 0 { weapons[cur].flash.isHidden = true }
        }
    }

    func updateHUD(_ dt: Float) {
        let w = weapons[cur]
        var pts: [(V2, Bool)] = []
        let cy = cos(yaw), sy = sin(yaw)
        for e in enemies where !e.dead {
            let dx = e.pos.x - pos.x, dz = e.pos.z - pos.z
            // rotate into view space: +y on the radar = forward
            pts.append((V2(dx * cy - dz * sy, -(dx * sy + dz * cy)), e.kind.isBoss))
        }
        hud.setRadar(pts, range: 34)
        let boss = enemies.first { $0.kind.isBoss && !$0.dead }
        hud.update(dt: dt, hp: hp, shield: shield, ammo: w.ammo, reserve: w.def.reserveMax < 0 ? -1 : w.reserve,
                   weaponName: w.def.name, weaponIndex: cur, weaponNames: weapons.map { $0.def.short },
                   weaponUsable: weapons.map { $0.ammo > 0 || $0.reserve != 0 }, weaponColor: w.def.color,
                   spread: w.def.spread * (w.def.pellets > 1 ? 0.5 : 1) + bloom, reloading: reloadT,
                   dash: 1 - dashCD / 2.2, overcharge: overcharge, score: score, combo: comboMult, comboT: comboT,
                   wave: max(wave, 1), enemiesLeft: spawnQueue.count + enemies.filter { !$0.dead }.count,
                   bossName: boss.map { $0.kind == .tyrant ? "HITLER" : "OVERSEER  MK \(bossCount)" }, bossHp: boss.map { $0.hp / $0.maxHp } ?? 0)
    }

    var comboMult: Int { min(1 + combo / 4, 8) }

    // MARK: player damage

    func hurtPlayer(_ amount: Float, from src: V3?) {
        guard phase == .playing, dashT <= 0 else { return }
        if demo && !demoMortal { return }
        var a = amount
        sinceHurt = 0
        if shield > 0 {
            let s = min(shield, a)
            shield -= s; a -= s
            audio.play("shieldHit", vol: 0.7)
            if shield <= 0 { hud.flash(NSColor(srgbRed: 0.3, green: 0.9, blue: 1, alpha: 1), 0.25, 0.3) }
        }
        if a > 0 {
            hp -= a
            audio.play("hurt", vol: 0.9)
        }
        var ang: Float? = nil
        if let s = src {
            let to = safeNorm(V3(s.x - pos.x, 0, s.z - pos.z))
            ang = atan2(simd_dot(to, rightV), simd_dot(to, fwd))
        }
        hud.damage(amount: amount, angle: ang)
        fx.shake(min(0.5, 0.12 + amount / 50))
        if hp <= 0 { die() }
    }

    // MARK: waves

    func updateWaves(_ dt: Float) {
        if !waveActive {
            intermission -= dt
            if intermission <= 0 { startWave() }
            return
        }
        let alive = enemies.count
        if !spawnQueue.isEmpty {
            spawnT -= dt
            let cap = min(8 + wave * 2, 26)
            if spawnT <= 0 && alive < cap {
                spawnEnemy(spawnQueue.removeFirst())
                spawnT = max(0.22, 0.95 - Float(wave) * 0.045) * frand(0.7, 1.3)
            }
        } else if alive == 0 {
            waveActive = false
            intermission = 5.5
            let bonus = 250 * wave
            score += bonus
            hud.announce("WELLE \(wave) GESCHAFFT", sub: "+\(bonus) Bonus  ·  nächste Welle in 5 Sekunden", color: NSColor(srgbRed: 0.4, green: 1, blue: 0.6, alpha: 1), hold: 2.2)
            audio.play("waveClear")
            // resupply
            var spots = level.pickupSpots.shuffled()
            spawnPickup(.health, at: spots.removeFirst())
            spawnPickup(.ammo, at: spots.removeFirst())
            if wave % 3 == 0 { spawnPickup(.power, at: spots.removeFirst()) }
        }
    }

    func startWave() {
        wave += 1
        waveActive = true
        spawnT = 0.6
        let isBoss = wave % 5 == 0
        var budget = 4.5 + Float(wave) * 3.0 + pow(Float(wave), 1.3)
        if isBoss { budget *= 0.45 }
        var pool: [EnemyKind] = [.skitter, .skitter]
        if wave >= 2 { pool += [.drone, .drone] }
        if wave >= 3 { pool += [.trooper, .trooper] }
        if wave >= 4 { pool += [.roller] }
        if wave >= 6 { pool += [.brute] }
        if wave >= 9 { pool += [.trooper, .brute, .roller] }
        var q: [EnemyKind] = []
        var guardCount = 0
        while budget > 0.9 && guardCount < 200 {
            guardCount += 1
            let k = pool.randomElement()!
            if k.cost > budget + 0.5 { continue }
            q.append(k); budget -= k.cost
        }
        q.shuffle()
        // wave 15: the giant instead of the Overseer (the Overseer keeps counting MK 1, 2, 3 …)
        let tyrantWave = wave == 15
        if isBoss { if tyrantWave { q.insert(.tyrant, at: 0) } else { q.insert(.boss, at: 0); bossCount += 1 } }
        spawnQueue = q
        if isBoss {
            hud.announce(tyrantWave ? "ENDGEGNER" : "WARNUNG", sub: tyrantWave ? "HITLER betritt die Arena" : "OVERSEER nähert sich",
                         color: NSColor(srgbRed: 1, green: 0.2, blue: 0.15, alpha: 1), hold: tyrantWave ? 3 : 2.4)
            audio.play("boss")
        } else {
            hud.announce("WELLE \(wave)", sub: "\(q.count) Feindkontakte", hold: 1.5)
            audio.play("wave", vol: 0.8)
        }
    }

    func spawnEnemy(_ kind: EnemyKind, at forced: V3? = nil) {
        // prefer gates that are not right next to the player
        let order = level.gates.indices.sorted { simd_distance(level.gates[$0].pos, pos) > simd_distance(level.gates[$1].pos, pos) }
        let gi = order[Int.random(in: 0..<3)]
        let gate = level.gates[gi]
        let sideV = V3(gate.dir.z, 0, -gate.dir.x)
        var p = forced ?? (gate.pos + sideV * frand(-1.6, 1.6) + gate.dir * frand(0, 1.5))
        if forced == nil {
            if kind == .drone { p.y = 3.2 }
            if kind == .boss { p = gate.pos + gate.dir * 7; p.y = 6.5 }
            if kind == .tyrant { p = gate.pos + gate.dir * 3; p.y = 0 }
            gateBoost[gi] = 1
        }
        let hpScale = 1 + Float(wave - 1) * 0.07 + (kind == .boss ? Float(bossCount - 1) * 0.45 : 0)
        let e = Enemy(kind: kind, pos: p, hpScale: hpScale)
        e.yaw = atan2(pos.x - p.x, pos.z - p.z)
        scene.rootNode.addChildNode(e.node)
        enemies.append(e)
        fx.spawnFlash(at: kind.flies ? p - V3(0, 1, 0) : p, kind.glow)
        audio.play("spawn", at: p, listener: pos, yaw: yaw, vol: 0.9)
    }

    // MARK: demo autopilot (used for automated screenshots)

    var demoWeaponT: Float = 0
    func demoInput(_ inp: inout InputFrame) {
        inp = InputFrame()
        if phase == .menu { return }
        if phase == .dead { return }
        var best: Enemy? = nil
        var bd = Float.greatestFiniteMagnitude
        for e in enemies where !e.dead && e.spawnT <= 0 {
            let d = simd_distance(e.center, eye)
            if d < bd && level.lineOfSight(eye, e.center) { bd = d; best = e }
        }
        inp.keys.insert(Key.w)
        inp.keys.insert(time.truncatingRemainder(dividingBy: 6) < 3 ? Key.a : Key.d)
        if let e = best {
            let to = safeNorm(e.center - eye)
            let ty = atan2(-to.x, -to.z), tp = asin(clampf(to.y, -1, 1))
            let dyaw = wrapAngle(ty - yaw), dp = tp - pitch
            inp.dx = -dyaw * 0.25 / 0.0021
            inp.dy = -dp * 0.25 / 0.0021
            inp.fire = abs(dyaw) < 0.06 && abs(dp) < 0.06
            inp.clicked = inp.fire
        } else {
            let to = safeNorm(V3(0, 1.5, 0) - eye)
            let dyaw = wrapAngle(atan2(-to.x, -to.z) - yaw)
            inp.dx = -dyaw * 0.1 / 0.0021
            inp.dy = pitch * 0.1 / 0.0021
        }
        demoWeaponT += 1.0 / 60
        if demoWeaponT > 5 { demoWeaponT = 0; inp.pressed.append([Key.n1, Key.n2, Key.n3, Key.n4][(cur + 1) % 4]) }
    }
}
