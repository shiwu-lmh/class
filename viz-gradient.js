/**
 * 可视化：梯度下降 —— 小球沿抛物线滚向最小值
 * 用户可调整学习率，点击"下一步"观察参数更新
 */
function initGradientViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="grad-canvas" style="width:460px;height:340px;border:1px solid #e2ded6;border-radius:8px;background:#fff;cursor:pointer" title="点击曲线设置起点"></canvas>
      <div style="flex:1;min-width:210px">
        <div style="margin-bottom:0.6rem">
          <button id="grad-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 下一步</button>
          <button id="grad-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
          <button id="grad-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        </div>
        <div style="font-size:0.82rem;color:#6b7c8b;line-height:1.6">
          <div><strong>学习率 α：</strong><span id="grad-lr-val">0.05</span></div>
          <input type="range" id="grad-lr" min="1" max="80" value="5" style="width:100%">
          <div style="font-size:0.72rem;display:flex;justify-content:space-between"><span>0.01</span><span>0.1</span><span>0.5</span><span>0.8</span></div>
        </div>
        <div id="grad-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.5rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:60px;line-height:1.5"></div>
      </div>
    </div>`;

  const canvas = document.getElementById('grad-canvas');
  let wVal = 8;           // 当前 x 位置（对应权重）
  const history = [];      // [{x, y}]
  let lr = 0.05;
  const lossFunc = x => x * x;           // L = x²
  const gradFunc = x => 2 * x;           // dL/dx = 2x
  let autoTimer = null;

  function plotToCanvas(x) {
    // 映射：数学 x∈[−10,10] → Canvas x∈[40,420], y: [−5,100] → Canvas y∈[280,50]
    return {
      cx: 40 + (x + 10) / 20 * 380,
      cy: 280 - (x * x) / 100 * 230
    };
  }

  function draw() {
    const r = Viz.ctx('grad-canvas');
    if (!r) return;
    const { ctx, w, h } = r;

    // 背景网格
    ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // 坐标轴
    Viz.axis(ctx, 40, 280, w, h, { xLabel: 'W (权重)', yLabel: 'L (损失)' });

    // 损失曲线 y = x²
    ctx.strokeStyle = '#4a90a4'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const mx = (px - 40) / 380 * 20 - 10;
      const my = mx * mx;
      const py = 280 - my / 100 * 230;
      if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 历史轨迹
    if (history.length > 1) {
      ctx.strokeStyle = '#e8934a'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const p = plotToCanvas(history[i].x);
        if (i === 0) ctx.moveTo(p.cx, p.cy); else ctx.lineTo(p.cx, p.cy);
      }
      ctx.stroke(); ctx.setLineDash([]);
      // 历史点
      history.forEach((pt, i) => {
        Viz.point(ctx, plotToCanvas(pt.x).cx, plotToCanvas(pt.x).cy, i === history.length - 1 ? 7 : 3, i === history.length - 1 ? '#e8934a' : 'rgba(232,147,74,0.4)');
      });
    }

    // 当前小球位置
    const cur = plotToCanvas(wVal);
    // 切线
    const grad = gradFunc(wVal);
    const tangentLen = Math.min(60, Math.abs(grad) * 3);
    Viz.line(ctx, cur.cx, cur.cy, cur.cx + 30, cur.cy - grad * 3, '#e8934a', 1.5);

    // 小球
    const gradFill = ctx.createRadialGradient(cur.cx - 3, cur.cy - 3, 2, cur.cx, cur.cy, 10);
    gradFill.addColorStop(0, '#fff'); gradFill.addColorStop(1, '#e8934a');
    ctx.fillStyle = gradFill;
    ctx.beginPath(); ctx.arc(cur.cx, cur.cy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c87a5b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cur.cx, cur.cy, 9, 0, Math.PI * 2); ctx.stroke();

    // 标注
    Viz.text(ctx, `W=${wVal.toFixed(3)}`, cur.cx, cur.cy - 18, { font: 'bold 11px sans-serif', color: '#e8934a' });
    Viz.text(ctx, `梯度=${grad.toFixed(2)}`, cur.cx + 50, cur.cy - 15, { font: '10px sans-serif', color: '#6b7c8b', align: 'left' });
    Viz.text(ctx, `L=${lossFunc(wVal).toFixed(2)}`, cur.cx + 50, cur.cy, { font: '10px sans-serif', color: '#6b7c8b', align: 'left' });

    // 最低点标记
    Viz.point(ctx, plotToCanvas(0).cx, plotToCanvas(0).cy, 5, '#4a90a4');
    Viz.text(ctx, '最小值 W=0', plotToCanvas(0).cx + 5, plotToCanvas(0).cy - 14, { font: 'bold 10px sans-serif', color: '#4a90a4', align: 'left' });

    // 信息
    const gradInfo = document.getElementById('grad-info');
    if (gradInfo) {
      const newW = wVal - lr * grad;
      gradInfo.innerHTML = `
        当前 W = <strong>${wVal.toFixed(3)}</strong> | 梯度 ∇L = <strong>${grad.toFixed(2)}</strong><br>
        L(W) = <strong>${lossFunc(wVal).toFixed(3)}</strong><br>
        下一步：W ← ${wVal.toFixed(3)} − ${lr} × ${grad.toFixed(2)} = <strong>${newW.toFixed(3)}</strong>
      `;
    }
  }

  function step() {
    const grad = gradFunc(wVal);
    if (Math.abs(grad) < 0.001) return; // 已收敛
    history.push({ x: wVal, y: lossFunc(wVal) });
    wVal = wVal - lr * grad;
    if (history.length > 40) history.shift();
    draw();
  }

  function reset() {
    wVal = 8;
    history.length = 0;
    history.push({ x: wVal, y: lossFunc(wVal) });
    draw();
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('grad-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('grad-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (Math.abs(gradFunc(wVal)) < 0.002) { clearInterval(autoTimer); autoTimer = null; document.getElementById('grad-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 400);
  }

  document.getElementById('grad-step').addEventListener('click', step);
  document.getElementById('grad-auto').addEventListener('click', toggleAuto);
  document.getElementById('grad-reset').addEventListener('click', reset);
  document.getElementById('grad-lr').addEventListener('input', function () {
    lr = this.value / 100;
    document.getElementById('grad-lr-val').textContent = lr.toFixed(2);
    draw();
  });

  // 点击曲线设置起点
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - 40) / 380 * 20 - 10;
    wVal = Math.max(-8, Math.min(8, mx));
    history.length = 0;
    history.push({ x: wVal, y: lossFunc(wVal) });
    draw();
  });

  history.push({ x: wVal, y: lossFunc(wVal) });
  draw();
  window.addEventListener('resize', draw);
}
