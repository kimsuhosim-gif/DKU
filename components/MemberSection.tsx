import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Award, Medal, Phone, X } from 'lucide-react';
import { getProcessRankings, memberPersonas, records } from '../utils/golfData';

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
        latestScore: m.latestScore,
        netScore: m.netScoreDisplay,
        persona: memberPersonas[m.name] ?? {
          title: '비공개 전력',
          line: '기록이 쌓이면 캐릭터가 바로 정리될 멤버.',
          tags: ['관찰 중', '신규 변수'],
          watchPoint: '첫 공식 기록이 생기면 라이벌 보드에 올라올 수 있습니다.',
        },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const getRoleMeta = (role: string) => {
    if (role === '회장') {
      return {
        label: '회장',
        badgeClass: 'border-[#a57f43]/30 bg-[#f0e6d2] text-[#6f512a]',
        icon: <Crown size={12} />,
        iconClass: 'bg-[#f0e6d2] text-[#6f512a]',
      };
    }

    if (role === '총무') {
      return {
        label: '총무',
        badgeClass: 'border-[#34462f]/20 bg-[#e8ebe2] text-[#34462f]',
        icon: <Medal size={12} />,
        iconClass: 'bg-[#e8ebe2] text-[#34462f]',
      };
    }

    return {
      label: '정회원',
      badgeClass: 'border-[#cdb786]/24 bg-[#f4eee3] text-[#34462f]',
      icon: null,
      iconClass: '',
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#6f7668] transition-colors hover:text-[#243321] sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#6f7668] sm:text-xs">멤버 명단</span>
          <h2 className="mt-3 text-3xl font-bold text-[#243321] sm:text-5xl">이번 라운딩 멤버</h2>
        </div>
        <p className="max-w-sm text-sm italic text-[#686b62]">
          참석자, 역할, 핸디와 최근 기록만 간단하게 확인하는 전용 명단입니다.
        </p>
      </div>

      <section className="mb-8 hidden overflow-hidden rounded-[1.35rem] border border-[#c8a86b]/28 bg-[#16171b] shadow-[0_26px_80px_-64px_rgba(22,23,27,0.52)] sm:block">
        <div className="relative aspect-[16/9]">
          <img src="/images/golf-lifestyle-member-wide.jpg" alt="Golf course member lifestyle" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,23,27,0.68)_0%,rgba(22,23,27,0.34)_42%,rgba(22,23,27,0.02)_100%)]" />
          <div className="relative z-10 flex h-full max-w-md flex-col justify-end p-4 text-[#fbfaf7] sm:p-6">
            <p className="text-[9px] font-bold tracking-[0.18em] text-[#d9c08c] sm:text-[10px]">멤버 명단</p>
            <h3 className="mt-1.5 break-keep text-xl font-bold leading-tight sm:text-2xl">
              멤버 명단 소개
            </h3>
            <p className="mt-2 max-w-sm break-keep text-xs font-semibold leading-5 text-white/76 sm:text-sm sm:leading-6">
              이번 라운딩 참석 멤버와 기본 정보를 한눈에 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a715f]">참석 멤버</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {members.map((member, idx) => {
          const role = getRoleMeta(member.role);

          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="luxury-card group relative flex flex-col overflow-hidden rounded-[1rem] p-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#a57f43]/34 hover:shadow-[0_24px_64px_-46px_rgba(12,18,13,0.62)] sm:rounded-[1.5rem] sm:p-6"
            >
              <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div
                  className="h-16 w-16 cursor-pointer overflow-hidden rounded-[0.8rem] border border-[#cdb786]/35 bg-[#fbf7ee] shadow-[0_16px_34px_-26px_rgba(12,18,13,0.55)] transition-transform duration-500 group-hover:scale-[1.03] sm:h-24 sm:w-24 sm:rounded-[1.2rem]"
                  onClick={() => setSelectedImage(member.img)}
                >
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="truncate text-lg font-bold leading-tight tracking-normal text-[#243321] sm:text-[1.75rem]">
                        {member.name}
                      </h4>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
                        <div className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.14em] ${role.badgeClass}`}>
                          {role.label}
                        </div>
                        {role.icon ? (
                          <div className={`rounded-full p-1.5 shadow-sm ${role.iconClass}`} title={role.label}>
                            {role.icon}
                          </div>
                        ) : null}
                        {member.wins > 0 ? (
                          <div
                            className="flex items-center gap-1 rounded-full border border-[#5a2a24]/14 bg-[#f0e2dc] px-2 py-1 text-[#5a2a24] shadow-sm"
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
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#cdb786]/28 bg-[#f7f1e6] text-[#34462f] transition-all duration-300 hover:bg-[#243321] hover:text-[#fbf7ee] sm:h-9 sm:w-9"
                        title="전화 걸기"
                        aria-label={`${member.name} 전화 걸기`}
                      >
                        <Phone size={14} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-3 grid grid-cols-3 gap-1 sm:mt-5 sm:gap-3">
                <div className="rounded-[0.7rem] border border-[#cdb786]/24 bg-[#fbf7ee]/78 px-1.5 py-2 shadow-[0_10px_24px_-24px_rgba(12,18,13,0.5)] sm:rounded-[0.85rem] sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold tracking-normal text-[#7b8c6a] sm:text-[8px] sm:uppercase sm:tracking-[0.2em]">
                    <span className="sm:hidden">핸디</span>
                    <span className="hidden sm:inline">핸디캡</span>
                  </span>
                  <span
                    className={`whitespace-nowrap text-xs font-bold tracking-normal text-[#243321] sm:text-base ${
                      member.handicap === '신규' ? 'text-[0.82rem] sm:text-base' : ''
                    }`}
                  >
                    {member.handicap}
                  </span>
                </div>
                <div className="rounded-[0.7rem] border border-[#cdb786]/24 bg-[#fbf7ee]/78 px-1.5 py-2 shadow-[0_10px_24px_-24px_rgba(12,18,13,0.5)] sm:rounded-[0.85rem] sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold tracking-normal text-[#7b8c6a] sm:text-[8px] sm:uppercase sm:tracking-[0.2em]">평균</span>
                  <span className="text-xs font-bold text-[#243321] sm:text-base">{member.averageScore}</span>
                </div>
                <div className="rounded-[0.7rem] border border-[#cdb786]/24 bg-[#fbf7ee]/78 px-1.5 py-2 shadow-[0_10px_24px_-24px_rgba(12,18,13,0.5)] sm:rounded-[0.85rem] sm:px-4 sm:py-3">
                  <span className="mb-1 block text-[8px] font-extrabold tracking-normal text-[#7b8c6a] sm:text-[8px] sm:uppercase sm:tracking-[0.2em]">참가</span>
                  <span className="text-xs font-bold text-[#243321] sm:text-base">{member.rounds}</span>
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
