/**
 * 可视化：学习率对比 —— 三组不同学习率同时跑梯度下降
 */
function initLRCompareViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="lrc-canvas" style="width:500px;height:300px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="lrc-run" style="padding:0.45rem 1rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.85rem">▶ 同时跑 50 步</button>
        <button id="lrc-reset" style="padding:0.45rem 0.7rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="lrc-info" style="margin-top:0.5rem;font-size:0.78rem;color:#6b7c8b;line-height:1.6;min-height:70px"></div>
      </div>
    </div>`;

  const canvas=document.getElementById('lrc-canvas'),info=document.getElementById('lrc-info');
  const configs=[
    {lr:0.02,color:'#4a90a4',label:'α=0.02 (太小)',x:8},
    {lr:0.2,color:'#5b9a7f',label:'α=0.2 (合适)',x:8},
    {lr:0.95,color:'#e8934a',label:'α=0.95 (太大)',x:8},
  ];
  let histories=configs.map(c=>[{x:c.x,y:c.x*c.x}]);

  function draw(){
    const r=Viz.ctx('lrc-canvas');if(!r)return;const{ctx,w,h}=r;
    // 损失曲线 L=x²
    ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=2;
    ctx.beginPath();
    for(let px=0;px<w;px++){const mx=(px-40)/400*18-9;const py=280-(mx*mx)/81*230;if(px===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
    ctx.stroke();
    Viz.axis(ctx,40,280,w,h,{xLabel:'W',yLabel:'L=W²'});
    Viz.point(ctx,40,280,5,'#2c3e50');Viz.text(ctx,'最小值',40,295,{font:'9px sans-serif',color:'#2c3e50'});

    // 三组路径
    configs.forEach((cfg,i)=>{
      const h=histories[i];
      ctx.strokeStyle=cfg.color;ctx.lineWidth=2.5;
      ctx.beginPath();
      h.forEach((pt,j)=>{
        const px=40+(pt.x+9)/18*400,py=280-(pt.y)/81*230;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      });
      ctx.stroke();
      h.forEach((pt,j)=>{if(j%5===0||j===h.length-1){const px=40+(pt.x+9)/18*400,py=280-(pt.y)/81*230;Viz.point(ctx,px,py,4,cfg.color);}});
      const last=h[h.length-1];
      const px=40+(last.x+9)/18*400,py=280-(last.y)/81*230;
      Viz.text(ctx,cfg.label,px+10,py-8,{font:'bold 10px sans-serif',color:cfg.color,align:'left'});
    });

    Viz.text(ctx,'学习率对比',w/2,16,{font:'bold 12px sans-serif',color:'#2c3e50'});

    let status='';
    configs.forEach((cfg,i)=>{
      const last=histories[i][histories[i].length-1];
      if(last.y<0.01)status+=`<span style="color:${cfg.color}">✅ ${cfg.label}: 收敛到 W≈${last.x.toFixed(3)}</span><br>`;
      else if(last.y>histories[i][Math.max(0,histories[i].length-5)].y)status+=`<span style="color:${cfg.color}">💥 ${cfg.label}: 震荡发散! W=${last.x.toFixed(1)}</span><br>`;
      else status+=`<span style="color:${cfg.color}">🐢 ${cfg.label}: 仍在收敛中 W=${last.x.toFixed(3)}</span><br>`;
    });
    info.innerHTML=status;
  }

  function run(){
    for(let step=0;step<50;step++){
      configs.forEach((cfg,i)=>{
        const last=histories[i][histories[i].length-1];
        const grad=2*last.x;
        const nx=last.x-cfg.lr*grad;
        histories[i].push({x:nx,y:nx*nx});
      });
    }
    draw();
  }

  function reset(){
    histories=configs.map(c=>[{x:c.x,y:c.x*c.x}]);
    draw();
    info.innerHTML='🔍 同一函数 L=W²，同一起点 W=8，不同学习率。点击"同时跑50步"观察差别。';
  }

  document.getElementById('lrc-run').addEventListener('click',run);
  document.getElementById('lrc-reset').addEventListener('click',reset);
  draw();info.innerHTML='🔍 L=W²，起点 W=8。三种学习率同时跑 50 步，观察收敛速度和稳定性。';
  window.addEventListener('resize',draw);
}
