import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../App';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
  setView: (view: ViewState) => void;
  currentView: ViewState;
}

const navLinks: { label: string; view: ViewState }[] = [
  { label: '홈', view: 'home' },
  { label: '내기 계산기', view: 'bets' },
  { label: '라운드 도구', view: 'tools' },
  { label: '기록 보관함', view: 'gallery' },
  { label: '랭킹', view: 'ranking' },
  { label: '멤버', view: 'members' },
  { label: '지도', view: 'map' },
];

const Navbar: React.FC<NavbarProps> = ({ isScrolled, setView, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isHeroChrome = !isScrolled && currentView === 'home';

  const handleLinkClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 transition-all duration-500 sm:px-6 sm:py-4 ${
        isScrolled || currentView !== 'home'
          ? 'border-b border-[#16171b]/8 bg-[#fbfaf7]/88 shadow-[0_22px_56px_-42px_rgba(22,23,27,0.36)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button onClick={() => handleLinkClick('home')} className="group flex flex-col text-left">
          <span
            className={`font-serif text-xl italic tracking-normal transition-colors sm:text-2xl ${
              isHeroChrome ? 'text-[#16171b] group-hover:text-[#6d1f2a]' : 'text-[#16171b] group-hover:text-[#6d1f2a]'
            }`}
          >
            DKU-RE09
          </span>
          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#6e665a] sm:text-[10px] sm:tracking-[0.28em]">
            Private golf club
          </span>
        </button>

        <div className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f4b47] lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleLinkClick(link.view)}
              className={`relative pb-2 transition-colors ${
                currentView === link.view ? 'text-[#6d1f2a]' : 'hover:text-[#16171b]'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#6d1f2a] transition-all duration-300 ${
                  currentView === link.view ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <button
            onClick={() => handleLinkClick('tools')}
            className="rounded-full border border-[#c8a86b]/34 bg-white/58 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#16171b] shadow-[0_14px_40px_-34px_rgba(22,23,27,0.34)] backdrop-blur transition hover:border-[#6d1f2a]/32 hover:bg-white/82"
          >
            라운드 도구
          </button>
        </div>

        <div className="lg:hidden">
          <button
            className="rounded-full border border-[#c8a86b]/34 bg-white/66 p-2 text-[#16171b] shadow-[0_12px_32px_-28px_rgba(22,23,27,0.38)] backdrop-blur"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[1.1rem] border border-[#c8a86b]/26 bg-[#fbfaf7]/96 shadow-[0_24px_64px_-46px_rgba(22,23,27,0.4)] backdrop-blur-xl lg:hidden sm:mt-4"
          >
            <div className="flex flex-col px-5 py-5 text-[13px] uppercase tracking-[0.12em] text-[#4f4b47] sm:px-6 sm:py-6 sm:text-sm sm:tracking-[0.16em]">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`border-b border-[#16171b]/8 py-4 text-left font-bold last:border-b-0 ${
                    currentView === link.view ? 'text-[#6d1f2a]' : ''
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleLinkClick('tools')}
                className="mt-4 rounded-full bg-[#16171b] px-5 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbfaf7]"
              >
                라운드 도구 열기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
