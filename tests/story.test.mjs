import test from 'node:test';import assert from 'node:assert/strict';
import {episode,series,EPISODES,opponentFor} from '../dist/story.js';
import {fighters} from '../dist/fighters.js';
// Story content is authored and tested ahead of the mode being wired into the menu.
test('every fighter has a complete six-episode series with distinct titles and a mirror finale',()=>{
 for(let id=0;id<fighters.length;id++){
  const show=series[fighters[id].id];assert.equal(show.titles.length,EPISODES);assert.equal(show.lines.length,EPISODES);assert.equal(new Set(show.titles).size,EPISODES);
  for(let stage=0;stage<EPISODES;stage++){const ep=episode(id,stage);assert.equal(ep.number,stage+1);assert.equal(ep.opponent,opponentFor(id,stage));assert.equal(ep.lines.length,2);assert.ok(ep.lines.every(l=>l.text.length>10&&l.speaker));
   if(stage<EPISODES-1){assert.equal(ep.final,false);assert.ok(ep.preview.includes(show.titles[stage+1]));assert.equal(ep.epilogue,null);}
   else{assert.equal(ep.final,true);assert.equal(ep.opponent,id);assert.equal(ep.rivalName,'RIFT ECHO');assert.equal(ep.preview,null);assert.equal(ep.epilogue,fighters[id].ending);}}
 }
});
