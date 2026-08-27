import { create } from 'zustand';

export type Screen = 'home' | 'reading' | 'completion' | 'stats' | 'settings' | 'library' | 'counter' | 'category-reading';
export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';

interface DailyRecord {
  date: string;
  prayersCompleted: string[];
  totalDhikr: number;
  freeCount: number;
}

interface CounterPreset {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface DhikrState {
  // Navigation
  currentScreen: Screen;
  previousScreen: Screen | null;
  setCurrentScreen: (screen: Screen) => void;
  goBack: () => void;

  // Reading state
  selectedPrayerIndex: number;
  setSelectedPrayerIndex: (index: number) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  readingSource: 'prayer' | 'category';
  setReadingSource: (s: 'prayer' | 'category') => void;
  currentDhikrIndex: number;
  setCurrentDhikrIndex: (index: number) => void;
  currentCount: number;
  setCurrentCount: (count: number) => void;
  completedSet: number[];
  setCompletedSet: (s: number[]) => void;

  // Daily tracking
  completedPrayers: string[];
  completePrayer: (prayerId: string) => void;
  todayStr: string;

  // Streak & gamification
  streak: number;
  streakFreezeAvailable: boolean;
  setStreak: (streak: number) => void;
  useStreakFreeze: () => void;
  treeLevel: number;
  setTreeLevel: (level: number) => void;
  totalAllTime: number;
  setTotalAllTime: (n: number) => void;
  weeklyData: DailyRecord[];
  addTodayRecord: () => void;

  // Free counter
  freeCounter: number;
  setFreeCounter: (n: number) => void;
  incrementFreeCounter: () => void;
  resetFreeCounter: () => void;
  counterPresets: CounterPreset[];
  updatePreset: (id: string, current: number) => void;

  // Settings
  soundEnabled: boolean;
  toggleSound: () => void;
  vibrationEnabled: boolean;
  toggleVibration: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (s: 'small' | 'medium' | 'large') => void;
  themeColor: ThemeColor;
  setThemeColor: (c: ThemeColor) => void;
  calculationMethod: string;
  setCalculationMethod: (m: string) => void;
}

function load<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key: string, v: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* */ }
}

const today = new Date().toDateString();

export const useDhikrStore = create<DhikrState>((set, get) => ({
  currentScreen: 'home',
  previousScreen: null,
  setCurrentScreen: (screen) => {
    const prev = get().currentScreen;
    set({ currentScreen: screen, previousScreen: prev !== screen ? prev : get().previousScreen });
  },
  goBack: () => {
    const prev = get().previousScreen || 'home';
    set({ currentScreen: prev, previousScreen: 'home' });
  },

  selectedPrayerIndex: 0,
  setSelectedPrayerIndex: (index) => set({ selectedPrayerIndex: index, currentDhikrIndex: 0, currentCount: 0, completedSet: [] }),
  selectedCategoryId: 'morning',
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id, currentDhikrIndex: 0, currentCount: 0, completedSet: [] }),
  readingSource: 'prayer',
  setReadingSource: (s) => set({ readingSource: s, currentDhikrIndex: 0, currentCount: 0, completedSet: [] }),
  currentDhikrIndex: 0,
  setCurrentDhikrIndex: (index) => set({ currentDhikrIndex: index, currentCount: 0 }),
  currentCount: 0,
  setCurrentCount: (count) => set({ currentCount: count }),
  completedSet: [],
  setCompletedSet: (s) => set({ completedSet: s }),

  completedPrayers: load<string[]>('dz_completedPrayers', []),
  completePrayer: (prayerId) => {
    const state = get();
    if (!state.completedPrayers.includes(prayerId)) {
      const completed = [...state.completedPrayers, prayerId];
      save('dz_completedPrayers', completed);
      set({ completedPrayers: completed });
    }
  },
  todayStr: today,

  streak: load<number>('dz_streak', 0),
  streakFreezeAvailable: load<boolean>('dz_freezeAvail', true),
  setStreak: (streak) => { save('dz_streak', streak); set({ streak }); },
  useStreakFreeze: () => {
    if (get().streakFreezeAvailable) {
      set({ streakFreezeAvailable: false });
      save('dz_freezeAvail', false);
    }
  },
  treeLevel: load<number>('dz_treeLevel', 0),
  setTreeLevel: (level) => { save('dz_treeLevel', level); set({ treeLevel: level }); },
  totalAllTime: load<number>('dz_totalAll', 0),
  setTotalAllTime: (n) => { save('dz_totalAll', n); set({ totalAllTime: n }); },
  weeklyData: load<DailyRecord[]>('dz_weekly', []),
  addTodayRecord: () => {
    const state = get();
    const rec: DailyRecord = {
      date: new Date().toDateString(),
      prayersCompleted: state.completedPrayers,
      totalDhikr: state.totalAllTime,
      freeCount: state.freeCounter,
    };
    const week = [...state.weeklyData.slice(-6), rec];
    save('dz_weekly', week);
    set({ weeklyData: week });
  },

  freeCounter: load<number>('dz_freeCounter', 0),
  setFreeCounter: (n) => { save('dz_freeCounter', n); set({ freeCounter: n }); },
  incrementFreeCounter: () => {
    const n = get().freeCounter + 1;
    save('dz_freeCounter', n);
    set({ freeCounter: n });
  },
  resetFreeCounter: () => { save('dz_freeCounter', 0); set({ freeCounter: 0 }); },
  counterPresets: load<CounterPreset[]>('dz_presets', [
    { id: 'subhanallah', name: 'سبحان الله', target: 33, current: 0 },
    { id: 'alhamdulillah', name: 'الحمد لله', target: 33, current: 0 },
    { id: 'allahuakbar', name: 'الله أكبر', target: 34, current: 0 },
    { id: 'hawqala', name: 'لا حول ولا قوة إلا بالله', target: 100, current: 0 },
    { id: 'salawat', name: 'اللهم صلِّ على محمد', target: 100, current: 0 },
    { id: 'istighfar', name: 'أستغفر الله', target: 100, current: 0 },
  ]),
  updatePreset: (id, current) => {
    const presets = get().counterPresets.map(p => p.id === id ? { ...p, current } : p);
    save('dz_presets', presets);
    set({ counterPresets: presets });
  },

  soundEnabled: load<boolean>('dz_sound', true),
  toggleSound: () => { const v = !get().soundEnabled; save('dz_sound', v); set({ soundEnabled: v }); },
  vibrationEnabled: load<boolean>('dz_vibration', true),
  toggleVibration: () => { const v = !get().vibrationEnabled; save('dz_vibration', v); set({ vibrationEnabled: v }); },
  fontSize: load<'small' | 'medium' | 'large'>('dz_fontSize', 'medium'),
  setFontSize: (s) => { save('dz_fontSize', s); set({ fontSize: s }); },
  themeColor: load<ThemeColor>('dz_theme', 'emerald'),
  setThemeColor: (c) => { save('dz_theme', c); set({ themeColor: c }); },
  calculationMethod: load<string>('dz_calcMethod', 'أم القرى'),
  setCalculationMethod: (m) => { save('dz_calcMethod', m); set({ calculationMethod: m }); },
}));
