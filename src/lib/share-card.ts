// ==================== إنشاء بطاقات مشاركة جميلة ====================

interface ShareCardOptions {
  text: string;
  footer?: string;
  type?: 'verse' | 'hadith' | 'dhikr' | 'stats';
  stats?: { streak: number; totalDhikr: number; treeLevel: number };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
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

function drawCorners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, size: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // Top-right
  ctx.beginPath(); ctx.moveTo(x + w, y + size); ctx.lineTo(x + w, y); ctx.lineTo(x + w - size, y); ctx.stroke();
  // Top-left
  ctx.beginPath(); ctx.moveTo(x + size, y); ctx.lineTo(x, y); ctx.lineTo(x, y + size); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size); ctx.stroke();
}

export async function generateShareCard(options: ShareCardOptions): Promise<Blob | null> {
  const { text, footer, type = 'verse', stats } = options;
  const W = 1080;
  const H = 1080;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isDark = true;
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  if (type === 'stats') {
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1a0f2e');
  } else if (type === 'hadith') {
    bgGrad.addColorStop(0, '#0c1220');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#0c1220');
  } else {
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Gold accent circle glow
  const radGrad = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, 500);
  radGrad.addColorStop(0, 'rgba(197, 160, 89, 0.08)');
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, W, H);

  if (type === 'stats') {
    // Stats card layout
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('تقريري في أذكاري', W / 2, 120);

    // Decorative line
    const lineGrad = ctx.createLinearGradient(W * 0.25, 0, W * 0.75, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.6)');
    lineGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(W * 0.25, 145, W * 0.5, 1);

    if (stats) {
      const items = [
        { label: 'سلسلة الأيام', value: `${stats.streak} يوم`, icon: '★' },
        { label: 'إجمالي الأذكار', value: `${stats.totalDhikr}`, icon: '◆' },
        { label: 'مستوى الشجرة', value: `${stats.treeLevel}/7`, icon: '▲' },
      ];

      const startY = 260;
      const spacing = 180;
      items.forEach((item, i) => {
        const y = startY + i * spacing;
        // Circle background
        ctx.beginPath();
        ctx.arc(W / 2, y, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(197, 160, 89, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Value
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.value, W / 2, y + 12);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '18px sans-serif';
        ctx.fillText(item.label, W / 2, y + 80);
      });
    }
  } else {
    // Content card layout (verse, hadith, dhikr)
    const padX = 80;
    const padY = 100;
    const cardW = W - padX * 2;
    const cardH = H - padY * 2 - 80;

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(padX, padY, cardW, cardH, 24);
    ctx.fill();

    // Gold corners
    drawCorners(ctx, padX + 16, padY + 16, cardW - 32, cardH - 32, 40, 'rgba(197, 160, 89, 0.5)');

    // Type badge
    const badgeText = type === 'hadith' ? 'حديث اليوم' : type === 'dhikr' ? 'ذكر' : 'آية اليوم';
    ctx.fillStyle = 'rgba(197, 160, 89, 0.15)';
    const badgeW = ctx.measureText(badgeText).width + 40;
    ctx.font = '18px sans-serif';
    const measuredBadgeW = ctx.measureText(badgeText).width + 40;
    ctx.beginPath();
    ctx.roundRect(W / 2 - measuredBadgeW / 2, padY + 30, measuredBadgeW, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#C5A059';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, W / 2, padY + 54);

    // Main text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    const lines = wrapText(ctx, text, cardW - 100);
    const lineHeight = 58;
    const textStartY = padY + (cardH - lines.length * lineHeight) / 2 + 20;
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, textStartY + i * lineHeight);
    });

    // Footer (source/narrator)
    if (footer) {
      ctx.fillStyle = '#C5A059';
      ctx.font = '20px sans-serif';
      ctx.fillText(footer, W / 2, padY + cardH - 40);
    }
  }

  // App watermark
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('أذكاري', W / 2, H - 30);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
  });
}

export async function shareAsImage(options: ShareCardOptions) {
  const blob = await generateShareCard(options);
  if (!blob) return;

  const file = new File([blob], 'adhkar-card.png', { type: 'image/png' });

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
  a.download = 'adhkar-card.png';
  a.click();
  URL.revokeObjectURL(url);
}
