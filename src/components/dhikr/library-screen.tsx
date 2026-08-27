'use client';

import { motion } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrCategories, getAdhkarByCategory, prayerDhikrGroups, morningAdhkar, eveningAdhkar, sleepAdhkar, eatingAdhkar, miscAdhkar } from '@/lib/dhikr-data';
import { useState } from 'react';
import { Search, ChevronLeft, CheckCircle2, BookOpen } from 'lucide-react';

export default function LibraryScreen() {
  const { setCurrentScreen, setSelectedCategoryId, setReadingSource, setSelectedPrayerIndex, completedPrayers, themeColor } = useDhikrStore();
  const [search, setSearch] = useState('');

  const colorBorder: Record<string, string> = { emerald: 'border-emerald-500/20', blue: 'border-blue-500/20', purple: 'border-purple-500/20', amber: 'border-amber-500/20', rose: 'border-rose-500/20' };

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
        const adhkar = id === 'prayer' ? prayerDhikrGroups.flatMap(g => g.dhikrList) : getAdhkarByCategory(id);
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
        <h1 className='text-2xl font-bold text-white mb-3' style={{ fontFamily: 'var(--font-arabic)' }}>📖 مكتبة الأذكار</h1>
        {/* Search */}
        <div className='relative'>
          <Search className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
          <input
            type='text' value={search} onChange={e => setSearch(e.target.value)}
            placeholder='ابحث في الأذكار...'
            className='w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 transition-colors'
            style={{ fontFamily: 'var(--font-arabic)' }}
          />\n        </div>
      </header>

      <main className='flex-1 px-4 space-y-3'>
        {filtered.map((cat, i) => {
          const count = getCategoryCount(cat.id);
          const done = getCategoryDone(cat.id);
          const cBorder = colorBorder[themeColor] || colorBorder.emerald;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openCategory(cat.id)}
              className={`w-full rounded-2xl bg-white/5 border ${cBorder} p-4 flex items-center gap-4 hover:bg-white/10 transition-colors text-right`}
            >
              <div className='w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0'>
                {cat.icon}
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='text-white font-bold text-sm mb-0.5' style={{ fontFamily: 'var(--font-arabic)' }}>{cat.name}</h3>
                <p className='text-slate-400 text-xs truncate'>{cat.description}</p>
                <div className='flex items-center gap-2 mt-1.5'>
                  <span className='text-[10px] text-slate-500'>{count} ذكر</span>
                  {done > 0 && <span className='text-[10px] text-emerald-400 flex items-center gap-0.5'><CheckCircle2 className='w-3 h-3' /> {done} مكتمل</span>}
                </div>
              </div>
              <ChevronLeft className='w-5 h-5 text-slate-500 rotate-180 flex-shrink-0' />
            </motion.button>
          );
        })}

        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className='rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-700/15 p-4'
        >
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-lg'>⭐</span>
            <h3 className='text-amber-200 font-bold text-sm' style={{ fontFamily: 'var(--font-arabic)' }}>الأذكار المفضلة</h3>
          </div>
          <p className='text-slate-400 text-xs'>قريباً.. يمكنك حفظ أذكارك المفضلة للوصول السريع</p>
          <div className='flex gap-2 mt-3'>
            {['سبحان الله', 'الحمد لله', 'الله أكبر', 'أستغفر الله', 'لا إله إلا الله'].map(d => (
              <span key={d} className='px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300' style={{ fontFamily: 'var(--font-arabic)' }}>{d}</span>
            ))}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}