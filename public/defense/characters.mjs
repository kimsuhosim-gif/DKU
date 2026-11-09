// Original roles: 14 frames. Members: three distinct 8-frame whole-body spell clips each.
import {WINDUP} from './evolution.mjs';
import {MEMBER_CLIPS} from './member-motion.mjs';
export {MEMBER_CLIPS};
export const DEFENDERS={
 frost:{id:'jaeho',name:'재호 · 빙결술사',color:'#a9eaff',file:'members-v7/jaeho/portrait.png',face:[310,90,190,215],height:144,memberMotion:true,description:'최재호 · 손끝에서 얼음을 빚는 빙결술사. 한 손 결정탄, 양손 빙정 방출, 머리 위 눈보라 소환으로 길목을 제압해요. 최종 진화는 눈보라와 빙정 파쇄 중 선택해요.'},
 support:{id:'yeonseong',name:'연성 · 수호술사',color:'#f1dfab',file:'members-v7/yeonseong/portrait.png',face:[265,90,190,220],height:144,memberMotion:true,description:'신연성 · 흰 모자와 황금 망토의 수호술사. 양손으로 빛 구체를 쏘고 팔을 펼쳐 강화 결계를 만들어요. 최종 진화는 동료 축복과 아지트 회복 중 선택해요.'},
 blades:{id:'B02',name:'회전검 수호자',color:'#9ee8d2',file:'characters-v1/B02.png',rect:[90,35,836,1194],root:[625,1229],face:[455,48,440,440],height:144,description:'가까이 몰려든 적을 한꺼번에 베어요. 굽이 안쪽에 배치하면 오래 공격할 수 있어요.'},
 shotgun:{id:'S01',name:'산탄 사수',color:'#efce95',file:'characters-v1/S01.png',rect:[281,12,687,1233],root:[625,1245],face:[435,20,380,420],height:144,description:'앞장선 적과 주변 무리를 산탄으로 공격해요. 적이 뭉치는 길목에 잘 맞아요.'},
 lightning:{id:'E08',name:'전격 기술자',color:'#9ddfe8',file:'characters-v1/E08.png',rect:[245,0,763,1254],root:[625,1250],face:[430,0,405,470],height:144,description:'가까운 적 세 마리까지 전격이 이어져요. 흩어진 적을 정리할 때 좋아요.'}
};
export const MOTION_FILES=Object.fromEntries(Object.entries(DEFENDERS).map(([type,d])=>[type,d.memberMotion?`members-v7/${d.id}/bolt.png`:`motion-v3/${d.id}/attack.png`]));
export const MOTION_ASSETS=[...new Set([...Object.values(MOTION_FILES),...Object.values(MEMBER_CLIPS).flatMap(clips=>Object.values(clips).map(c=>c.file))])];
export function motionClip(type,{skill=null,level=1,castIndex=1}={}){
 if(type==='frost')return skill==='blizzard'?'storm':skill==='shatter'||(level>=2&&castIndex%2===0)?'fan':'bolt';
 if(type==='support')return skill==='repair'?'bless':skill==='rally'||(level>=2&&castIndex%2===0)?'ward':'bolt';
 return 'attack';
}
export function motionFile(type,options={}){const d=DEFENDERS[type];return d.memberMotion?MEMBER_CLIPS[d.id][motionClip(type,options)].file:MOTION_FILES[type];}
export function memberHands(type,options={}){
 const d=DEFENDERS[type];if(!d?.memberMotion)return [];
 const p=poseIndex({...options,type}),clip=motionClip(type,options),scale=(options.height||166)/350;
 return MEMBER_CLIPS[d.id][clip].hands[p].map(([x,y])=>({x:(x-256)*scale*(options.direction||1),y:(y-450)*scale}));
}
export function poseIndex({actionAge=Infinity,windup=WINDUP,reduced=false,type='blades'}={}){
 if(actionAge<0||!Number.isFinite(actionAge))return 0;
 if(DEFENDERS[type]?.memberMotion){if(reduced)return actionAge>=windup&&actionAge<windup+.12?3:0;if(actionAge<windup)return actionAge<windup*.5?1:2;const t=actionAge-windup;if(t<.07)return 3;if(t<.16)return 4;if(t<.25)return 5;if(t<.34)return 6;if(t<.4)return 7;return 0;}
 if(reduced)return actionAge>=windup&&actionAge<windup+.08?5:0;
 if(actionAge<windup)return Math.min(4,Math.floor(actionAge/windup*5));
 const impactHold=type==='lightning'?.085:type==='shotgun'?.025:.045;
 if(actionAge<windup+impactHold)return 5;
 if(actionAge<windup+.29)return Math.min(13,6+Math.floor((actionAge-windup-impactHold)/(.29-impactHold)*8));
 return 0;
}
export function drawDefender(ctx,img,type,x,y,{actionAge=Infinity,windup=WINDUP,direction=1,reduced=false,height=144,followup=false}={}){
 if(DEFENDERS[type].memberMotion){const scale=height/350,pose=poseIndex({actionAge,windup,reduced,type});ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.drawImage(img,pose%4*512,Math.floor(pose/4)*512,512,512,-256*scale,-450*scale,512*scale,512*scale);ctx.restore();return;}
 const scale=height/350,pose=poseIndex({actionAge,windup,reduced,type});
 const index=type==='blades'&&followup&&!reduced&&Number.isFinite(actionAge)&&actionAge<windup+.29?[8,7,6,5,4,3,2,1,10,11,12,13,0,0][pose]:pose;
 // Source blade attacks face left; gun/gauntlet attacks face right.
 const mirror=direction*(type==='blades'?-1:1);
 ctx.save();ctx.translate(x,y);ctx.scale(mirror,1);
 ctx.drawImage(img,index%7*512,Math.floor(index/7)*512,512,512,-256*scale,-450*scale,512*scale,512*scale);
 ctx.restore();
}
export function drawPortrait(ctx,img,type,size=100){const d=DEFENDERS[type],side=Math.max(d.face[2],d.face[3]),x=d.face[0]+(d.face[2]-side)/2,y=d.face[1]+(d.face[3]-side)/2;ctx.clearRect(0,0,size,size);ctx.drawImage(img,x,y,side,side,0,0,size,size);}
