/**
 * 可视化：过拟合 vs 欠拟合 —— 多项式回归，调整阶数观察拟合状态
 */
function initOverfitViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="of-canvas" style="width:480px;height:300px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <div style="font-size:0.8rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>多项式阶数：</strong><span id="of-degree-val" style="color:#4a90a4;font-weight:700">1</span></div>
          <input type="range" id="of-degree" min="1" max="15" value="1" style="width:100%">
          <div style="display:flex;justify-content:space-between;font-size:0.7rem"><span>1(欠拟合)</span><span>3(刚好)</span><span>15(过拟合)</span></div>
          <div id="of-info" style="margin-top:0.5rem;background:#f8fdfe;padding:0.5rem;border-radius:6px;font-size:0.78rem;min-height:60px;line-height:1.5"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('of-canvas'),info=document.getElementById('of-info');
  // 生成带噪声的 sin 数据
  const X=[],Y=[];
  for(let i=0;i<30;i++){const x=(i/29)*10;X.push(x);Y.push(Math.sin(x)+(Math.random()-0.5)*0.6);}

  function polyFit(degree){
    // 简单多项式拟合（正规方程）
    const n=X.length,d=degree+1;
    const A=[];for(let i=0;i<n;i++){A[i]=[];for(let j=0;j<d;j++)A[i][j]=Math.pow(X[i],j);}
    // AT*A
    const ATA=[];for(let i=0;i<d;i++){ATA[i]=[];for(let j=0;j<d;j++){let s=0;for(let k=0;k<n;k++)s+=A[k][i]*A[k][j];ATA[i][j]=s;}}
    // AT*Y
    const ATY=[];for(let i=0;i<d;i++){let s=0;for(let k=0;k<n;k++)s+=A[k][i]*Y[k];ATY[i]=s;}
    // 高斯消元解 ATA*coeff=ATY
    const mat=ATA.map((r,i)=>[...r,ATY[i]]);
    for(let i=0;i<d;i++){
      let pivot=i;for(let j=i+1;j<d;j++)if(Math.abs(mat[j][i])>Math.abs(mat[pivot][i]))pivot=j;
      [mat[i],mat[pivot]]=[mat[pivot],mat[i]];
      for(let j=i+1;j<d;j++){const f=mat[j][i]/mat[i][i];for(let k=i;k<=d;k++)mat[j][k]-=f*mat[i][k];}
    }
    const coeff=[];for(let i=d-1;i>=0;i--){coeff[i]=mat[i][d];for(let j=i+1;j<d;j++)coeff[i]-=mat[i][j]*coeff[j];coeff[i]/=mat[i][i];}
    return coeff;
  }

  function draw(){
    const r=Viz.ctx('of-canvas');if(!r)return;const{ctx,w,h}=r;
    const degree=parseInt(document.getElementById('of-degree').value);
    document.getElementById('of-degree-val').textContent=degree;
    const coeff=polyFit(degree);
    const mx=40,my=30;

    // 坐标轴
    Viz.axis(ctx,mx,h-my,w,h,{xLabel:'X',yLabel:'y'});

    // 数据点
    X.forEach((x,i)=>{
      const px=mx+(x/10)*(w-80),py=h-my-(Y[i]+1.5)/3*(h-80);
      ctx.fillStyle='#4a90a4';ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
    });

    // 拟合曲线
    ctx.strokeStyle='#e8934a';ctx.lineWidth=2.5;
    ctx.beginPath();
    for(let px=0;px<w;px++){
      const x=(px-mx)/(w-80)*10;
      let y=0;for(let j=0;j<coeff.length;j++)y+=coeff[j]*Math.pow(x,j);
      const py=h-my-(y+1.5)/3*(h-80);
      if(px===0)ctx.moveTo(px,Math.max(10,Math.min(h-10,py)));
      else ctx.lineTo(px,Math.max(10,Math.min(h-10,py)));
    }
    ctx.stroke();

    // 真实 sin 曲线
    ctx.strokeStyle='rgba(91,154,127,0.3)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
    ctx.beginPath();
    for(let px=0;px<w;px++){const x=(px-mx)/(w-80)*10;const py=h-my-(Math.sin(x)+1.5)/3*(h-80);if(px===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
    ctx.stroke();ctx.setLineDash([]);

    Viz.text(ctx,'真实函数(虚线) vs 拟合曲线(实线)',w/2,h-10,{font:'10px sans-serif',color:'var(--text-muted)'});
    Viz.text(ctx,`多项式阶数=${degree}`,w/2,16,{font:'bold 12px sans-serif',color:'#2c3e50'});

    if(degree<=2)info.innerHTML='🔴 <strong>欠拟合 (Underfitting)：</strong>模型太简单，无法捕捉数据的真实模式。训练集和测试集表现都差。→ 增加模型复杂度/特征数量。';
    else if(degree<=5)info.innerHTML='🟢 <strong>拟合良好 (Good Fit)：</strong>模型复杂度与数据量匹配，较好地捕捉了真实模式。泛化能力强。';
    else if(degree<=9)info.innerHTML='🟡 <strong>开始过拟合：</strong>曲线开始过度贴合个别噪声点。训练集表现好但测试集会变差。';
    else info.innerHTML='🔴 <strong>严重过拟合 (Overfitting)：</strong>曲线剧烈震荡，完全记住了训练数据的噪声。训练集完美但测试集差→泛化能力极差。→ 加数据/正则化/降阶数。';
  }

  document.getElementById('of-degree').addEventListener('input',draw);
  draw();window.addEventListener('resize',draw);
}
