/**
 * 可视化：Transformer 架构 —— 编码器-解码器完整数据流
 * 点击组件查看详细说明，拖拽观察数据流动方向
 */
function initTransformerViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="tf-canvas" style="width:480px;height:460px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc;cursor:pointer"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.4rem"><strong>🎯 点击组件查看详情：</strong></div>
          <div id="tf-detail" style="background:#f8fdfe;padding:0.5rem;border-radius:8px;font-size:0.75rem;min-height:120px;line-height:1.5;margin-bottom:0.5rem">
            💡 点击左侧架构图中的任意组件查看详细说明
          </div>
          <div style="display:flex;gap:0.3rem;margin-bottom:0.4rem">
            <button id="tf-mode-enc" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #4a90a4;border-radius:12px;cursor:pointer;background:#4a90a4;color:#fff;font-weight:600">🔵 编码器详解</button>
            <button id="tf-mode-dec" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #e8934a;border-radius:12px;cursor:pointer;background:#fff;color:#e8934a;font-weight:600">🟠 解码器详解</button>
            <button id="tf-mode-full" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #5b9a7f;border-radius:12px;cursor:pointer;background:#fff;color:#5b9a7f;font-weight:600">🟢 完整架构</button>
          </div>
          <div id="tf-animation" style="margin-top:0.4rem">
            <button id="tf-animate-btn" style="width:100%;padding:0.4rem;background:#fff;color:#e8934a;border:2px solid #e8934a;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem">▶ 播放数据流动画</button>
          </div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('tf-canvas');
  let mode='full'; // 'enc', 'dec', 'full'
  let animPhase=-1; // -1=不播放, 0-7=动画阶段
  let animTimer=null;

  // 组件定义
  const components={
    inputEmb:{x:55,y:55,w:110,h:34,label:'Input Embedding',sub:'Token + Position',color:'#4a90a4',group:'enc'},
    encMha:{x:55,y:105,w:110,h:34,label:'Multi-Head Attention',sub:'自注意力 · 多头',color:'#5b9a7f',group:'enc'},
    encAddNorm1:{x:55,y:155,w:110,h:28,label:'Add & Norm',sub:'残差 + LayerNorm',color:'#94a3b0',group:'enc'},
    encFFN:{x:55,y:198,w:110,h:34,label:'Feed Forward',sub:'前馈网络 · 知识存储',color:'#5b9a7f',group:'enc'},
    encAddNorm2:{x:55,y:248,w:110,h:28,label:'Add & Norm',sub:'残差 + LayerNorm',color:'#94a3b0',group:'enc'},
    encOutput:{x:55,y:295,w:110,h:30,label:'Encoder Output',sub:'K,V 喂给解码器',color:'#4a90a4',group:'enc'},

    outputEmb:{x:420,y:55,w:110,h:34,label:'Output Embedding',sub:'右移一位的Token+Pos',color:'#e8934a',group:'dec'},
    decMha:{x:420,y:105,w:110,h:34,label:'Masked Multi-Head',sub:'因果掩码 · 只看上文',color:'#c0392b',group:'dec'},
    decAddNorm1:{x:420,y:155,w:110,h:28,label:'Add & Norm',sub:'残差 + LayerNorm',color:'#94a3b0',group:'dec'},
    decCrossAttn:{x:420,y:198,w:110,h:34,label:'Cross-Attention',sub:'Q来自解码 · K,V来自编码',color:'#8e44ad',group:'dec'},
    decAddNorm2:{x:420,y:248,w:110,h:28,label:'Add & Norm',sub:'残差 + LayerNorm',color:'#94a3b0',group:'dec'},
    decFFN:{x:420,y:292,w:110,h:34,label:'Feed Forward',sub:'前馈网络',color:'#5b9a7f',group:'dec'},
    decAddNorm3:{x:420,y:342,w:110,h:28,label:'Add & Norm',sub:'残差 + LayerNorm',color:'#94a3b0',group:'dec'},
    linear:{x:420,y:388,w:110,h:28,label:'Linear',sub:'d_model → vocab_size',color:'#e8934a',group:'dec'},
    softmaxOut:{x:420,y:430,w:110,h:30,label:'Softmax',sub:'输出概率分布',color:'#e8934a',group:'dec'},
  };

  const details={
    inputEmb:'<strong>Input Embedding</strong><br>输入 = Token Embedding + Position Encoding<br>• Token：词元向量（查表获得）<br>• Position：正弦余弦函数或可学习参数<br>将离散文字转为连续向量空间',
    encMha:'<strong>Multi-Head Attention（编码器）</strong><br>• 多个注意力头并行计算<br>• 每个头关注不同的语法/语义关系<br>• Q=K=V 来自同一输入（自注意力）<br>• d_model = d_v × n_head',
    encAddNorm1:'<strong>Add & Norm</strong><br>O = LayerNorm(X + Attention(X))<br>• Add（残差）：保证梯度流动<br>• Norm：稳定训练，加速收敛',
    encFFN:'<strong>Feed-Forward Network</strong><br>• 两层全连接：ReLU(W₁X+b₁)W₂+b₂<br>• 内部维度通常为d_model × 4<br>• 作用：加工信息、存储知识',
    encAddNorm2:'<strong>Add & Norm</strong><br>与第一次Add&Norm作用相同<br>整个编码器块可重复N次（通常6-12层）',
    encOutput:'<strong>Encoder Output</strong><br>• 最终输出喂给每层解码器的Cross-Attention<br>• 提供K和V（解码器提供Q）<br>• 编码器可以双向看到全部输入',
    outputEmb:'<strong>Output Embedding</strong><br>• 解码器输入 = 已生成的Token序列（右移一位）<br>• 训练时：真实标签右移（Teacher Forcing）<br>• 推理时：逐词生成，每次新词追加到输入',
    decMha:'<strong>Masked Multi-Head Attention</strong><br>• 因果掩码：对角线以上设为-∞<br>• 每个位置只能看到自己及之前的词<br>• 保证自回归生成（不能偷看未来）',
    decAddNorm1:'<strong>Add & Norm</strong><br>O = LayerNorm(X + MaskedAttention(X))',
    decCrossAttn:'<strong>Cross-Attention ⭐</strong><br>• Q来自解码器，K/V来自编码器输出<br>• 解码器从编码器提取相关信息<br>• 这是编码器和解码器的"桥梁"<br>• 每层解码器都有独立的Cross-Attention',
    decAddNorm2:'<strong>Add & Norm</strong><br>O = LayerNorm(X + CrossAttention(X))',
    decFFN:'<strong>Feed-Forward Network</strong><br>与编码器FFN结构相同<br>独立参数，每层不同',
    decAddNorm3:'<strong>Add & Norm</strong><br>最后一次残差+归一化',
    linear:'<strong>Linear 线性层</strong><br>• 将d_model维度映射到vocab_size维度<br>• 输出 = 每个词元的logit分数',
    softmaxOut:'<strong>Softmax</strong><br>• 将logits转为概率分布<br>• 最高概率的词元 = 模型预测的下一个词<br>• 训练时计算交叉熵损失',
  };

  function drawComponent(ctx,comp,highlight){
    const {x,y,w,h,label,sub,color,group}=comp;
    let alpha=1;
    if(mode==='enc'&&group==='dec')alpha=0.2;
    if(mode==='dec'&&group==='enc')alpha=0.2;

    ctx.globalAlpha=alpha;
    ctx.fillStyle=highlight?color:'#fff';
    ctx.strokeStyle=color;
    ctx.lineWidth=highlight?2.5:1.5;
    Viz.roundRect(ctx,x,y,w,h,6);ctx.fill();ctx.stroke();

    ctx.fillStyle=highlight?'#fff':color;
    ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText(label,x+w/2,y+14);
    ctx.fillStyle=highlight?'rgba(255,255,255,0.85)':color;
    ctx.globalAlpha=alpha*(highlight?0.85:0.6);
    ctx.font='8px sans-serif';
    ctx.fillText(sub,x+w/2,y+26);
    ctx.globalAlpha=1;
  }

  function drawArrow(ctx,x1,y1,x2,y2,color,active){
    ctx.strokeStyle=active?color:'rgba(148,163,179,0.4)';
    ctx.lineWidth=active?2.5:1.5;
    ctx.globalAlpha=active?1:(mode==='full'?0.5:0.15);
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    // 箭头
    if(active){
      const angle=Math.atan2(y2-y1,x2-x1);
      const ax=x2-8*Math.cos(angle),ay=y2-8*Math.sin(angle);
      ctx.fillStyle=color;
      ctx.beginPath();ctx.moveTo(ax,ay);
      ctx.lineTo(ax-6*Math.cos(angle-0.6),ay-6*Math.sin(angle-0.6));
      ctx.lineTo(ax-6*Math.cos(angle+0.6),ay-6*Math.sin(angle+0.6));
      ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  function draw(){
    const r=Viz.ctx('tf-canvas');if(!r)return;const{ctx,w,h}=r;
    ctx.clearRect(0,0,w,h);

    // 标题
    Viz.text(ctx,'Transformer 编码器-解码器架构',w/2,16,{font:'bold 13px sans-serif',color:'#2c3e50'});

    // 编码器区域背景
    ctx.fillStyle='rgba(74,144,164,0.04)';ctx.strokeStyle='rgba(74,144,164,0.2)';ctx.lineWidth=1;
    Viz.roundRect(ctx,20,35,180,310,10);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4a90a4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText('编码器 (Encoder) ×N',110,50);

    // 解码器区域背景
    ctx.fillStyle='rgba(232,147,74,0.04)';ctx.strokeStyle='rgba(232,147,74,0.2)';ctx.lineWidth=1;
    Viz.roundRect(ctx,380,35,185,445,10);ctx.fill();ctx.stroke();
    ctx.fillStyle='#e8934a';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText('解码器 (Decoder) ×N',472,50);

    // 绘制组件
    let highlighted=null;
    Object.entries(components).forEach(([key,comp])=>{
      let hl=false;
      if(animPhase>=0){
        const order=['inputEmb','encMha','encAddNorm1','encFFN','encAddNorm2','encOutput','decMha','decCrossAttn','decFFN','linear'];
        hl=order[animPhase]===key;
      }
      drawComponent(ctx,comp,hl);
    });

    // 编码器内部连接
    drawArrow(ctx,110,89,110,105,'#4a90a4',animPhase===0||animPhase===1);
    drawArrow(ctx,110,139,110,155,'#94a3b0',animPhase===1||animPhase===2);
    drawArrow(ctx,110,183,110,198,'#5b9a7f',animPhase===2||animPhase===3);
    drawArrow(ctx,110,232,110,248,'#94a3b0',animPhase===3||animPhase===4);
    drawArrow(ctx,110,276,110,295,'#4a90a4',animPhase===4||animPhase===5);
    // 残差连接
    ctx.setLineDash([4,3]);
    drawArrow(ctx,175,122,175,172,'#94a3b0',animPhase===2);
    drawArrow(ctx,175,215,175,265,'#94a3b0',animPhase===4);
    ctx.setLineDash([]);

    // 解码器内部连接
    drawArrow(ctx,475,89,475,105,'#e8934a',animPhase===5||animPhase===6);
    drawArrow(ctx,475,139,475,155,'#94a3b0',animPhase===6||animPhase===7);
    drawArrow(ctx,475,183,475,198,'#8e44ad',animPhase===7||animPhase===8);
    drawArrow(ctx,475,232,475,248,'#94a3b0',animPhase===8);
    drawArrow(ctx,475,282,475,292,'#5b9a7f',animPhase===8);
    drawArrow(ctx,475,326,475,342,'#94a3b0',animPhase===8);
    drawArrow(ctx,475,370,475,388,'#e8934a',animPhase===8);
    drawArrow(ctx,475,416,475,430,'#e8934a',animPhase===8||animPhase===9);

    // 编码器→解码器连接 (Cross-Attention)
    ctx.setLineDash([5,3]);
    drawArrow(ctx,165,310,420,215,'#8e44ad',animPhase===7);
    ctx.setLineDash([]);
    if(animPhase===7){
      ctx.fillStyle='#8e44ad';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText('K,V →',290,270);
    }

    // 图例
    ctx.fillStyle='#4a90a4';ctx.font='bold 8px sans-serif';ctx.textAlign='left';
    ctx.fillText('🔵 编码器: 双向注意力，理解输入',20,h-20);
    ctx.fillText('🟠 解码器: 单向(掩码)+Cross-Attn，逐词生成',240,h-20);
    ctx.fillText('🟣 Cross-Attn: 编码↔解码桥梁',480,h-20);
  }

  // 动画
  function startAnimation(){
    if(animTimer){clearInterval(animTimer);animPhase=-1;}
    animPhase=0;
    draw();
    const order=['inputEmb→Multi-Head','Multi-Head→Add&Norm','Add&Norm→FFN','FFN→Add&Norm→Output','编码器输出→','→解码器Masked MHA','→Cross-Attention(KV来自编码器)','→FFN','→Linear→Softmax','输出概率分布'];
    let i=0;
    document.getElementById('tf-detail').innerHTML=`🔄 动画播放中：<strong>${order[i]}</strong>`;
    animTimer=setInterval(()=>{
      i++;
      if(i>=10){clearInterval(animTimer);animPhase=-1;animTimer=null;document.getElementById('tf-detail').innerHTML='✅ 数据流完成！编码器理解输入 → 解码器逐词生成。';draw();return;}
      animPhase=i;
      draw();
      document.getElementById('tf-detail').innerHTML=`🔄 动画播放中：<strong>${order[i]}</strong>`;
    },600);
  }

  // 点击检测
  canvas.addEventListener('click',function(e){
    if(animPhase>=0)return; // 动画中不响应
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    let found=null;
    Object.entries(components).forEach(([key,comp])=>{
      if(mx>=comp.x&&mx<=comp.x+comp.w&&my>=comp.y&&my<=comp.y+comp.h)found=key;
    });
    if(found&&details[found]){
      document.getElementById('tf-detail').innerHTML=details[found];
      // 高亮
      draw();
    }
  });

  // 模式切换
  document.getElementById('tf-mode-enc').addEventListener('click',function(){
    mode='enc';
    this.style.background='#4a90a4';this.style.color='#fff';
    document.getElementById('tf-mode-dec').style.background='#fff';document.getElementById('tf-mode-dec').style.color='#e8934a';
    document.getElementById('tf-mode-full').style.background='#fff';document.getElementById('tf-mode-full').style.color='#5b9a7f';
    draw();
  });
  document.getElementById('tf-mode-dec').addEventListener('click',function(){
    mode='dec';
    this.style.background='#e8934a';this.style.color='#fff';
    document.getElementById('tf-mode-enc').style.background='#fff';document.getElementById('tf-mode-enc').style.color='#4a90a4';
    document.getElementById('tf-mode-full').style.background='#fff';document.getElementById('tf-mode-full').style.color='#5b9a7f';
    draw();
  });
  document.getElementById('tf-mode-full').addEventListener('click',function(){
    mode='full';
    this.style.background='#5b9a7f';this.style.color='#fff';
    document.getElementById('tf-mode-enc').style.background='#fff';document.getElementById('tf-mode-enc').style.color='#4a90a4';
    document.getElementById('tf-mode-dec').style.background='#fff';document.getElementById('tf-mode-dec').style.color='#e8934a';
    draw();
  });
  document.getElementById('tf-animate-btn').addEventListener('click',startAnimation);

  draw();window.addEventListener('resize',draw);
}
