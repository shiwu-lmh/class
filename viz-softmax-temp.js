/**
 * 可视化：Softmax 温度 —— 调节温度 T 观察概率分布变化
 */
function initSoftmaxTempViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="st-canvas" style="width:440px;height:280px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="font-size:0.8rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.4rem"><strong>温度 T：</strong><span id="st-t-val" style="color:#e8934a;font-weight:700">1.0</span></div>
          <input type="range" id="st-temp" min="1" max="50" value="10" style="width:100%">
          <div style="display:flex;justify-content:space-between;font-size:0.7rem"><span>T→0(尖锐)</span><span>T=1(正常)</span><span>T=5(平滑)</span></div>
          <div style="margin-top:0.6rem;font-size:0.75rem">
            <div>Logits: [2.0, 1.0, 0.1]</div>
            <div style="margin-top:0.3rem">类别: 🐱猫 🐶狗 🐦鸟</div>
          </div>
          <div id="st-info" style="margin-top:0.5rem;background:#f8fdfe;padding:0.4rem 0.6rem;border-radius:6px;font-size:0.76rem;min-height:36px"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('st-canvas'),info=document.getElementById('st-info');
  const logits=[2.0,1.0,0.1],cats=['🐱猫','🐶狗','🐦鸟'],barColors=['#4a90a4','#e8934a','#5b9a7f'];

  function draw(){
    const r=Viz.ctx('st-canvas');if(!r)return;const{ctx,w,h}=r;
    const T=parseInt(document.getElementById('st-temp').value)/10;
    document.getElementById('st-t-val').textContent=T.toFixed(1);

    // Softmax with temperature
    const scaled=logits.map(v=>v/T);
    const maxS=Math.max(...scaled);
    const exps=scaled.map(v=>Math.exp(v-maxS)); // 减max防溢出
    const sum=exps.reduce((a,b)=>a+b,0);
    const probs=exps.map(v=>v/sum);

    const barW=70,gap=50,startX=(w-3*barW-2*gap)/2;
    const maxH=180;

    probs.forEach((val,i)=>{
      const x=startX+i*(barW+gap),bh=val*maxH;
      ctx.fillStyle=barColors[i];ctx.fillRect(x,250-bh,barW,bh);
      ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,250-bh,barW,bh);
      // 标签
      ctx.fillStyle='#2c3e50';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText(cats[i],x+barW/2,272);
      ctx.fillText((val*100).toFixed(1)+'%',x+barW/2,250-bh-8);
    });

    // 标注
    Viz.text(ctx,`Softmax(z/T)  T=${T.toFixed(1)}`,w/2,18,{font:'bold 12px sans-serif',color:'#2c3e50'});
    Viz.text(ctx,'Logits: [2.0, 1.0, 0.1]',w/2,36,{font:'10px sans-serif',color:'var(--text-muted)'});

    if(T<0.4)info.innerHTML=`T→0：分布<strong>极其尖锐</strong>，几乎只选最大 logit 的类别（≈argmax）。用于需要确定性输出的场景。`;
    else if(T>=0.8&&T<=1.2)info.innerHTML=`T≈1：标准 Softmax。概率分布反映 logits 的相对大小，训练时的默认设置。`;
    else info.innerHTML=`T>1：分布<strong>趋于均匀</strong>，各类别概率接近。温度越高，输出越"犹豫"。用于知识蒸馏中让学生模型学习软标签。`;
  }

  document.getElementById('st-temp').addEventListener('input',draw);
  draw();window.addEventListener('resize',draw);
}
