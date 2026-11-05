import fs from 'node:fs';import assert from 'node:assert/strict';import ts from 'typescript';
const js=ts.transpileModule(fs.readFileSync('utils/rooftopModel.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {RooftopMatch,CAST,BODY,MAX_HP}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const step=(m,t)=>{for(let n=0;n<Math.round(t/.01);n++)m.update(.01);};
// Focused unit fixtures may set positions/state; full seeded matches below use inputs only.
function fixture(){const m=new RooftopMatch(()=>.5);m.start(6,'crown');step(m,2.5);m.fighters.forEach((p,i)=>Object.assign(p,{x:[0,180,450,-450][i],y:i<2?0:330,stun:i?999:0,ai:999}));m.navigate=()=>({x:0,y:0});m.crown={owner:-1,x:0,y:0,lock:0,previous:-1,ban:0};return m;}
let m=fixture();m.update(.01);assert.equal(m.crown.owner,0);let score=m.scores[0];step(m,1);assert(Math.abs(m.scores[0]-score-1)<1e-6);
m.time=69.5;score=m.scores[0];step(m,1);assert(Math.abs(m.scores[0]-score-1.5)<1e-6,'70-second boundary splits normal/double points');
m.pause();const paused=JSON.stringify([m.time,m.scores,m.crown,m.respawns]);step(m,2);assert.equal(JSON.stringify([m.time,m.scores,m.crown,m.respawns]),paused);m.pause();
m=fixture();m.update(.01);Object.assign(m.fighters[1],{stun:0,angle:Math.PI});m.action(1,'heavy');step(m,.6);assert.notEqual(m.crown.owner,0,'Confirmed heavy dislodges crown');assert(m.events.some(e=>e.text==='왕관 떨어짐!'));assert(m.crown.ban>0);assert(m.crown.previous===0);
m=fixture();m.update(.01);Object.assign(m.fighters[1],{stun:0,angle:Math.PI});m.action(1,'push');step(m,.3);assert.equal(m.crown.owner,0,'Ordinary light strike does not freely steal crown');
m=fixture();m.update(.01);score=m.scores[0];m.eliminate(0);assert.equal(m.crown.owner,-1);step(m,2.49);assert(!m.fighters[0].alive);step(m,.02);assert(m.fighters[0].alive);assert.equal(m.fighters[0].hp,MAX_HP);assert(m.fighters[0].invulnerable>1);assert.equal(m.scores[0],score);assert.equal(m.fighters[0].meter,50);
m=fixture();m.fighters.slice(1).forEach((_,i)=>m.eliminate(i+1));m.update(.01);assert.equal(m.phase,'playing','Surviving alone never ends crown match early');m.time=89.99;m.scores=[20,10,5,0];m.update(.01);assert.equal(m.phase,'finished');assert.equal(m.winner,0);assert.equal(m.time,90);
m=fixture();m.time=89.99;m.crown.lock=5;m.scores=[2,2,0,0];m.update(.01);assert.equal(m.winner,-1,'Equal displayed scores tie');m.start(1,'brawl');assert.equal(m.duration,120);assert.deepEqual(m.scores,[0,0,0,0]);assert.equal(m.crown.owner,-1);
console.log('P0 PASS: pickup, 1x/2x boundary, pause, heavy drop/light retention, KO/2.5s respawn/protection/score retention, timed finish/tie, reset and classic mode.');
function run(cast,seed){let state=seed;const m=new RooftopMatch(()=>((state=(state*1664525+1013904223)>>>0)/4294967296));m.start(cast,'crown');let drops=0,pickups=0,respawns=0;
 for(let frame=0;frame<10000&&m.phase!=='finished';frame++){
  const p=m.fighters[0];if(m.phase==='playing'&&p.alive){
   let target=m.crown.owner>=0?m.fighters[m.crown.owner]:m.crown;
   if(m.crown.owner===0){const enemies=m.fighters.slice(1).filter(q=>q.alive);const spots=[[-430,-270],[430,-270],[-430,270],[430,270]];spots.sort((a,b)=>Math.min(...enemies.map(q=>Math.hypot(b[0]-q.x,b[1]-q.y)))-Math.min(...enemies.map(q=>Math.hypot(a[0]-q.x,a[1]-q.y))));target={x:spots[0][0],y:spots[0][1]};}
   const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy);m.stick={x:dx/Math.max(1,d),y:dy/Math.max(1,d)};
   const obstacle=m.fighters.slice(1).find(q=>q.alive&&Math.abs(q.x-p.x)<BODY.x+15&&Math.abs(q.y-p.y)<BODY.y+30&&Math.abs(dy)>50);if(obstacle)m.stick.x=p.x<obstacle.x?-1:1;
   if(m.crown.owner>0&&d<205&&Math.abs(dy)<45){m.stick={x:Math.sign(dx),y:0};if(frame%10===0)m.action(0,p.meter>=100?'special':'heavy');}
  }
  m.update(.01);for(const e of m.events.splice(0)){if(e.text==='왕관 떨어짐!')drops++;if(e.text==='왕관 획득!')pickups++;if(e.kind==='respawn')respawns++;}
  assert(m.crown.owner<0||m.fighters[m.crown.owner].alive);assert(m.scores.every(s=>Number.isFinite(s)&&s>=0));
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const a=m.fighters[i],b=m.fighters[j];if(a.alive&&b.alive)assert(Math.abs(a.x-b.x)>=BODY.x-.06||Math.abs(a.y-b.y)>=BODY.y-.06,'Body overlap after respawn');}
 }
 assert.equal(m.phase,'finished');assert.equal(m.time,90);if(m.scores.reduce((a,b)=>a+b,0)<=30)console.log('low',cast,seed,m.crown,m.scores,m.fighters.map(p=>({x:p.x,y:p.y,hp:p.hp})));assert(m.scores.reduce((a,b)=>a+b,0)>30,'Bots must pursue and hold crown');if(pickups<=1)console.log('uncontested',cast,seed,m.scores,m.fighters.map(p=>({cast:p.cast,x:p.x,y:p.y,hp:p.hp})));assert(pickups>1,'Crown changes hands');
 return {cast,seed,winner:m.winner,scores:m.scores.map(s=>+s.toFixed(3)),drops,pickups,respawns};
}
const results=[];for(let cast=0;cast<CAST.length;cast++)for(const seed of [121,371,901]){const r=run(cast,seed);assert.deepEqual(run(cast,seed),r);results.push(r);}
fs.mkdirSync('output/crown',{recursive:true});fs.writeFileSync('output/crown/model-bots.json',JSON.stringify({date:'2026-11-05',inputOnly:true,renderedFPS:false,results},null,2));console.log('P1 PASS: 21 deterministic input-only 90s crown matches, contested crowns and solid respawns.',JSON.stringify({drops:results.reduce((n,r)=>n+r.drops,0),respawns:results.reduce((n,r)=>n+r.respawns,0),wins:results.filter(r=>r.winner===0).length}));




