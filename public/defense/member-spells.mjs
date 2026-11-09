// Model-painted motifs + deterministic particles. Character bodies are never deformed.
import {SLOTS} from './board.mjs';
import {memberHands,motionClip} from './characters.mjs';
const TAU=Math.PI*2;
function stamp(c,img,cell,x,y,size,angle=0,alpha=1,flat=1){
 if(!img||size<=0)return;c.save();c.globalAlpha*=Math.max(0,alpha);c.translate(x,y);c.scale(1,flat);c.rotate(angle);
 c.drawImage(img,cell%3*512,Math.floor(cell/3)*512,512,512,-size/2,-size/2,size,size);c.restore();
}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function ring(c,x,y,r,color,flat=1){c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.ellipse(x,y,r,r*flat,0,0,TAU);c.stroke();}
function spark(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*.4,y);c.lineTo(x,y+r);c.lineTo(x-r*.4,y);c.closePath();c.fill();}
function trail(c,s,t,p,bend,color,width){
 const x=s.x+(t.x-s.x)*p,y=s.y+(t.y-s.y)*p-Math.sin(p*Math.PI)*bend;
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();
 for(let j=0;j<=9;j++){const q=Math.max(0,p-.22)+Math.min(.22,p)*j/9,px=s.x+(t.x-s.x)*q,py=s.y+(t.y-s.y)*q-Math.sin(q*Math.PI)*bend;if(j)c.lineTo(px,py);else c.moveTo(px,py);}c.stroke();return {x,y};
}
function handsAt(type,root,options){return memberHands(type,options).map(h=>({x:root.x+h.x,y:root.y+h.y}));}
export function drawMemberGround(c,g,reduced,img){
 for(const z of g.zones){if(z.kind!=='blizzard')continue;
  const fade=Math.min(1,z.age/.12,(z.life-z.age)/.25),r=z.radius;
  c.save();c.globalAlpha=Math.max(0,fade)*.7;
  stamp(c,img,1,z.x,z.y,r*2,reduced?0:z.age*.3,.8,.72);
  ring(c,z.x,z.y,r,'#c5f6ff88',.72);c.restore();
 }
}
export function drawMemberFX(c,g,reduced,img){
 // Charge follows measured palms for the CURRENT pose, scale and facing.
 g.towers.forEach((t,i)=>{
  if(!t?.action||!['frost','support'].includes(t.type))return;
  const age=g.time-t.action.at,w=t.action.windup;if(age<0||age>w+.12)return;
  const s=(g.positions||SLOTS)[i],dir=t.aim?.x<s.x?-1:1,options={...t.action,actionAge:age,level:t.action.level||t.level,height:166+(t.level-1)*9,direction:dir,reduced};
  const points=handsAt(t.type,s,options),p=Math.min(1,age/w),ice=t.type==='frost';
  c.save();c.globalAlpha=age>w?Math.max(0,1-(age-w)/.12):.4+.6*p;
  for(const h of points){glow(c,h.x,h.y,16+p*18,ice?'#66dfff99':'#ffda8399');stamp(c,img,ice?1:2,h.x,h.y,22+p*24,reduced?0:age*5,.9);}
  if(t.action.skill)stamp(c,img,ice?1:t.action.skill==='repair'?5:3,s.x,s.y+3,115+p*35,reduced?0:age*2,.65,.35);
  c.restore();
 });
 // Persistent snow between four real damage ticks; rendering never changes simulation.
 for(const z of g.zones){if(z.kind!=='blizzard')continue;
  const fade=Math.max(0,Math.min(1,z.age/.15,(z.life-z.age)/.25));c.save();c.globalAlpha=fade;
  for(let j=0;j<(reduced?5:14);j++){
   const a=j*2.399963,rad=z.radius*Math.sqrt((j+.5)/14)*.9,fall=reduced?.65:(z.age*1.4+j*.173)%1;
   const x=z.x+Math.cos(a)*rad,y=z.y+Math.sin(a)*rad*.65-125+fall*140;
   stamp(c,img,0,x,y,26+j%3*8,Math.PI*.6,.55);if(j%3===0)spark(c,x+15,y-12,4,'#d8ffff');
  }c.restore();
 }
 for(const f of g.effects.slice(-80)){
  if(!['frost','support','blizzard-tick','shatter','rally','repair'].includes(f.kind))continue;
  const p=Math.min(1,f.age/f.life),fade=Math.min(1,(1-p)*2),targets=f.targets||[];
  c.save();c.globalAlpha=fade;
  if(f.kind==='frost'||f.kind==='support'){
   const ice=f.kind==='frost',dir=targets[0]?.x<f.x?-1:1,root={x:f.x,y:f.y+35};
   const opts={skill:f.skill,level:f.level||1,castIndex:f.castIndex||1,actionAge:.11,windup:.11,height:166+((f.level||1)-1)*9,direction:dir};
   const hands=handsAt(f.kind,root,opts),clip=motionClip(f.kind,opts);
   const origin=hands.length>1?{x:(hands[0].x+hands[1].x)/2,y:(hands[0].y+hands[1].y)/2}:hands[0];
   for(const [i,t] of targets.slice(0,3).entries()){
    const leading=[...hands].sort((a,b)=>(b.x-a.x)*dir);
    const start=['fan','ward'].includes(clip)?leading[i%leading.length]:origin,travel=reduced?1:Math.min(1,f.age/.11),bend=ice?(i-1)*14:28;
    if(travel<1){
     const q=trail(c,start,t,travel,bend,ice?'#68d6ff99':'#f8d17d99',ice?7:10);
     trail(c,start,t,travel,bend,ice?'#e1fcff':'#fff4cf',2);
     stamp(c,img,ice?0:2,q.x,q.y,ice?60:58,ice?Math.atan2(t.y-start.y,t.x-start.x):f.age*7);
    }else{
     const age=Math.max(0,f.age-.10),hit=Math.max(0,1-age/.4);
     if(ice){
      stamp(c,img,4,t.x,t.y+3,75+(f.level||1)*12,0,hit);
      for(let j=0;j<(reduced?3:6);j++){const a=j*TAU/6+i,r=reduced?22:15+age*120;stamp(c,img,0,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r*.65,16+hit*8,a,hit);}
     }else{
      stamp(c,img,3,t.x,t.y,75+age*95,reduced?0:age*1.5,hit);stamp(c,img,2,t.x,t.y,45*hit+12,0,hit);
      for(let j=0;j<5;j++){const a=j*TAU/5,r=16+age*100;spark(c,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r,3+hit*3,'#fff1be');}
     }
    }
   }
  }else if(f.kind==='shatter'||f.kind==='blizzard-tick'){
   for(const [i,t] of targets.slice(0,10).entries()){
    const size=f.kind==='shatter'?140:65;stamp(c,img,4,t.x,t.y+12,size*(.85+.15*Math.min(1,p*5)),0,1-p);
    if(f.kind==='shatter'){stamp(c,img,1,t.x,t.y+20,120+p*90,reduced?0:p*.4,(1-p)*.7,.5);for(let j=0;j<7;j++){const a=j*TAU/7+i,r=20+(reduced?.3:p)*110;stamp(c,img,0,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r*.6,22*(1-p)+10,a,1-p);}}
   }
  }else{
   const heal=f.kind==='repair';
   for(const t of targets){
    stamp(c,img,heal?5:3,t.x,t.y-10,130+Math.min(.4,p)*80,reduced?0:(heal?-1:1)*p*.6,1-p);
    stamp(c,img,heal?5:3,t.x,t.y+45,115+p*65,0,(1-p)*.7,.3);
    for(let j=0;j<(reduced?3:8);j++){const a=j*2.399,r=35+j%3*10,x=t.x+Math.cos(a)*r,y=t.y+30-(reduced?20:(p*95+j*12)%110);spark(c,x,y,5,heal?'#bcffe7':'#ffedb8');}
   }
  }c.restore();
 }
}
