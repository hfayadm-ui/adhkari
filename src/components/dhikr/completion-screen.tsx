'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrGroups } from '@/lib/dhikr-data';
import { Home, Share2, RotateCcw, Trophy, Star, TreePine } from 'lucide-react';

export default function CompletionScreen() {
  const { selectedPrayerIndex, setCurrentScreen, streak, treeLevel, totalDhikrThisWeek, completedPrayers } = useDhikrStore();
  const group = dhikrGroups[selectedPrayerIndex];

  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];

  const allDone = completedPrayers.length >= 5;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
              scale: 0,
            }}
            animate={{
              y: -20,
              scale: [0, 1, 0.5, 0],
              opacity: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30"
        >
          <span className="text-5xl">🤍</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-4 text-center"
          style={{ fontFamily: 'var(--font-arabic)' }}
        >
          {allDone ? '🎉 أحسنت! أتممت أذكار اليوم كاملاً' : 'بارك الله فيك'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-emerald-200/80 text-lg text-center leading-relaxed mb-8 max-w-sm"
          style={{ fontFamily: 'var(--font-arabic)' }}
        >
          {group.closingMessage}
        </motion.p>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm space-y-3 mb-8"
        >
          {/* Today's progress */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-xl">🕌</span>
              </div>
              <div>
                <p className="text-white font-medium">أذكار اليوم</p>
                <p className="text-emerald-300/60 text-sm">{completedPrayers.length} من 5 صلوات</p>
              </div>
            </div>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>

          {/* Streak */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-medium">السلسلة المتتالية</p>
                <p className="text-amber-300/60 text-sm">{streak} أيام متتالية</p>
              </div>
            </div>
            <span className="text-2xl">🔥</span>
          </div>

          {/* Tree */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-xl">{treeEmojis[Math.min(treeLevel, treeEmojis.length - 1)]}</span>
              </div>
              <div>
                <p className="text-white font-medium">شجرة الأذكار</p>
                <p className="text-green-300/60 text-sm">المستوى {treeLevel}</p>
              </div>
            </div>
            <TreePine className="w-5 h-5 text-green-400" />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-sm space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentScreen('home')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            العودة للرئيسية
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setCurrentScreen('reading');
              }}
              className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              <span className="flex items-center justify-center gap-1">
                <RotateCcw className="w-4 h-4" />
                إعادة
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (typeof navigator !== 'undefined' && 'share' in navigator) {
                  navigator.share({
                    title: 'أذكاري',
                    text: `أتممت أذكار ${group.prayerName} اليوم! 🔥 سلسلة: ${streak} أيام`,
                  }).catch(() => {});
                }
              }}
              className="py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              <span className="flex items-center justify-center gap-1">
                <Share2 className="w-4 h-4" />
                مشاركة
              </span>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
