'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Wind, X, Play, Pause, RotateCcw } from '@/components/dhikr/islamic-icons';
import { useDhikrStore } from '@/lib/store';

const techniques = [
  { id: '478', name: '4-7-8', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 7 }, { n: 'زفير', d: 8 }], cycles: 4 },
  { id: 'box', name: 'مربع', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 4 }, { n: 'زفير', d: 4 }, { n: 'حبس', d: 4 }], cycles: 4 },
  { id: 'calm', name: 'مهدئ', phases: [{ n: 'شهيق', d: 4 }, { n: 'زفير', d: 6 }], cycles: 5 },
];

export default function BreathingFab() {
  const { breathingFabVisible, setBreathingFabVisible, breathingOverlayOpen, setBreathingOverlayOpen, currentScreen } = useDhikrStore();
  const [techIdx, setTechIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const pauseRef = useRef(0);

  const tech = techniques[techIdx];
  const totalPhase = tech.phases.reduce((s, p) => s + p.d, 0);
  const totalSession = totalPhase * tech.cycles;

  const getPhase = () => {
    const e = elapsed % totalPhase;
    let acc = 0;
    for (let i = 0; i < tech.phases.length; i++) {
      if (e < acc + tech.phases[i].d) return { ...tech.phases[i], elapsed: e - acc };
      acc += tech.phases[i].d;
    }
    return { ...tech.phases[0], elapsed: 0 };
  };

  const phase = getPhase();
  const cycle = Math.min(Math.floor(elapsed / totalPhase) + 1, tech.cycles);
  const isInhale = phase.n === 'شهيق';
  const isExhale = phase.n === 'زفير';
  const scaleVal = active ? (isInhale ? 1.4 : isExhale ? 0.8 : 1.1) : 1;
  const glowColor = isInhale ? 'rgba(56,189,248,0.35)' : isExhale ? 'rgba(168,85,247,0.35)' : 'rgba(16,185,129,0.25)';

  useEffect(() => {
    if (active) {
      startRef.current = Date.now() - pauseRef.current;
      timerRef.current = setInterval(() => {
        const e = Math.floor((Date.now() - startRef.current) / 1000);
        setElapsed(e);
        if (e >= totalSession) {
          setActive(false);
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pauseRef.current = elapsed * 1000;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, totalSession, elapsed]);

  const reset = () => { setActive(false); setElapsed(0); setFinished(false); pauseRef.current = 0; };

  const closeOverlay = () => { setActive(false); reset(); setBreathingOverlayOpen(false); };

  const hidden = !breathingFabVisible || currentScreen === 'reading' || currentScreen === 'completion';

  return (
    <>
      {/* FAB button */}
      <AnimatePresence>
        {!hidden && !breathingOverlayOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 30 }}
            className='fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2'
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setBreathingOverlayOpen(true)}
              className='w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25 border border-sky-400/20'
            >
              <Wind className='w-5 h-5 text-white' />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setBreathingFabVisible(false)}
              className='w-7 h-7 rounded-full app-surface border app-border-c flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity'
            >
              <X className='w-3 h-3 app-text-muted' />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing overlay */}
      <AnimatePresence>
        {breathingOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[60] flex items-center justify-center'
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={closeOverlay}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='w-[85vw] max-w-sm rounded-3xl p-6 border border-amber-500/10'
              style={{ background: 'var(--app-bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Wind className='w-5 h-5 text-sky-400' />
                  <span className='app-text font-bold text-sm'>تنفس</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1'>
                    {techniques.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => { setTechIdx(i); reset(); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          i === techIdx
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'app-surface app-text-muted border app-border-c'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={closeOverlay} className='w-8 h-8 rounded-full app-surface flex items-center justify-center app-surface-h'>
                    <X className='w-4 h-4 app-text-2' />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className='h-1 rounded-full app-surface overflow-hidden mb-4'>
                <div
                  className='h-full rounded-full bg-gradient-to-l from-sky-400 to-blue-500 transition-all duration-200'
                  style={{ width: `${Math.min((elapsed / totalSession) * 100, 100)}%` }}
                />
              </div>

              {/* Breathing circle */}
              <div className='flex justify-center my-4'>
                <div className='relative'>
                  <motion.div
                    className='absolute -inset-4 rounded-full'
                    animate={active ? {
                      scale: [1, scaleVal * 1.15],
                      opacity: [0.15, 0.3],
                    } : { scale: 1, opacity: 0.1 }}
                    transition={{ duration: phase.d || 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
                    style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
                  />
                  <motion.div
                    className='w-32 h-32 rounded-full flex flex-col items-center justify-center relative'
                    style={{
                      background: 'var(--app-surface)',
                      border: '2px solid var(--app-border)',
                      boxShadow: active ? `0 0 30px ${glowColor}` : 'none',
                    }}
                    animate={active ? { scale: [1, scaleVal] } : { scale: 1 }}
                    transition={{ duration: phase.d || 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
                  >
                    <span className='text-xl font-bold app-text'>{finished ? 'تم!' : phase.n}</span>
                    {active && !finished && (
                      <span className='text-xs app-text-muted mt-0.5'>{Math.ceil(phase.d - phase.elapsed)}ث</span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Info */}
              <div className='flex items-center justify-center gap-4 mb-5'>
                <span className='app-text-muted text-xs'>الدورة {cycle}/{tech.cycles}</span>
                <span className='app-text-muted text-xs'>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
              </div>

              {/* Controls */}
              <div className='flex items-center justify-center gap-3'>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={reset}
                  className='w-11 h-11 rounded-full app-surface border app-border-c flex items-center justify-center'
                >
                  <RotateCcw className='w-4 h-4 app-text-2' />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => !finished && setActive(!active)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    finished
                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                      : active
                      ? 'bg-sky-500/20 border border-sky-500/30'
                      : 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/25'
                  }`}
                >
                  {finished ? (
                    <span className='text-emerald-400 text-xs font-bold'>تم</span>
                  ) : active ? (
                    <Pause className='w-6 h-6 text-sky-300' />
                  ) : (
                    <Play className='w-6 h-6 text-white' style={{ marginLeft: '-2px' }} />
                  )}
                </motion.button>

                <div className='w-11' />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
