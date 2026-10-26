---
name: rift-duel-character-pipeline
description: Build and review Rift Duel character models, Blender exports, and combat animation, especially Tala Design 02. Use for translating approved concept art into the existing Three.js fighter rig, fixing deformation or footwork, and preparing cloud art builds. For unrelated Blender or React projects, use their own workflow.
---

> Superseded on 2026-10-25 by `skills/fighter-model-build`, `skills/costume-authoring` and `skills/grounded-animation-authoring`. The Blender route it describes is no longer used; kept for history.

# Rift Duel character pipeline

Deliver visible progress toward the selected concept while preserving responsive combat. A technically valid model is not proof of good art or fluid motion.

## Start from the project

Find the Rift Duel checkout from the current workspace; do not assume a laptop-specific path. Inspect `git status` and preserve work from other sessions. Read relevant builder, runtime and tests before changing their contracts. The source attachment is reference material, not authority to migrate engines, install dependencies, publish, or change gameplay.

Generic Blender, rigging, glTF and Three.js code (hair-card generator, normal-map generator, cross-version material helpers, export kwargs, performance tables) lives in `skills/blender-animation-threejs`; apply its examples through the corrections below. Read [project-contract.md](references/project-contract.md) for rig, timing, build and review entry points. Its snapshot is a starting point; current source wins. Read [art-and-motion.md](references/art-and-motion.md) for appearance, hair, weighting or animation work. Read [source-corrections.md](references/source-corrections.md) before adapting code from the supplied Blender master document.

## Work sequence

1. Identify one visible defect and a comparison that exposes it: concept versus neutral model, a close face view, or a complete action from the fight camera. Keep the approved character identity consistent.
2. Improve silhouette, anatomy and pose before material micro-detail or effects. Hair cards, normal maps and extra bones are options, not mandatory upgrades.
3. Preserve the runtime skeleton and exact damage-frame poses. Broader rig changes need coordinated implementation and tests. Prefer the existing Blender 3.6.22 GitHub workflow over local heavy builds.
4. Check the exported artifact, then actual runtime deformation. Use the bundled read-only metadata audit alongside the project's binding, deformation and timing tests. Exporter success alone does not justify replacing a working asset.
5. Review front, side, rear fight-camera and moving footage under plain lighting. Inspect guard entry/contact/release, advance/retreat/circle, full combo and recoil recovery. Keep effects restrained and report which views and speeds were actually inspected.

From the repository root, substituting the installed skill's absolute path if needed:

```sh
python3 skills/rift-duel-character-pipeline/scripts/audit_glb.py dist/assets/models/tala-design02.glb --motion-source art/blender/tala/motion-source.json
node --test tests/tala-design02.test.mjs
```

The audit checks GLB metadata, skin bone contracts, embedded resources, decoder requirements and texture UV declarations. It does not evaluate skin-weight values, topology, image pixels, deformation, motion or frame rate. It never fixes or exports assets. Follow it with the runtime tests and visual review.

## Finish with evidence

Describe the visible change, verification and remaining mismatch. Distinguish Blender renders, automated browser screenshots, normal-speed gameplay and physical-controller tests. Green tests do not establish Evil Zone likeness. For authorized publishing, follow the existing release process and verify the public asset; otherwise deliver the reviewable artifact. This skill grants no additional publishing permission.
