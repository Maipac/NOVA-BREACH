#!/bin/bash
# Baut NOVA BREACH als native arm64-App und packt sie in ein DMG.
# Braucht nur die Xcode Command Line Tools (swiftc), kein volles Xcode.
set -euo pipefail
cd "$(dirname "$0")"

APP="dist/NOVA BREACH.app"
BIN="$APP/Contents/MacOS/NovaBreach"
rm -rf "$APP" dist/NovaBreach.dmg build   # only the Mac outputs: dist/windows stays
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" build/icon.iconset build/dmg

echo "==> Kompiliere"
swiftc -O -wmo -swift-version 5 -target arm64-apple-macos13.0 Sources/*.swift -o "$BIN"
cp Resources/Info.plist "$APP/Contents/Info.plist"

echo "==> Rendere Icon"
"$BIN" --icon build/icon_1024.png
for s in 16 32 128 256 512; do
    sips -z $s $s build/icon_1024.png --out "build/icon.iconset/icon_${s}x${s}.png" >/dev/null
    d=$((s * 2))
    sips -z $d $d build/icon_1024.png --out "build/icon.iconset/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns build/icon.iconset -o "$APP/Contents/Resources/AppIcon.icns"

echo "==> Signiere (ad hoc)"
codesign --force --deep --sign - "$APP"

echo "==> Erzeuge DMG"
cp -R "$APP" build/dmg/
ln -s /Applications build/dmg/Applications
hdiutil create -volname "NOVA BREACH" -srcfolder build/dmg -ov -format UDZO dist/NovaBreach.dmg >/dev/null
rm -rf build/dmg

echo "Fertig: dist/NovaBreach.dmg"
