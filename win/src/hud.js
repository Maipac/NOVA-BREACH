// HUD overlay. Mirrors Sources/HUD.swift, but as DOM + CSS instead of a SpriteKit scene.
//
// How the SpriteKit layout carries over:
//   - SpriteKit's y grows upward and labels sit on their baseline. Every anchor here is a zero-size
//     element; children are placed with `left` / `right` / `bottom` in the Swift numbers (bottom = y),
//     so the build code reads like the original and no number had to be converted.
//   - The six anchors and the menu overlay are scaled by one CSS variable (--s), like Swift's setScale(s).
//   - SKActions ran on SpriteKit's own clock (they keep running while the game is paused and in the menu,
//     where update() is not called). They become Web Animations / CSS animations, which behave the same.
//     Everything Swift advanced with dt inside update() still advances with dt.
//   - The DOM is only touched when a value actually changed (all setters cache what they wrote last).

const cWhite = { x: 1, y: 1, z: 1 };
const cCyan = { x: 0.35, y: 0.92, z: 1.0 };
const cRed = { x: 1.0, y: 0.25, z: 0.2 };
const cOrange = { x: 1.0, y: 0.62, z: 0.15 };
const cDim = { x: 0.6, y: 0.75, z: 0.85 };
const cHealth = { x: 0.3, y: 1.0, z: 0.55 };

// font classes (hud.css): Avenir Next Condensed Heavy / DemiBold and Menlo Bold in the Swift version
const fontHeavy = 'hud-fh';
const fontDemi = 'hud-fd';
const fontMono = 'hud-fm';

/** sRGB triple {x, y, z} (0..1) -> CSS colour. Strings pass through. */
function rgba(c, a = 1) {
  if (typeof c === 'string') return c;
  const r = Math.round(Math.min(Math.max(c.x, 0), 1) * 255);
  const g = Math.round(Math.min(Math.max(c.y, 0), 1) * 255);
  const b = Math.round(Math.min(Math.max(c.z, 0), 1) * 255);
  return a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

const WHITE = '#fff';
const CYAN = rgba(cCyan);
const RED = rgba(cRed);
const ORANGE = rgba(cOrange);
const DIM = rgba(cDim);
const HEALTH = rgba(cHealth);

function div(cls, parent = null) {
  const e = document.createElement('div');
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
}

/** Zero-size positioned node – the stand-in for an SKNode that only groups children. */
function node(parent, x = 0, y = 0, cls = '') {
  const e = div(cls ? `hud-node ${cls}` : 'hud-node', parent);
  if (x !== 0) e.style.left = `${x}px`;
  if (y !== 0) e.style.bottom = `${y}px`;
  return e;
}

/** SKLabelNode: text positioned by its baseline (or vertical centre), aligned left / centre / right. */
class Label {
  constructor(text, font, size, color = WHITE, h = 'center', v = 'baseline') {
    this.el = div(`hud-lb ${font} hud-h${h[0]} hud-v${v[0]}`);
    this.el.style.fontSize = `${size}px`;
    this.h = h;
    this.v = v;
    this.text = null;
    this.color = null;
    this.anim = null;
    this.set(text);
    this.setColor(color);
  }
  /** Swift `position = CGPoint(x:, y:)` in the parent's (y-up) coordinates. */
  at(x, y) {
    const st = this.el.style;
    if (this.h === 'right') st.right = `${-x}px`; else st.left = `${x}px`;
    if (this.v === 'center') st.top = `${-y}px`; else st.bottom = `${y}px`;
    return this;
  }
  addTo(parent) { parent.appendChild(this.el); return this; }
  set(t) {
    if (t !== this.text) { this.text = t; this.el.textContent = t; }
  }
  setColor(c) {
    if (c !== this.color) { this.color = c; this.el.style.color = c; }
  }
  /** removeAllActions() */
  stop() {
    if (this.anim) { this.anim.cancel(); this.anim = null; }
  }
}

function label(text, font, size, color = WHITE, h = 'center', v = 'baseline') {
  return new Label(text, font, size, color, h, v);
}

/** Slanted status bar. */
class Bar {
  constructor(w, h, slant, color) {
    this.node = div('hud-bar');
    const st = this.node.style;
    st.width = `${w}px`;
    st.height = `${h}px`;
    // A rectangle sheared about its bottom-left corner is exactly Swift's path
    // (0,0) (w*f,0) (w*f+slant,h) (slant,h); the fill only needs a horizontal scale inside it.
    st.transform = `skewX(${(-Math.atan2(slant, h)).toFixed(5)}rad)`;
    const bg = div('hud-bar-bg', this.node);
    bg.style.borderColor = rgba(color, 0.55);
    this.fill = div('hud-bar-fill', this.node);
    this.last = -1;
    this.color = null;
    this.hidden = false;
    this.alpha = 1;
    this.setColor(rgba(color));
    this.set(1);
  }
  at(x, y) {
    this.node.style.left = `${x}px`;
    this.node.style.bottom = `${y}px`;
    return this;
  }
  set(f) {
    const v = Math.max(0, Math.min(1, f));
    if (Math.abs(v - this.last) < 0.004) return;
    this.last = v;
    this.fill.style.transform = `scaleX(${v.toFixed(4)})`;
    this.fill.style.visibility = v <= 0.001 ? 'hidden' : 'visible';
  }
  setColor(c) {
    if (c !== this.color) { this.color = c; this.fill.style.backgroundColor = c; }
  }
  /** node.isHidden */
  setHidden(hidden) {
    if (hidden !== this.hidden) { this.hidden = hidden; this.node.style.display = hidden ? 'none' : ''; }
  }
  /** node.alpha */
  setAlpha(a) {
    if (a !== this.alpha) { this.alpha = a; this.node.style.opacity = String(a); }
  }
}

/**
 * Radial edge gradient for damage / low health. Swift baked this into a 256 px texture stretched over
 * the screen: alpha = pow(min(1, sqrt(0.9 u² + 0.9 v²) / 1.25), power) with u, v in -1..1.
 * As a CSS gradient the same curve is resolution independent: alpha reaches 1 where
 * sqrt(u² + v²) = 1.25 / sqrt(0.9), i.e. at 65.88 % of the width / height from the centre.
 */
function edgeGradient(c, power) {
  const radius = (1.25 / Math.sqrt(0.9)) * 50;
  const steps = 32;
  const stops = [];
  for (let i = 0; i <= steps; i++) {
    const d = i / steps;
    stops.push(`${rgba(c, Number(Math.pow(d, power).toFixed(4)))} ${(d * 100).toFixed(2)}%`);
  }
  return `radial-gradient(ellipse ${radius.toFixed(3)}% ${radius.toFixed(3)}% at 50% 50%, ${stops.join(', ')})`;
}

/** Full-screen effect layer whose alpha is driven from update(). */
class ScreenLayer {
  constructor(cls, parent) {
    this.el = div(`hud-fx ${cls}`, parent);
    this.shown = 0;
  }
  setAlpha(a) {
    // quantised so a slowly decaying value does not write a new style every frame for nothing
    const v = a < 0.002 ? 0 : Math.round(a * 400) / 400;
    if (v === this.shown) return;
    if ((v > 0) !== (this.shown > 0)) this.el.style.visibility = v > 0 ? 'visible' : 'hidden';
    this.shown = v;
    this.el.style.opacity = String(v);
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export class HUD {
  constructor(root) {
    this.root = root;
    root.classList.add('hud-root');
    this.laidOut = { width: 0, height: 0 };
    this.s = 1;

    // anchors
    this.gameLayer = div('hud-game');
    this.center = div('hud-anchor hud-center');
    this.bl = div('hud-anchor hud-bl');
    this.br = div('hud-anchor hud-br');
    this.tl = div('hud-anchor hud-tl');
    this.tr = div('hud-anchor hud-tr');
    this.tc = div('hud-anchor hud-tc');
    this.overlay = div('hud-anchor hud-overlay');

    // crosshair
    this.crossLines = [];
    this.crossGap = -1;
    this.hitMarker = div('hud-node hud-hitmarker');
    this.hitLines = [];
    this.hitColor = null;
    this.hitAnims = [];
    this.dashBar = new Bar(70, 4, 2, cCyan);
    this.reloadLabel = label('', fontDemi, 16, CYAN);
    this.powerLabel = label('', fontHeavy, 20, rgba({ x: 0.8, y: 0.5, z: 1 }));

    // status
    this.hpBar = new Bar(300, 16, 8, cHealth);
    this.shBar = new Bar(300, 9, 5, cCyan);
    this.hpLabel = label('100', fontHeavy, 54, WHITE, 'left');
    this.shLabel = label('100', fontHeavy, 26, CYAN, 'left');
    this.ammoLabel = label('36', fontHeavy, 72, WHITE, 'right');
    this.reserveLabel = label('/ ∞', fontHeavy, 28, DIM, 'left');
    this.weaponLabel = label('PULSGEWEHR', fontDemi, 20, CYAN, 'right');
    this.slots = [];   // {box, key, name, state}
    this.waveLabel = label('WELLE 1', fontHeavy, 30, WHITE);
    this.enemiesLabel = label('', fontDemi, 17, DIM);
    this.scoreLabel = label('0', fontHeavy, 44, WHITE, 'right');
    this.comboLabel = label('', fontHeavy, 26, ORANGE, 'right');
    this.comboBar = new Bar(120, 5, 3, cOrange);
    this.bossNode = div('hud-node');
    this.bossHidden = false;
    this.bossBar = new Bar(620, 14, 8, cRed);
    this.bossLabel = label('', fontHeavy, 20, RED);

    // radar
    this.radar = div('hud-node hud-radar');
    this.blips = [];   // {el, shown, key}
    this.radarR = 78;

    // announcements (Swift calls the label `announce`; here that name is the method)
    this.announceLabel = label('', fontHeavy, 84, WHITE);
    this.announceSub = label('', fontDemi, 26, CYAN);
    this.announceScale = null;
    this.feed = [];   // {label, from, wait, dur}

    // screen effects
    this.vignette = null;
    this.lowHp = null;
    this.lowHpAlpha = 0;
    this.flashNode = null;
    this.flashAnim = null;
    this.dmgArcs = [];   // {el, shown}
    this.dmgAngles = [];
    this.dmgLife = [];
    this.vignetteAlpha = 0;
    this.time = 0;

    // menu
    this.dim = null;
    this.dimAnim = null;
    this.menuNode = div('hud-node hud-menu');
    this.menuAnim = null;

    // caches for values that are formatted every frame
    this.lastScore = null;
    this.lastCombo = null;
    this.lastWave = null;
    this.lastEnemies = null;
    this.lastOvercharge = null;
    this.lastReserve = null;
    this.lastAmmo = null;
    this.lastHp = null;
    this.lastShield = null;
    this.lastWeaponColor = null;
    this.weaponColorCss = CYAN;

    this.build();
    this.layout();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.layout());
      this.resizeObserver.observe(root);
    } else {
      window.addEventListener('resize', () => this.layout());
    }
  }

  build() {
    const root = this.root;
    // z order as in Swift: screen effects (1) < game layer (5) < dim (20) < menu overlay (30)
    this.vignette = new ScreenLayer('hud-vignette', root);
    this.vignette.el.style.backgroundImage = edgeGradient({ x: 1, y: 0.05, z: 0.02 }, 2.6);
    this.lowHp = new ScreenLayer('hud-lowhp', root);
    this.lowHp.el.style.backgroundImage = edgeGradient({ x: 0.9, y: 0.0, z: 0.0 }, 3.4);
    this.flashNode = div('hud-fx hud-flash', root);
    root.appendChild(this.gameLayer);
    for (const a of [this.center, this.bl, this.br, this.tl, this.tr, this.tc]) this.gameLayer.appendChild(a);
    this.dim = div('hud-dim', root);
    root.appendChild(this.overlay);
    this.overlay.appendChild(this.menuNode);

    // crosshair
    const { center, bl, br, tc, tr, tl } = this;
    for (let i = 0; i < 4; i++) {
      const l = div(i < 2 ? 'hud-cross hud-cross-h' : 'hud-cross hud-cross-v', center);
      this.crossLines.push(l);
    }
    div('hud-cross-dot', center);
    for (let i = 0; i < 4; i++) {
      const l = div('hud-hitline', this.hitMarker);
      const a = Math.PI / 4 + i * Math.PI / 2;
      // SpriteKit: y up, rotation counter-clockwise; CSS: y down, rotation clockwise
      l.style.transform = `translate(${(Math.cos(a) * 15).toFixed(3)}px, ${(-Math.sin(a) * 15).toFixed(3)}px) rotate(${(-a).toFixed(5)}rad)`;
      this.hitLines.push(l);
    }
    center.appendChild(this.hitMarker);
    this.dashBar.at(-35, -46);
    center.appendChild(this.dashBar.node);
    this.reloadLabel.at(0, -78).addTo(center);
    this.powerLabel.at(0, -110).addTo(center);
    {
      // arc of radius 120 from pi/2 - 0.34 to pi/2 + 0.34 (straight ahead = up), drawn left to right
      const a0 = Math.PI / 2 + 0.34, a1 = Math.PI / 2 - 0.34;
      const d = `M ${(Math.cos(a0) * 120).toFixed(3)} ${(-Math.sin(a0) * 120).toFixed(3)} `
        + `A 120 120 0 0 1 ${(Math.cos(a1) * 120).toFixed(3)} ${(-Math.sin(a1) * 120).toFixed(3)}`;
      for (let i = 0; i < 5; i++) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'hud-arc');
        svg.setAttribute('viewBox', '-140 -140 280 280');
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
        center.appendChild(svg);
        this.dmgArcs.push({ el: svg, shown: 0 });
        this.dmgAngles.push(0);
        this.dmgLife.push(0);
      }
    }

    // bottom left: health
    const hpTag = label('VITAL', fontDemi, 15, DIM, 'left').at(0, 84);
    this.hpLabel.at(0, 34);
    this.shLabel.at(112, 36);
    const shTag = label('SCHILD', fontDemi, 13, rgba(cCyan, 0.8), 'left').at(112, 62);
    this.hpBar.at(0, 10);
    this.shBar.at(5, -3);
    for (const n of [hpTag.el, this.hpLabel.el, this.shLabel.el, shTag.el, this.hpBar.node, this.shBar.node]) bl.appendChild(n);

    // bottom right: ammo + weapon slots
    this.ammoLabel.at(-84, 30).addTo(br);
    this.reserveLabel.at(-76, 34).addTo(br);
    this.weaponLabel.at(0, 100).addTo(br);
    for (let i = 0; i < 4; i++) {
      const b = node(br, -32 - (3 - i) * 70, 6);
      const box = div('hud-slot', b);
      const k = label(`${i + 1}`, fontMono, 11, DIM, 'left', 'center').at(-28, 0).addTo(b);
      const nm = label('', fontDemi, 12, WHITE, 'center', 'center').at(5, 0).addTo(b);
      this.slots.push({ box, key: k, name: nm, state: '' });
    }

    // top centre: wave / boss
    this.waveLabel.at(0, -44).addTo(tc);
    this.enemiesLabel.at(0, -66).addTo(tc);
    this.bossBar.at(-310, -118);
    this.bossLabel.at(0, -98);
    this.bossNode.appendChild(this.bossBar.node);
    this.bossNode.appendChild(this.bossLabel.el);
    this.setBossHidden(true);
    tc.appendChild(this.bossNode);

    // top right: score
    const scTag = label('PUNKTE', fontDemi, 15, DIM, 'right').at(0, -30);
    this.scoreLabel.at(0, -74);
    this.comboLabel.at(0, -106);
    this.comboBar.at(-124, -118);
    for (const n of [scTag.el, this.scoreLabel.el, this.comboLabel.el, this.comboBar.node]) tr.appendChild(n);
    for (let i = 0; i < 5; i++) {
      const f = label('', fontDemi, 16, DIM, 'right').at(0, -150 - i * 22).addTo(tr);
      f.el.style.opacity = '0';
      this.feed.push({ label: f, from: 0, wait: 0, dur: 0 });
    }

    // top left: radar
    const radarR = this.radarR;
    this.radar.style.left = `${radarR + 6}px`;
    this.radar.style.bottom = `${-(radarR + 6)}px`;
    div('hud-radar-ring', this.radar);
    div('hud-radar-ring2', this.radar);
    div('hud-radar-me', this.radar);
    for (let i = 0; i < 48; i++) {
      this.blips.push({ el: div('hud-blip', this.radar), shown: false, key: '' });
    }
    tl.appendChild(this.radar);

    // announcements: the wrapper carries position + window scale, the label inside animates
    const an = div('hud-anchor hud-announce', this.gameLayer);
    this.announceLabel.at(0, 0).addTo(an);
    const ans = div('hud-anchor hud-announce-sub', this.gameLayer);
    this.announceSub.at(0, 0).addTo(ans);
    this.announceLabel.el.style.opacity = '0';
    this.announceSub.el.style.opacity = '0';
  }

  /** Everything is placed by CSS relative to the window; only the scale factor is computed here. */
  layout(size = null) {
    const w = size ? size.width : (this.root.clientWidth || window.innerWidth);
    const h = size ? size.height : (this.root.clientHeight || window.innerHeight);
    this.laidOut = { width: w, height: h };
    const s = Math.max(0.6, Math.min(h / 900, w / 1440));
    if (s !== this.s || !this.scaleWritten) {
      this.s = s;
      this.scaleWritten = true;
      this.root.style.setProperty('--s', s.toFixed(4));
    }
  }

  /** No-op: a ResizeObserver keeps the scale in sync with the window. */
  resizeIfNeeded() {}

  // ---- per-frame state

  update(o) {
    const dt = o.dt;
    this.time += dt;
    const hp = o.hp, shield = o.shield, ammo = o.ammo;
    this.hpBar.set(hp / 100);
    this.shBar.set(shield / 100);
    const hpShown = Math.ceil(hp);
    if (hpShown !== this.lastHp) { this.lastHp = hpShown; this.hpLabel.set(String(hpShown)); }
    const shShown = Math.trunc(shield);
    if (shShown !== this.lastShield) { this.lastShield = shShown; this.shLabel.set(String(shShown)); }
    const low = hp < 35;
    this.hpLabel.setColor(low ? RED : WHITE);
    this.hpBar.setColor(low ? RED : HEALTH);
    const targetLow = low ? (0.35 + 0.25 * Math.sin(this.time * 6)) * (1 - hp / 35 * 0.6) : 0;
    this.lowHpAlpha += (targetLow - this.lowHpAlpha) * 0.2;
    this.lowHp.setAlpha(this.lowHpAlpha);

    if (ammo !== this.lastAmmo) { this.lastAmmo = ammo; this.ammoLabel.set(`${ammo}`); }
    this.ammoLabel.setColor(ammo === 0 ? RED : WHITE);
    if (o.reserve !== this.lastReserve) {
      this.lastReserve = o.reserve;
      this.reserveLabel.set(o.reserve < 0 ? '/ ∞' : `/ ${o.reserve}`);
    }
    this.weaponLabel.set(o.weaponName);
    const wc = this.color(o.weaponColor);
    this.weaponLabel.setColor(wc);
    const names = o.weaponNames, usable = o.weaponUsable;
    for (let i = 0; i < this.slots.length && i < names.length; i++) {
      const sl = this.slots[i];
      const active = i === o.weaponIndex;
      const state = `${names[i]}|${active ? wc : ''}|${usable[i] ? 1 : 0}`;
      if (state === sl.state) continue;
      sl.state = state;
      sl.name.set(names[i]);
      sl.box.style.backgroundColor = active ? rgba(o.weaponColor, 0.3) : 'rgba(0, 0, 0, 0.4)';
      sl.box.style.borderColor = active ? wc : rgba(cDim, 0.35);
      sl.name.setColor(usable[i] ? WHITE : 'rgba(255, 255, 255, 0.35)');
    }

    // crosshair spread
    const gap = Math.round((7 + o.spread * 520) * 10) / 10;
    if (gap !== this.crossGap) {
      this.crossGap = gap;
      const g = gap + 4;
      this.crossLines[0].style.transform = `translate(${g}px, 0px)`;
      this.crossLines[1].style.transform = `translate(${-g}px, 0px)`;
      this.crossLines[2].style.transform = `translate(0px, ${-g}px)`;
      this.crossLines[3].style.transform = `translate(0px, ${g}px)`;
    }
    this.dashBar.set(o.dash);
    this.dashBar.setAlpha(o.dash >= 1 ? 0.35 : 1);
    this.reloadLabel.set(o.reloading > 0 ? 'LADE NACH…' : (ammo === 0 ? 'LEER – [R]' : ''));
    const oc = o.overcharge > 0 ? Math.ceil(o.overcharge) : 0;
    if (oc !== this.lastOvercharge) {
      this.lastOvercharge = oc;
      this.powerLabel.set(oc > 0 ? `ÜBERLADUNG  ${oc}s` : '');
    }

    if (o.score !== this.lastScore) { this.lastScore = o.score; this.scoreLabel.set(this.formatScore(o.score)); }
    if (o.combo > 1) {
      if (o.combo !== this.lastCombo) { this.lastCombo = o.combo; this.comboLabel.set(`KOMBO ×${o.combo}`); }
      this.comboBar.setHidden(false);
      this.comboBar.set(o.comboT);
    } else {
      if (this.lastCombo !== 0) { this.lastCombo = 0; this.comboLabel.set(''); }
      this.comboBar.setHidden(true);
    }
    if (o.wave !== this.lastWave) { this.lastWave = o.wave; this.waveLabel.set(`WELLE ${o.wave}`); }
    if (o.enemiesLeft !== this.lastEnemies) {
      this.lastEnemies = o.enemiesLeft;
      this.enemiesLabel.set(o.enemiesLeft > 0 ? `GEGNER  ${o.enemiesLeft}` : '');
    }
    if (o.bossName != null) {
      this.setBossHidden(false);
      this.bossLabel.set(o.bossName);
      this.bossBar.set(o.bossHp);
    } else {
      this.setBossHidden(true);
    }

    this.vignetteAlpha = Math.max(0, this.vignetteAlpha - dt * 1.4);
    this.vignette.setAlpha(this.vignetteAlpha);
    for (let i = 0; i < this.dmgArcs.length; i++) {
      if (!(this.dmgLife[i] > 0)) continue;
      this.dmgLife[i] -= dt;
      this.setArcAlpha(i, Math.max(0, Math.min(1, this.dmgLife[i] * 1.6)));
    }
  }

  /** Swift's color(V3) -> NSColor; cached because the weapon colour only changes on a weapon switch. */
  color(c) {
    const last = this.lastWeaponColor;
    if (!last || last.x !== c.x || last.y !== c.y || last.z !== c.z) {
      this.lastWeaponColor = { x: c.x, y: c.y, z: c.z };
      this.weaponColorCss = rgba(c);
    }
    return this.weaponColorCss;
  }

  setBossHidden(hidden) {
    if (hidden !== this.bossHidden) {
      this.bossHidden = hidden;
      this.bossNode.style.display = hidden ? 'none' : '';
    }
  }

  setArcAlpha(i, a) {
    const arc = this.dmgArcs[i];
    const v = Math.round(a * 200) / 200;
    if (v === arc.shown) return;
    if ((v > 0) !== (arc.shown > 0)) arc.el.style.visibility = v > 0 ? 'visible' : 'hidden';
    arc.shown = v;
    arc.el.style.opacity = String(v);
  }

  /** Decimal style with "." as the grouping separator (5100 -> "5.100"). */
  formatScore(v) {
    const n = Math.trunc(Number(v) || 0);
    const digits = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return n < 0 ? `-${digits}` : digits;
  }

  /** pts: [{p: {x, y}, boss}] – relative position rotated into view space (+y = forward). */
  setRadar(pts, range) {
    const reach = this.radarR - 5;
    for (let i = 0; i < this.blips.length; i++) {
      const b = this.blips[i];
      if (i < pts.length) {
        let px = pts[i].p.x / range, py = pts[i].p.y / range;
        const l = Math.hypot(px, py);
        if (l > 1) { px /= l; py /= l; }
        const scale = pts[i].boss ? 2.0 : (l > 1 ? 0.7 : 1);
        const key = `translate(${(px * reach).toFixed(1)}px, ${(-py * reach).toFixed(1)}px) scale(${scale})|${l > 1 ? 0.55 : 1}`;
        if (key !== b.key) {
          b.key = key;
          const cut = key.lastIndexOf('|');
          b.el.style.transform = key.slice(0, cut);
          b.el.style.opacity = key.slice(cut + 1);
        }
        if (!b.shown) { b.shown = true; b.el.style.display = 'block'; }
      } else if (b.shown) {
        b.shown = false;
        b.el.style.display = 'none';
      }
    }
  }

  // ---- events

  hit(kill, crit) {
    for (const a of this.hitAnims) a.cancel();
    const c = kill ? RED : (crit ? ORANGE : WHITE);
    if (c !== this.hitColor) { this.hitColor = c; this.hitMarker.style.color = c; }
    // base style is alpha 0 / scale 1, so both animations simply run out into the resting state
    this.hitAnims = [this.hitMarker.animate([{ opacity: 1 }, { opacity: 0 }], { duration: kill ? 400 : 180 })];
    if (kill) this.hitAnims.push(this.hitMarker.animate([{ scale: '1.5' }, { scale: '1' }], { duration: 150 }));
  }

  /** angle: direction of the attacker relative to where the player looks (0 = front, + = right) */
  damage(amount, angle) {
    this.vignetteAlpha = Math.min(0.9, this.vignetteAlpha + (0.25 + amount / 40));
    if (angle != null) {
      let idx = 0;
      for (let i = 0; i < this.dmgLife.length; i++) if (this.dmgLife[i] < this.dmgLife[idx]) idx = i;
      this.dmgLife[idx] = 1.1;
      this.dmgAngles[idx] = angle;
      // Swift: zRotation = -angle (counter-clockwise positive); CSS rotates clockwise
      this.dmgArcs[idx].el.style.transform = `rotate(${angle.toFixed(4)}rad)`;
    }
  }

  flash(c, alpha, dur) {
    if (this.flashAnim) { this.flashAnim.cancel(); this.flashAnim = null; }
    const el = this.flashNode;
    el.style.backgroundColor = rgba(c);
    if (!(dur > 0) || !(alpha > 0)) { el.style.visibility = 'hidden'; return; }
    el.style.visibility = 'visible';
    const a = el.animate([{ opacity: alpha }, { opacity: 0 }], { duration: dur * 1000 });
    a.onfinish = () => {
      if (this.flashAnim === a) { this.flashAnim = null; el.style.visibility = 'hidden'; }
    };
    this.flashAnim = a;
  }

  announce(text, sub = '', c = cWhite, hold = 1.6) {
    const total = 0.15 + hold + 0.5;
    const frames = [
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.15 / total },
      { opacity: 1, offset: (0.15 + hold) / total },
      { opacity: 0, offset: 1 },
    ];
    for (const [l, t] of [[this.announceLabel, text], [this.announceSub, sub]]) {
      l.stop();
      l.set(t);
      l.anim = l.el.animate(frames, { duration: total * 1000 });
    }
    this.announceLabel.setColor(rgba(c));
    // xScale s * 1.25 -> s; the window scale s lives on the wrapper
    if (this.announceScale) this.announceScale.cancel();
    this.announceScale = this.announceLabel.el.animate([{ scale: '1.25 1' }, { scale: '1 1' }], { duration: 250 });
  }

  /** Current alpha of a feed line (Swift reads SKNode.alpha while its fade action is running). */
  feedAlpha(f) {
    const anim = f.label.anim;
    if (!anim || anim.currentTime == null) return 0;
    const t = Number(anim.currentTime) / 1000;
    if (t <= f.wait) return f.from;
    if (f.dur <= 0 || t >= f.wait + f.dur) return 0;
    return f.from * (1 - (t - f.wait) / f.dur);
  }

  /** alpha = from, then wait, then fade out over dur seconds. */
  feedFade(f, from, wait, dur) {
    f.label.stop();
    f.from = from; f.wait = wait; f.dur = dur;
    const total = wait + dur;
    if (!(from > 0) || !(total > 0)) return;
    const frames = wait > 0
      ? [{ opacity: from, offset: 0 }, { opacity: from, offset: wait / total }, { opacity: 0, offset: 1 }]
      : [{ opacity: from }, { opacity: 0 }];
    f.label.anim = f.label.el.animate(frames, { duration: total * 1000 });
  }

  feedLine(text, c = null) {
    const feed = this.feed;
    for (let i = feed.length - 1; i > 0; i--) {
      const src = feed[i - 1];
      const a = this.feedAlpha(src);
      feed[i].label.set(src.label.text);
      feed[i].label.setColor(src.label.color);
      this.feedFade(feed[i], a, 0, a * 1.8);
    }
    feed[0].label.set(text);
    feed[0].label.setColor(c ? rgba(c) : DIM);
    this.feedFade(feed[0], 1, 1.6, 0.8);
  }

  // ---- menus

  clearMenu() {
    this.menuNode.replaceChildren();
    if (this.menuAnim) { this.menuAnim.cancel(); this.menuAnim = null; }
  }

  setDim(a) {
    if (this.dimAnim) { this.dimAnim.cancel(); this.dimAnim = null; }
    this.dim.style.opacity = String(a);
    this.dim.style.visibility = a > 0 ? 'visible' : 'hidden';
  }

  setGameLayerAlpha(a) {
    this.gameLayer.classList.toggle('hud-off', a <= 0);
  }

  title(text, y, size, c = WHITE) {
    const ghost = label(text, fontHeavy, size, rgba(cCyan, 0.55)).at(4, y - 3);
    const ghost2 = label(text, fontHeavy, size, rgba({ x: 1, y: 0.2, z: 0.6 }, 0.5)).at(-4, y + 2);
    const main = label(text, fontHeavy, size, c).at(0, y);
    this.menuNode.append(ghost2.el, ghost.el, main.el);
  }

  prompt(text, y) {
    const p = label(text, fontHeavy, 28, CYAN).at(0, y);
    p.el.classList.add('hud-blink');   // alpha 1 -> 0.35 -> 1, 0.7 s each way, forever
    this.menuNode.appendChild(p.el);
  }

  controls(y) {
    const rows = [
      ['W A S D', 'Bewegen'], ['MAUS', 'Zielen'], ['LINKSKLICK', 'Feuern'], ['LEERTASTE', 'Springen'],
      ['SHIFT', 'Sprinten'], ['Q', 'Dash'], ['R', 'Nachladen'], ['1 – 4 / RAD', 'Waffe wechseln'],
      ['ESC', 'Pause'], ['F', 'Vollbild'], ['M', 'Musik an/aus'],
    ];
    rows.forEach((r, i) => {
      const col = i < 6 ? 0 : 1;
      const row = i < 6 ? i : i - 6;
      const x = col === 0 ? -270 : 50;
      const k = label(r[0], fontHeavy, 17, CYAN, 'left').at(x, y - row * 26);
      const d = label(r[1], fontDemi, 17, 'rgba(255, 255, 255, 0.85)', 'left').at(x + (col === 0 ? 130 : 120), y - row * 26);
      this.menuNode.append(k.el, d.el);
    });
  }

  showMenu(best, bestWave) {
    this.clearMenu();
    this.setDim(0.45);
    this.setGameLayerAlpha(0);
    this.title('NOVA BREACH', 190, 150);
    label('A R E N A - P R O T O K O L L   //   S T A T I O N   H E L I X - 9', fontDemi, 22, CYAN).at(0, 150).addTo(this.menuNode);
    const line = div('hud-menu-line', this.menuNode);   // 760 x 2 rule centred on (0, 132)
    line.style.left = '-380px';
    line.style.bottom = '131px';
    this.prompt('KLICKEN ODER ENTER ZUM STARTEN', 60);
    this.controls(-20);
    if (best > 0) {
      label(`BESTLEISTUNG   ${this.formatScore(best)} PUNKTE   ·   WELLE ${bestWave}`, fontHeavy, 22, ORANGE).at(0, -230).addTo(this.menuNode);
    }
    label('Überlebe so viele Wellen wie möglich. Alle 5 Wellen wartet ein Boss.', fontDemi, 17, 'rgba(255, 255, 255, 0.6)').at(0, -270).addTo(this.menuNode);
  }

  showPause() {
    this.clearMenu();
    this.setDim(0.6);
    this.title('PAUSE', 120, 120);
    this.prompt('KLICKEN ODER ESC ZUM FORTSETZEN', 40);
    this.controls(-30);
    // Windows port: was "⌘Q  –  Spiel beenden"
    label('ALT+F4  –  Spiel beenden', fontDemi, 17, 'rgba(255, 255, 255, 0.6)').at(0, -230).addTo(this.menuNode);
  }

  /** st: {score, wave, kills, accuracy, best, newBest, time} */
  showGameOver(st) {
    this.clearMenu();
    this.setGameLayerAlpha(0);
    this.setDim(0.62);
    this.dimAnim = this.dim.animate([{ opacity: 0 }, { opacity: 0.62 }], { duration: 800 });
    this.title('SYSTEMAUSFALL', 170, 120, RED);
    const time = Math.trunc(st.time);
    const rows = [
      ['PUNKTE', this.formatScore(st.score)], ['ERREICHTE WELLE', `${st.wave}`], ['ABSCHÜSSE', `${st.kills}`],
      ['TREFFERQUOTE', `${st.accuracy} %`], ['ÜBERLEBT', `${Math.trunc(time / 60)}:${String(time % 60).padStart(2, '0')}`],
    ];
    rows.forEach((r, i) => {
      const k = label(r[0], fontDemi, 22, DIM, 'right').at(-20, 80 - i * 36);
      const v = label(r[1], fontHeavy, 28, WHITE, 'left').at(20, 78 - i * 36);
      this.menuNode.append(k.el, v.el);
    });
    label(st.newBest ? 'NEUER REKORD!' : `REKORD   ${this.formatScore(st.best)}`, fontHeavy, 26, ORANGE).at(0, -120).addTo(this.menuNode);
    this.prompt('KLICKEN ODER ENTER FÜR NEUEN VERSUCH', -190);
    // alpha 0, wait 0.5 s, fade in over 0.5 s
    this.menuNode.style.opacity = '1';
    this.menuAnim = this.menuNode.animate(
      [{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1, offset: 1 }], { duration: 1000 });
  }

  showGame() {
    this.clearMenu();
    this.menuNode.style.opacity = '1';
    this.setDim(0);
    this.setGameLayerAlpha(1);
  }

  resetTransient() {
    this.vignetteAlpha = 0;
    this.vignette.setAlpha(0);
    this.lowHpAlpha = 0;
    this.lowHp.setAlpha(0);
    for (let i = 0; i < this.dmgArcs.length; i++) { this.dmgLife[i] = 0; this.setArcAlpha(i, 0); }
    for (const f of this.feed) { f.label.stop(); f.from = 0; f.wait = 0; f.dur = 0; }
    this.announceLabel.stop();
    this.announceSub.stop();
  }
}
