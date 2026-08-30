'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@/components/dhikr/islamic-icons';
import { eveningAdhkar } from '@/lib/dhikr-data';
import { useDhikrStore, ArabicFont } from '@/lib/store';

function getFontClass(font: ArabicFont): string {
  const map: Record<ArabicFont, string> = {
    'cairo': 'var(--font-arabic)',
    'amiri': 'var(--font-amiri)',
    'noto-naskh': 'var(--font-noto-naskh)',
    'tajawal': 'var(--font-tajawal)',
    'ibm-plex': 'var(--font-ibm-plex)',
    'scheherazade': 'var(--font-scheherazade)',
  };
  return map[font] || 'var(--font-arabic)';
}

export default function FocusScreen() {
  const { arabicFont, setCurrentScreen } = useDhikrStore();
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const fontClass = getFontClass(arabicFont);
  const dhikrList = eveningAdhkar;

  const current = dhikrList[index];
  const isLast = index >= dhikrList.length;

  const handleTap = useCallback(() => {
    if (isLast) return;
    if (!current) return;

    const nextCount = count + 1;
    if (nextCount >= current.count) {
      // Move to next dhikr
      if (index + 1 >= dhikrList.length) {
        setFinished(true);
      } else {
        setIndex(prev => prev + 1);
        setCount(0);
      }
    } else {
      setCount(nextCount);
    }
  }, [count, current, index, isLast, dhikrList.length]);

  const handleClose = () => setCurrentScreen('home');

  return (
    <div
      className='fixed inset-0 z-[100] flex flex-col items-center justify-center select-none'
      style={{ background: '#000' }}
      onClick={handleTap}
      role='button'
      tabIndex={0}
      aria-label='شاشة التركيز - اضغط للتقدم'
    >
      {/* Dhikr Text */}
      <div className='flex-1 flex items-center justify-center px-8 w-full'>
        <AnimatePresence mode='wait'>
          {finished ? (
            <motion.p
              key='done'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-white text-center leading-loose'
              style={{ fontFamily: fontClass, fontSize: '1.75rem' }}
            >
              &#x2728; تمت الأذكار بحمد الله &#x2728;
            </motion.p>
          ) : current ? (
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='text-white text-center leading-loose'
              style={{ fontFamily: fontClass, fontSize: '1.75rem' }}
            >
              {current.text}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Count indicator */}
      <div className='pb-20 text-center'>
        {!finished && current && (
          <p className='text-gray-500 text-sm'>
            {count}/{current.count}
          </p>
        )}
      </div>

      {/* Bottom bar with gold border + close button */}
      <div
        className='fixed bottom-0 left-0 right-0 flex items-center justify-center py-3 px-4'
        style={{
          borderTop: '1px solid rgba(197, 160, 89, 0.4)',
          background: 'rgba(0,0,0,0.8)',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className='w-10 h-10 rounded-full flex items-center justify-center'
          style={{ border: '1px solid rgba(197, 160, 89, 0.4)' }}
          aria-label='إغلاق'
        >
          <X className='w-5 h-5' color='rgba(197, 160, 89, 0.7)' />
        </button>
      </div>
    </div>
  );
}
