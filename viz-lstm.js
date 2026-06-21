/**
 * 可视化：LSTM 细胞结构 —— 清晰示意图风格
 */
function initLSTMViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="lstm-canvas" style="width:680px;height:460px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <button id="lstm-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 逐步展示</button>
        <button id="lstm-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="lstm-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="lstm-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.55rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:65px;line-height:1.55"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem;line-height:1.4">
          <span style="color:#e74c3c">■</span> 遗忘门 &nbsp;
          <span style="color:#e8934a">■</span> 输入门<br>
          <span style="color:#5b9a7f">■</span> 候选记忆 &nbsp;
          <span style="color:#4a90a4">■</span> 输出门<br>
          <span style="color:#e8934a">══</span> Cₜ 细胞状态高速公路
        </div>
      </div>
    </div>`;

  const canvas = document.getElementById('lstm-canvas');
  const infoEl = document.getElementById('lstm-info');

  let curStep = 0;
  const totalSteps = 5;
  let autoTimer = null;

  // ── 辅助函数 ──

  // 绘制圆角矩形框
  function box(ctx, x, y, w, h, fill, stroke, lw, r) {
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r || 6); ctx.fill(); ctx.stroke();
  }

  // 绘制粗箭头线
  function arrow(ctx, x1, y1, x2, y2, color, w, dash) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash([6, 5]); else ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    // 箭头三角
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

  // 绘制门块（小矩形 + 符号 + 标签）
  function gate(ctx, x, y, w, h, sym, label, color, active, val) {
    const a = active ? 1 : 0.22;
    box(ctx, x, y, w, h,
      active ? color.replace(')', ',0.10)').replace('rgb', 'rgba') : '#f5f3ef',
      active ? color : '#e0dcd6', active ? 2.5 : 1, 5);
    ctx.fillStyle = active ? color : '#c0c5cc';
    ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(sym, x, y - 3);
    ctx.font = '8px sans-serif';
    ctx.fillText(label, x, y + 12);
    if (active && val !== undefined) {
      ctx.fillStyle = color; ctx.font = 'italic 8px sans-serif';
      ctx.fillText('=' + val, x, y - 20);
    }
  }

  function draw() {
    const r = Viz.ctx('lstm-canvas');
    if (!r) return;
    const { ctx, w, h } = r;

    Viz.text(ctx, 'LSTM 细胞 —— 三门控制 + 细胞状态高速公路', w / 2, 18, { font: 'bold 13px sans-serif', color: '#2c3e50' });

    const a = [curStep >= 1, curStep >= 2, curStep >= 3, curStep >= 4, curStep >= 5];

    // ═══════════ 坐标布局 ═══════════
    const hwY = 230;              // 高速公路 Y 坐标（水平中线）
    const leftX = 55;             // 左边界
    const rightX = w - 55;        // 右边界

    // 左上：输入区
    const inLeftX = leftX + 30;
    const htPrevY = 75;
    const xtY = 120;
    const ctPrevY = hwY;

    // 拼接块
    const concatX = 175, concatY = 100;

    // 三个门的位置
    const gateW = 74, gateH = 42;
    const forgetX = 290, forgetY = hwY - 75;
    const inputX = 290, inputY = hwY + 75;
    const candX = 410, candY = hwY + 75;
    const outputX = 410, outputY = hwY - 75;

    // 细胞状态操作点
    const ctOp1X = 290;   // fₜ 作用点 (遗忘门下方，高速路上)
    const ctOp2X = 410;   // iₜ + C̃ₜ 作用点
    const ctMergeX = 520; // 合并后 Cₜ
    const htGenX = 580;   // hₜ 生成点

    // ═══════════ 绘制 ═══════════

    // ── Cₜ₋₁ → Cₜ 高速公路（核心横线） ──
    ctx.strokeStyle = a[2] ? '#e8934a' : '#e0dcd6';
    ctx.lineWidth = a[2] ? 4 : 2;
    ctx.setLineDash(a[2] ? [] : [8, 6]);
    ctx.beginPath(); ctx.moveTo(leftX, hwY); ctx.lineTo(rightX, hwY); ctx.stroke();
    ctx.setLineDash([]);
    // 标签
    ctx.fillStyle = a[2] ? '#e8934a' : '#c0c5cc';
    ctx.font = (a[2] ? 'bold ' : '') + '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Cₜ₋₁', leftX, hwY - 12);
    ctx.fillText('Cₜ →', rightX - 15, hwY - 12);
    if (a[2]) {
      ctx.fillStyle = '#e8934a'; ctx.font = 'italic 8px sans-serif';
      ctx.fillText('高速公路（线性传递→梯度不消失）', ctMergeX + 30, hwY + 16);
    }

    // ── 输入标签 ──
    ctx.fillStyle = a[0] ? '#4a90a4' : '#c0c5cc';
    ctx.font = (a[0] ? 'bold ' : '') + '11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('hₜ₋₁ (隐藏状态)', inLeftX - 5, htPrevY);
    ctx.fillText('xₜ (当前输入)', inLeftX - 5, xtY);
    ctx.fillStyle = a[0] ? '#e8934a' : '#c0c5cc';
    ctx.fillText('Cₜ₋₁ (细胞状态)', inLeftX - 5, hwY + 4);

    // ── 拼接块 ──
    if (a[0]) {
      box(ctx, concatX, concatY, 82, 42, 'rgba(74,144,164,0.06)', '#4a90a4', 1.8, 5);
      ctx.fillStyle = '#4a90a4'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('[hₜ₋₁ , xₜ]', concatX, concatY);

      // 输入 → 拼接
      arrow(ctx, inLeftX + 10, htPrevY, concatX - 44, concatY - 8, 'rgba(74,144,164,0.4)', 1.5);
      arrow(ctx, inLeftX + 10, xtY, concatX - 44, concatY + 8, 'rgba(91,154,127,0.4)', 1.5);

      // 拼接 → 各门的分配线
      ctx.strokeStyle = 'rgba(148,163,179,0.25)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(concatX + 41, concatY);
      ctx.lineTo(forgetX - gateW / 2 - 25, concatY);
      ctx.lineTo(forgetX - gateW / 2 - 25, outputY - gateH / 2);
      ctx.moveTo(forgetX - gateW / 2 - 25, concatY);
      ctx.lineTo(forgetX - gateW / 2 - 25, candY + gateH / 2);
      ctx.stroke();
      // 分到各门
      arrow(ctx, forgetX - gateW / 2 - 25, forgetY - gateH / 2, forgetX - gateW / 2 + 2, forgetY - gateH / 2 + 2, 'rgba(231,76,60,0.3)', 1.2);
      arrow(ctx, forgetX - gateW / 2 - 25, inputY - gateH / 2, forgetX - gateW / 2 + 2, inputY - gateH / 2 + 2, 'rgba(232,147,74,0.3)', 1.2);
      arrow(ctx, forgetX - gateW / 2 - 25, candY - gateH / 2, candX - gateW / 2 + 2, candY - gateH / 2 + 2, 'rgba(91,154,127,0.3)', 1.2);
      arrow(ctx, forgetX - gateW / 2 - 25, outputY - gateH / 2, outputX - gateW / 2 + 2, outputY - gateH / 2 + 2, 'rgba(74,144,164,0.3)', 1.2);
    }

    // ── 四个功能块 ──
    gate(ctx, forgetX, forgetY, gateW, gateH, 'fₜ', '遗忘门 σ', '#e74c3c', a[0], '0.7');
    gate(ctx, inputX, inputY, gateW, gateH, 'iₜ', '输入门 σ', '#e8934a', a[1], '0.6');
    gate(ctx, candX, candY, gateW, gateH, 'C̃ₜ', '候选 tanh', '#5b9a7f', a[1], '0.9');
    gate(ctx, outputX, outputY, gateW, gateH, 'oₜ', '输出门 σ', '#4a90a4', a[3], '0.8');

    // ── 遗忘门 → 高速公路（乘法操作） ──
    if (a[2]) {
      // 小 × 符号在高速路上
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ctOp1X, hwY, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('×', ctOp1X, hwY);
      // fₜ → ×
      arrow(ctx, forgetX, forgetY + gateH / 2, ctOp1X, hwY - 12, '#e74c3c', 2);
    }

    // ── 输入门 + 候选 → 高速公路（加法操作） ──
    if (a[2]) {
      // 小 + 符号在高速路上
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#5b9a7f'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ctOp2X, hwY, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5b9a7f'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('+', ctOp2X, hwY + 1);
      // iₜ → +
      arrow(ctx, inputX, inputY - gateH / 2, ctOp2X - 25, hwY - 12, '#e8934a', 2);
      // C̃ₜ → +
      arrow(ctx, candX, candY - gateH / 2, ctOp2X + 10, hwY - 12, '#5b9a7f', 2);

      // 高速公路上的标注
      ctx.fillStyle = '#e74c3c'; ctx.font = 'italic 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('fₜ·Cₜ₋₁', ctOp1X - 20, hwY + 22);
      ctx.fillStyle = '#5b9a7f'; ctx.font = 'italic 9px sans-serif';
      ctx.fillText('+ iₜ·C̃ₜ', ctOp2X + 5, hwY + 22);

      // Cₜ 公式标注
      ctx.fillStyle = '#e8934a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('Cₜ = fₜ·Cₜ₋₁ + iₜ·C̃ₜ = 0.74', ctMergeX - 30, hwY - 20);
    }

    // ── 输出门 → hₜ ──
    if (a[3]) {
      // tanh 块
      const tanhX = ctMergeX + 35, tanhY = hwY;
      ctx.fillStyle = 'rgba(232,147,74,0.08)'; ctx.strokeStyle = '#e8934a'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.roundRect(tanhX - 26, tanhY - 13, 52, 26, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e8934a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('tanh', tanhX, tanhY);

      // Cₜ→tanh
      arrow(ctx, ctMergeX + 10, hwY, tanhX - 26, hwY, '#e8934a', 2);

      // oₜ → hₜ 生成
      const htX = htGenX, htY = hwY - 60;
      // 乘法节点
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#4a90a4'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(htX, htY, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4a90a4'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('×', htX, htY);

      // tanh(Cₜ) → ×
      arrow(ctx, tanhX, tanhY - 13, htX, htY - 12, '#e8934a', 1.5);
      // oₜ → ×
      arrow(ctx, outputX, outputY + gateH / 2, htX, htY - 12, '#4a90a4', 2);

      // hₜ 输出
      arrow(ctx, htX, htY + 14, htX, htY + 50, '#4a90a4', 2.5);
      ctx.fillStyle = '#4a90a4'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('hₜ = oₜ·tanh(Cₜ)', htX, htY + 38);
      ctx.fillText('hₜ 隐藏状态(新) →', htX, htY + 68);
    }

    // ── 底部图例 ──
    const ly = h - 12;
    ctx.font = '8px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const items = [
      { c: '#e74c3c', t: '遗忘门：决定丢弃 Cₜ₋₁ 中的哪些旧信息' },
      { c: '#e8934a', t: '输入门+C̃ₜ：决定写入哪些新信息' },
      { c: '#4a90a4', t: '输出门：决定 Cₜ 的哪些部分输出为 hₜ' }
    ];
    let lx = 30;
    items.forEach(it => {
      ctx.fillStyle = it.c; ctx.fillRect(lx, ly - 5, 10, 10);
      ctx.fillStyle = '#6b7c8b'; ctx.fillText(it.t, lx + 14, ly);
      lx += ctx.measureText(it.t).width + 32;
    });
    ctx.textBaseline = 'alphabetic';
  }

  function step() {
    if (curStep >= totalSteps) return;
    curStep++;
    draw();
    const msgs = [
      '',
      '<strong>① 遗忘门 fₜ：</strong>查看 hₜ₋₁ 和 xₜ，决定从 Cₜ₋₁ 中<span style="color:#e74c3c">丢弃</span>哪些旧信息。fₜ∈[0,1]，0=全忘，1=全保留。',
      '<strong>② 输入门 iₜ + 候选 C̃ₜ：</strong>iₜ 决定写入多少新信息；<span style="color:#5b9a7f">C̃ₜ=tanh(...)</span> 从当前输入提取候选记忆。',
      '<strong>③ ⭐ 细胞状态更新：</strong><span style="color:#e8934a">Cₜ = fₜ·Cₜ₋₁ + iₜ·C̃ₜ</span>。高速公路上 fₜ·Cₜ₋₁ 是<span style="color:#e8934a">线性操作</span>——梯度可直接反向传播，<strong>解决梯度消失！</strong>',
      '<strong>④ 输出门 oₜ → hₜ：</strong>oₜ 控制从 Cₜ 输出多少，<span style="color:#4a90a4">hₜ = oₜ·tanh(Cₜ)</span>。hₜ 是弱化版，让新输入更容易主导。',
      '✅ <strong>LSTM 核心机制：</strong>Cₜ 高速公路（线性传递→无梯度衰减）+ 三门（σ 0~1 控制流量）+ 候选 tanh（提取特征）。'
    ];
    infoEl.innerHTML = msgs[curStep];
  }

  function resetViz() {
    curStep = 0; draw();
    infoEl.innerHTML = '🔍 <strong>LSTM 细胞结构：</strong>底部橙色粗线 = Cₜ 细胞状态高速公路。<br>三个门（遗忘/输入/输出）分别控制信息的丢弃、写入和输出。点击逐步展示。';
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('lstm-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('lstm-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (curStep >= totalSteps) { clearInterval(autoTimer); autoTimer = null; document.getElementById('lstm-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 1100);
  }

  document.getElementById('lstm-step').addEventListener('click', step);
  document.getElementById('lstm-auto').addEventListener('click', toggleAuto);
  document.getElementById('lstm-reset').addEventListener('click', resetViz);
  draw(); resetViz();
  window.addEventListener('resize', draw);
}
