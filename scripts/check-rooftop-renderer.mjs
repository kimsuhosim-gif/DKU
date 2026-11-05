import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
// Drive the real RAF/input pipeline; canvas operations are stubbed, so this is NOT an FPS test.
const bundle=await build({entryPoints:['utils/rooftopRenderer.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {RooftopGame}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
let callback,now=performance.now();
globalThis.matchMedia=()=>({matches:false});globalThis.devicePixelRatio=1;
globalThis.window={addEventListener(){},removeEventListener(){}};
globalThis.document={addEventListener(){},removeEventListener(){},hidden:false};
globalThis.ResizeObserver=class{observe(){}disconnect(){}};
globalThis.Image=class{width=2048;height=512;set src(v){this.path=v;queueMicrotask(()=>this.onload());}};
globalThis.requestAnimationFrame=f=>(callback=f,1);globalThis.cancelAnimationFrame=()=>{};
const gradient={addColorStop(){}};
const ctx=new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
const game=new RooftopGame({getContext:()=>ctx,getBoundingClientRect:()=>({width:390,height:620})},()=>{});
await game.ready;game.audio.setEnabled(false);
function tick(n=1){for(let i=0;i<n;i++)callback(now+=10);}
game.start(0);tick(245);assert.equal(game.model.phase,'playing');
// Focused renderer state fixture, separate from input-only combat bots.
game.freeze=.20;game.model.fighters[0].cool=0;
game.act('push');
assert.equal(game.model.fighters[0].poseTime,0,'Hitstop must buffer input rather than start a frozen new attack');
tick(15);assert.equal(game.model.fighters[0].poseTime,0);assert(game.queued,'Queued input survives hitstop');
tick(8);assert(game.model.fighters[0].poseTime>0,'Buffered attack executes after hitstop');
game.model.fighters[0].poseTime=0;game.model.fighters[0].cool=0;game.model.fighters[0].down=.10;game.model.fighters[0].stun=0;game.freeze=0;game.act('heavy');assert.equal(game.queued,'heavy','Get-up recovery accepts buffered input');tick(13);assert.equal(game.model.fighters[0].attackKind,'heavy');assert(game.model.fighters[0].poseTime>0);
game.preview(0);assert.equal(game.freeze,0);assert.equal(game.superCue,null);assert.equal(game.shake,0);
game.dispose();
console.log('P0 PASS: real renderer RAF input buffer survives hitstop and resumes; preview clears cinematic state. Canvas stub: no rendered FPS claim.');

const results=[];
for(let cast=0;cast<7;cast++)for(const seed of [121,371,901]){
 let state=seed;const rng=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);
 const g=new RooftopGame({getContext:()=>ctx,getBoundingClientRect:()=>({width:390,height:620})},()=>{});await g.ready;g.audio.setEnabled(false);g.model=new g.model.constructor(rng);g.start(cast);
 let frame=0,cutins=0,lastCue=null;
 for(;frame<20000&&!['round','finished'].includes(g.model.phase);frame++){
  const p=g.model.fighters[0];if(g.model.phase==='playing'&&p.alive){
   const q=g.model.fighters.slice(1).filter(q=>q.alive).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
   if(q){const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);g.model.stick={x:d>160?Math.sign(dx):0,y:Math.abs(dy)>18?Math.sign(dy):0};if(Math.abs(dy)>45&&Math.abs(dx)<146)g.model.stick.x=dx>0?-1:1;
    if(frame%8===0){if(p.meter>=100&&d<230&&Math.abs(dy)<45)g.act('special');else if(d<170&&Math.abs(dy)<45)g.act(frame%40===0?'heavy':'push');}
   }
  }
  tick();if(g.superCue&&g.superCue!==lastCue)cutins++;lastCue=g.superCue;
  assert(g.bursts.length<=24&&g.specialBursts.length<=12,'Visual lists bounded');
  for(let i=0;i<g.model.fighters.length;i++)for(let j=i+1;j<g.model.fighters.length;j++){const a=g.model.fighters[i],b=g.model.fighters[j];if(a.alive&&b.alive)assert(Math.abs(a.x-b.x)>=127.94||Math.abs(a.y-b.y)>=249.94,'Renderer bot overlap');}
 }
 assert(['round','finished'].includes(g.model.phase),'Renderer simulation must reach a round outcome');assert(cutins>0,'Normal input must exercise cinematic path');
 results.push({cast,seed,winner:g.model.winner,simulationSeconds:+g.model.time.toFixed(2),elapsedSeconds:frame/100,hpLost:180-g.model.fighters[0].hp,cutins});g.dispose();
}
fs.mkdirSync('output/combat-v6',{recursive:true});fs.writeFileSync('output/combat-v6/renderer-bots.json',JSON.stringify({date:'2026-11-05',mode:'real RAF and inputs; stub canvas; not rendered FPS',results},null,2));
console.log('P1 PASS: 21 seeded input-only renderer simulations reach round outcomes with cinematics, hitstop, collision and bounded effects.');
