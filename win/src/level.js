// The arena: geometry, lights, sky, floor mirror, collision and navigation. Mirrors Sources/Level.swift.
//
// Every builder uses the same positions and sizes as the Swift version. Static meshes are merged per
// material at the end of construction (mergeStatic): ~400 boxes become a few dozen draw calls, which
// matters on integrated GPUs because the floor mirror renders the scene a second time.

import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Tex } from './textures.js';
import { createSky } from './sky.js';
import { LUMEN_TO_CANDELA } from './effects.js';
import { v3, add, mul, clampf, hashI } from './math.js';
import { Geo, Mat, col, setPos, lightBothLayers } from './gfx.js';

// SceneKit's euler composition (Rz * Ry * Rx) – used for every node whose Swift code set eulerAngles
const SCN_EULER = 'ZYX';

// ---------------------------------------------------------------------------------------------
// Navigation: flow field over a 1 m grid (BFS from the player every few frames)

export class Nav {
  static n = 64;
  static origin = -32;

  constructor(obstacles) {
    const n = Nav.n;
    this.height = new Float32Array(n * n);
    this.blocked = new Uint8Array(n * n);
    this.dist = new Int32Array(n * n).fill(0x7fffffff);
    this.queue = new Int32Array(n * n);
    for (let cz = 0; cz < n; cz++) {
      for (let cx = 0; cx < n; cx++) {
        const x = Nav.origin + cx + 0.5, z = Nav.origin + cz + 0.5;
        let h = 0, b = false;
        for (const o of obstacles) {
          if (!(o.y0 < 1.8)) continue;
          const tall = o.y1 > 2.0;
          const m = tall ? 0.45 : 0.0;
          if (x > o.minX - m && x < o.maxX + m && z > o.minZ - m && z < o.maxZ + m) {
            if (tall) b = true; else h = Math.max(h, o.y1);
          }
        }
        this.height[cz * n + cx] = h;
        this.blocked[cz * n + cx] = b ? 1 : 0;
      }
    }
  }

  cell(x, z) {
    const n = Nav.n;
    return [Math.min(Math.max(Math.floor(x - Nav.origin), 0), n - 1), Math.min(Math.max(Math.floor(z - Nav.origin), 0), n - 1)];
  }

  passable(a, b) {
    return !this.blocked[b] && Math.abs(this.height[a] - this.height[b]) <= 0.85;
  }

  rebuild(target) {
    const n = Nav.n, INF = 0x7fffffff;
    const dist = this.dist, queue = this.queue, blocked = this.blocked, height = this.height;
    dist.fill(INF);
    let head = 0, tail = 0;
    const [pcx, pcz] = this.cell(target.x, target.z);
    const seed = (radius, strictHeight) => {
      for (let dz = -radius; dz <= radius; dz++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const cx = pcx + dx, cz = pcz + dz;
          if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
          const i = cz * n + cx;
          if (blocked[i] || dist[i] !== INF) continue;
          if (strictHeight && Math.abs(height[i] - target.y) > 0.7) continue;
          dist[i] = Math.abs(dx) + Math.abs(dz); queue[tail++] = i;
        }
      }
    };
    seed(0, true);
    if (tail === 0) seed(1, true);
    if (tail === 0) seed(2, false);
    if (tail === 0) seed(4, false);
    while (head < tail) {
      const i = queue[head++];
      const cx = i % n, cz = (i / n) | 0;
      const d = dist[i] + 1;
      for (let k = 0; k < 4; k++) {
        const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : 0), nz = cz + (k === 2 ? 1 : k === 3 ? -1 : 0);
        if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
        const j = nz * n + nx;
        if (dist[j] !== INF || !this.passable(i, j)) continue;
        dist[j] = d; queue[tail++] = j;
      }
    }
  }

  /** Unit XZ direction {x, y} (y = z component) an agent at pos should walk to reach the target. */
  direction(pos, target) {
    const n = Nav.n, INF = 0x7fffffff;
    const dist = this.dist, height = this.height, blocked = this.blocked;
    const [cx, cz] = this.cell(pos.x, pos.z);
    const i = cz * n + cx;
    let best = Infinity;
    let bx = target.x - pos.x, by = target.z - pos.z;
    const here = dist[i];
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dz === 0) continue;
        const nx = cx + dx, nz = cz + dz;
        if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
        const j = nz * n + nx;
        if (dist[j] === INF) continue;
        if (dx !== 0 && dz !== 0) {
          // no corner cutting
          const a = cz * n + nx, b = nz * n + cx;
          if (dist[a] === INF || dist[b] === INF) continue;
          if (Math.abs(height[a] - height[i]) > 0.85 || Math.abs(height[b] - height[i]) > 0.85) continue;
        }
        if (here !== INF && !blocked[i] && Math.abs(height[j] - height[i]) > 0.85) continue;
        const wx = Nav.origin + nx + 0.5, wz = Nav.origin + nz + 0.5;
        const score = dist[j] + 0.02 * Math.hypot(target.x - wx, target.z - wz);
        if (score < best) { best = score; bx = wx - pos.x; by = wz - pos.z; }
      }
    }
    const l = Math.hypot(bx, by);
    return l > 1e-4 ? { x: bx / l, y: by / l } : { x: 0, y: 0 };
  }
}

// ---------------------------------------------------------------------------------------------
// shaders (Swift: SceneKit shader modifiers with scn_frame.time)

const PORTAL_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const PORTAL_FRAG = /* glsl */`
  uniform sampler2D uHex;
  uniform float uTime;
  uniform float uBoost;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec2 c = uv - vec2(0.5);
    float r = length(c);
    float a = atan(c.y, c.x);
    float swirl = sin(a * 3.0 + r * 18.0 - t * 3.0) * 0.5 + 0.5;
    float wave = sin(r * 30.0 - t * 5.0) * 0.5 + 0.5;
    float hexv = texture2D(uHex, uv).r;
    vec3 hot = vec3(1.0, 0.25, 0.08);
    vec3 colr = hot * (0.15 + 0.9 * swirl * (1.0 - r) + hexv * (0.6 + 1.0 * wave));
    colr *= (1.0 + uBoost * 3.0);
    gl_FragColor = vec4(colr, 1.0);
  }
`;
const COLUMN_FRAG = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float f1 = sin(uv.y * 26.0 - t * 7.0 + sin(uv.x * 12.566 + t) * 2.0) * 0.5 + 0.5;
    float f2 = sin(uv.y * 70.0 - t * 13.0 + uv.x * 25.13) * 0.5 + 0.5;
    float pulse = 0.85 + 0.15 * sin(t * 2.3);
    vec3 base = vec3(0.10, 0.55, 0.95);
    vec3 hot = vec3(0.75, 1.0, 1.0);
    vec3 colr = mix(base, hot, f1 * f1 * 0.7) * (0.55 + 0.75 * f1 + 0.3 * f2) * pulse;
    gl_FragColor = vec4(colr, 1.0);
  }
`;

// floor mirror: SCNFloor reflectivity 0.28 = lerp(floor, mirror, 0.28)
const MIRROR_SHADER = {
  name: 'FloorMirror',
  uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, uStrength: { value: 0.16 } },
  vertexShader: /* glsl */`
    uniform mat4 textureMatrix;
    varying vec4 vUv;
    void main() {
      vUv = textureMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uStrength;
    varying vec4 vUv;
    void main() {
      vec3 refl = texture2DProj(tDiffuse, vUv).rgb;
      gl_FragColor = vec4(refl, uStrength);
    }
  `,
};

// ---------------------------------------------------------------------------------------------

export class Level {
  static half = 32;
  static wallH = 8;
  static cyan = v3(0.25, 0.9, 1.0);
  static magenta = v3(1.0, 0.2, 0.6);
  static orange = v3(1.0, 0.5, 0.12);
  static red = v3(1.0, 0.16, 0.10);

  constructor(scene, particles, renderer) {
    this.scene = scene;
    this.particles = particles;
    this.renderer = renderer;
    this.root = new THREE.Group();
    this.root.name = 'level';
    scene.add(this.root);
    this.obstacles = [];
    this.gates = [];
    this.pickupSpots = [];
    this.portalMats = [];
    this.spinners = [];   // {node, rate}
    this.beacons = [];    // {sprite, period}
    this.timeUniforms = [];
    this.glowMats = new Map();
    this.poolMats = new Map();
    this.sunLight = null;
    this.coreLight = null;
    this.sky = null;

    this.buildSkyAndLights(scene);
    this.buildFloor();
    this.buildWalls();
    this.buildCore();
    this.buildPillarsAndBeams();
    this.buildPlatforms();
    this.buildCover();
    this.buildGenerators();
    this.buildSkyline();
    this.buildFloorStrips();
    this.buildAtmosphere();
    this.mergeStatic();
    this.nav = new Nav(this.obstacles);
    this.pickupSpots.push(v3(20, 1.6, -20), v3(-20, 1.6, 20), v3(0, 0, 18), v3(0, 0, -18), v3(18, 0, 0), v3(-18, 0, 0),
      v3(-12, 0, -24), v3(12, 0, 24), v3(26, 0, -6), v3(-26, 0, 6));
  }

  // ---- building blocks

  /** marks a direct child of root as mergeable static geometry */
  static_(m) { m.userData.static = true; return m; }

  /** Textured box standing on y0. `tile` = metres per texture repeat. */
  box(cx, cz, w, d, y0, y1, set, tile, { tileV = null, collide = true, chamfer = 0, emission = 2.2 } = {}) {
    const h = y1 - y0;
    const g = Geo.tiledBox(w, h, d, tile, tileV ?? tile, chamfer);
    const m = new THREE.Mesh(g, Mat.pbr(set, emission));
    m.position.set(cx, y0 + h / 2, cz);
    m.castShadow = true;
    m.receiveShadow = true;
    this.root.add(this.static_(m));
    if (collide) this.obstacles.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2, y0, y1 });
    return m;
  }

  glowMat(c, intensity) {
    const key = `${c.x},${c.y},${c.z},${intensity}`;
    let m = this.glowMats.get(key);
    if (!m) { m = Mat.glow(c, intensity); this.glowMats.set(key, m); }
    return m;
  }

  glowBox(cx, cy, cz, w, h, d, c, intensity = 3) {
    return this.static_(Geo.part(this.root, Geo.box(w, h, d), this.glowMat(c, intensity), v3(cx, cy, cz), { shadow: false }));
  }

  /** Static mesh part directly under root (merged later). */
  part(geo, mat, pos, opts = {}) {
    const m = Geo.part(this.root, geo, mat, pos, opts);
    m.rotation.order = SCN_EULER;
    if (opts.rot) m.rotation.set(opts.rot.x, opts.rot.y, opts.rot.z);
    m.receiveShadow = m.castShadow;
    return this.static_(m);
  }

  /** Additive light pool painted on the floor (fake bounce light). */
  pool(x, z, size, c, intensity, y = 0.03) {
    const key = `${c.x},${c.y},${c.z},${intensity}`;
    let mat = this.poolMats.get(key);
    if (!mat) {
      mat = Mat.additive(Tex.glow, c, intensity);
      mat.polygonOffset = true; mat.polygonOffsetFactor = -1; mat.polygonOffsetUnits = -1;
      this.poolMats.set(key, mat);
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
    m.rotation.set(-Math.PI / 2, 0, 0);
    m.position.set(x, y, z);
    m.castShadow = false;
    m.renderOrder = 10;
    this.root.add(this.static_(m));
  }

  sprite(size, c, intensity, pos, parent = this.root) {
    const s = Geo.glowSprite(size, c, intensity);
    setPos(s, pos);
    parent.add(s);
    return s;
  }

  /** Point light (Swift omni with quadratic falloff up to `range`). */
  omni(c, intensity, pos, range) {
    const l = new THREE.PointLight(col(c).getHex(), intensity * LUMEN_TO_CANDELA, range, 2);
    l.color = col(c);
    lightBothLayers(l);
    setPos(l, pos);
    this.root.add(l);
    return l;
  }

  // ---- sections

  buildSkyAndLights(scene) {
    this.sky = createSky(this.renderer, scene);
    scene.fog = new THREE.Fog(col(v3(0.03, 0.06, 0.10)).getHex(), 28, 150);
    scene.fog.color = col(v3(0.03, 0.06, 0.10));

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.color = col(v3(1.0, 0.92, 0.80));
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    const sc = sun.shadow.camera;
    sc.left = -48; sc.right = 48; sc.top = 48; sc.bottom = -48; sc.near = 5; sc.far = 140;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.035;
    sun.shadow.radius = 3;
    setPos(sun, mul(Tex.sunDir, 60));
    sun.target.position.set(0, 0, 0);
    lightBothLayers(sun);
    this.root.add(sun);
    this.root.add(sun.target);
    this.sunLight = sun;

    this.coreLight = this.omni(Level.cyan, 3000, v3(0, 3.0, 0), 28);
    this.omni(Level.magenta, 4500, v3(-18.5, 3.2, -18.5), 22);
    this.omni(Level.orange, 4500, v3(18.5, 3.2, 18.5), 22);
  }

  buildFloor() {
    const set = Tex.floor;
    const reps = 600 / 4;   // 4 m tiles (Swift contentsTransform 0.25)
    for (const t of [set.map, set.ormMap]) { t.repeat.set(reps, reps); t.anisotropy = 16; t.needsUpdate = true; }
    // no normal map: SCNFloor used it to warp the mirror image, which looked like melting
    const m = new THREE.MeshStandardMaterial({ map: set.map, roughnessMap: set.ormMap, metalnessMap: set.ormMap, roughness: 1, metalness: 1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), m);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'floor';
    this.root.add(floor);

    const mirror = new Reflector(new THREE.PlaneGeometry(600, 600), {
      textureWidth: 1280, textureHeight: 720, clipBias: 0.003, multisample: 0, shader: MIRROR_SHADER,
    });
    mirror.material.transparent = true;
    mirror.material.depthWrite = false;
    mirror.material.blending = THREE.NormalBlending;
    mirror.material.polygonOffset = true;
    mirror.material.polygonOffsetFactor = -1;
    mirror.material.polygonOffsetUnits = -1;
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = 0.001;
    mirror.renderOrder = 1;
    mirror.name = 'floorMirror';
    this.root.add(mirror);
    this.mirror = mirror;
  }

  buildWalls() {
    const H = Level.half, t = 2, h = Level.wallH;
    const w = Tex.wallCyan;
    this.box(0, -(H + t / 2), 2 * H + 2 * t, t, 0, h, w, 4);
    this.box(0, (H + t / 2), 2 * H + 2 * t, t, 0, h, w, 4);
    this.box(-(H + t / 2), 0, t, 2 * H, 0, h, w, 4);
    this.box((H + t / 2), 0, t, 2 * H, 0, h, w, 4);
    // caps + neon crown
    const cap = Tex.pillar;
    this.box(0, -(H + 0.6), 2 * H + 4, 3.2, h, h + 0.7, cap, 4, { collide: false, emission: 0 });
    this.box(0, (H + 0.6), 2 * H + 4, 3.2, h, h + 0.7, cap, 4, { collide: false, emission: 0 });
    this.box(-(H + 0.6), 0, 3.2, 2 * H, h, h + 0.7, cap, 4, { collide: false, emission: 0 });
    this.box((H + 0.6), 0, 3.2, 2 * H, h, h + 0.7, cap, 4, { collide: false, emission: 0 });
    const ny = h - 0.12;
    this.glowBox(0, ny, -(H - 0.9), 2 * H, 0.1, 0.1, Level.magenta, 4);
    this.glowBox(0, ny, (H - 0.9), 2 * H, 0.1, 0.1, Level.magenta, 4);
    this.glowBox(-(H - 0.9), ny, 0, 0.1, 0.1, 2 * H, Level.magenta, 4);
    this.glowBox((H - 0.9), ny, 0, 0.1, 0.1, 2 * H, Level.magenta, 4);

    // spawn gates in the middle of every wall
    const dirs = [[v3(0, 0, 1), 0], [v3(0, 0, -1), Math.PI], [v3(1, 0, 0), Math.PI / 2], [v3(-1, 0, 0), -Math.PI / 2]];
    for (const [dir, yaw] of dirs) {
      const c = mul(dir, -H);            // wall centre point
      const side = v3(dir.z, 0, -dir.x);
      const alongX = Math.abs(side.x) > 0.5;
      for (const s of [-1, 1]) {
        const p = add(add(c, mul(side, s * 3.1)), mul(dir, 0.7));
        this.box(p.x, p.z, 1.3, 1.3, 0, 6.2, Tex.pillar, 1.3, { tileV: 4, chamfer: 0.06 });
        const gp = add(p, mul(dir, 0.68));
        this.glowBox(gp.x, 3.0, gp.z, alongX ? 0.12 : 0.05, 5.4, alongX ? 0.05 : 0.12, Level.red, 5);
      }
      const lp = add(c, mul(dir, 0.7));
      this.box(lp.x, lp.z, alongX ? 7.5 : 1.5, alongX ? 1.5 : 7.5, 5.4, 6.6, Tex.pillar, 1.5, { tileV: 4, collide: false, chamfer: 0.06 });
      // portal surface
      const pm = new THREE.ShaderMaterial({
        uniforms: { uHex: { value: Tex.hex }, uTime: { value: 0 }, uBoost: { value: 0 } },
        vertexShader: PORTAL_VERT,
        fragmentShader: PORTAL_FRAG,
        side: THREE.DoubleSide,
      });
      this.portalMats.push(pm);
      this.timeUniforms.push(pm.uniforms.uTime);
      const pn = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 5.4), pm);
      setPos(pn, add(add(c, mul(dir, 0.12)), v3(0, 2.7, 0)));
      pn.rotation.set(0, yaw, 0);
      this.root.add(pn);
      this.sprite(11, Level.red, 0.55, add(add(c, mul(dir, 0.8)), v3(0, 2.7, 0)));
      const fp = add(c, mul(dir, 4.5));
      this.pool(fp.x, fp.z, 15, Level.red, 0.5);
      this.gates.push({ pos: add(c, mul(dir, 3.2)), dir });
    }
  }

  buildCore() {
    this.box(0, 0, 6.4, 6.4, 0, 0.4, Tex.tech, 3.2, { chamfer: 0.05 });
    this.obstacles.push({ minX: -1.9, maxX: 1.9, minZ: -1.9, maxZ: 1.9, y0: 0.4, y1: 9 });
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        this.box(sx * 1.55, sz * 1.55, 0.55, 0.55, 0.4, 8.2, Tex.pillar, 0.55, { tileV: 4, collide: false, chamfer: 0.04 });
      }
    }
    this.box(0, 0, 4.4, 4.4, 8.2, 9.0, Tex.tech, 2.2, { collide: false, chamfer: 0.08 });
    this.box(0, 0, 3.4, 3.4, 0.4, 1.0, Tex.tech, 1.7, { collide: false, chamfer: 0.08 });

    // energy column
    const cm = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: PORTAL_VERT, fragmentShader: COLUMN_FRAG });
    this.timeUniforms.push(cm.uniforms.uTime);
    const cn = new THREE.Mesh(Geo.cyl(0.85, 7.3, 32), cm);
    cn.position.set(0, 4.6, 0);
    this.root.add(cn);

    const ringMat = Mat.metal(v3(0.5, 0.55, 0.6), { rough: 0.25 });
    [2.3, 4.6, 6.9].forEach((y, i) => {
      const holder = new THREE.Group();
      holder.rotation.order = SCN_EULER;
      holder.position.set(0, y, 0);
      this.root.add(holder);
      Geo.part(holder, Geo.torus(2.55, 0.09), ringMat, v3(0, 0, 0));
      Geo.part(holder, Geo.torus(2.55, 0.035), this.glowMat(Level.cyan, 4), v3(0, 0.1, 0), { shadow: false });
      holder.rotation.set(i === 1 ? 0.25 : 0.12, 0, i === 2 ? 0.2 : -0.1);
      const dur = 9.0 + i * 3.5;
      this.spinners.push({ node: holder, rate: (i % 2 === 0 ? 2 : -2) * Math.PI / dur });
    });
    this.sprite(11, Level.cyan, 0.28, v3(0, 4.6, 0));
    this.pool(0, 0, 26, Level.cyan, 0.28);
  }

  buildPillarsAndBeams() {
    const p = 14;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        this.box(sx * p, sz * p, 2.4, 2.4, 0, 10, Tex.pillar, 2.4, { tileV: 4, chamfer: 0.12 });
        this.box(sx * p, sz * p, 3.2, 3.2, 0, 0.5, Tex.tech, 1.6, { collide: false, chamfer: 0.08 });
        this.box(sx * p, sz * p, 3.3, 3.3, 10, 10.6, Tex.tech, 1.65, { collide: false, chamfer: 0.1 });
      }
    }
    // overhead ring of beams + hanging lamps
    for (const s of [-1, 1]) {
      this.box(0, s * p, 2 * p - 2.4, 0.8, 9.2, 10.0, Tex.pillar, 4, { collide: false, emission: 0 });
      this.box(s * p, 0, 0.8, 2 * p - 2.4, 9.2, 10.0, Tex.pillar, 4, { collide: false, emission: 0 });
      this.glowBox(0, 9.17, s * p, 2 * p - 3, 0.06, 0.16, Level.cyan, 4);
      this.glowBox(s * p, 9.17, 0, 0.16, 0.06, 2 * p - 3, Level.cyan, 4);
    }
    const lampPos = [v3(0, 0, p), v3(0, 0, -p), v3(p, 0, 0), v3(-p, 0, 0), v3(7, 0, 7), v3(-7, 0, -7), v3(7, 0, -7), v3(-7, 0, 7)];
    const strutMat = Mat.metal(v3(0.12, 0.13, 0.15), { rough: 0.4 });
    const housingMat = Mat.metal(v3(0.1, 0.1, 0.12), { rough: 0.4 });
    const lampGlow = this.glowMat(v3(0.85, 0.95, 1.0), 3);
    const shaftBig = Mat.additive(Tex.shaft, v3(0.55, 0.8, 1.0), 0.05);
    const shaftSmall = Mat.additive(Tex.shaft, v3(0.55, 0.8, 1.0), 0.035);
    lampPos.forEach((lp, i) => {
      const big = i < 4;
      const y = big ? 9.2 : 9.0;
      if (!big) {
        // diagonal struts from the core cap out to the pillars carry the inner lamps
        this.part(Geo.box(0.35, 0.35, 15.5), strutMat, v3(lp.x, 9.4, lp.z), { rot: v3(0, Math.atan2(lp.x, lp.z), 0), shadow: false });
      }
      this.part(Geo.cyl(big ? 0.9 : 0.6, 0.35), housingMat, v3(lp.x, y - 0.2, lp.z), { shadow: false });
      this.part(Geo.cyl(big ? 0.7 : 0.45, 0.06), lampGlow, v3(lp.x, y - 0.4, lp.z), { shadow: false });
      // fake volumetric shaft
      const hgt = y - 0.4;
      const cone = new THREE.Mesh(Geo.cone(big ? 0.7 : 0.45, big ? 4.2 : 3.0, hgt, 32), big ? shaftBig : shaftSmall);
      cone.position.set(lp.x, hgt / 2, lp.z);
      cone.renderOrder = 20;
      this.root.add(this.static_(cone));
      this.pool(lp.x, lp.z, big ? 11 : 8, v3(0.6, 0.85, 1.0), big ? 0.38 : 0.3);
    });
  }

  buildPlatforms() {
    for (const s of [1, -1]) {
      const cx = 20 * s, cz = -20 * s;
      this.box(cx, cz, 9, 9, 0, 1.6, Tex.tech, 3, { chamfer: 0.04 });
      // stairs toward the arena centre on two sides
      for (let i = 0; i < 3; i++) {
        const top = 1.2 - 0.4 * i;
        const off = 4.5 + 0.5 + i;
        this.box(cx - s * off, cz, 1.0, 3.4, 0, top, Tex.crateGrey, 1.7);
        this.box(cx, cz + s * off, 3.4, 1.0, 0, top, Tex.crateGrey, 1.7);
      }
      // railings on the outer edges
      this.box(cx + s * 4.3, cz, 0.35, 9, 1.6, 2.6, Tex.crateGrey, 1.5);
      this.box(cx, cz - s * 4.3, 9, 0.35, 1.6, 2.6, Tex.crateGrey, 1.5);
      this.glowBox(cx + s * 4.3, 2.63, cz, 0.12, 0.05, 8.6, Level.orange, 4);
      this.glowBox(cx, 2.63, cz - s * 4.3, 8.6, 0.05, 0.12, Level.orange, 4);
      this.glowBox(cx - s * 4.52, 1.5, cz, 0.04, 0.08, 8.8, Level.cyan, 4);
      this.glowBox(cx, 1.5, cz + s * 4.52, 8.8, 0.08, 0.04, Level.cyan, 4);
      // holo beacon
      const holder = new THREE.Group();
      holder.position.set(cx + s * 2.2, 1.6, cz - s * 2.2);
      this.root.add(holder);
      Geo.part(holder, Geo.cyl(0.6, 0.25), Mat.metal(v3(0.15, 0.16, 0.18)), v3(0, 0.12, 0));
      Geo.part(holder, Geo.cyl(0.45, 0.04), this.glowMat(Level.cyan, 5), v3(0, 0.26, 0), { shadow: false });
      const holo = new THREE.Group();
      holo.rotation.order = SCN_EULER;
      holo.position.set(0, 1.9, 0);
      holder.add(holo);
      const globe = new THREE.Mesh(Geo.sphere(0.75, 16), Mat.additive(Tex.scan, Level.cyan, 0.9));
      holo.add(globe);
      const hr = new THREE.Mesh(Geo.torus(1.1, 0.02), Mat.additive(null, Level.cyan, 1.5));
      hr.rotation.order = SCN_EULER;
      hr.rotation.set(0.5, 0, 0.2);
      holo.add(hr);
      this.spinners.push({ node: holo, rate: 2 * Math.PI / 7 });
      const shaft = new THREE.Mesh(Geo.cone(0.9, 0.42, 1.6, 24), Mat.additive(Tex.shaft, Level.cyan, 0.25));
      shaft.position.set(0, 1.08, 0);
      shaft.rotation.set(Math.PI, 0, 0);
      holder.add(shaft);
    }
  }

  buildCover() {
    // shipping containers (some stacked)
    const cw = 2.6, cl = 5.2, ch = 2.6;
    const container = (x, z, alongX, y0, set) => {
      this.box(x, z, alongX ? cl : cw, alongX ? cw : cl, y0, y0 + ch, set, 2.6, { chamfer: 0.03 });
    };
    container(-24, -5, false, 0, Tex.crateOrange);
    container(-24, -5.6, false, ch, Tex.crateTeal);
    container(-21.2, -4.2, false, 0, Tex.crateTeal);
    container(24, 5, false, 0, Tex.crateTeal);
    container(24, 5.6, false, ch, Tex.crateOrange);
    container(21.2, 4.2, false, 0, Tex.crateGrey);
    container(-5, 24, true, 0, Tex.crateOrange);
    container(-4.2, 21.2, true, 0, Tex.crateGrey);
    container(-5.6, 24, true, ch, Tex.crateGrey);
    container(5, -24, true, 0, Tex.crateTeal);
    container(4.2, -21.2, true, 0, Tex.crateOrange);
    container(5.6, -24, true, ch, Tex.crateOrange);

    // crate clusters
    const cs = 1.3;
    const sets = [Tex.crateOrange, Tex.crateTeal, Tex.crateGrey];
    const crate = (x, z, level, k) => {
      this.box(x, z, cs, cs, level * cs, (level + 1) * cs, sets[k % 3], cs, { chamfer: 0.03 });
    };
    for (const s of [1, -1]) {
      crate(7.6 * s, 7.6 * s, 0, 0); crate(9.0 * s, 7.6 * s, 0, 2); crate(7.6 * s, 9.0 * s, 0, 1); crate(7.7 * s, 7.7 * s, 1, 2);
      crate(-8.2 * s, 8.6 * s, 0, 1); crate(-9.6 * s, 8.4 * s, 0, 0);
      crate(27 * s, -14 * s, 0, 2); crate(27 * s, -12.6 * s, 0, 0); crate(27 * s, -13.3 * s, 1, 1); crate(28.4 * s, -13.2 * s, 0, 1);
      crate(-14 * s, -27 * s, 0, 1); crate(-12.6 * s, -27.2 * s, 0, 2);
      crate(3.5 * s, -14.5 * s, 0, 0); crate(-17 * s, 3 * s, 0, 2); crate(-17.2 * s, 4.4 * s, 0, 1);
    }

    // low barricades with light strip
    const barrier = (x, z, alongX) => {
      const w = alongX ? 3.4 : 0.55, d = alongX ? 0.55 : 3.4;
      this.box(x, z, w, d, 0, 1.15, Tex.crateGrey, 1.7, { tileV: 1.15, chamfer: 0.05 });
      this.glowBox(x, 1.17, z, alongX ? 3.0 : 0.1, 0.04, alongX ? 0.1 : 3.0, Level.cyan, 4);
    };
    barrier(0, 10.5, true); barrier(0, -10.5, true);
    barrier(10.5, 0, false); barrier(-10.5, 0, false);
    barrier(-19, -11, true); barrier(19, 11, true);
    barrier(11, -19, false); barrier(-11, 19, false);
    barrier(0, 24, true); barrier(0, -24, true);
    barrier(24, -1.5, false); barrier(-24, 1.5, false);
  }

  buildGenerators() {
    const tankMat = Mat.metal(v3(0.42, 0.44, 0.47), { rough: 0.22 });
    const capMat = Mat.metal(v3(0.2, 0.21, 0.23), { rough: 0.3 });
    const pipeMat = Mat.metal(v3(0.3, 0.3, 0.32), { rough: 0.3 });
    for (const [s, c] of [[-1, Level.magenta], [1, Level.orange]]) {
      const x = 22.5 * s, z = 22.5 * s;
      this.box(x, z, 4.6, 4.6, 0, 3.4, Tex.tech, 2.3, { chamfer: 0.08, emission: 3 });
      this.box(x, z, 3.2, 3.2, 3.4, 4.3, Tex.tech, 1.6, { collide: false, chamfer: 0.08 });
      this.part(Geo.cyl(0.9, 1.6), capMat, v3(x, 5.1, z));
      this.part(Geo.cyl(0.93, 0.12), this.glowMat(c, 5), v3(x, 5.3, z), { shadow: false });
      this.part(Geo.cyl(0.93, 0.12), this.glowMat(c, 5), v3(x, 4.7, z), { shadow: false });
      this.glowBox(x - s * 2.33, 1.7, z, 0.05, 2.2, 0.25, c, 5);
      this.glowBox(x, 1.7, z - s * 2.33, 0.25, 2.2, 0.05, c, 5);
      // tanks
      for (const [dx, dz] of [[-3.6, 0.6], [0.6, -3.6]]) {
        const tx = x + dx * s, tz = z + dz * s;
        this.part(Geo.capsule(0.95, 4.0), tankMat, v3(tx, 2.0, tz));
        this.part(Geo.torus(0.97, 0.06), this.glowMat(c, 4), v3(tx, 2.6, tz), { shadow: false });
        this.obstacles.push({ minX: tx - 0.9, maxX: tx + 0.9, minZ: tz - 0.9, maxZ: tz + 0.9, y0: 0, y1: 4 });
        this.part(Geo.cyl(0.14, 2.6, 12), pipeMat, v3((tx + x) / 2, 3.0, (tz + z) / 2),
          { rot: Math.abs(dx) > Math.abs(dz) ? v3(0, 0, Math.PI / 2) : v3(Math.PI / 2, 0, 0) });
      }
      this.pool(x - s * 3.2, z - s * 3.2, 16, c, 0.45);
      this.sprite(7, c, 0.45, v3(x, 5.0, z));
    }
  }

  buildSkyline() {
    // distant station towers peeking over the walls
    let k = 0;
    const mastMat = Mat.metal(v3(0.1, 0.1, 0.12), { rough: 0.5, plating: 0 });
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < 5; i++) {
        k += 1;
        const a = hashI(k, 1, 91), b = hashI(k, 2, 91), c = hashI(k, 3, 91);
        const along = -40 + i * 20 + (a - 0.5) * 8;
        const out = 46 + b * 16;
        const w = 7 + a * 7, h = 16 + c * 30;
        const [x, z] = side === 0 ? [along, -out] : side === 1 ? [along, out] : side === 2 ? [-out, along] : [out, along];
        const tower = this.box(x, z, w, w, 0, h, Tex.wallCyan, 8, { collide: false, emission: 2.5 });
        tower.castShadow = false;
        const lc = (k % 3 === 0) ? Level.magenta : (k % 3 === 1 ? Level.cyan : Level.orange);
        this.glowBox(x, h + 0.2, z, w * 0.9, 0.25, w * 0.9, lc, 2.5);
        if (c > 0.5) {
          this.part(Geo.cyl(0.12, 9, 8), mastMat, v3(x, h + 4.5, z), { shadow: false });
          const blink = this.sprite(2.5, Level.red, 1.2, v3(x, h + 9, z));
          this.beacons.push({ sprite: blink, wait: 0.3 + a });
        }
      }
    }
  }

  buildFloorStrips() {
    const y = 0.012;
    // guide lines from the core to the gates
    for (const s of [-1, 1]) {
      this.glowBox(0, y, s * 17.6, 0.14, 0.02, 21.5, Level.cyan, 2.6);
      this.glowBox(s * 17.6, y, 0, 21.5, 0.02, 0.14, Level.cyan, 2.6);
      this.glowBox(-0.9, y, s * 30.2, 0.08, 0.02, 3.2, Level.red, 3);
      this.glowBox(0.9, y, s * 30.2, 0.08, 0.02, 3.2, Level.red, 3);
      this.glowBox(s * 30.2, y, -0.9, 3.2, 0.02, 0.08, Level.red, 3);
      this.glowBox(s * 30.2, y, 0.9, 3.2, 0.02, 0.08, Level.red, 3);
    }
    // square ring around the core
    const r = 5.2;
    for (const s of [-1, 1]) {
      this.glowBox(0, y, s * r, 2 * r, 0.02, 0.1, Level.cyan, 2.6);
      this.glowBox(s * r, y, 0, 0.1, 0.02, 2 * r, Level.cyan, 2.6);
    }
    // perimeter line along the walls
    const pr = Level.half - 0.35;
    for (const s of [-1, 1]) {
      this.glowBox(0, y, s * pr, 2 * pr, 0.02, 0.07, Level.orange, 2.2);
      this.glowBox(s * pr, y, 0, 0.07, 0.02, 2 * pr, Level.orange, 2.2);
    }
  }

  buildAtmosphere() {
    const fade = { values: [0, 1, 1, 0], keyTimes: [0, 0.15, 0.8, 1] };
    // drifting dust motes
    const dust = this.particles.emitter({
      particleImage: 'softDot', blendMode: 'additive',
      birthRate: 160, particleLifeSpan: 9, particleLifeSpanVariation: 3,
      emitterShape: { box: [62, 9, 62] },
      particleSize: 0.035, particleSizeVariation: 0.025,
      particleVelocity: 0.25, particleVelocityVariation: 0.2, spreadingAngle: 180,
      particleColor: { x: 0.6, y: 0.85, z: 1.0, w: 0.55 },
      opacity: fade,
      warmupDuration: 9,
    });
    dust.position.x = 0; dust.position.y = 4.6; dust.position.z = 0;
    // sparks rising from the core
    const em = this.particles.emitter({
      particleImage: 'softDot', blendMode: 'additive',
      birthRate: 26, particleLifeSpan: 3.2, particleLifeSpanVariation: 1,
      emitterShape: { cyl: [1.2, 1] },
      particleSize: 0.06, particleSizeVariation: 0.04,
      particleVelocity: 2.2, particleVelocityVariation: 1,
      emittingDirection: { x: 0, y: 1, z: 0 }, spreadingAngle: 14,
      particleColor: { x: 0.5, y: 0.95, z: 1.0, w: 1 }, intensity: 2,
      opacity: fade,
    });
    em.position.x = 0; em.position.y = 1.2; em.position.z = 0;
  }

  /** Merges static meshes that share a material into one mesh each (fewer draw calls). */
  mergeStatic() {
    const groups = new Map();
    for (const m of this.root.children.slice()) {
      if (!m.isMesh || !m.userData.static) continue;
      const key = `${m.material.uuid}|${m.castShadow}|${m.receiveShadow}|${m.renderOrder}`;
      let g = groups.get(key);
      if (!g) { g = []; groups.set(key, g); }
      g.push(m);
    }
    for (const list of groups.values()) {
      if (list.length < 2) continue;
      const geos = [];
      for (const m of list) {
        m.updateMatrix();
        let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        g.applyMatrix4(m.matrix);
        // keep only the attributes every primitive has
        for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
        g.morphAttributes = {};
        geos.push(g);
      }
      const merged = mergeGeometries(geos, false);
      for (const g of geos) g.dispose();
      if (!merged) continue;
      const first = list[0];
      const mesh = new THREE.Mesh(merged, first.material);
      mesh.castShadow = first.castShadow;
      mesh.receiveShadow = first.receiveShadow;
      mesh.renderOrder = first.renderOrder;
      mesh.name = 'merged';
      for (const m of list) { m.removeFromParent(); m.geometry.dispose(); }
      this.root.add(mesh);
    }
  }

  // ---- per-frame animation (Swift: SCNActions and scn_frame.time)

  update(dt, time) {
    for (const u of this.timeUniforms) u.value = time;
    for (const s of this.spinners) s.node.rotation.y += s.rate * dt;
    for (const b of this.beacons) {
      // fade to 0.1 over 0.9 s, back to 1 over 0.2 s, hold for `wait`
      const period = 1.1 + b.wait;
      const t = time % period;
      const o = t < 0.9 ? 1 - 0.9 * (t / 0.9) : t < 1.1 ? 0.1 + 0.9 * ((t - 0.9) / 0.2) : 1;
      b.sprite.material.opacity = o;
    }
  }

  portalBoost(i, value) {
    const m = this.portalMats[i];
    if (m) m.uniforms.uBoost.value = value;
  }

  // ---- collision queries

  /** Push a vertical cylinder (feet at feetY) out of every obstacle it overlaps. MUTATES p.x / p.z. */
  resolve(p, radius, feetY, height, step = 0.5) {
    for (const o of this.obstacles) {
      if (feetY + step >= o.y1 || feetY + height <= o.y0) continue;
      const nx = clampf(p.x, o.minX, o.maxX), nz = clampf(p.z, o.minZ, o.maxZ);
      const dx = p.x - nx, dz = p.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= radius * radius) continue;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        p.x = nx + dx / d * radius; p.z = nz + dz / d * radius;
      } else {
        // centre is inside: leave through the nearest face
        const l = p.x - o.minX, r = o.maxX - p.x, b = p.z - o.minZ, f = o.maxZ - p.z;
        const m = Math.min(Math.min(l, r), Math.min(b, f));
        if (m === l) p.x = o.minX - radius; else if (m === r) p.x = o.maxX + radius;
        else if (m === b) p.z = o.minZ - radius; else p.z = o.maxZ + radius;
      }
    }
    const lim = Level.half - radius;
    p.x = clampf(p.x, -lim, lim); p.z = clampf(p.z, -lim, lim);
  }

  groundHeight(x, z, radius, feetY, step = 0.5) {
    let g = 0;
    for (const o of this.obstacles) {
      if (!(o.y1 <= feetY + step && o.y1 > g)) continue;
      if (x > o.minX - radius && x < o.maxX + radius && z > o.minZ - radius && z < o.maxZ + radius) g = o.y1;
    }
    return g;
  }

  /** Ray against floor and obstacles. Returns {t, n} or null. */
  raycast(o, d, maxT) {
    let best = maxT;
    let bn = v3(0, 1, 0);
    let hit = false;
    if (d.y < -1e-5) {
      const t = -o.y / d.y;
      if (t > 0 && t < best) { best = t; bn = v3(0, 1, 0); hit = true; }
    }
    const BIG = 3.4e38;
    const ix = Math.abs(d.x) > 1e-7 ? 1 / d.x : BIG;
    const iy = Math.abs(d.y) > 1e-7 ? 1 / d.y : BIG;
    const iz = Math.abs(d.z) > 1e-7 ? 1 / d.z : BIG;
    for (const b of this.obstacles) {
      let t1 = (b.minX - o.x) * ix, t2 = (b.maxX - o.x) * ix;
      let tmin = Math.min(t1, t2), tmax = Math.max(t1, t2);
      let axis = 0;
      t1 = (b.y0 - o.y) * iy; t2 = (b.y1 - o.y) * iy;
      const ymin = Math.min(t1, t2), ymax = Math.max(t1, t2);
      if (ymin > tmin) { tmin = ymin; axis = 1; }
      tmax = Math.min(tmax, ymax);
      t1 = (b.minZ - o.z) * iz; t2 = (b.maxZ - o.z) * iz;
      const zmin = Math.min(t1, t2), zmax = Math.max(t1, t2);
      if (zmin > tmin) { tmin = zmin; axis = 2; }
      tmax = Math.min(tmax, zmax);
      if (tmax < Math.max(tmin, 0) || tmin <= 0 || tmin >= best) continue;
      best = tmin; hit = true;
      bn = axis === 0 ? v3(d.x > 0 ? -1 : 1, 0, 0) : axis === 1 ? v3(0, d.y > 0 ? -1 : 1, 0) : v3(0, 0, d.z > 0 ? -1 : 1);
    }
    return hit ? { t: best, n: bn } : null;
  }

  lineOfSight(a, b) {
    const vx = b.x - a.x, vy = b.y - a.y, vz = b.z - a.z;
    const l = Math.hypot(vx, vy, vz);
    if (l < 1e-4) return true;
    return this.raycast(a, { x: vx / l, y: vy / l, z: vz / l }, l) === null;
  }
}
