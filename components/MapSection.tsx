import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Ruler, ExternalLink } from 'lucide-react';
import { records, COURSE_LOCATIONS } from '../utils/golfData';

interface MapSectionProps {
  onBack: () => void;
}

interface MapProject {
  id: string;
  name: string;
  date: string;
  location: { lat: number; lng: number };
  address: string;
  img: string;
  winner: string;
  score: number;
}

const NAVER_MAP_API_KEY_ID = import.meta.env.VITE_NAVER_MAP_API_KEY_ID || '02j9jku1mt';
const STATIC_MAP_BASE_URL = 'https://maps.apigw.ntruss.com/map-static/v2/raster-cors';

const MapSection: React.FC<MapSectionProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [mapError, setMapError] = useState(false);

  const projects: MapProject[] = useMemo(() => {
    return records
      .map((r, idx) => {
        const meta = COURSE_LOCATIONS[r.location];
        if (!meta) return null;
        return {
          id: (idx + 1).toString().padStart(3, '0'),
          name: r.location,
          date: r.date,
          location: { lat: meta.lat, lng: meta.lng },
          address: meta.address,
          img: meta.img,
          winner: r.winner,
          score: r.score,
        };
      })
      .filter((p) => p !== null) as MapProject[];
  }, []);

  const activeProject = selectedProject || projects[0] || null;

  const staticMapUrl = useMemo(() => {
    if (!activeProject) return '';

    const marker = encodeURIComponent(`type:d|size:mid|color:Blue|pos:${activeProject.location.lng} ${activeProject.location.lat}`);
    const center = `${activeProject.location.lng},${activeProject.location.lat}`;

    return `${STATIC_MAP_BASE_URL}?w=1200&h=900&center=${center}&level=12&scale=2&format=png&lang=ko&markers=${marker}&X-NCP-APIGW-API-KEY-ID=${NAVER_MAP_API_KEY_ID}`;
  }, [activeProject]);

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="mb-6 sm:mb-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">
              Course Archive
            </span>
            <h2 className="mt-3 font-serif text-3xl italic text-sage-600 sm:text-5xl">Urban Rounding Map</h2>
            <p className="mt-3 max-w-sm text-sm italic leading-relaxed text-sage-400">
              라운드 기록을 코스 위치 기준으로 정리한 지도 아카이브입니다.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[560px] lg:flex-col lg:overflow-y-auto lg:pr-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setMapError(false);
                }}
                className={`min-w-[210px] rounded-[1.6rem] border p-4 text-left transition-all duration-500 lg:min-w-0 lg:p-6 ${
                  activeProject?.id === p.id
                    ? 'scale-[1.01] border-sage-400 bg-sage-400 text-white shadow-lg'
                    : 'border-champagne-100 bg-white text-sage-600 hover:border-sage-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${activeProject?.id === p.id ? 'text-white/70' : 'text-sage-300'}`}>
                    No.{p.id}
                  </span>
                  <span className="font-mono text-[10px] opacity-60">{p.date}</span>
                </div>
                <h4 className="mt-2 break-keep font-serif text-lg italic">{p.name}</h4>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-sage-100 bg-sage-50 shadow-inner sm:min-h-[560px] sm:rounded-[4rem] lg:col-span-8">
          {activeProject && !mapError ? (
            <img
              src={staticMapUrl}
              alt={`${activeProject.name} map`}
              className="h-full w-full object-cover"
              onError={() => setMapError(true)}
            />
          ) : null}

          <AnimatePresence>
            {mapError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-sage-50/88 px-8 text-center backdrop-blur-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                  <ExternalLink size={20} />
                </div>
                <p className="mb-2 font-serif text-sm italic text-sage-600">Static Map Authentication Failed</p>
                <p className="text-[10px] leading-relaxed text-sage-400">
                  `VITE_NAVER_MAP_API_KEY_ID` 또는 서비스 URL 설정을 확인해주세요.
                  <br />
                  Current API Key ID: {NAVER_MAP_API_KEY_ID}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeProject && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-x-4 bottom-4 z-20 rounded-[1.8rem] border border-white bg-white/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dustyGold">Rounding Archive</span>
                      <h3 className="mt-1 font-serif text-xl italic text-sage-600">{activeProject.name}</h3>
                    </div>
                  </div>

                  <div className="mb-4 overflow-hidden rounded-[1.4rem] border border-sage-50">
                    <img src={activeProject.img} className="h-32 w-full object-cover" alt="course" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-champagne-50 pt-3">
                    <div>
                      <span className="flex items-center text-[8px] uppercase text-sage-300">
                        <Ruler size={10} className="mr-1" />
                        Best Score
                      </span>
                      <span className="text-sm font-bold text-sage-600">{activeProject.score}</span>
                    </div>
                    <div>
                      <span className="flex items-center text-[8px] uppercase text-sage-300">
                        <Star size={10} className="mr-1" />
                        Winner
                      </span>
                      <span className="text-sm font-bold text-sage-600">{activeProject.winner}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-sage-50/70 p-3 text-[10px] text-sage-500">
                    <div className="flex items-start space-x-2">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{activeProject.address}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="pointer-events-auto absolute bottom-8 right-8 top-8 z-20 hidden w-80 flex-col rounded-[3rem] border border-white bg-white/95 p-8 shadow-2xl backdrop-blur-xl md:flex"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-dustyGold">Rounding Archive</span>
                      <h3 className="mt-1 font-serif text-2xl italic text-sage-600">{activeProject.name}</h3>
                    </div>
                  </div>

                  <div className="group relative mb-6 h-44 w-full overflow-hidden rounded-[2.5rem] border border-sage-50">
                    <img src={activeProject.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="course" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase text-sage-300">Champion of Round</span>
                      <span className="font-serif text-xl italic text-dustyGold">{activeProject.winner}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-champagne-50 pt-4">
                      <div className="flex flex-col">
                        <span className="flex items-center text-[8px] uppercase text-sage-300">
                          <Ruler size={10} className="mr-1" />
                          Best Score
                        </span>
                        <span className="text-xs font-bold text-sage-600">{activeProject.score}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center text-[8px] uppercase text-sage-300">
                          <Star size={10} className="mr-1" />
                          Record
                        </span>
                        <span className="text-xs font-bold text-sage-500">Official</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center space-x-2 rounded-2xl bg-sage-50/50 p-3 text-sage-300">
                      <MapPin size={12} className="shrink-0" />
                      <span className="text-[9px] leading-tight text-sage-500">{activeProject.address}</span>
                    </div>
                    <a
                      href={`https://map.naver.com/v5/search/${encodeURIComponent(activeProject.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full rounded-2xl bg-[#03C75A] py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all hover:bg-[#02b351] active:scale-95"
                    >
                      Naver Maps Direction
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
