'use client';

import { motion } from 'framer-motion';

interface TreeVizProps {
  treeType: string;
  level: number; // 0-10
  size?: number;
}

// Tree configs: each tree has stages based on level
type TreeStage = {
  trunk: number; // trunk height fraction
  canopy: number; // canopy size fraction
  fruits: number;
  flowers: number;
  color: string;
  trunkColor: string;
  fruitColor: string;
  flowerColor: string;
  label: string;
};

const treeConfigs: Record<string, TreeStage> = {
  olive:   { trunk: 0.3, canopy: 0.5, fruits: 0, flowers: 0, color: '#4ade80', trunkColor: '#78716c', fruitColor: '#1a1a1a', flowerColor: '#fbbf24', label: 'زيتونة' },
  palm:    { trunk: 0.5, canopy: 0.6, fruits: 0, flowers: 0, color: '#22c55e', trunkColor: '#a16207', fruitColor: '#d97706', flowerColor: '#fde047', label: 'نخلة' },
  cedar:   { trunk: 0.4, canopy: 0.7, fruits: 0, flowers: 0, color: '#16a34a', trunkColor: '#57534e', fruitColor: '#166534', flowerColor: '#86efac', label: 'أرز' },
  pomegranate: { trunk: 0.25, canopy: 0.55, fruits: 0, flowers: 0, color: '#f43f5e', trunkColor: '#78716c', fruitColor: '#dc2626', flowerColor: '#fb7185', label: 'رمان' },
  sidrah:  { trunk: 0.35, canopy: 0.6, fruits: 0, flowers: 0, color: '#10b981', trunkColor: '#92400e', fruitColor: '#fbbf24', flowerColor: '#a78bfa', label: 'سدرة' },
  willow:  { trunk: 0.3, canopy: 0.65, fruits: 0, flowers: 0, color: '#34d399', trunkColor: '#6b7280', fruitColor: '#6ee7b7', flowerColor: '#a7f3d0', label: 'صفصاف' },
};

// Tree-specific SVG renderers
function OliveTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.8, 0.8);
  const hasFruits = growth >= 0.5;
  const hasFlowers = growth >= 0.3 && growth < 0.5;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      {/* Ground shadow */}
      <ellipse cx={s/2} cy={s*0.92} rx={canopyR*0.7} ry={s*0.04} fill='rgba(0,0,0,0.08)' />
      {/* Trunk — gnarled olive style */}
      <path d={`M${s/2-4} ${s*0.92} Q${s/2-6} ${s*0.92-trunkH*0.5} ${s/2-3} ${s*0.92-trunkH} Q${s/2} ${s*0.92-trunkH-8} ${s/2+3} ${s*0.92-trunkH} Q${s/2+5} ${s*0.92-trunkH*0.5} ${s/2+3} ${s*0.92}`} fill={cfg.trunkColor} stroke={cfg.trunkColor} strokeWidth='1' />
      {/* Canopy — multiple overlapping circles */}
      <circle cx={s/2-canopyR*0.3} cy={s*0.92-trunkH-canopyR*0.2} r={canopyR*0.7} fill={cfg.color} opacity='0.85' />
      <circle cx={s/2+canopyR*0.3} cy={s*0.92-trunkH-canopyR*0.15} r={canopyR*0.65} fill={cfg.color} opacity='0.9' />
      <circle cx={s/2} cy={s*0.92-trunkH-canopyR*0.4} r={canopyR*0.6} fill={cfg.color} opacity='0.95' />
      <circle cx={s/2-canopyR*0.15} cy={s*0.92-trunkH-canopyR*0.35} r={canopyR*0.5} fill={cfg.color} />
      <circle cx={s/2+canopyR*0.15} cy={s*0.92-trunkH-canopyR*0.3} r={canopyR*0.55} fill={cfg.color} opacity='0.9' />
      {/* Fruits (olives) */}
      {hasFruits && [...Array(Math.floor(growth * 8))].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.5;
        const r = canopyR * (0.3 + (i % 3) * 0.15);
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (s*0.92-trunkH-canopyR*0.3) + Math.sin(angle) * r * 0.7;
        return <circle key={i} cx={cx} cy={cy} r={s*0.015} fill={cfg.fruitColor} opacity='0.8' />;
      })}
      {/* Flowers */}
      {hasFlowers && [...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const r = canopyR * 0.5;
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (s*0.92-trunkH-canopyR*0.3) + Math.sin(angle) * r * 0.6;
        return <circle key={i} cx={cx} cy={cy} r={s*0.012} fill={cfg.flowerColor} />;
      })}
    </svg>
  );
}

function PalmTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const leafLen = s * 0.25 * Math.min(growth, 1);
  const hasFruits = growth >= 0.6;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <ellipse cx={s/2} cy={s*0.92} rx={s*0.08} ry={s*0.03} fill='rgba(0,0,0,0.06)' />
      {/* Curved trunk */}
      <path d={`M${s/2} ${s*0.92} Q${s/2+8} ${s*0.92-trunkH*0.5} ${s/2+4} ${s*0.92-trunkH}`} stroke={cfg.trunkColor} strokeWidth={s*0.035} fill='none' strokeLinecap='round' />
      {/* Trunk segments */}
      {[...Array(Math.floor(growth * 5))].map((_, i) => {
    const y = s*0.92 - trunkH * ((i+1)/6);
    const x = s/2 + 4 * ((i+1)/6);
    return <line key={i} x1={x-s*0.02} y1={y} x2={x+s*0.02} y2={y} stroke={cfg.trunkColor} strokeWidth='1' opacity='0.4' />;
  })}
      {/* Palm leaves */}
      {[...Array(Math.min(Math.floor(growth * 7) + 1, 7))].map((_, i) => {
        const angle = -Math.PI/2 + (i - 3) * 0.45;
        const tipX = s/2 + Math.cos(angle) * leafLen;
        const tipY = (s*0.92-trunkH) + Math.sin(angle) * leafLen;
        const cp1x = s/2 + Math.cos(angle + 0.3) * leafLen * 0.6;
        const cp1y = (s*0.92-trunkH) + Math.sin(angle + 0.3) * leafLen * 0.6 - leafLen*0.2;
        const cp2x = s/2 + Math.cos(angle - 0.3) * leafLen * 0.6;
        const cp2y = (s*0.92-trunkH) + Math.sin(angle - 0.3) * leafLen * 0.6 - leafLen*0.15;
        return (
          <path key={i} d={`M${s/2} ${s*0.92-trunkH} Q${cp1x} ${cp1y} ${tipX} ${tipY} Q${cp2x} ${cp2y} ${s/2} ${s*0.92-trunkH}`} fill={cfg.color} opacity={0.7 + i*0.04} />
        );
      })}
      {/* Coconuts */}
      {hasFruits && [...Array(3)].map((_, i) => {
        const angle = -0.8 + i * 0.4;
        const cx = s/2 + Math.cos(angle) * s*0.03;
        const cy = s*0.92-trunkH + Math.sin(angle) * s*0.03 + s*0.02;
        return <circle key={i} cx={cx} cy={cy} r={s*0.018} fill={cfg.fruitColor} />;
      })}
    </svg>
  );
}

function GenericTree({ cfg, growth, s }: { cfg: TreeStage; growth: number; s: number }) {
  const trunkH = s * cfg.trunk * Math.min(growth, 1);
  const canopyR = s * cfg.canopy * Math.min(growth * 0.7, 0.7);
  const isConifer = cfg.color === '#16a34a';
  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <ellipse cx={s/2} cy={s*0.92} rx={canopyR*0.6} ry={s*0.03} fill='rgba(0,0,0,0.06)' />
      {/* Trunk */}
      <rect x={s/2-s*0.025} y={s*0.92-trunkH} width={s*0.05} height={trunkH} rx={s*0.01} fill={cfg.trunkColor} />
      {isConifer ? (
        // Triangular layers for cedar
        [...Array(Math.min(Math.floor(growth * 4) + 1, 4))].map((_, i) => {
          const w = canopyR * (1.2 - i * 0.15);
          const y = s*0.92-trunkH - i*canopyR*0.35;
          return <polygon key={i} points={`${s/2},${y-canopyR*0.4} ${s/2-w/2},${y+w*0.1} ${s/2+w/2},${y+w*0.1}`} fill={cfg.color} opacity={0.8+i*0.05} />;
        })
      ) : (
        // Round canopy layers
        <>
          <circle cx={s/2} cy={s*0.92-trunkH-canopyR*0.3} r={canopyR} fill={cfg.color} opacity='0.8' />
          <circle cx={s/2-canopyR*0.25} cy={s*0.92-trunkH-canopyR*0.15} r={canopyR*0.75} fill={cfg.color} opacity='0.9' />
          <circle cx={s/2+canopyR*0.25} cy={s*0.92-trunkH-canopyR*0.2} r={canopyR*0.7} fill={cfg.color} />
          {growth >= 0.4 && <circle cx={s/2} cy={s*0.92-trunkH-canopyR*0.5} r={canopyR*0.5} fill={cfg.color} opacity='0.95' />}
        </>
      )}
      {/* Flowers/fruits */}
      {growth >= 0.6 && !isConifer && [...Array(Math.floor(growth * 6))].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = canopyR * 0.6;
        const cx = s/2 + Math.cos(angle) * r;
        const cy = (s*0.92-trunkH-canopyR*0.3) + Math.sin(angle) * r * 0.7;
        return <circle key={i} cx={cx} cy={cy} r={s*0.012} fill={i % 2 === 0 ? cfg.flowerColor : cfg.fruitColor} opacity='0.9' />;
      })}
    </svg>
  );
}

export default function TreeVisualization({ treeType, level, size = 200 }: TreeVizProps) {
  const cfg = treeConfigs[treeType] || treeConfigs.olive;
  const growth = Math.min(level / 10, 1);
  const s = size;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      style={{ width: size, height: size }}
      className='relative'
    >
      {/* Glow behind tree */}
      <div className='absolute inset-0 rounded-full blur-2xl opacity-20' style={{ background: cfg.color }} />
      {treeType === 'palm' ? (
        <PalmTree cfg={cfg} growth={growth} s={s} />
      ) : treeType === 'olive' ? (
        <OliveTree cfg={cfg} growth={growth} s={s} />
      ) : (
        <GenericTree cfg={cfg} growth={growth} s={s} />
      )}
    </motion.div>
  );
}

export { treeConfigs };
export type { TreeStage };
