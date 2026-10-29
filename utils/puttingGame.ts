export type Point = { x:number; y:number };
export type Rect = { x:number; y:number; w:number; h:number };
export type Course = { name:string; hint:string; par:number; start:Point; cup:Point; walls:Rect[]; sand:Rect[]; water:Rect[] };
export const COURSES:Course[] = [
 {name:'첫 인사는 가볍게',hint:'공을 아래로 당겼다가 놓아보세요.',par:2,start:{x:180,y:420},cup:{x:180,y:100},walls:[],sand:[],water:[]},
 {name:'돌아가는 여유',hint:'가운데 벽을 피해 왼쪽이나 오른쪽으로.',par:3,start:{x:90,y:425},cup:{x:270,y:95},walls:[{x:125,y:220,w:110,h:24}],sand:[],water:[]},
 {name:'벙커의 유혹',hint:'모래에서는 공이 빨리 멈춰요. 우회도 방법!',par:3,start:{x:90,y:425},cup:{x:255,y:90},walls:[],sand:[{x:115,y:205,w:130,h:100}],water:[]},
 {name:'물만은 피하자',hint:'물에 빠지면 1벌타. 출발 지점으로 돌아와요.',par:3,start:{x:75,y:425},cup:{x:280,y:85},walls:[],sand:[],water:[{x:130,y:205,w:100,h:125}]},
 {name:'효민이의 마지막 승부',hint:'두 개의 벽 사이로 길을 찾아보세요.',par:4,start:{x:70,y:430},cup:{x:285,y:80},walls:[{x:30,y:285,w:185,h:20},{x:160,y:165,w:170,h:20}],sand:[{x:250,y:335,w:65,h:70}],water:[]},
];
export type Ball = Point & { vx:number; vy:number };
export const inside=(p:Point,r:Rect)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
export function stepBall(ball:Ball,course:Course,dt:number): 'moving'|'stopped'|'water'|'holed' {
 const r=7;
 ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
 if(ball.x<23){ball.x=23;ball.vx=Math.abs(ball.vx)*.72;}if(ball.x>337){ball.x=337;ball.vx=-Math.abs(ball.vx)*.72;}
 if(ball.y<23){ball.y=23;ball.vy=Math.abs(ball.vy)*.72;}if(ball.y>477){ball.y=477;ball.vy=-Math.abs(ball.vy)*.72;}
 for(const wall of course.walls){
  const nx=Math.max(wall.x,Math.min(ball.x,wall.x+wall.w)),ny=Math.max(wall.y,Math.min(ball.y,wall.y+wall.h));
  const dx=ball.x-nx,dy=ball.y-ny,d=Math.hypot(dx,dy);
  if(d<r){
   if(d>.001){const ux=dx/d,uy=dy/d;ball.x=nx+ux*(r+.05);ball.y=ny+uy*(r+.05);const dot=ball.vx*ux+ball.vy*uy;if(dot<0){ball.vx-=1.7*dot*ux;ball.vy-=1.7*dot*uy;}}
   else {const faces=[{d:ball.x-wall.x,x:wall.x-r-.1,y:ball.y,axis:'x'},{d:wall.x+wall.w-ball.x,x:wall.x+wall.w+r+.1,y:ball.y,axis:'x'},{d:ball.y-wall.y,x:ball.x,y:wall.y-r-.1,axis:'y'},{d:wall.y+wall.h-ball.y,x:ball.x,y:wall.y+wall.h+r+.1,axis:'y'}].sort((a,b)=>a.d-b.d);const f=faces[0];ball.x=f.x;ball.y=f.y;if(f.axis==='x')ball.vx*=-.7;else ball.vy*=-.7;}
  }
 }
 if(course.water.some(z=>inside(ball,z)))return 'water';
 const speed=Math.hypot(ball.vx,ball.vy);
 if(Math.hypot(ball.x-course.cup.x,ball.y-course.cup.y)<12&&speed<230){ball.x=course.cup.x;ball.y=course.cup.y;ball.vx=0;ball.vy=0;return 'holed';}
 const friction=course.sand.some(z=>inside(ball,z))?260:68;
 const next=Math.max(0,speed-friction*dt);
 if(speed>0){ball.vx*=next/speed;ball.vy*=next/speed;}
 if(next<5){ball.vx=0;ball.vy=0;return 'stopped';}
 return 'moving';
}
export function shotVelocity(angle:number,power:number){const speed=60+Math.max(1,Math.min(100,power))*3;const rad=angle*Math.PI/180;return {vx:Math.sin(rad)*speed,vy:-Math.cos(rad)*speed};}
