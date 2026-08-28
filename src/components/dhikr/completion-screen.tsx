'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import { prayerDhikrGroups, getAdhkarByCategory, getCategoryName, treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Home, Share2, RotateCcw, Trophy, Star, Copy, Heart, Flame } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)', 'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)', 'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)', 'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function CompletionScreen() {
  const { selectedPrayerIndex, selectedCategoryId, readingSource, setCurrentScreen, streak, treeLevel, totalAllTime, completedPrayers, arabicFont } = useDhikrStore();
  const [copied, setCopied] = useState(false);

  const group = readingSource === 'prayer' ? prayerDhikrGroups[selectedPrayerIndex] : null;
  const title = readingSource === 'prayer' ? group.prayerName : getCategoryName(selectedCategoryId);
  const closingMsg = readingSource === 'prayer' ? group.closingMessage : 'بارك الله فيك.. وأتم الله أجرك';

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
          <motion.div key={i} className='absolute w-1.5 h-1.5 rounded-full bg-amber-400/20'
            initial={{ x: `${10 + Math.random() * 80}%`, y: '110%', scale: 0 }}
            animate={{ y: '-5%', scale: [0, 1, 0.5, 0], opacity: [0, 0.8, 0.4, 0] }}
            transition={{ duration: 3 + Math.random() * 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </div>

      <main className='flex-1 flex flex-col items-center justify-center px-6 relative z-10'>
        {/* Main Icon */}
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className='relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/30 gold-glow'>
          <Heart className='w-10 h-10 app-text' />
          <div className='absolute inset-0 rounded-full border border-amber-300/30 animate-pulse' />
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className='text-2xl font-bold app-text mb-3 text-center' style={{ fontFamily: fontVar }}>
          {allDone ? (
            <span className='flex items-center justify-center gap-2'>
              <Star className='w-5 h-5 text-amber-300' />
              أحسنت! أتممت أذكار اليوم كاملاً
              <Star className='w-5 h-5 text-amber-300' />
            </span>
          ) : 'بارك الله فيك'}
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className='w-full max-w-xs mb-2'>
          <div className='h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent' />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className='text-emerald-200/70 text-base text-center leading-relaxed mb-6 max-w-sm' style={{ fontFamily: fontVar }}>
          {closingMsg}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className='w-full max-w-xs mb-6'>
          <div className='h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent' />
        </motion.div>

        {/* Stats Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className='w-full max-w-sm space-y-2 mb-6'>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Trophy className='w-4 h-4 text-amber-400' />
              <span className='text-slate-200 text-sm' style={{ fontFamily: fontVar }}>أذكار اليوم</span>
            </div>
            <span className='text-amber-300 font-bold'>{completedPrayers.length}/5</span>
          </div>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Flame className='w-4 h-4 text-amber-400' />
              <span className='text-slate-200 text-sm' style={{ fontFamily: fontVar }}>السلسلة</span>
            </div>
            <span className='text-amber-300 font-bold flex items-center gap-1'>{streak} يوم <Flame className='w-3 h-3' /></span>
          </div>
          <div className='glass-card rounded-xl p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <IslamicIcon name={treeIcons[Math.min(treeLevel, 6)]} className='w-5 h-5 text-green-400' />
              <span className='text-slate-200 text-sm' style={{ fontFamily: fontVar }}>الشجرة</span>
            </div>
            <span className='text-green-300 font-bold'>المستوى {treeLevel} - {treeNames[Math.min(treeLevel, 6)]}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className='w-full max-w-sm space-y-2.5'>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentScreen('home')}
            className='w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 app-text font-bold text-base shadow-lg shadow-emerald-500/25'
            style={{ fontFamily: fontVar }}>العودة للرئيسية</motion.button>
          <div className='grid grid-cols-3 gap-2'>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentScreen('reading')}
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
