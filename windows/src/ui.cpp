// 2D node tree, actions, GDI glyph atlas and a batched Direct3D 11 renderer for the HUD.
#include "ui.h"
#include <windows.h>
#include <d3dcompiler.h>
#include <map>
#include <cstring>
#include <algorithm>

using namespace GFX;

// MARK: - actions

namespace {
struct Interp2 : SKAction {
    float t = 0;
    bool started = false;
    float step(SKNode& n, float dt) override {
        if (!started) { started = true; begin(n); }
        t += dt;
        float k = duration > 0 ? clampf(t / duration, 0, 1) : 1;
        apply(n, k);
        return t >= duration ? t - duration : -1;
    }
    virtual void begin(SKNode&) {}
    virtual void apply(SKNode&, float) = 0;
};
struct Wait2 : Interp2 {
    SKActionRef clone() const override { auto c = std::make_shared<Wait2>(); c->duration = duration; return c; }
    void apply(SKNode&, float) override {}
};
struct Fade2 : Interp2 {
    float to = 0, from = 0;
    SKActionRef clone() const override { auto c = std::make_shared<Fade2>(); c->duration = duration; c->to = to; return c; }
    void begin(SKNode& n) override { from = n.alpha; }
    void apply(SKNode& n, float k) override { n.alpha = mixf(from, to, k); }
};
struct Scale2 : Interp2 {
    float to = 1, fx = 1, fy = 1;
    bool onlyX = false;
    SKActionRef clone() const override { auto c = std::make_shared<Scale2>(); c->duration = duration; c->to = to; c->onlyX = onlyX; return c; }
    void begin(SKNode& n) override { fx = n.xScale; fy = n.yScale; }
    void apply(SKNode& n, float k) override {
        n.xScale = mixf(fx, to, k);
        if (!onlyX) n.yScale = mixf(fy, to, k);
    }
};
struct Run2 : SKAction {
    std::function<void()> f;
    SKActionRef clone() const override { auto c = std::make_shared<Run2>(); c->f = f; return c; }
    float step(SKNode&, float dt) override { f(); return dt; }
};
struct Remove2 : SKAction {
    SKActionRef clone() const override { return std::make_shared<Remove2>(); }
    float step(SKNode& n, float dt) override { n.removeFromParent(); return dt; }
};
struct Seq2 : SKAction {
    std::vector<SKActionRef> list;
    size_t cur = 0;
    SKActionRef clone() const override { auto c = std::make_shared<Seq2>(); for (auto& a : list) c->list.push_back(a->clone()); return c; }
    float step(SKNode& n, float dt) override {
        while (cur < list.size()) {
            float left = list[cur]->step(n, dt);
            if (left < 0) return -1;
            cur++;
            dt = left;
        }
        return dt;
    }
};
struct Group2 : SKAction {
    std::vector<SKActionRef> list;
    std::vector<bool> done;
    SKActionRef clone() const override { auto c = std::make_shared<Group2>(); for (auto& a : list) c->list.push_back(a->clone()); return c; }
    float step(SKNode& n, float dt) override {
        if (done.empty()) done.assign(list.size(), false);
        bool all = true;
        float minLeft = 1e9f;
        for (size_t i = 0; i < list.size(); i++) {
            if (done[i]) continue;
            float left = list[i]->step(n, dt);
            if (left < 0) all = false; else { done[i] = true; minLeft = std::min(minLeft, left); }
        }
        return all ? (minLeft >= 1e9f ? 0 : minLeft) : -1;
    }
};
struct Forever2 : SKAction {
    SKActionRef proto, cur;
    SKActionRef clone() const override { auto c = std::make_shared<Forever2>(); c->proto = proto; return c; }
    float step(SKNode& n, float dt) override {
        for (int g = 0; g < 8; g++) {
            if (!cur) cur = proto->clone();
            float left = cur->step(n, dt);
            if (left < 0) return -1;
            cur = nullptr;
            dt = left;
            if (dt <= 0) return -1;
        }
        return -1;
    }
};
}

namespace SKA {
SKActionRef fadeIn(float d) { auto a = std::make_shared<Fade2>(); a->duration = d; a->to = 1; return a; }
SKActionRef fadeOut(float d) { auto a = std::make_shared<Fade2>(); a->duration = d; a->to = 0; return a; }
SKActionRef fadeAlpha(float to, float d) { auto a = std::make_shared<Fade2>(); a->duration = d; a->to = to; return a; }
SKActionRef wait(float d) { auto a = std::make_shared<Wait2>(); a->duration = d; return a; }
SKActionRef sequence(std::vector<SKActionRef> l) { auto a = std::make_shared<Seq2>(); a->list = std::move(l); return a; }
SKActionRef group(std::vector<SKActionRef> l) { auto a = std::make_shared<Group2>(); a->list = std::move(l); return a; }
SKActionRef repeatForever(SKActionRef x) { auto a = std::make_shared<Forever2>(); a->proto = x; return a; }
SKActionRef scaleTo(float s, float d) { auto a = std::make_shared<Scale2>(); a->duration = d; a->to = s; return a; }
SKActionRef scaleXTo(float s, float d) { auto a = std::make_shared<Scale2>(); a->duration = d; a->to = s; a->onlyX = true; return a; }
SKActionRef run(std::function<void()> f) { auto a = std::make_shared<Run2>(); a->f = std::move(f); return a; }
SKActionRef removeFromParent() { return std::make_shared<Remove2>(); }
}

// MARK: - nodes

void SKNode::addChild(const SKRef& c) {
    if (c->parent) c->removeFromParent();
    c->parent = this;
    children.push_back(c);
}
void SKNode::removeFromParent() {
    if (!parent) return;
    SKNode* p = parent;
    parent = nullptr;
    for (size_t i = 0; i < p->children.size(); i++)
        if (p->children[i].get() == this) { p->children.erase(p->children.begin() + i); break; }
}
void SKNode::removeAllChildren() {
    for (auto& c : children) c->parent = nullptr;
    children.clear();
}
void SKNode::run(SKActionRef a, std::function<void()> done) { actions.push_back({a->clone(), done}); }
Affine SKNode::localTransform() const {
    float c = std::cos(zRotation), s = std::sin(zRotation);
    return {c * xScale, s * xScale, -s * yScale, c * yScale, position.x, position.y};
}
void SKNode::updateActions(float dt) {
    if (actions.empty()) return;
    auto self = shared_from_this();
    for (size_t i = 0; i < actions.size();) {
        auto a = actions[i].first;
        float left = a->step(*this, dt);
        if (left >= 0) {
            auto done = actions[i].second;
            if (i < actions.size() && actions[i].first == a) actions.erase(actions.begin() + i);
            if (done) done();
        } else {
            i++;
        }
    }
}

// MARK: - glyph atlas (GDI)

namespace {
struct Glyph {
    float u0, v0, u1, v1;   // atlas uv
    int w, h;               // bitmap size in pixels
    int ox, oy;             // left bearing, top above baseline
    int advance;
};
struct FontFace {
    HFONT font = nullptr;
    std::vector<HFONT> fallbacks;
    int ascent = 0, descent = 0, lineHeight = 0;
    std::map<uint32_t, Glyph> glyphs;
};
struct Atlas {
    ID3D11Texture2D* tex = nullptr;
    ID3D11ShaderResourceView* srv = nullptr;
    int size = 2048;
    int x = 1, y = 1, rowH = 0;
};

HDC gdc = nullptr;
Atlas atlas;
std::map<std::pair<int, int>, FontFace> faces;

const wchar_t* faceNames[3][4] = {
    {L"Bahnschrift Condensed", L"Bahnschrift", L"Arial Narrow", L"Arial"},
    {L"Bahnschrift SemiBold Condensed", L"Bahnschrift Condensed", L"Arial Narrow", L"Arial"},
    {L"Consolas", L"Courier New", L"Lucida Console", L"Arial"},
};
const int faceWeights[3][4] = {
    {FW_BOLD, FW_BOLD, FW_BOLD, FW_BOLD},
    {FW_NORMAL, FW_SEMIBOLD, FW_NORMAL, FW_SEMIBOLD},
    {FW_BOLD, FW_BOLD, FW_BOLD, FW_BOLD},
};

HFONT pickFont(FontId f, int px) {
    int fi = (int)f;
    for (int i = 0; i < 4; i++) {
        HFONT h = CreateFontW(-px, 0, 0, 0, faceWeights[fi][i], FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_TT_PRECIS, CLIP_DEFAULT_PRECIS,
                              ANTIALIASED_QUALITY, DEFAULT_PITCH, faceNames[fi][i]);
        if (!h) continue;
        HGDIOBJ old = SelectObject(gdc, h);
        wchar_t got[64] = {};
        GetTextFaceW(gdc, 64, got);
        SelectObject(gdc, old);
        if (_wcsicmp(got, faceNames[fi][i]) == 0 || i == 3) return h;
        DeleteObject(h);
    }
    return (HFONT)GetStockObject(DEFAULT_GUI_FONT);
}

void resetAtlas() {
    atlas.x = 1; atlas.y = 1; atlas.rowH = 0;
    for (auto& f : faces) f.second.glyphs.clear();
    std::vector<uint8_t> zero((size_t)atlas.size * atlas.size, 0);
    ctx->UpdateSubresource(atlas.tex, 0, nullptr, zero.data(), atlas.size, 0);
}

FontFace& face(FontId f, int px) {
    px = std::max(6, std::min(px, 400));
    auto key = std::make_pair((int)f, px);
    auto it = faces.find(key);
    if (it != faces.end()) return it->second;
    FontFace ff;
    ff.font = pickFont(f, px);
    for (const wchar_t* fb : {L"Segoe UI Symbol", L"Segoe UI", L"Arial Unicode MS", L"Lucida Sans Unicode"})
        ff.fallbacks.push_back(CreateFontW(-px, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_TT_PRECIS, CLIP_DEFAULT_PRECIS,
                                           ANTIALIASED_QUALITY, DEFAULT_PITCH, fb));
    HGDIOBJ old = SelectObject(gdc, ff.font);
    TEXTMETRICW tm;
    GetTextMetricsW(gdc, &tm);
    SelectObject(gdc, old);
    ff.ascent = tm.tmAscent;
    ff.descent = tm.tmDescent;
    ff.lineHeight = tm.tmHeight + tm.tmExternalLeading;
    return faces.emplace(key, ff).first->second;
}

const Glyph& glyph(FontFace& ff, uint32_t ch) {
    auto it = ff.glyphs.find(ch);
    if (it != ff.glyphs.end()) return it->second;
    HGDIOBJ old = SelectObject(gdc, ff.font);
    WORD gi = 0;
    wchar_t wc = (wchar_t)ch;
    auto missing = [&]() { return GetGlyphIndicesW(gdc, &wc, 1, &gi, GGI_MARK_NONEXISTING_GLYPHS) != GDI_ERROR && gi == 0xFFFF; };
    bool found = !missing();
    for (size_t k = 0; !found && k < ff.fallbacks.size(); k++) {
        if (!ff.fallbacks[k]) continue;
        SelectObject(gdc, ff.fallbacks[k]);
        found = !missing();
    }
    if (!found && ch == 0x25C6) {
        // ◆ (cores) in no installed font: draw the diamond ourselves
        SelectObject(gdc, old);
        int sz = std::max(4, (int)(ff.ascent * 0.62f));
        if (atlas.x + sz + 1 >= atlas.size) { atlas.x = 1; atlas.y += atlas.rowH + 1; atlas.rowH = 0; }
        std::vector<uint8_t> px((size_t)sz * sz);
        for (int y = 0; y < sz; y++)
            for (int x = 0; x < sz; x++) {
                float d = std::fabs(x + 0.5f - sz / 2.f) + std::fabs(y + 0.5f - sz / 2.f);
                px[(size_t)y * sz + x] = (uint8_t)(clampf(sz / 2.f - d + 0.5f, 0, 1) * 255);
            }
        D3D11_BOX box{(UINT)atlas.x, (UINT)atlas.y, 0, (UINT)(atlas.x + sz), (UINT)(atlas.y + sz), 1};
        ctx->UpdateSubresource(atlas.tex, 0, &box, px.data(), sz, 0);
        float s = (float)atlas.size;
        Glyph g{};
        g.u0 = atlas.x / s; g.v0 = atlas.y / s; g.u1 = (atlas.x + sz) / s; g.v1 = (atlas.y + sz) / s;
        g.w = g.h = sz;
        g.ox = sz / 8;
        g.oy = (int)(ff.ascent * 0.68f);
        g.advance = sz + sz / 4;
        atlas.x += sz + 1;
        atlas.rowH = std::max(atlas.rowH, sz);
        return ff.glyphs.emplace(ch, g).first->second;
    }
    if (!found) SelectObject(gdc, ff.font);
    MAT2 m = {{0, 1}, {0, 0}, {0, 0}, {0, 1}};
    GLYPHMETRICS gm{};
    DWORD size = GetGlyphOutlineW(gdc, ch, GGO_GRAY8_BITMAP, &gm, 0, nullptr, &m);
    Glyph g{};
    g.advance = gm.gmCellIncX;
    if (size != GDI_ERROR && size > 0) {
        std::vector<uint8_t> buf(size);
        GetGlyphOutlineW(gdc, ch, GGO_GRAY8_BITMAP, &gm, size, buf.data(), &m);
        int w = gm.gmBlackBoxX, h = gm.gmBlackBoxY;
        int pitch = (w + 3) & ~3;
        if (atlas.x + w + 1 >= atlas.size) { atlas.x = 1; atlas.y += atlas.rowH + 1; atlas.rowH = 0; }
        if (atlas.y + h + 1 >= atlas.size) {
            // atlas full: start over (the HUD re-rasterises what it needs next frame)
            SelectObject(gdc, old);
            resetAtlas();
            return glyph(ff, ch);
        }
        std::vector<uint8_t> px((size_t)w * h);
        for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++) px[(size_t)y * w + x] = (uint8_t)std::min(255, buf[(size_t)y * pitch + x] * 255 / 64);
        D3D11_BOX box{(UINT)atlas.x, (UINT)atlas.y, 0, (UINT)(atlas.x + w), (UINT)(atlas.y + h), 1};
        ctx->UpdateSubresource(atlas.tex, 0, &box, px.data(), w, 0);
        float s = (float)atlas.size;
        g.u0 = atlas.x / s; g.v0 = atlas.y / s; g.u1 = (atlas.x + w) / s; g.v1 = (atlas.y + h) / s;
        g.w = w; g.h = h;
        g.ox = gm.gmptGlyphOrigin.x; g.oy = gm.gmptGlyphOrigin.y;
        atlas.x += w + 1;
        atlas.rowH = std::max(atlas.rowH, h);
    }
    SelectObject(gdc, old);
    return ff.glyphs.emplace(ch, g).first->second;
}

std::vector<uint32_t> utf8(const std::string& s) {
    std::vector<uint32_t> out;
    for (size_t i = 0; i < s.size();) {
        uint8_t c = (uint8_t)s[i];
        uint32_t cp;
        int n;
        if (c < 0x80) { cp = c; n = 1; }
        else if ((c >> 5) == 6) { cp = c & 0x1f; n = 2; }
        else if ((c >> 4) == 14) { cp = c & 0x0f; n = 3; }
        else { cp = c & 0x07; n = 4; }
        for (int k = 1; k < n && i + k < s.size(); k++) cp = (cp << 6) | ((uint8_t)s[i + k] & 0x3f);
        out.push_back(cp);
        i += n;
    }
    return out;
}

float lineWidthPx(FontFace& ff, const std::vector<uint32_t>& line) {
    float w = 0;
    for (uint32_t c : line) w += glyph(ff, c).advance;
    return w;
}

/// splits text into lines: explicit newlines, then word wrap at maxWidth (pixels) when > 0
std::vector<std::vector<uint32_t>> layoutLines(FontFace& ff, const std::string& text, float maxWidth, bool wrap) {
    std::vector<std::vector<uint32_t>> lines;
    std::vector<uint32_t> cps = utf8(text);
    std::vector<uint32_t> cur;
    auto flush = [&]() { lines.push_back(cur); cur.clear(); };
    if (!wrap || maxWidth <= 0) {
        for (uint32_t c : cps) { if (c == '\n') flush(); else cur.push_back(c); }
        flush();
        return lines;
    }
    std::vector<uint32_t> word;
    float curW = 0;
    float spaceW = (float)glyph(ff, ' ').advance;
    auto pushWord = [&]() {
        if (word.empty()) return;
        float ww = lineWidthPx(ff, word);
        if (!cur.empty() && curW + spaceW + ww > maxWidth) { flush(); curW = 0; }
        if (!cur.empty()) { cur.push_back(' '); curW += spaceW; }
        cur.insert(cur.end(), word.begin(), word.end());
        curW += ww;
        word.clear();
    };
    for (uint32_t c : cps) {
        if (c == '\n') { pushWord(); flush(); curW = 0; }
        else if (c == ' ') pushWord();
        else word.push_back(c);
    }
    pushWord();
    flush();
    return lines;
}
}

float textWidth(FontId f, float size, const std::string& s) {
    FontFace& ff = face(f, (int)std::lround(size));
    float w = 0;
    for (auto& l : layoutLines(ff, s, 0, false)) w = std::max(w, lineWidthPx(ff, l));
    return w;
}

// MARK: - batch renderer

struct UIVertex { V2 p; V2 uv; V4 c; float mode; };

struct UIBatch {
    std::vector<UIVertex> v;
    struct Call { ID3D11ShaderResourceView* tex; uint32_t start, count; };
    std::vector<Call> calls;
    void use(ID3D11ShaderResourceView* tex) {
        if (calls.empty() || calls.back().tex != tex) calls.push_back({tex, (uint32_t)v.size(), 0});
    }
    void tri(V2 a, V2 b, V2 c, V4 col, float mode = 0, V2 ua = V2(), V2 ub = V2(), V2 uc = V2()) {
        v.push_back({a, ua, col, mode}); v.push_back({b, ub, col, mode}); v.push_back({c, uc, col, mode});
        calls.back().count += 3;
    }
    void quad(V2 p0, V2 p1, V2 p2, V2 p3, V4 col, float mode = 0, V2 u0 = V2(0, 0), V2 u1 = V2(1, 0), V2 u2 = V2(0, 1), V2 u3 = V2(1, 1)) {
        tri(p0, p2, p1, col, mode, u0, u2, u1);
        tri(p1, p2, p3, col, mode, u1, u2, u3);
    }
};

namespace {
ID3D11VertexShader* uiVS = nullptr;
ID3D11PixelShader* uiPS = nullptr;
ID3D11InputLayout* uiIL = nullptr;
ID3D11Buffer* uiVB = nullptr;
ID3D11Buffer* uiCB = nullptr;
size_t uiCap = 0;
ID3D11BlendState* uiBlend = nullptr;
ID3D11RasterizerState* uiRS = nullptr;
ID3D11DepthStencilState* uiDS = nullptr;
ID3D11SamplerState* uiSamp = nullptr;
TexRef whiteTex;

const char* uiShader = R"(
cbuffer C : register(b0) { float4 screen; };
struct VI { float2 p : POSITION; float2 uv : TEXCOORD0; float4 c : COLOR; float mode : MODE; };
struct VO { float4 pos : SV_Position; float2 uv : TEXCOORD0; float4 c : COLOR; float mode : MODE; };
Texture2D tex : register(t0);
SamplerState s : register(s0);
VO vs(VI i) { VO o; o.pos = float4(i.p.x / screen.x * 2 - 1, i.p.y / screen.y * 2 - 1, 0, 1); o.uv = i.uv; o.c = i.c; o.mode = i.mode; return o; }
float4 ps(VO i) : SV_Target {
    if (i.mode < 0.5) return i.c;
    float4 t = tex.Sample(s, i.uv);
    if (i.mode < 1.5) return float4(i.c.rgb, i.c.a * t.r);
    return t * i.c;
}
)";

ID3DBlob* compileUI(const char* entry, const char* target) {
    ID3DBlob *code = nullptr, *err = nullptr;
    if (FAILED(D3DCompile(uiShader, strlen(uiShader), "ui.hlsl", nullptr, nullptr, entry, target, 0, 0, &code, &err))) {
        fprintf(stderr, "UI shader: %s\n", err ? (const char*)err->GetBufferPointer() : "?");
        exit(1);
    }
    return code;
}
}

void uiInit() {
    gdc = CreateCompatibleDC(nullptr);
    D3D11_TEXTURE2D_DESC td{};
    td.Width = td.Height = atlas.size; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_R8_UNORM; td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_DEFAULT; td.BindFlags = D3D11_BIND_SHADER_RESOURCE;
    std::vector<uint8_t> zero((size_t)atlas.size * atlas.size, 0);
    D3D11_SUBRESOURCE_DATA sd{zero.data(), (UINT)atlas.size, 0};
    device->CreateTexture2D(&td, &sd, &atlas.tex);
    device->CreateShaderResourceView(atlas.tex, nullptr, &atlas.srv);

    ID3DBlob* vs = compileUI("vs", "vs_5_0");
    device->CreateVertexShader(vs->GetBufferPointer(), vs->GetBufferSize(), nullptr, &uiVS);
    D3D11_INPUT_ELEMENT_DESC il[] = {
        {"POSITION", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 8, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"COLOR", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 16, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"MODE", 0, DXGI_FORMAT_R32_FLOAT, 0, 32, D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
    device->CreateInputLayout(il, 4, vs->GetBufferPointer(), vs->GetBufferSize(), &uiIL);
    vs->Release();
    ID3DBlob* ps = compileUI("ps", "ps_5_0");
    device->CreatePixelShader(ps->GetBufferPointer(), ps->GetBufferSize(), nullptr, &uiPS);
    ps->Release();
    D3D11_BUFFER_DESC bd{};
    bd.ByteWidth = 16; bd.Usage = D3D11_USAGE_DYNAMIC; bd.BindFlags = D3D11_BIND_CONSTANT_BUFFER; bd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
    device->CreateBuffer(&bd, nullptr, &uiCB);
    D3D11_BLEND_DESC bl{};
    bl.RenderTarget[0].BlendEnable = TRUE;
    bl.RenderTarget[0].SrcBlend = D3D11_BLEND_SRC_ALPHA;
    bl.RenderTarget[0].DestBlend = D3D11_BLEND_INV_SRC_ALPHA;
    bl.RenderTarget[0].BlendOp = D3D11_BLEND_OP_ADD;
    bl.RenderTarget[0].SrcBlendAlpha = D3D11_BLEND_ONE;
    bl.RenderTarget[0].DestBlendAlpha = D3D11_BLEND_INV_SRC_ALPHA;
    bl.RenderTarget[0].BlendOpAlpha = D3D11_BLEND_OP_ADD;
    bl.RenderTarget[0].RenderTargetWriteMask = D3D11_COLOR_WRITE_ENABLE_ALL;
    device->CreateBlendState(&bl, &uiBlend);
    D3D11_RASTERIZER_DESC rd{};
    rd.FillMode = D3D11_FILL_SOLID; rd.CullMode = D3D11_CULL_NONE; rd.DepthClipEnable = TRUE;
    device->CreateRasterizerState(&rd, &uiRS);
    D3D11_DEPTH_STENCIL_DESC dd{};
    device->CreateDepthStencilState(&dd, &uiDS);
    D3D11_SAMPLER_DESC sm{};
    sm.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
    sm.AddressU = sm.AddressV = sm.AddressW = D3D11_TEXTURE_ADDRESS_CLAMP;
    sm.MaxLOD = D3D11_FLOAT32_MAX;
    device->CreateSamplerState(&sm, &uiSamp);
    Image w; w.w = w.h = 1; w.px = {255, 255, 255, 255};
    whiteTex = makeTexture(w, false, false);
}

TexRef uiTexture(const Image& img) { return makeTexture(img, false, false); }

static V4 col4(const UIColor& c, float alpha) { return V4(c.r, c.g, c.b, c.a * alpha); }

// MARK: - drawing

void SKNode::draw(UIBatch& b, const Affine& parentXf, float parentAlpha) {
    if (hidden) return;
    float a = parentAlpha * alpha;
    if (a <= 0.001f) return;
    Affine xf = parentXf * localTransform();
    drawSelf(b, xf, a);
    if (children.empty()) return;
    std::vector<SKNode*> order;
    order.reserve(children.size());
    for (auto& c : children) order.push_back(c.get());
    std::stable_sort(order.begin(), order.end(), [](SKNode* x, SKNode* y) { return x->zPosition < y->zPosition; });
    for (SKNode* c : order) c->draw(b, xf, a);
}

void SKLabel::drawSelf(UIBatch& b, const Affine& xf, float a) {
    if (text.empty()) return;
    float s = xf.scale();
    int px = (int)std::lround(fontSize * s);
    if (px < 4) return;
    FontFace& ff = face(font, px);
    float maxW = preferredMaxLayoutWidth * s;
    auto lines = layoutLines(ff, text, maxW, numberOfLines == 0 && maxW > 0);
    float lh = (float)ff.lineHeight;
    float blockH = lh * (lines.size() - 1) + ff.ascent + ff.descent;
    V2 o = xf.apply(V2(0, 0));
    // baseline of the first line
    float base;
    switch (v) {
    case VAlign::Baseline: base = o.y; break;
    case VAlign::Top: base = o.y - ff.ascent; break;
    case VAlign::Bottom: base = o.y + blockH - ff.ascent; break;
    default: base = o.y + blockH / 2 - ff.ascent; break;
    }
    // block width for alignment of every line inside it
    std::vector<float> widths;
    for (auto& l : lines) widths.push_back(lineWidthPx(ff, l));
    V4 c = col4(fontColor, a);
    b.use(atlas.srv);
    for (size_t li = 0; li < lines.size(); li++) {
        float w = widths[li];
        float x = h == HAlign::Left ? o.x : (h == HAlign::Right ? o.x - w : o.x - w / 2);
        x = std::round(x);
        float y = std::round(base - li * lh);
        for (uint32_t ch : lines[li]) {
            const Glyph& g = glyph(ff, ch);
            if (g.w > 0) {
                float x0 = x + g.ox, y1 = y + g.oy, x1 = x0 + g.w, y0 = y1 - g.h;
                b.quad(V2(x0, y1), V2(x1, y1), V2(x0, y0), V2(x1, y0), c, 1, V2(g.u0, g.v0), V2(g.u1, g.v0), V2(g.u0, g.v1), V2(g.u1, g.v1));
            }
            x += g.advance;
        }
    }
}

bool SKLabel::bounds(V2& lo, V2& hi) const {
    float w = textWidth(font, fontSize, text);
    float x0 = h == HAlign::Left ? 0 : (h == HAlign::Right ? -w : -w / 2);
    float y0 = v == VAlign::Top ? -fontSize : (v == VAlign::Center ? -fontSize / 2 : (v == VAlign::Bottom ? 0 : -fontSize * 0.25f));
    lo = V2(x0, y0); hi = V2(x0 + w, y0 + fontSize);
    return true;
}

std::shared_ptr<SKShape> SKShape::rect(V2 size, float r) {
    auto s = std::make_shared<SKShape>();
    float hw = size.x / 2, hh = size.y / 2;
    r = std::min(r, std::min(hw, hh));
    if (r <= 0.01f) {
        s->pts = {V2(-hw, -hh), V2(hw, -hh), V2(hw, hh), V2(-hw, hh)};
    } else {
        V2 cs[4] = {V2(hw - r, -hh + r), V2(hw - r, hh - r), V2(-hw + r, hh - r), V2(-hw + r, -hh + r)};
        float start[4] = {-PI / 2, 0, PI / 2, PI};
        for (int k = 0; k < 4; k++)
            for (int i = 0; i <= 6; i++) {
                float an = start[k] + (PI / 2) * i / 6;
                s->pts.push_back(cs[k] + V2(std::cos(an), std::sin(an)) * r);
            }
    }
    return s;
}

std::shared_ptr<SKShape> SKShape::circle(float r) {
    auto s = std::make_shared<SKShape>();
    int n = std::max(16, std::min(64, (int)(r * 1.5f)));
    for (int i = 0; i < n; i++) s->pts.push_back(V2(std::cos(2 * PI * i / n), std::sin(2 * PI * i / n)) * r);
    return s;
}

std::shared_ptr<SKShape> SKShape::path(std::vector<V2> pts, bool closed) {
    auto s = std::make_shared<SKShape>();
    s->pts = std::move(pts);
    s->closed = closed;
    return s;
}

std::vector<V2> arcPoints(V2 c, float r, float a0, float a1, int segments) {
    std::vector<V2> p;
    for (int i = 0; i <= segments; i++) {
        float an = a0 + (a1 - a0) * i / segments;
        p.push_back(c + V2(std::cos(an), std::sin(an)) * r);
    }
    return p;
}

static void stroke(UIBatch& b, const std::vector<V2>& p, bool closed, float width, V4 col, bool roundCap) {
    size_t n = p.size();
    if (n < 2 || width <= 0 || col.w <= 0.001f) return;
    float hw = width / 2;
    auto normalAt = [&](size_t i) {
        V2 prev = closed ? p[(i + n - 1) % n] : p[i == 0 ? 0 : i - 1];
        V2 next = closed ? p[(i + 1) % n] : p[i + 1 >= n ? n - 1 : i + 1];
        V2 cur = p[i];
        V2 d0 = cur - prev, d1 = next - cur;
        if (!closed && i == 0) d0 = d1;
        if (!closed && i == n - 1) d1 = d0;
        V2 n0 = simd_normalize(V2(-d0.y, d0.x)), n1 = simd_normalize(V2(-d1.y, d1.x));
        V2 m = n0 + n1;
        float ml = simd_length(m);
        if (ml < 1e-4f) return n0 * hw;
        m = m / ml;
        float k = simd_dot(m, n1);
        return m * (hw / std::max(k, 0.3f));
    };
    size_t segs = closed ? n : n - 1;
    for (size_t i = 0; i < segs; i++) {
        size_t j = (i + 1) % n;
        V2 ni = normalAt(i), nj = normalAt(j);
        b.quad(p[i] + ni, p[j] + nj, p[i] - ni, p[j] - nj, col);
    }
    if (roundCap && !closed) {
        for (size_t e : {(size_t)0, n - 1}) {
            V2 c = p[e];
            for (int k = 0; k < 10; k++) {
                float a0 = 2 * PI * k / 10, a1 = 2 * PI * (k + 1) / 10;
                b.tri(c, c + V2(std::cos(a0), std::sin(a0)) * hw, c + V2(std::cos(a1), std::sin(a1)) * hw, col);
            }
        }
    }
}

void SKShape::drawSelf(UIBatch& b, const Affine& xf, float a) {
    if (pts.size() < 2) return;
    std::vector<V2> p;
    p.reserve(pts.size());
    for (auto& q : pts) p.push_back(xf.apply(q));
    float s = xf.scale();
    b.use(whiteTex->srv);
    V4 fc = col4(fillColor, a);
    if (closed && fc.w > 0.001f && p.size() >= 3) {
        V2 c(0, 0);
        for (auto& q : p) c += q;
        c = c / (float)p.size();
        for (size_t i = 0; i < p.size(); i++) b.tri(c, p[i], p[(i + 1) % p.size()], fc);
    }
    V4 sc = col4(strokeColor, a);
    if (sc.w > 0.001f && lineWidth > 0) {
        if (glowWidth > 0) {
            stroke(b, p, closed, (lineWidth + glowWidth * 2.2f) * s, V4(sc.x, sc.y, sc.z, sc.w * 0.12f), roundCap);
            stroke(b, p, closed, (lineWidth + glowWidth * 1.1f) * s, V4(sc.x, sc.y, sc.z, sc.w * 0.22f), roundCap);
        }
        stroke(b, p, closed, std::max(1.0f, lineWidth * s), sc, roundCap);
    }
}

bool SKShape::bounds(V2& lo, V2& hi) const {
    if (pts.empty()) return false;
    lo = hi = pts[0];
    for (auto& q : pts) { lo = V2(std::min(lo.x, q.x), std::min(lo.y, q.y)); hi = V2(std::max(hi.x, q.x), std::max(hi.y, q.y)); }
    return true;
}

void SKSprite::drawSelf(UIBatch& b, const Affine& xf, float a) {
    V2 h = size * 0.5f;
    V2 p0 = xf.apply(V2(-h.x, h.y)), p1 = xf.apply(V2(h.x, h.y)), p2 = xf.apply(V2(-h.x, -h.y)), p3 = xf.apply(V2(h.x, -h.y));
    b.use(texture ? texture->srv : whiteTex->srv);
    b.quad(p0, p1, p2, p3, col4(color, a), 2, V2(0, 0), V2(1, 0), V2(0, 1), V2(1, 1));
}

bool SKSprite::bounds(V2& lo, V2& hi) const {
    lo = size * -0.5f; hi = size * 0.5f;
    return true;
}

// MARK: - scene

void SKScene::update(float dt) {
    std::vector<SKRef> list;
    std::function<void(const SKRef&)> collect = [&](const SKRef& n) {
        if (!n->actions.empty()) list.push_back(n);
        for (auto& c : n->children) collect(c);
    };
    for (auto& c : children) collect(c);
    if (!actions.empty()) updateActions(dt);
    for (auto& n : list) n->updateActions(dt);
}

void SKScene::render(ID3D11RenderTargetView* target, int w, int h) {
    UIBatch b;
    b.v.reserve(60000);
    Affine id;
    for (auto& c : children) (void)c;
    // root itself has no transform; draw children sorted by z
    std::vector<SKNode*> order;
    for (auto& c : children) order.push_back(c.get());
    std::stable_sort(order.begin(), order.end(), [](SKNode* x, SKNode* y) { return x->zPosition < y->zPosition; });
    for (SKNode* c : order) c->draw(b, id, alpha);
    if (b.v.empty()) return;
    if (b.v.size() > uiCap) {
        if (uiVB) uiVB->Release();
        uiCap = b.v.size() * 3 / 2;
        D3D11_BUFFER_DESC bd{};
        bd.ByteWidth = (UINT)(uiCap * sizeof(UIVertex));
        bd.Usage = D3D11_USAGE_DYNAMIC; bd.BindFlags = D3D11_BIND_VERTEX_BUFFER; bd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
        device->CreateBuffer(&bd, nullptr, &uiVB);
    }
    D3D11_MAPPED_SUBRESOURCE m;
    if (FAILED(ctx->Map(uiVB, 0, D3D11_MAP_WRITE_DISCARD, 0, &m))) return;
    memcpy(m.pData, b.v.data(), b.v.size() * sizeof(UIVertex));
    ctx->Unmap(uiVB, 0);
    float scr[4] = {(float)w, (float)h, 0, 0};
    if (SUCCEEDED(ctx->Map(uiCB, 0, D3D11_MAP_WRITE_DISCARD, 0, &m))) { memcpy(m.pData, scr, 16); ctx->Unmap(uiCB, 0); }
    ctx->OMSetRenderTargets(1, &target, nullptr);
    D3D11_VIEWPORT vp{0, 0, (float)w, (float)h, 0, 1};
    ctx->RSSetViewports(1, &vp);
    float bf[4] = {0, 0, 0, 0};
    ctx->OMSetBlendState(uiBlend, bf, 0xffffffff);
    ctx->OMSetDepthStencilState(uiDS, 0);
    ctx->RSSetState(uiRS);
    ctx->IASetInputLayout(uiIL);
    ctx->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
    UINT stride = sizeof(UIVertex), off = 0;
    ctx->IASetVertexBuffers(0, 1, &uiVB, &stride, &off);
    ctx->VSSetShader(uiVS, nullptr, 0);
    ctx->VSSetConstantBuffers(0, 1, &uiCB);
    ctx->PSSetShader(uiPS, nullptr, 0);
    ctx->PSSetSamplers(0, 1, &uiSamp);
    for (auto& c : b.calls) {
        if (c.count == 0) continue;
        ctx->PSSetShaderResources(0, 1, &c.tex);
        ctx->Draw(c.count, c.start);
    }
}

std::vector<SKNode*> SKScene::nodesAt(V2 p) {
    std::vector<SKNode*> hits;
    std::function<void(SKNode*, const Affine&)> visit = [&](SKNode* n, const Affine& pxf) {
        if (n->hidden || n->alpha <= 0.001f) return;
        Affine xf = pxf * n->localTransform();
        V2 lo, hi;
        if (n->bounds(lo, hi)) {
            V2 q = xf.inverse().apply(p);
            if (q.x >= lo.x && q.x <= hi.x && q.y >= lo.y && q.y <= hi.y) hits.push_back(n);
        }
        for (auto& c : n->children) visit(c.get(), xf);
    };
    Affine id;
    for (auto& c : children) visit(c.get(), id);
    std::reverse(hits.begin(), hits.end());
    return hits;
}
