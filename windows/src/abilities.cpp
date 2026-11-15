// The active ability on E (chosen in the Labor): Splittergranate, Geschützturm, Zeitlupe, Kraftfeld.
// Port of Abilities.swift.
#include "game.h"
#include "textures.h"

void Game::updateAbility(float dt, const InputFrame& inp) {
    abilityCD = std::max(0.f, abilityCD - dt);
    if (inp.hit(Key::e)) {
        if (abilityCD <= 0) useAbility();
        else audio->play("empty", 0.6f);
    }
    if (slowT > 0) {
        slowT -= dt;
        if (slowT <= 0) {
            slowT = 0;
            audio->play("dash", 0.7f);
        }
    }
    // Zeitlupe drains the colour out of the world
    float sat = slowT > 0 ? 0.3f : 1.12f;
    if (std::fabs(camera.saturation - sat) > 0.01f) camera.saturation += (sat - camera.saturation) * std::min(1.f, dt * 6);
}

void Game::useAbility() {
    AbilityID a = meta.ability;
    abilityCD = abilityCooldown();
    V3 c = abilityColor(a);
    switch (a) {
    case AbilityID::grenade: {
        float k = 1 + 0.4f * perk(PerkID::abilityPower);
        V3 d = viewDir();
        V3 start = eye() + d * 0.7f - rightV() * 0.18f - V3(0, 0.12f, 0);
        auto g = spawnProjectile(start, d * 24 + V3(0, 4.5f, 0) + V3(vel.x, 0, vel.z) * 0.5f, 150 * damageMul() * k, 6 * std::sqrt(k), true, 4, 0.16f, c, 18, true);
        g->sub = true;
        g->selfDamage = 0;
        audio->play("launcher", 0.6f);
        kickRot = std::min(0.3f, kickRot + 0.12f);
        break;
    }
    case AbilityID::turret:
        placeTurret();
        break;
    case AbilityID::slowmo:
        slowT = 5 * abilityPower();
        hud->flash(UIColor::of(c), 0.3f, 0.6f);
        hud->announce("ZEITLUPE", "", UIColor::of(c), 0.6f);
        audio->play("power", 0.8f);
        break;
    case AbilityID::barrier:
        raiseBarrier();
        break;
    }
}

// MARK: Geschützturm

void Game::placeTurret() {
    V3 p = pos + fwd() * 1.8f;
    p.y = level->groundHeight(p.x, p.z, 0.3f, pos.y + 0.6f);
    level->resolve(p, 0.45f, p.y, 1.3f);
    // at most two at once: the oldest makes room
    if (turrets.size() >= 2) {
        auto old = turrets.front();
        turrets.erase(turrets.begin());
        fx->explosion(old->pos + V3(0, 0.8f, 0), 1.4f, abilityColor(AbilityID::turret), 0.05f);
        old->node->removeFromParent();
    }
    auto t = buildTurret(p, yaw + PI);
    scene.root->add(t->node);
    turrets.push_back(t);
    fx->spawnFlash(p, abilityColor(AbilityID::turret));
    audio->play("spawn", p, pos, yaw, 1);
}

TurretRef Game::buildTurret(V3 p, float facing) {
    V3 c = abilityColor(AbilityID::turret);
    auto dark = Mat::metal(V3(0.12f, 0.125f, 0.14f), 0.32f, 1, 2);
    auto steel = Mat::metal(V3(0.4f, 0.42f, 0.46f), 0.25f, 1, 2);
    auto glow = Mat::glow(c, 5);
    using Geo::part;
    auto root = Node::make();
    // tripod with the feet spread outward
    for (int k = 0; k < 3; k++) {
        float a = k / 3.f * 2 * PI;
        part(root, Geo::box(0.07f, 0.8f, 0.07f, 0.01f), dark, V3(std::sin(a) * 0.3f, 0.36f, std::cos(a) * 0.3f), V3(-0.45f * std::cos(a), 0, 0.45f * std::sin(a)));
        part(root, Geo::box(0.1f, 0.04f, 0.1f), glow, V3(std::sin(a) * 0.46f, 0.02f, std::cos(a) * 0.46f), V3(), false);
    }
    part(root, Geo::cyl(0.17f, 0.22f, 18), dark, V3(0, 0.74f, 0));
    part(root, Geo::torus(0.18f, 0.02f), glow, V3(0, 0.83f, 0), V3(), false);
    auto yawNode = Node::make();
    yawNode->position = V3(0, Turret::gunY, 0);
    root->add(yawNode);
    auto pitchNode = Node::make();
    yawNode->add(pitchNode);
    part(pitchNode, Geo::box(0.34f, 0.24f, 0.46f, 0.04f), dark, V3(0, 0, 0));
    part(pitchNode, Geo::box(0.36f, 0.04f, 0.3f), glow, V3(0, 0.07f, -0.02f), V3(), false);
    for (float sx : {-0.08f, 0.08f}) {
        part(pitchNode, Geo::cyl(0.035f, 0.5f, 12), steel, V3(sx, -0.02f, 0.44f), V3(PI / 2, 0, 0));
        part(pitchNode, Geo::cyl(0.028f, 0.01f, 12), glow, V3(sx, -0.02f, 0.69f), V3(PI / 2, 0, 0), false);
    }
    part(pitchNode, Geo::sphere(0.05f, 10), glow, V3(0, 0.1f, 0.2f), V3(), false);
    auto halo = Geo::glowSprite(1.4f, c, 0.45f);
    halo->position = V3(0, Turret::gunY, 0);
    root->add(halo);
    root->position = p;
    root->scale = V3(0.01f, 0.01f, 0.01f);
    auto t = std::make_shared<Turret>();
    t->node = root; t->yawNode = yawNode; t->pitchNode = pitchNode; t->pos = p;
    t->life = 14 * abilityPower();
    t->yaw = facing;
    return t;
}

void Game::updateTurrets(float dt) {
    if (turrets.empty()) return;
    V3 c = abilityColor(AbilityID::turret);
    float rate = 1 + 0.3f * perk(PerkID::abilityPower);
    size_t i = 0;
    while (i < turrets.size()) {
        auto t = turrets[i];
        t->life -= dt;
        t->age += dt;
        if (t->life <= 0) {
            fx->explosion(t->pos + V3(0, 0.8f, 0), 1.6f, c, 0.08f);
            audio->play("enemyDie", t->pos, pos, yaw, 0.7f);
            t->node->removeFromParent();
            turrets.erase(turrets.begin() + i);
            continue;
        }
        float k = std::min(1.f, t->age / 0.3f);
        float s = std::max(0.01f, k * k * (3 - 2 * k));
        t->node->scale = V3(s, s, s);
        // blink in the last two seconds
        t->node->opacity = t->life < 2 ? 0.55f + 0.45f * std::fabs(std::sin(t->life * 9)) : 1;
        V3 gun = t->pos + V3(0, Turret::gunY, 0);
        t->scanT -= dt;
        if (t->scanT <= 0) {
            t->scanT = 0.25f;
            t->target.reset();
            float bd = 34;
            for (auto& e : enemies) {
                if (e->dead || e->spawnT > 0) continue;
                float d = simd_distance(e->center(), gun);
                if (d < bd && level->lineOfSight(gun, e->center())) { bd = d; t->target = e; }
            }
        }
        t->fireT -= dt;
        auto e = t->target.lock();
        if (e && !e->dead) {
            V3 to = e->center() - gun;
            float wantYaw = std::atan2(to.x, to.z);
            float wantPitch = -std::atan2(to.y, std::max(len2(to), 0.1f));
            t->yaw += wrapAngle(wantYaw - t->yaw) * std::min(1.f, dt * 12);
            t->pitch += (wantPitch - t->pitch) * std::min(1.f, dt * 12);
            if (t->fireT <= 0 && std::fabs(wrapAngle(wantYaw - t->yaw)) < 0.25f && k >= 1) {
                t->fireT = 0.16f / rate;
                turretShot(*t, e, c);
            }
        } else {
            t->yaw += dt * 0.9f;
            t->pitch += (0 - t->pitch) * std::min(1.f, dt * 4);
        }
        t->yawNode->setEuler(V3(0, t->yaw, 0));
        t->pitchNode->setEuler(V3(t->pitch, 0, 0));
        i++;
    }
}

void Game::turretShot(Turret& t, const EnemyRef& e, V3 c) {
    V3 gun = t.pos + V3(0, Turret::gunY, 0);
    V3 f(std::sin(t.yaw) * std::cos(t.pitch), -std::sin(t.pitch), std::cos(t.yaw) * std::cos(t.pitch));
    V3 muzzle = gun + f * 0.66f;
    V3 d = safeNorm(e->center() + randUnit() * 0.25f - muzzle);
    // the first thing along the line takes the hit
    auto wall = level->raycast(muzzle, d, 40);
    float bt = wall ? wall->t : 40;
    EnemyRef hitE;
    bool crit = false;
    for (auto& x : enemies) {
        if (x->dead) continue;
        if (auto h = x->rayHit(muzzle, d, bt)) { bt = h->t; hitE = x; crit = h->crit; }
    }
    V3 end = muzzle + d * bt;
    fx->tracer(muzzle, end, c, 0.02f, 0.06f, 2.4f);
    fx->glowPop(muzzle, c, 0.6f, 1.6f, 0.06f);
    if (hitE) {
        fx->hitSparks(end, d, kindGlow(hitE->kind), crit);
        damageEnemy(hitE, 9 * damageMul() * (crit ? 2 : 1), end, d, crit, true);
    } else if (wall) {
        fx->impact(end, wall->n, c);
    }
    audio->play("rifle", muzzle, pos, yaw, 0.32f);
}

// MARK: Kraftfeld

void Game::raiseBarrier() {
    V3 c = abilityColor(AbilityID::barrier);
    float r = 4.5f * (1 + 0.25f * perk(PerkID::abilityPower));
    if (barrier) barrier->node->removeFromParent();
    auto n = Node::make();
    auto dn = Node::make(Geo::sphere(r, 48), Mat::additive(Tex::hex(), c, 0.42f));
    dn->castsShadow = false;
    dn->renderingOrder = 40;
    n->add(dn);
    auto rn = Node::make(Geo::plane(r * 2.3f, r * 2.3f), Mat::additive(Tex::ring(), c, 1.2f));
    rn->setEuler(V3(-PI / 2, 0, 0));
    rn->position = V3(0, 0.05f, 0);
    rn->castsShadow = false;
    n->add(rn);
    V3 p = pos;
    n->position = p;
    n->scale = V3(0.01f, 0.01f, 0.01f);
    scene.root->add(n);
    barrier = std::make_unique<Barrier>();
    barrier->node = n; barrier->pos = p; barrier->radius = r; barrier->life = 6 * abilityPower();
    fx->spawnFlash(p, c);
    hud->flash(UIColor::of(c), 0.2f, 0.4f);
    audio->play("power", 0.7f);
}

void Game::updateBarrier(float dt) {
    if (!barrier) return;
    Barrier& b = *barrier;
    b.t += dt;
    if (b.t >= b.life) {
        b.node->removeFromParent();
        barrier.reset();
        audio->play("shieldHit", 0.6f);
        return;
    }
    float grow = std::min(1.f, b.t / 0.25f);
    float s = std::max(0.01f, grow * grow * (3 - 2 * grow));
    b.node->scale = V3(s, s, s);
    float left = b.life - b.t;
    // gentle shimmer, flickers before it collapses
    float flicker = left < 1.2f ? 0.5f + 0.5f * std::fabs(std::sin(left * 14)) : 1;
    b.node->opacity = (0.8f + 0.2f * std::sin(b.t * 5)) * flicker;
}

// MARK: shared

/// takes down everything the ability left in the world (new run, back to the menu)
void Game::resetAbilityEffects() {
    for (auto& t : turrets) t->node->removeFromParent();
    turrets.clear();
    if (barrier) barrier->node->removeFromParent();
    barrier.reset();
    slowT = 0;
    camera.saturation = 1.12f;
}

void Game::updateAbilityHUD() {
    AbilityID a = meta.ability;
    float maxCD = std::max(abilityCooldown(), 0.01f);
    auto secs = [](float v) { return std::to_string((int)std::ceil(v)); };
    std::string status = abilityCD <= 0 ? "BEREIT" : secs(abilityCD) + " s";
    if (a == AbilityID::slowmo && slowT > 0) status = "AKTIV  " + secs(slowT) + " s";
    if (a == AbilityID::barrier && barrier) status = "AKTIV  " + secs(barrier->life - barrier->t) + " s";
    if (a == AbilityID::turret && !turrets.empty() && abilityCD > 0) status = "TURM " + secs(turrets.back()->life) + " s  ·  " + secs(abilityCD) + " s";
    hud->setAbility(abilityName(a), 1 - abilityCD / maxCD, status, abilityColor(a));
}
