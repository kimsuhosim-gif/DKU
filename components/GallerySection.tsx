import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Search, X, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryPhotos } from '../utils/golfData';

interface GallerySectionProps {
  onBack: () => void;
}

type GalleryPhoto = (typeof galleryPhotos)[number];

interface GalleryAlbum {
  id: string;
  date: string;
  location: string;
  bestScore: number | string;
  participants: number;
  category: GalleryPhoto['category'];
  photos: GalleryPhoto[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ onBack }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const albums = Array.from(
    galleryPhotos.reduce((map, photo) => {
      const key = `${photo.date}-${photo.location}`;
      const album = map.get(key);

      if (album) {
        album.photos.push(photo);
      } else {
        map.set(key, {
          id: key,
          date: photo.date,
          location: photo.location,
          bestScore: photo.bestScore,
          participants: photo.participants,
          category: photo.category,
          photos: [photo],
        });
      }

      return map;
    }, new Map<string, GalleryAlbum>()).values()
  );

  const activePhoto = selectedAlbum?.photos[selectedPhotoIndex];

  const openAlbum = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setSelectedPhotoIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setSelectedPhotoIndex(0);
  };

  const movePhoto = (direction: 1 | -1) => {
    if (!selectedAlbum) return;
    setSelectedPhotoIndex((current) => (current + direction + selectedAlbum.photos.length) % selectedAlbum.photos.length);
  };

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
            Round Albums
          </span>
          <h2 className="font-serif text-3xl italic text-sage-600 sm:text-5xl md:text-6xl">라운딩 사진 보관함</h2>
          <p className="mt-5 break-keep text-sm font-bold leading-relaxed tracking-normal text-sage-400 opacity-90 sm:mt-8">
            라운딩별로 사진을 묶었습니다. 앨범을 누르면 그날 사진을 여러 장 넘겨볼 수 있습니다.
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
          {albums.map((album) => {
            const coverPhoto = album.photos[0];

            return (
              <motion.button
                key={album.id}
                type="button"
                layout
                variants={itemVariants}
                onClick={() => openAlbum(album)}
                className="group relative overflow-hidden rounded-[1.4rem] border border-dustyGold/20 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={coverPhoto.src}
                    alt={album.location}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/48 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                    <Images size={13} />
                    {album.photos.length}장
                  </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-sage-900/35 p-6 text-white opacity-100 transition-all duration-700 sm:opacity-0 sm:group-hover:opacity-100 sm:backdrop-blur-[2px] sm:p-8">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="flex space-x-8">
                    <div className="flex flex-col items-center">
                      <Trophy size={22} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Season Best</span>
                      <span className="font-serif text-2xl italic">{album.bestScore}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users size={22} className="mb-3 text-champagne-100" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Attendance</span>
                      <span className="font-serif text-2xl italic">{album.participants}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-lg italic text-sage-600 transition-colors group-hover:text-sage-400">
                      {album.location}
                    </h4>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-[10px] italic text-sage-300">
                        <Calendar size={10} />
                        <span>{album.date}</span>
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
            </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedAlbum && activePhoto ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/86 p-3 backdrop-blur-md sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.4rem] bg-[#fbfaf7] shadow-2xl sm:rounded-[2rem]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#16171b]/8 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6d1f2a]">Round album</p>
                  <h3 className="mt-1 break-keep text-xl font-bold text-[#172117] sm:text-2xl">{selectedAlbum.location}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#6e665a]">
                    {selectedAlbum.date} · {selectedAlbum.photos.length}장
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAlbum}
                  className="shrink-0 rounded-full bg-[#16171b] p-2 text-white transition hover:bg-[#6d1f2a]"
                  aria-label="앨범 닫기"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
                <img
                  src={activePhoto.src}
                  alt={selectedAlbum.location}
                  className="max-h-[62vh] w-full object-contain sm:max-h-[68vh]"
                />

                {selectedAlbum.photos.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => movePhoto(-1)}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/30"
                      aria-label="이전 사진"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(1)}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-white/30"
                      aria-label="다음 사진"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                ) : null}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/52 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                  {selectedPhotoIndex + 1} / {selectedAlbum.photos.length}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto bg-[#fbfaf7] p-3 sm:p-4">
                {selectedAlbum.photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-28 ${
                      index === selectedPhotoIndex ? 'border-[#6d1f2a] ring-2 ring-[#6d1f2a]/20' : 'border-[#c8a86b]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.src} alt={`${selectedAlbum.location} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
