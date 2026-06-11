import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, Crown, Medal, Phone, ShieldCheck, Sparkles, Trophy, X } from 'lucide-react';
import { getProcessRankings, records } from '../utils/golfData';

interface MemberSectionProps {
  onBack: () => void;
}

const cardTones = [
  { accent: '#6d1f2a', wash: 'rgba(109,31,42,0.08)', glow: 'rgba(109,31,42,0.2)' },
  { accent: '#1d4d55', wash: 'rgba(29,77,85,0.08)', glow: 'rgba(29,77,85,0.18)' },
  { accent: '#9a7134', wash: 'rgba(200,168,107,0.12)', glow: 'rgba(200,168,107,0.22)' },
  { accent: '#273821', wash: 'rgba(39,56,33,0.08)', glow: 'rgba(39,56,33,0.18)' },
];

const MemberSection: React.FC<MemberSectionProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const rankingData = getProcessRankings();

  const members = rankingData
    .map((m, rankIndex) => {
      const averageScore =
        m.scoreHistory.length > 0
          ? Math.round(m.scoreHistory.reduce((a, b) => a + b, 0) / m.scoreHistory.length)
          : '-';
      const wins = records.filter((r) => r.winner === m.name).length;
      const rounds = records.filter((r) => r.attendees.some((a) => a.name === m.name)).length;
      const handicap = m.scoreHistory.length > 0 ? m.handicap.toFixed(1) : '신규';
      const formLevel =
        typeof averageScore === 'number'
          ? Math.max(14, Math.min(100, Math.round(146 - averageScore)))
          : 18;

      return {
        name: m.name,
        role: m.role,
        handicap,
        averageScore,
        phone: m.phone,
        wins,
        rounds,
        img: m.img,
        latestScore: m.latestScore,
        netScore: m.netScoreDisplay,
        rank: rankIndex + 1,
        formLevel,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  const getRoleMeta = (role: string) => {
    if (role === '회장') {
      return {
        label: '회장',
        Icon: Crown,
        tone: 'border-[#c8a86b]/36 bg-[#f5ebd8] text-[#6f512a]',
      };
    }

    if (role === '총무') {
      return {
        label: '총무',
        Icon: Medal,
        tone: 'border-[#1d4d55]/18 bg-[#e8efed] text-[#1d4d55]',
      };
    }

    return {
      label: '정회원',
      Icon: ShieldCheck,
      tone: 'border-[#c8a86b]/28 bg-[#fbf7ee] text-[#34462f]',
    };
  };

  const getMemberTag = (member: (typeof members)[number]) => {
    if (member.wins > 0) return { label: '우승 카드', Icon: Trophy };
    if (member.rank <= 3) return { label: '순위권', Icon: Crown };
    if (member.rounds === 0) return { label: '첫 기록 대기', Icon: Sparkles };
    if (member.formLevel >= 45) return { label: '컨디션 좋음', Icon: Award };
    return { label: '반등 후보', Icon: Sparkles };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-normal text-[#6f7668] transition-colors hover:text-[#243321] sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-normal text-[#6d1f2a] sm:text-xs">Member house</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#172117] sm:text-5xl">멤버 명단 소개</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:w-[23rem]">
          <div className="rounded-2xl border border-[#c8a86b]/24 bg-white/70 px-3 py-3 shadow-[0_18px_44px_-38px_rgba(22,23,27,0.28)]">
            <p className="text-[9px] font-bold text-[#746b5d]">멤버</p>
            <p className="mt-1 text-lg font-black text-[#172117]">{members.length}</p>
          </div>
          <div className="rounded-2xl border border-[#c8a86b]/24 bg-white/70 px-3 py-3 shadow-[0_18px_44px_-38px_rgba(22,23,27,0.28)]">
            <p className="text-[9px] font-bold text-[#746b5d]">기록</p>
            <p className="mt-1 text-lg font-black text-[#172117]">{records.length}</p>
          </div>
          <div className="rounded-2xl border border-[#c8a86b]/24 bg-white/70 px-3 py-3 shadow-[0_18px_44px_-38px_rgba(22,23,27,0.28)]">
            <p className="text-[9px] font-bold text-[#746b5d]">선두</p>
            <p className="mt-1 truncate text-lg font-black text-[#172117]">{rankingData[0]?.name ?? '-'}</p>
          </div>
        </div>
      </div>

      <section className="mb-8 hidden overflow-hidden rounded-[1.4rem] border border-[#c8a86b]/28 bg-[#16171b] shadow-[0_26px_80px_-64px_rgba(22,23,27,0.52)] sm:block">
        <div className="relative aspect-[21/7]">
          <img src="/images/golf-lifestyle-member-wide.jpg" alt="Golf course member lifestyle" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,23,27,0.72)_0%,rgba(22,23,27,0.36)_43%,rgba(22,23,27,0.02)_100%)]" />
          <div className="relative z-10 flex h-full max-w-xl flex-col justify-end p-6 text-[#fbfaf7]">
            <p className="text-[10px] font-bold text-[#d9c08c]">DKU-RE09 MEMBER PASS</p>
            <h3 className="mt-2 text-3xl font-black leading-tight">이번 라운딩 멤버 패스</h3>
            <p className="mt-2 max-w-md break-keep text-sm font-semibold leading-6 text-white/78">
              사진, 연락, 핸디, 기록을 카드 한 장에 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-normal text-[#7a715f]">참석 멤버</p>
        <p className="text-[10px] font-bold text-[#9a7134]">사진을 누르면 크게 봅니다</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, idx) => {
          const role = getRoleMeta(member.role);
          const tag = getMemberTag(member);
          const RoleIcon = role.Icon;
          const TagIcon = tag.Icon;
          const tone = cardTones[idx % cardTones.length];

          return (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
              style={
                {
                  '--member-accent': tone.accent,
                  '--member-wash': tone.wash,
                  '--member-glow': tone.glow,
                } as React.CSSProperties
              }
              className="group relative min-h-[13.8rem] overflow-hidden rounded-[1.15rem] border border-[#c8a86b]/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,233,0.94))] p-3 shadow-[0_20px_58px_-48px_rgba(22,23,27,0.42)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--member-accent)] hover:shadow-[0_34px_84px_-54px_var(--member-glow)] sm:min-h-[17rem] sm:rounded-[1.6rem] sm:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--member-accent),rgba(200,168,107,0.72),transparent)]" />
              <div className="pointer-events-none absolute right-2 -top-6 text-[4.8rem] font-black leading-none text-[#16171b]/[0.035] sm:-top-8 sm:text-[6.8rem]">
                {String(member.rank).padStart(2, '0')}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_4%,var(--member-wash),transparent_38%)]" />

              <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <button
                  type="button"
                  className="relative h-[4.15rem] w-[4.15rem] shrink-0 overflow-hidden rounded-[1rem] border border-white bg-[#f6efe3] shadow-[0_18px_34px_-24px_rgba(22,23,27,0.58)] transition-transform duration-500 group-hover:scale-[1.04] sm:h-[5.9rem] sm:w-[5.9rem] sm:rounded-[1.25rem]"
                  onClick={() => setSelectedImage(member.img)}
                  aria-label={`${member.name} 사진 크게 보기`}
                >
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/38 py-1 text-[8px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    VIEW
                  </span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="break-keep text-2xl font-black leading-tight text-[#172117] sm:truncate sm:text-3xl">{member.name}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold sm:text-[10px] ${role.tone}`}>
                          <RoleIcon size={11} />
                          {role.label}
                        </span>
                        <span className="hidden items-center gap-1 rounded-full border border-[#c8a86b]/24 bg-white/72 px-2 py-1 text-[9px] font-bold text-[#6d1f2a] sm:inline-flex">
                          <TagIcon size={11} />
                          {tag.label}
                        </span>
                      </div>
                    </div>

                    {member.phone ? (
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c8a86b]/26 bg-white/76 text-[#34462f] transition-all duration-300 hover:bg-[#172117] hover:text-[#fbfaf7] sm:h-10 sm:w-10"
                        title="전화 걸기"
                        aria-label={`${member.name} 전화 걸기`}
                      >
                        <Phone size={14} />
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-3 hidden sm:block">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#746b5d]">
                      <span>폼 지수</span>
                      <span>{member.latestScore === '-' ? '대기' : `${member.latestScore}타`}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#ece4d7]">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--member-accent),#c8a86b)]" style={{ width: `${member.formLevel}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-4 grid grid-cols-3 gap-1 sm:mt-5 sm:gap-2.5">
                <div className="min-w-0 rounded-xl border border-[#c8a86b]/20 bg-white/64 px-1.5 py-2 text-center sm:px-3 sm:py-3 sm:text-left">
                  <span className="block text-[8px] font-extrabold text-[#7b8c6a]">핸디</span>
                  <span className={`mt-1 block whitespace-nowrap text-[13px] font-black leading-none text-[#172117] sm:text-lg ${member.handicap === '신규' ? 'text-xs sm:text-base' : ''}`}>
                    {member.handicap}
                  </span>
                </div>
                <div className="min-w-0 rounded-xl border border-[#c8a86b]/20 bg-white/64 px-1.5 py-2 text-center sm:px-3 sm:py-3 sm:text-left">
                  <span className="block text-[8px] font-extrabold text-[#7b8c6a]">평균</span>
                  <span className="mt-1 block whitespace-nowrap text-[13px] font-black leading-none text-[#172117] sm:text-lg">{member.averageScore}</span>
                </div>
                <div className="min-w-0 rounded-xl border border-[#c8a86b]/20 bg-white/64 px-1.5 py-2 text-center sm:px-3 sm:py-3 sm:text-left">
                  <span className="block text-[8px] font-extrabold text-[#7b8c6a]">참가</span>
                  <span className="mt-1 block whitespace-nowrap text-[13px] font-black leading-none text-[#172117] sm:text-lg">{member.rounds}</span>
                </div>
              </div>

              <div className="relative z-10 mt-3 flex items-center justify-between gap-1.5 rounded-2xl border border-[#c8a86b]/18 bg-[#fbfaf7]/70 px-2.5 py-2 sm:mt-4 sm:gap-2 sm:px-3">
                <div className="w-11 shrink-0 sm:w-auto">
                  <p className="text-[8px] font-bold text-[#746b5d]">
                    <span className="sm:hidden">RANK</span>
                    <span className="hidden sm:inline">NET RANK</span>
                  </p>
                  <p className="mt-0.5 whitespace-nowrap text-[13px] font-black text-[#172117] sm:text-sm">#{member.rank}</p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[8px] font-bold text-[#746b5d]">NET</p>
                  <p className="mt-0.5 whitespace-nowrap text-[13px] font-black text-[var(--member-accent)] sm:text-sm">{member.netScore}</p>
                </div>
                {member.wins > 0 ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e3c8] text-[#9a7134]">
                    <Trophy size={16} />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--member-wash)] text-[var(--member-accent)]">
                    <Sparkles size={16} />
                  </div>
                )}
              </div>
            </motion.article>
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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative flex max-h-[90vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="사진 닫기"
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
