/**
 * 可视化：RNN 循环神经网络 —— 时间步展开与隐状态流动
 */
function initRNNViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="rnn-canvas" style="width:640px;height:440px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="rnn-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 推进时间步</button>
        <button id="rnn-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="rnn-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="rnn-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.55rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:55px;line-height:1.55"></div>
        <div style="font-size:0.73rem;color:var(--text-muted);margin-top:0.4rem">3个时间步 · hₜ = tanh(W·hₜ₋₁ + U·xₜ + b) · 序列"我 爱 你"</div>
      </div>
    </div>`;

  const canvas = document.getElementById('rnn-canvas');
  const infoEl = document.getElementById('rnn-info');

  const words = ['我', '爱', '你'];
  const hiddenStates = [
    [0.76, 0.20, 0.01],
    [0.65, 0.68, 0.28],
    [0.31, 0.45, 0.81]
  ];
  const outputs = [
    [0.55, 0.25, 0.15, 0.05],
    [0.20, 0.60, 0.15, 0.05],
    [0.10, 0.15, 0.20, 0.55]
  ];

  let curStep = 0;
  let autoTimer = null;

  // ── 布局常量 ──
  const stepW = 190;            // 时间步宽度
  const leftPad = 65;           // 左边距
  const topY = 55;              // 顶部
  const inR = 16;               // 输入圆半径
  const cellW = 76, cellH = 52; // RNN 单元尺寸
  const outR = 16;              // 输出圆半径
  const gapInToCell = 28;       // 输入→单元间距
  const gapCellToOut = 30;      // 单元→输出间距

  // 每个时间步的绝对坐标计算
  function stepX(t) { return leftPad + t * stepW; }
  function inY() { return topY + 30; }
  function cellY() { return inY() + inR + gapInToCell + cellH / 2; }
  function outY() { return cellY() + cellH / 2 + gapCellToOut + outR; }

  function drawArrowLine(ctx, x1, y1, x2, y2, color, width, dashed) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dashed) ctx.setLineDash([4, 4]);
    else ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    // 画箭头
    const aLen = 7, angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - aLen * Math.cos(angle - 0.45), y2 - aLen * Math.sin(angle - 0.45));
    ctx.lineTo(x2 - aLen * Math.cos(angle + 0.45), y2 - aLen * Math.sin(angle + 0.45));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawRoundedNode(ctx, cx, cy, rw, rh, color, active) {
    ctx.fillStyle = active ? color : '#f5f3ef';
    ctx.strokeStyle = active ? color : '#e2ded6';
    ctx.lineWidth = active ? 2.3 : 1;
    ctx.beginPath(); ctx.roundRect(cx - rw / 2, cy - rh / 2, rw, rh, Math.min(rw, rh) / 2); ctx.fill(); ctx.stroke();
  }

  function drawCircle(ctx, cx, cy, r, color, active) {
    ctx.fillStyle = active ? color : '#f5f3ef';
    ctx.strokeStyle = active ? color : '#e2ded6';
    ctx.lineWidth = active ? 2.3 : 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  function draw() {
    const r = Viz.ctx('rnn-canvas');
    if (!r) return;
    const { ctx, w, h } = r;

    Viz.text(ctx, 'RNN 时间步展开 (Unrolled RNN)', w / 2, 20, { font: 'bold 13px sans-serif', color: '#2c3e50' });

    for (let t = 0; t < 3; t++) {
      const sx = stepX(t);
      const active = (t < curStep);

      // ── 时间步标签 + 词 ──
      ctx.fillStyle = active ? '#e8934a' : '#94a3b3';
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('t=' + (t + 1), sx, topY);
      ctx.fillStyle = active ? '#2c3e50' : '#c0c5cc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('"' + words[t] + '"', sx, topY + 20);

      // ── 输入 xₜ ──
      const ix = sx, iy = inY();
      drawCircle(ctx, ix, iy, inR, '#5b9a7f', active);
      ctx.fillStyle = active ? '#fff' : '#c0c5cc';
      ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('x' + (t + 1), ix, iy);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#6b7c8b'; ctx.font = '9px sans-serif';
      ctx.fillText('输入', ix, iy + inR + 12);

      // ── RNN 单元 hₜ ──
      const hx = sx, hy = cellY();
      drawRoundedNode(ctx, hx, hy, cellW, cellH, '#4a90a4', active);
      ctx.fillStyle = active ? '#fff' : '#c0c5cc';
      ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('h' + (t + 1), hx, hy - 5);
      ctx.fillText('tanh', hx, hy + 13);
      ctx.textBaseline = 'alphabetic';

      if (active) {
        ctx.fillStyle = '#2c3e50'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('[' + hiddenStates[t].map(v => v.toFixed(2)).join(',') + ']', hx, hy + cellH / 2 + 14);
      }

      // ── 输出 yₜ ──
      const ox = sx, oy = outY();
      drawCircle(ctx, ox, oy, outR, '#e8934a', active);
      ctx.fillStyle = active ? '#fff' : '#c0c5cc';
      ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('y' + (t + 1), ox, oy);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#6b7c8b'; ctx.font = '9px sans-serif';
      ctx.fillText('输出', ox, oy + outR + 12);

      if (active) {
        ctx.fillStyle = '#2c3e50'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('[' + outputs[t].map(v => v.toFixed(2)).join(',') + ']', ox, oy + outR + 26);
      }

      // ── 连接：xₜ → hₜ (U·xₜ) ──
      drawArrowLine(ctx, ix, iy + inR, hx, hy - cellH / 2, active ? 'rgba(91,154,127,0.6)' : 'rgba(148,163,179,0.2)', active ? 1.8 : 0.8, true);
      if (active) {
        ctx.fillStyle = '#5b9a7f'; ctx.font = 'italic 9px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('U·x' + (t + 1), hx + cellW / 2 + 5, (iy + inR + hy - cellH / 2) / 2);
      }

      // ── 连接：hₜ → yₜ (V·hₜ) ──
      drawArrowLine(ctx, hx, hy + cellH / 2, ox, oy - outR, active ? 'rgba(232,147,74,0.6)' : 'rgba(148,163,179,0.2)', active ? 1.8 : 0.8, true);
      if (active) {
        ctx.fillStyle = '#e8934a'; ctx.font = 'italic 9px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('V·h' + (t + 1), hx + cellW / 2 + 5, (hy + cellH / 2 + oy - outR) / 2);
      }

      // ── 循环连接：hₜ₋₁ → hₜ (W·hₜ₋₁) ──
      if (t > 0) {
        const prevHx = stepX(t - 1);
        // 从上一个单元右侧 → 当前单元左侧，走顶部弧线
        const sx1 = prevHx + cellW / 2 + 2;
        const sy1 = hy - 12;
        const sx2 = hx - cellW / 2 - 2;
        const sy2 = hy - 12;
        const midX = (sx1 + sx2) / 2;
        const arcH = 35;

        ctx.strokeStyle = active ? 'rgba(74,144,164,0.55)' : 'rgba(148,163,179,0.15)';
        ctx.lineWidth = active ? 2.2 : 1;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.bezierCurveTo(midX, sy1 - arcH, midX, sy2 - arcH, sx2, sy2);
        ctx.stroke();

        // 箭头在终点
        if (active) {
          ctx.fillStyle = '#4a90a4';
          ctx.beginPath();
          ctx.moveTo(sx2, sy2);
          ctx.lineTo(sx2 - 7, sy2 - 4);
          ctx.lineTo(sx2 - 7, sy2 + 4);
          ctx.closePath(); ctx.fill();
        }

        if (active) {
          ctx.fillStyle = '#4a90a4'; ctx.font = 'italic 9px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('W·h' + t, midX, sy1 - arcH - 8);
        }
      }

      // ── h₀ 标注 ──
      if (t === 0) {
        ctx.fillStyle = '#94a3b3'; ctx.font = 'italic 9px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('h₀=[0,0,0]', hx - cellW / 2 - 8, hy + 4);
      }
    }

    // ── 底部图例 ──
    const ly = h - 18;
    const legends = [
      { c: '#5b9a7f', t: 'U (W_ih): 输入→隐藏' },
      { c: '#4a90a4', t: 'W (W_hh): 隐藏→隐藏 (循环)' },
      { c: '#e8934a', t: 'V (W_ho): 隐藏→输出' }
    ];
    const totalW = legends.reduce((s, l) => s + ctx.measureText(l.t).width + 22, 0);
    let lx = (w - totalW) / 2;
    ctx.font = '9px sans-serif'; ctx.textBaseline = 'middle';
    legends.forEach(l => {
      ctx.fillStyle = l.c; ctx.beginPath(); ctx.arc(lx + 4, ly, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6b7c8b'; ctx.textAlign = 'left';
      ctx.fillText(l.t, lx + 12, ly);
      lx += ctx.measureText(l.t).width + 24;
    });
    ctx.textBaseline = 'alphabetic';
  }

  function step() {
    if (curStep >= 3) return;
    curStep++;
    draw();
    const msgs = [
      '',
      '<strong>t=1：</strong>h₁ = tanh(U·x₁ + b) &emsp;（h₀=[0,0,0]，无历史）<br>输入"我" → h₁=[' + hiddenStates[0].map(v => v.toFixed(2)).join(',') + '] → 输出概率分布 y₁',
      '<strong>t=2：</strong>h₂ = tanh(<span style="color:#4a90a4">W·h₁</span> + <span style="color:#5b9a7f">U·x₂</span> + b)<br>输入"爱"，融合历史记忆 h₁——体现<strong>上下文理解</strong>',
      '<strong>t=3：</strong>h₃ = tanh(<span style="color:#4a90a4">W·h₂</span> + <span style="color:#5b9a7f">U·x₃</span> + b)<br>✅ 完成！核心：<strong>新输入 xₜ + 历史记忆 hₜ₋₁ → 新状态 hₜ → 输出 yₜ</strong><br><span style="color:#6b7c8b;font-size:0.75rem">⚠ 序列长时 tanh 梯度连乘→梯度消失→LSTM/GRU 解决</span>'
    ];
    infoEl.innerHTML = msgs[curStep];
  }

  function resetViz() {
    curStep = 0; draw();
    infoEl.innerHTML = '🔍 <strong>RNN 核心公式：</strong>hₜ = tanh(W·hₜ₋₁ + U·xₜ + b)。点击推进观察数据在时间步之间流动。<br><span style="color:#6b7c8b;font-size:0.75rem">绿色=输入连接(U) · 蓝色=循环连接(W) · 橙色=输出连接(V)</span>';
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('rnn-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('rnn-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (curStep >= 3) { clearInterval(autoTimer); autoTimer = null; document.getElementById('rnn-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 1000);
  }

  document.getElementById('rnn-step').addEventListener('click', step);
  document.getElementById('rnn-auto').addEventListener('click', toggleAuto);
  document.getElementById('rnn-reset').addEventListener('click', resetViz);
  draw(); resetViz();
  window.addEventListener('resize', draw);
}
