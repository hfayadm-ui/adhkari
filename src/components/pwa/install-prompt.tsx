'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Smartphone } from '@/components/dhikr/islamic-icons';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const dismissedTime = localStorage.getItem('dz_installDismissed');
    if (dismissedTime) {
      const diff = Date.now() - parseInt(dismissedTime);
      if (diff < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('dz_installDismissed', String(Date.now()));
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className='fixed bottom-20 left-3 right-3 z-[150] max-w-md mx-auto'
      >
        <div
          className='rounded-2xl p-4 flex items-center gap-3'
          style={{
            background: 'var(--app-modal-bg)',
            backdropFilter: 'blur(40px) saturate(1.5)',
            border: '1px solid var(--gold-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px var(--gold-border-glow)',
          }}
        >
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0'
            style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Smartphone className='w-6 h-6 text-white' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='app-text font-bold text-sm'>ثبّت أذكاري</p>
            <p className='app-text-muted text-[11px]'>أضف التطبيق لشاشتك الرئيسية</p>
          </div>
          <button
            onClick={handleInstall}
            className='px-4 py-2 rounded-xl text-white text-xs font-bold flex-shrink-0'
            style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', boxShadow: '0 2px 12px var(--gold-glow)' }}
          >
            تثبيت
          </button>
          <button onClick={handleDismiss} className='flex-shrink-0 p-1'>
            <X className='w-4 h-4 app-text-muted' />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}