/**
 * 可视化：混淆矩阵 —— 可拖拽调整TP/FP/FN/TN，实时计算指标
 */
function initConfusionViz(containerId){
  const container=document.getElementById(containerId);
  if(!container)return;

  container.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
      <canvas id="cm-canvas" style="width:380px;height:320px;border:1px solid #e2ded6;border-radius:8px;background:#fff;cursor:pointer" title="点击方格修改数值"></canvas>
      <div style="flex:1;min-width:200px">
        <div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.4rem"><strong>点击矩阵方格 ± 数值</strong></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.3rem;font-size:0.76rem" id="cm-metrics"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('cm-canvas');
  const metricsEl=document.getElementById('cm-metrics');
  // 初始混淆矩阵 [TP,FP; FN,TN]
  let cm=[[45,8],[5,42]];

  function calc(){
    const[[tp,fp],[fn,tn]]=cm;const total=tp+fp+fn+tn;
    const accuracy=((tp+tn)/total*100).toFixed(1);
    const precision=tp+fp>0?(tp/(tp+fp)*100).toFixed(1):'—';
    const recall=tp+fn>0?(tp/(tp+fn)*100).toFixed(1):'—';
    const f1=tp+fp+fn>0?(2*tp/(2*tp+fp+fn)).toFixed(2):'—';
    const specificity=tn+fp>0?(tn/(tn+fp)*100).toFixed(1):'—';
    metricsEl.innerHTML=`
      <div>✅ 准确率 Acc</div><div><strong>${accuracy}%</strong></div>
      <div>🎯 精确率 Prec</div><div><strong>${precision}%</strong></div>
      <div>🔍 召回率 Rec</div><div><strong>${recall}%</strong></div>
      <div>⭐ F1-Score</div><div><strong>${f1}</strong></div>
      <div>📊 特异度 Spec</div><div><strong>${specificity}%</strong></div>
      <div>📦 总数</div><div><strong>${total}</strong></div>`;
  }

  function draw(){
    const r=Viz.ctx('cm-canvas');if(!r)return;
    const{ctx,w,h}=r;
    const cx=w/2,cy=h/2+20;
    const cellW=100,cellH=80;
    const cells=[
      {x:cx-cellW,y:cy-cellH,v:cm[0][0],label:'TP',color:'rgba(91,154,127,0.35)',text:'真阳性\nTrue Positive'},
      {x:cx,y:cy-cellH,v:cm[0][1],label:'FP',color:'rgba(232,147,74,0.3)',text:'假阳性\nFalse Positive'},
      {x:cx-cellW,y:cy,v:cm[1][0],label:'FN',color:'rgba(232,147,74,0.3)',text:'假阴性\nFalse Negative'},
      {x:cx,y:cy,v:cm[1][1],label:'TN',color:'rgba(91,154,127,0.35)',text:'真阴性\nTrue Negative'},
    ];
    cells.forEach(c=>{
      ctx.fillStyle=c.color;ctx.fillRect(c.x,c.y,cellW,cellH);
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(c.x,c.y,cellW,cellH);
      ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(c.v,c.x+cellW/2,c.y+cellH/2-8);
      ctx.font='bold 12px sans-serif';ctx.fillText(c.label,c.x+cellW/2,c.y+cellH/2+20);
    });

    // 坐标轴标签
    ctx.fillStyle='#2c3e50';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    ctx.fillText('实际 Positive',cx,cy-cellH-30);
    ctx.fillText('实际 Negative',cx,cy+cellH+30);
    ctx.save();ctx.translate(cx-cellW-35,cy);ctx.rotate(-Math.PI/2);
    ctx.fillText('预测 Positive',0,0);ctx.restore();
    ctx.save();ctx.translate(cx+cellW+35,cy);ctx.rotate(Math.PI/2);
    ctx.fillText('预测 Negative',0,0);ctx.restore();

    Viz.text(ctx,'混淆矩阵 Confusion Matrix',w/2,18,{font:'bold 12px sans-serif',color:'#2c3e50'});
    Viz.text(ctx,'点击方格调整数值',w/2,h-8,{font:'10px sans-serif',color:'var(--text-muted)'});
  }

  canvas.addEventListener('click',function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const cx=380/2,cy=320/2+20,cellW=100,cellH=80;
    const positions=[
      {r:0,c:0,x:cx-cellW,y:cy-cellH},
      {r:0,c:1,x:cx,y:cy-cellH},
      {r:1,c:0,x:cx-cellW,y:cy},
      {r:1,c:1,x:cx,y:cy},
    ];
    positions.forEach(p=>{
      if(mx>=p.x&&mx<=p.x+cellW&&my>=p.y&&my<=p.y+cellH){
        const delta=mx-p.x<cellW/2?-1:1; // 左半减，右半加
        cm[p.r][p.c]=Math.max(0,cm[p.r][p.c]+delta);
        draw();calc();
      }
    });
  });

  draw();calc();
  window.addEventListener('resize',draw);
}
