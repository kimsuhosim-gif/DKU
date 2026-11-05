// Fixed-seed, visible-browser benchmark. This never substitutes for gameplay tests.
export const benchOptions=()=>{
 const q=new URLSearchParams(location.search);
 return q.get('benchmark')==='1'?{renderer:q.get('renderer')==='raw'?'raw':'cached',seconds:30,seed:19,stressEffects:32}:null;
};
export function benchmarkInput(g){
 const dx=g.enemy.x-g.player.x,dy=g.enemy.y-g.player.y;
 return {x:Math.abs(dx)>110?Math.sign(dx):0,y:Math.abs(dy)>12?Math.sign(dy):0,attack:true,magic:g.time%3<.45&&Math.abs(dx)<260};
}
export class FrameProfile{
 constructor(options){this.options=options;this.frames=[];this.cpu={};this.rounds=[];this.maxEffects=0;this.started=0;this.last=0;this.done=false;this.visible=true;}
 measure(name,fn){const t=performance.now();const result=fn();const v=performance.now()-t;const s=this.cpu[name]??={total:0,max:0,n:0};s.total+=v;s.max=Math.max(s.max,v);s.n++;return result;}
 tick(now){if(!this.started){this.started=now;this.last=now;return false;}if(document.visibilityState!=='visible')this.visible=false;this.frames.push(now-this.last);this.last=now;return now-this.started>=this.options.seconds*1000;}
 finish(game){this.done=true;const sorted=[...this.frames].sort((a,b)=>b-a),sum=a=>a.reduce((s,x)=>s+x,0),worst=sorted.slice(0,Math.max(1,Math.ceil(sorted.length*.01)));
 return {date:new Date().toISOString(),build:'playtest-04',...this.options,measurement:'visible requestAnimationFrame intervals; CPU spans are JS submission time, not GPU execution',valid:this.visible,frames:sorted.length,elapsedSeconds:(this.last-this.started)/1000,averageFPS:1000/(sum(sorted)/sorted.length),onePercentLowFPS:1000/(sum(worst)/worst.length),p99FrameMs:sorted[Math.max(0,Math.ceil(sorted.length*.01)-1)],cpu:Object.fromEntries(Object.entries(this.cpu).map(([k,v])=>[k,{meanMs:v.total/v.n,maxMs:v.max,totalMs:v.total,calls:v.n}])),rounds:this.rounds,final:{time:game.time,playerHP:game.player.hp,enemyHP:game.enemy.hp,hits:game.stats.hits},maxNaturalEffects:this.maxEffects,viewport:[innerWidth,innerHeight],canvas:[960,560],dpr:devicePixelRatio,userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency};
 }
}
