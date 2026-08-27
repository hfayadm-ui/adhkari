'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { prayerDhikrGroups, getAdhkarByCategory, getCategoryName, motivationalQuotes } from '@/lib/dhikr-data';
import { Home, Share2, RotateCcw, Trophy, Star, TreePine, Copy } from 'lucide-react';
import { useState } from 'react';

export default function CompletionScreen() {
  const { selectedPrayerIndex, selectedCategoryId, readingSource, setCurrentScreen, streak, treeLevel, totalAllTime, completedPrayers } = useDhikrStore();
  const [copied, setCopied] = useState(false);

  const group = readingSource === 'prayer' ? prayerDhikrGroups[selectedPrayerIndex] : null;
  const title = readingSource === 'prayer' ? group.prayerName : getCategoryName(selectedCategoryId);
  const closingMsg = readingSource === 'prayer' ? group.closingMessage : 'بارك الله فيك.. وأتم الله أجرك';

  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];
  const allDone = completedPrayers.length >= 5;

  const shareText = `🕌 أتممت ${title} اليوم!\n🔥 سلسلة: ${streak} أيام متتالية\n⭐ إجمالي الأذكار: ${totalAllTime}\n\nتطبيق أذكاري - لا تنسوني من دعائكم`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className='flex flex-col min-h-screen pb-24 relative overflow-hidden'>
      {/* Particles */}
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(10)].map((_, i) => (
          <motion.div key={i} className='absolute w-1.5 h-1.5 rounded-full bg-emerald-400/20'
            initial={{ x: `${10 + Math.random() * 80}%`, y: '110%', scale: 0 }}
            animate={{ y: '-5%', scale: [0, 1, 0.5, 0], opacity: [0, 0.8, 0.4, 0] }}
            transition={{ duration: 3 + Math.random() * 2, delay: i * 0.25, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </div>

      <main className='flex-1 flex flex-col items-center justify-center px-6 relative z-10'>
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className='w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30'>
          <span className='text-4xl'>💛</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className='text-2xl font-bold text-white mb-3 text-center' style={{ fontFamily: 'var(--font-arabic)' }}>
          {allDone ? '🎉 أحسنت! أتممت أذكار اليوم كاملاً' : 'بارك الله فيك'}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className='text-emerald-200/70 text-base text-center leading-relaxed mb-6 max-w-sm' style={{ fontFamily: 'var(--font-arabic)' }}>
          {closingMsg}
        </motion.p>

        {/* Stats Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='w-full max-w-sm space-y-2 mb-6'>
          <div className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Trophy className='w-4 h-4 text-amber-400' />
              <span className='text-slate-200 text-sm'>أذكار اليوم</span>
            </div>
            <span className='text-emerald-300 font-bold'>{completedPrayers.length}/5</span>
          </div>
          <div className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <Star className='w-4 h-4 text-amber-400' />
              <span className='text-slate-200 text-sm'>السلسلة</span>
            </div>
            <span className='text-amber-300 font-bold'>{streak} يوم 🔥</span>
          </div>
          <div className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <span className='text-lg'>{treeEmojis[Math.min(treeLevel, 6)]}</span>
              <span className='text-slate-200 text-sm'>الشجرة</span>
            </div>
            <span className='text-green-300 font-bold'>المستوى {treeLevel}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className='w-full max-w-sm space-y-2.5'>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentScreen('home')}
            className='w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25'
            style={{ fontFamily: 'var(--font-arabic)' }}>العودة للرئيسية</motion.button>
          <div className='grid grid-cols-3 gap-2'>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCurrentScreen('reading')}
              className='py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-colors'>
              <span className='flex flex-col items-center gap-1'><RotateCcw className='w-4 h-4' />إعادة</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy}
              className='py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-colors'>
              <span className='flex flex-col items-center gap-1'><Copy className='w-4 h-4' />{copied ? 'تم!' : 'نسخ'}</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
              if ('share' in navigator) (navigator as unknown as { share: (d: { title: string; text: string }) => Promise<void> }).share({ title: 'أذكاري', text: shareText }).catch(() => {});
            }} className='py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-colors'>
              <span className='flex flex-col items-center gap-1'><Share2 className='w-4 h-4' />مشاركة</span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}