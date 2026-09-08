'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { Trees, Sparkles, Star, Lock, Droplets, Leaf, Flame, Check } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';
import { getFontClass } from '@/lib/font-utils';
import TreeVisualization, { treeConfigs } from '@/components/dhikr/tree-visualization';

const treeLevelNames = ['بذرة', 'نبتة صغيرة', 'شجرة صغيرة', 'شجرة نامية', 'شجرة مثمرة', 'شجرة كبيرة', 'شجرة وارفة', 'شجرة عظيمة'];

export default function GardenScreen() {
  const {
    setCurrentScreen, streak, arabicFont,
    streakFreezesLeft, totalAllTime, streakDays, selectedTree, setSelectedTree,
    treeLevel, setTreeLevel, bestStreak,
  } = useDhikrStore();

  const fontClass = getFontClass(arabicFont);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  // Recent 7 days streak visualization
  const recentDays = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayData = streakDays.find(s => s.date === dateStr);
    return { date: dateStr, dayName: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][d.getDay()], count: dayData?.count || 0 };
  });

  const treeName = treeLevelNames[Math.min(treeLevel, treeLevelNames.length - 1)];
  const currentCfg = treeConfigs[selectedTree] || treeConfigs.olive;
  const growth = Math.min(treeLevel / 10, 1);

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
            <p className='app-text-2 text-xs'>{treeName} — المستوى {treeLevel}</p>
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
                <span className='app-text-2 text-xs'>{totalAllTime} ذكر كلي</span>
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

        {/* Main Tree Display */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-glow rounded-2xl p-5 relative overflow-hidden'>
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-2'>
                <Trees className='w-4 h-4' style={{ color: currentCfg.color }} />
                <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>شجري — {currentCfg.label}</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <span className='text-[10px] app-text-muted'>{treeName}</span>
              </div>
            </div>
            {/* Level progress bar */}
            <div className='w-full rounded-full h-2 mb-4' style={{ background: 'var(--app-ring-track)' }}>
              <motion.div
                className='h-2 rounded-full'
                style={{ background: `linear-gradient(90deg, ${currentCfg.color}, ${currentCfg.color}cc)` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(treeLevel * 10, 100)}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
            {/* Large tree visualization */}
            <div className='flex justify-center py-3'>
              <TreeVisualization treeType={selectedTree} level={treeLevel} size={220} />
            </div>
            {/* Stats under tree */}
            <div className='flex justify-center gap-6 mt-2'>
              <div className='text-center'>
                <p className='text-lg font-bold' style={{ color: currentCfg.color }}>{treeLevel}</p>
                <p className='text-[10px] app-text-muted'>المستوى</p>
              </div>
              <div className='w-px' style={{ background: 'var(--gold-border)' }} />
              <div className='text-center'>
                <p className='text-lg font-bold' style={{ color: 'var(--gold-accent)' }}>{bestStreak}</p>
                <p className='text-[10px] app-text-muted'>أفضل سلسلة</p>
              </div>
              <div className='w-px' style={{ background: 'var(--gold-border)' }} />
              <div className='text-center'>
                <p className='text-lg font-bold' style={{ color: '#f97316' }}>{streak}</p>
                <p className='text-[10px] app-text-muted'>السلسلة</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tree Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Sparkles className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>اختر شجرتك</span>
          </div>
          <div className='grid grid-cols-3 gap-2.5'>
            {Object.entries(treeConfigs).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSelectedTree(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedTree === key ? '' : 'app-surface app-surface-h'}`}
                style={selectedTree === key
                  ? { background: `${cfg.color}12`, border: `1px solid ${cfg.color}35` }
                  : { border: '1px solid transparent' }
                }
              >
                <div className='relative' style={{ width: 44, height: 44 }}>
                  <TreeVisualization treeType={key} level={treeLevel} size={44} />
                  {selectedTree === key && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className='absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center'
                      style={{ background: cfg.color }}
                    >
                      <Check className='w-2.5 h-2.5 text-white' />
                    </motion.div>
                  )}
                </div>
                <span className={`text-[10px] ${selectedTree === key ? 'app-text font-medium' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{cfg.label}</span>
              </button>
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
              <h4 className='app-text font-medium text-sm mb-1' style={{ fontFamily: fontClass }}>كيف تنمي شجرك؟</h4>
              <p className='app-text-2 text-xs leading-relaxed'>
                أكمل أذكار الصباح والمساء كل يوم لتحافظ على سلسلتك. كلما طالت سلسلتك، كبرت شجرتك وازدادت أضواؤها! شجرتك تعكس إيمانك ومداومتك على ذكر الله.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
