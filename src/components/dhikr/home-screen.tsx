'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IslamicIcon, Star, TreePine, Sparkles, ChevronLeft, Clock, Bell, Hand } from '@/components/dhikr/islamic-icons';
import { prayerDhikrGroups, prayerTimesList, getCurrentPrayerIndex, getSimpleHijriDate, dailyVerses, smartNotifications, treeIcons, fetchPrayerTimes } from '@/lib/dhikr-data';
import { useDhikrStore, ArabicFont } from '@/lib/store';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)',
    'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)',
    'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)',
    'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function HomeScreen() {
  const {
    setCurrentScreen, setSelectedPrayerIndex, setReadingSource,
    streak, treeLevel, completedPrayers, freeCounter, themeColor,
    arabicFont, selectedCity, prayerTimes, setPrayerTimes,
  } = useDhikrStore();

  const [hijriDate] = useState(() => getSimpleHijriDate());
  const [prayerIdx, setPrayerIdx] = useState(getCurrentPrayerIndex);
  const [verse] = useState(() => dailyVerses[Math.floor(new Date().getDay() % dailyVerses.length)]);
  const [notif] = useState(() => smartNotifications[Math.floor(Math.random() * smartNotifications.length)]);

  const fontClass = getFontClass(arabicFont);

  useEffect(() => {
    const t = setInterval(() => setPrayerIdx(getCurrentPrayerIndex()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchPrayerTimes(selectedCity).then(times => setPrayerTimes(times));
    }
  }, [selectedCity, setPrayerTimes]);

  const currentPrayer = prayerDhikrGroups[prayerIdx];
  const currentPrayerTime = prayerTimesList[prayerIdx];

  const prayerTimeDisplay = (prayerId: string, defaultTime: string) => {
    const fetched = prayerTimes[prayerId];
    if (fetched && fetched !== '--:--') return fetched;
    return defaultTime;
  };

  const colorMap: Record<string, { main: string; light: string; bg: string; border: string; glow: string }> = {
    emerald: { main: 'text-emerald-600 dark:text-emerald-400', light: 'text-emerald-700 dark:text-emerald-300', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/80 dark:to-teal-900/60', border: 'border-emerald-200 dark:border-emerald-700/30', glow: 'shadow-emerald-500/15 dark:shadow-emerald-500/25' },
    blue: { main: 'text-blue-600 dark:text-blue-400', light: 'text-blue-700 dark:text-blue-300', bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/80 dark:to-indigo-900/60', border: 'border-blue-200 dark:border-blue-700/30', glow: 'shadow-blue-500/15 dark:shadow-blue-500/25' },
    purple: { main: 'text-purple-600 dark:text-purple-400', light: 'text-purple-700 dark:text-purple-300', bg: 'from-purple-50 to-violet-50 dark:from-purple-900/80 dark:to-violet-900/60', border: 'border-purple-200 dark:border-purple-700/30', glow: 'shadow-purple-500/15 dark:shadow-purple-500/25' },
    amber: { main: 'text-amber-600 dark:text-amber-400', light: 'text-amber-700 dark:text-amber-300', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/80 dark:to-orange-900/60', border: 'border-amber-200 dark:border-amber-700/30', glow: 'shadow-amber-500/15 dark:shadow-amber-500/25' },
    rose: { main: 'text-rose-600 dark:text-rose-400', light: 'text-rose-700 dark:text-rose-300', bg: 'from-rose-50 to-pink-50 dark:from-rose-900/80 dark:to-pink-900/60', border: 'border-rose-200 dark:border-rose-700/30', glow: 'shadow-rose-500/15 dark:shadow-rose-500/25' },
  };
  const clr = colorMap[themeColor] || colorMap.emerald;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Hijri Date + Greeting */}
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center gap-2.5'>
            <IslamicIcon name='mosque' className='w-7 h-7 text-amber-400' />
            <div>
              <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontClass }}>أذكاري</h1>
              {hijriDate && <p className='app-text-2 text-xs mt-0.5'>{hijriDate}</p>}
            </div>
          </div>
          <button className='w-10 h-10 rounded-full app-surface flex items-center justify-center app-surface-h transition-colors'>
            <IslamicIcon name='bell' className='w-5 h-5 app-text-2' />
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
            <IslamicIcon name={notif.icon} className='w-6 h-6 text-amber-400 shrink-0' />
            <p className={`${clr.light} text-sm leading-relaxed`} style={{ fontFamily: fontClass }}>{notif.text}</p>
          </div>
        </motion.div>

        {/* Daily Verse Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className='glass-card rounded-2xl p-5 border border-amber-500/10'
        >
          <div className='flex items-center gap-2 mb-3'>
            <IslamicIcon name='book' className='w-5 h-5 text-amber-400' />
            <span className='app-text-2 text-xs' style={{ fontFamily: fontClass }}>آية اليوم</span>
          </div>
          <p className='app-text text-lg leading-loose mb-2' style={{ fontFamily: fontClass }}>{verse.text}</p>
          <p className='text-amber-400 text-xs'>{verse.ref}</p>
        </motion.div>

        {/* Quick Free Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className='glass-card rounded-2xl p-4 border border-amber-500/10'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('counter')}
                className='w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20'
              >
                <IslamicIcon name='hand-tap' className='w-7 h-7 app-text' />
              </motion.button>
              <div>
                <p className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>العداد السريع</p>
                <p className='text-amber-400 text-2xl font-bold'>{freeCounter}</p>
              </div>
            </div>
            <div className='text-left'>
              <p className='app-text-muted text-xs'>اضغط للفتح</p>
              <ChevronLeft className='w-4 h-4 app-text-muted rotate-180' />
            </div>
          </div>
        </motion.div>

        {/* Next Prayer Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${clr.bg} border ${clr.border} p-5`}
        >
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 opacity-40' />
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Clock className={`w-4 h-4 ${clr.light}`} />
                <span className={`${clr.light} text-xs opacity-60`}>الصلاة القادمة</span>
              </div>
              <span className='text-amber-400 text-xs font-medium'>
                {prayerTimeDisplay(currentPrayerTime.id, currentPrayerTime?.time || '--:--')}
              </span>
            </div>
            <div className='flex items-center gap-3 mb-4'>
              <IslamicIcon name={currentPrayerTime?.icon || 'sun'} className='w-8 h-8 text-amber-400' />
              <h2 className='text-xl font-bold app-text' style={{ fontFamily: fontClass }}>{currentPrayerTime?.name}</h2>
              {completedPrayers.includes(currentPrayer.prayerId) && (
                <IslamicIcon name='check-circle' className='w-4 h-4 text-emerald-400' />
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
              onClick={() => { setSelectedPrayerIndex(prayerIdx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${themeColor === 'emerald' ? 'from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500' : themeColor === 'blue' ? 'from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500' : themeColor === 'purple' ? 'from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500' : themeColor === 'amber' ? 'from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500' : 'from-rose-600 to-pink-600 dark:from-rose-500 dark:to-pink-500'} app-text font-bold text-base shadow-lg ${clr.glow} hover:shadow-xl transition-shadow`}
              style={{ fontFamily: fontClass }}
            >
              <span className='flex items-center justify-center gap-2'>
                <Sparkles className='w-5 h-5' />
                ابدأ أذكار ما بعد الصلاة
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Streak + Tree Row */}
        <div className='grid grid-cols-2 gap-3'>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className='glass-card rounded-2xl p-3.5 border border-amber-500/10'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <Star className='w-4 h-4 text-amber-400' />
              <span className='text-amber-300/50 text-[11px]' style={{ fontFamily: fontClass }}>السلسلة</span>
            </div>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-bold text-amber-300'>{streak}</span>
              <span className='text-amber-400/50 text-[11px]' style={{ fontFamily: fontClass }}>يوم</span>
            </div>
            <div className='mt-2 flex gap-0.5'>
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < ((streak - 1) % 7) + 1 || streak >= 7 ? 'bg-amber-400' : 'bg-amber-900/30'}`} />
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className='glass-card rounded-2xl p-3.5 border border-emerald-500/10'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <TreePine className='w-4 h-4 text-emerald-400' />
              <span className='text-emerald-300/50 text-[11px]' style={{ fontFamily: fontClass }}>شجرة الأذكار</span>
            </div>
            <div className='flex items-center gap-2'>
              <IslamicIcon
                name={treeIcons[Math.min(treeLevel, treeIcons.length - 1)]}
                className='w-8 h-8 text-emerald-400'
              />
              <div>
                <span className='text-lg font-bold text-emerald-300'>{treeLevel}</span>
                <div className='w-16 bg-emerald-900/30 rounded-full h-1.5 mt-0.5'>
                  <div className='bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full' style={{ width: `${Math.min(treeLevel * 100 / 7, 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Prayers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className='glass-card rounded-2xl p-4 border border-amber-500/10'
        >
          <div className='flex items-center justify-between mb-3'>
            <h3 className='app-text-2/50 text-xs' style={{ fontFamily: fontClass }}>أذكار اليوم ({completedPrayers.length}/5)</h3>
          </div>
          <div className='flex gap-2'>
            {prayerTimesList.map((p) => {
              const done = completedPrayers.includes(p.id);
              const idx = prayerDhikrGroups.findIndex(g => g.prayerId === p.id);
              return (
                <button key={p.id} onClick={() => { setSelectedPrayerIndex(idx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-300 ${done ? 'bg-emerald-500/15 border border-emerald-500/20' : 'app-surface border app-border-c app-surface-h'}`}
                >
                  {done ? (
                    <IslamicIcon name='check-circle' className='w-5 h-5 text-emerald-400 mb-0.5' />
                  ) : (
                    <IslamicIcon name={p.icon} className='w-5 h-5 app-text-2 mb-0.5' />
                  )}
                  <span className={`text-[10px] ${done ? 'text-emerald-300' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
