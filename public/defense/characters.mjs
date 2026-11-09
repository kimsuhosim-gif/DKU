// Four locked keys and eight model-generated in-betweens, plus two baseline frames.
import {WINDUP} from './evolution.mjs';
export const DEFENDERS={
 frost:{id:'F01',name:'서리 연금술사',color:'#a9eaff',file:'crew-v5/frost.png',face:[447,173,323,365],height:144,still:true,description:'감속과 빙결로 시간을 벌거나, 얼어붙은 적을 파쇄하는 새 지원 동료예요.'},
 support:{id:'T01',name:'전술 지원가',color:'#f1dfab',file:'crew-v5/support.png',face:[340,80,410,450],height:144,still:true,description:'주변 동기를 강화해요. 최종 진화에서 화력 지휘와 아지트 수리를 선택해요.'},
 blades:{id:'B02',name:'회전검 수호자',color:'#9ee8d2',file:'characters-v1/B02.png',rect:[90,35,836,1194],root:[625,1229],face:[455,48,440,440],height:144,description:'가까이 몰려든 적을 한꺼번에 베어요. 굽이 안쪽에 배치하면 오래 공격할 수 있어요.'},
 shotgun:{id:'S01',name:'산탄 사수',color:'#efce95',file:'characters-v1/S01.png',rect:[281,12,687,1233],root:[625,1245],face:[435,20,380,420],height:144,description:'앞장선 적과 주변 무리를 산탄으로 공격해요. 적이 뭉치는 길목에 잘 맞아요.'},
 lightning:{id:'E08',name:'전격 기술자',color:'#9ddfe8',file:'characters-v1/E08.png',rect:[245,0,763,1254],root:[625,1250],face:[430,0,405,470],height:144,description:'가까운 적 세 마리까지 전격이 이어져요. 흩어진 적을 정리할 때 좋아요.'}
};
export const MOTION_FILES=Object.fromEntries(Object.entries(DEFENDERS).map(([type,d])=>[type,d.still?d.file:`motion-v3/${d.id}/attack.png`]));
export function poseIndex({actionAge=Infinity,windup=WINDUP,reduced=false,type='blades'}={}){
 if(actionAge<0||!Number.isFinite(actionAge))return 0;
 if(reduced)return actionAge>=windup&&actionAge<windup+.08?5:0;
 if(actionAge<windup)return Math.min(4,Math.floor(actionAge/windup*5));
 const impactHold=type==='lightning'?.085:type==='shotgun'?.025:.045;
 if(actionAge<windup+impactHold)return 5;
 if(actionAge<windup+.29)return Math.min(13,6+Math.floor((actionAge-windup-impactHold)/(.29-impactHold)*8));
 return 0;
}
export function drawDefender(ctx,img,type,x,y,{actionAge=Infinity,windup=WINDUP,direction=1,reduced=false,height=144,followup=false}={}){
 if(DEFENDERS[type].still){const w=height*img.width/img.height;ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.drawImage(img,-w/2,-height,w,height);ctx.restore();return;}
 const scale=height/350,pose=poseIndex({actionAge,windup,reduced,type});
 const index=type==='blades'&&followup&&!reduced&&Number.isFinite(actionAge)&&actionAge<windup+.29?[8,7,6,5,4,3,2,1,10,11,12,13,0,0][pose]:pose;
 // Source blade attacks face left; gun/gauntlet attacks face right.
 const mirror=direction*(type==='blades'?-1:1);
 ctx.save();ctx.translate(x,y);ctx.scale(mirror,1);
 ctx.drawImage(img,index%7*512,Math.floor(index/7)*512,512,512,-256*scale,-450*scale,512*scale,512*scale);
 ctx.restore();
}
export function drawPortrait(ctx,img,type,size=100){const d=DEFENDERS[type],side=Math.max(d.face[2],d.face[3]),x=d.face[0]+(d.face[2]-side)/2,y=d.face[1]+(d.face[3]-side)/2;ctx.clearRect(0,0,size,size);ctx.drawImage(img,x,y,side,side,0,0,size,size);}
