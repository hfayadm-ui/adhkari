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
import RelaxationScreen from '@/components/dhikr/relaxation-screen';
import ChallengesScreen from '@/components/dhikr/challenges-screen';
import GardenScreen from '@/components/dhikr/garden-screen';
import BottomNav from '@/components/dhikr/bottom-nav';
import SplashScreen from '@/components/pwa/splash-screen';
import InstallPrompt from '@/components/pwa/install-prompt';
import { useSmartNotifications, checkStreakOnOpen } from '@/lib/smart-notifs';
import { useEffect, useState } from 'react';

function OfflineIndicator() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);
  if (!offline) return null;
  return (
    <div className='fixed top-0 left-0 right-0 z-[200] text-center py-1.5 text-xs font-medium app-text' style={{ background: 'var(--gold-glow)', borderBottom: '1px solid var(--gold-border)' }}>
      غير متصل
    </div>
  );
}

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
        const prevDate = new Date(last);
        const diff = Math.floor((new Date(today).getTime() - prevDate.getTime()) / 86400000);
        if (diff === 1) {
          // Consecutive day - streak handled in completion screen
        } else if (diff >= 2) {
          // Streak broken — handled by smart-notifs
        }
      }
    }
    // Init smart notifications & check streak
    checkStreakOnOpen();
    useSmartNotifications();
  }, []);

  const showNav = !noNavScreens.includes(currentScreen);

  return (
    <SplashScreen>
      <div className='max-w-md mx-auto min-h-screen relative' style={{ fontFamily: 'var(--font-arabic)' }}>
        <OfflineIndicator />
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
            {currentScreen === 'relaxation' && <RelaxationScreen />}
            {currentScreen === 'challenges' && <ChallengesScreen />}
            {currentScreen === 'garden' && <GardenScreen />}
          </motion.div>
        </AnimatePresence>
        {showNav && <BottomNav />}
        <InstallPrompt />
      </div>
    </SplashScreen>
  );
}