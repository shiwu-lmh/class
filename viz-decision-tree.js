/**
 * 可视化：决策树分裂 —— 观察二叉树如何划分特征空间
 */
function initDecisionTreeViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="dt-canvas" style="width:480px;height:340px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <button id="dt-split" style="padding:0.45rem 1rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.85rem">▶ 分裂一步</button>
        <button id="dt-reset" style="padding:0.45rem 0.7rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        <div id="dt-info" style="margin-top:0.5rem;font-size:0.78rem;color:#6b7c8b;line-height:1.5;min-height:50px"></div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.4rem">2D特征空间：X₁(横轴) & X₂(纵轴) | 两类：●A类 ●B类</div>
      </div>
    </div>`;

  const canvas=document.getElementById('dt-canvas'),info=document.getElementById('dt-info');
  const points=[];
  for(let i=0;i<18;i++)points.push({x:60+Math.random()*120,y:80+Math.random()*80,label:0});
  for(let i=0;i<18;i++)points.push({x:280+Math.random()*120,y:160+Math.random()*100,label:1});
  // 加入一些中间地带的点
  points.push({x:200,y:120,label:0},{x:220,y:135,label:1},{x:190,y:150,label:0},{x:240,y:110,label:1});

  const splits=[];
  let regions=null;

  function resetViz(){splits.length=0;regions=null;draw();info.textContent='🔍 点击"分裂一步"观察决策树如何通过不断二分来划分特征空间。';}

  function addSplit(){
    if(regions){
      info.textContent='✅ 分裂完成！共 '+splits.length+' 次分裂，成功将两类样本分到不同区域。';
      return;
    }
    if(splits.length===0){splits.push({axis:'x',val:210});info.textContent='第1次分裂：X₁ ≤ 210 → 左子树，X₁ > 210 → 右子树。Gini系数降低最多。';}
    else if(splits.length===1){splits.push({axis:'y',val:145});info.textContent='第2次分裂：左侧区域按 X₂ ≤ 145 再分。Gini系数继续降低。';}
    else if(splits.length===2){splits.push({axis:'x',val:160});info.textContent='第3次分裂：X₂≤145 的区域按 X₁≤160 细分为纯区域。';}
    else{regions=true;info.textContent='✅ 所有叶节点达到纯(仅含一类)。共 3 次分裂·4个叶节点。这就是决策树的递归二分过程。';}
    draw();
  }

  function draw(){
    const r=Viz.ctx('dt-canvas');if(!r)return;const{ctx,w,h}=r;
    const mx=40,my=30;

    // 画分裂线
    let splitDesc='';
    splits.forEach((s,i)=>{
      ctx.strokeStyle='#e8934a';ctx.lineWidth=2.5;ctx.setLineDash([6,3]);
      ctx.beginPath();
      if(s.axis==='x'){const px=mx+(s.val-30)/400*(w-80);ctx.moveTo(px,my);ctx.lineTo(px,h-my);splitDesc+=`X₁≤${s.val} `;}
      else{const py=my+(s.val-30)/300*(h-80);ctx.moveTo(mx,py);ctx.lineTo(w-mx,py);splitDesc+=`X₂≤${s.val} `;}
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 画点
    points.forEach(p=>{
      const px=mx+(p.x-30)/400*(w-80),py=my+(p.y-30)/300*(h-80);
      ctx.fillStyle=p.label===0?'#4a90a4':'#e8934a';ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=0.8;ctx.stroke();
    });

    Viz.axis(ctx,mx,h-my,w,h,{xLabel:'X₁',yLabel:'X₂'});
    Viz.text(ctx,'决策树分裂过程',w/2,16,{font:'bold 12px sans-serif',color:'#2c3e50'});
    Viz.text(ctx,splitDesc||'初始状态：36个样本混合',w/2,h-10,{font:'10px sans-serif',color:regions?'#5b9a7f':'var(--text-muted)'});
    if(regions)Viz.text(ctx,'✅ 纯叶节点：各类别分开',w/2,h-25,{font:'bold 11px sans-serif',color:'#5b9a7f'});

    // 图例
    Viz.text(ctx,'● A类  ● B类  --- 分裂线',w/2,38,{font:'10px sans-serif',color:'#2c3e50'});
  }

  document.getElementById('dt-split').addEventListener('click',addSplit);
  document.getElementById('dt-reset').addEventListener('click',resetViz);
  draw();window.addEventListener('resize',draw);
}
