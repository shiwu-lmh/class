/**
 * 可视化：RAG 检索增强生成 —— 动画展示从查询到答案的完整流程
 */
function initRAGFlowViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="rag-canvas" style="width:480px;height:380px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc"></canvas>
      <div style="flex:1;min-width:180px">
        <div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.5rem"><strong>🔍 输入查询问题：</strong></div>
          <input type="text" id="rag-query" value="自注意力机制的作用是什么？" style="width:100%;padding:0.4rem 0.6rem;border:2px solid #4a90a4;border-radius:6px;font-size:0.8rem;margin-bottom:0.5rem">
          <button id="rag-animate" style="width:100%;padding:0.4rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;margin-bottom:0.5rem">▶ 播放RAG流程动画</button>
          <div id="rag-step" style="background:#f8fdfe;padding:0.5rem;border-radius:8px;font-size:0.75rem;min-height:120px;line-height:1.5">
            💡 点击播放按钮查看RAG的完整工作流程
          </div>
          <div id="rag-stats" style="margin-top:0.4rem;font-size:0.7rem;color:var(--text-light)"></div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('rag-canvas');
  let animPhase=-1,animTimer=null;
  const phases=[
    {title:'① 用户提问',desc:'用户提出一个问题。<br>问题被编码为向量。',highlights:['query']},
    {title:'② 向量检索',desc:'在向量数据库中检索<br>语义最相似的文档片段。<br>使用余弦相似度计算。',highlights:['retrieve','db']},
    {title:'③ Top-K筛选',desc:'从97篇文档中选出<br>最相关的2-3篇。<br>如：文档02、97、99',highlights:['topk']},
    {title:'④ 拼接上下文',desc:'将检索到的文档与<br>用户问题拼接成完整Prompt。<br>格式："根据以下文章回答问题"',highlights:['prompt']},
    {title:'⑤ LLM生成答案',desc:'LLM阅读检索到的文档，<br>基于文档内容生成答案。<br>有据可查，减少幻觉。',highlights:['llm','answer']},
  ];

  function draw(){
    const r=Viz.ctx('rag-canvas');if(!r)return;const{ctx,w,h}=r;
    ctx.clearRect(0,0,w,h);

    Viz.text(ctx,'RAG — 检索增强生成 (Retrieval Augmented Generation)',w/2,16,{font:'bold 12px sans-serif',color:'#2c3e50'});

    const phase=animPhase;
    const active=phase>=0;
    const activeStep=phase;

    // 组件位置
    const cx=w/2;
    // 用户/问题 (左上)
    const qx=40,qy=50,qw=160,qh=40;
    const active_q=activeStep>=0;
    ctx.fillStyle=active_q?'#4a90a4':'#f1f5f9';ctx.strokeStyle=active_q?'#4a90a4':'#cbd5e1';ctx.lineWidth=active_q?2.5:1.5;
    Viz.roundRect(ctx,qx,qy,qw,qh,8);ctx.fill();ctx.stroke();
    ctx.fillStyle=active_q?'#fff':'#475569';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('❓ 用户问题',qx+qw/2,qy+16);
    ctx.fillStyle=active_q?'rgba(255,255,255,0.8)':'#94a3b3';ctx.font='9px sans-serif';
    const qtext=document.getElementById('rag-query').value.substring(0,18);
    ctx.fillText(`"${qtext}${qtext.length>=18?'…':''}"`,qx+qw/2,qy+32);

    // 向量化 (右上)
    const embx=380,emby=50,embw=130,embh=40;
    const active_emb=activeStep>=0;
    ctx.fillStyle=active_emb?'#e8934a':'#f1f5f9';ctx.strokeStyle=active_emb?'#e8934a':'#cbd5e1';ctx.lineWidth=active_emb?2.5:1.5;
    Viz.roundRect(ctx,embx,emby,embw,embh,8);ctx.fill();ctx.stroke();
    ctx.fillStyle=active_emb?'#fff':'#475569';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText('🔢 向量编码',embx+embw/2,emby+16);
    ctx.fillStyle=active_emb?'rgba(255,255,255,0.8)':'#94a3b3';ctx.font='8px sans-serif';
    ctx.fillText('[0.23, 0.67, -0.41, …]',embx+embw/2,emby+32);

    // 向量数据库 (中间右侧)
    const dbx=380,dby=130,dbw=130,dbh=80;
    const active_db=activeStep>=1;
    ctx.fillStyle=active_db?'#5b9a7f':'#f1f5f9';ctx.strokeStyle=active_db?'#5b9a7f':'#cbd5e1';ctx.lineWidth=active_db?2.5:1.5;
    Viz.roundRect(ctx,dbx,dby,dbw,dbh,8);ctx.fill();ctx.stroke();
    ctx.fillStyle=active_db?'#fff':'#475569';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
    ctx.fillText('🗄️ 向量数据库',dbx+dbw/2,dby+18);
    ctx.fillStyle=active_db?'rgba(255,255,255,0.7)':'#94a3b3';ctx.font='7px sans-serif';
    if(active_db){
      ctx.fillText('Doc01: 0.12  Doc02: 0.89 ✓',dbx+dbw/2,dby+34);
      ctx.fillText('Doc03: 0.23  Doc97: 0.91 ✓',dbx+dbw/2,dby+50);
      ctx.fillText('Doc99: 0.87 ✓  …',dbx+dbw/2,dby+66);
    }else{
      for(let j=0;j<4;j++)ctx.fillText(`Doc${(j+1).toString().padStart(2,'0')}: ----`,dbx+dbw/2,dby+34+j*14);
    }

    // 文档 (左侧)
    const docx=40,docy=160;
    const active_topk=activeStep>=2;
    for(let i=0;i<5;i++){
      const dy=docy+i*32,selected=i>=1&&i<=3&&active_topk;
      ctx.fillStyle=selected?'rgba(91,154,127,0.15)':'#f8fafc';
      ctx.strokeStyle=selected?'#5b9a7f':'#e2e8f0';ctx.lineWidth=selected?2:0.5;
      Viz.roundRect(ctx,docx,dy,150,26,4);ctx.fill();ctx.stroke();
      ctx.fillStyle='#475569';ctx.font='8px sans-serif';ctx.textAlign='left';
      const docNums=['01','02','97','99','42'];
      const simScores=[0.12,0.89,0.91,0.87,0.23];
      if(active_topk&&selected)ctx.fillText(`📄 Doc${docNums[i]} ★ 语义相似: ${simScores[i].toFixed(2)}`,docx+8,dy+17);
      else ctx.fillText(`📄 Doc${docNums[i]}`,docx+8,dy+17);
      if(active_topk&&selected){
        ctx.fillStyle='#5b9a7f';ctx.font='bold 8px sans-serif';ctx.textAlign='right';
        ctx.fillText('→ 选中',docx+140,dy+17);
      }
    }

    // Prompt拼接 (左下)
    const promptx=40,prompty=340,promptw=240,prompth=30;
    const active_prompt=activeStep>=3;
    ctx.fillStyle=active_prompt?'#8e44ad':'#f1f5f9';ctx.strokeStyle=active_prompt?'#8e44ad':'#cbd5e1';ctx.lineWidth=active_prompt?2.5:1.5;
    Viz.roundRect(ctx,promptx,prompty,promptw,prompth,6);ctx.fill();ctx.stroke();
    ctx.fillStyle=active_prompt?'#fff':'#475569';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText('📋 拼接 Prompt = 问题 + 检索文档',promptx+promptw/2,prompty+20);

    // LLM (右下)
    const llmx=340,llmy=240,llmw=160,llmh=60;
    const Active_llm=activeStep>=4;
    ctx.fillStyle=Active_llm?'#c0392b':'#f1f5f9';ctx.strokeStyle=Active_llm?'#c0392b':'#cbd5e1';ctx.lineWidth=Active_llm?2.5:1.5;
    Viz.roundRect(ctx,llmx,llmy,llmw,llmh,10);ctx.fill();ctx.stroke();
    ctx.fillStyle=Active_llm?'#fff':'#475569';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
    ctx.fillText('🤖 LLM',llmx+llmw/2,llmy+24);
    ctx.fillStyle=Active_llm?'rgba(255,255,255,0.8)':'#94a3b3';ctx.font='9px sans-serif';
    ctx.fillText('阅读文档 → 生成答案',llmx+llmw/2,llmy+44);

    // 答案
    if(activeStep>=4){
      const ansx=340,ansy=320,answ=160,ansh=40;
      ctx.fillStyle='#e8934a';ctx.strokeStyle='#c0392b';ctx.lineWidth=2;
      Viz.roundRect(ctx,ansx,ansy,answ,ansh,8);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText('✅ 答案',ansx+answ/2,ansy+16);
      ctx.fillText('利用语境信息更新词义',ansx+answ/2,ansy+32);
    }

    // 连接箭头
    ctx.setLineDash([3,3]);
    // 问题→向量化
    const arrowActive0=activeStep>=0;
    ctx.strokeStyle=arrowActive0?'#4a90a4':'rgba(148,163,179,0.3)';ctx.lineWidth=arrowActive0?2:1;
    ctx.beginPath();ctx.moveTo(qx+qw,qy+qh/2);ctx.lineTo(embx,emby+embh/2);ctx.stroke();
    // 向量化→数据库
    const arrowActive1=activeStep>=1;
    ctx.strokeStyle=arrowActive1?'#e8934a':'rgba(148,163,179,0.3)';ctx.lineWidth=arrowActive1?2:1;
    ctx.beginPath();ctx.moveTo(embx+embw/2,emby+embh);ctx.lineTo(dbx+dbw/2,dby);ctx.stroke();
    // 数据库→文档（检索）
    const arrowActive2=activeStep>=1;
    if(arrowActive2){
      ctx.strokeStyle='#5b9a7f';ctx.lineWidth=2;ctx.setLineDash([5,3]);
      ctx.beginPath();ctx.moveTo(dbx,dby+dbh/2);ctx.lineTo(docx+155,docy+30);ctx.stroke();
    }
    // 文档→Prompt
    const arrowActive3=activeStep>=2;
    ctx.strokeStyle=arrowActive3?'#5b9a7f':'rgba(148,163,179,0.3)';ctx.lineWidth=arrowActive3?2:1;
    ctx.beginPath();ctx.moveTo(docx+75,docy+160);ctx.lineTo(promptx+promptw/2,prompty);ctx.stroke();
    // Prompt→LLM
    const arrowActive4=activeStep>=3;
    ctx.strokeStyle=arrowActive4?'#8e44ad':'rgba(148,163,179,0.3)';ctx.lineWidth=arrowActive4?2:1;
    ctx.beginPath();ctx.moveTo(promptx+promptw,prompty+prompth/2);ctx.lineTo(llmx,llmy+llmh/2);ctx.stroke();
    ctx.setLineDash([]);

    // 步骤指示器
    if(phase>=0){
      const p=phases[Math.min(phase,phases.length-1)];
      document.getElementById('rag-step').innerHTML=`<strong>${p.title}</strong><br>${p.desc}`;
    }
  }

  function startAnimation(){
    if(animTimer){clearInterval(animTimer);animPhase=-1;}
    animPhase=0;draw();
    let i=0;
    animTimer=setInterval(()=>{
      i++;
      if(i>=phases.length){clearInterval(animTimer);animPhase=phases.length-1;animTimer=null;
        document.getElementById('rag-step').innerHTML='✅ <strong>RAG流程完成！</strong><br>基于检索到的文档，LLM生成了有据可查的答案。整个过程将<strong>外部知识</strong>无缝融入LLM的生成过程。';
        document.getElementById('rag-stats').innerHTML='🔑 关键组件：向量数据库 · Embedding模型 · 相似度检索 · Prompt模板 · LLM';
        draw();return;
      }
      animPhase=i;draw();
    },800);
  }

  document.getElementById('rag-animate').addEventListener('click',startAnimation);
  document.getElementById('rag-query').addEventListener('input',()=>{if(animPhase<0)draw();});

  draw();window.addEventListener('resize',draw);
}
