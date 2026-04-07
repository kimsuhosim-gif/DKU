import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, Minus, Crown, Medal, TrendingUp } from 'lucide-react';
import { getProcessRankings } from '../utils/golfData';

interface RankingSectionProps {
  onBack: () => void;
}

const RankingSection: React.FC<RankingSectionProps> = ({ onBack }) => {
  const processedData = useMemo(() => getProcessRankings(), []);
  const podium = processedData.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">WHS 적용 순위</span>
          <h2 className="mt-3 text-3xl font-bold text-sage-600 sm:text-5xl">DKU-RE09 랭킹</h2>
        </div>
      </div>

      <div className="mb-10 rounded-[2rem] border border-champagne-100 bg-sage-50/60 p-5 sm:mb-16 sm:p-6">
        <p className="text-sm leading-7 text-sage-500">
          이 순위는 <span className="font-semibold text-sage-600">핸디캡을 반영한 순위</span>입니다.
          <br />
          <span className="font-semibold text-sage-600">Net (Gross - HC)</span>는 실제 타수(Gross)에서 현재 핸디캡(HC)을 뺀 값입니다.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-3 items-end gap-2 sm:mb-16 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative order-1 flex h-[150px] flex-col items-center justify-center rounded-[1.5rem] border border-sage-100 bg-sage-50 p-3 text-center sm:h-[320px] sm:rounded-[3rem] sm:p-8"
        >
          <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm sm:left-6 sm:top-6 sm:h-10 sm:w-10">
            <Medal size={12} className="text-sage-200" />
          </div>
          <div className="mb-2 h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-lg sm:mb-6 sm:h-24 sm:w-24 sm:border-4">
            <img src={podium[1].img} alt={podium[1].name} className="h-full w-full object-cover" />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-sage-300 sm:text-[10px] sm:tracking-[0.3em]">2위</span>
          <h3 className="mt-1 text-xs font-bold text-sage-600 sm:mt-2 sm:text-2xl">{podium[1].name}</h3>
          <div className="mt-2 rounded-full border border-champagne-100 bg-white px-2 py-1 font-mono text-[9px] text-sage-400 sm:mt-4 sm:px-4 sm:text-xs">
            {podium[1].netScoreDisplay}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative order-2 flex h-[190px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-champagne-100 bg-white p-3 text-center shadow-xl sm:h-[400px] sm:rounded-[4rem] sm:p-10 sm:shadow-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-champagne-100/20 to-transparent" />
          <div className="absolute top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-champagne-100 shadow-md sm:top-8 sm:h-12 sm:w-12">
            <Crown size={14} className="fill-amber-500/20 text-amber-500" />
          </div>
          <div className="relative z-10 mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-champagne-100 shadow-xl sm:mb-6 sm:h-32 sm:w-32 sm:border-4">
            <img src={podium[0].img} alt={podium[0].name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <span className="relative z-10 text-[8px] font-bold uppercase tracking-[0.2em] text-amber-500 sm:text-xs sm:tracking-[0.5em]">1위</span>
          <h3 className="relative z-10 mt-1 text-lg font-bold text-sage-600 sm:mt-3 sm:text-4xl">{podium[0].name}</h3>
          <div className="relative z-10 mt-2 rounded-full bg-sage-400 px-3 py-1 font-mono text-[10px] text-white shadow-lg shadow-sage-400/20 sm:mt-6 sm:px-8 sm:py-2 sm:text-sm">
            {podium[0].netScoreDisplay}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative order-3 flex h-[140px] flex-col items-center justify-center rounded-[1.5rem] border border-champagne-100 bg-white p-3 text-center sm:h-[280px] sm:rounded-[3rem] sm:p-8"
        >
          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-champagne-50 sm:right-6 sm:top-6 sm:h-8 sm:w-8">
            <Medal size={10} className="text-amber-800/30" />
          </div>
          <div className="mb-2 h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-lg sm:mb-4 sm:h-20 sm:w-20 sm:border-4">
            <img src={podium[2].img} alt={podium[2].name} className="h-full w-full object-cover" />
          </div>
          <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-sage-300 sm:text-[10px] sm:tracking-[0.2em]">3위</span>
          <h3 className="mt-1 text-xs font-bold text-sage-600 sm:mt-2 sm:text-xl">{podium[2].name}</h3>
          <div className="mt-2 rounded-full bg-champagne-50 px-2 py-1 font-mono text-[9px] text-sage-400 sm:px-4 sm:text-xs">
            {podium[2].netScoreDisplay}
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.2em] text-sage-300 sm:px-10 sm:py-4 md:text-[10px]">
          <div className="col-span-2 md:col-span-1">순위</div>
          <div className="col-span-6 md:col-span-3">멤버</div>
          <div className="col-span-4 text-right md:col-span-2">Net (Gross - HC)</div>
          <div className="hidden text-center md:block md:col-span-2">Gross</div>
          <div className="hidden text-center md:block md:col-span-2">Handicap</div>
          <div className="hidden text-right md:block md:col-span-2 md:pr-4">변동</div>
        </div>

        <AnimatePresence mode="popLayout">
          {processedData.map((member, idx) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-12 items-center rounded-[1.6rem] border border-champagne-100 bg-white px-4 py-4 transition-all hover:shadow-md sm:rounded-[2rem] sm:px-6 md:px-10 md:py-6"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="text-sm font-bold text-sage-400">#{idx + 1}</span>
              </div>

              <div className="col-span-6 flex items-center space-x-3 md:col-span-3 md:space-x-4">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-champagne-100 bg-white shadow-sm md:h-10 md:w-10">
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-bold text-sage-600">{member.name}</span>
                  <span className="text-[7px] uppercase tracking-[0.2em] text-sage-300 md:text-[8px]">WHS 적용</span>
                </div>
              </div>

              <div className="col-span-4 text-right md:col-span-2">
                <div
                  className={`inline-block rounded-xl border px-3 py-1.5 md:px-4 ${
                    member.netScoreDisplay === '-' ? 'border-sage-100 bg-sage-50' : 'border-sage-700 bg-sage-600 shadow-sm'
                  }`}
                >
                  <span className={`font-mono text-xs font-bold md:text-sm ${member.netScoreDisplay === '-' ? 'text-sage-300' : 'text-white'}`}>
                    {member.netScoreDisplay}
                  </span>
                </div>
              </div>

              <div className="hidden text-center font-mono text-xs text-sage-400 md:block md:col-span-2">
                {member.latestScore}
                {member.latestAdjusted !== '-' && member.latestAdjusted !== member.latestScore && (
                  <span className="ml-1 text-sage-300">({member.latestAdjusted})</span>
                )}
              </div>
              <div className="hidden text-center font-mono text-xs text-sage-400 md:block md:col-span-2">
                {member.handicap.toFixed(1)}
              </div>
              <div className="hidden text-right md:block md:col-span-2 md:pr-4">
                {member.improved ? (
                  <div className="flex items-center justify-end space-x-1 font-bold text-green-500">
                    <ArrowUp size={14} className="animate-bounce" />
                    <span className="text-[10px] uppercase tracking-[0.16em]">상승</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end space-x-1 text-sage-200">
                    <Minus size={12} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center sm:mt-16">
        <div className="mb-4 flex items-center justify-center space-x-4">
          <div className="h-px w-12 bg-champagne-100" />
          <TrendingUp size={20} className="text-sage-300" />
          <div className="h-px w-12 bg-champagne-100" />
        </div>
        <p className="mx-auto max-w-2xl text-[10px] font-medium uppercase tracking-[0.16em] text-sage-400 sm:tracking-[0.2em]">
          최신 라운드 기준 WHS 미리보기입니다. 홀별 데이터가 있으면 Adjusted Gross가 적용됩니다.
          Net (Gross - HC)는 실제 타수에서 현재 핸디캡을 뺀 값입니다.
        </p>
      </div>
    </div>
  );
};

export default RankingSection;
