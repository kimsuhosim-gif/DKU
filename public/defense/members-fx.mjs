// Game-native vector particles, layered light and readable command pulses.
// Character poses are separate model-drawn sprites; these never deform the body.
import {SLOTS} from './board.mjs';
const TAU=Math.PI*2;
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function streak(c,x,y,tx,ty,color,w){c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke();}
function shard(c,x,y,a,size){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#c8f8ff';c.strokeStyle='#5fbbed';c.lineWidth=2;c.beginPath();c.moveTo(0,-size);c.lineTo(size*.3,0);c.lineTo(0,size*.4);c.lineTo(-size*.3,0);c.closePath();c.fill();c.stroke();c.restore();}
export function drawMemberFX(c,g,reduced){
 g.towers.forEach((t,i)=>{if(!t||!['frost','support'].includes(t.type))return;const s=SLOTS[i],age=t.action?g.time-t.action.at:Infinity;if(!t.action||age<0||age>t.action.windup)return;const p=age/t.action.windup,dir=t.aim?.x<s.x?-1:1,x=s.x+dir*(t.type==='frost'?88:110),y=s.y-110;c.save();c.globalCompositeOperation='screen';glow(c,x,y,18+p*35,t.type==='frost'?'#7beaffbb':'#ffe599bb');c.restore();});
 for(const f of g.effects){if(!['frost','support','blizzard-tick','shatter','rally','repair'].includes(f.kind))continue;
  const age=f.age,p=Math.min(1,age/f.life);c.save();c.globalAlpha=1-p;
  for(const [i,t] of (f.targets||[]).entries()){
   const dir=t.x<f.x?-1:1,sx=f.x+dir*(f.kind==='frost'?90:110),sy=f.y-76;
   if(f.kind==='frost'){
    const travel=reduced?1:Math.min(1,age/.10),x=sx+(t.x-sx)*travel,y=sy+(t.y-sy)*travel,dx=t.x-sx,dy=t.y-sy,len=Math.hypot(dx,dy)||1;
    c.globalCompositeOperation='screen';glow(c,x,y,35,'#46cfffaa');streak(c,x-dx/len*65,y-dy/len*65,x,y,'#2eb8ef88',15);streak(c,x-dx/len*42,y-dy/len*42,x,y,'#e4ffff',4);c.globalCompositeOperation='source-over';
    if(travel===1){for(let j=0;j<6;j++){const a=j*TAU/6+i,r=reduced?18:12+age*105;shard(c,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r,a,10*(1-p)+3);}c.strokeStyle='#c4f6ff';c.lineWidth=3;c.beginPath();c.ellipse(t.x,t.y,12+age*55,7+age*30,0,0,TAU);c.stroke();}
   }else if(f.kind==='support'){
    const dx=t.x-sx,dy=t.y-sy,a=Math.atan2(dy,dx),travel=reduced?1:Math.min(1,age/.13),x=sx+dx*travel,y=sy+dy*travel;c.save();c.translate(x,y);c.rotate(a);c.globalCompositeOperation='screen';glow(c,0,0,32,'#ffd26c99');c.fillStyle='#fff4c2';c.beginPath();c.moveTo(24,0);c.lineTo(-22,-9);c.lineTo(-12,0);c.lineTo(-22,9);c.closePath();c.fill();streak(c,-65,0,-12,0,'#ffbf68aa',6);c.restore();
    if(travel===1){streak(c,t.x-22,t.y-22,t.x+22,t.y+22,'#fff0ad',4);streak(c,t.x+22,t.y-22,t.x-22,t.y+22,'#f6b85a',3);}
   }else if(f.kind==='shatter'||f.kind==='blizzard-tick'){
    glow(c,t.x,t.y,80*(1-p)+30,'#73d9ff77');for(let j=0;j<8;j++){const a=j*TAU/8,r=reduced?30:12+age*180;shard(c,t.x+Math.cos(a)*r,t.y+Math.sin(a)*r*.65,a,24*(1-p)+4);}
    c.strokeStyle='#b9f6ff';c.lineWidth=5*(1-p)+1;c.beginPath();c.ellipse(t.x,t.y,30+age*180,15+age*90,0,0,TAU);c.stroke();
   }else{
    const heal=f.kind==='repair',color=heal?'#9bffd6':'#ffe6a0';glow(c,t.x,t.y-45,85,heal?'#75efb055':'#ffca5955');c.strokeStyle=color;c.lineWidth=4;c.beginPath();c.ellipse(t.x,t.y+15,55+p*35,18+p*12,0,0,TAU);c.stroke();
    for(let j=0;j<3;j++){const y=t.y-20-j*27-(reduced?0:age*40);streak(c,t.x-12,y+10,t.x,y,color,4);streak(c,t.x,y,t.x+12,y+10,color,4);}
   }
  }c.restore();
 }
}
