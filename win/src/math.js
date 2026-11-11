// Shared math helpers for the NOVA BREACH port. Mirrors Sources/Math.swift.
//
// Vectors are plain objects used as VALUES: every helper returns a fresh object and never
// mutates its arguments. 3D = {x, y, z}, 2D = {x, y}. Mutating a component of a vector you own
// (e.pos.x += 1) is fine, but never store the same vector object in two places – use cp().

export const v3 = (x = 0, y = 0, z = 0) => ({ x, y, z });
export const cp = (a) => ({ x: a.x, y: a.y, z: a.z });
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const mul = (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const neg = (a) => ({ x: -a.x, y: -a.y, z: -a.z });
/** a + b * s */
export const addMul = (a, b, s) => ({ x: a.x + b.x * s, y: a.y + b.y * s, z: a.z + b.z * s });
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
export const len = (a) => Math.hypot(a.x, a.y, a.z);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
/** horizontal (XZ) length of a 3D vector – Swift's len2() */
export const len2 = (a) => Math.hypot(a.x, a.z);
export const mix3 = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });
/** normalise with fallback – Swift's safeNorm() */
export function norm(a, fallback = { x: 0, y: 0, z: -1 }) {
  const l = len(a);
  return l > 1e-5 ? { x: a.x / l, y: a.y / l, z: a.z / l } : cp(fallback);
}
export const safeNorm = norm;

// 2D (Swift V2). Components are x and y.
export const v2 = (x = 0, y = 0) => ({ x, y });
export const add2 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const sub2 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const mul2 = (a, s) => ({ x: a.x * s, y: a.y * s });
export const dot2 = (a, b) => a.x * b.x + a.y * b.y;
export const len2d = (a) => Math.hypot(a.x, a.y);
export function norm2(a, fallback = { x: 0, y: 1 }) {
  const l = Math.hypot(a.x, a.y);
  return l > 1e-5 ? { x: a.x / l, y: a.y / l } : { x: fallback.x, y: fallback.y };
}

export const clampf = (x, a, b) => Math.min(Math.max(x, a), b);
export const mixf = (a, b, t) => a + (b - a) * t;
export function sstep(e0, e1, x) {
  const t = clampf((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
export const fract = (x) => x - Math.floor(x);
export const frand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const approach = (cur, target, d) => (cur < target ? Math.min(cur + d, target) : Math.max(cur - d, target));
export function wrapAngle(a) {
  let x = a;
  while (x > Math.PI) x -= 2 * Math.PI;
  while (x < -Math.PI) x += 2 * Math.PI;
  return x;
}
export function randUnit() {
  for (;;) {
    const v = { x: frand(-1, 1), y: frand(-1, 1), z: frand(-1, 1) };
    const l = len(v);
    if (l > 0.05 && l <= 1) return mul(v, 1 / l);
  }
}

// ---- deterministic hashing / noise (procedural textures). Bit-exact with the Swift UInt32 maths.

export function hashI(x, y, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2246822519 | 0)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h & 0xffffff) / 0x1000000;
}
export function hash3I(x, y, z, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = (h + Math.imul(z | 0, 1440662683) + Math.imul(s | 0, 2246822519 | 0)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h & 0xffffff) / 0x1000000;
}
export const pmod = (a, n) => { const r = a % n; return r < 0 ? r + n : r; };

/** Tileable 2D value noise; `period` is the lattice period in noise units. */
export function vnoise(x, y, period, seed) {
  const xf = Math.floor(x), yf = Math.floor(y);
  let fx = x - xf, fy = y - yf;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const x0 = pmod(xf, period), x1 = pmod(xf + 1, period);
  const y0 = pmod(yf, period), y1 = pmod(yf + 1, period);
  const a = hashI(x0, y0, seed), b = hashI(x1, y0, seed);
  const c = hashI(x0, y1, seed), d = hashI(x1, y1, seed);
  return mixf(mixf(a, b, fx), mixf(c, d, fx), fy);
}
/** Tileable fbm over the unit square: u,v in 0..1, `freq` lattice cells across. */
export function fbm(u, v, freq, octaves, seed) {
  let sum = 0, amp = 0.5, f = freq, n = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(u * f, v * f, f, (seed + o * 17) | 0);
    n += amp; amp *= 0.5; f *= 2;
  }
  return sum / n;
}
export function vnoise3(p, seed) {
  const xi = Math.floor(p.x), yi = Math.floor(p.y), zi = Math.floor(p.z);
  let fx = p.x - xi, fy = p.y - yi, fz = p.z - zi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const h = (a, b, c) => hash3I(xi + a, yi + b, zi + c, seed);
  const x00 = mixf(h(0, 0, 0), h(1, 0, 0), fx), x10 = mixf(h(0, 1, 0), h(1, 1, 0), fx);
  const x01 = mixf(h(0, 0, 1), h(1, 0, 1), fx), x11 = mixf(h(0, 1, 1), h(1, 1, 1), fx);
  return mixf(mixf(x00, x10, fy), mixf(x01, x11, fy), fz);
}
export function fbm3(p, octaves, seed) {
  let sum = 0, amp = 0.5, n = 0;
  let q = cp(p);
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise3(q, (seed + o * 31) | 0);
    n += amp; amp *= 0.5;
    q = { x: q.x * 2.03 + 11.3, y: q.y * 2.03 + 7.7, z: q.z * 2.03 + 3.1 };
  }
  return sum / n;
}
