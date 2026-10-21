# Three.js (WebGL2 & WebGPU), React Three Fiber, and Shaders Reference

## 1. Renderer and loaders

`WebGLRenderer({antialias:true, powerPreference:'high-performance', stencil:false})`, `setPixelRatio(Math.min(devicePixelRatio, 2))`, `outputColorSpace=SRGBColorSpace`, `toneMapping=ACESFilmicToneMapping`, `shadowMap.type=PCFSoftShadowMap`. Configure `GLTFLoader` with `DRACOLoader`, `KTX2Loader` (`detectSupport(renderer)`) and `MeshoptDecoder` when those are bundled. Rift Duel vendors only `GLTFLoader`; `dist/render.js` already applies the colour and tone-mapping setup and `dist/shading.js` adds a PMREM environment.

Colour management: base colour and emissive textures `colorSpace=SRGBColorSpace`; normal, roughness, metallic and AO maps `NoColorSpace`.

## 2. WebGPURenderer and TSL

`three/webgpu` + `three/tsl`: `MeshStandardNodeMaterial` with `positionNode`, `colorNode`, `emissiveNode`, `opacityNode` built from `Fn`, `uniform`, `time`, `positionLocal`, `sin`, `mix`, `smoothstep`. Compiles to WGSL and GLSL with automatic WebGL2 fallback.

## 3. Extending PBR materials with `onBeforeCompile`

Keep shadows, fog, environment and skinning by injecting into `MeshStandardMaterial`:

```javascript
mat.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = uniforms.uTime;
  shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace('#include <begin_vertex>',
    `#include <begin_vertex>\n vec4 worldPos = modelMatrix * vec4(transformed, 1.0);\n transformed.x += sin(uTime*2.5 + worldPos.x*0.8) * 0.02 * uv.y * uv.y;`);
};
mat.customProgramCacheKey = () => 'wind-foliage-v1';
```

## 4. React Three Fiber discipline

- Never call state setters in `useFrame`; mutate refs and uniforms. Clamp `delta` to 0.1.
- Hoist scratch `Vector3`/`Quaternion`/`Matrix4` objects out of the loop.
- Clone rigged characters with `SkeletonUtils.clone(scene)` inside `useMemo`, then `useGraph` and `useAnimations`; crossfade with `action.reset().fadeIn(0.2).play()` and `fadeOut(0.2)` on cleanup.

## 5. Disposal

Traverse removed subtrees and dispose geometry, every texture-valued material property, and the material. WebGL buffers are not garbage-collected.
