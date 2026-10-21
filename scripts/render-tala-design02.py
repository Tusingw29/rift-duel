"""CPU renders of the saved Design02 asset. Optional --guard uses runtime matrices.
Run sample-tala-design02-guard.mjs first when rendering the live block-brace pose.
"""
import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'art/blender/tala-design02';guard='--guard' in sys.argv
bpy.ops.wm.open_mainfile(filepath=str(OUT/'tala-study.blend'))
if guard:
 rig=bpy.data.objects.get('Tala');rig.animation_data_clear();C=Matrix.Rotation(math.pi/2,4,'X')
 for b in json.loads((OUT/'guard-pose.json').read_text())['bones']:
  a=b['matrix'];rig.pose.bones[b['name']].matrix=C@Matrix([a[i::4] for i in range(4)]);bpy.context.view_layer.update()
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=16
scene.render.resolution_x=720;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.world.color=(.22,.22,.22)
scene.view_settings.view_transform='Standard';scene.view_settings.look='Medium High Contrast';scene.view_settings.exposure=0;scene.view_settings.gamma=1
focus=2.30 if guard else 2.45
for name,loc,power,size in [('Key',(-2,-3,5),220,4),('Fill',(3,-2,3),100,3)]:
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.size=size
 obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(Vector((0,0,focus))-obj.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Review');obj=bpy.data.objects.new('Review',cam);scene.collection.objects.link(obj);scene.camera=obj
cam.type='ORTHO';cam.ortho_scale=1.05
for label,loc in [('front',(0,-3,focus)),('side',(3,-.5,focus))]:
 obj.location=loc;obj.rotation_euler=(Vector((0,0,focus))-obj.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(OUT/(('guard-' if guard else 'review-')+label+'.png'));bpy.ops.render.render(write_still=True)
