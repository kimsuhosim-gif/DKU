import {drawMemberFX,drawMemberGround} from './members-fx.mjs';
import {TOTAL_WAVES,MAX_MASTERY,waveSpec,masteryCost,progressionLabel} from './campaign.mjs';
import {SAVE_KEY,encodeCheckpoint,decodeCheckpoint} from './campaign-save.mjs';
import {branchOptions} from './expansion.mjs';
import {drawExpansionGround,drawExpansionFront} from './expansion-fx.mjs';
import {playCombatSound} from './combat-audio.mjs';
import {drawRankHalo,drawRole,drawImpact,drawUpgrade} from './impact-v4.mjs';
import {PRIORITIES,PRIORITY_LABELS,WAVE_BRIEF} from './enemy-roles.mjs';
import {EVOLUTIONS,evolution} from './evolution.mjs';
import {drawEvolutionGround,drawEvolutionFront} from './evolution-fx.mjs';
import {DEFENDERS,MOTION_FILES,MOTION_ASSETS,motionFile,motionClip,drawDefender,drawPortrait,poseIndex} from './characters.mjs';
import {DT,WORLD,ROUTE,SLOTS,WEAPONS,ENEMIES,ROUTE_LENGTH,routePoint,createGame,command,step,towerStats,upgradeCost} from './engine.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const g=createGame(19),images={};let manifest,selected=1,paused=false,speed=1,armed=false,sound=false,audioCtx,last=0,acc=0,uiClock=0;
let saveMessage='',savedWave=0;
try{const saved=decodeCheckpoint(localStorage.getItem(SAVE_KEY));if(saved){Object.assign(g,saved);savedWave=g.wave;}}catch{saveMessage='저장 공간을 사용할 수 없어요';}
function checkpoint(){try{if(g.phase==='win'){localStorage.removeItem(SAVE_KEY);savedWave=0;return;}const data=encodeCheckpoint(g);if(data){localStorage.setItem(SAVE_KEY,data);savedWave=g.wave;saveMessage='';}}catch{saveMessage='자동 저장 실패 · 저장 공간을 확인해 주세요';}}
let focusMode=false,viewClock=0,upgradeBurst=null;
canvas.parentElement.insertAdjacentHTML('beforeend','<button id="focus-sound" class="focus-sound" aria-pressed="false">소리 끔</button><button id="focus-toggle" class="focus-toggle" aria-pressed="false">전장 확대</button>');
document.querySelector('.toolbar').insertAdjacentHTML('afterend','<div class="focus-bar"><div><strong id="focus-title"></strong><small id="focus-status"></small></div><button id="focus-priority">선두 우선</button><button id="focus-upgrade">강화</button></div>');
function setFocus(value){focusMode=value;document.body.classList.toggle('battle-focus',value);$('focus-toggle').textContent=value?'배치 화면':'전장 확대';$('focus-toggle').setAttribute('aria-pressed',String(value));}
$('focus-sound').onclick=()=>$('sound').click();
$('focus-toggle').onclick=()=>setFocus(!focusMode);
$('focus-upgrade').onclick=()=>requestUpgrade();
$('focus-priority').onclick=()=>{const t=g.towers[selected];if(t)action({type:'priority',slot:selected,priority:PRIORITIES[(PRIORITIES.indexOf(t.priority||'front')+1)%PRIORITIES.length]});};
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=motionPreference.matches;motionPreference.addEventListener('change',e=>{reduced=e.matches;});
const frames=[],cpuFrames=[],hitMasks={};let peakEnemies=0,measureStart=0;
const imageFiles=['clubhouse-mobile-v2.png','enemies.png','items.png','effects-v2.png',...Object.values(DEFENDERS).map(d=>d.file),...MOTION_ASSETS,'members-v7/spells.png'];
function action(input){const ok=command(g,input);if(ok){if(input.type==='upgrade'||input.type==='mastery'){const t=g.towers[input.slot];upgradeBurst={slot:input.slot,type:t.type,level:t.level,branch:t.branch,at:viewClock};}if(input.type==='start')setFocus(true);if(input.type==='restart'){try{localStorage.removeItem(SAVE_KEY);}catch{}savedWave=0;paused=false;armed=false;acc=0;speed=1;upgradeBurst=null;setFocus(false);frames.length=0;cpuFrames.length=0;measureStart=0;peakEnemies=0;}if(g.phase==='build'&&g.wave>0)checkpoint();updateUI();}return ok;}
function drawSprite(id,x,y,h,alpha=1){const d=manifest.sprites[id],b=d.rect,w=h*b[2]/b[3];ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(images[d.image.split('/').pop()],...b,x-w/2,y-h,w,h);ctx.restore();}
function shadow(x,y,w){ctx.fillStyle='#0b172c55';ctx.beginPath();ctx.ellipse(x,y,w,7,0,0,Math.PI*2);ctx.fill();}
function drawFX(id,age,x,y,w,h=w,angle=0){const fx=manifest.effects[id];let ms=age*1000,frame=-1;for(let i=0;i<fx.frames.length;i++){if(ms<fx.durationsMs[i]){frame=i;break;}ms-=fx.durationsMs[i];}if(frame<0)return;ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(images['effects-v2.png'],...fx.frames[frame],-w/2,-h/2,w,h);ctx.restore();}
function text(t,x,y,size=18,color='#ecf4eb'){ctx.font=`bold ${size}px "Malgun Gothic",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#15262ce0';ctx.strokeText(t,x,y);ctx.fillStyle=color;ctx.fillText(t,x,y);}
function towerPose(t,s){
 const age=g.phase!=='wave'||!t.action?Infinity:g.time-t.action.at;
 const target=g.enemies.find(e=>Math.hypot(e.x-s.x,e.y-s.y)<towerStats(t).range);
 const aim=age<(t.action?.windup||0)+.38?t.aim:target||t.aim;
 return {type:t.type,level:t.action?.level||t.level,castIndex:t.action?.castIndex||t.casts,skill:t.action?.skill,actionAge:age,windup:t.action?.windup,followup:Number.isFinite(age)&&age<(t.action?.windup||0)+.38&&t.action?.followup,direction:aim&&aim.x<s.x?-1:1,reduced};
}
function drawTower(t,index){const s=SLOTS[index],height=166+(t.level-1)*9;shadow(s.x,s.y,41);drawRankHalo(ctx,t,s,viewClock,reduced);drawDefender(ctx,images[motionFile(t.type,towerPose(t,s))],t.type,s.x,s.y,{...towerPose(t,s),height});drawRankHalo(ctx,t,s,viewClock,reduced,true);text(t.level===3?evolution(t.type,3,t.branch).name:'Lv.'+t.level,s.x,s.y-height-12,20,evolution(t.type,t.level,t.branch).color);}
function drawEnemy(e){
 const b=ENEMIES[e.type],age=e.hit?g.time-e.hit.at:Infinity;
 const recoil=!reduced&&age<.18?Math.sin(Math.PI*age/.18)*(e.type==='guardian'?3:7):0;
 const x=e.x+(e.hit?.dx||0)*recoil,y=e.y+(e.hit?.dy||0)*recoil;
 shadow(e.x,e.y,b.height*.27);drawSprite(e.type,x,y,b.height);
 if(age<.1&&!reduced){const mask=hitMasks[e.type],w=b.height*mask.width/mask.height;ctx.save();ctx.globalAlpha=.55*(1-age/.1);ctx.drawImage(mask,x-w/2,y-b.height,w,b.height);ctx.restore();}
 if(e.hp<e.maxHp||e.type==='guardian'){
  const width=e.type==='guardian'?110:52,barY=e.y-b.height-13;
  ctx.fillStyle='#192331';ctx.fillRect(e.x-width/2,barY,width,7);
  if(age<.32){ctx.fillStyle='#ffe2a4';ctx.fillRect(e.x-width/2,barY,width*Math.min(1,(e.hp+(e.hit.fromHp-e.hp)*(1-age/.32))/e.maxHp),7);}
  ctx.fillStyle=e.type==='guardian'?'#ef839f':'#bd96ee';ctx.fillRect(e.x-width/2,barY,width*Math.max(0,e.hp/e.maxHp),7);
 }
 if(age<.36){ctx.save();ctx.globalAlpha=Math.min(1,(.36-age)/.1);text('-'+Math.ceil(e.hit.amount),e.x,e.y-b.height-30-(reduced?0:age*35),20,e.hit.kind==='lightning'||e.hit.kind==='pulse'?'#9ef6ee':'#ffe5b0');ctx.restore();}
 drawRole(ctx,e,g.time,reduced,text);
 if(e.slowUntil>g.time)text('❄',e.x+22,e.y-12,22,'#9fe9ff');
 if(e.stun>0)text('✦',e.x,e.y-b.height-51,19,'#9cf8ef');
}
function drawDeath(f){
 const b=ENEMIES[f.enemyType];
 if(f.age<.2){drawSprite(f.enemyType,f.x,f.y+28,b.height,(1-f.age/.2)*.7);}
 drawFX('enemy-shatter',f.age,f.x,f.y,f.enemyType==='guardian'?175:100);
 ctx.save();ctx.globalAlpha=Math.min(1,(f.life-f.age)/.12);text('+'+f.reward+'G',f.x,f.y-45-(reduced?0:f.age*50),21,'#ffe397');ctx.restore();
}
function draw(){ctx.clearRect(0,0,WORLD.width,WORLD.height);ctx.drawImage(images['clubhouse-mobile-v2.png'],0,0,WORLD.width,WORLD.height);
 // Static markers communicate direction without implying free movement across the lawn.
 if(g.phase==='build'&&g.wave===0){for(let d=120;d<ROUTE_LENGTH;d+=210){const p=routePoint(d);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.strokeStyle='#e4f8e16b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-8,-8);ctx.lineTo(3,0);ctx.lineTo(-8,8);ctx.stroke();ctx.restore();}}
 const t=g.towers[selected],range=t?towerStats(t).range:WEAPONS.shotgun.range,pad=SLOTS[selected];
 ctx.save();ctx.setLineDash([10,9]);ctx.lineWidth=2;ctx.fillStyle='#74e8ce0c';ctx.strokeStyle='#a5e8ce99';ctx.beginPath();ctx.arc(pad.x,pad.y,range,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();
 SLOTS.forEach((s,i)=>{ctx.save();ctx.fillStyle=i===selected?'#9ce3c74d':'#11272c99';ctx.strokeStyle=i===selected?'#c2ffe0':'#78978d';ctx.lineWidth=i===selected?4:2;ctx.beginPath();ctx.ellipse(s.x,s.y,43,23,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();if(!g.towers[i]){text('+',s.x,s.y-2,35,i===selected?'#d8ffdd':'#a7cdb9');}text(String(i+1),s.x,s.y+38,20);});
 drawEvolutionGround(ctx,g,reduced);drawExpansionGround(ctx,g,reduced);drawMemberGround(ctx,g,reduced,images['members-v7/spells.png']);
 for(const f of g.effects){if(f.kind==='blades')drawFX('blade-sweep',f.age,f.x,f.y+12,270);}
 const draws=g.enemies.map(e=>({kind:'enemy',y:e.y,data:e}));g.towers.forEach((t,i)=>{if(t)draws.push({kind:'tower',y:SLOTS[i].y,data:t,index:i});});
 draws.sort((a,b)=>a.y-b.y).forEach(o=>o.kind==='tower'?drawTower(o.data,o.index):drawEnemy(o.data));
 for(const f of g.effects){if(f.kind==='death')drawDeath(f);else if(f.kind==='base'){drawFX('enemy-shatter',f.age,f.x,f.y,150);}else if(f.kind==='pulse'){drawFX('lightning',f.age,f.x,f.y-20,250);ctx.save();ctx.globalAlpha=Math.max(0,1-f.age/.48);ctx.strokeStyle='#90f8e6';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(f.x,f.y,160*f.age/.48,100*f.age/.48,0,0,Math.PI*2);ctx.stroke();ctx.restore();}else if(f.kind==='blades'){}else if(f.kind==='shotgun'){const a=f.targets[0],sy=f.y-80,sx=f.x+(a.x<f.x?-62:62),angle=Math.atan2(a.y-sy,a.x-sx);drawFX('muzzle',f.age,sx,sy,110,80,angle);if(!f.muzzleOnly&&f.age<.09){ctx.strokeStyle='#ffe0a6';ctx.lineWidth=3;f.targets.forEach(p=>{ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(p.x,p.y);ctx.stroke();});}if(!f.muzzleOnly)f.targets.forEach(p=>drawFX('muzzle',f.age,p.x,p.y,60));}else if(f.kind==='lightning'){let prev={x:f.x+(f.targets[0].x<f.x?-62:62),y:f.y-80};f.targets.forEach(p=>{const dx=p.x-prev.x,dy=p.y-prev.y,len=Math.hypot(dx,dy);drawFX('lightning',f.age,(p.x+prev.x)/2,(p.y+prev.y)/2,75,len+30,Math.atan2(dy,dx)-Math.PI/2);prev=p;});}}

 drawEvolutionFront(ctx,g,reduced,drawFX,text);
 drawExpansionFront(ctx,g,reduced,text);drawMemberFX(ctx,g,reduced,images['members-v7/spells.png']);drawImpact(ctx,g,reduced,text);drawUpgrade(ctx,upgradeBurst,viewClock,reduced,text);
 if(armed){ctx.fillStyle='#14262bd9';ctx.fillRect(90,1460,844,55);text('길 위를 눌러 긴급 전격을 사용하세요',512,1488,26,'#a2f6e6');}
 if(paused){ctx.fillStyle='#10212799';ctx.fillRect(0,0,WORLD.width,WORLD.height);text('일시정지',512,760,45);}
}
function ping(kind){if(sound)playCombatSound(audioCtx,kind);}
function updateUI(){const t=g.towers[selected];$('hp').textContent=`${g.hp} / ${g.maxHp}`;$('hp-meter').value=g.hp;$('gold').textContent=g.gold;$('wave').textContent=g.wave?`${g.wave} / ${TOTAL_WAVES}`:'준비';$('kills').textContent=`처치 ${g.kills}`;$('notice').textContent=g.notice.replaceAll('산탄포','산탄 사수').replaceAll('전격탑','전격 기술자').replaceAll('회전검진','회전검 수호자').replaceAll('무기를 설치','동기를 배치').replaceAll('무기를 강화','동기를 강화').replaceAll('설치','배치');$('selected-title').textContent=`${selected+1}번 ${t?DEFENDERS[t.type].name:'방어 지점'}`;$('selection').textContent=t?`Lv.${t.level} ${evolution(t.type,t.level,t.branch).name}${t.level<3?' → '+evolution(t.type,t.level+1).name:` · 숙련 ${t.mastery||0}/10`}`:'빈 지점 · 동기를 배치하세요.';
 $('selection').title=t?(t.level===3?`숙련 ${t.mastery||0}/10 · 기본 피해 +${(t.mastery||0)*25}% · 공격속도 +${(t.mastery||0)*2}%`:evolution(t.type,t.level,t.branch).description):'';$('upgrade').title=t&&t.level<3?evolution(t.type,t.level+1).description:'';
 if(g.phase==='build')$('notice').textContent=g.autoRemaining===null?(g.wave?`${g.wave}웨이브 저장 복원 · 다음은 ${waveSpec(g.wave+1).name}`:WAVE_BRIEF[0]):`정비 +${g.lastReward}G · ${Math.ceil(g.autoRemaining)}초 후 ${g.wave+1}/${TOTAL_WAVES} ${waveSpec(g.wave+1).name}`;
 const ended=['win','lose'].includes(g.phase);$('start').disabled=g.phase!=='build';$('start').textContent=ended?'방어 종료':g.phase==='wave'?'방어 중':g.autoRemaining!==null?`지금 출발 (${Math.ceil(g.autoRemaining)}초)`:`${g.wave+1} 웨이브 시작`;$('pause').textContent=paused?'계속하기':'일시정지';$('pause').disabled=ended;$('speed').textContent=`속도 ×${speed}`;$('pulse').disabled=g.phase!=='wave'||g.pulseCooldown>0;$('pulse').textContent=g.pulseCooldown>0?`전격 ${Math.ceil(g.pulseCooldown)}초`:armed?'전격 위치 선택 중':'긴급 전격';$('pulse').classList.toggle('active',armed);$('upgrade').disabled=!t||(t.level===3?(t.mastery||0)>=MAX_MASTERY||g.gold<masteryCost(t):g.gold<upgradeCost(t))||ended;$('upgrade').textContent=t?(t.level>=3?((t.mastery||0)>=MAX_MASTERY?'숙련 MAX':`숙련 ${t.mastery+1} · ${masteryCost(t)}G`):t.level===2?`진화 선택 ${upgradeCost(t)}G`:`Lv.${t.level+1} 강화 ${upgradeCost(t)}G`):'강화';$('sell').disabled=!t||ended;$('sell').textContent=t?`회수 ${Math.floor(t.invested*.7)}G`:'회수';
 $('focus-title').textContent=t?`${selected+1}번 ${DEFENDERS[t.type].name} · ${progressionLabel(t)}`:`${selected+1}번 빈 지점`;$('focus-status').textContent=`내구도 ${g.hp} · ${g.gold}G · ${g.wave}/${TOTAL_WAVES} 웨이브`;$('focus-upgrade').textContent=$('upgrade').textContent;$('focus-upgrade').disabled=$('upgrade').disabled;$('focus-priority').disabled=!t||ended;$('focus-priority').textContent=PRIORITY_LABELS[t?.priority||'front'];
 document.querySelectorAll('.weapon').forEach(b=>{b.disabled=!!t||g.gold<WEAPONS[b.dataset.type].cost||ended;});document.querySelectorAll('.slots button').forEach((b,i)=>{b.classList.toggle('active',i===selected);b.setAttribute('aria-pressed',String(i===selected));b.textContent=g.towers[i]?`${i+1} ·`:`${i+1}`;});
 $('save-status').textContent=saveMessage||(savedWave?`${savedWave}웨이브까지 자동 저장됨 · 새로고침 후 이어하기`:'웨이브를 마치면 자동 저장 · 3단계 진화 후 숙련 10강');$('result').hidden=!ended;if(ended){$('result-title').textContent=g.phase==='win'?'클럽하우스 방어 성공!':'클럽하우스 함락';$('result-info').textContent=`${g.wave}/${TOTAL_WAVES}웨이브 · 보스 ${g.bossesKilled}/10 · ${g.kills}처치 · ${Math.floor(g.time/60)}분 ${Math.round(g.time%60)}초`;}
 const sorted=[...frames].sort((a,b)=>b-a),slow=sorted.slice(0,Math.max(1,Math.ceil(sorted.length*.01)));const sum=a=>a.reduce((s,n)=>s+n,0);const perf=frames.length?{frames:frames.length,durationSeconds:+(sum(frames)/1000).toFixed(2),averageFPS:+(1000/(sum(frames)/frames.length)).toFixed(2),onePercentLow:+(1000/(sum(slow)/slow.length)).toFixed(2),meanDrawMs:+(sum(cpuFrames)/cpuFrames.length).toFixed(3),maxEnemies:peakEnemies,viewport:[innerWidth,innerHeight],canvas:[WORLD.width,WORLD.height],seed:19,speed,reducedMotion:reduced,userAgent:navigator.userAgent}:null;
 $('diagnostics').textContent=JSON.stringify({phase:g.phase,totalWaves:TOTAL_WAVES,bossesKilled:g.bossesKilled,savedWave,paused,autoRemaining:g.autoRemaining,wave:g.wave,hp:g.hp,gold:g.gold,kills:g.kills,bossKilled:g.bossKilled,enemies:g.enemies.length,queue:g.spawnQueue.length,time:+g.time.toFixed(2),stats:g.stats,presentation:{focusMode,sound,audioState:audioCtx?.state||null,characterHeight:[166,175,184]},enemyRoles:{armored:g.enemies.filter(e=>e.role==='armored').length,healers:g.enemies.filter(e=>e.type==='caster').length,enraged:g.enemies.some(e=>e.enraged)},towers:g.towers.map((t,i)=>t?{type:t.type,level:t.level,mastery:t.mastery,branch:t.branch,buff:t.buff,priority:t.priority||'front',pose:poseIndex(towerPose(t,SLOTS[i])),facing:towerPose(t,SLOTS[i]).direction,clip:motionClip(t.type,towerPose(t,SLOTS[i]))}:null),telemetry:g.telemetry,activeSkills:{projectiles:g.projectiles.length,zones:g.zones.map(z=>({kind:z.kind,ticks:z.ticks})),effects:g.effects.filter(f=>['explosion','orbit-tick','storm-tick'].includes(f.kind)).map(f=>f.kind)},motion:{animatedRoles:['shotgun','blades','lightning','frost','support'],stillRoles:[],framesByRole:{shotgun:14,blades:14,lightning:14,frost:8,support:8},memberClipsPerRole:3,memberKeyPoses:6,full14Frames:false,hitReactions:g.enemies.filter(e=>e.hit&&g.time-e.hit.at<.36).length,deathEffects:g.effects.filter(f=>f.kind==='death').length,reduced},route:ROUTE,performance:perf},null,2);
}
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;if(last&&!paused&&!document.hidden&&g.phase==='wave'){frames.push(now-last);if(frames.length>2400)frames.shift();}last=now;if(!document.hidden&&!paused)viewClock+=elapsed;if(!document.hidden&&!paused){acc+=elapsed*(g.phase==='build'?1:speed);let steps=0;const heard=new Set();while(acc>=DT&&steps++<20){const oldPhase=g.phase;step(g);if(oldPhase!==g.phase){if(g.phase==='build'||g.phase==='win')checkpoint();acc=DT;if(g.phase==='wave')setFocus(true);}g.events.forEach(e=>heard.add(e));acc-=DT;}const accent=g.effects.find(f=>f.age<DT*steps&&['explosion','storm-tick'].includes(f.kind));if(accent)ping(accent.kind);else if(heard.size)ping([...heard].find(v=>['shotgun','lightning','blades','frost','support'].includes(v)));}else acc=0;peakEnemies=Math.max(peakEnemies,g.enemies.length);const start=performance.now();draw();cpuFrames.push(performance.now()-start);if(cpuFrames.length>2400)cpuFrames.shift();uiClock+=elapsed;if(uiClock>.1){updateUI();uiClock=0;}requestAnimationFrame(frame);}
function select(i){selected=i;armed=false;updateUI();}
for(let i=0;i<SLOTS.length;i++){const b=document.createElement('button');b.textContent=i+1;b.setAttribute('aria-label',`${i+1}번 방어 지점`);b.onclick=()=>select(i);$('slots').append(b);}
for(const [type,w] of ['shotgun','lightning','blades','frost','support'].map(type=>[type,WEAPONS[type]])){const b=document.createElement('button');b.className='weapon';b.dataset.type=type;b.setAttribute('aria-label',`${DEFENDERS[type].name} 배치 ${w.cost}골드`);b.innerHTML=`<canvas width="100" height="100" aria-hidden="true"></canvas><span><strong>${DEFENDERS[type].name}</strong><small>${type==='shotgun'?'뭉친 적에게 강한 타격':type==='lightning'?'최대 3마리 연쇄 공격':type==='frost'?'감속 · 빙결 · 파쇄':type==='support'?'주변 동기 강화 · 수리':'주변 모든 적 지속 공격'}</small></span><em>${w.cost}G</em>`;b.onclick=()=>action({type:'build',slot:selected,weapon:type});$('weapons').append(b);}
$('upgrade').onclick=()=>requestUpgrade();$('sell').onclick=()=>action({type:'sell',slot:selected});$('start').onclick=()=>action({type:'start'});$('pause').onclick=()=>{paused=!paused;updateUI();};$('speed').onclick=()=>{speed=speed===1?2:speed===2?3:1;updateUI();};$('pulse').onclick=()=>{armed=!armed;updateUI();};$('restart').onclick=$('result-restart').onclick=()=>action({type:'restart'});
$('sound').onclick=async()=>{sound=!sound;if(sound){audioCtx??=new AudioContext();await audioCtx.resume();}$('sound').textContent=sound?'소리 켬':'소리 끔';$('sound').setAttribute('aria-pressed',String(sound));$('focus-sound').textContent=sound?'소리 켬':'소리 끔';$('focus-sound').setAttribute('aria-pressed',String(sound));};
canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*WORLD.width/r.width,y=(e.clientY-r.top)*WORLD.height/r.height;if(armed){if(action({type:'pulse',x,y}))armed=false;updateUI();return;}let best=-1,dist=Math.max(70,24*WORLD.width/r.width);SLOTS.forEach((p,i)=>{const d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best=i;}});if(best>=0)select(best);});
document.querySelectorAll('button').forEach(b=>{let lastTouch=-Infinity;b.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!b.disabled){e.preventDefault();lastTouch=performance.now();b.click();}});b.addEventListener('click',e=>{if(e.isTrusted&&performance.now()-lastTouch<700){e.preventDefault();e.stopImmediatePropagation();lastTouch=-Infinity;}},true);b.addEventListener('pointercancel',()=>{lastTouch=-Infinity;});});
window.addEventListener('keydown',e=>{if($('crew-dialog').open||$('evolve-dialog').open)return;if(e.target instanceof HTMLButtonElement&&[' ','Enter'].includes(e.key))return;if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;const key=e.key.toLowerCase();if(key==='escape'&&focusMode){setFocus(false);updateUI();return;}if(/^[1-8]$/.test(key))select(+key-1);if(['q','w','e','a','s'].includes(key))action({type:'build',slot:selected,weapon:{q:'shotgun',w:'lightning',e:'blades',a:'frost',s:'support'}[key]});if(key==='r')requestUpgrade();if(key==='p')$('pause').click();if(key==='f'&&!$('pulse').disabled)$('pulse').click();if(key===' '){e.preventDefault();action({type:'start'});}});
document.addEventListener('visibilitychange',()=>{last=0;acc=0;});
try{manifest=await (await fetch('asset-manifest.json')).json();await Promise.all(imageFiles.map(async file=>{const img=new Image();img.src='assets/'+file;try{await img.decode();}catch(e){throw new Error(file+': '+e.message);}images[file]=img;}));for(const type of Object.keys(ENEMIES)){const d=manifest.sprites[type],c=document.createElement('canvas');c.width=d.rect[2];c.height=d.rect[3];const cx=c.getContext('2d');cx.drawImage(images['enemies.png'],...d.rect,0,0,c.width,c.height);cx.globalCompositeOperation='source-in';cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height);hitMasks[type]=c;}document.querySelectorAll('.weapon canvas').forEach(c=>{const type=c.parentElement.dataset.type;drawPortrait(c.getContext('2d'),images[DEFENDERS[type].file],type);});for(const [type,d] of Object.entries(DEFENDERS)){const card=document.createElement('article');card.className='crew-card';card.innerHTML=`<img src="assets/${d.file}" alt="${d.name} 전신 캐릭터"><h3>${d.name}</h3><p>${d.description}</p><ol class="evolution-list">${EVOLUTIONS[type].slice(0,2).map((ev,i)=>`<li><b>Lv.${i+1} ${ev.name}</b><span>${ev.description}</span></li>`).join('')}${branchOptions(type,EVOLUTIONS[type][2]).map(ev=>`<li><b>Lv.3 선택 · ${ev.name}</b><span>${ev.description}</span></li>`).join('')}</ol>`;$('crew-cards').append(card);}
$('loading').hidden=true;document.body.dataset.ready='true';updateUI();requestAnimationFrame(frame);}catch(e){$('loading').textContent='리소스 로드 실패: '+e.message;throw e;}


let crewWasPaused=false;
$('crew-open').onclick=()=>{crewWasPaused=paused;paused=true;acc=0;$('crew-dialog').showModal();updateUI();};
$('crew-close').onclick=()=>$('crew-dialog').close();
$('crew-dialog').addEventListener('close',()=>{paused=crewWasPaused;last=0;updateUI();});


let evolveWasPaused=false,evolveSlot=null;
function requestUpgrade(){
 const t=g.towers[selected];if(!t||['win','lose'].includes(g.phase))return;
 if(t.level===3){action({type:'mastery',slot:selected});return;}
 if(g.gold<upgradeCost(t))return;
 if(t.level===1){action({type:'upgrade',slot:selected});return;}
 evolveSlot=selected;evolveWasPaused=paused;paused=true;acc=0;
 $('evolve-title').textContent=DEFENDERS[t.type].name+' · 최종 진화';
 $('evolve-cost').textContent=`${upgradeCost(t)}G · 두 진화 중 하나 선택 · 선택 중에는 전투와 정비 시간이 멈춰요.`;
 const options=branchOptions(t.type,EVOLUTIONS[t.type][2]);
 document.querySelectorAll('[data-branch]').forEach((b,i)=>{const ev=options[i];b.innerHTML=`<small>${i===0?'A · 광역 / 연계':'B · 집중 / 특화'}</small><strong>${ev.name}</strong><span>${ev.description}</span>`;});
 $('evolve-dialog').showModal();updateUI();
}
document.querySelectorAll('[data-branch]').forEach(b=>b.onclick=()=>{if(action({type:'upgrade',slot:evolveSlot,branch:b.dataset.branch}))$('evolve-dialog').close();});
$('evolve-close').onclick=()=>$('evolve-dialog').close();
$('evolve-dialog').addEventListener('close',()=>{paused=evolveWasPaused;last=0;acc=0;evolveSlot=null;updateUI();});
