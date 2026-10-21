"""Connected face/neck study in authored Tala coordinates, before proportion remap.
A deliberately editable surface study, not automatic retopology or a final sculpt.
"""
import math,sys
import bpy

def build_head(ctx):
 mesh,R,W,B,loft,mats,ROOT=[ctx[k] for k in ['mesh','R','W','B','loft','mats','ROOT']]
 skin=mats['skin']; skin.diffuse_color=(.59,.32,.18,1)
 skin.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=skin.diffuse_color
 skin.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.72
 face=bpy.data.materials.new('Design02_face');face.use_nodes=True
 p=face.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.78
 tex=face.node_tree.nodes.new('ShaderNodeTexImage')
 tex.image=bpy.data.images.load(str(ROOT/'art/blender/tala-design02/face-source-v2.png'));tex.image.pack()
 face.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 # x radius, front/back depth and center build jaw, temples and cranium.
 profile=[(2.035,.105,.082,-.018),(2.10,.090,.080,-.015),
 (2.18,.081,.078,-.005),(2.225,.067,.085,.005),(2.25,.080,.095,.006),
 (2.29,.115,.120,.001),(2.34,.144,.139,-.004),(2.40,.177,.150,-.009),
 (2.46,.182,.154,-.012),(2.51,.184,.154,-.014),(2.58,.190,.164,-.022),
 (2.65,.178,.160,-.03),(2.71,.125,.117,-.03),(2.745,.025,.025,-.03)]
 def dims(y):
  for j,(a,b) in enumerate(zip(profile,profile[1:])):
   if y<=b[0]+1e-8:
    t=(y-a[0])/(b[0]-a[0]);prev=profile[max(0,j-1)];nxt=profile[min(len(profile)-1,j+2)]
    return [(2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*(b[k]-prev[k])/(b[0]-prev[0])*(b[0]-a[0])+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*(nxt[k]-a[k])/(nxt[0]-a[0])*(b[0]-a[0]) for k in [1,2,3]]
  return profile[-1][1:]
 def bump(x,y,cx,cy,wx,wy,amount):return amount*math.exp(-((x-cx)/wx)**2-((y-cy)/wy)**2)
 verts=[];weights=[];uv=[];faces=[];atlas=[];masks=[]
 cols=64;rows=72
 for j in range(rows+1):
  y=profile[0][0]+(profile[-1][0]-profile[0][0])*j/rows;rx,rz,cz=dims(y)
  for i in range(cols+1):
   theta=-math.pi+2*math.pi*i/cols;c=math.cos(theta);x=rx*math.sin(theta)
   # Broad front facial plane rather than a cylindrical face with a decal.
   z=cz+rz*(c**.48 if c>=0 and y>2.25 else c)
   if c>0 and y>2.24:
    f=max(0,c)**4
    dz=bump(x,y,0,2.445,.026,.075,.026)+bump(x,y,0,2.397,.036,.030,.032)
    dz+=bump(x,y,0,2.326,.063,.018,.009)+bump(x,y,0,2.262,.065,.025,.012)
    for s in [-1,1]:
     dz+=bump(x,y,s*.092,2.50,.047,.028,-.017)
     dz+=bump(x,y,s*.093,2.538,.054,.018,.009)
     dz+=bump(x,y,s*.112,2.419,.049,.043,.013)
    z+=f*dz
   # Smooth neck weight ramp; connected rings avoid floating head/neck pieces.
   blend=max(0,min(1,(y-2.09)/.16));weights.append(B('chest','head',blend))
   # Taper the jaw and cheeks without cropping the painted facial landmarks.
   # Keep the cranium/hair fit and original UV projection intact.
   taper=1-.10*math.exp(-((y-2.36)/.105)**2)
   verts.append((x*taper,y,z))
   u=.5+x/.62
   v=1-(.861-(y-2.23)/.51*.845)
   if c<=0 or y<2.245:u,v=.035,.55
   uv.append((max(.025,min(.975,u)),max(.025,min(.975,v))))
   atlas.append((i/cols,j/rows))
   side=max(0,min(1,(1.15-abs(theta))/.50));chin=max(0,min(1,(y-2.245)/.045))
   masks.append((side*side*(3-2*side))*(chin*chin*(3-2*chin)))
   if j<rows and i<cols:
    a=j*(cols+1)+i;faces.append((a,a+1,a+cols+2,a+cols+1))
 obj=mesh('Design02_connected_head_neck',verts,faces,weights,face,uv)
 bake_face(obj,face,tex,skin,atlas,masks,ROOT)
 # Small dimensional ears, tucked beneath side hair. Head remains a single surface.
 for s in [-1,1]:
  loft('Design02_ear',[R(s*.178,2.37,-.025,.015,.025,'head'),R(s*.196,2.43,-.025,.025,.033,'head'),R(s*.188,2.48,-.028,.018,.025,'head')],'skin',12)
 return obj


def bake_face(obj,material,source,skin,atlas,masks,root):
 """Bake the authored material into a unique UV atlas supported by plain glTF.
 This removes the projected portrait boundary without a custom runtime shader.
 """
 nodes=material.node_tree.nodes;links=material.node_tree.links
 uv=nodes.new('ShaderNodeUVMap');uv.uv_map='UVMap';links.new(uv.outputs['UV'],source.inputs['Vector'])
 mask=obj.data.color_attributes.new(name='FaceBlend',type='FLOAT_COLOR',domain='POINT')
 for i,value in enumerate(masks):mask.data[i].color=(value,value,value,1)
 attr=nodes.new('ShaderNodeVertexColor');attr.layer_name='FaceBlend'
 mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX';mix.inputs[1].default_value=skin.diffuse_color
 links.new(attr.outputs['Color'],mix.inputs[0]);links.new(source.outputs['Color'],mix.inputs[2])
 emission=nodes.new('ShaderNodeEmission');links.new(mix.outputs['Color'],emission.inputs['Color'])
 links.new(emission.outputs[0],nodes.get('Material Output').inputs['Surface'])
 layer=obj.data.uv_layers.new(name='FaceAtlas')
 for poly in obj.data.polygons:
  for idx in poly.loop_indices:layer.data[idx].uv=atlas[obj.data.loops[idx].vertex_index]
 obj.data.uv_layers.active=layer;layer.active_render=True
 if '--reuse-face-atlas' in sys.argv:
  # Explicit fast path for body-only iterations; a full build remains default.
  cached=root/'art/blender/tala-design02/face-baked.png'
  if not cached.exists():raise RuntimeError('No face atlas to reuse; run a full build first')
  image=bpy.data.images.load(str(cached));image.pack()
 else:
  image=bpy.data.images.new('Tala_Design02_face_albedo',width=1024,height=1024,alpha=False)
  image.colorspace_settings.name='sRGB'
  target=nodes.new('ShaderNodeTexImage');target.image=image;nodes.active=target;target.select=True
  bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
  scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=1
  scene.render.bake.margin=8;bpy.ops.object.bake(type='EMIT')
  image.filepath_raw=str(root/'art/blender/tala-design02/face-baked.png');image.file_format='PNG';image.save();image.pack()
 authoring=material.copy();authoring.name='Design02_face_authoring';authoring.use_fake_user=True
 # Standard metallic/roughness material: no shader extension or runtime mask.
 nodes.clear();out=nodes.new('ShaderNodeOutputMaterial');shader=nodes.new('ShaderNodeBsdfPrincipled')
 shader.inputs['Roughness'].default_value=.78;tex=nodes.new('ShaderNodeTexImage');tex.image=image
 coords=nodes.new('ShaderNodeUVMap');coords.uv_map='FaceAtlas';links.new(coords.outputs['UV'],tex.inputs['Vector'])
 links.new(tex.outputs['Color'],shader.inputs['Base Color']);links.new(shader.outputs[0],out.inputs['Surface'])
 obj.data.color_attributes.remove(mask)
