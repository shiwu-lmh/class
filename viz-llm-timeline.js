/**
 * 可视化：LLM 发展时间线 —— 2017-2025 大模型演进
 * 交互：悬停查看模型详情、筛选开源/闭源
 */
function initLLMTimelineViz(containerId){
  const c=document.getElementById(containerId);if(!c)return;
  c.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:0.8rem">
      <canvas id="tl-canvas" style="width:480px;height:340px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc;cursor:pointer"></canvas>
      <div style="flex:1;min-width:170px">
        <div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">
          <div style="margin-bottom:0.4rem"><strong>🔍 悬停查看详情：</strong></div>
          <div id="tl-detail" style="background:#f8fdfe;padding:0.5rem;border-radius:8px;font-size:0.73rem;min-height:100px;line-height:1.5;margin-bottom:0.5rem">
            💡 将鼠标移到时间线上的模型圆点查看详情
          </div>
          <div style="display:flex;gap:0.3rem;margin-bottom:0.4rem">
            <button class="tl-filter-btn active" data-filter="all" style="flex:1;padding:0.2rem;font-size:0.68rem;border:2px solid #4a90a4;border-radius:10px;cursor:pointer;background:#4a90a4;color:#fff;font-weight:600">🌐 全部</button>
            <button class="tl-filter-btn" data-filter="open" style="flex:1;padding:0.2rem;font-size:0.68rem;border:2px solid #5b9a7f;border-radius:10px;cursor:pointer;background:#fff;color:#5b9a7f;font-weight:600">📖 开源</button>
            <button class="tl-filter-btn" data-filter="close" style="flex:1;padding:0.2rem;font-size:0.68rem;border:2px solid #e8934a;border-radius:10px;cursor:pointer;background:#fff;color:#e8934a;font-weight:600">🔒 闭源</button>
          </div>
          <div style="font-size:0.68rem;color:#6b7c8b">
            <div>🟦 编码器 · 🟠 解码器 · 🟣 MoE架构</div>
            <div>圆大小 ∝ 参数量</div>
          </div>
        </div>
      </div>
    </div>`;

  const canvas=document.getElementById('tl-canvas');
  let filter='all';
  let hoveredModel=null;
  // Store placed positions for hover detection
  let placedModels=[];

  const models=[
    {name:'Transformer',date:'2017-06',params:0.065,type:'enc-dec',open:true,desc:'Google · 编码器-解码器架构开创者 · "Attention Is All You Need"',layers:6,ctx:512},
    {name:'GPT-1',date:'2018-06',params:0.117,type:'dec',open:true,desc:'OpenAI · 解码器预训练范式 · 开创生成式预训练',layers:12,ctx:512},
    {name:'BERT-base',date:'2018-10',params:0.11,type:'enc',open:true,desc:'Google · 双向编码器 · MLM+NSP · 多项NLP任务SOTA',layers:12,ctx:512},
    {name:'GPT-2',date:'2019-02',params:1.5,type:'dec',open:true,desc:'OpenAI · Zero-shot能力显现 · 因"太危险"推迟发布',layers:48,ctx:1024},
    {name:'GPT-3',date:'2020-06',params:175,type:'dec',open:false,desc:'OpenAI · In-Context Learning · 规模法则验证 · 能力涌现',layers:96,ctx:2048},
    {name:'Llama 1',date:'2023-02',params:65,type:'dec',open:true,desc:'Meta · 开源大模型先锋 · 7B/13B/33B/65B多规格',layers:80,ctx:2048},
    {name:'GPT-4',date:'2023-03',params:1000,type:'dec',open:false,desc:'OpenAI · 多模态 · 强推理 · 128K上下文 · ~1T参数(推测)',layers:'?',ctx:128000},
    {name:'Llama 2',date:'2023-07',params:70,type:'dec',open:true,desc:'Meta · 2T tokens训练 · 7B/13B/70B · 开源生态爆发',layers:80,ctx:4096},
    {name:'Mistral 7B',date:'2023-09',params:7,type:'dec',open:true,desc:'Mistral AI · 7B小模型标杆 · 滑动窗口注意力 · 超越Llama2-13B',layers:32,ctx:8192},
    {name:'Llama 3',date:'2024-04',params:405,type:'dec',open:true,desc:'Meta · 15T tokens · 8B/70B/405B · 128K上下文 · 多语言',layers:126,ctx:128000},
    {name:'DeepSeek-V3',date:'2024-12',params:671,type:'moe',open:true,desc:'DeepSeek · MoE 37B激活 · 14.8T tokens · MLA · $6M训练成本',layers:'MoE',ctx:128000},
    {name:'DeepSeek-R1',date:'2025-01',params:671,type:'moe',open:true,desc:'DeepSeek · 推理模型 · 强化学习 · 思维链 · 数学/编程SOTA',layers:61,ctx:128000},
    {name:'Llama 4',date:'2025-04',params:400,type:'moe',open:true,desc:'Meta · MoE架构 · 30T tokens · Scout(10M ctx)/Maverick',layers:'MoE',ctx:10000000},
  ];

  function getModelPos(model){
    const [y,m]=model.date.split('-').map(Number);
    const months=(y-2017)*12+(m-6);
    const totalMonths=(2025-2017)*12+6;
    return months/totalMonths;
  }

  function getRadius(params){
    return 6+Math.log2(params+0.1)*4.5;
  }

  function draw(){
    const r=Viz.ctx('tl-canvas');if(!r)return;const{ctx,w,h}=r;
    ctx.clearRect(0,0,w,h);
    placedModels=[];

    Viz.text(ctx,'大语言模型发展时间线 (2017-2025)',w/2,16,{font:'bold 13px sans-serif',color:'#2c3e50'});

    const axisY=200,axisX1=60,axisX2=w-30;
    ctx.strokeStyle='#cbd5e1';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(axisX1,axisY);ctx.lineTo(axisX2,axisY);ctx.stroke();

    for(let year=2017;year<=2025;year++){
      const pos=getModelPos({date:`${year}-06`});
      const x=axisX1+pos*(axisX2-axisX1);
      ctx.strokeStyle='#94a3b3';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x,axisY-10);ctx.lineTo(x,axisY+10);ctx.stroke();
      ctx.fillStyle='#475569';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(year,x,axisY+24);
    }

    const events=[
      {date:'2017-06',label:'Transformer',y:axisY-50},
      {date:'2022-03',label:'ChatGPT',y:axisY-50},
      {date:'2025-01',label:'推理模型',y:axisY-50},
    ];
    events.forEach(ev=>{
      const pos=getModelPos(ev);
      const x=axisX1+pos*(axisX2-axisX1);
      ctx.strokeStyle='rgba(148,163,179,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(x,axisY-30);ctx.lineTo(x,40);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#e8934a';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(ev.label,x,ev.y-8);
    });

    const placed=[];
    const filteredModels=models.filter(m=>{
      if(filter==='open')return m.open;
      if(filter==='close')return !m.open;
      return true;
    });

    filteredModels.forEach(model=>{
      const pos=getModelPos(model);
      const x=axisX1+pos*(axisX2-axisX1);
      const rad=getRadius(model.params);
      let y=axisY;
      const offset=25;
      const placedNear=placed.filter(p=>Math.abs(p.x-x)<rad*3);
      if(placedNear.length>0){
        let bestY=axisY;
        for(let attempt=0;attempt<20;attempt++){
          const candY=axisY+(attempt%2===0?1:-1)*offset*(1+Math.floor(attempt/2));
          if(!placedNear.some(p=>Math.abs(p.y-candY)<offset*0.8)){bestY=candY;break;}
        }
        y=bestY;
      }
      placed.push({x,y});

      // Store for hover detection
      placedModels.push({model,x,y,r:rad});

      const isHovered=hoveredModel===model;
      const typeColor=model.type==='enc'?'#4a90a4':model.type==='dec'?'#e8934a':'#8e44ad';

      if(isHovered){
        ctx.fillStyle='rgba(232,147,74,0.15)';
        ctx.beginPath();ctx.arc(x,y,rad+6,0,Math.PI*2);ctx.fill();
      }

      ctx.fillStyle=typeColor;
      ctx.globalAlpha=isHovered?1:0.85;
      ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
      ctx.strokeStyle='#fff';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.stroke();

      if(model.open){
        ctx.strokeStyle='#5b9a7f';ctx.lineWidth=2;ctx.setLineDash([2,2]);
        ctx.beginPath();ctx.arc(x,y,rad+2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      }

      const importantModels=['Transformer','GPT-3','GPT-4','Llama 1','Llama 3','DeepSeek-V3','DeepSeek-R1'];
      if(importantModels.includes(model.name)||isHovered){
        const labelY=y>axisY?y+rad+14:y-rad-10;
        ctx.fillStyle='#2c3e50';ctx.font=`${isHovered?'bold ':''}10px sans-serif`;ctx.textAlign='center';
        ctx.fillText(model.name,x,labelY);
        if(isHovered){
          ctx.fillStyle='#64748b';ctx.font='9px sans-serif';
          ctx.fillText(`${model.params>1?model.params+'B':(model.params*1000).toFixed(0)+'M'} params`,x,labelY+14);
        }
      }
    });

    const ly=h-30;
    [['🟦 编码器','#4a90a4'],['🟠 解码器','#e8934a'],['🟣 MoE','#8e44ad'],['-- 开源','#5b9a7f'],['● 闭源','#e8934a']].forEach((item,i)=>{
      const lx=30+i*105;
      ctx.fillStyle=item[1];ctx.font='bold 8px sans-serif';ctx.textAlign='left';
      ctx.fillText(item[0],lx,ly);
    });
    ctx.fillText('圆大小∝参数量',480,ly);
  }

  canvas.addEventListener('mousemove',function(e){
    const rect=canvas.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    let found=null;
    // Use placedModels from the last draw for accurate hit detection
    for(let i=placedModels.length-1;i>=0;i--){
      const pm=placedModels[i];
      const dist=Math.sqrt((mx-pm.x)**2+(my-pm.y)**2);
      if(dist<pm.r+8){found=pm.model;break;}
    }
    if(found!==hoveredModel){
      hoveredModel=found;
      if(found){
        document.getElementById('tl-detail').innerHTML=`
          <strong style="font-size:0.85rem">${found.name}</strong>
          <span style="font-size:0.65rem;color:#94a3b3">${found.date}</span><br>
          <span>参数量: <strong>${found.params>1?found.params+'B':(found.params*1000).toFixed(0)+'M'}</strong></span> ·
          <span>层数: <strong>${found.layers}</strong></span> ·
          <span>上下文: <strong>${found.ctx>=1000?(found.ctx/1000)+'K':found.ctx}</strong></span><br>
          <span style="color:${found.open?'#5b9a7f':'#e8934a'}">${found.open?'📖 开源':'🔒 闭源'}</span> ·
          <span style="color:${found.type==='enc'?'#4a90a4':found.type==='dec'?'#e8934a':'#8e44ad'}">${found.type==='enc'?'编码器':found.type==='dec'?'解码器':'MoE混合专家'}</span><br>
          <span style="color:#6b7c8b">${found.desc}</span>`;
      }else{
        document.getElementById('tl-detail').innerHTML='💡 将鼠标移到时间线上的模型圆点查看详情';
      }
      draw();
    }
  });

  // Use event delegation for filter buttons (more robust)
  c.querySelectorAll('.tl-filter-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      c.querySelectorAll('.tl-filter-btn').forEach(b=>{b.classList.remove('active');b.style.background='#fff';b.style.color=b.style.borderColor;});
      this.classList.add('active');filter=this.dataset.filter;
      this.style.background=filter==='all'?'#4a90a4':filter==='open'?'#5b9a7f':'#e8934a';
      this.style.color='#fff';
      hoveredModel=null;
      draw();
    });
  });

  draw();window.addEventListener('resize',draw);
}
