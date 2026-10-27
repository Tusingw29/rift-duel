#!/bin/bash
# QUATERNIUS-REACTIONS: regenerate dist/clips/import/hit-head.js and hit-chest.js from the Quaternius Universal
# Animation Library Standard pack (CC0, opengameart.org/content/universal-animation-library). The BVHs were exported from
# Blender 3.6 with the rig turned Y-up and the bones renamed to the CMU names; keep them outside the repo
# (~/rift-tools/mocap/quaternius). 24 fps. Both takes open on the hit (BVH frame 0, kept with --keep-first) and settle
# into the pack's idle stand by their last frame: Hit_Head 11 frames (0.42 s), Hit_Chest 9 frames (0.33 s).
set -e
Q=${QUATERNIUS:-$HOME/rift-tools/mocap/quaternius}
S='CC0 (opengameart.org/content/universal-animation-library)'
node scripts/mocap/bvh-to-channels.mjs --in $Q/hit_head.bvh --out dist/clips/import/hit-head.js --name hit-head --segment 0:10 --keep-first \
 --mode reaction --type head --source "Quaternius Universal Animation Library Standard, Hit_Head, $S"
node scripts/mocap/bvh-to-channels.mjs --in $Q/hit_chest.bvh --out dist/clips/import/hit-chest.js --name hit-chest --segment 0:8 --keep-first \
 --mode reaction --type chest --source "Quaternius Universal Animation Library Standard, Hit_Chest, $S"
