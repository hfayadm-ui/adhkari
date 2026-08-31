'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TreeVizProps {
  treeType: string;
  level: number; // 0-10
  size?: number;
}

type TreeStage = {
  trunk: number;
  canopy: number;
  fruits: number;
  flowers: number;
  color: string;
  trunkColor: string;
  fruitColor: string;
  flowerColor: string;
  label: string;
  lightColor2: string;
  lightColor3: string;
};

export const treeConfigs: Record<string, TreeStage> = {
  olive:   { trunk: 0.3, canopy: 0.5, fruits: 0, flowers: 0, color: '#4ade80', trunkColor: '#78716c', fruitColor: '#1a1a1a', flowerColor: '#fbbf24', label: 'زيتونة', lightColor2: '#86efac', lightColor3: '#fde68a' },
  palm:    { trunk: 0.5, canopy: 0.6, fruits: 0, flowers: 0, color: '#22c55e', trunkColor: '#a16207', fruitColor: '#d97706', flowerColor: '#fde047', label: 'نخلة', lightColor2: '#fbbf24', lightColor3: '#a3e635' },
  cedar:   { trunk: 0.4, canopy: 0.7, fruits: 0, flowers: 0, color: '#16a34a', trunkColor: '#57534e', fruitColor: '#166534', flowerColor: '#86efac', label: 'أرز', lightColor2: '#6ee7b7', lightColor3: '#c4b5fd' },
  pomegranate: { trunk: 0.25, canopy: 0.55, fruits: 0, flowers: 0, color: '#f43f5e', trunkColor: '#78716c', fruitColor: '#dc2626', flowerColor: '#fb7185', label: 'رمان', lightColor2: '#fda4af', lightColor3: '#fbbf24' },
  sidrah:  { trunk: 0.35, canopy: 0.6, fruits: 0, flowers: 0, color: '#10b981', trunkColor: '#92400e', fruitColor: '#fbbf24', flowerColor: '#a78bfa', label: 'سدرة', lightColor2: '#c084fc', lightColor3: '#fde68a' },
  willow:  { trunk: 0.3, canopy: 0.65, fruits: 0, flowers: 0, color: '#34d399', trunkColor: '#6b7280', fruitColor: '#6ee7b7', flowerColor: '#a7f3d0', label: 'صفصاف', lightColor2: '#5eead4', lightColor3: '#f0abfc' },
};

/* =============================================
   Helper: darken/lighten hex color
   ============================================= */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

/* =============================================
   Ground / Soil Component
   ============================================= */
function Ground({ s, color, growth }: { s: number; color: string; growth: number }) {
  if (growth < 0.05) return null;
  const w = s * 0.5 * Math.min(growth * 2, 1);
  return (
    <ellipse cx={s / 2} cy={s * 0.93} rx={w} ry={s * 0.035}
      fill={`url(#groundGrad-${color.replace('#', '')})`} opacity={Math.min(growth * 2, 0.6)} />
  );
}

/* =============================================
   Olive Tree — detailed with branches & leaves
   ============================================= */
function OliveTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.8, 0.8);
  const hasFruits = growth >= 0.5;
  const hasFlowers = growth >= 0.3 && growth < 0.5;
  const canopyY = s * 0.92 - trunkH;
  const branchLen = canopyR * 0.4;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`og-${s}`} cx='50%' cy='40%'>
          <stop offset='0%' stopColor={adjustColor(cfg.color, 40)} />
          <stop offset='60%' stopColor={cfg.color} />
          <stop offset='100%' stopColor={adjustColor(cfg.color, -30)} />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk with texture */}
      <path
        d={`M${s/2-3} ${s*0.92} Q${s/2-7} ${s*0.92-trunkH*0.4} ${s/2-5} ${s*0.92-trunkH*0.7} Q${s/2-3} ${canopyY+4} ${s/2-2} ${canopyY} Q${s/2} ${canopyY-6} ${s/2+2} ${canopyY} Q${s/2+3} ${canopyY+4} ${s/2+5} ${s*0.92-trunkH*0.7} Q${s/2+7} ${s*0.92-trunkH*0.4} ${s/2+3} ${s*0.92}`}
        fill={cfg.trunkColor}
      />
      {/* Trunk highlight */}
      <path
        d={`M${s/2-1} ${s*0.9} Q${s/2-3} ${s*0.92-trunkH*0.4} ${s/2-2} ${canopyY+8}`}
        stroke={adjustColor(cfg.trunkColor, 30)} strokeWidth='1.5' fill='none' opacity='0.5'
      />

      {/* Branches */}
      {growth >= 0.3 && <>
        <path d={`M${s/2-2} ${canopyY+trunkH*0.15} Q${s/2-branchLen*0.6} ${canopyY+trunkH*0.1} ${s/2-branchLen} ${canopyY+trunkH*0.05}`} stroke={cfg.trunkColor} strokeWidth='2' fill='none' strokeLinecap='round' />
        <path d={`M${s/2+2} ${canopyY+trunkH*0.2} Q${s/2+branchLen*0.5} ${canopyY+trunkH*0.12} ${s/2+branchLen*0.8} ${canopyY+trunkH*0.08}`} stroke={cfg.trunkColor} strokeWidth='1.5' fill='none' strokeLinecap='round' />
      </>}

      {/* Canopy — layered circles with gradient */}
      <circle cx={s/2-canopyR*0.25} cy={canopyY-canopyR*0.15} r={canopyR*0.72} fill={`url(#og-${s})`} opacity='0.85' />
      <circle cx={s/2+canopyR*0.3} cy={canopyY-canopyR*0.1} r={canopyR*0.68} fill={`url(#og-${s})`} opacity='0.9' />
      <circle cx={s/2} cy={canopyY-canopyR*0.35} r={canopyR*0.62} fill={`url(#og-${s})`} opacity='0.95' />
      <circle cx={s/2-canopyR*0.1} cy={canopyY-canopyR*0.25} r={canopyR*0.55} fill={cfg.color} />
      <circle cx={s/2+canopyR*0.15} cy={canopyY-canopyR*0.3} r={canopyR*0.5} fill={cfg.color} opacity='0.9' />
      {/* Canopy highlight */}
      <circle cx={s/2-canopyR*0.1} cy={canopyY-canopyR*0.45} r={canopyR*0.3} fill='white' opacity='0.08' />

      {/* Fruits */}
      {hasFruits && [...Array(Math.floor(growth * 10))].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + 0.3;
        const r = canopyR * (0.25 + (i % 3) * 0.15);
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (canopyY - canopyR * 0.25) + Math.sin(angle) * r * 0.65;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={s * 0.016} fill={cfg.fruitColor} opacity='0.85' />
            <circle cx={cx - 1} cy={cy - 1} r={s * 0.006} fill='white' opacity='0.3' />
          </g>
        );
      })}

      {/* Flowers */}
      {hasFlowers && [...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const r = canopyR * 0.45;
        return (
          <g key={i} transform={`translate(${s/2 + Math.cos(angle)*r},${(canopyY-canopyR*0.25)+Math.sin(angle)*r*0.6})`}>
            {[0,1,2,3,4].map(p => (
              <circle key={p} cx={Math.cos(p*1.256)*s*0.01} cy={Math.sin(p*1.256)*s*0.01} r={s*0.005} fill={cfg.flowerColor} opacity='0.8' />
            ))}
            <circle r={s*0.004} fill='#fbbf24' />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   Palm Tree — curved trunk with detailed fronds
   ============================================= */
function PalmTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const leafLen = s * 0.28 * Math.min(growth, 1);
  const hasFruits = growth >= 0.6;
  const topY = s * 0.92 - trunkH;
  const curve = 6 * Math.min(growth, 1);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <linearGradient id={`pg-${s}`} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor={adjustColor(cfg.trunkColor, -15)} />
          <stop offset='50%' stopColor={cfg.trunkColor} />
          <stop offset='100%' stopColor={adjustColor(cfg.trunkColor, -20)} />
        </linearGradient>
      </defs>

      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk — curved with segments */}
      <path
        d={`M${s/2-2} ${s*0.92} C${s/2+curve*0.5} ${s*0.92-trunkH*0.3} ${s/2+curve*0.8} ${s*0.92-trunkH*0.6} ${s/2+curve*0.6} ${topY}`}
        stroke={`url(#pg-${s})`} strokeWidth={s * 0.032} fill='none' strokeLinecap='round'
      />
      {/* Trunk segment lines */}
      {[...Array(Math.floor(growth * 8) + 1)].map((_, i) => {
        const t = (i + 1) / 9;
        const x = (s/2-2) + (curve*0.8) * t;
        const y = s*0.92 - trunkH * t;
        return <line key={i} x1={x - s*0.015} y1={y} x2={x + s*0.015} y2={y} stroke={adjustColor(cfg.trunkColor, -25)} strokeWidth='0.8' opacity='0.4' />;
      })}

      {/* Coconuts / fruits at top */}
      {hasFruits && <>
        <circle cx={s/2+curve*0.6-3} cy={topY+5} r={s*0.016} fill={cfg.fruitColor} />
        <circle cx={s/2+curve*0.6+3} cy={topY+6} r={s*0.014} fill={cfg.fruitColor} opacity='0.9' />
        <circle cx={s/2+curve*0.6} cy={topY+8} r={s*0.015} fill={adjustColor(cfg.fruitColor, -15)} />
      </>}

      {/* Palm fronds — detailed with midrib */}
      {[...Array(Math.min(Math.floor(growth * 7) + 1, 7))].map((_, i) => {
        const angle = -Math.PI/2 + (i - 3) * 0.5;
        const tipX = (s/2+curve*0.6) + Math.cos(angle) * leafLen;
        const tipY = topY + Math.sin(angle) * leafLen;
        const droop = 0.15 + (i % 2) * 0.1;
        const cp1x = (s/2+curve*0.6) + Math.cos(angle + 0.25) * leafLen * 0.55;
        const cp1y = topY + Math.sin(angle + 0.25) * leafLen * 0.55 - leafLen * 0.15;
        const cp2x = (s/2+curve*0.6) + Math.cos(angle - droop) * leafLen * 0.65;
        const cp2y = topY + Math.sin(angle - droop) * leafLen * 0.65 + leafLen * 0.1;
        const midX = (s/2+curve*0.6) + Math.cos(angle - 0.05) * leafLen * 0.5;
        const midY = topY + Math.sin(angle - 0.05) * leafLen * 0.5 - leafLen * 0.05;
        return (
          <g key={i}>
            {/* Leaf shape */}
            <path
              d={`M${s/2+curve*0.6} ${topY} Q${cp1x} ${cp1y} ${tipX} ${tipY} Q${cp2x} ${cp2y} ${s/2+curve*0.6} ${topY}`}
              fill={cfg.color} opacity={0.6 + i * 0.05}
            />
            {/* Midrib */}
            <line x1={s/2+curve*0.6} y1={topY} x2={midX} y2={midY} stroke={adjustColor(cfg.color, -20)} strokeWidth='0.8' opacity='0.5' />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   Pomegranate Tree — with red blossoms
   ============================================= */
function PomegranateTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.7, 0.7);
  const canopyY = s * 0.92 - trunkH;
  const hasFruits = growth >= 0.5;
  const hasFlowers = growth >= 0.3;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`pm-${s}`} cx='50%' cy='35%'>
          <stop offset='0%' stopColor={adjustColor(cfg.color, 20)} />
          <stop offset='100%' stopColor={adjustColor(cfg.color, -20)} />
        </radialGradient>
      </defs>

      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk — slightly gnarled */}
      <path d={`M${s/2-2} ${s*0.92} Q${s/2-4} ${s*0.92-trunkH*0.5} ${s/2-1} ${canopyY+4} Q${s/2+1} ${canopyY} ${s/2+2} ${canopyY+4} Q${s/2+4} ${s*0.92-trunkH*0.5} ${s/2+2} ${s*0.92}`} fill={cfg.trunkColor} />

      {/* Canopy */}
      <circle cx={s/2} cy={canopyY-canopyR*0.25} r={canopyR*0.9} fill={`url(#pm-${s})`} opacity='0.8' />
      <circle cx={s/2-canopyR*0.3} cy={canopyY-canopyR*0.1} r={canopyR*0.7} fill={`url(#pm-${s})`} opacity='0.85' />
      <circle cx={s/2+canopyR*0.25} cy={canopyY-canopyR*0.2} r={canopyR*0.75} fill={cfg.color} opacity='0.9' />
      <circle cx={s/2} cy={canopyY-canopyR*0.4} r={canopyR*0.45} fill={cfg.color} opacity='0.95' />

      {/* Red flowers */}
      {hasFlowers && [...Array(Math.floor(growth * 6))].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.5;
        const r = canopyR * (0.4 + (i % 2) * 0.2);
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (canopyY-canopyR*0.2) + Math.sin(angle) * r * 0.6;
        return (
          <g key={i}>
            {[0,1,2,3,4,5].map(p => (
              <ellipse key={p} cx={cx + Math.cos(p*1.047)*s*0.008} cy={cy + Math.sin(p*1.047)*s*0.008} rx={s*0.006} ry={s*0.004} fill={cfg.flowerColor} opacity='0.85' transform={`rotate(${p*30},${cx},${cy})`} />
            ))}
            <circle cx={cx} cy={cy} r={s*0.004} fill='#fbbf24' />
          </g>
        );
      })}

      {/* Pomegranate fruits */}
      {hasFruits && [...Array(Math.floor(growth * 5))].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 + 1;
        const r = canopyR * 0.5;
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (canopyY-canopyR*0.2) + Math.sin(angle) * r * 0.55;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={s*0.02} fill={cfg.fruitColor} />
            <circle cx={cx-1} cy={cy-1.5} r={s*0.005} fill='#fca5a5' opacity='0.5' />
            {/* Crown */}
            <path d={`M${cx-3} ${cy-s*0.02} L${cx} ${cy-s*0.026} L${cx+3} ${cy-s*0.02}`} stroke={cfg.fruitColor} strokeWidth='0.8' fill='none' />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   Cedar Tree — layered conifer triangles
   ============================================= */
function CedarTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.7, 0.7);
  const canopyY = s * 0.92 - trunkH;
  const layers = Math.min(Math.floor(growth * 5) + 1, 5);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <linearGradient id={`cd-${s}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={adjustColor(cfg.color, 20)} />
          <stop offset='100%' stopColor={adjustColor(cfg.color, -15)} />
        </linearGradient>
      </defs>

      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk */}
      <rect x={s/2-s*0.018} y={canopyY+canopyR*0.1} width={s*0.036} height={trunkH-canopyR*0.1} rx={s*0.008} fill={cfg.trunkColor} />

      {/* Conifer layers */}
      {[...Array(layers)].map((_, i) => {
        const w = canopyR * (1.3 - i * 0.18);
        const y = canopyY - i * canopyR * 0.3;
        const h = canopyR * 0.45;
        return (
          <g key={i}>
            <polygon
              points={`${s/2},${y-h} ${s/2-w/2},${y+w*0.05} ${s/2+w/2},${y+w*0.05}`}
              fill={`url(#cd-${s})`} opacity={0.75 + i * 0.05}
            />
            {/* Snow/highlight on edge */}
            <polygon
              points={`${s/2},${y-h} ${s/2-w*0.15},${y-h+h*0.4} ${s/2-w*0.05},${y-h+h*0.3}`}
              fill='white' opacity={0.06}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   Sidrah (Sidra) Tree — mystical with purple accents
   ============================================= */
function SidrahTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.7, 0.7);
  const canopyY = s * 0.92 - trunkH;
  const hasFruits = growth >= 0.5;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`sd-${s}`} cx='50%' cy='40%'>
          <stop offset='0%' stopColor={adjustColor(cfg.color, 30)} />
          <stop offset='70%' stopColor={cfg.color} />
          <stop offset='100%' stopColor={adjustColor(cfg.color, -25)} />
        </radialGradient>
      </defs>

      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk — mystical curved */}
      <path d={`M${s/2-3} ${s*0.92} Q${s/2-5} ${s*0.92-trunkH*0.5} ${s/2-2} ${s*0.92-trunkH*0.8} Q${s/2} ${canopyY-5} ${s/2+2} ${canopyY} Q${s/2+4} ${canopyY+3} ${s/2+3} ${s*0.92}`} fill={cfg.trunkColor} />

      {/* Canopy — wide spreading */}
      <circle cx={s/2-canopyR*0.35} cy={canopyY-canopyR*0.05} r={canopyR*0.65} fill={`url(#sd-${s})`} opacity='0.8' />
      <circle cx={s/2+canopyR*0.35} cy={canopyY-canopyR*0.05} r={canopyR*0.65} fill={`url(#sd-${s})`} opacity='0.8' />
      <circle cx={s/2} cy={canopyY-canopyR*0.3} r={canopyR*0.7} fill={`url(#sd-${s})`} opacity='0.9' />
      <circle cx={s/2} cy={canopyY-canopyR*0.1} r={canopyR*0.55} fill={cfg.color} />

      {/* Mystical purple fruits */}
      {hasFruits && [...Array(Math.floor(growth * 7))].map((_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const r = canopyR * (0.3 + (i % 3) * 0.15);
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (canopyY - canopyR * 0.15) + Math.sin(angle) * r * 0.55;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={s*0.014} fill={i % 2 === 0 ? cfg.fruitColor : cfg.flowerColor} opacity='0.85' />
            <circle cx={cx-0.5} cy={cy-0.5} r={s*0.005} fill='white' opacity='0.25' />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   Willow Tree — drooping branches
   ============================================= */
function WillowTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.7, 0.7);
  const canopyY = s * 0.92 - trunkH;
  const branchCount = Math.min(Math.floor(growth * 8) + 1, 8);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`wl-${s}`} cx='50%' cy='30%'>
          <stop offset='0%' stopColor={adjustColor(cfg.color, 25)} />
          <stop offset='100%' stopColor={adjustColor(cfg.color, -15)} />
        </radialGradient>
      </defs>

      <Ground s={s} color={cfg.color} growth={growth} />

      {/* Trunk */}
      <path d={`M${s/2-3} ${s*0.92} Q${s/2-4} ${s*0.92-trunkH*0.5} ${s/2-2} ${canopyY+5} Q${s/2} ${canopyY} ${s/2+2} ${canopyY+5} Q${s/2+4} ${s*0.92-trunkH*0.5} ${s/2+3} ${s*0.92}`} fill={cfg.trunkColor} />

      {/* Canopy dome */}
      <circle cx={s/2} cy={canopyY - canopyR * 0.2} r={canopyR * 0.6} fill={`url(#wl-${s})`} opacity='0.85' />
      <circle cx={s/2 - canopyR * 0.2} cy={canopyY - canopyR * 0.1} r={canopyR * 0.5} fill={cfg.color} opacity='0.8' />
      <circle cx={s/2 + canopyR * 0.2} cy={canopyY - canopyR * 0.1} r={canopyR * 0.5} fill={cfg.color} opacity='0.8' />

      {/* Drooping willow branches */}
      {branchCount > 2 && [...Array(branchCount)].map((_, i) => {
        const angle = (i / branchCount) * Math.PI - Math.PI * 0.05;
        const startX = s/2 + Math.cos(angle) * canopyR * 0.4;
        const startY = canopyY - canopyR * 0.1;
        const endX = startX + Math.cos(angle) * canopyR * 0.3 + (i % 2 ? 3 : -3);
        const endY = s * 0.88;
        const cpX = startX + (endX - startX) * 0.3 + (i % 2 ? 5 : -5);
        const cpY = startY + (endY - startY) * 0.2;
        return (
          <path key={i}
            d={`M${startX} ${startY} Q${cpX} ${cpY} ${endX} ${endY}`}
            stroke={cfg.color} strokeWidth='1.2' fill='none' opacity={0.4 + (i % 3) * 0.1}
            strokeLinecap='round'
          />
        );
      })}

      {/* Small leaves on branches */}
      {growth >= 0.4 && [...Array(Math.min(Math.floor(growth * 12), 12))].map((_, i) => {
        const t = (i + 1) / 13;
        const angle = (i / 12) * Math.PI;
        const bx = s/2 + Math.cos(angle) * canopyR * (0.3 + t * 0.3);
        const by = canopyY + t * (s * 0.88 - canopyY);
        return <circle key={i} cx={bx} cy={by} r={s * 0.008} fill={cfg.flowerColor} opacity='0.5' />;
      })}
    </svg>
  );
}

/* =============================================
   Magical Orbiting Lights — firefly-like particles
   ============================================= */
function OrbitingLights({ size, color, growth, cfg, count = 6 }: {
  size: number; color: string; growth: number; cfg: TreeStage; count?: number;
}) {
  if (growth < 0.15) return null;

  const actualCount = Math.min(Math.floor(growth * count) + 1, count);
  const baseRadius = size * 0.4;

  /* Generate deterministic but varied light configs */
  const lights = useMemo(() => {
    return [...Array(actualCount)].map((_, i) => {
      const colors = [color, cfg.lightColor2, cfg.lightColor3, '#fbbf24', '#ffffff'];
      return {
        duration: 5 + (i * 2.3) % 6,
        radiusX: baseRadius * (0.75 + (i % 4) * 0.12),
        radiusY: baseRadius * (0.45 + (i % 3) * 0.1),
        startAngle: (i / actualCount) * Math.PI * 2,
        particleSize: 2.5 + (i % 3) * 1.5,
        color: colors[i % colors.length],
        direction: i % 3 === 0 ? -1 : 1,
        wobble: 0.1 + (i % 4) * 0.05,
        pulseSpeed: 1.5 + (i % 3) * 0.8,
      };
    });
  }, [actualCount, baseRadius, color, cfg.lightColor2, cfg.lightColor3]);

  return (
    <>
      {lights.map((light, i) => (
        <motion.div
          key={i}
          className='absolute rounded-full pointer-events-none'
          style={{
            width: light.particleSize,
            height: light.particleSize,
            background: `radial-gradient(circle, white 0%, ${light.color} 40%, transparent 70%)`,
            boxShadow: `0 0 ${light.particleSize * 2}px ${light.color}, 0 0 ${light.particleSize * 5}px ${light.color}60, 0 0 ${light.particleSize * 8}px ${light.color}25`,
          }}
          animate={{
            x: light.direction === 1
              ? [
                  Math.cos(light.startAngle) * light.radiusX,
                  Math.cos(light.startAngle + Math.PI * 0.5) * light.radiusX,
                  Math.cos(light.startAngle + Math.PI) * light.radiusX,
                  Math.cos(light.startAngle + Math.PI * 1.5) * light.radiusX,
                  Math.cos(light.startAngle + Math.PI * 2) * light.radiusX,
                ]
              : [
                  Math.cos(light.startAngle) * light.radiusX,
                  Math.cos(light.startAngle - Math.PI * 0.5) * light.radiusX,
                  Math.cos(light.startAngle - Math.PI) * light.radiusX,
                  Math.cos(light.startAngle - Math.PI * 1.5) * light.radiusX,
                  Math.cos(light.startAngle - Math.PI * 2) * light.radiusX,
                ],
            y: [
              Math.sin(light.startAngle) * light.radiusY,
              Math.sin(light.startAngle + Math.PI * 0.5 * light.direction) * light.radiusY * (1 + light.wobble),
              Math.sin(light.startAngle + Math.PI) * light.radiusY,
              Math.sin(light.startAngle + Math.PI * 1.5 * light.direction) * light.radiusY * (1 - light.wobble),
              Math.sin(light.startAngle + Math.PI * 2) * light.radiusY,
            ],
            opacity: [0.3, 0.9, 0.5, 1, 0.3],
            scale: [0.6, 1.3, 0.8, 1.15, 0.6],
          }}
          transition={{
            duration: light.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
        />
      ))}
    </>
  );
}

/* =============================================
   Floating Sparkle Particles
   ============================================= */
function FloatingParticles({ size, color, growth }: { size: number; color: string; growth: number }) {
  if (growth < 0.3) return null;

  const particles = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      x: size * (0.15 + (i * 0.1) % 0.7),
      y: size * (0.1 + (i * 0.11) % 0.7),
      size: 1 + (i % 3),
      delay: i * 0.8,
      duration: 3 + (i % 4),
      drift: 5 + (i % 3) * 3,
    }));
  }, [size]);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className='absolute rounded-full pointer-events-none'
          style={{
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}80`,
          }}
          animate={{
            y: [p.y, p.y - p.drift, p.y - p.drift * 0.5, p.y],
            x: [p.x, p.x + p.drift * 0.5, p.x - p.drift * 0.3, p.x],
            opacity: [0, 0.7, 0.4, 0],
            scale: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </>
  );
}

/* =============================================
   Main Tree Visualization Component
   ============================================= */
export default function TreeVisualization({ treeType, level, size = 200 }: TreeVizProps) {
  const cfg = treeConfigs[treeType] || treeConfigs.olive;
  const growth = Math.min(level / 10, 1);
  const s = size;

  /* Deterministic sway based on treeType */
  const swayAmount = growth > 0.1 ? (1.5 + growth * 2) : 0;
  const swayDuration = 3.5 + (treeType === 'palm' ? 1.5 : treeType === 'willow' ? 1 : 0);
  const lightCount = level >= 7 ? 10 : level >= 4 ? 7 : level >= 2 ? 5 : 3;

  /* Render tree SVG based on type */
  const treeSVG = useMemo(() => {
    const props = { cfg, growth, s };
    switch (treeType) {
      case 'palm': return <PalmTree {...props} />;
      case 'olive': return <OliveTree {...props} />;
      case 'pomegranate': return <PomegranateTree {...props} />;
      case 'cedar': return <CedarTree {...props} />;
      case 'sidrah': return <SidrahTree {...props} />;
      case 'willow': return <WillowTree {...props} />;
      default: return <OliveTree {...props} />;
    }
  }, [treeType, cfg, growth, s]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      style={{ width: size, height: size }}
      className='relative flex items-center justify-center'
    >
      {/* Outer atmospheric glow */}
      <motion.div
        className='absolute rounded-full pointer-events-none'
        style={{
          inset: -size * 0.18,
          background: `radial-gradient(ellipse at 50% 45%, ${cfg.color}18, ${cfg.color}08 40%, transparent 65%)`,
        }}
        animate={growth > 0.2 ? {
          scale: [1, 1.12, 0.95, 1.08, 1],
          opacity: [0.4, 0.7, 0.5, 0.65, 0.4],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Second glow layer — colored aura */}
      {growth > 0.4 && (
        <motion.div
          className='absolute rounded-full pointer-events-none'
          style={{
            inset: -size * 0.08,
            background: `radial-gradient(ellipse at 50% 40%, ${cfg.lightColor2}12, transparent 60%)`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      )}

      {/* Swaying tree container — organic movement */}
      <motion.div
        className='relative'
        style={{ width: s, height: s, transformOrigin: '50% 95%' }}
        animate={swayAmount > 0 ? {
          rotate: [0, swayAmount, -swayAmount * 0.3, -swayAmount, swayAmount * 0.3, 0],
        } : {}}
        transition={{
          duration: swayDuration,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      >
        {/* Tree SVG */}
        {treeSVG}

        {/* Inner canopy glow — breathing */}
        {growth > 0.3 && (
          <motion.div
            className='absolute pointer-events-none rounded-full'
            style={{
              width: s * 0.45,
              height: s * 0.4,
              top: s * 0.08,
              left: s * 0.28,
              background: `radial-gradient(circle, ${cfg.color}25, transparent 65%)`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.3, 0.55, 0.2],
              scale: [0.95, 1.05, 1, 1.03, 0.95],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      {/* Orbiting magical lights */}
      <OrbitingLights size={s} color={cfg.color} growth={growth} cfg={cfg} count={lightCount} />

      {/* Floating sparkle particles */}
      <FloatingParticles size={s} color={cfg.color} growth={growth} />
    </motion.div>
  );
}

export type { TreeStage };
