import BallArt from './BallArt';
import type {EquipmentKind} from '../utils/driveEquipment';
import React,{useRef,useState} from 'react';
type Props={kind:EquipmentKind;disabled:boolean;power:number;yaw:number;onAim:(yaw:number,power:number)=>void;onFire:()=>void};
export default function DriveSling({kind,disabled,power,yaw,onAim,onFire}:Props){
 const drag=useRef<{id:number;x:number;y:number;yaw:number;power:number}|null>(null);const [pull,setPull]=useState({x:0,y:0});
 function cancel(){const d=drag.current;drag.current=null;setPull({x:0,y:0});if(d)onAim(d.yaw,d.power);}
 return <button className={`drive-sling ${drag.current?'pulling':''}`} disabled={disabled} aria-label="공을 당겨서 발사" onPointerDown={e=>{if(e.button!==0||disabled)return;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,power};e.currentTarget.setPointerCapture(e.pointerId);setPull({x:0,y:0});}} onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const x=Math.max(-90,Math.min(90,e.clientX-d.x)),y=Math.max(0,Math.min(100,e.clientY-d.y));setPull({x,y});onAim(d.yaw-x*.24,Math.max(5,y));}} onPointerUp={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const valid=e.clientY-d.y>=14;drag.current=null;setPull({x:0,y:0});if(valid)onFire();else onAim(d.yaw,d.power);}} onPointerCancel={cancel} onLostPointerCapture={()=>{if(drag.current)cancel();}} onBlur={cancel} onKeyDown={e=>{if(e.key==='Escape')cancel();}} onClick={e=>{if(e.detail===0&&!disabled)onFire();}}>
 <span className="sling-copy"><b>{disabled?'공이 날아가는 중':drag.current?`POWER ${Math.round(power)}% · 놓으면 발사`:'공을 아래로 당겼다가 놓기'}</b><small>좌우로 당겨 방향 조절 · 짧게 당기면 약하게</small></span><span className="sling-track"/><span className="sling-recommend" style={{top:45+(drag.current?.power??power)*.55}}>추천</span><span className="sling-ball" style={{transform:`translate(${pull.x*.45}px,${pull.y*.55}px)`}}><BallArt kind={kind}/></span><span className="sling-bottom">↓ PULL & RELEASE</span>
 </button>;
}
