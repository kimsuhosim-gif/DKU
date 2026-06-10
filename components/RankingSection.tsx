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

      <div className="mb-10 grid grid-cols-1 items-stretch gap-4 sm:mb-16 md:grid-cols-3 md:items-end md:gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative order-2 flex min-h-[14rem] overflow-hidden rounded-[1.5rem] border border-sage-100 bg-sage-50 p-4 text-left sm:min-h-[18rem] sm:rounded-[3rem] sm:p-6 md:order-1 md:h-[320px]"
        >
          <img
            src="/images/golf-lifestyle-white-visor.jpg"
            alt="은메달 랭킹 배경"
            className="absolute inset-y-0 right-0 h-full w-[56%] object-cover object-[54%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,248,0.99)_0%,rgba(248,250,248,0.92)_43%,rgba(248,250,248,0.32)_73%,rgba(248,250,248,0.02)_100%)]" />
          <div className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 shadow-sm sm:left-6 sm:top-6 sm:h-10 sm:w-10">
            <Medal size={15} className="text-sage-300" />
          </div>
          <div className="relative z-10 flex h-full max-w-[52%] flex-col justify-center">
            <div className="mb-3 h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg sm:mb-5 sm:h-24 sm:w-24 sm:border-4">
              <img src={podium[1].img} alt={podium[1].name} className="h-full w-full object-cover" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-300">2위</span>
            <h3 className="mt-2 break-keep text-2xl font-bold leading-tight text-sage-600 sm:text-3xl md:text-2xl">{podium[1].name}</h3>
            <div className="mt-3 w-fit rounded-full border border-champagne-100 bg-white/92 px-4 py-1.5 font-mono text-xs font-bold text-sage-500 shadow-sm">
              {podium[1].netScoreDisplay}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative order-1 flex min-h-[16rem] overflow-hidden rounded-[2rem] border border-champagne-100 bg-white p-4 text-left shadow-xl sm:min-h-[22rem] sm:rounded-[4rem] sm:p-7 sm:shadow-2xl md:order-2 md:h-[400px]"
        >
          <img
            src="/images/golf-lifestyle-white-cart.jpg"
            alt="금메달 랭킹 배경"
            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover object-[52%_center]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.92)_41%,rgba(255,255,255,0.26)_72%,rgba(255,255,255,0.02)_100%)]" />
          <div className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-champagne-100/95 shadow-md sm:left-7 sm:top-7 sm:h-12 sm:w-12">
            <Crown size={18} className="fill-amber-500/20 text-amber-500" />
          </div>
          <div className="relative z-10 flex h-full max-w-[52%] flex-col justify-center pt-6 sm:pt-8">
            <div className="mb-3 h-20 w-20 overflow-hidden rounded-full border-2 border-champagne-100 shadow-xl sm:mb-5 sm:h-32 sm:w-32 sm:border-4">
              <img src={podium[0].img} alt={podium[0].name} className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.32em] text-amber-500">1위</span>
            <h3 className="mt-2 break-keep text-4xl font-bold leading-tight text-sage-600 sm:text-5xl md:text-4xl">{podium[0].name}</h3>
            <div className="mt-4 w-fit rounded-full bg-sage-400 px-6 py-2 font-mono text-sm font-bold text-white shadow-lg shadow-sage-400/20">
              {podium[0].netScoreDisplay}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative order-3 flex min-h-[14rem] overflow-hidden rounded-[1.5rem] border border-champagne-100 bg-white p-4 text-left sm:min-h-[17rem] sm:rounded-[3rem] sm:p-6 md:h-[280px]"
        >
          <img
            src="/images/golf-lifestyle-black-fairway.jpg"
            alt="동메달 랭킹 배경"
            className="absolute inset-y-0 right-0 h-full w-[56%] object-cover object-[54%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.9)_42%,rgba(255,255,255,0.3)_73%,rgba(255,255,255,0.02)_100%)]" />
          <div className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-champagne-50/95 shadow-sm sm:left-6 sm:top-6">
            <Medal size={15} className="text-amber-800/35" />
          </div>
          <div className="relative z-10 flex h-full max-w-[52%] flex-col justify-center">
            <div className="mb-3 h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg sm:mb-4 sm:h-20 sm:w-20 sm:border-4">
              <img src={podium[2].img} alt={podium[2].name} className="h-full w-full object-cover" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage-300">3위</span>
            <h3 className="mt-2 break-keep text-2xl font-bold leading-tight text-sage-600 sm:text-3xl md:text-xl">{podium[2].name}</h3>
            <div className="mt-3 w-fit rounded-full bg-champagne-50/95 px-4 py-1.5 font-mono text-xs font-bold text-sage-500 shadow-sm">
              {podium[2].netScoreDisplay}
            </div>
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
