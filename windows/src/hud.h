// HUD and menus (port of HUD.swift).
#pragma once
#include "ui.h"
#include "level.h"
#include "perks.h"

struct GameOverStats {
    int score = 0, wave = 0, kills = 0, accuracy = 0, best = 0;
    bool newBest = false;
    int time = 0;
    std::string mapName;
    /// cores earned this run, cores in the bank, upgrades taken
    int cores = 0, totalCores = 0, perks = 0;
};

struct MapEntry { MapID id; int best, wave; };

enum class MenuHitKind { map, start, labor, back, perk, ability, research };
struct MenuHit { MenuHitKind kind; int index = 0; };

struct Bar;
struct HUD {
    std::shared_ptr<SKScene> scene = std::make_shared<SKScene>();

    explicit HUD(V2 size);
    void resizeIfNeeded(V2 size);
    void update(float dt, float hp, float hpMax, float shield, float shieldMax, int ammo, int reserve, const std::string& weaponName, int weaponIndex,
                const std::vector<std::string>& weaponNames, const std::vector<bool>& weaponUsable, V3 weaponColor, float spread, float reloading,
                float dash, float overcharge, int score, int combo, float comboT, int wave, int enemiesLeft, const std::string* bossName, float bossHp);
    void setAbility(const std::string& name, float charge, const std::string& status, V3 color);
    void setEvent(const std::string* text, V3 color);
    static std::string formatScore(int v);
    /// enemies: (relative position rotated into view space, isBoss)
    void setRadar(const std::vector<std::pair<V2, bool>>& pts, float range);
    void hit(bool kill, bool crit);
    /// angle: direction of the attacker relative to where the player looks (0 = front, + = right); nullptr = none
    void damage(float amount, const float* angle);
    void flash(UIColor c, float alpha, float dur);
    void announce(const std::string& text, const std::string& sub = "", UIColor color = UIColor::white(), float hold = 1.6f);
    void feedLine(const std::string& text, const UIColor* c = nullptr);
    void feedLine(const std::string& text, UIColor c) { feedLine(text, &c); }
    /// what the menu has under a click (view coordinates, origin bottom-left)
    std::optional<MenuHit> menuHit(V2 p);
    void showMenu(const std::vector<MapEntry>& maps, int selected, int cores, const std::string& ability);
    void showPerks(const std::vector<PerkCard>& cards, int wave, int cores, const std::string& nextText, V3 nextColor);
    void showLabor(int cores, const std::vector<LaborItem>& abilities, const std::vector<LaborItem>& research);
    void showPause();
    void showGameOver(const GameOverStats& st);
    void showGame();
    void resetTransient();

private:
    V2 laidOut;
    float s = 1;
    SKRef center = SKNode::make(), bl = SKNode::make(), br = SKNode::make(), tl = SKNode::make(), tr = SKNode::make(), tc = SKNode::make();
    SKRef gameLayer = SKNode::make(), overlay = SKNode::make(), menuNode = SKNode::make();
    std::vector<std::shared_ptr<SKShape>> crossLines, hitLines;
    SKRef hitMarker = SKNode::make();
    std::shared_ptr<Bar> dashBar, hpBar, shBar, comboBar, bossBar, abilityBar;
    std::shared_ptr<SKLabel> reloadLabel, powerLabel, hpLabel, shLabel, ammoLabel, reserveLabel, weaponLabel, waveLabel, enemiesLabel, scoreLabel,
        comboLabel, bossLabel, eventLabel, abilityName, abilityStatus, announceL, announceSub;
    struct Slot { std::shared_ptr<SKShape> box; std::shared_ptr<SKLabel> key, name; };
    std::vector<Slot> slots;
    SKRef bossNode = SKNode::make(), abilityNode = SKNode::make();
    std::shared_ptr<SKShape> abilityKey;
    SKRef radar = SKNode::make();
    std::vector<std::shared_ptr<SKShape>> blips;
    const float radarR = 78;
    std::vector<std::shared_ptr<SKLabel>> feed;
    std::shared_ptr<SKSprite> vignette, lowHp, flashNode, dim;
    std::vector<std::shared_ptr<SKShape>> dmgArcs;
    std::vector<float> dmgAngles, dmgLife;
    float vignetteAlpha = 0, time = 0;

    void build();
    void layout(V2 size);
    void clearMenu();
    void title(const std::string& text, float y, float size, UIColor c = UIColor::white());
    void prompt(const std::string& text, float y);
    void controls(float y);
    std::shared_ptr<SKShape> keyCap(const std::string& text, UIColor c, float size = 34);
    std::shared_ptr<SKLabel> paragraph(const std::string& text, float size, float width, UIColor c = UIColor::white(1, 0.8f));
};
