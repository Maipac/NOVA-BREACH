// Materials + geometry helpers. Mirrors Sources/Materials.swift, adapted to three.js.
//
// Conventions (same as SceneKit, so positions/angles from the Swift code carry over unchanged):
//   right-handed, +Y up, cameras look down -Z. Colours are sRGB triples {x, y, z} in 0..1.
//   Geometry helpers reproduce SceneKit's primitive orientations (torus lies flat in XZ,
//   pyramid sits on its base at y = 0, capsule height includes the caps, ...).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Tex } from './textures.js';
import { norm } from './math.js';

/** Render layer of the first-person weapon (drawn in its own pass over the world). */
export const WEAPON_LAYER = 1;

/** sRGB triple -> THREE.Color (linear working space), optionally scaled into HDR for bloom. */
export function col(c, intensity = 1) {
  return new THREE.Color().setRGB(c.x, c.y, c.z, THREE.SRGBColorSpace).multiplyScalar(intensity);
}
export function setPos(obj, p) { obj.position.set(p.x, p.y, p.z); return obj; }
export function getPos(obj) { return { x: obj.position.x, y: obj.position.y, z: obj.position.z }; }

const _zAxis = new THREE.Vector3(0, 0, 1);
const _yAxis = new THREE.Vector3(0, 1, 0);
const _tmp = new THREE.Vector3();
/** Rotate obj so its local +Z axis points along dir (Swift orientZ). */
export function orientZ(obj, dir) {
  const d = norm(dir);
  obj.quaternion.setFromUnitVectors(_zAxis, _tmp.set(d.x, d.y, d.z));
  return obj;
}
/** Rotate obj so its local +Y axis points along dir (Swift transformY). */
export function orientY(obj, dir) {
  const d = norm(dir, { x: 0, y: 1, z: 0 });
  obj.quaternion.setFromUnitVectors(_yAxis, _tmp.set(d.x, d.y, d.z));
  return obj;
}

const pbrCache = new Map();
const platingCache = new Map();

function platingMaps(repeat) {
  let m = platingCache.get(repeat);
  if (!m) {
    const mk = (t) => { const c = t.clone(); c.repeat.set(repeat, repeat); c.needsUpdate = true; return c; };
    m = { normal: mk(Tex.plating.normalMap), orm: mk(Tex.plating.ormMap) };
    platingCache.set(repeat, m);
  }
  return m;
}

export const Mat = {
  /**
   * Textured PBR material for a texture set from textures.js ({name, map, normalMap, ormMap, emissiveMap}).
   * Cached per (set, emission). Tiling is NOT done here – tile the geometry UVs (Geo.tileUV / Geo.tiledBox).
   */
  pbr(set, emission = 2.2) {
    const key = `${set.name}|${emission}`;
    let m = pbrCache.get(key);
    if (m) return m;
    m = new THREE.MeshStandardMaterial({
      map: set.map,
      normalMap: set.normalMap,
      roughnessMap: set.ormMap,
      metalnessMap: set.ormMap,
      roughness: 1,
      metalness: 1,
    });
    if (set.emissiveMap && emission > 0) {
      m.emissiveMap = set.emissiveMap;
      m.emissive = new THREE.Color(1, 1, 1);
      m.emissiveIntensity = emission;
    }
    pbrCache.set(key, m);
    return m;
  },

  /** Flat coloured metal/paint with the shared plating normal map. NOT cached (callers mutate it for hit flashes). */
  metal(c, { rough = 0.35, metal = 1, plating = 1 } = {}) {
    const m = new THREE.MeshStandardMaterial({ color: col(c), metalness: metal, roughness: rough });
    if (plating > 0) {
      const maps = platingMaps(plating);
      m.normalMap = maps.normal;
      m.normalScale.set(0.8, 0.8);
      // plating roughness averages ~0.42; scale so the mean lands on `rough`
      m.roughnessMap = maps.orm;
      m.roughness = Math.min(rough / 0.42, 2.4);
    }
    return m;
  },

  /** Self-lit colour (neon strips, eyes). intensity > 1 pushes it into bloom. */
  glow(c, intensity = 3) {
    return new THREE.MeshBasicMaterial({ color: col(c, intensity) });
  },

  /** Unlit additive sprite/beam material. */
  additive(tex, c, intensity = 1, depthTest = true) {
    return new THREE.MeshBasicMaterial({
      map: tex || null,
      color: col(c, intensity),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      depthTest,
      side: THREE.DoubleSide,
      fog: false,
    });
  },
};

export const Geo = {
  box(w, h, l, chamfer = 0) {
    return chamfer > 0
      ? new RoundedBoxGeometry(w, h, l, 2, Math.min(chamfer, Math.min(w, h, l) * 0.49))
      : new THREE.BoxGeometry(w, h, l);
  },
  sphere(r, segments = 24) { return new THREE.SphereGeometry(r, segments, Math.max(8, Math.round(segments * 0.66))); },
  /** axis along Y */
  cyl(r, h, segments = 24) { return new THREE.CylinderGeometry(r, r, h, segments); },
  /** SceneKit capsule: total height h includes both caps; axis along Y */
  capsule(r, h) { return new THREE.CapsuleGeometry(r, Math.max(h - 2 * r, 0.001), 8, 16); },
  /** SceneKit cone/frustum: top radius, bottom radius, height; axis along Y */
  cone(top, bottom, h, segments = 24) { return new THREE.CylinderGeometry(top, bottom, h, segments); },
  /** SceneKit torus: lies flat in the XZ plane (axis = Y) */
  torus(ring, pipe) { return new THREE.TorusGeometry(ring, pipe, 12, 48).rotateX(Math.PI / 2); },
  /** in the XY plane facing +Z (like SCNPlane) */
  plane(w, h) { return new THREE.PlaneGeometry(w, h); },
  /** SceneKit pyramid: rectangular base centred on the origin at y = 0, apex at y = h */
  pyramid(w, h, l) {
    const g = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1).rotateY(Math.PI / 4);
    g.translate(0, 0.5, 0);
    g.scale(w, h, l);
    g.computeVertexNormals();
    return g;
  },

  /**
   * Rewrites UVs as a box projection in metres so textures tile every `tile` metres (`tileV` vertically).
   * Like SceneKit's contentsTransform scale, the pattern starts at the TOP edge of each side face
   * (texture top = top of the box), so wall tiers and crate stripes land where they did on the Mac.
   * Works for BoxGeometry and RoundedBoxGeometry.
   */
  tileUV(geo, tile, tileV = tile) {
    geo.computeBoundingBox();
    const min = geo.boundingBox.min, max = geo.boundingBox.max;
    const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) - min.x, y = pos.getY(i) - max.y, z = pos.getZ(i) - min.z;
      const ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i));
      if (ay >= ax && ay >= az) uv.setXY(i, x / tile, z / tile);
      else if (ax >= az) uv.setXY(i, z / tile, y / tileV);
      else uv.setXY(i, x / tile, y / tileV);
    }
    uv.needsUpdate = true;
    return geo;
  },
  tiledBox(w, h, l, tile, tileV = tile, chamfer = 0) { return Geo.tileUV(Geo.box(w, h, l, chamfer), tile, tileV); },

  /**
   * Mesh helper: geometry + material + position (+ Euler rotation, three's default XYZ order) attached to a parent.
   * rot is {x, y, z} radians. shadow=false for emissive/decorative parts.
   */
  part(parent, geo, mat, pos, { rot = null, shadow = true } = {}) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(pos.x, pos.y, pos.z);
    if (rot) m.rotation.set(rot.x, rot.y, rot.z);
    m.castShadow = shadow;
    m.receiveShadow = false;
    parent.add(m);
    return m;
  },

  /** Camera-facing additive glow sprite of the given world size. */
  glowSprite(size, c, intensity = 1, tex = null) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex || Tex.glow,
      color: col(c, intensity),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      fog: false,
    }));
    s.scale.set(size, size, 1);
    return s;
  },
};

/** Lights must also light the weapon layer, otherwise the view model renders black. */
export function lightBothLayers(light) { light.layers.enable(WEAPON_LAYER); return light; }
