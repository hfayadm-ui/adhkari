'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

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

/* =============================================
   SHARED: Soil mound + ground shadow
   Forest style: dark brown semi-circle soil
   ============================================= */
function SoilMound({ cx, baseY, s, g }: { cx: number; baseY: number; s: number; g: number }) {
  const soilR = s * 0.14 * Math.max(g, 0.15);
  return (
    <g>
      {/* Soft ground shadow */}
      <ellipse cx={cx} cy={baseY + s * 0.005} rx={soilR * 1.1} ry={s * 0.018 * g} fill="#3E2723" opacity="0.15" />
      {/* Soil hemisphere */}
      <ellipse cx={cx} cy={baseY} rx={soilR} ry={soilR * 0.45} fill="#5D4037" />
      <ellipse cx={cx} cy={baseY - soilR * 0.12} rx={soilR * 0.85} ry={soilR * 0.28} fill="#6D4C41" />
    </g>
  );
}

/* =============================================
   SPROUT (level 0-1) — tiny seedling
   Forest style: two teardrop leaves + thin stem
   ============================================= */
function Sprout({ cx, baseY, s, g, color }: { cx: number; baseY: number; s: number; g: number; color: string }) {
  const stemH = s * 0.12 * g;
  const leafSize = s * 0.05 * g;
  const colLight = lighten(color, 60);
  const topY = baseY - stemH;
  return (
    <g>
      <line x1={cx} y1={baseY} x2={cx} y2={topY} stroke={darken(color, 20)} strokeWidth={s * 0.008} strokeLinecap="round" />
      <ellipse cx={cx - leafSize * 0.6} cy={topY - leafSize * 0.3} rx={leafSize} ry={leafSize * 1.4} fill={color} transform={`rotate(-30 ${cx - leafSize * 0.6} ${topY - leafSize * 0.3})`} />
      <ellipse cx={cx + leafSize * 0.6} cy={topY - leafSize * 0.3} rx={leafSize} ry={leafSize * 1.4} fill={colLight} transform={`rotate(30 ${cx + leafSize * 0.6} ${topY - leafSize * 0.3})`} />
    </g>
  );
}

/* =============================================
   ROUND TREE (Olive, Sidrah, Pomegranate)
   Forest style: single solid circle canopy with
   simple top-left→bottom-right gradient,
   thin lollipop trunk, soil mound
   ============================================= */
function RoundTree({ s, cfg, growth, hasFruits }: { s: number; cfg: TreeStage; growth: number; hasFruits?: boolean }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  /* Trunk: thin, short, lollipop style */
  const trunkW = s * 0.025;
  const trunkH = s * 0.2 * g;
  const trunkTop = baseY - trunkH;

  /* Canopy: single large circle */
  const canopyR = s * 0.26 * g;
  const canopyCY = trunkTop - canopyR * 0.55;

  /* Gradient colors: Forest-style top-left light → bottom-right dark */
  const colHighlight = lighten(cfg.color, 70);
  const colMid = cfg.color;
  const colDark = darken(cfg.color, 45);
  const colVeryDark = darken(cfg.color, 70);

  const uid = cfg.label;

  /* If very small, show sprout instead */
  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <SoilMound cx={cx} baseY={baseY} s={s} g={g} />
        <Sprout cx={cx} baseY={baseY - s * 0.01} s={s} g={g / 0.15} color={cfg.color} />
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        {/* Main canopy gradient: top-left highlight → bottom-right shadow */}
        <linearGradient id={`cg-${uid}`} x1="25%" y1="15%" x2="75%" y2="85%">
          <stop offset="0%" stopColor={colHighlight} />
          <stop offset="35%" stopColor={colMid} />
          <stop offset="75%" stopColor={colDark} />
          <stop offset="100%" stopColor={colVeryDark} />
        </linearGradient>
        {/* Trunk gradient */}
        <linearGradient id={`tg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 25)} />
          <stop offset="40%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 35)} />
        </linearGradient>
        {/* Subtle inner glow on canopy */}
        <radialGradient id={`ig-${uid}`} cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <SoilMound cx={cx} baseY={baseY} s={s} g={g} />

      {/* Trunk: thin rectangle with rounded ends */}
      <rect
        x={cx - trunkW / 2}
        y={trunkTop}
        width={trunkW}
        height={trunkH}
        rx={trunkW * 0.3}
        fill={`url(#tg-${uid})`}
      />

      {/* Canopy: single solid circle with gradient */}
      <circle cx={canopyCY > canopyR ? cx : cx} cy={canopyCY} r={canopyR} fill={`url(#cg-${uid})`} />
      {/* Inner glow overlay */}
      <circle cx={canopyCY > canopyR ? cx : cx} cy={canopyCY} r={canopyR} fill={`url(#ig-${uid})`} />

      {/* Fruits: small circles scattered on canopy */}
      {hasFruits && g >= 0.4 && [...Array(Math.floor(g * 6))].map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.5;
        const r = canopyR * (0.25 + (i % 3) * 0.2);
        const fx = cx + Math.cos(a) * r;
        const fy = canopyCY + Math.sin(a) * r * 0.75;
        return (
          <g key={`f${i}`}>
            <circle cx={fx} cy={fy} r={s * 0.01 * g} fill={cfg.fruitColor} />
            <circle cx={fx - 0.5} cy={fy - 0.5} r={s * 0.003} fill="white" opacity="0.3" />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   PALM TREE — curved thin trunk + simple fronds
   Forest style: slightly curved trunk,
   elongated leaf shapes radiating from top
   ============================================= */
function PalmTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <SoilMound cx={cx} baseY={baseY} s={s} g={g} />
        <Sprout cx={cx} baseY={baseY - s * 0.01} s={s} g={g / 0.15} color={cfg.color} />
      </svg>
    );
  }

  /* Curved trunk */
  const trunkH = s * 0.35 * g;
  const trunkW = s * 0.02;
  const curve = s * 0.03 * g;
  const topX = cx + curve;
  const topY = baseY - trunkH;

  /* Frond dimensions */
  const frondLen = s * 0.25 * g;
  const frondW = s * 0.06 * g;
  const frondCount = Math.min(Math.floor(g * 7) + 1, 7);

  const uid = 'palm';
  const colHighlight = lighten(cfg.color, 50);
  const colDark = darken(cfg.color, 40);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <linearGradient id={`cg-${uid}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={colHighlight} />
          <stop offset="50%" stopColor={cfg.color} />
          <stop offset="100%" stopColor={colDark} />
        </linearGradient>
        <linearGradient id={`tg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 20)} />
          <stop offset="50%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 30)} />
        </linearGradient>
      </defs>

      <SoilMound cx={cx} baseY={baseY} s={s} g={g} />

      {/* Curved trunk */}
      <path
        d={`M${cx - trunkW / 2} ${baseY} Q${cx + curve * 0.5} ${baseY - trunkH * 0.5} ${topX - trunkW / 2} ${topY}
           L${topX + trunkW / 2} ${topY} Q${cx + curve * 0.5} ${baseY - trunkH * 0.5} ${cx + trunkW / 2} ${baseY}Z`}
        fill={`url(#tg-${uid})`}
      />

      {/* Trunk ring segments */}
      {[...Array(Math.floor(g * 5) + 1)].map((_, i) => {
        const t = (i + 1) / 6;
        const x = cx + curve * t;
        const y = baseY - trunkH * t;
        return (
          <line key={i} x1={x - trunkW} y1={y} x2={x + trunkW} y2={y}
            stroke={darken(cfg.trunkColor, 15)} strokeWidth="0.5" opacity="0.25" />
        );
      })}

      {/* Fronds: elongated ellipses radiating from top */}
      {[...Array(frondCount)].map((_, i) => {
        const angle = -Math.PI / 2 + (i - (frondCount - 1) / 2) * 0.45;
        const tipX = topX + Math.cos(angle) * frondLen;
        const tipY = topY + Math.sin(angle) * frondLen;
        const midX = topX + Math.cos(angle) * frondLen * 0.5;
        const midY = topY + Math.sin(angle) * frondLen * 0.5 - frondLen * 0.08;
        const perpX = -Math.sin(angle) * frondW;
        const perpY = Math.cos(angle) * frondW;
        return (
          <path key={i}
            d={`M${topX} ${topY}
                Q${midX + perpX * 0.5} ${midY + perpY * 0.5} ${tipX} ${tipY}
                Q${midX - perpX * 0.3} ${midY - perpY * 0.3} ${topX} ${topY}`}
            fill={`url(#cg-${uid})`} opacity={0.7 + i * 0.03}
          />
        );
      })}

      {/* Center tuft */}
      <circle cx={topX} cy={topY - frondLen * 0.05} r={frondLen * 0.1} fill={cfg.color} />

      {/* Coconuts */}
      {g >= 0.6 && (
        <>
          <circle cx={topX - 2} cy={topY + 3} r={s * 0.012} fill={cfg.fruitColor} />
          <circle cx={topX + 2} cy={topY + 4} r={s * 0.01} fill={darken(cfg.fruitColor, 15)} />
        </>
      )}
    </svg>
  );
}

/* =============================================
   CEDAR TREE — stacked soft cone tiers
   Forest style: 3-4 rounded triangular layers,
   cel-shading (hard edge light/dark), thin trunk
   ============================================= */
function CedarTree({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <SoilMound cx={cx} baseY={baseY} s={s} g={g} />
        <Sprout cx={cx} baseY={baseY - s * 0.01} s={s} g={g / 0.15} color={cfg.color} />
      </svg>
    );
  }

  const trunkH = s * 0.1 * g;
  const trunkW = s * 0.02;
  const trunkTop = baseY - trunkH;

  /* Tiers: 3-4 stacked cones */
  const tierCount = g < 0.4 ? 2 : g < 0.7 ? 3 : 4;
  const tierH = s * 0.12 * g;
  const baseWidth = s * 0.22 * g;

  const uid = 'cedar';
  const colLight = lighten(cfg.color, 40);
  const colMid = cfg.color;
  const colDark = darken(cfg.color, 40);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <linearGradient id={`cg-${uid}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={colLight} />
          <stop offset="50%" stopColor={colMid} />
          <stop offset="100%" stopColor={colDark} />
        </linearGradient>
      </defs>

      <SoilMound cx={cx} baseY={baseY} s={s} g={g} />

      {/* Thin trunk */}
      <rect x={cx - trunkW / 2} y={trunkTop} width={trunkW} height={trunkH} rx={trunkW * 0.2} fill={cfg.trunkColor} />

      {/* Cone tiers: bottom to top */}
      {[...Array(tierCount)].map((_, i) => {
        const w = baseWidth * (1 - i * 0.2);
        const y = trunkTop - i * tierH * 0.75;
        const tipY = y - tierH;
        /* Rounded triangle using a path */
        return (
          <path key={i}
            d={`M${cx - w} ${y}
                Q${cx - w * 0.5} ${y - tierH * 0.3} ${cx} ${tipY}
                Q${cx + w * 0.5} ${y - tierH * 0.3} ${cx + w} ${y}Z`}
            fill={`url(#cg-${uid})`}
            opacity={0.85 + i * 0.05}
          />
        );
      })}
    </svg>
  );
}

/* =============================================
   WILLOW TREE — dome canopy + drooping branches
   Forest style: round canopy like round tree,
   with elegant drooping curve lines underneath
   ============================================= */
function WillowTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.82;

  if (g < 0.15) {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
        <SoilMound cx={cx} baseY={baseY} s={s} g={g} />
        <Sprout cx={cx} baseY={baseY - s * 0.01} s={s} g={g / 0.15} color={cfg.color} />
      </svg>
    );
  }

  const trunkW = s * 0.022;
  const trunkH = s * 0.22 * g;
  const trunkTop = baseY - trunkH;

  /* Canopy */
  const canopyR = s * 0.22 * g;
  const canopyCY = trunkTop - canopyR * 0.5;

  const uid = 'willow';
  const colHighlight = lighten(cfg.color, 55);
  const colDark = darken(cfg.color, 40);
  const colVeryDark = darken(cfg.color, 60);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <linearGradient id={`cg-${uid}`} x1="25%" y1="15%" x2="75%" y2="85%">
          <stop offset="0%" stopColor={colHighlight} />
          <stop offset="35%" stopColor={cfg.color} />
          <stop offset="75%" stopColor={colDark} />
          <stop offset="100%" stopColor={colVeryDark} />
        </linearGradient>
        <linearGradient id={`tg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darken(cfg.trunkColor, 20)} />
          <stop offset="40%" stopColor={cfg.trunkColor} />
          <stop offset="100%" stopColor={darken(cfg.trunkColor, 30)} />
        </linearGradient>
        <radialGradient id={`ig-${uid}`} cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <SoilMound cx={cx} baseY={baseY} s={s} g={g} />

      {/* Trunk */}
      <rect x={cx - trunkW / 2} y={trunkTop} width={trunkW} height={trunkH} rx={trunkW * 0.3} fill={`url(#tg-${uid})`} />

      {/* Drooping branches (behind canopy) */}
      {g >= 0.35 && [...Array(Math.min(Math.floor(g * 8) + 2, 10))].map((_, i) => {
        const angle = (i / 10) * Math.PI + 0.15;
        const startX = cx + Math.cos(angle) * canopyR * 0.7;
        const startY = canopyCY + canopyR * 0.3;
        const endX = startX + (startX - cx) * 0.3 + (i % 2 ? 3 : -3);
        const endY = baseY - s * 0.02;
        const cpX = (startX + endX) / 2 + (i % 2 ? 5 : -5);
        const cpY = (startY + endY) * 0.5;
        return (
          <motion.path key={i}
            d={`M${startX} ${startY} Q${cpX} ${cpY} ${endX} ${endY}`}
            stroke={cfg.color} strokeWidth={1.2 + (i % 3) * 0.3} fill="none"
            opacity={0.25 + (i % 3) * 0.08} strokeLinecap="round"
            animate={{
              d: [
                `M${startX} ${startY} Q${cpX + 4} ${cpY} ${endX} ${endY}`,
                `M${startX} ${startY} Q${cpX - 4} ${cpY} ${endX} ${endY}`,
                `M${startX} ${startY} Q${cpX + 4} ${cpY} ${endY} ${endX}`,
              ],
            }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        );
      })}

      {/* Canopy: single dome */}
      <circle cx={cx} cy={canopyCY} r={canopyR} fill={`url(#cg-${uid})`} />
      <circle cx={cx} cy={canopyCY} r={canopyR} fill={`url(#ig-${uid})`} />
    </svg>
  );
}

/* =============================================
   MAIN COMPONENT
   Forest style: clean, minimal, gentle sway
   ============================================= */
export default function TreeVisualization({ treeType, level, size = 200 }: TreeVizProps) {
  const cfg = treeConfigs[treeType] || treeConfigs.olive;
  const growth = Math.min(level / 10, 1);
  const s = size;

  /* Very subtle sway — Forest app trees barely move */
  const swayAmount = growth > 0.2 ? 0.8 + growth * 0.5 : 0;
  const swayDuration = treeType === 'palm' ? 5 : treeType === 'willow' ? 4.5 : 4;

  const treeSVG = useMemo(() => {
    const props = { s, cfg, growth };
    switch (treeType) {
      case 'palm': return <PalmTreeSVG {...props} />;
      case 'cedar': return <CedarTree {...props} />;
      case 'willow': return <WillowTreeSVG {...props} />;
      case 'pomegranate': return <RoundTree {...props} hasFruits />;
      case 'sidrah': return <RoundTree {...props} hasFruits />;
      default: return <RoundTree {...props} hasFruits />;
    }
  }, [treeType, s, cfg, growth]);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{ width: size, height: size }}
      className='relative flex items-center justify-center'
    >
      {/* Very subtle background glow */}
      {growth > 0.3 && (
        <motion.div
          className='absolute rounded-full pointer-events-none'
          style={{
            width: size * 0.6,
            height: size * 0.5,
            top: size * 0.15,
            left: size * 0.2,
            background: `radial-gradient(circle, ${cfg.color}10, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

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
