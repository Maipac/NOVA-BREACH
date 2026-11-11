// Enemy kinds, stats and models. Mirrors Sources/Enemies.swift.
//
// Every model is assembled from the same primitives, sizes, offsets and rotations as the Swift version.
// Local model space: +Z is the enemy's forward, +X its right (see Enemy.forward / Enemy.right).

import * as THREE from 'three';
import { v3, cp, sub, mul, dot, frand } from './math.js';
import { Geo, Mat, setPos, orientZ } from './gfx.js';

export const ALL_KINDS = ['skitter', 'drone', 'trooper', 'roller', 'brute', 'boss'];

export const KindInfo = {
  skitter: { displayName: 'SKITTER', hp: 38, speed: 6.6, radius: 0.6, height: 0.9, score: 50, cost: 1, flies: false, glow: v3(1.0, 0.2, 0.1) },
  drone: { displayName: 'DROHNE', hp: 30, speed: 6.0, radius: 0.6, height: 1.0, score: 75, cost: 1.5, flies: true, glow: v3(1.0, 0.55, 0.1) },
  trooper: { displayName: 'TROOPER', hp: 95, speed: 3.6, radius: 0.45, height: 1.95, score: 150, cost: 3, flies: false, glow: v3(1.0, 0.15, 0.4) },
  roller: { displayName: 'ROLLMINE', hp: 45, speed: 8.6, radius: 0.6, height: 1.1, score: 100, cost: 2, flies: false, glow: v3(1.0, 0.8, 0.1) },
  brute: { displayName: 'KOLOSS', hp: 420, speed: 2.3, radius: 1.0, height: 3.1, score: 500, cost: 9, flies: false, glow: v3(1.0, 0.32, 0.05) },
  boss: { displayName: 'OVERSEER', hp: 2600, speed: 3.0, radius: 2.3, height: 4.0, score: 5000, cost: 0, flies: true, glow: v3(1.0, 0.1, 0.18) },
};

// SceneKit composes eulerAngles as Rz * Ry * Rx (checked against SCNNode.simdTransform), which is three's
// 'ZYX' order, not its default 'XYZ'. Every node the game animates with Euler angles (node, model, leg
// pivots, spinners) gets this order, so `rotation.set(a, b, c)` means the same as `simdEulerAngles = V3(a, b, c)`.
const SCN_EULER = 'ZYX';

// SceneKit shadows fall on every lit surface; Geo.part leaves receiveShadow off, so armour turns it on here.
const RECEIVE_SHADOWS = true;

// Geometries are shared between all enemies (keyed by primitive + arguments) and live for the whole session:
// spawning and killing hundreds of enemies must not allocate or leak GPU buffers. Materials stay per enemy
// (setFlash mutates them); they hold no GPU resources of their own, so nothing has to be disposed on death.
const geoCache = new Map();
function shared(prim, ...args) {
  const key = `${prim}:${args.join(',')}`;
  let g = geoCache.get(key);
  if (!g) { g = Geo[prim](...args); geoCache.set(key, g); }
  return g;
}
const G = {
  box: (w, h, l, chamfer = 0) => shared('box', w, h, l, chamfer),
  sphere: (r, segments = 24) => shared('sphere', r, segments),
  cyl: (r, h, segments = 24) => shared('cyl', r, h, segments),
  capsule: (r, h) => shared('capsule', r, h),
  cone: (top, bottom, h, segments = 24) => shared('cone', top, bottom, h, segments),
  torus: (ring, pipe) => shared('torus', ring, pipe),
  pyramid: (w, h, l) => shared('pyramid', w, h, l),
};

/** Geo.part plus the SceneKit Euler order and shadow reception for everything that casts. */
function part(parent, geo, mat, pos, opts) {
  const m = Geo.part(parent, geo, mat, pos, opts);
  m.rotation.order = SCN_EULER;
  m.receiveShadow = RECEIVE_SHADOWS && m.castShadow;
  return m;
}

/** Empty joint node (Swift: SCNNode() + simdPosition + addChildNode). */
function pivot(parent, pos = null) {
  const n = new THREE.Group();
  n.rotation.order = SCN_EULER;
  if (pos) setPos(n, pos);
  parent.add(n);
  return n;
}

const _spikeTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

export class Enemy {
  constructor(kind, pos, hpScale) {
    const info = KindInfo[kind];
    this.kind = kind;
    this.node = new THREE.Group();
    this.model = new THREE.Group();
    this.node.rotation.order = SCN_EULER;
    this.model.rotation.order = SCN_EULER;
    this.pos = cp(pos);
    this.vel = v3(0, 0, 0);
    this.yaw = 0;
    this.maxHp = info.hp * hpScale;
    this.hp = this.maxHp;
    this.radius = info.radius;
    this.height = info.height;
    this.speed = info.speed * frand(0.92, 1.08);
    this.attackCD = frand(0.8, 2.0);
    this.burst = 0;
    this.burstT = 0;
    this.flash = 0;
    this.anim = frand(0, 10);
    this.strafe = frand() < 0.5 ? -1 : 1;
    this.strafeT = frand(1.5, 4);
    this.spawnT = 0.45;
    this.dead = false;
    this.state = 0;
    this.stateT = 0;
    this.sees = false;
    this.losT = frand(0, 0.2);
    this.side = 0;
    this.armor = [];
    this.legs = [];
    this.spinners = [];
    this.hits = [];
    this.muzzles = [];
    this.debrisMat = null;   // set by build() (Swift's placeholder material is always replaced there)
    this.blink = null;       // roller only: the pulsing glow sprite (Swift: model.childNode(withName: "blink"))
    this.node.add(this.model);
    this.build();
    setPos(this.node, this.pos);
    this.node.scale.set(0.01, 0.01, 0.01);
  }

  get forward() { return v3(Math.sin(this.yaw), 0, Math.cos(this.yaw)); }
  get right() { return v3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)); }
  /** local (right, up, forward) offset to world space */
  world(o) {
    const s = Math.sin(this.yaw), c = Math.cos(this.yaw);
    return v3(this.pos.x + c * o.x + s * o.z, this.pos.y + o.y, this.pos.z - s * o.x + c * o.z);
  }
  get center() { return v3(this.pos.x, this.pos.y + (KindInfo[this.kind].flies ? 0 : this.height * 0.55), this.pos.z); }

  armorMat(c, rough = 0.38) {
    const m = Mat.metal(c, { rough, plating: 1 });
    m.normalScale.set(0.45, 0.45);
    this.armor.push(m);
    return m;
  }

  build() {
    const model = this.model;
    const dark = this.armorMat(v3(0.075, 0.078, 0.09), 0.3);
    const glowC = KindInfo[this.kind].glow;
    const glow = Mat.glow(glowC, 5);
    switch (this.kind) {
      case 'skitter': {
        const paint = this.armorMat(v3(0.20, 0.035, 0.03), 0.34);
        const body = part(model, G.sphere(0.5, 20), paint, v3(0, 0.48, 0));
        body.scale.set(0.95, 0.5, 1.3);
        const head = part(model, G.sphere(0.3, 16), dark, v3(0, 0.46, 0.6));
        head.scale.set(1, 0.7, 1);
        part(model, G.box(0.36, 0.07, 0.1), glow, v3(0, 0.5, 0.86), { shadow: false });
        part(model, G.box(0.06, 0.05, 0.9), glow, v3(0, 0.74, -0.05), { shadow: false });
        part(model, G.pyramid(0.16, 0.5, 0.16), dark, v3(0.14, 0.4, 0.82), { rot: v3(Math.PI / 2, 0, 0) });
        part(model, G.pyramid(0.16, 0.5, 0.16), dark, v3(-0.14, 0.4, 0.82), { rot: v3(Math.PI / 2, 0, 0) });
        [0.4, 0.0, -0.4].forEach((z, i) => {
          for (const sd of [-1, 1]) {
            const p = pivot(model, v3(sd * 0.36, 0.5, z));
            part(p, G.box(0.55, 0.08, 0.09), dark, v3(sd * 0.25, 0.14, 0), { rot: v3(0, 0, sd * 0.55) });
            part(p, G.box(0.07, 0.72, 0.07), dark, v3(sd * 0.56, -0.1, 0), { rot: v3(0, 0, sd * 0.22) });
            p.name = `${i}`;
            this.legs.push(p);
          }
        });
        this.hits = [{ offset: v3(0, 0.5, 0), r: 0.68, crit: false }];
        const g = Geo.glowSprite(1.6, glowC, 0.35); setPos(g, v3(0, 0.5, 0.5)); model.add(g);
        break;
      }
      case 'drone': {
        const paint = this.armorMat(v3(0.24, 0.13, 0.03), 0.32);
        part(model, G.sphere(0.42), dark, v3(0, 0, 0));
        part(model, G.sphere(0.17, 16), glow, v3(0, 0.02, 0.33), { shadow: false });
        const ringHolder = pivot(model);
        part(ringHolder, G.torus(0.68, 0.055), paint, v3(0, 0, 0));
        for (let a = 0; a < 3; a++) {
          const ang = a / 3 * 2 * Math.PI;
          part(ringHolder, G.box(0.12, 0.05, 0.32), glow, v3(Math.sin(ang) * 0.68, 0, Math.cos(ang) * 0.68), { rot: v3(0, ang, 0), shadow: false });
        }
        this.spinners.push(ringHolder);
        for (const sd of [-1, 1]) {
          part(model, G.box(0.16, 0.16, 0.6, 0.04), paint, v3(sd * 0.52, -0.05, -0.05));
          part(model, G.cyl(0.05, 0.06, 10), Mat.glow(v3(0.3, 0.8, 1), 5), v3(sd * 0.52, -0.05, -0.37), { rot: v3(Math.PI / 2, 0, 0), shadow: false });
        }
        part(model, G.cyl(0.05, 0.45, 10), dark, v3(0, -0.3, 0.3), { rot: v3(Math.PI / 2, 0, 0) });
        const g = Geo.glowSprite(1.5, glowC, 0.4); setPos(g, v3(0, 0, 0.35)); model.add(g);
        this.hits = [{ offset: v3(0, 0, 0), r: 0.7, crit: false }];
        this.muzzles = [v3(0, -0.3, 0.55)];
        break;
      }
      case 'trooper': {
        const paint = this.armorMat(v3(0.17, 0.03, 0.07), 0.32);
        for (const sd of [-1, 1]) {
          const hip = pivot(model, v3(sd * 0.17, 0.98, 0));
          part(hip, G.capsule(0.105, 0.55), dark, v3(0, -0.25, 0));
          const knee = pivot(hip, v3(0, -0.5, 0));
          part(knee, G.capsule(0.085, 0.52), paint, v3(0, -0.22, 0));
          part(knee, G.box(0.15, 0.09, 0.3, 0.02), dark, v3(0, -0.45, 0.06));
          this.legs.push(hip); this.legs.push(knee);
          part(model, G.sphere(0.16, 14), paint, v3(sd * 0.37, 1.62, 0));
          part(model, G.capsule(0.075, 0.6), dark, v3(sd * 0.36, 1.38, 0.22), { rot: v3(1.15, 0, 0) });
        }
        part(model, G.box(0.42, 0.2, 0.28, 0.04), dark, v3(0, 1.02, 0));
        part(model, G.box(0.58, 0.56, 0.36, 0.07), paint, v3(0, 1.4, 0));
        part(model, G.box(0.22, 0.05, 0.03), glow, v3(0, 1.5, 0.185), { shadow: false });
        part(model, G.box(0.3, 0.42, 0.14, 0.03), dark, v3(0, 1.42, -0.22));
        const head = part(model, G.sphere(0.175, 16), dark, v3(0, 1.84, 0.02));
        head.scale.set(1, 1.1, 1.1);
        part(model, G.box(0.26, 0.065, 0.12), glow, v3(0, 1.86, 0.13), { shadow: false });
        part(model, G.box(0.09, 0.13, 0.8, 0.02), dark, v3(0.2, 1.28, 0.55));
        part(model, G.box(0.05, 0.05, 0.3), glow, v3(0.2, 1.36, 0.6), { shadow: false });
        const g = Geo.glowSprite(0.9, glowC, 0.4); setPos(g, v3(0, 1.86, 0.2)); model.add(g);
        this.hits = [{ offset: v3(0, 0.55, 0), r: 0.42, crit: false }, { offset: v3(0, 1.2, 0), r: 0.5, crit: false },
          { offset: v3(0, 1.84, 0), r: 0.26, crit: true }];
        this.muzzles = [v3(0.2, 1.3, 1.0)];
        break;
      }
      case 'roller': {
        const ball = pivot(model, v3(0, 0.55, 0));
        part(ball, G.sphere(0.55), dark, v3(0, 0, 0));
        part(ball, G.torus(0.555, 0.04), glow, v3(0, 0, 0), { shadow: false });
        part(ball, G.torus(0.555, 0.04), glow, v3(0, 0, 0), { rot: v3(0, 0, Math.PI / 2), shadow: false });
        part(ball, G.torus(0.555, 0.04), glow, v3(0, 0, 0), { rot: v3(Math.PI / 2, 0, 0), shadow: false });
        for (let a = 0; a < 6; a++) {
          const d = [v3(1, 0, 0), v3(-1, 0, 0), v3(0, 1, 0), v3(0, -1, 0), v3(0, 0, 1), v3(0, 0, -1)][a];
          const sp = part(ball, G.cone(0, 0.09, 0.3, 8), dark, mul(d, 0.62));
          // cone axis is +Y: aim +Z along d, then tip the apex from +Y into +Z
          orientZ(sp, d); sp.quaternion.multiply(_spikeTilt);
        }
        this.spinners.push(ball);
        const g = Geo.glowSprite(2.2, glowC, 0.5); setPos(g, v3(0, 0.55, 0)); g.name = 'blink'; model.add(g);
        this.blink = g;
        this.hits = [{ offset: v3(0, 0.55, 0), r: 0.66, crit: false }];
        break;
      }
      case 'brute': {
        const paint = this.armorMat(v3(0.20, 0.07, 0.025), 0.34);
        for (const sd of [-1, 1]) {
          const hip = pivot(model, v3(sd * 0.5, 1.3, 0));
          part(hip, G.capsule(0.3, 1.3), dark, v3(0, -0.6, 0));
          part(hip, G.box(0.5, 0.5, 0.62, 0.12), paint, v3(0, -0.45, 0.06));
          part(hip, G.box(0.56, 0.3, 0.75, 0.06), paint, v3(0, -1.15, 0.08));
          this.legs.push(hip);
          part(model, G.sphere(0.52, 20), paint, v3(sd * 1.18, 2.55, 0)).scale.set(1, 0.85, 1.15);
          part(model, G.capsule(0.22, 1.15), dark, v3(sd * 1.25, 1.75, 0.1));
          part(model, G.sphere(0.3, 14), paint, v3(sd * 1.25, 1.18, 0.12));
          part(model, G.cyl(0.17, 1.1, 14), dark, v3(sd * 1.18, 2.95, 0.4), { rot: v3(Math.PI / 2, 0, 0) });
          part(model, G.cyl(0.12, 0.05, 14), glow, v3(sd * 1.18, 2.95, 0.96), { rot: v3(Math.PI / 2, 0, 0), shadow: false });
          this.muzzles.push(v3(sd * 1.18, 2.95, 1.1));
        }
        part(model, G.box(1.35, 0.42, 0.85, 0.08), dark, v3(0, 1.35, 0));
        part(model, G.box(1.75, 1.25, 1.15, 0.34), dark, v3(0, 2.15, 0));
        part(model, G.box(1.25, 0.42, 0.3, 0.1), paint, v3(0, 2.5, 0.5));
        part(model, G.box(0.9, 0.3, 0.2, 0.08), paint, v3(0, 1.62, 0.5));
        part(model, G.sphere(0.27, 16), glow, v3(0, 2.0, 0.52), { shadow: false });
        part(model, G.torus(0.34, 0.05), paint, v3(0, 2.0, 0.56), { rot: v3(Math.PI / 2, 0, 0) });
        part(model, G.box(0.42, 0.32, 0.42, 0.06), dark, v3(0, 2.92, 0.2));
        part(model, G.box(0.3, 0.07, 0.05), glow, v3(0, 2.94, 0.42), { shadow: false });
        const g = Geo.glowSprite(2.2, glowC, 0.45); setPos(g, v3(0, 2.0, 0.7)); model.add(g);
        this.hits = [{ offset: v3(0, 0.8, 0), r: 0.8, crit: false }, { offset: v3(0, 2.1, 0), r: 1.15, crit: false },
          { offset: v3(0, 2.0, 0.6), r: 0.4, crit: true }, { offset: v3(0, 2.92, 0.2), r: 0.3, crit: true }];
        break;
      }
      case 'boss': {
        const paint = this.armorMat(v3(0.16, 0.02, 0.04), 0.3);
        part(model, G.sphere(1.8, 36), dark, v3(0, 0, 0));
        part(model, G.sphere(0.72, 24), glow, v3(0, 0, 1.38), { shadow: false });
        part(model, G.torus(0.85, 0.12), paint, v3(0, 0, 1.55), { rot: v3(Math.PI / 2, 0, 0) });
        part(model, G.sphere(0.25, 12), Mat.glow(v3(1, 0.9, 0.7), 8), v3(0, 0, 2.02), { shadow: false });
        [2.7, 3.2, 3.7].forEach((r, i) => {
          const h = pivot(model);
          part(h, G.torus(r, 0.11), paint, v3(0, 0, 0));
          part(h, G.torus(r, 0.045), glow, v3(0, 0.13, 0), { shadow: false });
          h.rotation.set(i * 0.5 + 0.2, 0, i * 0.4);
          this.spinners.push(h);
        });
        for (let a = 0; a < 4; a++) {
          const ang = a / 4 * 2 * Math.PI + Math.PI / 4;
          const fin = part(model, G.box(0.22, 2.6, 1.2, 0.1), dark, v3(Math.sin(ang) * 1.9, 0.3, Math.cos(ang) * 1.9), { rot: v3(0, ang, 0) });
          fin.rotation.set(0, ang, 0.0);
          part(model, G.box(0.08, 2.2, 0.08), glow, v3(Math.sin(ang) * 2.06, 0.3, Math.cos(ang) * 2.06), { shadow: false });
        }
        part(model, G.cone(0.2, 1.3, 1.6), dark, v3(0, -2.2, 0));
        part(model, G.cyl(1.0, 0.08), glow, v3(0, -3.0, 0), { shadow: false });
        part(model, G.cone(0.0, 0.5, 1.8, 12), dark, v3(0, 2.4, 0));
        const g = Geo.glowSprite(7, glowC, 0.5); setPos(g, v3(0, 0, 1.6)); model.add(g);
        const g2 = Geo.glowSprite(5, v3(1, 0.4, 0.1), 0.5); setPos(g2, v3(0, -3.1, 0)); model.add(g2);
        this.hits = [{ offset: v3(0, 0, 0), r: 2.0, crit: false }, { offset: v3(0, 0, 1.45), r: 0.85, crit: true }];
        this.muzzles = [v3(0, 0, 2.2), v3(1.6, -0.6, 1.4), v3(-1.6, -0.6, 1.4)];
        break;
      }
    }
    this.debrisMat = this.armor[this.armor.length - 1] ?? dark;
  }

  /** White hit flash on all armour (Swift: emission white, intensity 1.6). */
  setFlash(on) {
    const e = on ? 1 : 0;
    for (const m of this.armor) {
      m.emissive.setRGB(e, e, e);
      m.emissiveIntensity = on ? 1.6 : 0;
    }
  }

  /** Ray against the hit spheres. Returns distance along the ray and whether it was a weak point. */
  rayHit(o, d, maxT, inflate = 0) {
    let body = Infinity, weak = Infinity;
    for (const h of this.hits) {
      const c = this.world(h.offset);
      const r = h.r + inflate;
      const oc = sub(o, c);
      const b = dot(oc, d);
      const cc = dot(oc, oc) - r * r;
      const disc = b * b - cc;
      if (disc < 0) continue;
      let t = -b - Math.sqrt(disc);
      if (t < 0) t = cc < 0 ? 0 : -1;
      if (t < 0 || t > maxT) continue;
      if (h.crit) weak = Math.min(weak, t); else body = Math.min(body, t);
    }
    // a weak point counts when the ray reaches it before (or just inside) the body shell
    if (weak < Infinity && weak <= body + 0.7) return { t: Math.min(weak, body), crit: true };
    if (body < Infinity) return { t: body, crit: false };
    return null;
  }
}
