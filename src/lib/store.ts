import { create } from 'zustand';

export type Screen = 'home' | 'reading' | 'completion' | 'stats' | 'settings';

interface DhikrState {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;

  selectedPrayerIndex: number;
  setSelectedPrayerIndex: (index: number) => void;

  currentDhikrIndex: number;
  setCurrentDhikrIndex: (index: number) => void;

  currentCount: number;
  setCurrentCount: (count: number) => void;
  resetDhikr: () => void;

  completedPrayers: string[];
  completePrayer: (prayerId: string) => void;
  resetDaily: () => void;

  streak: number;
  setStreak: (streak: number) => void;

  totalDhikrThisWeek: number;
  addTotalDhikr: (amount: number) => void;

  treeLevel: number;
  setTreeLevel: (level: number) => void;

  soundEnabled: boolean;
  toggleSound: () => void;

  vibrationEnabled: boolean;
  toggleVibration: () => void;
}

function loadState<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveState(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useDhikrStore = create<DhikrState>((set, get) => ({
  currentScreen: 'home',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  selectedPrayerIndex: 0,
  setSelectedPrayerIndex: (index) => set({ selectedPrayerIndex: index, currentDhikrIndex: 0, currentCount: 0 }),

  currentDhikrIndex: 0,
  setCurrentDhikrIndex: (index) => set({ currentDhikrIndex: index, currentCount: 0 }),

  currentCount: 0,
  setCurrentCount: (count) => set({ currentCount: count }),
  resetDhikr: () => set({ currentDhikrIndex: 0, currentCount: 0 }),

  completedPrayers: loadState<string[]>('completedPrayers', []),
  completePrayer: (prayerId: string) => {
    const state = get();
    if (!state.completedPrayers.includes(prayerId)) {
      const completed = [...state.completedPrayers, prayerId];
      saveState('completedPrayers', completed);
      set({ completedPrayers: completed });
    }
  },
  resetDaily: () => {
    set({ completedPrayers: [] });
    saveState('completedPrayers', []);
  },

  streak: loadState<number>('streak', 0),
  setStreak: (streak) => {
    saveState('streak', streak);
    set({ streak });
  },

  totalDhikrThisWeek: loadState<number>('totalDhikrThisWeek', 0),
  addTotalDhikr: (amount: number) => {
    const newTotal = get().totalDhikrThisWeek + amount;
    saveState('totalDhikrThisWeek', newTotal);
    set({ totalDhikrThisWeek: newTotal });
  },

  treeLevel: loadState<number>('treeLevel', 0),
  setTreeLevel: (level: number) => {
    saveState('treeLevel', level);
    set({ treeLevel: level });
  },

  soundEnabled: loadState<boolean>('soundEnabled', true),
  toggleSound: () => {
    const newVal = !get().soundEnabled;
    saveState('soundEnabled', newVal);
    set({ soundEnabled: newVal });
  },

  vibrationEnabled: loadState<boolean>('vibrationEnabled', true),
  toggleVibration: () => {
    const newVal = !get().vibrationEnabled;
    saveState('vibrationEnabled', newVal);
    set({ vibrationEnabled: newVal });
  },
}));
