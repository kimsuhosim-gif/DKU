
import React from 'react';
// Fix: Added AnimatePresence to the imports from framer-motion
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
    { label: 'Home', view: 'home' },
    { label: 'Members', view: 'members' },
    { label: 'Ranking', view: 'ranking' },
    { label: 'Archive', view: 'gallery' },
    { label: 'Urban Map', view: 'map' },
    { label: 'Records', view: 'records' },
  ];

  const handleLinkClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${
        isScrolled || currentView !== 'home' ? 'bg-champagne-50/80 backdrop-blur-md shadow-sm border-b border-champagne-100/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={() => handleLinkClick('home')} className="flex flex-col text-left group">
          <span className="font-serif text-2xl tracking-tight text-sage-600 font-bold group-hover:text-sage-400 transition-colors italic">DKU-RE09</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-sage-400 -mt-1 font-bold">Golf Heritage</span>
        </button>
        
        <div className="hidden lg:flex items-center space-x-12 text-[11px] uppercase tracking-[0.2em] font-bold text-sage-600">
          {navLinks.map((link) => (
            <button 
              key={link.view}
              onClick={() => handleLinkClick(link.view)} 
              className={`relative hover:text-sage-400 transition-all pb-1 group/link ${
                currentView === link.view ? 'text-sage-400' : 'text-sage-600'
              }`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-sage-400 transition-all duration-300 ${
                currentView === link.view ? 'w-full' : 'w-0 group-hover/link:w-full'
              }`}></span>
            </button>
          ))}
        </div>

        <div className="lg:hidden">
          <button 
            className="text-sage-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-champagne-50 border-t border-champagne-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6 text-sm uppercase tracking-widest font-bold text-sage-600">
              {navLinks.map((link) => (
                <button 
                  key={link.view} 
                  onClick={() => handleLinkClick(link.view)}
                  className={`text-left ${currentView === link.view ? 'text-sage-400' : ''}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
