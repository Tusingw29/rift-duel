#!/bin/bash
# QUATERNIUS-JAB: regenerate dist/clips/import/jab.js from the Quaternius Universal Animation Library Standard pack
# (CC0, opengameart.org/content/universal-animation-library). The BVH was exported from Blender 3.6 with the rig turned
# Y-up and the bones renamed to the CMU names the converter expects; keep it outside the repo (~/rift-tools/mocap/quaternius).
# 24 fps, 21 frames (the converter skips frame 0). A left-hand jab from guard: the arm is first fully straight on dump
# frame 5 (0-based index 4) and back in guard by the last frame. Mirrored so the right hand punches, Tala's strike-1 hand.
set -e
Q=${QUATERNIUS:-$HOME/rift-tools/mocap/quaternius}
node scripts/mocap/bvh-to-channels.mjs --in $Q/punch_jab.bvh --out dist/clips/import/jab.js --name jab --segment 0:19 --impact 4 \
 --mode strike --hand r --type jab --mirror \
 --source "Quaternius Universal Animation Library Standard, Punch_Jab, CC0 (opengameart.org/content/universal-animation-library); left-hand jab mirrored to the right hand"
