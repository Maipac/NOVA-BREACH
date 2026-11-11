// Audio for the NOVA BREACH port. Mirrors Sources/Audio.swift.
//
// All sound effects and the music loop are synthesised at startup, formula for formula like the
// Swift version, into 44.1 kHz buffers and played through Web Audio:
//   22 pooled voices:  BufferSource -> Gain -> StereoPanner -> master
//   music:             BufferSource (loop) -> Gain -> master

import { v3, sub, mul, dot, len } from './math.js';

const SR = 44100;                      // Audio.sr
const POOL = 22;

// Swift computes everything in Float. Oscillator phases, filter states, sample times and every
// value that decides a sample *position* are therefore kept in float32 (Math.fround) so they
// round the way the original does; the expression in between is evaluated in double, which
// stays within a float32 ulp of the Swift result.
const f32 = Math.fround;
const sin = Math.sin, exp = Math.exp, floor = Math.floor, min = Math.min, max = Math.max;
// Float.pi is rounded toward zero (3.1415925), not to nearest like Math.fround(Math.PI).
const PI = 3.1415925025939941;
const TAU = 2 * PI;                    // 2 * Float.pi
const DT = f32(1 / SR);

/** The noise source of every voice: a 32-bit LCG mapped to -1..1 (Swift's `LCG`). */
class LCG {
  constructor(s) { this.s = s | 0; }
  next() {
    this.s = (Math.imul(this.s, 1664525) + 1013904223) | 0;
    return f32(this.s) / 2147483648;   // Float(Int32(bitPattern: s)) / 2^31
  }
}

/** Int(Float * Float) – sample counts and offsets must truncate exactly like Swift. */
const samples = (seconds) => Math.trunc(f32(f32(seconds) * SR));

// MARK: synthesis

/** Renders one mono effect: soft clip through tanh, 300-sample fade-out against end clicks. */
function render(dur, gain, fn, seed = 1) {
  const n = samples(dur);
  const out = new Float32Array(n);
  const rng = new LCG(Math.imul(seed, 7919) + 13);
  const g = f32(gain);
  for (let i = 0; i < n; i++) {
    const t = f32(i / SR);
    const fadeOut = min(1, f32((n - i) / 300));
    out[i] = f32(Math.tanh(f32(f32(fn(t, rng)) * g))) * fadeOut;
  }
  return out;
}

/** All effects as { name: Float32Array } (mono, 44.1 kHz). */
export function buildSounds() {
  const sounds = {};
  const tau = TAU, dt = DT;
  const F = f32;   // Float literals that are compared against t (thresholds are sample-accurate)

  { // pulse rifle
    let ph = 0, lp = 0;
    sounds.rifle = render(0.2, 1.3, (t, n) => {
      ph = f32(ph + tau * (150 + 1000 * exp(-t * 42)) * dt);
      lp = f32(lp + (n.next() - lp) * 0.5);
      return (sin(ph) + 0.4 * sin(ph * 2.01)) * exp(-t * 24) * 0.55 + lp * exp(-t * 50) * 0.8;
    });
  }
  { // shotgun
    let lp = 0, lp2 = 0, ph = 0;
    sounds.shotgun = render(0.55, 2.0, (t, n) => {
      const cut = 0.06 + 0.6 * exp(-t * 14);
      lp = f32(lp + (n.next() - lp) * cut);
      lp2 = f32(lp2 + (lp - lp2) * cut);
      ph = f32(ph + tau * (48 + 90 * exp(-t * 18)) * dt);
      return lp2 * exp(-t * 8) * 1.4 + sin(ph) * exp(-t * 11) * 0.9;
    });
  }
  { // railgun
    let ph = 0, ph2 = 0, lp = 0;
    sounds.rail = render(0.9, 1.6, (t, n) => {
      ph = f32(ph + tau * (110 + 2400 * exp(-t * 7)) * dt);
      ph2 = f32(ph2 + tau * 53 * dt);
      lp = f32(lp + (n.next() - lp) * 0.7);
      const saw = 2 * (ph / tau - floor(ph / tau + 0.5));
      return saw * exp(-t * 5) * 0.45 * (0.7 + 0.3 * sin(ph2 * 6)) + lp * exp(-t * 30) * 0.9 + sin(ph2) * exp(-t * 6) * 0.7;
    });
  }
  { // plasma launcher
    let ph = 0, lp = 0;
    sounds.launcher = render(0.5, 1.7, (t, n) => {
      ph = f32(ph + tau * (50 + 170 * exp(-t * 16)) * dt);
      lp = f32(lp + (n.next() - lp) * 0.12);
      return sin(ph) * exp(-t * 8) + lp * exp(-t * 12) * 1.3;
    });
  }
  { // explosion
    let lp = 0, lp2 = 0, ph = 0;
    sounds.explosion = render(1.5, 2.4, (t, n) => {
      const cut = 0.012 + 0.35 * exp(-t * 6);
      lp = f32(lp + (n.next() - lp) * cut);
      lp2 = f32(lp2 + (lp - lp2) * cut);
      ph = f32(ph + tau * (28 + 60 * exp(-t * 7)) * dt);
      return lp2 * exp(-t * 3.2) * 2.2 + sin(ph) * exp(-t * 4.5) * 0.9;
    });
  }
  { // enemy blaster
    let ph = 0;
    sounds.enemyShot = render(0.22, 0.9, (t) => {
      ph = f32(ph + tau * (380 + 1300 * exp(-t * 16)) * dt);
      const sq = sin(ph) > 0 ? 1 : -1;
      return (sin(ph) * 0.7 + sq * 0.18) * exp(-t * 17);
    });
  }
  { // hit marker tick
    let ph = 0;
    sounds.hit = render(0.06, 0.8, (t) => {
      ph = f32(ph + tau * 2300 * dt);
      return sin(ph) * exp(-t * 90);
    });
    let ph2 = 0;
    sounds.crit = render(0.1, 0.9, (t) => {
      ph2 = f32(ph2 + tau * (t < F(0.03) ? 2600 : 3500) * dt);
      return sin(ph2) * exp(-t * 45);
    });
  }
  { // kill confirm
    let ph = 0;
    sounds.kill = render(0.22, 0.8, (t) => {
      ph = f32(ph + tau * (t < F(0.07) ? 880 : 1320) * dt);
      return (sin(ph) + 0.3 * sin(ph * 2)) * exp(-t * 16) * 0.8;
    });
  }
  { // enemy destroyed
    let ph = 0, lp = 0;
    sounds.enemyDie = render(0.4, 1.5, (t, n) => {
      ph = f32(ph + tau * (70 + 600 * exp(-t * 12)) * dt);
      lp = f32(lp + (n.next() - lp) * 0.3);
      const sq = sin(ph) > 0 ? 1 : -1;
      return sq * exp(-t * 11) * 0.35 + lp * exp(-t * 9) * 0.9;
    });
  }
  { // player hurt
    let ph = 0, lp = 0;
    sounds.hurt = render(0.3, 1.6, (t, n) => {
      ph = f32(ph + tau * (70 + 90 * exp(-t * 20)) * dt);
      lp = f32(lp + (n.next() - lp) * 0.2);
      return sin(ph) * exp(-t * 12) + lp * exp(-t * 20) * 0.8;
    });
    let ph2 = 0;
    sounds.shieldHit = render(0.25, 1.0, (t, n) => {
      ph2 = f32(ph2 + tau * (900 + 500 * sin(t * 90)) * dt);
      return sin(ph2) * exp(-t * 16) * 0.6 + n.next() * exp(-t * 40) * 0.3;
    });
  }
  { // pickup
    let ph = 0;
    sounds.pickup = render(0.42, 0.8, (t) => {
      const f = t < F(0.09) ? 660 : (t < F(0.18) ? 880 : 1320);
      ph = f32(ph + tau * f * dt);
      const lt = t < F(0.09) ? t : (t < F(0.18) ? t - F(0.09) : t - F(0.18));
      return (sin(ph) + 0.25 * sin(ph * 3)) * exp(-lt * 9) * 0.7;
    });
    let ph2 = 0;
    sounds.power = render(0.8, 0.9, (t) => {
      ph2 = f32(ph2 + tau * (220 + 900 * t * t + 30 * sin(t * 70)) * dt);
      const saw = 2 * (ph2 / tau - floor(ph2 / tau + 0.5));
      return (sin(ph2) * 0.7 + saw * 0.2) * min(1, t * 20) * exp(-max(0, t - 0.5) * 9);
    });
  }
  { // reload clicks
    let bp = 0, lp = 0;
    sounds.reload = render(0.5, 1.4, (t, n) => {
      const a = exp(-max(0, t - F(0.02)) * 90) * (t > F(0.02) ? 1 : 0);
      const b = exp(-max(0, t - F(0.3)) * 70) * (t > F(0.3) ? 1 : 0);
      const c = exp(-max(0, t - F(0.38)) * 110) * (t > F(0.38) ? 1 : 0);
      const x = n.next();
      lp = f32(lp + (x - lp) * 0.35);
      bp = x - lp;
      return bp * (a * 0.8 + b + c * 0.7) + sin(t * tau * 420) * c * 0.25;
    });
    sounds.empty = render(0.07, 1.0, (t, n) => n.next() * exp(-t * 130) * 0.6 + sin(t * tau * 1500) * exp(-t * 100) * 0.3);
    let lp2 = 0;
    sounds.swap = render(0.18, 1.2, (t, n) => {
      lp2 = f32(lp2 + (n.next() - lp2) * 0.25);
      return lp2 * sin(min(t / F(0.18), 1) * PI) * 0.9
        + sin(t * tau * 300) * exp(-max(0, t - F(0.12)) * 80) * (t > F(0.12) ? 0.3 : 0);
    });
  }
  { // dash whoosh
    let lp = 0, lp2 = 0;
    sounds.dash = render(0.35, 1.6, (t, n) => {
      const k = sin(min(t / F(0.35), 1) * PI);
      const cut = 0.05 + 0.4 * k;
      lp = f32(lp + (n.next() - lp) * cut);
      lp2 = f32(lp2 + (lp - lp2) * cut);
      return lp2 * k * 1.5;
    });
    let ph = 0;
    sounds.jump = render(0.14, 0.9, (t, n) => {
      ph = f32(ph + tau * (130 + 120 * t * 7) * dt);
      return sin(ph) * exp(-t * 26) * 0.5 + n.next() * exp(-t * 60) * 0.12;
    });
    let ph3 = 0, lp3 = 0;
    sounds.land = render(0.16, 1.2, (t, n) => {
      ph3 = f32(ph3 + tau * (60 + 70 * exp(-t * 30)) * dt);
      lp3 = f32(lp3 + (n.next() - lp3) * 0.15);
      return sin(ph3) * exp(-t * 26) * 0.7 + lp3 * exp(-t * 30);
    });
  }
  { // wave alarm
    let ph = 0, lp = 0;
    sounds.wave = render(1.1, 0.9, (t) => {
      const seg = Math.trunc(f32(t / F(0.26)));
      const lt = f32(t - f32(seg * F(0.26)));
      const f = seg % 2 === 0 ? 440 : 587.3;
      ph = f32(ph + tau * f * dt);
      const sq = sin(ph) > 0 ? 1 : -1;
      lp = f32(lp + (sq - lp) * 0.18);
      return (lp * 0.5 + sin(ph) * 0.4) * min(1, lt * 80) * exp(-lt * 5) * (seg < 4 ? 1 : 0);
    });
    let ph2 = 0, lp2 = 0;
    sounds.boss = render(2.0, 1.6, (t, n) => {
      ph2 = f32(ph2 + tau * (44 + 12 * sin(t * 3)) * dt);
      const saw = 2 * (ph2 / tau - floor(ph2 / tau + 0.5));
      lp2 = f32(lp2 + (saw + 0.3 * n.next() - lp2) * (0.04 + 0.1 * min(t, 1)));
      return lp2 * min(1, t * 4) * exp(-max(0, t - F(1.2)) * 4) * (0.7 + 0.3 * sin(t * 37)) * 2;
    });
    let ph3 = 0;
    sounds.spawn = render(0.4, 0.8, (t) => {
      ph3 = f32(ph3 + tau * (180 + 1500 * t) * dt);
      return sin(ph3) * (0.6 + 0.4 * sin(t * 160)) * sin(min(t / F(0.4), 1) * PI) * 0.6;
    });
    let ph4 = 0;
    sounds.waveClear = render(0.7, 0.8, (t) => {
      const f = t < F(0.12) ? 523.25 : (t < F(0.24) ? 659.25 : (t < F(0.36) ? 783.99 : 1046.5));
      ph4 = f32(ph4 + tau * f * dt);
      const lt = t < F(0.36) ? t % F(0.12) : t - F(0.36);   // truncatingRemainder
      return (sin(ph4) + 0.3 * sin(ph4 * 2)) * exp(-lt * 6) * 0.6;
    });
    let ph5 = 0;
    sounds.death = render(1.6, 1.3, (t, n) => {
      ph5 = f32(ph5 + tau * (220 * exp(-t * 1.6) + 30) * dt);
      const saw = 2 * (ph5 / tau - floor(ph5 / tau + 0.5));
      return (saw * 0.4 + sin(ph5 * 0.5) * 0.6) * exp(-t * 1.6) + n.next() * exp(-t * 14) * 0.5;
    });
    let ph6 = 0;
    sounds.ui = render(0.12, 0.7, (t) => {
      ph6 = f32(ph6 + tau * 990 * dt);
      return sin(ph6) * exp(-t * 30);
    });
    let ph7 = 0;
    sounds.melee = render(0.2, 1.4, (t, n) => {
      ph7 = f32(ph7 + tau * (90 + 200 * exp(-t * 30)) * dt);
      return sin(ph7) * exp(-t * 20) + n.next() * exp(-t * 50) * 0.5;
    });
    let ph8 = 0;
    sounds.beep = render(0.09, 0.7, (t) => {
      ph8 = f32(ph8 + tau * 1760 * dt);
      return (sin(ph8) > 0 ? 0.5 : -0.5) * exp(-t * 25);
    });
  }
  return sounds;
}

// MARK: music

/**
 * The 8-bar music loop as a generator: it yields after every voice so the caller can spread the
 * work over several time slices, and returns { left, right } (Float32Array, 44.1 kHz).
 * Voices are rendered in the same order as Swift – snare and hats share one noise generator.
 */
export function* musicSteps() {
  const sr = SR;
  const bpm = 104;
  const beat = f32(60 / bpm);
  const step = f32(beat / 4);
  const bars = 8;
  const n = Math.trunc(f32(f32(bars * 4 * beat) * sr));
  const L = new Float32Array(n), R = new Float32Array(n);
  const tau = TAU;
  const rng = new LCG(4242);

  // Mixes one voice into the loop; tails that run past the end wrap around to the start,
  // which is what makes the loop seamless.
  const add = (start, dur, gl, gr, fn) => {
    const s0 = Math.trunc(f32(start * sr)), cnt = Math.trunc(f32(dur * sr));
    gl = f32(gl); gr = f32(gr);
    for (let i = 0; i < cnt; i++) {
      const v = f32(fn(f32(i / sr)));
      const j = (s0 + i) % n;
      L[j] += f32(v * gl); R[j] += f32(v * gr);
    }
  };

  const roots = [73.42, 73.42, 87.31, 65.41, 73.42, 73.42, 58.27, 65.41];
  const chords = [
    [146.83, 174.61, 220.0], [146.83, 174.61, 220.0], [174.61, 220.0, 261.63], [130.81, 164.81, 196.0],
    [146.83, 174.61, 220.0], [146.83, 174.61, 220.0], [116.54, 146.83, 174.61], [130.81, 164.81, 196.0],
  ];
  const bassPat = [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
  const bassOct = [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
  const arpPat = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 2];

  for (let bar = 0; bar < bars; bar++) {
    const barT = f32(bar * 4 * beat);
    // kick + snare
    for (let b = 0; b < 4; b++) {
      const t0 = f32(barT + f32(b * beat));
      let ph = 0;
      add(t0, 0.3, 0.75, 0.75, (t) => {
        ph = f32(ph + tau * (42 + 95 * exp(-t * 28)) / sr);
        return sin(ph) * exp(-t * 10);
      });
      yield;
      if (b % 2 === 1) {
        let lp = 0, ph2 = 0;
        add(t0, 0.22, 0.26, 0.26, (t) => {
          const x = rng.next();
          lp = f32(lp + (x - lp) * 0.3);
          ph2 = f32(ph2 + tau * 185 / sr);
          return (x - lp) * exp(-t * 20) + sin(ph2) * exp(-t * 30) * 0.5;
        });
        yield;
      }
    }
    for (let s = 0; s < 16; s++) {
      const t0 = f32(barT + f32(s * step));
      // hats
      let lp = 0;
      const acc = f32(s % 4 === 2 ? 0.16 : (s % 2 === 1 ? 0.05 : 0.09));
      const hatDecay = s % 4 === 2 ? 45 : 90;
      add(t0, 0.07, f32(acc * f32(0.8)), acc, (t) => {
        const x = rng.next();
        lp = f32(lp + (x - lp) * 0.6);
        return (x - lp) * exp(-t * hatDecay);
      });
      yield;
      // bass
      if (bassPat[s] === 1) {
        const f = f32(f32(roots[bar]) * bassOct[s]);
        let ph = 0, flt = 0;
        add(t0, f32(step * f32(1.1)), 0.34, 0.34, (t) => {
          ph = f32(ph + f / sr);
          ph = f32(ph - floor(ph));
          const saw = 2 * ph - 1;
          const cut = 0.03 + 0.22 * exp(-t * 18);
          flt = f32(flt + (saw - flt) * cut);
          return flt * min(1, t * 300) * exp(-t * 7);
        });
        yield;
      }
      // arpeggio with ping-pong echoes (only in the second half of each 2-bar phrase start)
      if (bar >= 2) {
        const f = f32(f32(chords[bar][arpPat[s]]) * (s % 8 === 7 ? 4 : 2));
        for (const [k, g0] of [[0, 0.085], [3, 0.05], [6, 0.028]]) {
          const g = f32(g0);
          let ph = 0;
          const gl = k === 3 ? f32(g * f32(0.3)) : g;
          const gr = k === 6 ? f32(g * f32(0.3)) : (k === 3 ? g : f32(g * f32(0.8)));
          add(f32(t0 + f32(k * step)), 0.32, gl, gr, (t) => {
            ph = f32(ph + tau * f / sr);
            return (sin(ph) + 0.35 * sin(ph * 2) + 0.15 * sin(ph * 3)) * exp(-t * 13) * min(1, t * 400);
          });
          yield;
        }
      }
    }
    // pad
    const barDur = f32(4 * beat);
    const padDur = f32(barDur + 0.25);
    for (let ci = 0; ci < 3; ci++) {
      const f = f32(chords[bar][ci]);
      for (const [det, gl, gr] of [[0.996, 0.05, 0.02], [1.004, 0.02, 0.05], [0.5, 0.03, 0.03]]) {
        const fd = f32(f * f32(det));
        let ph = f32(ci * f32(0.31)), flt = 0;
        add(barT, padDur, gl, gr, (t) => {
          ph = f32(ph + fd / sr);
          ph = f32(ph - floor(ph));
          flt = f32(flt + ((2 * ph - 1) - flt) * 0.045);
          const env = min(1, t / 0.25) * min(1, max(0, (padDur - t) / 0.25));
          return flt * env;
        });
        yield;
      }
    }
  }
  for (let i = 0; i < n; i++) {
    L[i] = Math.tanh(f32(L[i] * f32(1.15)));
    R[i] = Math.tanh(f32(R[i] * f32(1.15)));
  }
  return { left: L, right: R };
}

/** The whole loop in one go (Swift's makeMusic). The game uses the sliced version below. */
export function makeMusic() {
  const gen = musicSteps();
  for (;;) {
    const r = gen.next();
    if (r.done) return r.value;
  }
}

// Hands control back to the event loop between music slices. A MessageChannel hop has no 4 ms
// clamp and is not throttled in a hidden window the way timers are.
function nextSlice(fn) {
  if (typeof MessageChannel === 'function') {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => { ch.port1.close(); fn(); };
    ch.port2.postMessage(0);
  } else {
    setTimeout(fn, 0);
  }
}

const MUSIC_SLICE_MS = 4;     // music synthesis per slice – well below a frame, so nothing stutters
const RESUME_GRACE_MS = 400;  // how long after resume() sounds may queue on a not-yet-running context

/** All sound effects and the music loop are synthesised at startup. */
export class GameAudio {
  constructor({ enabled = true } = {}) {
    this.enabled = enabled;
    this.ctx = null;
    this.master = null;
    this.players = [];          // [{ gain, pan, src }]
    this.next = 0;
    this.sounds = {};           // name -> AudioBuffer (mono)
    this.music = null;          // GainNode of the music loop
    this.musicSource = null;
    this.musicBuffer = null;
    this.musicStarted = false;
    this._musicVolume = 0.42;
    this._musicOn = true;
    this._resumeAt = -Infinity;
    if (!enabled) return;

    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) { this.enabled = false; return; }
    try {
      // 44.1 kHz context: the buffers play sample for sample, only the device output is resampled.
      try {
        this.ctx = new AC({ sampleRate: SR, latencyHint: 'interactive' });
      } catch {
        this.ctx = new AC();
      }
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(ctx.destination);

      const raw = buildSounds();
      for (const name of Object.keys(raw)) this.sounds[name] = this.buffer([raw[name]]);

      for (let i = 0; i < POOL; i++) {
        const gain = ctx.createGain();
        const pan = ctx.createStereoPanner();
        gain.connect(pan);
        pan.connect(this.master);
        this.players.push({ gain, pan, src: null });
      }
      this.music = ctx.createGain();
      this.music.gain.value = this._musicOn ? this._musicVolume : 0;
      this.music.connect(this.master);
    } catch {
      this.enabled = false;
      return;
    }

    // The music loop takes a few hundred ms to synthesise: do it in short slices after the
    // constructor returned (Swift used a background queue) and start it as soon as it is done.
    const gen = musicSteps();
    const pump = () => {
      const t0 = performance.now();
      for (;;) {
        let r;
        try { r = gen.next(); } catch { return; }
        if (r.done) { this.startMusic(r.value); return; }
        if (performance.now() - t0 >= MUSIC_SLICE_MS) break;
      }
      nextSlice(pump);
    };
    nextSlice(pump);
  }

  get musicVolume() { return this._musicVolume; }
  set musicVolume(v) { this._musicVolume = v; this.applyMusicVolume(); }
  get musicOn() { return this._musicOn; }
  set musicOn(v) { this._musicOn = !!v; this.applyMusicVolume(); }

  /** music.volume = musicOn ? musicVolume : 0, with a few ms of smoothing so the step does not click. */
  applyMusicVolume() {
    if (!this.music) return;
    const g = this.music.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setTargetAtTime(this._musicOn ? this._musicVolume : 0, now, 0.012);
  }

  /** Call from the first user gesture: browsers keep an AudioContext suspended until then. */
  resume() {
    if (!this.enabled || !this.ctx || this.ctx.state === 'running' || this.ctx.state === 'closed') return;
    this._resumeAt = performance.now();
    const p = this.ctx.resume();
    if (p && p.catch) p.catch(() => {});
  }

  setMaster(v) {
    if (this.enabled) this.master.gain.value = v;
  }

  play(name, vol = 1, pan = 0) {
    if (!this.enabled) return;
    const buf = this.sounds[name];
    if (!buf) return;
    // On a suspended context every scheduled sound would wait and then fire at once on resume.
    // Only the sounds of the gesture that is just waking the context up may queue.
    if (this.ctx.state !== 'running' && performance.now() - this._resumeAt > RESUME_GRACE_MS) return;
    const p = this.players[this.next];
    this.next = (this.next + 1) % this.players.length;
    // .interrupts: a reused slot drops whatever it was still playing.
    if (p.src) {
      p.src.onended = null;
      try { p.src.stop(); } catch { /* already ended */ }
      p.src.disconnect();
      p.src = null;
    }
    p.gain.gain.value = vol;
    p.pan.pan.value = max(-1, min(1, pan));
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(p.gain);
    src.onended = () => {
      src.disconnect();
      if (p.src === src) p.src = null;
    };
    src.start();
    p.src = src;
  }

  /** Positional playback relative to the listener (simple distance + pan model). */
  playAt(name, pos, listener, yaw, vol = 1) {
    if (!this.enabled) return;
    const v = sub(pos, listener);
    const d = len(v);
    const att = 1 / (1 + d * d / 180);
    if (att < 0.03) return;
    const right = v3(Math.cos(yaw), 0, -Math.sin(yaw));
    const pan = d > 0.5 ? dot(mul(v, 1 / d), right) * 0.8 : 0;
    this.play(name, vol * att, pan);
  }

  /** Wraps channel data (one Float32Array per channel) into a 44.1 kHz AudioBuffer. */
  buffer(channels) {
    const b = this.ctx.createBuffer(channels.length, channels[0].length, SR);
    for (let c = 0; c < channels.length; c++) b.copyToChannel(channels[c], c);
    return b;
  }

  /** Schedules the finished loop; on a still suspended context it starts with the first gesture. */
  startMusic({ left, right }) {
    if (!this.enabled || this.musicStarted) return;
    try {
      this.musicBuffer = this.buffer([left, right]);
      const src = this.ctx.createBufferSource();
      src.buffer = this.musicBuffer;
      src.loop = true;
      src.connect(this.music);
      src.start();
      this.musicSource = src;
      this.musicStarted = true;
    } catch { /* no music is better than no game */ }
  }
}
