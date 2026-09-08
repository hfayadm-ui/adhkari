import { ArabicFont } from './store';

const fontVarMap: Record<ArabicFont, string> = {
  'cairo': 'var(--font-arabic)',
  'amiri': 'var(--font-amiri)',
  'noto-naskh': 'var(--font-noto-naskh)',
  'tajawal': 'var(--font-tajawal)',
  'ibm-plex': 'var(--font-ibm-plex)',
  'scheherazade': 'var(--font-scheherazade)',
};

export function getFontClass(font: ArabicFont): string {
  return fontVarMap[font] || 'var(--font-arabic)';
}
