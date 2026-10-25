import test from 'node:test';import assert from 'node:assert/strict';import {PerspectiveCamera,Vector3} from '../dist/vendor/three.module.js';
import {duelCamera,fitFighters} from '../dist/fight-camera.js';
import {normalizeOptions} from '../dist/options.js';
test('duel framing preserves viewing side when fighters exchange positions',()=>{
 const p=[{x:-2,z:0},{x:2,z:0}],state={},a=duelCamera(p,1.5,state);const b=duelCamera([...p].reverse(),1.5,state);assert.equal(a.position.distanceTo(b.position),0);
 assert.equal(normalizeOptions().camera,'duel');assert.equal(normalizeOptions({camera:'lock'}).camera,'lock');
});
test('post-smoothing fit keeps both whole bodies inside HUD-safe bounds at edges and airborne',()=>{
 for(const aspect of [.6,1,1.5,2.3])for(const players of [[{x:-11,z:-6},{x:11,z:6}],[{x:9,z:5,airMotion:{height:4}},{x:10,z:6}],[{x:0,z:0},{x:1.2,z:0}]]){
  const camera=new PerspectiveCamera(40,aspect,.1,130),shot=duelCamera(players,aspect);camera.position.copy(shot.position);camera.lookAt(shot.target);fitFighters(camera,players);
  for(const p of players)for(const y of [0,3.5])for(const x of [-.8,.8])for(const z of [-.8,.8]){const point=new Vector3(p.x+x,y+(p.airMotion?.height||0),p.z+z).project(camera);assert.ok(Math.abs(point.x)<=.761);assert.ok(Math.abs(point.y)<=.721);assert.ok(point.z<1);}
 }
});
