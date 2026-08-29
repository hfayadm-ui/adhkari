'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, RotateCcw } from '@/components/dhikr/islamic-icons';
import { ArabicFont } from '@/lib/store';

const techniques = [
  { id: '478', name: '4-7-8', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 7 }, { n: 'زفير', d: 8 }], cycles: 4 },
  { id: 'box', name: 'مربع', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 4 }, { n: 'زفير', d: 4 }, { n: 'حبس', d: 4 }], cycles: 4 },
  { id: 'calm', name: 'مهدئ', phases: [{ n: 'شهيق', d: 4 }, { n: 'زفير', d: 6 }], cycles: 5 },
];

interface Props {
  fontClass: string;
}

export default function BreathingCard({ fontClass }: Props) {
  const [techIdx, setTechIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [phaseName, setPhaseName] = useState('شهيق');
  const [phaseRemaining, setPhaseRemaining] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);

  const circleRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const techRef = useRef(techniques[0]);
  const activeRef = useRef(false);

  // Keep tech ref in sync
  useEffect(() => { techRef.current = techniques[techIdx]; }, [techIdx]);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const getPhaseAt = useCallback((elapsed: number) => {
    const tech = techRef.current;
    const totalPhase = tech.phases.reduce((s, p) => s + p.d, 0);
    const e = elapsed % totalPhase;
    let acc = 0;
    for (let i = 0; i < tech.phases.length; i++) {
      if (e < acc + tech.phases[i].d) {
        return {
          name: tech.phases[i].n,
          remaining: Math.ceil(tech.phases[i].d - (e - acc)),
          progress: (e - acc) / tech.phases[i].d,
        };
      }
      acc += tech.phases[i].d;
    }
    return { name: tech.phases[0].n, remaining: tech.phases[0].d, progress: 0 };
  }, []);

  const getScaleForPhase = useCallback((name: string, p: number) => {
    if (name === 'شهيق') return 0.82 + 0.36 * p;
    if (name === 'زفير') return 1.18 - 0.36 * p;
    return 1.0;
  }, []);

  useEffect(() => {
    if (active) {
      activeRef.current = true;
      const startTime = Date.now() - elapsedRef.current * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        elapsedRef.current = elapsed;

        const tech = techRef.current;
        const totalPhase = tech.phases.reduce((s, ph) => s + ph.d, 0);
        const totalSession = totalPhase * tech.cycles;

        if (elapsed >= totalSession) {
          activeRef.current = false;
          if (timerRef.current) clearInterval(timerRef.current);
          setActive(false);
          setFinished(true);
          setPhaseName('تم!');
          setPhaseRemaining(0);
          setProgress(100);
          setScale(1);
          if (circleRef.current) circleRef.current.style.transform = 'scale(1)';
          return;
        }

        const phase = getPhaseAt(elapsed);
        const currentCycle = Math.min(Math.floor(elapsed / totalPhase) + 1, tech.cycles);
        const newScale = getScaleForPhase(phase.name, phase.progress);

        // Direct DOM for smooth circle (bypass React re-render)
        if (circleRef.current) {
          circleRef.current.style.transform = `scale(${newScale})`;
        }

        // State updates for text display
        setPhaseName(phase.name);
        setPhaseRemaining(phase.remaining);
        setCycle(currentCycle);
        setProgress(Math.min((elapsed / totalSession) * 100, 100));
        setScale(newScale);
      }, 80);
    } else {
      activeRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, techIdx, getPhaseAt, getScaleForPhase]);

  const reset = () => {
    setActive(false);
    activeRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    elapsedRef.current = 0;
    setFinished(false);
    setScale(1);
    setPhaseName(techRef.current.phases[0].n);
    setPhaseRemaining(techRef.current.phases[0].d);
    setCycle(1);
    setProgress(0);
    if (circleRef.current) circleRef.current.style.transform = 'scale(1)';
  };

  const switchTech = (i: number) => {
    reset();
    setTechIdx(i);
  };

  const tech = techniques[techIdx];
  const isInhale = phaseName === 'شهيق';
  const isExhale = phaseName === 'زفير';
  const glowColor = isInhale ? 'var(--gold-glow-strong)' : isExhale ? 'rgba(16,185,129,0.15)' : 'var(--gold-glow)';
  const borderColor = isInhale ? 'var(--gold-border-glow)' : isExhale ? 'rgba(16,185,129,0.25)' : 'var(--gold-border)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className='glass-card rounded-2xl p-4'
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Wind className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
          <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>تنفس مهدئ</span>
        </div>
        <div className='flex gap-1'>
          {techniques.map((t, i) => (
            <button
              key={t.id}
              onClick={() => switchTech(i)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${i === techIdx ? 'btn-glass-gold' : 'glass-subtle app-text-muted'}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-4'>
        {/* Breathing Circle */}
        <div className='relative shrink-0'>
          {/* Glow behind circle */}
          <div
            className='absolute -inset-3 rounded-full transition-all duration-700'
            style={{
              background: `radial-gradient(circle, ${glowColor}, transparent)`,
              filter: 'blur(20px)',
              opacity: active ? 1 : 0.4,
            }}
          />
          <div
            ref={circleRef}
            className='w-20 h-20 rounded-full flex flex-col items-center justify-center relative'
            style={{
              background: active ? `radial-gradient(circle, ${glowColor}, var(--glass-bg))` : 'var(--glass-bg)',
              border: `1.5px solid ${borderColor}`,
              boxShadow: active ? `0 0 24px ${glowColor}` : 'none',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transform: 'scale(1)',
              transition: 'transform 0.4s ease-in-out, border-color 0.5s, box-shadow 0.5s, background 0.5s',
            }}
          >
            <span className='text-base font-bold app-text leading-none'>{phaseName}</span>
            {active && !finished && (
              <span className='app-text-muted text-[10px] mt-0.5'>{phaseRemaining}ث</span>
            )}
          </div>
        </div>

        {/* Info + Controls */}
        <div className='flex-1 space-y-2.5'>
          {/* Progress bar */}
          <div>
            <div className='h-1 rounded-full overflow-hidden' style={{ background: 'var(--app-ring-track)' }}>
              <div
                className='h-full rounded-full transition-all duration-300'
                style={{
                  width: `${progress}%`,
                  background: finished
                    ? 'rgba(16,185,129,0.7)'
                    : 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))',
                }}
              />
            </div>
            <div className='flex items-center justify-between mt-1'>
              <span className='app-text-muted text-[10px]'>الدورة {cycle}/{tech.cycles}</span>
              <span className='app-text-muted text-[10px]'>{Math.floor(elapsedRef.current / 60)}:{String(Math.floor(elapsedRef.current) % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center gap-2'>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={reset}
              className='w-9 h-9 rounded-xl glass-subtle flex items-center justify-center'
            >
              <RotateCcw className='w-3.5 h-3.5 app-text-2' />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => !finished && setActive(!active)}
              className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                finished
                  ? 'text-emerald-500'
                  : active
                    ? 'glass-glow'
                    : ''
              }`}
              style={finished
                ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }
                : active
                  ? undefined
                  : { background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }
              }
            >
              {finished ? (
                <span>تم بنجاح</span>
              ) : active ? (
                <><Pause className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} /><span style={{ color: 'var(--gold-accent)' }}>إيقاف</span></>
              ) : (
                <><Play className='w-3.5 h-3.5 text-white' style={{ marginLeft: '-1px' }} /><span>ابدأ</span></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
