#include "effects.h"
#include "textures.h"
#include "level.h"
#include <cstdio>

Effects::Effects(Scene& s) : scene(s) {
    scene.root->add(root);
    for (int i = 0; i < 3; i++) {
        auto n = Node::make();
        auto l = std::make_shared<Light>();
        l->type = LightType::Omni;
        l->intensity = 0;
        l->attenuationStart = 0.5f;
        l->attenuationEnd = 16;
        l->falloffExponent = 2;
        l->categoryBitMask = 1;
        n->light = l;
        root->add(n);
        lights.push_back({n, 1, 1, 0});
    }

    sparks.image = Tex::softDot();
    sparks.loops = false;
    sparks.emissionDuration = 0.03f;
    sparks.birthRate = 16;
    sparks.lifeSpan = 0.32f;
    sparks.lifeSpanVar = 0.2f;
    sparks.velocity = 7;
    sparks.velocityVar = 5;
    sparks.emittingDirection = V3(0, 1, 0);
    sparks.spreadingAngle = 55;
    sparks.size = 0.035f;
    sparks.sizeVar = 0.02f;
    sparks.stretch = 0.06f;
    sparks.gravity = true;
    sparks.blend = Blend::Add;
    sparks.color = V4(1.0f, 0.8f, 0.4f, 1);
    sparks.opacity = curve({1, 1, 0}, {0, 0.6f, 1});

    fire.image = Tex::glow();
    fire.loops = false;
    fire.emissionDuration = 0.06f;
    fire.birthRate = 34;
    fire.lifeSpan = 0.5f;
    fire.lifeSpanVar = 0.25f;
    fire.velocity = 3.5f;
    fire.velocityVar = 3;
    fire.spreadingAngle = 180;
    fire.size = 1.0f;
    fire.sizeVar = 0.6f;
    fire.blend = Blend::Add;
    fire.color = V4(1.0f, 0.55f, 0.18f, 1);
    fire.colorVar = V4(0.04f, 0.1f, 0.1f, 0);
    fire.damping = 2.5f;
    fire.opacity = curve({0.9f, 0.7f, 0}, {0, 0.35f, 1});
    fire.sizeCurve = curve({0.5f, 1.5f, 2.0f}, {0, 0.4f, 1});

    smoke.image = Tex::smoke();
    smoke.loops = false;
    smoke.emissionDuration = 0.1f;
    smoke.birthRate = 14;
    smoke.lifeSpan = 1.6f;
    smoke.lifeSpanVar = 0.6f;
    smoke.velocity = 1.6f;
    smoke.velocityVar = 1.2f;
    smoke.spreadingAngle = 180;
    smoke.size = 1.3f;
    smoke.sizeVar = 0.6f;
    smoke.angleVar = 180;
    smoke.angVelVar = 40;
    smoke.acceleration = V3(0, 0.9f, 0);
    smoke.damping = 1.2f;
    smoke.blend = Blend::Alpha;
    smoke.color = V4(0.12f, 0.13f, 0.15f, 0.7f);
    smoke.opacity = curve({0, 0.6f, 0}, {0, 0.2f, 1});
    smoke.sizeCurve = curve({0.8f, 2.2f, 3.2f}, {0, 0.5f, 1});

    embers.image = Tex::softDot();
    embers.loops = false;
    embers.emissionDuration = 0.05f;
    embers.birthRate = 60;
    embers.lifeSpan = 0.9f;
    embers.lifeSpanVar = 0.5f;
    embers.velocity = 12;
    embers.velocityVar = 8;
    embers.spreadingAngle = 180;
    embers.size = 0.05f;
    embers.sizeVar = 0.03f;
    embers.stretch = 0.05f;
    embers.gravity = true;
    embers.damping = 0.8f;
    embers.blend = Blend::Add;
    embers.color = V4(1.0f, 0.7f, 0.3f, 1);
    embers.opacity = curve({1, 1, 0}, {0, 0.5f, 1});

    shards.image = Tex::softDot();
    shards.loops = false;
    shards.emissionDuration = 0.05f;
    shards.birthRate = 40;
    shards.lifeSpan = 0.55f;
    shards.lifeSpanVar = 0.3f;
    shards.velocity = 5;
    shards.velocityVar = 4;
    shards.spreadingAngle = 180;
    shards.size = 0.09f;
    shards.sizeVar = 0.06f;
    shards.damping = 3;
    shards.blend = Blend::Add;
    shards.opacity = curve({1, 0.8f, 0}, {0, 0.5f, 1});
}

void Effects::update(float dt) {
    trauma = std::max(0.f, trauma - dt * 1.6f);
    for (auto& l : lights) {
        if (l.t >= l.dur) continue;
        l.t += dt;
        float k = std::max(0.f, 1 - l.t / l.dur);
        l.node->light->intensity = l.peak * k * k;
    }
    // debris: gravity, bounces on the floor, tumbling
    V3 g = scene.gravity;
    for (size_t i = 0; i < chunks.size();) {
        Chunk& c = chunks[i];
        if (!c.node->parent) { chunks[i] = chunks.back(); chunks.pop_back(); continue; }
        c.vel += g * dt;
        V3 p = c.node->position + c.vel * dt;
        bool overFloor = std::fabs(p.x) <= floorExtent && std::fabs(p.z) <= floorExtent;
        if (overFloor && p.y - c.half < 0) {
            p.y = c.half;
            if (c.vel.y < 0) c.vel.y = -c.vel.y * 0.35f;
            if (c.vel.y < 0.5f) c.vel.y = 0;
            c.vel.x *= std::max(0.f, 1 - 6 * dt);
            c.vel.z *= std::max(0.f, 1 - 6 * dt);
            c.spin *= std::max(0.f, 1 - 5 * dt);
        }
        c.node->position = p;
        if (c.spin > 0.01f) c.node->orientation = Quat::angleAxis(c.spin * dt, c.axis) * c.node->orientation;
        i++;
    }
}

void Effects::flash(V3 p, V3 c, float intensity, float duration, float range) {
    lightIdx = (lightIdx + 1) % (int)lights.size();
    auto& l = lights[lightIdx];
    l.node->position = p;
    l.node->light->color = c;
    l.node->light->intensity = intensity;
    l.node->light->attenuationEnd = range;
    l.t = 0; l.dur = duration; l.peak = intensity;
}

MatRef Effects::beamMat(V3 c, float intensity, bool glow) {
    char key[96];
    snprintf(key, sizeof key, "%g,%g,%g,%g,%d", c.x, c.y, c.z, intensity, glow ? 1 : 0);
    auto it = beamMats.find(key);
    if (it != beamMats.end()) return it->second;
    auto m = Mat::additive(glow ? Tex::glow() : nullptr, c, intensity);
    beamMats[key] = m;
    return m;
}

void Effects::tracer(V3 a, V3 b, V3 c, float width, float life, float intensity) {
    V3 v = b - a;
    float l = simd_length(v);
    if (l < 0.05f) return;
    auto n = Node::make(Geo::box(1, 1, 1), beamMat(c, intensity));
    n->position = (a + b) * 0.5f;
    orientZ(*n, v / l);
    n->scale = V3(width, width, l);
    n->castsShadow = false;
    root->add(n);
    n->runAction(Act::sequence({Act::fadeOut(life), Act::removeFromParent()}));
}

void Effects::railBeam(V3 a, V3 b, V3 c) {
    tracer(a, b, V3(1, 1, 1), 0.035f, 0.35f, 4);
    tracer(a, b, c, 0.085f, 0.5f, 2.0f);
    V3 v = b - a;
    float l = simd_length(v);
    int steps = std::min((int)(l / 2.2f), 26);
    for (int i = 1; i <= steps; i++) {
        V3 p = a + v * ((float)i / (steps + 1));
        auto r = Geo::glowSprite(0.7f, c, 1.6f, Tex::ring());
        r->billboard = false;
        orientZ(*r, v / l);
        r->position = p;
        root->add(r);
        r->runAction(Act::sequence({Act::wait(i * 0.008f), Act::group({Act::scaleTo(2.4f, 0.5f, Timing::EaseOut), Act::fadeOut(0.5f)}), Act::removeFromParent()}));
    }
}

void Effects::glowPop(V3 p, V3 c, float size, float intensity, float life, TexRef image) {
    auto s = Geo::glowSprite(size, c, intensity, image);
    s->position = p;
    root->add(s);
    s->runAction(Act::sequence({Act::group({Act::scaleTo(1.8f, life, Timing::EaseOut), Act::fadeOut(life)}), Act::removeFromParent()}));
}

void Effects::impact(V3 p, V3 n, V3 c, bool big) {
    ParticleSystem s = sparks;
    V3 sc = mix3(c, V3(1, 0.85f, 0.6f), 0.5f);
    s.color = V4(sc, 1);
    if (big) { s.birthRate = 40; s.velocity = 10; }
    scene.addParticleSystem(s, transformY(n, p + n * 0.03f));
    glowPop(p + n * 0.06f, c, big ? 1.4f : 0.55f, 1.6f, 0.12f);
    // glowing scorch that cools down
    float ds = big ? 0.9f : 0.32f;
    auto dn = Node::make(Geo::plane(ds, ds), beamMat(mix3(c, V3(1.0f, 0.45f, 0.1f), 0.6f), 1.2f, true));
    dn->position = p + n * 0.012f;
    orientZ(*dn, n);
    dn->castsShadow = false;
    root->add(dn);
    dn->runAction(Act::sequence({Act::fadeOut(big ? 2.2f : 1.2f), Act::removeFromParent()}));
}

void Effects::hitSparks(V3 p, V3 dir, V3 c, bool crit) {
    ParticleSystem s = shards;
    s.color = V4(crit ? V3(1, 0.9f, 0.5f) : c, 1);
    s.birthRate = crit ? 22.f : 9.f;
    scene.addParticleSystem(s, transformY(-dir, p));
    if (crit) glowPop(p, V3(1, 0.9f, 0.6f), 0.8f, 1.5f, 0.12f);
}

void Effects::explosion(V3 p, float radius, V3 c, float shakeAmount) {
    M4 m = M4::translate(p);
    ParticleSystem f = fire;
    f.color = V4(c, 1);
    f.size = radius * 0.38f;
    f.velocity = radius * 1.3f;
    scene.addParticleSystem(f, m);
    ParticleSystem e = embers;
    e.color = V4(mix3(c, V3(1, 0.9f, 0.7f), 0.4f), 1);
    e.velocity = 6 + radius * 2.4f;
    scene.addParticleSystem(e, m);
    ParticleSystem s = smoke;
    s.size = radius * 0.45f;
    scene.addParticleSystem(s, m);
    glowPop(p, mix3(c, V3(1, 1, 1), 0.5f), radius * 2.4f, 2.2f, 0.22f);
    // ground shockwave
    auto rn = Node::make(Geo::plane(1, 1), Mat::additive(Tex::ring(), c, 1.6f));
    rn->setEuler(V3(-PI / 2, 0, 0));
    rn->position = V3(p.x, std::max(p.y - radius * 0.3f, 0.06f), p.z);
    rn->castsShadow = false;
    rn->renderingOrder = 30;
    root->add(rn);
    rn->runAction(Act::sequence({Act::group({Act::scaleTo(radius * 3.4f, 0.45f, Timing::EaseOut), Act::fadeOut(0.45f)}), Act::removeFromParent()}));
    flash(p + V3(0, 0.6f, 0), c, std::min(1600 * radius, 7000.f), 0.45f, 8 + radius * 4);
    shake(shakeAmount);
}

void Effects::debris(V3 p, int count, MatRef material, float size, float force) {
    if (chunks.size() > 70) return;
    for (int i = 0; i < count; i++) {
        float s = size * frand(0.5f, 1.3f);
        auto n = Node::make(Geo::box(s, s * frand(0.4f, 1), s * frand(0.5f, 1.2f), s * 0.1f), material);
        n->position = p + randUnit() * size;
        V3 v = randUnit() * force * frand(0.4f, 1);
        v.y = std::fabs(v.y) * 0.8f + force * 0.35f;
        root->add(n);
        chunks.push_back({n, v, randUnit(), frand(4, 14), s * 0.4f});
        n->runAction(Act::sequence({Act::wait(frand(1.8f, 3.0f)), Act::scaleTo(0.01f, 0.35f), Act::removeFromParent()}));
    }
}

void Effects::spawnFlash(V3 p, V3 c) {
    glowPop(p + V3(0, 1, 0), c, 3.5f, 1.6f, 0.35f);
    auto rn = Node::make(Geo::plane(1, 1), Mat::additive(Tex::ring(), c, 1.4f));
    rn->setEuler(V3(-PI / 2, 0, 0));
    rn->position = V3(p.x, p.y + 0.06f, p.z);
    rn->scale = V3(4, 4, 4);
    rn->castsShadow = false;
    root->add(rn);
    rn->runAction(Act::sequence({Act::group({Act::scaleTo(0.3f, 0.35f), Act::fadeOut(0.4f)}), Act::removeFromParent()}));
}

void Effects::clear() {
    auto copy = root->children;
    for (auto& c : copy)
        if (!c->light) { c->removeAllActions(); c->removeFromParent(); }
    chunks.clear();
    // one-shot bursts (attached emitters belong to the level)
    auto& em = scene.emitters;
    for (size_t i = 0; i < em.size();) {
        if (!em[i]->attached) { em[i] = em.back(); em.pop_back(); continue; }
        i++;
    }
}
