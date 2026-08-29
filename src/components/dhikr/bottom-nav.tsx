'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import { Home, BookOpen, Hand, BarChart3, Settings } from '@/components/dhikr/islamic-icons';

const tabs: { id: Screen; label: string; iconName: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', iconName: 'home', icon: <Home className='w-5 h-5' /> },
  { id: 'library', label: 'المكتبة', iconName: 'book', icon: <BookOpen className='w-5 h-5' /> },
  { id: 'counter', label: 'المسبحة', iconName: 'hand', icon: <Hand className='w-5 h-5' /> },
  { id: 'stats', label: 'إحصائيات', iconName: 'bar-chart', icon: <BarChart3 className='w-5 h-5' /> },
  { id: 'settings', label: 'الإعدادات', iconName: 'settings', icon: <Settings className='w-5 h-5' /> },
];

export default function BottomNav() {
  const { currentScreen, setCurrentScreen } = useDhikrStore();
  const isActive = (id: Screen) => currentScreen === id;

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50'>
      <div className='max-w-md mx-auto'>
        <div
          className='mx-3 mb-3 rounded-2xl'
          style={{
            background: 'var(--app-nav-bg)',
            backdropFilter: 'blur(28px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
            border: '1px solid var(--app-card-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Gold top highlight line */}
          <div className='h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />
          <div className='flex items-center justify-around py-2'>
            {tabs.map((tab) => {
              const active = isActive(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentScreen(tab.id)}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                    active ? '' : 'hover:opacity-80'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId='activeTab'
                      className='absolute inset-0 rounded-xl'
                      style={{
                        background: 'var(--gold-glow)',
                        border: '1px solid var(--gold-border)',
                        boxShadow: '0 0 16px var(--gold-glow)',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className='relative z-10' style={{ color: active ? 'var(--gold-accent)' : 'var(--app-text-muted)' }}>
                    {tab.icon}
                  </span>
                  <span
                    className='relative z-10 text-[10px] font-medium transition-colors'
                    style={{ color: active ? 'var(--gold-accent)' : 'var(--app-text-muted)' }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
