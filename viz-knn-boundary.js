/**
 * 可视化：KNN 决策边界 —— 调节 K 值观察边界变化
 */
function initKNNBoundaryViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="knnb-canvas" style="width:460px;height:320px;border:1px solid #e2ded6;border-radius:8px;background:#fff;cursor:pointer" title="点击添加测试点"></canvas>
      <div style="flex:1;min-width:190px">
        <div style="font-size:0.8rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>K 值：</strong><span id="knnb-k-val" style="color:#e8934a;font-weight:700">3</span></div>
          <input type="range" id="knnb-k" min="1" max="15" value="3" style="width:100%">
          <div style="display:flex;justify-content:space-between;font-size:0.7rem"><span>K=1</span><span>K=3</span><span>K=8</span><span>K=15</span></div>
          <button id="knnb-reset" style="margin-top:0.5rem;padding:0.35rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem">↺ 新数据</button>
          <div id="knnb-info" style="margin-top:0.5rem;font-size:0.76rem;color:var(--text-light);min-height:40px"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('knnb-canvas'),info=document.getElementById('knnb-info');
  let points=[],testPoint=null;
  const colors=['#4a90a4','#e8934a'];

  function genData(){
    points=[];
    for(let i=0;i<20;i++){points.push({x:80+Math.random()*120,y:80+Math.random()*100,label:0});}
    for(let i=0;i<20;i++){points.push({x:260+Math.random()*140,y:140+Math.random()*120,label:1});}
    testPoint={x:220,y:150};
  }

  function draw(){
    const r=Viz.ctx('knnb-canvas');if(!r)return;const{ctx,w,h}=r;
    const K=parseInt(document.getElementById('knnb-k').value);
    document.getElementById('knnb-k-val').textContent=K;

    // 绘制决策背景（采样）
    for(let px=20;px<w;px+=12){
      for(let py=20;py<h;py+=12){
        const dists=points.map((p,i)=>({d:Math.hypot(px-p.x,py-p.y),label:p.label}));
        dists.sort((a,b)=>a.d-b.d);
        const votes=[0,0];for(let i=0;i<K&&i<dists.length;i++)votes[dists[i].label]++;
        ctx.fillStyle=votes[0]>votes[1]?'rgba(74,144,164,0.08)':'rgba(232,147,74,0.08)';
        ctx.fillRect(px,py,12,12);
      }
    }

    // 训练点
    points.forEach(p=>{ctx.fillStyle=colors[p.label];ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();});

    // 测试点
    if(testPoint){
      const dists=points.map((p,i)=>({d:Math.hypot(testPoint.x-p.x,testPoint.y-p.y),label:p.label,i}));
      dists.sort((a,b)=>a.d-b.d);
      // 连线到 K 近邻
      for(let i=0;i<K&&i<dists.length;i++){
        const p=points[dists[i].i];
        ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=1;ctx.setLineDash([2,2]);
        ctx.beginPath();ctx.moveTo(testPoint.x,testPoint.y);ctx.lineTo(p.x,p.y);ctx.stroke();
        ctx.setLineDash([]);
      }
      const votes=[0,0];for(let i=0;i<K&&i<dists.length;i++)votes[dists[i].label]++;
      const pred=votes[0]>votes[1]?0:1;
      ctx.fillStyle=colors[pred];ctx.beginPath();ctx.arc(testPoint.x,testPoint.y,8,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#2c3e50';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(testPoint.x,testPoint.y,8,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('?',testPoint.x,testPoint.y);
      info.innerHTML=`测试点预测为 <strong style="color:${colors[pred]}">${pred===0?'A类':'B类'}</strong>（K=${K}，${pred===0?0:1}类 ${votes[pred]} 票 vs ${pred===0?1:0}类 ${votes[1-pred]} 票）`;
    }

    // 图例
    Viz.text(ctx,'● A类  ● B类',w/2,16,{font:'bold 11px sans-serif',color:'#2c3e50'});
    Viz.text(ctx,'KNN 决策边界（点击画布移动测试点）',w/2,h-10,{font:'10px sans-serif',color:'var(--text-muted)'});
  }

  document.getElementById('knnb-k').addEventListener('input',draw);
  document.getElementById('knnb-reset').addEventListener('click',()=>{genData();draw();});
  canvas.addEventListener('click',function(e){
    const rect=canvas.getBoundingClientRect();
    testPoint={x:e.clientX-rect.left,y:e.clientY-rect.top};
    draw();
  });

  genData();draw();
  window.addEventListener('resize',draw);
}
