'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { RotateCcw, Target, ChevronDown, ChevronUp } from '@/components/dhikr/islamic-icons';
import { getFontClass } from '@/lib/font-utils';
import { useState, useCallback, useRef } from 'react';

const targetOptions = [33, 34, 100, 500, 1000];

export default function CounterScreen() {
  const { freeCounter, incrementFreeCounter, resetFreeCounter, counterPresets, updatePreset, soundEnabled, vibrationEnabled, arabicFont, counterAlertEnabled, counterAlertInterval } = useDhikrStore();
  const [showPresets, setShowPresets] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [tapAnim, setTapAnim] = useState(false);
  const [customTarget, setCustomTarget] = useState(33);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fontVar = getFontClass(arabicFont);

  const playTap = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
    } catch { /* */ }
  }, [soundEnabled]);

  const handleTap = useCallback(() => {
    const newCount = freeCounter + 1;
    const isAlert = counterAlertEnabled && counterAlertInterval > 0 && (newCount % counterAlertInterval === 0);
    if (isAlert && soundEnabled) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
      } catch { /* */ }
    } else {
      playTap();
    }
    if (vibrationEnabled && 'vibrate' in navigator) navigator.vibrate(isAlert ? 100 : 25);
    setTapAnim(true);
    setTimeout(() => setTapAnim(false), 100);
    incrementFreeCounter();
    if (activePreset) {
      const p = counterPresets.find(x => x.id === activePreset);
      if (p) updatePreset(activePreset, Math.min(p.current + 1, p.target));
    }
  }, [playTap, vibrationEnabled, incrementFreeCounter, activePreset, counterPresets, updatePreset, soundEnabled, freeCounter, counterAlertEnabled, counterAlertInterval]);

  const handleLongPressStart = useCallback(() => {
    longPressRef.current = setTimeout(() => {
      resetFreeCounter();
      if (activePreset) updatePreset(activePreset, 0);
    }, 800);
  }, [resetFreeCounter, activePreset, updatePreset]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  }, []);

  const currentTarget = activePreset ? (counterPresets.find(p => p.id === activePreset)?.target || 33) : customTarget;
  const currentProgress = activePreset ? (counterPresets.find(p => p.id === activePreset)?.current || 0) : (freeCounter % currentTarget);
  const isComplete = currentProgress >= currentTarget;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2 flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='misbaha' className='w-6 h-6' color='var(--gold-accent)' />
          <div>
            <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>المسبحة</h1>
            <p className='app-text-2 text-xs' style={{ fontFamily: fontVar }}>العداد الحر / اضغط طويلاً للتصفير</p>
          </div>
        </div>
        <button onClick={resetFreeCounter} className='w-10 h-10 rounded-full glass-card flex items-center justify-center app-surface-h transition-colors'>
          <RotateCcw className='w-5 h-5 app-text-2' />
        </button>
      </header>

      <main className='flex-1 flex flex-col items-center justify-center px-6'>
        {/* Target display */}
        <div className='mb-6 text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <Target className='w-4 h-4' color='var(--gold-accent)' />
            <span className='app-text-2 text-xs' style={{ fontFamily: fontVar }}>الهدف</span>
            <button onClick={() => setShowTargetPicker(!showTargetPicker)} className='text-xs flex items-center gap-0.5' style={{ color: 'var(--gold-bright)' }}>
              {currentTarget} {showTargetPicker ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}
            </button>
          </div>
          <AnimatePresence>
            {showTargetPicker && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden'>
                <div className='flex gap-2 justify-center flex-wrap'>
                  {targetOptions.map(t => (
                    <button key={t} onClick={() => { setCustomTarget(t); setShowTargetPicker(false); setActivePreset(null); }}
                      className={`px-3 py-1 rounded-lg text-xs transition-all ${customTarget === t && !activePreset ? '' : 'glass-card border app-border-c app-text-2'}`}
                      style={customTarget === t && !activePreset ? { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold-bright)' } : undefined}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Counter Display */}
        <div className='relative mb-8'>
          <svg className='w-64 h-64 -rotate-90' viewBox='0 0 200 200'>
            <circle cx='100' cy='100' r='90' fill='none' stroke='var(--app-ring-track)' strokeWidth='6' />
            <motion.circle
              cx='100' cy='100' r='90' fill='none' stroke='url(#counterGrad)' strokeWidth='6' strokeLinecap='round'
              strokeDasharray={565.48}
              animate={{ strokeDashoffset: 565.48 - (Math.min(currentProgress / currentTarget, 1) * 565.48) }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <defs><linearGradient id='counterGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#C5A059' />
              <stop offset='100%' stopColor='#D4AF37' />
            </linearGradient></defs>
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <motion.span
              key={activePreset ? `p-${currentProgress}` : `f-${freeCounter}`}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className='text-6xl font-bold'
              style={{ color: 'var(--gold-accent)' }}
            >
              {activePreset ? currentProgress : freeCounter}
            </motion.span>
            <span className='app-text-2 text-sm' style={{ fontFamily: fontVar }}>/ {currentTarget}</span>
          </div>
          {isComplete && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='absolute -top-2 -right-2'>
              <div className='w-10 h-10 rounded-full flex items-center justify-center gold-glow' style={{ background: 'linear-gradient(to bottom right, #C5A059, #D4AF37)' }}>
                <IslamicIcon name='star' className='w-5 h-5 app-text' />
              </div>
            </motion.div>
          )}
        </div>

        {/* Tap area */}
        <motion.button
          whileTap={{ scale: tapAnim ? 0.92 : 1 }}
          onTouchStart={handleLongPressStart} onTouchEnd={handleLongPressEnd}
          onMouseDown={handleLongPressStart} onMouseUp={handleLongPressEnd} onMouseLeave={handleLongPressEnd}
          onClick={handleTap}
          className='w-32 h-32 rounded-full btn-gold shadow-2xl border-2 flex items-center justify-center active:shadow-inner transition-shadow mb-6 gold-glow'
        >
          <motion.span animate={{ scale: tapAnim ? 0.9 : 1 }}>
            <IslamicIcon name='misbaha' className='w-14 h-14' color='#ffffff' />
          </motion.span>
        </motion.button>

        <p className='app-text-muted text-xs mb-6' style={{ fontFamily: fontVar }}>اضغط للعدّ / اضغط مطولاً للتصفير</p>

        {/* Presets */}
        <div className='w-full max-w-sm'>
          <button onClick={() => setShowPresets(!showPresets)} className='flex items-center gap-2 text-sm mb-3' style={{ color: 'var(--gold-bright)' }}>
            <span style={{ fontFamily: fontVar }}>أذكار سريعة</span>
            {showPresets ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
          </button>
          <AnimatePresence>
            {showPresets && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden space-y-2'>
                {counterPresets.map(preset => {
                  const pct = Math.min(preset.current / preset.target * 100, 100);
                  return (
                    <button key={preset.id} onClick={() => { setActivePreset(preset.id === activePreset ? null : preset.id); }}
                      className={`w-full glass-card rounded-xl p-3 transition-all border ${activePreset === preset.id ? '' : 'app-surface-h'}`}
                      style={activePreset === preset.id ? { border: '1px solid var(--gold-border)' } : undefined}
                    >
                      <div className='flex items-center justify-between mb-1.5'>
                        <span className={`text-sm ${activePreset === preset.id ? 'app-text' : 'app-text-2'}`} style={{ fontFamily: fontVar }}>{preset.name}</span>
                        <span className='text-xs app-text-2'>{preset.current}/{preset.target}</span>
                      </div>
                      <div className='w-full app-surface rounded-full h-1.5'>
                        <div className='h-1.5 rounded-full transition-all' style={{ width: `${pct}%`, background: 'linear-gradient(to right, #C5A059, #D4AF37)' }} />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}