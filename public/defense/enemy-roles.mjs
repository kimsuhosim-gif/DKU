export const PRIORITIES=['front','support','strong'];
export const PRIORITY_LABELS={front:'선두 우선',support:'주술사 우선',strong:'강적 우선'};
export const WAVE_BRIEF=['빠른 사냥개가 섞여 와요. 굽이 안쪽을 지켜요.','중갑병＋회복 주술사 · 전격으로 갑옷을 뚫고 주술사를 먼저!','중갑 호위＋수호석 · 보스 체력 절반부터 돌진합니다.'];
export function chooseTarget(targets,priority='front'){
 if(priority==='support')return targets.find(e=>e.type==='caster')||targets[0];
 if(priority==='strong')return [...targets].sort((a,b)=>b.maxHp-a.maxHp||b.distance-a.distance||a.id-b.id)[0];
 return targets[0];
}
export function armorFactor(e,kind,time){return e.role==='armored'&&!(e.armorBrokenUntil>time)&&kind!=='lightning'&&kind!=='pulse'&&kind!=='frost'&&kind!=='support'?.55:1;}
export function tickEnemyRoles(g,dt){
 for(const e of g.enemies){if(e.hp<=0)continue;
  if(e.type==='guardian'&&!e.enraged&&e.hp<=e.maxHp*.5){e.enraged=true;g.telemetry.enemyRoles.rages++;g.effects.push({kind:'rage',x:e.x,y:e.y,age:0,life:1.1});g.notice='수호석 격노! 이동속도 40% 증가 · 긴급 전격으로 저지하세요.';}
  if(e.type!=='caster'||e.stun>0)continue;
  e.healClock=(e.healClock??3.2)-dt;
  if(e.healClock<=0){e.healClock=3.2;const targets=[];for(const ally of g.enemies){if(ally.hp<=0||ally.hp>=ally.maxHp||Math.hypot(ally.x-e.x,ally.y-e.y)>180)continue;const amount=Math.min(26,ally.maxHp-ally.hp);ally.hp+=amount;g.telemetry.enemyRoles.healing+=amount;targets.push({x:ally.x,y:ally.y-30});}if(targets.length)g.effects.push({kind:'heal',x:e.x,y:e.y-35,targets,age:0,life:.65});}
 }
}
