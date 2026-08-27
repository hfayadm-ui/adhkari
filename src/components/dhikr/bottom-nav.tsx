'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import { Home, BookOpen, Hand, BarChart3, Settings } from 'lucide-react';

const tabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className='w-5 h-5' /> },
  { id: 'library', label: 'المكتبة', icon: <BookOpen className='w-5 h-5' /> },
  { id: 'counter', label: 'المسبحة', icon: <Hand className='w-5 h-5' /> },
  { id: 'stats', label: 'إحصائيات', icon: <BarChart3 className='w-5 h-5' /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className='w-5 h-5' /> },
];

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, themeColor } = useDhikrStore();

  const colorMap: Record<string, string> = {
    emerald: { active: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue: { active: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    purple: { active: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    amber: { active: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    rose: { active: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  };

  const c = colorMap[themeColor] || colorMap.emerald;
  const isActive = (id: Screen) => currentScreen === id;

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50'>
      <div className='max-w-md mx-auto'>
        <div className='mx-3 mb-3 rounded-2xl border border-white/10'
          style={{ background: 'rgba(10, 15, 26, 0.92)', backdropFilter: 'blur(20px)' }}
        >
          <div className='flex items-center justify-around py-2'>
            {tabs.map((tab) => {
              const active = isActive(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentScreen(tab.id)}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                    active ? `${c.active}` : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId='activeTab'
                      className={`absolute inset-0 rounded-xl ${c.bg} border ${c.border}`}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className='relative z-10'>{tab.icon}</span>
                  <span className='relative z-10 text-[10px] font-medium'>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
