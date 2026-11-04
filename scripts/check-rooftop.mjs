import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../utils/rooftopModel.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {RooftopMatch,CAST,stickVector}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const step=(m,n)=>{for(let t=0;t<n;t+=.02)m.update(.02);};
function fixture(){const m=new RooftopMatch(()=>.5);m.start(2);step(m,2.5);m.fighters.forEach((p,i)=>{p.x=i*60;p.y=130;p.ai=999;});return m;}
assert.equal(CAST.length,6);assert.equal(new Set(CAST.map(p=>p.name)).size,6);assert(!CAST.some(p=>p.name==='김경준'));
assert.deepEqual(stickVector(3,3),{x:0,y:0});assert.equal(stickVector(100,0).x,1);
let m=fixture();assert.equal(m.phase,'playing');assert.equal(m.fighters[0].cast,2);assert.equal(new Set(m.fighters.map(p=>p.cast)).size,4);
m.pause();const t=m.time;step(m,1);assert.equal(m.time,t);m.pause();
m.fighters[0].angle=0;m.action(0,'push');assert(m.fighters[1].damage>0);assert(m.fighters[1].vx>240);
m=fixture();m.fighters[0].angle=0;m.action(0,'grab');assert.equal(m.fighters[0].carrying,1);assert.equal(m.fighters[1].heldBy,0);m.fighters[0].cool=0;m.action(0,'grab');assert.equal(m.fighters[1].heldBy,-1);assert(m.fighters[1].vx>400);
m=fixture();m.fighters[0].angle=0;m.action(0,'grab');m.action(1,'dash');assert.equal(m.fighters[0].carrying,-1);assert.equal(m.fighters[1].heldBy,-1);assert.equal(m.fighters[1].stamina,70);
m=fixture();m.action(0,'dash');assert.equal(m.fighters[0].stamina,70);m.fighters[0].cool=0;m.fighters[0].stamina=20;m.action(0,'dash');assert.equal(m.fighters[0].stamina,20);
m=fixture();m.fighters[0].x=370;m.update(.02);assert(m.fighters[0].hang>0);for(let i=0;i<3;i++){m.fighters[0].cool=0;m.action(0,'push');}assert.equal(m.fighters[0].hang,0);assert(m.fighters[0].alive);assert(m.fighters[0].x<=315);
m=fixture();m.fighters[0].x=370;m.update(.02);step(m,1.5);assert(!m.fighters[0].alive);
m=fixture();m.time=70;assert(m.bounds.x<350);for(let i=1;i<4;i++)m.eliminate(i);m.update(.02);assert.equal(m.phase,'round');assert.equal(m.fighters[0].wins,1);m.nextRound();step(m,2.5);for(let i=1;i<4;i++)m.eliminate(i);m.update(.02);assert.equal(m.phase,'finished');assert.equal(m.fighters[0].wins,2);
let completed=0;
for(let seed=1;seed<=20;seed++){let s=seed;const random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};m=new RooftopMatch(random);m.start(seed%6);for(let i=0;i<15000&&!['round','finished'].includes(m.phase);i++){if(i%20===0){m.stick={x:Math.cos(i/20),y:Math.sin(i/20)};m.action(0,i%60===0?'grab':'push');}m.update(.02);for(const p of m.fighters)assert(Number.isFinite(p.x)&&Number.isFinite(p.y));}if(['round','finished'].includes(m.phase))completed++;}
assert.equal(completed,20,'Every simulated round must resolve within five minutes');
m=fixture();m.fighters[1].angle=Math.PI;m.action(1,'guard');m.fighters[0].angle=0;m.action(0,'push');assert.equal(m.fighters[1].damage,0,'Front guard blocks a strike');
m=fixture();m.action(1,'jump');m.fighters[0].angle=0;m.action(0,'push');assert.equal(m.fighters[1].damage,0,'Airborne target avoids grounded strike');
m=fixture();m.fighters[0].stamina=0;m.action(0,'jump');m.action(0,'guard');assert.equal(m.fighters[0].jump,0);assert.equal(m.fighters[0].guard,0);
m=fixture();for(let i=0;i<3;i++){m.fighters[0].cool=0;m.action(0,'push');}assert.equal(m.fighters[0].combo,3,'Three quick attacks reach finisher');
for(const character of CAST)assert(fs.existsSync(new URL('../public'+character.image,import.meta.url)),'Missing sprite: '+character.name);
console.log('PASS: roster, input, pause, shove, throw, escape, stamina, ledge rescue, falling, round wins; 20 seeded rounds resolved.');
