'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key='splash'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='fixed inset-0 z-[300] flex flex-col items-center justify-center'
            style={{ background: '#111010' }}
          >
            {/* Background glow */}
            <div
              className='absolute'
              style={{
                width: '200px', height: '200px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className='relative mb-6'
            >
              <div
                className='w-24 h-24 rounded-3xl flex items-center justify-center'
                style={{
                  background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
                  boxShadow: '0 8px 30px rgba(197,160,89,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <svg className='w-12 h-12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12 2L12 4' />
                  <path d='M12 2C12 2 8 6 8 10L8 14' />
                  <path d='M12 2C12 2 16 6 16 10L16 14' />
                  <rect x='4' y='14' width='16' height='8' rx='1' />
                  <path d='M8 14V10' /><path d='M16 14V10' />
                  <rect x='10' y='17' width='4' height='5' rx='0.5' />
                  <circle cx='12' cy='1.5' r='0.5' fill='white' />
                  <circle cx='8' cy='10' r='0.5' fill='white' />
                  <circle cx='16' cy='10' r='0.5' fill='white' />
                </svg>
              </div>
            </motion.div>

            {/* App name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className='text-2xl font-bold text-white mb-2'
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              أذكاري
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className='text-sm'
              style={{ color: '#C5A059', fontFamily: 'var(--font-arabic)' }}
            >
              بسم الله الرحمن الرحيم
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className='flex gap-2 mt-8'
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className='w-2 h-2 rounded-full'
                  style={{ background: '#C5A059' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!show && children}
    </>
  );
}
