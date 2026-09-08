'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, Screen } from '@/lib/store';
import { Home, BookOpen, BarChart3, Settings } from '@/components/dhikr/islamic-icons';
import { MisbahaIcon } from '@/components/dhikr/islamic-icons';

const sideTabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', icon: <Home className='w-[22px] h-[22px]' /> },
  { id: 'library', label: 'المكتبة', icon: <BookOpen className='w-[22px] h-[22px]' /> },
  { id: 'stats', label: 'إحصائيات', icon: <BarChart3 className='w-[22px] h-[22px]' /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className='w-[22px] h-[22px]' /> },
];

function SideTab({ tab, active, onClick }: {
  tab: (typeof sideTabs)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={active ? {} : { scale: 0.88 }}
      onClick={onClick}
      className='relative flex flex-col items-center justify-center gap-[3px] px-2 py-2 rounded-2xl transition-colors duration-200'
      style={{ minWidth: 60 }}
      aria-label={tab.label}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.div
          layoutId='nav-pill'
          className='absolute inset-0 rounded-2xl'
          style={{
            background: 'linear-gradient(180deg, var(--gold-glow-strong), rgba(197,160,89,0.05))',
            border: '1px solid var(--gold-border-glow)',
            boxShadow: '0 4px 14px rgba(197,160,89,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      )}
      <motion.span
        className='relative z-10'
        animate={{
          color: active ? 'var(--gold-accent)' : 'var(--app-text-muted)',
          y: active ? -1 : 0,
          scale: active ? 1.08 : 1,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{ display: 'inline-flex', color: active ? 'var(--gold-accent)' : 'var(--app-text-muted)' }}
      >
        {tab.icon}
      </motion.span>
      <span
        className='relative z-10 text-[10px] transition-colors duration-200'
        style={{
          color: active ? 'var(--gold-accent)' : 'var(--app-text-muted)',
          fontWeight: active ? 600 : 500,
        }}
      >
        {tab.label}
      </span>
    </motion.button>
  );
}

export default function BottomNav() {
  const { currentScreen, setCurrentScreen } = useDhikrStore();
  const counterActive = currentScreen === 'counter';

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 pointer-events-none'>
      <div className='max-w-md mx-auto px-3 pb-3 pointer-events-auto'>
        <div
          className='relative rounded-[1.6rem] pb-safe'
          style={{
            background: 'var(--app-nav-bg)',
            backdropFilter: 'blur(40px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
            border: '1px solid var(--gold-border)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.28)',
          }}
        >
          {/* Gold top sheen */}
          <div
            className='absolute top-0 left-4 right-4 h-px'
            style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border-glow) 45%, var(--gold-border-glow) 55%, transparent)' }}
          />

          <div className='flex items-end justify-around px-1 pt-1.5 pb-1.5'>
            {sideTabs.slice(0, 2).map(tab => (
              <SideTab
                key={tab.id}
                tab={tab}
                active={currentScreen === tab.id}
                onClick={() => setCurrentScreen(tab.id)}
              />
            ))}

            {/* Raised Misbaha button — the core action */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setCurrentScreen('counter')}
              className='relative flex flex-col items-center justify-end'
              style={{ minWidth: 68 }}
              aria-label='المسبحة'
              aria-current={counterActive ? 'page' : undefined}
            >
              {/* Halo glow */}
              <motion.div
                className='absolute rounded-full pointer-events-none'
                style={{
                  width: 78,
                  height: 78,
                  bottom: 26,
                  background: 'radial-gradient(circle, var(--gold-glow-strong), transparent 70%)',
                }}
                animate={{ opacity: counterActive ? [0.85, 1, 0.85] : 0.5 }}
                transition={{ duration: 2.6, repeat: counterActive ? Infinity : 0, ease: 'easeInOut' }}
              />
              {/* Gold disc */}
              <motion.div
                className='relative flex items-center justify-center rounded-full'
                style={{
                  width: 56,
                  height: 56,
                  marginTop: -40,
                  background: 'linear-gradient(150deg, var(--gold-bright) 0%, var(--gold-accent) 52%, var(--gold-soft) 100%)',
                  boxShadow: counterActive
                    ? '0 10px 26px rgba(197,160,89,0.5), 0 0 0 5px var(--gold-glow), inset 0 1.5px 0 rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.14)'
                    : '0 6px 18px rgba(197,160,89,0.38), 0 2px 6px rgba(0,0,0,0.10), 0 0 0 1px var(--gold-border-glow), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.12)',
                }}
                animate={{ scale: counterActive ? 1.06 : 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <MisbahaIcon className='w-[26px] h-[26px]' color='#33270e' />
              </motion.div>
              <span
                className='relative z-10 text-[10px] mt-[3px] transition-colors duration-200'
                style={{
                  color: counterActive ? 'var(--gold-accent)' : 'var(--app-text-muted)',
                  fontWeight: counterActive ? 600 : 500,
                }}
              >
                المسبحة
              </span>
            </motion.button>

            {sideTabs.slice(2).map(tab => (
              <SideTab
                key={tab.id}
                tab={tab}
                active={currentScreen === tab.id}
                onClick={() => setCurrentScreen(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
