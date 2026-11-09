// V5: five roles and ten mutually exclusive final evolutions.
export const INTERMISSION_SECONDS = 6;
export const NEW_WEAPONS = {
 frost: {name:'재호 · 빙결술사',cost:65,range:265,damage:18,interval:1.15,icon:'frost',fx:1},
 support: {name:'연성 · 수호술사',cost:65,range:240,damage:14,interval:1.1,icon:'support',fx:1}
};
export const NEW_EVOLUTIONS = {
 frost: [
  {name:'서리 결정탄',short:'단일 공격 · 35% 감속',description:'서리 결정탄으로 적 한 명을 공격하고 1.2초간 35% 감속.',color:'#9deaff'},
  {name:'빙결 파편',short:'주변 3명 · 45% 감속',description:'목표 주변 3명에게 파편 피해. 1.5초간 45% 감속.',color:'#a9f3ff'},
  {name:'백야의 눈보라',short:'4회마다 광역 눈보라',description:'4번째 공격마다 반경 180 눈보라. 4회 피해와 짧은 빙결로 길목을 막는다.',color:'#cefaff',every:4,skill:'blizzard'}
 ],
 support: [
  {name:'빛 구체',short:'주변 동기 피해 +15%',description:'손에서 빚은 빛 구체로 공격. 반경 370 안의 다른 동기에게 피해 +15%. 지원 효과는 중첩되지 않는다.',color:'#d8eaa1'},
  {name:'황금 결계',short:'피해 +20% · 공격속도 +15%',description:'주변 동기 피해 +20%, 공격속도 +15%. 본인과 다른 지원가에게는 적용하지 않는다.',color:'#e3f3aa'},
  {name:'수호자의 축복',short:'주변 피해 +30% · 축복 해방',description:'주변 동기 피해 +30%, 공격속도 +20%. 3번째 공격마다 2.5초 동안 전체 전투 동기의 피해 +40%, 공격속도 +25%.',color:'#ffe39d',every:3,skill:'rally'}
 ]
};
export const ALTERNATE_EVOLUTIONS = {
 shotgun:{name:'철갑 관통탄',short:'3회마다 보스 집중 관통',description:'3번째 공격마다 목표에게 380% 피해, 뒤쪽 직선의 적에게 140% 피해. 중갑을 관통한다.',color:'#ffc2a4',every:3,skill:'piercing'},
 blades:{name:'심판의 일격',short:'4회마다 단일 처형',description:'4번째 공격마다 목표에게 320% 피해. 체력이 35% 이하인 적에게는 600% 피해. 보스 집중형.',color:'#f7c1ef',every:4,skill:'execution'},
 lightning:{name:'플라즈마 표식',short:'3회마다 7명 취약 표식',description:'3번째 공격마다 최대 7명에게 연쇄 전격. 맞은 적은 2초간 모든 받는 피해가 25% 증가한다.',color:'#e4baff',every:3,skill:'plasma'},
 frost:{name:'빙정 파쇄',short:'4회마다 감속 적 폭쇄',description:'4번째 공격마다 목표와 반경 110의 적에게 200% 피해. 감속된 적에게 420% 피해. 동료의 감속과 연계.',color:'#8cdbff',every:4,skill:'shatter'},
 support:{name:'아지트 파수꾼',short:'3회마다 기지 6 회복',description:'주변 동기 피해 +20%, 공격속도 +15%. 3번째 공격마다 기지 내구도 6 회복. 최대 내구도를 넘지 않는다.',color:'#baffc7',every:3,skill:'repair'}
};
export const BRANCH_LABELS={primary:'광역·연계',alternate:'집중·특화'};
export function branchOptions(type,primary){return [{id:'primary',...primary},{id:'alternate',...ALTERNATE_EVOLUTIONS[type]}];}
export function applyChill(g,e,seconds,factor){
 const active=e.chillUntil>g.time;
 e.chillUntil=Math.max(e.chillUntil||0,g.time+seconds);
 e.chillFactor=Math.min(active?(e.chillFactor??1):1,factor);
 g.telemetry.expansion.chills++;
}
export function refreshSupport(g){
 for(const t of g.towers)if(t)t.buff={damage:1,haste:1};
 g.towers.forEach((s,i)=>{
  if(!s||s.type!=='support')return;
  const strong=s.level===3&&s.branch!=='alternate';
  g.towers.forEach((t,j)=>{
   if(!t||t.type==='support'||Math.hypot(g.positions[i].x-g.positions[j].x,g.positions[i].y-g.positions[j].y)>370)return;
   t.buff.damage=Math.max(t.buff.damage,strong?1.3:s.level>=2?1.2:1.15);
   t.buff.haste=Math.max(t.buff.haste,strong?1.2:s.level>=2?1.15:1);
  });
 });
 if(g.rallyUntil>g.time)for(const t of g.towers)if(t&&t.type!=='support'){
  t.buff.damage=Math.max(t.buff.damage,1.4);t.buff.haste=Math.max(t.buff.haste,1.25);
 }
}
