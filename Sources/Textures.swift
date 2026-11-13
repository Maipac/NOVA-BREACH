import Foundation
import CoreGraphics
import AppKit
import simd

// Everything visual in the game is generated procedurally at startup – no asset files.

struct Texel {
    var h: Float = 0.5
    var col = V3(0.5, 0.5, 0.5)
    var rough: Float = 0.5
    var metal: Float = 1
    var emit = V3(0, 0, 0)
}

struct TextureSet {
    let albedo: CGImage
    let normal: CGImage
    let roughness: CGImage
    let metalness: CGImage
    let emission: CGImage?
}

func rgbaImage(_ w: Int, _ h: Int, _ px: [UInt8], linear: Bool = false, alpha: Bool = false) -> CGImage {
    let cs = CGColorSpace(name: linear ? CGColorSpace.linearSRGB : CGColorSpace.sRGB)!
    let provider = CGDataProvider(data: Data(px) as CFData)!
    let info = alpha ? CGImageAlphaInfo.premultipliedLast : CGImageAlphaInfo.noneSkipLast
    return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4,
                   space: cs, bitmapInfo: CGBitmapInfo(rawValue: info.rawValue), provider: provider,
                   decode: nil, shouldInterpolate: true, intent: .defaultIntent)!
}

func grayImage(_ w: Int, _ h: Int, _ px: [UInt8]) -> CGImage {
    let cs = CGColorSpace(name: CGColorSpace.linearGray)!
    let provider = CGDataProvider(data: Data(px) as CFData)!
    return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: w,
                   space: cs, bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue), provider: provider,
                   decode: nil, shouldInterpolate: true, intent: .defaultIntent)!
}

@inline(__always) private func b8(_ x: Float) -> UInt8 { UInt8(clampf(x, 0, 1) * 255 + 0.5) }

/// Runs `f` for every pixel in parallel and returns an RGBA image. f returns (r,g,b,a) straight (not premultiplied).
func proceduralImage(_ w: Int, _ h: Int, alpha: Bool = false, _ f: @escaping (Float, Float) -> SIMD4<Float>) -> CGImage {
    var px = [UInt8](repeating: 255, count: w * h * 4)
    px.withUnsafeMutableBufferPointer { buf in
        let p = buf.baseAddress!
        DispatchQueue.concurrentPerform(iterations: h) { y in
            for x in 0..<w {
                let c = f((Float(x) + 0.5) / Float(w), (Float(y) + 0.5) / Float(h))
                let i = (y * w + x) * 4
                let a = alpha ? clampf(c.w, 0, 1) : 1
                p[i] = b8(c.x * a); p[i + 1] = b8(c.y * a); p[i + 2] = b8(c.z * a); p[i + 3] = b8(a)
            }
        }
    }
    return rgbaImage(w, h, px, alpha: alpha)
}

func buildTextureSet(size n: Int, bump: Float, emission: Bool, _ f: @escaping (Float, Float) -> Texel) -> TextureSet {
    var texels = [Texel](repeating: Texel(), count: n * n)
    texels.withUnsafeMutableBufferPointer { buf in
        let p = buf.baseAddress!
        DispatchQueue.concurrentPerform(iterations: n) { y in
            for x in 0..<n { p[y * n + x] = f((Float(x) + 0.5) / Float(n), (Float(y) + 0.5) / Float(n)) }
        }
    }
    var alb = [UInt8](repeating: 255, count: n * n * 4)
    var nrm = [UInt8](repeating: 255, count: n * n * 4)
    var rgh = [UInt8](repeating: 0, count: n * n)
    var met = [UInt8](repeating: 0, count: n * n)
    var emi = [UInt8](repeating: 255, count: emission ? n * n * 4 : 0)
    texels.withUnsafeBufferPointer { t in
        alb.withUnsafeMutableBufferPointer { albP in
        nrm.withUnsafeMutableBufferPointer { nrmP in
        rgh.withUnsafeMutableBufferPointer { rghP in
        met.withUnsafeMutableBufferPointer { metP in
        emi.withUnsafeMutableBufferPointer { emiP in
            let tp = t.baseAddress!, a = albP.baseAddress!, nn = nrmP.baseAddress!
            let r = rghP.baseAddress!, m = metP.baseAddress!
            let e: UnsafeMutablePointer<UInt8>? = emission ? emiP.baseAddress : nil
            DispatchQueue.concurrentPerform(iterations: n) { y in
                let ym = (y + n - 1) % n, yp = (y + 1) % n
                let ym3 = (y + n - 3) % n, yp3 = (y + 3) % n
                for x in 0..<n {
                    let xm = (x + n - 1) % n, xp = (x + 1) % n
                    let xm3 = (x + n - 3) % n, xp3 = (x + 3) % n
                    let i = y * n + x
                    let tx = tp[i]
                    let dx = (tp[y * n + xp].h - tp[y * n + xm].h) * bump
                    let dy = (tp[yp * n + x].h - tp[ym * n + x].h) * bump
                    let nv = simd_normalize(V3(-dx, dy, 1))
                    nn[i * 4] = b8(nv.x * 0.5 + 0.5); nn[i * 4 + 1] = b8(nv.y * 0.5 + 0.5); nn[i * 4 + 2] = b8(nv.z * 0.5 + 0.5)
                    // cheap cavity occlusion baked into albedo
                    let avg = (tp[y * n + xp3].h + tp[y * n + xm3].h + tp[yp3 * n + x].h + tp[ym3 * n + x].h) * 0.25
                    let ao = clampf(1 - (avg - tx.h) * 2.2, 0.45, 1.08)
                    let c = tx.col * ao
                    a[i * 4] = b8(c.x); a[i * 4 + 1] = b8(c.y); a[i * 4 + 2] = b8(c.z)
                    r[i] = b8(tx.rough); m[i] = b8(tx.metal)
                    if let e = e { e[i * 4] = b8(tx.emit.x); e[i * 4 + 1] = b8(tx.emit.y); e[i * 4 + 2] = b8(tx.emit.z) }
                }
            }
        }}}}}
    }
    return TextureSet(albedo: rgbaImage(n, n, alb), normal: rgbaImage(n, n, nrm, linear: true),
                      roughness: grayImage(n, n, rgh), metalness: grayImage(n, n, met),
                      emission: emission ? rgbaImage(n, n, emi) : nil)
}

enum Tex {
    // Directions shared between the sky painting and the scene lighting.
    static let sunDir = simd_normalize(V3(0.48, 0.66, 0.42))
    static let planetDir = simd_normalize(V3(-0.50, 0.50, -0.70))

    static let floor = buildTextureSet(size: 1024, bump: 5, emission: false, floorTexel)
    static let wallCyan = buildTextureSet(size: 1024, bump: 5, emission: true) { wallTexel($0, $1, V3(0.25, 0.9, 1.0)) }
    static let pillar = buildTextureSet(size: 512, bump: 5, emission: true) { pillarTexel($0, $1, V3(0.25, 0.9, 1.0)) }
    static let crateOrange = buildTextureSet(size: 512, bump: 5, emission: false) { crateTexel($0, $1, V3(0.55, 0.25, 0.08)) }
    static let crateTeal = buildTextureSet(size: 512, bump: 5, emission: false) { crateTexel($0, $1, V3(0.09, 0.29, 0.32)) }
    static let crateGrey = buildTextureSet(size: 512, bump: 5, emission: false) { crateTexel($0, $1, V3(0.32, 0.34, 0.37)) }
    static let plating = buildTextureSet(size: 512, bump: 4, emission: false, platingTexel)
    static let tech = buildTextureSet(size: 512, bump: 5, emission: true, techTexel)
    static let deck = buildTextureSet(size: 1024, bump: 4, emission: false, deckTexel)

    /// landing pad marking (additive decal): outer ring, dashed inner ring, centre cross, corner ticks
    static let padMark = proceduralImage(512, 512) { u, v in
        let p = V2(u - 0.5, v - 0.5) * 2
        let r = simd_length(p)
        let a = atan2(p.y, p.x)
        var i: Float = exp(-pow((r - 0.86) / 0.022, 2)) + 0.6 * exp(-pow((r - 0.80) / 0.008, 2))
        let dash: Float = fract(a / (2 * .pi) * 24) < 0.55 ? 1 : 0
        i += exp(-pow((r - 0.6) / 0.016, 2)) * dash * 0.8
        let cross: Float = (abs(p.x) < 0.025 && abs(p.y) < 0.28) || (abs(p.y) < 0.025 && abs(p.x) < 0.28) ? 1 : 0
        i += cross * 0.9
        // chevrons pointing at the centre on the four axes
        for k in 0..<4 {
            let ang = Float(k) * .pi / 2
            let dir = V2(cos(ang), sin(ang)), side = V2(-dir.y, dir.x)
            let along = simd_dot(p, dir), across = abs(simd_dot(p, side))
            let shape = along - 0.66 - across * 0.9
            if along > 0.62 && along < 0.78 && across < 0.12 && abs(shape) < 0.03 { i += 1 }
        }
        let c = min(i, 1.2)
        return SIMD4(c, c, c, 1)
    }

    static let glow = proceduralImage(128, 128) { u, v in
        let r = simd_length(V2(u - 0.5, v - 0.5)) * 2
        let i = pow(max(1 - r, 0), 2.2)
        return SIMD4(i, i, i, 1)
    }
    static let softDot = proceduralImage(64, 64, alpha: true) { u, v in
        let r = simd_length(V2(u - 0.5, v - 0.5)) * 2
        return SIMD4(1, 1, 1, pow(max(1 - r, 0), 1.6))
    }
    static let ring = proceduralImage(256, 256) { u, v in
        let r = simd_length(V2(u - 0.5, v - 0.5)) * 2
        let d = (r - 0.82) / 0.07
        let i = exp(-d * d) + 0.25 * pow(max(1 - r / 0.82, 0), 0.5) * (r < 0.82 ? 1 : 0)
        return SIMD4(i, i, i, 1)
    }
    static let flare = proceduralImage(256, 256) { u, v in
        let p = V2(u - 0.5, v - 0.5) * 2
        let r = simd_length(p)
        let a = atan2(p.y, p.x)
        let spikes = pow(abs(cos(a * 2.5 + 0.4)), 10) * 0.9 + pow(abs(cos(a * 4 + 1.3)), 24) * 0.5
        let core = pow(max(1 - r * 2.2, 0), 2)
        let i = core * 1.4 + spikes * pow(max(1 - r, 0), 2.5)
        return SIMD4(i, i, i, 1)
    }
    static let smoke = proceduralImage(128, 128, alpha: true) { u, v in
        let r = simd_length(V2(u - 0.5, v - 0.5)) * 2
        let n = fbm(u, v, 4, 4, 91)
        let a = pow(max(1 - r, 0), 1.3) * sstep(0.25, 0.75, n + 0.3 * (1 - r))
        return SIMD4(1, 1, 1, a * 0.9)
    }
    /// vertical falloff for fake volumetric light shafts (bright at v=0)
    static let shaft = proceduralImage(64, 256) { u, v in
        let side = sin(u * .pi)
        let i = pow(1 - v, 1.8) * (0.35 + 0.65 * side)
        return SIMD4(i, i, i, 1)
    }
    static let hex = proceduralImage(512, 512) { u, v in
        let p = V2(u * 6, v * 6 * 1.1547)
        let d = hexEdge(p)
        let line = sstep(0.07, 0.0, d)
        let id = fbm(u, v, 6, 2, 4)
        let i = line + 0.12 * id
        return SIMD4(i, i, i, 1)
    }
    static let scan = proceduralImage(8, 256) { _, v in
        let l = 0.55 + 0.45 * sin(v * 256 * 0.8)
        return SIMD4(l, l, l, 1)
    }

    static let sky = makeSky(4096, 2048)
    static let env = makeEnv(512, 256)

    static func preload() {
        let jobs: [() -> Void] = [
            { _ = floor }, { _ = wallCyan }, { _ = pillar }, { _ = crateOrange }, { _ = crateTeal }, { _ = crateGrey },
            { _ = plating }, { _ = tech }, { _ = deck }, { _ = padMark }, { _ = sky }, { _ = env },
            { _ = glow; _ = softDot; _ = ring; _ = flare; _ = smoke; _ = shaft; _ = hex; _ = scan },
        ]
        DispatchQueue.concurrentPerform(iterations: jobs.count) { jobs[$0]() }
    }

    // MARK: surface generators

    static func hexEdge(_ p: V2) -> Float {
        let r = V2(1, 1.7320508), h = r * 0.5
        func md(_ a: V2) -> V2 { V2(a.x - r.x * Foundation.floor(a.x / r.x), a.y - r.y * Foundation.floor(a.y / r.y)) }
        let a = md(p) - h, b = md(p - h) - h
        let g = simd_dot(a, a) < simd_dot(b, b) ? a : b
        return 0.5 - max(abs(g.x), abs(g.x) * 0.5 + abs(g.y) * 0.8660254)
    }

    static func floorTexel(_ u: Float, _ v: Float) -> Texel {
        var t = Texel()
        let gu = u * 2, gv = v * 2
        let cx = Foundation.floor(gu), cy = Foundation.floor(gv)
        let fu = gu - cx, fv = gv - cy
        let ex = min(fu, 1 - fu), ey = min(fv, 1 - fv)
        let edge = min(ex, ey)
        let seam = sstep(0.004, 0.016, edge)
        let id = hashI(Int32(cx), Int32(cy), 7)
        let inset = sstep(0.10, 0.108, edge)
        var h: Float = 0.25 + 0.55 * seam
        let n1 = fbm(u, v, 6, 5, 3)
        let n2 = fbm(u, v, 48, 3, 9)
        var col = V3(0.135, 0.15, 0.18) * (0.7 + 0.6 * n1)
        var rough = 0.22 + 0.40 * n1 + 0.12 * n2
        if id < 0.5 {
            let s: Float = 14
            let a = abs(fract(fu * s) - 0.5), b = abs(fract(fv * s) - 0.5)
            let alt = (Int(Foundation.floor(fu * s)) + Int(Foundation.floor(fv * s))) & 1
            let d = alt == 0 ? a * 3 + b : a + b * 3
            let bump = sstep(0.42, 0.3, d) * inset
            h += 0.10 * bump
            rough += 0.08 * bump
            col *= 0.9
        } else {
            h += 0.05 * inset
            let sub = min(abs(fu - 0.5), abs(fv - 0.5))
            let sl = sstep(0.003, 0.008, sub)
            h -= 0.08 * (1 - sl) * inset
            col *= 0.8 + 0.2 * sl
        }
        let bd = simd_length(V2(ex - 0.055, ey - 0.055))
        let bolt = sstep(0.02, 0.013, bd)
        h += 0.18 * bolt
        col = mix3(col, V3(0.22, 0.23, 0.25), bolt * 0.7)
        col *= 0.35 + 0.65 * seam
        rough = mixf(0.85, rough, seam)
        t.h = h; t.col = col; t.rough = clampf(rough, 0.08, 1); t.metal = 0.35
        return t
    }

    static func wallTexel(_ u: Float, _ v: Float, _ ec: V3) -> Texel {
        var t = Texel()
        let y = 1 - v
        let n1 = fbm(u, v, 5, 5, 21), n2 = fbm(u, v, 40, 3, 5)
        var col = V3(0.15, 0.165, 0.19)
        var h: Float = 0.5
        var rough: Float = 0.36 + 0.3 * n1
        var metal: Float = 0.5
        var emit = V3(0, 0, 0)
        if y < 0.08 {
            let rib = sstep(0.2, 0.35, abs(fract(y / 0.08 * 3) - 0.5))
            h = 0.55 + 0.1 * rib; col = V3(0.06, 0.065, 0.075)
        } else if y < 0.47 {
            let py = (y - 0.08) / 0.39
            let gu = u * 2; let cx = Foundation.floor(gu); let fu = gu - cx
            let ex = min(fu, 1 - fu) * 2, ey = min(py, 1 - py) * 1.56
            let edge = min(ex, ey)
            let seam = sstep(0.008, 0.03, edge)
            let inset = sstep(0.14, 0.16, edge)
            h = 0.3 + 0.3 * seam + 0.08 * inset
            if hashI(Int32(cx), 3, 11) < 0.5 {
                let inVent = sstep(0.35, 0.37, ex) * sstep(0.3, 0.32, ey)
                let sl = sstep(0.15, 0.3, abs(fract(py * 14) - 0.5))
                h -= inVent * 0.25 * (1 - sl)
                col = mix3(col, col * 0.35, inVent * (1 - sl))
            } else {
                col = mix3(col, V3(0.23, 0.25, 0.28), inset * 0.7)
                metal = mixf(metal, 0.3, inset * 0.7)
                // stencil-like hazard chevrons in the lower corner
                let cu = fu * 2, cv = py * 1.56
                if cu > 0.22 && cu < 0.7 && cv > 0.2 && cv < 0.32 {
                    let d = fract((cu + cv) * 9)
                    col = d < 0.5 ? V3(0.75, 0.55, 0.06) : V3(0.04, 0.04, 0.04)
                    metal = 0.1
                }
            }
            col *= 0.4 + 0.6 * seam
        } else if y < 0.55 {
            let cy = (y - 0.47) / 0.08
            let d = abs(cy - 0.5)
            h = 0.2 + 0.25 * sstep(0.38, 0.5, d)
            col = V3(0.03, 0.03, 0.035)
            let g = min(fract(u * 4), 1 - fract(u * 4))
            emit = ec * sstep(0.17, 0.10, d) * sstep(0.03, 0.05, g)
            rough = 0.6
        } else if y < 0.94 {
            let py = (y - 0.55) / 0.39
            let gu = u * 4; let cx = Foundation.floor(gu); let fu = gu - cx
            let ex = min(fu, 1 - fu), ey = min(py, 1 - py) * 1.56
            let seam = sstep(0.006, 0.025, min(ex, ey))
            let id = hashI(Int32(cx), 5, 13)
            h = 0.3 + 0.3 * seam + 0.1 * id
            col *= 0.8 + 0.4 * id
            if id > 0.7 && abs(fu - 0.5) < 0.1 && py > 0.80 && py < 0.84 { emit = V3(1.0, 0.45, 0.1) }
            if id < 0.25 {
                let sl = sstep(0.2, 0.3, abs(fract(fu * 8) - 0.5))
                let inV = sstep(0.2, 0.22, ex) * sstep(0.2, 0.22, ey)
                h -= inV * 0.2 * (1 - sl)
                col = mix3(col, col * 0.4, inV * (1 - sl))
            }
            col *= 0.4 + 0.6 * seam
        } else {
            let rib = sstep(0.2, 0.35, abs(fract(u * 16) - 0.5))
            h = 0.6 + 0.08 * rib; col = V3(0.08, 0.085, 0.10)
        }
        col *= 0.75 + 0.5 * n1
        rough += 0.1 * n2
        col *= 0.7 + 0.3 * sstep(0.0, 0.3, y)
        t.h = h; t.col = col; t.rough = clampf(rough, 0.1, 1); t.metal = metal; t.emit = emit
        return t
    }

    static func pillarTexel(_ u: Float, _ v: Float, _ ec: V3) -> Texel {
        var t = Texel()
        let n1 = fbm(u, v, 4, 5, 33)
        let c = abs(u - 0.5)
        var col = V3(0.11, 0.12, 0.14) * (0.75 + 0.5 * n1)
        var h: Float = 0.6
        var emit = V3(0, 0, 0)
        let band = fract(v * 4)
        let hs = sstep(0.0, 0.02, min(band, 1 - band))
        h = 0.3 + 0.3 * hs
        col *= 0.45 + 0.55 * hs
        if c < 0.09 {
            h = 0.15; col = V3(0.02, 0.02, 0.025)
            let seg = sstep(0.04, 0.07, min(fract(v * 2), 1 - fract(v * 2)))
            emit = ec * sstep(0.04, 0.02, c) * seg
        } else if c > 0.3 {
            let rib = sstep(0.2, 0.32, abs(fract(u * 20) - 0.5))
            h -= 0.12 * (1 - rib)
            col *= 0.7 + 0.3 * rib
        }
        let edge = min(u, 1 - u)
        h *= 0.6 + 0.4 * sstep(0.0, 0.03, edge)
        t.h = h; t.col = col; t.rough = 0.3 + 0.3 * n1; t.metal = 0.85; t.emit = emit
        return t
    }

    static func crateTexel(_ u: Float, _ v: Float, _ paint: V3) -> Texel {
        var t = Texel()
        let y = 1 - v
        let ex = min(u, 1 - u), ey = min(v, 1 - v)
        let edge = min(ex, ey)
        let frame = sstep(0.085, 0.075, edge)
        let rib = sin(u * 2 * .pi * 7)
        let n = fbm(u, v, 20, 4, 55), n2 = fbm(u, v, 3, 4, 8)
        var h = mixf(0.42 + 0.14 * rib, 0.8, frame)
        var col = paint * (0.85 + 0.3 * n2)
        var metal: Float = 0.15, rough: Float = 0.5 + 0.2 * n
        if frame < 0.5 && y > 0.14 && y < 0.26 {
            col = fract((u + y) * 6) < 0.5 ? V3(0.80, 0.60, 0.05) : V3(0.04, 0.04, 0.04)
        }
        if frame < 0.5 && y > 0.62 && y < 0.80 && u > 0.14 && u < 0.42 {
            // id plate
            let bar = (y > 0.73 && u < 0.40) || (y < 0.68 && u < 0.30)
            if bar && !(y > 0.68 && y < 0.73) { col = mix3(col, V3(0.78, 0.78, 0.74), 0.85) }
        }
        if frame > 0.5 { col = V3(0.14, 0.15, 0.16); metal = 0.9; rough = 0.35 }
        let chip = sstep(0.66, 0.72, n + 0.24 * (1 - sstep(0, 0.14, edge)))
        col = mix3(col, V3(0.30, 0.30, 0.31), chip)
        metal = mixf(metal, 1, chip); rough = mixf(rough, 0.3, chip)
        h -= 0.03 * chip
        let bd = simd_length(V2(ex - 0.04, ey - 0.04))
        h += 0.15 * sstep(0.022, 0.014, bd)
        t.h = h; t.col = col; t.rough = rough; t.metal = metal
        return t
    }

    static func platingTexel(_ u: Float, _ v: Float) -> Texel {
        var t = Texel()
        let g: Float = 4
        let cx = Foundation.floor(u * g), cy = Foundation.floor(v * g)
        // merge some cells into wider plates
        let merged = hashI(Int32(cx / 2), Int32(cy), 3) < 0.4
        var fu = fract(u * g)
        let fv = fract(v * g)
        if merged { fu = fract(u * g / 2) }
        let ex = min(fu, 1 - fu) * (merged ? 2 : 1), ey = min(fv, 1 - fv)
        let edge = min(ex, ey)
        let seam = sstep(0.01, 0.05, edge)
        let n = fbm(u, v, 8, 4, 71)
        t.h = 0.35 + 0.4 * seam + 0.1 * hashI(Int32(cx), Int32(cy), 9)
        t.col = V3(repeating: 0.55 + 0.4 * n) * (0.5 + 0.5 * seam)
        t.rough = 0.25 + 0.35 * n
        t.metal = 1
        return t
    }

    /// Orbital-Dock deck: big 2 m plates, some with diamond tread, hazard bands or painted lines, bolts and grime.
    static func deckTexel(_ u: Float, _ v: Float) -> Texel {
        var t = Texel()
        let gu = u * 2, gv = v * 2
        let cx = Foundation.floor(gu), cy = Foundation.floor(gv)
        let fu = gu - cx, fv = gv - cy
        let ex = min(fu, 1 - fu), ey = min(fv, 1 - fv)
        let edge = min(ex, ey)
        let seam = sstep(0.004, 0.014, edge)
        let id = hashI(Int32(cx), Int32(cy), 23)
        let n1 = fbm(u, v, 6, 5, 61), n2 = fbm(u, v, 40, 3, 17)
        var col = V3(0.30, 0.32, 0.35) * (0.82 + 0.36 * n1)
        var h: Float = 0.3 + 0.5 * seam
        var rough: Float = 0.36 + 0.3 * n1 + 0.1 * n2
        var metal: Float = 0.6
        let inset = sstep(0.06, 0.07, edge)
        if id < 0.3 {
            // diamond tread plate
            let s: Float = 16
            let a = abs(fract(fu * s) - 0.5), b = abs(fract(fv * s) - 0.5)
            let alt = (Int(Foundation.floor(fu * s)) + Int(Foundation.floor(fv * s))) & 1
            let d = alt == 0 ? a * 3 + b : a + b * 3
            let bump = sstep(0.42, 0.3, d) * inset
            h += 0.1 * bump
            col *= 0.9 + 0.1 * bump
            metal = 0.85
        } else if id < 0.45 {
            // hazard band along one edge
            if fv > 0.03 && fv < 0.13 && ex > 0.03 {
                col = fract((fu + fv) * 10) < 0.5 ? V3(0.85, 0.6, 0.08) : V3(0.05, 0.05, 0.05)
                metal = 0.1; rough = 0.55
            }
        } else if id > 0.85 {
            // painted guide line
            if abs(fu - 0.5) < 0.03 && ey > 0.02 { col = V3(0.85, 0.85, 0.8); metal = 0.1; rough = 0.5 }
        }
        let bd = simd_length(V2(ex - 0.045, ey - 0.045))
        let bolt = sstep(0.016, 0.01, bd)
        h += 0.15 * bolt
        col = mix3(col, V3(0.45, 0.46, 0.48), bolt * 0.7)
        let grime = sstep(0.55, 0.75, fbm(u, v, 10, 4, 99))
        col = mix3(col, col * 0.55, grime * 0.55)
        col *= 0.45 + 0.55 * seam
        rough = mixf(0.85, rough, seam)
        t.h = h; t.col = col; t.rough = clampf(rough, 0.1, 1); t.metal = metal
        return t
    }

    /// greeble panel with small emissive display elements (generators, consoles)
    static func techTexel(_ u: Float, _ v: Float) -> Texel {
        var t = Texel()
        let g: Float = 6
        let cx = Foundation.floor(u * g), cy = Foundation.floor(v * g)
        let fu = fract(u * g), fv = fract(v * g)
        let id = hashI(Int32(cx), Int32(cy), 17)
        let edge = min(min(fu, 1 - fu), min(fv, 1 - fv))
        let seam = sstep(0.02, 0.07, edge)
        let n = fbm(u, v, 6, 4, 19)
        var col = V3(0.10, 0.11, 0.13) * (0.7 + 0.6 * n)
        var h = 0.3 + 0.3 * seam + 0.25 * id
        var emit = V3(0, 0, 0)
        if id > 0.86 {
            // small screen
            let inS = sstep(0.14, 0.18, edge)
            let line = sstep(0.3, 0.4, abs(fract(fv * 7) - 0.5)) * (hashI(Int32(fu * 9), Int32(fv * 7), Int32(cx) &+ 5) > 0.4 ? 1 : 0.15)
            emit = V3(0.15, 0.85, 1.0) * inS * (0.15 + 0.85 * line)
            col = mix3(col, V3(0.01, 0.02, 0.03), inS); h = mixf(h, 0.35, inS)
        } else if id < 0.2 {
            let sl = sstep(0.2, 0.3, abs(fract(fv * 6) - 0.5))
            h -= 0.2 * (1 - sl) * seam
            col *= 0.5 + 0.5 * sl
        } else if id > 0.55 && id < 0.62 {
            let d = simd_length(V2(fu - 0.5, fv - 0.5))
            emit = V3(1.0, 0.35, 0.08) * sstep(0.12, 0.08, d)
        }
        col *= 0.4 + 0.6 * seam
        t.h = h; t.col = col; t.rough = 0.3 + 0.35 * n; t.metal = 0.85; t.emit = emit
        return t
    }

    // MARK: sky

    static func equirectDir(_ u: Float, _ v: Float) -> V3 {
        // SceneKit: u = 0 faces +X, 0.25 +Z, 0.5 -X, 0.75 -Z; v = 0 is straight up
        let phi = u * 2 * Float.pi
        let theta = v * Float.pi
        return V3(cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta))
    }

    static func starLayer(_ d: V3, _ k: Float, _ thresh: Float, _ seed: Int32) -> V3 {
        let p = d * k
        let c = V3(Foundation.floor(p.x), Foundation.floor(p.y), Foundation.floor(p.z))
        let xi = Int32(c.x), yi = Int32(c.y), zi = Int32(c.z)
        let h = hash3I(xi, yi, zi, seed)
        if h < thresh { return V3(0, 0, 0) }
        let sp = c + V3(0.25 + 0.5 * hash3I(xi, yi, zi, seed &+ 1), 0.25 + 0.5 * hash3I(xi, yi, zi, seed &+ 2), 0.25 + 0.5 * hash3I(xi, yi, zi, seed &+ 3))
        let r = 0.05 + 0.09 * hash3I(xi, yi, zi, seed &+ 4)
        let b = sstep(r, 0, simd_length(p - sp))
        let tint = hash3I(xi, yi, zi, seed &+ 5)
        let colr = mix3(V3(0.7, 0.8, 1.0), V3(1.0, 0.85, 0.7), tint)
        return colr * b * b * (0.5 + 1.2 * hash3I(xi, yi, zi, seed &+ 6))
    }

    static func makeSky(_ w: Int, _ h: Int) -> CGImage {
        let ang: Float = 0.30
        let D: Float = 10
        let R = D * sin(ang)
        let C = planetDir * D
        let axis = simd_normalize(V3(0.35, 1, 0.25))
        let bandAxis = simd_normalize(V3(0.3, 0.8, -0.5))
        return proceduralImage(w, h) { u, v in
            let d = equirectDir(u, v)
            // deep space + nebula
            let q = d * 2.2
            let n = fbm3(q + V3(3, 1, 7), 5, 40)
            let n2 = fbm3(q * 1.7 + V3(n * 2.5, 0, n * 2.5), 5, 77)
            let band = exp(-pow(simd_dot(d, bandAxis) * 2.2, 2))
            let dens = sstep(0.42, 0.78, n2) * sstep(0.3, 0.7, n) * (0.25 + 0.75 * band)
            let hue = fbm3(q * 0.8 + V3(9, 9, 9), 3, 12)
            var neb = mix3(V3(0.05, 0.13, 0.45), V3(0.60, 0.10, 0.42), sstep(0.35, 0.65, hue))
            neb += V3(0.10, 0.55, 0.55) * pow(dens, 3)
            var col = V3(0.012, 0.016, 0.035) + neb * dens * 1.7
            col += V3(0.03, 0.045, 0.10) * band * 0.8
            col += starLayer(d, 150, 0.72, 1) * 1.5 + starLayer(d, 340, 0.80, 2) * 1.0
            // sun
            let s = max(simd_dot(d, sunDir), 0)
            col += V3(1.0, 0.92, 0.78) * (sstep(0.9994, 0.9998, s) * 3 + pow(s, 900) * 1.2 + pow(s, 70) * 0.22 + pow(s, 8) * 0.04)

            // ringed gas giant
            let b = simd_dot(d, C)
            let disc = b * b - (simd_dot(C, C) - R * R)
            var tPlanet = Float.greatestFiniteMagnitude
            if disc > 0 && b > 0 {
                let t = b - sqrt(disc)
                tPlanet = t
                let p = d * t
                let nrm = simd_normalize(p - C)
                let lit = sstep(-0.12, 0.45, simd_dot(nrm, sunDir))
                let lat = simd_dot(nrm, axis)
                let turb = fbm3(nrm * 3 + V3(0, lat * 5, 0), 4, 5)
                let bandv = sin(lat * 19 + turb * 5.5) * 0.5 + 0.5
                var pc = mix3(V3(0.80, 0.47, 0.25), V3(0.96, 0.82, 0.62), bandv)
                pc = mix3(pc, V3(0.42, 0.22, 0.22), sstep(0.5, 0.75, fbm3(nrm * 5 + V3(4, lat * 9, 2), 4, 6)))
                let storm = sstep(0.16, 0.0, simd_length(nrm - simd_normalize(V3(0.5, 0.25, 0.83))))
                pc = mix3(pc, V3(0.95, 0.55, 0.35), storm * 0.7)
                let rim = pow(1 - max(simd_dot(nrm, -d), 0), 3)
                col = pc * lit * 0.95 + V3(0.35, 0.6, 1.0) * rim * (0.15 + lit) * 0.9 + V3(0.006, 0.01, 0.02)
            } else {
                let a = acos(clampf(simd_dot(d, planetDir), -1, 1))
                let en = safeNorm(d - planetDir * simd_dot(d, planetDir))
                let f = clampf(simd_dot(en, sunDir) * 0.6 + 0.6, 0, 1)
                col += V3(0.25, 0.45, 0.95) * exp(-(a - ang) / 0.02) * 0.55 * f
            }
            // rings
            let dn = simd_dot(d, axis)
            if abs(dn) > 1e-4 {
                let t = simd_dot(C, axis) / dn
                if t > 0 && t < tPlanet {
                    let p = d * t
                    let rr = simd_length(p - C) / R
                    if rr > 1.35 && rr < 2.4 {
                        let x = (rr - 1.35) / 1.05
                        var a = (0.45 + 0.55 * sin(rr * 46)) * (0.6 + 0.4 * sin(rr * 13 + 1))
                        a *= sstep(0, 0.04, x) * sstep(1, 0.9, x)
                        a *= (rr > 1.93 && rr < 1.99) ? 0.08 : 1
                        // planet shadow across the ring
                        let toSun = sunDir
                        let pc = p - C
                        let along = simd_dot(pc, toSun)
                        let perp = simd_length(pc - toSun * along)
                        let shadow: Float = (along < 0 && perp < R) ? 0.12 : 1
                        let rc = mix3(V3(0.85, 0.75, 0.62), V3(0.6, 0.5, 0.45), x)
                        col = mix3(col, rc * shadow, clampf(a * 0.75, 0, 1))
                    }
                }
            }
            return SIMD4(col.x, col.y, col.z, 1)
        }
    }

    /// Art-directed light rig used for image based lighting (gives metals colourful reflections).
    static func makeEnv(_ w: Int, _ h: Int) -> CGImage {
        return proceduralImage(w, h) { u, v in
            let d = equirectDir(u, v)
            let y = d.y
            var col = y < 0 ? V3(0.03, 0.033, 0.04) : mix3(V3(0.10, 0.11, 0.14), V3(0.03, 0.035, 0.06), y)
            let az = atan2(d.x, -d.z)
            let seg = fract(az / (2 * .pi) * 8 + 0.5)
            let panel = sstep(0.12, 0.2, seg) * sstep(0.88, 0.8, seg)
            let idx = Int(Foundation.floor(az / (2 * .pi) * 8 + 0.5 + 8)) % 8
            let pcol = idx % 2 == 0 ? V3(0.15, 0.85, 1.0) : V3(1.0, 0.25, 0.65)
            col += pcol * panel * sstep(0.06, 0.12, y) * sstep(0.30, 0.22, y) * 0.9
            col += V3(1.0, 0.6, 0.25) * panel * sstep(0.5, 0.55, y) * sstep(0.66, 0.6, y) * (idx % 4 == 1 ? 1.0 : 0.0)
            col += V3(0.9, 0.95, 1.0) * sstep(0.86, 0.95, y) * 1.1
            let s = max(simd_dot(d, sunDir), 0)
            col += V3(1.0, 0.9, 0.75) * pow(s, 40) * 1.5
            return SIMD4(col.x, col.y, col.z, 1)
        }
    }
}
