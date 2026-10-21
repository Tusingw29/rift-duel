"""Swept hair masses for the Design 02 model, kept on existing head/pony bones."""
import math
from mathutils import Vector

def build_hair(ctx):
 mesh,R,W,loft,mats=[ctx[k] for k in ['mesh','R','W','loft','mats']]
 for name in ['hair','hairlight']:
  mats[name].node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.68
 def swept(name,points,mat,bone,sides=12):
  rings=[]
  for j in range(len(points)-1):
   a=points[max(0,j-1)];b=points[j];c=points[j+1];d=points[min(len(points)-1,j+2)]
   for step in range(6):
    t=step/6
    vals=[.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t) for k in range(5)]
    vals[3]=max(.001,vals[3]);vals[4]=max(.001,vals[4]);rings.append(R(*vals,bone))
  rings.append(R(*points[-1],bone))
  # Cross-sections follow the curve tangent, so the ponytail's arch does not
  # fold back through horizontal rings or produce a flat wedge at its crown.
  verts=[];faces=[];weights=[];uv=[]
  for j,ring in enumerate(rings):
   center=Vector(ring[:3]);before=Vector(rings[max(0,j-1)][:3]);after=Vector(rings[min(len(rings)-1,j+1)][:3]);tangent=(after-before).normalized()
   across=(Vector((1,0,0))-tangent*tangent.x).normalized();depth=tangent.cross(across)
   for i in range(sides+1):
    a=i/sides*math.tau;v=center+across*(math.cos(a)*ring[3])+depth*(math.sin(a)*ring[4])
    verts.append(tuple(v))
    blend=max(0,min(1,(j/(len(rings)-1))/.35));blend=blend*blend*(3-2*blend)
    weights.append({'head':1-blend,'ponytail':blend} if bone=='ponytail' else ring[5]);uv.append((i/sides,j/(len(rings)-1)))
    if j<len(rings)-1 and i<sides:
     n=j*(sides+1)+i;faces.append((n,n+1,n+sides+2,n+sides+1))
  faces.extend([tuple(range(sides,-1,-1)),tuple((len(rings)-1)*(sides+1)+i for i in range(sides+1))])
  return mesh(name,verts,faces,weights,mat,uv,mapped=True)
 # Close-fitting cap with a variable hairline: high forehead, lower sides/back.
 verts=[];faces=[];weights=[];uv=[];columns=48;rows=18
 profile=[(2.36,.170,.155),(2.40,.190,.169),(2.50,.201,.174),(2.58,.207,.182),(2.65,.194,.177),(2.71,.145,.135),(2.755,.004,.004)]
 def radius(y):
  for a,b in zip(profile,profile[1:]):
   if y<=b[0]+1e-6:
    t=(y-a[0])/(b[0]-a[0]);return [a[k]+(b[k]-a[k])*t for k in [1,2]]
  return profile[-1][1:]
 for j in range(rows+1):
  t=j/rows
  for i in range(columns+1):
   angle=2*math.pi*i/columns;c=math.cos(angle)
   opening=max(0,min(1,(c+.05)/.35));opening=opening*opening*(3-2*opening)
   bottom=2.36+.24*opening;y=bottom+(2.755-bottom)*t;rx,rz=radius(y)
   x=rx*math.sin(angle);z=-.026+rz*(c**.48 if c>0 else c)
   verts.append((x,y,z));weights.append(W('head'));uv.append((i/columns,t))
   if j<rows and i<columns:
    a=j*(columns+1)+i;faces.append((a,a+1,a+columns+2,a+columns+1))
 # Increasing angle then height gives outward-facing winding.
 faces.append(tuple(rows*(columns+1)+i for i in range(columns)))
 mesh('Design02_hair_cap',verts,faces,weights,'hair',uv)
 # Uneven locks fan from a side part rather than forming a row of blunt bangs.
 # Flattened sections and staggered tips keep the brow and face readable.
 fringe=[
  [(.025,2.73,.075,.040,.018),(-.07,2.67,.145,.047,.025),(-.155,2.55,.14,.035,.020),(-.185,2.40,.09,.001,.002)],
  [(.06,2.73,.09,.040,.020),(-.005,2.66,.177,.045,.024),(-.07,2.57,.182,.033,.018),(-.125,2.49,.143,.001,.002)],
  [(.08,2.71,.10,.025,.015),(.04,2.65,.18,.030,.020),(-.015,2.57,.195,.021,.016),(-.06,2.525,.175,.001,.002)],
  [(.08,2.72,.08,.038,.020),(.145,2.65,.135,.045,.024),(.19,2.53,.09,.027,.018),(.20,2.40,.05,.001,.002)],
  [(.065,2.72,.10,.028,.016),(.10,2.65,.185,.030,.018),(.14,2.56,.166,.020,.015),(.15,2.50,.13,.001,.002)]
 ]
 for points in fringe:swept('Design02_fringe',points,'hair','head')
 for s in [-1,1]:
  swept('Design02_side_lock',[(s*.163,2.66,.065,.047,.047),(s*.196,2.50,.080,.038,.043),(s*.188,2.37,.035,.028,.027),(s*.165,2.29,.015,.001,.002)],'hair','head')
 # Three broad overlapping tapered masses; one retained ponytail bone drives them.
 for i in [-1,0,1]:
  swept('Design02_ponytail',[(i*.035,2.705,-.17,.054,.050),(i*.063,2.785,-.29,.085,.060),(i*.085+.025,2.67,-.43,.089,.055),(i*.10+.035,2.39,-.50,.077,.046),(i*.125+.06,2.13,-.46,.047,.027),(i*.15+.08,1.95+abs(i)*.09,-.32,.002,.003)],'hair','ponytail',14)
 loft('Design02_hair_tie',[R(0,2.685,-.175,.086,.070,'head'),R(0,2.724,-.175,.087,.070,'head')],'ochre',16)
