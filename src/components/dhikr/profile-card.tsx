'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { getFontClass } from '@/lib/font-utils';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Check, Pencil, Calendar, X } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';

export interface AvatarPreset {
  id: string;
  icon: string;
  from: string;
  to: string;
  label: string;
}

export const avatarPresets: AvatarPreset[] = [
  { id: 'crescent', icon: 'crescent', from: '#E8C56A', to: '#8B7209', label: 'هلال' },
  { id: 'mosque', icon: 'mosque', from: '#34d399', to: '#065f46', label: 'مسجد' },
  { id: 'star', icon: 'star', from: '#60a5fa', to: '#1e3a8a', label: 'نجمة' },
  { id: 'misbaha', icon: 'misbaha', from: '#fb7185', to: '#9f1239', label: 'مسبحة' },
  { id: 'heart', icon: 'heart', from: '#f9a8d4', to: '#be185d', label: 'قلب' },
  { id: 'gem', icon: 'gem', from: '#c4b5fd', to: '#5b21b6', label: 'جوهرة' },
  { id: 'sparkles', icon: 'sparkles', from: '#fde68a', to: '#b45309', label: 'بركة' },
  { id: 'leaf', icon: 'leaf', from: '#6ee7b7', to: '#047857', label: 'ورقة' },
];

export function UserAvatar({ avatarId, size = 48, ring = false }: {
  avatarId: string; size?: number; ring?: boolean;
}) {
  const preset = avatarPresets.find(a => a.id === avatarId) || avatarPresets[0];
  return (
    <div
      className='relative flex items-center justify-center shrink-0 rounded-full'
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${preset.from} 0%, ${preset.to} 100%)`,
        boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.15)',
        border: ring ? '2px solid var(--gold-border-glow)' : '1px solid rgba(255,255,255,0.25)',
      }}
    >
      <IslamicIcon name={preset.icon} className='w-1/2 h-1/2' color='#ffffff' />
    </div>
  );
}

function StatChip({ value, label, color, fontVar }: {
  value: number | string; label: string; color: string; fontVar: string;
}) {
  return (
    <div className='flex-1 text-center py-2 rounded-xl' style={{ background: 'var(--app-surface)' }}>
      <p className='text-base font-bold leading-none' style={{ color }}>{value}</p>
      <p className='app-text-muted text-[9px] mt-1' style={{ fontFamily: fontVar }}>{label}</p>
    </div>
  );
}

export default function ProfileCard() {
  const { userName, setUserName, userAvatar, setUserAvatar, joinedAt, arabicFont, totalAllTime, bestStreak, treeLevel } = useDhikrStore();
  const fontVar = getFontClass(arabicFont);
  const [showEditor, setShowEditor] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [justSaved, setJustSaved] = useState(false);

  const openEditor = () => {
    setEditName(userName);
    setEditAvatar(userAvatar);
    setShowEditor(true);
  };

  const save = () => {
    setUserName(editName.trim().slice(0, 30));
    setUserAvatar(editAvatar);
    setShowEditor(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const memberSince = joinedAt
    ? new Date(joinedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}
        className='glass-card rounded-2xl p-4 relative overflow-hidden'
        style={{ border: '1px solid var(--gold-border)' }}
      >
        {/* Gold top sheen */}
        <div className='absolute top-0 right-6 left-6 h-px' style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border-glow), transparent)' }} />

        <div className='flex items-center gap-3.5'>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={openEditor}
            className='relative shrink-0'
            aria-label='تعديل الملف الشخصي'
          >
            <UserAvatar avatarId={userAvatar} size={58} ring />
            <span
              className='absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full flex items-center justify-center'
              style={{ background: 'linear-gradient(135deg, var(--gold-bright), var(--gold-accent))', border: '2px solid var(--app-modal-bg)' }}
            >
              <Pencil className='w-2.5 h-2.5' color='#33270e' />
            </span>
          </motion.button>

          <div className='flex-1 min-w-0'>
            <button onClick={openEditor} className='text-right w-full'>
              <h2 className='app-text font-bold text-lg leading-tight truncate' style={{ fontFamily: fontVar }}>
                {userName || 'أهلًا بك في أذكاري'}
              </h2>
              <p className='app-text-2 text-[11px] flex items-center gap-1 mt-0.5'>
                <Calendar className='w-3 h-3' color='var(--gold-accent)' />
                {memberSince ? <span>عضو منذ {memberSince}</span> : <span>اضغط لتخصيص ملفك الشخصي</span>}
              </p>
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={openEditor}
            className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 app-surface-h transition-colors'
            style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}
            aria-label='تعديل'
          >
            <Pencil className='w-4 h-4' color='var(--gold-accent)' />
          </motion.button>
        </div>

        {/* Stats row */}
        <div className='flex gap-2 mt-3.5'>
          <StatChip value={totalAllTime.toLocaleString('ar-EG')} label='إجمالي الأذكار' color='var(--gold-accent)' fontVar={fontVar} />
          <StatChip value={bestStreak} label='أطول سلسلة' color='#f97316' fontVar={fontVar} />
          <StatChip value={treeLevel} label='مستوى الشجرة' color='#10b981' fontVar={fontVar} />
        </div>

        {justSaved && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className='text-center text-[11px] mt-2.5'
            style={{ color: 'var(--gold-bright)', fontFamily: fontVar }}
          >
            تم حفظ ملفك الشخصي ✓
          </motion.p>
        )}
      </motion.div>

      {/* Profile Editor — bottom sheet */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-end justify-center'
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className='w-full max-w-md rounded-t-3xl p-5 pb-8'
              style={{ background: 'var(--app-modal-bg)', borderTop: '1px solid var(--gold-border)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle + header */}
              <div className='w-10 h-1 rounded-full mx-auto mb-4' style={{ background: 'var(--app-ring-track)' }} />
              <div className='flex items-center justify-between mb-5'>
                <h3 className='app-text font-bold text-lg' style={{ fontFamily: fontVar }}>الملف الشخصي</h3>
                <button
                  onClick={() => setShowEditor(false)}
                  className='w-8 h-8 rounded-lg flex items-center justify-center app-surface'
                  aria-label='إغلاق'
                >
                  <X className='w-4 h-4 app-text-2' />
                </button>
              </div>

              {/* Avatar preview */}
              <div className='flex justify-center mb-5'>
                <motion.div key={editAvatar} initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <UserAvatar avatarId={editAvatar} size={84} ring />
                </motion.div>
              </div>

              {/* Avatar picker */}
              <p className='app-text-2 text-xs mb-2' style={{ fontFamily: fontVar }}>اختر صورتك الرمزية</p>
              <div className='grid grid-cols-4 gap-2.5 mb-5'>
                {avatarPresets.map(a => (
                  <motion.button
                    key={a.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditAvatar(a.id)}
                    className='relative flex flex-col items-center gap-1.5 py-2.5 rounded-2xl transition-all'
                    style={{
                      background: editAvatar === a.id ? 'var(--gold-glow)' : 'var(--app-surface)',
                      border: editAvatar === a.id ? '1px solid var(--gold-border-glow)' : '1px solid transparent',
                    }}
                    aria-label={a.label}
                  >
                    <UserAvatar avatarId={a.id} size={42} />
                    <span className={`text-[9px] ${editAvatar === a.id ? 'app-text font-medium' : 'app-text-muted'}`} style={{ fontFamily: fontVar }}>{a.label}</span>
                    {editAvatar === a.id && (
                      <span
                        className='absolute -top-1 -left-1 w-[18px] h-[18px] rounded-full flex items-center justify-center'
                        style={{ background: 'linear-gradient(135deg, var(--gold-bright), var(--gold-accent))' }}
                      >
                        <Check className='w-2.5 h-2.5' color='#fff' />
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Name input */}
              <p className='app-text-2 text-xs mb-2' style={{ fontFamily: fontVar }}>اسمك (اختياري)</p>
              <input
                type='text'
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
                placeholder='مثال: عبد الله'
                maxLength={30}
                className='w-full px-4 py-3 rounded-xl app-input app-text text-sm placeholder:app-text-muted focus:outline-none mb-5'
                style={{ fontFamily: fontVar, border: '1px solid var(--app-input-border)' }}
                autoFocus
              />

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={save}
                className='btn-gold w-full py-3.5 rounded-xl text-base font-medium'
                style={{ fontFamily: fontVar }}
              >
                <span className='flex items-center justify-center gap-2'>
                  <Check className='w-5 h-5' color='#33270e' />
                  حفظ التغييرات
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
