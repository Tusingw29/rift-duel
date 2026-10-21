"""Compact closed fighting fists for the Design 02 study.
The game currently has one hand bone per side: these are closed-fist sculpts,
not articulated fingers or a claim of finished hand topology.
"""
import bpy, math
from mathutils import Vector

def build_hands(ctx):
 mesh=ctx['mesh'];loft=ctx['loft'];R=ctx['R'];rig=ctx['rig']
 for obj in list(bpy.data.objects):
  if obj.name.startswith(('Palm.','Curled_finger.','Finger_wrap_crease','Opposing_thumb.')):
   bpy.data.objects.remove(obj,do_unlink=True)
 for side,suffix in [(-1,'L'),(1,'R')]:
  x=side*.43;bone='hand.'+suffix;parts=[]
  parts.append(loft('Fist_palm.'+suffix,[R(x,1.235,0,.060,.060,bone),R(x,1.20,.006,.065,.062,bone),R(x,1.15,.010,.073,.063,bone),R(x,1.10,.010,.072,.060,bone),R(x,1.073,.010,.060,.048,bone)],'wrap',24))
  def tube(name,points,radii):
   v=[];f=[];w=[];n=12
   for j,p in enumerate(points):
    center=Vector(p);tangent=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(j-1,0)])
    tangent.normalize();axis=Vector((1,0,0));axis-=tangent*axis.dot(tangent);axis.normalize();other=tangent.cross(axis)
    for k in range(n):
     a=k*math.tau/n;q=center+radii[j]*(math.cos(a)*axis+math.sin(a)*other)
     v.append(tuple(q));w.append({bone:1})
   for j in range(len(points)-1):
    for k in range(n):
     a=j*n+k;b=j*n+(k+1)%n;f.append((a,b,b+n,a+n))
   f.extend([tuple(range(n-1,-1,-1)),tuple((len(points)-1)*n+i for i in range(n))])
   parts.append(mesh(name,v,f,w,'wrap'))
  # Finger backs form a staggered knuckle line; tips curl into the palm.
  for finger in range(4):
   fx=x+side*(finger-1.5)*.033;shorten=[0,.004,.010,.021][finger]
   points=[];radii=[]
   for j in range(13):
    t=j/12;angle=math.pi*t
    points.append((fx,1.115+shorten-.047*math.sin(angle),.018+.054*math.cos(angle)))
    radii.append(.020-.005*t)
   tube('Fist_finger.'+suffix,points,radii)
  # The thumb crosses outside the curled fingers, below the knuckle row.
  points=[];radii=[]
  control=[(x-side*.065,1.19,.036),(x-side*.079,1.16,.064),(x-side*.063,1.135,.085),(x-side*.032,1.12,.087),(x-side*.005,1.118,.078)]
  for j in range(len(control)-1):
   for k in range(4):
    t=k/4;points.append(tuple(a+(b-a)*t for a,b in zip(control[j],control[j+1])));radii.append(.023-.007*(j+t)/4)
  points.append(control[-1]);radii.append(.015)
  tube('Fist_thumb.'+suffix,points,radii)
  # Fuse overlapping construction surfaces into one continuous wrapped hand.
  bpy.ops.object.select_all(action='DESELECT')
  for obj in parts:obj.modifiers.clear();obj.select_set(True)
  bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();obj=parts[0];obj.name='Design02_fist.'+suffix
  remesh=obj.modifiers.new('Continuous fist surface','REMESH');remesh.mode='VOXEL';remesh.voxel_size=.004;remesh.use_smooth_shade=True
  bpy.ops.object.modifier_apply(modifier=remesh.name)
  smooth=obj.modifiers.new('Soften wrapped knuckles','SMOOTH');smooth.factor=.55;smooth.iterations=3
  bpy.ops.object.modifier_apply(modifier=smooth.name)
  decimate=obj.modifiers.new('Browser hand budget','DECIMATE');decimate.ratio=.55
  bpy.ops.object.modifier_apply(modifier=decimate.name)
  obj.vertex_groups.clear();group=obj.vertex_groups.new(name=bone);group.add(list(range(len(obj.data.vertices))),1,'REPLACE')
  for p in obj.data.polygons:p.use_smooth=True
  mod=obj.modifiers.new('Skin','ARMATURE');mod.object=rig;obj.parent=rig
