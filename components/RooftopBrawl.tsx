import {useEffect,useRef,useState,CSSProperties} from 'react';
import {ArrowLeft,Pause,Play,Volume2,VolumeX,Shield,ArrowUp,Hand,Zap,Swords,Trophy,RotateCcw} from 'lucide-react';
import {CAST,stickVector,Action,WEAPONS,ARENA,OBSTACLES} from '../utils/rooftopModel';
import {RooftopGame} from '../utils/rooftopRenderer';
import './RooftopBrawl.css';

export default function RooftopBrawl(){
 const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<RooftopGame|null>(null),root=useRef<HTMLElement>(null);
 const pad=useRef<{id:number;x:number;y:number}|null>(null);
 const [selected,setSelected]=useState(0),[loaded,setLoaded]=useState(false),[error,setError]=useState('');
 const [muted,setMuted]=useState(false),[,render]=useState(0),[knob,setKnob]=useState({x:0,y:0});
 useEffect(()=>{
  let disposed=false;
  try{
   const game=new RooftopGame(canvas.current!,()=>{if(!disposed)render(n=>n+1);});engine.current=game;
   game.ready.then(()=>{if(!disposed)setLoaded(true);}).catch(()=>{if(!disposed)setError('캐릭터를 불러오지 못했어요.');});
  }catch{setError('게임 화면을 불러오지 못했어요. 새로고침해 주세요.');}
  return()=>{disposed=true;engine.current?.dispose();engine.current=null;};
 },[]);
 const game=engine.current,m=game?.model,phase=m?.phase??'ready',player=m?.fighters[0],active=phase==='playing';
 const ended=phase==='round'||phase==='finished';
 function focus(){root.current?.focus({preventScroll:true});}
 function start(){game?.start(selected);focus();}
 function release(e?:{pointerId:number}){if(e&&pad.current&&pad.current.id!==e.pointerId)return;pad.current=null;setKnob({x:0,y:0});if(engine.current)engine.current.model.stick={x:0,y:0};}
 useEffect(()=>{if(phase!=='playing'){pad.current=null;setKnob({x:0,y:0});if(engine.current)engine.current.model.stick={x:0,y:0};}},[phase]);
 function move(e:{pointerId:number;clientX:number;clientY:number}){const p=pad.current;if(!p||p.id!==e.pointerId)return;const v=stickVector(e.clientX-p.x,e.clientY-p.y);setKnob({x:v.x*28,y:v.y*28});if(game)game.model.stick=v;}
 function act(action:Action){game?.act(action);focus();}
 const actions=[{id:'guard',label:'방어',key:'I',Icon:Shield,cost:12},{id:'jump',label:'점프',key:'SPACE',Icon:ArrowUp,cost:16},{id:'grab',label:player&&player.carrying>=0?'던지기':'잡기',key:'K',Icon:Hand,cost:0},{id:'dash',label:player&&player.heldBy>=0?'탈출':'돌진',key:'L',Icon:Zap,cost:30},{id:'push',label:'공격',key:'J',Icon:Swords,cost:0}] as const;
 return <section className="roof" data-phase={phase} ref={root} tabIndex={-1} aria-label="RE09 옥상 난투">
  <header className="roof-nav">
   <a href="#/more" aria-label="클럽으로" title="클럽으로"><ArrowLeft size={20}/></a>
   <div className="roof-wordmark">RE<span>09</span><small>ROOFTOP RUMBLE</small></div>
   <span className="roof-mode">FREE FOR ALL</span>
   <button title={muted?'효과음 켜기':'효과음 끄기'} aria-label={muted?'효과음 켜기':'효과음 끄기'} aria-pressed={!muted} onClick={()=>{setMuted(!muted);game?.audio.setEnabled(muted);if(muted)void game?.audio.unlock();focus();}}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>
   <button title="일시정지" aria-label={phase==='paused'?'계속하기':'일시정지'} disabled={!['playing','paused','countdown'].includes(phase)} onClick={()=>{game?.pause();focus();}}>{phase==='paused'?<Play size={18}/>:<Pause size={18}/>}</button>
  </header>
  <div className="roof-stage">
   <canvas ref={canvas} aria-label="2D 옥상 난투 경기장"/>
   {phase!=='ready'&&<div className="roof-score">{m?.fighters.map((p,i)=><div key={p.cast} className={`${!p.alive?'out':''} ${i===0?'is-player':''}`} style={{'--fighter':CAST[p.cast].color} as CSSProperties}>
    <div className="roof-face" style={{backgroundImage:`url(${CAST[p.cast].image})`}}/>
    <div className="roof-score-info"><span>{i===0?'YOU':'CPU'} <b>{CAST[p.cast].name}</b></span><strong>{p.alive?`${Math.round(p.damage)}%`:'OUT'}</strong><i>{'●'.repeat(p.wins)}{'○'.repeat(Math.max(0,2-p.wins))}</i></div>
   </div>)}</div>}
   {phase==='ready'&&<div className="roof-lobby">
    <div className="roof-lobby-title"><span>DKU RE09 / ARCADE CLUB</span><h1>옥상 난투<span>ROOFTOP RUMBLE</span></h1></div>
    <div className="roof-selection"><div className="roof-selection-heading"><b>PLAYER SELECT</b><span>{String(selected+1).padStart(2,'0')} / 06</span></div>
     <div className="roof-roster">{CAST.map((p,i)=><button key={p.id} aria-label={p.name} aria-pressed={selected===i} onClick={()=>{setSelected(i);game?.preview(i);}} style={{'--fighter':p.color} as CSSProperties}><div className="roof-portrait" style={{backgroundImage:`url(${p.image})`}}/><strong>{p.name}</strong><span>{WEAPONS[i].name}</span></button>)}</div>
     <div className="roof-enter"><div><b>{CAST[selected].name}</b><span>{WEAPONS[selected].name} · 사거리 {WEAPONS[selected].reach}</span></div><button disabled={!loaded||!!error} onClick={start}><Play size={18} fill="currentColor"/>{error?'실행 불가':loaded?'대전 시작':'준비 중'}</button></div>
     {error&&<p role="alert">{error}</p>}
    </div>
   </div>}
   {phase!=='ready'&&<div className="roof-round"><span>ROUND <b>{String(m?.round??1).padStart(2,'0')}</b></span><strong>{(m?.time??0)>ARENA.shrinkAt?'SUDDEN DEATH':`${Math.max(0,ARENA.shrinkAt-Math.floor(m?.time??0))}`}</strong><span>{m?.fighters.filter(p=>p.alive).length} ALIVE</span></div>}
   {phase!=='ready'&&<div className="roof-minimap" aria-label="경기장 미니맵">{OBSTACLES.map((o,i)=><i key={i} style={{left:`${50+o.x/12}%`,top:`${50+o.y/7.6}%`}}/>)}{m?.fighters.filter(p=>p.alive).map(p=><b key={p.cast} style={{left:`${50+p.x/12}%`,top:`${50+p.y/7.6}%`,background:p===player?'#fff':CAST[p.cast].color,outline:p===player?'2px solid #e65d3c':'none'}}/>)}</div>}
   {phase==='countdown'&&<div className="roof-count" aria-live="polite"><span>ROUND {m?.round}</span><b>{Math.ceil(m?.countdown??3)}</b></div>}
   {(phase==='paused'||ended)&&<div className="roof-overlay"><div role="dialog" aria-modal="true" aria-label={ended?'경기 결과':'일시정지'} onKeyDown={e=>{if(e.key==='Escape'&&phase==='paused'){e.preventDefault();game?.pause();focus();}if(e.key==='Tab'){const buttons=(e.currentTarget as HTMLDivElement).querySelectorAll<HTMLButtonElement>('button');const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}>
    {ended?<Trophy size={38}/>:<Pause size={32}/>}<span>{phase==='finished'?'MATCH FINISHED':ended?'ROUND FINISHED':'TIME OUT'}</span>
    <h2>{!ended?'잠깐, 휴전.':m!.winner<0?'무승부':`${CAST[m!.fighters[m!.winner].cast].name} 승리`}</h2>
    <button autoFocus onClick={()=>{if(phase==='paused')game?.pause();else if(phase==='finished')start();else m?.nextRound();focus();}}><Play size={18}/>{phase==='paused'?'계속하기':phase==='finished'?'다시 대전':'다음 라운드'}</button>
    <button className="roof-secondary" onClick={()=>{game?.preview(selected);focus();}}><RotateCcw size={16}/>캐릭터 선택</button>
   </div></div>}
  </div>
  {phase!=='ready'&&<div className="roof-controls">
   <button className="roof-pad" aria-label="이동 조이스틱" disabled={!active||!player?.alive} onPointerDown={e=>{if(pad.current)return;const r=e.currentTarget.getBoundingClientRect();pad.current={id:e.pointerId,x:r.left+r.width/2,y:r.top+r.height/2};e.currentTarget.setPointerCapture(e.pointerId);move(e);}} onPointerMove={move} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}><span>W A S D</span><i style={{transform:`translate(${knob.x}px,${knob.y}px)`}}/></button>
   <div className="roof-energy"><span>{player?.hang?'EDGE':player?.alive?'ENERGY':'KNOCK OUT'}</span><progress max={100} value={player?.stamina??0}/></div>
   <div className="roof-actions">{actions.map(({id,label,key,Icon,cost})=><button key={id} className={`action-${id}`} aria-label={label} title={`${label} (${key})`} disabled={!active||!player?.alive||(player?.stamina??0)<cost} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);if(id==='push')game?.holdAttack(true);else act(id);}} onPointerUp={()=>{if(id==='push')game?.holdAttack(false);}} onPointerCancel={()=>game?.holdAttack(false)} onLostPointerCapture={()=>{if(id==='push')game?.holdAttack(false);}} onClick={e=>{if(e.detail===0)act(id);}}><Icon size={22}/><b>{label}</b><small>{key}</small></button>)}</div>
  </div>}
 </section>;
}
