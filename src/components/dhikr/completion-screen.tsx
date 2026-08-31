'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { prayerDhikrGroups, getAdhkarByCategory, getCategoryName, treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Home, Share2, RotateCcw, Trophy, Star, Copy, Heart, Flame } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';

import { getFontClass } from '@/lib/font-utils';

export default function CompletionScreen() {
  const { selectedPrayerIndex, selectedCategoryId, readingSource, setCurrentScreen, setCurrentDhikrIndex, setCurrentCount, setCompletedSet, streak, treeLevel, totalAllTime, completedPrayers, arabicFont } = useDhikrStore();
  const [copied, setCopied] = useState(false);

  const group = readingSource === 'prayer' ? prayerDhikrGroups[selectedPrayerIndex] : null;
  const title = readingSource === 'prayer' ? group?.prayerName ?? '' : getCategoryName(selectedCategoryId);
  const closingMsg = readingSource === 'prayer' ? group?.closingMessage ?? '' : 'بارك الله فيك.. وأتم الله أجرك';

  const allDone = completedPrayers.length >= 5;
  const fontVar = getFontClass(arabicFont);

  const shareText = `أتممت ${title} اليوم
السلسلة: ${streak} أيام متتالية
إجمالي الأذكار: ${totalAllTime}

تطبيق أذكاري`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className='flex flex-col min-h-screen pb-24 relative overflow-hidden'>
      {/* Gold Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className='absolute w-1.5 h-1.5 rounded-full'
            style={{ background: 'var(--gold-glow)' }}
            initial={{ x: `${10 + Math.random() * 80}%`, y: '110%', scale: 0 }}
            animate={{ y: '-5%', scale: [0, 1, 0.5, 0], opacity: [0, 0.6, 0.3, 0] }}
            transition={{ duration: 3 + Math.random() * 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </div>

      <main className='flex-1 flex flex-col items-center justify-center px-6 relative z-10'>
        {/* Main Icon */}
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className='relative w-20 h-20 rounded-full flex items-center justify-center mb-6 gold-glow'
          style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Heart className='w-10 h-10 text-white' />
          <div className='absolute inset-0 rounded-full animate-pulse' style={{ border: '1px solid var(--gold-border)' }} />
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className='text-2xl font-bold app-text mb-3 text-center' style={{ fontFamily: fontVar }}>
          {allDone ? (
            <span className='flex items-center justify-center gap-2'>
              <Star className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
              أحسنت! أتممت أذكار اليوم كاملاً
              <Star className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
            </span>
          ) : 'بارك الله فيك'}
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className='w-full max-w-xs mb-2'>
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className='app-text-2 text-base text-center leading-relaxed mb-6 max-w-sm' style={{ fontFamily: fontVar }}>
          {closingMsg}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className='w-full max-w-xs mb-6'>
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />
        </motion.div>

        {/* Stats Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className='w-full max-w-sm space-y-2 mb-6'>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Trophy className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
              <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>أذكار اليوم</span>
            </div>
            <span className='font-bold' style={{ color: 'var(--gold-accent)' }}>{completedPrayers.length}/5</span>
          </div>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
              <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>السلسلة</span>
            </div>
            <span className='font-bold flex items-center gap-1' style={{ color: 'var(--gold-accent)' }}>{streak} يوم <Flame className='w-3 h-3' /></span>
          </div>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <IslamicIcon name={treeIcons[Math.min(treeLevel, 6)]} className='w-5 h-5 text-emerald-500' />
              <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>الشجرة</span>
            </div>
            <span className='text-emerald-500 font-bold'>المستوى {treeLevel} - {treeNames[Math.min(treeLevel, 6)]}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className='w-full max-w-sm space-y-2.5'>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentScreen('home')}
            className='btn-gold w-full py-3.5 rounded-xl text-base'
            style={{ fontFamily: fontVar }}>العودة للرئيسية</motion.button>
          <div className='grid grid-cols-3 gap-2'>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
              setCurrentDhikrIndex(0);
              setCurrentCount(0);
              setCompletedSet([]);
              setCurrentScreen('reading');
            }}
              className='glass-card py-3 rounded-xl app-text text-xs app-surface-h transition-colors'>
              <span className='flex flex-col items-center gap-1'><RotateCcw className='w-4 h-4' /><span style={{ fontFamily: fontVar }}>إعادة</span></span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy}
              className='glass-card py-3 rounded-xl app-text text-xs app-surface-h transition-colors'>
              <span className='flex flex-col items-center gap-1'><Copy className='w-4 h-4' />{copied ? 'تم!' : 'نسخ'}</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
              if ('share' in navigator) (navigator as unknown as { share: (d: { title: string; text: string }) => Promise<void> }).share({ title: 'أذكاري', text: shareText }).catch(() => {});
            }} className='glass-card py-3 rounded-xl app-text text-xs app-surface-h transition-colors'>
              <span className='flex flex-col items-center gap-1'><Share2 className='w-4 h-4' /><span style={{ fontFamily: fontVar }}>مشاركة</span></span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
