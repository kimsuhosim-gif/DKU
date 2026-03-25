import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import MobileDock from './components/MobileDock';
import Footer from './components/Footer';
import MemberSection from './components/MemberSection';
import RecordsSection from './components/RecordsSection';
import LedgerSection from './components/LedgerSection';
import WeatherSection from './components/WeatherSection';
import MapSection from './components/MapSection';
import RankingSection from './components/RankingSection';
import GallerySection from './components/GallerySection';
import PasswordGate from './components/PasswordGate';

export type ViewState = 'home' | 'members' | 'records' | 'ledger' | 'weather' | 'map' | 'ranking' | 'gallery';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <PasswordGate>
      <div className="min-h-screen bg-champagne-50 font-sans selection:bg-sage-200 selection:text-sage-600">
        <Navbar isScrolled={isScrolled} setView={navigateTo} currentView={currentView} />

        <main className="pb-28 pt-16 sm:pb-0 sm:pt-20">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <section id="hero">
                  <Hero onNavigate={navigateTo} />
                </section>

                <section id="content" className="bg-[#f3ede3] px-4 py-10 sm:px-6 sm:py-16">
                  <div className="mx-auto max-w-7xl">
                    <BentoGrid onNavigate={navigateTo} />
                  </div>
                </section>
              </motion.div>
            )}

            {currentView === 'members' && (
              <motion.section
                key="members"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-white"
              >
                <MemberSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'records' && (
              <motion.section
                key="records"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-champagne-50"
              >
                <RecordsSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'ledger' && (
              <motion.section
                key="ledger"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-white"
              >
                <LedgerSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'weather' && (
              <motion.section
                key="weather"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-champagne-50"
              >
                <WeatherSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'map' && (
              <motion.section
                key="map"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-white"
              >
                <MapSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'ranking' && (
              <motion.section
                key="ranking"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-champagne-50"
              >
                <RankingSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'gallery' && (
              <motion.section
                key="gallery"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-champagne-50"
              >
                <GallerySection onBack={() => navigateTo('home')} />
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <Footer />
        <MobileDock currentView={currentView} onNavigate={navigateTo} />
      </div>
    </PasswordGate>
  );
};

export default App;
