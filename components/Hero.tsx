
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-champagne-100">
      {/* Background with subtle animation */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Golf Course" 
          className="w-full h-full object-cover brightness-95 contrast-75 sepia-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-champagne-50/40 via-transparent to-champagne-100/60"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center text-white font-serif italic text-sm backdrop-blur-sm">
            09
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-serif text-white tracking-tight drop-shadow-2xl leading-tight"
        >
          DKU-RE09 <br />
          <span className="italic font-normal opacity-90">Golf Club</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 text-white/80 text-sm md:text-base tracking-[0.3em] uppercase font-light"
        >
          Dankook Univ. Urban Planning & Real Estate
        </motion.p>
      </div>

      {/* Floating Golf Ball Detail (Titleist 09 Concept) */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-[10%] right-[10%] w-48 h-48 md:w-80 md:h-80 opacity-40 mix-blend-screen pointer-events-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop" 
          alt="Titleist 09 Ball"
          className="w-full h-full object-contain grayscale brightness-150"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-5xl md:text-7xl text-black/20 font-bold select-none">09</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4"
      >
        <span className="text-white/60 text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Hero;
