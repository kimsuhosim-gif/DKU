import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
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
  { date: '2025.11.29', desc: 'Quarter dues collected', amount: 1600000 },
  { date: '2025.11.29', desc: 'Golf shop gift vouchers', amount: -300000 },
  { date: '2025.11.29', desc: 'Water and refreshments', amount: -15000 },
  { date: '2025.11.29', desc: 'Name sticker printing', amount: -33000 },
  { date: '2025.11.29', desc: 'Dinner after round', amount: -580000 },
  { date: '2025.11.29', desc: 'Second venue drinks', amount: -134000 },
  { date: '2025.11.29', desc: 'Prize packaging', amount: -27500 },
];

const formatCurrency = (value: number) => `₩${Math.abs(value).toLocaleString()}`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

const NewArchiveSite: React.FC = () => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();
  const leaderboard = ranking.slice(0, 5);
  const featuredMembers = ranking.slice(0, 8);
  const latestCourse = latestRecord ? COURSE_LOCATIONS[latestRecord.location] : null;
  const participantCount = latestRecord?.attendees.length || 0;
  const balance = ledgerTransactions.reduce((acc, item) => acc + item.amount, 0);
  const averageScore =
    latestRecord && latestRecord.attendees.length > 0
      ? Math.round(latestRecord.attendees.reduce((sum, item) => sum + item.score, 0) / latestRecord.attendees.length)
      : 0;

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
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f4ecdf] text-[#1e261c]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#fb6a3c]/18 blur-3xl" />
        <div className="absolute right-[-10rem] top-[10rem] h-[32rem] w-[32rem] rounded-full bg-[#274233]/18 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[18%] h-[30rem] w-[30rem] rounded-full bg-[#d9d44f]/14 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:100%_100%,40px_40px,40px_40px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f4ecdf]/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-left"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6f7665]">Alternative concept</p>
            <h1 className="mt-1 font-serif text-xl uppercase tracking-[0.08em] text-[#223022] sm:text-2xl">Round Index 09</h1>
          </button>

          <div className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#344132] lg:flex">
            <button onClick={() => scrollToSection('pulse')}>Pulse</button>
            <button onClick={() => scrollToSection('round')}>Round</button>
            <button onClick={() => scrollToSection('members')}>Members</button>
            <button onClick={() => scrollToSection('systems')}>Systems</button>
            <button onClick={() => scrollToSection('memory')}>Memory</button>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#223022] transition hover:bg-white"
          >
            <ArrowLeft size={14} />
            Existing site
          </a>
        </div>
      </header>

      <main className="pb-24">
        <section id="hero" className="px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2.25rem] bg-[#223022] px-6 pb-7 pt-6 text-white sm:px-8 sm:pb-10 sm:pt-8 lg:min-h-[42rem]"
              >
                <div className="absolute right-4 top-2 font-serif text-[8rem] leading-none text-white/6 sm:right-6 sm:text-[11rem]">
                  09
                </div>
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                    Data-built experimental home
                  </div>
                  <h2 className="mt-6 max-w-4xl font-serif text-[3.2rem] leading-[0.9] sm:text-[4.6rem] lg:text-[6rem]">
                    A club archive
                    <span className="block text-[#d9d44f]">that feels like a season poster.</span>
                  </h2>
                  <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/72 sm:text-base">
                    This version is not polite, minimal, or tied to the old homepage. It treats your member list,
                    leaderboard, finance, and round record as material for a bold editorial sports archive.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => scrollToSection('round')}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-[#fb6a3c] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#ee5e2e]"
                    >
                      Open round capsule
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => scrollToSection('members')}
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-white/14 bg-white/8 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/12"
                    >
                      Browse members
                    </button>
                  </div>
                </div>

                <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Latest round</p>
                    <p className="mt-3 font-serif text-2xl">{latestRecord?.score}</p>
                    <p className="mt-2 text-sm text-white/65">{latestRecord?.winner}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Attendance</p>
                    <p className="mt-3 font-serif text-2xl">{participantCount}</p>
                    <p className="mt-2 text-sm text-white/65">full scorecards</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#d9d44f] p-4 text-[#243023]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#47513e]/80">Balance</p>
                    <p className="mt-3 font-serif text-2xl">{formatCurrency(balance)}</p>
                    <p className="mt-2 text-sm text-[#495245]">club fund</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08, ease: 'easeOut' }}
                  className="overflow-hidden rounded-[2rem] border border-black/8 bg-[#fbf6ee] shadow-[0_35px_100px_-60px_rgba(33,40,29,0.55)]"
                >
                  <div className="grid gap-4 p-4 sm:p-5">
                    <div className="overflow-hidden rounded-[1.5rem]">
                      <img
                        src={galleryPhotos[0]?.src || '/images/round1_group.jpg'}
                        alt="Round memory"
                        className="h-72 w-full object-cover sm:h-[22rem]"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-[1.4rem] bg-[#fb6a3c] p-5 text-white">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/65">Latest venue</p>
                        <h3 className="mt-3 font-serif text-2xl leading-tight">{latestRecord?.location}</h3>
                        <p className="mt-4 text-sm text-white/80">{latestRecord?.date}</p>
                      </div>
                      <div className="rounded-[1.4rem] bg-[#efe5d5] p-5 text-[#223022]">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#67735f]">Average</p>
                        <p className="mt-3 font-serif text-4xl">{averageScore}</p>
                        <p className="mt-2 text-sm text-[#5d6758]">round gross</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.16, ease: 'easeOut' }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="rounded-[2rem] bg-[#d9d44f] p-5 text-[#223022]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#58624b]">Top net</p>
                    <p className="mt-3 font-serif text-3xl">{leaderboard[0]?.name}</p>
                    <p className="mt-2 text-sm text-[#4b5542]">{leaderboard[0]?.netScoreDisplay}</p>
                  </div>
                  <div className="rounded-[2rem] bg-[#2f4535] p-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Structure</p>
                    <p className="mt-3 text-lg">1 captain · {roleCounts.secretary} secretary · {roleCounts.member} members</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="pulse" className="px-4 py-6 sm:px-6 sm:py-10">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Champion', value: latestRecord?.winner, tone: 'bg-white' },
              { label: 'Participants', value: `${participantCount}`, tone: 'bg-[#efe5d5]' },
              { label: 'Best Score', value: `${latestRecord?.score}`, tone: 'bg-[#d9d44f]' },
              { label: 'Current Fund', value: formatCurrency(balance), tone: 'bg-[#223022] text-white' },
            ].map((item) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                className={`rounded-[1.8rem] border border-black/8 p-5 shadow-[0_24px_70px_-55px_rgba(33,40,29,0.4)] ${item.tone}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-current opacity-55">{item.label}</p>
                <p className="mt-4 font-serif text-3xl">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="round" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a7567]">Round capsule</p>
              <h3 className="mt-3 font-serif text-4xl text-[#223022] sm:text-5xl">
                Scoreboard, split scores, and the winner of the day.
              </h3>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <motion.div {...fadeUp} className="rounded-[2rem] bg-[#223022] p-6 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">Round card</p>
                  <CalendarDays size={18} className="text-white/45" />
                </div>
                <h4 className="mt-5 font-serif text-4xl leading-tight">{latestRecord?.location}</h4>
                <p className="mt-4 text-sm text-white/68">{latestRecord?.date}</p>

                <div className="mt-8 rounded-[1.5rem] bg-white/7 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Winner</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fb6a3c]">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <p className="font-serif text-2xl">{latestRecord?.winner}</p>
                      <p className="mt-1 text-sm text-white/65">Best gross {latestRecord?.score}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-[#d9d44f] p-4 text-[#223022]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#59624d]">Attendance</p>
                    <p className="mt-2 font-serif text-3xl">{participantCount}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-white/7 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Mean score</p>
                    <p className="mt-2 font-serif text-3xl">{averageScore}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeUp} className="rounded-[2rem] border border-black/8 bg-[#fbf6ee] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#74706a]">Live table</p>
                  <span className="rounded-full bg-[#223022] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    {leaderboard.length} ranked
                  </span>
                </div>
                <div className="space-y-3">
                  {latestRecord?.attendees
                    .slice()
                    .sort((a, b) => a.score - b.score)
                    .map((attendee, index) => (
                      <div
                        key={`${attendee.name}-${index}`}
                        className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.45rem] border px-4 py-3 ${
                          index === 0 ? 'border-[#fb6a3c]/25 bg-[#fb6a3c]/7' : 'border-black/6 bg-white'
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe5d5] text-sm font-semibold text-[#223022]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-base text-[#223022]">{attendee.name}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7b776f]">
                            Front {attendee.front} / Back {attendee.back}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#223022] px-3 py-1.5 text-sm font-semibold text-white">
                          {attendee.score}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="members" className="border-y border-black/8 bg-[#efe5d5] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mb-8 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a7567]">Member cast</p>
              <h3 className="mt-3 font-serif text-4xl text-[#223022] sm:text-5xl">
                The club reads like a roster, not a contact list.
              </h3>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {featuredMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.04 }}
                  className={`overflow-hidden rounded-[2rem] border border-black/8 ${
                    index % 4 === 0
                      ? 'bg-[#223022] text-white'
                      : index % 4 === 1
                        ? 'bg-white'
                        : index % 4 === 2
                          ? 'bg-[#fb6a3c] text-white'
                          : 'bg-[#d9d44f] text-[#223022]'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <img src={member.img} alt={member.name} className="h-20 w-20 rounded-[1.4rem] object-cover" />
                      <div className="flex items-center gap-2">
                        {member.role === '회장' && <Crown size={16} className="shrink-0" />}
                        {member.role === '총무' && <Medal size={16} className="shrink-0" />}
                      </div>
                    </div>
                    <h4 className="mt-5 font-serif text-3xl leading-none">{member.name}</h4>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] opacity-65">{member.role}</p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">HC</p>
                        <p className="mt-2 text-base">{member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : 'New'}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">Gross</p>
                        <p className="mt-2 text-base">{member.latestScore}</p>
                      </div>
                      <div className="rounded-[1rem] bg-black/8 p-3">
                        <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">Net</p>
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

        <section id="systems" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <motion.div {...fadeUp} className="rounded-[2rem] bg-[#fb6a3c] p-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">Course memory</p>
                <MapPin size={18} className="text-white/70" />
              </div>
              <h3 className="mt-4 font-serif text-4xl leading-tight">{latestRecord?.location}</h3>
              <div className="mt-5 overflow-hidden rounded-[1.6rem]">
                <img src={latestCourse?.img} alt={latestRecord?.location} className="h-72 w-full object-cover" />
              </div>
              <p className="mt-5 text-sm leading-7 text-white/82">{latestCourse?.address}</p>
            </motion.div>

            <motion.div {...fadeUp} className="rounded-[2rem] bg-[#223022] p-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Finance block</p>
                <Wallet size={18} className="text-white/55" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white/6 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Current balance</p>
                  <p className="mt-3 font-serif text-4xl">{formatCurrency(balance)}</p>
                  <p className="mt-3 text-sm text-white/68">Trust account after the latest recorded settlement.</p>
                </div>
                <div className="rounded-[1.5rem] bg-[#d9d44f] p-5 text-[#223022]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#5a634d]">Account</p>
                  <p className="mt-3 text-lg">KakaoBank 3333-16-4428815</p>
                  <p className="mt-3 text-sm text-[#495246]">Shared club fund managed by the secretary.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {ledgerTransactions.slice(0, 5).map((item) => (
                  <div key={`${item.date}-${item.desc}`} className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm">{item.desc}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45">{item.date}</p>
                    </div>
                    <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-[#d5f0c0]' : 'text-[#ffcebd]'}`}>
                      {item.amount > 0 ? '+' : '-'} {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="memory" className="border-t border-black/8 bg-[#fbf6ee] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeUp} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a7567]">Memory lane</p>
                <h3 className="mt-3 font-serif text-4xl text-[#223022] sm:text-5xl">
                  Images are treated like evidence, not decoration.
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#223022] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                <Camera size={14} />
                Gallery linked to round data
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {galleryPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.06 }}
                  className={`overflow-hidden rounded-[2rem] border border-black/8 ${
                    index === 0 ? 'md:col-span-2' : ''
                  } bg-white shadow-[0_24px_70px_-55px_rgba(33,40,29,0.35)]`}
                >
                  <div className={`grid ${index === 0 ? 'md:grid-cols-[1.1fr_0.9fr]' : ''}`}>
                    <img
                      src={photo.src}
                      alt={photo.location}
                      className={`${index === 0 ? 'h-full min-h-[20rem] w-full object-cover' : 'h-72 w-full object-cover'}`}
                    />
                    <div className="p-5 sm:p-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a7567]">{photo.date}</p>
                      <h4 className="mt-4 font-serif text-3xl text-[#223022]">{photo.location}</h4>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.1rem] bg-[#efe5d5] p-4">
                          <p className="text-[9px] uppercase tracking-[0.16em] text-[#7a7567]">Best score</p>
                          <p className="mt-2 text-xl text-[#223022]">{photo.bestScore}</p>
                        </div>
                        <div className="rounded-[1.1rem] bg-[#d9d44f] p-4 text-[#223022]">
                          <p className="text-[9px] uppercase tracking-[0.16em] text-[#59624d]">Participants</p>
                          <p className="mt-2 text-xl">{photo.participants}</p>
                        </div>
                      </div>
                      <p className="mt-6 text-sm leading-7 text-[#596556]">
                        This gallery is not separate from the data model. It is attached to the recorded round and read as part of the same archive.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewArchiveSite;
