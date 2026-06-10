import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClubBrief from './components/ClubBrief';
import MoneyGameSection from './components/MoneyGameSection';
import RoundToolsSection from './components/RoundToolsSection';
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
import NewArchiveSite from './components/NewArchiveSite';

export type ViewState = 'home' | 'members' | 'records' | 'ledger' | 'weather' | 'map' | 'ranking' | 'gallery' | 'bets' | 'tools';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [hashRoute, setHashRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setHashRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
      {hashRoute === '#/new-archive' ? (
        <NewArchiveSite />
      ) : (
      <div className="min-h-screen bg-[#f6f2eb] font-sans selection:bg-champagne-200 selection:text-[#16171b]">
        <Navbar isScrolled={isScrolled} setView={navigateTo} currentView={currentView} />

        <main className={currentView === 'home' ? 'pb-28 sm:pb-0' : 'pb-28 pt-16 sm:pb-0 sm:pt-20'}>
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

                <section id="content" className="bg-[linear-gradient(180deg,#e4e9e8_0%,#f6f2eb_7rem,#eef1f1_100%)] px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
                  <div className="mx-auto max-w-7xl">
                    <ClubBrief onNavigate={navigateTo} />
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
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
                className="min-h-screen bg-[#f6f2eb]"
              >
                <GallerySection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'bets' && (
              <motion.section
                key="bets"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-[#f6f2eb]"
              >
                <MoneyGameSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}

            {currentView === 'tools' && (
              <motion.section
                key="tools"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="min-h-screen bg-[#f6f2eb]"
              >
                <RoundToolsSection onBack={() => navigateTo('home')} />
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <Footer />
        <MobileDock currentView={currentView} onNavigate={navigateTo} />
      </div>
      )}
    </PasswordGate>
  );
};

export default App;
