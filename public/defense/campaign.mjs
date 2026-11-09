// Fifty hand-composed wave patterns with deterministic scaling and ten boss gates.
export const TOTAL_WAVES=50;
export const MAX_MASTERY=10;
const themes=[
 {name:'정찰대',pattern:['imp','imp','hound','imp','caster']},
 {name:'질주 무리',pattern:['hound','hound','imp','hound','caster','armored']},
 {name:'중갑 진격',pattern:['armored','imp','armored','caster','hound']},
 {name:'주술사 호위대',pattern:['imp','caster','armored','hound','caster','imp']},
 {name:'수호석 공성대',pattern:['armored','hound','imp','caster','armored','imp']}
];
export const BOSS_NAMES=['문지기 수호석','질주의 수호석','철갑 수호석','주술 수호석','공성 수호석','폭주 수호석','혹한 수호석','파멸 수호석','왕의 근위석','아지트 파괴왕'];
export function waveSpec(w){
 if(!Number.isInteger(w)||w<1||w>TOTAL_WAVES)throw new RangeError('wave must be 1..50');
 const chapter=Math.floor((w-1)/10),boss=w%5===0,theme=themes[(w-1)%5];
 const count=w===1?10:w===2?14:Math.min(54,16+Math.floor(w*.72));
 const queue=Array.from({length:count},(_,i)=>w===1?(i%4===3?'hound':'imp'):theme.pattern[(i+chapter)%theme.pattern.length]);
 if(boss)queue.splice(Math.floor(count*.6),0,'guardian');
 return {wave:w,chapter:chapter+1,name:boss?BOSS_NAMES[w/5-1]:theme.name,boss,queue,
  interval:Math.max(.48,1.2-w*.014),hp:1+.12*(w-1)+.025*(w-1)**2,
  bossHp:(1+w*.10+.018*w*w)*(w===50?.85:1),speed:1+Math.min(.34,(w-1)*.007),
  reward:35+w*4+(boss?60:0)};
}
export const CAMPAIGN_ENEMIES=Array.from({length:TOTAL_WAVES},(_,i)=>waveSpec(i+1).queue.length).reduce((a,b)=>a+b,0);
export function masteryCost(t){return 240+(t.mastery||0)*65;}
export function progressionLabel(t){return t.level<3?`Lv.${t.level}`:`Lv.3 · 숙련 ${t.mastery||0}/${MAX_MASTERY}`;}
