// Arena Helix-9, shared building blocks, collision and navigation. Port of Level.swift and Maps.swift.
#include "level.h"
#include <cstring>
#include <climits>

// MARK: - maps

const char* mapName(MapID m) { return m == MapID::helix ? "STATION HELIX-9" : "ORBITAL-DOCK"; }
const char* mapTagline(MapID m) {
    return m == MapID::helix ? "Geschlossene Neon-Arena im Inneren der Station.\nSäulen, Container, Reaktorkern in der Mitte."
                             : "Offene Andockplattform unter dem Gasriesen.\nLandepads, Kräne, Kontrollturm auf erhöhter Plattform.";
}
V3 mapAccent(MapID m) { return m == MapID::helix ? V3(0.35f, 0.92f, 1.0f) : V3(1.0f, 0.66f, 0.2f); }
// Helix keeps the original keys (like the Mac version)
std::string mapScoreKey(MapID m) { return m == MapID::helix ? "bestScore" : "bestScore.dock"; }
std::string mapWaveKey(MapID m) { return m == MapID::helix ? "bestWave" : "bestWave.dock"; }
std::optional<MapID> mapFromArg(const char* s) {
    if (!s) return std::nullopt;
    std::string a(s);
    for (auto& c : a) c = (char)tolower(c);
    if (a == "1" || a == "helix") return MapID::helix;
    if (a == "2" || a == "dock") return MapID::dock;
    return std::nullopt;
}

Curve curve(std::vector<float> values, std::vector<float> keys) { Curve c; c.values = std::move(values); c.keys = std::move(keys); return c; }

// MARK: - navigation

Nav::Nav(const std::vector<Obstacle>& obstacles) : height(n * n, 0), blocked(n * n, 0), dist(n * n, INT_MAX), queue(n * n, 0) {
    for (int cz = 0; cz < n; cz++)
        for (int cx = 0; cx < n; cx++) {
            float x = origin + cx + 0.5f, z = origin + cz + 0.5f;
            float h = 0;
            bool b = false;
            for (auto& o : obstacles) {
                if (o.y0 >= 1.8f) continue;
                bool tall = o.y1 > 2.0f;
                float m = tall ? 0.45f : 0.0f;
                if (x > o.minX - m && x < o.maxX + m && z > o.minZ - m && z < o.maxZ + m) {
                    if (tall) b = true; else h = std::max(h, o.y1);
                }
            }
            height[cz * n + cx] = h;
            blocked[cz * n + cx] = b;
        }
}

std::pair<int, int> Nav::cell(float x, float z) const {
    return {std::min(std::max((int)std::floor(x - origin), 0), n - 1), std::min(std::max((int)std::floor(z - origin), 0), n - 1)};
}

bool Nav::passable(int a, int b) const { return !blocked[b] && std::fabs(height[a] - height[b]) <= maxStep; }

void Nav::rebuild(V3 target) {
    for (int i = 0; i < n * n; i++) dist[i] = INT_MAX;
    int head = 0, tail = 0;
    auto [pcx, pcz] = cell(target.x, target.z);
    auto seed = [&](int radius, bool strictHeight) {
        for (int dz = -radius; dz <= radius; dz++)
            for (int dx = -radius; dx <= radius; dx++) {
                int cx = pcx + dx, cz = pcz + dz;
                if (cx < 0 || cz < 0 || cx >= n || cz >= n) continue;
                int i = cz * n + cx;
                if (blocked[i] || dist[i] != INT_MAX) continue;
                if (strictHeight && std::fabs(height[i] - target.y) > 0.7f) continue;
                dist[i] = std::abs(dx) + std::abs(dz);
                queue[tail++] = i;
            }
    };
    seed(0, true);
    if (tail == 0) seed(1, true);
    if (tail == 0) seed(2, false);
    if (tail == 0) seed(4, false);
    const int dirs[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (head < tail) {
        int i = queue[head++];
        int cx = i % n, cz = i / n;
        int d = dist[i] + 1;
        for (auto& dd : dirs) {
            int nx = cx + dd[0], nz = cz + dd[1];
            if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
            int j = nz * n + nx;
            if (dist[j] != INT_MAX || !passable(i, j)) continue;
            dist[j] = d;
            queue[tail++] = j;
        }
    }
}

V2 Nav::direction(V3 pos, V3 target) const {
    auto [cx, cz] = cell(pos.x, pos.z);
    int i = cz * n + cx;
    float best = 1e30f;
    V2 bestDir(target.x - pos.x, target.z - pos.z);
    int32_t here = dist[i];
    for (int dz = -1; dz <= 1; dz++)
        for (int dx = -1; dx <= 1; dx++) {
            if (dx == 0 && dz == 0) continue;
            int nx = cx + dx, nz = cz + dz;
            if (nx < 0 || nz < 0 || nx >= n || nz >= n) continue;
            int j = nz * n + nx;
            if (dist[j] == INT_MAX) continue;
            if (dx != 0 && dz != 0) {
                // no corner cutting
                int a = cz * n + nx, b = nz * n + cx;
                if (dist[a] == INT_MAX || dist[b] == INT_MAX) continue;
                if (std::fabs(height[a] - height[i]) > maxStep || std::fabs(height[b] - height[i]) > maxStep) continue;
            }
            if (here != INT_MAX && !blocked[i] && std::fabs(height[j] - height[i]) > maxStep) continue;
            float wx = origin + nx + 0.5f, wz = origin + nz + 0.5f;
            float score = (float)dist[j] + 0.02f * simd_length(V2(target.x - wx, target.z - wz));
            if (score < best) { best = score; bestDir = V2(wx - pos.x, wz - pos.z); }
        }
    float l = simd_length(bestDir);
    return l > 1e-4f ? bestDir / l : V2(0, 0);
}

// MARK: - level

const V3 Level::cyan(0.25f, 0.9f, 1.0f);
const V3 Level::magenta(1.0f, 0.2f, 0.6f);
const V3 Level::orange(1.0f, 0.5f, 0.12f);
const V3 Level::red(1.0f, 0.16f, 0.10f);
const V3 Level::amber(1.0f, 0.62f, 0.18f);
const V3 Level::dockWhite(0.85f, 0.93f, 1.0f);
const V3 Level::teal(0.2f, 0.95f, 0.85f);

Level::Level(Scene& s, MapID m) : scene(s), map(m) {
    scene.root->add(root);
    if (m == MapID::helix) buildHelix(); else buildDock();
    nav = std::make_unique<Nav>(obstacles);
}

void Level::remove() {
    root->enumerate([](Node& n) { n.removeAllActions(); });
    // drop the map's particle systems right away (dust would otherwise linger in the menu)
    auto& em = scene.emitters;
    for (size_t i = 0; i < em.size();) {
        auto nd = em[i]->node.lock();
        if (em[i]->attached && nd && nd->inTree(root.get())) { em[i] = em.back(); em.pop_back(); continue; }
        i++;
    }
    root->removeFromParent();
}

void Level::buildHelix() {
    buildSkyAndLights();
    buildFloor();
    buildWalls();
    buildCore();
    buildPillarsAndBeams();
    buildPlatforms();
    buildCover();
    buildGenerators();
    buildSkyline();
    buildFloorStrips();
    buildAtmosphere();
    pickupSpots = {V3(20, 1.6f, -20), V3(-20, 1.6f, 20), V3(0, 0, 18), V3(0, 0, -18), V3(18, 0, 0), V3(-18, 0, 0),
                   V3(-12, 0, -24), V3(12, 0, 24), V3(26, 0, -6), V3(-26, 0, 6)};
}

// MARK: building blocks

/// Textured box standing on y0. `tile` = metres per texture repeat.
NodeRef Level::box(float cx, float cz, float w, float d, float y0, float y1, const TextureSet& set, float tile, float tileV, bool collide,
                   float chamfer, float emission) {
    float h = y1 - y0;
    float tv = tileV > 0 ? tileV : tile;
    auto g = Geo::box(w, h, d, chamfer);
    auto front = Mat::pbr(set, std::max(w / tile, 0.05f), std::max(h / tv, 0.05f), emission);
    auto side = Mat::pbr(set, std::max(d / tile, 0.05f), std::max(h / tv, 0.05f), emission);
    auto top = Mat::pbr(set, std::max(w / tile, 0.05f), std::max(d / tile, 0.05f), emission);
    auto n = Node::make(g, nullptr);
    n->materials = {front, side, front, side, top, top};
    n->position = V3(cx, y0 + h / 2, cz);
    root->add(n);
    if (collide) obstacles.push_back({cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2, y0, y1});
    return n;
}

NodeRef Level::glowBox(float cx, float cy, float cz, float w, float h, float d, V3 c, float intensity) {
    return Geo::part(root, Geo::box(w, h, d), Mat::glow(c, intensity), V3(cx, cy, cz), V3(), false);
}

/// Additive light pool painted on the floor (fake bounce light).
void Level::pool(float x, float z, float size, V3 c, float intensity, float y) {
    auto n = Node::make(Geo::plane(size, size), Mat::additive(Tex::glow(), c, intensity));
    n->setEuler(V3(-PI / 2, 0, 0));
    n->position = V3(x, y, z);
    n->castsShadow = false;
    n->renderingOrder = 10;
    root->add(n);
}

void Level::omni(const NodeRef& node, V3 c, float intensity, V3 pos, float range) {
    auto l = std::make_shared<Light>();
    l->type = LightType::Omni;
    l->color = c;
    l->intensity = intensity;
    l->attenuationStart = 1;
    l->attenuationEnd = range;
    l->falloffExponent = 2;
    node->light = l;
    node->position = pos;
    root->add(node);
}

void Level::blinker(float size, V3 c, V3 pos, float period) {
    auto s = Geo::glowSprite(size, c, 1.2f);
    s->position = pos;
    s->runAction(Act::repeatForever(Act::sequence({Act::fadeOpacity(0.1f, 0.9f), Act::fadeOpacity(1, 0.2f), Act::wait(period)})));
    root->add(s);
}

/// Additive light cone from `from` (narrow end) to `to` (wide end).
void Level::shaftCone(V3 from, V3 to, float top, float bottom, V3 c, float intensity) {
    V3 v = from - to;
    float h = simd_length(v);
    auto n = Node::make(Geo::cone(top, bottom, h, 32), Mat::additive(Tex::shaft(), c, intensity));
    n->position = (from + to) * 0.5f;
    n->orientation = Quat::fromTo(V3(0, 1, 0), v / h);
    n->castsShadow = false;
    n->renderingOrder = 20;
    root->add(n);
}

MatRef Level::makePortalMaterial() {
    auto m = std::make_shared<Material>();
    m->shade = Shade::Portal;
    m->spriteTex = Tex::hex();
    m->doubleSided = true;
    return m;
}

/// Translucent energy fence: scrolling hex pattern, bright at the base, fading upward.
MatRef Level::makeFenceMaterial(V3 c, float length, float height) {
    auto m = std::make_shared<Material>();
    m->shade = Shade::Fence;
    m->blend = Blend::Add;
    m->spriteTex = Tex::hex();
    float rep = height / 3;
    m->uvScale = V2(length / 3, rep);
    m->doubleSided = true;
    m->depthWrite = false;
    m->params = V4(rep, c.x, c.y, c.z);
    return m;
}

// MARK: sections

void Level::buildSkyAndLights() {
    scene.background = Tex::sky();
    scene.backgroundIntensity = 1.7f;
    scene.lightingEnvironmentIntensity = 1.25f;
    scene.fogColor = V3(0.03f, 0.06f, 0.10f);
    scene.fogStart = 28;
    scene.fogEnd = 150;
    scene.fogExponent = 1.4f;

    auto sun = std::make_shared<Light>();
    sun->type = LightType::Directional;
    sun->color = V3(1.0f, 0.92f, 0.80f);
    sun->intensity = 1900;
    sun->castsShadow = true;
    sunNode->light = sun;
    sunNode->position = Tex::sunDir * 60;
    root->add(sunNode);
    sunNode->lookAt(V3(0, 0, 0));

    omni(coreLight, cyan, 3000, V3(0, 3.0f, 0), 28);
    omni(Node::make(), magenta, 4500, V3(-18.5f, 3.2f, -18.5f), 22);
    omni(Node::make(), orange, 4500, V3(18.5f, 3.2f, 18.5f), 22);
}

void Level::buildFloor() {
    auto m = std::make_shared<Material>();
    m->shade = Shade::PBR;
    const TextureSet& set = Tex::floor();
    // no normal map (SCNFloor would warp the mirror image with it)
    m->albedo = set.albedo;
    m->roughMap = set.roughness;
    m->metalMap = set.metalness;
    m->uvScale = V2(0.25f, 0.25f);
    m->reflective = true;
    scene.floorReflectivity = 0.28f;
    scene.floorReflectionFalloff = 14;
    root->add(Node::make(Geo::floorPlane(), m));
}

void Level::buildWalls() {
    float H = half, t = 2, h = wallH;
    const TextureSet& w = Tex::wallCyan();
    box(0, -(H + t / 2), 2 * H + 2 * t, t, 0, h, w, 4);
    box(0, (H + t / 2), 2 * H + 2 * t, t, 0, h, w, 4);
    box(-(H + t / 2), 0, t, 2 * H, 0, h, w, 4);
    box((H + t / 2), 0, t, 2 * H, 0, h, w, 4);
    // caps + neon crown
    const TextureSet& cap = Tex::pillar();
    box(0, -(H + 0.6f), 2 * H + 4, 3.2f, h, h + 0.7f, cap, 4, -1, false, 0, 0);
    box(0, (H + 0.6f), 2 * H + 4, 3.2f, h, h + 0.7f, cap, 4, -1, false, 0, 0);
    box(-(H + 0.6f), 0, 3.2f, 2 * H, h, h + 0.7f, cap, 4, -1, false, 0, 0);
    box((H + 0.6f), 0, 3.2f, 2 * H, h, h + 0.7f, cap, 4, -1, false, 0, 0);
    float ny = h - 0.12f;
    glowBox(0, ny, -(H - 0.9f), 2 * H, 0.1f, 0.1f, magenta, 4);
    glowBox(0, ny, (H - 0.9f), 2 * H, 0.1f, 0.1f, magenta, 4);
    glowBox(-(H - 0.9f), ny, 0, 0.1f, 0.1f, 2 * H, magenta, 4);
    glowBox((H - 0.9f), ny, 0, 0.1f, 0.1f, 2 * H, magenta, 4);

    // spawn gates in the middle of every wall
    std::pair<V3, float> dirs[4] = {{V3(0, 0, 1), 0}, {V3(0, 0, -1), PI}, {V3(1, 0, 0), PI / 2}, {V3(-1, 0, 0), -PI / 2}};
    for (auto& [dir, yaw] : dirs) {
        V3 c = -dir * H;
        V3 side(dir.z, 0, -dir.x);
        bool alongX = std::fabs(side.x) > 0.5f;
        for (float s : {-1.f, 1.f}) {
            V3 p = c + side * (s * 3.1f) + dir * 0.7f;
            box(p.x, p.z, 1.3f, 1.3f, 0, 6.2f, Tex::pillar(), 1.3f, 4, true, 0.06f);
            V3 gp = p + dir * 0.68f;
            glowBox(gp.x, 3.0f, gp.z, alongX ? 0.12f : 0.05f, 5.4f, alongX ? 0.05f : 0.12f, red, 5);
        }
        V3 lp = c + dir * 0.7f;
        box(lp.x, lp.z, alongX ? 7.5f : 1.5f, alongX ? 1.5f : 7.5f, 5.4f, 6.6f, Tex::pillar(), 1.5f, 4, false, 0.06f);
        auto pm = makePortalMaterial();
        portalMaterials.push_back(pm);
        auto pn = Node::make(Geo::plane(5.0f, 5.4f), pm);
        pn->position = c + dir * 0.12f + V3(0, 2.7f, 0);
        pn->setEuler(V3(0, yaw, 0));
        pn->castsShadow = false;
        root->add(pn);
        auto glow = Geo::glowSprite(11, red, 0.55f);
        glow->position = c + dir * 0.8f + V3(0, 2.7f, 0);
        root->add(glow);
        V3 fp = c + dir * 4.5f;
        pool(fp.x, fp.z, 15, red, 0.5f);
        gates.push_back({c + dir * 3.2f, dir});
    }
}

void Level::buildCore() {
    box(0, 0, 6.4f, 6.4f, 0, 0.4f, Tex::tech(), 3.2f, -1, true, 0.05f);
    obstacles.push_back({-1.9f, 1.9f, -1.9f, 1.9f, 0.4f, 9});
    for (float sx : {-1.f, 1.f})
        for (float sz : {-1.f, 1.f}) box(sx * 1.55f, sz * 1.55f, 0.55f, 0.55f, 0.4f, 8.2f, Tex::pillar(), 0.55f, 4, false, 0.04f);
    box(0, 0, 4.4f, 4.4f, 8.2f, 9.0f, Tex::tech(), 2.2f, -1, false, 0.08f);
    box(0, 0, 3.4f, 3.4f, 0.4f, 1.0f, Tex::tech(), 1.7f, -1, false, 0.08f);

    // energy column
    auto m = std::make_shared<Material>();
    m->shade = Shade::Energy;
    auto cn = Node::make(Geo::cyl(0.85f, 7.3f, 32), m);
    cn->position = V3(0, 4.6f, 0);
    cn->castsShadow = false;
    root->add(cn);

    auto ringMat = Mat::metal(V3(0.5f, 0.55f, 0.6f), 0.25f);
    float ys[3] = {2.3f, 4.6f, 6.9f};
    for (int i = 0; i < 3; i++) {
        auto holder = Node::make();
        holder->position = V3(0, ys[i], 0);
        root->add(holder);
        Geo::part(holder, Geo::torus(2.55f, 0.09f), ringMat, V3(0, 0, 0));
        Geo::part(holder, Geo::torus(2.55f, 0.035f), Mat::glow(cyan, 4), V3(0, 0.1f, 0), V3(), false);
        holder->setEuler(V3(i == 1 ? 0.25f : 0.12f, 0, i == 2 ? 0.2f : -0.1f));
        float dur = 9.0f + i * 3.5f;
        holder->runAction(Act::repeatForever(Act::rotateBy(V3(0, i % 2 == 0 ? 2 * PI : -2 * PI, 0), dur)));
    }
    auto halo = Geo::glowSprite(11, cyan, 0.28f);
    halo->position = V3(0, 4.6f, 0);
    root->add(halo);
    pool(0, 0, 26, cyan, 0.28f);
}

void Level::buildPillarsAndBeams() {
    float p = 14;
    for (float sx : {-1.f, 1.f})
        for (float sz : {-1.f, 1.f}) {
            box(sx * p, sz * p, 2.4f, 2.4f, 0, 10, Tex::pillar(), 2.4f, 4, true, 0.12f);
            box(sx * p, sz * p, 3.2f, 3.2f, 0, 0.5f, Tex::tech(), 1.6f, -1, false, 0.08f);
            box(sx * p, sz * p, 3.3f, 3.3f, 10, 10.6f, Tex::tech(), 1.65f, -1, false, 0.1f);
        }
    // overhead ring of beams + hanging lamps
    for (float s : {-1.f, 1.f}) {
        box(0, s * p, 2 * p - 2.4f, 0.8f, 9.2f, 10.0f, Tex::pillar(), 4, -1, false, 0, 0);
        box(s * p, 0, 0.8f, 2 * p - 2.4f, 9.2f, 10.0f, Tex::pillar(), 4, -1, false, 0, 0);
        glowBox(0, 9.17f, s * p, 2 * p - 3, 0.06f, 0.16f, cyan, 4);
        glowBox(s * p, 9.17f, 0, 0.16f, 0.06f, 2 * p - 3, cyan, 4);
    }
    V3 lampPos[8] = {V3(0, 0, p), V3(0, 0, -p), V3(p, 0, 0), V3(-p, 0, 0), V3(7, 0, 7), V3(-7, 0, -7), V3(7, 0, -7), V3(-7, 0, 7)};
    for (int i = 0; i < 8; i++) {
        V3 lp = lampPos[i];
        bool big = i < 4;
        float y = big ? 9.2f : 9.0f;
        if (!big) {
            // diagonal struts from the core cap out to the pillars carry the inner lamps
            auto strut = Geo::part(root, Geo::box(0.35f, 0.35f, 15.5f), Mat::metal(V3(0.12f, 0.13f, 0.15f), 0.4f), V3(lp.x, 9.4f, lp.z));
            strut->setEuler(V3(0, std::atan2(lp.x, lp.z), 0));
            strut->castsShadow = false;
        }
        Geo::part(root, Geo::cyl(big ? 0.9f : 0.6f, 0.35f), Mat::metal(V3(0.1f, 0.1f, 0.12f), 0.4f), V3(lp.x, y - 0.2f, lp.z), V3(), false);
        Geo::part(root, Geo::cyl(big ? 0.7f : 0.45f, 0.06f), Mat::glow(V3(0.85f, 0.95f, 1.0f), 6), V3(lp.x, y - 0.4f, lp.z), V3(), false);
        // fake volumetric shaft
        float hgt = y - 0.4f;
        auto cn = Node::make(Geo::cone(big ? 0.7f : 0.45f, big ? 4.2f : 3.0f, hgt, 32), Mat::additive(Tex::shaft(), V3(0.55f, 0.8f, 1.0f), big ? 0.10f : 0.075f));
        cn->position = V3(lp.x, hgt / 2, lp.z);
        cn->castsShadow = false;
        cn->renderingOrder = 20;
        root->add(cn);
        pool(lp.x, lp.z, big ? 11 : 8, V3(0.6f, 0.85f, 1.0f), big ? 0.38f : 0.3f);
    }
}

void Level::buildPlatforms() {
    for (float s : {1.f, -1.f}) {
        float cx = 20 * s, cz = -20 * s;
        box(cx, cz, 9, 9, 0, 1.6f, Tex::tech(), 3, -1, true, 0.04f);
        // stairs toward the arena centre on two sides
        for (int i = 0; i < 3; i++) {
            float top = 1.2f - 0.4f * i;
            float off = 4.5f + 0.5f + i;
            box(cx - s * off, cz, 1.0f, 3.4f, 0, top, Tex::crateGrey(), 1.7f);
            box(cx, cz + s * off, 3.4f, 1.0f, 0, top, Tex::crateGrey(), 1.7f);
        }
        // railings on the outer edges
        box(cx + s * 4.3f, cz, 0.35f, 9, 1.6f, 2.6f, Tex::crateGrey(), 1.5f);
        box(cx, cz - s * 4.3f, 9, 0.35f, 1.6f, 2.6f, Tex::crateGrey(), 1.5f);
        glowBox(cx + s * 4.3f, 2.63f, cz, 0.12f, 0.05f, 8.6f, orange, 4);
        glowBox(cx, 2.63f, cz - s * 4.3f, 8.6f, 0.05f, 0.12f, orange, 4);
        glowBox(cx - s * 4.52f, 1.5f, cz, 0.04f, 0.08f, 8.8f, cyan, 4);
        glowBox(cx, 1.5f, cz + s * 4.52f, 8.8f, 0.08f, 0.04f, cyan, 4);
        // holo beacon
        auto holder = Node::make();
        holder->position = V3(cx + s * 2.2f, 1.6f, cz - s * 2.2f);
        root->add(holder);
        Geo::part(holder, Geo::cyl(0.6f, 0.25f), Mat::metal(V3(0.15f, 0.16f, 0.18f)), V3(0, 0.12f, 0));
        Geo::part(holder, Geo::cyl(0.45f, 0.04f), Mat::glow(cyan, 5), V3(0, 0.26f, 0), V3(), false);
        auto holo = Node::make();
        holo->position = V3(0, 1.9f, 0);
        holder->add(holo);
        auto gn = Node::make(Geo::sphere(0.75f, 16), Mat::additive(Tex::scan(), cyan, 0.9f));
        gn->castsShadow = false;
        holo->add(gn);
        auto hrn = Node::make(Geo::torus(1.1f, 0.02f), Mat::additive(nullptr, cyan, 1.5f));
        hrn->setEuler(V3(0.5f, 0, 0.2f));
        hrn->castsShadow = false;
        holo->add(hrn);
        holo->runAction(Act::repeatForever(Act::rotateBy(V3(0, 2 * PI, 0), 7)));
        auto sn = Node::make(Geo::cone(0.9f, 0.42f, 1.6f, 24), Mat::additive(Tex::shaft(), cyan, 0.25f));
        sn->position = V3(0, 1.08f, 0);
        sn->setEuler(V3(PI, 0, 0));
        sn->castsShadow = false;
        holder->add(sn);
    }
}

void Level::buildCover() {
    // shipping containers (some stacked)
    float cw = 2.6f, cl = 5.2f, ch = 2.6f;
    auto container = [&](float x, float z, bool alongX, float y0, const TextureSet& set) {
        box(x, z, alongX ? cl : cw, alongX ? cw : cl, y0, y0 + ch, set, 2.6f, -1, true, 0.03f);
    };
    container(-24, -5, false, 0, Tex::crateOrange());
    container(-24, -5.6f, false, ch, Tex::crateTeal());
    container(-21.2f, -4.2f, false, 0, Tex::crateTeal());
    container(24, 5, false, 0, Tex::crateTeal());
    container(24, 5.6f, false, ch, Tex::crateOrange());
    container(21.2f, 4.2f, false, 0, Tex::crateGrey());
    container(-5, 24, true, 0, Tex::crateOrange());
    container(-4.2f, 21.2f, true, 0, Tex::crateGrey());
    container(-5.6f, 24, true, ch, Tex::crateGrey());
    container(5, -24, true, 0, Tex::crateTeal());
    container(4.2f, -21.2f, true, 0, Tex::crateOrange());
    container(5.6f, -24, true, ch, Tex::crateOrange());

    // crate clusters
    float cs = 1.3f;
    auto crate = [&](float x, float z, int lvl, int k) {
        const TextureSet* sets[3] = {&Tex::crateOrange(), &Tex::crateTeal(), &Tex::crateGrey()};
        box(x, z, cs, cs, lvl * cs, (lvl + 1) * cs, *sets[k % 3], cs, -1, true, 0.03f);
    };
    for (float s : {1.f, -1.f}) {
        crate(7.6f * s, 7.6f * s, 0, 0); crate(9.0f * s, 7.6f * s, 0, 2); crate(7.6f * s, 9.0f * s, 0, 1); crate(7.7f * s, 7.7f * s, 1, 2);
        crate(-8.2f * s, 8.6f * s, 0, 1); crate(-9.6f * s, 8.4f * s, 0, 0);
        crate(27 * s, -14 * s, 0, 2); crate(27 * s, -12.6f * s, 0, 0); crate(27 * s, -13.3f * s, 1, 1); crate(28.4f * s, -13.2f * s, 0, 1);
        crate(-14 * s, -27 * s, 0, 1); crate(-12.6f * s, -27.2f * s, 0, 2);
        crate(3.5f * s, -14.5f * s, 0, 0); crate(-17 * s, 3 * s, 0, 2); crate(-17.2f * s, 4.4f * s, 0, 1);
    }

    // low barricades with light strip
    auto barrier = [&](float x, float z, bool alongX) {
        float w = alongX ? 3.4f : 0.55f, d = alongX ? 0.55f : 3.4f;
        box(x, z, w, d, 0, 1.15f, Tex::crateGrey(), 1.7f, 1.15f, true, 0.05f);
        glowBox(x, 1.17f, z, alongX ? 3.0f : 0.1f, 0.04f, alongX ? 0.1f : 3.0f, cyan, 4);
    };
    barrier(0, 10.5f, true); barrier(0, -10.5f, true);
    barrier(10.5f, 0, false); barrier(-10.5f, 0, false);
    barrier(-19, -11, true); barrier(19, 11, true);
    barrier(11, -19, false); barrier(-11, 19, false);
    barrier(0, 24, true); barrier(0, -24, true);
    barrier(24, -1.5f, false); barrier(-24, 1.5f, false);
}

void Level::buildGenerators() {
    std::pair<float, V3> gens[2] = {{-1.f, magenta}, {1.f, orange}};
    for (auto& [s, c] : gens) {
        float x = 22.5f * s, z = 22.5f * s;
        box(x, z, 4.6f, 4.6f, 0, 3.4f, Tex::tech(), 2.3f, -1, true, 0.08f, 3);
        box(x, z, 3.2f, 3.2f, 3.4f, 4.3f, Tex::tech(), 1.6f, -1, false, 0.08f);
        Geo::part(root, Geo::cyl(0.9f, 1.6f), Mat::metal(V3(0.2f, 0.21f, 0.23f), 0.3f), V3(x, 5.1f, z));
        Geo::part(root, Geo::cyl(0.93f, 0.12f), Mat::glow(c, 5), V3(x, 5.3f, z), V3(), false);
        Geo::part(root, Geo::cyl(0.93f, 0.12f), Mat::glow(c, 5), V3(x, 4.7f, z), V3(), false);
        glowBox(x - s * 2.33f, 1.7f, z, 0.05f, 2.2f, 0.25f, c, 5);
        glowBox(x, 1.7f, z - s * 2.33f, 0.25f, 2.2f, 0.05f, c, 5);
        // tanks
        auto tankMat = Mat::metal(V3(0.42f, 0.44f, 0.47f), 0.22f);
        std::pair<float, float> offs[2] = {{-3.6f, 0.6f}, {0.6f, -3.6f}};
        for (auto& [dx, dz] : offs) {
            float tx = x + dx * s, tz = z + dz * s;
            Geo::part(root, Geo::capsule(0.95f, 4.0f), tankMat, V3(tx, 2.0f, tz));
            Geo::part(root, Geo::torus(0.97f, 0.06f), Mat::glow(c, 4), V3(tx, 2.6f, tz), V3(), false);
            obstacles.push_back({tx - 0.9f, tx + 0.9f, tz - 0.9f, tz + 0.9f, 0, 4});
            auto pipe = Geo::part(root, Geo::cyl(0.14f, 2.6f, 12), Mat::metal(V3(0.3f, 0.3f, 0.32f), 0.3f), V3((tx + x) / 2, 3.0f, (tz + z) / 2));
            pipe->setEuler(std::fabs(dx) > std::fabs(dz) ? V3(0, 0, PI / 2) : V3(PI / 2, 0, 0));
        }
        pool(x - s * 3.2f, z - s * 3.2f, 16, c, 0.45f);
        auto g = Geo::glowSprite(7, c, 0.45f);
        g->position = V3(x, 5.0f, z);
        root->add(g);
    }
}

void Level::buildSkyline() {
    // distant station towers peeking over the walls
    int32_t k = 0;
    for (int side = 0; side < 4; side++)
        for (int i = 0; i < 5; i++) {
            k++;
            float a = hashI(k, 1, 91), b = hashI(k, 2, 91), c = hashI(k, 3, 91);
            float along = -40 + i * 20 + (a - 0.5f) * 8;
            float out = 46 + b * 16;
            float w = 7 + a * 7, h = 16 + c * 30;
            float x, z;
            if (side == 0) { x = along; z = -out; } else if (side == 1) { x = along; z = out; } else if (side == 2) { x = -out; z = along; } else { x = out; z = along; }
            box(x, z, w, w, 0, h, Tex::wallCyan(), 8, -1, false, 0, 2.5f);
            V3 lc = (k % 3 == 0) ? magenta : (k % 3 == 1 ? cyan : orange);
            glowBox(x, h + 0.2f, z, w * 0.9f, 0.25f, w * 0.9f, lc, 2.5f);
            if (c > 0.5f) {
                Geo::part(root, Geo::cyl(0.12f, 9, 8), Mat::metal(V3(0.1f, 0.1f, 0.12f), 0.5f, 1, 0), V3(x, h + 4.5f, z), V3(), false);
                auto blink = Geo::glowSprite(2.5f, red, 1.2f);
                blink->position = V3(x, h + 9, z);
                blink->runAction(Act::repeatForever(Act::sequence({Act::fadeOpacity(0.1f, 0.9f), Act::fadeOpacity(1, 0.2f), Act::wait(0.3f + a)})));
                root->add(blink);
            }
        }
}

void Level::buildFloorStrips() {
    float y = 0.012f;
    // guide lines from the core to the gates
    for (float s : {-1.f, 1.f}) {
        glowBox(0, y, s * 17.6f, 0.14f, 0.02f, 21.5f, cyan, 2.6f);
        glowBox(s * 17.6f, y, 0, 21.5f, 0.02f, 0.14f, cyan, 2.6f);
        glowBox(-0.9f, y, s * 30.2f, 0.08f, 0.02f, 3.2f, red, 3);
        glowBox(0.9f, y, s * 30.2f, 0.08f, 0.02f, 3.2f, red, 3);
        glowBox(s * 30.2f, y, -0.9f, 3.2f, 0.02f, 0.08f, red, 3);
        glowBox(s * 30.2f, y, 0.9f, 3.2f, 0.02f, 0.08f, red, 3);
    }
    // square ring around the core
    float r = 5.2f;
    for (float s : {-1.f, 1.f}) {
        glowBox(0, y, s * r, 2 * r, 0.02f, 0.1f, cyan, 2.6f);
        glowBox(s * r, y, 0, 0.1f, 0.02f, 2 * r, cyan, 2.6f);
    }
    // perimeter line along the walls
    float pr = half - 0.35f;
    for (float s : {-1.f, 1.f}) {
        glowBox(0, y, s * pr, 2 * pr, 0.02f, 0.07f, orange, 2.2f);
        glowBox(s * pr, y, 0, 0.07f, 0.02f, 2 * pr, orange, 2.2f);
    }
}

void Level::buildAtmosphere() {
    // drifting dust motes
    ParticleSystem dust;
    dust.image = Tex::softDot();
    dust.birthRate = 160;
    dust.lifeSpan = 9;
    dust.lifeSpanVar = 3;
    dust.shape = EmitterShape::Box;
    dust.shapeSize = V3(62, 9, 62);
    dust.volume = true;
    dust.size = 0.035f;
    dust.sizeVar = 0.025f;
    dust.velocity = 0.25f;
    dust.velocityVar = 0.2f;
    dust.spreadingAngle = 180;
    dust.color = V4(0.6f, 0.85f, 1.0f, 0.55f);
    dust.blend = Blend::Add;
    dust.warmup = 9;
    dust.opacity = curve({0, 1, 1, 0}, {0, 0.15f, 0.8f, 1});
    auto dn = Node::make();
    dn->position = V3(0, 4.6f, 0);
    root->add(dn);
    scene.attachParticleSystem(dn, dust);

    // sparks rising from the core
    ParticleSystem em;
    em.image = Tex::softDot();
    em.birthRate = 26;
    em.lifeSpan = 3.2f;
    em.lifeSpanVar = 1;
    em.shape = EmitterShape::Cylinder;
    em.shapeSize = V3(1.2f, 1, 0);
    em.size = 0.06f;
    em.sizeVar = 0.04f;
    em.velocity = 2.2f;
    em.velocityVar = 1;
    em.emittingDirection = V3(0, 1, 0);
    em.spreadingAngle = 14;
    em.color = V4(0.5f, 0.95f, 1.0f, 1);
    em.blend = Blend::Add;
    em.opacity = dust.opacity;
    auto en = Node::make();
    en->position = V3(0, 1.2f, 0);
    root->add(en);
    scene.attachParticleSystem(en, em);
}

// MARK: - collision queries

/// Push a vertical cylinder (feet at feetY) out of every obstacle it overlaps. Low obstacles can be stepped on.
void Level::resolve(V3& p, float radius, float feetY, float height, float step) const {
    for (auto& o : obstacles) {
        if (feetY + step >= o.y1 || feetY + height <= o.y0) continue;
        float nx = clampf(p.x, o.minX, o.maxX), nz = clampf(p.z, o.minZ, o.maxZ);
        float dx = p.x - nx, dz = p.z - nz;
        float d2 = dx * dx + dz * dz;
        if (d2 >= radius * radius) continue;
        if (d2 > 1e-8f) {
            float d = std::sqrt(d2);
            p.x = nx + dx / d * radius; p.z = nz + dz / d * radius;
        } else {
            // centre is inside: leave through the nearest face
            float l = p.x - o.minX, r = o.maxX - p.x, b = p.z - o.minZ, f = o.maxZ - p.z;
            float m = std::min(std::min(l, r), std::min(b, f));
            if (m == l) p.x = o.minX - radius; else if (m == r) p.x = o.maxX + radius;
            else if (m == b) p.z = o.minZ - radius; else p.z = o.maxZ + radius;
        }
    }
    float lim = bounds - radius;
    p.x = clampf(p.x, -lim, lim); p.z = clampf(p.z, -lim, lim);
}

float Level::groundHeight(float x, float z, float radius, float feetY, float step) const {
    float g = 0;
    for (auto& o : obstacles) {
        if (!(o.y1 <= feetY + step && o.y1 > g)) continue;
        if (x > o.minX - radius && x < o.maxX + radius && z > o.minZ - radius && z < o.maxZ + radius) g = o.y1;
    }
    return g;
}

/// Ray against floor and obstacles. Returns hit distance and surface normal.
std::optional<RayHit> Level::raycast(V3 o, V3 d, float maxT) const {
    float best = maxT;
    V3 bn(0, 1, 0);
    bool hit = false;
    if (d.y < -1e-5f) {
        float t = -o.y / d.y;
        float hx = o.x + d.x * t, hz = o.z + d.z * t;
        if (t > 0 && t < best && std::fabs(hx) <= floorExtent && std::fabs(hz) <= floorExtent) { best = t; bn = V3(0, 1, 0); hit = true; }
    }
    const float BIG = 3.4e38f;
    V3 inv(std::fabs(d.x) > 1e-7f ? 1 / d.x : BIG, std::fabs(d.y) > 1e-7f ? 1 / d.y : BIG, std::fabs(d.z) > 1e-7f ? 1 / d.z : BIG);
    for (auto& b : obstacles) {
        float t1 = (b.minX - o.x) * inv.x, t2 = (b.maxX - o.x) * inv.x;
        float tmin = std::min(t1, t2), tmax = std::max(t1, t2);
        int axis = 0;
        t1 = (b.y0 - o.y) * inv.y; t2 = (b.y1 - o.y) * inv.y;
        float ymin = std::min(t1, t2), ymax = std::max(t1, t2);
        if (ymin > tmin) { tmin = ymin; axis = 1; }
        tmax = std::min(tmax, ymax);
        t1 = (b.minZ - o.z) * inv.z; t2 = (b.maxZ - o.z) * inv.z;
        float zmin = std::min(t1, t2), zmax = std::max(t1, t2);
        if (zmin > tmin) { tmin = zmin; axis = 2; }
        tmax = std::min(tmax, zmax);
        if (tmax < std::max(tmin, 0.f) || tmin <= 0 || tmin >= best) continue;
        best = tmin; hit = true;
        bn = axis == 0 ? V3(d.x > 0 ? -1.f : 1.f, 0, 0) : axis == 1 ? V3(0, d.y > 0 ? -1.f : 1.f, 0) : V3(0, 0, d.z > 0 ? -1.f : 1.f);
    }
    if (!hit) return std::nullopt;
    return RayHit{best, bn};
}

bool Level::lineOfSight(V3 a, V3 b) const {
    V3 v = b - a;
    float l = simd_length(v);
    if (l < 1e-4f) return true;
    return !raycast(a, v / l, l).has_value();
}
