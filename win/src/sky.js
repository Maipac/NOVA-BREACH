// Sky dome + image-based lighting. Mirrors Textures.swift makeSky / starLayer / makeEnv.
//
// The Swift sky was a 4096x2048 equirect image (8 bit, sRGB, so every value was clipped to 0..1 and
// then multiplied by background.intensity). Here:
//   - nebula, sun glow, the gas giant and its rings are smooth: they are rendered ONCE at startup into a
//     cube map by the same formulas (GLSL), so the per-frame cost is one texture lookup;
//   - the stars are tiny and must stay crisp at any resolution: they are evaluated per pixel in the dome
//     shader (cheap 3D cell hash), masked by the planet / ring coverage stored in the cube's alpha.
// Final colour = srgbToLinear(min(base + stars, 1)) * uIntensity – the same clip + decode as SceneKit.

import * as THREE from 'three';
import { Tex } from './textures.js';
import { v3, dot, clampf, mix3, sstep, fract } from './math.js';

const GLSL_COMMON = /* glsl */`
  uint hashU(int x, int y, int z, int s) {
    uint h = uint(x) * 374761393u + uint(y) * 668265263u;
    h = h + uint(z) * 1440662683u + uint(s) * 2246822519u;
    h = (h ^ (h >> 13u)) * 1274126177u;
    h ^= h >> 16u;
    return h;
  }
  float hash3(int x, int y, int z, int s) { return float(hashU(x, y, z, s) & 0xFFFFFFu) / 16777216.0; }
  float sstep(float e0, float e1, float x) { float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  float vnoise3(vec3 p, int seed) {
    vec3 pf = floor(p);
    ivec3 i = ivec3(pf);
    vec3 f = p - pf;
    f = f * f * (3.0 - 2.0 * f);
    float x00 = mix(hash3(i.x, i.y, i.z, seed), hash3(i.x + 1, i.y, i.z, seed), f.x);
    float x10 = mix(hash3(i.x, i.y + 1, i.z, seed), hash3(i.x + 1, i.y + 1, i.z, seed), f.x);
    float x01 = mix(hash3(i.x, i.y, i.z + 1, seed), hash3(i.x + 1, i.y, i.z + 1, seed), f.x);
    float x11 = mix(hash3(i.x, i.y + 1, i.z + 1, seed), hash3(i.x + 1, i.y + 1, i.z + 1, seed), f.x);
    return mix(mix(x00, x10, f.y), mix(x01, x11, f.y), f.z);
  }
  float fbm3(vec3 p, int octaves, int seed) {
    float sum = 0.0, amp = 0.5, n = 0.0;
    vec3 q = p;
    for (int o = 0; o < 6; o++) {
      if (o >= octaves) break;
      sum += amp * vnoise3(q, seed + o * 31);
      n += amp; amp *= 0.5;
      q = q * 2.03 + vec3(11.3, 7.7, 3.1);
    }
    return sum / n;
  }
  vec3 srgbToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
  }
`;

// ---- bake: everything except the stars, alpha = 1 where the planet / rings cover the sky

const BAKE_FRAG = /* glsl */`
  uniform vec3 uSun;
  uniform vec3 uPlanet;
  varying vec3 vDir;
  ${GLSL_COMMON}
  void main() {
    vec3 d = normalize(vDir);
    const float ang = 0.30;
    const float D = 10.0;
    float R = D * sin(ang);
    vec3 C = uPlanet * D;
    vec3 axis = normalize(vec3(0.35, 1.0, 0.25));
    vec3 bandAxis = normalize(vec3(0.3, 0.8, -0.5));

    // deep space + nebula
    vec3 q = d * 2.2;
    float n = fbm3(q + vec3(3.0, 1.0, 7.0), 5, 40);
    float n2 = fbm3(q * 1.7 + vec3(n * 2.5, 0.0, n * 2.5), 5, 77);
    float bv = dot(d, bandAxis) * 2.2;
    float band = exp(-bv * bv);
    float dens = sstep(0.42, 0.78, n2) * sstep(0.3, 0.7, n) * (0.25 + 0.75 * band);
    float hue = fbm3(q * 0.8 + vec3(9.0), 3, 12);
    vec3 neb = mix(vec3(0.05, 0.13, 0.45), vec3(0.60, 0.10, 0.42), sstep(0.35, 0.65, hue));
    neb += vec3(0.10, 0.55, 0.55) * pow(dens, 3.0);
    vec3 col = vec3(0.012, 0.016, 0.035) + neb * dens * 1.7;
    col += vec3(0.03, 0.045, 0.10) * band * 0.8;

    // sun
    float s = max(dot(d, uSun), 0.0);
    col += vec3(1.0, 0.92, 0.78) * (sstep(0.9994, 0.9998, s) * 3.0 + pow(s, 900.0) * 1.2 + pow(s, 70.0) * 0.22 + pow(s, 8.0) * 0.04);

    float cover = 0.0;
    // ringed gas giant
    float b = dot(d, C);
    float disc = b * b - (dot(C, C) - R * R);
    float tPlanet = 1e30;
    if (disc > 0.0 && b > 0.0) {
      float t = b - sqrt(disc);
      tPlanet = t;
      vec3 p = d * t;
      vec3 nrm = normalize(p - C);
      float lit = sstep(-0.12, 0.45, dot(nrm, uSun));
      float lat = dot(nrm, axis);
      float turb = fbm3(nrm * 3.0 + vec3(0.0, lat * 5.0, 0.0), 4, 5);
      float bandv = sin(lat * 19.0 + turb * 5.5) * 0.5 + 0.5;
      vec3 pc = mix(vec3(0.80, 0.47, 0.25), vec3(0.96, 0.82, 0.62), bandv);
      pc = mix(pc, vec3(0.42, 0.22, 0.22), sstep(0.5, 0.75, fbm3(nrm * 5.0 + vec3(4.0, lat * 9.0, 2.0), 4, 6)));
      float storm = sstep(0.16, 0.0, length(nrm - normalize(vec3(0.5, 0.25, 0.83))));
      pc = mix(pc, vec3(0.95, 0.55, 0.35), storm * 0.7);
      float rim = pow(1.0 - max(dot(nrm, -d), 0.0), 3.0);
      col = pc * lit * 0.95 + vec3(0.35, 0.6, 1.0) * rim * (0.15 + lit) * 0.9 + vec3(0.006, 0.01, 0.02);
      cover = 1.0;
    } else {
      float a = acos(clamp(dot(d, uPlanet), -1.0, 1.0));
      vec3 e = d - uPlanet * dot(d, uPlanet);
      vec3 en = length(e) > 1e-5 ? normalize(e) : vec3(0.0, 0.0, -1.0);
      float f = clamp(dot(en, uSun) * 0.6 + 0.6, 0.0, 1.0);
      col += vec3(0.25, 0.45, 0.95) * exp(-(a - ang) / 0.02) * 0.55 * f;
    }
    // rings
    float dn = dot(d, axis);
    if (abs(dn) > 1e-4) {
      float t = dot(C, axis) / dn;
      if (t > 0.0 && t < tPlanet) {
        vec3 p = d * t;
        float rr = length(p - C) / R;
        if (rr > 1.35 && rr < 2.4) {
          float x = (rr - 1.35) / 1.05;
          float a = (0.45 + 0.55 * sin(rr * 46.0)) * (0.6 + 0.4 * sin(rr * 13.0 + 1.0));
          a *= sstep(0.0, 0.04, x) * sstep(1.0, 0.9, x);
          a *= (rr > 1.93 && rr < 1.99) ? 0.08 : 1.0;
          // planet shadow across the ring
          vec3 pc = p - C;
          float along = dot(pc, uSun);
          float perp = length(pc - uSun * along);
          float shadow = (along < 0.0 && perp < R) ? 0.12 : 1.0;
          vec3 rc = mix(vec3(0.85, 0.75, 0.62), vec3(0.6, 0.5, 0.45), x);
          float k = clamp(a * 0.75, 0.0, 1.0);
          col = mix(col, rc * shadow, k);
          cover = max(cover, k);
        }
      }
    }
    gl_FragColor = vec4(col, cover);
  }
`;

const BAKE_VERT = /* glsl */`
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ---- dome: baked base + per-pixel stars

const DOME_VERT = /* glsl */`
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
    gl_Position.z = gl_Position.w;   // always at the far plane
  }
`;

const DOME_FRAG = /* glsl */`
  uniform samplerCube uBase;
  uniform float uIntensity;
  varying vec3 vWorld;
  ${GLSL_COMMON}
  vec3 starLayer(vec3 d, float k, float thresh, int seed, float pix) {
    vec3 p = d * k;
    vec3 c = floor(p);
    ivec3 i = ivec3(c);
    float h = hash3(i.x, i.y, i.z, seed);
    if (h < thresh) return vec3(0.0);
    vec3 sp = c + vec3(0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 1),
                       0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 2),
                       0.25 + 0.5 * hash3(i.x, i.y, i.z, seed + 3));
    float r = 0.05 + 0.09 * hash3(i.x, i.y, i.z, seed + 4);
    // never smaller than ~1.3 pixels (energy preserving), so stars do not shimmer when the view turns
    float rr = max(r, pix * k * 1.3);
    float b = sstep(rr, 0.0, length(p - sp)) * (r * r) / (rr * rr);
    float tint = hash3(i.x, i.y, i.z, seed + 5);
    vec3 colr = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.85, 0.7), tint);
    return colr * b * b * (0.5 + 1.2 * hash3(i.x, i.y, i.z, seed + 6));
  }
  void main() {
    vec3 d = normalize(vWorld - cameraPosition);
    vec4 base = textureCube(uBase, d);
    float pix = length(fwidth(d));
    vec3 stars = starLayer(d, 150.0, 0.72, 1, pix) * 1.5 + starLayer(d, 340.0, 0.80, 2, pix) * 1.0;
    vec3 col = base.rgb + stars * (1.0 - base.a);
    gl_FragColor = vec4(srgbToLinear(clamp(col, 0.0, 1.0)) * uIntensity, 1.0);
  }
`;

/** Bakes the smooth part of the sky into a cube map (one-off, a few ms on the GPU). */
function bakeSkyCube(renderer, size) {
  const rt = new THREE.WebGLCubeRenderTarget(size, {
    type: THREE.HalfFloatType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const bakeScene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSun: { value: new THREE.Vector3(Tex.sunDir.x, Tex.sunDir.y, Tex.sunDir.z) },
      uPlanet: { value: new THREE.Vector3(Tex.planetDir.x, Tex.planetDir.y, Tex.planetDir.z) },
    },
    vertexShader: BAKE_VERT,
    fragmentShader: BAKE_FRAG,
    side: THREE.BackSide,
    depthTest: false,
    depthWrite: false,
  });
  const geo = new THREE.SphereGeometry(1, 64, 32);
  bakeScene.add(new THREE.Mesh(geo, mat));
  const cam = new THREE.CubeCamera(0.01, 10, rt);
  const prevTone = renderer.toneMapping;
  renderer.toneMapping = THREE.NoToneMapping;
  cam.update(renderer, bakeScene);
  renderer.toneMapping = prevTone;
  geo.dispose();
  mat.dispose();
  return rt;
}

// ---- environment light rig (Swift makeEnv), equirect for PMREM

function envColor(d) {
  const y = d.y;
  let col = y < 0 ? v3(0.03, 0.033, 0.04) : mix3(v3(0.10, 0.11, 0.14), v3(0.03, 0.035, 0.06), y);
  const az = Math.atan2(d.x, -d.z);
  const seg = fract(az / (2 * Math.PI) * 8 + 0.5);
  const panel = sstep(0.12, 0.2, seg) * sstep(0.88, 0.8, seg);
  const idx = Math.floor(az / (2 * Math.PI) * 8 + 0.5 + 8) % 8;
  const pcol = idx % 2 === 0 ? v3(0.15, 0.85, 1.0) : v3(1.0, 0.25, 0.65);
  const k1 = panel * sstep(0.06, 0.12, y) * sstep(0.30, 0.22, y) * 0.9;
  col = v3(col.x + pcol.x * k1, col.y + pcol.y * k1, col.z + pcol.z * k1);
  const k2 = panel * sstep(0.5, 0.55, y) * sstep(0.66, 0.6, y) * (idx % 4 === 1 ? 1.0 : 0.0);
  col = v3(col.x + 1.0 * k2, col.y + 0.6 * k2, col.z + 0.25 * k2);
  const k3 = sstep(0.86, 0.95, y) * 1.1;
  col = v3(col.x + 0.9 * k3, col.y + 0.95 * k3, col.z + 1.0 * k3);
  const s = Math.max(dot(d, Tex.sunDir), 0);
  const k4 = Math.pow(s, 40) * 1.5;
  col = v3(col.x + 1.0 * k4, col.y + 0.9 * k4, col.z + 0.75 * k4);
  return col;
}

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

function makeEnvTexture(w, h) {
  const data = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    // three's equirectUv: v = asin(dir.y) / PI + 0.5, row 0 = v 0 = straight down
    const el = ((y + 0.5) / h - 0.5) * Math.PI;
    const cy = Math.sin(el), ce = Math.cos(el);
    for (let x = 0; x < w; x++) {
      // u = atan(dir.z, dir.x) / 2PI + 0.5
      const phi = ((x + 0.5) / w - 0.5) * 2 * Math.PI;
      const d = { x: Math.cos(phi) * ce, y: cy, z: Math.sin(phi) * ce };
      const c = envColor(d);
      const o = (y * w + x) * 4;
      // the Swift CGImage clipped to 0..1 and was sRGB encoded
      data[o] = srgbToLinear(clampf(c.x, 0, 1));
      data[o + 1] = srgbToLinear(clampf(c.y, 0, 1));
      data[o + 2] = srgbToLinear(clampf(c.z, 0, 1));
      data[o + 3] = 1;
    }
  }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.LinearSRGBColorSpace;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

/**
 * Creates the sky dome and the scene environment. Returns { mesh, update(camera), setIntensity(v), dispose() }.
 * The dome is re-centred on the camera every frame by update().
 */
export function createSky(renderer, scene) {
  const cube = bakeSkyCube(renderer, 1024);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: cube.texture },
      uIntensity: { value: 1.7 },
    },
    vertexShader: DOME_VERT,
    fragmentShader: DOME_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: true,
    fog: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 24), mat);
  mesh.name = 'sky';
  mesh.renderOrder = -1000;
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  // keep the dome around whatever camera renders it (main camera AND the floor's mirror camera)
  mesh.onBeforeRender = (_r, _s, camera) => {
    mesh.position.setFromMatrixPosition(camera.matrixWorld);
    mesh.updateMatrixWorld(true);
  };
  scene.add(mesh);

  // image based lighting: Swift lightingEnvironment (intensity 1.25)
  const env = makeEnvTexture(512, 256);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromEquirectangular(env);
  pmrem.dispose();
  env.dispose();
  scene.environment = envRT.texture;
  scene.environmentIntensity = 1.0;
  scene.background = null;

  return {
    mesh,
    update(camera) {
      mesh.position.setFromMatrixPosition(camera.matrixWorld);
    },
    setIntensity(v) { mat.uniforms.uIntensity.value = v; },
    dispose() {
      mesh.removeFromParent();
      mesh.geometry.dispose();
      mat.dispose();
      cube.dispose();
      envRT.dispose();
    },
  };
}

// exported for tests: direction -> env colour (sRGB, unclipped)
export { envColor };
