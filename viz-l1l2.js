/**
 * 可视化：L1 vs L2 正则化 —— 权重收缩对比
 * 用户可点击切换 L1/L2，观察权重如何被惩罚
 */
function initL1L2Viz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="l1l2-canvas" style="width:440px;height:350px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <div style="margin-bottom:0.8rem">
          <button class="l1l2-btn active" data-mode="l1" style="padding:0.4rem 1rem;margin-right:0.4rem;border:2px solid #4a90a4;border-radius:20px;background:#4a90a4;color:#fff;cursor:pointer;font-weight:600;font-size:0.85rem">L1 (Lasso)</button>
          <button class="l1l2-btn" data-mode="l2" style="padding:0.4rem 1rem;margin-right:0.4rem;border:2px solid #4a90a4;border-radius:20px;background:#fff;color:#4a90a4;cursor:pointer;font-weight:600;font-size:0.85rem">L2 (Ridge)</button>
        </div>
        <div style="font-size:0.82rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>λ 惩罚强度：</strong></div>
          <input type="range" id="l1l2-lambda" min="0" max="50" value="20" style="width:100%">
          <div style="display:flex;justify-content:space-between;font-size:0.75rem"><span>λ=0</span><span>λ=0.5</span></div>
          <div style="margin-top:0.8rem;background:#fefdf8;padding:0.6rem;border-radius:6px;border-left:3px solid #e8934a">
            <span id="l1l2-info" style="font-size:0.82rem"></span>
          </div>
        </div>
      </div>
    </div>`;

  const canvas = document.getElementById('l1l2-canvas');
  const lambdaSlider = document.getElementById('l1l2-lambda');
  const infoEl = document.getElementById('l1l2-info');
  let mode = 'l1';
  let lambda = 0.2;

  function draw() {
    const r = Viz.ctx('l1l2-canvas');
    if (!r) return;
    const { ctx, w, h } = r;
    const cx = w / 2, cy = h / 2;

    // 背景等高线（同心圆 = L2等值线）
    for (let i = 1; i <= 4; i++) {
      const rad = 60 * i / 4;
      ctx.strokeStyle = 'rgba(74,144,164,0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
    }

    // 绘制 L1 菱形 或 L2 圆形 约束域
    ctx.fillStyle = mode === 'l1' ? 'rgba(200,120,90,0.15)' : 'rgba(74,144,164,0.15)';
    ctx.strokeStyle = mode === 'l1' ? '#c87a5b' : '#4a90a4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (mode === 'l1') {
      const r = 100 * (1 - lambda * 0.8);
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r); ctx.lineTo(cx - r, cy); ctx.closePath();
    } else {
      ctx.arc(cx, cy, 100 * (1 - lambda * 0.8), 0, Math.PI * 2);
    }
    ctx.fill(); ctx.stroke();

    // 原始权重位置
    const origX = cx + 60, origY = cy - 55;
    Viz.point(ctx, origX, origY, 6, '#2c3e50');
    Viz.text(ctx, '原始 W', origX + 22, origY + 4, { font: '11px sans-serif', color: '#2c3e50', align: 'left' });

    // 收缩后权重
    let newX, newY;
    if (mode === 'l1') {
      // L1: 往菱形边界收缩，可能变为零
      const d = Math.abs(origX - cx) + Math.abs(origY - cy);
      const rDiamond = 100 * (1 - lambda * 0.8);
      if (d <= rDiamond || lambda < 0.01) { newX = origX; newY = origY; }
      else {
        const ratio = rDiamond / d;
        newX = cx + (origX - cx) * ratio;
        newY = cy + (origY - cy) * ratio;
        // L1 特性：可能把某个坐标压为0
        if (lambda > 0.3 && Math.abs(newX - cx) < 12) newX = cx;
        if (lambda > 0.3 && Math.abs(newY - cy) < 12) newY = cy;
      }
    } else {
      // L2: 往圆形边界均匀收缩
      const dist = Math.sqrt((origX - cx) ** 2 + (origY - cy) ** 2);
      const rCircle = 100 * (1 - lambda * 0.8);
      if (dist <= rCircle || lambda < 0.01) { newX = origX; newY = origY; }
      else {
        newX = cx + (origX - cx) * rCircle / dist;
        newY = cy + (origY - cy) * rCircle / dist;
      }
    }
    Viz.point(ctx, newX, newY, 7, '#e8934a');
    Viz.line(ctx, origX, origY, newX, newY, '#e8934a', 2);
    Viz.text(ctx, '收缩后 W', newX - 22, newY - 12, { font: 'bold 11px sans-serif', color: '#e8934a', align: 'right' });

    // 图例
    Viz.text(ctx, mode === 'l1' ? 'L1 菱形约束域' : 'L2 圆形约束域', cx, h - 25, { font: 'bold 12px sans-serif', color: mode === 'l1' ? '#c87a5b' : '#4a90a4' });

    // 信息
    const shrinkDist = Math.sqrt((newX - cx) ** 2 + (newY - cy) ** 2);
    const origDist = Math.sqrt((origX - cx) ** 2 + (origY - cy) ** 2);
    const pct = ((1 - shrinkDist / origDist) * 100).toFixed(0);
    if (mode === 'l1') {
      const isZero = (Math.abs(newX - cx) < 2 || Math.abs(newY - cy) < 2);
      infoEl.innerHTML = isZero
        ? `✅ <strong>L1 效果：部分权重变为 0！</strong>（稀疏解 → 自动特征选择）`
        : `🔹 L1 收缩 ${pct}%：权重向零靠近。λ越大，越可能产生<strong>稀疏解</strong>`;
    } else {
      infoEl.innerHTML = `🔹 L2 收缩 ${pct}%：权重均匀缩小，但<strong>不会变为零</strong>（权重衰减）`;
    }
  }

  // 事件
  container.querySelectorAll('.l1l2-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      container.querySelectorAll('.l1l2-btn').forEach(b => { b.classList.remove('active'); b.style.background = '#fff'; b.style.color = '#4a90a4'; });
      this.classList.add('active'); this.style.background = '#4a90a4'; this.style.color = '#fff';
      mode = this.dataset.mode;
      draw();
    });
  });

  lambdaSlider.addEventListener('input', function () {
    lambda = this.value / 100;
    draw();
  });

  // 点击切换权重位置
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // 重置权重到点击位置
    const cx = 440 / 2, cy = 350 / 2;
    // Just redraw - the viz is parameter-based
    draw();
  });

  draw();
  window.addEventListener('resize', draw);
}
