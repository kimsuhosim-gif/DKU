import * as T from 'three';
export type EquipmentKind='standard'|'bomb'|'pierce'|'multi'|'meteor'|'shock';
export function createBallModel(kind:EquipmentKind){
 const root=new T.Group();root.name=`ball-${kind}`;root.userData.kind=kind;
 const material=(color:string,metalness=.25,glow=false)=>new T.MeshStandardMaterial({color,metalness,roughness:.34,emissive:glow?color:'#000000',emissiveIntensity:glow?.75:0});
 const add=(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;root.add(o);return o;};
 const ring=(r:number,m:T.Material,axis:'x'|'y'|'z'='x')=>{const o=add(new T.TorusGeometry(r,.055,6,32),m);o.rotation[axis]=Math.PI/2;return o;};
 const pearl=material('#f9f4e8'),steel=material('#6b8493',.85);
 if(kind==='standard'){
  add(new T.SphereGeometry(.84,28,18),pearl);
  const dimple=new T.InstancedMesh(new T.SphereGeometry(.035,5,4),material('#b6c6c7'),96);const m=new T.Matrix4();
  for(let i=0;i<96;i++){const y=1-2*(i+.5)/96,a=i*2.399963,r=Math.sqrt(1-y*y);m.makeTranslation(r*Math.cos(a)*.827,y*.827,r*Math.sin(a)*.827);dimple.setMatrixAt(i,m);}root.add(dimple);ring(.846,material('#255951'),'y');
 }else if(kind==='bomb'){
  add(new T.SphereGeometry(.8,24,16),material('#262b39',.75));ring(.81,material('#ed7949'),'x');
  add(new T.CylinderGeometry(.21,.25,.25,12),steel,0,.83);add(new T.CylinderGeometry(.065,.065,.32,8),material('#b89b6d'),0,1.07);
  const spark=add(new T.IcosahedronGeometry(.16,0),material('#ffe08a',0,true),0,1.27);spark.name='spark';
  for(const x of[-.24,.24])add(new T.BoxGeometry(.11,.24,.08),material('#ffb56b',0,true),x,.08,.77);
 }else if(kind==='pierce'){
  add(new T.SphereGeometry(.73,24,16),steel);ring(.76,material('#5ce5ff',.3,true),'x');
  const tip=add(new T.ConeGeometry(.57,.92,24),material('#bdeefa',.9),0,0,-.83);tip.rotation.x=-Math.PI/2;
  for(let i=0;i<3;i++){const o=add(new T.BoxGeometry(.1,.43,.66),material('#329fb6',.8));o.position.set(Math.sin(i*2.094)*.65,Math.cos(i*2.094)*.65,.27);o.rotation.z=-i*2.094;}
 }else if(kind==='multi'){
  add(new T.SphereGeometry(.64,24,16),material('#7d61cc',.5));const orbit=ring(.94,material('#d6b5ff',.3,true),'x');orbit.rotation.z=.4;
  for(let i=0;i<3;i++)add(new T.SphereGeometry(.29,16,10),pearl,Math.cos(i*2.094)*.9,.08,Math.sin(i*2.094)*.9);
 }else if(kind==='meteor'){
  add(new T.IcosahedronGeometry(.93,1),material('#442c36',.6));
  for(let i=0;i<3;i++){const o=ring(.87,material('#ff8a35',.1,true),'x');o.rotation.set(i*.9,.4+i,.5);}
  for(let i=0;i<5;i++){const o=add(new T.ConeGeometry(.2,.8+i*.1,7),material(i%2?'#ff6b31':'#ffc44a',0,true),Math.sin(i*1.25)*.48,.6,Math.cos(i*1.25)*.48);o.rotation.z=-.25;}
 }else{
  add(new T.SphereGeometry(.75,24,16),material('#234a50',.6));ring(.83,steel,'x');ring(.84,steel,'y');
  const neon=material('#a4ffd1',.2,true);
  for(let i=0;i<3;i++){const a=i*2.094;const points=[[-.3,.68,.62],[.08,.15,.8],[-.15,.1,.83],[.25,-.63,.65]].map(p=>new T.Vector3(...p as [number,number,number]).applyAxisAngle(new T.Vector3(0,1,0),a));add(new T.TubeGeometry(new T.CatmullRomCurve3(points),12,.045,6,false),neon);}
 }
 return root;
}
export function createDriverModel(){
 const root=new T.Group();root.name='RE09-carbon-driver';
 const black=new T.MeshStandardMaterial({color:'#18252e',metalness:.65,roughness:.26}),silver=new T.MeshStandardMaterial({color:'#a9bec7',metalness:.9,roughness:.24}),gold=new T.MeshStandardMaterial({color:'#d1b270',metalness:.7,roughness:.35});
 const add=(g:T.BufferGeometry,m:T.Material,x:number,y:number,z:number)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;root.add(o);return o;};
 add(new T.CylinderGeometry(.022,.032,1.65,12),silver,0,-.47,0);
 add(new T.CylinderGeometry(.045,.037,.43,12),black,0,.35,0);
 for(let i=0;i<9;i++){const o=add(new T.TorusGeometry(.044,.005,4,12),gold,0,.17+i*.045,0);o.rotation.x=Math.PI/2;}
 add(new T.CylinderGeometry(.045,.06,.18,12),gold,0,-1.28,0);
 const head=add(new T.SphereGeometry(1,28,18),black,.15,-1.4,0);head.scale.set(.34,.16,.24);
 const face=add(new T.SphereGeometry(1,24,12),silver,.15,-1.4,.18);face.scale.set(.28,.125,.035);
 for(let i=0;i<5;i++)add(new T.BoxGeometry(.42,.009,.012),black,.15,-1.47+i*.033,.214);
 const stripe=add(new T.TorusGeometry(.18,.012,5,24),gold,.16,-1.25,0);stripe.rotation.x=Math.PI/2;stripe.scale.x=1.35;
 return root;
}
