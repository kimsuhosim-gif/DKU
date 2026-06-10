import React from 'react';
import { motion } from 'framer-motion';
import { ViewState } from '../App';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <div className="relative flex min-h-[78svh] w-full items-center overflow-hidden bg-[#f6f2eb] md:min-h-[86vh]">
      <motion.div
        initial={{ scale: 1.035, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/clubhouse-hero-ai.png"
          alt="DKU-RE09 private golf house"
          className="h-full w-full object-cover brightness-[1.06] contrast-[1.06] saturate-[0.96]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,247,0.78)_0%,rgba(251,250,247,0.54)_34%,rgba(246,242,235,0.14)_62%,rgba(22,23,27,0.04)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,250,247,0.18)_0%,rgba(251,250,247,0)_48%,rgba(246,242,235,0.7)_100%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#c8a86b]/35 bg-white/54 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6d1f2a] shadow-[0_18px_46px_-38px_rgba(22,23,27,0.34)] backdrop-blur-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16171b] text-xs font-semibold text-[#fbfaf7]">
              09
            </span>
            Private members archive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: 'easeOut' }}
            className="font-serif text-[2.9rem] leading-[0.95] tracking-normal text-[#16171b] drop-shadow-[0_18px_42px_rgba(255,255,255,0.72)] sm:text-7xl lg:text-[6.1rem]"
          >
            DKU-RE09
            <br />
            <span className="font-normal italic text-[#6d1f2a]">Golf House</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.46 }}
            className="mt-5 max-w-2xl break-keep text-[15px] font-semibold leading-8 text-[#3f3d39] sm:text-[17px] sm:leading-8"
          >
            라운드 일정, 회비, 순위, 멤버 소식을 한 화면에서 확인하는 09 전용 프라이빗 골프 하우스.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.74 }}
            className="mt-8 hidden max-w-3xl grid-cols-1 gap-3 sm:grid sm:grid-cols-3"
          >
            {[
              ['Heritage', 'Since 2009'],
              ['Access', 'Members Only'],
              ['House code', 'DKU-RE09'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1rem] border border-[#c8a86b]/28 bg-white/48 px-4 py-3 shadow-[0_16px_42px_-38px_rgba(22,23,27,0.3)] backdrop-blur-md sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#6e665a]">{label}</p>
                <p className="mt-2 break-words text-[1.1rem] font-bold tracking-normal text-[#16171b] sm:mt-3 sm:text-[1.28rem]">
                  {value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
