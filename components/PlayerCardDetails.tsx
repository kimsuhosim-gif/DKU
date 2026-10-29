import React, { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Golfer, bestScore, badgesFor } from '../utils/memberClub';
import { records } from '../utils/golfData';

export function ScoreTrend({member}:{member:Golfer}) {
 const scores=[...member.scoreHistory].reverse();
 if(scores.length<2)return <div className="card-trend empty-trend">{scores.length?`첫 기록 ${scores[0]}타 · 다음 라운드를 기다려요`:'첫 라운드의 기록을 기다려요'}</div>;
 const lo=Math.min(...scores)-3,hi=Math.max(...scores)+3;
 const points=scores.map((score,i)=>({x:12+i*176/(scores.length-1),y:12+(score-lo)/(hi-lo)*34,score}));
 return <div className="card-trend"><div><span>스코어 흐름</span><small>과거 → 최근 · 위로 갈수록 좋은 기록</small></div><svg viewBox="0 0 200 65" role="img" aria-label={`과거부터 최근 총타수: ${scores.join(', ')}`}><path d="M12 46H188" stroke="currentColor" opacity=".15"/><polyline points={points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2"/>{points.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="3" fill="currentColor"/><text x={p.x} y={p.y-6} textAnchor="middle" fontSize="9" fill="currentColor">{p.score}</text></g>)}</svg></div>;
}

async function saveCard(member:Golfer){
 await document.fonts.ready;
 const portrait=new Image();portrait.src=member.img;await portrait.decode();
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1400;
 const c=canvas.getContext('2d');if(!c)throw Error('canvas');
 c.fillStyle='#f5efdc';c.fillRect(0,0,1000,1400);
 c.strokeStyle='#b69a5b';c.lineWidth=3;c.strokeRect(25,25,950,1350);c.strokeRect(38,38,924,1324);
 c.fillStyle='#193b32';c.fillRect(60,60,880,690);
 c.fillStyle='#dfc58a';c.font='20px sans-serif';c.fillText('DKU RE09 / PLAYER COLLECTION',95,110);
 const scale=Math.min(650/portrait.width,570/portrait.height),w=portrait.width*scale,h=portrait.height*scale;
 c.drawImage(portrait,(1000-w)/2,750-h,w,h);
 c.textAlign='center';c.fillStyle='#193b32';c.font='bold 66px sans-serif';c.fillText(member.name,500,850);
 c.font='22px sans-serif';c.fillStyle='#827047';c.fillText(`${member.role} · MEMBER SINCE ${member.since}`,500,900);
 c.font='22px sans-serif';c.fillText(badgesFor(member).join('  ·  ')||'GOOD GOLF. BETTER COMPANY.',500,955);
 c.fillStyle='#E2ECDF';c.fillRect(85,1000,830,190);
 ['평균 타수','개인 최고','출전 횟수'].forEach((label,i)=>{const x=225+i*275;c.fillStyle='#5A7160';c.font='22px sans-serif';c.fillText(label,x,1050);c.fillStyle='#294D3F';c.font='bold 48px sans-serif';c.fillText([member.grossAverageDisplay,String(bestScore(member)??'—'),`${member.roundCount}회`][i],x,1130);});
 c.fillStyle='#657259';c.font='20px sans-serif';c.fillText('등록된 전체 라운드 기준 · 총타수',500,1250);
 c.font='18px sans-serif';c.fillText('GOOD GOLF. BETTER COMPANY.',500,1310);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('export')),'image/png'));
 const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`RE09-${member.name}-골퍼카드.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
}

export function PlayerDialog({member,onClose}:{member:Golfer;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);const [status,setStatus]=useState('');const [saving,setSaving]=useState(false);
 useEffect(()=>{const d=ref.current!;const active=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;d.showModal();document.body.style.overflow='hidden';return()=>{d.close();document.body.style.overflow=overflow;active?.focus();};},[]);
 async function download(){setSaving(true);try{await saveCard(member);setStatus('카드 이미지 다운로드를 시작했어요.');}catch{setStatus('이미지를 저장하지 못했어요. 다시 시도해 주세요.');}finally{setSaving(false);}}
 return <dialog ref={ref} className="player-dialog" aria-labelledby="player-dialog-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="player-dialog-content"><button className="dialog-close" aria-label="카드 닫기" onClick={onClose}><X/></button><div className="expanded-portrait"><span>RE09 / COLLECTOR EDITION</span><img src={member.img} alt={member.name}/></div><div className="expanded-body"><span className="eyebrow">{member.role} · {member.since}</span><h2 id="player-dialog-title">{member.name}</h2><div className="player-badges">{badgesFor(member).map(b=><span key={b}>{b}</span>)}</div><div className="player-numbers"><div><span>평균 타수</span><strong>{member.grossAverageDisplay}</strong></div><div><span>개인 최고</span><strong>{bestScore(member)??'—'}</strong></div><div><span>출전</span><strong>{member.roundCount}회</strong></div></div><ScoreTrend member={member}/><h3>라운드 기록</h3><div className="expanded-records">{records.filter(r=>r.attendees.some(p=>p.name===member.name)).map(r=><a onClick={onClose} href={'#/rounds?date='+r.date} key={r.date}><span>{r.date}<small>{r.location}</small></span><b>{r.attendees.find(p=>p.name===member.name)?.score}타</b></a>)}{!member.roundCount&&<p>아직 기록이 없어요.</p>}</div><button className="button button-brass save-card" disabled={saving} onClick={download}><Download size={17}/>{saving?'이미지 만드는 중…':'내 카드 이미지 저장'}</button><p className="export-status" role="status">{status||'사진과 기록이 담긴 PNG 이미지로 저장돼요.'}</p></div></div></dialog>;
}
