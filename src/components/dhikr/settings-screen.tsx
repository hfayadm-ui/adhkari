'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { ArrowRight, Volume2, VolumeX, Vibrate, VibrateOff, Moon, Sun, RotateCcw } from 'lucide-react';

export default function SettingsScreen() {
  const {
    soundEnabled, toggleSound,
    vibrationEnabled, toggleVibration,
    setCurrentScreen, resetDaily,
    streak, setStreak, treeLevel, setTreeLevel,
    totalDhikrThisWeek, addTotalDhikr,
  } = useDhikrStore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm">رجوع</span>
        </button>
        <h2 className="text-emerald-200 font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>الإعدادات</h2>
      </header>

      <main className="flex-1 px-4 pt-4 pb-24 space-y-4">
        {/* Sound Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-white font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>الأصوات</p>
                <p className="text-slate-400 text-xs">صوت خفيف عند الضغط</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: soundEnabled ? 'calc(100% - 26px)' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Vibration Setting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                {vibrationEnabled ? (
                  <Vibrate className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VibrateOff className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-white font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>الاهتزاز</p>
                <p className="text-slate-400 text-xs">اهتزاز خفيف عند الضغط</p>
              </div>
            </div>
            <button
              onClick={toggleVibration}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                vibrationEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: vibrationEnabled ? 'calc(100% - 26px)' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Prayer Calculation Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium" style={{ fontFamily: 'var(--font-arabic)' }}>طريقة الحساب</p>
              <p className="text-slate-400 text-xs">حساب مواقيت الصلاة</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['أم القرى', 'الإتحاد الإسلامي', 'المذهب الحنفي', 'تصحيح المسافة'].map((method, i) => (
              <button
                key={i}
                className={`py-2.5 px-3 rounded-xl text-xs transition-all ${
                  i === 0
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
                style={{ fontFamily: 'var(--font-arabic)' }}
              >
                {method}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <h3 className="text-white font-medium mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-arabic)' }}>
            <RotateCcw className="w-4 h-4 text-slate-400" />
            إدارة البيانات
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (confirm('هل تريد إعادة تعيين أذكار اليوم؟')) {
                  resetDaily();
                }
              }}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              إعادة تعيين أذكار اليوم
            </button>
            <button
              onClick={() => {
                if (confirm('هل تريد إعادة تعيين جميع الإحصائيات؟ لا يمكن التراجع.')) {
                  setStreak(0);
                  setTreeLevel(0);
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/20 transition-colors"
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              إعادة تعيين جميع البيانات
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center"
        >
          <span className="text-3xl block mb-2">🕌</span>
          <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-arabic)' }}>أذكاري</h3>
          <p className="text-slate-400 text-xs">تطبيق أذكار ما بعد الصلاة</p>
          <p className="text-emerald-300/40 text-xs mt-2">الإصدار 1.0.0</p>
          <p className="text-emerald-300/30 text-xs mt-1">بسم الله، جعلنا هذا التطبيق في ميزان حسناتكم</p>
        </motion.div>
      </main>
    </div>
  );
}
