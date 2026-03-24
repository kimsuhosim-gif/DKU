import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, MapPinned, Trophy } from 'lucide-react';
import { galleryPhotos, records } from '../utils/golfData';
import { ViewState } from '../App';

interface HomeShowcaseProps {
  onNavigate: (view: ViewState) => void;
}

const HomeShowcase: React.FC<HomeShowcaseProps> = ({ onNavigate }) => {
  const featuredPhoto = galleryPhotos[0];
  const latestRecord = records[0];

  const actions = [
    {
      label: 'Archive gallery',
      description: '사진과 라운드 분위기를 가장 먼저 보는 섹션입니다.',
      icon: Camera,
      view: 'gallery' as ViewState,
    },
    {
      label: 'Ranking board',
      description: '현재 리더보드와 시즌 흐름을 빠르게 확인합니다.',
      icon: Trophy,
      view: 'ranking' as ViewState,
    },
    {
      label: 'Urban map',
      description: '라운드 장소와 기록 지점을 지도에서 이어서 봅니다.',
      icon: MapPinned,
      view: 'map' as ViewState,
    },
  ];

  return (
    <section className="bg-[#f6f0e8] px-4 py-14 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_35px_90px_-50px_rgba(34,48,34,0.35)] backdrop-blur sm:rounded-[2.75rem]"
        >
          <div className="grid gap-4 p-4 sm:gap-6 sm:p-5 md:grid-cols-[1.05fr_0.95fr] md:p-6">
            <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.2rem]">
              <img
                src={featuredPhoto?.src || 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop'}
                alt="Club archive highlight"
                className="h-full min-h-[18rem] w-full object-cover sm:min-h-[24rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
                <p className="text-[9px] uppercase tracking-[0.24em] text-white/60 sm:text-[10px] sm:tracking-[0.3em]">Featured archive</p>
                <h3 className="mt-2 font-serif text-2xl italic leading-tight sm:mt-3 sm:text-3xl">한 장의 사진으로 클럽의 톤을 먼저 보여줍니다.</h3>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[1.5rem] bg-[#273428] p-5 text-white sm:rounded-[2.2rem] sm:p-7">
              <div>
                <p className="text-[9px] uppercase tracking-[0.24em] text-white/55 sm:text-[10px] sm:tracking-[0.28em]">Editorial intro</p>
                <h2 className="mt-3 font-serif text-3xl italic leading-tight sm:mt-4 sm:text-4xl">Archive before dashboard.</h2>
                <p className="mt-4 text-[13px] leading-6 text-white/72 sm:mt-5 sm:text-sm sm:leading-7">
                  첫 화면에서는 기능을 나열하지 않고, 클럽의 무드와 기록의 성격을 먼저 보여줍니다.
                </p>
              </div>

              <div className="mt-6 space-y-5 border-t border-white/10 pt-5 sm:mt-8 sm:space-y-6 sm:pt-6">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 sm:text-[10px] sm:tracking-[0.25em]">Latest record</p>
                  <p className="mt-2 text-xl font-serif italic sm:text-2xl">{latestRecord?.date || '2025.11.29'}</p>
                </div>
                <button
                  onClick={() => onNavigate('records')}
                  className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:text-white sm:text-sm sm:tracking-[0.2em]"
                >
                  Open round records
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="grid gap-3 sm:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.75, delay: index * 0.08, ease: 'easeOut' }}
                onClick={() => onNavigate(action.view)}
                className="group rounded-[1.75rem] border border-[#d9d0c4] bg-[#fbf8f2] p-5 text-left transition hover:-translate-y-1 hover:border-[#9cad92] hover:shadow-[0_25px_70px_-45px_rgba(34,48,34,0.5)] sm:rounded-[2.25rem] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-slate-400 sm:text-[10px] sm:tracking-[0.28em]">Direct access</p>
                    <h3 className="mt-3 font-serif text-2xl italic text-[#2a362b] sm:mt-4 sm:text-3xl">{action.label}</h3>
                    <p className="mt-3 max-w-sm text-[13px] leading-6 text-slate-500 sm:mt-4 sm:text-sm sm:leading-7">{action.description}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ebf1e6] text-[#455544] transition group-hover:bg-[#2d382d] group-hover:text-white">
                    <Icon size={20} />
                  </span>
                </div>
                <div className="mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#455544] sm:mt-10 sm:text-[11px] sm:tracking-[0.22em]">
                  Explore section
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeShowcase;
