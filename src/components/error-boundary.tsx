'use client';

import { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='min-h-screen flex items-center justify-center px-6'
        >
          <div className='glass-card rounded-2xl app-border-c p-8 max-w-sm w-full text-center space-y-4'>
            <div className='w-16 h-16 mx-auto rounded-full flex items-center justify-center'
              style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <IslamicIcon name='alert-triangle' className='w-8 h-8' color='var(--gold-accent)' />
            </div>
            <h2 className='app-text text-xl font-bold'>حدث خطأ غير متوقع</h2>
            <p className='app-text-2 text-sm leading-relaxed'>
              نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو إعادة تحميل الصفحة.
            </p>
            {this.state.error && (
              <p className='app-text-muted text-[11px] bg-red-500/10 rounded-xl p-3 text-right' dir='ltr'>
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); }}
              className='w-full py-3 rounded-xl btn-gold font-medium text-sm'
            >
              حاول مرة أخرى
            </button>
            <button
              onClick={() => window.location.reload()}
              className='w-full py-3 rounded-xl glass-card app-border-c app-text-2 text-sm app-surface-h transition-colors'
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
