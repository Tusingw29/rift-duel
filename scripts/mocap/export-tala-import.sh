#!/bin/bash
# TALA-IMPORT-AB: regenerate the imported comparison clips from the CMU takes (BVH under ${MOCAP:-~/rift-tools/mocap/cmu-new}).
# Footwork: one subject (CMU 14, orthodox boxer, left foot leading like Tala). Get-up: CMU 140_09 (lying on the back).
set -e
C=${MOCAP:-$HOME/rift-tools/mocap/cmu-new}
L='via cgspeed BVH conversion (CMU Graphics Lab Motion Capture Database, mocap.cs.cmu.edu: free for research and commercial use; cgspeed conversion adds no restrictions)'
out=dist/clips/import
mkdir -p $out
node scripts/mocap/bvh-to-channels.mjs --in $C/14_01.bvh --segment 3008:3074 --mode loop --keys 24 --name advance --source "CMU 14_01 boxing $L" --out $out/advance.js
node scripts/mocap/bvh-to-channels.mjs --in $C/14_03.bvh --segment 1797:1933 --mode loop --keys 24 --name retreat --source "CMU 14_03 boxing $L" --out $out/retreat.js
node scripts/mocap/bvh-to-channels.mjs --in $C/14_03.bvh --segment 489:570 --mode loop --keys 24 --name left --source "CMU 14_03 boxing $L" --out $out/left.js
node scripts/mocap/bvh-to-channels.mjs --in $C/14_01.bvh --segment 1326:1373 --mode loop --keys 24 --name right --source "CMU 14_01 boxing $L" --out $out/right.js
node scripts/mocap/bvh-to-channels.mjs --in $C/140_09.bvh --segment 150:600 --mode oneshot --keys 28 --pelvis-frame --name getup --source "CMU 140_09 get up from ground laying on back $L" --out $out/getup.js
