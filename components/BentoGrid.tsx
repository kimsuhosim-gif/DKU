import React from 'react';
import { motion } from 'framer-motion';
import {
  clubEvents,
  galleryPhotos,
  getProcessRankings,
  hallOfFame,
  nextRoundGroups,
  nextSchedule,
  records,
} from '../utils/golfData';
import {
  Users,
  Trophy,
  ArrowUpRight,
  Clock,
  ArrowRight,
  Map as MapIcon,
  TrendingUp,
  CalendarDays,
  Images,
  Wallet,
  Camera,
  Bell,
  HeartHandshake,
  Flag,
  Crown,
  ListChecks,
} from 'lucide-react';
import { ViewState } from '../App';

interface BentoGridProps {
  onNavigate: (view: ViewState) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ onNavigate }) => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();
  const balance = 510500;
  const latestEvent = clubEvents[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const quickActions: { icon: React.ReactNode; label: string; padding: string; view: ViewState }[] = [
    { icon: <Users size={18} />, label: '멤버', padding: 'bg-sage-100', view: 'members' },
    { icon: <Trophy size={18} />, label: '기록', padding: 'bg-champagne-100', view: 'records' },
    { icon: <MapIcon size={18} />, label: '지도', padding: 'bg-sage-50', view: 'map' },
  ];

  const rankingData = ranking.slice(0, 3).map((p, i) => ({
    rank: i + 1,
    name: p.name,
    score: `Net ${p.netScoreDisplay}`,
  }));

  return (
    <div>
      <div className="mb-8 sm:mb-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sage-400">클럽 라운지</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <h2 className="font-serif text-3xl italic leading-[1.02] tracking-[-0.03em] text-sage-700 sm:text-5xl">
              라운드 기록과
              <br />
              동기 모임의 흐름.
            </h2>
          </div>
          <p className="max-w-2xl break-keep text-[15px] leading-8 text-sage-500">
            스코어, 멤버, 랭킹, 회비 장부는 물론 골프 밖의 멤버 소식까지 한 화면에서 확인할 수 있도록 정리했습니다.
            동기들끼리 공유하는 프라이빗 클럽 대시보드입니다.
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid h-auto grid-cols-1 gap-4 md:grid-cols-4 md:gap-4"
      >
        <motion.div
          variants={itemVariants}
          className="bento-card relative flex flex-col justify-between overflow-visible rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-8 md:col-span-2 md:row-span-1"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl italic text-sage-600">Quick Access</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sage-300">members only dashboard</p>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-sage-300">09 club</span>
          </div>

          <motion.div
            onClick={() => onNavigate('ledger')}
            whileHover={{ y: -2 }}
            className="group mb-4 flex cursor-pointer items-center justify-between rounded-[1.6rem] bg-sage-400 p-4 text-white shadow-lg shadow-sage-400/10 transition-all hover:bg-sage-500 sm:rounded-[2rem] sm:p-5"
          >
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/20">
                <Wallet size={20} className="text-champagne-50" />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] opacity-70">클럽 자산</p>
                <p className="text-[1.45rem] font-semibold tracking-[-0.03em]">₩{balance.toLocaleString()}</p>
                <p className="mt-0.5 text-[10px] opacity-80">카카오뱅크 3333-16-4428815</p>
              </div>
            </div>
            <div className="hidden flex-col items-end text-right sm:flex">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] opacity-70">최근 라운드</p>
              <p className="mt-1 text-[11px] opacity-90">{latestRecord?.date}</p>
              <div className="mt-2 flex items-center space-x-1 opacity-0 transition-all group-hover:opacity-100">
                <span className="text-[9px] uppercase tracking-[0.16em]">상세 보기</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {quickActions.map((btn) => (
              <button
                key={btn.label}
                onClick={() => onNavigate(btn.view)}
                className={`group/btn flex flex-col items-center justify-center space-y-2 rounded-2xl border border-transparent px-1 py-4 text-[10px] font-medium uppercase tracking-[0.08em] text-sage-600 transition-all duration-300 hover:scale-[1.05] hover:border-sage-200/50 active:scale-95 sm:py-5 sm:text-[11px] ${btn.padding}`}
              >
                <span className="rounded-lg bg-white/50 p-2 transition-colors group-hover/btn:bg-white">{btn.icon}</span>
                <span className="whitespace-nowrap">{btn.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group -mt-1 flex cursor-pointer flex-col rounded-[2rem] border-2 border-transparent bg-white p-5 hover:border-sage-100 md:mt-0 md:col-span-1 md:row-span-1 md:min-h-[260px] md:p-8"
          onClick={() => onNavigate('records')}
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-400 text-white transition-colors group-hover:bg-sage-500">
              <CalendarDays size={24} />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-sage-300">Round</span>
          </div>
          <div className="mt-12 md:mt-14">
            <h3 className="font-sans text-xl font-semibold tracking-[-0.02em] text-sage-600">최근 라운드 요약</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sage-400">{latestRecord?.date}</p>
            <div className="mt-4 flex items-center space-x-1 text-sage-300">
              <Clock size={12} />
              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">{latestRecord?.winner} 우승</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group -mt-1 flex cursor-pointer flex-col rounded-[2rem] bg-sage-50 p-5 md:mt-0 md:col-span-1 md:row-span-1 md:min-h-[260px] md:p-8"
          onClick={() => onNavigate('records')}
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sage-400 shadow-sm transition-colors group-hover:text-sage-500">
              <Trophy size={24} />
            </div>
            <ArrowUpRight size={18} className="text-sage-200 transition-colors group-hover:text-sage-400" />
          </div>
          <div className="mt-12 md:mt-14">
            <h3 className="font-sans text-xl font-semibold tracking-[-0.02em] text-sage-600">최근 코스</h3>
            <p className="mt-1 break-keep text-[11px] uppercase tracking-[0.16em] text-sage-400">{latestRecord?.date}</p>
            <p className="mt-4 break-keep text-sm leading-6 text-sage-500">{latestRecord?.location}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group flex cursor-pointer flex-col rounded-[2rem] bg-white p-5 md:col-span-2 md:row-span-1 md:p-8"
          onClick={() => onNavigate('ranking')}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-2xl italic text-sage-600">Ranking</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-sage-400">current top 3</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-sage-400 transition-all group-hover:bg-sage-400 group-hover:text-white">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {rankingData.map((p) => (
              <div
                key={p.rank}
                className="flex items-center justify-between rounded-2xl border border-transparent bg-champagne-50/50 p-3 transition-colors hover:border-champagne-200/50 hover:bg-champagne-100"
              >
                <div className="flex items-center space-x-4">
                  <span className={`text-[10px] font-semibold ${p.rank === 1 ? 'text-amber-500' : 'text-sage-400'}`}>0{p.rank}</span>
                  <span className="text-sm font-medium text-sage-600">{p.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs font-medium text-sage-500">{p.score}</div>
                  <ArrowRight size={14} className="translate-x-0 text-sage-200 transition-all group-hover:translate-x-0 group-hover:opacity-100 md:opacity-0 md:-translate-x-2" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group/event flex flex-col overflow-hidden rounded-[2rem] border border-[#e7dcc9] bg-[#fcf8ef] p-5 md:col-span-2 md:row-span-1 md:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sage-400 shadow-sm">
                <Bell size={12} />
                Event Board
              </div>
              <h3 className="mt-3 font-serif text-xl italic leading-tight text-sage-600 sm:text-2xl">멤버 소식</h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-600 text-white shadow-lg shadow-sage-600/10">
              <HeartHandshake size={18} />
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-champagne-100 bg-white/75 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-lg shadow-sm">
                  {latestEvent.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sage-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] text-sage-500">
                    {latestEvent.type}
                  </span>
                  <span className="text-[11px] font-semibold text-sage-400">{latestEvent.date}</span>
                </div>
                <p className="mt-2 truncate text-base font-semibold tracking-[-0.03em] text-sage-700">{latestEvent.title}</p>
                {latestEvent.venue ? (
                  <p className="mt-1 truncate text-[13px] font-semibold text-sage-500">📍 {latestEvent.venue}</p>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="group/archive flex cursor-pointer flex-col overflow-visible rounded-[2rem] border border-champagne-100 bg-white md:col-span-2 md:row-span-1"
          onClick={() => onNavigate('gallery')}
        >
          <div className="flex items-center justify-between p-5 pb-4 md:p-8 md:pb-4">
            <div>
              <h3 className="font-serif text-2xl italic text-sage-600">Photo Archive</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-sage-300">recent photo entries</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-sage-300">갤러리 보기</span>
              <Images size={16} className="text-sage-300 transition-colors group-hover/archive:text-sage-400" />
            </div>
          </div>

          <div className="grid flex-grow grid-cols-3 gap-2 px-5 pb-5 md:gap-3 md:px-8 md:pb-6">
            {galleryPhotos.slice(0, 3).map((photo) => (
              <div key={photo.id} className="group/img relative aspect-[4/3] overflow-hidden rounded-2xl border-[0.5px] border-dustyGold/20 md:aspect-[3/4]">
                <img
                  src={photo.src}
                  alt={photo.location}
                  className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover/img:scale-110 group-hover/img:grayscale-0"
                />
                <div className="absolute inset-0 bg-sage-900/10 opacity-0 transition-opacity group-hover/img:opacity-100" />
                <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                  <Camera size={10} className="text-white/80" />
                  <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-white/80">{photo.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-champagne-100/50 bg-champagne-50/50 px-5 py-4 md:px-8 md:py-5">
            <span className="break-keep text-[11px] text-sage-400 opacity-80">{latestRecord?.location} 라운드의 현장 사진 기록입니다.</span>
            <span className="flex items-center text-[9px] font-medium uppercase tracking-[0.18em] text-sage-400 transition-transform group-hover/archive:translate-x-1">
              Explore <ArrowRight size={10} className="ml-2" />
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-champagne-100 bg-white p-5 md:col-span-2 md:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-300">Next Schedule</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-sage-700">다음 일정</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-50 text-sage-500">
              <Flag size={18} />
            </div>
          </div>
          <div className="mt-5 rounded-[1.4rem] bg-champagne-50/70 p-4">
            <p className="text-[15px] font-semibold text-sage-700">{nextSchedule.title}</p>
            <p className="mt-2 text-sm font-medium text-sage-500">{nextSchedule.date}</p>
            <p className="mt-1 text-xs text-sage-400">📍 {nextSchedule.location}</p>
            <p className="mt-4 break-keep text-xs leading-5 text-sage-400">{nextSchedule.note}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-champagne-100 bg-[#243326] p-5 text-white md:col-span-2 md:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Hall of Fame</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">명예의 전당</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#f6df9f]">
              <Crown size={18} />
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {hallOfFame.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/8 p-3">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-white/45">{item.label}</p>
                <p className="mt-2 truncate text-base font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-[#f6df9f]">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-champagne-100 bg-white p-5 md:col-span-1 md:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-300">Pairing</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-sage-700">이번 라운드 조</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-50 text-sage-500">
              <ListChecks size={18} />
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {nextRoundGroups.map((group) => (
              <div key={group.group} className="rounded-[1.2rem] bg-champagne-50/70 p-3">
                <p className="text-[10px] font-bold tracking-[0.14em] text-sage-300">{group.group}</p>
                <p className="mt-2 break-keep text-sm font-semibold leading-5 text-sage-600">{group.members.join(' · ')}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BentoGrid;
