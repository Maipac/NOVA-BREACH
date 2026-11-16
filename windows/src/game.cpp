// Game state, player, camera, waves and the demo autopilot (port of Game.swift).
#include "game.h"
#include "textures.h"
#include <algorithm>

static UIColor rgb(float r, float g, float b) { return UIColor(r, g, b); }

Game::Game(V2 viewSize, bool audioEnabled) {
    mapID = (MapID)std::clamp(Settings::shared().integer("map", 0), 0, kMapCount - 1);
    level = std::make_unique<Level>(scene, mapID);
    fx = std::make_unique<Effects>(scene);
    fx->floorExtent = level->floorExtent;
    hud = std::make_unique<HUD>(viewSize);
    audio = std::make_unique<Audio>(audioEnabled);
    setupCamera();
    buildWeapons();
    // trail behind big projectiles
    trail.image = Tex::glow();
    trail.birthRate = 70;
    trail.lifeSpan = 0.3f;
    trail.lifeSpanVar = 0.1f;
    trail.size = 0.28f;
    trail.sizeVar = 0.1f;
    trail.velocity = 0.3f;
    trail.spreadingAngle = 180;
    trail.blend = Blend::Add;
    trail.opacity = curve({0.7f, 0}, {0, 1});
    trail.sizeCurve = curve({1, 0.2f}, {0, 1});
    scene.gravity = V3(0, -16, 0);
    showMainMenu();
    weaponRoot->hidden = true;
    updateMenuCamera(0);
}

void Game::setupCamera() {
    camera.exposureOffset = 0.1f;
    camera.bloomIntensity = 0.55f;
    camera.bloomThreshold = 1.0f;
    camera.vignettingIntensity = 0.55f;
    camera.vignettingPower = 1.3f;
    camera.colorFringeStrength = 0.6f;
    camera.saturation = 1.12f;
    camera.contrast = 0.18f;
    camera.zNear = 0.03f;
    camera.zFar = 600;
    camera.fieldOfView = fov;
    scene.root->add(camNode);
    // helmet lamp (only on during a blackout; category 1 like the effect lights so it skips the view model)
    auto lamp = std::make_shared<Light>();
    lamp->type = LightType::Spot;
    lamp->color = V3(1.0f, 0.94f, 0.84f);
    lamp->intensity = 3400;
    lamp->spotInner = 14;
    lamp->spotOuter = 44;
    lamp->attenuationStart = 2;
    lamp->attenuationEnd = 42;
    lamp->falloffExponent = 2;
    lamp->categoryBitMask = 1;
    flashlight->light = lamp;
    flashlight->position = V3(0.2f, -0.15f, 0);
    flashlight->hidden = true;
    camNode->add(flashlight);
    weaponRoot->scale = V3(0.2f, 0.2f, 0.2f);
    camNode->add(weaponRoot);
    weaponRoot->add(weaponHolder);
}

// MARK: frame

void Game::tick(float dtReal) {
    InputFrame inp = input.frame();
    if (demo) demoInput(inp);
    if (pauseRequested) {
        pauseRequested = false;
        if (phase == Phase::playing) { setPaused(true); return; }
    }
    if (inp.hit(Key::m)) { audio->setMusicOn(!audio->musicOn()); audio->play("ui"); }
    if (inp.hit(Key::f) && onToggleFullscreen) onToggleFullscreen();

    switch (phase) {
    case Phase::menu: {
        updateMenuCamera(dtReal);
        fx->update(dtReal);
        if (labor) { updateLabor(inp); return; }
        if (inp.hit(Key::l)) { openLabor(); return; }
        int n = kMapCount;
        if (inp.hit(Key::left) || inp.hit(Key::a)) setMap((MapID)(((int)mapID + n - 1) % n));
        if (inp.hit(Key::right) || inp.hit(Key::d)) setMap((MapID)(((int)mapID + 1) % n));
        int nk[4] = {Key::n1, Key::n2, Key::n3, Key::n4};
        for (int i = 0; i < 4; i++) if (inp.hit(nk[i]) && i < kMapCount) setMap((MapID)i);
        bool start = inp.hit(Key::ret) || inp.hit(Key::space) || autoStart;
        if (inp.click) {
            auto h = hud->menuHit(*inp.click);
            if (h) {
                if (h->kind == MenuHitKind::map) {
                    // clicking the selected card starts it, clicking the other one selects it
                    if (h->index == (int)mapID) start = true; else if (h->index >= 0 && h->index < kMapCount) setMap((MapID)h->index);
                } else if (h->kind == MenuHitKind::start) {
                    start = true;
                } else if (h->kind == MenuHitKind::labor) {
                    openLabor();
                    return;
                }
            }
        }
        if (start) { autoStart = false; startGame(); }
        break;
    }
    case Phase::perks:
        updatePerkChoice(dtReal, inp);
        break;
    case Phase::paused:
        if (inp.hit(Key::q)) { goToMenu(); return; }
        if (inp.clicked || inp.hit(Key::esc) || inp.hit(Key::ret)) setPaused(false);
        break;
    case Phase::playing:
        if (inp.hit(Key::esc)) { setPaused(true); return; }
        time += dtReal;
        timeAlive += dtReal;
        simulate(dtReal, inp);
        break;
    case Phase::dead: {
        deadT += dtReal;
        float dt = dtReal * 0.4f;
        time += dt;
        updateWorld(dt);
        fx->update(dtReal);
        updateDeathCamera(dtReal);
        updateHUD(dtReal);
        if (deadT > 1.4f && inp.hit(Key::q)) { goToMenu(); return; }
        if (deadT > 1.4f && (inp.clicked || inp.hit(Key::ret) || inp.hit(Key::space))) startGame();
        break;
    }
    }
}

void Game::setPaused(bool p) {
    if (phase != Phase::playing && phase != Phase::paused) return;
    phase = p ? Phase::paused : Phase::playing;
    scene.isPaused = p;
    audio->play("ui");
    if (p) hud->showPause(); else hud->showGame();
    audio->setMusicVolume(p ? 0.15f : 0.42f);
    input.releaseAll();
    if (onCapture) onCapture(!p);
}

/// removes everything a round left behind (enemies, shots, pickups, effects)
void Game::clearWorld() {
    for (auto& e : enemies) e->node->removeFromParent();
    for (auto& p : projectiles) p->node->removeFromParent();
    for (auto& p : pickups) p->node->removeFromParent();
    enemies.clear(); projectiles.clear(); pickups.clear();
    for (auto& t : turrets) t->node->removeFromParent();
    turrets.clear();
    if (barrier) barrier->node->removeFromParent();
    barrier.reset();
    fx->clear();
    for (auto& g : gateBoost) g = 0;
    for (auto& m : level->portalMaterials) m->params.x = 0;
}

void Game::showMainMenu() {
    auto& d = Settings::shared();
    std::vector<MapEntry> maps;
    for (int i = 0; i < kMapCount; i++) maps.push_back({(MapID)i, d.integer(mapScoreKey((MapID)i)), d.integer(mapWaveKey((MapID)i))});
    hud->showMenu(maps, (int)mapID, meta.cores, abilityName(meta.ability));
}

/// switches the arena while the main menu is open (the menu camera orbits the selected map)
void Game::setMap(MapID id) {
    if (phase != Phase::menu || id == mapID) return;
    level->remove();
    level = std::make_unique<Level>(scene, id);
    fx->floorExtent = level->floorExtent;
    mapID = id;
    if (!demo) Settings::shared().set("map", (int)id);
    gateBoost.assign(level->gates.size(), 0);
    navT = 0;
    showMainMenu();
    audio->play("swap", 0.8f);
}

void Game::goToMenu() {
    clearWorld();
    endEvent();
    resetAbilityEffects();
    labor = false;
    phase = Phase::menu;
    scene.isPaused = false;
    weaponRoot->hidden = true;
    hud->resetTransient();
    showMainMenu();
    audio->play("ui");
    audio->setMusicVolume(0.42f);
    input.releaseAll();
    if (onCapture) onCapture(false);
}

void Game::startGame() {
    clearWorld();
    hud->resetTransient();
    pos = level->playerStart; vel = V3(0, 0, 0); yaw = level->playerYaw; pitch = 0;
    endEvent();
    resetAbilityEffects();
    perkLevels.clear(); perkChoices.clear(); perkPending = -1;
    maxHp = 100; maxShield = 100; invulnT = 0; secondWindUsed = false; runCores = 0; bossKills = 0;
    abilityCD = 0; lastEvent.reset();
    hp = 100; shield = 100; sinceHurt = 10; onGround = true;
    dashCD = 0; dashT = 0; overcharge = 0; eyeY = 1.7f; deadT = 0;
    for (auto& w : weapons) { w->reset(); w->node->hidden = true; }
    cur = 0; pendingWeapon = -1; switchT = 0; reloadT = 0; bloom = 0; kickZ = 0; kickRot = 0;
    weapons[0]->node->hidden = false;
    weaponRoot->hidden = false;
    wave = 0; spawnQueue.clear(); intermission = 2.5f; waveActive = false;
    score = 0; combo = 0; comboT = 0; kills = 0; shotsFired = 0; shotsHit = 0; timeAlive = 0; bossCount = 0;
    nextEvent = rollEvent(1);
    for (auto p : testPerks) if (perk(p) < perkMaxLevel(p)) applyPerk(p);
    scene.isPaused = false;
    phase = Phase::playing;
    hud->showGame();
    hud->announce("BEREIT MACHEN", "Gegner nähern sich über die roten Portale", UIColor::white(), 1.8f);
    audio->play("power", 0.7f);
    audio->setMusicVolume(0.42f);
    input.releaseAll();
    if (onCapture) onCapture(true);
}

void Game::die() {
    if (phase != Phase::playing) return;
    phase = Phase::dead;
    deadT = 0;
    hp = 0;
    weaponRoot->hidden = true;
    audio->play("death");
    audio->setMusicVolume(0.2f);
    fx->shake(1);
    hud->flash(rgb(1, 0.1f, 0.05f), 0.6f, 0.8f);
    auto& d = Settings::shared();
    int best = d.integer(mapScoreKey(mapID));
    bool newBest = score > best;
    if (newBest && !demo) d.set(mapScoreKey(mapID), score);
    if (wave > d.integer(mapWaveKey(mapID)) && !demo) d.set(mapWaveKey(mapID), wave);
    int acc = shotsFired > 0 ? (int)((float)shotsHit / shotsFired * 100) : 0;
    GameOverStats st;
    st.score = score; st.wave = wave; st.kills = kills; st.accuracy = std::min(acc, 100); st.best = std::max(best, score);
    st.newBest = newBest; st.time = (int)timeAlive; st.mapName = mapName(mapID);
    st.cores = runCores; st.totalCores = meta.cores;
    for (auto& kv : perkLevels) st.perks += kv.second;
    hud->showGameOver(st);
    if (onCapture) onCapture(false);
}

// MARK: cameras

void Game::updateMenuCamera(float dt) {
    menuAngle += dt * 0.09f;
    float r = level->menuRadius;
    camNode->position = V3(std::cos(menuAngle) * r, level->menuHeight + std::sin(menuAngle * 0.7f) * 1.5f, std::sin(menuAngle) * r);
    camNode->lookAt(V3(0, level->menuLookY, 0));
    camera.fieldOfView = 62;
}

/// yaw around the world up axis first, then pitch, then roll – explicit so it never depends on Euler order
void Game::setCameraRotation(float p, float y, float r) {
    camNode->orientation = Quat::angleAxis(y, V3(0, 1, 0)) * Quat::angleAxis(p, V3(1, 0, 0)) * Quat::angleAxis(r, V3(0, 0, 1));
}

void Game::updateDeathCamera(float dt) {
    (void)dt;
    float k = std::min(deadT / 1.1f, 1.f);
    float e = k * k * (3 - 2 * k);
    float y = mixf(eyeY, 0.45f, e);
    camNode->position = V3(pos.x, pos.y + y, pos.z);
    setCameraRotation(pitch * (1 - e) + 0.25f * e, yaw, 0.9f * e);
}

// MARK: simulation

void Game::simulate(float dt, const InputFrame& inp) {
    updatePlayer(dt, inp);
    updateWeapons(dt, inp);
    updateAbility(dt, inp);
    updateWorld(dt);
    updateWaves(dt);
    fx->update(dt);
    updateCamera(dt, inp);
    updateHUD(dt);
}

void Game::updateWorld(float dt) {
    navT -= dt;
    if (navT <= 0) {
        navT = 0.14f;
        level->nav->rebuild(pos);
    }
    // Zeitlupe slows the machines, never the player or their shots
    updateEnemies(dt * enemyTimeScale());
    updateProjectiles(dt);
    updatePickups(dt);
    updateTurrets(dt);
    updateBarrier(dt);
    for (size_t i = 0; i < std::min(gateBoost.size(), level->portalMaterials.size()); i++) {
        if (gateBoost[i] <= 0) continue;
        gateBoost[i] = std::max(0.f, gateBoost[i] - dt * 1.5f);
        level->portalMaterials[i]->params.x = gateBoost[i];
    }
}

void Game::updatePlayer(float dt, const InputFrame& inp) {
    const float sens = 0.0021f;
    yaw -= inp.dx * sens;
    pitch = clampf(pitch - inp.dy * sens, -1.5f, 1.5f);
    yaw = wrapAngle(yaw);

    V3 wish(0, 0, 0);
    if (inp.down(Key::w)) wish += fwd();
    if (inp.down(Key::s)) wish -= fwd();
    if (inp.down(Key::d)) wish += rightV();
    if (inp.down(Key::a)) wish -= rightV();
    float wl = simd_length(wish);
    if (wl > 0) wish /= wl;
    bool sprint = inp.down(Key::shift) && inp.down(Key::w) && wl > 0;
    float maxSpeed = (sprint ? 9.6f : 6.6f) * moveMul();

    // dash
    dashCD = std::max(0.f, dashCD - dt);
    if (inp.hit(Key::q) && dashCD <= 0) {
        dashDir = wl > 0 ? wish : fwd();
        dashT = 0.17f; dashCD = dashCooldown();
        audio->play("dash");
        fx->shake(0.12f);
    }
    if (dashT > 0) {
        dashT -= dt;
        vel.x = dashDir.x * 25; vel.z = dashDir.z * 25;
        if (dashT <= 0) { vel.x = dashDir.x * maxSpeed; vel.z = dashDir.z * maxSpeed; }
    } else {
        V3 target = wish * maxSpeed;
        V3 dv(target.x - vel.x, 0, target.z - vel.z);
        float accel = onGround ? (wl > 0 ? 70.f : 55.f) : (wl > 0 ? 22.f : 2.f);
        float l = simd_length(dv);
        float maxDv = accel * dt;
        if (l > maxDv) dv *= maxDv / l;
        vel += dv;
    }

    // jump (buffered, with coyote time)
    jumpBuffer = inp.hit(Key::space) ? 0.12f : std::max(0.f, jumpBuffer - dt);
    coyote = onGround ? 0.1f : std::max(0.f, coyote - dt);
    if (jumpBuffer > 0 && coyote > 0) {
        vel.y = event == WaveEvent::lowGravity ? 7.2f : 7.8f; onGround = false; coyote = 0; jumpBuffer = 0;
        audio->play("jump", 0.5f);
    }
    vel.y -= 21 * gravityScale() * dt;

    // horizontal move + collision
    V3 p(pos.x + vel.x * dt, pos.y, pos.z + vel.z * dt);
    level->resolve(p, 0.45f, pos.y, 1.8f);
    for (auto& e : enemies) {
        if (e->dead || flies(e->kind)) continue;
        V2 d(p.x - e->pos.x, p.z - e->pos.z);
        float l = simd_length(d), minD = e->radius + 0.4f;
        if (l < minD && l > 1e-3f && std::fabs(e->pos.y - pos.y) < 1.6f) {
            V2 push = d / l * (minD - l) * 0.5f;
            p.x += push.x; p.z += push.y;
        }
    }
    // vertical
    float ny = pos.y + vel.y * dt;
    float g = level->groundHeight(p.x, p.z, 0.3f, std::max(pos.y, ny), onGround ? 0.5f : 0.08f);
    if (ny <= g) {
        if (!onGround && vel.y < -7) { audio->play("land", std::min(1.f, -vel.y / 16)); fx->shake(std::min(0.25f, -vel.y / 60)); }
        ny = g; vel.y = 0; onGround = true;
    } else if (onGround && ny - g < 0.5f && vel.y <= 0) {
        ny = g; vel.y = 0;   // stick to stairs when walking down
    } else {
        onGround = false;
    }
    // actual velocity after collision (keeps sliding along walls sane)
    vel.x = (p.x - pos.x) / dt * 0.5f + vel.x * 0.5f;
    vel.z = (p.z - pos.z) / dt * 0.5f + vel.z * 0.5f;
    pos = V3(p.x, ny, p.z);

    float sp = len2(vel);
    if (onGround && sp > 1) bob += dt * sp * 1.25f;
    sinceHurt += dt;
    if (sinceHurt > 4 && shield < maxShield && event != WaveEvent::emp) shield = std::min(maxShield, shield + 24 * shieldRegenMul() * dt);
    if (invulnT > 0) invulnT -= dt;
    if (overcharge > 0) overcharge = std::max(0.f, overcharge - dt);
    if (combo > 0) { comboT -= dt / 4.5f; if (comboT <= 0) combo = 0; }
    float targetFov = 64 + (sprint ? 5.f : 0.f) + (dashT > 0 ? 10.f : 0.f);
    fov += (targetFov - fov) * std::min(1.f, dt * 9);
}

void Game::updateCamera(float dt, const InputFrame& inp) {
    // eye height follows smoothly so steps don't snap the view
    float targetEye = 1.7f;
    eyeY += (targetEye - eyeY) * std::min(1.f, dt * 12);
    float sp = std::min(len2(vel) / 6.6f, 1.4f);
    float bobY = onGround ? std::sin(bob * 2) * 0.035f * sp : 0;
    float bobX = onGround ? std::cos(bob) * 0.02f * sp : 0;
    float tr = fx->trauma * fx->trauma;
    V3 sh = V3(frand(-1, 1), frand(-1, 1), frand(-1, 1)) * tr * 0.045f;
    recoilPitch = std::max(0.f, recoilPitch - dt * 0.9f - recoilPitch * dt * 9);
    float strafeRoll = -simd_dot(vel, rightV()) / 9.6f * 0.022f;
    camNode->position = eye() + V3(0, bobY, 0) + rightV() * bobX;
    setCameraRotation(pitch + recoilPitch + sh.x, yaw + sh.y, strafeRoll + sh.z);
    camera.fieldOfView = fov;

    // view model motion
    sway.x += (clampf(-inp.dx * 0.0012f, -0.06f, 0.06f) - sway.x) * std::min(1.f, dt * 10);
    sway.y += (clampf(inp.dy * 0.0012f, -0.05f, 0.05f) - sway.y) * std::min(1.f, dt * 10);
    kickZ = std::max(0.f, kickZ - dt * 1.4f - kickZ * dt * 14);
    kickRot = std::max(0.f, kickRot - dt * 0.8f - kickRot * dt * 12);
    V3 off(0.30f + sway.x + bobX * 0.6f, -0.30f + sway.y - bobY * 0.7f - (onGround ? 0 : clampf(vel.y * 0.006f, -0.05f, 0.05f)), -0.84f + kickZ);
    V3 rot(kickRot + sway.y * 0.6f, sway.x * 0.8f, sway.x * 0.5f);
    if (reloadT > 0) {
        float k = std::sin((1 - reloadT / reloadDur) * PI);
        off.y -= 0.22f * k; rot.x -= 0.5f * k; rot.z += 0.35f * k;
    }
    if (switchT > 0) {
        // first half: lower the old weapon, second half: raise the new one
        float k = switchT > 0.14f ? (0.28f - switchT) / 0.14f : switchT / 0.14f;
        off.y -= 0.45f * k; rot.x -= 0.7f * k;
    }
    if (inp.down(Key::shift) && inp.down(Key::w) && onGround && reloadT <= 0) { rot.y += 0.25f; off.x -= 0.03f; off.y -= 0.03f; }
    weaponHolder->position = off;
    weaponHolder->setEuler(rot);
    if (flashT > 0) {
        flashT -= dt;
        if (flashT <= 0) weapons[cur]->flash->hidden = true;
    }
}

void Game::updateHUD(float dt) {
    Weapon& w = *weapons[cur];
    std::vector<std::pair<V2, bool>> pts;
    float cy = std::cos(yaw), sy = std::sin(yaw);
    for (auto& e : enemies) {
        if (e->dead) continue;
        float dx = e->pos.x - pos.x, dz = e->pos.z - pos.z;
        // rotate into view space: +y on the radar = forward
        pts.push_back({V2(dx * cy - dz * sy, -(dx * sy + dz * cy)), isBoss(e->kind)});
    }
    hud->setRadar(pts, 34);
    EnemyRef boss;
    for (auto& e : enemies) if (isBoss(e->kind) && !e->dead) { boss = e; break; }
    std::vector<std::string> names;
    std::vector<bool> usable;
    for (auto& x : weapons) { names.push_back(x->def.shortName); usable.push_back(x->ammo > 0 || x->reserve != 0); }
    int left = (int)spawnQueue.size();
    for (auto& e : enemies) if (!e->dead) left++;
    std::string bossName = boss ? (boss->kind == EnemyKind::tyrant ? std::string("HITLER") : "OVERSEER  MK " + std::to_string(bossCount)) : "";
    hud->update(dt, hp, maxHp, shield, maxShield, w.ammo, w.reserveMax < 0 ? -1 : w.reserve, w.def.name, cur, names, usable, w.def.color,
                w.def.spread * (w.def.pellets > 1 ? 0.5f : 1) + bloom, reloadT, 1 - dashCD / dashCooldown(), overcharge, score, comboMult(), comboT,
                std::max(wave, 1), left, boss ? &bossName : nullptr, boss ? boss->hp / boss->maxHp : 0);
    updateAbilityHUD();
    std::string ev = event ? std::string("◆ ") + eventName(*event) : "";
    hud->setEvent(event ? &ev : nullptr, event ? eventColor(*event) : V3(1, 1, 1));
}

// MARK: player damage

void Game::hurtPlayer(float amount, std::optional<V3> src) {
    if (phase != Phase::playing || dashT > 0 || invulnT > 0) return;
    if (demo && !demoMortal) return;
    float a = amount;
    sinceHurt = 0;
    if (shield > 0) {
        float s = std::min(shield, a);
        shield -= s; a -= s;
        audio->play("shieldHit", 0.7f);
        if (shield <= 0) hud->flash(rgb(0.3f, 0.9f, 1), 0.25f, 0.3f);
    }
    if (a > 0) {
        hp -= a;
        audio->play("hurt", 0.9f);
    }
    float ang = 0;
    bool hasAng = false;
    if (src) {
        V3 to = safeNorm(V3(src->x - pos.x, 0, src->z - pos.z));
        ang = std::atan2(simd_dot(to, rightV()), simd_dot(to, fwd()));
        hasAng = true;
    }
    hud->damage(amount, hasAng ? &ang : nullptr);
    fx->shake(std::min(0.5f, 0.12f + amount / 50));
    if (hp <= 0) {
        if (hasPerk(PerkID::secondWind) && !secondWindUsed) triggerSecondWind(); else die();
    }
}

// MARK: waves

void Game::updateWaves(float dt) {
    if (!waveActive) {
        if (perkPending > 0) {
            perkPending -= dt;
            if (perkPending <= 0) { perkPending = -1; openPerkChoice(); return; }
        }
        intermission -= dt;
        if (intermission <= 0 && perkPending <= 0) startWave();
        return;
    }
    int alive = (int)enemies.size();
    if (!spawnQueue.empty()) {
        spawnT -= dt;
        int cap = event == WaveEvent::swarm ? std::min(14 + wave * 3, 34) : std::min(8 + wave * 2, 26);
        if (spawnT <= 0 && alive < cap) {
            EnemyKind k = spawnQueue.front();
            spawnQueue.erase(spawnQueue.begin());
            spawnEnemy(k);
            spawnT = std::max(0.22f, 0.95f - wave * 0.045f) * frand(0.7f, 1.3f);
        }
    } else if (alive == 0) {
        waveActive = false;
        intermission = 5.5f;
        int bonus = 250 * wave;
        score += bonus;
        // cores: more for later waves, extra for surviving an event
        int gained = 1 + wave / 5;
        if (event) {
            gained += eventBonusCores(*event);
            lastEvent = event;
            endEvent();
        }
        earnCores(gained);
        hud->announce("WELLE " + std::to_string(wave) + " GESCHAFFT", "+" + std::to_string(bonus) + " Bonus  ·  +" + std::to_string(gained) + " Kerne",
                      rgb(0.4f, 1, 0.6f), 2.2f);
        audio->play("waveClear");
        nextEvent = rollEvent(wave + 1);
        perkPending = 1.4f;
        // resupply
        auto spots = level->pickupSpots;
        std::shuffle(spots.begin(), spots.end(), rng());
        spawnPickup(PickupKind::health, spots[0]);
        spawnPickup(PickupKind::ammo, spots[1]);
        if (wave % 3 == 0) spawnPickup(PickupKind::power, spots[2]);
    }
}

void Game::startWave() {
    wave += 1;
    waveActive = true;
    spawnT = 0.6f;
    bool boss = wave % 5 == 0;
    event = boss ? std::nullopt : nextEvent;
    nextEvent.reset();
    float budget = 4.5f + wave * 3.0f + std::pow((float)wave, 1.3f);
    if (boss) budget *= 0.45f;
    using K = EnemyKind;
    std::vector<K> pool = {K::skitter, K::skitter};
    if (wave >= 2) pool.insert(pool.end(), {K::drone, K::drone});
    if (wave >= 3) pool.insert(pool.end(), {K::trooper, K::trooper});
    if (wave >= 4) pool.push_back(K::roller);
    if (wave >= 6) pool.push_back(K::brute);
    if (wave >= 9) pool.insert(pool.end(), {K::trooper, K::brute, K::roller});
    if (event == WaveEvent::swarm) {
        pool = {K::skitter, K::skitter, K::skitter, K::drone, K::roller};
        budget *= 1.5f;
    }
    std::vector<K> q;
    int guard = 0;
    while (budget > 0.9f && guard < 200) {
        guard++;
        K k = pool[irand(0, (int)pool.size())];
        if (kindCost(k) > budget + 0.5f) continue;
        q.push_back(k);
        budget -= kindCost(k);
    }
    std::shuffle(q.begin(), q.end(), rng());
    // wave 15: the giant instead of the Overseer (the Overseer keeps counting MK 1, 2, 3 …)
    bool tyrantWave = wave == 15;
    if (boss) {
        if (tyrantWave) q.insert(q.begin(), K::tyrant);
        else { q.insert(q.begin(), K::boss); bossCount++; }
    }
    spawnQueue = q;
    if (boss) {
        hud->announce(tyrantWave ? "ENDGEGNER" : "WARNUNG", tyrantWave ? "HITLER betritt die Arena" : "OVERSEER nähert sich", rgb(1, 0.2f, 0.15f),
                      tyrantWave ? 3.f : 2.4f);
        audio->play("boss");
    } else if (event) {
        hud->announce("WELLE " + std::to_string(wave), std::string(eventName(*event)) + "  ·  " + eventDesc(*event), UIColor::of(eventColor(*event)), 2.4f);
        audio->play("wave", 0.8f);
        beginEvent(*event);
    } else {
        hud->announce("WELLE " + std::to_string(wave), std::to_string(q.size()) + " Feindkontakte", UIColor::white(), 1.5f);
        audio->play("wave", 0.8f);
    }
}

void Game::spawnEnemy(EnemyKind kind, std::optional<V3> forced) {
    // prefer gates that are not right next to the player
    std::vector<int> order;
    for (int i = 0; i < (int)level->gates.size(); i++) order.push_back(i);
    std::sort(order.begin(), order.end(), [&](int a, int b) { return simd_distance(level->gates[a].pos, pos) > simd_distance(level->gates[b].pos, pos); });
    int gi = order[irand(0, 3)];
    const Gate& gate = level->gates[gi];
    V3 sideV(gate.dir.z, 0, -gate.dir.x);
    V3 p = forced ? *forced : (gate.pos + sideV * frand(-1.6f, 1.6f) + gate.dir * frand(0, 1.5f));
    if (!forced) {
        if (kind == EnemyKind::drone) p.y = 3.2f;
        if (kind == EnemyKind::boss) { p = gate.pos + gate.dir * 7; p.y = 6.5f; }
        if (kind == EnemyKind::tyrant) { p = gate.pos + gate.dir * 3; p.y = 0; }
        gateBoost[gi] = 1;
    }
    float hpScale = 1 + (wave - 1) * 0.07f + (kind == EnemyKind::boss ? (bossCount - 1) * 0.45f : 0);
    auto e = std::make_shared<Enemy>(kind, p, hpScale);
    if (event == WaveEvent::frenzy) e->speed *= 1.35f;
    e->yaw = std::atan2(pos.x - p.x, pos.z - p.z);
    scene.root->add(e->node);
    enemies.push_back(e);
    fx->spawnFlash(flies(kind) ? p - V3(0, 1, 0) : p, kindGlow(kind));
    audio->play("spawn", p, pos, yaw, 0.9f);
}

// MARK: demo autopilot (used for automated screenshots)

void Game::demoInput(InputFrame& inp) {
    inp = InputFrame();
    if (phase == Phase::menu || phase == Phase::dead) return;
    EnemyRef best;
    float bd = 1e30f;
    for (auto& e : enemies) {
        if (e->dead || e->spawnT > 0) continue;
        float d = simd_distance(e->center(), eye());
        if (d < bd && level->lineOfSight(eye(), e->center())) { bd = d; best = e; }
    }
    inp.keys.insert(Key::w);
    inp.keys.insert(std::fmod(time, 6.f) < 3 ? Key::a : Key::d);
    if (best) {
        V3 to = safeNorm(best->center() - eye());
        float ty = std::atan2(-to.x, -to.z), tp = std::asin(clampf(to.y, -1, 1));
        float dyaw = wrapAngle(ty - yaw), dp = tp - pitch;
        inp.dx = -dyaw * 0.25f / 0.0021f;
        inp.dy = -dp * 0.25f / 0.0021f;
        inp.fire = std::fabs(dyaw) < 0.06f && std::fabs(dp) < 0.06f;
        inp.clicked = inp.fire;
    } else {
        V3 to = safeNorm(V3(0, 1.5f, 0) - eye());
        float dyaw = wrapAngle(std::atan2(-to.x, -to.z) - yaw);
        inp.dx = -dyaw * 0.1f / 0.0021f;
        inp.dy = pitch * 0.1f / 0.0021f;
    }
    demoWeaponT += 1.0f / 60;
    int nk[4] = {Key::n1, Key::n2, Key::n3, Key::n4};
    if (demoWeaponT > 5) { demoWeaponT = 0; inp.pressed.push_back(nk[(cur + 1) % 4]); }
    if (best && abilityCD <= 0 && frand() < 0.01f) inp.pressed.push_back(Key::e);
}
