import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Ruler, ExternalLink } from 'lucide-react';
import { records, COURSE_LOCATIONS } from '../utils/golfData';

declare global {
  interface Window {
    naver: any;
  }
}

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

const DEFAULT_CENTER = { lat: 37.227445, lng: 127.618625 };
const MAP_ID = 'map';
const FALLBACK_NAVER_MAP_CLIENT_ID = '02j9jku1mt';
const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || FALLBACK_NAVER_MAP_CLIENT_ID;

const MapSection: React.FC<MapSectionProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    (window as any).setNaverMapError = () => setMapStatus('error');
    return () => {
      (window as any).setNaverMapError = null;
    };
  }, []);

  useEffect(() => {
    if (window.naver?.maps) {
      setMapStatus('loading');
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-naver-map-sdk="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapStatus('loading'));
      existingScript.addEventListener('error', () => setMapStatus('error'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.defer = true;
    script.dataset.naverMapSdk = 'true';
    script.onload = () => setMapStatus('loading');
    script.onerror = () => setMapStatus('error');
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

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

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;

    const initMap = () => {
      if (!window.naver || !window.naver.maps) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initMap, 200);
        } else {
          setMapStatus('error');
        }
        return;
      }

      if (naverMapRef.current) return;

      try {
        const mapContainer = document.getElementById(MAP_ID);
        if (!mapContainer) return;

        const map = new window.naver.maps.Map(mapContainer, {
          center: new window.naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          zoom: 11,
          minZoom: 7,
          maxWidth: '100%',
          maxHeight: '100%',
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        });

        naverMapRef.current = map;

        projects.forEach((p) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(p.location.lat, p.location.lng),
            map,
            title: p.name,
            animation: window.naver.maps.Animation.DROP,
          });

          window.naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedProject(p);
            map.panTo(new window.naver.maps.LatLng(p.location.lat, p.location.lng));
            if (map.getZoom() < 14) map.setZoom(14);
          });

          markersRef.current.push(marker);
        });

        setMapStatus('ready');
      } catch (err) {
        console.error('Naver Map Init Error:', err);
        setMapStatus('error');
      }
    };

    const timer = setTimeout(initMap, 500);
    return () => clearTimeout(timer);
  }, [projects]);

  useEffect(() => {
    if (selectedProject && naverMapRef.current) {
      const latlng = new window.naver.maps.LatLng(selectedProject.location.lat, selectedProject.location.lng);
      naverMapRef.current.panTo(latlng);
      if (naverMapRef.current.getZoom() < 14) naverMapRef.current.setZoom(14);
    }
  }, [selectedProject]);

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
              The club&apos;s rounds, organized geographically instead of chronologically.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[560px] lg:flex-col lg:overflow-y-auto lg:pr-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`min-w-[210px] rounded-[1.6rem] border p-4 text-left transition-all duration-500 lg:min-w-0 lg:p-6 ${
                  selectedProject?.id === p.id
                    ? 'scale-[1.01] border-sage-400 bg-sage-400 text-white shadow-lg'
                    : 'border-champagne-100 bg-white text-sage-600 hover:border-sage-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${selectedProject?.id === p.id ? 'text-white/70' : 'text-sage-300'}`}>
                    No.{p.id}
                  </span>
                  <span className="font-mono text-[10px] opacity-60">{p.date}</span>
                </div>
                <h4 className="mt-2 font-serif text-lg italic">{p.name}</h4>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-sage-100 bg-sage-50 shadow-inner sm:min-h-[560px] sm:rounded-[4rem] lg:col-span-8">
          <div id={MAP_ID} className="h-full w-full" style={{ borderRadius: '4rem' }} />

          <AnimatePresence>
            {mapStatus !== 'ready' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-sage-50/80 px-8 text-center backdrop-blur-md"
              >
                {mapStatus === 'loading' ? (
                  <>
                    <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sage-200 border-t-sage-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-400">
                      Synchronizing Map Data
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                      <ExternalLink size={20} />
                    </div>
                    <p className="mb-2 font-serif text-sm italic text-sage-600">Map Authentication Failed</p>
                    <p className="text-[10px] leading-relaxed text-sage-400">
                      Check the Naver Cloud service URL and client ID.
                      <br />
                      Current client ID: {NAVER_MAP_CLIENT_ID}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedProject && (
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
                      <h3 className="mt-1 font-serif text-xl italic text-sage-600">{selectedProject.name}</h3>
                    </div>
                    <button onClick={() => setSelectedProject(null)} className="p-2 text-sage-300 transition-colors hover:text-sage-500">
                      <ArrowLeft size={16} className="rotate-180" />
                    </button>
                  </div>

                  <div className="mb-4 overflow-hidden rounded-[1.4rem] border border-sage-50">
                    <img src={selectedProject.img} className="h-32 w-full object-cover" alt="course" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-champagne-50 pt-3">
                    <div>
                      <span className="flex items-center text-[8px] uppercase text-sage-300">
                        <Ruler size={10} className="mr-1" />
                        Best Score
                      </span>
                      <span className="text-sm font-bold text-sage-600">{selectedProject.score}</span>
                    </div>
                    <div>
                      <span className="flex items-center text-[8px] uppercase text-sage-300">
                        <Star size={10} className="mr-1" />
                        Winner
                      </span>
                      <span className="text-sm font-bold text-sage-600">{selectedProject.winner}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-sage-50/70 p-3 text-[10px] text-sage-500">
                    <div className="flex items-start space-x-2">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{selectedProject.address}</span>
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
                      <h3 className="mt-1 font-serif text-2xl italic text-sage-600">{selectedProject.name}</h3>
                    </div>
                    <button onClick={() => setSelectedProject(null)} className="p-2 text-sage-200 transition-colors hover:text-sage-400">
                      <ArrowLeft size={16} className="rotate-180" />
                    </button>
                  </div>

                  <div className="group relative mb-6 h-44 w-full overflow-hidden rounded-[2.5rem] border border-sage-50">
                    <img src={selectedProject.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="course" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase text-sage-300">Champion of Round</span>
                      <span className="font-serif text-xl italic text-dustyGold">{selectedProject.winner}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-champagne-50 pt-4">
                      <div className="flex flex-col">
                        <span className="flex items-center text-[8px] uppercase text-sage-300">
                          <Ruler size={10} className="mr-1" />
                          Best Score
                        </span>
                        <span className="text-xs font-bold text-sage-600">{selectedProject.score}</span>
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
                      <span className="text-[9px] leading-tight text-sage-500">{selectedProject.address}</span>
                    </div>
                    <a
                      href={`https://map.naver.com/v5/search/${encodeURIComponent(selectedProject.name)}`}
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
