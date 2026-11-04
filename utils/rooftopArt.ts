import * as THREE from 'three';
import {ARENA,OBSTACLES,WEAPONS} from './rooftopModel';

function box(parent:THREE.Object3D,w:number,h:number,d:number,color:string,x=0,y=0,z=0){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.25}));
 mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function cylinder(parent:THREE.Object3D,r:number,h:number,color:string,x=0,y=0,z=0){
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),new THREE.MeshStandardMaterial({color,metalness:.45,roughness:.35}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
export function makeWeapon(index:number){
 const root=new THREE.Group(),w=WEAPONS[index];
 // Local +X is the striking direction; the pivot remains at the hand.
 const shaft=box(root,w.kind==='spear'?115:62,6,6,'#263b45',28,0,0);
 if(w.kind==='club'){shaft.scale.x=1.3;box(root,24,14,13,'#dcebf2',77,0,0);box(root,24,4,14,w.color,77,8,0);}
 if(w.kind==='bat'){const bat=cylinder(root,10,62,w.color,48);bat.rotation.z=Math.PI/2;box(root,16,8,8,'#e8f1ea',2);}
 if(w.kind==='hammer'){box(root,34,36,52,'#263c51',65);box(root,38,26,56,w.color,65);box(root,40,8,58,'#d5eaf3',65);}
 if(w.kind==='glove'){shaft.visible=false;box(root,30,26,30,w.color,23);box(root,12,20,34,'#f3e9d1',3);for(let i=0;i<4;i++)box(root,10,10,7,'#ffe0bc',39,6,-12+i*8);}
 if(w.kind==='spear'){const tip=new THREE.Mesh(new THREE.ConeGeometry(13,36,4),new THREE.MeshStandardMaterial({color:'#d7eced',metalness:.8,roughness:.2}));tip.rotation.z=-Math.PI/2;tip.position.x=103;root.add(tip);box(root,8,12,30,w.color,81);}
 if(w.kind==='pan'){const pan=cylinder(root,24,8,'#303a40',65);pan.rotation.x=Math.PI/2;const rim=new THREE.Mesh(new THREE.TorusGeometry(24,3,8,32),new THREE.MeshStandardMaterial({color:w.color,metalness:.7,roughness:.25}));rim.position.x=65;root.add(rim);}
 const arc=new THREE.Mesh(new THREE.RingGeometry(WEAPONS[index].reach-12,WEAPONS[index].reach,32,1,-.8,1.6),new THREE.MeshBasicMaterial({color:w.color,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false}));arc.rotation.x=-Math.PI/2;arc.name='swing';arc.visible=false;root.add(arc);
 return root;
}
export function buildArena(parent:THREE.Group){
 box(parent,1230,65,790,'#3c4a50',0,-34);
 box(parent,1200,6,760,'#b2bbb8');
 // Contrasting lanes keep the navigation geometry readable from above.
 box(parent,1160,2,210,'#e0e4d9',0,4);
 box(parent,250,2,720,'#7caaa3',0,4);
 const pad=cylinder(parent,170,3,'#445f65',0,6);
 const ring=new THREE.Mesh(new THREE.RingGeometry(151,155,64),new THREE.MeshBasicMaterial({color:'#f6d476',side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=9;parent.add(ring);
 box(parent,15,2,100,'#f4e6b6',-33,10);box(parent,15,2,100,'#f4e6b6',33,10);box(parent,70,2,15,'#f4e6b6',0,10);
 pad.name='helipad';
 for(const z of [-ARENA.y,ARENA.y]){box(parent,1200,8,12,'#efbd49',0,7,z);for(let x=-580;x<600;x+=40)box(parent,20,2,14,'#293b42',x,12,z);}
 for(const x of [-ARENA.x,ARENA.x]){box(parent,12,8,760,'#efbd49',x,7);for(let z=-360;z<380;z+=40)box(parent,14,2,20,'#293b42',x,12,z);}
 for(const [i,o]of OBSTACLES.entries()){
  if(i<2){box(parent,72,52,72,'#688b98',o.x,28,o.y);box(parent,78,6,78,'#e0e9e8',o.x,57,o.y);for(let j=0;j<6;j++)box(parent,56,3,3,'#37545c',o.x,62,o.y-25+j*10);}
  else{box(parent,60,58,60,i===2?'#c76e50':'#528b8b',o.x,30,o.y);for(let j=0;j<5;j++)box(parent,3,50,63,'#e7c8a0',o.x-24+j*12,30,o.y);}
 }
 for(const x of [-550,550])for(const z of [-330,330]){box(parent,12,70,12,'#3c535c',x,38,z);box(parent,20,10,20,'#f9eaa2',x,78,z);}
 for(const x of [-480,480]){box(parent,100,2,65,'#d4dfd6',x,6,0);for(let i=0;i<3;i++)box(parent,12,2,35,'#537f7e',x-30+i*30,8,0);}
}
