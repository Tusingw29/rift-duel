"""Layered, UV-directed strand ribbons. One packed PNG and two materials.
Authored curves retain the existing head/ponytail deformation contract.
"""
import bpy, math
import numpy as np
from mathutils import Vector


def strand_materials(ctx):
 size=512
 u,v=np.meshgrid(np.linspace(0,1,size),np.linspace(0,1,size*2))
 # Fine strands follow the card length, unlike world-space noise on solid lumps.
 bend=.009*np.sin(v*8)+.004*np.sin(v*21)
 strand=.5+.5*np.sin((u+bend)*math.tau*47+.5*np.sin(u*49))
 clump=.5+.5*np.sin((u+bend)*math.tau*7)
 tone=.58+.20*strand+.16*clump+.10*np.exp(-((v-.5)/.22)**2)
 width=.48*(1-.82*v**3)
 center=.5+.025*np.sin(v*8)
 edge=np.clip((width-np.abs(u-center))*90,0,1)
 tip=np.clip((1-v)*55-.35*(1-strand),0,1)
 alpha=edge*tip
 pixels=np.empty((size*2,size,4),dtype=np.float32)
 for i,base in enumerate((.22,.05,.022)):pixels[:,:,i]=base*tone
 pixels[:,:,3]=alpha
 image=bpy.data.images.new('Tala_strand_atlas',width=size,height=size*2,alpha=True)
 image.colorspace_settings.name='sRGB';image.pixels.foreach_set(pixels.ravel())
 image.filepath_raw=str(ctx['OUT']/'hair-strands.png');image.file_format='PNG';image.save();image.pack()
 result=[]
 for name,cutout in [('Design02_hair_base',False),('Design02_hair_strands',True)]:
  mat=bpy.data.materials.new(name);mat.use_nodes=True;mat.diffuse_color=(.20,.06,.027,1)
  shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.48
  tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image
  mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
  if cutout:
   mat.node_tree.links.new(tex.outputs['Alpha'],shader.inputs['Alpha'])
   mat.blend_method='CLIP';mat.alpha_threshold=.38;mat.use_backface_culling=False
  result.append(mat)
  ctx['mats'][name]=mat
 return result


def build_strands(ctx,cap):
 mesh=ctx['mesh'];W=ctx['W'];opaque,cutout=strand_materials(ctx)
 cap.data.materials.clear();cap.data.materials.append(opaque)
 # Cubic centerline and a cupped cross-section prevent paper-flat ribbons.
 def ribbon(name,points,widths,bone,roll=0,material=cutout):
  verts=[];faces=[];weights=[];uv=[];rows=28;cols=4
  def sample(t):
   q=t*(len(points)-1);j=min(len(points)-2,int(q));f=q-j
   a=Vector(points[max(0,j-1)]);b=Vector(points[j]);c=Vector(points[j+1]);d=Vector(points[min(len(points)-1,j+2)])
   p=.5*((2*b)+(-a+c)*f+(2*a-5*b+4*c-d)*f*f+(-a+3*b-3*c+d)*f*f*f)
   width=widths[j]*(1-f)+widths[j+1]*f
   return p,width
  for j in range(rows+1):
   t=j/rows;p,width=sample(t);before=sample(max(0,t-.005))[0];after=sample(min(1,t+.005))[0]
   tangent=(after-before).normalized();axis=Vector((math.cos(roll),0,math.sin(roll)))
   axis-=tangent*axis.dot(tangent)
   if axis.length<.01:axis=Vector((0,0,1));axis-=tangent*axis.dot(tangent)
   axis.normalize();normal=axis.cross(tangent).normalized()
   blend=min(1,t/.30);blend=blend*blend*(3-2*blend)
   for i in range(cols+1):
    u=i/cols;side=u*2-1
    pos=p+axis*(side*width)+normal*((1-side*side)*width*.22)
    verts.append(tuple(pos));uv.append((u,t))
    weights.append({'head':1-blend,'ponytail':blend} if bone=='ponytail' else W(bone))
    if j<rows and i<cols:
     n=j*(cols+1)+i;faces.append((n,n+1,n+cols+2,n+cols+1))
  return mesh(name,verts,faces,weights,material,uv)
 # Compact fall from the tie, splitting into independently shaped, staggered ends.
 # No solid horseshoe-shaped arch; internal overlapping ribbons supply volume.
 for layer in range(3):
  for i in range(7):
   offset=(i-3)*.029;depth=layer*.025
   points=[(offset*.35,2.70,-.17),(offset*.8,2.72,-.255-depth),
           (offset*1.4+.025,2.51,-.34-depth),(offset*1.7+.04,2.20,-.36-depth),
           (offset*2+.055,1.87+abs(i-3)*.035+layer*.045,-.30-depth)]
   ribbon('Design02_pony_strand',points,[.036,.047,.050,.039,.012],'ponytail',
          roll=(layer-1)*.55+(i-3)*.12)
 # The part opens above the right brow; tip lengths avoid covering both eyes.
 front=[
  [(.055,2.735,.10),(-.04,2.68,.182),(-.13,2.56,.183),(-.19,2.38,.09)],
  [(.07,2.73,.12),(.01,2.67,.195),(-.06,2.59,.201),(-.11,2.51,.16)],
  [(.085,2.73,.10),(.14,2.66,.16),(.18,2.54,.13),(.20,2.40,.055)],
  [(.08,2.73,.13),(.11,2.65,.197),(.14,2.58,.181),(.155,2.52,.145)]
 ]
 for k,points in enumerate(front):
  for layer in range(2):
   p=[(x+(layer-.5)*.012,y,z+layer*.004) for x,y,z in points]
   ribbon('Design02_fringe_strand',p,[.030,.045 if k%2==0 else .027,.030,.010],'head')
 # Sweep crown strips back toward the ponytail rather than leaving a helmet rim.
 for s in [-1,1]:
  for i in range(5):
   a=.35+i*.25
   points=[(s*.08,2.73,.075-i*.027),(s*.18,2.65,.07-i*.037),
           (s*.205,2.51,.02-i*.040),(s*.15,2.37-i*.014,-.075-i*.022)]
   ribbon('Design02_crown_strand',points,[.030,.040,.040,.012],'head',roll=s*(.6+i*.14))
  for i in range(2):
   ribbon('Design02_temple_strand',[(s*.16,2.65,.08),(s*.194,2.51,.095),
          (s*(.19+i*.014),2.38,.067),(s*.165,2.27+i*.035,.035)],
          [.024,.029,.018,.005],'head',roll=s*.35)
