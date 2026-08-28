'use client';

import { useEffect } from 'react';
import { useDhikrStore } from '@/lib/store';

export default function ThemeSync() {
  const appMode = useDhikrStore(s => s.appMode);

  useEffect(() => {
    const root = document.documentElement;
    if (appMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [appMode]);

  return null;
}
