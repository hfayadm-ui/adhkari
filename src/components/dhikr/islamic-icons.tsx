'use client';

import {
  Sun, Moon, Star, Sunrise, Sunset, CloudSun, Sparkles, Leaf, Bell,
  BookOpen, Hand, BarChart3, Settings, Home, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Clock, Trophy, TreePine, TrendingUp, Calendar,
  Award, Zap, RotateCcw, Target, Plus, Minus, Volume2, VolumeX,
  Search, CheckCircle2, Bookmark, Info, Share2, Copy, Compass, Gem,
  Utensils, Shield, MapPin, Type, Palette, Eye, Heart, Flame,
  CircleDot, Landmark, Trees, StarOff, X, ArrowRight, Check, Pencil, LogOut, User, Smartphone,
  Waves, Wind, Brain, Flower2, Cloud, Droplets, Play, Pause, RotateCw, Download, Upload, Trash2, Lock
} from 'lucide-react';
import React from 'react';

// Custom SVG Islamic Icons
function MosqueIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M12 2L12 4' />
      <path d='M12 2C12 2 8 6 8 10L8 14' />
      <path d='M12 2C12 2 16 6 16 10L16 14' />
      <rect x='4' y='14' width='16' height='8' rx='1' />
      <path d='M8 14V10' />
      <path d='M16 14V10' />
      <path d='M12 22V18' />
      <rect x='10' y='17' width='4' height='5' rx='0.5' />
      <circle cx='12' cy='1.5' r='0.5' fill={color} />
      <circle cx='8' cy='10' r='0.5' fill={color} />
      <circle cx='16' cy='10' r='0.5' fill={color} />
    </svg>
  );
}

function CrescentIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5'>
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' strokeLinecap='round' strokeLinejoin='round' />
      <circle cx='18' cy='5' r='1' fill={color} />
    </svg>
  );
}

function StarsIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}

function SeedlingIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M7 20h10' />
      <path d='M10 20c5.5-2.5.8-6.4 3-10' />
      <path d='M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z' />
      <path d='M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' />
    </svg>
  );
}

function PalmTreeIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M13 8c0-2.76-2.46-5-5.5-5-1.77 0-3.34.68-4.39 1.72' />
      <path d='M13 8c0-2.76 2.46-5 5.5-5 1.77 0 3.34.68 4.39 1.72' />
      <path d='M13 8c-2.76 0-5 2.46-5 5.5 0 1.77.68 3.34 1.72 4.39' />
      <path d='M13 8c-2.76 0-5-2.46-5-5.5 0-1.77.68-3.34 1.72-4.39' />
      <path d='M13 8v14' />
      <path d='M5.73 18.17C7.09 17.27 9.44 16.5 13 16.5' />
    </svg>
  );
}

function SproutIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M7 20h10' />
      <path d='M12 20V8' />
      <path d='M12 8C12 8 7 4 3 7' />
      <path d='M12 8C12 8 17 4 21 7' />
    </svg>
  );
}

function HandTapIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M18 11V6a2 2 0 0 0-4 0v5' />
      <path d='M14 10V4a2 2 0 0 0-4 0v6' />
      <path d='M10 10.5V6a2 2 0 0 0-4 0v8' />
      <path d='M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15' />
    </svg>
  );
}

// Icon name to component mapping
const iconMap: Record<string, React.FC<{className?: string; color?: string}>> = {
  'mosque': MosqueIcon,
  'crescent': CrescentIcon,
  'sunrise': Sunrise,
  'sun': Sun,
  'sunset': Sunset,
  'moon': Moon,
  'stars': StarsIcon,
  'cloud-sun': CloudSun,
  'star': Star,
  'sparkles': Sparkles,
  'leaf': Leaf,
  'bell': Bell,
  'book': BookOpen,
  'hand': Hand,
  'hand-tap': HandTapIcon,
  'bar-chart': BarChart3,
  'settings': Settings,
  'home': Home,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'clock': Clock,
  'trophy': Trophy,
  'tree-pine': TreePine,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'award': Award,
  'zap': Zap,
  'rotate-ccw': RotateCcw,
  'target': Target,
  'plus': Plus,
  'minus': Minus,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  'search': Search,
  'check-circle': CheckCircle2,
  'check': CheckCircle2,
  'bookmark': Bookmark,
  'info': Info,
  'share': Share2,
  'copy': Copy,
  'compass': Compass,
  'gem': Gem,
  'utensils': Utensils,
  'shield': Shield,
  'map-pin': MapPin,
  'type': Type,
  'palette': Palette,
  'eye': Eye,
  'heart': Heart,
  'flame': Flame,
  'circle-dot': CircleDot,
  'landmark': Landmark,
  'palm-tree': PalmTreeIcon,
  'seedling': SeedlingIcon,
  'sprout': SproutIcon,
  'trees': Trees,
  'x': X,
  'arrow-right': ArrowRight,
  'waves': Waves,
  'wind': Wind,
  'brain': Brain,
  'flower': Flower2,
  'cloud': Cloud,
  'droplets': Droplets,
  'play': Play,
  'pause': Pause,
  'rotate-cw': RotateCw,
};

interface IconProps {
  name: string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function IslamicIcon({ name, className = 'w-5 h-5', color, style }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <Star className={className} color={color || 'currentColor'} style={style} />;
  }
  if (style) {
    return <span style={style} className='inline-flex'><IconComponent className={className} color={color} /></span>;
  }
  return <IconComponent className={className} color={color} />;
}

export default IslamicIcon;

// Re-export all lucide icons used elsewhere
export {
  Home, BookOpen, Hand, BarChart3, Settings, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Clock, Trophy, TreePine, TrendingUp, Calendar,
  Award, Zap, RotateCcw, Target, Volume2, VolumeX, Search, CheckCircle2, Check,
  Bookmark, Info, Share2, Copy, Compass, Star, Flame, Sparkles,
  Sun, Moon, Sunrise, Sunset, CloudSun, Bell, Leaf, Gem, Utensils,
  Shield, MapPin, Type, Palette, Heart, Eye, Landmark, X, Plus, Minus, ArrowRight,
  Wind, Brain, Flower2, Cloud, Droplets, Play, Pause, RotateCw, Download, Upload, Pencil, LogOut, User, Smartphone, Trash2,
  Trees, Lock, CircleDot, StarOff
};
