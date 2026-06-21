/**
 * 可视化：n-gram特征生成 — 交互式bi-gram/tri-gram展示
 */
function initNLPNgramViz(containerId){
  var c=document.getElementById(containerId);if(!c)return;
  var seq=[1,3,2,1,5,3];
  var labels=['a','c','b','a','e','c'];
  var n=2;

  c.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:0.8rem;align-items:flex-start">'+
    '<canvas id="ng-canvas" style="width:560px;height:240px;border:1px solid #e2ded6;border-radius:8px;background:#fafaf8"></canvas>'+
    '<div style="flex:1;min-width:180px">'+
      '<div style="font-weight:700;font-size:0.9rem;margin-bottom:0.5rem;color:#333">📐 选择n-gram参数</div>'+
      '<div style="display:flex;gap:0.3rem;margin-bottom:0.7rem">'+
        '<button id="ng-btn2" style="padding:0.4rem 1.2rem;background:#e8934a;color:#fff;border:none;border-radius:20px;cursor:pointer;font-weight:700;font-size:0.9rem">Bi-gram (n=2)</button>'+
        '<button id="ng-btn3" style="padding:0.4rem 1.2rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:20px;cursor:pointer;font-weight:700;font-size:0.9rem">Tri-gram (n=3)</button>'+
      '</div>'+
      '<div id="ng-info" style="font-size:0.78rem;color:#6b7c8b;line-height:1.7;min-height:80px"></div>'+
      '<div style="margin-top:0.5rem;font-size:0.72rem;color:#999"><b>公式：</b>set(zip(*[list[i:] for i in range(n)]))</div>'+
    '</div></div>';

  var info=document.getElementById('ng-info');
  var colors=['#e8934a','#4a90a4','#5b9a7f','#c060a0','#8470c0','#d4a840'];

  function computeNgrams(){
    var res=[];
    for(var i=0;i<=seq.length-n;i++){res.push(seq.slice(i,i+n));}
    return res;
  }

  function draw(){
    var r=Viz.ctx('ng-canvas');if(!r)return;var ctx=r.ctx,w=r.w,h=r.h;
    var ngrams=computeNgrams();
    var uniqMap={};
    ngrams.forEach(function(g){
      var key=g.join(',');if(!uniqMap[key])uniqMap[key]=Object.keys(uniqMap).length;
    });
    var uniqCount=Object.keys(uniqMap).length;

    // Title
    Viz.text(ctx,n+'-gram 特征生成（滑动窗口='+n+'）',w/2,20,{font:'bold 13px sans-serif',color:'#4a90a4'});

    // Original sequence box
    var seqY=48,seqH=40,startX=Math.floor((w-(seq.length*52))/2);
    ctx.fillStyle='#f0ebe0';ctx.strokeStyle='#d4cbb8';
    Viz.roundRect(ctx,startX-8,seqY-4,seq.length*52+16,seqH+8,6);ctx.fill();ctx.stroke();

    // Sequence items
    for(var i=0;i<seq.length;i++){
      var sx=startX+i*52;
      ctx.fillStyle='#fff';ctx.strokeStyle='#94a3b3';ctx.lineWidth=1.5;
      Viz.roundRect(ctx,sx,seqY,44,seqH,8);ctx.fill();ctx.stroke();
      ctx.fillStyle='#333';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
      ctx.fillText(labels[i],sx+22,seqY+17);
      ctx.fillStyle='#94a3b3';ctx.font='10px sans-serif';
      ctx.fillText(seq[i],sx+22,seqY+33);
    }

    // n-gram bracket regions
    for(var i=0;i<=seq.length-n;i++){
      var sx=startX+i*52;
      var grp=seq.slice(i,i+n);
      var gkey=grp.join(',');
      var gcol=colors[uniqMap[gkey]%colors.length];

      // Highlight bracket
      ctx.strokeStyle=gcol;ctx.lineWidth=2.5;
      ctx.beginPath();
      ctx.rect(sx-2,seqY-6,n*52+4,seqH+12);
      ctx.stroke();
    }

    // Result tokens below
    var resY=seqY+seqH+40;
    var uniqSeen=[];
    ngrams.forEach(function(g){
      var gkey=g.join(',');
      if(uniqSeen.indexOf(gkey)<0)uniqSeen.push(gkey);
    });

    for(var j=0;j<uniqSeen.length;j++){
      var gcol=colors[j%colors.length];
      var rx=30+j*100;
      ctx.fillStyle=gcol;ctx.globalAlpha=0.85;
      Viz.roundRect(ctx,rx,resY,80,26,6);ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
      ctx.fillText(uniqSeen[j],rx+40,resY+18);
    }
    Viz.text(ctx,'共 '+uniqCount+' 个不重复的 '+n+'-gram 特征',w/2,h-10,{font:'bold 11px sans-serif',color:'#e8934a'});

    // Info
    var tokens=uniqSeen.map(function(k,i){return '<span style="background:'+colors[i%colors.length]+';color:#fff;padding:0.15rem 0.45rem;border-radius:10px;font-size:0.78rem;font-weight:600">('+k+')</span>';}).join(' ');
    info.innerHTML='<div><b>原始序列：</b>['+seq.join(', ')+'] (长度='+seq.length+')</div>'+
      '<div style="margin-top:0.3rem"><b>'+n+'-gram特征集合：</b></div>'+
      '<div style="margin-top:0.2rem;display:flex;flex-wrap:wrap;gap:0.3rem">'+tokens+'</div>'+
      '<div style="margin-top:0.4rem;color:#e8934a;font-weight:600">特征数：'+(seq.length-n+1)+'个(位置) → '+uniqCount+'个(去重)</div>';

    // Button states
    var btn2=document.getElementById('ng-btn2'),btn3=document.getElementById('ng-btn3');
    btn2.style.background=n===2?'#e8934a':'#fff';
    btn2.style.color=n===2?'#fff':'#4a90a4';
    btn2.style.border=n===2?'none':'2px solid #4a90a4';
    btn3.style.background=n===3?'#e8934a':'#fff';
    btn3.style.color=n===3?'#fff':'#4a90a4';
    btn3.style.border=n===3?'none':'2px solid #4a90a4';
  }

  document.getElementById('ng-btn2').onclick=function(){n=2;draw();};
  document.getElementById('ng-btn3').onclick=function(){n=3;draw();};

  draw();
}
