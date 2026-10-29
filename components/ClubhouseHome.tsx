import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight,ArrowRight,Flag,CalendarDays,Trophy,Wallet,Users } from 'lucide-react';
import { records,galleryPhotos,nextSchedule,clubFinanceSummary,getProcessRankings,clubEvents } from '../utils/golfData';
import { isUpcoming } from '../utils/clubNavigation';
export default function ClubhouseHome(){
 const latest=records[0],upcoming=isUpcoming(nextSchedule.date),leader=getProcessRankings()[0];
 return <div className="club-container home-content">
 <div className="edition-line"><span>THE RE09 CLUBHOUSE</span><span>함께 쌓아가는 우리의 골프 기록</span></div>
 <section className="editorial-hero" aria-labelledby="home-heading">
 <div className="hero-copy"><span className="eyebrow light"><i/> GOOD GOLF. BETTER COMPANY.</span>
 <motion.h1 id="home-heading" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45}}>함께라서<br/>더 좋은 <em>라운드.</em></motion.h1>
 <p>스코어 너머의 즐거움.<br/>09 동기들과 함께하는 필드 위의 시간.</p>
 <a className="button button-brass" href="#/rounds">우리의 라운드 <ArrowUpRight size={18}/></a>
 <div className="hero-bottom"><img className="hero-mascot" src="/images/dku-re09-bear-male-v2.png" alt="DKU RE09 곰 마스코트"/><span>단국대학교 부동산학과 09 골프 모임<br/><b>MEMBERS' CLUB</b></span></div></div>
 <div className="hero-photograph hero-clubhouse"><img src="/images/clubhouse-hero-ai.png" alt="따뜻한 햇살이 내려앉은 골프장과 클럽하우스 테라스 일러스트" fetchPriority="high"/><div className="photo-caption"><span>THE RE09 CLUBHOUSE</span><span>A PLACE TO COME TOGETHER</span></div></div></section>
 <section className="next-round-strip" aria-label="다음 라운드 안내"><span className="round-symbol"><Flag size={23}/></span><div><span className="eyebrow">NEXT ROUND</span><h2>{upcoming?nextSchedule.location:'다음 만남을 준비하고 있어요.'}</h2><p>{upcoming?nextSchedule.date:'등록된 다음 일정이 없습니다. 지난 라운드의 기록을 먼저 만나보세요.'}</p></div><a href="#/rounds" className="text-link">{upcoming?'일정 확인':'라운드 모아보기'} <ArrowRight size={18}/></a></section>
 <section className="home-journal"><div className="section-heading"><div><span className="eyebrow">THE LATEST CHAPTER</span><h2>우리의 최근 라운드</h2></div><a className="text-link" href="#/rounds">전체 기록 <ArrowUpRight size={17}/></a></div>
 <div className="journal-grid"><a className="journal-feature" href={'#/rounds?date='+latest.date}><div className="journal-image"><img src="/images/round2/round2-01.jpg" alt="코브스윙CC 라운드 풍경" loading="lazy"/><span className="image-label">ROUND 02 · 라운드 완료</span></div><div className="journal-copy"><span className="eyebrow">{latest.date} · {latest.attendees.length}명 함께한 날</span><h3>{latest.location}</h3><p>이날의 스코어, 조편성, 그리고 함께 남긴 사진들.</p><span className="text-link">라운드 이야기 <ArrowUpRight size={18}/></span></div></a>
 <div className="home-side"><div className="champion-card"><Trophy size={24}/><span className="eyebrow">ROUND CHAMPION</span><div><h3>{latest.winner}</h3><strong>{latest.score}<small>타</small></strong></div><p>최근 라운드 최저 타수</p><a href="#/ranking" className="text-link">전체 평균 랭킹 <ArrowRight size={17}/></a></div><a className="finance-card" href="#/ledger"><span className="eyebrow"><Wallet size={16}/> CLUB ACCOUNT</span><h3>회비 현황</h3><strong>{clubFinanceSummary.currentCash.toLocaleString()}<small>원</small></strong><span className="finance-caption">장부에 기록된 현재 잔액 <ArrowUpRight size={18}/></span></a></div></div></section>
 <section className="club-pulse"><div className="pulse-item"><Users/><div><span>함께하는 멤버</span><strong>{clubFinanceSummary.memberCount}<small>명</small></strong></div><a href="#/members" aria-label="전체 멤버 보기"><ArrowUpRight/></a></div><div className="pulse-item"><Flag/><div><span>기록된 라운드</span><strong>{records.length}<small>회</small></strong></div><a href="#/rounds" aria-label="전체 라운드 기록 보기"><ArrowUpRight/></a></div><div className="pulse-item"><Trophy/><div><span>평균 타수 리더</span><strong className="name-stat">{leader?.name??'기록 없음'}</strong></div><a href="#/ranking" aria-label="평균 타수 랭킹 보기"><ArrowUpRight/></a></div></section>
 <section className="home-memories"><div className="section-heading"><div><span className="eyebrow">OFF THE SCORECARD</span><h2>스코어보다 오래 남는 순간</h2></div><a href="#/gallery" className="text-link">사진첩 <ArrowUpRight size={17}/></a></div><div className="memory-grid">{galleryPhotos.filter(photo=>['round2-15','round2-05','new-1'].includes(photo.id)).map((photo,index)=><a href="#/gallery" key={photo.id}><img src={photo.src} alt={photo.location+' 모임 사진 '+(index+1)} loading="lazy"/><span>{photo.date}<ArrowUpRight size={17}/></span></a>)}</div></section>
 {clubEvents.length>0&&<section className="club-notices"><div><span className="eyebrow">CLUB NOTES</span><h2>동기들의 소식</h2></div>{clubEvents.map(event=><article key={event.id}><CalendarDays size={19}/><div><span className="notice-date">{event.date} · {isUpcoming(event.date)?'예정':'지난 소식'}</span><h3>{event.title}</h3><p>{event.description}</p></div></article>)}</section>}
 </div>;
}
