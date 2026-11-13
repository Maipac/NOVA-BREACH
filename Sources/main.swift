import AppKit
import SceneKit
import SpriteKit
import Metal

// MARK: - view with raw input

final class GameView: SCNView {
    var input: Input!
    var captured = false

    override var acceptsFirstResponder: Bool { true }
    override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }

    override func keyDown(with e: NSEvent) {
        if e.modifierFlags.contains(.command) { super.keyDown(with: e); return }
        if !e.isARepeat { input.key(e.keyCode, true) }
    }
    override func keyUp(with e: NSEvent) { input.key(e.keyCode, false) }
    override func flagsChanged(with e: NSEvent) { input.key(Key.shift, e.modifierFlags.contains(.shift)) }
    override func mouseDown(with e: NSEvent) { input.button(true, at: convert(e.locationInWindow, from: nil)) }
    override func mouseUp(with e: NSEvent) { input.button(false) }
    override func rightMouseDown(with e: NSEvent) {}
    override func mouseMoved(with e: NSEvent) { if captured { input.mouse(Float(e.deltaX), Float(e.deltaY)) } }
    override func mouseDragged(with e: NSEvent) { if captured { input.mouse(Float(e.deltaX), Float(e.deltaY)) } }
    override func rightMouseDragged(with e: NSEvent) { if captured { input.mouse(Float(e.deltaX), Float(e.deltaY)) } }
    override func scrollWheel(with e: NSEvent) {
        if abs(e.scrollingDeltaY) > 0.6 { input.scroll(Float(e.scrollingDeltaY)) }
    }
}

// MARK: - app shell

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    var window: NSWindow!
    var view: GameView!
    var game: Game!
    var cursorHidden = false
    let windowed: Bool
    /// when set: run the autopilot in a window, save one frame to this path and quit (build verification)
    let autotest: String?

    init(windowed: Bool, autotest: String?) { self.windowed = windowed || autotest != nil; self.autotest = autotest }

    func applicationDidFinishLaunching(_ note: Notification) {
        let screen = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        let w = min(1600, screen.width * 0.9), h = min(1000, screen.height * 0.9)
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: w, height: h),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable], backing: .buffered, defer: false)
        window.title = "NOVA BREACH"
        window.collectionBehavior = [.fullScreenPrimary]
        window.backgroundColor = .black
        window.delegate = self
        window.center()
        window.acceptsMouseMovedEvents = true
        window.minSize = NSSize(width: 960, height: 600)

        game = Game(viewSize: CGSize(width: w, height: h), audioEnabled: true)
        view = GameView(frame: NSRect(x: 0, y: 0, width: w, height: h), options: [SCNView.Option.preferredRenderingAPI.rawValue: NSNumber(value: SCNRenderingAPI.metal.rawValue)])
        view.input = game.input
        view.scene = game.scene
        view.pointOfView = game.camNode
        view.overlaySKScene = game.hud.scene
        view.delegate = game
        view.antialiasingMode = .multisampling4X
        view.preferredFramesPerSecond = 120
        view.rendersContinuously = true
        view.isPlaying = true
        view.allowsCameraControl = false
        view.backgroundColor = .black
        view.autoresizingMask = [.width, .height]
        window.contentView = view
        window.makeFirstResponder(view)

        if let path = autotest {
            game.demo = true
            game.demoMortal = CommandLine.arguments.contains("--mortal")
            game.audio.setMaster(0)
            game.onCapture = { _ in }
            let startWave = Int(argValue("--wave") ?? "1") ?? 1
            let at = Double(argValue("--at") ?? "11") ?? 11
            if let m = MapID.fromArg(argValue("--map")) { game.setMap(m) }
            if args.contains("--menutest") {
                // drives the main menu with real input (no autopilot) and reports what happened
                game.demo = false
                let savedMap = UserDefaults.standard.object(forKey: "map")
                let g = game!, v = view!
                func cardPoint(_ i: Int, _ y: CGFloat) -> CGPoint {
                    let b = v.bounds, s = max(0.6, min(b.height / 900, b.width / 1440))
                    return CGPoint(x: b.midX + CGFloat(i) * s, y: b.midY + y * s)
                }
                func click(_ p: CGPoint) { g.input.button(true, at: p); DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) { g.input.button(false) } }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                    print("menutest start map \(g.mapID.name) phase \(g.phase)")
                    g.input.key(Key.right, true); g.input.key(Key.right, false)
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 3.5) {
                    print("menutest after right-arrow map \(g.mapID.name)")
                    click(cardPoint(-200, 70))
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 4.5) {
                    print("menutest after clicking left card map \(g.mapID.name)")
                    click(cardPoint(0, -80))
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 6.0) {
                    print("menutest after clicking STARTEN phase \(g.phase) map \(g.mapID.name) pos \(g.pos)")
                    g.input.key(Key.esc, true); g.input.key(Key.esc, false)
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 6.6) {
                    print("menutest after esc phase \(g.phase)")
                    g.input.key(Key.q, true); g.input.key(Key.q, false)
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 7.3) {
                    print("menutest after q phase \(g.phase) map \(g.mapID.name)")
                    if let m = savedMap { UserDefaults.standard.set(m, forKey: "map") } else { UserDefaults.standard.removeObject(forKey: "map") }
                }
            } else if !args.contains("--menu") {
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in self?.game.autoStart = true }
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) { [weak self] in if startWave > 1 { self?.game.wave = startWave - 1 } }
            DispatchQueue.main.asyncAfter(deadline: .now() + at) { [weak self] in
                guard let self = self else { return }
                savePNG(self.view.snapshot(), path)
                print("phase \(self.game.phase) hp \(Int(self.game.hp)) fxNodes \(self.game.fx.root.childNodes.count)")
                print("autotest ok: wave \(self.game.wave) score \(self.game.score) kills \(self.game.kills) fps \(String(format: "%.0f", self.game.fpsAverage)) view \(Int(self.view.bounds.width))x\(Int(self.view.bounds.height))")
                exit(0)
            }
        } else {
            game.onCapture = { [weak self] on in self?.setCapture(on) }
        }
        game.onToggleFullscreen = { [weak self] in self?.window.toggleFullScreen(nil) }

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        if !windowed { window.toggleFullScreen(nil) }
    }

    func setCapture(_ on: Bool) {
        if on && !NSApp.isActive { return }
        view.captured = on
        if on {
            if let s = NSScreen.screens.first {
                let f = window.frame
                CGWarpMouseCursorPosition(CGPoint(x: f.midX, y: s.frame.height - f.midY))
            }
            CGAssociateMouseAndMouseCursorPosition(0)
            if !cursorHidden { NSCursor.hide(); cursorHidden = true }
        } else {
            CGAssociateMouseAndMouseCursorPosition(1)
            if cursorHidden { NSCursor.unhide(); cursorHidden = false }
        }
    }

    func applicationDidResignActive(_ note: Notification) {
        if autotest != nil { return }
        game.input.releaseAll()
        game.pauseRequested = true
        setCapture(false)
    }

    func windowWillClose(_ note: Notification) { NSApp.terminate(nil) }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func applicationWillTerminate(_ note: Notification) { CGAssociateMouseAndMouseCursorPosition(1) }
}

func buildMenu() {
    let main = NSMenu()
    let appItem = NSMenuItem()
    main.addItem(appItem)
    let appMenu = NSMenu()
    appMenu.addItem(withTitle: "Über NOVA BREACH", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
    appMenu.addItem(.separator())
    appMenu.addItem(withTitle: "NOVA BREACH ausblenden", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
    appMenu.addItem(withTitle: "NOVA BREACH beenden", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
    appItem.submenu = appMenu
    let winItem = NSMenuItem()
    main.addItem(winItem)
    let winMenu = NSMenu(title: "Fenster")
    let fs = winMenu.addItem(withTitle: "Vollbild umschalten", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
    fs.keyEquivalentModifierMask = [.command, .control]
    winMenu.addItem(withTitle: "Minimieren", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
    winItem.submenu = winMenu
    NSApp.mainMenu = main
}

// MARK: - headless test / tooling modes

func savePNG(_ img: NSImage, _ path: String) {
    guard let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:]) else { return }
    try? png.write(to: URL(fileURLWithPath: path))
}

/// Simulates the game without a window and writes screenshots (used to verify the build).
func runHeadless(dir: String, startWave: Int, seconds: Double, every: Double) {
    let size = CGSize(width: 1600, height: 900)
    let game = Game(viewSize: size, audioEnabled: false)
    game.demo = true
    game.demoMortal = CommandLine.arguments.contains("--mortal")
    if let m = MapID.fromArg(argValue("--map")) { game.setMap(m) }
    let renderer = SCNRenderer(device: MTLCreateSystemDefaultDevice(), options: nil)
    renderer.scene = game.scene
    renderer.pointOfView = game.camNode
    renderer.overlaySKScene = game.hud.scene
    renderer.isPlaying = true
    var t = 0.0
    let dt = 1.0 / 60
    func shot(_ name: String) {
        let img = renderer.snapshot(atTime: t, with: size, antialiasingMode: .multisampling4X)
        savePNG(img, "\(dir)/\(name).png")
    }
    for _ in 0..<60 { t += dt; game.tick(Float(dt)); renderer.update(atTime: t) }
    shot("00_menu")
    game.startGame()
    if startWave > 1 { game.wave = startWave - 1 }
    var next = every
    var idx = 1
    var elapsed = 0.0
    let wall = Date()
    while elapsed < seconds {
        t += dt; elapsed += dt
        game.tick(Float(dt))
        renderer.update(atTime: t)
        if elapsed >= next {
            shot(String(format: "%02d_t%03d", idx, Int(elapsed)))
            idx += 1; next += every
        }
    }
    print("phase \(game.phase) hp \(Int(game.hp))")
    if CommandLine.arguments.contains("--debugpos") {
        print(String(format: "player %.1f %.1f %.1f yaw %.2f", game.pos.x, game.pos.y, game.pos.z, game.yaw))
        for e in game.enemies {
            print(String(format: "  %@ %.1f %.1f %.1f sees %d spawnT %.2f hp %.0f/%.0f", e.kind.displayName, e.pos.x, e.pos.y, e.pos.z, e.sees ? 1 : 0, e.spawnT, e.hp, e.maxHp))
            let nav = game.level.nav!
            let (cx, cz) = nav.cell(e.pos.x, e.pos.z)
            let dir = nav.direction(from: e.pos, toward: game.pos)
            print(String(format: "     cell %d,%d dist %d h %.1f blocked %d dir %.2f %.2f", cx, cz, nav.dist[cz * Nav.n + cx], nav.height[cz * Nav.n + cx], nav.blocked[cz * Nav.n + cx] ? 1 : 0, dir.x, dir.y))
        }
    }
    print("headless ok: wave \(game.wave) score \(game.score) kills \(game.kills) enemies \(game.enemies.count) sim \(seconds)s in \(String(format: "%.1f", Date().timeIntervalSince(wall)))s")
}

/// Renders every enemy type side by side (model check).
func runLineup(dir: String) {
    let size = CGSize(width: 1600, height: 900)
    let game = Game(viewSize: size, audioEnabled: false)
    let renderer = SCNRenderer(device: MTLCreateSystemDefaultDevice(), options: nil)
    renderer.scene = game.scene
    let camNode = SCNNode()
    camNode.camera = game.camera
    game.scene.rootNode.addChildNode(camNode)
    renderer.pointOfView = camNode
    var x: Float = 1.5
    for k in EnemyKind.allCases where k != .tyrant {
        let e = Enemy(kind: k, pos: V3(x, k == .drone ? 1.6 : (k == .boss ? 4.4 : 0), k == .boss ? 12 : 16), hpScale: 1)
        e.node.simdScale = V3(1, 1, 1)
        e.node.simdEulerAngles = V3(0, 0.45, 0)
        game.scene.rootNode.addChildNode(e.node)
        x += k == .brute ? 4.5 : (k == .trooper ? 2.6 : 2.4)
    }
    func shot(_ name: String, _ pos: V3, _ look: V3, fov: CGFloat) {
        camNode.simdPosition = pos; camNode.simdLook(at: look); game.camera.fieldOfView = fov
        savePNG(renderer.snapshot(atTime: 1, with: size, antialiasingMode: .multisampling4X), "\(dir)/\(name).png")
    }
    // the wave-15 giant on its own
    let t = Enemy(kind: .tyrant, pos: V3(0, 0, 4), hpScale: 1)
    t.node.simdScale = V3(1, 1, 1)
    t.node.simdEulerAngles = V3(0, 0.2, 0)
    game.scene.rootNode.addChildNode(t.node)
    shot("tyrant_front", V3(2, 4.2, 20), V3(0, 4.6, 4), fov: 55)
    shot("tyrant_head", V3(1.2, 8.2, 9.5), V3(0, 7.9, 4), fov: 45)
    t.node.removeFromParentNode()
    shot("lineup_small", V3(5.0, 1.5, 21.5), V3(5.4, 1.0, 16), fov: 55)
    shot("lineup_big", V3(12, 3.0, 26), V3(12.5, 2.8, 14), fov: 55)
    shot("sky", V3(0, 1.7, 20), V3(-18, 16, -10), fov: 70)
    shot("sun", V3(-10, 1.7, -24), V3(-10, 1.7, -24) + Tex.sunDir * 10, fov: 70)
    shot("planet", V3(6, 1.7, 22), V3(6, 1.7, 22) + Tex.planetDir * 10, fov: 75)
}

/// Renders the app icon (the Overseer in front of the gas giant) into a 1024 px PNG.
func runIcon(path: String) {
    let game = Game(viewSize: CGSize(width: 1024, height: 1024), audioEnabled: false)
    let renderer = SCNRenderer(device: MTLCreateSystemDefaultDevice(), options: nil)
    renderer.scene = game.scene
    let camNode = SCNNode()
    camNode.camera = game.camera
    game.camera.vignettingIntensity = 0
    game.camera.colorFringeStrength = 0
    game.scene.rootNode.addChildNode(camNode)
    renderer.pointOfView = camNode
    let base = V3(0, 60, 0)
    let e = Enemy(kind: .boss, pos: base, hpScale: 1)
    e.node.simdScale = V3(1, 1, 1)
    game.scene.rootNode.addChildNode(e.node)
    // look past the boss toward the planet so it sits behind its shoulder
    let toPlanet = Tex.planetDir
    let side = simd_normalize(simd_cross(toPlanet, V3(0, 1, 0)))
    let camPos = base - toPlanet * 13 + side * 2.2 + V3(0, -1.0, 0)
    camNode.simdPosition = camPos
    camNode.simdLook(at: base + side * 0.3 + V3(0, 0.2, 0))
    let d = camPos - base
    e.node.simdEulerAngles = V3(0, atan2(d.x, d.z) - 0.35, 0)
    game.camera.fieldOfView = 38
    let shot = renderer.snapshot(atTime: 1, with: CGSize(width: 1024, height: 1024), antialiasingMode: .multisampling4X)
    let out = NSImage(size: NSSize(width: 1024, height: 1024))
    out.lockFocus()
    let rect = NSRect(x: 100, y: 100, width: 824, height: 824)
    let clip = NSBezierPath(roundedRect: rect, xRadius: 185, yRadius: 185)
    NSGraphicsContext.saveGraphicsState()
    clip.addClip()
    NSColor.black.setFill(); rect.fill()
    shot.draw(in: rect, from: .zero, operation: .sourceOver, fraction: 1)
    NSGradient(colors: [NSColor(white: 0, alpha: 0.55), NSColor(white: 0, alpha: 0)])?.draw(in: NSRect(x: 100, y: 100, width: 824, height: 300), angle: 90)
    let style = NSMutableParagraphStyle(); style.alignment = .center
    let attrs: [NSAttributedString.Key: Any] = [
        .font: NSFont(name: "AvenirNextCondensed-Heavy", size: 150) ?? NSFont.boldSystemFont(ofSize: 150),
        .foregroundColor: NSColor.white, .paragraphStyle: style, .kern: 6,
    ]
    ("NOVA" as NSString).draw(in: NSRect(x: 100, y: 105, width: 824, height: 190), withAttributes: attrs)
    NSGraphicsContext.restoreGraphicsState()
    NSColor(srgbRed: 0.35, green: 0.92, blue: 1, alpha: 0.9).setStroke()
    let border = NSBezierPath(roundedRect: rect.insetBy(dx: 5, dy: 5), xRadius: 180, yRadius: 180)
    border.lineWidth = 10
    border.stroke()
    out.unlockFocus()
    savePNG(out, path)
}

// MARK: - entry

let args = CommandLine.arguments
func argValue(_ name: String) -> String? {
    guard let i = args.firstIndex(of: name), i + 1 < args.count else { return nil }
    return args[i + 1]
}

if let dir = argValue("--shots") {
    runHeadless(dir: dir, startWave: Int(argValue("--wave") ?? "1") ?? 1,
                seconds: Double(argValue("--seconds") ?? "30") ?? 30, every: Double(argValue("--every") ?? "5") ?? 5)
    exit(0)
}

if let dir = argValue("--lineup") { runLineup(dir: dir); exit(0) }
if let path = argValue("--icon") { runIcon(path: path); exit(0) }

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate(windowed: args.contains("--windowed"), autotest: argValue("--autotest"))
app.delegate = delegate
buildMenu()
app.run()
