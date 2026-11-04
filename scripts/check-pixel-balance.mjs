import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../utils/pixelOffice.ts',import.meta.url),'utf8')+'\n'+fs.readFileSync(new URL('../utils/pixelSurvivor.ts',import.meta.url),'utf8').replace("import {PixelOffice} from './pixelOffice';",''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
globalThis.matchMedia=()=>({matches:true});globalThis.Image=class{};globalThis.ResizeObserver=class{observe(){}disconnect(){}};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};globalThis.devicePixelRatio=1;globalThis.window={addEventListener(){},removeEventListener(){}};globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
const {PixelSurvivor}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const results=[];
for(const build of ['balanced','speed','damage'])for(let seed=1;seed<=4;seed++){
 let rand=seed;Math.random=()=>{rand=(Math.imul(rand,1664525)+1013904223)>>>0;return rand/4294967296;};
 const g=new PixelSurvivor({getContext:()=>({}),getBoundingClientRect:()=>({width:900,height:600})},()=>{});g.start();let upgrades=0,damageTaken=0,lastHP=100;
 const plan=build==='speed'?['speed','date','speed','soju','speed','power','speed','power','haste','power','power']:build==='damage'?['date','power','power','soju','haste','power','power','speed','speed']:['date','speed','soju','power','speed','power','haste','speed','power','speed','power'];
 for(let frame=0;frame<60*360&&g.state.phase!=='won'&&g.state.phase!=='lost';frame++){
  if(g.state.phase==='upgrade'){g.choose(g.state.hp<55?'lounge':plan[upgrades++%plan.length]);}
  if(frame%6===0){
   let best=-Infinity,choice={x:0,y:0};
   for(let i=0;i<16;i++){
    const a=i*Math.PI/8,dx=Math.cos(a),dy=Math.sin(a),x=g.player.x+dx*65,y=g.player.y+dy*65;
    if(x<185||x>1415||y<235||y>995||!g.world.free(x,y,18))continue;
    let score=0;
    for(const e of g.enemies){const d=Math.hypot(x-e.x,y-e.y);score-=3500/Math.max(12,d);if(d<65)score-=(65-d)*3;}
    for(const h of g.hazards){const d=Math.hypot(x-h.x-h.vx*.25,y-h.y-h.vy*.25);if(d<85)score-=(85-d)*2;}
    for(const stamp of g.stamps)if(Math.hypot(x-stamp.x,y-stamp.y)<stamp.radius+15)score-=300;
    const gem=g.gems.reduce((v,p)=>Math.min(v,Math.hypot(x-p.x,y-p.y)),1000);score-=gem*.18;
    score-=Math.hypot(x-800,y-600)*.015;
    if(score>best){best=score;choice={x:dx,y:dy};}
   }g.stick=choice;
   if(g.enemies.some(e=>Math.hypot(e.x-g.player.x,e.y-g.player.y)<55))g.dash();
  }
  g.update(1/60);if(g.state.hp<lastHP)damageTaken+=lastHP-g.state.hp;lastHP=g.state.hp;
 }
 results.push({build,seed,result:g.state.phase,seconds:Math.round(g.state.time),kills:g.state.kills,level:g.state.level,shots:g.state.shots,midboss:g.state.midbossDown,final:g.finalSpawned,hp:Math.round(g.state.hp),damageTaken:Math.round(damageTaken)});g.dispose();
}
console.table(results);
fs.mkdirSync('output/playwright',{recursive:true});fs.writeFileSync('output/playwright/pixel-balance.json',JSON.stringify(results,null,2));
