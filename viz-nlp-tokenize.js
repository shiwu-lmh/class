/**
 * 可视化：jieba分词 — 三种模式对比（精确/全模式/搜索引擎）
 */
function initNLPTokenizeViz(containerId){
  var c=document.getElementById(containerId);if(!c)return;
  var texts=[
    "我爱北京天安门",
    "南京市长江大桥",
    "他来到了网易杭研大厦"
  ];
  var results={
    exact:[
      ['我','爱','北京','天安门'],
      ['南京市','长江大桥'],
      ['他','来到','了','网易','杭研','大厦']
    ],
    full:[
      ['我','爱','北京','天安','天安门'],
      ['南京','南京市','京市','市长','长江','长江大桥','大桥'],
      ['他','来到','了','网易','杭研','大厦']
    ],
    search:[
      ['我','爱','北京','天安','天安门'],
      ['南京','京市','南京市','市长','长江','大桥','长江大桥'],
      ['他','来到','了','网易','杭研','大厦']
    ]
  };
  var colors=['#e8934a','#4a90a4','#5b9a7f','#c060a0','#6b7c8b','#d4a840','#8470c0','#b06060'];
  var textIdx=0,mode='exact';

  c.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:0.8rem;align-items:flex-start">'+
    '<canvas id="tok-canvas" style="width:540px;height:220px;border:1px solid #e2ded6;border-radius:8px;background:#fafaf8"></canvas>'+
    '<div style="flex:1;min-width:200px">'+
      '<div style="margin-bottom:0.6rem;font-weight:700;font-size:0.9rem;color:#333">🔧 选择分词模式</div>'+
      '<div style="display:flex;flex-direction:column;gap:0.35rem;margin-bottom:0.7rem">'+
        '<label style="cursor:pointer;padding:0.4rem 0.6rem;border-radius:6px;background:#f0ebe0;font-size:0.82rem;display:flex;align-items:center;gap:0.4rem">'+
          '<input type="radio" name="tok-mode" value="exact" checked> <b>精确模式</b> (cut_all=False) — 最精确</label>'+
        '<label style="cursor:pointer;padding:0.4rem 0.6rem;border-radius:6px;background:#f0ebe0;font-size:0.82rem;display:flex;align-items:center;gap:0.4rem">'+
          '<input type="radio" name="tok-mode" value="full"> <b>全模式</b> (cut_all=True) — 速度最快</label>'+
        '<label style="cursor:pointer;padding:0.4rem 0.6rem;border-radius:6px;background:#f0ebe0;font-size:0.82rem;display:flex;align-items:center;gap:0.4rem">'+
          '<input type="radio" name="tok-mode" value="search"> <b>搜索引擎模式</b> — 适合搜索</label>'+
      '</div>'+
      '<button id="tok-next" style="padding:0.4rem 0.9rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.82rem">🔄 换一句</button>'+
      '<div id="tok-info" style="margin-top:0.5rem;font-size:0.76rem;color:#6b7c8b;line-height:1.6;min-height:50px"></div>'+
    '</div></div>';

  var info=document.getElementById('tok-info');

  function draw(){
    var r=Viz.ctx('tok-canvas');if(!r)return;var ctx=r.ctx,w=r.w,h=r.h;
    var words=results[mode][textIdx];
    var modeNames={exact:'精确模式 (jieba.lcut)',full:'全模式 (cut_all=True)',search:'搜索引擎模式 (cut_for_search)'};

    // Title
    Viz.text(ctx,modeNames[mode],w/2,22,{font:'bold 12px sans-serif',color:'#4a90a4'});
    // Original text
    Viz.text(ctx,'原文：'+texts[textIdx],20,48,{font:'13px sans-serif',color:'#333'});

    // Box
    var boxY=65,boxX=20,boxW=w-40,boxH=68;
    ctx.fillStyle='#f5f2eb';ctx.strokeStyle='#e2ded6';ctx.lineWidth=1;
    Viz.roundRect(ctx,boxX,boxY,boxW,boxH,8);ctx.fill();ctx.stroke();

    // Draw tokens
    var totalW=0;
    words.forEach(function(wd){totalW+=ctx.measureText(wd).width+24;});
    var cx=Math.max(boxX+20,boxX+(boxW-totalW)/2);
    words.forEach(function(wd,i){
      var tw=ctx.measureText(wd).width;
      ctx.fillStyle=colors[i%colors.length];ctx.globalAlpha=0.85;
      Viz.roundRect(ctx,cx-4,boxY+14,tw+10,32,5);ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='left';
      ctx.fillText(wd,cx+1,boxY+36);
      if(i<words.length-1){
        ctx.fillStyle='#94a3b3';ctx.beginPath();
        ctx.arc(cx+tw+14,boxY+30,2.5,0,Math.PI*2);ctx.fill();
      }
      cx+=tw+24;
    });

    var msgs={exact:'✅ 适合文本分析，最精确地切分出词',full:'⚡ 速度最快，列出所有可能的词（有冗余）',search:'🔍 精确模式基础上再切长词，适合搜索'};
    Viz.text(ctx,msgs[mode],w/2,h-12,{font:'11px sans-serif',color:'#6b7c8b'});

    info.innerHTML='<div style="margin-top:0.3rem"><b>切分结果：</b><span style="color:#e8934a">'+words.length+'个词元</span></div>'+
      '<div style="margin-top:0.2rem;word-break:break-all">[\''+words.join("', '")+'\']</div>';
  }

  // Radio buttons
  var radios=c.querySelectorAll('input[name="tok-mode"]');
  for(var i=0;i<radios.length;i++){
    radios[i].onchange=function(){mode=this.value;draw();};
  }
  document.getElementById('tok-next').onclick=function(){textIdx=(textIdx+1)%texts.length;draw();};

  draw();
}
