import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, ArrowDown, Minus, Crown, Medal, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { getProcessRankings } from '../utils/golfData';

interface RankingSectionProps {
  onBack: () => void;
}


const RankingSection: React.FC<RankingSectionProps> = ({ onBack }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const processedData = useMemo(() => getProcessRankings(), []);

  const podium = processedData.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">OFFICIAL WHS APPLIED</span>
          <h2 className="text-5xl font-sans font-bold mt-4 text-sage-600">DKU-RE09 Ranking</h2>
        </div>
      </div>

      {/* Podium Display */}
      <div className="grid grid-cols-3 gap-2 sm:gap-8 mb-12 sm:mb-16 items-end">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-1 h-[140px] sm:h-[320px] rounded-2xl sm:rounded-[3rem] bg-sage-50 border border-sage-100 p-2 sm:p-8 flex flex-col items-center justify-center text-center relative group"
        >
          <div className="absolute top-2 left-2 sm:top-6 sm:left-6 w-5 h-5 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Medal size={10} className="text-sage-200 sm:size-20" />
          </div>
          <div className="w-10 h-10 sm:w-24 sm:h-24 rounded-full border-2 sm:border-4 border-white overflow-hidden shadow-lg mb-2 sm:mb-6">
            <img src={podium[1].img} alt={podium[1].name} className="w-full h-full object-cover transition-all duration-700" />
          </div>
          <span className="text-[6px] sm:text-[10px] uppercase font-bold text-sage-300 tracking-wider sm:tracking-[0.3em]">Runner Up</span>
          <h3 className="text-sm sm:text-2xl font-sans font-bold text-sage-600 mt-0.5 sm:mt-2">{podium[1].name}</h3>
          <div className="mt-1 sm:mt-4 px-2 sm:px-4 py-0.5 sm:py-1 bg-white rounded-full text-[8px] sm:text-xs font-mono text-sage-400 border border-champagne-100">
            {podium[1].netScoreDisplay}
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-2 h-[180px] sm:h-[400px] rounded-3xl sm:rounded-[4rem] bg-white shadow-xl sm:shadow-2xl border border-champagne-100 p-3 sm:p-10 flex flex-col items-center justify-center text-center relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-champagne-100/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-2 sm:top-8 w-6 h-6 sm:w-12 sm:h-12 bg-champagne-100 rounded-full flex items-center justify-center shadow-md z-10">
            <Crown size={12} className="text-amber-500 fill-amber-500/20 sm:size-24" />
          </div>
          <div className="w-14 h-14 sm:w-32 sm:h-32 rounded-full border-2 sm:border-4 border-champagne-100 overflow-hidden shadow-xl mb-2 sm:mb-6 relative z-10">
            <img src={podium[0].img} alt={podium[0].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <span className="text-[7px] sm:text-xs uppercase font-bold text-amber-500 tracking-widest sm:tracking-[0.5em] relative z-10">Champion</span>
          <h3 className="text-lg sm:text-4xl font-sans font-bold text-sage-600 mt-0.5 sm:mt-3 relative z-10">{podium[0].name}</h3>
          <div className="mt-2 sm:mt-6 px-3 sm:px-8 py-1 sm:py-2 bg-sage-400 text-white rounded-full text-[10px] sm:text-sm font-mono relative z-10 shadow-lg shadow-sage-400/20">
            {podium[0].netScoreDisplay}
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="order-3 h-[130px] sm:h-[280px] rounded-2xl sm:rounded-[3rem] bg-white border border-champagne-100 p-2 sm:p-8 flex flex-col items-center justify-center text-center relative group"
        >
          <div className="absolute top-2 right-2 sm:top-6 sm:right-6 w-4 h-4 sm:w-8 sm:h-8 bg-champagne-50 rounded-full flex items-center justify-center">
            <Medal size={8} className="text-amber-800/30 sm:size-16" />
          </div>
          <div className="w-9 h-9 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-white overflow-hidden shadow-lg mb-1.5 sm:mb-4">
            <img src={podium[2].img} alt={podium[2].name} className="w-full h-full object-cover transition-all duration-700" />
          </div>
          <span className="text-[6px] sm:text-[10px] uppercase font-bold text-sage-300 tracking-tight sm:tracking-[0.2em]">Third</span>
          <h3 className="text-xs sm:text-xl font-sans font-bold text-sage-600 mt-0.5 sm:mt-2">{podium[2].name}</h3>
          <div className="mt-1 px-2 sm:px-4 py-0.5 sm:py-1 bg-champagne-50 rounded-full text-[8px] sm:text-xs font-mono text-sage-400">
            {podium[2].netScoreDisplay}
          </div>
        </motion.div>
      </div>

      {/* Main List */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 md:px-10 py-4 text-[9px] md:text-[10px] uppercase tracking-widest text-sage-300 font-bold">
          <div className="col-span-2 md:col-span-1">순위</div>
          <div className="col-span-6 md:col-span-3">멤버</div>
          <div className="hidden md:block col-span-2 text-center">타수 (보정)</div>
          <div className="hidden md:block col-span-2 text-center">핸디캡</div>
          <div className="col-span-4 md:col-span-2 text-right">넷 스코어</div>
          <div className="hidden md:block col-span-2 text-right pr-4">변동</div>
        </div>

        <AnimatePresence mode="popLayout">
          {processedData.map((member, idx) => (
            <React.Fragment key={member.name}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                onClick={() => setExpandedId(expandedId === member.name ? null : member.name)}
                className="grid grid-cols-12 items-center px-4 md:px-10 py-4 md:py-6 bg-white border border-champagne-100 rounded-[2rem] hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="col-span-2 md:col-span-1 flex items-center space-x-3">
                  <span className="text-sm font-sans font-bold text-sage-400">#{idx + 1}</span>
                </div>

                <div className="col-span-6 md:col-span-3 flex items-center space-x-3 md:space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-champagne-100 overflow-hidden shrink-0 shadow-sm">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-sage-600">{member.name}</span>
                    <span className="text-[7px] md:text-[8px] text-sage-300 uppercase tracking-widest">WHS Standard</span>
                  </div>
                </div>

                <div className="hidden md:block col-span-2 text-center text-xs font-mono text-sage-400">
                  {member.latestScore}
                  {member.latestAdjusted !== '-' && member.latestAdjusted !== member.latestScore && (
                    <span className="text-sage-300 ml-1">({member.latestAdjusted})</span>
                  )}
                </div>
                <div className="hidden md:block col-span-2 text-center text-xs font-mono text-sage-400">
                  {member.handicap.toFixed(1)}
                </div>

                <div className="col-span-4 md:col-span-2 text-right">
                  <div className={`inline-block px-3 md:px-4 py-1.5 rounded-xl border ${member.netScoreDisplay === '-' ? 'bg-sage-50 border-sage-100' : 'bg-sage-600 border-sage-700 shadow-sm'}`}>
                    <span className={`text-xs md:text-sm font-mono font-bold ${member.netScoreDisplay === '-' ? 'text-sage-300' : 'text-white'}`}>{member.netScoreDisplay}</span>
                  </div>
                </div>

                <div className="hidden md:block col-span-2 text-right pr-4">
                  {member.improved ? (
                    <div className="flex items-center justify-end space-x-1 text-green-500 font-bold">
                      <ArrowUp size={14} className="animate-bounce" />
                      <span className="text-[10px] uppercase tracking-tighter">상승</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-1 text-sage-200">
                      <Minus size={12} />
                    </div>
                  )}
                </div>
              </motion.div>
              {/* Expanded Detail View for Hole Scores could go here if requested */}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="h-[1px] w-12 bg-champagne-100"></div>
          <TrendingUp size={20} className="text-sage-300" />
          <div className="h-[1px] w-12 bg-champagne-100"></div>
        </div>
        <p className="text-[10px] text-sage-400 uppercase tracking-[0.2em] font-medium max-w-2xl mx-auto leading-relaxed">
          [WHS 운영 원칙] 에러 타수(양파 등) 보정 적용됨. <br />
          핸디캡 산출 = (보정 타수 - 72). 랭킹 = (실제 타수 - 핸디캡) 기준.
        </p>
      </div>
    </div>
  );
};

export default RankingSection;
