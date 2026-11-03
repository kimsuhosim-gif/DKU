import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {HyominGolfer} from '../utils/hyominGolfer';

const motions=[['Idle','어드레스'],['Swing','드라이버 스윙'],['Celebrate','격한 환호'],['Despair','격한 좌절']] as const;
export default function CharacterStudio(){
 const host=useRef<HTMLDivElement>(null),golfer=useRef<HyominGolfer|null>(null),speed=useRef(1);
 const [ready,setReady]=useState(false),[status,setStatus]=useState('효민이 불러오는 중…'),[slow,setSlow]=useState(false);
 useEffect(()=>{
  const el=host.current!;let dead=false;let previous=0;
  const model=new HyominGolfer();golfer.current=model;
  const scene=new T.Scene();scene.background=new T.Color('#eee9df');
  const camera=new T.PerspectiveCamera(32,1,.1,50);camera.position.set(3.7,2.7,7);
  const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;el.append(renderer.domElement);
  renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','효민이 3D 캐릭터. 드래그로 회전하고 아래 버튼으로 동작 확인');
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.45,0);controls.minDistance=3;controls.maxDistance=10;controls.maxPolarAngle=Math.PI*.55;controls.enableDamping=true;
  scene.add(new T.HemisphereLight('#fff8ed','#657080',2.1));
  const key=new T.DirectionalLight('#fff4dd',2.3);key.position.set(3,6,5);scene.add(key);
  const rim=new T.DirectionalLight('#c7dfff',1.4);rim.position.set(-4,3,-3);scene.add(rim);
  const ground=new T.Mesh(new T.CylinderGeometry(1.8,1.9,.10,64),new T.MeshStandardMaterial({color:'#d6cfbf',roughness:1}));ground.position.y=-.06;scene.add(ground,model.root);
  void model.ready.then(()=>{if(!dead){setReady(true);setStatus('드래그해서 회전 · 두 손가락으로 확대');}}).catch(()=>{if(!dead)setStatus('캐릭터를 불러오지 못했어요. 새로고침해 주세요.');});
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setAnimationLoop(now=>{const dt=Math.min(previous?(now-previous)/1000:0,.05);previous=now;if(!document.hidden){model.update(dt*speed.current,reduced);controls.update();renderer.render(scene,camera);}});
  return()=>{dead=true;golfer.current=null;observer.disconnect();renderer.setAnimationLoop(null);controls.dispose();model.dispose();ground.geometry.dispose();ground.material.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <section className="character-studio">
  <div className="character-viewport" ref={host}/>
  <header><p>RE09 / PLAYER 09</p><h1>효민</h1><span>차콜 집업 · 아이보리 캡</span></header>
  <a className="character-back" href="#/game">게임으로 ↗</a>
  <div className="character-controls">
   <p role="status">{status}</p>
   <div>{motions.map(([id,label])=><button key={id} disabled={!ready} onClick={()=>golfer.current?.play(id)}>{label}</button>)}</div>
   <button className="character-slow" aria-pressed={slow} onClick={()=>{speed.current=slow?1:.4;setSlow(!slow);}}>느리게 보기 {slow?'ON':'OFF'}</button>
  </div>
  <style>{`.character-studio{height:100dvh;min-height:560px;background:#eee9df;position:relative;color:#253b38}.character-viewport{position:absolute;inset:0 0 100px;touch-action:none}.character-studio header{position:absolute;top:28px;left:26px;pointer-events:none}.character-studio header p{font-size:10px;letter-spacing:3px}.character-studio h1{font-size:32px;margin:8px 0}.character-studio header span{font-size:12px}.character-back{position:absolute;right:22px;top:28px;padding:12px 20px;border-radius:30px;background:#253b38;color:white!important}.character-controls{position:absolute;bottom:18px;left:16px;right:16px;text-align:center}.character-controls p{font-size:11px;color:#64706a}.character-controls>div{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}.character-controls button{border:1px solid #253b3820;background:#fffcf5;color:#253b38;border-radius:24px;padding:12px 19px;font:inherit;font-size:12px;cursor:pointer}.character-controls button:disabled{opacity:.45}.character-controls button:focus-visible,.character-back:focus-visible{outline:3px solid #ca8d4e;outline-offset:3px}.character-controls .character-slow{margin-top:10px;background:transparent;padding:5px 14px;font-size:10px}.character-slow[aria-pressed=true]{background:#d1ddcf}@media(max-width:500px){.character-controls button{padding:10px 12px;font-size:11px}.character-studio header{top:18px;left:20px}.character-studio h1{font-size:27px}.character-back{top:20px;font-size:12px}.character-viewport{bottom:115px}}`}</style>
 </section>;
}
