/**
 * 可视化：Word2Vec — CBOW vs Skip-gram 训练方式对比
 */
function initNLPWord2VecViz(containerId){
  var c=document.getElementById(containerId);if(!c)return;
  var words=['the','quick','brown','fox','jumps','over','the','lazy','dog'];
  var mode='cbow',winPos=3,animTimer=null;

  c.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:0.8rem;align-items:flex-start">'+
    '<canvas id="w2v-canvas" style="width:580px;height:320px;border:1px solid #e2ded6;border-radius:8px;background:#fafaf8"></canvas>'+
    '<div style="flex:1;min-width:200px">'+
      '<div style="font-weight:700;font-size:0.9rem;margin-bottom:0.6rem;color:#333">🎯 训练方式</div>'+
      '<div style="display:flex;gap:0.3rem;margin-bottom:0.7rem">'+
        '<button id="w2v-cbow" style="padding:0.45rem 0.9rem;background:#e8934a;color:#fff;border:none;border-radius:20px;cursor:pointer;font-weight:700;font-size:0.82rem">📥 CBOW</button>'+
        '<button id="w2v-skip" style="padding:0.45rem 0.9rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:20px;cursor:pointer;font-weight:700;font-size:0.82rem">📤 Skip-gram</button>'+
      '</div>'+
      '<div style="margin-bottom:0.5rem;font-size:0.78rem;color:#6b7c8b">'+
        '<span>窗口位置：</span>'+
        '<input type="range" id="w2v-pos" min="2" max="6" value="3" style="width:100%;margin-top:0.2rem">'+
        '<span id="w2v-pos-label" style="font-weight:600;color:#e8934a">fox (位置3)</span>'+
      '</div>'+
      '<button id="w2v-anim" style="padding:0.35rem 0.8rem;background:#5b9a7f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem">▶ 自动演示</button>'+
      '<div id="w2v-info" style="margin-top:0.6rem;font-size:0.78rem;color:#6b7c8b;line-height:1.7;min-height:90px"></div>'+
    '</div></div>';

  var info=document.getElementById('w2v-info');
  var posSlider=document.getElementById('w2v-pos');
  var posLabel=document.getElementById('w2v-pos-label');

  function draw(){
    var r=Viz.ctx('w2v-canvas');if(!r)return;var ctx=r.ctx,w=r.w,h=r.h;
    var win=2,wordW=58,wordH=30,startX=12,wordY=45;

    // Title
    var title=mode==='cbow'?'CBOW：上下文词 → 预测 中心词':'Skip-gram：中心词 → 预测 上下文词';
    Viz.text(ctx,title,w/2,18,{font:'bold 13px sans-serif',color:'#4a90a4'});

    // Draw word cells
    for(var i=0;i<words.length;i++){
      var wx=startX+i*wordW,wy=wordY;
      var isCenter=i===winPos;
      var isContext=i>=winPos-win&&i<=winPos+win&&i!==winPos;

      if(mode==='cbow'){
        if(isCenter){
          ctx.fillStyle='#e8934a';ctx.globalAlpha=0.9;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#fff';
        }else if(isContext){
          ctx.fillStyle='#c0d8e0';ctx.globalAlpha=0.85;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#4a90a4';
        }else{
          ctx.fillStyle='#f5f2eb';ctx.globalAlpha=0.5;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#999';
        }
      }else{
        if(isCenter){
          ctx.fillStyle='#e8934a';ctx.globalAlpha=0.9;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#fff';
        }else if(isContext){
          ctx.fillStyle='#d0e8d0';ctx.globalAlpha=0.85;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#5b9a7f';
        }else{
          ctx.fillStyle='#f5f2eb';ctx.globalAlpha=0.5;
          Viz.roundRect(ctx,wx,wy,wordW-4,wordH,8);ctx.fill();ctx.globalAlpha=1;
          ctx.fillStyle='#999';
        }
      }
      ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(words[i],wx+wordW/2-2,wy+wordH/2+4);
      ctx.fillStyle='#ccc';ctx.font='9px sans-serif';
      ctx.fillText(i,wx+wordW/2-2,wy+wordH+12);
    }

    // Arrows / flow
    var arrowY=wordY+wordH+30;
    var cx=startX+winPos*wordW+wordW/2-2;

    if(mode==='cbow'){
      // Context → Average → Center
      Viz.text(ctx,'上下文词向量 → 求和/平均',w/2,arrowY-8,{font:'bold 10px sans-serif',color:'#4a90a4'});

      // Down arrows from context
      ctx.strokeStyle='#4a90a4';ctx.lineWidth=1.5;
      for(var i=winPos-win;i<=winPos+win;i++){
        if(i===winPos||i<0||i>=words.length)continue;
        var sx=startX+i*wordW+wordW/2-2;
        ctx.setLineDash([4,2]);ctx.beginPath();
        ctx.moveTo(sx,wordY+wordH+2);ctx.lineTo(sx,arrowY+6);
        ctx.stroke();ctx.setLineDash([]);
      }

      // Average box
      ctx.fillStyle='#fef0e0';ctx.strokeStyle='#e8934a';
      var abx=startX+wordW;
      Viz.roundRect(ctx,abx,arrowY+6,wordW*5-8,28,6);ctx.fill();ctx.stroke();
      ctx.fillStyle='#e8934a';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText('求和/平均 → 隐藏层 → 输出层',abx+wordW*2.5-4,arrowY+25);

      // Arrow to center prediction
      ctx.strokeStyle='#e8934a';ctx.lineWidth=2.5;ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(cx,arrowY+36);ctx.lineTo(cx,arrowY+58);
      ctx.stroke();
      ctx.fillStyle='#e8934a';
      ctx.beginPath();ctx.moveTo(cx,arrowY+58);ctx.lineTo(cx-5,arrowY+51);ctx.lineTo(cx+5,arrowY+51);ctx.fill();

      // Output prediction
      ctx.fillStyle='#e8934a';ctx.globalAlpha=0.2;
      Viz.roundRect(ctx,cx-28,arrowY+58,56,24,6);ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle='#e8934a';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(words[winPos]+'̂',cx,arrowY+74);

    }else{
      // Skip-gram: Center → Hidden → Context
      Viz.text(ctx,'中心词 → 隐藏层',cx-30,arrowY-8,{font:'bold 10px sans-serif',color:'#e8934a'});

      // Center → Hidden
      ctx.strokeStyle='#e8934a';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx,wordY+wordH+2);ctx.lineTo(cx,arrowY+6);
      ctx.stroke();

      // Hidden box
      ctx.fillStyle='#fef0e0';ctx.strokeStyle='#e8934a';
      Viz.roundRect(ctx,cx-40,arrowY+6,80,26,6);ctx.fill();ctx.stroke();
      ctx.fillStyle='#e8934a';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText('隐藏层 → 输出层',cx,arrowY+23);

      // Fan out
      ctx.strokeStyle='#5b9a7f';ctx.lineWidth=1.5;
      for(var i=winPos-win;i<=winPos+win;i++){
        if(i===winPos||i<0||i>=words.length)continue;
        var tx=startX+i*wordW+wordW/2-2;
        ctx.setLineDash([4,2]);ctx.beginPath();
        ctx.moveTo(cx,arrowY+34);ctx.lineTo(tx,arrowY+55);
        ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#5b9a7f';
        var ang=Math.atan2(arrowY+55-arrowY-34,tx-cx);
        ctx.beginPath();ctx.moveTo(tx,arrowY+55);
        ctx.lineTo(tx-4*Math.cos(ang-Math.PI/6),arrowY+55-4*Math.sin(ang-Math.PI/6));
        ctx.lineTo(tx-4*Math.cos(ang+Math.PI/6),arrowY+55-4*Math.sin(ang+Math.PI/6));ctx.fill();

        // Context predictions
        ctx.fillStyle='#5b9a7f';ctx.globalAlpha=0.2;
        Viz.roundRect(ctx,tx-26,arrowY+56,52,22,6);ctx.fill();ctx.globalAlpha=1;
        ctx.fillStyle='#5b9a7f';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(words[i]+'̂',tx,arrowY+70);
      }
    }

    // Legend
    var leg=mode==='cbow'?'🔵 上下文词(蓝色) → 隐藏层(平均) → 预测中心词(橙色)  |  损失：多分类交叉熵':'🟠 中心词(橙色) → 隐藏层 → 分别预测上下文词(绿色)  |  损失：求平均后反向传播';
    Viz.text(ctx,leg,w/2,h-10,{font:'bold 10px sans-serif',color:'#6b7c8b'});

    // Info panel
    if(mode==='cbow'){
      var ctxWords=[];
      for(var i=winPos-win;i<=winPos+win;i++){if(i!==winPos&&i>=0&&i<words.length)ctxWords.push(words[i]);}
      info.innerHTML='<div><b>CBOW (Continuous Bag of Words)</b></div>'+
        '<div style="margin-top:0.2rem">📥 <b>输入X：</b>'+ctxWords.join(', ')+'（上下文词）</div>'+
        '<div style="margin-top:0.2rem">🎯 <b>标签Y：</b><span style="color:#e8934a;font-weight:700">'+words[winPos]+'</span>（中心词）</div>'+
        '<div style="margin-top:0.2rem">⚙️ <b>处理：</b>上下文词向量→<span style="color:#e8934a">求和取平均</span>→隐藏层→预测中心词</div>'+
        '<div style="margin-top:0.3rem;color:#6b7c8b;font-size:0.72rem">计算高效·适合高频词·大数据集表现好</div>';
    }else{
      var ctxWords=[];
      for(var i=winPos-win;i<=winPos+win;i++){if(i!==winPos&&i>=0&&i<words.length)ctxWords.push(words[i]);}
      info.innerHTML='<div><b>Skip-gram</b></div>'+
        '<div style="margin-top:0.2rem">📤 <b>输入X：</b><span style="color:#e8934a;font-weight:700">'+words[winPos]+'</span>（中心词）</div>'+
        '<div style="margin-top:0.2rem">🎯 <b>标签Y：</b>'+ctxWords.join(', ')+'（上下文词）</div>'+
        '<div style="margin-top:0.2rem">⚙️ <b>处理：</b>中心词→隐藏层→<span style="color:#5b9a7f">分别预测每个上下文词</span></div>'+
        '<div style="margin-top:0.3rem;color:#6b7c8b;font-size:0.72rem">低频词更优·语义关系更丰富·训练较慢</div>';
    }

    posLabel.textContent=words[winPos]+' (位置'+winPos+')';
    // Button states
    var bC=document.getElementById('w2v-cbow'),bS=document.getElementById('w2v-skip');
    bC.style.background=mode==='cbow'?'#e8934a':'#fff';
    bC.style.color=mode==='cbow'?'#fff':'#4a90a4';
    bC.style.border=mode==='cbow'?'none':'2px solid #4a90a4';
    bS.style.background=mode==='skipgram'?'#e8934a':'#fff';
    bS.style.color=mode==='skipgram'?'#fff':'#4a90a4';
    bS.style.border=mode==='skipgram'?'none':'2px solid #4a90a4';
  }

  document.getElementById('w2v-cbow').onclick=function(){mode='cbow';draw();};
  document.getElementById('w2v-skip').onclick=function(){mode='skipgram';draw();};

  posSlider.oninput=function(){winPos=parseInt(this.value);draw();};

  document.getElementById('w2v-anim').onclick=function(){
    var btn=this;
    if(animTimer){clearInterval(animTimer);animTimer=null;btn.textContent='▶ 自动演示';btn.style.background='#5b9a7f';return;}
    btn.textContent='⏸ 停止';btn.style.background='#c060a0';
    animTimer=setInterval(function(){
      mode=mode==='cbow'?'skipgram':'cbow';
      winPos=winPos<6?winPos+1:2;
      posSlider.value=winPos;
      draw();
    },1800);
  };

  draw();
}
