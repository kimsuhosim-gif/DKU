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
        handicap: m.scoreHistory.length > 0 ? m.handicap.toFixed(1) : '신규',
        averageScore: avg,
        phone: m.phone,
        wins,
        rounds,
        img: m.img,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const getRoleMeta = (role: string) => {
    if (role === '회장') {
      return {
        label: '회장',
        badgeClass: 'border-amber-200 bg-amber-100 text-amber-700',
        icon: <Crown size={12} />,
        iconClass: 'bg-amber-100 text-amber-600',
      };
    }

    if (role === '총무') {
      return {
        label: '총무',
        badgeClass: 'border-blue-200 bg-blue-100 text-blue-700',
        icon: <Medal size={12} />,
        iconClass: 'bg-blue-100 text-blue-600',
      };
    }

    return {
      label: '정회원',
      badgeClass: 'border-sage-100 bg-sage-50 text-sage-600',
      icon: null,
      iconClass: '',
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">멤버 디렉토리</span>
          <h2 className="mt-3 text-3xl font-bold text-sage-600 sm:text-5xl">클럽 멤버</h2>
        </div>
        <p className="max-w-sm text-sm italic text-sage-400">
          현재 핸디캡, 평균 타수, 참가 횟수를 한 번에 볼 수 있도록 멤버 현황을 정리했습니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {members.map((member, idx) => {
          const role = getRoleMeta(member.role);

          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group relative flex flex-col overflow-hidden rounded-[1.8rem] border border-champagne-100 bg-white p-3 transition-all duration-500 hover:bg-champagne-50/50 sm:rounded-[2.4rem] sm:p-6"
            >
              <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-sage-50 opacity-50 transition-transform duration-700 group-hover:scale-150 sm:-right-10 sm:-top-10 sm:h-28 sm:w-28" />

              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div
                  className="h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border border-champagne-100 bg-white shadow-md transition-transform duration-500 group-hover:scale-105 sm:h-24 sm:w-24 sm:rounded-[2rem]"
                  onClick={() => setSelectedImage(member.img)}
                >
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="truncate text-[1.35rem] font-bold leading-tight tracking-[-0.03em] text-sage-600 sm:text-[1.75rem]">
                        {member.name}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] ${role.badgeClass}`}>
                          {role.label}
                        </div>
                        {role.icon ? (
                          <div className={`rounded-full p-1.5 shadow-sm ${role.iconClass}`} title={role.label}>
                            {role.icon}
                          </div>
                        ) : null}
                        {member.wins > 0 ? (
                          <div
                            className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-rose-600 shadow-sm"
                            title={`우승 ${member.wins}회`}
                          >
                            <Award size={12} />
                            <span className="text-[10px] font-bold">{member.wins}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {member.phone ? (
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-500 transition-all duration-300 hover:bg-sage-600 hover:text-white"
                        title="전화 걸기"
                        aria-label={`${member.name} 전화 걸기`}
                      >
                        <Phone size={15} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-2.5 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.2em] text-sage-300">핸디캡</span>
                  <span className="text-sm font-bold text-sage-600 sm:text-base">{member.handicap}</span>
                </div>
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-2.5 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.2em] text-sage-300">평균</span>
                  <span className="text-sm font-bold text-sage-600 sm:text-base">{member.averageScore}</span>
                </div>
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-2.5 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.2em] text-sage-300">참가</span>
                  <span className="text-sm font-bold text-sage-600 sm:text-base">{member.rounds}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
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
