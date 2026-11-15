import Foundation
import simd

// Upgrades chosen after each wave (reset every run), the active ability on E, wave events
// and the persistent progression (cores + Labor unlocks).

// MARK: - perks

enum PerkCategory { case stat, mod, ability }

enum PerkID: String, CaseIterable {
    // stat upgrades
    case damage, magazine, reload, vital, shield, speed, dash, ammo, fireRate, secondWind
    // weapon mods (two per weapon)
    case pulseRicochet, pulseTwin, scatterBurn, scatterBounce, railNova, railChain, plasmaHeavy, plasmaSplit
    // upgrades for the equipped ability
    case abilityCooldown, abilityPower

    var category: PerkCategory {
        switch self {
        case .damage, .magazine, .reload, .vital, .shield, .speed, .dash, .ammo, .fireRate, .secondWind: return .stat
        case .abilityCooldown, .abilityPower: return .ability
        default: return .mod
        }
    }

    var name: String {
        switch self {
        case .damage: return "FEUERKRAFT"
        case .magazine: return "ERWEITERTE MAGAZINE"
        case .reload: return "SCHNELLLADER"
        case .vital: return "PANZERPLATTEN"
        case .shield: return "SCHILDMATRIX"
        case .speed: return "SERVOMOTOREN"
        case .dash: return "DASH-SPULEN"
        case .ammo: return "MUNITIONSGURT"
        case .fireRate: return "ÜBERTAKTUNG"
        case .secondWind: return "NOTFALLPROTOKOLL"
        case .pulseRicochet: return "PULS: QUERSCHLÄGER"
        case .pulseTwin: return "PULS: ZWILLINGSLAUF"
        case .scatterBurn: return "STREU: BRANDMUNITION"
        case .scatterBounce: return "STREU: ABPRALLER"
        case .railNova: return "RAIL: ENTLADUNG"
        case .railChain: return "RAIL: KETTENBLITZ"
        case .plasmaHeavy: return "PLASMA: SCHWERKERN"
        case .plasmaSplit: return "PLASMA: STREUBOMBE"
        case .abilityCooldown: return "SCHNELLLADUNG"
        case .abilityPower: return "VERSTÄRKUNG"
        }
    }

    /// What one level does. The ability perks describe the equipped ability.
    func desc(_ ability: AbilityID) -> String {
        switch self {
        case .damage: return "+12 % Schaden mit allen Waffen und der Fähigkeit."
        case .magazine: return "+25 % Magazingröße. Alle Magazine sofort voll."
        case .reload: return "−20 % Nachladezeit."
        case .vital: return "+25 maximales Vital, heilt sofort 25."
        case .shield: return "+25 maximaler Schild, lädt 25 % schneller."
        case .speed: return "+8 % Lauf- und Sprinttempo."
        case .dash: return "−25 % Dash-Abklingzeit."
        case .ammo: return "+50 % Reservemunition, sofort aufgefüllt."
        case .fireRate: return "+10 % Feuerrate mit allen Waffen."
        case .secondWind: return "Einmal pro Run: statt Systemausfall mit 50 Vital weiter, Schockwelle wirft Gegner zurück."
        case .pulseRicochet: return "Jeder Treffer springt auf einen zweiten Gegner in der Nähe über (50 % Schaden)."
        case .pulseTwin: return "Zwei Strahlen pro Schuss (je 70 % Schaden), gleicher Munitionsverbrauch."
        case .scatterBurn: return "Getroffene Gegner brennen 3 Sekunden lang (14 Schaden/s)."
        case .scatterBounce: return "Kugeln, die eine Wand treffen, prallen zum nächsten Gegner ab."
        case .railNova: return "Der Strahl explodiert am Einschlagpunkt (90 Schaden, 4,5 m)."
        case .railChain: return "Jeder getroffene Gegner schlägt Blitze auf bis zu 3 Gegner in der Nähe (40 %)."
        case .plasmaHeavy: return "+50 % Explosionsradius, kein Eigenschaden mehr."
        case .plasmaSplit: return "Die Explosion verstreut 5 Splitterbomben (je 40 Schaden)."
        case .abilityCooldown: return "−25 % Abklingzeit von \(ability.name) [E]."
        case .abilityPower: return ability.powerDesc
        }
    }

    var maxLevel: Int {
        switch self {
        case .damage: return 5
        case .vital: return 4
        case .magazine, .reload, .shield, .speed, .fireRate: return 3
        case .dash, .ammo, .abilityCooldown, .abilityPower: return 2
        default: return 1
        }
    }

    /// Price in the Labor. 0 = in the pool from the start.
    var cost: Int {
        switch self {
        case .fireRate: return 30
        case .secondWind: return 45
        case .pulseTwin: return 35
        case .scatterBounce: return 30
        case .railChain: return 40
        case .plasmaSplit: return 35
        default: return 0
        }
    }

    /// Weapon slot a mod belongs to.
    var weapon: Int? {
        switch self {
        case .pulseRicochet, .pulseTwin: return 0
        case .scatterBurn, .scatterBounce: return 1
        case .railNova, .railChain: return 2
        case .plasmaHeavy, .plasmaSplit: return 3
        default: return nil
        }
    }

    var tag: String {
        switch category {
        case .stat: return "WERTE"
        case .mod: return "WAFFEN-MOD"
        case .ability: return "FÄHIGKEIT"
        }
    }

    func color(_ ability: AbilityID) -> V3 {
        if let w = weapon { return PerkID.weaponColors[w] }
        return category == .ability ? ability.color : V3(0.35, 0.92, 1.0)
    }

    /// Same colours as the weapon definitions (pulse, scatter, rail, plasma).
    static let weaponColors = [V3(0.25, 0.9, 1.0), V3(1.0, 0.55, 0.12), V3(0.72, 0.42, 1.0), V3(0.35, 1.0, 0.45)]
    /// Perks that have to be researched in the Labor first, in display order.
    static let research: [PerkID] = PerkID.allCases.filter { $0.cost > 0 }
}

// MARK: - active ability

enum AbilityID: String, CaseIterable {
    case grenade, turret, slowmo, barrier

    var name: String {
        switch self {
        case .grenade: return "SPLITTERGRANATE"
        case .turret: return "GESCHÜTZTURM"
        case .slowmo: return "ZEITLUPE"
        case .barrier: return "KRAFTFELD"
        }
    }

    var desc: String {
        switch self {
        case .grenade: return "Wurfgranate, explodiert beim Aufprall (150 Schaden, 6 m)."
        case .turret: return "Stellt 14 s lang einen Turm auf, der selbstständig feuert."
        case .slowmo: return "Gegner und ihre Geschosse 5 s lang auf 30 % Tempo."
        case .barrier: return "Kuppel für 6 s, die feindliche Geschosse auslöscht."
        }
    }

    var powerDesc: String {
        switch self {
        case .grenade: return "Granate: +40 % Schaden und Radius."
        case .turret: return "Turm: hält 50 % länger, feuert 30 % schneller."
        case .slowmo: return "Zeitlupe hält 50 % länger."
        case .barrier: return "Kraftfeld hält 50 % länger und wird 25 % größer."
        }
    }

    var cooldown: Float {
        switch self {
        case .grenade: return 7
        case .turret: return 24
        case .slowmo: return 22
        case .barrier: return 18
        }
    }

    /// Price in the Labor. 0 = available from the start.
    var cost: Int {
        switch self {
        case .grenade: return 0
        case .turret: return 40
        case .slowmo: return 50
        case .barrier: return 40
        }
    }

    var color: V3 {
        switch self {
        case .grenade: return V3(1.0, 0.75, 0.25)
        case .turret: return V3(0.4, 1.0, 0.7)
        case .slowmo: return V3(0.5, 0.62, 1.0)
        case .barrier: return V3(0.35, 0.92, 1.0)
        }
    }
}

// MARK: - wave events

enum WaveEvent: String, CaseIterable {
    case lowGravity, blackout, swarm, frenzy, coreRush, emp

    var name: String {
        switch self {
        case .lowGravity: return "NIEDRIGE SCHWERKRAFT"
        case .blackout: return "STROMAUSFALL"
        case .swarm: return "SCHWARM"
        case .frenzy: return "ADRENALIN"
        case .coreRush: return "KERNSTURM"
        case .emp: return "EMP-STURM"
        }
    }

    var desc: String {
        switch self {
        case .lowGravity: return "Höhere Sprünge, Geschosse fliegen weiter"
        case .blackout: return "Arena-Licht aus, Helmlampe an"
        case .swarm: return "Viel mehr kleine Gegner"
        case .frenzy: return "Gegner schneller und aggressiver, doppelte Punkte"
        case .coreRush: return "Gegner lassen Kerne fallen"
        case .emp: return "Dein Schild ist offline"
        }
    }

    /// Extra cores for surviving the wave (Kernsturm pays out through its drops instead).
    var bonusCores: Int {
        switch self {
        case .lowGravity, .frenzy: return 2
        case .blackout, .swarm: return 3
        case .coreRush: return 0
        case .emp: return 4
        }
    }

    var color: V3 {
        switch self {
        case .lowGravity: return V3(0.55, 0.8, 1.0)
        case .blackout: return V3(0.75, 0.8, 0.95)
        case .swarm: return V3(1.0, 0.45, 0.25)
        case .frenzy: return V3(1.0, 0.3, 0.3)
        case .coreRush: return Meta.coreColor
        case .emp: return V3(0.35, 0.92, 1.0)
        }
    }
}

// MARK: - persistent progression

/// Cores and Labor unlocks, kept in UserDefaults between runs.
final class Meta {
    static let coreColor = V3(1.0, 0.82, 0.25)

    private let d = UserDefaults.standard
    /// autotest / headless runs never write the player's progression
    var persist = true
    private(set) var cores: Int
    private(set) var unlocked: Set<String>
    private(set) var ability: AbilityID

    init() {
        cores = d.integer(forKey: "meta.cores")
        unlocked = Set(d.stringArray(forKey: "meta.unlocked") ?? [])
        ability = AbilityID(rawValue: d.string(forKey: "meta.ability") ?? "") ?? .grenade
        if !has(ability) { ability = .grenade }
    }

    func has(_ p: PerkID) -> Bool { p.cost == 0 || unlocked.contains("perk." + p.rawValue) }
    func has(_ a: AbilityID) -> Bool { a.cost == 0 || unlocked.contains("ability." + a.rawValue) }

    func earn(_ n: Int) {
        guard n > 0 else { return }
        cores += n
        save()
    }

    /// Spends cores on a perk. Returns false when it is owned already or too expensive.
    @discardableResult
    func buy(_ p: PerkID) -> Bool {
        guard !has(p), cores >= p.cost else { return false }
        cores -= p.cost
        unlocked.insert("perk." + p.rawValue)
        save()
        return true
    }

    @discardableResult
    func buy(_ a: AbilityID) -> Bool {
        guard !has(a), cores >= a.cost else { return false }
        cores -= a.cost
        unlocked.insert("ability." + a.rawValue)
        ability = a
        save()
        return true
    }

    func equip(_ a: AbilityID) {
        guard has(a) else { return }
        ability = a
        save()
    }

    /// Test hook (--ability): equips without owning it and without saving.
    func force(_ a: AbilityID) { ability = a }

    private func save() {
        guard persist else { return }
        d.set(cores, forKey: "meta.cores")
        d.set(unlocked.sorted(), forKey: "meta.unlocked")
        d.set(ability.rawValue, forKey: "meta.ability")
    }
}

// MARK: - what the HUD shows

struct PerkCard {
    let tag: String
    let name: String
    let desc: String
    /// level before taking it (0 = new)
    let level: Int
    let maxLevel: Int
    let color: V3
}

struct LaborItem {
    let tag: String
    let name: String
    let desc: String
    let cost: Int
    let owned: Bool
    let equipped: Bool
    let affordable: Bool
    let color: V3
}
