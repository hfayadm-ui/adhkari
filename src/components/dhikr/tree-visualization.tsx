'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TreeVizProps {
  treeType: string;
  level: number; // 0-10
  size?: number;
}

type TreeStage = {
  color: string;
  trunkColor: string;
  fruitColor: string;
  flowerColor: string;
  label: string;
  lightColor2: string;
  lightColor3: string;
  /* Extra colors for the blob layers */
  colorLight: string;
  colorDark: string;
  colorMid: string;
};

export const treeConfigs: Record<string, TreeStage> = {
  olive: {
    color: '#4ade80', trunkColor: '#92714a', fruitColor: '#1a1a1a', flowerColor: '#fde68a',
    label: 'زيتونة', lightColor2: '#86efac', lightColor3: '#fde68a',
    colorLight: '#bbf7d0', colorMid: '#4ade80', colorDark: '#166534',
  },
  palm: {
    color: '#22c55e', trunkColor: '#a16207', fruitColor: '#d97706', flowerColor: '#fde047',
    label: 'نخلة', lightColor2: '#fbbf24', lightColor3: '#a3e635',
    colorLight: '#86efac', colorMid: '#22c55e', colorDark: '#14532d',
  },
  cedar: {
    color: '#16a34a', trunkColor: '#6b5a3e', fruitColor: '#166534', flowerColor: '#86efac',
    label: 'أرز', lightColor2: '#6ee7b7', lightColor3: '#c4b5fd',
    colorLight: '#6ee7b7', colorMid: '#16a34a', colorDark: '#052e16',
  },
  pomegranate: {
    color: '#f43f5e', trunkColor: '#92714a', fruitColor: '#dc2626', flowerColor: '#fda4af',
    label: 'رمان', lightColor2: '#fda4af', lightColor3: '#fbbf24',
    colorLight: '#fecdd3', colorMid: '#f43f5e', colorDark: '#881337',
  },
  sidrah: {
    color: '#10b981', trunkColor: '#78350f', fruitColor: '#fbbf24', flowerColor: '#c084fc',
    label: 'سدرة', lightColor2: '#c084fc', lightColor3: '#fde68a',
    colorLight: '#a7f3d0', colorMid: '#10b981', colorDark: '#064e3b',
  },
  willow: {
    color: '#34d399', trunkColor: '#7c6f5b', fruitColor: '#6ee7b7', flowerColor: '#a7f3d0',
    label: 'صفصاف', lightColor2: '#5eead4', lightColor3: '#f0abfc',
    colorLight: '#a7f3d0', colorMid: '#34d399', colorDark: '#065f46',
  },
};

/* =============================================
   Helper: lerp two hex colors
   ============================================= */
function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.replace('#', ''), 16);
  const pb = parseInt(b.replace('#', ''), 16);
  const r = Math.round(((pa >> 16) & 0xff) * (1 - t) + ((pb >> 16) & 0xff) * t);
  const g = Math.round(((pa >> 8) & 0xff) * (1 - t) + ((pb >> 8) & 0xff) * t);
  const bl = Math.round((pa & 0xff) * (1 - t) + (pb & 0xff) * t);
  return `rgb(${r},${g},${bl})`;
}

/* =============================================
   Ground Shadow — soft ellipse like in the ref
   ============================================= */
function GroundShadow({ s, color, growth }: { s: number; color: string; growth: number }) {
  const w = s * 0.35 * Math.min(growth * 2.5, 1);
  const opacity = Math.min(growth * 1.5, 0.35);
  if (w < 2) return null;
  return <ellipse cx={s / 2} cy={s * 0.91} rx={w} ry={s * 0.03} fill={color} opacity={opacity} />;
}

/* =============================================
   Trunk — thick with low-branch split, no stroke
   ============================================= */
function Trunk({ s, color, growth, splitH = 0.4, curve = 0 }: {
  s: number; color: string; growth: number; splitH?: number; curve?: number;
}) {
  const baseW = s * 0.045;
  const topW = s * 0.02;
  const h = s * 0.3 * Math.min(growth, 1);
  const baseY = s * 0.91;
  const branchY = baseY - h * splitH;
  const topY = baseY - h;
  const cx = s / 2 + curve;

  return (
    <g>
      {/* Main trunk */}
      <path
        d={`M${cx - baseW} ${baseY} Q${cx - baseW * 0.8} ${baseY - h * 0.5} ${cx - topW} ${topY + h * 0.15}
            Q${cx} ${topY - 2} ${cx + topW} ${topY + h * 0.15}
            Q${cx + baseW * 0.8} ${baseY - h * 0.5} ${cx + baseW} ${baseY}Z`}
        fill={color}
      />
      {/* Left branch */}
      {growth >= 0.3 && (
        <path
          d={`M${cx - baseW * 0.4} ${branchY}
              Q${cx - baseW * 2.5} ${branchY - h * 0.15} ${cx - baseW * 4} ${branchY - h * 0.1}
              L${cx - baseW * 3.5} ${branchY + topW * 0.8}
              Q${cx - baseW * 2} ${branchY + topW} ${cx} ${branchY + topW * 0.5}Z`}
          fill={color}
          opacity={0.95}
        />
      )}
      {/* Right branch */}
      {growth >= 0.3 && (
        <path
          d={`M${cx + baseW * 0.3} ${branchY - h * 0.05}
              Q${cx + baseW * 2.8} ${branchY - h * 0.2} ${cx + baseW * 4.5} ${branchY - h * 0.15}
              L${cx + baseW * 4} ${branchY + topW * 0.5}
              Q${cx + baseW * 2.2} ${branchY + topW * 0.8} ${cx + topW * 0.5} ${branchY + topW * 0.3}Z`}
          fill={color}
          opacity={0.9}
        />
      )}
    </g>
  );
}

/* =============================================
   Palm Trunk — curved thick trunk
   ============================================= */
function PalmTrunk({ s, color, growth }: { s: number; color: string; growth: number }) {
  const h = s * 0.42 * Math.min(growth, 1);
  const w = s * 0.035;
  const baseY = s * 0.91;
  const topY = baseY - h;
  const curve = s * 0.04 * Math.min(growth, 1);
  const cx = s / 2;

  return (
    <g>
      <path
        d={`M${cx - w} ${baseY}
            Q${cx - w * 0.8 + curve * 0.5} ${baseY - h * 0.5} ${cx - w * 0.5 + curve} ${topY}
            Q${cx + curve} ${topY - 4} ${cx + w * 0.5 + curve} ${topY}
            Q${cx + w * 0.8 + curve * 0.5} ${baseY - h * 0.5} ${cx + w} ${baseY}Z`}
        fill={color}
      />
      {/* Trunk segment lines */}
      {[...Array(Math.floor(growth * 6) + 1)].map((_, i) => {
        const t = (i + 1) / 7;
        const x = (cx - w) + (curve * 0.5) * t * 2;
        const y = baseY - h * t;
        return <line key={i} x1={x - w * 0.6} y1={y} x2={x + w * 0.6} y2={y} stroke={lerpColor(color, '#000000', 0.15)} strokeWidth='0.8' opacity='0.3' />;
      })}
    </g>
  );
}

/* =============================================
   Canopy Blob — the key style element
   A fluffy cloud-like cluster made of overlapping circles
   ============================================= */
function CanopyBlob({ s, cfg, growth, centerX, baseY, maxR, type = 'round' }: {
  s: number; cfg: TreeStage; growth: number;
  centerX: number; baseY: number; maxR: number; type?: 'round' | 'conifer' | 'willow' | 'palm';
}) {
  const r = maxR * Math.min(growth * 1.2, 1);
  if (r < 3) return null;

  /* Define blob positions for different types */
  const blobs: { x: number; y: number; r: number; layer: number }[] = [];

  if (type === 'palm') {
    /* Palm fronds as elongated blobs */
    const fronds = Math.min(Math.floor(growth * 7) + 1, 7);
    for (let i = 0; i < fronds; i++) {
      const angle = -Math.PI / 2 + (i - 3) * 0.5;
      const dist = r * 1.1;
      blobs.push({
        x: centerX + Math.cos(angle) * dist * 0.6,
        y: baseY + Math.sin(angle) * dist * 0.5,
        r: r * (0.35 + (i % 2) * 0.1),
        layer: 0,
      });
    }
    blobs.push({ x: centerX, y: baseY - r * 0.2, r: r * 0.4, layer: 0 });
  } else if (type === 'conifer') {
    /* Cedar layers */
    const layers = Math.min(Math.floor(growth * 4) + 1, 4);
    for (let i = 0; i < layers; i++) {
      const w = r * (1.2 - i * 0.15);
      const y = baseY - i * r * 0.35;
      blobs.push({ x: centerX, y: y, r: w, layer: 0 });
      blobs.push({ x: centerX - w * 0.3, y: y + w * 0.15, r: w * 0.7, layer: 0 });
      blobs.push({ x: centerX + w * 0.3, y: y + w * 0.15, r: w * 0.7, layer: 0 });
    }
  } else if (type === 'willow') {
    /* Willow dome + droop */
    blobs.push({ x: centerX, y: baseY - r * 0.3, r: r * 0.75, layer: 0 });
    blobs.push({ x: centerX - r * 0.4, y: baseY - r * 0.1, r: r * 0.6, layer: 0 });
    blobs.push({ x: centerX + r * 0.4, y: baseY - r * 0.1, r: r * 0.6, layer: 0 });
    blobs.push({ x: centerX - r * 0.2, y: baseY - r * 0.5, r: r * 0.5, layer: 1 });
    blobs.push({ x: centerX + r * 0.2, y: baseY - r * 0.45, r: r * 0.5, layer: 1 });
    blobs.push({ x: centerX, y: baseY - r * 0.55, r: r * 0.4, layer: 2 });
  } else {
    /* Round / puffy cloud canopy (olive, sidrah, pomegranate) */
    const spread = type === 'round' ? 1 : 0.85;
    /* Background layer — large masses */
    blobs.push({ x: centerX, y: baseY - r * 0.25, r: r * 0.85 * spread, layer: 0 });
    blobs.push({ x: centerX - r * 0.45, y: baseY - r * 0.1, r: r * 0.65 * spread, layer: 0 });
    blobs.push({ x: centerX + r * 0.45, y: baseY - r * 0.1, r: r * 0.65 * spread, layer: 0 });
    /* Middle layer — fill gaps */
    blobs.push({ x: centerX - r * 0.2, y: baseY - r * 0.45, r: r * 0.55, layer: 1 });
    blobs.push({ x: centerX + r * 0.2, y: baseY - r * 0.4, r: r * 0.55, layer: 1 });
    blobs.push({ x: centerX, y: baseY - r * 0.5, r: r * 0.5, layer: 1 });
    /* Top highlight layer */
    blobs.push({ x: centerX, y: baseY - r * 0.65, r: r * 0.4, layer: 2 });
    blobs.push({ x: centerX - r * 0.3, y: baseY - r * 0.35, r: r * 0.35, layer: 2 });
    blobs.push({ x: centerX + r * 0.25, y: baseY - r * 0.55, r: r * 0.3, layer: 2 });
  }

  const gradId = `blob-${cfg.label.replace(/[^a-z]/gi, '')}-${centerX}`;
  const gradIdLight = `blobL-${cfg.label.replace(/[^a-z]/gi, '')}-${centerX}`;

  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx='40%' cy='35%'>
          <stop offset='0%' stopColor={cfg.colorLight} />
          <stop offset='50%' stopColor={cfg.colorMid} />
          <stop offset='100%' stopColor={cfg.colorDark} />
        </radialGradient>
        <radialGradient id={gradIdLight} cx='35%' cy='30%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.6' />
          <stop offset='100%' stopColor={cfg.colorLight} stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* Layer 0: Base blobs */}
      {blobs.filter(b => b.layer === 0).map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#${gradId})`} />
      ))}
      {/* Layer 1: Mid-tone depth */}
      {blobs.filter(b => b.layer === 1).map((b, i) => (
        <circle key={`m${i}`} cx={b.x} cy={b.y} r={b.r} fill={cfg.colorMid} opacity='0.7' />
      ))}
      {/* Layer 2: Highlights */}
      {blobs.filter(b => b.layer === 2).map((b, i) => (
        <circle key={`h${i}`} cx={b.x} cy={b.y} r={b.r} fill={`url(#${gradIdLight})`} />
      ))}
      {/* Tiny sparkle highlights on surface */}
      {growth >= 0.4 && blobs.filter(b => b.layer === 0).slice(0, 3).map((b, i) => (
        <circle key={`s${i}`} cx={b.x - b.r * 0.2} cy={b.y - b.r * 0.25} r={b.r * 0.18} fill='white' opacity='0.15' />
      ))}
    </g>
  );
}

/* =============================================
   Fruits & Flowers — cute style
   ============================================= */
function Fruits({ s, cfg, growth, centerX, canopyY, canopyR }: {
  s: number; cfg: TreeStage; growth: number; centerX: number; canopyY: number; canopyR: number;
}) {
  if (growth < 0.5) return null;
  const count = Math.floor(growth * 8);
  return (
    <g>
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + 0.3;
        const r = canopyR * (0.25 + (i % 3) * 0.15);
        const cx = centerX + Math.cos(angle) * r;
        const cy = (canopyY - canopyR * 0.2) + Math.sin(angle) * r * 0.6;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={s * 0.018} fill={cfg.fruitColor} />
            <circle cx={cx - 1} cy={cy - 1.5} r={s * 0.006} fill='white' opacity='0.35' />
          </g>
        );
      })}
    </g>
  );
}

function Flowers({ s, cfg, growth, centerX, canopyY, canopyR }: {
  s: number; cfg: TreeStage; growth: number; centerX: number; canopyY: number; canopyR: number;
}) {
  if (growth < 0.3) return null;
  const count = Math.floor(growth * 6);
  return (
    <g>
      {[...Array(count)].map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + 0.5;
        const r = canopyR * (0.35 + (i % 2) * 0.2);
        const cx = centerX + Math.cos(angle) * r;
        const cy = (canopyY - canopyR * 0.15) + Math.sin(angle) * r * 0.55;
        return (
          <g key={i}>
            {[0, 1, 2, 3, 4].map(p => (
              <circle key={p} cx={cx + Math.cos(p * 1.256) * s * 0.009} cy={cy + Math.sin(p * 1.256) * s * 0.009}
                r={s * 0.006} fill={cfg.flowerColor} opacity='0.8' />
            ))}
            <circle cx={cx} cy={cy} r={s * 0.004} fill='#fbbf24' />
          </g>
        );
      })}
    </g>
  );
}

/* =============================================
   Falling Petals / Leaves
   ============================================= */
function FallingPetals({ s, color, growth, count = 8 }: { s: number; color: string; growth: number; count?: number }) {
  if (growth < 0.4) return null;
  const petals = useMemo(() => {
    return [...Array(count)].map((_, i) => {
      const seed = i * 137.508; // golden angle
      return {
        x: s * 0.15 + ((seed * 7.3) % (s * 0.7)),
        y: s * 0.55 + ((seed * 3.7) % (s * 0.38)),
        r: s * 0.008 + ((seed * 1.3) % (s * 0.008)),
        rot: ((seed * 2.1) % 360),
      };
    });
  }, [s, count]);

  return (
    <g>
      {petals.map((p, i) => (
        <motion.ellipse
          key={i}
          cx={p.x}
          cy={p.y}
          rx={p.r}
          ry={p.r * 0.6}
          fill={color}
          opacity={0.5 + (i % 3) * 0.15}
          animate={{
            y: [p.y, p.y - 8, p.y - 3, p.y],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
          transform={`rotate(${p.rot} ${p.x} ${p.y})`}
        />
      ))}
    </g>
  );
}

/* =============================================
   Willow Droop Branches
   ============================================= */
function WillowDroops({ s, color, growth, centerX, canopyY, canopyR }: {
  s: number; color: string; growth: number; centerX: number; canopyY: number; canopyR: number;
}) {
  if (growth < 0.3) return null;
  const count = Math.min(Math.floor(growth * 10) + 2, 12);
  return (
    <g>
      {[...Array(count)].map((_, i) => {
        const angle = ((i / count) * Math.PI) - 0.05;
        const startX = centerX + Math.cos(angle) * canopyR * 0.4;
        const startY = canopyY + canopyR * 0.05;
        const endX = startX + Math.cos(angle) * canopyR * 0.4 + (i % 2 ? 4 : -4);
        const endY = s * 0.87;
        return (
          <motion.path
            key={i}
            d={`M${startX} ${startY} Q${(startX + endX) / 2 + (i % 2 ? 6 : -6)} ${(startY + endY) * 0.45} ${endX} ${endY}`}
            stroke={color}
            strokeWidth={1.2 + (i % 3) * 0.4}
            fill='none'
            opacity={0.3 + (i % 3) * 0.12}
            strokeLinecap='round'
            animate={{
              d: [
                `M${startX} ${startY} Q${(startX + endX) / 2 + 6} ${(startY + endY) * 0.45} ${endX} ${endY}`,
                `M${startX} ${startY} Q${(startX + endX) / 2 - 6} ${(startY + endY) * 0.45} ${endX} ${endY}`,
                `M${startX} ${startY} Q${(startX + endX) / 2 + 6} ${(startY + endY) * 0.45} ${endX} ${endY}`,
              ],
            }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        );
      })}
    </g>
  );
}

/* =============================================
   Palm Fronds — cute blob-style
   ============================================= */
function PalmFronds({ s, cfg, growth, centerX, topY }: {
  s: number; cfg: TreeStage; growth: number; centerX: number; topY: number;
}) {
  const frondLen = s * 0.28 * Math.min(growth, 1);
  const frondCount = Math.min(Math.floor(growth * 7) + 1, 7);
  return (
    <g>
      {[...Array(frondCount)].map((_, i) => {
        const angle = -Math.PI / 2 + (i - 3) * 0.5;
        const tipX = centerX + Math.cos(angle) * frondLen;
        const tipY = topY + Math.sin(angle) * frondLen;
        const cpX = centerX + Math.cos(angle + 0.2) * frondLen * 0.6;
        const cpY = topY + Math.sin(angle + 0.2) * frondLen * 0.6 - frondLen * 0.15;
        const cp2X = centerX + Math.cos(angle - 0.2) * frondLen * 0.6;
        const cp2Y = topY + Math.sin(angle - 0.2) * frondLen * 0.6 + frondLen * 0.1;
        return (
          <path
            key={i}
            d={`M${centerX} ${topY} Q${cpX} ${cpY} ${tipX} ${tipY} Q${cp2X} ${cp2Y} ${centerX} ${topY}`}
            fill={cfg.colorMid} opacity={0.55 + i * 0.05}
          />
        );
      })}
      {/* Center tuft */}
      <circle cx={centerX} cy={topY} r={frondLen * 0.18} fill={cfg.colorMid} opacity='0.8' />
    </g>
  );
}

/* =============================================
   CEDAR TREE
   ============================================= */
function CedarTree({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const cx = s / 2;
  const trunkH = s * 0.2 * Math.min(growth, 1);
  const canopyR = s * 0.35 * Math.min(growth * 0.8, 0.8);
  const canopyY = s * 0.91 - trunkH;
  const layers = Math.min(Math.floor(growth * 4) + 1, 4);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <GroundShadow s={s} color={cfg.colorDark} growth={growth} />
      <Trunk s={s} color={cfg.trunkColor} growth={growth} />
      {/* Conifer layers with gradient */}
      <defs>
        <linearGradient id={`cdg-${s}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={cfg.colorLight} />
          <stop offset='100%' stopColor={cfg.colorDark} />
        </linearGradient>
      </defs>
      {[...Array(layers)].map((_, i) => {
        const w = canopyR * (1.3 - i * 0.18);
        const y = canopyY - i * canopyR * 0.32;
        return (
          <g key={i}>
            <polygon
              points={`${cx},${y - canopyR * 0.38} ${cx - w / 2},${y + w * 0.08} ${cx + w / 2},${y + w * 0.08}`}
              fill={`url(#cdg-${s})`} opacity={0.8 + i * 0.05}
            />
            {/* Snow/highlight edge */}
            <polygon
              points={`${cx},${y - canopyR * 0.38} ${cx - w * 0.12},${y - canopyR * 0.15} ${cx - w * 0.03},${y - canopyR * 0.22}`}
              fill='white' opacity='0.08'
            />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   PALM TREE
   ============================================= */
function PalmTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const trunkH = s * 0.42 * Math.min(growth, 1);
  const topY = s * 0.91 - trunkH;
  const cx = s / 2;
  const curve = s * 0.04 * Math.min(growth, 1);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <GroundShadow s={s} color={cfg.colorDark} growth={growth} />
      <PalmTrunk s={s} color={cfg.trunkColor} growth={growth} />
      <PalmFronds s={s} cfg={cfg} growth={growth} centerX={cx + curve} topY={topY} />
      {/* Coconuts */}
      {growth >= 0.6 && (
        <g>
          <circle cx={cx + curve - 3} cy={topY + 6} r={s * 0.017} fill={cfg.fruitColor} />
          <circle cx={cx + curve + 3} cy={topY + 7} r={s * 0.015} fill={cfg.fruitColor} opacity='0.9' />
          <circle cx={cx + curve} cy={topY + 9} r={s * 0.016} fill={lerpColor(cfg.fruitColor, '#000000', 0.1)} />
        </g>
      )}
      <FallingPetals s={s} color={cfg.flowerColor} growth={growth} count={5} />
    </svg>
  );
}

/* =============================================
   ROUND TREE — Olive, Sidrah, Pomegranate
   ============================================= */
function RoundTree({ s, cfg, growth, hasFruits = false }: {
  s: number; cfg: TreeStage; growth: number; hasFruits?: boolean;
}) {
  const cx = s / 2;
  const trunkH = s * 0.25 * Math.min(growth, 1);
  const canopyR = s * 0.35 * Math.min(growth * 0.85, 0.85);
  const canopyY = s * 0.91 - trunkH;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <GroundShadow s={s} color={cfg.colorDark} growth={growth} />
      <Trunk s={s} color={cfg.trunkColor} growth={growth} />
      <CanopyBlob s={s} cfg={cfg} growth={growth} centerX={cx} baseY={canopyY + canopyR * 0.2} maxR={canopyR} type='round' />
      {hasFruits && <Fruits s={s} cfg={cfg} growth={growth} centerX={cx} canopyY={canopyY} canopyR={canopyR} />}
      <Flowers s={s} cfg={cfg} growth={growth} centerX={cx} canopyY={canopyY} canopyR={canopyR} />
      <FallingPetals s={s} color={cfg.flowerColor} growth={growth} count={hasFruits ? 6 : 10} />
    </svg>
  );
}

/* =============================================
   WILLOW TREE
   ============================================= */
function WillowTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const cx = s / 2;
  const trunkH = s * 0.28 * Math.min(growth, 1);
  const canopyR = s * 0.33 * Math.min(growth * 0.85, 0.85);
  const canopyY = s * 0.91 - trunkH;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <GroundShadow s={s} color={cfg.colorDark} growth={growth} />
      <Trunk s={s} color={cfg.trunkColor} growth={growth} />
      <CanopyBlob s={s} cfg={cfg} growth={growth} centerX={cx} baseY={canopyY + canopyR * 0.2} maxR={canopyR} type='willow' />
      <WillowDroops s={s} color={cfg.colorMid} growth={growth} centerX={cx} canopyY={canopyY + canopyR * 0.1} canopyR={canopyR} />
      <FallingPetals s={s} color={cfg.flowerColor} growth={growth} count={10} />
    </svg>
  );
}

/* =============================================
   Orbiting Lights — magical firefly particles
   ============================================= */
function OrbitingLights({ size, color, growth, cfg, count = 6 }: {
  size: number; color: string; growth: number; cfg: TreeStage; count?: number;
}) {
  if (growth < 0.15) return null;

  const actualCount = Math.min(Math.floor(growth * count) + 1, count);
  const baseRadius = size * 0.4;

  const lights = useMemo(() => {
    const colors = [color, cfg.lightColor2, cfg.lightColor3, '#fbbf24', '#ffffff'];
    return [...Array(actualCount)].map((_, i) => ({
      duration: 5 + (i * 2.3) % 6,
      radiusX: baseRadius * (0.75 + (i % 4) * 0.12),
      radiusY: baseRadius * (0.45 + (i % 3) * 0.1),
      startAngle: (i / actualCount) * Math.PI * 2,
      particleSize: 2.5 + (i % 3) * 1.5,
      color: colors[i % colors.length],
      direction: i % 3 === 0 ? -1 : 1,
      wobble: 0.1 + (i % 4) * 0.05,
    }));
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
              ? [Math.cos(light.startAngle) * light.radiusX, Math.cos(light.startAngle + Math.PI * 0.5) * light.radiusX, Math.cos(light.startAngle + Math.PI) * light.radiusX, Math.cos(light.startAngle + Math.PI * 1.5) * light.radiusX, Math.cos(light.startAngle + Math.PI * 2) * light.radiusX]
              : [Math.cos(light.startAngle) * light.radiusX, Math.cos(light.startAngle - Math.PI * 0.5) * light.radiusX, Math.cos(light.startAngle - Math.PI) * light.radiusX, Math.cos(light.startAngle - Math.PI * 1.5) * light.radiusX, Math.cos(light.startAngle - Math.PI * 2) * light.radiusX],
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
          transition={{ duration: light.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
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
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </>
  );
}

/* =============================================
   MAIN TREE COMPONENT
   ============================================= */
export default function TreeVisualization({ treeType, level, size = 200 }: TreeVizProps) {
  const cfg = treeConfigs[treeType] || treeConfigs.olive;
  const growth = Math.min(level / 10, 1);
  const s = size;

  const swayAmount = growth > 0.1 ? (1.5 + growth * 2) : 0;
  const swayDuration = 3.5 + (treeType === 'palm' ? 1.5 : treeType === 'willow' ? 1 : 0);
  const lightCount = level >= 7 ? 10 : level >= 4 ? 7 : level >= 2 ? 5 : 3;

  const treeSVG = useMemo(() => {
    const props = { s, cfg, growth };
    switch (treeType) {
      case 'palm': return <PalmTreeSVG {...props} />;
      case 'cedar': return <CedarTree {...props} />;
      case 'pomegranate': return <RoundTree {...props} hasFruits />;
      case 'sidrah': return <RoundTree {...props} hasFruits />;
      case 'willow': return <WillowTreeSVG {...props} />;
      case 'olive':
      default: return <RoundTree {...props} hasFruits />;
    }
  }, [treeType, s, cfg, growth]);

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

      {/* Second glow layer */}
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

      {/* Swaying tree container */}
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
        {treeSVG}

        {/* Inner canopy breathing glow */}
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
