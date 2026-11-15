#include "perks.h"

// MARK: - perks

const char* perkRaw(PerkID p) {
    static const char* n[] = {"damage", "magazine", "reload", "vital", "shield", "speed", "dash", "ammo", "fireRate", "secondWind",
                              "pulseRicochet", "pulseTwin", "scatterBurn", "scatterBounce", "railNova", "railChain", "plasmaHeavy", "plasmaSplit",
                              "abilityCooldown", "abilityPower"};
    return n[(int)p];
}
std::optional<PerkID> perkFromRaw(const std::string& s) {
    for (int i = 0; i < kPerkCount; i++) if (s == perkRaw((PerkID)i)) return (PerkID)i;
    return std::nullopt;
}

PerkCategory perkCategory(PerkID p) {
    switch (p) {
    case PerkID::damage: case PerkID::magazine: case PerkID::reload: case PerkID::vital: case PerkID::shield:
    case PerkID::speed: case PerkID::dash: case PerkID::ammo: case PerkID::fireRate: case PerkID::secondWind:
        return PerkCategory::stat;
    case PerkID::abilityCooldown: case PerkID::abilityPower:
        return PerkCategory::ability;
    default:
        return PerkCategory::mod;
    }
}

const char* perkName(PerkID p) {
    static const char* n[] = {"FEUERKRAFT", "ERWEITERTE MAGAZINE", "SCHNELLLADER", "PANZERPLATTEN", "SCHILDMATRIX", "SERVOMOTOREN",
                              "DASH-SPULEN", "MUNITIONSGURT", "ÜBERTAKTUNG", "NOTFALLPROTOKOLL", "PULS: QUERSCHLÄGER", "PULS: ZWILLINGSLAUF",
                              "STREU: BRANDMUNITION", "STREU: ABPRALLER", "RAIL: ENTLADUNG", "RAIL: KETTENBLITZ", "PLASMA: SCHWERKERN",
                              "PLASMA: STREUBOMBE", "SCHNELLLADUNG", "VERSTÄRKUNG"};
    return n[(int)p];
}

std::string perkDesc(PerkID p, AbilityID ability) {
    switch (p) {
    case PerkID::damage: return "+12 % Schaden mit allen Waffen und der Fähigkeit.";
    case PerkID::magazine: return "+25 % Magazingröße. Alle Magazine sofort voll.";
    case PerkID::reload: return "−20 % Nachladezeit.";
    case PerkID::vital: return "+25 maximales Vital, heilt sofort 25.";
    case PerkID::shield: return "+25 maximaler Schild, lädt 25 % schneller.";
    case PerkID::speed: return "+8 % Lauf- und Sprinttempo.";
    case PerkID::dash: return "−25 % Dash-Abklingzeit.";
    case PerkID::ammo: return "+50 % Reservemunition, sofort aufgefüllt.";
    case PerkID::fireRate: return "+10 % Feuerrate mit allen Waffen.";
    case PerkID::secondWind: return "Einmal pro Run: statt Systemausfall mit 50 Vital weiter, Schockwelle wirft Gegner zurück.";
    case PerkID::pulseRicochet: return "Jeder Treffer springt auf einen zweiten Gegner in der Nähe über (50 % Schaden).";
    case PerkID::pulseTwin: return "Zwei Strahlen pro Schuss (je 70 % Schaden), gleicher Munitionsverbrauch.";
    case PerkID::scatterBurn: return "Getroffene Gegner brennen 3 Sekunden lang (14 Schaden/s).";
    case PerkID::scatterBounce: return "Kugeln, die eine Wand treffen, prallen zum nächsten Gegner ab.";
    case PerkID::railNova: return "Der Strahl explodiert am Einschlagpunkt (90 Schaden, 4,5 m).";
    case PerkID::railChain: return "Jeder getroffene Gegner schlägt Blitze auf bis zu 3 Gegner in der Nähe (40 %).";
    case PerkID::plasmaHeavy: return "+50 % Explosionsradius, kein Eigenschaden mehr.";
    case PerkID::plasmaSplit: return "Die Explosion verstreut 5 Splitterbomben (je 40 Schaden).";
    case PerkID::abilityCooldown: return std::string("−25 % Abklingzeit von ") + abilityName(ability) + " [E].";
    case PerkID::abilityPower: return abilityPowerDesc(ability);
    }
    return "";
}

int perkMaxLevel(PerkID p) {
    switch (p) {
    case PerkID::damage: return 5;
    case PerkID::vital: return 4;
    case PerkID::magazine: case PerkID::reload: case PerkID::shield: case PerkID::speed: case PerkID::fireRate: return 3;
    case PerkID::dash: case PerkID::ammo: case PerkID::abilityCooldown: case PerkID::abilityPower: return 2;
    default: return 1;
    }
}

int perkCost(PerkID p) {
    switch (p) {
    case PerkID::fireRate: return 30;
    case PerkID::secondWind: return 45;
    case PerkID::pulseTwin: return 35;
    case PerkID::scatterBounce: return 30;
    case PerkID::railChain: return 40;
    case PerkID::plasmaSplit: return 35;
    default: return 0;
    }
}

int perkWeapon(PerkID p) {
    switch (p) {
    case PerkID::pulseRicochet: case PerkID::pulseTwin: return 0;
    case PerkID::scatterBurn: case PerkID::scatterBounce: return 1;
    case PerkID::railNova: case PerkID::railChain: return 2;
    case PerkID::plasmaHeavy: case PerkID::plasmaSplit: return 3;
    default: return -1;
    }
}

const char* perkTag(PerkID p) {
    switch (perkCategory(p)) {
    case PerkCategory::stat: return "WERTE";
    case PerkCategory::mod: return "WAFFEN-MOD";
    case PerkCategory::ability: return "FÄHIGKEIT";
    }
    return "";
}

V3 perkColor(PerkID p, AbilityID ability) {
    static const V3 weaponColors[4] = {V3(0.25f, 0.9f, 1.0f), V3(1.0f, 0.55f, 0.12f), V3(0.72f, 0.42f, 1.0f), V3(0.35f, 1.0f, 0.45f)};
    int w = perkWeapon(p);
    if (w >= 0) return weaponColors[w];
    return perkCategory(p) == PerkCategory::ability ? abilityColor(ability) : V3(0.35f, 0.92f, 1.0f);
}

std::vector<PerkID> researchPerks() {
    std::vector<PerkID> v;
    for (auto p : allPerks()) if (perkCost(p) > 0) v.push_back(p);
    return v;
}

// MARK: - abilities

const char* abilityRaw(AbilityID a) { static const char* n[] = {"grenade", "turret", "slowmo", "barrier"}; return n[(int)a]; }
std::optional<AbilityID> abilityFromRaw(const std::string& s) {
    for (auto a : allAbilities()) if (s == abilityRaw(a)) return a;
    return std::nullopt;
}
const char* abilityName(AbilityID a) { static const char* n[] = {"SPLITTERGRANATE", "GESCHÜTZTURM", "ZEITLUPE", "KRAFTFELD"}; return n[(int)a]; }
const char* abilityDesc(AbilityID a) {
    static const char* n[] = {"Wurfgranate, explodiert beim Aufprall (150 Schaden, 6 m).", "Stellt 14 s lang einen Turm auf, der selbstständig feuert.",
                              "Gegner und ihre Geschosse 5 s lang auf 30 % Tempo.", "Kuppel für 6 s, die feindliche Geschosse auslöscht."};
    return n[(int)a];
}
const char* abilityPowerDesc(AbilityID a) {
    static const char* n[] = {"Granate: +40 % Schaden und Radius.", "Turm: hält 50 % länger, feuert 30 % schneller.", "Zeitlupe hält 50 % länger.",
                              "Kraftfeld hält 50 % länger und wird 25 % größer."};
    return n[(int)a];
}
float abilityCooldownBase(AbilityID a) { static const float v[] = {7, 24, 22, 18}; return v[(int)a]; }
int abilityCost(AbilityID a) { static const int v[] = {0, 40, 50, 40}; return v[(int)a]; }
V3 abilityColor(AbilityID a) {
    static const V3 v[] = {V3(1.0f, 0.75f, 0.25f), V3(0.4f, 1.0f, 0.7f), V3(0.5f, 0.62f, 1.0f), V3(0.35f, 0.92f, 1.0f)};
    return v[(int)a];
}

// MARK: - wave events

const char* eventRaw(WaveEvent e) { static const char* n[] = {"lowGravity", "blackout", "swarm", "frenzy", "coreRush", "emp"}; return n[(int)e]; }
std::optional<WaveEvent> eventFromRaw(const std::string& s) {
    for (auto e : allEvents()) if (s == eventRaw(e)) return e;
    return std::nullopt;
}
const char* eventName(WaveEvent e) {
    static const char* n[] = {"NIEDRIGE SCHWERKRAFT", "STROMAUSFALL", "SCHWARM", "ADRENALIN", "KERNSTURM", "EMP-STURM"};
    return n[(int)e];
}
const char* eventDesc(WaveEvent e) {
    static const char* n[] = {"Höhere Sprünge, Geschosse fliegen weiter", "Arena-Licht aus, Helmlampe an", "Viel mehr kleine Gegner",
                              "Gegner schneller und aggressiver, doppelte Punkte", "Gegner lassen Kerne fallen", "Dein Schild ist offline"};
    return n[(int)e];
}
/// extra cores for surviving the wave (Kernsturm pays out through its drops instead)
int eventBonusCores(WaveEvent e) { static const int v[] = {2, 3, 3, 2, 0, 4}; return v[(int)e]; }
V3 eventColor(WaveEvent e) {
    static const V3 v[] = {V3(0.55f, 0.8f, 1.0f), V3(0.75f, 0.8f, 0.95f), V3(1.0f, 0.45f, 0.25f), V3(1.0f, 0.3f, 0.3f), V3(1.0f, 0.82f, 0.25f),
                           V3(0.35f, 0.92f, 1.0f)};
    return v[(int)e];
}

// MARK: - meta

Meta::Meta() {
    auto& d = Settings::shared();
    cores = d.integer("meta.cores");
    for (auto& u : d.list("meta.unlocked")) unlocked.insert(u);
    ability = abilityFromRaw(d.string("meta.ability")).value_or(AbilityID::grenade);
    if (!has(ability)) ability = AbilityID::grenade;
}

void Meta::earn(int n) {
    if (n <= 0) return;
    cores += n;
    save();
}

bool Meta::buy(PerkID p) {
    if (has(p) || cores < perkCost(p)) return false;
    cores -= perkCost(p);
    unlocked.insert(std::string("perk.") + perkRaw(p));
    save();
    return true;
}

bool Meta::buy(AbilityID a) {
    if (has(a) || cores < abilityCost(a)) return false;
    cores -= abilityCost(a);
    unlocked.insert(std::string("ability.") + abilityRaw(a));
    ability = a;
    save();
    return true;
}

void Meta::equip(AbilityID a) {
    if (!has(a)) return;
    ability = a;
    save();
}

void Meta::save() {
    if (!persist) return;
    auto& d = Settings::shared();
    d.set("meta.cores", cores);
    d.set("meta.unlocked", std::vector<std::string>(unlocked.begin(), unlocked.end()));
    d.set("meta.ability", std::string(abilityRaw(ability)));
}
