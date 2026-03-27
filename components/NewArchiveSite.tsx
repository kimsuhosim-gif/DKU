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
    <div className="min-h-screen bg-[#0d100d] text-[#f5ecda]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,107,0.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(63,91,66,0.18),transparent_24%),linear-gradient(180deg,#0d100d_0%,#121713_35%,#171d18_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0d100d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => scrollToSection('hero')} className="text-left">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b59a6a]">멤버 전용 아카이브</p>
            <h1 className="mt-1 font-serif text-xl uppercase tracking-[0.16em] text-[#f6ecd8] sm:text-2xl">
              DKU-RE09 Reserve
            </h1>
          </button>

          <nav className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d5c3a2] lg:flex">
            <button onClick={() => scrollToSection('hero')}>개요</button>
            <button onClick={() => scrollToSection('leaderboard')}>랭킹</button>
            <button onClick={() => scrollToSection('round')}>라운드</button>
            <button onClick={() => scrollToSection('members')}>멤버</button>
            <button onClick={() => scrollToSection('archive')}>아카이브</button>
          </nav>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f1e6cf] transition hover:bg-white/10"
          >
            <ArrowLeft size={14} />
            기존 사이트
          </a>
        </div>
      </header>

      <main className="pb-24">
        <section id="hero" className="px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2.4rem] border border-white/8 bg-[#171b17] p-6 shadow-[0_50px_140px_-70px_rgba(0,0,0,0.9)] sm:p-8 lg:min-h-[42rem]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,107,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%)]" />
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center rounded-full border border-[#c9a66b]/20 bg-[#c9a66b]/8 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d7bd8e]">
                    시즌 아카이브 브리프
                  </div>
                  <h2 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-[#f7efdf] sm:text-[4.7rem] lg:text-[6.4rem]">
                    조용하게,
                    <span className="block text-[#c9a66b]">그러나 품위 있게.</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#c7c1b4] sm:text-base">
                    한 번의 라운드와 멤버의 흐름, 코스의 기억, 클럽 자산까지 한 화면 안에서 정제된 기록물처럼
                    읽히도록 설계한 프라이빗 멤버 아카이브입니다.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => scrollToSection('round')}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-[#c9a66b] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#11130f] transition hover:bg-[#d8b67e]"
                    >
                      라운드 기록 열기
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => scrollToSection('members')}
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/6 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#f6ecd8] transition hover:bg-white/10"
                    >
                      멤버 명단 보기
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.45rem] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e8779]">최근 우승자</p>
                    <p className="mt-3 font-serif text-2xl text-[#f7efdf]">{latestRecord?.winner}</p>
                    <p className="mt-2 text-sm text-[#bfb7a9]">총타수 {latestRecord?.score}</p>
                  </div>
                  <div className="rounded-[1.45rem] border border-white/8 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e8779]">참가 인원</p>
                    <p className="mt-3 font-serif text-2xl text-[#f7efdf]">{participantCount}</p>
                    <p className="mt-2 text-sm text-[#bfb7a9]">전체 스코어카드 기준</p>
                  </div>
                  <div className="rounded-[1.45rem] border border-[#c9a66b]/20 bg-[#c9a66b]/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#b59a6a]">클럽 자산</p>
                    <p className="mt-3 font-serif text-2xl text-[#f5ebd6]">{formatCurrency(balance)}</p>
                    <p className="mt-2 text-sm text-[#d4c4a3]">회비 계좌 기준</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08, ease: 'easeOut' }}
                  className="overflow-hidden rounded-[2.2rem] border border-white/8 bg-[#141814] shadow-[0_50px_140px_-80px_rgba(0,0,0,0.9)]"
                >
                  <div className="relative">
                    <img
                      src={featuredGallery?.src || '/images/round1_group.jpg'}
                      alt="Featured round"
                      className="h-[20rem] w-full object-cover sm:h-[24rem]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11140f] via-[#11140f]/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0c3a8]">시즌 하이라이트</p>
                      <h3 className="mt-3 max-w-md font-serif text-3xl text-[#f8f0df] sm:text-4xl">
                        {latestRecord?.location}
                      </h3>
                      <p className="mt-3 text-sm text-[#d1c5ab]">{latestRecord?.date}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.16, ease: 'easeOut' }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="rounded-[2rem] border border-white/8 bg-[#c9a66b] p-5 text-[#11130f]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#4f4330]">평균 타수</p>
                    <p className="mt-3 font-serif text-4xl">{averageScore}</p>
                    <p className="mt-2 text-sm text-[#493f2f]">이번 라운드 전체 평균</p>
                  </div>
                  <div className="rounded-[2rem] border border-white/8 bg-[#1d251f] p-5 text-[#f7efdf]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#968f81]">클럽 구성</p>
                    <p className="mt-3 text-lg">회장 {roleCounts.captain}명 · 총무 {roleCounts.secretary}명</p>
                    <p className="mt-2 text-sm text-[#c3bbad]">정회원 {roleCounts.member}명</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#b59a6a]">랭킹 보드</p>
              <h3 className="mt-3 font-serif text-4xl text-[#f5ebd6] sm:text-5xl">
                숫자보다 먼저 위계가 읽히고,
                <br className="hidden sm:block" />
                화면보다 먼저 품격이 느껴져야 합니다.
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <motion.div {...fadeInUp} className="rounded-[2.2rem] border border-white/8 bg-[#151915] p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#998f7d]">챔피언 패널</p>
                  <Crown size={18} className="text-[#c9a66b]" />
                </div>
                <div className="mt-6">
                  <p className="font-serif text-6xl leading-none text-[#f7efdf] sm:text-7xl">{ranking[0]?.name}</p>
                  <p className="mt-4 text-sm text-[#c6bdaf]">현재 기준 넷 스코어 선두 멤버입니다.</p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#998f7d]">넷</p>
                    <p className="mt-2 font-serif text-3xl text-[#f7efdf]">{ranking[0]?.netScoreDisplay}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#998f7d]">그로스</p>
                    <p className="mt-2 font-serif text-3xl text-[#f7efdf]">{ranking[0]?.latestScore}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.2rem] border border-white/8 bg-[#f6eedf] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#7f7461]">상위 5인</p>
                  <span className="rounded-full bg-[#1b211b] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#f7efdf]">
                    넷 기준
                  </span>
                </div>
                <div className="space-y-3">
                  {ranking.slice(0, 5).map((member, index) => (
                    <div
                      key={member.name}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.45rem] border px-4 py-3 ${
                        index === 0 ? 'border-[#c9a66b]/40 bg-[#c9a66b]/10' : 'border-black/6 bg-white'
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3cf] text-sm font-semibold text-[#1b211b]">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-base text-[#1b211b]">{member.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7e7462]">{member.role}</p>
                      </div>
                      <div className="rounded-full bg-[#1b211b] px-3 py-1.5 text-sm font-semibold text-[#f7efdf]">
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
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#b59a6a]">라운드 도식</p>
              <h3 className="mt-3 font-serif text-4xl text-[#f5ebd6] sm:text-5xl">
                한 번의 라운드를
                <br className="hidden sm:block" />
                멤버 전용 기록 파일처럼 정리했습니다.
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
              <motion.div {...fadeInUp} className="rounded-[2.2rem] border border-white/8 bg-[#1a201a] p-6 text-[#f5ebd6]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#918a7c]">코스 브리프</p>
                  <MapPin size={18} className="text-[#c9a66b]" />
                </div>
                <h4 className="mt-6 font-serif text-4xl leading-tight">{latestRecord?.location}</h4>
                <div className="mt-6 overflow-hidden rounded-[1.6rem]">
                  <img src={courseMeta?.img} alt={latestRecord?.location} className="h-64 w-full object-cover" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#918a7c]">일자</p>
                    <p className="mt-2 text-lg">{latestRecord?.date}</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-[#c9a66b] p-4 text-[#161811]">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#4e4333]">우승자</p>
                    <p className="mt-2 text-lg">{latestRecord?.winner}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-[#c6bdaf]">{courseMeta?.address}</p>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.2rem] border border-white/8 bg-[#f7efdf] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#7f7461]">스코어 기록</p>
                  <CalendarDays size={18} className="text-[#7f7461]" />
                </div>
                <div className="space-y-3">
                  {latestRecord?.attendees
                    .slice()
                    .sort((a, b) => a.score - b.score)
                    .map((attendee, index) => (
                      <div
                        key={`${attendee.name}-${index}`}
                        className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.45rem] border px-4 py-3 ${
                          index === 0 ? 'border-[#c9a66b]/40 bg-[#c9a66b]/10' : 'border-black/6 bg-white'
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eee3cf] text-sm font-semibold text-[#1b211b]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-base text-[#1b211b]">{attendee.name}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7e7462]">
                            전반 {attendee.front} / 후반 {attendee.back}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#1b211b] px-3 py-1.5 text-sm font-semibold text-[#f7efdf]">
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
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#b59a6a]">멤버 로스터</p>
              <h3 className="mt-3 font-serif text-4xl text-[#f5ebd6] sm:text-5xl">
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
                  className={`overflow-hidden rounded-[2.1rem] border border-white/8 ${
                    index % 3 === 0
                      ? 'bg-[#171d17] text-[#f5ebd6]'
                      : index % 3 === 1
                        ? 'bg-[#f7efdf] text-[#191f18]'
                        : 'bg-[#c9a66b] text-[#161811]'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <img src={member.img} alt={member.name} className="h-20 w-20 rounded-[1.4rem] object-cover" />
                      <div className="flex items-center gap-2">
                        {member.role === '회장' && <Crown size={16} className="shrink-0" />}
                        {member.role === '총무' && <Medal size={16} className="shrink-0" />}
                      </div>
                    </div>
                    <h4 className="mt-5 font-serif text-3xl">{member.name}</h4>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] opacity-65">{member.role}</p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">HC</p>
                        <p className="mt-2 text-base">{member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : '신규'}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">그로스</p>
                        <p className="mt-2 text-base">{member.latestScore}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">넷</p>
                        <p className="mt-2 text-base">{member.netScoreDisplay}</p>
                      </div>
                    </div>

                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="mt-5 inline-flex items-center gap-2 text-sm opacity-80">
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

        <section id="archive" className="border-t border-white/8 bg-[#f3ead8] px-4 py-10 text-[#171b15] sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8e7350]">리저브 아카이브</p>
                <h3 className="mt-3 font-serif text-4xl sm:text-5xl">
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
              <motion.div {...fadeInUp} className="overflow-hidden rounded-[2.2rem] border border-black/8 bg-white shadow-[0_35px_110px_-70px_rgba(16,18,14,0.4)]">
                <div className="relative">
                  <img src={featuredGallery?.src || '/images/round1_group.jpg'} alt="Gallery feature" className="h-[24rem] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/65">대표 장면</p>
                    <h4 className="mt-3 font-serif text-4xl">{featuredGallery?.location}</h4>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] bg-[#f2e7d5] p-4">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#856e4f]">베스트 스코어</p>
                    <p className="mt-2 text-2xl">{featuredGallery?.bestScore}</p>
                  </div>
                  <div className="rounded-[1.3rem] bg-[#c9a66b] p-4 text-[#161811]">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#4f4330]">참가 인원</p>
                    <p className="mt-2 text-2xl">{featuredGallery?.participants}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeInUp} className="rounded-[2.2rem] bg-[#171d17] p-6 text-[#f5ebd6] shadow-[0_45px_120px_-75px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#958d80]">자산 브리프</p>
                  <Wallet size={18} className="text-[#c9a66b]" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#958d80]">현재 잔액</p>
                    <p className="mt-3 font-serif text-4xl">{formatCurrency(balance)}</p>
                    <p className="mt-3 text-sm text-[#c2b9aa]">최근 클럽 지출 반영 후 기준 잔액입니다.</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[#c9a66b] p-5 text-[#161811]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#4f4330]">회비 계좌</p>
                    <p className="mt-3 text-lg">KakaoBank 3333-16-4428815</p>
                    <p className="mt-3 text-sm text-[#4a4030]">총무 관리 계좌입니다.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {ledgerTransactions.slice(0, 4).map((entry) => (
                    <div key={`${entry.date}-${entry.desc}`} className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm">{entry.desc}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#958d80]">{entry.date}</p>
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
