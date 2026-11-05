import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCampaign,stepCampaign,companionInput,STAGES,WIDTH,LANE} from '../public/elemental/coop.mjs';
const run=(g,n,fn)=>{for(let i=0;i<n&&!['win','lose'].includes(g.phase);i++)stepCampaign(g,fn(g,i));return g;};
function bot(g,h){if(g.phase==='stageClear')return {next:true};if(h.hp<=0)return {};if(g.phase==='travel')return {x:1};return companionInput(g,h);}
const results=[];
for(const mode of ['solo','duo'])for(const seed of [7,19,42]){
 const g=createCampaign({mode,seed});let frames=0,maxEnemies=0,maxEvents=0;
 while(frames<72000&&!['win','lose'].includes(g.phase)){
  stepCampaign(g,[bot(g,g.heroes[0]),bot(g,g.heroes[1])]);frames++;maxEnemies=Math.max(maxEnemies,g.enemies.filter(e=>e.hp>0).length);maxEvents=Math.max(maxEvents,g.events.length);
  for(const h of g.heroes){assert.ok(Number.isFinite(h.x)&&h.x>=70&&h.x<=WIDTH-70);assert.ok(h.y>=LANE[0]&&h.y<=LANE[1]);assert.ok(h.hp>=0&&h.hp<=120);}
  assert.ok(g.camera>=0&&g.camera<=WIDTH-960);assert.ok(g.events.length<=100);assert.ok(g.projectiles.length<=12);
 }
 const result={mode,seed,result:g.phase,seconds:+g.time.toFixed(2),hp:g.heroes.map(h=>h.hp),hpLost:g.stats.damage,kills:g.totalKills,maxEnemies,maxEvents,skills:g.stats.skills,bursts:g.stats.bursts,revives:g.stats.revives,stages:g.stats.stages,bosses:g.stats.bosses};results.push(result);console.log(JSON.stringify(result));
 assert.equal(g.phase,'win',`${mode}/${seed} completes all stages with ordinary inputs`);assert.equal(g.stats.stages.length,3);assert.equal(g.stats.bosses.at(-1)?.result,'win');
 const replay=createCampaign({mode,seed});run(replay,frames,r=>[bot(r,r.heroes[0]),bot(r,r.heroes[1])]);assert.deepEqual(replay,g,'deterministic full campaign replay');
}
// Friendly fire cannot damage a partner, including repeated element skills.
const friends=createCampaign({mode:'duo'});run(friends,600,()=>[{attack:true,magic:true},{}]);assert.deepEqual(friends.heroes.map(h=>h.hp),[120,120]);
const loss=createCampaign({mode:'duo'});run(loss,600,()=>[{x:1},{x:1}]);run(loss,15000,()=>[{},{}]);assert.equal(loss.phase,'lose');const stopped=JSON.stringify(loss);stepCampaign(loss,[{attack:true},{magic:true}]);assert.equal(JSON.stringify(loss),stopped);
assert.equal(STAGES.reduce((n,s)=>n+s.waves.flat().length,0),39);
// Downing and rescue are produced through movement, enemy attacks and held revive input.
const rescue=createCampaign({mode:'duo'});let rFrames=0;
while(rescue.heroes[0].hp>0&&rFrames++<15000)stepCampaign(rescue,[{x:rescue.heroes[0].x<800?1:0},{}]);
assert.equal(rescue.heroes[0].hp,0);assert.ok(rescue.heroes[1].hp>0);
while(rescue.stats.revives===0&&rescue.phase!=='lose'&&rFrames++<20000)stepCampaign(rescue,[{},companionInput(rescue,rescue.heroes[1])]);
assert.equal(rescue.stats.revives,1);assert.ok(rescue.heroes[0].hp>0);
fs.mkdirSync(new URL('../output/elemental/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../output/elemental/coop-v5-results.json',import.meta.url),JSON.stringify({date:'2026-11-06',inputOnly:true,P0:'pass',P1:'pass',results},null,2));
console.log('P0/P1 COOP PASS');
