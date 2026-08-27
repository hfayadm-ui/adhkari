'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { prayerDhikrGroups, getAdhkarByCategory, getCategoryName, motivationalQuotes } from '@/lib/dhikr-data';
import { useState } from 'react';
import { ChevronRight, Volume2, VolumeX, Home, Share2, Bookmark, Info } from 'lucide-react';

export default function ReadingScreen() {
  const {
    selectedPrayerIndex, selectedCategoryId, readingSource,
    currentDhikrIndex, currentCount, completedSet,
    setCurrentDhikrIndex, setCurrentCount, setCompletedSet, setCurrentScreen,
    completePrayer, addTodayRecord, setTreeLevel, setStreak, setTotalAllTime,
    completedPrayers, soundEnabled, vibrationEnabled, fontSize, themeColor,
  } = useDhikrStore();

  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showOpening, setShowOpening] = useState(true);
  const [showReference, setShowReference] = useState(false);

  // Build dhikr list based on source
  const prayerGroup = readingSource === 'prayer' ? prayerDhikrGroups[selectedPrayerIndex] : null;
  const categoryDhikrList = readingSource === 'category' ? getAdhkarByCategory(selectedCategoryId) : [];
  const dhikrList = readingSource === 'prayer' ? prayerGroup.dhikrList : categoryDhikrList;
  const title = readingSource === 'prayer' ? prayerGroup.prayerName : getCategoryName(selectedCategoryId);
  const openingMsg = readingSource === 'prayer'
    ? prayerGroup.openingMessage
    : `بسم الله، ابدأ بتلاوة أذكار ${getCategoryName(selectedCategoryId)}`;
  const closingMsg = readingSource === 'prayer'
    ? prayerGroup.closingMessage
    : 'بارك الله فيك.. وأتم الله أجرك';

  const currentDhikr = dhikrList[currentDhikrIndex];
  const totalDhikr = dhikrList.length;
  const progressPct = ((completedSet.length + (currentCount / (currentDhikr?.count || 1))) / totalDhikr) * 100;

  const fontSizes = { small: 'text-lg', medium: 'text-2xl', large: 'text-3xl' };
  const fontClass = fontSizes[fontSize];

  function playTap() {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
    } catch { /* */ }
  }

  function handleTap() {
    if (!currentDhikr) return;
    playTap();
    if (vibrationEnabled && 'vibrate' in navigator) navigator.vibrate(25);

    const newCount = currentCount + 1;
    if (newCount >= currentDhikr.count) {
      const newSet = [...completedSet, currentDhikrIndex];
      setCompletedSet(newSet);
      setTotalAllTime((useDhikrStore.getState().totalAllTime || 0) + currentDhikr.count);

      if (currentDhikrIndex + 1 < totalDhikr) {
        const q = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setCurrentQuote(q);
        setShowMotivation(true);
        setTimeout(() => {
          setShowMotivation(false);
          setCurrentDhikrIndex(currentDhikrIndex + 1);
          setCurrentCount(0);
        }, 2200);
      } else {
        // All done
        if (readingSource === 'prayer') {
          const pid = prayerGroup.prayerId;
          completePrayer(pid);
          if (completedPrayers.filter(p => !completedPrayers.includes(p)).length <= 1 || [...completedPrayers, pid].length >= 5) {
            setStreak(useDhikrStore.getState().streak + 1);
          }
        }
        setTreeLevel(Math.min(useDhikrStore.getState().treeLevel + 1, 7));
        addTodayRecord();
        setTimeout(() => setCurrentScreen('completion'), 800);
      }
    } else {
      setCurrentCount(newCount);
    }
  }

  // Opening screen
  if (showOpening) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center justify-center min-h-screen px-6 pb-24'>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className='text-center max-w-sm'>
          <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20'>
            <span className='text-4xl'>🕌</span>
          </div>
          <h2 className='text-2xl font-bold text-white mb-4' style={{ fontFamily: 'var(--font-arabic)' }}>{title}</h2>
          <p className='text-emerald-200/70 text-base leading-relaxed mb-3' style={{ fontFamily: 'var(--font-arabic)' }}>{openingMsg}</p>
          <p className='text-slate-400 text-xs mb-8'>{dhikrList.length} أذكار بانتظارك</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowOpening(false)}
            className='w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25'
            style={{ fontFamily: 'var(--font-arabic)' }}>
            بسم الله ابدأ
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen pb-24 relative'>
      {/* Top Bar */}
      <header className='flex items-center justify-between p-4 pb-2'>
        <button onClick={() => setCurrentScreen('home')} className='flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors'>
          <Home className='w-5 h-5' /><span className='text-sm'>الرئيسية</span>
        </button>
        <h2 className='text-emerald-200 font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>{title}</h2>
        <button onClick={() => useDhikrStore.getState().toggleSound()} className='w-9 h-9 rounded-full bg-white/5 flex items-center justify-center'>
          {soundEnabled ? <Volume2 className='w-4 h-4 text-emerald-400' /> : <VolumeX className='w-4 h-4 text-slate-500' />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className='px-4 mb-3'>
        <div className='flex items-center justify-between mb-1.5'>
          <span className='text-emerald-300/50 text-[11px]'>{completedSet.length}/{totalDhikr} أذكار مكتملة</span>
          <span className='text-emerald-400 text-[11px] font-medium'>{Math.round(progressPct)}%</span>
        </div>
        <div className='w-full bg-white/5 rounded-full h-1.5 overflow-hidden'>
          <motion.div className='bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full'
            initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
        </div>
        <div className='flex gap-1 mt-2 justify-center'>
          {dhikrList.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx < currentDhikrIndex ? 'bg-emerald-400 w-5' : idx === currentDhikrIndex ? 'bg-teal-400 w-3' : 'bg-white/5 w-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Main Area */}
      <main className='flex-1 flex flex-col items-center justify-center px-6 pb-8'>
        <AnimatePresence mode='wait'>
          {!showMotivation && currentDhikr ? (
            <motion.div key={`d-${currentDhikrIndex}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className='w-full max-w-sm mx-auto text-center'>
              {/* Category + actions */}
              <div className='flex items-center justify-center gap-3 mb-5'>
                <span className='px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs'>{currentDhikr.category}</span>
                {currentDhikr.reference && (
                  <button onClick={() => setShowReference(!showReference)} className='w-7 h-7 rounded-full bg-white/5 flex items-center justify-center'>
                    <Info className='w-3.5 h-3.5 text-slate-400' />
                  </button>
                )}
                <button className='w-7 h-7 rounded-full bg-white/5 flex items-center justify-center'>
                  <Bookmark className='w-3.5 h-3.5 text-slate-400' />
                </button>
              </div>

              {/* Reference tooltip */}
              <AnimatePresence>
                {showReference && currentDhikr.reference && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className='text-emerald-300/50 text-xs mb-3 overflow-hidden'>{currentDhikr.reference}</motion.p>
                )}
              </AnimatePresence>

              {/* Benefit */}
              {currentDhikr.benefit && (
                <p className='text-amber-300/60 text-xs mb-4 flex items-center gap-1 justify-center'>
                  <span>✨</span> {currentDhikr.benefit}
                </p>
              )}

              {/* Dhikr Text */}
              <div className='relative mb-8'>
                <div className='absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl' />
                <p className={`relative ${fontClass} font-bold text-white leading-loose py-6 px-4`} style={{ fontFamily: 'var(--font-arabic)' }}>{currentDhikr.text}</p>
              </div>

              {/* Counter */}
              <div className='flex items-center justify-center gap-5 mb-8'>
                <span className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-teal-400'>{currentCount}</span>
                <span className='text-2xl text-emerald-300/30'>/</span>
                <span className='text-2xl text-emerald-300/30'>{currentDhikr.count}</span>
              </div>

              {/* Tap Button */}
              <motion.button whileTap={{ scale: 0.92 }} onClick={handleTap}
                className='relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 flex items-center justify-center'>
                <div className='absolute inset-0 rounded-full border border-emerald-400/20 animate-ping' />
                <div className='relative text-center'>
                  <span className='text-white text-3xl block'>🤚</span>
                  <span className='text-emerald-100/70 text-[10px] mt-0.5 block'>اضغط للتسبيح</span>
                </div>
              </motion.button>

              {/* Skip */}
              {currentCount > 0 && (
                <button onClick={() => {
                  if (currentDhikrIndex + 1 < totalDhikr) { setCurrentDhikrIndex(currentDhikrIndex + 1); setCurrentCount(0); }
                }} className='mt-5 text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center gap-1 mx-auto'>
                  تخطي <ChevronRight className='w-3 h-3' />
                </button>
              )}
            </motion.div>
          ) : showMotivation ? (
            <motion.div key='motiv' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className='text-center max-w-sm mx-auto'>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }}
                className='w-14 h-14 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg'>
                <span className='text-2xl'>⭐</span>
              </motion.div>
              <p className='text-lg text-amber-200 leading-relaxed font-medium' style={{ fontFamily: 'var(--font-arabic)' }}>{currentQuote}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}