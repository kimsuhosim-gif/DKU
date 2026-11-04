import {CAST,RooftopMatch,Action,ARENA,WEAPONS,Fighter} from './rooftopModel';
import {PixelAudio} from './pixelAudio';

type Burst={x:number;y:number;life:number;text:string;hit:boolean;color:string};
const load=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`Asset failed: ${src}`));i.src=src;});

/** Painted stage and hand-drawn animation frames. No mesh or detached weapon. */
export class RooftopGame {
 model=new RooftopMatch();audio=new PixelAudio();ready:Promise<void>;
 private ctx:CanvasRenderingContext2D;private images:HTMLImageElement[]=[];private stage:HTMLImageElement|null=null;
 private observer:ResizeObserver;private keys=new Set<string>();private raf=0;private disposed=false;
 private width=1;private height=1;private dpr=1;private clock=0;private notify=0;private freeze=0;private shake=0;
 private cameraX=768;private heldAttack=false;private queued:Action|null=null;private queueTime=0;private bursts:Burst[]=[];
 private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 constructor(private canvas:HTMLCanvasElement,private changed:()=>void){
  const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Canvas unavailable');this.ctx=context;
  this.model.start(0);this.model.phase='ready';
  this.ready=Promise.all([load('/images/rooftop-painted-stage-v2.png'),...CAST.map(p=>load(p.image))]).then(([stage,...actors])=>{if(!this.disposed){this.stage=stage;this.images=actors;}});
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
   }
   for(const e of this.model.events.splice(0)){
    this.audio.play(e.kind==='fall'?'hurt':e.kind==='round'?'win':e.kind==='save'?'upgrade':e.kind==='dash'?'dash':e.kind==='throw'?'throw':'hit');
    const hit=e.kind==='hit'||e.kind==='throw';if(hit){this.freeze=.065;this.shake=this.reduced?0:6;}
    if(e.kind!=='round')this.bursts.push({x:e.x,y:e.y,life:.65,text:e.text,hit,color:hit?'#ffe8a8':'#8bf1dc'});
   }
   this.draw(dt);this.notify+=dt;if(this.notify>.08){this.notify=0;this.changed();}this.raf=requestAnimationFrame(loop);
  };this.raf=requestAnimationFrame(loop);
 }
 private resize(){const r=this.canvas.getBoundingClientRect();this.width=Math.max(1,r.width);this.height=Math.max(1,r.height);this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);}
 private point(x:number,y:number){return{x:768+x*(1.07+y/ARENA.y*.07),y:610+y*.60};}
 private frame(p:Fighter){
  if(!p.alive||p.hang||p.heldBy>=0||p.stun>0)return 6;
  if(['round','finished'].includes(this.model.phase)&&p===this.model.fighters[this.model.winner])return 7;
  if(p.poseTime>0&&p.pose===3){const t=.42-p.poseTime;return t<.12?3:t<.25?4:5;}
  if(p.carrying>=0||p.guard>0)return 3;
  return Math.hypot(p.vx,p.vy)>20?[1,0,2,0][Math.floor(p.gait)%4]:0;
 }
 private actor(p:Fighter,index:number,scale:number){
  const image=this.images[p.cast];if(!image||p.fall>1)return;const c=this.ctx,pos=this.point(p.x,p.y),frame=this.frame(p),left=Math.cos(p.angle)<0;
  const jump=p.jump>0?Math.sin(p.jump/.65*Math.PI)*90:0,lift=p.heldBy>=0?65:p.hang?-35:0;
  const height=Math.min(285,Math.max(225,150/scale))*(.94+(p.y+ARENA.y)/(2*ARENA.y)*.10),width=height*.75;
  if(p.alive){c.save();c.fillStyle='#081a22';c.globalAlpha=.35;c.beginPath();c.ellipse(pos.x,pos.y+2,34-jump*.12,10,0,0,Math.PI*2);c.fill();
   c.globalAlpha=index===0?.9:.5;c.strokeStyle=index===0?'#fff3a6':CAST[p.cast].color;c.lineWidth=index===0?3:2;c.beginPath();c.ellipse(pos.x,pos.y+1,37,12,0,0,Math.PI*2);c.stroke();c.restore();}
  c.save();c.translate(pos.x,pos.y-jump-lift-p.fall*-180);if(left)c.scale(-1,1);
  const bob=this.reduced?0:Math.hypot(p.vx,p.vy)>20?Math.sin(p.gait*Math.PI)*3:Math.sin(this.clock*3+index)*1.2;
  if(!this.reduced)c.rotate(p.alive?(p.dash>0?-.09:0):p.fall*.6);
  c.globalAlpha=p.alive?1:Math.max(0,1-p.fall);
  const sw=image.width/4,sh=image.height/2,sx=frame%4*sw,sy=Math.floor(frame/4)*sh;
  if(p.dash>0&&!this.reduced){c.globalAlpha=.18;c.drawImage(image,sx,sy,sw,sh,-width/2-32,-height*.94+bob,width,height);c.globalAlpha=1;}
  c.drawImage(image,sx,sy,sw,sh,-width/2,-height*.94+bob,width,height);
  c.restore();
  if(p.guard>0){c.save();c.strokeStyle='#9cecdf';c.lineWidth=4;c.globalAlpha=.8;c.beginPath();c.ellipse(pos.x,pos.y-height*.40,55,75,0,-Math.PI*.65,Math.PI*.65);c.stroke();c.restore();}
  if(frame===4){c.save();c.translate(pos.x,pos.y-height*.45);if(left)c.scale(-1,1);c.strokeStyle=WEAPONS[p.cast].color;c.lineWidth=5;c.globalAlpha=.65;c.beginPath();c.ellipse(30,0,65,32,-.25,-1.4,1.1);c.stroke();c.restore();}
 }
 private draw(dt:number){const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle='#192a32';c.fillRect(0,0,this.width,this.height);if(!this.stage)return;
  const scale=Math.max(this.width/1536,this.height/1024),worldWidth=this.width/scale,portrait=this.width<this.height;
  const p=this.model.fighters[0],target=portrait&&p?.alive&&this.model.phase!=='ready'?this.point(p.x,p.y).x:768;
  this.cameraX+=(Math.max(worldWidth/2,Math.min(1536-worldWidth/2,target))-this.cameraX)*Math.min(1,dt*7);
  const tx=this.width/2-this.cameraX*scale+(this.reduced?0:Math.sin(this.clock*95)*this.shake),ty=(this.height-1024*scale)/2;
  c.save();c.translate(tx,ty);c.scale(scale,scale);c.drawImage(this.stage,0,0,1536,1024);
  if(this.model.time>ARENA.shrinkAt){const b=this.model.bounds,corners=[this.point(-b.x,-b.y),this.point(b.x,-b.y),this.point(b.x,b.y),this.point(-b.x,b.y)];c.save();c.strokeStyle='#ff8b55';c.lineWidth=5;c.setLineDash([18,12]);c.beginPath();corners.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.stroke();c.restore();}
  this.model.fighters.map((p,i)=>({p,i})).sort((a,b)=>a.p.y-b.p.y).forEach(({p,i})=>this.actor(p,i,scale));
  for(const b of this.bursts){const pos=this.point(b.x,b.y),age=.65-b.life;c.save();c.translate(pos.x,pos.y-100);c.globalAlpha=Math.min(1,b.life*4);
   if(b.hit&&age<.22){c.strokeStyle='#fff7cd';c.lineWidth=4;for(let i=0;i<8;i++){const a=i*Math.PI/4,r=15+age*180;c.beginPath();c.moveTo(Math.cos(a)*r,Math.sin(a)*r*.65);c.lineTo(Math.cos(a)*(r+18),Math.sin(a)*(r+18)*.65);c.stroke();}}
   if(b.text){c.font='900 22px sans-serif';c.textAlign='center';c.lineWidth=5;c.strokeStyle='#1b2532';c.strokeText(b.text,0,-50-age*45);c.fillStyle=b.color;c.fillText(b.text,0,-50-age*45);}c.restore();
  }c.restore();
 }
 private down=(e:KeyboardEvent)=>{if(/INPUT|TEXTAREA|BUTTON|A/.test((e.target as HTMLElement)?.tagName))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){e.preventDefault();this.keys.add(key);return;}const actions:Record<string,Action>={j:'push',k:'grab',l:'dash',' ':'jump',i:'guard'};if(actions[key]||key==='escape'){e.preventDefault();if(e.repeat)return;if(key==='escape')this.pause();else if(key==='j')this.holdAttack(true);else this.act(actions[key]);}};
 private up=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='j')this.holdAttack(false);if(this.keys.delete(e.key.toLowerCase())&&!this.keys.size)this.model.stick={x:0,y:0};};
 private blur=()=>{if(['playing','countdown'].includes(this.model.phase))this.pause();};
 private visibility=()=>{if(document.hidden)this.blur();};
 holdAttack(value:boolean){this.heldAttack=value;if(value)this.act('push');}
 start(selected:number){void this.audio.unlock();this.keys.clear();this.heldAttack=false;this.queued=null;this.freeze=0;this.bursts=[];this.model.start(selected);this.changed();}
 preview(selected:number){this.keys.clear();this.heldAttack=false;this.queued=null;this.bursts=[];this.model.start(selected);this.model.phase='ready';this.changed();}
 pause(){this.keys.clear();this.heldAttack=false;this.queued=null;this.model.pause();this.changed();}
 act(action:Action){void this.audio.unlock();if(this.model.phase==='playing'){const p=this.model.fighters[0];if(p?.cool>0||p?.stun>0){this.queued=action;this.queueTime=.22;}else this.model.action(0,action);}this.changed();}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.observer.disconnect();this.audio.dispose();window.removeEventListener('keydown',this.down);window.removeEventListener('keyup',this.up);window.removeEventListener('blur',this.blur);document.removeEventListener('visibilitychange',this.visibility);this.images=[];this.stage=null;}
}
