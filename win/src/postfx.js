// Post-processing chain. Replaces the SCNCamera HDR settings of Game.swift setupCamera():
//   world pass -> weapon pass (own near plane, depth cleared) -> bloom -> final grade
//   (exposure, ACES tone mapping, saturation, contrast, vignette, colour fringe, sRGB out).

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { WEAPON_LAYER } from './gfx.js';

/** Draws the first-person weapon over the world with its own depth range (Swift: weaponRoot scale 0.2 + zNear 0.03). */
class WeaponPass extends Pass {
  constructor(scene, camera) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.needsSwap = false;
  }
  render(renderer, writeBuffer, readBuffer) {
    const cam = this.camera;
    const near = cam.near, far = cam.far;
    const layersMask = cam.layers.mask;
    const autoClear = renderer.autoClear;
    const shadowAuto = renderer.shadowMap.autoUpdate;
    renderer.autoClear = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(readBuffer);
    renderer.clearDepth();
    cam.layers.set(WEAPON_LAYER);
    cam.near = 0.01; cam.far = 20;
    cam.updateProjectionMatrix();
    renderer.render(this.scene, cam);
    cam.near = near; cam.far = far;
    cam.updateProjectionMatrix();
    cam.layers.mask = layersMask;
    renderer.shadowMap.autoUpdate = shadowAuto;
    renderer.autoClear = autoClear;
  }
}

const FinalShader = {
  name: 'NovaGrade',
  uniforms: {
    tDiffuse: { value: null },
    uExposure: { value: 1.0 },
    uSaturation: { value: 1.12 },
    uContrast: { value: 0.18 },
    uVignette: { value: 0.55 },
    uVignettePower: { value: 1.3 },
    uFringe: { value: 0.006 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uExposure, uSaturation, uContrast, uVignette, uVignettePower, uFringe;
    varying vec2 vUv;
    // three.js ACESFilmicToneMapping (linear sRGB in, linear out)
    vec3 RRTAndODTFit(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }
    vec3 aces(vec3 color) {
      const mat3 inM = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
      const mat3 outM = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
      color = inM * (color / 0.6);
      color = RRTAndODTFit(color);
      return clamp(outM * color, 0.0, 1.0);
    }
    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
    }
    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      // colour fringe grows toward the edges (SCNCamera colorFringeStrength)
      vec2 off = c * uFringe * r2 * 4.0;
      vec3 col = vec3(texture2D(tDiffuse, vUv - off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv + off).b);
      col = aces(col * uExposure);
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = max(mix(vec3(luma), col, uSaturation), 0.0);
      float v = pow(clamp(length(c) * 1.4142, 0.0, 1.0), 2.0 * uVignettePower);
      col *= 1.0 - uVignette * v;
      vec3 s = toSRGB(col);
      s = clamp((s - 0.5) * (1.0 + uContrast) + 0.5, 0.0, 1.0);
      gl_FragColor = vec4(s, 1.0);
    }
  `,
};

/** Returns { render(), setSize(w, h, pixelRatio), composer, bloom, grade }. */
export function createPostFX(renderer, scene, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const pr = renderer.getPixelRatio();
  const rt = new THREE.WebGLRenderTarget(Math.max(1, size.x * pr), Math.max(1, size.y * pr), {
    type: THREE.HalfFloatType,
    samples: 4,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(pr);
  composer.setSize(size.x, size.y);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new WeaponPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.45, 0.35, 1.0);
  composer.addPass(bloom);
  const grade = new ShaderPass(FinalShader);
  composer.addPass(grade);

  return {
    composer,
    bloom,
    grade,
    render() { composer.render(); },
    setSize(w, h, pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(w, h);
    },
  };
}
