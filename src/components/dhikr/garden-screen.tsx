'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDhikrStore } from '@/lib/store';
import { IslamicIcon } from '@/components/dhikr/islamic-icons';
import { Home, ChevronRight, Trees, Sparkles, Star, Lock, Droplets, Flower2, Leaf, Flame, Check } from '@/components/dhikr/islamic-icons';
import { useState } from 'react';
import { getFontClass } from '@/lib/font-utils';
import TreeVisualization, { treeConfigs } from '@/components/dhikr/tree-visualization';

const plantConfig: Record<string, { label: string; color: string; unlockDay: number; size: number; glowColor: string }> = {
  seed:    { label: 'بذرة',     color: '#8B6914', unlockDay: 0,  size: 44, glowColor: '#a07d1a' },
  sprout:  { label: 'نبتة',     color: '#22c55e', unlockDay: 1,  size: 48, glowColor: '#4ade80' },
  flower:  { label: 'زهرة',     color: '#f472b6', unlockDay: 3,  size: 50, glowColor: '#f9a8d4' },
  rose:    { label: 'وردة',     color: '#ef4444', unlockDay: 5,  size: 52, glowColor: '#fca5a5' },
  jasmine: { label: 'ياسمين',  color: '#fbbf24', unlockDay: 7,  size: 52, glowColor: '#fde68a' },
  lotus:   { label: 'زهر اللوتس', color: '#818cf8', unlockDay: 10, size: 54, glowColor: '#c4b5fd' },
  tree:    { label: 'شجرة',     color: '#10b981', unlockDay: 14, size: 56, glowColor: '#6ee7b7' },
  palm:    { label: 'نخلة',     color: '#059669', unlockDay: 21, size: 58, glowColor: '#34d399' },
};

const gardenNames = ['أرض barren', 'حديقة ناشئة', 'حديقة خضراء', 'حديقة الزهور', 'جنة صغيرة', 'روضة رائعة', 'حديقة النخيل', 'جنة المؤمن', 'حديقة الخلد', 'جنة الفردوس'];

/* ========== Custom SVG Plant Illustrations ========== */

function SeedSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Soil mound */}
      <ellipse cx='50' cy='82' rx='28' ry='8' fill='#78350f' opacity='0.6' />
      <ellipse cx='50' cy='80' rx='24' ry='6' fill='#92400e' opacity='0.5' />
      {/* Seed body - oval */}
      <ellipse cx='50' cy='72' rx='8' ry='11' fill={color} opacity='0.9' />
      <ellipse cx='50' cy='72' rx='8' ry='11' fill='url(#seedShine)' />
      {/* Seed line */}
      <path d='M50 62 Q50 72 50 83' stroke='#6b4c12' strokeWidth='0.8' fill='none' opacity='0.5' />
      {/* Tiny sprout emerging */}
      <path d='M50 61 Q48 55 44 50' stroke='#22c55e' strokeWidth='2' fill='none' strokeLinecap='round' />
      <path d='M44 50 Q40 48 42 44 Q46 46 44 50' fill='#22c55e' opacity='0.8' />
      <path d='M50 61 Q52 56 56 52' stroke='#22c55e' strokeWidth='1.5' fill='none' strokeLinecap='round' />
      <path d='M56 52 Q58 49 55 46 Q53 49 56 52' fill='#4ade80' opacity='0.7' />
      <defs>
        <radialGradient id='seedShine' cx='40%' cy='35%'>
          <stop offset='0%' stopColor='white' stopOpacity='0.3' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </radialGradient>
      </defs>
    </svg>
  );
}

function SproutSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Soil */}
      <ellipse cx='50' cy='85' rx='26' ry='7' fill='#78350f' opacity='0.5' />
      {/* Stem */}
      <path d='M50 83 Q50 60 50 45' stroke='#16a34a' strokeWidth='2.5' fill='none' strokeLinecap='round' />
      {/* Left leaf */}
      <path d='M50 55 Q35 45 30 35 Q38 38 50 48' fill={color} opacity='0.9' />
      <path d='M50 55 Q40 47 35 40' stroke='#15803d' strokeWidth='0.8' fill='none' />
      {/* Right leaf */}
      <path d='M50 48 Q65 38 70 28 Q62 32 50 42' fill={color} opacity='0.85' />
      <path d='M50 48 Q60 40 65 33' stroke='#15803d' strokeWidth='0.8' fill='none' />
      {/* Small top leaf */}
      <path d='M50 45 Q46 38 42 32 Q47 35 50 42' fill='#4ade80' opacity='0.8' />
      {/* Tiny roots visible in soil */}
      <path d='M50 83 Q46 88 42 90' stroke='#92400e' strokeWidth='1' fill='none' opacity='0.4' />
      <path d='M50 83 Q54 89 58 91' stroke='#92400e' strokeWidth='1' fill='none' opacity='0.4' />
    </svg>
  );
}

function FlowerSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Soil */}
      <ellipse cx='50' cy='88' rx='22' ry='5' fill='#78350f' opacity='0.4' />
      {/* Stem */}
      <path d='M50 86 Q50 60 50 42' stroke='#16a34a' strokeWidth='2.5' fill='none' strokeLinecap='round' />
      {/* Leaves on stem */}
      <path d='M50 68 Q38 62 34 55 Q40 58 50 64' fill='#22c55e' opacity='0.8' />
      <path d='M50 60 Q62 54 66 47 Q60 50 50 56' fill='#22c55e' opacity='0.8' />
      {/* Petals - 6 petals arranged in circle */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 12;
        const cy = 34 + Math.sin(rad) * 12;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx='7' ry='11' fill={color} opacity='0.85'
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}
      {/* Inner petals - smaller, lighter */}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 6;
        const cy = 34 + Math.sin(rad) * 6;
        return (
          <ellipse key={`inner-${i}`} cx={cx} cy={cy} rx='4' ry='7' fill={color} opacity='0.6'
            transform={`rotate(${angle}, ${cx}, ${cy})`} />
        );
      })}
      {/* Center */}
      <circle cx='50' cy='34' r='6' fill='#fbbf24' />
      <circle cx='50' cy='34' r='3.5' fill='#f59e0b' />
      {/* Center dots */}
      {[0, 60, 120].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <circle key={`dot-${i}`} cx={50 + Math.cos(r) * 2.5} cy={34 + Math.sin(r) * 2.5} r='0.8' fill='#d97706' />;
      })}
    </svg>
  );
}

function RoseSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Soil */}
      <ellipse cx='50' cy='90' rx='20' ry='5' fill='#78350f' opacity='0.4' />
      {/* Stem with thorns */}
      <path d='M50 88 Q49 65 50 44' stroke='#16a34a' strokeWidth='2.5' fill='none' strokeLinecap='round' />
      {/* Thorns */}
      <path d='M49.5 75 L45 72 L49 73' fill='#16a34a' />
      <path d='M50.5 65 L55 62 L51 63' fill='#16a34a' />
      {/* Leaves */}
      <path d='M49 72 Q36 66 32 58 Q38 62 49 68' fill='#22c55e' opacity='0.8' />
      <path d='M49 72 Q37 67 33 60' stroke='#15803d' strokeWidth='0.7' fill='none' />
      <path d='M51 62 Q64 56 68 48 Q62 52 51 58' fill='#22c55e' opacity='0.8' />
      {/* Rose petals - layered spiral */}
      {/* Outer petals */}
      <ellipse cx='40' cy='36' rx='12' ry='9' fill={color} opacity='0.7' transform='rotate(-30, 40, 36)' />
      <ellipse cx='60' cy='36' rx='12' ry='9' fill={color} opacity='0.7' transform='rotate(30, 60, 36)' />
      <ellipse cx='50' cy='28' rx='10' ry='12' fill={color} opacity='0.75' />
      <ellipse cx='38' cy='42' rx='10' ry='8' fill={color} opacity='0.65' transform='rotate(-45, 38, 42)' />
      <ellipse cx='62' cy='42' rx='10' ry='8' fill={color} opacity='0.65' transform='rotate(45, 62, 42)' />
      {/* Middle petals */}
      <ellipse cx='46' cy='35' rx='8' ry='7' fill='#f87171' opacity='0.85' transform='rotate(-15, 46, 35)' />
      <ellipse cx='54' cy='35' rx='8' ry='7' fill='#f87171' opacity='0.85' transform='rotate(15, 54, 35)' />
      <ellipse cx='50' cy='32' rx='7' ry='8' fill='#f87171' opacity='0.8' />
      {/* Inner petals - tightly curled */}
      <ellipse cx='48' cy='35' rx='5' ry='4' fill='#fca5a5' opacity='0.9' transform='rotate(-20, 48, 35)' />
      <ellipse cx='52' cy='34' rx='4' ry='5' fill='#fca5a5' opacity='0.9' transform='rotate(10, 52, 34)' />
      <ellipse cx='50' cy='36' rx='3.5' ry='3' fill='#fecaca' opacity='0.9' />
      {/* Center spiral hint */}
      <circle cx='50' cy='35' r='2' fill='#fee2e2' opacity='0.8' />
    </svg>
  );
}

function JasmineSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Branch */}
      <path d='M20 75 Q35 70 50 60 Q65 50 80 42' stroke='#78350f' strokeWidth='3' fill='none' strokeLinecap='round' />
      <path d='M50 60 Q55 72 60 80' stroke='#78350f' strokeWidth='2' fill='none' strokeLinecap='round' />
      {/* Leaves on branch */}
      <path d='M30 72 Q22 64 18 56 Q26 62 30 68' fill='#22c55e' opacity='0.8' />
      <path d='M30 72 Q25 66 22 60' stroke='#15803d' strokeWidth='0.6' fill='none' />
      <path d='M42 66 Q34 58 30 50 Q38 56 42 62' fill='#16a34a' opacity='0.75' />
      <path d='M58 54 Q66 46 70 38 Q64 44 58 50' fill='#22c55e' opacity='0.8' />
      <path d='M70 48 Q78 40 82 32 Q76 38 70 44' fill='#16a34a' opacity='0.75' />
      <path d='M55 68 Q48 74 42 78 Q50 74 54 66' fill='#22c55e' opacity='0.7' />
      {/* Jasmine flowers - 5-petal star shapes */}
      {[{ cx: 25, cy: 70 }, { cx: 45, cy: 62 }, { cx: 65, cy: 50 }, { cx: 78, cy: 43 }, { cx: 56, cy: 76 }].map((pos, i) => {
        const petalR = i === 2 ? 7 : 5.5;
        return (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((angle, j) => {
              const rad = (angle * Math.PI) / 180;
              const px = pos.cx + Math.cos(rad) * petalR * 0.6;
              const py = pos.cy + Math.sin(rad) * petalR * 0.6;
              return (
                <ellipse key={j} cx={px} cy={py} rx={petalR * 0.45} ry={petalR * 0.7}
                  fill='white' opacity='0.9' transform={`rotate(${angle}, ${px}, ${py})`} />
              );
            })}
            <circle cx={pos.cx} cy={pos.cy} r={petalR * 0.25} fill={color} />
          </g>
        );
      })}
      {/* Unopened buds */}
      <ellipse cx='36' cy='68' rx='2.5' ry='4' fill='white' opacity='0.7' transform='rotate(-15, 36, 68)' />
      <ellipse cx='72' cy='46' rx='2' ry='3.5' fill='white' opacity='0.7' transform='rotate(20, 72, 46)' />
    </svg>
  );
}

function LotusSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Water surface */}
      <ellipse cx='50' cy='78' rx='38' ry='10' fill='#3b82f6' opacity='0.15' />
      <ellipse cx='50' cy='78' rx='30' ry='7' fill='#3b82f6' opacity='0.1' />
      {/* Water ripples */}
      <ellipse cx='50' cy='78' rx='42' ry='11' fill='none' stroke='#60a5fa' strokeWidth='0.5' opacity='0.3' />
      <ellipse cx='50' cy='78' rx='46' ry='12' fill='none' stroke='#60a5fa' strokeWidth='0.3' opacity='0.2' />
      {/* Lotus leaf (pad) */}
      <ellipse cx='30' cy='76' rx='16' ry='6' fill='#16a34a' opacity='0.5' transform='rotate(-10, 30, 76)' />
      <path d='M30 76 L30 70' stroke='#15803d' strokeWidth='0.5' opacity='0.3' />
      {/* Stem */}
      <path d='M50 76 Q49 58 50 42' stroke='#16a34a' strokeWidth='3' fill='none' strokeLinecap='round' />
      {/* Outer petals - large, open */}
      <ellipse cx='30' cy='40' rx='8' ry='16' fill={color} opacity='0.5' transform='rotate(-35, 30, 40)' />
      <ellipse cx='70' cy='40' rx='8' ry='16' fill={color} opacity='0.5' transform='rotate(35, 70, 40)' />
      <ellipse cx='36' cy='44' rx='7' ry='15' fill={color} opacity='0.55' transform='rotate(-20, 36, 44)' />
      <ellipse cx='64' cy='44' rx='7' ry='15' fill={color} opacity='0.55' transform='rotate(20, 64, 44)' />
      {/* Middle petals */}
      <ellipse cx='42' cy='40' rx='6' ry='14' fill={color} opacity='0.7' transform='rotate(-10, 42, 40)' />
      <ellipse cx='58' cy='40' rx='6' ry='14' fill={color} opacity='0.7' transform='rotate(10, 58, 40)' />
      <ellipse cx='50' cy='38' rx='5' ry='13' fill={color} opacity='0.75' />
      {/* Inner petals */}
      <ellipse cx='46' cy='38' rx='4' ry='10' fill='#c4b5fd' opacity='0.85' transform='rotate(-8, 46, 38)' />
      <ellipse cx='54' cy='38' rx='4' ry='10' fill='#c4b5fd' opacity='0.85' transform='rotate(8, 54, 38)' />
      {/* Center */}
      <circle cx='50' cy='36' r='5' fill='#fbbf24' opacity='0.9' />
      <circle cx='50' cy='36' r='3' fill='#f59e0b' />
      {/* Center seeds */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <circle key={i} cx={50 + Math.cos(r) * 2} cy={36 + Math.sin(r) * 2} r='0.7' fill='#d97706' />;
      })}
    </svg>
  );
}

function TreePlantSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Ground */}
      <ellipse cx='50' cy='90' rx='30' ry='6' fill='#78350f' opacity='0.3' />
      {/* Grass tufts */}
      <path d='M30 88 Q28 83 26 80' stroke='#22c55e' strokeWidth='1.2' fill='none' opacity='0.5' />
      <path d='M33 88 Q32 84 34 81' stroke='#16a34a' strokeWidth='1' fill='none' opacity='0.4' />
      <path d='M68 88 Q70 83 72 80' stroke='#22c55e' strokeWidth='1.2' fill='none' opacity='0.5' />
      <path d='M65 88 Q66 84 64 82' stroke='#16a34a' strokeWidth='1' fill='none' opacity='0.4' />
      {/* Trunk */}
      <path d='M47 88 Q46 72 44 58 Q48 55 50 50 Q52 55 56 58 Q54 72 53 88' fill='#78350f' />
      <path d='M47 88 Q46 72 44 58' stroke='#5c2d0e' strokeWidth='0.5' fill='none' opacity='0.5' />
      {/* Branches hint */}
      <path d='M46 65 Q38 60 32 55' stroke='#78350f' strokeWidth='2' fill='none' strokeLinecap='round' />
      <path d='M54 62 Q62 57 68 52' stroke='#78350f' strokeWidth='2' fill='none' strokeLinecap='round' />
      {/* Canopy - layered circles */}
      <circle cx='50' cy='38' r='22' fill={color} opacity='0.7' />
      <circle cx='36' cy='44' r='16' fill={color} opacity='0.75' />
      <circle cx='64' cy='44' r='16' fill={color} opacity='0.75' />
      <circle cx='42' cy='32' r='14' fill={color} opacity='0.8' />
      <circle cx='58' cy='32' r='14' fill={color} opacity='0.8' />
      <circle cx='50' cy='28' r='13' fill='#34d399' opacity='0.85' />
      <circle cx='50' cy='24' r='8' fill='#6ee7b7' opacity='0.6' />
      {/* Fruits */}
      {[{ x: 35, y: 42 }, { x: 58, y: 36 }, { x: 44, y: 30 }, { x: 62, y: 46 }, { x: 40, y: 48 }].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r='2.5' fill='#f97316' opacity='0.8' />
      ))}
      {/* Fruit highlights */}
      {[{ x: 35, y: 42 }, { x: 58, y: 36 }, { x: 44, y: 30 }].map((p, i) => (
        <circle key={`h-${i}`} cx={p.x - 0.8} cy={p.y - 0.8} r='0.8' fill='white' opacity='0.4' />
      ))}
    </svg>
  );
}

function PalmPlantSVG({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg viewBox='0 0 100 100' className='w-full h-full' style={{ width: s, height: s }}>
      {/* Ground / sand */}
      <ellipse cx='50' cy='92' rx='32' ry='6' fill='#d4a056' opacity='0.3' />
      {/* Trunk - curved with segments */}
      <path d='M50 90 Q52 70 48 50 Q46 35 50 22' stroke='#92400e' strokeWidth='6' fill='none' strokeLinecap='round' />
      <path d='M50 90 Q52 70 48 50 Q46 35 50 22' stroke='#a16207' strokeWidth='4' fill='none' strokeLinecap='round' />
      {/* Trunk segment lines */}
      {[75, 65, 55, 45].map((y, i) => (
        <path key={i} d={`M${48 + (i < 2 ? 1 : -1)} ${y} Q50 ${y - 2} ${52 + (i < 2 ? -1 : 1)} ${y + 1}`}
          stroke='#78350f' strokeWidth='0.8' fill='none' opacity='0.4' />
      ))}
      {/* Palm fronds - 7 leaves radiating from top */}
      {[{ angle: -90, len: 32 }, { angle: -55, len: 30 }, { angle: -125, len: 30 },
        { angle: -30, len: 26 }, { angle: -150, len: 26 },
        { angle: -10, len: 20 }, { angle: -170, len: 20 }].map((frond, i) => {
        const rad = (frond.angle * Math.PI) / 180;
        const baseX = 50;
        const baseY = 22;
        const tipX = baseX + Math.cos(rad) * frond.len;
        const tipY = baseY + Math.sin(rad) * frond.len;
        const midX = baseX + Math.cos(rad) * frond.len * 0.5;
        const midY = baseY + Math.sin(rad) * frond.len * 0.5 + 6;
        const droopX = baseX + Math.cos(rad) * frond.len * 0.8;
        const droopY = baseY + Math.sin(rad) * frond.len * 0.8 + 8;
        return (
          <g key={i}>
            {/* Main frond stem */}
            <path d={`M${baseX} ${baseY} Q${midX} ${midY} ${droopX} ${droopY} Q${tipX} ${tipY + 4} ${tipX + (i < 4 ? 3 : -3)} ${tipY + 8}`}
              stroke={i < 4 ? '#15803d' : '#16a34a'} strokeWidth={i < 4 ? '2' : '1.5'} fill='none' strokeLinecap='round' />
            {/* Leaflets along frond */}
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, j) => {
              const px = baseX + (midX - baseX) * t * 2 + (droopX - midX) * Math.max(0, t - 0.3);
              const py = baseY + (midY - baseY) * t * 2 + (droopY - midY) * Math.max(0, t - 0.3);
              const leafAngle = rad + (j % 2 === 0 ? 0.5 : -0.5);
              const lx = px + Math.cos(leafAngle) * 5;
              const ly = py + Math.sin(leafAngle) * 5;
              const lx2 = px + Math.cos(leafAngle + Math.PI) * 4;
              const ly2 = py + Math.sin(leafAngle + Math.PI) * 4;
              return (
                <g key={j}>
                  <line x1={px} y1={py} x2={lx} y2={ly} stroke={color} strokeWidth='1.5' opacity='0.7' />
                  <line x1={px} y1={py} x2={lx2} y2={ly2} stroke={color} strokeWidth='1.2' opacity='0.5' />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* Coconuts */}
      <circle cx='47' cy='26' r='3.5' fill='#a16207' opacity='0.8' />
      <circle cx='53' cy='25' r='3' fill='#92400e' opacity='0.8' />
      <circle cx='50' cy='28' r='2.5' fill='#78350f' opacity='0.7' />
    </svg>
  );
}

const plantSVGMap: Record<string, React.FC<{ size: number; color: string }>> = {
  seed: SeedSVG,
  sprout: SproutSVG,
  flower: FlowerSVG,
  rose: RoseSVG,
  jasmine: JasmineSVG,
  lotus: LotusSVG,
  tree: TreePlantSVG,
  palm: PalmPlantSVG,
};

function GardenPlantSVG({ type, size, color, delay = 0 }: { type: string; size: number; color: string; delay?: number }) {
  const PlantComponent = plantSVGMap[type] || SproutSVG;
  const glowColor = plantConfig[type]?.glowColor || color;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay }}
      style={{ width: size, height: size }}
      className='relative flex items-center justify-center'
    >
      {/* Soft glow */}
      <div className='absolute inset-[-4px] rounded-2xl opacity-25 blur-lg' style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }} />
      {/* Plant SVG */}
      <PlantComponent size={size} color={color} />
      {/* Floating sparkle particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-1 h-1 rounded-full'
          style={{ background: glowColor, left: `${25 + i * 25}%`, top: `${20 + (i % 2) * 15}%` }}
          animate={{ y: [-3, -12, -3], opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: delay + i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  );
}

export default function GardenScreen() {
  const {
    setCurrentScreen, streak, gardenPlants, gardenLevel, arabicFont,
    streakFreezesLeft, totalAllTime, streakDays, selectedTree, setSelectedTree,
  } = useDhikrStore();

  const fontClass = getFontClass(arabicFont);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const gardenName = gardenNames[Math.min(gardenLevel, gardenNames.length - 1)];

  const plantCounts: Record<string, number> = {};
  gardenPlants.forEach(p => { plantCounts[p.type] = (plantCounts[p.type] || 0) + 1; });

  const unlockedTypes = Object.entries(plantConfig).filter(([, cfg]) => streak >= cfg.unlockDay);
  const lockedTypes = Object.entries(plantConfig).filter(([, cfg]) => streak < cfg.unlockDay);

  // Recent 7 days streak visualization
  const recentDays = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayData = streakDays.find(s => s.date === dateStr);
    return { date: dateStr, dayName: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][d.getDay()], count: dayData?.count || 0 };
  });

  // Check if today has activity
  const todayActive = streakDays.some(s => s.date === new Date().toDateString());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col min-h-screen pb-24'>
      {/* Header */}
      <header className='px-4 pt-4 pb-3'>
        <div className='flex items-center gap-2.5 mb-1'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
            <Trees className='w-5 h-5' style={{ color: 'var(--gold-accent)' }} />
          </div>
          <div>
            <h1 className='text-2xl font-bold app-text' style={{ fontFamily: fontClass }}>حديقتي الروحانية</h1>
            <p className='app-text-2 text-xs'>{gardenName} — المستوى {gardenLevel}</p>
          </div>
        </div>
      </header>

      <main className='flex-1 px-4 space-y-4'>
        {/* Streak Fire Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className='glass-glow rounded-2xl p-5 relative overflow-hidden'
        >
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10 text-center'>
            {/* Fire animation */}
            <div className='flex items-center justify-center mb-3'>
              <motion.div
                animate={streak > 0 ? { scale: [1, 1.15, 1], rotate: [-2, 2, -2] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className='relative'
              >
                <Flame className='w-14 h-14' style={{ color: streak > 0 ? (streak >= 7 ? '#ef4444' : streak >= 3 ? '#f97316' : '#fbbf24') : '#4b5563', filter: streak > 0 ? 'drop-shadow(0 0 12px rgba(239,68,68,0.5))' : 'none' }} />
                {streak > 0 && (
                  <motion.div
                    className='absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white'
                    style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-bright))' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {streak}
                  </motion.div>
                )}
              </motion.div>
            </div>
            <h2 className='text-3xl font-bold app-text mb-1' style={{ fontFamily: fontClass }}>
              {streak > 0 ? `${streak} يوم متتالي` : 'ابدأ سلسلتك اليوم'}
            </h2>
            <p className='app-text-2 text-sm mb-3'>{streak >= 7 ? 'ما شاء الله! سلسلة قوية' : streak >= 3 ? 'أحسنت! استمر' : streak > 0 ? 'بداية ممتازة' : 'أكمل أذكار اليوم لتبدأ'}</p>
            <div className='flex items-center justify-center gap-4'>
              <div className='flex items-center gap-1.5'>
                <Droplets className='w-3.5 h-3.5' style={{ color: '#60a5fa' }} />
                <span className='app-text-2 text-xs'>{streakFreezesLeft} تجميد متبقي</span>
              </div>
              <div className='w-px h-4' style={{ background: 'var(--gold-border)' }} />
              <div className='flex items-center gap-1.5'>
                <Star className='w-3.5 h-3.5' style={{ color: 'var(--gold-accent)' }} />
                <span className='app-text-2 text-xs'>{gardenPlants.length} نبات</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Week Streak Dots */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Flame className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>نشاط الأسبوع</span>
          </div>
          <div className='flex justify-between'>
            {recentDays.map((day, i) => (
              <div key={i} className='flex flex-col items-center gap-1.5'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className='w-9 h-9 rounded-xl flex items-center justify-center'
                  style={{
                    background: day.count > 0
                      ? `linear-gradient(135deg, ${streak >= 7 ? '#ef4444' : '#f97316'}, ${streak >= 7 ? '#f97316' : '#fbbf24'})`
                      : 'var(--app-ring-track)',
                    boxShadow: day.count > 0 ? `0 0 12px ${streak >= 7 ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)'}` : 'none',
                  }}
                >
                  {day.count > 0 && <Flame className='w-4 h-4 text-white' />}
                </motion.div>
                <span className={`text-[9px] ${i === 6 ? 'app-text font-medium' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{day.dayName}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-glow rounded-2xl p-4 relative overflow-hidden'>
          <div className='islamic-shimmer absolute inset-0 pointer-events-none' />
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-2'>
              <div className='flex items-center gap-2'>
                <Trees className='w-4 h-4 text-emerald-500' />
                <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>شجري</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <span className='text-[10px] app-text-muted'>{treeConfigs[selectedTree]?.label || ''}</span>
                <div className='w-12 rounded-full h-1.5' style={{ background: 'var(--app-ring-track)' }}>
                  <div className='h-1.5 rounded-full bg-emerald-500' style={{ width: `${Math.min(gardenLevel * 10, 100)}%` }} />
                </div>
              </div>
            </div>
            <div className='flex justify-center py-2'>
              <TreeVisualization treeType={selectedTree} level={gardenLevel} size={180} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Sparkles className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>اختر شجرتك</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {Object.entries(treeConfigs).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSelectedTree(key)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${selectedTree === key ? '' : 'app-surface app-surface-h'}`}
                style={selectedTree === key
                  ? { background: `${cfg.color}15`, border: `1px solid ${cfg.color}40` }
                  : { border: '1px solid transparent' }
                }
              >
                <div className='relative' style={{ width: 36, height: 36 }}>
                  <TreeVisualization treeType={key} level={gardenLevel} size={36} />
                  {selectedTree === key && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className='absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center'
                      style={{ background: cfg.color }}
                    >
                      <Check className='w-2.5 h-2.5 text-white' />
                    </motion.div>
                  )}
                </div>
                <span className={`text-[10px] ${selectedTree === key ? 'app-text' : 'app-text-muted'}`} style={{ fontFamily: fontClass }}>{cfg.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Garden Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <Flower2 className='w-4 h-4 text-emerald-500' />
              <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>نباتاتي ({gardenPlants.length})</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-12 rounded-full h-1.5' style={{ background: 'var(--app-ring-track)' }}>
                <div className='h-1.5 rounded-full bg-emerald-500' style={{ width: `${Math.min(gardenLevel * 10, 100)}%` }} />
              </div>
              <span className='text-[10px] app-text-muted'>مستوى {gardenLevel}</span>
            </div>
          </div>

          {gardenPlants.length === 0 ? (
            <div className='text-center py-8'>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <IslamicIcon name='circle-dot' className='w-12 h-12 mx-auto mb-3 app-text-muted' color='#4b5563' />
              </motion.div>
              <p className='app-text-2 text-sm mb-1' style={{ fontFamily: fontClass }}>حديقتك فارغة</p>
              <p className='app-text-muted text-xs'>أكمل أذكار اليوم لتحصل على أول نبتة</p>
            </div>
          ) : (
            <div className='grid grid-cols-4 gap-2.5'>
              {gardenPlants.map((plant, i) => {
                const cfg = plantConfig[plant.type] || plantConfig.seed;
                return (
                  <motion.button
                    key={plant.id}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: i * 0.03 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfo(showInfo === plant.id ? null : plant.id)}
                    className='flex flex-col items-center gap-1 p-2.5 rounded-2xl app-surface-h transition-colors relative'
                  >
                    <GardenPlantSVG type={plant.type} size={cfg.size * 0.85} color={cfg.color} delay={i * 0.03} />
                    <span className='text-[9px] app-text-2' style={{ fontFamily: fontClass }}>{cfg.label}</span>
                    {showInfo === plant.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg glass-card text-[9px] app-text whitespace-nowrap z-20'
                      >
                        يوم {plant.dayEarned}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Unlocked Plants Preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-center gap-2 mb-3'>
            <Sparkles className='w-4 h-4' style={{ color: 'var(--gold-accent)' }} />
            <span className='app-text font-medium text-sm' style={{ fontFamily: fontClass }}>النباتات المتاحة</span>
          </div>
          <div className='flex gap-3.5 overflow-x-auto pb-2 scrollbar-hide'>
            {unlockedTypes.map(([type, cfg]) => {
              const PlantPreview = plantSVGMap[type];
              return (
                <div key={type} className='flex flex-col items-center gap-1 flex-shrink-0'>
                  <div className='rounded-2xl flex items-center justify-center p-1' style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}25` }}>
                    {PlantPreview ? <PlantPreview size={44} color={cfg.color} /> : <IslamicIcon name='leaf' className='w-6 h-6' color={cfg.color} />}
                  </div>
                  <span className='text-[9px] app-text-2'>{cfg.label}</span>
                  {plantCounts[type] ? (
                    <span className='text-[8px] px-1.5 rounded-full font-medium' style={{ background: `${cfg.color}20`, color: cfg.color }}>{plantCounts[type]}</span>
                  ) : null}
                </div>
              );
            })}
            {lockedTypes.map(([type, cfg]) => (
              <div key={type} className='flex flex-col items-center gap-1 flex-shrink-0 opacity-40'>
                <div className='w-12 h-12 rounded-2xl flex items-center justify-center app-surface'>
                  <Lock className='w-5 h-5 app-text-muted' />
                </div>
                <span className='text-[9px] app-text-muted'>{cfg.label}</span>
                <span className='text-[8px] app-text-muted'>{cfg.unlockDay} يوم</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Motivational Tip */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className='glass-card rounded-2xl p-4'>
          <div className='flex items-start gap-3'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0' style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-border)' }}>
              <Leaf className='w-4 h-4 text-emerald-500' />
            </div>
            <div>
              <h4 className='app-text font-medium text-sm mb-1' style={{ fontFamily: fontClass }}>كيف تنمي حديقتك؟</h4>
              <p className='app-text-2 text-xs leading-relaxed'>
                أكمل أذكار الصباح والمساء كل يوم لتحافظ على سلسلتك. كل 3 أيام متتالية تحصل على نبتة جديدة. كلما طالت سلسلتك، حصلت على نباتات أجمل!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}