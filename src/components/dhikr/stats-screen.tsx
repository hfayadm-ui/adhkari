'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Flame, TrendingUp, Calendar, Award, Zap, Star, Trophy, Clock, Target, Trees, Heart, ChevronDown, ChevronUp } from '@/components/dhikr/islamic-icons';
import { getFontClass } from '@/lib/font-utils';
import { useState } from 'react';

// Helper: format a date string like "Mon Sep 01 2025" to Arabic short form
function formatDay(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const days = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
    return days[d.getDay()];
  } catch { return ''; }
}

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  } catch { return ''; }
}

export default function StatsScreen() {
  const {
    streak, bestStreak, treeLevel, totalAllTime, completedPrayers,
    weeklyData, arabicFont, streakFreezesLeft,
    favorites, customDhikr, challenges, streakDays,
  } = useDhikrStore();

  const [showMonthly, setShowMonthly] = useState(false);
  const fontVar = getFontClass(arabicFont);

  // === REAL TODAY STATS ===
  const today = new Date().toDateString();
  const todayData = weeklyData.find(d => d.date === today);
  const todayDhikr = todayData?.dhikrCount || 0;
  const todayFree = todayData?.freeCount || 0;
  const todaySessions = todayData?.sessionsCount || 0;
  const todayPrayers = todayData?.prayersCompleted?.length || completedPrayers.length;
  const todayTotal = todayDhikr + todayFree;

  // === REAL WEEKLY STATS ===
  const weekTotalDhikr = weeklyData.reduce((s, d) => s + (d.dhikrCount || 0), 0);
  const weekTotalFree = weeklyData.reduce((s, d) => s + (d.freeCount || 0), 0);
  const weekTotalSessions = weeklyData.reduce((s, d) => s + (d.sessionsCount || 0), 0);
  const weekTotalAll = weekTotalDhikr + weekTotalFree;
  const weekActiveDays = weeklyData.filter(d => (d.dhikrCount || 0) > 0 || (d.freeCount || 0) > 0).length;
  const weekAvgPerDay = weekActiveDays > 0 ? Math.round(weekTotalAll / weekActiveDays) : 0;

  // Best day this week
  const bestDay = weeklyData.reduce((best, d) => {
    const total = (d.dhikrCount || 0) + (d.freeCount || 0);
    return total > ((best.dhikrCount || 0) + (best.freeCount || 0)) ? d : best;
  }, weeklyData[0]);

  // Week prayer completion rate
  const weekTotalPrayerSlots = weeklyData.length * 5;
  const weekTotalPrayersDone = weeklyData.reduce((s, d) => s + (d.prayersCompleted?.length || 0), 0);
  const weekPrayerRate = weekTotalPrayerSlots > 0 ? Math.round((weekTotalPrayersDone / weekTotalPrayerSlots) * 100) : 0;

  // === 7-DAY CHART (from weeklyData) ===
  const dayNames = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const record = weeklyData.find(r => r.date === dateStr);
    const total = (record?.dhikrCount || 0) + (record?.freeCount || 0);
    const dayIdx = d.getDay();
    return { label: dayNames[dayIdx], value: total, isToday: dateStr === today, dateStr };
  });
  const maxChart = Math.max(...chartData.map(d => d.value), 1);

  // === MONTHLY STATS (from streakDays — last 30 days) ===
  const monthTotal = streakDays.reduce((s, d) => s + (d.count || 0), 0);
  const monthActiveDays = streakDays.filter(d => (d.count || 0) > 0).length;
  const monthAvg = monthActiveDays > 0 ? Math.round(monthTotal / monthActiveDays) : 0;
  const monthBestDay = streakDays.reduce((best, d) => (d.count || 0) > (best.count || 0) ? d : best, streakDays[0]);

  // 30-day activity grid (6 columns x 5 rows)
  const monthGrid = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toDateString();
    const dayData = streakDays.find(s => s.date === dateStr);
    const count = dayData?.count || 0;
    return { dateStr, day: d.getDate(), count, isToday: dateStr === today };
  });
  const maxMonthDay = Math.max(...monthGrid.map(d => d.count), 1);

  // === CHALLENGES ===
  const completedChallenges = challenges.filter(c => c.completed).length;
  const activeChallenges = challenges.filter(c => !c.completed).length;

  // === ACHIEVEMENTS (real milestones) ===
  const achievements = [
    { name: 'البداية', done: streak >= 1, icon: 'flame', desc: 'أول يوم نشاط' },
    { name: '3 أيام', done: streak >= 3, icon: 'flame', desc: '3 أيام متتالية' },
    { name: 'أسبوع', done: streak >= 7, icon: 'star', desc: '7 أيام متتالية' },
    { name: 'نصف شهر', done: streak >= 15, icon: 'trophy', desc: '15 يوم متتالي' },
    { name: 'شجرة مثمرة', done: treeLevel >= 5, icon: 'tree-pine', desc: 'مستوى الشجرة 5' },
    { name: 'ألف ذكر', done: totalAllTime >= 1000, icon: 'trending-up', desc: '1000 ذكر إجمالي' },
    { name: '10 آلاف', done: totalAllTime >= 10000, icon: 'award', desc: '10000 ذكر إجمالي' },
    { name: 'مئة ذكر/يوم', done: weekAvgPerDay >= 100, icon: 'zap', desc: 'معدل 100 يومياً' },
    { name: 'أفضل سلسلة', done: bestStreak >= 30, icon: 'trophy', desc: 'أفضل سلسلة 30 يوم' },
    { name: 'تحدي مكتمل', done: completedChallenges >= 1, icon: 'award', desc: 'إكمال تحدي واحد' },
  ];
  const doneCount = achievements.filter(a => a.done).length;
  const nextAchievement = achievements.find(a => !a.done);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='bar-chart' className='w-7 h-7' color='var(--gold-accent)' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>الإحصائيات</h1>
        </div>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-4'>
        {/* ===== TODAY'S STATS ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='glass-glow rounded-2xl p-4 relative overflow-hidden'>
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10'>
            <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Clock className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> إحصائيات اليوم
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block' style={{ color: 'var(--gold-bright)' }}>{todayTotal}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>إجمالي اليوم</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-emerald-400'>{todayPrayers}/5</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>صلاة مكتملة</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-blue-400'>{todaySessions}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>جلسة مكتملة</span>
              </div>
              <div className='p-3 rounded-xl app-surface text-center'>
                <span className='text-2xl font-bold block text-purple-400'>{todayDhikr}</span>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>ذكر من جلسات</span>
              </div>
            </div>
            {/* Prayer progress bar */}
            <div className='mt-3'>
              <div className='flex justify-between items-center mb-1'>
                <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>تقدم الصلوات اليوم</span>
                <span className='text-[10px] font-medium' style={{ color: 'var(--gold-accent)' }}>{todayPrayers >= 5 ? 'مكتمل' : `${todayPrayers}/5`}</span>
              </div>
              <div className='w-full rounded-full h-2' style={{ background: 'var(--app-ring-track)' }}>
                <motion.div className='h-2 rounded-full'
                  style={{ background: todayPrayers >= 5 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }}
                  animate={{ width: `${(todayPrayers / 5) * 100}%` }} transition={{ duration: 0.6 }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== WEEKLY SUMMARY CARDS ===== */}
        <div className='grid grid-cols-4 gap-2'>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='glass-card rounded-2xl p-2.5 text-center'>
            <Flame className='w-4 h-4 mx-auto mb-1' style={{ color: streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : 'var(--gold-accent)' }} />
            <motion.span key={streak} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-lg font-bold block' style={{ color: 'var(--gold-bright)' }}>{streak}</motion.span>
            <span className='app-text-muted text-[9px]' style={{ fontFamily: fontVar }}>سلسلة</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl p-2.5 text-center'>
            <TrendingUp className='w-4 h-4 text-emerald-400 mx-auto mb-1' />
            <span className='text-base font-bold text-emerald-400 block'>{weekTotalAll}</span>
            <span className='text-emerald-400/50 text-[9px]'>أسبوعي</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl p-2.5 text-center'>
            <Target className='w-4 h-4 text-blue-400 mx-auto mb-1' />
            <span className='text-base font-bold text-blue-400 block'>{weekAvgPerDay}</span>
            <span className='text-blue-400/50 text-[9px]'>معدل/يوم</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-2.5 text-center'>
            <Calendar className='w-4 h-4 text-purple-400 mx-auto mb-1' />
            <span className='text-base font-bold text-purple-400 block'>{weekActiveDays}/7</span>
            <span className='text-purple-400/50 text-[9px]'>أيام نشطة</span>
          </motion.div>
        </div>

        {/* ===== WEEKLY BAR CHART ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center justify-between mb-1'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Calendar className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> آخر 7 أيام
            </h3>
            <span className='app-text-muted text-[10px]'>{weekTotalSessions} جلسة</span>
          </div>
          <p className='app-text-muted text-[10px] mb-3'>نسبة إكمال الصلوات: {weekPrayerRate}%</p>
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

        {/* ===== MONTHLY OVERVIEW (expandable) ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl p-4'>
          <button onClick={() => setShowMonthly(!showMonthly)} className='w-full flex items-center justify-between'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <TrendingUp className='w-4 h-4 text-purple-400' /> نظرة شهرية (30 يوم)
            </h3>
            {showMonthly ? <ChevronUp className='w-4 h-4 app-text-muted' /> : <ChevronDown className='w-4 h-4 app-text-muted' />}
          </button>

          <div className='grid grid-cols-3 gap-2 mt-3'>
            <div className='p-2 rounded-xl app-surface text-center'>
              <span className='text-lg font-bold block text-purple-400'>{monthTotal.toLocaleString()}</span>
              <span className='app-text-muted text-[9px]' style={{ fontFamily: fontVar }}>إجمالي الشهر</span>
            </div>
            <div className='p-2 rounded-xl app-surface text-center'>
              <span className='text-lg font-bold block text-emerald-400'>{monthActiveDays}</span>
              <span className='app-text-muted text-[9px]' style={{ fontFamily: fontVar }}>يوم نشط</span>
            </div>
            <div className='p-2 rounded-xl app-surface text-center'>
              <span className='text-lg font-bold block' style={{ color: 'var(--gold-bright)' }}>{monthAvg}</span>
              <span className='app-text-muted text-[9px]' style={{ fontFamily: fontVar }}>معدل/يوم</span>
            </div>
          </div>

          {showMonthly && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className='mt-3'>
              {/* Activity heat grid */}
              <div className='grid grid-cols-6 gap-1.5'>
                {monthGrid.map((d, i) => (
                  <div key={i} className='relative group'>
                    <div
                      className={`aspect-square rounded-lg flex items-center justify-center text-[8px] ${d.isToday ? 'ring-1 ring-[var(--gold-accent)]' : ''}`}
                      style={{
                        background: d.count > 0
                          ? `rgba(197, 160, 89, ${0.15 + (d.count / maxMonthDay) * 0.75})`
                          : 'var(--app-ring-track)',
                      }}
                    >
                      <span className={d.count > 0 ? 'app-text' : 'app-text-muted'}>{d.day}</span>
                    </div>
                  </div>
                ))}
              </div>
              {monthBestDay && monthBestDay.count > 0 && (
                <div className='mt-3 flex items-center justify-between p-2.5 rounded-xl' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                  <div className='flex items-center gap-2'>
                    <Star className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                    <span className='app-text text-xs' style={{ fontFamily: fontVar }}>أفضل يوم هذا الشهر</span>
                  </div>
                  <span className='font-bold text-sm' style={{ color: 'var(--gold-bright)' }}>{monthBestDay.count} ذكر</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* ===== GENERAL PROGRESS ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='glass-card rounded-2xl p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Trees className='w-4 h-4 text-emerald-500' /> التقدم العام
          </h3>
          <div className='space-y-2'>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>السلسلة الحالية</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{streak} يوم</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Trophy className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>أفضل سلسلة</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{bestStreak} يوم</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <TrendingUp className='w-4 h-4 text-emerald-400' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>إجمالي الأذكار</span>
              </div>
              <span className='font-bold text-emerald-400'>{totalAllTime.toLocaleString()}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <IslamicIcon name={treeIcons[Math.min(treeLevel, treeIcons.length - 1)]} className='w-4 h-4 text-emerald-500' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>مستوى الشجرة</span>
              </div>
              <span className='font-bold text-emerald-500'>{treeLevel} - {treeNames[Math.min(treeLevel, treeNames.length - 1)]}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Trees className='w-4 h-4 text-emerald-400' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>حديقتي</span>
              </div>
              <span className='font-bold text-emerald-400'>شجرة مستوى {treeLevel}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Trophy className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>التحديات</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{completedChallenges} مكتمل / {activeChallenges} نشط</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <Heart className='w-4 h-4 text-red-400' />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>المفضلة</span>
              </div>
              <span className='font-bold text-red-400'>{favorites.length}</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-xl app-surface'>
              <div className='flex items-center gap-2.5'>
                <IslamicIcon name='sparkles' className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>أذكار مخصصة</span>
              </div>
              <span className='font-bold' style={{ color: 'var(--gold-accent)' }}>{customDhikr.length}</span>
            </div>
            {/* Best day this week */}
            {bestDay && ((bestDay.dhikrCount || 0) + (bestDay.freeCount || 0)) > 0 && (
              <div className='flex items-center justify-between p-2.5 rounded-xl' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                <div className='flex items-center gap-2.5'>
                  <Star className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                  <span className='app-text text-sm font-medium' style={{ fontFamily: fontVar }}>أفضل يوم هذا الأسبوع</span>
                </div>
                <div className='text-left'>
                  <span className='font-bold block' style={{ color: 'var(--gold-bright)' }}>{(bestDay.dhikrCount || 0) + (bestDay.freeCount || 0)} ذكر</span>
                  <span className='text-[9px] app-text-muted'>{formatDay(bestDay.date)} {formatDateShort(bestDay.date)}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ===== NEXT ACHIEVEMENT ===== */}
        {nextAchievement && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
            className='glass-card rounded-2xl p-4' style={{ border: '1px solid var(--gold-border)' }}>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}>
                <IslamicIcon name={nextAchievement.icon} className='w-5 h-5' color='var(--gold-accent)' />
              </div>
              <div className='flex-1'>
                <p className='app-text text-xs font-medium' style={{ fontFamily: fontVar }}>الإنجاز القادم</p>
                <p className='app-text font-bold text-sm' style={{ fontFamily: fontVar }}>{nextAchievement.name}</p>
                <p className='app-text-muted text-[10px]'>{nextAchievement.desc}</p>
              </div>
              <div className='text-left'>
                <span className='text-xs app-text-muted'>{doneCount}/{achievements.length}</span>
                <div className='w-12 rounded-full h-1.5 mt-1' style={{ background: 'var(--app-ring-track)' }}>
                  <div className='h-1.5 rounded-full' style={{ width: `${(doneCount / achievements.length) * 100}%`, background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== ACHIEVEMENTS GRID ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Zap className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} /> الإنجازات ({doneCount}/{achievements.length})
            </h3>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {achievements.map((a, i) => (
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
