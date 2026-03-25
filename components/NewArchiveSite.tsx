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

const NewArchiveSite: React.FC = () => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();
  const leaderboard = ranking.slice(0, 5);
  const featuredMembers = ranking.slice(0, 6);
  const participantCount = latestRecord?.attendees.length || 0;
  const balance = ledgerTransactions.reduce((acc, item) => acc + item.amount, 0);
  const roleCounts = members.reduce(
    (acc, member) => {
      if (member.role === '회장') acc.captain += 1;
      else if (member.role === '총무') acc.secretary += 1;
      else acc.member += 1;
      return acc;
    },
    { captain: 0, secretary: 0, member: 0 }
  );

  const latestCourse = latestRecord ? COURSE_LOCATIONS[latestRecord.location] : null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#283428]">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-[#f5efe6]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#71806b]">DKU-RE09 archive</p>
            <h1 className="mt-1 font-serif text-xl text-[#263326] sm:text-2xl">Season Recordbook</h1>
          </div>
          <div className="hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#42503f] lg:flex">
            <button onClick={() => scrollToSection('snapshot')}>Snapshot</button>
            <button onClick={() => scrollToSection('round')}>Round</button>
            <button onClick={() => scrollToSection('members')}>Members</button>
            <button onClick={() => scrollToSection('ledger')}>Ledger</button>
            <button onClick={() => scrollToSection('gallery')}>Gallery</button>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#263326] transition hover:bg-white"
          >
            <ArrowLeft size={14} />
            Existing site
          </a>
        </div>
      </div>

      <main className="pb-24">
        <section className="border-b border-black/5 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a886f]"
              >
                Current season archive
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-4 max-w-4xl font-serif text-5xl leading-[0.92] text-[#243023] sm:text-6xl lg:text-8xl"
              >
                Built from member data,
                <span className="block italic text-[#6e7f67]">round records, and quiet rivalry.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="mt-6 max-w-2xl text-[15px] leading-7 text-[#566254] sm:text-base"
              >
                The site is organized as a recordbook first: latest round, leaderboard, member directory,
                course archive, and club ledger in one continuous reading flow.
              </motion.p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => scrollToSection('round')}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#263326] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#1d281d]"
                >
                  View latest round
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => scrollToSection('members')}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white/80 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#263326] transition hover:bg-white"
                >
                  Open members
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_40px_120px_-60px_rgba(35,48,35,0.45)] sm:rounded-[2.75rem]"
            >
              <div className="grid gap-4 p-4 sm:p-5">
                <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                  <img
                    src={galleryPhotos[0]?.src || '/images/round1_group.jpg'}
                    alt="Latest round"
                    className="h-72 w-full object-cover sm:h-80"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-[#263326] p-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Latest round</p>
                    <p className="mt-3 text-sm text-white/70">{latestRecord?.date}</p>
                    <h3 className="mt-2 font-serif text-2xl">{latestRecord?.location}</h3>
                    <p className="mt-4 text-[13px] text-white/72">
                      Winner {latestRecord?.winner} · Best score {latestRecord?.score}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[#efe6da] p-5 text-[#263326]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#7c8775]">Attendance</p>
                    <p className="mt-3 font-serif text-4xl">{participantCount}</p>
                    <p className="mt-2 text-[13px] leading-6 text-[#5b6758]">
                      Members with full round scores, front/back split, and ranking impact.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="snapshot" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Snapshot</p>
                <h3 className="mt-3 font-serif text-3xl text-[#243023] sm:text-4xl">Current season at a glance</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.8rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <Trophy className="text-[#7a886f]" size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">Champion</span>
                </div>
                <p className="mt-5 font-serif text-3xl text-[#243023]">{latestRecord?.winner}</p>
                <p className="mt-2 text-sm text-[#5d695b]">Latest round winner with a best score of {latestRecord?.score}.</p>
              </div>

              <div className="rounded-[1.8rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <Users className="text-[#7a886f]" size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">Members</span>
                </div>
                <p className="mt-5 font-serif text-3xl text-[#243023]">{members.length}</p>
                <p className="mt-2 text-sm text-[#5d695b]">
                  {roleCounts.captain} captain, {roleCounts.secretary} secretary, {roleCounts.member} regular members.
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <Medal className="text-[#7a886f]" size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">Leader</span>
                </div>
                <p className="mt-5 font-serif text-3xl text-[#243023]">{leaderboard[0]?.name}</p>
                <p className="mt-2 text-sm text-[#5d695b]">Top net score: {leaderboard[0]?.netScoreDisplay || '-'}</p>
              </div>

              <div className="rounded-[1.8rem] border border-black/8 bg-[#263326] p-5 text-white">
                <div className="flex items-center justify-between">
                  <Wallet className="text-white/75" size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">Ledger</span>
                </div>
                <p className="mt-5 font-serif text-3xl">{formatCurrency(balance)}</p>
                <p className="mt-2 text-sm text-white/68">Current trust balance after the latest quarter settlement.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="round" className="border-y border-black/5 bg-white px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="rounded-[2rem] bg-[#f1eadf] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Round report</p>
                <h3 className="mt-4 font-serif text-3xl text-[#243023] sm:text-4xl">{latestRecord?.location}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] bg-white p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">Date</p>
                    <p className="mt-2 text-lg text-[#243023]">{latestRecord?.date}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-white p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">Winner</p>
                    <p className="mt-2 text-lg text-[#243023]">{latestRecord?.winner}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[1.4rem] bg-[#263326] p-5 text-white">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Summary</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    Twelve members recorded a full scorecard. The best round finished at {latestRecord?.score}, and
                    front/back splits are preserved for each attendee.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/8 bg-[#fbf8f2] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Scoreboard</p>
                  <CalendarDays size={18} className="text-[#7a886f]" />
                </div>
                <div className="space-y-3">
                  {latestRecord?.attendees
                    .slice()
                    .sort((a, b) => a.score - b.score)
                    .map((attendee, index) => (
                      <div
                        key={`${attendee.name}-${index}`}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.25rem] border border-black/6 bg-white px-4 py-3"
                      >
                        <div className="w-8 text-center text-sm font-semibold text-[#7a886f]">{index + 1}</div>
                        <div>
                          <p className="text-base text-[#243023]">{attendee.name}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#7a886f]">
                            Front {attendee.front} · Back {attendee.back}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#eef2ea] px-3 py-1.5 text-sm font-semibold text-[#243023]">
                          {attendee.score}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="members" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Directory</p>
              <h3 className="mt-3 font-serif text-3xl text-[#243023] sm:text-4xl">Members and current standing</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredMembers.map((member) => (
                <div key={member.name} className="rounded-[1.8rem] border border-black/8 bg-white p-5 shadow-[0_20px_60px_-50px_rgba(35,48,35,0.4)]">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-20 w-20 rounded-[1.3rem] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-serif text-2xl text-[#243023]">{member.name}</h4>
                        {member.role === '회장' && <Crown size={16} className="text-amber-500" />}
                        {member.role === '총무' && <Medal size={16} className="text-sky-500" />}
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#7a886f]">{member.role}</p>
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="mt-3 inline-flex items-center gap-2 text-sm text-[#556353]">
                          <Phone size={14} />
                          {member.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-[1rem] bg-[#f3eee5] p-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a886f]">HC</p>
                      <p className="mt-2 text-lg text-[#243023]">
                        {member.scoreHistory.length > 0 ? member.handicap.toFixed(1) : 'New'}
                      </p>
                    </div>
                    <div className="rounded-[1rem] bg-[#f3eee5] p-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a886f]">Gross</p>
                      <p className="mt-2 text-lg text-[#243023]">{member.latestScore}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[#f3eee5] p-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a886f]">Net</p>
                      <p className="mt-2 text-lg text-[#243023]">{member.netScoreDisplay}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/5 bg-[#f0e7db] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Course archive</p>
              <h3 className="mt-4 font-serif text-3xl text-[#243023]">{latestRecord?.location}</h3>
              <div className="mt-5 overflow-hidden rounded-[1.5rem]">
                <img
                  src={latestCourse?.img}
                  alt={latestRecord?.location}
                  className="h-64 w-full object-cover"
                />
              </div>
              <div className="mt-5 flex items-start gap-3 text-[#556353]">
                <MapPin size={18} className="mt-1 shrink-0" />
                <p className="text-sm leading-7">{latestCourse?.address}</p>
              </div>
            </div>

            <div id="ledger" className="rounded-[2rem] bg-[#263326] p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Club ledger</p>
              <h3 className="mt-4 font-serif text-3xl">Quarter settlement overview</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Current balance</p>
                  <p className="mt-3 font-serif text-4xl">{formatCurrency(balance)}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Account</p>
                  <p className="mt-3 text-lg">KakaoBank 3333-16-4428815</p>
                  <p className="mt-2 text-sm text-white/65">Club secretary managed account.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {ledgerTransactions.slice(0, 4).map((item) => (
                  <div key={`${item.date}-${item.desc}`} className="flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm">{item.desc}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45">{item.date}</p>
                    </div>
                    <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-[#d9f0d1]' : 'text-[#ffd0c3]'}`}>
                      {item.amount > 0 ? '+' : '-'} {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a886f]">Gallery</p>
              <h3 className="mt-3 font-serif text-3xl text-[#243023] sm:text-4xl">Visual archive linked to the round</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-[1.8rem] border border-black/8 bg-white">
                  <div className="relative">
                    <img src={photo.src} alt={photo.location} className="h-72 w-full object-cover" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#243023]">
                      <Camera size={12} />
                      {photo.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a886f]">{photo.date}</p>
                    <h4 className="mt-3 font-serif text-2xl text-[#243023]">{photo.location}</h4>
                    <p className="mt-3 text-sm leading-7 text-[#586457]">
                      Best score {photo.bestScore} · Participants {photo.participants}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewArchiveSite;
