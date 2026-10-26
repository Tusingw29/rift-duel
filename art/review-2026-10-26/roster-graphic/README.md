# Graphic flat-colour roster, first pass — 26 October 2026

Adam chose the graphic flat-colour style, so the other five fighters now load in that style too whenever it is selected (it is the default). These bodies are derived from the textured Design 03 builds by `scripts/build-fighter-graphic.mjs`, not sculpted like the Tala graphic asset, so they are the same shapes with the surfaces repainted.

- **Skin and outfit**: one flat colour each, the median of the texture with a slight saturation lift.
- **Hair and shoes**: the concept colours from the fighter spec (texture medians went near black because of strand gaps and dark leather).
- **Hair, eyebrows, eyelashes**: keep their alpha silhouette as small flat PNGs; the eyes keep a posterised texture so the iris survives.
- **Runtime**: body, costume pieces, weapons and Rei's companion spirit all take the two-tone shader (`dist/graphic-flat.js`); the translucent aura and technique effects keep their own look.
- Each GLB is 1.4 to 2.0 MB, down from 3.1 to 4.1 MB.

| File | Reading |
| --- | --- |
| `idle-front-graphic.jpg` / `idle-front-textured.jpg` | Aegis, Rei, Morrow, Sol, Vesper at rest, graphic above textured. |
| `strike1-side-graphic.jpg` / `strike1-side-textured.jpg` | First strike at frame 8 from the side, same order. |

Known limits for the next pass: faces are MakeHuman geometry under a flat colour (no sculpted eyes, nose or mouth like Tala's), hair volumes are the original cards rather than solid locks, and Aegis's armour plates still show the vertex-colour speckle of the runtime armour. Captured on `fighter-review.html?fighter=<id>&model=graphic` with `HIDE_UI=1 MODEL=graphic node scripts/review/review-shot.mjs`. Still to judge at normal speed.
