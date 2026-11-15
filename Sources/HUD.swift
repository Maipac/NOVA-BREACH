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
    var mapName: String = ""
    /// cores earned this run, cores in the bank, upgrades taken
    var cores: Int = 0, totalCores: Int = 0, perks: Int = 0
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
    private let eventLabel = label("", fontHeavy, 17, cOrange)

    // active ability (E)
    private let abilityNode = SKNode()
    private let abilityKey = SKShapeNode(rectOf: CGSize(width: 38, height: 38), cornerRadius: 6)
    private let abilityName = label("", fontDemi, 16, .white, h: .left)
    private let abilityStatus = label("", fontDemi, 13, cDim, h: .left)
    private let abilityBar: Bar

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
        abilityBar = Bar(w: 130, h: 6, slant: 3, color: cOrange)

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

        // bottom left, next to the bars: ability on E
        abilityNode.position = CGPoint(x: 350, y: 0)
        abilityKey.position = CGPoint(x: 19, y: 30)
        abilityKey.lineWidth = 2
        let ek = label("E", fontHeavy, 22, .white, v: .center)
        abilityKey.addChild(ek)
        abilityName.position = CGPoint(x: 50, y: 36)
        abilityBar.node.position = CGPoint(x: 50, y: 20)
        abilityStatus.position = CGPoint(x: 50, y: 0)
        for n in [abilityKey, abilityName, abilityBar.node, abilityStatus] as [SKNode] { abilityNode.addChild(n) }
        bl.addChild(abilityNode)

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
        eventLabel.position = CGPoint(x: 0, y: -90)
        tc.addChild(waveLabel); tc.addChild(enemiesLabel); tc.addChild(eventLabel)
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

    func update(dt: Float, hp: Float, hpMax: Float, shield: Float, shieldMax: Float, ammo: Int, reserve: Int, weaponName: String, weaponIndex: Int,
                weaponNames: [String], weaponUsable: [Bool], weaponColor: V3, spread: Float, reloading: Float,
                dash: Float, overcharge: Float, score: Int, combo: Int, comboT: Float, wave: Int, enemiesLeft: Int,
                bossName: String?, bossHp: Float) {
        time += dt
        resizeIfNeeded()
        hpBar.set(CGFloat(hp / max(hpMax, 1))); shBar.set(CGFloat(shield / max(shieldMax, 1)))
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

    func setAbility(name: String, charge: Float, status: String, color c: V3) {
        let ac = color(c)
        let ready = charge >= 1
        abilityName.text = name
        abilityStatus.text = status
        abilityStatus.fontColor = ready ? ac : cDim
        abilityBar.setColor(ac)
        abilityBar.set(CGFloat(charge))
        abilityKey.strokeColor = ready ? ac : cDim.withAlphaComponent(0.4)
        abilityKey.fillColor = ready ? ac.withAlphaComponent(0.3 + 0.15 * CGFloat(sin(time * 5))) : NSColor(white: 0, alpha: 0.45)
        abilityNode.alpha = ready ? 1 : 0.8
    }

    func setEvent(_ text: String?, color c: V3) {
        eventLabel.text = text ?? ""
        eventLabel.fontColor = color(c)
        if text != nil { eventLabel.alpha = CGFloat(0.75 + 0.25 * sin(time * 4)) }
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
            ("SHIFT", "Sprinten"), ("Q", "Dash"), ("E", "Fähigkeit"), ("R", "Nachladen"), ("1 – 4 / RAD", "Waffe wechseln"),
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

    enum MenuHit { case map(Int), start, labor, back, perk(Int), ability(Int), research(Int) }

    /// What the main menu has under a click (view coordinates, origin bottom-left).
    func menuHit(_ p: CGPoint) -> MenuHit? {
        for n in scene.nodes(at: p) {
            var cur: SKNode? = n
            while let c = cur {
                if let name = c.name {
                    if name == "start" { return .start }
                    if name == "labor" { return .labor }
                    if name == "back" { return .back }
                    if name.hasPrefix("map:"), let i = Int(name.dropFirst(4)) { return .map(i) }
                    if name.hasPrefix("perk:"), let i = Int(name.dropFirst(5)) { return .perk(i) }
                    if name.hasPrefix("ability:"), let i = Int(name.dropFirst(8)) { return .ability(i) }
                    if name.hasPrefix("research:"), let i = Int(name.dropFirst(9)) { return .research(i) }
                }
                cur = c.parent
            }
        }
        return nil
    }

    func showMenu(maps: [(id: MapID, best: Int, wave: Int)], selected: Int, cores: Int, ability: String) {
        clearMenu()
        menuNode.alpha = 1
        dim.alpha = 0.45
        gameLayer.alpha = 0
        title("NOVA BREACH", y: 250, size: 130)
        let sub = label("A R E N A - P R O T O K O L L   //   W Ä H L E   D E I N E   M A P", fontDemi, 20, cCyan)
        sub.position = CGPoint(x: 0, y: 212)
        menuNode.addChild(sub)
        let line = SKShapeNode(rectOf: CGSize(width: 760, height: 2))
        line.fillColor = cCyan; line.strokeColor = .clear; line.position = CGPoint(x: 0, y: 196)
        menuNode.addChild(line)

        let cw: CGFloat = 360, ch: CGFloat = 190
        let spacing: CGFloat = 400
        let x0 = -spacing * CGFloat(maps.count - 1) / 2
        for (i, m) in maps.enumerated() {
            let sel = i == selected
            let ac = color(m.id.accent)
            let card = SKShapeNode(rectOf: CGSize(width: cw, height: ch), cornerRadius: 10)
            card.name = "map:\(m.id.rawValue)"
            card.position = CGPoint(x: x0 + CGFloat(i) * spacing, y: 70)
            card.fillColor = sel ? ac.withAlphaComponent(0.14) : NSColor(white: 0, alpha: 0.5)
            card.strokeColor = sel ? ac : ac.withAlphaComponent(0.35)
            card.lineWidth = sel ? 3 : 1.5
            card.glowWidth = sel ? 4 : 0
            card.setScale(sel ? 1.04 : 0.96)
            card.alpha = sel ? 1 : 0.82
            let num = label("\(m.id.rawValue + 1)", fontMono, 14, cDim, h: .left)
            num.position = CGPoint(x: -cw / 2 + 18, y: ch / 2 - 30)
            card.addChild(num)
            if sel {
                let tag = label("AUSGEWÄHLT", fontDemi, 14, ac, h: .right)
                tag.position = CGPoint(x: cw / 2 - 18, y: ch / 2 - 30)
                card.addChild(tag)
            }
            let name = label(m.id.name, fontHeavy, 34, sel ? .white : NSColor(white: 1, alpha: 0.75), h: .left)
            name.position = CGPoint(x: -cw / 2 + 18, y: ch / 2 - 72)
            card.addChild(name)
            let tl = label(m.id.tagline, fontDemi, 15, NSColor(white: 1, alpha: 0.72), h: .left, v: .top)
            tl.numberOfLines = 0
            tl.preferredMaxLayoutWidth = cw - 36
            tl.position = CGPoint(x: -cw / 2 + 18, y: ch / 2 - 86)
            card.addChild(tl)
            let rec = m.best > 0 ? "REKORD   \(formatScore(m.best))   ·   WELLE \(m.wave)" : "NOCH KEIN REKORD"
            let r = label(rec, fontHeavy, 17, m.best > 0 ? cOrange : cDim, h: .left)
            r.position = CGPoint(x: -cw / 2 + 18, y: -ch / 2 + 22)
            card.addChild(r)
            let bar = SKShapeNode(rectOf: CGSize(width: cw - 20, height: 4), cornerRadius: 2)
            bar.fillColor = sel ? ac : ac.withAlphaComponent(0.3); bar.strokeColor = .clear
            bar.position = CGPoint(x: 0, y: -ch / 2 + 8)
            card.addChild(bar)
            menuNode.addChild(card)
        }

        let ac = color(maps.indices.contains(selected) ? maps[selected].id.accent : V3(0.35, 0.92, 1.0))
        let btn = SKShapeNode(rectOf: CGSize(width: 300, height: 56), cornerRadius: 8)
        btn.name = "start"
        btn.position = CGPoint(x: -135, y: -80)
        btn.fillColor = ac.withAlphaComponent(0.88); btn.strokeColor = .white; btn.lineWidth = 1.5
        btn.glowWidth = 3
        let bl = label("STARTEN", fontHeavy, 30, NSColor(srgbRed: 0.02, green: 0.04, blue: 0.07, alpha: 1), v: .center)
        btn.addChild(bl)
        btn.run(.repeatForever(.sequence([.fadeAlpha(to: 0.8, duration: 0.8), .fadeAlpha(to: 1, duration: 0.8)])))
        menuNode.addChild(btn)
        // Labor: spend cores, pick the ability
        let gold = color(Meta.coreColor)
        let lab = SKShapeNode(rectOf: CGSize(width: 250, height: 56), cornerRadius: 8)
        lab.name = "labor"
        lab.position = CGPoint(x: 155, y: -80)
        lab.fillColor = NSColor(white: 0, alpha: 0.55); lab.strokeColor = gold; lab.lineWidth = 2
        let ll = label("LABOR", fontHeavy, 26, .white, h: .left, v: .center)
        ll.position = CGPoint(x: -108, y: 7)
        let lc = label("◆ \(cores)", fontHeavy, 22, gold, h: .right, v: .center)
        lc.position = CGPoint(x: 108, y: 7)
        let la = label("[E]  \(ability)", fontDemi, 13, cDim, h: .left, v: .center)
        la.position = CGPoint(x: -108, y: -15)
        for n in [ll, lc, la] { lab.addChild(n) }
        menuNode.addChild(lab)
        let hint = label("← →  oder  1 / 2:  Map wählen    ·    Enter:  Starten    ·    L:  Labor", fontDemi, 17, cDim)
        hint.position = CGPoint(x: 0, y: -134)
        menuNode.addChild(hint)
        controls(y: -180)
        let foot = label("Überlebe so viele Wellen wie möglich. Nach jeder Welle wählst du ein Upgrade, alle 5 Wellen wartet ein Boss.", fontDemi, 17, NSColor(white: 1, alpha: 0.6))
        foot.position = CGPoint(x: 0, y: -360)
        menuNode.addChild(foot)
    }

    /// Small rounded key cap with a label in it.
    private func keyCap(_ text: String, _ c: NSColor, size: CGFloat = 34) -> SKShapeNode {
        let kb = SKShapeNode(rectOf: CGSize(width: size, height: size), cornerRadius: 6)
        kb.fillColor = c; kb.strokeColor = .clear
        let k = label(text, fontHeavy, size * 0.62, NSColor(srgbRed: 0.02, green: 0.04, blue: 0.07, alpha: 1), v: .center)
        kb.addChild(k)
        return kb
    }

    /// Wrapped body text (top-left anchored).
    private func paragraph(_ text: String, _ size: CGFloat, width: CGFloat, _ c: NSColor = NSColor(white: 1, alpha: 0.8)) -> SKLabelNode {
        let l = label(text, fontDemi, size, c, h: .left, v: .top)
        l.numberOfLines = 0
        l.preferredMaxLayoutWidth = width
        return l
    }

    /// Upgrade choice after a cleared wave: three cards, keys 1–3 or click.
    func showPerks(_ cards: [PerkCard], wave: Int, cores: Int, next: (text: String, color: V3)) {
        clearMenu()
        menuNode.alpha = 1
        dim.removeAllActions()
        dim.alpha = 0.6
        title("UPGRADE WÄHLEN", y: 250, size: 86)
        let sub = label("WELLE \(wave) GESCHAFFT    ·    ◆ \(cores) KERNE", fontDemi, 22, cCyan)
        sub.position = CGPoint(x: 0, y: 206)
        menuNode.addChild(sub)

        let cw: CGFloat = 340, ch: CGFloat = 310, spacing: CGFloat = 375
        for (i, c) in cards.enumerated() {
            let ac = color(c.color)
            let card = SKShapeNode(rectOf: CGSize(width: cw, height: ch), cornerRadius: 12)
            card.name = "perk:\(i)"
            card.position = CGPoint(x: (CGFloat(i) - CGFloat(cards.count - 1) / 2) * spacing, y: 20)
            card.fillColor = NSColor(srgbRed: 0.01, green: 0.03, blue: 0.06, alpha: 0.82)
            card.strokeColor = ac; card.lineWidth = 2.5; card.glowWidth = 3
            let kb = keyCap("\(i + 1)", ac)
            kb.position = CGPoint(x: -cw / 2 + 32, y: ch / 2 - 32)
            card.addChild(kb)
            let tag = label(c.tag, fontDemi, 15, ac, h: .right, v: .center)
            tag.position = CGPoint(x: cw / 2 - 18, y: ch / 2 - 32)
            card.addChild(tag)
            let name = label(c.name, fontHeavy, 25, .white, h: .left)
            name.position = CGPoint(x: -cw / 2 + 18, y: ch / 2 - 92)
            card.addChild(name)
            let line = SKShapeNode(rectOf: CGSize(width: cw - 36, height: 2))
            line.fillColor = ac.withAlphaComponent(0.6); line.strokeColor = .clear
            line.position = CGPoint(x: 0, y: ch / 2 - 106)
            card.addChild(line)
            let d = paragraph(c.desc, 18, width: cw - 36)
            d.position = CGPoint(x: -cw / 2 + 18, y: ch / 2 - 120)
            card.addChild(d)
            // level pips: owned, the new one, still open
            if c.maxLevel > 1 {
                let pw: CGFloat = 26
                for k in 0..<c.maxLevel {
                    let pip = SKShapeNode(rectOf: CGSize(width: pw, height: 8), cornerRadius: 2)
                    pip.position = CGPoint(x: -cw / 2 + 18 + pw / 2 + CGFloat(k) * (pw + 6), y: -ch / 2 + 54)
                    pip.strokeColor = ac.withAlphaComponent(0.6); pip.lineWidth = 1
                    pip.fillColor = k < c.level ? ac.withAlphaComponent(0.55) : (k == c.level ? .white : .clear)
                    card.addChild(pip)
                }
            }
            let lv = c.level == 0 ? "NEU" : "STUFE \(c.level) → \(c.level + 1)"
            let st = label(c.maxLevel > 1 ? "\(lv)   ·   MAX \(c.maxLevel)" : lv, fontHeavy, 16, c.level == 0 ? cOrange : cDim, h: .left)
            st.position = CGPoint(x: -cw / 2 + 18, y: -ch / 2 + 22)
            card.addChild(st)
            card.alpha = 0
            card.setScale(0.92)
            let pop = SKAction.group([.fadeIn(withDuration: 0.2), .scale(to: 1, duration: 0.2)])
            card.run(.sequence([.wait(forDuration: 0.08 * Double(i)), pop]))
            menuNode.addChild(card)
        }
        let hint = label("TASTE 1 / 2 / 3  ODER  KLICKEN", fontHeavy, 20, cCyan)
        hint.position = CGPoint(x: 0, y: -168)
        hint.run(.repeatForever(.sequence([.fadeAlpha(to: 0.45, duration: 0.7), .fadeAlpha(to: 1, duration: 0.7)])))
        menuNode.addChild(hint)
        let nx = label(next.text, fontHeavy, 19, color(next.color))
        nx.position = CGPoint(x: 0, y: -212)
        menuNode.addChild(nx)
        let note = label("Upgrades gelten bis zum Systemausfall. Kerne bleiben – im LABOR schaltest du damit neue Perks und Fähigkeiten frei.",
                         fontDemi, 16, NSColor(white: 1, alpha: 0.55))
        note.position = CGPoint(x: 0, y: -246)
        menuNode.addChild(note)
    }

    /// Labor: buy and equip abilities, research perks for the upgrade pool.
    func showLabor(cores: Int, abilities: [LaborItem], research: [LaborItem]) {
        clearMenu()
        menuNode.alpha = 1
        dim.alpha = 0.7
        gameLayer.alpha = 0
        let gold = color(Meta.coreColor)
        title("LABOR", y: 318, size: 96)
        let sub = label("◆ \(cores) KERNE    ·    Kerne gibt es für jede Welle, für Bosse und für überstandene Wellen-Ereignisse",
                        fontDemi, 19, gold)
        sub.position = CGPoint(x: 0, y: 272)
        menuNode.addChild(sub)

        func section(_ text: String, _ hint: String, y: CGFloat) {
            let t = label(text, fontHeavy, 22, .white, h: .left)
            t.position = CGPoint(x: -615, y: y)
            let h = label(hint, fontDemi, 16, cDim, h: .left)
            h.position = CGPoint(x: -615 + CGFloat(text.count) * 12 + 28, y: y)
            menuNode.addChild(t); menuNode.addChild(h)
        }

        func status(_ it: LaborItem, owned ownedText: String) -> (String, NSColor) {
            if it.equipped { return ("AUSGERÜSTET", color(it.color)) }
            if it.owned { return (ownedText, it.equipped ? color(it.color) : cDim) }
            return ("◆ \(it.cost)   FREISCHALTEN", it.affordable ? gold : cRed.withAlphaComponent(0.8))
        }

        section("FÄHIGKEIT  [E]", "eine ist ausgerüstet – klicken zum Freischalten oder Wechseln", y: 236)
        let aw: CGFloat = 292, ah: CGFloat = 160, aSpacing: CGFloat = 308
        for (i, it) in abilities.enumerated() {
            let ac = color(it.color)
            let card = SKShapeNode(rectOf: CGSize(width: aw, height: ah), cornerRadius: 10)
            card.name = "ability:\(i)"
            card.position = CGPoint(x: (CGFloat(i) - CGFloat(abilities.count - 1) / 2) * aSpacing, y: 140)
            card.fillColor = it.equipped ? ac.withAlphaComponent(0.16) : NSColor(white: 0, alpha: 0.55)
            card.strokeColor = it.owned ? ac : ac.withAlphaComponent(0.35)
            card.lineWidth = it.equipped ? 3 : 1.5
            card.glowWidth = it.equipped ? 4 : 0
            let n = label(it.name, fontHeavy, 22, it.owned ? .white : NSColor(white: 1, alpha: 0.7), h: .left)
            n.position = CGPoint(x: -aw / 2 + 16, y: ah / 2 - 34)
            card.addChild(n)
            let cd = label(it.tag, fontDemi, 12, cDim, h: .right)
            cd.position = CGPoint(x: aw / 2 - 14, y: ah / 2 - 32)
            card.addChild(cd)
            let d = paragraph(it.desc, 15, width: aw - 32)
            d.position = CGPoint(x: -aw / 2 + 16, y: ah / 2 - 48)
            card.addChild(d)
            let (stText, stColor) = status(it, owned: "KLICKEN ZUM AUSRÜSTEN")
            let st = label(stText, fontHeavy, 15, stColor, h: .left)
            st.position = CGPoint(x: -aw / 2 + 16, y: -ah / 2 + 16)
            card.addChild(st)
            menuNode.addChild(card)
        }

        section("PERK-FORSCHUNG", "freigeschaltete Perks tauchen danach in der Upgrade-Wahl nach jeder Welle auf", y: 22)
        let rw: CGFloat = 400, rh: CGFloat = 108, rxSpacing: CGFloat = 415, rySpacing: CGFloat = 120
        for (i, it) in research.enumerated() {
            let ac = color(it.color)
            let col = i % 3, row = i / 3
            let card = SKShapeNode(rectOf: CGSize(width: rw, height: rh), cornerRadius: 10)
            card.name = "research:\(i)"
            card.position = CGPoint(x: CGFloat(col - 1) * rxSpacing, y: -50 - CGFloat(row) * rySpacing)
            card.fillColor = it.owned ? ac.withAlphaComponent(0.12) : NSColor(white: 0, alpha: 0.55)
            card.strokeColor = it.owned ? ac : ac.withAlphaComponent(0.35)
            card.lineWidth = it.owned ? 2 : 1.5
            let n = label(it.name, fontHeavy, 20, it.owned ? .white : NSColor(white: 1, alpha: 0.75), h: .left)
            n.position = CGPoint(x: -rw / 2 + 16, y: rh / 2 - 28)
            card.addChild(n)
            let tg = label(it.tag, fontDemi, 12, ac, h: .right)
            tg.position = CGPoint(x: rw / 2 - 14, y: rh / 2 - 26)
            card.addChild(tg)
            let d = paragraph(it.desc, 14, width: rw - 32)
            d.position = CGPoint(x: -rw / 2 + 16, y: rh / 2 - 40)
            card.addChild(d)
            let (stText, stColor) = it.owned ? ("ERFORSCHT", ac) : status(it, owned: "")
            let st = label(stText, fontHeavy, 14, stColor, h: .right)
            st.position = CGPoint(x: rw / 2 - 14, y: -rh / 2 + 12)
            card.addChild(st)
            menuNode.addChild(card)
        }

        let back = SKShapeNode(rectOf: CGSize(width: 240, height: 48), cornerRadius: 8)
        back.name = "back"
        back.position = CGPoint(x: 0, y: -330)
        back.fillColor = cCyan.withAlphaComponent(0.85); back.strokeColor = .white; back.lineWidth = 1.5
        let bl = label("ZURÜCK", fontHeavy, 26, NSColor(srgbRed: 0.02, green: 0.04, blue: 0.07, alpha: 1), v: .center)
        back.addChild(bl)
        menuNode.addChild(back)
        let hint = label("Klick: freischalten / ausrüsten    ·    ESC oder L: zurück", fontDemi, 16, cDim)
        hint.position = CGPoint(x: 0, y: -378)
        menuNode.addChild(hint)
    }

    func showPause() {
        clearMenu()
        dim.alpha = 0.6
        title("PAUSE", y: 120, size: 120)
        prompt("KLICKEN ODER ESC ZUM FORTSETZEN", y: 40)
        controls(y: -30)
        let back = label("Q  –  ZURÜCK ZUM HAUPTMENÜ", fontHeavy, 19, cCyan)
        back.position = CGPoint(x: 0, y: -205)
        menuNode.addChild(back)
        let q = label("⌘Q  –  Spiel beenden", fontDemi, 17, NSColor(white: 1, alpha: 0.6))
        q.position = CGPoint(x: 0, y: -236)
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
            ("UPGRADES", "\(st.perks)"), ("KERNE", "+\(st.cores)   (◆ \(st.totalCores))"),
        ]
        for (i, r) in rows.enumerated() {
            let k = label(r.0, fontDemi, 21, cDim, h: .right)
            k.position = CGPoint(x: -20, y: 92 - CGFloat(i) * 30)
            let v = label(r.1, fontHeavy, 25, i == rows.count - 1 ? color(Meta.coreColor) : .white, h: .left)
            v.position = CGPoint(x: 20, y: 90 - CGFloat(i) * 30)
            menuNode.addChild(k); menuNode.addChild(v)
        }
        let b = label(st.newBest ? "NEUER REKORD!" : "REKORD   \(formatScore(st.best))", fontHeavy, 26, cOrange)
        b.position = CGPoint(x: 0, y: -146)
        menuNode.addChild(b)
        prompt("KLICKEN ODER ENTER FÜR NEUEN VERSUCH", y: -200)
        let back = label("Q  –  HAUPTMENÜ  ·  dort kannst du im LABOR Kerne ausgeben", fontHeavy, 19, cDim)
        back.position = CGPoint(x: 0, y: -238)
        menuNode.addChild(back)
        if !st.mapName.isEmpty {
            let mn = label(st.mapName, fontDemi, 20, cDim)
            mn.position = CGPoint(x: 0, y: 128)
            menuNode.addChild(mn)
        }
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
