"""Original Rift Duel VFX. Blender 3.6.23, CPU-only geometry and analytic mask bake.
Run: Blender -b --factory-startup --python scripts/vfx-blender/build.py -- --out dist/assets/vfx/blender
No .blend files, rendering engines, external assets or plugins are required.
"""
import bpy, math, json, hashlib, argparse, sys
from pathlib import Path
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--out',required=True);args=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
assert bpy.app.version[:3]==(3,6,23), 'Use the installed Blender 3.6.23'
bpy.context.scene.render.engine='BLENDER_WORKBENCH'
materials={}
for name in ['body','core','shadow']:
 m=bpy.data.materials.new(name);m.diffuse_color={'body':(.6,.3,.12,1),'core':(1,.85,.4,1),'shadow':(.08,.02,.1,1)}[name];materials[name]=m

def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)

def mesh(name,verts,faces,uvs,role='body'):
 # Author in game XYZ. Blender Z-up -> glTF Y-up roundtrips these coordinates.
 data=bpy.data.meshes.new(name);data.from_pydata([(x,-z,y) for x,y,z in verts],[],faces);data.update()
 ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);data.materials.append(materials[role]);layer=data.uv_layers.new(name='UVMap')
 for poly in data.polygons:
  poly.use_smooth=True
  for li in poly.loop_indices:layer.data[li].uv=uvs[data.loops[li].vertex_index]
 bpy.context.view_layer.objects.active=ob;ob.select_set(True)
 # Recalculate outward normals for the closed swept shells.
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT');ob.select_set(False)
 return ob

def sweep(name,fn,width,depth,role='body',steps=32,sides=8,taper=True):
 verts=[];faces=[];uv=[]
 for i in range(steps+1):
  t=i/steps;c=Vector(fn(t));d=Vector(fn(min(1,t+.001)))-Vector(fn(max(0,t-.001)));d.normalize();n=d.cross(Vector((0,0,1)))
  if n.length<.1:n=d.cross(Vector((0,1,0)))
  n.normalize();b=d.cross(n).normalized();e=max(.035,math.sin(math.pi*t)**.65) if taper else 1
  for j in range(sides):
   a=j*math.tau/sides;v=c+n*(math.cos(a)*width*e)+b*(math.sin(a)*depth*e);verts.append(tuple(v));uv.append((t,j/sides))
  if i:
   for j in range(sides):faces.append(((i-1)*sides+j,(i-1)*sides+(j+1)%sides,i*sides+(j+1)%sides,i*sides+j))
 faces.extend([tuple(range(sides-1,-1,-1)),tuple(steps*sides+j for j in range(sides))]);return mesh(name,verts,faces,uv,role)

def sol():
 # Three twisting, pointed lobes distributed through depth rather than flat strips.
 for j in range(3):
  a=j*math.tau/3
  def path(t,a=a):
   r=.14+.12*math.sin(math.pi*t);q=a+t*1.9
   return (r*math.cos(q)+.12*math.sin(t*math.pi*2),-1+2*t,r*math.sin(q))
  sweep('flame-shell-'+str(j),path,.17,.105,steps=30)
  sweep('flame-ridge-'+str(j),lambda t,path=path:tuple(Vector(path(t))+Vector((.025,0,.015))),.018,.02,'core',steps=24,sides=6)

def vesper():
 # A three-dimensional rhombic cage: two seals in intersecting planes.
 for plane in range(2):
  points=[(0,-.92,0),(.43,0,0),(0,.92,0),(-.43,0,0),(0,-.92,0)]
  if plane:points=[(x*.18,y,x*.8) for x,y,z in points]
  for j in range(4):
   a,b=Vector(points[j]),Vector(points[j+1]);fn=lambda t,a=a,b=b:tuple(a.lerp(b,t))
   sweep('seal-bevel-%s-%s'%(plane,j),fn,.065,.065,steps=6,sides=6,taper=False)
   sweep('seal-light-%s-%s'%(plane,j),lambda t,fn=fn:tuple(Vector(fn(t))+Vector((0,0,.052))),.012,.012,'core',steps=6,sides=5,taper=False)
 sweep('seal-axis',lambda t:(0,-.52+1.04*t,0),.035,.06,'core',steps=10)

def capture():
 # Rounded diamond section; broad enough from the side, with a clear open center.
 for j in range(3):
  start=j*math.tau/3+.08
  def fn(t,start=start):
   a=start+t*(math.tau/3-.16);return (math.cos(a),math.sin(a),.045*math.sin(a*3))
  sweep('capture-collar-'+str(j),fn,.06,.105,steps=24,sides=8)
  sweep('capture-ridge-'+str(j),lambda t,fn=fn:tuple(Vector(fn(t))+Vector((0,0,.105))),.012,.014,'core',steps=24,sides=6)
 # A quieter second meridian establishes true volume without filling the ring.
 sweep('capture-meridian',lambda t:(math.cos(t*math.tau)*.94,math.sin(t*math.tau),math.cos(t*math.tau)*.3),.018,.025,'core',steps=48,sides=6,taper=False)

def burst():
 # Six swept petals spread into depth, avoiding the old straight solid star spikes.
 for j in range(6):
  a=j*math.tau/6
  def fn(t,a=a,j=j):
   r=.05+.65*t;q=a+.5*t;return (math.cos(q)*r,math.sin(q)*r,math.sin(j*2.4)*t*.42)
  sweep('burst-petal-'+str(j),fn,.075,.045,steps=14,sides=6)
  sweep('burst-hot-edge-'+str(j),fn,.012,.015,'core',steps=14,sides=5)

manifest={'generator':'Blender '+bpy.app.version_string,'author':'Original Rift Duel project artwork authored by Codex for Adam','license':'CC0-1.0','source':'scripts/vfx-blender/build.py','files':[]}
for name,build in [('sol-shell',sol),('vesper-shell',vesper),('capture-collar',capture),('release-burst',burst)]:
 clear();build();bpy.ops.object.select_all(action='SELECT');bpy.context.view_layer.objects.active=bpy.context.selected_objects[0];bpy.ops.object.join();path=out/(name+'.glb')
 triangles=sum(len(p.vertices)-2 for o in bpy.context.scene.objects if o.type=='MESH' for p in o.data.polygons)
 bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_cameras=False,export_lights=False,export_texcoords=True,export_normals=True,export_materials='EXPORT')
 assert path.stat().st_size<200*1024,(name,path.stat().st_size)
 manifest['files'].append({'name':path.name,'bytes':path.stat().st_size,'triangles':triangles,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
# Bake original analytic grayscale fields into 128px Blender images. RGB and alpha
# contain the same mask, so existing alpha-reading shaders can use these directly.
for name in ['wisps','cracks','sparks']:
 size=128;pixels=[]
 for y in range(size):
  v=y/(size-1)
  for x in range(size):
   u=x/(size-1);value=0
   if name=='wisps':
    for j in range(5):
     center=(j+.5)/5+.045*math.sin(u*math.tau*2+j)+.02*math.sin(u*math.tau*5+j*2)
     value+=math.exp(-((v-center)/(.018+.012*math.sin(u*math.pi)**2))**2)*(.35+.65*math.sin(u*math.pi)**.4)
   elif name=='cracks':
    for j in range(3):
     center=(j+1)/4+.05*math.sin(u*19+j*3)+.02*math.sin(u*53+j)
     value=max(value,math.exp(-abs(v-center)/.009)*math.sin(u*math.pi)**.4)
   else:
    for j in range(12):
     cx=(.13+j*.618033)%1;cy=(.17+j*.381966)%1
     value=max(value,math.exp(-(((u-cx)/.014)**2+((v-cy)/(.025+(j%3)*.008))**2)))
   value=min(1,max(0,value));pixels.extend((value,value,value,value))
 img=bpy.data.images.new(name,width=size,height=size,alpha=True);img.colorspace_settings.name='Non-Color';img.pixels=pixels;img.filepath_raw=str(out/(name+'.png'));img.file_format='PNG';img.save();path=out/(name+'.png');assert path.stat().st_size<256*1024
 manifest['files'].append({'name':path.name,'bytes':path.stat().st_size,'width':size,'height':size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('VFX_ASSETS_COMPLETE',json.dumps(manifest))
