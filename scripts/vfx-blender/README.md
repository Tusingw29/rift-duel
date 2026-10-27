# Blender VFX assets

Rebuild all four meshes and three masks using the installed version only:

```sh
"/Applications/Blender 3.6.app/Contents/MacOS/Blender" -b --factory-startup --python scripts/vfx-blender/build.py -- --out dist/assets/vfx/blender
```

`build.py` contains independent `sol`, `vesper`, `capture`, and `burst` builders plus the analytic grayscale bake. Authoring coordinates are game XYZ; they are converted to Blender Z-up before the glTF exporter returns Y-up. Closed swept cross-sections carry UVs and outward normals. Objects are joined before export so each asset has only body/core material primitives. No .blend files are written.

The 128×128 masks are baked directly into Blender image data from original mathematical fields: flowing strands, fracture lines and elongated sparks. RGB and alpha carry the same grayscale signal, allowing the existing alpha-reading shader to use them. This is a CPU image bake, not a Cycles render. Workbench is the configured engine; no heavy render is run.

Everything here is original project work dedicated under CC0-1.0. Source and hashes are recorded in `dist/assets/vfx/blender/manifest.json`; the accompanying license covers the four GLBs and three PNGs. Rebuilds can change exporter metadata; manifests are regenerated rather than promising byte-identical GLBs across environments.

Runtime GLBs are lazy-loaded only when both flow and Blender pieces are enabled. Default gameplay never requests these assets. Loading/failure uses the existing procedural flow until a replacement is ready. The workbench can compare live default or previous flow with the Blender draft. Asset arrival redraws a paused workbench.
