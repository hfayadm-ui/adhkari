'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { LogOut, User, Shield } from '@/components/dhikr/islamic-icons';
import { ArabicFont } from '@/lib/store';
import Image from 'next/image';
import { useState } from 'react';

interface GoogleLoginProps {
  fontVar: string;
}

export default function GoogleLogin({ fontVar }: GoogleLoginProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='glass-card rounded-2xl p-4' style={{ border: '1px solid var(--gold-border)' }}>
        <div className='flex items-center justify-center py-3'>
          <div className='w-5 h-5 rounded-full animate-spin' style={{ border: '2px solid var(--gold-border)', borderTopColor: 'var(--gold-accent)' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='glass-card rounded-2xl overflow-hidden'
      style={{ border: '1px solid var(--gold-border)' }}
    >
      {/* Section header */}
      <div className='px-4 pt-4 pb-3 flex items-center gap-3'>
        <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)' }}>
          <Shield className='w-4 h-4' color='var(--gold-accent)' />
        </div>
        <div>
          <p className='app-text font-medium text-sm' style={{ fontFamily: fontVar }}>الحساب</p>
          <p className='app-text-2 text-[11px]' style={{ fontFamily: fontVar }}>{session ? 'متصل بحساب Google' : 'سجّل دخولك لحفظ تقدمك'}</p>
        </div>
      </div>

      <div className='px-4 pb-4'>
        <AnimatePresence mode='wait'>
          {session && session.user ? (
            <motion.div
              key='logged-in'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='space-y-3'
            >
              {/* User info card */}
              <div
                className='flex items-center gap-3 p-3 rounded-xl'
                style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}
              >
                {session.user.image ? (
                  <div className='relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0' style={{ border: '2px solid var(--gold-border)' }}>
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      fill
                      className='object-cover'
                      referrerPolicy='no-referrer'
                    />
                  </div>
                ) : (
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0'
                    style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))', border: '2px solid var(--gold-border)' }}
                  >
                    <User className='w-6 h-6 text-white' />
                  </div>
                )}
                <div className='flex-1 min-w-0'>
                  <p className='app-text text-sm font-bold truncate' style={{ fontFamily: fontVar }}>
                    {session.user.name}
                  </p>
                  <p className='app-text-2 text-[11px] truncate' style={{ fontFamily: fontVar }}>
                    {session.user.email}
                  </p>
                </div>
                <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ background: '#22c55e20' }}>
                  <div className='w-2.5 h-2.5 rounded-full bg-emerald-400' />
                </div>
              </div>

              {/* Sign out button */}
              <button
                onClick={handleSignOut}
                disabled={loading}
                className='w-full py-2.5 rounded-xl glass-card app-border-c app-text-2 text-sm app-surface-h transition-colors flex items-center justify-center gap-2'
                style={{ fontFamily: fontVar }}
              >
                <LogOut className='w-4 h-4' color='var(--gold-accent)' />
                تسجيل الخروج
              </button>
            </motion.div>
          ) : (
            <motion.div
              key='logged-out'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Benefits text */}
              <div className='mb-3 space-y-1.5'>
                <p className='app-text-2 text-xs flex items-center gap-2' style={{ fontFamily: fontVar }}>
                  <span className='w-1.5 h-1.5 rounded-full flex-shrink-0' style={{ background: 'var(--gold-accent)' }} />
                  حفظ تقدمك ومزامنته بين الأجهزة
                </p>
                <p className='app-text-2 text-xs flex items-center gap-2' style={{ fontFamily: fontVar }}>
                  <span className='w-1.5 h-1.5 rounded-full flex-shrink-0' style={{ background: 'var(--gold-accent)' }} />
                  استعادة بياناتك عند تغيير الجهاز
                </p>
                <p className='app-text-2 text-xs flex items-center gap-2' style={{ fontFamily: fontVar }}>
                  <span className='w-1.5 h-1.5 rounded-full flex-shrink-0' style={{ background: 'var(--gold-accent)' }} />
                  مشاركة إنجازاتك مع الآخرين
                </p>
              </div>

              {/* Google sign-in button */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className='w-full py-3 rounded-xl flex items-center justify-center gap-3 transition-all font-medium text-sm'
                style={{
                  fontFamily: fontVar,
                  background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px var(--gold-glow)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {loading ? (
                  <div className='w-5 h-5 rounded-full animate-spin' style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />
                ) : (
                  <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
                    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z' fill='#4285F4'/>
                    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
                    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/>
                    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
                  </svg>
                )}
                تسجيل الدخول بحساب Google
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
