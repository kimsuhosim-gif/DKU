import {evolution} from './evolution.mjs';
import {SLOTS} from './board.mjs';
const TAU=Math.PI*2;
function ring(ctx,x,y,r,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,r,r*.52,0,0,TAU);ctx.stroke();ctx.restore();}
function area(ctx,x,y,r,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();}
function blade(ctx,x,y,angle,size,color){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.strokeStyle='#edfff5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-size*.5,0);ctx.quadraticCurveTo(0,-size*.36,size*.65,0);ctx.lineTo(size*.15,size*.18);ctx.quadraticCurveTo(-size*.2,size*.14,-size*.5,0);ctx.fill();ctx.stroke();ctx.restore();}
// Procedural vector VFX, not generated character body poses.
export function drawEvolutionGround(ctx,g,reduced){
 for(const z of g.zones){if(z.kind==='blizzard')continue;const orbit=z.kind==='orbit',color=orbit?'#b6ffcb':'#aaa9ff',fade=Math.min(1,(z.life-z.age)/.2);ctx.save();ctx.globalAlpha=fade*.13;ctx.fillStyle=color;ctx.beginPath();ctx.arc(z.x,z.y,z.radius,0,TAU);ctx.fill();ctx.restore();area(ctx,z.x,z.y,z.radius,color,fade*.7);area(ctx,z.x,z.y,z.radius*.72,color,fade*.35);if(orbit){for(let i=0;i<3;i++){const angle=i*TAU/3+(reduced?0:z.age*6);blade(ctx,z.x+Math.cos(angle)*z.radius*.83,z.y+Math.sin(angle)*z.radius*.83,angle+Math.PI/2,62,'#82e7b0');}}else {ctx.save();ctx.strokeStyle='#c9c2ff';ctx.globalAlpha=.6*fade;ctx.setLineDash([8,9]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(z.x,z.y-15,38,0,TAU);ctx.stroke();ctx.restore();}}
 for(let i=0;i<g.towers.length;i++){const t=g.towers[i];if(!t||t.level<2)continue;const s=SLOTS[i],color=evolution(t.type,t.level,t.branch).color;ring(ctx,s.x,s.y+2,40+(t.level-2)*7,color,.65);}
}
export function drawEvolutionFront(ctx,g,reduced,drawFX,text){
 for(const p of g.projectiles){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.targetY-p.startY,p.targetX-p.startX));ctx.fillStyle='#ffc36d';ctx.strokeStyle='#fff5c1';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,14,7,0,0,TAU);ctx.fill();ctx.stroke();if(!reduced){ctx.strokeStyle='#ff9055aa';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-38,0);ctx.stroke();}ctx.restore();}
 for(const f of g.effects){
  if(f.kind==='explosion'){drawFX('muzzle',f.age,f.x,f.y,230);if(!reduced)ring(ctx,f.x,f.y+20,f.radius*Math.min(1,f.age/.22),'#ffd7a4',Math.max(0,1-f.age/.48));}
  if(f.kind==='orbit-tick'){drawFX('blade-sweep',f.age,f.x,f.y-25,f.radius*1.8);}
  if(f.kind==='storm-tick'){for(const p of f.targets){drawFX('lightning',f.age,p.x,p.y-80,85,230);drawFX('muzzle',f.age,p.x,p.y,65);}if(!f.targets.length)drawFX('lightning',f.age,f.x,f.y-80,80,230);}
 }
 for(let i=0;i<g.towers.length;i++){const t=g.towers[i];if(!t)continue;const a=t.action,age=a?g.time-a.at:Infinity,s=SLOTS[i];if(a?.skill&&age>=0&&age<a.windup+.35){text(evolution(t.type,3,t.branch).name,s.x,s.y-182,21,evolution(t.type,3,t.branch).color);if(age<a.windup){ctx.save();ctx.strokeStyle=evolution(t.type,3,t.branch).color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(s.x,s.y-95,reduced?30:18+age/a.windup*20,0,TAU);ctx.stroke();ctx.restore();}}if(t.level===3){const ev=evolution(t.type,3,t.branch),count=t.cycle;for(let n=0;n<ev.every;n++){ctx.fillStyle=n<count?ev.color:'#213a3e';ctx.strokeStyle=ev.color;ctx.lineWidth=1;ctx.beginPath();ctx.arc(s.x+(n-(ev.every-1)/2)*12,s.y+18,3.5,0,TAU);ctx.fill();ctx.stroke();}}}
}
