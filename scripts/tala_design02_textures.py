"""Bake procedural surface detail into image textures for the Design 02 model.

For every untextured material, all objects that use it are unwrapped together into
one atlas, a procedural node tree (object-space, so UV layout does not matter) is
baked to an image with Cycles, and that image becomes the material's base colour.
Patterns: fabric weave and fold shading for cloth, wound linen for wraps, tone
mottling for skin, streaks for hair, grain for leather. No photographs or outside
assets are used. Runs before the per-material join and the GLB export.
"""
import bpy,math
from pathlib import Path

RESOLUTION={'skin':768,'cloth':768,'wrap':512,'hair':512,'hairlight':512,'leather':256,'trim':256}
SMALL={'top':512,'ochre':256,'wrap':384}# under-vest top, shoe trim and hair tie, fists

def _kind(material):
 n=material.name.lower()
 if 'skin' in n:return 'skin'
 if 'wrap' in n:return 'wrap'
 if 'hairlight' in n:return 'hairlight'
 if 'hair' in n:return 'hair'
 if 'sole' in n or 'shoe' in n:return 'leather'
 if 'lining' in n or 'crease' in n:return 'trim'
 return 'cloth'

def _tree(material,kind,base,layer=None):
 """Author an emission tree that paints the pattern; the bake reads it as colour."""
 nt=material.node_tree;nodes=nt.nodes;links=nt.links
 for node in list(nodes):nodes.remove(node)
 out=nodes.new('ShaderNodeOutputMaterial');emit=nodes.new('ShaderNodeEmission');links.new(emit.outputs[0],out.inputs[0])
 coord=nodes.new('ShaderNodeTexCoord');basecol=nodes.new('ShaderNodeRGB');basecol.outputs[0].default_value=(*base[:3],1)
 def noise(scale,detail=2,rough=.5):
  n=nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=scale;n.inputs['Detail'].default_value=detail;n.inputs['Roughness'].default_value=rough;links.new(coord.outputs['Object'],n.inputs['Vector']);return n
 def wave(scale,direction='X',distortion=0,profile='SIN'):
  w=nodes.new('ShaderNodeTexWave');w.wave_type='BANDS';w.bands_direction=direction;w.wave_profile=profile;w.inputs['Scale'].default_value=scale;w.inputs['Distortion'].default_value=distortion;links.new(coord.outputs['Object'],w.inputs['Vector']);return w
 def mix(fac,a,b,blend='MIX'):
  m=nodes.new('ShaderNodeMixRGB');m.blend_type=blend;m.inputs['Fac'].default_value=fac if isinstance(fac,float) else 1
  if not isinstance(fac,float):links.new(fac,m.inputs['Fac'])
  (links.new(a,m.inputs[1]) if hasattr(a,'is_linked') else m.inputs[1].__setattr__('default_value',a))
  (links.new(b,m.inputs[2]) if hasattr(b,'is_linked') else m.inputs[2].__setattr__('default_value',b))
  return m
 def ramp(src,lo,hi):
  r=nodes.new('ShaderNodeMapRange');r.inputs['From Min'].default_value=0;r.inputs['From Max'].default_value=1;r.inputs['To Min'].default_value=lo;r.inputs['To Max'].default_value=hi;links.new(src,r.inputs['Value']);return r
 colour=basecol.outputs[0]
 vertex=nodes.new('ShaderNodeVertexColor')
 if kind=='cloth':
  # Twill: two fine band sets crossed, softened by fuzz, then the authored fold shading.
  warp=wave(260,'X',.6,'TRI');weft=wave(260,'Z',.6,'TRI');fuzz=noise(90,3,.6)
  threads=mix(.5,warp.outputs['Color'],weft.outputs['Color'],'MULTIPLY')
  tone=ramp(threads.outputs[0],.90,1.06)
  speck=ramp(fuzz.outputs['Fac'],.95,1.05)
  shaded=mix(1.0,colour,tone.outputs[0],'MULTIPLY');shaded2=mix(1.0,shaded.outputs[0],speck.outputs[0],'MULTIPLY')
  colour=shaded2.outputs[0]
  if layer:
   # Vertex colours carry base tint × fold shade; divide the tint out so folds only darken.
   vertex.layer_name=layer;norm=nodes.new('ShaderNodeMixRGB');norm.blend_type='DIVIDE';norm.inputs['Fac'].default_value=1;links.new(vertex.outputs['Color'],norm.inputs[1]);norm.inputs[2].default_value=(*[max(.05,c) for c in base[:3]],1)
   folds=mix(.7,(1,1,1,1),norm.outputs[0]);final=mix(1.0,colour,folds.outputs[0],'MULTIPLY');colour=final.outputs[0]
 elif kind=='wrap':
  # Wound linen: coarse weave plus diagonal overlap bands and dust.
  warp=wave(190,'Y',.3,'TRI');weft=wave(190,'X',.3,'TRI');bands=wave(14,'Y',1.4,'SIN');dust=noise(25,2,.7)
  threads=mix(.5,warp.outputs['Color'],weft.outputs['Color'],'MULTIPLY');tone=ramp(threads.outputs[0],.9,1.04)
  overlap=ramp(bands.outputs['Fac'],.9,1.0);dirt=ramp(dust.outputs['Fac'],.9,1.02)
  a=mix(1.0,colour,tone.outputs[0],'MULTIPLY');b=mix(1.0,a.outputs[0],overlap.outputs[0],'MULTIPLY');c=mix(1.0,b.outputs[0],dirt.outputs[0],'MULTIPLY');colour=c.outputs[0]
  if layer:
   vertex.layer_name=layer;norm=nodes.new('ShaderNodeMixRGB');norm.blend_type='DIVIDE';norm.inputs['Fac'].default_value=1;links.new(vertex.outputs['Color'],norm.inputs[1]);norm.inputs[2].default_value=(*[max(.05,v) for v in base[:3]],1)
   folds=mix(.8,(1,1,1,1),norm.outputs[0]);final=mix(1.0,colour,folds.outputs[0],'MULTIPLY');colour=final.outputs[0]
 elif kind=='skin':
  # Warm and cool mottling at two scales, kept subtle.
  fine=noise(40,3,.55);broad=noise(6,2,.5)
  f=ramp(fine.outputs['Fac'],.95,1.04);b=ramp(broad.outputs['Fac'],.94,1.03)
  warm=nodes.new('ShaderNodeRGB');warm.outputs[0].default_value=(1.04,.97,.95,1)
  a=mix(1.0,colour,f.outputs[0],'MULTIPLY');c=mix(1.0,a.outputs[0],b.outputs[0],'MULTIPLY')
  blush=mix(broad.outputs['Fac'],c.outputs[0],mix(1.0,c.outputs[0],warm.outputs[0],'MULTIPLY').outputs[0]);colour=blush.outputs[0]
 elif kind in('hair','hairlight'):
  # Strands run along the hair mass; brighter streaks catch the light.
  strands=wave(120,'Y',2.5,'SIN');clumps=wave(18,'Y',4,'SIN');grain=noise(80,2,.6)
  s=ramp(strands.outputs['Fac'],.78,1.1);c=ramp(clumps.outputs['Fac'],.86,1.08);g=ramp(grain.outputs['Fac'],.95,1.03)
  a=mix(1.0,colour,s.outputs[0],'MULTIPLY');b=mix(1.0,a.outputs[0],c.outputs[0],'MULTIPLY');d=mix(1.0,b.outputs[0],g.outputs[0],'MULTIPLY');colour=d.outputs[0]
 elif kind=='leather':
  grain=noise(120,4,.7);scuff=noise(9,2,.5)
  g=ramp(grain.outputs['Fac'],.86,1.04);s=ramp(scuff.outputs['Fac'],.9,1.05)
  a=mix(1.0,colour,g.outputs[0],'MULTIPLY');b=mix(1.0,a.outputs[0],s.outputs[0],'MULTIPLY');colour=b.outputs[0]
 else:
  g=ramp(noise(60,2,.5).outputs['Fac'],.92,1.03);a=mix(1.0,colour,g.outputs[0],'MULTIPLY');colour=a.outputs[0]
 links.new(colour,emit.inputs['Color'])
 return nt

def _restore(material,image,roughness):
 nt=material.node_tree;nodes=nt.nodes;links=nt.links
 for node in list(nodes):nodes.remove(node)
 out=nodes.new('ShaderNodeOutputMaterial');p=nodes.new('ShaderNodeBsdfPrincipled');links.new(p.outputs[0],out.inputs[0])
 tex=nodes.new('ShaderNodeTexImage');tex.image=image;tex.interpolation='Linear';links.new(tex.outputs['Color'],p.inputs['Base Color'])
 p.inputs['Roughness'].default_value=roughness;nodes.active=tex

def bake_textures(ctx):
 scene=bpy.context.scene;engine=scene.render.engine
 scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=1;scene.render.bake.margin=6;scene.render.bake.use_clear=True
 meshes=[o for o in scene.objects if o.type=='MESH']
 by_material={}
 for obj in meshes:
  for slot in obj.material_slots:
   m=slot.material
   if not m or not m.use_nodes:continue
   if any(n.type=='TEX_IMAGE' and n.image for n in m.node_tree.nodes):continue
   by_material.setdefault(m,[]).append(obj)
 report={}
 for material,objects in by_material.items():
  kind=_kind(material);base=tuple(material.diffuse_color[:3])
  p=material.node_tree.nodes.get('Principled BSDF');roughness=p.inputs['Roughness'].default_value if p else .8
  size=SMALL.get(material.name,RESOLUTION.get(kind,512))
  layer=next((name for name in ('ClothColor','WrapTone') if all(o.data.color_attributes.get(name) for o in objects)),None)
  bpy.ops.object.select_all(action='DESELECT')
  for obj in objects:obj.select_set(True)
  bpy.context.view_layer.objects.active=objects[0]
  # One atlas per material: unwrap every object, then pack their islands together.
  bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
  bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.02)
  bpy.ops.uv.pack_islands(margin=.012)
  bpy.ops.object.mode_set(mode='OBJECT')
  image=bpy.data.images.new(f'{material.name}_baked',size,size,alpha=False);image.colorspace_settings.name='sRGB'
  _tree(material,kind,base,layer)
  target=material.node_tree.nodes.new('ShaderNodeTexImage');target.image=image;material.node_tree.nodes.active=target
  bpy.ops.object.bake(type='EMIT')
  # Store as JPEG so ten atlases stay well under the download budget.
  image.filepath_raw=str(Path(bpy.app.tempdir)/f'{material.name}_baked.jpg');image.file_format='JPEG';scene.render.image_settings.quality=86;image.save();image.pack()
  _restore(material,image,roughness)
  report[material.name]={'kind':kind,'size':size,'objects':[o.name for o in objects]}
 scene.render.engine=engine
 bpy.ops.object.select_all(action='DESELECT')
 ctx['texture_report']=report
 print('RIFT_TEXTURES',report)
 return report
