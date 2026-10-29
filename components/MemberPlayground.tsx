import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Shuffle, Copy, Check, Swords } from 'lucide-react';
import { golfers, bestScore, headToHead, drawGroups } from '../utils/memberClub';

export function RivalComparison({initialPair=[]}:{initialPair?:string[]}) {
 const [left,setLeft]=useState(initialPair[0]??golfers[0].name);
 const [right,setRight]=useState(initialPair[1]??golfers[1].name);
 const a=golfers.find(m=>m.name===left)!;
 const b=golfers.find(m=>m.name===right)!;
 const shared=headToHead(left,right);
 const wins=shared.filter(r=>r.left<r.right).length;
 const losses=shared.filter(r=>r.left>r.right).length;
 const metrics=[{label:'평균 타수',a:a.grossAverageDisplay,b:b.grossAverageDisplay},{label:'개인 최고',a:bestScore(a)??'—',b:bestScore(b)??'—'},{label:'출전 횟수',a:a.roundCount,b:b.roundCount}];
 return <section className="rival-section"><div className="play-section-title"><span className="eyebrow">FRIENDLY RIVALRY</span><h2>오늘의 라이벌은 누구?</h2><p>두 동기의 기록을 나란히. 승부는 필드에서, 비교는 여기서.</p></div>
 <div className="rival-arena"><div className="rival-players">{[a,b].map((member,i)=><div className="rival-player" key={i}><label><span>{i===0?'첫 번째 골퍼':'두 번째 골퍼'}</span><select aria-label={i===0?'첫 번째 골퍼':'두 번째 골퍼'} value={member.name} onChange={e=>i===0?setLeft(e.target.value):setRight(e.target.value)}>{golfers.map(m=><option key={m.name} value={m.name} disabled={m.name===(i===0?right:left)}>{m.name}</option>)}</select></label><img src={member.img} alt={member.name}/><h3>{member.name}</h3><span>{member.role}</span></div>)}<span className="versus">VS</span></div>
 <div className="rival-metrics">{metrics.map(row=><div key={row.label}><strong>{row.a}</strong><span>{row.label}</span><strong>{row.b}</strong></div>)}</div><div className="duel-result"><Swords size={21}/><span>함께 친 날의 승부</span><strong>{wins}승 <i>· {shared.length-wins-losses}무 ·</i> {losses}패</strong><small>{a.name} 기준 · 총 {shared.length}회</small></div></div>
 <div className="shared-rounds"><h3>같이 걸었던 필드</h3>{shared.length?shared.map(r=><a href={'#/rounds?date='+r.date} key={r.date}><span>{r.date}<b>{r.location}</b></span><strong>{r.left} <small>:</small> {r.right}</strong><span className="duel-winner">{r.left===r.right?'무승부':`${r.left<r.right?a.name:b.name} 승`}</span></a>):<p className="member-empty">함께 참가한 라운드가 아직 없어요. 첫 맞대결을 기다려요.</p>}</div><p className="member-footnote">총타수가 낮으면 승리, 같으면 무승부. 핸디캡은 적용하지 않으며 전체 평균과 맞대결은 집계 범위가 다릅니다.</p></section>;
}

export function GroupDraw() {
 const [selected,setSelected]=useState(golfers.map(m=>m.name));
 const [groups,setGroups]=useState<string[][]>([]);
 const [draw,setDraw]=useState(0);
 const [message,setMessage]=useState('');
 const reduce=useReducedMotion();
 function update(names:string[]){setSelected(names);setGroups([]);setMessage('');}
 function shuffle(){setGroups(drawGroups(selected));setDraw(n=>n+1);setMessage('새로운 조편성이 완성됐어요.');}
 async function copy(){try{await navigator.clipboard.writeText('DKU RE09 조편성\n'+groups.map((g,i)=>`${i+1}조: ${g.join(', ')}`).join('\n'));setMessage('조편성을 복사했어요.');}catch{setMessage('복사하지 못했어요. 화면의 조편성을 직접 선택해 복사해 주세요.');}}
 return <section><div className="play-section-title"><span className="eyebrow">THE NEXT FOURBALL</span><h2>오늘은 누구와 같은 조?</h2><p>참가자를 고르고 카드를 섞어보세요. 새로운 조합이 새로운 이야기가 됩니다.</p></div><div className="draw-panel"><div className="draw-heading"><h3>참가 멤버 <span>{selected.length}명</span></h3><div><button onClick={()=>update(golfers.map(m=>m.name))}>전체 선택</button><button onClick={()=>update([])}>선택 해제</button></div></div><div className="draw-members">{golfers.map(m=><button key={m.name} aria-pressed={selected.includes(m.name)} onClick={()=>update(selected.includes(m.name)?selected.filter(n=>n!==m.name):[...selected,m.name])}><img src={m.img} alt=""/><span>{m.name}</span>{selected.includes(m.name)&&<Check size={14}/>}</button>)}</div><div className="draw-actions"><p>최대 4명씩 무작위 배정<br/><small>남는 인원은 나눠 배정하며 실력은 반영하지 않아요.</small></p><button className="button button-brass" disabled={selected.length<2} onClick={shuffle}><Shuffle size={17}/>{groups.length?'다시 섞기':'조편성 시작'}</button></div></div><p className="draw-status" role="status">{message|| (selected.length<2?'두 명 이상 선택해 주세요.':'참가자를 선택한 뒤 조편성을 시작해 보세요.')}</p>
 {groups.length>0&&<><div className="draw-result-heading"><h3>오늘의 티오프 라인업</h3><button className="text-link" onClick={copy}><Copy size={15}/> 결과 복사</button></div><div className="draw-results" key={draw}>{groups.map((group,i)=><motion.article className="draw-group" key={i} initial={{opacity:0,y:reduce?0:18,rotate:reduce?0:-2}} animate={{opacity:1,y:0,rotate:0}} transition={{duration:.35,delay:reduce?0:i*.1}}><header><span>TEE TIME CREW</span><strong>{String(i+1).padStart(2,'0')}<small>조</small></strong></header>{group.map(name=>{const m=golfers.find(p=>p.name===name)!;return <div className="draw-player" key={name}><img src={m.img} alt=""/><span>{name}</span><small>{m.grossAverageDisplay==='-'?'기록 없음':`${m.grossAverageDisplay}타`}</small></div>})}</motion.article>)}</div><p className="member-footnote">이 화면에서 만든 임시 조편성입니다. 공식 일정에는 반영되지 않으며, 메뉴를 나가면 초기화됩니다.</p></>}
 </section>;
}
