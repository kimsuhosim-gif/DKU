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
  Users,
  Wallet,
} from 'lucide-react';
import { COURSE_LOCATIONS, galleryPhotos, getProcessRankings, members, records } from '../utils/golfData';

const ledgerTransactions = [
  { date: '2025.11.29', desc: '분기 회비 수납', amount: 1600000 },
  { date: '2025.11.29', desc: '골프샵 상품권 구입', amount: -300000 },
  { date: '2025.11.29', desc: '생수 및 다과', amount: -15000 },
  { date: '2025.11.29', desc: '네임스티커 제작', amount: -33000 },
  { date: '2025.11.29', desc: '라운드 후 저녁 식사', amount: -580000 },
  { date: '2025.11.29', desc: '2차 주류 및 음료', amount: -134000 },
  { date: '2025.11.29', desc: '시상품 포장', amount: -27500 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const formatCurrency = (value: number) => `₩${Math.abs(value).toLocaleString()}`;

const NewArchiveSite: React.FC = () => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();
  const topMembers = ranking.slice(0, 6);
  const featuredGallery = galleryPhotos[0];
  const courseMeta = latestRecord ? COURSE_LOCATIONS[latestRecord.location] : null;
  const participantCount = latestRecord?.attendees.length || 0;
  const averageScore =
    latestRecord && latestRecord.attendees.length
      ? Math.round(latestRecord.attendees.reduce((sum, player) => sum + player.score, 0) / latestRecord.attendees.length)
      : 0;
  const balance = ledgerTransactions.reduce((acc, entry) => acc + entry.amount, 0);
  const roleCounts = members.reduce(
    (acc, member) => {
      if (member.role === '회장') acc.captain += 1;
      else if (member.role === '총무') acc.secretary += 1;
      else acc.member += 1;
      return acc;
    },
    { captain: 0, secretary: 0, member: 0 }
  );

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0b1016] text-[#e4ddd4]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(132,121,104,0.15),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(53,72,97,0.18),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(87,95,108,0.1),transparent_36%),linear-gradient(180deg,#0b1016_0%,#101720_34%,#16202b_68%,#0f161e_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(132,121,104,0.12),transparent_60%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b1016]/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => scrollToSection('hero')} className="text-left">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#908475]">멤버 전용 아카이브</p>
            <h1 className="mt-1 font-serif text-[1rem] uppercase tracking-[0.16em] text-[#e4ddd4] sm:text-xl lg:text-2xl">
              DKU-RE09 Reserve
            </h1>
          </button>

          <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c5bcb2] lg:flex">
            <button onClick={() => scrollToSection('hero')}>개요</button>
            <button onClick={() => scrollToSection('leaderboard')}>랭킹</button>
            <button onClick={() => scrollToSection('round')}>라운드</button>
            <button onClick={() => scrollToSection('members')}>멤버</button>
            <button onClick={() => scrollToSection('archive')}>아카이브</button>
          </nav>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#8f867b]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e4ddd4] shadow-[0_10px_30px_-20px_rgba(143,134,123,0.34)] transition hover:border-[#8f867b]/35 hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            기존 사이트
          </a>
        </div>
      </header>

      <main className="pb-24">
        <section id="hero" className="px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2.8rem] border border-[#8f867b]/12 bg-[linear-gradient(145deg,#141b24_0%,#0d141c_48%,#131b24_100%)] p-6 shadow-[0_55px_180px_-70px_rgba(0,0,0,0.95)] sm:p-8 lg:min-h-[43rem]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,121,104,0.14),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(95,108,130,0.08),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_30%)]" />
                <div className="absolute inset-[1px] rounded-[2.5rem] border border-white/6" />
                <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-[#8f867b]/14" />
                <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(81,95,119,0.16),transparent_72%)] blur-2xl" />
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center rounded-full border border-[#8f867b]/24 bg-[#8f867b]/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.36em] text-[#c7beb4] shadow-[0_12px_40px_-25px_rgba(143,134,123,0.4)]">
                    시즌 아카이브 브리프
                  </div>
                  <h2 className="mt-9 max-w-[11ch] font-serif text-[2.55rem] leading-[0.9] tracking-[-0.03em] text-[#e4ddd4] sm:text-[4.1rem] lg:text-[6.1rem]">
                    조용하게,
                    <span className="block text-[#8f867b]">그러나 품위 있게.</span>
                  </h2>
                  <p className="mt-7 max-w-[34rem] text-[15px] leading-8 text-[#c7c1b4] sm:text-[16px]">
                    한 번의 라운드와 멤버의 흐름, 코스의 기억, 클럽 자산까지 한 화면 안에서 정제된 기록물처럼
                    읽히도록 설계한 프라이빗 멤버 아카이브입니다.
                  </p>

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => scrollToSection('round')}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#11130f] shadow-[0_24px_55px_-28px_rgba(124,117,107,0.55)] transition hover:brightness-105"
                    >
                      라운드 기록 열기
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => scrollToSection('members')}
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#e4ddd4] transition hover:border-[#8f867b]/30 hover:bg-white/10"
                    >
                      멤버 명단 보기
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-14 grid gap-3 sm:grid-cols-[1.15fr_0.9fr_1.1fr]">
                  <div className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e8779]">최근 우승자</p>
                    <p className="mt-4 break-words font-serif text-[1.7rem] leading-none text-[#e4ddd4] sm:text-[2rem]">{latestRecord?.winner}</p>
                    <p className="mt-3 text-[13px] tracking-[0.03em] text-[#bfb7a9]">총타수 {latestRecord?.score}</p>
                  </div>
                  <div className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e8779]">참가 인원</p>
                    <p className="mt-4 font-serif text-[1.7rem] leading-none text-[#e4ddd4] sm:text-[2rem]">{participantCount}</p>
                    <p className="mt-3 text-[13px] tracking-[0.03em] text-[#bfb7a9]">전체 스코어카드 기준</p>
                  </div>
                  <div className="rounded-[1.8rem] border border-[#8f867b]/24 bg-[linear-gradient(180deg,rgba(143,134,123,0.14),rgba(143,134,123,0.06))] p-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#908475]">클럽 자산</p>
                    <p className="mt-4 break-words font-serif text-[1.7rem] leading-none text-[#ddd6cd] sm:text-[2rem]">{formatCurrency(balance)}</p>
                    <p className="mt-3 text-[13px] tracking-[0.03em] text-[#c2b8ad]">회비 계좌 기준</p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 rounded-[1.8rem] border border-[#8f867b]/14 bg-[linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-5 sm:max-w-2xl">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#908475]">리저브 노트</p>
                  <p className="mt-3 max-w-[30rem] text-[14px] leading-7 text-[#cfc5b2]">
                    라운드를 소비하지 않고 보관하는 방식으로, 이름과 숫자와 장소의 인상을 한 시즌의 기록으로 남깁니다.
                  </p>
                </div>
              </motion.div>

              <div className="grid gap-6 lg:grid-rows-[1.3fr_0.7fr]">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08, ease: 'easeOut' }}
                  className="overflow-hidden rounded-[2.8rem] border border-[#8f867b]/10 bg-[linear-gradient(180deg,#141d28_0%,#0e1620_100%)] shadow-[0_55px_150px_-82px_rgba(0,0,0,0.95)]"
                >
                  <div className="relative">
                    <img
                      src={featuredGallery?.src || '/images/round1_group.jpg'}
                      alt="Featured round"
                      className="h-[20rem] w-full object-cover brightness-[0.72] contrast-[1.04] saturate-[0.62] sepia-[0.12] sm:h-[24rem]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,22,31,0.08)_0%,rgba(31,34,38,0.24)_30%,rgba(14,22,31,0.5)_62%,rgba(11,16,22,0.9)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,121,104,0.14),transparent_46%),linear-gradient(90deg,rgba(38,53,74,0.18),rgba(38,53,74,0.04))]" />
                    <div className="absolute inset-[16px] rounded-[2.2rem] border border-white/8" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-[#c0b6ab]">시즌 하이라이트</p>
                      <h3 className="mt-3 max-w-md break-words font-serif text-[1.75rem] leading-[0.98] tracking-[-0.02em] text-[#e4ddd4] sm:text-[2.45rem] lg:text-[2.8rem]">
                        {latestRecord?.location}
                      </h3>
                      <p className="mt-4 text-[13px] tracking-[0.05em] text-[#d1c5ab]">{latestRecord?.date}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.16, ease: 'easeOut' }}
                  className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]"
                >
                  <div className="rounded-[2.2rem] border border-[#8f867b]/24 bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] p-6 text-[#11130f] shadow-[0_18px_45px_-26px_rgba(124,117,107,0.55)]">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#2f2a25]">평균 타수</p>
                    <p className="mt-4 font-serif text-[2.55rem] leading-none tracking-[-0.03em] sm:text-[3.3rem]">{averageScore}</p>
                    <p className="mt-3 text-[13px] tracking-[0.04em] text-[#493f2f]">이번 라운드 전체 평균</p>
                  </div>
                  <div className="rounded-[2.2rem] border border-[#8f867b]/10 bg-[linear-gradient(180deg,#1b2633_0%,#111a24_100%)] p-6 text-[#e4ddd4]">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#968f81]">클럽 구성</p>
                    <p className="mt-4 text-[1.15rem] leading-snug tracking-[0.01em]">회장 {roleCounts.captain}명 · 총무 {roleCounts.secretary}명</p>
                    <p className="mt-3 text-[13px] tracking-[0.04em] text-[#c3bbad]">정회원 {roleCounts.member}명</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#908475]">랭킹 보드</p>
              <h3 className="mt-4 max-w-[12ch] font-serif text-[2.1rem] leading-[0.98] tracking-[-0.025em] text-[#ddd6cd] sm:text-[3.2rem] lg:text-[4rem]">
                숫자보다 먼저 위계가 읽히고,
                <br className="hidden sm:block" />
                화면보다 먼저 품격이 느껴져야 합니다.
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <motion.div {...fadeInUp} className="rounded-[2.7rem] border border-[#8f867b]/10 bg-[linear-gradient(180deg,#141d28_0%,#0e1620_100%)] p-7 shadow-[0_40px_110px_-78px_rgba(0,0,0,0.95)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#998f7d]">챔피언 패널</p>
                  <Crown size={18} className="text-[#8f867b]" />
                </div>
                <div className="mt-6">
                  <p className="break-words font-serif text-[2.7rem] leading-[0.92] tracking-[-0.03em] text-[#e4ddd4] sm:text-[4rem] lg:text-[5.1rem]">{ranking[0]?.name}</p>
                  <p className="mt-5 max-w-[18rem] text-[14px] leading-7 text-[#c6bdaf]">현재 기준 넷 스코어 선두 멤버입니다.</p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#998f7d]">넷</p>
                    <p className="mt-3 font-serif text-[1.9rem] leading-none tracking-[-0.03em] text-[#e4ddd4] sm:text-[2.4rem]">{ranking[0]?.netScoreDisplay}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#998f7d]">그로스</p>
                    <p className="mt-3 font-serif text-[1.9rem] leading-none tracking-[-0.03em] text-[#e4ddd4] sm:text-[2.4rem]">{ranking[0]?.latestScore}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.7rem] border border-[#8f867b]/14 bg-[linear-gradient(180deg,#e4ddd4_0%,#d8d0c7_100%)] p-5 shadow-[0_35px_90px_-72px_rgba(0,0,0,0.6)] sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#7f7461]">상위 5인</p>
                  <span className="rounded-full bg-[#1b2633] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#e4ddd4]">
                    넷 기준
                  </span>
                </div>
                <div className="space-y-3">
                  {ranking.slice(0, 5).map((member, index) => (
                    <div
                      key={member.name}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.8rem] border px-5 py-4 ${
                        index === 0 ? 'border-[#8f867b]/35 bg-[#8f867b]/10' : 'border-black/6 bg-[#f3f0eb]'
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3cf] text-sm font-semibold text-[#1b211b]">
                        {index + 1}
                      </div>
                      <div>
                        <p className="break-words text-[0.98rem] tracking-[0.01em] text-[#1b211b] sm:text-[1.05rem]">{member.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-[#7e7462]">{member.role}</p>
                      </div>
                      <div className="rounded-full bg-[#1b2633] px-3 py-1.5 text-sm font-semibold text-[#e4ddd4]">
                        {member.netScoreDisplay}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="round" className="border-y border-white/8 bg-[#121612] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#908475]">라운드 도식</p>
              <h3 className="mt-4 max-w-[12ch] font-serif text-[2.1rem] leading-[0.98] tracking-[-0.025em] text-[#ddd6cd] sm:text-[3.2rem] lg:text-[4rem]">
                한 번의 라운드를
                <br className="hidden sm:block" />
                멤버 전용 기록 파일처럼 정리했습니다.
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
              <motion.div {...fadeInUp} className="rounded-[2.7rem] border border-[#8f867b]/10 bg-[linear-gradient(180deg,#141d28_0%,#0e1620_100%)] p-7 text-[#ddd6cd] shadow-[0_42px_110px_-76px_rgba(0,0,0,0.95)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#918a7c]">코스 브리프</p>
                  <MapPin size={18} className="text-[#8f867b]" />
                </div>
                <h4 className="mt-6 max-w-[12ch] break-words font-serif text-[2rem] leading-[0.98] tracking-[-0.025em] sm:text-[2.35rem] lg:text-[2.8rem]">{latestRecord?.location}</h4>
                <div className="mt-6 overflow-hidden rounded-[1.6rem]">
                  <img
                    src={courseMeta?.img}
                    alt={latestRecord?.location}
                    className="h-64 w-full object-cover brightness-[0.78] contrast-[1.04] saturate-[0.58] sepia-[0.14]"
                  />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#918a7c]">일자</p>
                    <p className="mt-3 text-[1.05rem]">{latestRecord?.date}</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] p-4 text-[#161811]">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#2f2a25]">우승자</p>
                    <p className="mt-3 break-words text-[1rem] sm:text-[1.05rem]">{latestRecord?.winner}</p>
                  </div>
                </div>
                <p className="mt-6 max-w-[28rem] text-[14px] leading-7 text-[#c6bdaf]">{courseMeta?.address}</p>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.7rem] border border-[#8f867b]/14 bg-[linear-gradient(180deg,#e4ddd4_0%,#d8d0c7_100%)] p-5 shadow-[0_35px_90px_-72px_rgba(0,0,0,0.6)] sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#7f7461]">스코어 기록</p>
                  <CalendarDays size={18} className="text-[#7f7461]" />
                </div>
                <div className="space-y-3">
                  {latestRecord?.attendees
                    .slice()
                    .sort((a, b) => a.score - b.score)
                    .map((attendee, index) => (
                      <div
                        key={`${attendee.name}-${index}`}
                        className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.8rem] border px-5 py-4 ${
                          index === 0 ? 'border-[#8f867b]/35 bg-[#8f867b]/10' : 'border-black/6 bg-[#f3f0eb]'
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3cf] text-sm font-semibold text-[#1b211b]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="break-words text-[0.98rem] tracking-[0.01em] text-[#1b211b] sm:text-[1.05rem]">{attendee.name}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#7e7462]">
                            전반 {attendee.front} / 후반 {attendee.back}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#1b2633] px-3 py-1.5 text-sm font-semibold text-[#e4ddd4]">
                          {attendee.score}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="members" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#908475]">멤버 로스터</p>
              <h3 className="mt-4 max-w-[13ch] font-serif text-[2.1rem] leading-[0.98] tracking-[-0.025em] text-[#ddd6cd] sm:text-[3.2rem] lg:text-[4rem]">
                가벼운 프로필 카드보다
                <br className="hidden sm:block" />
                단정한 클럽 명부에 가깝게 정리했습니다.
              </h3>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.04 }}
                  className={`overflow-hidden rounded-[2.5rem] border shadow-[0_28px_80px_-58px_rgba(0,0,0,0.75)] ${
                    index % 3 === 0
                      ? 'border-[#8f867b]/10 bg-[linear-gradient(180deg,#1b2633_0%,#111a24_100%)] text-[#ddd6cd]'
                      : index % 3 === 1
                        ? 'border-[#8f867b]/14 bg-[linear-gradient(180deg,#e4ddd4_0%,#d8d0c7_100%)] text-[#191f18]'
                        : 'border-[#8f867b]/24 bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] text-[#161811]'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="h-20 w-20 rounded-[1.4rem] border border-white/15 object-cover brightness-[0.9] contrast-[1.03] saturate-[0.74] sepia-[0.08] shadow-[0_18px_42px_-24px_rgba(0,0,0,0.7)]"
                      />
                      <div className="flex items-center gap-2">
                        {member.role === '회장' && <Crown size={16} className="shrink-0" />}
                        {member.role === '총무' && <Medal size={16} className="shrink-0" />}
                      </div>
                    </div>
                    <h4 className="mt-5 break-words font-serif text-[1.8rem] leading-none tracking-[-0.02em] sm:text-[2.2rem]">{member.name}</h4>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.28em] opacity-65">{member.role}</p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-[1rem] bg-black/10 backdrop-blur-sm p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] opacity-55">HC</p>
                        <p className="mt-3 text-[1.05rem]">{member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : '신규'}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/10 backdrop-blur-sm p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] opacity-55">그로스</p>
                        <p className="mt-3 text-[1.05rem]">{member.latestScore}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/10 backdrop-blur-sm p-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] opacity-55">넷</p>
                        <p className="mt-3 text-[1.05rem]">{member.netScoreDisplay}</p>
                      </div>
                    </div>

                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="mt-6 inline-flex items-center gap-2 text-[14px] tracking-[0.02em] opacity-80">
                        <Phone size={14} />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="archive" className="border-t border-[#8f867b]/14 bg-[linear-gradient(180deg,#e1ddd7_0%,#d2ccc5_100%)] px-4 py-10 text-[#171b15] sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.36em] text-[#867d72]">리저브 아카이브</p>
                <h3 className="mt-4 max-w-[14ch] font-serif text-[2.1rem] leading-[0.98] tracking-[-0.025em] sm:text-[3.2rem] lg:text-[4rem]">
                  코스의 기억과 클럽 자산,
                  <br className="hidden sm:block" />
                  그리고 현장의 장면을 한 축에 정리했습니다.
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#171b15] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#f7efdf]">
                <Users size={14} />
                멤버 전용
              </div>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <motion.div {...fadeInUp} className="overflow-hidden rounded-[2.7rem] border border-[#8f867b]/16 bg-[linear-gradient(180deg,#f1efeb_0%,#e2ddd6_100%)] shadow-[0_40px_120px_-76px_rgba(16,18,14,0.45)]">
                <div className="relative">
                  <img
                    src={featuredGallery?.src || '/images/round1_group.jpg'}
                    alt="Gallery feature"
                    className="h-[24rem] w-full object-cover brightness-[0.74] contrast-[1.04] saturate-[0.64] sepia-[0.12]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,20,27,0.02)_0%,rgba(28,31,35,0.18)_32%,rgba(11,16,22,0.72)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,121,104,0.12),transparent_40%),linear-gradient(90deg,rgba(38,53,74,0.16),rgba(38,53,74,0.04))]" />
                  <div className="absolute inset-[16px] rounded-[2.2rem] border border-white/12" />
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/65">대표 장면</p>
                    <h4 className="mt-3 break-words font-serif text-[2rem] leading-[0.98] tracking-[-0.025em] sm:text-[2.3rem] lg:text-[2.8rem]">{featuredGallery?.location}</h4>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] bg-[linear-gradient(180deg,#dcd8d1_0%,#cdc6bc_100%)] p-4">
                    <p className="text-[9px] uppercase tracking-[0.24em] text-[#856e4f]">베스트 스코어</p>
                    <p className="mt-3 text-[1.45rem] leading-none tracking-[-0.02em] sm:text-[1.8rem]">{featuredGallery?.bestScore}</p>
                  </div>
                  <div className="rounded-[1.3rem] bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] p-4 text-[#161811]">
                    <p className="text-[9px] uppercase tracking-[0.24em] text-[#2f2a25]">참가 인원</p>
                    <p className="mt-3 text-[1.45rem] leading-none tracking-[-0.02em] sm:text-[1.8rem]">{featuredGallery?.participants}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.7rem] border border-[#8f867b]/10 bg-[linear-gradient(180deg,#1b2633_0%,#111a24_100%)] p-7 text-[#ddd6cd] shadow-[0_50px_130px_-76px_rgba(0,0,0,0.95)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#958d80]">자산 브리프</p>
                  <Wallet size={18} className="text-[#8f867b]" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#958d80]">현재 잔액</p>
                    <p className="mt-4 break-words font-serif text-[2.2rem] leading-none tracking-[-0.03em] sm:text-[3rem]">{formatCurrency(balance)}</p>
                    <p className="mt-4 max-w-[15rem] text-[14px] leading-7 text-[#c2b9aa]">최근 클럽 지출 반영 후 기준 잔액입니다.</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,#a19a8f_0%,#7c756b_100%)] p-5 text-[#161811] shadow-[0_20px_44px_-28px_rgba(124,117,107,0.55)]">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#2f2a25]">회비 계좌</p>
                    <p className="mt-4 break-all text-[0.98rem] leading-relaxed tracking-[0.01em] sm:text-[1.12rem]">KakaoBank 3333-16-4428815</p>
                    <p className="mt-4 text-[14px] leading-7 text-[#4a4030]">총무 관리 계좌입니다.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {ledgerTransactions.slice(0, 4).map((entry) => (
                    <div key={`${entry.date}-${entry.desc}`} className="flex items-center justify-between rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-4">
                      <div>
                        <p className="text-[15px] tracking-[0.01em]">{entry.desc}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#958d80]">{entry.date}</p>
                      </div>
                      <p className={`text-sm font-semibold ${entry.amount > 0 ? 'text-[#e7e2a9]' : 'text-[#f4c0a8]'}`}>
                        {entry.amount > 0 ? '+' : '-'} {formatCurrency(entry.amount)}
                      </p>
                    </div>
                  ))}
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
