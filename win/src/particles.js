// CPU-simulated, GPU-instanced particles. Replaces SceneKit's SCNParticleSystem.
//
// One instanced quad batch per (image, blend mode). Configs use the SCNParticleSystem field names that
// Effects.swift / Level.swift set, so the effect code reads like the original:
//   particleImage ('glow' | 'softDot' | 'smoke'), blendMode ('additive' | 'alpha'), loops, emissionDuration,
//   birthRate (particles per emissionDuration – a non-looping burst emits exactly birthRate particles),
//   particleLifeSpan(+Variation), particleVelocity(+Variation), emittingDirection, spreadingAngle (deg, half angle),
//   particleSize(+Variation), stretchFactor, isAffectedByGravity, acceleration, dampingFactor,
//   particleColor {x,y,z,w?} (+particleColorVariation {x,y,z}: hue/sat/bright jitter),
//   particleAngleVariation / particleAngularVelocityVariation (deg), emitterShape {box:[w,h,l]} | {cyl:[r,h]},
//   birthLocation 'volume', warmupDuration, opacity / size curves {values, keyTimes} over normalised life.
// Variations are ± variation / 2. Size curves MULTIPLY the particle's base size; opacity curves set alpha.

import * as THREE from 'three';
import { Tex } from './textures.js';

const GRAVITY = -16;   // Swift: scene.physicsWorld.gravity

const VERT = /* glsl */`
  attribute vec3 iPos;
  attribute vec3 iVel;
  attribute vec4 iColor;
  attribute vec2 iSizeRot;   // size, rotation
  attribute float iStretch;
  varying vec2 vUv;
  varying vec4 vColor;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vColor = iColor;
    vec4 mv = viewMatrix * vec4(iPos, 1.0);
    vec2 corner = position.xy;          // -0.5 .. 0.5
    float size = iSizeRot.x;
    vec2 axisX = vec2(cos(iSizeRot.y), sin(iSizeRot.y));
    vec2 axisY = vec2(-axisX.y, axisX.x);
    vec2 offset;
    if (iStretch > 0.0) {
      // velocity-aligned streak in view space
      vec3 vv = (viewMatrix * vec4(iVel, 0.0)).xyz;
      float sp = length(vv.xy);
      vec2 dir = sp > 1e-4 ? vv.xy / sp : vec2(1.0, 0.0);
      vec2 perp = vec2(-dir.y, dir.x);
      float lenA = size + length(iVel) * iStretch;
      offset = dir * corner.x * lenA + perp * corner.y * size;
    } else {
      offset = (axisX * corner.x + axisY * corner.y) * size;
    }
    mv.xy += offset;
    gl_Position = projectionMatrix * mv;
    vec4 mvPosition = mv;
    #include <fog_vertex>
  }
`;

const FRAG = /* glsl */`
  uniform sampler2D map;
  uniform float additive;
  varying vec2 vUv;
  varying vec4 vColor;
  #include <fog_pars_fragment>
  void main() {
    vec4 t = texture2D(map, vUv);
    vec4 c = vec4(vColor.rgb * t.rgb, vColor.a * t.a);
    if (c.a < 0.002) discard;
    gl_FragColor = c;
    #include <fog_fragment>
  }
`;

const CAPACITY = { softDot: 3000, glow: 1500, smoke: 600 };

class Batch {
  constructor(scene, image, blend) {
    const cap = CAPACITY[image] || 1000;
    this.cap = cap;
    this.count = 0;
    const quad = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = quad.index;
    g.setAttribute('position', quad.getAttribute('position'));
    g.setAttribute('uv', quad.getAttribute('uv'));
    this.pos = new Float32Array(cap * 3);
    this.vel = new Float32Array(cap * 3);
    this.col = new Float32Array(cap * 4);
    this.sr = new Float32Array(cap * 2);
    this.st = new Float32Array(cap);
    const ia = (arr, n) => { const a = new THREE.InstancedBufferAttribute(arr, n); a.setUsage(THREE.DynamicDrawUsage); return a; };
    this.aPos = ia(this.pos, 3); this.aVel = ia(this.vel, 3); this.aCol = ia(this.col, 4);
    this.aSR = ia(this.sr, 2); this.aSt = ia(this.st, 1);
    g.setAttribute('iPos', this.aPos);
    g.setAttribute('iVel', this.aVel);
    g.setAttribute('iColor', this.aCol);
    g.setAttribute('iSizeRot', this.aSR);
    g.setAttribute('iStretch', this.aSt);
    g.instanceCount = 0;
    const additive = blend !== 'alpha';
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { map: { value: Tex[image] }, additive: { value: additive ? 1 : 0 } }]),
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      fog: !additive,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = additive ? 40 : 35;
    this.mesh.name = `particles:${image}:${blend}`;
    scene.add(this.mesh);
    this.geometry = g;
    // particle records (struct of arrays would be faster; a few thousand objects are fine)
    this.parts = [];
  }

  add(p) {
    if (this.parts.length >= this.cap) {
      // drop the oldest one-shot particle to make room (never starve new effects)
      this.parts.shift();
    }
    this.parts.push(p);
  }

  update(dt) {
    const parts = this.parts;
    let w = 0;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.age += dt;
      if (p.age >= p.life) continue;
      const k = Math.exp(-p.damp * dt);
      p.vx = p.vx * k + p.ax * dt;
      p.vy = p.vy * k + (p.ay + (p.grav ? GRAVITY : 0)) * dt;
      p.vz = p.vz * k + p.az * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.rot += p.av * dt;
      parts[w++] = p;
    }
    parts.length = w;
    const n = Math.min(w, this.cap);
    const pos = this.pos, vel = this.vel, col = this.col, sr = this.sr, st = this.st;
    for (let i = 0; i < n; i++) {
      const p = parts[i];
      const t = p.age / p.life;
      const a = p.opacity ? curve(p.opacity, t) : 1;
      const s = p.sizeCurve ? curve(p.sizeCurve, t) : 1;
      pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
      vel[i * 3] = p.vx; vel[i * 3 + 1] = p.vy; vel[i * 3 + 2] = p.vz;
      col[i * 4] = p.r; col[i * 4 + 1] = p.g; col[i * 4 + 2] = p.b; col[i * 4 + 3] = p.a * a;
      sr[i * 2] = p.size * s; sr[i * 2 + 1] = p.rot;
      st[i] = p.stretch;
    }
    this.geometry.instanceCount = n;
    if (n > 0) {
      for (const a of [this.aPos, this.aVel, this.aCol, this.aSR, this.aSt]) {
        a.clearUpdateRanges();
        a.addUpdateRange(0, n * a.itemSize);
        a.needsUpdate = true;
      }
    }
  }

  clear(keep) {
    this.parts = this.parts.filter((p) => keep(p));
  }
}

/** Keyframe curve {values, keyTimes} evaluated at normalised time t (linear between keys). */
function curve(c, t) {
  const v = c.values, k = c.keyTimes;
  if (t <= k[0]) return v[0];
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i]) {
      const f = (t - k[i - 1]) / Math.max(k[i] - k[i - 1], 1e-6);
      return v[i - 1] + (v[i] - v[i - 1]) * f;
    }
  }
  return v[v.length - 1];
}

const _col = new THREE.Color();
const _hsl = { h: 0, s: 0, l: 0 };

function vary(base, variation) { return base + (variation ? (Math.random() - 0.5) * variation : 0); }

/** Random direction inside a cone of half angle `spreadDeg` around unit vector dir. */
function coneDir(dir, spreadDeg) {
  const spread = Math.min(spreadDeg, 180) * Math.PI / 180;
  const cosMax = Math.cos(spread);
  const z = cosMax + Math.random() * (1 - cosMax);
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  const phi = Math.random() * Math.PI * 2;
  const lx = r * Math.cos(phi), ly = r * Math.sin(phi), lz = z;
  // basis around dir
  const dx = dir.x, dy = dir.y, dz = dir.z;
  let ux, uy, uz;
  if (Math.abs(dy) < 0.99) { ux = dz; uy = 0; uz = -dx; } else { ux = 1; uy = 0; uz = 0; }
  let ul = Math.hypot(ux, uy, uz); ux /= ul; uy /= ul; uz /= ul;
  const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
  return { x: ux * lx + vx * ly + dx * lz, y: uy * lx + vy * ly + dy * lz, z: uz * lx + vz * ly + dz * lz };
}

export class Particles {
  constructor(scene) {
    this.scene = scene;
    this.batches = new Map();
    this.emitters = [];
  }

  batch(cfg) {
    const image = cfg.particleImage || 'softDot';
    const blend = cfg.blendMode === 'alpha' ? 'alpha' : 'additive';
    const key = `${image}|${blend}`;
    let b = this.batches.get(key);
    if (!b) { b = new Batch(this.scene, image, blend); this.batches.set(key, b); }
    return b;
  }

  /** Spawns one particle from cfg at world position (x, y, z), emitting around dir. */
  spawn(cfg, b, x, y, z, dir, looping) {
    let px = x, py = y, pz = z;
    const shape = cfg.emitterShape;
    if (shape) {
      if (shape.box) {
        px += (Math.random() - 0.5) * shape.box[0];
        py += (Math.random() - 0.5) * shape.box[1];
        pz += (Math.random() - 0.5) * shape.box[2];
      } else if (shape.cyl) {
        const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * shape.cyl[0];
        px += Math.cos(a) * rr; pz += Math.sin(a) * rr;
        py += (Math.random() - 0.5) * shape.cyl[1];
      }
    }
    const d = coneDir(dir, cfg.spreadingAngle ?? 0);
    const sp = Math.max(0, vary(cfg.particleVelocity || 0, cfg.particleVelocityVariation));
    const c = cfg.particleColor || { x: 1, y: 1, z: 1, w: 1 };
    let r = c.x, g = c.y, bl = c.z;
    const cv = cfg.particleColorVariation;
    if (cv) {
      _col.setRGB(r, g, bl, THREE.SRGBColorSpace).getHSL(_hsl, THREE.SRGBColorSpace);
      _col.setHSL(_hsl.h + (Math.random() - 0.5) * cv.x, Math.min(1, Math.max(0, _hsl.s + (Math.random() - 0.5) * cv.y)),
        Math.min(1, Math.max(0, _hsl.l + (Math.random() - 0.5) * cv.z)), THREE.SRGBColorSpace);
    } else {
      _col.setRGB(r, g, bl, THREE.SRGBColorSpace);
    }
    const acc = cfg.acceleration || { x: 0, y: 0, z: 0 };
    b.add({
      x: px, y: py, z: pz,
      vx: d.x * sp, vy: d.y * sp, vz: d.z * sp,
      ax: acc.x, ay: acc.y, az: acc.z,
      grav: !!cfg.isAffectedByGravity,
      damp: cfg.dampingFactor || 0,
      age: 0,
      life: Math.max(0.02, vary(cfg.particleLifeSpan || 1, cfg.particleLifeSpanVariation)),
      size: Math.max(0.001, vary(cfg.particleSize || 0.1, cfg.particleSizeVariation)),
      rot: ((cfg.particleAngle || 0) + (Math.random() - 0.5) * (cfg.particleAngleVariation || 0)) * Math.PI / 180,
      av: (Math.random() - 0.5) * (cfg.particleAngularVelocityVariation || 0) * Math.PI / 180,
      stretch: cfg.stretchFactor || 0,
      r: _col.r * (cfg.intensity || 1), g: _col.g * (cfg.intensity || 1), b: _col.b * (cfg.intensity || 1),
      a: c.w ?? 1,
      opacity: cfg.opacity || null,
      sizeCurve: cfg.size || null,
      looping,
    });
  }

  /** One-shot burst (loops = false). pos {x,y,z}; dir = emitting direction in world space (default +Y). */
  burst(cfg, pos, dir = null) {
    const b = this.batch(cfg);
    const d = dir || cfg.emittingDirection || { x: 0, y: 1, z: 0 };
    const n = Math.max(1, Math.round(cfg.birthRate || 1));
    for (let i = 0; i < n; i++) this.spawn(cfg, b, pos.x, pos.y, pos.z, d, false);
  }

  /** Looping emitter. Returns a handle { position (mutable), active, remove() }. */
  emitter(cfg) {
    const em = {
      cfg,
      position: { x: 0, y: 0, z: 0 },
      active: true,
      acc: 0,
      removed: false,
      remove: () => { em.removed = true; em.active = false; },
    };
    this.emitters.push(em);
    if (cfg.warmupDuration) {
      // pre-simulate so the effect is already in full swing on the first frame
      const step = 1 / 30;
      for (let t = 0; t < cfg.warmupDuration; t += step) this.emitStep(em, step);
      const b = this.batch(cfg);
      for (let t = 0; t < cfg.warmupDuration; t += step) b.update(step);
    }
    return em;
  }

  emitStep(em, dt) {
    if (!em.active) return;
    const cfg = em.cfg;
    const rate = (cfg.birthRate || 0) / (cfg.emissionDuration || 1);
    em.acc += rate * dt;
    const b = this.batch(cfg);
    const d = cfg.emittingDirection || { x: 0, y: 1, z: 0 };
    while (em.acc >= 1) {
      em.acc -= 1;
      this.spawn(cfg, b, em.position.x, em.position.y, em.position.z, d, true);
    }
  }

  update(dt) {
    let w = 0;
    for (let i = 0; i < this.emitters.length; i++) {
      const em = this.emitters[i];
      if (em.removed) continue;
      this.emitStep(em, dt);
      this.emitters[w++] = em;
    }
    this.emitters.length = w;
    for (const b of this.batches.values()) b.update(dt);
  }

  /** Removes one-shot particles (looping emitters and their particles stay). */
  clear() {
    for (const b of this.batches.values()) b.clear((p) => p.looping);
  }

  get count() {
    let n = 0;
    for (const b of this.batches.values()) n += b.parts.length;
    return n;
  }
}
