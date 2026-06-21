/**
 * 导航系统 — 侧边栏交互、滚动追踪、搜索过滤、内容注入、右侧TOC
 */
const Nav = {
  // 注册的分类导航结构
  groups: [
    { id:'g-math', icon:'📐', title:'数学基础', open:true, books:[
      { id:'m-ch1', text:'一、指数与对数', subs:['恒等式·Sigmoid·Softmax'] },
      { id:'m-ch2', text:'二、一次函数', subs:['bias & weight'] },
      { id:'m-ch3', text:'三、二次函数', subs:['凸函数·MSE凸性'] },
      { id:'m-ch4', text:'四、导数 ⭐', subs:['定义·求导·偏导·链式法则→反向传播'] },
      { id:'m-ch5', text:'五、求和符号 Σ', subs:['Σ=for+sum·逐项求导'] },
      { id:'m-ch6', text:'六、综合应用', subs:['最小化L→c=均值'] },
    ]},
    { id:'g-py', icon:'🐍', title:'Python 编程', open:false, books:[
      { id:'pyb-ch1', text:'基础语法', subs:['变量·类型·运算符·字符串·输入输出'] },
      { id:'pyb-ch2', text:'流程控制与容器', subs:['if/for/while·list/tuple/set/dict/str'] },
      { id:'pyb-ch3', text:'函数·文件·异常', subs:['def·lambda·装饰器·with·try'] },
      { id:'pyb-ch4', text:'面向对象·算法·进阶', subs:['class·继承·排序·查找·正则·进程/线程'] },
    ]},
    { id:'g-sql', icon:'🗄️', title:'MySQL 数据库', open:false, books:[
      { id:'sql-ch1', text:'基础与单表查询', subs:['DDL/DML/DQL·SELECT·WHERE·ORDER·LIMIT'] },
      { id:'sql-ch2', text:'多表查询与函数', subs:['JOIN·子查询·聚合·窗口·CASE WHEN'] },
      { id:'sql-ch3', text:'Python操作MySQL', subs:['pymysql·CRUD·SQL注入防护·FineBI'] },
    ]},
    { id:'g-data', icon:'📊', title:'数据分析 (Pandas+NumPy)', open:false, books:[
      { id:'p-ch1', text:'Pandas 数据结构', subs:['Series·DataFrame·loc/iloc·常用方法'] },
      { id:'p-ch2', text:'Pandas 缺失值处理', subs:['isnull·dropna·fillna·ffill/bfill·interpolate'] },
      { id:'p-ch3', text:'Pandas 分组聚合', subs:['groupby·agg·transform·filter·apply·透视表'] },
      { id:'p-ch4', text:'Pandas 实战案例', subs:['电影·链家租房·RFM分析·标准分析流程'] },
      { id:'n-ch1', text:'NumPy 核心速查', subs:['ndarray·创建·统计·矩阵运算·广播'] },
    ]},
    { id:'g-linux', icon:'🐧', title:'Linux 操作系统', open:false, books:[
      { id:'linux-ch1', text:'核心速查', subs:['目录结构·一切皆文件·常用命令·VIM'] },
    ]},
    { id:'g-ml', icon:'🤖', title:'机器学习', open:true, books:[
      { id:'u-ch1', text:'Ch1 AI四大概念', subs:['AI⊃ML⊃NN⊃DL·两种学习范式'] },
      { id:'u-ch2', text:'Ch2 应用领域与发展史', subs:['8大领域·4阶段·数据+算法+算力'] },
      { id:'u-ch3', text:'Ch3 数据相关术语', subs:['样本·特征·标签·回归vs分类·预处理'] },
      { id:'u-ch4', text:'Ch4 KNN算法 ⭐', subs:['三步流程·欧式vs曼哈顿·电影分类案例'] },
      { id:'u-ch5', text:'Ch5 模型相关术语', subs:['模型=算法+参数·线性公式集·交互项'] },
      { id:'u-ch6', text:'Ch6 梯度下降 ⭐', subs:['W=W−α∇·MAE/MSE/RMSE·手算示例'] },
      { id:'u-ch7', text:'Ch7 数据拆分与超参数', subs:['训练/验证/测试·CV交叉验证'] },
      { id:'u-ch8', text:'Ch8 拟合问题 ⭐', subs:['欠/过拟合·L1/L2正则化·偏差vs方差'] },
      { id:'d-ch1', text:'决策树', subs:['CART·Gini/MSE·无随机性'] },
      { id:'d-ch2', text:'集成学习 ⭐', subs:['RF·GBDT·XGBoost·梯度提升=梯度下降'] },
      { id:'d-ch3', text:'聚类 K-Means', subs:['选K中心→分配→重算→收敛·肘方法'] },
    ]},
    { id:'g-dl', icon:'🧠', title:'深度学习', open:false, books:[
      { id:'l-ch1', text:'Ch1 DL概念与网络构成', subs:['ANN·CNN·RNN·全连接层=多项逻辑回归'] },
      { id:'l-ch2', text:'Ch2 激活函数 ⭐', subs:['Sigmoid→Tanh→ReLU→LeakyReLU·GELU'] },
      { id:'l-ch3', text:'Ch3 参数初始化', subs:['Xavier·Kaiming·1/√d'] },
      { id:'l-ch4', text:'Ch4 优化方法 ⭐', subs:['SGD→Momentum→AdaGrad→RMSProp→Adam'] },
      { id:'l-ch5', text:'Ch5 正则化', subs:['Dropout·BatchNorm·L1/L2参数管制'] },
      { id:'c-ch1', text:'CNN概述', subs:['卷积层→ReLU→池化层→FC·三大优势'] },
      { id:'c-ch2', text:'CNN 卷积层 ⭐', subs:['卷积核·Padding·Stride·特征图公式·多通道'] },
      { id:'c-ch3', text:'CNN 池化层', subs:['MaxPool·AvgPool·降维增鲁棒性'] },
      { id:'c-ch4', text:'CNN CIFAR10实战', subs:['Conv→Pool→FC完整分类网络代码'] },
      { id:'r-ch1', text:'RNN原理 ⭐', subs:['hₜ=tanh(Whₜ₋₁+Uxₜ+b)·四种应用模式'] },
      { id:'r-ch2', text:'LSTM与GRU', subs:['遗忘门·输入门·输出门·Cₜ高速公路·GRU简化'] },
      { id:'r-ch3', text:'词嵌入与文本生成', subs:['Embedding·歌词生成训练循环'] },
    ]},
    { id:'g-torch', icon:'🔥', title:'PyTorch 框架', open:false, books:[
      { id:'t-ch1', text:'张量创建速查', subs:['tensor·rand·zeros·ones·arange·linspace'] },
      { id:'t-ch2', text:'运算与形状操作', subs:['@matmul·reshape·cat·stack·索引'] },
      { id:'t-ch3', text:'自动微分 ⭐', subs:['backward·grad·标准训练循环·五个关键'] },
    ]},
    { id:'g-nlp', icon:'📝', title:'文本预处理 (NLP)', open:false, books:[
      { id:'nlp-ch1', text:'Ch1 NLP与预处理概述', subs:['NLP分类·应用场景·预处理概念·五大环节'] },
      { id:'nlp-ch2', text:'Ch2 文本基本处理 ⭐', subs:['jieba分词·词性标注·命名实体识别'] },
      { id:'nlp-ch3', text:'Ch3 文本语料分析', subs:['标签分布·句子长度·词频统计·词云'] },
      { id:'nlp-ch4', text:'Ch4 文本特征处理', subs:['n-gram特征·长度规范·截断补齐'] },
      { id:'nlp-ch5', text:'Ch5 文本编码方式 ⭐', subs:['One-Hot·TF-IDF·Word2Vec·CBOW·Skip-gram·FastText'] },
      { id:'nlp-ch6', text:'Ch6 文本数据增强', subs:['回译法·多语言串联'] },
    ]},
    { id:'g-llm-core', icon:'🏗️', title:'LLM核心架构 ⭐', open:true, books:[
      { id:'lm-ch1', text:'一、自注意力机制 ⭐', subs:['Q/K/V·Softmax·三步计算'] },
      { id:'lm-ch2', text:'二、编码器-解码器架构', subs:['Multi-Head·残差·FFN·掩码·Cross-Attn'] },
      { id:'lm-ch3', text:'三、位置编码', subs:['正弦余弦·RoPE·绝对vs相对'] },
      { id:'lm-ch4', text:'四、BERT 模型', subs:['MLM·NSP·[CLS]微调·NER'] },
      { id:'lm-ch5', text:'五、GPT 模型 ⭐', subs:['自回归·规模法则·能力涌现·GPT1-4'] },
      { id:'lm-ch6', text:'六、LLM训练方法', subs:['预训练·SFT·RFT·RLHF·三步对齐'] },
      { id:'lm-ch7', text:'七、LLM评价指标', subs:['PPL·BLEU·ROUGE·Benchmark'] },
      { id:'lm-ch8', text:'八、LLM发展历史', subs:['2017-2025时间线·DeepSeek·开源vs闭源'] },
      { id:'lm-ch9', text:'九、LLM相关技术', subs:['提示词工程·RAG·Agent·LoRA'] },
      { id:'lm-ch10', text:'核心公式速查表', subs:['8大公式一览'] },
    ]},
    { id:'g-llm', icon:'💬', title:'大模型 & AI Agent', open:false, books:[
      { id:'pr-ch1', text:'大模型技术全景', subs:['发展史·幻觉·四大开发技术'] },
      { id:'pr-ch2', text:'提示词工程 ⭐', subs:['FewShot·CoT·链式·ReAct·OpenAI SDK代码'] },
      { id:'pr-ch3', text:'模型安全', subs:['提示词注入·越狱攻击·数据泄露·防御'] },
      { id:'ag-ch1', text:'AI Agent概念', subs:['Agent=LLM+记忆+规划+工具'] },
      { id:'ag-ch2', text:'平台选型', subs:['Coze·Dify·LangChain·RAGFlow对比'] },
      { id:'ag-ch3', text:'Coze实战', subs:['工作流·知识库·多模态·Python调用API'] },
      { id:'ag-ch4', text:'Dify & RAGFlow', subs:['Chatflow·Workflow·RAG三步·外部知识库'] },
    ]},
  ],

  // 初始化
  init(){
    this.buildSidebar();
    this.bindEvents();
    this.initScrollSpy();
    this.initBackToTop();
    // 延迟构建TOC（等Content.render完成后DOM就绪）
    setTimeout(()=>this.buildToc(), 150);
    // 窗口大小变化时重检TOC显隐
    let resizeTimer;
    window.addEventListener('resize',()=>{
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(()=>{
        const tc=document.getElementById('tocContainer');
        if(tc)tc.style.display=window.innerWidth>=1420?'block':'none';
      },150);
    });
  },

  // 构建侧边栏 HTML
  buildSidebar(){
    const nav = document.getElementById('sidebarNav');
    if(!nav) return;
    let html = '';
    this.groups.forEach(g => {
      html += `<div class="nav-group">
        <div class="nav-group-title${g.open?' open':''}" data-group="${g.id}" onclick="Nav.toggleGroup(this)">${g.icon} ${g.title}<span class="arrow">▶</span></div>
        <div class="nav-group-items${g.open?' open':''}" id="items-${g.id}">`;
      g.books.forEach(b => {
        html += `<div class="nav-book" data-book="${b.id}" onclick="Nav.toggleBook(this)">${b.text}<span class="b-arrow">▶</span></div>
        <div class="nav-subs" id="subs-${b.id}">`;
        (b.subs||[]).forEach((s,i) => {
          html += `<a href="#${b.id}" data-sub="${i}" onclick="Nav.navTo('${b.id}')">${s}</a>`;
        });
        html += '</div>';
      });
      html += '</div></div>';
    });
    nav.innerHTML = html;
  },

  // 事件绑定
  bindEvents(){
    const sb=document.getElementById('sidebar'),ov=document.getElementById('overlay'),hb=document.getElementById('hamburger');
    hb.addEventListener('click',()=>{sb.classList.contains('open')?Nav.closeSb():Nav.openSb()});
    ov.addEventListener('click',()=>Nav.closeSb());
    // 搜索
    const si=document.getElementById('navSearch');
    if(si)si.addEventListener('input',function(){Nav.filter(this.value)});
    // Ctrl+K
    document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();document.getElementById('navSearch')?.focus()}});
  },

  openSb(){document.getElementById('sidebar').classList.add('open');document.getElementById('overlay').classList.add('show');document.body.style.overflow='hidden'},
  closeSb(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('show');document.body.style.overflow=''},

  // 折叠组
  toggleGroup(el){
    el.classList.toggle('open');
    document.getElementById('items-'+el.dataset.group).classList.toggle('open');
  },

  // 折叠书
  toggleBook(el){
    el.classList.toggle('open');
    document.getElementById('subs-'+el.dataset.book).classList.toggle('open');
  },

  // 导航跳转
  navTo(id){
    const el=document.getElementById(id);
    if(el){el.scrollIntoView({behavior:'smooth',block:'start'});}
    if(window.innerWidth<=920)Nav.closeSb();
  },

  // 搜索过滤
  filter(q){
    q=q.trim().toLowerCase();
    document.querySelectorAll('.nav-group').forEach(g=>{
      if(!q){g.style.display='';return;}
      let match=false;
      g.querySelectorAll('.nav-book,.nav-subs a').forEach(el=>{
        if((el.textContent||'').toLowerCase().includes(q)){el.style.display='';match=true}
        else el.style.display='none';
      });
      if(match){
        g.style.display='';
        g.querySelector('.nav-group-title')?.classList.add('open');
        g.querySelector('.nav-group-items')?.classList.add('open');
      } else if(q){
        // 检查组标题是否匹配
        if((g.querySelector('.nav-group-title')?.textContent||'').toLowerCase().includes(q)){g.style.display=''}
        else g.style.display='none';
      }
    });
  },

  // 滚动追踪
  initScrollSpy(){
    let ticking=false;
    window.addEventListener('scroll',()=>{
      if(!ticking){requestAnimationFrame(()=>{
        const sy=window.pageYOffset||document.documentElement.scrollTop;
        let cur='';
        document.querySelectorAll('.chapter[id]').forEach(h=>{if(h.offsetTop-60<=sy)cur=h.id});
        document.querySelectorAll('.nav-subs a').forEach(a=>{
          a.classList.remove('active');
          if(cur&&a.getAttribute('href')==='#'+cur)a.classList.add('active');
        });
        // 同步更新右侧TOC激活状态
        Nav.updateTocActive(cur);
        // 回顶按钮显隐
        const btt=document.getElementById('backToTop');
        if(btt)btt.classList.toggle('visible', sy>400);
        ticking=false;
      });ticking=true}
    },{passive:true});
  },

  // ═══════════════ 右侧 TOC (On This Page) ═══════════════
  buildToc(){
    const tocList=document.getElementById('tocList');
    const tocContainer=document.getElementById('tocContainer');
    if(!tocList||!tocContainer) return;

    // 收集所有章节标题
    const chapters=document.querySelectorAll('.chapter[id]');
    if(chapters.length===0){tocContainer.style.display='none';return;}

    let html='';
    chapters.forEach(ch=>{
      const headEl=ch.querySelector('.head');
      // 提取纯文本标题（排除.num标签）
      let title='';
      if(headEl){
        title=Array.from(headEl.childNodes)
          .filter(n=>n.nodeType===3||(n.nodeType===1&&!n.classList.contains('num')))
          .map(n=>n.textContent.trim())
          .join('').trim();
      }
      if(!title)title=headEl?headEl.textContent.trim():ch.id;

      html+=`<li><a class="toc-link" href="#${ch.id}" data-toc="${ch.id}">${title}</a></li>`;
    });
    tocList.innerHTML=html;

    // 点击跳转
    tocList.querySelectorAll('.toc-link').forEach(link=>{
      link.addEventListener('click',function(e){
        e.preventDefault();
        const target=document.getElementById(this.dataset.toc);
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });

    // 仅在大屏显示TOC
    if(window.innerWidth>=1420)tocContainer.style.display='block';
  },

  // 更新TOC高亮
  updateTocActive(curId){
    document.querySelectorAll('.toc-link').forEach(a=>{
      a.classList.remove('active');
      if(curId&&a.dataset.toc===curId)a.classList.add('active');
    });
  },

  // 初始化回顶按钮
  initBackToTop(){
    const btn=document.getElementById('backToTop');
    if(!btn)return;
    btn.addEventListener('click',()=>{
      window.scrollTo({top:0,behavior:'smooth'});
    });
  },
};

document.addEventListener('DOMContentLoaded',()=>Nav.init());
