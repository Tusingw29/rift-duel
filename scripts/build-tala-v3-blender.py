"""Build Tala v3: a MakeHuman (MPFB, CC0) anatomical body with real face, eyes, brows,
lashes, hair, clothing and shoes, straightened into the game's rest pose, skinned to the
game's 17-bone skeleton, animated from the sampled game clips, and exported as a GLB.

Run with Blender 3.6: blender --background --python scripts/build-tala-v3-blender.py -- --mpfb <dir with mpfb-2.0-a3.zip and assets/>
Requires art/blender/tala-v3/joints.json (from this script's --joints mode) and
art/blender/tala-v3/motion-source.json (from scripts/sample-tala-motion.mjs --variant v3).
"""
import bpy,bmesh,json,math,os,sys
from pathlib import Path
from mathutils import Matrix,Vector,Quaternion
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'art/blender/tala-v3';OUT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'scripts'))
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
MPFB=Path(argv[argv.index('--mpfb')+1]) if '--mpfb' in argv else Path(os.environ.get('MPFB_DIR',''))
JOINTS_ONLY='--joints' in argv
ASSETS=MPFB/'assets'
from tala_v3_human import install_mpfb,create_tala_human,add_game_rig,joint_report,evaluated_coords,measure,OUR_BONES,CONSOLIDATE,GAME_HEIGHT
install_mpfb(str(MPFB/'mpfb-2.0-a3.zip'))
C=Matrix.Rotation(math.pi/2,4,'X')
def matrix(a):return Matrix([a[i::4] for i in range(4)])

basemesh=create_tala_human();game_rig=add_game_rig(basemesh)
report=joint_report(basemesh,game_rig)
# Floor from the bare body, before garments hide vertices beneath them.
FLOOR=measure(basemesh)['floor']
def straightened(raw):
 """Limb chains hang straight down from the fitted hip and shoulder joints, keeping segment lengths."""
 j={k:Vector(v) for k,v in raw.items()};out={}
 for side in ['L','R']:
  hip=j['thigh.'+side];shoulder=j['upper_arm.'+side]
  thigh_len=(j['thigh.'+side]-j['shin.'+side]).length;shin_len=(j['shin.'+side]-j['foot.'+side]).length
  upper_len=(j['upper_arm.'+side]-j['forearm.'+side]).length;fore_len=(j['forearm.'+side]-j['hand.'+side]).length
  out['thigh.'+side]=hip;out['shin.'+side]=Vector((hip.x,hip.y-thigh_len,hip.z));out['foot.'+side]=Vector((hip.x,hip.y-thigh_len-shin_len,hip.z))
  out['upper_arm.'+side]=shoulder;out['forearm.'+side]=Vector((shoulder.x,shoulder.y-upper_len,shoulder.z));out['hand.'+side]=Vector((shoulder.x,shoulder.y-upper_len-fore_len,shoulder.z))
 for name in ['root','chest','head','ponytail','sash']:out[name]=j[name]
 return {name:[round(c,4) for c in out[name]] for name in OUR_BONES}
if JOINTS_ONLY:
 rest=straightened(report['joints']);foot=rest['foot.L'];
 data={**report,'raw':report['joints'],'joints':rest,'legLength':round(rest['thigh.L'][1]-rest['shin.L'][1],4),'shinLength':round(rest['shin.L'][1]-foot[1],4),'ankleHeight':round(foot[1],4)}
 json.dump(data,open(OUT/'joints.json','w'),indent=1);print('RIFT_JOINTS',json.dumps(rest));sys.exit(0)
joints=json.load(open(OUT/'joints.json'));DATA=json.load(open(OUT/'motion-source.json'))
scale=joints['scale'];side_of={'l':joints['side_map']['l'],'r':'L' if joints['side_map']['l']=='R' else 'R'}

# ---- Assets (CC0 MakeHuman system assets) -------------------------------------------
from mpfb.services.humanservice import HumanService
def asset(rel,kind):
 return HumanService.add_mhclo_asset(str(ASSETS/rel),basemesh,asset_type=kind,subdiv_levels=0,material_type='MAKESKIN',set_up_rigging=True,interpolate_weights=True,import_subrig=False,import_weights=True)
parts={'body':basemesh}
parts['eyes']=asset('eyes/low-poly/low-poly.mhclo','Eyes')
parts['eyebrows']=asset('eyebrows/eyebrow001/eyebrow001.mhclo','Eyebrows')
parts['eyelashes']=asset('eyelashes/eyelashes01/eyelashes01.mhclo','Eyelashes')
parts['hair']=asset('hair/ponytail01/ponytail01.mhclo','Hair')
parts['suit']=asset('clothes/female_sportsuit01/female_sportsuit01.mhclo','Clothes')
parts['shoes']=asset('clothes/shoes01/shoes01.mhclo','Clothes')
for name,obj in parts.items():
 if obj is None:raise RuntimeError('asset failed: '+name)
# Garments hide the body beneath them; the suit's leggings become shorts, so keep the legs.
for m in list(basemesh.modifiers):
 print('RIFT_MOD',m.name,m.type,getattr(m,'vertex_group',''))
 if m.type=='MASK' and 'sportsuit' in (m.name+getattr(m,'vertex_group','')).lower():basemesh.modifiers.remove(m)

# ---- Rest pose: limbs hang straight down, as the game's rig and animations assume ----
bpy.ops.object.select_all(action='DESELECT');game_rig.select_set(True);bpy.context.view_layer.objects.active=game_rig
bpy.ops.object.mode_set(mode='POSE')
def straighten(bone_name):
 pb=game_rig.pose.bones[bone_name];bpy.context.view_layer.update()
 head=(game_rig.matrix_world@pb.head);tail=(game_rig.matrix_world@pb.tail);direction=(tail-head).normalized()
 q=direction.rotation_difference(Vector((0,0,-1)))
 world=game_rig.matrix_world@pb.matrix;rot=q.to_matrix().to_4x4()
 pb.matrix=game_rig.matrix_world.inverted()@(Matrix.Translation(head)@rot@Matrix.Translation(-head)@world)
 bpy.context.view_layer.update()
def report_bone(tag,name):
 pb=game_rig.pose.bones[name];bpy.context.view_layer.update();h=game_rig.matrix_world@pb.head;t=game_rig.matrix_world@pb.tail;d=(t-h).normalized()
 print('RIFT_POSE',tag,name,'head',[round(c,2) for c in h],'dir',[round(c,2) for c in d])
for side in ['l','r']:
 for bone in ['thigh_'+side,'calf_'+side,'upperarm_'+side,'lowerarm_'+side]:report_bone('before',bone);straighten(bone);report_bone('after',bone)
# Combat fists: curl the fingers and tuck the thumb outside them before the bake, so the
# consolidated hand bone carries closed hands (the game never animates fingers).
import math as _m
for side in ['l','r']:
 for finger in ['index','middle','ring','pinky']:
  for seg,deg in [('01',-62),('02',-78),('03',-55)]:
   pb=game_rig.pose.bones.get(f'{finger}_{seg}_{side}')
   if pb:pb.rotation_mode='XYZ';pb.rotation_euler=(_m.radians(deg),0,0)
 for seg,deg in [('01',-20),('02',-45),('03',-35)]:
  pb=game_rig.pose.bones.get(f'thumb_{seg}_{side}')
  if pb:pb.rotation_mode='XYZ';pb.rotation_euler=(_m.radians(deg),0,0)
bpy.context.view_layer.update()
bpy.ops.object.mode_set(mode='OBJECT')
_zs=[c.z for c in evaluated_coords(basemesh)];print('RIFT_POSE body evaluated z',round(min(_zs),2),round(max(_zs),2))
rest=joints['joints']
# The JS rig must use these straightened joints; the sampler encodes them in motion-source. Verify.
for b in DATA['bones']:
 t=matrix(b['matrix']).translation
 if (Vector(rest[b['name']])-Vector((t.x,t.y,t.z))).length>1e-3:
  raise RuntimeError(f"motion-source joint {b['name']} {list(t)} differs from straightened joints {rest[b['name']]}; regenerate joints and re-sample")

# ---- Bake evaluated geometry (shape keys, mask, pose) into plain meshes ------------
floor=FLOOR
def bake(obj,name):
 depsgraph=bpy.context.evaluated_depsgraph_get();ev=obj.evaluated_get(depsgraph);src=ev.to_mesh()
 me=bpy.data.meshes.new(name);me.from_pydata([(v.co.x*scale,v.co.y*scale,(v.co.z-floor)*scale) for v in src.vertices],[],[list(p.vertices) for p in src.polygons])
 if src.uv_layers:
  uv=me.uv_layers.new(name='UVMap');s=src.uv_layers.active.data
  for i,loop in enumerate(me.loops):uv.data[i].uv=s[i].uv
 new=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(new)
 groups=[g.name for g in obj.vertex_groups]
 for g in groups:new.vertex_groups.new(name=g)
 for i,v in enumerate(src.vertices):
  for g in v.groups:
   if g.weight>1e-5:new.vertex_groups[g.group].add([i],g.weight,'REPLACE')
 ev.to_mesh_clear();me.update()
 for p in me.polygons:p.use_smooth=True
 return new
for name,obj in parts.items():
 zs=[v.co.z for v in obj.data.vertices];print('RIFT_PART',name,'verts',len(obj.data.vertices),'z',round(min(zs),2) if zs else None,round(max(zs),2) if zs else None,'mods',[m.type for m in obj.modifiers])
baked={name:bake(obj,'TalaV3_'+name) for name,obj in parts.items()}
for name,obj in baked.items():
 zs=[v.co.z for v in obj.data.vertices];print('RIFT_BAKED',name,'verts',len(obj.data.vertices),'z',round(min(zs),2) if zs else None,round(max(zs),2) if zs else None)
for obj in list(parts.values())+[game_rig]:bpy.data.objects.remove(obj,do_unlink=True)

# Shorts: cut the leggings at mid-thigh (game y), keeping the top.
suit=baked['suit'];cut_y=rest['thigh.L'][1]-(rest['thigh.L'][1]-rest['shin.L'][1])*.42
bm=bmesh.new();bm.from_mesh(suit.data);doomed=[f for f in bm.faces if all(v.co.z<cut_y for v in f.verts)];bmesh.ops.delete(bm,geom=doomed,context='FACES');bm.to_mesh(suit.data);bm.free();suit.data.update()

# ---- Consolidate MakeHuman weights into the game's 17 bones -----------------------
def consolidate(obj):
 mapping={}
 for our,src in CONSOLIDATE.items():
  if our in('root','chest','head'):
   for s in src:mapping[s]=our
  else:
   for s in src:
    for mh in ['l','r']:mapping[f'{s}_{mh}']=f'{our}.{side_of[mh]}'
 index={g.name:g.index for g in obj.vertex_groups}
 sums=[{} for _ in obj.data.vertices]
 for v in obj.data.vertices:
  for g in v.groups:
   name=obj.vertex_groups[g.group].name;target=mapping.get(name)
   if target and g.weight>1e-6:sums[v.index][target]=sums[v.index].get(target,0)+g.weight
 for g in list(obj.vertex_groups):obj.vertex_groups.remove(g)
 for name in OUR_BONES:obj.vertex_groups.new(name=name)
 unweighted=0
 for i,w in enumerate(sums):
  if not w:unweighted+=1;w={'root':1}
  top=sorted(w.items(),key=lambda kv:kv[1],reverse=True)[:4];total=sum(x for _,x in top)
  for name,x in top:obj.vertex_groups[name].add([i],x/total,'REPLACE')
 return unweighted
unweighted={name:consolidate(obj) for name,obj in baked.items()}
# Hair follows the head; the ponytail bone sways the tail. Eyes, brows and lashes follow the head only.
for name in ['eyes','eyebrows','eyelashes']:
 obj=baked[name]
 for g in list(obj.vertex_groups):obj.vertex_groups.remove(g)
 obj.vertex_groups.new(name='head').add(list(range(len(obj.data.vertices))),1.0,'REPLACE')
hair=baked['hair']
for g in list(hair.vertex_groups):hair.vertex_groups.remove(g)
head_g=hair.vertex_groups.new(name='head');tail_g=hair.vertex_groups.new(name='ponytail')
for v in hair.data.vertices:
 z=v.co.z;back=-v.co.y;tail=max(0,min(1,(rest['ponytail'][1]-z)/0.9))*(1 if back>0.1 else 0)
 if tail>0:tail_g.add([v.index],tail,'REPLACE');head_g.add([v.index],1-tail,'REPLACE')
 else:head_g.add([v.index],1.0,'REPLACE')

# ---- Materials: Principled + images; tints via pixel luminance remap ---------------
def load_image(path,size=1024):
 img=bpy.data.images.load(str(path));img.name=Path(path).stem
 if max(img.size)>size:img.scale(size,size)
 return img
def tinted(img,rgb,name,keep_alpha=True):
 w,h=img.size;px=list(img.pixels);out=bpy.data.images.new(name,w,h,alpha=True)
 for i in range(0,len(px),4):
  lum=.2126*px[i]+.7152*px[i+1]+.0722*px[i+2]
  px[i]=min(1,lum*rgb[0]*1.9);px[i+1]=min(1,lum*rgb[1]*1.9);px[i+2]=min(1,lum*rgb[2]*1.9)
 out.pixels=px
 # Opaque tints pack as JPEG; alpha tints stay PNG.
 if not keep_alpha:
  out.filepath_raw=str(Path(bpy.app.tempdir)/(name+'.jpg'));out.file_format='JPEG';bpy.context.scene.render.image_settings.quality=88;out.save()
 out.pack();return out
def jpeg(img):
 img.filepath_raw=str(Path(bpy.app.tempdir)/(img.name+'.jpg'));img.file_format='JPEG';bpy.context.scene.render.image_settings.quality=88;img.save();img.pack();return img
def material(name,image,roughness=.75,alpha=False,normal=None,double=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;nodes=m.node_tree.nodes;links=m.node_tree.links
 p=nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=roughness
 tex=nodes.new('ShaderNodeTexImage');tex.image=image;links.new(tex.outputs['Color'],p.inputs['Base Color'])
 if alpha:
  links.new(tex.outputs['Alpha'],p.inputs['Alpha']);m.blend_method='CLIP';m.alpha_threshold=.4;m.shadow_method='CLIP'
 if normal is not None:
  nt=nodes.new('ShaderNodeTexImage');nt.image=normal;normal.colorspace_settings.name='Non-Color';nm=nodes.new('ShaderNodeNormalMap');links.new(nt.outputs['Color'],nm.inputs['Color']);links.new(nm.outputs['Normal'],p.inputs['Normal'])
 m.use_backface_culling=not double
 for img in [image,normal]:
  if img is not None and not img.packed_file:img.pack()
 return m
def warm(img,rgb=(1.0,.86,.72)):
 """Warm tan skin toward the art target."""
 try:
  import numpy as np
  px=np.empty(len(img.pixels),dtype=np.float32);img.pixels.foreach_get(px);px=px.reshape(-1,4);px[:,0]*=rgb[0];px[:,1]*=rgb[1];px[:,2]*=rgb[2];np.clip(px,0,1,out=px);img.pixels.foreach_set(px.ravel())
 except Exception as e:
  print('RIFT_WARN numpy skin tint unavailable',e);px=list(img.pixels)
  for i in range(0,len(px),4):px[i]*=rgb[0];px[i+1]*=rgb[1];px[i+2]*=rgb[2]
  img.pixels=px
 return img
skin=jpeg(warm(load_image(ASSETS/'skins/young_asian_female/young_lightskinned_female_diffuse3.png',2048)))
hair_img=tinted(load_image(ASSETS/'hair/ponytail01/ponytail01_diffuse.png',1024),(.62,.26,.16),'tala_hair_auburn')
suit_src=load_image(ASSETS/'clothes/female_sportsuit01/female_sportsuit01_diffuse.png')
suit_img=tinted(suit_src,(.85,.55,.22),'tala_suit_ochre',keep_alpha=False)
suit_normal=None
mats={'body':material('skin',skin,.55),'eyes':material('eyes',load_image(ASSETS/'eyes/materials/brownlight_eye.png'),.25,alpha=True),
 'eyebrows':material('eyebrows',load_image(ASSETS/'eyebrows/eyebrow001/eyebrow001.png'),.8,alpha=True,double=True),
 'eyelashes':material('eyelashes',load_image(ASSETS/'eyelashes/eyelashes01/eyelashes01.png'),.8,alpha=True,double=True),
 'hair':material('hair',hair_img,.45,alpha=True,double=True),'suit':material('Design03_top',suit_img,.8),
 'shoes':material('sole',jpeg(load_image(ASSETS/'clothes/shoes01/shoes01_diffuse.png',512)),.6)}
for name,obj in baked.items():
 obj.data.materials.clear();obj.data.materials.append(mats[name])
# Shorts tint: recolour the leggings region of the suit texture (lower half of UV space is the trousers in this asset) toward rust.
shorts_img=tinted(suit_src,(.72,.24,.16),'tala_shorts_rust',keep_alpha=False)
w,h=suit_img.size;top_px=list(suit_img.pixels);bot_px=list(shorts_img.pixels)
suit=baked['suit'];uv=suit.data.uv_layers.active.data
# Faces below the waist use the shorts colour: mark by vertex height, then copy that UV region from the rust image.
rows=set()
for poly in suit.data.polygons:
 if all(suit.data.vertices[i].co.z<rest['thigh.L'][1]+.12 for i in poly.vertices):
  for li in poly.loop_indices:rows.add(int(uv[li].uv.y*(h-1)))
for y in rows:
 start=y*w*4;top_px[start:start+w*4]=bot_px[start:start+w*4]
suit_img.pixels=top_px;suit_img.pack()

# ---- Game skeleton from the straightened joints --------------------------------------
arm=bpy.data.armatures.new('Tala_Armature');rig=bpy.data.objects.new('Tala',arm);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for b in DATA['bones']:
 e=arm.edit_bones.new(b['name']);m=C@matrix(b['matrix']);e.head=m.translation;e.tail=e.head+Vector((0,0,.12));e.matrix=m
 if b['parent']>=0:e.parent=arm.edit_bones[DATA['bones'][b['parent']]['name']]
bpy.ops.object.mode_set(mode='OBJECT')
for obj in baked.values():
 obj.parent=rig;mod=obj.modifiers.new('Skin','ARMATURE');mod.object=rig
# ---- Clips (same baking as the Design 02 build) ----------------------------------------
scene=bpy.context.scene;scene.render.fps=60;rig.animation_data_create()
for clip in DATA['clips']:
 action=bpy.data.actions.new(clip['name']);rig.animation_data.action=action
 for f,frame in enumerate(clip['frames']):
  scene.frame_set(f)
  for b,a in zip(DATA['bones'],frame):
   pb=rig.pose.bones[b['name']];pb.rotation_mode='QUATERNION';pb.matrix=C@matrix(a);bpy.context.view_layer.update()
   for path in ['location','rotation_quaternion','scale']:pb.keyframe_insert(data_path=path,frame=f,group=b['name'])
 track=rig.animation_data.nla_tracks.new();track.name=clip['name'];track.strips.new(clip['name'],0,action);track.mute=True
rig.animation_data.action=None
for t in rig.animation_data.nla_tracks:t.mute=False
scene.frame_start=0;scene.frame_end=144;scene.frame_set(0)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'tala-v3.blend'))
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for obj in baked.values():obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(ROOT/'dist/assets/models/tala-v3.glb'),export_format='GLB',use_selection=True,export_animations=True,export_nla_strips=True,export_force_sampling=True,export_frame_range=False,export_materials='EXPORT',export_yup=True,export_image_format='AUTO')
rep={'blender':bpy.app.version_string,'bones':len(arm.bones),'parts':{n:{'vertices':len(o.data.vertices),'faces':len(o.data.polygons),'unweighted':unweighted[n]} for n,o in baked.items()},'rest_joints':rest,'scale':scale,'game_height':GAME_HEIGHT,'clips':[c['name'] for c in DATA['clips']],'source':'MakeHuman CC0 base (MPFB 2.0 alpha 3) + CC0 system assets, straightened rest pose, weights consolidated to the game skeleton'}
json.dump(rep,open(OUT/'build-report.json','w'),indent=1);print('RIFT_BUILD',json.dumps(rep))
