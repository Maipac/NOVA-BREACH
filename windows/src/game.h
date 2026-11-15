// Game state, player, camera, waves, combat, progression (port of Game.swift, Combat.swift,
// Progression.swift and Abilities.swift).
#pragma once
#include "gfx.h"
#include "level.h"
#include "effects.h"
#include "hud.h"
#include "audio.h"
#include "enemies.h"
#include "perks.h"
#include <set>
#include <functional>

// MARK: - input (physical keys: PS/2 scan codes, extended keys | 0x100)

namespace Key {
constexpr int a = 0x1E, s = 0x1F, d = 0x20, f = 0x21, q = 0x10, w = 0x11, e = 0x12, r = 0x13;
constexpr int n1 = 0x02, n2 = 0x03, n3 = 0x04, n4 = 0x05;
constexpr int ret = 0x1C, m = 0x32, space = 0x39, esc = 0x01, shift = 0x2A, l = 0x26, backspace = 0x0E;
constexpr int left = 0x14B, right = 0x14D;
}

struct InputFrame {
    std::set<int> keys;
    std::vector<int> pressed;
    float dx = 0, dy = 0;
    bool fire = false, clicked = false;
    float scroll = 0;
    /// where the last click landed, in view coordinates (origin bottom-left, like the HUD scene)
    std::optional<V2> click;
    bool down(int k) const { return keys.count(k) > 0; }
    bool hit(int k) const { return std::find(pressed.begin(), pressed.end(), k) != pressed.end(); }
};

struct Input {
    void key(int k, bool down) {
        if (down) { if (f.keys.insert(k).second) f.pressed.push_back(k); }
        else f.keys.erase(k);
    }
    void mouse(float x, float y) { f.dx += x; f.dy += y; }
    void button(bool down, std::optional<V2> p = std::nullopt) { f.fire = down; if (down) { f.clicked = true; f.click = p; } }
    void scroll(float v) { f.scroll += v; }
    void releaseAll() { f.keys.clear(); f.fire = false; }
    /// returns the accumulated state and resets the one-shot parts
    InputFrame frame() {
        InputFrame out = f;
        f.pressed.clear();
        f.dx = 0; f.dy = 0; f.clicked = false; f.scroll = 0; f.click.reset();
        return out;
    }
private:
    InputFrame f;
};

// MARK: - weapons, projectiles, pickups

enum class WeaponKind { hitscan, rail, launcher };

struct WeaponDef {
    std::string name, shortName;
    WeaponKind kind;
    float damage;
    int pellets;
    float spread, interval;
    int mag;
    float reload;
    V3 color;
    float kick;
    std::string sound;
    int reserveMax;     // -1 = unlimited
    int reserveStart;
};

struct Weapon {
    WeaponDef def;
    NodeRef node, muzzle, flash;
    int ammo, reserve;
    float cooldown = 0;
    /// current magazine size and reserve cap (perks raise them, reset() puts the defaults back)
    int mag, reserveMax;
    Weapon(WeaponDef d, NodeRef n, NodeRef mz, NodeRef fl) : def(std::move(d)), node(n), muzzle(mz), flash(fl) {
        ammo = def.mag; reserve = def.reserveStart; mag = def.mag; reserveMax = def.reserveMax;
    }
    void reset() { mag = def.mag; reserveMax = def.reserveMax; ammo = mag; reserve = def.reserveStart; cooldown = 0; }
};
using WeaponRef = std::shared_ptr<Weapon>;

struct Projectile {
    V3 pos, vel;
    float damage, splash;
    bool fromPlayer;
    float life, radius;
    V3 color;
    float gravity;
    NodeRef node;
    /// share of the damage the player takes from their own explosion
    float selfDamage = 0.22f;
    /// plasma mod: bursts into bomblets
    bool split = false;
    /// grenade / bomblet: does not count as a shot for accuracy and never splits
    bool sub = false;
};
using ProjRef = std::shared_ptr<Projectile>;

enum class PickupKind { health, ammo, power, core };
struct Pickup {
    PickupKind kind;
    V3 pos;
    NodeRef node;
    float life = 28;
    float t = frand(0, 6);
};
using PickupRef = std::shared_ptr<Pickup>;

struct Turret {
    NodeRef node, yawNode, pitchNode;
    V3 pos;
    float life, age = 0, yaw, pitch = 0, fireT = 0.5f, scanT = 0;
    std::weak_ptr<Enemy> target;
    /// height of the gun's pivot above the floor
    static constexpr float gunY = 0.95f;
};
using TurretRef = std::shared_ptr<Turret>;

struct Barrier {
    NodeRef node;
    V3 pos;          // centre on the floor
    float radius, life, t = 0;
};

/// perks: the upgrade choice after a wave (world frozen, cursor free)
enum class Phase { menu, playing, paused, dead, perks };

// MARK: - game

struct Game {
    Scene scene;
    std::unique_ptr<Level> level;
    MapID mapID;
    std::unique_ptr<Effects> fx;
    std::unique_ptr<HUD> hud;
    std::unique_ptr<Audio> audio;
    Input input;

    NodeRef camNode = Node::make();
    Camera camera;
    NodeRef weaponRoot = Node::make();
    NodeRef weaponHolder = Node::make();

    /// callbacks into the app shell
    std::function<void(bool)> onCapture;
    std::function<void()> onToggleFullscreen;

    Phase phase = Phase::menu;
    float time = 0;
    bool demo = false;
    /// set by the window when the app loses focus
    bool pauseRequested = false;
    bool autoStart = false;
    /// autopilot without invulnerability (tests the game-over path)
    bool demoMortal = false;
    double fpsAverage = 0;
    float menuAngle = 0.6f;

    // player
    V3 pos = V3(0, 0, 15), vel;
    float yaw = 0, pitch = 0, hp = 100, shield = 100, sinceHurt = 10;
    bool onGround = true;
    float coyote = 0, jumpBuffer = 0, dashCD = 0, dashT = 0;
    V3 dashDir = V3(0, 0, -1);
    float eyeY = 1.7f, bob = 0, fov = 64, overcharge = 0, deadT = 0, stepT = 0;

    // weapons
    std::vector<WeaponRef> weapons;
    int cur = 0, pendingWeapon = -1;
    float switchT = 0, reloadT = 0, reloadDur = 1, kickZ = 0, kickRot = 0, bloom = 0;
    V2 sway;
    float recoilPitch = 0, flashT = 0, hitSoundT = 0;

    // world
    std::vector<EnemyRef> enemies;
    std::vector<ProjRef> projectiles;
    std::vector<PickupRef> pickups;
    float navT = 0;
    ParticleSystem trail;
    std::vector<float> gateBoost = {0, 0, 0, 0};

    // waves / score
    int wave = 0;
    std::vector<EnemyKind> spawnQueue;
    float spawnT = 0, intermission = 3;
    bool waveActive = false;
    int score = 0, combo = 0;
    float comboT = 0;
    int kills = 0, shotsFired = 0, shotsHit = 0;
    float timeAlive = 0;
    int bossCount = 0;

    // progression: perks of this run, persistent cores/unlocks, the active ability, wave events
    Meta meta;
    std::map<PerkID, int> perkLevels;
    std::vector<PerkID> perkChoices;
    /// > 0: seconds until the upgrade choice opens after a cleared wave
    float perkPending = -1, perkT = 0;
    float maxHp = 100, maxShield = 100, invulnT = 0;
    bool secondWindUsed = false;
    int runCores = 0, bossKills = 0;
    /// the main menu shows the Labor instead of the map cards
    bool labor = false;
    float abilityCD = 0, slowT = 0;
    std::vector<TurretRef> turrets;
    std::unique_ptr<Barrier> barrier;
    std::optional<WaveEvent> event, nextEvent, lastEvent;
    std::vector<std::pair<Light*, float>> dimmedLights;
    std::optional<std::pair<float, float>> savedEnvironment;
    /// helmet lamp for the blackout event
    NodeRef flashlight = Node::make();
    /// test hooks from the command line (--perks, --event)
    std::vector<PerkID> testPerks;
    std::optional<WaveEvent> testEvent;
    float demoWeaponT = 0;

    V3 eye() const { return V3(pos.x, pos.y + eyeY, pos.z); }
    V3 viewDir() const { return V3(-std::sin(yaw) * std::cos(pitch), std::sin(pitch), -std::cos(yaw) * std::cos(pitch)); }
    V3 fwd() const { return V3(-std::sin(yaw), 0, -std::cos(yaw)); }
    V3 rightV() const { return V3(std::cos(yaw), 0, -std::sin(yaw)); }

    Game(V2 viewSize, bool audioEnabled);
    void setDemo(bool d) { demo = d; meta.persist = !d; Settings::shared().persist = !d; }
    void tick(float dtReal);
    void setPaused(bool p);
    void showMainMenu();
    void setMap(MapID id);
    void goToMenu();
    void startGame();
    void die();
    void updateMenuCamera(float dt);
    void setCameraRotation(float p, float y, float r);
    void updateDeathCamera(float dt);
    void simulate(float dt, const InputFrame& inp);
    void updateWorld(float dt);
    void updatePlayer(float dt, const InputFrame& inp);
    void updateCamera(float dt, const InputFrame& inp);
    void updateHUD(float dt);
    int comboMult() const { return std::min(1 + combo / 4, 8); }
    void hurtPlayer(float amount, std::optional<V3> src);
    void updateWaves(float dt);
    void startWave();
    void spawnEnemy(EnemyKind kind, std::optional<V3> forced = std::nullopt);
    void demoInput(InputFrame& inp);

    // combat (combat.cpp)
    void buildWeapons();
    void selectWeapon(int i);
    void startReload();
    void updateWeapons(float dt, const InputFrame& inp);
    V3 spreadDir(float s);
    void fire(Weapon& w);
    void damageEnemy(const EnemyRef& e, float amount, V3 p, V3 dir, bool crit, bool silent = false, bool dot = false);
    void killEnemy(const EnemyRef& e, bool scoreIt = true);
    void radialDamage(V3 p, float radius, float damage, float playerDamage, const Enemy* exclude = nullptr);
    ProjRef spawnProjectile(V3 p, V3 v, float damage, float splash, bool fromPlayer, float life, float radius, V3 c, float gravity, bool big);
    void updateProjectiles(float dt);
    void spawnPickup(PickupKind kind, V3 p);
    void updatePickups(float dt);
    void faceToward(Enemy& e, V2 dir, float dt, float rate = 8);
    void moveGround(Enemy& e, V2 dir, float speed, float dt);
    void enemyShoot(Enemy& e, V3 muzzle, float speed, float damage, float inaccuracy, float splash = 0, float lead = 0.6f, float gravity = 0);
    void updateEnemies(float dt);
    void pose(Node& n, V3 target, float dt, float rate = 8);
    void updateTyrant(const EnemyRef& e, float dt, V2 toN, float dist, bool alive);
    void updateBoss(const EnemyRef& e, float dt, V2 toN, V2 tangent, float dist, bool alive);

    // progression (progression.cpp)
    int perk(PerkID p) const { auto it = perkLevels.find(p); return it == perkLevels.end() ? 0 : it->second; }
    bool hasPerk(PerkID p) const { return perk(p) > 0; }
    float damageMul() const { return 1 + 0.12f * perk(PerkID::damage); }
    float reloadMul() const { return std::pow(0.8f, (float)perk(PerkID::reload)); }
    float fireRateMul() const { return 1 + 0.1f * perk(PerkID::fireRate); }
    float moveMul() const { return 1 + 0.08f * perk(PerkID::speed); }
    float dashCooldown() const { return 2.2f * std::pow(0.75f, (float)perk(PerkID::dash)); }
    float shieldRegenMul() const { return 1 + 0.25f * perk(PerkID::shield); }
    float abilityCooldown() const { return abilityCooldownBase(meta.ability) * std::pow(0.75f, (float)perk(PerkID::abilityCooldown)); }
    /// duration multiplier from VERSTÄRKUNG (the grenade scales damage and radius instead)
    float abilityPower() const { return 1 + 0.5f * perk(PerkID::abilityPower); }
    float enemyTimeScale() const { return slowT > 0 ? 0.3f : 1; }
    float gravityScale() const { return event == WaveEvent::lowGravity ? 0.4f : 1; }
    void applyPerk(PerkID p);
    std::vector<PerkID> rollPerks(int n);
    void openPerkChoice();
    std::pair<std::string, V3> nextWavePreview() const;
    void updatePerkChoice(float dt, const InputFrame& inp);
    void choosePerk(int i);
    void earnCores(int n);
    void triggerSecondWind();
    void openLabor();
    void closeLabor();
    void showLabor();
    void updateLabor(const InputFrame& inp);
    std::optional<WaveEvent> rollEvent(int w);
    void beginEvent(WaveEvent ev);
    void endEvent();
    void setBlackout(bool on);
    void ricochet(V3 p, const Enemy* hit, float damage, V3 c);
    void ignite(Enemy& e);
    bool bounce(V3 p, V3 d, V3 n, float damage, V3 c);
    void chainLightning(const std::vector<EnemyRef>& struck, float damage, V3 c);
    void bolt(V3 a, V3 b, V3 c);
    void scatterBomblets(V3 p, V3 c);
    void applyTestArgs(const std::function<const char*(const char*)>& arg);

    // abilities (abilities.cpp)
    void updateAbility(float dt, const InputFrame& inp);
    void useAbility();
    void placeTurret();
    TurretRef buildTurret(V3 p, float facing);
    void updateTurrets(float dt);
    void turretShot(Turret& t, const EnemyRef& e, V3 c);
    void raiseBarrier();
    void updateBarrier(float dt);
    void resetAbilityEffects();
    void updateAbilityHUD();

private:
    void setupCamera();
    void clearWorld();
};
