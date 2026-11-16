// Procedural PBR texture sets, sprites, sky and environment (port of Textures.swift).
#pragma once
#include "gfx.h"
#include <functional>

/// runs f(i) for i in 0..<n on all cores
void parallelFor(int n, const std::function<void(int)>& f);

struct TextureSet {
    std::string name;
    TexRef albedo, normal, roughness, metalness, emission;
};

namespace Tex {
extern const V3 sunDir, planetDir;
/// builds everything (multithreaded); call once at startup
void preload();
const TextureSet& floor();
const TextureSet& wallCyan();
const TextureSet& pillar();
const TextureSet& crateOrange();
const TextureSet& crateTeal();
const TextureSet& crateGrey();
const TextureSet& plating();
const TextureSet& tech();
const TextureSet& deck();
TexRef padMark();
TexRef glow();
TexRef softDot();
TexRef ring();
TexRef flare();
TexRef smoke();
TexRef shaft();
TexRef hex();
TexRef scan();
TexRef sky();
/// image based lighting rig, linear float pixels
const std::vector<V4>& envPixels();
int envW();
int envH();
}

namespace Mat {
/// Textured PBR material, cached per (texture, repeat) pair.
MatRef pbr(const TextureSet& set, float ru = 1, float rv = 1, float emission = 2.2f);
}
