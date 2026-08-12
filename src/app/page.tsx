'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import MainScreen from '@/components/dhikr/main-screen';
import DhikrReadingScreen from '@/components/dhikr/reading-screen';
import CompletionScreen from '@/components/dhikr/completion-screen';
import StatsScreen from '@/components/dhikr/stats-screen';
import SettingsScreen from '@/components/dhikr/settings-screen';
import { useEffect } from 'react';

export default function Home() {
  const { currentScreen, setCurrentScreen, completedPrayers, streak, setStreak } = useDhikrStore();

  // Initialize store from localStorage on mount
  useEffect(() => {
    // Check if it's a new day - reset daily progress if needed
    const lastDate = localStorage.getItem('lastDhikrDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      localStorage.setItem('lastDhikrDate', today);
      // Don't auto-reset, let the user decide
    }
  }, []);

  const screenVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative" style={{ fontFamily: 'var(--font-arabic)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {currentScreen === 'home' && <MainScreen />}
          {currentScreen === 'reading' && <DhikrReadingScreen />}
          {currentScreen === 'completion' && <CompletionScreen />}
          {currentScreen === 'stats' && <StatsScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
