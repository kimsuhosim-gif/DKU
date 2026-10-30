import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, RotateCcw, Trophy, Move, X, Download, Play, Target, Eye } from 'lucide-react';
import { COURSES } from '../utils/puttingGame';
import { GolfScene, ShotResult } from '../utils/golfScene';
import './PuttingGame.css';

type Phase = 'intro' | 'ready' | 'moving' | 'holed' | 'capped' | 'finished';
const BEST_KEY = 're09-island-golf-best';
function readBest(): number | null { try { const n = Number(localStorage.getItem(BEST_KEY)); return Number.isInteger(n) && n >= 5 && n <= 50 ? n : null; } catch { return null; } }
const NAMES = ['THE FIRST GREEN', 'STONE GATE', 'SAND & SUN', 'BLUE LAGOON', 'THE FINAL APPROACH'];

export default function PuttingGame() {
  const host = useRef<HTMLDivElement>(null), engine = useRef<GolfScene | null>(null);
  const resultHandler = useRef<(result: ShotResult) => void>(() => {});
  const [phase, setPhase] = useState<Phase>('intro'), [hole, setHole] = useState(0), [strokes, setStrokes] = useState(0), [scores, setScores] = useState<number[]>([]);
  const [angle, setAngle] = useState(0), [power, setPower] = useState(50), [best, setBest] = useState(readBest);
  const [sound, setSound] = useState(false), [topView, setTopView] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState('');
  const [help, setHelp] = useState(false), [reset, setReset] = useState(false), [charging, setCharging] = useState(false), [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('첫 티샷, 가볍게 시작해볼까?');
  const chargingRef = useRef(false), chargeFrame = useRef(0), chargeStart = useRef(0), chargePower = useRef(50), ignoreClick = useRef(false);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null), aimRef = useRef({ angle: 0, power: 50 });
  const nextButton = useRef<HTMLButtonElement>(null), reduced = useReducedMotion();
  const total = scores.reduce((a, b) => a + b, 0) + (phase === 'finished' ? 0 : strokes), course = COURSES[hole];
  const canShoot = phase === 'ready' && !help && !reset && !error;

  resultHandler.current = result => {
    if (result === 'holed') { setPhase('holed'); setMessage(strokes === 1 ? '들어갔다아아!! 효민이 날아간다!' : '이게 바로 클래스! 나이스 퍼팅!!'); return; }
    const count = Math.min(10, strokes + (result === 'water' ? 1 : 0)); setStrokes(count);
    setPhase(count >= 10 ? 'capped' : 'ready');
    setMessage(count >= 10 ? '멘탈 잡자… 다음 홀에서 복수한다!' : result === 'water' ? '으아악! 물이다! 1벌타, 제자리에서 다시.' : '아아아 왜 안 들어가!! 다시 간다.');
  };
  useEffect(() => {
    let scene: GolfScene | null = null;
    try { scene = new GolfScene(host.current!, r => resultHandler.current(r), setError); engine.current = scene; setReady(true); }
    catch { setError('이 브라우저에서 3D 화면을 열지 못했어요. Chrome 또는 Safari에서 하드웨어 가속을 켜고 다시 접속해 주세요.'); }
    return () => { cancelAnimationFrame(chargeFrame.current); chargingRef.current = false; scene?.dispose(); engine.current = null; };
  }, []);
  useEffect(() => { aimRef.current = { angle, power }; engine.current?.setAim(angle, power); }, [angle, power]);
  useEffect(() => { engine.current?.setActive(phase !== 'intro' && phase !== 'finished'); if (phase === 'holed' || phase === 'capped' || phase === 'finished') nextButton.current?.focus({ preventScroll: true }); }, [phase]);

  function shoot(a = angle, p = power) {
    if (!canShoot || !engine.current?.shoot(a, p)) return;
    setStrokes(n => n + 1); setPhase('moving'); setMessage('좋아… 그대로 들어가라…!');
  }
  function cancelCharge() { cancelAnimationFrame(chargeFrame.current); chargingRef.current = false; setCharging(false); }
  function beginCharge() {
    if (!canShoot || chargingRef.current) return;
    chargingRef.current = true; setCharging(true); chargeStart.current = performance.now(); chargePower.current = power;
    const tick = (now: number) => { if (!chargingRef.current) return; const elapsed = now - chargeStart.current; if (elapsed > 160) { const p = Math.round(10 + (Math.sin((elapsed - 160) / 700 - Math.PI / 2) + 1) * 45); chargePower.current = p; setPower(p); } chargeFrame.current = requestAnimationFrame(tick); };
    chargeFrame.current = requestAnimationFrame(tick);
  }
  function releaseCharge() { if (!chargingRef.current) return; const p = chargePower.current; cancelCharge(); ignoreClick.current = true; shoot(angle, p); }
  function start() { setPhase('ready'); setMessage('방향을 맞추고 SHOT을 꾹 눌렀다 놓아봐!'); }
  function next() {
    const done = [...scores, strokes]; setScores(done);
    if (hole === 4) {
      setPhase('finished'); const score = done.reduce((a, b) => a + b, 0);
      try { const old = readBest(); if (old === null || score < old) { localStorage.setItem(BEST_KEY, String(score)); setBest(score); } setMessage('오늘의 라운드 완주! 기록은 이 브라우저에 저장했어.'); }
      catch { setMessage('완주! 브라우저 저장이 차단되어 기록은 저장하지 못했어.'); } return;
    }
    const index = hole + 1; engine.current?.loadCourse(index); setHole(index); setStrokes(0); setAngle(0); setPower(50); setPhase('ready'); setMessage(COURSES[index].hint);
  }
  function restart() { cancelCharge(); engine.current?.loadCourse(0); setHole(0); setStrokes(0); setScores([]); setAngle(0); setPower(50); setPhase('ready'); setReset(false); setMessage('리셋 완료. 이번에는 기록을 깨보자!'); }
  function pointerDown(e: React.PointerEvent<HTMLDivElement>) { if (!canShoot || e.button !== 0) return; drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId }; e.currentTarget.setPointerCapture(e.pointerId); }
  function pointerMove(e: React.PointerEvent<HTMLDivElement>) { const d = drag.current; if (!d || d.id !== e.pointerId || !canShoot) return; const a = engine.current!.aimFromDrag(e.clientX - d.x, e.clientY - d.y); aimRef.current = a; setAngle(Math.round(a.angle)); setPower(Math.max(1, Math.round(a.power))); }
  function pointerUp(e: React.PointerEvent<HTMLDivElement>) { const d = drag.current; drag.current = null; if (d && d.id === e.pointerId && canShoot && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 15) shoot(aimRef.current.angle, aimRef.current.power); }
  async function saveResult() {
    setExporting(true);
    try {
      await document.fonts.ready; const c = document.createElement('canvas'); c.width = 900; c.height = 1100; const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#173c35'; ctx.fillRect(0, 0, 900, 1100); ctx.fillStyle = '#efdfad'; ctx.textAlign = 'center'; ctx.font = '24px sans-serif'; ctx.fillText('RE09 · ISLAND GOLF', 450, 95);
      const image = new Image(); image.src = '/images/hyomin-golfer-reactions.png'; await image.decode(); ctx.drawImage(image, 0, image.height / 2, image.width / 2, image.height / 2, 285, 145, 330, 422);
      ctx.fillStyle = '#fff9e8'; ctx.font = 'bold 86px sans-serif'; ctx.fillText(`${total}타`, 450, 700); ctx.font = '26px sans-serif'; ctx.fillText('효민이와 5홀 완주', 450, 760);
      ctx.font = '22px sans-serif'; scores.forEach((s, i) => { ctx.fillText(`${i + 1}H`, 150 + i * 150, 840); ctx.fillText(`${s}타`, 150 + i * 150, 895); });
      ctx.font = '19px sans-serif'; ctx.fillText('단국대 부동산학과 09 · 개인 플레이 기록', 450, 1000);
      const blob = await new Promise<Blob>((resolve, reject) => c.toBlob(b => b ? resolve(b) : reject(Error('image')))); const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'RE09-island-golf.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch { setMessage('이미지 저장에 실패했어. 다시 눌러줘.'); } finally { setExporting(false); }
  }
  const ended = phase === 'holed' || phase === 'capped';
  return <section className={`island-game ${phase === 'intro' ? 'is-intro' : ''}`} aria-label="RE09 아일랜드 골프">
    <div className="island-canvas" ref={host} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} />
    <div className="island-vignette" />
    <header className="island-header"><a href="#/more" aria-label="게임 나가기" className="island-icon"><ArrowLeft size={19} /></a><a href="#/more" className="island-brand">RE09<span>ISLAND GOLF</span></a><div className="island-header-actions"><button className="island-icon" aria-label={sound ? '효과음 끄기' : '효과음 켜기'} aria-pressed={sound} onClick={() => { engine.current?.setSound(!sound); setSound(!sound); }}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><button className="island-icon" aria-label="플레이 방법" onClick={() => { cancelCharge(); setHelp(true); }}>?</button></div></header>
    {!ready && !error && <div className="island-loading" role="status"><span />섬으로 이동하는 중…</div>}
    {error && <div className="island-modal-backdrop"><div className="island-modal" role="alert"><h2>3D 화면을 불러오지 못했어요</h2><p>{error}</p><button className="island-primary" onClick={() => location.reload()}>다시 불러오기</button><a href="#/more">클럽으로 돌아가기</a></div></div>}
    <AnimatePresence>
      {phase === 'intro' && ready && !error && <motion.div className="island-intro" initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -15 }}>
        <span className="island-kicker"><i /> THE RE09 GOLF CLUB</span><h1>작은 섬.<br />큰 <em>승부.</em></h1><p>효민이와 떠나는 5홀 골프 여행.<br />퍼팅은 섬세하게, 리액션은 거침없이.</p>
        <button className="island-primary island-start" onClick={start}>라운드 시작 <Play size={18} fill="currentColor" /></button>
        <div className="island-intro-meta"><span>5 HOLES</span><span>3D GOLF</span><span>HYOMIN EDITION</span></div>
        <div className="island-intro-player"><span className="island-portrait" /><div><small>YOUR PLAYER</small><strong>김효민 <span>· RE09</span></strong></div><span className="island-best"><Trophy size={14} />{best ? `${best}타` : '첫 라운드'}</span></div>
      </motion.div>}
    </AnimatePresence>
    {phase !== 'intro' && ready && !error && <>
      <div className="island-hud"><div className="island-hole"><span>HOLE</span><strong>{String(hole + 1).padStart(2, '0')}<small> / 05</small></strong><p>{NAMES[hole]}</p></div><div className="island-score"><span>PAR <b>{course.par}</b></span><span>이번 홀 <b>{strokes}</b></span><span>합계 <b>{total}</b></span></div></div>
      <div className="island-course-tools"><button className="island-icon" aria-label="카메라 시점 전환" aria-pressed={topView} onClick={() => setTopView(engine.current?.toggleView() ?? false)}><Eye size={18} /></button><button className="island-icon" aria-label="처음부터 다시" disabled={phase === 'moving'} onClick={() => { cancelCharge(); setReset(true); }}><RotateCcw size={17} /></button></div>
      <div className="island-commentary" role="status"><span className={`island-portrait ${ended || phase === 'finished' ? phase === 'capped' ? 'is-lose' : 'is-win' : phase === 'ready' && strokes > 0 ? 'is-lose' : ''}`} /><p><b>HYOMIN</b>{message}</p></div>
      {phase !== 'finished' && !ended && <div className="island-controls">
        <div className="island-controls-top"><span><Move size={13} /> 화면을 당겼다 놓아도 퍼팅!</span><span>{phase === 'moving' ? 'ON THE MOVE' : charging ? 'RELEASE TO SHOT' : 'READY TO PUTT'}<i className={phase === 'moving' ? 'moving' : ''} /></span></div>
        <div className="island-controls-main"><label className="island-direction"><span>방향 <b>{Math.round(angle)}°</b></span><input type="range" aria-label="퍼팅 방향" min="-180" max="180" value={angle} disabled={!canShoot || charging} onChange={e => setAngle(Number(e.target.value))} /><div><span>−180°</span><span>0° ↑</span><span>180°</span></div></label><label className="island-power"><span>파워 <b>{power}%</b></span><input type="range" aria-label="퍼팅 세기" min="1" max="100" value={power} disabled={!canShoot || charging} onChange={e => setPower(Number(e.target.value))} /><div className="island-power-track"><i style={{ width: `${power}%` }} /></div></label>
        <button className={`island-shot ${charging ? 'is-charging' : ''}`} disabled={!canShoot} aria-label="퍼팅! 누르고 있다 놓으면 파워 조절" onPointerDown={e => { if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); beginCharge(); }} onPointerUp={() => releaseCharge()} onPointerCancel={cancelCharge} onLostPointerCapture={() => { if (chargingRef.current) cancelCharge(); }} onClick={() => { if (ignoreClick.current) { ignoreClick.current = false; return; } shoot(); }}><Target size={19} /><span>{phase === 'moving' ? 'ROLLING' : charging ? '놓으면 샷!' : 'SHOT'}<small>{phase === 'moving' ? '공을 지켜봐!' : '꾹 누르고 놓기'}</small></span></button></div>
        <div className="island-hole-progress">{COURSES.map((c, i) => <span key={c.name} className={i === hole ? 'active' : scores[i] ? 'done' : ''}><i />{i + 1}<b>{scores[i] ? `${scores[i]}타` : ''}</b></span>)}</div>
      </div>}
      <AnimatePresence>{(ended || phase === 'finished') && <motion.div className="island-result" initial={{ opacity: 0, scale: reduced ? 1 : .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <span className="island-kicker">{phase === 'finished' ? 'ROUND COMPLETE' : phase === 'capped' ? 'KEEP YOUR HEAD UP' : strokes === 1 ? 'HOLE IN ONE!' : strokes < course.par ? 'BIRDIE!' : strokes === course.par ? 'NICE PAR!' : 'NICE PUTT!'}</span>
        <h2>{phase === 'finished' ? '오늘도, 나이스 라운드.' : phase === 'capped' ? '다음 홀에서 복수다!' : strokes === 1 ? '이게 들어간다고?!' : '들어갔다아아!'}</h2><strong>{phase === 'finished' ? total : strokes}<small>타</small></strong>
        <p>{phase === 'finished' ? `5홀 완주 · 기준 15타 · 최고 ${best ?? total}타` : phase === 'capped' ? '10타 제한 · 다음 홀로 이동해요' : `${course.name} · PAR ${course.par}`}</p>
        {phase === 'finished' && <div className="island-final-scores">{scores.map((s, i) => <span key={i}><small>{i + 1}H</small>{s}</span>)}</div>}
        <button ref={nextButton} className="island-primary" onClick={phase === 'finished' ? restart : next}>{phase === 'finished' ? '한 판 더!' : hole === 4 ? '최종 결과' : '다음 홀'}<ArrowRight size={18} /></button>
        {phase === 'finished' && <button className="island-save" disabled={exporting} onClick={saveResult}><Download size={15} />{exporting ? '저장 중…' : '결과 이미지 저장'}</button>}
      </motion.div>}</AnimatePresence>
    </>}
    {(help || reset) && <div className="island-modal-backdrop" onKeyDown={e => { if (e.key === 'Tab') { const items = Array.from((e.currentTarget as HTMLDivElement).querySelectorAll<HTMLElement>('button:not(:disabled),a[href]')); const first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } } if (e.key === 'Escape') { setHelp(false); setReset(false); } }}><div className="island-modal" role="dialog" aria-modal="true" aria-label={help ? '플레이 방법' : '새 라운드 시작'}><button autoFocus className="island-modal-close island-icon" aria-label="닫기" onClick={() => { setHelp(false); setReset(false); }}><X size={18} /></button><span className="island-kicker">HOW TO PLAY</span><h2>{help ? '감각을 믿고, 한 번에.' : '새로 시작할까?'}</h2>{help ? <><p><b>01. 방향을 맞춰요</b><br />점선이 출발 방향이에요. 슬라이더나 화면 드래그로 조준하세요. 화면은 공을 보내려는 방향의 반대로 당겨요.</p><p><b>02. 꾹 눌렀다 놓아요</b><br />SHOT을 누르면 파워가 오르내려요. 원하는 세기에서 놓으면 스윙! 짧게 누르거나 키보드 Enter로 선택한 파워를 사용해요.</p><p><b>03. 지형을 이용해요</b><br />벽은 반사, 모래는 감속, 물은 1벌타. 홀당 10타로 마무리해요. 점선은 거리 예측이 아니에요.</p><small>기록은 이 브라우저에만 저장돼요. 실제 모임 랭킹과 별개예요.</small></> : <><p>진행 중인 라운드는 지워지고 1번 홀부터 시작해요. 최고 기록은 유지돼요.</p><button className="island-primary" onClick={restart}>새 게임 시작</button></>}</div></div>}
  </section>;
}
