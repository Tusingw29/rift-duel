"""Swept hair masses for the Design 02 model, kept on existing head/pony bones."""
import math
from mathutils import Vector

def build_hair(ctx):
 mesh,R,W,loft,mats=[ctx[k] for k in ['mesh','R','W','loft','mats']]
 for name in ['hair','hairlight']:
  mats[name].node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.68
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
 cap=mesh('Design02_hair_cap',verts,faces,weights,'hair',uv)
 from tala_design02_strands import build_strands
 build_strands(ctx,cap)
 loft('Design02_hair_tie',[R(0,2.685,-.175,.068,.052,'head'),R(0,2.720,-.175,.069,.053,'head')],'ochre',24)
