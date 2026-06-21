/**
 * 可视化：Dropout 随机失活 —— 切换训练/推理模式，观察神经元变化
 */
function initDropoutViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="do-canvas" style="width:480px;height:280px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="display:flex;gap:0.4rem;margin-bottom:0.6rem">
          <button class="do-mode-btn active" data-mode="train" style="padding:0.35rem 0.8rem;border:2px solid #e8934a;border-radius:15px;background:#e8934a;color:#fff;cursor:pointer;font-weight:600;font-size:0.8rem">🔴 训练模式</button>
          <button class="do-mode-btn" data-mode="test" style="padding:0.35rem 0.8rem;border:2px solid #4a90a4;border-radius:15px;background:#fff;color:#4a90a4;cursor:pointer;font-weight:600;font-size:0.8rem">🟢 推理模式</button>
        </div>
        <div style="font-size:0.8rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>失活率 p：</strong><span id="do-p-val" style="color:#e8934a;font-weight:700">0.4</span></div>
          <input type="range" id="do-p" min="0" max="80" value="40" style="width:100%">
          <button id="do-resample" style="margin-top:0.5rem;padding:0.35rem 0.8rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem">🎲 重新采样</button>
          <div id="do-info" style="margin-top:0.5rem;font-size:0.76rem;color:var(--text-light);min-height:40px;line-height:1.5"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('do-canvas'),info=document.getElementById('do-info');
  let mode='train',p=0.4;
  // 3层网络：4→6→4→2
  const layers=[4,6,4,2];
  let active=layers.map(n=>Array(n).fill(true));

  function resample(){
    active=layers.map((n,i)=>{
      if(i===0||i===layers.length-1)return Array(n).fill(true); // 输入/输出层不失活
      if(mode==='test')return Array(n).fill(true);
      return Array(n).fill(()=>Math.random()>p);
    });
    active.forEach((a,i)=>{if(i>0&&i<layers.length-1)for(let j=0;j<a.length;j++)a[j]=mode==='test'||Math.random()>p;});
  }

  function draw(){
    const r=Viz.ctx('do-canvas');if(!r)return;const{ctx,w,h}=r;
    const layerXs=[60,190,320,450];
    const nodeColors=['#4a90a4','#e8934a','#e8934a','#5b9a7f'];
    const nodeR=14;

    // 连线
    for(let li=0;li<layers.length-1;li++){
      const sy1=h/2-(layers[li]-1)*36/2,sy2=h/2-(layers[li+1]-1)*36/2;
      for(let ni=0;ni<layers[li];ni++){
        if(!active[li][ni])continue;
        for(let nj=0;nj<layers[li+1];nj++){
          if(!active[li+1][nj])continue;
          ctx.strokeStyle='rgba(148,163,179,0.25)';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(layerXs[li]+nodeR,sy1+ni*36);ctx.lineTo(layerXs[li+1]-nodeR,sy2+nj*36);ctx.stroke();
        }
      }
    }

    // 神经元
    layers.forEach((n,li)=>{
      const lx=layerXs[li],sy=h/2-(n-1)*36/2;
      for(let ni=0;ni<n;ni++){
        const ny=sy+ni*36,isActive=active[li][ni];
        ctx.fillStyle=isActive?nodeColors[li]:'rgba(200,200,200,0.3)';
        ctx.globalAlpha=isActive?0.9:0.25;
        ctx.beginPath();ctx.arc(lx,ny,nodeR,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
        ctx.strokeStyle=isActive?nodeColors[li]:'#ddd';ctx.lineWidth=isActive?2:1;
        ctx.beginPath();ctx.arc(lx,ny,nodeR,0,Math.PI*2);ctx.stroke();
        if(!isActive&&mode==='train'){ctx.strokeStyle='#e8934a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lx-8,ny-8);ctx.lineTo(lx+8,ny+8);ctx.moveTo(lx+8,ny-8);ctx.lineTo(lx-8,ny+8);ctx.stroke();}
      }
    });

    // 标签
    Viz.text(ctx,'输入层',layerXs[0],h-25,{font:'bold 10px sans-serif',color:nodeColors[0]});
    Viz.text(ctx,'隐藏层1',layerXs[1],h-25,{font:'bold 10px sans-serif',color:nodeColors[1]});
    Viz.text(ctx,'隐藏层2',layerXs[2],h-25,{font:'bold 10px sans-serif',color:nodeColors[2]});
    Viz.text(ctx,'输出层',layerXs[3],h-25,{font:'bold 10px sans-serif',color:nodeColors[3]});

    const activeCount=active.slice(1,-1).reduce((s,a)=>s+a.filter(v=>v).length,0);
    const totalCount=layers.slice(1,-1).reduce((s,n)=>s+n,0);
    Viz.text(ctx,mode==='train'?`Dropout p=${p.toFixed(1)} | 存活: ${activeCount}/${totalCount} (${(activeCount/totalCount*100).toFixed(0)}%)`:'推理模式：所有神经元激活',w/2,16,{font:'bold 11px sans-serif',color:mode==='train'?'#e8934a':'#4a90a4'});

    if(mode==='train'){
      info.innerHTML=`🔴 <strong>训练模式：</strong>每个隐藏层神经元以概率 p=<strong>${p.toFixed(1)}</strong> 随机失活（❌），存活者输出值 ×<strong>${(1/(1-p)).toFixed(2)}</strong> 补偿。每次前向传播相当于在<strong>随机子网络</strong>上训练——这是集成学习的变体。`;
    }else{
      info.innerHTML='🟢 <strong>推理模式：</strong>Dropout 不生效，所有神经元参与计算。权重已在训练时被平均缩放，推理时无需额外调整。';
    }
  }

  resample();
  document.getElementById('do-p').addEventListener('input',function(){p=this.value/100;document.getElementById('do-p-val').textContent=p.toFixed(1);resample();draw();});
  document.getElementById('do-resample').addEventListener('click',()=>{resample();draw();});
  c.querySelectorAll('.do-mode-btn').forEach(btn=>{btn.addEventListener('click',function(){
    c.querySelectorAll('.do-mode-btn').forEach(b=>{b.classList.remove('active');b.style.background='#fff';});
    this.classList.add('active');mode=this.dataset.mode;
    this.style.background=mode==='train'?'#e8934a':'#4a90a4';this.style.color='#fff';
    resample();draw();
  });});
  draw();window.addEventListener('resize',draw);
}
