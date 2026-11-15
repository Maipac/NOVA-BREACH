// Perks of the current run, the upgrade choice after each wave, cores, the Labor and wave events
// (port of Progression.swift).
#include "game.h"
#include "textures.h"

static UIColor green() { return UIColor(0.4f, 1, 0.6f); }

// MARK: - perks

void Game::applyPerk(PerkID p) {
    perkLevels[p] += 1;
    switch (p) {
    case PerkID::vital:
        maxHp += 25;
        hp = std::min(maxHp, hp + 25);
        break;
    case PerkID::shield:
        maxShield += 25;
        shield = std::min(maxShield, shield + 25);
        break;
    case PerkID::magazine: {
        float k = 1 + 0.25f * perk(PerkID::magazine);
        for (auto& w : weapons) { w->mag = (int)std::lround(w->def.mag * k); w->ammo = w->mag; }
        break;
    }
    case PerkID::ammo: {
        float k = 1 + 0.5f * perk(PerkID::ammo);
        for (auto& w : weapons)
            if (w->def.reserveMax > 0) { w->reserveMax = (int)(w->def.reserveMax * k); w->reserve = w->reserveMax; }
        break;
    }
    default:
        break;
    }
}

/// up to n different perks the player can still take, weighted so stats come up a bit more often than mods
std::vector<PerkID> Game::rollPerks(int n) {
    std::vector<std::pair<PerkID, float>> pool;
    for (auto p : allPerks()) {
        if (!meta.has(p) || perk(p) >= perkMaxLevel(p)) continue;
        float w = perkCategory(p) == PerkCategory::stat ? 1.0f : (perkCategory(p) == PerkCategory::mod ? 0.85f : 0.6f);
        pool.push_back({p, w});
    }
    std::vector<PerkID> out;
    while ((int)out.size() < n && !pool.empty()) {
        float total = 0;
        for (auto& e : pool) total += e.second;
        float r = frand(0, total);
        size_t pick = pool.size() - 1;
        for (size_t i = 0; i < pool.size(); i++) {
            r -= pool[i].second;
            if (r <= 0) { pick = i; break; }
        }
        out.push_back(pool[pick].first);
        pool.erase(pool.begin() + pick);
    }
    return out;
}

// MARK: - upgrade choice after a wave

void Game::openPerkChoice() {
    if (phase != Phase::playing) return;
    perkChoices = rollPerks(3);
    if (perkChoices.empty()) return;   // everything maxed out
    phase = Phase::perks;
    perkT = 0;
    scene.isPaused = true;
    input.releaseAll();
    AbilityID a = meta.ability;
    std::vector<PerkCard> cards;
    for (auto p : perkChoices) cards.push_back({perkTag(p), perkName(p), perkDesc(p, a), perk(p), perkMaxLevel(p), perkColor(p, a)});
    auto [text, color] = nextWavePreview();
    hud->showPerks(cards, wave, meta.cores, text, color);
    audio->play("power", 0.6f);
    audio->setMusicVolume(0.25f);
    if (onCapture) onCapture(false);
}

/// what the upgrade screen says about the coming wave
std::pair<std::string, V3> Game::nextWavePreview() const {
    int n = wave + 1;
    if (n == 15) return {"NÄCHSTE WELLE:  ENDGEGNER", V3(1, 0.3f, 0.25f)};
    if (n % 5 == 0) return {"NÄCHSTE WELLE:  BOSS – OVERSEER", V3(1, 0.3f, 0.25f)};
    if (nextEvent)
        return {std::string("NÄCHSTE WELLE:  ") + eventName(*nextEvent) + "  –  " + eventDesc(*nextEvent) + "  ·  +" + std::to_string(eventBonusCores(*nextEvent)) + " Kerne",
                eventColor(*nextEvent)};
    return {"NÄCHSTE WELLE:  keine besonderen Vorkommnisse", V3(0.6f, 0.75f, 0.85f)};
}

void Game::updatePerkChoice(float dt, const InputFrame& inp) {
    perkT += dt;
    if (demo) {
        if (perkT > 0.6f) choosePerk(irand(0, (int)perkChoices.size()));
        return;
    }
    // ignore keys and clicks that were already on their way when the screen opened
    if (perkT <= 0.35f) return;
    int nk[3] = {Key::n1, Key::n2, Key::n3};
    for (int i = 0; i < 3; i++)
        if (inp.hit(nk[i]) && i < (int)perkChoices.size()) { choosePerk(i); return; }
    if (inp.click) {
        auto h = hud->menuHit(*inp.click);
        if (h && h->kind == MenuHitKind::perk) choosePerk(h->index);
    }
}

void Game::choosePerk(int i) {
    if (phase != Phase::perks || i < 0 || i >= (int)perkChoices.size()) return;
    PerkID p = perkChoices[i];
    applyPerk(p);
    perkChoices.clear();
    phase = Phase::playing;
    scene.isPaused = false;
    hud->showGame();
    int lv = perk(p);
    std::string line = std::string("UPGRADE  ") + perkName(p) + (perkMaxLevel(p) > 1 ? "  " + std::to_string(lv) + "/" + std::to_string(perkMaxLevel(p)) : "");
    hud->feedLine(line, UIColor::of(perkColor(p, meta.ability)));
    audio->play("pickup");
    audio->setMusicVolume(0.42f);
    // the countdown kept running behind the upgrade screen: leave time to get ready
    intermission = std::max(intermission, 3.5f);
    input.releaseAll();
    if (onCapture) onCapture(true);
}

// MARK: - cores

void Game::earnCores(int n) {
    if (n <= 0) return;
    runCores += n;
    meta.earn(n);
}

/// NOTFALLPROTOKOLL: instead of dying, restart with half health and blast the enemies back
void Game::triggerSecondWind() {
    secondWindUsed = true;
    hp = 50;
    shield = maxShield;
    invulnT = 2;
    V3 c = pos + V3(0, 1, 0);
    radialDamage(c, 7, 120, 0);
    for (auto& e : enemies) {
        if (e->dead || isBoss(e->kind)) continue;
        V3 away = safeNorm(V3(e->pos.x - pos.x, 0, e->pos.z - pos.z), V3(1, 0, 0));
        if (simd_distance(e->pos, pos) < 9) e->vel += away * 14;
    }
    fx->explosion(c, 3, V3(0.4f, 1.0f, 0.6f), 0.7f);
    hud->flash(green(), 0.5f, 0.8f);
    hud->announce("NOTFALLPROTOKOLL", "Systeme neu gestartet  ·  2 Sekunden unverwundbar", green(), 1.6f);
    audio->play("power");
}

// MARK: - Labor (main menu)

void Game::openLabor() {
    if (phase != Phase::menu) return;
    labor = true;
    showLabor();
    audio->play("ui");
}

void Game::closeLabor() {
    labor = false;
    showMainMenu();
    audio->play("ui");
}

void Game::showLabor() {
    std::vector<LaborItem> abilities, research;
    for (auto a : allAbilities())
        abilities.push_back({"ABKLINGZEIT " + std::to_string((int)abilityCooldownBase(a)) + " s", abilityName(a), abilityDesc(a), abilityCost(a), meta.has(a),
                             meta.ability == a, meta.cores >= abilityCost(a), abilityColor(a)});
    for (auto p : researchPerks())
        research.push_back({perkTag(p), perkName(p), perkDesc(p, meta.ability), perkCost(p), meta.has(p), false, meta.cores >= perkCost(p), perkColor(p, meta.ability)});
    hud->showLabor(meta.cores, abilities, research);
}

void Game::updateLabor(const InputFrame& inp) {
    if (inp.hit(Key::esc) || inp.hit(Key::l) || inp.hit(Key::backspace)) { closeLabor(); return; }
    if (!inp.click) return;
    auto h = hud->menuHit(*inp.click);
    if (!h) return;
    switch (h->kind) {
    case MenuHitKind::back:
        closeLabor();
        break;
    case MenuHitKind::ability: {
        if (h->index < 0 || h->index >= kAbilityCount) return;
        AbilityID a = allAbilities()[h->index];
        if (meta.has(a)) {
            if (meta.ability != a) { meta.equip(a); audio->play("swap"); }
        } else if (meta.buy(a)) {
            audio->play("power");
        } else {
            audio->play("empty");
        }
        showLabor();
        break;
    }
    case MenuHitKind::research: {
        auto list = researchPerks();
        if (h->index < 0 || h->index >= (int)list.size()) return;
        PerkID p = list[h->index];
        if (meta.has(p)) return;
        audio->play(meta.buy(p) ? "power" : "empty");
        showLabor();
        break;
    }
    default:
        break;
    }
}

// MARK: - wave events

/// events start at wave 3, never on boss waves and never twice in a row
std::optional<WaveEvent> Game::rollEvent(int w) {
    if (w % 5 == 0) return std::nullopt;
    if (testEvent) return testEvent;
    if (w < 3 || frand() >= 0.45f) return std::nullopt;
    std::vector<WaveEvent> options;
    for (auto e : allEvents()) if (e != lastEvent) options.push_back(e);
    return options[irand(0, (int)options.size())];
}

void Game::beginEvent(WaveEvent ev) {
    switch (ev) {
    case WaveEvent::blackout:
        setBlackout(true);
        break;
    case WaveEvent::lowGravity:
        scene.gravity = V3(0, -6.5f, 0);
        break;
    case WaveEvent::emp:
        shield = 0;
        hud->flash(UIColor(0.3f, 0.9f, 1), 0.35f, 0.6f);
        audio->play("shieldHit");
        break;
    default:
        break;
    }
}

/// ends the running event (also called when a run starts or the player leaves to the menu)
void Game::endEvent() {
    setBlackout(false);
    scene.gravity = V3(0, -16, 0);
    event.reset();
}

/// dims every light of the map plus sky and reflections, switches the helmet lamp on; neon glow stays
void Game::setBlackout(bool on) {
    if (on) {
        if (!dimmedLights.empty()) return;
        level->root->enumerate([this](Node& n) {
            if (n.light) {
                dimmedLights.push_back({n.light.get(), n.light->intensity});
                n.light->intensity *= 0.07f;
            }
        });
        savedEnvironment = std::make_pair(scene.lightingEnvironmentIntensity, scene.backgroundIntensity);
        scene.lightingEnvironmentIntensity *= 0.12f;
        scene.backgroundIntensity *= 0.3f;
        flashlight->hidden = false;
        audio->play("death", 0.35f);
    } else {
        for (auto& d : dimmedLights) d.first->intensity = d.second;
        dimmedLights.clear();
        if (savedEnvironment) {
            scene.lightingEnvironmentIntensity = savedEnvironment->first;
            scene.backgroundIntensity = savedEnvironment->second;
            savedEnvironment.reset();
        }
        flashlight->hidden = true;
    }
}

// MARK: - weapon mods

/// QUERSCHLÄGER: the beam jumps from a hit to the closest other visible enemy
void Game::ricochet(V3 p, const Enemy* hit, float damage, V3 c) {
    EnemyRef best;
    float bd = 8;
    for (auto& e : enemies) {
        if (e->dead || e.get() == hit || e->spawnT > 0) continue;
        float d = simd_distance(e->center(), p);
        if (d < bd && level->lineOfSight(p, e->center())) { bd = d; best = e; }
    }
    if (!best) return;
    fx->tracer(p, best->center(), mix3(c, V3(1, 1, 1), 0.4f), 0.016f, 0.09f, 2.2f);
    damageEnemy(best, damage, best->center(), safeNorm(best->center() - p), false);
}

/// BRANDMUNITION: sets an enemy on fire (refreshes, does not stack)
void Game::ignite(Enemy& e) {
    if (e.dead) return;
    e.burnT = 3;
    e.burnDps = 14 * damageMul();
}

/// ABPRALLER: a pellet that hit a wall bounces once, bent toward the best target in front of the bounce
bool Game::bounce(V3 p, V3 d, V3 n, float damage, V3 c) {
    V3 o = p + n * 0.05f;
    V3 rd = safeNorm(d - n * (2 * simd_dot(d, n)));
    EnemyRef target;
    float bestDot = 0.55f;
    for (auto& e : enemies) {
        if (e->dead || e->spawnT > 0) continue;
        V3 to = e->center() - o;
        float l = simd_length(to);
        if (l > 26 || l < 0.3f) continue;
        float k = simd_dot(to / l, rd);
        if (k > bestDot && level->lineOfSight(o, e->center())) { bestDot = k; target = e; }
    }
    if (target) rd = safeNorm(target->center() + randUnit() * 0.15f - o);
    auto wall = level->raycast(o, rd, 30);
    float bt = wall ? wall->t : 30;
    EnemyRef hitE;
    bool crit = false;
    for (auto& e : enemies) {
        if (e->dead) continue;
        if (auto h = e->rayHit(o, rd, bt)) { bt = h->t; hitE = e; crit = h->crit; }
    }
    V3 end = o + rd * bt;
    fx->tracer(o, end, c, 0.014f, 0.07f, 1.6f);
    if (!hitE) return false;
    damageEnemy(hitE, damage * (crit ? 2 : 1), end, rd, crit);
    if (hasPerk(PerkID::scatterBurn)) ignite(*hitE);
    return true;
}

/// KETTENBLITZ: every enemy the rail hit arcs to up to three more nearby
void Game::chainLightning(const std::vector<EnemyRef>& struck, float damage, V3 c) {
    std::set<const Enemy*> done;
    for (auto& s : struck) done.insert(s.get());
    for (auto& s : struck) {
        V3 from = s->center();
        std::vector<EnemyRef> nearby;
        for (auto& e : enemies)
            if (!e->dead && e->spawnT <= 0 && !done.count(e.get()) && simd_distance(e->center(), from) < 9) nearby.push_back(e);
        std::sort(nearby.begin(), nearby.end(), [&](const EnemyRef& a, const EnemyRef& b) { return simd_distance(a->center(), from) < simd_distance(b->center(), from); });
        for (size_t i = 0; i < nearby.size() && i < 3; i++) {
            done.insert(nearby[i].get());
            bolt(from, nearby[i]->center(), c);
            damageEnemy(nearby[i], damage, nearby[i]->center(), safeNorm(nearby[i]->center() - from), false, true);
        }
    }
}

/// jagged lightning made of short tracer segments
void Game::bolt(V3 a, V3 b, V3 c) {
    V3 p = a;
    const int n = 5;
    for (int i = 1; i <= n; i++) {
        V3 q = a + (b - a) * ((float)i / n);
        if (i < n) q += randUnit() * 0.35f;
        fx->tracer(p, q, mix3(c, V3(1, 1, 1), 0.5f), 0.03f, 0.16f, 3);
        p = q;
    }
    fx->glowPop(b, c, 1.2f, 1.8f, 0.15f);
}

/// STREUBOMBE: five bomblets fly out of a plasma explosion
void Game::scatterBomblets(V3 p, V3 c) {
    for (int k = 0; k < 5; k++) {
        float a = k / 5.f * 2 * PI + frand(-0.3f, 0.3f);
        float h = frand(5, 8);
        V3 v(std::cos(a) * h, frand(5, 8), std::sin(a) * h);
        auto b = spawnProjectile(p + V3(0, 0.3f, 0), v, 40 * damageMul(), 2.6f, true, 3, 0.12f, c, 16, false);
        b->sub = true;
        b->selfDamage = 0;
    }
}

// MARK: - test hooks

/// --perks a,b,c|all   --ability turret   --event blackout (autotest and headless runs)
void Game::applyTestArgs(const std::function<const char*(const char*)>& arg) {
    if (const char* s = arg("--perks")) {
        std::string str(s);
        if (str == "all") testPerks = allPerks();
        else {
            size_t a = 0;
            while (a <= str.size()) {
                size_t b = str.find(',', a);
                if (b == std::string::npos) b = str.size();
                if (auto p = perkFromRaw(str.substr(a, b - a))) testPerks.push_back(*p);
                a = b + 1;
            }
        }
    }
    if (const char* s = arg("--ability")) if (auto a = abilityFromRaw(s)) meta.force(*a);
    if (const char* s = arg("--event")) if (auto e = eventFromRaw(s)) testEvent = e;
}
