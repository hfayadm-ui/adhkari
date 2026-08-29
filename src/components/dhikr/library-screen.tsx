'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import { dhikrCategories, getAdhkarByCategory, prayerDhikrGroups } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Search, ChevronLeft, CheckCircle2, BookOpen, Star } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)', 'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)', 'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)', 'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function LibraryScreen() {
  const { setCurrentScreen, setSelectedCategoryId, setReadingSource, setSelectedPrayerIndex, completedPrayers, arabicFont } = useDhikrStore();
  const [search, setSearch] = useState('');
  const fontVar = getFontClass(arabicFont);

  const getCategoryCount = (id: string) => {
    if (id === 'prayer') return prayerDhikrGroups.reduce((a, g) => a + g.dhikrList.length, 0);
    return getAdhkarByCategory(id).length;
  };

  const getCategoryDone = (id: string) => {
    if (id === 'prayer') return completedPrayers.length;
    return 0;
  };

  const filtered = search
    ? dhikrCategories.filter(c => {
        const adhkar = c.id === 'prayer' ? prayerDhikrGroups.flatMap(g => g.dhikrList) : getAdhkarByCategory(c.id);
        return c.name.includes(search) || adhkar.some(d => d.text.includes(search));
      })
    : dhikrCategories;

  const openCategory = (id: string) => {
    if (id === 'prayer') {
      setSelectedPrayerIndex(0);
      setReadingSource('prayer');
      setCurrentScreen('reading');
    } else {
      setSelectedCategoryId(id);
      setReadingSource('category');
      setCurrentScreen('reading');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-3'>
        <div className='flex items-center gap-2.5 mb-3'>
          <IslamicIcon name='book' className='w-7 h-7' color='var(--gold-accent)' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>مكتبة الأذكار</h1>
        </div>
        <div className='relative'>
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 app-text-muted' />
          <input
            type='text' value={search} onChange={e => setSearch(e.target.value)}
            placeholder='ابحث في الأذكار...'
            className='w-full pr-10 pl-4 py-3 rounded-xl glass-card app-text text-sm placeholder:app-text-muted focus:outline-none focus:border-amber-500/30 transition-colors'
            style={{ fontFamily: fontVar }}
          />
        </div>
      </header>

      <main className='flex-1 px-4 space-y-3'>
        {filtered.map((cat, i) => {
          const count = getCategoryCount(cat.id);
          const done = getCategoryDone(cat.id);
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openCategory(cat.id)}
              className='w-full glass-card rounded-2xl p-4 flex items-center gap-4 app-surface-h transition-colors text-right'
            >
              <div className='w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
                <IslamicIcon name={cat.icon} className='w-6 h-6' color='var(--gold-accent)' />
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='app-text font-bold text-sm mb-0.5' style={{ fontFamily: fontVar }}>{cat.name}</h3>
                <p className='app-text-2 text-xs truncate' style={{ fontFamily: fontVar }}>{cat.description}</p>
                <div className='flex items-center gap-2 mt-1.5'>
                  <span className='text-[10px] app-text-muted'>{count} ذكر</span>
                  {done > 0 && <span className='text-[10px] text-emerald-400 flex items-center gap-0.5'><CheckCircle2 className='w-3 h-3' /> {done} مكتمل</span>}
                </div>
              </div>
              <ChevronLeft className='w-5 h-5 app-text-muted rotate-180 flex-shrink-0' />
            </motion.button>
          );
        })}

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className='glass-card rounded-2xl p-4'
        >
          <div className='flex items-center gap-2 mb-3'>
            <Star className='w-5 h-5' color='var(--gold-accent)' />
            <h3 className='app-text font-bold text-sm' style={{ fontFamily: fontVar }}>الأذكار المفضلة</h3>
          </div>
          <p className='app-text-2 text-xs' style={{ fontFamily: fontVar }}>قريباً.. يمكنك حفظ أذكارك المفضلة للوصول السريع</p>
          <div className='flex gap-2 mt-3 flex-wrap'>
            {['سبحان الله', 'الحمد لله', 'الله أكبر', 'أستغفر الله', 'لا إله إلا الله'].map(d => (
              <span key={d} className='px-2.5 py-1 rounded-full glass-card text-[10px] app-text-2' style={{ fontFamily: fontVar }}>{d}</span>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}