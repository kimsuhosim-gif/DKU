export const CAST=[
 {id:'hyomin',name:'김효민',color:'#88b79b',detail:'흰 모자 · 사각 안경',image:'/images/rooftop-hyomin-v1.png'},
 {id:'jaeyeop',name:'정재엽',color:'#e0bc79',detail:'둥근 앞머리 · 베이지 재킷',image:'/images/rooftop-jaeyeop-v1.png'},
 {id:'seongtae',name:'김성태',color:'#9daff0',detail:'가르마 머리 · 네이비 점퍼',image:'/images/rooftop-seongtae-v1.png'},
 {id:'manjong',name:'유만종',color:'#6fbdb6',detail:'베이지 모자 · 청록 점퍼',image:'/images/rooftop-manjong-v1.png'},
 {id:'yeonseong',name:'신연성',color:'#df9396',detail:'흰 모자 · 와인색 재킷',image:'/images/rooftop-yeonseong-v1.png'},
 {id:'moseongjin',name:'모성진',color:'#e4c15b',detail:'크림 모자 · 노랑 포인트',image:'/images/rooftop-moseongjin-v1.png'},
] as const;
export type Action='push'|'grab'|'dash'|'jump'|'guard';
export type Fighter={cast:number;x:number;y:number;vx:number;vy:number;angle:number;damage:number;stamina:number;alive:boolean;fall:number;hang:number;escape:number;cool:number;dash:number;stun:number;pose:number;poseTime:number;carrying:number;heldBy:number;hold:number;ai:number;gait:number;wins:number;lastBy:number;jump:number;guard:number;combo:number;comboTime:number};
export type Event={kind:'hit'|'throw'|'dash'|'fall'|'save'|'round';x:number;y:number;text:string};
export const stickVector=(x:number,y:number)=>{const n=Math.hypot(x,y);if(n<6)return{x:0,y:0};const a=Math.min(1,(n-6)/30);return{x:x/n*a,y:y/n*a};};
const dist=(a:Fighter,b:Fighter)=>Math.hypot(a.x-b.x,a.y-b.y);
export class RooftopMatch{
 fighters:Fighter[]=[];events:Event[]=[];phase:'ready'|'countdown'|'playing'|'paused'|'round'|'finished'='ready';round=1;time=0;countdown=2.4;winner=-1;selected=0;stick={x:0,y:0};private resumePhase:'countdown'|'playing'='playing';
 constructor(private random:()=>number=Math.random){}
 get bounds(){const shrink=Math.max(0,this.time-35);return{x:Math.max(90,350-shrink*5),y:Math.max(70,220-shrink*3)};}
 start(selected=0){this.selected=Math.max(0,Math.min(5,selected));const others=CAST.map((_,i)=>i).filter(i=>i!==this.selected);for(let i=others.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}this.fighters=[this.selected,...others.slice(0,3)].map((cast,i)=>this.make(cast,i,0));this.round=1;this.nextRound(false);}
 private make(cast:number,i:number,wins:number):Fighter{const points=[[-180,100],[180,-100],[-180,-100],[180,100]];return{cast,x:points[i][0],y:points[i][1],vx:0,vy:0,angle:Math.atan2(-points[i][1],-points[i][0]),damage:0,stamina:100,alive:true,fall:0,hang:0,escape:0,cool:0,dash:0,stun:0,pose:0,poseTime:0,carrying:-1,heldBy:-1,hold:0,ai:.5+i*.2,gait:0,wins,lastBy:-1,jump:0,guard:0,combo:0,comboTime:0};}
 nextRound(increment=true){if(increment&&this.phase!=='round')return;if(increment)this.round++;this.fighters=this.fighters.map((p,i)=>this.make(p.cast,i,p.wins));this.time=0;this.countdown=2.4;this.winner=-1;this.events=[];this.stick={x:0,y:0};this.phase='countdown';}
 pause(){if(this.phase==='paused')this.phase=this.resumePhase;else if(this.phase==='playing'||this.phase==='countdown'){this.resumePhase=this.phase;this.phase='paused';}this.stick={x:0,y:0};}
 private event(kind:Event['kind'],p:Fighter,text:string){this.events.push({kind,x:p.x,y:p.y,text});}
 action(i:number,action:Action){const p=this.fighters[i];if(this.phase!=='playing'||!p?.alive)return;
  if(p.hang>0){if(action==='push'&&p.cool<=0){p.escape++;p.cool=.15;if(p.escape>=3){const b=this.bounds;p.x=Math.max(-b.x+35,Math.min(b.x-35,p.x));p.y=Math.max(-b.y+35,Math.min(b.y-35,p.y));p.hang=0;p.stun=.3;p.damage=Math.max(0,p.damage-15);this.event('save',p,'살았다!');}}return;}
  if(p.heldBy>=0){if(action==='dash'&&p.stamina>=30){const holder=this.fighters[p.heldBy];holder.carrying=-1;holder.stun=.45;p.heldBy=-1;p.stamina-=30;p.stun=.1;this.event('save',p,'놓으라고!');}return;}
  if(p.stun>0||p.cool>0)return;
  if(action==='guard'){if(p.stamina<12||p.jump>0||p.carrying>=0)return;p.stamina-=12;p.guard=.65;p.cool=.7;return;}
  if(action==='jump'){if(p.stamina<16||p.jump>0||p.carrying>=0)return;p.stamina-=16;p.jump=.65;return;}
  if(p.carrying>=0){const target=this.fighters[p.carrying];target.heldBy=-1;target.stun=.5;target.vx=Math.cos(p.angle)*430*(1+target.damage/100);target.vy=Math.sin(p.angle)*430*(1+target.damage/100);target.damage=Math.min(100,target.damage+18);target.lastBy=i;p.carrying=-1;p.cool=.6;p.pose=3;p.poseTime=.3;this.event('throw',target,'잘 가라!');return;}
  if(action==='dash'){if(p.stamina<30)return;p.stamina-=30;p.dash=.22;p.cool=.45;p.vx=Math.cos(p.angle)*430;p.vy=Math.sin(p.angle)*430;this.event('dash',p,'');return;}
  if(action==='push'){p.combo=p.comboTime>0?(p.combo%3)+1:1;p.comboTime=.85;}
  p.cool=action==='push'?(p.combo===3?.55:.25):.65;p.pose=action==='push'?3:4;p.poseTime=.25;
  const target=this.fighters.map((q,j)=>({q,j})).filter(({q,j})=>j!==i&&q.alive&&!q.hang&&q.heldBy<0&&q.carrying<0&&dist(p,q)<76).sort((a,b)=>dist(p,a.q)-dist(p,b.q)).find(({q})=>Math.cos(Math.atan2(q.y-p.y,q.x-p.x)-p.angle)>.15);
  if(!target)return;const {q,j}=target;
  if(q.jump>.12&&p.jump<=0)return;
  if(action==='push'&&q.guard>0&&Math.cos(Math.atan2(p.y-q.y,p.x-q.x)-q.angle)>0){q.stamina=Math.max(0,q.stamina-10);this.event('save',q,'BLOCK');return;}
  if(action==='grab'&&p.stamina>=18){p.stamina-=18;p.carrying=j;p.hold=.8;q.heldBy=i;q.vx=0;q.vy=0;q.pose=5;this.event('hit',q,'잡았다!');}
  else if(action==='push'){q.damage=Math.min(100,q.damage+(p.combo===3?24:12));const force=(p.combo===3?340:220)*(1+q.damage/80);q.vx=Math.cos(p.angle)*force;q.vy=Math.sin(p.angle)*force;q.stun=.28;q.lastBy=i;q.pose=5;q.poseTime=.3;this.event('hit',q,p.combo===3?'SMASH!':`${p.combo} HIT`);}
 }
 update(dt:number){dt=Math.min(.05,Math.max(0,dt));if(this.phase==='countdown'){this.countdown-=dt;if(this.countdown<=0)this.phase='playing';return;}if(this.phase!=='playing')return;this.time+=dt;const b=this.bounds;
  for(let i=0;i<this.fighters.length;i++){const p=this.fighters[i];if(!p.alive){p.fall+=dt;continue;}p.cool=Math.max(0,p.cool-dt);p.stun=Math.max(0,p.stun-dt);p.poseTime=Math.max(0,p.poseTime-dt);p.stamina=Math.min(100,p.stamina+dt*13);p.damage=Math.max(0,p.damage-dt*1.5);p.dash=Math.max(0,p.dash-dt);
   p.jump=Math.max(0,p.jump-dt);p.guard=Math.max(0,p.guard-dt);p.comboTime=Math.max(0,p.comboTime-dt);
   if(p.hang>0){p.hang-=dt;if(i>0&&p.cool<=0&&this.random()<dt*2.8)this.action(i,'push');if(p.hang<=0&&p.escape<3)this.eliminate(i);continue;}
   if(p.heldBy>=0){const holder=this.fighters[p.heldBy];if(!holder.alive){p.heldBy=-1;continue;}p.x=holder.x+Math.cos(holder.angle)*25;p.y=holder.y+Math.sin(holder.angle)*25;if(i>0&&this.random()<dt*.7)this.action(i,'dash');continue;}
   let input=i===0?this.stick:{x:0,y:0};
   if(i>0){const target=this.fighters.filter(q=>q!==p&&q.alive&&q.heldBy<0).sort((a,c)=>dist(p,a)-dist(p,c))[0];if(target){let tx=target.x,ty=target.y;const danger=Math.abs(p.x)>b.x-55||Math.abs(p.y)>b.y-45;if(p.carrying>=0){tx=Math.sign(p.x||1)*(b.x+40);ty=p.y;}else if(danger&&p.stun<=0){tx=0;ty=0;}const a=Math.atan2(ty-p.y,tx-p.x);input={x:Math.cos(a),y:Math.sin(a)};p.ai-=dt;if(p.ai<=0){p.ai=.25+this.random()*.4;p.angle=Math.atan2(target.y-p.y,target.x-p.x);if(p.carrying>=0){p.angle=Math.atan2(p.y,p.x);this.action(i,'grab');}else if(dist(p,target)<72)this.action(i,this.random()<.3?'grab':'push');else if(dist(p,target)>145&&!danger&&this.random()<.18)this.action(i,'dash');}}}
   if(p.carrying>=0){p.hold-=dt;if(p.hold<=0){p.cool=0;this.action(i,'grab');}}
   const n=Math.hypot(input.x,input.y);if(p.stun<=0&&p.dash<=0){if(n>.1)p.angle=Math.atan2(input.y,input.x);const speed=p.carrying>=0?95:150;const grip=Math.min(1,dt*14);p.vx+=(input.x/Math.max(1,n)*speed-p.vx)*grip;p.vy+=(input.y/Math.max(1,n)*speed-p.vy)*grip;}else{const drag=Math.exp(-dt*(p.dash>0?.5:3.5));p.vx*=drag;p.vy*=drag;}
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.gait+=Math.hypot(p.vx,p.vy)*dt/22;
   for(const obstacle of [{x:-100,y:-35,r:30},{x:120,y:45,r:30}]){const d=Math.hypot(p.x-obstacle.x,p.y-obstacle.y);if(d<obstacle.r+18){const a=Math.atan2(p.y-obstacle.y,p.x-obstacle.x);p.x=obstacle.x+Math.cos(a)*(obstacle.r+18);p.y=obstacle.y+Math.sin(a)*(obstacle.r+18);}}
   if(p.jump<=0&&(Math.abs(p.x)>b.x+10||Math.abs(p.y)>b.y+10)){if(p.damage<75&&p.escape===0&&this.time<80){p.x=Math.max(-b.x-6,Math.min(b.x+6,p.x));p.y=Math.max(-b.y-6,Math.min(b.y+6,p.y));p.hang=1.4;p.vx=0;p.vy=0;p.cool=0;this.release(i);this.event('hit',p,i===0?'복귀!':'EDGE!');}else this.eliminate(i);}
  }
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const p=this.fighters[i],q=this.fighters[j];if(!p.alive||!q.alive||p.hang||q.hang||p.heldBy>=0||q.heldBy>=0)continue;const d=dist(p,q);if(d<36){const a=d<.01?i:Math.atan2(q.y-p.y,q.x-p.x),overlap=(36-d)/2;p.x-=Math.cos(a)*overlap;p.y-=Math.sin(a)*overlap;q.x+=Math.cos(a)*overlap;q.y+=Math.sin(a)*overlap;if(p.dash>0||q.dash>0){const attacker=p.dash>0?p:q,victim=p.dash>0?q:p,dir=attacker===p?a:a+Math.PI;victim.vx=Math.cos(dir)*360;victim.vy=Math.sin(dir)*360;victim.stun=.35;victim.damage=Math.min(100,victim.damage+14);victim.lastBy=attacker===p?i:j;attacker.dash=0;attacker.stun=.12;this.event('hit',victim,'몸통 박치기!');}}}
  const alive=this.fighters.map((p,i)=>p.alive?i:-1).filter(i=>i>=0);if(alive.length<=1){this.winner=alive[0]??-1;if(this.winner>=0)this.fighters[this.winner].wins++;this.phase=this.winner>=0&&this.fighters[this.winner].wins>=2?'finished':'round';this.stick={x:0,y:0};this.event('round',this.fighters[this.winner>=0?this.winner:0],this.winner===0?'옥상 접수!':this.winner<0?'동반 퇴근!':`${CAST[this.fighters[this.winner].cast].name} 승리`);}
 }
 private release(i:number){const p=this.fighters[i];if(p.carrying>=0){this.fighters[p.carrying].heldBy=-1;p.carrying=-1;}if(p.heldBy>=0){this.fighters[p.heldBy].carrying=-1;p.heldBy=-1;}}
 private eliminate(i:number){const p=this.fighters[i];this.release(i);p.alive=false;p.hang=0;p.fall=0;this.event('fall',p,i===0?'먼저 내려갈게…':`${CAST[p.cast].name} 퇴장!`);}
}
