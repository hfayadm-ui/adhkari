'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Wind, Brain, Flower2, Heart, Droplets, Play, Pause, RotateCcw, ChevronLeft } from '@/components/dhikr/islamic-icons';
import { useDhikrStore, ArabicFont } from '@/lib/store';

// ==================== أنواع تقنيات التنفس ====================
interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefit: string;
  icon: string;
  color: string;
  phases: { name: string; duration: number; instruction: string }[];
  cycles: number;
  islamicNote?: string;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: '478',
    name: 'تنفس 4-7-8 المهدّئ',
    description: 'تقنية التنفس المهدّئ الشهيرة التي تساعد على الاسترخاء العميق والنوم السريع',
    benefit: 'يقلل التوتر ويساعد على النوم',
    icon: 'wind',
    color: 'from-sky-500 to-blue-600',
    islamicNote: 'قال النبي ﷺ: "إذا أوى أحدكم إلى فراشه فلينفض فراشه بداخل إزاره فإنه لا يدري ما خلفه عليه"',
    phases: [
      { name: 'شهيق', duration: 4, instruction: 'تنفّس ببطء من أنفك' },
      { name: 'حبس', duration: 7, instruction: 'احبس نفسك بهدوء' },
      { name: 'زفير', duration: 8, instruction: 'أخرج النفس ببطء من فمك' },
    ],
    cycles: 4,
  },
  {
    id: 'box',
    name: 'التنفس المربّع',
    description: 'تقنية مستخدمة في التأمل تساعد على التركيز وتهدئة العقل بسرعة',
    benefit: 'يزيد التركيز ويهدئ العقل',
    icon: 'brain',
    color: 'from-violet-500 to-purple-600',
    islamicNote: 'الخشوع في الصلاة يتطلب صفاء الذهن، والتنفس المربّع يساعد على ذلك',
    phases: [
      { name: 'شهيق', duration: 4, instruction: 'تنفّس ببطء' },
      { name: 'حبس', duration: 4, instruction: 'احبس النفس' },
      { name: 'زفير', duration: 4, instruction: 'أخرج النفس ببطء' },
      { name: 'حبس', duration: 4, instruction: 'انتظر قبل الشهيق التالي' },
    ],
    cycles: 4,
  },
  {
    id: 'deep',
    name: 'التنفس العميق من البطن',
    description: 'تنفس عميق يملأ البطن بالهواء لتنشيط الجهاز العصبي المبسّط',
    benefit: 'يقلل ضغط الدم وتهدئة الجسم',
    icon: 'droplets',
    color: 'from-emerald-500 to-teal-600',
    islamicNote: 'قال تعالى: ﴿أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ﴾',
    phases: [
      { name: 'شهيق', duration: 5, instruction: 'تنفّس عميقاً واملأ بطنك' },
      { name: 'زفير', duration: 5, instruction: 'أفرغ بطنك ببطء' },
    ],
    cycles: 6,
  },
  {
    id: 'relaxing',
    name: 'تنفس الاسترخاء',
    description: 'تنفس بطيء ومتساوٍ لتهدئة الجهاز العصبي وتقليل القلق',
    benefit: 'يخفف القلق والتوتر العضلي',
    icon: 'flower',
    color: 'from-rose-500 to-pink-600',
    islamicNote: 'قال ﷺ: "إنَّ سورةً من القرآن ثلاثون آية شفعت لصاحبها حتى غُفر له: ﴿تبارك الذي بيده الملك﴾"',
    phases: [
      { name: 'شهيق', duration: 4, instruction: 'تنفّس ببطء وعمق' },
      { name: 'زفير', duration: 6, instruction: 'أخرج النفس أبطأ من الشهيق' },
    ],
    cycles: 5,
  },
];

// ==================== أدوات تقليل التوتر ====================
interface RelaxationTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  content: string[];
  islamicContext?: string;
}

const relaxationTools: RelaxationTool[] = [
  {
    id: 'muscle',
    name: 'الاسترخاء العضلي التدريجي',
    description: 'تقنية لتفكيك التوتر العضلي عضلة بعضلة',
    icon: 'shield',
    color: 'from-blue-500 to-indigo-600',
    islamicContext: 'الاسترخاء بعد الوضوء يعيد النشاط للجسم والروح معاً',
    content: [
      'اجلس في مكان هادئ مريح وأغلق عينيك',
      'خذ 3 أنفاس عميقة للاستعداد',
      'ابدأ بقدميك: شدّ عضلاتهما 5 ثوانٍ ثم أرخِ',
      'انتقل إلى ربليك: شدّ 5 ثوانٍ ثم أرخِ',
      'شدّ فخذيك معاً ثم أرخِ ببطء',
      'اضغط بطنك للداخل ثم أرخِ',
      'شدّ كتفيك نحو أذنيك ثم أرخِ',
      'أغلق يديك بقوة ثم أرخِ',
      'توتّر وجهك (جبهة، عيون، فك) ثم أرخِ',
      'خذ نفساً عميقاً واشعر بالاسترخاء الكامل',
      'قل: اللهم إني أعوذ بك من الهم والحزن',
    ],
  },
  {
    id: 'dhikr-calm',
    name: 'أذكار السكينة',
    description: 'أذكار مخصصة لتهدئة القلب وتسكين النفس',
    icon: 'heart',
    color: 'from-emerald-500 to-green-600',
    islamicContext: 'أفضل ما يُسكَّن به القلق ذكر الله تعالى',
    content: [
      '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
      'استمع لتلاوة سورة الرحمن بهدوء',
      'ردّد: حسبي الله لا إله إلا هو عليه توكلت',
      'قل: اللهم إني أعوذ بك من الهم والحزن والعجز والكسل',
      'ردّد: لا إله إلا أنت سبحانك إني كنت من الظالمين',
      'صلّ على النبي ﷺ وادعُ بالفرج',
      'استمع لصوت المطر أو الطبيعة',
      'أغمض عينيك وتخيّل الجنة ونعيمها',
      'ردّد: رب اشرح لي صدري ويسّر لي أمري',
      'اختم بـ: subhanAllah 33 مرة بهدوء',
    ],
  },
  {
    id: 'body-scan',
    name: 'الوعي الجسدي',
    description: 'فحص الجسم للوعي بأماكن التوتر وتحريرها',
    icon: 'eye',
    color: 'from-amber-500 to-orange-600',
    islamicContext: 'النبي ﷺ قال: "إن لبدنك عليك حقاً" - الوعي بالجسم من العبادة',
    content: [
      'استلقِ أو اجلس مريحاً وأغلق عينيك',
      'خذ 3 أنفاس عميقة',
      'وجّه انتباهك إلى رأسك: هل تشعر بتوتر؟',
      'انتقل إلى وجهك: أرخِ عضلات الوجه بالكامل',
      'انتبه لرقبتك وكتفيك: أرخِ أي شدّ',
      'تحسّس ذراعيك ويديك: دعها تسترخي',
      'انتبه لصدرك: شعر بكل نفس يدخل ويخرج',
      'انتقل لبطنك: دعه يرتخي مع التنفس',
      'تحسّس ساقيك وقدميك: أرخِ تماماً',
      'اشعر بجسمك كله مسترخياً ومتّصلاً بالأرض',
      'قل في سرك: اللهم أنت السلام ومنك السلام',
    ],
  },
  {
    id: 'gratitude',
    name: 'شكر وامتنان',
    description: 'تأمل في نعم الله لتحويل التركيز من المشاكل إلى النعم',
    icon: 'sparkles',
    color: 'from-rose-500 to-pink-600',
    islamicContext: '﴿لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾',
    content: [
      'اجلس مريحاً وخذ نفساً عميقاً',
      'فكّر في 3 نعم صحية تشعر بها الآن',
      'تأمّل نعمة البصر: كم من شخص لا يرى؟',
      'تأمّل نعمة السمع: كم من أصوات تحبها؟',
      'اشكر نعمة الإيمان: ما أجمل أن تعرف ربك',
      'فكّر في شخص تحبه واشكر وجوده في حياتك',
      'تذكّر نعمة الأمن والأمان حولك',
      'فكّر في لحظة سعيدة مرّت عليك هذا الأسبوع',
      'قل: الحمد لله الذي بنعمته تتم الصالحات',
      'ادعُ: ربِّ اشكر نعمتك التي أنعمت عليّ',
    ],
  },
];

// ==================== مكون الرسوم المتحركة للتنفس ====================
function BreathingCircle({ phase, isActive, totalTime, elapsed }: {
  phase: string;
  isActive: boolean;
  totalTime: number;
  elapsed: number;
}) {
  const isInhale = phase === 'شهيق';
  const isHold = phase === 'حبس';
  const isExhale = phase === 'زفير';

  const scaleValue = isActive
    ? isInhale ? 1.35 : isExhale ? 0.85 : 1.15
    : 1;

  const glowColor = isInhale
    ? 'rgba(59, 130, 246, 0.4)'
    : isExhale
    ? 'rgba(147, 51, 234, 0.4)'
    : 'rgba(16, 185, 129, 0.3)';

  const progress = totalTime > 0 ? (elapsed % totalTime) / totalTime : 0;

  return (
    <div className='relative flex items-center justify-center my-6'>
      {/* Outer glow rings */}
      <motion.div
        className='absolute w-52 h-52 rounded-full'
        animate={{
          scale: isActive ? [1, scaleValue * 1.15] : 1,
          opacity: isActive ? [0.15, 0.3, 0.15] : 0.1,
        }}
        transition={{ duration: totalTime || 4, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
      />
      <motion.div
        className='absolute w-40 h-40 rounded-full'
        animate={{
          scale: isActive ? [1, scaleValue * 1.1] : 1,
          opacity: isActive ? [0.2, 0.4, 0.2] : 0.15,
        }}
        transition={{ duration: totalTime || 4, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
        style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
      />

      {/* Main circle */}
      <motion.div
        className='relative w-36 h-36 rounded-full flex flex-col items-center justify-center'
        style={{
          background: 'var(--app-surface)',
          border: '2px solid var(--app-border)',
          boxShadow: isActive ? `0 0 40px ${glowColor}, 0 0 80px ${glowColor}` : '0 0 20px rgba(212,175,55,0.1)',
        }}
        animate={{
          scale: isActive ? [1, scaleValue] : 1,
        }}
        transition={{ duration: totalTime || 4, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
      >
        <motion.span
          className='text-2xl font-bold app-text'
          animate={{ opacity: isActive ? 1 : 0.5 }}
        >
          {phase || '...' }
        </motion.span>
        {isActive && (
          <motion.span
            className='text-xs app-text-2 mt-1'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.ceil(totalTime - (elapsed % totalTime))}ث
          </motion.span>
        )}
      </motion.div>

      {/* Orbiting particles */}
      {isActive && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='absolute w-2 h-2 rounded-full bg-amber-400/60'
          animate={{
            rotate: [0 + i * 120, 360 + i * 120],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            transformOrigin: '120px center',
          }}
        />
      ))}
    </div>
  );
}

// ==================== مكون حلقة التنفس ====================
function BreathingSession({ technique, onBack }: { technique: BreathingTechnique; onBack: () => void }) {
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  const currentPhase = technique.phases[currentPhaseIndex];
  const totalDuration = technique.phases.reduce((s, p) => s + p.duration, 0);
  const totalSessionTime = totalDuration * technique.cycles;
  const isFinished = currentCycle >= technique.cycles;

  const getCurrentPhaseElapsed = useCallback(() => {
    const elapsedInCycles = elapsed % totalDuration;
    let acc = 0;
    for (let i = 0; i < technique.phases.length; i++) {
      if (elapsedInCycles < acc + technique.phases[i].duration) {
        setCurrentPhaseIndex(i);
        return elapsedInCycles - acc;
      }
      acc += technique.phases[i].duration;
    }
    return 0;
  }, [elapsed, totalDuration, technique.phases]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now() - pauseTimeRef.current;
      timerRef.current = setInterval(() => {
        const e = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(e);
        const cycle = Math.floor(e / totalDuration);
        setCurrentCycle(cycle);
        if (cycle >= technique.cycles) {
          setIsActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      pauseTimeRef.current = elapsed * 1000;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, totalDuration, technique.cycles, elapsed]);

  useEffect(() => {
    getCurrentPhaseElapsed();
  }, [getCurrentPhaseElapsed]);

  const reset = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhaseIndex(0);
    setElapsed(0);
    pauseTimeRef.current = 0;
  };

  const overallProgress = Math.min(elapsed / totalSessionTime, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='min-h-screen flex flex-col'
    >
      {/* Header */}
      <div className='flex items-center justify-between px-4 pt-4 pb-2'>
        <button onClick={onBack} className='w-10 h-10 rounded-full app-surface flex items-center justify-center app-surface-h'>
          <ChevronLeft className='w-5 h-5 app-text' />
        </button>
        <h2 className='app-text font-bold text-base'>{technique.name}</h2>
        <button onClick={reset} className='w-10 h-10 rounded-full app-surface flex items-center justify-center app-surface-h'>
          <RotateCcw className='w-4 h-4 app-text-2' />
        </button>
      </div>

      {/* Progress bar */}
      <div className='mx-4 mb-2'>
        <div className='h-1.5 rounded-full app-surface overflow-hidden'>
          <motion.div
            className='h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-500'
            style={{ width: `${overallProgress * 100}%` }}
          />
        </div>
        <div className='flex justify-between mt-1'>
          <span className='app-text-muted text-[10px]'>الدورة {Math.min(currentCycle + 1, technique.cycles)}/{technique.cycles}</span>
          <span className='app-text-muted text-[10px]'>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Breathing animation */}
      <div className='flex-1 flex flex-col items-center justify-center px-4'>
        <BreathingCircle
          phase={isFinished ? 'تم!' : currentPhase?.name || '...'}
          isActive={isActive}
          totalTime={currentPhase?.duration || 4}
          elapsed={elapsed}
        />
        {/* Instruction */}
        <AnimatePresence mode='wait'>
          <motion.p
            key={currentPhaseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='app-text-2 text-sm text-center mt-4 mb-2'
          >
            {isFinished ? 'أحسنت! أكملت جميع الدورات' : currentPhase?.instruction || ''}
          </motion.p>
        </AnimatePresence>

        {/* Phase indicators */}
        <div className='flex items-center gap-2 mt-3'>
          {technique.phases.map((p, i) => (
            <div
              key={i}
              className={`px-3 py-1.5 rounded-full text-xs transition-all duration-300 ${
                i === currentPhaseIndex && isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'app-surface app-text-muted'
              }`}
            >
              {p.name}
            </div>
          ))}
        </div>

        {/* Islamic note */}
        {technique.islamicNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='mt-6 text-center max-w-xs'
          >
            <p className='text-amber-400/60 text-[11px] leading-relaxed'>{technique.islamicNote}</p>
          </motion.div>
        )}
      </div>

      {/* Control button */}
      <div className='px-4 pb-8 pt-4 flex justify-center'>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => !isFinished && setIsActive(!isActive)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isFinished
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : isActive
              ? 'bg-amber-500/20 border border-amber-500/30'
              : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20'
          }`}
        >
          {isFinished ? (
            <IslamicIcon name='check-circle' className='w-7 h-7 text-emerald-400' />
          ) : isActive ? (
            <Pause className='w-7 h-7 text-amber-300' />
          ) : (
            <Play className='w-7 h-7 text-white ml-0.5' />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ==================== مكون أداة الاسترخاء ====================
function RelaxationToolViewer({ tool, onBack }: { tool: RelaxationTool; onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const next = () => {
    if (currentStep < tool.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  const progress = (currentStep + 1) / tool.content.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='min-h-screen flex flex-col'
    >
      {/* Header */}
      <div className='flex items-center justify-between px-4 pt-4 pb-2'>
        <button onClick={onBack} className='w-10 h-10 rounded-full app-surface flex items-center justify-center app-surface-h'>
          <ChevronLeft className='w-5 h-5 app-text' />
        </button>
        <h2 className='app-text font-bold text-sm'>{tool.name}</h2>
        <button onClick={reset} className='w-10 h-10 rounded-full app-surface flex items-center justify-center app-surface-h'>
          <RotateCcw className='w-4 h-4 app-text-2' />
        </button>
      </div>

      {/* Progress */}
      <div className='mx-4 mb-4'>
        <div className='h-1.5 rounded-full app-surface overflow-hidden'>
          <motion.div
            className='h-full rounded-full bg-gradient-to-l from-amber-400 to-amber-500'
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className='app-text-muted text-[10px] mt-1 block'>{currentStep + 1} / {tool.content.length}</span>
      </div>

      <div className='flex-1 flex flex-col items-center justify-center px-6'>
        <AnimatePresence mode='wait'>
          {isComplete ? (
            <motion.div
              key='complete'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className='w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center'
              >
                <IslamicIcon name='check-circle' className='w-10 h-10 text-emerald-400' />
              </motion.div>
              <h3 className='app-text text-xl font-bold mb-2'>أحسنت!</h3>
              <p className='app-text-2 text-sm mb-6'>أكملت الجلسة بنجاح، نسأل الله أن يريح قلبك</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className='px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium text-sm shadow-lg shadow-amber-500/20'
              >
                إعادة الجلسة
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className='text-center w-full'
            >
              {/* Step number */}
              <div className='w-12 h-12 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center'>
                <span className='text-amber-400 font-bold text-lg'>{currentStep + 1}</span>
              </div>

              {/* Step text */}
              <p className='app-text text-lg leading-loose mb-8' style={{ fontFamily: 'var(--font-arabic)' }}>
                {tool.content[currentStep]}
              </p>

              {/* Islamic context for first step */}
              {currentStep === 0 && tool.islamicContext && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className='text-amber-400/50 text-xs leading-relaxed mb-6'
                >
                  {tool.islamicContext}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next button */}
      {!isComplete && (
        <div className='px-4 pb-8 flex justify-center'>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={next}
            className='w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20'
          >
            {currentStep < tool.content.length - 1 ? 'الخطوة التالية' : 'إنهاء الجلسة'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ==================== الشاشة الرئيسية ====================
function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)',
    'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)',
    'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)',
    'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function RelaxationScreen() {
  const { arabicFont, themeColor } = useDhikrStore();
  const [activeView, setActiveView] = useState<'main' | 'breathing' | 'tool'>('main');
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [selectedTool, setSelectedTool] = useState<RelaxationTool | null>(null);

  const fontClass = getFontClass(arabicFont);

  const handleBack = () => {
    if (activeView !== 'main') {
      setActiveView('main');
      setSelectedTechnique(null);
      setSelectedTool(null);
    }
  };

  // Show breathing session
  if (activeView === 'breathing' && selectedTechnique) {
    return <BreathingSession technique={selectedTechnique} onBack={handleBack} />;
  }

  // Show relaxation tool
  if (activeView === 'tool' && selectedTool) {
    return <RelaxationToolViewer tool={selectedTool} onBack={handleBack} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='min-h-screen pb-24'>
      {/* Header */}
      <header className='px-4 pt-4 pb-4'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-600/10 border border-sky-500/20 flex items-center justify-center'>
            <Wind className='w-5 h-5 text-sky-400' />
          </div>
          <div>
            <h1 className='text-xl font-bold app-text' style={{ fontFamily: fontClass }}>أدوات الاسترخاء</h1>
            <p className='app-text-muted text-xs mt-0.5'>تقنيات تنفس وأدوات تقليل التوتر</p>
          </div>
        </div>
      </header>

      <main className='px-4 space-y-5'>
        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className='glass-card rounded-2xl p-4 border border-amber-500/10'
        >
          <p className='app-text-2 text-sm leading-relaxed' style={{ fontFamily: fontClass }}>
            قال النبي ﷺ: "عَلَيْكُمْ بِالسَّكِينَةِ". إليك أدوات تساعدك على الاسترخاء وتهدئة النفس مستوحاة من السنة النبوية.
          </p>
        </motion.div>

        {/* Breathing Techniques Section */}
        <div>
          <div className='flex items-center gap-2 mb-3'>
            <Wind className='w-4 h-4 text-sky-400' />
            <h2 className='app-text font-bold text-sm' style={{ fontFamily: fontClass }}>تقنيات التنفس</h2>
          </div>
          <div className='space-y-2.5'>
            {breathingTechniques.map((tech, i) => (
              <motion.button
                key={tech.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedTechnique(tech); setActiveView('breathing'); }}
                className='w-full glass-card rounded-2xl p-4 border border-amber-500/10 text-right'
              >
                <div className='flex items-center gap-3'>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <IslamicIcon name={tech.icon} className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='app-text font-bold text-sm mb-0.5'>{tech.name}</h3>
                    <p className='app-text-muted text-[11px] truncate'>{tech.description}</p>
                  </div>
                  <ChevronLeft className='w-4 h-4 app-text-muted rotate-180 shrink-0' />
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <div className='flex gap-1'>
                    {tech.phases.map((p, j) => (
                      <span key={j} className='px-1.5 py-0.5 rounded text-[9px] app-surface app-text-muted'>
                        {p.name} {p.duration}ث
                      </span>
                    ))}
                  </div>
                  <span className='app-text-muted text-[9px] mr-auto'>{tech.cycles} دورات</span>
                  <span className='text-amber-400/60 text-[9px]'>{tech.benefit}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Relaxation Tools Section */}
        <div>
          <div className='flex items-center gap-2 mb-3'>
            <Brain className='w-4 h-4 text-purple-400' />
            <h2 className='app-text font-bold text-sm' style={{ fontFamily: fontClass }}>أدوات تقليل التوتر</h2>
          </div>
          <div className='grid grid-cols-2 gap-2.5'>
            {relaxationTools.map((tool, i) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setSelectedTool(tool); setActiveView('tool'); }}
                className='glass-card rounded-2xl p-3.5 border border-amber-500/10 text-center'
              >
                <div className={`w-11 h-11 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 shadow-lg`}>
                  <IslamicIcon name={tool.icon} className='w-5 h-5 text-white' />
                </div>
                <h3 className='app-text font-bold text-xs mb-0.5'>{tool.name}</h3>
                <p className='app-text-muted text-[10px] leading-relaxed'>{tool.content.length} خطوة</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Calm Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='glass-card rounded-2xl p-4 border border-amber-500/10'
        >
          <div className='flex items-center gap-2 mb-3'>
            <Heart className='w-4 h-4 text-rose-400' />
            <h2 className='app-text font-bold text-sm' style={{ fontFamily: fontClass }}>تهدئة سريعة</h2>
          </div>
          <div className='space-y-2'>
            {[
              { text: 'استغفر الله العظيم وتب إليه', sub: 'أقلل التوتر بالاستغفار' },
              { text: 'لا حول ولا قوة إلا بالله', sub: 'تفويض الأمر لله' },
              { text: 'حسبنا الله ونعم الوكيل', sub: 'التوكل على الله' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                className='flex items-center gap-3 p-2.5 rounded-xl app-surface app-surface-h'
              >
                <div className='w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0'>
                  <span className='text-amber-400 text-xs'>{i + 1}</span>
                </div>
                <div>
                  <p className='app-text text-xs font-medium'>{item.text}</p>
                  <p className='app-text-muted text-[10px]'>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
