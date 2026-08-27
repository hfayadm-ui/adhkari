'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, ThemeColor } from '@/lib/store';
import { Volume2, VolumeX, Vibrate, VibrateOff, Type, Palette, Moon, RotateCcw, Shield, Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const themes: { id: ThemeColor; name: string; gradient: string; dot: string }[] = [
  { id: 'emerald', name: 'أخضر زمردي', gradient: 'from-emerald-500 to-teal-500', dot: 'bg-emerald-400' },
  { id: 'blue', name: 'أزرق سماوي', gradient: 'from-blue-500 to-cyan-500', dot: 'bg-blue-400' },
  { id: 'purple', name: 'بنفسجي', gradient: 'from-purple-500 to-violet-500', dot: 'bg-purple-400' },
  { id: 'amber', name: 'ذهبي', gradient: 'from-amber-500 to-orange-500', dot: 'bg-amber-400' },
  { id: 'rose', name: 'وردي', gradient: 'from-rose-500 to-pink-500', dot: 'bg-rose-400' },
];

const fontSizes: { id: 'small' | 'medium' | 'large'; name: string; sample: string }[] = [
  { id: 'small', name: 'صغير', sample: 'text-sm' },
  { id: 'medium', name: 'متوسط', sample: 'text-lg' },
  { id: 'large', name: 'كبير', sample: 'text-2xl' },
];

const calcMethods = ['أم القرى', 'الإتحاد الإسلامي', 'المذهب الحنفي', 'تصحيح المسافة', 'الهيئة المصرية'];

function SettingRow({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className='rounded-2xl bg-white/5 border border-white/10 p-4'>
      {children}
    </motion.div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-emerald-500' : 'bg-slate-700'}`}>
      <motion.div className='absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md'
        animate={{ left: value ? 'calc(100% - 22px)' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function SettingsScreen() {
  const {
    soundEnabled, toggleSound, vibrationEnabled, toggleVibration,
    fontSize, setFontSize, themeColor, setThemeColor,
    calculationMethod, setCalculationMethod,
    resetDaily, streak, setStreak, treeLevel, setTreeLevel, totalAllTime,
  } = useDhikrStore();
  const [showCalc, setShowCalc] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <h1 className='text-2xl font-bold text-white' style={{ fontFamily: 'var(--font-arabic)' }}>⚙ الإعدادات</h1>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-3'>
        {/* Theme Colors */}
        <SettingRow delay={0.05}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'><Palette className='w-4 h-4 text-emerald-400' /></div>
            <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>لون التطبيق</p><p className='text-slate-400 text-[11px]'>اختر الثيم المفضل</p></div>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {themes.map(t => (
              <button key={t.id} onClick={() => setThemeColor(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${themeColor === t.id ? 'bg-white/10 border border-white/20' : 'bg-white/[0.03] border border-white/5 hover:bg-white/5'}`}>
                <div className={`w-4 h-4 rounded-full ${t.dot}`} />
                <span className='text-slate-200 text-xs'>{t.name}</span>
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Font Size */}
        <SettingRow delay={0.1}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'><Type className='w-4 h-4 text-emerald-400' /></div>
            <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>حجم الخط</p><p className='text-slate-400 text-[11px]'>حجم خط الأذكار أثناء القراءة</p></div>
          </div>
          <div className='flex gap-2'>
            {fontSizes.map(f => (
              <button key={f.id} onClick={() => setFontSize(f.id)}
                className={`flex-1 py-2.5 rounded-xl text-center transition-all ${fontSize === f.id ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-white/5 border border-white/10'}`}>
                <span className={`text-slate-200 ${f.sample} block`} style={{ fontFamily: 'var(--font-arabic)' }}>سبحان الله</span>
                <span className='text-[10px] text-slate-400 block mt-0.5'>{f.name}</span>
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Sound */}
        <SettingRow delay={0.15}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'>
                {soundEnabled ? <Volume2 className='w-4 h-4 text-emerald-400' /> : <VolumeX className='w-4 h-4 text-slate-500' />}
              </div>
              <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>الأصوات</p><p className='text-slate-400 text-[11px]'>صوت خفيف عند الضغط</p></div>
            </div>
            <Toggle value={soundEnabled} onChange={toggleSound} />
          </div>
        </SettingRow>

        {/* Vibration */}
        <SettingRow delay={0.2}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'>
                {vibrationEnabled ? <Vibrate className='w-4 h-4 text-emerald-400' /> : <VibrateOff className='w-4 h-4 text-slate-500' />}
              </div>
              <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>الاهتزاز</p><p className='text-slate-400 text-[11px]'>اهتزاز خفيف عند الضغط</p></div>
            </div>
            <Toggle value={vibrationEnabled} onChange={toggleVibration} />
          </div>
        </SettingRow>

        {/* Prayer Calculation */}
        <SettingRow delay={0.25}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'><Moon className='w-4 h-4 text-emerald-400' /></div>
            <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>طريقة حساب المواقيت</p></div>
          </div>
          <button onClick={() => setShowCalc(!showCalc)} className='w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10'>
            <span className='text-emerald-300 text-sm'>{calculationMethod}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showCalc ? 'rotate-180' : ''}`} />
          </button>
          {showCalc && (
            <div className='mt-2 grid grid-cols-2 gap-1.5'>
              {calcMethods.map(m => (
                <button key={m} onClick={() => { setCalculationMethod(m); setShowCalc(false); }}
                  className={`py-2 px-3 rounded-lg text-xs transition-all ${calculationMethod === m ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-300' : 'bg-white/5 border border-white/10 text-slate-400'}`}
                  style={{ fontFamily: 'var(--font-arabic)' }}>{m}</button>
              ))}
            </div>
          )}
        </SettingRow>

        {/* Data Management */}
        <SettingRow delay={0.3}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center'><RotateCcw className='w-4 h-4 text-slate-400' /></div>
            <div><p className='text-white font-medium text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>إدارة البيانات</p></div>
          </div>
          <div className='space-y-2'>
            <button onClick={() => { if (confirm('إعادة تعيين أذكار اليوم؟')) resetDaily(); }}
              className='w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors'
              style={{ fontFamily: 'var(--font-arabic)' }}>إعادة تعيين أذكار اليوم</button>
            <button onClick={() => { if (confirm('إعادة تعيين جميع البيانات؟ لا يمكن التراجع.')) { setStreak(0); setTreeLevel(0); localStorage.clear(); window.location.reload(); } }}
              className='w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/20 transition-colors'
              style={{ fontFamily: 'var(--font-arabic)' }}>حذف جميع البيانات</button>
          </div>
        </SettingRow>

        {/* About */}
        <SettingRow delay={0.35}>
          <div className='text-center'>
            <span className='text-3xl block mb-2'>🕌</span>
            <h3 className='text-white font-bold text-base mb-0.5' style={{ fontFamily: 'var(--font-arabic)' }}>أذكاري</h3>
            <p className='text-slate-400 text-xs'>تطبيق أذكار ما بعد الصلاة</p>
            <p className='text-emerald-300/30 text-[10px] mt-2'>الإصدار 2.0.0</p>
            <p className='text-slate-500 text-[10px] mt-1'>بسم الله، جعلنا هذا التطبيق في ميزان حسناتكم</p>
          </div>
        </SettingRow>
      </main>
    </motion.div>
  );
}