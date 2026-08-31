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
   ROUND TREE (Olive, Sidrah, Pomegranate)
   Exact reference style: dual-gradient blobs + complex trunk
   ============================================= */
function RoundTree({ s, cfg, growth, hasFruits }: { s: number; cfg: TreeStage; growth: number; hasFruits?: boolean }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
   const baseY = s * 0.88;
  const trunkH = s * 0.3 * g;
  const canopyR = s * 0.22 * g;
  const canopyCY = baseY - trunkH - canopyR * 0.3;

  /* Gradient colors */
  const colDark = darken(cfg.color, 50);
  const colMid = cfg.color;
  const colLight = lighten(cfg.color, 80);
  const colSuperLight = lighten(cfg.color, 140);
  const trunkMid = cfg.trunkColor;
  const trunkDark = darken(trunkMid, 40);
  const trunkLight = lighten(trunkMid, 20);

  /* Blob positions relative to canopy center */
  const blobs = [
    { x: 0, y: 0.15, r: 1 },
    { x: -0.55, y: 0.25, r: 0.78 },
    { x: 0.55, y: 0.25, r: 0.78 },
    { x: -0.3, y: -0.2, r: 0.85 },
    { x: 0.3, y: -0.15, r: 0.85 },
    { x: 0, y: -0.45, r: 0.72 },
    { x: -0.5, y: -0.05, r: 0.6 },
    { x: 0.5, y: -0.05, r: 0.6 },
    { x: 0, y: -0.7, r: 0.5 },
  ];

  const uid = cfg.label;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        {/* Ground shadow */}
        <radialGradient id={`gs-${uid}`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor={colDark} stopOpacity='0.35' />
          <stop offset='100%' stopColor={colDark} stopOpacity='0' />
        </radialGradient>
        {/* Canopy gradient: dark bottom → light top */}
        <linearGradient id={`cg-${uid}`} x1='0%' y1='100%' x2='0%' y2='0%'>
          <stop offset='0%' stopColor={colDark} />
          <stop offset='45%' stopColor={colMid} />
          <stop offset='100%' stopColor={colLight} />
        </linearGradient>
        {/* Highlight overlay: white center → transparent */}
        <radialGradient id={`hl-${uid}`} cx='35%' cy='30%' r='60%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.7' />
          <stop offset='40%' stopColor='#ffffff' stopOpacity='0.25' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
        {/* Trunk gradient */}
        <linearGradient id={`tg-${uid}`} x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor={trunkDark} />
          <stop offset='30%' stopColor={trunkMid} />
          <stop offset='80%' stopColor={trunkDark} />
          <stop offset='100%' stopColor={darken(trunkMid, 60)} />
        </linearGradient>
        {/* Reusable petal */}
        <path id={`petal-${uid}`} d={`M0,0 C${-s*0.015},${-s*0.02} ${-s*0.025},${-s*0.01} ${-s*0.017},${s*0.01} C${-s*0.008},${s*0.025} ${s*0.008},${s*0.025} ${s*0.017},${s*0.01} C${s*0.025},${-s*0.01} ${s*0.015},${-s*0.02} 0,0 Z`} fill={cfg.flowerColor} opacity='0.75' />
      </defs>

      {/* Ground shadow */}
      <ellipse cx={cx} cy={baseY + s*0.02} rx={canopyR*1.8} ry={s*0.025} fill={`url(#gs-${uid})`} />

      {/* Trunk + branches as single path */}
      <path
        d={
          `M${cx} ${baseY}
           C${cx-s*0.03} ${baseY-s*0.02},${cx-s*0.04} ${baseY-trunkH*0.4},${cx-s*0.035} ${baseY-trunkH*0.65}
           C${cx-s*0.03} ${baseY-trunkH*0.8},${cx-s*0.025} ${baseY-trunkH*0.9},${cx-s*0.01} ${baseY-trunkH}
           L${cx+s*0.01} ${baseY-trunkH}
           C${cx+s*0.025} ${baseY-trunkH*0.9},${cx+s*0.03} ${baseY-trunkH*0.8},${cx+s*0.035} ${baseY-trunkH*0.65}
           C${cx+s*0.04} ${baseY-trunkH*0.4},${cx+s*0.03} ${baseY-s*0.02},${cx} ${baseY}Z`
        }
        fill={`url(#tg-${uid})`}
      />
      {/* Left branch */}
      {g >= 0.3 && (
        <path
          d={`M${cx-s*0.02} ${baseY-trunkH*0.6}
              C${cx-s*0.06} ${baseY-trunkH*0.65},${cx-s*0.1} ${baseY-trunkH*0.7},${cx-s*0.13} ${baseY-trunkH*0.68}
              C${cx-s*0.15} ${baseY-trunkH*0.67},${cx-s*0.14} ${baseY-trunkH*0.72},${cx-s*0.12} ${baseY-trunkH*0.73}
              C${cx-s*0.08} ${baseY-trunkH*0.72},${cx-s*0.04} ${baseY-trunkH*0.68},${cx-s*0.01} ${baseY-trunkH*0.62}Z`}
          fill={`url(#tg-${uid})`} opacity='0.95'
        />
      )}
      {/* Right branch */}
      {g >= 0.3 && (
        <path
          d={`M${cx+s*0.02} ${baseY-trunkH*0.55}
              C${cx+s*0.06} ${baseY-trunkH*0.6},${cx+s*0.1} ${baseY-trunkH*0.65},${cx+s*0.14} ${baseY-trunkH*0.62}
              C${cx+s*0.16} ${baseY-trunkH*0.61},${cx+s*0.15} ${baseY-trunkH*0.66},${cx+s*0.12} ${baseY-trunkH*0.68}
              C${cx+s*0.08} ${baseY-trunkH*0.66},${cx+s*0.04} ${baseY-trunkH*0.62},${cx+s*0.01} ${baseY-trunkH*0.57}Z`}
          fill={`url(#tg-${uid})`} opacity='0.9'
        />
      )}

      {/* Canopy: overlapping dual-gradient blobs */}
      {blobs.map((b, i) => {
        const bx = cx + b.x * canopyR;
        const by = canopyCY + b.y * canopyR;
        const br = canopyR * b.r;
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r={br} fill={`url(#cg-${uid})`} />
            <circle cx={bx} cy={by} r={br} fill={`url(#hl-${uid})`} />
          </g>
        );
      })}

      {/* Fruits */}
      {hasFruits && g >= 0.5 && [...Array(Math.floor(g * 8))].map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3;
        const r = canopyR * (0.3 + (i % 3) * 0.15);
        const fx = cx + Math.cos(a) * r;
        const fy = canopyCY + Math.sin(a) * r * 0.6;
        return (
          <g key={`f${i}`}>
            <circle cx={fx} cy={fy} r={s*0.012} fill={cfg.fruitColor} />
            <circle cx={fx-1} cy={fy-1} r={s*0.004} fill='white' opacity='0.35' />
          </g>
        );
      })}

      {/* Falling petals */}
      {g >= 0.4 && [0,1,2,3,4,5,6,7].map(i => {
        const seed = i * 137.508;
        const px = s * 0.12 + (seed * 7.3) % (s * 0.76);
        const py = s * 0.6 + (seed * 3.7) % (s * 0.3);
        const rot = (seed * 2.1) % 360;
        const sc = 0.7 + (i % 3) * 0.4;
        return (
          <motion.g key={`p${i}`}
            animate={{ y: [py, py-6, py-2, py], opacity: [0.3, 0.7, 0.5, 0.3] }}
            transition={{ duration: 3+i%3, repeat: Infinity, ease: 'easeInOut', delay: i*0.5 }}
          >
            <use href={`#petal-${uid}`} transform={`translate(${px},${py}) scale(${sc}) rotate(${rot})`} />
          </motion.g>
        );
      })}
    </svg>
  );
}

/* =============================================
   PALM TREE — curved trunk + frond blobs
   ============================================= */
function PalmTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s / 2;
  const baseY = s * 0.88;
  const trunkH = s * 0.42 * g;
  const topY = baseY - trunkH;
  const curve = s * 0.04 * g;
  const frondLen = s * 0.28 * g;

  const uid = 'palm';
  const colDark = darken(cfg.color, 50);
  const colLight = lighten(cfg.color, 80);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`gs-${uid}`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor={colDark} stopOpacity='0.3' />
          <stop offset='100%' stopColor={colDark} stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`cg-${uid}`} x1='0%' y1='100%' x2='0%' y2='0%'>
          <stop offset='0%' stopColor={colDark} />
          <stop offset='50%' stopColor={cfg.color} />
          <stop offset='100%' stopColor={colLight} />
        </linearGradient>
        <radialGradient id={`hl-${uid}`} cx='35%' cy='30%' r='60%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.6' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`tg-${uid}`} x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor={darken(cfg.trunkColor,30)} />
          <stop offset='50%' stopColor={cfg.trunkColor} />
          <stop offset='100%' stopColor={darken(cfg.trunkColor,50)} />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy={baseY+s*0.02} rx={s*0.12*g} ry={s*0.022} fill={`url(#gs-${uid})`} />

      {/* Curved trunk */}
      <path
        d={`M${cx-s*0.025} ${baseY} Q${cx-s*0.015+curve*0.5} ${baseY-trunkH*0.5} ${cx-s*0.01+curve} ${topY}
            Q${cx+curve} ${topY-3} ${cx+s*0.01+curve} ${topY}
            Q${cx+s*0.015+curve*0.5} ${baseY-trunkH*0.5} ${cx+s*0.025} ${baseY}Z`}
        fill={`url(#tg-${uid})`}
      />
      {/* Trunk segments */}
      {[...Array(Math.floor(g*6)+1)].map((_,i)=>{
        const t=(i+1)/7; const x=cx+curve*t; const y=baseY-trunkH*t;
        return <line key={i} x1={x-s*0.015} y1={y} x2={x+s*0.015} y2={y} stroke={darken(cfg.trunkColor,25)} strokeWidth='0.7' opacity='0.3' />;
      })}

      {/* Palm fronds as dual-gradient blobs */}
      {[...Array(Math.min(Math.floor(g*7)+1,7))].map((_,i)=>{
        const angle = -Math.PI/2+(i-3)*0.5;
        const tipX=cx+curve+Math.cos(angle)*frondLen;
        const tipY=topY+Math.sin(angle)*frondLen;
        const cpX=cx+curve+Math.cos(angle+0.25)*frondLen*0.6;
        const cpY=topY+Math.sin(angle+0.25)*frondLen*0.6-frondLen*0.12;
        const cp2X=cx+curve+Math.cos(angle-0.2)*frondLen*0.6;
        const cp2Y=topY+Math.sin(angle-0.2)*frondLen*0.6+frondLen*0.08;
        return (
          <g key={i}>
            <path d={`M${cx+curve} ${topY} Q${cpX} ${cpY} ${tipX} ${tipY} Q${cp2X} ${cp2Y} ${cx+curve} ${topY}`} fill={`url(#cg-${uid})`} opacity={0.55+i*0.04} />
            <path d={`M${cx+curve} ${topY} Q${cpX} ${cpY} ${tipX} ${tipY} Q${cp2X} ${cp2Y} ${cx+curve} ${topY}`} fill={`url(#hl-${uid})`} opacity={0.3} />
          </g>
        );
      })}
      {/* Center tuft blob */}
      <circle cx={cx+curve} cy={topY-s*0.01} r={frondLen*0.18} fill={`url(#cg-${uid})`} />
      <circle cx={cx+curve} cy={topY-s*0.01} r={frondLen*0.18} fill={`url(#hl-${uid})`} />

      {/* Coconuts */}
      {g>=0.6 && <>
        <circle cx={cx+curve-3} cy={topY+5} r={s*0.015} fill={cfg.fruitColor} />
        <circle cx={cx+curve+3} cy={topY+6} r={s*0.013} fill={cfg.fruitColor} opacity='0.9' />
        <circle cx={cx+curve} cy={topY+8} r={s*0.014} fill={darken(cfg.fruitColor,20)} />
      </>}
    </svg>
  );
}

/* =============================================
   CEDAR TREE — conical layer blobs
   ============================================= */
function CedarTree({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s/2;
  const baseY = s*0.88;
  const trunkH = s*0.18*g;
  const layerH = s*0.15*g;
  const layers = Math.min(Math.floor(g*4)+1,4);

  const uid='cedar';
  const colDark=darken(cfg.color,50);
  const colLight=lighten(cfg.color,80);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`gs-${uid}`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor={colDark} stopOpacity='0.3' />
          <stop offset='100%' stopColor={colDark} stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`cg-${uid}`} x1='0%' y1='100%' x2='0%' y2='0%'>
          <stop offset='0%' stopColor={colDark} />
          <stop offset='50%' stopColor={cfg.color} />
          <stop offset='100%' stopColor={colLight} />
        </linearGradient>
        <radialGradient id={`hl-${uid}`} cx='35%' cy='30%' r='60%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.5' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
      </defs>

      <ellipse cx={cx} cy={baseY+s*0.02} rx={s*0.15*g} ry={s*0.02} fill={`url(#gs-${uid})`} />
      {/* Trunk */}
      <rect x={cx-s*0.015} y={baseY-trunkH} width={s*0.03} height={trunkH} rx={s*0.005} fill={cfg.trunkColor} />

      {/* Conical layers as overlapping rounded shapes with dual gradients */}
      {[...Array(layers)].map((_,i)=>{
        const w = s*0.28*(1.15-i*0.12)*g;
        const y = baseY-trunkH-i*layerH*0.85;
        const h = layerH*1.1;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={y-h*0.3} rx={w} ry={h} fill={`url(#cg-${uid})`} opacity={0.75+i*0.06} />
            <ellipse cx={cx} cy={y-h*0.3} rx={w} ry={h} fill={`url(#hl-${uid})`} opacity={0.4} />
          </g>
        );
      })}
    </svg>
  );
}

/* =============================================
   WILLOW TREE — dome + droop branches
   ============================================= */
function WillowTreeSVG({ s, cfg, growth }: { s: number; cfg: TreeStage; growth: number }) {
  const g = Math.min(growth, 1);
  const cx = s/2;
  const baseY = s*0.88;
  const trunkH = s*0.28*g;
  const canopyR = s*0.2*g;
  const canopyCY = baseY-trunkH-canopyR*0.2;

  const uid='willow';
  const colDark=darken(cfg.color,50);
  const colLight=lighten(cfg.color,80);
  const trunkDark=darken(cfg.trunkColor,40);

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className='w-full h-full'>
      <defs>
        <radialGradient id={`gs-${uid}`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor={colDark} stopOpacity='0.3' />
          <stop offset='100%' stopColor={colDark} stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`cg-${uid}`} x1='0%' y1='100%' x2='0%' y2='0%'>
          <stop offset='0%' stopColor={colDark} />
          <stop offset='50%' stopColor={cfg.color} />
          <stop offset='100%' stopColor={colLight} />
        </linearGradient>
        <radialGradient id={`hl-${uid}`} cx='35%' cy='30%' r='60%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.6' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`tg-${uid}`} x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor={trunkDark} />
          <stop offset='50%' stopColor={cfg.trunkColor} />
          <stop offset='100%' stopColor={trunkDark} />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy={baseY+s*0.02} rx={canopyR*2} ry={s*0.022} fill={`url(#gs-${uid})`} />

      {/* Trunk */}
      <path d={`M${cx-s*0.025} ${baseY} Q${cx-s*0.02} ${baseY-trunkH*0.5} ${cx-s*0.012} ${baseY-trunkH} L${cx+s*0.012} ${baseY-trunkH} Q${cx+s*0.02} ${baseY-trunkH*0.5} ${cx+s*0.025} ${baseY}Z`} fill={`url(#tg-${uid})`} />

      {/* Dome canopy blobs */}
      {[{x:0,y:0.1,r:0.9},{x:-0.45,y:0.15,r:0.7},{x:0.45,y:0.15,r:0.7},{x:-0.2,y:-0.25,r:0.75},{x:0.2,y:-0.2,r:0.75},{x:0,y:-0.45,r:0.6}].map((b,i)=>{
        const bx=cx+b.x*canopyR; const by=canopyCY+b.y*canopyR; const br=canopyR*b.r;
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r={br} fill={`url(#cg-${uid})`} />
            <circle cx={bx} cy={by} r={br} fill={`url(#hl-${uid})`} />
          </g>
        );
      })}

      {/* Drooping branches */}
      {g>=0.3 && [...Array(Math.min(Math.floor(g*10)+2,12))].map((_,i)=>{
        const angle=(i/12)*Math.PI-0.05;
        const sx=cx+Math.cos(angle)*canopyR*0.5;
        const sy=canopyCY+canopyR*0.15;
        const ex=sx+Math.cos(angle)*canopyR*0.5+(i%2?4:-4);
        const ey=s*0.85;
        return (
          <motion.path key={i}
            d={`M${sx} ${sy} Q${(sx+ex)/2+(i%2?6:-6)} ${(sy+ey)*0.45} ${ex} ${ey}`}
            stroke={cfg.color} strokeWidth={1+(i%3)*0.4} fill='none'
            opacity={0.3+(i%3)*0.1} strokeLinecap='round'
            animate={{
              d:[`M${sx} ${sy} Q${(sx+ex)/2+6} ${(sy+ey)*0.45} ${ex} ${ey}`,`M${sx} ${sy} Q${(sx+ex)/2-6} ${(sy+ey)*0.45} ${ex} ${ey}`,`M${sx} ${sy} Q${(sx+ex)/2+6} ${(sy+ey)*0.45} ${ex} ${ey}`],
            }}
            transition={{ duration:4+(i%3), repeat:Infinity, ease:'easeInOut', delay:i*0.3 }}
          />
        );
      })}

      {/* Falling leaves */}
      {g>=0.4 && [0,1,2,3,4,5,6,7,8,9].map(i=>{
        const seed=i*137.508;
        const px=s*0.1+(seed*7.3)%(s*0.8);
        const py=s*0.55+(seed*3.7)%(s*0.35);
        return (
          <motion.circle key={`l${i}`} cx={px} cy={py} r={s*0.006}
            fill={cfg.flowerColor} opacity={0.4}
            animate={{y:[py,py-5,py-2,py],opacity:[0.2,0.5,0.3,0.2]}}
            transition={{duration:3+i%3,repeat:Infinity,ease:'easeInOut',delay:i*0.4}}
          />
        );
      })}
    </svg>
  );
}

/* =============================================
   ORBITING LIGHTS
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
        <motion.div key={i} className='absolute rounded-full pointer-events-none'
          style={{
            width: light.particleSize, height: light.particleSize,
            background: `radial-gradient(circle, white 0%, ${light.color} 40%, transparent 70%)`,
            boxShadow: `0 0 ${light.particleSize*2}px ${light.color}, 0 0 ${light.particleSize*5}px ${light.color}60, 0 0 ${light.particleSize*8}px ${light.color}25`,
          }}
          animate={{
            x: light.direction===1
              ? [Math.cos(light.startAngle)*light.radiusX,Math.cos(light.startAngle+Math.PI*0.5)*light.radiusX,Math.cos(light.startAngle+Math.PI)*light.radiusX,Math.cos(light.startAngle+Math.PI*1.5)*light.radiusX,Math.cos(light.startAngle+Math.PI*2)*light.radiusX]
              : [Math.cos(light.startAngle)*light.radiusX,Math.cos(light.startAngle-Math.PI*0.5)*light.radiusX,Math.cos(light.startAngle-Math.PI)*light.radiusX,Math.cos(light.startAngle-Math.PI*1.5)*light.radiusX,Math.cos(light.startAngle-Math.PI*2)*light.radiusX],
            y: [Math.sin(light.startAngle)*light.radiusY,Math.sin(light.startAngle+Math.PI*0.5*light.direction)*light.radiusY*(1+light.wobble),Math.sin(light.startAngle+Math.PI)*light.radiusY,Math.sin(light.startAngle+Math.PI*1.5*light.direction)*light.radiusY*(1-light.wobble),Math.sin(light.startAngle+Math.PI*2)*light.radiusY],
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
   FLOATING PARTICLES
   ============================================= */
function FloatingParticles({ size, color, growth }: { size: number; color: string; growth: number }) {
  if (growth < 0.3) return null;
  const particles = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      x: size*(0.15+(i*0.1)%0.7), y: size*(0.1+(i*0.11)%0.7),
      size: 1+(i%3), delay: i*0.8, duration: 3+(i%4), drift: 5+(i%3)*3,
    })), [size]);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div key={i} className='absolute rounded-full pointer-events-none'
          style={{ width: p.size, height: p.size, background: color, boxShadow: `0 0 ${p.size*2}px ${color}80` }}
          animate={{
            y: [p.y, p.y-p.drift, p.y-p.drift*0.5, p.y],
            x: [p.x, p.x+p.drift*0.5, p.x-p.drift*0.3, p.x],
            opacity: [0, 0.7, 0.4, 0], scale: [0, 1, 0.8, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </>
  );
}

/* =============================================
   MAIN COMPONENT
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
      case 'willow': return <WillowTreeSVG {...props} />;
      case 'pomegranate': return <RoundTree {...props} hasFruits />;
      case 'sidrah': return <RoundTree {...props} hasFruits />;
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
      {/* Atmospheric glow */}
      <motion.div
        className='absolute rounded-full pointer-events-none'
        style={{ inset: -size*0.18, background: `radial-gradient(ellipse at 50% 45%, ${cfg.color}18, ${cfg.color}08 40%, transparent 65%)` }}
        animate={growth>0.2?{scale:[1,1.12,0.95,1.08,1],opacity:[0.4,0.7,0.5,0.65,0.4]}:{}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {growth>0.4 && (
        <motion.div className='absolute rounded-full pointer-events-none'
          style={{ inset: -size*0.08, background: `radial-gradient(ellipse at 50% 40%, ${cfg.lightColor2}12, transparent 60%)` }}
          animate={{ scale:[1,1.08,1], opacity:[0.3,0.6,0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      )}

      {/* Swaying tree */}
      <motion.div className='relative' style={{ width: s, height: s, transformOrigin: '50% 95%' }}
        animate={swayAmount>0?{rotate:[0,swayAmount,-swayAmount*0.3,-swayAmount,swayAmount*0.3,0]}:{}}
        transition={{ duration: swayDuration, repeat: Infinity, ease: [0.45,0.05,0.55,0.95] }}
      >
        {treeSVG}
        {growth>0.3 && (
          <motion.div className='absolute pointer-events-none rounded-full'
            style={{ width:s*0.45, height:s*0.4, top:s*0.08, left:s*0.28, background:`radial-gradient(circle, ${cfg.color}25, transparent 65%)` }}
            animate={{ opacity:[0.2,0.6,0.3,0.55,0.2], scale:[0.95,1.05,1,1.03,0.95] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      <OrbitingLights size={s} color={cfg.color} growth={growth} cfg={cfg} count={lightCount} />
      <FloatingParticles size={s} color={cfg.color} growth={growth} />
    </motion.div>
  );
}

export type { TreeStage };
