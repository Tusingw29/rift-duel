# Appearance and movement

## Build from the selected concept

Confirm Tala Design 02 against the current board: athletic adult proportions, auburn ponytail, ochre cropped vest, dark athletic top, rust shorts, ivory wraps and dark martial shoes. The user's target evolved toward early-2000s Japanese fighters; do not force PS1 geometry artifacts or photorealistic skin because a reference mentions them.

Compare head width/depth, jaw, eye line, neck length, shoulders, torso taper, limb proportions, fists, shoes and garment openings. Prioritize readable large colors and restrained painted shading. Pores and cloth weave cannot repair the wrong face or blocky shoulders. Keep cameras and lighting consistent for comparisons.

Hair can combine an opaque scalp cap, broad polygon clumps and a few alpha cards. Match the part, sweep, tie position and ponytail silhouette first. Cards are optional: they add overdraw, may shimmer and require a real atlas. Review guard and rear views for face occlusion, bald gaps and scalp intersections. Transfer proxy normals only when lighting improves; overly smooth normals can flatten intentional clumps.

For alpha cards on the pinned Blender 3.6 build, connect RGBA Image Texture **Color** to Principled **Base Color**, and **Alpha** to **Alpha**. Set clip threshold and export. An empty material helper with unconnected sockets produces no strand cutouts. Confirm exported `alphaMode: MASK`, `alphaCutoff`, embedded PNG and correct UVs, then inspect the visible edge. Double-sided shading is a visibility/cost choice. On other Blender versions, verify actual exporter behavior rather than assuming a transparency enum implies MASK.

Normal maps are optional. Connect a Non-Color image through a Tangent Space Normal Map node to shader Normal. Bake against final triangulation and UVs. Prefer matching exported tangents for bake parity, but their absence does not automatically invert normals: the vendored shader derives a tangent frame when needed. Inspect seams, mirrored UVs and lighting in the game. Keep albedo separate from normal/roughness data. Exporting a procedural node network is not equivalent to baking it into glTF textures.

## Skinning and body mechanics

Weight the actual deform bones. Suggested percentages are starting points, not anatomical laws. Review raised guard, punch extension and recovery for shoulder collapse, elbow pinching and neck shear. Preserve the jaw with head-dominant weights and distribute the throat transition toward the chest. Improve topology when weights alone cannot maintain shape.

Author support foot and pelvis, then torso counter-rotation, arm arc and head response. Advance/retreat need push-off, passage and catch. Circle steps need hips and foot orientation aligned with the travel arc. Drive gait phase from distance. A sole locked throughout an entire punch can be as robotic as skating: specify heel lift, ball pivot, release and landing using current foot controls.

Crossed-arm guard covers torso/jaw, lowers the chin and braces through knees and shoulders. Pitch signs depend on actual local axes. Keep eyes on the rival and avoid throat stretching. Do not paste angles for a nonexistent neck bone.

Keep J responsive and contact poses exact. Anticipation must fit current startup; do not add mandatory frames to every action. Combos carry pelvis rotation into the next strike with deliberate support changes. Recoil should interrupt cleanly, catch weight and recover balance. Check these from behind Tala as well as the opponent's view.

Smooth action transitions where needed instead of continuously damping every joint. Secondary hair/cloth motion should clarify the body. Add ribbons, flashes and camera effects after the action reads with them disabled.

## Acceptance

Inspect neutral front/side/back, tucked guard, three contacts and follow-through. Watch complete movement, combo and recoil at normal and slow speed from the fight camera. Report actual remaining defects. Pose constraints and attractive stills do not prove fluidity.
