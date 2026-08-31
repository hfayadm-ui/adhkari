'use client';

import { motion } from 'framer-motion';
import { useDhikrStore, ArabicFont } from '@/lib/store';
import { getFontClass } from '@/lib/font-utils';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Volume2, VolumeX, Type, RotateCcw, MapPin, ChevronDown, Search, Check, Sun, Moon, Download, Upload, Bell } from '@/components/dhikr/islamic-icons';
import { countries, CityData, fetchPrayerTimes } from '@/lib/dhikr-data';
import { useState, useEffect, useMemo, useRef } from 'react';
import GoogleLogin from '@/components/auth/google-login';

const fontOptions: { id: ArabicFont; name: string; desc: string; fontVar: string }[] = [
  { id: 'cairo', name: 'القاهرة', desc: 'خط عصري واضح', fontVar: 'var(--font-arabic)' },
  { id: 'amiri', name: 'أميري', desc: 'خط كلاسيكي أنيق', fontVar: 'var(--font-amiri)' },
  { id: 'noto-naskh', name: 'نسخ عربي', desc: 'خط النسخ التقليدي', fontVar: 'var(--font-noto-naskh)' },
  { id: 'tajawal', name: 'تجوال', desc: 'خط حديث ومقروء', fontVar: 'var(--font-tajawal)' },
  { id: 'ibm-plex', name: 'IBM بليكس', desc: 'خط تقني متوازن', fontVar: 'var(--font-ibm-plex)' },
  { id: 'scheherazade', name: 'شهرزاد', desc: 'خط أدبي جميل', fontVar: 'var(--font-scheherazade)' },
];

function SettingRow({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className='glass-card rounded-2xl app-border-c p-4'>
      {children}
    </motion.div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${!value ? 'bg-slate-300 dark:bg-slate-700' : ''}`}
      style={value ? { background: 'linear-gradient(90deg, var(--gold-accent), var(--gold-bright))' } : undefined}>
      <motion.div className='absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md'
        animate={{ left: value ? 'calc(100% - 22px)' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  );
}

export default function SettingsScreen() {
  const {
    soundEnabled, toggleSound, vibrationEnabled, toggleVibration,
    arabicFont, setArabicFont,
    selectedCity, setSelectedCity, setPrayerTimes,
    streak, setStreak, treeLevel, setTreeLevel, resetDaily,
    appMode, setAppMode, selectedBackground, setSelectedBackground,
  } = useDhikrStore();
  const fontVar = getFontClass(arabicFont);

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = useMemo(() => {
    if (!citySearch) return countries;
    return countries.filter(c =>
      c.name.includes(citySearch) || c.cities.some(city => city.name.includes(citySearch))
    );
  }, [citySearch]);

  useEffect(() => {
    if (citySearch) setExpandedCountry(filteredCountries[0]?.code || null);
  }, [citySearch, filteredCountries]);

  const selectCity = async (city: CityData) => {
    setLoadingCity(true);
    setSelectedCity(city);
    try {
      const times = await fetchPrayerTimes(city);
      setPrayerTimes(times);
    } catch { /* */ }
    setLoadingCity(false);
    setShowCityPicker(false);
    setCitySearch('');
  };

  const handleExport = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dz_')) {
          data[key] = localStorage.getItem(key)!;
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adhkar-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* */ }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith('dz_')) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        }
        setImportMsg('تم استيراد البيانات بنجاح ✓');
        setTimeout(() => setImportMsg(null), 3000);
      } catch {
        setImportMsg('حدث خطأ أثناء الاستيراد');
        setTimeout(() => setImportMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      <header className='px-4 pt-4 pb-2'>
        <div className='flex items-center gap-2.5'>
          <IslamicIcon name='settings' className='w-7 h-7' color='var(--gold-accent)' />
          <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontVar }}>الإعدادات</h1>
        </div>
      </header>

      <main className='flex-1 px-4 pt-3 space-y-3'>
        {/* Google Login */}
        <div style={{ animationDelay: '0.05s' }}>
          <GoogleLogin fontVar={fontVar} />
        </div>

        {/* Mode Toggle */}
        <SettingRow delay={0.01}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}>
                {appMode === 'dark' ? <Moon className='w-4 h-4' color='var(--gold-accent)' /> : <Sun className='w-4 h-4' color='var(--gold-accent)' />}
              </div>
              <div>
                <p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>المظهر</p>
                <p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>{appMode === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}</p>
              </div>
            </div>
            <Toggle value={appMode === 'dark'} onChange={() => setAppMode(appMode === 'dark' ? 'light' : 'dark')} />
          </div>
        </SettingRow>

        {/* Arabic Font Selection */}
        <SettingRow delay={0.1}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}><Type className='w-4 h-4' color='var(--gold-accent)' /></div>
            <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>خط الأذكار</p><p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>اختر الخط العربي لعرض الأذكار</p></div>
          </div>
          <div className='space-y-2'>
            {fontOptions.map(f => (
              <button key={f.id} onClick={() => setArabicFont(f.id)}
                className={`w-full text-right rounded-xl p-3 transition-all border ${arabicFont === f.id ? '' : 'app-surface app-border-c app-surface-h'}`}
                style={arabicFont === f.id ? { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' } : undefined}>
                <div className='flex items-center justify-between'>
                  <div className='relative w-5 h-5 flex items-center justify-center'>
                    {arabicFont === f.id && <Check className='w-4 h-4' color='var(--gold-accent)' />}
                  </div>
                  <div className='text-right'>
                    <p className={`text-sm font-medium ${arabicFont === f.id ? 'app-text' : 'app-text-2'}`}>{f.name}</p>
                    <p className='text-[10px] app-text-2'>{f.desc}</p>
                  </div>
                </div>
                <p className='app-text-2 text-lg mt-1.5 leading-relaxed' style={{ fontFamily: f.fontVar }}>
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Sound */}
        <SettingRow delay={0.15}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl app-surface flex items-center justify-center'>
                {soundEnabled ? <Volume2 className='w-4 h-4' color='var(--gold-accent)' /> : <VolumeX className='w-4 h-4 app-text-muted' />}
              </div>
              <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الأصوات</p><p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>صوت خفيف عند الضغط</p></div>
            </div>
            <Toggle value={soundEnabled} onChange={toggleSound} />
          </div>
        </SettingRow>

        {/* Vibration */}
        <SettingRow delay={0.2}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl app-surface flex items-center justify-center'>
                <IslamicIcon name={vibrationEnabled ? 'sparkles' : 'x'} className='w-4 h-4' color={vibrationEnabled ? 'var(--gold-accent)' : undefined} />
              </div>
              <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الاهتزاز</p><p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>اهتزاز خفيف عند الضغط</p></div>
            </div>
            <Toggle value={vibrationEnabled} onChange={toggleVibration} />
          </div>
        </SettingRow>

        {/* Notifications */}
        <SettingRow delay={0.22}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}>
                <Bell className='w-4 h-4' color='var(--gold-accent)' />
              </div>
              <div>
                <p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الإشعارات</p>
                <p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>قريباً - ستتوفر في تحديث لاحق</p>
              </div>
            </div>
          </div>
        </SettingRow>

        {/* Background Selection */}
        <SettingRow delay={0.21}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}><IslamicIcon name='sparkles' className='w-4 h-4' color='var(--gold-accent)' /></div>
            <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الخلفية</p><p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>اختر خلفية التطبيق</p></div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {[
              { id: 'default', name: 'افتراضي', preview: 'radial-gradient(circle, rgba(197,160,89,0.1), transparent)' },
              { id: 'stars', name: 'نجوم ليلية', preview: 'radial-gradient(1px 1px at 30% 30%, rgba(212,175,55,0.6), transparent), radial-gradient(1px 1px at 70% 60%, rgba(212,175,55,0.4), transparent)' },
              { id: 'mosque', name: 'مسجد', preview: 'linear-gradient(180deg, transparent 40%, rgba(197,160,89,0.1) 100%)' },
              { id: 'waves', name: 'أمواج ذهبية', preview: 'repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(197,160,89,0.1) 8px, rgba(197,160,89,0.1) 10px)' },
              { id: 'flowers', name: 'أزهار', preview: 'radial-gradient(circle, rgba(244,114,182,0.15), transparent), radial-gradient(circle at 70% 70%, rgba(167,139,250,0.15), transparent)' },
              { id: 'dawn', name: 'فجر', preview: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.1), rgba(249,115,22,0.1))' },
              { id: 'night', name: 'ليلة هادئة', preview: 'linear-gradient(180deg, rgba(30,27,75,0.15), rgba(15,14,13,0.02))' },
              { id: 'garden', name: 'حديقة', preview: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent), radial-gradient(circle at 80% 80%, rgba(52,211,153,0.1), transparent)' },
            ].map(bg => (
              <button
                key={bg.id}
                onClick={() => { setSelectedBackground(bg.id); document.body.className = document.body.className.replace(/bg-app-\w+/g, ''); if (bg.id !== 'default') document.body.classList.add(`bg-app-${bg.id}`); }}
                className={`relative rounded-xl overflow-hidden h-20 flex items-end p-2 transition-all ${selectedBackground === bg.id ? 'ring-2' : ''}`}
                style={{
                  background: bg.preview,
                  border: selectedBackground === bg.id ? '1px solid var(--gold-border)' : '1px solid var(--glass-border)',
                  boxShadow: selectedBackground === bg.id ? '0 0 0 2px var(--gold-accent)' : 'none',
                }}
              >
                <span className={`text-[10px] ${selectedBackground === bg.id ? 'app-text font-medium' : 'app-text-2'}`} style={{ fontFamily: fontVar }}>{bg.name}</span>
                {selectedBackground === bg.id && (
                  <div className='absolute top-1.5 left-1.5 w-4 h-4 rounded-full flex items-center justify-center' style={{ background: 'var(--gold-accent)' }}>
                    <Check className='w-2.5 h-2.5 text-white' />
                  </div>
                )}
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Legal Links */}
        <SettingRow delay={0.24}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}><IslamicIcon name='shield' className='w-4 h-4' color='var(--gold-accent)' /></div>
            <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>قانوني</p></div>
          </div>
          <div className='space-y-2'>
            <a href='/privacy' className='w-full flex items-center justify-between p-3 rounded-xl glass-card app-border-c app-surface-h transition-colors'>
              <span className='text-sm app-text-2' style={{ fontFamily: fontVar }}>سياسة الخصوصية</span>
              <ChevronDown className='w-4 h-4 app-text-muted rotate-[-90deg]' />
            </a>
            <a href='/terms' className='w-full flex items-center justify-between p-3 rounded-xl glass-card app-border-c app-surface-h transition-colors'>
              <span className='text-sm app-text-2' style={{ fontFamily: fontVar }}>شروط الخدمة</span>
              <ChevronDown className='w-4 h-4 app-text-muted rotate-[-90deg]' />
            </a>
          </div>
        </SettingRow>

        {/* City / Prayer Times */}
        <SettingRow delay={0.25}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}><MapPin className='w-4 h-4' color='var(--gold-accent)' /></div>
            <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الموقع - مواقيت الصلاة</p><p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>اختر مدينتك لعرض المواقيت الصحيحة</p></div>
          </div>
          {selectedCity ? (
            <div className='flex items-center justify-between p-3 rounded-xl mb-2' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <div>
                <p className='app-text text-sm font-medium' style={{ fontFamily: fontVar }}>{selectedCity.name}</p>
                <p className='app-text-2 text-[11px]'>{selectedCity.country}</p>
              </div>
              <button onClick={() => setShowCityPicker(true)} className='text-xs px-3 py-1.5 rounded-lg transition-colors' style={{ color: 'var(--gold-accent)', background: 'var(--gold-glow)' }}>
                تغيير
              </button>
            </div>
          ) : null}
          <button onClick={() => setShowCityPicker(true)}
            className='w-full flex items-center justify-between p-3 rounded-xl glass-card app-border-c app-surface-h transition-colors'>
            <span className='text-sm' style={{ fontFamily: fontVar, color: selectedCity ? 'var(--gold-accent)' : 'var(--gold-accent)' }}>{selectedCity ? selectedCity.name : 'اختر المدينة'}</span>
            <MapPin className='w-4 h-4' color='var(--gold-accent)' />
          </button>
          {loadingCity && (
            <div className='mt-2 flex items-center gap-2 justify-center'>
              <div className='w-4 h-4 rounded-full animate-spin' style={{ border: '2px solid var(--gold-border)', borderTopColor: 'var(--gold-accent)' }} />
              <span className='text-xs' style={{ fontFamily: fontVar, color: 'var(--gold-accent)' }}>جارٍ جلب المواقيت...</span>
            </div>
          )}
        </SettingRow>

        {/* City Picker Modal */}
        {showCityPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-end justify-center'
            onClick={() => { setShowCityPicker(false); setCitySearch(''); }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='w-full max-w-md rounded-t-3xl max-h-[80vh] flex flex-col'
              style={{ background: 'var(--app-modal-bg)', borderTopColor: 'var(--gold-border)' }}
              onClick={e => e.stopPropagation()}>
              <div className='p-4 border-b app-border-c'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='app-text font-bold text-lg' style={{ fontFamily: fontVar }}>اختر مدينتك</h3>
                  <button onClick={() => { setShowCityPicker(false); setCitySearch(''); }}>
                    <IslamicIcon name='x' className='w-5 h-5 app-text-2' />
                  </button>
                </div>
                <div className='relative'>
                  <Search className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 app-text-muted' />
                  <input type='text' value={citySearch} onChange={e => setCitySearch(e.target.value)}
                    placeholder='ابحث عن مدينة أو دولة...'
                    className='w-full pr-10 pl-4 py-2.5 rounded-xl app-input app-text text-sm placeholder:app-text-muted focus:outline-none focus:border-amber-500/30'
                    style={{ fontFamily: fontVar }} autoFocus />
                </div>
              </div>
              <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                {filteredCountries.map(country => (
                  <div key={country.code}>
                    <button onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                      className='w-full flex items-center justify-between p-2.5 rounded-lg app-surface-h transition-colors'>
                      <span className='app-text text-sm font-medium' style={{ fontFamily: fontVar }}>{country.name}</span>
                      <ChevronDown className={`w-4 h-4 app-text-2 transition-transform ${expandedCountry === country.code ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCountry === country.code && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className='pr-4 space-y-1'>
                        {country.cities.map(city => (
                          <button key={city.name} onClick={() => selectCity(city)}
                            className={`w-full text-right p-2.5 rounded-lg transition-all text-sm ${selectedCity?.name === city.name ? '' : 'app-text-2 app-surface-h'}`}
                            style={selectedCity?.name === city.name
                              ? { background: 'var(--gold-glow)', color: 'var(--app-text)', border: '1px solid var(--gold-border)', fontFamily: fontVar }
                              : { fontFamily: fontVar }
                            }>
                            <div className='flex items-center justify-between'>
                              <span>{city.name}</span>
                              {selectedCity?.name === city.name && <Check className='w-4 h-4' color='var(--gold-accent)' />}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Data Management */}
        <SettingRow delay={0.3}>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-9 h-9 rounded-xl app-surface flex items-center justify-center'><RotateCcw className='w-4 h-4 app-text-2' /></div>
            <div><p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>إدارة البيانات</p></div>
          </div>
          <div className='space-y-2'>
            {importMsg && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-sm text-center py-2 rounded-xl' style={{ color: 'var(--gold-bright)', background: 'var(--gold-glow)', fontFamily: fontVar }}>{importMsg}</motion.p>
            )}
            <button onClick={handleExport}
              className='w-full py-2.5 rounded-xl glass-card app-border-c app-text-2 text-sm app-surface-h transition-colors flex items-center justify-center gap-2'
              style={{ fontFamily: fontVar }}>
              <Download className='w-4 h-4' color='var(--gold-accent)' />
              تصدير البيانات
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className='w-full py-2.5 rounded-xl glass-card app-border-c app-text-2 text-sm app-surface-h transition-colors flex items-center justify-center gap-2'
              style={{ fontFamily: fontVar }}>
              <Upload className='w-4 h-4' color='var(--gold-accent)' />
              استيراد البيانات
            </button>
            <input ref={fileInputRef} type='file' accept='.json' className='hidden' onChange={handleImport} />
            <button onClick={() => { if (confirm('إعادة تعيين أذكار اليوم؟')) resetDaily(); }}
              className='w-full py-2.5 rounded-xl glass-card app-border-c app-text-2 text-sm app-surface-h transition-colors'
              style={{ fontFamily: fontVar }}>إعادة تعيين أذكار اليوم</button>
            <button onClick={() => { if (confirm('إعادة تعيين جميع البيانات؟ لا يمكن التراجع.')) { setStreak(0); setTreeLevel(0); localStorage.clear(); window.location.reload(); } }}
              className='w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/20 transition-colors'
              style={{ fontFamily: fontVar }}>حذف جميع البيانات</button>
          </div>
        </SettingRow>

        {/* About */}
        <SettingRow delay={0.35}>
          <div className='text-center'>
            <div className='w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center gold-glow' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <IslamicIcon name='mosque' className='w-7 h-7' color='var(--gold-accent)' />
            </div>
            <h3 className='app-text font-bold text-base mb-0.5' style={{ fontFamily: fontVar }}>أذكاري</h3>
            <p className='app-text-2 text-xs' style={{ fontFamily: fontVar }}>تطبيق أذكار شامل</p>
            <p className='app-text-muted text-[10px] mt-2'>الإصدار 1.0.0</p>
            <p className='app-text-muted text-[10px] mt-1' style={{ fontFamily: fontVar }}>بسم الله، جعلنا هذا التطبيق في ميزان حسناتكم</p>
          </div>
        </SettingRow>
      </main>
    </motion.div>
  );
}