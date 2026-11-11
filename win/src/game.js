// Game state, player, cameras, waves. Mirrors Sources/Game.swift.
// The combat half (weapons, damage, projectiles, pickups, enemy AI) lives in combat.js and is mixed
// into Game.prototype, exactly like the Swift `extension Game`.

import * as THREE from 'three';
import {
  v3, cp, add, sub, mul, addMul, dot, len, dist, len2, safeNorm,
  v2, clampf, mixf, frand, wrapAngle,
} from './math.js';
import { setPos } from './gfx.js';
import { Level } from './level.js';
import { Effects } from './effects.js';
import { HUD } from './hud.js';
import { GameAudio } from './audio.js';
import { Enemy, KindInfo } from './enemies.js';
import { CombatMethods } from './combat.js';

// MARK: - Input (written by the DOM event handlers, consumed once per frame by tick)

/** Key identifiers are KeyboardEvent.code values (the Swift version used macOS virtual key codes). */
export const Key = {
  a: 'KeyA', s: 'KeyS', d: 'KeyD', f: 'KeyF', q: 'KeyQ', w: 'KeyW',
  e: 'KeyE', r: 'KeyR', n1: 'Digit1', n2: 'Digit2', n3: 'Digit3', n4: 'Digit4',
  ret: 'Enter', m: 'KeyM', space: 'Space', esc: 'Escape', shift: 'ShiftLeft',
};

export class InputFrame {
  constructor() {
    this.keys = new Set();
    this.pressed = [];
    this.dx = 0; this.dy = 0;
    this.fire = false; this.clicked = false;
    this.scroll = 0;
  }
  down(k) { return this.keys.has(k); }
  hit(k) { return this.pressed.includes(k); }
}

export class Input {
  constructor() { this.f = new InputFrame(); }

  key(k, down) {
    const f = this.f;
    if (down) {
      if (!f.keys.has(k)) { f.keys.add(k); f.pressed.push(k); }
    } else {
      f.keys.delete(k);
    }
  }
  mouse(x, y) { this.f.dx += x; this.f.dy += y; }
  button(down) { this.f.fire = down; if (down) this.f.clicked = true; }
  scroll(v) { this.f.scroll += v; }
  releaseAll() { this.f.keys.clear(); this.f.fire = false; }
  /** Returns the accumulated state and resets the one-shot parts. */
  frame() {
    const f = this.f;
    // Swift returned a struct copy – hand out a snapshot, never the live sets
    const out = new InputFrame();
    out.keys = new Set(f.keys);
    out.pressed = f.pressed.slice();
    out.dx = f.dx; out.dy = f.dy;
    out.fire = f.fire; out.clicked = f.clicked;
    out.scroll = f.scroll;
    f.pressed.length = 0;
    f.dx = 0; f.dy = 0; f.clicked = false; f.scroll = 0;
    return out;
  }
}

// Weapon / Projectile / Pickup (declared in Game.swift) are owned by combat.js in this port.
// Phase is a string: 'menu' | 'playing' | 'paused' | 'dead'.

// MARK: - helpers

const _xAxis = new THREE.Vector3(1, 0, 0);
const _yAxis = new THREE.Vector3(0, 1, 0);
const _zAxis = new THREE.Vector3(0, 0, 1);
const _qYaw = new THREE.Quaternion();
const _qPitch = new THREE.Quaternion();
const _qRoll = new THREE.Quaternion();

// UserDefaults -> localStorage (may be unavailable, e.g. file:// with storage disabled)
function loadInt(key) {
  try {
    const v = parseInt(localStorage.getItem(key), 10);
    return Number.isFinite(v) ? v : 0;
  } catch { return 0; }
}
function saveInt(key, v) {
  try { localStorage.setItem(key, String(v)); } catch { /* highscore is best effort */ }
}

function nowSeconds() {
  return (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
}

/** Frees the GPU resources of a node that leaves the scene for good (enemies, shots, pickups on restart). */
function disposeTree(root) {
  root.traverse((o) => {
    const m = o.material;
    if (Array.isArray(m)) m.forEach((x) => x.dispose()); else if (m) m.dispose();
    // every THREE.Sprite shares one module-level geometry – leave that one alone
    if (o.geometry && !o.isSprite) o.geometry.dispose();
  });
}

function shuffled(a) {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}

// MARK: - Game

export class Game {
  constructor({ renderer, hudRoot, audioEnabled = true }) {
    installCombat();

    // callbacks into the app shell
    this.onCapture = null;            // (on: boolean) => void
    this.onToggleFullscreen = null;   // () => void

    this.phase = 'menu';
    this.time = 0;
    this.animTime = 0;                // real time for level animations (SceneKit's scene time)
    this.lastRenderTime = 0;
    this.demo = false;
    /** set by the shell when the window loses focus / pointer lock */
    this.pauseRequested = false;
    this.autoStart = false;
    /** autopilot without invulnerability (tests the game-over path) */
    this.demoMortal = false;
    this.fpsAverage = 0;
    this.menuAngle = 0.6;

    // player
    this.pos = v3(0, 0, 15);
    this.vel = v3(0, 0, 0);
    this.yaw = 0;
    this.pitch = 0;
    this.hp = 100;
    this.shield = 100;
    this.sinceHurt = 10;
    this.onGround = true;
    this.coyote = 0;
    this.jumpBuffer = 0;
    this.dashCD = 0;
    this.dashT = 0;
    this.dashDir = v3(0, 0, -1);
    this.eyeY = 1.7;
    this.bob = 0;
    this.fov = 64;
    this.overcharge = 0;
    this.deadT = 0;
    this.stepT = 0;

    // weapons
    this.weapons = [];
    this.cur = 0;
    this.pendingWeapon = -1;
    this.switchT = 0;
    this.reloadT = 0;
    this.reloadDur = 1;
    this.kickZ = 0;
    this.kickRot = 0;
    this.bloom = 0;
    this.sway = v2(0, 0);
    this.recoilPitch = 0;
    this.flashT = 0;
    this.hitSoundT = 0;

    // world
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.navT = 0;
    this.trail = null;
    this.gateBoost = [0, 0, 0, 0];

    // waves / score
    this.wave = 0;
    this.spawnQueue = [];
    this.spawnT = 0;
    this.intermission = 3;
    this.waveActive = false;
    this.score = 0;
    this.combo = 0;
    this.comboT = 0;
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.timeAlive = 0;
    this.bossCount = 0;

    this.demoWeaponT = 0;

    // construction order mirrors Swift Game.init (see contract)
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.input = new Input();
    this.setupCamera();
    this.fx = new Effects(this.scene);
    this.level = new Level(this.scene, this.fx.particles, renderer);
    this.hud = new HUD(hudRoot);
    this.audio = new GameAudio({ enabled: audioEnabled });
    this.buildWeapons();
    this.setupTrail();
    // (scene.physicsWorld.gravity = -16 is the debris gravity; effects.js owns that now)
    this.hud.showMenu(loadInt('nova.bestScore'), loadInt('nova.bestWave'));
    this.weaponRoot.visible = false;
    this.updateMenuCamera(0);
  }

  get eye() { return v3(this.pos.x, this.pos.y + this.eyeY, this.pos.z); }
  get viewDir() {
    return v3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
  }
  get fwd() { return v3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)); }
  get rightV() { return v3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)); }

  setupCamera() {
    // HDR, bloom, vignette, colour fringe, saturation and contrast of the SCNCamera live in postfx.js.
    // zNear is 0.1 here (Swift 0.03): the view model gets its own pass with its own near plane.
    const el = this.renderer && this.renderer.domElement;
    const w = el ? (el.clientWidth || el.width) : 0, h = el ? (el.clientHeight || el.height) : 0;
    const aspect = w > 0 && h > 0 ? w / h : 16 / 9;
    this.camera = new THREE.PerspectiveCamera(this.fov, aspect, 0.1, 600);
    this.camNode = this.camera;       // Swift's camNode and camera are one object in three
    this.scene.add(this.camera);
    // no 0.2 scale trick: scaling about the eye does not change the projection, and depth is cleared
    // before the weapon pass, so the view model keeps its Swift offsets at scale 1
    this.weaponRoot = new THREE.Group();
    this.weaponHolder = new THREE.Group();
    this.camera.add(this.weaponRoot);
    this.weaponRoot.add(this.weaponHolder);
  }

  setupTrail() {
    // Template of the plasma trail (an SCNParticleSystem in Swift). Projectiles get their trail through
    // fx.attachTrail in this port; the numbers stay here as the reference for that emitter.
    this.trail = {
      particleImage: 'glow',
      birthRate: 70,
      particleLifeSpan: 0.3,
      particleLifeSpanVariation: 0.1,
      particleSize: 0.28,
      particleSizeVariation: 0.1,
      particleVelocity: 0.3,
      spreadingAngle: 180,
      blendMode: 'additive',
      isLightingEnabled: false,
      opacity: { values: [0.7, 0], keyTimes: [0, 1] },
      size: { values: [1, 0.2], keyTimes: [0, 1] },
    };
  }

  setFov(f) {
    if (this.camera.fov !== f) {
      this.camera.fov = f;
      this.camera.updateProjectionMatrix();
    }
  }

  // MARK: render loop entry

  tick(dtReal) {
    // frame-rate readout (Swift did this in renderer(_:updateAtTime:) with the unclamped frame time)
    const t = nowSeconds();
    const rdt = this.lastRenderTime === 0 ? 1 / 60 : t - this.lastRenderTime;
    this.lastRenderTime = t;
    if (rdt > 0.001) this.fpsAverage = this.fpsAverage === 0 ? 1 / rdt : this.fpsAverage * 0.98 + (1 / rdt) * 0.02;

    const inp = this.input.frame();
    if (this.demo) this.demoInput(inp);
    this.hud.resizeIfNeeded();
    if (this.pauseRequested) {
      this.pauseRequested = false;
      // the autopilot never pauses (the Swift shell did not request it in autotest mode)
      if (this.phase === 'playing' && !this.demo) { this.setPaused(true); return; }
    }

    if (inp.hit(Key.m)) { this.audio.musicOn = !this.audio.musicOn; this.audio.play('ui'); }
    if (inp.hit(Key.f)) { if (this.onToggleFullscreen) this.onToggleFullscreen(); }

    // world animations (portals, core, beacons) run in real time, frozen only by the pause screen
    if (this.phase !== 'paused') {
      this.animTime += dtReal;
      this.level.update(dtReal, this.animTime);
    }

    switch (this.phase) {
      case 'menu':
        this.updateMenuCamera(dtReal);
        this.fx.update(dtReal);
        if (inp.clicked || inp.hit(Key.ret) || inp.hit(Key.space) || this.autoStart) { this.autoStart = false; this.startGame(); }
        break;
      case 'paused':
        if (inp.clicked || inp.hit(Key.esc) || inp.hit(Key.ret)) this.setPaused(false);
        break;
      case 'playing':
        if (inp.hit(Key.esc)) { this.setPaused(true); return; }
        this.time += dtReal;
        this.timeAlive += dtReal;
        this.simulate(dtReal, inp);
        break;
      case 'dead': {
        this.deadT += dtReal;
        const dt = dtReal * 0.4;
        this.time += dt;
        this.updateWorld(dt);
        this.fx.update(dtReal);
        this.updateDeathCamera(dtReal);
        this.updateHUD(dtReal);
        if (this.deadT > 1.4 && (inp.clicked || inp.hit(Key.ret) || inp.hit(Key.space))) this.startGame();
        break;
      }
    }
  }

  setPaused(p) {
    if (this.phase !== 'playing' && this.phase !== 'paused') return;
    this.phase = p ? 'paused' : 'playing';
    // scene.isPaused: nothing to do – while paused tick() advances neither fx nor level
    this.audio.play('ui');
    if (p) this.hud.showPause(); else this.hud.showGame();
    this.audio.musicVolume = p ? 0.15 : 0.42;
    this.input.releaseAll();
    if (this.onCapture) this.onCapture(!p);
  }

  startGame() {
    for (const e of this.enemies) { e.node.removeFromParent(); disposeTree(e.node); }
    for (const p of this.projectiles) {
      if (p.trail) p.trail.remove();
      p.node.removeFromParent(); disposeTree(p.node);
    }
    for (const p of this.pickups) { p.node.removeFromParent(); disposeTree(p.node); }
    this.enemies.length = 0; this.projectiles.length = 0; this.pickups.length = 0;
    this.fx.clear();
    this.hud.resetTransient();
    this.pos = v3(0, 0, 16); this.vel = v3(0, 0, 0); this.yaw = 0; this.pitch = 0;
    this.hp = 100; this.shield = 100; this.sinceHurt = 10; this.onGround = true;
    this.dashCD = 0; this.dashT = 0; this.overcharge = 0; this.eyeY = 1.7; this.deadT = 0;
    for (const w of this.weapons) { w.reset(); w.node.visible = false; }
    this.cur = 0; this.pendingWeapon = -1; this.switchT = 0; this.reloadT = 0; this.bloom = 0; this.kickZ = 0; this.kickRot = 0;
    this.weapons[0].node.visible = true;
    this.weaponRoot.visible = true;
    this.wave = 0; this.spawnQueue.length = 0; this.intermission = 2.5; this.waveActive = false;
    this.score = 0; this.combo = 0; this.comboT = 0; this.kills = 0; this.shotsFired = 0; this.shotsHit = 0; this.timeAlive = 0; this.bossCount = 0;
    this.phase = 'playing';
    this.hud.showGame();
    this.hud.announce('BEREIT MACHEN', 'Gegner nähern sich über die roten Portale', v3(1, 1, 1), 1.8);
    this.audio.play('power', 0.7);
    this.audio.musicVolume = 0.42;
    this.input.releaseAll();
    if (this.onCapture) this.onCapture(true);
  }

  die() {
    if (this.phase !== 'playing') return;
    this.phase = 'dead';
    this.deadT = 0;
    this.hp = 0;
    this.weaponRoot.visible = false;
    this.audio.play('death');
    this.audio.musicVolume = 0.2;
    this.fx.shake(1);
    this.hud.flash(v3(1, 0.1, 0.05), 0.6, 0.8);
    const best = loadInt('nova.bestScore');
    const newBest = this.score > best;
    // the autopilot never touches the player's records
    if (!this.demo) {
      if (newBest) saveInt('nova.bestScore', this.score);
      if (this.wave > loadInt('nova.bestWave')) saveInt('nova.bestWave', this.wave);
    }
    const acc = this.shotsFired > 0 ? Math.trunc(this.shotsHit / this.shotsFired * 100) : 0;
    this.hud.showGameOver({
      score: this.score, wave: this.wave, kills: this.kills, accuracy: Math.min(acc, 100),
      best: Math.max(best, this.score), newBest, time: Math.trunc(this.timeAlive),
    });
    if (this.onCapture) this.onCapture(false);
  }

  // MARK: cameras

  updateMenuCamera(dt) {
    this.menuAngle += dt * 0.09;
    const r = 25;
    setPos(this.camNode, v3(Math.cos(this.menuAngle) * r, 7.5 + Math.sin(this.menuAngle * 0.7) * 1.5, Math.sin(this.menuAngle) * r));
    this.camNode.lookAt(0, 3.6, 0);   // cameras look down -Z in three as in SceneKit
    this.setFov(62);
  }

  /** yaw around the world up axis first, then pitch, then roll – explicit so it never depends on Euler order */
  setCameraRotation(p, y, r) {
    _qYaw.setFromAxisAngle(_yAxis, y);
    _qPitch.setFromAxisAngle(_xAxis, p);
    _qRoll.setFromAxisAngle(_zAxis, r);
    this.camNode.quaternion.copy(_qYaw).multiply(_qPitch).multiply(_qRoll);
  }

  updateDeathCamera(dt) {
    const k = Math.min(this.deadT / 1.1, 1);
    const e = k * k * (3 - 2 * k);
    const y = mixf(this.eyeY, 0.45, e);
    setPos(this.camNode, v3(this.pos.x, this.pos.y + y, this.pos.z));
    this.setCameraRotation(this.pitch * (1 - e) + 0.25 * e, this.yaw, 0.9 * e);
  }

  // MARK: simulation

  simulate(dt, inp) {
    this.updatePlayer(dt, inp);
    this.updateWeapons(dt, inp);
    this.updateWorld(dt);
    this.updateWaves(dt);
    this.fx.update(dt);
    this.updateCamera(dt, inp);
    this.updateHUD(dt);
  }

  updateWorld(dt) {
    this.navT -= dt;
    if (this.navT <= 0) {
      this.navT = 0.14;
      this.level.nav.rebuild(this.pos);
    }
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
    this.updatePickups(dt);
    for (let i = 0; i < this.gateBoost.length; i++) {
      if (this.gateBoost[i] > 0) {
        this.gateBoost[i] = Math.max(0, this.gateBoost[i] - dt * 1.5);
        this.level.portalBoost(i, this.gateBoost[i]);
      }
    }
  }

  updatePlayer(dt, inp) {
    const sens = 0.0021;
    this.yaw -= inp.dx * sens;
    this.pitch = clampf(this.pitch - inp.dy * sens, -1.5, 1.5);
    this.yaw = wrapAngle(this.yaw);

    const pos = this.pos, vel = this.vel;
    const fwd = this.fwd, rightV = this.rightV;
    let wish = v3(0, 0, 0);
    if (inp.down(Key.w)) wish = add(wish, fwd);
    if (inp.down(Key.s)) wish = sub(wish, fwd);
    if (inp.down(Key.d)) wish = add(wish, rightV);
    if (inp.down(Key.a)) wish = sub(wish, rightV);
    const wl = len(wish);
    if (wl > 0) wish = mul(wish, 1 / wl);
    const sprint = inp.down(Key.shift) && inp.down(Key.w) && wl > 0;
    const maxSpeed = sprint ? 9.6 : 6.6;

    // dash
    this.dashCD = Math.max(0, this.dashCD - dt);
    if (inp.hit(Key.q) && this.dashCD <= 0) {
      this.dashDir = wl > 0 ? cp(wish) : cp(fwd);
      this.dashT = 0.17; this.dashCD = 2.2;
      this.audio.play('dash');
      this.fx.shake(0.12);
    }
    if (this.dashT > 0) {
      this.dashT -= dt;
      vel.x = this.dashDir.x * 25; vel.z = this.dashDir.z * 25;
      if (this.dashT <= 0) { vel.x = this.dashDir.x * maxSpeed; vel.z = this.dashDir.z * maxSpeed; }
    } else {
      const target = mul(wish, maxSpeed);
      let dv = v3(target.x - vel.x, 0, target.z - vel.z);
      const accel = this.onGround ? (wl > 0 ? 70 : 55) : (wl > 0 ? 22 : 2);
      const l = len(dv);
      const maxDv = accel * dt;
      if (l > maxDv) dv = mul(dv, maxDv / l);
      vel.x += dv.x; vel.y += dv.y; vel.z += dv.z;
    }

    // jump (buffered, with coyote time)
    this.jumpBuffer = inp.hit(Key.space) ? 0.12 : Math.max(0, this.jumpBuffer - dt);
    this.coyote = this.onGround ? 0.1 : Math.max(0, this.coyote - dt);
    if (this.jumpBuffer > 0 && this.coyote > 0) {
      vel.y = 7.8; this.onGround = false; this.coyote = 0; this.jumpBuffer = 0;
      this.audio.play('jump', 0.5);
    }
    vel.y -= 21 * dt;

    // horizontal move + collision
    const p = v3(pos.x + vel.x * dt, pos.y, pos.z + vel.z * dt);
    this.level.resolve(p, 0.45, pos.y, 1.8);
    for (const e of this.enemies) {
      if (e.dead || KindInfo[e.kind].flies) continue;
      const dx = p.x - e.pos.x, dz = p.z - e.pos.z;
      const l = Math.hypot(dx, dz), minD = e.radius + 0.4;
      if (l < minD && l > 1e-3 && Math.abs(e.pos.y - pos.y) < 1.6) {
        const k = (minD - l) * 0.5 / l;
        p.x += dx * k; p.z += dz * k;
      }
    }
    // vertical
    let ny = pos.y + vel.y * dt;
    const g = this.level.groundHeight(p.x, p.z, 0.3, Math.max(pos.y, ny), this.onGround ? 0.5 : 0.08);
    if (ny <= g) {
      if (!this.onGround && vel.y < -7) { this.audio.play('land', Math.min(1, -vel.y / 16)); this.fx.shake(Math.min(0.25, -vel.y / 60)); }
      ny = g; vel.y = 0; this.onGround = true;
    } else if (this.onGround && ny - g < 0.5 && vel.y <= 0) {
      ny = g; vel.y = 0;      // stick to stairs when walking down
    } else {
      this.onGround = false;
    }
    // actual velocity after collision (keeps sliding along walls sane)
    vel.x = (p.x - pos.x) / dt * 0.5 + vel.x * 0.5;
    vel.z = (p.z - pos.z) / dt * 0.5 + vel.z * 0.5;
    this.pos = v3(p.x, ny, p.z);

    const sp = len2(vel);
    if (this.onGround && sp > 1) this.bob += dt * sp * 1.25;
    this.sinceHurt += dt;
    if (this.sinceHurt > 4 && this.shield < 100) this.shield = Math.min(100, this.shield + 24 * dt);
    if (this.overcharge > 0) this.overcharge = Math.max(0, this.overcharge - dt);
    if (this.combo > 0) { this.comboT -= dt / 4.5; if (this.comboT <= 0) this.combo = 0; }
    const targetFov = 64 + (sprint ? 5 : 0) + (this.dashT > 0 ? 10 : 0);
    this.fov += (targetFov - this.fov) * Math.min(1, dt * 9);
  }

  updateCamera(dt, inp) {
    // eye height follows smoothly so steps don't snap the view
    const targetEye = 1.7;
    this.eyeY += (targetEye - this.eyeY) * Math.min(1, dt * 12);
    const vel = this.vel, rightV = this.rightV;
    const sp = Math.min(len2(vel) / 6.6, 1.4);
    const bobY = this.onGround ? Math.sin(this.bob * 2) * 0.035 * sp : 0;
    const bobX = this.onGround ? Math.cos(this.bob) * 0.02 * sp : 0;
    const tr = this.fx.trauma * this.fx.trauma;
    const sh = mul(v3(frand(-1, 1), frand(-1, 1), frand(-1, 1)), tr * 0.045);
    this.recoilPitch = Math.max(0, this.recoilPitch - dt * 0.9 - this.recoilPitch * dt * 9);
    const strafeRoll = -dot(vel, rightV) / 9.6 * 0.022;
    setPos(this.camNode, addMul(add(this.eye, v3(0, bobY, 0)), rightV, bobX));
    this.setCameraRotation(this.pitch + this.recoilPitch + sh.x, this.yaw + sh.y, strafeRoll + sh.z);
    this.setFov(this.fov);

    // view model motion
    const sway = this.sway;
    sway.x += (clampf(-inp.dx * 0.0012, -0.06, 0.06) - sway.x) * Math.min(1, dt * 10);
    sway.y += (clampf(inp.dy * 0.0012, -0.05, 0.05) - sway.y) * Math.min(1, dt * 10);
    this.kickZ = Math.max(0, this.kickZ - dt * 1.4 - this.kickZ * dt * 14);
    this.kickRot = Math.max(0, this.kickRot - dt * 0.8 - this.kickRot * dt * 12);
    const off = v3(
      0.30 + sway.x + bobX * 0.6,
      -0.30 + sway.y - bobY * 0.7 - (this.onGround ? 0 : clampf(vel.y * 0.006, -0.05, 0.05)),
      -0.84 + this.kickZ,
    );
    const rot = v3(this.kickRot + sway.y * 0.6, sway.x * 0.8, sway.x * 0.5);
    if (this.reloadT > 0) {
      const k = Math.sin((1 - this.reloadT / this.reloadDur) * Math.PI);
      off.y -= 0.22 * k; rot.x -= 0.5 * k; rot.z += 0.35 * k;
    }
    if (this.switchT > 0) {
      // first half: lower the old weapon, second half: raise the new one
      const k = this.switchT > 0.14 ? (0.28 - this.switchT) / 0.14 : this.switchT / 0.14;
      off.y -= 0.45 * k; rot.x -= 0.7 * k;
    }
    if (inp.down(Key.shift) && inp.down(Key.w) && this.onGround && this.reloadT <= 0) { rot.y += 0.25; off.x -= 0.03; off.y -= 0.03; }
    setPos(this.weaponHolder, off);
    this.weaponHolder.rotation.set(rot.x, rot.y, rot.z);
    if (this.flashT > 0) {
      this.flashT -= dt;
      if (this.flashT <= 0) this.weapons[this.cur].flash.visible = false;
    }
  }

  updateHUD(dt) {
    const w = this.weapons[this.cur];
    const pts = [];
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    let alive = 0;
    let boss = null;
    for (const e of this.enemies) {
      if (e.dead) continue;
      alive += 1;
      if (!boss && e.kind === 'boss') boss = e;
      const dx = e.pos.x - this.pos.x, dz = e.pos.z - this.pos.z;
      // rotate into view space: +y on the radar = forward
      pts.push({ p: v2(dx * cy - dz * sy, -(dx * sy + dz * cy)), boss: e.kind === 'boss' });
    }
    this.hud.setRadar(pts, 34);
    this.hud.update({
      dt, hp: this.hp, shield: this.shield, ammo: w.ammo, reserve: w.def.reserveMax < 0 ? -1 : w.reserve,
      weaponName: w.def.name, weaponIndex: this.cur, weaponNames: this.weapons.map((x) => x.def.short),
      weaponUsable: this.weapons.map((x) => x.ammo > 0 || x.reserve !== 0), weaponColor: w.def.color,
      spread: w.def.spread * (w.def.pellets > 1 ? 0.5 : 1) + this.bloom, reloading: this.reloadT,
      dash: 1 - this.dashCD / 2.2, overcharge: this.overcharge, score: this.score, combo: this.comboMult, comboT: this.comboT,
      wave: Math.max(this.wave, 1), enemiesLeft: this.spawnQueue.length + alive,
      bossName: boss ? `OVERSEER  MK ${this.bossCount}` : null, bossHp: boss ? boss.hp / boss.maxHp : 0,
    });
  }

  get comboMult() { return Math.min(1 + Math.floor(this.combo / 4), 8); }

  // MARK: player damage

  hurtPlayer(amount, src = null) {
    if (this.phase !== 'playing' || this.dashT > 0) return;
    if (this.demo && !this.demoMortal) return;
    let a = amount;
    this.sinceHurt = 0;
    if (this.shield > 0) {
      const s = Math.min(this.shield, a);
      this.shield -= s; a -= s;
      this.audio.play('shieldHit', 0.7);
      if (this.shield <= 0) this.hud.flash(v3(0.3, 0.9, 1), 0.25, 0.3);
    }
    if (a > 0) {
      this.hp -= a;
      this.audio.play('hurt', 0.9);
    }
    let ang = null;
    if (src) {
      const to = safeNorm(v3(src.x - this.pos.x, 0, src.z - this.pos.z));
      ang = Math.atan2(dot(to, this.rightV), dot(to, this.fwd));
    }
    this.hud.damage(amount, ang);
    this.fx.shake(Math.min(0.5, 0.12 + amount / 50));
    if (this.hp <= 0) this.die();
  }

  // MARK: waves

  updateWaves(dt) {
    if (!this.waveActive) {
      this.intermission -= dt;
      if (this.intermission <= 0) this.startWave();
      return;
    }
    const alive = this.enemies.length;
    if (this.spawnQueue.length > 0) {
      this.spawnT -= dt;
      const cap = Math.min(8 + this.wave * 2, 26);
      if (this.spawnT <= 0 && alive < cap) {
        this.spawnEnemy(this.spawnQueue.shift());
        this.spawnT = Math.max(0.22, 0.95 - this.wave * 0.045) * frand(0.7, 1.3);
      }
    } else if (alive === 0) {
      this.waveActive = false;
      this.intermission = 5.5;
      const bonus = 250 * this.wave;
      this.score += bonus;
      this.hud.announce(`WELLE ${this.wave} GESCHAFFT`, `+${bonus} Bonus  ·  nächste Welle in 5 Sekunden`, v3(0.4, 1, 0.6), 2.2);
      this.audio.play('waveClear');
      // resupply
      const spots = shuffled(this.level.pickupSpots);
      this.spawnPickup('health', cp(spots.shift()));
      this.spawnPickup('ammo', cp(spots.shift()));
      if (this.wave % 3 === 0) this.spawnPickup('power', cp(spots.shift()));
    }
  }

  startWave() {
    this.wave += 1;
    this.waveActive = true;
    this.spawnT = 0.6;
    const wave = this.wave;
    const isBoss = wave % 5 === 0;
    let budget = 4.5 + wave * 3.0 + Math.pow(wave, 1.3);
    if (isBoss) budget *= 0.45;
    const pool = ['skitter', 'skitter'];
    if (wave >= 2) pool.push('drone', 'drone');
    if (wave >= 3) pool.push('trooper', 'trooper');
    if (wave >= 4) pool.push('roller');
    if (wave >= 6) pool.push('brute');
    if (wave >= 9) pool.push('trooper', 'brute', 'roller');
    let q = [];
    let guardCount = 0;
    while (budget > 0.9 && guardCount < 200) {
      guardCount += 1;
      const k = pool[Math.floor(Math.random() * pool.length)];
      const cost = KindInfo[k].cost;
      if (cost > budget + 0.5) continue;
      q.push(k); budget -= cost;
    }
    q = shuffled(q);
    if (isBoss) { q.unshift('boss'); this.bossCount += 1; }
    this.spawnQueue = q;
    if (isBoss) {
      this.hud.announce('WARNUNG', 'OVERSEER nähert sich', v3(1, 0.2, 0.15), 2.4);
      this.audio.play('boss');
    } else {
      this.hud.announce(`WELLE ${wave}`, `${q.length} Feindkontakte`, v3(1, 1, 1), 1.5);
      this.audio.play('wave', 0.8);
    }
  }

  spawnEnemy(kind, forced = null) {
    // prefer gates that are not right next to the player
    const gates = this.level.gates;
    const order = gates.map((_, i) => i).sort((a, b) => dist(gates[b].pos, this.pos) - dist(gates[a].pos, this.pos));
    const gi = order[Math.floor(Math.random() * Math.min(3, order.length))];
    const gate = gates[gi];
    const sideV = v3(gate.dir.z, 0, -gate.dir.x);
    let p = forced ? cp(forced) : addMul(addMul(gate.pos, sideV, frand(-1.6, 1.6)), gate.dir, frand(0, 1.5));
    if (!forced) {
      if (kind === 'drone') p.y = 3.2;
      if (kind === 'boss') { p = addMul(gate.pos, gate.dir, 7); p.y = 6.5; }
      this.gateBoost[gi] = 1;
    }
    const info = KindInfo[kind];
    const hpScale = 1 + (this.wave - 1) * 0.07 + (kind === 'boss' ? (this.bossCount - 1) * 0.45 : 0);
    const e = new Enemy(kind, cp(p), hpScale);
    e.yaw = Math.atan2(this.pos.x - p.x, this.pos.z - p.z);
    this.scene.add(e.node);
    this.enemies.push(e);
    this.fx.spawnFlash(info.flies ? sub(p, v3(0, 1, 0)) : cp(p), info.glow);
    this.audio.playAt('spawn', p, this.pos, this.yaw, 0.9);
  }

  // MARK: demo autopilot (used for automated screenshots)

  /** Replaces the frame's input with the autopilot's (Swift: inout). */
  demoInput(inp) {
    inp.keys = new Set(); inp.pressed = [];
    inp.dx = 0; inp.dy = 0; inp.fire = false; inp.clicked = false; inp.scroll = 0;
    if (this.phase === 'menu') return inp;
    if (this.phase === 'dead') return inp;
    const eye = this.eye;
    let best = null;
    let bd = Infinity;
    for (const e of this.enemies) {
      if (e.dead || e.spawnT > 0) continue;
      const c = e.center;
      const d = dist(c, eye);
      if (d < bd && this.level.lineOfSight(eye, c)) { bd = d; best = e; }
    }
    inp.keys.add(Key.w);
    inp.keys.add(this.time % 6 < 3 ? Key.a : Key.d);
    if (best) {
      const to = safeNorm(sub(best.center, eye));
      const ty = Math.atan2(-to.x, -to.z), tp = Math.asin(clampf(to.y, -1, 1));
      const dyaw = wrapAngle(ty - this.yaw), dp = tp - this.pitch;
      inp.dx = -dyaw * 0.25 / 0.0021;
      inp.dy = -dp * 0.25 / 0.0021;
      inp.fire = Math.abs(dyaw) < 0.06 && Math.abs(dp) < 0.06;
      inp.clicked = inp.fire;
    } else {
      const to = safeNorm(sub(v3(0, 1.5, 0), eye));
      const dyaw = wrapAngle(Math.atan2(-to.x, -to.z) - this.yaw);
      inp.dx = -dyaw * 0.1 / 0.0021;
      inp.dy = this.pitch * 0.1 / 0.0021;
    }
    this.demoWeaponT += 1.0 / 60;
    if (this.demoWeaponT > 5) { this.demoWeaponT = 0; inp.pressed.push([Key.n1, Key.n2, Key.n3, Key.n4][(this.cur + 1) % 4]); }
    return inp;
  }

  // MARK: diagnostics (window.__nova / autotest)

  debugState() {
    const w = this.weapons[this.cur];
    return {
      phase: this.phase,
      wave: this.wave,
      score: this.score,
      kills: this.kills,
      hp: this.hp,
      shield: this.shield,
      enemies: this.enemies.length,
      projectiles: this.projectiles.length,
      pickups: this.pickups.length,
      fps: Math.round(this.fpsAverage * 10) / 10,
      weapon: w ? w.def.name : null,
    };
  }
}

// The combat half: Swift's `extension Game` in Combat.swift. game.js and combat.js import each other,
// so depending on which one the bundle evaluates first CombatMethods may not exist yet at this point –
// the constructor calls installCombat() again, by then it always does.
let combatInstalled = false;
function installCombat() {
  if (combatInstalled) return;
  Object.assign(Game.prototype, CombatMethods);
  combatInstalled = typeof Game.prototype.buildWeapons === 'function';
}
try { installCombat(); } catch { /* combat.js not evaluated yet (import cycle); retried in the constructor */ }
