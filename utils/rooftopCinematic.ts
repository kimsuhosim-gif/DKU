import {CAST,SPECIALS,WEAPONS} from './rooftopModel';

export type SuperCue={cast:number;life:number};
export const SUPER_CUE_SECONDS=.46;

/** Screen-space intro: one short dark band, never a repeated full-screen flash. */
export function superCutIn(c:CanvasRenderingContext2D,w:number,h:number,cue:SuperCue,image:HTMLImageElement|undefined,reduced:boolean){
 const t=Math.max(0,Math.min(1,1-cue.life/SUPER_CUE_SECONDS));
 const fade=Math.min(1,(1-t)*5),color=WEAPONS[cue.cast].color;
 const bh=Math.min(150,h*.29),y=Math.max(58,h*.26),slide=reduced?0:Math.pow(1-Math.min(1,t*6),3)*w*.35;
 c.save();c.globalAlpha=fade;c.translate(-slide,y);
 c.fillStyle='#050d20';c.fillRect(0,0,w,bh);
 const gradient=c.createLinearGradient(0,0,w,0);gradient.addColorStop(0,color);gradient.addColorStop(.55,'#142334');gradient.addColorStop(1,'#050d20');
 c.globalAlpha=fade*.65;c.fillStyle=gradient;c.fillRect(0,0,w,bh);c.globalAlpha=fade;
 c.fillStyle=color;c.fillRect(0,0,w,3);c.fillRect(0,bh-3,w,3);
 c.save();c.beginPath();c.rect(0,3,w,bh-6);c.clip();
 if(!reduced){c.strokeStyle=color;c.lineWidth=2;c.globalAlpha=fade*.45;for(let i=0;i<12;i++){const sy=(i*37)%bh;const x=((i*127+t*700)%(w+180))-180;c.beginPath();c.moveTo(x,sy);c.lineTo(x+95+(i%3)*28,sy);c.stroke();}c.globalAlpha=fade;}
 // Reuse the actual fighter artwork, keeping its palette and face consistent.
 if(image){const sw=image.width/4,sh=image.height/2,size=bh*2.3;const inset=cue.cast===6;c.drawImage(image,inset?sw/6:0,inset?sh*.313:0,inset?sw/1.5:sw,inset?sh/1.5:sh,-bh*.36,bh*.04,size*.75,size);}
 c.restore();
 const textX=Math.max(w*.37,bh*.95),available=w-textX-12;
 c.textAlign='left';c.textBaseline='middle';c.fillStyle=color;c.font=`900 ${Math.min(14,available/13)}px sans-serif`;c.fillText('SUPER SPECIAL',textX,bh*.25);
 c.font=`900 ${Math.min(34,available/(SPECIALS[cue.cast].name.length*.95))}px sans-serif`;c.lineWidth=4;c.strokeStyle='#06101e';c.strokeText(SPECIALS[cue.cast].name,textX,bh*.52);c.fillStyle='#fff7dc';c.fillText(SPECIALS[cue.cast].name,textX,bh*.52);
 c.font=`700 ${Math.min(15,available/9)}px sans-serif`;c.fillStyle='#dbe8ee';c.fillText(CAST[cue.cast].name,textX,bh*.78);c.restore();
}

/** Large local hit rays appear only on confirmed special damage. */
export function superContact(c:CanvasRenderingContext2D,age:number,color:string,reduced:boolean){
 if(age<0||age>.34)return;
 const t=age/.34;c.save();c.globalAlpha=(1-t)*.9;
 c.strokeStyle='#102035';c.lineWidth=9;c.beginPath();
 const rays=(stroke:string,width:number)=>{c.strokeStyle=stroke;c.lineWidth=width;c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5+.12,r=25+t*50,len=(i%2?70:115)*(1-t*.25);c.moveTo(Math.cos(a)*r,Math.sin(a)*r*.65);c.lineTo(Math.cos(a)*(r+len),Math.sin(a)*(r+len)*.65);}c.stroke();};
 rays('#102035',9);rays(color,5);rays('#fff7ce',2);
 if(!reduced){c.strokeStyle=color;c.lineWidth=5*(1-t);c.beginPath();c.ellipse(0,0,40+t*125,25+t*75,0,0,Math.PI*2);c.stroke();}
 c.restore();
}
