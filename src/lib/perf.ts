/* Performance detection — runs once per session.
   Low-end devices get the same visual design with cheaper rendering:
   smaller blur radii, no infinite loops, no heavy GPU filters. */

type NavWithMemory = Navigator & { deviceMemory?: number };

function detectLowEnd(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cores = navigator.hardwareConcurrency || 8;
    const mem = (navigator as NavWithMemory).deviceMemory || 8;
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return cores <= 4 || mem <= 3 || reducedMotion;
  } catch {
    return false;
  }
}

export const isLowEndDevice: boolean = detectLowEnd();
