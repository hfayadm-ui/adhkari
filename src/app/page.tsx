'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import HomeScreen from '@/components/dhikr/home-screen';
import LibraryScreen from '@/components/dhikr/library-screen';
import CounterScreen from '@/components/dhikr/counter-screen';
import DhikrReadingScreen from '@/components/dhikr/reading-screen';
import CompletionScreen from '@/components/dhikr/completion-screen';
import StatsScreen from '@/components/dhikr/stats-screen';
import SettingsScreen from '@/components/dhikr/settings-screen';
import BottomNav from '@/components/dhikr/bottom-nav';
import { useEffect } from 'react';

const noNavScreens: Screen[] = ['reading', 'completion'];

export default function Home() {
  const { currentScreen } = useDhikrStore();

  useEffect(() => {
    // Reset daily if new day
    const last = localStorage.getItem('dz_lastDate');
    const today = new Date().toDateString();
    if (last !== today) {
      localStorage.setItem('dz_lastDate', today);
      if (last) {
        // Previous day existed - check if streak should increment
        const prevDate = new Date(last);
        const diff = Math.floor((new Date(today).getTime() - prevDate.getTime()) / 86400000);
        if (diff === 1) {
          // Consecutive day - streak handled in completion screen
        }
      }
    }
  }, []);

  const showNav = !noNavScreens.includes(currentScreen);

  return (
    <div className='max-w-md mx-auto min-h-screen relative' style={{ fontFamily: 'var(--font-arabic)' }}>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className='min-h-screen'
        >
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'library' && <LibraryScreen />}
          {currentScreen === 'counter' && <CounterScreen />}
          {currentScreen === 'reading' && <DhikrReadingScreen />}
          {currentScreen === 'completion' && <CompletionScreen />}
          {currentScreen === 'stats' && <StatsScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
        </motion.div>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
}