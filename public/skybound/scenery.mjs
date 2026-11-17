// Authored scenery motion. All landmarks are non-colliding background objects.
export const SCENES = [
 {label:'운해 항로',props:[1,2,1],speed:96,tint:'#eebd7a'},
 {label:'월하 협곡',props:[5,1,3],speed:104,tint:'#93dce7'},
 {label:'천풍 사원',props:[2,5,2],speed:114,tint:'#d5e6b0'},
 {label:'홍련 외성',props:[4,2,4],speed:108,tint:'#ffb57f'},
 {label:'별빛 유적',props:[5,3,5],speed:118,tint:'#bbcdff'},
 {label:'공중 요새',props:[4,4,2],speed:126,tint:'#eeac9f'},
 {label:'일식 왕좌',props:[5,4,5],speed:132,tint:'#f3ba83'}
];
export function sceneState(stage,time,duration,route=null,reduced=false){
 const cfg=SCENES[stage],t=Math.max(0,time),bossAt=Math.max(0,duration-2);
 // Integrate slowdown rather than changing a speed multiplier (which would jump).
 const distance=cfg.speed*(Math.min(t,bossAt)+Math.max(0,t-bossAt)*.28);
 return {distance,far:reduced?0:distance*.31,mid:reduced?0:distance*.84,near:reduced?0:distance*1.65,
  district:Math.min(2,Math.floor(t/duration*3)),route,label:cfg.label,progress:Math.min(1,t/duration)};
}
function panorama(ctx,im,offset,w,h){
 const width=im.width*h/im.height,first=Math.floor(offset/width),x=-(offset%width);
 // Mirror neighboring tiles so the edges meet at exactly the same image column.
 for(let n=0;n<Math.ceil(w/width)+2;n++){ctx.save();ctx.translate(x+n*width,0);if((first+n)%2){ctx.translate(width,0);ctx.scale(-1,1);}ctx.drawImage(im,0,0,width+1,h);ctx.restore();}
}
function prop(ctx,atlas,index,x,y,size,alpha=1,flip=false){ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.drawImage(atlas,index%3*512,Math.floor(index/3)*512,512,512,-size/2,-size/2,size,size);ctx.restore();}
export function drawScenery(ctx,images,s,stages,reduced=false){
 const cfg=SCENES[s.stage],st=stages[s.stage],v=sceneState(s.stage,s.stageTime,st.duration,s.route,reduced);
 let bg=st.bg;if(s.stage===3&&s.route)bg=s.route==='sky'?0:1;
 panorama(ctx,images[`bg-${bg}`],v.far,960,540);
 ctx.fillStyle='#06132325';ctx.fillRect(0,0,960,540);
 const atlas=images.scenery;
 if(atlas){
  // Distant cloudbank: a slow, broad layer behind the landmarks.
  const gap=720,start=Math.floor(v.mid*.4/gap);
  for(let i=-1;i<3;i++){const k=start+i,x=k*gap-v.mid*.4;prop(ctx,atlas,0,x,90+(k%2)*48,680,.23,k%2===0);}
  // A route through visible landmarks, with different density in each district.
  const spacing=560,first=Math.floor(v.mid/spacing);
  for(let i=0;i<4;i++){const k=first+i,x=k*spacing-v.mid+180;const index=cfg.props[k%3];
   const size=260+(k%3)*40, y=k%3===1?40:540+(k%2)*35;
   prop(ctx,atlas,index,x,y,size,index===3?.55:.82,k%2===1);
  }
  const nearGap=1050,nearFirst=Math.floor(v.near/nearGap);
  for(let i=0;i<3;i++){const k=nearFirst+i,x=k*nearGap-v.near+520;
   prop(ctx,atlas,s.stage%2===0?0:3,x,k%2?568:-100,s.stage%2===0?790:350,.45,k%2===1);
  }
 }
 // Gentle vertical readability shading; gameplay bullets are drawn above it.
 const shade=ctx.createLinearGradient(0,0,0,540);shade.addColorStop(0,'#07131d55');shade.addColorStop(.2,'#07131d00');shade.addColorStop(.8,'#07131d00');shade.addColorStop(1,'#07131d66');ctx.fillStyle=shade;ctx.fillRect(0,0,960,540);
 return v;
}
