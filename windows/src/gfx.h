// A small SceneKit-like 3D layer on Direct3D 11: node tree, materials, lights, actions, particles,
// procedural primitives and a renderer with shadows, image based lighting, HDR, bloom and tone mapping.
// The API deliberately mirrors what the Swift version uses so the game code ports one to one.
#pragma once
#include "math.h"
#include <d3d11.h>
#include <memory>
#include <vector>
#include <string>
#include <functional>

// MARK: - device

namespace GFX {
extern ID3D11Device* device;
extern ID3D11DeviceContext* ctx;
}

// MARK: - textures

/// CPU pixel data (RGBA8 or R8). Procedural textures are generated into these, then uploaded.
struct Image {
    int w = 0, h = 0, channels = 4;
    std::vector<uint8_t> px;
};

struct Texture {
    ID3D11Texture2D* tex = nullptr;
    ID3D11ShaderResourceView* srv = nullptr;
    int w = 0, h = 0;
    ~Texture();
};
using TexRef = std::shared_ptr<Texture>;

/// srgb: colour data (albedo, emission, sprites) is decoded to linear when sampled; normal/rough/metal are not.
TexRef makeTexture(const Image& img, bool srgb, bool mips = true);
TexRef makeTextureFloat(int w, int h, const std::vector<V4>& mip0, int mipLevels, const std::vector<std::vector<V4>>* mipData = nullptr);

// MARK: - geometry

struct Vertex {
    V3 p, n;
    V2 uv;
    V4 t; // tangent (xyz) + bitangent sign
};

struct Mesh {
    ID3D11Buffer* vb = nullptr;
    ID3D11Buffer* ib = nullptr;
    uint32_t indexCount = 0;
    /// index ranges, one per material slot (SceneKit boxes have six faces with their own materials)
    std::vector<std::pair<uint32_t, uint32_t>> subs;
    V3 bmin, bmax;
    float radius = 0;
    ~Mesh();
};
using MeshRef = std::shared_ptr<Mesh>;

MeshRef makeMesh(std::vector<Vertex>& v, const std::vector<uint32_t>& idx, std::vector<std::pair<uint32_t, uint32_t>> subs = {});

/// SceneKit primitives with the same dimensions, orientation, UV layout and material slots.
namespace Geo {
MeshRef box(float w, float h, float l, float chamfer = 0);
MeshRef sphere(float r, int segments = 24);
MeshRef cyl(float r, float h, int segments = 24);
MeshRef capsule(float r, float h);
MeshRef cone(float top, float bottom, float h, int segments = 24);
MeshRef torus(float ring, float pipe);
MeshRef plane(float w, float h);
MeshRef pyramid(float w, float h, float l);
/// SCNFloor: a large plane at y = 0 with UVs in metres
MeshRef floorPlane();
}

// MARK: - materials

enum class Shade {
    PBR,       // physically based, textured or flat
    Glow,      // self-lit colour (neon strips, eyes)
    Additive,  // unlit texture * colour, added (sprites, beams, light pools)
    Portal,    // animated spawn portal (opaque, unlit)
    Fence,     // animated energy fence (additive)
    Energy,    // reactor energy column (opaque, unlit)
};
enum class Blend { Opaque, Add, Alpha };

struct Material {
    Shade shade = Shade::PBR;
    Blend blend = Blend::Opaque;
    bool doubleSided = false, depthWrite = true, depthTest = true;
    // PBR
    V3 diffuse = V3(1, 1, 1);         // linear
    TexRef albedo, normal, roughMap, metalMap, emissionMap, spriteTex;
    float roughness = 0.5f, metalness = 0;
    float roughMul = 1;               // SceneKit roughness.intensity when a roughness map is used
    float normalIntensity = 1;
    V3 emission = V3(0, 0, 0);        // linear colour * intensity (emissionMap is multiplied with it)
    V2 uvScale = V2(1, 1);
    // Additive / Glow: linear colour * intensity
    V3 color = V3(1, 1, 1);
    /// custom shader parameters (u_boost, u_rep …)
    V4 params = V4(0, 0, 0, 0);
    /// SCNFloor: shows the planar reflection of the scene
    bool reflective = false;
};
using MatRef = std::shared_ptr<Material>;

/// Material helpers (Swift Mat).
namespace Mat {
MatRef glow(V3 srgb, float intensity = 3);
MatRef additive(TexRef image, V3 srgb, float intensity = 1, bool depthTest = true);
MatRef metal(V3 srgb, float rough = 0.35f, float metal = 1, float plating = 1);
}

// MARK: - lights

enum class LightType { Directional, Omni, Spot };
struct Light {
    LightType type = LightType::Omni;
    V3 color = V3(1, 1, 1);           // sRGB
    float intensity = 1000;           // SceneKit units
    float attenuationStart = 0, attenuationEnd = 0, falloffExponent = 2;   // SceneKit fall-off between start and end
    float spotInner = 0, spotOuter = 45;   // degrees
    bool castsShadow = false;
    int categoryBitMask = -1;
};
using LightRef = std::shared_ptr<Light>;

// MARK: - actions (SCNAction)

struct Node;
struct Action;
using ActionRef = std::shared_ptr<Action>;
enum class Timing { Linear, EaseIn, EaseOut, EaseInOut };
struct Action {
    float duration = 0;
    Timing timing = Timing::Linear;
    virtual ~Action() = default;
    virtual ActionRef clone() const = 0;
    /// advance by dt; returns the time left over once finished (>= 0), or -1 while still running
    virtual float step(Node& n, float dt) = 0;
};
namespace Act {
ActionRef wait(float d);
ActionRef sequence(std::vector<ActionRef> a);
ActionRef group(std::vector<ActionRef> a);
ActionRef repeatForever(ActionRef a);
ActionRef fadeOut(float d);
ActionRef fadeIn(float d);
ActionRef fadeOpacity(float to, float d);
ActionRef scaleTo(float s, float d, Timing t = Timing::Linear);
ActionRef rotateBy(V3 euler, float d);
ActionRef removeFromParent();
ActionRef run(std::function<void(Node&)> f);
ActionRef custom(float d, std::function<void(Node&, float)> f);
}

// MARK: - particles (SCNParticleSystem)

struct Curve {
    std::vector<float> values, keys;
    bool empty() const { return values.empty(); }
    float eval(float t) const;
};

enum class EmitterShape { Point, Box, Cylinder };
struct ParticleSystem {
    TexRef image;
    bool loops = true;
    float emissionDuration = 1, birthRate = 1;
    float lifeSpan = 1, lifeSpanVar = 0;
    float velocity = 0, velocityVar = 0;
    V3 emittingDirection = V3(0, 0, 1);
    float spreadingAngle = 0;          // degrees
    float size = 1, sizeVar = 0;
    float stretch = 0;
    bool gravity = false;
    float damping = 0;
    V3 acceleration;
    Blend blend = Blend::Add;
    V4 color = V4(1, 1, 1, 1);         // sRGB + alpha
    V4 colorVar = V4(0, 0, 0, 0);
    float angleVar = 0, angVelVar = 0; // degrees
    float warmup = 0;
    EmitterShape shape = EmitterShape::Point;
    V3 shapeSize;                      // box: w,h,l / cylinder: r,h,_
    bool volume = false;
    Curve opacity, sizeCurve;
};
using PSysRef = std::shared_ptr<ParticleSystem>;

struct Particle {
    V3 p, v;
    float life, maxLife, size, angle, angVel;
    V4 col;
};
struct Emitter {
    ParticleSystem sys;
    std::weak_ptr<Node> node;          // attached: emits from the node's world transform
    bool attached = false;
    M4 transform;                      // one-shot bursts added to the scene at a transform
    float age = 0, accum = 0;
    std::vector<Particle> ps;
    bool finished() const { return !sys.loops && age >= sys.emissionDuration && ps.empty(); }
};

// MARK: - nodes

struct Node;
using NodeRef = std::shared_ptr<Node>;
struct Node : std::enable_shared_from_this<Node> {
    std::string name;
    V3 position;
    V3 scale = V3(1, 1, 1);
    Quat orientation;
    V3 euler;                          // last Euler angles set with setEuler (pose() reads them back)
    Node* parent = nullptr;
    std::vector<NodeRef> children;
    MeshRef mesh;
    std::vector<MatRef> materials;
    LightRef light;
    bool hidden = false;
    float opacity = 1;
    bool castsShadow = true;
    int renderingOrder = 0;
    bool billboard = false;
    int categoryBitMask = 1;
    std::vector<std::pair<ActionRef, std::function<void()>>> actions;

    static NodeRef make() { return std::make_shared<Node>(); }
    static NodeRef make(MeshRef m, MatRef mat) { auto n = make(); n->mesh = m; if (mat) n->materials = {mat}; return n; }
    void add(const NodeRef& c);
    void removeFromParent();
    void removeAllChildren();
    void setEuler(V3 e) { euler = e; orientation = Quat::euler(e); }
    void setScale(float s) { scale = V3(s, s, s); }
    void runAction(ActionRef a, std::function<void()> completion = {});
    void removeAllActions() { actions.clear(); }
    void updateActions(float dt);
    M4 localMatrix() const { return M4::trs(position, orientation, scale); }
    M4 worldMatrix() const;
    V3 worldPosition() const { return worldMatrix().translation(); }
    /// SceneKit simdConvertPosition(p, from: other) – other's local point in this node's space
    V3 convertPosition(V3 p, const Node* from) const;
    /// turn so that -Z looks at target (SCNNode.simdLook(at:))
    void lookAt(V3 target, V3 up = V3(0, 1, 0));
    NodeRef childNamed(const std::string& n) const;
    void enumerate(const std::function<void(Node&)>& f);
    bool inTree(const Node* root) const;
};

namespace Geo {
/// Node helper: geometry + material + position (+ Euler rotation) attached to a parent (Swift Geo.part).
NodeRef part(const NodeRef& parent, MeshRef g, MatRef m, V3 pos, V3 rot = V3(0, 0, 0), bool shadow = true);
/// Camera-facing additive glow sprite.
NodeRef glowSprite(float size, V3 c, float intensity = 1, TexRef image = nullptr);
}

/// Rotate a node so that its local +Z axis points along dir.
void orientZ(Node& node, V3 dir);
/// Rotation that maps +Y onto dir, at pos (particle bursts along a surface normal).
M4 transformY(V3 dir, V3 pos);

// MARK: - scene + camera

struct Camera {
    float fieldOfView = 60, zNear = 0.03f, zFar = 600;
    float exposureOffset = 0, bloomIntensity = 0.45f, bloomThreshold = 1;
    float vignettingIntensity = 0.55f, vignettingPower = 1.3f;
    float colorFringeStrength = 0.6f;
    float saturation = 1.12f, contrast = 0.18f;
};

struct Scene {
    NodeRef root = Node::make();
    TexRef background;                 // equirect sky
    float backgroundIntensity = 1;
    float lightingEnvironmentIntensity = 1;
    V3 fogColor;
    float fogStart = 0, fogEnd = 0, fogExponent = 1;
    V3 gravity = V3(0, -16, 0);
    bool isPaused = false;
    std::vector<std::shared_ptr<Emitter>> emitters;
    /// SCNFloor at y = 0 that reflects the scene (Helix-9)
    float floorReflectivity = 0, floorReflectionFalloff = 14;

    void addParticleSystem(const ParticleSystem& s, const M4& transform);
    void attachParticleSystem(const NodeRef& n, const ParticleSystem& s);
    void update(float dt);             // actions + particles (skipped while paused)
};

// MARK: - debris physics (SCNPhysicsBody on the floor)

struct Body {
    NodeRef node;
    V3 vel, angAxis;
    float angSpeed = 0, restitution = 0.35f, friction = 0.8f, half = 0.1f;
};

// MARK: - renderer

struct Renderer;
Renderer* createRenderer(HWND hwnd, int w, int h, bool headless);
void rendererResize(Renderer* r, int w, int h);
/// draws the scene from `pov` (its -Z) and returns; ui is drawn afterwards with uiBegin/uiEnd
void renderScene(Renderer* r, Scene& scene, Node& pov, const Camera& cam, float time);
void present(Renderer* r);
/// RGBA8 copy of the last frame (screenshots)
Image readback(Renderer* r);
void setEnvironment(Renderer* r, TexRef sky, const std::vector<V4>& envPixels, int envW, int envH);
int rendererWidth(Renderer* r);
int rendererHeight(Renderer* r);
ID3D11RenderTargetView* rendererBackbuffer(Renderer* r);
/// 4x MSAA (default on); headless test runs may switch it off for speed
void setMSAA(Renderer* r, int samples);

/// map of sRGB 0..1 colour to linear
inline V3 lin(V3 c) { return srgbToLinear(c); }

/// RGB (screenshots) or RGBA when alpha is set (icon)
bool savePNG(const Image& img, const std::string& path, bool alpha = false);

/// light unit calibration (point/spot, sun, image based lighting) – tuned against the Mac screenshots
void setLightCalibration(float point, float sun, float env);
