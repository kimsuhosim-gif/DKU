export const W=960,H=540,DT=1/60;
export const HEROES={
 jaeho:{name:'재호',title:'빙결술사',color:'#8de5ff',speed:275,rate:.15,damage:19,shot:'ice',charge:'빙룡 관통',bomb:'백야 · 천빙진',option:'빙정 위성',desc:'관통하는 결정탄과 넓게 펼쳐지는 얼음 날개. 차지로 적의 대열을 꿰뚫어요.'},
 yeonseong:{name:'연성',title:'수호술사',color:'#ffe19a',speed:260,rate:.18,damage:17,shot:'light',charge:'수호령 출격',bomb:'금빛 · 만월결계',option:'황금 수호령',desc:'궤도를 휘어 적을 쫓는 빛 구체. 차지로 수호령을 보내고 결계로 탄을 지워요.'},
 hyomin:{name:'효민',title:'청풍검사',color:'#8af4c4',speed:315,rate:.19,damage:30,shot:'blade',charge:'청풍 삼연참',bomb:'비검 · 천풍난무',option:'비취 쌍검',desc:'빠르게 파고들어 넓은 검기로 벱니다. 차지 삼연참은 여러 적을 관통해요.'},
 manjong:{name:'만종',title:'용포술사',color:'#ffb17e',speed:235,rate:.25,damage:41,shot:'fire',charge:'용왕 중포',bomb:'홍련 · 용성낙하',option:'쌍룡 포대',desc:'느리지만 묵직한 화염포와 폭발 피해. 차지 중포는 뭉친 적을 한꺼번에 날려요.'}
};
export const STAGES=[
 {name:'구름바다',subtitle:'노을 너머, 동기들이 날아오른다',bg:0,boss:'운해의 청동룡',skin:3,duration:62,pattern:0},
 {name:'달빛 협곡',subtitle:'협곡을 가르는 그림자',bg:1,boss:'월하의 백호',skin:4,duration:68,pattern:1},
 {name:'바람 사원',subtitle:'두 갈래의 바람',bg:0,boss:'천풍의 파수꾼',skin:5,duration:72,pattern:2},
 {name:'붉은 성곽',subtitle:'길을 고르고, 성으로',bg:2,boss:'홍련 용선',skin:3,duration:75,pattern:3},
 {name:'별빛 회랑',subtitle:'고요를 깨는 날갯짓',bg:1,boss:'흑월의 백호',skin:4,duration:78,pattern:4},
 {name:'하늘 요새',subtitle:'마지막 문 앞에서',bg:2,boss:'낙성의 문지기',skin:5,duration:82,pattern:5},
 {name:'일식의 왕좌',subtitle:'네 사람의 하늘을 되찾아라',bg:2,boss:'천공왕 · 무영',skin:5,duration:86,pattern:6}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function random(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
export function createGame(hero='jaeho',difficulty='normal',seed=19){
 if(!HEROES[hero])hero='jaeho';if(!['easy','normal','hard'].includes(difficulty))difficulty='normal';
 return {version:1,hero,difficulty,seed,rng:seed>>>0,phase:'playing',stage:0,stageTime:0,time:0,tick:0,route:null,
 player:{x:180,y:270,lives:difficulty==='easy'?7:5,power:1,bombs:3,invincible:2,shotTimer:0,charge:0,charging:false,action:0,actionKind:'bolt'},
 enemies:[],shots:[],bullets:[],items:[],fx:[],boss:null,spawnTimer:1,nextId:1,score:0,kills:0,hits:0,charges:0,bombsUsed:0,grazes:0,
 stageKills:0,bossLog:[],transition:0,lastExtend:0,peakBullets:0,checkpoint:null,lastEvent:'',eventId:0};
}
export function checkpoint(s){return {version:1,hero:s.hero,difficulty:s.difficulty,seed:s.seed,rng:s.rng,stage:s.stage,route:s.route,score:s.score,kills:s.kills,hits:s.hits,charges:s.charges,bombsUsed:s.bombsUsed,grazes:s.grazes,bossLog:s.bossLog.map(b=>({...b})),time:s.time,player:{lives:s.player.lives,power:s.player.power,bombs:s.player.bombs},lastExtend:s.lastExtend};}
export function restore(c){
 if(!c||c.version!==1||!HEROES[c.hero]||!['easy','normal','hard'].includes(c.difficulty)||!Number.isInteger(c.stage)||c.stage<0||c.stage>6||![null,'sky','gorge'].includes(c.route))return null;
 for(const v of [c.seed,c.rng,c.score,c.kills,c.hits,c.time,c.player?.lives,c.player?.power,c.player?.bombs])if(!Number.isFinite(v)||v<0)return null;
 if(c.player.lives<1||c.player.lives>9||c.player.power<1||c.player.power>4||c.player.bombs>5)return null;
 const s=createGame(c.hero,c.difficulty,c.seed);for(const k of ['stage','route','score','kills','hits','time','rng','lastExtend','charges','bombsUsed','grazes'])s[k]=c[k]??s[k];
 s.bossLog=Array.isArray(c.bossLog)?c.bossLog.filter(b=>b&&Number.isFinite(b.stage)).slice(0,7):[];Object.assign(s.player,{lives:c.player.lives,power:c.player.power,bombs:c.player.bombs});s.checkpoint=checkpoint(s);return s;
}
function event(s,name){s.lastEvent=name;s.eventId++;}
function effect(s,x,y,kind,color,size=32,life=.5){s.fx.push({x,y,kind,color,size,life,maxLife:life});if(s.fx.length>100)s.fx.shift();}
function shot(s,x,y,angle,kind,damage,r=5,speed=660,pierce=1){if(s.shots.length>=220)return;s.shots.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,kind,damage,r,pierce,hit:[],life:kind==='blade'?.95:2.5});}
function fire(s){const p=s.player,h=HEROES[s.hero],n=p.power;let count=n===1?1:n===2?2:3;
 for(let i=0;i<count;i++){let a=(i-(count-1)/2)*(s.hero==='hyomin'?.09:.11);shot(s,p.x+27,p.y-5,a,h.shot,h.damage, s.hero==='hyomin'?13:6,s.hero==='manjong'?470:680,s.hero==='jaeho'||s.hero==='hyomin'?2:1);}
 if(n>=3)for(const side of [-1,1])shot(s,p.x+8,p.y+side*32,side*.035,h.shot,h.damage*.45,4,620,1);
 if(p.action<=0){p.action=.35;p.actionKind='bolt';}event(s,'shot');
}
function chargeFire(s){const p=s.player,h=HEROES[s.hero];s.charges++;p.action=.65;p.actionKind='charge';event(s,'charge');
 if(s.hero==='jaeho')for(let i=-2;i<=2;i++)shot(s,p.x+28,p.y,i*.07,'ice',100+10*p.power,13,820,8);
 if(s.hero==='yeonseong')for(let i=-2;i<=2;i++)shot(s,p.x+22,p.y+i*10,i*.13,'light',85+12*p.power,13,480,3);
 if(s.hero==='hyomin')for(let i=-1;i<=1;i++)shot(s,p.x+30,p.y+i*22,i*.15,'blade',180+15*p.power,25,600,10);
 if(s.hero==='manjong')shot(s,p.x+55,p.y,0,'meteor',360+30*p.power,23,430,2);
 effect(s,p.x+25,p.y,'charge',h.color,60,.6);
}
function damageEnemy(s,e,d){if(e.dead)return;e.hp-=d;e.flash=.06;if(e.hp<=0){e.dead=true;s.kills++;s.stageKills++;s.score+=e.boss?5000+s.stage*1000:e.kind===2?230:100;
 effect(s,e.x,e.y,'burst',e.boss?'#ffe6aa':'#ffbb79',e.boss?150:35,e.boss?1.8:.45);event(s,e.boss?'boss-down':'hit');
 if(e.boss){s.bossLog.push({stage:s.stage+1,name:STAGES[s.stage].boss,seconds:+s.stageTime.toFixed(2),lives:s.player.lives,hits:s.hits});s.phase='clear';s.transition=3;s.bullets=[];s.enemies=[];s.shots=[];s.score+=s.player.lives*200;}
 else if(s.kills%9===0)drop(s,e.x,e.y,s.kills%27===0?'bomb':'power');else if(s.kills%3===0)drop(s,e.x,e.y,'coin');
 }}
function drop(s,x,y,kind){s.items.push({x,y,kind,life:10});}
function bomb(s){const p=s.player;if(!p.bombs||s.phase!=='playing')return;p.bombs--;s.bombsUsed++;p.invincible=3;p.action=1.2;p.actionKind='bomb';s.score+=s.bullets.length*10;s.bullets=[];event(s,'bomb');
 effect(s,p.x,p.y,'bomb',HEROES[s.hero].color,560,1.8);for(const e of [...s.enemies])damageEnemy(s,e,800);if(s.boss)damageEnemy(s,s.boss,s.hero==='manjong'?1100:850);
}
function enemyBullet(s,x,y,angle,speed=170,r=6,kind='aim'){if(s.bullets.length>=420)return;s.bullets.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r,kind,life:9,grazed:false});}
function aim(s,e,count=1,spread=.17,speed=180){const a=Math.atan2(s.player.y-e.y,s.player.x-e.x);for(let i=0;i<count;i++)enemyBullet(s,e.x-18,e.y,a+(i-(count-1)/2)*spread,speed,6,'aim');}
function spawn(s){const kind=Math.floor(random(s)*3),y=65+random(s)*(H-130);let hp=[38,60,115][kind]*(1+s.stage*.13);s.enemies.push({id:s.nextId++,kind,x:W+45,y,baseY:y,hp,maxHp:hp,age:0,timer:1.1+random(s)*.8,vx:[105,135,62][kind]+s.stage*4,r:[20,23,31][kind],flash:0,dead:false});}
function spawnBoss(s){const hp=1900+s.stage*450;s.boss={id:s.nextId++,boss:true,kind:STAGES[s.stage].skin,x:W+160,y:H/2,hp,maxHp:hp,r:68,age:0,timer:2.8,volley:0,phase:0,flash:0,dead:false,startHits:s.hits};event(s,'warning');}
function bossAttack(s,b){const level=s.stage+1,phase=b.hp/b.maxHp<.45?1:0;const speed=(s.difficulty==='easy'?130:s.difficulty==='hard'?220:165)+level*8;
 b.phase=phase;const pattern=(b.volley+STAGES[s.stage].pattern+(s.route==='gorge'?1:0))%4;
 if(pattern===0)aim(s,b,3+phase*2,.15,speed+35);
 if(pattern===1){for(let i=0;i<12+phase*4;i++){const a=i/(12+phase*4)*Math.PI*2+b.volley*.19;enemyBullet(s,b.x-30,b.y,a,speed,6,'ring');}}
 if(pattern===2){const gap=70+((b.volley*73+s.seed)%390);for(let y=35;y<H;y+=37)if(Math.abs(y-gap)>55)enemyBullet(s,b.x-25,y,Math.PI,speed*.85,7,'wall');}
 if(pattern===3){for(let i=-3;i<=3;i++)enemyBullet(s,b.x-30,b.y,Math.PI+i*.16+Math.sin(b.volley)*.13,speed,6,'fan');}
 b.volley++;b.timer=(s.difficulty==='hard'?.8:1.15)-phase*.2;effect(s,b.x-40,b.y,'muzzle','#ff8dba',28,.2);
}
function hitPlayer(s){const p=s.player;if(p.invincible>0)return;p.lives--;s.hits++;p.power=Math.max(1,p.power-1);p.invincible=2.6;p.charge=0;p.charging=false;s.bullets=s.bullets.filter(b=>Math.hypot(b.x-p.x,b.y-p.y)>110);effect(s,p.x,p.y,'burst','#fff',75,.65);event(s,'hurt');if(p.lives<=0){s.phase='lose';event(s,'lose');}}
export function command(s,cmd){if(cmd==='pause'&&(s.phase==='playing'||s.phase==='paused')){s.phase=s.phase==='paused'?'playing':'paused';s.player.charging=false;s.player.charge=0;}if(cmd==='bomb')bomb(s);if((cmd==='sky'||cmd==='gorge')&&s.phase==='branch'){s.route=cmd;advance(s);} }
function advance(s){s.stage++;s.stageTime=0;s.stageKills=0;s.enemies=[];s.boss=null;s.bullets=[];s.shots=[];s.items=[];s.spawnTimer=1.5;s.phase='playing';s.player.invincible=2;s.player.bombs=Math.min(5,s.player.bombs+1);s.player.charge=0;s.player.charging=false;s.player.x=180;s.player.y=H/2;s.checkpoint=checkpoint(s);event(s,'stage');}
export function step(s,input={},dt=DT){if(s.phase==='paused'||s.phase==='branch'||s.phase==='win'||s.phase==='lose')return;
 s.tick++;s.time+=dt;for(const f of s.fx)f.life-=dt;s.fx=s.fx.filter(f=>f.life>0);
 if(s.phase==='clear'){s.transition-=dt;if(s.transition<=0){if(s.stage===6){s.phase='win';event(s,'win');}else if(s.stage===2&&!s.route)s.phase='branch';else advance(s);}return;}
 s.stageTime+=dt;const p=s.player,h=HEROES[s.hero];p.invincible=Math.max(0,p.invincible-dt);p.action=Math.max(0,p.action-dt);p.shotTimer-=dt;
 const dx=clamp(Number(input.dx)||0,-1,1),dy=clamp(Number(input.dy)||0,-1,1),len=Math.max(1,Math.hypot(dx,dy)),speed=h.speed*(input.focus?.48:1);
 p.x=clamp(p.x+dx/len*speed*dt,32,W-55);p.y=clamp(p.y+dy/len*speed*dt,42,H-35);
 if(input.charge){p.charging=true;p.charge=Math.min(1.3,p.charge+dt);}else if(p.charging){if(p.charge>=.85)chargeFire(s);p.charge=0;p.charging=false;}
 if(input.shoot&&!input.charge&&p.shotTimer<=0){fire(s);p.shotTimer=h.rate;}
 if(input.bomb)bomb(s);
 s.spawnTimer-=dt;if(s.stageTime<STAGES[s.stage].duration&&s.spawnTimer<=0){spawn(s);s.spawnTimer=Math.max(.48,1.15-s.stage*.075);}
 if(s.stageTime>=STAGES[s.stage].duration&&!s.boss)spawnBoss(s);
 for(const e of s.enemies){e.age+=dt;e.x-=e.vx*dt;e.y=e.baseY+Math.sin(e.age*(e.kind===1?3:1.5))*[18,60,10][e.kind];e.timer-=dt;e.flash=Math.max(0,e.flash-dt);if(e.timer<=0&&e.x<W-30&&e.x>p.x+40){aim(s,e,e.kind===2?3:1,.2,(s.difficulty==='easy'?105:145)+s.stage*8);e.timer=e.kind===2?1.8:2.5;}if(Math.hypot(e.x-p.x,e.y-p.y)<e.r+7)hitPlayer(s);}
 s.enemies=s.enemies.filter(e=>!e.dead&&e.x>-100);
 const b=s.boss;if(b&&!b.dead){b.age+=dt;b.x=Math.max(W-170,b.x-100*dt);b.y=H/2+Math.sin(b.age*.7)*110;b.timer-=dt;b.flash=Math.max(0,b.flash-dt);if(b.timer<=0)bossAttack(s,b);if(Math.hypot(b.x-p.x,b.y-p.y)<b.r+7)hitPlayer(s);}
 for(const q of s.shots){q.px=q.x;q.py=q.y;if(q.kind==='light'){const target=[...s.enemies,...(b&&!b.dead?[b]:[])].filter(e=>e.x>q.x-20).sort((a,b)=>Math.hypot(a.x-q.x,a.y-q.y)-Math.hypot(b.x-q.x,b.y-q.y))[0];if(target){const a=Math.atan2(target.y-q.y,target.x-q.x),v=Math.hypot(q.vx,q.vy);q.vx+=(Math.cos(a)*v-q.vx)*dt*4;q.vy+=(Math.sin(a)*v-q.vy)*dt*4;}}
 q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;for(const e of [...s.enemies,...(b?[b]:[])]){if(e.dead||q.hit.includes(e.id)||q.pierce<=0)continue;if(segmentDistance(e.x,e.y,q.px,q.py,q.x,q.y)<e.r+q.r){q.hit.push(e.id);q.pierce--;damageEnemy(s,e,q.damage);effect(s,e.x,e.y,'spark',h.color,20,.18);if(q.kind==='meteor'||q.kind==='fire'){const radius=q.kind==='meteor'?120:48;effect(s,e.x,e.y,'burst','#ffae63',radius,.4);for(const other of s.enemies)if(other!==e&&Math.hypot(other.x-e.x,other.y-e.y)<radius)damageEnemy(s,other,q.damage*.5);}}}}
 s.shots=s.shots.filter(q=>q.life>0&&q.pierce>0&&q.x<W+80&&q.y>-80&&q.y<H+80);
 for(const q of s.bullets){q.px=q.x;q.py=q.y;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;const d=segmentDistance(p.x,p.y,q.px,q.py,q.x,q.y);if(d<q.r+5){hitPlayer(s);q.life=0;}else if(d<q.r+20&&!q.grazed){q.grazed=true;s.grazes++;s.score+=20;}}
 s.bullets=s.bullets.filter(q=>q.life>0&&q.x>-30&&q.x<W+100&&q.y>-60&&q.y<H+60);s.peakBullets=Math.max(s.peakBullets,s.bullets.length);
 for(const i of s.items){i.life-=dt;i.x-=75*dt;const dist=Math.hypot(i.x-p.x,i.y-p.y);if(dist<130){i.x+=(p.x-i.x)*dt*5;i.y+=(p.y-i.y)*dt*5;}if(dist<24){i.life=0;if(i.kind==='power'){p.power=Math.min(4,p.power+1);s.score+=300;}else if(i.kind==='bomb')p.bombs=Math.min(5,p.bombs+1);else s.score+=200;effect(s,p.x,p.y,'pickup',h.color,35,.4);event(s,'pickup');}}
 s.items=s.items.filter(i=>i.life>0&&i.x>-30);if(s.score>=s.lastExtend+25000){s.lastExtend+=25000;p.lives=Math.min(9,p.lives+1);event(s,'extend');}
}
export function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
