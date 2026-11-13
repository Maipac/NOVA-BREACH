# NOVA BREACH

PvE-Arena-Shooter in 3D für Apple Silicon. Native Swift-App auf Apples SceneKit/Metal-Renderer,
alles (Texturen, Modelle, Skybox, Sounds, Musik) wird beim Start prozedural erzeugt – keine Asset-Dateien.

![Screenshot](docs/screenshot.png)

## Spielen

`dist/NovaBreach.dmg` öffnen, **NOVA BREACH** nach *Programme* ziehen, starten.

| Taste | Aktion |
|---|---|
| W A S D | Bewegen |
| Maus | Zielen |
| Linksklick | Feuern |
| Leertaste | Springen |
| Shift | Sprinten |
| Q | Dash (kurz unverwundbar) |
| R | Nachladen |
| 1–4 / Mausrad | Waffe wechseln |
| ESC | Pause |
| Q (in Pause / Game Over) | Zurück zum Hauptmenü |
| F | Vollbild an/aus |
| M | Musik an/aus |
| ⌘Q | Beenden |

Wellen-Survival: Gegner kommen durch die vier roten Portale, alle 5 Wellen ein Boss (Overseer). In Welle 15 wartet stattdessen der Endgegner: ein 8,5 m großer Hitler, der stampft (Schockwelle – springen!), Raketen aus den Händen und Laser aus den Augen schießt und Verstärkung ruft. Schwachpunkt ist der Kopf (nur Mac-Version).

![Hauptmenü](docs/screenshot-menu.png)

Im Hauptmenü wählst du die Map (Pfeiltasten ← →, Tasten 1/2 oder Klick auf eine Karte, dann STARTEN oder Enter). Jede Map hat ihren eigenen Rekord.

| Map | Beschreibung |
|---|---|
| Station Helix-9 | Geschlossene Neon-Arena im Inneren der Station: Säulen, Container, Reaktorkern in der Mitte |
| Orbital-Dock | Offene Andockplattform unter dem Gasriesen: erhöhte Plattform mit Kontrollturm, vier Landepads, Portalkräne mit hängenden Containern, Kraftfeld als Rand (nur Mac-Version) |

![Orbital-Dock](docs/screenshot-dock.png)
Schild lädt sich nach 4 Sekunden ohne Treffer wieder auf, Vital nur über grüne Pickups.
Kopf-/Kerntreffer machen doppelten Schaden. Rollminen explodieren und reißen andere Gegner mit.

## Windows

`dist/windows/NovaBreach.exe` auf einen Windows-PC (10/11, 64 Bit) kopieren und starten – kein Installer, die Datei entpackt sich beim Start selbst. Alternativ `dist/windows/NovaBreach-Windows.zip` entpacken und `NOVA BREACH.exe` im Ordner starten (startet schneller).

Die Windows-Version ist ein Port nach JavaScript + three.js (WebGL 2) in einer Electron-Hülle, mit denselben Werten, Gegnern, Waffen, Sounds und Texten. Die Auflösung passt sich automatisch an, damit es auch auf Laptops mit integrierter Grafik flüssig bleibt. Die exe ist nicht signiert: Windows SmartScreen zeigt beim ersten Start „Der Computer wurde durch Windows geschützt“ → *Weitere Informationen* → *Trotzdem ausführen*.

![Windows-Version](docs/screenshot-windows.png)

Neu bauen (läuft auf dem Mac, braucht nur Node.js):

```bash
win/build-win.sh
```

Tests ohne Windows (gleiche Chromium-Engine wie die exe):

```bash
cd win && node build.mjs && node_modules/.bin/electron . --autotest /tmp/frame.png --wave 5 --at 20
```

`--inputtest` schickt echte Klicks/Tasten statt Autopilot, `--mortal` testet Game Over, `--query "pose=lineup"` zeigt alle Gegner.

## Bauen

Braucht nur die Xcode Command Line Tools (kein volles Xcode):

```bash
./build.sh
```

Ergebnis: `dist/NOVA BREACH.app` und `dist/NovaBreach.dmg` (arm64, ab macOS 13, ad hoc signiert).

Testmodi der Binary (ohne Eingabe, mit Autopilot):

```bash
"dist/NOVA BREACH.app/Contents/MacOS/NovaBreach" --shots /tmp/shots --seconds 60 --every 10
```

```bash
"dist/NOVA BREACH.app/Contents/MacOS/NovaBreach" --autotest /tmp/frame.png --wave 5
```

`--shots` rendert ohne Fenster, `--autotest` öffnet kurz ein echtes Fenster und speichert ein Bild.

## Aufbau

| Datei | Inhalt |
|---|---|
| `Sources/main.swift` | Fenster, Eingabe, Maus-Capture, Testmodi, Icon-Renderer |
| `Sources/Game.swift` | Spielzustand, Spieler, Kamera, Wellen, Autopilot |
| `Sources/Combat.swift` | Waffen, Schaden, Projektile, Pickups, Gegner-KI |
| `Sources/Enemies.swift` | Gegnertypen und ihre Modelle |
| `Sources/Maps.swift` | Map-Liste (Name, Beschreibung, Farbe, Rekord-Schlüssel) |
| `Sources/Level.swift` | Arena Helix-9, Kollision, Wegfindung (Flow-Field) |
| `Sources/LevelDock.swift` | Map Orbital-Dock |
| `Sources/Textures.swift` | prozedurale PBR-Texturen und Skybox |
| `Sources/Effects.swift` | Partikel, Tracer, Explosionen, Lichtblitze |
| `Sources/HUD.swift` | HUD und Menüs (SpriteKit-Overlay) |
| `Sources/Audio.swift` | Synthese aller Sounds und der Musik |
