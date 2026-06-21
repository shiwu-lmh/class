/**
 * 可视化：GRU 细胞结构 —— 清晰示意图风格
 */
function initGRUViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="gru-canvas" style="width:680px;height:440px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <button id="gru-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 逐步展示</button>
        <button id="gru-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="gru-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="gru-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.55rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:60px;line-height:1.55"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem;line-height:1.4">
          <span style="color:#e74c3c">■</span> 重置门 &nbsp;
          <span style="color:#8b5cf6">■</span> 更新门<br>
          <span style="color:#5b9a7f">■</span> 候选状态 &nbsp;
          <span style="color:#4a90a4">■</span> 最终混合<br>
          <span style="font-size:0.65rem">vs LSTM：少1门+无独立Cₜ，参数≈75%</span>
        </div>
      </div>
    </div>`;

  const canvas = document.getElementById('gru-canvas');
  const infoEl = document.getElementById('gru-info');

  let curStep = 0;
  const totalSteps = 4;
  let autoTimer = null;

  function box(ctx, x, y, w, h, fill, stroke, lw, r) {
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r || 6); ctx.fill(); ctx.stroke();
  }

  function arrow(ctx, x1, y1, x2, y2, color, w, dash) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash([6, 5]); else ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const L = 10;
    ctx.fillStyle = color; ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - L * Math.cos(ang - 0.5), y2 - L * Math.sin(ang - 0.5));
    ctx.lineTo(x2 - L * Math.cos(ang + 0.5), y2 - L * Math.sin(ang + 0.5));
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function gate(ctx, x, y, w, h, sym, label, color, active, val) {
    const a = active ? 1 : 0.22;
    box(ctx, x, y, w, h,
      active ? color.replace(')', ',0.10)').replace('rgb', 'rgba') : '#f5f3ef',
      active ? color : '#e0dcd6', active ? 2.5 : 1, 5);
    ctx.fillStyle = active ? color : '#c0c5cc';
    ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(sym, x, y - 4);
    ctx.font = '8px sans-serif';
    ctx.fillText(label, x, y + 11);
    if (active && val !== undefined) {
      ctx.fillStyle = color; ctx.font = 'italic 8px sans-serif';
      ctx.fillText('=' + val, x, y - 22);
    }
  }

  function draw() {
    const r = Viz.ctx('gru-canvas');
    if (!r) return;
    const { ctx, w, h } = r;

    Viz.text(ctx, 'GRU 细胞 —— 两门控制 + 加权平均（LSTM 简化版）', w / 2, 18, { font: 'bold 13px sans-serif', color: '#2c3e50' });

    const a = [curStep >= 1, curStep >= 2, curStep >= 3, curStep >= 4];

    // ═══════════ 坐标布局 ═══════════
    const leftX = 55;
    const rightX = w - 55;
    const htPrevY = 75;
    const xtY = 120;
    const concatX = 175, concatY = 100;

    // 门的位置
    const gateW = 74, gateH = 42;
    const resetX = 320, resetY = 100;    // 重置门(左上)
    const updateX = 510, updateY = 100;  // 更新门(右上)

    // 候选状态
    const candX = 420, candY = 210;

    // rₜ·hₜ₋₁ 乘法
    const multX = 320, multY = 200;

    // 最终混合（底部大框）
    const finalY = 340;

    // ── 输入标签 ──
    ctx.fillStyle = a[0] ? '#4a90a4' : '#c0c5cc';
    ctx.font = (a[0] ? 'bold ' : '') + '11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('hₜ₋₁ (隐藏状态)', leftX + 25, htPrevY);
    ctx.fillStyle = a[0] ? '#5b9a7f' : '#c0c5cc';
    ctx.fillText('xₜ (当前输入)', leftX + 25, xtY);

    // ── 拼接块 ──
    if (a[0]) {
      box(ctx, concatX, concatY, 82, 42, 'rgba(74,144,164,0.06)', '#4a90a4', 1.8, 5);
      ctx.fillStyle = '#4a90a4'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[hₜ₋₁ , xₜ]', concatX, concatY);

      arrow(ctx, leftX + 40, htPrevY, concatX - 44, concatY - 8, 'rgba(74,144,164,0.4)', 1.5);
      arrow(ctx, leftX + 40, xtY, concatX - 44, concatY + 8, 'rgba(91,154,127,0.4)', 1.5);
    }

    // ── 两门 ──
    gate(ctx, resetX, resetY, gateW, gateH, 'rₜ', '重置门 σ', '#e74c3c', a[0], '0.3');
    gate(ctx, updateX, updateY, gateW, gateH, 'zₜ', '更新门 σ', '#8b5cf6', a[0], '0.5');

    // 拼接 → 两门
    if (a[0]) {
      arrow(ctx, concatX + 41, concatY - 6, resetX - gateW / 2, resetY - 8, 'rgba(231,76,60,0.3)', 1.2);
      arrow(ctx, concatX + 41, concatY + 6, updateX - gateW / 2, updateY + 8, 'rgba(139,92,246,0.3)', 1.2);
    }

    // ── rₜ·hₜ₋₁ 乘法块 ──
    if (a[1]) {
      box(ctx, multX, multY, 70, 24, 'rgba(231,76,60,0.06)', '#e74c3c', 1.5, 4);
      ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('rₜ·hₜ₋₁ = 0.18', multX, multY);

      // rₜ ↓
      arrow(ctx, resetX, resetY + gateH / 2, multX, multY - 12, '#e74c3c', 2);
      // hₜ₋₁ → 乘法（绕左侧）
      arrow(ctx, concatX - 41, concatY - 10, concatX - 41, multY, 'rgba(74,144,164,0.35)', 1.2);
      arrow(ctx, concatX - 41, multY, multX - 35, multY, 'rgba(74,144,164,0.35)', 1.2);
    }

    // ── 候选状态 h̃ₜ ──
    gate(ctx, candX, candY, gateW, gateH, 'h̃ₜ', '候选 tanh', '#5b9a7f', a[1], '0.8');
    if (a[1]) {
      // rₜ·hₜ₋₁ → h̃ₜ
      arrow(ctx, multX + 35, multY, candX - gateW / 2, candY - 5, '#e74c3c', 1.5);
      // xₜ → h̃ₜ (via concat)
      arrow(ctx, concatX + 41, concatY + 15, candX, candY - gateH / 2 + 2, 'rgba(91,154,127,0.35)', 1.2);
    }

    // ── hₜ 加权平均（底部大框） ──
    box(ctx, w / 2, finalY, 400, 44,
      a[2] ? 'rgba(74,144,164,0.06)' : 'rgba(148,163,179,0.02)',
      a[2] ? '#4a90a4' : '#e0dcd6', a[2] ? 2.5 : 1.5, 8);

    ctx.fillStyle = a[2] ? '#4a90a4' : '#94a3b3';
    ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(a[2]
      ? 'hₜ = (1−zₜ)·hₜ₋₁ + zₜ·h̃ₜ = 0.5×0.6 + 0.5×0.8 = 0.70'
      : 'hₜ = (1−zₜ)·hₜ₋₁ + zₜ·h̃ₜ  (更新门控制加权平均)', w / 2, finalY);

    if (a[2]) {
      // h̃ₜ ↓
      arrow(ctx, candX, candY + gateH / 2, candX, finalY - 22, '#5b9a7f', 2.5);
      ctx.fillStyle = '#8b5cf6'; ctx.font = 'italic 10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText('zₜ=' + 0.5, candX + 55, finalY - 16);

      // zₜ 控制（虚线从更新门下来）
      arrow(ctx, updateX, updateY + gateH / 2, w / 2 + 80, finalY - 16, '#8b5cf6', 2, true);
      ctx.fillStyle = '#8b5cf6'; ctx.font = 'italic 10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('1−zₜ=' + 0.5, w / 2 - 200, finalY - 16);

      // hₜ₋₁ 绕左侧下来
      arrow(ctx, leftX + 25, htPrevY, leftX + 25, finalY, 'rgba(74,144,164,0.45)', 2, true);
      arrow(ctx, leftX + 25, finalY, w / 2 - 200, finalY, 'rgba(74,144,164,0.45)', 2);

      // hₜ 输出
      arrow(ctx, w / 2 + 200, finalY, rightX, finalY, '#4a90a4', 3);
      ctx.fillStyle = '#4a90a4'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('hₜ →', rightX - 5, finalY - 14);
      ctx.fillText('隐藏状态(新)', rightX - 5, finalY + 16);
      ctx.fillStyle = '#94a3b3'; ctx.font = 'italic 9px sans-serif';
      ctx.fillText('GRU 无独立 Cₜ——hₜ 身兼两职', w / 2, finalY + 36);
    }

    // ── 底部图例 ──
    const ly = h - 12;
    ctx.font = '8px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const items = [
      { c: '#e74c3c', t: '重置门：控制忽略多少历史' },
      { c: '#8b5cf6', t: '更新门：控制新旧混合比例' },
      { c: '#5b9a7f', t: '候选 tanh：提取新候选信息' },
      { c: '#4a90a4', t: '加权平均：hₜ = (1−z)·hₜ₋₁ + z·h̃ₜ' }
    ];
    let lx = 30;
    items.forEach(it => {
      ctx.fillStyle = it.c; ctx.fillRect(lx, ly - 5, 10, 10);
      ctx.fillStyle = '#6b7c8b'; ctx.fillText(it.t, lx + 14, ly);
      lx += ctx.measureText(it.t).width + 28;
    });
    ctx.textBaseline = 'alphabetic';
  }

  function step() {
    if (curStep >= totalSteps) return;
    curStep++;
    draw();
    const msgs = [
      '',
      '<strong>① 两门同时计算：</strong><span style="color:#e74c3c">rₜ = σ(...)</span> 控制忽略多少历史；<span style="color:#8b5cf6">zₜ = σ(...)</span> 控制新旧混合比例。<br>GRU 仅 <strong>2 个门</strong>（vs LSTM 的 3 个门）。',
      '<strong>② 候选状态：</strong>h̃ₜ = tanh(W·[<span style="color:#e74c3c">rₜ·hₜ₋₁</span>, xₜ] + b)。<br>重置门先<span style="color:#e74c3c">弱化历史</span>（rₜ 小时忽略更多），再与 xₜ 一起提取新信息。',
      '<strong>③ ⭐ 最终状态：</strong>hₜ = (1−zₜ)·hₜ₋₁ + zₜ·h̃ₜ。<br><span style="color:#8b5cf6">zₜ</span> 在旧状态和新候选之间做<span style="color:#8b5cf6">加权平均</span>——zₜ 大→偏向新信息，zₜ 小→保留旧状态。<br>无独立 Cₜ，hₜ 同时承担长期记忆和对外输出。',
      '✅ <strong>GRU vs LSTM：</strong>少了输出门 + 无 Cₜ 状态 → 参数约 <strong>75%</strong>，训练更快，效果接近。hₜ 身兼两职（记忆+输出）。'
    ];
    infoEl.innerHTML = msgs[curStep];
  }

  function resetViz() {
    curStep = 0; draw();
    infoEl.innerHTML = '🔍 <strong>GRU 细胞：</strong>2 个 Sigmoid 门 + 1 个 Tanh 候选。hₜ₋₁ 和 h̃ₜ 通过 zₜ 做加权平均得到 hₜ。<br>比 LSTM 简单：少 1 个门 + 无独立细胞状态 → 参数约 75%。点击逐步展示。';
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('gru-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('gru-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (curStep >= totalSteps) { clearInterval(autoTimer); autoTimer = null; document.getElementById('gru-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 1100);
  }

  document.getElementById('gru-step').addEventListener('click', step);
  document.getElementById('gru-auto').addEventListener('click', toggleAuto);
  document.getElementById('gru-reset').addEventListener('click', resetViz);
  draw(); resetViz();
  window.addEventListener('resize', draw);
}
