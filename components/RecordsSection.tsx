import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Target, ArrowLeft, ChevronDown, ChevronUp, Calendar, Trophy } from 'lucide-react';
import { records } from '../utils/golfData';

interface RecordsSectionProps {
  onBack: () => void;
}

const RecordsSection: React.FC<RecordsSectionProps> = ({ onBack }) => {
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

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
          <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Official Records</span>
          <h2 className="text-5xl font-serif mt-4 text-sage-600">Rounding History</h2>
        </div>
        <p className="text-sage-400 max-w-sm text-sm italic">
          "Great shots are moments, but records are forever."
        </p>
      </div>

      <div className="relative border-l border-sage-200 ml-4 md:ml-12 pl-8 md:pl-16 pb-20 space-y-20">
        {records.map((record, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[45px] md:-left-[77px] top-0 w-6 h-6 rounded-full bg-white border-4 border-sage-300 z-10"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 bg-sage-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-sage-100 shadow-sm">
                <span className="text-2xl font-bold text-sage-600">1</span>
                <span className="text-[10px] uppercase tracking-widest text-sage-400 mt-1">Round</span>
              </div>

              <div className="flex-grow w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-3 text-sage-400 mb-2">
                      <Calendar size={14} />
                      <span className="text-xs tracking-widest uppercase">{record.date}</span>
                    </div>
                    <h3 className="text-3xl font-serif text-sage-600 mb-2">{record.location}</h3>
                    <div className="flex items-center space-x-2 text-sage-500">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-sm font-medium">Winner: {record.winner} ({record.score})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedRound(expandedRound === idx ? null : idx)}
                    className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors bg-white px-4 py-2 rounded-full border border-champagne-100 shadow-sm self-start md:self-center"
                  >
                    <span className="text-xs uppercase tracking-widest font-medium">
                      {expandedRound === idx ? 'Hide Scores' : 'View Scores'}
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
                      <div className="bg-sage-50/50 rounded-3xl p-6 md:p-8 border border-sage-100">
                        <h4 className="text-sm font-serif italic text-sage-400 mb-6 border-b border-sage-200 pb-2 inline-block">Individual Scores</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {record.attendees.sort((a, b) => a.score - b.score).map((attendee, i) => (
                            <motion.div
                              key={i}
                              layout
                              onClick={() => setExpandedMember(expandedMember === attendee.name ? null : attendee.name)}
                              className="bg-white px-5 py-4 rounded-xl border border-champagne-100 shadow-sm flex flex-col items-center justify-between cursor-pointer hover:shadow-md hover:border-sage-200 transition-all"
                            >
                              <div className="flex justify-between w-full items-center mb-1">
                                <span className="text-sm font-medium text-sage-600">{attendee.name}</span>
                                <span className="text-lg font-serif italic text-sage-500">{attendee.score}</span>
                              </div>

                              <AnimatePresence>
                                {expandedMember === attendee.name && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="w-full text-center bg-sage-50 rounded-lg py-2 border border-sage-100 overflow-hidden"
                                  >
                                    <div className="flex justify-center space-x-3 text-xs text-sage-500 font-mono">
                                      <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-tighter text-sage-400">Front</span>
                                        <span>{attendee.front}</span>
                                      </div>
                                      <div className="w-[1px] bg-sage-200 h-6"></div>
                                      <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-tighter text-sage-400">Back</span>
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
