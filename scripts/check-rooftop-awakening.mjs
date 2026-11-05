import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const b=await build({entryPoints:['utils/rooftopModel.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {RooftopMatch,specialFor}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const step=(m,t)=>{for(let n=0;n<Math.ceil(t/.01);n++)m.update(.01);};
function fixture(cast){const m=new RooftopMatch(()=>.5);m.start(cast);step(m,2.5);m.fighters.forEach((p,i)=>Object.assign(p,{x:[0,180,450,-450][i],y:i<2?0:330,angle:i===0?0:Math.PI,ai:999,specialCooldown:999}));return m;}
// State fixtures test boundaries, not used as evidence for gameplay wins.
for(let cast=0;cast<7;cast++){
 const m=fixture(cast),p=m.fighters[0],hp=p.hp;
 m.action(0,'awaken');assert.equal(p.awakened,0,'Cannot activate empty gauge');
 p.awakening=100;m.action(0,'awaken');assert.equal(p.awakened,10);assert.equal(p.hp,hp);assert.equal(p.invulnerable,0);assert.equal(p.awakening,0);
 m.pause();step(m,1);assert.equal(p.awakened,10);m.pause();step(m,.4);
 p.meter=0;m.action(0,'special');assert(p.awakenedSpecial);assert.equal(p.awakened,0);assert.equal(p.specialLeft,specialFor(p).duration);
 step(m,1.5);assert.equal(p.specialLeft,0);assert(!p.awakenedSpecial);assert(m.fighters[1].hp<180,`finisher ${cast} hits`);
 if(cast===6){assert.equal(m.events.filter(e=>e.kind==='special-impact').length,1,'Cannon fires once');assert.equal(m.fighters[1].hp,122);}
 const expired=fixture(cast);expired.fighters[0].awakening=100;expired.action(0,'awaken');step(expired,10.1);assert.equal(expired.fighters[0].awakened,0);
}
let m=fixture(6);m.fighters[0].awakening=100;m.action(0,'awaken');step(m,.4);m.action(0,'special');m.fighters[0].stun=.3;step(m,1.5);assert.equal(m.fighters[1].hp,180,'Interrupted cannon startup has no damage');
console.log('P0 PASS: seven awakenings, empty gauge lock, no healing/invulnerability, pause, expiry, finisher consumes duration, cannon single 58 hit, interrupt.');
// Input-only bots: no teleport, health mutation or internal finish calls.
const results=[];
for(let cast=0;cast<7;cast++)for(const seed of [121,371,901]){
 let rng=seed;const random=()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)/2**32);
 const game=new RooftopMatch(random);game.start(cast,'crown');let awakes=0,finishers=0,damage=0,previousHp=180;
 for(let tick=0;tick<9500&&!['finished','round'].includes(game.phase);tick++){
  const p=game.fighters[0];const target=game.fighters.filter(q=>q!==p&&q.alive).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
  if(target){const dx=target.x-p.x,dy=target.y-p.y;game.stick={x:Math.abs(dy)>45&&Math.abs(dx)<150?(dx>=0?-1:1):Math.sign(dx),y:Math.abs(dy)>15?Math.sign(dy):0};}
  if(tick%18===0){if(p.awakening>=100)game.action(0,'awaken');else if(p.awakened>0&&p.awakened<6)game.action(0,'special');else if(tick%72===0)game.action(0,'heavy');else game.action(0,'push');}
  game.update(.01);damage+=Math.max(0,previousHp-p.hp);previousHp=p.hp;
  for(const e of game.events.splice(0)){if(e.cast===cast&&e.kind==='awaken')awakes++;if(e.cast===cast&&e.kind==='special'&&e.awakened)finishers++;}
  for(const q of game.fighters)assert(Number.isFinite(q.hp)&&Number.isFinite(q.awakened)&&q.awakening<=100);
 }
 assert.equal(game.phase,'finished');results.push({cast,seed,winner:game.winner,time:game.time,healthLoss:damage,awakes,finishers});
}
assert(results.every(r=>r.awakes>0),'Each cast can earn awakening using normal inputs');
fs.mkdirSync('output/awakening-design',{recursive:true});fs.writeFileSync('output/awakening-design/bot-results.json',JSON.stringify(results,null,2));
console.log(`P1 PASS: ${results.length} input-only seeded crown games; awakenings ${results.reduce((n,r)=>n+r.awakes,0)}, finishers ${results.reduce((n,r)=>n+r.finishers,0)}. Not FPS or human fun approval.`);
