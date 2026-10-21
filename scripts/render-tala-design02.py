"""CPU renders of the saved Design02 asset. Optional --guard uses runtime matrices.
Run sample-tala-design02-guard.mjs first when rendering the live block-brace pose.
"""
import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'art/blender/tala-design02';pose=next((arg.split('=',1)[1] for arg in sys.argv if arg.startswith('--pose=')), 'guard' if '--guard' in sys.argv else None)
if pose not in [None,'guard','straight','cross','hook']:raise ValueError('Unknown review pose')
bpy.ops.wm.open_mainfile(filepath=str(OUT/'tala-study.blend'))
if pose:
 rig=bpy.data.objects.get('Tala');rig.animation_data_clear();C=Matrix.Rotation(math.pi/2,4,'X')
 for b in json.loads((OUT/(pose+'-pose.json')).read_text())['bones']:
  a=b['matrix'];rig.pose.bones[b['name']].matrix=C@Matrix([a[i::4] for i in range(4)]);bpy.context.view_layer.update()
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=16
scene.render.resolution_x=720;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.world.color=(.22,.22,.22)
scene.view_settings.view_transform='Standard';scene.view_settings.look='Medium High Contrast';scene.view_settings.exposure=0;scene.view_settings.gamma=1
focus=2.30 if pose=='guard' else 2.05 if pose else 2.45
if '--full' in sys.argv:focus=1.50
target=Vector((0,-.55 if pose=='straight' else -.35 if pose in ['straight','cross','hook'] else 0,focus))
for name,loc,power,size in [('Key',(-2,-3,5),220,4),('Fill',(3,-2,3),100,3)]:
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=size
 obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Review');obj=bpy.data.objects.new('Review',cam);scene.collection.objects.link(obj);scene.camera=obj
cam.type='ORTHO';cam.ortho_scale=3.2 if pose=='straight' else 2.8 if pose in ['straight','cross','hook'] else 1.05
if '--full' in sys.argv:cam.ortho_scale=3.3
for label,loc in [('front',(0,-3,focus)),('side',(3,-.5,focus))]:
 obj.location=loc;obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(OUT/(('costume-' if '--full' in sys.argv else pose+'-' if pose else 'review-')+label+'.png'));bpy.ops.render.render(write_still=True)
