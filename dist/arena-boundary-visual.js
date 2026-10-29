import * as T from './vendor/three.module.js';
import {ARENA_RADIUS} from './arena-bounds.js';
export function createBoundaryRing(){const group=new T.Group();group.name='playtest-arena-boundary';for(const [width,color,y] of [[.11,'#11141f',.015],[.045,'#fff06b',.045]]){const mesh=new T.Mesh(new T.TorusGeometry(ARENA_RADIUS,width,6,160),new T.MeshBasicMaterial({color,fog:false,toneMapped:false}));mesh.rotation.x=Math.PI/2;mesh.position.y=y;group.add(mesh);}return group;}
