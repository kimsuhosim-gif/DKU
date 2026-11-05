import type {Fighter} from './rooftopModel';

// Each row is anticipation -> contact (index 2) -> follow-through -> recovery.
// Frame 14 in the old hammer sheet is a hurt pose; it must never be an attack.
export const LIGHT_POSES = [
 [[8,9,12,13,15],[15,13,11,12,8],[8,10,12,13,15]],
 [[8,9,12,13,15],[15,10,11,13,8],[8,10,12,13,15]],
 [[8,10,12,13,8],[13,11,12,13,8],[8,10,12,12,13]],
 [[8,9,12,14,15],[15,10,13,14,8],[8,11,12,13,15]],
 [[8,9,12,13,15],[15,11,13,12,8],[8,10,12,13,15]],
 [[8,9,12,13,15],[15,10,13,14,8],[8,11,12,13,15]],
] as const;
export const MOTION_LABELS = ['라이징 스윙','홈런 횡타','해머 내려찍기','어퍼컷','런지 찌르기','프라이팬 강타'] as const;
export function attackProgress(p:Pick<Fighter,'poseTime'|'attackDuration'>){return Math.max(0,Math.min(1,1-p.poseTime/Math.max(.001,p.attackDuration)));}
export function attackCell(p:Pick<Fighter,'poseTime'|'attackDuration'|'cast'|'attackStep'>){
 const t=attackProgress(p),beat=t<.22?0:t<.5?1:t<.64?2:t<.8?3:4;
 return LIGHT_POSES[p.cast][Math.max(0,Math.min(2,p.attackStep-1))][beat];
}
export function heavyCell(t:number){return t<.5?0:t<.64?1:t<.82?2:3;}
export const actorHeight=(y:number,scale:number)=>Math.min(285,Math.max(225,150/scale))*(.94+(y+380)/760*.10);

/** Separate, lightweight weapon paths, drawn only during the active strike. */
export function weaponTrail(c:CanvasRenderingContext2D,cast:number,t:number,heavy:boolean,color:string,size:number){
 if(t<.42||t>.72)return;
 const a=Math.sin((t-.42)/.30*Math.PI);c.save();c.scale(size,size);c.globalAlpha=a*.85;c.lineCap='round';
 const path=()=>{c.beginPath();
  if(cast===4){c.moveTo(12,6);c.lineTo(145,0);}
  else if(cast===3){if(heavy){c.moveTo(25,45);c.quadraticCurveTo(92,25,64,-55);}else{c.moveTo(15,0);c.lineTo(74,-8);}}
  else if(cast===2){c.moveTo(0,-90);c.bezierCurveTo(90,-95,115,-15,85,60);}
  else if(cast===0){c.moveTo(0,45);c.quadraticCurveTo(140,35,110,-65);}
  else if(cast===5){c.ellipse(48,0,65,45,.4,-1.8,1.5);}
  else{c.ellipse(40,0,110,28,-.15,-1.5,1.4);}
 };
 c.strokeStyle='#162731';c.lineWidth=heavy?16:11;path();c.stroke();
 c.strokeStyle=color;c.lineWidth=heavy?11:7;path();c.stroke();
 c.strokeStyle='#fffce8';c.lineWidth=heavy?4:2.5;path();c.stroke();c.restore();
}

/** Contact-first effects: no explosive stock animation unrelated to the weapon. */
export function contactEffect(c:CanvasRenderingContext2D,cast:number,age:number,heavy:boolean,block:boolean,broken:boolean,color:string,reduced:boolean){
 const duration=heavy?.32:.23;if(age>duration)return;
 const t=reduced?.2:age/duration,r=(heavy?26:17)+t*(heavy?36:22);
 c.save();c.globalAlpha=Math.min(1,(1-age/duration)*2);c.lineCap='round';
 if(block||broken){
  c.strokeStyle=broken?'#ff9464':'#adffff';c.lineWidth=5;c.beginPath();
  if(broken){for(let i=0;i<5;i++){const a=i*1.25;c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(Math.cos(a)*(r+18),Math.sin(a)*(r+18));}}
  else c.arc(0,0,r,-1.5,1.5);
  c.stroke();c.restore();return;
 }
 // Bright contact core + dark edge remain readable on the painted roof.
 c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2?r*.36:r*(i%4===0?1.2:.8);const x=Math.cos(a)*rr,y=Math.sin(a)*rr*(cast===4?.45:1);if(i===0)c.moveTo(x,y);else c.lineTo(x,y);}c.closePath();
 c.fillStyle='#fffbea';c.strokeStyle='#172933';c.lineWidth=5;c.stroke();c.fill();
 c.strokeStyle=color;c.lineWidth=heavy?5:3;
 for(let i=0;i<6;i++){const a=i*Math.PI/3+.2,near=r+7,far=near+(heavy?28:16);c.beginPath();c.moveTo(Math.cos(a)*near,Math.sin(a)*near);c.lineTo(Math.cos(a)*far,Math.sin(a)*far);c.stroke();}
 if(cast===2||cast===5){c.beginPath();c.ellipse(0,0,r*1.55,r*.7,cast===2?.4:0,0,Math.PI*2);c.stroke();}
 c.restore();
}
