/**
 * 全部内容数据 — 按章节组织，页面加载后自动注入到 main 区域
 */
const Content = {

// ═══════════════════════ 数学基础 ═══════════════════════
'g-math':`
<div class="book-header"><span class="icon">📐</span><div><h1>数学基础</h1><div class="meta"><span>📄 16页讲义</span><span>📦 6模块</span><span>🎯 ML必备数学前置</span></div></div></div>

<div class="chapter" id="m-ch1"><div class="head"><span class="num">一</span>指数函数与对数函数</div><div class="body">
<div class="overview"><span class="ov-item core">eˣ / ln x</span><span class="ov-arrow">→</span><span class="ov-item">幂运算法则</span><span class="ov-arrow">→</span><span class="ov-item">互逆关系</span><span class="ov-arrow">→</span><span class="ov-item core">Sigmoid / Softmax</span></div>
<div class="section"><h3>核心恒等式</h3>
<div class="fm-card"><div class="fm-label">📌 必须牢记</div><div class="fm-main">e⁰=1 | e¹=e≈2.718 | aᵐ·aⁿ=aᵐ⁺ⁿ | aᵐ÷aⁿ=aᵐ⁻ⁿ | log1=0</div><div class="fm-sub">log p&lt;0 (0&lt;p&lt;1) | 互逆：e^(lnx)=x, ln(eˣ)=x</div></div></div>
<div class="section"><h3>ML 中的直接应用 <span class="tag-important">重点</span></h3>
<p><strong>Sigmoid：</strong>σ(x)=1/(1+e⁻ˣ)，导数 σ(1−σ) → 二分类输出层。<strong>Softmax：</strong>eᶻ/Σeᶻ → 多分类概率化。<strong>交叉熵：</strong>L=−Σyᵢ·log(ŷᵢ)，log将乘法变加法。</p></div>
</div></div>

<div class="chapter" id="m-ch2"><div class="head"><span class="num">二</span>一次函数（线性函数）</div><div class="body">
<div class="overview"><span class="ov-item core">ŷ=b+w·x</span><span class="ov-arrow">→</span><span class="ov-item">b=bias(偏置)</span><span class="ov-arrow">→</span><span class="ov-item">w=weight(权重)</span></div>
<table><tr><th>参数</th><th>数学</th><th>ML含义</th><th>别名</th></tr><tr><td>a/b₀</td><td>截距(x=0时y)</td><td><strong>偏置 Bias</strong></td><td>θ₀</td></tr><tr><td>b/w</td><td>斜率(变化率)</td><td><strong>权重 Weight</strong></td><td>θ₁</td></tr></table>
<div class="kp"><strong>"线性"=参数线性组合，非变量必须一次方。</strong>y=b₀+b₁x+b₂x² 对参数仍线性→可手动创建 x²,log(x),x₁x₂ 等特征拟合非线性关系。</div>
</div></div>

<div class="chapter" id="m-ch3"><div class="head"><span class="num">三</span>二次函数</div><div class="body">
<div class="overview"><span class="ov-item">c&gt;0</span><span class="ov-arrow">→</span><span class="ov-item core">凸函数</span><span class="ov-arrow">→</span><span class="ov-item">唯一全局最小值</span><span class="ov-arrow">→</span><span class="ov-item star">MSE损失</span></div>
<div class="kp important"><strong>⭐ MSE=Σ(y−ŷ)² 是凸函数 → 梯度下降必收敛到全局最优。</strong>c&lt;0→凹函数，有全局最大值。</div>
</div></div>

<div class="chapter" id="m-ch4"><div class="head"><span class="num">四</span>导数 —— 核心考点 ⭐</div><div class="body">
<div class="overview"><span class="ov-item star">导数=切线斜率=梯度</span><span class="ov-arrow">→</span><span class="ov-item">求导法则</span><span class="ov-arrow">→</span><span class="ov-item">偏导数→梯度向量</span><span class="ov-arrow">→</span><span class="ov-item star">链式法则→反向传播</span></div>
<div class="section"><h3>定义</h3><div class="fm-card"><div class="fm-main">dy/dx = Δy/Δx = 导数 = 斜率 = 梯度(Gradient)</div></div></div>
<div class="section"><h3>求导练习</h3><table><tr><th>#</th><th>原函数</th><th>步骤</th><th>结果</th></tr><tr><td>1</td><td>y=5+4x³</td><td>常数→0; 4x³→4·3·x²</td><td><strong>12x²</strong></td></tr><tr><td>2</td><td>y=4(2−x)²</td><td>链式：u=2−x→y=4u²→8u·(−1)</td><td><strong>−8(2−x)</strong></td></tr><tr><td>3</td><td>y=4(2−x)²+2(2−x)³</td><td>逐项求导相加</td><td><strong>−8(2−x)−6(2−x)²</strong></td></tr></table></div>
<div class="section"><h3>偏导数→梯度向量</h3><p>∂y/∂x₁=−8(2−x₁)，∂y/∂x₂=−6(2−x₂)²</p>
<div class="kp important"><strong>⭐ ML意义：</strong>n个参数→<strong>梯度向量</strong>∇L=[∂L/∂w₁,…,∂L/∂wₙ]。沿<strong>负梯度方向</strong>同步更新所有参数。求和符号下逐项求导：对x₃求偏导时i≠3的项全为0。</div></div>
<div class="section"><h3>链式法则 = 反向传播的数学基础</h3><div class="fm-card"><div class="fm-main">dy/dx = (dy/du)·(du/dx)</div></div>
<div class="kp important"><strong>⭐ 反向传播即链式法则的工程实现：</strong>∂L/∂w=∂L/∂y·∂y/∂z·∂z/∂w，从输出层向输入层逐层传递梯度。</div></div>
</div></div>

<div class="chapter" id="m-ch5"><div class="head"><span class="num">五</span>求和符号 Σ</div><div class="body">
<div class="overview"><span class="ov-item core">Σ=for+sum</span><span class="ov-arrow">→</span><span class="ov-item">误差平方和展开</span><span class="ov-arrow">→</span><span class="ov-item">逐项求偏导</span></div>
<div class="fm-card"><div class="fm-main">Σ(i=1→n) 2i = 2·1+2·2+…+2·n</div></div>
<pre>lst=[]; for i in range(1,n+1): lst.append(2*i); print(sum(lst))</pre>
<p>L=Σ(yᵢ−xᵢ)² → ∂L/∂xᵢ = <strong>−2(yᵢ−xᵢ)</strong></p>
</div></div>

<div class="chapter" id="m-ch6"><div class="head"><span class="num">六</span>综合应用——最小化损失函数</div><div class="body">
<div class="overview"><span class="ov-item">L=Σ(yᵢ−c)²</span><span class="ov-arrow">→</span><span class="ov-item">dL/dc求导</span><span class="ov-arrow">→</span><span class="ov-item">令导数为0</span><span class="ov-arrow">→</span><span class="ov-item star">c=(1/n)Σyᵢ(均值!)</span></div>
<div class="fm-card"><div class="fm-label">📌 四步推导</div><div class="fm-main">① dL/dc=−2Σ(yᵢ−c) ② =0 ③ Σyᵢ=nc ④ <strong>c=(1/n)·Σyᵢ</strong></div></div>
<div class="kp important"><strong>✨ 深刻结论：MSE损失下，最优常数预测 = 样本均值。</strong>R²=1−SS_res/SS_tot 的基准模型就是均值。无特征时最佳做法就是猜均值。</div>
</div></div>
`,

// ═══════════════════════ 机器学习 ═══════════════════════
'g-ml':`
<div class="book-header"><span class="icon">🤖</span><div><h1>机器学习</h1><div class="meta"><span>📄 ML概述上下·决策树·集成学习·聚类</span><span>🎯 核心算法体系</span></div></div></div>

<div class="chapter" id="u-ch1"><div class="head"><span class="num">Ch1</span>AI四大概念</div><div class="body">
<div class="overview"><span class="ov-item star">AI</span><span class="ov-arrow">⊃</span><span class="ov-item">ML</span><span class="ov-arrow">⊃</span><span class="ov-item">NN</span><span class="ov-arrow">⊃</span><span class="ov-item star">DL</span></div>
<table><tr><th>层级</th><th>概念</th><th>比喻</th><th>特征</th></tr><tr><td>1</td><td>AI 人工智能</td><td>爬行动物</td><td>最广泛智能目标</td></tr><tr><td>2</td><td>ML 机器学习</td><td>哺乳动物</td><td>从数据自动学习</td></tr><tr><td>3</td><td>NN 神经网络</td><td>灵长类</td><td>模拟神经元结构</td></tr><tr><td>4</td><td>DL 深度学习</td><td>人类</td><td>多层非线性特征提取</td></tr></table>
<p><strong>两种范式：</strong>基于规则(🧑人定·专家系统) vs 基于模型(🤖数据驱动·ML/DL)。传统ML(线性回归·随机森林·XGBoost)处理表格数据；DL(CNN·RNN·Transformer)处理图像/文本。</p>
</div></div>

<div class="chapter" id="u-ch2"><div class="head"><span class="num">Ch2</span>应用领域与发展史</div><div class="body">
<div class="overview"><span class="ov-item">CV 视觉</span><span class="ov-arrow">+</span><span class="ov-item">NLP 语言</span><span class="ov-arrow">+</span><span class="ov-item">数据挖掘</span><span class="ov-arrow">→</span><span class="ov-item star">8大领域</span><span class="ov-arrow">|</span><span class="ov-item">4阶段</span></div>
<table><tr><th>年代</th><th>阶段</th><th>里程碑</th></tr><tr><td>1950s-70s</td><td>🔣符号主义</td><td>1956 AI元年; 1962 跳棋胜人类</td></tr><tr><td>1980s-2000</td><td>📊统计主义</td><td>1993 SVM; 1997 深蓝胜卡斯帕罗夫</td></tr><tr><td>2000s-2016</td><td>🧠神经网络</td><td>2012 AlexNet(CV开山); 2016 AlphaGo</td></tr><tr><td>2017-今</td><td>🤖大语言模型</td><td>Transformer→BERT/GPT→ChatGPT→AIGC</td></tr></table>
<div class="kp important"><strong>⭐ 三要素：数据决定上限，算法逼近上限，算力决定速度。</strong>CPU(I/O密集)·GPU(计算密集·矩阵)·TPU(神经网络专用)。</div>
</div></div>

<div class="chapter" id="u-ch3"><div class="head"><span class="num">Ch3</span>数据相关术语</div><div class="body">
<div class="overview"><span class="ov-item">样本=行</span><span class="ov-arrow">→</span><span class="ov-item">特征=列(X)</span><span class="ov-arrow">→</span><span class="ov-item star">标签=预测目标(y)</span><span class="ov-arrow">→</span><span class="ov-item">回归(连续)vs分类(离散)</span></div>
<p><strong>特征分类：</strong>连续变量(可加减乘除·年龄)·离散变量(不可运算·出生地)·有序离散(学历·可用连续数值替换)。</p>
<p><strong>预处理三件套：</strong>标签编码(文字→整数·有序类别用)·独热编码(→二进制向量·<strong>无序类别必用</strong>·避免虚假序数关系)·归一化(缩至[0,1]·消量纲)。</p>
<div class="viz-box"><div class="viz-label">交互演示：混淆矩阵（点击方格调整TP/FP/FN/TN，实时计算准确率/精确率/召回率/F1）</div><div id="confusion-viz-container"></div></div>
</div></div>

<div class="chapter" id="u-ch4"><div class="head"><span class="num">Ch4</span>KNN 算法 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item star">①求距离</span><span class="ov-arrow">→</span><span class="ov-item star">②选K近邻</span><span class="ov-arrow">→</span><span class="ov-item star">③标签投票</span><span class="ov-arrow">→</span><span class="ov-item">无参数模型</span></div>
<div class="section"><h3>三步详解</h3><p>①求相似度：计算未知样本与所有已知样本的距离。②选K近邻：按距离排序取前K个。③标签投票：回归取<strong>平均值</strong>，分类取<strong>最常见值</strong>。</p></div>
<table><tr><th></th><th>欧式 Euclidean</th><th>曼哈顿 Manhattan</th><th>闵式 Minkowski</th></tr><tr><td>公式</td><td>√(Σ|x₁−x₂|²)</td><td>Σ|x₁−x₂|</td><td>(Σ|x₁−x₂|ᵖ)^(1/p)</td></tr><tr><td>直觉</td><td>直线(乌鸦飞)</td><td>街区(出租车)</td><td><strong>p=1→曼哈顿, p=2→欧式</strong></td></tr><tr><td>异常值</td><td>敏感(平方放大)</td><td>较鲁棒</td><td>p越大越敏感</td></tr></table>
<pre># KNN 电影分类示例
import math
new=[23,3,17]; kungfu=[39,0,31]  # 唐人街探案 vs 功夫熊猫
dist=math.sqrt((23-39)**2+(3-0)**2+(17-31)**2) # ≈21.47
# 9部电影全部计算距离→排序→取K=5→统计类型→预测</pre>
<div class="kp important"><strong>⭐ K小→过拟合(噪声敏感); K大→欠拟合(过度平滑)。</strong>CV选最优K。KNN无训练过程(懒学习)，预测时才计算→样本量大时慢。KNN是<strong>无参数模型</strong>——不需要训练。</div>
<div class="viz-box"><div class="viz-label">交互演示：KNN 决策边界（拖拽K值+点击移动测试点，观察分类结果变化）</div><div id="knnb-viz-container"></div></div>
</div></div>

<div class="chapter" id="u-ch5"><div class="head"><span class="num">Ch5</span>模型相关术语</div><div class="body">
<div class="overview"><span class="ov-item">算法(人定)</span><span class="ov-arrow">+</span><span class="ov-item">参数(机器学)</span><span class="ov-arrow">=</span><span class="ov-item star">模型</span><span class="ov-arrow">|</span><span class="ov-item">超参数(人调)</span></div>
<div class="fm-card"><div class="fm-main"><strong>模型 = 算法 + 参数</strong>（抽象算法+具体数据→估算出参数→具体模型）</div></div>
<div class="section"><h3>线性回归算法（第二个算法）<span class="tag-important">重点</span></h3>
<p><strong>完整表达：</strong>y = b₀ + b₁·x₁ + b₂·x₂ + ε（ε 是误差项，无法被特征解释的部分）</p>
<p><strong>分段表达：</strong>y_true = y_pred + error，其中 y_pred = b₀ + b₁·x₁ + b₂·x₂</p>
<p><strong>参数解读：</strong>b₀(截距)=所有特征为0时y的取值；b₁(斜率)=其他特征不变时，x₁每增加1，y对应的增加量。</p>
<p><strong>理解：</strong>利用<strong>特征</strong>与<strong>标签</strong>的线性关联关系，在<strong>已知特征</strong>的情况下，更好地<strong>预测标签</strong>。标签一定是<strong>连续变量</strong>；特征可以是<strong>连续变量</strong>也可以是<strong>离散变量</strong>。</p></div>
<div class="fm-card"><div class="fm-label">📌 线性模型公式集</div><div class="fm-main">简单：ŷ=b+wx | 多元：ŷ=b+Σwⱼxⱼ | 交互：y=b₀+b₁X₁+b₂X₂+b₃X₁X₂</div><div class="fm-sub">残差：e=y−ŷ | 完整：y=b₀+b₁x₁+b₂x₂+ε</div></div>
<p>手动创建非线性特征(x²,x³,logx,√x,x₁·x₂)→加入数据后用线性模型拟合非线性关系。<strong>超参数涵盖：</strong>数据准备(特征工程·特征选择)·模型设计(算法选择·架构设计)·模型训练(学习率·优化器·训练周期)。</p>
</div></div>

<div class="chapter" id="u-ch6"><div class="head"><span class="num">Ch6</span>梯度下降 <span class="tag-important">核心重点</span></div><div class="body">
<div class="overview"><span class="ov-item">损失函数L</span><span class="ov-arrow">→</span><span class="ov-item star">求梯度∇L</span><span class="ov-arrow">→</span><span class="ov-item star">W←W−α·∇</span><span class="ov-arrow">→</span><span class="ov-item">L逐渐减小</span></div>
<div class="section"><h3>核心公式</h3><div class="fm-card"><div class="fm-label">📌 参数更新</div><div class="fm-main"><strong>W<sub>new</sub> = W<sub>old</sub> − α·∇L(W<sub>old</sub>)</strong></div><div class="fm-sub">α=学习率(超参数) | ∇=梯度(当前权重处的导数)</div></div></div>
<div class="section"><h3>手算示例</h3><p>L=x²，当前x=10，α=0.001：dy/dx=2x=20(梯度)→x←10−0.02=<strong>9.98</strong>。x=−10：梯度=−20→x←−10+0.02=<strong>−9.98</strong>。无论起点，总往x=0靠近！</p></div>
<div class="viz-box"><div class="viz-label">交互演示：梯度下降（点击曲线设起点，自动播放观察收敛）</div><div id="gradient-viz-container"></div></div>
<table><tr><th>损失</th><th>公式</th><th>可导性</th><th>异常值</th><th>场景</th></tr><tr><td><strong>MAE</strong></td><td>(1/m)Σ|y−ŷ|</td><td>⚠️0处不可导</td><td>鲁棒</td><td>关注典型误差</td></tr><tr><td><strong>MSE</strong></td><td>(1/m)Σ(y−ŷ)²</td><td>✅处处可导</td><td>敏感</td><td>需惩罚大误差</td></tr><tr><td><strong>RMSE</strong></td><td>√MSE</td><td>可导但繁琐</td><td>敏感</td><td>与y同量纲</td></tr></table>
<div class="kp"><strong>RMSE≥MAE恒成立(柯西不等式)。</strong>误差[1,3]：MAE=2，RMSE=2.236。</div>
<pre># 梯度下降完整伪代码
w,b=初始值; α=0.001
for epoch in range(epochs):
    y_pred=w*X+b                  # ①前向
    loss=(1/m)*sum((y_pred-y)²)   # ②损失
    dw=(2/m)*sum((y_pred-y)*X)    # ③∂L/∂w
    db=(2/m)*sum(y_pred-y)        # ③∂L/∂b
    w-=α*dw; b-=α*db             # ④梯度下降
    # ⑤梯度≈0时收敛</pre>
</div></div>

<div class="chapter" id="u-ch7"><div class="head"><span class="num">Ch7</span>数据拆分与超参数</div><div class="body">
<div class="overview"><span class="ov-item star">训练80%</span><span class="ov-arrow">→</span><span class="ov-item">验证10%</span><span class="ov-arrow">→</span><span class="ov-item star">测试10%</span><span class="ov-arrow">|</span><span class="ov-item">CV交叉验证</span></div>
<table><tr><th>集</th><th>用途</th><th>占比</th><th>比喻</th></tr><tr><td>训练Training</td><td>学参数(梯度下降)</td><td>~80%</td><td>📝练习题</td></tr><tr><td>验证Validation</td><td>调超参/选模型/早停</td><td>~10%</td><td>📋模拟考</td></tr><tr><td>测试Testing</td><td>最终评估(仅一次!)</td><td>~10%</td><td>🎯考试</td></tr></table>
<div class="kp important"><strong>⚠️ 数据泄露=致命错误：</strong>测试集绝不可参与训练或调参。CV：K折轮流验证取均值，评估更稳定但计算量×K。<strong>性能指标</strong>(人看,越大越好)vs<strong>损失函数</strong>(机器看,越小越好,需可导)。</div>
<pre>from sklearn.model_selection import train_test_split
X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)
# 分类用分层抽样：stratify=y 保持标签比例</pre>
</div></div>

<div class="chapter" id="u-ch8"><div class="head"><span class="num">Ch8</span>拟合问题 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">欠拟合</span><span class="ov-arrow">→</span><span class="ov-item star">加复杂度</span><span class="ov-arrow">|</span><span class="ov-item">过拟合</span><span class="ov-arrow">→</span><span class="ov-item star">正则化</span><span class="ov-arrow">→</span><span class="ov-item">泛化能力</span></div>
<table><tr><th>状态</th><th>训练</th><th>测试</th><th>根因</th><th>解法</th></tr><tr><td>欠拟合</td><td>❌</td><td>❌</td><td>模型太简单/特征不足</td><td>加特征·加复杂度·加轮数</td></tr><tr><td>刚好</td><td>✅</td><td>✅</td><td>泛化强✨</td><td>—</td></tr><tr><td>过拟合</td><td>✅</td><td>❌</td><td>记忆力>泛化力</td><td>加数据·早停·正则化</td></tr></table>
<div class="section"><h3>L1 vs L2 正则化</h3><div class="fm-card"><div class="fm-main"><strong>L1(Lasso)：</strong>L+λΣ|w|→参数变<strong>零</strong>(稀疏/特征选择) | <strong>L2(Ridge)：</strong>L+λΣw²→参数<strong>接近零</strong>(收缩)</div></div>
<div class="viz-box"><div class="viz-label">交互演示：L1/L2正则化（点击切换，拖动λ观察权重收缩）</div><div id="l1l2-viz-container"></div></div></div>
<div class="kp important"><strong>🔑 调参黄金法则：先过拟合，再治过拟合。</strong>①诊断拟合状态→②往过拟合方向调(确保训练好)→③往正则化方向调(确保验证也好)。偏差(Bias·瞄不准→欠拟合) vs 方差(Variance·手抖→过拟合)。</div>
<div class="viz-box"><div class="viz-label">交互演示：过拟合 vs 欠拟合（拖拽多项式阶数，观察从欠拟合→刚好→过拟合的曲线变化）</div><div id="overfit-viz-container"></div></div>
</div></div>

<div class="divider"><span>▼ 决策树 & 集成学习 & 聚类 ▼</span></div>

<div class="chapter" id="d-ch1"><div class="head"><span class="num">决策树</span>Decision Tree</div><div class="body">
<div class="overview"><span class="ov-item">根节点</span><span class="ov-arrow">→</span><span class="ov-item star">递归分裂</span><span class="ov-arrow">→</span><span class="ov-item">叶节点=预测值</span><span class="ov-arrow">|</span><span class="ov-item">Gini/MSE</span></div>
<p>决策树通过<strong>递归二分</strong>构建，每次选择<strong>最能降低不纯度</strong>的特征和阈值分裂。分类树用<strong>Gini</strong>(=1−Σpₖ²)，回归树用<strong>MSE</strong>。叶节点输出：分类→最多类别，回归→样本均值。</p>
<div class="kp"><strong>关键特性——无随机性：</strong>同一数据+同一算法=同一棵树。这就是随机森林必须随机抽样的原因。决策树能力上限低→需要集成学习提升。</div>
<div class="viz-box"><div class="viz-label">交互演示：决策树分裂过程（点击"分裂一步"观察特征空间如何被递归二分）</div><div id="dtree-viz-container"></div></div>
</div></div>

<div class="chapter" id="d-ch2"><div class="head"><span class="num">集成学习</span> <span class="tag-important">核心进阶</span></div><div class="body">
<div class="overview"><span class="ov-item star">Bagging</span><span class="ov-arrow">→</span><span class="ov-item">随机森林</span><span class="ov-arrow">|</span><span class="ov-item star">Boosting</span><span class="ov-arrow">→</span><span class="ov-item">GBDT</span><span class="ov-arrow">→</span><span class="ov-item">XGBoost</span></div>
<div class="section"><h3>Bagging vs Boosting</h3><table><tr><th></th><th>Bagging</th><th>Boosting</th></tr><tr><td>样本</td><td>有放回抽样部分</td><td>使用全部样本</td></tr><tr><td>学习</td><td>并行(各树独立)</td><td>串行(后树依赖前树)</td></tr><tr><td>投票</td><td>平权投票</td><td>加权投票</td></tr><tr><td>代表</td><td>随机森林</td><td>GBDT/XGBoost</td></tr></table></div>
<div class="section"><h3>随机森林 Random Forest</h3><p>①有放回抽样<strong>样本</strong>→②无放回抽样<strong>特征</strong>(默认√特征数)→③建CART树→④重复K次→⑤平权投票。有放回=不改变概率分布，√特征数=平衡随机性和利用率。</p></div>
<div class="section"><h3>GBDT 梯度提升<span class="tag-important">重点</span></h3>
<div class="fm-card"><div class="fm-label">📌 本质：拟合负梯度（残差），而非原始y值</div><div class="fm-main">新预测=当前预测+<strong>残差</strong> ⇔ W<sub>new</sub>=W<sub>old</sub>−<strong>梯度</strong></div></div>
<p><strong>MSE损失下负梯度=残差：</strong>L=Σ(y−ŷ)²→∂L/∂ŷ=−2(y−ŷ)。所以预测负梯度=预测残差。</p>
<pre>y_pred=mean(y_true)  # 初始：全部预测=均值
for t in range(T):   # T棵树
    residual=y_true-y_pred        # 残差
    tree_t.fit(X,residual)        # 新树预测残差!
    y_pred+=lr*tree_t.predict(X)  # 累加修正</pre>
<div class="kp important"><strong>⭐ 梯度提升=梯度下降的本质统一：</strong>梯度下降=一个模型逐步降损失；梯度提升=多个模型逐步增性能。都是沿负梯度方向迭代优化！</div></div>
<div class="section"><h3>XGBoost</h3><div class="fm-card"><div class="fm-main">①泰勒二阶展开近似损失(更准) | ②正则化Ω=γ·叶子数+½λ·Σw²(小步快跑：9²=81 vs 3×3²=27)</div></div></div>
</div></div>

<div class="chapter" id="d-ch3"><div class="head"><span class="num">聚类</span>K-Means</div><div class="body">
<div class="overview"><span class="ov-item">选K中心</span><span class="ov-arrow">→</span><span class="ov-item">就近分配</span><span class="ov-arrow">→</span><span class="ov-item star">重算中心</span><span class="ov-arrow">→</span><span class="ov-item">迭代至收敛</span></div>
<div class="viz-box"><div class="viz-label">交互演示：K-Means 逐步聚类</div><div id="kmeans-viz-container"></div></div>
<p><strong>应用举例：</strong>问卷调查/新闻聚类·广告推荐·异常检测。<strong>分类vs聚类：</strong>分类有确定类别数；聚类无——聚类数量取决于<strong>颗粒度</strong>(如生物进化树)和<strong>后续使用效果</strong>。</p>
<p><strong>选K方法：</strong>①<strong>肘方法+SSE：</strong>K=1时SSE最大，K=样本量时SSE=0。随着K增加SSE减小，找减小速率<strong>突然减缓的肘部K值</strong>。②<strong>轮廓系数/SC系数：</strong>∈[−1,1]，越大越好，负数无法使用，越接近1聚类越合理。</p>
</div></div>
`,

// ═══════════════════════ 深度学习 ═══════════════════════
'g-dl':`
<div class="book-header"><span class="icon">🧠</span><div><h1>深度学习</h1><div class="meta"><span>📄 DL基础·CNN·RNN</span><span>🎯 神经网络核心组件</span></div></div></div>

<div class="chapter" id="l-ch1"><div class="head"><span class="num">Ch1</span>深度学习概念与网络构成</div><div class="body">
<div class="overview"><span class="ov-item star">X@W+b</span><span class="ov-arrow">→</span><span class="ov-item">激活函数</span><span class="ov-arrow">→</span><span class="ov-item star">堆叠多层</span><span class="ov-arrow">→</span><span class="ov-item">自动提取特征</span></div>
<p>深度学习=多层神经网络，<strong>自动提取特征</strong>。特点：自动特征提取·非线性变换·需大量数据+算力·解释性差。</p>
<div class="section"><h3>生物神经元→人工神经元 <span class="tag-important">基础</span></h3>
<p><strong>生物神经网络：</strong>①<strong>多元输入，多元输出</strong>——多特征输入，多新特征输出；②<strong>选择输入，判定输出</strong>——加权输入（线性加权求和），激活函数（存在"压弯"的点，决定是否激活）。人工神经元正是模拟了这个过程。</p></div>
<div class="section"><h3>逻辑回归→全连接神经网络</h3>
<p><strong>逻辑回归 = 线性回归 + 激活函数：</strong>线性回归 z = X@W + b（z值=logits=内部状态值）；激活函数 h = f(z) = sigmoid(z)（f(z)又称挤压方程）。</p>
<p><strong>多项逻辑回归：</strong>预测值是离散多分类变量时，输出层用 Softmax。<strong>全连接神经网络 = 多项逻辑回归 + 至少有一层隐藏层。</strong></p></div>
<div class="fm-card"><div class="fm-label">📌 全连接层 = 多项逻辑回归</div><div class="fm-main">z=X·W+b(线性变换) → h=f(z)(激活函数,引入非线性)</div></div>
<p><strong>网络层数</strong>=隐藏层数+1。<strong>神经元个数</strong>=输入个数M(不加截距对应的神经元)+输出个数N。<strong>参数量</strong>=(M+1)×N。<strong>发展里程碑：</strong>1956 AI元年→2012 AlexNet(CV超越统计模型>10%)→2015 ResNet(首次>100层)→2017 Transformer→2018 GPT-1/BERT→2022 ChatGPT→2024 DeepSeek-V3(开源追平闭源)。</p>
<div class="viz-box"><div class="viz-label">交互演示：神经网络前向传播（3→4→2网络，点击观察数据流）</div><div id="nn-forward-viz-container"></div></div>
</div></div>

<div class="chapter" id="l-ch2"><div class="head"><span class="num">Ch2</span>激活函数 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">Sigmoid</span><span class="ov-arrow">→</span><span class="ov-item">Tanh</span><span class="ov-arrow">→</span><span class="ov-item star">ReLU</span><span class="ov-arrow">→</span><span class="ov-item">LeakyReLU</span><span class="ov-arrow">→</span><span class="ov-item">GELU/SwiGLU</span></div>
<table><tr><th>函数</th><th>公式</th><th>导数</th><th>优点</th><th>场景</th></tr><tr><td><strong>Sigmoid</strong></td><td>1/(1+e⁻ᶻ)</td><td>σ(1−σ)∈[0,0.25]</td><td>输出=概率</td><td>二分类输出</td></tr><tr><td><strong>Tanh</strong></td><td>(eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)</td><td>1−tanh²∈[0,1]</td><td>0中心;梯度更大</td><td>RNN隐藏层</td></tr><tr><td><strong>ReLU</strong></td><td>max(0,z)</td><td>0或1</td><td>计算快;z>0全可导</td><td><strong>隐藏层首选</strong></td></tr><tr><td><strong>LeakyReLU</strong></td><td>max(az,z),a≈0.01</td><td>a或1</td><td>全定义域可导</td><td>替代ReLU</td></tr><tr><td><strong>Softmax</strong></td><td>eᶻ/Σeᶻ</td><td>—</td><td>输出=概率分布</td><td>多分类输出</td></tr></table>
<div class="viz-box"><div class="viz-label">交互演示：激活函数对比</div><div id="activation-viz-container"></div></div>
<div class="section"><h3>各函数详细参数（定义域/值域/导数）</h3>
<table><tr><th>函数</th><th>定义域</th><th>有效取值范围</th><th>值域</th><th>导数值域</th></tr>
<tr><td><strong>Sigmoid</strong></td><td>(−∞,+∞)</td><td>(−6,6)·特别(−3,3)</td><td>[0,1]</td><td>[0,0.25]</td></tr>
<tr><td><strong>Tanh</strong></td><td>(−∞,+∞)</td><td>(−3,3)</td><td>[−1,1]</td><td>[0,1]</td></tr>
<tr><td><strong>ReLU</strong></td><td>(−∞,+∞)</td><td>(0,+∞) z>0全部可导</td><td>[0,+∞)</td><td>0 或 1</td></tr>
<tr><td><strong>LeakyReLU</strong></td><td>(−∞,+∞)</td><td>(−∞,+∞) 全定义域可导</td><td>(−∞,+∞)</td><td>a 或 1</td></tr></table>
<p><strong>改进链（每代改进动机→改进之处→遗留问题）：</strong>Sigmoid(梯度太小0.25)→Tanh(梯度↑1.0, 但有效域缩小[−6,6]→[−3,3])→ReLU(有效域↑(0,∞), 但z<0梯度=0死区)→LeakyReLU(全定义域可导, 但0处不可导)。</p></div>
<div class="section"><h3>PReLU & SwiGLU</h3>
<p><strong>PReLU（Parametric ReLU）：</strong>与 LeakyReLU 相同形式 h=max(az,z)，但 a 是<strong>可学习参数</strong>（通过反向传播更新），而非固定值。<strong>SwiGLU：</strong>h = z·σ(z) = 原始激活数值×门控调整。Llama 等现代 LLM 使用。GELU：h = z·Φ(z) ≈ z·σ(1.702z)，GPT/Transformer 常用。</p>
<div class="kp important"><strong>⭐ 为什么必须非线性？</strong>多层线性=一层线性。<strong>隐藏层：ReLU > Tanh > Sigmoid。</strong>输出层：二分类→Sigmoid，多分类→Softmax(dim=−1)。</div>
<div class="viz-box"><div class="viz-label">交互演示：Softmax 温度调节（拖拽温度T，观察概率分布从尖锐→平滑的变化）</div><div id="softmax-viz-container"></div></div>
</div></div>

<div class="chapter" id="l-ch3"><div class="head"><span class="num">Ch3</span>参数初始化 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">z=X@W太大</span><span class="ov-arrow">→</span><span class="ov-item">落入饱和区</span><span class="ov-arrow">→</span><span class="ov-item">梯度=0→无法更新</span><span class="ov-arrow">→</span><span class="ov-item star">好初始化=生命线</span></div>
<div class="section"><h3>为什么需要初始化？</h3>
<p>因为 <strong>z = X @ W</strong>，X 或 W 任意一个太大 → z 过大 → 落入激活函数的<strong>饱和区间</strong>（有效区间之外）→ 梯度为0 → 权重永远不会更新。好的初始化让 z 落在激活函数的<strong>有效范围内</strong>。</p>
<div class="kp important"><strong>⭐ 前提假设：</strong>特征 X 已被标准化，即 mean(X)=0 且 std(X)=Var(X)=1。</div></div>

<div class="section"><h3>三大类初始化方法</h3>
<h4>① 固定值初始化（常数初始化）<span class="tag-important">基础</span></h4>
<table><tr><th>方式</th><th>说明</th><th>问题</th></tr>
<tr><td><strong>全零初始化</strong></td><td>W 全部设为 0</td><td>❌ 所有神经元输出相同→梯度相同→无法差异化学习（对称性问题）</td></tr>
<tr><td><strong>全一初始化</strong></td><td>W 全部设为 1</td><td>❌ 同样对称性问题，且 z 可能过大</td></tr>
<tr><td><strong>固定值初始化</strong></td><td>W 设为某个常数 c</td><td>❌ 同上，仅在某些特殊场景使用</td></tr></table>
<div class="kp"><strong>结论：固定值初始化一般不用于权重W</strong>（对称性破坏训练），但偏置 b 通常初始化为 0。</div>

<h4>② 随机分布初始化 <span class="tag-important">重点</span></h4>
<table><tr><th>分布</th><th>范围</th><th>说明</th></tr>
<tr><td><strong>标准均匀分布</strong></td><td>U[0, 1]</td><td>值在 [0,1] 均匀分布，但 z 可能偏大</td></tr>
<tr><td><strong>标准正态分布</strong></td><td>N(μ=0, σ=1)</td><td>均值0标准差1，但未考虑输入维度</td></tr>
<tr><td><strong>有范围均匀分布</strong></td><td>U[−limit, limit]</td><td><strong>limit = 1/√d</strong>（d=输入维度dim_input）</td></tr></table>
<div class="fm-card"><div class="fm-label">📌 为什么是 1/√d？</div><div class="fm-main">z = Σwᵢxᵢ = w₁x₁ + w₂x₂ + … + w_d·x_d（d个特征加权求和）</div><div class="fm-sub">特征越多 → z 值越大 → 落入饱和区。统计学调整：基于<strong>方差除以d</strong>，基于<strong>标准差除以√d</strong>。用 1/√d 缩放可以保持 z 的方差稳定，防止 z 过大。</div></div>

<h4>③ Xavier 初始化 & Kaiming 初始化 <span class="tag-important">核心</span></h4>
<table><tr><th>方法</th><th>专为谁设计</th><th>分布</th><th>关键参数</th><th>PyTorch API</th></tr>
<tr><td><strong>Xavier</strong></td><td>Tanh / Sigmoid</td><td>U[−L,L] 或 N(0,σ²)</td><td>L = √(6/(fan_in+fan_out))</td><td><code>nn.init.xavier_uniform_</code><br><code>nn.init.xavier_normal_</code></td></tr>
<tr><td><strong>Kaiming</strong></td><td>ReLU / LeakyReLU / PReLU</td><td>U[−L,L] 或 N(0,σ²)</td><td>L = √(6/fan_in)</td><td><code>nn.init.kaiming_uniform_(a=0)</code><br><code>nn.init.kaiming_normal_(a=0)</code></td></tr></table>
<p><strong>a 参数：</strong>PReLU 的负值斜率。ReLU 时 a=0，LeakyReLU 时 a≈0.01，PReLU 时 a 为可学习参数。</p>
<p><strong>注意：</strong>Xavier 和 Kaiming 都<strong>忽略偏置</strong>（偏置单独初始化为0），只初始化权重 W。</p>
<pre># PyTorch 初始化示例
linear = nn.Linear(128, 64)

# Xavier（Tanh网络推荐）
nn.init.xavier_uniform_(linear.weight)
nn.init.zeros_(linear.bias)

# Kaiming（ReLU网络推荐）
nn.init.kaiming_uniform_(linear.weight, mode='fan_in', nonlinearity='relu')
nn.init.zeros_(linear.bias)

# PyTorch 默认初始化：Linear 层自动使用 Kaiming uniform</pre>
<div class="kp important"><strong>⭐ 总结——选择指南：</strong>激活用 Tanh/Sigmoid → Xavier；激活用 ReLU/变体 → Kaiming(a=0)；偏置 b → 全0初始化；<strong>PyTorch 的 nn.Linear 默认已使用 Kaiming 初始化</strong>，一般无需手动设置。</div>
</div></div>

<div class="chapter" id="l-ch4"><div class="head"><span class="num">Ch4</span>优化方法 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">SGD</span><span class="ov-arrow">→</span><span class="ov-item">Momentum(梯度)</span><span class="ov-arrow">→</span><span class="ov-item">AdaGrad(学习率)</span><span class="ov-arrow">→</span><span class="ov-item">RMSProp(β改进)</span><span class="ov-arrow">→</span><span class="ov-item star">Adam(两者结合)</span></div>

<div class="section"><h3>指数加权平均——所有改进方法的基础 <span class="tag-important">核心</span></h3>
<div class="fm-card"><div class="fm-label">📌 公式</div><div class="fm-main"><strong>Sₜ = β·Sₜ₋₁ + (1−β)·Yₜ</strong></div><div class="fm-sub">初始化：S₀ = Y₀（Momentum）或 S₀ = 0（AdaGrad/RMSProp/Adam）</div></div>
<p><strong>β = 0.9（默认值）：</strong>给历史较大的权重。<strong>有效窗口 ≈ 1/(1−β)：</strong>β=0.9→≈10个点；β=0.99→≈100个点。当权重小于 1% 时忽略影响，历史窗口大约=44（实际是所有历史的加权平均，但有效窗口约44）。</p></div>

<div class="section"><h3>五大优化器对比</h3>
<table><tr><th>优化器</th><th>优化对象</th><th>初始化</th><th>核心改进</th><th>问题</th></tr>
<tr><td><strong>SGD</strong></td><td>—</td><td>—</td><td>W←W−α·∇（基础梯度下降）</td><td>震荡大，收敛慢</td></tr>
<tr><td><strong>Momentum</strong></td><td>梯度方向</td><td>S₀=G₀（第一个梯度值）</td><td>指数加权平均平滑梯度方向（像惯性小球）</td><td>—</td></tr>
<tr><td><strong>AdaGrad</strong></td><td>学习率</td><td>S₀=0</td><td>自适应调整学习率：大梯度→小步，小梯度→大步</td><td>St单调递增→后期学习率过小→无法继续学习</td></tr>
<tr><td><strong>RMSProp</strong></td><td>学习率</td><td>S₀=0</td><td><strong>唯一改进：重新引入β</strong>，避免St单调递增</td><td>—</td></tr>
<tr><td><strong>Adam ⭐</strong></td><td>梯度+学习率</td><td>S₀=0, M₀=0</td><td>Momentum(平滑梯度)+RMSProp(自适应学习率)+<strong>偏差修正</strong></td><td>—</td></tr></table>
<div class="kp important"><strong>⭐ Adam 的偏差修正：</strong>M₀=0, S₀=0 导致初期数值偏小，需要除以 (1−βᵗ) 修正回正常值（等效于从 G₀ 初始化）。<strong>Adam = 默认首选。</strong>lr=0.001 + betas=(0.9, 0.999)。</div></div>

<div class="section"><h3>学习率的重要性</h3>
<p><strong>过小：</strong>步长太小→收敛太慢（需很多轮）。<strong>过大（良性）：</strong>震荡下降，模型勉强可用。<strong>过大（恶性）：</strong>超过临界值→震荡上升→梯度爆炸→训练失败。</p>
<p><strong>学习率衰减方法：</strong></p>
<table><tr><th>方法</th><th>PyTorch</th><th>参数</th></tr>
<tr><td><strong>等间隔衰减</strong></td><td><code>lr_scheduler.StepLR(optimizer, step_size=50, gamma=0.5)</code></td><td>每50步×0.5</td></tr>
<tr><td><strong>指定间隔衰减</strong></td><td><code>lr_scheduler.MultiStepLR(optimizer, milestones=[50,125,160], gamma=0.5)</code></td><td>在50/125/160步×0.5</td></tr>
<tr><td><strong>指数衰减</strong></td><td><code>lr_scheduler.ExponentialLR(optimizer, gamma=0.5)</code></td><td>每步×0.5</td></tr></table>
<div class="kp"><strong>三者本质都是指数衰减</strong>，区别在等待步数不同。通常<strong>按轮次</strong>衰减（gamma 不会太大，如 0.5/0.9）。常用初始学习率=0.001。</div>
<div class="viz-box"><div class="viz-label">交互演示：学习率对比（同一函数、同一起点，三种学习率同时跑50步）</div><div id="lrcompare-viz-container"></div></div>
</div></div>

<div class="chapter" id="l-ch5"><div class="head"><span class="num">Ch5</span>正则化——防过拟合三件套</div><div class="body">
<div class="overview"><span class="ov-item star">Dropout</span><span class="ov-arrow">+</span><span class="ov-item star">BatchNorm</span><span class="ov-arrow">+</span><span class="ov-item star">L1/L2</span><span class="ov-arrow">→</span><span class="ov-item">泛化能力↑</span></div>
<div class="section"><h3>Dropout 随机失活</h3><div class="fm-card"><div class="fm-main">训练时：神经元概率p<strong>失活</strong>(置0)，存活者×1/(1−p)补偿 | 测试时：<strong>不生效</strong></div></div><p>每次训练在<strong>随机子网络</strong>上更新→等价于训练指数级数量不同网络后集成。</p><div class="viz-box"><div class="viz-label">交互演示：Dropout（切换训练/推理+调节p，观察神经元失活）</div><div id="dropout-viz-container"></div></div></div>
<div class="section"><h3>Batch Normalization</h3><div class="fm-card"><div class="fm-main">①标准化(去单位化)→②重构(缩放γ+平移β，<strong>可学习参数</strong>)</div></div><p>解决<strong>内部协变量偏移</strong>，加速收敛，稳定权重。nn.BatchNorm2d/BatchNorm1d。</p></div>
</div></div>

<div class="divider"><span>▼ CNN 卷积神经网络 ▼</span></div>

<div class="chapter" id="c-ch1"><div class="head"><span class="num">CNN-1</span>概述</div><div class="body">
<div class="overview"><span class="ov-item star">卷积层</span><span class="ov-arrow">→</span><span class="ov-item">ReLU</span><span class="ov-arrow">→</span><span class="ov-item star">池化层</span><span class="ov-arrow">→</span><span class="ov-item">全连接→输出</span></div>
<p>CNN=含<strong>卷积层</strong>的神经网络。三大优势：<strong>局部连接</strong>(感受野)·<strong>权重共享</strong>(参数量暴减)·<strong>平移不变性</strong>。图像表示：H×W×C。</p>
</div></div>

<div class="chapter" id="c-ch2"><div class="head"><span class="num">CNN-2</span>卷积层 —— CNN 的核心 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">输入 H×W×C</span><span class="ov-arrow">→</span><span class="ov-item star">卷积核 K×K×C</span><span class="ov-arrow">→</span><span class="ov-item">局部点积求和</span><span class="ov-arrow">→</span><span class="ov-item star">输出特征图</span></div>

<div class="section"><h3>卷积运算本质</h3>
<p>卷积运算 = <strong>卷积核（滤波器）</strong>与<strong>输入数据的局部区域</strong>之间做<strong>点积运算</strong>。卷积核在输入图像上滑动，每次与覆盖区域逐元素相乘再求和，产生特征图上一个像素值。</p>
<p><strong>卷积层的四大作用：</strong>① <strong>提取特征</strong>——从低级（边缘/角点/纹理）到高级（形状/物体部件）；② <strong>局部连接</strong>——每个神经元只看一小块区域（感受野），符合图像空间结构；③ <strong>空间不变性</strong>——同一卷积核扫全图，无论物体在哪个位置都能检测；④ <strong>权重共享</strong>——同一卷积核的参数在整个图像上共享，参数量暴减。</p></div>

<div class="section"><h3>核心参数详解</h3>
<table><tr><th>参数</th><th>含义</th><th>常用值</th><th>作用</th></tr>
<tr><td><strong>kernel_size (F)</strong></td><td>卷积核高/宽</td><td>3×3, 5×5, 7×7</td><td>越大→感受野越大但参数越多。3×3 最常用</td></tr>
<tr><td><strong>padding (P)</strong></td><td>边缘补零圈数</td><td>0, 1, 2…</td><td>保持输出尺寸不变(Same Padding: P=(F−1)/2 当S=1)；保留边缘像素信息</td></tr>
<tr><td><strong>stride (S)</strong></td><td>滑动步长</td><td>1, 2</td><td>越大→特征图越小→计算量↓、感受野↑</td></tr>
<tr><td><strong>in_channels</strong></td><td>输入通道数</td><td>RGB=3</td><td>必须匹配输入数据的通道数</td></tr>
<tr><td><strong>out_channels</strong></td><td>输出通道数(=卷积核个数)</td><td>32, 64, 128…</td><td>每个卷积核学习一种特征模式</td></tr></tbody></table></div>

<div class="fm-card"><div class="fm-label">📌 特征图大小公式</div><div class="fm-main"><strong>N = 1 + (W + 2P − F) / S</strong></div><div class="fm-sub">例：输入 32×32，F=3, P=1, S=1 → N=1+(32+2−3)/1=<strong>32</strong>（Same Padding，尺寸不变）<br>例：输入 32×32，F=3, P=0, S=2 → N=1+(32+0−3)/2=<strong>15</strong>（尺寸减半）</div></div>

<div class="section"><h3>多通道卷积</h3>
<p><strong>单卷积核多通道：</strong>一个 3×3 卷积核在 RGB 3 通道上各有独立的 3×3 权重，对每个通道分别卷积后<strong>求和</strong>，产生<strong>1个</strong>输出通道。参数量 = F×F×C_in。</p>
<p><strong>多卷积核：</strong>使用 K 个卷积核（每个都有 F×F×C_in 个参数），产生 K 个输出通道。<strong>总参数量 = (F×F×C_in + 1) × C_out</strong>（+1 是每个卷积核的偏置）。</p>
<p>例：3×3 卷积，RGB(3通道)→64通道：参数量 = (9×3+1)×64 = <strong>1,792</strong> 个参数。对比全连接层（32×32×3→64 需要 196,672 个参数）——卷积层的参数效率极高。</p>

<div class="viz-box"><div class="viz-label">交互演示：卷积核滑动（垂直边缘检测核，5×5→3×3特征图）</div><div id="cnn-viz-container"></div></div>

<div class="section"><h3>Padding——为什么需要边缘补零？</h3>
<p>① <strong>保持空间维度：</strong>不做 Padding，每次卷积特征图都会缩小。多层卷积后特征图会变得非常小，丢失重要边缘信息。</p>
<p>② <strong>保留边缘信息：</strong>图像边缘的像素参与卷积次数少于中心像素→边缘信息容易被"洗掉"。Padding 增加边缘像素的参与度。</p>
<p><strong>Same Padding 条件：</strong>当 Stride=1 时，P = (F−1)/2 可使输出尺寸=输入尺寸。例：F=3→P=1；F=5→P=2。</p></div>

<div class="section"><h3>Stride——步长的权衡</h3>
<p><strong>Stride=1：</strong>细粒度特征提取，计算量大，特征图大——通常用于<strong>浅层</strong>。</p>
<p><strong>Stride=2：</strong>降低计算量、增大感受野、减小特征图——相当于<strong>下采样</strong>，通常用于替代池化层。</p>
<p><strong>感受野 = 输出像素映射回输入图像的覆盖范围。</strong>Stride 越大，感受野越大——每个神经元能捕捉更大范围的输入信息。</p></div>

<div class="section"><h3>层级特征提取</h3>
<p><strong>浅层卷积核 →</strong> 边缘、角点、纹理（低级特征）。<strong>中层卷积核 →</strong> 形状、局部结构。 <strong>深层卷积核 →</strong> 物体部件、完整物体（高级特征）。堆叠越深，特征越抽象，感受野越大。</p>
<pre>conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, stride=1, padding=1)
# 输入 (B, 3, 32, 32) → 输出 (B, 64, 32, 32)   Same Padding</pre>
</div></div>

<div class="chapter" id="c-ch3"><div class="head"><span class="num">CNN-3</span>池化层</div><div class="body">
<div class="overview"><span class="ov-item">特征图</span><span class="ov-arrow">→</span><span class="ov-item star">MaxPool/AvgPool</span><span class="ov-arrow">→</span><span class="ov-item">降维+保留关键信息</span></div>
<p>降低空间维度，减计算量，增鲁棒性。<strong>对每个通道分别池化</strong>，通道数不变。nn.MaxPool2d(2,stride=2)/nn.AvgPool2d(2,stride=2)。</p>
	<div class="viz-box"><div class="viz-label">交互演示：池化层（MaxPool / AvgPool 切换，步进观察 2×2 窗口如何在 4×4 特征图上滑动压缩）</div><div id="pooling-viz-container"></div></div>
</div></div>

<div class="chapter" id="c-ch4"><div class="head"><span class="num">CNN-4</span>CIFAR10 图像分类实战</div><div class="body">
<div class="overview"><span class="ov-item">Conv1(3→6)</span><span class="ov-arrow">→</span><span class="ov-item">Pool1</span><span class="ov-arrow">→</span><span class="ov-item">Conv2(6→16)</span><span class="ov-arrow">→</span><span class="ov-item">Pool2</span><span class="ov-arrow">→</span><span class="ov-item star">FC→10类</span></div>
<p>CIFAR10：5万训练+1万测试，10类，32×32×3。CNN结构→CrossEntropyLoss+Adam(lr=0.001)+100epochs→Acc≈57%。优化方向：增加通道数(6→32,16→64)+加BN/Dropout+调lr。</p>
<pre>class ImageClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1=nn.Conv2d(3,6,3); self.pool1=nn.MaxPool2d(2,2)
        self.conv2=nn.Conv2d(6,16,3); self.pool2=nn.MaxPool2d(2,2)
        self.fc1=nn.Linear(16*8*8,120); self.fc2=nn.Linear(120,84)
        self.out=nn.Linear(84,10)
    def forward(self,x):
        x=self.pool1(torch.relu(self.conv1(x)))
        x=self.pool2(torch.relu(self.conv2(x)))
        x=x.reshape(x.size(0),-1)
        x=torch.relu(self.fc1(x)); x=torch.relu(self.fc2(x))
        return self.out(x)</pre>
</div></div>

<div class="divider"><span>▼ RNN 循环神经网络 ▼</span></div>

<div class="chapter" id="r-ch1"><div class="head"><span class="num">RNN-1</span>RNN 原理 <span class="tag-important">核心重点</span></div><div class="body">
<div class="overview"><span class="ov-item">xₜ(当前输入)</span><span class="ov-arrow">+</span><span class="ov-item">hₜ₋₁(历史记忆)</span><span class="ov-arrow">→</span><span class="ov-item star">hₜ=tanh(W·hₜ₋₁+U·xₜ+b)</span><span class="ov-arrow">→</span><span class="ov-item">yₜ=softmax(V·hₜ+bᵧ)</span></div>

<div class="section"><h3>RNN 的核心思想 <span class="tag-important">重点</span></h3>
<p>RNN（Recurrent Neural Network，循环神经网络）是一种<strong>专门处理序列数据</strong>的神经网络。与传统前馈网络的最大区别：具有<strong>循环结构</strong>，能够处理和记住前面时间步的信息。序列数据的特点：<strong>后面的数据跟前面的数据有关系</strong>（如文字序列、时间序列）。</p>
<p><strong>RNN 的应用场景：</strong>时间序列预测（股市/气象/传感器）· 自然语言处理（文本生成/机器翻译/情感分析）· 语音识别 · 音乐生成。</p>
</div>

<div class="section"><h3>RNN 核心公式推导 <span class="tag-important">重点</span></h3>
<p>RNN 的每次计算涉及<strong>三个权重矩阵</strong>：</p>
<table><tr><th>符号</th><th>含义</th><th>作用</th></tr>
<tr><td><strong>W (W_ih)</strong></td><td>输入→隐藏的权重矩阵</td><td>处理当前输入 xₜ</td></tr>
<tr><td><strong>U (W_hh)</strong></td><td>隐藏→隐藏的权重矩阵</td><td>处理历史状态 hₜ₋₁</td></tr>
<tr><td><strong>V (W_ho)</strong></td><td>隐藏→输出的权重矩阵</td><td>从隐藏状态生成输出</td></tr></table>

<div class="fm-card"><div class="fm-label">📌 隐藏状态更新（核心公式）</div>
<div class="fm-main"><strong>hₜ = tanh(W·hₜ₋₁ + U·xₜ + bₕ)</strong></div>
<div class="fm-sub">更常见的写法：<strong>hₜ = tanh(W_h·[hₜ₋₁, xₜ] + bₕ)</strong>（拼接后一次矩阵乘）</div></div>

<div class="fm-card"><div class="fm-label">📌 输出计算</div>
<div class="fm-main"><strong>oₜ = Wₒ·hₜ + bₒ</strong>（当前时刻的logits输出）&emsp;→&emsp; <strong>yₜ = softmax(oₜ)</strong>（转为概率分布）</div>
<div class="fm-sub">yₜ 是一个概率向量：词汇表有多少个词，yₜ 就有多少个元素，最大概率位置对应的词就是当前时刻预测生成的词。</div></div>
</div>

<div class="section"><h3>隐藏状态 hₜ 的三大作用</h3>
<p>① <strong>记忆功能：</strong>hₜ 是 RNN 的历史记忆。新输入 xₜ 结合旧状态 hₜ₋₁ 生成新状态 hₜ。② <strong>前文理解：</strong>hₜ 携带的历史信息用于理解上下文（语言模型/机器翻译的关键）。③ <strong>串联时序：</strong>hₜ 通过网络内部的循环连接将各时间步串联，使网络能处理长序列。</p>

<div class="section"><h3>四种应用模式</h3>
<table><tr><th>模式</th><th>输入→输出</th><th>场景</th><th>示例</th></tr>
<tr><td><strong>一对多</strong></td><td>1个输入→多个输出</td><td>文本生成</td><td>"分手"→生成50字歌词</td></tr>
<tr><td><strong>多对一</strong></td><td>多个输入→1个输出</td><td>文本分类/情感分析</td><td>一句话→正面/负面</td></tr>
<tr><td><strong>多对多(对齐)</strong></td><td>等长输入输出</td><td>命名实体识别NER</td><td>每个词→实体标签</td></tr>
<tr><td><strong>多对多(非对齐)</strong></td><td>不等长输入输出</td><td>机器翻译</td><td>中文句子→英文句子</td></tr></tbody></table>
	
	<div class="viz-box"><div class="viz-label">交互演示：RNN 四种应用模式（点击切换一对多/多对一/多对多对齐/多对多非对齐）</div><div id="rnnmodes-viz-container"></div></div>
	
	<div class="viz-box"><div class="viz-label">交互演示：RNN 时间步展开（点击推进观察 hₜ = tanh(W·hₜ₋₁ + U·xₜ + b) 的数据流动）</div><div id="rnn-viz-container"></div></div>

<div class="section"><h3>RNN 的致命缺陷——长程依赖问题 <span class="tag-important">重点</span></h3>
<p><strong>根本原因：</strong>tanh 的导数 ≤ 1，在反向传播（BPTT：随时间反向传播）中，梯度需要从最后一个时间步<strong>连乘</strong>回第一个时间步。梯度连乘后指数级衰减→<strong>远处的输入信息几乎无法影响当前</strong>。</p>
<div class="fm-card"><div class="fm-label">📌 直观理解</div><div class="fm-main">类似存在一个<strong>滑动窗口</strong>——虽然理论上可以"看到"所有历史，但实际上只有<strong>最近约 10-20 步</strong>的信息是有效的。更早的信息被指数衰减淹没。</div></div>
<div class="kp important"><strong>⭐ 这直接催生了 LSTM 和 GRU：</strong>通过引入"门控机制"和"细胞状态"，让信息可以<strong>几乎无损地跨越长距离</strong>传递，解决了梯度消失问题。</div>

<div class="section"><h3>PyTorch RNN 层使用</h3>
<pre>import torch.nn as nn
rnn = nn.RNN(input_size=128, hidden_size=256, num_layers=1)
# input_size:  词向量维度（输入特征维度）
# hidden_size: 隐藏层维度（也是该层神经元的输出维度）
# num_layers:  堆叠层数，默认1

# 输入 x:  (seq_len, batch, input_size)  句子长度×批量×词向量维度
# 初始 h0: (num_layers, batch, hidden_size)
# 输出 out: (seq_len, batch, hidden_size)
# 最终 hn:  (num_layers, batch, hidden_size)
output, hn = rnn(x, h0)</pre>
</div></div></div>

<div class="chapter" id="r-ch2"><div class="head"><span class="num">RNN-2</span>LSTM 与 GRU —— 解决长程依赖 <span class="tag-important">核心</span></div><div class="body">
<div class="overview"><span class="ov-item">遗忘门fₜ</span><span class="ov-arrow">·</span><span class="ov-item">输入门iₜ</span><span class="ov-arrow">·</span><span class="ov-item star">Cₜ细胞状态(高速公路)</span><span class="ov-arrow">→</span><span class="ov-item">输出门oₜ→hₜ</span></div>

<div class="section"><h3>LSTM（Long Short-Term Memory，长短期记忆网络）<span class="tag-important">重点</span></h3>
<p>LSTM 的核心创新是引入<strong>细胞状态 Cₜ</strong>——一条贯穿所有时间步的"信息高速公路"，让信息可以<strong>几乎无损地跨越长距离传递</strong>。相对于 Cₜ，隐藏状态 hₜ 存储的是<strong>弱化版的细胞信息</strong>，这让新输入更容易占据主导。</p>

<div class="section"><h4>三门机制详解</h4>
<p><strong>LSTM 使用三个"Sigmoid门"（输出0~1）来控制信息流量：</strong></p>
<div class="fm-card"><div class="fm-label">📌 三门公式</div>
<div class="fm-main">
<strong>遗忘门：fₜ = σ(Wբ·[hₜ₋₁, xₜ] + bբ)</strong> —— 决定丢弃 Cₜ₋₁ 中的哪些旧信息（0=全忘，1=全保留）<br>
<strong>输入门：iₜ = σ(Wᵢ·[hₜ₋₁, xₜ] + bᵢ)</strong> —— 决定将哪些新信息写入细胞状态<br>
<strong>输出门：oₜ = σ(Wₒ·[hₜ₋₁, xₜ] + bₒ)</strong> —— 决定将 Cₜ 的哪些部分输出为 hₜ
</div></div></div>

<div class="section"><h4>信息流动全过程</h4>
<p><strong>① 候选新信息（短期记忆）：</strong>C̃ₜ = tanh(W꜀·[hₜ₋₁, xₜ] + b꜀) —— 从当前输入和上一步隐藏状态提取的新候选信息</p>
<p><strong>② 更新细胞状态（长期+短期融合）：</strong><span class="tag-important">核心</span> <strong>Cₜ = fₜ·Cₜ₋₁ + iₜ·C̃ₜ</strong>（遗忘门×旧记忆 + 输入门×新信息 = 新记忆）</p>
<p><strong>③ 输出隐藏状态：</strong>hₜ = oₜ·tanh(Cₜ)（弱化版 Cₜ，方便下一步新输入 xₜ₊₁ 占据主导）</p>

<div class="fm-card"><div class="fm-label">📌 直观理解</div>
<div class="fm-main">
<strong>Cₜ = 长期记忆（高速公路）</strong>——信息几乎无损地跨越时间步<br>
<strong>C̃ₜ = 短期记忆（当前新信息）</strong>——来自当前输入 + 上一步隐藏状态<br>
<strong>hₜ = 弱化版 Cₜ（对外输出）</strong>——让新输入 xₜ₊₁ 更容易占据主导<br>
<strong>三门用 Sigmoid（0~1）：</strong>控制信息流量——0=完全阻断，1=完全通过
</div></div>

<div class="kp important"><strong>⭐ 为什么 LSTM 能解决梯度消失？</strong>Cₜ = fₜ·Cₜ₋₁ + iₜ·C̃ₜ 中的 <strong>fₜ·Cₜ₋₁ 是线性操作</strong>（没有 tanh 压缩），梯度可以直接通过 Cₜ 这条"高速公路"反向传播，不会指数衰减。</div>
	
	<div class="viz-box"><div class="viz-label">交互演示：LSTM 细胞结构（逐步展示遗忘门→输入门→细胞更新→输出门的信息流动）</div><div id="lstm-viz-container"></div></div></div>

<div class="section"><h3>GRU（Gate Recurrent Unit，门控循环单元）—— LSTM 的简化版</h3>
<p>GRU 将 LSTM 的三个门简化为两个门，合并了细胞状态和隐藏状态，参数更少、训练更快：</p>
<div class="fm-card"><div class="fm-label">📌 GRU 两门公式</div>
<div class="fm-main">
<strong>重置门：rₜ = σ(Wᵣ·[hₜ₋₁, xₜ] + bᵣ)</strong> —— 控制忽略多少历史信息<br>
<strong>更新门：zₜ = σ(W₂·[hₜ₋₁, xₜ] + b₂)</strong> —— 控制保留多少旧状态 vs 使用多少新状态
</div></div>
<p>① 候选状态：<strong>h̃ₜ = tanh(Wₕ·[rₜ·hₜ₋₁, xₜ] + bₕ)</strong>（重置门弱化历史后提取新信息）</p>
<p>② 最终状态：<strong>hₜ = (1−zₜ)·hₜ₋₁ + zₜ·h̃ₜ</strong>（更新门在旧状态和新状态之间做加权平均）</p>
	
	<div class="viz-box"><div class="viz-label">交互演示：GRU 细胞结构（逐步展示重置门→候选状态→更新门→加权平均的简化流程）</div><div id="gru-viz-container"></div></div>

<div class="section"><h3>LSTM vs GRU 对比</h3>
<table><tr><th></th><th>LSTM</th><th>GRU</th></tr>
<tr><td><strong>门的数量</strong></td><td>3个（遗忘+输入+输出）</td><td>2个（重置+更新）</td></tr>
<tr><td><strong>状态数量</strong></td><td>2个（Cₜ细胞状态 + hₜ隐藏状态）</td><td>1个（hₜ 身兼两职）</td></tr>
<tr><td><strong>参数量</strong></td><td>较多</td><td>较少（约 LSTM 的 75%）</td></tr>
<tr><td><strong>训练速度</strong></td><td>较慢</td><td>较快</td></tr>
<tr><td><strong>效果</strong></td><td>通常略好（有独立的长期记忆通道）</td><td>接近 LSTM，小数据上有时更好</td></tr></tbody></table>

<div class="section"><h3>堆叠网络 & 双向网络</h3>
<p><strong>堆叠 RNN（Stacked RNN）：</strong>多层 RNN 堆叠 → 层级化特征提取。底层提取简单模式，高层组合成复杂特征。类比 CNN 的层级特征提取。</p>
<p><strong>双向 RNN（Bi-RNN/Bi-LSTM/Bi-GRU）：</strong>同时利用<strong>前文</strong>和<strong>后文</strong>进行预测。例如："我___吃饭"——只看前文"我"不够，看后文"吃饭"才知道中间填"在"。双向网络在 NER、机器翻译等任务中几乎是标配。</p>
</div></div>

<div class="chapter" id="r-ch3"><div class="head"><span class="num">RNN-3</span>词嵌入与文本生成</div><div class="body">
<div class="overview"><span class="ov-item">文本</span><span class="ov-arrow">→</span><span class="ov-item">分词(token)</span><span class="ov-arrow">→</span><span class="ov-item star">Embedding</span><span class="ov-arrow">→</span><span class="ov-item">词向量→RNN</span></div>
<p><strong>词嵌入：</strong>nn.Embedding(vocab_size,emb_dim)→每个词→稠密低维向量，<strong>语义相似的词向量也接近。</strong></p>
<p><strong>歌词生成流程：</strong>①构建词汇表(jieba分词→去重→词→索引)②Dataset(每32词→下32词)③模型=Embedding+RNN+Linear④训练(CrossEntropyLoss+Adam)⑤预测(起始词→循环生成)。</p>
<pre>rnn=nn.RNN(input_size=128,hidden_size=256,num_layers=1)
output,hn=rnn(x,h0)
# x:(seq_len,batch,input_size) output:(seq_len,batch,hidden_size)</pre>
</div></div>
`,

// ═══════════════════════ PyTorch ═══════════════════════
'g-torch':`
<div class="book-header"><span class="icon">🔥</span><div><h1>PyTorch 快速参考</h1><div class="meta"><span>📄 101页+笔记</span><span>🎯 张量·运算·自动微分</span></div></div></div>

<div class="chapter" id="t-ch1"><div class="head"><span class="num">Ch1</span>张量创建速查</div><div class="body">
<div class="section"><h3>矢量化和张量化</h3><p><strong>矢量化：</strong>同形+同质。<strong>张量化：</strong>同形+同质+<strong>只能是数值</strong>(bool/int/float)。PyTorch的张量=多维矩阵，通过类创建对象，提供各种方法和属性。</p></div>
<div class="section"><h3>创建方式</h3>
<table><tr><th>方式</th><th>API</th><th>说明</th></tr>
<tr><td>从数据</td><td>torch.tensor(data,dtype=)</td><td>不共享内存;默认int64/float32</td></tr>
<tr><td>搭架子</td><td>torch.Tensor(size=)</td><td>推荐用法，<strong>不接受dtype</strong>，固定float32</td></tr>
<tr><td>全0/1/值</td><td>zeros/ones/full + _like</td><td>torch.zeros(size=(2,3))</td></tr>
<tr><td>线性</td><td>arange(s,e,step) / linspace(s,e,n)</td><td>arange左闭右开整数步长 / linspace左闭右闭均匀取点</td></tr>
<tr><td>随机</td><td>rand/randn/randint</td><td>均匀[0,1)/正态N(0,1)/整数[low,high)</td></tr>
<tr><td>种子</td><td>torch.manual_seed(seed)</td><td>torch.initial_seed()查看当前种子</td></tr></table></div>
<div class="section"><h3>完整数据类型表 <span class="tag-important">重点</span></h3>
<table><tr><th>创建类</th><th>类型</th><th>修改type()</th><th>修改方法</th></tr>
<tr><td>torch.ShortTensor()</td><td>torch.int16</td><td>torch.short</td><td>tensor.short()</td></tr>
<tr><td>torch.IntTensor()</td><td>torch.int32</td><td>torch.int</td><td>tensor.int()</td></tr>
<tr><td>torch.LongTensor()</td><td>torch.int64</td><td>torch.long</td><td>tensor.long()</td></tr>
<tr><td>torch.HalfTensor()</td><td>torch.float16</td><td>torch.half</td><td>tensor.half()</td></tr>
<tr><td>torch.FloatTensor()</td><td>torch.float32</td><td>torch.float</td><td>tensor.float()</td></tr>
<tr><td>torch.DoubleTensor()</td><td>torch.float64</td><td>torch.double</td><td>tensor.double()</td></tr></table></div>
<div class="section"><h3>张量↔NumPy转换</h3>
<p><strong>array→tensor：</strong>torch.tensor(arr)→不共享(copy)；torch.from_numpy(arr)→共享内存。<strong>tensor→array：</strong>tensor.numpy()→共享；tensor.numpy().copy()→不共享。<strong>标量提取：</strong>tensor.item()→把零维张量转为Python数字。</p></div>
</div></div>

<div class="chapter" id="t-ch2"><div class="head"><span class="num">Ch2</span>张量运算与形状操作</div><div class="body">
<table><tr><th>操作</th><th>API</th></tr>
<tr><td>四则</td><td>+ − * / − | add/sub/mul/div/neg | add_()原地</td></tr>
<tr><td>点乘</td><td>*或mul()(对应位置乘)</td></tr>
<tr><td>矩阵乘</td><td><strong>@</strong>或torch.matmul() | (n,m)×(m,p)=(n,p)</td></tr>
<tr><td>统计</td><td>sqrt/pow/exp/log | sum/mean(dim=0列/1行)</td></tr>
<tr><td>形状</td><td>reshape/view/squeeze(去1维)/unsqueeze(增1维)</td></tr>
<tr><td>维度</td><td>transpose(dim0,dim1)/permute(dims)/contiguous()</td></tr>
<tr><td>拼接</td><td>cat([t1,t2],dim)不增维/stack([t1,t2],dim)增新维</td></tr>
<tr><td>索引</td><td>data[行,列]/data[布尔掩码]/[::2,1::2]切片/点名</td></tr>
<tr><td>转换</td><td>from_numpy/.numpy共享内存; .item()提取标量; .detach()剥离计算图</td></tr></table>
</div></div>

<div class="chapter" id="t-ch3"><div class="head"><span class="num">Ch3</span>自动微分 <span class="tag-important">核心</span></div><div class="body">
<div class="overview"><span class="ov-item">requires_grad=True</span><span class="ov-arrow">→</span><span class="ov-item star">loss.backward()</span><span class="ov-arrow">→</span><span class="ov-item">w.grad</span><span class="ov-arrow">→</span><span class="ov-item star">optimizer.step()</span></div>
<div class="section"><h3>梯度下降五步</h3>
<pre>w=torch.tensor(10.0,requires_grad=True)  # ①创建
for i in range(1000):
    loss=w**2+20                          # ②前向
    if w.grad is not None:w.grad.zero_()  # ⚠️梯度清零(默认累加!)
    loss.backward()                        # ③反向传播
    w.data=w.data-0.01*w.grad             # ④梯度下降更新
    # ⑤收敛:w.grad≈0</pre></div>
<div class="section"><h3>标准训练循环</h3>
<pre>model=MyModel()
criterion=nn.MSELoss()  # CrossEntropyLoss/BCELoss
optimizer=optim.Adam(model.parameters(),lr=0.001)
scheduler=lr_scheduler.StepLR(optimizer,step_size=50,gamma=0.5)
for epoch in range(epochs):
    for X,y in dataloader:
        y_pred=model(X)              # ①前向
        loss=criterion(y_pred,y)     # ②损失
        optimizer.zero_grad()        # ③梯度清零
        loss.backward()              # ④反向传播
        optimizer.step()             # ⑤参数更新
    scheduler.step()</pre>
<div class="kp important"><strong>⭐ 三个关键：</strong>①loss必须<strong>标量</strong>才能backward(向量需.sum())②梯度<strong>默认累加</strong>→每次必须zero_grad()③自动微分张量转numpy需先<strong>.detach()</strong>。</div>
</div></div>
`,

// ═══════════════════════ Python ═══════════════════════
'g-py':`
<div class="book-header"><span class="icon">🐍</span><div><h1>Python 编程</h1><div class="meta"><span>📄 基础语法·容器·函数·OOP·算法</span><span>🎯 编程基础能力</span></div></div></div>

<div class="chapter" id="pyb-ch1"><div class="head"><span class="num">Ch1</span>基础语法</div><div class="body">
<div class="overview"><span class="ov-item">环境搭建</span><span class="ov-arrow">→</span><span class="ov-item star">变量/类型</span><span class="ov-arrow">→</span><span class="ov-item">运算符</span><span class="ov-arrow">→</span><span class="ov-item">输入输出</span></div>
<table><tr><th>知识点</th><th>内容</th></tr>
<tr><td><strong>环境</strong></td><td>Anaconda·虚拟环境(conda create/activate)·Jupyter Notebook·PyCharm配置·Ollama本地大模型</td></tr>
<tr><td><strong>变量</strong></td><td>标识符规则·命名规范·赋值(=)·多变量赋值a,b=b,a·常量(大写)</td></tr>
<tr><td><strong>数据类型</strong></td><td>int·float·str·bool·None·type()·isinstance()·int()/float()/str()</td></tr>
<tr><td><strong>运算符</strong></td><td>算术(+ - * / // % **)·比较(== != > <)·逻辑(and or not)·赋值(+=)·优先级</td></tr>
<tr><td><strong>字符串</strong></td><td>引号·f-string·索引[0]/[-1]·切片[start:end:step]·len()·upper/lower/strip/split/join/replace/find</td></tr>
<tr><td><strong>输入输出</strong></td><td>print()·input()·格式化·end/sep参数</td></tr></table>
</div></div>

<div class="chapter" id="pyb-ch2"><div class="head"><span class="num">Ch2</span>流程控制与五大容器</div><div class="body">
<div class="overview"><span class="ov-item">if/elif/else</span><span class="ov-arrow">→</span><span class="ov-item">for/while</span><span class="ov-arrow">→</span><span class="ov-item star">list·tuple·set·dict·str</span></div>
<table><tr><th>容器</th><th>特点</th><th>创建</th><th>常用操作</th></tr>
<tr><td><strong>list</strong></td><td>有序·可变·可重复</td><td>[1,2,3]</td><td>append/insert/extend/pop/remove/sort/切片/推导式</td></tr>
<tr><td><strong>tuple</strong></td><td>有序·不可变</td><td>(1,2,3)</td><td>index/count/拆包a,b=(1,2)</td></tr>
<tr><td><strong>set</strong></td><td>无序·不重复·可变</td><td>{1,2,3}</td><td>add/remove/union(|)/intersection(&)/difference(-)</td></tr>
<tr><td><strong>dict</strong></td><td>键值对·键唯一</td><td>{'a':1}</td><td>get/keys/values/items/update/pop/推导式</td></tr>
<tr><td><strong>str</strong></td><td>不可变序列</td><td>"hello"</td><td>find/replace/split/join/strip/startswith/格式化</td></tr></table>
<p><strong>流程控制：</strong>if-elif-else·三元x if cond else y·for-in-else·while-else·break/continue·range(s,e,step)·enumerate·zip</p>
</div></div>

<div class="chapter" id="pyb-ch3"><div class="head"><span class="num">Ch3</span>函数·文件·异常</div><div class="body">
<div class="overview"><span class="ov-item">def函数</span><span class="ov-arrow">→</span><span class="ov-item">参数类型</span><span class="ov-arrow">→</span><span class="ov-item star">lambda·闭包·装饰器</span><span class="ov-arrow">→</span><span class="ov-item">文件读写</span></div>
<p><strong>函数：</strong>def·return·默认参数·位置参数·关键字参数·*args/**kwargs·作用域(LEGB)·global/nonlocal·lambda·闭包(外层变量引用)·装饰器(@语法糖)</p>
<p><strong>文件：</strong>open(path,mode,encoding)·with上下文管理·read/readline/readlines·write/writelines·json/csv模块·异常try-except-else-finally·raise抛出</p>
<pre># 装饰器示例
def timer(func):
    def wrapper(*a,**kw):
        import time;t0=time.time()
        r=func(*a,**kw)
        print(f"{func.__name__}:{time.time()-t0:.2f}s")
        return r
    return wrapper
# 文件读取
with open('data.txt','r',encoding='utf-8') as f:content=f.read()</pre>
</div></div>

<div class="chapter" id="pyb-ch4"><div class="head"><span class="num">Ch4</span>面向对象·算法·进阶</div><div class="body">
<div class="overview"><span class="ov-item">class类</span><span class="ov-arrow">→</span><span class="ov-item">继承/多态</span><span class="ov-arrow">→</span><span class="ov-item">网络编程</span><span class="ov-arrow">→</span><span class="ov-item star">进程/线程</span><span class="ov-arrow">→</span><span class="ov-item">数据结构</span></div>
<table><tr><th>模块</th><th>核心内容</th></tr>
<tr><td><strong>面向对象</strong></td><td>class·__init__·self·实例/类/静态方法·@property·继承(super())·多态·魔术方法(__str__/__eq__)</td></tr>
<tr><td><strong>数据结构</strong></td><td>链表(单/双)·栈·队列·<strong>排序</strong>(冒泡O(n²)/选择O(n²)/快排O(n log n))·<strong>二分查找O(log n)</strong>·二叉树(前/中/后序)</td></tr>
<tr><td><strong>网络编程</strong></td><td>TCP/UDP·socket·HTTP请求·requests库</td></tr>
<tr><td><strong>进程/线程</strong></td><td>multiprocessing·threading·GIL·进程池/线程池·Queue通信·Lock互斥锁</td></tr>
<tr><td><strong>正则表达式</strong></td><td>re模块·match/search/findall/sub·元字符(.*+?[]()^$)·贪婪/非贪婪</td></tr></table>
<div class="kp"><strong>排序对比：</strong>冒泡(稳定,相邻比较,O(n²))·选择(不稳定,找最小值,O(n²))·快排(不稳定,分治,O(n log n))。二分查找仅适用于<strong>有序</strong>序列。外循环n−1轮,内循环每轮递减。</div>
<div class="viz-box"><div class="viz-label">交互演示：排序算法对比（点击切换冒泡/选择，步进观察交换过程）</div><div id="sorting-viz-container"></div></div>
</div></div>
`,

// ═══════════════════════ MySQL ═══════════════════════
'g-sql':`
<div class="book-header"><span class="icon">🗄️</span><div><h1>MySQL 数据库</h1><div class="meta"><span>📄 入门·查询·函数·PyMySQL</span><span>🎯 结构化数据管理</span></div></div></div>

<div class="chapter" id="sql-ch1"><div class="head"><span class="num">Ch1</span>基础与单表查询</div><div class="body">
<div class="overview"><span class="ov-item">DDL建表</span><span class="ov-arrow">→</span><span class="ov-item">DML增删改</span><span class="ov-arrow">→</span><span class="ov-item star">SELECT查询</span><span class="ov-arrow">→</span><span class="ov-item">WHERE·ORDER·LIMIT</span></div>
<table><tr><th>分类</th><th>语句</th><th>说明</th></tr><tr><td>DDL</td><td>CREATE/DROP/ALTER TABLE</td><td>定义数据库结构</td></tr><tr><td>DML</td><td>INSERT/UPDATE/DELETE</td><td>数据增删改</td></tr><tr><td>DQL</td><td>SELECT...FROM...WHERE</td><td>数据查询(核心)</td></tr><tr><td>DCL</td><td>GRANT/REVOKE</td><td>权限控制</td></tr></table>
<p><strong>SELECT完整结构：</strong>SELECT列 FROM表 WHERE条件 GROUP BY分组 HAVING过滤 ORDER BY排序 LIMIT分页。<strong>执行顺序：</strong>FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT。</p>
<p><strong>WHERE条件：</strong>比较(= != > <)·BETWEEN·IN·LIKE(% _)·IS NULL·AND/OR/NOT</p>
</div></div>

<div class="chapter" id="sql-ch2"><div class="head"><span class="num">Ch2</span>多表查询与函数</div><div class="body">
<div class="overview"><span class="ov-item">JOIN连接</span><span class="ov-arrow">→</span><span class="ov-item">子查询</span><span class="ov-arrow">→</span><span class="ov-item star">聚合函数</span><span class="ov-arrow">→</span><span class="ov-item">窗口函数</span></div>
<table><tr><th>连接</th><th>说明</th></tr><tr><td>INNER JOIN</td><td>两表匹配行</td></tr><tr><td>LEFT JOIN</td><td>左表全部+右表匹配</td></tr><tr><td>RIGHT JOIN</td><td>右表全部+左表匹配</td></tr><tr><td>自连接</td><td>表自身关联(员工-上级)</td></tr></table>
<p><strong>聚合：</strong>COUNT/SUM/AVG/MAX/MIN+GROUP BY+HAVING。<strong>函数：</strong>字符串(CONCAT/SUBSTR)·数值(ROUND/ABS)·日期(NOW/DATE_FORMAT/DATEDIFF)·条件(IF/CASE WHEN)·窗口(ROW_NUMBER/RANK/LEAD/LAG OVER)。</p>
<pre>SELECT d.name,COUNT(e.id) cnt,AVG(e.salary) avg_sal
FROM departments d LEFT JOIN employees e ON d.id=e.dept_id
WHERE e.status='active' GROUP BY d.name
HAVING cnt>5 ORDER BY avg_sal DESC LIMIT 10;</pre>
</div></div>

<div class="chapter" id="sql-ch3"><div class="head"><span class="num">Ch3</span>Python操作MySQL & FineBI</div><div class="body">
<div class="overview"><span class="ov-item">pymysql</span><span class="ov-arrow">→</span><span class="ov-item">CRUD操作</span><span class="ov-arrow">→</span><span class="ov-item star">SQL注入防护</span><span class="ov-arrow">→</span><span class="ov-item">FineBI可视化</span></div>
<pre>import pymysql
conn=pymysql.connect(host='localhost',user='root',password='',database='db')
cursor=conn.cursor()
cursor.execute("SELECT * FROM users WHERE name=%s",(name,)) # 参数化防注入
rows=cursor.fetchall()
conn.commit();cursor.close();conn.close()</pre>
<p><strong>FineBI：</strong>商业智能工具，拖拽式报表，连接MySQL自动生成可视化仪表板。SQL是数据分析的底层能力——Pandas的groupby本质就是SQL的GROUP BY。</p>
</div></div>
`,

// ═══════════════════════ 数据分析 (Pandas+NumPy) ═══════════════════════
'g-data':`
<div class="book-header"><span class="icon">📊</span><div><h1>数据分析</h1><div class="meta"><span>📄 Pandas·NumPy</span><span>🎯 Python数据分析核心栈</span></div></div></div>

<div class="divider"><span>Pandas</span></div>

<div class="chapter" id="p-ch1"><div class="head"><span class="num">P1</span>Pandas 数据结构</div><div class="body">
<div class="overview"><span class="ov-item star">Series</span><span class="ov-arrow">+</span><span class="ov-item star">DataFrame</span><span class="ov-arrow">=</span><span class="ov-item">两大基石</span></div>
<p><strong>Series</strong>=values+index+name(一维带标签)。<strong>DataFrame</strong>=由Series组成的字典(key=列名)。<strong>Pandas只有列/二维表，没有行的数据结构。</strong></p>
<table><tr><th>属性/方法</th><th>说明</th><th>属性/方法</th><th>说明</th></tr><tr><td>loc</td><td>按索引值取</td><td>iloc</td><td>按位置取</td></tr><tr><td>dtype</td><td>元素类型</td><td>shape</td><td>维数</td></tr><tr><td>describe()</td><td>统计摘要</td><td>value_counts()</td><td>频数统计</td></tr><tr><td>unique()</td><td>去重值</td><td>sort_values()</td><td>按值排序</td></tr></table>
<pre>df=pd.read_csv('data.csv')          # 加载CSV
df.shape;df.dtypes;df.head();df.info();df.describe()
df.loc[0:5,['col1','col2']]          # 按索引值
df.iloc[:,range(1,5,2)]              # 按位置
# 增删改：set_index/reset_index/rename/insert/drop
# 导入导出：to_csv/to_excel/to_pickle</pre>
</div></div>

<div class="chapter" id="p-ch2"><div class="head"><span class="num">P2</span>缺失值处理</div><div class="body">
<div class="overview"><span class="ov-item">检测NaN</span><span class="ov-arrow">→</span><span class="ov-item star">isnull()</span><span class="ov-arrow">→</span><span class="ov-item">dropna()</span><span class="ov-arrow">|</span><span class="ov-item star">fillna()</span><span class="ov-arrow">|</span><span class="ov-item">interpolate()</span></div>
<p><strong>NaN不等于0/空串/False</strong>，只能用pd.isnull()/pd.isna()判断。</p>
<pre>df.isnull().sum()                    # 每列缺失量
df.dropna()                          # 删含NaN行
df.dropna(subset=['Age'],how='any')  # 条件删
df.fillna(0)                         # 常量填
df['Age'].fillna(df['Age'].mean())   # 均值填
df.fillna(method='ffill')            # 前向填充(时序)
df.fillna(method='bfill')            # 后向填充
df.interpolate(limit_direction='both') # 线性插值</pre>
<div class="kp"><strong>套路：</strong>能填不删。类别型→填'缺失'; 数值型→统计量; 时序型→ffill/bfill/插值; 缺失>50%的列可直接删。</div>
</div></div>

<div class="chapter" id="p-ch3"><div class="head"><span class="num">P3</span>分组聚合与变换 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">groupby()</span><span class="ov-arrow">→</span><span class="ov-item star">agg()聚合</span><span class="ov-arrow">|</span><span class="ov-item star">transform()转换</span><span class="ov-arrow">|</span><span class="ov-item">filter()过滤</span><span class="ov-arrow">|</span><span class="ov-item">apply()自定义</span></div>
<pre># 分组聚合
df.groupby('year')['lifeExp'].mean()
df.groupby(['year','continent'])[['lifeExp','gdpPercap']].mean()
df.groupby('year').agg({'lifeExp':'mean','pop':'median'})
# transform(不减少行数)
df.groupby('year').lifeExp.transform(lambda x:(x-x.mean())/x.std())
# filter过滤
tips.groupby('size').filter(lambda x:x['size'].count()>30)
# 透视表
pd.pivot_table(df,values='sales',index='region',columns='year',aggfunc='sum')
# apply自定义+向量化
df.apply(lambda x:x.isnull().sum())      # 列缺失数
@np.vectorize                            # 让普通函数可逐元素操作</pre>
</div></div>

<div class="chapter" id="p-ch4"><div class="head"><span class="num">P4</span>数据分析实战案例</div><div class="body">
<div class="overview"><span class="ov-item">加载→了解</span><span class="ov-arrow">→</span><span class="ov-item">清洗</span><span class="ov-arrow">→</span><span class="ov-item star">分组聚合</span><span class="ov-arrow">→</span><span class="ov-item">可视化</span><span class="ov-arrow">→</span><span class="ov-item">结论</span></div>
<p><strong>电影数据：</strong>小成本高口碑→nlargest(100,'imdb_score').nsmallest(5,'budget')；每年最高分→sort_values+drop_duplicates。</p>
<p><strong>链家租房：</strong>租金分布describe()·热门朝向groupby+sum·户型分布groupby+count+plot.bar·平均单价价格/面积·热门小区groupby+sum+nlargest。</p>
<p><strong>RFM分析：</strong>Recency(最近消费)·Frequency(消费频率)·Monetary(消费金额)→客户分层。中美日GDP折线图：groupby+plot折线图。</p>
</div></div>

<div class="divider"><span>NumPy</span></div>

<div class="chapter" id="n-ch1"><div class="head"><span class="num">N1</span>NumPy 核心速查</div><div class="body">
<div class="overview"><span class="ov-item star">ndarray</span><span class="ov-arrow">→</span><span class="ov-item">矢量运算</span><span class="ov-arrow">→</span><span class="ov-item">广播机制</span><span class="ov-arrow">→</span><span class="ov-item">矩阵运算</span></div>
<p>NumPy是Python数据分析的<strong>基础包</strong>（C语言开发），Pandas/Scikit-learn/PyTorch都构建其上。ndarray=多维数组，所有元素<strong>必须同类型</strong>。</p>
<table><tr><th>属性</th><th>说明</th><th>创建</th><th>说明</th></tr><tr><td>ndim</td><td>维度数</td><td>np.array(list)</td><td>从列表创建</td></tr><tr><td>shape</td><td>形状</td><td>np.zeros/ones(shape)</td><td>全0/全1</td></tr><tr><td>size</td><td>元素总数</td><td>np.arange(s,e,step)</td><td>等差序列</td></tr><tr><td>dtype</td><td>元素类型</td><td>np.linspace(s,e,n)</td><td>等分数列</td></tr></table>
<pre># 统计(axis=0列/1行)
np.mean/median/std/var/min/max/sum/argmax/cumsum
# 实用：ceil/floor/rint/abs/where(cond,x,y)/unique/sort
# 矩阵：a@b或dot(矩阵乘) | a*b或multiply(逐元素乘)
# 广播：shape不同自动扩展(从最后维度对齐,维度为1的可广播)</pre>
</div></div>
`,

// ═══════════════════════ Linux ═══════════════════════
'g-linux':`
<div class="book-header"><span class="icon">🐧</span><div><h1>Linux 操作系统</h1><div class="meta"><span>📄 系统概述·目录结构·常用命令·VIM</span><span>🎯 大数据与服务器基础</span></div></div></div>

<div class="chapter" id="linux-ch1"><div class="head"><span class="num">Ch1</span>Linux 核心速查</div><div class="body">
<div class="overview"><span class="ov-item">OS=软硬件桥梁</span><span class="ov-arrow">→</span><span class="ov-item">Linux:开源·安全·稳定</span><span class="ov-arrow">→</span><span class="ov-item star">服务器标配</span></div>
<p>Linux诞生于1991(Linus Torvalds)，<strong>开源免费、安全稳定、多用户多任务</strong>。所有大数据组件(Hadoop/Spark)和AI服务器都基于Linux。发行版：CentOS/Ubuntu/RedHat。</p>
<p><strong>核心思想：一切皆文件。</strong>目录结构：/根·/bin命令·/etc配置·/home用户·/var日志·/tmp临时·/usr软件·/opt附加。</p>
<p><strong>常用命令：</strong>ls/cd/pwd/mkdir/rm/cp/mv/chmod/chown·cat/head/tail/grep/find·ps/top/kill·tar/zip·ssh/scp·apt/yum。<strong>VIM编辑器：</strong>i插入/Esc退出/:wq保存退出/:q!强制退出。</p>
</div></div>
`,

// ═══════════════════════ 大模型 & AI Agent ═══════════════════════
'g-llm':`
<div class="book-header"><span class="icon">💬</span><div><h1>大模型 & AI Agent</h1><div class="meta"><span>📄 提示词工程·Coze·Dify·RAGFlow</span><span>🎯 LLM应用开发</span></div></div></div>

<div class="chapter" id="pr-ch1"><div class="head"><span class="num">Ch1</span>大模型技术全景</div><div class="body">
<div class="overview"><span class="ov-item">CNN萌芽</span><span class="ov-arrow">→</span><span class="ov-item">GPT-1/BERT探索</span><span class="ov-arrow">→</span><span class="ov-item star">ChatGPT爆发</span><span class="ov-arrow">→</span><span class="ov-item">o1推理模型</span></div>
<p><strong>四大开发技术栈：</strong>①<strong>提示词工程</strong>(优化输入,零成本)→②<strong>模型微调</strong>(注入知识,需算力)→③<strong>RAG</strong>(外部知识库检索增强,性价比高)→④<strong>AI Agent</strong>(规划+工具+执行闭环,终极形态)。</p>
<div class="kp important"><strong>⭐ 大模型幻觉：</strong>①事实型(知识过时/不准)→RAG解决 ②忠实型(不遵循指令/逻辑)→优化提示词+推理链。幻觉无法根除但可大幅缓解。</div>
</div></div>

<div class="chapter" id="pr-ch2"><div class="head"><span class="num">Ch2</span>提示词工程 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item">清晰指令</span><span class="ov-arrow">→</span><span class="ov-item">角色扮演</span><span class="ov-arrow">→</span><span class="ov-item star">FewShot</span><span class="ov-arrow">→</span><span class="ov-item">CoT思维链</span><span class="ov-arrow">→</span><span class="ov-item">ReAct</span></div>
<table><tr><th>技巧</th><th>说明</th><th>适用</th></tr>
<tr><td><strong>清晰指令</strong></td><td>背景+目标+约束+输出格式(详细描述)</td><td>所有场景</td></tr>
<tr><td><strong>角色扮演</strong></td><td>"你是一位专业的XX"</td><td>专业视角</td></tr>
<tr><td><strong>FewShot</strong></td><td>给1-3个示例→模型模仿格式</td><td>需特定输出格式</td></tr>
<tr><td><strong>思维链CoT</strong></td><td>"请一步步思考"→模型展示推理步骤</td><td>复杂推理/数学题</td></tr>
<tr><td><strong>链式提示</strong></td><td>前一步输出→下一步输入(分而治之)</td><td>复杂多步任务</td></tr>
<tr><td><strong>自我一致性</strong></td><td>多思路推理→投票选最佳答案</td><td>高可靠性需求</td></tr>
<tr><td><strong>ReAct</strong></td><td>Thought→Action→Observation循环调用工具</td><td>需调用外部工具</td></tr></table>
<pre>from openai import OpenAI
client=OpenAI(base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
# 阿里百炼 / 本地Ollama 通用调用
response=client.chat.completions.create(model="qwen-plus",
  messages=[{"role":"system","content":"你是翻译助手"},
            {"role":"user","content":"Hello"}],stream=True)
for chunk in response:print(chunk.choices[0].delta.content,end="")</pre>
<div class="kp"><strong>技巧选择原则：</strong>简单任务→清晰指令；需特定格式→FewShot；复杂推理→CoT+链式；需调用工具→ReAct。不是越高级越好，合理即可。</div>
</div></div>

<div class="chapter" id="pr-ch3"><div class="head"><span class="num">Ch3</span>模型安全</div><div class="body">
<div class="overview"><span class="ov-item">提示词注入</span><span class="ov-arrow">|</span><span class="ov-item">越狱攻击</span><span class="ov-arrow">|</span><span class="ov-item">数据泄露</span><span class="ov-arrow">→</span><span class="ov-item star">防御：分隔符+审核+权限</span></div>
<p><strong>提示词注入：</strong>用户输入中插入恶意指令覆盖Prompt→防御：用分隔符标记用户输入边界。<strong>越狱攻击：</strong>以正当理由套取不当信息→防御：安全层+内容审核。<strong>数据泄露：</strong>诱导模型透露训练数据隐私→防御：敏感数据不入训练集。</p>
</div></div>

<div class="divider"><span>▼ AI Agent 应用平台 ▼</span></div>

<div class="chapter" id="ag-ch1"><div class="head"><span class="num">Ag1</span>AI Agent 概念</div><div class="body">
<div class="overview"><span class="ov-item star">Agent=LLM+记忆+规划+工具</span><span class="ov-arrow">→</span><span class="ov-item">感知→思考→行动→反馈</span></div>
<table><tr><th>维度</th><th>传统LLM</th><th>AI Agent</th></tr><tr><td>交互</td><td>被动一问一答</td><td>主动规划多步执行</td></tr><tr><td>工具</td><td>无/受限</td><td>自主调用搜索/计算/API</td></tr><tr><td>记忆</td><td>短期上下文</td><td>短期+长期+外部RAG</td></tr></table>
<p><strong>四大组件：</strong>大脑(LLM推理)·规划(任务拆解·CoT/ToT/反思)·记忆(短期·长期·RAG)·工具(搜索·计算·API·代码)。<strong>核心价值：</strong>让LLM从"只会说"变成"能做"。</p>
</div></div>

<div class="chapter" id="ag-ch2"><div class="head"><span class="num">Ag2</span>平台对比与选型</div><div class="body">
<table><tr><th>平台</th><th>类型</th><th>优点</th><th>适用</th></tr>
<tr><td><strong>Coze(扣子)</strong></td><td>字节·低代码·在线</td><td>插件60+·工作流可视化·多Agent·一键发布</td><td>国内快速验证</td></tr>
<tr><td><strong>Dify</strong></td><td>开源·私有化</td><td>60k+stars·多模型·RAG·企业权限</td><td>企业私有化</td></tr>
<tr><td><strong>LangChain</strong></td><td>代码框架</td><td>生态完善·组件丰富·灵活</td><td>深度定制</td></tr>
<tr><td><strong>RAGFlow</strong></td><td>开源RAG引擎</td><td>深度文档理解(OCR+版式)·PDF扫描件好</td><td>复杂文档RAG</td></tr></table>
<div class="kp"><strong>选型：</strong>快速验证→Coze；企业私有化→Dify；深度定制→LangChain/LangGraph；复杂文档→Dify+RAGFlow组合。</div>
</div></div>

<div class="chapter" id="ag-ch3"><div class="head"><span class="num">Ag3</span>Coze 实战要点</div><div class="body">
<div class="overview"><span class="ov-item">工作流编排</span><span class="ov-arrow">→</span><span class="ov-item">知识库(RAG)</span><span class="ov-arrow">→</span><span class="ov-item">数据库(CRUD)</span><span class="ov-arrow">→</span><span class="ov-item star">智能体发布</span></div>
<p><strong>核心概念：</strong>工作空间→项目(智能体/AI应用)→资源库(插件/知识库/数据库/提示词)。<strong>节点：</strong>开始·大模型·选择器(分支)·循环(批量)·代码·知识库检索·数据库读写·结束。</p>
<p><strong>多模态：</strong>文生图·画质提升·语音识别/合成·视频生成。<strong>多智能体：</strong>父Agent路由→子Agent执行。<strong>发布：</strong>网页·API·飞书·微信·抖音。</p>
<pre>from cozepy import Coze,TokenAuth,COZE_CN_BASE_URL,Message,MessageObjectString
coze=Coze(auth=TokenAuth('your_api_key'),base_url=COZE_CN_BASE_URL)
upload=coze.files.upload(file=Path('resume.pdf'))
messages=[Message.build_user_question_objects([
    MessageObjectString.build_file(file_id=upload.id),
    MessageObjectString.build_text("分析简历")])]
for chunk in coze.chat.stream(bot_id='xxx',user_id='u',additional_messages=messages):
    print(chunk.message.content,end="")</pre>
<p><strong>案例：</strong>AI面试助手(简历分析+录音评估+面试题生成)·旅游规划·智能助教·口语练习。</p>
</div></div>

<div class="chapter" id="ag-ch4"><div class="head"><span class="num">Ag4</span>Dify & RAGFlow</div><div class="body">
<div class="overview"><span class="ov-item">Chatflow/Workflow</span><span class="ov-arrow">→</span><span class="ov-item star">RAG三步</span><span class="ov-arrow">→</span><span class="ov-item">外部知识库API</span></div>
<p><strong>Dify五种应用：</strong>聊天助手·文本生成·Agent·Chatflow(多轮对话)·Workflow(自动化批处理)。<strong>知识库分段：</strong>通用模式(规则分块)·父子模式(召回父块上下文更完整)。</p>
<p><strong>RAG三步：</strong>①检索(用户问题→向量匹配知识库)→②增强(检索结果+问题拼成prompt)→③生成(LLM基于增强上下文回答)。<strong>Dify+RAGFlow互补：</strong>Dify业务逻辑 + RAGFlow深度文档解析(OCR+布局识别+表结构)，解决PDF扫描版识别差的问题。</p>
<p><strong>模型训练语料构建：</strong>数据收集→清洗→格式转换→质量检查→入库。案例：智能法律助手。</p>
</div></div>
`,

// ═══════════════════════ 文本预处理 (NLP) ═══════════════════════
'g-nlp':`
<div class="book-header"><span class="icon">📝</span><div><h1>文本预处理</h1><div class="meta"><span>📄 81页讲义</span><span>📦 6大模块</span><span>🎯 NLP入门必备</span></div></div></div>

<div class="chapter" id="nlp-ch1"><div class="head"><span class="num">Ch1</span>NLP概述与文本预处理概念</div><div class="body">
<div class="overview"><span class="ov-item star">NLP</span><span class="ov-arrow">→</span><span class="ov-item">NLU理解</span><span class="ov-arrow">+</span><span class="ov-item">NLG生成</span><span class="ov-arrow">→</span><span class="ov-item star">文本预处理</span><span class="ov-arrow">→</span><span class="ov-item">五大环节</span></div>

<div class="section"><h3>1. 自然语言处理（NLP）概念</h3>
<div class="fm-card"><div class="fm-main"><strong>NLP = 让计算机理解人类语言 + 生成人类语言</strong></div><div class="fm-sub">NLU（自然语言理解）+ NLG（自然语言生成）</div></div>
</div>

<div class="section"><h3>2. NLP应用场景</h3>
<table><tr><th>类别</th><th>具体应用</th></tr>
<tr><td><strong>文本分类</strong></td><td>情感分析、实体识别</td></tr>
<tr><td><strong>文本生成</strong></td><td>机器翻译、歌词生成、摘要总结、故事扩写、问答系统、智能客服、搜索引擎</td></tr>
<tr><td><strong>语音文字</strong></td><td>语音识别(STT)、语音合成(TTS)、声音克隆、声纹识别</td></tr></table>
</div>

<div class="section"><h3>3. 文本预处理概念</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main">文本在输送给模型之前，需要进行一系列<strong>预处理工作</strong>，才能符合模型输入的要求</div><div class="fm-sub">核心任务：准备出模型需要的 X（特征）和 Y（标签），然后输入给模型</div></div>
<p><strong>具体工作包括：</strong>将文本数字化（文本编码、文本张量化）、规范张量尺寸、检查标签是否均匀、查找脏数据、分析数据长度分布等。</p>
<div class="kp important"><strong>⭐ 关键认知：文本预处理方式没有唯一方法！</strong>不同的语言、任务、模型所需要的预处理方式不同。预处理方式要与<strong>语言/任务/模型</strong>相匹配。</div>
</div>

<div class="section"><h3>4. 文本预处理五大主要环节</h3>
<div class="overview"><span class="ov-item star">①基本处理</span><span class="ov-arrow">→</span><span class="ov-item">分词+词性标注+NER</span><span class="ov-arrow">→</span><span class="ov-item star">②语料分析</span><span class="ov-arrow">→</span><span class="ov-item">标签/长度/词频</span><span class="ov-arrow">→</span><span class="ov-item star">③特征处理</span><span class="ov-arrow">→</span><span class="ov-item">n-gram+长度规范</span><span class="ov-arrow">→</span><span class="ov-item star">④文本编码</span><span class="ov-arrow">→</span><span class="ov-item">词频/词嵌入</span><span class="ov-arrow">→</span><span class="ov-item star">⑤数据增强</span><span class="ov-arrow">→</span><span class="ov-item">回译法</span></div>
<table><tr><th>环节</th><th>核心内容</th></tr>
<tr><td><strong>① 基本处理</strong></td><td>分词、词性标注、命名实体识别</td></tr>
<tr><td><strong>② 语料分析</strong></td><td>标签分布、句子长度分布、词频统计</td></tr>
<tr><td><strong>③ 特征处理</strong></td><td>添加n-gram特征、文本长度规范</td></tr>
<tr><td><strong>④ 文本编码</strong></td><td>词频编码、词嵌入编码、预训练加载</td></tr>
<tr><td><strong>⑤ 数据增强</strong></td><td>回译数据增强法</td></tr></table>
</div></div>

<div class="chapter" id="nlp-ch2"><div class="head"><span class="num">Ch2</span>文本的基本处理 <span class="tag-important">重点</span></div><div class="body">
<div class="overview"><span class="ov-item star">分词</span><span class="ov-arrow">→</span><span class="ov-item star">词性标注(POS)</span><span class="ov-arrow">→</span><span class="ov-item star">命名实体识别(NER)</span></div>

<div class="section"><h3>1. 分词（Word Segmentation）</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main">将<strong>连续的文字序列</strong>，按照一定的规范，转成<strong>词元序列</strong>的过程</div></div>
<p><strong>作用：</strong>词元作为语义理解的<strong>最小单元</strong>，是人类理解文本语言的基础。文本数字化是AI解决任何NLP任务的前提；<strong>分词是文本编码的前提</strong>。</p>
<div class="kp important"><strong>⭐ 中文为什么要分词？</strong>中文没有明显的分界符，英文天然空格是分界符。例如："传智教育是一家上市公司" → ['传智', '教育', '是', '一家', '上市公司', '，', '旗下', '有', '黑马', '程序员', '品牌']</div>
</div>

<div class="viz-box"><div class="viz-label">交互演示：jieba三种分词模式对比（切换模式观察分词结果差异）</div><div id="nlp-tokenize-viz-container"></div></div>

<div class="section"><h3>2. 流行中文分词工具——jieba</h3>
<div class="fm-card"><div class="fm-label">🔧 jieba（结巴分词）</div><div class="fm-main">做最好的 Python 中文分词组件</div></div>
<table><tr><th>功能</th><th>说明</th></tr>
<tr><td><strong>三种分词模式</strong></td><td>精确模式、全模式、搜索引擎模式</td></tr>
<tr><td><strong>支持繁体分词</strong></td><td>可处理中文繁体文本</td></tr>
<tr><td><strong>用户自定义词典</strong></td><td>jieba.load_userdict('./userdict.txt')</td></tr>
</table>

<p><strong>jieba三种分词模式详解：</strong></p>
<pre>import jieba
content = "我爱北京天安门"

# ① 精确模式（默认，cut_all=False）：最精确，适合文本分析
jieba.lcut(content, cut_all=False)
# ['我', '爱', '北京', '天安门']

# ② 全模式（cut_all=True）：所有可能词都切出，速度快，有冗余
jieba.lcut(content, cut_all=True)
# ['我', '爱', '北京', '天安', '天安门']

# ③ 搜索引擎模式：在精确模式基础上再切分长词，适合搜索
jieba.cut_for_search(content)
# ['我', '爱', '北京', '天安', '天安门']</pre>

<p><strong>其他流行分词工具：</strong>SnowNLP（概率算法）· PyLTP（哈工大）· THULAC（清华大学）· Ik分词器（Elasticsearch用）。</p>

<p><strong>环境安装：</strong></p>
<pre>conda create -n nlp-cpu python=3.x   # 创建新环境
conda activate nlp-cpu                # 激活环境
pip install jieba                     # 安装jieba
conda list jieba                      # 验证安装</pre>
</div>

<div class="section"><h3>3. 词性标注（POS Tagging）</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main"><strong>Part-of-Speech Tagging (POS)</strong>：标注出一段文本中每个词汇的词性</div></div>
<p><strong>词性：</strong>语言中对词的分类方法，以语法特征为主要依据。常见词性有<strong>14种</strong>：名词(n)、动词(v)、形容词(a)、副词(d)、代词(r)、介词(p)、连词(c)、叹词(e)、数词(m)、量词(q)、助词(u)、语气词(y)、拟声词(o)、状态词(z)等。</p>
<p><strong>作用：</strong>通常是为<strong>特征工程</strong>做准备，例如一句话中的名词或形容词比例。</p>
<p><strong>示例：</strong>"我爱自然语言处理" → 我/rr, 爱/v, 自然语言/n, 处理/vn（rr=人称代词, v=动词, n=名词, vn=动名词）</p>
<pre>import jieba.posseg as pseg
result = pseg.lcut("我爱北京天安门")
# [pair('我','r'), pair('爱','v'), pair('北京','ns'), pair('天安门','ns')]</pre>

<p><strong>jieba词性对照表（部分重点）：</strong></p>
<table><tr><th>词性</th><th>含义</th><th>词性</th><th>含义</th></tr>
<tr><td>a</td><td>形容词</td><td>n</td><td>名词</td></tr>
<tr><td>c</td><td>连词</td><td>nr</td><td>人名</td></tr>
<tr><td>d</td><td>副词</td><td>ns</td><td>地名</td></tr>
<tr><td>p</td><td>介词</td><td>nt</td><td>机构团体名</td></tr>
<tr><td>r/rr</td><td>代词/人称代词</td><td>nz</td><td>其他专名</td></tr>
<tr><td>u/uj/ud</td><td>助词/的/得</td><td>v/vn</td><td>动词/名动词</td></tr>
<tr><td>m/mq</td><td>数词/数量词</td><td>q</td><td>量词</td></tr>
<tr><td>t</td><td>时间词</td><td>f</td><td>方位词</td></tr></table>
</div>

<div class="section"><h3>4. 命名实体识别（NER）</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main"><strong>Named Entity Recognition (NER)</strong>：识别出一段文本中可能存在的命名实体</div><div class="fm-sub">命名实体：人名、地名、机构名等专有名词统称。如：周杰伦、黑山县、孔子学院</div></div>
<p><strong>示例：</strong>"鲁迅，浙江绍兴人，五四新文化运动的重要参与者，代表作朝花夕拾。" → 鲁迅(人名) / 浙江绍兴(地名) / 五四新文化运动(专有名词) / 朝花夕拾(专有名词)</p>
<p><strong>作用：</strong>通常作为<strong>标签而非特征</strong>使用，可以看作是<strong>信息检索</strong>的一个应用案例。注意：NER也是<strong>词元级别</strong>的分类，非实体会被分类为"其它"。</p>

<div class="kp"><strong>总结——三种基本文本处理：</strong>①分词：连续文字→词元序列（语义最小单元，编码前提）②词性标注(POS)：标注每个词的词性（为特征工程做准备）③命名实体识别(NER)：识别专有名词（通常用作标签/信息检索）。这三种都是<strong>词元级别</strong>的操作。</div>
</div></div>

<div class="chapter" id="nlp-ch3"><div class="head"><span class="num">Ch3</span>文本语料数据分析</div><div class="body">
<div class="overview"><span class="ov-item star">标签分布</span><span class="ov-arrow">→</span><span class="ov-item star">句子长度分布</span><span class="ov-arrow">→</span><span class="ov-item">正负样本散点</span><span class="ov-arrow">→</span><span class="ov-item star">词频统计+词云</span></div>

<div class="section"><h3>1. 文本语料数据分析的作用</h3>
<div class="fm-card"><div class="fm-main">文本数据分析能有效帮助我们<strong>理解数据语料</strong>，快速检查<strong>语料可能存在的问题</strong>，指导模型训练过程中<strong>超参数的选择</strong></div></div>
<table><tr><th>维度</th><th>分析内容</th></tr>
<tr><td><strong>标签Y</strong></td><td>分类问题查看标签是否均匀（正负样本比例维持在1:1左右）</td></tr>
<tr><td><strong>数据X</strong></td><td>有没有脏数据、数据长度分布等</td></tr></table>
<p><strong>常用方法：</strong>标签数量分布 · 句子长度分布 · 词频统计与词云。</p>
<p><strong>示例数据集：</strong>基于中文酒店评论语料（二分类情感分析），train.tsv训练集 + dev.tsv验证集，包含sentence和label两列（0=消极，1=积极）。</p>
</div>

<div class="section"><h3>2. 获取标签数量分布</h3>
<p><strong>概念：</strong>求标签0有多少个，标签1有多少个……。训练深度学习分类模型时，正负样本比例应维持在<strong>1:1左右</strong>，不均衡需进行数据增强或删减。</p>
<pre>import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
plt.style.use('fivethirtyeight')

train_data = pd.read_csv('./cn_data/train.tsv', sep='\t')
dev_data = pd.read_csv('./cn_data/dev.tsv', sep='\t')

# 统计label标签的0、1分组数量
sns.countplot(x='label', data=train_data)  # 方式1
# sns.countplot(x=train_data['label'])     # 方式2
plt.title('train_data')
plt.show()

sns.countplot(x='label', data=dev_data)
plt.title('dev_data')
plt.show()</pre>
</div>

<div class="section"><h3>3. 获取句子长度分布</h3>
<p><strong>概念：</strong>求长度为50的有多少个、长度51的有多少个……。</p>
<div class="kp"><strong>柱状图 vs 直方图密度曲线：</strong>柱状图(countplot)→每个长度对应的样本数量；直方图/密度曲线(displot)→查看整体分布趋势。二者配合使用，全面了解长度分布。</div>
<pre># 新增数据长度列
train_data['sentence_length'] = list(map(lambda x: len(x), train_data['sentence']))

# 绘制柱状图
sns.countplot(x='sentence_length', data=train_data)
plt.xticks([])  # 隐藏x轴刻度（太多）
plt.show()

# 绘制直方图+密度曲线
sns.displot(x='sentence_length', data=train_data)
plt.yticks([])
plt.show()</pre>
<p><strong>指导作用：</strong>从训练集和验证集句子长度分布图来看，若长度范围大部分处于<strong>20~250</strong>之间，若模型对输入数据长度有要求，可以对句子进行<strong>截断或补齐</strong>操作（规范长度），分布图起关键指导作用。</p>
</div>

<div class="section"><h3>4. 获取正负样本长度散点分布</h3>
<p><strong>概念：</strong>按照x=正负样本分组，再按照y=长度绘制散点图。通过查看散点图，可有效<strong>定位异常点的出现位置</strong>，帮助更准确地进行人工语料审查。</p>
<pre># 新增数据长度列
train_data['sentence_length'] = list(map(lambda x: len(x), train_data['sentence']))

# 调用散点图函数
sns.stripplot(y='sentence_length', x='label', data=train_data)
plt.show()

# 验证集同理
dev_data['sentence_length'] = list(map(lambda x: len(x), dev_data['sentence']))
sns.stripplot(y='sentence_length', x='label', data=dev_data)
plt.show()</pre>
<div class="kp"><strong>异常点：</strong>训练集正样本中若出现长度近3500的异常点，需要人工审查处理。</div>
</div>

<div class="section"><h3>5. 统计单词总数与词频/词云</h3>
<p><strong>统计词汇总数：</strong>使用 set + chain + map 组合，对所有句子分词后取唯一词汇集合。</p>
<pre>from itertools import chain
import jieba

# 统计词汇总数（去重后所有单词的个数）
train_vocab = set(chain(*map(lambda x: jieba.lcut(x), train_data['sentence'])))
print("训练集词汇总数:", len(train_vocab))
# chain(*[...]) 将所有句子的分词结果展平成一个列表
# set(...) 去重，得到唯一词汇集合</pre>
<p><strong>词频统计与词云：</strong>统计每个词出现的频率，使用WordCloud库生成词云图，直观展示高频词汇。</p>
</div></div>

<div class="chapter" id="nlp-ch4"><div class="head"><span class="num">Ch4</span>文本特征处理</div><div class="body">
<div class="overview"><span class="ov-item">特征工程</span><span class="ov-arrow">→</span><span class="ov-item star">n-gram特征</span><span class="ov-arrow">→</span><span class="ov-item star">文本长度规范</span></div>

<div class="section"><h3>1. 文本特征处理概念</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main">处理文本数据最常用的<strong>特征工程</strong>方法，让模型更有效地处理数据，提高模型性能</div></div>
<p><strong>常用方法：</strong>①添加n-gram特征（n个单词总是相邻且共现，被看作是一个n-gram特征）②规范文本长度（文本长度是一个超参数）。</p>
</div>

<div class="section"><h3>2. n-gram 特征</h3>
<div class="viz-box"><div class="viz-label">交互演示：n-gram特征生成（切换bi-gram/tri-gram观察特征提取过程）</div><div id="nlp-ngram-viz-container"></div></div>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main">给定一段文本序列，其中<strong>相邻且共现的n个词元</strong>，可以作为一个特征，即称n-gram特征</div><div class="fm-sub">常用：bi-gram(n=2)和tri-gram(n=3)。n是一个超参数</div></div>
<p><strong>示例：</strong>假设分词列表: ["是谁", "敲动", "我心"]，数值映射: [1, 34, 21]</p>
<ul><li>数字98代表"是谁"+"敲动"相邻且共现 → bi-gram特征 → 列表变成: [1, 34, 21, <strong>98</strong>]</li>
<li>数字99代表"敲动"+"我心"相邻且共现 → bi-gram特征 → 列表变成: [1, 34, 21, 98, <strong>99</strong>]</li></ul>
<pre># 计算文本序列有多少个2-gram特征
input_list = [1, 3, 2, 1, 5, 3]
ngram_range = 2  # 一般取2或3

# 对2个可迭代器对象进行配对
res = set(zip(*[input_list[i:] for i in range(ngram_range)]))
print(res)
# {(3, 2), (1, 3), (2, 1), (1, 5), (5, 3)}
# 共5个bi-gram特征</pre>
</div>

<div class="section"><h3>3. 文本长度规范</h3>
<div class="fm-card"><div class="fm-label">📌 概念</div><div class="fm-main">送给模型的数据一般都有<strong>长度要求</strong>；批量送数据（如每次8个样本）需要样本长度一致，因此需要文本长度规范</div></div>
<p><strong>核心操作：</strong>文本过长需要<strong>截断(truncating)</strong>，文本过短需要<strong>打pad补齐/补零(padding)</strong>。</p>
<pre>from tensorflow.keras.preprocessing import sequence

cutlen = 10  # 根据数据分析中句子长度分布，覆盖90%左右语料的最短长度

def test_padding():
    # 两条文本：一条长度>10，一条<10
    x_train = [[1, 23, 5, 32, 55, 63, 2, 21, 78, 32, 23, 1],
               [2, 32, 1, 23, 1]]

    # padding='pre'(前端补齐), truncating='pre'(前端截断)——均为默认
    res = sequence.pad_sequences(sequences=x_train, maxlen=cutlen)
    print(res)
    # [[ 5 32 55 63  2 21 78 32 23  1]   ← 前面被截断
    #  [ 0  0  0  0  0  2 32  1 23  1]]  ← 前面补零

# 参数：padding='pre'/'post'  truncating='pre'/'post'  maxlen  value(默认0)</pre>
<div class="kp"><strong>cutlen的选择：</strong>根据语料分析中句子长度分布来确定，应覆盖<strong>90%左右</strong>的语料。太长浪费计算资源，太短损失信息。</div>
</div></div>

<div class="chapter" id="nlp-ch5"><div class="head"><span class="num">Ch5</span>文本编码方式 <span class="tag-important">核心重点</span></div><div class="body">
<div class="overview"><span class="ov-item star">词频编码</span><span class="ov-arrow">→</span><span class="ov-item">One-Hot/Count/TF-IDF</span><span class="ov-arrow">→</span><span class="ov-item star">词嵌入编码</span><span class="ov-arrow">→</span><span class="ov-item">Word2Vec/Embedding</span><span class="ov-arrow">→</span><span class="ov-item star">预训练加载</span></div>

<div class="section"><h3>1. 文本向量化（词频编码）发展史</h3>
<table><tr><th>方法</th><th>特点</th><th>缺点</th></tr>
<tr><td><strong>One-Hot编码</strong></td><td>稀疏矩阵；N个单词→长度为N的向量，只有1位为1</td><td>丢失词频信息，丢失同义词关联信息，维度爆炸</td></tr>
<tr><td><strong>词频编码(Count)</strong></td><td>稀疏矩阵；统计词出现次数</td><td>受高频词干扰，丢失同义词关联信息</td></tr>
<tr><td><strong>TF-IDF编码</strong></td><td>稀疏矩阵；词频×逆文档频率</td><td>部分缓解高频词干扰，仍丢失同义词关联</td></tr>
<tr><td><strong>词向量编码</strong></td><td><strong>稠密矩阵</strong>；语义相近的词向量也相近</td><td>需要训练或加载预训练词向量</td></tr>
</table>
</div>

<div class="section"><h3>2. One-Hot 编码</h3>
<p><strong>概念：</strong>将分类变量转换为数字格式的常用方法（稀疏词向量表示）。如10个单词需要长度为10的1维数组，只有1个地方为1，其他位置全为0。</p>
<p><strong>优点：</strong>操作简单，容易理解。<strong>缺点：</strong>完全割裂了词与词之间的联系；大语料集下每个向量长度过大，占据大量内存。</p>
</div>

<div class="section"><h3>3. TF-IDF 编码</h3>
<div class="fm-card"><div class="fm-main"><strong>TF-IDF = TF(词频) × IDF(逆文档频率)</strong></div></div>
<table><tr><th>公式</th><th>含义</th></tr>
<tr><td><strong>TF(t,d) = log₁₀(词频+1)</strong></td><td>词t在文档d中出现次数的对数平滑</td></tr>
<tr><td><strong>IDF(t) = log₁₀((N+1)/(DF(t)+1)) + 1</strong></td><td>N=文档总数；DF(t)=词t出现在任意文档中的总次数</td></tr>
</table>
<div class="kp">TF-IDF的核心思想：一个词在本文档中<strong>出现越多</strong>且在其他文档中<strong>出现越少</strong>，该词对本文档越重要。PCA降维可将TF-IDF的稀疏矩阵转为<strong>稠密矩阵</strong>。</div>
</div>

<div class="section"><h3>4. 词嵌入 Word Embedding</h3>
<div class="fm-card"><div class="fm-label">📌 概念</div><div class="fm-main">通过一定的方式将词汇映射到<strong>指定维度（一般是更高维度）</strong>的空间</div></div>
<p><strong>广义word embedding：</strong>所有密集词汇向量的表示方法（Word2Vec是其中一种），可使用浅层或深层神经网络表示。</p>
<p><strong>狭义word embedding：</strong>指深度神经网络中嵌入的一个层（nn.Embedding）。</p>
<pre>import torch.nn as nn
# 创建词嵌入层：支持3000个单词，每个单词128个特征 → 3000×128的矩阵参数
embd = nn.Embedding(num_embeddings=vocab_size, embedding_dim=128)
print(embd.weight.data.shape)  # torch.Size([3000, 128])</pre>

<div class="kp important"><strong>⭐ Word2Vec vs nn.Embedding：</strong>相同点→都可用于训练词向量。不同点→①Word2Vec产生词向量后固定不变（<strong>静态</strong>）；nn.Embedding作为网络一部分会参与更新（<strong>动态</strong>）②Word2Vec使用需两步（先取词向量再送网络）；nn.Embedding一步嵌入网络直接使用。</div>
</div>

<div class="section"><h3>5. Word2Vec 模型 <span class="tag-important">重点</span></h3>
<div class="viz-box"><div class="viz-label">交互演示：CBOW vs Skip-gram（切换模式，拖动窗口观察训练方式差异）</div><div id="nlp-word2vec-viz-container"></div></div>
<div class="fm-card"><div class="fm-main">利用<strong>相邻单词之间的共现关系</strong>，用神经网络学习词向量表示。在<strong>无监督</strong>语料上构建<strong>自监督</strong>任务。</div></div>
<p><strong>两种训练词向量的方式：</strong></p>
<table><tr><th></th><th>CBOW</th><th>Skip-gram</th></tr>
<tr><td><strong>原理</strong></td><td>上下文词预测<strong>中心词</strong>（两侧→中间）</td><td>中心词预测<strong>上下文词</strong>（中间→两侧）</td></tr>
<tr><td><strong>上下文处理</strong></td><td>周围词向量<strong>求和/取平均</strong></td><td>当前词向量作为输入</td></tr>
<tr><td><strong>计算效率</strong></td><td>更高（复杂度低）</td><td>较低（每个词生成上下文）</td></tr>
<tr><td><strong>低频词</strong></td><td>一般</td><td><strong>更优</strong>（丰富上下文信息）</td></tr>
<tr><td><strong>高频词</strong></td><td><strong>更优</strong>（汇总上下文）</td><td>一般</td></tr>
<tr><td><strong>训练速度</strong></td><td>快</td><td>慢</td></tr>
<tr><td><strong>适用场景</strong></td><td>大数据集、高频词</td><td>大规模数据集、低频词处理</td></tr>
</table>
</div>

<div class="section"><h3>6. CBOW——神经网络训练词向量原理</h3>
<div class="overview"><span class="ov-item star">滑动窗口</span><span class="ov-arrow">→</span><span class="ov-item">构建样本(x,y)</span><span class="ov-arrow">→</span><span class="ov-item">前向→隐藏层(平均)</span><span class="ov-arrow">→</span><span class="ov-item">输出层→预测值</span><span class="ov-arrow">→</span><span class="ov-item star">反向传播→更新w</span></div>
<p><strong>核心流程（滑动窗口=3，语料"abcdeaaeddccbadae…"）：</strong></p>
<ol>
<li><strong>构建样本：</strong>引入滑动窗口切分语料。样本1→x(a,c), y(b)；样本2→x(b,d), y(c)……（两侧→中间）</li>
<li><strong>前向计算：</strong>a经隐藏层→输出1，c经隐藏层→输出2 → <strong>加和求平均</strong>→ 送输出层 → 得b的预测值b̂</li>
<li><strong>数据形状：</strong>参数矩阵w[3×5] @ [5,1]→隐藏层输出[3,1]；参数矩阵w'[5×3] @ [3,1]→[5,1]预测值</li>
<li><strong>损失计算：</strong>b̂和b有差异→计算损失→反向传播→更新参数矩阵w'和w</li>
<li><strong>多轮训练后：</strong>参数矩阵w就是5个单词的词向量表示（第1列3个特征=a，第2列3个特征=b…）</li>
<li><strong>获取词向量：</strong>参数矩阵w[3×5] @ a的OneHot编码[1,0,0,0,0]ᵀ = [3,1] → a的词向量</li>
</ol>
<div class="kp">参数矩阵w：5特征→3特征=<strong>降维</strong>；参数矩阵w'：3特征→5特征=<strong>升维</strong>。</div>
</div>

<div class="section"><h3>7. Skip-gram——神经网络训练词向量原理</h3>
<div class="overview"><span class="ov-item star">滑动窗口</span><span class="ov-arrow">→</span><span class="ov-item">x(b)样本</span><span class="ov-arrow">→</span><span class="ov-item">隐藏层</span><span class="ov-arrow">→</span><span class="ov-item star">预测â,ĉ</span><span class="ov-arrow">→</span><span class="ov-item">求平均损失</span><span class="ov-arrow">→</span><span class="ov-item star">反向传播</span></div>
<p><strong>核心流程（中间→两侧）：</strong></p>
<ol>
<li><strong>构建样本：</strong>样本1→x(b), y(a,c)；样本2→x(c), y(b,d)……</li>
<li><strong>前向计算：</strong>b经隐藏层→1个隐藏层输出→送输出层<strong>2次</strong>→得â和ĉ</li>
<li><strong>损失计算：</strong>â和a有差异→loss1；ĉ和c有差异→loss2 → <strong>两个损失求平均</strong></li>
<li><strong>反向传播：</strong>â的损失更新a相关词向量参数，ĉ的损失更新c相关词向量参数</li>
<li><strong>多轮训练后：</strong>参数矩阵w就是单词词向量表示</li>
</ol>
</div>

<div class="section"><h3>8. Word2Vec 损失计算的两种优化</h3>
<table><tr><th></th><th>层次Softmax（霍夫曼树）</th><th>负采样（Negative Sampling）</th></tr>
<tr><td><strong>核心思想</strong></td><td>用<strong>霍夫曼二叉树</strong>替代softmax，高频常见词在上层（路径短）</td><td>正样本+随机采样<strong>负样本</strong>（1:5~1:20），减少计算量</td></tr>
<tr><td><strong>CBOW</strong></td><td>上下文词向量求平均→全连接预测→霍夫曼树</td><td>上下文词向量求平均→与中心词求<strong>点积</strong>（相似度）→sigmoid</td></tr>
<tr><td><strong>Skip-gram</strong></td><td>上下文词向量不变→全连接预测→霍夫曼树</td><td>上下文词向量不变→与中心词求<strong>点积</strong>→sigmoid</td></tr>
<tr><td><strong>激活函数</strong></td><td>Softmax（被霍夫曼树替代）</td><td><strong>Sigmoid</strong></td></tr>
<tr><td><strong>损失函数</strong></td><td>多分类交叉熵</td><td><strong>二分类交叉熵</strong></td></tr>
<tr><td><strong>计算量</strong></td><td>上下文数×(1+负采样数)，如4×(1+5)=24</td><td>1+负采样数，如1+5=6</td></tr>
</table>
</div>

<div class="section"><h3>9. FastText</h3>
<div class="fm-card"><div class="fm-label">📌 Facebook开源工具包</div><div class="fm-main">两大作用：<strong>训练词向量</strong> + <strong>文本分类</strong></div><div class="fm-sub">Word2Vec作者Tomas Mikolov参与开发</div></div>
<p><strong>核心创新——子词(Subword-n-grams)：</strong>增加子词ngrams，可以<strong>处理陌生单词（OOV问题）</strong>。例如："subwords" → [&lt;su, sub, ubw, bwo, wor, ord, rds, ds&gt;]，即使未见过完整单词，也能通过子词拼出词向量。</p>

<p><strong>FastText训练词向量步骤：</strong></p>
<pre>import fasttext

# 第一步：获取训练数据（英文维基百科，300M，解压后约1G）
# 原始数据用wikifil.pl清除XML/HTML格式 → 得纯文本fil9

# 第二步：训练、保存、加载词向量
# pip install fasttext（或 git clone + sudo pip install . ——推荐）
mymodel = fasttext.train_unsupervised('./data/fil9')  # 无监督训练
print('训练成功')  # 有效词汇量124M，共218316个单词，1轮约3分钟

mymodel.save_model("./data/fil9.bin")    # 保存词向量（耗时较长）
mymodel = fasttext.load_model('./data/fil9.bin')  # 加载词向量

# 第三步：模型效果检验
# 第四步：模型超参数设定</pre>

<div class="kp"><strong>总结：</strong>Word2Vec→层次Softmax(霍夫曼树替代softmax)+负采样(1:5~1:20)；FastText→子词ngrams处理陌生单词+可做文本分类。</div>
</div></div>

<div class="chapter" id="nlp-ch6"><div class="head"><span class="num">Ch6</span>文本数据增强</div><div class="body">
<div class="overview"><span class="ov-item star">回译法</span><span class="ov-arrow">→</span><span class="ov-item">中→英→中</span><span class="ov-arrow">→</span><span class="ov-item">新增同标签语料</span><span class="ov-arrow">→</span><span class="ov-item star">扩充数据集</span></div>

<div class="section"><h3>1. 回译数据增强法概念</h3>
<div class="fm-card"><div class="fm-label">📌 定义</div><div class="fm-main">基于谷歌/百度等翻译API，将文本翻译成另外一种语言，再翻译回原语言，即得到与原语料<strong>同标签的新语料</strong></div><div class="fm-sub">新语料加入原数据集 = 数据增强</div></div>
</div>

<div class="section"><h3>2. 优缺点</h3>
<table><tr><th>优势</th><th>存在问题</th></tr>
<tr><td>操作简便</td><td>短文本回译中，新语料与原语料可能<strong>重复率很高</strong></td></tr>
<tr><td>获得新语料质量高</td><td>不能有效增大样本的特征空间</td></tr>
</table>
</div>

<div class="section"><h3>3. 高重复率解决方法——串联多语言翻译</h3>
<div class="fm-card"><div class="fm-main">中文 → 韩文 → 日语 → 英文 → 中文（<strong>一般不超过3次</strong>）</div></div>
<div class="kp important"><strong>⚠️ 注意事项：</strong>更多的翻译次数将产生<strong>效率低下</strong>、<strong>语义失真</strong>等问题。建议控制在2-3次翻译以内，平衡语料多样性和语义准确性。</div>
</div>

<div class="kp"><strong>总结：</strong>回译数据增强法与CV领域数据增强目的一致→增加原始数据集中的语料数量。优势：操作简单、语料质量高。劣势：短文本易重复、多次翻译效率低且易失真。</div>
</div></div>
`,

// ═══════════════════════ 大语言模型核心架构 ═══════════════════════
'g-llm-core':`
<div class="book-header"><span class="icon">🏗️</span><div><h1>大语言模型核心架构</h1><div class="meta"><span>📄 164页讲义</span><span>📦 9大模块</span><span>🎯 Transformer·BERT/GPT·训练·评估·发展史</span></div></div></div>

<div class="chapter" id="lm-ch1"><div class="head"><span class="num">一</span>自注意力机制 Self-Attention ⭐</div><div class="body">
<div class="overview"><span class="ov-item star">Token向量化</span><span class="ov-arrow">→</span><span class="ov-item">Q/K/V投影</span><span class="ov-arrow">→</span><span class="ov-item star">Score=QKᵀ/√dₖ</span><span class="ov-arrow">→</span><span class="ov-item">Softmax→权重</span><span class="ov-arrow">→</span><span class="ov-item star">加权求和→新向量</span></div>
<div class="section"><h3>核心公式 <span class="tag-important">重点</span></h3>
<div class="fm-card"><div class="fm-label">📌 自注意力公式</div><div class="fm-main">Attention(Q,K,V) = softmax(QKᵀ/√dₖ) · V</div><div class="fm-sub">Q=Query(查询)·K=Key(键)·V=Value(值) | 除以√dₖ防止softmax饱和</div></div></div>
<div class="section"><h3>三步计算流程</h3>
<table><tr><th>步骤</th><th>计算</th><th>说明</th></tr>
<tr><td>① 相似度</td><td><strong>S = QKᵀ</strong></td><td>Query与所有Key点乘 → 注意力分数矩阵</td></tr>
<tr><td>② 权重</td><td><strong>W = softmax(S/√dₖ)</strong></td><td>归一化为概率分布（每行和为1）</td></tr>
<tr><td>③ 输出</td><td><strong>A = W·V</strong></td><td>加权求和 → 上下文感知的新向量</td></tr>
</table></div>
<div class="kp important"><strong>⭐ Q/K/V 物理意义：</strong>Q="当前词想知道谁与我有关？" | K="每个词的特征标签" | V="每个词携带的语义信息"。自注意力让字词产生<strong>灵魂</strong>——利用语境信息处理<strong>一词多义</strong>和<strong>长序关联</strong>。</div>
<div class="viz-box"><div class="viz-label">交互演示：自注意力机制 —— 点击词语观察注意力权重分布，修改句子体验语境如何更新词义</div><div id="selfattn-viz-container"></div></div>
</div></div>

<div class="chapter" id="lm-ch2"><div class="head"><span class="num">二</span>编码器-解码器架构</div><div class="body">
<div class="overview"><span class="ov-item core">Input=Token+Position</span><span class="ov-arrow">→</span><span class="ov-item">Multi-Head Attention</span><span class="ov-arrow">→</span><span class="ov-item">Add&Norm</span><span class="ov-arrow">→</span><span class="ov-item">FFN</span><span class="ov-arrow">→</span><span class="ov-item star">×N层堆叠</span></div>
<div class="section"><h3>编码器组件</h3>
<table><tr><th>组件</th><th>作用</th><th>关键细节</th></tr>
<tr><td><strong>Multi-Head Attention</strong></td><td>处理不同语法/语义关联</td><td>d_model = d_v × n_head，多个头并行</td></tr>
<tr><td><strong>残差连接</strong></td><td>保证梯度畅通流动</td><td>O = X + Attention(X)，深层网络可训练</td></tr>
<tr><td><strong>LayerNorm</strong></td><td>稳定训练、加速收敛</td><td>Pre-Norm(现代首选) vs Post-Norm(原始)</td></tr>
<tr><td><strong>FFN 前馈网络</strong></td><td>加工信息、储存知识</td><td>两层全连接，内部维度通常×4</td></tr>
</table></div>
<div class="section"><h3>解码器关键区别</h3>
<p><strong>掩码机制：</strong>对角线以上设为−∞ → 当前位置之后的权重为0 → <strong>不能偷看未来</strong>。</p>
<p><strong>Cross-Attention：</strong>Q来自解码器，K/V来自编码器最终输出 → 编码器与解码器的<strong>桥梁</strong>，每层解码器都有。</p></div>
<div class="kp"><strong>应用场景：</strong>翻译(I am awesome→我太棒了)·问答(文章+问题→答案)·文本生成·代码补全。编码器<strong>双向理解</strong>输入，解码器<strong>单向生成</strong>输出。</div>
<div class="viz-box"><div class="viz-label">交互演示：Transformer完整架构 —— 点击组件查看详情，播放数据流动画，切换编码器/解码器视图</div><div id="transformer-viz-container"></div></div>
</div></div>

<div class="chapter" id="lm-ch3"><div class="head"><span class="num">三</span>位置编码：正弦余弦函数</div><div class="body">
<div class="overview"><span class="ov-item core">PE(pos,2i)=sin(…)</span><span class="ov-arrow">+</span><span class="ov-item core">PE(pos,2i+1)=cos(…)</span><span class="ov-arrow">→</span><span class="ov-item">无需学习</span><span class="ov-arrow">→</span><span class="ov-item star">相对位置理论基础</span></div>
<div class="fm-card"><div class="fm-label">📌 公式</div><div class="fm-main">PE(pos,2i) = sin(pos/10000<sup>2i/d_model</sup>)</div><div class="fm-main">PE(pos,2i+1) = cos(pos/10000<sup>2i/d_model</sup>)</div><div class="fm-sub">pos=位置, i=维度索引, d_model=模型维度(如512)</div></div>
<div class="section"><h3>核心原理</h3>
<p>• 同一维度i下，位置信息发生不可分辨的<strong>周期性重复</strong></p>
<p>• 随着维度i增加，不可分辨的<strong>步长间隔变大</strong>（低频→区分远距离位置）</p>
<p>• 不同频率的正弦波叠加 → 每个位置产生<strong>唯一编码</strong></p>
<p>• 满足线性关系：PE(pos+k)可表示为PE(pos)的线性变换 → 为<strong>相对位置编码</strong>奠基</p></div>
<table><tr><th>模型</th><th>位置编码方式</th><th>特点</th></tr>
<tr><td>原始Transformer</td><td>正弦余弦函数（固定）</td><td>无需学习，支持任意长度</td></tr>
<tr><td>GPT-1 / BERT</td><td>位置嵌入参数（可学习）</td><td>简单但限制最大长度</td></tr>
<tr><td>GPT-3+ / Llama</td><td><strong>RoPE</strong>（旋转位置编码）</td><td>相对位置，现代LLM标配</td></tr>
</table>
</div></div>

<div class="chapter" id="lm-ch4"><div class="head"><span class="num">四</span>BERT 模型</div><div class="body">
<div class="overview"><span class="ov-item star">Encoder-only</span><span class="ov-arrow">→</span><span class="ov-item">MLM掩码预测</span><span class="ov-arrow">→</span><span class="ov-item">NSP句子预测</span><span class="ov-arrow">→</span><span class="ov-item">下游微调</span></div>
<div class="section"><h3>训练任务</h3>
<table><tr><th>任务</th><th>全称</th><th>说明</th></tr>
<tr><td><strong>MLM</strong></td><td>Masked Language Model</td><td>随机遮蔽15%词元→预测被遮蔽词。80%[MASK]+10%随机词+10%不变</td></tr>
<tr><td><strong>NSP</strong></td><td>Next Sentence Prediction</td><td>判断两个句子是否前后相邻→理解句子关系</td></tr>
</table></div>
<div class="section"><h3>下游微调</h3>
<p><strong>文本分类：</strong>使用[CLS]词元的标准输出(768维)→接Linear层→类别。</p>
<p><strong>实体识别(NER)：</strong>每个词元分别接Linear层→BIO标签(如B-PER, I-LOC)。</p></div>
<table><tr><th>版本</th><th>参数量</th><th>层数</th><th>训练数据</th><th>隐藏维度</th></tr>
<tr><td>BERT-base</td><td>110M</td><td>12</td><td>3.3B tokens</td><td>768</td></tr>
<tr><td>BERT-large</td><td>340M</td><td>24</td><td>3.3B tokens</td><td>1024</td></tr>
</table>
</div></div>

<div class="chapter" id="lm-ch5"><div class="head"><span class="num">五</span>GPT 模型 ⭐</div><div class="body">
<div class="overview"><span class="ov-item star">Decoder-only</span><span class="ov-arrow">→</span><span class="ov-item">自回归生成</span><span class="ov-arrow">→</span><span class="ov-item star">规模法则</span><span class="ov-arrow">→</span><span class="ov-item star">能力涌现</span></div>
<div class="section"><h3>GPT vs BERT</h3>
<table><tr><th>维度</th><th>GPT（解码模型）</th><th>BERT（编码模型）</th></tr>
<tr><td>架构</td><td>Decoder-only</td><td>Encoder-only</td></tr>
<tr><td>注意力</td><td>单向（因果掩码）</td><td>双向（全可见）</td></tr>
<tr><td>任务</td><td>一切任务皆可生成</td><td>针对理解任务微调</td></tr>
<tr><td>核心能力</td><td>文本生成·对话·代码</td><td>文本理解·分类·NER</td></tr>
</table></div>
<div class="section"><h3>GPT系列演进</h3>
<table><tr><th>模型</th><th>时间</th><th>参数量</th><th>训练数据</th><th>上下文</th><th>关键突破</th></tr>
<tr><td>GPT-1</td><td>2018.06</td><td>117M</td><td>1B</td><td>512</td><td>解码器预训练范式</td></tr>
<tr><td>GPT-2</td><td>2019.02</td><td>1.5B</td><td>40B</td><td>1024</td><td><strong>Zero-shot</strong></td></tr>
<tr><td>GPT-3</td><td>2020.06</td><td>175B</td><td>300B</td><td>2048</td><td><strong>In-Context Learning</strong></td></tr>
<tr><td>GPT-3.5</td><td>2022.03</td><td>~175B</td><td>—</td><td>4096</td><td>InstructGPT对齐</td></tr>
<tr><td>GPT-4</td><td>2023.03</td><td>~1T*</td><td>—</td><td>128K</td><td>多模态·强推理</td></tr>
</table></div>
<div class="kp important"><strong>⭐ 规模法则 (Scaling Law)：</strong>单纯增大参数量+数据量→性能幂律提升。预测性能无需训练到底。<br><strong>⭐ 能力涌现 (Emergent Abilities)：</strong>模型达到一定阈值（数十B+），突然展现小模型完全不具备的能力（思维链推理·代码生成·上下文学习等）。</div>
</div></div>

<div class="chapter" id="lm-ch6"><div class="head"><span class="num">六</span>大语言模型训练方法</div><div class="body">
<div class="overview"><span class="ov-item star">阶段1: 预训练</span><span class="ov-arrow">→</span><span class="ov-item">阶段2: 对齐训练</span><span class="ov-arrow">=</span><span class="ov-item">SFT</span><span class="ov-arrow">+</span><span class="ov-item">RFT</span><span class="ov-arrow">+</span><span class="ov-item star">RLHF</span></div>
<div class="section"><h3>阶段1：预训练 (Pre-training)</h3>
<table><tr><th>维度</th><th>说明</th></tr>
<tr><td>训练任务</td><td>逐词预测（Next Token Prediction）</td></tr>
<tr><td>模型输入</td><td>海量文字（互联网文本·书籍·代码）</td></tr>
<tr><td>训练目的</td><td>学习语言规律、掌握世界知识</td></tr>
<tr><td>训练结果</td><td>接近人类语言能力，但<strong>回答问题还不太行</strong></td></tr>
</table>
<p><strong>数据规模演进：</strong>Llama 1(1T)→Llama 2(2T)→Llama 3(15T)→Llama 4(30T Tokens)。1T≈2.5亿篇文章。</p></div>
<div class="section"><h3>阶段2：对齐训练 — 三步走 <span class="tag-important">重点</span></h3>
<table><tr><th>步骤</th><th>做什么</th><th>标注者</th><th>数据量</th></tr>
<tr><td><strong>① SFT</strong></td><td>监督微调：学习"好好回答"的格式</td><td>专业博士</td><td>数万条</td></tr>
<tr><td><strong>② RFT</strong></td><td>奖励模型训练：品鉴比创作容易</td><td>标注工</td><td>偏好对</td></tr>
<tr><td><strong>③ RLHF</strong></td><td>强化学习：奖励模型打分→优化策略</td><td>模型自动博弈</td><td>自生成</td></tr>
</table>
<div class="kp"><strong>核心理念：</strong>预训练=让模型学会"说话"，对齐训练=让模型学会"好好回答问题"。GPT-1/2/3是基座模型，ChatGPT是对齐后的产物。</div></div>
</div></div>

<div class="chapter" id="lm-ch7"><div class="head"><span class="num">七</span>大语言模型评价指标</div><div class="body">
<div class="overview"><span class="ov-item">PPL困惑度</span><span class="ov-arrow">|</span><span class="ov-item">BLEU精确率</span><span class="ov-arrow">|</span><span class="ov-item">ROUGE召回率</span><span class="ov-arrow">|</span><span class="ov-item star">Benchmark</span></div>
<div class="section"><h3>困惑度 Perplexity（PPL）⭐</h3>
<div class="fm-card"><div class="fm-main">PPL = ∏ p(wᵢ)<sup>−1/N</sup> = 2<sup>H</sup>（H=交叉熵）</div><div class="fm-sub">衡量模型对生成文本的确信程度。PPL越低=模型越有信心。</div></div>
<p><strong>直观理解：</strong>PPL=3 → 等效于在3个等概率选项中猜测的不确定程度。</p>
<p><strong>参考基准：</strong>英文WikiText-103：现代LLM已PPL&lt;10 | 中文标准数据集：PPL≈20-30。</p></div>
<div class="section"><h3>BLEU vs ROUGE</h3>
<table><tr><th>指标</th><th>导向</th><th>关注</th><th>适用场景</th></tr>
<tr><td><strong>BLEU</strong></td><td>精确率 Precision</td><td>"说了多少对的"</td><td>机器翻译</td></tr>
<tr><td><strong>ROUGE</strong></td><td>召回率 Recall</td><td>"对的内容覆盖了多少"</td><td>文本摘要</td></tr>
</table></div>
<div class="kp important"><strong>⚠️ PPL局限性：</strong>可能奖励输出平庸/重复/高频token的模型，惩罚新颖但正确的输出。仅在<strong>相同数据集</strong>上比较才有意义。适合作为训练时的<strong>早期预警指标</strong>。</div>
<div class="viz-box"><div class="viz-label">交互演示：困惑度计算器 —— 拖拽滑块调整各词概率，实时观察PPL变化</div><div id="ppl-viz-container"></div></div>
</div></div>

<div class="chapter" id="lm-ch8"><div class="head"><span class="num">八</span>大语言模型发展历史</div><div class="body">
<div class="overview"><span class="ov-item">2017 Transformer</span><span class="ov-arrow">→</span><span class="ov-item star">2018 BERT/GPT</span><span class="ov-arrow">→</span><span class="ov-item">2020 GPT-3</span><span class="ov-arrow">→</span><span class="ov-item star">2023 Llama/GPT-4</span><span class="ov-arrow">→</span><span class="ov-item star">2025 DeepSeek</span></div>
<div class="section"><h3>关键里程碑</h3>
<table><tr><th>模型</th><th>时间</th><th>参数量</th><th>特点</th></tr>
<tr><td>Transformer</td><td>2017.06</td><td>65M</td><td>编码器-解码器架构开创</td></tr>
<tr><td>GPT-1 / BERT</td><td>2018</td><td>110M-117M</td><td>预训练范式确立</td></tr>
<tr><td>GPT-3</td><td>2020.06</td><td>175B</td><td>规模法则验证·能力涌现</td></tr>
<tr><td>Llama 1/2</td><td>2023</td><td>7B-70B</td><td>开源生态大爆发</td></tr>
<tr><td>Llama 3</td><td>2024.04</td><td>8B-405B</td><td>15T tokens·128K上下文</td></tr>
<tr><td>DeepSeek-V3</td><td>2024.12</td><td>671B MoE</td><td>MLA·$6M训练·性能比肩GPT-4</td></tr>
<tr><td>DeepSeek-R1</td><td>2025.01</td><td>671B MoE</td><td>推理模型·强化学习·思维链</td></tr>
<tr><td>Llama 4</td><td>2025.04</td><td>400B MoE</td><td>30T tokens·10M上下文</td></tr>
</table></div>
<div class="section"><h3>训练成本对比</h3>
<div class="fm-card"><div class="fm-main">Llama 3 405B：16,000×H100 · 3,080万GPU小时 · ~数亿美元</div><div class="fm-sub">DeepSeek V3：2,048×H800 · 280万GPU小时 · ~600万美元（约1/10成本）</div></div></div>
<div class="kp"><strong>技术创新（DeepSeek）：</strong>MLA(多头隐注意力·减少KV缓存) + MoE(混合专家·部分激活) + MTP(多词元预测·同时预测多个token)。</div>
<div class="viz-box"><div class="viz-label">交互演示：LLM发展时间线 —— 悬停查看模型详情，筛选开源/闭源，圆大小∝参数量</div><div id="llmtl-viz-container"></div></div>
</div></div>

<div class="chapter" id="lm-ch9"><div class="head"><span class="num">九</span>大语言模型相关技术</div><div class="body">
<div class="overview"><span class="ov-item star">提示词工程</span><span class="ov-arrow">+</span><span class="ov-item star">RAG</span><span class="ov-arrow">+</span><span class="ov-item star">Agent</span><span class="ov-arrow">+</span><span class="ov-item">模型微调</span></div>
<div class="section"><h3>1. 提示词工程</h3>
<table><tr><th>技术</th><th>说明</th><th>调用方式</th></tr>
<tr><td>Zero-shot</td><td>零样本，不给示例</td><td>单次单步</td></tr>
<tr><td>Few-shot</td><td>少样本，给几个示例</td><td>单次单步</td></tr>
<tr><td><strong>CoT 思维链</strong></td><td>展示推理过程</td><td>单次多步</td></tr>
<tr><td><strong>Prompt Chaining</strong></td><td>多次调用串联</td><td>多次多步</td></tr>
<tr><td><strong>ReAct</strong></td><td>推理+行动交替</td><td>多次多步</td></tr>
</table></div>
<div class="section"><h3>2. RAG 检索增强生成</h3>
<p>流程：<strong>用户问题→向量检索→找到相关文档→拼接上下文→LLM生成答案</strong></p>
<p>核心价值：解决知识截止日期问题·接入私域知识·减少幻觉。需要：向量数据库+Embedding模型+相似度检索。</p></div>
<div class="section"><h3>3. Agent 智能体</h3>
<div class="fm-card"><div class="fm-label">📌 核心公式</div><div class="fm-main">智能体 = LLM + Function Calling = 工具 + 智慧</div><div class="fm-sub">Agent≠代理，Agency=能动性→有智慧的能动体</div></div></div>
<div class="section"><h3>4. 模型微调：LoRA/QLoRA</h3>
<p><strong>LoRA核心：</strong>ΔW = A<sub>n×r</sub> · B<sub>r×n</sub>，冻结原始权重，只训练低秩矩阵。参数量仅原来的 <strong>2r/n</strong>。</p>
<p><strong>QLoRA：</strong>LoRA + 4-bit量化 → 单卡微调大模型成为可能。</p></div>
<div class="viz-box"><div class="viz-label">交互演示：RAG流程动画 —— 从查询到答案，逐步展示检索增强生成的完整链路</div><div id="rag-viz-container"></div></div>
<div class="viz-box"><div class="viz-label">交互演示：LoRA低秩分解 —— 拖拽维度n和秩r，直观对比参数量与压缩比</div><div id="lora-viz-container"></div></div>
</div></div>

<div class="chapter" id="lm-ch10"><div class="head"><span class="num">🔢</span>核心公式速查表</div><div class="body">
<table><tr><th>概念</th><th>公式</th><th>说明</th></tr>
<tr><td>自注意力</td><td><strong>softmax(QKᵀ/√dₖ)·V</strong></td><td>核心机制，三步计算</td></tr>
<tr><td>位置编码（偶数维）</td><td>sin(pos/10000<sup>2i/d</sup>)</td><td>正弦波编码</td></tr>
<tr><td>位置编码（奇数维）</td><td>cos(pos/10000<sup>2i/d</sup>)</td><td>余弦波编码</td></tr>
<tr><td>残差连接</td><td>O = LayerNorm(X + Attention(X))</td><td>梯度畅通，深层可训</td></tr>
<tr><td>困惑度</td><td>PPL = ∏p(wᵢ)<sup>−1/N</sup> = 2<sup>H</sup></td><td>越低模型越有信心</td></tr>
<tr><td>LoRA</td><td>ΔW = A<sub>n×r</sub>·B<sub>r×n</sub></td><td>低秩微调，参数暴减</td></tr>
<tr><td>对齐训练</td><td>SFT → RFT → RLHF</td><td>三步对齐，炼成ChatGPT</td></tr>
<tr><td>掩码注意力</td><td>上三角=−∞ → softmax→0</td><td>不能偷看未来词</td></tr>
</table>
</div></div>
`,};

// ── 渲染函数：将内容注入页面 ──
Content.render = function(){
  const main = document.getElementById('mainContent');
  if(!main) return;
  let html = '<div class="breadcrumb">📚 机器学习知识库 / 精炼速查手册 · 50+份文档 · 10大归类 · 含交互可视化</div>';
  // 按导航分组顺序渲染
  Nav.groups.forEach(g => {
    if(Content[g.id]) html += Content[g.id];
  });
  html += '<div class="footer">📚 机器学习知识库 · 精炼速查手册 · 50+份文档 · 10大归类 · 离线可用 · AxureShow Ready</div>';
  main.innerHTML = html;
  // 初始化可视化Demo
  setTimeout(()=>{
    if(document.getElementById('gradient-viz-container')) initGradientViz('gradient-viz-container');
    if(document.getElementById('l1l2-viz-container')) initL1L2Viz('l1l2-viz-container');
    if(document.getElementById('kmeans-viz-container')) initKMeansViz('kmeans-viz-container');
    if(document.getElementById('activation-viz-container')) initActivationViz('activation-viz-container');
    if(document.getElementById('cnn-viz-container')) initCNNViz('cnn-viz-container');
    if(document.getElementById('sorting-viz-container')) initSortingViz('sorting-viz-container');
    if(document.getElementById('nn-forward-viz-container')) initNNForwardViz('nn-forward-viz-container');
    if(document.getElementById('confusion-viz-container')) initConfusionViz('confusion-viz-container');
    if(document.getElementById('overfit-viz-container')) initOverfitViz('overfit-viz-container');
    if(document.getElementById('knnb-viz-container')) initKNNBoundaryViz('knnb-viz-container');
    if(document.getElementById('dropout-viz-container')) initDropoutViz('dropout-viz-container');
    if(document.getElementById('lrcompare-viz-container')) initLRCompareViz('lrcompare-viz-container');
    if(document.getElementById('softmax-viz-container')) initSoftmaxTempViz('softmax-viz-container');
    if(document.getElementById('dtree-viz-container')) initDecisionTreeViz('dtree-viz-container');
    if(document.getElementById('rnn-viz-container')) initRNNViz('rnn-viz-container');
    try{if(document.getElementById('pooling-viz-container')) initPoolingViz('pooling-viz-container');}catch(e){console.error('pooling viz:',e);}
    try{if(document.getElementById('rnnmodes-viz-container')) initRNNModesViz('rnnmodes-viz-container');}catch(e){console.error('rnnmodes viz:',e);}
    try{if(document.getElementById('lstm-viz-container')) initLSTMViz('lstm-viz-container');}catch(e){console.error('lstm viz:',e);}
    try{if(document.getElementById('gru-viz-container')) initGRUViz('gru-viz-container');}catch(e){console.error('gru viz:',e);}
    try{if(document.getElementById('nlp-tokenize-viz-container')) initNLPTokenizeViz('nlp-tokenize-viz-container');}catch(e){console.error('nlp-tokenize viz:',e);}
    try{if(document.getElementById('nlp-ngram-viz-container')) initNLPNgramViz('nlp-ngram-viz-container');}catch(e){console.error('nlp-ngram viz:',e);}
    try{if(document.getElementById('nlp-word2vec-viz-container')) initNLPWord2VecViz('nlp-word2vec-viz-container');}catch(e){console.error('nlp-word2vec viz:',e);}
    try{if(document.getElementById('selfattn-viz-container')) initSelfAttentionViz('selfattn-viz-container');}catch(e){console.error('selfattn viz:',e);}
    try{if(document.getElementById('transformer-viz-container')) initTransformerViz('transformer-viz-container');}catch(e){console.error('transformer viz:',e);}
    try{if(document.getElementById('llmtl-viz-container')) initLLMTimelineViz('llmtl-viz-container');}catch(e){console.error('llmtl viz:',e);}
    try{if(document.getElementById('ppl-viz-container')) initPPLCalcViz('ppl-viz-container');}catch(e){console.error('ppl viz:',e);}
    try{if(document.getElementById('rag-viz-container')) initRAGFlowViz('rag-viz-container');}catch(e){console.error('rag viz:',e);}
    try{if(document.getElementById('lora-viz-container')) initLoRAViz('lora-viz-container');}catch(e){console.error('lora viz:',e);}
  },100);
};
