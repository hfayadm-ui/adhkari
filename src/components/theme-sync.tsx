'use client';

import { useEffect } from 'react';
import { useDhikrStore } from '@/lib/store';

/* Map old removed backgrounds to new ones */
const BG_MIGRATION: Record<string, string> = {
  'mosque': 'mosque-andalusia',
  'waves': 'islamic-pattern',
  'flowers': 'mihrab',
  'night': 'stars',
};

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
    // Remove any existing bg-app-* class (handles hyphenated names)
    body.className = body.className.replace(/bg-app-[\w-]+/g, '').trim();
    // Migrate old backgrounds
    const resolved = BG_MIGRATION[selectedBackground] || selectedBackground;
    // Apply new one (skip 'default' which means no class)
    if (resolved && resolved !== 'default') {
      body.classList.add(`bg-app-${resolved}`);
    }
  }, [selectedBackground]);

  return null;
}
