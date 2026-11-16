#include "enemies.h"
#include "textures.h"

const char* displayName(EnemyKind k) {
    static const char* n[] = {"SKITTER", "DROHNE", "TROOPER", "ROLLMINE", "KOLOSS", "OVERSEER", "HITLER"};
    return n[(int)k];
}
float kindHp(EnemyKind k) { static const float v[] = {38, 30, 95, 45, 420, 2600, 4000}; return v[(int)k]; }
float kindSpeed(EnemyKind k) { static const float v[] = {6.6f, 6.0f, 3.6f, 8.6f, 2.3f, 3.0f, 1.9f}; return v[(int)k]; }
float kindRadius(EnemyKind k) { static const float v[] = {0.6f, 0.6f, 0.45f, 0.6f, 1.0f, 2.3f, 2.2f}; return v[(int)k]; }
float kindHeight(EnemyKind k) { static const float v[] = {0.9f, 1.0f, 1.95f, 1.1f, 3.1f, 4.0f, 8.5f}; return v[(int)k]; }
int kindScore(EnemyKind k) { static const int v[] = {50, 75, 150, 100, 500, 5000, 15000}; return v[(int)k]; }
float kindCost(EnemyKind k) { static const float v[] = {1, 1.5f, 3, 2, 9, 0, 0}; return v[(int)k]; }
V3 kindGlow(EnemyKind k) {
    switch (k) {
    case EnemyKind::skitter: return V3(1.0f, 0.2f, 0.1f);
    case EnemyKind::drone: return V3(1.0f, 0.55f, 0.1f);
    case EnemyKind::trooper: return V3(1.0f, 0.15f, 0.4f);
    case EnemyKind::roller: return V3(1.0f, 0.8f, 0.1f);
    case EnemyKind::brute: return V3(1.0f, 0.32f, 0.05f);
    case EnemyKind::boss: return V3(1.0f, 0.1f, 0.18f);
    case EnemyKind::tyrant: return V3(1.0f, 0.12f, 0.08f);
    }
    return V3(1, 1, 1);
}

Enemy::Enemy(EnemyKind k, V3 p, float hpScale) : kind(k), pos(p) {
    maxHp = kindHp(k) * hpScale;
    hp = maxHp;
    radius = kindRadius(k);
    height = kindHeight(k);
    speed = kindSpeed(k) * frand(0.92f, 1.08f);
    debrisMat = Mat::metal(V3(0.16f, 0.16f, 0.18f), 0.4f);
    node->add(model);
    build();
    node->position = p;
    node->scale = V3(0.01f, 0.01f, 0.01f);
}

MatRef Enemy::armorMat(V3 c, float rough) {
    auto m = Mat::metal(c, rough, 1, 1);
    m->normalIntensity = 0.45f;
    armor.push_back(m);
    return m;
}

/// fabric / skin / leather material that still takes the white hit flash
MatRef Enemy::cloth(V3 c, float rough, float metal) {
    auto m = Mat::metal(c, rough, metal, 0);
    armor.push_back(m);
    return m;
}

void Enemy::build() {
    auto dark = armorMat(V3(0.075f, 0.078f, 0.09f), 0.3f);
    V3 glowC = kindGlow(kind);
    auto glow = Mat::glow(glowC, 5);
    using Geo::part;
    switch (kind) {
    case EnemyKind::skitter: {
        auto paint = armorMat(V3(0.20f, 0.035f, 0.03f), 0.34f);
        part(model, Geo::sphere(0.5f, 20), paint, V3(0, 0.48f, 0))->scale = V3(0.95f, 0.5f, 1.3f);
        part(model, Geo::sphere(0.3f, 16), dark, V3(0, 0.46f, 0.6f))->scale = V3(1, 0.7f, 1);
        part(model, Geo::box(0.36f, 0.07f, 0.1f), glow, V3(0, 0.5f, 0.86f), V3(), false);
        part(model, Geo::box(0.06f, 0.05f, 0.9f), glow, V3(0, 0.74f, -0.05f), V3(), false);
        part(model, Geo::pyramid(0.16f, 0.5f, 0.16f), dark, V3(0.14f, 0.4f, 0.82f), V3(PI / 2, 0, 0));
        part(model, Geo::pyramid(0.16f, 0.5f, 0.16f), dark, V3(-0.14f, 0.4f, 0.82f), V3(PI / 2, 0, 0));
        float zs[3] = {0.4f, 0.0f, -0.4f};
        for (int i = 0; i < 3; i++)
            for (float sd : {-1.f, 1.f}) {
                auto pivot = Node::make();
                pivot->position = V3(sd * 0.36f, 0.5f, zs[i]);
                model->add(pivot);
                part(pivot, Geo::box(0.55f, 0.08f, 0.09f), dark, V3(sd * 0.25f, 0.14f, 0), V3(0, 0, sd * 0.55f));
                part(pivot, Geo::box(0.07f, 0.72f, 0.07f), dark, V3(sd * 0.56f, -0.1f, 0), V3(0, 0, sd * 0.22f));
                pivot->name = std::to_string(i);
                legs.push_back(pivot);
            }
        hits = {{V3(0, 0.5f, 0), 0.68f, false}};
        auto g = Geo::glowSprite(1.6f, glowC, 0.35f); g->position = V3(0, 0.5f, 0.5f); model->add(g);
        break;
    }
    case EnemyKind::drone: {
        auto paint = armorMat(V3(0.24f, 0.13f, 0.03f), 0.32f);
        part(model, Geo::sphere(0.42f), dark, V3(0, 0, 0));
        part(model, Geo::sphere(0.17f, 16), glow, V3(0, 0.02f, 0.33f), V3(), false);
        auto ringHolder = Node::make(); model->add(ringHolder);
        part(ringHolder, Geo::torus(0.68f, 0.055f), paint, V3(0, 0, 0));
        for (int a = 0; a < 3; a++) {
            float ang = a / 3.f * 2 * PI;
            part(ringHolder, Geo::box(0.12f, 0.05f, 0.32f), glow, V3(std::sin(ang) * 0.68f, 0, std::cos(ang) * 0.68f), V3(0, ang, 0), false);
        }
        spinners.push_back(ringHolder);
        for (float sd : {-1.f, 1.f}) {
            part(model, Geo::box(0.16f, 0.16f, 0.6f, 0.04f), paint, V3(sd * 0.52f, -0.05f, -0.05f));
            part(model, Geo::cyl(0.05f, 0.06f, 10), Mat::glow(V3(0.3f, 0.8f, 1), 5), V3(sd * 0.52f, -0.05f, -0.37f), V3(PI / 2, 0, 0), false);
        }
        part(model, Geo::cyl(0.05f, 0.45f, 10), dark, V3(0, -0.3f, 0.3f), V3(PI / 2, 0, 0));
        auto g = Geo::glowSprite(1.5f, glowC, 0.4f); g->position = V3(0, 0, 0.35f); model->add(g);
        hits = {{V3(0, 0, 0), 0.7f, false}};
        muzzles = {V3(0, -0.3f, 0.55f)};
        break;
    }
    case EnemyKind::trooper: {
        auto paint = armorMat(V3(0.17f, 0.03f, 0.07f), 0.32f);
        for (float sd : {-1.f, 1.f}) {
            auto hip = Node::make(); hip->position = V3(sd * 0.17f, 0.98f, 0); model->add(hip);
            part(hip, Geo::capsule(0.105f, 0.55f), dark, V3(0, -0.25f, 0));
            auto knee = Node::make(); knee->position = V3(0, -0.5f, 0); hip->add(knee);
            part(knee, Geo::capsule(0.085f, 0.52f), paint, V3(0, -0.22f, 0));
            part(knee, Geo::box(0.15f, 0.09f, 0.3f, 0.02f), dark, V3(0, -0.45f, 0.06f));
            legs.push_back(hip); legs.push_back(knee);
            part(model, Geo::sphere(0.16f, 14), paint, V3(sd * 0.37f, 1.62f, 0));
            part(model, Geo::capsule(0.075f, 0.6f), dark, V3(sd * 0.36f, 1.38f, 0.22f), V3(1.15f, 0, 0));
        }
        part(model, Geo::box(0.42f, 0.2f, 0.28f, 0.04f), dark, V3(0, 1.02f, 0));
        part(model, Geo::box(0.58f, 0.56f, 0.36f, 0.07f), paint, V3(0, 1.4f, 0));
        part(model, Geo::box(0.22f, 0.05f, 0.03f), glow, V3(0, 1.5f, 0.185f), V3(), false);
        part(model, Geo::box(0.3f, 0.42f, 0.14f, 0.03f), dark, V3(0, 1.42f, -0.22f));
        part(model, Geo::sphere(0.175f, 16), dark, V3(0, 1.84f, 0.02f))->scale = V3(1, 1.1f, 1.1f);
        part(model, Geo::box(0.26f, 0.065f, 0.12f), glow, V3(0, 1.86f, 0.13f), V3(), false);
        part(model, Geo::box(0.09f, 0.13f, 0.8f, 0.02f), dark, V3(0.2f, 1.28f, 0.55f));
        part(model, Geo::box(0.05f, 0.05f, 0.3f), glow, V3(0.2f, 1.36f, 0.6f), V3(), false);
        auto g = Geo::glowSprite(0.9f, glowC, 0.4f); g->position = V3(0, 1.86f, 0.2f); model->add(g);
        hits = {{V3(0, 0.55f, 0), 0.42f, false}, {V3(0, 1.2f, 0), 0.5f, false}, {V3(0, 1.84f, 0), 0.26f, true}};
        muzzles = {V3(0.2f, 1.3f, 1.0f)};
        break;
    }
    case EnemyKind::roller: {
        auto ball = Node::make(); ball->position = V3(0, 0.55f, 0); model->add(ball);
        part(ball, Geo::sphere(0.55f), dark, V3(0, 0, 0));
        part(ball, Geo::torus(0.555f, 0.04f), glow, V3(0, 0, 0), V3(), false);
        part(ball, Geo::torus(0.555f, 0.04f), glow, V3(0, 0, 0), V3(0, 0, PI / 2), false);
        part(ball, Geo::torus(0.555f, 0.04f), glow, V3(0, 0, 0), V3(PI / 2, 0, 0), false);
        V3 dirs[6] = {V3(1, 0, 0), V3(-1, 0, 0), V3(0, 1, 0), V3(0, -1, 0), V3(0, 0, 1), V3(0, 0, -1)};
        for (auto d : dirs) {
            auto sp = part(ball, Geo::cone(0, 0.09f, 0.3f, 8), dark, d * 0.62f);
            orientZ(*sp, d);
            sp->orientation = sp->orientation * Quat::angleAxis(PI / 2, V3(1, 0, 0));
        }
        spinners.push_back(ball);
        auto g = Geo::glowSprite(2.2f, glowC, 0.5f); g->position = V3(0, 0.55f, 0); g->name = "blink"; model->add(g);
        hits = {{V3(0, 0.55f, 0), 0.66f, false}};
        break;
    }
    case EnemyKind::brute: {
        auto paint = armorMat(V3(0.20f, 0.07f, 0.025f), 0.34f);
        for (float sd : {-1.f, 1.f}) {
            auto hip = Node::make(); hip->position = V3(sd * 0.5f, 1.3f, 0); model->add(hip);
            part(hip, Geo::capsule(0.3f, 1.3f), dark, V3(0, -0.6f, 0));
            part(hip, Geo::box(0.5f, 0.5f, 0.62f, 0.12f), paint, V3(0, -0.45f, 0.06f));
            part(hip, Geo::box(0.56f, 0.3f, 0.75f, 0.06f), paint, V3(0, -1.15f, 0.08f));
            legs.push_back(hip);
            part(model, Geo::sphere(0.52f, 20), paint, V3(sd * 1.18f, 2.55f, 0))->scale = V3(1, 0.85f, 1.15f);
            part(model, Geo::capsule(0.22f, 1.15f), dark, V3(sd * 1.25f, 1.75f, 0.1f));
            part(model, Geo::sphere(0.3f, 14), paint, V3(sd * 1.25f, 1.18f, 0.12f));
            part(model, Geo::cyl(0.17f, 1.1f, 14), dark, V3(sd * 1.18f, 2.95f, 0.4f), V3(PI / 2, 0, 0));
            part(model, Geo::cyl(0.12f, 0.05f, 14), glow, V3(sd * 1.18f, 2.95f, 0.96f), V3(PI / 2, 0, 0), false);
            muzzles.push_back(V3(sd * 1.18f, 2.95f, 1.1f));
        }
        part(model, Geo::box(1.35f, 0.42f, 0.85f, 0.08f), dark, V3(0, 1.35f, 0));
        part(model, Geo::box(1.75f, 1.25f, 1.15f, 0.34f), dark, V3(0, 2.15f, 0));
        part(model, Geo::box(1.25f, 0.42f, 0.3f, 0.1f), paint, V3(0, 2.5f, 0.5f));
        part(model, Geo::box(0.9f, 0.3f, 0.2f, 0.08f), paint, V3(0, 1.62f, 0.5f));
        part(model, Geo::sphere(0.27f, 16), glow, V3(0, 2.0f, 0.52f), V3(), false);
        part(model, Geo::torus(0.34f, 0.05f), paint, V3(0, 2.0f, 0.56f), V3(PI / 2, 0, 0));
        part(model, Geo::box(0.42f, 0.32f, 0.42f, 0.06f), dark, V3(0, 2.92f, 0.2f));
        part(model, Geo::box(0.3f, 0.07f, 0.05f), glow, V3(0, 2.94f, 0.42f), V3(), false);
        auto g = Geo::glowSprite(2.2f, glowC, 0.45f); g->position = V3(0, 2.0f, 0.7f); model->add(g);
        hits = {{V3(0, 0.8f, 0), 0.8f, false}, {V3(0, 2.1f, 0), 1.15f, false}, {V3(0, 2.0f, 0.6f), 0.4f, true}, {V3(0, 2.92f, 0.2f), 0.3f, true}};
        break;
    }
    case EnemyKind::boss: {
        auto paint = armorMat(V3(0.16f, 0.02f, 0.04f), 0.3f);
        part(model, Geo::sphere(1.8f, 36), dark, V3(0, 0, 0));
        part(model, Geo::sphere(0.72f, 24), glow, V3(0, 0, 1.38f), V3(), false);
        part(model, Geo::torus(0.85f, 0.12f), paint, V3(0, 0, 1.55f), V3(PI / 2, 0, 0));
        part(model, Geo::sphere(0.25f, 12), Mat::glow(V3(1, 0.9f, 0.7f), 8), V3(0, 0, 2.02f), V3(), false);
        float rs[3] = {2.7f, 3.2f, 3.7f};
        for (int i = 0; i < 3; i++) {
            auto h = Node::make(); model->add(h);
            part(h, Geo::torus(rs[i], 0.11f), paint, V3(0, 0, 0));
            part(h, Geo::torus(rs[i], 0.045f), glow, V3(0, 0.13f, 0), V3(), false);
            h->setEuler(V3(i * 0.5f + 0.2f, 0, i * 0.4f));
            spinners.push_back(h);
        }
        for (int a = 0; a < 4; a++) {
            float ang = a / 4.f * 2 * PI + PI / 4;
            part(model, Geo::box(0.22f, 2.6f, 1.2f, 0.1f), dark, V3(std::sin(ang) * 1.9f, 0.3f, std::cos(ang) * 1.9f), V3(0, ang, 0));
            part(model, Geo::box(0.08f, 2.2f, 0.08f), glow, V3(std::sin(ang) * 2.06f, 0.3f, std::cos(ang) * 2.06f), V3(), false);
        }
        part(model, Geo::cone(0.2f, 1.3f, 1.6f), dark, V3(0, -2.2f, 0));
        part(model, Geo::cyl(1.0f, 0.08f), glow, V3(0, -3.0f, 0), V3(), false);
        part(model, Geo::cone(0.0f, 0.5f, 1.8f, 12), dark, V3(0, 2.4f, 0));
        auto g = Geo::glowSprite(7, glowC, 0.5f); g->position = V3(0, 0, 1.6f); model->add(g);
        auto g2 = Geo::glowSprite(5, V3(1, 0.4f, 0.1f), 0.5f); g2->position = V3(0, -3.1f, 0); model->add(g2);
        hits = {{V3(0, 0, 0), 2.0f, false}, {V3(0, 0, 1.45f), 0.85f, true}};
        muzzles = {V3(0, 0, 2.2f), V3(1.6f, -0.6f, 1.4f), V3(-1.6f, -0.6f, 1.4f)};
        break;
    }
    case EnemyKind::tyrant:
        buildTyrant();
        break;
    }
    debrisMat = armor.empty() ? dark : armor.back();
}

/// The wave-15 boss: an 8.5 m giant in brown uniform. Built in human units (1.85 m) inside `body`,
/// which is scaled up by k; hit spheres and muzzles are in world units.
/// legs = [hipL, kneeL, hipR, kneeR], spinners = [shoulderL, elbowL, shoulderR, elbowR, head]
void Enemy::buildTyrant() {
    const float k = 4.6f;
    auto body = Node::make();
    body->scale = V3(k, k, k);
    model->add(body);
    auto jacket = cloth(V3(0.40f, 0.31f, 0.19f), 0.85f);
    auto breeches = cloth(V3(0.36f, 0.28f, 0.17f), 0.85f);
    auto leather = cloth(V3(0.03f, 0.025f, 0.02f), 0.25f, 0.15f);
    auto belt = cloth(V3(0.05f, 0.035f, 0.025f), 0.4f, 0.1f);
    auto brass = cloth(V3(0.62f, 0.5f, 0.26f), 0.3f, 1);
    auto skin = cloth(V3(0.86f, 0.68f, 0.58f), 0.6f, 0);
    auto hair = cloth(V3(0.04f, 0.035f, 0.03f), 0.45f, 0);
    auto eye = Mat::glow(V3(1.0f, 0.12f, 0.06f), 8);
    auto p = [](const NodeRef& parent, MeshRef g, MatRef m, V3 pos, V3 rot = V3(), bool shadow = true) { return Geo::part(parent, g, m, pos, rot, shadow); };
    auto joint = [](const NodeRef& parent, V3 pos) { auto n = Node::make(); n->position = pos; parent->add(n); return n; };
    for (float sd : {-1.f, 1.f}) {
        // riding breeches + tall boots
        auto hip = joint(body, V3(sd * 0.11f, 0.95f, 0));
        p(hip, Geo::capsule(0.09f, 0.52f), breeches, V3(0, -0.24f, 0));
        p(hip, Geo::sphere(0.1f, 16), breeches, V3(sd * 0.025f, -0.2f, 0))->scale = V3(1.15f, 1.3f, 1);
        auto knee = joint(hip, V3(0, -0.47f, 0));
        p(knee, Geo::capsule(0.072f, 0.46f), leather, V3(0, -0.21f, 0));
        p(knee, Geo::box(0.11f, 0.08f, 0.27f, 0.03f), leather, V3(0, -0.44f, 0.05f));
        legs.push_back(hip); legs.push_back(knee);
    }
    // uniform jacket, belt, cross strap, buttons, pockets, collar
    p(body, Geo::box(0.4f, 0.3f, 0.24f, 0.06f), jacket, V3(0, 1.08f, 0));
    p(body, Geo::box(0.44f, 0.34f, 0.25f, 0.08f), jacket, V3(0, 1.35f, 0));
    p(body, Geo::box(0.41f, 0.05f, 0.25f, 0.01f), belt, V3(0, 1.0f, 0));
    p(body, Geo::box(0.06f, 0.04f, 0.02f, 0.005f), brass, V3(0, 1.0f, 0.13f), V3(), false);
    p(body, Geo::box(0.035f, 0.62f, 0.012f), belt, V3(0.05f, 1.3f, 0.128f), V3(0, 0, 0.45f), false);
    for (int i = 0; i < 4; i++) p(body, Geo::sphere(0.012f, 8), brass, V3(0, 1.1f + i * 0.09f, 0.128f), V3(), false);
    for (float sd : {-1.f, 1.f}) {
        p(body, Geo::box(0.1f, 0.08f, 0.012f, 0.005f), jacket, V3(sd * 0.1f, 1.38f, 0.128f), V3(), false);
        p(body, Geo::sphere(0.085f, 16), jacket, V3(sd * 0.24f, 1.47f, 0));
    }
    p(body, Geo::box(0.2f, 0.06f, 0.2f, 0.02f), jacket, V3(0, 1.53f, 0));
    p(body, Geo::box(0.03f, 0.12f, 0.01f), belt, V3(0, 1.47f, 0.128f), V3(), false);
    // arms
    for (float sd : {-1.f, 1.f}) {
        auto shoulder = joint(body, V3(sd * 0.27f, 1.47f, 0));
        p(shoulder, Geo::capsule(0.065f, 0.34f), jacket, V3(0, -0.16f, 0));
        auto elbow = joint(shoulder, V3(0, -0.32f, 0));
        p(elbow, Geo::capsule(0.058f, 0.32f), jacket, V3(0, -0.15f, 0));
        p(elbow, Geo::sphere(0.055f, 14), skin, V3(0, -0.33f, 0))->scale = V3(0.8f, 1.1f, 1);
        spinners.push_back(shoulder); spinners.push_back(elbow);
    }
    // head: side parting with the lock across the forehead, toothbrush moustache, glowing eyes
    p(body, Geo::cyl(0.055f, 0.1f, 14), skin, V3(0, 1.6f, 0));
    auto head = joint(body, V3(0, 1.6f, 0));
    p(head, Geo::sphere(0.115f, 24), skin, V3(0, 0.12f, 0))->scale = V3(0.95f, 1.12f, 1.02f);
    p(head, Geo::sphere(0.118f, 24), hair, V3(0, 0.155f, -0.014f))->scale = V3(1.0f, 0.82f, 1.06f);
    p(head, Geo::box(0.12f, 0.024f, 0.026f, 0.01f), hair, V3(-0.03f, 0.176f, 0.098f), V3(0.3f, 0, -0.5f));
    p(head, Geo::box(0.07f, 0.03f, 0.03f, 0.01f), hair, V3(0.035f, 0.205f, 0.085f), V3(0.4f, 0, -0.2f));
    for (float sd : {-1.f, 1.f}) {
        p(head, Geo::sphere(0.014f, 10), eye, V3(sd * 0.038f, 0.135f, 0.103f), V3(), false);
        p(head, Geo::box(0.045f, 0.011f, 0.012f), hair, V3(sd * 0.04f, 0.158f, 0.106f), V3(0, 0, sd * 0.18f), false);
        p(head, Geo::sphere(0.025f, 10), skin, V3(sd * 0.112f, 0.12f, 0))->scale = V3(0.5f, 1, 0.8f);
        auto g = Geo::glowSprite(0.12f, V3(1.0f, 0.15f, 0.08f), 0.9f);
        g->position = V3(sd * 0.038f, 0.135f, 0.11f);
        head->add(g);
    }
    p(head, Geo::box(0.026f, 0.05f, 0.03f, 0.008f), skin, V3(0, 0.108f, 0.117f), V3(), false);
    p(head, Geo::box(0.05f, 0.022f, 0.02f, 0.004f), hair, V3(0, 0.074f, 0.112f), V3(), false);
    spinners.push_back(head);

    hits = {{V3(0, 0.55f * k, 0), 0.3f * k, false}, {V3(0, 1.25f * k, 0), 0.3f * k, false}, {V3(0, 1.73f * k, 0.03f * k), 0.14f * k, true}};
    // hands (arms raised forward), eyes
    muzzles = {V3(-0.27f * k, 1.44f * k, 0.68f * k), V3(0.27f * k, 1.44f * k, 0.68f * k), V3(-0.04f * k, 1.735f * k, 0.12f * k), V3(0.04f * k, 1.735f * k, 0.12f * k)};
}

void Enemy::setFlash(bool on) {
    for (auto& m : armor) m->emission = on ? V3(1.6f, 1.6f, 1.6f) : V3(0, 0, 0);
}

std::optional<RayEnemyHit> Enemy::rayHit(V3 o, V3 d, float maxT, float inflate) const {
    const float BIG = 3.4e38f;
    float body = BIG, weak = BIG;
    for (auto& h : hits) {
        V3 c = world(h.offset);
        float r = h.r + inflate;
        V3 oc = o - c;
        float b = simd_dot(oc, d);
        float cc = simd_dot(oc, oc) - r * r;
        float disc = b * b - cc;
        if (disc < 0) continue;
        float t = -b - std::sqrt(disc);
        if (t < 0) t = cc < 0 ? 0 : -1;
        if (t < 0 || t > maxT) continue;
        if (h.crit) weak = std::min(weak, t); else body = std::min(body, t);
    }
    // a weak point counts when the ray reaches it before (or just inside) the body shell
    if (weak < BIG && weak <= body + 0.7f) return RayEnemyHit{std::min(weak, body), true};
    if (body < BIG) return RayEnemyHit{body, false};
    return std::nullopt;
}
