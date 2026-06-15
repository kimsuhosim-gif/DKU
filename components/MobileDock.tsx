import React from 'react';
import { Crown, FolderOpen, House, Landmark, Map as MapIcon, Sparkles, Users } from 'lucide-react';
import { ViewState } from '../App';

interface MobileDockProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const items: { label: string; view: ViewState; icon: React.ComponentType<{ size?: number }> }[] = [
  { label: '홈', view: 'home', icon: House },
  { label: '회비', view: 'ledger', icon: Landmark },
  { label: '도구', view: 'tools', icon: Sparkles },
  { label: '기록', view: 'gallery', icon: FolderOpen },
  { label: '랭킹', view: 'ranking', icon: Crown },
  { label: '멤버', view: 'members', icon: Users },
  { label: '지도', view: 'map', icon: MapIcon },
];

const MobileDock: React.FC<MobileDockProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#16171b]/8 bg-[#fbfaf7]/94 px-3 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] pt-3 shadow-[0_-20px_48px_-38px_rgba(22,23,27,0.36)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-7 gap-1 rounded-[1.1rem] border border-[#c8a86b]/28 bg-white/72 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[0.9rem] px-1 py-2.5 transition ${
                active ? 'bg-[#6d1f2a] text-[#fbfaf7]' : 'text-[#4f4b47]'
              }`}
            >
              <Icon size={16} />
              <span className="max-w-full truncate text-[9px] font-bold tracking-normal">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDock;
