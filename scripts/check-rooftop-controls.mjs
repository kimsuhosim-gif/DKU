import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const js=ts.transpileModule(fs.readFileSync(new URL('../utils/rooftopModel.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {RooftopMatch}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const step=(m,t)=>{for(let i=0;i<Math.ceil(t/.01);i++)m.update(.01);};
function fixture(){const m=new RooftopMatch(()=>.5);m.start();step(m,2.5);m.fighters.forEach((p,i)=>Object.assign(p,{x:[0,150,-170,450][i],y:i===3?330:0,ai:999,specialCooldown:999,angle:0}));return m;}
let m=fixture();m.stick={x:-1,y:0};m.action(0,'push');assert(Math.cos(m.fighters[0].angle)<-.9,'Manual left must not snap to closer right opponent');
m=fixture();m.action(0,'push');assert(Math.cos(m.fighters[0].angle)>.9,'Neutral attack assists nearest target');
m=fixture();const p=m.fighters[0];p.vx=220;m.stick={x:-1,y:0};m.update(.01);assert(p.vx<0,'Reversal responds in first simulation frame');
m=fixture();m.action(0,'push');step(m,.01);m.stick={x:-1,y:0};m.update(.01);assert(Math.cos(m.fighters[0].angle)<-.9,'Startup allows early redirect');
m=fixture();m.action(0,'push');step(m,.11);m.stick={x:-1,y:0};m.update(.01);assert(Math.cos(m.fighters[0].angle)>.9,'Active swing stays committed');step(m,.06);assert(Math.cos(m.fighters[0].angle)<-.9,'Recovery releases facing immediately after contact');
m=fixture();m.action(0,'guard');m.stick={x:-1,y:0};m.update(.01);assert(Math.cos(m.fighters[0].angle)<-.9,'Guard can turn');
m=fixture();m.action(0,'dash');step(m,.34);m.action(0,'push');assert(m.fighters[0].empowered,'Dodge grants next-attack reward');assert.equal(m.fighters[0].momentum,0,'Reward consumed once');step(m,.4);m.action(0,'push');assert(!m.fighters[0].empowered);
m=fixture();m.action(0,'dash');step(m,1.2);m.action(0,'push');assert(!m.fighters[0].empowered,'Reward expires');
m=fixture();m.action(0,'heavy');const duration=m.fighters[0].attackDuration;m=fixture();m.fighters[0].combo=2;m.fighters[0].comboTime=.5;m.action(0,'heavy');assert(m.fighters[0].attackDuration<duration);assert(m.fighters[0].empowered,'Confirmed combo permits strong finisher');
console.log('P0 PASS: directional priority, neutral aim, one-frame reversal, early redirect, active commitment, recovery/guard turn, one-use dodge reward/expiry, heavy combo finisher.');
