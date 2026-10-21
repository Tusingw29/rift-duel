"""Offline normal-speed review of actual runtime poses; not a browser benchmark."""
import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'art/blender/tala-design02'
data=json.loads((OUT/'motion-review.json').read_text())
bpy.ops.wm.open_mainfile(filepath=str(OUT/'tala-study.blend'))
rig=bpy.data.objects['Tala'];rig.animation_data_clear();C=Matrix.Rotation(math.pi/2,4,'X')
for bone in rig.pose.bones:bone.rotation_mode='QUATERNION'
scene=bpy.context.scene
for frame,sample in enumerate(data['frames'],1):
 scene.frame_set(frame)
 for entry in sample['bones']:
  bone=rig.pose.bones[entry['name']];a=entry['matrix'];bone.matrix=C@Matrix([a[i::4] for i in range(4)])
  bpy.context.view_layer.update()
  for channel in ['location','rotation_quaternion','scale']:bone.keyframe_insert(channel,frame=frame)
for curve in rig.animation_data.action.fcurves:
 for key in curve.keyframe_points:key.interpolation='CONSTANT'
# Verify that key insertion reproduces sampled world transforms, including parents.
max_error=0
for frame in [1,29,72,81,91,101,120]:
 scene.frame_set(frame);bpy.context.view_layer.update()
 for entry in data['frames'][frame-1]['bones']:
  a=entry['matrix'];expected=C@Matrix([a[i::4] for i in range(4)])
  actual=rig.matrix_world@rig.pose.bones[entry['name']].matrix
  max_error=max(max_error,max(abs(actual[r][c]-expected[r][c]) for r in range(4) for c in range(4)))
if max_error>1e-4:raise RuntimeError('Motion bake differs from runtime matrices: '+str(max_error))
print('RUNTIME_POSE_MATRIX_MAX_ERROR',max_error,flush=True)
if '--validate-only' in sys.argv:sys.exit(0)
scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=8
scene.render.resolution_x=576;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.render.fps=data['fps'];scene.frame_start=1;scene.frame_end=len(data['frames'])
scene.world.color=(.22,.22,.22)
scene.view_settings.view_transform='Standard';scene.view_settings.look='Medium High Contrast'
target=Vector((0,-.25,1.5))
for name,loc,power,size in [('Key',(-2,-3,5),220,4),('Fill',(3,-2,3),100,3)]:
 light=bpy.data.lights.new(name,'AREA');light.energy=power;light.size=size
 obj=bpy.data.objects.new(name,light);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler()
cam=bpy.data.cameras.new('Motion camera');obj=bpy.data.objects.new('Motion camera',cam);scene.collection.objects.link(obj);scene.camera=obj
cam.type='ORTHO';cam.ortho_scale=3.7;obj.location=(2,-5,2.2);obj.rotation_euler=(target-obj.location).to_track_quat('-Z','Y').to_euler()
font=bpy.data.curves.new('Motion label','FONT');font.size=.11
label=bpy.data.objects.new('Motion label',font);scene.collection.objects.link(label);label.parent=obj;label.location=(-1.35,1.62,-4)
mat=bpy.data.materials.new('Label');mat.use_nodes=True;nodes=mat.node_tree.nodes;nodes.clear();em=nodes.new('ShaderNodeEmission');em.inputs['Color'].default_value=(.9,.9,.9,1);out=nodes.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(em.outputs[0],out.inputs['Surface']);font.materials.append(mat)
def update_label(scene):font.body=data['frames'][scene.frame_current-1]['clip']+' | normal speed'
bpy.app.handlers.frame_change_pre.append(update_label)
scene.render.image_settings.file_format='FFMPEG';scene.render.ffmpeg.format='MPEG4';scene.render.ffmpeg.codec='H264';scene.render.ffmpeg.constant_rate_factor='HIGH';scene.render.ffmpeg.ffmpeg_preset='GOOD'
scene.render.filepath=str(ROOT/'dist/assets/tala-design02-motion.mp4')
scene.frame_set(1);bpy.ops.render.render(animation=True)
# Save a real punch frame for a browser video poster and inspection.
scene.frame_set(81);scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'motion-review-punch.png');bpy.ops.render.render(write_still=True)
print('MOTION_REVIEW_COMPLETE',len(data['frames']),data['fps'])
