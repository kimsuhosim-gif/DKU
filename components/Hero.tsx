import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Trophy, Users } from 'lucide-react';
import { ViewState } from '../App';
import { getProcessRankings, records } from '../utils/golfData';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const latestRecord = records[0];
  const ranking = getProcessRankings();

  return (
    <div className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-champagne-100 md:min-h-[100vh]">
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2200&auto=format&fit=crop"
          alt="Luxury Golf Course"
          className="h-full w-full object-cover brightness-[0.9] contrast-[0.88] sepia-[0.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,28,20,0.72)_0%,rgba(18,28,20,0.56)_34%,rgba(18,28,20,0.16)_66%,rgba(247,241,232,0.12)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-50/10 via-transparent to-champagne-100/20" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_0.42fr] lg:items-end">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80 backdrop-blur-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xs font-semibold text-white">
              09
            </span>
            Private golf club
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            className="font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.2)] sm:text-7xl lg:text-[6.1rem]"
          >
            DKU-RE09
            <br />
            <span className="font-normal italic text-white/90">Private Golf Club</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 inline-block max-w-2xl rounded-2xl bg-black/28 px-4 py-3 backdrop-blur-md"
          >
            <p className="break-keep text-[15px] leading-8 text-white sm:text-[17px]">
              동기들끼리 라운드와 저녁 자리를 이어가며, 기록과 분위기를 함께 쌓아두는 프라이빗 클럽 공간입니다.
              스코어보다도 사람과 장면이 오래 남는 모임을 위한 기록 보관소입니다.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => onNavigate('records')}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2d382d] transition hover:bg-[#f7f1e8]"
            >
              라운드 기록 보기
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('members')}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/8 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:bg-white/12"
            >
              멤버 명단 보기
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
          >
            <div className="rounded-[1.7rem] border border-white/16 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">최근 우승</p>
              <p className="mt-3 break-words text-[1.35rem] font-semibold tracking-[-0.02em] text-white">{latestRecord?.winner}</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/16 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">최근 코스</p>
              <p className="mt-3 break-keep text-[1.15rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white">{latestRecord?.location}</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/16 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">현재 1위</p>
              <p className="mt-3 break-words text-[1.35rem] font-semibold tracking-[-0.02em] text-white">{ranking[0]?.name}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="hidden rounded-[2rem] border border-white/16 bg-white/12 p-5 text-white shadow-[0_30px_80px_-40px_rgba(15,22,15,0.55)] backdrop-blur-xl lg:block"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Club snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.4rem] bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-white/70" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Latest round</p>
                  <p className="mt-1 text-sm font-medium text-white">{latestRecord?.date}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-white/70" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Members</p>
                  <p className="mt-1 text-sm font-medium text-white">현재 멤버 15명</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-black/10 p-4">
              <div className="flex items-center gap-3">
                <Trophy size={16} className="text-white/70" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Leader</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {ranking[0]?.name} · Net {ranking[0]?.netScoreDisplay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
