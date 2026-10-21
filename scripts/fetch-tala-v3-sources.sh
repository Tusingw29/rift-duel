#!/bin/sh
# Downloads the CC0 sources for the Tala v3 build and verifies them:
#   MPFB 2.0 alpha 3 (legacy add-on; the last build that declares Blender 3.0+) and the MakeHuman system assets.
# Usage: sh scripts/fetch-tala-v3-sources.sh <dir>   then   blender --background --python scripts/build-tala-v3-blender.py -- --mpfb <dir> [--joints]
set -e
DIR="${1:-$HOME/rift-tala-v3-sources}"; mkdir -p "$DIR"; cd "$DIR"
fetch(){ [ -f "$2" ] || curl -fL --retry 3 -o "$2" "$1"; echo "$3  $2" | shasum -a 256 -c -; }
fetch https://files2.makehumancommunity.org/releases/mpfb-2.0-a3.zip mpfb-2.0-a3.zip d616a3988c4ab39c0990bc6fa0cc627fea5cffc3b863bb76589e0388efce0319
fetch https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip makehuman_system_assets_cc0.zip b542127a8e25547c7c29c19f2d1d2adb9a664c80396ecd694095dbc8028a0107
[ -d assets ] || (mkdir -p assets && unzip -q makehuman_system_assets_cc0.zip -d assets)
echo "Sources ready in $DIR"
