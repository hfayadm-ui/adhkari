'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrGroups, prayerTimesList, getCurrentPrayerGroup } from '@/lib/dhikr-data';
import { useState, useEffect } from 'react';
import { Star, Settings, Trophy, TreePine, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function MainScreen() {
  const { setCurrentScreen, setSelectedPrayerIndex, streak, treeLevel, completedPrayers, totalDhikrThisWeek } = useDhikrStore();
  const [currentPrayer, setCurrentPrayer] = useState(getCurrentPrayerGroup);
  const [showPrayerSelector, setShowPrayerSelector] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPrayer(getCurrentPrayerGroup());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const currentPrayerTime = prayerTimesList.find(p => p.id === currentPrayer.prayerId);

  const handleStartDhikr = (prayerIndex: number) => {
    setSelectedPrayerIndex(prayerIndex);
    setCurrentScreen('reading');
  };

  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white text-lg">🕌</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-100" style={{ fontFamily: 'var(--font-arabic)' }}>أذكاري</h1>
            <p className="text-xs text-emerald-300/60">سبحان الله وبحمده</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('stats')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="الإحصائيات"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="الإعدادات"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-6 pb-24 space-y-6">
        {/* Current Prayer Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/80 to-teal-900/60 border border-emerald-700/30 p-6"
        >
          {/* Decorative Islamic pattern */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 opacity-60" />
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-emerald-300/60 text-sm mb-1">الصلاة القادمة</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{currentPrayerTime?.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-arabic)' }}>{currentPrayerTime?.name}</h2>
                  <p className="text-emerald-300/80 text-sm">{currentPrayerTime?.time}</p>
                </div>
              </div>
              <p className="text-emerald-200/70 text-sm leading-relaxed">
                {currentPrayer.openingMessage}
              </p>
            </div>
          </div>

          {/* Start Dhikr Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleStartDhikr(dhikrGroups.findIndex(g => g.prayerId === currentPrayer.prayerId))}
            className="mt-5 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              ابدأ أذكار ما بعد الصلاة
            </span>
          </motion.button>
        </motion.div>

        {/* Streak & Tree Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-900/30 border border-amber-700/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300/60 text-sm">السلسلة اليومية</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-amber-300">{streak}</span>
              <span className="text-amber-400/60 text-sm">أيام متتالية</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i < streak % 7 || (streak >= 7)
                      ? 'bg-amber-400'
                      : 'bg-amber-900/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Tree Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/30 border border-green-700/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="w-5 h-5 text-green-400" />
              <span className="text-green-300/60 text-sm">شجرة الأذكار</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{treeEmojis[Math.min(treeLevel, treeEmojis.length - 1)]}</span>
              <div>
                <span className="text-2xl font-bold text-green-300">المستوى {treeLevel}</span>
                <div className="w-full bg-green-900/40 rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((treeLevel % 7) * 100 / 7, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Prayers Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <h3 className="text-slate-300/60 text-sm mb-3">أذكار اليوم ({completedPrayers.length}/5)</h3>
          <div className="flex gap-2">
            {prayerTimesList.map((prayer) => (
              <button
                key={prayer.id}
                onClick={() => handleStartDhikr(dhikrGroups.findIndex(g => g.prayerId === prayer.id))}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 ${
                  completedPrayers.includes(prayer.id)
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-xl mb-1">{completedPrayers.includes(prayer.id) ? '✅' : prayer.icon}</span>
                <span className={`text-xs ${completedPrayers.includes(prayer.id) ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {prayer.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Weekly Stats Quick View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-300/60 text-sm">إجمالي الأذكار هذا الأسبوع</h3>
            <button
              onClick={() => setCurrentScreen('stats')}
              className="text-emerald-400 text-xs hover:underline"
            >
              عرض التفاصيل
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              {totalDhikrThisWeek}
            </span>
            <span className="text-slate-400 text-sm">ذكر</span>
          </div>
          <p className="text-emerald-400/60 text-xs mt-1">سبحان الله وبحمده، سبحان الله العظيم</p>
        </motion.div>
      </main>
    </motion.div>
  );
}
