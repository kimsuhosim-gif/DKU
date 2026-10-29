import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Flag,RotateCcw,Trophy,Download,Volume2,VolumeX} from 'lucide-react';
import {COURSES,Ball,Point,stepBall,shotVelocity} from '../utils/puttingGame';
import './PuttingGame.css';

type Phase='ready'|'moving'|'holed'|'capped'|'finished';
type Mood='ready'|'swing'|'win'|'lose';
const KEY='re09-putting-v1-best';
function readBest():number|null{try{const n=Number(localStorage.getItem(KEY));return Number.isInteger(n)&&n>=5&&n<=50?n:null;}catch{return null;}}
export default function PuttingGame(){
 const [hole,setHole]=useState(0),[strokes,setStrokes]=useState(0),[scores,setScores]=useState<number[]>([]);
 const [phase,setPhase]=useState<Phase>('ready'),[mood,setMood]=useState<Mood>('ready');
 const [angle,setAngle]=useState(0),[power,setPower]=useState(50),[drag,setDrag]=useState<Point|null>(null);
 const [position,setPosition]=useState<Point>(COURSES[0].start),[best,setBest]=useState(readBest);
 const [message,setMessage]=useState('효민이 출전! 공을 뒤로 당겼다가 놓아보세요.'),[sound,setSound]=useState(false),[confirmReset,setConfirmReset]=useState(false),[exporting,setExporting]=useState(false);
 const course=COURSES[hole],total=scores.reduce((s,n)=>s+n,0)+(phase==='finished'?0:strokes);
 const ball=useRef<Ball>({...COURSES[0].start,vx:0,vy:0});
 const frame=useRef(0),dragging=useRef<number|null>(null),svg=useRef<SVGSVGElement>(null),busy=useRef(false);
 const audio=useRef<AudioContext|null>(null),mounted=useRef(true),transitionButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;cancelAnimationFrame(frame.current);audio.current?.close();};},[]);
 useEffect(()=>{if(phase==='holed'||phase==='capped'||phase==='finished')transitionButton.current?.focus({preventScroll:true});},[phase]);
 function tone(success:boolean){if(!sound)return;try{const ctx=audio.current??new AudioContext();audio.current=ctx;void ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.setValueAtTime(success?520:240,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(success?780:120,ctx.currentTime+.16);g.gain.setValueAtTime(.06,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.24);o.start();o.stop(ctx.currentTime+.25);}catch{/* Sound is optional. */}}
 function settle(kind:'water'|'stopped'|'holed',count:number,origin:Point){
  busy.current=false;
  if(kind==='holed'){setPosition({...course.cup});setMood('win');setPhase('holed');setMessage(count===1?'홀인원! 효민이 날아간다!!':`${count}타 만에 성공! 이 맛에 골프 치지!`);tone(true);return;}
  const finalCount=Math.min(10,count+(kind==='water'?1:0));setStrokes(finalCount);
  if(kind==='water'){ball.current={...origin,vx:0,vy:0};setPosition({...origin});}
  setMood('lose');tone(false);
  if(finalCount>=10){setPhase('capped');setMessage('이번 홀은 10타로 마무리. 다음 홀에서 만회하자!');}
  else{setPhase('ready');setMessage(kind==='water'?'풍덩… 1벌타! 방금 친 자리에서 다시 해보자.':'으아아! 안 들어갔어! 다음 퍼팅으로 만회하자.');}
 }
 function shoot(a=angle,p=power){
  if(busy.current||phase!=='ready')return;busy.current=true;dragging.current=null;setDrag(null);
  const count=strokes+1,origin={x:ball.current.x,y:ball.current.y};setStrokes(count);setPhase('moving');setMood('swing');setMessage('공이 굴러가는 중…');
  Object.assign(ball.current,shotVelocity(a,p));let previous=0,elapsed=0;
  function tick(now:number){
   if(!mounted.current)return;
   const dt=previous?Math.min((now-previous)/1000,.04):1/60;previous=now;elapsed+=dt;
   let result:ReturnType<typeof stepBall>='moving';const n=Math.ceil(dt/(1/120));
   for(let i=0;i<n;i++){result=stepBall(ball.current,course,dt/n);if(result!=='moving')break;}
   setPosition({x:ball.current.x,y:ball.current.y});
   if(result!=='moving'){settle(result,count,origin);return;}
   if(elapsed>12){ball.current.vx=0;ball.current.vy=0;settle('stopped',count,origin);return;}
   frame.current=requestAnimationFrame(tick);
  }
  frame.current=requestAnimationFrame(tick);
 }
 function localPoint(e:React.PointerEvent<SVGSVGElement>):Point{const matrix=svg.current!.getScreenCTM()!;const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return{x:point.x,y:point.y};}
 function aim(p:Point){const dx=position.x-p.x,dy=position.y-p.y,d=Math.hypot(dx,dy);return{angle:Math.atan2(dx,-dy)*180/Math.PI,power:Math.min(100,d/1.1),distance:d};}
 function pointerDown(e:React.PointerEvent<SVGSVGElement>){if(phase!=='ready'||busy.current||dragging.current!==null||e.button!==0)return;const p=localPoint(e);if(Math.hypot(p.x-position.x,p.y-position.y)>30)return;e.preventDefault();dragging.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);setDrag(p);}
 function pointerMove(e:React.PointerEvent<SVGSVGElement>){if(dragging.current!==e.pointerId)return;const p=localPoint(e),v=aim(p);setDrag(p);setAngle(Math.round(v.angle));setPower(Math.max(1,Math.round(v.power)));}
 function pointerUp(e:React.PointerEvent<SVGSVGElement>){if(dragging.current!==e.pointerId)return;const v=aim(localPoint(e));dragging.current=null;setDrag(null);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(v.distance>8)shoot(v.angle,v.power);}
 function cancelDrag(){dragging.current=null;setDrag(null);}
 function next(){const done=[...scores,strokes];setScores(done);if(hole===COURSES.length-1){setPhase('finished');const result=done.reduce((a,b)=>a+b,0);setMood('win');try{const old=readBest();if(old===null||result<old){localStorage.setItem(KEY,String(result));setBest(result);setMessage('완주! 이 기기의 최고 기록을 저장했어요.');}else setMessage('완주! 다음 도전에서는 기록을 더 줄여보자.');}catch{setMessage('완주! 브라우저 저장이 차단되어 기록은 저장하지 못했어요.');}return;}const index=hole+1;setHole(index);setStrokes(0);ball.current={...COURSES[index].start,vx:0,vy:0};setPosition({...COURSES[index].start});setAngle(0);setPower(50);setMood('ready');setPhase('ready');setMessage(COURSES[index].hint);}
 function restart(){cancelAnimationFrame(frame.current);busy.current=false;cancelDrag();setHole(0);setStrokes(0);setScores([]);setPhase('ready');setMood('ready');ball.current={...COURSES[0].start,vx:0,vy:0};setPosition({...COURSES[0].start});setPower(50);setAngle(0);setConfirmReset(false);setMessage('새로운 라운드! 이번엔 더 적은 타수로.');}
 async function saveResult(){setExporting(true);try{await document.fonts.ready;const img=new Image();img.src='/images/hyomin-golfer-reactions.png';await img.decode();const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1100;const c=canvas.getContext('2d')!;c.fillStyle='#f5f3e8';c.fillRect(0,0,900,1100);c.fillStyle='#244b3b';c.fillRect(30,30,840,1040);c.fillStyle='#f5e3b1';c.textAlign='center';c.font='24px sans-serif';c.fillText('RE09 MINI PUTT · 효민이의 퍼팅 도전',450,95);c.drawImage(img,0,img.height/2,img.width/2,img.height/2,260,130,380,480);c.fillStyle='#fff8e8';c.font='bold 78px sans-serif';c.fillText(`${scores.reduce((s,n)=>s+n,0)}타`,450,720);c.font='25px sans-serif';c.fillText('5개 홀 완주 · 개인 플레이 기록',450,775);c.font='23px sans-serif';scores.forEach((s,i)=>c.fillText(`${i+1}H`,150+i*150,855));scores.forEach((s,i)=>c.fillText(`${s}타`,150+i*150,900));c.font='19px sans-serif';c.fillText('단국대 부동산학과 09 · GOOD GOLF, GOOD COMPANY',450,1000);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('export'))));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='RE09-효민이-퍼팅기록.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);setMessage('결과 이미지 다운로드를 시작했어요.');}catch{setMessage('이미지를 저장하지 못했어요. 다시 눌러 주세요.');}finally{setExporting(false);}}
 const preview=shotVelocity(angle,power),length=Math.hypot(preview.vx,preview.vy),end={x:position.x+preview.vx/length*(35+power*.65),y:position.y+preview.vy/length*(35+power*.65)};
 return <div className="club-container inner-page putt-page"><a className="putt-back" href="#/more"><ArrowLeft size={16}/> 클럽 데스크</a><header className="putt-title"><div><span className="eyebrow">RE09 ARCADE / VOL. 01</span><h1>효민이의 퍼팅 도전<span>MINI PUTT</span></h1><p>퍼팅은 신중하게. 리액션은 누구보다 격하게.</p></div><span className="putt-best"><Trophy size={17}/> MY BEST <b>{best===null?'첫 도전':`${best}타`}</b></span></header>
 <div className="putt-layout"><section className="putt-stage" aria-label="퍼팅 게임"><div className="putt-scorebar"><span><Flag size={15}/> HOLE <b>{hole+1} / 5</b></span><span>PAR <b>{course.par}</b></span><span>이번 홀 <b>{strokes}타</b></span><span>합계 <b>{total}타</b></span></div>
 {phase==='finished'?<div className="putt-finish"><span className="eyebrow">ROUND COMPLETE</span><h2>효민이, 오늘도 해냈다!</h2><div className="putt-actor putt-win" role="img" aria-label="효민이의 격한 환호"/><strong>{total}<small>타</small></strong><p>5개 홀 · 기준 {COURSES.reduce((s,c)=>s+c.par,0)}타</p><button ref={transitionButton} className="button button-brass" onClick={restart}><RotateCcw size={18}/> 다시 도전</button><button className="putt-save" disabled={exporting} onClick={saveResult}><Download size={16}/>{exporting?'저장 중…':'결과 이미지 저장'}</button></div>:<>
 <div className="putt-course-heading"><strong>{course.name}</strong><span>{course.hint}</span></div>
 <div className="putt-board-wrap"><svg ref={svg} viewBox="0 0 360 500" className="putt-board" role="img" aria-label={`${hole+1}번 홀 퍼팅 코스. 아래 방향과 세기 조절로도 플레이할 수 있습니다.`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
 <defs><pattern id="putt-grass" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#b9d5a2"/><path d="M0 0H44V22H0Z" fill="#c4deb0"/></pattern><radialGradient id="putt-ball"><stop stopColor="#fff"/><stop offset="1" stopColor="#dce5d4"/></radialGradient></defs>
 <rect x="5" y="5" width="350" height="490" rx="30" fill="#587e54"/><rect x="16" y="16" width="328" height="468" rx="22" fill="url(#putt-grass)" stroke="#e2e9bd" strokeWidth="3"/>
 {course.sand.map((r,i)=><g key={'sand'+i}><rect {...{x:r.x,y:r.y,width:r.w,height:r.h}} rx="16" fill="#eddaa4" stroke="#cdb87c" strokeWidth="3"/><text x={r.x+r.w/2} y={r.y+r.h/2} textAnchor="middle" fill="#8d7949" fontSize="10">BUNKER</text></g>)}
 {course.water.map((r,i)=><g key={'water'+i}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx="0" fill="#82bdcb" stroke="#5292a2" strokeWidth="2"/><path d={`M${r.x+15} ${r.y+35}q10 -8 20 0t20 0t20 0 M${r.x+15} ${r.y+75}q10 -8 20 0t20 0t20 0`} fill="none" stroke="#c7e7e8" strokeWidth="2"/><text x={r.x+r.w/2} y={r.y+r.h-15} textAnchor="middle" fill="#285e6d" fontSize="10">WATER +1</text></g>)}
 {course.walls.map((r,i)=><rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill="#718575" stroke="#435a4a" strokeWidth="3"/>)}
 <circle cx={course.cup.x} cy={course.cup.y} r="19" fill="#e6edbc" opacity=".65"/><ellipse cx={course.cup.x} cy={course.cup.y} rx="11" ry="10" fill="#243d2d"/><path d={`M${course.cup.x} ${course.cup.y-3}v-42l24 8-24 8`} fill="#f4e8b7" stroke="#4b6844" strokeWidth="2"/>
 {phase==='ready'&&<g><circle cx={position.x} cy={position.y} r="23" fill="none" stroke="#fff9dd" strokeDasharray="3 5"/><line x1={position.x} y1={position.y} x2={end.x} y2={end.y} stroke="#37573c" strokeWidth="2" strokeDasharray="5 4"/>{drag&&<line x1={position.x} y1={position.y} x2={drag.x} y2={drag.y} stroke="#fff" opacity=".65"/>}</g>}
 {phase!=='holed'&&<g><ellipse cx={position.x+2} cy={position.y+4} rx="8" ry="5" fill="#35573840"/><circle cx={position.x} cy={position.y} r="7" fill="url(#putt-ball)" stroke="#62765c" strokeWidth="1"/></g>}
 </svg>
 {mood==='lose'&&phase==='ready'&&<div className="putt-miss-reaction"><div className="putt-actor putt-lose" role="img" aria-label="효민이 폭풍 좌절"/><span>으아아! 다시!</span></div>}
 {(phase==='holed'||phase==='capped')&&<div className="putt-hole-overlay"><span>{phase==='holed'?'NICE PUTT!':'다음 홀에서 만회하자!'}</span><div className={'putt-actor putt-overlay-actor putt-'+(phase==='holed'?'win':'lose')} role="img" aria-label={phase==='holed'?'효민이 대환호':'효민이 폭풍 좌절'}/><h2>{strokes}타 · {phase==='holed'?'홀 아웃':'타수 제한'}</h2><button className="button button-brass" ref={transitionButton} onClick={next}>{hole===4?'최종 결과':'다음 홀'}<ArrowRight size={18}/></button></div>}</div>
 <fieldset className="putt-controls" disabled={phase!=='ready'}><legend>방향·세기로도 퍼팅할 수 있어요</legend><label>방향 <b>{angle}°</b><input aria-label="퍼팅 방향" type="range" min="-180" max="180" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label><label>세기 <b>{power}%</b><input aria-label="퍼팅 세기" type="range" min="1" max="100" value={power} onChange={e=>setPower(Number(e.target.value))}/></label><button className="button button-green" onClick={()=>shoot()}>퍼팅! <ArrowRight size={17}/></button></fieldset></>}
 </section><aside className="putt-side"><div className="putt-player"><div className="putt-player-label"><span>PLAYER 01</span><span>DKU RE09</span></div><div className={'putt-actor putt-'+mood} role="img" aria-label={`김효민 캐릭터: ${{ready:'준비',swing:'퍼팅',win:'격한 환호',lose:'격한 좌절'}[mood]}`}/><div className="putt-player-name"><h2>김효민</h2><span>오늘은 내가 퍼팅왕</span></div><p className="putt-message" role="status">{message}</p></div>
 <div className="putt-scorecard"><span className="eyebrow">YOUR SCORECARD</span><div>{COURSES.map((c,i)=><span key={c.name} aria-current={hole===i?'step':undefined}><small>{i+1}H · PAR {c.par}</small><b>{scores[i]??(i===hole&&phase!=='finished'?strokes:'—')}</b></span>)}</div></div>
 <details className="putt-help"><summary>플레이 방법 & 규칙</summary><p>공을 누른 뒤 보내려는 방향의 반대로 당기고 놓으세요. 길게 당길수록 강하게 굴러갑니다. 점선은 방향 안내이며 실제 이동 거리는 아니에요.</p><p>아래 슬라이더와 퍼팅 버튼으로도 플레이할 수 있어요. 방향 0°는 위, 90°는 오른쪽입니다.</p><p>벽은 튕기고, 모래는 감속, 물은 1벌타 후 직전 위치로 복귀합니다. 홀당 최대 10타로 마무리합니다.</p><p>기록은 이 브라우저에만 저장되며, 실제 골프 랭킹에는 반영하지 않습니다.</p></details>
 <div className="putt-options"><button aria-pressed={sound} onClick={()=>{if(!sound){try{audio.current??=new AudioContext();void audio.current.resume();}catch{/* Sound is optional. */}}setSound(!sound);}}>{sound?<Volume2 size={16}/>:<VolumeX size={16}/>} 효과음 {sound?'켜짐':'꺼짐'}</button><button disabled={phase==='moving'} onClick={()=>setConfirmReset(true)}><RotateCcw size={16}/> 처음부터</button></div>{confirmReset&&<div className="putt-reset"><p>현재 진행을 지우고 새로 시작할까요?</p><button onClick={restart}>새 게임 시작</button><button onClick={()=>setConfirmReset(false)}>계속 플레이</button></div>}
 </aside></div></div>;
}
