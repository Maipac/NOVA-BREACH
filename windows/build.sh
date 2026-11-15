#!/bin/bash
# Baut die native Windows-Version (C++ / Direct3D 11) als einzelne NovaBreach.exe.
# Braucht nur den MinGW-w64-Crosscompiler:
#   macOS:  brew install mingw-w64
#   Ubuntu: sudo apt install g++-mingw-w64-x86-64
set -euo pipefail
cd "$(dirname "$0")"
CXX="${CXX:-x86_64-w64-mingw32-g++}"
OUT=../dist/windows-native
mkdir -p "$OUT" build
echo "==> Kompiliere ($CXX)"
OBJS=()
for f in src/*.cpp; do
    o="build/$(basename "${f%.cpp}").o"
    if [ ! -f "$o" ] || [ "$f" -nt "$o" ] || [ -n "$(find src -name '*.h' -newer "$o" -print -quit)" ]; then
        "$CXX" -std=c++17 -O2 -DNDEBUG -DUNICODE -D_UNICODE -Wall -Wno-unused-function -Wno-missing-braces -c "$f" -o "$o" &
    fi
    OBJS+=("$o")
done
wait
WINDRES="${WINDRES:-x86_64-w64-mingw32-windres}"
"$WINDRES" res/app.rc -O coff -o build/app_res.o
OBJS+=(build/app_res.o)
echo "==> Linke"
"$CXX" -municode -mwindows -static -static-libgcc -static-libstdc++ -o "$OUT/NovaBreach.exe" "${OBJS[@]}" \
    -ld3d11 -ldxgi -ld3dcompiler_47 -lgdi32 -luser32 -lshell32 -lole32 -lwinmm
x86_64-w64-mingw32-strip "$OUT/NovaBreach.exe" 2>/dev/null || true
echo "Fertig: dist/windows-native/NovaBreach.exe ($(du -h "$OUT/NovaBreach.exe" | cut -f1))"
