import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { UniflowMegaFooter } from './components/UniflowMegaFooter';
import { PersonalCommandDeck } from './components/PersonalCommandDeck';
import { NoticeSynthesizer } from './components/NoticeSynthesizer';
import { DynamicPlanner } from './components/DynamicPlanner';
import { CampusDiscovery } from './components/CampusDiscovery';
import { Spatial3DStudio } from './components/Spatial3DStudio';
import { VadimCarazanExperience } from './components/VadimCarazanExperience';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, themeConfig, experienceMode } = useTheme();

  // Instantly reset scroll to top so the next tab loads from the starting position
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Global Keyboard Shortcuts (1-5 / ⌘1-⌘5) for seamless judging presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      const tabMap: Record<string, 'command' | 'synthesizer' | 'planner' | 'spatial' | 'campus'> = {
        '1': 'command',
        '2': 'synthesizer',
        '3': 'planner',
        '4': 'spatial',
        '5': 'campus',
      };

      if (tabMap[e.key]) {
        sound.playClick(1150);
        setActiveTab(tabMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  if (experienceMode === 'vadim') {
    return <VadimCarazanExperience />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-inter-tight flex flex-col relative selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden">
      
      {/* Dynamic ambient lighting mesh in background */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${themeConfig.primary} 0%, rgba(99,102,241,0.2) 50%, transparent 80%)`,
        }}
      />
      
      {/* Background Subtle Hairline Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40" />

      {/* Top Navigation Bar: Fixed at top of viewport so it stays in position when scrolling down */}
      <Navbar variant="light" />

      {/* Main Container */}
      <main 
        id="command-content" 
        className={
          activeTab === 'command'
            ? "flex-1 w-full relative z-10 p-0 m-0"
            : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 relative z-10 min-h-[70vh]"
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            onAnimationStart={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ 
              opacity: 0, 
              y: -10, 
              filter: 'blur(4px)',
              transition: { duration: 0.12, ease: 'easeOut' }
            }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1], // Apple VisionOS luxury spring curve
            }}
            className="w-full"
          >
            {activeTab === 'command' && <PersonalCommandDeck />}
            {activeTab === 'synthesizer' && <NoticeSynthesizer />}
            {activeTab === 'planner' && <DynamicPlanner />}
            {activeTab === 'spatial' && <Spatial3DStudio />}
            {activeTab === 'campus' && <CampusDiscovery />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Signature Multi-Column Zomato-Style Mega Footer */}
      <UniflowMegaFooter />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
