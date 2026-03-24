import React from 'react';
import { Camera, House, Map, Trophy, Users } from 'lucide-react';
import { ViewState } from '../App';

interface MobileDockProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const items: { label: string; view: ViewState; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: 'Home', view: 'home', icon: House },
  { label: 'Archive', view: 'gallery', icon: Camera },
  { label: 'Ranking', view: 'ranking', icon: Trophy },
  { label: 'Members', view: 'members', icon: Users },
  { label: 'Map', view: 'map', icon: Map },
];

const MobileDock: React.FC<MobileDockProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-[#fcfaf6]/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] pt-3 shadow-[0_-20px_45px_-35px_rgba(34,48,34,0.45)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2 rounded-[1.6rem] border border-[#e6ddd2] bg-white/75 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center gap-1 rounded-[1.1rem] px-2 py-2.5 transition ${
                active ? 'bg-[#2d382d] text-white' : 'text-[#5f6a5a]'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDock;
