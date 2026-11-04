import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../utils/rooftopModel.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {RooftopMatch,CAST,stickVector,WEAPONS,ARENA,MAX_HP}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const step=(m,n)=>{for(let t=0;t<n;t+=.01)m.update(.01);};
function fixture(){const m=new RooftopMatch(()=>.5);m.start(0);step(m,2.5);m.fighters.forEach((p,i)=>{p.x=[0,70,450,-450][i];p.y=i<2?0:300;p.angle=0;p.ai=999;});return m;}
function attack(m,kind='push'){m.action(0,kind);step(m,m.fighters[0].attackDuration*.5+.01);}
assert.equal(CAST.length,6);assert.deepEqual(stickVector(3,3),{x:0,y:0});assert.equal(stickVector(100,0).x,1);
let m=fixture();m.pause();const t=m.time;step(m,1);assert.equal(m.time,t);m.pause();
m.action(0,'push');assert.equal(m.fighters[1].hp,MAX_HP);step(m,.18);assert(m.fighters[1].hp<MAX_HP);const hp=m.fighters[1].hp;step(m,.1);assert.equal(m.fighters[1].hp,hp,'One impact per swing; no regeneration');
assert(Math.abs(m.fighters[1].vx)<90,'Light hits do not launch opponent');
m=fixture();m.action(0,'push');m.fighters[0].stun=.5;step(m,.3);assert.equal(m.fighters[1].hp,MAX_HP,'Interrupted startup does no damage');
m=fixture();m.fighters[1].angle=Math.PI;m.action(1,'guard');attack(m);assert.equal(m.fighters[1].hp,MAX_HP,'Frontal guard blocks light attack');
m=fixture();m.fighters[1].angle=Math.PI;m.action(1,'guard');attack(m,'heavy');assert(m.fighters[1].hp<MAX_HP);assert(m.events.some(e=>e.text==='GUARD BREAK'));assert(m.fighters[1].down>0);
m=fixture();m.action(1,'dash');m.fighters[1].x=60;m.fighters[1].vx=0;m.fighters[0].attackStep=1;m.strike(0);assert.equal(m.fighters[1].hp,MAX_HP,'Dodge invulnerability avoids damage');
m=fixture();m.action(1,'jump');attack(m);assert.equal(m.fighters[1].hp,MAX_HP,'Jump avoids grounded hit');
m=fixture();m.fighters[0].stamina=0;for(const a of ['heavy','dash','jump','guard'])m.action(0,a);assert.equal(m.fighters[0].poseTime,0);assert.equal(m.fighters[0].dash,0);
m=fixture();m.fighters[1].y=80;m.fighters[0].cast=4;m.strike(0);assert.equal(m.fighters[1].hp,MAX_HP,'Different depth lane does not get hit');
m=fixture();attack(m);m.action(0,'dash');assert(m.fighters[0].dash>0,'Dodge cancels attack recovery');assert.equal(m.fighters[0].poseTime,0);
m=fixture();const impacts=[];for(let i=0;i<3;i++){m.fighters[1].x=60;m.fighters[1].y=0;m.fighters[1].vx=0;m.fighters[1].vy=0;attack(m);impacts.push(m.fighters[0].combo);step(m,.25);}assert.deepEqual(impacts,[1,2,3]);assert(m.events.some(e=>e.kind==='heavy'),'Third confirmed hit is finisher');
m=fixture();m.fighters[1].hp=1;attack(m);assert(!m.fighters[1].alive);assert.equal(m.fighters[1].hp,0);
m=fixture();m.fighters[0].x=999;m.update(.01);assert(m.fighters[0].alive);assert(m.fighters[0].x<=ARENA.x,'Arena edge is not instant elimination');
m=fixture();m.time=119.99;m.fighters[0].hp=180;m.fighters.slice(1).forEach(p=>p.hp=100);step(m,.02);assert.equal(m.winner,0);assert.equal(m.phase,'round');m.nextRound();assert(m.fighters.every(p=>p.hp===MAX_HP));step(m,2.5);m.time=119.99;m.fighters.slice(1).forEach(p=>p.hp=100);step(m,.02);assert.equal(m.phase,'finished');
m=fixture();m.time=119.99;step(m,.02);assert.equal(m.winner,-1,'Equal HP timeout is a draw');
for(let cast=0;cast<6;cast++){m=fixture();m.fighters[0].cast=cast;attack(m);assert.equal(MAX_HP-m.fighters[1].hp,Math.round(WEAPONS[cast].damage*.8));}
m=fixture();m.fighters[0].cast=4;m.fighters[1].x=150;attack(m);assert(m.fighters[1].hp<MAX_HP);
m=fixture();m.fighters[0].cast=3;m.fighters[1].x=150;attack(m);assert.equal(m.fighters[1].hp,MAX_HP);
for(const p of CAST){assert(fs.existsSync(new URL('../public'+p.image,import.meta.url)));assert(fs.existsSync(new URL('../public/images/rooftop-'+p.id+'-motion-v3.png',import.meta.url)));}
for(let seed=1;seed<=20;seed++){let s=seed;const random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};m=new RooftopMatch(random);m.start(seed%6);for(let i=0;i<13000&&!['round','finished'].includes(m.phase);i++){if(i%20===0){m.stick={x:Math.cos(i/20),y:Math.sin(i/20)};m.action(0,i%80===0?'heavy':'push');}m.update(.01);for(const p of m.fighters){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.hp>=0&&p.hp<=MAX_HP);}}assert(['round','finished'].includes(m.phase));}
console.log('PASS: HP combat, delayed impact, interrupts, light recoil, guard break, dodge, jump, stamina, confirmed combo, KO, walls, timeout, match wins, six weapons/assets and 20 seeded matches');
