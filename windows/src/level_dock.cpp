// Map 2: ORBITAL-DOCK – an open docking deck floating under the gas giant. Port of LevelDock.swift.
// Same building blocks, collision and navigation as Helix-9; everything stays inside ±30 m so the
// 64 x 64 navigation grid covers it.
#include "level.h"

void Level::buildDock() {
    bounds = 29.4f;
    floorExtent = 31;
    playerStart = V3(0, 0, 16);
    playerYaw = 0;
    menuRadius = 31;
    menuHeight = 11;
    menuLookY = 3;

    buildDockSkyAndLights();
    buildDeck();
    buildDockEdge();
    buildDockGates();
    buildHub();
    buildPads();
    buildCranes();
    buildDockCover();
    buildMasts();
    buildDockBackdrop();
    buildDockStrips();
    buildDockAtmosphere();
    pickupSpots = {V3(4.5f, 2.4f, 4.5f), V3(-4.5f, 2.4f, -4.5f), V3(19, 0.5f, -19), V3(-19, 0.5f, 19), V3(14, 0, 3), V3(-14, 0, -3),
                   V3(0, 0, 13), V3(0, 0, -13), V3(24, 0, -7), V3(-24, 0, 7)};
}

void Level::buildDockSkyAndLights() {
    scene.background = Tex::sky();
    scene.backgroundIntensity = 1.9f;
    scene.lightingEnvironmentIntensity = 1.1f;
    scene.fogColor = V3(0.02f, 0.04f, 0.08f);
    scene.fogStart = 70;
    scene.fogEnd = 260;
    scene.fogExponent = 1.4f;
    scene.floorReflectivity = 0;

    auto sun = std::make_shared<Light>();
    sun->type = LightType::Directional;
    sun->color = V3(1.0f, 0.9f, 0.76f);
    sun->intensity = 2300;
    sun->castsShadow = true;
    sunNode->light = sun;
    sunNode->position = Tex::sunDir * 60;
    root->add(sunNode);
    sunNode->lookAt(V3(0, 0, 0));

    omni(Node::make(), dockWhite, 2000, V3(0, 7.5f, 0), 24);
    omni(Node::make(), amber, 5200, V3(25.5f, 12.5f, 25.5f), 36);
    omni(Node::make(), teal, 4200, V3(-25.5f, 12.5f, -25.5f), 34);
}

void Level::buildDeck() {
    box(0, 0, 62, 62, -1.6f, 0, Tex::deck(), 4, -1, false, 0.2f, 0);
    // underside: girders and the station spine reaching down into the haze
    auto girder = Mat::metal(V3(0.16f, 0.17f, 0.19f), 0.4f);
    for (float s : {-1.f, 1.f})
        for (float k : {0.35f, 0.8f}) {
            Geo::part(root, Geo::box(3, 4, 58), girder, V3(s * k * 30, -3.6f, 0), V3(), false);
            Geo::part(root, Geo::box(58, 4, 3), girder, V3(0, -3.6f, s * k * 30), V3(), false);
        }
    Geo::part(root, Geo::cyl(8, 70, 48), Mat::pbr(Tex::pillar(), 10, 8), V3(0, -36.6f, 0), V3(), false);
    Geo::part(root, Geo::cyl(10, 2, 48), Mat::metal(V3(0.2f, 0.21f, 0.23f), 0.35f), V3(0, -5.6f, 0), V3(), false);
    Geo::part(root, Geo::torus(10.2f, 0.25f), Mat::glow(teal, 4), V3(0, -5.6f, 0), V3(), false);
    // deck rim lights
    for (float s : {-1.f, 1.f}) {
        glowBox(0, -0.05f, s * 31.02f, 62, 0.08f, 0.06f, amber, 3);
        glowBox(s * 31.02f, -0.05f, 0, 0.06f, 0.08f, 62, amber, 3);
        glowBox(0, -1.45f, s * 31.02f, 62, 0.06f, 0.06f, teal, 3);
        glowBox(s * 31.02f, -1.45f, 0, 0.06f, 0.06f, 62, teal, 3);
    }
}

/// Low rail + energy fence around the deck (gaps where the gates stand), pylons with beacons.
void Level::buildDockEdge() {
    const float E = 30, fenceH = 4;
    for (int side = 0; side < 4; side++) {
        bool alongX = side < 2;
        float s = side % 2 == 0 ? -1.f : 1.f;
        for (float hf : {-1.f, 1.f}) {
            float len = E - 3.8f;
            float mid = hf * (3.8f + len / 2);
            float x = alongX ? mid : s * E, z = alongX ? s * E : mid;
            box(x, z, alongX ? len : 0.35f, alongX ? 0.35f : len, 0, 0.9f, Tex::crateGrey(), 1.5f, -1, false, 0.05f);
            glowBox(x, 0.93f, z, alongX ? len : 0.08f, 0.05f, alongX ? 0.08f : len, amber, 3.5f);
            auto n = Node::make(Geo::plane(len, fenceH), makeFenceMaterial(amber, len, fenceH));
            n->position = V3(x, fenceH / 2, z);
            n->setEuler(V3(0, alongX ? 0 : PI / 2, 0));
            n->castsShadow = false;
            n->renderingOrder = 25;
            root->add(n);
        }
        // collision for players, enemies and bullets along the whole edge (the gates fill the gap)
        float cx = alongX ? 0 : s * (E + 0.1f), cz = alongX ? s * (E + 0.1f) : 0;
        obstacles.push_back({cx - (alongX ? E : 0.3f), cx + (alongX ? E : 0.3f), cz - (alongX ? 0.3f : E), cz + (alongX ? 0.3f : E), 0, fenceH});
    }
    // field emitter pylons
    for (float a : {-1.f, 1.f})
        for (float b : {-1.f, 1.f}) {
            for (float along : {10.f, 22.f}) {
                std::pair<float, float> ps[2] = {{a * along, b * E}, {b * E, a * along}};
                for (auto& [x, z] : ps) {
                    box(x, z, 0.8f, 0.8f, 0, 5, Tex::pillar(), 0.8f, 4, false, 0.06f);
                    glowBox(x, 5.05f, z, 0.5f, 0.1f, 0.5f, amber, 4);
                }
            }
            box(a * E, b * E, 1.3f, 1.3f, 0, 6.5f, Tex::pillar(), 1.3f, 4, false, 0.08f);
            blinker(2.2f, red, V3(a * E, 6.9f, b * E), 0.6f + 0.3f * (a + b + 2));
        }
}

// gates (one per edge, like Helix but free-standing)
void Level::buildDockGates() {
    const float E = 30;
    std::pair<V3, float> dirs[4] = {{V3(0, 0, 1), 0}, {V3(0, 0, -1), PI}, {V3(1, 0, 0), PI / 2}, {V3(-1, 0, 0), -PI / 2}};
    for (auto& [dir, yaw] : dirs) {
        V3 c = -dir * E;
        V3 side(dir.z, 0, -dir.x);
        bool alongX = std::fabs(side.x) > 0.5f;
        // backing frame so the portal reads as a solid gate against open space
        V3 back = c - dir * 0.25f;
        box(back.x, back.z, alongX ? 7.6f : 0.4f, alongX ? 0.4f : 7.6f, 0, 6.6f, Tex::pillar(), 1.5f, 4, false, 0.06f);
        for (float s : {-1.f, 1.f}) {
            V3 p = c + side * (s * 3.1f) + dir * 0.5f;
            box(p.x, p.z, 1.2f, 1.2f, 0, 6.2f, Tex::pillar(), 1.2f, 4, true, 0.06f);
            V3 gp = p + dir * 0.63f;
            glowBox(gp.x, 3.0f, gp.z, alongX ? 0.12f : 0.05f, 5.4f, alongX ? 0.05f : 0.12f, red, 5);
        }
        V3 lp = c + dir * 0.5f;
        box(lp.x, lp.z, alongX ? 7.4f : 1.4f, alongX ? 1.4f : 7.4f, 5.4f, 6.6f, Tex::pillar(), 1.4f, 4, false, 0.06f);
        auto pm = makePortalMaterial();
        portalMaterials.push_back(pm);
        auto pn = Node::make(Geo::plane(5.0f, 5.4f), pm);
        pn->position = c + dir * 0.12f + V3(0, 2.7f, 0);
        pn->setEuler(V3(0, yaw, 0));
        pn->castsShadow = false;
        root->add(pn);
        auto glow = Geo::glowSprite(11, red, 0.5f);
        glow->position = c + dir * 0.8f + V3(0, 2.7f, 0);
        root->add(glow);
        V3 fp = c + dir * 4.5f;
        pool(fp.x, fp.z, 14, red, 0.45f);
        gates.push_back({c + dir * 3.2f, dir});
    }
}

// central hub with control tower
void Level::buildHub() {
    const float H = 2.4f, r = 6;
    box(0, 0, 2 * r, 2 * r, 0, H, Tex::tech(), 3, -1, true, 0.05f);
    V2 dirs4[4] = {V2(0, 1), V2(0, -1), V2(1, 0), V2(-1, 0)};
    for (V2 d : dirs4) {
        // 1 m deep steps: one nav cell per step, so every cell-to-cell rise is 0.4 m
        for (int i = 0; i < 5; i++) {
            float top = 2.0f - 0.4f * i;
            float off = r + 0.5f + i;
            bool alongZ = d.y != 0;
            box(d.x * off, d.y * off, alongZ ? 4.0f : 1.0f, alongZ ? 1.0f : 4.0f, 0, top, Tex::crateGrey(), 1.7f);
        }
        // side glow strips along the stairs
        for (float s : {-1.f, 1.f}) {
            bool alongZ = d.y != 0;
            float px = alongZ ? s * 2.05f : d.x * 8.5f, pz = alongZ ? d.y * 8.5f : s * 2.05f;
            glowBox(px, 0.06f, pz, alongZ ? 0.06f : 5.0f, 0.06f, alongZ ? 5.0f : 0.06f, amber, 3);
        }
    }
    // railings with gaps at the stairs; their collision reaches the ground so the nav grid knows
    // the hub can only be entered over the stairs
    for (V2 d : dirs4)
        for (float s : {-1.f, 1.f}) {
            bool alongZ = d.y != 0;
            float len = r - 2.1f;
            float a = s * (2.1f + len / 2);
            float x = alongZ ? a : d.x * (r - 0.15f), z = alongZ ? d.y * (r - 0.15f) : a;
            float w = alongZ ? len : 0.3f, dd = alongZ ? 0.3f : len;
            box(x, z, w, dd, H, H + 0.9f, Tex::crateGrey(), 1.5f, -1, false, 0.04f);
            glowBox(x, H + 0.93f, z, alongZ ? len : 0.07f, 0.05f, alongZ ? 0.07f : len, amber, 3.5f);
            obstacles.push_back({x - w / 2, x + w / 2, z - dd / 2, z + dd / 2, 0, H + 0.9f});
        }
    // control tower
    Geo::part(root, Geo::cyl(1.6f, 6.6f, 32), Mat::pbr(Tex::pillar(), 4, 1.6f), V3(0, H + 3.3f, 0));
    obstacles.push_back({-1.45f, 1.45f, -1.45f, 1.45f, 0, 11.4f});
    Geo::part(root, Geo::cyl(2.3f, 0.6f, 32), Mat::metal(V3(0.18f, 0.19f, 0.21f), 0.35f), V3(0, H + 0.3f, 0));
    Geo::part(root, Geo::torus(2.32f, 0.05f), Mat::glow(amber, 4), V3(0, H + 0.62f, 0), V3(), false);
    box(0, 0, 4.6f, 4.6f, 9.0f, 11.0f, Tex::tech(), 2.3f, -1, false, 0.2f, 3);
    box(0, 0, 5.4f, 5.4f, 11.0f, 11.4f, Tex::pillar(), 4, -1, false, 0.1f, 0);
    for (float s : {-1.f, 1.f}) {
        glowBox(0, 10.1f, s * 2.33f, 3.6f, 0.35f, 0.04f, dockWhite, 3);
        glowBox(s * 2.33f, 10.1f, 0, 0.04f, 0.35f, 3.6f, dockWhite, 3);
    }
    Geo::part(root, Geo::cyl(0.09f, 5, 8), Mat::metal(V3(0.1f, 0.1f, 0.12f), 0.5f, 1, 0), V3(0.8f, 13.9f, 0.8f), V3(), false);
    blinker(2.4f, red, V3(0.8f, 16.5f, 0.8f), 0.5f);
    // rotating warning beacon on the roof
    auto beacon = Node::make();
    beacon->position = V3(0, 11.75f, 0);
    root->add(beacon);
    Geo::part(beacon, Geo::cyl(0.35f, 0.6f, 16), Mat::glow(amber, 5), V3(0, 0, 0), V3(), false);
    for (float s : {-1.f, 1.f}) {
        auto cn = Node::make(Geo::cone(0.2f, 2.2f, 9, 24), Mat::additive(Tex::shaft(), amber, 0.14f));
        cn->position = V3(s * 4.6f, 0, 0);
        cn->setEuler(V3(0, 0, s * PI / 2));
        cn->castsShadow = false;
        beacon->add(cn);
    }
    beacon->runAction(Act::repeatForever(Act::rotateBy(V3(0, 2 * PI, 0), 2.6f)));
    // consoles at the hub corners
    for (float sx : {-1.f, 1.f})
        for (float sz : {-1.f, 1.f}) {
            box(sx * 4.4f, sz * 4.4f, 1.1f, 0.7f, H, H + 1.05f, Tex::tech(), 1.1f, -1, true, 0.08f);
            auto scr = glowBox(sx * 4.4f, H + 1.25f, sz * 4.4f, 0.9f, 0.5f, 0.04f, teal, 2.5f);
            scr->setEuler(V3(-0.35f * sz, 0, 0));
        }
    pool(0, 0, 18, dockWhite, 0.22f, H + 0.02f);
}

// landing pads + parked dropships
void Level::buildPads() {
    for (float sx : {-1.f, 1.f})
        for (float sz : {-1.f, 1.f}) {
            float cx = 19 * sx, cz = 19 * sz;
            box(cx, cz, 11, 11, 0, 0.5f, Tex::deck(), 4, -1, true, 0.15f, 0);
            auto mn = Node::make(Geo::plane(9.4f, 9.4f), Mat::additive(Tex::padMark(), amber, 1.3f));
            mn->setEuler(V3(-PI / 2, 0, 0));
            mn->position = V3(cx, 0.515f, cz);
            mn->castsShadow = false;
            root->add(mn);
            for (float s : {-1.f, 1.f}) {
                glowBox(cx + s * 5.45f, 0.52f, cz, 0.06f, 0.04f, 10.6f, amber, 3);
                glowBox(cx, 0.52f, cz + s * 5.45f, 10.6f, 0.04f, 0.06f, amber, 3);
            }
            pool(cx, cz, 12, amber, 0.22f, 0.53f);
            if (sx == sz) dropship(cx, cz, -sz); else padCargo(cx, cz, sx, sz);
        }
}

void Level::dropship(float cx, float cz, float f) {
    auto hull = Mat::metal(V3(0.5f, 0.52f, 0.55f), 0.3f, 1, 2);
    auto dark = Mat::metal(V3(0.12f, 0.13f, 0.15f), 0.35f, 1, 2);
    const float base = 0.5f;
    Geo::part(root, Geo::box(3.4f, 2.4f, 8.0f, 0.6f), hull, V3(cx, base + 1.9f, cz));
    Geo::part(root, Geo::box(2.6f, 1.5f, 2.6f, 0.6f), dark, V3(cx, base + 2.2f, cz + f * 4.6f));
    glowBox(cx, base + 2.5f, cz + f * 5.9f, 1.9f, 0.35f, 0.05f, teal, 3);
    Geo::part(root, Geo::box(9.5f, 0.28f, 2.8f, 0.1f), hull, V3(cx, base + 2.2f, cz - f * 0.6f));
    for (float s : {-1.f, 1.f}) {
        glowBox(cx + s * 4.7f, base + 2.2f, cz - f * 0.6f, 0.12f, 0.12f, 2.4f, red, 4);
        Geo::part(root, Geo::cyl(0.62f, 2.2f, 20), dark, V3(cx + s * 1.2f, base + 2.0f, cz - f * 4.9f), V3(PI / 2, 0, 0));
        Geo::part(root, Geo::cyl(0.5f, 0.05f, 20), Mat::glow(V3(0.4f, 0.75f, 1.0f), 4), V3(cx + s * 1.2f, base + 2.0f, cz - f * 6.02f), V3(PI / 2, 0, 0), false);
        for (float zz : {-2.6f, 2.6f}) Geo::part(root, Geo::box(0.22f, 0.9f, 0.22f), dark, V3(cx + s * 1.3f, base + 0.45f, cz + zz));
        // engine idle exhaust
        ParticleSystem ex;
        ex.image = Tex::glow();
        ex.birthRate = 30;
        ex.lifeSpan = 0.5f;
        ex.lifeSpanVar = 0.2f;
        ex.size = 0.5f;
        ex.sizeVar = 0.2f;
        ex.velocity = 2.5f;
        ex.velocityVar = 1;
        ex.emittingDirection = V3(0, 0, -f);
        ex.spreadingAngle = 8;
        ex.color = V4(0.35f, 0.7f, 1.0f, 0.8f);
        ex.blend = Blend::Add;
        ex.opacity = curve({0.8f, 0}, {0, 1});
        auto en = Node::make();
        en->position = V3(cx + s * 1.2f, base + 2.0f, cz - f * 6.1f);
        root->add(en);
        scene.attachParticleSystem(en, ex);
    }
    Geo::part(root, Geo::box(0.3f, 1.8f, 2.2f, 0.1f), hull, V3(cx, base + 3.9f, cz - f * 3.0f));
    blinker(1.2f, red, V3(cx, base + 4.9f, cz - f * 3.4f), 0.8f);
    obstacles.push_back({cx - 1.7f, cx + 1.7f, cz - 4.0f, cz + 4.0f, 0, base + 3.1f});
    obstacles.push_back({cx - 1.3f, cx + 1.3f, std::min(cz + f * 3.3f, cz + f * 5.9f), std::max(cz + f * 3.3f, cz + f * 5.9f), 0, base + 3.0f});
}

void Level::padCargo(float cx, float cz, float sx, float sz) {
    float cw = 2.6f, cl = 5.2f, ch = 2.6f;
    box(cx + sx * 1.8f, cz - sz * 1.4f, cl, cw, 0.5f, 0.5f + ch, Tex::crateOrange(), 2.6f, -1, true, 0.03f);
    box(cx + sx * 1.8f, cz - sz * 1.4f, cl, cw, 0.5f + ch, 0.5f + 2 * ch, Tex::crateTeal(), 2.6f, -1, true, 0.03f);
    box(cx - sx * 2.4f, cz + sz * 2.2f, cw, cl, 0.5f, 0.5f + ch, Tex::crateGrey(), 2.6f, -1, true, 0.03f);
    float cs = 1.3f;
    box(cx - sx * 2.6f, cz - sz * 2.6f, cs, cs, 0.5f, 0.5f + cs, Tex::crateOrange(), cs, -1, true, 0.03f);
    box(cx - sx * 1.2f, cz - sz * 2.7f, cs, cs, 0.5f, 0.5f + cs, Tex::crateTeal(), cs, -1, true, 0.03f);
}

// gantry cranes with hanging containers
void Level::buildCranes() {
    for (float s : {-1.f, 1.f}) {
        float z = 11.5f * s;
        for (float x : {-15.f, 15.f}) {
            box(x, z, 1.0f, 1.0f, 0, 10, Tex::crateOrange(), 1.0f, 2.6f, true, 0.05f);
            box(x, z, 1.8f, 1.8f, 0, 0.4f, Tex::crateGrey(), 1.8f, -1, false, 0.05f);
        }
        box(0, z, 31.2f, 1.2f, 9.6f, 10.7f, Tex::crateOrange(), 2.6f, -1, false, 0.05f);
        glowBox(0, 9.55f, z, 30, 0.05f, 0.1f, amber, 3);
        float tx = 6 * s;
        Geo::part(root, Geo::box(1.8f, 0.7f, 1.6f, 0.08f), Mat::metal(V3(0.2f, 0.2f, 0.22f), 0.35f), V3(tx, 9.25f, z));
        for (float dx : {-1.6f, 1.6f})
            Geo::part(root, Geo::cyl(0.04f, 2.3f, 6), Mat::metal(V3(0.1f, 0.1f, 0.1f), 0.5f, 1, 0), V3(tx + dx, 7.85f, z), V3(), false);
        box(tx, z, 5.2f, 2.6f, 4.1f, 6.7f, Tex::crateTeal(), 2.6f, -1, true, 0.03f);
        blinker(1.0f, amber, V3(tx, 9.75f, z), 0.4f);
    }
}

// cover on the open deck
void Level::buildDockCover() {
    float cw = 2.6f, cl = 5.2f, ch = 2.6f;
    auto container = [&](float x, float z, bool alongX, float y0, const TextureSet& set) {
        box(x, z, alongX ? cl : cw, alongX ? cw : cl, y0, y0 + ch, set, 2.6f, -1, true, 0.03f);
    };
    container(-13.6f, 4, false, 0, Tex::crateOrange());
    container(13.6f, -4, false, 0, Tex::crateTeal());
    container(13.6f, -4.4f, false, ch, Tex::crateGrey());
    container(3.5f, 20, true, 0, Tex::crateGrey());
    container(-3.5f, -20, true, 0, Tex::crateOrange());
    container(22, 4.5f, false, 0, Tex::crateTeal());
    container(-22, -4.5f, false, 0, Tex::crateGrey());
    container(-22, -4.1f, false, ch, Tex::crateOrange());

    float cs = 1.3f;
    auto crate = [&](float x, float z, int lvl, int k) {
        const TextureSet* sets[3] = {&Tex::crateOrange(), &Tex::crateTeal(), &Tex::crateGrey()};
        box(x, z, cs, cs, lvl * cs, (lvl + 1) * cs, *sets[k % 3], cs, -1, true, 0.03f);
    };
    for (float s : {1.f, -1.f}) {
        crate(9 * s, -9 * s, 0, 0); crate(10.4f * s, -9 * s, 0, 2); crate(9 * s, -10.4f * s, 0, 1); crate(9.1f * s, -9.1f * s, 1, 2);
        crate(9 * s, 9.5f * s, 0, 1); crate(10.5f * s, 9.2f * s, 0, 0);
        crate(17 * s, -8 * s, 0, 2); crate(-8 * s, -17 * s, 0, 1);
    }
    auto barrier = [&](float x, float z, bool alongX) {
        float w = alongX ? 3.4f : 0.55f, d = alongX ? 0.55f : 3.4f;
        box(x, z, w, d, 0, 1.15f, Tex::crateGrey(), 1.7f, 1.15f, true, 0.05f);
        glowBox(x, 1.17f, z, alongX ? 3.0f : 0.1f, 0.04f, alongX ? 0.1f : 3.0f, amber, 4);
    };
    barrier(0, 19.5f, true); barrier(0, -19.5f, true);
    barrier(19.5f, 0, false); barrier(-19.5f, 0, false);
    barrier(-6, 14.5f, true); barrier(6, -14.5f, true);
    // fuel tanks along the edges
    auto tankMat = Mat::metal(V3(0.6f, 0.6f, 0.62f), 0.25f);
    std::pair<float, float> tanks[8] = {{27.2f, 10}, {27.2f, -10}, {-27.2f, 10}, {-27.2f, -10}, {10, 27.2f}, {-10, 27.2f}, {10, -27.2f}, {-10, -27.2f}};
    for (auto& [x, z] : tanks) {
        Geo::part(root, Geo::capsule(0.85f, 3.6f), tankMat, V3(x, 1.8f, z));
        Geo::part(root, Geo::torus(0.87f, 0.06f), Mat::glow(amber, 4), V3(x, 2.4f, z), V3(), false);
        obstacles.push_back({x - 0.8f, x + 0.8f, z - 0.8f, z + 0.8f, 0, 3.6f});
    }
}

// floodlight masts in the corners
void Level::buildMasts() {
    for (float sx : {-1.f, 1.f})
        for (float sz : {-1.f, 1.f}) {
            float x = 27.6f * sx, z = 27.6f * sz;
            Geo::part(root, Geo::cyl(0.3f, 14, 12), Mat::metal(V3(0.2f, 0.21f, 0.23f), 0.35f), V3(x, 7, z));
            obstacles.push_back({x - 0.3f, x + 0.3f, z - 0.3f, z + 0.3f, 0, 14});
            V3 head(x - sx * 0.6f, 13.8f, z - sz * 0.6f);
            auto hn = Geo::part(root, Geo::box(2.0f, 0.8f, 0.9f, 0.1f), Mat::metal(V3(0.14f, 0.15f, 0.17f), 0.35f), head, V3(), false);
            hn->setEuler(V3(0, std::atan2(-sx, -sz) + PI / 2, 0));
            auto lamp = Geo::glowSprite(3.2f, V3(1.0f, 0.85f, 0.6f), 1.1f);
            lamp->position = head - V3(sx, 0.2f, sz) * 0.5f;
            root->add(lamp);
            shaftCone(head, V3(12 * sx, 0, 12 * sz), 0.5f, 4.5f, V3(1.0f, 0.8f, 0.55f), 0.05f);
            pool(14 * sx, 14 * sz, 16, V3(1.0f, 0.75f, 0.45f), 0.18f);
        }
}

// backdrop: capital ship alongside, docking arm
void Level::buildDockBackdrop() {
    box(-72, 0, 26, 170, -16, 16, Tex::wallCyan(), 8, -1, false, 0, 2.2f)->castsShadow = false;
    box(-68, 18, 12, 46, 16, 26, Tex::wallCyan(), 8, -1, false, 0, 2.2f)->castsShadow = false;
    box(-72, -70, 30, 20, -12, 12, Tex::tech(), 6, -1, false, 0, 2.5f)->castsShadow = false;
    std::pair<float, float> lights[4] = {{-6, -6}, {6, -6}, {-6, 6}, {6, 6}};
    for (auto& [dz, dy] : lights) {
        auto g = Geo::glowSprite(16, V3(0.4f, 0.75f, 1.0f), 0.8f);
        g->position = V3(-72 + dz * 1.4f, dy, -86);
        root->add(g);
    }
    glowBox(-58.9f, 4, 0, 0.2f, 0.3f, 160, teal, 3);
    glowBox(-58.9f, -8, 0, 0.2f, 0.3f, 160, amber, 3);
    for (int k = 0; k < 6; k++) blinker(3.0f, red, V3(-58.6f, 16.5f, -75 + k * 30.f), 0.4f + 0.2f * k);
    // docking arm from the deck edge to the ship
    box(-45, 6, 28, 5, -1.4f, 0.6f, Tex::crateGrey(), 2, -1, false, 0.1f)->castsShadow = false;
    glowBox(-45, 0.65f, 4.0f, 28, 0.06f, 0.1f, amber, 3);
    glowBox(-45, 0.65f, 8.0f, 28, 0.06f, 0.1f, amber, 3);
    // arms on the other sides reaching into the void
    float arms[3][4] = {{0, 44, 5, 26}, {44, 0, 26, 5}, {0, -44, 5, 26}};
    for (auto& a : arms) {
        box(a[0], a[1], a[2], a[3], -1.4f, -0.2f, Tex::crateGrey(), 2, -1, false, 0.1f)->castsShadow = false;
        V3 tip = V3(a[0], 0.5f, a[1]) + simd_normalize(V3(a[0], 0, a[1])) * 12;
        blinker(2.2f, red, tip, 0.7f);
    }
}

// deck markings
void Level::buildDockStrips() {
    float y = 0.012f;
    for (float s : {-1.f, 1.f}) {
        glowBox(0, y, s * 18.6f, 0.12f, 0.02f, 15.2f, amber, 2.4f);
        glowBox(s * 18.6f, y, 0, 15.2f, 0.02f, 0.12f, amber, 2.4f);
        glowBox(-0.9f, y, s * 28.2f, 0.08f, 0.02f, 2.8f, red, 3);
        glowBox(0.9f, y, s * 28.2f, 0.08f, 0.02f, 2.8f, red, 3);
        glowBox(s * 28.2f, y, -0.9f, 2.8f, 0.02f, 0.08f, red, 3);
        glowBox(s * 28.2f, y, 0.9f, 2.8f, 0.02f, 0.08f, red, 3);
    }
    float pr = 29.3f;
    for (float s : {-1.f, 1.f}) {
        glowBox(0, y, s * pr, 2 * pr, 0.02f, 0.06f, teal, 2.2f);
        glowBox(s * pr, y, 0, 0.06f, 0.02f, 2 * pr, teal, 2.2f);
    }
}

void Level::buildDockAtmosphere() {
    ParticleSystem dust;
    dust.image = Tex::softDot();
    dust.birthRate = 90;
    dust.lifeSpan = 9;
    dust.lifeSpanVar = 3;
    dust.shape = EmitterShape::Box;
    dust.shapeSize = V3(62, 10, 62);
    dust.volume = true;
    dust.size = 0.035f;
    dust.sizeVar = 0.025f;
    dust.velocity = 0.3f;
    dust.velocityVar = 0.2f;
    dust.spreadingAngle = 180;
    dust.color = V4(1.0f, 0.85f, 0.65f, 0.5f);
    dust.blend = Blend::Add;
    dust.warmup = 9;
    dust.opacity = curve({0, 1, 1, 0}, {0, 0.15f, 0.8f, 1});
    auto dn = Node::make();
    dn->position = V3(0, 5, 0);
    root->add(dn);
    scene.attachParticleSystem(dn, dust);
}
