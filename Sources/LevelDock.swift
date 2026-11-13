import SceneKit
import AppKit
import simd

/// Map 2: ORBITAL-DOCK – an open docking deck floating under the gas giant.
/// Same building blocks, collision and navigation as Helix-9; everything stays inside ±30 m so the
/// 64 x 64 navigation grid covers it.
extension Level {
    static let amber = V3(1.0, 0.62, 0.18)
    static let dockWhite = V3(0.85, 0.93, 1.0)
    static let teal = V3(0.2, 0.95, 0.85)

    func buildDock(_ scene: SCNScene) {
        bounds = 29.4
        floorExtent = 31
        playerStart = V3(0, 0, 16)
        playerYaw = 0
        menuRadius = 31
        menuHeight = 11
        menuLookY = 3

        buildDockSkyAndLights(scene)
        buildDeck()
        buildDockEdge()
        buildDockGates()
        buildHub()
        buildPads()
        buildCranes()
        buildDockCover()
        buildMasts()
        buildDockBackdrop()
        buildDockStrips()
        buildDockAtmosphere()
        pickupSpots += [V3(4.5, 2.4, 4.5), V3(-4.5, 2.4, -4.5), V3(19, 0.5, -19), V3(-19, 0.5, 19), V3(14, 0, 3), V3(-14, 0, -3),
                        V3(0, 0, 13), V3(0, 0, -13), V3(24, 0, -7), V3(-24, 0, 7)]
    }

    // MARK: shared materials

    static func makePortalMaterial() -> SCNMaterial {
        let pm = SCNMaterial()
        pm.lightingModel = .constant
        pm.diffuse.contents = Tex.hex
        pm.diffuse.wrapS = .repeat; pm.diffuse.wrapT = .repeat
        pm.isDoubleSided = true
        pm.shaderModifiers = [.surface: """
        #pragma arguments
        float u_boost;
        #pragma body
        float2 uv = _surface.diffuseTexcoord;
        float t = scn_frame.time;
        float2 c = uv - float2(0.5, 0.5);
        float r = length(c);
        float a = atan2(c.y, c.x);
        float swirl = sin(a * 3.0 + r * 18.0 - t * 3.0) * 0.5 + 0.5;
        float wave = sin(r * 30.0 - t * 5.0) * 0.5 + 0.5;
        float hexv = _surface.diffuse.r;
        float3 hot = float3(1.0, 0.25, 0.08);
        float3 colr = hot * (0.15 + 0.9 * swirl * (1.0 - r) + hexv * (0.6 + 1.0 * wave));
        colr *= (1.0 + u_boost * 3.0);
        _surface.diffuse = float4(colr, 1.0);
        """]
        pm.setValue(NSNumber(value: 0.0), forKey: "u_boost")
        return pm
    }

    /// Translucent energy fence: scrolling hex pattern, bright at the base, fading upward.
    static func makeFenceMaterial(_ c: V3, length: Float, height: Float) -> SCNMaterial {
        let m = SCNMaterial()
        m.lightingModel = .constant
        m.diffuse.contents = Tex.hex
        m.diffuse.wrapS = .repeat; m.diffuse.wrapT = .repeat
        let rep = height / 3
        m.diffuse.contentsTransform = SCNMatrix4MakeScale(CGFloat(length / 3), CGFloat(rep), 1)
        m.isDoubleSided = true
        m.blendMode = .add
        m.writesToDepthBuffer = false
        m.shaderModifiers = [.surface: """
        #pragma arguments
        float u_rep;
        float u_r;
        float u_g;
        float u_b;
        #pragma body
        float2 uv = _surface.diffuseTexcoord;
        float t = scn_frame.time;
        float vN = clamp(uv.y / u_rep, 0.0, 1.0);
        float hexv = _surface.diffuse.r;
        float scan = sin(uv.y * 5.0 - t * 2.2 + uv.x * 0.6) * 0.5 + 0.5;
        float3 colr = float3(u_r, u_g, u_b) * (0.03 + hexv * 0.4 * (0.45 + 0.55 * scan)) * (0.1 + 0.9 * vN * vN);
        _surface.diffuse = float4(colr, 1.0);
        """]
        m.setValue(NSNumber(value: rep), forKey: "u_rep")
        m.setValue(NSNumber(value: c.x), forKey: "u_r")
        m.setValue(NSNumber(value: c.y), forKey: "u_g")
        m.setValue(NSNumber(value: c.z), forKey: "u_b")
        return m
    }

    private func blinker(_ size: Float, _ c: V3, _ pos: V3, period: Double) {
        let s = Geo.glowSprite(size, c, 1.2)
        s.simdPosition = pos
        s.runAction(.repeatForever(.sequence([.fadeOpacity(to: 0.1, duration: 0.9), .fadeOpacity(to: 1, duration: 0.2), .wait(duration: period)])))
        root.addChildNode(s)
    }

    private func omni(_ c: V3, _ intensity: Float, _ pos: V3, _ range: Float) {
        let l = SCNLight()
        l.type = .omni
        l.color = color(c)
        l.intensity = CGFloat(intensity)
        l.attenuationStartDistance = 1
        l.attenuationEndDistance = CGFloat(range)
        l.attenuationFalloffExponent = 2
        let n = SCNNode()
        n.light = l
        n.simdPosition = pos
        root.addChildNode(n)
    }

    /// Additive light cone from `from` (narrow end) to `to` (wide end).
    private func shaftCone(from: V3, to: V3, top: Float, bottom: Float, _ c: V3, _ intensity: Float) {
        let v = from - to
        let h = simd_length(v)
        let cone = Geo.cone(top, bottom, h, segments: 32)
        cone.materials = [Mat.additive(Tex.shaft, c, intensity)]
        let n = SCNNode(geometry: cone)
        n.simdPosition = (from + to) * 0.5
        n.simdOrientation = simd_quatf(from: V3(0, 1, 0), to: v / h)
        n.castsShadow = false
        n.renderingOrder = 20
        root.addChildNode(n)
    }

    // MARK: sky + lights

    private func buildDockSkyAndLights(_ scene: SCNScene) {
        scene.background.contents = Tex.sky
        scene.background.intensity = 1.9
        scene.lightingEnvironment.contents = Tex.env
        scene.lightingEnvironment.intensity = 1.1
        scene.fogColor = color(0.02, 0.04, 0.08)
        scene.fogStartDistance = 70
        scene.fogEndDistance = 260
        scene.fogDensityExponent = 1.4

        let sun = SCNLight()
        sun.type = .directional
        sun.color = color(1.0, 0.9, 0.76)
        sun.intensity = 2300
        sun.castsShadow = true
        sun.shadowMapSize = CGSize(width: 4096, height: 4096)
        sun.shadowCascadeCount = 3
        sun.shadowCascadeSplittingFactor = 0.6
        sun.maximumShadowDistance = 110
        sun.automaticallyAdjustsShadowProjection = true
        sun.shadowSampleCount = 8
        sun.shadowRadius = 3
        sun.shadowBias = 3
        sun.shadowColor = NSColor(white: 0, alpha: 0.85)
        sunNode.light = sun
        sunNode.simdPosition = Tex.sunDir * 60
        sunNode.simdLook(at: V3(0, 0, 0))
        root.addChildNode(sunNode)

        // three omni lights like Helix (SceneKit lights a node with at most 8 lights; the effects add 3)
        omni(Level.dockWhite, 2000, V3(0, 7.5, 0), 24)
        omni(Level.amber, 5200, V3(25.5, 12.5, 25.5), 36)
        omni(Level.teal, 4200, V3(-25.5, 12.5, -25.5), 34)
    }

    // MARK: deck

    private func buildDeck() {
        let deck = box(0, 0, 62, 62, -1.6, 0, "deck", Tex.deck, tile: 4, collide: false, chamfer: 0.2, emission: 0)
        deck.physicsBody = SCNPhysicsBody(type: .static, shape: nil)   // debris bounces on the deck
        // underside: girders and the station spine reaching down into the haze
        let girder = Mat.metal(V3(0.16, 0.17, 0.19), rough: 0.4)
        for s in [Float(-1), 1] {
            for k in [Float(0.35), 0.8] {
                Geo.part(root, Geo.box(3, 4, 58), girder, V3(s * k * 30, -3.6, 0), shadow: false)
                Geo.part(root, Geo.box(58, 4, 3), girder, V3(0, -3.6, s * k * 30), shadow: false)
            }
        }
        Geo.part(root, Geo.cyl(8, 70, segments: 48), Mat.pbr("pil", Tex.pillar, 10, 8), V3(0, -36.6, 0), shadow: false)
        Geo.part(root, Geo.cyl(10, 2, segments: 48), Mat.metal(V3(0.2, 0.21, 0.23), rough: 0.35), V3(0, -5.6, 0), shadow: false)
        Geo.part(root, Geo.torus(10.2, 0.25), Mat.glow(Level.teal, 4), V3(0, -5.6, 0), shadow: false)
        // deck rim lights
        for s in [Float(-1), 1] {
            glowBox(0, -0.05, s * 31.02, 62, 0.08, 0.06, Level.amber, 3)
            glowBox(s * 31.02, -0.05, 0, 0.06, 0.08, 62, Level.amber, 3)
            glowBox(0, -1.45, s * 31.02, 62, 0.06, 0.06, Level.teal, 3)
            glowBox(s * 31.02, -1.45, 0, 0.06, 0.06, 62, Level.teal, 3)
        }
    }

    /// Low rail + energy fence around the deck (gaps where the gates stand), pylons with beacons.
    private func buildDockEdge() {
        let E: Float = 30
        let fenceH: Float = 4
        for side in 0..<4 {
            let alongX = side < 2
            let s: Float = side % 2 == 0 ? -1 : 1
            for half in [Float(-1), 1] {
                let len: Float = E - 3.8
                let mid = half * (3.8 + len / 2)
                let (x, z): (Float, Float) = alongX ? (mid, s * E) : (s * E, mid)
                box(x, z, alongX ? len : 0.35, alongX ? 0.35 : len, 0, 0.9, "cg", Tex.crateGrey, tile: 1.5, collide: false, chamfer: 0.05)
                glowBox(x, 0.93, z, alongX ? len : 0.08, 0.05, alongX ? 0.08 : len, Level.amber, 3.5)
                let p = Geo.plane(len, fenceH)
                p.materials = [Level.makeFenceMaterial(Level.amber, length: len, height: fenceH)]
                let n = SCNNode(geometry: p)
                n.simdPosition = V3(x, fenceH / 2, z)
                n.simdEulerAngles = V3(0, alongX ? 0 : .pi / 2, 0)
                n.castsShadow = false
                n.renderingOrder = 25
                root.addChildNode(n)
            }
            // collision for players, enemies and bullets along the whole edge (the gates fill the gap)
            let (cx, cz): (Float, Float) = alongX ? (0, s * (E + 0.1)) : (s * (E + 0.1), 0)
            obstacles.append(Obstacle(minX: cx - (alongX ? E : 0.3), maxX: cx + (alongX ? E : 0.3),
                                      minZ: cz - (alongX ? 0.3 : E), maxZ: cz + (alongX ? 0.3 : E), y0: 0, y1: fenceH))
        }
        // field emitter pylons
        for a in [Float(-1), 1] {
            for b in [Float(-1), 1] {
                for along in [Float(10), 22] {
                    for (x, z) in [(a * along, b * E), (b * E, a * along)] {
                        box(x, z, 0.8, 0.8, 0, 5, "pil", Tex.pillar, tile: 0.8, tileV: 4, collide: false, chamfer: 0.06)
                        glowBox(x, 5.05, z, 0.5, 0.1, 0.5, Level.amber, 4)
                    }
                }
                box(a * E, b * E, 1.3, 1.3, 0, 6.5, "pil", Tex.pillar, tile: 1.3, tileV: 4, collide: false, chamfer: 0.08)
                blinker(2.2, Level.red, V3(a * E, 6.9, b * E), period: Double(0.6 + 0.3 * (a + b + 2)))
            }
        }
    }

    // MARK: gates (one per edge, like Helix but free-standing)

    private func buildDockGates() {
        let E: Float = 30
        let dirs: [(V3, Float)] = [(V3(0, 0, 1), 0), (V3(0, 0, -1), .pi), (V3(1, 0, 0), .pi / 2), (V3(-1, 0, 0), -.pi / 2)]
        for (dir, yaw) in dirs {
            let c = -dir * E
            let side = V3(dir.z, 0, -dir.x)
            let alongX = abs(side.x) > 0.5
            // backing frame so the portal reads as a solid gate against open space
            let back = c - dir * 0.25
            box(back.x, back.z, alongX ? 7.6 : 0.4, alongX ? 0.4 : 7.6, 0, 6.6, "pil", Tex.pillar, tile: 1.5, tileV: 4, collide: false, chamfer: 0.06)
            for s in [Float(-1), 1] {
                let p = c + side * (s * 3.1) + dir * 0.5
                box(p.x, p.z, 1.2, 1.2, 0, 6.2, "pil", Tex.pillar, tile: 1.2, tileV: 4, chamfer: 0.06)
                let gp = p + dir * 0.63
                glowBox(gp.x, 3.0, gp.z, alongX ? 0.12 : 0.05, 5.4, alongX ? 0.05 : 0.12, Level.red, 5)
            }
            let lp = c + dir * 0.5
            box(lp.x, lp.z, alongX ? 7.4 : 1.4, alongX ? 1.4 : 7.4, 5.4, 6.6, "pil", Tex.pillar, tile: 1.4, tileV: 4, collide: false, chamfer: 0.06)
            let pg = Geo.plane(5.0, 5.4)
            let pm = Level.makePortalMaterial()
            pg.materials = [pm]
            portalMaterials.append(pm)
            let pn = SCNNode(geometry: pg)
            pn.simdPosition = c + dir * 0.12 + V3(0, 2.7, 0)
            pn.simdEulerAngles = V3(0, yaw, 0)
            pn.castsShadow = false
            root.addChildNode(pn)
            let glow = Geo.glowSprite(11, Level.red, 0.5)
            glow.simdPosition = c + dir * 0.8 + V3(0, 2.7, 0)
            root.addChildNode(glow)
            let fp = c + dir * 4.5
            pool(fp.x, fp.z, 14, Level.red, 0.45)
            gates.append(Gate(pos: c + dir * 3.2, dir: dir))
        }
    }

    // MARK: central hub with control tower

    private func buildHub() {
        let H: Float = 2.4, r: Float = 6
        box(0, 0, 2 * r, 2 * r, 0, H, "tech", Tex.tech, tile: 3, chamfer: 0.05)
        // stairs on all four sides
        for d in [V2(0, 1), V2(0, -1), V2(1, 0), V2(-1, 0)] {
            // 1 m deep steps: one nav cell per step, so every cell-to-cell rise is 0.4 m
            for i in 0..<5 {
                let top = 2.0 - 0.4 * Float(i)
                let off = r + 0.5 + Float(i)
                let alongZ = d.y != 0
                box(d.x * off, d.y * off, alongZ ? 4.0 : 1.0, alongZ ? 1.0 : 4.0, 0, top, "cg", Tex.crateGrey, tile: 1.7)
            }
            // side glow strips along the stairs
            for s in [Float(-1), 1] {
                let alongZ = d.y != 0
                let px = alongZ ? s * 2.05 : d.x * 8.5, pz = alongZ ? d.y * 8.5 : s * 2.05
                glowBox(px, 0.06, pz, alongZ ? 0.06 : 5.0, 0.06, alongZ ? 5.0 : 0.06, Level.amber, 3)
            }
        }
        // railings with gaps at the stairs; their collision reaches the ground so the nav grid knows
        // the hub can only be entered over the stairs
        for d in [V2(0, 1), V2(0, -1), V2(1, 0), V2(-1, 0)] {
            for s in [Float(-1), 1] {
                let alongZ = d.y != 0
                let len: Float = r - 2.1
                let a = s * (2.1 + len / 2)
                let x = alongZ ? a : d.x * (r - 0.15), z = alongZ ? d.y * (r - 0.15) : a
                let w: Float = alongZ ? len : 0.3, dd: Float = alongZ ? 0.3 : len
                box(x, z, w, dd, H, H + 0.9, "cg", Tex.crateGrey, tile: 1.5, collide: false, chamfer: 0.04)
                glowBox(x, H + 0.93, z, alongZ ? len : 0.07, 0.05, alongZ ? 0.07 : len, Level.amber, 3.5)
                obstacles.append(Obstacle(minX: x - w / 2, maxX: x + w / 2, minZ: z - dd / 2, maxZ: z + dd / 2, y0: 0, y1: H + 0.9))
            }
        }
        // control tower
        Geo.part(root, Geo.cyl(1.6, 6.6, segments: 32), Mat.pbr("pil", Tex.pillar, 4, 1.6), V3(0, H + 3.3, 0))
        obstacles.append(Obstacle(minX: -1.45, maxX: 1.45, minZ: -1.45, maxZ: 1.45, y0: 0, y1: 11.4))
        Geo.part(root, Geo.cyl(2.3, 0.6, segments: 32), Mat.metal(V3(0.18, 0.19, 0.21), rough: 0.35), V3(0, H + 0.3, 0))
        Geo.part(root, Geo.torus(2.32, 0.05), Mat.glow(Level.amber, 4), V3(0, H + 0.62, 0), shadow: false)
        box(0, 0, 4.6, 4.6, 9.0, 11.0, "tech", Tex.tech, tile: 2.3, collide: false, chamfer: 0.2, emission: 3)
        box(0, 0, 5.4, 5.4, 11.0, 11.4, "cap", Tex.pillar, tile: 4, collide: false, chamfer: 0.1, emission: 0)
        for s in [Float(-1), 1] {
            glowBox(0, 10.1, s * 2.33, 3.6, 0.35, 0.04, Level.dockWhite, 3)
            glowBox(s * 2.33, 10.1, 0, 0.04, 0.35, 3.6, Level.dockWhite, 3)
        }
        Geo.part(root, Geo.cyl(0.09, 5, segments: 8), Mat.metal(V3(0.1, 0.1, 0.12), rough: 0.5, plating: 0), V3(0.8, 13.9, 0.8), shadow: false)
        blinker(2.4, Level.red, V3(0.8, 16.5, 0.8), period: 0.5)
        // rotating warning beacon on the roof
        let beacon = SCNNode()
        beacon.simdPosition = V3(0, 11.75, 0)
        root.addChildNode(beacon)
        Geo.part(beacon, Geo.cyl(0.35, 0.6, segments: 16), Mat.glow(Level.amber, 5), V3(0, 0, 0), shadow: false)
        for s in [Float(-1), 1] {
            let cone = Geo.cone(0.2, 2.2, 9, segments: 24)
            cone.materials = [Mat.additive(Tex.shaft, Level.amber, 0.14)]
            let cn = SCNNode(geometry: cone)
            cn.simdPosition = V3(s * 4.6, 0, 0)
            cn.simdEulerAngles = V3(0, 0, s * .pi / 2)
            cn.castsShadow = false
            beacon.addChildNode(cn)
        }
        beacon.runAction(.repeatForever(.rotateBy(x: 0, y: 2 * .pi, z: 0, duration: 2.6)))
        // consoles at the hub corners
        for sx in [Float(-1), 1] {
            for sz in [Float(-1), 1] {
                box(sx * 4.4, sz * 4.4, 1.1, 0.7, H, H + 1.05, "tech", Tex.tech, tile: 1.1, chamfer: 0.08)
                let scr = glowBox(sx * 4.4, H + 1.25, sz * 4.4, 0.9, 0.5, 0.04, Level.teal, 2.5)
                scr.simdEulerAngles = V3(-0.35 * sz, 0, 0)
            }
        }
        pool(0, 0, 18, Level.dockWhite, 0.22, y: H + 0.02)
    }

    // MARK: landing pads + parked dropships

    private func buildPads() {
        for sx in [Float(-1), 1] {
            for sz in [Float(-1), 1] {
                let cx = 19 * sx, cz = 19 * sz
                box(cx, cz, 11, 11, 0, 0.5, "deck", Tex.deck, tile: 4, chamfer: 0.15, emission: 0)
                let mark = Geo.plane(9.4, 9.4)
                mark.materials = [Mat.additive(Tex.padMark, Level.amber, 1.3)]
                let mn = SCNNode(geometry: mark)
                mn.simdEulerAngles = V3(-.pi / 2, 0, 0)
                mn.simdPosition = V3(cx, 0.515, cz)
                mn.castsShadow = false
                root.addChildNode(mn)
                for s in [Float(-1), 1] {
                    glowBox(cx + s * 5.45, 0.52, cz, 0.06, 0.04, 10.6, Level.amber, 3)
                    glowBox(cx, 0.52, cz + s * 5.45, 10.6, 0.04, 0.06, Level.amber, 3)
                }
                pool(cx, cz, 12, Level.amber, 0.22, y: 0.53)
                if sx == sz { dropship(cx, cz, facing: -sz) } else { padCargo(cx, cz, sx, sz) }
            }
        }
    }

    private func dropship(_ cx: Float, _ cz: Float, facing f: Float) {
        let hull = Mat.metal(V3(0.5, 0.52, 0.55), rough: 0.3, plating: 2)
        let dark = Mat.metal(V3(0.12, 0.13, 0.15), rough: 0.35, plating: 2)
        let base: Float = 0.5
        Geo.part(root, Geo.box(3.4, 2.4, 8.0, chamfer: 0.6), hull, V3(cx, base + 1.9, cz))
        Geo.part(root, Geo.box(2.6, 1.5, 2.6, chamfer: 0.6), dark, V3(cx, base + 2.2, cz + f * 4.6))
        glowBox(cx, base + 2.5, cz + f * 5.9, 1.9, 0.35, 0.05, Level.teal, 3)
        Geo.part(root, Geo.box(9.5, 0.28, 2.8, chamfer: 0.1), hull, V3(cx, base + 2.2, cz - f * 0.6))
        for s in [Float(-1), 1] {
            glowBox(cx + s * 4.7, base + 2.2, cz - f * 0.6, 0.12, 0.12, 2.4, Level.red, 4)
            Geo.part(root, Geo.cyl(0.62, 2.2, segments: 20), dark, V3(cx + s * 1.2, base + 2.0, cz - f * 4.9), rot: V3(.pi / 2, 0, 0))
            Geo.part(root, Geo.cyl(0.5, 0.05, segments: 20), Mat.glow(V3(0.4, 0.75, 1.0), 4), V3(cx + s * 1.2, base + 2.0, cz - f * 6.02), rot: V3(.pi / 2, 0, 0), shadow: false)
            for zz in [Float(-2.6), 2.6] {
                Geo.part(root, Geo.box(0.22, 0.9, 0.22), dark, V3(cx + s * 1.3, base + 0.45, cz + zz))
            }
            // engine idle exhaust
            let ex = SCNParticleSystem()
            ex.particleImage = Tex.glow
            ex.birthRate = 30
            ex.particleLifeSpan = 0.5
            ex.particleLifeSpanVariation = 0.2
            ex.particleSize = 0.5
            ex.particleSizeVariation = 0.2
            ex.particleVelocity = 2.5
            ex.particleVelocityVariation = 1
            ex.emittingDirection = SCNVector3(0, 0, CGFloat(-f))
            ex.spreadingAngle = 8
            ex.particleColor = color(0.35, 0.7, 1.0, 0.8)
            ex.blendMode = .additive
            ex.isLightingEnabled = false
            let fade = CAKeyframeAnimation(); fade.values = [0.8, 0]; fade.keyTimes = [0, 1]
            ex.propertyControllers = [.opacity: SCNParticlePropertyController(animation: fade)]
            let en = SCNNode()
            en.simdPosition = V3(cx + s * 1.2, base + 2.0, cz - f * 6.1)
            en.addParticleSystem(ex)
            root.addChildNode(en)
        }
        Geo.part(root, Geo.box(0.3, 1.8, 2.2, chamfer: 0.1), hull, V3(cx, base + 3.9, cz - f * 3.0))
        blinker(1.2, Level.red, V3(cx, base + 4.9, cz - f * 3.4), period: 0.8)
        obstacles.append(Obstacle(minX: cx - 1.7, maxX: cx + 1.7, minZ: cz - 4.0, maxZ: cz + 4.0, y0: 0, y1: base + 3.1))
        obstacles.append(Obstacle(minX: cx - 1.3, maxX: cx + 1.3, minZ: min(cz + f * 3.3, cz + f * 5.9), maxZ: max(cz + f * 3.3, cz + f * 5.9), y0: 0, y1: base + 3.0))
    }

    private func padCargo(_ cx: Float, _ cz: Float, _ sx: Float, _ sz: Float) {
        let cw: Float = 2.6, cl: Float = 5.2, ch: Float = 2.6
        box(cx + sx * 1.8, cz - sz * 1.4, cl, cw, 0.5, 0.5 + ch, "co", Tex.crateOrange, tile: 2.6, chamfer: 0.03)
        box(cx + sx * 1.8, cz - sz * 1.4, cl, cw, 0.5 + ch, 0.5 + 2 * ch, "ct", Tex.crateTeal, tile: 2.6, chamfer: 0.03)
        box(cx - sx * 2.4, cz + sz * 2.2, cw, cl, 0.5, 0.5 + ch, "cg", Tex.crateGrey, tile: 2.6, chamfer: 0.03)
        let cs: Float = 1.3
        box(cx - sx * 2.6, cz - sz * 2.6, cs, cs, 0.5, 0.5 + cs, "co", Tex.crateOrange, tile: cs, chamfer: 0.03)
        box(cx - sx * 1.2, cz - sz * 2.7, cs, cs, 0.5, 0.5 + cs, "ct", Tex.crateTeal, tile: cs, chamfer: 0.03)
    }

    // MARK: gantry cranes with hanging containers

    private func buildCranes() {
        for s in [Float(-1), 1] {
            let z = 11.5 * s
            for x in [Float(-15), 15] {
                box(x, z, 1.0, 1.0, 0, 10, "co", Tex.crateOrange, tile: 1.0, tileV: 2.6, chamfer: 0.05)
                box(x, z, 1.8, 1.8, 0, 0.4, "cg", Tex.crateGrey, tile: 1.8, collide: false, chamfer: 0.05)
            }
            box(0, z, 31.2, 1.2, 9.6, 10.7, "co", Tex.crateOrange, tile: 2.6, collide: false, chamfer: 0.05)
            glowBox(0, 9.55, z, 30, 0.05, 0.1, Level.amber, 3)
            let tx = 6 * s
            Geo.part(root, Geo.box(1.8, 0.7, 1.6, chamfer: 0.08), Mat.metal(V3(0.2, 0.2, 0.22), rough: 0.35), V3(tx, 9.25, z))
            for dx in [Float(-1.6), 1.6] {
                Geo.part(root, Geo.cyl(0.04, 2.3, segments: 6), Mat.metal(V3(0.1, 0.1, 0.1), rough: 0.5, plating: 0), V3(tx + dx, 7.85, z), shadow: false)
            }
            box(tx, z, 5.2, 2.6, 4.1, 6.7, "ct", Tex.crateTeal, tile: 2.6, chamfer: 0.03)
            blinker(1.0, Level.amber, V3(tx, 9.75, z), period: 0.4)
        }
    }

    // MARK: cover on the open deck

    private func buildDockCover() {
        let cw: Float = 2.6, cl: Float = 5.2, ch: Float = 2.6
        func container(_ x: Float, _ z: Float, alongX: Bool, _ y0: Float, _ name: String, _ set: TextureSet) {
            box(x, z, alongX ? cl : cw, alongX ? cw : cl, y0, y0 + ch, name, set, tile: 2.6, chamfer: 0.03)
        }
        container(-13.6, 4, alongX: false, 0, "co", Tex.crateOrange)
        container(13.6, -4, alongX: false, 0, "ct", Tex.crateTeal)
        container(13.6, -4.4, alongX: false, ch, "cg", Tex.crateGrey)
        container(3.5, 20, alongX: true, 0, "cg", Tex.crateGrey)
        container(-3.5, -20, alongX: true, 0, "co", Tex.crateOrange)
        container(22, 4.5, alongX: false, 0, "ct", Tex.crateTeal)
        container(-22, -4.5, alongX: false, 0, "cg", Tex.crateGrey)
        container(-22, -4.1, alongX: false, ch, "co", Tex.crateOrange)

        let cs: Float = 1.3
        func crate(_ x: Float, _ z: Float, _ level: Int, _ k: Int) {
            let sets: [(String, TextureSet)] = [("co", Tex.crateOrange), ("ct", Tex.crateTeal), ("cg", Tex.crateGrey)]
            let (nm, st) = sets[k % 3]
            box(x, z, cs, cs, Float(level) * cs, Float(level + 1) * cs, nm, st, tile: cs, chamfer: 0.03)
        }
        for s in [Float(1), -1] {
            crate(9 * s, -9 * s, 0, 0); crate(10.4 * s, -9 * s, 0, 2); crate(9 * s, -10.4 * s, 0, 1); crate(9.1 * s, -9.1 * s, 1, 2)
            crate(9 * s, 9.5 * s, 0, 1); crate(10.5 * s, 9.2 * s, 0, 0)
            crate(17 * s, -8 * s, 0, 2); crate(-8 * s, -17 * s, 0, 1)
        }
        func barrier(_ x: Float, _ z: Float, alongX: Bool) {
            let w: Float = alongX ? 3.4 : 0.55, d: Float = alongX ? 0.55 : 3.4
            box(x, z, w, d, 0, 1.15, "cg", Tex.crateGrey, tile: 1.7, tileV: 1.15, chamfer: 0.05)
            glowBox(x, 1.17, z, alongX ? 3.0 : 0.1, 0.04, alongX ? 0.1 : 3.0, Level.amber, 4)
        }
        barrier(0, 19.5, alongX: true); barrier(0, -19.5, alongX: true)
        barrier(19.5, 0, alongX: false); barrier(-19.5, 0, alongX: false)
        barrier(-6, 14.5, alongX: true); barrier(6, -14.5, alongX: true)
        // fuel tanks along the edges
        let tankMat = Mat.metal(V3(0.6, 0.6, 0.62), rough: 0.25)
        for (x, z) in [(Float(27.2), Float(10)), (27.2, -10), (-27.2, 10), (-27.2, -10), (10, 27.2), (-10, 27.2), (10, -27.2), (-10, -27.2)] {
            Geo.part(root, Geo.capsule(0.85, 3.6), tankMat, V3(x, 1.8, z))
            Geo.part(root, Geo.torus(0.87, 0.06), Mat.glow(Level.amber, 4), V3(x, 2.4, z), shadow: false)
            obstacles.append(Obstacle(minX: x - 0.8, maxX: x + 0.8, minZ: z - 0.8, maxZ: z + 0.8, y0: 0, y1: 3.6))
        }
    }

    // MARK: floodlight masts in the corners

    private func buildMasts() {
        for sx in [Float(-1), 1] {
            for sz in [Float(-1), 1] {
                let x = 27.6 * sx, z = 27.6 * sz
                Geo.part(root, Geo.cyl(0.3, 14, segments: 12), Mat.metal(V3(0.2, 0.21, 0.23), rough: 0.35), V3(x, 7, z))
                obstacles.append(Obstacle(minX: x - 0.3, maxX: x + 0.3, minZ: z - 0.3, maxZ: z + 0.3, y0: 0, y1: 14))
                let head = V3(x - sx * 0.6, 13.8, z - sz * 0.6)
                let hn = Geo.part(root, Geo.box(2.0, 0.8, 0.9, chamfer: 0.1), Mat.metal(V3(0.14, 0.15, 0.17), rough: 0.35), head, shadow: false)
                hn.simdEulerAngles = V3(0, atan2(-sx, -sz) + .pi / 2, 0)
                let lamp = Geo.glowSprite(3.2, V3(1.0, 0.85, 0.6), 1.1)
                lamp.simdPosition = head - V3(sx, 0.2, sz) * 0.5
                root.addChildNode(lamp)
                shaftCone(from: head, to: V3(12 * sx, 0, 12 * sz), top: 0.5, bottom: 4.5, V3(1.0, 0.8, 0.55), 0.05)
                pool(14 * sx, 14 * sz, 16, V3(1.0, 0.75, 0.45), 0.18)
            }
        }
    }

    // MARK: backdrop: capital ship alongside, docking arm

    private func buildDockBackdrop() {
        box(-72, 0, 26, 170, -16, 16, "wall", Tex.wallCyan, tile: 8, collide: false, emission: 2.2).castsShadow = false
        box(-68, 18, 12, 46, 16, 26, "wall", Tex.wallCyan, tile: 8, collide: false, emission: 2.2).castsShadow = false
        box(-72, -70, 30, 20, -12, 12, "tech", Tex.tech, tile: 6, collide: false, emission: 2.5).castsShadow = false
        for (dz, dy) in [(Float(-6), Float(-6)), (6, -6), (-6, 6), (6, 6)] {
            let g = Geo.glowSprite(16, V3(0.4, 0.75, 1.0), 0.8)
            g.simdPosition = V3(-72 + dz * 1.4, dy, -86)
            root.addChildNode(g)
        }
        glowBox(-58.9, 4, 0, 0.2, 0.3, 160, Level.teal, 3)
        glowBox(-58.9, -8, 0, 0.2, 0.3, 160, Level.amber, 3)
        for k in 0..<6 { blinker(3.0, Level.red, V3(-58.6, 16.5, -75 + Float(k) * 30), period: Double(0.4 + 0.2 * Float(k))) }
        // docking arm from the deck edge to the ship
        box(-45, 6, 28, 5, -1.4, 0.6, "cg", Tex.crateGrey, tile: 2, collide: false, chamfer: 0.1).castsShadow = false
        glowBox(-45, 0.65, 4.0, 28, 0.06, 0.1, Level.amber, 3)
        glowBox(-45, 0.65, 8.0, 28, 0.06, 0.1, Level.amber, 3)
        // arms on the other sides reaching into the void
        for (x, z, w, d) in [(Float(0), Float(44), Float(5), Float(26)), (44, 0, 26, 5), (0, -44, 5, 26)] {
            box(x, z, w, d, -1.4, -0.2, "cg", Tex.crateGrey, tile: 2, collide: false, chamfer: 0.1).castsShadow = false
            let far = V3(x, 0.5, z) + simd_normalize(V3(x, 0, z)) * 12
            blinker(2.2, Level.red, far, period: 0.7)
        }
    }

    // MARK: deck markings

    private func buildDockStrips() {
        let y: Float = 0.012
        for s in [Float(-1), 1] {
            glowBox(0, y, s * 18.6, 0.12, 0.02, 15.2, Level.amber, 2.4)
            glowBox(s * 18.6, y, 0, 15.2, 0.02, 0.12, Level.amber, 2.4)
            glowBox(-0.9, y, s * 28.2, 0.08, 0.02, 2.8, Level.red, 3)
            glowBox(0.9, y, s * 28.2, 0.08, 0.02, 2.8, Level.red, 3)
            glowBox(s * 28.2, y, -0.9, 2.8, 0.02, 0.08, Level.red, 3)
            glowBox(s * 28.2, y, 0.9, 2.8, 0.02, 0.08, Level.red, 3)
        }
        let pr: Float = 29.3
        for s in [Float(-1), 1] {
            glowBox(0, y, s * pr, 2 * pr, 0.02, 0.06, Level.teal, 2.2)
            glowBox(s * pr, y, 0, 0.06, 0.02, 2 * pr, Level.teal, 2.2)
        }
    }

    private func buildDockAtmosphere() {
        let dust = SCNParticleSystem()
        dust.particleImage = Tex.softDot
        dust.birthRate = 90
        dust.particleLifeSpan = 9
        dust.particleLifeSpanVariation = 3
        dust.emitterShape = Geo.box(62, 10, 62)
        dust.birthLocation = .volume
        dust.particleSize = 0.035
        dust.particleSizeVariation = 0.025
        dust.particleVelocity = 0.3
        dust.particleVelocityVariation = 0.2
        dust.spreadingAngle = 180
        dust.particleColor = color(1.0, 0.85, 0.65, 0.5)
        dust.blendMode = .additive
        dust.isLightingEnabled = false
        dust.warmupDuration = 9
        let fade = CAKeyframeAnimation()
        fade.values = [0, 1, 1, 0]; fade.keyTimes = [0, 0.15, 0.8, 1]
        dust.propertyControllers = [.opacity: SCNParticlePropertyController(animation: fade)]
        let dn = SCNNode(); dn.simdPosition = V3(0, 5, 0)
        dn.addParticleSystem(dust)
        root.addChildNode(dn)
    }
}
