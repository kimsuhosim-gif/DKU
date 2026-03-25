import React from 'react';
import { motion } from 'framer-motion';
import { getProcessRankings, galleryPhotos, members, records } from '../utils/golfData';
import {
  Users,
  Trophy,
  CloudSun,
  ArrowUpRight,
  Clock,
  ArrowRight,
  Map as MapIcon,
  TrendingUp,
  CalendarDays,
  Images,
  Wallet,
  Camera,
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
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const quickActions: { icon: React.ReactNode; label: string; padding: string; view: ViewState }[] = [
    { icon: <Users size={18} />, label: 'Member', padding: 'bg-sage-100', view: 'members' },
    { icon: <Trophy size={18} />, label: 'Records', padding: 'bg-champagne-100', view: 'records' },
    { icon: <MapIcon size={18} />, label: 'Urban Map', padding: 'bg-sage-50', view: 'map' },
  ];

  const rankingData = getProcessRankings().slice(0, 3).map((p, i) => ({
    rank: i + 1,
    name: p.name,
    score: `Net ${p.netScoreDisplay}`,
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid h-auto grid-cols-1 gap-3 md:h-[700px] md:grid-cols-4 md:grid-rows-2 md:gap-4"
    >
      <motion.div
        variants={itemVariants}
        className="bento-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-8 md:col-span-2 md:row-span-1"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl italic text-sage-600">Quick Access</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300">Workspace v0.9</span>
        </div>

        <motion.div
          onClick={() => onNavigate('ledger')}
          whileHover={{ y: -2 }}
          className="group mb-4 flex cursor-pointer items-center justify-between rounded-[1.6rem] bg-sage-400 p-4 text-white shadow-lg shadow-sage-400/10 transition-all hover:bg-sage-500 sm:rounded-[2rem] sm:p-5"
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/20">
              <Wallet size={20} className="text-champagne-50" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Trust Assets Balance</p>
              <p className="font-serif text-xl font-bold italic tracking-tight">₩510,500</p>
              <p className="mt-0.5 text-[8px] font-medium tracking-tight opacity-80">카카오뱅크 3333-16-4428815</p>
            </div>
          </div>
          <div className="hidden flex-col items-end text-right sm:flex">
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Monthly Dues</p>
            <p className="mt-1 text-[10px] font-medium opacity-90">₩20,000 / month</p>
            <div className="mt-2 flex items-center space-x-1 opacity-0 transition-all group-hover:opacity-100">
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
              className={`group/btn flex flex-col items-center justify-center space-y-2 rounded-2xl border border-transparent px-1 py-4 text-[9px] font-medium uppercase tracking-tight text-sage-600 transition-all duration-300 hover:scale-[1.05] hover:border-sage-200/50 active:scale-95 sm:py-5 sm:text-[10px] ${btn.padding}`}
            >
              <span className="rounded-lg bg-white/50 p-2 transition-colors group-hover/btn:bg-white">{btn.icon}</span>
              <span className="whitespace-nowrap">{btn.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group -mt-1 flex cursor-pointer flex-col justify-between rounded-[2rem] border-2 border-transparent bg-white p-5 hover:border-sage-100 md:mt-0 md:col-span-1 md:row-span-1 md:p-8"
        onClick={() => {}}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-400 text-white transition-colors group-hover:bg-sage-500">
            <CalendarDays size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300">Next</span>
        </div>
        <div>
          <h3 className="font-sans text-xl font-bold text-sage-600">추후 공지</h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-sage-400">장소 미정</p>
          <div className="mt-4 flex items-center space-x-1 text-sage-300">
            <Clock size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">시간 미정</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group -mt-1 flex cursor-pointer flex-col justify-between rounded-[2rem] bg-sage-50 p-5 md:mt-0 md:col-span-1 md:row-span-1 md:p-8"
        onClick={() => onNavigate('weather')}
      >
        <WeatherCardContent />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group flex cursor-pointer flex-col justify-between rounded-[2rem] bg-white p-5 md:col-span-2 md:row-span-1 md:p-8"
        onClick={() => onNavigate('ranking')}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-2xl italic text-sage-600">Ranking</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-sage-400">Quarter Leaders</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-sage-400 transition-all group-hover:bg-sage-400 group-hover:text-white">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {rankingData.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-transparent bg-champagne-50/50 p-3 transition-colors hover:border-champagne-200/50 hover:bg-champagne-100"
            >
              <div className="flex items-center space-x-4">
                <span className={`text-[10px] font-bold ${p.rank === 1 ? 'text-amber-500' : 'text-sage-400'}`}>0{p.rank}</span>
                <span className="text-sm font-medium text-sage-600">{p.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs font-mono font-bold text-sage-500">{p.score}</div>
                <ArrowRight size={14} className="translate-x-0 text-sage-200 transition-all group-hover:translate-x-0 group-hover:opacity-100 md:opacity-0 md:-translate-x-2" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="group/archive flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-champagne-100 bg-white md:col-span-2 md:row-span-1"
        onClick={() => onNavigate('gallery')}
      >
        <div className="flex items-center justify-between p-5 pb-4 md:p-8 md:pb-4">
          <h3 className="font-serif text-2xl italic text-sage-600">The Archive</h3>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300">View Portfolio</span>
            <Images size={16} className="text-sage-300 transition-colors group-hover/archive:text-sage-400" />
          </div>
        </div>

        <div className="grid flex-grow grid-cols-3 gap-2 px-5 pb-5 md:gap-3 md:px-8 md:pb-6">
          {galleryPhotos.slice(0, 3).map((photo, i) => (
            <div key={photo.id} className="group/img relative aspect-[3/4] overflow-hidden rounded-2xl border-[0.5px] border-dustyGold/20">
              <img
                src={photo.src}
                alt={photo.location}
                className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover/img:scale-110 group-hover/img:grayscale-0"
              />
              <div className="absolute inset-0 bg-sage-900/10 opacity-0 transition-opacity group-hover/img:opacity-100" />
              <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                <Camera size={10} className="text-white/80" />
                <span className="text-[8px] font-bold uppercase tracking-tighter text-white/80">Entry #{photo.id}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-champagne-100/50 bg-champagne-50/50 px-5 py-4 md:px-8 md:py-5">
          <span className="text-[11px] text-sage-400 opacity-80">"도시를 기록하듯 우리의 계절을 기록합니다"</span>
          <span className="flex items-center text-[9px] font-bold uppercase tracking-[0.2em] text-sage-400 transition-transform group-hover/archive:translate-x-1">
            Explore <ArrowRight size={10} className="ml-2" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WeatherCardContent: React.FC = () => {
  const [weather, setWeather] = React.useState<{ temp: number; desc: string } | null>(null);
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  React.useEffect(() => {
    const fetchWeather = async () => {
      if (!apiKey) return;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${apiKey}&units=metric&lang=kr`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
  }, [apiKey]);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sage-400 shadow-sm transition-colors group-hover:text-amber-500">
          <CloudSun size={24} />
        </div>
        <ArrowUpRight size={18} className="text-sage-200 transition-colors group-hover:text-sage-400" />
      </div>
      <div>
        <h3 className="font-sans text-xl font-bold text-sage-600">
          {weather ? `${weather.temp}° ${weather.desc}` : apiKey ? '로딩 중...' : 'API 미설정'}
        </h3>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-tighter text-sage-400 underline underline-offset-4">Seoul, KR</p>
      </div>
    </>
  );
};

export default BentoGrid;
