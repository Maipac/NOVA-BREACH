import SceneKit
import AppKit

enum Mat {
    private static var cache: [String: SCNMaterial] = [:]
    private static let lock = NSLock()

    private static func setup(_ p: SCNMaterialProperty, _ contents: Any?, _ ru: Float, _ rv: Float) {
        p.contents = contents
        p.wrapS = .repeat; p.wrapT = .repeat
        p.mipFilter = .linear
        p.maxAnisotropy = 8
        p.contentsTransform = SCNMatrix4MakeScale(CGFloat(ru), CGFloat(rv), 1)
    }

    /// Textured PBR material, cached per (texture, repeat) pair.
    static func pbr(_ name: String, _ set: TextureSet, _ ru: Float = 1, _ rv: Float = 1, emission: Float = 2.2) -> SCNMaterial {
        let key = "\(name)|\(Int(ru * 100))|\(Int(rv * 100))|\(emission)"
        lock.lock(); defer { lock.unlock() }
        if let m = cache[key] { return m }
        let m = SCNMaterial()
        m.lightingModel = .physicallyBased
        setup(m.diffuse, set.albedo, ru, rv)
        setup(m.normal, set.normal, ru, rv)
        setup(m.roughness, set.roughness, ru, rv)
        setup(m.metalness, set.metalness, ru, rv)
        if let e = set.emission {
            setup(m.emission, e, ru, rv)
            m.emission.intensity = CGFloat(emission)
        }
        cache[key] = m
        return m
    }

    /// Flat coloured metal/paint with the shared plating normal map. Not cached (callers may mutate, e.g. hit flashes).
    static func metal(_ c: V3, rough: Float = 0.35, metal: Float = 1, plating: Float = 1) -> SCNMaterial {
        let m = SCNMaterial()
        m.lightingModel = .physicallyBased
        m.diffuse.contents = color(c)
        m.metalness.contents = NSNumber(value: metal)
        if plating > 0 {
            setup(m.normal, Tex.plating.normal, plating, plating)
            m.normal.intensity = 0.8
            setup(m.roughness, Tex.plating.roughness, plating, plating)
            m.roughness.intensity = CGFloat(rough / 0.42)
        } else {
            m.roughness.contents = NSNumber(value: rough)
        }
        m.emission.contents = NSColor.black
        return m
    }

    static func glow(_ c: V3, _ intensity: Float = 3) -> SCNMaterial {
        let m = SCNMaterial()
        m.lightingModel = .physicallyBased
        m.diffuse.contents = NSColor.black
        m.roughness.contents = NSNumber(value: 0.6)
        m.metalness.contents = NSNumber(value: 0.0)
        m.emission.contents = color(c)
        m.emission.intensity = CGFloat(intensity)
        return m
    }

    /// Unlit additive sprite/beam material.
    static func additive(_ image: CGImage?, _ c: V3, _ intensity: Float = 1, depthTest: Bool = true) -> SCNMaterial {
        let m = SCNMaterial()
        m.lightingModel = .constant
        m.diffuse.contents = image ?? NSColor.white
        m.multiply.contents = color(c)
        m.diffuse.intensity = CGFloat(intensity)
        m.blendMode = .add
        m.isDoubleSided = true
        m.writesToDepthBuffer = false
        m.readsFromDepthBuffer = depthTest
        return m
    }
}

/// Small helpers that take Float instead of CGFloat.
enum Geo {
    static func box(_ w: Float, _ h: Float, _ l: Float, chamfer: Float = 0) -> SCNBox {
        SCNBox(width: CGFloat(w), height: CGFloat(h), length: CGFloat(l), chamferRadius: CGFloat(chamfer))
    }
    static func sphere(_ r: Float, segments: Int = 24) -> SCNSphere {
        let s = SCNSphere(radius: CGFloat(r)); s.segmentCount = segments; return s
    }
    static func cyl(_ r: Float, _ h: Float, segments: Int = 24) -> SCNCylinder {
        let c = SCNCylinder(radius: CGFloat(r), height: CGFloat(h)); c.radialSegmentCount = segments; return c
    }
    static func capsule(_ r: Float, _ h: Float) -> SCNCapsule {
        let c = SCNCapsule(capRadius: CGFloat(r), height: CGFloat(h)); c.radialSegmentCount = 16; c.capSegmentCount = 8; return c
    }
    static func cone(_ top: Float, _ bottom: Float, _ h: Float, segments: Int = 24) -> SCNCone {
        let c = SCNCone(topRadius: CGFloat(top), bottomRadius: CGFloat(bottom), height: CGFloat(h)); c.radialSegmentCount = segments; return c
    }
    static func torus(_ ring: Float, _ pipe: Float) -> SCNTorus {
        let t = SCNTorus(ringRadius: CGFloat(ring), pipeRadius: CGFloat(pipe)); t.ringSegmentCount = 48; t.pipeSegmentCount = 12; return t
    }
    static func plane(_ w: Float, _ h: Float) -> SCNPlane { SCNPlane(width: CGFloat(w), height: CGFloat(h)) }
    static func pyramid(_ w: Float, _ h: Float, _ l: Float) -> SCNPyramid {
        SCNPyramid(width: CGFloat(w), height: CGFloat(h), length: CGFloat(l))
    }

    /// Node helper: geometry + material(s) + position (+ euler rotation) attached to a parent.
    @discardableResult
    static func part(_ parent: SCNNode, _ g: SCNGeometry, _ m: SCNMaterial, _ pos: V3, rot: V3 = V3(0, 0, 0), shadow: Bool = true) -> SCNNode {
        g.materials = [m]
        let n = SCNNode(geometry: g)
        n.simdPosition = pos
        if rot != V3(0, 0, 0) { n.simdEulerAngles = rot }
        n.castsShadow = shadow
        parent.addChildNode(n)
        return n
    }

    /// Camera-facing additive glow sprite.
    static func glowSprite(_ size: Float, _ c: V3, _ intensity: Float = 1, image: CGImage? = nil) -> SCNNode {
        let p = plane(size, size)
        p.materials = [Mat.additive(image ?? Tex.glow, c, intensity)]
        let n = SCNNode(geometry: p)
        n.constraints = [SCNBillboardConstraint()]
        n.castsShadow = false
        return n
    }
}
