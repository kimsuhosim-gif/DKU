import {NEW_WEAPONS} from './expansion.mjs';
export const DT=1/60;
export const WORLD={width:1024,height:1536};
export const ROUTE=[[0,1275],[815,1275],[850,1267],[879,1245],[899,1215],[905,1180],[905,1130],[899,1095],[879,1065],[850,1045],[815,1038],[205,1038],[170,1030],[140,1010],[120,980],[115,945],[115,925],[120,890],[140,860],[170,838],[205,830],[815,830],[850,822],[880,800],[899,770],[905,735],[905,725],[899,690],[880,660],[850,638],[815,630],[205,630],[170,622],[140,600],[120,570],[115,535],[115,525],[120,490],[140,460],[170,438],[205,430],[430,430],[462,422],[490,400],[506,375],[512,345],[512,310]];
export const SLOTS=[{x:350,y:1155},{x:700,y:1155},{x:350,y:935},{x:700,y:935},{x:350,y:730},{x:700,y:730},{x:350,y:530},{x:700,y:530}];
export const WEAPONS={...NEW_WEAPONS,shotgun:{name:'산탄포',cost:60,range:235,damage:24,interval:.9,icon:'shotgun',fx:0},lightning:{name:'전격탑',cost:70,range:255,damage:24,interval:1.05,icon:'lightning-gauntlet',fx:1},blades:{name:'회전검진',cost:55,range:205,damage:13,interval:.48,icon:'orbit-blades',fx:2}};
export const ENEMIES={imp:{hp:55,speed:88,damage:4,reward:12,height:70},hound:{hp:43,speed:125,damage:3,reward:12,height:67},caster:{hp:100,speed:68,damage:6,reward:18,height:88},guardian:{hp:1500,speed:46,damage:13,reward:90,height:150}};
const segments=ROUTE.slice(1).map((b,i)=>{const a=ROUTE[i];return {a,b,length:Math.hypot(b[0]-a[0],b[1]-a[1])};});
export const ROUTE_LENGTH=segments.reduce((s,p)=>s+p.length,0);
export function routePoint(distance){if(distance>=ROUTE_LENGTH)return {x:512,y:310,angle:-Math.PI/2};let d=Math.max(0,distance);for(const s of segments){if(d<=s.length){const t=d/s.length;return {x:s.a[0]+(s.b[0]-s.a[0])*t,y:s.a[1]+(s.b[1]-s.a[1])*t,angle:Math.atan2(s.b[1]-s.a[1],s.b[0]-s.a[0])};}d-=s.length;}return {x:512,y:310,angle:-Math.PI/2};}
export function distanceToRoute(x,y){return Math.min(...segments.map(s=>{const vx=s.b[0]-s.a[0],vy=s.b[1]-s.a[1];const t=Math.max(0,Math.min(1,((x-s.a[0])*vx+(y-s.a[1])*vy)/(s.length*s.length)));return Math.hypot(x-s.a[0]-t*vx,y-s.a[1]-t*vy);}));}
