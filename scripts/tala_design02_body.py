"""Join shoulder volumes into one deforming upper body, keeping combat bones.
Voxel union is a blockout tool here, followed by smoothing and weight transfer;
this is not claimed as final hand-retopologized anatomy.
"""
import bpy

def connect_upper_body(ctx):
 rig=ctx['rig'];parts=[bpy.data.objects.get(n) for n in ['Torso','Arm.L','Arm.R']]
 if not all(parts):raise RuntimeError('Missing upper-body source volumes')
 bpy.ops.object.select_all(action='DESELECT')
 for obj in parts:
  for mod in list(obj.modifiers):obj.modifiers.remove(mod)
  obj.select_set(True)
 bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();source=parts[0]
 source.name='Shoulder_weight_source'
 obj=source.copy();obj.data=source.data.copy();bpy.context.collection.objects.link(obj);obj.name='Design02_upper_body'
 bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
 remesh=obj.modifiers.new('Connected shoulder volume','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.022;remesh.use_smooth_shade=True
 bpy.ops.object.modifier_apply(modifier=remesh.name)
 smooth=obj.modifiers.new('Soften anatomical junctions','SMOOTH');smooth.factor=.65;smooth.iterations=4
 bpy.ops.object.modifier_apply(modifier=smooth.name)
 decimate=obj.modifiers.new('Browser mesh budget','DECIMATE');decimate.ratio=.65
 bpy.ops.object.modifier_apply(modifier=decimate.name)
 transfer=obj.modifiers.new('Preserve authored bone weights','DATA_TRANSFER');transfer.object=source
 transfer.use_vert_data=True;transfer.data_types_verts={'VGROUP_WEIGHTS'};transfer.vert_mapping='POLYINTERP_NEAREST'
 bpy.ops.object.modifier_apply(modifier=transfer.name)
 # Blend the transferred influences across the now-connected junction instead
 # of preserving a hard chest/upper-arm boundary on the shared surface.
 adjacency=[set() for _ in obj.data.vertices]
 for edge in obj.data.edges:
  a,b=edge.vertices;adjacency[a].add(b);adjacency[b].add(a)
 weights=[{g.group:g.weight for g in v.groups if g.weight>1e-8} for v in obj.data.vertices]
 for _ in range(8):
  updated=[]
  for i,own in enumerate(weights):
   adjacent=adjacency[i];mixed={g:w*.65 for g,w in own.items()}
   for n in adjacent:
    for g,w in weights[n].items():mixed[g]=mixed.get(g,0)+w*.35/max(1,len(adjacent))
   top=sorted(mixed.items(),key=lambda item:item[1],reverse=True)[:4];total=sum(w for g,w in top)
   updated.append({g:w/total for g,w in top} if total else own)
  weights=updated
 for group in obj.vertex_groups:group.remove(list(range(len(obj.data.vertices))))
 for i,weight in enumerate(weights):
  if not weight:raise RuntimeError('Unweighted upper-body vertex')
  for g,w in weight.items():obj.vertex_groups[g].add([i],w,'REPLACE')
 for poly in obj.data.polygons:poly.use_smooth=True
 skin=obj.modifiers.new('Skin','ARMATURE');skin.object=rig;obj.parent=rig
 bpy.data.objects.remove(source,do_unlink=True)
 return obj
