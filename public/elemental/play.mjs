import {createGame,step,DT,DIFFICULTIES} from './combat.mjs';
import {spriteFrame} from './animation.mjs';
import {impactFrame} from './impact-animation.mjs';
import {benchOptions,benchmarkInput,FrameProfile} from './performance.mjs';
const bench=benchOptions(),profile=bench?new FrameProfile(bench):null;
const measured=(name,fn)=>profile?profile.measure(name,fn):fn();
const optimized=bench?.renderer!=='raw';
const $=s=>document.querySelector(s),canvas=$('#game'),c=canvas.getContext('2d'),keys=new Set(),taps=new Set(),images={};
const stageCanvas=document.createElement('canvas');stageCanvas.width=960;stageCanvas.height=560;
let stageReady=false,hudAt=-1;
const fx={}, impacts={}, reduced=matchMedia('(prefers-reduced-motion: reduce)');
let benchmarkSteps=0;
let g=createGame(),ready=false,paused=true,last=0,acc=0;
const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error(src));i.src=src;});
function reset(kind=g.player.id,difficulty=g.difficulty){g=createGame(kind,7,difficulty);acc=0;hudAt=-1;keys.clear();taps.clear();paused=false;$('#pause').textContent='일시정지';for(const id of ['fire','water'])$('#'+id).setAttribute('aria-pressed',String(id===kind));canvas.focus();}
for(const id of ['fire','water'])$('#'+id).onclick=()=>reset(id);
const difficultyHints={training:'넉넉한 반격 예고로 조작 익히기',standard:'빠른 접근과 강한 공격. 반격을 보고 빈틈 노리기',challenge:'짧은 예고와 강한 피해. 연타보다 거리와 회피가 중요'};
for(const button of document.querySelectorAll('[data-difficulty]'))button.onclick=()=>{
 const difficulty=button.dataset.difficulty;reset(g.player.id,difficulty);
 for(const b of document.querySelectorAll('[data-difficulty]'))b.setAttribute('aria-pressed',String(b===button));
 $('#difficulty-hint').textContent=`${DIFFICULTIES[difficulty].label} · ${difficultyHints[difficulty]}. 난이도를 바꾸면 대전이 초기화돼.`;
};
$('#restart').onclick=()=>reset();$('#pause').onclick=()=>{paused=!paused;keys.clear();taps.clear();$('#pause').textContent=paused?'계속하기':'일시정지';canvas.focus();};
const allowed=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','j','k','l','Shift','p'];
addEventListener('keydown',e=>{if(e.target.tagName==='BUTTON')return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(allowed.includes(k)){e.preventDefault();keys.add(k);taps.add(k);if(k==='p'&&!e.repeat)$('#pause').click();}});
addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
addEventListener('blur',()=>{keys.clear();taps.clear();paused=true;$('#pause').textContent='계속하기';});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.key);taps.add(b.dataset.key);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key);}
function input(){return {x:+(keys.has('ArrowRight')||keys.has('d'))-+(keys.has('ArrowLeft')||keys.has('a')),y:+(keys.has('ArrowDown')||keys.has('s'))-+(keys.has('ArrowUp')||keys.has('w')),attack:keys.has('j')||taps.has('j'),dodge:keys.has('k')||keys.has('Shift')||taps.has('k')||taps.has('Shift'),magic:keys.has('l')||taps.has('l')};}
function paintStage(c){c.fillStyle='#b8c4bd';c.fillRect(0,0,960,560);c.fillStyle='#d9d8c4';c.fillRect(0,0,960,270);c.fillStyle='#647f7c';for(let i=0;i<12;i++){c.fillRect(i*91,130+(i%3)*17,55,140);c.fillStyle=i%2?'#647f7c':'#78918a';}c.fillStyle='#334e54';c.fillRect(0,248,960,18);for(let x=25;x<960;x+=130)c.fillRect(x,260,12,66);c.fillStyle='#879d96';c.fillRect(0,322,960,238);c.strokeStyle='#aab9ad';c.lineWidth=2;for(let y=350;y<560;y+=42){c.beginPath();c.moveTo(0,y);c.lineTo(960,y);c.stroke();}for(let x=-500;x<1500;x+=150){c.beginPath();c.moveTo(480+(x-480)*.7,322);c.lineTo(x,560);c.stroke();}c.fillStyle='#2d4d53';c.font='bold 22px system-ui';c.textAlign='center';c.fillText('동기회  ·  원소 수련장',480,80);c.font='13px system-ui';c.fillText('FIRE  ×  WATER',480,106);}
function stage(){if(!optimized){paintStage(c);return;}if(!stageReady){paintStage(stageCanvas.getContext('2d'));stageReady=true;}c.drawImage(stageCanvas,0,0);}
function actor(a,isPlayer){
 c.fillStyle='#21383b44';c.beginPath();c.ellipse(a.x,a.y,62,11,0,0,7);c.fill();
 if(a.action==='tell'){c.strokeStyle=a.armor?'#ffcf65':'#ed503b';c.lineWidth=4;c.beginPath();c.ellipse(a.x+a.dir*65,a.y,90,24,0,0,7);c.stroke();c.fillStyle='#a32f22';c.font='bold 25px system-ui';c.fillText(a.armor?'반격!':'!',a.x,a.y-240);}
 c.save();c.translate(a.x,a.y);c.scale(a.dir,1);
 const f=spriteFrame(a);c.drawImage(images[f.key],f.sx,f.sy,f.sw,f.sh,-f.anchorX*.62,-480*.62,f.sw*.62,f.sh*.62);

 if(a.action==='magic'||(a.action==='attack'&&a.age>.18&&a.age<.45)){c.strokeStyle=a.id==='fire'?'#ffab43':'#7ce4ef';c.lineWidth=a.action==='magic'?12:5;c.beginPath();c.arc(35,-105,a.action==='magic'?130:72,-1.3,1.1);c.stroke();for(let j=0;j<16;j++){const t=j/15*2.4-1.3,r=a.action==='magic'?130:72;c.fillStyle=j%2?'#fff0c7':c.strokeStyle;c.fillRect(35+Math.cos(t)*r,-105+Math.sin(t)*r,5,5);}}
 c.restore();if(a.combo>0){c.fillStyle='#fff0be';c.font='bold 18px system-ui';c.textAlign='center';c.fillText(a.combo===3?'3연타 · 마무리':a.combo+'연타',a.x,a.y-260);}c.fillStyle=isPlayer?'#f7ecd0':'#29434c';c.beginPath();c.moveTo(a.x-7,a.y+17);c.lineTo(a.x+7,a.y+17);c.lineTo(a.x,a.y+25);c.fill();
}
function effect(e){
 const progress=1-e.life/e.maxLife;c.save();c.globalAlpha=Math.min(1,e.life*6);
 if(e.type==='cast'&&fx[e.id]){
  const f=fx[e.id],frames=f.data.frames,index=Math.min(frames.length-1,Math.floor(progress*frames.length)),r=frames[index].frame;
  c.translate(e.x,e.y);c.scale(e.dir||1,1);c.imageSmoothingEnabled=false;
  const scale=e.magic?1.7:1.05;c.drawImage(f.sheet,r.x,r.y,r.w,r.h,-r.w*scale/2,-r.h*scale/2,r.w*scale,r.h*scale);
  if(e.id==='water'){c.strokeStyle='#b4ffff';c.lineWidth=e.magic?7:3;c.beginPath();for(let j=0;j<=24;j++){const t=j/24,x=-110+t*205,y=Math.sin(t*6.28+progress*5)*24; j?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 }else if(e.type==='impact'&&impacts[e.id]){
  const hit=impacts[e.id],f=impactFrame(hit.frames,progress),r=f.frame;
  const scale=reduced.matches?1.25:e.finisher?2.6:1.9;
  c.imageSmoothingEnabled=false;
  c.drawImage(hit.sheet,r.x,r.y,r.w,r.h,e.x-f.anchor.x*scale,e.y-f.anchor.y*scale,r.w*scale,r.h*scale);
 }else{
  c.fillStyle=e.id==='fire'?'#ffe0a2':'#d7ffff';const count=reduced.matches?4:12;
  for(let i=0;i<count;i++){const t=i*Math.PI*2/count,r=progress*(e.finisher?68:42);c.fillRect(e.x+Math.cos(t)*r,e.y+Math.sin(t)*r,5,5);}
 }
 c.restore();
}
function draw(){measured('stage',stage);measured('actors',()=>[g.player,g.enemy].sort((a,b)=>a.y-b.y).forEach(a=>actor(a,a===g.player)));measured('effects',()=>{for(const e of g.events)effect(e);if(bench)for(let i=0;i<bench.stressEffects;i++)effect({type:'cast',id:i%2?'fire':'water',x:100+(i%8)*105,y:260+Math.floor(i/8)*65,dir:1,magic:true,maxLife:.6,life:.6-((g.time+i*.037)%.6)});});
 if(g.result||paused){c.fillStyle='#10252bc9';c.fillRect(0,0,960,560);c.fillStyle='#fff0ce';c.textAlign='center';c.font='bold 48px system-ui';c.fillText(paused?'잠깐 쉬는 중':g.result==='win'?'수련 성공!':'다시 한 판!',480,245);c.font='20px system-ui';c.fillText(paused?'계속하기를 눌러 재개':'다시 시작 버튼으로 재도전',480,290);}
 measured('hud',()=>{if(optimized&&performance.now()-hudAt<100&&!g.result)return;hudAt=performance.now();
 $('#php').value=g.player.hp;$('#ehp').value=g.enemy.hp;$('#pname').textContent=`나 · ${g.player.id==='fire'?'F08 불 격투가':'W02 물 검사'} · ${g.player.hp}`;$('#ename').textContent=`훈련 상대 · ${g.enemy.id==='fire'?'F08':'W02'} · ${g.enemy.hp}`;$('#energy').textContent=`원소 ${Math.floor(g.player.energy)} / 100`;
 $('#enemy-state').textContent=g.enemy.action==='tell'?(g.enemy.armor?'반격 예고 · 금빛 동안 경직 저항!':'공격 예고!'):g.enemy.action==='attack'?'공격 중':'빈틈을 노려봐';$('#status').textContent=g.result?`${g.result==='win'?'승리':'패배'} · ${g.time.toFixed(1)}초 · 적중 ${g.stats.hits}회 · 회피 ${g.stats.dodges}회`:paused?'일시정지':`${DIFFICULTIES[g.difficulty].label} 대전 · ${g.time.toFixed(1)}초 · 적중 ${g.stats.hits}회`;
 canvas.dataset.impactFx=Object.keys(impacts).length;canvas.dataset.difficulty=g.difficulty;canvas.dataset.combo=g.player.combo;canvas.dataset.counters=g.stats.counters;canvas.dataset.action=g.player.action;canvas.dataset.enemyAction=g.enemy.action;canvas.dataset.effects=g.events.length;canvas.dataset.ready=ready;
 canvas.dataset.result=g.result||'playing';canvas.dataset.playerHp=g.player.hp;canvas.dataset.enemyHp=g.enemy.hp;});
}
function frame(now){
 const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;
 if(ready){
  if(!paused){acc+=elapsed;while(acc>=DT&&(!bench||benchmarkSteps<1800)){
   if(bench&&g.result){profile.rounds.push({result:g.result,hp:g.player.hp,time:g.time,hits:g.stats.hits});g=createGame(profile.rounds.length%2?'water':'fire',bench.seed);}
   measured('simulation',()=>step(g,bench?benchmarkInput(g):input()));if(!g.freeze)taps.clear();acc-=DT;if(bench)benchmarkSteps++;
   if(profile)profile.maxEffects=Math.max(profile.maxEffects,g.events.length);
  }}else acc=0;
  draw();
  if(profile&&!profile.done&&profile.tick(now)&&benchmarkSteps===1800){
   const result=profile.finish(g);result.simulationSteps=benchmarkSteps;paused=true;
   const out=document.createElement('pre');out.id='benchmark-result';out.style.cssText='white-space:pre-wrap;padding:20px;color:#fff';out.textContent=JSON.stringify(result,null,2);document.querySelector('main').append(out);
   $('#status').textContent=`측정 완료 · 평균 ${result.averageFPS.toFixed(1)} FPS · 1% low ${result.onePercentLowFPS.toFixed(1)} FPS`;return;
  }
 }
 requestAnimationFrame(frame);
}

try{for(const id of ['fire','water']){images[id]=await load(`motion-v2/${id}/spritesheet.png`);images[id+'move']=await load(`locomotion/${id}/spritesheet.png`);for(const action of ['walk','attack2','attack3'])images[id+action]=await load(`motion-v3/${id}/${action}/spritesheet.png`);}for(const [id,path] of [['fire','fire/fireball/fireball'],['water','water/splash/splash']]){const response=await fetch(`effects/${path}.json`);if(!response.ok)throw Error(path);fx[id]={sheet:await load(`effects/${path}.png`),data:await response.json()};}for(const id of ['fire','water']){const base=`effects/pixelbolt-v4/${id}/${id}-hit`;const response=await fetch(base+'.atlas.json');if(!response.ok)throw Error(base);const atlas=await response.json();impacts[id]={sheet:await load(base+'.png'),frames:Object.values(atlas.frames)};}ready=true;if(bench){g=createGame('fire',bench.seed);paused=false;}$('#pause').textContent=bench?'성능 측정 중':'대전 시작';canvas.focus();}catch(e){$('#status').textContent='그림 로드 실패: '+e.message;}
requestAnimationFrame(frame);
