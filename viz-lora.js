/**
 * 可视化：LoRA 低秩微调 —— 展示矩阵分解与参数量对比
 */
function initLoRAViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="lora-canvas" style="width:480px;height:360px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>⚙️ 矩阵维度设置：</strong></div>
          <div style="margin-bottom:0.3rem">
            <span>原始维度 n：</span><span id="lora-n-val" style="color:#4a90a4;font-weight:700">4096</span>
            <input type="range" id="lora-n" min="256" max="8192" value="4096" step="256" style="width:100%">
          </div>
          <div style="margin-bottom:0.3rem">
            <span>秩 r：</span><span id="lora-r-val" style="color:#e8934a;font-weight:700">16</span>
            <input type="range" id="lora-r" min="1" max="128" value="16" step="1" style="width:100%">
          </div>
          <div id="lora-result" style="background:#f8fdfe;padding:0.5rem;border-radius:8px;font-size:0.8rem;min-height:100px;line-height:1.5;margin-top:0.5rem"></div>
          <div id="lora-formula" style="margin-top:0.4rem;font-size:0.72rem;color:var(--text-light);font-family:monospace"></div>
        </div>
      </div>
    </div>`;

  function draw(){
    const r=Viz.ctx('lora-canvas');if(!r)return;const{ctx,w,h}=r;
    ctx.clearRect(0,0,w,h);

    const n=parseInt(document.getElementById('lora-n').value);
    const rank=parseInt(document.getElementById('lora-r').value);
    document.getElementById('lora-n-val').textContent=n;
    document.getElementById('lora-r-val').textContent=rank;

    // 原始矩阵 ΔW [n×n]
    const fullScale=Math.min(160,200*Math.sqrt(256/n)); // 根据n缩放显示
    const fullX=40,fullY=50,fullW=fullScale,fullH=fullScale;
    ctx.fillStyle='rgba(74,144,164,0.2)';ctx.strokeStyle='#4a90a4';ctx.lineWidth=2;
    Viz.roundRect(ctx,fullX,fullY,fullW,fullH,4);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4a90a4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(`ΔW`,fullX+fullW/2,fullY-8);
    ctx.fillText(`${n}×${n}`,fullX+fullW/2,fullY+fullH/2);
    ctx.fillText(`${(n*n).toLocaleString()} 参数`,fullX+fullW/2,fullY+fullH+16);

    // 分解 A [n×r]
    const ax=fullX+fullW+80,ay=fullY;
    const aScaleH=fullScale;
    const aScaleW=Math.max(20,fullScale*rank/n);
    ctx.fillStyle='rgba(232,147,74,0.25)';ctx.strokeStyle='#e8934a';ctx.lineWidth=2;
    Viz.roundRect(ctx,ax,ay,aScaleW,aScaleH,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#e8934a';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(`A`,ax+aScaleW/2,ay-8);
    ctx.fillText(`${n}×${rank}`,ax+aScaleW/2,ay+aScaleH/2);
    ctx.fillText(`${(n*rank).toLocaleString()}`,ax+aScaleW/2,ay+aScaleH+16);

    // 乘号
    ctx.fillStyle='#2c3e50';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText('×',ax+aScaleW+16,ay+aScaleH/2+4);

    // 分解 B [r×n]
    const bx=ax+aScaleW+32,by=fullY+(fullScale-aScaleW);
    const bScaleH=Math.max(20,fullScale*rank/n);
    const bScaleW=fullScale;
    ctx.fillStyle='rgba(91,154,127,0.25)';ctx.strokeStyle='#5b9a7f';ctx.lineWidth=2;
    Viz.roundRect(ctx,bx,by,bScaleW,bScaleH,3);ctx.fill();ctx.stroke();
    ctx.fillStyle='#5b9a7f';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(`B`,bx+bScaleW/2,by-8);
    ctx.fillText(`${rank}×${n}`,bx+bScaleW/2,by+bScaleH/2);

    // 等号
    ctx.fillStyle='#2c3e50';ctx.font='bold 18px sans-serif';ctx.textAlign='center';
    ctx.fillText('=',bx+bScaleW+20,ay+aScaleH/2+4);

    // 简化图示
    // 全矩阵 vs 低秩
    const fullParams=n*n;
    const loraParams=2*n*rank;
    const ratio=(loraParams/fullParams*100);
    const compression=n/(2*rank);

    // 下半部分：参数对比
    const compY=fullY+fullScale+60;
    Viz.text(ctx,'参数量对比',w/2,compY-10,{font:'bold 13px sans-serif',color:'#2c3e50'});

    const maxBarW=400,barH=28;
    const barX=(w-maxBarW)/2;

    // 原始参数条
    ctx.fillStyle='#f1f5f9';ctx.fillRect(barX,compY,maxBarW,barH);
    const fullBarW=Math.min(maxBarW,fullParams/200000*maxBarW);
    ctx.fillStyle='#4a90a4';ctx.fillRect(barX,compY,fullBarW,barH);
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    ctx.fillText(` 原始 ΔW: ${fullParams.toLocaleString()} params`,barX+6,compY+18);

    // LoRA参数条
    const loraBarW=Math.min(maxBarW,loraParams/200000*maxBarW);
    if(loraBarW<4)loraBarW=4;
    ctx.fillStyle='#f1f5f9';ctx.fillRect(barX,compY+40,maxBarW,barH);
    ctx.fillStyle='#e8934a';ctx.fillRect(barX,compY+40,loraBarW,barH);
    ctx.fillStyle=loraBarW>40?'#fff':'#2c3e50';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    ctx.fillText(` LoRA A+B: ${loraParams.toLocaleString()} params (${ratio.toFixed(2)}%)`,barX+6,compY+58);

    // 结论
    const concY=compY+90;
    ctx.fillStyle='#f8fdfe';ctx.strokeStyle='#e8934a';ctx.lineWidth=2;
    Viz.roundRect(ctx,barX,concY,maxBarW,36,8);ctx.fill();ctx.stroke();
    ctx.fillStyle='#2c3e50';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText(`📉 参数量仅原来的 1/${compression.toFixed(0)} —— 减少 ${(100-ratio).toFixed(1)}%！`,w/2,concY+24);

    // 结果面板
    document.getElementById('lora-result').innerHTML=`
      <strong>LoRA 核心思想：</strong><br>
      • 原始权重 <strong>冻结不训练</strong><br>
      • 只训练低秩增量 ΔW = <strong>A</strong><sub>${n}×${rank}</sub> · <strong>B</strong><sub>${rank}×${n}</sub><br>
      • 训练参数：<strong style="color:#e8934a">${loraParams.toLocaleString()}</strong> vs 原始 <strong style="color:#4a90a4">${fullParams.toLocaleString()}</strong><br>
      • 压缩比：<strong>${compression.toFixed(0)}:1</strong>（仅为原来的 <strong>${ratio.toFixed(2)}%</strong>）<br>
      • r=${rank} 时，可训练参数仅 ${(2*rank/n*100).toFixed(2)}%
    `;
    document.getElementById('lora-formula').innerHTML=`
      ΔW<sub>${n}×${n}</sub> = A<sub>${n}×${rank}</sub> · B<sub>${rank}×${n}</sub><br>
      参数量: ${n}×${rank} + ${rank}×${n} = 2·${n}·${rank} = <strong>${loraParams.toLocaleString()}</strong><br>
      比例: (2·${n}·${rank})/(${n}·${n}) = 2·${rank}/${n} = <strong>${(2*rank/n).toFixed(4)}</strong>
    `;
  }

  document.getElementById('lora-n').addEventListener('input',draw);
  document.getElementById('lora-r').addEventListener('input',draw);

  draw();window.addEventListener('resize',draw);
}
