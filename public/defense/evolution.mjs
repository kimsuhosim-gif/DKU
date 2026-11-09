// Shared by rules, UI and tests. Names are game design, not claims about the real people.
import {NEW_EVOLUTIONS,ALTERNATE_EVOLUTIONS} from './expansion.mjs';
export const EVOLUTIONS={...NEW_EVOLUTIONS,
 shotgun:[
  {name:'산탄 사격',description:'밀집한 적 최대 3마리에게 산탄 사격.',short:'산탄 사격',color:'#e7c88a'},
  {name:'더블 배럴',description:'첫 사격 뒤 0.23초 후 두 번째 산탄. 후속탄 피해 60%.',short:'시간차 2연사',color:'#f5b763'},
  {name:'파열탄',description:'2연사를 유지하고 3번째 공격마다 반경 120의 폭발탄. 주 타깃 240%, 주변 150% 피해.',short:'3회마다 폭발탄',color:'#ff9b61',every:3,skill:'explosive'}
 ],
 blades:[
  {name:'반월 베기',description:'사거리 안의 모든 적을 한 번 벤다.',short:'주변 베기',color:'#8fe0bf'},
  {name:'교차 연격',description:'0.23초 후 되돌려 베기. 두 번째 타격은 60% 피해.',short:'주변 2연격',color:'#6cf0b9'},
  {name:'수호 검진',description:'2연격을 유지하고 4번째 공격마다 검진. 1.4초 동안 반경 225에 4회 추가 타격.',short:'4회마다 회전 검진',color:'#c5f99b',every:4,skill:'orbit'}
 ],
 lightning:[
  {name:'연쇄 전격',description:'가까운 적 최대 3마리에게 이어지는 전격.',short:'3마리 연쇄',color:'#8cd9e4'},
  {name:'서리 전류',description:'최대 5마리 연쇄. 맞은 적은 0.8초 동안 이동속도 30% 감소.',short:'5마리＋감속',color:'#82edff'},
  {name:'낙뢰 지대',description:'5마리 연쇄를 유지하고 3번째 공격마다 낙뢰 지대. 반경 125에 4회 낙뢰와 짧은 기절.',short:'3회마다 반복 낙뢰',color:'#b9b3ff',every:3,skill:'storm'}
 ]
};
export function evolution(type,level,branch='primary'){return level===3&&branch==='alternate'?ALTERNATE_EVOLUTIONS[type]:EVOLUTIONS[type]?.[Math.max(0,Math.min(2,level-1))];}
export const WINDUP=.11;
export const SKILL_WINDUP=.23;
export const FOLLOWUP_DELAY=.23;
export const ATTACK_DURATION=.4;
