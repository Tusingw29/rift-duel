"""Refine the committed anatomical source without changing its skeleton or clips.
Cloud Blender 3.6.22. All additions inherit body weights or the existing head bone.
"""
import bpy,bmesh,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'art/blender/tala-v3-refined';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'art/blender/tala-v3/tala-v3.blend'))
rig=bpy.data.objects['Tala'];rig.animation_data_clear()
for bone in rig.pose.bones:bone.matrix_basis.identity()
bpy.context.view_layer.update()
body=bpy.data.objects['TalaV3_body'];suit=bpy.data.objects['TalaV3_suit']
def mat(name,color,rough=.8):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;return m
cloth=mat('Tala_charcoal_top',(.032,.039,.051));rust=mat('Tala_rust_shorts',(.30,.075,.038));ochre=mat('Tala_ochre_vest',(.53,.255,.055));trim=mat('Tala_hem_binding',(.28,.11,.025));wrap=mat('Tala_ivory_wraps',(.72,.68,.55));hair=mat('Tala_auburn_fringe',(.20,.047,.018),.48)
# Small packed weave and wrap-band maps carry surface detail without noisy stock logos.
def fabric(m,color,bands=False):
 import numpy as np
 n=512;v,u=np.mgrid[0:n,0:n]/n
 grain=.96+.025*np.sin(u*math.pi*256)*np.sin(v*math.pi*256)
 if bands:grain*=.87+.13*np.minimum(1,(v*12%1)*10)
 else:grain*=.98+.02*np.cos(v*math.pi*48)
 px=np.ones((n,n,4),dtype=np.float32)
 for k,c in enumerate(color):px[:,:,k]=c*grain
 image=bpy.data.images.new(m.name+'_paint',n,n);image.pixels.foreach_set(px.ravel());image.pack()
 tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;m.node_tree.links.new(tex.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
for m,c,b in [(cloth,(.10,.12,.15),False),(rust,(.56,.25,.17),False),(ochre,(.78,.52,.19),False),(wrap,(.88,.84,.72),True)]:fabric(m,c,b)
def subset(source,name,keep,material,offset=0,face_keep=None):
 obj=source.copy();obj.data=source.data.copy();obj.name=name;bpy.context.collection.objects.link(obj)
 bm=bmesh.new();bm.from_mesh(obj.data)
 bmesh.ops.delete(bm,geom=[f for f in bm.faces if not (face_keep(f) if face_keep else keep(f.calc_center_median()))],context='FACES');bm.to_mesh(obj.data);bm.free()
 obj.data.update()
 for v in obj.data.vertices:v.co+=v.normal*offset
 obj.data.materials.clear();obj.data.materials.append(material)
 for p in obj.data.polygons:p.material_index=0;p.use_smooth=True
 return obj
# Replace the stock print completely; the shirt and shorts stay on their fitted topology.
suit.data.materials.clear();suit.data.materials.append(cloth);suit.data.materials.append(rust)
for p in suit.data.polygons:p.material_index=1 if p.center.z<1.76 else 0
# Remove sleeve shells from the top to expose shoulders and create vest armholes.
bm=bmesh.new();bm.from_mesh(suit.data)
bmesh.ops.delete(bm,geom=[f for f in bm.faces if f.calc_center_median().z>1.85 and abs(f.calc_center_median().x)>.275],context='FACES');bm.to_mesh(suit.data);bm.free();suit.data.update()
# Cut the shorts at a clean plane rather than leaving knee-length leggings.
bm=bmesh.new();bm.from_mesh(suit.data)
bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.00001,plane_co=(0,0,1.28),plane_no=(0,0,1),clear_inner=True)
bm.to_mesh(suit.data);bm.free();suit.data.update()
def smooth_edges(obj):
 bm=bmesh.new();bm.from_mesh(obj.data)
 for _ in range(5):
  changes={}
  for v in bm.verts:
   neighbors=[e.other_vert(v) for e in v.link_edges if e.is_boundary]
   if len(neighbors)==2:changes[v]=v.co.lerp((neighbors[0].co+neighbors[1].co)*.5,.55)
  for v,co in changes.items():v.co=co
 bm.to_mesh(obj.data);bm.free();obj.data.update()
smooth_edges(suit)
for v in suit.data.vertices:v.co+=v.normal*.009
vest=subset(suit,'Tala_tailored_vest',lambda c:c.z>1.94 and not(c.y<-.035 and abs(c.x)<.085),ochre,.010)
smooth_edges(vest)
solid=vest.modifiers.new('Sewn hem thickness','SOLIDIFY');solid.thickness=.009;solid.offset=0
# Fitted wraps follow original arm and shin skin weights rather than rigid cylinders.
arm_groups={g.index for g in body.vertex_groups if g.name in ['forearm.L','forearm.R']}
wrap_indices={v.index for v in body.data.vertices if ((1.53<v.co.z<1.86 and sum(g.weight for g in v.groups if g.group in arm_groups)>.50) or .22<v.co.z<.69)}
wraps=subset(body,'Tala_fitted_wraps',lambda c:True,wrap,.007,lambda f:sum(v.index in wrap_indices for v in f.verts)>=len(f.verts)*.75)
smooth_edges(wraps)
uv=wraps.data.uv_layers.active or wraps.data.uv_layers.new(name='UVMap')
for p in wraps.data.polygons:
 for li in p.loop_indices:
  co=wraps.data.vertices[wraps.data.loops[li].vertex_index].co
  uv.data[li].uv=(co.x*3,co.z*2)
# Repaint shoe uppers and the attached sock geometry as dark martial footwear and wraps.
shoes=bpy.data.objects['TalaV3_shoes'];shoe_mat=mat('Tala_charcoal_shoes',(.035,.039,.046),.68);sole_mat=mat('Tala_rubber_sole',(.12,.075,.035),.85)
shoes.data.materials.clear()
for m in [shoe_mat,wrap,sole_mat]:shoes.data.materials.append(m)
for p in shoes.data.polygons:p.material_index=1 if p.center.z>.19 else 2 if p.center.z<.04 else 0
uv=shoes.data.uv_layers.active
for p in shoes.data.polygons:
 if p.material_index==1:
  for li in p.loop_indices:
   co=shoes.data.vertices[shoes.data.loops[li].vertex_index].co;uv.data[li].uv=(co.x*3,co.z*2)
# Authored collar and swept fringe; all points are in the source's Blender Z-up coordinates.
def mesh(name,verts,faces,material,bone='head'):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();obj=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(obj);obj.parent=rig;obj.data.materials.append(material)
 obj.vertex_groups.new(name=bone).add(list(range(len(verts))),1,'REPLACE');mod=obj.modifiers.new('Skin','ARMATURE');mod.object=rig
 for p in me.polygons:p.use_smooth=True
 return obj
# Open standing collar, kept below the jaw and split at the front.
verts=[];faces=[];steps=40
for j in range(2):
 for i in range(steps+1):
  a=.60+(2*math.pi-1.20)*i/steps
  verts.append((math.sin(a)*(.137+j*.009),-.045-math.cos(a)*(.105+j*.008),2.47+j*.075))
for i in range(steps):faces.append((i,i+1,i+steps+2,i+steps+1))
collar=mesh('Tala_standing_collar',verts,faces,ochre,'chest');s=collar.modifiers.new('Collar thickness','SOLIDIFY');s.thickness=.008
# Closed tapered curved hair clumps. Broad masses read at the fight camera.
for i in range(7):
 x=-.13+i*.041;verts=[];faces=[];rows=16;cols=8
 for j in range(rows+1):
  t=j/rows;cx=x*(1-.22*t)+.07*t;cy=-.10-.153*math.sin(t*math.pi*.65);cz=2.89-abs(x)*.25-(.20+(.035 if i in [1,4] else 0))*t
  radius=(.019 if i in [0,6] else .026)*(.025+math.sin(math.pi*t)**.65)
  for k in range(cols):
   a=2*math.pi*k/cols;verts.append((cx+math.cos(a)*radius,cy+math.sin(a)*radius*.38,cz))
 for j in range(rows):
  for k in range(cols):a=j*cols+k;b=j*cols+(k+1)%cols;faces.append((a,b,b+cols,a+cols))
 mesh('Tala_swept_fringe_%02d'%i,verts,faces,hair)
# Save the dressed source, then retain original animation actions for export.
for obj in list(bpy.data.objects):
 if obj.type not in ['MESH','ARMATURE'] or (obj.type=='MESH' and obj.parent!=rig):bpy.data.objects.remove(obj,do_unlink=True)
rig.animation_data_create()
for name in ['Idle','Advance','Retreat','Circle','Guard','Combo','Recoil']:
 action=bpy.data.actions.get(name)
 if action:
  tr=rig.animation_data.nla_tracks.new();tr.name=name;tr.strips.new(name,0,action)
scene=bpy.context.scene;scene.frame_set(0)
bpy.context.preferences.filepaths.save_version=0;bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'tala-refined.blend'))
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for obj in bpy.data.objects:
 if obj.type=='MESH' and obj.parent==rig:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'tala-refined.glb'),export_format='GLB',use_selection=True,export_animations=True,export_nla_strips=True,export_force_sampling=True,export_frame_range=False,export_materials='EXPORT',export_yup=True,export_image_format='AUTO')
report={o.name:{'vertices':len(o.data.vertices),'bounds':[[min(v.co[k] for v in o.data.vertices),max(v.co[k] for v in o.data.vertices)] for k in range(3)]} for o in bpy.data.objects if o.type=='MESH' and len(o.data.vertices)}
(OUT/'build-report.json').write_text(json.dumps(report,indent=2))
# Plain neutral renders, no effects. Runtime guard and combo remain browser-reviewed.
rig.animation_data_clear()
for b in rig.pose.bones:b.matrix_basis.identity()
scene.render.engine='CYCLES';scene.cycles.samples=12;scene.render.resolution_x=720;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.world.color=(.20,.20,.20);scene.view_settings.view_transform='Standard';scene.view_settings.look='Medium High Contrast'
target=Vector((0,0,1.5))
for name,loc,power in [('Key',(-3,-4,5),350),('Fill',(3,-2,3),180)]:
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=4;obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Review');obj=bpy.data.objects.new('Review',cam);scene.collection.objects.link(obj);scene.camera=obj;cam.type='ORTHO';cam.ortho_scale=3.3
for label,loc in [('front',(0,-5,1.5)),('side',(5,-.5,1.5)),('back',(0,5,1.5))]:
 obj.location=loc;obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(OUT/(label+'.png'));bpy.ops.render.render(write_still=True)
