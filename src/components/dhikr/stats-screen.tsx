'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Flame, TrendingUp, Calendar, Award, Zap, Star, Trophy, Clock, Target, Trees } from '@/components/dhikr/islamic-icons';
import { getFontClass } from '@/lib/font-utils';

export default function StatsScreen() {
  const {
    streak, treeLevel, totalAllTime, completedPrayers, freeCounter,
    weeklyData, arabicFont, gardenPlants, gardenLevel, streakFreezesLeft,
  } = useDhikrStore();

  const fontVar = getFontClass(arabicFont);

  // --- Real calculations ---
  const today = new Date().toDateString();
  const todayData = weeklyData.find(d => d.date === today);
  const todayDhikr = todayData?.dhikrCount || 0;
  const todayFree = todayData?.freeCount || freeCounter;
  const todaySessions = todayData?.sessionsCount || 0;
  const todayPrayers = todayData?.prayersCompleted?.length || completedPrayers.length;

  // Week totals
  const weekTotalDhikr = weeklyData.reduce((s, d) => s + d.dhikrCount, 0);
  const weekTotalFree = weeklyData.reduce((s, d) => s + d.freeCount, 0);
  const weekTotalSessions = weeklyData.reduce((s, d) => s + d.sessionsCount, 0);
  const weekActiveDays = weeklyData.filter(d => d.dhikrCount > 0 || d.freeCount > 0).length;
  const weekAvgPerDay = weekActiveDays > 0 ? Math.round((weekTotalDhikr + weekTotalFree) / weekActiveDays) : 0;

  // Best day this week
  const bestDay = weeklyData.reduce((best, d) => {
    const total = d.dhikrCount + d.freeCount;
    return total > (best.dhikrCount + best.freeCount) ? d : best;
  }, weeklyData[0]);

  // Chart data — last 7 days with real daily counts
  const dayNames = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const record = weeklyData.find(r => r.date === dateStr);
    const total = (record?.dhikrCount || 0) + (record?.freeCount || 0);
    const dayIdx = d.getDay();
    return { label: dayNames[dayIdx], value: total, isToday: dateStr === today };
  });
  const maxChart = Math.max(...chartData.map(d => d.value), 1);

  // Completed challenges
  const { challenges } = useDhikrStore.getState();
  const completedChallenges = challenges.filter(c => c.completed).length;
  const activeChallenges = challenges.filter(c => !c.completed).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='bar-chart' className='w-7 h-7' color='var(--gold-accent)' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>الإحصائيات</h1>
        </div>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-4'>
        {/* Today's Stats — Real */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='glass-glow rounded-2xl p-4 relative overflow-hidden'>
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10'>
            <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Clock className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> إحصائيات اليوم
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block' style={{ color: 'var(--gold-bright)' }}>{todayDhikr + todayFree}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>ذكر اليوم</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-emerald-400'>{todayPrayers}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>صلاة مكتملة</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-blue-400'>{todaySessions}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>جلسة</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-purple-400'>{todayFree}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>عداد حر</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Week Summary Cards */}
        <div className='grid grid-cols-3 gap-2'>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='glass-card rounded-2xl p-3 text-center'>
            <Flame className='w-5 h-5 mx-auto mb-1' style={{ color: streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : 'var(--gold-accent)' }} />
            <motion.span key={streak} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold block' style={{ color: 'var(--gold-bright)' }}>{streak}</motion.span>
            <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>سلسلة</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl p-3 text-center'>
            <TrendingUp className='w-5 h-5 text-emerald-400 mx-auto mb-1' />
            <span className='text-lg font-bold text-emerald-400 block'>{weekTotalDhikr + weekTotalFree}</span>
            <span className='text-emerald-400/50 text-[10px]'>أسبوعي</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl p-3 text-center'>
            <Target className='w-5 h-5 text-blue-400 mx-auto mb-1' />
            <span className='text-lg font-bold text-blue-400 block'>{weekAvgPerDay}</span>
            <span className='text-blue-400/50 text-[10px]'>معدل/يوم</span>
          </motion.div>
        </div>

        {/* Real Weekly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center justify-between mb-1'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Calendar className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> آخر 7 أيام
            </h3>
            <span className='app-text-muted text-[10px]'>{weekActiveDays}/7 أيام نشطة</span>
          </div>
          <p className='app-text-muted text-[10px] mb-3'>{weekTotalSessions} جلسة هذا الأسبوع</p>
          <div className='flex items-end justify-between gap-2 h-32 px-1'>
            {chartData.map((d, i) => {
              const h = maxChart > 0 ? (d.value / maxChart) * 100 : 0;
              return (
                <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                  <span className='text-[9px] app-text-2'>{d.value > 0 ? d.value : ''}</span>
                  <div className='w-full rounded-t-lg relative' style={{ height: '100px' }}>
                    <motion.div
                      className='absolute bottom-0 w-full rounded-t-lg'
                      style={{
                        height: `${Math.max(h, 4)}%`,
                        background: d.isToday
                          ? 'linear-gradient(to top, var(--gold-accent), var(--gold-bright))'
                          : d.value > 0
                            ? 'linear-gradient(to top, rgba(197,160,89,0.4), rgba(197,160,89,0.7))'
                            : 'var(--app-ring-track)',
                        boxShadow: d.isToday ? '0 0 8px rgba(197,160,89,0.4)' : 'none',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(h, 4)}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05 }}
                    />
                  </div>
                  <span className={`text-[9px] ${d.isToday ? 'font-bold' : 'app-text-muted'}`}
                    style={d.isToday ? { color: 'var(--gold-accent)' } : undefined}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Garden & Progress Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Trees className='w-4 h-4 text-emerald-500' /> التقدم العام
          </h3>
          <div className='space-y-2.5'>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Flame className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>أطول سلسلة</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{streak} يوم</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <TrendingUp className='w-5 h-5 text-emerald-400' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>إجمالي الأذكار</span>
              </div>
              <span className='font-bold text-emerald-400'>{totalAllTime.toLocaleString()}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <IslamicIcon name={treeIcons[Math.min(treeLevel, treeIcons.length - 1)]} className='w-5 h-5 text-emerald-500' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>مستوى الشجرة</span>
              </div>
              <span className='font-bold text-emerald-500'>{treeLevel} - {treeNames[Math.min(treeLevel, treeNames.length - 1)]}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Trees className='w-5 h-5 text-emerald-400' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>حديقتي</span>
              </div>
              <span className='font-bold text-emerald-400'>{gardenPlants.length} نبات (مستوى {gardenLevel})</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Trophy className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>التحديات</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{completedChallenges} مكتمل / {activeChallenges} نشط</span>
            </div>
            {bestDay && (bestDay.dhikrCount + bestDay.freeCount) > 0 && (
              <div className='flex items-center justify-between p-2.5 rounded-xl' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                <div className='flex items-center gap-2.5'>
                  <Star className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
                  <span className='app-text text-sm font-medium' style={{ fontFamily: fontVar }}>أفضل يوم</span>
                </div>
                <div className='text-left'>
                  <span className='font-bold block' style={{ color: 'var(--gold-bright)' }}>{bestDay.dhikrCount + bestDay.freeCount} ذكر</span>
                  <span className='text-[9px] app-text-muted'>{bestDay.date}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievements — Real */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='glass-card rounded-2xl p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Zap className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> الإنجازات
          </h3>
          <div className='grid grid-cols-3 gap-2'>
            {[
              { name: 'البداية', done: streak >= 1, icon: 'flame' },
              { name: '3 أيام', done: streak >= 3, icon: 'flame' },
              { name: 'أسبوع', done: streak >= 7, icon: 'star' },
              { name: 'نصف شهر', done: streak >= 15, icon: 'trophy' },
              { name: 'شجرة مثمرة', done: treeLevel >= 5, icon: 'tree-pine' },
              { name: 'ألف ذكر', done: totalAllTime >= 1000, icon: 'trending-up' },
              { name: 'حديقة', done: gardenPlants.length >= 3, icon: 'trees' },
              { name: '10 آلاف', done: totalAllTime >= 10000, icon: 'award' },
              { name: 'مستوى 5', done: gardenLevel >= 5, icon: 'sparkles' },
            ].map((a, i) => (
              <div key={i}
                className={`rounded-xl p-2.5 text-center transition-all ${a.done ? '' : 'app-surface opacity-40'}`}
                style={a.done ? { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' } : undefined}
              >
                <IslamicIcon name={a.done ? 'check-circle' : 'lock'} className={`w-5 h-5 mx-auto mb-0.5 ${a.done ? '' : 'app-text-muted'}`} color={a.done ? 'var(--gold-bright)' : undefined} />
                <span className={`text-[9px] block ${a.done ? 'app-text' : 'app-text-muted'}`} style={{ fontFamily: fontVar }}>{a.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
