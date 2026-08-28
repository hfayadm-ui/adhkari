'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import { Home, BookOpen, Hand, BarChart3, Settings, Wind } from '@/components/dhikr/islamic-icons';

const tabs: { id: Screen; label: string; iconName: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', iconName: 'home', icon: <Home className='w-5 h-5' /> },
  { id: 'library', label: 'المكتبة', iconName: 'book', icon: <BookOpen className='w-5 h-5' /> },
  { id: 'counter', label: 'المسبحة', iconName: 'hand', icon: <Hand className='w-5 h-5' /> },
  { id: 'relaxation', label: 'استرخاء', iconName: 'wind', icon: <Wind className='w-5 h-5' /> },
  { id: 'stats', label: 'إحصائيات', iconName: 'bar-chart', icon: <BarChart3 className='w-5 h-5' /> },
  { id: 'settings', label: 'الإعدادات', iconName: 'settings', icon: <Settings className='w-5 h-5' /> },
];

const colorMap: Record<string, { active: string; bg: string; border: string }> = {
  emerald: { active: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' },
  blue: { active: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' },
  purple: { active: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20' },
  amber: { active: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
  rose: { active: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' },
};

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, themeColor } = useDhikrStore();

  const c = colorMap[themeColor] || colorMap.emerald;
  const isActive = (id: Screen) => currentScreen === id;

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50'>
      <div className='max-w-md mx-auto'>
        <div className='mx-3 mb-3 rounded-2xl border app-border-c'
          style={{
            background: 'var(--app-nav-bg)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          }}
        >
          <div className='h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent' />
          <div className='flex items-center justify-around py-2'>
            {tabs.map((tab) => {
              const active = isActive(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentScreen(tab.id)}
                  className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[48px] ${
                    active ? `${c.active}` : 'app-text-muted hover:app-text-2'
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
