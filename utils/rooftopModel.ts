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
// Full centre-to-centre pushbox dimensions. Depth accounts for the .60 screen projection.
export const BODY={x:128,y:250};
export const attackReach=(cast:number)=>WEAPONS[cast].reach+BODY.x-52;
export const SPECIALS=[
 {name:'홀인원 캐논',description:'직선 관통 샷',duration:1.05,pulses:[.52],range:480,damage:36,force:340},
 {name:'장외 홈런',description:'전방 적들을 크게 날린다',duration:1.15,pulses:[.57],range:290,damage:42,force:780},
 {name:'옥상 지진',description:'주변 충격파 · 점프로 회피',duration:1.25,pulses:[.62],range:310,damage:40,force:390},
 {name:'퇴근 러시',description:'네 번의 잽과 마무리 어퍼컷',duration:1.25,pulses:[.35,.49,.63,.77,.96],range:210,damage:7,force:35},
 {name:'일직선 출근',description:'충돌을 지키는 돌진 관통 찌르기',duration:1.10,pulses:[.58],range:360,damage:40,force:500},
 {name:'반품 불가',description:'받아치기 자세 · 맞으면 반격',duration:1.20,pulses:[],range:240,damage:46,force:520},
] as const;
export type Action='push'|'heavy'|'dash'|'jump'|'guard'|'special';
export type Fighter={cast:number;x:number;y:number;vx:number;vy:number;angle:number;hp:number;stamina:number;alive:boolean;fall:number;cool:number;dash:number;stun:number;down:number;invulnerable:number;poseTime:number;attackDuration:number;windup:number;attackKind:'push'|'heavy'|'special';attackStep:number;ai:number;gait:number;wins:number;lastBy:number;jump:number;guard:number;combo:number;comboTime:number;meter:number;specialLeft:number;specialPulse:number;specialCooldown:number;momentum:number;empowered:boolean};
export type Event={kind:'hit'|'heavy'|'fall'|'save'|'dash'|'round'|'special'|'special-impact';x:number;y:number;text:string;cast?:number;angle?:number;jump?:number;targetY?:number};
export const stickVector=(x:number,y:number)=>{const n=Math.hypot(x,y);if(n<6)return{x:0,y:0};const a=Math.min(1,(n-6)/30);return{x:x/n*a,y:y/n*a};};
const dist=(a:Fighter,b:Fighter)=>Math.hypot(a.x-b.x,a.y-b.y);
export class RooftopMatch{
 fighters:Fighter[]=[];events:Event[]=[];phase:'ready'|'countdown'|'playing'|'paused'|'round'|'finished'='ready';round=1;time=0;countdown=2.4;winner=-1;selected=0;stick={x:0,y:0};private resumePhase:'countdown'|'playing'='playing';
 constructor(private random:()=>number=Math.random){}
 get bounds(){return{x:ARENA.x,y:ARENA.y};}
 start(selected=0){this.selected=Math.max(0,Math.min(5,selected));const others=CAST.map((_,i)=>i).filter(i=>i!==this.selected);for(let i=others.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[others[i],others[j]]=[others[j],others[i]];}this.fighters=[this.selected,...others.slice(0,3)].map((cast,i)=>this.make(cast,i,0));this.round=1;this.nextRound(false);}
 private make(cast:number,i:number,wins:number):Fighter{const points=[[-320,170],[320,-170],[-320,-170],[320,170]];return{cast,x:points[i][0],y:points[i][1],vx:0,vy:0,angle:Math.atan2(-points[i][1],-points[i][0]),hp:MAX_HP,stamina:100,alive:true,fall:0,cool:0,dash:0,stun:0,down:0,invulnerable:0,poseTime:0,attackDuration:0,windup:0,attackKind:'push',attackStep:1,ai:.5+i*.2,gait:0,wins,lastBy:-1,jump:0,guard:0,combo:0,comboTime:0,meter:100,specialLeft:0,specialPulse:0,specialCooldown:0,momentum:0,empowered:false};}
 nextRound(increment=true){if(increment&&this.phase!=='round')return;if(increment)this.round++;this.fighters=this.fighters.map((p,i)=>this.make(p.cast,i,p.wins));this.time=0;this.countdown=2.4;this.winner=-1;this.events=[];this.stick={x:0,y:0};this.phase='countdown';}
 pause(){if(this.phase==='paused')this.phase=this.resumePhase;else if(this.phase==='playing'||this.phase==='countdown'){this.resumePhase=this.phase;this.phase='paused';}this.stick={x:0,y:0};}
 private aim(i:number,range:number,lane:number){
  const p=this.fighters[i],manual=i===0&&Math.hypot(this.stick.x,this.stick.y)>.1;
  if(manual)p.angle=Math.atan2(this.stick.y,this.stick.x);
  const target=this.fighters.filter(q=>q!==p&&q.alive&&q.down<=0&&dist(p,q)<range&&Math.abs(q.y-p.y)<lane&&(!manual||Math.cos(Math.atan2(q.y-p.y,q.x-p.x)-p.angle)>.65)).sort((a,b)=>dist(p,a)-dist(p,b))[0];
  if(target)p.angle=Math.atan2(target.y-p.y,target.x-p.x);
 }
 private event(kind:Event['kind'],p:Fighter,text:string,attacker?:Fighter){this.events.push({kind,x:p.x-(attacker?Math.cos(attacker.angle)*22:0),y:p.y,text,cast:attacker?.cast,angle:attacker?.angle,jump:p.jump,targetY:p.y});}
 action(i:number,action:Action){
  const p=this.fighters[i];if(this.phase!=='playing'||!p?.alive||p.down>0||p.stun>0)return;
  if(p.specialLeft>0)return;
  // Dodge cancels recovery, but not the startup or active strike.
  if(action==='dash'&&p.stamina>=25&&p.windup<=0&&p.dash<=0){p.stamina-=25;p.momentum=1.1;p.dash=.25;p.invulnerable=.24;p.cool=.32;p.poseTime=0;p.guard=0;p.combo=0;p.comboTime=0;const n=i===0?Math.hypot(this.stick.x,this.stick.y):0;if(n>.1)p.angle=Math.atan2(this.stick.y,this.stick.x);p.vx=Math.cos(p.angle)*470;p.vy=Math.sin(p.angle)*470;this.event('dash',p,'');return;}
  if(p.cool>0||p.poseTime>0||p.dash>0)return;
  if(action==='guard'){if(p.stamina<12||p.jump>0)return;p.stamina-=12;p.guard=.55;p.cool=.22;return;}
  if(action==='jump'){if(p.stamina<16||p.jump>0)return;p.stamina-=16;p.jump=.65;return;}
  if(action==='special'){
   if(p.meter<100||p.specialCooldown>0||p.jump>0)return;
   const s=SPECIALS[p.cast];this.aim(i,s.range+100,180);
   p.meter=0;p.specialCooldown=10;p.specialLeft=s.duration;p.specialPulse=0;p.attackKind='special';p.attackDuration=s.duration;p.poseTime=s.duration;p.cool=s.duration;p.windup=0;p.combo=0;p.comboTime=0;p.guard=p.cast===5?s.duration:0;
   this.events.push({kind:'special',x:p.x,y:p.y,text:SPECIALS[p.cast].name,cast:p.cast,angle:p.angle});return;
  }
  if(action!=='push'&&action!=='heavy')return;if(action==='heavy'&&p.stamina<24)return;
  const weapon=WEAPONS[p.cast],chain=action==='heavy'&&p.comboTime>0&&p.combo>=2;this.aim(i,attackReach(p.cast)+50,65);
  p.empowered=p.momentum>0||chain;p.momentum=0;
  p.guard=0;p.attackKind=action;p.attackStep=action==='heavy'?1:p.comboTime>0?p.combo%3+1:1;
  p.attackDuration=action==='heavy'?Math.max(.48,weapon.cool*(chain?1.1:1.6)):Math.max(.26,weapon.cool*.86);
  p.poseTime=p.attackDuration;p.windup=p.attackDuration*.5;p.cool=p.attackDuration;
  if(action==='heavy'){p.stamina-=24;p.combo=0;p.comboTime=0;}
 }
 private strike(i:number){
  const p=this.fighters[i];if(!p.alive||p.stun>0||p.down>0)return;
  const w=WEAPONS[p.cast],heavy=p.attackKind==='heavy',finisher=!heavy&&p.attackStep===3;
  const target=this.fighters.map((q,j)=>({q,j})).filter(({q,j})=>j!==i&&q.alive&&q.down<=0&&q.invulnerable<=0&&Math.abs(q.y-p.y)<55&&dist(p,q)<attackReach(p.cast)+(heavy?18:0)&&Math.cos(Math.atan2(q.y-p.y,q.x-p.x)-p.angle)>.35&&!(q.jump>.12&&p.jump<=0)).sort((a,b)=>dist(p,a.q)-dist(p,b.q))[0];
  if(!target){p.combo=0;p.comboTime=0;return;}const {q,j}=target;
  if(this.counter(j,i))return;
  if(q.guard>0&&Math.cos(Math.atan2(p.y-q.y,p.x-q.x)-q.angle)>0){q.stamina=Math.max(0,q.stamina-(heavy?36:15));if(!heavy&&q.stamina>0){p.combo=0;p.comboTime=0;this.event('save',q,'BLOCK',p);return;}q.guard=0;this.event('save',q,'GUARD BREAK',p);}
  const damage=Math.round(w.damage*(heavy?1.8:finisher?1.35:.8)*(p.empowered?1.3:1));q.hp=Math.max(0,q.hp-damage);q.lastBy=i;q.windup=0;q.poseTime=0;q.guard=0;q.combo=0;q.comboTime=0;q.specialLeft=0;q.momentum=0;
  p.meter=Math.min(100,p.meter+damage*.85);q.meter=Math.min(100,q.meter+damage*.45);
  const force=heavy?w.force*.7:finisher?w.force*.48:48;q.vx=Math.cos(p.angle)*force;q.vy=Math.sin(p.angle)*force;q.stun=heavy?.42:finisher?.3:.14;q.invulnerable=heavy?.78:.16;q.down=heavy?.55:0;
  if(!heavy){p.combo=p.attackStep;p.comboTime=1.1;}this.event(heavy||finisher?'heavy':'hit',q,p.empowered?`-${damage} BREAK!`:heavy?`-${damage} POWER`:`-${damage}  ${p.attackStep} HIT`,p);if(q.hp<=0)this.eliminate(j);
 }
 private counter(defender:number,attacker:number){
  const q=this.fighters[defender],p=this.fighters[attacker];
  if(q.cast!==5||q.specialLeft<=0||q.guard<=0||Math.cos(Math.atan2(p.y-q.y,p.x-q.x)-q.angle)<=0)return false;
  q.specialLeft=0;q.momentum=0;q.guard=0;q.poseTime=.35;q.attackDuration=.7;q.cool=.35;
  this.events.push({kind:'special-impact',x:q.x,y:q.y,text:'반품 완료!',cast:5,angle:q.angle});
  this.specialDamage(defender,attacker,SPECIALS[5].damage,SPECIALS[5].force,true);return true;
 }
 private specialDamage(i:number,j:number,damage:number,force:number,final:boolean){
  const p=this.fighters[i],q=this.fighters[j];
  q.hp=Math.max(0,q.hp-damage);q.lastBy=i;q.windup=0;q.poseTime=0;q.specialLeft=0;q.momentum=0;q.guard=0;q.combo=0;q.comboTime=0;
  q.meter=Math.min(100,q.meter+damage*.45);
  const angle=p.cast===2?Math.atan2(q.y-p.y,q.x-p.x):p.angle;
  q.vx=Math.cos(angle)*force;q.vy=Math.sin(angle)*force;q.stun=final?.38:.10;q.down=final?.36:0;q.invulnerable=final?.5:.08;
  this.event(final?'heavy':'hit',q,`-${damage}${p.cast===3&&!final?' RUSH':''}`,p);
  if(q.hp<=0)this.eliminate(j);
 }
 private specialStrike(i:number,pulse:number){
  const p=this.fighters[i],s=SPECIALS[p.cast];
  if(!p.alive||p.stun>0||p.down>0)return;
  this.events.push({kind:'special-impact',x:p.x,y:p.y,text:'',cast:p.cast,angle:p.angle});
  for(let j=0;j<this.fighters.length;j++){
   const q=this.fighters[j];if(i===j||!q.alive||q.down>0||q.invulnerable>0)continue;
   const dx=q.x-p.x,dy=q.y-p.y,forward=dx*Math.cos(p.angle)+dy*Math.sin(p.angle),side=Math.abs(-dx*Math.sin(p.angle)+dy*Math.cos(p.angle));
   const radial=p.cast===2;
   const inside=radial?dist(p,q)<s.range:forward>0&&forward<s.range&&side<(p.cast===1?130:p.cast===3?70:48);
   if(!inside||q.jump>.12)continue;
   if(this.counter(j,i))return;
   const final=p.cast!==3||pulse===4;
   let damage=p.cast===3&&final?18:s.damage;
   if(q.guard>0&&Math.cos(Math.atan2(p.y-q.y,p.x-q.x)-q.angle)>0){damage=Math.round(damage*.4);this.event('save',q,'BLOCK',p);}
   this.specialDamage(i,j,damage,p.cast===3&&final?340:s.force,final);
  }
 }
 private clamp(p:Fighter){p.x=Math.max(-ARENA.x+BODY.x/2,Math.min(ARENA.x-BODY.x/2,p.x));p.y=Math.max(-ARENA.y+30,Math.min(ARENA.y-30,p.y));}
 private separate(){
  // Iterative axis resolution: still solid while dodging, airborne or knocked down.
  // Re-clamp after every pair, so walls cannot squeeze bodies into one another.
  for(let pass=0;pass<64;pass++){
   let overlap=false;
   for(let i=0;i<this.fighters.length;i++)for(let j=i+1;j<this.fighters.length;j++){
    const p=this.fighters[i],q=this.fighters[j];if(!p.alive||!q.alive)continue;
    const dx=q.x-p.x,dy=q.y-p.y,px=BODY.x-Math.abs(dx),py=BODY.y-Math.abs(dy);if(px<=.001||py<=.001)continue;overlap=true;
    const axis=px<py*.6?'x':'y',delta=axis==='x'?dx:dy,amount=(axis==='x'?px:py)+.02,sign=delta===0?(i%2?1:-1):Math.sign(delta);
    const beforeP=p[axis],beforeQ=q[axis];p[axis]-=sign*amount/2;q[axis]+=sign*amount/2;this.clamp(p);this.clamp(q);
    const moved=Math.abs(p[axis]-beforeP)+Math.abs(q[axis]-beforeQ),remaining=amount-moved;
    if(remaining>.001){if(Math.abs(p[axis]-beforeP)<amount/2-.001)q[axis]+=sign*remaining;else p[axis]-=sign*remaining;this.clamp(p);this.clamp(q);}
    const velocity=axis==='x'?'vx':'vy';if(p[velocity]*sign>0)p[velocity]=0;if(q[velocity]*sign<0)q[velocity]=0;
   }
   if(!overlap)break;
  }
 }
 private finish(winner:number){this.winner=winner;if(winner>=0)this.fighters[winner].wins++;this.phase=winner>=0&&this.fighters[winner].wins>=2?'finished':'round';this.stick={x:0,y:0};this.event('round',this.fighters[Math.max(0,winner)],winner<0?'무승부':`${CAST[this.fighters[winner].cast].name} 승리`);}
 update(dt:number){
  dt=Math.min(.05,Math.max(0,dt));if(this.phase==='countdown'){this.countdown-=dt;if(this.countdown<=0)this.phase='playing';return;}if(this.phase!=='playing')return;this.time+=dt;
  for(let i=0;i<this.fighters.length;i++){
   const p=this.fighters[i];if(!p.alive){p.fall+=dt;continue;}
   for(const key of ['cool','stun','down','invulnerable','poseTime','dash','jump','guard','comboTime','specialCooldown','momentum'] as const)p[key]=Math.max(0,p[key]-dt);
   p.stamina=Math.min(100,p.stamina+dt*(p.guard>0?3:15));
   p.meter=Math.min(100,p.meter+dt*2);
   if(p.specialLeft>0){
    if(p.stun>0||p.down>0){p.specialLeft=0;p.guard=0;}else{
     const s=SPECIALS[p.cast];p.specialLeft=Math.max(0,p.specialLeft-dt);const elapsed=s.duration-p.specialLeft;
     while(p.specialPulse<s.pulses.length&&elapsed>=s.pulses[p.specialPulse]){this.specialStrike(i,p.specialPulse++);if(p.specialLeft<=0||p.stun>0)break;}
    }
   }
   if(p.windup>0){p.windup=Math.max(0,p.windup-dt);if(p.windup<=0)this.strike(i);}
   let input=i===0?this.stick:{x:0,y:0};
   if(i>0){const target=this.fighters.filter(q=>q!==p&&q.alive).sort((a,b)=>dist(p,a)-dist(p,b))[0];if(target){
    const d=dist(p,target),a=Math.atan2(target.y-p.y,target.x-p.x),reach=attackReach(p.cast),advance=d>reach*.86?1:0;input={x:Math.cos(a)*advance,y:Math.abs(target.y-p.y)>25?Math.sign(target.y-p.y)*.8:Math.sin(a)*advance};
    if(Math.abs(target.y-p.y)>45&&Math.abs(target.x-p.x)<BODY.x+18)input.x=p.x<target.x?-1:p.x>target.x?1:i%2?1:-1;
    p.ai-=dt;
    if(p.ai<=0){p.ai=.18+this.random()*.3;if(p.poseTime<=0)p.angle=a;
     if(p.meter>=100&&p.specialCooldown<=0&&this.time>6+i*2&&d<SPECIALS[p.cast].range&&Math.abs(target.y-p.y)<65&&this.random()<.22)this.action(i,'special');
     else if(target.windup>0&&d<attackReach(target.cast)+15&&this.random()<.5){if(target.attackKind==='heavy'){p.angle=a+Math.PI;this.action(i,'dash');}else this.action(i,'guard');}
     else if(d<reach+5&&Math.abs(target.y-p.y)<50&&target.down<=0)this.action(i,this.random()<.24?'heavy':'push');
    }
   }}
   const n=Math.hypot(input.x,input.y);if(p.stun<=0&&p.down<=0&&p.dash<=0){if(n>.1&&p.specialLeft<=0&&(p.poseTime<=0||p.windup<=0||p.windup>p.attackDuration*.32))p.angle=Math.atan2(input.y,input.x);const speed=p.poseTime>0?(p.windup>0?65:150):p.guard>0?110:260,grip=Math.min(1,dt*24);if(input.x*p.vx<0)p.vx=0;if(input.y*p.vy<0)p.vy=0;p.vx+=(input.x/Math.max(1,n)*speed-p.vx)*grip;p.vy+=(input.y/Math.max(1,n)*speed-p.vy)*grip;}
   else{const drag=Math.exp(-dt*(p.dash>0?1:9));p.vx*=drag;p.vy*=drag;}
   if(p.cast===4&&p.specialLeft>0&&p.stun<=0){const elapsed=SPECIALS[4].duration-p.specialLeft;if(elapsed>.18&&elapsed<.58){p.vx=Math.cos(p.angle)*400;p.vy=Math.sin(p.angle)*400;}}
   p.x+=p.vx*dt;p.y+=p.vy*dt;p.gait+=Math.hypot(p.vx,p.vy)*dt/18;
   this.clamp(p);
  }
  this.separate();
  const alive=this.fighters.map((p,i)=>p.alive?i:-1).filter(i=>i>=0);if(alive.length<=1)this.finish(alive[0]??-1);
  else if(this.time>=ARENA.roundTime){const sorted=alive.sort((a,b)=>this.fighters[b].hp-this.fighters[a].hp);this.finish(this.fighters[sorted[0]].hp===this.fighters[sorted[1]].hp?-1:sorted[0]);}
 }
 private eliminate(i:number){const p=this.fighters[i];p.alive=false;p.hp=0;p.fall=0;p.windup=0;p.poseTime=0;p.specialLeft=0;this.event('fall',p,'K.O.');}
}
