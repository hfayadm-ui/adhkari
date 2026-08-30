'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Home, ChevronRight, Trees, Sparkles, Star, Lock, Droplets, Flower2, Leaf, Flame } from '@/components/dhikr/islamic-icons';
import { useState, useEffect } from 'react';
import { getFontClass } from '@/lib/font-utils';

const plantConfig: Record<string, { label: string; icon: string; color: string; unlockDay: number; size: number }> = {
  seed:    { label: 'بذرة',     icon: 'circle-dot',  color: '#8B6914', unlockDay: 0,  size: 28 },
  sprout:  { label: 'نبتة',     icon: 'leaf',        color: '#22c55e', unlockDay: 1,  size: 34 },
  flower:  { label: 'زهرة',     icon: 'flower2',     color: '#f472b6', unlockDay: 3,  size: 38 },
  rose:    { label: 'وردة',     icon: 'sparkles',    color: '#ef4444', unlockDay: 5,  size: 40 },
  jasmine: { label: 'ياسمين',  icon: 'star',        color: '#fbbf24', unlockDay: 7,  size: 42 },
  lotus:   { label: 'زهر اللوتس', icon: 'droplets',  color: '#818cf8', unlockDay: 10, size: 44 },
  tree:    { label: 'شجرة',     icon: 'tree-pine',   color: '#10b981', unlockDay: 14, size: 48 },
  palm:    { label: 'نخلة',     icon: 'trees',       color: '#059669', unlockDay: 21, size: 52 },
};

const gardenNames = ['أرض barren', 'حديقة ناشئة', 'حديقة خضراء', 'حديقة الزهور', 'جنة صغيرة', 'روضة رائعة', 'حديقة النخيل', 'جنة المؤمن', 'حديقة الخلد', 'جنة الفردوس'];

function GardenPlantSVG({ type, size, color, delay = 0 }: { type: string; size: number; color: string; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay }}
      style={{ width: size, height: size }}
      className='relative flex items-center justify-center'
    >
      {/* Glow */}
      <div className='absolute inset-0 rounded-full opacity-30 blur-md' style={{ background: color }} />
      {/* Main icon */}
      <IslamicIcon name={plantConfig[type]?.icon || 'leaf'} className='relative z-10' style={{ width: size * 0.7, height: size * 0.7, color }} color={color} />
      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-1 h-1 rounded-full'
          style={{ background: color, left: `${30 + i * 20}%` }}
          animate={{ y: [-5, -15, -5], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: delay + i * 0.3 }}
        />
      ))}
    </motion.div>
  );
}

export default function GardenScreen() {
  const {
    setCurrentScreen, streak, gardenPlants, gardenLevel, arabicFont,
    streakFreezesLeft, totalAllTime, streakDays,
  } = useDhikrStore();

  const fontClass = getFontClass(arabicFont);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const gardenName = gardenNames[Math.min(gardenLevel, gardenNames.length - 1)];

  const plantCounts: Record<string, number> = {};
  gardenPlants.forEach(p => { plantCounts[p.type] = (plantCounts[p.type] || 0) + 1; });

  const unlockedTypes = Object.entries(plantConfig).filter(([, cfg]) => streak >= cfg.unlockDay);
  const lockedTypes = Object.entries(plantConfig).filter(([, cfg]) => streak < cfg.unlockDay);

  // Recent 7 days streak visualization
  const recentDays = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayData = streakDays.find(s => s.date === dateStr);
    return { date: dateStr, dayName: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][d.getDay()], count: dayData?.count || 0 };
  });

  // Check if today has activity
  const todayActive = streakDays.some(s => s.date === new Date().toDateString());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Header */}
      <header className='px-4 pt-4 pb-3'>
        <div className='flex items-center gap-2.5 mb-1'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <Trees className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
          </div>
          <div>
            <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontClass }}>حديقتي الروحانية</h1>
            <p className='app-text-2 text-xs'>{gardenName} — المستوى {gardenLevel}</p>
          </div>
        </div>
      </header>

      <main className='flex-1 px-4 space-y-4'>
        {/* Streak Fire Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className='glass-glow rounded-2xl p-5 relative overflow-hidden'
        >
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10 text-center'>
            {/* Fire animation */}
            <div className='flex items-center justify-center mb-3'>
              <motion.div
                animate={streak > 0 ? { scale: [1, 1.15, 1], rotate: [-2, 2, -2] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className='relative'
              >
                <Flame className='w-14 h-14' style={{ color: streak > 0 ? (streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : '#fbbf24') : '#4b5563', filter: streak > 0 ? 'drop-shadow(0 0 12px rgba(239,68,68,0.5))' : 'none' }} />
                {streak > 0 && (
                  <motion.div
                    className='absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white'
                    style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {streak}
                  </motion.div>
                )}
              </motion.div>
            </div>
            <h2 className='text-3xl font-bold app-text mb-1' style={{ fontFamily: fontClass }}>
              {streak > 0 ? `${streak} يوم متتالي` : 'ابدأ سلسلتك اليوم'}
            </h2>
            <p className='app-text-2 text-sm mb-3'>{streak >= 7 ? 'ما شاء الله! سلسلة قوية' : streak >= 3 ? 'أحسنت! استمر' : streak > 0 ? 'بداية ممتازة' : 'أكمل أذكار اليوم لتبدأ'}</p>
            <div className='flex items-center justify-center gap-4'>
              <div className='flex items-center gap-1.5'>
                <Droplets className='w-3.5 h-3.5' style={{ color: '#60a5fa' }} />
                <span className='app-text-2 text-xs'>{streakFreezesLeft} تجميد متبقي</span>
              </div>
              <div className='w-px h-4' style={{ background: 'var(--gold-border)' }} />
              <div className='flex items-center gap-1.5'>
                <Star className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-xs'>{gardenPlants.length} نبات</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Week Streak Dots */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>نشاط الأسبوع</span>
          </div>
          <div className='flex justify-between'>
            {recentDays.map((day, i) => (
              <div key={i} className='flex flex-col items-center gap-1.5'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className='w-9 h-9 rounded-xl flex items-center justify-center'
                  style={{
                    background: day.count > 0
                      ? `linear-gradient(135deg, ${streak >= 7 ? '#ef4444' : '#f97316'}, ${streak >= 7 ? '#f97316' : '#fbbf24'})`
                      : 'var(--app-ring-track)',
                    boxShadow: day.count > 0 ? `0 0 12px ${streak >= 7 ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}` : 'none',
                  }}
                >
                  {day.count > 0 && <Flame className='w-4 h-4 text-white' />}
                </motion.div>
                <span className={`text-[9px] ${i === 6 ? 'app-text font-medium' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{day.dayName}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Garden Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Flower2 className='w-4 h-4 text-emerald-500' />
              <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>نباتاتي ({gardenPlants.length})</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-12 rounded-full h-1.5' style={{ background: 'var(--app-ring-track)' }}>
                <div className='h-1.5 rounded-full bg-emerald-500' style={{ width: `${Math.min(gardenLevel * 10, 100)}%` }} />
              </div>
              <span className='text-[10px] app-text-muted'>مستوى {gardenLevel}</span>
            </div>
          </div>

          {gardenPlants.length === 0 ? (
            <div className='text-center py-8'>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <IslamicIcon name='circle-dot' className='w-12 h-12 mx-auto mb-3 app-text-muted' color='#4b5563' />
              </motion.div>
              <p className='app-text-2 text-sm mb-1' style={{ fontFamily: fontClass }}>حديقتك فارغة</p>
              <p className='app-text-muted text-xs'>أكمل أذكار اليوم لتحصل على أول نبتة</p>
            </div>
          ) : (
            <div className='grid grid-cols-4 gap-3'>
              {gardenPlants.map((plant, i) => {
                const cfg = plantConfig[plant.type] || plantConfig.seed;
                return (
                  <motion.button
                    key={plant.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: i * 0.03 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfo(showInfo === plant.id ? null : plant.id)}
                    className='flex flex-col items-center gap-1.5 p-2 rounded-xl app-surface-h transition-colors relative'
                  >
                    <GardenPlantSVG type={plant.type} size={cfg.size * 0.7} color={cfg.color} delay={i * 0.03} />
                    <span className='text-[9px] app-text-2' style={{ fontFamily: fontClass }}>{cfg.label}</span>
                    {showInfo === plant.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg glass-card text-[9px] app-text whitespace-nowrap z-20'
                      >
                        يوم {plant.dayEarned}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Unlocked Plants Preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Sparkles className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>النباتات المتاحة</span>
          </div>
          <div className='flex gap-3 overflow-x-auto pb-2'>
            {unlockedTypes.map(([type, cfg]) => (
              <div key={type} className='flex flex-col items-center gap-1 flex-shrink-0'>
                <div className='w-12 h-12 rounded-xl flex items-center justify-center' style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                  <IslamicIcon name={cfg.icon} className='w-6 h-6' color={cfg.color} />
                </div>
                <span className='text-[9px] app-text-2'>{cfg.label}</span>
                {plantCounts[type] ? (
                  <span className='text-[8px] px-1.5 rounded-full' style={{ background: `${cfg.color}20`, color: cfg.color }}>{plantCounts[type]}</span>
                ) : null}
              </div>
            ))}
            {lockedTypes.map(([type, cfg]) => (
              <div key={type} className='flex flex-col items-center gap-1 flex-shrink-0 opacity-40'>
                <div className='w-12 h-12 rounded-xl flex items-center justify-center app-surface'>
                  <Lock className='w-5 h-5 app-text-muted' />
                </div>
                <span className='text-[9px] app-text-muted'>{cfg.label}</span>
                <span className='text-[8px] app-text-muted'>{cfg.unlockDay} يوم</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Motivational Tip */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <Leaf className='w-4 h-4 text-emerald-500' />
            </div>
            <div>
              <h4 className='app-text font-medium text-sm mb-1' style={{ fontFamily: fontClass }}>كيف تنمي حديقتك؟</h4>
              <p className='app-text-2 text-xs leading-relaxed'>
                أكمل أذكار الصباح والمساء كل يوم لتحافظ على سلسلتك. كل 3 أيام متتالية تحصل على نبتة جديدة. كلما طالت سلسلتك، حصلت على نباتات أجمل!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}