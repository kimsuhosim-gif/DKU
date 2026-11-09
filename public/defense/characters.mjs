// Four locked keys and eight model-generated in-betweens, plus two baseline frames.
import {WINDUP} from './evolution.mjs';
export const DEFENDERS={
 frost:{id:'jaeho',name:'재호 · 냉기 사수',color:'#a9eaff',file:'members-v6/jaeho/portrait.png',face:[186,100,142,150],height:144,memberMotion:true,description:'최재호 · 검은 모자와 조끼의 냉기 사수. 조준·사격·반동으로 빙결탄을 날려요. 눈보라 제압과 빙정 파쇄 중 선택해요.'},
 support:{id:'yeonseong',name:'연성 · 전술 창술사',color:'#f1dfab',file:'members-v6/yeonseong/portrait.png',face:[209,100,148,155],height:144,memberMotion:true,description:'신연성 · 흰 모자와 와인색 재킷의 전술 창술사. 창을 찔러 황금 파동을 보내고 동기를 강화해요. 돌격 지휘와 아지트 회복 중 선택해요.'},
 blades:{id:'B02',name:'회전검 수호자',color:'#9ee8d2',file:'characters-v1/B02.png',rect:[90,35,836,1194],root:[625,1229],face:[455,48,440,440],height:144,description:'가까이 몰려든 적을 한꺼번에 베어요. 굽이 안쪽에 배치하면 오래 공격할 수 있어요.'},
 shotgun:{id:'S01',name:'산탄 사수',color:'#efce95',file:'characters-v1/S01.png',rect:[281,12,687,1233],root:[625,1245],face:[435,20,380,420],height:144,description:'앞장선 적과 주변 무리를 산탄으로 공격해요. 적이 뭉치는 길목에 잘 맞아요.'},
 lightning:{id:'E08',name:'전격 기술자',color:'#9ddfe8',file:'characters-v1/E08.png',rect:[245,0,763,1254],root:[625,1250],face:[430,0,405,470],height:144,description:'가까운 적 세 마리까지 전격이 이어져요. 흩어진 적을 정리할 때 좋아요.'}
};
export const MOTION_FILES=Object.fromEntries(Object.entries(DEFENDERS).map(([type,d])=>[type,d.memberMotion?`members-v6/${d.id}/attack.png`:`motion-v3/${d.id}/attack.png`]));
export function poseIndex({actionAge=Infinity,windup=WINDUP,reduced=false,type='blades'}={}){
 if(actionAge<0||!Number.isFinite(actionAge))return 0;
 if(DEFENDERS[type]?.memberMotion){if(reduced)return actionAge>=windup&&actionAge<windup+.1?2:0;if(actionAge<windup)return 1;if(actionAge<windup+.09)return 2;if(actionAge<windup+.20)return 3;if(actionAge<windup+.38)return 4;return 0;}
 if(reduced)return actionAge>=windup&&actionAge<windup+.08?5:0;
 if(actionAge<windup)return Math.min(4,Math.floor(actionAge/windup*5));
 const impactHold=type==='lightning'?.085:type==='shotgun'?.025:.045;
 if(actionAge<windup+impactHold)return 5;
 if(actionAge<windup+.29)return Math.min(13,6+Math.floor((actionAge-windup-impactHold)/(.29-impactHold)*8));
 return 0;
}
export function drawDefender(ctx,img,type,x,y,{actionAge=Infinity,windup=WINDUP,direction=1,reduced=false,height=144,followup=false}={}){
 if(DEFENDERS[type].memberMotion){const scale=height/350,pose=poseIndex({actionAge,windup,reduced,type});ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.drawImage(img,pose%3*768,Math.floor(pose/3)*768,768,768,-384*scale,-650*scale,768*scale,768*scale);ctx.restore();return;}
 const scale=height/350,pose=poseIndex({actionAge,windup,reduced,type});
 const index=type==='blades'&&followup&&!reduced&&Number.isFinite(actionAge)&&actionAge<windup+.29?[8,7,6,5,4,3,2,1,10,11,12,13,0,0][pose]:pose;
 // Source blade attacks face left; gun/gauntlet attacks face right.
 const mirror=direction*(type==='blades'?-1:1);
 ctx.save();ctx.translate(x,y);ctx.scale(mirror,1);
 ctx.drawImage(img,index%7*512,Math.floor(index/7)*512,512,512,-256*scale,-450*scale,512*scale,512*scale);
 ctx.restore();
}
export function drawPortrait(ctx,img,type,size=100){const d=DEFENDERS[type],side=Math.max(d.face[2],d.face[3]),x=d.face[0]+(d.face[2]-side)/2,y=d.face[1]+(d.face[3]-side)/2;ctx.clearRect(0,0,size,size);ctx.drawImage(img,x,y,side,side,0,0,size,size);}
