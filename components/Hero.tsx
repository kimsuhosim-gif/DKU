import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GalleryVerticalEnd, Map } from 'lucide-react';
import { ViewState } from '../App';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const heroStats = [
  { label: 'Archive', value: '2009-' },
  { label: 'Rounds', value: 'Quarterly' },
  { label: 'Mood', value: 'Quiet' },
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-[#f6f0e8] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_transparent_42%),linear-gradient(135deg,_rgba(73,89,69,0.08),_transparent_55%)]" />
      <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#d2dfcb]/50 blur-3xl md:top-24 md:h-72 md:w-72" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#d6b987]/20 blur-3xl md:h-[28rem] md:w-[28rem]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10">
        <div className="order-2 max-w-2xl lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500 backdrop-blur sm:gap-3 sm:px-4 sm:text-[10px] sm:tracking-[0.28em]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#50604a] font-serif text-[11px] text-white sm:h-8 sm:w-8 sm:text-xs">09</span>
            Members archive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl font-serif text-[2.8rem] leading-[0.92] text-[#253026] sm:mt-8 sm:text-5xl lg:text-7xl"
          >
            The private record
            <span className="mt-2 block italic text-[#6c7c62] sm:mt-3">of DKU-RE09 Golf Club</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-[15px] leading-6 text-slate-600 sm:mt-8 sm:text-base sm:leading-7"
          >
            라운드 기록과 멤버 흐름을 차분하게 정리한 모바일 중심 클럽 아카이브입니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-row sm:gap-4"
          >
            <button
              onClick={() => onNavigate('gallery')}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#2d382d] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#223022] sm:px-7 sm:text-sm sm:tracking-[0.2em]"
            >
              <GalleryVerticalEnd size={18} />
              View Archive
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('ranking')}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-900/10 bg-white/75 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d382d] backdrop-blur transition hover:border-[#2d382d]/30 hover:bg-white sm:px-7 sm:text-sm sm:tracking-[0.2em]"
            >
              Open Standings
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-3 gap-3 border-t border-slate-900/10 pt-5 sm:mt-14 sm:gap-4 sm:pt-8"
          >
            {heroStats.map((item) => (
              <div key={item.label}>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.25em]">{item.label}</p>
                <p className="mt-1.5 font-serif text-lg italic text-[#2d382d] sm:mt-2 sm:text-2xl">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 relative lg:order-2 lg:justify-self-end"
        >
          <div className="absolute -inset-3 rounded-[2rem] border border-white/60 bg-white/35 blur-2xl sm:-inset-6 sm:rounded-[2.5rem]" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2.5 shadow-[0_40px_90px_-40px_rgba(34,48,34,0.45)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
            <div className="relative aspect-[4/4.8] overflow-hidden rounded-[1.5rem] sm:aspect-[4/5] sm:rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1513553404607-988d4c6ca6e9?q=80&w=1400&auto=format&fit=crop"
                alt="Golf course landscape"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#213022]/70 via-transparent to-white/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-7">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/65 sm:text-[10px] sm:tracking-[0.28em]">Quarter archive</p>
                <p className="mt-2 max-w-sm font-serif text-2xl italic leading-tight sm:mt-3 sm:text-3xl">
                  Built around records, not noise.
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[1fr_auto]">
              <div className="rounded-[1.35rem] bg-[#273428] px-4 py-4 text-white sm:rounded-[1.75rem] sm:px-5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/60 sm:text-[10px] sm:tracking-[0.24em]">Current focus</p>
                <p className="mt-2 text-[13px] leading-5 text-white/85 sm:text-sm sm:leading-6">
                  Archive first, utilities second. 모바일에서도 첫 화면은 기능보다 분위기를 먼저 보여줍니다.
                </p>
              </div>
              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-slate-900/10 bg-[#efe7dc] px-4 py-4 text-sm font-semibold text-[#273428] transition hover:bg-white sm:rounded-[1.75rem] sm:px-5"
              >
                <Map size={16} />
                Urban map
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
