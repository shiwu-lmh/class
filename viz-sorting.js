/**
 * 可视化：排序算法对比 —— 冒泡 vs 选择，步进观察
 */
function initSortingViz(containerId){
  const container=document.getElementById(containerId);
  if(!container)return;

  container.innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:1rem">
      <canvas id="sort-canvas" style="width:500px;height:280px;border:1px solid #e2ded6;border-radius:8px;background:#fff"></canvas>
      <div style="flex:1;min-width:200px">
        <div style="margin-bottom:0.5rem">
          <button id="sort-step" style="padding:0.45rem 1rem;background:#4a90a4;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.85rem">▶ 下一步</button>
          <button id="sort-auto" style="padding:0.45rem 0.7rem;background:#fff;color:#4a90a4;border:2px solid #4a90a4;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.8rem;margin-left:0.3rem">⏩ 自动</button>
          <button id="sort-reset" style="padding:0.45rem 0.7rem;background:#fff;color:#6b7c8b;border:1px solid #e2ded6;border-radius:8px;cursor:pointer;font-size:0.8rem;margin-left:0.3rem">↺ 重置</button>
        </div>
        <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem">
          <button class="sort-mode-btn active" data-mode="bubble" style="padding:0.3rem 0.7rem;border:2px solid #4a90a4;border-radius:15px;background:#4a90a4;color:#fff;cursor:pointer;font-weight:600;font-size:0.78rem">冒泡排序</button>
          <button class="sort-mode-btn" data-mode="select" style="padding:0.3rem 0.7rem;border:2px solid #e8934a;border-radius:15px;background:#fff;color:#e8934a;cursor:pointer;font-weight:600;font-size:0.78rem">选择排序</button>
        </div>
        <div id="sort-info" style="font-size:0.78rem;color:#6b7c8b;line-height:1.5;min-height:60px"></div>
      </div>
    </div>`;

  const canvas=document.getElementById('sort-canvas');
  const infoEl=document.getElementById('sort-info');
  let mode='bubble';
  let arr=[8,3,6,9,2,5,7,1,4];
  let i=0,j=0,minIdx=0,done=false,comparing=[-1,-1],swapped=[-1,-1];
  let autoTimer=null;

  function reset(){arr=[8,3,6,9,2,5,7,1,4];i=0;j=0;minIdx=0;done=false;comparing=[-1,-1];swapped=[-1,-1];draw();}

  function draw(){
    const r=Viz.ctx('sort-canvas');if(!r)return;
    const{ctx,w,h}=r;
    const barW=Math.min(44,(w-60)/arr.length);
    const gap=6;const totalW=arr.length*(barW+gap)-gap;
    const startX=(w-totalW)/2;const baseY=h-35;
    arr.forEach((val,idx)=>{
      const x=startX+idx*(barW+gap);
      const bh=val*22;
      let color='#4a90a4';
      if(idx===comparing[0]||idx===comparing[1])color='#e8934a';
      if(idx===swapped[0]||idx===swapped[1])color='#5b9a7f';
      if(done)color='#5b9a7f';
      ctx.fillStyle=color;ctx.globalAlpha=0.85;
      ctx.fillRect(x,baseY-bh,barW,bh);ctx.globalAlpha=1;
      ctx.strokeStyle='#fff';ctx.lineWidth=1;
      ctx.strokeRect(x,baseY-bh,barW,bh);
      Viz.text(ctx,val,x+barW/2,baseY-bh-10,{font:'bold 11px sans-serif',color:color});
    });
    // 指针标记
    if(!done&&mode==='bubble'){
      const x=startX+j*(barW+gap);
      Viz.text(ctx,'j',x+barW/2,baseY+16,{font:'bold 10px sans-serif',color:'#e8934a'});
    }
    if(!done&&mode==='select'){
      const x1=startX+i*(barW+gap),x2=startX+j*(barW+gap);
      Viz.text(ctx,'i',x1+barW/2,baseY+16,{font:'bold 10px sans-serif',color:'#4a90a4'});
      Viz.text(ctx,'j',x2+barW/2,baseY+16,{font:'bold 10px sans-serif',color:'#e8934a'});
    }
    Viz.text(ctx,mode==='bubble'?'冒泡排序':'选择排序',w/2,16,{font:'bold 12px sans-serif',color:'#2c3e50'});
    Viz.text(ctx,done?'✅ 排序完成':`第${i+1}轮`,w/2,h-8,{font:'11px sans-serif',color:done?'#5b9a7f':'#6b7c8b'});
  }

  function step(){
    if(done)return;
    comparing=[-1,-1];swapped=[-1,-1];
    if(mode==='bubble'){
      if(i>=arr.length-1){done=true;draw();infoEl.textContent='✅ 冒泡排序完成！时间复杂度O(n²)，稳定排序。';return;}
      if(j>=arr.length-1-i){i++;j=0;step();return;}
      comparing=[j,j+1];
      if(arr[j]>arr[j+1]){[arr[j],arr[j+1]]=[arr[j+1],arr[j]];swapped=[j,j+1];}
      infoEl.innerHTML=`第<strong>${i+1}</strong>轮，比较 arr[${j}]=${arr[j]} 和 arr[${j+1}]=${arr[j+1]}${swapped[0]>=0?' → <span style="color:#5b9a7f">交换!</span>':''}`;
      j++;
    }else{
      if(i>=arr.length-1){done=true;draw();infoEl.textContent='✅ 选择排序完成！时间复杂度O(n²)，不稳定排序。';return;}
      if(j>=arr.length){[arr[i],arr[minIdx]]=[arr[minIdx],arr[i]];swapped=[i,minIdx];i++;j=i+1;minIdx=i;step();return;}
      comparing=[minIdx,j];
      if(arr[j]<arr[minIdx]){minIdx=j;}
      infoEl.innerHTML=`第<strong>${i+1}</strong>轮，当前最小值 arr[${minIdx}]=${arr[minIdx]}，比较 arr[${j}]=${arr[j]}`;
      j++;
    }
    draw();
  }

  function toggleAuto(){
    if(autoTimer){clearInterval(autoTimer);autoTimer=null;document.getElementById('sort-auto').textContent='⏩ 自动';return;}
    document.getElementById('sort-auto').textContent='⏸ 停止';
    autoTimer=setInterval(()=>{if(done){clearInterval(autoTimer);autoTimer=null;document.getElementById('sort-auto').textContent='⏩ 自动';return;}step();},350);
  }

  document.getElementById('sort-step').addEventListener('click',step);
  document.getElementById('sort-auto').addEventListener('click',toggleAuto);
  document.getElementById('sort-reset').addEventListener('click',reset);
  container.querySelectorAll('.sort-mode-btn').forEach(btn=>{
    btn.addEventListener('click',function(){
      container.querySelectorAll('.sort-mode-btn').forEach(b=>{b.classList.remove('active');b.style.background='#fff';});
      this.classList.add('active');
      mode=this.dataset.mode;
      this.style.background=mode==='bubble'?'#4a90a4':'#e8934a';
      this.style.color='#fff';
      reset();
    });
  });

  draw();
  infoEl.textContent='🔍 点击"下一步"观察排序过程。冒泡=相邻比较交换；选择=每轮找最小值放到前面。';
  window.addEventListener('resize',draw);
}
