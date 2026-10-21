"""Build editable Tala concept-A study and GLB. Run with Blender --background.
Coordinates in surface definitions match the game's X/right Y/up Z/forward rig.
The existing authored motion is baked as editable keys, not claimed as new animation.
"""
import bpy,json,math
from pathlib import Path
from mathutils import Matrix,Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'art/blender/tala'; DATA=json.loads((OUT/'motion-source.json').read_text())
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
C=Matrix.Rotation(math.pi/2,4,'X')
def matrix(a):return Matrix([a[i::4] for i in range(4)])
def point(p):return C@Vector(p)
arm=bpy.data.armatures.new('Tala_Armature');rig=bpy.data.objects.new('Tala',arm);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for b in DATA['bones']:
 e=arm.edit_bones.new(b['name']);m=C@matrix(b['matrix']);e.head=m.translation;e.tail=e.head+Vector((0,0,.12));e.matrix=m
 if b['parent']>=0:e.parent=arm.edit_bones[DATA['bones'][b['parent']]['name']]
bpy.ops.object.mode_set(mode='OBJECT')
colors={'skin':'c9926f','ochre':'c99132','lining':'7b4c24','top':'272c35','rust':'944738','wrap':'e7ddc3','hair':'793628','hairlight':'a84c2c','sole':'302d2d'}
mats={}
for name,h in colors.items():
 m=bpy.data.materials.new(name);m.diffuse_color=tuple(((int(h[i:i+2],16)/255+.055)/1.055)**2.4 for i in (0,2,4))+(1,);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=m.diffuse_color;p.inputs['Roughness'].default_value=.92;mats[name]=m
objects=[]
def mesh(name,verts,faces,weights,mat,uv=None):
 me=bpy.data.meshes.new(name);me.from_pydata([point(p) for p in verts],[],faces);me.update();o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o);o.data.materials.append(mats[mat] if isinstance(mat,str) else mat)
 for bone in {b for w in weights for b in w}:
  g=o.vertex_groups.new(name=bone)
  for i,w in enumerate(weights):
   if w.get(bone,0)>0:g.add([i],w[bone],'REPLACE')
 o.parent=rig;mod=o.modifiers.new('Skin','ARMATURE');mod.object=rig
 if uv:
  layer=me.uv_layers.new(name='UVMap')
  for poly in me.polygons:
   for idx in poly.loop_indices:layer.data[idx].uv=uv[me.loops[idx].vertex_index]
 for p in me.polygons:p.use_smooth=True
 objects.append(o);return o
# Each loft ring: x,y,z,width,depth,weight-map. Open sectors form genuine vest panels.
def loft(name,rings,mat,n=12,start=0,end=math.tau,caps=True):
 v=[];w=[];faces=[];uv=[]
 for j,(x,y,z,rx,rz,bind) in enumerate(rings):
  for i in range(n+1):
   a=start+(end-start)*i/n;v.append((x+math.cos(a)*rx,y,z+math.sin(a)*rz));w.append(bind);uv.append((i/n,j/max(1,len(rings)-1)))
 for j in range(len(rings)-1):
  for i in range(n):
   a=j*(n+1)+i;b=a+n+1;faces.append((a,a+1,b+1,b))
 if caps and end-start>6:
  faces.extend([tuple(range(n,-1,-1)),tuple((len(rings)-1)*(n+1)+i for i in range(n+1))])
 if rings[-1][1]>rings[0][1]:faces=[tuple(reversed(f)) for f in faces]
 return mesh(name,v,faces,w,mat,uv)
def W(b):return {b:1}
def B(a,b,t):return {a:1-t,b:t}
def R(x,y,z,rx,rz,b):return [x,y,z,rx,rz,W(b) if isinstance(b,str) else b]
loft('Torso', [R(0,1.27,0,.235,.155,'root'),R(0,1.43,0,.213,.14,B('root','chest',.5)),R(0,1.60,0,.238,.15,'chest'),R(0,1.72,0,.29,.175,'chest'),R(0,1.88,0,.325,.18,'chest'),R(0,2.01,0,.35,.13,'chest'),R(0,2.10,0,.10,.09,'chest')],'skin',20)
loft('Athletic_top',[R(0,1.65,.003,.269,.17,'chest'),R(0,1.74,.005,.302,.185,'chest'),R(0,1.89,0,.33,.186,'chest'),R(0,1.98,0,.31,.135,'chest')],'top',20)
# Open ochre vest: front opening is an angular sector around +Z, with shaped shoulder line.
loft('Open_vest',[R(0,1.68,0,.285,.185,'chest'),R(0,1.78,0,.322,.20,'chest'),R(0,1.95,0,.365,.16,'chest'),R(0,2.06,-.015,.35,.125,'chest')],'ochre',24,start=2.0,end=7.42,caps=False)
for side in [-1,1]:
 verts=[(side*.11,2.16,.09),(side*.23,2.06,.14),(side*.135,1.83,.202),(side*.075,1.95,.16)]
 mesh('Folded_lapel',verts,[(0,1,2,3)],[W('chest')]*4,'ochre')
loft('Neck',[R(0,2.05,0,.095,.088,'chest'),R(0,2.20,0,.09,.085,B('chest','head',.8)),R(0,2.28,0,.10,.09,'head')],'skin')
loft('Head',[R(0,2.22,.018,.045,.065,'head'),R(0,2.29,.012,.13,.14,'head'),R(0,2.41,0,.193,.174,'head'),R(0,2.55,-.015,.198,.177,'head'),R(0,2.68,-.025,.145,.137,'head'),R(0,2.72,-.025,.03,.03,'head')],'skin',24)
loft('Shorts_waist',[R(0,1.17,0,.275,.174,'root'),R(0,1.35,0,.258,.164,'root'),R(0,1.40,0,.24,.155,'root')],'rust',20)
loft('Waistband',[R(0,1.36,0,.26,.17,'root'),R(0,1.40,0,.245,.161,'root')],'lining',20)
for side,suffix in [(-1,'L'),(1,'R')]:
 a='upper_arm.'+suffix;e='forearm.'+suffix;h='hand.'+suffix;l='thigh.'+suffix;k='shin.'+suffix;x=side*.43;lx=side*.20
 loft('Arm.'+suffix,[R(side*.32,2.055,0,.06,.075,B('chest',a,.6)),R(x,2.01,0,.106,.109,a),R(x,1.85,0,.105,.104,a),R(x,1.68,0,.080,.085,B(a,e,.15)),R(x,1.59,0,.078,.08,B(a,e,.5)),R(x,1.51,0,.088,.09,B(a,e,.88)),R(x,1.36,0,.087,.085,e),R(x,1.22,0,.063,.07,h)],'skin',16)
 loft('Hand.'+suffix,[R(x,1.23,0,.066,.068,h),R(x,1.16,.018,.088,.076,h),R(x,1.08,.027,.089,.077,h),R(x,1.045,.025,.045,.045,h)],'wrap',12)
 loft('Thumb.'+suffix,[R(x-side*.077,1.18,.06,.033,.035,h),R(x-side*.08,1.10,.07,.027,.03,h)],'wrap',10)
 for j in range(8):
  y=1.245+j*.026;rad=.074+(y-1.245)*.16
  loft('Wrist_binding',[R(x,y,0,rad,rad,e),R(x,y+.018,0,rad+.003,rad+.003,e)],'wrap',12)
 loft('Leg.'+suffix,[R(lx,1.29,0,.15,.155,B('root',l,.6)),R(lx,1.15,0,.158,.16,l),R(lx,.96,0,.145,.145,l),R(lx,.79,0,.111,.12,B(l,k,.1)),R(lx,.70,0,.094,.105,B(l,k,.5)),R(lx,.62,0,.104,.10,B(l,k,.85)),R(lx,.45,-.005,.107,.102,k),R(lx,.26,0,.073,.075,k),R(lx,.14,0,.068,.07,k)],'skin',16)
 loft('Shorts_leg.'+suffix,[R(lx,1.36,0,.17,.17,'root'),R(lx,1.18,0,.178,.179,B('root',l,.5)),R(lx,1.03,.008,.168,.17,l)],'rust',16)
 for j in range(10):
  y=.18+j*.027;rad=.078+(y-.18)*.10
  loft('Shin_binding',[R(lx,y,0,rad,rad,k),R(lx,y+.024,0,rad+.002,rad+.002,k)],'wrap',12)
 foot='foot.'+suffix
 loft('Shoe.'+suffix,[R(lx,.17,.015,.087,.10,foot),R(lx,.10,.085,.105,.18,foot),R(lx,.035,.085,.11,.18,foot)],'sole',16)
 loft('Shoe_trim.'+suffix,[R(lx,.031,.085,.113,.182,foot),R(lx,.052,.085,.113,.182,foot)],'ochre',16)
# Hair cap plus broad tapered locks, no cone spikes for every strand.
loft('Hair_cap',[R(0,2.52,-.055,.205,.17,'head'),R(0,2.66,-.04,.207,.175,'head'),R(0,2.76,-.06,.14,.13,'head'),R(0,2.79,-.06,.025,.03,'head')],'hair',20)
loft('Back_hair',[R(0,2.30,-.02,.13,.15,'head'),R(0,2.46,-.03,.202,.184,'head'),R(0,2.65,-.04,.207,.18,'head')],'hair',16,start=math.pi,end=math.tau,caps=False)
for i in range(-2,3):
 x=i*.067
 verts=[(x-.085,2.73,.10),(x+.035,2.73,.10),(x-.055,2.63,.185),(x+.055,2.64,.185),(x+.065,2.52+abs(i)*.018,.18),(x-.012,2.69,.205),(x,2.65,.12)]
 mesh('Angular_fringe',verts,[(0,2,5),(0,5,1),(1,5,3),(2,4,5),(5,4,3),(0,1,6),(1,3,6),(3,4,6),(4,2,6),(2,0,6)],[W('head')]*7,'hairlight' if i%2 else 'hair')
for s in [-1,1]:loft('Side_lock',[R(s*.17,2.66,-.01,.065,.09,'head'),R(s*.20,2.46,-.04,.05,.065,'head'),R(s*.19,2.29,-.06,.004,.008,'head')],'hair',8)
loft('Ponytail',[R(0,2.72,-.18,.10,.10,'ponytail'),R(0,2.66,-.33,.155,.12,'ponytail'),R(.04,2.39,-.45,.17,.11,'ponytail'),R(.09,2.13,-.47,.12,.08,'ponytail'),R(.16,1.91,-.39,.065,.05,'ponytail'),R(.20,1.78,-.31,.003,.006,'ponytail')],'hair',12)
loft('Hair_tie',[R(0,2.70,-.20,.103,.105,'ponytail'),R(0,2.74,-.20,.104,.105,'ponytail')],'ochre',12)
# Reuse the project's original painted face; curved, UV-mapped and packed in the GLB.
m=bpy.data.materials.new('Painted_face');m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(ROOT/'dist/assets/tala-face.png'));tex.image.pack();m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color']);m.node_tree.links.new(tex.outputs['Alpha'],p.inputs['Alpha']);p.inputs['Roughness'].default_value=1
if hasattr(m,'surface_render_method'):m.surface_render_method='DITHERED'
else:m.blend_method='CLIP'
m.use_backface_culling=True
verts=[];uv=[];faces=[]
for j in range(13):
 v=j/12;y=2.225+v*.445;wid=.195*math.sin(math.pi*(.12+.8*v))
 for i in range(17):
  u=i/16;x=(u*2-1)*wid;z=.18*math.sqrt(max(0,1-(x/.203)**2))+.009;verts.append((x,y,z));uv.append((.5+x/.4,v))
  if j<12 and i<16:a=j*17+i;faces.append((a,a+1,a+18,a+17))
mesh('Painted_face',verts,faces,[W('head')]*len(verts),m,uv)
# Merge by material to keep the exported asset inexpensive to draw.
bpy.ops.object.select_all(action='DESELECT')
for material in list(mats.values()):
 group=[o for o in list(bpy.context.scene.objects) if o.type=='MESH' and o.data.materials[0]==material]
 if not group:continue
 for o in group:o.select_set(True)
 bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True);bpy.context.view_layer.objects.active=rig
# Bake world transforms into local editable quaternion keys at the real 60Hz timing.
scene=bpy.context.scene;scene.render.fps=60;rig.animation_data_create()
for clip in DATA['clips']:
 action=bpy.data.actions.new(clip['name']);rig.animation_data.action=action
 for f,frame in enumerate(clip['frames']):
  scene.frame_set(f)
  for b,a in zip(DATA['bones'],frame):
   pb=rig.pose.bones[b['name']];pb.rotation_mode='QUATERNION';pb.matrix=C@matrix(a)
   bpy.context.view_layer.update()
   for path in ['location','rotation_quaternion','scale']:pb.keyframe_insert(data_path=path,frame=f,group=b['name'])
 track=rig.animation_data.nla_tracks.new();track.name=clip['name'];track.strips.new(clip['name'],0,action);track.mute=True
rig.animation_data.action=None
for t in rig.animation_data.nla_tracks:t.mute=False
scene.frame_start=0;scene.frame_end=144;scene.frame_set(0)
# Save editable source with actions and packed original face; no external texture dependency.
for track in rig.animation_data.nla_tracks:track.mute=track.name!='Idle'
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'tala-study.blend'))
for track in rig.animation_data.nla_tracks:track.mute=False
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(ROOT/'dist/assets/models/tala-study.glb'),export_format='GLB',use_selection=True,export_animations=True,**({"export_animation_mode":"NLA_TRACKS"} if bpy.app.version>=(4,0,0) else {"export_nla_strips":True}),export_force_sampling=True,export_frame_range=False,export_materials='EXPORT',export_yup=True)
report={'blender':bpy.app.version_string,'bones':len(arm.bones),'meshes':len([o for o in scene.objects if o.type=='MESH']),'vertices':sum(len(o.data.vertices) for o in scene.objects if o.type=='MESH'),'clips':[c['name'] for c in DATA['clips']],'combo_contact_seconds':[5/60,25/60,45/60],'source':DATA['source']}
(OUT/'build-report.json').write_text(json.dumps(report,indent=2));print('RIFT_BUILD',json.dumps(report))
