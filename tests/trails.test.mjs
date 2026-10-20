import test from 'node:test';import assert from 'node:assert/strict';
import {trailAnchors,swingWindow,dashing,ribbonData,TRAIL_SAMPLES} from '../dist/trails.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
test('every fighter has a trail anchor on a real hand joint and weapon users keep the right hand',()=>{
 for(const f of fighters){const a=trailAnchors(f.id);const rig=buildCharacter(fighters.indexOf(f));const hand=rig.limbs[a.hand==='left'?0:2].userData.hand;assert.ok(hand,f.id);assert.ok(a.tip[2]>=a.base[2]||a.tip[1]!==a.base[1],f.id);assert.ok(a.width>0);}
 assert.equal(trailAnchors('tala',1).hand,'right');assert.equal(trailAnchors('tala',2).hand,'left');assert.equal(trailAnchors('rei',2).hand,'right');
 assert.ok(trailAnchors('morrow').tip[2]>trailAnchors('aegis').tip[2],'greatsword trail is longer');
});
test('swing window spans contact and a short follow-through, and skips non-swinging techniques',()=>{
 const strike={...moveTiming(fighters[0],'strike'),kind:'strike',frame:0};
 assert.equal(swingWindow(strike),false);assert.equal(swingWindow({...strike,frame:strike.startup}),true);assert.equal(swingWindow({...strike,frame:strike.startup+strike.active+5}),true);assert.equal(swingWindow({...strike,frame:strike.total-1}),false);
 assert.equal(swingWindow({kind:'shot',startup:5,active:1,recovery:10,frame:5}),false);assert.equal(swingWindow({kind:'technique',effect:'sphere',startup:5,active:20,recovery:10,frame:6}),false);assert.equal(swingWindow({kind:'technique',effect:'drive',startup:5,active:20,recovery:10,frame:6}),true);assert.equal(swingWindow(null),false);
});
test('afterimages appear for dashes, jumps and rolls but not for launched or idle fighters',()=>{
 assert.equal(dashing({anim:'idle',air:0}),false);assert.equal(dashing({anim:'jump',air:.5,launched:false}),true);assert.equal(dashing({anim:'launch',air:.5,launched:true}),false);
 assert.equal(dashing({anim:'roll',air:0}),true);assert.equal(dashing({move:{kind:'pursuit',frame:3,startup:7,active:1}}),true);assert.equal(dashing({move:{kind:'pursuit',frame:9,startup:7,active:1},anim:'pursuit',air:0}),false);
 assert.equal(dashing({move:{kind:'technique',speed:12,frame:13,startup:12,active:18}}),true);assert.equal(dashing({move:{kind:'technique',speed:0,frame:13,startup:12,active:18}}),false);
});
test('ribbon data fades older samples and never exceeds the buffer',()=>{
 const samples=Array.from({length:TRAIL_SAMPLES},(_,i)=>[[i,0,0],[i,1,0]]);const d=ribbonData(samples,'#ffffff');
 assert.equal(d.positions.length,TRAIL_SAMPLES*6);assert.equal(d.colors.length,TRAIL_SAMPLES*6);assert.equal(d.indices.length,(TRAIL_SAMPLES-1)*6);
 assert.equal(d.colors[0],0);assert.ok(Math.abs(d.colors[d.colors.length-1]-1)<1e-9);assert.ok(d.colors[6*7]>d.colors[6*3]);
 const one=ribbonData([[[0,0,0],[0,1,0]]],'#ff0000');assert.equal(one.indices.length,0);assert.equal(one.colors[0],1);
});
test('launched fighters tumble through the air and settle before knockdown',()=>{
 const rig=buildCharacter(0);
 animateCharacter(rig,{anim:'launch',air:.8,launched:true,animTime:.4},0);const early=rig.body.rotation.x;
 animateCharacter(rig,{anim:'launch',air:.2,launched:true,animTime:.4},0);const late=rig.body.rotation.x;
 assert.ok(early<0&&late<early,'rotation grows as the fighter falls');
 animateCharacter(rig,{anim:'jump',air:.5,launched:false,animTime:.4},0);assert.equal(rig.body.rotation.x,0,'voluntary jumps do not tumble');
});
import {createTrailEffects} from '../dist/trails.js';
import {Scene} from '../dist/vendor/three.module.js';
import {createMatch} from '../dist/combat.js';
test('scene effects draw a ribbon during a swing, spawn fading afterimages while dashing and flash the guard shield',()=>{
 const scene=new Scene(),fx=createTrailEffects(scene),m=createMatch(3,1),models=m.players.map(p=>buildCharacter(p.id));
 const strike={...moveTiming(fighters[3],'strike'),kind:'strike',chain:1,frame:0};
 m.players[0].move=strike;
 for(let f=0;f<=strike.startup+2;f++){strike.frame=f;animateCharacter(models[0],m.players[0],f/60);fx.update(models,m,1/60);}
 const ribbon=scene.children.find(o=>o.geometry?.attributes?.color);assert.ok(ribbon.visible,'ribbon visible at contact');
 const positions=ribbon.geometry.attributes.position.array;assert.ok(Array.from(positions.slice(0,ribbon.geometry.drawRange.count)).every(Number.isFinite));
 assert.ok(Math.hypot(positions[0]-positions[3],positions[1]-positions[4],positions[2]-positions[5])>1,'greatsword ribbon spans the blade');
 m.players[0].move=null;for(let i=0;i<TRAIL_SAMPLES+1;i++)fx.update(models,m,1/60);assert.equal(ribbon.visible,false,'ribbon clears after the swing');
 m.players[1].move={kind:'pursuit',frame:1,startup:7,active:1,recovery:30};fx.update(models,m,1/60);
 const ghosts=scene.children.filter(o=>o.isGroup&&o!==models[0].g&&o!==models[1].g);assert.equal(ghosts.length,1);assert.equal(ghosts[0].visible,true);
 for(let i=0;i<4;i++)fx.update(models,m,.02);assert.equal(ghosts.length,1,'one ghost per interval');
 m.players[1].move=null;for(let i=0;i<30;i++)fx.update(models,m,1/60);assert.equal(ghosts[0].visible,false,'ghost fades out');
 m.players[1].guard=true;fx.update(models,m,1/60);const shields=scene.children.filter(o=>o.geometry?.type==='CircleGeometry');assert.equal(shields[1].visible,true);const faint=shields[1].material.opacity;
 fx.block(models[1],true);fx.update(models,m,1/60);assert.ok(shields[1].material.opacity>faint+.3,'block flashes the shield');assert.equal(shields[1].material.color.getHexString(),'ffffff');
 m.players[1].guard=false;for(let i=0;i<20;i++)fx.update(models,m,1/60);assert.equal(shields[1].visible,false);
 fx.reset();assert.equal(scene.children.filter(o=>o.geometry?.attributes?.color).length,0);
});
