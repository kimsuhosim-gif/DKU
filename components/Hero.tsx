import React from 'react';
import { motion } from 'framer-motion';
import { ViewState } from '../App';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <div className="relative flex min-h-[92svh] w-full items-center justify-center overflow-hidden bg-champagne-100 md:min-h-[100vh]">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Golf Course"
          className="h-full w-full object-cover brightness-95 contrast-75 sepia-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-50/40 via-transparent to-champagne-100/60" />
      </motion.div>

      <div className="relative z-10 px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-5 flex justify-center sm:mb-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-sm font-serif italic text-white backdrop-blur-sm sm:h-12 sm:w-12">
            09
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          className="font-serif text-5xl leading-[0.96] tracking-tight text-white drop-shadow-2xl sm:text-7xl md:text-9xl"
        >
          DKU-RE09
          <br />
          <span className="font-normal italic opacity-90">Golf Club</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-6 text-[11px] font-light uppercase tracking-[0.24em] text-white/80 sm:mt-8 sm:text-sm sm:tracking-[0.3em] md:text-base"
        >
          Dankook Univ. Urban Planning &amp; Real Estate
        </motion.p>
      </div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute bottom-[9%] right-[6%] hidden h-44 w-44 opacity-40 mix-blend-screen md:block md:h-72 md:w-72"
      >
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop"
          alt="Titleist 09 Ball"
          className="h-full w-full object-contain grayscale brightness-150"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-serif text-5xl font-bold text-black/20 md:text-7xl">09</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center space-y-4 sm:flex md:bottom-10"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </div>
  );
};

export default Hero;
