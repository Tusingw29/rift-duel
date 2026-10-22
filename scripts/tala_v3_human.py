"""Tala v3 base human: a MakeHuman (MPFB, CC0) anatomical body shaped to Tala's
proportion standard, used by both the joint-export and the final build scripts.

Runs inside Blender 3.6 with the legacy MPFB 2.0 alpha add-on installed from a zip
(see scripts/build-tala-v3-blender.py). Coordinates: MakeHuman builds in Blender space
(Z up, facing -Y, decimetre units). `to_game` converts to the game's authored space
(X right, Y up, Z forward) and scales to the fighter height.
"""
import os, math, json
import bpy
from mathutils import Vector

GAME_HEIGHT=2.9  # crown height in game units for the 7.5-head standard
OUR_BONES=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash','foot.L','foot.R']
# Which MakeHuman game-engine bones fold into each of ours (weights are summed).
CONSOLIDATE={
 'root':['Root','pelvis','spine_01'],'chest':['spine_02','spine_03','clavicle_l','clavicle_r'],'head':['neck_01','head'],
 'upper_arm':['upperarm'],'forearm':['lowerarm'],'hand':['hand','thumb_01','thumb_02','thumb_03','index_01','index_02','index_03','middle_01','middle_02','middle_03','ring_01','ring_02','ring_03','pinky_01','pinky_02','pinky_03'],
 'thigh':['thigh'],'shin':['calf'],'foot':['foot','ball']}
# Tala: tall, slim, athletic young woman. Macro values are MakeHuman 0..1 sliders.
MACRO={'race':{'asian':0.45,'african':0.15,'caucasian':0.40},'gender':0.0,'age':0.3,'muscle':0.86,'weight':0.52,'proportions':0.75,'height':0.82,'cupsize':0.55,'firmness':0.8}
# Detail targets (name, weight) toward the concept: oval face, defined cheekbones, larger eyes, small nose, long legs, narrow waist.
TARGETS=[('head/head-oval',0.5),('chin/chin-width-decr',0.35),('chin/chin-prominent-incr',0.15),('cheek/l-cheek-bones-incr',0.35),('cheek/r-cheek-bones-incr',0.35),
 ('eyes/l-eye-scale-incr',0.35),('eyes/r-eye-scale-incr',0.35),('eyes/l-eye-height2-incr',0.2),('eyes/r-eye-height2-incr',0.2),('nose/nose-scale-horiz-decr',0.3),('nose/nose-scale-vert-decr',0.15),
 ('mouth/mouth-scale-horiz-decr',0.15),('mouth/mouth-lowerlip-volume-incr',0.2),('neck/neck-scale-vert-decr',0.15),('neck/neck-scale-horiz-decr',0.05),
 ('legs/lowerlegs-height-incr',0.35),('legs/upperlegs-height-incr',0.3),('torso/measure-waist-circ-decr',0.45),('torso/measure-shoulder-dist-incr',0.6),('torso/torso-muscle-dorsi-incr',0.5),('torso/torso-muscle-pectoral-incr',0.35),('hip/hip-scale-horiz-decr',0.1),
 ('arms/l-upperarm-muscle-incr',0.7),('arms/r-upperarm-muscle-incr',0.7),('arms/l-lowerarm-muscle-incr',0.55),('arms/r-lowerarm-muscle-incr',0.55),('arms/l-upperarm-shoulder-muscle-incr',0.5),('arms/r-upperarm-shoulder-muscle-incr',0.5),
 ('legs/l-upperleg-muscle-incr',0.55),('legs/r-upperleg-muscle-incr',0.55),('legs/l-lowerleg-muscle-incr',0.45),('legs/r-lowerleg-muscle-incr',0.45),
 # Face toward the art target: tapered jaw, strong brow line, almond eyes, warm lips.
 ('chin/chin-triangle',0.35),('cheek/l-cheek-volume-decr',0.25),('cheek/r-cheek-volume-decr',0.25),('eyebrows/eyebrows-angle-up',0.3),('eyebrows/eyebrows-trans-down',0.25),
 ('eyes/l-eye-corner1-up',0.2),('eyes/r-eye-corner1-up',0.2),('eyes/l-eye-corner2-down',0.1),('eyes/r-eye-corner2-down',0.1),('mouth/mouth-upperlip-volume-incr',0.2),('nose/nose-point-width-decr',0.2)]

def install_mpfb(zip_path):
 if 'mpfb' not in bpy.context.preferences.addons:
  bpy.ops.preferences.addon_install(filepath=zip_path,overwrite=True)
 bpy.ops.preferences.addon_enable(module='mpfb')

def create_tala_human():
 from mpfb.services.humanservice import HumanService
 from mpfb.services.targetservice import TargetService
 from mpfb.services.locationservice import LocationService
 basemesh=HumanService.create_human(mask_helpers=True,detailed_helpers=True,extra_vertex_groups=True,feet_on_ground=True,scale=1.0,macro_detail_dict=MACRO)
 basemesh.name='Tala_v3'
 targets_dir=LocationService.get_mpfb_data('targets')
 for name,weight in TARGETS:
  path=os.path.join(targets_dir,name+'.target.gz')
  if os.path.exists(path):TargetService.load_target(basemesh,path,weight=weight)
  else:print('RIFT_WARN missing target',name)
 return basemesh

def add_game_rig(basemesh):
 from mpfb.services.humanservice import HumanService
 armature=HumanService.add_builtin_rig(basemesh,'game_engine',import_weights=True)
 return armature

def body_vertex_indices(basemesh):
 group=basemesh.vertex_groups.get('body')
 if not group:return set(range(len(basemesh.data.vertices)))
 return {v.index for v in basemesh.data.vertices if any(g.group==group.index and g.weight>0 for g in v.groups)}

def measure(basemesh,coords=None):
 """Height, crown and floor from the body vertices (helpers excluded), in Blender units."""
 coords=coords or evaluated_coords(basemesh)
 # Once the mask modifier strips helper geometry, the evaluated mesh holds only body vertices.
 body=body_vertex_indices(basemesh) if len(coords)==len(basemesh.data.vertices) else range(len(coords));zs=[coords[i].z for i in body]
 return {'floor':min(zs),'crown':max(zs),'height':max(zs)-min(zs)}

def to_game(v,scale):
 """Blender (x, y, z; facing -Y, Z up) -> game authored (x, y up, z forward)."""
 return [v.x*scale,v.z*scale,-v.y*scale]

_RIG=None
def rig_definition():
 global _RIG
 if _RIG is None:
  from mpfb.services.locationservice import LocationService
  _RIG=json.load(open(os.path.join(LocationService.get_mpfb_data('rigs'),'standard','rig.game_engine.json')))
 return _RIG.get('bones',_RIG)

def evaluated_coords(basemesh):
 """Vertex coordinates with shape keys applied, in Blender object space."""
 depsgraph=bpy.context.evaluated_depsgraph_get();ev=basemesh.evaluated_get(depsgraph)
 mesh=ev.to_mesh();coords=[v.co.copy() for v in mesh.vertices];ev.to_mesh_clear();return coords

def bone_head(armature,name,coords=None):
 """Head of a fitted MakeHuman game-engine bone in Blender world space. The rig is fitted
 to the shaped mesh through its joint-cube helpers, so detailed helpers must be enabled."""
 bpy.context.view_layer.update()
 b=armature.data.bones.get(name)
 return (armature.matrix_world@b.head_local) if b else None

def our_joint_positions(basemesh,armature,scale,coords=None):
 """Positions of our 17 joints in game units, derived from MakeHuman's game-engine rig."""
 coords=coords or evaluated_coords(basemesh);floor=measure(basemesh,coords)['floor']
 def bh(name):v=bone_head(armature,name,coords).copy();v.z-=floor;return v
 def side_of(name):return 'L' if bh(name).x<0 else 'R'
 pos={}
 pos['root']=[0,0,0]
 pos['chest']=to_game(bh('spine_02'),scale)
 pos['head']=to_game(bh('head'),scale)
 for mh in ['l','r']:
  side=side_of('upperarm_'+mh)
  pos['upper_arm.'+side]=to_game(bh('upperarm_'+mh),scale)
  pos['forearm.'+side]=to_game(bh('lowerarm_'+mh),scale)
  pos['hand.'+side]=to_game(bh('hand_'+mh),scale)
  pos['thigh.'+side]=to_game(bh('thigh_'+mh),scale)
  pos['shin.'+side]=to_game(bh('calf_'+mh),scale)
  pos['foot.'+side]=to_game(bh('foot_'+mh),scale)
 head=pos['head'];m=measure(basemesh,coords);crown=(m['crown']-m['floor'])*scale
 pos['ponytail']=[0,crown-0.08,head[2]-0.19]
 pos['sash']=[-0.19,pos['thigh.L'][1]-0.03,0.16]
 for k in pos:pos[k]=[round(c,4) for c in pos[k]]
 return pos

def joint_report(basemesh,armature):
 coords=evaluated_coords(basemesh);m=measure(basemesh,coords);scale=GAME_HEIGHT/m['height']
 pos=our_joint_positions(basemesh,armature,scale,coords)
 thigh=Vector(pos['thigh.L']);shin=Vector(pos['shin.L']);foot=Vector(pos['foot.L'])
 return {'scale':scale,'blender_height':m['height'],'game_height':GAME_HEIGHT,'joints':pos,
  'legLength':round((thigh-shin).length,4),'shinLength':round((shin-foot).length,4),'ankleHeight':round(foot.y,4),
  'side_map':{'l':'L' if bone_head(armature,'upperarm_l',coords).x<0 else 'R'}}
