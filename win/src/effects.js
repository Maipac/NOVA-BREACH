// Visual effects: tracers, impacts, explosions, debris, light flashes, camera trauma, tweens.
// Mirrors Sources/Effects.swift. SCNAction animations become tweens that only advance in update(dt),
// so the pause screen freezes them exactly like scene.isPaused did.

import * as THREE from 'three';
import { Tex } from './textures.js';
import { Particles } from './particles.js';
import { v3, add, mul, addMul, sub, len, mix3, frand, randUnit } from './math.js';
import { Geo, Mat, col, setPos, orientZ, lightBothLayers } from './gfx.js';

/**
 * SceneKit light intensities are "lumens"-like units (1000 ≈ one standard light). three's PointLight is
 * in candela with physical inverse-square falloff. One constant converts every intensity in the game,
 * picked so that a 3000-unit omni (the reactor light) lights the arena like the Mac version.
 */
export const LUMEN_TO_CANDELA = 0.03;

const GRAVITY = -16;

const fade = (values, keyTimes) => ({ values, keyTimes });

export class Effects {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'fx';
    scene.add(this.root);
    this.particles = new Particles(scene);
    this.trauma = 0;

    this.lights = [];
    this.lightIdx = 0;
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffffff, 0, 16, 2);
      lightBothLayers(l);
      this.root.add(l);
      this.lights.push({ light: l, t: 1, dur: 1, peak: 0 });
    }

    this.tweens = [];
    this.debrisList = [];
    this.trails = [];
    this.unitBox = new THREE.BoxGeometry(1, 1, 1);
    this.unitPlane = new THREE.PlaneGeometry(1, 1);
    this.beamMats = new Map();

    this.sparks = {
      particleImage: 'softDot', blendMode: 'additive',
      birthRate: 16, particleLifeSpan: 0.32, particleLifeSpanVariation: 0.2,
      particleVelocity: 7, particleVelocityVariation: 5, spreadingAngle: 55,
      particleSize: 0.035, particleSizeVariation: 0.02, stretchFactor: 0.06,
      isAffectedByGravity: true, particleColor: { x: 1, y: 0.8, z: 0.4, w: 1 },
      opacity: fade([1, 1, 0], [0, 0.6, 1]), intensity: 3,
    };
    this.fire = {
      particleImage: 'glow', blendMode: 'additive',
      birthRate: 34, particleLifeSpan: 0.5, particleLifeSpanVariation: 0.25,
      particleVelocity: 3.5, particleVelocityVariation: 3, spreadingAngle: 180,
      particleSize: 1.0, particleSizeVariation: 0.6,
      particleColor: { x: 1, y: 0.55, z: 0.18, w: 1 }, particleColorVariation: { x: 0.04, y: 0.1, z: 0.1 },
      dampingFactor: 2.5, intensity: 1.3,
      opacity: fade([0.9, 0.7, 0], [0, 0.35, 1]), size: fade([0.5, 1.5, 2.0], [0, 0.4, 1]),
    };
    this.smoke = {
      particleImage: 'smoke', blendMode: 'alpha',
      birthRate: 14, particleLifeSpan: 1.6, particleLifeSpanVariation: 0.6,
      particleVelocity: 1.6, particleVelocityVariation: 1.2, spreadingAngle: 180,
      particleSize: 1.3, particleSizeVariation: 0.6,
      particleAngleVariation: 180, particleAngularVelocityVariation: 40,
      acceleration: { x: 0, y: 0.9, z: 0 }, dampingFactor: 1.2,
      particleColor: { x: 0.12, y: 0.13, z: 0.15, w: 0.7 },
      opacity: fade([0, 0.6, 0], [0, 0.2, 1]), size: fade([0.8, 2.2, 3.2], [0, 0.5, 1]),
    };
    this.embers = {
      particleImage: 'softDot', blendMode: 'additive',
      birthRate: 60, particleLifeSpan: 0.9, particleLifeSpanVariation: 0.5,
      particleVelocity: 12, particleVelocityVariation: 8, spreadingAngle: 180,
      particleSize: 0.05, particleSizeVariation: 0.03, stretchFactor: 0.05,
      isAffectedByGravity: true, dampingFactor: 0.8,
      particleColor: { x: 1, y: 0.7, z: 0.3, w: 1 }, intensity: 3,
      opacity: fade([1, 1, 0], [0, 0.5, 1]),
    };
    this.shards = {
      particleImage: 'softDot', blendMode: 'additive',
      birthRate: 40, particleLifeSpan: 0.55, particleLifeSpanVariation: 0.3,
      particleVelocity: 5, particleVelocityVariation: 4, spreadingAngle: 180,
      particleSize: 0.09, particleSizeVariation: 0.06, dampingFactor: 3, intensity: 2.5,
      opacity: fade([1, 0.8, 0], [0, 0.5, 1]),
    };
  }

  // ---- timing (SCNAction replacements)

  /** Runs onUpdate(k) with k going 0 -> 1 over duration seconds, then onDone(). */
  tween(duration, onUpdate, onDone = null) {
    const tw = { t: 0, dur: Math.max(duration, 1e-4), onUpdate, onDone, dead: false };
    this.tweens.push(tw);
    if (onUpdate) onUpdate(0);
    return tw;
  }

  after(delay, fn) { return this.tween(delay, null, fn); }

  update(dt) {
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    for (const l of this.lights) {
      if (l.t < l.dur) {
        l.t += dt;
        const k = Math.max(0, 1 - l.t / l.dur);
        l.light.intensity = l.peak * k * k;
      }
    }
    // tweens (callbacks may add new tweens: iterate over a snapshot)
    const tws = this.tweens;
    this.tweens = [];
    for (const tw of tws) {
      if (tw.dead) continue;
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.dur);
      if (tw.onUpdate) tw.onUpdate(k);
      if (k >= 1) { tw.dead = true; if (tw.onDone) tw.onDone(); } else this.tweens.push(tw);
    }
    // trails follow their projectiles
    for (const tr of this.trails) {
      tr.em.position.x = tr.obj.position.x;
      tr.em.position.y = tr.obj.position.y;
      tr.em.position.z = tr.obj.position.z;
    }
    this.updateDebris(dt);
    this.particles.update(dt);
  }

  shake(amount) { this.trauma = Math.min(1, this.trauma + amount); }

  /** Short point light. intensity is in SceneKit units (converted with LUMEN_TO_CANDELA). */
  flash(p, c, intensity, duration, range = 16) {
    this.lightIdx = (this.lightIdx + 1) % this.lights.length;
    const l = this.lights[this.lightIdx];
    setPos(l.light, p);
    l.light.color.copy(col(c));
    const cd = intensity * LUMEN_TO_CANDELA;
    l.light.intensity = cd;
    l.light.distance = range;
    l.t = 0; l.dur = duration; l.peak = cd;
  }

  // ---- helpers

  /** Cached additive template material; tex is null (flat), 'glow' or 'ring'. */
  beamMat(c, intensity, tex = null) {
    const key = `${c.x},${c.y},${c.z},${intensity},${tex}`;
    let m = this.beamMats.get(key);
    if (!m) { m = Mat.additive(tex ? Tex[tex] : null, c, intensity); this.beamMats.set(key, m); }
    return m;
  }

  /** Mesh with its own (cloned) material so it can fade; both are freed when it is removed. */
  fadingMesh(geo, baseMat) {
    const m = new THREE.Mesh(geo, baseMat.clone());
    m.castShadow = false;
    m.receiveShadow = false;
    this.root.add(m);
    return m;
  }

  /** Fade opacity from its current value to 0 over life seconds (SCNAction.fadeOut), then remove. */
  fadeOutAndRemove(obj, life, extra = null, disposeGeo = false) {
    const mat = obj.material;
    const a0 = mat.opacity;
    this.tween(life, (k) => {
      mat.opacity = a0 * (1 - k);
      if (extra) extra(k);
    }, () => {
      obj.removeFromParent();
      mat.dispose();
      if (disposeGeo) obj.geometry.dispose();
    });
  }

  // ---- effects

  /** Fading streak between two points. */
  tracer(a, b, c, width = 0.025, life = 0.08, intensity = 2.5) {
    const v = sub(b, a);
    const l = len(v);
    if (l < 0.05) return;
    const n = this.fadingMesh(this.unitBox, this.beamMat(c, intensity));
    setPos(n, mul(add(a, b), 0.5));
    orientZ(n, mul(v, 1 / l));
    n.scale.set(width, width, l);
    this.fadeOutAndRemove(n, life);
  }

  railBeam(a, b, c) {
    this.tracer(a, b, v3(1, 1, 1), 0.035, 0.35, 4);
    this.tracer(a, b, c, 0.085, 0.5, 2.0);
    const v = sub(b, a);
    const l = len(v);
    const steps = Math.min(Math.floor(l / 2.2), 26);
    if (steps <= 0) return;
    const dir = mul(v, 1 / l);
    for (let i = 1; i <= steps; i++) {
      const p = addMul(a, v, i / (steps + 1));
      const r = this.fadingMesh(this.unitPlane, this.beamMat(c, 1.6, 'ring'));
      setPos(r, p);
      orientZ(r, dir);
      r.scale.set(0.7, 0.7, 0.7);
      r.visible = false;
      this.after(i * 0.008, () => {
        r.visible = true;
        // grow to 2.4x with ease-out while fading
        this.fadeOutAndRemove(r, 0.5, (k) => {
          const e = 1 - (1 - k) * (1 - k);
          const s = 0.7 * (1 + 1.4 * e);
          r.scale.set(s, s, s);
        });
      });
    }
  }

  glowPop(p, c, size, intensity = 1.5, life = 0.18, tex = null) {
    const s = Geo.glowSprite(size, c, intensity, tex);
    setPos(s, p);
    this.root.add(s);
    const mat = s.material;
    this.tween(life, (k) => {
      const e = 1 - (1 - k) * (1 - k);
      const sc = size * (1 + 0.8 * e);
      s.scale.set(sc, sc, 1);
      mat.opacity = 1 - k;
    }, () => { s.removeFromParent(); mat.dispose(); });
  }

  /** Bullet impact on level geometry. */
  impact(p, n, c, big = false) {
    const cfg = { ...this.sparks, particleColor: { ...mix3(c, v3(1, 0.85, 0.6), 0.5), w: 1 } };
    if (big) { cfg.birthRate = 40; cfg.particleVelocity = 10; }
    this.particles.burst(cfg, addMul(p, n, 0.03), n);
    this.glowPop(addMul(p, n, 0.06), c, big ? 1.4 : 0.55, 1.6, 0.12);
    // glowing scorch that cools down
    const d = this.fadingMesh(this.unitPlane, this.beamMat(mix3(c, v3(1.0, 0.45, 0.1), 0.6), 1.2, 'glow'));
    const s = big ? 0.9 : 0.32;
    d.scale.set(s, s, 1);
    d.material.polygonOffset = true;
    d.material.polygonOffsetFactor = -2;
    d.material.polygonOffsetUnits = -2;
    setPos(d, addMul(p, n, 0.012));
    orientZ(d, n);
    this.fadeOutAndRemove(d, big ? 2.2 : 1.2);
  }

  /** Sparks when an enemy is hit. */
  hitSparks(p, dir, c, crit) {
    const cfg = { ...this.shards, particleColor: crit ? { x: 1, y: 0.9, z: 0.5, w: 1 } : { ...c, w: 1 }, birthRate: crit ? 22 : 9 };
    this.particles.burst(cfg, p, mul(dir, -1));
    if (crit) this.glowPop(p, v3(1, 0.9, 0.6), 0.8, 1.5, 0.12);
  }

  explosion(p, radius, c, shakeAmount = 0.5) {
    this.particles.burst({ ...this.fire, particleColor: { ...c, w: 1 }, particleSize: radius * 0.38, particleVelocity: radius * 1.3 }, p);
    this.particles.burst({ ...this.embers, particleColor: { ...mix3(c, v3(1, 0.9, 0.7), 0.4), w: 1 }, particleVelocity: 6 + radius * 2.4 }, p);
    this.particles.burst({ ...this.smoke, particleSize: radius * 0.45 }, p);
    this.glowPop(p, mix3(c, v3(1, 1, 1), 0.5), radius * 2.4, 1.5, 0.22);
    // ground shockwave
    const rn = this.fadingMesh(this.unitPlane, this.beamMat(c, 1.6, 'ring'));
    rn.rotation.set(-Math.PI / 2, 0, 0);
    setPos(rn, v3(p.x, Math.max(p.y - radius * 0.3, 0.06), p.z));
    rn.renderOrder = 30;
    const target = radius * 3.4;
    this.fadeOutAndRemove(rn, 0.45, (k) => {
      const e = 1 - (1 - k) * (1 - k);
      const s = 1 + (target - 1) * e;
      rn.scale.set(s, s, s);
    });
    this.flash(add(p, v3(0, 0.6, 0)), c, Math.min(1600 * radius, 7000) * 0.6, 0.45, 8 + radius * 4);
    this.shake(shakeAmount);
  }

  /** Flying chunks: gravity, floor bounce, spin, shrink-out (Swift used SCNPhysicsBody on the static floor). */
  debris(p, count, material, size, force) {
    if (this.debrisList.length > 70) return;
    for (let i = 0; i < count; i++) {
      const s = size * frand(0.5, 1.3);
      const g = Geo.box(s, s * frand(0.4, 1), s * frand(0.5, 1.2), s * 0.1);
      const m = new THREE.Mesh(g, material);
      m.castShadow = true;
      setPos(m, addMul(p, randUnit(), size));
      const v = mul(randUnit(), force * frand(0.4, 1));
      v.y = Math.abs(v.y) * 0.8 + force * 0.35;
      const av = randUnit();
      this.root.add(m);
      this.debrisList.push({
        m, v, half: s * 0.4,
        axis: new THREE.Vector3(av.x, av.y, av.z).normalize(), spin: frand(4, 14),
        life: frand(1.8, 3.0), age: 0,
      });
    }
  }

  updateDebris(dt) {
    const q = new THREE.Quaternion();
    let w = 0;
    for (const d of this.debrisList) {
      d.age += dt;
      const m = d.m;
      if (d.age >= d.life + 0.35) {
        m.removeFromParent();
        m.geometry.dispose();
        continue;
      }
      d.v.y += GRAVITY * dt;
      m.position.x += d.v.x * dt; m.position.y += d.v.y * dt; m.position.z += d.v.z * dt;
      if (m.position.y < d.half) {
        m.position.y = d.half;
        if (d.v.y < 0) d.v.y = -d.v.y * 0.35;           // restitution
        const f = Math.max(0, 1 - 6 * dt);                // friction on contact
        d.v.x *= f; d.v.z *= f; d.spin *= f;
        if (Math.abs(d.v.y) < 0.4) d.v.y = 0;
      }
      q.setFromAxisAngle(d.axis, d.spin * dt);
      m.quaternion.premultiply(q);
      if (d.age > d.life) {
        const k = Math.max(0.01, 1 - (d.age - d.life) / 0.35);
        m.scale.set(k, k, k);
      }
      this.debrisList[w++] = d;
    }
    this.debrisList.length = w;
  }

  spawnFlash(p, c) {
    this.glowPop(add(p, v3(0, 1, 0)), c, 3.5, 1.6, 0.35);
    const rn = this.fadingMesh(this.unitPlane, this.beamMat(c, 1.4, 'ring'));
    rn.rotation.set(-Math.PI / 2, 0, 0);
    setPos(rn, v3(p.x, p.y + 0.06, p.z));
    rn.scale.set(4, 4, 4);
    this.fadeOutAndRemove(rn, 0.4, (k) => {
      const s = 4 + (0.3 - 4) * Math.min(1, k * 0.4 / 0.35);
      rn.scale.set(s, s, s);
    });
  }

  /** Looping glow trail behind a moving object (Swift: copy of Game.trail attached to the projectile). */
  attachTrail(obj, c, size) {
    const em = this.particles.emitter({
      particleImage: 'glow', blendMode: 'additive',
      birthRate: 70, particleLifeSpan: 0.3, particleLifeSpanVariation: 0.1,
      particleSize: size, particleSizeVariation: 0.1,
      particleVelocity: 0.3, spreadingAngle: 180,
      particleColor: { ...c, w: 1 }, intensity: 1.6,
      opacity: fade([0.7, 0], [0, 1]), size: fade([1, 0.2], [0, 1]),
    });
    em.position.x = obj.position.x; em.position.y = obj.position.y; em.position.z = obj.position.z;
    const tr = { obj, em };
    this.trails.push(tr);
    return {
      remove: () => {
        em.remove();
        const i = this.trails.indexOf(tr);
        if (i >= 0) this.trails.splice(i, 1);
      },
    };
  }

  clear() {
    for (const tw of this.tweens) tw.dead = true;
    this.tweens = [];
    for (const c of this.root.children.slice()) {
      if (c.isLight) continue;
      c.removeFromParent();
      if (c.isMesh || c.isSprite) {
        if (c.material && !this.isSharedMat(c.material)) c.material.dispose();
      }
    }
    for (const d of this.debrisList) d.m.geometry.dispose();
    this.debrisList = [];
    for (const tr of this.trails) tr.em.remove();
    this.trails = [];
    for (const l of this.lights) { l.t = l.dur; l.light.intensity = 0; }
    this.particles.clear();
    this.trauma = 0;
  }

  isSharedMat(m) {
    for (const s of this.beamMats.values()) if (s === m) return true;
    return false;
  }
}
