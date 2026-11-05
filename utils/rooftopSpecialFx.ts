import atlas from '../public/images/rooftop-fx/specials/manifest.json';
type Key=keyof typeof atlas;
const keys:Key[]=['cannon','homerun','thunder','rush','lance','counter'];
const images=new Map<Key,HTMLImageElement>();let loading:Promise<void>|undefined;
export function loadSpecialFx(){return loading??=Promise.all((Object.keys(atlas) as Key[]).map(key=>new Promise<void>(resolve=>{const img=new Image();img.onload=()=>{images.set(key,img);resolve();};img.onerror=()=>resolve();img.src=`/images/rooftop-fx/specials/${key}.png`;}))).then(()=>{});}
export function fxFrame(key:Key,t:number){const a=atlas[key];return Math.min(a.last,a.first+Math.floor(Math.max(0,Math.min(.999,t))*(a.last-a.first+1)));}
function draw(c:CanvasRenderingContext2D,key:Key,t:number,alpha=1,size=1){const img=images.get(key);if(!img)return false;const a=atlas[key],f=fxFrame(key,t),s=a.scale*size;c.save();c.globalAlpha*=alpha;c.imageSmoothingEnabled=false;c.drawImage(img,(f%a.columns)*a.width,Math.floor(f/a.columns)*a.height,a.width,a.height,-a.pivot[0]*s,-a.pivot[1]*s,a.width*s,a.height*s);c.restore();return true;}
export function drawChargeFx(c:CanvasRenderingContext2D,t:number,reduced:boolean){return draw(c,'charge',reduced?.35:t,.65, .7+Math.min(1,t)*.3);}
export function drawSpecialFx(c:CanvasRenderingContext2D,cast:number,age:number,reduced:boolean){
 const t=Math.max(0,Math.min(1,age/.65));if(t>=1)return true;
 c.save();const alpha=reduced?.65:Math.min(1,(1-t)*4);
 // The red lance travels along the attack direction; its tip stays within attack reach.
 if(cast===4)c.translate(reduced?260:150+t*190,0);
 if(cast===2)c.translate(75,0);
 if(cast===3)c.translate(45,-8);
 if(cast===5)c.translate(55,0);
 // Hold the first bright stroke, then decay; never replay the original multi-flash thunder sequence.
 const frameTime=cast===2?(t<.45?0:.38+(t-.45)/.55*.62):Math.pow(t,1.8);
 const ok=draw(c,keys[cast],reduced?0:frameTime,alpha,cast===3?1.2:cast===5?1.15:1);c.restore();return ok;
}
