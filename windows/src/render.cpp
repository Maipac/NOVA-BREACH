// Direct3D 11 renderer: sun shadow map, planar floor reflection, HDR scene pass with PBR + IBL,
// particles, first-person weapon pass, bloom and the final camera grade (ACES, saturation, contrast,
// vignette, colour fringe). Light units follow the calibration of the Electron port, which was matched
// against the Mac version: omni/spot candela = SceneKit intensity * 0.03, sun = intensity * 2.2 / 1900.
#include "gfx.h"
#include <d3dcompiler.h>
#include <dxgi.h>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace GFX;
template <class T> static void rel(T*& p) { if (p) { p->Release(); p = nullptr; } }

// Calibration against the Mac (SceneKit) look. SceneKit: 1000 = one "standard" light, and a white 1000 light
// lights a white surface to white; the shader's Lambert term divides by pi, so the scale carries pi.
static float kPointScale = 3 * PI;
static float kSunScale = PI;
static float kEnvScale = 2.2f;
void setLightCalibration(float point, float sun, float env) { kPointScale = point; kSunScale = sun; kEnvScale = env; }

static const char* kShaders = R"HLSL(
#define PI 3.14159265
#define MAXL 16
#define ENV_MIPS 6.0
// own acos/atan2: identical results everywhere (Wine's HLSL compiler lacks some intrinsics)
float acosA(float x) {
    float ax = abs(x);
    float r = (((-0.0187293 * ax + 0.0742610) * ax - 0.2121144) * ax + 1.5707288) * sqrt(1 - ax);
    return x < 0 ? PI - r : r;
}
float atan2A(float y, float x) {
    float ax = abs(x), ay = abs(y);
    float a = min(ax, ay) / max(max(ax, ay), 1e-8);
    float q = a * a;
    float r = ((-0.0464964749 * q + 0.15931422) * q - 0.327622764) * q * a + a;
    if (ay > ax) r = 1.57079637 - r;
    if (x < 0) r = 3.14159274 - r;
    if (y < 0) r = -r;
    return r;
}
cbuffer Frame : register(b0) {
    float4x4 viewProj;
    float4x4 shadowVP;
    float4x4 invViewProj;
    float4 camPos;      // xyz, time
    float4 sunDir;      // xyz towards the sun, env intensity
    float4 sunColor;    // rgb, shadows on
    float4 fogColor;    // rgb, start
    float4 fogParams;   // end, exponent, light count, sky intensity
    float4 screen;      // w, h, reflection on, reflection falloff
    float4 misc;        // floor reflectivity, reflection pass, 0, 0
    float4 sh[9];
    float4 lPos[MAXL];  // xyz, range
    float4 lCol[MAXL];  // rgb candela, type (0 omni, 1 spot)
    float4 lDir[MAXL];  // xyz direction, cos outer
    float4 lExt[MAXL];  // cos inner, category mask, attenuation start, falloff exponent
};
cbuffer Object : register(b1) {
    float4x4 world;
    float4x4 nrmMat;
    float4 diffuse;     // rgb linear, opacity
    float4 emission;    // rgb
    float4 pbr;         // roughness, metalness, roughness map scale, normal intensity
    float4 uvs;         // uv scale xy, category mask, reflective
    float4 color;       // rgb (glow / additive), opacity
    float4 params;
    uint4 flags;        // texture bits
};
cbuffer Post : register(b2) {
    float4 p0;          // texel xy, threshold, bloom strength
    float4 p1;          // saturation, contrast, vignette, vignette power
    float4 p2;          // fringe, exposure, 0, 0
};
Texture2D tAlbedo : register(t0);
Texture2D tNormal : register(t1);
Texture2D tRough : register(t2);
Texture2D tMetal : register(t3);
Texture2D tEmis : register(t4);
Texture2D tEnv : register(t5);
Texture2D<float> tShadow : register(t6);
Texture2D tRefl : register(t7);
SamplerState sWrap : register(s0);
SamplerState sClamp : register(s1);
SamplerComparisonState sShadow : register(s2);

struct VSIn { float3 p : POSITION; float3 n : NORMAL; float2 uv : TEXCOORD0; float4 t : TANGENT; };
struct VSOut {
    float4 pos : SV_Position;
    float3 wp : WPOS;
    float3 n : NORMAL;
    float4 t : TANGENT;
    float2 uv : TEXCOORD0;
};

VSOut vsMesh(VSIn i) {
    VSOut o;
    float4 wp = mul(world, float4(i.p, 1));
    o.wp = wp.xyz;
    o.pos = mul(viewProj, wp);
    o.n = normalize(mul((float3x3)nrmMat, i.n));
    o.t = float4(normalize(mul((float3x3)world, i.t.xyz)), i.t.w);
    o.uv = i.uv * uvs.xy;
    return o;
}

float4 vsShadow(VSIn i) : SV_Position { return mul(shadowVP, mul(world, float4(i.p, 1))); }

float2 equirect(float3 d) {
    float v = acosA(clamp(d.y, -1, 1)) / PI;
    float u = atan2A(d.z, d.x) / (2 * PI);
    return float2(u < 0 ? u + 1 : u, v);
}
float3 envAt(float3 d, float rough) { return tEnv.SampleLevel(sWrap, equirect(d), rough * ENV_MIPS).rgb; }
float3 shIrradiance(float3 n) {
    float3 r = sh[0].rgb * 0.886227;
    r += sh[1].rgb * 1.023328 * n.y + sh[2].rgb * 1.023328 * n.z + sh[3].rgb * 1.023328 * n.x;
    r += sh[4].rgb * 0.858086 * n.x * n.y + sh[5].rgb * 0.858086 * n.y * n.z + sh[6].rgb * 0.247708 * (3 * n.z * n.z - 1);
    r += sh[7].rgb * 0.858086 * n.x * n.z + sh[8].rgb * 0.429043 * (n.x * n.x - n.y * n.y);
    return max(r, 0) / PI;   // average radiance over the cosine lobe
}
float fogFactor(float3 wp) {
    float d = distance(wp, camPos.xyz);
    if (fogParams.x <= fogColor.w) return 0;
    return pow(saturate((d - fogColor.w) / (fogParams.x - fogColor.w)), fogParams.y);
}
float shadowAt(float3 wp, float3 n) {
    if (sunColor.w < 0.5) return 1;
    float4 s = mul(shadowVP, float4(wp + n * 0.05, 1));
    float2 uv = s.xy * float2(0.5, -0.5) + 0.5;
    if (any(uv < 0) || any(uv > 1) || s.z > 1) return 1;
    float z = s.z - 0.0006;
    float sum = 0;
    float tx = 1.0 / 4096;
    [unroll] for (int y = -1; y <= 1; y++)
        [unroll] for (int x = -1; x <= 1; x++) sum += tShadow.SampleCmpLevelZero(sShadow, uv + float2(x, y) * tx * 1.5, z);
    // SceneKit shadowColor alpha 0.88: shadows never go fully black
    return lerp(1, sum / 9, 0.88);
}
float D_GGX(float NoH, float a) { float a2 = a * a; float d = NoH * NoH * (a2 - 1) + 1; return a2 / (PI * d * d); }
float V_Smith(float NoV, float NoL, float a) {
    float a2 = a * a;
    float gv = NoL * sqrt(NoV * NoV * (1 - a2) + a2);
    float gl = NoV * sqrt(NoL * NoL * (1 - a2) + a2);
    return 0.5 / max(gv + gl, 1e-5);
}
float3 F_Schlick(float3 f0, float VoH) { return f0 + (1 - f0) * pow(1 - VoH, 5); }
float3 envBRDF(float3 f0, float rough, float NoV) {
    const float4 c0 = float4(-1, -0.0275, -0.572, 0.022);
    const float4 c1 = float4(1, 0.0425, 1.04, -0.04);
    float4 r = rough * c0 + c1;
    float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
    float2 ab = float2(-1.04, 1.04) * a004 + r.zw;
    return f0 * ab.x + ab.y;
}
float3 direct(float3 N, float3 V, float3 L, float3 radiance, float3 dc, float3 f0, float a) {
    float NoL = saturate(dot(N, L));
    if (NoL <= 0) return 0;
    // punctual lights: keep highlights from collapsing into blinding pin points on the shiny floor
    a = max(a, 0.16);
    float3 H = normalize(L + V);
    float NoV = max(dot(N, V), 1e-4), NoH = saturate(dot(N, H)), VoH = saturate(dot(V, H));
    float3 spec = F_Schlick(f0, VoH) * D_GGX(NoH, a) * V_Smith(NoV, NoL, a);
    return radiance * NoL * (dc / PI + spec);
}

float4 finish(float3 c, float alpha, float3 wp) {
    // reflection pass: only what is above the floor
    if (misc.y > 0.5) clip(wp.y + 0.01);
    c = lerp(c, fogColor.rgb, fogFactor(wp));
    // the reflection pass stores the height above the floor for the reflection falloff
    return float4(c, misc.y > 0.5 ? wp.y : alpha);
}

float4 psPBR(VSOut i, bool front : SV_IsFrontFace) : SV_Target {
    float3 N = normalize(i.n);
    if (!front) N = -N;
    float3 albedo = diffuse.rgb;
    if (flags.x & 1) albedo *= tAlbedo.Sample(sWrap, i.uv).rgb;
    if (flags.x & 2) {
        float3 nm = tNormal.Sample(sWrap, i.uv).xyz * 2 - 1;
        nm.xy *= pbr.w;
        float3 T = normalize(i.t.xyz - N * dot(N, i.t.xyz));
        float3 B = cross(N, T) * i.t.w;
        N = normalize(T * nm.x - B * nm.y + N * nm.z);
    }
    float rough = (flags.x & 4) ? tRough.Sample(sWrap, i.uv).r * pbr.z : pbr.x;
    float metal = (flags.x & 8) ? tMetal.Sample(sWrap, i.uv).r : pbr.y;
    rough = clamp(rough, 0.045, 1);
    metal = saturate(metal);
    float3 V = normalize(camPos.xyz - i.wp);
    float a = rough * rough;
    float3 dc = albedo * (1 - metal);
    float3 f0 = lerp(0.04, albedo, metal);
    float3 c = 0;
    int mask = (int)uvs.z;
    c += direct(N, V, sunDir.xyz, sunColor.rgb * shadowAt(i.wp, normalize(i.n)), dc, f0, a);
    int nl = (int)fogParams.z;
    for (int k = 0; k < nl; k++) {
        if (((int)lExt[k].y & mask) == 0) continue;
        float3 Lv = lPos[k].xyz - i.wp;
        float d = length(Lv);
        float range = lPos[k].w;
        if (d > range) continue;
        float3 L = Lv / d;
        // SceneKit: full strength up to attenuationStart, then (1 - t)^exponent down to zero at attenuationEnd
        float t = saturate((d - lExt[k].z) / max(range - lExt[k].z, 0.001));
        float att = pow(1 - t, lExt[k].w);
        if (lCol[k].w > 0.5) {
            float cd = dot(-L, lDir[k].xyz);
            att *= smoothstep(lDir[k].w, lExt[k].x, cd);
        }
        c += direct(N, V, L, lCol[k].rgb * att, dc, f0, a);
    }
    float NoV = max(dot(N, V), 1e-4);
    float3 R = reflect(-V, N);
    c += shIrradiance(N) * dc * sunDir.w;
    c += envAt(R, rough) * envBRDF(f0, rough, NoV) * sunDir.w;
    float3 em = emission.rgb;
    if (flags.x & 16) em *= tEmis.Sample(sWrap, i.uv).rgb;
    c += em;
    if (uvs.w > 0.5 && screen.z > 0.5) {
        float4 r = tRefl.Sample(sClamp, i.pos.xy / screen.xy);
        float fade = 1 - saturate(r.a / screen.w);
        c += r.rgb * misc.x * fade;
    }
    return finish(c, diffuse.a, i.wp);
}

float4 psGlow(VSOut i) : SV_Target { return finish(color.rgb, color.a, i.wp); }

float4 psAdd(VSOut i) : SV_Target {
    float3 c = tAlbedo.Sample(sWrap, i.uv).rgb * color.rgb * color.a;
    return float4(c * (1 - fogFactor(i.wp)), 1);
}

float4 psPortal(VSOut i) : SV_Target {
    float2 uv = i.uv;
    float t = camPos.w;
    float2 c = uv - 0.5;
    float r = length(c);
    float an = atan2A(c.y, c.x);
    float swirl = sin(an * 3.0 + r * 18.0 - t * 3.0) * 0.5 + 0.5;
    float wave = sin(r * 30.0 - t * 5.0) * 0.5 + 0.5;
    float hexv = tAlbedo.Sample(sWrap, uv).r;
    float3 hot = float3(1.0, 0.25, 0.08);
    float3 col = hot * (0.15 + 0.9 * swirl * (1.0 - r) + hexv * (0.6 + 1.0 * wave));
    col *= (1.0 + params.x * 3.0);
    return finish(col, color.a, i.wp);
}

float4 psFence(VSOut i) : SV_Target {
    float2 uv = i.uv;
    float t = camPos.w;
    float vN = saturate(uv.y / params.x);
    float hexv = tAlbedo.Sample(sWrap, uv).r;
    float scan = sin(uv.y * 5.0 - t * 2.2 + uv.x * 0.6) * 0.5 + 0.5;
    float3 col = params.yzw * (0.03 + hexv * 0.4 * (0.45 + 0.55 * scan)) * (0.1 + 0.9 * vN * vN);
    return float4(col * color.a * (1 - fogFactor(i.wp)), 1);
}

float4 psEnergy(VSOut i) : SV_Target {
    float2 uv = i.uv;
    float t = camPos.w;
    float f1 = sin(uv.y * 26.0 - t * 7.0 + sin(uv.x * 12.566 + t) * 2.0) * 0.5 + 0.5;
    float f2 = sin(uv.y * 70.0 - t * 13.0 + uv.x * 25.13) * 0.5 + 0.5;
    float pulse = 0.85 + 0.15 * sin(t * 2.3);
    float3 base = float3(0.10, 0.55, 0.95);
    float3 hot = float3(0.75, 1.0, 1.0);
    float3 col = lerp(base, hot, f1 * f1 * 0.7) * (0.55 + 0.75 * f1 + 0.3 * f2) * pulse;
    return finish(col, color.a, i.wp);
}

// particles
struct PIn { float3 p : POSITION; float2 uv : TEXCOORD0; float4 c : COLOR; };
struct POut { float4 pos : SV_Position; float2 uv : TEXCOORD0; float4 c : COLOR; float3 wp : WPOS; };
POut vsParticle(PIn i) { POut o; o.pos = mul(viewProj, float4(i.p, 1)); o.uv = i.uv; o.c = i.c; o.wp = i.p; return o; }
float4 psParticleAdd(POut i) : SV_Target {
    float4 t = tAlbedo.Sample(sClamp, i.uv);
    float k = t.a * i.c.a * (1 - fogFactor(i.wp));
    return float4(t.rgb * i.c.rgb * k, 1);
}
float4 psParticleAlpha(POut i) : SV_Target {
    float4 t = tAlbedo.Sample(sClamp, i.uv);
    float3 c = lerp(t.rgb * i.c.rgb, fogColor.rgb, fogFactor(i.wp));
    return float4(c, t.a * i.c.a);
}

// fullscreen passes
struct FOut { float4 pos : SV_Position; float2 uv : TEXCOORD0; };
FOut vsFull(uint id : SV_VertexID) {
    FOut o;
    float2 uv = float2((id << 1) & 2, id & 2);
    o.uv = uv;
    o.pos = float4(uv * float2(2, -2) + float2(-1, 1), 0, 1);
    return o;
}
float4 psSky(FOut i) : SV_Target {
    float2 ndc = float2(i.uv.x * 2 - 1, 1 - i.uv.y * 2);
    float4 w = mul(invViewProj, float4(ndc, 1, 1));
    float3 d = normalize(w.xyz / w.w - camPos.xyz);
    float3 c = tAlbedo.SampleLevel(sWrap, equirect(d), 0).rgb * fogParams.w;
    return float4(c, 1000);
}
float4 psBright(FOut i) : SV_Target {
    float2 t = p0.xy;
    float3 c = 0;
    c += tAlbedo.Sample(sClamp, i.uv + t * float2(-0.5, -0.5)).rgb;
    c += tAlbedo.Sample(sClamp, i.uv + t * float2(0.5, -0.5)).rgb;
    c += tAlbedo.Sample(sClamp, i.uv + t * float2(-0.5, 0.5)).rgb;
    c += tAlbedo.Sample(sClamp, i.uv + t * float2(0.5, 0.5)).rgb;
    c *= 0.25;
    float l = dot(c, float3(0.2126, 0.7152, 0.0722));
    float k = smoothstep(p0.z, p0.z + 0.25, l);
    return float4(min(c * k, 64), 1);
}
float4 psDown(FOut i) : SV_Target {
    float2 t = p0.xy;
    float3 c = tAlbedo.Sample(sClamp, i.uv).rgb * 0.125;
    c += (tAlbedo.Sample(sClamp, i.uv + t * float2(-1, -1)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(1, -1)).rgb +
          tAlbedo.Sample(sClamp, i.uv + t * float2(-1, 1)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(1, 1)).rgb) * 0.125;
    c += (tAlbedo.Sample(sClamp, i.uv + t * float2(-2, 0)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(2, 0)).rgb +
          tAlbedo.Sample(sClamp, i.uv + t * float2(0, -2)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(0, 2)).rgb) * 0.0625;
    c += (tAlbedo.Sample(sClamp, i.uv + t * float2(-2, -2)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(2, -2)).rgb +
          tAlbedo.Sample(sClamp, i.uv + t * float2(-2, 2)).rgb + tAlbedo.Sample(sClamp, i.uv + t * float2(2, 2)).rgb) * 0.03125;
    c += tAlbedo.Sample(sClamp, i.uv).rgb * 0.125;
    return float4(c, 1);
}
float4 psBlur(FOut i) : SV_Target {
    // 9-tap gaussian along p0.xy (texel step in one direction)
    const float w[5] = {0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216};
    float3 c = tAlbedo.Sample(sClamp, i.uv).rgb * w[0];
    [unroll] for (int k = 1; k < 5; k++) {
        c += tAlbedo.Sample(sClamp, i.uv + p0.xy * k).rgb * w[k];
        c += tAlbedo.Sample(sClamp, i.uv - p0.xy * k).rgb * w[k];
    }
    return float4(c, 1);
}
float3 RRTAndODTFit(float3 v) {
    float3 a = v * (v + 0.0245786) - 0.000090537;
    float3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
}
float3 aces(float3 c) {
    const float3x3 inM = float3x3(0.59719, 0.35458, 0.04823, 0.07600, 0.90834, 0.01566, 0.02840, 0.13383, 0.83777);
    const float3x3 outM = float3x3(1.60475, -0.53108, -0.07367, -0.10208, 1.10813, -0.00605, -0.00327, -0.07276, 1.07602);
    c = mul(inM, c / 0.6);
    c = RRTAndODTFit(c);
    return saturate(mul(outM, c));
}
float3 toSRGB(float3 c) { return lerp(c * 12.92, 1.055 * pow(max(c, 0), 1.0 / 2.4) - 0.055, step(0.0031308, c)); }
Texture2D tB1 : register(t1);
Texture2D tB2 : register(t2);
Texture2D tB3 : register(t3);
Texture2D tB4 : register(t4);
Texture2D tB5 : register(t5);
float4 psFinal(FOut i) : SV_Target {
    float2 c = i.uv - 0.5;
    float r2 = dot(c, c);
    float2 off = c * p2.x * r2 * 4.0;
    float3 col = float3(tAlbedo.Sample(sClamp, i.uv - off).r, tAlbedo.Sample(sClamp, i.uv).g, tAlbedo.Sample(sClamp, i.uv + off).b);
    // SceneKit's bloom is tight (bloomBlurRadius 12 px): mostly the fine levels, a faint wide halo
    float3 bloom = tB1.Sample(sClamp, i.uv).rgb * 0.9 + tB2.Sample(sClamp, i.uv).rgb * 0.55 + tB3.Sample(sClamp, i.uv).rgb * 0.28 +
                   tB4.Sample(sClamp, i.uv).rgb * 0.12 + tB5.Sample(sClamp, i.uv).rgb * 0.05;
    col += bloom * p0.w;
    col = aces(col * p2.y);
    float luma = dot(col, float3(0.2126, 0.7152, 0.0722));
    col = max(lerp(luma, col, p1.x), 0);
    float v = pow(saturate(length(c) * 1.4142), 2.0 * p1.w);
    col *= 1.0 - p1.z * v;
    float3 s = toSRGB(col);
    s = saturate((s - 0.5) * (1.0 + p1.y) + 0.5);
    return float4(s, 1);
}
)HLSL";

// MARK: - renderer state

struct RT {
    ID3D11Texture2D* tex = nullptr;
    ID3D11RenderTargetView* rtv = nullptr;
    ID3D11ShaderResourceView* srv = nullptr;
    int w = 0, h = 0;
    void release() { rel(srv); rel(rtv); rel(tex); }
};

struct FrameCB {
    M4 viewProj, shadowVP, invViewProj;
    V4 camPos, sunDir, sunColor, fogColor, fogParams, screen, misc;
    V4 sh[9];
    V4 lPos[16], lCol[16], lDir[16], lExt[16];
};
struct ObjectCB {
    M4 world, nrmMat;
    V4 diffuse, emission, pbr, uvs, color, params;
    uint32_t flags[4];
};
struct PostCB { V4 p0, p1, p2; };

struct PVertex { V3 p; V2 uv; V4 c; };

struct Renderer {
    HWND hwnd = nullptr;
    IDXGISwapChain* sc = nullptr;
    bool headless = false;
    int w = 0, h = 0, msaa = 4;
    ID3D11Texture2D* backTex = nullptr;
    ID3D11RenderTargetView* backRTV = nullptr;
    ID3D11Texture2D* hdrMS = nullptr;
    ID3D11RenderTargetView* hdrMSRTV = nullptr;
    ID3D11Texture2D* depthMS = nullptr;
    ID3D11DepthStencilView* depthDSV = nullptr;
    RT hdr, refl, bloom[5], bloomTmp[5];
    ID3D11Texture2D* reflDepth = nullptr;
    ID3D11DepthStencilView* reflDSV = nullptr;
    ID3D11Texture2D* shadowTex = nullptr;
    ID3D11DepthStencilView* shadowDSV = nullptr;
    ID3D11ShaderResourceView* shadowSRV = nullptr;
    int shadowSize = 4096;
    TexRef sky, env, white;
    V4 sh[9];

    ID3D11VertexShader *vsMesh = nullptr, *vsShadow = nullptr, *vsFull = nullptr, *vsParticle = nullptr;
    ID3D11PixelShader *psPBR = nullptr, *psGlow = nullptr, *psAdd = nullptr, *psPortal = nullptr, *psFence = nullptr, *psEnergy = nullptr;
    ID3D11PixelShader *psSky = nullptr, *psBright = nullptr, *psDown = nullptr, *psBlur = nullptr, *psFinal = nullptr;
    ID3D11PixelShader *psParticleAdd = nullptr, *psParticleAlpha = nullptr;
    ID3D11InputLayout *ilMesh = nullptr, *ilParticle = nullptr;
    ID3D11Buffer *cbFrame = nullptr, *cbObject = nullptr, *cbPost = nullptr, *particleVB = nullptr;
    size_t particleCap = 0;
    ID3D11SamplerState *sWrap = nullptr, *sClamp = nullptr, *sShadow = nullptr;
    ID3D11RasterizerState *rsBack = nullptr, *rsNone = nullptr, *rsFront = nullptr, *rsShadow = nullptr;
    ID3D11DepthStencilState *dsDefault = nullptr, *dsNoWrite = nullptr, *dsOff = nullptr, *dsShadow = nullptr;
    ID3D11BlendState *bsOpaque = nullptr, *bsAdd = nullptr, *bsAlpha = nullptr;
};

int rendererWidth(Renderer* r) { return r->w; }
int rendererHeight(Renderer* r) { return r->h; }
ID3D11RenderTargetView* rendererBackbuffer(Renderer* r) { return r->backRTV; }

static ID3DBlob* compile(const char* entry, const char* target) {
    ID3DBlob *code = nullptr, *err = nullptr;
    HRESULT hr = D3DCompile(kShaders, strlen(kShaders), "nova.hlsl", nullptr, nullptr, entry, target, D3DCOMPILE_OPTIMIZATION_LEVEL2, 0, &code, &err);
    if (FAILED(hr)) {
        char msg[4096];
        snprintf(msg, sizeof msg, "Shader %s: %s", entry, err ? (const char*)err->GetBufferPointer() : "?");
        fprintf(stderr, "%s\n", msg);
        fflush(stderr);
        if (!getenv("NOVA_NO_DIALOGS")) MessageBoxA(nullptr, msg, "NOVA BREACH", MB_ICONERROR);
        exit(1);
    }
    if (err) err->Release();
    return code;
}
static ID3D11PixelShader* ps(const char* e) {
    ID3DBlob* b = compile(e, "ps_5_0");
    ID3D11PixelShader* s = nullptr;
    device->CreatePixelShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, &s);
    b->Release();
    return s;
}
static ID3D11Buffer* makeCB(size_t size) {
    D3D11_BUFFER_DESC bd{};
    bd.ByteWidth = (UINT)((size + 15) & ~15);
    bd.Usage = D3D11_USAGE_DYNAMIC;
    bd.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
    bd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
    ID3D11Buffer* b = nullptr;
    device->CreateBuffer(&bd, nullptr, &b);
    return b;
}
template <class T> static void upload(ID3D11Buffer* b, const T& data) {
    D3D11_MAPPED_SUBRESOURCE m;
    if (SUCCEEDED(ctx->Map(b, 0, D3D11_MAP_WRITE_DISCARD, 0, &m))) { memcpy(m.pData, &data, sizeof(T)); ctx->Unmap(b, 0); }
}

static RT makeRT(int w, int h, DXGI_FORMAT fmt) {
    RT r;
    r.w = std::max(1, w); r.h = std::max(1, h);
    D3D11_TEXTURE2D_DESC td{};
    td.Width = r.w; td.Height = r.h; td.MipLevels = 1; td.ArraySize = 1; td.Format = fmt;
    td.SampleDesc.Count = 1; td.Usage = D3D11_USAGE_DEFAULT;
    td.BindFlags = D3D11_BIND_RENDER_TARGET | D3D11_BIND_SHADER_RESOURCE;
    device->CreateTexture2D(&td, nullptr, &r.tex);
    device->CreateRenderTargetView(r.tex, nullptr, &r.rtv);
    device->CreateShaderResourceView(r.tex, nullptr, &r.srv);
    return r;
}

static void releaseTargets(Renderer* r) {
    rel(r->hdrMSRTV); rel(r->hdrMS); rel(r->depthDSV); rel(r->depthMS);
    r->hdr.release(); r->refl.release();
    rel(r->reflDSV); rel(r->reflDepth);
    for (auto& b : r->bloom) b.release();
    for (auto& b : r->bloomTmp) b.release();
    rel(r->backRTV); rel(r->backTex);
}

static ID3D11DepthStencilView* makeDepth(int w, int h, int samples, ID3D11Texture2D** tex) {
    D3D11_TEXTURE2D_DESC td{};
    td.Width = w; td.Height = h; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_D32_FLOAT;
    td.SampleDesc.Count = samples;
    td.Usage = D3D11_USAGE_DEFAULT;
    td.BindFlags = D3D11_BIND_DEPTH_STENCIL;
    device->CreateTexture2D(&td, nullptr, tex);
    D3D11_DEPTH_STENCIL_VIEW_DESC dd{};
    dd.Format = DXGI_FORMAT_D32_FLOAT;
    dd.ViewDimension = samples > 1 ? D3D11_DSV_DIMENSION_TEXTURE2DMS : D3D11_DSV_DIMENSION_TEXTURE2D;
    ID3D11DepthStencilView* v = nullptr;
    device->CreateDepthStencilView(*tex, &dd, &v);
    return v;
}

static void createTargets(Renderer* r) {
    if (r->headless) {
        D3D11_TEXTURE2D_DESC td{};
        td.Width = r->w; td.Height = r->h; td.MipLevels = 1; td.ArraySize = 1;
        td.Format = DXGI_FORMAT_R8G8B8A8_UNORM; td.SampleDesc.Count = 1;
        td.Usage = D3D11_USAGE_DEFAULT; td.BindFlags = D3D11_BIND_RENDER_TARGET;
        device->CreateTexture2D(&td, nullptr, &r->backTex);
    } else {
        r->sc->GetBuffer(0, __uuidof(ID3D11Texture2D), (void**)&r->backTex);
    }
    device->CreateRenderTargetView(r->backTex, nullptr, &r->backRTV);
    // MSAA support check for the HDR format
    UINT q = 0;
    if (r->msaa > 1 && (FAILED(device->CheckMultisampleQualityLevels(DXGI_FORMAT_R16G16B16A16_FLOAT, r->msaa, &q)) || q == 0)) r->msaa = 1;
    D3D11_TEXTURE2D_DESC td{};
    td.Width = r->w; td.Height = r->h; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_R16G16B16A16_FLOAT;
    td.SampleDesc.Count = r->msaa;
    td.Usage = D3D11_USAGE_DEFAULT;
    td.BindFlags = D3D11_BIND_RENDER_TARGET;
    device->CreateTexture2D(&td, nullptr, &r->hdrMS);
    device->CreateRenderTargetView(r->hdrMS, nullptr, &r->hdrMSRTV);
    r->depthDSV = makeDepth(r->w, r->h, r->msaa, &r->depthMS);
    r->hdr = makeRT(r->w, r->h, DXGI_FORMAT_R16G16B16A16_FLOAT);
    r->refl = makeRT(r->w / 2, r->h / 2, DXGI_FORMAT_R16G16B16A16_FLOAT);
    r->reflDSV = makeDepth(r->refl.w, r->refl.h, 1, &r->reflDepth);
    int bw = r->w, bh = r->h;
    for (int i = 0; i < 5; i++) {
        bw = std::max(1, bw / 2); bh = std::max(1, bh / 2);
        r->bloom[i] = makeRT(bw, bh, DXGI_FORMAT_R16G16B16A16_FLOAT);
        r->bloomTmp[i] = makeRT(bw, bh, DXGI_FORMAT_R16G16B16A16_FLOAT);
    }
}

Renderer* createRenderer(HWND hwnd, int w, int h, bool headless) {
    auto r = new Renderer;
    r->hwnd = hwnd; r->w = std::max(16, w); r->h = std::max(16, h); r->headless = headless;
    D3D_FEATURE_LEVEL fl[] = {D3D_FEATURE_LEVEL_11_0};
    HRESULT hr = E_FAIL;
    D3D_DRIVER_TYPE types[] = {D3D_DRIVER_TYPE_HARDWARE, D3D_DRIVER_TYPE_WARP};
    for (auto type : types) {
        if (headless) {
            hr = D3D11CreateDevice(nullptr, type, nullptr, 0, fl, 1, D3D11_SDK_VERSION, &device, nullptr, &ctx);
        } else {
            DXGI_SWAP_CHAIN_DESC sd{};
            sd.BufferCount = 2;
            sd.BufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
            sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
            sd.OutputWindow = hwnd;
            sd.SampleDesc.Count = 1;
            sd.Windowed = TRUE;
            sd.SwapEffect = (DXGI_SWAP_EFFECT)4; // FLIP_DISCARD (Windows 10+)
            hr = D3D11CreateDeviceAndSwapChain(nullptr, type, nullptr, 0, fl, 1, D3D11_SDK_VERSION, &sd, &r->sc, &device, nullptr, &ctx);
            if (FAILED(hr)) {
                sd.BufferCount = 1;
                sd.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;
                hr = D3D11CreateDeviceAndSwapChain(nullptr, type, nullptr, 0, fl, 1, D3D11_SDK_VERSION, &sd, &r->sc, &device, nullptr, &ctx);
            }
        }
        if (SUCCEEDED(hr)) break;
    }
    if (FAILED(hr)) {
        MessageBoxA(nullptr, "Direct3D 11 konnte nicht gestartet werden.\nBitte Grafiktreiber aktualisieren.", "NOVA BREACH", MB_ICONERROR);
        exit(1);
    }
    if (r->sc) {
        IDXGIFactory* f = nullptr;
        if (SUCCEEDED(r->sc->GetParent(__uuidof(IDXGIFactory), (void**)&f))) { f->MakeWindowAssociation(hwnd, DXGI_MWA_NO_ALT_ENTER); f->Release(); }
    }

    ID3DBlob* b = compile("vsMesh", "vs_5_0");
    device->CreateVertexShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, &r->vsMesh);
    D3D11_INPUT_ELEMENT_DESC mesh[] = {
        {"POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"NORMAL", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 12, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 24, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TANGENT", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 32, D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
    device->CreateInputLayout(mesh, 4, b->GetBufferPointer(), b->GetBufferSize(), &r->ilMesh);
    b->Release();
    b = compile("vsShadow", "vs_5_0");
    device->CreateVertexShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, &r->vsShadow);
    b->Release();
    b = compile("vsFull", "vs_5_0");
    device->CreateVertexShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, &r->vsFull);
    b->Release();
    b = compile("vsParticle", "vs_5_0");
    device->CreateVertexShader(b->GetBufferPointer(), b->GetBufferSize(), nullptr, &r->vsParticle);
    D3D11_INPUT_ELEMENT_DESC part[] = {
        {"POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 12, D3D11_INPUT_PER_VERTEX_DATA, 0},
        {"COLOR", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 20, D3D11_INPUT_PER_VERTEX_DATA, 0},
    };
    device->CreateInputLayout(part, 3, b->GetBufferPointer(), b->GetBufferSize(), &r->ilParticle);
    b->Release();
    r->psPBR = ps("psPBR"); r->psGlow = ps("psGlow"); r->psAdd = ps("psAdd");
    r->psPortal = ps("psPortal"); r->psFence = ps("psFence"); r->psEnergy = ps("psEnergy");
    r->psSky = ps("psSky"); r->psBright = ps("psBright"); r->psDown = ps("psDown"); r->psBlur = ps("psBlur"); r->psFinal = ps("psFinal");
    r->psParticleAdd = ps("psParticleAdd"); r->psParticleAlpha = ps("psParticleAlpha");

    r->cbFrame = makeCB(sizeof(FrameCB));
    r->cbObject = makeCB(sizeof(ObjectCB));
    r->cbPost = makeCB(sizeof(PostCB));

    D3D11_SAMPLER_DESC sd{};
    sd.Filter = D3D11_FILTER_ANISOTROPIC;
    sd.MaxAnisotropy = 8;
    sd.AddressU = sd.AddressV = sd.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
    sd.MaxLOD = D3D11_FLOAT32_MAX;
    device->CreateSamplerState(&sd, &r->sWrap);
    sd.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
    sd.AddressU = sd.AddressV = sd.AddressW = D3D11_TEXTURE_ADDRESS_CLAMP;
    device->CreateSamplerState(&sd, &r->sClamp);
    sd.Filter = D3D11_FILTER_COMPARISON_MIN_MAG_LINEAR_MIP_POINT;
    sd.ComparisonFunc = D3D11_COMPARISON_LESS_EQUAL;
    sd.AddressU = sd.AddressV = sd.AddressW = D3D11_TEXTURE_ADDRESS_BORDER;
    sd.BorderColor[0] = sd.BorderColor[1] = sd.BorderColor[2] = sd.BorderColor[3] = 1;
    device->CreateSamplerState(&sd, &r->sShadow);

    D3D11_RASTERIZER_DESC rd{};
    rd.FillMode = D3D11_FILL_SOLID;
    rd.CullMode = D3D11_CULL_BACK;
    rd.FrontCounterClockwise = TRUE;
    rd.DepthClipEnable = TRUE;
    rd.MultisampleEnable = TRUE;
    device->CreateRasterizerState(&rd, &r->rsBack);
    rd.CullMode = D3D11_CULL_NONE;
    device->CreateRasterizerState(&rd, &r->rsNone);
    rd.CullMode = D3D11_CULL_BACK;
    rd.FrontCounterClockwise = FALSE; // mirrored reflection pass flips the winding
    device->CreateRasterizerState(&rd, &r->rsFront);
    rd.CullMode = D3D11_CULL_NONE;
    rd.FrontCounterClockwise = TRUE;
    rd.SlopeScaledDepthBias = 1.5f;
    rd.DepthBiasClamp = 0.01f;
    device->CreateRasterizerState(&rd, &r->rsShadow);

    D3D11_DEPTH_STENCIL_DESC dd{};
    dd.DepthEnable = TRUE;
    dd.DepthWriteMask = D3D11_DEPTH_WRITE_MASK_ALL;
    dd.DepthFunc = D3D11_COMPARISON_GREATER_EQUAL; // reversed Z
    device->CreateDepthStencilState(&dd, &r->dsDefault);
    dd.DepthWriteMask = D3D11_DEPTH_WRITE_MASK_ZERO;
    device->CreateDepthStencilState(&dd, &r->dsNoWrite);
    dd.DepthEnable = FALSE;
    device->CreateDepthStencilState(&dd, &r->dsOff);
    dd.DepthEnable = TRUE;
    dd.DepthWriteMask = D3D11_DEPTH_WRITE_MASK_ALL;
    dd.DepthFunc = D3D11_COMPARISON_LESS_EQUAL;
    device->CreateDepthStencilState(&dd, &r->dsShadow);

    D3D11_BLEND_DESC bd{};
    bd.RenderTarget[0].RenderTargetWriteMask = D3D11_COLOR_WRITE_ENABLE_ALL;
    device->CreateBlendState(&bd, &r->bsOpaque);
    bd.RenderTarget[0].BlendEnable = TRUE;
    bd.RenderTarget[0].SrcBlend = D3D11_BLEND_ONE;
    bd.RenderTarget[0].DestBlend = D3D11_BLEND_ONE;
    bd.RenderTarget[0].BlendOp = D3D11_BLEND_OP_ADD;
    bd.RenderTarget[0].SrcBlendAlpha = D3D11_BLEND_ZERO;
    bd.RenderTarget[0].DestBlendAlpha = D3D11_BLEND_ONE;
    bd.RenderTarget[0].BlendOpAlpha = D3D11_BLEND_OP_ADD;
    device->CreateBlendState(&bd, &r->bsAdd);
    bd.RenderTarget[0].SrcBlend = D3D11_BLEND_SRC_ALPHA;
    bd.RenderTarget[0].DestBlend = D3D11_BLEND_INV_SRC_ALPHA;
    device->CreateBlendState(&bd, &r->bsAlpha);

    Image white; white.w = white.h = 1; white.px = {255, 255, 255, 255};
    r->white = makeTexture(white, false, false);

    D3D11_TEXTURE2D_DESC td{};
    td.Width = td.Height = r->shadowSize; td.MipLevels = 1; td.ArraySize = 1;
    td.Format = DXGI_FORMAT_R32_TYPELESS; td.SampleDesc.Count = 1;
    td.Usage = D3D11_USAGE_DEFAULT; td.BindFlags = D3D11_BIND_DEPTH_STENCIL | D3D11_BIND_SHADER_RESOURCE;
    device->CreateTexture2D(&td, nullptr, &r->shadowTex);
    D3D11_DEPTH_STENCIL_VIEW_DESC dsv{};
    dsv.Format = DXGI_FORMAT_D32_FLOAT; dsv.ViewDimension = D3D11_DSV_DIMENSION_TEXTURE2D;
    device->CreateDepthStencilView(r->shadowTex, &dsv, &r->shadowDSV);
    D3D11_SHADER_RESOURCE_VIEW_DESC srv{};
    srv.Format = DXGI_FORMAT_R32_FLOAT; srv.ViewDimension = D3D11_SRV_DIMENSION_TEXTURE2D; srv.Texture2D.MipLevels = 1;
    device->CreateShaderResourceView(r->shadowTex, &srv, &r->shadowSRV);

    for (auto& s : r->sh) s = V4(0, 0, 0, 0);
    createTargets(r);
    return r;
}

void rendererResize(Renderer* r, int w, int h) {
    w = std::max(16, w); h = std::max(16, h);
    if (w == r->w && h == r->h) return;
    ctx->OMSetRenderTargets(0, nullptr, nullptr);
    ctx->ClearState();
    releaseTargets(r);
    r->w = w; r->h = h;
    if (r->sc) r->sc->ResizeBuffers(0, w, h, DXGI_FORMAT_UNKNOWN, 0);
    createTargets(r);
}

void setMSAA(Renderer* r, int samples) {
    if (samples == r->msaa) return;
    ctx->ClearState();
    releaseTargets(r);
    r->msaa = samples;
    createTargets(r);
}

void present(Renderer* r) {
    if (r->sc) r->sc->Present(1, 0);
}

Image readback(Renderer* r) {
    Image img;
    D3D11_TEXTURE2D_DESC td;
    r->backTex->GetDesc(&td);
    td.Usage = D3D11_USAGE_STAGING; td.BindFlags = 0; td.CPUAccessFlags = D3D11_CPU_ACCESS_READ; td.MiscFlags = 0;
    ID3D11Texture2D* st = nullptr;
    if (FAILED(device->CreateTexture2D(&td, nullptr, &st))) return img;
    ctx->CopyResource(st, r->backTex);
    D3D11_MAPPED_SUBRESOURCE m;
    if (SUCCEEDED(ctx->Map(st, 0, D3D11_MAP_READ, 0, &m))) {
        img.w = td.Width; img.h = td.Height; img.channels = 4;
        img.px.resize((size_t)img.w * img.h * 4);
        for (int y = 0; y < img.h; y++) memcpy(&img.px[(size_t)y * img.w * 4], (uint8_t*)m.pData + (size_t)y * m.RowPitch, img.w * 4);
        ctx->Unmap(st, 0);
    }
    st->Release();
    return img;
}

// MARK: - environment (image based lighting)

static V3 equirectDir(float u, float v) {
    float ph = u * 2 * PI, th = v * PI;
    return V3(std::cos(ph) * std::sin(th), std::cos(th), std::sin(ph) * std::sin(th));
}

void setEnvironment(Renderer* r, TexRef sky, const std::vector<V4>& env, int w, int h) {
    r->sky = sky;
    // irradiance as 9 spherical harmonics
    double acc[9][3] = {};
    for (int y = 0; y < h; y++) {
        float v = (y + 0.5f) / h;
        float dA = (2 * PI / w) * (PI / h) * std::sin(v * PI);
        for (int x = 0; x < w; x++) {
            V3 d = equirectDir((x + 0.5f) / w, v);
            V4 L = env[(size_t)y * w + x];
            float Y[9] = {0.282095f, 0.488603f * d.y, 0.488603f * d.z, 0.488603f * d.x, 1.092548f * d.x * d.y,
                          1.092548f * d.y * d.z, 0.315392f * (3 * d.z * d.z - 1), 1.092548f * d.x * d.z, 0.546274f * (d.x * d.x - d.y * d.y)};
            for (int k = 0; k < 9; k++) { acc[k][0] += L.x * Y[k] * dA; acc[k][1] += L.y * Y[k] * dA; acc[k][2] += L.z * Y[k] * dA; }
        }
    }
    for (int k = 0; k < 9; k++) r->sh[k] = V4((float)acc[k][0], (float)acc[k][1], (float)acc[k][2], 0);
    // specular: blurred mip chain (rougher surfaces read smaller, softer mips)
    std::vector<std::vector<V4>> mips;
    std::vector<V4> cur = env;
    int cw = w, ch = h;
    int levels = 1;
    while (cw > 4 && levels < 8) {
        int nw = cw / 2, nh = ch / 2;
        std::vector<V4> down((size_t)nw * nh), blur((size_t)nw * nh);
        for (int y = 0; y < nh; y++)
            for (int x = 0; x < nw; x++) {
                V4 s(0, 0, 0, 0);
                for (int k = 0; k < 4; k++) s = s + cur[(size_t)(y * 2 + k / 2) * cw + (x * 2 + k % 2)];
                down[(size_t)y * nw + x] = s * 0.25f;
            }
        // 5x5 tent blur, wrapping horizontally
        for (int y = 0; y < nh; y++)
            for (int x = 0; x < nw; x++) {
                V4 s(0, 0, 0, 0);
                float wsum = 0;
                for (int dy = -2; dy <= 2; dy++)
                    for (int dx = -2; dx <= 2; dx++) {
                        int yy = std::min(std::max(y + dy, 0), nh - 1), xx = (x + dx + nw) % nw;
                        float wt = (3.f - std::abs(dx)) * (3.f - std::abs(dy));
                        s = s + down[(size_t)yy * nw + xx] * wt;
                        wsum += wt;
                    }
                blur[(size_t)y * nw + x] = s * (1 / wsum);
            }
        mips.push_back(blur);
        cur = blur;
        cw = nw; ch = nh;
        levels++;
    }
    r->env = makeTextureFloat(w, h, env, levels, &mips);
}

// MARK: - frame

namespace {
struct Item {
    Node* n;
    M4 world;
    float opacity;
    Material* m;
    Mesh* mesh;
    uint32_t start, count;
    float dist;
};
struct LightInfo { Light* l; V3 pos, dir; };
}

static void bindItem(Renderer* r, const Item& it, bool mirror) {
    Material* m = it.m;
    ObjectCB o{};
    o.world = it.world;
    o.nrmMat = it.world.inverse().transposed();
    o.diffuse = V4(m->diffuse, it.opacity);
    o.emission = V4(m->emission, 0);
    o.pbr = V4(m->roughness, m->metalness, m->roughMul, m->normalIntensity);
    o.uvs = V4(m->uvScale.x, m->uvScale.y, (float)it.n->categoryBitMask, m->reflective ? 1.f : 0.f);
    o.color = V4(m->color, it.opacity);
    o.params = m->params;
    uint32_t f = 0;
    ID3D11ShaderResourceView* srv[5] = {r->white->srv, r->white->srv, r->white->srv, r->white->srv, r->white->srv};
    if (m->shade == Shade::PBR) {
        if (m->albedo) { f |= 1; srv[0] = m->albedo->srv; }
        if (m->normal) { f |= 2; srv[1] = m->normal->srv; }
        if (m->roughMap) { f |= 4; srv[2] = m->roughMap->srv; }
        if (m->metalMap) { f |= 8; srv[3] = m->metalMap->srv; }
        if (m->emissionMap) { f |= 16; srv[4] = m->emissionMap->srv; }
    } else if (m->spriteTex) {
        srv[0] = m->spriteTex->srv;
    }
    o.flags[0] = f;
    upload(r->cbObject, o);
    ctx->PSSetShaderResources(0, 5, srv);
    ID3D11PixelShader* p = r->psPBR;
    switch (m->shade) {
    case Shade::PBR: p = r->psPBR; break;
    case Shade::Glow: p = r->psGlow; break;
    case Shade::Additive: p = r->psAdd; break;
    case Shade::Portal: p = r->psPortal; break;
    case Shade::Fence: p = r->psFence; break;
    case Shade::Energy: p = r->psEnergy; break;
    }
    ctx->PSSetShader(p, nullptr, 0);
    bool additive = m->blend == Blend::Add || m->shade == Shade::Additive || m->shade == Shade::Fence;
    bool transparent = additive || m->blend == Blend::Alpha || it.opacity < 0.999f;
    float bf[4] = {0, 0, 0, 0};
    ctx->OMSetBlendState(additive ? r->bsAdd : (transparent ? r->bsAlpha : r->bsOpaque), bf, 0xffffffff);
    if (!m->depthTest) ctx->OMSetDepthStencilState(r->dsOff, 0);
    else ctx->OMSetDepthStencilState(m->depthWrite && !transparent ? r->dsDefault : r->dsNoWrite, 0);
    ctx->RSSetState(m->doubleSided ? r->rsNone : (mirror ? r->rsFront : r->rsBack));
    UINT stride = sizeof(Vertex), off = 0;
    ctx->IASetVertexBuffers(0, 1, &it.mesh->vb, &stride, &off);
    ctx->IASetIndexBuffer(it.mesh->ib, DXGI_FORMAT_R32_UINT, 0);
}

static void drawItems(Renderer* r, const std::vector<Item>& items, bool mirror) {
    for (auto& it : items) {
        bindItem(r, it, mirror);
        ctx->DrawIndexed(it.count, it.start, 0);
    }
}

static void fullscreen(Renderer* r, ID3D11PixelShader* p) {
    ctx->IASetInputLayout(nullptr);
    ctx->VSSetShader(r->vsFull, nullptr, 0);
    ctx->PSSetShader(p, nullptr, 0);
    ctx->Draw(3, 0);
}

static void viewport(int w, int h) {
    D3D11_VIEWPORT vp{0, 0, (float)w, (float)h, 0, 1};
    ctx->RSSetViewports(1, &vp);
}

static void drawParticles(Renderer* r, Scene& scene, const M4& camWorld) {
    V3 right = simd_normalize(camWorld.dir(V3(1, 0, 0))), up = simd_normalize(camWorld.dir(V3(0, 1, 0)));
    V3 fwd = simd_normalize(camWorld.dir(V3(0, 0, -1)));
    // group by (image, blend)
    struct Batch { Texture* tex; bool add; std::vector<PVertex> v; };
    std::vector<Batch> batches;
    for (auto& ep : scene.emitters) {
        auto& e = *ep;
        if (e.ps.empty()) continue;
        Texture* tex = e.sys.image ? e.sys.image.get() : r->white.get();
        bool add = e.sys.blend != Blend::Alpha;
        Batch* b = nullptr;
        for (auto& x : batches) if (x.tex == tex && x.add == add) { b = &x; break; }
        if (!b) { batches.push_back({tex, add, {}}); b = &batches.back(); }
        for (auto& p : e.ps) {
            float t = 1 - p.life / p.maxLife;
            float a = p.col.w * (e.sys.opacity.empty() ? 1.f : e.sys.opacity.eval(t));
            float s = p.size * (e.sys.sizeCurve.empty() ? 1.f : e.sys.sizeCurve.eval(t));
            if (a <= 0.002f || s <= 0) continue;
            V3 ax, ay;
            if (e.sys.stretch > 0) {
                V3 vv = p.v - fwd * simd_dot(p.v, fwd);
                float sp = simd_length(vv);
                V3 dir = sp > 1e-4f ? vv / sp : right;
                ax = dir * (s * 0.5f + simd_length(p.v) * e.sys.stretch * 0.5f);
                ay = simd_normalize(simd_cross(fwd, dir)) * (s * 0.5f);
            } else {
                float c = std::cos(p.angle), si = std::sin(p.angle);
                ax = (right * c + up * si) * (s * 0.5f);
                ay = (up * c - right * si) * (s * 0.5f);
            }
            V4 col(p.col.x, p.col.y, p.col.z, a);
            PVertex q[4] = {{p.p - ax + ay, V2(0, 0), col}, {p.p + ax + ay, V2(1, 0), col}, {p.p - ax - ay, V2(0, 1), col}, {p.p + ax - ay, V2(1, 1), col}};
            b->v.insert(b->v.end(), {q[0], q[2], q[1], q[1], q[2], q[3]});
        }
    }
    size_t total = 0;
    for (auto& b : batches) total += b.v.size();
    if (total == 0) return;
    if (total > r->particleCap) {
        rel(r->particleVB);
        r->particleCap = std::max<size_t>(total * 3 / 2, 6000);
        D3D11_BUFFER_DESC bd{};
        bd.ByteWidth = (UINT)(r->particleCap * sizeof(PVertex));
        bd.Usage = D3D11_USAGE_DYNAMIC;
        bd.BindFlags = D3D11_BIND_VERTEX_BUFFER;
        bd.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
        device->CreateBuffer(&bd, nullptr, &r->particleVB);
    }
    D3D11_MAPPED_SUBRESOURCE m;
    if (FAILED(ctx->Map(r->particleVB, 0, D3D11_MAP_WRITE_DISCARD, 0, &m))) return;
    size_t off = 0;
    for (auto& b : batches) { memcpy((PVertex*)m.pData + off, b.v.data(), b.v.size() * sizeof(PVertex)); off += b.v.size(); }
    ctx->Unmap(r->particleVB, 0);
    ctx->IASetInputLayout(r->ilParticle);
    ctx->VSSetShader(r->vsParticle, nullptr, 0);
    UINT stride = sizeof(PVertex), o0 = 0;
    ctx->IASetVertexBuffers(0, 1, &r->particleVB, &stride, &o0);
    ctx->OMSetDepthStencilState(r->dsNoWrite, 0);
    ctx->RSSetState(r->rsNone);
    float bf[4] = {0, 0, 0, 0};
    off = 0;
    for (auto& b : batches) {
        ctx->PSSetShader(b.add ? r->psParticleAdd : r->psParticleAlpha, nullptr, 0);
        ctx->OMSetBlendState(b.add ? r->bsAdd : r->bsAlpha, bf, 0xffffffff);
        ctx->PSSetShaderResources(0, 1, &b.tex->srv);
        ctx->Draw((UINT)b.v.size(), (UINT)off);
        off += b.v.size();
    }
}

void renderScene(Renderer* r, Scene& scene, Node& pov, const Camera& cam, float time) {
    M4 camWorld = pov.worldMatrix();
    V3 camP = camWorld.translation();
    M4 view = camWorld.inverse();
    float aspect = (float)r->w / (float)r->h;
    M4 proj = M4::perspectiveRevZ(cam.fieldOfView * PI / 180, aspect, cam.zNear, cam.zFar);
    M4 vp = proj * view;
    // camera rotation without scale, for billboards
    M4 camRot = camWorld;
    for (int c = 0; c < 3; c++) {
        V3 col(camRot.at(0, c), camRot.at(1, c), camRot.at(2, c));
        col = simd_normalize(col);
        camRot.at(0, c) = col.x; camRot.at(1, c) = col.y; camRot.at(2, c) = col.z;
    }

    std::vector<Item> opaque, transp, wOpaque, wTransp, casters;
    std::vector<LightInfo> lights;
    LightInfo sun{nullptr, V3(), V3()};
    std::function<void(Node*, const M4&, float)> visit = [&](Node* n, const M4& pw, float pop) {
        if (n->hidden) return;
        M4 world;
        if (n->billboard) {
            M4 w0 = pw * n->localMatrix();
            float s = simd_length(pw.dir(V3(1, 0, 0)));
            world = camRot;
            V3 p = w0.translation();
            for (int c = 0; c < 3; c++) {
                float k = (c == 0 ? n->scale.x : c == 1 ? n->scale.y : n->scale.z) * s;
                for (int rr = 0; rr < 3; rr++) world.at(rr, c) *= k;
            }
            world.at(0, 3) = p.x; world.at(1, 3) = p.y; world.at(2, 3) = p.z;
        } else {
            world = pw * n->localMatrix();
        }
        float op = pop * n->opacity;
        if (op <= 0.002f) return;
        if (n->light) {
            LightInfo li{n->light.get(), world.translation(), simd_normalize(world.dir(V3(0, 0, -1)))};
            if (n->light->type == LightType::Directional) sun = li;
            else if (lights.size() < 16) lights.push_back(li);
        }
        if (n->mesh && n->mesh->vb && !n->materials.empty()) {
            bool weapon = n->categoryBitMask == 2;
            V3 wp = world.translation();
            float dist = simd_distance(wp, camP);
            for (size_t i = 0; i < n->mesh->subs.size(); i++) {
                Material* m = n->materials[i % n->materials.size()].get();
                Item it{n, world, op, m, n->mesh.get(), n->mesh->subs[i].first, n->mesh->subs[i].second, dist};
                bool additive = m->blend != Blend::Opaque || m->shade == Shade::Additive || m->shade == Shade::Fence;
                bool tr = additive || op < 0.999f;
                if (weapon) (tr ? wTransp : wOpaque).push_back(it);
                else {
                    (tr ? transp : opaque).push_back(it);
                    if (!tr && n->castsShadow) casters.push_back(it);
                }
            }
        }
        for (size_t i = 0; i < n->children.size(); i++) visit(n->children[i].get(), world, op);
    };
    visit(scene.root.get(), M4(), 1);
    auto byOrder = [](const Item& a, const Item& b) {
        if (a.n->renderingOrder != b.n->renderingOrder) return a.n->renderingOrder < b.n->renderingOrder;
        return a.dist > b.dist;
    };
    std::stable_sort(transp.begin(), transp.end(), byOrder);
    std::stable_sort(wTransp.begin(), wTransp.end(), byOrder);
    std::sort(opaque.begin(), opaque.end(), [](const Item& a, const Item& b) { return a.m < b.m; });

    // frame constants
    FrameCB f{};
    f.viewProj = vp;
    f.invViewProj = vp.inverse();
    f.camPos = V4(camP, time);
    V3 toSun = sun.l ? -sun.dir : simd_normalize(V3(0.48f, 0.66f, 0.42f));
    f.sunDir = V4(toSun, scene.lightingEnvironmentIntensity * kEnvScale);
    f.sunColor = sun.l ? V4(lin(sun.l->color) * (sun.l->intensity / 1000.f * kSunScale), sun.l->castsShadow ? 1.f : 0.f) : V4(0, 0, 0, 0);
    f.fogColor = V4(lin(scene.fogColor), scene.fogStart);
    f.fogParams = V4(scene.fogEnd, scene.fogExponent, (float)lights.size(), scene.backgroundIntensity);
    bool refl = scene.floorReflectivity > 0;
    f.screen = V4((float)r->w, (float)r->h, refl ? 1.f : 0.f, scene.floorReflectionFalloff);
    f.misc = V4(scene.floorReflectivity, 0, 0, 0);
    for (int k = 0; k < 9; k++) f.sh[k] = r->sh[k];
    for (size_t i = 0; i < lights.size(); i++) {
        Light* l = lights[i].l;
        float range = l->attenuationEnd > 0 ? l->attenuationEnd : 60;
        f.lPos[i] = V4(lights[i].pos, range);
        f.lCol[i] = V4(lin(l->color) * (l->intensity / 1000.f * kPointScale), l->type == LightType::Spot ? 1.f : 0.f);
        f.lDir[i] = V4(lights[i].dir, std::cos(l->spotOuter * 0.5f * PI / 180));
        f.lExt[i] = V4(std::cos(std::min(l->spotInner, l->spotOuter - 0.5f) * 0.5f * PI / 180), (float)l->categoryBitMask,
                       l->attenuationStart, l->falloffExponent);
    }
    M4 lightView = M4::lookAt(toSun * 60, V3(0, 0, 0), std::fabs(toSun.y) > 0.99f ? V3(0, 0, 1) : V3(0, 1, 0));
    f.shadowVP = M4::ortho(-48, 48, -48, 48, 5, 140) * lightView;

    ID3D11SamplerState* samplers[3] = {r->sWrap, r->sClamp, r->sShadow};
    ID3D11Buffer* cbs[3] = {r->cbFrame, r->cbObject, r->cbPost};
    ID3D11ShaderResourceView* nullSRV[8] = {};
    ctx->PSSetShaderResources(0, 8, nullSRV);
    ctx->VSSetConstantBuffers(0, 2, cbs);
    ctx->PSSetConstantBuffers(0, 3, cbs);
    ctx->PSSetSamplers(0, 3, samplers);
    ctx->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
    float bf[4] = {0, 0, 0, 0};

    // 1. sun shadow map
    upload(r->cbFrame, f);
    if (sun.l && sun.l->castsShadow) {
        ctx->OMSetRenderTargets(0, nullptr, r->shadowDSV);
        ctx->ClearDepthStencilView(r->shadowDSV, D3D11_CLEAR_DEPTH, 1, 0);
        viewport(r->shadowSize, r->shadowSize);
        ctx->IASetInputLayout(r->ilMesh);
        ctx->VSSetShader(r->vsShadow, nullptr, 0);
        ctx->PSSetShader(nullptr, nullptr, 0);
        ctx->RSSetState(r->rsShadow);
        ctx->OMSetDepthStencilState(r->dsShadow, 0);
        ctx->OMSetBlendState(r->bsOpaque, bf, 0xffffffff);
        for (auto& it : casters) {
            ObjectCB o{};
            o.world = it.world;
            upload(r->cbObject, o);
            UINT stride = sizeof(Vertex), off = 0;
            ctx->IASetVertexBuffers(0, 1, &it.mesh->vb, &stride, &off);
            ctx->IASetIndexBuffer(it.mesh->ib, DXGI_FORMAT_R32_UINT, 0);
            ctx->DrawIndexed(it.count, it.start, 0);
        }
    }
    ID3D11ShaderResourceView* envSRV[3] = {r->env ? r->env->srv : r->white->srv, r->shadowSRV, nullptr};

    // 2. planar reflection for the floor (mirrored camera, clipped at y = 0, opaque only)
    if (refl) {
        FrameCB fr = f;
        M4 mirror = M4::scale(V3(1, -1, 1));
        M4 vpr = proj * (view * mirror);
        fr.viewProj = vpr;
        fr.invViewProj = vpr.inverse();
        fr.camPos = V4(V3(camP.x, -camP.y, camP.z), time);
        fr.misc = V4(scene.floorReflectivity, 1, 0, 0);
        fr.screen.z = 0;
        upload(r->cbFrame, fr);
        float clear[4] = {0, 0, 0, 1000};
        ctx->ClearRenderTargetView(r->refl.rtv, clear);
        ctx->ClearDepthStencilView(r->reflDSV, D3D11_CLEAR_DEPTH, 0, 0);
        ctx->OMSetRenderTargets(1, &r->refl.rtv, r->reflDSV);
        viewport(r->refl.w, r->refl.h);
        ctx->PSSetShaderResources(5, 3, envSRV);
        if (r->sky) {
            ctx->PSSetShaderResources(0, 1, &r->sky->srv);
            ctx->OMSetDepthStencilState(r->dsOff, 0);
            ctx->OMSetBlendState(r->bsOpaque, bf, 0xffffffff);
            ctx->RSSetState(r->rsNone);
            fullscreen(r, r->psSky);
        }
        ctx->IASetInputLayout(r->ilMesh);
        ctx->VSSetShader(r->vsMesh, nullptr, 0);
        std::vector<Item> ro;
        for (auto& it : opaque) if (!it.m->reflective) ro.push_back(it);
        drawItems(r, ro, true);
        ctx->OMSetRenderTargets(0, nullptr, nullptr);
        upload(r->cbFrame, f);
    }

    // 3. main HDR pass
    float black[4] = {0, 0, 0, 1};
    ctx->ClearRenderTargetView(r->hdrMSRTV, black);
    ctx->ClearDepthStencilView(r->depthDSV, D3D11_CLEAR_DEPTH, 0, 0);
    ctx->OMSetRenderTargets(1, &r->hdrMSRTV, r->depthDSV);
    viewport(r->w, r->h);
    ID3D11ShaderResourceView* envAll[3] = {envSRV[0], envSRV[1], refl ? r->refl.srv : r->white->srv};
    ctx->PSSetShaderResources(5, 3, envAll);
    if (r->sky) {
        ctx->PSSetShaderResources(0, 1, &r->sky->srv);
        ctx->OMSetDepthStencilState(r->dsOff, 0);
        ctx->OMSetBlendState(r->bsOpaque, bf, 0xffffffff);
        ctx->RSSetState(r->rsNone);
        fullscreen(r, r->psSky);
    }
    ctx->IASetInputLayout(r->ilMesh);
    ctx->VSSetShader(r->vsMesh, nullptr, 0);
    drawItems(r, opaque, false);
    drawItems(r, transp, false);
    drawParticles(r, scene, camWorld);

    // 4. first-person weapon: own depth range, no fog
    if (!wOpaque.empty() || !wTransp.empty()) {
        FrameCB fw = f;
        fw.viewProj = M4::perspectiveRevZ(cam.fieldOfView * PI / 180, aspect, 0.01f, 20) * view;
        fw.fogParams.x = 0;
        fw.screen.z = 0;
        upload(r->cbFrame, fw);
        ctx->ClearDepthStencilView(r->depthDSV, D3D11_CLEAR_DEPTH, 0, 0);
        ctx->IASetInputLayout(r->ilMesh);
        ctx->VSSetShader(r->vsMesh, nullptr, 0);
        drawItems(r, wOpaque, false);
        drawItems(r, wTransp, false);
    }

    // 5. resolve + bloom + grade
    ctx->OMSetRenderTargets(0, nullptr, nullptr);
    if (r->msaa > 1) ctx->ResolveSubresource(r->hdr.tex, 0, r->hdrMS, 0, DXGI_FORMAT_R16G16B16A16_FLOAT);
    else ctx->CopyResource(r->hdr.tex, r->hdrMS);
    ctx->PSSetShaderResources(0, 8, nullSRV);
    ctx->OMSetDepthStencilState(r->dsOff, 0);
    ctx->OMSetBlendState(r->bsOpaque, bf, 0xffffffff);
    ctx->RSSetState(r->rsNone);
    ctx->VSSetShader(r->vsFull, nullptr, 0);
    ctx->IASetInputLayout(nullptr);
    auto pass = [&](RT& dst, ID3D11ShaderResourceView* src, ID3D11PixelShader* p, V4 p0) {
        PostCB pc{};
        pc.p0 = p0;
        upload(r->cbPost, pc);
        ctx->OMSetRenderTargets(1, &dst.rtv, nullptr);
        viewport(dst.w, dst.h);
        ctx->PSSetShaderResources(0, 1, &src);
        ctx->VSSetShader(r->vsFull, nullptr, 0);
        ctx->PSSetShader(p, nullptr, 0);
        ctx->Draw(3, 0);
        ID3D11ShaderResourceView* none = nullptr;
        ctx->PSSetShaderResources(0, 1, &none);
        ctx->OMSetRenderTargets(0, nullptr, nullptr);
    };
    float threshold = cam.bloomThreshold;
    pass(r->bloom[0], r->hdr.srv, r->psBright, V4(1.f / r->hdr.w, 1.f / r->hdr.h, threshold, 0));
    for (int i = 0; i < 5; i++) {
        if (i > 0) pass(r->bloom[i], r->bloom[i - 1].srv, r->psDown, V4(1.f / r->bloom[i - 1].w, 1.f / r->bloom[i - 1].h, 0, 0));
        pass(r->bloomTmp[i], r->bloom[i].srv, r->psBlur, V4(1.f / r->bloom[i].w, 0, 0, 0));
        pass(r->bloom[i], r->bloomTmp[i].srv, r->psBlur, V4(0, 1.f / r->bloom[i].h, 0, 0));
    }
    PostCB pc{};
    pc.p0 = V4(1.f / r->w, 1.f / r->h, threshold, cam.bloomIntensity * 0.82f);
    pc.p1 = V4(cam.saturation, cam.contrast, cam.vignettingIntensity, cam.vignettingPower);
    pc.p2 = V4(cam.colorFringeStrength * 0.01f, std::exp2(cam.exposureOffset - 0.1f), 0, 0);
    upload(r->cbPost, pc);
    ctx->OMSetRenderTargets(1, &r->backRTV, nullptr);
    viewport(r->w, r->h);
    ID3D11ShaderResourceView* fin[6] = {r->hdr.srv, r->bloom[0].srv, r->bloom[1].srv, r->bloom[2].srv, r->bloom[3].srv, r->bloom[4].srv};
    ctx->PSSetShaderResources(0, 6, fin);
    fullscreen(r, r->psFinal);
    ctx->PSSetShaderResources(0, 8, nullSRV);
}
