#include "hud.h"
#include <cstdio>

namespace {
const FontId fontHeavy = FontId::Heavy, fontDemi = FontId::Demi, fontMono = FontId::Mono;
const UIColor cCyan(0.35f, 0.92f, 1.0f), cRed(1.0f, 0.25f, 0.2f), cOrange(1.0f, 0.62f, 0.15f), cDim(0.6f, 0.75f, 0.85f);
const UIColor cInk(0.02f, 0.04f, 0.07f);

std::shared_ptr<SKLabel> label(const std::string& text, FontId font, float size, UIColor color = UIColor::white(), HAlign h = HAlign::Center,
                               VAlign v = VAlign::Baseline) {
    auto l = std::make_shared<SKLabel>();
    l->text = text; l->font = font; l->fontSize = size; l->fontColor = color; l->h = h; l->v = v;
    return l;
}
std::string fmt(const char* f, ...) {
    char b[512];
    va_list a;
    va_start(a, f);
    vsnprintf(b, sizeof b, f, a);
    va_end(a);
    return b;
}
}

/// slanted status bar
struct Bar {
    SKRef node = SKNode::make();
    std::shared_ptr<SKShape> fill = std::make_shared<SKShape>();
    float w, h, slant, last = -1;
    Bar(float w_, float h_, float slant_, UIColor color) : w(w_), h(h_), slant(slant_) {
        auto bg = SKShape::path(path(1), true);
        bg->fillColor = UIColor(0, 0, 0, 0.45f);
        bg->strokeColor = color.withAlpha(0.55f);
        bg->lineWidth = 1.5f;
        node->addChild(bg);
        fill->fillColor = color;
        fill->strokeColor = UIColor::clear();
        node->addChild(fill);
        set(1);
    }
    std::vector<V2> path(float f) const {
        float x = w * f;
        return {V2(0, 0), V2(x, 0), V2(x + slant, h), V2(slant, h)};
    }
    void set(float f) {
        float v = clampf(f, 0, 1);
        if (std::fabs(v - last) < 0.004f) return;
        last = v;
        fill->setPath(path(v), true);
        fill->hidden = v <= 0.001f;
    }
    void setColor(UIColor c) { fill->fillColor = c; }
};

/// radial edge texture for damage / low health (straight alpha)
static TexRef edgeTexture(V3 c, float power) {
    Image img;
    img.w = img.h = 256;
    img.px.resize(256 * 256 * 4);
    for (int y = 0; y < 256; y++)
        for (int x = 0; x < 256; x++) {
            float u = (x + 0.5f) / 256 * 2 - 1, v = (y + 0.5f) / 256 * 2 - 1;
            float d = std::min(1.f, std::sqrt(u * u * 0.9f + v * v * 0.9f) / 1.25f);
            float a = std::pow(d, power);
            size_t i = ((size_t)y * 256 + x) * 4;
            img.px[i] = (uint8_t)(c.x * 255); img.px[i + 1] = (uint8_t)(c.y * 255); img.px[i + 2] = (uint8_t)(c.z * 255);
            img.px[i + 3] = (uint8_t)(a * 255);
        }
    return uiTexture(img);
}

HUD::HUD(V2 size) {
    scene->size = size;
    hpBar = std::make_shared<Bar>(300, 16, 8, UIColor(0.3f, 1.0f, 0.55f));
    shBar = std::make_shared<Bar>(300, 9, 5, cCyan);
    dashBar = std::make_shared<Bar>(70, 4, 2, cCyan);
    comboBar = std::make_shared<Bar>(120, 5, 3, cOrange);
    bossBar = std::make_shared<Bar>(620, 14, 8, cRed);
    abilityBar = std::make_shared<Bar>(130, 6, 3, cOrange);
    vignette = std::make_shared<SKSprite>(); vignette->texture = edgeTexture(V3(1, 0.05f, 0.02f), 2.6f);
    lowHp = std::make_shared<SKSprite>(); lowHp->texture = edgeTexture(V3(0.9f, 0, 0), 3.4f);
    flashNode = std::make_shared<SKSprite>(); flashNode->color = UIColor::white();
    dim = std::make_shared<SKSprite>(); dim->color = UIColor(0.0f, 0.02f, 0.05f);
    reloadLabel = label("", fontDemi, 16, cCyan);
    powerLabel = label("", fontHeavy, 20, UIColor(0.8f, 0.5f, 1));
    hpLabel = label("100", fontHeavy, 54, UIColor::white(), HAlign::Left);
    shLabel = label("100", fontHeavy, 26, cCyan, HAlign::Left);
    ammoLabel = label("36", fontHeavy, 72, UIColor::white(), HAlign::Right);
    reserveLabel = label("/ ∞", fontHeavy, 28, cDim, HAlign::Left);
    weaponLabel = label("PULSGEWEHR", fontDemi, 20, cCyan, HAlign::Right);
    waveLabel = label("WELLE 1", fontHeavy, 30);
    enemiesLabel = label("", fontDemi, 17, cDim);
    scoreLabel = label("0", fontHeavy, 44, UIColor::white(), HAlign::Right);
    comboLabel = label("", fontHeavy, 26, cOrange, HAlign::Right);
    bossLabel = label("", fontHeavy, 20, cRed);
    eventLabel = label("", fontHeavy, 17, cOrange);
    abilityName = label("", fontDemi, 16, UIColor::white(), HAlign::Left);
    abilityStatus = label("", fontDemi, 13, cDim, HAlign::Left);
    abilityKey = SKShape::rect(V2(38, 38), 6);
    announceL = label("", fontHeavy, 84);
    announceSub = label("", fontDemi, 26, cCyan);
    build();
    layout(size);
}

void HUD::build() {
    for (auto& n : {vignette, lowHp, flashNode}) {
        n->alpha = 0; n->zPosition = 1;
        scene->addChild(n);
    }
    scene->addChild(gameLayer);
    gameLayer->zPosition = 5;
    for (auto& a : {center, bl, br, tl, tr, tc}) gameLayer->addChild(a);
    dim->alpha = 0; dim->zPosition = 20;
    scene->addChild(dim);
    overlay->zPosition = 30;
    scene->addChild(overlay);
    overlay->addChild(menuNode);

    // crosshair
    for (int i = 0; i < 4; i++) {
        auto l = SKShape::rect(V2(i < 2 ? 9.f : 2.2f, i < 2 ? 2.2f : 9.f), 1);
        l->fillColor = UIColor::white(); l->strokeColor = UIColor(0, 0, 0, 0.5f); l->lineWidth = 0.8f;
        center->addChild(l); crossLines.push_back(l);
    }
    auto dot = SKShape::circle(1.6f);
    dot->fillColor = cCyan; dot->strokeColor = UIColor::clear();
    center->addChild(dot);
    for (int i = 0; i < 4; i++) {
        auto l = SKShape::rect(V2(12, 2.6f), 1);
        l->fillColor = UIColor::white(); l->strokeColor = UIColor::clear();
        float a = PI / 4 + i * PI / 2;
        l->zRotation = a;
        l->position = V2(std::cos(a) * 15, std::sin(a) * 15);
        hitMarker->addChild(l); hitLines.push_back(l);
    }
    hitMarker->alpha = 0;
    center->addChild(hitMarker);
    dashBar->node->position = V2(-35, -46);
    center->addChild(dashBar->node);
    reloadLabel->position = V2(0, -78);
    center->addChild(reloadLabel);
    powerLabel->position = V2(0, -110);
    center->addChild(powerLabel);
    for (int i = 0; i < 5; i++) {
        auto a = SKShape::path(arcPoints(V2(0, 0), 120, PI / 2 - 0.34f, PI / 2 + 0.34f), false);
        a->strokeColor = cRed; a->lineWidth = 9; a->roundCap = true; a->alpha = 0;
        a->glowWidth = 3;
        center->addChild(a);
        dmgArcs.push_back(a); dmgAngles.push_back(0); dmgLife.push_back(0);
    }

    // bottom left: health
    auto hpTag = label("VITAL", fontDemi, 15, cDim, HAlign::Left);
    hpTag->position = V2(0, 84);
    hpLabel->position = V2(0, 34);
    shLabel->position = V2(112, 36);
    auto shTag = label("SCHILD", fontDemi, 13, cCyan.withAlpha(0.8f), HAlign::Left);
    shTag->position = V2(112, 62);
    hpBar->node->position = V2(0, 10);
    shBar->node->position = V2(5, -3);
    for (SKRef n : {(SKRef)hpTag, (SKRef)hpLabel, (SKRef)shLabel, (SKRef)shTag, hpBar->node, shBar->node}) bl->addChild(n);

    // bottom left, next to the bars: ability on E
    abilityNode->position = V2(350, 0);
    abilityKey->position = V2(19, 30);
    abilityKey->lineWidth = 2;
    abilityKey->addChild(label("E", fontHeavy, 22, UIColor::white(), HAlign::Center, VAlign::Center));
    abilityName->position = V2(50, 36);
    abilityBar->node->position = V2(50, 20);
    abilityStatus->position = V2(50, 0);
    for (SKRef n : {(SKRef)abilityKey, (SKRef)abilityName, abilityBar->node, (SKRef)abilityStatus}) abilityNode->addChild(n);
    bl->addChild(abilityNode);

    // bottom right: ammo + weapon slots
    ammoLabel->position = V2(-84, 30);
    reserveLabel->position = V2(-76, 34);
    weaponLabel->position = V2(0, 100);
    br->addChild(ammoLabel); br->addChild(reserveLabel); br->addChild(weaponLabel);
    for (int i = 0; i < 4; i++) {
        auto b = SKShape::rect(V2(64, 22), 3);
        b->position = V2(-32 - (3 - i) * 70.f, 6);
        b->lineWidth = 1.5f;
        auto k = label(std::to_string(i + 1), fontMono, 11, cDim, HAlign::Left, VAlign::Center);
        k->position = V2(-28, 0);
        auto nm = label("", fontDemi, 12, UIColor::white(), HAlign::Center, VAlign::Center);
        nm->position = V2(5, 0);
        b->addChild(k); b->addChild(nm);
        br->addChild(b);
        slots.push_back({b, k, nm});
    }

    // top centre: wave / boss
    waveLabel->position = V2(0, -44);
    enemiesLabel->position = V2(0, -66);
    eventLabel->position = V2(0, -90);
    tc->addChild(waveLabel); tc->addChild(enemiesLabel); tc->addChild(eventLabel);
    bossBar->node->position = V2(-310, -118);
    bossLabel->position = V2(0, -98);
    bossNode->addChild(bossBar->node); bossNode->addChild(bossLabel);
    bossNode->hidden = true;
    tc->addChild(bossNode);

    // top right: score
    auto scTag = label("PUNKTE", fontDemi, 15, cDim, HAlign::Right);
    scTag->position = V2(0, -30);
    scoreLabel->position = V2(0, -74);
    comboLabel->position = V2(0, -106);
    comboBar->node->position = V2(-124, -118);
    for (SKRef n : {(SKRef)scTag, (SKRef)scoreLabel, (SKRef)comboLabel, comboBar->node}) tr->addChild(n);
    for (int i = 0; i < 5; i++) {
        auto f = label("", fontDemi, 16, cDim, HAlign::Right);
        f->position = V2(0, -150 - i * 22.f);
        f->alpha = 0;
        tr->addChild(f); feed.push_back(f);
    }

    // top left: radar
    radar->position = V2(radarR + 6, -(radarR + 6));
    auto ring = SKShape::circle(radarR);
    ring->fillColor = UIColor(0, 0.08f, 0.12f, 0.5f);
    ring->strokeColor = cCyan.withAlpha(0.7f); ring->lineWidth = 1.5f;
    radar->addChild(ring);
    auto ring2 = SKShape::circle(radarR * 0.5f);
    ring2->fillColor = UIColor::clear(); ring2->strokeColor = cCyan.withAlpha(0.25f); ring2->lineWidth = 1;
    radar->addChild(ring2);
    auto me = SKShape::path({V2(0, 7), V2(5, -5), V2(-5, -5)}, true);
    me->fillColor = UIColor::white(); me->strokeColor = UIColor::clear();
    radar->addChild(me);
    for (int i = 0; i < 48; i++) {
        auto b = SKShape::circle(3);
        b->fillColor = cRed; b->strokeColor = UIColor::clear(); b->hidden = true;
        radar->addChild(b); blips.push_back(b);
    }
    tl->addChild(radar);

    // announcements
    announceL->alpha = 0; announceSub->alpha = 0;
    gameLayer->addChild(announceL); gameLayer->addChild(announceSub);
}

void HUD::layout(V2 size) {
    laidOut = size;
    scene->size = size;
    s = std::max(0.6f, std::min(size.y / 900, size.x / 1440));
    float w = size.x, h = size.y;
    float m = 34 * s;
    center->position = V2(w / 2, h / 2);
    bl->position = V2(m, m);
    br->position = V2(w - m, m);
    tl->position = V2(m, h - m);
    tr->position = V2(w - m, h - m);
    tc->position = V2(w / 2, h);
    for (auto& a : {center, bl, br, tl, tr, tc}) a->setScale(s);
    announceL->position = V2(w / 2, h * 0.68f); announceL->setScale(s);
    announceSub->position = V2(w / 2, h * 0.68f - 44 * s); announceSub->setScale(s);
    for (auto& n : {vignette, lowHp, flashNode, dim}) {
        n->position = V2(w / 2, h / 2);
        n->size = size;
    }
    overlay->position = V2(w / 2, h / 2);
    overlay->setScale(s);
}

void HUD::resizeIfNeeded(V2 size) {
    if (size.x != laidOut.x || size.y != laidOut.y) layout(size);
}

// MARK: per-frame state

void HUD::update(float dt, float hp, float hpMax, float shield, float shieldMax, int ammo, int reserve, const std::string& weaponName, int weaponIndex,
                 const std::vector<std::string>& weaponNames, const std::vector<bool>& weaponUsable, V3 weaponColor, float spread, float reloading,
                 float dash, float overcharge, int score, int combo, float comboT, int wave, int enemiesLeft, const std::string* bossName, float bossHp) {
    time += dt;
    hpBar->set(hp / std::max(hpMax, 1.f));
    shBar->set(shield / std::max(shieldMax, 1.f));
    hpLabel->text = std::to_string((int)std::ceil(hp));
    shLabel->text = std::to_string((int)shield);
    bool low = hp < 35;
    hpLabel->fontColor = low ? cRed : UIColor::white();
    hpBar->setColor(low ? cRed : UIColor(0.3f, 1.0f, 0.55f));
    float targetLow = low ? (0.35f + 0.25f * std::sin(time * 6)) * (1 - hp / 35 * 0.6f) : 0;
    lowHp->alpha += (targetLow - lowHp->alpha) * 0.2f;

    ammoLabel->text = std::to_string(ammo);
    ammoLabel->fontColor = ammo == 0 ? cRed : UIColor::white();
    reserveLabel->text = reserve < 0 ? "/ ∞" : "/ " + std::to_string(reserve);
    weaponLabel->text = weaponName;
    UIColor wc = UIColor::of(weaponColor);
    weaponLabel->fontColor = wc;
    for (size_t i = 0; i < slots.size() && i < weaponNames.size(); i++) {
        auto& sl = slots[i];
        sl.name->text = weaponNames[i];
        bool active = (int)i == weaponIndex;
        sl.box->fillColor = active ? wc.withAlpha(0.3f) : UIColor(0, 0, 0, 0.4f);
        sl.box->strokeColor = active ? wc : cDim.withAlpha(0.35f);
        sl.name->fontColor = weaponUsable[i] ? UIColor::white() : UIColor::white(1, 0.35f);
    }

    // crosshair spread
    float gap = 7 + spread * 520;
    crossLines[0]->position = V2(gap + 4, 0); crossLines[1]->position = V2(-gap - 4, 0);
    crossLines[2]->position = V2(0, gap + 4); crossLines[3]->position = V2(0, -gap - 4);
    dashBar->set(dash);
    dashBar->node->alpha = dash >= 1 ? 0.35f : 1;
    reloadLabel->text = reloading > 0 ? "LADE NACH…" : (ammo == 0 ? "LEER – [R]" : "");
    powerLabel->text = overcharge > 0 ? fmt("ÜBERLADUNG  %ds", (int)std::ceil(overcharge)) : "";

    scoreLabel->text = formatScore(score);
    if (combo > 1) {
        comboLabel->text = fmt("KOMBO ×%d", combo);
        comboBar->node->hidden = false;
        comboBar->set(comboT);
    } else {
        comboLabel->text = "";
        comboBar->node->hidden = true;
    }
    waveLabel->text = fmt("WELLE %d", wave);
    enemiesLabel->text = enemiesLeft > 0 ? fmt("GEGNER  %d", enemiesLeft) : "";
    if (bossName) {
        bossNode->hidden = false;
        bossLabel->text = *bossName;
        bossBar->set(bossHp);
    } else {
        bossNode->hidden = true;
    }
    vignetteAlpha = std::max(0.f, vignetteAlpha - dt * 1.4f);
    vignette->alpha = vignetteAlpha;
    for (size_t i = 0; i < dmgArcs.size(); i++) {
        if (dmgLife[i] <= 0) continue;
        dmgLife[i] -= dt;
        dmgArcs[i]->alpha = std::max(0.f, std::min(1.f, dmgLife[i] * 1.6f));
    }
}

void HUD::setAbility(const std::string& name, float charge, const std::string& status, V3 c) {
    UIColor ac = UIColor::of(c);
    bool ready = charge >= 1;
    abilityName->text = name;
    abilityStatus->text = status;
    abilityStatus->fontColor = ready ? ac : cDim;
    abilityBar->setColor(ac);
    abilityBar->set(charge);
    abilityKey->strokeColor = ready ? ac : cDim.withAlpha(0.4f);
    abilityKey->fillColor = ready ? ac.withAlpha(0.3f + 0.15f * std::sin(time * 5)) : UIColor(0, 0, 0, 0.45f);
    abilityNode->alpha = ready ? 1 : 0.8f;
}

void HUD::setEvent(const std::string* text, V3 c) {
    eventLabel->text = text ? *text : "";
    eventLabel->fontColor = UIColor::of(c);
    if (text) eventLabel->alpha = 0.75f + 0.25f * std::sin(time * 4);
}

std::string HUD::formatScore(int v) {
    std::string d = std::to_string(std::abs(v)), out;
    int n = 0;
    for (int i = (int)d.size() - 1; i >= 0; i--) {
        out.insert(out.begin(), d[i]);
        if (++n % 3 == 0 && i > 0) out.insert(out.begin(), '.');
    }
    return v < 0 ? "-" + out : out;
}

void HUD::setRadar(const std::vector<std::pair<V2, bool>>& pts, float range) {
    for (size_t i = 0; i < blips.size(); i++) {
        auto& b = blips[i];
        if (i < pts.size()) {
            V2 p = pts[i].first / range;
            float l = simd_length(p);
            if (l > 1) p /= l;
            b->position = V2(p.x * (radarR - 5), p.y * (radarR - 5));
            b->hidden = false;
            b->setScale(pts[i].second ? 2.0f : (l > 1 ? 0.7f : 1));
            b->alpha = l > 1 ? 0.55f : 1;
        } else {
            b->hidden = true;
        }
    }
}

// MARK: events

void HUD::hit(bool kill, bool crit) {
    hitMarker->removeAllActions();
    UIColor c = kill ? cRed : (crit ? cOrange : UIColor::white());
    for (auto& l : hitLines) l->fillColor = c;
    hitMarker->alpha = 1;
    hitMarker->setScale(kill ? 1.5f : 1.0f);
    hitMarker->run(SKA::group({SKA::fadeOut(kill ? 0.4f : 0.18f), SKA::scaleTo(1.0f, 0.15f)}));
}

void HUD::damage(float amount, const float* angle) {
    vignetteAlpha = std::min(0.9f, vignetteAlpha + 0.25f + amount / 40);
    if (angle) {
        size_t idx = 0;
        for (size_t i = 0; i < dmgLife.size(); i++) if (dmgLife[i] < dmgLife[idx]) idx = i;
        dmgLife[idx] = 1.1f;
        dmgAngles[idx] = *angle;
        dmgArcs[idx]->zRotation = -*angle;
    }
}

void HUD::flash(UIColor c, float alpha, float dur) {
    flashNode->removeAllActions();
    flashNode->color = c.withAlpha(1);
    flashNode->alpha = alpha;
    flashNode->run(SKA::fadeOut(dur));
}

void HUD::announce(const std::string& text, const std::string& sub, UIColor color, float hold) {
    std::pair<std::shared_ptr<SKLabel>, std::string> items[2] = {{announceL, text}, {announceSub, sub}};
    for (auto& [l, t] : items) {
        l->removeAllActions();
        l->text = t;
        l->alpha = 0;
        l->run(SKA::sequence({SKA::fadeIn(0.15f), SKA::wait(hold), SKA::fadeOut(0.5f)}));
    }
    announceL->fontColor = color;
    announceL->xScale = s * 1.25f;
    announceL->run(SKA::scaleXTo(s, 0.25f));
}

void HUD::feedLine(const std::string& text, const UIColor* c) {
    for (size_t i = feed.size() - 1; i > 0; i--) {
        feed[i]->text = feed[i - 1]->text;
        feed[i]->fontColor = feed[i - 1]->fontColor;
        feed[i]->alpha = feed[i - 1]->alpha;
        feed[i]->removeAllActions();
        feed[i]->run(SKA::fadeOut(feed[i]->alpha * 1.8f));
    }
    feed[0]->removeAllActions();
    feed[0]->text = text;
    feed[0]->fontColor = c ? *c : cDim;
    feed[0]->alpha = 1;
    feed[0]->run(SKA::sequence({SKA::wait(1.6f), SKA::fadeOut(0.8f)}));
}

// MARK: menus

void HUD::clearMenu() {
    menuNode->removeAllChildren();
    menuNode->removeAllActions();
}

void HUD::title(const std::string& text, float y, float size, UIColor c) {
    auto ghost = label(text, fontHeavy, size, cCyan.withAlpha(0.55f));
    ghost->position = V2(4, y - 3);
    auto ghost2 = label(text, fontHeavy, size, UIColor(1, 0.2f, 0.6f, 0.5f));
    ghost2->position = V2(-4, y + 2);
    auto main = label(text, fontHeavy, size, c);
    main->position = V2(0, y);
    menuNode->addChild(ghost2); menuNode->addChild(ghost); menuNode->addChild(main);
}

void HUD::prompt(const std::string& text, float y) {
    auto p = label(text, fontHeavy, 28, cCyan);
    p->position = V2(0, y);
    p->run(SKA::repeatForever(SKA::sequence({SKA::fadeAlpha(0.35f, 0.7f), SKA::fadeAlpha(1, 0.7f)})));
    menuNode->addChild(p);
}

void HUD::controls(float y) {
    std::pair<const char*, const char*> rows[] = {
        {"W A S D", "Bewegen"}, {"MAUS", "Zielen"}, {"LINKSKLICK", "Feuern"}, {"LEERTASTE", "Springen"}, {"SHIFT", "Sprinten"}, {"Q", "Dash"},
        {"E", "Fähigkeit"}, {"R", "Nachladen"}, {"1 – 4 / RAD", "Waffe wechseln"}, {"ESC", "Pause"}, {"F", "Vollbild"}, {"M", "Musik an/aus"},
    };
    int i = 0;
    for (auto& r : rows) {
        int col = i < 6 ? 0 : 1;
        int row = i < 6 ? i : i - 6;
        float x = col == 0 ? -270.f : 50.f;
        auto k = label(r.first, fontHeavy, 17, cCyan, HAlign::Left);
        k->position = V2(x, y - row * 26.f);
        auto d = label(r.second, fontDemi, 17, UIColor::white(1, 0.85f), HAlign::Left);
        d->position = V2(x + (col == 0 ? 130 : 120), y - row * 26.f);
        menuNode->addChild(k); menuNode->addChild(d);
        i++;
    }
}

std::optional<MenuHit> HUD::menuHit(V2 p) {
    for (SKNode* n : scene->nodesAt(p)) {
        for (SKNode* c = n; c; c = c->parent) {
            const std::string& name = c->name;
            if (name.empty()) continue;
            if (name == "start") return MenuHit{MenuHitKind::start};
            if (name == "labor") return MenuHit{MenuHitKind::labor};
            if (name == "back") return MenuHit{MenuHitKind::back};
            auto num = [&](const char* prefix, MenuHitKind k) -> std::optional<MenuHit> {
                size_t l = strlen(prefix);
                if (name.compare(0, l, prefix) == 0) return MenuHit{k, atoi(name.c_str() + l)};
                return std::nullopt;
            };
            if (auto h = num("map:", MenuHitKind::map)) return h;
            if (auto h = num("perk:", MenuHitKind::perk)) return h;
            if (auto h = num("ability:", MenuHitKind::ability)) return h;
            if (auto h = num("research:", MenuHitKind::research)) return h;
        }
    }
    return std::nullopt;
}

void HUD::showMenu(const std::vector<MapEntry>& maps, int selected, int cores, const std::string& ability) {
    clearMenu();
    menuNode->alpha = 1;
    dim->alpha = 0.45f;
    gameLayer->alpha = 0;
    title("NOVA BREACH", 250, 130);
    auto sub = label("A R E N A - P R O T O K O L L   //   W Ä H L E   D E I N E   M A P", fontDemi, 20, cCyan);
    sub->position = V2(0, 212);
    menuNode->addChild(sub);
    auto line = SKShape::rect(V2(760, 2));
    line->fillColor = cCyan; line->strokeColor = UIColor::clear(); line->position = V2(0, 196);
    menuNode->addChild(line);

    float cw = 360, ch = 190, spacing = 400;
    float x0 = -spacing * (maps.size() - 1) / 2;
    for (size_t i = 0; i < maps.size(); i++) {
        const MapEntry& m = maps[i];
        bool sel = (int)i == selected;
        UIColor ac = UIColor::of(mapAccent(m.id));
        auto card = SKShape::rect(V2(cw, ch), 10);
        card->name = fmt("map:%d", (int)m.id);
        card->position = V2(x0 + i * spacing, 70);
        card->fillColor = sel ? ac.withAlpha(0.14f) : UIColor(0, 0, 0, 0.5f);
        card->strokeColor = sel ? ac : ac.withAlpha(0.35f);
        card->lineWidth = sel ? 3 : 1.5f;
        card->glowWidth = sel ? 4 : 0;
        card->setScale(sel ? 1.04f : 0.96f);
        card->alpha = sel ? 1 : 0.82f;
        auto num = label(std::to_string((int)m.id + 1), fontMono, 14, cDim, HAlign::Left);
        num->position = V2(-cw / 2 + 18, ch / 2 - 30);
        card->addChild(num);
        if (sel) {
            auto tag = label("AUSGEWÄHLT", fontDemi, 14, ac, HAlign::Right);
            tag->position = V2(cw / 2 - 18, ch / 2 - 30);
            card->addChild(tag);
        }
        auto name = label(mapName(m.id), fontHeavy, 34, sel ? UIColor::white() : UIColor::white(1, 0.75f), HAlign::Left);
        name->position = V2(-cw / 2 + 18, ch / 2 - 72);
        card->addChild(name);
        auto tln = label(mapTagline(m.id), fontDemi, 15, UIColor::white(1, 0.72f), HAlign::Left, VAlign::Top);
        tln->numberOfLines = 0;
        tln->preferredMaxLayoutWidth = cw - 36;
        tln->position = V2(-cw / 2 + 18, ch / 2 - 86);
        card->addChild(tln);
        std::string rec = m.best > 0 ? "REKORD   " + formatScore(m.best) + "   ·   WELLE " + std::to_string(m.wave) : "NOCH KEIN REKORD";
        auto r = label(rec, fontHeavy, 17, m.best > 0 ? cOrange : cDim, HAlign::Left);
        r->position = V2(-cw / 2 + 18, -ch / 2 + 22);
        card->addChild(r);
        auto bar = SKShape::rect(V2(cw - 20, 4), 2);
        bar->fillColor = sel ? ac : ac.withAlpha(0.3f); bar->strokeColor = UIColor::clear();
        bar->position = V2(0, -ch / 2 + 8);
        card->addChild(bar);
        menuNode->addChild(card);
    }

    UIColor ac = UIColor::of(selected >= 0 && selected < (int)maps.size() ? mapAccent(maps[selected].id) : V3(0.35f, 0.92f, 1.0f));
    auto btn = SKShape::rect(V2(300, 56), 8);
    btn->name = "start";
    btn->position = V2(-135, -80);
    btn->fillColor = ac.withAlpha(0.88f); btn->strokeColor = UIColor::white(); btn->lineWidth = 1.5f;
    btn->glowWidth = 3;
    btn->addChild(label("STARTEN", fontHeavy, 30, cInk, HAlign::Center, VAlign::Center));
    btn->run(SKA::repeatForever(SKA::sequence({SKA::fadeAlpha(0.8f, 0.8f), SKA::fadeAlpha(1, 0.8f)})));
    menuNode->addChild(btn);
    // Labor: spend cores, pick the ability
    UIColor gold = UIColor::of(Meta::coreColor);
    auto lab = SKShape::rect(V2(250, 56), 8);
    lab->name = "labor";
    lab->position = V2(155, -80);
    lab->fillColor = UIColor(0, 0, 0, 0.55f); lab->strokeColor = gold; lab->lineWidth = 2;
    auto ll = label("LABOR", fontHeavy, 26, UIColor::white(), HAlign::Left, VAlign::Center);
    ll->position = V2(-108, 7);
    auto lc = label("◆ " + std::to_string(cores), fontHeavy, 22, gold, HAlign::Right, VAlign::Center);
    lc->position = V2(108, 7);
    auto la = label("[E]  " + ability, fontDemi, 13, cDim, HAlign::Left, VAlign::Center);
    la->position = V2(-108, -15);
    lab->addChild(ll); lab->addChild(lc); lab->addChild(la);
    menuNode->addChild(lab);
    auto hint = label("← →  oder  1 / 2:  Map wählen    ·    Enter:  Starten    ·    L:  Labor", fontDemi, 17, cDim);
    hint->position = V2(0, -134);
    menuNode->addChild(hint);
    controls(-180);
    auto foot = label("Überlebe so viele Wellen wie möglich. Nach jeder Welle wählst du ein Upgrade, alle 5 Wellen wartet ein Boss.", fontDemi, 17,
                      UIColor::white(1, 0.6f));
    foot->position = V2(0, -360);
    menuNode->addChild(foot);
}

std::shared_ptr<SKShape> HUD::keyCap(const std::string& text, UIColor c, float size) {
    auto kb = SKShape::rect(V2(size, size), 6);
    kb->fillColor = c; kb->strokeColor = UIColor::clear();
    kb->addChild(label(text, fontHeavy, size * 0.62f, cInk, HAlign::Center, VAlign::Center));
    return kb;
}

std::shared_ptr<SKLabel> HUD::paragraph(const std::string& text, float size, float width, UIColor c) {
    auto l = label(text, fontDemi, size, c, HAlign::Left, VAlign::Top);
    l->numberOfLines = 0;
    l->preferredMaxLayoutWidth = width;
    return l;
}

/// upgrade choice after a cleared wave: three cards, keys 1–3 or click
void HUD::showPerks(const std::vector<PerkCard>& cards, int wave, int cores, const std::string& nextText, V3 nextColor) {
    clearMenu();
    menuNode->alpha = 1;
    dim->removeAllActions();
    dim->alpha = 0.6f;
    title("UPGRADE WÄHLEN", 250, 86);
    auto sub = label(fmt("WELLE %d GESCHAFFT    ·    ◆ %d KERNE", wave, cores), fontDemi, 22, cCyan);
    sub->position = V2(0, 206);
    menuNode->addChild(sub);

    float cw = 340, ch = 310, spacing = 375;
    for (size_t i = 0; i < cards.size(); i++) {
        const PerkCard& c = cards[i];
        UIColor ac = UIColor::of(c.color);
        auto card = SKShape::rect(V2(cw, ch), 12);
        card->name = fmt("perk:%d", (int)i);
        card->position = V2((i - (cards.size() - 1) / 2.f) * spacing, 20);
        card->fillColor = UIColor(0.01f, 0.03f, 0.06f, 0.82f);
        card->strokeColor = ac; card->lineWidth = 2.5f; card->glowWidth = 3;
        auto kb = keyCap(std::to_string(i + 1), ac);
        kb->position = V2(-cw / 2 + 32, ch / 2 - 32);
        card->addChild(kb);
        auto tag = label(c.tag, fontDemi, 15, ac, HAlign::Right, VAlign::Center);
        tag->position = V2(cw / 2 - 18, ch / 2 - 32);
        card->addChild(tag);
        auto name = label(c.name, fontHeavy, 25, UIColor::white(), HAlign::Left);
        name->position = V2(-cw / 2 + 18, ch / 2 - 92);
        card->addChild(name);
        auto line = SKShape::rect(V2(cw - 36, 2));
        line->fillColor = ac.withAlpha(0.6f); line->strokeColor = UIColor::clear();
        line->position = V2(0, ch / 2 - 106);
        card->addChild(line);
        auto d = paragraph(c.desc, 18, cw - 36);
        d->position = V2(-cw / 2 + 18, ch / 2 - 120);
        card->addChild(d);
        // level pips: owned, the new one, still open
        if (c.maxLevel > 1) {
            float pw = 26;
            for (int k = 0; k < c.maxLevel; k++) {
                auto pip = SKShape::rect(V2(pw, 8), 2);
                pip->position = V2(-cw / 2 + 18 + pw / 2 + k * (pw + 6), -ch / 2 + 54);
                pip->strokeColor = ac.withAlpha(0.6f); pip->lineWidth = 1;
                pip->fillColor = k < c.level ? ac.withAlpha(0.55f) : (k == c.level ? UIColor::white() : UIColor::clear());
                card->addChild(pip);
            }
        }
        std::string lv = c.level == 0 ? "NEU" : fmt("STUFE %d → %d", c.level, c.level + 1);
        auto st = label(c.maxLevel > 1 ? fmt("%s   ·   MAX %d", lv.c_str(), c.maxLevel) : lv, fontHeavy, 16, c.level == 0 ? cOrange : cDim, HAlign::Left);
        st->position = V2(-cw / 2 + 18, -ch / 2 + 22);
        card->addChild(st);
        card->alpha = 0;
        card->setScale(0.92f);
        card->run(SKA::sequence({SKA::wait(0.08f * i), SKA::group({SKA::fadeIn(0.2f), SKA::scaleTo(1, 0.2f)})}));
        menuNode->addChild(card);
    }
    auto hint = label("TASTE 1 / 2 / 3  ODER  KLICKEN", fontHeavy, 20, cCyan);
    hint->position = V2(0, -168);
    hint->run(SKA::repeatForever(SKA::sequence({SKA::fadeAlpha(0.45f, 0.7f), SKA::fadeAlpha(1, 0.7f)})));
    menuNode->addChild(hint);
    auto nx = label(nextText, fontHeavy, 19, UIColor::of(nextColor));
    nx->position = V2(0, -212);
    menuNode->addChild(nx);
    auto note = label("Upgrades gelten bis zum Systemausfall. Kerne bleiben – im LABOR schaltest du damit neue Perks und Fähigkeiten frei.", fontDemi, 16,
                      UIColor::white(1, 0.55f));
    note->position = V2(0, -246);
    menuNode->addChild(note);
}

/// Labor: buy and equip abilities, research perks for the upgrade pool
void HUD::showLabor(int cores, const std::vector<LaborItem>& abilities, const std::vector<LaborItem>& research) {
    clearMenu();
    menuNode->alpha = 1;
    dim->alpha = 0.7f;
    gameLayer->alpha = 0;
    UIColor gold = UIColor::of(Meta::coreColor);
    title("LABOR", 318, 96);
    auto sub = label(fmt("◆ %d KERNE    ·    Kerne gibt es für jede Welle, für Bosse und für überstandene Wellen-Ereignisse", cores), fontDemi, 19, gold);
    sub->position = V2(0, 272);
    menuNode->addChild(sub);

    auto section = [&](const std::string& text, const std::string& hint, float y) {
        auto t = label(text, fontHeavy, 22, UIColor::white(), HAlign::Left);
        t->position = V2(-615, y);
        auto h = label(hint, fontDemi, 16, cDim, HAlign::Left);
        h->position = V2(-615 + textWidth(fontHeavy, 22, text) + 24, y);
        menuNode->addChild(t); menuNode->addChild(h);
    };
    auto status = [&](const LaborItem& it, const std::string& ownedText) -> std::pair<std::string, UIColor> {
        if (it.equipped) return {"AUSGERÜSTET", UIColor::of(it.color)};
        if (it.owned) return {ownedText, cDim};
        return {fmt("◆ %d   FREISCHALTEN", it.cost), it.affordable ? gold : cRed.withAlpha(0.8f)};
    };

    section("FÄHIGKEIT  [E]", "eine ist ausgerüstet – klicken zum Freischalten oder Wechseln", 236);
    float aw = 292, ah = 160, aSpacing = 308;
    for (size_t i = 0; i < abilities.size(); i++) {
        const LaborItem& it = abilities[i];
        UIColor ac = UIColor::of(it.color);
        auto card = SKShape::rect(V2(aw, ah), 10);
        card->name = fmt("ability:%d", (int)i);
        card->position = V2((i - (abilities.size() - 1) / 2.f) * aSpacing, 140);
        card->fillColor = it.equipped ? ac.withAlpha(0.16f) : UIColor(0, 0, 0, 0.55f);
        card->strokeColor = it.owned ? ac : ac.withAlpha(0.35f);
        card->lineWidth = it.equipped ? 3 : 1.5f;
        card->glowWidth = it.equipped ? 4 : 0;
        auto n = label(it.name, fontHeavy, 22, it.owned ? UIColor::white() : UIColor::white(1, 0.7f), HAlign::Left);
        n->position = V2(-aw / 2 + 16, ah / 2 - 34);
        card->addChild(n);
        // cooldown bottom right (the top row is the name's, whatever the font width)
        auto cd = label(it.tag, fontDemi, 12, cDim, HAlign::Right);
        cd->position = V2(aw / 2 - 14, -ah / 2 + 16);
        card->addChild(cd);
        auto d = paragraph(it.desc, 15, aw - 32);
        d->position = V2(-aw / 2 + 16, ah / 2 - 48);
        card->addChild(d);
        auto [stText, stColor] = status(it, "KLICKEN ZUM AUSRÜSTEN");
        auto st = label(stText, fontHeavy, 15, stColor, HAlign::Left);
        st->position = V2(-aw / 2 + 16, -ah / 2 + 16);
        card->addChild(st);
        menuNode->addChild(card);
    }

    section("PERK-FORSCHUNG", "freigeschaltete Perks tauchen danach in der Upgrade-Wahl nach jeder Welle auf", 22);
    float rw = 400, rh = 108, rxSpacing = 415, rySpacing = 120;
    for (size_t i = 0; i < research.size(); i++) {
        const LaborItem& it = research[i];
        UIColor ac = UIColor::of(it.color);
        int col = (int)i % 3, row = (int)i / 3;
        auto card = SKShape::rect(V2(rw, rh), 10);
        card->name = fmt("research:%d", (int)i);
        card->position = V2((col - 1) * rxSpacing, -50 - row * rySpacing);
        card->fillColor = it.owned ? ac.withAlpha(0.12f) : UIColor(0, 0, 0, 0.55f);
        card->strokeColor = it.owned ? ac : ac.withAlpha(0.35f);
        card->lineWidth = it.owned ? 2 : 1.5f;
        auto n = label(it.name, fontHeavy, 20, it.owned ? UIColor::white() : UIColor::white(1, 0.75f), HAlign::Left);
        n->position = V2(-rw / 2 + 16, rh / 2 - 28);
        card->addChild(n);
        auto tg = label(it.tag, fontDemi, 12, ac, HAlign::Right);
        tg->position = V2(rw / 2 - 14, rh / 2 - 26);
        card->addChild(tg);
        auto d = paragraph(it.desc, 14, rw - 32);
        d->position = V2(-rw / 2 + 16, rh / 2 - 40);
        card->addChild(d);
        auto [stText, stColor] = it.owned ? std::pair<std::string, UIColor>{"ERFORSCHT", ac} : status(it, "");
        auto st = label(stText, fontHeavy, 14, stColor, HAlign::Right);
        st->position = V2(rw / 2 - 14, -rh / 2 + 12);
        card->addChild(st);
        menuNode->addChild(card);
    }

    auto back = SKShape::rect(V2(240, 48), 8);
    back->name = "back";
    back->position = V2(0, -330);
    back->fillColor = cCyan.withAlpha(0.85f); back->strokeColor = UIColor::white(); back->lineWidth = 1.5f;
    back->addChild(label("ZURÜCK", fontHeavy, 26, cInk, HAlign::Center, VAlign::Center));
    menuNode->addChild(back);
    auto hint = label("Klick: freischalten / ausrüsten    ·    ESC oder L: zurück", fontDemi, 16, cDim);
    hint->position = V2(0, -378);
    menuNode->addChild(hint);
}

void HUD::showPause() {
    clearMenu();
    dim->alpha = 0.6f;
    title("PAUSE", 120, 120);
    prompt("KLICKEN ODER ESC ZUM FORTSETZEN", 40);
    controls(-30);
    auto back = label("Q  –  ZURÜCK ZUM HAUPTMENÜ", fontHeavy, 19, cCyan);
    back->position = V2(0, -205);
    menuNode->addChild(back);
    auto q = label("Alt+F4  –  Spiel beenden", fontDemi, 17, UIColor::white(1, 0.6f));
    q->position = V2(0, -236);
    menuNode->addChild(q);
}

void HUD::showGameOver(const GameOverStats& st) {
    clearMenu();
    gameLayer->alpha = 0;
    dim->alpha = 0;
    dim->run(SKA::fadeAlpha(0.62f, 0.8f));
    title("SYSTEMAUSFALL", 170, 120, cRed);
    std::pair<std::string, std::string> rows[] = {
        {"PUNKTE", formatScore(st.score)}, {"ERREICHTE WELLE", std::to_string(st.wave)}, {"ABSCHÜSSE", std::to_string(st.kills)},
        {"TREFFERQUOTE", fmt("%d %%", st.accuracy)}, {"ÜBERLEBT", fmt("%d:%02d", st.time / 60, st.time % 60)},
        {"UPGRADES", std::to_string(st.perks)}, {"KERNE", fmt("+%d   (◆ %d)", st.cores, st.totalCores)},
    };
    int n = 7;
    for (int i = 0; i < n; i++) {
        auto k = label(rows[i].first, fontDemi, 21, cDim, HAlign::Right);
        k->position = V2(-20, 92 - i * 30.f);
        auto v = label(rows[i].second, fontHeavy, 25, i == n - 1 ? UIColor::of(Meta::coreColor) : UIColor::white(), HAlign::Left);
        v->position = V2(20, 90 - i * 30.f);
        menuNode->addChild(k); menuNode->addChild(v);
    }
    auto b = label(st.newBest ? "NEUER REKORD!" : "REKORD   " + formatScore(st.best), fontHeavy, 26, cOrange);
    b->position = V2(0, -146);
    menuNode->addChild(b);
    prompt("KLICKEN ODER ENTER FÜR NEUEN VERSUCH", -200);
    auto back = label("Q  –  HAUPTMENÜ  ·  dort kannst du im LABOR Kerne ausgeben", fontHeavy, 19, cDim);
    back->position = V2(0, -238);
    menuNode->addChild(back);
    if (!st.mapName.empty()) {
        auto mn = label(st.mapName, fontDemi, 20, cDim);
        mn->position = V2(0, 128);
        menuNode->addChild(mn);
    }
    menuNode->alpha = 0;
    menuNode->run(SKA::sequence({SKA::wait(0.5f), SKA::fadeIn(0.5f)}));
}

void HUD::showGame() {
    clearMenu();
    menuNode->alpha = 1;
    dim->removeAllActions();
    dim->alpha = 0;
    gameLayer->alpha = 1;
}

void HUD::resetTransient() {
    vignetteAlpha = 0;
    vignette->alpha = 0; lowHp->alpha = 0;
    for (size_t i = 0; i < dmgArcs.size(); i++) { dmgLife[i] = 0; dmgArcs[i]->alpha = 0; }
    for (auto& f : feed) { f->removeAllActions(); f->alpha = 0; }
    announceL->removeAllActions(); announceL->alpha = 0;
    announceSub->removeAllActions(); announceSub->alpha = 0;
}
