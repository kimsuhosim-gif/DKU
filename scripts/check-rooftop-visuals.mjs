import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
async function moduleOf(source){const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));}
const modelSource=fs.readFileSync(new URL('utils/rooftopModel.ts',root),'utf8');
const current=await moduleOf(modelSource);
const baseline=await moduleOf(execFileSync('git',['show','2d62a8b:utils/rooftopModel.ts'],{encoding:'utf8'}));
const visual=await moduleOf(fs.readFileSync(new URL('utils/rooftopCombatVisuals.ts',root),'utf8'));
for(let cast=0;cast<6;cast++){
 for(let attackStep=1;attackStep<=3;attackStep++){
  const p={cast,attackStep,poseTime:.5,attackDuration:1};
  assert.equal(visual.attackCell(p),visual.LIGHT_POSES[cast][attackStep-1][2]);
 }
 assert.equal(visual.heavyCell(.5),1);
 const png=fs.readFileSync(new URL(`public/images/rooftop-${current.CAST[cast].id}-heavy-v4.png`,root));
 assert.equal(png.readUInt32BE(16),2048);assert.equal(png.readUInt32BE(20),512);
}
assert(!visual.LIGHT_POSES[2].flat().includes(14),'Hammer must not play hurt frame during attack');

// Pure input bot: never writes health, positions, cooldowns or victory state.
function run(api,cast,seed){let s=seed;const random=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};
 const m=new api.RooftopMatch(random);m.start(cast);let hitCount=0;
 for(let frame=0;frame<13000&&!['round','finished'].includes(m.phase);frame++){
  const p=m.fighters[0];
  if(m.phase==='playing'&&p.alive){
   const target=m.fighters.slice(1).filter(q=>q.alive).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
   if(target){const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy),reach=api.WEAPONS[cast].reach;
    m.stick={x:d>reach*.75?Math.sign(dx):0,y:Math.abs(dy)>18?Math.sign(dy):0};
    if(frame%8===0){if(target.windup>0&&target.attackKind==='heavy'&&d<120)m.action(0,'dash');else if(d<reach&&Math.abs(dy)<45)m.action(0,frame%40===0?'heavy':'push');}
   }
  }
  m.update(.01);
  for(const e of m.events.splice(0))if(e.kind==='hit'||e.kind==='heavy'){hitCount++;if(api===current){assert(Number.isInteger(e.cast));assert(Number.isFinite(e.angle));assert(Number.isFinite(e.targetY));}}
 }
 assert(['round','finished'].includes(m.phase));
 return {cast,seed,winner:m.winner,time:Number(m.time.toFixed(2)),hp:m.fighters.map(p=>p.hp),playerHpLost:180-m.fighters[0].hp,hitCount};
}
const results=[];
for(let cast=0;cast<6;cast++)for(const seed of [121,371,901]){
 const before=run(baseline,cast,seed),after=run(current,cast,seed);assert.deepEqual(after,before,'Visual-only change must preserve seeded combat outcome');results.push(after);
}
fs.mkdirSync(new URL('output/combat-v4',root),{recursive:true});
fs.writeFileSync(new URL('output/combat-v4/bot-results.json',root),JSON.stringify({date:'2026-11-05',validation:'input-only; compared against 2d62a8b before visual change; no rendered FPS claim',results},null,2));
console.log('P0 PASS: contact frames synchronized, six atlases, no hammer hurt pose. P1 PASS: 18 input-only bot matches identical to baseline; hit event metadata valid.');
