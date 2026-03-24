import React from 'react';
import { motion } from 'framer-motion';
import { getProcessRankings, galleryPhotos, members, records } from '../utils/golfData';
import {
  ArrowRight,
  Camera,
  Map as MapIcon,
  Trophy,
  Users,
} from 'lucide-react';
import { ViewState } from '../App';

interface BentoGridProps {
  onNavigate: (view: ViewState) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ onNavigate }) => {
  const rankingLeader = getProcessRankings()[0];
  const latestPhoto = galleryPhotos[0];
  const latestRecord = records[0];

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      className="grid gap-4 sm:gap-5 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <motion.button
        variants={itemVariants}
        onClick={() => onNavigate('ranking')}
        className="group overflow-hidden rounded-[2rem] border border-[#d8d0c4] bg-[#f8f4ec] text-left shadow-[0_30px_80px_-55px_rgba(34,48,34,0.5)] transition hover:-translate-y-1 hover:border-[#9cad92] sm:rounded-[2.75rem]"
      >
        <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 md:grid-cols-[0.95fr_1.05fr] md:p-6">
          <div className="rounded-[1.5rem] bg-[#2b382c] p-5 text-white sm:rounded-[2rem] sm:p-7">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/55 sm:text-[10px] sm:tracking-[0.28em]">Standings</p>
            <h3 className="mt-3 font-serif text-3xl italic leading-tight sm:mt-4 sm:text-4xl">Quarter leader board</h3>
            <p className="mt-3 max-w-sm text-[13px] leading-6 text-white/70 sm:mt-4 sm:text-sm sm:leading-7">
              홈에서는 중요한 정보만 먼저 보여주고, 자세한 기록은 전용 화면으로 넘깁니다.
            </p>
            <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.22em]">Current leader</p>
                <p className="mt-2 text-lg font-serif italic sm:text-xl">{rankingLeader?.name || 'Member'}</p>
                <p className="mt-1 text-sm text-white/60">Net {rankingLeader?.netScoreDisplay || '-'}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:rounded-[1.5rem]">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.22em]">Recorded round</p>
                <p className="mt-2 text-lg font-serif italic sm:text-xl">{latestRecord?.date || '2025.11.29'}</p>
                <p className="mt-1 text-sm text-white/60">Score {latestRecord?.score || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.5rem] bg-white p-5 sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecf2e8] text-[#536552] sm:h-12 sm:w-12">
                <Trophy size={20} />
              </span>
              <ArrowRight size={18} className="text-slate-300 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-8 sm:mt-10">
              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400 sm:text-[10px] sm:tracking-[0.28em]">Home preview</p>
              <h4 className="mt-3 font-serif text-2xl italic text-[#2b382c] sm:mt-4 sm:text-3xl">Less dashboard noise, more hierarchy.</h4>
              <p className="mt-3 max-w-md text-[13px] leading-6 text-slate-500 sm:mt-4 sm:text-sm sm:leading-7">
                카드 수를 줄이고 모바일에서도 우선순위가 바로 읽히도록 정리했습니다.
              </p>
            </div>
          </div>
        </div>
      </motion.button>

      <div className="grid gap-4 sm:gap-5">
        <motion.button
          variants={itemVariants}
          onClick={() => onNavigate('gallery')}
          className="group overflow-hidden rounded-[1.8rem] border border-[#d8d0c4] bg-white text-left transition hover:-translate-y-1 hover:border-[#9cad92] hover:shadow-[0_25px_70px_-45px_rgba(34,48,34,0.45)] sm:rounded-[2.5rem]"
        >
          <div className="relative h-48 overflow-hidden sm:h-56">
            <img
              src={latestPhoto?.src || 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=1200&auto=format&fit=crop'}
              alt="Archive preview"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/60 sm:text-[10px] sm:tracking-[0.28em]">Archive</p>
              <p className="mt-2 font-serif text-2xl italic sm:text-3xl">Visual memory</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
            <p className="pr-4 text-[13px] leading-6 text-slate-500 sm:text-sm sm:leading-7">최근 사진과 라운드 분위기를 먼저 보여주는 섹션입니다.</p>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#536552]">
              <Camera size={18} />
            </span>
          </div>
        </motion.button>

        <div className="grid gap-4 md:grid-cols-2 sm:gap-5">
          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate('members')}
            className="group rounded-[1.8rem] border border-[#d8d0c4] bg-[#fbf8f2] p-5 text-left transition hover:-translate-y-1 hover:border-[#9cad92] sm:rounded-[2.25rem] sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#536552]">
              <Users size={18} />
            </span>
            <p className="mt-5 text-[9px] uppercase tracking-[0.22em] text-slate-400 sm:mt-6 sm:text-[10px] sm:tracking-[0.25em]">Members</p>
            <h3 className="mt-2 font-serif text-3xl italic text-[#2b382c]">{members.length}</h3>
            <p className="mt-2 text-[13px] leading-6 text-slate-500 sm:mt-3 sm:text-sm sm:leading-7">멤버 프로필과 최근 흐름을 간결하게 확인합니다.</p>
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => onNavigate('map')}
            className="group rounded-[1.8rem] border border-[#d8d0c4] bg-[#2b382c] p-5 text-left text-white transition hover:-translate-y-1 hover:border-[#7d9274] sm:rounded-[2.25rem] sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <MapIcon size={18} />
            </span>
            <p className="mt-5 text-[9px] uppercase tracking-[0.22em] text-white/45 sm:mt-6 sm:text-[10px] sm:tracking-[0.25em]">Map</p>
            <h3 className="mt-2 font-serif text-3xl italic">Urban rounds</h3>
            <p className="mt-2 text-[13px] leading-6 text-white/65 sm:mt-3 sm:text-sm sm:leading-7">라운드 장소를 지도 위에 모아 클럽의 이동 기록처럼 보여줍니다.</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BentoGrid;
