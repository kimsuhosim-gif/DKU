
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
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

  // Scroll to top when view changes
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
    ease: [0.43, 0.13, 0.23, 0.96]
  };

  return (
    <PasswordGate>
      <div className="min-h-screen font-sans selection:bg-sage-200 selection:text-sage-600 bg-champagne-50">
        <Navbar isScrolled={isScrolled} setView={navigateTo} currentView={currentView} />

        <main className="pt-20">
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
                  <Hero />
                </section>

                <section id="content" className="max-w-7xl mx-auto px-6 py-20">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12"
                  >
                    <span className="text-sage-400 font-medium tracking-widest uppercase text-xs">Members Only</span>
                    <h2 className="text-4xl md:text-5xl font-serif mt-2 italic text-sage-600">Club Dashboard</h2>
                  </motion.div>

                  <BentoGrid onNavigate={navigateTo} />
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
      </div>
    </PasswordGate>
  );
};

export default App;
