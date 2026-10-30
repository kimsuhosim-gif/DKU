import * as T from 'three';
export type SmashStats={score:number;combo:number;energy:number;destroyed:number;total:number;target:string;hp:number;maxHp:number;cleared:boolean;health:number[]};
type Building={group:T.Group;x:number;z:number;w:number;d:number;h:number;hp:number;max:number;name:string;color:string;shake:number;parts:T.Mesh[]};
type Fragment={mesh:T.Mesh;v:T.Vector3;spin:T.Vector3;life:number;floor:number};
export class SmashScene{
 readonly scene=new T.Scene();readonly camera=new T.PerspectiveCamera(43,1,.1,130);readonly renderer:T.WebGLRenderer;
 private actor=new T.Group();private torso=new T.Group();private arms=new T.Group();private legs:T.Group[]=[];
 private materials=new Set<T.Material>();private textures:T.Texture[]=[];private buildings:Building[]=[];private fragments:Fragment[]=[];
 private ring!:T.Mesh;private targetRing!:T.Mesh;private ray=new T.Raycaster();private floor=new T.Plane(new T.Vector3(0,1,0),0);
 private stick={x:0,z:0};private keys=new Set<string>();private path:T.Vector3[]=[];private target=-1;private holding=false;private active=false;private paused=false;private cleared=false;
 private hitPause=0;private shownTarget=-2;private score=0;private combo=0;private energy=0;private lastHit=-20;private clock=0;private cooldown=0;private swing=0;private shake=0;private pulse=0;private frame=0;private disposed=false;
 private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;private audio:AudioContext|null=null;private sound=false;private observer:ResizeObserver;private cameraTarget=new T.Vector3();private lastShadow=0;
 private hidden=()=>{this.keys.clear();this.stick={x:0,z:0};this.holding=false;};
 private keydown=(e:KeyboardEvent)=>{if(!this.active||this.paused||/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName))return;const k=e.key.toLowerCase();if(k===' '&&(e.target as HTMLElement).tagName==='BUTTON')return;if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)){e.preventDefault();this.keys.add(k);}if(k==='e'&&!e.repeat)this.special();};
 private keyup=(e:KeyboardEvent)=>this.keys.delete(e.key.toLowerCase());
 private lost=(e:Event)=>{e.preventDefault();this.paused=true;this.onError('그래픽 연결이 끊겼어요. 다시 불러와 주세요.');};
 constructor(private host:HTMLElement,private onStats:(s:SmashStats)=>void,private onHit:(text:string)=>void,private onError:(s:string)=>void){
  this.renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;this.renderer.shadowMap.autoUpdate=false;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
  host.append(this.renderer.domElement);this.renderer.domElement.setAttribute('aria-label','효민이의 철거 놀이터. 건물을 누르면 다가가 공격합니다.');this.renderer.domElement.setAttribute('role','img');this.renderer.domElement.addEventListener('webglcontextlost',this.lost);
  this.scene.background=new T.Color('#9fbdc0');this.scene.fog=new T.Fog('#9fbdc0',65,110);this.scene.add(new T.HemisphereLight('#fff4dd','#385a73',2.5));
  const sun=new T.DirectionalLight('#fff0cb',3);sun.position.set(-14,25,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,far:65});sun.shadow.normalBias=.08;this.scene.add(sun);
  this.landscape();this.makeActor();this.actor.scale.setScalar(1.55);this.actor.position.set(0,0,6);this.actor.rotation.y=.3;
  this.ring=this.mesh(new T.TorusGeometry(1,.055,5,64),'#ffda5c');this.ring.rotation.x=-Math.PI/2;this.ring.visible=false;this.scene.add(this.ring);
  this.targetRing=this.mesh(new T.TorusGeometry(2,.055,4,48),'#f5aa43');this.targetRing.rotation.x=-Math.PI/2;this.targetRing.position.y=.08;this.targetRing.visible=false;this.scene.add(this.targetRing);
  this.reset();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  window.addEventListener('keydown',this.keydown);window.addEventListener('keyup',this.keyup);window.addEventListener('blur',this.hidden);document.addEventListener('visibilitychange',this.hidden);
  let last=0;const tick=(now:number)=>{if(this.disposed)return;const dt=Math.min(last?(now-last)/1000:1/60,.06);last=now;if(!document.hidden){this.update(dt);this.renderer.render(this.scene,this.camera);}this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);
 }
 private material(color:string,options:T.MeshStandardMaterialParameters={}){const m=new T.MeshStandardMaterial({color,roughness:.85,...options});this.materials.add(m);return m;}
 private mesh(g:T.BufferGeometry,color:string){return new T.Mesh(g,this.material(color));}
 private box(parent:T.Object3D,color:string,size:number[],pos:number[]){const m=this.mesh(new T.BoxGeometry(...size as[number,number,number]),color);m.position.set(...pos as[number,number,number]);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 private landscape(){
  this.box(this.scene,'#829b9a',[140,.4,140],[0,-1.1,0]);this.box(this.scene,'#847e6c',[23,.6,23],[0,-.5,0]);this.box(this.scene,'#ded7bf',[22,.3,22],[0,-.1,0]);
  this.box(this.scene,'#9cafa1',[20,.04,20],[0,.07,0]);this.box(this.scene,'#d8d4bf',[4,.05,21],[0,.1,0]);this.box(this.scene,'#d8d4bf',[20,.05,3],[0,.1,0]);
  for(let i=-9;i<=9;i+=2){this.box(this.scene,'#f4e8ca',[.055,.02,20],[i,.13,0]);this.box(this.scene,'#f4e8ca',[20,.02,.055],[0,.13,i]);}
  for(let i=0;i<12;i++){const x=i%2?-10:10,z=-9+Math.floor(i/2)*3.5;const trunk=this.mesh(new T.CylinderGeometry(.12,.18,1.2,6),'#765a40');trunk.position.set(x,.6,z);this.scene.add(trunk);const leaves=this.mesh(new T.IcosahedronGeometry(.95,0),i%3?'#567660':'#c89a54');leaves.position.set(x,1.7,z);leaves.castShadow=true;this.scene.add(leaves);}
  const sign=this.label('RE09  PLAYGROUND','#f5d98b','#273b45',512,90);sign.scale.set(6,1.05,1);sign.position.set(0,1.1,-10.5);this.scene.add(sign);
  for(const x of[-8,8]){this.box(this.scene,'#334d55',[.12,3.3,.12],[x,1.7,0]);this.box(this.scene,'#ffe8a7',[.5,.2,.5],[x,3.4,0]);}
 }
 private createBuilding(x:number,z:number,w:number,d:number,h:number,name:string,color:string,max:number){
  const group=new T.Group();group.position.set(x,.15,z);this.scene.add(group);const parts:T.Mesh[]=[];
  const main=this.box(group,color,[w,h,d],[0,h/2,0]);parts.push(main);this.box(group,'#f2e5c5',[w+.3,.22,d+.3],[0,h+.1,0]);
  const floors=Math.floor(h/.85);for(let f=0;f<floors;f++){const y=.65+f*.85;this.box(group,'#cabf9e',[w+.06,.08,d+.06],[0,y-.4,0]);for(let col=0;col<3;col++){const px=(col-1)*w/3;for(const side of[-1,1]){const win=this.box(group,'#467782',[w/4,.48,.045],[px,y,side*(d/2+.03)]);parts.push(win);}}for(const side of[-1,1])for(let col=0;col<2;col++){const win=this.box(group,'#467782',[.045,.48,d/3],[side*(w/2+.03),y,(col-.5)*d/2]);parts.push(win);}}
  this.box(group,'#344d56',[w*.3,.85,.07],[0,.42,d/2+.07]);const roof=this.box(group,'#8e9c94',[w*.4,.45,d*.4],[0,h+.4,0]);parts.push(roof);
  const label=this.label(name,'#f9efcc','#293f49',256,64);label.scale.set(w*.85,w*.85/4,1);label.position.set(0,h+.28,d/2+.17);group.add(label);
  this.buildings.push({group,x,z,w,d,h,hp:max,max,name,color,shake:0,parts});
 }
 reset(){
  this.buildings.forEach(b=>{this.scene.remove(b.group);this.disposeObject(b.group);});this.buildings=[];this.fragments.forEach(p=>{this.scene.remove(p.mesh);this.disposeObject(p.mesh);});this.fragments=[];
  this.createBuilding(-5,-4.8,3.6,3.2,4.1,'ASSIGNMENT','#d9c5a1',5);this.createBuilding(0,-5.4,3,3,6.2,'DEADLINE','#d8b19b',7);this.createBuilding(5,-4.8,3.6,3.2,4.8,'OVERTIME','#a8bcb0',6);this.createBuilding(-5,3,3.2,3.4,3.1,'MONDAY','#d5b679',4);this.createBuilding(5,3,3.2,3.4,3.8,'STRESS','#a3b7c3',5);
  this.score=0;this.combo=0;this.energy=0;this.lastHit=-20;this.cooldown=0;this.swing=0;this.shake=0;this.pulse=0;this.cleared=false;this.path=[];this.target=-1;this.holding=false;this.keys.clear();this.stick={x:0,z:0};this.actor.position.set(0,0,6);this.actor.rotation.y=.3;this.ring.visible=false;this.renderer.shadowMap.needsUpdate=true;this.emit();
 }
 start(){this.active=true;this.emit();}
 pause(p:boolean){this.paused=p;if(p)this.hidden();}
 setMove(x:number,z:number){this.stick={x,z};if(Math.hypot(x,z)>.1){this.path=[];this.target=-1;}}
 hold(active:boolean){this.holding=active;}
 setSound(on:boolean){this.sound=on;if(on)try{this.audio??=new AudioContext();void this.audio.resume();}catch{this.sound=false;}}
 private tone(destroy:boolean){if(!this.sound||!this.audio)return;const c=this.audio,o=c.createOscillator(),g=c.createGain();o.type=destroy?'sawtooth':'triangle';o.connect(g);g.connect(c.destination);o.frequency.setValueAtTime(destroy?100:180,c.currentTime);o.frequency.exponentialRampToValueAtTime(35,c.currentTime+.18);g.gain.setValueAtTime(.08,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.22);o.start();o.stop(c.currentTime+.23);}
 private emit(){const b=this.target>=0?this.buildings[this.target]:this.nearest();this.shownTarget=b?this.buildings.indexOf(b):-1;this.onStats({score:this.score,combo:this.combo,energy:this.energy,destroyed:this.buildings.filter(b=>b.hp<=0).length,total:this.buildings.length,target:b?.name??'',hp:b?.hp??0,maxHp:b?.max??1,cleared:this.cleared,health:this.buildings.map(b=>b.hp)});}
 private distance(b:Building){return Math.hypot(Math.max(0,Math.abs(this.actor.position.x-b.x)-b.w/2),Math.max(0,Math.abs(this.actor.position.z-b.z)-b.d/2));}
 private nearest(){return this.buildings.filter(b=>b.hp>0).sort((a,b)=>this.distance(a)-this.distance(b))[0];}
 private blocked(x:number,z:number){return Math.abs(x)>10||Math.abs(z)>10||this.buildings.some(b=>b.hp>0&&Math.abs(x-b.x)<b.w/2+.5&&Math.abs(z-b.z)<b.d/2+.5);}
 private move(x:number,z:number,dt:number){const n=Math.hypot(x,z);if(n<.01)return false;const speed=5.8*dt/Math.max(1,n);let moved=false;const px=this.actor.position.x+x*speed,pz=this.actor.position.z+z*speed;if(!this.blocked(px,this.actor.position.z)){this.actor.position.x=px;moved=true;}if(!this.blocked(this.actor.position.x,pz)){this.actor.position.z=pz;moved=true;}if(moved)this.actor.rotation.y=Math.atan2(x,z);return moved;}
 private route(goal:T.Vector3){
  const size=41,toCell=(v:number)=>Math.max(0,Math.min(40,Math.round((v+10)*2))),key=(x:number,z:number)=>z*size+x;
  const sx=toCell(this.actor.position.x),sz=toCell(this.actor.position.z),gx=toCell(goal.x),gz=toCell(goal.z),start=key(sx,sz),end=key(gx,gz);
  const queue=[start],parents=new Map<number,number>([[start,-1]]);let found=false;
  for(let q=0;q<queue.length;q++){const k=queue[q];if(k===end){found=true;break;}const x=k%size,z=Math.floor(k/size);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,nk=key(nx,nz);if(nx<0||nx>=size||nz<0||nz>=size||parents.has(nk)||this.blocked(nx/2-10,nz/2-10))continue;parents.set(nk,k);queue.push(nk);}}
  this.path=[];if(!found)return;let current=end;while(current!==start){this.path.unshift(new T.Vector3(current%size/2-10,0,Math.floor(current/size)/2-10));current=parents.get(current)!;}
 }
 select(index:number){if(!this.active||this.paused||this.cleared)return;const b=this.buildings[index];if(!b||b.hp<=0)return;this.target=index;const points:T.Vector3[]=[];for(const side of[-1,1]){points.push(new T.Vector3(b.x+side*(b.w/2+1.2),0,b.z));points.push(new T.Vector3(b.x,0,b.z+side*(b.d/2+1.2)));}points.sort((a,b)=>a.distanceTo(this.actor.position)-b.distanceTo(this.actor.position));for(const point of points){this.route(point);if(this.path.length||point.distanceTo(this.actor.position)<.5)break;}this.emit();}
 pick(clientX:number,clientY:number){if(!this.active||this.paused||this.cleared)return;const r=this.host.getBoundingClientRect();this.ray.setFromCamera(new T.Vector2((clientX-r.left)/r.width*2-1,-(clientY-r.top)/r.height*2+1),this.camera);for(const hit of this.ray.intersectObjects(this.buildings.filter(b=>b.hp>0).map(b=>b.group),true)){let root:T.Object3D=hit.object;while(root.parent&&root.parent!==this.scene)root=root.parent;const index=this.buildings.findIndex(b=>b.group===root);if(index>=0){this.select(index);return;}}
  const point=new T.Vector3();if(this.ray.ray.intersectPlane(this.floor,point)&&!this.blocked(point.x,point.z)){this.target=-1;this.route(point);this.emit();}
 }
 attack(){if(!this.active||this.paused||this.cleared||this.cooldown>0)return;const b=this.nearest();this.cooldown=.4;this.swing=.36;if(!b||this.distance(b)>2.1){this.onHit('조금 더 가까이!');return;}this.actor.rotation.y=Math.atan2(b.x-this.actor.position.x,b.z-this.actor.position.z);this.damage(b,1,false);}
 special(){if(!this.active||this.paused||this.cleared||this.energy<100)return false;this.energy=0;this.swing=.6;this.cooldown=.65;this.pulse=.6;this.ring.position.set(this.actor.position.x,.2,this.actor.position.z);this.shake=this.reduced?0:.28;this.onHit('스트레스 박살!!');let hit=false;for(const b of this.buildings)if(b.hp>0&&this.distance(b)<7){this.damage(b,3,true);hit=true;}if(!hit)this.emit();return true;}
 private damage(b:Building,amount:number,heavy:boolean){
  b.hp=Math.max(0,b.hp-amount);b.shake=.23;this.hitPause=this.reduced?0:.045;this.combo=this.clock-this.lastHit<4?this.combo+1:1;this.lastHit=this.clock;this.energy=heavy?this.energy:Math.min(100,this.energy+18);this.score+=100*Math.min(5,this.combo);this.shake=this.reduced?0:heavy?.25:.12;
  const p=new T.Vector3(Math.max(b.x-b.w/2,Math.min(this.actor.position.x,b.x+b.w/2)),1.5,Math.max(b.z-b.d/2,Math.min(this.actor.position.z,b.z+b.d/2)));
  this.burst(p,b.color,heavy?18:9);const win=b.parts.find(m=>m.visible&&m.geometry.type==='BoxGeometry'&&m.position.y>0&&Math.abs(m.position.z)>b.d/2);if(win)win.visible=false;
  const main=b.parts[0].material as T.MeshStandardMaterial;main.color.set(b.color).multiplyScalar(.65+.35*b.hp/b.max);
  if(b.hp===0){this.collapse(b);b.group.visible=false;this.score+=1000;this.energy=Math.min(100,this.energy+15);if(this.target===this.buildings.indexOf(b)){this.target=-1;this.path=[];}this.onHit(heavy?'싹 쓸었다!!':'와르르!!');this.tone(true);}else{if(!heavy)this.onHit(['쾅!','콰직!','한 방 더!'][this.combo%3]);this.tone(false);}
  this.cleared=this.buildings.every(b=>b.hp===0);if(this.cleared){this.target=-1;this.holding=false;this.path=[];this.onHit('철거 완료! 속 시원하다!!');}this.renderer.shadowMap.needsUpdate=true;this.emit();
 }
 private collapse(b:Building){
  const rows=Math.ceil(b.h/.9),dx=b.w/3,dz=b.d/2,dy=b.h/rows;
  for(let y=0;y<rows;y++)for(let x=0;x<3;x++)for(let z=0;z<2;z++){
   if(this.fragments.length>=200)break;
   const m=this.mesh(new T.BoxGeometry(dx*.92,dy*.9,dz*.9),(x+y+z)%4===0?'#587f84':b.color);
   m.position.set(b.x+(x-1)*dx,.2+(y+.5)*dy,b.z+(z-.5)*dz);m.castShadow=true;this.scene.add(m);
   this.fragments.push({mesh:m,v:new T.Vector3((x-1)*2+(Math.random()-.5)*3,1+Math.random()*2,(z-.5)*3+(Math.random()-.5)*2),spin:new T.Vector3(Math.random()*3,Math.random()*3,Math.random()*3),life:7+Math.random()*3,floor:dy*.35});
  }
 }
 private burst(pos:T.Vector3,color:string,count:number){const available=Math.min(count,150-this.fragments.length);for(let i=0;i<available;i++){const m=this.mesh(new T.BoxGeometry(.18+Math.random()*.45,.18+Math.random()*.45,.18+Math.random()*.45),i%4===0?'#507a86':color);m.position.copy(pos).add(new T.Vector3((Math.random()-.5)*1.5,Math.random()*1.5,(Math.random()-.5)*1.5));this.scene.add(m);this.fragments.push({mesh:m,v:new T.Vector3((Math.random()-.5)*9,3+Math.random()*6,(Math.random()-.5)*9),spin:new T.Vector3(Math.random()*6,Math.random()*6,Math.random()*6),life:3+Math.random()*3,floor:.3});}}
 private update(dt:number){
  if(this.hitPause>0){this.hitPause-=dt;return;}if(!this.paused)this.clock+=dt;const playing=this.active&&!this.paused&&!this.cleared;if(playing){this.cooldown=Math.max(0,this.cooldown-dt);let x=this.stick.x+(this.keys.has('d')||this.keys.has('arrowright')?1:0)-(this.keys.has('a')||this.keys.has('arrowleft')?1:0),z=this.stick.z+(this.keys.has('s')||this.keys.has('arrowdown')?1:0)-(this.keys.has('w')||this.keys.has('arrowup')?1:0);if(Math.hypot(x,z)>.05){this.path=[];this.target=-1;}else if(this.path.length){const d=this.path[0].clone().sub(this.actor.position);if(d.length()<.22)this.path.shift();else{x=d.x;z=d.z;const n=Math.hypot(x,z);x/=n;z/=n;}}
   const moved=this.move(x,z,dt);const current=this.target>=0?this.target:this.buildings.indexOf(this.nearest()!);if(current!==this.shownTarget)this.emit();this.legs.forEach((l,i)=>l.rotation.x=moved?Math.sin(this.clock*15+i*Math.PI)*.55:0);this.torso.position.y=moved?Math.abs(Math.sin(this.clock*15))*.08:0;
   if(this.target>=0&&this.buildings[this.target].hp>0&&this.distance(this.buildings[this.target])<2.1){this.path=[];if(this.cooldown<=0){const b=this.buildings[this.target];this.actor.rotation.y=Math.atan2(b.x-this.actor.position.x,b.z-this.actor.position.z);this.cooldown=.4;this.swing=.36;this.damage(b,1,false);}}
   else if(this.holding||this.keys.has(' '))this.attack();if(this.combo&&this.clock-this.lastHit>4){this.combo=0;this.emit();}
  }
  if(!this.paused){this.swing=Math.max(0,this.swing-dt);this.arms.rotation.x=this.swing>0?Math.sin(this.swing/.36*Math.PI)*-2.1:0;this.torso.rotation.y=this.swing>0?Math.sin(this.swing/.36*Math.PI)*.4:0;this.actor.position.y=this.cleared&&!this.reduced?Math.abs(Math.sin(this.clock*5))*.8:0;if(this.cleared){this.arms.rotation.x=-2.8;this.legs.forEach((l,i)=>l.rotation.x=Math.sin(this.clock*5+i)*.4);}
   for(const b of this.buildings){b.shake=Math.max(0,b.shake-dt);b.group.rotation.z=this.reduced?0:Math.sin(b.shake*80)*b.shake*.15;}
   for(let i=this.fragments.length-1;i>=0;i--){const p=this.fragments[i];p.life-=dt;p.v.y-=dt*15;p.mesh.position.addScaledVector(p.v,dt);if(p.mesh.position.y<p.floor){p.mesh.position.y=p.floor;p.v.y=Math.abs(p.v.y)*.22;p.v.x*=.82;p.v.z*=.82;}p.mesh.rotation.x+=p.spin.x*dt;p.mesh.rotation.z+=p.spin.z*dt;if(p.life<1)p.mesh.scale.setScalar(Math.max(.01,p.life));if(p.life<=0){this.scene.remove(p.mesh);this.disposeObject(p.mesh);this.fragments.splice(i,1);}}
   this.pulse=Math.max(0,this.pulse-dt);this.ring.visible=this.pulse>0;if(this.pulse>0)this.ring.scale.setScalar(1+(1-this.pulse/.6)*8);
  }
  const target=this.target>=0?this.buildings[this.target]:null;this.targetRing.visible=!!target&&target.hp>0;if(target){this.targetRing.position.set(target.x,.2,target.z);this.targetRing.scale.setScalar(Math.max(target.w,target.d)*.44);}
  const portrait=this.camera.aspect<.85,look=this.active?this.actor.position.clone().multiplyScalar(portrait?.75:.3):new T.Vector3(0,0,0);look.y=1.2;this.cameraTarget.lerp(look,this.reduced?1:Math.min(1,dt*5));
  const offset=new T.Vector3(0,portrait?18:20,portrait?21:23);if(this.camera.aspect<.43)offset.multiplyScalar(1.12);this.camera.position.copy(this.cameraTarget).add(offset);if(this.shake>0&&!this.reduced){this.camera.position.x+=Math.sin(this.clock*95)*this.shake;this.camera.position.y+=Math.cos(this.clock*80)*this.shake;}this.shake=Math.max(0,this.shake-dt);this.camera.lookAt(this.cameraTarget);
  if(this.clock-this.lastShadow>.15){this.renderer.shadowMap.needsUpdate=true;this.lastShadow=this.clock;}
 }
 private resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 private disposeObject(o:T.Object3D){o.traverse(c=>{if(c instanceof T.Mesh){c.geometry.dispose();for(const m of Array.isArray(c.material)?c.material:[c.material]){const tex=(m as T.MeshStandardMaterial).map;if(tex){tex.dispose();this.textures=this.textures.filter(t=>t!==tex);}m.dispose();this.materials.delete(m);}}});}
 dispose(){this.disposed=true;cancelAnimationFrame(this.frame);this.observer.disconnect();window.removeEventListener('keydown',this.keydown);window.removeEventListener('keyup',this.keyup);window.removeEventListener('blur',this.hidden);document.removeEventListener('visibilitychange',this.hidden);this.renderer.domElement.removeEventListener('webglcontextlost',this.lost);void this.audio?.close();this.disposeObject(this.scene);this.renderer.dispose();this.renderer.domElement.remove();}
   private label(text: string, color: string, bg: string, width = 128, height = 128) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height); ctx.fillStyle = color;
    ctx.font = `bold ${height * .6}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, width / 2, height / 2);
    const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; this.textures.push(texture);
    const material = new T.MeshBasicMaterial({ map: texture }); this.materials.add(material);
    return new T.Mesh(new T.PlaneGeometry(1, 1), material);
  }
  private makeActor() {
    this.scene.add(this.actor); this.actor.add(this.torso);
    const body = this.mesh(new T.CapsuleGeometry(.35, .48, 4, 8), '#263a3a'); body.position.y = 1.12; body.castShadow = true; this.torso.add(body);
    const zip = this.box(this.torso, '#b4b8ac', [.025, .63, .04], [0, 1.18, .35]); zip.rotation.x = -.05;
    const badge = this.label('09', '#ede1b5', '#263a3a'); badge.scale.set(.17, .17, 1); badge.position.set(.18, 1.32, .345); this.torso.add(badge);
    const head = new T.Group(); head.position.y = 1.9; head.rotation.x = -.32; this.torso.add(head);
    const face = this.mesh(new T.SphereGeometry(.48, 16, 12), '#e9b286'); face.scale.set(1, 1.04, .88); face.castShadow = true; head.add(face);
    const cap = this.mesh(new T.SphereGeometry(.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#fbf4df'); cap.position.y = .13; head.add(cap);
    const brim = this.mesh(new T.SphereGeometry(.46, 12, 8), '#f6eddb'); brim.scale.set(1, .1, .85); brim.position.set(0, .15, .37); head.add(brim);
    const capBadge = this.label('09', '#244d43', '#fbf4df'); capBadge.scale.set(.23, .18, 1); capBadge.position.set(0, .32, .43); head.add(capBadge);
    for (const x of [-.22, .22]) {
      const glasses = this.mesh(new T.BoxGeometry(.37, .24, .07), '#172c2a'); glasses.position.set(x, 0, .39); head.add(glasses);
      const lens = this.mesh(new T.BoxGeometry(.27, .15, .075), '#b2c5b4'); lens.position.set(x, 0, .4); head.add(lens);
      const eye = this.mesh(new T.SphereGeometry(.035, 6, 6), '#182c28'); eye.position.set(x, -.005, .445); head.add(eye);
    }
    this.box(head, '#172c2a', [.1, .04, .08], [0, .02, .43]);
    const nose = this.mesh(new T.SphereGeometry(.08, 8, 6), '#d99b73'); nose.position.set(0, -.12, .43); head.add(nose);
    const smile = this.mesh(new T.TorusGeometry(.11, .018, 4, 12, Math.PI), '#6c3d2e'); smile.rotation.z = Math.PI; smile.position.set(0, -.24, .385); head.add(smile);
    this.arms.position.set(0, 1.4, 0); this.torso.add(this.arms);
    for (const x of [-.43, .43]) {
      const arm = this.mesh(new T.CapsuleGeometry(.13, .55, 3, 8), '#263a3a'); arm.position.set(x, -.25, .18); arm.rotation.x = -.45; arm.rotation.z = x > 0 ? -.2 : .2; this.arms.add(arm);
      const hand = this.mesh(new T.SphereGeometry(.14, 8, 6), x > 0 ? '#f1e9d8' : '#e9b286'); hand.position.set(x * .65, -.58, .37); this.arms.add(hand);
    }
    const club = new T.Group(); club.position.set(.27, -.55, .4); club.rotation.x = -.3; this.arms.add(club);
    const shaft = this.mesh(new T.CylinderGeometry(.055, .055, 1.3, 8), '#846346'); shaft.position.y = -.5; club.add(shaft);
    this.box(club, '#e7af43', [.8, .4, .45], [0, -1.1, 0]);
    for (const x of [-.2, .2]) {
      const leg = new T.Group(); leg.position.set(x, .7, 0); this.actor.add(leg); this.legs.push(leg);
      const pants = this.mesh(new T.CapsuleGeometry(.16, .36, 3, 8), '#c6baa4'); pants.position.y = -.25; leg.add(pants);
      const shoe = this.mesh(new T.SphereGeometry(.22, 10, 8), '#f1ecdc'); shoe.scale.set(.85, .55, 1.3); shoe.position.set(0, -.6, .12); shoe.castShadow = true; leg.add(shoe);
    }
    this.actor.scale.setScalar(1.15);
  }

}


