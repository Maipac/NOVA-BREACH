// Everything visual in the game is generated procedurally at startup – no asset files.
// Mirrors Sources/Textures.swift (surface sets + sprite images; the sky lives in sky.js).
//
// Orientation: the generators below take IMAGE coordinates like the Swift originals (v grows downward,
// `y = 1 - v` is "up"). A DataTexture's row 0 is the bottom (v = 0), so every image is written with its
// rows flipped: Swift row y lands in GL row n-1-y. A texture therefore looks the same on a three
// PlaneGeometry / box side as it did on the SceneKit primitive (Swift v = 0 is the top edge).

import * as THREE from 'three';
import { v3, norm, clampf, mixf, sstep, fract, hashI, fbm } from './math.js';

/** float 0..1 -> byte, same rounding as Swift's b8() */
const b8 = (x) => (x <= 0 ? 0 : x >= 1 ? 255 : (x * 255 + 0.5) | 0);

/**
 * Swift's Texel struct, flattened to scalars. The generators WRITE INTO a texel that the caller
 * reuses, so the 3.6 million evaluations at startup do not allocate anything.
 * col = (cr, cg, cb), emit = (er, eg, eb).
 */
export function makeTexel() {
  return { h: 0.5, cr: 0.5, cg: 0.5, cb: 0.5, rough: 0.5, metal: 1, er: 0, eg: 0, eb: 0 };
}

// ---- surface generators (u, v in 0..1, image coordinates) ----

/** distance to the nearest hexagon edge; p = (px, py) */
export function hexEdge(px, py) {
  const ry = 1.7320508, hx = 0.5, hy = ry * 0.5;   // r = (1, 1.7320508), h = r * 0.5
  const ax = (px - Math.floor(px)) - hx, ay = (py - ry * Math.floor(py / ry)) - hy;
  const qx = px - hx, qy = py - hy;
  const bx = (qx - Math.floor(qx)) - hx, by = (qy - ry * Math.floor(qy / ry)) - hy;
  const useA = ax * ax + ay * ay < bx * bx + by * by;
  const gx = Math.abs(useA ? ax : bx), gy = Math.abs(useA ? ay : by);
  return 0.5 - Math.max(gx, gx * 0.5 + gy * 0.8660254);
}

export function floorTexel(u, v, t) {
  const gu = u * 2, gv = v * 2;
  const cx = Math.floor(gu), cy = Math.floor(gv);
  const fu = gu - cx, fv = gv - cy;
  const ex = Math.min(fu, 1 - fu), ey = Math.min(fv, 1 - fv);
  const edge = Math.min(ex, ey);
  const seam = sstep(0.004, 0.016, edge);
  const id = hashI(cx, cy, 7);
  const inset = sstep(0.10, 0.108, edge);
  let h = 0.25 + 0.55 * seam;
  const n1 = fbm(u, v, 6, 5, 3);
  const n2 = fbm(u, v, 48, 3, 9);
  let k = 0.7 + 0.6 * n1;
  let cr = 0.135 * k, cg = 0.15 * k, cb = 0.18 * k;
  let rough = 0.22 + 0.40 * n1 + 0.12 * n2;
  if (id < 0.5) {
    // tread plate
    const s = 14;
    const a = Math.abs(fract(fu * s) - 0.5), b = Math.abs(fract(fv * s) - 0.5);
    const alt = (Math.floor(fu * s) + Math.floor(fv * s)) & 1;
    const d = alt === 0 ? a * 3 + b : a + b * 3;
    const bump = sstep(0.42, 0.3, d) * inset;
    h += 0.10 * bump;
    rough += 0.08 * bump;
    cr *= 0.9; cg *= 0.9; cb *= 0.9;
  } else {
    // smooth plate with a cross groove
    h += 0.05 * inset;
    const sub = Math.min(Math.abs(fu - 0.5), Math.abs(fv - 0.5));
    const sl = sstep(0.003, 0.008, sub);
    h -= 0.08 * (1 - sl) * inset;
    k = 0.8 + 0.2 * sl;
    cr *= k; cg *= k; cb *= k;
  }
  const bdx = ex - 0.055, bdy = ey - 0.055;
  const bd = Math.sqrt(bdx * bdx + bdy * bdy);
  const bolt = sstep(0.02, 0.013, bd);
  h += 0.18 * bolt;
  k = bolt * 0.7;
  cr += (0.22 - cr) * k; cg += (0.23 - cg) * k; cb += (0.25 - cb) * k;
  k = 0.35 + 0.65 * seam;
  cr *= k; cg *= k; cb *= k;
  rough = mixf(0.85, rough, seam);
  t.h = h; t.cr = cr; t.cg = cg; t.cb = cb;
  t.rough = clampf(rough, 0.08, 1); t.metal = 0.35;
  t.er = 0; t.eg = 0; t.eb = 0;
  return t;
}

export function wallTexel(u, v, ec, t) {
  const y = 1 - v;
  const n1 = fbm(u, v, 5, 5, 21), n2 = fbm(u, v, 40, 3, 5);
  let cr = 0.15, cg = 0.165, cb = 0.19;
  let h = 0.5;
  let rough = 0.36 + 0.3 * n1;
  let metal = 0.5;
  let er = 0, eg = 0, eb = 0;
  let k;
  if (y < 0.08) {
    // skirting
    const rib = sstep(0.2, 0.35, Math.abs(fract(y / 0.08 * 3) - 0.5));
    h = 0.55 + 0.1 * rib; cr = 0.06; cg = 0.065; cb = 0.075;
  } else if (y < 0.47) {
    // lower row: two wide panels
    const py = (y - 0.08) / 0.39;
    const gu = u * 2, cx = Math.floor(gu), fu = gu - cx;
    const ex = Math.min(fu, 1 - fu) * 2, ey = Math.min(py, 1 - py) * 1.56;
    const edge = Math.min(ex, ey);
    const seam = sstep(0.008, 0.03, edge);
    const inset = sstep(0.14, 0.16, edge);
    h = 0.3 + 0.3 * seam + 0.08 * inset;
    if (hashI(cx, 3, 11) < 0.5) {
      const inVent = sstep(0.35, 0.37, ex) * sstep(0.3, 0.32, ey);
      const sl = sstep(0.15, 0.3, Math.abs(fract(py * 14) - 0.5));
      h -= inVent * 0.25 * (1 - sl);
      k = inVent * (1 - sl);
      cr += (cr * 0.35 - cr) * k; cg += (cg * 0.35 - cg) * k; cb += (cb * 0.35 - cb) * k;
    } else {
      k = inset * 0.7;
      cr += (0.23 - cr) * k; cg += (0.25 - cg) * k; cb += (0.28 - cb) * k;
      metal = mixf(metal, 0.3, inset * 0.7);
      // stencil-like hazard chevrons in the lower corner
      const cu = fu * 2, cv = py * 1.56;
      if (cu > 0.22 && cu < 0.7 && cv > 0.2 && cv < 0.32) {
        const d = fract((cu + cv) * 9);
        if (d < 0.5) { cr = 0.75; cg = 0.55; cb = 0.06; } else { cr = 0.04; cg = 0.04; cb = 0.04; }
        metal = 0.1;
      }
    }
    k = 0.4 + 0.6 * seam;
    cr *= k; cg *= k; cb *= k;
  } else if (y < 0.55) {
    // recessed light channel
    const cy = (y - 0.47) / 0.08;
    const d = Math.abs(cy - 0.5);
    h = 0.2 + 0.25 * sstep(0.38, 0.5, d);
    cr = 0.03; cg = 0.03; cb = 0.035;
    const g = Math.min(fract(u * 4), 1 - fract(u * 4));
    k = sstep(0.17, 0.10, d) * sstep(0.03, 0.05, g);
    er = ec.x * k; eg = ec.y * k; eb = ec.z * k;
    rough = 0.6;
  } else if (y < 0.94) {
    // upper row: four narrow panels
    const py = (y - 0.55) / 0.39;
    const gu = u * 4, cx = Math.floor(gu), fu = gu - cx;
    const ex = Math.min(fu, 1 - fu), ey = Math.min(py, 1 - py) * 1.56;
    const seam = sstep(0.006, 0.025, Math.min(ex, ey));
    const id = hashI(cx, 5, 13);
    h = 0.3 + 0.3 * seam + 0.1 * id;
    k = 0.8 + 0.4 * id;
    cr *= k; cg *= k; cb *= k;
    if (id > 0.7 && Math.abs(fu - 0.5) < 0.1 && py > 0.80 && py < 0.84) { er = 1.0; eg = 0.45; eb = 0.1; }
    if (id < 0.25) {
      const sl = sstep(0.2, 0.3, Math.abs(fract(fu * 8) - 0.5));
      const inV = sstep(0.2, 0.22, ex) * sstep(0.2, 0.22, ey);
      h -= inV * 0.2 * (1 - sl);
      k = inV * (1 - sl);
      cr += (cr * 0.4 - cr) * k; cg += (cg * 0.4 - cg) * k; cb += (cb * 0.4 - cb) * k;
    }
    k = 0.4 + 0.6 * seam;
    cr *= k; cg *= k; cb *= k;
  } else {
    // top trim
    const rib = sstep(0.2, 0.35, Math.abs(fract(u * 16) - 0.5));
    h = 0.6 + 0.08 * rib; cr = 0.08; cg = 0.085; cb = 0.10;
  }
  k = 0.75 + 0.5 * n1;
  cr *= k; cg *= k; cb *= k;
  rough += 0.1 * n2;
  k = 0.7 + 0.3 * sstep(0.0, 0.3, y);
  cr *= k; cg *= k; cb *= k;
  t.h = h; t.cr = cr; t.cg = cg; t.cb = cb;
  t.rough = clampf(rough, 0.1, 1); t.metal = metal;
  t.er = er; t.eg = eg; t.eb = eb;
  return t;
}

export function pillarTexel(u, v, ec, t) {
  const n1 = fbm(u, v, 4, 5, 33);
  const c = Math.abs(u - 0.5);
  let k = 0.75 + 0.5 * n1;
  let cr = 0.11 * k, cg = 0.12 * k, cb = 0.14 * k;
  let h = 0.6;
  let er = 0, eg = 0, eb = 0;
  const band = fract(v * 4);
  const hs = sstep(0.0, 0.02, Math.min(band, 1 - band));
  h = 0.3 + 0.3 * hs;
  k = 0.45 + 0.55 * hs;
  cr *= k; cg *= k; cb *= k;
  if (c < 0.09) {
    // centre channel with a segmented light strip
    h = 0.15; cr = 0.02; cg = 0.02; cb = 0.025;
    const seg = sstep(0.04, 0.07, Math.min(fract(v * 2), 1 - fract(v * 2)));
    k = sstep(0.04, 0.02, c) * seg;
    er = ec.x * k; eg = ec.y * k; eb = ec.z * k;
  } else if (c > 0.3) {
    const rib = sstep(0.2, 0.32, Math.abs(fract(u * 20) - 0.5));
    h -= 0.12 * (1 - rib);
    k = 0.7 + 0.3 * rib;
    cr *= k; cg *= k; cb *= k;
  }
  const edge = Math.min(u, 1 - u);
  h *= 0.6 + 0.4 * sstep(0.0, 0.03, edge);
  t.h = h; t.cr = cr; t.cg = cg; t.cb = cb;
  t.rough = 0.3 + 0.3 * n1; t.metal = 0.85;
  t.er = er; t.eg = eg; t.eb = eb;
  return t;
}

export function crateTexel(u, v, paint, t) {
  const y = 1 - v;
  const ex = Math.min(u, 1 - u), ey = Math.min(v, 1 - v);
  const edge = Math.min(ex, ey);
  const frame = sstep(0.085, 0.075, edge);
  const rib = Math.sin(u * 2 * Math.PI * 7);
  const n = fbm(u, v, 20, 4, 55), n2 = fbm(u, v, 3, 4, 8);
  let h = mixf(0.42 + 0.14 * rib, 0.8, frame);
  let k = 0.85 + 0.3 * n2;
  let cr = paint.x * k, cg = paint.y * k, cb = paint.z * k;
  let metal = 0.15, rough = 0.5 + 0.2 * n;
  if (frame < 0.5 && y > 0.14 && y < 0.26) {
    // hazard stripe
    if (fract((u + y) * 6) < 0.5) { cr = 0.80; cg = 0.60; cb = 0.05; } else { cr = 0.04; cg = 0.04; cb = 0.04; }
  }
  if (frame < 0.5 && y > 0.62 && y < 0.80 && u > 0.14 && u < 0.42) {
    // id plate
    const bar = (y > 0.73 && u < 0.40) || (y < 0.68 && u < 0.30);
    if (bar && !(y > 0.68 && y < 0.73)) {
      cr += (0.78 - cr) * 0.85; cg += (0.78 - cg) * 0.85; cb += (0.74 - cb) * 0.85;
    }
  }
  if (frame > 0.5) { cr = 0.14; cg = 0.15; cb = 0.16; metal = 0.9; rough = 0.35; }
  // chipped paint, mostly along the edges
  const chip = sstep(0.66, 0.72, n + 0.24 * (1 - sstep(0, 0.14, edge)));
  cr += (0.30 - cr) * chip; cg += (0.30 - cg) * chip; cb += (0.31 - cb) * chip;
  metal = mixf(metal, 1, chip); rough = mixf(rough, 0.3, chip);
  h -= 0.03 * chip;
  const bdx = ex - 0.04, bdy = ey - 0.04;
  const bd = Math.sqrt(bdx * bdx + bdy * bdy);
  h += 0.15 * sstep(0.022, 0.014, bd);
  t.h = h; t.cr = cr; t.cg = cg; t.cb = cb;
  t.rough = rough; t.metal = metal;
  t.er = 0; t.eg = 0; t.eb = 0;
  return t;
}

export function platingTexel(u, v, t) {
  const g = 4;
  const cx = Math.floor(u * g), cy = Math.floor(v * g);
  // merge some cells into wider plates
  const merged = hashI(Math.trunc(cx / 2), cy, 3) < 0.4;
  let fu = fract(u * g);
  const fv = fract(v * g);
  if (merged) fu = fract(u * g / 2);
  const ex = Math.min(fu, 1 - fu) * (merged ? 2 : 1), ey = Math.min(fv, 1 - fv);
  const edge = Math.min(ex, ey);
  const seam = sstep(0.01, 0.05, edge);
  const n = fbm(u, v, 8, 4, 71);
  t.h = 0.35 + 0.4 * seam + 0.1 * hashI(cx, cy, 9);
  t.cr = t.cg = t.cb = (0.55 + 0.4 * n) * (0.5 + 0.5 * seam);
  t.rough = 0.25 + 0.35 * n;
  t.metal = 1;
  t.er = 0; t.eg = 0; t.eb = 0;
  return t;
}

/** greeble panel with small emissive display elements (generators, consoles) */
export function techTexel(u, v, t) {
  const g = 6;
  const cx = Math.floor(u * g), cy = Math.floor(v * g);
  const fu = fract(u * g), fv = fract(v * g);
  const id = hashI(cx, cy, 17);
  const edge = Math.min(Math.min(fu, 1 - fu), Math.min(fv, 1 - fv));
  const seam = sstep(0.02, 0.07, edge);
  const n = fbm(u, v, 6, 4, 19);
  let k = 0.7 + 0.6 * n;
  let cr = 0.10 * k, cg = 0.11 * k, cb = 0.13 * k;
  let h = 0.3 + 0.3 * seam + 0.25 * id;
  let er = 0, eg = 0, eb = 0;
  if (id > 0.86) {
    // small screen
    const inS = sstep(0.14, 0.18, edge);
    const line = sstep(0.3, 0.4, Math.abs(fract(fv * 7) - 0.5))
      * (hashI(Math.trunc(fu * 9), Math.trunc(fv * 7), cx + 5) > 0.4 ? 1 : 0.15);
    k = inS * (0.15 + 0.85 * line);
    er = 0.15 * k; eg = 0.85 * k; eb = 1.0 * k;
    cr += (0.01 - cr) * inS; cg += (0.02 - cg) * inS; cb += (0.03 - cb) * inS;
    h = mixf(h, 0.35, inS);
  } else if (id < 0.2) {
    const sl = sstep(0.2, 0.3, Math.abs(fract(fv * 6) - 0.5));
    h -= 0.2 * (1 - sl) * seam;
    k = 0.5 + 0.5 * sl;
    cr *= k; cg *= k; cb *= k;
  } else if (id > 0.55 && id < 0.62) {
    // status lamp
    const dx = fu - 0.5, dy = fv - 0.5;
    k = sstep(0.12, 0.08, Math.sqrt(dx * dx + dy * dy));
    er = 1.0 * k; eg = 0.35 * k; eb = 0.08 * k;
  }
  k = 0.4 + 0.6 * seam;
  cr *= k; cg *= k; cb *= k;
  t.h = h; t.cr = cr; t.cg = cg; t.cb = cb;
  t.rough = 0.3 + 0.35 * n; t.metal = 0.85;
  t.er = er; t.eg = eg; t.eb = eb;
  return t;
}

// ---- image builders ----

/**
 * Evaluates `f(u, v, texel)` for every pixel and returns the raw RGBA bytes of a PBR set in GL row order:
 * { albedo, normal, orm, emission /* or null *​/ }. Pure (no three.js), so it runs under node.
 *
 * Same maths as Swift's buildTextureSet: central-difference normals and a cheap cavity occlusion baked
 * into the albedo, both with wrap-around neighbour lookups so the result tiles.
 * Normal map is OpenGL convention in GL orientation: n = normalize(-dh/du, -dh/dvGL, 1) * bump – which is
 * exactly Swift's (-dx, +dy, 1) because Swift's rows run the other way.
 */
export function buildTextureData(n, bump, emission, f) {
  const count = n * n;
  const hgt = new Float32Array(count);        // Swift Texel.h is a Float, keep that precision
  const colr = new Float32Array(count * 3);
  const alb = new Uint8Array(count * 4).fill(255);
  const nrm = new Uint8Array(count * 4).fill(255);
  const orm = new Uint8Array(count * 4).fill(255);   // R = 1 (no AO), G = roughness, B = metalness
  const emi = emission ? new Uint8Array(count * 4).fill(255) : null;
  const t = makeTexel();

  // pass 1: evaluate the generator (y = image row, top first)
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    const row = y * n, out = (n - 1 - y) * n;
    for (let x = 0; x < n; x++) {
      f((x + 0.5) / n, v, t);
      const i = row + x, o = (out + x) * 4;
      hgt[i] = t.h;
      colr[i * 3] = t.cr; colr[i * 3 + 1] = t.cg; colr[i * 3 + 2] = t.cb;
      orm[o + 1] = b8(t.rough); orm[o + 2] = b8(t.metal);
      if (emi) { emi[o] = b8(t.er); emi[o + 1] = b8(t.eg); emi[o + 2] = b8(t.eb); }
    }
  }

  // pass 2: normals from the height field + cavity occlusion
  for (let y = 0; y < n; y++) {
    const row = y * n, out = (n - 1 - y) * n;
    const ym = ((y + n - 1) % n) * n, yp = ((y + 1) % n) * n;
    const ym3 = ((y + n - 3) % n) * n, yp3 = ((y + 3) % n) * n;
    for (let x = 0; x < n; x++) {
      const xm = (x + n - 1) % n, xp = (x + 1) % n;
      const xm3 = (x + n - 3) % n, xp3 = (x + 3) % n;
      const i = row + x, o = (out + x) * 4;
      const th = hgt[i];
      const dx = (hgt[row + xp] - hgt[row + xm]) * bump;
      const dy = (hgt[yp + x] - hgt[ym + x]) * bump;
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      nrm[o] = b8(-dx * inv * 0.5 + 0.5); nrm[o + 1] = b8(dy * inv * 0.5 + 0.5); nrm[o + 2] = b8(inv * 0.5 + 0.5);
      // cheap cavity occlusion baked into albedo
      const avg = (hgt[row + xp3] + hgt[row + xm3] + hgt[yp3 + x] + hgt[ym3 + x]) * 0.25;
      const ao = clampf(1 - (avg - th) * 2.2, 0.45, 1.08);
      alb[o] = b8(colr[i * 3] * ao); alb[o + 1] = b8(colr[i * 3 + 1] * ao); alb[o + 2] = b8(colr[i * 3 + 2] * ao);
    }
  }
  return { albedo: alb, normal: nrm, orm, emission: emi };
}

/**
 * Runs `f(u, v)` for every pixel and returns RGBA bytes in GL row order. All sprite images of the game are
 * monochrome, so f returns one scalar: the grey intensity (alpha = 1), or – with `alpha` – the opacity of a
 * white pixel. Alpha stays straight (Swift premultiplied for CoreGraphics; three wants it straight).
 */
export function proceduralImageData(w, h, alpha, f) {
  const px = new Uint8Array(w * h * 4).fill(255);
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h, out = (h - 1 - y) * w;
    for (let x = 0; x < w; x++) {
      const c = b8(f((x + 0.5) / w, v));
      const o = (out + x) * 4;
      if (alpha) px[o + 3] = c;
      else { px[o] = c; px[o + 1] = c; px[o + 2] = c; }
    }
  }
  return px;
}

function dataTexture(name, px, w, h, srgb, repeat, anisotropy) {
  const t = new THREE.DataTexture(px, w, h, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.name = name;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;   // DataTexture switches this off by default
  t.anisotropy = anisotropy;
  t.needsUpdate = true;
  return t;
}

/** PBR texture set: { name, map, normalMap, ormMap, emissiveMap | null } – tiling, mipmapped, anisotropy 8. */
export function buildTextureSet(name, n, bump, emission, f) {
  const d = buildTextureData(n, bump, emission, f);
  return {
    name,
    map: dataTexture(`${name}.albedo`, d.albedo, n, n, true, true, 8),
    normalMap: dataTexture(`${name}.normal`, d.normal, n, n, false, true, 8),
    ormMap: dataTexture(`${name}.orm`, d.orm, n, n, false, true, 8),
    emissiveMap: d.emission ? dataTexture(`${name}.emission`, d.emission, n, n, true, true, 8) : null,
  };
}

/** Sprite / overlay image. sRGB like the Swift CGImages, so the falloff curves match the Mac version. */
function proceduralImage(name, w, h, alpha, f, repeat = false) {
  return dataTexture(name, proceduralImageData(w, h, alpha, f), w, h, true, repeat, repeat ? 8 : 1);
}

// ---- sprite generators (u, v in 0..1, image coordinates) ----

const radius = (u, v) => Math.sqrt((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)) * 2;

export const Sprites = {
  glow: (u, v) => Math.pow(Math.max(1 - radius(u, v), 0), 2.2),
  softDot: (u, v) => Math.pow(Math.max(1 - radius(u, v), 0), 1.6),
  ring(u, v) {
    const r = radius(u, v);
    const d = (r - 0.82) / 0.07;
    return Math.exp(-d * d) + 0.25 * Math.pow(Math.max(1 - r / 0.82, 0), 0.5) * (r < 0.82 ? 1 : 0);
  },
  flare(u, v) {
    const px = (u - 0.5) * 2, py = (v - 0.5) * 2;
    const r = Math.sqrt(px * px + py * py);
    const a = Math.atan2(py, px);
    const spikes = Math.pow(Math.abs(Math.cos(a * 2.5 + 0.4)), 10) * 0.9 + Math.pow(Math.abs(Math.cos(a * 4 + 1.3)), 24) * 0.5;
    const core = Math.pow(Math.max(1 - r * 2.2, 0), 2);
    return core * 1.4 + spikes * Math.pow(Math.max(1 - r, 0), 2.5);
  },
  smoke(u, v) {
    const r = radius(u, v);
    const n = fbm(u, v, 4, 4, 91);
    const a = Math.pow(Math.max(1 - r, 0), 1.3) * sstep(0.25, 0.75, n + 0.3 * (1 - r));
    return a * 0.9;
  },
  /** vertical falloff for fake volumetric light shafts (bright at image v = 0, i.e. at the top / vGL = 1) */
  shaft(u, v) {
    const side = Math.sin(u * Math.PI);
    return Math.pow(1 - v, 1.8) * (0.35 + 0.65 * side);
  },
  hex(u, v) {
    const d = hexEdge(u * 6, v * 6 * 1.1547);
    const line = sstep(0.07, 0.0, d);
    const id = fbm(u, v, 6, 2, 4);
    return line + 0.12 * id;
  },
  scan: (u, v) => 0.55 + 0.45 * Math.sin(v * 256 * 0.8),
};

// ---- public table ----

export const Tex = {
  // Directions shared between the sky painting and the scene lighting.
  sunDir: norm(v3(0.48, 0.66, 0.42)),
  planetDir: norm(v3(-0.50, 0.50, -0.70)),

  floor: null, wallCyan: null, pillar: null, crateOrange: null, crateTeal: null, crateGrey: null,
  plating: null, tech: null,

  glow: null, softDot: null, ring: null, flare: null, smoke: null, shaft: null, hex: null, scan: null,
};

/** Lets the loading screen repaint: resolves after the next painted frame (or 40 ms if frames are throttled). */
function nextFrame() {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    // a timer queued from inside rAF fires after that frame has been presented
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => setTimeout(finish, 0));
    setTimeout(finish, 40);   // hidden / background windows do not get animation frames
  });
}

let pending = null;

/**
 * Generates every texture (Swift: Tex.preload) and fills `Tex`. Yields to the event loop between texture
 * sets; `onProgress(fraction 0..1, label)` is called before each step and once more with 1 at the end.
 */
export function initTextures(onProgress = null) {
  if (!pending) pending = generate(onProgress);
  return pending;
}

async function generate(onProgress) {
  const cyan = v3(0.25, 0.9, 1.0);
  const orange = v3(0.55, 0.25, 0.08), teal = v3(0.09, 0.29, 0.32), grey = v3(0.32, 0.34, 0.37);
  // [label, relative cost (pixels), job]
  const jobs = [
    ['Bodenplatten', 1024 * 1024, () => { Tex.floor = buildTextureSet('floor', 1024, 5, false, floorTexel); }],
    ['Wandpaneele', 1024 * 1024, () => { Tex.wallCyan = buildTextureSet('wallCyan', 1024, 5, true, (u, v, t) => wallTexel(u, v, cyan, t)); }],
    ['Säulen', 512 * 512, () => { Tex.pillar = buildTextureSet('pillar', 512, 5, true, (u, v, t) => pillarTexel(u, v, cyan, t)); }],
    ['Frachtcontainer', 512 * 512, () => { Tex.crateOrange = buildTextureSet('crateOrange', 512, 5, false, (u, v, t) => crateTexel(u, v, orange, t)); }],
    ['Frachtcontainer', 512 * 512, () => { Tex.crateTeal = buildTextureSet('crateTeal', 512, 5, false, (u, v, t) => crateTexel(u, v, teal, t)); }],
    ['Frachtcontainer', 512 * 512, () => { Tex.crateGrey = buildTextureSet('crateGrey', 512, 5, false, (u, v, t) => crateTexel(u, v, grey, t)); }],
    ['Panzerplatten', 512 * 512, () => { Tex.plating = buildTextureSet('plating', 512, 4, false, platingTexel); }],
    ['Technikmodule', 512 * 512, () => { Tex.tech = buildTextureSet('tech', 512, 5, true, techTexel); }],
    ['Lichteffekte', 512 * 512, () => {
      Tex.glow = proceduralImage('glow', 128, 128, false, Sprites.glow);
      Tex.softDot = proceduralImage('softDot', 64, 64, true, Sprites.softDot);
      Tex.ring = proceduralImage('ring', 256, 256, false, Sprites.ring);
      Tex.flare = proceduralImage('flare', 256, 256, false, Sprites.flare);
      Tex.smoke = proceduralImage('smoke', 128, 128, true, Sprites.smoke);
      Tex.shaft = proceduralImage('shaft', 64, 256, false, Sprites.shaft);
      Tex.hex = proceduralImage('hex', 512, 512, false, Sprites.hex, true);   // the portal surface tiles it
      Tex.scan = proceduralImage('scan', 8, 256, false, Sprites.scan);
    }],
  ];
  const total = jobs.reduce((s, j) => s + j[1], 0);
  let done = 0;
  for (const [label, cost, job] of jobs) {
    if (onProgress) onProgress(done / total, label);
    await nextFrame();
    job();
    done += cost;
  }
  if (onProgress) onProgress(1, 'Bereit');
  return Tex;
}
