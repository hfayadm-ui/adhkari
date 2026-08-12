'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrGroups, motivationalQuotes } from '@/lib/dhikr-data';
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Volume2, VolumeX, Home } from 'lucide-react';

export default function DhikrReadingScreen() {
  const {
    selectedPrayerIndex, currentDhikrIndex, currentCount,
    setCurrentCount, setCurrentDhikrIndex, setCurrentScreen,
    completePrayer, addTotalDhikr, setTreeLevel, setStreak,
    completedPrayers, soundEnabled, vibrationEnabled,
  } = useDhikrStore();

  const [tapScale, setTapScale] = useState(1);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showOpening, setShowOpening] = useState(true);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());

  const group = dhikrGroups[selectedPrayerIndex];
  const dhikrList = group.dhikrList;
  const currentDhikr = dhikrList[currentDhikrIndex];
  const totalDhikr = dhikrList.length;
  const progressPercentage = ((completedSet.size + (currentCount / currentDhikr.count)) / totalDhikr) * 100;

  // Audio context for tap sound
  const playTapSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      // ignore audio errors
    }
  }, [soundEnabled]);

  const handleTap = useCallback(() => {
    if (!currentDhikr) return;

    playTapSound();

    if (vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    setTapScale(0.9);
    setTimeout(() => setTapScale(1), 150);

    const newCount = currentCount + 1;

    if (newCount >= currentDhikr.count) {
      // Current dhikr completed
      const newCompletedSet = new Set(completedSet);
      newCompletedSet.add(currentDhikrIndex);
      setCompletedSet(newCompletedSet);
      addTotalDhikr(currentDhikr.count);

      if (currentDhikrIndex + 1 < totalDhikr) {
        // Show motivational quote between dhikr
        const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setCurrentQuote(quote);
        setShowMotivation(true);

        setTimeout(() => {
          setShowMotivation(false);
          setCurrentDhikrIndex(currentDhikrIndex + 1);
          setCurrentCount(0);
        }, 2500);
      } else {
        // All dhikr completed!
        const prayerId = group.prayerId;
        completePrayer(prayerId);

        const newCompleted = [...completedPrayers];
        if (!newCompleted.includes(prayerId)) {
          newCompleted.push(prayerId);
        }

        if (newCompleted.length >= 5) {
          const currentStreak = useDhikrStore.getState().streak;
          setStreak(currentStreak + 1);
        }

        const currentTree = useDhikrStore.getState().treeLevel;
        setTreeLevel(Math.min(currentTree + 1, 7));

        setTimeout(() => {
          setCurrentScreen('completion');
        }, 1000);
      }
    } else {
      setCurrentCount(newCount);
    }
  }, [currentDhikr, currentCount, currentDhikrIndex, totalDhikr, completedSet, soundEnabled, vibrationEnabled, playTapSound, setCurrentCount, setCurrentDhikrIndex, setCurrentScreen, addTotalDhikr, completePrayer, setTreeLevel, setStreak, completedPrayers, group.prayerId]);

  // Opening screen
  if (showOpening) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-4xl">🕌</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-100 mb-4" style={{ fontFamily: 'var(--font-arabic)' }}>
            {group.prayerName}
          </h2>
          <p className="text-emerald-200/80 text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--font-arabic)' }}>
            {group.openingMessage}
          </p>
          <p className="text-emerald-300/50 text-sm mb-8">
            {group.dhikrList.length} أذكار بانتظارك
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOpening(false)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            بسم الله ابدأ
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm">الرئيسية</span>
        </button>
        <h2 className="text-emerald-200 font-medium text-sm" style={{ fontFamily: 'var(--font-arabic)' }}>
          {group.prayerName}
        </h2>
        <button
          onClick={() => {
            const store = useDhikrStore.getState();
            store.toggleSound();
          }}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-500" />
          )}
        </button>
      </header>

      {/* Progress Bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-300/60 text-xs">
            {completedSet.size}/{totalDhikr} أذكار مكتملة
          </span>
          <span className="text-emerald-400 text-xs font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-emerald-900/30 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {/* Dhikr dots indicator */}
        <div className="flex gap-1.5 mt-3 justify-center">
          {dhikrList.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentDhikrIndex
                  ? 'bg-emerald-400 w-6'
                  : idx === currentDhikrIndex
                  ? 'bg-teal-400 w-4'
                  : 'bg-emerald-900/40 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Dhikr Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          {!showMotivation ? (
            <motion.div
              key={`dhikr-${currentDhikrIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-sm mx-auto text-center"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="text-emerald-400 text-xs">{currentDhikr.category}</span>
              </div>

              {/* Dhikr Text */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl" />
                <p
                  className="relative text-2xl font-bold text-white leading-loose py-6 px-4"
                  style={{ fontFamily: 'var(--font-arabic)' }}
                >
                  {currentDhikr.text}
                </p>
              </div>

              {/* Counter Display */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-teal-400">
                  {currentCount}
                </span>
                <div className="text-right">
                  <span className="text-2xl text-emerald-300/40">/</span>
                  <span className="text-2xl text-emerald-300/40">{currentDhikr.count}</span>
                </div>
              </div>

              {/* Tap Button */}
              <motion.button
                whileTap={{ scale: tapScale }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={handleTap}
                className="relative w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:shadow-emerald-500/50 transition-shadow active:shadow-emerald-500/20"
              >
                {/* Ripple effect rings */}
                <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-emerald-400/10 animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="relative text-center">
                  <span className="text-white text-4xl block">👆</span>
                  <span className="text-emerald-100/80 text-xs mt-1 block">اضغط للتسبيح</span>
                </div>
              </motion.button>

              {/* Skip button */}
              {currentCount > 0 && (
                <button
                  onClick={() => {
                    addTotalDhikr(currentDhikr.count - currentCount);
                    if (currentDhikrIndex + 1 < totalDhikr) {
                      setCurrentDhikrIndex(currentDhikrIndex + 1);
                      setCurrentCount(0);
                    }
                  }}
                  className="mt-6 text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center gap-1 mx-auto"
                >
                  تخطي <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="motivation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center max-w-sm mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
              >
                <span className="text-3xl">⭐</span>
              </motion.div>
              <p
                className="text-xl text-amber-200 leading-relaxed font-medium"
                style={{ fontFamily: 'var(--font-arabic)' }}
              >
                {currentQuote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
