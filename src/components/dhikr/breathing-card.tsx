'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, RotateCcw } from '@/components/dhikr/islamic-icons';

const techniques = [
  { id: '478', name: '4-7-8', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 7 }, { n: 'زفير', d: 8 }], cycles: 4 },
  { id: 'box', name: 'مربع', phases: [{ n: 'شهيق', d: 4 }, { n: 'حبس', d: 4 }, { n: 'زفير', d: 4 }, { n: 'حبس', d: 4 }], cycles: 4 },
  { id: 'calm', name: 'مهدئ', phases: [{ n: 'شهيق', d: 4 }, { n: 'زفير', d: 6 }], cycles: 5 },
];

// Smooth cubic-bezier easing for organic feel
function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
}

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

  // Refs for smooth RAF animation
  const circleRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const rafRef = useRef<number>(0);
  const techRef = useRef(techniques[0]);
  const startTimestampRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 54 + Math.random() * 6,
      speed: 0.15 + Math.random() * 0.1,
      size: 2 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.3,
    }));
  }, []);

  useEffect(() => { techRef.current = techniques[techIdx]; }, [techIdx]);

  // Cleanup on unmount
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

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

  // Get smooth scale with easing — larger range and more organic
  const getScaleForPhase = useCallback((name: string, p: number) => {
    const eased = easeInOutSine(smoothStep(p));
    if (name === 'شهيق') return 0.75 + 0.45 * eased;
    if (name === 'زفير') return 1.2 - 0.45 * eased;
    return 1.0;
  }, []);

  // Main animation loop using requestAnimationFrame for 60fps smoothness
  const animate = useCallback(() => {
    const now = performance.now();
    const elapsed = (now - startTimestampRef.current) / 1000;
    elapsedRef.current = elapsed;

    const tech = techRef.current;
    const totalPhase = tech.phases.reduce((s, ph) => s + ph.d, 0);
    const totalSession = totalPhase * tech.cycles;

    if (elapsed >= totalSession) {
      setFinished(true);
      setPhaseName('تم!');
      setPhaseRemaining(0);
      setProgress(100);
      setActive(false);
      if (circleRef.current) circleRef.current.style.transform = 'scale(1)';
      if (outerRingRef.current) outerRingRef.current.style.transform = 'scale(1)';
      if (glowRef.current) glowRef.current.style.opacity = '0.4';
      return;
    }

    const phase = getPhaseAt(elapsed);
    const currentCycle = Math.min(Math.floor(elapsed / totalPhase) + 1, tech.cycles);
    const newScale = getScaleForPhase(phase.name, phase.progress);

    // Direct DOM manipulation for buttery-smooth circle animation
    if (circleRef.current) {
      circleRef.current.style.transform = `scale(${newScale})`;
    }

    // Outer ring — slightly delayed & dampened for depth
    const outerScale = 1 + (newScale - 1) * 0.6;
    if (outerRingRef.current) {
      outerRingRef.current.style.transform = `scale(${outerScale})`;
    }

    // Glow intensity — pulses with breathing
    if (glowRef.current) {
      const glowOpacity = 0.3 + 0.7 * ((newScale - 0.75) / 0.45);
      glowRef.current.style.opacity = String(Math.min(1, Math.max(0.3, glowOpacity)));
    }

    // Animate particles
    const container = particlesContainerRef.current;
    if (container && active) {
      const dots = container.children;
      const dt = 1 / 60;
      particlesRef.current.forEach((p, i) => {
        p.angle += p.speed * dt;
        const pScale = 0.85 + 0.3 * ((newScale - 0.75) / 0.45);
        const r = p.radius * pScale;
        const x = Math.cos(p.angle) * r;
        const y = Math.sin(p.angle) * r;
        if (dots[i]) {
          const dot = dots[i] as HTMLElement;
          dot.style.transform = `translate(${x}px, ${y}px)`;
          dot.style.opacity = String(p.opacity * pScale);
        }
      });
    }

    // Update React state for text displays (throttled by RAF ~60fps is fine)
    setPhaseName(phase.name);
    setPhaseRemaining(phase.remaining);
    setCycle(currentCycle);
    setProgress(Math.min((elapsed / totalSession) * 100, 100));

    rafRef.current = requestAnimationFrame(animate);
  }, [getPhaseAt, getScaleForPhase, active]);

  useEffect(() => {
    if (active) {
      startTimestampRef.current = performance.now() - elapsedRef.current * 1000;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, animate]);

  const reset = () => {
    setActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    elapsedRef.current = 0;
    setFinished(false);
    setPhaseName(techRef.current.phases[0].n);
    setPhaseRemaining(techRef.current.phases[0].d);
    setCycle(1);
    setProgress(0);
    if (circleRef.current) circleRef.current.style.transform = 'scale(1)';
    if (outerRingRef.current) outerRingRef.current.style.transform = 'scale(1)';
    if (glowRef.current) glowRef.current.style.opacity = '0.4';
  };

  const switchTech = (i: number) => {
    reset();
    setTechIdx(i);
  };

  const tech = techniques[techIdx];
  const isInhale = phaseName === 'شهيق';
  const isExhale = phaseName === 'زفير';

  // Dynamic color based on phase
  const phaseColor = isInhale
    ? 'var(--gold-accent)'
    : isExhale
      ? '#34d399'
      : 'var(--gold-bright)';

  const glowColorInner = isInhale
    ? 'rgba(197, 160, 89, 0.25)'
    : isExhale
      ? 'rgba(52, 211, 153, 0.2)'
      : 'rgba(212, 175, 55, 0.15)';

  const glowColorOuter = isInhale
    ? 'rgba(197, 160, 89, 0.12)'
    : isExhale
      ? 'rgba(52, 211, 153, 0.08)'
      : 'rgba(212, 175, 55, 0.06)';

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

      <div className='flex items-center gap-5'>
        {/* Breathing Circle — Enhanced */}
        <div className='relative shrink-0' style={{ width: 100, height: 100 }}>
          {/* Outer glow layer — large, soft */}
          <div
            ref={glowRef}
            className='absolute rounded-full'
            style={{
              inset: -16,
              background: `radial-gradient(circle, ${glowColorOuter}, transparent 70%)`,
              filter: 'blur(12px)',
              opacity: 0.4,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Orbiting particles */}
          <div
            ref={particlesContainerRef}
            className='absolute inset-0'
            style={{ opacity: active ? 1 : 0 }}
          >
            {particlesRef.current.map((p, i) => (
              <div
                key={i}
                className='absolute rounded-full'
                style={{
                  width: p.size,
                  height: p.size,
                  top: '50%',
                  left: '50%',
                  marginTop: -p.size / 2,
                  marginLeft: -p.size / 2,
                  background: phaseColor,
                  opacity: p.opacity,
                  transition: 'opacity 0.5s ease',
                }}
              />
            ))}
          </div>

          {/* Outer decorative ring */}
          <div
            ref={outerRingRef}
            className='absolute rounded-full'
            style={{
              inset: 2,
              border: '1px solid',
              borderColor: `${phaseColor}20`,
              transform: 'scale(1)',
              transition: 'border-color 0.8s ease',
            }}
          />

          {/* Main breathing circle */}
          <div
            ref={circleRef}
            className='absolute rounded-full flex flex-col items-center justify-center'
            style={{
              inset: 8,
              background: active
                ? `radial-gradient(circle at 40% 35%, ${glowColorInner}, var(--glass-bg))`
                : 'var(--glass-bg)',
              border: `1.5px solid ${phaseColor}40`,
              boxShadow: active
                ? `0 0 30px ${glowColorInner}, inset 0 0 20px ${glowColorInner}`
                : 'none',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              transform: 'scale(1)',
              transition: 'border-color 0.8s ease, background 0.8s ease, box-shadow 0.8s ease',
            }}
          >
            <span className='text-sm font-bold app-text leading-none'>{phaseName}</span>
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
                className='h-full rounded-full'
                style={{
                  width: `${progress}%`,
                  background: finished
                    ? 'rgba(16,185,129,0.7)'
                    : isInhale
                      ? 'linear-gradient(90deg, #C5A059, #D4AF37)'
                      : isExhale
                        ? 'linear-gradient(90deg, #34d399, #6ee7b7)'
                        : 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))',
                  transition: 'width 0.15s linear, background 0.8s ease',
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
