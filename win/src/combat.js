// The combat half of Game: weapons, firing, damage, projectiles, pickups, enemy AI.
// Mirrors Sources/Combat.swift (Swift `extension Game`); mixed into Game.prototype by game.js.

import * as THREE from 'three';
import {
  v3, v2, cp, add, sub, mul, addMul, dot, cross, len, dist, len2, mix3, norm, safeNorm,
  add2, mul2, dot2, len2d, norm2, clampf, frand, wrapAngle, randUnit,
} from './math.js';
import { Geo, Mat, setPos, WEAPON_LAYER } from './gfx.js';
import { Tex } from './textures.js';
import { KindInfo } from './enemies.js';

const WHITE = v3(1, 1, 1);
const _v = new THREE.Vector3();

// ---- data classes (declared in Game.swift)

export class Weapon {
  constructor(def, node, muzzle, flash) {
    this.def = def; this.node = node; this.muzzle = muzzle; this.flash = flash;
    this.ammo = def.mag;
    this.reserve = def.reserveStart;
    this.cooldown = 0;
  }
  reset() { this.ammo = this.def.mag; this.reserve = this.def.reserveStart; this.cooldown = 0; }
}

export class Projectile {
  constructor(o) {
    this.pos = o.pos; this.vel = o.vel; this.damage = o.damage; this.splash = o.splash; this.fromPlayer = o.fromPlayer;
    this.life = o.life; this.radius = o.radius; this.color = o.color; this.gravity = o.gravity; this.node = o.node;
    this.trail = o.trail || null;
  }
}

export class Pickup {
  constructor(kind, pos, node, spin) {
    this.kind = kind; this.pos = pos; this.node = node; this.spin = spin;
    this.life = 28;
    this.t = frand(0, 6);
  }
}

/** Frees materials (and, unless shared, geometries) of a node tree that leaves the scene for good. */
function disposeNode(root, geometries = true) {
  root.traverse((o) => {
    if (o.material) {
      if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose()); else o.material.dispose();
    }
    if (geometries && o.geometry && !o.isSprite) o.geometry.dispose();
  });
}

function setOpacity(root, a) {
  root.traverse((o) => {
    if (!o.material) return;
    const m = o.material;
    if (!m.transparent) { m.transparent = true; m.needsUpdate = true; }
    if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = m.opacity;
    m.opacity = m.userData.baseOpacity * a;
  });
}

export const CombatMethods = {

  // MARK: - weapon models

  buildWeapons() {
    const dark = Mat.metal(v3(0.11, 0.115, 0.13), { rough: 0.32, plating: 2 });
    const steel = Mat.metal(v3(0.36, 0.38, 0.42), { rough: 0.24, plating: 2 });
    const P = (parent, geo, mat, pos, rot = null) => Geo.part(parent, geo, mat, pos, { rot, shadow: false });

    const finish = (def, n, muzzleAt, flashSize) => {
      const muzzle = new THREE.Group();
      setPos(muzzle, muzzleAt);
      n.add(muzzle);
      const flash = Geo.glowSprite(flashSize, mix3(def.color, WHITE, 0.35), 3.0, Tex.flare);
      flash.material.depthTest = false;
      flash.visible = false;
      muzzle.add(flash);
      // the view model lives in its own render pass (camera layer WEAPON_LAYER), never casts shadows
      n.traverse((c) => { c.castShadow = false; c.receiveShadow = false; c.layers.set(WEAPON_LAYER); });
      n.visible = false;
      this.weaponHolder.add(n);
      this.weapons.push(new Weapon(def, n, muzzle, flash));
    };

    // 1 – pulse rifle
    {
      const c = v3(0.25, 0.9, 1.0);
      const def = { name: 'PULSGEWEHR', short: 'PULS', kind: 'hitscan', damage: 13, pellets: 1, spread: 0.008, interval: 0.092,
        mag: 40, reload: 1.25, color: c, kick: 0.035, sound: 'rifle', reserveMax: -1, reserveStart: -1 };
      const n = new THREE.Group(), glow = Mat.glow(c, 2.2);
      P(n, Geo.box(0.09, 0.14, 0.5, 0.015), dark, v3(0, 0, 0));
      P(n, Geo.box(0.07, 0.05, 0.64, 0.01), steel, v3(0, 0.09, -0.1));
      P(n, Geo.cyl(0.024, 0.42, 14), steel, v3(0, 0.02, -0.46), v3(Math.PI / 2, 0, 0));
      P(n, Geo.box(0.078, 0.09, 0.3, 0.02), dark, v3(0, 0.02, -0.36));
      P(n, Geo.box(0.094, 0.018, 0.3), glow, v3(0, 0.035, -0.04));
      P(n, Geo.box(0.082, 0.012, 0.2), glow, v3(0, 0.0, -0.36));
      P(n, Geo.box(0.06, 0.22, 0.1, 0.01), steel, v3(0, -0.16, -0.03), v3(0.16, 0, 0));
      P(n, Geo.box(0.06, 0.17, 0.085, 0.015), dark, v3(0, -0.13, 0.18), v3(-0.32, 0, 0));
      P(n, Geo.box(0.07, 0.11, 0.26, 0.02), dark, v3(0, -0.02, 0.36));
      P(n, Geo.box(0.03, 0.05, 0.06), dark, v3(0, 0.135, 0.06));
      P(n, Geo.box(0.012, 0.012, 0.012), glow, v3(0, 0.165, 0.06));
      finish(def, n, v3(0, 0.02, -0.7), 0.55);
    }
    // 2 – scatter cannon
    {
      const c = v3(1.0, 0.55, 0.12);
      const def = { name: 'STREUKANONE', short: 'STREU', kind: 'hitscan', damage: 9.5, pellets: 10, spread: 0.07, interval: 0.72,
        mag: 8, reload: 1.6, color: c, kick: 0.16, sound: 'shotgun', reserveMax: 56, reserveStart: 24 };
      const n = new THREE.Group(), glow = Mat.glow(c, 2.2);
      P(n, Geo.box(0.115, 0.14, 0.46, 0.02), dark, v3(0, 0, 0.02));
      for (const sx of [-0.036, 0.036]) {
        P(n, Geo.cyl(0.036, 0.62, 16), steel, v3(sx, 0.03, -0.46), v3(Math.PI / 2, 0, 0));
        P(n, Geo.cyl(0.027, 0.01, 16), Mat.glow(c, 1.2), v3(sx, 0.03, -0.772), v3(Math.PI / 2, 0, 0));
      }
      P(n, Geo.box(0.13, 0.085, 0.22, 0.02), steel, v3(0, -0.035, -0.4));
      P(n, Geo.box(0.134, 0.016, 0.16), glow, v3(0, -0.035, -0.4));
      P(n, Geo.box(0.12, 0.02, 0.3), glow, v3(0, 0.05, 0.04));
      P(n, Geo.box(0.065, 0.18, 0.09, 0.015), dark, v3(0, -0.14, 0.2), v3(-0.35, 0, 0));
      P(n, Geo.box(0.08, 0.12, 0.28, 0.02), dark, v3(0, -0.03, 0.38));
      P(n, Geo.box(0.02, 0.03, 0.4), steel, v3(0, 0.085, -0.3));
      finish(def, n, v3(0, 0.03, -0.8), 0.95);
    }
    // 3 – railgun
    {
      const c = v3(0.72, 0.42, 1.0);
      const def = { name: 'RAILGUN', short: 'RAIL', kind: 'rail', damage: 190, pellets: 1, spread: 0, interval: 1.05,
        mag: 4, reload: 1.9, color: c, kick: 0.2, sound: 'rail', reserveMax: 24, reserveStart: 8 };
      const n = new THREE.Group(), glow = Mat.glow(c, 2.6);
      P(n, Geo.box(0.12, 0.17, 0.42, 0.02), dark, v3(0, 0, 0.12));
      for (const sx of [-0.046, 0.046]) P(n, Geo.box(0.03, 0.06, 0.95, 0.005), steel, v3(sx, 0.03, -0.4));
      P(n, Geo.box(0.028, 0.028, 0.9), glow, v3(0, 0.03, -0.4));
      for (let i = 0; i < 5; i++) P(n, Geo.torus(0.078, 0.013), dark, v3(0, 0.03, -0.12 - i * 0.17), v3(Math.PI / 2, 0, 0));
      P(n, Geo.cyl(0.03, 0.26, 14), dark, v3(0, 0.14, 0.1), v3(Math.PI / 2, 0, 0));
      P(n, Geo.cyl(0.022, 0.01, 14), glow, v3(0, 0.14, -0.035), v3(Math.PI / 2, 0, 0));
      P(n, Geo.box(0.124, 0.02, 0.24), glow, v3(0, -0.02, 0.12));
      P(n, Geo.box(0.065, 0.18, 0.09, 0.015), dark, v3(0, -0.15, 0.22), v3(-0.32, 0, 0));
      P(n, Geo.box(0.08, 0.12, 0.22, 0.02), dark, v3(0, -0.02, 0.42));
      finish(def, n, v3(0, 0.03, -0.9), 0.9);
    }
    // 4 – plasma launcher
    {
      const c = v3(0.35, 1.0, 0.45);
      const def = { name: 'PLASMAWERFER', short: 'PLASMA', kind: 'launcher', damage: 135, pellets: 1, spread: 0, interval: 0.85,
        mag: 4, reload: 2.1, color: c, kick: 0.2, sound: 'launcher', reserveMax: 20, reserveStart: 8 };
      const n = new THREE.Group(), glow = Mat.glow(c, 2.2);
      P(n, Geo.cyl(0.085, 0.62, 20), dark, v3(0, 0.04, -0.3), v3(Math.PI / 2, 0, 0));
      P(n, Geo.torus(0.09, 0.018), glow, v3(0, 0.04, -0.6), v3(Math.PI / 2, 0, 0));
      P(n, Geo.torus(0.092, 0.014), steel, v3(0, 0.04, -0.35), v3(Math.PI / 2, 0, 0));
      P(n, Geo.torus(0.092, 0.014), steel, v3(0, 0.04, -0.15), v3(Math.PI / 2, 0, 0));
      P(n, Geo.box(0.14, 0.16, 0.36, 0.025), dark, v3(0, -0.01, 0.16));
      P(n, Geo.sphere(0.075, 16), glow, v3(0, 0.1, 0.12));
      P(n, Geo.torus(0.085, 0.012), steel, v3(0, 0.1, 0.12));
      P(n, Geo.torus(0.085, 0.012), steel, v3(0, 0.1, 0.12), v3(0, 0, Math.PI / 2));
      P(n, Geo.box(0.065, 0.18, 0.09, 0.015), dark, v3(0, -0.16, 0.24), v3(-0.32, 0, 0));
      P(n, Geo.box(0.06, 0.14, 0.08, 0.015), steel, v3(0, -0.12, -0.2), v3(0.2, 0, 0));
      finish(def, n, v3(0, 0.04, -0.66), 0.8);
    }
  },

  // MARK: - weapon logic

  selectWeapon(i) {
    if (i === this.cur || i < 0 || i >= this.weapons.length || this.switchT > 0) return;
    this.pendingWeapon = i;
    this.switchT = 0.28;
    this.reloadT = 0;
    this.audio.play('swap', 0.7);
  },

  startReload() {
    const w = this.weapons[this.cur];
    if (!(this.reloadT <= 0 && w.ammo < w.def.mag && (w.def.reserveMax < 0 || w.reserve > 0))) return;
    this.reloadDur = w.def.reload;
    this.reloadT = this.reloadDur;
    this.audio.play('reload', 0.8);
  },

  updateWeapons(dt, inp) {
    const keys = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
    keys.forEach((k, i) => { if (inp.hit(k)) this.selectWeapon(i); });
    if (inp.scroll !== 0 && this.switchT <= 0) {
      this.selectWeapon((this.cur + (inp.scroll > 0 ? this.weapons.length - 1 : 1)) % this.weapons.length);
    }

    if (this.switchT > 0) {
      const before = this.switchT;
      this.switchT -= dt;
      if (before > 0.14 && this.switchT <= 0.14 && this.pendingWeapon >= 0) {
        this.weapons[this.cur].node.visible = false;
        this.weapons[this.cur].flash.visible = false;
        this.cur = this.pendingWeapon; this.pendingWeapon = -1;
        this.weapons[this.cur].node.visible = true;
      }
    }
    const w = this.weapons[this.cur];
    for (const x of this.weapons) x.cooldown = Math.max(0, x.cooldown - dt);
    this.bloom = Math.max(0, this.bloom - dt * 0.05);
    this.hitSoundT = Math.max(0, this.hitSoundT - dt);

    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        const need = w.def.mag - w.ammo;
        if (w.def.reserveMax < 0) w.ammo = w.def.mag;
        else {
          const take = Math.min(need, w.reserve);
          w.ammo += take; w.reserve -= take;
        }
      }
      return;
    }
    if (this.switchT > 0) return;
    if (inp.hit('KeyR')) { this.startReload(); return; }
    if (inp.fire && w.cooldown <= 0) {
      if (w.ammo <= 0) {
        if (w.def.reserveMax < 0 || w.reserve > 0) this.startReload();
        else if (inp.clicked) {
          this.audio.play('empty');
          this.hud.feedLine(`${w.def.name}: keine Munition`, v3(1, 0.4, 0.3));
          // fall back to the rifle so the player is never stuck
          this.selectWeapon(0);
        }
        return;
      }
      this.fire(w);
    }
  },

  spreadDir(s) {
    if (s <= 0) return this.viewDir;
    const d = this.viewDir;
    const r = safeNorm(cross(d, v3(0, 1, 0)), v3(1, 0, 0));
    const u = cross(r, d);
    const a = frand(0, 2 * Math.PI), m = Math.sqrt(frand()) * s;
    return norm(add(d, add(mul(r, Math.cos(a) * m), mul(u, Math.sin(a) * m))));
  },

  fire(w) {
    const def = w.def;
    w.ammo -= 1;
    w.cooldown = def.interval * (this.overcharge > 0 ? 0.8 : 1);
    this.shotsFired += 1;
    const dmgMul = this.overcharge > 0 ? 2 : 1;
    this.kickZ = Math.min(0.13, this.kickZ + def.kick * 0.7);
    this.kickRot = Math.min(0.3, this.kickRot + def.kick * 0.9);
    this.recoilPitch += def.kick * 0.12;
    this.fx.shake(def.kick * 0.9);
    this.audio.play(def.sound, def.kind === 'hitscan' && def.pellets === 1 ? 0.55 : 0.9);

    // muzzle flash
    w.flash.visible = true;
    w.flash.material.rotation = frand(0, 6.28);
    const fs = frand(0.8, 1.25);
    const base = w.flash.userData.baseSize || (w.flash.userData.baseSize = w.flash.scale.x);
    w.flash.scale.set(base * fs, base * fs, 1);
    this.flashT = 0.045;
    const o = this.eye;
    const viewDir = this.viewDir, rightV = this.rightV;
    // muzzle direction in camera space (node transforms lag one frame behind the simulation, so stay local)
    this.camera.updateMatrixWorld(true);
    w.muzzle.getWorldPosition(_v);
    this.camera.worldToLocal(_v);
    const ml = safeNorm(v3(_v.x, _v.y, _v.z));
    const upV = cross(rightV, viewDir);
    const tracerStart = addMul(o, add(add(mul(rightV, ml.x), mul(upV, ml.y)), mul(viewDir, -ml.z)), 1.5);
    this.fx.flash(addMul(o, viewDir, 0.8), def.color, 500 + def.kick * 4000, 0.09, 9);

    let anyHit = false;
    switch (def.kind) {
      case 'hitscan': {
        const movePenalty = (this.onGround ? 0 : 0.012) + Math.min(len2(this.vel) / 9.6, 1) * 0.004;
        for (let k = 0; k < def.pellets; k++) {
          const d = this.spreadDir(def.spread + this.bloom + movePenalty);
          const wall = this.level.raycast(o, d, 220);
          let bestT = wall ? wall.t : 220;
          let bestE = null;
          let crit = false;
          for (const e of this.enemies) {
            if (e.dead) continue;
            const h = e.rayHit(o, d, bestT);
            if (h) { bestT = h.t; bestE = e; crit = h.crit; }
          }
          const end = addMul(o, d, bestT);
          this.fx.tracer(tracerStart, end, def.color, def.pellets > 1 ? 0.018 : 0.024, 0.07, def.pellets > 1 ? 1.6 : 2.6);
          if (bestE) {
            let dmg = def.damage * dmgMul;
            if (def.pellets > 1) dmg *= clampf(1.25 - bestT / 34, 0.35, 1);
            this.damageEnemy(bestE, dmg * (crit ? 2 : 1), end, d, crit);
            anyHit = true;
          } else if (wall) {
            this.fx.impact(end, wall.n, def.color);
          }
        }
        if (def.pellets === 1) this.bloom = Math.min(0.028, this.bloom + 0.0045);
        break;
      }
      case 'rail': {
        const d = viewDir;
        const wall = this.level.raycast(o, d, 260);
        const maxT = wall ? wall.t : 260;
        for (const e of this.enemies.slice()) {
          if (e.dead) continue;
          const h = e.rayHit(o, d, maxT, 0.12);
          if (h) {
            this.damageEnemy(e, def.damage * dmgMul * (h.crit ? 1.6 : 1), addMul(o, d, h.t), d, h.crit);
            anyHit = true;
          }
        }
        const end = addMul(o, d, maxT);
        this.fx.railBeam(tracerStart, end, def.color);
        if (wall) this.fx.impact(end, wall.n, def.color, true);
        break;
      }
      case 'launcher': {
        const d = viewDir;
        const start = sub(add(addMul(o, d, 0.9), mul(rightV, 0.16)), v3(0, 0.14, 0));
        this.spawnProjectile(start, add(mul(d, 40), v3(0, 1.2, 0)), def.damage * dmgMul, 5.5, true, 5, 0.22, def.color, 5, true);
        anyHit = false;
        break;
      }
    }
    if (anyHit) this.shotsHit += 1;
  },

  // MARK: - damage

  damageEnemy(e, amount, p, dir, crit, silent = false) {
    if (e.dead) return;
    e.hp -= amount;
    if (e.flash <= 0) e.setFlash(true);
    e.flash = 0.07;
    e.sees = true;
    const killed = e.hp <= 0;
    const info = KindInfo[e.kind];
    if (!silent) {
      this.fx.hitSparks(p, dir, info.glow, crit);
      this.hud.hit(killed, crit);
      if (this.hitSoundT <= 0) { this.audio.play(crit ? 'crit' : 'hit', 0.5); this.hitSoundT = 0.04; }
    }
    if (e.kind !== 'boss' && e.kind !== 'brute') {
      const k = Math.min(amount * 0.06, 4);
      e.vel.x += dir.x * k; e.vel.z += dir.z * k;
    }
    if (killed) this.killEnemy(e);
  },

  killEnemy(e, scoreIt = true) {
    if (e.dead) return;
    e.dead = true;
    e.setFlash(false);   // the debris reuses the armour material: never let it inherit the white hit flash
    e.node.removeFromParent();
    const info = KindInfo[e.kind];
    const c = e.center;
    let size;
    switch (e.kind) {
      case 'skitter': case 'drone': size = 1.3; break;
      case 'trooper': size = 1.6; break;
      case 'roller': size = 4.2; break;
      case 'brute': size = 3.4; break;
      default: size = 7;
    }
    this.fx.explosion(c, size, e.kind === 'roller' ? v3(1.0, 0.7, 0.2) : mix3(info.glow, v3(1, 0.6, 0.2), 0.5), Math.min(0.9, size * 0.12));
    this.fx.debris(c, e.kind === 'boss' ? 26 : (e.kind === 'brute' ? 12 : 5), e.debrisMat,
      e.kind === 'boss' ? 0.6 : (e.kind === 'brute' ? 0.4 : 0.2), 4 + size * 1.6);
    this.audio.playAt(size > 3 ? 'explosion' : 'enemyDie', c, this.pos, this.yaw, size > 3 ? 1 : 0.8);
    // enemy geometries are shared between all enemies; only the per-enemy materials go (after the debris is done)
    this.fx.after(4, () => disposeNode(e.node, false));

    if (e.kind === 'roller') {
      // volatile: hurts everything nearby, including other machines
      this.radialDamage(c, 5, 70, 26, e);
    }
    if (e.kind === 'boss') {
      for (let k = 0; k < 5; k++) {
        const o = add(c, mul(randUnit(), 2.5));
        this.fx.after(0.15 + k * 0.18, () => {
          this.fx.explosion(o, 4, v3(1, 0.5, 0.2), 0.4);
          this.audio.play('explosion', 0.8);
        });
      }
      this.hud.flash(WHITE, 0.5, 0.6);
      this.hud.announce('OVERSEER ZERSTÖRT', `+${info.score * this.comboMult}`, v3(1, 0.8, 0.3), 2);
      const kinds = ['health', 'ammo', 'power'];
      for (let k = 0; k < 3; k++) this.spawnPickup(kinds[Math.floor(Math.random() * 3)], v3(c.x + frand(-3, 3), 0, c.z + frand(-3, 3)));
    }
    if (!scoreIt) return;
    this.kills += 1;
    this.combo += 1;
    this.comboT = 1;
    const pts = info.score * this.comboMult;
    this.score += pts;
    this.hud.feedLine(`${info.displayName}  +${pts}`);
    if (this.hitSoundT <= 0.03) this.audio.play('kill', 0.6);
    // drops
    const roll = frand();
    const chance = e.kind === 'brute' ? 1 : (e.kind === 'trooper' ? 0.3 : 0.15);
    if (e.kind !== 'boss' && roll < chance) {
      const r = frand();
      const hpNeed = this.hp < 60;
      const kind = r < (hpNeed ? 0.6 : 0.35) ? 'health' : (r < 0.92 ? 'ammo' : 'power');
      this.spawnPickup(kind, v3(c.x, this.level.groundHeight(c.x, c.z, 0.2, 2.5), c.z));
    }
  },

  /** Explosion damage against enemies and (optionally) the player. */
  radialDamage(p, radius, damage, playerDamage, exclude = null) {
    for (const e of this.enemies.slice()) {
      if (e.dead || e === exclude) continue;
      const d = dist(e.center, p) - e.radius;
      if (d < radius) {
        const k = clampf(1 - d / radius, 0, 1);
        this.damageEnemy(e, damage * (0.35 + 0.65 * k), e.center, safeNorm(sub(e.center, p)), false, true);
      }
    }
    if (playerDamage > 0) {
      const chest = add(this.pos, v3(0, 0.9, 0));
      const d = dist(chest, p);
      if (d < radius) {
        const k = clampf(1 - d / radius, 0, 1);
        this.hurtPlayer(playerDamage * (0.3 + 0.7 * k), p);
        const push = mul(safeNorm(sub(chest, p)), 9 * k);
        this.vel.x += push.x; this.vel.y += Math.max(push.y, 0) + 3 * k; this.vel.z += push.z;
        this.onGround = false;
      }
    }
  },

  // MARK: - projectiles

  spawnProjectile(p, v, damage, splash, fromPlayer, life, radius, c, gravity, big) {
    const n = new THREE.Group();
    const core = new THREE.Mesh(Geo.sphere(radius * 0.7, 10), Mat.additive(null, mix3(c, WHITE, 0.6), 3));
    n.add(core);
    n.add(Geo.glowSprite(radius * (big ? 9 : 7), c, big ? 1.5 : 1.2));
    setPos(n, p);
    this.scene.add(n);
    const trail = big ? this.fx.attachTrail(n, c, radius * 1.6) : null;
    this.projectiles.push(new Projectile({ pos: cp(p), vel: cp(v), damage, splash, fromPlayer, life, radius, color: c, gravity, node: n, trail }));
  },

  removeProjectile(i) {
    const p = this.projectiles[i];
    if (p.trail) p.trail.remove();
    p.node.removeFromParent();
    disposeNode(p.node);
    this.projectiles.splice(i, 1);
  },

  updateProjectiles(dt) {
    let i = 0;
    while (i < this.projectiles.length) {
      const p = this.projectiles[i];
      p.life -= dt;
      if (p.gravity !== 0) p.vel.y -= p.gravity * dt;
      const step = mul(p.vel, dt);
      const l = len(step);
      const d = l > 1e-6 ? mul(step, 1 / l) : v3(0, -1, 0);
      let hitT = l;
      let hitN = null;
      let hitE = null;
      let hitPlayer = false;
      let crit = false;
      const w = this.level.raycast(p.pos, d, l);
      if (w) { hitT = w.t; hitN = w.n; }
      if (p.fromPlayer) {
        for (const e of this.enemies) {
          if (e.dead) continue;
          const h = e.rayHit(p.pos, d, hitT, p.radius);
          if (h) { hitT = h.t; hitE = e; crit = h.crit; }
        }
      } else if (this.phase === 'playing') {
        for (const [c, r] of [[add(this.pos, v3(0, 0.75, 0)), 0.7], [add(this.pos, v3(0, 1.5, 0)), 0.42]]) {
          const oc = sub(p.pos, c);
          const b = dot(oc, d);
          const cc = dot(oc, oc) - (r + p.radius) * (r + p.radius);
          const disc = b * b - cc;
          if (disc < 0) continue;
          let t = -b - Math.sqrt(disc);
          if (t < 0 && cc < 0) t = 0;
          if (t >= 0 && t <= hitT) { hitT = t; hitPlayer = true; }
        }
      }
      const hitSomething = hitN !== null || hitE !== null || hitPlayer;
      if (hitSomething || p.life <= 0) {
        const at = addMul(p.pos, d, hitT);
        if (p.splash > 0) {
          this.fx.explosion(at, p.splash * 0.8, p.color, p.fromPlayer ? 0.35 : 0.3);
          this.audio.playAt('explosion', at, this.pos, this.yaw, 0.9);
          if (p.fromPlayer) {
            let hitAny = false;
            for (const e of this.enemies) {
              if (!e.dead && dist(e.center, at) - e.radius < p.splash) { hitAny = true; break; }
            }
            if (hitAny) { this.shotsHit += 1; this.hud.hit(false, false); }
            this.radialDamage(at, p.splash, p.damage, p.damage * 0.22);
          } else {
            const dd = dist(add(this.pos, v3(0, 0.9, 0)), at);
            if (dd < p.splash) this.hurtPlayer(p.damage * clampf(1.15 - dd / p.splash, 0.25, 1), at);
          }
        } else if (hitSomething) {
          if (hitE) {
            this.damageEnemy(hitE, p.damage * (crit ? 2 : 1), at, d, crit);
          } else if (hitPlayer) {
            this.hurtPlayer(p.damage, sub(at, mul(d, 3)));
            this.fx.glowPop(at, p.color, 1.0);
          } else if (hitN) {
            this.fx.impact(at, hitN, p.color);
          }
        }
        // the hit may have restarted the game (death -> no) or removed projectiles: find it again
        const idx = this.projectiles.indexOf(p);
        if (idx >= 0) this.removeProjectile(idx);
        continue;
      }
      p.pos = add(p.pos, step);
      setPos(p.node, p.pos);
      i += 1;
    }
  },

  // MARK: - pickups

  spawnPickup(kind, p) {
    const n = new THREE.Group();
    const spin = new THREE.Group();
    n.add(spin);
    let c;
    switch (kind) {
      case 'health': {
        c = v3(0.3, 1.0, 0.5);
        const m = Mat.glow(c, 4);
        Geo.part(spin, Geo.box(0.5, 0.16, 0.16, 0.03), m, v3(0, 0, 0), { shadow: false });
        Geo.part(spin, Geo.box(0.16, 0.5, 0.16, 0.03), m, v3(0, 0, 0), { shadow: false });
        break;
      }
      case 'ammo': {
        c = v3(1.0, 0.6, 0.15);
        Geo.part(spin, Geo.box(0.42, 0.3, 0.3, 0.04), Mat.metal(v3(0.2, 0.2, 0.22), { rough: 0.35 }), v3(0, 0, 0));
        Geo.part(spin, Geo.box(0.44, 0.06, 0.32), Mat.glow(c, 4), v3(0, 0.05, 0), { shadow: false });
        Geo.part(spin, Geo.box(0.1, 0.32, 0.32), Mat.glow(c, 4), v3(0, 0, 0), { shadow: false });
        break;
      }
      default: {
        c = v3(0.75, 0.4, 1.0);
        const m = Mat.glow(c, 5);
        Geo.part(spin, Geo.pyramid(0.4, 0.38, 0.4), m, v3(0, 0, 0), { shadow: false });
        Geo.part(spin, Geo.pyramid(0.4, 0.38, 0.4), m, v3(0, 0, 0), { rot: v3(Math.PI, 0, 0), shadow: false });
      }
    }
    n.add(Geo.glowSprite(1.7, c, 0.7));
    const ring = new THREE.Mesh(Geo.plane(1.5, 1.5), Mat.additive(Tex.ring, c, 0.9));
    ring.rotation.set(-Math.PI / 2, 0, 0);
    ring.position.set(0, -0.84, 0);
    n.add(ring);
    const shaft = new THREE.Mesh(Geo.cone(0.05, 0.55, 1.8, 16), Mat.additive(Tex.shaft, c, 0.35));
    n.add(shaft);
    const q = cp(p);
    q.y = this.level.groundHeight(p.x, p.z, 0.2, p.y + 0.3) + 0.9;
    setPos(n, q);
    this.scene.add(n);
    this.pickups.push(new Pickup(kind, q, n, spin));
  },

  updatePickups(dt) {
    let i = 0;
    while (i < this.pickups.length) {
      const p = this.pickups[i];
      p.life -= dt;
      p.t += dt;
      let remove = p.life <= 0;
      const chest = add(this.pos, v3(0, 0.9, 0));
      const d = dist(chest, p.pos);
      if (this.phase === 'playing') {
        let wanted = true;
        switch (p.kind) {
          case 'health': wanted = this.hp < 100; break;
          case 'ammo': wanted = this.weapons.some((w) => w.def.reserveMax > 0 && w.reserve < w.def.reserveMax); break;
          default: wanted = true;
        }
        if (wanted && d < 4.5) p.pos = addMul(p.pos, safeNorm(sub(chest, p.pos)), Math.min(d, dt * (4 + (4.5 - d) * 5)));
        if (wanted && d < 1.3) {
          remove = true;
          switch (p.kind) {
            case 'health':
              this.hp = Math.min(100, this.hp + 30);
              this.hud.feedLine('+30 Vital', v3(0.4, 1, 0.6));
              this.hud.flash(v3(0.3, 1, 0.5), 0.18, 0.35);
              this.audio.play('pickup');
              break;
            case 'ammo':
              for (const w of this.weapons) {
                if (w.def.reserveMax > 0) w.reserve = Math.min(w.def.reserveMax, w.reserve + Math.max(1, Math.trunc(w.def.reserveMax * 0.35)));
              }
              this.hud.feedLine('Munition aufgefüllt', v3(1, 0.7, 0.3));
              this.hud.flash(v3(1, 0.6, 0.2), 0.15, 0.35);
              this.audio.play('pickup');
              break;
            default:
              this.overcharge = 12;
              this.hud.announce('ÜBERLADUNG', 'Doppelter Schaden · schnellere Feuerrate', v3(0.8, 0.5, 1), 1.2);
              this.hud.flash(v3(0.7, 0.4, 1), 0.3, 0.5);
              this.audio.play('power');
          }
        }
      }
      if (remove) {
        p.node.removeFromParent();
        disposeNode(p.node);
        this.pickups.splice(i, 1);
        continue;
      }
      setPos(p.node, add(p.pos, v3(0, Math.sin(p.t * 2.2) * 0.12, 0)));
      p.spin.rotation.y += dt * 2 * Math.PI / 2.4;
      if (p.life < 4) { setOpacity(p.node, 0.35 + 0.65 * Math.abs(Math.sin(p.life * 6))); p.blinking = true; }
      else if (p.blinking) { setOpacity(p.node, 1); p.blinking = false; }
      i += 1;
    }
  },

  // MARK: - enemy AI

  faceToward(e, dir, dt, rate = 8) {
    if (len2d(dir) < 1e-4) return;
    const target = Math.atan2(dir.x, dir.y);
    e.yaw += wrapAngle(target - e.yaw) * Math.min(1, dt * rate);
  },

  moveGround(e, dir, speed, dt) {
    const k = Math.min(1, dt * 7);
    e.vel.x += (dir.x * speed - e.vel.x) * k;
    e.vel.z += (dir.y * speed - e.vel.z) * k;
    const p = v3(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt);
    this.level.resolve(p, Math.min(e.radius, 0.6) * 0.75, e.pos.y, e.height, 0.55);
    const g = this.level.groundHeight(p.x, p.z, 0.15, e.pos.y, 0.55);
    p.y = g > e.pos.y ? Math.min(g, e.pos.y + dt * 7) : Math.max(g, e.pos.y - dt * 14);
    e.pos = p;
  },

  enemyShoot(e, muzzle, speed, damage, inaccuracy, splash = 0, lead = 0.6, gravity = 0) {
    const info = KindInfo[e.kind];
    const from = e.world(muzzle);
    const dd = dist(from, this.pos);
    const target = add(add(this.pos, v3(0, 1.15, 0)), mul(v3(this.vel.x, 0, this.vel.z), (dd / speed) * lead));
    if (splash > 0) target.y = this.pos.y + 0.3;
    let d = safeNorm(sub(target, from));
    d = norm(add(d, mul(randUnit(), inaccuracy)));
    this.spawnProjectile(from, mul(d, speed), damage, splash, false, 6, splash > 0 ? 0.2 : 0.11,
      splash > 0 ? v3(1.0, 0.45, 0.1) : info.glow, gravity, splash > 0);
    this.fx.glowPop(from, info.glow, splash > 0 ? 1.6 : 0.9, 1.5, 0.1);
    this.audio.playAt(splash > 0 ? 'launcher' : 'enemyShot', from, this.pos, this.yaw, 0.75);
  },

  updateEnemies(dt) {
    const alive = this.phase === 'playing';
    const playerChest = add(this.pos, v3(0, 1.1, 0));
    const pos = this.pos;
    // soft separation so they do not stack
    const list = this.enemies;
    const n = list.length;
    if (n > 1) {
      for (let i = 0; i < n - 1; i++) {
        const a = list[i];
        if (a.kind === 'boss') continue;
        const af = KindInfo[a.kind].flies;
        for (let j = i + 1; j < n; j++) {
          const b = list[j];
          if (b.kind === 'boss' || af !== KindInfo[b.kind].flies) continue;
          const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
          const minD = (a.radius + b.radius) * 0.9;
          const d2 = dx * dx + dz * dz;
          if (d2 < minD * minD && d2 > 1e-5) {
            const d = Math.sqrt(d2);
            const push = (minD - d) * 0.5 * Math.min(1, dt * 12);
            a.pos.x -= dx / d * push; a.pos.z -= dz / d * push;
            b.pos.x += dx / d * push; b.pos.z += dz / d * push;
          }
        }
      }
    }

    for (const e of list.slice()) {
      if (e.dead) continue;
      const info = KindInfo[e.kind];
      e.anim += dt;
      if (e.flash > 0) {
        e.flash -= dt;
        if (e.flash <= 0) e.setFlash(false);
      }
      if (e.spawnT > 0) {
        e.spawnT -= dt;
        const k = 1 - Math.max(0, e.spawnT) / 0.45;
        const s = Math.max(0.01, k * k * (3 - 2 * k));
        e.node.scale.set(s, s, s);
        setPos(e.node, e.pos);
        e.node.rotation.set(0, e.yaw, 0);
        continue;
      }
      e.losT -= dt;
      if (e.losT <= 0) {
        e.losT = 0.2;
        e.sees = this.level.lineOfSight(info.flies ? e.pos : add(e.pos, v3(0, e.height * 0.8, 0)), playerChest);
      }
      e.attackCD -= dt;
      const to = v2(pos.x - e.pos.x, pos.z - e.pos.z);
      const dst = len2d(to);
      const toN = dst > 1e-3 ? mul2(to, 1 / dst) : v2(0, 1);
      const tangent = v2(-toN.y, toN.x);
      e.strafeT -= dt;
      if (e.strafeT <= 0) { e.strafeT = frand(1.5, 4); e.strafe = -e.strafe; }

      switch (e.kind) {
        case 'skitter': {
          const direct = e.sees && dst < 7;
          const dir = direct ? toN : this.level.nav.direction(e.pos, pos);
          // little zig-zag makes them harder to hit
          const zig = direct ? mul2(tangent, Math.sin(e.anim * 5) * 0.35) : v2(0, 0);
          const dn = norm2(add2(dir, zig));
          this.moveGround(e, dn, dst < 1.2 ? 0 : e.speed, dt);
          this.faceToward(e, dst < 3 ? toN : dn, dt, 10);
          if (alive && dst < 1.75 && Math.abs(e.pos.y - pos.y) < 2.3 && e.attackCD <= 0) {
            e.attackCD = 0.8;
            this.hurtPlayer(9 + this.wave * 0.3, e.pos);
            this.audio.play('melee', 0.8);
            e.state = 1; e.stateT = 0.2;
          }
          if (e.stateT > 0) e.stateT -= dt;
          const sp = len2(e.vel);
          e.legs.forEach((leg, i) => {
            const ph = e.anim * (6 + sp * 2.2) + i * 2.1;
            leg.rotation.set(Math.sin(ph) * 0.12, Math.cos(ph) * 0.45 * Math.min(1, sp / 2 + 0.2), Math.sin(ph) * 0.18 * (i % 2 === 0 ? 1 : -1));
          });
          e.model.position.set(0, Math.abs(Math.sin(e.anim * 14)) * 0.03 * sp / 6, e.stateT > 0 ? 0.3 : 0);
          break;
        }
        case 'roller': {
          const dir = (e.sees && dst < 10) ? toN : this.level.nav.direction(e.pos, pos);
          e.vel.x += (dir.x * e.speed - e.vel.x) * Math.min(1, dt * 2.2);
          e.vel.z += (dir.y * e.speed - e.vel.z) * Math.min(1, dt * 2.2);
          const p = v3(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt);
          const bx = p.x, bz = p.z;
          this.level.resolve(p, 0.5, e.pos.y, 1, 0.55);
          if (Math.hypot(bx - p.x, bz - p.z) > 1e-4) { e.vel.x *= 0.82; e.vel.y *= 0.82; e.vel.z *= 0.82; }
          const g = this.level.groundHeight(p.x, p.z, 0.15, e.pos.y, 0.55);
          p.y = g > e.pos.y ? Math.min(g, e.pos.y + dt * 7) : Math.max(g, e.pos.y - dt * 14);
          e.pos = p;
          const sp = len2(e.vel);
          if (sp > 0.2 && e.spinners[0]) {
            // the ball lives inside the yawed node: roll about the local axis perpendicular to the motion
            const ax = norm(cross(v3(0, 1, 0), v3(e.vel.x, 0, e.vel.z)));
            const s = Math.sin(e.yaw), c = Math.cos(e.yaw);
            _v.set(c * ax.x - s * ax.z, 0, s * ax.x + c * ax.z).normalize();
            const q = new THREE.Quaternion().setFromAxisAngle(_v, sp * dt / 0.55);
            e.spinners[0].quaternion.premultiply(q);
          }
          const blinkRate = dst < 8 ? 14 : 4;
          if (e.blink) e.blink.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(e.anim * blinkRate));
          if (alive && dist(e.center, playerChest) < 2.4) {
            this.killEnemy(e, false);
            continue;
          }
          break;
        }
        case 'drone': {
          let want;
          if (dst > 15) want = toN; else if (dst < 8) want = mul2(toN, -1); else want = mul2(tangent, e.strafe);
          if (!e.sees) want = this.level.nav.direction(e.pos, pos);
          want = norm2(add2(want, mul2(tangent, e.strafe * 0.4)));
          const targetY = pos.y + 3.0 + Math.sin(e.anim * 1.3) * 0.6;
          const k = Math.min(1, dt * 2.5);
          e.vel.x += (want.x * e.speed - e.vel.x) * k;
          e.vel.y += ((targetY - e.pos.y) * 2.5 - e.vel.y) * k;
          e.vel.z += (want.y * e.speed - e.vel.z) * k;
          const p = addMul(e.pos, e.vel, dt);
          this.level.resolve(p, 0.6, p.y - 0.5, 1.0, 0);
          p.y = Math.max(p.y, this.level.groundHeight(p.x, p.z, 0.6, p.y + 3, 0) + 1.2);
          e.pos = p;
          this.faceToward(e, toN, dt, 6);
          if (e.spinners[0]) e.spinners[0].rotation.set(0, e.anim * 5, 0);
          const hv = v2(e.vel.x, e.vel.z);
          e.model.rotation.set(clampf(dot2(hv, toN) * 0.04, -0.3, 0.3), 0, clampf(-dot2(hv, tangent) * 0.05, -0.4, 0.4));
          if (alive && e.sees && e.attackCD <= 0 && dst < 32) {
            e.attackCD = frand(1.5, 2.4) * Math.max(0.6, 1 - this.wave * 0.02);
            this.enemyShoot(e, e.muzzles[0], 21, 8, 0.03);
          }
          break;
        }
        case 'trooper': {
          let dir;
          let speed = e.speed;
          if (!e.sees || dst > 22) {
            dir = this.level.nav.direction(e.pos, pos);
          } else if (dst < 8) {
            dir = norm2(add2(mul2(toN, -1), mul2(tangent, e.strafe * 0.8))); speed *= 0.8;
          } else {
            dir = norm2(add2(mul2(tangent, e.strafe), mul2(toN, 0.25))); speed *= 0.65;
          }
          if (e.burst > 0) speed *= 0.3;
          this.moveGround(e, dir, speed, dt);
          this.faceToward(e, e.sees ? toN : dir, dt, 7);
          if (alive && e.sees && dst < 34) {
            if (e.burst === 0 && e.attackCD <= 0) { e.burst = 3; e.burstT = 0.25; }
            if (e.burst > 0) {
              e.burstT -= dt;
              if (e.burstT <= 0) {
                e.burstT = 0.15; e.burst -= 1;
                this.enemyShoot(e, e.muzzles[0], 27, 7, 0.035);
                if (e.burst === 0) e.attackCD = frand(1.8, 2.8) * Math.max(0.6, 1 - this.wave * 0.02);
              }
            }
          } else e.burst = 0;
          const sp = len2(e.vel);
          const ph = e.anim * (3 + sp * 1.6);
          const amp = Math.min(1, sp / 2.5) * 0.65;
          e.legs[0].rotation.set(Math.sin(ph) * amp, 0, 0);
          e.legs[1].rotation.set(Math.max(0, -Math.cos(ph)) * amp * 1.3, 0, 0);
          e.legs[2].rotation.set(-Math.sin(ph) * amp, 0, 0);
          e.legs[3].rotation.set(Math.max(0, Math.cos(ph)) * amp * 1.3, 0, 0);
          e.model.position.set(0, Math.abs(Math.sin(ph)) * 0.04 * amp, 0);
          break;
        }
        case 'brute': {
          const close = e.sees && dst < 15;
          const dir = (e.sees && dst < 9) ? toN : this.level.nav.direction(e.pos, pos);
          this.moveGround(e, dir, close ? e.speed * 0.55 : e.speed, dt);
          this.faceToward(e, e.sees ? toN : dir, dt, 3);
          if (alive && e.sees && dst < 40 && dst > 4.5 && e.attackCD <= 0) {
            e.side = 1 - e.side;
            this.enemyShoot(e, e.muzzles[e.side], 15, 28, 0.02, 3.6, 0.5);
            e.burst += 1;
            e.attackCD = e.burst % 2 === 0 ? frand(2.6, 3.4) : 0.45;
          }
          if (alive && dst < 3.3 && Math.abs(e.pos.y - pos.y) < 3 && e.stateT <= 0) {
            e.stateT = 1.5;
            this.hurtPlayer(26, e.pos);
            this.vel.x += toN.x * 11; this.vel.y += 4.5; this.vel.z += toN.y * 11;
            this.onGround = false;
            this.fx.spawnFlash(add(e.pos, mul(v3(toN.x, 0, toN.y), 1.5)), info.glow);
            this.fx.shake(0.5);
            this.audio.play('melee');
          }
          e.stateT -= dt;
          const sp = len2(e.vel);
          const ph = e.anim * (2 + sp * 1.3);
          const amp = Math.min(1, sp / 1.5) * 0.4;
          e.legs[0].rotation.set(Math.sin(ph) * amp, 0, 0);
          e.legs[1].rotation.set(-Math.sin(ph) * amp, 0, 0);
          e.model.position.set(0, Math.abs(Math.cos(ph)) * 0.07 * amp, 0);
          e.model.rotation.set(0, 0, Math.sin(ph) * 0.04 * amp);
          break;
        }
        case 'boss':
          this.updateBoss(e, dt, toN, tangent, dst, alive);
          break;
      }
      setPos(e.node, e.pos);
      e.node.rotation.set(0, e.yaw, 0);
    }
    // drop the dead (compact in place, the array object stays the same)
    let w = 0;
    for (const e of this.enemies) if (!e.dead) this.enemies[w++] = e;
    this.enemies.length = w;
  },

  updateBoss(e, dt, toN, tangent, dst, alive) {
    const info = KindInfo[e.kind];
    // hover around the player at mid range
    let want = mul2(tangent, e.strafe * 0.7);
    if (dst > 20) want = add2(want, toN); else if (dst < 12) want = add2(want, mul2(toN, -1));
    const targetY = 5.6 + Math.sin(e.anim * 0.8) * 0.7;
    const k = Math.min(1, dt * 1.5);
    e.vel.x += (want.x * e.speed - e.vel.x) * k;
    e.vel.y += ((targetY - e.pos.y) * 2 - e.vel.y) * k;
    e.vel.z += (want.y * e.speed - e.vel.z) * k;
    const p = addMul(e.pos, e.vel, dt);
    this.level.resolve(p, 2.4, p.y - 2, 4, 0);
    e.pos = p;
    this.faceToward(e, toN, dt, 2.5);
    e.spinners.forEach((s, i) => {
      s.rotation.set(i * 0.5 + 0.2 + e.anim * (0.5 + i * 0.25), e.anim * (i % 2 === 0 ? 0.9 : -0.7), i * 0.4);
    });
    if (!alive) return;
    const rage = e.hp < e.maxHp * 0.4 ? 0.7 : 1;
    e.stateT -= dt;
    if (e.stateT <= 0) {
      e.state = (e.state + 1) % 4;
      e.stateT = [3.2, 1.6, 3.0, 1.8][e.state];
      e.burst = 0;
      e.burstT = 0.5;
      if (e.state === 3 && this.enemies.length < 14) {
        for (let i = 0; i < 2 + this.bossCount; i++) this.spawnEnemy('drone', add(add(e.pos, mul(randUnit(), 3)), v3(0, 1, 0)));
        this.hud.feedLine('OVERSEER setzt Drohnen ab', v3(1, 0.4, 0.3));
      }
    }
    e.burstT -= dt;
    switch (e.state) {
      case 0: // aimed volleys
        if (e.burstT <= 0 && e.sees) {
          e.burstT = 0.2 * rage;
          e.side = (e.side + 1) % 3;
          this.enemyShoot(e, e.muzzles[e.side], 26, 9, 0.04);
        }
        break;
      case 1: // ground nova: ring of bolts that must be jumped or dodged through the gaps
        if (e.burst === 0 && e.burstT <= 0) {
          e.burst = 1;
          const c = v3(e.pos.x, 1.0, e.pos.z);
          this.fx.spawnFlash(v3(e.pos.x, 0, e.pos.z), info.glow);
          this.fx.tracer(sub(e.pos, v3(0, 2.5, 0)), v3(e.pos.x, 0.1, e.pos.z), info.glow, 0.5, 0.4, 2);
          this.audio.playAt('rail', c, this.pos, this.yaw, 0.8);
          const count = 30;
          const gap = Math.floor(Math.random() * count);
          for (let i = 0; i < count; i++) {
            if ((i + gap) % 10 < 2) continue;
            const a = i / count * 2 * Math.PI;
            const dirv = v3(Math.sin(a), 0, Math.cos(a));
            this.spawnProjectile(addMul(c, dirv, 2.5), mul(dirv, 12), 14, 0, false, 4.5, 0.16, info.glow, 0, false);
          }
        }
        break;
      case 2: // rockets
        if (e.burstT <= 0 && e.sees) {
          e.burstT = 0.75 * rage;
          e.side = (e.side + 1) % 3;
          this.enemyShoot(e, e.muzzles[1 + e.side % 2], 17, 26, 0.03, 3.8, 0.5);
        }
        break;
      default: break;
    }
  },
};

