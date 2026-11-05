import {createCampaign,stepCampaign,STAGES,DT} from './coop.mjs';
import {loadArt,createRenderer} from './coop-renderer.mjs';
const $=s=>document.querySelector(s),canvas=$('#game'),keys=new Set(),taps=new Set();
let mode='solo',g=createCampaign({mode}),renderer,ready=false,started=false,paused=true,last=0,acc=0,hudAt=0,lastPhase='travel',soundOn=true,audio=null,lastSound=0;
function tone(type){
 if(!soundOn||!audio||audio.state!=='running')return;const now=audio.currentTime;if(now-lastSound<.045)return;lastSound=now;
 const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain).connect(audio.destination);osc.type=type==='fire'?'sawtooth':'triangle';osc.frequency.setValueAtTime(type==='fire'?130:type==='water'?640:85,now);osc.frequency.exponentialRampToValueAtTime(type==='water'?150:35,now+.18);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.01);gain.gain.exponentialRampToValueAtTime(.0001,now+.22);osc.start(now);osc.stop(now+.23);
}
function unlockSound(){if(!audio){const A=window.AudioContext||window.webkitAudioContext;if(A)audio=new A();}audio?.resume().catch(()=>{});}
function clearKeys(){keys.clear();taps.clear();document.querySelectorAll('.is-held').forEach(b=>b.classList.remove('is-held'));}
function showOverlay(kind){
 $('#overlay').hidden=false;$('#mode-hint').hidden=kind!=='intro';
 const content={intro:['TWO HEROES. ONE WAY FORWARD.','원소의 <em>밤</em>','불의 주먹과 물의 검이 한 팀이 된다.<br>적 무리를 돌파하고, 세 개의 거리를 되찾아라.','함께 출발'],pause:['TAKE A BREATH','잠깐 <em>쉬어가기</em>','두 영웅이 다시 출발할 준비가 됐어.','계속하기'],stageClear:['STAGE CLEAR',g.stage===2?'도시를 <em>되찾았다</em>':'거리 <em>확보</em>',g.stage===2?'마지막 수문장이 쓰러졌어. 두 영웅의 협력으로 균열을 막았어.':`${STAGES[g.stage].name} 돌파.<br>체력과 원소를 회복하고 다음 구역으로 이동해.`,g.stage===2?'클리어 결과':'다음 스테이지'],win:['CAMPAIGN COMPLETE','함께 만든 <em>승리</em>',`3개 스테이지 · 적 ${g.totalKills}명 처치 · ${Math.floor(g.time/60)}분 ${Math.floor(g.time%60)}초<br>불과 물, 두 영웅이 끝까지 함께했다.`,'다시 플레이'],lose:['TRY AGAIN','다시 <em>함께</em>','두 영웅이 모두 쓰러졌어.<br>공격 예고를 피하고 쓰러진 동료를 먼저 구해줘.','다시 도전']}[kind];
 $('#overlay-eyebrow').textContent=content[0];$('#overlay-title').innerHTML=content[1];$('#overlay-desc').innerHTML=content[2];$('#start').textContent=content[3];$('#overlay').dataset.kind=kind;
}
function reset(){g=createCampaign({mode});started=true;paused=false;clearKeys();acc=0;lastPhase='travel';$('#overlay').hidden=true;$('#pause').textContent='일시정지';canvas.focus();updateHUD();}
$('#start').onclick=()=>{if(!ready)return;unlockSound();const k=$('#overlay').dataset.kind;if(k==='pause'){paused=false;$('#overlay').hidden=true;$('#pause').textContent='일시정지';}else if(k==='stageClear'){stepCampaign(g,[{next:true},{}]);paused=false;$('#overlay').hidden=true;if(g.phase==='win')showOverlay('win');}else reset();clearKeys();canvas.focus();};
$('#pause').onclick=()=>{if(!started||['win','lose','stageClear'].includes(g.phase))return;paused=!paused;clearKeys();$('#pause').textContent=paused?'계속하기':'일시정지';if(paused)showOverlay('pause');else $('#overlay').hidden=true;canvas.focus();};
$('#restart').onclick=()=>{paused=true;started=false;g=createCampaign({mode});clearKeys();showOverlay('intro');updateHUD();};
$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').setAttribute('aria-pressed',String(soundOn));$('#sound').textContent=soundOn?'소리 켬':'소리 끔';if(soundOn)unlockSound();};
const normalized=e=>e.code?.startsWith('Numpad')?({Numpad1:',',Numpad2:'.',Numpad3:'/',Numpad0:' '}[e.code]||e.key):e.key.length===1?e.key.toLowerCase():e.key;
const allowed=['w','a','s','d','j','k','l','e',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',',','.','/','Enter','Escape','p'];
addEventListener('keydown',e=>{const k=normalized(e);if(!allowed.includes(k))return;if(e.target.tagName==='BUTTON'&&['Enter',' '].includes(k))return;if(!started)return;e.preventDefault();if((k==='Escape'||k==='p')&&!e.repeat){$('#pause').click();return;}if(paused)return;keys.add(k);if(!e.repeat)taps.add(k);});
addEventListener('keyup',e=>keys.delete(normalized(e)));
addEventListener('blur',()=>{clearKeys();if(started&&!paused&&!['win','lose','stageClear'].includes(g.phase)){$('#pause').click();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearKeys();if(started&&!paused&&!['win','lose','stageClear'].includes(g.phase))$('#pause').click();}});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();if(!started||paused)return;unlockSound();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);taps.add(b.dataset.key);b.classList.add('is-held');};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>{keys.delete(b.dataset.key);b.classList.remove('is-held');};}
const down=k=>keys.has(k)||taps.has(k);
function inputs(){return [{x:+down('d')-+down('a'),y:+down('s')-+down('w'),attack:down('j'),dodge:down('k'),magic:down('l'),revive:down('e'),burst:down(' ')},{}];}
function updateHUD(){
 for(const h of g.heroes){$('#'+h.id+'-hp').textContent=Math.ceil(h.hp)+' / 120';$('#'+h.id+'-bar').style.width=h.hp/120*100+'%';$('#'+h.id+'-energy').style.width=h.energy+'%';}
 $('#water-label').textContent=g.mode==='solo'?'AI 동료 · 물 검사':'2P · 물 검사';const stage=STAGES[Math.min(g.stage,2)];$('#stage-title').textContent=`0${Math.min(g.stage+1,3)} · ${stage.name}`;$('#stage-subtitle').textContent=stage.subtitle;$('#stage-number').textContent=`STAGE 0${Math.min(g.stage+1,3)} / 03`;
 const living=g.enemies.filter(e=>e.hp>0).length;$('#wave-state').textContent=g.phase==='combat'?`구역 ${g.wave+1} · 남은 적 ${living}`:g.wave>=3?'출구로 이동 →':`구역 ${Math.min(g.wave+1,3)}으로 →`;
 $('#burst-value').textContent=Math.floor(g.resonance)+'%';$('#burst-fill').style.width=g.resonance+'%';$('#status').textContent=!started?'두 영웅은 같은 편이야. 함께 오른쪽으로 이동해.':paused?'잠깐 쉬는 중':g.phase==='combat'?`적 ${living}명 · 붉은 예고를 피해 · 처치 ${g.totalKills}`:g.phase==='stageClear'?'스테이지 클리어':g.phase==='win'?'모든 스테이지 클리어':g.phase==='lose'?'두 영웅이 쓰러졌어':`길이 열렸어. 오른쪽으로 함께 이동 →`;
 Object.assign(canvas.dataset,{ready:String(ready),phase:g.phase,stage:String(g.stage+1),wave:String(g.wave+1),enemies:String(living),kills:String(g.totalKills),fireHp:String(g.heroes[0].hp),waterHp:String(g.heroes[1].hp),fireEnergy:String(Math.floor(g.heroes[0].energy)),waterEnergy:String(Math.floor(g.heroes[1].energy)),mode:g.mode,x:String(Math.round(g.heroes[0].x)),waterX:String(Math.round(g.heroes[1].x)),camera:String(Math.round(g.camera)),skills:String(g.stats.skills),paused:String(paused),bossHp:String(g.enemies.find(e=>e.kind==='warden')?.hp||0)});
}
function frame(now){
 const elapsed=last?Math.min((now-last)/1000,.08):0;last=now;
 if(ready){
  if(started&&!paused){acc+=elapsed;while(acc>=DT){const before=g.stats.skills,hits=g.stats.hits,wasFrozen=g.freeze>0;stepCampaign(g,inputs());if(g.stats.skills>before)tone(g.heroes[0].action==='magic'?'fire':'water');else if(g.stats.hits>hits)tone('hit');if(!wasFrozen)taps.clear();acc-=DT;}}
  else acc=0;
  if(!paused||now-hudAt>100)renderer.draw(g);
  if(g.phase!==lastPhase&&['stageClear','win','lose'].includes(g.phase)){showOverlay(g.phase);clearKeys();}lastPhase=g.phase;
  if(now-hudAt>100){updateHUD();hudAt=now;}
 }
 requestAnimationFrame(frame);
}
showOverlay('intro');
try{const art=await loadArt();renderer=createRenderer(canvas,art);ready=true;$('.screen').classList.remove('loading');$('#start').disabled=false;$('#start').textContent='함께 출발';updateHUD();}catch(e){$('#start').textContent='다시 불러오기';$('#status').textContent=e.message;console.error(e);}
requestAnimationFrame(frame);
