import {SLOTS} from './board.mjs';
import {evolution} from './evolution.mjs';
const TAU=Math.PI*2;
function line(ctx,points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function bolt(ctx,x,y,tx,ty,color,width,seed=0){const dx=tx-x,dy=ty-y,len=Math.hypot(dx,dy)||1,pts=[];for(let i=0;i<=7;i++){const t=i/7,j=i&&i<7?Math.sin(i*19.7+seed)*12:0;pts.push([x+dx*t-dy/len*j,y+dy*t+dx/len*j]);}line(ctx,pts,color,width);line(ctx,pts,'#f0ffff',Math.max(1,width*.25));}
function sparks(ctx,x,y,age,color,count=8,size=90){const p=Math.min(1,age/.4);ctx.save();ctx.globalAlpha=1-p;for(let i=0;i<count;i++){const a=i*TAU/count+.34,len=size*(.6+(i%3)*.17)*p;line(ctx,[[x+Math.cos(a)*len,y+Math.sin(a)*len*.75],[x+Math.cos(a)*(len+10*(1-p)),y+Math.sin(a)*(len+10*(1-p))*.75]],color,3);}ctx.restore();}
export function drawRankHalo(ctx,t,s,time,reduced,front=false){
 if(t.level<2)return;const c=evolution(t.type,t.level,t.branch).color,max=t.level===3;
 ctx.save();ctx.globalAlpha=max?.85:.5;
 if(!front){const glow=ctx.createRadialGradient(s.x,s.y-65,10,s.x,s.y-65,max?125:85);glow.addColorStop(0,c+'32');glow.addColorStop(1,c+'00');ctx.fillStyle=glow;ctx.fillRect(s.x-130,s.y-195,260,265);ctx.strokeStyle=c;ctx.lineWidth=max?4:2;ctx.beginPath();ctx.ellipse(s.x,s.y+1,max?58:45,18,0,0,TAU);ctx.stroke();}
 else if(max){const tick=reduced?0:time;
  if(t.type==='blades'){for(let i=0;i<2;i++){const angle=tick*1.6+i*Math.PI,x=s.x+Math.cos(angle)*70,y=s.y-90+Math.sin(angle)*24;ctx.fillStyle='#cfffac';ctx.beginPath();ctx.moveTo(x,y-31);ctx.lineTo(x+7,y+7);ctx.lineTo(x,y+19);ctx.lineTo(x-7,y+7);ctx.closePath();ctx.fill();}}
  if(t.type==='shotgun'){for(let i=0;i<5;i++){const p=((tick*.55+i*.2)%1);ctx.fillStyle=i%2?'#ffc76e':'#ff8751';ctx.beginPath();ctx.arc(s.x+Math.sin(i*3.1+tick)*47,s.y-30-p*100,3.5*(1-p)+1,0,TAU);ctx.fill();}}
  if(t.type==='lightning'){bolt(ctx,s.x-55,s.y-130,s.x-70,s.y-45,c,3,Math.floor(tick*8));bolt(ctx,s.x+55,s.y-130,s.x+70,s.y-45,c,3,2+Math.floor(tick*8));}
 }
 ctx.restore();
}
export function drawRole(ctx,e,time,reduced,text){
 if(e.role==='armored'){const broken=e.armorBrokenUntil>time;ctx.save();ctx.globalAlpha=broken?.3:.9;ctx.fillStyle='#273c57';ctx.strokeStyle=broken?'#ffbc71':'#a9d8f6';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(e.x-25,e.y-64);ctx.lineTo(e.x,e.y-77);ctx.lineTo(e.x+25,e.y-64);ctx.lineTo(e.x+21,e.y-27);ctx.lineTo(e.x,e.y-14);ctx.lineTo(e.x-21,e.y-27);ctx.closePath();ctx.fill();ctx.stroke();line(ctx,[[e.x,e.y-65],[e.x,e.y-28]],'#a9d8f6',4);ctx.restore();text(broken?'파괴':'중갑',e.x,e.y-90,16,broken?'#ffba77':'#aedfff');}
 if(e.type==='caster'){const p=1-Math.max(0,e.healClock??3.2)/3.2;ctx.save();ctx.strokeStyle='#88f6b1';ctx.lineWidth=4;ctx.beginPath();ctx.arc(e.x,e.y-42,48,-Math.PI/2,-Math.PI/2+TAU*p);ctx.stroke();if(p>.7){ctx.globalAlpha=.13;ctx.fillStyle='#77efaa';ctx.beginPath();ctx.arc(e.x,e.y,180,0,TAU);ctx.fill();}ctx.restore();text('회복',e.x,e.y-103,17,'#a6f6c0');}
 if(e.enraged){ctx.save();ctx.strokeStyle='#ff704f';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(e.x,e.y,70,21,0,0,TAU);ctx.stroke();ctx.restore();}
}
export function drawImpact(ctx,g,reduced,text){
 for(const f of g.effects){
  if(f.kind==='shotgun'&&!f.muzzleOnly&&f.age<.18){const a=f.targets[0],x=f.x+(a.x<f.x?-62:62),y=f.y-80;ctx.save();ctx.globalAlpha=(1-f.age/.18)*.75;for(const p of f.targets)line(ctx,[[x,y],[p.x,p.y]],f.level===3?'#ffb25d':'#ffe9b4',f.followup?4:6);ctx.restore();if(!reduced)f.targets.slice(0,3).forEach(p=>sparks(ctx,p.x,p.y,f.age,'#ffe1a4',5,50));}
  if(f.kind==='blades'&&f.age<.26){const progress=f.age/.26;ctx.save();ctx.globalAlpha=(1-progress)*.85;ctx.translate(f.x,f.y+20);ctx.scale(1,.62);ctx.strokeStyle=f.level===3?'#e1ffb1':'#99ffcf';ctx.lineWidth=f.level>=2?13:8;ctx.beginPath();const angle=(f.followup?-1:1)*(reduced?0:progress*3);ctx.arc(0,0,f.level>=2?145:115,angle,angle+2.8);ctx.stroke();ctx.restore();}
  if(f.kind==='lightning'&&f.age<.22){ctx.save();ctx.globalAlpha=1-f.age/.22;let p={x:f.x+(f.targets[0].x<f.x?-62:62),y:f.y-80};for(const n of f.targets){bolt(ctx,p.x,p.y,n.x,n.y,f.level>=2?'#8defff':'#93caff',f.level>=2?7:4,reduced?0:Math.floor(f.age*35));p=n;}ctx.restore();}
  if(f.kind==='explosion'&&f.age<.45){const p=f.age/.45;ctx.save();ctx.globalAlpha=(1-p)*.65;ctx.fillStyle='#ff8a3d';ctx.beginPath();ctx.arc(f.x,f.y,25+95*p,0,TAU);ctx.fill();ctx.globalAlpha=(1-p)*.9;ctx.strokeStyle='#fff1af';ctx.lineWidth=9*(1-p)+2;ctx.beginPath();ctx.arc(f.x,f.y,20+f.radius*p,0,TAU);ctx.stroke();ctx.restore();if(!reduced)sparks(ctx,f.x,f.y,f.age,'#ffd58b',12,145);}
  if(f.kind==='storm-tick'&&f.age<.22){ctx.save();ctx.globalAlpha=1-f.age/.22;const targets=f.targets.length?f.targets:[{x:f.x,y:f.y}];targets.slice(0,5).forEach((p,i)=>bolt(ctx,p.x-25,p.y-220,p.x,p.y,'#baadff',12,reduced?0:i));ctx.restore();}
  if(f.kind==='heal'){ctx.save();ctx.globalAlpha=1-f.age/.65;for(const p of f.targets){line(ctx,[[f.x,f.y],[p.x,p.y]],'#8ff4b4',3);text('+',p.x,p.y-25-(reduced?0:f.age*24),27,'#a4ffbc');}ctx.restore();}
 }
 const boss=g.enemies.find(e=>e.type==='guardian');if(boss){const x=262,y=110,w=500;ctx.fillStyle='#102329ec';ctx.fillRect(x-20,y-40,w+40,94);text(boss.enraged?'수호석 · 격노':'수호석 · 마지막 방어',512,y-15,24,boss.enraged?'#ffb39b':'#eee1c0');ctx.fillStyle='#483844';ctx.fillRect(x,y+15,w,15);ctx.fillStyle=boss.enraged?'#ff775c':'#c891d3';ctx.fillRect(x,y+15,w*Math.max(0,boss.hp/boss.maxHp),15);}
}
export function drawUpgrade(ctx,burst,clock,reduced,text){if(!burst)return;const age=clock-burst.at;if(age<0||age>1.2)return;const s=SLOTS[burst.slot],color=evolution(burst.type,burst.level,burst.branch).color;ctx.save();ctx.globalAlpha=Math.min(1,(1.2-age)*3);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(s.x,s.y,reduced?60:40+age*85,reduced?22:18+age*30,0,0,TAU);ctx.stroke();if(!reduced)sparks(ctx,s.x,s.y-90,Math.min(age,.39),color,12,110);text(burst.level===3?'각성 · '+evolution(burst.type,burst.level,burst.branch).name:'강화 · '+evolution(burst.type,burst.level,burst.branch).name,s.x,s.y-220-(reduced?0:age*15),27,color);ctx.restore();}
