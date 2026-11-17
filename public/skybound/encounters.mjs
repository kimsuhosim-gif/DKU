// Timed formations provide readable attack / breathing / approach phases.
export const FORMATIONS=['spear','wave','cross','rank','escort','dive'];
export function encounterAt(stage,index,duration,route){
 const count=stage<2?10:12,interval=(duration-7)/count;
 if(index>=count)return null;
 const formation=FORMATIONS[(index+stage+(route==='gorge'?2:0))%FORMATIONS.length];
 return {time:1.6+index*interval,formation,index,count:formation==='escort'?5:formation==='cross'?6:4+(stage>=4?1:0)};
}
export function formationSlots(wave,stage){
 const count=wave.count,flip=wave.index%2===1,cy=flip?350:175;
 return Array.from({length:count},(_,i)=>{
  let kind=i%3,x=1010+i*64,y=cy,flight=wave.formation,vy=0;
  if(flight==='spear'){kind=0;y=270+(i-(count-1)/2)*49;x=1000+Math.abs(i-(count-1)/2)*60;}
  if(flight==='wave'){kind=1;y=cy+(i%2)*42;x=1000+i*70;}
  if(flight==='cross'){kind=0;y=i%2?430:100;vy=i%2?-55:55;x=1000+Math.floor(i/2)*100;}
  if(flight==='rank'){kind=2;y=100+i*95;x=1020+(i%2)*55;}
  if(flight==='escort'){kind=i===2?2:0;y=270+(i-2)*58;x=1050+Math.abs(i-2)*52;}
  if(flight==='dive'){kind=1;y=flip?85:455;vy=flip?70:-70;x=1000+i*95;}
  return {kind,x,y,flight,vy,phase:i*.55,vx:(flight==='dive'?190:flight==='rank'?90:140)+stage*5};
 });
}
