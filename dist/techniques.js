// Original signature tuning. Movement locks to the aim at startup.
export const techniques={
 aegis:{startup:18,active:18,recovery:28,speed:12,reach:1.9,damage:12,effect:'drive'},
 rei:{startup:18,active:16,recovery:28,speed:0,reach:3.3,damage:11,effect:'spin'},
 tala:{startup:18,active:15,recovery:28,speed:10,reach:1.8,damage:10,launch:true,effect:'rise'},
 morrow:{startup:18,active:20,recovery:26,speed:8,reach:2.5,damage:15,effect:'charge'},
 sol:{startup:18,active:20,recovery:26,speed:0,reach:3,damage:10,effect:'sphere'},
 vesper:{startup:18,active:4,recovery:28,speed:0,reach:0,damage:12,effect:'wheel'}
};
// An extra neutral attack tap during wind-up selects an alternate technique.
// These are original timings and effects informed by the PAL move guide.
export const techniqueVariants={
 aegis:{name:'Twin drive',damage:8,active:28,secondHit:14},
 rei:{name:'Twin moon',damage:7,active:28,secondHit:14},
 tala:{name:'Skybreaker kick',damage:13,speed:14,reach:2.2,launch:false,effect:'kick'},
 morrow:{name:'Iron lance',damage:14,speed:0,active:1,effect:'lance'},
 sol:{name:'Solar ward',damage:12,reach:4.2,active:28},
 vesper:{name:'Orbit fan',damage:7,active:18,effect:'fan'}
};
export function canFollowUp(move){
 return !!move&&move.kind==='technique'&&!move.empowered&&!move.followup&&move.frame<move.startup;
}
export function applyTechniqueVariant(move,id){
 const variant=techniqueVariants[id];
 Object.assign(move,variant,{followup:true});
 move.total=move.startup+move.active+move.recovery;
}
