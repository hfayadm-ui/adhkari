'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrCategories } from '@/lib/dhikr-data';
import { Flame, TreePine, Star, TrendingUp, Calendar, Award, Zap } from 'lucide-react';

export default function StatsScreen() {
  const { streak, treeLevel, totalAllTime, completedPrayers, freeCounter, weeklyData, themeColor } = useDhikrStore();

  const treeEmojis = ['🌱', '🌿', '🌳', '🎄', '🌴', '🏰', '🕌'];
  const treeNames = ['بذرة', 'نبتة صغيرة', 'شجرة صغيرة', 'شجرة عادية', 'نخلة', 'حديقة', 'جنة صغيرة'];

  // Mock weekly chart data
  const weekLabels = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const weekValues = weeklyData.length > 0
    ? weekLabels.map((_, i) => weeklyData[i]?.totalDhikr || 0)
    : [0, 0, 0, completedPrayers.length * 134 + freeCounter, 0, 0, 0];
  const maxVal = Math.max(...weekValues, 1);

  // Category breakdown
  const subhan = completedPrayers.length * 33;
  const hamd = completedPrayers.length * 33;
  const takbir = completedPrayers.length * 33;
  const istighfar = completedPrayers.length * 3;

  const todayIdx = new Date().getDay();
  const dayMap: Record<number, number> = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <h1 className='text-2xl font-bold text-white' style={{ fontFamily: 'var(--font-arabic)' }}>📊 الإحصائيات والإنجازات</h1>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-4'>
        {/* Top Stats Cards */}
        <div className='grid grid-cols-3 gap-2'>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='rounded-2xl bg-amber-900/30 border border-amber-700/15 p-3 text-center'>
            <Flame className='w-5 h-5 text-amber-400 mx-auto mb-1' />
            <motion.span key={streak} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold text-amber-300 block'>{streak}</motion.span>
            <span className='text-amber-300/40 text-[10px]'>سلسلة</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='rounded-2xl bg-green-900/30 border border-green-700/15 p-3 text-center'>
            <span className='text-2xl block mb-1'>{treeEmojis[Math.min(treeLevel, 6)]}</span>
            <span className='text-lg font-bold text-green-300 block'>Lv.{treeLevel}</span>
            <span className='text-green-300/40 text-[10px]'>{treeNames[Math.min(treeLevel, 6)]}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='rounded-2xl bg-emerald-900/30 border border-emerald-700/15 p-3 text-center'>
            <TrendingUp className='w-5 h-5 text-emerald-400 mx-auto mb-1' />
            <motion.span key={totalAllTime} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold text-emerald-300 block'>{totalAllTime}</motion.span>
            <span className='text-emerald-300/40 text-[10px]'>إجمالي</span>
          </motion.div>
        </div>

        {/* Weekly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='rounded-2xl bg-white/5 border border-white/10 p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-white font-medium text-sm flex items-center gap-2' style={{ fontFamily: 'var(--font-arabic)' }}><Calendar className='w-4 h-4 text-emerald-400' /> هذا الأسبوع</h3>
          </div>
          <div className='flex items-end justify-between gap-2 h-32 px-1'>
            {weekValues.map((v, i) => {
              const h = maxVal > 0 ? (v / maxVal) * 100 : 0;
              const isToday = i === (dayMap[todayIdx] ?? 3);
              return (
                <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                  <span className='text-[9px] text-slate-400'>{v > 0 ? v : ''}</span>
                  <div className='w-full rounded-t-lg relative' style={{ height: '100px' }}>
                    <div className='absolute bottom-0 w-full rounded-t-lg transition-all duration-700'
                      style={{
                        height: `${Math.max(h, 3)}%`,
                        background: isToday ? 'linear-gradient(to top, #34d399, #14b8a6)' : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  </div>
                  <span className={`text-[9px] ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>{weekLabels[i]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dhikr Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='rounded-2xl bg-white/5 border border-white/10 p-4'>
          <h3 className='text-white font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: 'var(--font-arabic)' }}><Award className='w-4 h-4 text-amber-400' /> تفصيل الأذكار</h3>
          <div className='space-y-2.5'>
            {[
              { name: 'سبحان الله', count: subhan, emoji: '🙏' },
              { name: 'الحمد لله', count: hamd, emoji: '🙏' },
              { name: 'الله أكبر', count: takbir, emoji: '☪️' },
              { name: 'أستغفر الله', count: istighfar, emoji: '🙏' },
              { name: 'عداد حر', count: freeCounter, emoji: '🤚' },
            ].map((item, i) => (
              <div key={i} className='flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]'>
                <div className='flex items-center gap-2.5'>
                  <span className='text-lg'>{item.emoji}</span>
                  <span className='text-slate-200 text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>{item.name}</span>
                </div>
                <span className='text-emerald-300 font-bold'>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className='mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-between'>
            <div className='flex items-center gap-2'><Star className='w-5 h-5 text-emerald-400' /><span className='text-emerald-200 text-sm font-medium'>الإجمالي</span></div>
            <span className='text-emerald-300 font-bold text-lg'>{(subhan + hamd + takbir + istighfar + freeCounter).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='rounded-2xl bg-white/5 border border-white/10 p-4'>
          <h3 className='text-white font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: 'var(--font-arabic)' }}><Zap className='w-4 h-4 text-amber-400' /> الإنجازات</h3>
          <div className='grid grid-cols-3 gap-2'>
            {[
              { name: 'البداية', emoji: streak >= 1 ? '✅' : '🔒', done: streak >= 1 },
              { name: 'ثابت 3 أيام', emoji: streak >= 3 ? '✅' : '🔒', done: streak >= 3 },
              { name: 'أسبوع كامل', emoji: streak >= 7 ? '✅' : '🔒', done: streak >= 7 },
              { name: 'نصف شهر', emoji: streak >= 15 ? '✅' : '🔒', done: streak >= 15 },
              { name: 'شجرة مثمرة', emoji: treeLevel >= 5 ? '✅' : '🔒', done: treeLevel >= 5 },
              { name: 'ألف ذكر', emoji: totalAllTime >= 1000 ? '✅' : '🔒', done: totalAllTime >= 1000 },
            ].map((a, i) => (
              <div key={i} className={`rounded-xl p-2.5 text-center transition-all ${a.done ? 'bg-amber-500/10 border border-amber-500/15' : 'bg-white/[0.03] border border-white/5'}`}>
                <span className='text-xl block mb-0.5'>{a.emoji}</span>
                <span className={`text-[9px] ${a.done ? 'text-amber-200' : 'text-slate-500'}`}>{a.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}