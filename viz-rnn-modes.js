/**
 * 可视化：RNN 四种应用模式 —— 一对多 / 多对一 / 多对多(对齐) / 多对多(非对齐)
 */
function initRNNModesViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="rnnmodes-canvas" style="width:640px;height:480px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="display:flex;flex-direction:column;gap:0.35rem;margin-top:0.3rem">
          <button id="rm-hl-0" style="padding:0.45rem 0.8rem;background:#4a90a4;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.82rem;text-align:left">① 一对多 · 文本生成</button>
          <button id="rm-hl-1" style="padding:0.45rem 0.8rem;background:#fff;color:#5b9a7f;border:2px solid #5b9a7f;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.82rem;text-align:left">② 多对一 · 情感分类</button>
          <button id="rm-hl-2" style="padding:0.45rem 0.8rem;background:#fff;color:#e8934a;border:2px solid #e8934a;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.82rem;text-align:left">③ 多对多(对齐) · NER</button>
          <button id="rm-hl-3" style="padding:0.45rem 0.8rem;background:#fff;color:#8b5cf6;border:2px solid #8b5cf6;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.82rem;text-align:left">④ 多对多(非对齐) · 翻译</button>
        </div>
        <div id="rnnmodes-info" style="margin-top:0.7rem;background:#f8fdfe;padding:0.55rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:50px;line-height:1.55"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem">🟢 输入 · 🔵 输出 · 🟠 隐藏状态</div>
      </div>
    </div>`;

  const canvas = document.getElementById('rnnmodes-canvas');
  const infoEl = document.getElementById('rnnmodes-info');
  const colors = ['#4a90a4', '#5b9a7f', '#e8934a', '#8b5cf6'];

  const modes = [
    { name: '一对多', en: 'One-to-Many', scene: '文本生成', inCount: 1, outCount: 3, encoder: false,
      desc: '1个输入（起始词）→ RNN 循环生成多个输出。每个输出作为下一时间步的输入，直到生成结束符。' },
    { name: '多对一', en: 'Many-to-One', scene: '情感分析', inCount: 3, outCount: 1, encoder: false,
      desc: '多个输入（一句话所有词）→ 1个输出（整句标签）。只取最后一个时间步的输出作为结果。' },
    { name: '多对多(对齐)', en: 'Many-to-Many', scene: '命名实体识别', inCount: 4, outCount: 4, encoder: false,
      desc: '输入和输出等长——每个输入词对应一个实体标签。每个时间步都产生输出，一一对应。' },
    { name: '多对多(非对齐)', en: 'Seq2Seq', scene: '机器翻译', inCount: 3, outCount: 3, encoder: true,
      desc: 'Encoder 读入全部输入→生成上下文向量→Decoder 逐步生成输出。输入输出长度可以不同。' }
  ];

  let highlightIdx = 0;

  function drawArrow(ctx, x1, y1, x2, y2, color, w) {
    const aLen = 6, aAng = 0.4;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - aLen * Math.cos(ang - aAng), y2 - aLen * Math.sin(ang - aAng));
    ctx.lineTo(x2 - aLen * Math.cos(ang + aAng), y2 - aLen * Math.sin(ang + aAng));
    ctx.closePath(); ctx.fill();
  }

  function draw() {
    const r = Viz.ctx('rnnmodes-canvas');
    if (!r) return;
    const { ctx, w, h } = r;
    const cols = 2, rows = 2;
    const pad = 30, gapX = 20, gapY = 15;
    const pw = (w - pad * 2 - gapX) / cols;
    const ph = (h - pad * 2 - gapY) / rows;

    Viz.text(ctx, 'RNN 四种应用模式', w / 2, 16, { font: 'bold 13px sans-serif', color: '#2c3e50' });

    modes.forEach((mode, idx) => {
      const col = idx % 2, row = Math.floor(idx / 2);
      const px = pad + col * (pw + gapX), py = pad + row * (ph + gapY);
      const isHL = (idx === highlightIdx);
      const colr = colors[idx];

      // 面板背景
      ctx.fillStyle = isHL ? 'rgba(74,144,164,0.03)' : '#faf9f7';
      ctx.strokeStyle = isHL ? colr : '#e2ded6';
      ctx.lineWidth = isHL ? 2.5 : 1;
      ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();

      // 标题
      ctx.fillStyle = colr; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('● ' + mode.name + '  ' + mode.en, px + 14, py + 22);
      ctx.fillStyle = '#6b7c8b'; ctx.font = '9px sans-serif';
      ctx.fillText(mode.scene, px + 14, py + 38);

      // RNN 单元位置
      const rnnCx = px + pw / 2, rnnCy = py + 120;
      ctx.fillStyle = isHL ? 'rgba(232,147,74,0.12)' : 'rgba(148,163,179,0.06)';
      ctx.strokeStyle = isHL ? '#e8934a' : '#c0c5cc';
      ctx.lineWidth = isHL ? 2 : 1;
      const rnnW = 60, rnnH = 36;
      ctx.beginPath(); ctx.roundRect(rnnCx - rnnW / 2, rnnCy - rnnH / 2, rnnW, rnnH, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = isHL ? '#e8934a' : '#94a3b3';
      ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('RNN', rnnCx, rnnCy);

      // 循环箭头（小）
      if (isHL) {
        ctx.strokeStyle = 'rgba(232,147,74,0.5)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(rnnCx + rnnW / 2, rnnCy, 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.fillStyle = '#e8934a';
        ctx.beginPath(); ctx.moveTo(rnnCx + rnnW / 2, rnnCy - 8);
        ctx.lineTo(rnnCx + rnnW / 2 - 3, rnnCy - 5);
        ctx.lineTo(rnnCx + rnnW / 2 + 3, rnnCy - 5);
        ctx.closePath(); ctx.fill();
      }

      // Encoder/Decoder 标注
      if (mode.encoder) {
        ctx.fillStyle = '#8b5cf6'; ctx.font = 'italic 8px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Encoder', rnnCx - rnnW / 2 - 22, rnnCy - 6);
        ctx.fillText('Decoder', rnnCx + rnnW / 2 + 22, rnnCy - 6);
      }

      // ── 输入节点（左侧） ──
      const inSpacing = Math.min(28, (ph - 100) / mode.inCount);
      const inStartY = rnnCy - (mode.inCount - 1) * inSpacing / 2;
      const inX = px + 48;
      for (let i = 0; i < mode.inCount; i++) {
        const iy = inStartY + i * inSpacing;
        ctx.fillStyle = '#5b9a7f'; ctx.strokeStyle = '#5b9a7f'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(inX, iy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('x' + (i + 1), inX, iy);

        // 连接线到 RNN
        const lineEndX = rnnCx - rnnW / 2;
        drawArrow(ctx, inX + 12, iy, lineEndX, rnnCy, isHL ? 'rgba(91,154,127,0.5)' : 'rgba(148,163,179,0.15)', isHL ? 1.5 : 0.7);
      }

      // ── 输出节点（右侧） ──
      const outSpacing = Math.min(28, (ph - 100) / mode.outCount);
      const outStartY = rnnCy - (mode.outCount - 1) * outSpacing / 2;
      const outX = px + pw - 48;
      for (let o = 0; o < mode.outCount; o++) {
        const oy = outStartY + o * outSpacing;
        ctx.fillStyle = '#4a90a4'; ctx.strokeStyle = '#4a90a4'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(outX, oy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('y' + (o + 1), outX, oy);

        const lineStartX = rnnCx + rnnW / 2;
        drawArrow(ctx, lineStartX, rnnCy, outX - 12, oy, isHL ? 'rgba(74,144,164,0.5)' : 'rgba(148,163,179,0.15)', isHL ? 1.5 : 0.7);
      }

      // 底部标注
      ctx.fillStyle = '#94a3b3'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(mode.inCount + ' 个输入  →  ' + mode.outCount + ' 个输出', px + pw / 2, py + ph - 12);
    });

    const cm = modes[highlightIdx];
    infoEl.innerHTML = '<strong style="color:' + colors[highlightIdx] + '">● ' + cm.name + ' · ' + cm.scene + '</strong><br>' + cm.desc;
  }

  function highlight(idx) {
    highlightIdx = idx;
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById('rm-hl-' + i);
      if (!btn) continue;
      btn.style.background = (i === idx) ? colors[i] : '#fff';
      btn.style.color = (i === idx) ? '#fff' : colors[i];
      btn.style.borderColor = colors[i];
    }
    draw();
  }

  for (let i = 0; i < 4; i++) {
    document.getElementById('rm-hl-' + i).addEventListener('click', () => highlight(i));
  }
  draw(); highlight(0);
  window.addEventListener('resize', draw);
}
