// أذكار ما بعد الصلوات الخمس
export interface Dhikr {
  id: string;
  text: string;
  count: number;
  category: string;
}

export interface PrayerDhikrGroup {
  prayerId: string;
  prayerName: string;
  openingMessage: string;
  dhikrList: Dhikr[];
  closingMessage: string;
}

export const motivationalQuotes: string[] = [
  "ما أعظمك من ربٍّ يرضى عنك بكلمات بسيطة!",
  "حصّن نفسك، الملائكة تكتب لك الآن",
  "استغفر الله العظيم وتب إليه.. باب التوبة مفتوح",
  "كل ذكر تقرؤه يطفئ عنك خطيئة كما يطفئ الماء النار",
  "ما من كلمات أحب إلى الله من ذكره",
  "ألا بذكر الله تطمئن القلوب",
  "إنما المؤمنون الذين إذا ذُكر الله وجلت قلوبهم",
  "سبحان من جعل الذكر عبادة وسعادة",
];

export const dhikrGroups: PrayerDhikrGroup[] = [
  {
    prayerId: "fajr",
    prayerName: "أذكار صلاة الفجر",
    openingMessage: "بسم الله، ابدأ يومك بالذكر.. راحة قلبك وسكينة روحك 🌅",
    dhikrList: [
      { id: "f1", text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ", count: 3, category: "استغفار" },
      { id: "f2", text: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", count: 1, category: "تسليم" },
      { id: "f3", text: "سُبْحَانَ اللَّهِ", count: 33, category: "تسبيح" },
      { id: "f4", text: "الْحَمْدُ لِلَّهِ", count: 33, category: "تحميد" },
      { id: "f5", text: "اللَّهُ أَكْبَرُ", count: 33, category: "تكبير" },
      { id: "f6", text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
      { id: "f7", text: "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ", count: 1, category: "حوقلة" },
    ],
    closingMessage: "تقبل الله صلاتك وصلواتك.. استمتع بيومك وأنت في حفظ الله 🤍",
  },
  {
    prayerId: "dhuhr",
    prayerName: "أذكار صلاة الظهر",
    openingMessage: "بسم الله، ابدأ وقت راحتك بالذكر.. فالذكر راحة القلوب 🌤️",
    dhikrList: [
      { id: "d1", text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ", count: 3, category: "استغفار" },
      { id: "d2", text: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", count: 1, category: "تسليم" },
      { id: "d3", text: "سُبْحَانَ اللَّهِ", count: 33, category: "تسبيح" },
      { id: "d4", text: "الْحَمْدُ لِلَّهِ", count: 33, category: "تحميد" },
      { id: "d5", text: "اللَّهُ أَكْبَرُ", count: 33, category: "تكبير" },
      { id: "d6", text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
    ],
    closingMessage: "بارك الله في وقتك.. أنت في حفظ الله ورعايته 🤍",
  },
  {
    prayerId: "asr",
    prayerName: "أذكار صلاة العصر",
    openingMessage: "بسم الله، أذكار العصر.. نور في طريقك إلى المغرب 🌿",
    dhikrList: [
      { id: "a1", text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ", count: 3, category: "استغفار" },
      { id: "a2", text: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", count: 1, category: "تسليم" },
      { id: "a3", text: "سُبْحَانَ اللَّهِ", count: 33, category: "تسبيح" },
      { id: "a4", text: "الْحَمْدُ لِلَّهِ", count: 33, category: "تحميد" },
      { id: "a5", text: "اللَّهُ أَكْبَرُ", count: 33, category: "تكبير" },
      { id: "a6", text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
    ],
    closingMessage: "ما أجمل أن يكون قلبك مليئاً بالذكر.. تابع مسيرتك في نور الله 🤍",
  },
  {
    prayerId: "maghrib",
    prayerName: "أذكار صلاة المغرب",
    openingMessage: "بسم الله، أذكار المغرب.. سكينة بعد يوم حافل 🌙",
    dhikrList: [
      { id: "m1", text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ", count: 3, category: "استغفار" },
      { id: "m2", text: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", count: 1, category: "تسليم" },
      { id: "m3", text: "سُبْحَانَ اللَّهِ", count: 33, category: "تسبيح" },
      { id: "m4", text: "الْحَمْدُ لِلَّهِ", count: 33, category: "تحميد" },
      { id: "m5", text: "اللَّهُ أَكْبَرُ", count: 33, category: "تكبير" },
      { id: "m6", text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
    ],
    closingMessage: "تقبل الله طاعتك.. أمسيت وأنت في حفظ الله ورعايته 🤍",
  },
  {
    prayerId: "isha",
    prayerName: "أذكار صلاة العشاء",
    openingMessage: "بسم الله، أذكار العشاء.. قبل النوم املأ قلبك بالذكر ✨",
    dhikrList: [
      { id: "i1", text: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ", count: 3, category: "استغفار" },
      { id: "i2", text: "اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ", count: 1, category: "تسليم" },
      { id: "i3", text: "سُبْحَانَ اللَّهِ", count: 33, category: "تسبيح" },
      { id: "i4", text: "الْحَمْدُ لِلَّهِ", count: 33, category: "تحميد" },
      { id: "i5", text: "اللَّهُ أَكْبَرُ", count: 33, category: "تكبير" },
      { id: "i6", text: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, category: "توحيد" },
      { id: "i7", text: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3, category: "تعوذ" },
    ],
    closingMessage: "تقبل الله طاعتك، نم وأنت في حفظ الله.. الصباح قريب بإذن الله 🤍",
  },
];

// Get the current prayer group based on time of day
export function getCurrentPrayerGroup(): PrayerDhikrGroup {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 10) return dhikrGroups[0]; // Fajr
  if (hour >= 10 && hour < 15) return dhikrGroups[1]; // Dhuhr
  if (hour >= 15 && hour < 18) return dhikrGroups[2]; // Asr
  if (hour >= 18 && hour < 20) return dhikrGroups[3]; // Maghrib
  return dhikrGroups[4]; // Isha
}

export const prayerTimesList = [
  { id: "fajr", name: "الفجر", icon: "🌅", time: "04:30" },
  { id: "dhuhr", name: "الظهر", icon: "☀️", time: "12:00" },
  { id: "asr", name: "العصر", icon: "🌤️", time: "15:30" },
  { id: "maghrib", name: "المغرب", icon: "🌙", time: "18:45" },
  { id: "isha", name: "العشاء", icon: "✨", time: "20:15" },
];
