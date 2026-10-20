# Browser acceptance pass for alpha 0.26

Status: **interaction pass completed; visual samples reviewed, polish still needed**. Results below distinguish executed checks from the broader review checklist.
Target: https://tusingw29.github.io/rift-duel/?v=0.26
Expected release: `4fd3bcc94374` (23 JavaScript modules).

Use only the game’s owned tab. Preserve unrelated tabs. Restore default controls and exit to character select when finished.

## Keyboard editor

1. Open Options → Keyboard controls. Verify both players have ten controls, player two shows numeric keypad and top-row aliases, and the bottom controls remain reachable at a narrow viewport.
2. Select Player 1 Attack, press K. Expect a conflict identifying Player 1 Guard, with the prior binding unchanged. Press Escape to cancel; the dialog should remain open and focus should return to the selected control.
3. Select Player 1 Attack and press Space. Expect a saved confirmation and Space on the button. Close the dialog. The menu and fight prompts should now show Space for attack.
4. Start Training. Tap Space: one normal attack. Tap J: no attack. Hold Space: charge power. Release: no unintended shot after a charging hold. Use the touch Attack button: it should still attack.
5. Reload. Verify Space is retained, then reopen the editor. Attempt to assign Player 1 Attack to top-row 1; expect a conflict with Player 2 Attack.
6. Reassign Player 2 Guard to P. In Local versus, verify P controls player two’s guard and the former guard keys no longer do. Verify player one still acts independently.
7. Restore default keys. Verify WASD/J/K and both player-two numeric aliases return after reload. Verify Escape still pauses, ordinary browser shortcuts remain available, and no attack is queued by closing the editor.
8. Navigate the editor using keyboard Tab/Enter and a synthetic standard controller. Verify focus stays visible and Escape cancels capture before closing the dialog.

## Recent projectile and move changes

Use Training with an idle rival. Start each check from initial spacing, with no held input.

| Fighter | Input (default layout, left side) | Expected behavior and visual |
|---|---|---|
| Tala | D + tap J | One travelling energy shot; no teleporting forward lunge |
| Tala | A + tap J | Retreat once; one spinning discus; extended hurt pose on a clean hit |
| Morrow | D + tap J | One low arcing ground wave; extended hurt pose |
| Morrow | A + tap J | Retreat once; four pairs of missiles; later pairs stop if interrupted |
| Aegis | D / A + tap J | Straight beam / distinct lightning zigzag |
| Rei | D / A + tap J | Winged spirit / straight spectral sword |
| Vesper | D / A + tap J | Fire with trailing shape / visible trapping ring |
| Sol | D / A + tap J | One stunning fire shot / one retreating knockdown flame |

For each shape, inspect near emission and near impact. Check visibility, floor clearance, facing on both sides, and whether subsequent ordinary shots retain an old effect accidentally. The camera and HUD must leave the fighters and projectiles readable. Check the browser console after the sweep.

## Evidence to record

Record browser, release hash, keyboard steps actually executed, observed result, console failures, and any captured visual samples. Separate real controller hardware results from synthetic API tests. HTTP delivery checks and simulation tests do not substitute for these interactions.

## Executed Chrome pass — October 20, 2026

User explicitly authorized the available Chrome tools after the required plugin runtime was unavailable. Tested the public 0.26 release in owned tab 17; unrelated tabs were untouched.

- Editor exposes 20 controls. Conflict with P1 Guard and P2 top-row Attack is rejected. Escape cancels capture while retaining the dialog and focus. Space remapping updates prompts and survives reload. J no longer attacks; Space attacks and charges from one to two stocks without a release shot.
- P2 Guard remapped to P: a blocked shot leaves 99.16 HP, while the old Digit2 key leaves 93 HP. A real pointer click on the touch Attack button after P1 remapping deals another 7 damage. Restore defaults restores J and both P2 guard aliases after reload.
- Narrow-window inspection reached an actual 500 × 636 viewport (the browser did not reach the requested 390-pixel width). No horizontal document overflow; the restore button was visible after scrolling. Screenshot inspected. This is not a 390-pixel-device claim.
- Tab/Enter selects a binding and Escape cancels. Synthetic standard-gamepad Down moves focus, A starts binding capture, and B closes the dialog. This is not physical-controller testing.
- Screenshots inspected Tala’s energy shot/discus, Morrow’s ground wave/eight-projectile barrage, Aegis’s lightning, Rei’s spirit/sword, Vesper’s ring, and Sol’s flame. Sol’s retreating clean hit leaves 91.4 HP and knockdown. A separate right-side Rei sword sample points left toward the opponent.
- No console errors or warnings appeared. Default keys were restored and the page was left at character select. No gamepad override remained.

Outstanding visual findings: the ground-wave arc reads too narrowly from the side camera, and the winged spirit looks flat in side view. The barrage pairs overlap in the neutral camera even though eight projectiles are emitted. These are alpha-art limitations, not completed polish. Exhaustive impact sampling, every projectile from both sides, sub-500-pixel layouts and physical controllers remain outside this pass.
