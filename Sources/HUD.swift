import SpriteKit
import AppKit
import simd

private let fontHeavy = "AvenirNextCondensed-Heavy"
private let fontDemi = "AvenirNextCondensed-DemiBold"
private let fontMono = "Menlo-Bold"

private let cCyan = NSColor(srgbRed: 0.35, green: 0.92, blue: 1.0, alpha: 1)
private let cRed = NSColor(srgbRed: 1.0, green: 0.25, blue: 0.2, alpha: 1)
private let cOrange = NSColor(srgbRed: 1.0, green: 0.62, blue: 0.15, alpha: 1)
private let cDim = NSColor(srgbRed: 0.6, green: 0.75, blue: 0.85, alpha: 1)

private func label(_ text: String, _ font: String, _ size: CGFloat, _ color: NSColor = .white,
                   h: SKLabelHorizontalAlignmentMode = .center, v: SKLabelVerticalAlignmentMode = .baseline) -> SKLabelNode {
    let l = SKLabelNode(fontNamed: font)
    l.text = text
    l.fontSize = size
    l.fontColor = color
    l.horizontalAlignmentMode = h
    l.verticalAlignmentMode = v
    return l
}

/// Slanted status bar.
private final class Bar {
    let node = SKNode()
    private let fill = SKShapeNode()
    private let w: CGFloat, h: CGFloat, slant: CGFloat
    private var last: CGFloat = -1
    init(w: CGFloat, h: CGFloat, slant: CGFloat, color: NSColor) {
        self.w = w; self.h = h; self.slant = slant
        let bg = SKShapeNode(path: Bar.path(w, h, slant, 1))
        bg.fillColor = NSColor(white: 0, alpha: 0.45)
        bg.strokeColor = color.withAlphaComponent(0.55)
        bg.lineWidth = 1.5
        node.addChild(bg)
        fill.fillColor = color
        fill.strokeColor = .clear
        node.addChild(fill)
        set(1)
    }
    static func path(_ w: CGFloat, _ h: CGFloat, _ s: CGFloat, _ f: CGFloat) -> CGPath {
        let p = CGMutablePath()
        let x = w * f
        p.move(to: CGPoint(x: 0, y: 0))
        p.addLine(to: CGPoint(x: x, y: 0))
        p.addLine(to: CGPoint(x: x + s, y: h))
        p.addLine(to: CGPoint(x: s, y: h))
        p.closeSubpath()
        return p
    }
    func set(_ f: CGFloat) {
        let v = max(0, min(1, f))
        if abs(v - last) < 0.004 { return }
        last = v
        fill.path = Bar.path(w, h, slant, v)
        fill.isHidden = v <= 0.001
    }
    func setColor(_ c: NSColor) { fill.fillColor = c }
}

struct GameOverStats {
    var score: Int, wave: Int, kills: Int, accuracy: Int, best: Int, newBest: Bool, time: Int
}

final class HUD {
    let scene: SKScene
    private var laidOut = CGSize.zero
    private var s: CGFloat = 1

    // anchors
    private let center = SKNode(), bl = SKNode(), br = SKNode(), tl = SKNode(), tr = SKNode(), tc = SKNode()
    private let gameLayer = SKNode()
    private let overlay = SKNode()

    // crosshair
    private var crossLines: [SKShapeNode] = []
    private let hitMarker = SKNode()
    private var hitLines: [SKShapeNode] = []
    private let dashBar: Bar
    private let reloadLabel = label("", fontDemi, 16, cCyan)
    private let powerLabel = label("", fontHeavy, 20, NSColor(srgbRed: 0.8, green: 0.5, blue: 1, alpha: 1))

    // status
    private let hpBar: Bar, shBar: Bar
    private let hpLabel = label("100", fontHeavy, 54, .white, h: .left)
    private let shLabel = label("100", fontHeavy, 26, cCyan, h: .left)
    private let ammoLabel = label("36", fontHeavy, 72, .white, h: .right)
    private let reserveLabel = label("/ ∞", fontHeavy, 28, cDim, h: .left)
    private let weaponLabel = label("PULSGEWEHR", fontDemi, 20, cCyan, h: .right)
    private var slots: [(box: SKShapeNode, key: SKLabelNode, name: SKLabelNode)] = []
    private let waveLabel = label("WELLE 1", fontHeavy, 30, .white)
    private let enemiesLabel = label("", fontDemi, 17, cDim)
    private let scoreLabel = label("0", fontHeavy, 44, .white, h: .right)
    private let comboLabel = label("", fontHeavy, 26, cOrange, h: .right)
    private let comboBar: Bar
    private let bossNode = SKNode()
    private let bossBar: Bar
    private let bossLabel = label("", fontHeavy, 20, cRed)

    // radar
    private let radar = SKNode()
    private var blips: [SKShapeNode] = []
    private let radarR: CGFloat = 78

    // announcements
    private let announce = label("", fontHeavy, 84, .white)
    private let announceSub = label("", fontDemi, 26, cCyan)
    private var feed: [SKLabelNode] = []

    // screen effects
    private let vignette: SKSpriteNode
    private let lowHp: SKSpriteNode
    private let flashNode: SKSpriteNode
    private var dmgArcs: [SKShapeNode] = []
    private var dmgAngles: [Float] = []
    private var dmgLife: [Float] = []
    private var vignetteAlpha: CGFloat = 0
    private var time: Float = 0

    // menu
    private let dim: SKSpriteNode
    private let menuNode = SKNode()

    init(size: CGSize) {
        scene = SKScene(size: size)
        scene.backgroundColor = .clear
        scene.scaleMode = .resizeFill
        scene.isUserInteractionEnabled = false

        hpBar = Bar(w: 300, h: 16, slant: 8, color: NSColor(srgbRed: 0.3, green: 1.0, blue: 0.55, alpha: 1))
        shBar = Bar(w: 300, h: 9, slant: 5, color: cCyan)
        dashBar = Bar(w: 70, h: 4, slant: 2, color: cCyan)
        comboBar = Bar(w: 120, h: 5, slant: 3, color: cOrange)
        bossBar = Bar(w: 620, h: 14, slant: 8, color: cRed)

        // radial edge texture for damage / low health
        func edgeTexture(_ c: NSColor, power: CGFloat) -> SKTexture {
            let w = 256, h = 256
            var px = [UInt8](repeating: 0, count: w * h * 4)
            let rgb = c.usingColorSpace(.sRGB)!
            for y in 0..<h {
                for x in 0..<w {
                    let u = (CGFloat(x) + 0.5) / CGFloat(w) * 2 - 1, v = (CGFloat(y) + 0.5) / CGFloat(h) * 2 - 1
                    let d = min(1, sqrt(u * u * 0.9 + v * v * 0.9) / 1.25)
                    let a = pow(d, power)
                    px[(y * w + x) * 4] = UInt8(rgb.redComponent * a * 255)
                    px[(y * w + x) * 4 + 1] = UInt8(rgb.greenComponent * a * 255)
                    px[(y * w + x) * 4 + 2] = UInt8(rgb.blueComponent * a * 255)
                    px[(y * w + x) * 4 + 3] = UInt8(a * 255)
                }
            }
            return SKTexture(cgImage: rgbaImage(w, h, px, alpha: true))
        }
        vignette = SKSpriteNode(texture: edgeTexture(NSColor(srgbRed: 1, green: 0.05, blue: 0.02, alpha: 1), power: 2.6))
        lowHp = SKSpriteNode(texture: edgeTexture(NSColor(srgbRed: 0.9, green: 0.0, blue: 0.0, alpha: 1), power: 3.4))
        flashNode = SKSpriteNode(color: .white, size: size)
        dim = SKSpriteNode(color: NSColor(srgbRed: 0.0, green: 0.02, blue: 0.05, alpha: 1), size: size)

        build()
        layout(size)
    }

    private func build() {
        for n in [vignette, lowHp, flashNode] {
            n.alpha = 0; n.zPosition = 1
            scene.addChild(n)
        }
        scene.addChild(gameLayer)
        gameLayer.zPosition = 5
        for a in [center, bl, br, tl, tr, tc] { gameLayer.addChild(a) }
        dim.alpha = 0; dim.zPosition = 20
        scene.addChild(dim)
        overlay.zPosition = 30
        scene.addChild(overlay)
        overlay.addChild(menuNode)

        // crosshair
        for i in 0..<4 {
            let l = SKShapeNode(rectOf: CGSize(width: i < 2 ? 9 : 2.2, height: i < 2 ? 2.2 : 9), cornerRadius: 1)
            l.fillColor = .white; l.strokeColor = NSColor(white: 0, alpha: 0.5); l.lineWidth = 0.8
            center.addChild(l); crossLines.append(l)
        }
        let dot = SKShapeNode(circleOfRadius: 1.6)
        dot.fillColor = cCyan; dot.strokeColor = .clear
        center.addChild(dot)
        for i in 0..<4 {
            let l = SKShapeNode(rectOf: CGSize(width: 12, height: 2.6), cornerRadius: 1)
            l.fillColor = .white; l.strokeColor = .clear
            let a = CGFloat.pi / 4 + CGFloat(i) * .pi / 2
            l.zRotation = a
            l.position = CGPoint(x: cos(a) * 15, y: sin(a) * 15)
            hitMarker.addChild(l); hitLines.append(l)
        }
        hitMarker.alpha = 0
        center.addChild(hitMarker)
        dashBar.node.position = CGPoint(x: -35, y: -46)
        center.addChild(dashBar.node)
        reloadLabel.position = CGPoint(x: 0, y: -78)
        center.addChild(reloadLabel)
        powerLabel.position = CGPoint(x: 0, y: -110)
        center.addChild(powerLabel)
        for _ in 0..<5 {
            let p = CGMutablePath()
            p.addArc(center: .zero, radius: 120, startAngle: .pi / 2 - 0.34, endAngle: .pi / 2 + 0.34, clockwise: false)
            let a = SKShapeNode(path: p)
            a.strokeColor = cRed; a.lineWidth = 9; a.lineCap = .round; a.alpha = 0
            a.glowWidth = 3
            center.addChild(a)
            dmgArcs.append(a); dmgAngles.append(0); dmgLife.append(0)
        }

        // bottom left: health
        let hpTag = label("VITAL", fontDemi, 15, cDim, h: .left)
        hpTag.position = CGPoint(x: 0, y: 84)
        hpLabel.position = CGPoint(x: 0, y: 34)
        shLabel.position = CGPoint(x: 112, y: 36)
        let shTag = label("SCHILD", fontDemi, 13, cCyan.withAlphaComponent(0.8), h: .left)
        shTag.position = CGPoint(x: 112, y: 62)
        hpBar.node.position = CGPoint(x: 0, y: 10)
        shBar.node.position = CGPoint(x: 5, y: -3)
        for n in [hpTag, hpLabel, shLabel, shTag, hpBar.node, shBar.node] as [SKNode] { bl.addChild(n) }

        // bottom right: ammo + weapon slots
        ammoLabel.position = CGPoint(x: -84, y: 30)
        reserveLabel.position = CGPoint(x: -76, y: 34)
        weaponLabel.position = CGPoint(x: 0, y: 100)
        br.addChild(ammoLabel); br.addChild(reserveLabel); br.addChild(weaponLabel)
        for i in 0..<4 {
            let b = SKShapeNode(rectOf: CGSize(width: 64, height: 22), cornerRadius: 3)
            b.position = CGPoint(x: -32 - CGFloat(3 - i) * 70, y: 6)
            b.lineWidth = 1.5
            let k = label("\(i + 1)", fontMono, 11, cDim, h: .left, v: .center)
            k.position = CGPoint(x: -28, y: 0)
            let nm = label("", fontDemi, 12, .white, h: .center, v: .center)
            nm.position = CGPoint(x: 5, y: 0)
            b.addChild(k); b.addChild(nm)
            br.addChild(b)
            slots.append((b, k, nm))
        }

        // top centre: wave / boss
        waveLabel.position = CGPoint(x: 0, y: -44)
        enemiesLabel.position = CGPoint(x: 0, y: -66)
        tc.addChild(waveLabel); tc.addChild(enemiesLabel)
        bossBar.node.position = CGPoint(x: -310, y: -118)
        bossLabel.position = CGPoint(x: 0, y: -98)
        bossNode.addChild(bossBar.node); bossNode.addChild(bossLabel)
        bossNode.isHidden = true
        tc.addChild(bossNode)

        // top right: score
        let scTag = label("PUNKTE", fontDemi, 15, cDim, h: .right)
        scTag.position = CGPoint(x: 0, y: -30)
        scoreLabel.position = CGPoint(x: 0, y: -74)
        comboLabel.position = CGPoint(x: 0, y: -106)
        comboBar.node.position = CGPoint(x: -124, y: -118)
        for n in [scTag, scoreLabel, comboLabel, comboBar.node] as [SKNode] { tr.addChild(n) }
        for i in 0..<5 {
            let f = label("", fontDemi, 16, cDim, h: .right)
            f.position = CGPoint(x: 0, y: -150 - CGFloat(i) * 22)
            f.alpha = 0
            tr.addChild(f); feed.append(f)
        }

        // top left: radar
        radar.position = CGPoint(x: radarR + 6, y: -(radarR + 6))
        let ring = SKShapeNode(circleOfRadius: radarR)
        ring.fillColor = NSColor(srgbRed: 0, green: 0.08, blue: 0.12, alpha: 0.5)
        ring.strokeColor = cCyan.withAlphaComponent(0.7); ring.lineWidth = 1.5
        radar.addChild(ring)
        let ring2 = SKShapeNode(circleOfRadius: radarR * 0.5)
        ring2.fillColor = .clear; ring2.strokeColor = cCyan.withAlphaComponent(0.25); ring2.lineWidth = 1
        radar.addChild(ring2)
        let me = SKShapeNode(path: { let p = CGMutablePath(); p.move(to: CGPoint(x: 0, y: 7)); p.addLine(to: CGPoint(x: 5, y: -5)); p.addLine(to: CGPoint(x: -5, y: -5)); p.closeSubpath(); return p }())
        me.fillColor = .white; me.strokeColor = .clear
        radar.addChild(me)
        for _ in 0..<48 {
            let b = SKShapeNode(circleOfRadius: 3)
            b.fillColor = cRed; b.strokeColor = .clear; b.isHidden = true
            radar.addChild(b); blips.append(b)
        }
        tl.addChild(radar)

        // announcements
        announce.alpha = 0; announceSub.alpha = 0
        gameLayer.addChild(announce); gameLayer.addChild(announceSub)
    }

    func layout(_ size: CGSize) {
        laidOut = size
        s = max(0.6, min(size.height / 900, size.width / 1440))
        let w = size.width, h = size.height
        let m: CGFloat = 34 * s
        center.position = CGPoint(x: w / 2, y: h / 2)
        bl.position = CGPoint(x: m, y: m)
        br.position = CGPoint(x: w - m, y: m)
        tl.position = CGPoint(x: m, y: h - m)
        tr.position = CGPoint(x: w - m, y: h - m)
        tc.position = CGPoint(x: w / 2, y: h)
        for a in [center, bl, br, tl, tr, tc] { a.setScale(s) }
        announce.position = CGPoint(x: w / 2, y: h * 0.68); announce.setScale(s)
        announceSub.position = CGPoint(x: w / 2, y: h * 0.68 - 44 * s); announceSub.setScale(s)
        for n in [vignette, lowHp, flashNode, dim] {
            n.position = CGPoint(x: w / 2, y: h / 2)
            n.size = size
        }
        overlay.position = CGPoint(x: w / 2, y: h / 2)
        overlay.setScale(s)
    }

    func resizeIfNeeded() {
        if scene.size != laidOut { layout(scene.size) }
    }

    // MARK: per-frame state

    func update(dt: Float, hp: Float, shield: Float, ammo: Int, reserve: Int, weaponName: String, weaponIndex: Int,
                weaponNames: [String], weaponUsable: [Bool], weaponColor: V3, spread: Float, reloading: Float,
                dash: Float, overcharge: Float, score: Int, combo: Int, comboT: Float, wave: Int, enemiesLeft: Int,
                bossName: String?, bossHp: Float) {
        time += dt
        resizeIfNeeded()
        hpBar.set(CGFloat(hp / 100)); shBar.set(CGFloat(shield / 100))
        hpLabel.text = "\(Int(hp.rounded(.up)))"
        shLabel.text = "\(Int(shield))"
        let low = hp < 35
        hpLabel.fontColor = low ? cRed : .white
        hpBar.setColor(low ? cRed : NSColor(srgbRed: 0.3, green: 1.0, blue: 0.55, alpha: 1))
        let targetLow: CGFloat = low ? CGFloat(0.35 + 0.25 * sin(time * 6)) * CGFloat(1 - hp / 35 * 0.6) : 0
        lowHp.alpha += (targetLow - lowHp.alpha) * 0.2

        ammoLabel.text = "\(ammo)"
        ammoLabel.fontColor = ammo == 0 ? cRed : .white
        reserveLabel.text = reserve < 0 ? "/ ∞" : "/ \(reserve)"
        weaponLabel.text = weaponName
        let wc = color(weaponColor)
        weaponLabel.fontColor = wc
        for (i, sl) in slots.enumerated() where i < weaponNames.count {
            sl.name.text = weaponNames[i]
            let active = i == weaponIndex
            sl.box.fillColor = active ? wc.withAlphaComponent(0.3) : NSColor(white: 0, alpha: 0.4)
            sl.box.strokeColor = active ? wc : cDim.withAlphaComponent(0.35)
            sl.name.fontColor = weaponUsable[i] ? .white : NSColor(white: 1, alpha: 0.35)
        }

        // crosshair spread
        let gap = CGFloat(7 + spread * 520)
        crossLines[0].position = CGPoint(x: gap + 4, y: 0); crossLines[1].position = CGPoint(x: -gap - 4, y: 0)
        crossLines[2].position = CGPoint(x: 0, y: gap + 4); crossLines[3].position = CGPoint(x: 0, y: -gap - 4)
        dashBar.set(CGFloat(dash))
        dashBar.node.alpha = dash >= 1 ? 0.35 : 1
        reloadLabel.text = reloading > 0 ? "LADE NACH…" : (ammo == 0 ? "LEER – [R]" : "")
        powerLabel.text = overcharge > 0 ? "ÜBERLADUNG  \(Int(overcharge.rounded(.up)))s" : ""

        scoreLabel.text = formatScore(score)
        if combo > 1 {
            comboLabel.text = "KOMBO ×\(combo)"
            comboBar.node.isHidden = false
            comboBar.set(CGFloat(comboT))
        } else {
            comboLabel.text = ""
            comboBar.node.isHidden = true
        }
        waveLabel.text = "WELLE \(wave)"
        enemiesLabel.text = enemiesLeft > 0 ? "GEGNER  \(enemiesLeft)" : ""
        if let b = bossName {
            bossNode.isHidden = false
            bossLabel.text = b
            bossBar.set(CGFloat(bossHp))
        } else {
            bossNode.isHidden = true
        }

        vignetteAlpha = max(0, vignetteAlpha - CGFloat(dt) * 1.4)
        vignette.alpha = vignetteAlpha
        for i in dmgArcs.indices where dmgLife[i] > 0 {
            dmgLife[i] -= dt
            dmgArcs[i].alpha = CGFloat(max(0, min(1, dmgLife[i] * 1.6)))
        }
    }

    func formatScore(_ v: Int) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = "."
        return f.string(from: NSNumber(value: v)) ?? "\(v)"
    }

    /// enemies: (relative position rotated into view space, isBoss)
    func setRadar(_ pts: [(V2, Bool)], range: Float) {
        for (i, b) in blips.enumerated() {
            if i < pts.count {
                var p = pts[i].0 / range
                let l = simd_length(p)
                if l > 1 { p /= l }
                b.position = CGPoint(x: CGFloat(p.x) * (radarR - 5), y: CGFloat(p.y) * (radarR - 5))
                b.isHidden = false
                b.setScale(pts[i].1 ? 2.0 : (l > 1 ? 0.7 : 1))
                b.alpha = l > 1 ? 0.55 : 1
            } else {
                b.isHidden = true
            }
        }
    }

    // MARK: events

    func hit(kill: Bool, crit: Bool) {
        hitMarker.removeAllActions()
        let c: NSColor = kill ? cRed : (crit ? cOrange : .white)
        for l in hitLines { l.fillColor = c }
        hitMarker.alpha = 1
        hitMarker.setScale(kill ? 1.5 : 1.0)
        hitMarker.run(.group([.fadeOut(withDuration: kill ? 0.4 : 0.18), .scale(to: 1.0, duration: 0.15)]))
    }

    /// angle: direction of the attacker relative to where the player looks (0 = front, + = right)
    func damage(amount: Float, angle: Float?) {
        vignetteAlpha = min(0.9, vignetteAlpha + CGFloat(0.25 + amount / 40))
        if let a = angle {
            var idx = 0
            for i in dmgLife.indices where dmgLife[i] < dmgLife[idx] { idx = i }
            dmgLife[idx] = 1.1
            dmgAngles[idx] = a
            dmgArcs[idx].zRotation = CGFloat(-a)
        }
    }

    func flash(_ c: NSColor, _ alpha: CGFloat, _ dur: TimeInterval) {
        flashNode.removeAllActions()
        flashNode.color = c
        flashNode.alpha = alpha
        flashNode.run(.fadeOut(withDuration: dur))
    }

    func announce(_ text: String, sub: String = "", color c: NSColor = .white, hold: TimeInterval = 1.6) {
        for (l, t) in [(announce, text), (announceSub, sub)] {
            l.removeAllActions()
            l.text = t
            l.alpha = 0
            l.run(.sequence([.fadeIn(withDuration: 0.15), .wait(forDuration: hold), .fadeOut(withDuration: 0.5)]))
        }
        announce.fontColor = c
        announce.xScale = s * 1.25
        announce.run(.scaleX(to: s, duration: 0.25))
    }

    func feedLine(_ text: String, _ c: NSColor? = nil) {
        for i in stride(from: feed.count - 1, to: 0, by: -1) {
            feed[i].text = feed[i - 1].text
            feed[i].fontColor = feed[i - 1].fontColor
            feed[i].alpha = feed[i - 1].alpha
            feed[i].removeAllActions()
            feed[i].run(.fadeOut(withDuration: TimeInterval(feed[i].alpha) * 1.8))
        }
        feed[0].removeAllActions()
        feed[0].text = text
        feed[0].fontColor = c ?? cDim
        feed[0].alpha = 1
        feed[0].run(.sequence([.wait(forDuration: 1.6), .fadeOut(withDuration: 0.8)]))
    }

    // MARK: menus

    private func clearMenu() { menuNode.removeAllChildren(); menuNode.removeAllActions() }

    private func title(_ text: String, y: CGFloat, size: CGFloat, color c: NSColor = .white) {
        let ghost = label(text, fontHeavy, size, cCyan.withAlphaComponent(0.55))
        ghost.position = CGPoint(x: 4, y: y - 3)
        let ghost2 = label(text, fontHeavy, size, NSColor(srgbRed: 1, green: 0.2, blue: 0.6, alpha: 0.5))
        ghost2.position = CGPoint(x: -4, y: y + 2)
        let main = label(text, fontHeavy, size, c)
        main.position = CGPoint(x: 0, y: y)
        menuNode.addChild(ghost2); menuNode.addChild(ghost); menuNode.addChild(main)
    }

    private func prompt(_ text: String, y: CGFloat) {
        let p = label(text, fontHeavy, 28, cCyan)
        p.position = CGPoint(x: 0, y: y)
        p.run(.repeatForever(.sequence([.fadeAlpha(to: 0.35, duration: 0.7), .fadeAlpha(to: 1, duration: 0.7)])))
        menuNode.addChild(p)
    }

    private func controls(y: CGFloat) {
        let rows: [(String, String)] = [
            ("W A S D", "Bewegen"), ("MAUS", "Zielen"), ("LINKSKLICK", "Feuern"), ("LEERTASTE", "Springen"),
            ("SHIFT", "Sprinten"), ("Q", "Dash"), ("R", "Nachladen"), ("1 – 4 / RAD", "Waffe wechseln"),
            ("ESC", "Pause"), ("F", "Vollbild"), ("M", "Musik an/aus"),
        ]
        for (i, r) in rows.enumerated() {
            let col = i < 6 ? 0 : 1
            let row = i < 6 ? i : i - 6
            let x: CGFloat = col == 0 ? -270 : 50
            let k = label(r.0, fontHeavy, 17, cCyan, h: .left)
            k.position = CGPoint(x: x, y: y - CGFloat(row) * 26)
            let d = label(r.1, fontDemi, 17, NSColor(white: 1, alpha: 0.85), h: .left)
            d.position = CGPoint(x: x + (col == 0 ? 130 : 120), y: y - CGFloat(row) * 26)
            menuNode.addChild(k); menuNode.addChild(d)
        }
    }

    func showMenu(best: Int, bestWave: Int) {
        clearMenu()
        dim.alpha = 0.45
        gameLayer.alpha = 0
        title("NOVA BREACH", y: 190, size: 150)
        let sub = label("A R E N A - P R O T O K O L L   //   S T A T I O N   H E L I X - 9", fontDemi, 22, cCyan)
        sub.position = CGPoint(x: 0, y: 150)
        menuNode.addChild(sub)
        let line = SKShapeNode(rectOf: CGSize(width: 760, height: 2))
        line.fillColor = cCyan; line.strokeColor = .clear; line.position = CGPoint(x: 0, y: 132)
        menuNode.addChild(line)
        prompt("KLICKEN ODER ENTER ZUM STARTEN", y: 60)
        controls(y: -20)
        if best > 0 {
            let b = label("BESTLEISTUNG   \(formatScore(best)) PUNKTE   ·   WELLE \(bestWave)", fontHeavy, 22, cOrange)
            b.position = CGPoint(x: 0, y: -230)
            menuNode.addChild(b)
        }
        let foot = label("Überlebe so viele Wellen wie möglich. Alle 5 Wellen wartet ein Boss.", fontDemi, 17, NSColor(white: 1, alpha: 0.6))
        foot.position = CGPoint(x: 0, y: -270)
        menuNode.addChild(foot)
    }

    func showPause() {
        clearMenu()
        dim.alpha = 0.6
        title("PAUSE", y: 120, size: 120)
        prompt("KLICKEN ODER ESC ZUM FORTSETZEN", y: 40)
        controls(y: -30)
        let q = label("⌘Q  –  Spiel beenden", fontDemi, 17, NSColor(white: 1, alpha: 0.6))
        q.position = CGPoint(x: 0, y: -230)
        menuNode.addChild(q)
    }

    func showGameOver(_ st: GameOverStats) {
        clearMenu()
        gameLayer.alpha = 0
        dim.alpha = 0
        dim.run(.fadeAlpha(to: 0.62, duration: 0.8))
        title("SYSTEMAUSFALL", y: 170, size: 120, color: cRed)
        let rows: [(String, String)] = [
            ("PUNKTE", formatScore(st.score)), ("ERREICHTE WELLE", "\(st.wave)"), ("ABSCHÜSSE", "\(st.kills)"),
            ("TREFFERQUOTE", "\(st.accuracy) %"), ("ÜBERLEBT", String(format: "%d:%02d", st.time / 60, st.time % 60)),
        ]
        for (i, r) in rows.enumerated() {
            let k = label(r.0, fontDemi, 22, cDim, h: .right)
            k.position = CGPoint(x: -20, y: 80 - CGFloat(i) * 36)
            let v = label(r.1, fontHeavy, 28, .white, h: .left)
            v.position = CGPoint(x: 20, y: 78 - CGFloat(i) * 36)
            menuNode.addChild(k); menuNode.addChild(v)
        }
        let b = label(st.newBest ? "NEUER REKORD!" : "REKORD   \(formatScore(st.best))", fontHeavy, 26, cOrange)
        b.position = CGPoint(x: 0, y: -120)
        menuNode.addChild(b)
        prompt("KLICKEN ODER ENTER FÜR NEUEN VERSUCH", y: -190)
        menuNode.alpha = 0
        menuNode.run(.sequence([.wait(forDuration: 0.5), .fadeIn(withDuration: 0.5)]))
    }

    func showGame() {
        clearMenu()
        menuNode.alpha = 1
        dim.removeAllActions()
        dim.alpha = 0
        gameLayer.alpha = 1
    }

    func resetTransient() {
        vignetteAlpha = 0
        vignette.alpha = 0; lowHp.alpha = 0
        for i in dmgArcs.indices { dmgLife[i] = 0; dmgArcs[i].alpha = 0 }
        for f in feed { f.removeAllActions(); f.alpha = 0 }
        announce.removeAllActions(); announce.alpha = 0
        announceSub.removeAllActions(); announceSub.alpha = 0
    }
}
