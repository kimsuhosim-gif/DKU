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

const defaultCenter = {
  lat: 37.227445,
  lng: 127.618625
};

const MapSection: React.FC<MapSectionProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<MapProject | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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
    const initMap = () => {
      if (!mapRef.current || !window.naver || !window.naver.maps) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(defaultCenter.lat, defaultCenter.lng),
        zoom: 11,
        minZoom: 8,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.BUTTON,
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      naverMapRef.current = map;

      // Add markers
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

      setIsLoaded(true);
    };

    // Check if script is loaded, if not wait a bit or use callback
    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const timer = setInterval(() => {
        if (window.naver && window.naver.maps) {
          initMap();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, [projects]);

  // Handle fly-to when list item is clicked
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
        {/* Left: Map Header & List */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="mb-12">
            <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Project Portfolio</span>
            <h2 className="text-5xl font-serif mt-4 text-sage-600 italic">Urban Rounding Map</h2>
            <p className="text-sage-400 mt-4 text-sm leading-relaxed max-w-sm italic">
              "전공을 살려 우리가 정복한 그린 위의 대지들을 기록합니다. 09학번이 그려나가는 전국 골프장 마스터플랜."
            </p>
          </div>

          <div className="space-y-4 flex-grow">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`w-full text-left p-6 rounded-3xl border transition-all duration-500 group ${selectedProject?.id === p.id
                  ? 'bg-sage-400 border-sage-400 text-white shadow-lg scale-[1.02]'
                  : 'bg-white border-champagne-100 text-sage-600 hover:border-sage-200'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${selectedProject?.id === p.id ? 'text-white/60' : 'text-sage-300'}`}>
                    Project No.{p.id}
                  </span>
                  <span className="text-[10px]">{p.date}</span>
                </div>
                <h4 className="text-lg font-serif mt-2 italic">{p.name}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Map Container */}
        <div className="lg:col-span-8 bg-sage-50 rounded-[4rem] relative overflow-hidden border border-sage-100 min-h-[600px] shadow-inner z-0">
          <div ref={mapRef} className="w-full h-full" style={{ borderRadius: '4rem' }} />

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-sage-50/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4 px-12 text-center">
                <div className="w-8 h-8 border-2 border-sage-200 border-t-sage-400 rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-widest text-sage-400 font-bold">Loading Master Map...</span>
                <p className="text-[9px] text-sage-300 mt-2 leading-relaxed">지도가 나타나지 않는다면 네이버 콘솔에서 '서비스 URL'에<br />현재 주소가 등록되어 있는지 확인해주세요.</p>
              </div>
            </div>
          )}

          {/* Floating Info Card */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute top-8 right-8 bottom-8 w-80 bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white z-30 p-8 flex flex-col pointer-events-auto hidden md:flex"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-sage-400 font-bold">Brief No.{selectedProject.id}</span>
                    <h3 className="text-2xl font-serif text-sage-600 italic mt-1">{selectedProject.name}</h3>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 text-sage-300 hover:text-sage-600 transition-colors">
                    <ArrowLeft size={20} className="rotate-180" />
                  </button>
                </div>

                <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-6 relative group">
                  <img src={selectedProject.img} alt={selectedProject.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MapPin className="text-white" size={24} />
                  </div>
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <p className="text-[10px] uppercase text-sage-300 font-bold tracking-tighter">Winner</p>
                    <p className="text-lg font-serif text-amber-500 italic">
                      {selectedProject.winner}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-champagne-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-sage-300 flex items-center space-x-1 uppercase"><Ruler size={10} className="mr-1" /> Best Score</span>
                      <span className="text-xs font-semibold text-sage-600">{selectedProject.score}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-sage-300 flex items-center space-x-1 uppercase"><Star size={10} className="mr-1" /> Status</span>
                      <span className="text-xs font-semibold text-sage-600">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-champagne-50 flex items-center space-x-3">
                  <Info size={14} className="text-sage-200" />
                  <span className="text-[10px] font-mono text-sage-300 truncate">{selectedProject.address}</span>
                </div>

                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(selectedProject.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full py-3 bg-[#03C75A] text-white rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 hover:bg-[#02b351] transition-colors"
                >
                  <span>Naver Map 바로가기</span>
                  <ExternalLink size={12} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.4em] text-sage-300 font-bold rotate-[-90deg] origin-left pointer-events-none">
            Urban Planning Master Map
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
