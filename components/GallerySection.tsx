import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Search } from 'lucide-react';
import { galleryPhotos } from '../utils/golfData';

interface GallerySectionProps {
  onBack: () => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ onBack }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-champagne-50 px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Exit Archive</span>
      </button>

      <div className="mb-10 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="max-w-xl">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-sage-400">
            Visual Chronicles
          </span>
          <h2 className="font-serif text-3xl italic text-sage-600 sm:text-5xl md:text-6xl">Seasonal Portfolio</h2>
          <p className="mt-5 text-sm font-bold leading-relaxed tracking-[0.16em] text-sage-400 opacity-90 sm:mt-8">
            Quiet documentation of rounds, places, and the atmosphere around them.
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {galleryPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2rem] border border-dustyGold/20 bg-white shadow-sm sm:rounded-[2.5rem]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.location}
                  className="h-full w-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-sage-900/35 p-6 text-white opacity-100 transition-all duration-700 sm:opacity-0 sm:group-hover:opacity-100 sm:backdrop-blur-[2px] sm:p-8">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="flex space-x-8">
                    <div className="flex flex-col items-center">
                      <Trophy size={22} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Season Best</span>
                      <span className="font-serif text-2xl italic">{photo.bestScore}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users size={22} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Attendance</span>
                      <span className="font-serif text-2xl italic">{photo.participants}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-lg italic text-sage-600 transition-colors group-hover:text-sage-400">
                      {photo.location}
                    </h4>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-[10px] italic text-sage-300">
                        <Calendar size={10} />
                        <span>{photo.date}</span>
                      </div>
                      <span className="h-1 w-1 rounded-full bg-champagne-200" />
                      <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-sage-300">
                        <MapPin size={10} />
                        <span>Location</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne-100 text-sage-200 transition-all group-hover:bg-sage-50 group-hover:text-sage-400">
                    <Search size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-champagne-100 pt-10 sm:mt-24 sm:flex-row sm:items-center sm:gap-8 sm:pt-16">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-sage-300">DKU-RE09 Archive Box</span>
          <span className="mt-2 text-[10px] text-sage-200">Visual record for the class of 2009</span>
        </div>
        <div className="flex space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-sage-400' : 'bg-sage-100'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
