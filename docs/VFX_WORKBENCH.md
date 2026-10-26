# Visual VFX authoring

Open `vfx-workbench.html`. The two views instantiate production meshes from `ink-energy.js` and `energy-style.js`, not separately drawn approximations. Left is the committed default; right is the editable draft. Orbit both views together, check the attack-axis camera, pause, step and scrub. The silhouette checkbox isolates shape from color. The status readout shows render FPS separately from the 60 Hz demonstration clock.

## Review loop

1. Select a fighter signature, Aegis beam, open capture binding, Tala charge, or ground impact. Names intentionally identify effects that do not vary by fighter.
2. Inspect release frame 30 from side, three-quarter and down-axis. Inspect breakup frames 48, 51, 54, 57, 60, 63 and clear at 66. These are **asset-demonstration stages**, not simulation combat windows.
3. Try “crisp stroke”: narrower beam, smaller ribs, narrower white channels, a smaller signature core/ink margin and 20 Hz geometry cadence. This is a candidate, not a new game default.
4. For a signature, drag outline handles. A simple, non-crossing outline becomes the actual extruded production mesh. Core, ink, depth and selected signature colors are editable. Invalid edits leave the last valid shape intact.
5. Save draft, then open the fight/sandbox link. Existing preview tabs must reload after saving. Inspect actual socket attachment, hitstop, interactions and behind-player camera here; the asset demonstration cannot establish these.
6. Export the preset JSON and a comparison image. A reviewer can import the exact draft. Review normal-speed motion before approving it. Commit approved settings deliberately, with captures and tests.

## Boundaries

`vfx-settings.js` validates a versioned, visual-only schema. It changes no combat state, damage, collision geometry, rig, pose or clip. Normal gameplay ignores local drafts. Only `?vfxPreview=1` reads the same-origin `rift-vfx-draft-v1` localStorage entry. Invalid saved data falls back to defaults. Storage is local to the browser, not GitHub; export is needed to share a draft.

Signature palettes apply to signature meshes. Beam, chi and binding palettes keep their existing authored colors. The tool does not yet author weapon trajectories or retime character animation. Use the real sandbox for these; Claude retains that lane. The displayed breakup uses production signature shards but an isolated preview trajectory, not combat collision/throw logic.

`createInkBeam` changes white-channel angular width rather than pushing channels underneath the opaque body. Geometry is rebuilt only when a shape parameter changes, and replaced buffers are disposed. Signature edits preserve the latest valid polygon. The original Tala signature had one crossing tail segment; that redundant point was removed so its extrusion has a valid simple outline.

## Verification

`tests/vfx-settings.test.mjs` exercises malformed inputs, polygon crossings, all six default outlines, defensive copies, real beam/core changes, disposal, palette restoration and reverse-time evaluation. `scripts/review/vfx-workbench.mjs` captures six comparison views and exercises silhouette dragging, persistence, export, invalid/valid import, exact reverse seek and a sandbox reading the saved draft. The workflow also runs the existing gameplay, character and VFX browser checks.
