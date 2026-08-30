'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useDhikrStore } from '@/lib/store';
import { Flame, Plus, Trash2, Trophy, X, CheckCircle2, Clock, ChevronLeft } from '@/components/dhikr/islamic-icons';
import { getFontClass } from '@/lib/font-utils';
import { suggestedChallenges } from '@/lib/dhikr-data';

export default function ChallengesScreen() {
  const { arabicFont, challenges, addChallenge, updateChallengeProgress, removeChallenge } = useDhikrStore();
  const fontClass = getFontClass(arabicFont);

  const [showPicker, setShowPicker] = useState(false);
  const [celebratedId, setCelebratedId] = useState<string | null>(null);

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const handleProgress = (id: string, amount: number) => {
    updateChallengeProgress(id, amount);
    const ch = challenges.find(c => c.id === id);
    if (ch && ch.current + amount >= ch.target) {
      setCelebratedId(id);
      setTimeout(() => setCelebratedId(null), 3000);
    }
  };

  const getDaysLeft = (endDate: string) => {
    return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Header */}
      <header className='px-4 pt-4 pb-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <Trophy className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
          </div>
          <div className='flex-1'>
            <h1 className='text-xl font-bold app-text' style={{ fontFamily: fontClass }}>التحديات</h1>
            <p className='app-text-muted text-[11px]'>{activeChallenges.length} تحدي نشط</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPicker(true)}
            className='btn-gold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5'
          >
            <Plus className='w-3.5 h-3.5 text-white' />
            <span>تحدي جديد</span>
          </motion.button>
        </div>
      </header>

      <main className='flex-1 px-4 space-y-3'>
        {/* Empty state */}
        {activeChallenges.length === 0 && !showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center justify-center py-16'
          >
            <div className='w-20 h-20 rounded-full flex items-center justify-center mb-4' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <Flame className='w-10 h-10' style={{ color: 'var(--gold-accent)' }} />
            </div>
            <p className='app-text font-bold text-base mb-1' style={{ fontFamily: fontClass }}>لا توجد تحديات</p>
            <p className='app-text-muted text-xs mb-5'>ابدأ تحدياً لتحفيز نفسك</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPicker(true)}
              className='btn-gold px-5 py-2.5 rounded-xl text-sm'
            >
              اختر تحدياً
            </motion.button>
          </motion.div>
        )}

        {/* Active challenges list */}
        {activeChallenges.map((ch, i) => {
          const pct = Math.min((ch.current / ch.target) * 100, 100);
          const daysLeft = getDaysLeft(ch.endDate);
          const isCelebrating = celebratedId === ch.id;

          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className='glass-card rounded-2xl p-4 relative overflow-hidden'
            >
              {/* Celebration overlay */}
              {isCelebrating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='absolute inset-0 z-10 flex items-center justify-center'
                  style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                >
                  <div className='text-center'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.15 }}
                      className='w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center'
                      style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))' }}
                    >
                      <CheckCircle2 className='w-8 h-8 text-white' />
                    </motion.div>
                    <p className='app-text font-bold text-lg mb-1' style={{ fontFamily: fontClass }}>احسنت!</p>
                    <p className='app-text-muted text-sm'>اكملت التحدي بنجاح</p>
                  </div>
                </motion.div>
              )}

              {/* Challenge header */}
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2.5'>
                  <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                    <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                  </div>
                  <div>
                    <p className='app-text font-bold text-sm' style={{ fontFamily: fontClass }}>{ch.name}</p>
                    <div className='flex items-center gap-2 mt-0.5'>
                      <span className='app-text-muted text-[10px] flex items-center gap-0.5'>
                        <Clock className='w-3 h-3' /> {daysLeft} يوم متبقي
                      </span>
                      <span className='app-text-muted text-[10px]'>|</span>
                      <span className='text-[10px]' style={{ color: 'var(--gold-accent)' }}>{Math.round(pct)}%</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeChallenge(ch.id)} className='w-7 h-7 rounded-lg glass-subtle flex items-center justify-center app-surface-h'>
                  <Trash2 className='w-3.5 h-3.5 text-red-400/60' />
                </button>
              </div>

              {/* Progress bar */}
              <div className='w-full rounded-full h-2 mb-3' style={{ background: 'var(--app-ring-track)' }}>
                <motion.div
                  className='h-2 rounded-full'
                  style={{ background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* Count + buttons */}
              <div className='flex items-center justify-between'>
                <div className='flex items-baseline gap-1'>
                  <span className='text-2xl font-bold' style={{ color: 'var(--gold-accent)' }}>{ch.current}</span>
                  <span className='app-text-muted text-sm'>/ {ch.target} {ch.unit}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => ch.current > 0 && handleProgress(ch.id, -1)}
                    className='w-9 h-9 rounded-xl glass-subtle flex items-center justify-center app-text-muted text-lg font-bold'
                    disabled={ch.current <= 0}
                  >
                    -
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleProgress(ch.id, 1)}
                    className='btn-gold w-14 h-10 rounded-xl flex items-center justify-center text-base font-bold'
                  >
                    +1
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProgress(ch.id, 10)}
                    className='w-9 h-9 rounded-xl glass-subtle flex items-center justify-center app-text-2 text-xs font-bold'
                  >
                    +10
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Completed section */}
        {completedChallenges.length > 0 && (
          <div className='mt-2'>
            <h3 className='app-text-muted text-xs mb-2 flex items-center gap-1.5'>
              <CheckCircle2 className='w-3.5 h-3.5 text-emerald-500' />
              <span style={{ fontFamily: fontClass }}>مكتملة ({completedChallenges.length})</span>
            </h3>
            <div className='space-y-2'>
              {completedChallenges.slice(0, 5).map(ch => (
                <div key={ch.id} className='glass-card rounded-xl p-3 flex items-center justify-between opacity-60'>
                  <div className='flex items-center gap-2.5'>
                    <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                    <span className='app-text-2 text-sm' style={{ fontFamily: fontClass }}>{ch.name}</span>
                  </div>
                  <span className='app-text-muted text-[10px]'>{ch.target} {ch.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Challenge Picker Modal - Fully opaque */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-end justify-center'
          >
            <div
              className='absolute inset-0'
              style={{ background: 'rgba(5, 5, 15, 0.97)' }}
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className='relative w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[75vh] overflow-y-auto'
              style={{ background: '#111827', borderTop: '1px solid var(--gold-border)' }}
            >
              <div className='w-10 h-1 rounded-full mx-auto mb-4' style={{ background: 'var(--gold-border)' }} />

              <div className='flex items-center justify-between mb-5'>
                <h3 className='app-text font-bold text-base' style={{ fontFamily: fontClass }}>اختر تحدياً</h3>
                <button onClick={() => setShowPicker(false)} className='w-8 h-8 rounded-lg flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                  <X className='w-4 h-4 app-text' />
                </button>
              </div>

              <div className='space-y-2.5'>
                {suggestedChallenges.map((ch, i) => (
                  <motion.button
                    key={ch.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { addChallenge(ch.name, ch.target, ch.unit, ch.days); setShowPicker(false); }}
                    className='w-full p-3.5 rounded-xl flex items-center gap-3 text-right'
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                      <Flame className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='app-text text-sm font-medium' style={{ fontFamily: fontClass }}>{ch.name}</p>
                      <p className='app-text-muted text-[11px] mt-0.5'>{ch.target} {ch.unit} - مدة {ch.days} {ch.days === 1 ? 'يوم' : 'أيام'}</p>
                    </div>
                    <ChevronLeft className='w-4 h-4 app-text-muted rotate-180 shrink-0' />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
