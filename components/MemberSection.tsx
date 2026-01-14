import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Crown, Award, Medal, Target, Phone } from 'lucide-react';
import { getProcessRankings, records } from '../utils/golfData';

interface MemberSectionProps {
  onBack: () => void;
}

const MemberSection: React.FC<MemberSectionProps> = ({ onBack }) => {
  const rankingData = getProcessRankings();

  const members = rankingData.map(m => {
    const avg = m.scoreHistory.length > 0
      ? Math.round(m.scoreHistory.reduce((a, b) => a + b, 0) / m.scoreHistory.length)
      : '-';

    // Calculate number of wins and rounds played from records
    const wins = records.filter(r => r.winner === m.name).length;
    const rounds = records.filter(r => r.attendees.some(a => a.name === m.name)).length;

    return {
      name: m.name,
      role: m.role,
      handicap: m.scoreHistory.length > 0 ? m.handicap.toFixed(1) : 'New',
      averageScore: avg,
      since: m.since,
      phone: m.phone,
      wins: wins,
      rounds: rounds,
      img: m.img
    };
  });

  // Sort by Name (Korean alphabetical order)
  members.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Brotherhood</span>
          <h2 className="text-5xl font-sans font-bold mt-4 text-sage-600">Club Members</h2>
        </div>
        <p className="text-sage-400 max-w-sm text-sm italic">
          "Dankook Urban Planning & Real Estate Class of '09. 우리의 인연은 그린 위에서도 계속됩니다."
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
        {members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group p-3 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-champagne-100 bg-white hover:bg-champagne-50/50 transition-all duration-500 flex flex-col relative overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-sage-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="flex flex-row items-center space-x-3 sm:space-x-8 relative z-10">
              <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-xl sm:rounded-4xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-md border border-champagne-100 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex flex-col mb-1 text-left">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
                    <h4 className="text-sm sm:text-3xl font-sans font-extrabold text-sage-600 leading-tight">
                      {member.name}
                    </h4>
                    {/* Badge Rendering */}
                    <div className="flex space-x-0.5 sm:space-x-1 shrink-0">
                      {member.role === '회장' && (
                        <div className="p-0.5 sm:p-1.5 bg-amber-100 text-amber-600 rounded-md sm:rounded-lg shadow-sm" title="회장">
                          <Crown size={8} className="sm:w-[12px] sm:h-[12px]" />
                        </div>
                      )}
                      {member.role === '총무' && (
                        <div className="p-0.5 sm:p-1.5 bg-blue-100 text-blue-600 rounded-md sm:rounded-lg shadow-sm" title="총무">
                          <Medal size={8} className="sm:w-[12px] sm:h-[12px]" />
                        </div>
                      )}
                      {member.wins > 0 && (
                        <div className="p-0.5 sm:p-1.5 bg-rose-100 text-rose-600 rounded-md sm:rounded-lg shadow-sm flex items-center space-x-0.5" title={`${member.wins}회 우승`}>
                          <Award size={10} className="sm:w-[14px] sm:h-[14px]" />
                          <span className="text-[7px] sm:text-[10px] font-bold">{member.wins}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[8px] sm:text-xs text-sage-400 font-bold uppercase tracking-widest">{member.role}</p>
                </div>

                <div className="flex items-center">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="p-1 sm:p-2.5 rounded-lg sm:rounded-2xl bg-sage-50 text-sage-400 hover:bg-sage-600 hover:text-white transition-all duration-300 shadow-sm flex items-center space-x-1 sm:space-x-2"
                    >
                      <Phone size={8} className="sm:w-[10px] sm:h-[10px]" />
                      <span className="text-[8px] sm:text-xs font-bold sm:inline">연락처</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-4 mt-3 sm:mt-8 relative z-10">
              <div className="flex flex-col bg-white/60 backdrop-blur-sm px-1.5 sm:px-3 py-1.5 sm:py-3 rounded-lg sm:rounded-2xl border border-champagne-50 group-hover:border-sage-200 transition-colors">
                <span className="text-[5px] sm:text-[7px] uppercase tracking-widest text-sage-300 font-extrabold mb-0.5 sm:mb-1">HC</span>
                <span className="text-[9px] sm:text-xs font-sans font-bold text-sage-600">{member.handicap}</span>
              </div>
              <div className="flex flex-col bg-white/60 backdrop-blur-sm px-1.5 sm:px-3 py-1.5 sm:py-3 rounded-lg sm:rounded-2xl border border-champagne-50 group-hover:border-sage-200 transition-colors">
                <span className="text-[5px] sm:text-[7px] uppercase tracking-widest text-sage-300 font-extrabold mb-0.5 sm:mb-1">Avg</span>
                <span className="text-[9px] sm:text-xs font-sans font-bold text-sage-600">{member.averageScore}</span>
              </div>
              <div className="flex flex-col bg-white/60 backdrop-blur-sm px-1.5 sm:px-3 py-1.5 sm:py-3 rounded-lg sm:rounded-2xl border border-champagne-50 group-hover:border-sage-200 transition-colors">
                <span className="text-[5px] sm:text-[7px] uppercase tracking-widest text-sage-300 font-extrabold mb-0.5 sm:mb-1">Rnd</span>
                <span className="text-[9px] sm:text-xs font-sans font-bold text-sage-600">{member.rounds}</span>
              </div>
            </div>

            <div className="hidden sm:flex mt-6 items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-sage-300 font-bold">Class of 2009</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-sage-200"></div>
                <div className="w-1 h-1 rounded-full bg-sage-200"></div>
                <div className="w-1 h-1 rounded-full bg-sage-400"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemberSection;

