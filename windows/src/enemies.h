// Enemy types and their models (port of Enemies.swift).
#pragma once
#include "gfx.h"
#include <optional>

enum class EnemyKind { skitter, drone, trooper, roller, brute, boss, tyrant };
constexpr int kEnemyKinds = 7;

const char* displayName(EnemyKind k);
float kindHp(EnemyKind k);
float kindSpeed(EnemyKind k);
float kindRadius(EnemyKind k);
float kindHeight(EnemyKind k);
int kindScore(EnemyKind k);
float kindCost(EnemyKind k);
/// shows a boss health bar
inline bool isBoss(EnemyKind k) { return k == EnemyKind::boss || k == EnemyKind::tyrant; }
inline bool flies(EnemyKind k) { return k == EnemyKind::drone || k == EnemyKind::boss; }
V3 kindGlow(EnemyKind k);

struct HitSphere { V3 offset; float r; bool crit; };
struct RayEnemyHit { float t; bool crit; };

struct Enemy {
    EnemyKind kind;
    NodeRef node = Node::make();
    NodeRef model = Node::make();
    V3 pos, vel;
    float yaw = 0;
    float hp, maxHp, radius, height, speed;
    float attackCD = frand(0.8f, 2.0f);
    int burst = 0;
    float burstT = 0;
    float flash = 0;
    float anim = frand(0, 10);
    float strafe = frand() < 0.5f ? -1.f : 1.f;
    float strafeT = frand(1.5f, 4);
    float spawnT = 0.45f;
    bool dead = false;
    int state = 0;
    float stateT = 0;
    bool sees = false;
    float losT = frand(0, 0.2f);
    int side = 0;
    std::vector<MatRef> armor;
    std::vector<NodeRef> legs, spinners;
    std::vector<HitSphere> hits;
    std::vector<V3> muzzles;
    MatRef debrisMat;
    /// tyrant: sign of the last footstep phase (a change means a foot hit the floor)
    float stepSign = 1;
    /// scatter mod: seconds left burning, damage per second, timer for the flame puffs
    float burnT = 0, burnDps = 0, burnFxT = 0;

    Enemy(EnemyKind k, V3 p, float hpScale);
    V3 forward() const { return V3(std::sin(yaw), 0, std::cos(yaw)); }
    V3 right() const { return V3(std::cos(yaw), 0, -std::sin(yaw)); }
    /// local (right, up, forward) offset to world space
    V3 world(V3 o) const { return pos + right() * o.x + V3(0, o.y, 0) + forward() * o.z; }
    V3 center() const { return pos + V3(0, flies(kind) ? 0 : height * 0.55f, 0); }
    void setFlash(bool on);
    /// ray against the hit spheres: distance along the ray and whether it was a weak point
    std::optional<RayEnemyHit> rayHit(V3 o, V3 d, float maxT, float inflate = 0) const;

private:
    MatRef armorMat(V3 c, float rough = 0.38f);
    MatRef cloth(V3 c, float rough = 0.8f, float metal = 0.04f);
    void build();
    void buildTyrant();
};
using EnemyRef = std::shared_ptr<Enemy>;
