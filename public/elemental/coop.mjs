export const DT=1/60, WIDTH=2880, LANE=[360,510];
export const STAGES=[
 {name:'비 내리는 야시장',subtitle:'잠든 거리에 번진 균열을 막아라',background:'market',waves:[['raider','raider','hound'],['raider','hound','raider','hound'],['raider','raider','hound','raider','hound']]},
 {name:'봉쇄된 수로',subtitle:'수로를 따라 균열의 근원으로',background:'canal',waves:[['hound','hound','raider','raider'],['raider','hound','raider','hound','raider'],['hound','hound','raider','raider','hound','raider']]},
 {name:'균열의 성문',subtitle:'수문장을 쓰러뜨리고 도시를 되찾아라',background:'gate',waves:[['raider','hound','raider','hound'],['hound','raider','raider','hound','raider'],['warden','raider','hound']]}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=g=>{g.seed=(1664525*g.seed+1013904223)>>>0;return g.seed/4294967296;};
const hero=(id,x,y)=>({id,team:'heroes',x,y,dir:1,hp:120,maxHp:120,energy:100,action:'idle',age:0,cool:0,skillCool:0,dodgeCool:0,invuln:0,hit:false,moving:false,combo:0,queued:false,walk:0,revive:0,downs:0});
export function createCampaign({seed=19,mode='solo'}={}){
 if(!['solo','duo'].includes(mode))throw Error('Unknown mode');
 const g={mode,seed:seed>>>0,initialSeed:seed>>>0,stage:0,wave:0,startedWaves:0,clearedWaves:0,phase:'travel',heroes:[hero('fire',180,430),hero('water',265,470)],enemies:[],events:[],projectiles:[],time:0,stageTime:0,freeze:0,camera:0,resonance:0,burstCool:0,totalKills:0,bossPattern:0,stats:{hits:0,skills:0,revives:0,bursts:0,damage:0,stages:[],bosses:[]},waveRecord:null,serial:0};
 return g;
}
function event(g,type,data={},life=.4){g.events.push({type,...data,life,maxLife:life});if(g.events.length>100)g.events.splice(0,g.events.length-100);}
function start(a,action){a.action=action;a.age=0;a.hit=false;a.queued=false;a.moving=false;}
function spawnWave(g){
 const zone=[700,1510,2320][g.wave];
 g.enemies=STAGES[g.stage].waves[g.wave].map((kind,i)=>{const hp=kind==='warden'?440:kind==='hound'?46+g.stage*7:62+g.stage*9;return {id:'e'+(++g.serial),kind,team:'enemies',x:zone+160+(i%3)*85,y:375+(i%3)*58,dir:-1,hp,maxHp:hp,action:'spawn',age:0,cool:.7+rand(g)*.65,walk:0,moving:false,hit:false,armor:kind==='warden',mark:null,pattern:0,deathAge:0};});
 g.startedWaves++;g.phase='combat';g.waveRecord={stage:g.stage+1,wave:g.wave+1,start:g.time,hp:g.heroes.map(h=>h.hp),seed:g.seed};
 event(g,'wave',{text:g.wave===2&&g.stage===2?'BOSS · 균열의 수문장':`적 출현 · ${g.wave+1}/3`},2);
}
export function nearestEnemy(g,a){return g.enemies.filter(e=>e.hp>0&&e.action!=='spawn').sort((b,c)=>Math.hypot(b.x-a.x,(b.y-a.y)*1.8)-Math.hypot(c.x-a.x,(c.y-a.y)*1.8))[0];}
export function companionInput(g,a){
 if(a.hp<=0)return {};
 const friend=g.heroes.find(h=>h!==a), down=friend.hp<=0;
 if(down){const dx=friend.x-a.x,dy=friend.y-a.y;return {x:Math.abs(dx)>65?Math.sign(dx):0,y:Math.abs(dy)>30?Math.sign(dy):0,revive:Math.hypot(dx,dy)<100};}
 const danger=g.enemies.find(e=>e.hp>0&&e.action==='tell'&&e.mark&&Math.abs(e.mark.y-a.y)<65&&Math.abs(e.mark.x-a.x)<190&&e.age>e.tellDuration-.24);
 if(danger)return {y:a.y>435?-1:1,dodge:true};
 const enemy=nearestEnemy(g,a);
 if(enemy){const dx=enemy.x-a.x,dy=enemy.y-a.y,targetY=clamp(enemy.y+(a.id==='water'?23:-18),...LANE),lane=targetY-a.y,reach=a.id==='water'?150:100;return {x:Math.abs(dx)>reach?Math.sign(dx):a.dir!==Math.sign(dx)&&Math.abs(dx)>3?Math.sign(dx):0,y:Math.abs(lane)>12?Math.sign(lane):0,attack:Math.abs(dx)<(a.id==='water'?178:150)&&Math.abs(dy)<45,magic:Math.abs(dx)<460&&Math.abs(dy)<60&&a.energy>=32,burst:g.resonance>=100};}
 const target=g.mode==='solo'?Math.max(friend.x+85,a.x):WIDTH-100;
 return {x:target-a.x>35?1:target-a.x<-100?-1:0,y:Math.abs(a.y-(a.id==='fire'?425:475))>15?Math.sign((a.id==='fire'?425:475)-a.y):0};
}
function damage(g,target,amount,source,{launch=0,element=null}={}){
 if(target.hp<=0||target.team===source.team||target.invuln>0||target.action==='dodge'||target.action==='spawn')return false;
 target.hp=Math.max(0,target.hp-amount);
 event(g,'hit',{x:target.x,y:target.y-85,element:element||source.id,amount,big:amount>=25},.45);
 if(target.team==='enemies'){
  g.stats.hits++;g.resonance=clamp(g.resonance+(amount>=25?5:2),0,100);
  if(target.hp<=0){start(target,'dead');target.deathDir=source.dir||1;g.totalKills++;event(g,'defeat',{x:target.x,y:target.y-70,element:element||source.id},.7);g.heroes.forEach(h=>{h.energy=Math.min(100,h.energy+5);});if(target.kind==='warden')g.stats.bosses.push({stage:g.stage+1,result:'win',seconds:+g.stageTime.toFixed(2),hp:g.heroes.map(h=>h.hp),seed:g.initialSeed});}
  else if(!target.armor){start(target,'hurt');target.x=clamp(target.x+(source.dir||1)*launch,80,WIDTH-80);}
 }else{
  g.stats.damage+=amount;target.invuln=.6;
  if(target.hp<=0){start(target,'down');target.downs++;target.revive=0;event(g,'notice',{text:'동료가 쓰러졌다 · 가까이 가서 구조'},2);}
  else {start(target,'hurt');target.x=clamp(target.x+(source.dir||1)*launch,70,WIDTH-70);}
 }
 return true;
}
function updateHero(g,a,i,dt){
 for(const k of ['cool','skillCool','dodgeCool','invuln'])a[k]=Math.max(0,a[k]-dt);
 a.energy=Math.min(100,a.energy+dt*5);a.moving=false;
 if(a.hp<=0)return;
 if(i.x&&a.action==='idle')a.dir=Math.sign(i.x);
 if(a.action==='attack'&&i.attack&&a.age>.11&&a.combo<3)a.queued=true;
 if(a.action==='idle'){
  if(i.dodge&&a.dodgeCool<=0){start(a,'dodge');a.dodgeCool=.85;const n=Math.max(1,Math.hypot(i.x||0,i.y||0));a.dx=(i.x||(!i.y?a.dir:0))/n;a.dy=(i.y||0)/n;}
  else if(i.magic&&a.energy>=32&&a.skillCool<=0){start(a,'magic');a.energy-=32;a.skillCool=1.4;g.stats.skills++;event(g,'charge',{x:a.x,y:a.y-80,element:a.id,dir:a.dir},.35);}
  else if(i.attack&&a.cool<=0){start(a,'attack');a.combo=1;}
  else {const n=Math.max(1,Math.hypot(i.x||0,i.y||0));a.x+=(i.x||0)/n*235*dt;a.y+=(i.y||0)/n*140*dt;a.moving=!!(i.x||i.y);a.walk=a.moving?a.walk+dt:0;}
 }
 if(a.action==='dodge'){a.x+=a.dx*510*dt;a.y+=a.dy*250*dt;}
 a.age+=dt;
 if(a.action==='attack'&&!a.hit&&a.age>=.18){a.hit=true;const finish=a.combo===3,range=a.id==='fire'?150:180;event(g,'slash',{x:a.x+a.dir*50,y:a.y-65,dir:a.dir,element:a.id,combo:a.combo},.28);let landed=false;for(const e of g.enemies){if(Math.abs(e.y-a.y)<48&&(e.x-a.x)*a.dir>-30&&(e.x-a.x)*a.dir<range)landed=damage(g,e,finish?22:a.combo===2?13:10,a,{launch:finish?40:10})||landed;}if(landed)g.freeze=Math.max(g.freeze,finish?.055:.025);}
 if(a.action==='magic'&&!a.hit&&a.age>=.28){a.hit=true;const p={id:++g.serial,owner:a.id,team:'heroes',element:a.id,x:a.x+a.dir*60,y:a.y,dir:a.dir,age:0,life:1.1,hits:[],damage:a.id==='fire'?36:32,speed:a.id==='fire'?550:640};g.projectiles.push(p);event(g,'skillName',{text:a.id==='fire'?'화염쇄 · FIRE BREAK':'수룡참 · TIDAL CUT',element:a.id},.9);}
 const end={attack:a.combo===3?.62:.42,magic:.85,dodge:.27,hurt:.24}[a.action];
 if(end&&a.age>=end){if(a.action==='attack'&&a.queued&&a.combo<3){const n=a.combo+1;start(a,'attack');a.combo=n;}else {a.cool=a.action==='attack'&&a.combo===3?.13:0;start(a,'idle');a.combo=0;}}
 const maxX=g.phase==='combat'?[1100,1910,2760][g.wave]:WIDTH-70;
 a.x=clamp(a.x,70,maxX);a.y=clamp(a.y,...LANE);
}
function updateEnemy(g,e,dt){
 e.age+=dt;e.cool-=dt;e.moving=false;
 if(e.hp<=0){e.deathAge+=dt;return;}
 if(e.action==='spawn'){if(e.age>.65)start(e,'idle');return;}
 if(e.action==='hurt'){if(e.age>.23)start(e,'idle');return;}
 const targets=g.heroes.filter(h=>h.hp>0);if(!targets.length)return;
 const t=targets.sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
 if(e.action==='idle'){
  const dx=t.x-e.x,dy=t.y-e.y;e.dir=Math.sign(dx)||e.dir;
  const range=e.kind==='warden'?190:e.kind==='hound'?160:110;
  if(Math.abs(dx)<range&&Math.abs(dy)<45&&e.cool<=0){start(e,'tell');e.tellDuration=e.kind==='warden'?.95:e.kind==='hound'?.58:.72;e.mark={x:t.x,y:t.y};e.pattern=e.kind==='warden'?(e.pattern+1)%2:0;event(g,'warning',{x:e.mark.x,y:e.mark.y,boss:e.kind==='warden'},e.tellDuration);}
  else {const speed=e.kind==='hound'?150:e.kind==='warden'?83:105;e.x+=Math.abs(dx)>range*.7?Math.sign(dx)*speed*dt:0;e.y+=Math.abs(dy)>17?Math.sign(dy)*speed*.55*dt:0;e.moving=Math.abs(dx)>range*.7||Math.abs(dy)>17;e.walk+=dt;}
 }else if(e.action==='tell'&&e.age>=e.tellDuration){start(e,'attack');}
 else if(e.action==='attack'){
  if(e.kind==='hound'&&e.age<.23)e.x+=e.dir*310*dt;
  if(!e.hit&&e.age>.16){e.hit=true;const boss=e.kind==='warden';event(g,boss?'bossSlam':'enemySlash',{x:boss?e.mark.x:e.x+e.dir*65,y:boss?e.mark.y:e.y,dir:e.dir},.5);for(const h of g.heroes){const inArea=boss?Math.hypot(h.x-e.mark.x,(h.y-e.mark.y)*1.8)<(e.pattern?155:120):Math.abs(h.y-e.y)<45&&(h.x-e.x)*e.dir>-30&&(h.x-e.x)*e.dir<150;if(inArea)damage(g,h,boss?23:e.kind==='hound'?12:10,e,{launch:25,element:'enemy'});}}
  if(e.age>(e.kind==='warden'?.9:.55)){start(e,'idle');e.cool=e.kind==='warden'?.9:.65+rand(g)*.5;}
 }
 e.x=clamp(e.x,70,WIDTH-70);e.y=clamp(e.y,...LANE);
}
function burst(g){
 if(g.resonance<100||g.burstCool>0||g.phase!=='combat')return;
 g.resonance=0;g.burstCool=4;g.stats.bursts++;g.freeze=.13;
 const alive=g.heroes.filter(h=>h.hp>0),x=alive.reduce((s,h)=>s+h.x,0)/alive.length;
 event(g,'burst',{x,y:445,text:'원소 공명 · 불과 물의 합격'},1.3);
 for(const e of g.enemies)if(Math.abs(e.x-x)<650)damage(g,e,95,{team:'heroes',id:'fusion',dir:e.x>=x?1:-1},{launch:65,element:'fusion'});
 alive.forEach(h=>{h.invuln=1.2;h.energy=Math.min(100,h.energy+25);});
}
export function stepCampaign(g,inputs=[{},{}],dt=DT){
 if(g.phase==='win'||g.phase==='lose')return g;
 const inps=[inputs[0]||{},g.mode==='solo'?{...companionInput(g,g.heroes[1]),burst:false}:inputs[1]||{}];
 if(g.phase==='stageClear'){
  if(inps.some(i=>i.next)){g.stats.stages.push({stage:g.stage+1,seconds:+g.stageTime.toFixed(2),hp:g.heroes.map(h=>h.hp),kills:g.totalKills});g.stage++;if(g.stage>=STAGES.length){g.phase='win';return g;}g.wave=0;g.startedWaves=0;g.clearedWaves=0;g.enemies=[];g.projectiles=[];g.events=[];g.stageTime=0;g.camera=0;g.phase='travel';g.heroes.forEach((h,j)=>{h.x=180+j*85;h.y=425+j*45;h.hp=Math.min(120,Math.max(65,h.hp)+30);h.energy=100;h.invuln=0;h.revive=0;start(h,'idle');});}
  return g;
 }
 g.time+=dt;g.stageTime+=dt;g.burstCool=Math.max(0,g.burstCool-dt);g.events=g.events.filter(e=>(e.life-=dt)>0);
 if(g.freeze>0){g.freeze=Math.max(0,g.freeze-dt);return g;}
 g.heroes.forEach((h,j)=>updateHero(g,h,inps[j],dt));
 // Both players stay in the camera; dead partners never tether a survivor.
 const alive=g.heroes.filter(h=>h.hp>0);if(alive.length===2&&Math.abs(alive[0].x-alive[1].x)>650){const left=alive[0].x<alive[1].x?alive[0]:alive[1],right=left===alive[0]?alive[1]:alive[0];right.x=left.x+650;}
 for(let j=0;j<2;j++){const h=g.heroes[j],other=g.heroes[1-j];if(other.hp<=0){if(h.hp>0&&inps[j].revive&&Math.hypot(h.x-other.x,h.y-other.y)<110){other.revive+=dt;if(other.revive>=1.5){other.hp=55;other.invuln=2;other.revive=0;start(other,'idle');g.stats.revives++;event(g,'notice',{text:'동료 구조 완료'},1.3);}}else other.revive=Math.max(0,other.revive-dt*.3);}}
 for(const e of g.enemies)updateEnemy(g,e,dt);
 for(const p of g.projectiles){p.age+=dt;p.life-=dt;p.x+=p.speed*p.dir*dt;for(const e of g.enemies){if(p.hits.includes(e.id)||Math.abs(e.x-p.x)>95||Math.abs(e.y-p.y)>65)continue;const owner=g.heroes.find(h=>h.id===p.owner);if(damage(g,e,p.damage,owner,{launch:35,element:p.element})){p.hits.push(e.id);event(g,p.element==='fire'?'eruption':'waterImpact',{x:e.x,y:e.y,element:p.element,dir:p.dir},.65);g.freeze=Math.max(g.freeze,.025);}}}
 g.projectiles=g.projectiles.filter(p=>p.life>0&&p.x>0&&p.x<WIDTH);
 if(inps.some(i=>i.burst)&&alive.length)burst(g);
 if(g.heroes.every(h=>h.hp<=0)){g.phase='lose';if(g.enemies.some(e=>e.kind==='warden'))g.stats.bosses.push({stage:g.stage+1,result:'lose',seconds:g.stageTime,hp:[0,0],seed:g.initialSeed});return g;}
 const live=g.heroes.filter(h=>h.hp>0),lead=Math.max(...live.map(h=>h.x));
 if(g.phase==='travel'&&g.wave<3&&lead>=[460,1270,2080][g.wave])spawnWave(g);
 if(g.phase==='combat'&&g.enemies.every(e=>e.hp<=0)){
  g.clearedWaves++;g.wave++;g.phase='travel';g.heroes.filter(h=>h.hp>0).forEach(h=>h.hp=Math.min(120,h.hp+14));event(g,'wave',{text:g.wave<3?'구역 확보 · 앞으로 이동':'길이 열렸다 · 출구로 이동'},2);
 }
 if(g.phase==='travel'&&g.wave>=3&&live.every(h=>h.x>2680))g.phase='stageClear';
 const middle=live.reduce((s,h)=>s+h.x,0)/live.length;g.camera=clamp(middle-400,0,WIDTH-960);
 return g;
}
