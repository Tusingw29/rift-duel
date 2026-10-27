#!/bin/bash
# MOCAP-COMBAT: regenerate the retargeted strike clips (dist/clips/combat). Frames come from find-strikes.mjs
# (its numbers are 1-based dump frames; the exporter takes 0-based frame indices, hence the -1).
# Sources: CMU motion capture database via cgspeed BVH. CMU licence: free for research and commercial use.
# Credit: "The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217."
set -e
M=${CMU:-$HOME/rift-tools/mocap/cmu-new}
L='free for research and commercial use; mocap.cs.cmu.edu, NSF EIA-0196217'
strike(){ # name take start impact end hand type mirror source-note
 local name=$1 take=$2 a=$(($3-1)) i=$(($4-1)) b=$(($5-1)) hand=$6 type=$7 mirror=$8 note=$9
 node scripts/mocap/bvh-to-channels.mjs --in $M/$take.bvh --out dist/clips/combat/$name.js --name $name --segment $a:$b --impact $i --mode strike --hand $hand --type $type $mirror --source "CMU $take boxing ($note) via cgspeed BVH, $L" | cut -c1-200
}
# Tala, orthodox (left foot lead). Strike 1: rear-hand straight; strike 2: lead-hand straight; strike 3: rear-hand hook.
strike tala-strike1 13_17 577 626 655 r straight '' 'rear-hand straight driving in, subject 13'
strike tala-strike2 14_01 2105 2136 2148 l straight '' 'lead-hand straight stepping in, subject 14'
strike tala-strike3 14_03 4618 4680 4700 r hook --mirror 'rear-hand hook stepping in, subject 14 southpaw mirrored to orthodox'
