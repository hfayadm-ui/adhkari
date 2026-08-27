'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { prayerDhikrGroups, prayerTimesList, getCurrentPrayerIndex, getSimpleHijriDate, dailyVerses } from '@/lib/dhikr-data';
import { useState, useEffect } from 'react';
import { Star, TreePine, Sparkles, ChevronLeft, Clock, Bell } from 'lucide-react';

export default function HomeScreen() {
  const { setCurrentScreen, setSelectedPrayerIndex, setReadingSource, streak, treeLevel, completedPrayers, freeCounter, themeColor } = useDhikrStore();
  const [hijriDate] = useState(() => getSimpleHijriDate());
  const [prayerIdx, setPrayerIdx] = useState(getCurrentPrayerIndex);
  const [verse] = useState(() => dailyVerses[Math.floor(new Date().getDay() % dailyVerses.length)]);
  const [notif] = useState(() => dailyVerses[Math.floor(Math.random() * 5)]);

  useEffect(() => { const t = setInterval(() => setPrayerIdx(getCurrentPrayerIndex()), 60000); return () => clearInterval(t); }, []);

  const currentPrayer = prayerDhikrGroups[prayerIdx];
  const currentPrayerTime = prayerTimesList[prayerIdx];
  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];

  const colorMap: Record<string, { main: string; light: string; bg: string; border: string; glow: string }> = {
    emerald: { main: 'text-emerald-400', light: 'text-emerald-300', bg: 'from-emerald-900/80 to-teal-900/60', border: 'border-emerald-700/30', glow: 'shadow-emerald-500/25' },
    blue: { main: 'text-blue-400', light: 'text-blue-300', bg: 'from-blue-900/80 to-indigo-900/60', border: 'border-blue-700/30', glow: 'shadow-blue-500/25' },
    purple: { main: 'text-purple-400', light: 'text-purple-300', bg: 'from-purple-900/80 to-violet-900/60', border: 'border-purple-700/30', glow: 'shadow-purple-500/25' },
    amber: { main: 'text-amber-400', light: 'text-amber-300', bg: 'from-amber-900/80 to-orange-900/60', border: 'border-amber-700/30', glow: 'shadow-amber-500/25' },
    rose: { main: 'text-rose-400', light: 'text-rose-300', bg: 'from-rose-900/80 to-pink-900/60', border: 'border-rose-700/30', glow: 'shadow-rose-500/25' },
  };
  const clr = colorMap[themeColor] || colorMap.emerald;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Hijri Date + Greeting */}
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center justify-between mb-1'>
          <div>
            <h1 className='text-2xl font-bold text-white' style={{ fontFamily: 'var(--font-arabic)' }}>🕌 أذكاري</h1>
            {hijriDate && <p className='text-slate-400 text-xs mt-0.5'>{hijriDate}</p>}
          </div>
          <button className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors`}>
            <Bell className='w-5 h-5 text-slate-400' />
          </button>
        </div>
      </header>

      <main className='flex-1 px-4 space-y-4'>
        {/* Smart Notification Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className={`rounded-2xl bg-gradient-to-r ${clr.bg} border ${clr.border} p-4`}
        >
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>📡</span>
            <p className={`${clr.light} text-sm leading-relaxed`} style={{ fontFamily: 'var(--font-arabic)' }}>{notif.text}</p>
          </div>
        </motion.div>

        {/* Daily Verse Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className='rounded-2xl bg-white/5 border border-white/10 p-5'
        >
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-lg'>📖</span>
            <span className='text-slate-400 text-xs'>آية اليوم</span>
          </div>
          <p className='text-white text-lg leading-loose mb-2' style={{ fontFamily: 'var(--font-arabic)' }}>{verse.text}</p>
          <p className={`${clr.main} text-xs`}>{verse.ref}</p>
        </motion.div>

        {/* Quick Free Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className='rounded-2xl bg-white/5 border border-white/10 p-4'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('counter')}
                className='w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20'
              >
                <span className='text-white text-xl'>🤚</span>
              </motion.button>
              <div>
                <p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>العداد السريع</p>
                <p className={`${clr.main} text-2xl font-bold`}>{freeCounter}</p>
              </div>
            </div>
            <div className='text-left'>
              <p className='text-slate-500 text-xs'>اضغط للفتح</p>
              <ChevronLeft className='w-4 h-4 text-slate-500 rotate-180' />
            </div>
          </div>
        </motion.div>

        {/* Next Prayer Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${clr.bg} border ${clr.border} p-5`}
        >
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 opacity-60' />
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Clock className={`w-4 h-4 ${clr.light}`} />
              <span className={`${clr.light}/60 text-xs`}>الصلاة القادمة</span>
            </div>
            <span className='text-slate-400 text-xs'>{currentPrayerTime?.time}</span>
          </div>
          <div className='flex items-center gap-3 mb-4'>
            <span className='text-3xl'>{currentPrayerTime?.icon}</span>
            <h2 className='text-xl font-bold text-white' style={{ fontFamily: 'var(--font-arabic)' }}>{currentPrayerTime?.name}</h2>
            {completedPrayers.includes(currentPrayer.prayerId) && <span className='text-lg'>✅</span>}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
            onClick={() => { setSelectedPrayerIndex(prayerIdx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-lg ${clr.glow} hover:shadow-emerald-500/40 transition-shadow`}
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            <span className='flex items-center justify-center gap-2'>
              <Sparkles className='w-5 h-5' />
              ابدأ أذكار ما بعد الصلاة
            </span>
          </motion.button>
        </motion.div>

        {/* Streak + Tree Row */}
        <div className='grid grid-cols-2 gap-3'>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className='rounded-2xl bg-amber-900/30 border border-amber-700/20 p-3.5'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <Star className='w-4 h-4 text-amber-400' />
              <span className='text-amber-300/50 text-[11px]'>السلسلة</span>
            </div>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-bold text-amber-300'>{streak}</span>
              <span className='text-amber-400/50 text-[11px]'>يوم</span>
            </div>
            <div className='mt-2 flex gap-0.5'>
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < ((streak - 1) % 7) + 1 || streak >= 7 ? 'bg-amber-400' : 'bg-amber-900/30'}`} />
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className='rounded-2xl bg-green-900/30 border border-green-700/20 p-3.5'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <TreePine className='w-4 h-4 text-green-400' />
              <span className='text-green-300/50 text-[11px]'>شجرة الأذكار</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>{treeEmojis[Math.min(treeLevel, 6)]}</span>
              <div>
                <span className='text-lg font-bold text-green-300'>{treeLevel}</span>
                <div className='w-16 bg-green-900/30 rounded-full h-1.5 mt-0.5'>
                  <div className='bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full' style={{ width: `${Math.min(treeLevel * 100 / 7, 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Prayers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className='rounded-2xl bg-white/5 border border-white/10 p-4'
        >
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-slate-300/50 text-xs'>أذكار اليوم ({completedPrayers.length}/5)</h3>
          </div>
          <div className='flex gap-2'>
            {prayerTimesList.map((p) => {
              const done = completedPrayers.includes(p.id);
              const idx = prayerDhikrGroups.findIndex(g => g.prayerId === p.id);
              return (
                <button key={p.id} onClick={() => { setSelectedPrayerIndex(idx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-300 ${done ? 'bg-emerald-500/15 border border-emerald-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  <span className='text-lg mb-0.5'>{done ? '✅' : p.icon}</span>
                  <span className={`text-[10px] ${done ? 'text-emerald-300' : 'text-slate-500'}`}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}