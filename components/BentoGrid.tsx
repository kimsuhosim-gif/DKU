
import React from 'react';
import { motion } from 'framer-motion';
import { getProcessRankings, galleryPhotos } from '../utils/golfData';
import {
  Users,
  Trophy,
  CreditCard,
  CloudSun,
  ArrowUpRight,
  MapPin,
  Clock,
  ArrowRight,
  Map as MapIcon,
  TrendingUp,
  CalendarDays,
  Images,
  Wallet,
  Camera
} from 'lucide-react';
import { ViewState } from '../App';

interface BentoGridProps {
  onNavigate: (view: ViewState) => void;
}

const BentoGrid: React.FC<BentoGridProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const quickActions: { icon: React.ReactNode; label: string; padding: string; view: ViewState }[] = [
    { icon: <Users size={18} />, label: "Member", padding: "bg-sage-100", view: "members" },
    { icon: <Trophy size={18} />, label: "Records", padding: "bg-champagne-100", view: "records" },
    { icon: <MapIcon size={18} />, label: "Urban Map", padding: "bg-sage-50", view: "map" },
  ];

  const rankingData = getProcessRankings().slice(0, 3).map((p, i) => ({
    rank: i + 1,
    name: p.name,
    score: `Net ${p.netScoreDisplay}`
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 h-auto md:h-[700px]"
    >
      {/* 1. Quick Menu (2x1) - Now including the Assets Dashboard */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 bento-card rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative group/card"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-serif text-sage-600 italic">Quick Access</h3>
          <span className="text-[10px] text-sage-300 uppercase tracking-widest font-bold">Workspace v0.9</span>
        </div>

        {/* Integrated Assets Dashboard Bar */}
        <motion.div
          onClick={() => onNavigate('ledger')}
          whileHover={{ y: -2 }}
          className="bg-sage-400 text-white p-5 rounded-[2rem] flex items-center justify-between mb-6 cursor-pointer hover:bg-sage-500 transition-all shadow-lg shadow-sage-400/10 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
              <Wallet size={20} className="text-champagne-50" />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Trust Assets Balance</p>
              <p className="text-xl font-serif font-bold italic tracking-tight">₩510,500</p>
              <p className="text-[8px] opacity-80 font-medium mt-0.5 tracking-tight">카카오뱅크 3333-16-4428815</p>
            </div>
          </div>
          <div className="text-right hidden sm:flex flex-col items-end">
            <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Monthly Dues</p>
            <p className="text-[10px] font-medium opacity-90 mt-1">₩20,000 / month</p>
            <div className="flex items-center mt-2 space-x-1 opacity-0 group-hover:opacity-100 transition-all">
              <span className="text-[8px] uppercase tracking-widest">Details</span>
              <ArrowRight size={10} />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {quickActions.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(btn.view)}
              className={`flex flex-col items-center justify-center space-y-2 py-5 px-1 rounded-2xl ${btn.padding} text-sage-600 hover:scale-[1.05] active:scale-95 transition-all duration-300 font-medium text-[9px] sm:text-[10px] uppercase tracking-tighter border border-transparent hover:border-sage-200/50 group/btn`}
            >
              <span className="p-2 bg-white/50 rounded-lg group-hover/btn:bg-white transition-colors">{btn.icon}</span>
              <span className="whitespace-nowrap">{btn.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 2. Next Project (Small 1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 bento-card rounded-[2.5rem] p-8 flex flex-col justify-between bg-white border-2 border-transparent hover:border-sage-100 cursor-pointer group -mt-1 md:mt-0"
        onClick={() => { }}
      >
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-sage-400 rounded-xl flex items-center justify-center text-white group-hover:bg-sage-500 transition-colors">
            <CalendarDays size={24} />
          </div>
          <span className="text-[10px] font-bold text-sage-300 uppercase tracking-widest">Next</span>
        </div>
        <div>
          <h3 className="text-xl font-sans font-bold text-sage-600">추후 공지</h3>
          <p className="text-[10px] text-sage-400 mt-1 uppercase tracking-tighter font-bold">장소 미정</p>
          <div className="mt-4 flex items-center space-x-1 text-sage-300">
            <Clock size={12} />
            <span className="text-[10px] uppercase tracking-widest font-bold">시간 미정</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Weather (Small 1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 bento-card rounded-[2.5rem] p-8 flex flex-col justify-between bg-sage-50 cursor-pointer group -mt-1 md:mt-0"
        onClick={() => onNavigate('weather')}
      >
        <WeatherCardContent />
      </motion.div>

      {/* 4. Ranking Preview (Large 2x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 bento-card rounded-[2.5rem] p-8 bg-white flex flex-col justify-between cursor-pointer group"
        onClick={() => onNavigate('ranking')}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-serif text-sage-600 italic">Ranking</h3>
            <p className="text-xs text-sage-400 uppercase tracking-[0.2em] mt-1 font-bold">Quarter Leaders</p>
          </div>
          <div className="w-10 h-10 bg-sage-50 rounded-full flex items-center justify-center text-sage-400 group-hover:bg-sage-400 group-hover:text-white transition-all">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {rankingData.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-champagne-50/50 hover:bg-champagne-100 transition-colors border border-transparent hover:border-champagne-200/50">
              <div className="flex items-center space-x-4">
                <span className={`text-[10px] font-bold ${p.rank === 1 ? 'text-amber-500' : 'text-sage-400'}`}>0{p.rank}</span>
                <span className="text-sm font-medium text-sage-600">{p.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs font-mono text-sage-500 font-bold">{p.score}</div>
                <ArrowRight size={14} className="text-sage-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Archive Gallery Preview (Large 2x1) - REFINED */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 bento-card rounded-[2.5rem] p-0 flex flex-col overflow-hidden bg-white border border-champagne-100 cursor-pointer group/archive"
        onClick={() => onNavigate('gallery')}
      >
        <div className="p-8 pb-4 flex justify-between items-center">
          <h3 className="text-2xl font-serif text-sage-600 italic">The Archive</h3>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-sage-300 uppercase tracking-widest font-bold">View Portfolio</span>
            <Images size={16} className="text-sage-300 group-hover/archive:text-sage-400 transition-colors" />
          </div>
        </div>

        <div className="flex-grow grid grid-cols-3 gap-3 px-8 pb-6">
          {galleryPhotos.slice(0, 3).map((photo, i) => (
            <div key={photo.id} className="aspect-[3/4] rounded-2xl overflow-hidden border-[0.5px] border-dustyGold/20 relative group/img">
              <img
                src={photo.src}
                alt={photo.location}
                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover/img:scale-110 group-hover/img:grayscale-0"
              />
              <div className="absolute inset-0 bg-sage-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
              {/* Minimal label overlay */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                <Camera size={10} className="text-white/80" />
                <span className="text-[8px] text-white/80 uppercase tracking-tighter font-bold">Entry #{photo.id}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 py-5 bg-champagne-50/50 flex justify-between items-center border-t border-champagne-100/50">
          <span className="text-[11px] font-script text-sage-400 opacity-80">"도시를 기록하듯 우리의 계절을 기록합니다"</span>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-sage-400 flex items-center group-hover/archive:translate-x-1 transition-transform">
            Explore <ArrowRight size={10} className="ml-2" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WeatherCardContent: React.FC = () => {
  const [weather, setWeather] = React.useState<{ temp: number; desc: string } | null>(null);
  const API_KEY = "159b185ea21f75acd5303c2ad0c8f547";

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
  }, []);

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sage-400 group-hover:text-amber-500 transition-colors shadow-sm">
          <CloudSun size={24} />
        </div>
        <ArrowUpRight size={18} className="text-sage-200 group-hover:text-sage-400 transition-colors" />
      </div>
      <div>
        <h3 className="text-xl font-sans font-bold text-sage-600">
          {weather ? `${weather.temp}° ${weather.desc}` : weather === null ? '로딩 중...' : '연결 중...'}
        </h3>
        <p className="text-[10px] text-sage-400 mt-1 uppercase tracking-tighter font-medium underline underline-offset-4">Seoul, KR</p>
      </div>
    </>
  );
};

export default BentoGrid;
