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
    if (role === '?뚯옣') {
      return {
        label: '회장',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: <Crown size={12} />,
        iconClass: 'bg-amber-100 text-amber-600',
      };
    }
    if (role === '珥앸Т') {
      return {
        label: '총무',
        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <Medal size={12} />,
        iconClass: 'bg-blue-100 text-blue-600',
      };
    }
    return {
      label: '정회원',
      badgeClass: 'bg-sage-50 text-sage-600 border-sage-100',
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

      <div className="mb-10 flex flex-col gap-4 sm:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">멤버 디렉토리</span>
          <h2 className="mt-3 text-3xl font-bold text-sage-600 sm:text-5xl">클럽 멤버</h2>
        </div>
        <p className="max-w-sm text-sm italic text-sage-400">
          09학번 멤버들의 현재 핸디캡, 평균 타수, 참가 라운드 수를 한 번에 볼 수 있는 명부입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {members.map((member, idx) => {
          const role = getRoleMeta(member.role);

          return (
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
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="truncate text-lg font-bold leading-tight text-sage-600 sm:text-2xl">{member.name}</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.16em] ${role.badgeClass}`}>
                          {role.label}
                        </div>
                        {role.icon ? (
                          <div className={`rounded-full p-1.5 shadow-sm ${role.iconClass}`} title={role.label}>
                            {role.icon}
                          </div>
                        ) : null}
                        {member.wins > 0 ? (
                          <div className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-rose-600 shadow-sm" title={`우승 ${member.wins}회`}>
                            <Award size={12} />
                            <span className="text-[10px] font-bold">{member.wins}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {member.phone ? (
                    <a
                      href={`tel:${member.phone}`}
                      className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-sage-500 transition-all duration-300 hover:bg-sage-600 hover:text-white"
                      title="전화 걸기"
                      aria-label={`${member.name} 전화 걸기`}
                    >
                      <Phone size={16} />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="relative z-10 mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">핸디캡</span>
                  <span className="text-sm font-bold text-sage-600">{member.handicap}</span>
                </div>
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">평균</span>
                  <span className="text-sm font-bold text-sage-600">{member.averageScore}</span>
                </div>
                <div className="rounded-xl border border-champagne-50 bg-white/70 px-3 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold uppercase tracking-[0.22em] text-sage-300">참가</span>
                  <span className="text-sm font-bold text-sage-600">{member.rounds}</span>
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
