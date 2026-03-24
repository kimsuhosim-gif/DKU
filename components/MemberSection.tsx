import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Award, Medal, Phone, X } from 'lucide-react';
import { getProcessRankings, records } from '../utils/golfData';

interface MemberSectionProps {
  onBack: () => void;
}

const MemberSection: React.FC<MemberSectionProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const rankingData = getProcessRankings();
  const roleLabel: Record<string, string> = {
    captain: 'Captain',
    secretary: 'Secretary',
    member: 'Member',
  };

  const members = rankingData
    .map((m) => {
      const avg =
        m.scoreHistory.length > 0
          ? Math.round(m.scoreHistory.reduce((a, b) => a + b, 0) / m.scoreHistory.length)
          : '-';

      const wins = records.filter((r) => r.winner === m.name).length;
      const rounds = records.filter((r) => r.attendees.some((a) => a.name === m.name)).length;

      return {
        name: m.name,
        role: m.role,
        handicap: m.scoreHistory.length > 0 ? m.handicap.toFixed(1) : 'New',
        averageScore: avg,
        phone: m.phone,
        wins,
        rounds,
        img: m.img,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-10 flex flex-col gap-4 sm:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">
            Brotherhood
          </span>
          <h2 className="mt-3 text-3xl font-bold text-sage-600 sm:text-5xl">Club Members</h2>
        </div>
        <p className="max-w-sm text-sm italic text-sage-400">
          Class of 2009, still meeting through rounds, records, and the occasional dinner after play.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-champagne-100 bg-white p-4 transition-all duration-500 hover:bg-champagne-50/50 sm:rounded-[3rem] sm:p-7"
          >
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sage-50 opacity-50 transition-transform duration-700 group-hover:scale-150 sm:-right-10 sm:-top-10 sm:h-32 sm:w-32" />

            <div className="relative z-10 flex items-center gap-4">
              <div
                className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-champagne-100 bg-white shadow-md transition-transform duration-500 group-hover:scale-105 sm:h-28 sm:w-28 sm:rounded-[2rem]"
                onClick={() => setSelectedImage(member.img)}
              >
                <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
              </div>

              <div className="min-w-0 flex-grow">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-bold leading-tight text-sage-600 sm:text-2xl">{member.name}</h4>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-sage-400">
                      {roleLabel[member.role] || member.role}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {member.role === 'captain' && (
                      <div className="rounded-lg bg-amber-100 p-1 text-amber-600 shadow-sm sm:rounded-xl sm:p-1.5" title="Captain">
                        <Crown size={12} />
                      </div>
                    )}
                    {member.role === 'secretary' && (
                      <div className="rounded-lg bg-blue-100 p-1 text-blue-600 shadow-sm sm:rounded-xl sm:p-1.5" title="Secretary">
                        <Medal size={12} />
                      </div>
                    )}
                    {member.wins > 0 && (
                      <div
                        className="flex items-center gap-1 rounded-lg bg-rose-100 px-1.5 py-1 text-rose-600 shadow-sm sm:rounded-xl sm:px-2 sm:py-1.5"
                        title={`${member.wins} wins`}
                      >
                        <Award size={12} />
                        <span className="text-[10px] font-bold">{member.wins}</span>
                      </div>
                    )}
                  </div>
                </div>

                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sage-50 px-3 py-2 text-xs font-bold text-sage-500 transition-all duration-300 hover:bg-sage-600 hover:text-white sm:rounded-2xl"
                  >
                    <Phone size={12} />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
              <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">HC</span>
                <span className="text-sm font-bold text-sage-600">{member.handicap}</span>
              </div>
              <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">Avg</span>
                <span className="text-sm font-bold text-sage-600">{member.averageScore}</span>
              </div>
              <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">Rnd</span>
                <span className="text-sm font-bold text-sage-600">{member.rounds}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <X size={24} />
              </button>
              <img src={selectedImage} alt="Member Profile Full" className="max-h-[90vh] max-w-full object-contain shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberSection;
