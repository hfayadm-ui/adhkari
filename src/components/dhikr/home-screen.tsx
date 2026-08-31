'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { IslamicIcon, Star, TreePine, Sparkles, ChevronLeft, Clock, Bell, Moon, Share2, Heart, Trophy, Flame, Trees, Droplets } from '@/components/dhikr/islamic-icons';
import { prayerDhikrGroups, prayerTimesList, getCurrentPrayerIndex, getSimpleHijriDate, dailyVerses, smartNotifications, treeIcons, fetchPrayerTimes, dailyHadiths, getTodayHadithIndex } from '@/lib/dhikr-data';
import { useDhikrStore } from '@/lib/store';
import { getFontClass } from '@/lib/font-utils';
import BreathingCard from '@/components/dhikr/breathing-card';
import { shareAsImage } from '@/lib/share-card';
import { requestNotificationPermission } from '@/lib/smart-notifs';
import TreeVisualization from '@/components/dhikr/tree-visualization';

export default function HomeScreen() {
  const {
    setCurrentScreen, setSelectedPrayerIndex, setReadingSource,
    streak, treeLevel, completedPrayers, freeCounter,
    arabicFont, selectedCity, prayerTimes, setPrayerTimes,
    totalAllTime, challenges, streakFreezesLeft, selectedTree,
  } = useDhikrStore();

  const [hijriDate] = useState(() => getSimpleHijriDate());
  const [prayerIdx, setPrayerIdx] = useState(getCurrentPrayerIndex);
  const [verse] = useState(() => dailyVerses[Math.floor(new Date().getDay() % dailyVerses.length)]);
  const [notif] = useState(() => smartNotifications[Math.floor(Math.random() * smartNotifications.length)]);
  const [hadith] = useState(() => dailyHadiths[getTodayHadithIndex()]);
  const [sharing, setSharing] = useState<string | null>(null);

  const activeChallenges = challenges.filter(c => !c.completed);

  const fontClass = getFontClass(arabicFont);

  const shareProgress = async () => {
    setSharing('stats');
    try {
      await shareAsImage({
        text: '',
        type: 'stats',
        stats: { streak, totalDhikr: totalAllTime, treeLevel },
      });
    } catch { /* */ }
    setSharing(null);
  };

  const shareVerse = async () => {
    setSharing('verse');
    try {
      await shareAsImage({ text: verse.text, footer: verse.ref, type: 'verse' });
    } catch { /* */ }
    setSharing(null);
  };

  const shareHadith = async () => {
    setSharing('hadith');
    try {
      await shareAsImage({ text: hadith.text, footer: `${hadith.narrator} - ${hadith.source}`, type: 'hadith' });
    } catch { /* */ }
    setSharing(null);
  };

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Hijri Date + Greeting */}
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center gap-2.5'>
            <div
              className='w-10 h-10 rounded-xl flex items-center justify-center'
              style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}
            >
              <IslamicIcon name='mosque' className='w-5 h-5' color='var(--gold-accent)' />
            </div>
            <div>
              <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontClass }}>أذكاري</h1>
              {hijriDate && <p className='app-text-2 text-xs mt-0.5'>{hijriDate}</p>}
            </div>
          </div>
          <button
            className='w-10 h-10 rounded-xl glass-card flex items-center justify-center app-surface-h transition-all'
            onClick={async () => {
              const granted = await requestNotificationPermission();
              const { notificationsEnabled, toggleNotifications } = useDhikrStore.getState();
              if (granted && !notificationsEnabled) toggleNotifications();
            }}
          >
            <Bell className='w-5 h-5 app-text-2' />
          </button>
        </div>
      </header>

      <main className='flex-1 px-4 space-y-4'>
        {/* Smart Notification Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className='glass-card rounded-2xl p-4 transition-all duration-200'
        >
          <div className='flex items-center gap-3'>
            <div
              className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0'
                  style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}
            >
              <IslamicIcon name={notif.icon} className='w-4 h-4' color='var(--gold-accent)' />
            </div>
            <p className='app-text-2 text-sm leading-relaxed' style={{ fontFamily: fontClass }}>{notif.text}</p>
          </div>
        </motion.div>

        {/* Daily Verse Card — with share */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className='glass-card-elevated rounded-2xl p-5 relative overflow-hidden'
        >
          {/* Corner ornaments */}
          <div className='absolute top-0 right-0 w-10 h-10 border-t border-r rounded-tr-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute top-0 left-0 w-10 h-10 border-t border-l rounded-tl-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute bottom-0 right-0 w-10 h-10 border-b border-r rounded-br-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute bottom-0 left-0 w-10 h-10 border-b border-l rounded-bl-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />

          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <IslamicIcon name='book' className='w-5 h-5' color='var(--gold-accent)' />
              <span className='app-text-2 text-xs' style={{ fontFamily: fontClass }}>آية اليوم</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={shareVerse}
              disabled={sharing === 'verse'}
              className='w-8 h-8 rounded-lg glass-subtle flex items-center justify-center'
              aria-label='مشاركة الآية كصورة'
            >
              <Share2 className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} />
            </motion.button>
          </div>
          <p className='app-text text-lg leading-loose mb-2' style={{ fontFamily: fontClass }}>{verse.text}</p>
          <p className='text-xs' style={{ color: 'var(--gold-accent)', fontFamily: fontClass }}>{verse.ref}</p>
        </motion.div>

        {/* Daily Hadith Card — NEW */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className='glass-card rounded-2xl p-4 relative overflow-hidden'
        >
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-lg flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                <IslamicIcon name='book' className='w-3.5 h-3.5' color='var(--gold-accent)' />
              </div>
              <span className='app-text-2 text-xs' style={{ fontFamily: fontClass }}>حديث اليوم</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={shareHadith}
              disabled={sharing === 'hadith'}
              className='w-8 h-8 rounded-lg glass-subtle flex items-center justify-center'
              aria-label='مشاركة الحديث كصورة'
            >
              <Share2 className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} />
            </motion.button>
          </div>
          <p className='app-text text-base leading-loose mb-3' style={{ fontFamily: fontClass }}>{hadith.text}</p>
          <div className='flex items-center justify-between'>
            <p className='text-[11px]' style={{ color: 'var(--gold-accent)' }}>{hadith.narrator}</p>
            <p className='app-text-muted text-[10px]'>{hadith.source}</p>
          </div>
        </motion.div>

        {/* Quick Free Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          whileHover={{ scale: 1.03 }}
          className='glass-card rounded-2xl p-4'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('counter')}
                className='btn-gold w-14 h-14 rounded-2xl flex items-center justify-center'
              >
                <IslamicIcon name='hand-tap' className='w-7 h-7' color='#ffffff' />
              </motion.button>
              <div>
                <p className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>العداد السريع</p>
                <p className='text-2xl font-bold' style={{ color: 'var(--gold-accent)' }}>{freeCounter}</p>
              </div>
            </div>
            <div className='text-left'>
              <p className='app-text-muted text-xs'>اضغط للفتح</p>
              <ChevronLeft className='w-4 h-4 app-text-muted rotate-180' />
            </div>
          </div>
        </motion.div>

        {/* Breathing Card */}
        <BreathingCard fontClass={fontClass} />

        {/* Challenges Card — navigates to full screen */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentScreen('challenges')}
          className='glass-card rounded-2xl p-4 app-surface-h cursor-pointer'
        >
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
              <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>تحدياتي</span>
              {activeChallenges.length > 0 && <span className='text-[10px] app-text-muted'>({activeChallenges.length})</span>}
            </div>
            <ChevronLeft className='w-4 h-4 app-text-muted rotate-180' />
          </div>
          {activeChallenges.length > 0 ? (
            <div className='space-y-2'>
              {activeChallenges.slice(0, 3).map(ch => {
                const pct = Math.min((ch.current / ch.target) * 100, 100);
                return (
                  <div key={ch.id} className='p-2.5 rounded-xl glass-subtle'>
                    <div className='flex items-center justify-between mb-1.5'>
                      <span className='app-text text-xs font-medium' style={{ fontFamily: fontClass }}>{ch.name}</span>
                      <span className='text-[10px] app-text-muted'>{ch.current}/{ch.target} {ch.unit}</span>
                    </div>
                    <div className='w-full rounded-full h-1.5' style={{ background: 'var(--app-ring-track)' }}>
                      <div className='h-1.5 rounded-full transition-all' style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='app-text-muted text-xs'>اضغط لاختيار تحديك الأول</p>
          )}
        </motion.div>

        {/* Next Prayer Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className='glass-glow rounded-2xl p-5 relative overflow-hidden'
        >
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='absolute top-0 left-0 right-0 h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-muted text-xs'>الصلاة القادمة</span>
              </div>
              <span className='text-xs font-medium' style={{ color: 'var(--gold-accent)' }}>
                {prayerTimeDisplay(currentPrayerTime.id, currentPrayerTime?.time || '--:--')}
              </span>
            </div>
            <div className='flex items-center gap-3 mb-4'>
              <IslamicIcon name={currentPrayerTime?.icon || 'sun'} className='w-8 h-8' color='var(--gold-accent)' />
              <h2 className='text-xl font-bold app-text' style={{ fontFamily: fontClass }}>{currentPrayerTime?.name}</h2>
              {completedPrayers.includes(currentPrayer.prayerId) && (
                <IslamicIcon name='check-circle' className='w-4 h-4 text-emerald-500' />
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedPrayerIndex(prayerIdx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
              className='btn-gold w-full py-3.5 rounded-xl text-base'
              style={{ fontFamily: fontClass }}
            >
              <span className='flex items-center justify-center gap-2'>
                <Sparkles className='w-5 h-5' />
                ابدأ أذكار ما بعد الصلاة
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Streak Fire + Garden Row */}
        <div className='grid grid-cols-2 gap-3'>
          <motion.div
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('garden')}
            className='glass-glow rounded-2xl p-3.5 cursor-pointer relative overflow-hidden'
          >
            {/* Fire glow background */}
            {streak > 0 && (
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none'
                style={{ background: streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : '#fbbf24' }}
              />
            )}
            <div className='relative z-10'>
              <div className='flex items-center gap-1.5 mb-2'>
                <motion.div animate={streak > 0 ? { scale: [1, 1.2, 1], rotate: [-3, 3, -3] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Flame className='w-4 h-4' style={{ color: streak > 0 ? (streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : '#fbbf24') : '#4b5563' }} />
                </motion.div>
                <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>السلسلة</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); shareProgress(); }} className='mr-auto w-6 h-6 rounded-md glass-subtle flex items-center justify-center' aria-label='مشاركة'>
                  <Share2 className='w-3 h-3' style={{ color: 'var(--gold-accent)' }} />
                </motion.button>
              </div>
              <div className='flex items-baseline gap-1'>
                <span className='text-3xl font-bold' style={{ color: streak > 0 ? (streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : 'var(--gold-accent)') : 'var(--gold-border)' }}>{streak}</span>
                <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>يوم</span>
              </div>
              {/* Week dots with fire colors */}
              <div className='mt-2 flex gap-0.5'>
                {[...Array(7)].map((_, i) => (
                  <motion.div key={i} className='flex-1 h-1.5 rounded-full' style={{
                    background: i < Math.min(streak, 7)
                      ? `linear-gradient(180deg, ${streak >= 7 ? '#ef4444' : '#f97316'}, ${streak >= 7 ? '#f97316' : '#fbbf24'})`
                      : 'var(--app-ring-track)',
                    boxShadow: i < Math.min(streak, 7) ? `0 0 4px ${streak >= 7 ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.4)'}` : 'none',
                  }} animate={i === Math.min(streak, 7) - 1 && streak > 0 ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
                ))}
              </div>
              <div className='flex items-center gap-1 mt-1.5'>
                <Droplets className='w-2.5 h-2.5' style={{ color: '#60a5fa' }} />
                <span className='text-[9px] app-text-muted'>{streakFreezesLeft} تجميد</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('garden')}
            className='glass-card rounded-2xl p-3.5 cursor-pointer'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <Trees className='w-4 h-4 text-emerald-500' />
              <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>حديقتي</span>
              <span className='mr-auto text-[9px] app-text-muted'>مستوى {treeLevel}</span>
            </div>
            <div className='flex items-center gap-2'>
              <div style={{ width: 32, height: 32 }}>
                <TreeVisualization treeType={selectedTree} level={treeLevel} size={32} />
              </div>
              <div>
                <span className='text-lg font-bold text-emerald-500'>مستوى {treeLevel}</span>
                <div className='w-16 rounded-full h-1.5 mt-0.5' style={{ background: 'var(--app-ring-track)' }}>
                  <div className='h-1.5 rounded-full bg-emerald-500 transition-all' style={{ width: `${Math.min(treeLevel * 10, 100)}%` }} />
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <TreeVisualization treeType={selectedTree} level={treeLevel} size={28} />
            </div>
          </motion.div>
        </div>

        {/* Today's Prayers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className='glass-card rounded-2xl p-4'
        >
          <div className='flex items-center justify-between mb-3'>
            <h3 className='app-text-muted text-xs' style={{ fontFamily: fontClass }}>أذكار اليوم ({completedPrayers.length}/5)</h3>
          </div>
          <div className='flex gap-2'>
            {prayerTimesList.map((p) => {
              const done = completedPrayers.includes(p.id);
              const idx = prayerDhikrGroups.findIndex(g => g.prayerId === p.id);
              return (
                <button key={p.id} onClick={() => { setSelectedPrayerIndex(idx); setReadingSource('prayer'); setCurrentScreen('reading'); }}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-300 ${done ? '' : 'btn-glass'}`}
                  style={done ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
                >
                  {done ? (
                    <IslamicIcon name='check-circle' className='w-5 h-5 text-emerald-500 mb-0.5' />
                  ) : (
                    <IslamicIcon name={p.icon} className='w-5 h-5 app-text-2 mb-0.5' />
                  )}
                  <span className={`text-[10px] ${done ? 'text-emerald-500' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}