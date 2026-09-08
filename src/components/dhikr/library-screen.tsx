'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { dhikrCategories, getAdhkarByCategory, prayerDhikrGroups } from '@/lib/dhikr-data';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Search, ChevronLeft, CheckCircle2, BookOpen, Star, X, Plus } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';
import { getFontClass } from '@/lib/font-utils';

export default function LibraryScreen() {
  const { setCurrentScreen, setSelectedCategoryId, setReadingSource, setSelectedPrayerIndex, completedPrayers, arabicFont,
    customDhikr, addCustomDhikr, removeCustomDhikr, setCurrentDhikrIndex, setSelectedCustomDhikrId } = useDhikrStore();
  const [search, setSearch] = useState('');
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customCount, setCustomCount] = useState(33);
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
        {/* Custom Dhikr Category Card */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCustomPanel(!showCustomPanel)}
          className='w-full glass-card rounded-2xl p-4 flex items-center gap-4 app-surface-h transition-colors text-right'
          style={{ border: showCustomPanel ? '1px solid var(--gold-border)' : undefined }}
        >
          <div className='w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <IslamicIcon name='sparkles' className='w-6 h-6' color='var(--gold-accent)' />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='app-text font-bold text-sm mb-0.5' style={{ fontFamily: fontVar }}>أذكار مخصصة</h3>
            <p className='app-text-2 text-xs truncate' style={{ fontFamily: fontVar }}>أذكار تضيفها بنفسك</p>
            <div className='flex items-center gap-2 mt-1.5'>
              <span className='text-[10px] app-text-muted'>{customDhikr.length} ذكر</span>
            </div>
          </div>
          <motion.div animate={{ rotate: showCustomPanel ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className='w-5 h-5 app-text-muted rotate-180 flex-shrink-0' />
          </motion.div>
        </motion.button>

        {/* Custom Dhikr Panel */}
        <AnimatePresence>
          {showCustomPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              <div className='glass-card-elevated rounded-2xl overflow-hidden' style={{ border: '1px solid var(--gold-border)' }}>
                {/* Header */}
                <div className='px-4 pt-4 pb-2 flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-lg flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}>
                    <Plus className='w-4 h-4' color='var(--gold-accent)' />
                  </div>
                  <h4 className='app-text font-bold text-sm' style={{ fontFamily: fontVar }}>إضافة ذكر جديد</h4>
                </div>

                {/* Dhikr text input */}
                <div className='px-4 pb-3'>
                  <div className='relative'>
                    <textarea
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      placeholder='اكتب الذكر هنا...'
                      rows={2}
                      className='w-full px-4 py-3 rounded-xl app-surface app-text text-sm placeholder:app-text-muted focus:outline-none transition-colors resize-none'
                      style={{ fontFamily: fontVar, border: '1.5px solid var(--gold-border)' }}
                    />
                    {customText.length > 0 && (
                      <button
                        onClick={() => setCustomText('')}
                        className='absolute top-2.5 left-2.5 w-6 h-6 rounded-full flex items-center justify-center app-surface-h transition-colors'
                      >
                        <X className='w-3.5 h-3.5 app-text-muted' />
                      </button>
                    )}
                  </div>
                </div>

                {/* Count section */}
                <div className='px-4 pb-3'>
                  <label className='app-text-2 text-[11px] mb-2 block' style={{ fontFamily: fontVar }}>عدد التكرار</label>
                  <div className='flex items-center gap-2'>
                    <div className='flex-1 flex items-center gap-1'>
                      {[10, 33, 34, 100].map(n => (
                        <button
                          key={n}
                          onClick={() => setCustomCount(n)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${customCount === n ? '' : 'app-surface app-text-2 app-surface-h'}`}
                          style={customCount === n
                            ? { background: 'var(--gold-glow)', border: '1.5px solid var(--gold-border)', color: 'var(--gold-bright)' }
                            : { border: '1px solid transparent' }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className='relative w-20 flex-shrink-0'>
                      <input
                        type='number'
                        value={customCount === 10 || customCount === 33 || customCount === 34 || customCount === 100 ? '' : customCount}
                        onChange={e => {
                          const v = parseInt(e.target.value);
                          if (v > 0) setCustomCount(v);
                        }}
                        placeholder='مخصص'
                        min={1}
                        className='w-full px-3 py-2 rounded-lg app-surface app-text text-xs text-center focus:outline-none transition-colors'
                        style={{ fontFamily: fontVar, border: '1.5px solid var(--gold-border)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add button */}
                <div className='px-4 pb-4'>
                  <button
                    onClick={() => {
                      if (customText.trim()) {
                        addCustomDhikr(customText.trim(), customCount);
                        setCustomText('');
                        setCustomCount(33);
                      }
                    }}
                    disabled={!customText.trim()}
                    className='w-full btn-gold py-3 rounded-xl app-text font-bold text-sm disabled:opacity-30 transition-all flex items-center justify-center gap-2'
                    style={{ fontFamily: fontVar }}
                  >
                    <Plus className='w-4 h-4' />
                    إضافة الذكر
                  </button>
                </div>

                {/* Divider */}
                {customDhikr.length > 0 && (
                  <div className='mx-4 h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />
                )}

                {/* Existing Custom Dhikr List */}
                {customDhikr.length > 0 && (
                  <div className='px-4 pb-4 space-y-2 max-h-80 overflow-y-auto'>
                    <h4 className='app-text-2 text-xs font-medium pt-3 pb-1' style={{ fontFamily: fontVar }}>الأذكار المضافة ({customDhikr.length})</h4>
                    {customDhikr.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex items-center gap-3 p-3 rounded-xl app-surface transition-colors'
                        style={{ border: '1px solid var(--gold-border)' }}
                      >
                        <button
                          onClick={() => {
                            setSelectedCustomDhikrId(item.id);
                            setReadingSource('custom');
                            setCurrentDhikrIndex(0);
                            setCurrentScreen('reading');
                          }}
                          className='flex-1 text-right'
                        >
                          <p className='app-text text-sm font-medium leading-relaxed' style={{ fontFamily: fontVar }}>{item.text}</p>
                          <div className='flex items-center gap-2 mt-1'>
                            <span className='text-[10px] px-2 py-0.5 rounded-full' style={{ background: 'var(--gold-glow)', color: 'var(--gold-bright)' }}>{item.count} مرة</span>
                          </div>
                        </button>
                        <button
                          onClick={() => removeCustomDhikr(item.id)}
                          className='w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 hover:bg-red-500/10'
                          style={{ border: '1px solid var(--gold-border)' }}
                        >
                          <X className='w-4 h-4' style={{ color: '#ef4444' }} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.map((cat, i) => {
          const count = getCategoryCount(cat.id);
          const done = getCategoryDone(cat.id);
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.05 }}
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
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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