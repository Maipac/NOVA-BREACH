import Foundation
import simd
import SceneKit

typealias V3 = SIMD3<Float>
typealias V2 = SIMD2<Float>

@inline(__always) func clampf(_ x: Float, _ a: Float, _ b: Float) -> Float { min(max(x, a), b) }
@inline(__always) func mixf(_ a: Float, _ b: Float, _ t: Float) -> Float { a + (b - a) * t }
@inline(__always) func mix3(_ a: V3, _ b: V3, _ t: Float) -> V3 { a + (b - a) * t }
@inline(__always) func sstep(_ e0: Float, _ e1: Float, _ x: Float) -> Float {
    let t = clampf((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)
}
@inline(__always) func fract(_ x: Float) -> Float { x - floor(x) }
@inline(__always) func frand(_ a: Float = 0, _ b: Float = 1) -> Float { Float.random(in: a...b) }
@inline(__always) func approach(_ cur: Float, _ target: Float, _ d: Float) -> Float {
    cur < target ? min(cur + d, target) : max(cur - d, target)
}
func wrapAngle(_ a: Float) -> Float {
    var x = a
    while x > .pi { x -= 2 * .pi }
    while x < -.pi { x += 2 * .pi }
    return x
}
@inline(__always) func len2(_ v: V3) -> Float { simd_length(V2(v.x, v.z)) }
func safeNorm(_ v: V3, _ fallback: V3 = V3(0, 0, -1)) -> V3 {
    let l = simd_length(v)
    return l > 1e-5 ? v / l : fallback
}
func randUnit() -> V3 {
    while true {
        let v = V3(frand(-1, 1), frand(-1, 1), frand(-1, 1))
        let l = simd_length(v)
        if l > 0.05 && l <= 1 { return v / l }
    }
}

// MARK: hashing / noise (deterministic, used by procedural textures)

@inline(__always) func hashI(_ x: Int32, _ y: Int32, _ s: Int32 = 0) -> Float {
    var h = UInt32(bitPattern: x) &* 374761393 &+ UInt32(bitPattern: y) &* 668265263 &+ UInt32(bitPattern: s) &* 2246822519
    h = (h ^ (h >> 13)) &* 1274126177
    h ^= h >> 16
    return Float(h & 0xFFFFFF) / Float(0x1000000)
}
@inline(__always) func hash3I(_ x: Int32, _ y: Int32, _ z: Int32, _ s: Int32 = 0) -> Float {
    var h = UInt32(bitPattern: x) &* 374761393 &+ UInt32(bitPattern: y) &* 668265263
    h = h &+ UInt32(bitPattern: z) &* 1440662683 &+ UInt32(bitPattern: s) &* 2246822519
    h = (h ^ (h >> 13)) &* 1274126177
    h ^= h >> 16
    return Float(h & 0xFFFFFF) / Float(0x1000000)
}
@inline(__always) func pmod(_ a: Int32, _ n: Int32) -> Int32 { let r = a % n; return r < 0 ? r + n : r }

/// Tileable 2D value noise. `period` is the lattice period in noise units.
func vnoise(_ x: Float, _ y: Float, _ period: Int32, _ seed: Int32) -> Float {
    let xf = floor(x), yf = floor(y)
    let xi = Int32(xf), yi = Int32(yf)
    var fx = x - xf, fy = y - yf
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
    let x0 = pmod(xi, period), x1 = pmod(xi + 1, period)
    let y0 = pmod(yi, period), y1 = pmod(yi + 1, period)
    let a = hashI(x0, y0, seed), b = hashI(x1, y0, seed)
    let c = hashI(x0, y1, seed), d = hashI(x1, y1, seed)
    return mixf(mixf(a, b, fx), mixf(c, d, fx), fy)
}
/// Tileable fbm over the unit square: u,v in 0..1, `freq` lattice cells across.
func fbm(_ u: Float, _ v: Float, _ freq: Int32, _ octaves: Int, _ seed: Int32) -> Float {
    var sum: Float = 0, amp: Float = 0.5, f = freq, norm: Float = 0
    for o in 0..<octaves {
        sum += amp * vnoise(u * Float(f), v * Float(f), f, seed &+ Int32(o) &* 17)
        norm += amp; amp *= 0.5; f *= 2
    }
    return sum / norm
}
func vnoise3(_ p: V3, _ seed: Int32) -> Float {
    let pf = V3(floor(p.x), floor(p.y), floor(p.z))
    let xi = Int32(pf.x), yi = Int32(pf.y), zi = Int32(pf.z)
    var f = p - pf
    f = f * f * (V3(repeating: 3) - 2 * f)
    func h(_ a: Int32, _ b: Int32, _ c: Int32) -> Float { hash3I(xi + a, yi + b, zi + c, seed) }
    let x00 = mixf(h(0, 0, 0), h(1, 0, 0), f.x), x10 = mixf(h(0, 1, 0), h(1, 1, 0), f.x)
    let x01 = mixf(h(0, 0, 1), h(1, 0, 1), f.x), x11 = mixf(h(0, 1, 1), h(1, 1, 1), f.x)
    return mixf(mixf(x00, x10, f.y), mixf(x01, x11, f.y), f.z)
}
func fbm3(_ p: V3, _ octaves: Int, _ seed: Int32) -> Float {
    var sum: Float = 0, amp: Float = 0.5, q = p, norm: Float = 0
    for o in 0..<octaves {
        sum += amp * vnoise3(q, seed &+ Int32(o) &* 31)
        norm += amp; amp *= 0.5; q = q * 2.03 + V3(11.3, 7.7, 3.1)
    }
    return sum / norm
}

// MARK: SceneKit conveniences

func color(_ r: Float, _ g: Float, _ b: Float, _ a: Float = 1) -> NSColor {
    NSColor(srgbRed: CGFloat(r), green: CGFloat(g), blue: CGFloat(b), alpha: CGFloat(a))
}
func color(_ v: V3, _ a: Float = 1) -> NSColor { color(v.x, v.y, v.z, a) }

extension SCNNode {
    @discardableResult
    func add(_ child: SCNNode) -> SCNNode { addChildNode(child); return child }
}
