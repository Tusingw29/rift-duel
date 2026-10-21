"""Continuous cloth wraps with flat spiral seams, using standard vertex color."""
import bpy,math

def build_wraps(ctx):
 for obj in list(bpy.data.objects):
  if obj.name.startswith(('Wrist_wrap.','Wrap_stitch','Shin_wrap.','Shin_seam')):
   bpy.data.objects.remove(obj,do_unlink=True)
 mat=ctx['mats']['wrap'].copy();mat.name='Design02_wrap_cloth'
 node=mat.node_tree.nodes.new('ShaderNodeVertexColor');node.layer_name='WrapTone'
 mat.node_tree.links.new(node.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
 mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.94
 for side,suffix in [(-1,'L'),(1,'R')]:
  for kind in ['forearm','shin']:
   arm=kind=='forearm';bottom,top=(1.215,1.455) if arm else (.17,.51)
   cols=32;rows=48;v=[];w=[];faces=[];colors=[]
   for j in range(rows+1):
    t=j/rows;y=bottom+(top-bottom)*t
    # Smoothly taper the fabric to the limb; no detached stacked rings.
    if arm:
     rx=.072+.024*math.sin(t*math.pi/2);rz=.075+.023*math.sin(t*math.pi/2)
     hand=max(0,1-t/.25);bind={'hand.'+suffix:hand,'forearm.'+suffix:1-hand};x=side*.43;z=0
    else:
     ease=t*t*(3-2*t);rx=.079+.038*ease;rz=.083+.031*ease
     bind={'shin.'+suffix:1};x=side*.20;z=-.005*t
    for i in range(cols):
     a=math.tau*i/cols
     # A shallow diagonal overlap reads as wound fabric, not armor plates.
     phase=t*(6 if arm else 8)-side*a/math.tau
     distance=abs(phase-round(phase));seam=math.exp(-(distance/.075)**2)
     radius=.0007*seam
     v.append(ctx['remap_vertex']((x+(rx+radius)*math.cos(a),y,z+(rz+radius)*math.sin(a)),bind));w.append(bind)
     hem=min(t,1-t);shade=(1-.17*seam)*(.9 if hem<.015 else 1)
     colors.append(tuple(c*shade for c in mat.diffuse_color[:3])+(1,))
   for j in range(rows):
    for i in range(cols):
     a=j*cols+i;b=j*cols+(i+1)%cols;faces.append((a,a+cols,b+cols,b))
   obj=ctx['mesh']('Design02_'+kind+'_wrap.'+suffix,v,faces,w,mat,mapped=True)
   attr=obj.data.color_attributes.new(name='WrapTone',type='FLOAT_COLOR',domain='POINT')
   for i,color in enumerate(colors):attr.data[i].color=color

 # All four wraps share one cloth material. Join their surfaces while preserving
 # vertex groups and point colors, so they submit together in the renderer.
 parts=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith(('Design02_forearm_wrap.','Design02_shin_wrap.'))]
 bpy.ops.object.select_all(action='DESELECT')
 for obj in parts:obj.select_set(True)
 bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();parts[0].name='Design02_wraps'
