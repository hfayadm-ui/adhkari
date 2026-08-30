'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { prayerDhikrGroups, getAdhkarByCategory, getCategoryName, motivationalQuotes, dhikrCategories } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Home, ChevronRight, Volume2, VolumeX, Info, Star, Sparkles, Heart, Share2 } from '@/components/dhikr/islamic-icons';
import { useState, useEffect } from 'react';
import { getFontClass } from '@/lib/font-utils';
import { shareAsImage } from '@/lib/share-card';

const categoryIconMap: Record<string, string> = {
  morning: 'sunrise', evening: 'sunset', sleep: 'moon', waking: 'sun',
  eating: 'utensils', travel: 'compass', misc: 'gem', prayer: 'mosque',
};

export default function ReadingScreen() {
  const {
    selectedPrayerIndex, selectedCategoryId, readingSource, selectedCustomDhikrId,
    currentDhikrIndex, currentCount, completedSet,
    setCurrentDhikrIndex, setCurrentCount, setCompletedSet, setCurrentScreen,
    completePrayer, addTodayRecord, setTreeLevel, setStreak, setTotalAllTime,
    completedPrayers, soundEnabled, vibrationEnabled, fontSize, themeColor, arabicFont,
    toggleFavorite, isFavorite, customDhikr,
  } = useDhikrStore();

  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showOpening, setShowOpening] = useState(true);
  const [showReference, setShowReference] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const handleShareDhikr = async () => {
    if (!currentDhikr) return;
    await shareAsImage({ text: currentDhikr.text, footer: currentDhikr.reference || currentDhikr.category, type: 'dhikr' });
  };

  const prayerGroup = readingSource === 'prayer' ? prayerDhikrGroups[selectedPrayerIndex] : null;
  const categoryDhikrList = readingSource === 'category' ? getAdhkarByCategory(selectedCategoryId) : [];
  const customItem = readingSource === 'custom' ? customDhikr.find(d => d.id === selectedCustomDhikrId) : null;
  const customDhikrList = customItem ? [{ text: customItem.text, count: customItem.count, category: 'مخصص', reference: '', benefit: '' }] : [];
  const dhikrList = readingSource === 'prayer' ? prayerGroup?.dhikrList ?? [] : readingSource === 'custom' ? customDhikrList : categoryDhikrList;
  const title = readingSource === 'prayer' ? prayerGroup?.prayerName ?? '' : readingSource === 'custom' ? (customItem?.text ?? '') : getCategoryName(selectedCategoryId);
  const openingMsg = readingSource === 'prayer'
    ? prayerGroup?.openingMessage ?? ''
    : readingSource === 'custom'
      ? 'بسم الله، ابدأ بتسبيح ذكرك المخصص'
      : `بسم الله، ابدأ بتلاوة أذكار ${getCategoryName(selectedCategoryId)}`;

  const currentDhikr = dhikrList[currentDhikrIndex];
  const totalDhikr = dhikrList.length;
  const progressPct = ((completedSet.length + (currentCount / (currentDhikr?.count || 1))) / totalDhikr) * 100;

  // Sync favorite state when dhikr changes
  useEffect(() => {
    const favStatus = currentDhikr ? isFavorite(currentDhikr.text) : false;
    setIsFav(favStatus);
  }, [currentDhikr, isFavorite]);

  const fontSizes = { small: 'text-lg', medium: 'text-2xl', large: 'text-3xl' };
  const fontClass = fontSizes[fontSize];
  const fontVar = getFontClass(arabicFont);
  const openingIcon = readingSource === 'prayer' ? 'mosque' : readingSource === 'custom' ? 'sparkles' : (categoryIconMap[selectedCategoryId] || 'mosque');

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
        if (readingSource === 'prayer' && prayerGroup) {
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

  if (showOpening) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center justify-center min-h-screen px-6 pb-24'>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className='text-center max-w-sm'>
          <div className='relative w-28 h-28 mx-auto mb-6'>
            <div className='absolute inset-0 rounded-full gold-glow' style={{ background: 'var(--gold-glow)' }} />
            <div className='absolute inset-0 rounded-full animate-pulse' style={{ background: 'var(--gold-glow)' }} />
            <div className='relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl gold-glow'
              style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.15)' }}>
              <IslamicIcon name={openingIcon} className='w-12 h-12 text-white' color='#ffffff' />
            </div>
          </div>
          <h2 className='text-2xl font-bold app-text mb-4' style={{ fontFamily: fontVar }}>{title}</h2>
          <p className='app-text-2 text-base leading-relaxed mb-3' style={{ fontFamily: fontVar }}>{openingMsg}</p>
          <p className='app-text-muted text-xs mb-8'>{dhikrList.length} أذكار بانتظارك</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowOpening(false)}
            className='btn-gold w-full py-4 rounded-xl text-lg'
            style={{ fontFamily: fontVar }}>
            بسم الله ابدأ
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen pb-24 relative'>
      {/* Top Bar */}
      <header className='glass-card flex items-center justify-between p-4 pb-3 rounded-b-2xl border-t-0 border-x-0'>
        <button onClick={() => setCurrentScreen('home')} className='flex items-center gap-1.5 app-text-2 hover:app-text transition-colors'>
          <Home className='w-5 h-5' /><span className='text-sm'>الرئيسية</span>
        </button>
        <h2 className='font-medium text-sm' style={{ fontFamily: fontVar, color: 'var(--gold-accent)' }}>{title}</h2>
        <button onClick={() => useDhikrStore.getState().toggleSound()} className='w-9 h-9 rounded-full glass-card flex items-center justify-center'>
          {soundEnabled ? <Volume2 className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> : <VolumeX className='w-4 h-4 app-text-muted' />}
        </button>
      </header>

      {/* Progress Bar */}
      <div className='px-4 mb-3'>
        <div className='flex items-center justify-between mb-1.5'>
          <span className='app-text-muted text-[11px]'>{completedSet.length}/{totalDhikr} أذكار مكتملة</span>
          <span className='text-[11px] font-medium' style={{ color: 'var(--gold-accent)' }}>{Math.round(progressPct)}%</span>
        </div>
        <div className='w-full rounded-full h-1.5 overflow-hidden relative' style={{ background: 'var(--app-ring-track)' }}>
          <motion.div className='h-1.5 rounded-full'
            style={{ background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }}
            initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
          <div className='absolute inset-0 islamic-shimmer rounded-full' />
        </div>
        <div className='flex gap-1 mt-2 justify-center'>
          {dhikrList.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300`} style={{
              background: idx < currentDhikrIndex ? 'var(--gold-accent)' : idx === currentDhikrIndex ? 'var(--gold-accent)' : 'var(--app-ring-track)',
              width: idx < currentDhikrIndex ? '20px' : idx === currentDhikrIndex ? '12px' : '6px',
              opacity: idx === currentDhikrIndex ? 0.6 : 1,
            }} />
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
                <span className='px-3 py-1 rounded-full glass-card text-xs' style={{ color: 'var(--gold-accent)' }} >{currentDhikr.category}</span>
                {currentDhikr.reference && (
                  <button onClick={() => setShowReference(!showReference)} className='w-7 h-7 rounded-full glass-card flex items-center justify-center'>
                    <Info className='w-3.5 h-3.5 app-text-2' />
                  </button>
                )}
                <button onClick={handleShareDhikr} className='w-7 h-7 rounded-full glass-card flex items-center justify-center' aria-label='مشاركة الذكر كصورة'>
                  <Share2 className='w-3.5 h-3.5 app-text-muted' />
                </button>
                <button onClick={() => { if (currentDhikr) { toggleFavorite(currentDhikr.text); setIsFav(!isFav); } }} className='w-7 h-7 rounded-full glass-card flex items-center justify-center' aria-label='إضافة للمفضلة'>
                  <Heart className='w-3.5 h-3.5' style={{ color: isFav ? '#ef4444' : undefined, fill: isFav ? '#ef4444' : 'none' }} />
                </button>
              </div>

              {/* Reference tooltip */}
              <AnimatePresence>
                {showReference && currentDhikr.reference && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className='app-text-muted text-xs mb-3 overflow-hidden'>{currentDhikr.reference}</motion.p>
                )}
              </AnimatePresence>

              {/* Benefit */}
              {currentDhikr.benefit && (
                <p className='app-text-2 text-xs mb-4 flex items-center gap-1.5 justify-center'>
                  <Sparkles className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} /> <span style={{ fontFamily: fontVar }}>{currentDhikr.benefit}</span>
                </p>
              )}

              {/* Dhikr Text with Islamic corners */}
              <div className='relative mb-8'>
                <div className='absolute inset-0 glass-card rounded-2xl' />
                {/* Corner ornaments */}
                <div className='absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl' style={{ borderColor: 'var(--gold-border)' }} />
                <div className='absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl' style={{ borderColor: 'var(--gold-border)' }} />
                <div className='absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl' style={{ borderColor: 'var(--gold-border)' }} />
                <div className='absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl' style={{ borderColor: 'var(--gold-border)' }} />
                <p className={`relative ${fontClass} font-bold app-text leading-loose py-6 px-4`} style={{ fontFamily: fontVar }}>{currentDhikr.text}</p>
              </div>

              {/* Counter */}
              <div className='flex items-center justify-center gap-5 mb-8'>
                <span className='text-5xl font-bold' style={{ color: 'var(--gold-accent)' }}>{currentCount}</span>
                <span className='text-2xl' style={{ color: 'var(--gold-border)' }}>/</span>
                <span className='text-2xl' style={{ color: 'var(--gold-border)' }}>{currentDhikr.count}</span>
              </div>

              {/* Tap Button */}
              <motion.button whileTap={{ scale: 0.92 }} onClick={handleTap}
                className='relative mx-auto rounded-full flex items-center justify-center gold-glow'
                style={{ width: '136px', height: '136px', background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className='absolute inset-0 rounded-full animate-ping' style={{ border: '1px solid var(--gold-border)' }} />
                <div className='absolute inset-2 rounded-full' style={{ border: '1px solid var(--gold-border)' }} />
                <div className='relative text-center'>
                  <IslamicIcon name='hand-tap' className='w-10 h-10 mx-auto' color='#ffffff' />
                  <span className='text-white/70 text-[10px] mt-1 block' style={{ fontFamily: fontVar }}>اضغط للتسبيح</span>
                </div>
              </motion.button>

              {/* Skip */}
              {currentCount > 0 && (
                <button onClick={() => {
                  if (currentDhikrIndex + 1 < totalDhikr) { setCurrentDhikrIndex(currentDhikrIndex + 1); setCurrentCount(0); }
                }} className='mt-10 app-text-muted text-xs hover:app-text-2 transition-colors flex items-center gap-1 mx-auto glass-card py-2 px-5 rounded-full'>
                  <span style={{ fontFamily: fontVar }}>تخطي</span> <ChevronRight className='w-3 h-3' />
                </button>
              )}
            </motion.div>
          ) : showMotivation ? (
            <motion.div key='motiv' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className='text-center max-w-sm mx-auto'>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }}
                className='w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center gold-glow'
                style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Star className='w-8 h-8 text-white' />
              </motion.div>
              <p className='text-lg app-text leading-relaxed font-medium' style={{ fontFamily: fontVar }}>{currentQuote}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
