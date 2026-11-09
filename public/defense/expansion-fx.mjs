import {SLOTS} from './board.mjs';
const TAU=Math.PI*2;
function ray(c,x,y,tx,ty,color,width=4){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();}
function crystal(c,x,y,size,color){c.fillStyle=color;c.strokeStyle='#f1ffff';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y-size);c.lineTo(x+size*.45,y);c.lineTo(x,y+size*.65);c.lineTo(x-size*.45,y);c.closePath();c.fill();c.stroke();}
export function drawExpansionGround(c,g,reduced){
 for(const z of g.zones){if(z.kind!=='blizzard')continue;c.save();c.fillStyle='#9befff20';c.strokeStyle='#a8f4ff';c.lineWidth=3;c.beginPath();c.arc(z.x,z.y,z.radius,0,TAU);c.fill();c.stroke();for(let i=0;i<7;i++){const a=i*TAU/7+(reduced?0:z.age*.7),r=z.radius*.7;crystal(c,z.x+Math.cos(a)*r,z.y+Math.sin(a)*r,18,'#8acde7aa');}c.restore();}
 g.towers.forEach((t,i)=>{if(!t||t.type!=='support')return;const s=SLOTS[i];c.save();c.strokeStyle='#e7d99950';c.lineWidth=2;c.setLineDash([8,12]);c.beginPath();c.arc(s.x,s.y,370,0,TAU);c.stroke();c.restore();});
}
export function drawExpansionFront(c,g,reduced,text){
 for(const e of g.enemies){if(e.chillUntil>g.time){c.save();c.strokeStyle='#a3ecff';c.lineWidth=3;c.beginPath();c.ellipse(e.x,e.y,30,10,0,0,TAU);c.stroke();c.restore();}if(e.vulnerableUntil>g.time)text('취약',e.x,e.y-110,18,'#e4baff');}
 for(const f of g.effects){if(!['piercing','execution','plasma','rally','repair'].includes(f.kind))continue;
  c.save();c.globalAlpha=Math.max(0,1-f.age/f.life);const targets=f.targets||[];
  for(const [i,p] of targets.entries()){
   if(f.kind==='frost'){ray(c,f.x,f.y-65,p.x,p.y,'#c0f5ff',3);crystal(c,p.x,p.y,18,'#8be0ff');}
   if(f.kind==='support'){ray(c,f.x,f.y-65,p.x,p.y,'#eadb98',3);text('✦',p.x,p.y,26,'#fff2bc');}
   if(f.kind==='piercing'){ray(c,f.x,f.y-45,p.x,p.y,'#f6a068',11);ray(c,f.x,f.y-45,p.x,p.y,'#fff3ca',3);}
   if(f.kind==='execution'){ray(c,p.x-65,p.y-80,p.x+65,p.y+30,'#f5bef1',13);ray(c,p.x+50,p.y-75,p.x-50,p.y+30,'#fff1ff',6);text('심판',p.x,p.y-90,24,'#ffd8f3');}
   if(f.kind==='plasma'){const prev=i?targets[i-1]:{x:f.x,y:f.y-65};ray(c,prev.x,prev.y,p.x,p.y,'#ddb0ff',7);text('◇',p.x,p.y-20,35,'#fff1ff');}
   if(f.kind==='shatter'||f.kind==='blizzard-tick'){for(let j=0;j<5;j++){const a=j*TAU/5,r=reduced?22:15+f.age*130;crystal(c,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,16,'#b3edff');}}
   if(f.kind==='rally'||f.kind==='repair'){ray(c,f.x,f.y,p.x,p.y,f.kind==='repair'?'#a4ffc6':'#ffe7a5',3);text(f.kind==='repair'?`+${f.amount}`:'공격 ↑',p.x,p.y-30,24,f.kind==='repair'?'#a4ffc6':'#ffe7a5');}
  }c.restore();
 }
 if(g.phase==='build'&&g.autoRemaining!==null){c.save();c.fillStyle='#10292dec';c.fillRect(180,650,664,160);text(`웨이브 ${g.wave} 클리어 · +${g.lastReward}G`,512,692,30,'#e3efbd');text(`${Math.ceil(g.autoRemaining)}초 후 자동 출발`,512,753,36,'#f9f1cf');c.restore();}
}
