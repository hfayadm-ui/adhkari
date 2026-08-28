'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { RotateCcw, Target, ChevronDown, ChevronUp } from '@/components/dhikr/islamic-icons';
import { useState, useCallback, useEffect, useRef } from 'react';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)', 'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)', 'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)', 'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

const targetOptions = [33, 34, 100, 500, 1000];

const colorMap: Record<string, { ring: string; glow: string; text: string; btn: string; btnBorder: string }> = {
  emerald: { ring: 'from-emerald-400 to-teal-400', glow: 'shadow-emerald-500/30', text: 'text-emerald-400', btn: 'from-emerald-500 to-teal-600', btnBorder: 'border-emerald-400/20' },
  blue: { ring: 'from-blue-400 to-cyan-400', glow: 'shadow-blue-500/30', text: 'text-blue-400', btn: 'from-blue-500 to-cyan-600', btnBorder: 'border-blue-400/20' },
  purple: { ring: 'from-purple-400 to-violet-400', glow: 'shadow-purple-500/30', text: 'text-purple-400', btn: 'from-purple-500 to-violet-600', btnBorder: 'border-purple-400/20' },
  amber: { ring: 'from-amber-400 to-orange-400', glow: 'shadow-amber-500/30', text: 'text-amber-400', btn: 'from-amber-500 to-orange-600', btnBorder: 'border-amber-400/20' },
  rose: { ring: 'from-rose-400 to-pink-400', glow: 'shadow-rose-500/30', text: 'text-rose-400', btn: 'from-rose-500 to-pink-600', btnBorder: 'border-rose-400/20' },
};

export default function CounterScreen() {
  const { freeCounter, incrementFreeCounter, resetFreeCounter, setFreeCounter, counterPresets, updatePreset, soundEnabled, vibrationEnabled, themeColor, arabicFont } = useDhikrStore();
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
    playTap();
    if (vibrationEnabled && 'vibrate' in navigator) navigator.vibrate(25);
    setTapAnim(true);
    setTimeout(() => setTapAnim(false), 100);
    incrementFreeCounter();
    if (activePreset) {
      const p = counterPresets.find(x => x.id === activePreset);
      if (p) updatePreset(activePreset, Math.min(p.current + 1, p.target));
    }
  }, [playTap, vibrationEnabled, incrementFreeCounter, activePreset, counterPresets, updatePreset]);

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
  const clr = colorMap[themeColor] || colorMap.emerald;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2 flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='hand' className='w-6 h-6 text-amber-400' />
          <div>
            <h1 className='text-2xl font-bold text-white' style={{ fontFamily: fontVar }}>المسبحة</h1>
            <p className='text-slate-400 text-xs' style={{ fontFamily: fontVar }}>العداد الحر / اضغط طويلاً للتصفير</p>
          </div>
        </div>
        <button onClick={resetFreeCounter} className='w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors'>
          <RotateCcw className='w-5 h-5 text-slate-400' />
        </button>
      </header>

      <main className='flex-1 flex flex-col items-center justify-center px-6'>
        {/* Target display */}
        <div className='mb-6 text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <Target className={`w-4 h-4 ${clr.text}`} />
            <span className='text-slate-400 text-xs' style={{ fontFamily: fontVar }}>الهدف</span>
            <button onClick={() => setShowTargetPicker(!showTargetPicker)} className='text-amber-300 text-xs flex items-center gap-0.5'>
              {currentTarget} {showTargetPicker ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}
            </button>
          </div>
          <AnimatePresence>
            {showTargetPicker && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden'>
                <div className='flex gap-2 justify-center flex-wrap'>
                  {targetOptions.map(t => (
                    <button key={t} onClick={() => { setCustomTarget(t); setShowTargetPicker(false); setActivePreset(null); }}
                      className={`px-3 py-1 rounded-lg text-xs transition-all ${customTarget === t && !activePreset ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300' : 'glass-card border border-white/10 text-slate-400'}`}>
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
            <circle cx='100' cy='100' r='90' fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth='6' />
            <motion.circle
              cx='100' cy='100' r='90' fill='none' stroke='url(#counterGrad)' strokeWidth='6' strokeLinecap='round'
              strokeDasharray={565.48}
              animate={{ strokeDashoffset: 565.48 - (Math.min(currentProgress / currentTarget, 1) * 565.48) }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <defs><linearGradient id='counterGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor={themeColor === 'amber' ? '#fbbf24' : themeColor === 'rose' ? '#fb7185' : '#34d399'} />
              <stop offset='100%' stopColor={themeColor === 'amber' ? '#f59e0b' : themeColor === 'rose' ? '#ec4899' : '#14b8a6'} />
            </linearGradient></defs>
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <AnimatePresence mode='wait'>
              <motion.span key={activePreset ? currentProgress : freeCounter}
                initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className={`text-6xl font-bold ${clr.text}`}
              >
                {activePreset ? currentProgress : freeCounter}
              </motion.span>
            </AnimatePresence>
            <span className='text-slate-400 text-sm' style={{ fontFamily: fontVar }}>/ {currentTarget}</span>
          </div>
          {isComplete && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='absolute -top-2 -right-2'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center gold-glow'>
                <IslamicIcon name='star' className='w-5 h-5 text-white' />
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
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${clr.btn} shadow-2xl ${clr.glow} ${clr.btnBorder} border-2 flex items-center justify-center active:shadow-inner transition-shadow mb-6 gold-glow`}
        >
          <motion.span animate={{ scale: tapAnim ? 0.9 : 1 }}>
            <IslamicIcon name='hand-tap' className='w-12 h-12 text-white' color='#ffffff' />
          </motion.span>
        </motion.button>

        <p className='text-slate-500 text-xs mb-6' style={{ fontFamily: fontVar }}>اضغط للعدّ / اضغط مطولاً للتصفير</p>

        {/* Presets */}
        <div className='w-full max-w-sm'>
          <button onClick={() => setShowPresets(!showPresets)} className='flex items-center gap-2 text-amber-300 text-sm mb-3'>
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
                      className={`w-full glass-card rounded-xl p-3 transition-all border ${activePreset === preset.id ? 'border-amber-500/20' : 'border-white/10 hover:bg-white/8'}`}>
                      <div className='flex items-center justify-between mb-1.5'>
                        <span className={`text-sm ${activePreset === preset.id ? 'text-white' : 'text-slate-300'}`} style={{ fontFamily: fontVar }}>{preset.name}</span>
                        <span className='text-xs text-slate-400'>{preset.current}/{preset.target}</span>
                      </div>
                      <div className='w-full bg-white/5 rounded-full h-1.5'>
                        <div className={`h-1.5 rounded-full transition-all bg-gradient-to-r ${clr.ring}`} style={{ width: `${pct}%` }} />
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
