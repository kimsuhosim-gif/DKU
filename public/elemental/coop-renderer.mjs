import {spriteFrame} from './animation.mjs';
import {STAGES,WIDTH} from './coop.mjs';
const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('그림을 불러오지 못했어: '+src));i.src=src;});
export async function loadArt(){
 const art={heroes:{},enemies:{},backgrounds:{},fx:{}};
 const jobs=[];
 for(const id of ['fire','water']){
  jobs.push(load(`motion-v2/${id}/spritesheet.png`).then(i=>art.heroes[id]=i));
  jobs.push(load(`locomotion/${id}/spritesheet.png`).then(i=>art.heroes[id+'move']=i));
  for(const a of ['walk','attack2','attack3'])jobs.push(load(`motion-v3/${id}/${a}/spritesheet.png`).then(i=>art.heroes[id+a]=i));
 }
 for(const id of ['raider','hound','warden'])jobs.push(load(`stage-v5/${id}.png`).then(i=>art.enemies[id]=i));
 for(const id of ['market','canal','gate'])jobs.push(load(`stage-v5/${id}.webp`).then(i=>art.backgrounds[id]=i));
 const response=await fetch('stage-v5/fx/manifest.json');if(!response.ok)throw Error('기술 효과 정보 로드 실패');
 const manifest=await response.json();
 for(const [key,meta] of Object.entries(manifest))jobs.push(load(`stage-v5/fx/${key}.png`).then(i=>art.fx[key]={...meta,image:i}));
 await Promise.all(jobs);return art;
}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createRenderer(canvas,art){
 const c=canvas.getContext('2d',{alpha:false}),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const bgCache=document.createElement('canvas');bgCache.width=1680;bgCache.height=560;const bc=bgCache.getContext('2d');let cachedStage=-1;
 const renderFx=(key,x,y,p,scale=1,dir=1,alpha=1)=>{
  const f=art.fx[key];if(!f)return;
  const n=clamp(Math.floor(p*f.frames),0,f.frames-1),sx=n%f.columns*f.width,sy=Math.floor(n/f.columns)*f.height;
  c.save();c.globalAlpha=alpha;c.translate(x,y);c.scale(dir*scale,scale);c.imageSmoothingEnabled=false;
  c.drawImage(f.image,sx,sy,f.width,f.height,-f.pivot[0],-f.pivot[1],f.width,f.height);c.restore();
 };
 function label(text,x,y,color='#fff',size=16){c.save();c.font=`800 ${size}px system-ui`;c.textAlign='center';c.lineWidth=4;c.strokeStyle='#091018';c.strokeText(text,x,y);c.fillStyle=color;c.fillText(text,x,y);c.restore();}
 function background(g){
  if(cachedStage!==g.stage){bc.drawImage(art.backgrounds[STAGES[Math.min(g.stage,2)].background],0,0,1680,560);cachedStage=g.stage;}
  c.drawImage(bgCache,-g.camera*.375,0);
  const shade=c.createLinearGradient(0,0,0,560);shade.addColorStop(0,'#07111c66');shade.addColorStop(.55,'#07111c05');shade.addColorStop(1,'#03061277');c.fillStyle=shade;c.fillRect(0,0,960,560);
  // Rain remains scenery only; no high-frequency screen flash.
  if(!reduced.matches){c.strokeStyle='#b3dbe91c';c.lineWidth=1;c.beginPath();for(let n=0;n<40;n++){const x=((n*127+g.time*23)%1040)-40,y=(n*71+g.time*280)%560;c.moveTo(x,y);c.lineTo(x-5,y+17);}c.stroke();}
 }
 function hero(g,a){
  const x=a.x-g.camera,y=a.y,scale=.48;
  c.fillStyle='#020a12aa';c.beginPath();c.ellipse(x,y+2,39,9,0,0,7);c.fill();
  if(a.hp>0){c.strokeStyle=a.id==='fire'?'#ffa45b99':'#62e8f199';c.lineWidth=2;c.beginPath();c.ellipse(x,y+3,33,8,0,0,7);c.stroke();}
  c.save();c.translate(x,y);c.scale(a.dir,1);
  if(a.hp<=0){c.globalAlpha=.55;c.rotate(-a.dir*.9);}
  else if(a.invuln>0)c.globalAlpha=.6+.4*Math.abs(Math.sin(a.invuln*22));
  const f=spriteFrame(a.hp<=0?{...a,action:'hurt'}:a);
  c.drawImage(art.heroes[f.key],f.sx,f.sy,f.sw,f.sh,-f.anchorX*scale,-480*scale,f.sw*scale,f.sh*scale);c.restore();
  label(a.id==='fire'?'1P':(g.mode==='solo'?'AI 동료':'2P'),x,y+22,a.id==='fire'?'#ffc286':'#85f4ff',12);
  if(a.hp<=0){label('구조 필요',x,y-80,'#ffe6a5',17);c.fillStyle='#0b1420';c.fillRect(x-34,y-65,68,6);c.fillStyle='#ffe6a5';c.fillRect(x-34,y-65,68*a.revive/1.5,6);}
 }
 function enemy(g,a){
  const x=a.x-g.camera,y=a.y;if(x<-250||x>1210||a.deathAge>.6)return;
  const im=art.enemies[a.kind],height=a.kind==='warden'?264:a.kind==='hound'?109:169,width=im.width/im.height*height;
  const bob=a.moving&&!reduced.matches?Math.abs(Math.sin(a.walk*11))*4:0;
  c.fillStyle='#0009';c.beginPath();c.ellipse(x,y+3,a.kind==='warden'?65:35,9,0,0,7);c.fill();
  c.save();c.translate(x,y-bob);c.scale(-a.dir,1);
  if(a.action==='dead'){c.globalAlpha=Math.max(0,1-a.deathAge/.6);c.translate(a.deathDir*a.deathAge*30,0);c.rotate(-a.deathDir*Math.min(1,a.deathAge*2));}
  if(a.action==='spawn')c.globalAlpha=clamp(a.age/.65,0,1);
  if(a.action==='hurt')c.rotate(.1*a.dir);
  if(a.action==='tell')c.rotate(-.07*a.dir);
  if(a.action==='attack')c.rotate(Math.sin(Math.min(1,a.age/.5)*Math.PI)*.12*a.dir);
  c.drawImage(im,-width/2,-height,width,height);c.restore();
  if(a.hp>0&&a.kind!=='warden'){c.fillStyle='#111621';c.fillRect(x-27,y-height-15,54,5);c.fillStyle='#ee8179';c.fillRect(x-27,y-height-15,54*a.hp/a.maxHp,5);}
 }
 function telegraph(g,e){
  if(e.action!=='tell'||!e.mark)return;
  const x=e.mark.x-g.camera,y=e.mark.y,boss=e.kind==='warden',p=clamp(e.age/e.tellDuration,0,1);
  c.save();c.translate(x,y);c.scale(1,.37);c.fillStyle=boss?'#f4a34b30':'#ff42482b';c.strokeStyle=boss?'#ffd082':'#ff8888';c.lineWidth=3;c.beginPath();c.arc(0,0,boss?(e.pattern?155:120):75,0,7);c.fill();c.stroke();c.beginPath();c.arc(0,0,(boss?150:72)*p,0,7);c.stroke();c.restore();label('!',e.x-g.camera,e.y-(boss?285:200),'#ffd798',25);
 }
 function effects(g){
  for(const p of g.projectiles){const x=p.x-g.camera,progress=p.age/1.1;
   if(p.element==='fire')renderFx('flame',x-p.dir*70,p.y-55,.2+progress*.75,2.35,p.dir);
   else {renderFx('wave',x,p.y+5,.08+progress*.8,2.7,p.dir);renderFx('waterSlash',x-p.dir*60,p.y-8,.18+progress*.7,1.7,p.dir,.85);}
  }
  for(const e of g.events){const p=1-e.life/e.maxLife,x=e.x-g.camera,y=e.y;
   if(e.type==='charge')renderFx('charge',x,y+15,p,1.5,e.dir);
   else if(e.type==='slash')renderFx(e.element==='fire'?'fireSlash':'waterSlash',x,y+55,p, e.combo===3?1.55:1.05,e.dir);
   else if(e.type==='eruption')renderFx('eruption',x,y+5,p*.8,1.0,e.dir);
   else if(e.type==='waterImpact')renderFx('geyser',x,y+5,.12+p*.75,1.65,e.dir);
   else if(e.type==='bossSlam'){renderFx('eruption',x,y+10,.08+p*.8,1.35);}
   else if(e.type==='enemySlash')renderFx('fireSlash',x,y,p,1.0,e.dir,.7);
   else if(e.type==='hit'){
    c.save();c.globalAlpha=Math.min(1,e.life*5);const col=e.element==='water'?'#baffff':e.element==='enemy'?'#ff8b8b':'#fff0c4';
    c.translate(x,y);c.fillStyle=col;const r=(e.big?35:21)*(1-p);c.beginPath();for(let k=0;k<16;k++){const a=k*Math.PI/8,rad=k%2?r*.2:r;(k?c.lineTo.bind(c):c.moveTo.bind(c))(Math.cos(a)*rad,Math.sin(a)*rad);}c.closePath();c.fill();c.restore();label(String(e.amount),x,y-20-p*40,col,e.big?23:17);
   }else if(e.type==='defeat')renderFx('charge',x,y+50,p,1.4,1,1-p);
   else if(e.type==='burst'){
    if(!reduced.matches){c.fillStyle=`rgba(8,10,32,${.35*(1-p)})`;c.fillRect(0,0,960,560);}
    for(let n=-2;n<=2;n++){renderFx(n%2?'geyser':'eruption',x+n*180,480,clamp(p*1.4-Math.abs(n)*.07,0,1),1.45,n<0?-1:1);}
    label('원소 공명',480,195,'#fff5dc',42);label('FIRE × WATER',480,225,'#98eeff',16);
   }
  }
 }
 return {draw(g){
  const begin=performance.now();c.clearRect(0,0,960,560);background(g);const backgroundEnd=performance.now();
  g.enemies.forEach(e=>telegraph(g,e));
  for(const a of [...g.heroes,...g.enemies].sort((a,b)=>a.y-b.y)){a.team==='heroes'?hero(g,a):enemy(g,a);}
  const actorsEnd=performance.now();effects(g);const effectsEnd=performance.now();
  if(g.phase==='combat'){const x=[1100,1910,2760][g.wave]-g.camera;if(x<960){c.fillStyle='#6d43a52b';c.fillRect(x,330,5,190);label('구역 봉쇄',Math.min(895,x-40),340,'#d5b8ff',13);}}
  else if(g.phase==='travel'){label('GO →',865,285,'#ffe09b',29);if(g.wave>=3)label('출구로 이동',850,311,'#ffe9c3',15);}
  const boss=g.enemies.find(e=>e.kind==='warden'&&e.hp>0);if(boss){c.fillStyle='#0b0d16dd';c.fillRect(250,95,460,31);c.fillStyle='#ce925b';c.fillRect(256,115,448*boss.hp/boss.maxHp,5);label('균열의 수문장',480,109,'#f7d9bc',13);}
  const wave=g.events.findLast(e=>e.type==='wave'||e.type==='notice');if(wave){c.fillStyle='#080e1dcc';c.fillRect(260,140,440,38);label(wave.text,480,165,'#ffe4b1',18);}
  const skill=g.events.findLast(e=>e.type==='skillName');if(skill)label(skill.text,480,525,skill.element==='fire'?'#ffc080':'#88f2ff',20);
  return {backgroundMs:backgroundEnd-begin,actorsMs:actorsEnd-backgroundEnd,effectsMs:effectsEnd-actorsEnd,hudMs:performance.now()-effectsEnd};
 }};
}
