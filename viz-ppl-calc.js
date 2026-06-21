/**
 * 可视化：困惑度 Perplexity 计算器
 */
function initPPLCalcViz(containerId){
  var container=document.getElementById(containerId);if(!container)return;

  container.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:1rem">'+
    '<canvas id="ppl-canvas" width="1040" height="680" style="width:460px;height:340px;flex-shrink:0;border:1px solid #e2ded6;border-radius:8px;background:#fafcfc"></canvas>'+
    '<div style="flex:1;min-width:200px">'+
      '<div style="font-size:0.78rem;color:#6b7c8b;line-height:1.6">'+
        '<div style="margin-bottom:0.5rem"><strong>📝 输入句子（空格分词）：</strong></div>'+
        '<input type="text" id="ppl-sentence" value="我 爱 你" style="width:100%;padding:0.4rem 0.6rem;border:2px solid #4a90a4;border-radius:6px;font-size:0.85rem;margin-bottom:0.5rem">'+
        '<div id="ppl-sliders"></div>'+
        '<div style="margin-top:0.5rem;display:flex;gap:0.4rem">'+
          '<button id="ppl-preset-hi" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #4a90a4;border-radius:10px;cursor:pointer;background:#fff;font-weight:600">🎯 高确信</button>'+
          '<button id="ppl-preset-md" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #e8934a;border-radius:10px;cursor:pointer;background:#fff;font-weight:600">🎲 均匀</button>'+
          '<button id="ppl-preset-lo" style="flex:1;padding:0.3rem;font-size:0.7rem;border:2px solid #c0392b;border-radius:10px;cursor:pointer;background:#fff;font-weight:600">😰 低确信</button>'+
        '</div>'+
        '<div id="ppl-result" style="margin-top:0.6rem;background:#f8fdfe;padding:0.5rem;border-radius:8px;font-size:0.8rem;min-height:80px;line-height:1.5"></div>'+
      '</div>'+
    '</div>'+
  '</div>';

  var sentenceInput=document.getElementById('ppl-sentence');
  var slidersDiv=document.getElementById('ppl-sliders');
  var resultDiv=document.getElementById('ppl-result');
  var canvas=document.getElementById('ppl-canvas');
  if(!sentenceInput||!slidersDiv||!resultDiv||!canvas)return;

  var sliderValues=[70,75,80];

  function getTokens(){
    return sentenceInput.value.trim().split(/\s+/).filter(function(t){return t;});
  }

  function buildSliders(tokens, values){
    var html='';
    for(var i=0;i<tokens.length;i++){
      html+='<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.25rem">'+
        '<span style="width:36px;font-weight:600;font-size:0.8rem;color:#2c3e50">P('+tokens[i]+')</span>'+
        '<input type="range" class="ppl-slider" data-idx="'+i+'" min="1" max="99" value="'+values[i]+'" style="flex:1">'+
        '<span class="ppl-val" data-idx="'+i+'" style="width:38px;font-size:0.75rem;font-weight:700;color:#4a90a4;text-align:right">'+(values[i]/100).toFixed(2)+'</span>'+
      '</div>';
    }
    slidersDiv.innerHTML=html;

    var sliders=slidersDiv.querySelectorAll('.ppl-slider');
    for(var j=0;j<sliders.length;j++){
      (function(s){
        s.addEventListener('input',function(){
          var idx=parseInt(this.dataset.idx);
          var val=parseInt(this.value);
          sliderValues[idx]=val;
          var vs=slidersDiv.querySelector('.ppl-val[data-idx="'+idx+'"]');
          if(vs)vs.textContent=(val/100).toFixed(2);
          draw();
        });
      })(sliders[j]);
    }
  }

  function draw(){
    var ctx=canvas.getContext('2d');
    var dpr=window.devicePixelRatio||1;
    var rect=canvas.getBoundingClientRect();
    var cw=rect.width||520;
    var ch=rect.height||340;
    canvas.width=cw*dpr;
    canvas.height=ch*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,cw,ch);

    if(sliderValues.length===0)return;
    var probs=sliderValues.map(function(v){return v/100;});
    var n=probs.length;

    var logSum=0;
    for(var i=0;i<n;i++)logSum+=Math.log2(probs[i]);
    var H=-logSum/n;
    var PPL=Math.pow(2,H);
    var jointP=1;
    for(var i=0;i<n;i++)jointP*=probs[i];

    ctx.fillStyle='#2c3e50';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    ctx.fillText('困惑度 Perplexity 可视化',cw/2,16);

    var barW=Math.max(10,Math.min(80,(cw-40)/n-16));
    var totalBarW=n*(barW+16);
    var startX=(cw-totalBarW)/2;
    var barMaxH=160;
    var barY=210;

    for(var i=0;i<n;i++){
      var p=probs[i];
      var x=startX+i*(barW+16);
      var bh=Math.max(2,p*barMaxH);
      ctx.fillStyle='#f1f5f9';ctx.fillRect(x,barY-barMaxH,barW,barMaxH);
      var hue=200-p*120;
      ctx.fillStyle='hsl('+hue+',60%,'+(45+p*15)+'%)';
      ctx.fillRect(x,barY-bh,barW,bh);
      ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;
      ctx.strokeRect(x,barY-barMaxH,barW,barMaxH);
      ctx.fillStyle='#2c3e50';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText((p*100).toFixed(0)+'%',x+barW/2,barY-bh-6);
      var tokens=getTokens();
      ctx.fillText(tokens[i]||('w'+(i+1)),x+barW/2,barY+16);
    }

    var gaugeX=cw/2,gaugeY=barY+60;
    var pplColor=PPL<3?'#4a90a4':PPL<8?'#e8934a':'#c0392b';
    ctx.fillStyle=pplColor;ctx.font='bold 22px sans-serif';ctx.textAlign='center';
    ctx.fillText('PPL = '+PPL.toFixed(3),gaugeX,gaugeY-12);
    ctx.fillStyle='#64748b';ctx.font='11px sans-serif';
    ctx.fillText('H = '+H.toFixed(3)+' bits | 联合概率 = '+jointP.toFixed(4),gaugeX,gaugeY+12);
    ctx.fillStyle='#94a3b3';ctx.font='italic 10px sans-serif';
    ctx.fillText('等效于在 '+PPL.toFixed(1)+' 个等概率选项中猜测',gaugeX,gaugeY+30);

    var assessment;
    if(PPL<2)assessment='🟢 <strong>非常确信</strong>：模型对生成的每个词都很有把握，输出质量高。';
    else if(PPL<5)assessment='🟡 <strong>较为确信</strong>：模型整体信心较好，但有些词预测不确定。';
    else if(PPL<15)assessment='🟠 <strong>不太确定</strong>：模型在多个词上有犹豫，可能是生僻内容或模型能力不足。';
    else assessment='🔴 <strong>非常困惑</strong>：模型极度不确定，输出可能重复、平庸或质量差。';

    resultDiv.innerHTML=assessment+'<br><span style="font-size:0.72rem;color:#6b7c8b">'+
      'P(句子)='+probs.map(function(p){return p.toFixed(2);}).join('×')+'=<strong>'+jointP.toFixed(4)+'</strong><br>'+
      'H=-('+probs.map(function(p){return 'log₂('+p.toFixed(2)+')';}).join('+')+')/'+n+'=<strong>'+H.toFixed(3)+'</strong><br>'+
      'PPL=2^H=2^'+H.toFixed(3)+'=<strong>'+PPL.toFixed(3)+'</strong></span>';
  }

  function initSliders(tokens, values){
    sliderValues=values.slice();
    buildSliders(tokens,values);
    draw();
  }

  function setPreset(tokens, genFn){
    var vals=[];
    for(var i=0;i<tokens.length;i++)vals.push(genFn());
    sliderValues=vals;
    var sliders=slidersDiv.querySelectorAll('.ppl-slider');
    for(var j=0;j<sliders.length;j++){
      if(j<vals.length)sliders[j].value=vals[j];
      var vs=slidersDiv.querySelector('.ppl-val[data-idx="'+j+'"]');
      if(vs)vs.textContent=(vals[j]/100).toFixed(2);
    }
    draw();
  }

  sentenceInput.addEventListener('input',function(){
    var tokens=getTokens();
    if(tokens.length===0)return;
    var vals=[];
    for(var i=0;i<tokens.length;i++)vals.push(50+Math.floor(Math.random()*30));
    initSliders(tokens,vals);
  });

  document.getElementById('ppl-preset-hi').addEventListener('click',function(){
    var tokens=getTokens();if(tokens.length===0)return;
    setPreset(tokens,function(){return 70+Math.floor(Math.random()*20);});
  });
  document.getElementById('ppl-preset-md').addEventListener('click',function(){
    var tokens=getTokens();if(tokens.length===0)return;
    setPreset(tokens,function(){return 30+Math.floor(Math.random()*10);});
  });
  document.getElementById('ppl-preset-lo').addEventListener('click',function(){
    var tokens=getTokens();if(tokens.length===0)return;
    setPreset(tokens,function(){return 10+Math.floor(Math.random()*20);});
  });

  initSliders(['我','爱','你'],[70,75,80]);
  window.addEventListener('resize',draw);
}
