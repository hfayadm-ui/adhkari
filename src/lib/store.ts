import { create } from 'zustand';

export type Screen = 'home' | 'reading' | 'completion' | 'stats' | 'settings' | 'library' | 'counter' | 'relaxation' | 'challenges' | 'garden';
export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
export type AppMode = 'dark' | 'light';
export type ArabicFont = 'cairo' | 'amiri' | 'noto-naskh' | 'tajawal' | 'ibm-plex' | 'scheherazade';

interface DailyRecord {
  date: string;
  prayersCompleted: string[];
  dhikrCount: number; // actual dhikr done THAT DAY (not cumulative)
  freeCount: number;
  sessionsCount: number; // how many reading sessions completed
}

interface CounterPreset {
  id: string;
  name: string;
  target: number;
  current: number;
}

interface CustomDhikrItem {
  id: string;
  text: string;
  count: number;
  createdAt: string;
}

interface Challenge {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface GardenPlant {
  id: string;
  type: 'seed' | 'sprout' | 'flower' | 'tree' | 'palm' | 'rose' | 'jasmine' | 'lotus';
  dayEarned: number; // streak day when earned
  unlockedAt: string;
}

interface StreakDay {
  date: string;
  count: number; // dhikr count that day
}

interface SelectedCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
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
  readingSource: 'prayer' | 'category' | 'custom';
  setReadingSource: (s: 'prayer' | 'category' | 'custom') => void;
  selectedCustomDhikrId: string | null;
  setSelectedCustomDhikrId: (id: string | null) => void;
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
  resetDaily: () => void;

  // Streak & gamification
  streak: number;
  streakFreezeAvailable: boolean;
  streakFreezesLeft: number;
  lastActiveDate: string | null;
  streakDays: StreakDay[];
  setStreak: (streak: number) => void;
  useStreakFreeze: () => void;
  resetStreakFreezeWeekly: () => void;
  treeLevel: number;
  setTreeLevel: (level: number) => void;
  totalAllTime: number;
  setTotalAllTime: (n: number) => void;
  weeklyData: DailyRecord[];
  addTodayRecord: () => void;
  incrementTodayDhikr: (amount: number) => void;
  incrementTodaySessions: () => void;

  // Free counter
  freeCounter: number;
  setFreeCounter: (n: number) => void;
  incrementFreeCounter: () => void;
  resetFreeCounter: () => void;
  counterPresets: CounterPreset[];
  updatePreset: (id: string, current: number) => void;

  // Settings
  appMode: AppMode;
  setAppMode: (m: AppMode) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  vibrationEnabled: boolean;
  toggleVibration: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (s: 'small' | 'medium' | 'large') => void;
  themeColor: ThemeColor;
  setThemeColor: (c: ThemeColor) => void;
  arabicFont: ArabicFont;
  setArabicFont: (f: ArabicFont) => void;
  selectedCity: SelectedCity | null;
  setSelectedCity: (city: SelectedCity | null) => void;
  prayerTimes: {[key: string]: string};
  setPrayerTimes: (t: {[key: string]: string}) => void;

  // Custom Dhikr
  customDhikr: CustomDhikrItem[];
  addCustomDhikr: (text: string, count: number) => void;
  removeCustomDhikr: (id: string) => void;

  // Notifications
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  prayerNotifEnabled: boolean;
  togglePrayerNotif: () => void;

  // Counter Alert
  counterAlertEnabled: boolean;
  toggleCounterAlert: () => void;
  counterAlertInterval: number;
  setCounterAlertInterval: (n: number) => void;

  // Challenges
  challenges: Challenge[];
  addChallenge: (name: string, target: number, unit: string, days: number) => void;
  updateChallengeProgress: (id: string, amount: number) => void;
  removeChallenge: (id: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (dhikrText: string) => void;
  isFavorite: (dhikrText: string) => boolean;

  // Garden
  gardenPlants: GardenPlant[];
  gardenLevel: number;
  addGardenPlant: (type: GardenPlant['type']) => void;

  // Smart Notifications
  morningDone: boolean;
  eveningDone: boolean;
  setMorningDone: () => void;
  setEveningDone: () => void;
  lastNotifTime: Record<string, number>;
  markNotifSent: (key: string) => void;
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
  selectedCustomDhikrId: null,
  setSelectedCustomDhikrId: (id) => set({ selectedCustomDhikrId: id, currentDhikrIndex: 0, currentCount: 0, completedSet: [] }),
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
  resetDaily: () => {
    save('dz_completedPrayers', []);
    save('dz_freeCounter', 0);
    set({ completedPrayers: [], freeCounter: 0, currentCount: 0, completedSet: [], currentDhikrIndex: 0 });
  },

  streak: load<number>('dz_streak', 0),
  streakFreezeAvailable: load<boolean>('dz_freezeAvail', true),
  streakFreezesLeft: load<number>('dz_freezesLeft', 2),
  lastActiveDate: load<string | null>('dz_lastActive', null),
  streakDays: load<StreakDay[]>('dz_streakDays', []),
  setStreak: (streak) => { save('dz_streak', streak); set({ streak }); },
  useStreakFreeze: () => {
    const state = get();
    if (state.streakFreezesLeft > 0) {
      save('dz_freezesLeft', state.streakFreezesLeft - 1);
      set({ streakFreezesLeft: state.streakFreezesLeft - 1, streakFreezeAvailable: false });
    }
  },
  resetStreakFreezeWeekly: () => {
    save('dz_freezesLeft', 2);
    save('dz_freezeAvail', true);
    set({ streakFreezesLeft: 2, streakFreezeAvailable: true });
  },
  treeLevel: load<number>('dz_treeLevel', 0),
  setTreeLevel: (level) => { save('dz_treeLevel', level); set({ treeLevel: level }); },
  totalAllTime: load<number>('dz_totalAll', 0),
  setTotalAllTime: (n) => { save('dz_totalAll', n); set({ totalAllTime: n }); },
  weeklyData: load<DailyRecord[]>('dz_weekly', []),
  addTodayRecord: () => {
    const state = get();
    const today = new Date().toDateString();
    const existing = state.weeklyData.find(d => d.date === today);
    
    if (existing) {
      // Update today's record
      const updated = state.weeklyData.map(d => d.date === today ? {
        ...d,
        prayersCompleted: state.completedPrayers,
        freeCount: state.freeCounter,
      } : d);
      save('dz_weekly', updated);
      set({ weeklyData: updated });
    } else {
      // New day record — calculate today's dhikr from delta
      const prevDayTotal = state.weeklyData.length > 0
        ? state.weeklyData[state.weeklyData.length - 1].dhikrCount
        : 0;
      // We track daily count via the session completions
      const rec: DailyRecord = {
        date: today,
        prayersCompleted: state.completedPrayers,
        dhikrCount: 0, // will be incremented by handleSessionComplete
        freeCount: state.freeCounter,
        sessionsCount: 0,
      };
      const week = [...state.weeklyData.slice(-6), rec];
      save('dz_weekly', week);
      set({ weeklyData: week });
    }
  },
  incrementTodayDhikr: (amount: number) => {
    const state = get();
    const today = new Date().toDateString();
    const existing = state.weeklyData.find(d => d.date === today);
    if (existing) {
      const updated = state.weeklyData.map(d => d.date === today
        ? { ...d, dhikrCount: d.dhikrCount + amount }
        : d
      );
      save('dz_weekly', updated);
      set({ weeklyData: updated });
    } else {
      const rec: DailyRecord = {
        date: today, prayersCompleted: state.completedPrayers,
        dhikrCount: amount, freeCount: state.freeCounter, sessionsCount: 1,
      };
      const week = [...state.weeklyData.slice(-6), rec];
      save('dz_weekly', week);
      set({ weeklyData: week });
    }
  },
  incrementTodaySessions: () => {
    const state = get();
    const today = new Date().toDateString();
    const existing = state.weeklyData.find(d => d.date === today);
    if (existing) {
      const updated = state.weeklyData.map(d => d.date === today
        ? { ...d, sessionsCount: d.sessionsCount + 1 }
        : d
      );
      save('dz_weekly', updated);
      set({ weeklyData: updated });
    } else {
      const rec: DailyRecord = {
        date: today, prayersCompleted: state.completedPrayers,
        dhikrCount: 0, freeCount: state.freeCounter, sessionsCount: 1,
      };
      const week = [...state.weeklyData.slice(-6), rec];
      save('dz_weekly', week);
      set({ weeklyData: week });
    }
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

  appMode: load<AppMode>('dz_appMode', 'dark'),
  setAppMode: (m) => { save('dz_appMode', m); set({ appMode: m }); },
  soundEnabled: load<boolean>('dz_sound', true),
  toggleSound: () => { const v = !get().soundEnabled; save('dz_sound', v); set({ soundEnabled: v }); },
  vibrationEnabled: load<boolean>('dz_vibration', true),
  toggleVibration: () => { const v = !get().vibrationEnabled; save('dz_vibration', v); set({ vibrationEnabled: v }); },
  fontSize: load<'small' | 'medium' | 'large'>('dz_fontSize', 'medium'),
  setFontSize: (s) => { save('dz_fontSize', s); set({ fontSize: s }); },
  themeColor: load<ThemeColor>('dz_theme', 'emerald'),
  setThemeColor: (c) => { save('dz_theme', c); set({ themeColor: c }); },
  arabicFont: load<ArabicFont>('dz_arabicFont', 'cairo'),
  setArabicFont: (f) => { save('dz_arabicFont', f); set({ arabicFont: f }); },
  selectedCity: load<SelectedCity | null>('dz_selectedCity', null),
  setSelectedCity: (city) => { save('dz_selectedCity', city); set({ selectedCity: city }); },
  prayerTimes: load<{[key: string]: string}>('dz_prayerTimes', {}),
  setPrayerTimes: (t) => { save('dz_prayerTimes', t); set({ prayerTimes: t }); },

  // Custom Dhikr
  customDhikr: load<CustomDhikrItem[]>('dz_customDhikr', []),
  addCustomDhikr: (text, count) => {
    const item: CustomDhikrItem = { id: crypto.randomUUID(), text, count, createdAt: new Date().toISOString() };
    const list = [...get().customDhikr, item];
    save('dz_customDhikr', list);
    set({ customDhikr: list });
  },
  removeCustomDhikr: (id) => {
    const list = get().customDhikr.filter(d => d.id !== id);
    save('dz_customDhikr', list);
    set({ customDhikr: list });
  },

  // Notifications
  notificationsEnabled: load<boolean>('dz_notifEnabled', false),
  toggleNotifications: () => { const v = !get().notificationsEnabled; save('dz_notifEnabled', v); set({ notificationsEnabled: v }); },
  prayerNotifEnabled: load<boolean>('dz_prayerNotifEnabled', false),
  togglePrayerNotif: () => { const v = !get().prayerNotifEnabled; save('dz_prayerNotifEnabled', v); set({ prayerNotifEnabled: v }); },

  // Counter Alert
  counterAlertEnabled: load<boolean>('dz_counterAlert', false),
  toggleCounterAlert: () => { const v = !get().counterAlertEnabled; save('dz_counterAlert', v); set({ counterAlertEnabled: v }); },
  counterAlertInterval: load<number>('dz_counterAlertInterval', 33),
  setCounterAlertInterval: (n) => { save('dz_counterAlertInterval', n); set({ counterAlertInterval: n }); },

  // Challenges
  challenges: load<Challenge[]>('dz_challenges', []),
  addChallenge: (name, target, unit, days) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);
    const challenge: Challenge = { id: crypto.randomUUID(), name, target, current: 0, unit, startDate: now.toISOString(), endDate: end.toISOString(), completed: false };
    const list = [...get().challenges, challenge];
    save('dz_challenges', list);
    set({ challenges: list });
  },
  updateChallengeProgress: (id, amount) => {
    const list = get().challenges.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, current: c.current + amount };
      if (updated.current >= updated.target) updated.completed = true;
      return updated;
    });
    save('dz_challenges', list);
    set({ challenges: list });
  },
  removeChallenge: (id) => {
    const list = get().challenges.filter(c => c.id !== id);
    save('dz_challenges', list);
    set({ challenges: list });
  },

  // Favorites
  favorites: load<string[]>('dz_favorites', []),
  toggleFavorite: (dhikrText) => {
    const favs = get().favorites;
    const updated = favs.includes(dhikrText)
      ? favs.filter(f => f !== dhikrText)
      : [dhikrText, ...favs].slice(0, 100);
    save('dz_favorites', updated);
    set({ favorites: updated });
  },
  isFavorite: (dhikrText) => get().favorites.includes(dhikrText),

  // Garden
  gardenPlants: load<GardenPlant[]>('dz_gardenPlants', []),
  gardenLevel: load<number>('dz_gardenLevel', 0),
  addGardenPlant: (type) => {
    const state = get();
    const plant: GardenPlant = {
      id: crypto.randomUUID(),
      type,
      dayEarned: state.streak,
      unlockedAt: new Date().toISOString(),
    };
    const plants = [...state.gardenPlants, plant];
    const newLevel = Math.min(Math.floor(plants.length / 3) + 1, 10);
    save('dz_gardenPlants', plants);
    save('dz_gardenLevel', newLevel);
    set({ gardenPlants: plants, gardenLevel: newLevel });
  },

  // Smart Notifications
  morningDone: load<boolean>('dz_morningDone', false),
  eveningDone: load<boolean>('dz_eveningDone', false),
  setMorningDone: () => { save('dz_morningDone', true); set({ morningDone: true }); },
  setEveningDone: () => { save('dz_eveningDone', true); set({ eveningDone: true }); },
  lastNotifTime: load<Record<string, number>>('dz_lastNotif', {}),
  markNotifSent: (key) => {
    const times = { ...get().lastNotifTime, [key]: Date.now() };
    save('dz_lastNotif', times);
    set({ lastNotifTime: times });
  },
}));
