import * as T from './vendor/three.module.js';
import {ARENA_RADIUS} from './arena-bounds.js';
export function createBoundaryRing(radius=ARENA_RADIUS){const group=new T.Group();group.name='playtest-arena-boundary';for(const [width,color,y] of [[.11,'#11141f',-.075],[.045,'#fff06b',-.065]]){const mesh=new T.Mesh(new T.RingGeometry(radius-width,radius+width,160),new T.MeshBasicMaterial({color,fog:false,toneMapped:false,side:T.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.y=y;group.add(mesh);}return group;}
