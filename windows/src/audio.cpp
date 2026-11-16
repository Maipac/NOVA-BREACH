// Sound synthesis (identical formulas to Audio.swift) and XAudio2 playback.
#include "audio.h"
#include <windows.h>
#include <xaudio2.h>
#include <map>
#include <vector>

namespace {
const float SR = 44100;

struct LCG {
    uint32_t s;
    float next() { s = s * 1664525u + 1013904223u; return (float)(int32_t)s / 2147483648.0f; }
};

std::vector<float> render(float dur, float gain, uint32_t seed, const std::function<float(float, LCG&)>& f) {
    int n = (int)(dur * SR);
    std::vector<float> out(n);
    LCG rng{seed * 7919u + 13u};
    for (int i = 0; i < n; i++) {
        float t = i / SR;
        float fadeOut = std::min(1.f, (float)(n - i) / 300);
        out[i] = std::tanh(f(t, rng) * gain) * fadeOut;
    }
    return out;
}
std::vector<float> render(float dur, float gain, const std::function<float(float, LCG&)>& f) { return render(dur, gain, 1, f); }

std::map<std::string, std::vector<float>> buildSounds() {
    std::map<std::string, std::vector<float>> s;
    const float tau = 2 * PI;
    const float dt = 1 / SR;
    { float ph = 0, lp = 0;
      s["rifle"] = render(0.2f, 1.3f, [=](float t, LCG& n) mutable {
          ph += tau * (150 + 1000 * std::exp(-t * 42)) * dt;
          lp += (n.next() - lp) * 0.5f;
          return (std::sin(ph) + 0.4f * std::sin(ph * 2.01f)) * std::exp(-t * 24) * 0.55f + lp * std::exp(-t * 50) * 0.8f; }); }
    { float lp = 0, lp2 = 0, ph = 0;
      s["shotgun"] = render(0.55f, 2.0f, [=](float t, LCG& n) mutable {
          float cut = 0.06f + 0.6f * std::exp(-t * 14);
          lp += (n.next() - lp) * cut;
          lp2 += (lp - lp2) * cut;
          ph += tau * (48 + 90 * std::exp(-t * 18)) * dt;
          return lp2 * std::exp(-t * 8) * 1.4f + std::sin(ph) * std::exp(-t * 11) * 0.9f; }); }
    { float ph = 0, ph2 = 0, lp = 0;
      s["rail"] = render(0.9f, 1.6f, [=](float t, LCG& n) mutable {
          ph += tau * (110 + 2400 * std::exp(-t * 7)) * dt;
          ph2 += tau * 53 * dt;
          lp += (n.next() - lp) * 0.7f;
          float saw = 2 * (ph / tau - std::floor(ph / tau + 0.5f));
          return saw * std::exp(-t * 5) * 0.45f * (0.7f + 0.3f * std::sin(ph2 * 6)) + lp * std::exp(-t * 30) * 0.9f + std::sin(ph2) * std::exp(-t * 6) * 0.7f; }); }
    { float ph = 0, lp = 0;
      s["launcher"] = render(0.5f, 1.7f, [=](float t, LCG& n) mutable {
          ph += tau * (50 + 170 * std::exp(-t * 16)) * dt;
          lp += (n.next() - lp) * 0.12f;
          return std::sin(ph) * std::exp(-t * 8) + lp * std::exp(-t * 12) * 1.3f; }); }
    { float lp = 0, lp2 = 0, ph = 0;
      s["explosion"] = render(1.5f, 2.4f, [=](float t, LCG& n) mutable {
          float cut = 0.012f + 0.35f * std::exp(-t * 6);
          lp += (n.next() - lp) * cut;
          lp2 += (lp - lp2) * cut;
          ph += tau * (28 + 60 * std::exp(-t * 7)) * dt;
          return lp2 * std::exp(-t * 3.2f) * 2.2f + std::sin(ph) * std::exp(-t * 4.5f) * 0.9f; }); }
    { float ph = 0;
      s["enemyShot"] = render(0.22f, 0.9f, [=](float t, LCG&) mutable {
          ph += tau * (380 + 1300 * std::exp(-t * 16)) * dt;
          float sq = std::sin(ph) > 0 ? 1.f : -1.f;
          return (std::sin(ph) * 0.7f + sq * 0.18f) * std::exp(-t * 17); }); }
    { float ph = 0;
      s["hit"] = render(0.06f, 0.8f, [=](float t, LCG&) mutable { ph += tau * 2300 * dt; return std::sin(ph) * std::exp(-t * 90); });
      float ph2 = 0;
      s["crit"] = render(0.1f, 0.9f, [=](float t, LCG&) mutable { ph2 += tau * (t < 0.03f ? 2600 : 3500) * dt; return std::sin(ph2) * std::exp(-t * 45); }); }
    { float ph = 0;
      s["kill"] = render(0.22f, 0.8f, [=](float t, LCG&) mutable {
          ph += tau * (t < 0.07f ? 880 : 1320) * dt;
          return (std::sin(ph) + 0.3f * std::sin(ph * 2)) * std::exp(-t * 16) * 0.8f; }); }
    { float ph = 0, lp = 0;
      s["enemyDie"] = render(0.4f, 1.5f, [=](float t, LCG& n) mutable {
          ph += tau * (70 + 600 * std::exp(-t * 12)) * dt;
          lp += (n.next() - lp) * 0.3f;
          float sq = std::sin(ph) > 0 ? 1.f : -1.f;
          return sq * std::exp(-t * 11) * 0.35f + lp * std::exp(-t * 9) * 0.9f; }); }
    { float ph = 0, lp = 0;
      s["hurt"] = render(0.3f, 1.6f, [=](float t, LCG& n) mutable {
          ph += tau * (70 + 90 * std::exp(-t * 20)) * dt;
          lp += (n.next() - lp) * 0.2f;
          return std::sin(ph) * std::exp(-t * 12) + lp * std::exp(-t * 20) * 0.8f; });
      float ph2 = 0;
      s["shieldHit"] = render(0.25f, 1.0f, [=](float t, LCG& n) mutable {
          ph2 += tau * (900 + 500 * std::sin(t * 90)) * dt;
          return std::sin(ph2) * std::exp(-t * 16) * 0.6f + n.next() * std::exp(-t * 40) * 0.3f; }); }
    { float ph = 0;
      s["pickup"] = render(0.42f, 0.8f, [=](float t, LCG&) mutable {
          float f = t < 0.09f ? 660 : (t < 0.18f ? 880 : 1320);
          ph += tau * f * dt;
          float lt = t < 0.09f ? t : (t < 0.18f ? t - 0.09f : t - 0.18f);
          return (std::sin(ph) + 0.25f * std::sin(ph * 3)) * std::exp(-lt * 9) * 0.7f; });
      float ph2 = 0;
      s["power"] = render(0.8f, 0.9f, [=](float t, LCG&) mutable {
          ph2 += tau * (220 + 900 * t * t + 30 * std::sin(t * 70)) * dt;
          float saw = 2 * (ph2 / tau - std::floor(ph2 / tau + 0.5f));
          return (std::sin(ph2) * 0.7f + saw * 0.2f) * std::min(1.f, t * 20) * std::exp(-std::max(0.f, t - 0.5f) * 9); }); }
    { float bp = 0, lp = 0;
      s["reload"] = render(0.5f, 1.4f, [=](float t, LCG& n) mutable {
          float a = std::exp(-std::max(0.f, t - 0.02f) * 90) * (t > 0.02f ? 1 : 0);
          float b = std::exp(-std::max(0.f, t - 0.3f) * 70) * (t > 0.3f ? 1 : 0);
          float c = std::exp(-std::max(0.f, t - 0.38f) * 110) * (t > 0.38f ? 1 : 0);
          float x = n.next();
          lp += (x - lp) * 0.35f;
          bp = x - lp;
          return bp * (a * 0.8f + b + c * 0.7f) + std::sin(t * tau * 420) * c * 0.25f; });
      s["empty"] = render(0.07f, 1.0f, [=](float t, LCG& n) { return n.next() * std::exp(-t * 130) * 0.6f + std::sin(t * tau * 1500) * std::exp(-t * 100) * 0.3f; });
      float lp2 = 0;
      s["swap"] = render(0.18f, 1.2f, [=](float t, LCG& n) mutable {
          lp2 += (n.next() - lp2) * 0.25f;
          return lp2 * std::sin(std::min(t / 0.18f, 1.f) * PI) * 0.9f + std::sin(t * tau * 300) * std::exp(-std::max(0.f, t - 0.12f) * 80) * (t > 0.12f ? 0.3f : 0); }); }
    { float lp = 0, lp2 = 0;
      s["dash"] = render(0.35f, 1.6f, [=](float t, LCG& n) mutable {
          float k = std::sin(std::min(t / 0.35f, 1.f) * PI);
          float cut = 0.05f + 0.4f * k;
          lp += (n.next() - lp) * cut;
          lp2 += (lp - lp2) * cut;
          return lp2 * k * 1.5f; });
      float ph = 0;
      s["jump"] = render(0.14f, 0.9f, [=](float t, LCG& n) mutable {
          ph += tau * (130 + 120 * t * 7) * dt;
          return std::sin(ph) * std::exp(-t * 26) * 0.5f + n.next() * std::exp(-t * 60) * 0.12f; });
      float ph3 = 0, lp3 = 0;
      s["land"] = render(0.16f, 1.2f, [=](float t, LCG& n) mutable {
          ph3 += tau * (60 + 70 * std::exp(-t * 30)) * dt;
          lp3 += (n.next() - lp3) * 0.15f;
          return std::sin(ph3) * std::exp(-t * 26) * 0.7f + lp3 * std::exp(-t * 30); }); }
    { float ph = 0, lp = 0;
      s["wave"] = render(1.1f, 0.9f, [=](float t, LCG&) mutable {
          int seg = (int)(t / 0.26f);
          float lt = t - seg * 0.26f;
          float f = seg % 2 == 0 ? 440 : 587.3f;
          ph += tau * f * dt;
          float sq = std::sin(ph) > 0 ? 1.f : -1.f;
          lp += (sq - lp) * 0.18f;
          return (lp * 0.5f + std::sin(ph) * 0.4f) * std::min(1.f, lt * 80) * std::exp(-lt * 5) * (seg < 4 ? 1 : 0); });
      float ph2 = 0, lp2 = 0;
      s["boss"] = render(2.0f, 1.6f, [=](float t, LCG& n) mutable {
          ph2 += tau * (44 + 12 * std::sin(t * 3)) * dt;
          float saw = 2 * (ph2 / tau - std::floor(ph2 / tau + 0.5f));
          lp2 += (saw + 0.3f * n.next() - lp2) * (0.04f + 0.1f * std::min(t, 1.f));
          return lp2 * std::min(1.f, t * 4) * std::exp(-std::max(0.f, t - 1.2f) * 4) * (0.7f + 0.3f * std::sin(t * 37)) * 2; });
      float ph3 = 0;
      s["spawn"] = render(0.4f, 0.8f, [=](float t, LCG&) mutable {
          ph3 += tau * (180 + 1500 * t) * dt;
          return std::sin(ph3) * (0.6f + 0.4f * std::sin(t * 160)) * std::sin(std::min(t / 0.4f, 1.f) * PI) * 0.6f; });
      float ph4 = 0;
      s["waveClear"] = render(0.7f, 0.8f, [=](float t, LCG&) mutable {
          float f = t < 0.12f ? 523.25f : (t < 0.24f ? 659.25f : (t < 0.36f ? 783.99f : 1046.5f));
          ph4 += tau * f * dt;
          float lt = t < 0.36f ? std::fmod(t, 0.12f) : t - 0.36f;
          return (std::sin(ph4) + 0.3f * std::sin(ph4 * 2)) * std::exp(-lt * 6) * 0.6f; });
      float ph5 = 0;
      s["death"] = render(1.6f, 1.3f, [=](float t, LCG& n) mutable {
          ph5 += tau * (220 * std::exp(-t * 1.6f) + 30) * dt;
          float saw = 2 * (ph5 / tau - std::floor(ph5 / tau + 0.5f));
          return (saw * 0.4f + std::sin(ph5 * 0.5f) * 0.6f) * std::exp(-t * 1.6f) + n.next() * std::exp(-t * 14) * 0.5f; });
      float ph6 = 0;
      s["ui"] = render(0.12f, 0.7f, [=](float t, LCG&) mutable { ph6 += tau * 990 * dt; return std::sin(ph6) * std::exp(-t * 30); });
      float ph7 = 0;
      s["melee"] = render(0.2f, 1.4f, [=](float t, LCG& n) mutable {
          ph7 += tau * (90 + 200 * std::exp(-t * 30)) * dt;
          return std::sin(ph7) * std::exp(-t * 20) + n.next() * std::exp(-t * 50) * 0.5f; });
      float ph8 = 0;
      s["beep"] = render(0.09f, 0.7f, [=](float t, LCG&) mutable { ph8 += tau * 1760 * dt; return (std::sin(ph8) > 0 ? 0.5f : -0.5f) * std::exp(-t * 25); }); }
    return s;
}

/// interleaved stereo loop, 8 bars at 104 bpm
std::vector<float> makeMusic() {
    const float bpm = 104, beat = 60 / bpm, step = beat / 4;
    const int bars = 8;
    const int n = (int)(bars * 4 * beat * SR);
    std::vector<float> L(n, 0), R(n, 0);
    const float tau = 2 * PI;
    LCG rng{4242};
    auto add = [&](float start, float dur, float gl, float gr, const std::function<float(float)>& f) {
        int s0 = (int)(start * SR), cnt = (int)(dur * SR);
        for (int i = 0; i < cnt; i++) {
            float v = f(i / SR);
            int j = (s0 + i) % n;
            L[j] += v * gl; R[j] += v * gr;
        }
    };
    const float roots[8] = {73.42f, 73.42f, 87.31f, 65.41f, 73.42f, 73.42f, 58.27f, 65.41f};
    const float chords[8][3] = {{146.83f, 174.61f, 220.0f}, {146.83f, 174.61f, 220.0f}, {174.61f, 220.0f, 261.63f}, {130.81f, 164.81f, 196.0f},
                                {146.83f, 174.61f, 220.0f}, {146.83f, 174.61f, 220.0f}, {116.54f, 146.83f, 174.61f}, {130.81f, 164.81f, 196.0f}};
    const int bassPat[16] = {1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1};
    const float bassOct[16] = {1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2};
    const int arpPat[16] = {0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 2};
    for (int bar = 0; bar < bars; bar++) {
        float barT = bar * 4 * beat;
        for (int b = 0; b < 4; b++) {
            float t0 = barT + b * beat;
            float ph = 0;
            add(t0, 0.3f, 0.75f, 0.75f, [&](float t) { ph += tau * (42 + 95 * std::exp(-t * 28)) / SR; return std::sin(ph) * std::exp(-t * 10); });
            if (b % 2 == 1) {
                float lp = 0, ph2 = 0;
                add(t0, 0.22f, 0.26f, 0.26f, [&](float t) {
                    float x = rng.next();
                    lp += (x - lp) * 0.3f;
                    ph2 += tau * 185 / SR;
                    return (x - lp) * std::exp(-t * 20) + std::sin(ph2) * std::exp(-t * 30) * 0.5f;
                });
            }
        }
        for (int s = 0; s < 16; s++) {
            float t0 = barT + s * step;
            float lp = 0;
            float acc = s % 4 == 2 ? 0.16f : (s % 2 == 1 ? 0.05f : 0.09f);
            add(t0, 0.07f, acc * 0.8f, acc, [&](float t) {
                float x = rng.next();
                lp += (x - lp) * 0.6f;
                return (x - lp) * std::exp(-t * (s % 4 == 2 ? 45.f : 90.f));
            });
            if (bassPat[s] == 1) {
                float f = roots[bar] * bassOct[s];
                float ph = 0, flt = 0;
                add(t0, step * 1.1f, 0.34f, 0.34f, [&](float t) {
                    ph += f / SR;
                    ph -= std::floor(ph);
                    float saw = 2 * ph - 1;
                    float cut = 0.03f + 0.22f * std::exp(-t * 18);
                    flt += (saw - flt) * cut;
                    return flt * std::min(1.f, t * 300) * std::exp(-t * 7);
                });
            }
            if (bar >= 2) {
                float f = chords[bar][arpPat[s]] * (s % 8 == 7 ? 4 : 2);
                std::pair<int, float> echoes[3] = {{0, 0.085f}, {3, 0.05f}, {6, 0.028f}};
                for (auto& [k, g] : echoes) {
                    float ph = 0;
                    float gl = k == 3 ? g * 0.3f : g, gr = k == 6 ? g * 0.3f : (k == 3 ? g : g * 0.8f);
                    add(t0 + k * step, 0.32f, gl, gr, [&](float t) {
                        ph += tau * f / SR;
                        return (std::sin(ph) + 0.35f * std::sin(ph * 2) + 0.15f * std::sin(ph * 3)) * std::exp(-t * 13) * std::min(1.f, t * 400);
                    });
                }
            }
        }
        float barDur = 4 * beat;
        for (int ci = 0; ci < 3; ci++) {
            float f = chords[bar][ci];
            float dets[3][3] = {{0.996f, 0.05f, 0.02f}, {1.004f, 0.02f, 0.05f}, {0.5f, 0.03f, 0.03f}};
            for (auto& d : dets) {
                float ph = ci * 0.31f, flt = 0;
                float det = d[0];
                add(barT, barDur + 0.25f, d[1], d[2], [&](float t) {
                    ph += f * det / SR;
                    ph -= std::floor(ph);
                    flt += ((2 * ph - 1) - flt) * 0.045f;
                    float env = std::min(1.f, t / 0.25f) * std::min(1.f, std::max(0.f, (barDur + 0.25f - t) / 0.25f));
                    return flt * env;
                });
            }
        }
    }
    std::vector<float> out((size_t)n * 2);
    for (int i = 0; i < n; i++) { out[i * 2] = std::tanh(L[i] * 1.15f); out[i * 2 + 1] = std::tanh(R[i] * 1.15f); }
    return out;
}
}

struct AudioImpl {
    IXAudio2* xa = nullptr;
    IXAudio2MasteringVoice* master = nullptr;
    std::vector<IXAudio2SourceVoice*> voices;
    IXAudio2SourceVoice* music = nullptr;
    std::map<std::string, std::vector<float>> sounds;
    std::vector<float> musicData;
    int next = 0;
    int outChannels = 2;
    HANDLE musicThread = nullptr;
};

static DWORD WINAPI musicWorker(LPVOID p) {
    auto* a = (AudioImpl*)p;
    a->musicData = makeMusic();
    XAUDIO2_BUFFER b{};
    b.AudioBytes = (UINT32)(a->musicData.size() * sizeof(float));
    b.pAudioData = (const BYTE*)a->musicData.data();
    b.LoopCount = XAUDIO2_LOOP_INFINITE;
    a->music->SubmitSourceBuffer(&b);
    a->music->Start(0);
    return 0;
}

Audio::Audio(bool en) {
    if (!en) return;
    // loaded at runtime: without XAudio2 the game simply stays silent instead of refusing to start
    typedef HRESULT(WINAPI * CreateFn)(IXAudio2**, UINT32, XAUDIO2_PROCESSOR);
    HMODULE lib = LoadLibraryW(L"xaudio2_9.dll");
    if (!lib) lib = LoadLibraryW(L"xaudio2_8.dll");
    CreateFn create = lib ? (CreateFn)(void*)GetProcAddress(lib, "XAudio2Create") : nullptr;
    if (!create) return;
    impl = new AudioImpl;
    if (FAILED(create(&impl->xa, 0, XAUDIO2_DEFAULT_PROCESSOR)) || FAILED(impl->xa->CreateMasteringVoice(&impl->master))) {
        if (impl->xa) impl->xa->Release();
        delete impl;
        impl = nullptr;
        return;
    }
    XAUDIO2_VOICE_DETAILS d{};
    impl->master->GetVoiceDetails(&d);
    impl->outChannels = (int)d.InputChannels;
    impl->sounds = buildSounds();
    WAVEFORMATEX wf{};
    wf.wFormatTag = WAVE_FORMAT_IEEE_FLOAT;
    wf.nChannels = 1;
    wf.nSamplesPerSec = 44100;
    wf.wBitsPerSample = 32;
    wf.nBlockAlign = 4;
    wf.nAvgBytesPerSec = 44100 * 4;
    for (int i = 0; i < 22; i++) {
        IXAudio2SourceVoice* v = nullptr;
        if (SUCCEEDED(impl->xa->CreateSourceVoice(&v, &wf))) impl->voices.push_back(v);
    }
    wf.nChannels = 2;
    wf.nBlockAlign = 8;
    wf.nAvgBytesPerSec = 44100 * 8;
    impl->xa->CreateSourceVoice(&impl->music, &wf);
    impl->master->SetVolume(0.9f);
    enabled = !impl->voices.empty();
    if (impl->music) {
        applyMusic();
        impl->musicThread = CreateThread(nullptr, 0, musicWorker, impl, 0, nullptr);
    }
}

Audio::~Audio() {
    if (!impl) return;
    if (impl->musicThread) { WaitForSingleObject(impl->musicThread, 5000); CloseHandle(impl->musicThread); }
    if (impl->xa) impl->xa->StopEngine();
    for (auto* v : impl->voices) v->DestroyVoice();
    if (impl->music) impl->music->DestroyVoice();
    if (impl->master) impl->master->DestroyVoice();
    if (impl->xa) impl->xa->Release();
    delete impl;
}

void Audio::setMaster(float v) { if (impl && impl->master) impl->master->SetVolume(v); }
void Audio::applyMusic() { if (impl && impl->music) impl->music->SetVolume(musicEnabled ? musicVol : 0); }
void Audio::setMusicVolume(float v) { musicVol = v; applyMusic(); }
void Audio::setMusicOn(bool on) { musicEnabled = on; applyMusic(); }

void Audio::play(const std::string& name, float vol, float pan) {
    if (!enabled || !impl) return;
    auto it = impl->sounds.find(name);
    if (it == impl->sounds.end()) return;
    IXAudio2SourceVoice* v = impl->voices[impl->next];
    impl->next = (impl->next + 1) % (int)impl->voices.size();
    v->Stop(0);
    v->FlushSourceBuffers();
    XAUDIO2_BUFFER b{};
    b.AudioBytes = (UINT32)(it->second.size() * sizeof(float));
    b.pAudioData = (const BYTE*)it->second.data();
    v->SetVolume(vol);
    pan = clampf(pan, -1, 1);
    if (impl->outChannels >= 2) {
        std::vector<float> m((size_t)impl->outChannels, 0.f);
        m[0] = std::min(1.f, 1 - pan);
        m[1] = std::min(1.f, 1 + pan);
        v->SetOutputMatrix(impl->master, 1, impl->outChannels, m.data());
    }
    v->SubmitSourceBuffer(&b);
    v->Start(0);
}

void Audio::play(const std::string& name, V3 pos, V3 listener, float yaw, float vol) {
    if (!enabled) return;
    V3 v = pos - listener;
    float d = simd_length(v);
    float att = 1 / (1 + d * d / 180);
    if (att < 0.03f) return;
    V3 right(std::cos(yaw), 0, -std::sin(yaw));
    float pan = d > 0.5f ? simd_dot(v / d, right) * 0.8f : 0;
    play(name, vol * att, pan);
}
