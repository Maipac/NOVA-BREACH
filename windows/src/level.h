// Maps, collision, line of sight and flow-field navigation (port of Level.swift, LevelDock.swift, Maps.swift).
#pragma once
#include "gfx.h"
#include "textures.h"
#include <optional>

struct Obstacle {
    float minX, maxX, minZ, maxZ, y0, y1;
};

struct Gate {
    V3 pos;   // spawn point just inside the arena
    V3 dir;   // facing into the arena
};

/// The playable maps. The number is stored in the settings ("map") and shown in the menu.
enum class MapID { helix = 0, dock = 1 };
constexpr int kMapCount = 2;
const char* mapName(MapID m);
const char* mapTagline(MapID m);
V3 mapAccent(MapID m);
std::string mapScoreKey(MapID m);
std::string mapWaveKey(MapID m);
std::optional<MapID> mapFromArg(const char* s);

/// Flow-field navigation over a 1 m grid (BFS from the player every few frames).
struct Nav {
    static constexpr int n = 64;
    static constexpr float origin = -32;
    /// highest ledge an agent can walk up – must match the 0.55 m step in moveGround
    static constexpr float maxStep = 0.55f;
    std::vector<float> height;
    std::vector<uint8_t> blocked;
    std::vector<int32_t> dist;
    std::vector<int32_t> queue;
    explicit Nav(const std::vector<Obstacle>& obstacles);
    std::pair<int, int> cell(float x, float z) const;
    void rebuild(V3 target);
    V2 direction(V3 pos, V3 target) const;
private:
    bool passable(int a, int b) const;
};

struct RayHit {
    float t;
    V3 n;
};

struct Level {
    static constexpr float half = 32, wallH = 8;
    static const V3 cyan, magenta, orange, red, amber, dockWhite, teal;

    Scene& scene;
    NodeRef root = Node::make();
    std::vector<Obstacle> obstacles;
    std::vector<Gate> gates;
    std::vector<V3> pickupSpots;
    std::vector<MatRef> portalMaterials;
    std::unique_ptr<Nav> nav;
    NodeRef sunNode = Node::make();
    NodeRef coreLight = Node::make();
    MapID map;
    /// playable half extent (players and enemies are clamped to ±bounds)
    float bounds = half;
    /// shots only hit the floor plane inside ±floorExtent (the dock deck ends, Helix's floor does not)
    float floorExtent = 1e30f;
    V3 playerStart = V3(0, 0, 16);
    float playerYaw = 0;
    float menuRadius = 25, menuHeight = 7.5f, menuLookY = 3.6f;

    Level(Scene& scene, MapID map);
    /// takes the whole map out of the scene (switching maps in the menu)
    void remove();

    // building blocks
    NodeRef box(float cx, float cz, float w, float d, float y0, float y1, const TextureSet& set, float tile,
                float tileV = -1, bool collide = true, float chamfer = 0, float emission = 2.2f);
    NodeRef glowBox(float cx, float cy, float cz, float w, float h, float d, V3 c, float intensity = 3);
    void pool(float x, float z, float size, V3 c, float intensity, float y = 0.03f);
    void omni(const NodeRef& node, V3 c, float intensity, V3 pos, float range);
    void blinker(float size, V3 c, V3 pos, float period);
    void shaftCone(V3 from, V3 to, float top, float bottom, V3 c, float intensity);
    static MatRef makePortalMaterial();
    static MatRef makeFenceMaterial(V3 c, float length, float height);

    // collision queries
    void resolve(V3& p, float radius, float feetY, float height, float step = 0.5f) const;
    float groundHeight(float x, float z, float radius, float feetY, float step = 0.5f) const;
    std::optional<RayHit> raycast(V3 o, V3 d, float maxT) const;
    bool lineOfSight(V3 a, V3 b) const;

private:
    void buildHelix();
    void buildSkyAndLights();
    void buildFloor();
    void buildWalls();
    void buildCore();
    void buildPillarsAndBeams();
    void buildPlatforms();
    void buildCover();
    void buildGenerators();
    void buildSkyline();
    void buildFloorStrips();
    void buildAtmosphere();

    void buildDock();
    void buildDockSkyAndLights();
    void buildDeck();
    void buildDockEdge();
    void buildDockGates();
    void buildHub();
    void buildPads();
    void dropship(float cx, float cz, float f);
    void padCargo(float cx, float cz, float sx, float sz);
    void buildCranes();
    void buildDockCover();
    void buildMasts();
    void buildDockBackdrop();
    void buildDockStrips();
    void buildDockAtmosphere();
};

/// opacity fade keyframes for particle systems
Curve curve(std::vector<float> values, std::vector<float> keys);
