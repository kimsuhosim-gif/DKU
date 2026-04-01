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
];

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-120px' },
  transition: { duration: 0.7, ease: 'easeOut' as const },
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
  const recentScores = latestRecord?.attendees.slice().sort((a, b) => a.score - b.score) ?? [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#17202a]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,209,198,0.7),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(222,227,233,0.55),transparent_28%),linear-gradient(180deg,#f7f3ed_0%,#f2eee8_44%,#eeebe6_100%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#17202a]/8 bg-[#f5f1ea]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button onClick={() => scrollToSection('hero')} className="text-left">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#7b8591]">private archive edition</p>
            <h1 className="mt-1 font-serif text-[1.05rem] uppercase tracking-[0.1em] text-[#17202a] sm:text-[1.2rem]">
              DKU-RE09 Reserve
            </h1>
          </button>

          <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[#596572] lg:flex">
            <button onClick={() => scrollToSection('hero')}>개요</button>
            <button onClick={() => scrollToSection('round')}>라운드</button>
            <button onClick={() => scrollToSection('leaderboard')}>랭킹</button>
            <button onClick={() => scrollToSection('members')}>멤버</button>
            <button onClick={() => scrollToSection('club-brief')}>브리프</button>
          </nav>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#17202a]/10 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#17202a] transition hover:bg-white"
          >
            <ArrowLeft size={14} />
            기존 사이트
          </a>
        </div>
      </header>

      <main className="pb-24">
        <section id="hero" className="px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
            <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="overflow-hidden rounded-[2.5rem] border border-[#17202a]/8 bg-[#101822] text-[#f1ebe2] shadow-[0_45px_120px_-78px_rgba(16,24,34,0.78)]"
            >
              <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(228,214,196,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(104,118,133,0.14),transparent_28%)]" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[#c7b7a4]">
                      Reserve archive
                    </div>
                    <div className="mt-8">
                      <h2 className="max-w-[10ch] break-keep font-sans text-[2.75rem] font-semibold leading-[1.01] tracking-[-0.05em] text-[#f4efe8] sm:text-[3.7rem] lg:max-w-[11ch] lg:text-[4.6rem]">
                        클럽의 기록을
                        <br />
                        더 깊고 정제된
                        <br />
                        방식으로
                      </h2>
                      <div className="mt-8 max-w-[30rem]">
                        <p className="break-keep text-[15px] leading-8 text-[#c9c1b7] sm:text-[16px]">
                          최신 라운드 결과, 멤버 흐름, 코스 기록, 회비 브리프를 한 화면 안에서 차분하게 읽히도록 다시
                          구성한 별도 아카이브 버전입니다.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <button
                            onClick={() => scrollToSection('round')}
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ece2d5] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#101822] transition hover:bg-[#f6eee5]"
                          >
                            라운드 리포트
                            <ArrowRight size={16} />
                          </button>
                          <button
                            onClick={() => scrollToSection('members')}
                            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/14 bg-white/5 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f1ebe2] transition hover:bg-white/10"
                          >
                            멤버 디렉토리
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89987]">최신 우승</p>
                        <p className="mt-3 break-words font-sans text-[1.45rem] font-semibold leading-none text-[#f4efe8] sm:text-[1.65rem]">
                          {latestRecord?.winner}
                        </p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89987]">참가 인원</p>
                        <p className="mt-3 font-sans text-[1.45rem] font-semibold leading-none text-[#f4efe8] sm:text-[1.65rem]">
                          {participantCount}명
                        </p>
                      </div>
                      <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89987]">평균 타수</p>
                        <p className="mt-3 font-sans text-[1.45rem] font-semibold leading-none text-[#f4efe8] sm:text-[1.65rem]">
                          {averageScore}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[28rem] border-t border-white/8 lg:border-l lg:border-t-0">
                  <img
                    src={featuredGallery?.src || '/images/round1_group.jpg'}
                    alt="Latest round"
                    className="h-full w-full object-cover brightness-[0.72] contrast-[1.02] saturate-[0.74]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,24,34,0.08)_0%,rgba(16,24,34,0.22)_28%,rgba(16,24,34,0.86)_100%)]" />
                  <div className="absolute inset-[18px] rounded-[2rem] border border-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7b7a4]">Latest course</p>
                    <h3 className="mt-3 max-w-[12ch] break-keep font-sans text-[1.95rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[2.45rem]">
                      {latestRecord?.location}
                    </h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.35rem] bg-white/8 p-4 backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#cfd6dc]">라운드 날짜</p>
                        <p className="mt-3 text-[0.95rem] text-white">{latestRecord?.date}</p>
                      </div>
                      <div className="rounded-[1.35rem] bg-[#ece2d5] p-4 text-[#101822]">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#65717d]">베스트 스코어</p>
                        <p className="mt-3 font-sans text-[1.7rem] font-semibold leading-none">{latestRecord?.score}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="round" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7b8591]">Round report</p>
                <h3 className="mt-4 break-keep font-sans text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#17202a] sm:text-[3rem]">
                  최근 라운드를
                  <br />
                  하나의 리포트처럼
                </h3>
              </div>
              <p className="max-w-xl break-keep text-[15px] leading-8 text-[#586470]">
                코스 정보는 왼쪽에, 전체 스코어보드는 오른쪽에 배치해서 한 번에 읽히도록 정리했습니다. 과한 카드 장식보다
                정보 배열과 가독성에 집중한 레이아웃입니다.
              </p>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.84fr_1.16fr]">
              <motion.div
                {...fadeInUp}
                className="overflow-hidden rounded-[2.2rem] border border-[#17202a]/8 bg-white shadow-[0_30px_90px_-74px_rgba(23,32,42,0.34)]"
              >
                <img
                  src={courseMeta?.img}
                  alt={latestRecord?.location}
                  className="h-64 w-full object-cover"
                />
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#7b8591]">Course archive</p>
                      <h4 className="mt-3 max-w-[13ch] break-keep font-sans text-[1.8rem] font-semibold leading-[1.03] tracking-[-0.05em] text-[#17202a] sm:text-[2.15rem]">
                        {latestRecord?.location}
                      </h4>
                    </div>
                    <MapPin size={18} className="mt-1 shrink-0 text-[#6b7783]" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] bg-[#f2eee8] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7b8591]">날짜</p>
                      <p className="mt-3 text-[0.95rem] text-[#17202a]">{latestRecord?.date}</p>
                    </div>
                    <div className="rounded-[1.3rem] bg-[#e1e7ed] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#687582]">우승자</p>
                      <p className="mt-3 break-words text-[0.95rem] font-medium text-[#17202a]">{latestRecord?.winner}</p>
                    </div>
                  </div>
                  <p className="mt-6 break-words text-[14px] leading-7 text-[#586470]">{courseMeta?.address}</p>
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="rounded-[2.2rem] border border-[#17202a]/8 bg-[#101822] p-5 text-[#f1ebe2] shadow-[0_35px_95px_-72px_rgba(16,24,34,0.72)] sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#c7b7a4]">Scoreboard</p>
                    <p className="mt-2 text-[14px] text-[#bdb5ab]">전체 참가자 스코어</p>
                  </div>
                  <CalendarDays size={18} className="text-[#c7b7a4]" />
                </div>
                <div className="space-y-3">
                  {recentScores.map((attendee, index) => (
                    <div
                      key={`${attendee.name}-${index}`}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.5rem] border px-4 py-4 ${
                        index === 0 ? 'border-[#d8c9b7]/25 bg-[#ebe1d4] text-[#101822]' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
                          index === 0 ? 'bg-[#101822] text-[#f1ebe2]' : 'bg-white/10 text-[#f1ebe2]'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-[1rem] font-medium tracking-[-0.01em] sm:text-[1.05rem]">{attendee.name}</p>
                        <p className={`mt-1 text-[12px] ${index === 0 ? 'text-[#576471]' : 'text-[#bdb5ab]'}`}>
                          전반 {attendee.front} / 후반 {attendee.back}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-2 text-[13px] font-semibold ${
                          index === 0 ? 'bg-[#d9e1e8] text-[#101822]' : 'bg-white/10 text-[#f1ebe2]'
                        }`}
                      >
                        {attendee.score}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="border-y border-[#17202a]/8 bg-[#eef2f5] px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7b8591]">Leaderboard</p>
                <h3 className="mt-4 break-keep font-sans text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#17202a] sm:text-[3rem]">
                  현재 흐름이 가장
                  <br />
                  좋은 멤버들
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#7b8591]">현재 리더</p>
                  <p className="mt-3 break-words font-sans text-[1.55rem] font-semibold leading-none tracking-[-0.03em] text-[#17202a]">{ranking[0]?.name}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#7b8591]">NET</p>
                  <p className="mt-3 font-sans text-[1.55rem] font-semibold leading-none text-[#17202a]">{ranking[0]?.netScoreDisplay}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#7b8591]">최근 스코어</p>
                  <p className="mt-3 font-sans text-[1.55rem] font-semibold leading-none text-[#17202a]">{ranking[0]?.latestScore}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="rounded-[2.2rem] border border-[#17202a]/8 bg-white p-5 shadow-[0_28px_90px_-72px_rgba(23,32,42,0.34)] sm:p-7"
            >
              <div className="space-y-3">
                {ranking.slice(0, 5).map((member, index) => (
                  <div
                    key={member.name}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.5rem] border px-4 py-4 ${
                      index === 0 ? 'border-[#17202a]/10 bg-[#f1ebe2]' : 'border-[#17202a]/7 bg-[#fbfaf8]'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101822] text-sm font-semibold text-[#f1ebe2]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-[1rem] font-medium tracking-[-0.01em] text-[#17202a] sm:text-[1.05rem]">{member.name}</p>
                      <p className="mt-1 break-words text-[12px] text-[#6b7783]">{member.role}</p>
                    </div>
                    <div className="rounded-full bg-[#e1e7ed] px-3 py-2 text-[13px] font-semibold text-[#17202a]">
                      {member.netScoreDisplay}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="members" className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#7b8591]">Members</p>
                <h3 className="mt-4 break-keep font-sans text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#17202a] sm:text-[3rem]">
                  멤버를 카드보다
                  <br />
                  명부처럼 보이게
                </h3>
              </div>
              <p className="max-w-xl break-keep text-[15px] leading-8 text-[#586470]">
                모든 멤버를 같은 템플릿으로 과하게 꾸미지 않고, 이름과 현재 지표가 먼저 읽히도록 정리했습니다.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topMembers.map((member, index) => (
                <motion.article
                  key={member.name}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.04 }}
                  className="rounded-[2rem] border border-[#17202a]/8 bg-white p-5 shadow-[0_26px_80px_-72px_rgba(23,32,42,0.32)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="h-20 w-20 rounded-[1.25rem] object-cover"
                      />
                      <div>
                        <h4 className="break-words font-sans text-[1.55rem] font-semibold leading-none tracking-[-0.04em] text-[#17202a]">
                          {member.name}
                        </h4>
                        <p className="mt-3 break-words text-[12px] text-[#6b7783]">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#7b8591]">
                      {member.role === '?뚯옣' && <Crown size={16} />}
                      {member.role === '珥앸Т' && <Medal size={16} />}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-[1.1rem] bg-[#f2eee8] p-3">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#7b8591]">HC</p>
                        <p className="mt-3 text-[0.98rem] font-medium text-[#17202a]">
                          {member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : '신규'}
                        </p>
                    </div>
                    <div className="rounded-[1.1rem] bg-[#f2eee8] p-3">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#7b8591]">최근</p>
                        <p className="mt-3 text-[0.98rem] font-medium text-[#17202a]">{member.latestScore}</p>
                    </div>
                    <div className="rounded-[1.1rem] bg-[#e1e7ed] p-3">
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#6b7783]">NET</p>
                        <p className="mt-3 text-[0.98rem] font-medium text-[#17202a]">{member.netScoreDisplay}</p>
                    </div>
                  </div>

                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="mt-5 inline-flex items-center gap-2 break-all rounded-full border border-[#17202a]/8 bg-[#fbfaf8] px-4 py-2 text-[13px] text-[#17202a]"
                    >
                      <Phone size={14} />
                      {member.phone}
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="club-brief" className="border-t border-[#17202a]/8 bg-[#101822] px-4 py-8 text-[#f1ebe2] sm:px-6 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeInUp} className="mb-8 grid gap-4 lg:grid-cols-[0.94fr_1.06fr] lg:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#c7b7a4]">Club brief</p>
                <h3 className="mt-4 break-keep font-sans text-[2.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#f4efe8] sm:text-[3rem]">
                  자산과 현장 사진까지
                  <br />
                  마지막에 정리하는 방식
                </h3>
              </div>
              <p className="max-w-xl break-keep text-[15px] leading-8 text-[#c1b9ae]">
                마지막 섹션은 금융 브리프와 사진 아카이브를 나란히 두어 사이트가 깔끔하게 마감되도록 구성했습니다.
              </p>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr]">
              <motion.div
                {...fadeInUp}
                className="rounded-[2.2rem] border border-white/10 bg-white/5 p-5 sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7b7a4]">Financial brief</p>
                    <p className="mt-2 text-[14px] text-[#c1b9ae]">최근 사용 내역과 현재 잔액</p>
                  </div>
                  <Wallet size={18} className="text-[#c7b7a4]" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1.04fr_0.96fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#a89987]">현재 잔액</p>
                    <p className="mt-4 break-words font-sans text-[2.1rem] font-semibold leading-none tracking-[-0.04em] text-[#f4efe8] sm:text-[2.45rem]">
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[#ece2d5] p-5 text-[#101822]">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#6a7682]">회비 계좌</p>
                    <p className="mt-4 break-all text-[1rem] leading-8">KakaoBank 3333-16-4428815</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {ledgerTransactions.map((entry) => (
                    <div
                      key={`${entry.date}-${entry.desc}`}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="break-keep text-[0.98rem] text-[#f4efe8]">{entry.desc}</p>
                        <p className="mt-1 text-[12px] text-[#a9b1b8]">{entry.date}</p>
                      </div>
                      <p className={`text-[0.98rem] font-semibold ${entry.amount > 0 ? 'text-[#f4efe8]' : 'text-[#f2bca8]'}`}>
                        {formatCurrency(entry.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5"
              >
                <img
                  src={featuredGallery?.src || '/images/round1_group.jpg'}
                  alt="Archive photograph"
                  className="h-72 w-full object-cover brightness-[0.72] contrast-[1.02] saturate-[0.74]"
                />
                <div className="border-t border-white/10 p-6 sm:p-7">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7b7a4]">Archive photograph</p>
                  <h4 className="mt-4 break-keep font-sans text-[1.95rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#f4efe8] sm:text-[2.45rem]">
                    코스의 기억과
                    <br />
                    라운드의 장면
                  </h4>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-[#a9b1b8]">촬영 날짜</p>
                      <p className="mt-3 text-[0.95rem] text-[#f4efe8]">{featuredGallery?.date}</p>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-[#a9b1b8]">참가 인원</p>
                      <p className="mt-3 text-[0.95rem] text-[#f4efe8]">{featuredGallery?.participants}명</p>
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
