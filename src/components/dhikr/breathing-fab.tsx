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
  const glowColor = isInhale ? 'var(--gold-glow)' : isExhale ? 'rgba(16,185,129,0.2)' : 'var(--gold-glow)';

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
              className='w-12 h-12 rounded-full flex items-center justify-center gold-glow pulse-gentle float-gentle shadow-lg'
              style={{
                background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 20px var(--gold-glow), 0 0 0 1px var(--gold-border)',
              }}
            >
              <Wind className='w-5 h-5 text-white' />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setBreathingFabVisible(false)}
              className='w-6 h-6 rounded-full glass-subtle flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity'
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
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            onClick={closeOverlay}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className='w-[85vw] max-w-sm rounded-3xl p-7 glass-float'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold top highlight */}
              <div className='h-px -mx-7 -mt-7 mb-5' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Wind className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
                  <span className='app-text font-bold text-sm'>تنفس</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex gap-1'>
                    {techniques.map((t, i) => (
                      <button
                        key={t.id}
                        onClick={() => { setTechIdx(i); reset(); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${i === techIdx ? 'btn-glass-gold' : 'glass-subtle'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={closeOverlay} className='w-8 h-8 glass-subtle rounded-xl flex items-center justify-center app-surface-h'>
                    <X className='w-4 h-4 app-text-2' />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className='h-1 rounded-full overflow-hidden mb-4' style={{ background: 'var(--app-ring-track)' }}>
                <div
                  className='h-full rounded-full transition-all duration-200'
                  style={{ width: `${Math.min((elapsed / totalSession) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' }}
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
                    style={{ background: `radial-gradient(circle, ${glowColor}, transparent)`, filter: 'blur(40px)' }}
                  />
                  <motion.div
                    className='w-32 h-32 rounded-full flex flex-col items-center justify-center relative'
                    style={{
                      background: 'var(--app-surface)',
                      border: '1.5px solid var(--gold-border-glow)',
                      boxShadow: active ? `0 0 30px ${glowColor}` : 'none',
                      backdropFilter: 'blur(20px)',
                    }}
                    animate={active ? { scale: [1, scaleVal] } : { scale: 1 }}
                    transition={{ duration: phase.d || 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
                  >
                    <span className='text-xl font-bold app-text'>{finished ? 'تم!' : phase.n}</span>
                    {active && !finished && (
                      <span className='app-text-muted text-xs mt-0.5'>{Math.ceil(phase.d - phase.elapsed)}ث</span>
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
                  className='w-11 h-11 rounded-full glass-subtle flex items-center justify-center'
                >
                  <RotateCcw className='w-4 h-4 app-text-2' />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => !finished && setActive(!active)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    finished
                      ? ''
                      : active
                        ? 'glass-glow'
                        : ''
                  }`}
                  style={finished
                    ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }
                    : active
                      ? undefined
                      : { background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 20px var(--gold-glow)' }
                  }
                >
                  {finished ? (
                    <span className='text-emerald-500 text-xs font-bold'>تم</span>
                  ) : active ? (
                    <Pause className='w-6 h-6' style={{ color: 'var(--gold-accent)' }} />
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
