
import React, { useState } from 'react';
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-champagne-50 min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-bold mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Exit Archive</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
        <div className="max-w-xl">
          <span className="text-sage-400 font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Visual Chronicles</span>
          <h2 className="text-5xl md:text-6xl font-serif text-sage-600 italic">Seasonal Portfolio</h2>
          <p className="font-sans text-sm font-bold text-sage-400 tracking-widest mt-8 opacity-90 leading-relaxed">
            "도시를 기록하듯 우리의 계절을 기록합니다"
          </p>
        </div>


      </div>

      {/* Masonry-style Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="columns-1 md:columns-2 lg:columns-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {galleryPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              variants={itemVariants}
              className="masonry-item group relative overflow-hidden bg-white rounded-[2.5rem] border-[0.5px] border-dustyGold/20 shadow-sm mb-8"
            >
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={photo.src}
                  alt={photo.location}
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                />

                {/* Hover Info Panel */}
                <div className="absolute inset-0 bg-sage-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-center items-center text-white p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex space-x-10"
                  >
                    <div className="flex flex-col items-center">
                      <Trophy size={24} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Season Best</span>
                      <span className="text-2xl font-serif italic">{photo.bestScore}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users size={24} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Attendance</span>
                      <span className="text-2xl font-serif italic">{photo.participants}</span>
                    </div>
                  </motion.div>
                  <button className="mt-12 px-6 py-2 border border-white/40 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-sage-600 transition-all">
                    Review Post
                  </button>
                </div>
              </div>

              <div className="p-8 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-serif text-sage-600 italic group-hover:text-sage-400 transition-colors">{photo.location}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1 text-[10px] text-sage-300 font-serif italic">
                        <Calendar size={10} />
                        <span>{photo.date}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-champagne-200"></span>
                      <div className="flex items-center space-x-1 text-[10px] text-sage-300 uppercase tracking-widest font-bold">
                        <MapPin size={10} />
                        <span>Location</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-champagne-100 flex items-center justify-center text-sage-200 group-hover:bg-sage-50 group-hover:text-sage-400 transition-all">
                    <Search size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-24 border-t border-champagne-100 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[11px] text-sage-300 uppercase tracking-[0.5em] font-bold">DKU-RE09 Archive Box</span>
          <span className="text-[10px] text-sage-200 mt-2">Legacy of Dankook Urban Planning & Real Estate</span>
        </div>
        <div className="flex space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-sage-400' : 'bg-sage-100'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
