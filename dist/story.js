import {fighters} from './fighters.js';
// Story mode presents each fighter's run as a six-episode series: a title card, a short
// exchange before the bout, and a preview of the next episode after a win. The final
// episode is a mirror match against the fighter's own reflection in the rift.
export const EPISODES=6;
export const series={
 aegis:{name:'LAST TRANSMISSION',teaser:'The signal grows louder.',
  titles:['A Signal Through the Breach','No Sacred Weapon','The Price of a Knight','Burning Pages','The Oracle Who Remembered Me','The Knight in the Glass'],
  lines:['Your shadow bends the signal. Step aside, or I cut through both of you.','Discipline without a cause is only noise. Show me yours has a reason.','I once wore a contract too. Mine was written in orbit.','Every page you burn, I lose another coordinate. Close the book, archivist.','You remember me? Then you remember how this ends.','So the rift keeps a copy. Let us see which of us still answers the call.'],
  echo:'The transmission was never for you, sentinel. It was for me.'},
 rei:{name:'TWO SHADOWS',teaser:'One memory closer.',
  titles:['The Name I Cannot Say','Iron Does Not Remember','A Page With My Face','Every World That Ended','Orbit of a Fallen Star','The Shadow Steps Forward'],
  lines:['Your fists speak clearly. Mine have to speak for two.','You trade days for coin, pilgrim. I am trading them for a name.','That atlas has my face in it. Hand it over, or I will take the page.','You watched every ending. Tonight, watch mine stay open.','A knight who fell from the sky. Then you know how far the dark goes.','There you are. The shadow I was never allowed to meet.'],
  echo:'You wanted your memories back? Come and take them from me.'},
 tala:{name:'DISCIPLINE',teaser:'Breathe. Then strike.',
  titles:['Bounty on Fate','Fire Is Just Breath','Prophecy Can Wait','Knights Fall Too','The Girl With Two Shadows','Punch a Hole in the Sky'],
  lines:['Big sword, bigger debt. Let me settle it for you the fast way.','Your fire is just breath with ambition. I have better breath.','Save the prophecy, oracle. I did not come here to be foretold.','Orbit, armor, destiny. None of it blocks a straight punch.','Two shadows, one stance. Which one of you do I hit first?','Fate sent a copy. Fate should have sent the original.'],
  echo:'Fate finally sent someone with your discipline. Me.'},
 morrow:{name:'ONE MORE CONTRACT',teaser:'The ledger is almost closed.',
  titles:['Paid in Ashes','The Oracle\'s Ledger','Debt of a Sentinel','An Echo Owes Nothing','Storm Without a Price','The Man I Left Behind'],
  lines:['The bounty says alive. Stop burning things and this stays easy.','You keep a ledger of worlds. I keep one of debts. Yours is overdue.','Fallen knights pay well. Nothing personal, sentinel.','No price on your head, echo. I am here for the one on mine.','Nobody pays me to fight you, kid. Think of this as a favor.','So this is what I left behind. He looks tired.'],
  echo:'You cannot buy back the man you were, Morrow. He was never for sale.'},
 sol:{name:'THE LAST PAGE',teaser:'The ink is still wet.',
  titles:['Footnotes of the End','Orbital Annotation','The Chapter She Forgot','Unwritten Storm','Margin of Iron','The Author Appears'],
  lines:['You are a footnote in the atlas, oracle. Let me correct the citation.','A sentinel who fell. The atlas predicted the fall but not the landing.','Your missing chapter is in my book. Win it back if you can read fire.','No entry for you, storm disciple. Forgive me if I write one now.','Iron, rust, regret. The atlas calls you a margin note.','The last page has an author. Apparently it is me.'],
  echo:'The page was always going to end with you, Sol. I wrote it that way.'},
 vesper:{name:'INTERFERENCE',teaser:'The outcome is no longer fixed.',
  titles:['A Knight I Have Buried Before','The Echo Variant','Variables Named Tala','Iron Pilgrim, Again','Reading the Reader','The Star I Never Saw'],
  lines:['I have buried you in nine worlds, sentinel. Let us try a tenth.','Two souls in one shadow. In most worlds, only one survives this.','Every world that had you, had a hole punched through it. Interesting.','You take the contract every time, pilgrim. This time, decline.','You read the end of the atlas. I was there when it was written.','The one variable I never recorded. Myself.'],
  echo:'You interfered, Vesper. Now the sky has to choose one of us.'}
};
export const rivalLines={
 aegis:'Stand down. I am not here for you.',rei:'Two of us. One of you. Think carefully.',tala:'Fists up. Talk after.',morrow:'Contract says I win. Contracts are usually right.',sol:'Everything you are about to do is already written.',vesper:'I have seen this fight. You will not like the ending.'
};
export function opponentFor(selected,stage,roster=fighters.length){return (selected+stage+1)%roster;}
export function episode(selected,stage){
 const hero=fighters[selected],show=series[hero.id],number=stage+1,final=number===EPISODES;
 const opponent=opponentFor(selected,stage),rival=fighters[opponent];
 const rivalName=final?'RIFT ECHO':rival.name;
 const lines=[{speaker:hero.name,color:hero.color,text:show.lines[stage]},{speaker:rivalName,color:rival.color,text:final?show.echo:rivalLines[rival.id]}];
 const next=final?null:{number:number+1,title:show.titles[stage+1]};
 return {series:show.name,number,total:EPISODES,title:show.titles[stage],final,opponent,rivalName,lines,next,preview:next?`Next time on ${show.name}: Episode ${next.number}, "${next.title}". ${show.teaser}`:null,epilogue:final?hero.ending:null};
}
