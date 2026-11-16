// Everything visual in the game is generated procedurally at startup – no asset files.
// Line by line port of Textures.swift (same formulas, seeds and resolutions).
#include "textures.h"
#include <windows.h>
#include <atomic>
#include <map>
#include <mutex>

// MARK: - parallel loop (plain Win32 threads, no runtime dependency)

namespace {
struct ParJob {
    const std::function<void(int)>* f;
    std::atomic<int> next{0};
    int n = 0;
};
DWORD WINAPI parWorker(LPVOID p) {
    auto* j = (ParJob*)p;
    for (;;) {
        int i = j->next.fetch_add(1);
        if (i >= j->n) break;
        (*j->f)(i);
    }
    return 0;
}
}

void parallelFor(int n, const std::function<void(int)>& f) {
    SYSTEM_INFO si;
    GetSystemInfo(&si);
    int threads = std::max(1, std::min((int)si.dwNumberOfProcessors, 16));
    ParJob job;
    job.f = &f;
    job.n = n;
    std::vector<HANDLE> hs;
    for (int t = 1; t < threads; t++) hs.push_back(CreateThread(nullptr, 0, parWorker, &job, 0, nullptr));
    parWorker(&job);
    if (!hs.empty()) WaitForMultipleObjects((DWORD)hs.size(), hs.data(), TRUE, INFINITE);
    for (HANDLE h : hs) CloseHandle(h);
}

// MARK: - helpers

struct Texel {
    float h = 0.5f;
    V3 col = V3(0.5f, 0.5f, 0.5f);
    float rough = 0.5f;
    float metal = 1;
    V3 emit = V3(0, 0, 0);
};

static inline uint8_t b8(float x) { return (uint8_t)(clampf(x, 0, 1) * 255 + 0.5f); }

/// f returns (r,g,b,a) straight; with alpha the image is premultiplied (like the CGImages on the Mac)
static Image proceduralImage(int w, int h, bool alpha, const std::function<V4(float, float)>& f) {
    Image img;
    img.w = w; img.h = h; img.channels = 4;
    img.px.assign((size_t)w * h * 4, 255);
    parallelFor(h, [&](int y) {
        for (int x = 0; x < w; x++) {
            V4 c = f((x + 0.5f) / w, (y + 0.5f) / h);
            size_t i = ((size_t)y * w + x) * 4;
            float a = alpha ? clampf(c.w, 0, 1) : 1;
            img.px[i] = b8(c.x * a); img.px[i + 1] = b8(c.y * a); img.px[i + 2] = b8(c.z * a); img.px[i + 3] = b8(a);
        }
    });
    return img;
}

static TextureSet buildTextureSet(const char* name, int n, float bump, bool emission, const std::function<Texel(float, float)>& f) {
    std::vector<Texel> t((size_t)n * n);
    parallelFor(n, [&](int y) {
        for (int x = 0; x < n; x++) t[(size_t)y * n + x] = f((x + 0.5f) / n, (y + 0.5f) / n);
    });
    Image alb, nrm, rgh, met, emi;
    alb.w = nrm.w = rgh.w = met.w = emi.w = n;
    alb.h = nrm.h = rgh.h = met.h = emi.h = n;
    alb.channels = nrm.channels = emi.channels = 4;
    rgh.channels = met.channels = 1;
    alb.px.assign((size_t)n * n * 4, 255);
    nrm.px.assign((size_t)n * n * 4, 255);
    rgh.px.assign((size_t)n * n, 0);
    met.px.assign((size_t)n * n, 0);
    if (emission) emi.px.assign((size_t)n * n * 4, 255);
    parallelFor(n, [&](int y) {
        int ym = (y + n - 1) % n, yp = (y + 1) % n;
        int ym3 = (y + n - 3) % n, yp3 = (y + 3) % n;
        for (int x = 0; x < n; x++) {
            int xm = (x + n - 1) % n, xp = (x + 1) % n;
            int xm3 = (x + n - 3) % n, xp3 = (x + 3) % n;
            size_t i = (size_t)y * n + x;
            const Texel& tx = t[i];
            float dx = (t[(size_t)y * n + xp].h - t[(size_t)y * n + xm].h) * bump;
            float dy = (t[(size_t)yp * n + x].h - t[(size_t)ym * n + x].h) * bump;
            V3 nv = simd_normalize(V3(-dx, dy, 1));
            nrm.px[i * 4] = b8(nv.x * 0.5f + 0.5f); nrm.px[i * 4 + 1] = b8(nv.y * 0.5f + 0.5f); nrm.px[i * 4 + 2] = b8(nv.z * 0.5f + 0.5f);
            // cheap cavity occlusion baked into albedo
            float avg = (t[(size_t)y * n + xp3].h + t[(size_t)y * n + xm3].h + t[(size_t)yp3 * n + x].h + t[(size_t)ym3 * n + x].h) * 0.25f;
            float ao = clampf(1 - (avg - tx.h) * 2.2f, 0.45f, 1.08f);
            V3 c = tx.col * ao;
            alb.px[i * 4] = b8(c.x); alb.px[i * 4 + 1] = b8(c.y); alb.px[i * 4 + 2] = b8(c.z);
            rgh.px[i] = b8(tx.rough); met.px[i] = b8(tx.metal);
            if (emission) { emi.px[i * 4] = b8(tx.emit.x); emi.px[i * 4 + 1] = b8(tx.emit.y); emi.px[i * 4 + 2] = b8(tx.emit.z); }
        }
    });
    TextureSet s;
    s.name = name;
    s.albedo = makeTexture(alb, true);
    s.normal = makeTexture(nrm, false);
    s.roughness = makeTexture(rgh, false);
    s.metalness = makeTexture(met, false);
    if (emission) s.emission = makeTexture(emi, true);
    return s;
}

// MARK: - surface generators

namespace Tex {
const V3 sunDir = simd_normalize(V3(0.48f, 0.66f, 0.42f));
const V3 planetDir = simd_normalize(V3(-0.50f, 0.50f, -0.70f));
}

static float hexEdge(V2 p) {
    V2 r(1, 1.7320508f), h = r * 0.5f;
    auto md = [&](V2 a) { return V2(a.x - r.x * std::floor(a.x / r.x), a.y - r.y * std::floor(a.y / r.y)); };
    V2 a = md(p) - h, b = md(p - h) - h;
    V2 g = simd_dot(a, a) < simd_dot(b, b) ? a : b;
    return 0.5f - std::max(std::fabs(g.x), std::fabs(g.x) * 0.5f + std::fabs(g.y) * 0.8660254f);
}

static Texel floorTexel(float u, float v) {
    Texel t;
    float gu = u * 2, gv = v * 2;
    float cx = std::floor(gu), cy = std::floor(gv);
    float fu = gu - cx, fv = gv - cy;
    float ex = std::min(fu, 1 - fu), ey = std::min(fv, 1 - fv);
    float edge = std::min(ex, ey);
    float seam = sstep(0.004f, 0.016f, edge);
    float id = hashI((int32_t)cx, (int32_t)cy, 7);
    float inset = sstep(0.10f, 0.108f, edge);
    float h = 0.25f + 0.55f * seam;
    float n1 = fbm(u, v, 6, 5, 3);
    float n2 = fbm(u, v, 48, 3, 9);
    V3 col = V3(0.135f, 0.15f, 0.18f) * (0.7f + 0.6f * n1);
    float rough = 0.22f + 0.40f * n1 + 0.12f * n2;
    if (id < 0.5f) {
        float s = 14;
        float a = std::fabs(fract(fu * s) - 0.5f), b = std::fabs(fract(fv * s) - 0.5f);
        int alt = ((int)std::floor(fu * s) + (int)std::floor(fv * s)) & 1;
        float d = alt == 0 ? a * 3 + b : a + b * 3;
        float bump = sstep(0.42f, 0.3f, d) * inset;
        h += 0.10f * bump;
        rough += 0.08f * bump;
        col *= 0.9f;
    } else {
        h += 0.05f * inset;
        float sub = std::min(std::fabs(fu - 0.5f), std::fabs(fv - 0.5f));
        float sl = sstep(0.003f, 0.008f, sub);
        h -= 0.08f * (1 - sl) * inset;
        col *= 0.8f + 0.2f * sl;
    }
    float bd = simd_length(V2(ex - 0.055f, ey - 0.055f));
    float bolt = sstep(0.02f, 0.013f, bd);
    h += 0.18f * bolt;
    col = mix3(col, V3(0.22f, 0.23f, 0.25f), bolt * 0.7f);
    col *= 0.35f + 0.65f * seam;
    rough = mixf(0.85f, rough, seam);
    t.h = h; t.col = col; t.rough = clampf(rough, 0.08f, 1); t.metal = 0.35f;
    return t;
}

static Texel wallTexel(float u, float v, V3 ec) {
    Texel t;
    float y = 1 - v;
    float n1 = fbm(u, v, 5, 5, 21), n2 = fbm(u, v, 40, 3, 5);
    V3 col(0.15f, 0.165f, 0.19f);
    float h = 0.5f;
    float rough = 0.36f + 0.3f * n1;
    float metal = 0.5f;
    V3 emit(0, 0, 0);
    if (y < 0.08f) {
        float rib = sstep(0.2f, 0.35f, std::fabs(fract(y / 0.08f * 3) - 0.5f));
        h = 0.55f + 0.1f * rib; col = V3(0.06f, 0.065f, 0.075f);
    } else if (y < 0.47f) {
        float py = (y - 0.08f) / 0.39f;
        float gu = u * 2, cx = std::floor(gu), fu = gu - cx;
        float ex = std::min(fu, 1 - fu) * 2, ey = std::min(py, 1 - py) * 1.56f;
        float edge = std::min(ex, ey);
        float seam = sstep(0.008f, 0.03f, edge);
        float inset = sstep(0.14f, 0.16f, edge);
        h = 0.3f + 0.3f * seam + 0.08f * inset;
        if (hashI((int32_t)cx, 3, 11) < 0.5f) {
            float inVent = sstep(0.35f, 0.37f, ex) * sstep(0.3f, 0.32f, ey);
            float sl = sstep(0.15f, 0.3f, std::fabs(fract(py * 14) - 0.5f));
            h -= inVent * 0.25f * (1 - sl);
            col = mix3(col, col * 0.35f, inVent * (1 - sl));
        } else {
            col = mix3(col, V3(0.23f, 0.25f, 0.28f), inset * 0.7f);
            metal = mixf(metal, 0.3f, inset * 0.7f);
            float cu = fu * 2, cv = py * 1.56f;
            if (cu > 0.22f && cu < 0.7f && cv > 0.2f && cv < 0.32f) {
                float d = fract((cu + cv) * 9);
                col = d < 0.5f ? V3(0.75f, 0.55f, 0.06f) : V3(0.04f, 0.04f, 0.04f);
                metal = 0.1f;
            }
        }
        col *= 0.4f + 0.6f * seam;
    } else if (y < 0.55f) {
        float cy = (y - 0.47f) / 0.08f;
        float d = std::fabs(cy - 0.5f);
        h = 0.2f + 0.25f * sstep(0.38f, 0.5f, d);
        col = V3(0.03f, 0.03f, 0.035f);
        float g = std::min(fract(u * 4), 1 - fract(u * 4));
        emit = ec * sstep(0.17f, 0.10f, d) * sstep(0.03f, 0.05f, g);
        rough = 0.6f;
    } else if (y < 0.94f) {
        float py = (y - 0.55f) / 0.39f;
        float gu = u * 4, cx = std::floor(gu), fu = gu - cx;
        float ex = std::min(fu, 1 - fu), ey = std::min(py, 1 - py) * 1.56f;
        float seam = sstep(0.006f, 0.025f, std::min(ex, ey));
        float id = hashI((int32_t)cx, 5, 13);
        h = 0.3f + 0.3f * seam + 0.1f * id;
        col *= 0.8f + 0.4f * id;
        if (id > 0.7f && std::fabs(fu - 0.5f) < 0.1f && py > 0.80f && py < 0.84f) emit = V3(1.0f, 0.45f, 0.1f);
        if (id < 0.25f) {
            float sl = sstep(0.2f, 0.3f, std::fabs(fract(fu * 8) - 0.5f));
            float inV = sstep(0.2f, 0.22f, ex) * sstep(0.2f, 0.22f, ey);
            h -= inV * 0.2f * (1 - sl);
            col = mix3(col, col * 0.4f, inV * (1 - sl));
        }
        col *= 0.4f + 0.6f * seam;
    } else {
        float rib = sstep(0.2f, 0.35f, std::fabs(fract(u * 16) - 0.5f));
        h = 0.6f + 0.08f * rib; col = V3(0.08f, 0.085f, 0.10f);
    }
    col *= 0.75f + 0.5f * n1;
    rough += 0.1f * n2;
    col *= 0.7f + 0.3f * sstep(0.0f, 0.3f, y);
    t.h = h; t.col = col; t.rough = clampf(rough, 0.1f, 1); t.metal = metal; t.emit = emit;
    return t;
}

static Texel pillarTexel(float u, float v, V3 ec) {
    Texel t;
    float n1 = fbm(u, v, 4, 5, 33);
    float c = std::fabs(u - 0.5f);
    V3 col = V3(0.11f, 0.12f, 0.14f) * (0.75f + 0.5f * n1);
    float h;
    V3 emit(0, 0, 0);
    float band = fract(v * 4);
    float hs = sstep(0.0f, 0.02f, std::min(band, 1 - band));
    h = 0.3f + 0.3f * hs;
    col *= 0.45f + 0.55f * hs;
    if (c < 0.09f) {
        h = 0.15f; col = V3(0.02f, 0.02f, 0.025f);
        float seg = sstep(0.04f, 0.07f, std::min(fract(v * 2), 1 - fract(v * 2)));
        emit = ec * sstep(0.04f, 0.02f, c) * seg;
    } else if (c > 0.3f) {
        float rib = sstep(0.2f, 0.32f, std::fabs(fract(u * 20) - 0.5f));
        h -= 0.12f * (1 - rib);
        col *= 0.7f + 0.3f * rib;
    }
    float edge = std::min(u, 1 - u);
    h *= 0.6f + 0.4f * sstep(0.0f, 0.03f, edge);
    t.h = h; t.col = col; t.rough = 0.3f + 0.3f * n1; t.metal = 0.85f; t.emit = emit;
    return t;
}

static Texel crateTexel(float u, float v, V3 paint) {
    Texel t;
    float y = 1 - v;
    float ex = std::min(u, 1 - u), ey = std::min(v, 1 - v);
    float edge = std::min(ex, ey);
    float frame = sstep(0.085f, 0.075f, edge);
    float rib = std::sin(u * 2 * PI * 7);
    float n = fbm(u, v, 20, 4, 55), n2 = fbm(u, v, 3, 4, 8);
    float h = mixf(0.42f + 0.14f * rib, 0.8f, frame);
    V3 col = paint * (0.85f + 0.3f * n2);
    float metal = 0.15f, rough = 0.5f + 0.2f * n;
    if (frame < 0.5f && y > 0.14f && y < 0.26f) col = fract((u + y) * 6) < 0.5f ? V3(0.80f, 0.60f, 0.05f) : V3(0.04f, 0.04f, 0.04f);
    if (frame < 0.5f && y > 0.62f && y < 0.80f && u > 0.14f && u < 0.42f) {
        bool bar = (y > 0.73f && u < 0.40f) || (y < 0.68f && u < 0.30f);
        if (bar && !(y > 0.68f && y < 0.73f)) col = mix3(col, V3(0.78f, 0.78f, 0.74f), 0.85f);
    }
    if (frame > 0.5f) { col = V3(0.14f, 0.15f, 0.16f); metal = 0.9f; rough = 0.35f; }
    float chip = sstep(0.66f, 0.72f, n + 0.24f * (1 - sstep(0, 0.14f, edge)));
    col = mix3(col, V3(0.30f, 0.30f, 0.31f), chip);
    metal = mixf(metal, 1, chip); rough = mixf(rough, 0.3f, chip);
    h -= 0.03f * chip;
    float bd = simd_length(V2(ex - 0.04f, ey - 0.04f));
    h += 0.15f * sstep(0.022f, 0.014f, bd);
    t.h = h; t.col = col; t.rough = rough; t.metal = metal;
    return t;
}

static Texel platingTexel(float u, float v) {
    Texel t;
    float g = 4;
    float cx = std::floor(u * g), cy = std::floor(v * g);
    bool merged = hashI((int32_t)(cx / 2), (int32_t)cy, 3) < 0.4f;
    float fu = fract(u * g);
    float fv = fract(v * g);
    if (merged) fu = fract(u * g / 2);
    float ex = std::min(fu, 1 - fu) * (merged ? 2 : 1), ey = std::min(fv, 1 - fv);
    float edge = std::min(ex, ey);
    float seam = sstep(0.01f, 0.05f, edge);
    float n = fbm(u, v, 8, 4, 71);
    t.h = 0.35f + 0.4f * seam + 0.1f * hashI((int32_t)cx, (int32_t)cy, 9);
    t.col = V3::repeating(0.55f + 0.4f * n) * (0.5f + 0.5f * seam);
    t.rough = 0.25f + 0.35f * n;
    t.metal = 1;
    return t;
}

static Texel deckTexel(float u, float v) {
    Texel t;
    float gu = u * 2, gv = v * 2;
    float cx = std::floor(gu), cy = std::floor(gv);
    float fu = gu - cx, fv = gv - cy;
    float ex = std::min(fu, 1 - fu), ey = std::min(fv, 1 - fv);
    float edge = std::min(ex, ey);
    float seam = sstep(0.004f, 0.014f, edge);
    float id = hashI((int32_t)cx, (int32_t)cy, 23);
    float n1 = fbm(u, v, 6, 5, 61), n2 = fbm(u, v, 40, 3, 17);
    V3 col = V3(0.30f, 0.32f, 0.35f) * (0.82f + 0.36f * n1);
    float h = 0.3f + 0.5f * seam;
    float rough = 0.36f + 0.3f * n1 + 0.1f * n2;
    float metal = 0.6f;
    float inset = sstep(0.06f, 0.07f, edge);
    if (id < 0.3f) {
        float s = 16;
        float a = std::fabs(fract(fu * s) - 0.5f), b = std::fabs(fract(fv * s) - 0.5f);
        int alt = ((int)std::floor(fu * s) + (int)std::floor(fv * s)) & 1;
        float d = alt == 0 ? a * 3 + b : a + b * 3;
        float bump = sstep(0.42f, 0.3f, d) * inset;
        h += 0.1f * bump;
        col *= 0.9f + 0.1f * bump;
        metal = 0.85f;
    } else if (id < 0.45f) {
        if (fv > 0.03f && fv < 0.13f && ex > 0.03f) {
            col = fract((fu + fv) * 10) < 0.5f ? V3(0.85f, 0.6f, 0.08f) : V3(0.05f, 0.05f, 0.05f);
            metal = 0.1f; rough = 0.55f;
        }
    } else if (id > 0.85f) {
        if (std::fabs(fu - 0.5f) < 0.03f && ey > 0.02f) { col = V3(0.85f, 0.85f, 0.8f); metal = 0.1f; rough = 0.5f; }
    }
    float bd = simd_length(V2(ex - 0.045f, ey - 0.045f));
    float bolt = sstep(0.016f, 0.01f, bd);
    h += 0.15f * bolt;
    col = mix3(col, V3(0.45f, 0.46f, 0.48f), bolt * 0.7f);
    float grime = sstep(0.55f, 0.75f, fbm(u, v, 10, 4, 99));
    col = mix3(col, col * 0.55f, grime * 0.55f);
    col *= 0.45f + 0.55f * seam;
    rough = mixf(0.85f, rough, seam);
    t.h = h; t.col = col; t.rough = clampf(rough, 0.1f, 1); t.metal = metal;
    return t;
}

static Texel techTexel(float u, float v) {
    Texel t;
    float g = 6;
    float cx = std::floor(u * g), cy = std::floor(v * g);
    float fu = fract(u * g), fv = fract(v * g);
    float id = hashI((int32_t)cx, (int32_t)cy, 17);
    float edge = std::min(std::min(fu, 1 - fu), std::min(fv, 1 - fv));
    float seam = sstep(0.02f, 0.07f, edge);
    float n = fbm(u, v, 6, 4, 19);
    V3 col = V3(0.10f, 0.11f, 0.13f) * (0.7f + 0.6f * n);
    float h = 0.3f + 0.3f * seam + 0.25f * id;
    V3 emit(0, 0, 0);
    if (id > 0.86f) {
        float inS = sstep(0.14f, 0.18f, edge);
        float line = sstep(0.3f, 0.4f, std::fabs(fract(fv * 7) - 0.5f)) * (hashI((int32_t)(fu * 9), (int32_t)(fv * 7), (int32_t)cx + 5) > 0.4f ? 1.f : 0.15f);
        emit = V3(0.15f, 0.85f, 1.0f) * inS * (0.15f + 0.85f * line);
        col = mix3(col, V3(0.01f, 0.02f, 0.03f), inS); h = mixf(h, 0.35f, inS);
    } else if (id < 0.2f) {
        float sl = sstep(0.2f, 0.3f, std::fabs(fract(fv * 6) - 0.5f));
        h -= 0.2f * (1 - sl) * seam;
        col *= 0.5f + 0.5f * sl;
    } else if (id > 0.55f && id < 0.62f) {
        float d = simd_length(V2(fu - 0.5f, fv - 0.5f));
        emit = V3(1.0f, 0.35f, 0.08f) * sstep(0.12f, 0.08f, d);
    }
    col *= 0.4f + 0.6f * seam;
    t.h = h; t.col = col; t.rough = 0.3f + 0.35f * n; t.metal = 0.85f; t.emit = emit;
    return t;
}

// MARK: - sky

static V3 equirectDir(float u, float v) {
    // u = 0 faces +X, 0.25 +Z, 0.5 -X, 0.75 -Z; v = 0 is straight up (same as SceneKit)
    float phi = u * 2 * PI, theta = v * PI;
    return V3(std::cos(phi) * std::sin(theta), std::cos(theta), std::sin(phi) * std::sin(theta));
}

static V3 starLayer(V3 d, float k, float thresh, int32_t seed) {
    V3 p = d * k;
    V3 c(std::floor(p.x), std::floor(p.y), std::floor(p.z));
    int32_t xi = (int32_t)c.x, yi = (int32_t)c.y, zi = (int32_t)c.z;
    float h = hash3I(xi, yi, zi, seed);
    if (h < thresh) return V3(0, 0, 0);
    V3 sp = c + V3(0.25f + 0.5f * hash3I(xi, yi, zi, seed + 1), 0.25f + 0.5f * hash3I(xi, yi, zi, seed + 2), 0.25f + 0.5f * hash3I(xi, yi, zi, seed + 3));
    float r = 0.05f + 0.09f * hash3I(xi, yi, zi, seed + 4);
    float b = sstep(r, 0, simd_length(p - sp));
    float tint = hash3I(xi, yi, zi, seed + 5);
    V3 colr = mix3(V3(0.7f, 0.8f, 1.0f), V3(1.0f, 0.85f, 0.7f), tint);
    return colr * b * b * (0.5f + 1.2f * hash3I(xi, yi, zi, seed + 6));
}

static Image makeSky(int w, int h) {
    const float ang = 0.30f, D = 10;
    const float R = D * std::sin(ang);
    const V3 C = Tex::planetDir * D;
    const V3 axis = simd_normalize(V3(0.35f, 1, 0.25f));
    const V3 bandAxis = simd_normalize(V3(0.3f, 0.8f, -0.5f));
    const V3 sunDir = Tex::sunDir, planetDir = Tex::planetDir;
    return proceduralImage(w, h, false, [=](float u, float v) {
        V3 d = equirectDir(u, v);
        V3 q = d * 2.2f;
        float n = fbm3(q + V3(3, 1, 7), 5, 40);
        float n2 = fbm3(q * 1.7f + V3(n * 2.5f, 0, n * 2.5f), 5, 77);
        float band = std::exp(-std::pow(simd_dot(d, bandAxis) * 2.2f, 2.f));
        float dens = sstep(0.42f, 0.78f, n2) * sstep(0.3f, 0.7f, n) * (0.25f + 0.75f * band);
        float hue = fbm3(q * 0.8f + V3(9, 9, 9), 3, 12);
        V3 neb = mix3(V3(0.05f, 0.13f, 0.45f), V3(0.60f, 0.10f, 0.42f), sstep(0.35f, 0.65f, hue));
        neb += V3(0.10f, 0.55f, 0.55f) * std::pow(dens, 3.f);
        V3 col = V3(0.012f, 0.016f, 0.035f) + neb * dens * 1.7f;
        col += V3(0.03f, 0.045f, 0.10f) * band * 0.8f;
        col += starLayer(d, 150, 0.72f, 1) * 1.5f + starLayer(d, 340, 0.80f, 2) * 1.0f;
        float s = std::max(simd_dot(d, sunDir), 0.f);
        col += V3(1.0f, 0.92f, 0.78f) * (sstep(0.9994f, 0.9998f, s) * 3 + std::pow(s, 900.f) * 1.2f + std::pow(s, 70.f) * 0.22f + std::pow(s, 8.f) * 0.04f);
        float b = simd_dot(d, C);
        float disc = b * b - (simd_dot(C, C) - R * R);
        float tPlanet = 1e30f;
        if (disc > 0 && b > 0) {
            float t = b - std::sqrt(disc);
            tPlanet = t;
            V3 p = d * t;
            V3 nrm = simd_normalize(p - C);
            float lit = sstep(-0.12f, 0.45f, simd_dot(nrm, sunDir));
            float lat = simd_dot(nrm, axis);
            float turb = fbm3(nrm * 3 + V3(0, lat * 5, 0), 4, 5);
            float bandv = std::sin(lat * 19 + turb * 5.5f) * 0.5f + 0.5f;
            V3 pc = mix3(V3(0.80f, 0.47f, 0.25f), V3(0.96f, 0.82f, 0.62f), bandv);
            pc = mix3(pc, V3(0.42f, 0.22f, 0.22f), sstep(0.5f, 0.75f, fbm3(nrm * 5 + V3(4, lat * 9, 2), 4, 6)));
            float storm = sstep(0.16f, 0.0f, simd_length(nrm - simd_normalize(V3(0.5f, 0.25f, 0.83f))));
            pc = mix3(pc, V3(0.95f, 0.55f, 0.35f), storm * 0.7f);
            float rim = std::pow(1 - std::max(simd_dot(nrm, -d), 0.f), 3.f);
            col = pc * lit * 0.95f + V3(0.35f, 0.6f, 1.0f) * rim * (0.15f + lit) * 0.9f + V3(0.006f, 0.01f, 0.02f);
        } else {
            float a = std::acos(clampf(simd_dot(d, planetDir), -1, 1));
            V3 en = safeNorm(d - planetDir * simd_dot(d, planetDir));
            float f = clampf(simd_dot(en, sunDir) * 0.6f + 0.6f, 0, 1);
            col += V3(0.25f, 0.45f, 0.95f) * std::exp(-(a - ang) / 0.02f) * 0.55f * f;
        }
        float dn = simd_dot(d, axis);
        if (std::fabs(dn) > 1e-4f) {
            float t = simd_dot(C, axis) / dn;
            if (t > 0 && t < tPlanet) {
                V3 p = d * t;
                float rr = simd_length(p - C) / R;
                if (rr > 1.35f && rr < 2.4f) {
                    float x = (rr - 1.35f) / 1.05f;
                    float a = (0.45f + 0.55f * std::sin(rr * 46)) * (0.6f + 0.4f * std::sin(rr * 13 + 1));
                    a *= sstep(0, 0.04f, x) * sstep(1, 0.9f, x);
                    a *= (rr > 1.93f && rr < 1.99f) ? 0.08f : 1.f;
                    V3 pcv = p - C;
                    float along = simd_dot(pcv, sunDir);
                    float perp = simd_length(pcv - sunDir * along);
                    float shadow = (along < 0 && perp < R) ? 0.12f : 1.f;
                    V3 rc = mix3(V3(0.85f, 0.75f, 0.62f), V3(0.6f, 0.5f, 0.45f), x);
                    col = mix3(col, rc * shadow, clampf(a * 0.75f, 0, 1));
                }
            }
        }
        return V4(col, 1);
    });
}

/// art-directed light rig for image based lighting (colourful reflections in metal), linear
static std::vector<V4> makeEnv(int w, int h) {
    std::vector<V4> px((size_t)w * h);
    parallelFor(h, [&](int y) {
        for (int x = 0; x < w; x++) {
            V3 d = equirectDir((x + 0.5f) / w, (y + 0.5f) / h);
            float yy = d.y;
            V3 col = yy < 0 ? V3(0.03f, 0.033f, 0.04f) : mix3(V3(0.10f, 0.11f, 0.14f), V3(0.03f, 0.035f, 0.06f), yy);
            float az = std::atan2(d.x, -d.z);
            float seg = fract(az / (2 * PI) * 8 + 0.5f);
            float panel = sstep(0.12f, 0.2f, seg) * sstep(0.88f, 0.8f, seg);
            int idx = ((int)std::floor(az / (2 * PI) * 8 + 0.5f + 8)) % 8;
            V3 pcol = idx % 2 == 0 ? V3(0.15f, 0.85f, 1.0f) : V3(1.0f, 0.25f, 0.65f);
            col += pcol * panel * sstep(0.06f, 0.12f, yy) * sstep(0.30f, 0.22f, yy) * 0.9f;
            col += V3(1.0f, 0.6f, 0.25f) * panel * sstep(0.5f, 0.55f, yy) * sstep(0.66f, 0.6f, yy) * (idx % 4 == 1 ? 1.0f : 0.0f);
            col += V3(0.9f, 0.95f, 1.0f) * sstep(0.86f, 0.95f, yy) * 1.1f;
            float s = std::max(simd_dot(d, Tex::sunDir), 0.f);
            col += V3(1.0f, 0.9f, 0.75f) * std::pow(s, 40.f) * 1.5f;
            // the Mac stores it as an 8-bit sRGB image: clamp, then decode
            V3 c(clampf(col.x, 0, 1), clampf(col.y, 0, 1), clampf(col.z, 0, 1));
            px[(size_t)y * w + x] = V4(srgbToLinear(c), 1);
        }
    });
    return px;
}

// MARK: - registry

namespace {
struct All {
    TextureSet floor, wallCyan, pillar, crateOrange, crateTeal, crateGrey, plating, tech, deck;
    TexRef padMark, glow, softDot, ring, flare, smoke, shaft, hex, scan, sky;
    std::vector<V4> env;
    int envW = 512, envH = 256;
    bool built = false;
};
All& all() { static All a; return a; }
}

void Tex::preload() {
    All& a = all();
    if (a.built) return;
    a.floor = buildTextureSet("floor", 1024, 5, false, floorTexel);
    a.wallCyan = buildTextureSet("wall", 1024, 5, true, [](float u, float v) { return wallTexel(u, v, V3(0.25f, 0.9f, 1.0f)); });
    a.pillar = buildTextureSet("pil", 512, 5, true, [](float u, float v) { return pillarTexel(u, v, V3(0.25f, 0.9f, 1.0f)); });
    a.crateOrange = buildTextureSet("co", 512, 5, false, [](float u, float v) { return crateTexel(u, v, V3(0.55f, 0.25f, 0.08f)); });
    a.crateTeal = buildTextureSet("ct", 512, 5, false, [](float u, float v) { return crateTexel(u, v, V3(0.09f, 0.29f, 0.32f)); });
    a.crateGrey = buildTextureSet("cg", 512, 5, false, [](float u, float v) { return crateTexel(u, v, V3(0.32f, 0.34f, 0.37f)); });
    a.plating = buildTextureSet("plating", 512, 4, false, platingTexel);
    a.tech = buildTextureSet("tech", 512, 5, true, techTexel);
    a.deck = buildTextureSet("deck", 1024, 4, false, deckTexel);
    a.padMark = makeTexture(proceduralImage(512, 512, false, [](float u, float v) {
        V2 p = V2(u - 0.5f, v - 0.5f) * 2;
        float r = simd_length(p);
        float an = std::atan2(p.y, p.x);
        float i = std::exp(-std::pow((r - 0.86f) / 0.022f, 2.f)) + 0.6f * std::exp(-std::pow((r - 0.80f) / 0.008f, 2.f));
        float dash = fract(an / (2 * PI) * 24) < 0.55f ? 1.f : 0.f;
        i += std::exp(-std::pow((r - 0.6f) / 0.016f, 2.f)) * dash * 0.8f;
        float cross = (std::fabs(p.x) < 0.025f && std::fabs(p.y) < 0.28f) || (std::fabs(p.y) < 0.025f && std::fabs(p.x) < 0.28f) ? 1.f : 0.f;
        i += cross * 0.9f;
        for (int k = 0; k < 4; k++) {
            float ang = k * PI / 2;
            V2 dir(std::cos(ang), std::sin(ang)), side(-dir.y, dir.x);
            float along = simd_dot(p, dir), across = std::fabs(simd_dot(p, side));
            float shape = along - 0.66f - across * 0.9f;
            if (along > 0.62f && along < 0.78f && across < 0.12f && std::fabs(shape) < 0.03f) i += 1;
        }
        float c = std::min(i, 1.2f);
        return V4(c, c, c, 1);
    }), true);
    a.glow = makeTexture(proceduralImage(128, 128, false, [](float u, float v) {
        float r = simd_length(V2(u - 0.5f, v - 0.5f)) * 2;
        float i = std::pow(std::max(1 - r, 0.f), 2.2f);
        return V4(i, i, i, 1);
    }), true);
    a.softDot = makeTexture(proceduralImage(64, 64, true, [](float u, float v) {
        float r = simd_length(V2(u - 0.5f, v - 0.5f)) * 2;
        return V4(1, 1, 1, std::pow(std::max(1 - r, 0.f), 1.6f));
    }), true);
    a.ring = makeTexture(proceduralImage(256, 256, false, [](float u, float v) {
        float r = simd_length(V2(u - 0.5f, v - 0.5f)) * 2;
        float d = (r - 0.82f) / 0.07f;
        float i = std::exp(-d * d) + 0.25f * std::pow(std::max(1 - r / 0.82f, 0.f), 0.5f) * (r < 0.82f ? 1.f : 0.f);
        return V4(i, i, i, 1);
    }), true);
    a.flare = makeTexture(proceduralImage(256, 256, false, [](float u, float v) {
        V2 p = V2(u - 0.5f, v - 0.5f) * 2;
        float r = simd_length(p);
        float an = std::atan2(p.y, p.x);
        float spikes = std::pow(std::fabs(std::cos(an * 2.5f + 0.4f)), 10.f) * 0.9f + std::pow(std::fabs(std::cos(an * 4 + 1.3f)), 24.f) * 0.5f;
        float core = std::pow(std::max(1 - r * 2.2f, 0.f), 2.f);
        float i = core * 1.4f + spikes * std::pow(std::max(1 - r, 0.f), 2.5f);
        return V4(i, i, i, 1);
    }), true);
    a.smoke = makeTexture(proceduralImage(128, 128, true, [](float u, float v) {
        float r = simd_length(V2(u - 0.5f, v - 0.5f)) * 2;
        float n = fbm(u, v, 4, 4, 91);
        float al = std::pow(std::max(1 - r, 0.f), 1.3f) * sstep(0.25f, 0.75f, n + 0.3f * (1 - r));
        return V4(1, 1, 1, al * 0.9f);
    }), true);
    a.shaft = makeTexture(proceduralImage(64, 256, false, [](float u, float v) {
        float side = std::sin(u * PI);
        float i = std::pow(1 - v, 1.8f) * (0.35f + 0.65f * side);
        return V4(i, i, i, 1);
    }), true);
    a.hex = makeTexture(proceduralImage(512, 512, false, [](float u, float v) {
        V2 p(u * 6, v * 6 * 1.1547f);
        float d = hexEdge(p);
        float line = sstep(0.07f, 0.0f, d);
        float id = fbm(u, v, 6, 2, 4);
        float i = line + 0.12f * id;
        return V4(i, i, i, 1);
    }), true);
    a.scan = makeTexture(proceduralImage(8, 256, false, [](float, float v) {
        float l = 0.55f + 0.45f * std::sin(v * 256 * 0.8f);
        return V4(l, l, l, 1);
    }), true);
    a.sky = makeTexture(makeSky(4096, 2048), true);
    a.env = makeEnv(a.envW, a.envH);
    a.built = true;
}

const TextureSet& Tex::floor() { return all().floor; }
const TextureSet& Tex::wallCyan() { return all().wallCyan; }
const TextureSet& Tex::pillar() { return all().pillar; }
const TextureSet& Tex::crateOrange() { return all().crateOrange; }
const TextureSet& Tex::crateTeal() { return all().crateTeal; }
const TextureSet& Tex::crateGrey() { return all().crateGrey; }
const TextureSet& Tex::plating() { return all().plating; }
const TextureSet& Tex::tech() { return all().tech; }
const TextureSet& Tex::deck() { return all().deck; }
TexRef Tex::padMark() { return all().padMark; }
TexRef Tex::glow() { return all().glow; }
TexRef Tex::softDot() { return all().softDot; }
TexRef Tex::ring() { return all().ring; }
TexRef Tex::flare() { return all().flare; }
TexRef Tex::smoke() { return all().smoke; }
TexRef Tex::shaft() { return all().shaft; }
TexRef Tex::hex() { return all().hex; }
TexRef Tex::scan() { return all().scan; }
TexRef Tex::sky() { return all().sky; }
const std::vector<V4>& Tex::envPixels() { return all().env; }
int Tex::envW() { return all().envW; }
int Tex::envH() { return all().envH; }
TexRef texGlow() { return all().glow; }

// MARK: - materials

MatRef Mat::pbr(const TextureSet& set, float ru, float rv, float emission) {
    static std::map<std::string, MatRef> cache;
    static std::mutex lock;
    char key[160];
    snprintf(key, sizeof key, "%s|%d|%d|%g", set.name.c_str(), (int)(ru * 100), (int)(rv * 100), emission);
    std::lock_guard<std::mutex> g(lock);
    auto it = cache.find(key);
    if (it != cache.end()) return it->second;
    auto m = std::make_shared<Material>();
    m->shade = Shade::PBR;
    m->albedo = set.albedo;
    m->normal = set.normal;
    m->roughMap = set.roughness;
    m->metalMap = set.metalness;
    m->uvScale = V2(ru, rv);
    if (set.emission) {
        m->emissionMap = set.emission;
        m->emission = V3(emission, emission, emission);
    }
    cache[key] = m;
    return m;
}

/// Flat coloured metal/paint with the shared plating normal map. Not cached (callers mutate it for hit flashes).
MatRef Mat::metal(V3 c, float rough, float metal, float plating) {
    auto m = std::make_shared<Material>();
    m->shade = Shade::PBR;
    m->diffuse = lin(c);
    m->metalness = metal;
    if (plating > 0) {
        const TextureSet& p = Tex::plating();
        m->normal = p.normal;
        m->normalIntensity = 0.8f;
        m->roughMap = p.roughness;
        m->roughMul = rough / 0.42f;
        m->uvScale = V2(plating, plating);
    } else {
        m->roughness = rough;
    }
    return m;
}
