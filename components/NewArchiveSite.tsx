import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Crown,
  MapPin,
  Medal,
  Phone,
  Trophy,
  Wallet,
} from 'lucide-react';
import { COURSE_LOCATIONS, galleryPhotos, getProcessRankings, members, records } from '../utils/golfData';

const ledgerTransactions = [
  { date: '2025.11.29', desc: '분기 회비 수납', amount: 1600000 },
  { date: '2025.11.29', desc: '골프용품 구매', amount: -300000 },
  { date: '2025.11.29', desc: '라운드 간식 및 음료', amount: -15000 },
  { date: '2025.11.29', desc: '네임 스티커 제작', amount: -33000 },
  { date: '2025.11.29', desc: '라운드 뒤풀이 식사', amount: -580000 },
  { date: '2025.11.29', desc: '2차 주류 및 음료', amount: -134000 },
  { date: '2025.11.29', desc: '소모품 구입', amount: -27500 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-120px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

const formatCurrency = (value: number) => `${value < 0 ? '-' : ''}₩${Math.abs(value).toLocaleString()}`;

const NewArchiveSite: React.FC = () => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();
  const topMembers = ranking.slice(0, 6);
  const featuredGallery = galleryPhotos[0];
  const courseMeta = latestRecord ? COURSE_LOCATIONS[latestRecord.location] : null;
  const participantCount = latestRecord?.attendees.length ?? 0;
  const averageScore =
    latestRecord && latestRecord.attendees.length
      ? Math.round(latestRecord.attendees.reduce((sum, player) => sum + player.score, 0) / latestRecord.attendees.length)
      : 0;
  const balance = ledgerTransactions.reduce((acc, entry) => acc + entry.amount, 0);
  const bestGross = latestRecord?.score ?? 0;
  const recentScores = latestRecord?.attendees.slice().sort((a, b) => a.score - b.score) ?? [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f3eee7] text-[#1c242d]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(117,129,145,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(198,186,170,0.22),transparent_30%),linear-gradient(180deg,#f7f4ef_0%,#f1ece5_44%,#ece6df_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,36,45,0.03)_1px,transparent_1px),linear-gradient(rgba(28,36,45,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#1c242d]/8 bg-[#f3eee7]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button onClick={() => scrollToSection('hero')} className="text-left">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#7e8792]">Private archive edition</p>
            <h1 className="mt-1 font-serif text-[1.05rem] uppercase tracking-[0.16em] text-[#1c242d] sm:text-[1.25rem]">
              DKU-RE09 Reserve
            </h1>
          </button>

          <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55606c] lg:flex">
            <button onClick={() => scrollToSection('hero')}>개요</button>
            <button onClick={() => scrollToSection('leaderboard')}>랭킹</button>
            <button onClick={() => scrollToSection('round')}>라운드</button>
            <button onClick={() => scrollToSection('members')}>멤버</button>
            <button onClick={() => scrollToSection('club-brief')}>클럽 브리프</button>
          </nav>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#1c242d]/10 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c242d] transition hover:border-[#1c242d]/18 hover:bg-white"
          >
            <ArrowLeft size={14} />
            기존 사이트
          </a>
        </div>
      </header>

      <main className="pb-24">
        <section id="hero" className="px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="overflow-hidden rounded-[2.5rem] border border-[#1c242d]/8 bg-[#111922] text-[#ece5dc] shadow-[0_40px_120px_-70px_rgba(17,25,34,0.75)]"
              >
                <div className="grid min-h-[38rem] lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,180,157,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(101,115,129,0.16),transparent_30%)]" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#cbbca8]">
                        Current round archive
                      </div>
                      <h2 className="mt-8 max-w-[10ch] break-keep font-serif text-[2.8rem] leading-[0.9] tracking-[-0.045em] text-[#f2ece3] sm:text-[4.4rem] lg:text-[5.7rem]">
                        기록을 가장
                        <br />
                        품위 있게
                        <br />
                        남기는 방법
                      </h2>
                      <p className="mt-6 max-w-[30rem] break-keep text-[15px] leading-8 text-[#c6c0b8] sm:text-[16px]">
                        최신 라운드 결과, 멤버 흐름, 코스 기록, 자산 브리프까지 한 화면 안에서 차분하게 읽히도록 다시 정리한
                        별도 아카이브 버전입니다.
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => scrollToSection('round')}
                        className="inline-flex items-center justify-center gap-3 rounded-full bg-[#e9dfd2] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#111922] transition hover:bg-[#f4ece3]"
                      >
                        라운드 기록 보기
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => scrollToSection('members')}
                        className="inline-flex items-center justify-center gap-3 rounded-full border border-white/14 bg-white/5 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#ece5dc] transition hover:bg-white/10"
                      >
                        멤버 명단 보기
                      </button>
                    </div>

                    <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a49b8f]">최신 우승</p>
                        <p className="mt-3 break-words font-serif text-[1.7rem] leading-none text-[#f2ece3]">{latestRecord?.winner}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a49b8f]">참가 인원</p>
                        <p className="mt-3 font-serif text-[1.7rem] leading-none text-[#f2ece3]">{participantCount}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a49b8f]">평균 타수</p>
                        <p className="mt-3 font-serif text-[1.7rem] leading-none text-[#f2ece3]">{averageScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative min-h-[20rem] border-t border-white/8 lg:min-h-full lg:border-l lg:border-t-0">
                    <img
                      src={featuredGallery?.src || '/images/round1_group.jpg'}
                      alt="Latest round"
                      className="h-full w-full object-cover brightness-[0.68] contrast-[1.03] saturate-[0.72]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,25,34,0.16)_0%,rgba(17,25,34,0.32)_26%,rgba(17,25,34,0.8)_100%)]" />
                    <div className="absolute inset-[18px] rounded-[2rem] border border-white/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <p className="text-[10px] uppercase tracking-[0.34em] text-[#cbbca8]">Latest course</p>
                      <h3 className="mt-3 max-w-[14ch] break-keep font-serif text-[2rem] leading-[0.98] tracking-[-0.03em] text-white sm:text-[2.7rem]">
                        {latestRecord?.location}
                      </h3>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] bg-white/8 p-4 backdrop-blur-sm">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8d0d7]">라운드 날짜</p>
                          <p className="mt-3 text-[0.98rem] text-white">{latestRecord?.date}</p>
                        </div>
                        <div className="rounded-[1.4rem] bg-[#e9dfd2] p-4 text-[#111922]">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[#66717c]">베스트 스코어</p>
                          <p className="mt-3 font-serif text-[1.8rem] leading-none">{bestGross}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: 'easeOut' }}
                className="grid gap-5"
              >
                <div className="rounded-[2.2rem] border border-[#1c242d]/8 bg-white/70 p-6 shadow-[0_25px_90px_-70px_rgba(17,25,34,0.45)] sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[#7f8790]">Season brief</p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[1.6rem] bg-[#111922] p-5 text-[#ece5dc]">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#a49b8f]">현재 리더</p>
                      <p className="mt-3 break-words font-serif text-[2rem] leading-none">{ranking[0]?.name}</p>
                      <p className="mt-3 text-[14px] text-[#c6c0b8]">넷 스코어 {ranking[0]?.netScoreDisplay}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[1.4rem] bg-[#ece5dc] p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a736a]">총 멤버</p>
                        <p className="mt-3 font-serif text-[2rem] leading-none text-[#111922]">{members.length}</p>
                      </div>
                      <div className="rounded-[1.4rem] bg-[#d7d0c7] p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#6d675f]">클럽 잔액</p>
                        <p className="mt-3 break-words font-serif text-[1.5rem] leading-none text-[#111922]">{formatCurrency(balance)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2.2rem] border border-[#1c242d]/8 bg-[#dfe4ea] p-6 sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[#66717c]">Reserve note</p>
                  <p className="mt-5 break-keep font-serif text-[1.8rem] leading-[1.03] tracking-[-0.03em] text-[#111922] sm:text-[2.3rem]">
                    장식보다 기록이 먼저 보이게.
                  </p>
                  <p className="mt-4 break-keep text-[14px] leading-7 text-[#44515d]">
                    이 버전은 마케팅 랜딩이 아니라 멤버 전용 기록집처럼 보이도록 설계했습니다. 데이터가 먼저 읽히고,
                    그래도 화면은 거칠지 않게 정리하는 방향입니다.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-7 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#7e8792]">Leaderboard</p>
              <h3 className="mt-4 break-keep font-serif text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-[#1c242d] sm:text-[3.4rem]">
                지금 가장 안정적으로
                <br />
                좋은 흐름을 만든 멤버들
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
              <motion.div
                {...fadeInUp}
                className="rounded-[2.4rem] border border-[#1c242d]/8 bg-[#111922] p-6 text-[#ece5dc] shadow-[0_36px_110px_-75px_rgba(17,25,34,0.8)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[#c3b39f]">Champion seat</p>
                  <Crown size={18} className="text-[#d9ccb9]" />
                </div>
                <p className="mt-6 break-words font-serif text-[2.8rem] leading-[0.9] tracking-[-0.045em] sm:text-[4rem]">
                  {ranking[0]?.name}
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#a49b8f]">넷 스코어</p>
                    <p className="mt-3 font-serif text-[2rem] leading-none">{ranking[0]?.netScoreDisplay}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#a49b8f]">최근 스코어</p>
                    <p className="mt-3 font-serif text-[2rem] leading-none">{ranking[0]?.latestScore}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="rounded-[2.4rem] border border-[#1c242d]/8 bg-white/72 p-5 shadow-[0_28px_90px_-72px_rgba(17,25,34,0.4)] sm:p-7"
              >
                <div className="space-y-3">
                  {ranking.slice(0, 5).map((member, index) => (
                    <div
                      key={member.name}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.6rem] border px-4 py-4 sm:px-5 ${
                        index === 0 ? 'border-[#1c242d]/10 bg-[#e9dfd2]' : 'border-[#1c242d]/7 bg-[#faf7f3]'
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111922] text-sm font-semibold text-[#ece5dc]">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-[1rem] font-medium text-[#1c242d] sm:text-[1.05rem]">{member.name}</p>
                        <p className="mt-1 break-words text-[12px] text-[#6a7380]">{member.role}</p>
                      </div>
                      <div className="rounded-full bg-[#dfe4ea] px-3 py-2 text-[13px] font-semibold text-[#1c242d]">
                        {member.netScoreDisplay}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="round" className="border-y border-[#1c242d]/8 bg-[#eef1f4] px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-7 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#7e8792]">Round report</p>
              <h3 className="mt-4 break-keep font-serif text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-[#1c242d] sm:text-[3.4rem]">
                가장 최근 라운드를
                <br />
                한 장의 리포트처럼
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <motion.div
                {...fadeInUp}
                className="overflow-hidden rounded-[2.4rem] border border-[#1c242d]/8 bg-[#111922] text-[#ece5dc] shadow-[0_36px_110px_-78px_rgba(17,25,34,0.8)]"
              >
                <img
                  src={courseMeta?.img}
                  alt={latestRecord?.location}
                  className="h-64 w-full object-cover brightness-[0.72] contrast-[1.03] saturate-[0.7]"
                />
                <div className="border-t border-white/8 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#c3b39f]">Course archive</p>
                      <h4 className="mt-3 max-w-[15ch] break-keep font-serif text-[1.9rem] leading-[0.98] tracking-[-0.03em] sm:text-[2.5rem]">
                        {latestRecord?.location}
                      </h4>
                    </div>
                    <MapPin size={18} className="shrink-0 text-[#d9ccb9]" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.45rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#a49b8f]">날짜</p>
                      <p className="mt-3 text-[0.98rem]">{latestRecord?.date}</p>
                    </div>
                    <div className="rounded-[1.45rem] bg-[#e9dfd2] p-4 text-[#111922]">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#64707c]">우승자</p>
                      <p className="mt-3 break-words text-[0.98rem] font-medium">{latestRecord?.winner}</p>
                    </div>
                  </div>
                  <p className="mt-6 break-words text-[14px] leading-7 text-[#c6c0b8]">{courseMeta?.address}</p>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="rounded-[2.4rem] border border-[#1c242d]/8 bg-white/72 p-5 shadow-[0_28px_90px_-72px_rgba(17,25,34,0.4)] sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#7e8792]">Scoreboard</p>
                    <p className="mt-2 text-[14px] text-[#6a7380]">참가자 전체 스코어</p>
                  </div>
                  <CalendarDays size={18} className="text-[#6a7380]" />
                </div>
                <div className="space-y-3">
                  {recentScores.map((attendee, index) => (
                    <div
                      key={`${attendee.name}-${index}`}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.6rem] border px-4 py-4 sm:px-5 ${
                        index === 0 ? 'border-[#1c242d]/10 bg-[#e9dfd2]' : 'border-[#1c242d]/7 bg-[#faf7f3]'
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111922] text-sm font-semibold text-[#ece5dc]">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-[1rem] font-medium text-[#1c242d] sm:text-[1.05rem]">{attendee.name}</p>
                        <p className="mt-1 text-[12px] text-[#6a7380]">
                          전반 {attendee.front} / 후반 {attendee.back}
                        </p>
                      </div>
                      <div className="rounded-full bg-[#dfe4ea] px-3 py-2 text-[13px] font-semibold text-[#1c242d]">
                        {attendee.score}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="members" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-7 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#7e8792]">Members</p>
              <h3 className="mt-4 break-keep font-serif text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-[#1c242d] sm:text-[3.4rem]">
                라운드의 분위기를
                <br />
                만드는 핵심 멤버들
              </h3>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topMembers.map((member, index) => (
                <motion.article
                  key={member.name}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[2.2rem] border border-[#1c242d]/8 bg-white/72 shadow-[0_26px_80px_-70px_rgba(17,25,34,0.45)]"
                >
                  <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-20 w-20 rounded-[1.3rem] object-cover shadow-[0_20px_50px_-30px_rgba(17,25,34,0.5)]"
                    />
                    <div className="flex items-center gap-2 text-[#7e8792]">
                      {member.role === '?뚯옣' && <Crown size={16} />}
                      {member.role === '珥앸Т' && <Medal size={16} />}
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h4 className="break-words font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#1c242d]">
                      {member.name}
                    </h4>
                    <p className="mt-3 break-words text-[12px] text-[#6a7380]">{member.role}</p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-[1.1rem] bg-[#eef1f4] p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-[#7e8792]">HC</p>
                        <p className="mt-3 text-[1rem] font-medium text-[#1c242d]">
                          {member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : '신규'}
                        </p>
                      </div>
                      <div className="rounded-[1.1rem] bg-[#eef1f4] p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-[#7e8792]">최근</p>
                        <p className="mt-3 text-[1rem] font-medium text-[#1c242d]">{member.latestScore}</p>
                      </div>
                      <div className="rounded-[1.1rem] bg-[#eef1f4] p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-[#7e8792]">NET</p>
                        <p className="mt-3 text-[1rem] font-medium text-[#1c242d]">{member.netScoreDisplay}</p>
                      </div>
                    </div>

                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="mt-5 inline-flex items-center gap-2 break-all rounded-full border border-[#1c242d]/8 bg-white px-4 py-2 text-[13px] text-[#1c242d]"
                      >
                        <Phone size={14} />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="club-brief" className="border-t border-[#1c242d]/8 bg-[#111922] px-4 py-8 text-[#ece5dc] sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-7 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#c3b39f]">Club brief</p>
              <h3 className="mt-4 break-keep font-serif text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-[#f2ece3] sm:text-[3.4rem]">
                자산과 사진까지
                <br />
                한 번에 읽히는 마감
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <motion.div
                {...fadeInUp}
                className="rounded-[2.4rem] border border-white/10 bg-white/5 p-5 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#c3b39f]">Financial brief</p>
                    <p className="mt-2 text-[14px] text-[#c6c0b8]">최근 사용 내역과 현재 잔액</p>
                  </div>
                  <Wallet size={18} className="text-[#d9ccb9]" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[1.6rem] border border-white/10 bg-[#18212c] p-5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#a49b8f]">현재 잔액</p>
                    <p className="mt-4 break-words font-serif text-[2.4rem] leading-none tracking-[-0.04em] text-[#f2ece3] sm:text-[3rem]">
                      {formatCurrency(balance)}
                    </p>
                    <p className="mt-4 text-[14px] leading-7 text-[#c6c0b8]">최근 클럽 지출을 반영한 기준 잔액입니다.</p>
                  </div>
                  <div className="rounded-[1.6rem] bg-[#e9dfd2] p-5 text-[#111922]">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#64707c]">회비 계좌</p>
                    <p className="mt-4 break-all font-medium leading-8">KakaoBank 3333-16-4428815</p>
                    <p className="mt-4 text-[14px] leading-7 text-[#55606c]">총무 기준으로 관리되는 클럽 회비 계좌입니다.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {ledgerTransactions.slice(0, 4).map((entry) => (
                    <div
                      key={`${entry.date}-${entry.desc}`}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.5rem] border border-white/10 bg-[#18212c] px-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="break-keep text-[1rem] text-[#f2ece3]">{entry.desc}</p>
                        <p className="mt-1 text-[12px] text-[#9ca6af]">{entry.date}</p>
                      </div>
                      <p className={`text-[1rem] font-semibold ${entry.amount > 0 ? 'text-[#e9dfd2]' : 'text-[#f1b69f]'}`}>
                        {formatCurrency(entry.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/5"
              >
                <div className="relative">
                  <img
                    src={featuredGallery?.src || '/images/round1_group.jpg'}
                    alt="Archive photograph"
                    className="h-72 w-full object-cover brightness-[0.72] contrast-[1.03] saturate-[0.7]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,25,34,0.08)_0%,rgba(17,25,34,0.28)_40%,rgba(17,25,34,0.88)_100%)]" />
                  <div className="absolute inset-[18px] rounded-[2rem] border border-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#c3b39f]">Archive photograph</p>
                    <h4 className="mt-3 break-keep font-serif text-[1.9rem] leading-[0.98] tracking-[-0.03em] text-white sm:text-[2.6rem]">
                      코스의 기억과
                      <br />
                      현장의 장면
                    </h4>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.3rem] bg-white/8 p-4 backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8d0d7]">촬영 날짜</p>
                        <p className="mt-3 text-[0.98rem] text-white">{featuredGallery?.date}</p>
                      </div>
                      <div className="rounded-[1.3rem] bg-white/8 p-4 backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8d0d7]">참가 인원</p>
                        <p className="mt-3 text-[0.98rem] text-white">{featuredGallery?.participants}명</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewArchiveSite;
