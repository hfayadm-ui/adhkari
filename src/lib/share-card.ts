// ==================== بطاقات مشاركة احترافية لقصص انستغرام وفيسبوك ====================

interface ShareCardOptions {
  text: string;
  footer?: string;
  type?: 'verse' | 'hadith' | 'dhikr' | 'stats';
  stats?: { streak: number; totalDhikr: number; treeLevel: number };
}

/* ---- Constants ---- */
const W = 1080;
const H = 1920; // 9:16 for stories

/* ---- Color Palettes per type ---- */
const PALETTES = {
  verse: {
    bg1: '#0B1120', bg2: '#1A1145', bg3: '#0D1B3E',
    accent: '#C5A059', accentBright: '#E5C054', accentSoft: 'rgba(197,160,89,',
    text: '#F5F0E8', textMuted: 'rgba(245,240,232,0.55)',
    glow: 'rgba(197,160,89,0.06)',
  },
  hadith: {
    bg1: '#071A12', bg2: '#0A2520', bg3: '#0D1F18',
    accent: '#34D399', accentBright: '#6EE7B7', accentSoft: 'rgba(52,211,153,',
    text: '#ECFDF5', textMuted: 'rgba(236,253,245,0.55)',
    glow: 'rgba(52,211,153,0.06)',
  },
  dhikr: {
    bg1: '#1A0A2E', bg2: '#2D1B4E', bg3: '#1A0F2E',
    accent: '#C084FC', accentBright: '#D8B4FE', accentSoft: 'rgba(192,132,252,',
    text: '#FAF5FF', textMuted: 'rgba(250,245,255,0.55)',
    glow: 'rgba(192,132,252,0.06)',
  },
  stats: {
    bg1: '#0F172A', bg2: '#1E1B4B', bg3: '#0C1425',
    accent: '#D4AF37', accentBright: '#E5C054', accentSoft: 'rgba(212,175,55,',
    text: '#F8FAFC', textMuted: 'rgba(248,250,252,0.55)',
    glow: 'rgba(212,175,55,0.06)',
  },
};

/* ---- Arabic Text Wrapping (RTL-aware) ---- */
function wrapArabicText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  // Split by spaces but keep Arabic words together
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/* ---- Wait for Arabic font to be ready ---- */
async function waitForFont(): Promise<string> {
  // Try to use the app's loaded Arabic fonts
  const preferred = ['Cairo', 'Amiri', 'Noto Naskh Arabic', 'Tajawal'];
  await document.fonts.ready;
  for (const font of preferred) {
    if (document.fonts.check(`bold 40px "${font}"`)) return font;
  }
  return 'sans-serif';
}

/* ---- Draw Islamic Geometric Border ---- */
function drawIslamicFrame(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, lineWidth: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';

  // Outer frame
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 32);
  ctx.stroke();

  // Inner frame
  const inset = 14;
  ctx.beginPath();
  ctx.roundRect(x + inset, y + inset, w - inset * 2, h - inset * 2, 22);
  ctx.stroke();

  // Corner ornaments (octagonal star pattern)
  const cornerSize = 36;
  const corners = [
    { cx: x + inset + 4, cy: y + inset + 4 },
    { cx: x + w - inset - 4, cy: y + inset + 4 },
    { cx: x + inset + 4, cy: y + h - inset - 4 },
    { cx: x + w - inset - 4, cy: y + h - inset - 4 },
  ];

  corners.forEach(({ cx, cy }) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 - Math.PI / 8;
      const px = cx + Math.cos(angle) * cornerSize * 0.7;
      const py = cy + Math.sin(angle) * cornerSize * 0.7;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  });

  ctx.restore();
}

/* ---- Draw Decorative Islamic Arch ---- */
function drawArch(ctx: CanvasRenderingContext2D, cx: number, baseY: number, width: number, height: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Pointed arch
  const halfW = width / 2;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, baseY);
  // Left side up
  ctx.lineTo(cx - halfW, baseY - height * 0.4);
  // Left curve to peak
  ctx.quadraticCurveTo(cx - halfW, baseY - height, cx - halfW * 0.15, baseY - height);
  // Peak
  ctx.lineTo(cx + halfW * 0.15, baseY - height);
  // Right curve from peak
  ctx.quadraticCurveTo(cx + halfW, baseY - height, cx + halfW, baseY - height * 0.4);
  // Right side down
  ctx.lineTo(cx + halfW, baseY);
  ctx.stroke();

  // Inner arch
  const inset = 10;
  const ihw = halfW - inset;
  const ih = height - inset;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - ihw, baseY);
  ctx.lineTo(cx - ihw, baseY - ih * 0.4);
  ctx.quadraticCurveTo(cx - ihw, baseY - ih, cx - ihw * 0.15, baseY - ih);
  ctx.lineTo(cx + ihw * 0.15, baseY - ih);
  ctx.quadraticCurveTo(cx + ihw, baseY - ih, cx + ihw, baseY - ih * 0.4);
  ctx.lineTo(cx + ihw, baseY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

/* ---- Draw Geometric Pattern Overlay ---- */
function drawPatternOverlay(ctx: CanvasRenderingContext2D, p: typeof PALETTES.verse) {
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 0.8;

  // Repeating diamond grid
  const gridSize = 80;
  for (let row = -1; row < H / gridSize + 1; row++) {
    for (let col = -1; col < W / gridSize + 1; col++) {
      const cx = col * gridSize + (row % 2 ? gridSize / 2 : 0);
      const cy = row * gridSize * 0.866;
      ctx.beginPath();
      ctx.moveTo(cx, cy - gridSize * 0.4);
      ctx.lineTo(cx + gridSize * 0.4, cy);
      ctx.lineTo(cx, cy + gridSize * 0.4);
      ctx.lineTo(cx - gridSize * 0.4, cy);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ---- Draw Ornamental Divider ---- */
function drawDivider(ctx: CanvasRenderingContext2D, cx: number, y: number, width: number, color: string) {
  ctx.save();
  const grad = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.2, color);
  grad.addColorStop(0.5, 'transparent');
  grad.addColorStop(0.8, color);
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - width / 2, y);
  ctx.lineTo(cx + width / 2, y);
  ctx.stroke();

  // Center diamond
  const ds = 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, y - ds);
  ctx.lineTo(cx + ds, y);
  ctx.lineTo(cx, y + ds);
  ctx.lineTo(cx - ds, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ---- Draw Glow Orbs ---- */
function drawGlowOrbs(ctx: CanvasRenderingContext2D, p: typeof PALETTES.verse) {
  // Top glow
  const g1 = ctx.createRadialGradient(W * 0.5, H * 0.15, 0, W * 0.5, H * 0.15, 500);
  g1.addColorStop(0, p.glow);
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Bottom-right glow
  const g2 = ctx.createRadialGradient(W * 0.8, H * 0.85, 0, W * 0.8, H * 0.85, 400);
  g2.addColorStop(0, p.glow);
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
}

/* ---- Draw Bismillah ---- */
function drawBismillah(ctx: CanvasRenderingContext2D, y: number, font: string, p: typeof PALETTES.verse) {
  ctx.save();
  ctx.fillStyle = p.accent;
  ctx.globalAlpha = 0.7;
  ctx.font = `500 30px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', W / 2, y);
  ctx.restore();
}

/* ============================================
   VERSE / HADITH / DHIKR CARD
   ============================================ */
function drawContentCard(ctx: CanvasRenderingContext2D, options: ShareCardOptions, font: string) {
  const { text, footer, type = 'verse' } = options;
  const p = PALETTES[type];

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bgGrad.addColorStop(0, p.bg1);
  bgGrad.addColorStop(0.5, p.bg2);
  bgGrad.addColorStop(1, p.bg3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Pattern overlay
  drawPatternOverlay(ctx, p);

  // Glow orbs
  drawGlowOrbs(ctx, p);

  // Islamic frame
  const frameX = 60;
  const frameY = 120;
  const frameW = W - 120;
  const frameH = H - 280;
  drawIslamicFrame(ctx, frameX, frameY, frameW, frameH, `${p.accentSoft}0.2)`, 1);

  // Arch at top center
  drawArch(ctx, W / 2, frameY + 100, 260, 160, `${p.accentSoft}0.15)`);

  // Type badge
  const badgeTexts: Record<string, string> = {
    verse: '﴿ آية كريمة ﴾',
    hadith: 'حديث شريف',
    dhikr: 'ذكر وتسبيح',
  };
  const badgeText = badgeTexts[type] || 'أذكاري';
  ctx.save();
  ctx.font = `600 22px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  const badgeW = ctx.measureText(badgeText).width + 48;

  // Badge background
  ctx.fillStyle = `${p.accentSoft}0.1)`;
  ctx.beginPath();
  ctx.roundRect(W / 2 - badgeW / 2, frameY + 60, badgeW, 44, 22);
  ctx.fill();
  ctx.strokeStyle = `${p.accentSoft}0.25)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Badge text
  ctx.fillStyle = p.accent;
  ctx.fillText(badgeText, W / 2, frameY + 88);
  ctx.restore();

  // Bismillah (for verse and hadith)
  if (type === 'verse' || type === 'hadith') {
    drawBismillah(ctx, frameY + 170, font, p);
    drawDivider(ctx, W / 2, frameY + 200, 400, `${p.accentSoft}0.2)`);
  }

  // Main text
  ctx.save();
  ctx.fillStyle = p.text;
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  const textArea = {
    x: frameX + 60,
    y: type === 'verse' || type === 'hadith' ? frameY + 240 : frameY + 150,
    w: frameW - 120,
  };

  // Auto-size font based on text length
  let fontSize = text.length > 150 ? 34 : text.length > 80 ? 38 : text.length > 40 ? 44 : 52;
  ctx.font = `bold ${fontSize}px "${font}", sans-serif`;
  let lines = wrapArabicText(ctx, text, textArea.w);

  // If too many lines, reduce font
  while (lines.length > 12 && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "${font}", sans-serif`;
    lines = wrapArabicText(ctx, text, textArea.w);
  }

  const lineHeight = fontSize * 1.9;
  const textBlockH = lines.length * lineHeight;
  const textStartY = textArea.y + Math.max(0, (frameH - 340 - textBlockH) / 2);

  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, textStartY + i * lineHeight);
  });
  ctx.restore();

  // Footer (source/narrator)
  if (footer) {
    const footerY = Math.min(textStartY + textBlockH + 60, frameY + frameH - 80);
    drawDivider(ctx, W / 2, footerY - 20, 350, `${p.accentSoft}0.15)`);

    ctx.save();
    ctx.fillStyle = p.accent;
    ctx.globalAlpha = 0.85;
    ctx.font = `500 24px "${font}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillText(footer, W / 2, footerY + 20);
    ctx.restore();
  }

  // Bottom branding area
  const brandY = H - 100;
  drawDivider(ctx, W / 2, brandY, 500, `${p.accentSoft}0.12)`);

  // App name
  ctx.save();
  ctx.fillStyle = p.accent;
  ctx.font = `bold 26px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('أذكاري', W / 2, brandY + 35);
  ctx.fillStyle = p.textMuted;
  ctx.font = `400 16px "${font}", sans-serif`;
  ctx.fillText('تطبيق أذكار المسلم', W / 2, brandY + 60);
  ctx.restore();
}

/* ============================================
   STATS CARD
   ============================================ */
function drawStatsCard(ctx: CanvasRenderingContext2D, options: ShareCardOptions, font: string) {
  const p = PALETTES.stats;
  const { stats } = options;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bgGrad.addColorStop(0, p.bg1);
  bgGrad.addColorStop(0.5, p.bg2);
  bgGrad.addColorStop(1, p.bg3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  drawPatternOverlay(ctx, p);
  drawGlowOrbs(ctx, p);

  // Title area
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  // Top ornament
  drawArch(ctx, W / 2, 260, 200, 120, `${p.accentSoft}0.15)`);

  ctx.fillStyle = p.accent;
  ctx.font = `bold 22px "${font}", sans-serif`;
  ctx.fillText('أذكاري', W / 2, 200);

  ctx.fillStyle = p.text;
  ctx.font = `bold 48px "${font}", sans-serif`;
  ctx.fillText('رحلتي الروحانية', W / 2, 280);

  drawDivider(ctx, W / 2, 320, 500, `${p.accentSoft}0.2)`);
  ctx.restore();

  if (!stats) return;

  // Stats items
  const items = [
    {
      label: 'سلسلة الأيام المتتالية',
      value: `${stats.streak}`,
      unit: 'يوم',
      icon: '🔥',
      color: stats.streak >= 7 ? '#EF4444' : stats.streak >= 3 ? '#F97316' : p.accent,
    },
    {
      label: 'إجمالي الأذكار',
      value: stats.totalDhikr >= 1000 ? `${(stats.totalDhikr / 1000).toFixed(1)}K` : `${stats.totalDhikr}`,
      unit: 'ذكر',
      icon: '✨',
      color: '#A78BFA',
    },
    {
      label: 'مستوى شجرتي',
      value: `${stats.treeLevel}`,
      unit: 'من 10',
      icon: '🌳',
      color: '#34D399',
    },
  ];

  const cardW = W - 140;
  const cardH = 280;
  const startY = 400;
  const gap = 40;

  items.forEach((item, i) => {
    const cy = startY + i * (cardH + gap);

    // Card background
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.roundRect(70, cy, cardW, cardH, 28);
    ctx.fill();

    // Card border
    ctx.strokeStyle = `${item.color}18`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Left accent bar
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(70, cy, 6, cardH, 3);
    ctx.fill();

    // Icon circle
    const iconCx = 150;
    const iconCy = cy + cardH / 2;
    ctx.beginPath();
    ctx.arc(iconCx, iconCy, 44, 0, Math.PI * 2);
    ctx.fillStyle = `${item.color}15`;
    ctx.fill();

    // Icon (emoji as text)
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.icon, iconCx, iconCy + 12);

    // Value (large number)
    ctx.save();
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.fillStyle = item.color;
    ctx.font = `bold 72px "${font}", sans-serif`;
    ctx.fillText(item.value, W - 120, cy + cardH / 2 + 10);

    // Unit
    ctx.fillStyle = p.textMuted;
    ctx.font = `400 24px "${font}", sans-serif`;
    ctx.fillText(item.unit, W - 120, cy + cardH / 2 + 50);

    // Label
    ctx.fillStyle = p.textMuted;
    ctx.font = `500 20px "${font}", sans-serif`;
    ctx.fillText(item.label, W - 120, cy + cardH / 2 - 40);
    ctx.restore();
  });

  // Motivational quote at bottom
  const quoteY = startY + 3 * (cardH + gap) + 20;
  drawDivider(ctx, W / 2, quoteY, 400, `${p.accentSoft}0.12)`);

  ctx.save();
  ctx.fillStyle = p.textMuted;
  ctx.font = `400 22px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('"أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"', W / 2, quoteY + 40);
  ctx.fillStyle = `${p.accentSoft}0.4)`;
  ctx.font = `400 18px "${font}", sans-serif`;
  ctx.fillText('سورة الرعد: ٢٨', W / 2, quoteY + 70);
  ctx.restore();

  // Bottom branding
  const brandY = H - 100;
  drawDivider(ctx, W / 2, brandY, 500, `${p.accentSoft}0.12)`);
  ctx.save();
  ctx.fillStyle = p.accent;
  ctx.font = `bold 26px "${font}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('أذكاري', W / 2, brandY + 35);
  ctx.fillStyle = p.textMuted;
  ctx.font = `400 16px "${font}", sans-serif`;
  ctx.fillText('تطبيق أذكار المسلم', W / 2, brandY + 60);
  ctx.restore();
}

/* ============================================
   MAIN GENERATOR
   ============================================ */
export async function generateShareCard(options: ShareCardOptions): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Wait for Arabic font to be available
  const font = await waitForFont();

  const type = options.type || 'verse';

  if (type === 'stats') {
    drawStatsCard(ctx, options, font);
  } else {
    drawContentCard(ctx, options, font);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
  });
}

/* ============================================
   SHARE FUNCTION
   ============================================ */
export async function shareAsImage(options: ShareCardOptions) {
  const blob = await generateShareCard(options);
  if (!blob) return;

  const file = new File([blob], 'adhkar-story.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: 'أذكاري',
        text: options.text,
        files: [file],
      });
      return;
    } catch { /* user cancelled */ }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'adhkar-story.png';
  a.click();
  URL.revokeObjectURL(url);
}
