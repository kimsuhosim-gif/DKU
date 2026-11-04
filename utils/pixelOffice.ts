export type OfficeProp={x:number;y:number;w:number;h:number;kind:'desk'|'copier'|'water';hp:number;broken:boolean};
export class PixelOffice {
 private routes=new WeakMap<object,{x:number;y:number}>();
 props:OfficeProp[]=[];
 reset(){this.routes=new WeakMap();this.props=[...[[390,370],[1010,370],[390,800],[1010,800]].map(([x,y])=>({x,y,w:180,h:65,kind:'desk' as const,hp:0,broken:false})),{x:300,y:610,w:64,h:60,kind:'copier',hp:75,broken:false},{x:1220,y:610,w:48,h:55,kind:'water',hp:40,broken:false}];}
 wet(x:number,y:number){return this.props.some(p=>p.kind==='water'&&p.broken&&Math.hypot(x-p.x-24,y-p.y-25)<105);}
 free(x:number,y:number,r=20){return !this.props.some(p=>!p.broken&&x>p.x-r&&x<p.x+p.w+r&&y>p.y-r&&y<p.y+p.h+r);}
 route(x:number,y:number,nx:number,ny:number,r=16,tx=nx,ty=ny,key?:object){
  const intersects=(ax:number,ay:number,bx:number,by:number,p:OfficeProp)=>{let lo=0,hi=1;for(const [start,delta,min,max] of [[ax,bx-ax,p.x-r,p.x+p.w+r],[ay,by-ay,p.y-r,p.y+p.h+r]]){if(Math.abs(delta)<.0001){if(start<=min||start>=max)return false;}else{const a=(min-start)/delta,b=(max-start)/delta;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}}return hi>lo&&hi>0&&lo<1;};
  const wall=this.props.filter(p=>!p.broken&&intersects(x,y,tx,ty,p)).sort((a,b)=>Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0];
  if(!wall&&key)this.routes.delete(key);if(wall&&key){const via=this.routes.get(key);if(via){const d=Math.hypot(via.x-x,via.y-y);if(d>3){const step=Math.min(d,Math.hypot(nx-x,ny-y));return this.move(x,y,x+(via.x-x)/d*step,y+(via.y-y)/d*step,r);}this.routes.delete(key);}}if(wall){const margin=r+8,corners=[[wall.x-margin,wall.y-margin],[wall.x+wall.w+margin,wall.y-margin],[wall.x-margin,wall.y+wall.h+margin],[wall.x+wall.w+margin,wall.y+wall.h+margin]].filter(([cx,cy])=>Math.hypot(cx-x,cy-y)>6&&!this.props.some(p=>!p.broken&&intersects(x,y,cx,cy,p))).sort((a,b)=>(Math.hypot(a[0]-x,a[1]-y)+Math.hypot(tx-a[0],ty-a[1]))-(Math.hypot(b[0]-x,b[1]-y)+Math.hypot(tx-b[0],ty-b[1])));if(corners.length){const [cx,cy]=corners[0];if(key)this.routes.set(key,{x:cx,y:cy});const d=Math.hypot(cx-x,cy-y),step=Math.min(d,Math.hypot(nx-x,ny-y));return this.move(x,y,x+(cx-x)/d*step,y+(cy-y)/d*step,r);}}
  return this.move(x,y,nx,ny,r);
 }

 move(x:number,y:number,nx:number,ny:number,r=16){
  const blocked=(a:number,b:number)=>this.props.some(p=>!p.broken&&a>p.x-r&&a<p.x+p.w+r&&b>p.y-r&&b<p.y+p.h+r);
  // Resolve axes separately so a diagonal input slides along furniture.
  const xx=blocked(nx,y)?x:nx;return{x:xx,y:blocked(xx,ny)?y:ny};
 }
 hit(x:number,y:number,damage:number){const p=this.props.find(p=>p.kind!=='desk'&&!p.broken&&x>p.x-12&&x<p.x+p.w+12&&y>p.y-12&&y<p.y+p.h+12);if(!p)return null;p.hp-=damage;if(p.hp<=0)p.broken=true;return p;}
 draw(c:CanvasRenderingContext2D,art?:HTMLImageElement){
  for(const [x,y,w,h,color,label] of [[220,310,400,610,'#526e8640','업무 구역'],[1000,310,390,610,'#6f685d40','탕비실'],[220,550,180,190,'#6c61804a','복사실']] as const){c.fillStyle=color;c.fillRect(x,y,w,h);c.font='bold 17px sans-serif';c.fillStyle='#d1ddd780';c.fillText(label,x+15,y+26);}
  for(const p of this.props){c.save();c.translate(p.x,p.y);if(art?.complete&&art.naturalWidth){const frame=p.broken?(p.kind==='water'?4:3):p.kind==='desk'?0:p.kind==='copier'?1:2,sw=art.naturalWidth/4,sh=art.naturalHeight/2,w=p.kind==='desk'?220:p.broken&&p.kind==='water'?210:110,h=p.kind==='desk'?150:p.broken&&p.kind==='water'?150:125;const inset=frame===1||frame===2?40:0;c.drawImage(art,(frame%4)*sw+inset,Math.floor(frame/4)*sh,sw-inset*2,sh,(p.w-w)/2,p.h-h,w,h);if(p.kind!=='desk'){c.font='11px sans-serif';c.fillStyle='#d6e5ed';c.textAlign='center';c.fillText(p.broken?(p.kind==='water'?'미끄럼 주의':'복사기 퇴사 완료'):p.kind==='copier'?'복사기 · 파괴 가능':'정수기',p.w/2,-70);c.textAlign='start';}c.restore();continue;}if(p.broken){if(p.kind==='water'){c.fillStyle='#90d9ed55';c.beginPath();c.ellipse(24,25,105,70,0,0,Math.PI*2);c.fill();c.strokeStyle='#baedf199';c.stroke();c.fillStyle='#d5f6ff';c.font='12px sans-serif';c.fillText('미끄럼 주의',-13,30);}else{c.fillStyle='#393f4c';c.fillRect(0,15,p.w,p.h-15);c.fillStyle='#dce1db';for(let i=0;i<8;i++)c.fillRect((i*37)%90-10,(i*19)%65,16,10);}c.restore();continue;}
   c.fillStyle='#0c182755';c.fillRect(6,9,p.w,p.h);
   if(p.kind==='desk'){c.fillStyle='#374250';c.fillRect(8,8,p.w-16,p.h);c.fillStyle='#b09271';c.fillRect(0,0,p.w,p.h-8);c.fillStyle='#d1b392';c.fillRect(0,0,p.w,5);for(const x of [20,105]){c.fillStyle='#242e3e';c.fillRect(x,8,49,28);c.fillStyle='#7297a4';c.fillRect(x+4,11,41,20);c.fillStyle='#e8dfca';c.fillRect(x+10,42,31,7);}c.fillStyle='#f1e6ce';c.fillRect(78,12,17,25);}
   else if(p.kind==='copier'){c.fillStyle='#9aa7ad';c.fillRect(0,0,p.w,p.h);c.fillStyle='#e2e4d9';c.fillRect(-3,-6,p.w+6,17);c.fillStyle='#354552';c.fillRect(8,23,48,9);c.fillStyle='#8df3ba';c.fillRect(44,13,10,5);c.fillStyle='#f7efdc';c.fillRect(14,-13,32,16);c.font='11px sans-serif';c.fillStyle='#e6eee5';c.fillText('복사기 · 파괴 가능',-16,-21);}
   else{c.fillStyle='#c2d5dc';c.fillRect(0,10,p.w,p.h-10);c.fillStyle='#70b7d0';c.fillRect(7,-18,34,32);c.fillStyle='#b4ebef';c.fillRect(12,-14,6,23);c.fillStyle='#254551';c.fillRect(11,29,26,17);c.fillStyle='#f0f6ed';c.fillRect(17,38,12,9);c.font='11px sans-serif';c.fillText('정수기',5,-25);}
   c.restore();
  }
 }
}
