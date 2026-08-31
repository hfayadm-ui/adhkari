'use client';

import { useDhikrStore } from '@/lib/store';

const NOTIF_COOLDOWN = 30 * 60 * 1000; // 30 minutes

const notificationMessages = {
  streakWarning: (streak: number) => ({
    title: 'سلسلتك في خطر!',
    body: `لم تُكمل أذكار اليوم بعد! سلسلتك الحالية ${streak} يوم. لا تخسرها!`,
    icon: 'flame',
    urgency: 'high' as const,
  }),
  morningReminder: {
    title: 'حان وقت أذكار الصباح',
    body: 'ابدأ يومك بذكر الله. أذكار الصباح حصنك اليوم.',
    icon: 'sunrise',
    urgency: 'medium' as const,
  },
  eveningReminder: {
    title: 'حان وقت أذكار المساء',
    body: 'اختم يومك بالأذكار. حصن نفسك قبل النوم.',
    icon: 'sunset',
    urgency: 'medium' as const,
  },
  streakMilestone: (days: number) => {
    const messages: Record<number, string> = {
      3: '3 أيام متتالية! بداية رائعة',
      7: 'أسبوع كامل! ما شاء الله',
      14: 'أسبوعين! أنت ملتزم جدًا',
      21: '3 أسابيع! حديقتك تزدهر',
      30: 'شهر كامل! هذا إنجاز كبير',
      50: '50 يوم! أنت من المتميزين',
      100: '100 يوم! مستوى الخلود',
    };
    return {
      title: `إنجاز: ${days} يوم!`,
      body: messages[days] || `${days} يوم متتالي! استمر يا بطل`,
      icon: 'trophy',
      urgency: 'high' as const,
    };
  },
  motivational: {
    texts: [
      'هل تعلم؟ ذكر الله يملأ الميزان',
      'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان',
      'سبحان الله وبحمده، عدد خلقه ورضا نفسه',
      'لا إله إلا الله وحده لا شريك له',
      'أستغفر الله العظيم وأتوب إليه',
    ],
    icon: 'sparkles',
  },
  gardenReward: (plantType: string) => ({
    title: 'نبتة جديدة في حديقتك!',
    body: `حصلت على ${plantType} جديدة. استمر للحصول على المزيد!`,
    icon: 'flower2',
    urgency: 'high' as const,
  }),
};

// Get current hour in user's timezone
function getCurrentHour(): number {
  return new Date().getHours();
}

// Determine which plant type to award based on streak
function getPlantForStreak(streak: number): 'seed' | 'sprout' | 'flower' | 'tree' | 'palm' | 'rose' | 'jasmine' | 'lotus' {
  if (streak >= 21) return 'palm';
  if (streak >= 14) return 'tree';
  if (streak >= 10) return 'lotus';
  if (streak >= 7) return 'jasmine';
  if (streak >= 5) return 'rose';
  if (streak >= 3) return 'flower';
  if (streak >= 1) return 'sprout';
  return 'seed';
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Send a browser notification
function sendBrowserNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      tag, // prevents duplicate notifications
      icon: '/icon-192.png',
      dir: 'rtl',
      lang: 'ar',
    });
  } catch { /* notification not supported in this context */ }
}

// Module-level interval (not a hook — safe to call from anywhere)
let _notifInterval: ReturnType<typeof setInterval> | null = null;
let _lastCheckedDate = '';

export function initSmartNotifications() {
  // Prevent multiple intervals
  if (_notifInterval) return;

  const checkAndNotify = () => {
    const store = useDhikrStore.getState();
    const now = Date.now();
    const hour = getCurrentHour();
    const today = new Date().toDateString();

    if (_lastCheckedDate !== today) {
      _lastCheckedDate = today;
    }

    if (!store.notificationsEnabled) return;

    const lastNotif = store.lastNotifTime;

    // Morning reminder (5:00-9:00 AM)
    if (hour >= 5 && hour < 9 && !store.morningDone) {
      const lastTime = lastNotif['morning'] || 0;
      if (now - lastTime > NOTIF_COOLDOWN) {
        sendBrowserNotification(
          notificationMessages.morningReminder.title,
          notificationMessages.morningReminder.body,
          'morning-reminder'
        );
        store.markNotifSent('morning');
      }
    }

    // Evening reminder (4:00-8:00 PM)
    if (hour >= 16 && hour < 20 && !store.eveningDone) {
      const lastTime = lastNotif['evening'] || 0;
      if (now - lastTime > NOTIF_COOLDOWN) {
        sendBrowserNotification(
          notificationMessages.eveningReminder.title,
          notificationMessages.eveningReminder.body,
          'evening-reminder'
        );
        store.markNotifSent('evening');
      }
    }

    // Streak warning (after 8 PM if no activity today)
    if (hour >= 20 && store.streak > 0 && store.freeCounter === 0 && store.completedPrayers.length === 0) {
      const lastTime = lastNotif['streakWarning'] || 0;
      if (now - lastTime > NOTIF_COOLDOWN * 2) {
        const msg = notificationMessages.streakWarning(store.streak);
        sendBrowserNotification(msg.title, msg.body, 'streak-warning');
        store.markNotifSent('streakWarning');
      }
    }
  };

  checkAndNotify();
  _notifInterval = setInterval(checkAndNotify, 5 * 60 * 1000);
}

// Called when user completes a session to handle rewards
export function handleSessionComplete(totalDhikrThisSession: number = 0) {
  const store = useDhikrStore.getState();
  const today = new Date().toDateString();
  const now = Date.now();

  // Record streak day
  const existingDay = store.streakDays.find(s => s.date === today);
  let updatedDays: { date: string; count: number }[];

  if (existingDay) {
    updatedDays = store.streakDays.map(s => s.date === today ? { ...s, count: s.count + totalDhikrThisSession } : s);
  } else {
    updatedDays = [...store.streakDays.slice(-30), { date: today, count: totalDhikrThisSession }];
    if (updatedDays.length > 30) updatedDays = updatedDays.slice(-30);
  }
  save('dz_streakDays', updatedDays);

  // Check if this is first activity today → award plant
  const isFirstToday = !existingDay;
  if (isFirstToday) {
    const plantType = getPlantForStreak(store.streak);
    store.addGardenPlant(plantType);

    // Send garden reward notification
    if (store.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const plantNames: Record<string, string> = {
        seed: 'بذرة', sprout: 'نبتة', flower: 'زهرة', tree: 'شجرة',
        palm: 'نخلة', rose: 'وردة', jasmine: 'ياسمين', lotus: 'زهر اللوتس',
      };
      const msg = notificationMessages.gardenReward(plantNames[plantType] || plantType);
      sendBrowserNotification(msg.title, msg.body, 'garden-reward');
    }

    // Streak milestone notifications
    const milestones = [3, 7, 14, 21, 30, 50, 100];
    if (milestones.includes(store.streak)) {
      const msg = notificationMessages.streakMilestone(store.streak);
      sendBrowserNotification(msg.title, msg.body, `milestone-${store.streak}`);
    }
  }

  // Track last active date
  save('dz_lastActive', today);

  // Check if morning/evening done based on hour
  const hour = getCurrentHour();
  if (hour >= 5 && hour < 16) {
    store.setMorningDone();
  } else if (hour >= 16) {
    store.setEveningDone();
  }
}

// Check streak on app open and handle breaks
export function checkStreakOnOpen() {
  const store = useDhikrStore.getState();
  const today = new Date().toDateString();
  const lastActive = store.lastActiveDate;

  if (!lastActive) return; // First time user

  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);

  if (diffDays === 1) {
    // Consecutive day — streak should already be incremented by completion screen
  }
 else if (diffDays >= 2) {
    // Streak broken
    if (store.streakFreezesLeft > 0) {
      // Use a freeze automatically
      store.useStreakFreeze();
    } else {
      // Reset streak
      store.setStreak(0);
    }
  }
  // diffDays === 0 → same day, do nothing
}

// Local save helper (separate from store to avoid circular dep)
function save(key: string, v: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* */ }
}