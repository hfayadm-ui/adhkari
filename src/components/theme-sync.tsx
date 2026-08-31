'use client';

import { useEffect } from 'react';
import { useDhikrStore } from '@/lib/store';

export default function ThemeSync() {
  const appMode = useDhikrStore(s => s.appMode);
  const selectedBackground = useDhikrStore(s => s.selectedBackground);

  /* Sync dark/light mode */
  useEffect(() => {
    const root = document.documentElement;
    if (appMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [appMode]);

  /* Sync background class on body */
  useEffect(() => {
    const body = document.body;
    // Remove any existing bg-app-* class
    body.className = body.className.replace(/bg-app-\w+/g, '').trim();
    // Apply new one (skip 'default' which means no class)
    if (selectedBackground && selectedBackground !== 'default') {
      body.classList.add(`bg-app-${selectedBackground}`);
    }
  }, [selectedBackground]);

  return null;
}
