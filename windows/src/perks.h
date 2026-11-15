// Upgrades chosen after each wave, the active ability on E, wave events and the persistent progression
// (cores + Labor unlocks). Port of Perks.swift.
#pragma once
#include "math.h"
#include "settings.h"
#include <string>
#include <vector>
#include <set>
#include <optional>

enum class PerkCategory { stat, mod, ability };

enum class PerkID {
    damage, magazine, reload, vital, shield, speed, dash, ammo, fireRate, secondWind,
    pulseRicochet, pulseTwin, scatterBurn, scatterBounce, railNova, railChain, plasmaHeavy, plasmaSplit,
    abilityCooldown, abilityPower,
};
constexpr int kPerkCount = 20;
inline std::vector<PerkID> allPerks() { std::vector<PerkID> v; for (int i = 0; i < kPerkCount; i++) v.push_back((PerkID)i); return v; }

enum class AbilityID { grenade, turret, slowmo, barrier };
constexpr int kAbilityCount = 4;
inline std::vector<AbilityID> allAbilities() { return {AbilityID::grenade, AbilityID::turret, AbilityID::slowmo, AbilityID::barrier}; }

enum class WaveEvent { lowGravity, blackout, swarm, frenzy, coreRush, emp };
constexpr int kEventCount = 6;
inline std::vector<WaveEvent> allEvents() { std::vector<WaveEvent> v; for (int i = 0; i < kEventCount; i++) v.push_back((WaveEvent)i); return v; }

// MARK: - perks

const char* perkRaw(PerkID p);
std::optional<PerkID> perkFromRaw(const std::string& s);
PerkCategory perkCategory(PerkID p);
const char* perkName(PerkID p);
std::string perkDesc(PerkID p, AbilityID ability);
int perkMaxLevel(PerkID p);
/// price in the Labor; 0 = in the pool from the start
int perkCost(PerkID p);
/// weapon slot a mod belongs to (-1 for others)
int perkWeapon(PerkID p);
const char* perkTag(PerkID p);
V3 perkColor(PerkID p, AbilityID ability);
/// perks that have to be researched in the Labor first, in display order
std::vector<PerkID> researchPerks();

// MARK: - abilities

const char* abilityRaw(AbilityID a);
std::optional<AbilityID> abilityFromRaw(const std::string& s);
const char* abilityName(AbilityID a);
const char* abilityDesc(AbilityID a);
const char* abilityPowerDesc(AbilityID a);
float abilityCooldownBase(AbilityID a);
int abilityCost(AbilityID a);
V3 abilityColor(AbilityID a);

// MARK: - wave events

const char* eventRaw(WaveEvent e);
std::optional<WaveEvent> eventFromRaw(const std::string& s);
const char* eventName(WaveEvent e);
const char* eventDesc(WaveEvent e);
int eventBonusCores(WaveEvent e);
V3 eventColor(WaveEvent e);

// MARK: - persistent progression

/// Cores and Labor unlocks, kept in the settings file between runs.
struct Meta {
    static constexpr V3 coreColor = V3(1.0f, 0.82f, 0.25f);
    /// autotest / headless runs never write the player's progression
    bool persist = true;
    int cores = 0;
    std::set<std::string> unlocked;
    AbilityID ability = AbilityID::grenade;

    Meta();
    bool has(PerkID p) const { return perkCost(p) == 0 || unlocked.count(std::string("perk.") + perkRaw(p)) > 0; }
    bool has(AbilityID a) const { return abilityCost(a) == 0 || unlocked.count(std::string("ability.") + abilityRaw(a)) > 0; }
    void earn(int n);
    bool buy(PerkID p);
    bool buy(AbilityID a);
    void equip(AbilityID a);
    /// test hook (--ability): equips without owning it and without saving
    void force(AbilityID a) { ability = a; }
private:
    void save();
};

// MARK: - what the HUD shows

struct PerkCard {
    std::string tag, name, desc;
    int level, maxLevel;   // level before taking it (0 = new)
    V3 color;
};

struct LaborItem {
    std::string tag, name, desc;
    int cost;
    bool owned, equipped, affordable;
    V3 color;
};
