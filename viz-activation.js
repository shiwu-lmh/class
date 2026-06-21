/**
 * 可视化：激活函数对比 —— 点击切换查看各函数形状与导数
 */
function initActivationViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const funcs = [
    { id: 'sigmoid', name: 'Sigmoid', fn: z => 1 / (1 + Math.exp(-z)), dfn: z => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }, color: '#4a90a4', domain: [-8, 8], yRange: [-0.1, 1.1] },
    { id: 'tanh', name: 'Tanh', fn: z => Math.tanh(z), dfn: z => 1 - Math.tanh(z) ** 2, color: '#5b9a7f', domain: [-5, 5], yRange: [-1.2, 1.2] },
    { id: 'relu', name: 'ReLU', fn: z => Math.max(0, z), dfn: z => z > 0 ? 1 : 0, color: '#e8934a', domain: [-3, 5], yRange: [-1, 5] },
    { id: 'leakyrelu', name: 'LeakyReLU', fn: z => z > 0 ? z : 0.05 * z, dfn: z => z > 0 ? 1 : 0.05, color: '#c87a5b', domain: [-4, 5], yRange: [-1, 5] },
    { id: 'softmax', name: 'Softmax', fn: null, dfn: null, color: '#8b7ec8', domain: [0, 1], yRange: [0, 1], isSpecial: true },
  ];

  let activeIdx = 0;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="act-canvas" style="width:500px;height:320px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="display:flex;flex-direction:column;gap:0.35rem" id="act-btns"></div>
        <div id="act-info" style="margin-top:0.8rem;background:#f8fdfe;padding:0.5rem 0.7rem;border-radius:6px;font-size:0.8rem;line-height:1.5;color:#2c3e50"></div>
      </div>
    </div>`;

  const btnContainer = document.getElementById('act-btns');
  funcs.forEach((f, i) => {
    const btn = document.createElement('button');
    btn.textContent = f.name;
    btn.style.cssText = `padding:0.4rem 0.8rem;border:2px solid ${f.color};border-radius:20px;background:${i === 0 ? f.color : '#fff'};color:${i === 0 ? '#fff' : f.color};cursor:pointer;font-weight:700;font-size:0.85rem;transition:all 0.2s`;
    btn.addEventListener('click', () => {
      activeIdx = i;
      document.querySelectorAll('#act-btns button').forEach((b, j) => {
        const fc = funcs[j];
        b.style.background = j === i ? fc.color : '#fff';
        b.style.color = j === i ? '#fff' : fc.color;
      });
      draw();
    });
    btnContainer.appendChild(btn);
  });

  const canvas = document.getElementById('act-canvas');
  const infoEl = document.getElementById('act-info');

  function mapX(x, d, w) { const m = 40; return m + (x - d[0]) / (d[1] - d[0]) * (w - 2 * m); }
  function mapY(y, r, h) { const m = 30; return h - m - (y - r[0]) / (r[1] - r[0]) * (h - 2 * m); }

  function draw() {
    const r = Viz.ctx('act-canvas');
    if (!r) return;
    const { ctx, w, h } = r;
    const f = funcs[activeIdx];

    if (f.isSpecial) {
      // Softmax 特殊展示：展示将3个 logits 映射为概率
      Viz.axis(ctx, 40, h - 30, w, h, { xLabel: '类别', yLabel: '概率' });
      const logits = [2.0, 1.0, 0.1];
      const exps = logits.map(v => Math.exp(v));
      const sum = exps.reduce((a, b) => a + b, 0);
      const probs = exps.map(v => v / sum);
      const barW = 60, gap = 40, startX = w / 2 - (3 * barW + 2 * gap) / 2;
      const cats = ['猫', '狗', '鸟'];
      const barColors = ['#4a90a4', '#e8934a', '#5b9a7f'];

      // Logits 条（半透明）
      logits.forEach((val, i) => {
        const x = startX + i * (barW + gap);
        const bh = val / 3 * 150;
        ctx.fillStyle = 'rgba(148,163,179,0.25)';
        ctx.fillRect(x, mapY(0, [0, 1], h) - bh, barW, bh);
        Viz.text(ctx, `z=${val.toFixed(1)}`, x + barW / 2, mapY(0, [0, 1], h) - bh - 8, { font: '10px sans-serif', color: '#94a3b3' });
      });

      // 概率条
      probs.forEach((val, i) => {
        const x = startX + i * (barW + gap);
        const bh = val * 220;
        ctx.fillStyle = barColors[i];
        ctx.fillRect(x, mapY(0, [0, 1], h) - bh, barW, bh);
        Viz.text(ctx, cats[i], x + barW / 2, mapY(0, [0, 1], h) + 16, { font: 'bold 11px sans-serif' });
        Viz.text(ctx, (val * 100).toFixed(0) + '%', x + barW / 2, mapY(0, [0, 1], h) - bh - 8, { font: 'bold 12px sans-serif', color: barColors[i] });
      });

      Viz.text(ctx, 'Softmax(z) = eᶻ / Σeᶻ —— 将任意实数转为概率分布（和为1）', w / 2, 18, { font: 'bold 11px sans-serif', color: '#2c3e50' });
      infoEl.innerHTML = `
        <strong>Softmax 多分类输出层</strong><br>
        z = [2.0, 1.0, 0.1] → Softmax → <strong>概率</strong><br>
        最高概率的类别为预测结果。<br>
        ⚠️ Softmax 只在<strong>输出层</strong>使用，用于多分类。
      `;
    } else {
      // 标准激活函数曲线
      Viz.axis(ctx, 40, h / 2, w, h, { xLabel: 'z', yLabel: 'f(z) / f\'(z)' });
      Viz.line(ctx, 40, h / 2, w - 20, h / 2, '#94a3b3', 0.8); // 零线

      // 函数曲线
      ctx.strokeStyle = f.color; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let px = 0; px < w; px++) {
        const mx = f.domain[0] + (px - 40) / (w - 80) * (f.domain[1] - f.domain[0]);
        const my = f.fn(mx);
        const py = mapY(my, f.yRange, h);
        if (px === 0) ctx.moveTo(px, Math.max(10, Math.min(h - 10, py)));
        else ctx.lineTo(px, Math.max(10, Math.min(h - 10, py)));
      }
      ctx.stroke();

      // 导函数曲线
      ctx.strokeStyle = f.color; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (let px = 0; px < w; px++) {
        const mx = f.domain[0] + (px - 40) / (w - 80) * (f.domain[1] - f.domain[0]);
        const my = f.dfn(mx);
        const py = mapY(my, f.yRange, h);
        if (px === 0) ctx.moveTo(px, Math.max(10, Math.min(h - 10, py)));
        else ctx.lineTo(px, Math.max(10, Math.min(h - 10, py)));
      }
      ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;

      // 图例
      Viz.text(ctx, '─ 函数 f(z)', w - 80, 25, { font: 'bold 11px sans-serif', color: f.color, align: 'right' });
      Viz.text(ctx, '- - 导数 f\'(z)', w - 80, 42, { font: '10px sans-serif', color: f.color, align: 'right' });

      // 信息
      const info = {
        sigmoid: 'Sigmoid：输出(0,1)，导数最大0.25。二分类输出层专用。',
        tanh: 'Tanh：输出(−1,1)，0中心，导数最大1.0。改进Sigmoid梯度小的缺点。',
        relu: 'ReLU：z>0直接输出z（导数=1），z<0输出0（导数=0=死神经元）。隐藏层首选。',
        leakyrelu: 'LeakyReLU：z<0时输出 a·z（a≈0.01），解决ReLU死区问题。全定义域可导。',
      };
      infoEl.innerHTML = `<strong>${f.name}</strong>：${info[f.id] || ''}`;
    }
  }

  draw();
  window.addEventListener('resize', draw);
}
