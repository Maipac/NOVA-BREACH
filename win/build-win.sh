#!/bin/bash
# Baut NOVA BREACH für Windows (x64) – läuft auf dem Mac, braucht nur Node.js (kein Wine, kein Windows).
# Ergebnis:
#   ../dist/windows/NovaBreach.exe           einzelne portable .exe (entpackt sich beim Start selbst)
#   ../dist/windows/NovaBreach-Windows.zip   derselbe Inhalt als Ordner (startet schneller)
set -euo pipefail
cd "$(dirname "$0")"

[ -d node_modules ] || npm install

echo "==> Bündle Spiel (three.js + Quellcode -> app/game.js)"
node build.mjs

echo "==> Paketiere für Windows x64"
rm -rf ../dist/windows
node_modules/.bin/electron-builder --win portable --x64 --config electron-builder.json

echo "==> Erzeuge ZIP-Variante"
( cd ../dist/windows && rm -rf "NOVA BREACH" && mv win-unpacked "NOVA BREACH" && zip -qr NovaBreach-Windows.zip "NOVA BREACH" && rm -rf "NOVA BREACH" builder-debug.yml builder-effective-config.yaml )

ls -lh ../dist/windows
echo "Fertig: dist/windows/NovaBreach.exe"
