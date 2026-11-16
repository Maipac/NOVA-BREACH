// Window, input, mouse capture, fullscreen, main loop and the test modes (port of main.swift).
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <objbase.h>
#include <cstdio>
#include <chrono>
#include "game.h"
#include "textures.h"

static std::vector<std::string> args;
static const char* argValue(const char* name) {
    for (size_t i = 0; i + 1 < args.size(); i++) if (args[i] == name) return args[i + 1].c_str();
    return nullptr;
}
static bool hasArg(const char* name) {
    for (auto& a : args) if (a == name) return true;
    return false;
}

static std::string utf8(const wchar_t* w) {
    int n = WideCharToMultiByte(CP_UTF8, 0, w, -1, nullptr, 0, nullptr, nullptr);
    std::string s(n > 0 ? n - 1 : 0, '\0');
    if (n > 0) WideCharToMultiByte(CP_UTF8, 0, w, -1, s.data(), n, nullptr, nullptr);
    return s;
}

static double now() {
    static LARGE_INTEGER f = [] { LARGE_INTEGER x; QueryPerformanceFrequency(&x); return x; }();
    LARGE_INTEGER c;
    QueryPerformanceCounter(&c);
    return (double)c.QuadPart / (double)f.QuadPart;
}

// MARK: - app shell

namespace {
HWND hwnd = nullptr;
Renderer* renderer = nullptr;
Game* game = nullptr;
bool captured = false, cursorHidden = false, fullscreen = false, quitting = false;
WINDOWPLACEMENT windowedPlacement{sizeof(WINDOWPLACEMENT)};
int clientW = 1280, clientH = 800;

void setCapture(bool on) {
    if (!hwnd) return;
    if (on && GetForegroundWindow() != hwnd) return;
    captured = on;
    if (on) {
        RECT r;
        GetClientRect(hwnd, &r);
        POINT a{r.left, r.top}, b{r.right, r.bottom};
        ClientToScreen(hwnd, &a);
        ClientToScreen(hwnd, &b);
        RECT clip{a.x, a.y, b.x, b.y};
        ClipCursor(&clip);
        SetCursorPos((a.x + b.x) / 2, (a.y + b.y) / 2);
        if (!cursorHidden) { ShowCursor(FALSE); cursorHidden = true; }
    } else {
        ClipCursor(nullptr);
        if (cursorHidden) { ShowCursor(TRUE); cursorHidden = false; }
    }
}

void toggleFullscreen() {
    DWORD style = GetWindowLong(hwnd, GWL_STYLE);
    if (!fullscreen) {
        MONITORINFO mi{sizeof(mi)};
        if (GetWindowPlacement(hwnd, &windowedPlacement) && GetMonitorInfo(MonitorFromWindow(hwnd, MONITOR_DEFAULTTOPRIMARY), &mi)) {
            SetWindowLong(hwnd, GWL_STYLE, (style & ~WS_OVERLAPPEDWINDOW) | WS_POPUP);
            SetWindowPos(hwnd, HWND_TOP, mi.rcMonitor.left, mi.rcMonitor.top, mi.rcMonitor.right - mi.rcMonitor.left, mi.rcMonitor.bottom - mi.rcMonitor.top,
                         SWP_NOOWNERZORDER | SWP_FRAMECHANGED);
        }
        fullscreen = true;
    } else {
        SetWindowLong(hwnd, GWL_STYLE, (style & ~WS_POPUP) | WS_OVERLAPPEDWINDOW);
        SetWindowPlacement(hwnd, &windowedPlacement);
        SetWindowPos(hwnd, nullptr, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_NOOWNERZORDER | SWP_FRAMECHANGED);
        fullscreen = false;
    }
    if (captured) setCapture(true);
}

/// PS/2 scan code of a key message (physical position, so WASD works on every layout)
int scanCode(LPARAM lp) {
    int sc = (int)((lp >> 16) & 0xFF);
    bool ext = (lp >> 24) & 1;
    if (sc == 0x36) sc = 0x2A;       // right shift = shift
    if (sc == 0x1C) return Key::ret; // numpad enter = enter
    return ext ? (sc | 0x100) : sc;
}

LRESULT CALLBACK wndProc(HWND h, UINT msg, WPARAM wp, LPARAM lp) {
    switch (msg) {
    case WM_INPUT: {
        if (!game || !captured) break;
        RAWINPUT ri;
        UINT size = sizeof(ri);
        if (GetRawInputData((HRAWINPUT)lp, RID_INPUT, &ri, &size, sizeof(RAWINPUTHEADER)) != (UINT)-1 && ri.header.dwType == RIM_TYPEMOUSE &&
            !(ri.data.mouse.usFlags & MOUSE_MOVE_ABSOLUTE))
            game->input.mouse((float)ri.data.mouse.lLastX, (float)ri.data.mouse.lLastY);
        break;
    }
    case WM_KEYDOWN:
    case WM_SYSKEYDOWN:
        if (game) {
            if (wp == VK_RETURN && (lp & (1 << 29))) { toggleFullscreen(); return 0; }   // Alt+Enter
            if (wp == VK_F4 && (lp & (1 << 29))) break;                                  // Alt+F4 closes
            if (!(lp & (1 << 30))) game->input.key(scanCode(lp), true);
        }
        if (msg == WM_SYSKEYDOWN && wp == VK_F10) return 0;
        if (msg == WM_SYSKEYDOWN) break;
        return 0;
    case WM_KEYUP:
    case WM_SYSKEYUP:
        if (game) game->input.key(scanCode(lp), false);
        if (msg == WM_SYSKEYUP) break;
        return 0;
    case WM_SYSCHAR:
        return 0;   // no beep for Alt+key
    case WM_LBUTTONDOWN:
        if (game) {
            SetFocus(h);
            game->input.button(true, V2((float)(short)LOWORD(lp), (float)(clientH - (short)HIWORD(lp))));
        }
        return 0;
    case WM_LBUTTONUP:
        if (game) game->input.button(false);
        return 0;
    case WM_MOUSEWHEEL:
        if (game) game->input.scroll(GET_WHEEL_DELTA_WPARAM(wp) > 0 ? 1.f : -1.f);
        return 0;
    case WM_SIZE:
        clientW = std::max(1, (int)LOWORD(lp));
        clientH = std::max(1, (int)HIWORD(lp));
        if (renderer && wp != SIZE_MINIMIZED) rendererResize(renderer, clientW, clientH);
        if (captured) setCapture(true);
        return 0;
    case WM_ACTIVATEAPP:
        if (!wp && game) {
            game->input.releaseAll();
            game->pauseRequested = true;
            setCapture(false);
        }
        return 0;
    case WM_SETCURSOR:
        if (captured && LOWORD(lp) == HTCLIENT) { SetCursor(nullptr); return TRUE; }
        break;
    case WM_CLOSE:
        quitting = true;
        DestroyWindow(h);
        return 0;
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(h, msg, wp, lp);
}

bool pump() {
    MSG m;
    while (PeekMessageW(&m, nullptr, 0, 0, PM_REMOVE)) {
        if (m.message == WM_QUIT) return false;
        TranslateMessage(&m);
        DispatchMessageW(&m);
    }
    return !quitting;
}

/// one frame: simulation, SceneKit-style actions and particles, then (optionally) 3D + HUD
void frame(float dt, float t, bool draw = true) {
    game->hud->resizeIfNeeded(V2((float)rendererWidth(renderer), (float)rendererHeight(renderer)));
    game->tick(dt);
    game->scene.update(dt);
    game->hud->scene->update(dt);
    if (!draw) return;
    renderScene(renderer, game->scene, *game->camNode, game->camera, t);
    game->hud->scene->render(rendererBackbuffer(renderer), rendererWidth(renderer), rendererHeight(renderer));
}

void loadingScreen(int w, int h) {
    SKScene s;
    s.size = V2((float)w, (float)h);
    auto l = std::make_shared<SKLabel>();
    l->text = "NOVA BREACH";
    l->font = FontId::Heavy;
    l->fontSize = 72.f * std::max(0.6f, std::min(h / 900.f, w / 1440.f));
    l->position = V2(w / 2.f, h / 2.f);
    l->v = VAlign::Center;
    s.addChild(l);
    auto sub = std::make_shared<SKLabel>();
    sub->text = "Station wird generiert …";
    sub->font = FontId::Demi;
    sub->fontSize = l->fontSize * 0.3f;
    sub->fontColor = UIColor(0.35f, 0.92f, 1.0f);
    sub->position = V2(w / 2.f, h / 2.f - l->fontSize * 0.8f);
    s.addChild(sub);
    float black[4] = {0, 0, 0, 1};
    GFX::ctx->ClearRenderTargetView(rendererBackbuffer(renderer), black);
    s.render(rendererBackbuffer(renderer), w, h);
    present(renderer);
}

void attachConsole() {
    if (AttachConsole(ATTACH_PARENT_PROCESS)) {
        FILE* f;
        freopen_s(&f, "CONOUT$", "w", stdout);
        freopen_s(&f, "CONOUT$", "w", stderr);
    }
    setvbuf(stdout, nullptr, _IONBF, 0);
}

std::function<const char*(const char*)> argFn = [](const char* n) { return argValue(n); };

// MARK: - headless test / tooling modes

/// simulates the game without a window and writes screenshots (used to verify the build)
void runHeadless(const std::string& dir, int startWave, double seconds, double every) {
    const int W = 1600, H = 900;
    renderer = createRenderer(nullptr, W, H, true);
    if (hasArg("--nomsaa")) setMSAA(renderer, 1);
    uiInit();
    Tex::preload();
    setEnvironment(renderer, Tex::sky(), Tex::envPixels(), Tex::envW(), Tex::envH());
    game = new Game(V2(W, H), false);
    game->setDemo(true);
    game->demoMortal = hasArg("--mortal");
    game->applyTestArgs(argFn);
    if (auto m = mapFromArg(argValue("--map"))) game->setMap(*m);
    const float dt = 1.0f / 60;
    float t = 0;
    auto shot = [&](const std::string& name) {
        renderScene(renderer, game->scene, *game->camNode, game->camera, t);
        game->hud->scene->render(rendererBackbuffer(renderer), W, H);
        savePNG(readback(renderer), dir + "/" + name + ".png");
    };
    for (int i = 0; i < 60; i++) { t += dt; frame(dt, t, false); }
    shot("00_menu");
    if (hasArg("--labor")) {
        game->openLabor();
        for (int i = 0; i < 10; i++) { t += dt; frame(dt, t, false); }
        shot("00_labor");
        game->closeLabor();
    }
    game->startGame();
    if (startWave > 1) game->wave = startWave - 1;
    double next = every, elapsed = 0;
    int idx = 1;
    auto wall = std::chrono::steady_clock::now();
    while (elapsed < seconds) {
        t += dt; elapsed += dt;
        frame(dt, t, false);
        if (elapsed >= next) {
            char name[64];
            snprintf(name, sizeof name, "%02d_t%03d", idx, (int)elapsed);
            shot(name);
            idx++; next += every;
        }
        if (hasArg("--perkshot") && game->phase == Phase::perks && game->perkT < dt * 1.5f) {
            for (int i = 0; i < 20; i++) { t += dt; game->scene.update(dt); game->hud->scene->update(dt); }
            shot("perks_w" + std::to_string(game->wave));
        }
    }
    printf("phase %d hp %d\n", (int)game->phase, (int)game->hp);
    double secs = std::chrono::duration<double>(std::chrono::steady_clock::now() - wall).count();
    printf("headless ok: wave %d score %d kills %d enemies %d sim %.0fs in %.1fs\n", game->wave, game->score, game->kills, (int)game->enemies.size(), seconds, secs);
    std::string perks;
    for (auto& kv : game->perkLevels) perks += std::string(perks.empty() ? "" : ",") + perkRaw(kv.first) + "=" + std::to_string(kv.second);
    printf("progression: perks %s cores +%d event %s turrets %d\n", perks.c_str(), game->runCores, game->event ? eventRaw(*game->event) : "-", (int)game->turrets.size());
}

/// renders every enemy type side by side (model check)
void runLineup(const std::string& dir) {
    const int W = 1600, H = 900;
    renderer = createRenderer(nullptr, W, H, true);
    uiInit();
    Tex::preload();
    setEnvironment(renderer, Tex::sky(), Tex::envPixels(), Tex::envW(), Tex::envH());
    game = new Game(V2(W, H), false);
    game->setDemo(true);
    auto cam = Node::make();
    game->scene.root->add(cam);
    float x = 1.5f;
    std::vector<std::shared_ptr<Enemy>> keep;
    for (int k = 0; k < kEnemyKinds; k++) {
        auto kind = (EnemyKind)k;
        if (kind == EnemyKind::tyrant) continue;
        auto e = std::make_shared<Enemy>(kind, V3(x, kind == EnemyKind::drone ? 1.6f : (kind == EnemyKind::boss ? 4.4f : 0), kind == EnemyKind::boss ? 12.f : 16.f), 1);
        e->node->scale = V3(1, 1, 1);
        e->node->setEuler(V3(0, 0.45f, 0));
        game->scene.root->add(e->node);
        keep.push_back(e);
        x += kind == EnemyKind::brute ? 4.5f : (kind == EnemyKind::trooper ? 2.6f : 2.4f);
    }
    Camera c = game->camera;
    auto shot = [&](const char* name, V3 p, V3 look, float fov) {
        cam->position = p;
        cam->lookAt(look);
        c.fieldOfView = fov;
        renderScene(renderer, game->scene, *cam, c, 1);
        savePNG(readback(renderer), dir + "/" + name + ".png");
    };
    // the wave-15 giant on its own
    auto t = std::make_shared<Enemy>(EnemyKind::tyrant, V3(0, 0, 4), 1);
    t->node->scale = V3(1, 1, 1);
    t->node->setEuler(V3(0, 0.2f, 0));
    game->scene.root->add(t->node);
    shot("tyrant_front", V3(2, 4.2f, 20), V3(0, 4.6f, 4), 55);
    shot("tyrant_head", V3(1.2f, 8.2f, 9.5f), V3(0, 7.9f, 4), 45);
    t->node->removeFromParent();
    shot("lineup_small", V3(5.0f, 1.5f, 21.5f), V3(5.4f, 1.0f, 16), 55);
    shot("lineup_big", V3(12, 3.0f, 26), V3(12.5f, 2.8f, 14), 55);
    shot("sky", V3(0, 1.7f, 20), V3(-18, 16, -10), 70);
    // weapons in front of the camera
    game->startGame();
    for (int i = 0; i < 4; i++) {
        game->selectWeapon(i);
        for (int k = 0; k < 40; k++) frame(1.f / 60, 1, k == 39);
        char n[32];
        snprintf(n, sizeof n, "weapon_%d", i + 1);
        savePNG(readback(renderer), dir + "/" + n + ".png");
    }
    printf("lineup ok\n");
}

/// renders the app icon (the Overseer in front of the gas giant, like the Mac icon) into a 1024 px PNG
void runIcon(const std::string& path) {
    const int N = 1024;
    renderer = createRenderer(nullptr, N, N, true);
    uiInit();
    Tex::preload();
    setEnvironment(renderer, Tex::sky(), Tex::envPixels(), Tex::envW(), Tex::envH());
    game = new Game(V2(N, N), false);
    game->setDemo(true);
    Camera c = game->camera;
    c.vignettingIntensity = 0;
    c.colorFringeStrength = 0;
    c.fieldOfView = 38;
    auto cam = Node::make();
    game->scene.root->add(cam);
    V3 base(0, 60, 0);
    auto e = std::make_shared<Enemy>(EnemyKind::boss, base, 1);
    e->node->scale = V3(1, 1, 1);
    game->scene.root->add(e->node);
    // look past the boss toward the planet so it sits behind its shoulder
    V3 toPlanet = Tex::planetDir;
    V3 side = simd_normalize(simd_cross(toPlanet, V3(0, 1, 0)));
    V3 camPos = base - toPlanet * 13 + side * 2.2f + V3(0, -1.0f, 0);
    cam->position = camPos;
    cam->lookAt(base + side * 0.3f + V3(0, 0.2f, 0));
    V3 d = camPos - base;
    e->node->setEuler(V3(0, std::atan2(d.x, d.z) - 0.35f, 0));
    game->scene.update(0.016f);
    renderScene(renderer, game->scene, *cam, c, 1);
    Image shot = readback(renderer);
    // "NOVA" with GDI into an alpha mask
    std::vector<uint8_t> textMask((size_t)N * N, 0);
    {
        HDC dc = CreateCompatibleDC(nullptr);
        BITMAPINFO bi{};
        bi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        bi.bmiHeader.biWidth = N; bi.bmiHeader.biHeight = -N; bi.bmiHeader.biPlanes = 1; bi.bmiHeader.biBitCount = 32;
        void* bits = nullptr;
        HBITMAP bmp = CreateDIBSection(dc, &bi, DIB_RGB_COLORS, &bits, nullptr, 0);
        HGDIOBJ oldB = SelectObject(dc, bmp);
        HFONT f = CreateFontW(-150, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_TT_PRECIS, CLIP_DEFAULT_PRECIS, ANTIALIASED_QUALITY,
                              DEFAULT_PITCH, L"Bahnschrift Condensed");
        HGDIOBJ oldF = SelectObject(dc, f);
        SetBkMode(dc, TRANSPARENT);
        SetTextColor(dc, RGB(255, 255, 255));
        SetTextCharacterExtra(dc, 6);
        RECT tr{100, N - 105 - 190, N - 100, N - 105};
        DrawTextW(dc, L"NOVA", -1, &tr, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
        GdiFlush();
        for (int i = 0; i < N * N; i++) textMask[i] = ((uint8_t*)bits)[i * 4 + 1];
        SelectObject(dc, oldF); SelectObject(dc, oldB);
        DeleteObject(f); DeleteObject(bmp); DeleteDC(dc);
    }
    Image out;
    out.w = out.h = N; out.channels = 4;
    out.px.assign((size_t)N * N * 4, 0);
    const float x0 = 100, y0 = 100, sz = 824, rad = 185;
    auto roundRectDist = [&](float x, float y, float inset) {
        float cx = clampf(x, x0 + rad, x0 + sz - rad), cy = clampf(y, y0 + rad, y0 + sz - rad);
        return std::sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) - (rad - inset);
    };
    for (int y = 0; y < N; y++)
        for (int x = 0; x < N; x++) {
            float inside = clampf(0.5f - roundRectDist(x + 0.5f, y + 0.5f, 0), 0, 1);
            if (x < x0 - 1 || x > x0 + sz + 1 || y < y0 - 1 || y > y0 + sz + 1) inside = 0;
            V3 col(0, 0, 0);
            if (inside > 0) {
                int sx = std::min(N - 1, (int)((x - x0) / sz * N)), sy = std::min(N - 1, (int)((y - y0) / sz * N));
                const uint8_t* p = &shot.px[((size_t)sy * N + sx) * 4];
                col = V3(p[0], p[1], p[2]) / 255.f;
                // darken toward the bottom so the lettering reads
                float g = clampf((y - (y0 + sz - 300)) / 300, 0, 1);
                col *= 1 - 0.55f * g;
                float t = textMask[(size_t)y * N + x] / 255.f;
                col = mix3(col, V3(1, 1, 1), t);
            }
            // cyan border
            float bd = std::fabs(roundRectDist(x + 0.5f, y + 0.5f, 5));
            float border = clampf(5.5f - bd, 0, 1) * (inside > 0 || bd < 6 ? 1.f : 0.f);
            col = mix3(col, V3(0.35f, 0.92f, 1), border * 0.9f);
            float a = std::max(inside, border);
            size_t i = ((size_t)y * N + x) * 4;
            out.px[i] = (uint8_t)(clampf(col.x, 0, 1) * 255); out.px[i + 1] = (uint8_t)(clampf(col.y, 0, 1) * 255);
            out.px[i + 2] = (uint8_t)(clampf(col.z, 0, 1) * 255); out.px[i + 3] = (uint8_t)(a * 255);
        }
    savePNG(out, path, true);
    printf("icon ok\n");
}
}

// MARK: - entry

int WINAPI wWinMain(HINSTANCE inst, HINSTANCE, PWSTR, int) {
    int argc = 0;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    for (int i = 0; i < argc; i++) args.push_back(utf8(argv[i]));
    LocalFree(argv);
    SetProcessDPIAware();
    CoInitializeEx(nullptr, COINIT_MULTITHREADED);
    bool tooling = argValue("--shots") || argValue("--lineup") || argValue("--autotest") || argValue("--icon");
    if (tooling) attachConsole();

    if (const char* dir = argValue("--shots")) {
        int wave = argValue("--wave") ? atoi(argValue("--wave")) : 1;
        double seconds = argValue("--seconds") ? atof(argValue("--seconds")) : 30;
        double every = argValue("--every") ? atof(argValue("--every")) : 5;
        runHeadless(dir, wave, seconds, every);
        fflush(stdout);
        ExitProcess(0);
    }
    if (const char* dir = argValue("--lineup")) { runLineup(dir); fflush(stdout); ExitProcess(0); }
    if (const char* path = argValue("--icon")) { runIcon(path); fflush(stdout); ExitProcess(0); }

    const char* autotest = argValue("--autotest");
    bool windowed = hasArg("--windowed") || autotest;
    bool verbose = hasArg("--verbose");
    auto log = [&](const char* m) { if (verbose) { printf("[%.2f] %s\n", now(), m); fflush(stdout); } };
    log("start");

    WNDCLASSEXW wc{sizeof(wc)};
    wc.style = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc = wndProc;
    wc.hInstance = inst;
    wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    wc.lpszClassName = L"NovaBreach";
    wc.hIcon = LoadIcon(inst, MAKEINTRESOURCE(1));
    RegisterClassExW(&wc);
    log("class registered");
    RECT work;
    SystemParametersInfo(SPI_GETWORKAREA, 0, &work, 0);
    int w = std::min(1600, (int)((work.right - work.left) * 0.9f)), h = std::min(1000, (int)((work.bottom - work.top) * 0.9f));
    RECT r{0, 0, w, h};
    AdjustWindowRect(&r, WS_OVERLAPPEDWINDOW, FALSE);
    hwnd = CreateWindowExW(0, L"NovaBreach", L"NOVA BREACH", WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, r.right - r.left, r.bottom - r.top,
                           nullptr, nullptr, inst, nullptr);
    log("window created");
    RAWINPUTDEVICE rid{0x01, 0x02, 0, hwnd};
    RegisterRawInputDevices(&rid, 1, sizeof(rid));
    log("raw input");
    ShowWindow(hwnd, SW_SHOW);
    UpdateWindow(hwnd);
    log("shown");
    if (!windowed) toggleFullscreen();
    pump();
    RECT cr;
    GetClientRect(hwnd, &cr);
    clientW = std::max(16, (int)(cr.right - cr.left));
    clientH = std::max(16, (int)(cr.bottom - cr.top));

    log("window ready");
    renderer = createRenderer(hwnd, clientW, clientH, false);
    log("renderer ready");
    uiInit();
    loadingScreen(clientW, clientH);
    log("loading screen presented");
    Tex::preload();
    log("textures ready");
    setEnvironment(renderer, Tex::sky(), Tex::envPixels(), Tex::envW(), Tex::envH());
    game = new Game(V2((float)clientW, (float)clientH), !hasArg("--nosound"));
    log("game ready");
    game->onToggleFullscreen = [] { toggleFullscreen(); };

    double startT = now();
    if (autotest) {
        game->setDemo(true);
        game->demoMortal = hasArg("--mortal");
        game->applyTestArgs(argFn);
        game->audio->setMaster(0);
        game->onCapture = [](bool) {};
        if (auto m = mapFromArg(argValue("--map"))) game->setMap(*m);
    } else {
        game->onCapture = [](bool on) { setCapture(on); };
    }
    int startWave = argValue("--wave") ? atoi(argValue("--wave")) : 1;
    double at = argValue("--at") ? atof(argValue("--at")) : 11;
    bool autoStarted = false, waveSet = false;

    double last = now();
    while (pump()) {
        double t = now();
        double dt = t - last;
        last = t;
        if (dt > 0.001) game->fpsAverage = game->fpsAverage == 0 ? 1 / dt : game->fpsAverage * 0.98 + (1 / dt) * 0.02;
        dt = std::min(std::max(dt, 0.0005), 1.0 / 20);
        if (autotest) {
            double el = t - startT;
            if (!autoStarted && el > 2.0 && !hasArg("--menu")) { game->autoStart = true; autoStarted = true; }
            if (!waveSet && el > 2.5) { if (startWave > 1) game->wave = startWave - 1; waveSet = true; }
        }
        frame((float)dt, (float)(t - startT));
        static int frames = 0;
        static double lastLog = 0;
        frames++;
        if (verbose && t - lastLog > 2) { lastLog = t; printf("[%.2f] frame %d phase %d wave %d\n", t - startT, frames, (int)game->phase, game->wave); fflush(stdout); }
        if (autotest && t - startT >= at) {
            savePNG(readback(renderer), autotest);
            printf("phase %d hp %d\n", (int)game->phase, (int)game->hp);
            printf("autotest ok: wave %d score %d kills %d fps %.0f view %dx%d\n", game->wave, game->score, game->kills, game->fpsAverage, rendererWidth(renderer),
                   rendererHeight(renderer));
            std::string perks;
            for (auto& kv : game->perkLevels) perks += std::string(perks.empty() ? "" : ",") + perkRaw(kv.first) + "=" + std::to_string(kv.second);
            printf("progression: perks %s cores +%d event %s ability %s\n", perks.c_str(), game->runCores, game->event ? eventRaw(*game->event) : "-",
                   abilityRaw(game->meta.ability));
            fflush(stdout);
            ExitProcess(0);
        }
        present(renderer);
    }
    setCapture(false);
    ExitProcess(0);
}
