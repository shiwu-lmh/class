/**
 * 可视化：K-Means 聚类 —— 逐步演示中心移动
 */
function initKMeansViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="kmeans-canvas" style="width:440px;height:360px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="km-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 下一步</button>
        <button id="km-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="km-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 新数据</button>
        <div id="km-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.5rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:50px;line-height:1.5"></div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem">K=3 | 随机初始中心 → 分配 → 更新 → 收敛</div>
      </div>
    </div>`;

  const canvas = document.getElementById('kmeans-canvas');
  const infoEl = document.getElementById('km-info');
  const K = 3;
  const colors = ['#4a90a4', '#e8934a', '#5b9a7f'];
  let points, centers, labels, stepNum, converged, autoTimer;
  const margin = 35;

  function genData() {
    points = [];
    const bases = [[120, 120], [300, 100], [200, 260]];
    bases.forEach(([bx, by]) => {
      for (let i = 0; i < 20; i++) {
        points.push([bx + (Math.random() - 0.5) * 100, by + (Math.random() - 0.5) * 100]);
      }
    });
    // 打乱
    for (let i = points.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * i); [points[i], points[j]] = [points[j], points[i]]; }
  }

  function initCenters() {
    const idxs = new Set();
    while (idxs.size < K) idxs.add(Math.floor(Math.random() * points.length));
    centers = [...idxs].map(i => [...points[i]]);
    labels = new Array(points.length).fill(-1);
    stepNum = 0;
    converged = false;
  }

  function assignLabels() {
    let changed = false;
    points.forEach((p, i) => {
      let minD = Infinity, best = -1;
      centers.forEach((c, j) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (d < minD) { minD = d; best = j; } });
      if (labels[i] !== best) { labels[i] = best; changed = true; }
    });
    return changed;
  }

  function updateCenters() {
    const sums = Array.from({ length: K }, () => [0, 0, 0]);
    points.forEach((p, i) => { sums[labels[i]][0] += p[0]; sums[labels[i]][1] += p[1]; sums[labels[i]][2]++; });
    let moved = false;
    sums.forEach((s, j) => {
      if (s[2] === 0) return;
      const nx = s[0] / s[2], ny = s[1] / s[2];
      if (Math.abs(centers[j][0] - nx) > 1 || Math.abs(centers[j][1] - ny) > 1) moved = true;
      centers[j] = [nx, ny];
    });
    return moved;
  }

  function draw() {
    const r = Viz.ctx('kmeans-canvas');
    if (!r) return;
    const { ctx, w, h } = r;

    // 绘制点
    points.forEach((p, i) => {
      const col = labels[i] >= 0 ? colors[labels[i]] : '#94a3b3';
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });

    // 绘制中心
    centers.forEach((c, j) => {
      ctx.fillStyle = colors[j]; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(c[0], c[1], 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(j + 1, c[0], c[1]);
    });

    Viz.text(ctx, `第 ${stepNum} 步${converged ? ' — ✅ 已收敛！' : ''}`, w / 2, 18, { font: 'bold 12px sans-serif', color: converged ? '#5b9a7f' : '#2c3e50' });
  }

  function step() {
    if (converged) return;
    stepNum++;
    const changed1 = assignLabels();
    if (!changed1 && stepNum > 2) { converged = true; draw(); infoEl.innerHTML = '✅ <strong>聚类已收敛！</strong>中心不再移动。每个点到其所属中心的距离之和最小化。'; return; }
    updateCenters();
    draw();
    infoEl.innerHTML = `📍 <strong>第 ${stepNum} 步：</strong>按最近中心重新分配 → 每组计算新的中心（特征均值）。${!changed1 ? '中心位置<strong>不再变化</strong>。' : ''}`;
  }

  function reset() {
    genData(); initCenters(); draw();
    infoEl.innerHTML = '🎯 <strong>初始状态：</strong>随机选了 3 个中心点（①②③）。点击"下一步"开始聚类迭代。';
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('km-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('km-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (converged) { clearInterval(autoTimer); autoTimer = null; document.getElementById('km-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 600);
  }

  document.getElementById('km-step').addEventListener('click', step);
  document.getElementById('km-auto').addEventListener('click', toggleAuto);
  document.getElementById('km-reset').addEventListener('click', reset);

  genData(); initCenters(); draw();
  infoEl.innerHTML = '🎯 <strong>初始状态：</strong>随机选了 3 个中心点（①②③）。点击"下一步"开始聚类迭代。';
  window.addEventListener('resize', draw);
}
