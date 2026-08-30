'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IslamicIcon, Star, TreePine, Sparkles, ChevronLeft, Clock, Bell, Moon, Share2 } from '@/components/dhikr/islamic-icons';
import { prayerDhikrGroups, prayerTimesList, getCurrentPrayerIndex, getSimpleHijriDate, dailyVerses, smartNotifications, treeIcons, fetchPrayerTimes } from '@/lib/dhikr-data';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import BreathingCard from '@/components/dhikr/breathing-card';

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
    streak, treeLevel, completedPrayers, freeCounter,
    arabicFont, selectedCity, prayerTimes, setPrayerTimes,
  } = useDhikrStore();

  const [hijriDate] = useState(() => getSimpleHijriDate());
  const [prayerIdx, setPrayerIdx] = useState(getCurrentPrayerIndex);
  const [verse] = useState(() => dailyVerses[Math.floor(new Date().getDay() % dailyVerses.length)]);
  const [notif] = useState(() => smartNotifications[Math.floor(Math.random() * smartNotifications.length)]);

  const fontClass = getFontClass(arabicFont);

  const shareProgress = async () => {
    const text = `أذكاري - سلسلة ${streak} أيام متتالية \u{1F31F}\nشجرة الأذكار: المستوى ${treeLevel}\nما شاء الله، لا قوة إلا بالله`;
    if (navigator.share) {
      await navigator.share({ title: 'أذكاري - تقدمي', text });
    } else {
      await navigator.clipboard.writeText(text);
    }
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

        {/* Daily Verse Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className='glass-card-elevated rounded-2xl p-5 relative overflow-hidden'
        >
          {/* Corner ornaments */}
          <div className='absolute top-0 right-0 w-10 h-10 border-t border-r rounded-tr-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute top-0 left-0 w-10 h-10 border-t border-l rounded-tl-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute bottom-0 right-0 w-10 h-10 border-b border-r rounded-br-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />
          <div className='absolute bottom-0 left-0 w-10 h-10 border-b border-l rounded-bl-2xl' style={{ borderColor: 'var(--gold-border-glow)' }} />

          <div className='flex items-center gap-2 mb-3'>
            <IslamicIcon name='book' className='w-5 h-5' color='var(--gold-accent)' />
            <span className='app-text-2 text-xs' style={{ fontFamily: fontClass }}>آية اليوم</span>
          </div>
          <p className='app-text text-lg leading-loose mb-2' style={{ fontFamily: fontClass }}>{verse.text}</p>
          <p className='text-xs' style={{ color: 'var(--gold-accent)', fontFamily: fontClass }}>{verse.ref}</p>
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

        {/* Focus Mode Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCurrentScreen('focus')}
          className='glass-card rounded-2xl p-4 cursor-pointer'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div
                className='w-10 h-10 rounded-xl flex items-center justify-center'
                style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}
              >
                <Moon className='w-5 h-5' color='var(--gold-accent)' />
              </div>
              <div>
                <p className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>وضع التركيز</p>
                <p className='app-text-muted text-xs'>أذكار بلا تشتت</p>
              </div>
            </div>
            <ChevronLeft className='w-4 h-4 app-text-muted rotate-180' />
          </div>
        </motion.div>

        {/* Next Prayer Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
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

        {/* Streak + Tree Row */}
        <div className='grid grid-cols-2 gap-3'>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.27 }}
            className='glass-card glass-glow rounded-2xl p-3.5'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <Star className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
              <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>السلسلة</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-baseline gap-1'>
                <span className='text-3xl font-bold' style={{ color: 'var(--gold-accent)' }}>{streak}</span>
                <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>يوم</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={shareProgress}
                className='w-7 h-7 rounded-lg glass-subtle flex items-center justify-center'
                aria-label='مشاركة التقدم'
              >
                <Share2 className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} />
              </motion.button>
            </div>
            <div className='mt-2 flex gap-0.5'>
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < ((streak - 1) % 7) + 1 || streak >= 7 ? '' : ''}`} style={{
                  background: i < ((streak - 1) % 7) + 1 || streak >= 7 ? 'var(--gold-accent)' : 'var(--app-ring-track)',
                }} />
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}
            className='glass-card rounded-2xl p-3.5'
          >
            <div className='flex items-center gap-1.5 mb-2'>
              <TreePine className='w-4 h-4 text-emerald-500' />
              <span className='app-text-muted text-[11px]' style={{ fontFamily: fontClass }}>شجرة الأذكار</span>
            </div>
            <div className='flex items-center gap-2'>
              <IslamicIcon
                name={treeIcons[Math.min(treeLevel, treeIcons.length - 1)]}
                className='w-8 h-8 text-emerald-500'
              />
              <div>
                <span className='text-lg font-bold text-emerald-500'>{treeLevel}</span>
                <div className='w-16 rounded-full h-1.5 mt-0.5' style={{ background: 'var(--app-ring-track)' }}>
                  <div className='h-1.5 rounded-full bg-emerald-500' style={{ width: `${Math.min(treeLevel * 100 / 7, 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Prayers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }}
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
