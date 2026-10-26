import {Bone,Euler} from './vendor/three.module.js';
import {RIG_BONES,RIG_PARENT} from './rig-schema.js';
import {talaV3Joints} from './tala-v3-joints.js';
// Graphic Tala's deformation skeleton. The first 17 roles retain the combat contract.
export const combatRigSpec=RIG_BONES.map(name=>({name,parent:RIG_PARENT[name],at:[...talaV3Joints[name]]}));
const add=(name,parent,at)=>combatRigSpec.push({name,parent,at});
add('pelvis.control','root',[0,1.61,0]);add('spine.lower','pelvis.control',[0,1.82,0]);add('spine.upper','spine.lower',[0,2.02,0]);add('neck.control','chest',[0,2.49,.045]);
combatRigSpec[1].parent='spine.upper';combatRigSpec[1].at=[0,2.20,0];combatRigSpec[2].parent='neck.control';
for(const S of ['L','R']){
 const side=S==='L'?-1:1,x=side*.2744;
 add('clavicle.'+S,'chest',[side*.10,2.31,.02]);
 combatRigSpec.find(b=>b.name==='upper_arm.'+S).parent='clavicle.'+S;
 combatRigSpec.find(b=>b.name==='thigh.'+S).parent='pelvis.control';
 add('upper_twist.'+S,'upper_arm.'+S,[x,2.13,.0281]);add('fore_twist.'+S,'forearm.'+S,[x,1.69,.0281]);
 add('toe.'+S,'foot.'+S,[side*.1482,.055,.22]);
 for(let finger=0;finger<5;finger++){
  const fx=finger===4?x-side*.052:x+(finger-1.5)*.024,y=finger===4?1.465:1.435;
  for(let j=0;j<3;j++)add(`finger${finger}.${j}.${S}`,j?`finger${finger}.${j-1}.${S}`:'hand.'+S,[fx,y-(finger===4?[0,.025,.049][j]:[0,.04,.068][j]),finger===4?.065:.035]);
 }
}
add('ponytail.mid','ponytail',[0,2.62,-.35]);add('ponytail.tip','ponytail.mid',[0,2.35,-.48]);
export const combatBoneIndex=Object.fromEntries(combatRigSpec.map((b,i)=>[b.name,i]));
export function installCombatRig(r,mapped){
 for(const spec of combatRigSpec)if(!mapped.has(spec.name)){const b=new Bone();b.name=spec.name;mapped.set(spec.name,b);}
 const specs=new Map(combatRigSpec.map(b=>[b.name,b]));
 for(const spec of combatRigSpec){const b=mapped.get(spec.name),parent=spec.parent?mapped.get(spec.parent):r.g;parent.add(b);const p=spec.parent?specs.get(spec.parent).at:[0,0,0];b.position.set(...spec.at.map((v,i)=>v-p[i]));b.rotation.set(0,0,0);}
 for(const spec of combatRigSpec)mapped.set(spec.name.replaceAll('.',''),mapped.get(spec.name));
 r.combatRig=mapped;r.deformBones=combatRigSpec.map(s=>mapped.get(s.name));r.headRest=r.head.position.clone();
 r.g.updateMatrixWorld(true);
}
export function resetCombatRig(r){
 if(!r.combatRig)return;
 if(r.combatDriverPose){r.spine.rotation.copy(r.combatDriverPose.chest);r.head.rotation.copy(r.combatDriverPose.head);}
 for(const spec of combatRigSpec.slice(17))r.combatRig.get(spec.name).rotation.set(0,0,0);
 for(const S of ['L','R'])r.combatRig.get('hand.'+S).rotation.set(0,0,0);
}
// Retain authored timing; distribute the resulting pose over the richer deformation chain.
export function finishCombatRig(r,p,time){
 const b=r.combatRig;if(!b)return;
 const chest=r.spine.rotation.clone(),head=r.head.rotation.clone();r.combatDriverPose={chest,head};
 b.get('spine.lower').rotation.set(chest.x*.25,chest.y*.25,chest.z*.25);
 b.get('spine.upper').rotation.set(chest.x*.30,chest.y*.30,chest.z*.30);
 r.spine.rotation.set(chest.x*.45,chest.y*.45,chest.z*.45);
 b.get('neck.control').rotation.set(head.x*.4,head.y*.35,head.z*.4);r.head.rotation.set(head.x*.6,head.y*.65,head.z*.6);
 const guard=!!p?.guard,kind=p?.move?.kind,open=['shot','forward','back'].includes(kind)||p?.anim==='charge';
 const dt=Math.max(0,Math.min(.1,time-(r.combatRigTime??time)));r.combatRigTime=time;r.combatHandRoll??=[1.05,1.05];
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 const m=p?.move,opening=open?(m?smooth(m.frame/Math.max(1,m.startup))*(1-smooth((m.frame-m.startup-m.active)/Math.max(1,m.recovery))):1):0;
 for(const [i,S] of ['L','R'].entries()){
  const side=i?1:-1,arm=r.limbs[i*2],hand=b.get('hand.'+S),reach=Math.max(0,Math.min(1,-arm.rotation.x/1.6));
  b.get('clavicle.'+S).rotation.set(0,-side*.10*reach,side*(guard?.06:.035)*reach);
  // Neutral wrists stay aligned with the forearm; pronation turns the palm inward in stance.
  // A straight punch progressively rolls the knuckles over as the elbow extends.
  const straight=kind==='strike'&&p.move.chain<3,extension=Math.max(0,Math.min(1,1+ r.elbows[i].rotation.x/1.4));
  const roll=guard?.25:straight?.85+(1-extension)*.2:1.05;
  const contact=kind==='strike'&&p.move.frame>=p.move.startup;
  r.combatHandRoll[i]=contact?roll:r.combatHandRoll[i]+(roll-r.combatHandRoll[i])*(1-Math.exp(-20*dt));
  hand.rotation.set(0,side*r.combatHandRoll[i],0);b.get('fore_twist.'+S).rotation.y=side*r.combatHandRoll[i]*.5;
  b.get('upper_twist.'+S).rotation.y=arm.rotation.y*.25;
  for(let f=0;f<5;f++)for(let j=0;j<3;j++){
   const joint=b.get(`finger${f}.${j}.${S}`),curl=1-.92*opening;
   joint.rotation.x=(f===4?[-.3,-.4,-.2][j]:[-1.15,-1.65,-.75][j])*curl;
   if(f===4&&j===0)joint.rotation.z=side*1.1*curl;
  }
  const pivot=r.footPivot?.(p,kind)?.[i];b.get('toe.'+S).rotation.x=pivot?-new Euler().setFromQuaternion(pivot).x:0; // Counter-roll around the planted ball during a punch.
 }
 const pony=r.clothParts[0];b.get('ponytail.mid').rotation.set(pony.rotation.x*.45,0,pony.rotation.z*.45);
 b.get('ponytail.tip').rotation.set(pony.rotation.x*.25,0,pony.rotation.z*.25);
}
