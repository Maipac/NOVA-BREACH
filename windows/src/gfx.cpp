// Resources, primitives, node tree, actions, particles and PNG output for the SceneKit-like layer.
#include "gfx.h"
#include <cstring>
#include <cstdio>
#include <map>

namespace GFX {
ID3D11Device* device = nullptr;
ID3D11DeviceContext* ctx = nullptr;
}
using namespace GFX;

template <class T> static void safeRelease(T*& p) { if (p) { p->Release(); p = nullptr; } }

// MARK: - textures

Texture::~Texture() { safeRelease(srv); safeRelease(tex); }

static void downsample(const Image& src, Image& dst) {
    dst.w = std::max(1, src.w / 2);
    dst.h = std::max(1, src.h / 2);
    dst.channels = src.channels;
    dst.px.assign((size_t)dst.w * dst.h * dst.channels, 0);
    int c = src.channels;
    for (int y = 0; y < dst.h; y++)
        for (int x = 0; x < dst.w; x++)
            for (int k = 0; k < c; k++) {
                int x0 = std::min(x * 2, src.w - 1), x1 = std::min(x * 2 + 1, src.w - 1);
                int y0 = std::min(y * 2, src.h - 1), y1 = std::min(y * 2 + 1, src.h - 1);
                int s = src.px[((size_t)y0 * src.w + x0) * c + k] + src.px[((size_t)y0 * src.w + x1) * c + k] +
                        src.px[((size_t)y1 * src.w + x0) * c + k] + src.px[((size_t)y1 * src.w + x1) * c + k];
                dst.px[((size_t)y * dst.w + x) * c + k] = (uint8_t)((s + 2) / 4);
            }
}

TexRef makeTexture(const Image& img, bool srgb, bool mips) {
    auto t = std::make_shared<Texture>();
    t->w = img.w; t->h = img.h;
    std::vector<Image> levels;
    levels.push_back(img);
    if (mips) {
        while (levels.back().w > 1 || levels.back().h > 1) {
            Image d;
            downsample(levels.back(), d);
            levels.push_back(std::move(d));
        }
    }
    D3D11_TEXTURE2D_DESC td{};
    td.Width = img.w; td.Height = img.h;
    td.MipLevels = (UINT)levels.size();
    td.ArraySize = 1;
    td.Format = img.channels == 1 ? DXGI_FORMAT_R8_UNORM : (srgb ? DXGI_FORMAT_R8G8B8A8_UNORM_SRGB : DXGI_FORMAT_R8G8B8A8_UNORM);
    td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_IMMUTABLE;
    td.BindFlags = D3D11_BIND_SHADER_RESOURCE;
    std::vector<D3D11_SUBRESOURCE_DATA> init(levels.size());
    for (size_t i = 0; i < levels.size(); i++) {
        init[i].pSysMem = levels[i].px.data();
        init[i].SysMemPitch = levels[i].w * img.channels;
    }
    if (FAILED(device->CreateTexture2D(&td, init.data(), &t->tex))) return nullptr;
    device->CreateShaderResourceView(t->tex, nullptr, &t->srv);
    return t;
}

TexRef makeTextureFloat(int w, int h, const std::vector<V4>& mip0, int mipLevels, const std::vector<std::vector<V4>>* mipData) {
    auto t = std::make_shared<Texture>();
    t->w = w; t->h = h;
    D3D11_TEXTURE2D_DESC td{};
    td.Width = w; td.Height = h;
    td.MipLevels = mipLevels;
    td.ArraySize = 1;
    td.Format = DXGI_FORMAT_R32G32B32A32_FLOAT;
    td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_IMMUTABLE;
    td.BindFlags = D3D11_BIND_SHADER_RESOURCE;
    std::vector<D3D11_SUBRESOURCE_DATA> init(mipLevels);
    int lw = w;
    for (int i = 0; i < mipLevels; i++) {
        init[i].pSysMem = i == 0 ? mip0.data() : (*mipData)[i - 1].data();
        init[i].SysMemPitch = lw * sizeof(V4);
        lw = std::max(1, lw / 2);
    }
    if (FAILED(device->CreateTexture2D(&td, init.data(), &t->tex))) return nullptr;
    device->CreateShaderResourceView(t->tex, nullptr, &t->srv);
    return t;
}

// MARK: - meshes

Mesh::~Mesh() { safeRelease(vb); safeRelease(ib); }

static void computeTangents(std::vector<Vertex>& v, const std::vector<uint32_t>& idx) {
    std::vector<V3> tan(v.size()), bit(v.size());
    for (size_t i = 0; i + 2 < idx.size(); i += 3) {
        uint32_t a = idx[i], b = idx[i + 1], c = idx[i + 2];
        V3 e1 = v[b].p - v[a].p, e2 = v[c].p - v[a].p;
        V2 d1 = v[b].uv - v[a].uv, d2 = v[c].uv - v[a].uv;
        float r = d1.x * d2.y - d2.x * d1.y;
        if (std::fabs(r) < 1e-12f) continue;
        r = 1.0f / r;
        V3 t = (e1 * d2.y - e2 * d1.y) * r;
        V3 bb = (e2 * d1.x - e1 * d2.x) * r;
        for (uint32_t k : {a, b, c}) { tan[k] += t; bit[k] += bb; }
    }
    for (size_t i = 0; i < v.size(); i++) {
        V3 n = v[i].n;
        V3 t = tan[i] - n * simd_dot(n, tan[i]);
        if (simd_length(t) < 1e-6f) t = std::fabs(n.y) < 0.9f ? simd_cross(V3(0, 1, 0), n) : simd_cross(V3(1, 0, 0), n);
        t = simd_normalize(t);
        float w = simd_dot(simd_cross(n, t), bit[i]) < 0 ? -1.f : 1.f;
        v[i].t = V4(t, w);
    }
}

MeshRef makeMesh(std::vector<Vertex>& v, const std::vector<uint32_t>& idx, std::vector<std::pair<uint32_t, uint32_t>> subs) {
    computeTangents(v, idx);
    auto m = std::make_shared<Mesh>();
    m->indexCount = (uint32_t)idx.size();
    m->subs = subs.empty() ? std::vector<std::pair<uint32_t, uint32_t>>{{0, m->indexCount}} : subs;
    V3 lo(1e9f, 1e9f, 1e9f), hi(-1e9f, -1e9f, -1e9f);
    float rad = 0;
    for (auto& x : v) {
        lo = V3(std::min(lo.x, x.p.x), std::min(lo.y, x.p.y), std::min(lo.z, x.p.z));
        hi = V3(std::max(hi.x, x.p.x), std::max(hi.y, x.p.y), std::max(hi.z, x.p.z));
        rad = std::max(rad, simd_length(x.p));
    }
    m->bmin = lo; m->bmax = hi; m->radius = rad;
    if (v.empty() || idx.empty()) return m;
    D3D11_BUFFER_DESC bd{};
    bd.ByteWidth = (UINT)(v.size() * sizeof(Vertex));
    bd.Usage = D3D11_USAGE_IMMUTABLE;
    bd.BindFlags = D3D11_BIND_VERTEX_BUFFER;
    D3D11_SUBRESOURCE_DATA sd{v.data()};
    device->CreateBuffer(&bd, &sd, &m->vb);
    bd.ByteWidth = (UINT)(idx.size() * sizeof(uint32_t));
    bd.BindFlags = D3D11_BIND_INDEX_BUFFER;
    sd.pSysMem = idx.data();
    device->CreateBuffer(&bd, &sd, &m->ib);
    return m;
}

namespace Geo {

/// SCNBox: six faces (front +Z, right +X, back -Z, left -X, top +Y, bottom -Y), each its own material slot.
/// Chamfered edges are rounded like SceneKit's: every face grid gets extra rows near its borders that are
/// pushed onto a sphere of radius `chamfer` around the inner box.
static MeshRef build_box(float w, float h, float l, float chamfer) {
    V3 half(w / 2, h / 2, l / 2);
    float r = std::min(chamfer, std::min(half.x, std::min(half.y, half.z)) * 0.999f);
    V3 inner = half - V3(r, r, r);
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    std::vector<std::pair<uint32_t, uint32_t>> subs;
    // face: normal, u axis, v axis (v points down the texture)
    struct F { V3 n, u, vv; };
    const F faces[6] = {
        {V3(0, 0, 1), V3(1, 0, 0), V3(0, -1, 0)},  {V3(1, 0, 0), V3(0, 0, -1), V3(0, -1, 0)},
        {V3(0, 0, -1), V3(-1, 0, 0), V3(0, -1, 0)}, {V3(-1, 0, 0), V3(0, 0, 1), V3(0, -1, 0)},
        {V3(0, 1, 0), V3(1, 0, 0), V3(0, 0, 1)},    {V3(0, -1, 0), V3(1, 0, 0), V3(0, 0, -1)},
    };
    auto comp = [](V3 a, V3 axis) { return std::fabs(simd_dot(a, axis)); };
    for (auto& f : faces) {
        uint32_t start = (uint32_t)idx.size();
        float hu = comp(half, f.u), hv = comp(half, f.vv), hn = comp(half, f.n);
        float iu = comp(inner, f.u), iv = comp(inner, f.vv);
        auto coords = [&](float hh, float ii) {
            std::vector<float> c;
            if (r <= 1e-5f) return std::vector<float>{-hh, hh};
            float t1 = std::tan(PI / 8) * r;
            c = {-hh, -(ii + t1), -ii, ii, ii + t1, hh};
            return c;
        };
        std::vector<float> cu = coords(hu, iu), cv = coords(hv, iv);
        uint32_t base = (uint32_t)v.size();
        for (size_t j = 0; j < cv.size(); j++)
            for (size_t i = 0; i < cu.size(); i++) {
                V3 p = f.n * hn + f.u * cu[i] + f.vv * cv[j];
                Vertex vx;
                if (r > 1e-5f) {
                    V3 c(clampf(p.x, -inner.x, inner.x), clampf(p.y, -inner.y, inner.y), clampf(p.z, -inner.z, inner.z));
                    V3 d = p - c;
                    V3 nn = simd_length(d) > 1e-6f ? simd_normalize(d) : f.n;
                    vx.p = c + nn * r;
                    vx.n = nn;
                } else {
                    vx.p = p;
                    vx.n = f.n;
                }
                vx.uv = V2((cu[i] + hu) / (2 * hu), (cv[j] + hv) / (2 * hv));
                v.push_back(vx);
            }
        uint32_t nu = (uint32_t)cu.size();
        for (uint32_t j = 0; j + 1 < cv.size(); j++)
            for (uint32_t i = 0; i + 1 < nu; i++) {
                uint32_t a = base + j * nu + i, b = a + 1, c = a + nu, d = c + 1;
                // counter-clockwise seen from outside
                idx.insert(idx.end(), {a, c, b, b, c, d});
            }
        subs.push_back({start, (uint32_t)idx.size() - start});
    }
    // make winding consistent: flip triangles whose geometric normal opposes the vertex normal
    for (size_t k = 0; k + 2 < idx.size(); k += 3) {
        V3 a = v[idx[k]].p, b = v[idx[k + 1]].p, c = v[idx[k + 2]].p;
        V3 gn = simd_cross(b - a, c - a);
        V3 nn = v[idx[k]].n + v[idx[k + 1]].n + v[idx[k + 2]].n;
        if (simd_dot(gn, nn) < 0) std::swap(idx[k + 1], idx[k + 2]);
    }
    return makeMesh(v, idx, subs);
}

static MeshRef build_sphere(float r, int segments) {
    int lon = std::max(8, segments), lat = std::max(4, segments / 2);
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    for (int j = 0; j <= lat; j++) {
        float th = PI * j / lat;
        for (int i = 0; i <= lon; i++) {
            float ph = 2 * PI * i / lon;
            V3 n(std::sin(th) * std::sin(ph), std::cos(th), std::sin(th) * std::cos(ph));
            Vertex x; x.p = n * r; x.n = n; x.uv = V2((float)i / lon, (float)j / lat);
            v.push_back(x);
        }
    }
    for (int j = 0; j < lat; j++)
        for (int i = 0; i < lon; i++) {
            uint32_t a = j * (lon + 1) + i, b = a + 1, c = a + lon + 1, d = c + 1;
            idx.insert(idx.end(), {a, c, b, b, c, d});
        }
    return makeMesh(v, idx);
}

/// shared lathe for cylinders, cones and capsules: profile points (radius, y) from top to bottom
static void lathe(std::vector<Vertex>& v, std::vector<uint32_t>& idx, const std::vector<V2>& prof, const std::vector<V2>& normals, int seg, float vTop, float vBottom) {
    uint32_t base = (uint32_t)v.size();
    for (size_t j = 0; j < prof.size(); j++) {
        for (int i = 0; i <= seg; i++) {
            float ph = 2 * PI * i / seg;
            float s = std::sin(ph), c = std::cos(ph);
            Vertex x;
            x.p = V3(prof[j].x * s, prof[j].y, prof[j].x * c);
            x.n = simd_normalize(V3(normals[j].x * s, normals[j].y, normals[j].x * c));
            x.uv = V2((float)i / seg, prof.size() > 1 ? mixf(vTop, vBottom, (float)j / (prof.size() - 1)) : vTop);
            v.push_back(x);
        }
    }
    for (uint32_t j = 0; j + 1 < prof.size(); j++)
        for (int i = 0; i < seg; i++) {
            uint32_t a = base + j * (seg + 1) + i, b = a + 1, c = a + seg + 1, d = c + 1;
            idx.insert(idx.end(), {a, c, b, b, c, d});
        }
}

static void cap(std::vector<Vertex>& v, std::vector<uint32_t>& idx, float r, float y, bool up, int seg) {
    if (r <= 1e-5f) return;
    uint32_t base = (uint32_t)v.size();
    Vertex c; c.p = V3(0, y, 0); c.n = V3(0, up ? 1.f : -1.f, 0); c.uv = V2(0.5f, 0.5f);
    v.push_back(c);
    for (int i = 0; i <= seg; i++) {
        float ph = 2 * PI * i / seg;
        Vertex x; x.p = V3(r * std::sin(ph), y, r * std::cos(ph)); x.n = c.n;
        x.uv = V2(0.5f + 0.5f * std::sin(ph), 0.5f + (up ? -0.5f : 0.5f) * std::cos(ph));
        v.push_back(x);
    }
    for (int i = 0; i < seg; i++) {
        uint32_t a = base + 1 + i, b = a + 1;
        if (up) idx.insert(idx.end(), {base, a, b}); else idx.insert(idx.end(), {base, b, a});
    }
}

static MeshRef build_cyl(float r, float h, int segments) {
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    lathe(v, idx, {V2(r, h / 2), V2(r, -h / 2)}, {V2(1, 0), V2(1, 0)}, segments, 0, 1);
    cap(v, idx, r, h / 2, true, segments);
    cap(v, idx, r, -h / 2, false, segments);
    return makeMesh(v, idx);
}

static MeshRef build_cone(float top, float bottom, float h, int segments) {
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    float slope = (bottom - top) / h;
    V2 n = simd_normalize(V2(1, slope));
    lathe(v, idx, {V2(top, h / 2), V2(bottom, -h / 2)}, {n, n}, segments, 0, 1);
    cap(v, idx, top, h / 2, true, segments);
    cap(v, idx, bottom, -h / 2, false, segments);
    return makeMesh(v, idx);
}

static MeshRef build_capsule(float r, float h) {
    int seg = 16, capSeg = 8;
    std::vector<V2> prof, nrm;
    float body = std::max(0.f, h / 2 - r);
    for (int i = 0; i <= capSeg; i++) {
        float a = (PI / 2) * i / capSeg;
        prof.push_back(V2(r * std::sin(a), body + r * std::cos(a)));
        nrm.push_back(V2(std::sin(a), std::cos(a)));
    }
    for (int i = 0; i <= capSeg; i++) {
        float a = PI / 2 + (PI / 2) * i / capSeg;
        prof.push_back(V2(r * std::sin(a), -body + r * std::cos(a)));
        nrm.push_back(V2(std::sin(a), std::cos(a)));
    }
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    lathe(v, idx, prof, nrm, seg, 0, 1);
    return makeMesh(v, idx);
}

/// SCNTorus lies in the XZ plane around the Y axis.
static MeshRef build_torus(float ring, float pipe) {
    int rs = 48, ps = 12;
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    for (int i = 0; i <= rs; i++) {
        float a = 2 * PI * i / rs;
        V3 c(std::sin(a) * ring, 0, std::cos(a) * ring);
        V3 out(std::sin(a), 0, std::cos(a));
        for (int j = 0; j <= ps; j++) {
            float b = 2 * PI * j / ps;
            V3 n = out * std::cos(b) + V3(0, 1, 0) * std::sin(b);
            Vertex x; x.p = c + n * pipe; x.n = n; x.uv = V2((float)i / rs, (float)j / ps);
            v.push_back(x);
        }
    }
    for (int i = 0; i < rs; i++)
        for (int j = 0; j < ps; j++) {
            uint32_t a = i * (ps + 1) + j, b = a + 1, c = a + ps + 1, d = c + 1;
            idx.insert(idx.end(), {a, b, c, b, d, c});
        }
    // fix winding against the normals
    for (size_t k = 0; k + 2 < idx.size(); k += 3) {
        V3 gn = simd_cross(v[idx[k + 1]].p - v[idx[k]].p, v[idx[k + 2]].p - v[idx[k]].p);
        if (simd_dot(gn, v[idx[k]].n) < 0) std::swap(idx[k + 1], idx[k + 2]);
    }
    return makeMesh(v, idx);
}

/// SCNPlane: XY plane facing +Z, v = 0 at the top.
static MeshRef build_plane(float w, float h) {
    std::vector<Vertex> v(4);
    v[0].p = V3(-w / 2, h / 2, 0); v[0].uv = V2(0, 0);
    v[1].p = V3(w / 2, h / 2, 0); v[1].uv = V2(1, 0);
    v[2].p = V3(-w / 2, -h / 2, 0); v[2].uv = V2(0, 1);
    v[3].p = V3(w / 2, -h / 2, 0); v[3].uv = V2(1, 1);
    for (auto& x : v) x.n = V3(0, 0, 1);
    return makeMesh(v, {0, 2, 1, 1, 2, 3});
}

/// SCNPyramid: base w x l on y = 0, apex at y = h.
static MeshRef build_pyramid(float w, float h, float l) {
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;
    V3 apex(0, h, 0);
    V3 c[4] = {V3(-w / 2, 0, l / 2), V3(w / 2, 0, l / 2), V3(w / 2, 0, -l / 2), V3(-w / 2, 0, -l / 2)};
    for (int i = 0; i < 4; i++) {
        V3 a = c[i], b = c[(i + 1) % 4];
        V3 n = simd_normalize(simd_cross(b - a, apex - a));
        uint32_t base = (uint32_t)v.size();
        Vertex x0, x1, x2;
        x0.p = a; x1.p = b; x2.p = apex;
        x0.uv = V2(0, 1); x1.uv = V2(1, 1); x2.uv = V2(0.5f, 0);
        x0.n = x1.n = x2.n = n;
        v.insert(v.end(), {x0, x1, x2});
        idx.insert(idx.end(), {base, base + 1, base + 2});
    }
    uint32_t base = (uint32_t)v.size();
    for (int i = 0; i < 4; i++) {
        Vertex x; x.p = c[i]; x.n = V3(0, -1, 0); x.uv = V2(i == 1 || i == 2 ? 1.f : 0.f, i >= 2 ? 1.f : 0.f);
        v.push_back(x);
    }
    idx.insert(idx.end(), {base, base + 2, base + 1, base, base + 3, base + 2});
    for (size_t k = 0; k + 2 < idx.size(); k += 3) {
        V3 gn = simd_cross(v[idx[k + 1]].p - v[idx[k]].p, v[idx[k + 2]].p - v[idx[k]].p);
        if (simd_dot(gn, v[idx[k]].n) < 0) std::swap(idx[k + 1], idx[k + 2]);
    }
    return makeMesh(v, idx);
}


// meshes are immutable, so identical primitives are shared (enemy parts, sprites, effects)
static std::map<std::string, MeshRef>& meshCache() { static std::map<std::string, MeshRef> c; return c; }
static MeshRef cached(const char* kind, std::initializer_list<float> args, const std::function<MeshRef()>& build) {
    std::string key = kind;
    char b[32];
    for (float a : args) { snprintf(b, sizeof b, "|%.5g", a); key += b; }
    auto& c = meshCache();
    auto it = c.find(key);
    if (it != c.end()) return it->second;
    MeshRef m = build();
    c[key] = m;
    return m;
}
MeshRef box(float w, float h, float l, float chamfer) { return cached("box", {w, h, l, chamfer}, [=] { return build_box(w, h, l, chamfer); }); }
MeshRef sphere(float r, int seg) { return cached("sph", {r, (float)seg}, [=] { return build_sphere(r, seg); }); }
MeshRef cyl(float r, float h, int seg) { return cached("cyl", {r, h, (float)seg}, [=] { return build_cyl(r, h, seg); }); }
MeshRef cone(float t, float b, float h, int seg) { return cached("cone", {t, b, h, (float)seg}, [=] { return build_cone(t, b, h, seg); }); }
MeshRef capsule(float r, float h) { return cached("cap", {r, h}, [=] { return build_capsule(r, h); }); }
MeshRef torus(float ring, float pipe) { return cached("tor", {ring, pipe}, [=] { return build_torus(ring, pipe); }); }
MeshRef plane(float w, float h) { return cached("pl", {w, h}, [=] { return build_plane(w, h); }); }
MeshRef pyramid(float w, float h, float l) { return cached("pyr", {w, h, l}, [=] { return build_pyramid(w, h, l); }); }

MeshRef floorPlane() {
    const float S = 600;
    std::vector<Vertex> v(4);
    V3 ps[4] = {V3(-S, 0, -S), V3(S, 0, -S), V3(-S, 0, S), V3(S, 0, S)};
    for (int i = 0; i < 4; i++) { v[i].p = ps[i]; v[i].n = V3(0, 1, 0); v[i].uv = V2(ps[i].x, ps[i].z); }
    return makeMesh(v, {0, 2, 1, 1, 2, 3});
}

NodeRef part(const NodeRef& parent, MeshRef g, MatRef m, V3 pos, V3 rot, bool shadow) {
    auto n = Node::make(g, m);
    n->position = pos;
    if (rot != V3(0, 0, 0)) n->setEuler(rot);
    n->castsShadow = shadow;
    parent->add(n);
    return n;
}

NodeRef glowSprite(float size, V3 c, float intensity, TexRef image);
} // namespace Geo

// glowSprite needs the default glow texture, which lives in textures.cpp
TexRef texGlow();
NodeRef Geo::glowSprite(float size, V3 c, float intensity, TexRef image) {
    auto n = Node::make();
    n->billboard = true;
    n->castsShadow = false;
    auto quad = Node::make(plane(1, 1), Mat::additive(image ? image : texGlow(), c, intensity));
    quad->scale = V3(size, size, 1);
    quad->castsShadow = false;
    n->add(quad);
    return n;
}

void orientZ(Node& node, V3 dir) {
    V3 d = safeNorm(dir);
    if (d.z < -0.9999f) node.orientation = Quat::angleAxis(PI, V3(0, 1, 0));
    else node.orientation = Quat::fromTo(V3(0, 0, 1), d);
}

M4 transformY(V3 dir, V3 pos) {
    V3 d = safeNorm(dir, V3(0, 1, 0));
    Quat q = d.y < -0.9999f ? Quat::angleAxis(PI, V3(1, 0, 0)) : Quat::fromTo(V3(0, 1, 0), d);
    return M4::trs(pos, q, V3(1, 1, 1));
}

// MARK: - materials

namespace Mat {
MatRef glow(V3 srgb, float intensity) {
    auto m = std::make_shared<Material>();
    m->shade = Shade::Glow;
    m->color = lin(srgb) * intensity;
    return m;
}
MatRef additive(TexRef image, V3 srgb, float intensity, bool depthTest) {
    auto m = std::make_shared<Material>();
    m->shade = Shade::Additive;
    m->blend = Blend::Add;
    m->spriteTex = image;
    m->color = lin(srgb) * intensity;
    m->doubleSided = true;
    m->depthWrite = false;
    m->depthTest = depthTest;
    return m;
}
} // namespace Mat

// MARK: - nodes

void Node::add(const NodeRef& c) {
    if (c->parent) c->removeFromParent();
    c->parent = this;
    children.push_back(c);
}

void Node::removeFromParent() {
    if (!parent) return;
    Node* p = parent;
    parent = nullptr;
    auto& ch = p->children;
    for (size_t i = 0; i < ch.size(); i++)
        if (ch[i].get() == this) { ch.erase(ch.begin() + i); break; }
}

void Node::removeAllChildren() {
    for (auto& c : children) c->parent = nullptr;
    children.clear();
}

M4 Node::worldMatrix() const {
    M4 m = localMatrix();
    for (const Node* p = parent; p; p = p->parent) m = p->localMatrix() * m;
    return m;
}

V3 Node::convertPosition(V3 p, const Node* from) const {
    V3 w = from ? from->worldMatrix().point(p) : p;
    return worldMatrix().inverse().point(w);
}

void Node::lookAt(V3 target, V3 up) {
    M4 parentW = parent ? parent->worldMatrix() : M4();
    V3 wp = parentW.point(position);
    V3 f = simd_normalize(target - wp);
    if (std::fabs(simd_dot(f, up)) > 0.999f) up = V3(0, 0, 1);
    V3 s = simd_normalize(simd_cross(f, up));
    V3 u = simd_cross(s, f);
    // rotation whose columns are (s, u, -f)
    M4 r;
    r.at(0, 0) = s.x; r.at(1, 0) = s.y; r.at(2, 0) = s.z;
    r.at(0, 1) = u.x; r.at(1, 1) = u.y; r.at(2, 1) = u.z;
    r.at(0, 2) = -f.x; r.at(1, 2) = -f.y; r.at(2, 2) = -f.z;
    float tr = r.at(0, 0) + r.at(1, 1) + r.at(2, 2);
    Quat q;
    if (tr > 0) {
        float S = std::sqrt(tr + 1) * 2;
        q = Quat((r.at(2, 1) - r.at(1, 2)) / S, (r.at(0, 2) - r.at(2, 0)) / S, (r.at(1, 0) - r.at(0, 1)) / S, 0.25f * S);
    } else if (r.at(0, 0) > r.at(1, 1) && r.at(0, 0) > r.at(2, 2)) {
        float S = std::sqrt(1 + r.at(0, 0) - r.at(1, 1) - r.at(2, 2)) * 2;
        q = Quat(0.25f * S, (r.at(0, 1) + r.at(1, 0)) / S, (r.at(0, 2) + r.at(2, 0)) / S, (r.at(2, 1) - r.at(1, 2)) / S);
    } else if (r.at(1, 1) > r.at(2, 2)) {
        float S = std::sqrt(1 + r.at(1, 1) - r.at(0, 0) - r.at(2, 2)) * 2;
        q = Quat((r.at(0, 1) + r.at(1, 0)) / S, 0.25f * S, (r.at(1, 2) + r.at(2, 1)) / S, (r.at(0, 2) - r.at(2, 0)) / S);
    } else {
        float S = std::sqrt(1 + r.at(2, 2) - r.at(0, 0) - r.at(1, 1)) * 2;
        q = Quat((r.at(0, 2) + r.at(2, 0)) / S, (r.at(1, 2) + r.at(2, 1)) / S, 0.25f * S, (r.at(1, 0) - r.at(0, 1)) / S);
    }
    orientation = q; // parents of looked-at nodes are unrotated (scene root / level root)
}

NodeRef Node::childNamed(const std::string& n) const {
    for (auto& c : children) if (c->name == n) return c;
    return nullptr;
}

void Node::enumerate(const std::function<void(Node&)>& f) {
    f(*this);
    auto copy = children;
    for (auto& c : copy) c->enumerate(f);
}

bool Node::inTree(const Node* root) const {
    const Node* p = this;
    while (p) { if (p == root) return true; p = p->parent; }
    return false;
}

void Node::runAction(ActionRef a, std::function<void()> completion) { actions.push_back({a->clone(), completion}); }

void Node::updateActions(float dt) {
    if (actions.empty()) return;
    auto self = shared_from_this(); // a remove action may drop the last reference
    for (size_t i = 0; i < actions.size();) {
        auto a = actions[i].first;
        float left = a->step(*this, dt);
        if (left >= 0) {
            auto done = actions[i].second;
            if (i < actions.size() && actions[i].first == a) actions.erase(actions.begin() + i);
            if (done) done();
        } else {
            i++;
        }
    }
}

// MARK: - actions

static float ease(Timing t, float k) {
    switch (t) {
    case Timing::Linear: return k;
    case Timing::EaseIn: return k * k;
    case Timing::EaseOut: return 1 - (1 - k) * (1 - k);
    case Timing::EaseInOut: return k * k * (3 - 2 * k);
    }
    return k;
}

namespace {
struct Interp : Action {
    float t = 0;
    bool started = false;
    float step(Node& n, float dt) override {
        if (!started) { started = true; begin(n); }
        t += dt;
        float k = duration > 0 ? clampf(t / duration, 0, 1) : 1;
        apply(n, ease(timing, k));
        return t >= duration ? t - duration : -1;
    }
    virtual void begin(Node&) {}
    virtual void apply(Node&, float k) = 0;
};
struct Wait : Interp {
    ActionRef clone() const override { auto c = std::make_shared<Wait>(); c->duration = duration; return c; }
    void apply(Node&, float) override {}
};
struct FadeTo : Interp {
    float to = 0, from = 1;
    ActionRef clone() const override { auto c = std::make_shared<FadeTo>(); c->duration = duration; c->to = to; c->timing = timing; return c; }
    void begin(Node& n) override { from = n.opacity; }
    void apply(Node& n, float k) override { n.opacity = mixf(from, to, k); }
};
struct ScaleTo : Interp {
    float to = 1;
    V3 from;
    ActionRef clone() const override { auto c = std::make_shared<ScaleTo>(); c->duration = duration; c->to = to; c->timing = timing; return c; }
    void begin(Node& n) override { from = n.scale; }
    void apply(Node& n, float k) override { n.scale = mix3(from, V3(to, to, to), k); }
};
struct RotateBy : Interp {
    V3 by;
    float done = 0;
    ActionRef clone() const override { auto c = std::make_shared<RotateBy>(); c->duration = duration; c->by = by; return c; }
    void apply(Node& n, float k) override { n.setEuler(n.euler + by * (k - done)); done = k; }
};
struct Custom : Interp {
    std::function<void(Node&, float)> f;
    ActionRef clone() const override { auto c = std::make_shared<Custom>(); c->duration = duration; c->f = f; return c; }
    void apply(Node& n, float k) override { f(n, k * duration); }
};
struct RunBlock : Action {
    std::function<void(Node&)> f;
    ActionRef clone() const override { auto c = std::make_shared<RunBlock>(); c->f = f; return c; }
    float step(Node& n, float dt) override { f(n); return dt; }
};
struct Remove : Action {
    ActionRef clone() const override { return std::make_shared<Remove>(); }
    float step(Node& n, float dt) override { n.removeFromParent(); return dt; }
};
struct Sequence : Action {
    std::vector<ActionRef> list;
    size_t cur = 0;
    ActionRef clone() const override {
        auto c = std::make_shared<Sequence>();
        for (auto& a : list) c->list.push_back(a->clone());
        c->duration = duration;
        return c;
    }
    float step(Node& n, float dt) override {
        while (cur < list.size()) {
            float left = list[cur]->step(n, dt);
            if (left < 0) return -1;
            cur++;
            dt = left;
        }
        return dt;
    }
};
struct Group : Action {
    std::vector<ActionRef> list;
    std::vector<bool> done;
    ActionRef clone() const override {
        auto c = std::make_shared<Group>();
        for (auto& a : list) c->list.push_back(a->clone());
        return c;
    }
    float step(Node& n, float dt) override {
        if (done.empty()) done.assign(list.size(), false);
        float minLeft = 1e9f;
        bool all = true;
        for (size_t i = 0; i < list.size(); i++) {
            if (done[i]) continue;
            float left = list[i]->step(n, dt);
            if (left < 0) all = false; else { done[i] = true; minLeft = std::min(minLeft, left); }
        }
        return all ? (minLeft == 1e9f ? 0 : minLeft) : -1;
    }
};
struct Forever : Action {
    ActionRef proto, cur;
    ActionRef clone() const override { auto c = std::make_shared<Forever>(); c->proto = proto; return c; }
    float step(Node& n, float dt) override {
        for (int guard = 0; guard < 8; guard++) {
            if (!cur) cur = proto->clone();
            float left = cur->step(n, dt);
            if (left < 0) return -1;
            cur = nullptr;
            dt = left;
            if (dt <= 0) return -1;
        }
        return -1;
    }
};
} // namespace

namespace Act {
ActionRef wait(float d) { auto a = std::make_shared<Wait>(); a->duration = d; return a; }
ActionRef sequence(std::vector<ActionRef> l) { auto a = std::make_shared<Sequence>(); a->list = std::move(l); return a; }
ActionRef group(std::vector<ActionRef> l) { auto a = std::make_shared<Group>(); a->list = std::move(l); return a; }
ActionRef repeatForever(ActionRef x) { auto a = std::make_shared<Forever>(); a->proto = x; return a; }
ActionRef fadeOut(float d) { auto a = std::make_shared<FadeTo>(); a->duration = d; a->to = 0; return a; }
ActionRef fadeIn(float d) { auto a = std::make_shared<FadeTo>(); a->duration = d; a->to = 1; return a; }
ActionRef fadeOpacity(float to, float d) { auto a = std::make_shared<FadeTo>(); a->duration = d; a->to = to; return a; }
ActionRef scaleTo(float s, float d, Timing t) { auto a = std::make_shared<ScaleTo>(); a->duration = d; a->to = s; a->timing = t; return a; }
ActionRef rotateBy(V3 e, float d) { auto a = std::make_shared<RotateBy>(); a->duration = d; a->by = e; return a; }
ActionRef removeFromParent() { return std::make_shared<Remove>(); }
ActionRef run(std::function<void(Node&)> f) { auto a = std::make_shared<RunBlock>(); a->f = std::move(f); return a; }
ActionRef custom(float d, std::function<void(Node&, float)> f) { auto a = std::make_shared<Custom>(); a->duration = d; a->f = std::move(f); return a; }
} // namespace Act

// MARK: - particles

float Curve::eval(float t) const {
    if (values.empty()) return 1;
    if (t <= keys.front()) return values.front();
    for (size_t i = 1; i < keys.size(); i++)
        if (t <= keys[i]) {
            float k = (t - keys[i - 1]) / std::max(1e-5f, keys[i] - keys[i - 1]);
            return mixf(values[i - 1], values[i], k);
        }
    return values.back();
}

void Scene::addParticleSystem(const ParticleSystem& s, const M4& transform) {
    auto e = std::make_shared<Emitter>();
    e->sys = s;
    e->transform = transform;
    emitters.push_back(e);
}

void Scene::attachParticleSystem(const NodeRef& n, const ParticleSystem& s) {
    auto e = std::make_shared<Emitter>();
    e->sys = s;
    e->node = n;
    e->attached = true;
    emitters.push_back(e);
    // warm up looping systems (dust) so the air is full from the first frame
    if (s.warmup > 0) {
        e->transform = n->worldMatrix();
        float t = 0;
        extern void stepEmitter(Scene&, Emitter&, float);
        while (t < s.warmup) { stepEmitter(*this, *e, 0.1f); t += 0.1f; }
    }
}

static V3 randomCone(V3 dir, float halfAngleDeg) {
    V3 d = safeNorm(dir, V3(0, 1, 0));
    if (halfAngleDeg >= 179.9f) return randUnit();
    float a = halfAngleDeg * PI / 180;
    float cosA = std::cos(a);
    float z = frand(cosA, 1);
    float phi = frand(0, 2 * PI);
    float s = std::sqrt(std::max(0.f, 1 - z * z));
    V3 local(s * std::cos(phi), s * std::sin(phi), z);
    // basis around d
    V3 t = std::fabs(d.y) < 0.9f ? simd_normalize(simd_cross(V3(0, 1, 0), d)) : simd_normalize(simd_cross(V3(1, 0, 0), d));
    V3 b = simd_cross(d, t);
    return t * local.x + b * local.y + d * local.z;
}

void stepEmitter(Scene& scene, Emitter& e, float dt) {
    const ParticleSystem& s = e.sys;
    // spawn: a one-shot burst emits exactly birthRate particles, looping systems birthRate per second
    int n = 0;
    if (!s.loops) {
        if (e.age == 0) n = std::max(1, (int)std::lround(s.birthRate));
    } else if (s.birthRate > 0) {
        e.accum += s.birthRate * dt;
        n = (int)e.accum;
        e.accum -= n;
    }
    n = std::min(n, 600);
    for (int i = 0; i < n; i++) {
        Particle p;
        V3 local(0, 0, 0);
        if (s.shape == EmitterShape::Box) {
            local = V3(frand(-0.5f, 0.5f) * s.shapeSize.x, frand(-0.5f, 0.5f) * s.shapeSize.y, frand(-0.5f, 0.5f) * s.shapeSize.z);
        } else if (s.shape == EmitterShape::Cylinder) {
            float a = frand(0, 2 * PI), r = s.shapeSize.x * (s.volume ? std::sqrt(frand()) : 1.f);
            local = V3(std::cos(a) * r, frand(-0.5f, 0.5f) * s.shapeSize.y, std::sin(a) * r);
        }
        p.p = e.transform.point(local);
        V3 dir = e.transform.dir(randomCone(s.emittingDirection, s.spreadingAngle));
        dir = safeNorm(dir, V3(0, 1, 0));
        // variations are +- half the given value (SceneKit)
        p.v = dir * std::max(0.f, s.velocity + frand(-0.5f, 0.5f) * s.velocityVar);
        p.maxLife = p.life = std::max(0.02f, s.lifeSpan + frand(-0.5f, 0.5f) * s.lifeSpanVar);
        p.size = std::max(0.001f, s.size + frand(-0.5f, 0.5f) * s.sizeVar);
        p.angle = frand(-0.5f, 0.5f) * s.angleVar * PI / 180;
        p.angVel = frand(-0.5f, 0.5f) * s.angVelVar * PI / 180;
        V3 c = lin(V3(s.color.x, s.color.y, s.color.z));
        float bright = 1 + frand(-0.5f, 0.5f) * s.colorVar.z * 2;
        c = V3(c.x * (1 + frand(-0.5f, 0.5f) * s.colorVar.x), c.y * (1 + frand(-0.5f, 0.5f) * s.colorVar.y), c.z) * bright;
        p.col = V4(V3(std::max(0.f, c.x), std::max(0.f, c.y), std::max(0.f, c.z)), s.color.w);
        e.ps.push_back(p);
    }
    e.age += dt;
    // simulate
    V3 g = s.gravity ? scene.gravity : V3(0, 0, 0);
    float damp = std::max(0.f, 1 - s.damping * dt);
    for (size_t i = 0; i < e.ps.size();) {
        Particle& p = e.ps[i];
        p.life -= dt;
        if (p.life <= 0) { e.ps[i] = e.ps.back(); e.ps.pop_back(); continue; }
        p.v += (g + s.acceleration) * dt;
        p.v *= damp;
        p.p += p.v * dt;
        p.angle += p.angVel * dt;
        i++;
    }
}

void Scene::update(float dt) {
    if (isPaused) return;
    // actions run on every node in the tree (copy first: actions add and remove nodes)
    std::vector<NodeRef> withActions;
    std::function<void(const NodeRef&)> collect = [&](const NodeRef& n) {
        if (!n->actions.empty()) withActions.push_back(n);
        for (auto& c : n->children) collect(c);
    };
    collect(root);
    for (auto& n : withActions) n->updateActions(dt);
    for (size_t i = 0; i < emitters.size();) {
        auto& e = *emitters[i];
        if (e.attached) {
            auto n = e.node.lock();
            if (!n || !n->inTree(root.get())) {
                // node left the scene: stop emitting, let the rest fade
                e.attached = false;
                e.sys.loops = false;
                e.age = e.sys.emissionDuration;
            } else {
                e.transform = n->worldMatrix();
            }
        }
        stepEmitter(*this, e, dt);
        if (!e.attached && e.finished()) { emitters[i] = emitters.back(); emitters.pop_back(); continue; }
        i++;
    }
}

// MARK: - PNG (uncompressed deflate, no dependencies)

static uint32_t crc32(const uint8_t* d, size_t n, uint32_t c = 0xffffffffu) {
    static uint32_t table[256];
    static bool init = false;
    if (!init) {
        for (uint32_t i = 0; i < 256; i++) {
            uint32_t k = i;
            for (int j = 0; j < 8; j++) k = (k & 1) ? 0xedb88320u ^ (k >> 1) : k >> 1;
            table[i] = k;
        }
        init = true;
    }
    for (size_t i = 0; i < n; i++) c = table[(c ^ d[i]) & 0xff] ^ (c >> 8);
    return c;
}

bool savePNG(const Image& img, const std::string& path, bool alpha) {
    alpha = alpha && img.channels == 4;
    std::vector<uint8_t> raw;
    raw.reserve((size_t)(img.w * (alpha ? 4 : 3) + 1) * img.h);
    for (int y = 0; y < img.h; y++) {
        raw.push_back(0);
        for (int x = 0; x < img.w; x++) {
            const uint8_t* p = &img.px[((size_t)y * img.w + x) * img.channels];
            raw.push_back(p[0]);
            raw.push_back(img.channels >= 3 ? p[1] : p[0]);
            raw.push_back(img.channels >= 3 ? p[2] : p[0]);
            if (alpha) raw.push_back(p[3]);
        }
    }
    std::vector<uint8_t> z = {0x78, 0x01};
    uint32_t a = 1, b = 0;
    for (uint8_t c : raw) { a = (a + c) % 65521; b = (b + a) % 65521; }
    size_t pos = 0;
    while (pos < raw.size() || raw.empty()) {
        size_t n = std::min<size_t>(65535, raw.size() - pos);
        z.push_back(pos + n >= raw.size() ? 1 : 0);
        z.push_back(n & 0xff); z.push_back(n >> 8);
        z.push_back(~n & 0xff); z.push_back((~n >> 8) & 0xff);
        z.insert(z.end(), raw.begin() + pos, raw.begin() + pos + n);
        pos += n;
        if (raw.empty()) break;
    }
    uint32_t ad = (b << 16) | a;
    for (int i = 3; i >= 0; i--) z.push_back((ad >> (i * 8)) & 0xff);
    FILE* f = fopen(path.c_str(), "wb");
    if (!f) return false;
    auto be32 = [&](uint32_t v) { uint8_t q[4] = {(uint8_t)(v >> 24), (uint8_t)(v >> 16), (uint8_t)(v >> 8), (uint8_t)v}; fwrite(q, 1, 4, f); };
    auto chunk = [&](const char* type, const std::vector<uint8_t>& data) {
        be32((uint32_t)data.size());
        std::vector<uint8_t> td(type, type + 4);
        td.insert(td.end(), data.begin(), data.end());
        fwrite(td.data(), 1, td.size(), f);
        be32(crc32(td.data(), td.size()) ^ 0xffffffffu);
    };
    const uint8_t sig[8] = {137, 80, 78, 71, 13, 10, 26, 10};
    fwrite(sig, 1, 8, f);
    std::vector<uint8_t> ihdr = {(uint8_t)(img.w >> 24), (uint8_t)(img.w >> 16), (uint8_t)(img.w >> 8), (uint8_t)img.w,
                                 (uint8_t)(img.h >> 24), (uint8_t)(img.h >> 16), (uint8_t)(img.h >> 8), (uint8_t)img.h, 8, (uint8_t)(alpha ? 6 : 2), 0, 0, 0};
    chunk("IHDR", ihdr);
    chunk("IDAT", z);
    chunk("IEND", {});
    fclose(f);
    return true;
}
