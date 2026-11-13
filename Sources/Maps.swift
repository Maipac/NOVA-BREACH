import Foundation
import simd

/// The playable maps. The raw value is stored in UserDefaults ("map") and shown as the menu number.
enum MapID: Int, CaseIterable {
    case helix, dock

    var name: String {
        switch self {
        case .helix: return "STATION HELIX-9"
        case .dock: return "ORBITAL-DOCK"
        }
    }

    var tagline: String {
        switch self {
        case .helix: return "Geschlossene Neon-Arena im Inneren der Station.\nSäulen, Container, Reaktorkern in der Mitte."
        case .dock: return "Offene Andockplattform unter dem Gasriesen.\nLandepads, Kräne, Kontrollturm auf erhöhter Plattform."
        }
    }

    /// Accent colour used for the menu card.
    var accent: V3 {
        switch self {
        case .helix: return V3(0.35, 0.92, 1.0)
        case .dock: return V3(1.0, 0.66, 0.2)
        }
    }

    // Helix keeps the original keys so existing records survive the update.
    var scoreKey: String { self == .helix ? "bestScore" : "bestScore.\(self)" }
    var waveKey: String { self == .helix ? "bestWave" : "bestWave.\(self)" }

    static func fromArg(_ s: String?) -> MapID? {
        guard let s = s?.lowercased() else { return nil }
        if let i = Int(s), let m = MapID(rawValue: i - 1) { return m }
        return MapID.allCases.first { "\($0)" == s }
    }
}
