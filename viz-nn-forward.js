/**
 * 可视化：神经网络前向传播 —— 3层网络，点击"前向传播"观察数据流动
 */
function initNNForwardViz(containerId){
  const container=document.getElementById(containerId);
  if(!container)return;

  container.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="nn-canvas" style="width:520px;height:340px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <button id="nn-step" style="padding:0.45rem 1rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.85rem">▶ 前向传播一步</button>
        <button id="nn-reset" style="padding:0.45rem 0.7rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="nn-info" style="margin-top:0.5rem;font-size:0.78rem;color:#6b7c8b;line-height:1.5;min-height:70px"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem">输入层(3)→隐藏层(4)→输出层(2) | ReLU激活</div>
      </div>
    </div>`;

  const canvas=document.getElementById('nn-canvas');
  const infoEl=document.getElementById('nn-info');
  // 网络结构：3输入→4隐藏→2输出
  const layers=[3,4,2];
  const weights=[
    [[0.5,0.3,-0.2,0.8],[-0.4,0.7,0.1,-0.3],[0.6,-0.5,0.9,0.2]], // 输入→隐藏 W1[3×4]
    [[0.7,-0.3],[0.4,0.6],[-0.5,0.8],[0.3,-0.7]]                 // 隐藏→输出 W2[4×2]
  ];
  const biases=[[0.1,-0.1,0.05,-0.05],[0.2,-0.2]];
  const input=[0.8,0.3,0.5]; // 固定输入
  let hidden=[0,0,0,0],output=[0,0];
  let stepNum=0; // 0=初始,1=隐藏层计算完,2=输出层计算完

  function reset(){hidden=[0,0,0,0];output=[0,0];stepNum=0;draw();infoEl.textContent='🔍 输入值 X=[0.8, 0.3, 0.5]，点击"前向传播一步"观察数据如何从输入层流向输出层。';}

  function step(){
    if(stepNum===0){
      // 计算隐藏层：h=ReLU(X·W1+b1)
      for(let j=0;j<4;j++){
        let sum=biases[0][j];
        for(let i=0;i<3;i++)sum+=input[i]*weights[0][i][j];
        hidden[j]=Math.max(0,sum); // ReLU
      }
      stepNum=1;
      let calc='';
      weights[0].forEach((row,i)=>{row.forEach((w,j)=>{if(w!==0)calc+=`${input[i]}×${w.toFixed(1)} `})});
      infoEl.innerHTML=`<strong>隐藏层计算：h=ReLU(X·W₁+b₁)</strong><br>h₁=ReLU(0.8×0.5+0.3×(−0.4)+0.5×0.6+0.1)=ReLU(${(0.8*0.5+0.3*(-0.4)+0.5*0.6+0.1).toFixed(2)})=<strong>${hidden[0].toFixed(2)}</strong><br>h₂=ReLU(0.8×0.3+0.3×0.7+0.5×(−0.5)−0.1)=ReLU(${(0.8*0.3+0.3*0.7+0.5*(-0.5)-0.1).toFixed(2)})=<strong>${hidden[1].toFixed(2)}</strong><br>...（共4个隐藏神经元）`;
    }else if(stepNum===1){
      for(let j=0;j<2;j++){
        let sum=biases[1][j];
        for(let i=0;i<4;i++)sum+=hidden[i]*weights[1][i][j];
        output[j]=sum;
      }
      stepNum=2;
      let calc='';
      weights[1].forEach((row,i)=>{row.forEach((w,j)=>{calc+=`${hidden[i].toFixed(2)}×${w.toFixed(1)} `})});
      infoEl.innerHTML=`<strong>输出层计算：y=X·W₂+b₂（不用激活，直接输出logits）</strong><br>y₁=${hidden[0].toFixed(2)}×0.7+${hidden[1].toFixed(2)}×0.4+${hidden[2].toFixed(2)}×(−0.5)+${hidden[3].toFixed(2)}×0.3+0.2=<strong>${output[0].toFixed(2)}</strong><br>y₂=...=<strong>${output[1].toFixed(2)}</strong><br>✅ 前向传播完成！softmax后可转为概率。`;
    }
    draw();
  }

  function draw(){
    const r=Viz.ctx('nn-canvas');if(!r)return;
    const{ctx,w,h}=r;
    const layerXs=[80,260,440];
    const nodeColors=['#4a90a4','#5b9a7f','#e8934a'];

    layers.forEach((n,li)=>{
      const lx=layerXs[li];
      const startY=h/2-(n-1)*45/2;
      for(let ni=0;ni<n;ni++){
        const ny=startY+ni*45;
        // 神经元
        let val=0,alpha=0.15;
        if(li===0)val=input[ni];
        else if(li===1)val=stepNum>=1?hidden[ni]:0;
        else val=stepNum>=2?output[ni]:0;
        alpha=stepNum>=li?0.8:0.15;

        ctx.fillStyle=nodeColors[li];ctx.globalAlpha=alpha;
        ctx.beginPath();ctx.arc(lx,ny,16,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
        ctx.strokeStyle=nodeColors[li];ctx.lineWidth=2;ctx.beginPath();ctx.arc(lx,ny,16,0,Math.PI*2);ctx.stroke();

        // 值
        if(stepNum>=li){
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.fillText(val.toFixed(2),lx,ny);
        }else{
          ctx.fillStyle=nodeColors[li];ctx.font='9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.fillText('?',lx,ny);
        }
      }
    });

    // 连接线
    for(let li=0;li<layers.length-1;li++){
      const lx1=layerXs[li],lx2=layerXs[li+1];
      const sy1=h/2-(layers[li]-1)*45/2,sy2=h/2-(layers[li+1]-1)*45/2;
      for(let ni=0;ni<layers[li];ni++){
        for(let nj=0;nj<layers[li+1];nj++){
          const w=weights[li][ni][nj];
          ctx.strokeStyle=w>0?'rgba(74,144,164,0.3)':'rgba(232,147,74,0.3)';
          ctx.lineWidth=Math.abs(w)*1.5;ctx.beginPath();
          ctx.moveTo(lx1+16,sy1+ni*45);ctx.lineTo(lx2-16,sy2+nj*45);ctx.stroke();
        }
      }
    }

    // 标签
    Viz.text(ctx,'输入层',layerXs[0],h-20,{font:'bold 10px sans-serif',color:nodeColors[0]});
    Viz.text(ctx,'隐藏层(ReLU)',layerXs[1],h-20,{font:'bold 10px sans-serif',color:nodeColors[1]});
    Viz.text(ctx,'输出层',layerXs[2],h-20,{font:'bold 10px sans-serif',color:nodeColors[2]});
    Viz.text(ctx,'神经网络前向传播: z=X@W+b → h=ReLU(z)',w/2,16,{font:'bold 11px sans-serif',color:'#2c3e50'});
  }

  document.getElementById('nn-step').addEventListener('click',step);
  document.getElementById('nn-reset').addEventListener('click',reset);
  draw();reset();
  window.addEventListener('resize',draw);
}
