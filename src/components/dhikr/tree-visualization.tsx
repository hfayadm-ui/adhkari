'use client';

import { motion } from 'framer-motion';
import { useId, useMemo } from 'react';

interface TreeVizProps {
  treeType: string;
  level: number;
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
};

export const treeConfigs: Record<string, TreeStage> = {
  olive: {
    color: '#4ade80', trunkColor: '#8C6350', fruitColor: '#1a1a1a', flowerColor: '#fde68a',
    label: 'زيتونة', lightColor2: '#86efac', lightColor3: '#fde68a',
  },
  palm: {
    color: '#22c55e', trunkColor: '#a16207', fruitColor: '#d97706', flowerColor: '#fde047',
    label: 'نخلة', lightColor2: '#fbbf24', lightColor3: '#a3e635',
  },
  cedar: {
    color: '#16a34a', trunkColor: '#6b5a3e', fruitColor: '#166534', flowerColor: '#86efac',
    label: 'أرز', lightColor2: '#6ee7b7', lightColor3: '#c4b5fd',
  },
  pomegranate: {
    color: '#f43f5e', trunkColor: '#8C6350', fruitColor: '#dc2626', flowerColor: '#fda4af',
    label: 'رمان', lightColor2: '#fda4af', lightColor3: '#fbbf24',
  },
  sidrah: {
    color: '#10b981', trunkColor: '#78350f', fruitColor: '#fbbf24', flowerColor: '#c084fc',
    label: 'سدرة', lightColor2: '#c084fc', lightColor3: '#fde68a',
  },
  willow: {
    color: '#34d399', trunkColor: '#7c6f5b', fruitColor: '#6ee7b7', flowerColor: '#a7f3d0',
    label: 'صفصاف', lightColor2: '#5eead4', lightColor3: '#f0abfc',
  },
};

/* =============================================
   Color helpers
   ============================================= */
function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}
function lighten(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + amt, g + amt, b + amt);
}
function darken(hex: string, amt: number) {
  return lighten(hex, -amt);
}

/* Deterministic pseudo-random (same on server & client — no hydration drift) */
function seededRand(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Tone = 'light' | 'light2' | 'mid' | 'dark';
type Cluster = { dx: number; dy: number; r: number; tone: Tone };

/* =============================================
   GROUND — soft contact shadow, layered soil,
   pebbles, grass blades and tiny blossoms
   ============================================= */
function Ground({ cx, baseY, s, g, uid, flowerColor }: {
  cx: number; baseY: number; s: number; g: number; uid: string; flowerColor: string;
}) {
  const soilR = s * 0.16 * Math.max(g, 0.3);
  const rnd = seededRand(7);
  const grassColor = '#4c9a63';
  const grassCount = g > 0.3 ? 3 + Math.floor(g * 3) : 0;
  const blades = [];
  for (let i = 0; i < grassCount; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    blades.push({
      key: i,
      bx: cx + side * soilR * (0.4 + rnd() * 0.55),
      by: baseY - soilR * rnd() * 0.12,
      h: s * (0.02 + rnd() * 0.016) * Math.min(g * 1.6, 1),
      lean: (rnd() - 0.5) * s * 0.024,
    });
  }
  const flowers = g >= 0.65
    ? [
      { fx: cx - soilR * 0.92, fy: baseY + s * 0.006 },
      { fx: cx + soilR * 1.08, fy: baseY - s * 0.002 },
    ]
    : [];

  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-shd`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0f0a" stopOpacity="0.30" />
          <stop offset="60%" stopColor="#1a0f0a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1a0f0a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-soil`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7d5a44" />
          <stop offset="100%" stopColor="#503a2c" />
        </linearGradient>
      </defs>

      {/* soft contact shadow */}
      <ellipse cx={cx} cy={baseY + soilR * 0.26} rx={soilR * 1.5} ry={soilR * 0.42} fill={`url(#${uid}-shd)`} />
      {/* soil dome */}
      <path
        d={`M ${cx - soilR} ${baseY}
            Q ${cx - soilR * 0.55} ${baseY - soilR * 0.62} ${cx} ${baseY - soilR * 0.55}
            Q ${cx + soilR * 0.55} ${baseY - soilR * 0.62} ${cx + soilR} ${baseY} Z`}
        fill={`url(#${uid}-soil)`}
      />
      {/* soil top highlight */}
      <ellipse cx={cx - soilR * 0.15} cy={baseY - soilR * 0.30} rx={soilR * 0.6} ry={soilR * 0.18} fill="#8d6e63" opacity={0.5} />
      {/* pebbles */}
      <ellipse cx={cx - soilR * 0.55} cy={baseY + soilR * 0.16} rx={s * 0.011} ry={s * 0.007} fill="#a1887f" opacity={0.7} />
      <ellipse cx={cx + soilR * 0.6} cy={baseY + soilR * 0.08} rx={s * 0.008} ry={s * 0.005} fill="#8d6e63" opacity={0.7} />
      {/* grass blades */}
      {blades.map(b => (
        <path
          key={`gr${b.key}`}
          d={`M ${b.bx} ${b.by} Q ${b.bx + b.lean * 0.4} ${b.by - b.h * 0.6} ${b.bx + b.lean} ${b.by - b.h}`}
          stroke={grassColor} strokeWidth={s * 0.005} strokeLinecap="round" fill="none" opacity={0.85}
        />
      ))}
      {/* tiny blossoms on the ground */}
      {flowers.map((f, i) => (
        <g key={`fl${i}`}>
          <circle cx={f.fx} cy={f.fy} r={s * 0.007} fill={flowerColor} />
          <circle cx={f.fx} cy={f.fy} r={s * 0.0028} fill="#fff8e1" />
        </g>
      ))}
    </g>
  );
}

/* =============================================
   SPROUT (level 0-1) — gradient seedling
   ============================================= */
function Sprout({ cx, baseY, s, g, uid, color }: {
  cx: number; baseY: number; s: number; g: number; uid: string; color: string;
}) {
  const stemH = s * 0.13 * g;
  const topY = baseY - stemH;
  const ls = s * 0.055 * g;
  const light = lighten(color, 55);
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-lf`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path
        d={`M ${cx} ${baseY} Q ${cx + stemH * 0.06} ${baseY - stemH * 0.5} ${cx} ${topY}`}
        stroke={darken(color, 18)} strokeWidth={s * 0.009} strokeLinecap="round" fill="none"
      />
      <path
        d={`M ${cx} ${topY + ls * 0.2}
            Q ${cx - ls * 1.1} ${topY - ls * 0.9} ${cx - ls * 1.7} ${topY - ls * 0.1}
            Q ${cx - ls * 0.9} ${topY + ls * 0.55} ${cx} ${topY + ls * 0.2} Z`}
        fill={`url(#${uid}-lf)`}
      />
      <path
        d={`M ${cx} ${topY + ls * 0.15}
            Q ${cx + ls * 1.1} ${topY - ls * 1.05} ${cx + ls * 1.75} ${topY - ls * 0.15}
            Q ${cx + ls * 0.9} ${topY + ls * 0.6} ${cx} ${topY + ls * 0.15} Z`}
        fill={`url(#${uid}-lf)`}
      />
      <circle cx={cx} cy={topY - ls * 0.25} r={ls * 0.22} fill={light} />
    </g>
  );
}

/* =============================================
   Shared canopy shading defs (sphere-like tones)
   ============================================= */
function CanopyDefs({ uid, color }: { uid: string; color: string }) {
  return (
    <defs>
      <radialGradient id={`${uid}-gLight`} cx="32%" cy="28%" r="75%">
        <stop offset="0%" stopColor={lighten(color, 95)} />
        <stop offset="45%" stopColor={lighten(color, 45)} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <radialGradient id={`${uid}-gLight2`} cx="32%" cy="28%" r="75%">
        <stop offset="0%" stopColor={lighten(color, 75)} />
        <stop offset="50%" stopColor={lighten(color, 25)} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <radialGradient id={`${uid}-gMid`} cx="32%" cy="28%" r="75%">
        <stop offset="0%" stopColor={lighten(color, 50)} />
        <stop offset="55%" stopColor={color} />
        <stop offset="100%" stopColor={darken(color, 38)} />
      </radialGradient>
      <radialGradient id={`${uid}-gDark`} cx="32%" cy="28%" r="75%">
        <stop offset="0%" stopColor={darken(color, 5)} />
        <stop offset="60%" stopColor={darken(color, 35)} />
        <stop offset="100%" stopColor={darken(color, 62)} />
      </radialGradient>
      {/* bottom ambient occlusion */}
      <linearGradient id={`${uid}-ao`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={darken(color, 70)} stopOpacity="0" />
        <stop offset="100%" stopColor={darken(color, 70)} stopOpacity="0.4" />
      </linearGradient>
      {/* top-left specular */}
      <radialGradient id={`${uid}-spec`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function ClusterLayer({ c, cx, cy, R, uid }: {
  c: Cluster; cx: number; cy: number; R: number; uid: string;
}) {
  return (
    <circle
      cx={cx + c.dx * R} cy={cy + c.dy * R} r={c.r * R}
      fill={`url(#${uid}-${c.tone === 'light' ? 'gLight' : c.tone === 'light2' ? 'gLight2' : c.tone === 'mid' ? 'gMid' : 'gDark'})`}
    />
  );
}

/* =============================================
   ROUND TREE (Olive, Sidrah, Pomegranate)
   Cloud canopy of 9 gradient spheres in 4 depth
   tones + tapered trunk with root flare, branches
   and bark texture, AO, specular, shaded fruits
   ============================================= */
const ROUND_CANOPY: Cluster[] = [
  { dx: -0.62, dy: 0.10, r: 0.40, tone: 'dark' },
  { dx: 0.60, dy: 0.08, r: 0.42, tone: 'dark' },
  { dx: -0.02, dy: 0.30, r: 0.44, tone: 'dark' },
  { dx: -0.48, dy: -0.22, r: 0.42, tone: 'mid' },
  { dx: 0.46, dy: -0.24, r: 0.44, tone: 'mid' },
  { dx: 0.02, dy: -0.02, r: 0.52, tone: 'mid' },
  { dx: -0.22, dy: -0.38, r: 0.38, tone: 'light2' },
  { dx: 0.28, dy: -0.36, r: 0.36, tone: 'light2' },
  { dx: -0.02, dy: -0.50, r: 0.34, tone: 'light' },
];

const ROUND_FRUITS = [
  [-0.52, 0.18], [0.44, 0.14], [-0.08, 0.34],
  [0.18, 0.02], [-0.30, 0.02], [0.58, 0.38],
];
const ROUND_SPECKLES = [
  [-0.35, -0.30], [0.10, -0.45], [0.40, -0.15], [-0.55, 0.0], [0.25, -0.28],
];
const ROUND_BLOSSOMS = [
  [-0.15, -0.42], [0.30, -0.30], [-0.45, -0.10],
];

function RoundTree({ s, cfg, growth, uid, hasFruits }: {
  s: number; cfg: TreeStage; growth: number; uid: string; hasFruits?: boolean;
}) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <CanopyDefs uid={uid} color={cfg.color} />
        <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />
        <Sprout cx={cx} baseY={baseY - s * 0.012} s={s} g={g / 0.15} uid={uid} color={cfg.color} />
      </svg>
    );
  }

  const trunkH = s * (0.20 * g + 0.03);
  const trunkW = s * 0.032;
  const topW = s * 0.016;
  const canopyR = s * 0.30 * g;
  const trunkTopY = baseY - trunkH;
  const canopyCY = trunkTopY - canopyR * 0.38;
  const canopyCX = cx;

  const fruitCount = hasFruits && g >= 0.5 ? Math.min(ROUND_FRUITS.length, Math.max(3, Math.round(g * 6))) : 0;
  const fruitR = s * 0.017 * g;
  const showBlossoms = g >= 0.55;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <CanopyDefs uid={uid} color={cfg.color} />
      <defs>
        <linearGradient id={`${uid}-tg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 30)} />
          <stop offset="30%" stopColor={lighten(cfg.trunkColor, 10)} />
          <stop offset="60%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 40)} />
        </linearGradient>
        <radialGradient id={`${uid}-fr`} cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor={lighten(cfg.fruitColor, 70)} />
          <stop offset="45%" stopColor={cfg.fruitColor} />
          <stop offset="100%" stopColor={darken(cfg.fruitColor, 42)} />
        </radialGradient>
      </defs>

      <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />

      {/* Trunk: tapered with root flare */}
      <path
        d={`M ${cx - trunkW * 1.4} ${baseY + s * 0.004}
            C ${cx - trunkW * 0.9} ${baseY - trunkH * 0.35} ${cx - trunkW * 0.75} ${baseY - trunkH * 0.7} ${cx - topW * 1.1} ${baseY - trunkH}
            L ${cx + topW * 1.1} ${baseY - trunkH}
            C ${cx + trunkW * 0.75} ${baseY - trunkH * 0.7} ${cx + trunkW * 0.9} ${baseY - trunkH * 0.35} ${cx + trunkW * 1.3} ${baseY + s * 0.004} Z`}
        fill={`url(#${uid}-tg)`}
      />
      {/* Bark texture */}
      <path
        d={`M ${cx - trunkW * 0.15} ${baseY - trunkH * 0.15} Q ${cx - trunkW * 0.05} ${baseY - trunkH * 0.45} ${cx - trunkW * 0.2} ${baseY - trunkH * 0.78}`}
        stroke={darken(cfg.trunkColor, 32)} strokeWidth={s * 0.004} fill="none" opacity={0.35} strokeLinecap="round"
      />
      <path
        d={`M ${cx + trunkW * 0.25} ${baseY - trunkH * 0.2} Q ${cx + trunkW * 0.3} ${baseY - trunkH * 0.5} ${cx + trunkW * 0.1} ${baseY - trunkH * 0.82}`}
        stroke={darken(cfg.trunkColor, 32)} strokeWidth={s * 0.004} fill="none" opacity={0.3} strokeLinecap="round"
      />
      {/* Branches reaching into the canopy (drawn behind it) */}
      <path
        d={`M ${cx - topW * 0.4} ${baseY - trunkH * 0.92} Q ${cx - s * 0.05} ${baseY - trunkH * 1.08} ${cx - canopyR * 0.30} ${baseY - trunkH - canopyR * 0.15}`}
        stroke={darken(cfg.trunkColor, 10)} strokeWidth={topW * 1.1} fill="none" strokeLinecap="round"
      />
      <path
        d={`M ${cx + topW * 0.3} ${baseY - trunkH * 0.95} Q ${cx + s * 0.045} ${baseY - trunkH * 1.1} ${cx + canopyR * 0.26} ${baseY - trunkH - canopyR * 0.2}`}
        stroke={darken(cfg.trunkColor, 14)} strokeWidth={topW * 0.9} fill="none" strokeLinecap="round"
      />

      {/* Canopy: layered cloud of gradient spheres */}
      {ROUND_CANOPY.map((c, i) => (
        <ClusterLayer key={`c${i}`} c={c} cx={canopyCX} cy={canopyCY} R={canopyR} uid={uid} />
      ))}

      {/* Bottom ambient occlusion */}
      <ellipse
        cx={canopyCX} cy={canopyCY + canopyR * 0.45}
        rx={canopyR * 0.95} ry={canopyR * 0.5}
        fill={`url(#${uid}-ao)`}
      />
      {/* Top-left specular */}
      <circle
        cx={canopyCX - canopyR * 0.30} cy={canopyCY - canopyR * 0.42}
        r={canopyR * 0.42} fill={`url(#${uid}-spec)`}
      />
      {/* Leaf speckles */}
      {ROUND_SPECKLES.map((p, i) => (
        <circle key={`sp${i}`} cx={canopyCX + p[0] * canopyR} cy={canopyCY + p[1] * canopyR} r={s * 0.006} fill={lighten(cfg.color, 100)} opacity={0.35} />
      ))}
      {/* Blossoms */}
      {showBlossoms && ROUND_BLOSSOMS.map((p, i) => (
        <g key={`bl${i}`}>
          <circle cx={canopyCX + p[0] * canopyR} cy={canopyCY + p[1] * canopyR} r={s * 0.008} fill={cfg.flowerColor} />
          <circle cx={canopyCX + p[0] * canopyR} cy={canopyCY + p[1] * canopyR} r={s * 0.003} fill="#fff8e1" />
        </g>
      ))}
      {/* Fruits: shaded spheres with highlight */}
      {[...Array(fruitCount)].map((_, i) => {
        const fx = canopyCX + ROUND_FRUITS[i][0] * canopyR;
        const fy = canopyCY + ROUND_FRUITS[i][1] * canopyR;
        return (
          <g key={`f${i}`}>
            <path
              d={`M ${fx} ${fy - fruitR} Q ${fx + fruitR * 0.15} ${fy - fruitR * 1.9} ${fx + fruitR * 0.45} ${fy - fruitR * 2.1}`}
              stroke={darken(cfg.trunkColor, 15)} strokeWidth={s * 0.003} fill="none" strokeLinecap="round"
            />
            <circle cx={fx} cy={fy} r={fruitR} fill={`url(#${uid}-fr)`} />
            <circle cx={fx - fruitR * 0.32} cy={fy - fruitR * 0.38} r={fruitR * 0.28} fill="#ffffff" opacity={0.55} />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   PALM TREE — tapered curved trunk with ring
   texture, 9 serrated arching fronds in 3 depth
   tones, crown shaft + coconuts
   ============================================= */
function frondPath(p0x: number, p0y: number, angle: number, len: number, maxW: number, sag: number) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const cX = p0x + dx * len * 0.55;
  const cY = p0y + dy * len * 0.55 + sag * 0.45;
  const tX = p0x + dx * len;
  const tY = p0y + dy * len + sag;
  const N = 8;
  const q = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * p0x + 2 * u * t * cX + t * t * tX,
      y: u * u * p0y + 2 * u * t * cY + t * t * tY,
      dxr: 2 * u * (cX - p0x) + 2 * t * (tX - cX),
      dyr: 2 * u * (cY - p0y) + 2 * t * (tY - cY),
    };
  };
  const upX: number[] = [], upY: number[] = [], dnX: number[] = [], dnY: number[] = [];
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const p = q(t);
    const dl = Math.hypot(p.dxr, p.dyr) || 1;
    const ux = p.dyr / dl;
    const uy = -p.dxr / dl;
    const w = maxW * (t < 0.10 ? t / 0.10 : 1) * (1 - t * 0.92);
    const serr = i % 2 === 0 ? 1 : 0.45;
    upX.push(p.x + ux * w * serr);
    upY.push(p.y + uy * w * serr);
    dnX.push(p.x - ux * w * serr * 0.8);
    dnY.push(p.y - uy * w * serr * 0.8);
  }
  let d = `M ${p0x.toFixed(2)} ${p0y.toFixed(2)}`;
  for (let i = 0; i < N; i++) d += ` L ${upX[i].toFixed(2)} ${upY[i].toFixed(2)}`;
  for (let i = N - 2; i >= 0; i--) d += ` L ${dnX[i].toFixed(2)} ${dnY[i].toFixed(2)}`;
  return d + ' Z';
}

function PalmTreeSVG({ s, cfg, growth, uid }: { s: number; cfg: TreeStage; growth: number; uid: string }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <CanopyDefs uid={uid} color={cfg.color} />
        <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />
        <Sprout cx={cx} baseY={baseY - s * 0.012} s={s} g={g / 0.15} uid={uid} color={cfg.color} />
      </svg>
    );
  }

  const trunkH = s * 0.34 * g;
  const w0 = s * 0.024;
  const w1 = s * 0.010;
  const bend = s * 0.05 * g;
  const topX = cx + bend;
  const topY = baseY - trunkH;
  const midX = cx + bend * 0.5;
  const midY = baseY - trunkH * 0.55;

  const frondCount = Math.max(5, Math.round(4 + g * 5));
  const fronds = [];
  for (let k = 0; k < frondCount; k++) {
    const t = frondCount === 1 ? 0.5 : k / (frondCount - 1);
    const angle = (-168 + t * 156) * (Math.PI / 180);
    const len = s * 0.30 * g * (0.72 + 0.28 * Math.sin(Math.PI * t));
    const sag = len * (0.14 + 0.38 * Math.abs(Math.cos(angle)));
    fronds.push({ angle, len, sag, flat: Math.abs(Math.cos(angle)) });
  }
  /* most-horizontal fronds first (back layer, darker) */
  fronds.sort((a, b) => b.flat - a.flat);

  const ringCount = 5;
  const rings = [];
  for (let i = 1; i <= ringCount; i++) {
    const t = i / (ringCount + 1);
    const u = 1 - t;
    const px = u * u * cx + 2 * u * t * midX + t * t * topX;
    const py = u * u * baseY + 2 * u * t * midY + t * t * topY;
    rings.push({ px, py, hw: w0 + (w1 - w0) * t, key: i });
  }

  const hasCocos = g >= 0.55;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <CanopyDefs uid={uid} color={cfg.color} />
      <defs>
        <linearGradient id={`${uid}-tg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 28)} />
          <stop offset="35%" stopColor={lighten(cfg.trunkColor, 8)} />
          <stop offset="65%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 38)} />
        </linearGradient>
        <radialGradient id={`${uid}-coco`} cx="32%" cy="28%" r="75%">
          <stop offset="0%" stopColor={lighten(cfg.fruitColor, 55)} />
          <stop offset="50%" stopColor={cfg.fruitColor} />
          <stop offset="100%" stopColor={darken(cfg.fruitColor, 45)} />
        </radialGradient>
      </defs>

      <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />

      {/* Curved tapered trunk */}
      <path
        d={`M ${cx - w0} ${baseY + s * 0.004}
            Q ${midX - w0 * 0.72} ${midY} ${topX - w1} ${topY}
            L ${topX + w1} ${topY}
            Q ${midX + w0 * 0.72} ${midY} ${cx + w0} ${baseY + s * 0.004} Z`}
        fill={`url(#${uid}-tg)`}
      />
      {/* Ring segments following the curve */}
      {rings.map(r => (
        <path
          key={`rg${r.key}`}
          d={`M ${r.px - r.hw * 0.85} ${r.py} Q ${r.px} ${r.py + s * 0.008} ${r.px + r.hw * 0.85} ${r.py}`}
          stroke={darken(cfg.trunkColor, 22)} strokeWidth={s * 0.004} fill="none" opacity={0.4} strokeLinecap="round"
        />
      ))}

      {/* Fronds: back (horizontal) darker, top lighter */}
      {fronds.map((f, i) => {
        const tier = i / fronds.length;
        const fill = tier < 0.34 ? darken(cfg.color, 22) : tier < 0.67 ? cfg.color : lighten(cfg.color, 22);
        const d = frondPath(topX, topY, f.angle, f.len, s * 0.030 * g, f.sag);
        return (
          <path key={`fr${i}`} d={d} fill={fill} opacity={tier < 0.34 ? 0.92 : 1} />
        );
      })}
      {/* Spine highlights on the front fronds */}
      {fronds.slice(-3).map((f, i) => {
        const dx = Math.cos(f.angle);
        const dy = Math.sin(f.angle);
        const cX = topX + dx * f.len * 0.55;
        const cY = topY + dy * f.len * 0.55 + f.sag * 0.45;
        const tX = topX + dx * f.len;
        const tY = topY + dy * f.len + f.sag;
        return (
          <path
            key={`sp${i}`}
            d={`M ${topX} ${topY} Q ${cX} ${cY} ${tX} ${tY}`}
            stroke={lighten(cfg.color, 45)} strokeWidth={s * 0.004} fill="none" opacity={0.6} strokeLinecap="round"
          />
        );
      })}

      {/* Crown shaft */}
      <ellipse cx={topX} cy={topY + s * 0.004} rx={w1 * 2.4} ry={w1 * 1.5} fill={darken(cfg.trunkColor, 18)} />
      {/* Coconuts */}
      {hasCocos && (
        <g>
          <circle cx={topX - s * 0.022} cy={topY + s * 0.020} r={s * 0.014 * g + s * 0.004} fill={`url(#${uid}-coco)`} />
          <circle cx={topX + s * 0.020} cy={topY + s * 0.024} r={s * 0.012 * g + s * 0.003} fill={`url(#${uid}-coco)`} />
          <circle cx={topX - s * 0.026} cy={topY + s * 0.017} r={s * 0.004} fill="#ffffff" opacity={0.5} />
          <circle cx={topX + s * 0.016} cy={topY + s * 0.021} r={s * 0.0035} fill="#ffffff" opacity={0.5} />
        </g>
      )}
    </svg>
  );
}

/* =============================================
   CEDAR TREE — 4 concave scalloped tiers with
   per-tier shading and under-edge shadows
   ============================================= */
function CedarTree({ s, cfg, growth, uid }: { s: number; cfg: TreeStage; growth: number; uid: string }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <CanopyDefs uid={uid} color={cfg.color} />
        <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />
        <Sprout cx={cx} baseY={baseY - s * 0.012} s={s} g={g / 0.15} uid={uid} color={cfg.color} />
      </svg>
    );
  }

  const trunkH = s * 0.09 * g;
  const trunkW = s * 0.028;
  const tierCount = g < 0.35 ? 2 : g < 0.65 ? 3 : 4;
  const tierH = s * 0.16 * g;
  const halfW0 = s * 0.26 * g;
  const trunkTopY = baseY - trunkH;

  const tiers = [];
  for (let i = 0; i < tierCount; i++) {
    const w = halfW0 * (1 - i * 0.20);
    const y = trunkTopY - i * tierH * 0.66;
    const tipY = y - tierH * 1.12;
    const dip = tierH * 0.16;
    const seg = (2 * w) / 3;
    let d = `M ${cx} ${tipY} Q ${cx - w * 0.32} ${y - tierH * 0.55} ${cx - w} ${y}`;
    for (let k = 0; k < 3; k++) {
      d += ` Q ${cx - w + seg * (k + 0.5)} ${y + dip * (k === 1 ? 1.4 : 1)} ${cx - w + seg * (k + 1)} ${y + (k === 1 ? tierH * 0.04 : 0)}`;
    }
    d += ` Q ${cx + w * 0.32} ${y - tierH * 0.55} ${cx} ${tipY} Z`;
    let bd = `M ${cx - w} ${y}`;
    for (let k = 0; k < 3; k++) {
      bd += ` Q ${cx - w + seg * (k + 0.5)} ${y + dip * (k === 1 ? 1.4 : 1)} ${cx - w + seg * (k + 1)} ${y + (k === 1 ? tierH * 0.04 : 0)}`;
    }
    tiers.push({ d, bd, wobble: (i % 2 ? 1 : -1) * s * 0.004 * g, key: i });
  }

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <CanopyDefs uid={uid} color={cfg.color} />
      <defs>
        <linearGradient id={`${uid}-tier`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lighten(cfg.color, 55)} />
          <stop offset="45%" stopColor={cfg.color} />
          <stop offset="100%" stopColor={darken(cfg.color, 42)} />
        </linearGradient>
        <linearGradient id={`${uid}-tg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 28)} />
          <stop offset="35%" stopColor={lighten(cfg.trunkColor, 8)} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 38)} />
        </linearGradient>
      </defs>

      <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />

      {/* Trunk with flare */}
      <path
        d={`M ${cx - trunkW * 1.35} ${baseY + s * 0.004}
            C ${cx - trunkW * 0.75} ${baseY - trunkH * 0.45} ${cx - trunkW * 0.65} ${baseY - trunkH * 0.85} ${cx - trunkW * 0.5} ${baseY - trunkH}
            L ${cx + trunkW * 0.5} ${baseY - trunkH}
            C ${cx + trunkW * 0.65} ${baseY - trunkH * 0.85} ${cx + trunkW * 0.75} ${baseY - trunkH * 0.45} ${cx + trunkW * 1.25} ${baseY + s * 0.004} Z`}
        fill={`url(#${uid}-tg)`}
      />

      {/* Tiers bottom → top, slightly offset for an organic feel */}
      {tiers.map(t => (
        <g key={`t${t.key}`} transform={`translate(${t.wobble} 0)`}>
          <path d={t.d} fill={`url(#${uid}-tier)`} />
          {t.key > 0 && <path d={t.d} fill="#000000" opacity={0.07 * t.key} />}
          <path d={t.bd} stroke={darken(cfg.color, 50)} strokeWidth={s * 0.006} fill="none" opacity={0.35} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* =============================================
   WILLOW TREE — dome of gradient blobs +
   animated drooping strands with leaf dots
   ============================================= */
const WILLOW_DOME: Cluster[] = [
  { dx: -0.85, dy: -0.05, r: 0.34, tone: 'dark' },
  { dx: 0.85, dy: -0.08, r: 0.34, tone: 'dark' },
  { dx: -0.50, dy: -0.32, r: 0.40, tone: 'mid' },
  { dx: 0.50, dy: -0.34, r: 0.40, tone: 'mid' },
  { dx: 0.00, dy: -0.42, r: 0.42, tone: 'light2' },
  { dx: -0.25, dy: -0.10, r: 0.46, tone: 'mid' },
  { dx: 0.25, dy: -0.12, r: 0.46, tone: 'mid' },
  { dx: 0.00, dy: -0.15, r: 0.44, tone: 'light' },
];

function WillowTreeSVG({ s, cfg, growth, uid }: { s: number; cfg: TreeStage; growth: number; uid: string }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <CanopyDefs uid={uid} color={cfg.color} />
        <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />
        <Sprout cx={cx} baseY={baseY - s * 0.012} s={s} g={g / 0.15} uid={uid} color={cfg.color} />
      </svg>
    );
  }

  const trunkW = s * 0.028;
  const topW = s * 0.015;
  const trunkH = s * 0.24 * g;
  const trunkTopY = baseY - trunkH;
  const canopyR = s * 0.27 * g;
  const canopyCY = trunkTopY - canopyR * 0.30;

  const strandCount = 9;
  const strands = [];
  for (let k = 0; k < strandCount; k++) {
    const xo = (-0.8 + (1.6 * k) / (strandCount - 1)) * canopyR;
    const startX = cx + xo * 0.9;
    const startY = canopyCY + canopyR * 0.32 + (k % 3) * s * 0.008;
    const endY = baseY - s * 0.025 - (k % 4) * s * 0.012;
    const endX = startX + (k % 2 ? 1 : -1) * s * 0.02 + xo * 0.15;
    const cpX = (startX + endX) / 2 + (k % 2 ? 1 : -1) * s * 0.012;
    const cpY = (startY + endY) / 2 + s * 0.01;
    strands.push({ startX, startY, endX, endY, cpX, cpY, key: k });
  }
  const strandD = (st: typeof strands[number], drift: number) =>
    `M ${st.startX} ${st.startY} Q ${st.cpX + drift} ${st.cpY} ${st.endX + drift * 1.4} ${st.endY}`;
  const leafTs = [0.35, 0.6, 0.85];
  const leafAt = (st: typeof strands[number], t: number, drift: number) => {
    const u = 1 - t;
    const x = u * u * st.startX + 2 * u * t * (st.cpX + drift) + t * t * (st.endX + drift * 1.4);
    const y = u * u * st.startY + 2 * u * t * st.cpY + t * t * st.endY;
    return { x, y };
  };

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <CanopyDefs uid={uid} color={cfg.color} />
      <defs>
        <linearGradient id={`${uid}-tg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 30)} />
          <stop offset="30%" stopColor={lighten(cfg.trunkColor, 10)} />
          <stop offset="60%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 40)} />
        </linearGradient>
      </defs>

      <Ground cx={cx} baseY={baseY} s={s} g={g} uid={uid} flowerColor={cfg.flowerColor} />

      {/* Trunk with flare */}
      <path
        d={`M ${cx - trunkW * 1.4} ${baseY + s * 0.004}
            C ${cx - trunkW * 0.9} ${baseY - trunkH * 0.35} ${cx - trunkW * 0.75} ${baseY - trunkH * 0.7} ${cx - topW * 1.1} ${baseY - trunkH}
            L ${cx + topW * 1.1} ${baseY - trunkH}
            C ${cx + trunkW * 0.75} ${baseY - trunkH * 0.7} ${cx + trunkW * 0.9} ${baseY - trunkH * 0.35} ${cx + trunkW * 1.3} ${baseY + s * 0.004} Z`}
        fill={`url(#${uid}-tg)`}
      />
      {/* Branches */}
      <path
        d={`M ${cx - topW * 0.4} ${baseY - trunkH * 0.9} Q ${cx - s * 0.06} ${baseY - trunkH * 1.05} ${cx - canopyR * 0.35} ${baseY - trunkH - canopyR * 0.1}`}
        stroke={darken(cfg.trunkColor, 10)} strokeWidth={topW * 1.1} fill="none" strokeLinecap="round"
      />
      <path
        d={`M ${cx + topW * 0.3} ${baseY - trunkH * 0.92} Q ${cx + s * 0.055} ${baseY - trunkH * 1.06} ${cx + canopyR * 0.32} ${baseY - trunkH - canopyR * 0.14}`}
        stroke={darken(cfg.trunkColor, 14)} strokeWidth={topW * 0.9} fill="none" strokeLinecap="round"
      />

      {/* Drooping strands + leaf dots, swaying gently */}
      <motion.g
        animate={{ x: [0, s * 0.006, -s * 0.006, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {strands.map(st => (
          <motion.path
            key={`st${st.key}`}
            d={strandD(st, 0)}
            stroke={st.key % 2 ? cfg.color : darken(cfg.color, 12)}
            strokeWidth={s * 0.0055 * (1 + (st.key % 3) * 0.3)}
            fill="none"
            opacity={0.55}
            strokeLinecap="round"
            animate={{ d: [strandD(st, 0), strandD(st, s * 0.012), strandD(st, -s * 0.012), strandD(st, 0)] }}
            transition={{ duration: 4.5 + (st.key % 3), repeat: Infinity, ease: 'easeInOut', delay: st.key * 0.25 }}
          />
        ))}
        {strands.map(st =>
          leafTs.map((t, li) => {
            const p = leafAt(st, t, 0);
            return (
              <ellipse
                key={`lf${st.key}-${li}`}
                cx={p.x} cy={p.y}
                rx={s * 0.009} ry={s * 0.0045}
                fill={lighten(cfg.color, 18)}
                opacity={0.8}
              />
            );
          })
        )}
      </motion.g>

      {/* Dome canopy */}
      {WILLOW_DOME.map((c, i) => (
        <ClusterLayer key={`c${i}`} c={c} cx={cx} cy={canopyCY} R={canopyR} uid={uid} />
      ))}
      {/* Bottom AO + specular */}
      <ellipse cx={cx} cy={canopyCY + canopyR * 0.42} rx={canopyR * 0.95} ry={canopyR * 0.45} fill={`url(#${uid}-ao)`} />
      <circle cx={cx - canopyR * 0.28} cy={canopyCY - canopyR * 0.45} r={canopyR * 0.40} fill={`url(#${uid}-spec)`} />
    </svg>
  );
}

/* =============================================
   MAIN COMPONENT
   ============================================= */
export default function TreeVisualization({ treeType, level, size = 200 }: TreeVizProps) {
  const cfg = treeConfigs[treeType] || treeConfigs.olive;
  const growth = Math.min(level / 10, 1);
  const s = size;
  const rawId = useId();
  const uid = useMemo(() => `tr${rawId.replace(/[^a-zA-Z0-9]/g, '')}`, [rawId]);

  const swayAmount = growth > 0.2 ? 0.8 + growth * 0.5 : 0;
  const swayDuration = treeType === 'palm' ? 5 : treeType === 'willow' ? 4.5 : 4;

  const treeSVG = useMemo(() => {
    const props = { s, cfg, growth, uid };
    switch (treeType) {
      case 'palm': return <PalmTreeSVG {...props} />;
      case 'cedar': return <CedarTree {...props} />;
      case 'willow': return <WillowTreeSVG {...props} />;
      case 'pomegranate': return <RoundTree {...props} hasFruits />;
      case 'sidrah': return <RoundTree {...props} hasFruits />;
      default: return <RoundTree {...props} hasFruits />;
    }
  }, [treeType, s, cfg, growth, uid]);

  const fireflies = size >= 100 && growth >= 0.55
    ? [
      { left: 0.28, top: 0.30, d: 4.2, del: 0, r: 2.2 },
      { left: 0.66, top: 0.22, d: 5.1, del: 0.8, r: 1.7 },
      { left: 0.22, top: 0.54, d: 4.8, del: 1.6, r: 1.5 },
      { left: 0.72, top: 0.48, d: 5.6, del: 2.2, r: 2.0 },
    ]
    : [];

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{ width: size, height: size }}
      className='relative flex items-center justify-center'
    >
      {/* Soft background glow */}
      {growth > 0.3 && (
        <motion.div
          className='absolute rounded-full pointer-events-none'
          style={{
            width: size * 0.66,
            height: size * 0.56,
            top: size * 0.12,
            left: size * 0.17,
            background: `radial-gradient(circle, ${cfg.color}16, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Floating fireflies on mature trees */}
      {fireflies.map((f, i) => (
        <motion.div
          key={`ff${i}`}
          className='absolute rounded-full pointer-events-none'
          style={{
            left: f.left * size,
            top: f.top * size,
            width: f.r * 2,
            height: f.r * 2,
            background: cfg.flowerColor,
            boxShadow: `0 0 ${f.r * 3}px ${cfg.flowerColor}`,
          }}
          animate={{ y: [0, -7, 0], opacity: [0.1, 0.85, 0.1] }}
          transition={{ duration: f.d, repeat: Infinity, delay: f.del, ease: 'easeInOut' }}
        />
      ))}

      {/* Swaying tree — subtle rotation from base */}
      <motion.div
        className='relative'
        style={{ width: s, height: s, transformOrigin: '50% 90%' }}
        animate={swayAmount > 0
          ? { rotate: [0, swayAmount, -swayAmount * 0.4, -swayAmount, swayAmount * 0.4, 0] }
          : {}}
        transition={{ duration: swayDuration, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
      >
        {treeSVG}
      </motion.div>
    </motion.div>
  );
}

export type { TreeStage };
