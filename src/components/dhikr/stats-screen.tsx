'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import { treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Flame, TrendingUp, Calendar, Award, Zap, Star, TreePine } from '@/components/dhikr/islamic-icons';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)', 'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)', 'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)', 'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function StatsScreen() {
  const { streak, treeLevel, totalAllTime, completedPrayers, freeCounter, weeklyData, arabicFont } = useDhikrStore();
  const fontVar = getFontClass(arabicFont);

  const weekLabels = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const weekValues = weeklyData.length > 0
    ? weekLabels.map((_, i) => weeklyData[i]?.totalDhikr || 0)
    : [0, 0, 0, completedPrayers.length * 134 + freeCounter, 0, 0, 0];
  const maxVal = Math.max(...weekValues, 1);

  const subhan = completedPrayers.length * 33;
  const hamd = completedPrayers.length * 33;
  const takbir = completedPrayers.length * 33;
  const istighfar = completedPrayers.length * 3;

  const todayIdx = new Date().getDay();
  const dayMap: Record<number, number> = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='bar-chart' className='w-7 h-7 text-amber-400' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>الإحصائيات والإنجازات</h1>
        </div>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-4'>
        {/* Top Stats Cards */}
        <div className='grid grid-cols-3 gap-2'>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-2xl border-amber-700/15 p-3 text-center'>
            <Flame className='w-5 h-5 text-amber-400 mx-auto mb-1' />
            <motion.span key={streak} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold text-amber-300 block'>{streak}</motion.span>
            <span className='text-amber-300/40 text-[10px]' style={{ fontFamily: fontVar }}>سلسلة</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='glass-card rounded-2xl border-green-700/15 p-3 text-center'>
            <IslamicIcon name={treeIcons[Math.min(treeLevel, 6)]} className='w-6 h-6 text-green-400 mx-auto mb-1' />
            <span className='text-lg font-bold text-green-300 block'>Lv.{treeLevel}</span>
            <span className='text-green-300/40 text-[10px]' style={{ fontFamily: fontVar }}>{treeNames[Math.min(treeLevel, 6)]}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl border-emerald-700/15 p-3 text-center'>
            <TrendingUp className='w-5 h-5 text-emerald-400 mx-auto mb-1' />
            <motion.span key={totalAllTime} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold text-emerald-300 block'>{totalAllTime}</motion.span>
            <span className='text-emerald-300/40 text-[10px]'>إجمالي</span>
          </motion.div>
        </div>

        {/* Weekly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl app-border-c p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Calendar className='w-4 h-4 text-amber-400' /> هذا الأسبوع
            </h3>
          </div>
          <div className='flex items-end justify-between gap-2 h-32 px-1'>
            {weekValues.map((v, i) => {
              const h = maxVal > 0 ? (v / maxVal) * 100 : 0;
              const isToday = i === (dayMap[todayIdx] ?? 3);
              return (
                <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                  <span className='text-[9px] app-text-2'>{v > 0 ? v : ''}</span>
                  <div className='w-full rounded-t-lg relative' style={{ height: '100px' }}>
                    <div className='absolute bottom-0 w-full rounded-t-lg transition-all duration-700'
                      style={{
                        height: `${Math.max(h, 3)}%`,
                        background: isToday ? 'linear-gradient(to top, #f59e0b, #fbbf24)' : 'var(--app-chart-bar)',
                      }}
                    />
                  </div>
                  <span className={`text-[9px] ${isToday ? 'text-amber-400 font-bold' : 'app-text-muted'}`}>{weekLabels[i]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dhikr Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl app-border-c p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Award className='w-4 h-4 text-amber-400' /> تفصيل الأذكار
          </h3>
          <div className='space-y-2.5'>
            {[
              { name: 'سبحان الله', count: subhan, icon: 'sparkles' },
              { name: 'الحمد لله', count: hamd, icon: 'heart' },
              { name: 'الله أكبر', count: takbir, icon: 'crescent' },
              { name: 'أستغفر الله', count: istighfar, icon: 'shield' },
              { name: 'عداد حر', count: freeCounter, icon: 'hand' },
            ].map((item, i) => (
              <div key={i} className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
                <div className='flex items-center gap-2.5'>
                  <IslamicIcon name={item.icon} className='w-5 h-5 text-amber-400/60' />
                  <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>{item.name}</span>
                </div>
                <span className='text-amber-300 font-bold'>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className='mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-between'>
            <div className='flex items-center gap-2'><Star className='w-5 h-5 text-amber-400' /><span className='text-amber-200 text-sm font-medium' style={{ fontFamily: fontVar }}>الإجمالي</span></div>
            <span className='text-amber-300 font-bold text-lg'>{(subhan + hamd + takbir + istighfar + freeCounter).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl app-border-c p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Zap className='w-4 h-4 text-amber-400' /> الإنجازات
          </h3>
          <div className='grid grid-cols-3 gap-2'>
            {[
              { name: 'البداية', done: streak >= 1 },
              { name: 'ثابت 3 أيام', done: streak >= 3 },
              { name: 'أسبوع كامل', done: streak >= 7 },
              { name: 'نصف شهر', done: streak >= 15 },
              { name: 'شجرة مثمرة', done: treeLevel >= 5 },
              { name: 'ألف ذكر', done: totalAllTime >= 1000 },
            ].map((a, i) => (
              <div key={i} className={`rounded-xl p-2.5 text-center transition-all ${a.done ? 'bg-amber-500/10 border border-amber-500/15' : 'app-surface border app-border-c'}`}>
                <IslamicIcon name={a.done ? 'check-circle' : 'lock'} className={`w-5 h-5 mx-auto mb-0.5 ${a.done ? 'text-amber-300' : 'app-text-muted'}`} />
                <span className={`text-[9px] block ${a.done ? 'text-amber-200' : 'app-text-muted'}`} style={{ fontFamily: fontVar }}>{a.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
