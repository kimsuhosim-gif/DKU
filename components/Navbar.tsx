import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../App';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
  setView: (view: ViewState) => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, setView, currentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks: { label: string; view: ViewState }[] = [
    { label: '홈', view: 'home' },
    { label: '기록 보관소', view: 'gallery' },
    { label: '랭킹', view: 'ranking' },
    { label: '멤버', view: 'members' },
    { label: '지도', view: 'map' },
  ];

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
          ? 'border-b border-white/60 bg-[#f7f1e8]/84 shadow-[0_20px_45px_-35px_rgba(34,48,34,0.45)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <button onClick={() => handleLinkClick('home')} className="group flex flex-col text-left">
          <span className="font-serif text-xl italic tracking-tight text-[#2d382d] transition-colors group-hover:text-[#66785c] sm:text-2xl">
            DKU-RE09
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-slate-400 sm:text-[10px] sm:tracking-[0.28em]">
            Private golf club
          </span>
        </button>

        <div className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.18em] text-[#334034] lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleLinkClick(link.view)}
              className={`relative pb-2 transition-colors ${
                currentView === link.view ? 'text-[#66785c]' : 'text-[#334034] hover:text-[#66785c]'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-[#66785c] transition-all duration-300 ${
                  currentView === link.view ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <button
            onClick={() => handleLinkClick('records')}
            className="rounded-full border border-[#2d382d]/10 bg-white/72 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2d382d] backdrop-blur transition hover:border-[#2d382d]/24 hover:bg-white"
          >
            라운드 기록
          </button>
        </div>

        <div className="lg:hidden">
          <button
            className="rounded-full border border-[#2d382d]/10 bg-white/80 p-2 text-[#2d382d] backdrop-blur"
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
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-[#fcfaf6]/95 shadow-[0_24px_60px_-40px_rgba(34,48,34,0.45)] backdrop-blur-xl lg:hidden sm:mt-4 sm:rounded-[2rem]"
          >
            <div className="flex flex-col px-5 py-5 text-[13px] uppercase tracking-[0.12em] text-[#334034] sm:px-6 sm:py-6 sm:text-sm sm:tracking-[0.16em]">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`border-b border-[#2d382d]/6 py-4 text-left font-semibold last:border-b-0 ${
                    currentView === link.view ? 'text-[#66785c]' : ''
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleLinkClick('records')}
                className="mt-4 rounded-full bg-[#2d382d] px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                라운드 기록 보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
