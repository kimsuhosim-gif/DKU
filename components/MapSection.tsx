import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Ruler, Info, ExternalLink } from 'lucide-react';
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
const MAP_ID = "map"; // Documentation uses 'map'

const MapSection: React.FC<MapSectionProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Expose error state for authFailure
  useEffect(() => {
    (window as any).setNaverMapError = () => setMapStatus('error');
    return () => { (window as any).setNaverMapError = null; };
  }, []);

  const projects: MapProject[] = useMemo(() => {
    return records.map((r, idx) => {
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
        score: r.score
      };
    }).filter(p => p !== null) as MapProject[];
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;

    const initMap = () => {
      // 1. Check if naver global is available (Per screenshot: var map = new naver.maps.Map(...))
      if (!window.naver || !window.naver.maps) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initMap, 200);
        } else {
          setMapStatus('error');
        }
        return;
      }

      // 2. Clear existing map instance if any
      if (naverMapRef.current) return;

      try {
        const mapContainer = document.getElementById(MAP_ID);
        if (!mapContainer) return;

        const mapOptions = {
          center: new window.naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          zoom: 11,
          minZoom: 7,
          maxWidth: '100%',
          maxHeight: '100%',
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT
          }
        };

        const map = new window.naver.maps.Map(mapContainer, mapOptions);
        naverMapRef.current = map;

        // 3. Add markers
        projects.forEach((p) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(p.location.lat, p.location.lng),
            map: map,
            title: p.name,
            animation: window.naver.maps.Animation.DROP
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
        console.error("Naver Map Init Error:", err);
        setMapStatus('error');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 500);
    return () => clearTimeout(timer);
  }, [projects]);

  // Sync selected project with map view
  useEffect(() => {
    if (selectedProject && naverMapRef.current) {
      const latlng = new window.naver.maps.LatLng(selectedProject.location.lat, selectedProject.location.lng);
      naverMapRef.current.panTo(latlng);
      if (naverMapRef.current.getZoom() < 14) naverMapRef.current.setZoom(14);
    }
  }, [selectedProject]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Course List */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="mb-12">
            <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Project Portfolio</span>
            <h2 className="text-5xl font-serif mt-4 text-sage-600 italic">Urban Rounding Map</h2>
            <p className="text-sage-400 mt-4 text-sm leading-relaxed max-w-sm italic">
              "전공을 살려 우리가 정복한 그린 위의 대지들을 기록합니다. 09학번이 그려나가는 전국 골프장 마스터플랜."
            </p>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
            {projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedProject(p)}
                className={`w-full text-left p-6 rounded-3xl border transition-all duration-500 group ${selectedProject?.id === p.id
                  ? 'bg-sage-400 border-sage-400 text-white shadow-lg scale-[1.02]'
                  : 'bg-white border-champagne-100 text-sage-600 hover:border-sage-200'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${selectedProject?.id === p.id ? 'text-white/60' : 'text-sage-300'}`}>
                    No.{p.id}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{p.date}</span>
                </div>
                <h4 className="text-lg font-serif mt-2 italic">{p.name}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actual Map View */}
        <div className="lg:col-span-8 bg-sage-50 rounded-[4rem] relative overflow-hidden border border-sage-100 min-h-[600px] shadow-inner z-0">
          {/* THE MAP DIV */}
          <div id={MAP_ID} className="w-full h-full" style={{ borderRadius: '4rem' }} />

          {/* Overlay States */}
          <AnimatePresence>
            {mapStatus !== 'ready' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-sage-50/80 backdrop-blur-md z-10"
              >
                {mapStatus === 'loading' ? (
                  <>
                    <div className="w-10 h-10 border-2 border-sage-200 border-t-sage-400 rounded-full animate-spin mb-4"></div>
                    <span className="text-[10px] uppercase tracking-widest text-sage-400 font-bold">Synchronizing Map Data...</span>
                  </>
                ) : (
                  <div className="px-12 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
                      <ExternalLink size={20} />
                    </div>
                    <p className="text-sm text-sage-600 font-serif italic mb-2">Map Authentication Failed</p>
                    <p className="text-[10px] text-sage-400 leading-relaxed">네이버 콘솔 설정(URL 등록) 혹은 Client ID를 다시 확인해주세요.<br />현재 등록된 Client ID: 02j9jku1mt</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Course Info (Mobile Hidden for Clarity) */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div initial={{ opacity: 0, scale: 0.9, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="absolute top-8 right-8 bottom-8 w-80 bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white z-20 p-8 flex flex-col pointer-events-auto hidden md:flex"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-dustyGold font-bold">Rounding Archive</span>
                    <h3 className="text-2xl font-serif text-sage-600 italic mt-1">{selectedProject.name}</h3>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 text-sage-200 hover:text-sage-400 transition-colors">
                    <ArrowLeft size={16} className="rotate-180" />
                  </button>
                </div>

                <div className="w-full h-44 rounded-[2.5rem] overflow-hidden mb-6 relative group border border-sage-50">
                  <img src={selectedProject.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="course" />
                  <div className="absolute inset-0 bg-black/10 transition-opacity" />
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-tighter text-sage-300 font-bold">Champion of Round</span>
                    <span className="text-xl font-serif text-dustyGold italic">{selectedProject.winner}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-champagne-50">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-sage-300 flex items-center uppercase"><Ruler size={10} className="mr-1" /> Best Score</span>
                      <span className="text-xs font-bold text-sage-600">{selectedProject.score}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-sage-300 flex items-center uppercase"><Star size={10} className="mr-1" /> Record</span>
                      <span className="text-xs font-bold text-sage-500">Official</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 text-sage-200 bg-sage-50/50 p-3 rounded-2xl">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-[9px] font-mono leading-tight">{selectedProject.address}</span>
                  </div>
                  <a href={`https://map.naver.com/v5/search/${encodeURIComponent(selectedProject.name)}`} target="_blank" rel="noreferrer"
                    className="w-full py-4 bg-[#03C75A] text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold text-center hover:bg-[#02b351] transition-all shadow-md active:scale-95"
                  >Naver Maps Direction</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Side Annotation */}
          <div className="absolute bottom-8 left-8 text-[9px] uppercase tracking-[0.5em] text-sage-200 font-bold rotate-[-90deg] origin-left pointer-events-none opacity-40">
            Dankook Urban Plan 09
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
