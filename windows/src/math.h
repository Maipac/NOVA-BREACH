// Vector math, noise and random helpers. Names follow the Swift sources (simd_length, frand, sstep …)
// so the game code ports over almost line by line.
#pragma once
#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <algorithm>
#include <random>

constexpr float PI = 3.14159265358979f;

struct V2 {
    float x = 0, y = 0;
    V2() = default;
    constexpr V2(float x_, float y_) : x(x_), y(y_) {}
    V2 operator+(V2 b) const { return {x + b.x, y + b.y}; }
    V2 operator-(V2 b) const { return {x - b.x, y - b.y}; }
    V2 operator-() const { return {-x, -y}; }
    V2 operator*(float s) const { return {x * s, y * s}; }
    V2 operator/(float s) const { return {x / s, y / s}; }
    V2 operator*(V2 b) const { return {x * b.x, y * b.y}; }
    V2& operator+=(V2 b) { x += b.x; y += b.y; return *this; }
    V2& operator-=(V2 b) { x -= b.x; y -= b.y; return *this; }
    V2& operator*=(float s) { x *= s; y *= s; return *this; }
    V2& operator/=(float s) { x /= s; y /= s; return *this; }
};
inline V2 operator*(float s, V2 v) { return v * s; }

struct V3 {
    float x = 0, y = 0, z = 0;
    V3() = default;
    constexpr V3(float x_, float y_, float z_) : x(x_), y(y_), z(z_) {}
    static constexpr V3 repeating(float v) { return {v, v, v}; }
    V3 operator+(V3 b) const { return {x + b.x, y + b.y, z + b.z}; }
    V3 operator-(V3 b) const { return {x - b.x, y - b.y, z - b.z}; }
    V3 operator-() const { return {-x, -y, -z}; }
    V3 operator*(float s) const { return {x * s, y * s, z * s}; }
    V3 operator/(float s) const { return {x / s, y / s, z / s}; }
    V3 operator*(V3 b) const { return {x * b.x, y * b.y, z * b.z}; }
    V3& operator+=(V3 b) { x += b.x; y += b.y; z += b.z; return *this; }
    V3& operator-=(V3 b) { x -= b.x; y -= b.y; z -= b.z; return *this; }
    V3& operator*=(float s) { x *= s; y *= s; z *= s; return *this; }
    V3& operator*=(V3 b) { x *= b.x; y *= b.y; z *= b.z; return *this; }
    V3& operator/=(float s) { x /= s; y /= s; z /= s; return *this; }
    bool operator==(V3 b) const { return x == b.x && y == b.y && z == b.z; }
    bool operator!=(V3 b) const { return !(*this == b); }
};
inline V3 operator*(float s, V3 v) { return v * s; }

struct V4 {
    float x = 0, y = 0, z = 0, w = 0;
    V4() = default;
    constexpr V4(float x_, float y_, float z_, float w_) : x(x_), y(y_), z(z_), w(w_) {}
    constexpr V4(V3 v, float w_) : x(v.x), y(v.y), z(v.z), w(w_) {}
    V3 xyz() const { return {x, y, z}; }
    V4 operator*(float s) const { return {x * s, y * s, z * s, w * s}; }
    V4 operator+(V4 b) const { return {x + b.x, y + b.y, z + b.z, w + b.w}; }
};

inline float simd_dot(V3 a, V3 b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
inline float simd_dot(V2 a, V2 b) { return a.x * b.x + a.y * b.y; }
inline V3 simd_cross(V3 a, V3 b) { return {a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x}; }
inline float simd_length(V3 v) { return std::sqrt(simd_dot(v, v)); }
inline float simd_length(V2 v) { return std::sqrt(simd_dot(v, v)); }
inline float simd_distance(V3 a, V3 b) { return simd_length(a - b); }
inline float simd_distance(V2 a, V2 b) { return simd_length(a - b); }
inline V3 simd_normalize(V3 v) { float l = simd_length(v); return l > 0 ? v / l : v; }
inline V2 simd_normalize(V2 v) { float l = simd_length(v); return l > 0 ? v / l : v; }

inline float clampf(float x, float a, float b) { return std::min(std::max(x, a), b); }
inline float mixf(float a, float b, float t) { return a + (b - a) * t; }
inline V3 mix3(V3 a, V3 b, float t) { return a + (b - a) * t; }
inline float sstep(float e0, float e1, float x) {
    float t = clampf((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
}
inline float fract(float x) { return x - std::floor(x); }
inline float approach(float cur, float target, float d) { return cur < target ? std::min(cur + d, target) : std::max(cur - d, target); }
inline float wrapAngle(float a) {
    while (a > PI) a -= 2 * PI;
    while (a < -PI) a += 2 * PI;
    return a;
}
inline float len2(V3 v) { return simd_length(V2(v.x, v.z)); }
inline V3 safeNorm(V3 v, V3 fallback = V3(0, 0, -1)) {
    float l = simd_length(v);
    return l > 1e-5f ? v / l : fallback;
}

// random numbers (one generator for the whole game, like Swift's Float.random)
inline std::mt19937& rng() { static std::mt19937 g(std::random_device{}()); return g; }
inline float frand(float a = 0, float b = 1) { return a + (b - a) * std::uniform_real_distribution<float>(0, 1)(rng()); }
inline int irand(int lo, int hiExclusive) { return hiExclusive <= lo ? lo : lo + (int)(rng()() % (uint32_t)(hiExclusive - lo)); }
inline V3 randUnit() {
    for (;;) {
        V3 v(frand(-1, 1), frand(-1, 1), frand(-1, 1));
        float l = simd_length(v);
        if (l > 0.05f && l <= 1) return v / l;
    }
}

// MARK: quaternion + matrix (right-handed, column vectors)

struct Quat {
    float x = 0, y = 0, z = 0, w = 1;
    Quat() = default;
    constexpr Quat(float x_, float y_, float z_, float w_) : x(x_), y(y_), z(z_), w(w_) {}
    static Quat angleAxis(float a, V3 axis) {
        V3 n = simd_normalize(axis);
        float s = std::sin(a * 0.5f);
        return {n.x * s, n.y * s, n.z * s, std::cos(a * 0.5f)};
    }
    /// shortest rotation taking unit vector a onto unit vector b
    static Quat fromTo(V3 a, V3 b) {
        float d = simd_dot(a, b);
        if (d < -0.99999f) {
            V3 axis = simd_cross(V3(1, 0, 0), a);
            if (simd_length(axis) < 1e-4f) axis = simd_cross(V3(0, 1, 0), a);
            return angleAxis(PI, axis);
        }
        V3 c = simd_cross(a, b);
        Quat q(c.x, c.y, c.z, 1 + d);
        float l = std::sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
        return {q.x / l, q.y / l, q.z / l, q.w / l};
    }
    /// SceneKit Euler angles: R = Rz(roll) * Ry(yaw) * Rx(pitch)
    static Quat euler(V3 e) { return angleAxis(e.z, V3(0, 0, 1)) * angleAxis(e.y, V3(0, 1, 0)) * angleAxis(e.x, V3(1, 0, 0)); }
    Quat operator*(Quat b) const {
        return {w * b.x + x * b.w + y * b.z - z * b.y, w * b.y - x * b.z + y * b.w + z * b.x,
                w * b.z + x * b.y - y * b.x + z * b.w, w * b.w - x * b.x - y * b.y - z * b.z};
    }
    V3 rotate(V3 v) const {
        V3 q(x, y, z);
        V3 t = simd_cross(q, v) * 2;
        return v + t * w + simd_cross(q, t);
    }
};

struct M4 {
    float m[16]; // column-major: m[col * 4 + row]
    M4() { for (int i = 0; i < 16; i++) m[i] = (i % 5 == 0) ? 1.f : 0.f; }
    float& at(int row, int col) { return m[col * 4 + row]; }
    float at(int row, int col) const { return m[col * 4 + row]; }
    static M4 identity() { return M4(); }
    M4 operator*(const M4& b) const {
        M4 r;
        for (int c = 0; c < 4; c++)
            for (int rr = 0; rr < 4; rr++) {
                float s = 0;
                for (int k = 0; k < 4; k++) s += at(rr, k) * b.at(k, c);
                r.at(rr, c) = s;
            }
        return r;
    }
    V3 point(V3 p) const {
        return {at(0, 0) * p.x + at(0, 1) * p.y + at(0, 2) * p.z + at(0, 3), at(1, 0) * p.x + at(1, 1) * p.y + at(1, 2) * p.z + at(1, 3),
                at(2, 0) * p.x + at(2, 1) * p.y + at(2, 2) * p.z + at(2, 3)};
    }
    V3 dir(V3 p) const {
        return {at(0, 0) * p.x + at(0, 1) * p.y + at(0, 2) * p.z, at(1, 0) * p.x + at(1, 1) * p.y + at(1, 2) * p.z,
                at(2, 0) * p.x + at(2, 1) * p.y + at(2, 2) * p.z};
    }
    V4 mul(V4 p) const {
        V4 r;
        r.x = at(0, 0) * p.x + at(0, 1) * p.y + at(0, 2) * p.z + at(0, 3) * p.w;
        r.y = at(1, 0) * p.x + at(1, 1) * p.y + at(1, 2) * p.z + at(1, 3) * p.w;
        r.z = at(2, 0) * p.x + at(2, 1) * p.y + at(2, 2) * p.z + at(2, 3) * p.w;
        r.w = at(3, 0) * p.x + at(3, 1) * p.y + at(3, 2) * p.z + at(3, 3) * p.w;
        return r;
    }
    V3 translation() const { return {at(0, 3), at(1, 3), at(2, 3)}; }
    static M4 trs(V3 t, Quat q, V3 s) {
        M4 r;
        float xx = q.x * q.x, yy = q.y * q.y, zz = q.z * q.z, xy = q.x * q.y, xz = q.x * q.z, yz = q.y * q.z;
        float wx = q.w * q.x, wy = q.w * q.y, wz = q.w * q.z;
        r.at(0, 0) = (1 - 2 * (yy + zz)) * s.x; r.at(0, 1) = (2 * (xy - wz)) * s.y; r.at(0, 2) = (2 * (xz + wy)) * s.z;
        r.at(1, 0) = (2 * (xy + wz)) * s.x; r.at(1, 1) = (1 - 2 * (xx + zz)) * s.y; r.at(1, 2) = (2 * (yz - wx)) * s.z;
        r.at(2, 0) = (2 * (xz - wy)) * s.x; r.at(2, 1) = (2 * (yz + wx)) * s.y; r.at(2, 2) = (1 - 2 * (xx + yy)) * s.z;
        r.at(0, 3) = t.x; r.at(1, 3) = t.y; r.at(2, 3) = t.z;
        return r;
    }
    static M4 scale(V3 s) { M4 r; r.at(0, 0) = s.x; r.at(1, 1) = s.y; r.at(2, 2) = s.z; return r; }
    static M4 translate(V3 t) { M4 r; r.at(0, 3) = t.x; r.at(1, 3) = t.y; r.at(2, 3) = t.z; return r; }
    /// right-handed view matrix (camera looks down -Z)
    static M4 lookAt(V3 eye, V3 target, V3 up) {
        V3 f = simd_normalize(target - eye);
        V3 s = simd_normalize(simd_cross(f, up));
        V3 u = simd_cross(s, f);
        M4 r;
        r.at(0, 0) = s.x; r.at(0, 1) = s.y; r.at(0, 2) = s.z; r.at(0, 3) = -simd_dot(s, eye);
        r.at(1, 0) = u.x; r.at(1, 1) = u.y; r.at(1, 2) = u.z; r.at(1, 3) = -simd_dot(u, eye);
        r.at(2, 0) = -f.x; r.at(2, 1) = -f.y; r.at(2, 2) = -f.z; r.at(2, 3) = simd_dot(f, eye);
        return r;
    }
    /// right-handed perspective with reversed Z (near -> 1, far -> 0), D3D clip space
    static M4 perspectiveRevZ(float fovYRad, float aspect, float zn, float zf) {
        M4 r;
        float f = 1.0f / std::tan(fovYRad * 0.5f);
        for (int i = 0; i < 16; i++) r.m[i] = 0;
        r.at(0, 0) = f / aspect;
        r.at(1, 1) = f;
        r.at(2, 2) = zn / (zf - zn);
        r.at(2, 3) = zf * zn / (zf - zn);
        r.at(3, 2) = -1;
        return r;
    }
    /// right-handed orthographic, depth 0..1 (shadow map)
    static M4 ortho(float l, float rr, float b, float t, float zn, float zf) {
        M4 r;
        r.at(0, 0) = 2 / (rr - l); r.at(0, 3) = -(rr + l) / (rr - l);
        r.at(1, 1) = 2 / (t - b); r.at(1, 3) = -(t + b) / (t - b);
        r.at(2, 2) = -1 / (zf - zn); r.at(2, 3) = -zn / (zf - zn);
        return r;
    }
    M4 inverse() const;
    M4 transposed() const { M4 r; for (int a = 0; a < 4; a++) for (int b = 0; b < 4; b++) r.at(a, b) = at(b, a); return r; }
};

inline M4 M4::inverse() const {
    const float* a = m;
    float inv[16];
    inv[0] = a[5] * a[10] * a[15] - a[5] * a[11] * a[14] - a[9] * a[6] * a[15] + a[9] * a[7] * a[14] + a[13] * a[6] * a[11] - a[13] * a[7] * a[10];
    inv[4] = -a[4] * a[10] * a[15] + a[4] * a[11] * a[14] + a[8] * a[6] * a[15] - a[8] * a[7] * a[14] - a[12] * a[6] * a[11] + a[12] * a[7] * a[10];
    inv[8] = a[4] * a[9] * a[15] - a[4] * a[11] * a[13] - a[8] * a[5] * a[15] + a[8] * a[7] * a[13] + a[12] * a[5] * a[11] - a[12] * a[7] * a[9];
    inv[12] = -a[4] * a[9] * a[14] + a[4] * a[10] * a[13] + a[8] * a[5] * a[14] - a[8] * a[6] * a[13] - a[12] * a[5] * a[10] + a[12] * a[6] * a[9];
    inv[1] = -a[1] * a[10] * a[15] + a[1] * a[11] * a[14] + a[9] * a[2] * a[15] - a[9] * a[3] * a[14] - a[13] * a[2] * a[11] + a[13] * a[3] * a[10];
    inv[5] = a[0] * a[10] * a[15] - a[0] * a[11] * a[14] - a[8] * a[2] * a[15] + a[8] * a[3] * a[14] + a[12] * a[2] * a[11] - a[12] * a[3] * a[10];
    inv[9] = -a[0] * a[9] * a[15] + a[0] * a[11] * a[13] + a[8] * a[1] * a[15] - a[8] * a[3] * a[13] - a[12] * a[1] * a[11] + a[12] * a[3] * a[9];
    inv[13] = a[0] * a[9] * a[14] - a[0] * a[10] * a[13] - a[8] * a[1] * a[14] + a[8] * a[2] * a[13] + a[12] * a[1] * a[10] - a[12] * a[2] * a[9];
    inv[2] = a[1] * a[6] * a[15] - a[1] * a[7] * a[14] - a[5] * a[2] * a[15] + a[5] * a[3] * a[14] + a[13] * a[2] * a[7] - a[13] * a[3] * a[6];
    inv[6] = -a[0] * a[6] * a[15] + a[0] * a[7] * a[14] + a[4] * a[2] * a[15] - a[4] * a[3] * a[14] - a[12] * a[2] * a[7] + a[12] * a[3] * a[6];
    inv[10] = a[0] * a[5] * a[15] - a[0] * a[7] * a[13] - a[4] * a[1] * a[15] + a[4] * a[3] * a[13] + a[12] * a[1] * a[7] - a[12] * a[3] * a[5];
    inv[14] = -a[0] * a[5] * a[14] + a[0] * a[6] * a[13] + a[4] * a[1] * a[14] - a[4] * a[2] * a[13] - a[12] * a[1] * a[6] + a[12] * a[2] * a[5];
    inv[3] = -a[1] * a[6] * a[11] + a[1] * a[7] * a[10] + a[5] * a[2] * a[11] - a[5] * a[3] * a[10] - a[9] * a[2] * a[7] + a[9] * a[3] * a[6];
    inv[7] = a[0] * a[6] * a[11] - a[0] * a[7] * a[10] - a[4] * a[2] * a[11] + a[4] * a[3] * a[10] + a[8] * a[2] * a[7] - a[8] * a[3] * a[6];
    inv[11] = -a[0] * a[5] * a[11] + a[0] * a[7] * a[9] + a[4] * a[1] * a[11] - a[4] * a[3] * a[9] - a[8] * a[1] * a[7] + a[8] * a[3] * a[5];
    inv[15] = a[0] * a[5] * a[10] - a[0] * a[6] * a[9] - a[4] * a[1] * a[10] + a[4] * a[2] * a[9] + a[8] * a[1] * a[6] - a[8] * a[2] * a[5];
    float det = a[0] * inv[0] + a[1] * inv[4] + a[2] * inv[8] + a[3] * inv[12];
    M4 r;
    float id = std::fabs(det) > 1e-20f ? 1.0f / det : 0.f;
    for (int i = 0; i < 16; i++) r.m[i] = inv[i] * id;
    return r;
}

// MARK: hashing / noise (deterministic, used by the procedural textures)

inline float hashI(int32_t x, int32_t y, int32_t s = 0) {
    uint32_t h = (uint32_t)x * 374761393u + (uint32_t)y * 668265263u + (uint32_t)s * 2246822519u;
    h = (h ^ (h >> 13)) * 1274126177u;
    h ^= h >> 16;
    return (float)(h & 0xFFFFFF) / (float)0x1000000;
}
inline float hash3I(int32_t x, int32_t y, int32_t z, int32_t s = 0) {
    uint32_t h = (uint32_t)x * 374761393u + (uint32_t)y * 668265263u;
    h = h + (uint32_t)z * 1440662683u + (uint32_t)s * 2246822519u;
    h = (h ^ (h >> 13)) * 1274126177u;
    h ^= h >> 16;
    return (float)(h & 0xFFFFFF) / (float)0x1000000;
}
inline int32_t pmod(int32_t a, int32_t n) { int32_t r = a % n; return r < 0 ? r + n : r; }

/// Tileable 2D value noise. `period` is the lattice period in noise units.
inline float vnoise(float x, float y, int32_t period, int32_t seed) {
    float xf = std::floor(x), yf = std::floor(y);
    int32_t xi = (int32_t)xf, yi = (int32_t)yf;
    float fx = x - xf, fy = y - yf;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    int32_t x0 = pmod(xi, period), x1 = pmod(xi + 1, period);
    int32_t y0 = pmod(yi, period), y1 = pmod(yi + 1, period);
    float a = hashI(x0, y0, seed), b = hashI(x1, y0, seed);
    float c = hashI(x0, y1, seed), d = hashI(x1, y1, seed);
    return mixf(mixf(a, b, fx), mixf(c, d, fx), fy);
}
/// Tileable fbm over the unit square: u,v in 0..1, `freq` lattice cells across.
inline float fbm(float u, float v, int32_t freq, int octaves, int32_t seed) {
    float sum = 0, amp = 0.5f, norm = 0;
    int32_t f = freq;
    for (int o = 0; o < octaves; o++) {
        sum += amp * vnoise(u * (float)f, v * (float)f, f, seed + (int32_t)o * 17);
        norm += amp; amp *= 0.5f; f *= 2;
    }
    return sum / norm;
}
inline float vnoise3(V3 p, int32_t seed) {
    V3 pf(std::floor(p.x), std::floor(p.y), std::floor(p.z));
    int32_t xi = (int32_t)pf.x, yi = (int32_t)pf.y, zi = (int32_t)pf.z;
    V3 f = p - pf;
    f = V3(f.x * f.x * (3 - 2 * f.x), f.y * f.y * (3 - 2 * f.y), f.z * f.z * (3 - 2 * f.z));
    auto h = [&](int32_t a, int32_t b, int32_t c) { return hash3I(xi + a, yi + b, zi + c, seed); };
    float x00 = mixf(h(0, 0, 0), h(1, 0, 0), f.x), x10 = mixf(h(0, 1, 0), h(1, 1, 0), f.x);
    float x01 = mixf(h(0, 0, 1), h(1, 0, 1), f.x), x11 = mixf(h(0, 1, 1), h(1, 1, 1), f.x);
    return mixf(mixf(x00, x10, f.y), mixf(x01, x11, f.y), f.z);
}
inline float fbm3(V3 p, int octaves, int32_t seed) {
    float sum = 0, amp = 0.5f, norm = 0;
    V3 q = p;
    for (int o = 0; o < octaves; o++) {
        sum += amp * vnoise3(q, seed + (int32_t)o * 31);
        norm += amp; amp *= 0.5f; q = q * 2.03f + V3(11.3f, 7.7f, 3.1f);
    }
    return sum / norm;
}

/// sRGB (0..1) to linear
inline float srgbToLinear(float c) { return c <= 0.04045f ? c / 12.92f : std::pow((c + 0.055f) / 1.055f, 2.4f); }
inline V3 srgbToLinear(V3 c) { return {srgbToLinear(c.x), srgbToLinear(c.y), srgbToLinear(c.z)}; }
