'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrGroups } from '@/lib/dhikr-data';
import { ArrowRight, Trophy, Flame, TreePine, Star, TrendingUp, Calendar } from 'lucide-react';

export default function StatsScreen() {
  const { streak, treeLevel, totalDhikrThisWeek, completedPrayers, setCurrentScreen } = useDhikrStore();

  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];
  const treeNames = ['بذرة', 'نبتة صغيرة', 'شجرة صغيرة', 'شجرة عادية', 'نخلة', 'حديقة', 'جنة صغيرة'];

  // Calculate subhanallah count (33 per prayer × prayers done)
  const subhanallahCount = completedPrayers.length * 33;
  const hamdCount = completedPrayers.length * 33;
  const takbirCount = completedPrayers.length * 33;

  const dailyProgress = [
    { day: 'السبت', done: true },
    { day: 'الأحد', done: true },
    { day: 'الاثنين', done: true },
    { day: 'الثلاثاء', done: false },
    { day: 'الأربعاء', done: false },
    { day: 'الخميس', done: false },
    { day: 'الجمعة', done: false },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">رجوع</span>
        </button>
        <h2 className="text-emerald-200 font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>الإحصائيات والإنجازات</h2>
      </header>

      <main className="flex-1 px-4 pt-4 pb-24 space-y-4">
        {/* Streak Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-amber-900/40 to-orange-900/30 border border-amber-700/20 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-arabic)' }}>السلسلة اليومية</h3>
              <p className="text-amber-300/60 text-sm">أيام متتالية</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="relative">
              <motion.span
                key={streak}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-orange-400"
              >
                {streak}
              </motion.span>
              <p className="text-center text-amber-300/60 text-sm mt-1">يوم متتالي 🔥</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dailyProgress.map((day, i) => (
              <div key={i} className="text-center">
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-lg ${
                    day.done ? 'bg-amber-400/20 border border-amber-400/30' : 'bg-amber-900/20 border border-amber-900/30'
                  }`}
                >
                  {day.done ? '✅' : '○'}
                </div>
                <span className="text-[10px] text-amber-300/40 mt-1 block">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dhikr Tree */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/30 border border-green-700/20 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-arabic)' }}>شجرة الأذكار</h3>
              <p className="text-green-300/60 text-sm">كلما أتممت أذكارك نمت شجرتك</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="text-center"
            >
              <span className="text-6xl block mb-2">{treeEmojis[Math.min(treeLevel, treeEmojis.length - 1)]}</span>
              <span className="text-green-300 text-sm">{treeNames[Math.min(treeLevel, treeNames.length - 1)]}</span>
            </motion.div>
          </div>
          {/* Tree Growth Progress */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs text-green-300/60">
              <span>المستوى {treeLevel} من 6</span>
              <span>{Math.round((treeLevel / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-green-900/30 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((treeLevel / 6) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full"
              />
            </div>
          </div>
          {/* Tree stages */}
          <div className="flex justify-between mt-3 px-1">
            {treeEmojis.map((emoji, i) => (
              <span
                key={i}
                className={`text-sm transition-all duration-300 ${
                  i <= treeLevel ? 'opacity-100' : 'opacity-20 grayscale'
                }`}
              >
                {emoji}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-arabic)' }}>إحصائيات الأذكار</h3>
              <p className="text-emerald-300/60 text-sm">هذا الأسبوع</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤲</span>
                <div>
                  <p className="text-white text-sm font-medium">سبحان الله</p>
                  <p className="text-emerald-300/40 text-xs">هذا الأسبوع</p>
                </div>
              </div>
              <span className="text-emerald-300 font-bold text-lg">{subhanallahCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🙏</span>
                <div>
                  <p className="text-white text-sm font-medium">الحمد لله</p>
                  <p className="text-emerald-300/40 text-xs">هذا الأسبوع</p>
                </div>
              </div>
              <span className="text-emerald-300 font-bold text-lg">{hamdCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">☪️</span>
                <div>
                  <p className="text-white text-sm font-medium">الله أكبر</p>
                  <p className="text-emerald-300/40 text-xs">هذا الأسبوع</p>
                </div>
              </div>
              <span className="text-emerald-300 font-bold text-lg">{takbirCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-emerald-200 text-sm font-medium">إجمالي الأذكار</p>
                  <p className="text-emerald-300/40 text-xs">جميع الأنواع</p>
                </div>
              </div>
              <span className="text-emerald-300 font-bold text-xl">{totalDhikrThisWeek}</span>
            </div>
          </div>
        </motion.div>

        {/* Today's Prayers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-arabic)' }}>أذكار اليوم</h3>
              <p className="text-slate-400 text-sm">{completedPrayers.length} من 5 مكتملة</p>
            </div>
          </div>
          <div className="space-y-2">
            {dhikrGroups.map((group) => (
              <div
                key={group.prayerId}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  completedPrayers.includes(group.prayerId)
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${completedPrayers.includes(group.prayerId) ? '' : 'opacity-40'}`}>
                    {completedPrayers.includes(group.prayerId) ? '✅' : '⭕'}
                  </span>
                  <span className={`text-sm ${completedPrayers.includes(group.prayerId) ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {group.prayerName}
                  </span>
                </div>
                <span className="text-slate-500 text-xs">
                  {group.dhikrList.length} أذكار
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
