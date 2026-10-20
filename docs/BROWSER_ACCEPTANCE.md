# Browser acceptance pass for alpha 0.26

Status: **pending**. These are executable review steps, not passed-test claims.
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
