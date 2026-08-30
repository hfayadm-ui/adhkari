'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useDhikrStore } from '@/lib/store';
import { treeIcons, treeNames } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Flame, TrendingUp, Calendar, Award, Zap, Star, TreePine, Trophy, X, Plus } from '@/components/dhikr/islamic-icons';

import { getFontClass } from '@/lib/font-utils';

export default function StatsScreen() {
  const { streak, treeLevel, totalAllTime, completedPrayers, freeCounter, weeklyData, arabicFont, challenges, addChallenge, removeChallenge, updateChallengeProgress } = useDhikrStore();
  const fontVar = getFontClass(arabicFont);
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [challengeTarget, setChallengeTarget] = useState(100);
  const [challengeUnit, setChallengeUnit] = useState('ذكر');
  const [challengeDays, setChallengeDays] = useState(7);

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
          <IslamicIcon name='bar-chart' className='w-7 h-7' color='var(--gold-accent)' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>الإحصائيات والإنجازات</h1>
        </div>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-4'>
        {/* Top Stats Cards */}
        <div className='grid grid-cols-3 gap-2'>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-2xl p-3 text-center'>
            <Flame className='w-5 h-5 mx-auto mb-1' color='var(--gold-accent)' />
            <motion.span key={streak} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold block' style={{ color: 'var(--gold-bright)' }}>{streak}</motion.span>
            <span className='app-text-muted text-[10px]' style={{ fontFamily: fontVar }}>سلسلة</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className='glass-card rounded-2xl p-3 text-center'>
            <IslamicIcon name={treeIcons[Math.min(treeLevel, 6)]} className='w-6 h-6 text-green-400 mx-auto mb-1' />
            <span className='text-lg font-bold text-green-300 block'>Lv.{treeLevel}</span>
            <span className='text-green-300/40 text-[10px]' style={{ fontFamily: fontVar }}>{treeNames[Math.min(treeLevel, 6)]}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl p-3 text-center'>
            <TrendingUp className='w-5 h-5 text-emerald-400 mx-auto mb-1' />
            <motion.span key={totalAllTime} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className='text-2xl font-bold text-emerald-300 block'>{totalAllTime}</motion.span>
            <span className='text-emerald-300/40 text-[10px]'>إجمالي</span>
          </motion.div>
        </div>

        {/* Weekly Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl app-border-c p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Calendar className='w-4 h-4' color='var(--gold-accent)' /> هذا الأسبوع
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
                        background: isToday ? 'linear-gradient(to top, #C5A059, #D4AF37)' : 'var(--app-chart-bar)',
                      }}
                    />
                  </div>
                  <span className={`text-[9px] ${isToday ? 'font-bold' : 'app-text-muted'}`} style={isToday ? { color: 'var(--gold-accent)' } : undefined}>{weekLabels[i]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dhikr Breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl app-border-c p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Award className='w-4 h-4' color='var(--gold-accent)' /> تفصيل الأذكار
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
                  <IslamicIcon name={item.icon} className='w-5 h-5 app-text-muted' />
                  <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>{item.name}</span>
                </div>
                <span className='font-bold' style={{ color: 'var(--gold-bright)' }}>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className='mt-3 p-3 rounded-xl flex items-center justify-between' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <div className='flex items-center gap-2'><Star className='w-5 h-5' color='var(--gold-accent)' /><span className='app-text text-sm font-medium' style={{ fontFamily: fontVar }}>الإجمالي</span></div>
            <span className='font-bold text-lg' style={{ color: 'var(--gold-bright)' }}>{(subhan + hamd + takbir + istighfar + freeCounter).toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl app-border-c p-4'>
          <h3 className='app-text font-medium text-sm mb-3 flex items-center gap-2' style={{ fontFamily: fontVar }}>
            <Zap className='w-4 h-4' color='var(--gold-accent)' /> الإنجازات
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
              <div key={i} className={`rounded-xl p-2.5 text-center transition-all ${a.done ? '' : 'app-surface border app-border-c'}`}
                style={a.done ? { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' } : undefined}
              >
                <IslamicIcon name={a.done ? 'check-circle' : 'lock'} className={`w-5 h-5 mx-auto mb-0.5 ${a.done ? '' : 'app-text-muted'}`} color={a.done ? 'var(--gold-bright)' : undefined} />
                <span className={`text-[9px] block ${a.done ? 'app-text' : 'app-text-muted'}`} style={{ fontFamily: fontVar }}>{a.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Weekly Challenges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='glass-card rounded-2xl app-border-c p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='app-text font-medium text-sm flex items-center gap-2' style={{ fontFamily: fontVar }}>
              <Trophy className='w-4 h-4' color='var(--gold-accent)' /> تحديات الأسبوع
            </h3>
          </div>

          {challenges.length === 0 && !showAddChallenge && (
            <div className='text-center py-4'>
              <p className='app-text-muted text-sm mb-3' style={{ fontFamily: fontVar }}>لا توجد تحديات نشطة</p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAddChallenge(true)}
                className='btn-gold px-5 py-2.5 rounded-xl text-sm font-bold'
                style={{ fontFamily: fontVar }}
              >
                <span className='flex items-center gap-1.5'><Plus className='w-4 h-4' /> إضافة تحدي</span>
              </motion.button>
            </div>
          )}

          <AnimatePresence>
            {showAddChallenge && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='overflow-hidden'
              >
                <div className='space-y-3 p-3 rounded-xl glass-subtle mb-3' style={{ border: '1px solid var(--gold-border)' }}>
                  <input
                    type='text'
                    value={challengeName}
                    onChange={e => setChallengeName(e.target.value)}
                    placeholder='اسم التحدي...'
                    className='w-full px-3 py-2.5 rounded-xl glass-card app-text text-sm placeholder:app-text-muted focus:outline-none transition-colors'
                    style={{ fontFamily: fontVar }}
                  />
                  <div className='flex gap-2'>
                    <div className='flex-1'>
                      <label className='app-text-2 text-[10px] mb-1 block'>الهدف</label>
                      <input
                        type='number'
                        value={challengeTarget}
                        onChange={e => setChallengeTarget(Math.max(1, parseInt(e.target.value) || 1))}
                        min={1}
                        className='w-full px-3 py-2 rounded-xl glass-card app-text text-sm focus:outline-none transition-colors'
                        style={{ fontFamily: fontVar }}
                      />
                    </div>
                    <div className='flex-1'>
                      <label className='app-text-2 text-[10px] mb-1 block'>الوحدة</label>
                      <select
                        value={challengeUnit}
                        onChange={e => setChallengeUnit(e.target.value)}
                        className='w-full px-3 py-2 rounded-xl glass-card app-text text-sm focus:outline-none transition-colors appearance-none'
                        style={{ fontFamily: fontVar }}
                      >
                        <option value='ذكر'>ذكر</option>
                        <option value='صفحة'>صفحة</option>
                        <option value='دورة'>دورة</option>
                      </select>
                    </div>
                    <div className='flex-1'>
                      <label className='app-text-2 text-[10px] mb-1 block'>المدة (يوم)</label>
                      <select
                        value={challengeDays}
                        onChange={e => setChallengeDays(Number(e.target.value))}
                        className='w-full px-3 py-2 rounded-xl glass-card app-text text-sm focus:outline-none transition-colors appearance-none'
                        style={{ fontFamily: fontVar }}
                      >
                        <option value={3}>3</option>
                        <option value={7}>7</option>
                        <option value={14}>14</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        if (challengeName.trim()) {
                          addChallenge(challengeName.trim(), challengeTarget, challengeUnit, challengeDays);
                          setChallengeName('');
                          setChallengeTarget(100);
                          setChallengeUnit('ذكر');
                          setChallengeDays(7);
                          setShowAddChallenge(false);
                        }
                      }}
                      disabled={!challengeName.trim()}
                      className='flex-1 btn-gold py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity'
                      style={{ fontFamily: fontVar }}
                    >
                      إضافة
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setShowAddChallenge(false)}
                      className='px-4 py-2.5 rounded-xl glass-card app-text-2 text-sm transition-colors'
                    >
                      إلغاء
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {challenges.length > 0 && (
            <div className='space-y-2.5'>
              {challenges.map((c, i) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000));
                const pct = Math.min((c.current / c.target) * 100, 100);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className='p-3 rounded-xl'
                    style={c.completed
                      ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }
                      : { border: '1px solid var(--gold-border)', background: 'var(--gold-glow)' }
                    }
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        {c.completed && <IslamicIcon name='check-circle' className='w-4 h-4 text-green-400' />}
                        <span className='app-text font-bold text-sm' style={{ fontFamily: fontVar }}>{c.name}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <span className='app-text-muted text-[10px]'>{daysLeft} يوم متبقي</span>
                        <button
                          onClick={() => removeChallenge(c.id)}
                          className='w-7 h-7 rounded-lg flex items-center justify-center app-surface-h transition-colors'
                        >
                          <X className='w-3.5 h-3.5 app-text-muted' />
                        </button>
                      </div>
                    </div>
                    <div className='w-full rounded-full h-2 overflow-hidden' style={{ background: 'var(--app-ring-track)' }}>
                      <motion.div
                        className='h-2 rounded-full'
                        style={{ background: c.completed ? '#22c55e' : 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className='flex items-center justify-between mt-1.5'>
                      <span className='app-text-2 text-[10px]'>{c.current} / {c.target} {c.unit}</span>
                      <span className='text-[10px] font-medium' style={{ color: c.completed ? '#22c55e' : 'var(--gold-accent)' }}>
                        {Math.round(pct)}%
                      </span>
                    </div>
                    {!c.completed && (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => updateChallengeProgress(c.id, 1)}
                        className='mt-2 w-full py-1.5 rounded-lg text-xs font-medium app-text-2 transition-colors'
                        style={{ border: '1px solid var(--gold-border)', background: 'var(--gold-glow)' }}
                      >
                        + تسجيل تقدم
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAddChallenge(true)}
                className='w-full py-2.5 rounded-xl glass-card app-text-2 text-sm flex items-center justify-center gap-1.5 transition-colors'
                style={{ border: '1px dashed var(--gold-border)' }}
              >
                <Plus className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                <span style={{ color: 'var(--gold-accent)' }}>إضافة تحدي</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
