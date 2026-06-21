/**
 * 可视化：自注意力机制 —— 输入句子，观察Q/K/V计算与注意力权重
 * 核心交互：修改句子 → 点击词语 → 观察该词对所有词的注意力分布
 */
function initSelfAttentionViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="sa-canvas" style="width:480px;height:380px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc;cursor:pointer"></canvas>
      <div style="flex:1;min-width:200px">
        <div style="font-size:0.8rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>📝 输入句子：</strong></div>
          <input type="text" id="sa-sentence" value="这家的拉面太棒了" style="width:100%;padding:0.4rem 0.6rem;border:2px solid #4a90a4;border-radius:6px;font-size:0.85rem;margin-bottom:0.5rem">
          <div style="display:flex;gap:0.3rem;margin-bottom:0.6rem">
            <button id="sa-btn1" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #e8934a;border-radius:12px;cursor:pointer;background:#fff8f0;font-weight:600">🍜 拉面评论</button>
            <button id="sa-btn2" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #4a90a4;border-radius:12px;cursor:pointer;background:#f0f8fc;font-weight:600">🍎 苹果公司</button>
            <button id="sa-btn3" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #5b9a7f;border-radius:12px;cursor:pointer;background:#f0fcf6;font-weight:600">🏛️ 故宫旅游</button>
          </div>
          <div style="margin-bottom:0.4rem"><strong>🔍 当前查询词：</strong><span id="sa-query-word" style="color:#e8934a;font-weight:700">拉面</span></div>
          <div style="margin-bottom:0.3rem;font-size:0.72rem;color:var(--text-light)">💡 点击画布上的词语切换查询</div>
          <div id="sa-formula" style="background:#f8fdfe;padding:0.5rem;border-radius:6px;font-size:0.75rem;margin-bottom:0.4rem;font-family:monospace;min-height:40px"></div>
          <div id="sa-info" style="font-size:0.72rem;color:var(--text-light);line-height:1.4;min-height:48px"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('sa-canvas');
  let queryIdx=1; // 默认查询"拉面"（第2个词）
  let currentTokens=[];

  // 预定义句子的模拟词向量 (3维，便于可视化)
  function getEmbeddings(tokens){
    const baseSeed={
      '这':[0.1,0.0,0.0],'家':[0.0,0.1,0.0],'的':[0.0,0.0,0.1],
      '拉':[0.4,0.3,0.0],'面':[0.5,0.2,0.1],
      '太':[0.0,0.0,0.5],'棒':[0.0,0.1,0.6],'了':[0.0,0.0,0.4],
      '苹':[0.4,0.3,0.0],'果':[0.5,0.2,0.1],
      '公':[0.3,0.1,0.3],'司':[0.2,0.1,0.4],
      '发':[0.3,0.0,0.3],'布':[0.2,0.1,0.4],
      '新':[0.3,0.2,0.2],'产':[0.4,0.1,0.2],'品':[0.5,0.1,0.1],
      '故':[0.6,0.1,0.0],'宫':[0.7,0.0,0.1],
      '旅':[0.2,0.5,0.1],'游':[0.3,0.4,0.1],
      '攻':[0.3,0.2,0.3],'略':[0.2,0.1,0.4],
    };
    // 用字符的hash生成伪向量
    const embs=[];
    for(let i=0;i<tokens.length;i++){
      let hash=0;for(let j=0;j<tokens[i].length;j++)hash=((hash<<5)-hash)+tokens[i].charCodeAt(j);
      const h=Math.abs(hash%360);
      embs.push([Math.cos(h*Math.PI/180)*0.5+0.5,Math.sin(h*Math.PI/180)*0.5+0.5,Math.abs(Math.sin(h*1.7))*0.5+0.3]);
    }
    return embs;
  }

  // 模拟Q/K/V投影（简化为3维→3维）
  function projection(emb,type){
    // Q: "在找什么" / K: "我是什么" / V: "我说了什么"
    const shift={q:0.1,k:0.3,v:0.5};
    return [emb[0]*0.8+shift[type],emb[1]*0.7,emb[2]*0.9];
  }

  function draw(){
    const r=Viz.ctx('sa-canvas');if(!r)return;const{ctx,w,h}=r;
    ctx.clearRect(0,0,w,h);

    const sentence=document.getElementById('sa-sentence').value.trim();
    if(!sentence){Viz.text(ctx,'请输入句子',w/2,h/2,{font:'14px sans-serif',color:'#94a3b3'});return;}
    // 简单分词：按字分
    currentTokens=[...sentence].filter(c=>c.trim());
    if(currentTokens.length===0)return;
    if(queryIdx>=currentTokens.length)queryIdx=currentTokens.length-1;
    document.getElementById('sa-query-word').textContent=currentTokens[queryIdx];

    const embs=getEmbeddings(currentTokens);
    const Qs=embs.map(e=>projection(e,'q'));
    const Ks=embs.map(e=>projection(e,'k'));
    const Vs=embs.map(e=>projection(e,'v'));

    // 计算注意力分数（当前query对所有keys）
    const scores=Ks.map(k=>Qs[queryIdx][0]*k[0]+Qs[queryIdx][1]*k[1]+Qs[queryIdx][2]*k[2]);
    const scaledScores=scores.map(s=>s/Math.sqrt(3));
    const maxScore=Math.max(...scaledScores);
    const exps=scaledScores.map(s=>Math.exp(s-maxScore));
    const sumExp=exps.reduce((a,b)=>a+b,0);
    const weights=exps.map(e=>e/sumExp);
    // 新向量
    const newV=[0,0,0];
    for(let i=0;i<currentTokens.length;i++){
      for(let d=0;d<3;d++)newV[d]+=weights[i]*Vs[i][d];
    }

    // ── 绘制布局 ──
    const tCount=currentTokens.length;
    const totalW=Math.min(520,tCount*90);
    const startX=(w-totalW)/2+30;
    const tokenW=Math.min(80,totalW/tCount-6);
    const topY=45;

    // 第1行：Token Embeddings (灰色)
    Viz.text(ctx,'① Token Embeddings → Q/K/V 投影',12,topY-8,{font:'bold 11px sans-serif',color:'#2c3e50',align:'left'});
    for(let i=0;i<tCount;i++){
      const x=startX+i*(tokenW+6);
      ctx.fillStyle='#f1f5f9';ctx.strokeStyle='#cbd5e1';ctx.lineWidth=1;
      Viz.roundRect(ctx,x,topY,tokenW,28,5);ctx.fill();ctx.stroke();
      ctx.fillStyle='#475569';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(currentTokens[i],x+tokenW/2,topY+19);
      // label
      ctx.fillStyle='#94a3b3';ctx.font='8px sans-serif';
      ctx.fillText(`[${embs[i].map(v=>v.toFixed(1)).join(',')}]`,x+tokenW/2,topY+40);
    }

    // 第2行：Q/K/V
    const qy=topY+58,ky=topY+78,vy=topY+98;
    Viz.text(ctx,'Q (Query)',8,qy+10,{font:'bold 9px sans-serif',color:'#4a90a4',align:'left'});
    Viz.text(ctx,'K (Key)',8,ky+10,{font:'bold 9px sans-serif',color:'#e8934a',align:'left'});
    Viz.text(ctx,'V (Value)',8,vy+10,{font:'bold 9px sans-serif',color:'#5b9a7f',align:'left'});
    for(let i=0;i<tCount;i++){
      const x=startX+i*(tokenW+6);
      // Q row
      ctx.fillStyle='rgba(74,144,164,0.12)';ctx.fillRect(x,qy,tokenW,14);
      ctx.fillStyle='#4a90a4';ctx.font='8px sans-serif';ctx.textAlign='center';
      ctx.fillText(`[${Qs[i].map(v=>v.toFixed(1))}]`,x+tokenW/2,qy+10);
      // K row
      ctx.fillStyle='rgba(232,147,74,0.12)';ctx.fillRect(x,ky,tokenW,14);
      ctx.fillStyle='#e8934a';ctx.textAlign='center';
      ctx.fillText(`[${Ks[i].map(v=>v.toFixed(1))}]`,x+tokenW/2,ky+10);
      // V row
      ctx.fillStyle='rgba(91,154,127,0.12)';ctx.fillRect(x,vy,tokenW,14);
      ctx.fillStyle='#5b9a7f';ctx.textAlign='center';
      ctx.fillText(`[${Vs[i].map(v=>v.toFixed(1))}]`,x+tokenW/2,vy+10);
    }

    // 第3步：注意力权重
    const attY=vy+30;
    Viz.text(ctx,`② Score = Q₍${currentTokens[queryIdx]}₎ · Kᵢ / √dₖ`,12,attY+2,{font:'bold 11px sans-serif',color:'#2c3e50',align:'left'});

    const maxBarW=tokenW,barH=40;
    for(let i=0;i<tCount;i++){
      const x=startX+i*(tokenW+6),bh=weights[i]*barH;
      // 背景条
      ctx.fillStyle='#f1f5f9';ctx.fillRect(x,attY+10,tokenW,barH);
      // 填充条
      const intensity=Math.floor(255-weights[i]*155);
      ctx.fillStyle=`rgb(${74+Math.floor(weights[i]*158)},${144-Math.floor(weights[i]*110)},${164-Math.floor(weights[i]*100)})`;
      ctx.fillRect(x,attY+10+barH-bh,tokenW,bh);
      // 边框
      ctx.strokeStyle='#cbd5e1';ctx.lineWidth=0.5;ctx.strokeRect(x,attY+10,tokenW,barH);
      // 高亮当前查询词
      if(i===queryIdx){
        ctx.strokeStyle='#e8934a';ctx.lineWidth=2;ctx.setLineDash([3,2]);
        ctx.strokeRect(x-1,attY+9,tokenW+2,barH+2);ctx.setLineDash([]);
      }
      // 权重数字
      ctx.fillStyle=weights[i]>0.5?'#fff':'#2c3e50';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText((weights[i]*100).toFixed(1)+'%',x+tokenW/2,attY+22+barH/2);
      // token label
      ctx.fillStyle='#475569';ctx.font='9px sans-serif';
      ctx.fillText(currentTokens[i],x+tokenW/2,attY+10+barH+14);
      // Score 数字
      ctx.fillStyle='#94a3b3';ctx.font='8px sans-serif';
      ctx.fillText(`S=${scores[i].toFixed(2)}`,x+tokenW/2,attY+10+barH+26);
    }

    // 第4步：加权输出
    const outY=attY+barH+50;
    Viz.text(ctx,`③ 新向量 = Σ wᵢ · Vᵢ → 上下文感知的"${currentTokens[queryIdx]}"`,12,outY,{font:'bold 11px sans-serif',color:'#2c3e50',align:'left'});
    // 显示新向量
    ctx.fillStyle='rgba(232,147,74,0.15)';ctx.strokeStyle='#e8934a';ctx.lineWidth=2;
    Viz.roundRect(ctx,startX,outY+10,Math.min(300,totalW+60),30,6);ctx.fill();ctx.stroke();
    ctx.fillStyle='#e8934a';ctx.font='bold 13px monospace';ctx.textAlign='center';
    ctx.fillText(`[${newV.map(v=>v.toFixed(2)).join(', ')}]`,startX+Math.min(150,totalW/2+30),outY+30);

    // 公式
    const formulaStr=`Softmax(Q·Kᵀ/√3)·V = Softmax([${scores.map(s=>s.toFixed(2)).join(', ')}])·V`;
    document.getElementById('sa-formula').innerHTML=`<span style="color:#4a90a4">Q·Kᵀ</span>=[${scores.map(s=>s.toFixed(2)).join(',')}] → <span style="color:#e8934a">Softmax</span>→[${weights.map(w=>w.toFixed(3)).join(',')}] → <span style="color:#5b9a7f">·V</span>`;

    // 信息说明
    const maxW=Math.max(...weights);
    const maxIdx=weights.indexOf(maxW);
    if(maxIdx===queryIdx){
      document.getElementById('sa-info').innerHTML=`✅ 最高注意力权重 (<strong>${(maxW*100).toFixed(1)}%</strong>) 指向自身"<strong>${currentTokens[queryIdx]}</strong>"——这是合理的，因为一个词通常与自身最相关。`;
    }else{
      document.getElementById('sa-info').innerHTML=`🔍 最高注意力权重 (<strong>${(maxW*100).toFixed(1)}%</strong>) 从"<strong>${currentTokens[queryIdx]}</strong>"指向"<strong>${currentTokens[maxIdx]}</strong>"——说明这个词在上下文中最关注"${currentTokens[maxIdx]}"。这就是<strong>利用语境更新词义</strong>的机制！`;
    }
  }

  // 点击Canvas切换查询词
  canvas.addEventListener('click',function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    const tCount=currentTokens.length;
    if(tCount===0)return;
    const totalW=Math.min(520,tCount*90);
    const startX=(rect.width-totalW)/2+30;
    const tokenW=Math.min(80,totalW/tCount-6);
    const topY=45;
    for(let i=0;i<tCount;i++){
      const x=startX+i*(tokenW+6);
      if(mx>=x&&mx<=x+tokenW&&my>=topY&&my<=topY+28){
        queryIdx=i;draw();return;
      }
    }
  });

  // 句子输入
  document.getElementById('sa-sentence').addEventListener('input',()=>{queryIdx=0;draw();});
  document.getElementById('sa-btn1').addEventListener('click',()=>{
    document.getElementById('sa-sentence').value='这家的拉面太棒了';queryIdx=1;draw();
  });
  document.getElementById('sa-btn2').addEventListener('click',()=>{
    document.getElementById('sa-sentence').value='苹果公司发布新产品';queryIdx=0;draw();
  });
  document.getElementById('sa-btn3').addEventListener('click',()=>{
    document.getElementById('sa-sentence').value='故宫旅游攻略很实用';queryIdx=0;draw();
  });

  draw();window.addEventListener('resize',draw);
}
