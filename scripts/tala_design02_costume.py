"""Design 02 tailored garments; original study remains untouched."""
import bpy, math

def build_costume(ctx):
 mesh=ctx['mesh']; my=ctx['map_y']; rig=ctx['rig']
 for obj in list(bpy.data.objects):
  if obj.name.startswith(('Vest_back','Vest_front','Standing_collar','Shorts_waist','Shorts_leg','Shorts_folds','Waistband')):
   bpy.data.objects.remove(obj,do_unlink=True)
 def fabric(name,base):
  mat=ctx['mats'][base].copy();mat.name=name
  nodes=mat.node_tree.nodes; color=nodes.new('ShaderNodeVertexColor');color.layer_name='ClothColor'
  mat.node_tree.links.new(color.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
  return mat
 def finish(name,v,f,w,mat,shades):
  # Discard grid vertices inside the cutouts before exporting or thickening.
  used=sorted({i for face in f for i in face});remap={old:new for new,old in enumerate(used)}
  v=[v[i] for i in used];w=[w[i] for i in used];shades=[shades[i] for i in used]
  f=[tuple(remap[i] for i in face) for face in f]
  obj=mesh(name,v,f,w,mat,mapped=True)
  colors=obj.data.color_attributes.new(name='ClothColor',type='FLOAT_COLOR',domain='POINT')
  base=mat.diffuse_color
  for i,shade in enumerate(shades):colors.data[i].color=tuple(c*shade for c in base[:3])+(1,)
  # Apply thickness in bind pose before skinning.
  obj.modifiers.clear();bpy.context.view_layer.objects.active=obj
  solid=obj.modifiers.new('Sewn fabric thickness','SOLIDIFY');solid.thickness=.005
  bpy.ops.object.modifier_apply(modifier=solid.name)
  skin=obj.modifiers.new('Skin','ARMATURE');skin.object=rig
  return obj
 # A single curved sleeveless shell, with genuine openings for both arms.
 profile=[(1.67,.245,.184),(1.79,.291,.199),(1.91,.333,.202),(1.98,.365,.165),(2.035,.32,.143),(2.085,.135,.104),(2.13,.115,.097)]
 def shape(y):
  for (a,b,c),(d,e,f) in zip(profile,profile[1:]):
   if y<=d:
    t=(y-a)/(d-a);return b+(e-b)*t,c+(f-c)*t
  return profile[-1][1:]
 v=[];f=[];w=[];sh=[];params=[];cols=72;rows=40
 for j in range(rows+1):
  t=j/rows;y=1.67+.46*t;rx,rz=shape(y);opening=math.asin((.135-.065*t)/rx)
  for i in range(cols+1):
   a=opening+(math.tau-2*opening)*i/cols
   fold=.004*math.sin(a*8+t*6)*math.sin(math.pi*t)**2
   v.append(((rx+fold)*math.sin(a),my(y),(rz+fold)*math.cos(a)))
   w.append({'chest':1});params.append((a,y))
   edge=min(i,cols-i,j,rows-j);sh.append(.72 if edge==0 else .88 if edge==1 else 1)
 for j in range(rows):
  for i in range(cols):
   n=j*(cols+1)+i;a,y=params[n];a2,y2=params[n+cols+2];a=(a+a2)/2;y=(y+y2)/2
   hole=any(((a-center)/.52)**2+((y-1.985)/.085)**2<1 for center in [math.pi/2,3*math.pi/2])
   if not hole:f.append((n,n+cols+1,n+cols+2,n+1))
 # Project the stair-stepped grid boundary onto the actual oval opening.
 # This preserves the shoulder straps while giving the sewn edge a smooth arc.
 edge_use={}
 for face in f:
  for a,b in zip(face,face[1:]+face[:1]):
   edge=tuple(sorted((a,b)));edge_use[edge]=edge_use.get(edge,0)+1
 boundary={i for edge,count in edge_use.items() if count==1 for i in edge}
 for i in boundary:
  j,col=divmod(i,cols+1)
  if j in (0,rows) or col in (0,cols):continue
  angle,y=params[i];center=min([math.pi/2,3*math.pi/2],key=lambda c:abs(angle-c))
  dx=(angle-center)/.52;dy=(y-1.985)/.085;length=math.hypot(dx,dy)
  if not length:continue
  angle=center+.52*dx/length;y=1.985+.085*dy/length
  rx,rz=shape(y);t=(y-1.67)/.46;fold=.003*math.sin(angle*8+t*6)*math.sin(math.pi*t)**2
  v[i]=((rx+fold)*math.sin(angle),my(y),(rz+fold)*math.cos(angle));sh[i]=.78
 vestmat=fabric('Design02_ochre_cloth','ochre')
 finish('Design02_vest',v,f,w,vestmat,sh)
 # Folded collar/lapels: actual thickness and separate planes catch the key light.
 for side in [-1,1]:
  points=[(side*.072,my(2.13),.102),(side*.145,my(2.125),.119),
          (side*.178,my(2.02),.176),(side*.125,my(1.93),.211),
          (side*.097,my(2.025),.164)]
  faces=[(0,1,4),(1,2,4),(2,3,4)]
  if side<0:faces=[tuple(reversed(f)) for f in faces]
  finish('Design02_lapel',points,faces,[{'chest':1}]*5,vestmat,[.78,1,1,.87,.93])
 # Two tubes share their complete upper inseam: one waist, two leg openings.
 v=[];f=[];w=[];sh=[];shared={};cols=48;rows=16
 for side,suffix in [(-1,'L'),(1,'R')]:
  grid=[]
  for j in range(rows+1):
   t=j/rows;row=[]
   for i in range(cols):
    a=math.tau*i/cols;c=math.cos(a);s=math.sin(a)
    topx=side*.285*max(0,c);topy=1.40-.24*max(0,-c);topz=.185*s
    x=topx*(1-t)+side*(.20+.18*c)*t
    y=topy*(1-t)+1.025*t;z=topz*(1-t)+.18*s*t
    z+=.003*math.sin(a*6+t*7)*math.sin(math.pi*t)
    p=(x*.88,my(y),z*.93)
    key=tuple(round(q,7) for q in p)
    if j==0 and c<=1e-6 and key in shared:index=shared[key]
    else:
     index=len(v);v.append(p);weight=t*t*(3-2*t)
     w.append({'root':1-weight,'thigh.'+suffix:weight})
     sh.append(.68 if j==0 else .80 if j<=2 else .73 if j==rows else .87 if j==rows-1 else .86 if abs(s)<.065 else 1)
     if j==0 and c<=1e-6:shared[key]=index
    row.append(index)
   grid.append(row)
  for j in range(rows):
   for i in range(cols):
    k=(i+1)%cols;face=(grid[j][i],grid[j+1][i],grid[j+1][k],grid[j][k])
    f.append(face if side<0 else tuple(reversed(face)))
 finish('Design02_shorts',v,f,w,fabric('Design02_rust_cloth','rust'),sh)
