import SceneKit
import AppKit
import simd

struct Obstacle {
    var minX: Float, maxX: Float, minZ: Float, maxZ: Float, y0: Float, y1: Float
}

struct Gate {
    var pos: V3      // spawn point just inside the arena
    var dir: V3      // facing into the arena
}

/// Flow-field navigation over a 1 m grid (BFS from the player every few frames).
final class Nav {
    static let n = 64
    static let origin: Float = -32
    /// highest ledge an agent can walk up – must match the 0.55 m step in moveGround, or the flow field
    /// leads enemies into stair sides they cannot climb
    static let maxStep: Float = 0.55
    var height = [Float](repeating: 0, count: n * n)
    var blocked = [Bool](repeating: false, count: n * n)
    var dist = [Int32](repeating: Int32.max, count: n * n)
    private var queue = [Int32](repeating: 0, count: n * n)

    init(_ obstacles: [Obstacle]) {
        let n = Nav.n
        for cz in 0..<n {
            for cx in 0..<n {
                let x = Nav.origin + Float(cx) + 0.5, z = Nav.origin + Float(cz) + 0.5
                var h: Float = 0, b = false
                for o in obstacles where o.y0 < 1.8 {
                    let tall = o.y1 > 2.0
                    let m: Float = tall ? 0.45 : 0.0
                    if x > o.minX - m && x < o.maxX + m && z > o.minZ - m && z < o.maxZ + m {
                        if tall { b = true } else { h = max(h, o.y1) }
                    }
                }
                height[cz * n + cx] = h
                blocked[cz * n + cx] = b
            }
        }
    }

    @inline(__always) func cell(_ x: Float, _ z: Float) -> (Int, Int) {
        (min(max(Int(floor(x - Nav.origin)), 0), Nav.n - 1), min(max(Int(floor(z - Nav.origin)), 0), Nav.n - 1))
    }

    @inline(__always) private func passable(_ a: Int, _ b: Int) -> Bool {
        !blocked[b] && abs(height[a] - height[b]) <= Nav.maxStep
    }

    func rebuild(target: V3) {
        let n = Nav.n
        for i in 0..<(n * n) { dist[i] = Int32.max }
        var head = 0, tail = 0
        let (pcx, pcz) = cell(target.x, target.z)
        func seed(radius: Int, strictHeight: Bool) {
            for dz in -radius...radius {
                for dx in -radius...radius {
                    let cx = pcx + dx, cz = pcz + dz
                    if cx < 0 || cz < 0 || cx >= n || cz >= n { continue }
                    let i = cz * n + cx
                    if blocked[i] || dist[i] != Int32.max { continue }
                    if strictHeight && abs(height[i] - target.y) > 0.7 { continue }
                    dist[i] = Int32(abs(dx) + abs(dz)); queue[tail] = Int32(i); tail += 1
                }
            }
        }
        seed(radius: 0, strictHeight: true)
        if tail == 0 { seed(radius: 1, strictHeight: true) }
        if tail == 0 { seed(radius: 2, strictHeight: false) }
        if tail == 0 { seed(radius: 4, strictHeight: false) }
        while head < tail {
            let i = Int(queue[head]); head += 1
            let cx = i % n, cz = i / n
            let d = dist[i] + 1
            for (dx, dz) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
                let nx = cx + dx, nz = cz + dz
                if nx < 0 || nz < 0 || nx >= n || nz >= n { continue }
                let j = nz * n + nx
                if dist[j] != Int32.max || !passable(i, j) { continue }
                dist[j] = d; queue[tail] = Int32(j); tail += 1
            }
        }
    }

    /// Unit XZ direction an agent at `pos` should walk to reach the target.
    func direction(from pos: V3, toward target: V3) -> V2 {
        let n = Nav.n
        let (cx, cz) = cell(pos.x, pos.z)
        let i = cz * n + cx
        var best = Float.greatestFiniteMagnitude
        var bestDir = V2(target.x - pos.x, target.z - pos.z)
        let here = dist[i]
        for dz in -1...1 {
            for dx in -1...1 {
                if dx == 0 && dz == 0 { continue }
                let nx = cx + dx, nz = cz + dz
                if nx < 0 || nz < 0 || nx >= n || nz >= n { continue }
                let j = nz * n + nx
                if dist[j] == Int32.max { continue }
                if dx != 0 && dz != 0 {
                    // no corner cutting
                    let a = cz * n + nx, b = nz * n + cx
                    if dist[a] == Int32.max || dist[b] == Int32.max { continue }
                    if abs(height[a] - height[i]) > Nav.maxStep || abs(height[b] - height[i]) > Nav.maxStep { continue }
                }
                if here != Int32.max && !blocked[i] && abs(height[j] - height[i]) > Nav.maxStep { continue }
                let wx = Nav.origin + Float(nx) + 0.5, wz = Nav.origin + Float(nz) + 0.5
                let score = Float(dist[j]) + 0.02 * simd_length(V2(target.x - wx, target.z - wz))
                if score < best { best = score; bestDir = V2(wx - pos.x, wz - pos.z) }
            }
        }
        let l = simd_length(bestDir)
        return l > 1e-4 ? bestDir / l : V2(0, 0)
    }
}

final class Level {
    static let half: Float = 32
    static let wallH: Float = 8
    let root = SCNNode()
    var obstacles: [Obstacle] = []
    var gates: [Gate] = []
    var pickupSpots: [V3] = []
    var portalMaterials: [SCNMaterial] = []
    private(set) var nav: Nav!
    let sunNode = SCNNode()
    let coreLight = SCNNode()

    let map: MapID
    /// playable half extent (players and enemies are clamped to ±bounds)
    var bounds: Float = Level.half
    /// shots only hit the floor plane inside ±floorExtent (the dock deck ends, Helix's floor does not)
    var floorExtent: Float = .greatestFiniteMagnitude
    var playerStart = V3(0, 0, 16)
    var playerYaw: Float = 0
    var menuRadius: Float = 25
    var menuHeight: Float = 7.5
    var menuLookY: Float = 3.6

    static let cyan = V3(0.25, 0.9, 1.0)
    static let magenta = V3(1.0, 0.2, 0.6)
    static let orange = V3(1.0, 0.5, 0.12)
    static let red = V3(1.0, 0.16, 0.10)

    init(scene: SCNScene, map: MapID) {
        self.map = map
        scene.rootNode.addChildNode(root)
        switch map {
        case .helix: buildHelix(scene)
        case .dock: buildDock(scene)
        }
        nav = Nav(obstacles)
    }

    /// Takes the whole map out of the scene (switching maps in the menu).
    func remove() {
        root.enumerateHierarchy { n, _ in n.removeAllActions(); n.removeAllParticleSystems() }
        root.removeFromParentNode()
    }

    private func buildHelix(_ scene: SCNScene) {
        buildSkyAndLights(scene)
        buildFloor()
        buildWalls()
        buildCore()
        buildPillarsAndBeams()
        buildPlatforms()
        buildCover()
        buildGenerators()
        buildSkyline()
        buildFloorStrips()
        buildAtmosphere()
        pickupSpots += [V3(20, 1.6, -20), V3(-20, 1.6, 20), V3(0, 0, 18), V3(0, 0, -18), V3(18, 0, 0), V3(-18, 0, 0),
                        V3(-12, 0, -24), V3(12, 0, 24), V3(26, 0, -6), V3(-26, 0, 6)]
    }

    // MARK: building blocks

    /// Textured box standing on y0. `tile` = metres per texture repeat.
    @discardableResult
    func box(_ cx: Float, _ cz: Float, _ w: Float, _ d: Float, _ y0: Float, _ y1: Float, _ name: String, _ set: TextureSet,
             tile: Float, tileV: Float? = nil, collide: Bool = true, chamfer: Float = 0, emission: Float = 2.2) -> SCNNode {
        let h = y1 - y0
        let tv = tileV ?? tile
        let g = Geo.box(w, h, d, chamfer: chamfer)
        let front = Mat.pbr(name, set, max(w / tile, 0.05), max(h / tv, 0.05), emission: emission)
        let side = Mat.pbr(name, set, max(d / tile, 0.05), max(h / tv, 0.05), emission: emission)
        let top = Mat.pbr(name, set, max(w / tile, 0.05), max(d / tile, 0.05), emission: emission)
        g.materials = [front, side, front, side, top, top]
        let n = SCNNode(geometry: g)
        n.simdPosition = V3(cx, y0 + h / 2, cz)
        root.addChildNode(n)
        if collide { obstacles.append(Obstacle(minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2, y0: y0, y1: y1)) }
        return n
    }

    @discardableResult
    func glowBox(_ cx: Float, _ cy: Float, _ cz: Float, _ w: Float, _ h: Float, _ d: Float, _ c: V3, _ intensity: Float = 3) -> SCNNode {
        let n = Geo.part(root, Geo.box(w, h, d), Mat.glow(c, intensity), V3(cx, cy, cz), shadow: false)
        return n
    }

    /// Additive light pool painted on the floor (fake bounce light).
    func pool(_ x: Float, _ z: Float, _ size: Float, _ c: V3, _ intensity: Float, y: Float = 0.03) {
        let p = Geo.plane(size, size)
        p.materials = [Mat.additive(Tex.glow, c, intensity)]
        let n = SCNNode(geometry: p)
        n.simdEulerAngles = V3(-.pi / 2, 0, 0)
        n.simdPosition = V3(x, y, z)
        n.castsShadow = false
        n.renderingOrder = 10
        root.addChildNode(n)
    }

    // MARK: sections

    private func buildSkyAndLights(_ scene: SCNScene) {
        scene.background.contents = Tex.sky
        scene.background.intensity = 1.7
        scene.lightingEnvironment.contents = Tex.env
        scene.lightingEnvironment.intensity = 1.25
        scene.fogColor = color(0.03, 0.06, 0.10)
        scene.fogStartDistance = 28
        scene.fogEndDistance = 150
        scene.fogDensityExponent = 1.4

        let sun = SCNLight()
        sun.type = .directional
        sun.color = color(1.0, 0.92, 0.80)
        sun.intensity = 1900
        sun.castsShadow = true
        sun.shadowMapSize = CGSize(width: 4096, height: 4096)
        sun.shadowCascadeCount = 3
        sun.shadowCascadeSplittingFactor = 0.6
        sun.maximumShadowDistance = 95
        sun.automaticallyAdjustsShadowProjection = true
        sun.shadowSampleCount = 8
        sun.shadowRadius = 3
        sun.shadowBias = 3
        sun.shadowColor = NSColor(white: 0, alpha: 0.88)
        sunNode.light = sun
        sunNode.simdPosition = Tex.sunDir * 60
        sunNode.simdLook(at: V3(0, 0, 0))
        root.addChildNode(sunNode)

        func omni(_ node: SCNNode, _ c: V3, _ intensity: Float, _ pos: V3, _ range: Float) {
            let l = SCNLight()
            l.type = .omni
            l.color = color(c)
            l.intensity = CGFloat(intensity)
            l.attenuationStartDistance = 1
            l.attenuationEndDistance = CGFloat(range)
            l.attenuationFalloffExponent = 2
            node.light = l
            node.simdPosition = pos
            root.addChildNode(node)
        }
        omni(coreLight, Level.cyan, 3000, V3(0, 3.0, 0), 28)
        omni(SCNNode(), Level.magenta, 4500, V3(-18.5, 3.2, -18.5), 22)
        omni(SCNNode(), Level.orange, 4500, V3(18.5, 3.2, 18.5), 22)
    }

    private func buildFloor() {
        let f = SCNFloor()
        f.reflectivity = 0.28
        f.reflectionFalloffEnd = 14
        f.reflectionResolutionScaleFactor = 0.6
        let m = SCNMaterial()
        m.lightingModel = .physicallyBased
        let set = Tex.floor
        // no normal map here: SCNFloor would use it to warp the mirror image, which looks like melting
        for (p, c) in [(m.diffuse, set.albedo), (m.roughness, set.roughness), (m.metalness, set.metalness)] {
            p.contents = c
            p.wrapS = .repeat; p.wrapT = .repeat
            p.mipFilter = .linear; p.maxAnisotropy = 16
            p.contentsTransform = SCNMatrix4MakeScale(0.25, 0.25, 1)
        }
        f.materials = [m]
        let n = SCNNode(geometry: f)
        n.physicsBody = SCNPhysicsBody(type: .static, shape: nil)
        root.addChildNode(n)
    }

    private func buildWalls() {
        let H = Level.half, t: Float = 2, h = Level.wallH
        let w = Tex.wallCyan
        box(0, -(H + t / 2), 2 * H + 2 * t, t, 0, h, "wall", w, tile: 4)
        box(0, (H + t / 2), 2 * H + 2 * t, t, 0, h, "wall", w, tile: 4)
        box(-(H + t / 2), 0, t, 2 * H, 0, h, "wall", w, tile: 4)
        box((H + t / 2), 0, t, 2 * H, 0, h, "wall", w, tile: 4)
        // caps + neon crown
        let cap = Tex.pillar
        box(0, -(H + 0.6), 2 * H + 4, 3.2, h, h + 0.7, "cap", cap, tile: 4, collide: false, emission: 0)
        box(0, (H + 0.6), 2 * H + 4, 3.2, h, h + 0.7, "cap", cap, tile: 4, collide: false, emission: 0)
        box(-(H + 0.6), 0, 3.2, 2 * H, h, h + 0.7, "cap", cap, tile: 4, collide: false, emission: 0)
        box((H + 0.6), 0, 3.2, 2 * H, h, h + 0.7, "cap", cap, tile: 4, collide: false, emission: 0)
        let ny = h - 0.12
        glowBox(0, ny, -(H - 0.9), 2 * H, 0.1, 0.1, Level.magenta, 4)
        glowBox(0, ny, (H - 0.9), 2 * H, 0.1, 0.1, Level.magenta, 4)
        glowBox(-(H - 0.9), ny, 0, 0.1, 0.1, 2 * H, Level.magenta, 4)
        glowBox((H - 0.9), ny, 0, 0.1, 0.1, 2 * H, Level.magenta, 4)

        // spawn gates in the middle of every wall
        let dirs: [(V3, Float)] = [(V3(0, 0, 1), 0), (V3(0, 0, -1), .pi), (V3(1, 0, 0), .pi / 2), (V3(-1, 0, 0), -.pi / 2)]
        for (dir, yaw) in dirs {
            let c = -dir * H            // wall centre point
            let side = V3(dir.z, 0, -dir.x)
            let alongX = abs(side.x) > 0.5
            for s in [Float(-1), 1] {
                let p = c + side * (s * 3.1) + dir * 0.7
                box(p.x, p.z, 1.3, 1.3, 0, 6.2, "pil", Tex.pillar, tile: 1.3, tileV: 4, chamfer: 0.06)
                let gp = p + dir * 0.68
                glowBox(gp.x, 3.0, gp.z, alongX ? 0.12 : 0.05, 5.4, alongX ? 0.05 : 0.12, Level.red, 5)
            }
            let lp = c + dir * 0.7
            box(lp.x, lp.z, alongX ? 7.5 : 1.5, alongX ? 1.5 : 7.5, 5.4, 6.6, "pil", Tex.pillar, tile: 1.5, tileV: 4, collide: false, chamfer: 0.06)
            // portal surface
            let pg = Geo.plane(5.0, 5.4)
            let pm = Level.makePortalMaterial()
            pg.materials = [pm]
            portalMaterials.append(pm)
            let pn = SCNNode(geometry: pg)
            pn.simdPosition = c + dir * 0.12 + V3(0, 2.7, 0)
            pn.simdEulerAngles = V3(0, yaw, 0)
            pn.castsShadow = false
            root.addChildNode(pn)
            let glow = Geo.glowSprite(11, Level.red, 0.55)
            glow.simdPosition = c + dir * 0.8 + V3(0, 2.7, 0)
            root.addChildNode(glow)
            let fp = c + dir * 4.5
            pool(fp.x, fp.z, 15, Level.red, 0.5)
            gates.append(Gate(pos: c + dir * 3.2, dir: dir))
        }
    }

    private func buildCore() {
        box(0, 0, 6.4, 6.4, 0, 0.4, "tech", Tex.tech, tile: 3.2, chamfer: 0.05)
        obstacles.append(Obstacle(minX: -1.9, maxX: 1.9, minZ: -1.9, maxZ: 1.9, y0: 0.4, y1: 9))
        for sx in [Float(-1), 1] {
            for sz in [Float(-1), 1] {
                box(sx * 1.55, sz * 1.55, 0.55, 0.55, 0.4, 8.2, "pil", Tex.pillar, tile: 0.55, tileV: 4, collide: false, chamfer: 0.04)
            }
        }
        box(0, 0, 4.4, 4.4, 8.2, 9.0, "tech", Tex.tech, tile: 2.2, collide: false, chamfer: 0.08)
        box(0, 0, 3.4, 3.4, 0.4, 1.0, "tech", Tex.tech, tile: 1.7, collide: false, chamfer: 0.08)

        // energy column
        let cyl = Geo.cyl(0.85, 7.3, segments: 32)
        let m = SCNMaterial()
        m.lightingModel = .constant
        m.diffuse.contents = NSColor.white
        m.shaderModifiers = [.surface: """
        #pragma body
        float2 uv = _surface.diffuseTexcoord;
        float t = scn_frame.time;
        float f1 = sin(uv.y * 26.0 - t * 7.0 + sin(uv.x * 12.566 + t) * 2.0) * 0.5 + 0.5;
        float f2 = sin(uv.y * 70.0 - t * 13.0 + uv.x * 25.13) * 0.5 + 0.5;
        float pulse = 0.85 + 0.15 * sin(t * 2.3);
        float3 base = float3(0.10, 0.55, 0.95);
        float3 hot = float3(0.75, 1.0, 1.0);
        float3 colr = mix(base, hot, f1 * f1 * 0.7) * (0.55 + 0.75 * f1 + 0.3 * f2) * pulse;
        _surface.diffuse = float4(colr, 1.0);
        """]
        cyl.materials = [m]
        let cn = SCNNode(geometry: cyl)
        cn.simdPosition = V3(0, 4.6, 0)
        cn.castsShadow = false
        root.addChildNode(cn)

        let ringMat = Mat.metal(V3(0.5, 0.55, 0.6), rough: 0.25)
        for (i, y) in [Float(2.3), 4.6, 6.9].enumerated() {
            let holder = SCNNode()
            holder.simdPosition = V3(0, y, 0)
            root.addChildNode(holder)
            let ring = Geo.part(holder, Geo.torus(2.55, 0.09), ringMat, V3(0, 0, 0))
            let gl = Geo.part(holder, Geo.torus(2.55, 0.035), Mat.glow(Level.cyan, 4), V3(0, 0.1, 0), shadow: false)
            _ = ring; _ = gl
            holder.simdEulerAngles = V3(i == 1 ? 0.25 : 0.12, 0, i == 2 ? 0.2 : -0.1)
            let dur = 9.0 + Double(i) * 3.5
            holder.runAction(.repeatForever(.rotateBy(x: 0, y: CGFloat(i % 2 == 0 ? 2 * Float.pi : -2 * Float.pi), z: 0, duration: dur)))
        }
        let halo = Geo.glowSprite(11, Level.cyan, 0.28)
        halo.simdPosition = V3(0, 4.6, 0)
        root.addChildNode(halo)
        pool(0, 0, 26, Level.cyan, 0.28)
    }

    private func buildPillarsAndBeams() {
        let p: Float = 14
        for sx in [Float(-1), 1] {
            for sz in [Float(-1), 1] {
                box(sx * p, sz * p, 2.4, 2.4, 0, 10, "pil", Tex.pillar, tile: 2.4, tileV: 4, chamfer: 0.12)
                box(sx * p, sz * p, 3.2, 3.2, 0, 0.5, "tech", Tex.tech, tile: 1.6, collide: false, chamfer: 0.08)
                box(sx * p, sz * p, 3.3, 3.3, 10, 10.6, "tech", Tex.tech, tile: 1.65, collide: false, chamfer: 0.1)
            }
        }
        // overhead ring of beams + hanging lamps
        for s in [Float(-1), 1] {
            box(0, s * p, 2 * p - 2.4, 0.8, 9.2, 10.0, "cap", Tex.pillar, tile: 4, collide: false, emission: 0)
            box(s * p, 0, 0.8, 2 * p - 2.4, 9.2, 10.0, "cap", Tex.pillar, tile: 4, collide: false, emission: 0)
            glowBox(0, 9.17, s * p, 2 * p - 3, 0.06, 0.16, Level.cyan, 4)
            glowBox(s * p, 9.17, 0, 0.16, 0.06, 2 * p - 3, Level.cyan, 4)
        }
        let lampPos: [V3] = [V3(0, 0, p), V3(0, 0, -p), V3(p, 0, 0), V3(-p, 0, 0), V3(7, 0, 7), V3(-7, 0, -7), V3(7, 0, -7), V3(-7, 0, 7)]
        for (i, lp) in lampPos.enumerated() {
            let big = i < 4
            let y: Float = big ? 9.2 : 9.0
            if !big {
                // diagonal struts from the core cap out to the pillars carry the inner lamps
                let strut = Geo.part(root, Geo.box(0.35, 0.35, 15.5), Mat.metal(V3(0.12, 0.13, 0.15), rough: 0.4), V3(lp.x, 9.4, lp.z))
                strut.simdEulerAngles = V3(0, atan2(lp.x, lp.z), 0)
                strut.castsShadow = false
            }
            Geo.part(root, Geo.cyl(big ? 0.9 : 0.6, 0.35), Mat.metal(V3(0.1, 0.1, 0.12), rough: 0.4), V3(lp.x, y - 0.2, lp.z), shadow: false)
            Geo.part(root, Geo.cyl(big ? 0.7 : 0.45, 0.06), Mat.glow(V3(0.85, 0.95, 1.0), 6), V3(lp.x, y - 0.4, lp.z), shadow: false)
            // fake volumetric shaft
            let hgt = y - 0.4
            let cone = Geo.cone(big ? 0.7 : 0.45, big ? 4.2 : 3.0, hgt, segments: 32)
            let sm = Mat.additive(Tex.shaft, V3(0.55, 0.8, 1.0), big ? 0.10 : 0.075)
            cone.materials = [sm]
            let cn = SCNNode(geometry: cone)
            cn.simdPosition = V3(lp.x, hgt / 2, lp.z)
            cn.castsShadow = false
            cn.renderingOrder = 20
            root.addChildNode(cn)
            pool(lp.x, lp.z, big ? 11 : 8, V3(0.6, 0.85, 1.0), big ? 0.38 : 0.3)
        }
    }

    private func buildPlatforms() {
        for s in [Float(1), -1] {
            let cx = 20 * s, cz = -20 * s
            box(cx, cz, 9, 9, 0, 1.6, "tech", Tex.tech, tile: 3, chamfer: 0.04)
            // stairs toward the arena centre on two sides
            for i in 0..<3 {
                let top = 1.2 - 0.4 * Float(i)
                let off = 4.5 + 0.5 + Float(i)
                box(cx - s * off, cz, 1.0, 3.4, 0, top, "cg", Tex.crateGrey, tile: 1.7)
                box(cx, cz + s * off, 3.4, 1.0, 0, top, "cg", Tex.crateGrey, tile: 1.7)
            }
            // railings on the outer edges
            box(cx + s * 4.3, cz, 0.35, 9, 1.6, 2.6, "cg", Tex.crateGrey, tile: 1.5)
            box(cx, cz - s * 4.3, 9, 0.35, 1.6, 2.6, "cg", Tex.crateGrey, tile: 1.5)
            glowBox(cx + s * 4.3, 2.63, cz, 0.12, 0.05, 8.6, Level.orange, 4)
            glowBox(cx, 2.63, cz - s * 4.3, 8.6, 0.05, 0.12, Level.orange, 4)
            glowBox(cx - s * 4.52, 1.5, cz, 0.04, 0.08, 8.8, Level.cyan, 4)
            glowBox(cx, 1.5, cz + s * 4.52, 8.8, 0.08, 0.04, Level.cyan, 4)
            // holo beacon
            let holder = SCNNode()
            holder.simdPosition = V3(cx + s * 2.2, 1.6, cz - s * 2.2)
            root.addChildNode(holder)
            Geo.part(holder, Geo.cyl(0.6, 0.25), Mat.metal(V3(0.15, 0.16, 0.18)), V3(0, 0.12, 0))
            Geo.part(holder, Geo.cyl(0.45, 0.04), Mat.glow(Level.cyan, 5), V3(0, 0.26, 0), shadow: false)
            let holo = SCNNode()
            holo.simdPosition = V3(0, 1.9, 0)
            holder.addChildNode(holo)
            let hm = Mat.additive(Tex.scan, Level.cyan, 0.9)
            let globe = Geo.sphere(0.75, segments: 16)
            globe.materials = [hm]
            let gn = SCNNode(geometry: globe); gn.castsShadow = false
            holo.addChildNode(gn)
            let hr = Geo.torus(1.1, 0.02); hr.materials = [Mat.additive(nil, Level.cyan, 1.5)]
            let hrn = SCNNode(geometry: hr); hrn.simdEulerAngles = V3(0.5, 0, 0.2); hrn.castsShadow = false
            holo.addChildNode(hrn)
            holo.runAction(.repeatForever(.rotateBy(x: 0, y: 2 * .pi, z: 0, duration: 7)))
            let shaft = Geo.cone(0.9, 0.42, 1.6, segments: 24)
            shaft.materials = [Mat.additive(Tex.shaft, Level.cyan, 0.25)]
            let sn = SCNNode(geometry: shaft); sn.simdPosition = V3(0, 1.08, 0); sn.simdEulerAngles = V3(.pi, 0, 0); sn.castsShadow = false
            holder.addChildNode(sn)
        }
    }

    private func buildCover() {
        // shipping containers (some stacked)
        let cw: Float = 2.6, cl: Float = 5.2, ch: Float = 2.6
        func container(_ x: Float, _ z: Float, alongX: Bool, _ y0: Float, _ name: String, _ set: TextureSet) {
            box(x, z, alongX ? cl : cw, alongX ? cw : cl, y0, y0 + ch, name, set, tile: 2.6, chamfer: 0.03)
        }
        container(-24, -5, alongX: false, 0, "co", Tex.crateOrange)
        container(-24, -5.6, alongX: false, ch, "ct", Tex.crateTeal)
        container(-21.2, -4.2, alongX: false, 0, "ct", Tex.crateTeal)
        container(24, 5, alongX: false, 0, "ct", Tex.crateTeal)
        container(24, 5.6, alongX: false, ch, "co", Tex.crateOrange)
        container(21.2, 4.2, alongX: false, 0, "cg", Tex.crateGrey)
        container(-5, 24, alongX: true, 0, "co", Tex.crateOrange)
        container(-4.2, 21.2, alongX: true, 0, "cg", Tex.crateGrey)
        container(-5.6, 24, alongX: true, ch, "cg", Tex.crateGrey)
        container(5, -24, alongX: true, 0, "ct", Tex.crateTeal)
        container(4.2, -21.2, alongX: true, 0, "co", Tex.crateOrange)
        container(5.6, -24, alongX: true, ch, "co", Tex.crateOrange)

        // crate clusters
        let cs: Float = 1.3
        func crate(_ x: Float, _ z: Float, _ level: Int, _ k: Int) {
            let sets: [(String, TextureSet)] = [("co", Tex.crateOrange), ("ct", Tex.crateTeal), ("cg", Tex.crateGrey)]
            let (nm, st) = sets[k % 3]
            box(x, z, cs, cs, Float(level) * cs, Float(level + 1) * cs, nm, st, tile: cs, chamfer: 0.03)
        }
        for s in [Float(1), -1] {
            crate(7.6 * s, 7.6 * s, 0, 0); crate(9.0 * s, 7.6 * s, 0, 2); crate(7.6 * s, 9.0 * s, 0, 1); crate(7.7 * s, 7.7 * s, 1, 2)
            crate(-8.2 * s, 8.6 * s, 0, 1); crate(-9.6 * s, 8.4 * s, 0, 0)
            crate(27 * s, -14 * s, 0, 2); crate(27 * s, -12.6 * s, 0, 0); crate(27 * s, -13.3 * s, 1, 1); crate(28.4 * s, -13.2 * s, 0, 1)
            crate(-14 * s, -27 * s, 0, 1); crate(-12.6 * s, -27.2 * s, 0, 2)
            crate(3.5 * s, -14.5 * s, 0, 0); crate(-17 * s, 3 * s, 0, 2); crate(-17.2 * s, 4.4 * s, 0, 1)
        }

        // low barricades with light strip
        func barrier(_ x: Float, _ z: Float, alongX: Bool) {
            let w: Float = alongX ? 3.4 : 0.55, d: Float = alongX ? 0.55 : 3.4
            box(x, z, w, d, 0, 1.15, "cg", Tex.crateGrey, tile: 1.7, tileV: 1.15, chamfer: 0.05)
            glowBox(x, 1.17, z, alongX ? 3.0 : 0.1, 0.04, alongX ? 0.1 : 3.0, Level.cyan, 4)
        }
        barrier(0, 10.5, alongX: true); barrier(0, -10.5, alongX: true)
        barrier(10.5, 0, alongX: false); barrier(-10.5, 0, alongX: false)
        barrier(-19, -11, alongX: true); barrier(19, 11, alongX: true)
        barrier(11, -19, alongX: false); barrier(-11, 19, alongX: false)
        barrier(0, 24, alongX: true); barrier(0, -24, alongX: true)
        barrier(24, -1.5, alongX: false); barrier(-24, 1.5, alongX: false)
    }

    private func buildGenerators() {
        for (s, c) in [(Float(-1), Level.magenta), (Float(1), Level.orange)] {
            let x = 22.5 * s, z = 22.5 * s
            box(x, z, 4.6, 4.6, 0, 3.4, "tech", Tex.tech, tile: 2.3, chamfer: 0.08, emission: 3)
            box(x, z, 3.2, 3.2, 3.4, 4.3, "tech", Tex.tech, tile: 1.6, collide: false, chamfer: 0.08)
            Geo.part(root, Geo.cyl(0.9, 1.6), Mat.metal(V3(0.2, 0.21, 0.23), rough: 0.3), V3(x, 5.1, z))
            Geo.part(root, Geo.cyl(0.93, 0.12), Mat.glow(c, 5), V3(x, 5.3, z), shadow: false)
            Geo.part(root, Geo.cyl(0.93, 0.12), Mat.glow(c, 5), V3(x, 4.7, z), shadow: false)
            glowBox(x - s * 2.33, 1.7, z, 0.05, 2.2, 0.25, c, 5)
            glowBox(x, 1.7, z - s * 2.33, 0.25, 2.2, 0.05, c, 5)
            // tanks
            let tankMat = Mat.metal(V3(0.42, 0.44, 0.47), rough: 0.22)
            for (dx, dz) in [(Float(-3.6), Float(0.6)), (0.6, -3.6)] {
                let tx = x + dx * s, tz = z + dz * s
                Geo.part(root, Geo.capsule(0.95, 4.0), tankMat, V3(tx, 2.0, tz))
                Geo.part(root, Geo.torus(0.97, 0.06), Mat.glow(c, 4), V3(tx, 2.6, tz), shadow: false)
                obstacles.append(Obstacle(minX: tx - 0.9, maxX: tx + 0.9, minZ: tz - 0.9, maxZ: tz + 0.9, y0: 0, y1: 4))
                let pipe = Geo.part(root, Geo.cyl(0.14, 2.6, segments: 12), Mat.metal(V3(0.3, 0.3, 0.32), rough: 0.3), V3((tx + x) / 2, 3.0, (tz + z) / 2))
                pipe.simdEulerAngles = abs(dx) > abs(dz) ? V3(0, 0, .pi / 2) : V3(.pi / 2, 0, 0)
            }
            pool(x - s * 3.2, z - s * 3.2, 16, c, 0.45)
            let g = Geo.glowSprite(7, c, 0.45)
            g.simdPosition = V3(x, 5.0, z)
            root.addChildNode(g)
        }
    }

    private func buildSkyline() {
        // distant station towers peeking over the walls
        var k: Int32 = 0
        for side in 0..<4 {
            for i in 0..<5 {
                k += 1
                let a = hashI(k, 1, 91), b = hashI(k, 2, 91), c = hashI(k, 3, 91)
                let along = -40 + Float(i) * 20 + (a - 0.5) * 8
                let out = 46 + b * 16
                let w = 7 + a * 7, h = 16 + c * 30
                let (x, z): (Float, Float) = side == 0 ? (along, -out) : side == 1 ? (along, out) : side == 2 ? (-out, along) : (out, along)
                box(x, z, w, w, 0, h, "wall", Tex.wallCyan, tile: 8, collide: false, emission: 2.5)
                let lc = (k % 3 == 0) ? Level.magenta : (k % 3 == 1 ? Level.cyan : Level.orange)
                glowBox(x, h + 0.2, z, w * 0.9, 0.25, w * 0.9, lc, 2.5)
                if c > 0.5 {
                    Geo.part(root, Geo.cyl(0.12, 9, segments: 8), Mat.metal(V3(0.1, 0.1, 0.12), rough: 0.5, plating: 0), V3(x, h + 4.5, z), shadow: false)
                    let blink = Geo.glowSprite(2.5, Level.red, 1.2)
                    blink.simdPosition = V3(x, h + 9, z)
                    blink.runAction(.repeatForever(.sequence([.fadeOpacity(to: 0.1, duration: 0.9), .fadeOpacity(to: 1, duration: 0.2), .wait(duration: Double(0.3 + a))])))
                    root.addChildNode(blink)
                }
            }
        }
    }

    private func buildFloorStrips() {
        let y: Float = 0.012
        // guide lines from the core to the gates
        for s in [Float(-1), 1] {
            glowBox(0, y, s * 17.6, 0.14, 0.02, 21.5, Level.cyan, 2.6)
            glowBox(s * 17.6, y, 0, 21.5, 0.02, 0.14, Level.cyan, 2.6)
            glowBox(-0.9, y, s * 30.2, 0.08, 0.02, 3.2, Level.red, 3)
            glowBox(0.9, y, s * 30.2, 0.08, 0.02, 3.2, Level.red, 3)
            glowBox(s * 30.2, y, -0.9, 3.2, 0.02, 0.08, Level.red, 3)
            glowBox(s * 30.2, y, 0.9, 3.2, 0.02, 0.08, Level.red, 3)
        }
        // square ring around the core
        let r: Float = 5.2
        for s in [Float(-1), 1] {
            glowBox(0, y, s * r, 2 * r, 0.02, 0.1, Level.cyan, 2.6)
            glowBox(s * r, y, 0, 0.1, 0.02, 2 * r, Level.cyan, 2.6)
        }
        // perimeter line along the walls
        let pr = Level.half - 0.35
        for s in [Float(-1), 1] {
            glowBox(0, y, s * pr, 2 * pr, 0.02, 0.07, Level.orange, 2.2)
            glowBox(s * pr, y, 0, 0.07, 0.02, 2 * pr, Level.orange, 2.2)
        }
    }

    private func buildAtmosphere() {
        // drifting dust motes
        let dust = SCNParticleSystem()
        dust.particleImage = Tex.softDot
        dust.birthRate = 160
        dust.particleLifeSpan = 9
        dust.particleLifeSpanVariation = 3
        dust.emitterShape = Geo.box(62, 9, 62)
        dust.birthLocation = .volume
        dust.particleSize = 0.035
        dust.particleSizeVariation = 0.025
        dust.particleVelocity = 0.25
        dust.particleVelocityVariation = 0.2
        dust.spreadingAngle = 180
        dust.particleColor = color(0.6, 0.85, 1.0, 0.55)
        dust.blendMode = .additive
        dust.isLightingEnabled = false
        dust.warmupDuration = 9
        let fade = CAKeyframeAnimation()
        fade.values = [0, 1, 1, 0]; fade.keyTimes = [0, 0.15, 0.8, 1]
        dust.propertyControllers = [.opacity: SCNParticlePropertyController(animation: fade)]
        let dn = SCNNode(); dn.simdPosition = V3(0, 4.6, 0)
        dn.addParticleSystem(dust)
        root.addChildNode(dn)

        // sparks rising from the core
        let em = SCNParticleSystem()
        em.particleImage = Tex.softDot
        em.birthRate = 26
        em.particleLifeSpan = 3.2
        em.particleLifeSpanVariation = 1
        em.emitterShape = Geo.cyl(1.2, 1)
        em.particleSize = 0.06
        em.particleSizeVariation = 0.04
        em.particleVelocity = 2.2
        em.particleVelocityVariation = 1
        em.emittingDirection = SCNVector3(0, 1, 0)
        em.spreadingAngle = 14
        em.particleColor = color(0.5, 0.95, 1.0, 1)
        em.blendMode = .additive
        em.isLightingEnabled = false
        em.propertyControllers = [.opacity: SCNParticlePropertyController(animation: fade)]
        let en = SCNNode(); en.simdPosition = V3(0, 1.2, 0)
        en.addParticleSystem(em)
        root.addChildNode(en)
    }

    // MARK: collision queries

    /// Push a vertical cylinder (feet at feetY) out of every obstacle it overlaps. Low obstacles can be stepped on.
    func resolve(_ p: inout V3, radius: Float, feetY: Float, height: Float, step: Float = 0.5) {
        for o in obstacles {
            if feetY + step >= o.y1 || feetY + height <= o.y0 { continue }
            let nx = clampf(p.x, o.minX, o.maxX), nz = clampf(p.z, o.minZ, o.maxZ)
            let dx = p.x - nx, dz = p.z - nz
            let d2 = dx * dx + dz * dz
            if d2 >= radius * radius { continue }
            if d2 > 1e-8 {
                let d = sqrt(d2)
                p.x = nx + dx / d * radius; p.z = nz + dz / d * radius
            } else {
                // centre is inside: leave through the nearest face
                let l = p.x - o.minX, r = o.maxX - p.x, b = p.z - o.minZ, f = o.maxZ - p.z
                let m = min(min(l, r), min(b, f))
                if m == l { p.x = o.minX - radius } else if m == r { p.x = o.maxX + radius }
                else if m == b { p.z = o.minZ - radius } else { p.z = o.maxZ + radius }
            }
        }
        let lim = bounds - radius
        p.x = clampf(p.x, -lim, lim); p.z = clampf(p.z, -lim, lim)
    }

    func groundHeight(_ x: Float, _ z: Float, radius: Float, feetY: Float, step: Float = 0.5) -> Float {
        var g: Float = 0
        for o in obstacles where o.y1 <= feetY + step && o.y1 > g {
            if x > o.minX - radius && x < o.maxX + radius && z > o.minZ - radius && z < o.maxZ + radius { g = o.y1 }
        }
        return g
    }

    /// Ray against floor and obstacles. Returns hit distance and surface normal.
    func raycast(_ o: V3, _ d: V3, _ maxT: Float) -> (t: Float, n: V3)? {
        var best = maxT
        var bn = V3(0, 1, 0)
        var hit = false
        if d.y < -1e-5 {
            let t = -o.y / d.y
            let hx = o.x + d.x * t, hz = o.z + d.z * t
            if t > 0 && t < best && abs(hx) <= floorExtent && abs(hz) <= floorExtent { best = t; bn = V3(0, 1, 0); hit = true }
        }
        let inv = V3(abs(d.x) > 1e-7 ? 1 / d.x : Float.greatestFiniteMagnitude,
                     abs(d.y) > 1e-7 ? 1 / d.y : Float.greatestFiniteMagnitude,
                     abs(d.z) > 1e-7 ? 1 / d.z : Float.greatestFiniteMagnitude)
        for b in obstacles {
            var t1 = (b.minX - o.x) * inv.x, t2 = (b.maxX - o.x) * inv.x
            var tmin = min(t1, t2), tmax = max(t1, t2)
            var axis = 0
            t1 = (b.y0 - o.y) * inv.y; t2 = (b.y1 - o.y) * inv.y
            let ymin = min(t1, t2), ymax = max(t1, t2)
            if ymin > tmin { tmin = ymin; axis = 1 }
            tmax = min(tmax, ymax)
            t1 = (b.minZ - o.z) * inv.z; t2 = (b.maxZ - o.z) * inv.z
            let zmin = min(t1, t2), zmax = max(t1, t2)
            if zmin > tmin { tmin = zmin; axis = 2 }
            tmax = min(tmax, zmax)
            if tmax < max(tmin, 0) || tmin <= 0 || tmin >= best { continue }
            best = tmin; hit = true
            bn = axis == 0 ? V3(d.x > 0 ? -1 : 1, 0, 0) : axis == 1 ? V3(0, d.y > 0 ? -1 : 1, 0) : V3(0, 0, d.z > 0 ? -1 : 1)
        }
        return hit ? (best, bn) : nil
    }

    func lineOfSight(_ a: V3, _ b: V3) -> Bool {
        let v = b - a
        let l = simd_length(v)
        if l < 1e-4 { return true }
        return raycast(a, v / l, l) == nil
    }
}
