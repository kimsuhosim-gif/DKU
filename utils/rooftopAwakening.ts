/** Shared art/timing contract for the model-generated 4x4 awakened atlases. */
export const awakeningVisible=(p:{awakened:number;awakenedSpecial:boolean;specialLeft:number})=>p.awakened>0||(p.awakenedSpecial&&p.specialLeft>0);
export function awakenedCell(p:{alive:boolean;stun:number;down:number;jump:number;guard:number;specialLeft:number;attackDuration:number;poseTime:number;vx:number;vy:number;gait:number},firstPulse:number,windup=.5){
 if(!p.alive||p.stun>0||p.down>0)return 13;
 if(p.specialLeft>0)return p.attackDuration-p.poseTime<firstPulse?14:15;
 if(p.poseTime>0){const t=1-p.poseTime/Math.max(.001,p.attackDuration);const phase=t<windup?t/windup*.5:.5+(t-windup)/(1-windup)*.5;return 4+Math.min(7,Math.floor(phase*8));}
 if(p.jump>0)return 12;
 if(p.guard>0)return 3;
 return Math.hypot(p.vx,p.vy)>20?1+Math.floor(p.gait/2)%2:0;
}
