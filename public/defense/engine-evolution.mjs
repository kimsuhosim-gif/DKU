import {TOTAL_WAVES,MAX_MASTERY,waveSpec,masteryCost} from './campaign.mjs';
export {TOTAL_WAVES,MAX_MASTERY,waveSpec,masteryCost} from './campaign.mjs';
import {INTERMISSION_SECONDS,applyChill,refreshSupport} from './expansion.mjs';
import {chooseTarget,armorFactor,tickEnemyRoles,PRIORITIES,PRIORITY_LABELS} from './enemy-roles.mjs';
import {DT,WORLD,SLOTS,WEAPONS,ENEMIES,ROUTE_LENGTH,routePoint} from './board.mjs';
import {evolution,WINDUP,SKILL_WINDUP,FOLLOWUP_DELAY} from './evolution.mjs';
export * from './board.mjs';
function random(g){g.rng=(Math.imul(g.rng,1664525)+1013904223)>>>0;return g.rng/4294967296;}
export function createGame(seed=19){return {seed,rng:seed>>>0,phase:'build',autoRemaining:null,positions:SLOTS,rallyUntil:0,wave:0,time:0,waveTime:0,hp:150,maxHp:150,gold:185,towers:Array(SLOTS.length).fill(null),enemies:[],effects:[],pending:[],projectiles:[],zones:[],spawnQueue:[],spawnClock:0,nextId:1,nextTowerId:1,kills:0,spawned:0,shots:0,damageTaken:0,bossKilled:false,bossesKilled:0,lastReward:0,pulseCooldown:0,events:[],notice:'방어 지점을 고르고 동기를 배치하세요.',stats:[],telemetry:{expansion:{autoStarts:0,chills:0,buffedAttacks:0,healed:0,skills:{piercing:0,execution:0,plasma:0,blizzard:0,shatter:0,rally:0,repair:0},hits:{piercing:0,execution:0,plasma:0,blizzard:0,shatter:0}},enemyRoles:{armorAbsorbed:0,healing:0,rages:0},primary:0,followups:0,chainHits:0,slows:0,skills:{explosive:0,orbit:0,storm:0},skillHits:{explosive:0,orbit:0,storm:0},zoneTicks:{orbit:0,storm:0},damageByType:{shotgun:0,blades:0,lightning:0,pulse:0}}};}
export function towerStats(t){const b=WEAPONS[t.type];return {...b,damage:b.damage*(1+.25*(t.level-1))*(1+.25*(t.mastery||0))*(t.buff?.damage||1),range:b.range+12*(t.level-1)+2*(t.mastery||0),interval:b.interval/(1+.1*(t.level-1))/(1+.02*(t.mastery||0))/(t.buff?.haste||1),evolution:evolution(t.type,t.level,t.branch)};}
export function upgradeCost(t){return 55+t.level*25;}
function damageEnemy(g,e,amount,kind,source){if(e.hp<=0)return;const raw=amount;amount*=armorFactor(e,kind,g.time);g.telemetry.enemyRoles.armorAbsorbed+=raw-amount;if(e.vulnerableUntil>g.time)amount*=1.25;const before=e.hp;e.hp-=amount;const dx=e.x-source.x,dy=e.y-source.y,len=Math.hypot(dx,dy)||1,recent=e.hit&&g.time-e.hit.at<.08;e.hit={at:g.time,kind,dx:dx/len,dy:dy/len,amount:Math.min(before,amount)+(recent?e.hit.amount:0),fromHp:recent?e.hit.fromHp:before};g.telemetry.damageByType[kind]=(g.telemetry.damageByType[kind]||0)+Math.min(before,amount);}

export function command(g,input){
 if(!input||typeof input!=='object')return false;
 if(input.type==='restart'){Object.assign(g,createGame(g.seed));return true;}
 if(['win','lose'].includes(g.phase))return false;
 if(input.type==='start'){if(g.phase!=='build'||g.wave>=TOTAL_WAVES)return false;g.wave++;g.autoRemaining=null;g.phase='wave';g.waveTime=0;g.spawnQueue=[...waveSpec(g.wave).queue];g.spawnClock=0;g.notice=`${g.wave}/${TOTAL_WAVES} · ${waveSpec(g.wave).name}${waveSpec(g.wave).boss?' — 보스 접근!':''}`;return true;}
 if(input.type==='pulse'){const x=Number(input.x),y=Number(input.y);if(g.phase!=='wave'||g.pulseCooldown>0||!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>WORLD.width||y<0||y>WORLD.height)return false;g.pulseCooldown=14;for(const e of g.enemies)if(Math.hypot(e.x-x,e.y-y)<160){damageEnemy(g,e,110*(1+.06*(g.wave-1)),'pulse',{x,y});e.stun=1.25;}g.effects.push({kind:'pulse',x,y,age:0,life:.48});g.events.push('pulse');return true;}
 const i=input.slot;if(!Number.isInteger(i)||i<0||i>=SLOTS.length)return false;const t=g.towers[i];
 if(input.type==='build'){if(t||!Object.hasOwn(WEAPONS,input.weapon))return false;const w=WEAPONS[input.weapon];if(g.gold<w.cost)return false;g.gold-=w.cost;g.towers[i]={id:g.nextTowerId++,type:input.weapon,level:1,mastery:0,branch:null,priority:'front',cooldown:0,invested:w.cost,cycle:0,casts:0,skillCasts:0};g.notice=`${i+1}번 ${w.name} 배치`;g.events.push('build');refreshSupport(g);return true;}
 if(input.type==='upgrade'){if(!t||t.level>=3||g.gold<upgradeCost(t))return false;if(input.branch!==undefined&&!['primary','alternate'].includes(input.branch))return false;if(t.level===2)t.branch=input.branch||'primary';const cost=upgradeCost(t);g.gold-=cost;t.invested+=cost;t.level++;t.cycle=0;t.upgradedAt=g.time;g.notice=`Lv.${t.level} · ${evolution(t.type,t.level,t.branch).name} 해금`;g.events.push('build');refreshSupport(g);return true;}
 if(input.type==='mastery'){if(!t||t.level!==3||(t.mastery||0)>=MAX_MASTERY||g.gold<masteryCost(t))return false;const cost=masteryCost(t);g.gold-=cost;t.invested+=cost;t.mastery=(t.mastery||0)+1;t.upgradedAt=g.time;g.notice=`숙련 ${t.mastery} · 기본 피해 +25%`;g.events.push('build');return true;}
 if(input.type==='priority'){if(!t||!PRIORITIES.includes(input.priority))return false;t.priority=input.priority;g.notice=PRIORITY_LABELS[t.priority];return true;}
 if(input.type==='sell'){if(!t)return false;g.gold+=Math.floor(t.invested*.7);g.towers[i]=null;g.pending=g.pending.filter(p=>p.owner!==t.id);g.notice='투자 비용의 70% 회수';refreshSupport(g);return true;}
 return false;
}
function spawn(g,type){const armored=type==='armored';if(armored)type='imp';const b=ENEMIES[type],spec=waveSpec(g.wave),hp=(armored?170:b.hp)*(type==='guardian'?spec.bossHp:spec.hp);g.enemies.push({role:armored?'armored':type,reward:Math.round((armored?22:b.reward)*(1+.012*(g.wave-1))),bossName:type==='guardian'?spec.name:null,healClock:3.2,id:g.nextId++,type,...routePoint(0),distance:0,hp,maxHp:hp,speed:b.speed*spec.speed*(.94+random(g)*.12),attackClock:0,stun:0,slowUntil:0,arrived:false});g.spawned++;}
function finishDeaths(g){for(const e of g.enemies)if(e.hp<=0&&!e.dead){e.dead=true;g.kills++;g.gold+=e.reward??ENEMIES[e.type].reward;if(e.type==='guardian'){g.bossKilled=true;g.bossesKilled++;}g.effects.push({kind:'death',enemyType:e.type,x:e.x,y:e.y-28,hit:e.hit,reward:e.reward??ENEMIES[e.type].reward,age:0,life:.4});g.events.push('kill');}g.enemies=g.enemies.filter(e=>!e.dead);}
function targetsAt(g,s,range){return g.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-s.x,e.y-s.y)<range).sort((a,b)=>b.distance-a.distance||a.id-b.id);}
function attackFX(g,a,s,hit,extra={}){g.effects.push({kind:a.type,x:s.x,y:s.y-35,targets:hit.map(e=>({x:e.x,y:e.y-25})),level:a.level,followup:a.followup,skill:a.skill,castIndex:a.castIndex,age:0,life:['frost','support'].includes(a.type)?.58:.35,...extra});}
function resolveAttack(g,a){
 const t=g.towers[a.slot];if(!t||t.id!==a.owner)return;
 const s=SLOTS[a.slot],targets=targetsAt(g,s,a.range);if(!targets.length)return;
 const lead=targets.find(e=>e.id===a.targetId)||chooseTarget(targets,t.priority);t.aim={x:lead.x,y:lead.y};t.attackAt=g.time;g.shots++;g.events.push(a.type);
 if(a.followup)g.telemetry.followups++;
 if(a.skill&&resolveExpansionSkill(g,a,s,lead,targets))return;
 if(a.skill){
  g.telemetry.skills[a.skill]++;t.skillCasts++;
  if(a.skill==='explosive'){
   const dir=lead.x<s.x?-1:1;g.projectiles.push({kind:'explosive',type:a.type,x:s.x+dir*54,y:s.y-100,startX:s.x+dir*54,startY:s.y-100,targetX:lead.x,targetY:lead.y-25,targetId:lead.id,age:0,duration:.2,damage:a.damage,radius:120});
   attackFX(g,a,s,[lead],{muzzleOnly:true});
  }else{
   const orbit=a.skill==='orbit';g.zones.push({kind:a.skill,type:a.type,x:orbit?s.x:lead.x,y:orbit?s.y:lead.y,radius:orbit?225:125,age:0,life:orbit?1.4:1.6,nextTick:0,ticks:0,interval:orbit?.35:.4,damage:a.damage*(orbit?.55:.75)});
   // The cast also lands its normal hit; the persistent field is extra.
   normalHit(g,a,s,lead,targets);
  }
  return;
 }
 normalHit(g,a,s,lead,targets);
}
function normalHit(g,a,s,lead,targets){
 let hit;
 if(a.type==='frost'){hit=[lead,...targets.filter(e=>e.id!==lead.id&&Math.hypot(e.x-lead.x,e.y-lead.y)<110).slice(0,a.level>=2?2:0)];for(const e of hit){damageEnemy(g,e,a.damage,a.type,s);applyChill(g,e,a.level>=2?1.5:1.2,a.level>=2?.55:.65);}}
 else if(a.type==='support'){hit=[lead];damageEnemy(g,lead,a.damage,a.type,s);}
 else if(a.type==='blades'){hit=targets;for(const e of hit)damageEnemy(g,e,a.damage,a.type,s);}
 else if(a.type==='shotgun'){hit=[lead,...targets.filter(e=>e.id!==lead.id&&Math.hypot(e.x-lead.x,e.y-lead.y)<95).slice(0,2)];for(const e of hit)damageEnemy(g,e,a.damage,a.type,s);}
 else {hit=[lead];for(let j=1;j<(a.level>=2?5:3);j++){const prev=hit.at(-1),next=g.enemies.filter(e=>e.hp>0&&!hit.includes(e)&&Math.hypot(e.x-prev.x,e.y-prev.y)<155).sort((a,b)=>Math.hypot(a.x-prev.x,a.y-prev.y)-Math.hypot(b.x-prev.x,b.y-prev.y)||a.id-b.id)[0];if(!next)break;hit.push(next);}hit.forEach((e,j)=>{damageEnemy(g,e,a.damage*.8**j,a.type,j?hit[j-1]:s);g.telemetry.chainHits++;if(a.level>=2){e.slowUntil=Math.max(e.slowUntil,g.time+.8);g.telemetry.slows++;}});}
 attackFX(g,a,s,hit);
}
function beginAttack(g,t,slot){
 const w=towerStats(t),target=chooseTarget(targetsAt(g,SLOTS[slot],w.range),t.priority);if(!target)return;
 const every=w.evolution.every;const skill=t.level===3&&t.cycle+1>=every?w.evolution.skill:null;
 t.cycle=t.level===3?(skill?0:t.cycle+1):0;t.casts++;g.telemetry.primary++;if(t.buff?.damage>1)g.telemetry.expansion.buffedAttacks++;
 const windup=skill?SKILL_WINDUP:WINDUP;
 t.action={at:g.time,windup,skill,followup:false,level:t.level,castIndex:t.casts};t.aim={x:target.x,y:target.y};t.cooldown=Math.max(w.interval,windup+.24);
 const a={slot,owner:t.id,type:t.type,level:t.level,branch:t.branch,range:w.range,damage:w.damage,targetId:target.id,castIndex:t.casts,skill,followup:false,stage:'hit',due:g.time+windup};g.pending.push(a);
 if(t.level>=2&&['shotgun','blades'].includes(t.type)&&!skill)g.pending.push({...a,skill:null,followup:true,damage:w.damage*.6,stage:'begin',due:g.time+FOLLOWUP_DELAY});
}
function tickPending(g){
 const due=g.pending.filter(a=>a.due<=g.time+1e-9);g.pending=g.pending.filter(a=>a.due>g.time+1e-9);
 for(const a of due){const t=g.towers[a.slot];if(!t||t.id!==a.owner)continue;if(a.stage==='begin'){if(!targetsAt(g,SLOTS[a.slot],a.range).length)continue;t.action={at:g.time,windup:WINDUP,skill:null,followup:true,level:a.level};g.pending.push({...a,stage:'hit',due:g.time+WINDUP});}else resolveAttack(g,a);}
}
function tickFields(g,dt){
 for(const p of g.projectiles){p.age+=dt;const progress=Math.min(1,p.age/p.duration);p.x=p.startX+(p.targetX-p.startX)*progress;p.y=p.startY+(p.targetY-p.startY)*progress;if(progress>=1){p.done=true;for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.targetX,e.y-25-p.targetY)<p.radius){e.armorBrokenUntil=g.time+.9;damageEnemy(g,e,p.damage*(e.id===p.targetId?2.4:1.5),p.type,{x:p.targetX,y:p.targetY});g.telemetry.skillHits.explosive++;}g.effects.push({kind:'explosion',x:p.targetX,y:p.targetY,age:0,life:.48,radius:p.radius});}}
 g.projectiles=g.projectiles.filter(p=>!p.done);
 for(const z of g.zones){z.age+=dt;if(z.ticks<4&&z.age>=z.nextTick){z.nextTick+=z.interval;z.ticks++;g.telemetry.zoneTicks[z.kind]=(g.telemetry.zoneTicks[z.kind]||0)+1;const hit=[];for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-z.x,e.y-z.y)<z.radius){damageEnemy(g,e,z.damage,z.type,z);if(z.kind==='storm')e.stun=Math.max(e.stun,e.type==='guardian'?.08:.16);if(z.kind==='blizzard'){applyChill(g,e,1,.45);e.stun=Math.max(e.stun,e.type==='guardian'?.08:.25);g.telemetry.expansion.hits.blizzard++;}else g.telemetry.skillHits[z.kind]++;hit.push({x:e.x,y:e.y-25});}g.effects.push({kind:z.kind+'-tick',x:z.x,y:z.y,radius:z.radius,targets:hit,age:0,life:.28});}}
 g.zones=g.zones.filter(z=>z.age<z.life);
}
export function step(g,dt=DT){
 if(['win','lose'].includes(g.phase))return;if(!Number.isFinite(dt)||dt<=0||dt>.1)throw new Error('fixed or bounded simulation step required');
 if(g.phase==='build'){g.events=[];if(g.autoRemaining!==null){g.autoRemaining=Math.max(0,g.autoRemaining-dt);if(g.autoRemaining<1e-8){g.telemetry.expansion.autoStarts++;command(g,{type:'start'});}}return;}
 refreshSupport(g);
 g.time+=dt;g.waveTime+=dt;g.pulseCooldown=Math.max(0,g.pulseCooldown-dt);g.events=[];g.effects=g.effects.filter(f=>(f.age+=dt)<f.life);finishDeaths(g);
 g.spawnClock-=dt;if(g.spawnQueue.length&&g.spawnClock<=0){spawn(g,g.spawnQueue.shift());g.spawnClock=waveSpec(g.wave).interval;}
 for(const e of g.enemies){if(e.stun>0){e.stun=Math.max(0,e.stun-dt);continue;}if(e.distance<ROUTE_LENGTH){e.distance=Math.min(ROUTE_LENGTH,e.distance+e.speed*dt*(e.enraged?1.4:1)*Math.min(e.slowUntil>g.time?.7:1,e.chillUntil>g.time?(e.chillFactor??.65):1));Object.assign(e,routePoint(e.distance));e.arrived=e.distance===ROUTE_LENGTH;}if(e.arrived){e.attackClock-=dt;if(e.attackClock<=0){const dmg=Math.round(ENEMIES[e.type].damage*(1+.015*(g.wave-1)));g.hp=Math.max(0,g.hp-dmg);g.damageTaken+=dmg;e.attackClock=1;g.effects.push({kind:'base',x:512,y:290,age:0,life:.3});g.events.push('base');}}}
 if(g.hp<=0){g.phase='lose';g.pending=[];g.notice='클럽하우스가 함락되었습니다.';return;}
 tickEnemyRoles(g,dt);tickPending(g);tickFields(g,dt);finishDeaths(g);
 g.towers.forEach((t,i)=>{if(t){t.cooldown-=dt;if(t.cooldown<=0)beginAttack(g,t,i);}});
 if(!g.spawnQueue.length&&!g.enemies.length){g.stats.push({wave:g.wave,time:+g.waveTime.toFixed(2),hp:g.hp,kills:g.kills,boss:waveSpec(g.wave).boss,bossesKilled:g.bossesKilled});g.pending=[];g.zones=[];g.projectiles=[];g.effects=[];if(g.wave===TOTAL_WAVES){g.phase='win';g.notice='클럽하우스 방어 성공!';}else {g.phase='build';g.autoRemaining=INTERMISSION_SECONDS;g.lastReward=waveSpec(g.wave).reward;g.gold+=g.lastReward;g.notice=`정비 보상 +${g.lastReward}G · 6초 후 다음 웨이브 자동 출발`;}}
}

function resolveExpansionSkill(g,a,s,lead,targets){
 const stats=g.telemetry.expansion;if(!Object.hasOwn(stats.skills,a.skill))return false;
 stats.skills[a.skill]++;const t=g.towers[a.slot];t.skillCasts++;
 const effect={kind:a.skill,type:a.type,level:a.level,castIndex:a.castIndex,x:s.x,y:s.y-75,targets:[],age:0,life:.65};
 function hit(e,mult){damageEnemy(g,e,a.damage*mult,a.type,s);stats.hits[a.skill]++;effect.targets.push({x:e.x,y:e.y-25});}
 if(a.skill==='piercing'){
  const dx=lead.x-s.x,dy=lead.y-s.y,len=Math.hypot(dx,dy)||1;
  for(const e of g.enemies){if(e.hp<=0)continue;const ex=e.x-s.x,ey=e.y-s.y,along=(ex*dx+ey*dy)/len,across=Math.abs(ex*dy-ey*dx)/len;if(e.id===lead.id||(along>0&&along<a.range+140&&across<35)){e.armorBrokenUntil=Math.max(e.armorBrokenUntil||0,g.time+.01);hit(e,e.id===lead.id?3.8:1.4);}}
 }else if(a.skill==='execution'){hit(lead,lead.hp/lead.maxHp<=.35?6:3.2);}
 else if(a.skill==='plasma'){
  const chain=[lead];while(chain.length<7){const previous=chain.at(-1),next=g.enemies.filter(e=>e.hp>0&&!chain.includes(e)&&Math.hypot(e.x-previous.x,e.y-previous.y)<185).sort((a,b)=>Math.hypot(a.x-previous.x,a.y-previous.y)-Math.hypot(b.x-previous.x,b.y-previous.y)||a.id-b.id)[0];if(!next)break;chain.push(next);}
  chain.forEach((e,i)=>{hit(e,1.2*.9**i);e.vulnerableUntil=g.time+2;});
 }else if(a.skill==='blizzard'){
  normalHit(g,a,s,lead,targets);g.zones.push({kind:'blizzard',type:'frost',x:lead.x,y:lead.y,radius:180,age:0,life:2,nextTick:0,ticks:0,interval:.5,damage:a.damage*.65});
 }else if(a.skill==='shatter'){
  for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-lead.x,e.y-lead.y)<110){hit(e,e.chillUntil>g.time||e.slowUntil>g.time?4.2:2);}
 }else if(a.skill==='rally'){
  normalHit(g,a,s,lead,targets);g.rallyUntil=g.time+2.5;effect.targets=g.towers.flatMap((t,i)=>t&&t.type!=='support'?[{x:SLOTS[i].x,y:SLOTS[i].y-50}]:[]);
 }else if(a.skill==='repair'){
  normalHit(g,a,s,lead,targets);const heal=Math.min(6,g.maxHp-g.hp);g.hp+=heal;stats.healed+=heal;effect.targets=[{x:512,y:310}];effect.amount=heal;
 }
 g.effects.push(effect);return true;
}
