import * as THREE from 'three';
import {CAST,RooftopMatch,Action} from './rooftopModel';
import {PixelAudio} from './pixelAudio';
type Actor={sprite:THREE.Sprite;texture:THREE.Texture;ring:THREE.Mesh;shadow:THREE.Mesh;guard:THREE.Mesh};
type Burst={mesh:THREE.Sprite;life:number};

export class RooftopGame {
 model=new RooftopMatch();audio=new PixelAudio();ready:Promise<void>;
 private renderer:THREE.WebGLRenderer;
 private scene=new THREE.Scene();
 private camera=new THREE.OrthographicCamera(-500,500,350,-350,1,4000);
 private actors:Actor[]=[];private textures:THREE.Texture[]=[];private bursts:Burst[]=[];
 private arena=new THREE.Group();private boundary=new THREE.Group();
 private observer:ResizeObserver;private keys=new Set<string>();
 private raf=0;private clock=0;private notify=0;private freeze=0;private shake=0;
 private width=1;private height=1;private disposed=false;
 private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 private focus=new THREE.Vector3();
 constructor(private canvas:HTMLCanvasElement,private changed:()=>void){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.scene.background=new THREE.Color('#adc5ce');this.scene.fog=new THREE.Fog('#adc5ce',1400,2800);
  this.scene.add(new THREE.HemisphereLight('#fff9e8','#506776',2.5));
  const sun=new THREE.DirectionalLight('#fff0d1',2.8);sun.position.set(-300,700,300);this.scene.add(sun);
  this.buildStage();
  const loader=new THREE.TextureLoader();
  this.ready=Promise.all(CAST.map(p=>loader.loadAsync(p.image))).then(textures=>{
   if(this.disposed){textures.forEach(t=>t.dispose());return;}
   this.textures=textures;
   for(const t of textures){t.colorSpace=THREE.SRGBColorSpace;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;}
   this.syncActors();
  });
  this.model.start(0);this.model.phase='ready';
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
  window.addEventListener('keydown',this.down);window.addEventListener('keyup',this.up);window.addEventListener('blur',this.blur);document.addEventListener('visibilitychange',this.visibility);
  let last=performance.now();
  const loop=(now:number)=>{
   if(this.disposed)return;
   const dt=Math.min(.035,(now-last)/1000);last=now;
   if(this.keys.size)this.model.stick={x:Number(this.keys.has('d')||this.keys.has('arrowright'))-Number(this.keys.has('a')||this.keys.has('arrowleft')),y:Number(this.keys.has('s')||this.keys.has('arrowdown'))-Number(this.keys.has('w')||this.keys.has('arrowup'))};
   if(this.model.phase!=='paused'){
    if(this.freeze>0)this.freeze=Math.max(0,this.freeze-dt);else this.model.update(dt);
    if(this.model.phase==='round'||this.model.phase==='finished')for(const p of this.model.fighters)if(!p.alive)p.fall+=dt;
    this.clock+=dt;this.shake=Math.max(0,this.shake-dt*22);
    for(const b of this.bursts){b.life-=dt;b.mesh.position.y=165+(1-b.life)*45;b.mesh.material.opacity=Math.min(1,b.life*3);}
    this.bursts=this.bursts.filter(b=>{if(b.life>0)return true;this.scene.remove(b.mesh);b.mesh.material.map?.dispose();b.mesh.material.dispose();return false;});
   }
   for(const e of this.model.events.splice(0)){
    this.audio.play(e.kind==='fall'?'hurt':e.kind==='round'?'win':e.kind==='save'?'upgrade':e.kind==='dash'?'dash':e.kind==='throw'?'throw':'hit');
    if(e.kind==='hit'||e.kind==='throw'){this.freeze=.055;this.shake=this.reduced?0:5;}
    if(e.text&&e.kind!=='round')this.burst(e.text,e.x,e.y,e.kind==='fall'?'#fc7759':'#fff3a5');
   }
   this.draw(dt);this.notify+=dt;if(this.notify>.08){this.notify=0;this.changed();}
   this.raf=requestAnimationFrame(loop);
  };this.raf=requestAnimationFrame(loop);
 }
 private box(w:number,h:number,d:number,color:string,x:number,y:number,z:number,parent:THREE.Object3D=this.scene){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.85}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 private buildStage(){
  this.scene.add(this.arena,this.boundary);
  this.box(720,46,460,'#465b64',0,-24,0,this.arena);this.box(700,6,440,'#d9dfd8',0,0,0,this.arena);
  const grid=new THREE.GridHelper(700,14,'#9aaea9','#bdcbc3');grid.scale.z=440/700;grid.position.y=3.2;this.arena.add(grid);
  this.box(250,2,4,'#f4bd37',0,4,0,this.arena);this.box(4,2,150,'#f4bd37',0,4,0,this.arena);
  for(const z of [-218,218])this.box(700,5,9,'#edb63a',0,5,z,this.arena);
  for(const x of [-348,348])this.box(9,5,440,'#edb63a',x,5,0,this.arena);
  for(let x=-330;x<350;x+=35){this.box(18,2,10,'#263c45',x,8,218,this.arena);this.box(18,2,10,'#263c45',x,8,-218,this.arena);}
  for(const x of [-348,348])for(const z of [-218,218]){this.box(10,45,10,'#435d66',x,24,z,this.arena);this.box(14,6,14,'#f9ce68',x,48,z,this.arena);}
  for(const [x,z] of [[-100,-35],[120,45]]){this.box(50,37,50,'#71918f',x,20,z,this.arena);this.box(54,5,54,'#a8c0ba',x,41,z,this.arena);for(let k=0;k<5;k++)this.box(35,2,3,'#456261',x,44,z-16+k*8,this.arena);}
  for(const z of [-1,1])this.box(700,2,4,'#f65f54',0,10,z*220,this.boundary);
  for(const x of [-1,1])this.box(4,2,440,'#f65f54',x*350,10,0,this.boundary);
  // Deterministic skyline: the arena stays visually stable across rounds.
  const windows=new THREE.InstancedMesh(new THREE.BoxGeometry(10,16,1),new THREE.MeshStandardMaterial({roughness:1}),420);
  let windowIndex=0;const matrix=new THREE.Matrix4();
  for(let i=0;i<28;i++){
   const x=(i%14-6.5)*125,z=i<14?-650:-1000,h=180+(i*73)%350;
   this.box(85,h,100,i%3?'#718e9b':'#8fa6ae',x,h/2-200,z);this.box(90,6,105,'#b5c7ca',x,h-197,z);
   for(let row=0;row<5;row++)for(let col=0;col<3;col++){
    matrix.makeTranslation(x-25+col*25,h-230-row*30,z+51);windows.setMatrixAt(windowIndex,matrix);windows.setColorAt(windowIndex,new THREE.Color((i+row+col)%4?'#bed6d5':'#f9e5ab'));windowIndex++;
   }
  }
  this.scene.add(windows);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(5000,5000),new THREE.MeshStandardMaterial({color:'#94aeb8'}));floor.rotation.x=-Math.PI/2;floor.position.y=-240;this.scene.add(floor);
 }
 private ring(radius:number,color:string,opacity=1){const mesh=new THREE.Mesh(new THREE.RingGeometry(radius-2,radius,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));mesh.rotation.x=-Math.PI/2;this.scene.add(mesh);return mesh;}
 private syncActors(){
  for(const a of this.actors){this.scene.remove(a.sprite,a.ring,a.shadow,a.guard);a.texture.dispose();a.sprite.material.dispose();for(const mesh of [a.ring,a.shadow,a.guard]){mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();}}
  this.actors=[];if(!this.textures.length)return;
  for(const [i,p] of this.model.fighters.entries()){
   const texture=this.textures[p.cast].clone();texture.repeat.set(.25,.5);texture.needsUpdate=true;
   const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.12,depthWrite:false}));sprite.center.set(.5,.06);this.scene.add(sprite);
   const ring=this.ring(27,i===0?'#ffe18a':CAST[p.cast].color);
   const shadow=new THREE.Mesh(new THREE.CircleGeometry(25,32),new THREE.MeshBasicMaterial({color:'#152d35',transparent:true,opacity:.24,depthWrite:false}));shadow.rotation.x=-Math.PI/2;this.scene.add(shadow);
   this.actors.push({sprite,texture,ring,shadow,guard:this.ring(35,'#7ff5ef',.8)});
  }
 }
 private burst(text:string,x:number,z:number,color:string){
  for(const b of this.bursts)if(Math.hypot(b.mesh.position.x-x,b.mesh.position.z-z)<80)b.life=0;
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.font='900 48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=9;ctx.strokeStyle='#203f48';ctx.strokeText(text,256,64);ctx.fillStyle=color;ctx.fillText(text,256,64);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));mesh.position.set(x,165,z);mesh.scale.set(150,37.5,1);mesh.renderOrder=10;this.scene.add(mesh);this.bursts.push({mesh,life:1});
 }
 private resize(){const r=this.canvas.getBoundingClientRect();this.width=Math.max(1,r.width);this.height=Math.max(1,r.height);this.renderer.setSize(this.width,this.height,false);}
 private draw(dt:number){
  const b=this.model.bounds;this.boundary.scale.set(b.x/350,1,b.y/220);this.boundary.visible=this.model.time>35;
  const ratio=this.width/this.height,portrait=ratio<1;
  const living=this.model.fighters.filter(p=>p.alive);
  const minX=Math.min(-180,...living.map(p=>p.x)),maxX=Math.max(180,...living.map(p=>p.x));
  const x=portrait?(minX+maxX)/2:0;
  this.focus.lerp(new THREE.Vector3(x,25,30),Math.min(1,dt*5));const span=portrait?Math.max(650,maxX-minX+200):Math.max(890,620*ratio);
  this.camera.left=-span/2;this.camera.right=span/2;this.camera.top=span/ratio/2;this.camera.bottom=-span/ratio/2;
  this.camera.position.set(this.focus.x+this.shake*Math.sin(this.clock*95),660,this.focus.z+850);this.camera.lookAt(this.focus);this.camera.updateProjectionMatrix();
  this.actors.forEach((a,i)=>{
   const p=this.model.fighters[i];if(!p)return;const moving=Math.hypot(p.vx,p.vy)>16;
   let frame=!p.alive?6:p.hang||p.heldBy>=0||p.stun>0?5:p.poseTime>0?p.pose:moving?[1,0,2,0][Math.floor(p.gait)%4]:0;
   if((this.model.phase==='round'||this.model.phase==='finished')&&i===this.model.winner)frame=7;
   const left=Math.cos(p.angle)<0;a.texture.repeat.set(left?-.25:.25,.5);a.texture.offset.set((frame%4+(left?1:0))/4,1-(Math.floor(frame/4)+1)/2);
   const jump=p.jump>0?Math.sin(p.jump/.65*Math.PI)*95:0,bob=this.reduced?0:moving?Math.sin(p.gait*Math.PI)*2:Math.sin(this.clock*3+i)*1.3,lift=p.heldBy>=0?65:p.hang?-45:0,fall=p.alive?0:p.fall;
   a.sprite.position.set(p.x,8+jump+lift+bob-fall*260,p.y);const impact=p.poseTime>0&&p.pose===3?Math.sin(p.poseTime/.25*Math.PI):0;a.sprite.scale.set(165+impact*8,165-impact*5,1);
   a.sprite.material.rotation=this.reduced?0:!p.alive?fall*2:p.dash>0?(left?.12:-.12):0;a.sprite.material.opacity=Math.max(0,1-fall);a.sprite.visible=fall<1;a.sprite.material.color.set(p.stun>.15?'#ffcec2':'#ffffff');
   a.ring.position.set(p.x,5,p.y);a.ring.visible=p.alive;a.shadow.position.set(p.x,4,p.y);a.shadow.scale.setScalar(1-jump/180);a.shadow.visible=p.alive;a.guard.position.set(p.x,8,p.y);a.guard.visible=p.alive&&p.guard>0;
  });this.renderer.render(this.scene,this.camera);
 }
 private down=(e:KeyboardEvent)=>{if(/INPUT|TEXTAREA|BUTTON|A/.test((e.target as HTMLElement)?.tagName))return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){e.preventDefault();this.keys.add(key);return;}const actions:Record<string,Action>={j:'push',k:'grab',l:'dash',' ':'jump',i:'guard'};if(actions[key]||key==='escape'){e.preventDefault();if(e.repeat)return;if(key==='escape')this.pause();else this.act(actions[key]);}};
 private up=(e:KeyboardEvent)=>{if(this.keys.delete(e.key.toLowerCase())&&!this.keys.size)this.model.stick={x:0,y:0};};
 private blur=()=>{if(this.model.phase==='playing'||this.model.phase==='countdown')this.pause();};
 private visibility=()=>{if(document.hidden)this.blur();};
 start(selected:number){void this.audio.unlock();this.keys.clear();this.freeze=0;this.model.start(selected);this.syncActors();this.changed();}
 preview(selected:number){this.model.start(selected);this.model.phase='ready';this.syncActors();this.changed();}
 pause(){this.keys.clear();this.model.pause();this.changed();}
 act(action:Action){void this.audio.unlock();this.model.action(0,action);this.changed();}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.observer.disconnect();this.audio.dispose();window.removeEventListener('keydown',this.down);window.removeEventListener('keyup',this.up);window.removeEventListener('blur',this.blur);document.removeEventListener('visibilitychange',this.visibility);this.scene.traverse(object=>{const mesh=object as THREE.Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material)for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material]){(m as THREE.MeshBasicMaterial).map?.dispose();m.dispose();}});this.textures.forEach(t=>t.dispose());this.renderer.dispose();}
}
