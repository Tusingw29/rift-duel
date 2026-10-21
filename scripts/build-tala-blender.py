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
colors={'skin':'c9926f','ochre':'c99132','lining':'b9a58a','top':'272c35','rust':'944738','wrap':'e7ddc3','hair':'793628','hairlight':'a84c2c','sole':'302d2d','crease':'68392f'}
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
loft('Torso', [R(0,1.37,0,.23,.15,'root'),R(0,1.43,0,.213,.14,B('root','chest',.5)),R(0,1.60,0,.238,.15,'chest'),R(0,1.72,0,.29,.175,'chest'),R(0,1.88,0,.325,.18,'chest'),R(0,2.01,0,.35,.13,'chest'),R(0,2.10,0,.10,.09,'chest')],'skin',20)
loft('Athletic_top',[R(0,1.65,.003,.269,.17,'chest'),R(0,1.74,.005,.302,.185,'chest'),R(0,1.89,0,.33,.186,'chest'),R(0,1.98,0,.31,.135,'chest')],'top',20)
# Tailored vest: broad back and separate front panels leave real shoulder armholes.
loft('Vest_back',[R(0,1.67,-.018,.285,.205,'chest'),R(0,1.79,-.018,.325,.215,'chest'),R(0,1.91,-.018,.355,.205,'chest'),R(0,2.045,-.01,.31,.15,'chest')],'ochre',20,start=math.pi,end=math.tau,caps=False)
for side in [-1,1]:
 verts=[(side*.10,1.67,.184),(side*.28,1.67,.107),(side*.32,1.80,.125),(side*.26,1.94,.155),(side*.28,2.045,.075),(side*.13,2.07,.12),(side*.12,1.91,.205)]
 faces=[(0,1,2,6),(6,2,3),(6,3,4,5)]
 if side<0:faces=[tuple(reversed(f)) for f in faces]
 panel=mesh('Vest_front',verts,faces,[W('chest')]*7,'ochre')
 solid=panel.modifiers.new('Cloth thickness','SOLIDIFY');solid.thickness=.009
 bpy.context.view_layer.objects.active=panel;bpy.ops.object.modifier_apply(modifier=solid.name)
 verts=[(side*.095,2.13,.065),(side*.165,2.10,.108),(side*.14,1.94,.215),(side*.09,1.98,.19)]
 mesh('Standing_collar',verts,[tuple(range(4)) if side>0 else (3,2,1,0)],[W('chest')]*4,'ochre')
loft('Neck',[R(0,2.05,0,.095,.088,'chest'),R(0,2.20,0,.09,.085,B('chest','head',.8)),R(0,2.28,0,.10,.09,'head')],'skin')
loft('Head',[R(0,2.22,.018,.045,.065,'head'),R(0,2.29,.012,.13,.14,'head'),R(0,2.41,0,.193,.174,'head'),R(0,2.55,-.015,.198,.177,'head'),R(0,2.68,-.025,.145,.137,'head'),R(0,2.72,-.025,.03,.03,'head')],'skin',24)
# Small modeled ears and nose give the painted face a readable side profile.
for side in [-1,1]:
 loft('Ear',[R(side*.185,2.36,-.005,.025,.027,'head'),R(side*.203,2.415,-.005,.032,.038,'head'),R(side*.193,2.475,-.008,.023,.03,'head')],'skin',10)
mesh('Nose',[(0,2.49,.183),(-.022,2.397,.181),(0,2.391,.218),(.022,2.397,.181),(0,2.377,.183)],[(0,1,2),(0,2,3),(1,4,2),(2,4,3)],[W('head')]*5,'skin')
loft('Shorts_waist',[R(0,1.21,0,.22,.163,'root'),R(0,1.35,0,.258,.164,'root'),R(0,1.40,0,.24,.155,'root')],'rust',20)
loft('Waistband',[R(0,1.36,0,.26,.17,'root'),R(0,1.40,0,.245,.161,'root')],'lining',20)
for side,suffix in [(-1,'L'),(1,'R')]:
 a='upper_arm.'+suffix;e='forearm.'+suffix;h='hand.'+suffix;l='thigh.'+suffix;k='shin.'+suffix;x=side*.43;lx=side*.20
 loft('Arm.'+suffix,[R(side*.36,2.075,0,.085,.085,B('chest',a,.7)),R(side*.415,2.025,0,.125,.12,a),R(x,1.94,0,.122,.123,a),R(x,1.82,.005,.103,.105,a),R(x,1.68,0,.080,.085,B(a,e,.15)),R(x,1.59,0,.078,.08,B(a,e,.5)),R(x,1.51,0,.088,.09,B(a,e,.88)),R(x,1.36,0,.087,.085,e),R(x,1.22,0,.063,.07,h)],'skin',16)
 loft('Hand.'+suffix,[R(x,1.23,0,.066,.068,h),R(x,1.16,.018,.088,.076,h),R(x,1.08,.027,.089,.077,h),R(x,1.045,.025,.045,.045,h)],'wrap',12)
 loft('Thumb.'+suffix,[R(x-side*.077,1.18,.06,.033,.035,h),R(x-side*.08,1.10,.07,.027,.03,h)],'wrap',10)
 # A continuous wrap surface avoids the old stack-of-washers silhouette.
 loft('Wrist_wrap.'+suffix,[R(x,1.21,0,.071,.074,h),R(x,1.30,0,.084,.086,e),R(x,1.40,0,.094,.094,e),R(x,1.46,0,.094,.096,e)],'wrap',16)
 for j in range(7):
  y=1.225+j*.032;rad=.074+(y-1.225)*.095
  loft('Wrap_stitch',[R(x,y,0,rad+.002,rad+.002,e),R(x,y+.004,0,rad+.002,rad+.002,e)],'lining',16)
 loft('Leg.'+suffix,[R(lx,1.055,0,.15,.15,l),R(lx,.96,0,.145,.145,l),R(lx,.79,0,.111,.12,B(l,k,.1)),R(lx,.70,0,.094,.105,B(l,k,.5)),R(lx,.62,0,.104,.10,B(l,k,.85)),R(lx,.45,-.005,.107,.102,k),R(lx,.26,0,.073,.075,k),R(lx,.14,0,.068,.07,k)],'skin',16)
 loft('Shorts_leg.'+suffix,[R(side*.143,1.355,0,.143,.171,'root'),R(side*.176,1.24,0,.177,.183,B('root',l,.35)),R(lx,1.12,0,.183,.18,B('root',l,.8)),R(lx,1.025,.008,.177,.174,l)],'rust',16)
 loft('Shin_wrap.'+suffix,[R(lx,.17,0,.077,.08,k),R(lx,.27,0,.083,.087,k),R(lx,.40,-.005,.111,.108,k),R(lx,.51,-.005,.116,.111,k)],'wrap',16)
 # Short, tapered cloth folds follow the same weights as the shorts.
 verts=[(lx-side*.105,1.25,.149),(lx+side*.09,1.17,.162),(lx-side*.055,1.225,.173),
        (lx+side*.11,1.08,.139),(lx-side*.06,1.13,.172),(lx+side*.065,1.095,.161)]
 mesh('Shorts_folds',verts,[(0,1,2),(3,4,5)],[B('root',l,.6)]*3+[W(l)]*3,'crease')
 for j in range(10):
  y=.18+j*.031;rad=.078+min(y-.18,.23)*.15
  loft('Shin_seam',[R(lx,y,-.003,rad+.001,rad+.001,k),R(lx,y+.003,-.003,rad+.001,rad+.001,k)],'lining',16)
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
# Several swept, flattened locks produce the concept's wide fan and split tips.
for i in range(5):
 offset=(i-2)*.055
 loft('Ponytail_lock',[
  R(offset*.35,2.75,-.19,.065,.075,'ponytail'),
  R(offset*.8,2.80-abs(i-2)*.018,-.34,.105,.065,'ponytail'),
  R(offset*1.2+.035,2.59,-.54,.105,.055,'ponytail'),
  R(offset*1.7+.075,2.29,-.65,.08,.04,'ponytail'),
  R(offset*2.5+.11,2.00+abs(i-2)*.06,-.62,.047,.025,'ponytail'),
  R(offset*3.2+.15,1.77+abs(i-2)*.09,-.48,.002,.004,'ponytail')], 'hair',10)
loft('Hair_tie',[R(0,2.70,-.20,.103,.105,'ponytail'),R(0,2.74,-.20,.104,.105,'ponytail')],'ochre',12)
# Reuse the project's original painted face; curved, UV-mapped and packed in the GLB.
m=bpy.data.materials.new('Painted_face');m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(ROOT/'dist/assets/tala-face.png'));tex.image.pack();m.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color']);m.node_tree.links.new(tex.outputs['Alpha'],p.inputs['Alpha']);p.inputs['Roughness'].default_value=1
if hasattr(m,'surface_render_method'):m.surface_render_method='DITHERED'
else:m.blend_method='CLIP'
m.use_backface_culling=True
verts=[];uv=[];faces=[]
profile=[(2.225,.05,.075,.018),(2.29,.13,.14,.012),(2.41,.193,.174,0),(2.55,.198,.177,-.015),(2.67,.15,.14,-.025)]
for j in range(13):
 v=j/12;y=2.225+v*.445
 low,high=next((a,b) for a,b in zip(profile,profile[1:]) if a[0]-1e-6<=y<=b[0]+1e-6)
 t=(y-low[0])/(high[0]-low[0]);rx,rz,cz=[low[k]+(high[k]-low[k])*t for k in (1,2,3)]
 wid=rx*.96
 for i in range(17):
  u=i/16;x=(u*2-1)*wid;z=cz+rz*math.sqrt(max(0,1-(x/rx)**2))+.004;verts.append((x,y,z));uv.append((.5+x/.4,v))
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
