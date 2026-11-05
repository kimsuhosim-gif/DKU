import {CAST,RooftopMatch,Action,ARENA,MAX_HP,WEAPONS,Fighter,SPECIALS} from './rooftopModel';
import {PixelAudio} from './pixelAudio';
import {actorHeight,attackCell,attackProgress,heavyCell,weaponTrail,contactEffect,specialEffect} from './rooftopCombatVisuals';

type Burst={x:number;y:number;life:number;text:string;hit:boolean;color:string;cast:number;angle:number;jump:number;targetY:number;heavy:boolean;block:boolean;broken:boolean};
const load=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`Asset failed: ${src}`));i.src=src;});

/** Painted stage and hand-drawn animation frames. No mesh or detached weapon. */
export class RooftopGame {
 model=new RooftopMatch();audio=new PixelAudio();ready:Promise<void>;
 private ctx:CanvasRenderingContext2D;private images:HTMLImageElement[]=[];private motion:HTMLImageElement[]=[];private stage:HTMLImageElement|null=null;
 private observer:ResizeObserver;private keys=new Set<string>();private raf=0;private disposed=false;
 private width=1;private height=1;private dpr=1;private clock=0;private notify=0;private freeze=0;private shake=0;
 private cameraX=768;private heldAttack=false;private queued:Action|null=null;private queueTime=0;private bursts:Burst[]=[];
 private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 private heavyMotion:HTMLImageElement[]=[];
 private specialBursts:{x:number;y:number;cast:number;angle:number;life:number}[]=[];
 constructor(private canvas:HTMLCanvasElement,private changed:()=>void){
  const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Canvas unavailable');this.ctx=context;
  this.model.start(0);this.model.phase='ready';
  this.ready=Promise.all([load('/images/rooftop-painted-stage-v2.png'),...CAST.map(p=>load(p.image)),...CAST.map(p=>load(`/images/rooftop-${p.id}-motion-${p.id==='seongtae'?'v4':'v3'}.png`)),...CAST.map(p=>load(`/images/rooftop-${p.id}-heavy-v4.png`))]).then(([stage,...actors])=>{if(!this.disposed){this.stage=stage;this.images=actors.slice(0,6);this.motion=actors.slice(6,12);this.heavyMotion=actors.slice(12);}});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
  window.addEventListener('keydown',this.down);window.addEventListener('keyup',this.up);window.addEventListener('blur',this.blur);document.addEventListener('visibilitychange',this.visibility);
  let last=performance.now();
  const loop=(now:number)=>{if(this.disposed)return;const dt=Math.min(.035,(now-last)/1000);last=now;
   if(this.keys.size)this.model.stick={x:Number(this.keys.has('d')||this.keys.has('arrowright'))-Number(this.keys.has('a')||this.keys.has('arrowleft')),y:Number(this.keys.has('s')||this.keys.has('arrowdown'))-Number(this.keys.has('w')||this.keys.has('arrowup'))};
   if(this.model.phase==='playing'){
    this.queueTime=Math.max(0,this.queueTime-dt);const p=this.model.fighters[0];
    if(p&&p.cool<=0&&p.stun<=0){if(this.queued&&this.queueTime>0){this.model.action(0,this.queued);this.queued=null;}else if(this.heldAttack)this.model.action(0,'push');}
   }
   if(this.model.phase!=='paused'){
    if(this.freeze>0)this.freeze=Math.max(0,this.freeze-dt);else this.model.update(dt);
    if(['round','finished'].includes(this.model.phase))for(const p of this.model.fighters)if(!p.alive)p.fall+=dt;
    this.clock+=dt;this.shake=Math.max(0,this.shake-dt*30);
    for(const b of this.bursts)b.life-=dt;this.bursts=this.bursts.filter(b=>b.life>0);
    for(const b of this.specialBursts)b.life-=dt;this.specialBursts=this.specialBursts.filter(b=>b.life>0);
   }
   for(const e of this.model.events.splice(0)){
    if(e.kind==='special'){this.audio.play('boss');continue;}
    if(e.kind==='special-impact'){this.specialBursts.push({x:e.x,y:e.y,cast:e.cast??0,angle:e.angle??0,life:.65});if(this.specialBursts.length>12)this.specialBursts.shift();this.audio.play(e.cast===5?'glass':'throw');continue;}
    this.audio.play(e.kind==='fall'?'hurt':e.kind==='round'?'win':e.kind==='save'?'upgrade':e.kind==='dash'?'dash':e.kind==='heavy'?'throw':'hit');
    const hit=e.kind==='hit'||e.kind==='heavy';if(hit){this.freeze=e.kind==='heavy'?.075:.025;this.shake=this.reduced?0:e.kind==='heavy'?5:1.5;}
    if(e.kind!=='round'&&e.kind!=='dash')this.bursts.push({x:e.x,y:e.y,life:.65,text:e.text,hit,color:e.text==='GUARD BREAK'?'#ffad80':e.cast===undefined?'#8bf1dc':WEAPONS[e.cast].color,cast:e.cast??0,angle:e.angle??0,jump:e.jump??0,targetY:e.targetY??e.y,heavy:e.kind==='heavy',block:e.text==='BLOCK',broken:e.text==='GUARD BREAK'});
    if(this.bursts.length>24)this.bursts.splice(0,this.bursts.length-24);
   }
   this.draw(dt);this.notify+=dt;if(this.notify>.08){this.notify=0;this.changed();}this.raf=requestAnimationFrame(loop);
  };this.raf=requestAnimationFrame(loop);
 }
 private resize(){const r=this.canvas.getBoundingClientRect();this.width=Math.max(1,r.width);this.height=Math.max(1,r.height);this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);}
 private point(x:number,y:number){return{x:768+x*(1.07+y/380*.07),y:610+y*.60};}
 private frame(p:Fighter){
  if(!p.alive||p.stun>0||p.down>0)return 26;
  if(['round','finished'].includes(this.model.phase)&&p===this.model.fighters[this.model.winner])return 27;
  if(p.specialLeft>0&&p.cast===5)return 23;
  if(p.poseTime>0)return attackCell(p);
  if(p.jump>0)return p.jump>.32?3:7;
  if(p.guard>0)return 23;
  return Math.hypot(p.vx,p.vy)>20?Math.floor(p.gait)%8:20;
 }
 private actor(p:Fighter,index:number,scale:number){
  const special=p.attackKind==='special'&&p.poseTime>0;
  const elapsed=p.attackDuration-p.poseTime,pulse=SPECIALS[3].pulses.find(t=>t>=elapsed-.075)??SPECIALS[3].pulses[4];
  const progress=special&&p.cast===3?Math.max(0,Math.min(1,.5+(elapsed-pulse)/.24)):attackProgress(p);
  const frame=this.frame(p),heavy=p.alive&&p.stun<=0&&p.down<=0&&p.poseTime>0&&(p.attackKind==='heavy'||special)&&!(p.cast===5&&p.specialLeft>0)&&progress>.10&&progress<.96,animated=frame<20,image=heavy?this.heavyMotion[p.cast]:animated?this.motion[p.cast]:this.images[p.cast];if(!image||p.fall>1.4)return;const c=this.ctx,pos=this.point(p.x,p.y),left=Math.cos(p.angle)<0;
  const jump=p.jump>0?Math.sin(p.jump/.65*Math.PI)*90:0,lift=0;
  const height=actorHeight(p.y,scale),drawHeight=height*(heavy?1.48:1),width=drawHeight*(animated||heavy?1:.75);
  if(p.alive){c.save();c.fillStyle='#081a22';c.globalAlpha=.35;c.beginPath();c.ellipse(pos.x,pos.y+2,34-jump*.12,10,0,0,Math.PI*2);c.fill();
   c.globalAlpha=index===0?.9:.5;c.strokeStyle=index===0?'#fff3a6':CAST[p.cast].color;c.lineWidth=index===0?3:2;c.beginPath();c.ellipse(pos.x,pos.y+1,37,12,0,0,Math.PI*2);c.stroke();c.restore();}
  c.save();c.translate(pos.x,pos.y-jump-lift);if(left)c.scale(-1,1);
  const bob=this.reduced?0:Math.hypot(p.vx,p.vy)>20?Math.sin(p.gait*Math.PI)*3:Math.sin(this.clock*3+index)*1.2;
  if(p.down>0||!p.alive){c.translate(0,-18);c.rotate(-1.15);c.scale(.8,.8);}else if(!this.reduced&&p.dash>0)c.rotate(-.15);
  c.globalAlpha=p.alive?1:Math.max(0,1-p.fall);
  const cell=heavy?heavyCell(progress):animated?frame:frame-20,sw=image.width/4,sh=heavy?image.height:image.height/(animated?4:2),sx=cell%4*sw,sy=heavy?0:Math.floor(cell/4)*sh;
  if(p.dash>0&&!this.reduced){c.globalAlpha=.18;c.drawImage(image,sx,sy,sw,sh,-width/2-32,-height*.94+bob,width,height);c.globalAlpha=1;}
  c.drawImage(image,sx,sy,sw,sh,-width/2,-drawHeight*(heavy?.9375:.94)+bob,width,drawHeight);
  c.restore();
  if(p.alive){c.save();c.fillStyle='#18272c';c.fillRect(pos.x-29,pos.y+18,58,5);c.fillStyle=p.hp<50?'#f26b63':index===0?'#ffe58e':'#77d8bc';c.fillRect(pos.x-29,pos.y+18,58*p.hp/MAX_HP,5);c.restore();}
  if(p.guard>0){c.save();c.strokeStyle='#9cecdf';c.lineWidth=4;c.globalAlpha=.8;c.beginPath();c.ellipse(pos.x,pos.y-height*.40,55,75,0,-Math.PI*.65,Math.PI*.65);c.stroke();c.restore();}
  if(p.alive&&p.poseTime>0&&p.stun<=0&&!this.reduced){c.save();c.translate(pos.x,pos.y-jump-height*.45);if(left)c.scale(-1,1);weaponTrail(c,p.cast,progress,heavy,WEAPONS[p.cast].color,height/250);c.restore();}
 }
 private draw(dt:number){const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle='#192a32';c.fillRect(0,0,this.width,this.height);if(!this.stage)return;
  const scale=Math.max(this.width/1536,this.height/1024),worldWidth=this.width/scale,portrait=this.width<this.height;
  const p=this.model.fighters[0],target=portrait&&p?.alive&&this.model.phase!=='ready'?this.point(p.x,p.y).x:768;
  this.cameraX+=(Math.max(worldWidth/2,Math.min(1536-worldWidth/2,target))-this.cameraX)*Math.min(1,dt*7);
  const tx=this.width/2-this.cameraX*scale+(this.reduced?0:Math.sin(this.clock*95)*this.shake),ty=(this.height-1024*scale)/2;
  c.save();c.translate(tx,ty);c.scale(scale,scale);c.drawImage(this.stage,0,0,1536,1024);

  // Telegraphs stay on the floor, behind actors, so an enemy special is readable.
  for(const p of this.model.fighters)if(p.alive&&p.specialLeft>0){const pos=this.point(p.x,p.y),s=SPECIALS[p.cast],elapsed=s.duration-p.specialLeft;c.save();c.translate(pos.x,pos.y);c.strokeStyle=WEAPONS[p.cast].color;c.globalAlpha=.6;c.lineWidth=4;c.setLineDash([12,9]);c.beginPath();if(p.cast===2)c.ellipse(0,0,s.range,s.range*.6,0,0,Math.PI*2);else{const dx=Math.cos(p.angle)*s.range,dy=Math.sin(p.angle)*s.range*.6;c.moveTo(0,0);c.lineTo(dx,dy);}c.stroke();c.setLineDash([]);c.lineWidth=5;c.beginPath();c.ellipse(0,0,48,19,0,0,Math.PI*2*Math.min(1,elapsed/.6));c.stroke();c.restore();}
  this.model.fighters.map((p,i)=>({p,i})).sort((a,b)=>a.p.y-b.p.y).forEach(({p,i})=>this.actor(p,i,scale));
  for(const b of this.specialBursts){const pos=this.point(b.x,b.y);c.save();c.translate(pos.x,pos.y-(b.cast===2?0:actorHeight(b.y,scale)*.46));if(b.cast!==2)c.rotate(Math.atan2(Math.sin(b.angle)*.6,Math.cos(b.angle)));specialEffect(c,b.cast,.65-b.life,WEAPONS[b.cast].color,this.reduced);c.restore();}
  for(const b of this.bursts){const pos=this.point(b.x,b.y),age=.65-b.life,jump=b.jump>0?Math.sin(b.jump/.65*Math.PI)*90:0;c.save();c.translate(pos.x,pos.y-actorHeight(b.targetY,scale)*(b.cast===2&&b.heavy?.22:b.cast===3&&b.heavy?.70:.46)-jump);
   c.save();c.rotate(Math.atan2(Math.sin(b.angle)*.6,Math.cos(b.angle)));const fxScale=Math.max(.85,Math.min(1.7,.75/scale));c.scale(fxScale,fxScale);if(b.hit||b.block||b.broken)contactEffect(c,b.cast,age,b.heavy,b.block,b.broken,b.color,this.reduced);c.restore();
   if(b.text){c.globalAlpha=Math.min(1,b.life*4);const font=Math.max(22,Math.min(36,15/scale));c.font=`900 ${font}px sans-serif`;c.textAlign='center';c.lineWidth=5;c.strokeStyle='#14232c';const y=-55-(this.reduced?0:age*35);c.strokeText(b.text,0,y);c.fillStyle=b.block?'#adffff':'#fff7db';c.fillText(b.text,0,y);}c.restore();
  }c.restore();
 }
 private down=(e:KeyboardEvent)=>{if(/INPUT|TEXTAREA|BUTTON|A/.test((e.target as HTMLElement)?.tagName))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){e.preventDefault();this.keys.add(key);return;}const actions:Record<string,Action>={j:'push',k:'heavy',l:'dash',' ':'jump',i:'guard',u:'special'};if(actions[key]||key==='escape'){e.preventDefault();if(e.repeat)return;if(key==='escape')this.pause();else if(key==='j')this.holdAttack(true);else this.act(actions[key]);}};
 private up=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='j')this.holdAttack(false);if(this.keys.delete(e.key.toLowerCase())&&!this.keys.size)this.model.stick={x:0,y:0};};
 private blur=()=>{if(['playing','countdown'].includes(this.model.phase))this.pause();};
 private visibility=()=>{if(document.hidden)this.blur();};
 holdAttack(value:boolean){this.heldAttack=value;if(value)this.act('push');}
 start(selected:number){void this.audio.unlock();this.keys.clear();this.heldAttack=false;this.queued=null;this.freeze=0;this.bursts=[];this.specialBursts=[];this.model.start(selected);this.changed();}
 preview(selected:number){this.keys.clear();this.heldAttack=false;this.queued=null;this.bursts=[];this.specialBursts=[];this.model.start(selected);this.model.phase='ready';this.changed();}
 pause(){this.keys.clear();this.heldAttack=false;this.queued=null;this.model.pause();this.changed();}
 act(action:Action){void this.audio.unlock();if(this.model.phase==='playing'){const p=this.model.fighters[0];if(action==='dash'&&p&&p.windup<=0&&p.stun<=0){this.model.action(0,action);}else if(p?.cool>0||p?.stun>0){this.queued=action;this.queueTime=.28;}else this.model.action(0,action);}this.changed();}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.observer.disconnect();this.audio.dispose();window.removeEventListener('keydown',this.down);window.removeEventListener('keyup',this.up);window.removeEventListener('blur',this.blur);document.removeEventListener('visibilitychange',this.visibility);this.images=[];this.motion=[];this.stage=null;}
}
