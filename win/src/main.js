// Bootstrap of the Windows port. Mirrors Sources/main.swift: window/input shell, test modes, frame loop.
//
// URL parameters (set by `electron . --autotest ...`):
//   demo=1        autopilot plays (no pointer lock), starts the game after 1.5 s
//   mortal=1      autopilot can die (tests the game-over path)
//   wave=N        start at wave N
//   mute=1        no audio
//   menu=1        stay in the menu
//   pose=lineup   all enemy kinds side by side (model check), HUD hidden
//   cam=x,y,z,lx,ly,lz  static camera looking at (lx, ly, lz), HUD hidden; optional fov=deg
//   weapon=N      (demo) start with weapon N (1-4) and keep it
//   pauseAt=S     (demo) open the pause menu after S seconds of play

import * as THREE from 'three';
import { initTextures } from './textures.js';
import { Game } from './game.js';
import { createPostFX } from './postfx.js';
import { Enemy, ALL_KINDS } from './enemies.js';

const params = new URLSearchParams(location.search);
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message || e.error)));
window.addEventListener('unhandledrejection', (e) => errors.push(`unhandled: ${String((e.reason && e.reason.message) || e.reason)}`));

const GAME_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR', 'KeyF', 'KeyM', 'Space', 'ShiftLeft',
  'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Enter', 'Escape', 'Tab']);

function loadingScreen() {
  const el = document.getElementById('loading');
  const bar = document.getElementById('loading-bar');
  const label = document.getElementById('loading-label');
  return {
    progress(f, text) {
      if (bar) bar.style.transform = `scaleX(${Math.max(0.02, f).toFixed(3)})`;
      if (label && text) label.textContent = text.toUpperCase();
    },
    hide() { if (el) { el.classList.add('done'); setTimeout(() => el.remove(), 600); } },
  };
}

async function boot() {
  const canvas = document.getElementById('view');
  const hudRoot = document.getElementById('hud');
  const loading = loadingScreen();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
  let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const maxPixelRatio = pixelRatio;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;   // tone mapping happens in the final grade pass
  renderer.info.autoReset = false;

  await initTextures((f, text) => loading.progress(f, text));

  const demo = params.get('demo') === '1';
  const game = new Game({ renderer, hudRoot, audioEnabled: params.get('mute') !== '1' });
  game.demo = demo;
  game.demoMortal = params.get('mortal') === '1';
  const postfx = createPostFX(renderer, game.scene, game.camera);

  // ---- inspection modes
  const camParam = params.get('cam');
  const pose = params.get('pose');
  let staticCam = null;
  if (pose === 'lineup') {
    let x = 1.5;
    for (const k of ALL_KINDS) {
      const e = new Enemy(k, { x, y: k === 'drone' ? 1.6 : (k === 'boss' ? 4.4 : 0), z: k === 'boss' ? 12 : 16 }, 1);
      e.node.scale.set(1, 1, 1);
      e.node.rotation.set(0, 0.45, 0);
      game.scene.add(e.node);
      x += k === 'brute' ? 4.5 : (k === 'trooper' ? 2.6 : 2.4);
    }
    staticCam = [12, 3.0, 26, 12.5, 2.8, 14];
  }
  if (camParam) staticCam = camParam.split(',').map(Number);
  if (staticCam) {
    hudRoot.style.display = 'none';
    game.weaponRoot.visible = false;
    if (params.get('fov')) game.setFov(Number(params.get('fov')));
  }

  // ---- capture / fullscreen callbacks
  const locked = () => document.pointerLockElement === canvas;
  const requestLock = () => {
    if (demo || staticCam || locked()) return;
    try {
      const p = canvas.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) {
        p.catch(() => {
          // unadjustedMovement unsupported (or still blocked right after ESC) – plain lock, and the next click retries
          try { const q = canvas.requestPointerLock(); if (q && q.catch) q.catch(() => {}); } catch { /* retried on click */ }
        });
      }
    } catch { /* retried on the next click */ }
  };
  game.onCapture = (on) => {
    if (on) requestLock();
    else if (locked()) document.exitPointerLock();
  };
  game.onToggleFullscreen = () => {
    if (window.novaShell && window.novaShell.toggleFullscreen) { window.novaShell.toggleFullscreen(); return; }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  // ---- input
  let gestured = false;
  const gesture = () => { if (!gestured) { gestured = true; game.audio.resume(); } else game.audio.resume(); };
  const codeOf = (e) => (e.code === 'ShiftRight' ? 'ShiftLeft' : e.code === 'NumpadEnter' ? 'Enter' : e.code);
  if (!demo) {
    window.addEventListener('keydown', (e) => {
      gesture();
      const code = codeOf(e);
      if (GAME_KEYS.has(code)) e.preventDefault();
      if (e.repeat) return;
      if (e.altKey && code === 'F4') return;
      game.input.key(code, true);
    });
    window.addEventListener('keyup', (e) => game.input.key(codeOf(e), false));
    canvas.addEventListener('mousedown', (e) => {
      gesture();
      if (e.button !== 0) return;
      if (game.phase === 'playing' && !locked()) requestLock();
      game.input.button(true);
    });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) game.input.button(false); });
    window.addEventListener('mousemove', (e) => { if (locked()) game.input.mouse(e.movementX, e.movementY); });
    let lastWheel = 0;
    window.addEventListener('wheel', (e) => {
      const now = performance.now();
      if (Math.abs(e.deltaY) < 1 || now - lastWheel < 120) return;
      lastWheel = now;
      game.input.scroll(-Math.sign(e.deltaY));
    }, { passive: true });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      // Chromium swallows ESC while the pointer is locked: losing the lock while playing means "pause"
      if (!locked() && game.phase === 'playing') game.pauseRequested = true;
    });
    const lost = () => { game.input.releaseAll(); if (game.phase === 'playing') game.pauseRequested = true; };
    window.addEventListener('blur', lost);
    document.addEventListener('visibilitychange', () => { if (document.hidden) lost(); });
  }

  // ---- demo / autotest scheduling
  const startWave = Number(params.get('wave') || 1);
  const forcedWeapon = Number(params.get('weapon') || 0);
  const pauseAt = Number(params.get('pauseAt') || 0);
  let waveApplied = false;
  let playTime = 0;
  if (demo && params.get('menu') !== '1' && !staticCam) setTimeout(() => { game.autoStart = true; }, 1500);
  if (forcedWeapon) game.demoWeaponT = -1e9;

  // ---- resize
  const onResize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    game.camera.aspect = w / Math.max(1, h);
    game.camera.updateProjectionMatrix();
    postfx.setSize(w, h, pixelRatio);
  };
  window.addEventListener('resize', onResize);
  onResize();

  // ---- adaptive resolution: keep integrated GPUs playable
  let frameMs = 16, sampleT = 0;
  const adapt = (ms) => {
    frameMs += (ms - frameMs) * 0.05;
    sampleT += ms;
    if (sampleT < 1500) return;
    sampleT = 0;
    let next = pixelRatio;
    if (frameMs > 18 && pixelRatio > 0.6) next = Math.max(0.6, pixelRatio - 0.15);
    else if (frameMs < 11 && pixelRatio < maxPixelRatio) next = Math.min(maxPixelRatio, pixelRatio + 0.15);
    if (Math.abs(next - pixelRatio) > 1e-3) { pixelRatio = next; onResize(); }
  };

  window.__nova = {
    game,
    renderer,
    postfx,
    debugState() {
      let objects = 0;
      game.scene.traverse(() => { objects += 1; });
      return {
        ...game.debugState(),
        errors: errors.slice(0, 20),
        renderScale: Math.round(pixelRatio * 100) / 100,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        programs: renderer.info.programs ? renderer.info.programs.length : null,
        sceneObjects: objects,
        particles: game.fx.particles.count,
        frameMs: Math.round(frameMs * 10) / 10,
      };
    },
  };

  loading.hide();

  let last = performance.now();
  let animT = 0;
  const frame = (now) => {
    const raw = (now - last) / 1000;
    last = now;
    const dt = Math.min(Math.max(raw, 0.0005), 0.05);
    renderer.info.reset();
    try {
      if (staticCam) {
        animT += dt;
        game.level.update(dt, animT);
        game.fx.update(dt);
        game.camera.position.set(staticCam[0], staticCam[1], staticCam[2]);
        game.camera.lookAt(staticCam[3], staticCam[4], staticCam[5]);
        game.camera.updateMatrixWorld(true);
      } else {
        if (demo && game.phase === 'playing') {
          playTime += dt;
          if (!waveApplied) { waveApplied = true; if (startWave > 1) game.wave = startWave - 1; }
          if (forcedWeapon && game.cur !== forcedWeapon - 1 && game.switchT <= 0) game.selectWeapon(forcedWeapon - 1);
          if (pauseAt > 0 && playTime >= pauseAt) { game.setPaused(true); }
        }
        game.tick(dt);
      }
      postfx.render();
    } catch (err) {
      errors.push(String((err && err.stack) || err));
      console.error(err);
    }
    adapt(raw * 1000);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  errors.push(String((err && err.stack) || err));
  console.error(err);
  const el = document.getElementById('loading-label');
  if (el) el.textContent = `FEHLER BEIM START: ${String((err && err.message) || err)}`;
  window.__nova = { debugState: () => ({ phase: 'boot-failed', errors }) };
});
