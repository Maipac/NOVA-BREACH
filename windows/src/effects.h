// Particles, tracers, explosions, light flashes, camera trauma and debris (port of Effects.swift).
#pragma once
#include "gfx.h"
#include <map>

struct Effects {
    Scene& scene;
    NodeRef root = Node::make();
    float trauma = 0;
    /// debris bounces on the floor inside ±floorExtent (the dock deck ends)
    float floorExtent = 1e30f;

    explicit Effects(Scene& s);
    void update(float dt);
    void shake(float amount) { trauma = std::min(1.f, trauma + amount); }
    void flash(V3 p, V3 c, float intensity, float duration, float range = 16);
    /// fading streak between two points
    void tracer(V3 a, V3 b, V3 c, float width = 0.025f, float life = 0.08f, float intensity = 2.5f);
    void railBeam(V3 a, V3 b, V3 c);
    void glowPop(V3 p, V3 c, float size, float intensity = 1.5f, float life = 0.18f, TexRef image = nullptr);
    /// bullet impact on level geometry
    void impact(V3 p, V3 n, V3 c, bool big = false);
    /// sparks when an enemy is hit
    void hitSparks(V3 p, V3 dir, V3 c, bool crit);
    void explosion(V3 p, float radius, V3 c, float shakeAmount = 0.5f);
    /// flying chunks with physics
    void debris(V3 p, int count, MatRef material, float size, float force);
    void spawnFlash(V3 p, V3 c);
    void clear();

private:
    struct FxLight { NodeRef node; float t, dur, peak; };
    std::vector<FxLight> lights;
    int lightIdx = 0;
    ParticleSystem sparks, fire, smoke, embers, shards;
    std::map<std::string, MatRef> beamMats;
    struct Chunk { NodeRef node; V3 vel, axis; float spin, half; };
    std::vector<Chunk> chunks;
    MatRef beamMat(V3 c, float intensity, bool glow = false);
};
