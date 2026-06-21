/**
 * 可视化核心工具 —— 所有交互 Demo 共享的 Canvas 辅助函数
 */

const Viz = {
  // 获取 Canvas 2D 上下文
  ctx(id) {
    const c = document.getElementById(id);
    if (!c) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    return { ctx, w: rect.width, h: rect.height };
  },

  // 绘制坐标轴
  axis(ctx, ox, oy, w, h, opts = {}) {
    const { xLabel = '', yLabel = '', color = '#94a3b3', arrowSize = 6 } = opts;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(w - 20, oy); // X 轴
    ctx.moveTo(ox, oy); ctx.lineTo(ox, 20);      // Y 轴
    ctx.stroke();
    // 箭头
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(w - 20, oy); ctx.lineTo(w - 20 - arrowSize, oy - arrowSize); ctx.lineTo(w - 20 - arrowSize, oy + arrowSize); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox - arrowSize, 20 + arrowSize); ctx.lineTo(ox + arrowSize, 20 + arrowSize); ctx.fill();
    if (xLabel) { ctx.fillStyle = '#6b7c8b'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(xLabel, w - 30, oy + 20); }
    if (yLabel) { ctx.save(); ctx.translate(ox - 25, 40); ctx.rotate(-Math.PI / 2); ctx.fillText(yLabel, 0, 0); ctx.restore(); }
  },

  // 绘制点
  point(ctx, x, y, r = 5, color = '#4a90a4') {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  },

  // 绘制线
  line(ctx, x1, y1, x2, y2, color = '#4a90a4', width = 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  },

  // 绘制文本
  text(ctx, text, x, y, opts = {}) {
    const { color = '#2c3e50', font = '13px sans-serif', align = 'center' } = opts;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  },

  // 绘制按钮
  drawButton(ctx, x, y, w, h, text, active = false) {
    ctx.fillStyle = active ? '#4a90a4' : '#fff';
    ctx.strokeStyle = '#4a90a4';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = active ? '#fff' : '#4a90a4';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
  },

  // 检测按钮点击
  hitButton(mx, my, bx, by, bw, bh) {
    return mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
  },

  // HSL 颜色生成
  hsl(h, s = 70, l = 55) { return `hsl(${h},${s}%,${l}%)`; },

  // 圆角矩形
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  },
};
