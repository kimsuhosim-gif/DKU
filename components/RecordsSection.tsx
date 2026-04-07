import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, Trophy, Users, BarChart3, MapPin } from 'lucide-react';
import { records } from '../utils/golfData';

interface RecordsSectionProps {
  onBack: () => void;
}

const RecordsSection: React.FC<RecordsSectionProps> = ({ onBack }) => {
  const [expandedRound, setExpandedRound] = useState<number | null>(0);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const latestRecord = records[0];
  const averageScore =
    latestRecord && latestRecord.attendees.length
      ? Math.round(latestRecord.attendees.reduce((sum, player) => sum + player.score, 0) / latestRecord.attendees.length)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="group mb-8 flex items-center space-x-2 text-[11px] font-medium uppercase tracking-[0.22em] text-sage-400 transition-colors hover:text-sage-600 sm:mb-12"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>대시보드로 돌아가기</span>
      </button>

      <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sage-400 sm:text-xs">공식 라운드 기록</span>
          <h2 className="mt-3 font-serif text-3xl text-sage-600 sm:text-5xl">라운드 히스토리</h2>
        </div>
        <p className="max-w-sm text-sm italic text-sage-400">한 번의 라운드가 끝나도 스코어와 우승 기록은 아카이브에 남습니다.</p>
      </div>

      {latestRecord && (
        <div className="mb-10 grid grid-cols-2 gap-3 sm:mb-14 lg:grid-cols-4">
          <div className="rounded-[1.8rem] border border-champagne-100 bg-white p-5">
            <div className="flex items-center gap-2 text-sage-300">
              <Trophy size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">우승자</span>
            </div>
            <p className="mt-3 text-xl font-bold text-sage-600">{latestRecord.winner}</p>
          </div>
          <div className="rounded-[1.8rem] border border-champagne-100 bg-white p-5">
            <div className="flex items-center gap-2 text-sage-300">
              <Users size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">참가 인원</span>
            </div>
            <p className="mt-3 text-xl font-bold text-sage-600">{latestRecord.attendees.length}명</p>
          </div>
          <div className="rounded-[1.8rem] border border-champagne-100 bg-white p-5">
            <div className="flex items-center gap-2 text-sage-300">
              <BarChart3 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">평균 타수</span>
            </div>
            <p className="mt-3 text-xl font-bold text-sage-600">{averageScore}</p>
          </div>
          <div className="rounded-[1.8rem] border border-champagne-100 bg-white p-5">
            <div className="flex items-center gap-2 text-sage-300">
              <MapPin size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">코스</span>
            </div>
            <p className="mt-3 break-keep text-base font-bold text-sage-600">{latestRecord.location}</p>
          </div>
        </div>
      )}

      <div className="relative ml-2 space-y-8 border-l border-sage-200 pb-20 pl-5 sm:ml-12 sm:space-y-20 sm:pl-16">
        {records.map((record, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[18px] top-2 z-10 h-4 w-4 rounded-full border-4 border-sage-300 bg-white sm:-left-[76px] sm:top-0 sm:h-6 sm:w-6" />

            <div className="flex flex-col gap-4 sm:gap-8 md:flex-row md:items-start">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-sage-100 bg-sage-50 shadow-sm sm:h-24 sm:w-24">
                <span className="text-xl font-bold text-sage-600 sm:text-2xl">{records.length - idx}</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.24em] text-sage-400">Round</span>
              </div>

              <div className="w-full flex-grow">
                <div className="mb-4 flex flex-col gap-4 sm:mb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center space-x-2 text-sage-400 sm:space-x-3">
                      <Calendar size={14} />
                      <span className="text-[10px] uppercase tracking-[0.24em] sm:text-xs">{record.date}</span>
                    </div>
                    <h3 className="mb-2 font-serif text-2xl text-sage-600 sm:text-3xl">{record.location}</h3>
                    <div className="flex items-center space-x-2 text-sage-500">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-sm font-medium">우승자: {record.winner} ({record.score}타)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedRound(expandedRound === idx ? null : idx)}
                    className="flex self-start rounded-full border border-champagne-100 bg-white px-4 py-2 shadow-sm transition-colors hover:text-sage-600 md:self-center"
                  >
                    <span className="mr-2 text-[10px] font-medium uppercase tracking-[0.22em] sm:text-xs">
                      {expandedRound === idx ? '점수 접기' : '점수 보기'}
                    </span>
                    {expandedRound === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedRound === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-[1.75rem] border border-sage-100 bg-sage-50/60 p-4 sm:rounded-3xl sm:p-8">
                        <h4 className="mb-5 inline-block border-b border-sage-200 pb-2 font-serif text-sm italic text-sage-400">개인별 스코어</h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                          {[...record.attendees].sort((a, b) => a.score - b.score).map((attendee, i) => (
                            <motion.div
                              key={i}
                              layout
                              onClick={() =>
                                setExpandedMember(
                                  expandedMember === `${idx}-${attendee.name}` ? null : `${idx}-${attendee.name}`
                                )
                              }
                              className="cursor-pointer rounded-2xl border border-champagne-100 bg-white px-4 py-4 shadow-sm transition-all hover:border-sage-200 hover:shadow-md"
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm font-medium text-sage-600">{attendee.name}</span>
                                <span className="font-serif text-lg italic text-sage-500">{attendee.score}</span>
                              </div>

                              <AnimatePresence>
                                {expandedMember === `${idx}-${attendee.name}` && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden rounded-xl border border-sage-100 bg-sage-50 py-2 text-center"
                                  >
                                    <div className="flex justify-center space-x-3 font-mono text-xs text-sage-500">
                                      <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-[0.14em] text-sage-400">전반</span>
                                        <span>{attendee.front}</span>
                                      </div>
                                      <div className="h-6 w-px bg-sage-200" />
                                      <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-[0.14em] text-sage-400">후반</span>
                                        <span>{attendee.back}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordsSection;
