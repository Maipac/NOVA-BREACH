// A small SpriteKit-like 2D layer for the HUD and menus: node tree with labels, shapes and sprites,
// actions, z ordering and hit testing. Text is rasterised with GDI into a glyph atlas (Bahnschrift).
// Coordinates are in pixels with the origin bottom-left, exactly like the SpriteKit overlay on the Mac.
#pragma once
#include "gfx.h"
#include <string>

struct UIColor {
    float r = 1, g = 1, b = 1, a = 1;   // sRGB + alpha
    UIColor() = default;
    constexpr UIColor(float r_, float g_, float b_, float a_ = 1) : r(r_), g(g_), b(b_), a(a_) {}
    static constexpr UIColor white(float w = 1, float a = 1) { return {w, w, w, a}; }
    static constexpr UIColor clear() { return {0, 0, 0, 0}; }
    UIColor withAlpha(float x) const { return {r, g, b, x}; }
    static UIColor of(V3 c, float a = 1) { return {c.x, c.y, c.z, a}; }
};

enum class FontId { Heavy, Demi, Mono };
enum class HAlign { Center, Left, Right };
enum class VAlign { Baseline, Center, Top, Bottom };

struct SKNode;
using SKRef = std::shared_ptr<SKNode>;

// MARK: actions (SKAction)

struct SKAction;
using SKActionRef = std::shared_ptr<SKAction>;
struct SKAction {
    float duration = 0;
    virtual ~SKAction() = default;
    virtual SKActionRef clone() const = 0;
    /// returns leftover time once finished (>= 0), -1 while running
    virtual float step(SKNode& n, float dt) = 0;
};
namespace SKA {
SKActionRef fadeIn(float d);
SKActionRef fadeOut(float d);
SKActionRef fadeAlpha(float to, float d);
SKActionRef wait(float d);
SKActionRef sequence(std::vector<SKActionRef> a);
SKActionRef group(std::vector<SKActionRef> a);
SKActionRef repeatForever(SKActionRef a);
SKActionRef scaleTo(float s, float d);
SKActionRef scaleXTo(float s, float d);
SKActionRef run(std::function<void()> f);
SKActionRef removeFromParent();
}

// MARK: nodes

struct Affine {
    float a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0;   // x' = a x + c y + tx, y' = b x + d y + ty
    V2 apply(V2 p) const { return {a * p.x + c * p.y + tx, b * p.x + d * p.y + ty}; }
    Affine operator*(const Affine& o) const {
        return {a * o.a + c * o.b, b * o.a + d * o.b, a * o.c + c * o.d, b * o.c + d * o.d, a * o.tx + c * o.ty + tx, b * o.tx + d * o.ty + ty};
    }
    Affine inverse() const {
        float det = a * d - b * c;
        if (std::fabs(det) < 1e-12f) return {};
        float ia = d / det, ib = -b / det, ic = -c / det, id = a / det;
        return {ia, ib, ic, id, -(ia * tx + ic * ty), -(ib * tx + id * ty)};
    }
    float scale() const { return std::sqrt(std::fabs(a * d - b * c)); }
};

struct UIBatch;
struct SKNode : std::enable_shared_from_this<SKNode> {
    V2 position;
    float zPosition = 0, zRotation = 0, alpha = 1, xScale = 1, yScale = 1;
    bool hidden = false;
    std::string name;
    SKNode* parent = nullptr;
    std::vector<SKRef> children;
    std::vector<std::pair<SKActionRef, std::function<void()>>> actions;

    virtual ~SKNode() = default;
    static SKRef make() { return std::make_shared<SKNode>(); }
    void addChild(const SKRef& c);
    void removeFromParent();
    void removeAllChildren();
    void run(SKActionRef a, std::function<void()> done = {});
    void removeAllActions() { actions.clear(); }
    void setScale(float s) { xScale = yScale = s; }
    Affine localTransform() const;
    void updateActions(float dt);
    void draw(UIBatch& b, const Affine& parentXf, float parentAlpha);
    virtual void drawSelf(UIBatch&, const Affine&, float) {}
    /// local-space bounds for hit testing (false: not hittable)
    virtual bool bounds(V2& lo, V2& hi) const { (void)lo; (void)hi; return false; }
};

struct SKLabel : SKNode {
    std::string text;
    FontId font = FontId::Demi;
    float fontSize = 32;
    UIColor fontColor;
    HAlign h = HAlign::Center;
    VAlign v = VAlign::Baseline;
    int numberOfLines = 1;
    float preferredMaxLayoutWidth = 0;
    void drawSelf(UIBatch& b, const Affine& xf, float alpha) override;
    bool bounds(V2& lo, V2& hi) const override;
};

struct SKShape : SKNode {
    std::vector<V2> pts;
    bool closed = true;
    UIColor fillColor = UIColor::clear();
    UIColor strokeColor = UIColor::white();
    float lineWidth = 1, glowWidth = 0;
    bool roundCap = false;
    static std::shared_ptr<SKShape> rect(V2 size, float cornerRadius = 0);
    static std::shared_ptr<SKShape> circle(float r);
    static std::shared_ptr<SKShape> path(std::vector<V2> pts, bool closed);
    void setPath(std::vector<V2> p, bool isClosed) { pts = std::move(p); closed = isClosed; }
    void drawSelf(UIBatch& b, const Affine& xf, float alpha) override;
    bool bounds(V2& lo, V2& hi) const override;
};

struct SKSprite : SKNode {
    TexRef texture;
    UIColor color = UIColor::white();
    V2 size;
    void drawSelf(UIBatch& b, const Affine& xf, float alpha) override;
    bool bounds(V2& lo, V2& hi) const override;
};

/// arc points (SpriteKit / CoreGraphics angles, counter-clockwise)
std::vector<V2> arcPoints(V2 c, float r, float a0, float a1, int segments = 24);

struct SKScene : SKNode {
    V2 size;
    /// actions of the whole tree
    void update(float dt);
    void render(ID3D11RenderTargetView* target, int w, int h);
    /// every node whose bounds contain p (scene coordinates), topmost first
    std::vector<SKNode*> nodesAt(V2 p);
};

void uiInit();
/// width of a single line of text in pixels at the given size
float textWidth(FontId f, float size, const std::string& s);
/// RGBA image of edge-darkening textures etc.
TexRef uiTexture(const Image& img);
