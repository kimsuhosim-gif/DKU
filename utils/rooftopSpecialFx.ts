import atlas from '../public/images/rooftop-fx/specials/manifest.json';
type Key=keyof typeof atlas;
const keys:Key[]=['cannon','homerun','counter','rush','lance','thunder'];
const images=new Map<Key,HTMLImageElement>();let loading:Promise<void>|undefined;
export function loadSpecialFx(){return loading??=Promise.all((Object.keys(atlas) as Key[]).map(key=>new Promise<void>(resolve=>{const img=new Image();img.onload=()=>{images.set(key,img);resolve();};img.onerror=()=>resolve();img.src=`/images/rooftop-fx/specials/${key}.png`;}))).then(()=>{});}
export function fxFrame(key:Key,t:number){const a=atlas[key];return Math.min(a.last,a.first+Math.floor(Math.max(0,Math.min(.999,t))*(a.last-a.first+1)));}
function draw(c:CanvasRenderingContext2D,key:Key,t:number,alpha=1,size=1){const img=images.get(key);if(!img)return false;const a=atlas[key],f=fxFrame(key,t),s=a.scale*size;c.save();c.globalAlpha*=alpha;c.imageSmoothingEnabled=false;c.drawImage(img,(f%a.columns)*a.width,Math.floor(f/a.columns)*a.height,a.width,a.height,-a.pivot[0]*s,-a.pivot[1]*s,a.width*s,a.height*s);c.restore();return true;}
export function drawChargeFx(c:CanvasRenderingContext2D,t:number,reduced:boolean){return draw(c,'charge',reduced?.35:t,.65, .7+Math.min(1,t)*.3);}
export function drawSpecialFx(c:CanvasRenderingContext2D,cast:number,age:number,reduced:boolean,range=520,awakened=false){
 if(cast===2)return false; // Sword uses the directional cyan crescent, not stock counter rings.
 if(cast===6&&awakened){
  const t=age/.48;if(t>=1)return true;
  c.save();c.globalAlpha=(1-t)*(reduced?.65:1);const end=Math.max(16,range*1.1-100);
  c.strokeStyle='#cf641f';c.lineWidth=34*(1-t)+8;c.beginPath();c.moveTo(0,0);c.lineTo(end,0);c.stroke();
  c.strokeStyle='#ffcd67';c.lineWidth=19*(1-t)+4;c.stroke();c.strokeStyle='#fff5cb';c.lineWidth=7*(1-t)+2;c.stroke();
  c.strokeStyle='#ffe4a1';c.lineWidth=4;c.beginPath();c.ellipse(0,0,12+t*24,28+t*42,0,0,Math.PI*2);c.stroke();
  if(!reduced){c.beginPath();c.ellipse(end,0,18+t*36,25+t*60,0,0,Math.PI*2);c.stroke();}
  c.restore();return true;
 }
 if(cast===6){
  if(age>.14)return true;
  c.save();c.globalAlpha=(1-age/.14)*(reduced?.55:1);
  const end=Math.max(12,range*1.1-100),muzzle=0;
  c.strokeStyle='#ffb52e';c.lineWidth=6;c.beginPath();c.moveTo(muzzle,0);c.lineTo(end,0);c.stroke();
  c.strokeStyle='#fff8c7';c.lineWidth=2;c.stroke();
  c.fillStyle='#ffca54';c.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,r=i%2?8:25;c.lineTo(muzzle+Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();
  c.fillStyle='#fffbe5';c.fillRect(muzzle-6,-6,12,12);c.restore();return true;
 }
 const t=Math.max(0,Math.min(1,age/.65));if(t>=1)return true;
 c.save();const alpha=reduced?.65:Math.min(1,(1-t)*4);
 // The red lance travels along the attack direction; its tip stays within attack reach.
 if(cast===4)c.translate(reduced?260:150+t*190,0);
 if(cast===5)c.translate(75,0);
 if(cast===3)c.translate(45,-8);

 // Thicken energy perpendicular to travel, preserving beam and spear reach.
 // Circular/slashing effects expand around their existing weapon pivot.
 if(cast===0)c.scale(1,2.2);
 else if(cast===4)c.scale(1,2);
 else if(cast===1)c.scale(1.3,1.6);
 else if(cast===3)c.scale(1.25,1.45);
 else if(cast===2)c.scale(1.35,1.35);
 // Hold the first bright stroke, then decay; never replay the original multi-flash thunder sequence.
 const frameTime=cast===5?(t<.45?0:.38+(t-.45)/.55*.62):Math.pow(t,1.8);
 const ok=draw(c,keys[cast],reduced?0:frameTime,alpha,cast===3?1.2:cast===5?1.15:1);c.restore();return ok;
}
