import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../utils/rooftopModel.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {RooftopMatch,BODY,SPECIALS,attackReach}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const step=(m,t)=>{for(let n=0;n<Math.ceil(t/.01);n++)m.update(.01);};
// Unit-test setups below intentionally place bodies; bot tests are separate and input-only.
function fixture(cast=0){const m=new RooftopMatch(()=>.5);m.start(cast);step(m,2.5);m.fighters.forEach((p,i)=>Object.assign(p,{x:[0,150,450,-450][i],y:i<2?0:330,angle:i===0?0:Math.PI,ai:999,specialCooldown:999}));m.fighters[0].specialCooldown=0;return m;}
function noOverlap(m,tolerance=.06){for(let i=0;i<m.fighters.length;i++)for(let j=i+1;j<m.fighters.length;j++){const a=m.fighters[i],b=m.fighters[j];if(a.alive&&b.alive)assert(Math.abs(a.x-b.x)>=BODY.x-tolerance||Math.abs(a.y-b.y)>=BODY.y-tolerance,`overlap ${i}/${j} dx=${Math.abs(a.x-b.x)} dy=${Math.abs(a.y-b.y)}`);}}
for(const mode of ['walk','dash','down','jump']){
 const m=fixture();m.fighters[1].x=BODY.x;m.stick={x:1,y:0};
 if(mode==='dash')m.action(0,'dash');if(mode==='down')m.fighters[1].down=.6;if(mode==='jump')m.action(0,'jump');
 for(let i=0;i<150;i++){m.update(.01);noOverlap(m);}
 assert(m.fighters[0].x<m.fighters[1].x,'Bodies must not tunnel through one another');
}
for(const corner of [[530,345],[-530,-345],[0,0]]){const m=fixture();m.fighters.forEach(p=>Object.assign(p,{x:corner[0],y:corner[1]}));for(let i=0;i<20;i++){m.update(.01);noOverlap(m);}}
for(let cast=0;cast<7;cast++){const m=fixture(cast);m.fighters[1].x=BODY.x+2;m.action(0,'push');step(m,m.fighters[0].attackDuration*.5+.02);assert(m.fighters[1].hp<180,`Weapon ${cast} reaches from body separation`);}
const damage=[];
for(const cast of [0,1,2,3,4,5,6]){
 const m=fixture(cast),p=m.fighters[0],q=m.fighters[1];m.action(0,'special');assert.equal(p.meter,0);assert(p.specialLeft>0);step(m,.15);assert.equal(q.hp,180,'Special has a visible windup');step(m,SPECIALS[cast].duration);assert(q.hp<180,`special ${cast} must hit`);assert(m.events.some(e=>e.superHit&&(e.kind==='hit'||e.kind==='heavy')),`special ${cast} reports confirmed damage`);assert(m.events.filter(e=>e.kind==='special-impact').every(e=>!e.superHit),'Visual pulses are not confirmed hits');noOverlap(m);damage.push({cast,loss:180-q.hp});
 m.action(0,'special');assert.equal(p.specialLeft,0,'Cannot spam with empty meter');
}
assert(damage[3].loss>=28,'Rush delivers multiple hits, not a renamed single attack');
let m=fixture(5);m.action(0,'special');step(m,.38);m.action(1,'jump');step(m,.3);assert.equal(m.fighters[1].hp,180,'Jump evades earthquake');
m=fixture(0);m.action(0,'special');m.fighters[0].stun=.3;step(m,.8);assert.equal(m.fighters[1].hp,180,'Startup interruption cancels special');assert(!m.events.some(e=>e.superHit),'Interrupted startup must not trigger special hitstop');
m=fixture(0);m.fighters[1].x=220;m.fighters[2].x=390;m.fighters[2].y=0;m.action(0,'special');step(m,.6);assert(m.fighters[1].hp<180&&m.fighters[2].hp<180,'Cannon pierces aligned targets');
m=fixture(5);m.fighters[2].x=-180;m.fighters[2].y=0;m.action(0,'special');step(m,.7);assert(m.fighters[1].hp<180&&m.fighters[2].hp<180,'Earthquake hits both directions');
m=fixture();m.action(0,'special');m.pause();const left=m.fighters[0].specialLeft;step(m,1);assert.equal(m.fighters[0].specialLeft,left,'Pause freezes special');m.pause();
console.log('P0 PASS: solid bodies walking/dodging/down/jump, walls and four-body piles; seven weapons reach; seven specials, windup, multi-hit, jump evade, interrupt, piercing, AOE, pause, meter lock.');
console.log(JSON.stringify({specialDamage:damage,body:BODY,reach:Array.from({length:7},(_,i)=>attackReach(i))}));

// Rifle: 3 timed shots, first body blocks, and normal attacks never fire.
m=fixture(6);assert.equal(m.fighters[0].cast,6);m.action(0,'push');step(m,.6);assert(!m.events.some(e=>e.kind==='special-impact'));
m=fixture(6);m.action(0,'special');step(m,.46);assert.equal(m.fighters[1].hp,180);step(m,.04);assert.equal(m.fighters[1].hp,168);step(m,.17);assert.equal(m.fighters[1].hp,156);step(m,.2);assert.equal(m.fighters[1].hp,136);assert.equal(m.events.filter(e=>e.kind==='special-impact').length,3);
m=fixture(6);m.fighters[1].x=220;m.fighters[2].x=390;m.fighters[2].y=0;m.action(0,'special');step(m,1.2);assert.equal(m.fighters[1].hp,136);assert.equal(m.fighters[2].hp,180,'Rifle does not pierce');
m=fixture(6);m.fighters[1].invulnerable=2;m.fighters[2].x=390;m.fighters[2].y=0;m.action(0,'special');step(m,1.2);assert.equal(m.fighters[2].hp,180,'Invulnerable foreground body still stops bullets');
m=fixture(6);m.fighters[1].y=100;m.action(0,'special');step(m,1.2);assert.equal(m.fighters[1].hp,180,'Rifle misses off-axis');
console.log('P0 PASS: rifle selection, melee-only normal attack, 3 timed shots (12+12+20), foreground occlusion and off-axis miss.');

m=fixture(2);m.fighters[2].x=-180;m.fighters[2].y=0;m.action(0,'special');step(m,.6);assert(m.fighters[1].hp<180);assert.equal(m.fighters[2].hp,180,'Sword cuts forward only, unlike radial hammer');console.log('PASS: sword forward cut vs hammer radial thunder');
