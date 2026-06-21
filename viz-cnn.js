/**
 * 可视化：CNN 卷积 —— 滑动卷积核演示
 */
function initCNNViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="cnn-canvas" style="width:520px;height:340px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="cnn-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 滑动一步</button>
        <button id="cnn-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="cnn-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="cnn-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.5rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:50px;line-height:1.5"></div>
        <div style="font-size:0.73rem;color:var(--text-muted);margin-top:0.4rem">5×5 输入 · 3×3 卷积核 · stride=1 · 输出 3×3 特征图</div>
      </div>
    </div>`;

  const canvas = document.getElementById('cnn-canvas');
  const infoEl = document.getElementById('cnn-info');
  const inputSize = 5, kernelSize = 3;
  const input = [
    [1, 2, 0, 1, 0],
    [0, 3, 1, 2, 1],
    [2, 1, 0, 3, 0],
    [1, 0, 2, 1, 1],
    [0, 2, 1, 0, 2]
  ];
  const kernel = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
  ]; // 垂直边缘检测核
  const output = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  // 预计算输出
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let ki = 0; ki < 3; ki++)
        for (let kj = 0; kj < 3; kj++)
          sum += input[i + ki][j + kj] * kernel[ki][kj];
      output[i][j] = sum;
    }

  let curRow = 0, curCol = 0;
  const positions = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) positions.push([i, j]);
  const highlighted = Array.from({ length: 3 }, () => Array(3).fill(false));
  let autoTimer = null;

  function getColor(val, isKernel = false) {
    if (isKernel) {
      if (val > 0) return '#e8f1f5';
      if (val < 0) return '#fde8e8';
      return '#f5f3ef';
    }
    const intensity = Math.min(1, Math.abs(val) / 3);
    if (val > 0) return `rgba(74,144,164,${0.2 + intensity * 0.5})`;
    if (val < 0) return `rgba(200,120,90,${0.2 + intensity * 0.5})`;
    return '#faf9f7';
  }

  function draw() {
    const r = Viz.ctx('cnn-canvas');
    if (!r) return;
    const { ctx, w, h } = r;
    const cellSize = 44;
    const inputOx = 30, inputOy = 50;
    const kernelOx = 290, kernelOy = 50;
    const outputOx = 290, outputOy = 200;

    // 标题
    Viz.text(ctx, '输入 5×5', inputOx + 2.5 * cellSize, inputOy - 15, { font: 'bold 12px sans-serif' });
    Viz.text(ctx, '卷积核 3×3', kernelOx + 1.5 * cellSize, kernelOy - 15, { font: 'bold 12px sans-serif' });
    Viz.text(ctx, '特征图 3×3', outputOx + 1.5 * cellSize, outputOy - 15, { font: 'bold 12px sans-serif' });

    // 绘制输入
    for (let i = 0; i < inputSize; i++) {
      for (let j = 0; j < inputSize; j++) {
        const x = inputOx + j * cellSize, y = inputOy + i * cellSize;
        // 是否在卷积核覆盖区域
        const inKernel = (i >= curRow && i < curRow + kernelSize && j >= curCol && j < curCol + kernelSize);
        ctx.fillStyle = inKernel ? 'rgba(74,144,164,0.2)' : '#faf9f7';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = inKernel ? '#4a90a4' : '#e2ded6';
        ctx.lineWidth = inKernel ? 2.5 : 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        Viz.text(ctx, input[i][j], x + cellSize / 2, y + cellSize / 2, { font: 'bold 14px sans-serif', color: inKernel ? '#4a90a4' : '#2c3e50' });
        ctx.textBaseline = 'middle';
      }
    }

    // 绘制卷积核
    for (let i = 0; i < kernelSize; i++) {
      for (let j = 0; j < kernelSize; j++) {
        const x = kernelOx + j * cellSize, y = kernelOy + i * cellSize;
        ctx.fillStyle = kernel[i][j] > 0 ? '#e8f1f5' : kernel[i][j] < 0 ? '#fde8e8' : '#faf9f7';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = '#e2ded6'; ctx.lineWidth = 1; ctx.strokeRect(x, y, cellSize, cellSize);
        Viz.text(ctx, kernel[i][j] >= 0 ? '+' + kernel[i][j] : kernel[i][j], x + cellSize / 2, y + cellSize / 2, { font: 'bold 13px sans-serif', color: kernel[i][j] > 0 ? '#4a90a4' : kernel[i][j] < 0 ? '#c87a5b' : '#94a3b3' });
      }
    }

    // 乘法箭头
    const arrowX = inputOx + 5 * cellSize + 15;
    Viz.text(ctx, '⊗', arrowX, inputOy + 1.5 * cellSize, { font: 'bold 20px sans-serif', color: '#4a90a4' });

    // 绘制输出特征图
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = outputOx + j * cellSize, y = outputOy + i * cellSize;
        const isCur = (i === curRow && j === curCol);
        ctx.fillStyle = isCur ? 'rgba(232,147,74,0.25)' : 'rgba(232,147,74,0.08)';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = isCur ? '#e8934a' : '#e2ded6';
        ctx.lineWidth = isCur ? 2.5 : 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        Viz.text(ctx, highlighted[i][j] ? output[i][j] : '?', x + cellSize / 2, y + cellSize / 2, { font: 'bold 14px sans-serif', color: isCur ? '#e8934a' : '#2c3e50' });
      }
    }

    // 计算展示
    if (highlighted[curRow][curCol]) {
      let calcStr = '';
      for (let ki = 0; ki < 3; ki++)
        for (let kj = 0; kj < 3; kj++)
          calcStr += `${input[curRow + ki][curCol + kj]}×${kernel[ki][kj] >= 0 ? '+' + kernel[ki][kj] : kernel[ki][kj]} `;
      const val = output[curRow][curCol];
      infoEl.innerHTML = `📍 位置 (${curRow},${curCol})：<code>${calcStr}= <strong>${val}</strong></code>`;
    }
  }

  function step() {
    highlighted[curRow][curCol] = true;
    curCol++;
    if (curCol >= 3) { curCol = 0; curRow++; }
    if (curRow >= 3) { curRow = 2; curCol = 2; /* 全部完成 */ }
    draw();
    if (highlighted.every(row => row.every(v => v))) {
      infoEl.innerHTML += '<br>✅ <strong>卷积完成！</strong>特征图大小 = 1+(5+0−3)/1 = <strong>3×3</strong>';
    }
  }

  function resetViz() {
    curRow = 0; curCol = 0;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) highlighted[i][j] = false;
    draw();
    infoEl.innerHTML = '🔍 <strong>垂直边缘检测核：</strong>检测输入中的垂直边缘。点击"滑动一步"观察卷积计算过程。';
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('cnn-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('cnn-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (highlighted.every(row => row.every(v => v))) { clearInterval(autoTimer); autoTimer = null; document.getElementById('cnn-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 500);
  }

  document.getElementById('cnn-step').addEventListener('click', step);
  document.getElementById('cnn-auto').addEventListener('click', toggleAuto);
  document.getElementById('cnn-reset').addEventListener('click', resetViz);

  draw();
  infoEl.innerHTML = '🔍 <strong>垂直边缘检测核：</strong>检测输入中的垂直边缘。点击"滑动一步"观察卷积计算过程。';
  window.addEventListener('resize', draw);
}
