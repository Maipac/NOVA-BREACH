// Weapons, damage, projectiles, pickups and enemy AI (port of Combat.swift).
#include "game.h"
#include "textures.h"

static UIColor rgbc(float r, float g, float b) { return UIColor(r, g, b); }

// MARK: - weapon models

void Game::buildWeapons() {
    auto dark = Mat::metal(V3(0.11f, 0.115f, 0.13f), 0.32f, 1, 2);
    auto steel = Mat::metal(V3(0.36f, 0.38f, 0.42f), 0.24f, 1, 2);
    using Geo::part;
    auto finish = [&](const WeaponDef& def, const NodeRef& n, V3 muzzleAt, float flashSize) {
        auto muzzle = Node::make();
        muzzle->position = muzzleAt;
        n->add(muzzle);
        auto flash = Node::make(Geo::plane(flashSize, flashSize), Mat::additive(Tex::flare(), mix3(def.color, V3(1, 1, 1), 0.35f), 3.0f, false));
        flash->billboard = true;
        flash->hidden = true;
        muzzle->add(flash);
        // category 2: effect lights (muzzle flash, explosions) skip the view model so it never blows out
        n->enumerate([](Node& c) { c.castsShadow = false; c.categoryBitMask = 2; });
        n->hidden = true;
        weaponHolder->add(n);
        weapons.push_back(std::make_shared<Weapon>(def, n, muzzle, flash));
    };
    // 1 – pulse rifle
    {
        V3 c(0.25f, 0.9f, 1.0f);
        WeaponDef def{"PULSGEWEHR", "PULS", WeaponKind::hitscan, 13, 1, 0.008f, 0.092f, 40, 1.25f, c, 0.035f, "rifle", -1, -1};
        auto n = Node::make();
        auto glow = Mat::glow(c, 5);
        part(n, Geo::box(0.09f, 0.14f, 0.5f, 0.015f), dark, V3(0, 0, 0));
        part(n, Geo::box(0.07f, 0.05f, 0.64f, 0.01f), steel, V3(0, 0.09f, -0.1f));
        part(n, Geo::cyl(0.024f, 0.42f, 14), steel, V3(0, 0.02f, -0.46f), V3(PI / 2, 0, 0));
        part(n, Geo::box(0.078f, 0.09f, 0.3f, 0.02f), dark, V3(0, 0.02f, -0.36f));
        part(n, Geo::box(0.094f, 0.018f, 0.3f), glow, V3(0, 0.035f, -0.04f));
        part(n, Geo::box(0.082f, 0.012f, 0.2f), glow, V3(0, 0.0f, -0.36f));
        part(n, Geo::box(0.06f, 0.22f, 0.1f, 0.01f), steel, V3(0, -0.16f, -0.03f), V3(0.16f, 0, 0));
        part(n, Geo::box(0.06f, 0.17f, 0.085f, 0.015f), dark, V3(0, -0.13f, 0.18f), V3(-0.32f, 0, 0));
        part(n, Geo::box(0.07f, 0.11f, 0.26f, 0.02f), dark, V3(0, -0.02f, 0.36f));
        part(n, Geo::box(0.03f, 0.05f, 0.06f), dark, V3(0, 0.135f, 0.06f));
        part(n, Geo::box(0.012f, 0.012f, 0.012f), glow, V3(0, 0.165f, 0.06f));
        finish(def, n, V3(0, 0.02f, -0.7f), 0.55f);
    }
    // 2 – scatter cannon
    {
        V3 c(1.0f, 0.55f, 0.12f);
        WeaponDef def{"STREUKANONE", "STREU", WeaponKind::hitscan, 9.5f, 10, 0.07f, 0.72f, 8, 1.6f, c, 0.16f, "shotgun", 56, 24};
        auto n = Node::make();
        auto glow = Mat::glow(c, 5);
        part(n, Geo::box(0.115f, 0.14f, 0.46f, 0.02f), dark, V3(0, 0, 0.02f));
        for (float sx : {-0.036f, 0.036f}) {
            part(n, Geo::cyl(0.036f, 0.62f, 16), steel, V3(sx, 0.03f, -0.46f), V3(PI / 2, 0, 0));
            part(n, Geo::cyl(0.027f, 0.01f, 16), Mat::glow(c, 2), V3(sx, 0.03f, -0.772f), V3(PI / 2, 0, 0));
        }
        part(n, Geo::box(0.13f, 0.085f, 0.22f, 0.02f), steel, V3(0, -0.035f, -0.4f));
        part(n, Geo::box(0.134f, 0.016f, 0.16f), glow, V3(0, -0.035f, -0.4f));
        part(n, Geo::box(0.12f, 0.02f, 0.3f), glow, V3(0, 0.05f, 0.04f));
        part(n, Geo::box(0.065f, 0.18f, 0.09f, 0.015f), dark, V3(0, -0.14f, 0.2f), V3(-0.35f, 0, 0));
        part(n, Geo::box(0.08f, 0.12f, 0.28f, 0.02f), dark, V3(0, -0.03f, 0.38f));
        part(n, Geo::box(0.02f, 0.03f, 0.4f), steel, V3(0, 0.085f, -0.3f));
        finish(def, n, V3(0, 0.03f, -0.8f), 0.95f);
    }
    // 3 – railgun
    {
        V3 c(0.72f, 0.42f, 1.0f);
        WeaponDef def{"RAILGUN", "RAIL", WeaponKind::rail, 190, 1, 0, 1.05f, 4, 1.9f, c, 0.2f, "rail", 24, 8};
        auto n = Node::make();
        auto glow = Mat::glow(c, 6);
        part(n, Geo::box(0.12f, 0.17f, 0.42f, 0.02f), dark, V3(0, 0, 0.12f));
        for (float sx : {-0.046f, 0.046f}) part(n, Geo::box(0.03f, 0.06f, 0.95f, 0.005f), steel, V3(sx, 0.03f, -0.4f));
        part(n, Geo::box(0.028f, 0.028f, 0.9f), glow, V3(0, 0.03f, -0.4f));
        for (int i = 0; i < 5; i++) part(n, Geo::torus(0.078f, 0.013f), dark, V3(0, 0.03f, -0.12f - i * 0.17f), V3(PI / 2, 0, 0));
        part(n, Geo::cyl(0.03f, 0.26f, 14), dark, V3(0, 0.14f, 0.1f), V3(PI / 2, 0, 0));
        part(n, Geo::cyl(0.022f, 0.01f, 14), glow, V3(0, 0.14f, -0.035f), V3(PI / 2, 0, 0));
        part(n, Geo::box(0.124f, 0.02f, 0.24f), glow, V3(0, -0.02f, 0.12f));
        part(n, Geo::box(0.065f, 0.18f, 0.09f, 0.015f), dark, V3(0, -0.15f, 0.22f), V3(-0.32f, 0, 0));
        part(n, Geo::box(0.08f, 0.12f, 0.22f, 0.02f), dark, V3(0, -0.02f, 0.42f));
        finish(def, n, V3(0, 0.03f, -0.9f), 0.9f);
    }
    // 4 – plasma launcher
    {
        V3 c(0.35f, 1.0f, 0.45f);
        WeaponDef def{"PLASMAWERFER", "PLASMA", WeaponKind::launcher, 135, 1, 0, 0.85f, 4, 2.1f, c, 0.2f, "launcher", 20, 8};
        auto n = Node::make();
        auto glow = Mat::glow(c, 5);
        part(n, Geo::cyl(0.085f, 0.62f, 20), dark, V3(0, 0.04f, -0.3f), V3(PI / 2, 0, 0));
        part(n, Geo::torus(0.09f, 0.018f), glow, V3(0, 0.04f, -0.6f), V3(PI / 2, 0, 0));
        part(n, Geo::torus(0.092f, 0.014f), steel, V3(0, 0.04f, -0.35f), V3(PI / 2, 0, 0));
        part(n, Geo::torus(0.092f, 0.014f), steel, V3(0, 0.04f, -0.15f), V3(PI / 2, 0, 0));
        part(n, Geo::box(0.14f, 0.16f, 0.36f, 0.025f), dark, V3(0, -0.01f, 0.16f));
        part(n, Geo::sphere(0.075f, 16), glow, V3(0, 0.1f, 0.12f));
        part(n, Geo::torus(0.085f, 0.012f), steel, V3(0, 0.1f, 0.12f));
        part(n, Geo::torus(0.085f, 0.012f), steel, V3(0, 0.1f, 0.12f), V3(0, 0, PI / 2));
        part(n, Geo::box(0.065f, 0.18f, 0.09f, 0.015f), dark, V3(0, -0.16f, 0.24f), V3(-0.32f, 0, 0));
        part(n, Geo::box(0.06f, 0.14f, 0.08f, 0.015f), steel, V3(0, -0.12f, -0.2f), V3(0.2f, 0, 0));
        finish(def, n, V3(0, 0.04f, -0.66f), 0.8f);
    }
}

// MARK: - weapon logic

void Game::selectWeapon(int i) {
    if (i == cur || i < 0 || i >= (int)weapons.size() || switchT > 0) return;
    pendingWeapon = i;
    switchT = 0.28f;
    reloadT = 0;
    audio->play("swap", 0.7f);
}

void Game::startReload() {
    Weapon& w = *weapons[cur];
    if (!(reloadT <= 0 && w.ammo < w.mag && (w.reserveMax < 0 || w.reserve > 0))) return;
    reloadDur = w.def.reload * reloadMul();
    reloadT = reloadDur;
    audio->play("reload", 0.8f);
}

void Game::updateWeapons(float dt, const InputFrame& inp) {
    int nk[4] = {Key::n1, Key::n2, Key::n3, Key::n4};
    for (int i = 0; i < 4; i++) if (inp.hit(nk[i])) selectWeapon(i);
    if (inp.scroll != 0 && switchT <= 0) selectWeapon((cur + (inp.scroll > 0 ? (int)weapons.size() - 1 : 1)) % (int)weapons.size());

    if (switchT > 0) {
        float before = switchT;
        switchT -= dt;
        if (before > 0.14f && switchT <= 0.14f && pendingWeapon >= 0) {
            weapons[cur]->node->hidden = true;
            weapons[cur]->flash->hidden = true;
            cur = pendingWeapon; pendingWeapon = -1;
            weapons[cur]->node->hidden = false;
        }
    }
    Weapon& w = *weapons[cur];
    for (auto& x : weapons) x->cooldown = std::max(0.f, x->cooldown - dt);
    bloom = std::max(0.f, bloom - dt * 0.05f);
    hitSoundT = std::max(0.f, hitSoundT - dt);

    if (reloadT > 0) {
        reloadT -= dt;
        if (reloadT <= 0) {
            int need = w.mag - w.ammo;
            if (w.reserveMax < 0) w.ammo = w.mag;
            else {
                int take = std::min(need, w.reserve);
                w.ammo += take; w.reserve -= take;
            }
        }
        return;
    }
    if (switchT > 0) return;
    if (inp.hit(Key::r)) { startReload(); return; }
    if (inp.fire && w.cooldown <= 0) {
        if (w.ammo <= 0) {
            if (w.reserveMax < 0 || w.reserve > 0) startReload();
            else if (inp.clicked) {
                audio->play("empty");
                hud->feedLine(w.def.name + ": keine Munition", rgbc(1, 0.4f, 0.3f));
                // fall back to the rifle so the player is never stuck
                selectWeapon(0);
            }
            return;
        }
        fire(w);
    }
}

V3 Game::spreadDir(float s) {
    if (s <= 0) return viewDir();
    V3 d = viewDir();
    V3 r = safeNorm(simd_cross(d, V3(0, 1, 0)), V3(1, 0, 0));
    V3 u = simd_cross(r, d);
    float a = frand(0, 2 * PI), m = std::sqrt(frand()) * s;
    return simd_normalize(d + r * (std::cos(a) * m) + u * (std::sin(a) * m));
}

void Game::fire(Weapon& w) {
    const WeaponDef& def = w.def;
    w.ammo -= 1;
    w.cooldown = def.interval * (overcharge > 0 ? 0.8f : 1.f) / fireRateMul();
    shotsFired++;
    float dmgMul = (overcharge > 0 ? 2.f : 1.f) * damageMul();
    kickZ = std::min(0.13f, kickZ + def.kick * 0.7f);
    kickRot = std::min(0.3f, kickRot + def.kick * 0.9f);
    recoilPitch += def.kick * 0.12f;
    fx->shake(def.kick * 0.9f);
    audio->play(def.sound, def.kind == WeaponKind::hitscan && def.pellets == 1 ? 0.55f : 0.9f);

    // muzzle flash
    w.flash->hidden = false;
    w.flash->setEuler(V3(0, 0, frand(0, 6.28f)));
    float fs = frand(0.8f, 1.25f);
    w.flash->scale = V3(fs, fs, fs);
    flashT = 0.045f;
    V3 o = eye();
    // muzzle direction in camera space (node transforms lag one frame behind the simulation, so stay local)
    V3 ml = safeNorm(camNode->convertPosition(V3(0, 0, 0), w.muzzle.get()));
    V3 upV = simd_cross(rightV(), viewDir());
    V3 tracerStart = o + (rightV() * ml.x + upV * ml.y - viewDir() * ml.z) * 1.5f;
    fx->flash(o + viewDir() * 0.8f, def.color, 500 + def.kick * 4000, 0.09f, 9);

    bool anyHit = false;
    switch (def.kind) {
    case WeaponKind::hitscan: {
        float movePenalty = (onGround ? 0 : 0.012f) + std::min(len2(vel) / 9.6f, 1.f) * 0.004f;
        // pulse mod: two beams per shot
        bool twin = def.pellets == 1 && cur == 0 && hasPerk(PerkID::pulseTwin);
        int n = twin ? 2 : def.pellets;
        for (int k = 0; k < n; k++) {
            V3 d = spreadDir(def.spread + bloom + movePenalty + (twin ? 0.004f : 0));
            auto wall = level->raycast(o, d, 220);
            float bestT = wall ? wall->t : 220;
            EnemyRef bestE;
            bool crit = false;
            for (auto& e : enemies) {
                if (e->dead) continue;
                if (auto h = e->rayHit(o, d, bestT)) { bestT = h->t; bestE = e; crit = h->crit; }
            }
            V3 end = o + d * bestT;
            V3 side = twin ? rightV() * (k == 0 ? -0.06f : 0.06f) : V3(0, 0, 0);
            fx->tracer(tracerStart + side, end, def.color, def.pellets > 1 ? 0.018f : 0.024f, 0.07f, def.pellets > 1 ? 1.6f : 2.6f);
            if (bestE) {
                float dmg = def.damage * dmgMul * (twin ? 0.7f : 1);
                if (def.pellets > 1) dmg *= clampf(1.25f - bestT / 34, 0.35f, 1);
                damageEnemy(bestE, dmg * (crit ? 2 : 1), end, d, crit);
                anyHit = true;
                if (cur == 0 && hasPerk(PerkID::pulseRicochet)) ricochet(end, bestE.get(), dmg * 0.5f, def.color);
                if (cur == 1 && hasPerk(PerkID::scatterBurn)) ignite(*bestE);
            } else if (wall) {
                fx->impact(end, wall->n, def.color);
                if (cur == 1 && hasPerk(PerkID::scatterBounce) && bounce(end, d, wall->n, def.damage * dmgMul * 0.6f, def.color)) anyHit = true;
            }
        }
        if (def.pellets == 1) bloom = std::min(0.028f, bloom + 0.0045f);
        break;
    }
    case WeaponKind::rail: {
        V3 d = viewDir();
        auto wall = level->raycast(o, d, 260);
        float maxT = wall ? wall->t : 260;
        std::vector<EnemyRef> struck;
        auto list = enemies;
        for (auto& e : list) {
            if (e->dead) continue;
            if (auto h = e->rayHit(o, d, maxT, 0.12f)) {
                struck.push_back(e);
                damageEnemy(e, def.damage * dmgMul * (h->crit ? 1.6f : 1), o + d * h->t, d, h->crit);
                anyHit = true;
            }
        }
        V3 end = o + d * maxT;
        fx->railBeam(tracerStart, end, def.color);
        if (wall) fx->impact(end, wall->n, def.color, true);
        if (hasPerk(PerkID::railChain) && !struck.empty()) chainLightning(struck, def.damage * dmgMul * 0.4f, def.color);
        if (hasPerk(PerkID::railNova) && wall) {
            fx->explosion(end, 3.2f, def.color, 0.3f);
            audio->play("explosion", end, pos, yaw, 0.7f);
            radialDamage(end, 4.5f, 90 * dmgMul, 0);
        }
        break;
    }
    case WeaponKind::launcher: {
        V3 d = viewDir();
        V3 start = o + d * 0.9f + rightV() * 0.16f - V3(0, 0.14f, 0);
        bool heavy = hasPerk(PerkID::plasmaHeavy);
        auto shot = spawnProjectile(start, d * 40 + V3(0, 1.2f, 0), def.damage * dmgMul, heavy ? 8.25f : 5.5f, true, 5, heavy ? 0.3f : 0.22f, def.color, 5, true);
        if (heavy) shot->selfDamage = 0;
        shot->split = hasPerk(PerkID::plasmaSplit);
        anyHit = false;
        break;
    }
    }
    if (anyHit) shotsHit++;
}

// MARK: - damage

/// dot: damage over time (burning) – no white flash, no knockback
void Game::damageEnemy(const EnemyRef& e, float amount, V3 p, V3 dir, bool crit, bool silent, bool dot) {
    if (e->dead) return;
    e->hp -= amount;
    if (!dot) {
        if (e->flash <= 0) e->setFlash(true);
        e->flash = 0.07f;
    }
    e->sees = true;
    bool killed = e->hp <= 0;
    if (!silent) {
        fx->hitSparks(p, dir, kindGlow(e->kind), crit);
        hud->hit(killed, crit);
        if (hitSoundT <= 0) { audio->play(crit ? "crit" : "hit", 0.5f); hitSoundT = 0.04f; }
    }
    if (!isBoss(e->kind) && e->kind != EnemyKind::brute && !dot) e->vel += V3(dir.x, 0, dir.z) * std::min(amount * 0.06f, 4.f);
    if (killed) killEnemy(e);
}

void Game::killEnemy(const EnemyRef& e, bool scoreIt) {
    if (e->dead) return;
    e->dead = true;
    e->node->removeFromParent();
    V3 c = e->center();
    float size = 1.3f;
    switch (e->kind) {
    case EnemyKind::skitter: case EnemyKind::drone: size = 1.3f; break;
    case EnemyKind::trooper: size = 1.6f; break;
    case EnemyKind::roller: size = 4.2f; break;
    case EnemyKind::brute: size = 3.4f; break;
    case EnemyKind::boss: size = 7; break;
    case EnemyKind::tyrant: size = 9; break;
    }
    fx->explosion(c, size, e->kind == EnemyKind::roller ? V3(1.0f, 0.7f, 0.2f) : mix3(kindGlow(e->kind), V3(1, 0.6f, 0.2f), 0.5f), std::min(0.9f, size * 0.12f));
    fx->debris(c, isBoss(e->kind) ? 28 : (e->kind == EnemyKind::brute ? 12 : 5), e->debrisMat, isBoss(e->kind) ? 0.6f : (e->kind == EnemyKind::brute ? 0.4f : 0.2f), 4 + size * 1.6f);
    audio->play(size > 3 ? "explosion" : "enemyDie", c, pos, yaw, size > 3 ? 1.f : 0.8f);

    if (e->kind == EnemyKind::roller) {
        // volatile: hurts everything nearby, including other machines
        radialDamage(c, 5, 70, 26, e.get());
    }
    if (isBoss(e->kind)) {
        bool tyrant = e->kind == EnemyKind::tyrant;
        for (int k = 0; k < (tyrant ? 9 : 5); k++) {
            // the giant comes apart from the boots up to the head
            V3 o = tyrant ? e->pos + V3(frand(-1.5f, 1.5f), 1 + k * 0.9f, frand(-1.2f, 1.2f)) : c + randUnit() * 2.5f;
            auto node = Node::make();
            scene.root->add(node);
            Effects* fxp = fx.get();
            Audio* ap = audio.get();
            node->runAction(Act::sequence({Act::wait(0.15f + k * 0.18f), Act::run([fxp, ap, o](Node&) {
                fxp->explosion(o, 4, V3(1, 0.5f, 0.2f), 0.4f);
                ap->play("explosion", 0.8f);
            }), Act::removeFromParent()}));
        }
        hud->flash(UIColor::white(), 0.5f, 0.6f);
        hud->announce(tyrant ? "HITLER BESIEGT" : "OVERSEER ZERSTÖRT", "+" + std::to_string(kindScore(e->kind) * comboMult()), rgbc(1, 0.8f, 0.3f), tyrant ? 3.f : 2.f);
        if (tyrant) audio->play("waveClear");
        PickupKind kinds[3] = {PickupKind::health, PickupKind::ammo, PickupKind::power};
        for (int i = 0; i < (tyrant ? 4 : 3); i++) spawnPickup(kinds[irand(0, 3)], V3(c.x + frand(-3, 3), 0, c.z + frand(-3, 3)));
        bossKills++;
        int bc = tyrant ? 15 : 5;
        earnCores(bc);
        hud->feedLine("+" + std::to_string(bc) + " Kerne", UIColor::of(Meta::coreColor));
    }
    if (!scoreIt) return;
    kills++;
    combo++;
    comboT = 1;
    int pts = kindScore(e->kind) * comboMult() * (event == WaveEvent::frenzy ? 2 : 1);
    score += pts;
    hud->feedLine(std::string(displayName(e->kind)) + "  +" + std::to_string(pts));
    if (hitSoundT <= 0.03f) audio->play("kill", 0.6f);
    // drops
    float roll = frand();
    float chance = e->kind == EnemyKind::brute ? 1.f : (e->kind == EnemyKind::trooper ? 0.3f : 0.15f);
    if (!isBoss(e->kind) && roll < chance) {
        float r = frand();
        bool hpNeed = hp < 60;
        PickupKind kind = r < (hpNeed ? 0.6f : 0.35f) ? PickupKind::health : (r < 0.92f ? PickupKind::ammo : PickupKind::power);
        spawnPickup(kind, V3(c.x, level->groundHeight(c.x, c.z, 0.2f, 2.5f), c.z));
    }
    if (event == WaveEvent::coreRush && !isBoss(e->kind) && frand() < 0.3f)
        spawnPickup(PickupKind::core, V3(c.x + frand(-0.6f, 0.6f), level->groundHeight(c.x, c.z, 0.2f, 2.5f), c.z + frand(-0.6f, 0.6f)));
}

/// explosion damage against enemies and (optionally) the player
void Game::radialDamage(V3 p, float radius, float damage, float playerDamage, const Enemy* exclude) {
    auto list = enemies;
    for (auto& e : list) {
        if (e->dead || e.get() == exclude) continue;
        float d = simd_distance(e->center(), p) - e->radius;
        if (d < radius) {
            float k = clampf(1 - d / radius, 0, 1);
            damageEnemy(e, damage * (0.35f + 0.65f * k), e->center(), safeNorm(e->center() - p), false, true);
        }
    }
    if (playerDamage > 0) {
        float d = simd_distance(pos + V3(0, 0.9f, 0), p);
        if (d < radius) {
            float k = clampf(1 - d / radius, 0, 1);
            hurtPlayer(playerDamage * (0.3f + 0.7f * k), p);
            V3 push = safeNorm(pos + V3(0, 0.9f, 0) - p) * (9 * k);
            vel += V3(push.x, std::max(push.y, 0.f) + 3 * k, push.z);
            onGround = false;
        }
    }
}

// MARK: - projectiles

ProjRef Game::spawnProjectile(V3 p, V3 v, float damage, float splash, bool fromPlayer, float life, float radius, V3 c, float gravity, bool big) {
    auto n = Node::make();
    auto cn = Node::make(Geo::sphere(radius * 0.7f, 10), Mat::additive(nullptr, mix3(c, V3(1, 1, 1), 0.6f), 3));
    cn->castsShadow = false;
    n->add(cn);
    n->add(Geo::glowSprite(radius * (big ? 9 : 7), c, big ? 1.5f : 1.2f));
    n->position = p;
    scene.root->add(n);
    if (big) {
        ParticleSystem t = trail;
        t.color = V4(c, 1);
        t.size = radius * 1.6f;
        scene.attachParticleSystem(n, t);
    }
    auto pr = std::make_shared<Projectile>();
    pr->pos = p; pr->vel = v; pr->damage = damage; pr->splash = splash; pr->fromPlayer = fromPlayer;
    pr->life = life; pr->radius = radius; pr->color = c; pr->gravity = gravity; pr->node = n;
    projectiles.push_back(pr);
    return pr;
}

void Game::updateProjectiles(float dt) {
    size_t i = 0;
    while (i < projectiles.size()) {
        ProjRef p = projectiles[i];
        // Zeitlupe slows enemy fire only
        float pdt = p->fromPlayer ? dt : dt * enemyTimeScale();
        if (!p->fromPlayer && barrier && simd_distance(p->pos, barrier->pos) < barrier->radius) {
            // the Kraftfeld swallows enemy fire
            fx->glowPop(p->pos, abilityColor(AbilityID::barrier), 1.3f, 1.8f, 0.16f);
            p->node->removeFromParent();
            projectiles.erase(projectiles.begin() + i);
            continue;
        }
        p->life -= pdt;
        if (p->gravity != 0) p->vel.y -= p->gravity * gravityScale() * pdt;
        V3 step = p->vel * pdt;
        float l = simd_length(step);
        V3 d = l > 1e-6f ? step / l : V3(0, -1, 0);
        float hitT = l;
        std::optional<V3> hitN;
        EnemyRef hitE;
        bool hitPlayer = false, crit = false;
        if (auto w = level->raycast(p->pos, d, l)) { hitT = w->t; hitN = w->n; }
        if (p->fromPlayer) {
            for (auto& e : enemies) {
                if (e->dead) continue;
                if (auto h = e->rayHit(p->pos, d, hitT, p->radius)) { hitT = h->t; hitE = e; crit = h->crit; }
            }
        } else if (phase == Phase::playing) {
            std::pair<V3, float> parts[2] = {{pos + V3(0, 0.75f, 0), 0.7f}, {pos + V3(0, 1.5f, 0), 0.42f}};
            for (auto& [c, r] : parts) {
                V3 oc = p->pos - c;
                float b = simd_dot(oc, d);
                float cc = simd_dot(oc, oc) - (r + p->radius) * (r + p->radius);
                float disc = b * b - cc;
                if (disc < 0) continue;
                float t = -b - std::sqrt(disc);
                if (t < 0 && cc < 0) t = 0;
                if (t >= 0 && t <= hitT) { hitT = t; hitPlayer = true; }
            }
        }
        bool hitSomething = hitN.has_value() || hitE || hitPlayer;
        if (hitSomething || p->life <= 0) {
            V3 at = p->pos + d * hitT;
            if (p->splash > 0) {
                fx->explosion(at, p->splash * 0.8f, p->color, p->fromPlayer ? 0.35f : 0.3f);
                audio->play("explosion", at, pos, yaw, 0.9f);
                if (p->fromPlayer) {
                    bool hitAny = false;
                    for (auto& e : enemies) if (!e->dead && simd_distance(e->center(), at) - e->radius < p->splash) { hitAny = true; break; }
                    if (hitAny) { if (!p->sub) shotsHit++; hud->hit(false, false); }
                    radialDamage(at, p->splash, p->damage, p->damage * p->selfDamage);
                    if (p->split && !p->sub) scatterBomblets(at - d * 0.3f, p->color);
                } else {
                    float dist = simd_distance(pos + V3(0, 0.9f, 0), at);
                    if (dist < p->splash) hurtPlayer(p->damage * clampf(1.15f - dist / p->splash, 0.25f, 1), at);
                }
            } else if (hitSomething) {
                if (hitE) damageEnemy(hitE, p->damage * (crit ? 2 : 1), at, d, crit);
                else if (hitPlayer) {
                    hurtPlayer(p->damage, at - d * 3);
                    fx->glowPop(at, p->color, 1.0f);
                } else if (hitN) fx->impact(at, *hitN, p->color);
            }
            p->node->removeFromParent();
            // the vector may have grown (bomblets); find the projectile again
            auto it = std::find(projectiles.begin(), projectiles.end(), p);
            if (it != projectiles.end()) projectiles.erase(it);
            continue;
        }
        p->pos += step;
        p->node->position = p->pos;
        i++;
    }
}

// MARK: - pickups

void Game::spawnPickup(PickupKind kind, V3 p) {
    auto n = Node::make();
    V3 c;
    auto spin = Node::make();
    n->add(spin);
    using Geo::part;
    switch (kind) {
    case PickupKind::health: {
        c = V3(0.3f, 1.0f, 0.5f);
        auto m = Mat::glow(c, 4);
        part(spin, Geo::box(0.5f, 0.16f, 0.16f, 0.03f), m, V3(0, 0, 0), V3(), false);
        part(spin, Geo::box(0.16f, 0.5f, 0.16f, 0.03f), m, V3(0, 0, 0), V3(), false);
        break;
    }
    case PickupKind::ammo:
        c = V3(1.0f, 0.6f, 0.15f);
        part(spin, Geo::box(0.42f, 0.3f, 0.3f, 0.04f), Mat::metal(V3(0.2f, 0.2f, 0.22f), 0.35f), V3(0, 0, 0));
        part(spin, Geo::box(0.44f, 0.06f, 0.32f), Mat::glow(c, 4), V3(0, 0.05f, 0), V3(), false);
        part(spin, Geo::box(0.1f, 0.32f, 0.32f), Mat::glow(c, 4), V3(0, 0, 0), V3(), false);
        break;
    case PickupKind::power: {
        c = V3(0.75f, 0.4f, 1.0f);
        auto m = Mat::glow(c, 5);
        part(spin, Geo::pyramid(0.4f, 0.38f, 0.4f), m, V3(0, 0, 0), V3(), false);
        part(spin, Geo::pyramid(0.4f, 0.38f, 0.4f), m, V3(0, 0, 0), V3(PI, 0, 0), false);
        break;
    }
    case PickupKind::core: {
        c = Meta::coreColor;
        auto m = Mat::glow(c, 6);
        part(spin, Geo::pyramid(0.28f, 0.3f, 0.28f), m, V3(0, 0, 0), V3(), false);
        part(spin, Geo::pyramid(0.28f, 0.3f, 0.28f), m, V3(0, 0, 0), V3(PI, 0, 0), false);
        part(spin, Geo::torus(0.34f, 0.022f), Mat::glow(V3(1, 0.95f, 0.8f), 4), V3(0, 0, 0), V3(PI / 2, 0, 0), false);
        break;
    }
    }
    spin->runAction(Act::repeatForever(Act::rotateBy(V3(0, 2 * PI, 0), 2.4f)));
    n->add(Geo::glowSprite(1.7f, c, 0.7f));
    auto rn = Node::make(Geo::plane(1.5f, 1.5f), Mat::additive(Tex::ring(), c, 0.9f));
    rn->setEuler(V3(-PI / 2, 0, 0)); rn->position = V3(0, -0.84f, 0); rn->castsShadow = false;
    n->add(rn);
    auto sn = Node::make(Geo::cone(0.05f, 0.55f, 1.8f, 16), Mat::additive(Tex::shaft(), c, 0.35f));
    sn->castsShadow = false;
    n->add(sn);
    V3 q = p;
    q.y = level->groundHeight(p.x, p.z, 0.2f, p.y + 0.3f) + 0.9f;
    n->position = q;
    scene.root->add(n);
    auto pk = std::make_shared<Pickup>();
    pk->kind = kind; pk->pos = q; pk->node = n;
    pickups.push_back(pk);
}

void Game::updatePickups(float dt) {
    size_t i = 0;
    while (i < pickups.size()) {
        PickupRef p = pickups[i];
        p->life -= dt;
        p->t += dt;
        bool remove = p->life <= 0;
        V3 chest = pos + V3(0, 0.9f, 0);
        float d = simd_distance(chest, p->pos);
        if (phase == Phase::playing) {
            bool wanted = true;
            switch (p->kind) {
            case PickupKind::health: wanted = hp < maxHp; break;
            case PickupKind::ammo: wanted = std::any_of(weapons.begin(), weapons.end(), [](const WeaponRef& w) { return w->reserveMax > 0 && w->reserve < w->reserveMax; }); break;
            default: wanted = true; break;
            }
            if (wanted && d < 4.5f) p->pos += safeNorm(chest - p->pos) * std::min(d, dt * (4 + (4.5f - d) * 5));
            if (wanted && d < 1.3f) {
                remove = true;
                switch (p->kind) {
                case PickupKind::health:
                    hp = std::min(maxHp, hp + 30);
                    hud->feedLine("+30 Vital", rgbc(0.4f, 1, 0.6f));
                    hud->flash(rgbc(0.3f, 1, 0.5f), 0.18f, 0.35f);
                    audio->play("pickup");
                    break;
                case PickupKind::ammo:
                    for (auto& w : weapons)
                        if (w->reserveMax > 0) w->reserve = std::min(w->reserveMax, w->reserve + std::max(1, (int)(w->reserveMax * 0.35f)));
                    hud->feedLine("Munition aufgefüllt", rgbc(1, 0.7f, 0.3f));
                    hud->flash(rgbc(1, 0.6f, 0.2f), 0.15f, 0.35f);
                    audio->play("pickup");
                    break;
                case PickupKind::power:
                    overcharge = 12;
                    hud->announce("ÜBERLADUNG", "Doppelter Schaden · schnellere Feuerrate", rgbc(0.8f, 0.5f, 1), 1.2f);
                    hud->flash(rgbc(0.7f, 0.4f, 1), 0.3f, 0.5f);
                    audio->play("power");
                    break;
                case PickupKind::core:
                    earnCores(1);
                    hud->feedLine("+1 Kern", UIColor::of(Meta::coreColor));
                    hud->flash(UIColor::of(Meta::coreColor), 0.12f, 0.3f);
                    audio->play("pickup", 0.8f);
                    break;
                }
            }
        }
        if (remove) {
            p->node->removeFromParent();
            pickups.erase(pickups.begin() + i);
            continue;
        }
        p->node->position = p->pos + V3(0, std::sin(p->t * 2.2f) * 0.12f, 0);
        p->node->opacity = p->life < 4 ? 0.35f + 0.65f * std::fabs(std::sin(p->life * 6)) : 1;
        i++;
    }
}

// MARK: - enemy AI

void Game::faceToward(Enemy& e, V2 dir, float dt, float rate) {
    if (simd_length(dir) < 1e-4f) return;
    float target = std::atan2(dir.x, dir.y);
    e.yaw += wrapAngle(target - e.yaw) * std::min(1.f, dt * rate);
}

void Game::moveGround(Enemy& e, V2 dir, float speed, float dt) {
    V3 desired = V3(dir.x, 0, dir.y) * speed;
    float k = std::min(1.f, dt * 7);
    e.vel.x += (desired.x - e.vel.x) * k;
    e.vel.z += (desired.z - e.vel.z) * k;
    V3 p(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt);
    level->resolve(p, std::min(e.radius, 0.6f) * 0.75f, e.pos.y, e.height, 0.55f);
    float g = level->groundHeight(p.x, p.z, 0.15f, e.pos.y, 0.55f);
    p.y = g > e.pos.y ? std::min(g, e.pos.y + dt * 7) : std::max(g, e.pos.y - dt * 14);
    e.pos = p;
}

void Game::enemyShoot(Enemy& e, V3 muzzle, float speed, float damage, float inaccuracy, float splash, float lead, float gravity) {
    V3 from = e.world(muzzle);
    float dist = simd_distance(from, pos);
    V3 target = pos + V3(0, 1.15f, 0) + V3(vel.x, 0, vel.z) * (dist / speed) * lead;
    if (splash > 0) target.y = pos.y + 0.3f;
    V3 d = safeNorm(target - from);
    d = simd_normalize(d + randUnit() * inaccuracy);
    spawnProjectile(from, d * speed, damage, splash, false, 6, splash > 0 ? 0.2f : 0.11f, splash > 0 ? V3(1.0f, 0.45f, 0.1f) : kindGlow(e.kind), gravity, splash > 0);
    fx->glowPop(from, kindGlow(e.kind), splash > 0 ? 1.6f : 0.9f, 1.5f, 0.1f);
    audio->play(splash > 0 ? "launcher" : "enemyShot", from, pos, yaw, 0.75f);
}

void Game::updateEnemies(float dt) {
    bool alive = phase == Phase::playing;
    float aggro = event == WaveEvent::frenzy ? 1.35f : 1;
    V3 playerChest = pos + V3(0, 1.1f, 0);
    // soft separation so they do not stack
    size_t n = enemies.size();
    for (size_t i = 0; i + 1 < n; i++) {
        Enemy& a = *enemies[i];
        if (isBoss(a.kind)) continue;
        for (size_t j = i + 1; j < n; j++) {
            Enemy& b = *enemies[j];
            if (isBoss(b.kind) || flies(a.kind) != flies(b.kind)) continue;
            float dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
            float minD = (a.radius + b.radius) * 0.9f;
            float d2 = dx * dx + dz * dz;
            if (d2 < minD * minD && d2 > 1e-5f) {
                float d = std::sqrt(d2);
                float push = (minD - d) * 0.5f * std::min(1.f, dt * 12);
                a.pos.x -= dx / d * push; a.pos.z -= dz / d * push;
                b.pos.x += dx / d * push; b.pos.z += dz / d * push;
            }
        }
    }

    auto list = enemies; // bosses spawn helpers while we iterate
    for (auto& ep : list) {
        Enemy& e = *ep;
        if (e.dead) continue;
        e.anim += dt;
        if (e.flash > 0) {
            e.flash -= dt;
            if (e.flash <= 0) e.setFlash(false);
        }
        if (e.spawnT > 0) {
            e.spawnT -= dt;
            float k = 1 - std::max(0.f, e.spawnT) / 0.45f;
            float s = std::max(0.01f, k * k * (3 - 2 * k));
            e.node->scale = V3(s, s, s);
            e.node->position = e.pos;
            e.node->setEuler(V3(0, e.yaw, 0));
            continue;
        }
        if (e.burnT > 0) {
            e.burnT -= dt;
            e.burnFxT -= dt;
            if (e.burnFxT <= 0) {
                e.burnFxT = 0.14f;
                fx->glowPop(e.center() + randUnit() * e.radius * 0.7f, V3(1.0f, 0.45f, 0.1f), 0.6f + e.radius * 0.5f, 1.4f, 0.3f);
            }
            damageEnemy(ep, e.burnDps * dt, e.center(), V3(0, 1, 0), false, true, true);
            if (e.dead) continue;
        }
        e.attackCD -= dt * aggro;
        V2 to(pos.x - e.pos.x, pos.z - e.pos.z);
        float dist = simd_length(to);
        V2 toN = dist > 1e-3f ? to / dist : V2(0, 1);
        V2 tangent(-toN.y, toN.x);
        e.losT -= dt;
        if (e.losT <= 0) {
            e.losT = 0.2f;
            e.sees = level->lineOfSight(flies(e.kind) ? e.pos : e.pos + V3(0, e.height * 0.8f, 0), playerChest);
        }
        e.strafeT -= dt;
        if (e.strafeT <= 0) { e.strafeT = frand(1.5f, 4); e.strafe = -e.strafe; }

        switch (e.kind) {
        case EnemyKind::skitter: {
            bool direct = e.sees && dist < 7;
            V2 dir = direct ? toN : level->nav->direction(e.pos, pos);
            // little zig-zag makes them harder to hit
            V2 zig = direct ? tangent * std::sin(e.anim * 5) * 0.35f : V2(0, 0);
            V2 dn = simd_normalize(dir + zig);
            moveGround(e, dn, dist < 1.2f ? 0 : e.speed, dt);
            faceToward(e, dist < 3 ? toN : dn, dt, 10);
            if (alive && dist < 1.75f && std::fabs(e.pos.y - pos.y) < 2.3f && e.attackCD <= 0) {
                e.attackCD = 0.8f;
                hurtPlayer(9 + wave * 0.3f, e.pos);
                audio->play("melee", 0.8f);
                e.state = 1; e.stateT = 0.2f;
            }
            if (e.stateT > 0) e.stateT -= dt;
            float sp = len2(e.vel);
            for (size_t i = 0; i < e.legs.size(); i++) {
                float ph = e.anim * (6 + sp * 2.2f) + i * 2.1f;
                e.legs[i]->setEuler(V3(std::sin(ph) * 0.12f, std::cos(ph) * 0.45f * std::min(1.f, sp / 2 + 0.2f), std::sin(ph) * 0.18f * (i % 2 == 0 ? 1 : -1)));
            }
            e.model->position = V3(0, std::fabs(std::sin(e.anim * 14)) * 0.03f * sp / 6, e.stateT > 0 ? 0.3f : 0);
            break;
        }
        case EnemyKind::roller: {
            V2 dir = (e.sees && dist < 10) ? toN : level->nav->direction(e.pos, pos);
            V3 desired = V3(dir.x, 0, dir.y) * e.speed;
            e.vel.x += (desired.x - e.vel.x) * std::min(1.f, dt * 2.2f);
            e.vel.z += (desired.z - e.vel.z) * std::min(1.f, dt * 2.2f);
            V3 p(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt);
            V3 before = p;
            level->resolve(p, 0.5f, e.pos.y, 1, 0.55f);
            if (simd_distance(before, p) > 1e-4f) e.vel *= 0.82f;
            float g = level->groundHeight(p.x, p.z, 0.15f, e.pos.y, 0.55f);
            p.y = g > e.pos.y ? std::min(g, e.pos.y + dt * 7) : std::max(g, e.pos.y - dt * 14);
            e.pos = p;
            float sp = len2(e.vel);
            if (sp > 0.2f && !e.spinners.empty()) {
                V3 axis = simd_normalize(simd_cross(V3(0, 1, 0), V3(e.vel.x, 0, e.vel.z)));
                e.spinners[0]->orientation = Quat::angleAxis(sp * dt / 0.55f, axis) * e.spinners[0]->orientation;
            }
            float blinkRate = dist < 8 ? 14.f : 4.f;
            if (auto b = e.model->childNamed("blink")) b->opacity = 0.4f + 0.6f * std::fabs(std::sin(e.anim * blinkRate));
            if (alive && simd_distance(e.center(), playerChest) < 2.4f) {
                killEnemy(ep, false);
                continue;
            }
            break;
        }
        case EnemyKind::drone: {
            V2 want(0, 0);
            if (dist > 15) want = toN; else if (dist < 8) want = -toN; else want = tangent * e.strafe;
            if (!e.sees) want = level->nav->direction(e.pos, pos);
            want = simd_normalize(want + tangent * e.strafe * 0.4f);
            float targetY = pos.y + 3.0f + std::sin(e.anim * 1.3f) * 0.6f;
            V3 desired(want.x * e.speed, (targetY - e.pos.y) * 2.5f, want.y * e.speed);
            e.vel += (desired - e.vel) * std::min(1.f, dt * 2.5f);
            V3 p = e.pos + e.vel * dt;
            level->resolve(p, 0.6f, p.y - 0.5f, 1.0f, 0);
            p.y = std::max(p.y, level->groundHeight(p.x, p.z, 0.6f, p.y + 3, 0) + 1.2f);
            e.pos = p;
            faceToward(e, toN, dt, 6);
            if (!e.spinners.empty()) e.spinners[0]->setEuler(V3(0, e.anim * 5, 0));
            V2 hv(e.vel.x, e.vel.z);
            e.model->setEuler(V3(clampf(simd_dot(hv, toN) * 0.04f, -0.3f, 0.3f), 0, clampf(-simd_dot(hv, tangent) * 0.05f, -0.4f, 0.4f)));
            if (alive && e.sees && e.attackCD <= 0 && dist < 32) {
                e.attackCD = frand(1.5f, 2.4f) * std::max(0.6f, 1 - wave * 0.02f);
                enemyShoot(e, e.muzzles[0], 21, 8, 0.03f);
            }
            break;
        }
        case EnemyKind::trooper: {
            V2 dir;
            float speed = e.speed;
            if (!e.sees || dist > 22) dir = level->nav->direction(e.pos, pos);
            else if (dist < 8) { dir = simd_normalize(-toN + tangent * e.strafe * 0.8f); speed *= 0.8f; }
            else { dir = simd_normalize(tangent * e.strafe + toN * 0.25f); speed *= 0.65f; }
            if (e.burst > 0) speed *= 0.3f;
            moveGround(e, dir, speed, dt);
            faceToward(e, e.sees ? toN : dir, dt, 7);
            if (alive && e.sees && dist < 34) {
                if (e.burst == 0 && e.attackCD <= 0) { e.burst = 3; e.burstT = 0.25f; }
                if (e.burst > 0) {
                    e.burstT -= dt;
                    if (e.burstT <= 0) {
                        e.burstT = 0.15f; e.burst -= 1;
                        enemyShoot(e, e.muzzles[0], 27, 7, 0.035f);
                        if (e.burst == 0) e.attackCD = frand(1.8f, 2.8f) * std::max(0.6f, 1 - wave * 0.02f);
                    }
                }
            } else e.burst = 0;
            float sp = len2(e.vel);
            float ph = e.anim * (3 + sp * 1.6f);
            float amp = std::min(1.f, sp / 2.5f) * 0.65f;
            e.legs[0]->setEuler(V3(std::sin(ph) * amp, 0, 0));
            e.legs[1]->setEuler(V3(std::max(0.f, -std::cos(ph)) * amp * 1.3f, 0, 0));
            e.legs[2]->setEuler(V3(-std::sin(ph) * amp, 0, 0));
            e.legs[3]->setEuler(V3(std::max(0.f, std::cos(ph)) * amp * 1.3f, 0, 0));
            e.model->position = V3(0, std::fabs(std::sin(ph)) * 0.04f * amp, 0);
            break;
        }
        case EnemyKind::brute: {
            bool close = e.sees && dist < 15;
            V2 dir = (e.sees && dist < 9) ? toN : level->nav->direction(e.pos, pos);
            moveGround(e, dir, close ? e.speed * 0.55f : e.speed, dt);
            faceToward(e, e.sees ? toN : dir, dt, 3);
            if (alive && e.sees && dist < 40 && dist > 4.5f && e.attackCD <= 0) {
                e.side = 1 - e.side;
                enemyShoot(e, e.muzzles[e.side], 15, 28, 0.02f, 3.6f, 0.5f);
                e.burst += 1;
                e.attackCD = e.burst % 2 == 0 ? frand(2.6f, 3.4f) : 0.45f;
            }
            if (alive && dist < 3.3f && std::fabs(e.pos.y - pos.y) < 3 && e.stateT <= 0) {
                e.stateT = 1.5f;
                hurtPlayer(26, e.pos);
                vel += V3(toN.x, 0, toN.y) * 11 + V3(0, 4.5f, 0);
                onGround = false;
                fx->spawnFlash(e.pos + V3(toN.x, 0, toN.y) * 1.5f, kindGlow(e.kind));
                fx->shake(0.5f);
                audio->play("melee");
            }
            e.stateT -= dt;
            float sp = len2(e.vel);
            float ph = e.anim * (2 + sp * 1.3f);
            float amp = std::min(1.f, sp / 1.5f) * 0.4f;
            e.legs[0]->setEuler(V3(std::sin(ph) * amp, 0, 0));
            e.legs[1]->setEuler(V3(-std::sin(ph) * amp, 0, 0));
            e.model->position = V3(0, std::fabs(std::cos(ph)) * 0.07f * amp, 0);
            e.model->setEuler(V3(0, 0, std::sin(ph) * 0.04f * amp));
            break;
        }
        case EnemyKind::boss:
            updateBoss(ep, dt, toN, tangent, dist, alive);
            break;
        case EnemyKind::tyrant:
            updateTyrant(ep, dt, toN, dist, alive);
            break;
        }
        e.node->position = e.pos;
        e.node->setEuler(V3(0, e.yaw, 0));
    }
    enemies.erase(std::remove_if(enemies.begin(), enemies.end(), [](const EnemyRef& e) { return e->dead; }), enemies.end());
}

/// eases a joint's Euler angles toward a target (smooth switches between walking, aiming and ranting)
void Game::pose(Node& n, V3 target, float dt, float rate) {
    n.setEuler(n.euler + (target - n.euler) * std::min(1.f, dt * rate));
}

/// Wave-15 boss. States: 0 walk, 1 stomp, 2 hand rockets, 3 eye lasers + fist shaking, 4 call reinforcements.
void Game::updateTyrant(const EnemyRef& ep, float dt, V2 toN, float dist, bool alive) {
    Enemy& e = *ep;
    float rage = e.hp < e.maxHp * 0.4f ? 0.7f : 1;
    const float k = 4.6f;
    float speed = 0;
    V2 dir = toN;
    e.stateT -= dt;
    if (alive && e.stateT <= 0) {
        if (e.state == 0) {
            // pick the next attack: stomp when close, otherwise cycle through ranged attacks
            if (dist < 9) { e.state = 1; e.stateT = 1.6f * rage; }
            else {
                const int cycle[5] = {2, 3, 2, 4, 3};
                e.state = cycle[e.burst % 5]; e.burst += 1;
                e.stateT = e.state == 4 ? 1.2f : 3.0f;
            }
            e.burstT = 0.4f;
            e.side = 0;
        } else {
            e.state = 0; e.stateT = frand(2.0f, 3.2f) * rage;
        }
    }
    if (alive && e.state == 0 && dist < 5.5f) { e.state = 1; e.stateT = 1.6f * rage; e.side = 0; }

    Node &hipL = *e.legs[0], &kneeL = *e.legs[1], &hipR = *e.legs[2], &kneeR = *e.legs[3];
    Node &shL = *e.spinners[0], &elL = *e.spinners[1], &shR = *e.spinners[2], &elR = *e.spinners[3], &head = *e.spinners[4];
    switch (e.state) {
    case 0:
        dir = (e.sees && dist < 12) ? toN : level->nav->direction(e.pos, pos);
        speed = dist > 8 ? e.speed / rage : 0;
        break;
    case 1: { // stomp: lift the right leg, slam it down, shockwave along the floor
        float total = 1.6f * rage;
        float t = total - e.stateT;
        float lift = t < 0.7f * rage ? sstep(0, 0.7f * rage, t) : std::max(0.f, 1 - (t - 0.7f * rage) / 0.12f);
        pose(hipR, V3(-0.9f * lift, 0, 0), dt, 20);
        pose(kneeR, V3(1.1f * lift, 0, 0), dt, 20);
        pose(hipL, V3(0, 0, 0), dt); pose(kneeL, V3(0, 0, 0), dt);
        pose(shL, V3(0, 0, -0.5f), dt); pose(shR, V3(0, 0, 0.5f), dt);
        if (e.side == 0 && t >= 0.7f * rage + 0.1f) {
            e.side = 1;
            V3 foot = e.world(V3(0.11f * k, 0.2f, 0.25f * k));
            fx->explosion(foot, 2.6f, V3(1.0f, 0.45f, 0.12f), 0.85f);
            fx->spawnFlash(V3(foot.x, e.pos.y, foot.z), kindGlow(e.kind));
            audio->play("explosion", foot, pos, yaw, 1);
            float d = simd_length(V2(pos.x - foot.x, pos.z - foot.z));
            // jumping over the shockwave avoids it
            if (alive && d < 9 && onGround && std::fabs(pos.y - e.pos.y) < 0.8f) {
                hurtPlayer(14 + 22 * (1 - d / 9), foot);
                V2 away = d > 0.01f ? V2(pos.x - foot.x, pos.z - foot.z) / d : toN;
                vel += V3(away.x, 0, away.y) * 9 + V3(0, 5, 0);
                onGround = false;
            }
        }
        break;
    }
    case 2: // rockets from both raised hands
        pose(shL, V3(-1.45f, 0, 0), dt); pose(shR, V3(-1.45f, 0, 0), dt);
        pose(elL, V3(0, 0, 0), dt); pose(elR, V3(0, 0, 0), dt);
        speed = dist > 16 ? e.speed * 0.5f : 0;
        e.burstT -= dt;
        if (alive && e.sees && e.burstT <= 0) {
            e.burstT = 0.55f * rage;
            e.side = 1 - e.side;
            enemyShoot(e, e.muzzles[e.side], 16, 24, 0.03f, 3.6f, 0.5f);
        }
        break;
    case 3: // eye lasers while shaking a fist
        pose(shR, V3(-2.5f, 0, 0.25f), dt);
        pose(elR, V3(-0.9f + std::sin(e.anim * 14) * 0.35f, 0, 0), dt, 14);
        pose(shL, V3(-0.3f, 0, -0.15f), dt); pose(elL, V3(-0.5f, 0, 0), dt);
        e.burstT -= dt;
        if (alive && e.sees && e.burstT <= 0) {
            e.burstT = 0.08f * rage;
            e.side = 1 - e.side;
            enemyShoot(e, e.muzzles[2 + e.side], 42, 5, 0.025f);
        }
        break;
    default: // reinforcements
        pose(shR, V3(-2.7f, 0, 0.1f), dt); pose(elR, V3(0, 0, 0), dt);
        if (e.side == 0) {
            e.side = 1;
            if (alive && enemies.size() < 16) {
                for (auto kk : {EnemyKind::trooper, EnemyKind::trooper, EnemyKind::skitter, EnemyKind::skitter}) spawnEnemy(kk);
                hud->feedLine("HITLER ruft Verstärkung", rgbc(1, 0.4f, 0.3f));
                audio->play("wave", 0.8f);
            }
        }
        break;
    }

    // walking: own movement with a wider collision radius than moveGround (the giant should not wade through cover)
    V3 desired = V3(dir.x, 0, dir.y) * speed;
    float kk = std::min(1.f, dt * 4);
    e.vel.x += (desired.x - e.vel.x) * kk;
    e.vel.z += (desired.z - e.vel.z) * kk;
    V3 p(e.pos.x + e.vel.x * dt, e.pos.y, e.pos.z + e.vel.z * dt);
    level->resolve(p, 1.0f, e.pos.y, e.height, 0.55f);
    float g = level->groundHeight(p.x, p.z, 0.3f, e.pos.y, 0.55f);
    p.y = g > e.pos.y ? std::min(g, e.pos.y + dt * 4) : std::max(g, e.pos.y - dt * 10);
    e.pos = p;
    faceToward(e, e.state == 0 && dist > 12 ? dir : toN, dt, 2.2f);

    float sp = len2(e.vel);
    float ph = e.anim * 2.4f;
    float amp = std::min(1.f, sp / 1.5f) * 0.38f;
    if (e.state != 1) {
        pose(hipL, V3(std::sin(ph) * amp, 0, 0), dt, 12);
        pose(kneeL, V3(std::max(0.f, -std::cos(ph)) * amp * 1.3f, 0, 0), dt, 12);
        pose(hipR, V3(-std::sin(ph) * amp, 0, 0), dt, 12);
        pose(kneeR, V3(std::max(0.f, std::cos(ph)) * amp * 1.3f, 0, 0), dt, 12);
    }
    if (e.state == 0) {
        pose(shL, V3(-std::sin(ph) * amp * 0.9f, 0, -0.08f), dt); pose(shR, V3(std::sin(ph) * amp * 0.9f, 0, 0.08f), dt);
        pose(elL, V3(-0.25f, 0, 0), dt); pose(elR, V3(-0.25f, 0, 0), dt);
    }
    e.model->position = V3(0, std::fabs(std::sin(ph)) * 0.18f * amp, 0);
    // head looks down at the player
    float lookDown = std::atan2(e.pos.y + 1.73f * k - (pos.y + eyeY), std::max(dist, 1.f));
    pose(head, V3(clampf(lookDown, -0.2f, 0.6f), 0, 0), dt, 5);
    // footsteps shake the arena
    float s = std::sin(ph) >= 0 ? 1.f : -1.f;
    if (amp > 0.1f && s != e.stepSign) {
        e.stepSign = s;
        if (dist < 25) fx->shake(0.07f * (1 - dist / 25) + 0.02f);
        audio->play("land", e.pos, pos, yaw, 1);
    }
}

void Game::updateBoss(const EnemyRef& ep, float dt, V2 toN, V2 tangent, float dist, bool alive) {
    Enemy& e = *ep;
    // hover around the player at mid range
    V2 want = tangent * e.strafe * 0.7f;
    if (dist > 20) want += toN; else if (dist < 12) want -= toN;
    // hover relative to the player, so a raised platform (Orbital-Dock hub) never puts the camera inside the boss
    float targetY = std::max(5.6f, pos.y + 5.2f) + std::sin(e.anim * 0.8f) * 0.7f;
    V3 desired(want.x * e.speed, (targetY - e.pos.y) * 2, want.y * e.speed);
    e.vel += (desired - e.vel) * std::min(1.f, dt * 1.5f);
    V3 p = e.pos + e.vel * dt;
    level->resolve(p, 2.4f, p.y - 2, 4, 0);
    // never closer than 4.5 m horizontally while its body overlaps the player's height
    V2 off(p.x - pos.x, p.z - pos.z);
    float hd = simd_length(off);
    if (hd < 4.5f && p.y - 2.3f < pos.y + 2.2f) {
        V2 nn = hd > 1e-3f ? off / hd : V2(1, 0);
        p.x = pos.x + nn.x * 4.5f; p.z = pos.z + nn.y * 4.5f;
    }
    e.pos = p;
    faceToward(e, toN, dt, 2.5f);
    for (size_t i = 0; i < e.spinners.size(); i++)
        e.spinners[i]->setEuler(V3(i * 0.5f + 0.2f + e.anim * (0.5f + i * 0.25f), e.anim * (i % 2 == 0 ? 0.9f : -0.7f), i * 0.4f));
    if (!alive) return;
    float rage = e.hp < e.maxHp * 0.4f ? 0.7f : 1;
    e.stateT -= dt;
    if (e.stateT <= 0) {
        e.state = (e.state + 1) % 4;
        const float durs[4] = {3.2f, 1.6f, 3.0f, 1.8f};
        e.stateT = durs[e.state];
        e.burst = 0;
        e.burstT = 0.5f;
        if (e.state == 3 && enemies.size() < 14) {
            for (int i = 0; i < 2 + bossCount; i++) spawnEnemy(EnemyKind::drone, e.pos + randUnit() * 3 + V3(0, 1, 0));
            hud->feedLine("OVERSEER setzt Drohnen ab", rgbc(1, 0.4f, 0.3f));
        }
    }
    e.burstT -= dt;
    switch (e.state) {
    case 0: // aimed volleys
        if (e.burstT <= 0 && e.sees) {
            e.burstT = 0.2f * rage;
            e.side = (e.side + 1) % 3;
            enemyShoot(e, e.muzzles[e.side], 26, 9, 0.04f);
        }
        break;
    case 1: // ground nova: ring of bolts that must be jumped or dodged through the gaps
        if (e.burst == 0 && e.burstT <= 0) {
            e.burst = 1;
            V3 c(e.pos.x, 1.0f, e.pos.z);
            fx->spawnFlash(V3(e.pos.x, 0, e.pos.z), kindGlow(e.kind));
            fx->tracer(e.pos - V3(0, 2.5f, 0), V3(e.pos.x, 0.1f, e.pos.z), kindGlow(e.kind), 0.5f, 0.4f, 2);
            audio->play("rail", c, pos, yaw, 0.8f);
            const int count = 30;
            int gap = irand(0, count);
            for (int k = 0; k < count; k++) {
                if ((k + gap) % 10 < 2) continue;
                float a = (float)k / count * 2 * PI;
                spawnProjectile(c + V3(std::sin(a), 0, std::cos(a)) * 2.5f, V3(std::sin(a), 0, std::cos(a)) * 12, 14, 0, false, 4.5f, 0.16f, kindGlow(e.kind), 0, false);
            }
        }
        break;
    case 2: // rockets
        if (e.burstT <= 0 && e.sees) {
            e.burstT = 0.75f * rage;
            e.side = (e.side + 1) % 3;
            enemyShoot(e, e.muzzles[1 + e.side % 2], 17, 26, 0.03f, 3.8f, 0.5f);
        }
        break;
    default:
        break;
    }
}
