/**
 * 可视化：池化层 —— MaxPool / AvgPool 滑动窗口演示
 */
function initPoolingViz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="pool-canvas" style="width:560px;height:370px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="pool-step" style="padding:0.5rem 1.2rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9rem">▶ 滑动一步</button>
        <button id="pool-auto" style="padding:0.5rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;margin-left:0.4rem">⏩ 自动</button>
        <button id="pool-reset" style="padding:0.5rem 0.8rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div style="margin-top:0.5rem;display:flex;gap:0.4rem">
          <button id="pool-max-btn" style="padding:0.4rem 0.9rem;background:#4a90a4;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.82rem">MaxPool</button>
          <button id="pool-avg-btn" style="padding:0.4rem 0.9rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.82rem">AvgPool</button>
        </div>
        <div id="pool-info" style="margin-top:0.6rem;background:#f8fdfe;padding:0.55rem 0.7rem;border-radius:6px;font-size:0.8rem;color:#2c3e50;min-height:60px;line-height:1.55"></div>
        <div style="font-size:0.73rem;color:var(--text-muted);margin-top:0.4rem">4×4 输入 · 2×2 池化窗口 · stride=2 · 输出 2×2</div>
      </div>
    </div>`;

  const canvas = document.getElementById('pool-canvas');
  const infoEl = document.getElementById('pool-info');

  // 4×4 输入特征图（模拟卷积后的特征值）
  const input = [
    [3, 1, 4, 2],
    [2, 8, 1, 5],
    [7, 1, 6, 3],
    [4, 2, 3, 9]
  ];

  const poolSize = 2, stride = 2;
  const outSize = 2; // (4-2)/2+1 = 2

  // 预计算输出
  const maxOutput = [[0, 0], [0, 0]];
  const avgOutput = [[0, 0], [0, 0]];
  for (let i = 0; i < outSize; i++) {
    for (let j = 0; j < outSize; j++) {
      let maxVal = -Infinity, sum = 0;
      for (let pi = 0; pi < poolSize; pi++) {
        for (let pj = 0; pj < poolSize; pj++) {
          const val = input[i * stride + pi][j * stride + pj];
          if (val > maxVal) maxVal = val;
          sum += val;
        }
      }
      maxOutput[i][j] = maxVal;
      avgOutput[i][j] = +(sum / (poolSize * poolSize)).toFixed(1);
    }
  }

  let mode = 'max'; // 'max' | 'avg'
  let curRow = 0, curCol = 0;
  const highlighted = Array.from({ length: outSize }, () => Array(outSize).fill(false));
  let autoTimer = null;

  function getHeatColor(val) {
    const alpha = Math.min(1, val / 10);
    if (val >= 7) return `rgba(74,144,164,${0.25 + alpha * 0.5})`;
    if (val >= 4) return `rgba(74,144,164,${0.12 + alpha * 0.35})`;
    return `rgba(148,163,179,${0.08 + alpha * 0.15})`;
  }

  function draw() {
    const r = Viz.ctx('pool-canvas');
    if (!r) return;
    const { ctx, w, h } = r;
    const cellSize = 52;
    const inputOx = 40, inputOy = 55;
    const outputOx = 320, outputOy = 55;
    const arrowX = inputOx + 4 * cellSize + 30;

    // 标题
    Viz.text(ctx, '输入特征图 4×4', inputOx + 2 * cellSize, inputOy - 18, { font: 'bold 12px sans-serif', color: '#2c3e50' });
    Viz.text(ctx, `${mode === 'max' ? 'MaxPool' : 'AvgPool'} 输出 2×2`, outputOx + cellSize, outputOy - 18, { font: 'bold 12px sans-serif', color: '#2c3e50' });
    Viz.text(ctx, `${mode === 'max' ? '最大池化' : '平均池化'} (2×2, stride=2)`, w / 2, 20, { font: 'bold 11px sans-serif', color: '#4a90a4' });

    // 池化模式指示
    ctx.fillStyle = mode === 'max' ? '#4a90a4' : '#5b9a7f';
    ctx.beginPath();
    ctx.roundRect(w - 110, 8, 100, 22, 5);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(mode === 'max' ? 'MaxPool 模式' : 'AvgPool 模式', w - 60, 19);
    ctx.textBaseline = 'alphabetic';

    // ── 绘制输入特征图 ──
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const x = inputOx + j * cellSize, y = inputOy + i * cellSize;
        // 是否在当前池化窗口内
        const inWindow = (i >= curRow * stride && i < curRow * stride + poolSize &&
                          j >= curCol * stride && j < curCol * stride + poolSize);

        ctx.fillStyle = inWindow ? 'rgba(74,144,164,0.18)' : getHeatColor(input[i][j]);
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = inWindow ? '#4a90a4' : '#e2ded6';
        ctx.lineWidth = inWindow ? 2.5 : 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // 值
        let textColor = '#2c3e50';
        if (inWindow && mode === 'max') {
          // MaxPool: 高亮窗口内的最大值
          const maxVal = maxOutput[curRow]?.[curCol] ?? 0;
          if (highlighted[curRow]?.[curCol] && input[i][j] === maxVal) {
            ctx.fillStyle = '#e8934a'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(input[i][j], x + cellSize / 2, y + cellSize / 2);
            ctx.textBaseline = 'alphabetic';
            continue;
          }
        }
        if (inWindow && mode === 'avg' && highlighted[curRow]?.[curCol]) {
          textColor = '#5b9a7f';
        }
        Viz.text(ctx, input[i][j], x + cellSize / 2, y + cellSize / 2, { font: 'bold 15px sans-serif', color: textColor });
      }
    }

    // 池化窗口边框（加粗）
    const wx = inputOx + curCol * stride * cellSize;
    const wy = inputOy + curRow * stride * cellSize;
    ctx.strokeStyle = '#4a90a4';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(wx, wy, poolSize * cellSize, poolSize * cellSize);
    ctx.setLineDash([]);

    // ── 箭头 ──
    Viz.text(ctx, '⟹', arrowX - 15, inputOy + 2 * cellSize, { font: 'bold 22px sans-serif', color: '#4a90a4' });
    // 操作标签
    ctx.fillStyle = '#e8934a'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(mode === 'max' ? '取最大值' : '取平均值', arrowX, inputOy + 2 * cellSize + 18);

    // ── 绘制输出特征图 ──
    for (let i = 0; i < outSize; i++) {
      for (let j = 0; j < outSize; j++) {
        const x = outputOx + j * cellSize, y = outputOy + i * cellSize;
        const isCur = (i === curRow && j === curCol);
        const isDone = highlighted[i][j];

        ctx.fillStyle = isCur ? 'rgba(232,147,74,0.22)' : isDone ? 'rgba(74,144,164,0.1)' : '#faf9f7';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = isCur ? '#e8934a' : isDone ? '#4a90a4' : '#e2ded6';
        ctx.lineWidth = isCur ? 2.5 : isDone ? 2 : 1;
        ctx.strokeRect(x, y, cellSize, cellSize);

        // 值
        if (isDone || isCur) {
          const val = mode === 'max' ? maxOutput[i][j] : avgOutput[i][j];
          Viz.text(ctx, val, x + cellSize / 2, y + cellSize / 2, { font: 'bold 16px sans-serif', color: isCur ? '#e8934a' : '#4a90a4' });
        } else {
          Viz.text(ctx, '?', x + cellSize / 2, y + cellSize / 2, { font: 'bold 14px sans-serif', color: '#c0c5cc' });
        }

        // 坐标标签
        ctx.fillStyle = '#94a3b3'; ctx.font = '8px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(`[${i},${j}]`, x + cellSize - 4, y + cellSize - 6);
      }
    }

    // ── 计算展示 ──
    if (highlighted[curRow]?.[curCol]) {
      const rowStart = curRow * stride, colStart = curCol * stride;
      let detail = '';
      if (mode === 'max') {
        let maxVal = -Infinity;
        let vals = [];
        for (let pi = 0; pi < poolSize; pi++) {
          for (let pj = 0; pj < poolSize; pj++) {
            const val = input[rowStart + pi][colStart + pj];
            vals.push(val);
            if (val > maxVal) maxVal = val;
          }
        }
        detail = `max(${vals.join(', ')}) = <strong style="color:#e8934a">${maxVal}</strong>`;
      } else {
        let sum = 0;
        let vals = [];
        for (let pi = 0; pi < poolSize; pi++) {
          for (let pj = 0; pj < poolSize; pj++) {
            const val = input[rowStart + pi][colStart + pj];
            vals.push(val);
            sum += val;
          }
        }
        const avg = (sum / 4).toFixed(1);
        detail = `avg(${vals.join('+')}) = ${sum}/4 = <strong style="color:#5b9a7f">${avg}</strong>`;
      }
      infoEl.innerHTML = `📍 窗口位置 [${curRow},${curCol}]：${detail}<br><span style="font-size:0.75rem;color:#6b7c8b">输入区域：行${rowStart}~${rowStart+1}，列${colStart}~${colStart+1}</span>`;
    }
  }

  function step() {
    highlighted[curRow][curCol] = true;
    curCol++;
    if (curCol >= outSize) { curCol = 0; curRow++; }
    if (curRow >= outSize) { curRow = outSize - 1; curCol = outSize - 1; }
    draw();

    const allDone = highlighted.every(row => row.every(v => v));
    if (allDone) {
      const outVals = (mode === 'max' ? maxOutput : avgOutput).flat().join(', ');
      infoEl.innerHTML += `<br>✅ <strong>池化完成！</strong>输出 = [${outVals}] · 空间维度从 4×4 降到 <strong>2×2</strong>（降维75%），通道数不变`;
    }
  }

  function resetViz() {
    curRow = 0; curCol = 0;
    for (let i = 0; i < outSize; i++) for (let j = 0; j < outSize; j++) highlighted[i][j] = false;
    draw();
    infoEl.innerHTML = `🔍 <strong>${mode === 'max' ? '最大池化 (MaxPool)：' : '平均池化 (AvgPool)：'}</strong>${mode === 'max' ? '取窗口内最大值——保留最显著特征，对微小变化鲁棒' : '取窗口内平均值——平滑特征，保留整体趋势'}<br><span style="font-size:0.75rem;color:#6b7c8b">点击"滑动一步"观察每个2×2窗口如何压缩为一个值</span>`;
  }

  function switchMode(newMode) {
    mode = newMode;
    document.getElementById('pool-max-btn').style.background = mode === 'max' ? '#4a90a4' : '#fff';
    document.getElementById('pool-max-btn').style.color = mode === 'max' ? '#fff' : '#4a90a4';
    document.getElementById('pool-max-btn').style.fontWeight = mode === 'max' ? '700' : '600';
    document.getElementById('pool-avg-btn').style.background = mode === 'avg' ? '#5b9a7f' : '#fff';
    document.getElementById('pool-avg-btn').style.color = mode === 'avg' ? '#fff' : '#4a90a4';
    document.getElementById('pool-avg-btn').style.borderColor = mode === 'avg' ? '#5b9a7f' : '#4a90a4';
    document.getElementById('pool-avg-btn').style.fontWeight = mode === 'avg' ? '700' : '600';
    resetViz();
  }

  function toggleAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('pool-auto').textContent = '⏩ 自动'; return; }
    document.getElementById('pool-auto').textContent = '⏸ 停止';
    autoTimer = setInterval(() => {
      if (highlighted.every(row => row.every(v => v))) { clearInterval(autoTimer); autoTimer = null; document.getElementById('pool-auto').textContent = '⏩ 自动'; return; }
      step();
    }, 600);
  }

  document.getElementById('pool-step').addEventListener('click', step);
  document.getElementById('pool-auto').addEventListener('click', toggleAuto);
  document.getElementById('pool-reset').addEventListener('click', resetViz);
  document.getElementById('pool-max-btn').addEventListener('click', () => switchMode('max'));
  document.getElementById('pool-avg-btn').addEventListener('click', () => switchMode('avg'));

  draw();
  // 初始设置按钮样式（内部会调用 resetViz）
  switchMode('max');
  window.addEventListener('resize', draw);
}
