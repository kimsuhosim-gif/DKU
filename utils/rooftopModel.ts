export const CAST=[
 {id:'hyomin',name:'김효민',color:'#88b79b',detail:'흰 모자 · 사각 안경',image:'/images/rooftop-hyomin-v2.png'},
 {id:'jaeyeop',name:'정재엽',color:'#e0bc79',detail:'둥근 앞머리 · 베이지 재킷',image:'/images/rooftop-jaeyeop-v2.png'},
 {id:'seongtae',name:'김성태',color:'#9daff0',detail:'가르마 머리 · 네이비 점퍼',image:'/images/rooftop-seongtae-v2.png'},
 {id:'manjong',name:'유만종',color:'#6fbdb6',detail:'베이지 모자 · 청록 점퍼',image:'/images/rooftop-manjong-v2.png'},
 {id:'yeonseong',name:'신연성',color:'#df9396',detail:'흰 모자 · 와인색 재킷',image:'/images/rooftop-yeonseong-v2.png'},
 {id:'moseongjin',name:'모성진',color:'#e4c15b',detail:'크림 모자 · 노랑 포인트',image:'/images/rooftop-moseongjin-v2.png'},
] as const;
export const WEAPONS=[
 {name:'아이언 09',kind:'club',color:'#54d8c0',reach:125,damage:14,force:245,cool:.34},
 {name:'홈런 배트',kind:'bat',color:'#f4c75c',reach:105,damage:17,force:285,cool:.42},
 {name:'볼트 해머',kind:'hammer',color:'#779cf5',reach:100,damage:25,force:355,cool:.62},
 {name:'파워 글러브',kind:'glove',color:'#ef805b',reach:78,damage:10,force:210,cool:.21},
 {name:'레드 랜스',kind:'spear',color:'#f1789c',reach:165,damage:13,force:235,cool:.46},
 {name:'골든 팬',kind:'pan',color:'#e3b949',reach:95,damage:20,force:310,cool:.49},
] as const;
export const ARENA={x:600,y:380,roundTime:120};
export const OBSTACLES:{x:number;y:number;r:number}[]=[];
export const MAX_HP=180;
export type Action='push'|'heavy'|'dash'|'jump'|'guard';
export type Fighter={cast:number;x:number;y:number;vx:number;vy:number;angle:number;hp:number;stamina:number;alive:boolean;fall:number;cool:number;dash:number;stun:number;down:number;invulnerable:number;poseTime:number;attackDuration:number;windup:number;attackKind:'push'|'heavy';attackStep:number;ai:number;gait:number;wins:number;lastBy:number;jump:number;guard:number;combo:number;comboTime:number};
export type Event={kind:'hit'|'heavy'|'fall'|'save'|'dash'|'round';x:number;y:number;text:string};
export const stickVector=(x:number,y:number)=>{const n=Math.hypot(x,y);if(n<6)return{x:0,y:0};const a=Math.min(1,(n-6)/30);return{x:x/n*a,y:y/n*a};};
const dist=(a:Fighter,b:Fighter)=>Math.hypot(a.x-b.x,a.y-b.y);
export class RooftopMatch{
 fighters:Fighter[]=[];events:Event[]=[];phase:'ready'|'countdown'|'playing'|'paused'|'round'|'finished'='ready';round=1;time=0;countdown=2.4;winner=-1;selected=0;stick={x:0,y:0};private resumePhase:'countdown'|'playing'='playing';
 constructor(private random:()=>number=Math.random){}
 get bounds(){return{x:ARENA.x,y:ARENA.y};}
 start(selected=0){this.selected=Math.max(0,Math.min(5,selected));const others=CAST.map((_,i)=>i).filter(i=>i!==this.selected);for(let i=others.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}this.fighters=[this.selected,...others.slice(0,3)].map((cast,i)=>this.make(cast,i,0));this.round=1;this.nextRound(false);}
 private make(cast:number,i:number,wins:number):Fighter{const points=[[-320,170],[320,-170],[-320,-170],[320,170]];return{cast,x:points[i][0],y:points[i][1],vx:0,vy:0,angle:Math.atan2(-points[i][1],-points[i][0]),hp:MAX_HP,stamina:100,alive:true,fall:0,cool:0,dash:0,stun:0,down:0,invulnerable:0,poseTime:0,attackDuration:0,windup:0,attackKind:'push',attackStep:1,ai:.5+i*.2,gait:0,wins,lastBy:-1,jump:0,guard:0,combo:0,comboTime:0};}
 nextRound(increment=true){if(increment&&this.phase!=='round')return;if(increment)this.round++;this.fighters=this.fighters.map((p,i)=>this.make(p.cast,i,p.wins));this.time=0;this.countdown=2.4;this.winner=-1;this.events=[];this.stick={x:0,y:0};this.phase='countdown';}
 pause(){if(this.phase==='paused')this.phase=this.resumePhase;else if(this.phase==='playing'||this.phase==='countdown'){this.resumePhase=this.phase;this.phase='paused';}this.stick={x:0,y:0};}
 private event(kind:Event['kind'],p:Fighter,text:string){this.events.push({kind,x:p.x,y:p.y,text});}
 action(i:number,action:Action){
  const p=this.fighters[i];if(this.phase!=='playing'||!p?.alive||p.down>0||p.stun>0)return;
  // Dodge cancels recovery, but not the startup or active strike.
  if(action==='dash'&&p.stamina>=25&&p.windup<=0&&p.dash<=0){p.stamina-=25;p.dash=.25;p.invulnerable=.24;p.cool=.32;p.poseTime=0;p.guard=0;p.combo=0;p.comboTime=0;const n=i===0?Math.hypot(this.stick.x,this.stick.y):0;if(n>.1)p.angle=Math.atan2(this.stick.y,this.stick.x);p.vx=Math.cos(p.angle)*470;p.vy=Math.sin(p.angle)*470;this.event('dash',p,'');return;}
  if(p.cool>0||p.poseTime>0||p.dash>0)return;
  if(action==='guard'){if(p.stamina<12||p.jump>0)return;p.stamina-=12;p.guard=.55;p.cool=.22;return;}
  if(action==='jump'){if(p.stamina<16||p.jump>0)return;p.stamina-=16;p.jump=.65;return;}
  if(action!=='push'&&action!=='heavy')return;if(action==='heavy'&&p.stamina<24)return;
  const weapon=WEAPONS[p.cast],aim=this.fighters.filter(q=>q!==p&&q.alive&&q.down<=0&&dist(p,q)<weapon.reach+50).sort((a,b)=>dist(p,a)-dist(p,b))[0];if(aim)p.angle=Math.atan2(aim.y-p.y,aim.x-p.x);
  p.guard=0;p.attackKind=action;p.attackStep=action==='heavy'?1:p.comboTime>0?p.combo%3+1:1;
  p.attackDuration=action==='heavy'?Math.max(.65,weapon.cool*1.8):Math.max(.32,weapon.cool);
  p.poseTime=p.attackDuration;p.windup=p.attackDuration*.5;p.cool=p.attackDuration;
  if(action==='heavy'){p.stamina-=24;p.combo=0;p.comboTime=0;}
 }
 private strike(i:number){
  const p=this.fighters[i];if(!p.alive||p.stun>0||p.down>0)return;
  const w=WEAPONS[p.cast],heavy=p.attackKind==='heavy',finisher=!heavy&&p.attackStep===3;
  const target=this.fighters.map((q,j)=>({q,j})).filter(({q,j})=>j!==i&&q.alive&&q.down<=0&&q.invulnerable<=0&&Math.abs(q.y-p.y)<55&&dist(p,q)<w.reach+(heavy?18:0)&&Math.cos(Math.atan2(q.y-p.y,q.x-p.x)-p.angle)>.35&&!(q.jump>.12&&p.jump<=0)).sort((a,b)=>dist(p,a.q)-dist(p,b.q))[0];
  if(!target){p.combo=0;p.comboTime=0;return;}const {q,j}=target;
  if(q.guard>0&&Math.cos(Math.atan2(p.y-q.y,p.x-q.x)-q.angle)>0){q.stamina=Math.max(0,q.stamina-(heavy?36:15));if(!heavy&&q.stamina>0){p.combo=0;p.comboTime=0;this.event('save',q,'BLOCK');return;}q.guard=0;this.event('save',q,'GUARD BREAK');}
  const damage=Math.round(w.damage*(heavy?1.8:finisher?1.35:.8));q.hp=Math.max(0,q.hp-damage);q.lastBy=i;q.windup=0;q.poseTime=0;q.guard=0;q.combo=0;q.comboTime=0;
  const force=heavy?w.force*.7:finisher?w.force*.48:48;q.vx=Math.cos(p.angle)*force;q.vy=Math.sin(p.angle)*force;q.stun=heavy?.42:finisher?.3:.14;q.invulnerable=heavy?.78:.16;q.down=heavy?.55:0;
  if(!heavy){p.combo=p.attackStep;p.comboTime=1.1;}this.event(heavy||finisher?'heavy':'hit',q,heavy?`-${damage} POWER`:`-${damage}  ${p.attackStep} HIT`);if(q.hp<=0)this.eliminate(j);
 }
 private finish(winner:number){this.winner=winner;if(winner>=0)this.fighters[winner].wins++;this.phase=winner>=0&&this.fighters[winner].wins>=2?'finished':'round';this.stick={x:0,y:0};this.event('round',this.fighters[Math.max(0,winner)],winner<0?'무승부':`${CAST[this.fighters[winner].cast].name} 승리`);}
 update(dt:number){
  dt=Math.min(.05,Math.max(0,dt));if(this.phase==='countdown'){this.countdown-=dt;if(this.countdown<=0)this.phase='playing';return;}if(this.phase!=='playing')return;this.time+=dt;
  for(let i=0;i<this.fighters.length;i++){
   const p=this.fighters[i];if(!p.alive){p.fall+=dt;continue;}
   for(const key of ['cool','stun','down','invulnerable','poseTime','dash','jump','guard','comboTime'] as const)p[key]=Math.max(0,p[key]-dt);
   p.stamina=Math.min(100,p.stamina+dt*(p.guard>0?3:15));
   if(p.windup>0){p.windup=Math.max(0,p.windup-dt);if(p.windup<=0)this.strike(i);}
   let input=i===0?this.stick:{x:0,y:0};
   if(i>0){const target=this.fighters.filter(q=>q!==p&&q.alive).sort((a,b)=>dist(p,a)-dist(p,b))[0];if(target){
    const d=dist(p,target),a=Math.atan2(target.y-p.y,target.x-p.x),reach=WEAPONS[p.cast].reach,advance=d>reach*.8?1:d<55?-.45:0;input={x:Math.cos(a)*advance,y:Math.abs(target.y-p.y)>25?Math.sign(target.y-p.y)*.8:Math.sin(a)*advance};p.ai-=dt;
    if(p.ai<=0){p.ai=.18+this.random()*.3;if(p.poseTime<=0)p.angle=a;
     if(target.windup>0&&d<WEAPONS[target.cast].reach+15&&this.random()<.5){if(target.attackKind==='heavy'){p.angle=a+Math.PI;this.action(i,'dash');}else this.action(i,'guard');}
     else if(d<reach+5&&Math.abs(target.y-p.y)<50&&target.down<=0)this.action(i,this.random()<.24?'heavy':'push');
    }
   }}
   const n=Math.hypot(input.x,input.y);if(p.stun<=0&&p.down<=0&&p.dash<=0){if(n>.1&&p.poseTime<=0&&p.guard<=0)p.angle=Math.atan2(input.y,input.x);const speed=p.poseTime>0?35:p.guard>0?65:225,grip=Math.min(1,dt*16);p.vx+=(input.x/Math.max(1,n)*speed-p.vx)*grip;p.vy+=(input.y/Math.max(1,n)*speed-p.vy)*grip;}
   else{const drag=Math.exp(-dt*(p.dash>0?1:9));p.vx*=drag;p.vy*=drag;}
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.gait+=Math.hypot(p.vx,p.vy)*dt/18;
   p.x=Math.max(-ARENA.x+25,Math.min(ARENA.x-25,p.x));p.y=Math.max(-ARENA.y+20,Math.min(ARENA.y-20,p.y));
  }
  for(let i=0;i<this.fighters.length;i++)for(let j=i+1;j<this.fighters.length;j++){const p=this.fighters[i],q=this.fighters[j];if(!p.alive||!q.alive||p.down>0||q.down>0||p.dash>0||q.dash>0)continue;const d=dist(p,q);if(d<52){const a=d<.01?i:Math.atan2(q.y-p.y,q.x-p.x),overlap=(52-d)/2;p.x-=Math.cos(a)*overlap;p.y-=Math.sin(a)*overlap;q.x+=Math.cos(a)*overlap;q.y+=Math.sin(a)*overlap;}}
  for(const p of this.fighters){p.x=Math.max(-ARENA.x+25,Math.min(ARENA.x-25,p.x));p.y=Math.max(-ARENA.y+20,Math.min(ARENA.y-20,p.y));}
  const alive=this.fighters.map((p,i)=>p.alive?i:-1).filter(i=>i>=0);if(alive.length<=1)this.finish(alive[0]??-1);
  else if(this.time>=ARENA.roundTime){const sorted=alive.sort((a,b)=>this.fighters[b].hp-this.fighters[a].hp);this.finish(this.fighters[sorted[0]].hp===this.fighters[sorted[1]].hp?-1:sorted[0]);}
 }
 private eliminate(i:number){const p=this.fighters[i];p.alive=false;p.hp=0;p.fall=0;p.windup=0;p.poseTime=0;this.event('fall',p,'K.O.');}
}
