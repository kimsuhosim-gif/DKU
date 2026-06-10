import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Calculator,
  CalendarDays,
  Clipboard,
  Copy,
  Flag,
  HeartHandshake,
  Landmark,
  Map,
  MapPin,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';
import { ViewState } from '../App';
import {
  ACCOUNT_HOLDER,
  ACCOUNT_NUMBER,
  clubEvents,
  clubFinanceSummary,
  getProcessRankings,
  nextRoundGroups,
  nextRoundParticipants,
  nextSchedule,
  records,
} from '../utils/golfData';

interface ClubBriefProps {
  onNavigate: (view: ViewState) => void;
}

const CURRENT_BALANCE = clubFinanceSummary.currentCash;

const ClubBrief: React.FC<ClubBriefProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const latestRecord = records[0];
  const latestEvent = clubEvents[0];
  const ranking = getProcessRankings();
  const leader = ranking[0];

  const averageScore = useMemo(() => {
    if (!latestRecord?.attendees.length) return 0;
    const total = latestRecord.attendees.reduce((sum, player) => sum + player.score, 0);
    return Math.round(total / latestRecord.attendees.length);
  }, [latestRecord]);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(`카카오뱅크 ${ACCOUNT_NUMBER} ${ACCOUNT_HOLDER}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const briefCards = [
    {
      label: '회비 잔액',
      value: `₩${CURRENT_BALANCE.toLocaleString()}`,
      detail: `카카오뱅크 ${ACCOUNT_NUMBER}`,
      icon: Wallet,
      view: 'ledger' as ViewState,
      accent: 'text-[#6d1f2a]',
    },
    {
      label: '현재 리더',
      value: leader?.name ?? '-',
      detail: `Net ${leader?.netScoreDisplay ?? '-'}`,
      icon: Trophy,
      view: 'ranking' as ViewState,
      accent: 'text-[#b08a4d]',
    },
  ];

  const quickActions = [
    { label: '내기', detail: '계산기 열기', icon: Calculator, view: 'bets' as ViewState },
    { label: '지도', detail: '코스 위치', icon: Map, view: 'map' as ViewState },
    { label: '랭킹', detail: '전체 순위', icon: Flag, view: 'ranking' as ViewState },
    { label: '회비', detail: '장부 확인', icon: Landmark, view: 'ledger' as ViewState },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="luxury-panel relative overflow-hidden rounded-[1.25rem] p-4 sm:p-5 lg:p-6"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(19rem,0.5fr)_minmax(0,1.5fr)] xl:items-start">
        <aside className="relative overflow-hidden rounded-[1rem] border border-[#c8a86b]/28 bg-[#fbfaf7]/82 p-5 text-[#16171b] shadow-[0_22px_58px_-48px_rgba(22,23,27,0.36)] backdrop-blur sm:p-6">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#6d1f2a]" />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6e665a]">Club brief</p>
                <h3 className="mt-3 max-w-none break-keep font-serif text-[1.45rem] italic leading-[1.08] text-[#16171b] sm:text-[1.6rem]">
                  오늘의 클럽 브리프
                </h3>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#c8a86b]/28 bg-white/70 text-[#6d1f2a]">
                <Clipboard size={18} />
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-[0.9rem] border border-[#16171b]/8 bg-white/62 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6e665a]">최근 라운드</p>
                <p className="mt-2 text-sm font-bold text-[#16171b]">{latestRecord?.date}</p>
              </div>
              <div className="rounded-[0.9rem] border border-[#16171b]/8 bg-[#e6eeee]/74 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#53747a]">평균 타수</p>
                <p className="mt-2 text-sm font-bold text-[#16171b]">{averageScore}</p>
              </div>
            </div>

            <div className="mt-5 rounded-[0.95rem] border border-[#c8a86b]/26 bg-white/58 p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6e665a]">회비 계좌</p>
              <div className="mt-3 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <div className="min-w-0">
                  <p className="break-all text-sm font-bold leading-5 text-[#16171b]">카카오뱅크 {ACCOUNT_NUMBER}</p>
                  <p className="mt-1 text-xs font-medium text-[#6e665a]">예금주 {ACCOUNT_HOLDER}</p>
                </div>
                <button
                  type="button"
                  onClick={copyAccount}
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#16171b] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#fbfaf7] transition hover:bg-[#6d1f2a]"
                >
                  <Copy size={12} />
                  {copied ? '복사됨' : '복사'}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {briefCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.label}
                  type="button"
                  onClick={() => onNavigate(card.view)}
                  className="group flex min-h-[4.9rem] items-center justify-between gap-3 rounded-[0.95rem] border border-[#c8a86b]/24 bg-white/68 px-4 py-3 text-left shadow-[0_14px_34px_-32px_rgba(22,23,27,0.28)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#6d1f2a]/28 hover:bg-white/86"
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#6e665a]">{card.label}</p>
                    <p className="mt-1.5 truncate text-lg font-bold leading-6 tracking-normal text-[#16171b]">{card.value}</p>
                    <p className="truncate text-[11px] font-semibold leading-5 text-[#6e665a]">{card.detail}</p>
                  </div>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#16171b]/8 bg-[#f6f2eb] ${card.accent}`}>
                    <Icon size={15} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
            <section className="relative overflow-hidden rounded-[1.05rem] border border-[#6d1f2a]/16 bg-[#fbfaf7]/86 p-5 shadow-[0_22px_60px_-48px_rgba(22,23,27,0.38)] backdrop-blur">
              <div className="absolute inset-y-0 left-0 w-1 bg-[#6d1f2a]" />
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a86b]/28 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6d1f2a]">
                    <CalendarDays size={13} />
                    Next round
                  </div>
                  <h4 className="mt-4 break-keep text-2xl font-bold leading-tight text-[#16171b] sm:text-[1.9rem]">
                    {nextSchedule.title}
                  </h4>
                  <p className="mt-2 max-w-3xl break-keep text-sm font-semibold leading-6 text-[#4f4b47]">
                    {nextSchedule.note}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ['일정', nextSchedule.date, CalendarDays],
                    ['장소', nextSchedule.location, MapPin],
                    ['참석', `${nextRoundParticipants.length}명`, Users],
                  ].map(([label, value, Icon]) => {
                    const FactIcon = Icon as React.ComponentType<{ size?: number; className?: string }>;
                    return (
                      <div key={label as string} className="min-w-0 rounded-[0.9rem] border border-[#16171b]/8 bg-white/64 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#6e665a]">{label as string}</p>
                          <FactIcon size={13} className="text-[#1d4d55]" />
                        </div>
                        <p className="mt-2 truncate text-xs font-bold text-[#16171b]">{value as string}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate('tools')}
                  className="inline-flex items-center justify-center rounded-full bg-[#16171b] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fbfaf7] transition hover:bg-[#6d1f2a]"
                >
                  라운드 도구 열기
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('records')}
                  className="inline-flex items-center justify-center rounded-full border border-[#c8a86b]/32 bg-white/64 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#16171b] transition hover:border-[#6d1f2a]/30 hover:bg-white"
                >
                  기록 보기
                </button>
              </div>
            </section>

            <div className="space-y-3">
              <section className="rounded-[1rem] border border-[#c8a86b]/26 bg-white/66 px-3.5 py-3 text-[#16171b] shadow-[0_18px_48px_-42px_rgba(22,23,27,0.34)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c8a86b]/38 bg-[#f6f2eb] text-base shadow-sm">
                    {latestEvent.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d1f2a]">
                        <Bell size={12} />
                        멤버 경조사
                      </span>
                      <span className="text-[11px] font-semibold text-[#6e665a]">{latestEvent.date}</span>
                    </div>
                    <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="min-w-0 truncate text-sm font-bold tracking-normal text-[#16171b]">{latestEvent.title}</p>
                      {latestEvent.venue ? (
                        <p className="truncate text-xs font-semibold text-[#1d4d55]">{latestEvent.venue}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#c8a86b]/32 bg-[#fbfaf7] text-[#1d4d55] md:flex">
                    <HeartHandshake size={16} />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => onNavigate(action.view)}
                      className="flex min-h-[4.1rem] items-center justify-between rounded-[0.95rem] border border-[#c8a86b]/24 bg-white/66 px-4 py-3 text-left text-[#16171b] shadow-[0_14px_34px_-32px_rgba(22,23,27,0.34)] transition hover:-translate-y-0.5 hover:border-[#6d1f2a]/28 hover:bg-white/86"
                    >
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6e665a]">{action.label}</span>
                        <span className="mt-1 block text-sm font-bold">{action.detail}</span>
                      </span>
                      <Icon size={17} className={action.view === 'bets' ? 'text-[#6d1f2a]' : 'text-[#1d4d55]'} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ClubBrief;
