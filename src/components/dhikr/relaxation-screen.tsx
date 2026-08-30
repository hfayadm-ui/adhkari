'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { ChevronLeft, RotateCcw, CheckCircle2, Star, Play, Pause } from '@/components/dhikr/islamic-icons';
import { useDhikrStore } from '@/lib/store';
import { getFontClass } from '@/lib/font-utils';

interface AudioTrack {
  id: string;
  name: string;
  frequencies: number[];
  pattern: 'alternating' | 'chord' | 'single';
  description: string;
}

const audioTracks: AudioTrack[] = [
  { id: 'tasbih', name: 'تسبيح', frequencies: [440, 554], pattern: 'alternating', description: 'نغمة هادئة متناوبة' },
  { id: 'tahmid', name: 'تحميد', frequencies: [330, 440, 554], pattern: 'chord', description: 'كورد دافئ' },
  { id: 'takbir', name: 'تكبير', frequencies: [220], pattern: 'single', description: 'نغمة عميقة' },
];

function useAudioTrack(track: AudioTrack) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const altIndexRef = useRef(0);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch { /* */ } });
    oscillatorsRef.current = [];
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    gainRef.current = null;
    altIndexRef.current = 0;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    if (track.pattern === 'chord') {
      track.frequencies.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(masterGain);
        osc.start();
        oscillatorsRef.current.push(osc);
      });
    } else if (track.pattern === 'alternating') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(track.frequencies[0], ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscillatorsRef.current.push(osc);
      altIndexRef.current = 0;
      intervalRef.current = setInterval(() => {
        altIndexRef.current = (altIndexRef.current + 1) % track.frequencies.length;
        osc.frequency.setValueAtTime(track.frequencies[altIndexRef.current], ctx.currentTime);
      }, 500);
    } else {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(track.frequencies[0], ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      oscillatorsRef.current.push(osc);
    }

    setPlaying(true);
  }, [track, stop]);

  const toggle = useCallback(() => { playing ? stop() : play(); }, [playing, play, stop]);

  return { playing, toggle, stop };
}

interface RelaxTool {
  id: string;
  name: string;
  icon: string;
  color: string;
  steps: string[];
}

const tools: RelaxTool[] = [
  {
    id: 'dhikr-calm',
    name: 'أذكار السكينة',
    icon: 'heart',
    color: 'from-emerald-500 to-green-600',
    steps: [
      '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
      'حسبي الله لا إله إلا هو عليه توكلت',
      'اللهم إني أعوذ بك من الهم والحزن',
      'لا إله إلا أنت سبحانك إني كنت من الظالمين',
    ],
  },
  {
    id: 'muscle',
    name: 'استرخاء العضلات',
    icon: 'shield',
    color: 'from-blue-500 to-indigo-600',
    steps: [
      'اجلس مريحاً وأغلق عينيك',
      'شدّ قدميك 5 ثوانٍ ثم أرخِ',
      'شدّ كتفيك للأعلى ثم أرخِ',
      'تنفّس بعمق واشعر بالراحة',
    ],
  },
  {
    id: 'body-scan',
    name: 'الوعي الجسدي',
    icon: 'eye',
    color: 'from-amber-500 to-orange-600',
    steps: [
      'استلقِ مريحاً وأغلق عينيك',
      'انتبه لرأسك ووجهك: هل فيه توتر؟ أرخِ',
      'انتقل لبطنك: أرخِ مع كل زفير',
      'قل: اللهم أنت السلام ومنك السلام',
    ],
  },
  {
    id: 'gratitude',
    name: 'شكر وامتنان',
    icon: 'sparkles',
    color: 'from-rose-500 to-pink-600',
    steps: [
      'خذ نفساً عميقاً وابدأ',
      'فكّر في 3 نعم صحية تشعر بها الآن',
      'اشكر نعمة الإيمان',
      'قل: الحمد لله الذي بنعمته تتم الصالحات',
    ],
  },
];

// مكون عرض الأداة (بسيط)
function ToolViewer({ tool, onBack }: { tool: RelaxTool; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => {
    if (step < tool.steps.length - 1) setStep(step + 1);
    else setDone(true);
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* رأس */}
      <div className='flex items-center justify-between px-4 pt-4 pb-3'>
        <button onClick={onBack} className='w-9 h-9 rounded-xl glass-subtle flex items-center justify-center'>
          <ChevronLeft className='w-4 h-4 app-text' />
        </button>
        <span className='app-text font-bold text-sm'>{tool.name}</span>
        <button onClick={() => { setStep(0); setDone(false); }} className='w-9 h-9 rounded-xl glass-subtle flex items-center justify-center'>
          <RotateCcw className='w-3.5 h-3.5 app-text-2' />
        </button>
      </div>

      {/* المحتوى */}
      <div className='flex-1 flex items-center justify-center px-8'>
        {done ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='text-center'>
            <div className='w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <CheckCircle2 className='w-8 h-8' style={{ color: 'var(--gold-accent)' }} />
            </div>
            <p className='app-text font-bold text-lg mb-1'>أحسنت!</p>
            <p className='app-text-muted text-sm'>نسأل الله أن يريح قلبك</p>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='text-center w-full'
          >
            <div className='w-10 h-10 mx-auto mb-5 rounded-full flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <span className='font-bold text-sm' style={{ color: 'var(--gold-accent)' }}>{step + 1}</span>
            </div>
            <p className='app-text text-lg leading-loose' style={{ fontFamily: 'var(--font-arabic)' }}>
              {tool.steps[step]}
            </p>
          </motion.div>
        )}
      </div>

      {/* زر التالي */}
      {!done && (
        <div className='px-6 pb-8'>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={next}
            className='w-full py-3 rounded-xl btn-gold font-bold text-sm'
          >
            {step < tool.steps.length - 1 ? 'التالي' : 'تم'}
          </motion.button>
        </div>
      )}
    </div>
  );
}

// Audio Library Section Component
function AudioLibrarySection() {
  const trackStates = audioTracks.map(track => useAudioTrack(track));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='glass-card rounded-2xl p-4'
    >
      <div className='flex items-center gap-2 mb-3'>
        <Star className='w-5 h-5' color='var(--gold-accent)' />
        <h3 className='app-text font-bold text-sm'>مكتبة الأذكار المسموعة</h3>
      </div>
      <div className='space-y-2.5'>
        {audioTracks.map((track, i) => {
          const { playing, toggle } = trackStates[i];
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className='flex items-center gap-3 p-3 rounded-xl glass-subtle'
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0'
                style={{
                  background: playing ? 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))' : 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                }}
              >
                {playing
                  ? <Pause className='w-4 h-4 text-white' />
                  : <Play className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
                }
              </motion.button>
              <div className='flex-1 min-w-0'>
                <h4 className='app-text font-bold text-sm'>{track.name}</h4>
                <p className='app-text-muted text-[11px]'>{track.description}</p>
              </div>
              {playing && (
                <div className='flex gap-0.5 items-end h-5'>
                  {[0, 1, 2, 3].map(bar => (
                    <motion.div
                      key={bar}
                      className='w-1 rounded-full'
                      style={{ background: 'var(--gold-accent)' }}
                      animate={{ height: ['4px', '16px', '8px', '14px', '4px'] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: bar * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// الشاشة الرئيسية المبسطة
export default function RelaxationScreen() {
  const { arabicFont, setCurrentScreen } = useDhikrStore();
  const [activeTool, setActiveTool] = useState<RelaxTool | null>(null);

  const fontClass = getFontClass(arabicFont);

  if (activeTool) {
    return <ToolViewer tool={activeTool} onBack={() => setActiveTool(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className='min-h-screen pb-24'>
      {/* رأس */}
      <header className='px-4 pt-4 pb-3'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <IslamicIcon name='wind' className='w-4 h-4' color='var(--gold-accent)' />
          </div>
          <div>
            <h1 className='app-text font-bold text-base' style={{ fontFamily: fontClass }}>أدوات الاسترخاء</h1>
            <p className='app-text-muted text-[11px]'>تمارين بسيطة لتهدئة النفس</p>
          </div>
        </div>
      </header>

      <main className='px-4 space-y-2.5'>
        {/* مكتبة الأذكار المسموعة */}
        <AudioLibrarySection />

        {tools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTool(tool)}
            className='w-full btn-glass rounded-2xl p-3.5 flex items-center gap-3 text-right'
          >
            <div className='w-11 h-11 rounded-xl flex items-center justify-center shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <IslamicIcon name={tool.icon} className='w-5 h-5' color='var(--gold-accent)' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='app-text font-bold text-sm'>{tool.name}</h3>
              <p className='app-text-muted text-[11px]'>{tool.steps.length} خطوات</p>
            </div>
            <ChevronLeft className='w-4 h-4 app-text-muted rotate-180 shrink-0' />
          </motion.button>
        ))}

        {/* تهدئة سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className='glass-card rounded-2xl p-4 mt-3'
        >
          <p className='app-text-2 text-[11px] mb-2'>تهدئة سريعة</p>
          <div className='space-y-1.5'>
            {[
              { t: 'أستغفر الله العظيم وتب إليه', s: '3 مرات' },
              { t: 'لا حول ولا قوة إلا بالله', s: '7 مرات' },
              { t: 'حسبنا الله ونعم الوكيل', s: '3 مرات' },
            ].map((item, i) => (
              <div key={i} className='flex items-center justify-between py-1.5 px-2.5 rounded-xl glass-subtle'>
                <span className='app-text text-xs'>{item.t}</span>
                <span className='text-[10px]' style={{ color: 'var(--gold-accent)' }}>{item.s}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
