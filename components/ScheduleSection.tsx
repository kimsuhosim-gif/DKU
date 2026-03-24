
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, ArrowLeft } from 'lucide-react';

interface ScheduleSectionProps {
  onBack: () => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onBack }) => {
  const plans = [
    { month: 'APR', day: '19', title: 'Spring Opening Round', loc: 'South Springs CC', status: 'Planning' },
    { month: 'JUN', day: '15', title: 'Early Summer Match', loc: 'Rexfield CC', status: 'Upcoming' },
    { month: 'SEP', day: '21', title: 'Autumn Championship', loc: 'Trinity Club', status: 'Save the date' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-sage-400 hover:text-sage-600 transition-colors text-xs uppercase tracking-widest font-medium mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="mb-16">
        <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">The Plan</span>
        <h2 className="text-5xl font-serif mt-4 italic text-sage-600">Future Schedule</h2>
      </div>

      <div className="relative">
        <div className="absolute left-[3.2rem] top-0 bottom-0 w-[1px] bg-sage-200 hidden md:block"></div>
        
        <div className="space-y-12">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-8 relative"
            >
              <div className="flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-sm border border-champagne-100 shrink-0 z-10">
                <span className="text-xs font-bold text-sage-400 tracking-widest">{plan.month}</span>
                <span className="text-4xl font-serif italic text-sage-600 leading-none">{plan.day}</span>
              </div>

              <div className="flex-grow pt-2">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-serif text-sage-600">{plan.title}</h4>
                      <div className="flex items-center space-x-2 text-sage-400 text-sm mt-2">
                        <MapPin size={14} />
                        <span>{plan.loc}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <span className={`px-4 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${idx === 0 ? 'bg-sage-400 text-white' : 'bg-white text-sage-400 border border-sage-100'}`}>
                          {plan.status}
                       </span>
                       <button className="p-2 rounded-full border border-sage-100 text-sage-400 hover:bg-white transition-colors">
                          <CalendarDays size={18} />
                       </button>
                    </div>
                 </div>
                 <p className="mt-4 text-sm text-sage-400 max-w-2xl leading-relaxed">
                   Final tee times, pairings, and fee details will be shared through the members channel one week before the round.
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
