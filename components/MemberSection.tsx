import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Phone, Search, Trophy, Swords, Shuffle, ChevronDown } from 'lucide-react';
import { records } from '../utils/golfData';
import { golfers, bestScore, badgesFor } from '../utils/memberClub';
import { PlayerDialog, ScoreTrend } from './PlayerCardDetails';
import { RivalComparison, GroupDraw } from './MemberPlayground';

export default function MemberSection({onBack}: {onBack: () => void}) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'cards' | 'rivals' | 'draw'>('cards');
  const [sort, setSort] = useState('name');
  const [expanded,setExpanded]=useState<string|null>(null);
  const [compare,setCompare]=useState<string[]>([]);
  const [pair,setPair]=useState<string[]>([]);
  const reduce = useReducedMotion();
  const filtered = golfers.filter(m => m.name.includes(query.trim())).slice().sort((a,b) => sort === 'score' ? a.grossRankValue-b.grossRankValue : sort === 'rounds' ? b.roundCount-a.roundCount || a.name.localeCompare(b.name,'ko') : a.name.localeCompare(b.name,'ko'));
  return <div className="club-container inner-page members-club">
    <header className="members-intro"><div><span className="eyebrow">THE PLAYERS' CLUB · RE09</span><h1>좋은 골프는,<br/><em>좋은 동기들과.</em></h1><p>우리의 기록을 모으고, 다음 라운드의 재미를 찾는 곳.</p></div><div className="members-seal"><span>GOOD GOLF</span><strong>09</strong><span>BETTER COMPANY</span></div><div className="members-intro-foot"><span><b>{golfers.length}</b>명의 동기</span><span><b>{records.length}</b>번의 라운드</span><span>하나의 클럽하우스</span></div></header>
    <div className="member-modes" aria-label="멤버 메뉴">{([{id:'cards',label:'골퍼 도감',Icon:Trophy},{id:'rivals',label:'라이벌 비교',Icon:Swords},{id:'draw',label:'랜덤 조편성',Icon:Shuffle}] as const).map(({id,label,Icon})=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)}><Icon size={18}/>{label}</button>)}</div>
    {mode==='cards' && <section aria-label="골퍼 도감"><div className="collection-toolbar"><div><span className="eyebrow">MEET THE PLAYERS</span><h2>우리 동기 골퍼 도감 <small>{filtered.length}</small></h2></div><div className="collection-filters"><label className="member-search"><Search size={17}/><input aria-label="멤버 이름 검색" placeholder="동기 이름 검색" value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="멤버 정렬" value={sort} onChange={e=>setSort(e.target.value)}><option value="name">이름순</option><option value="score">평균 타수순</option><option value="rounds">출전순</option></select></div></div>
    <div className="player-collection">{filtered.map((member,index)=>{const badges=badgesFor(member);return <motion.article className={'player-card '+(badges.includes('평균 타수 1위')?'edition-gold':badges.includes('최근 개인 최고')?'edition-emerald':'edition-classic')} key={member.name} initial={{opacity:0,y:reduce?0:12}} animate={{opacity:1,y:0}} transition={{duration:.25,delay:Math.min(index,5)*.035}}>
      <button className="player-portrait" aria-label={`${member.name} 카드 확대`} onClick={()=>setExpanded(member.name)}><span className="player-edition">RE09 / PLAYER COLLECTION</span><span className="player-number">{String(golfers.findIndex(m=>m.name===member.name)+1).padStart(2,'0')}</span><img src={member.img} alt={member.name} loading="lazy"/><span className="player-role">{member.role}</span></button>
      <div className="player-body"><div className="player-name"><h3>{member.name}</h3><span>MEMBER SINCE {member.since}</span></div><div className="player-badges">{badges.length?badges.map(b=><span key={b}><Trophy size={11}/>{b}</span>):<span className="quiet-badge">{member.roundCount?'함께 쌓는 기록':'첫 기록을 기다려요'}</span>}</div>
      <div className="player-numbers"><div><span>평균 타수</span><strong>{member.grossAverageDisplay}</strong></div><div><span>개인 최고</span><strong>{bestScore(member)??'—'}</strong></div><div><span>출전</span><strong>{member.roundCount}<small>회</small></strong></div></div>
      <ScoreTrend member={member}/><div className="player-card-actions"><button onClick={()=>setExpanded(member.name)}>카드 확대</button><button aria-label={`${member.name} 비교 선택`} aria-pressed={compare.includes(member.name)} disabled={!compare.includes(member.name)&&compare.length===2} onClick={()=>setCompare(compare.includes(member.name)?compare.filter(n=>n!==member.name):[...compare,member.name])}>{compare.includes(member.name)?'선택됨 ✓':'라이벌 비교 +'}</button></div>
      <details className="player-history"><summary>라운드 기록 펼치기 <ChevronDown size={16}/></summary><div className="score-history"><span>최근 기록부터 · 총타수</span><div>{member.scoreHistory.map((score,i)=><span key={i} className={score===bestScore(member)?'personal-best':''}>{score}<small>{i===0?'최근':`${i+1}번째`}</small></span>)}</div></div>{records.filter(r=>r.attendees.some(p=>p.name===member.name)).map(r=><a key={r.date} href={'#/rounds?date='+r.date}><span>{r.date}<small>{r.location}</small></span><b>{r.attendees.find(p=>p.name===member.name)?.score}타</b><ArrowUpRight size={15}/></a>)}{!member.roundCount&&<p>아직 등록된 스코어가 없어요.</p>}</details>
      {member.phone&&<a className="player-contact" href={'tel:'+member.phone.replace(/[^+0-9]/g,'')}><Phone size={13}/> 연락하기 <ArrowUpRight size={14}/></a>}</div>
    </motion.article>})}</div>{!filtered.length&&<p className="member-empty" role="status">검색한 이름이 없어요. 다른 이름으로 찾아보세요.</p>}<p className="member-footnote">배지는 등록된 전체 스코어 기준이며 공동 기록은 함께 표시합니다. 개인 최고는 가장 낮은 총타수예요.</p></section>}
    {mode==='cards'&&compare.length>0&&<div className="compare-tray" role="region" aria-label="비교할 골퍼"><span>{compare.join(' vs ')}<small>{compare.length===1?'상대 한 명을 더 골라주세요.':'두 골퍼의 기록을 비교해요.'}</small></span><button className="button button-brass" disabled={compare.length!==2} onClick={()=>{setPair([...compare]);setMode('rivals');}}>비교하기</button><button onClick={()=>setCompare([])} aria-label="비교 선택 초기화">초기화</button></div>}
    {expanded&&<PlayerDialog member={golfers.find(m=>m.name===expanded)!} onClose={()=>setExpanded(null)}/>}
    {mode==='rivals'&&<RivalComparison initialPair={pair}/>}{mode==='draw'&&<GroupDraw/>}
  </div>;
}
