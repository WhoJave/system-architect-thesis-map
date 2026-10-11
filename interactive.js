const theoryTopics={
  cache:{name:"分布式缓存",steps:[
    {t:"定义",q:"它是什么？",a:"通过独立缓存层保存高频访问数据，减少对后端数据库和核心服务的直接访问。",hook:"先说本质：用空间换时间，用可控陈旧换吞吐。"},
    {t:"组成",q:"由什么组成？",a:"缓存客户端、Redis/缓存节点、权威数据源、更新与治理机制。",hook:"记成四件套：客户端、缓存、数据库、治理。"},
    {t:"机制",q:"怎么工作？",a:"典型采用 Cache-Aside：先读缓存，未命中回源数据库并回填；更新时先更新权威源，再失效缓存。",hook:"读：查→穿→填；写：库→删。"},
    {t:"边界",q:"风险在哪里？",a:"需要处理穿透、击穿、雪崩、热 Key、大 Key，以及缓存与数据库的一致性窗口。",hook:"缓存不是银弹：快了之后，难点转成一致性和治理。"},
    {t:"适配",q:"为什么适合消费金融？",a:"适合产品配置、公共字典、渠道参数等低频变化高频读取数据；核心放款、借据、账务状态仍以权威系统为准。",hook:"能缓存的是辅助数据，不能拿缓存单独裁决核心资金事实。"}
  ]},
  mq:{name:"消息队列",steps:[
    {t:"定义",q:"它是什么？",a:"通过 Broker 在生产者与消费者之间传递消息，实现异步处理、系统解耦与削峰。",hook:"先记三个价值：异步、解耦、削峰。"},
    {t:"组成",q:"由什么组成？",a:"Producer、Broker、Topic/Queue、Consumer，以及 ACK、重试、死信等可靠性机制。",hook:"四角色 + 三保障。"},
    {t:"机制",q:"怎么工作？",a:"生产者发送消息到 Broker，Broker 持久化并路由，消费者拉取或接收消息处理后确认。",hook:"发→存→路由→消费→确认。"},
    {t:"边界",q:"风险在哪里？",a:"要处理重复消费、消息丢失、顺序性、积压和消费失败，不能把 MQ 当成天然一致。",hook:"至少一次投递意味着你必须面对重复。"},
    {t:"适配",q:"为什么适合消费金融？",a:"适合通知、贷后任务、对账后处理、非核心状态传播等异步场景；核心交易必须明确一致性边界。",hook:"非核心流程异步化，核心资金事实不能模糊化。"}
  ]},
  consistency:{name:"分布式一致性",steps:[
    {t:"定义",q:"它是什么？",a:"在多个独立服务和数据源共同参与一个业务过程时，保证业务状态最终符合一致性约束。",hook:"不是“数据一样”，而是“业务结果正确”。"},
    {t:"组成",q:"由什么组成？",a:"一致性边界、事务协调方案、幂等机制、重试补偿、对账与人工兜底。",hook:"边界、方案、幂等、补偿、对账。"},
    {t:"机制",q:"怎么工作？",a:"根据场景选择强一致或最终一致，并通过 TCC、Saga、事务消息、Outbox 等方式协调多个本地事务。",hook:"先定一致性级别，再选技术。"},
    {t:"边界",q:"风险在哪里？",a:"网络超时、服务故障、重复消息、并发都会造成部分成功；方案越强，一般复杂度和耦合越高。",hook:"一致性越强，成本通常越高。"},
    {t:"适配",q:"为什么适合消费金融？",a:"借款、额度、放款、账务等跨服务链路必须先划分哪些必须强一致、哪些可最终一致。",hook:"资金事实严一点，通知分析松一点。"}
  ]},
  micro:{name:"微服务",steps:[
    {t:"定义",q:"它是什么？",a:"围绕业务能力拆分可独立开发、部署和演进的服务单元，通过明确接口协作。",hook:"核心不是服务变多，而是边界变清楚。"},
    {t:"组成",q:"由什么组成？",a:"服务单元、网关、注册发现、配置中心、通信机制、可观测与韧性治理。",hook:"服务 + 治理 + 观测。"},
    {t:"机制",q:"怎么工作？",a:"各服务独立承载业务能力，通过 REST/gRPC/MQ 协作，并通过注册发现、网关和治理组件管理运行。",hook:"拆开运行，再靠治理把它们组织起来。"},
    {t:"边界",q:"风险在哪里？",a:"会引入分布式复杂度、网络故障、数据一致性、链路追踪和部署治理成本。",hook:"单体复杂度被搬到了分布式治理。"},
    {t:"适配",q:"为什么适合消费金融？",a:"客户、风控、授信、借款、账务、贷后等业务域可按业务能力拆分，支持独立演进与故障隔离。",hook:"先按业务边界拆，不按技术层拆。"}
  ]},
  ddd:{name:"DDD",steps:[
    {t:"定义",q:"它是什么？",a:"以业务领域和领域模型为核心，通过统一语言和边界控制复杂业务的软件设计方法。",hook:"DDD 首先解决复杂业务理解问题，不是框架。"},
    {t:"组成",q:"由什么组成？",a:"战略设计包括子域、限界上下文、统一语言；战术设计包括实体、值对象、聚合、领域服务和领域事件。",hook:"战略定边界，战术做模型。"},
    {t:"机制",q:"怎么工作？",a:"先识别核心域和上下文边界，再在上下文内建立模型，并通过上下文映射和领域事件协作。",hook:"先分地盘，再建模型，再处理跨域协作。"},
    {t:"边界",q:"风险在哪里？",a:"如果业务不复杂或团队没有领域建模能力，过度 DDD 会增加抽象和沟通成本。",hook:"不是项目越大越要 DDD，而是业务越复杂越值得。"},
    {t:"适配",q:"为什么适合消费金融？",a:"客户、风控、授信、借款、账务等概念密集且规则复杂，适合用边界和模型降低语义混乱。",hook:"消费金融最怕同一个词在不同系统里不是同一个意思。"}
  ]},
  elastic:{name:"弹性伸缩",steps:[
    {t:"定义",q:"它是什么？",a:"根据业务负载和运行指标动态调整计算资源，使容量与流量变化相匹配。",hook:"本质：让资源跟着负载走。"},
    {t:"组成",q:"由什么组成？",a:"指标采集、伸缩策略、资源调度、实例生命周期、预热和保护机制。",hook:"看→判→扩缩→预热→保护。"},
    {t:"机制",q:"怎么工作？",a:"持续采集 CPU、QPS、时延、队列长度等指标，达到阈值后扩缩容，并通过冷却时间和防抖避免震荡。",hook:"指标触发 + 冷却防抖。"},
    {t:"边界",q:"风险在哪里？",a:"有状态服务、扩容预热慢、指标选择不当、频繁伸缩都可能导致效果反而变差。",hook:"伸缩不是越快越好，先解决无状态和预热。"},
    {t:"适配",q:"为什么适合消费金融？",a:"营销、账单日等峰值明显，弹性能力可提高高峰承载并降低低峰资源浪费。",hook:"峰谷差越明显，弹性价值越大。"}
  ]},
  rag:{name:"RAG",steps:[
    {t:"定义",q:"它是什么？",a:"在大模型生成前先从可信知识库检索相关内容，再把检索结果作为上下文辅助生成。",hook:"先找证据，再让模型回答。"},
    {t:"组成",q:"由什么组成？",a:"文档解析与切分、Embedding、检索、重排、上下文构建和生成模型。",hook:"入库→检索→重排→生成。"},
    {t:"机制",q:"怎么工作？",a:"用户提问后进行查询理解和检索，选出相关片段并重排，再拼接到 Prompt 中生成答案。",hook:"问→搜→排→拼→答。"},
    {t:"边界",q:"风险在哪里？",a:"检索质量、Chunk 粒度、权限隔离、数据更新和幻觉都需要治理。",hook:"RAG 不是消灭幻觉，而是给模型更可靠的证据。"},
    {t:"适配",q:"为什么适合消费金融？",a:"适合产品制度、客服知识、流程规范、运营手册等知识密集且需要可追溯回答的场景。",hook:"规则多、文档多、答案要有依据的地方最合适。"}
  ]},
  agent:{name:"Agent",steps:[
    {t:"定义",q:"它是什么？",a:"围绕目标进行任务规划，并通过工具调用、状态管理和反馈循环完成多步骤任务的智能执行体。",hook:"不是只会答，而是会规划和行动。"},
    {t:"组成",q:"由什么组成？",a:"目标与规划、工具调用、执行器、状态/记忆、权限安全和人工介入机制。",hook:"想、调、做、记、控。"},
    {t:"机制",q:"怎么工作？",a:"接收目标后进行计划，选择工具执行，读取结果并决定继续、重规划或结束。",hook:"计划→行动→观察→再计划。"},
    {t:"边界",q:"风险在哪里？",a:"工具误调用、越权、死循环、幂等和审计是核心风险，高风险动作需要人工确认。",hook:"Agent 最大问题不是答错，而是“做错”。"},
    {t:"适配",q:"为什么适合消费金融？",a:"适合客服辅助、运营工单、内部查询等低风险流程，不宜直接替代核心授信或资金决策。",hook:"先自动化低风险流程，核心决策保留硬边界。"}
  ]}
};

const scenarios={
  hotkey:{title:"营销高峰：热点 Key 失效导致数据库瞬时冲击",steps:[
    ["问题","营销活动开始后，热门产品配置 Key 同时到期，缓存命中率骤降，数据库连接数快速上升。","先写现象和业务风险，不要一上来就说 Redis。"],
    ["原因","热点 Key 使用统一固定 TTL，且失效后大量请求同时回源，形成缓存击穿。","原因要落到设计缺陷，而不是“访问量太大”。"],
    ["方案","采用热点数据预热、逻辑过期或互斥重建，并对 TTL 加随机抖动。","方案要与原因一一对应。"],
    ["实施","统一缓存组件封装 Key、TTL、重建逻辑；热点参数提前预热，未命中时仅允许单请求回源。","写出工程动作，论文才像项目。"],
    ["异常","Redis 故障时设置短超时、限流和降级；核心交易数据仍回权威系统，辅助查询可降级。","异常治理是架构师视角的关键。"],
    ["效果","数据库峰值读压力明显下降，高频查询恢复到稳定的毫秒级响应，高峰期未再出现同类冲击。","结果可以用脱敏区间，不要伪造精确生产数据。"]]},
  mqdup:{title:"至少一次投递：通知消费者出现重复消费",steps:[
    ["问题","消费者处理成功后 ACK 因网络抖动未被 Broker 收到，消息被再次投递，造成重复业务动作。","把“重复”写成具体链路。"],
    ["原因","消息系统采用至少一次投递语义，但消费逻辑缺少业务幂等保护。","不要把至少一次说成系统 Bug。"],
    ["方案","以业务唯一键建立幂等校验，并将状态变更设计成可重复执行。","可靠投递必须和幂等一起写。"],
    ["实施","消费前检查业务流水/幂等表，成功后持久化消费状态；重复消息直接返回成功。","写清楚落地流程。"],
    ["异常","连续失败进入重试和死信队列，通过告警与补偿任务处理异常消息。","失败不能只靠无限重试。"],
    ["效果","重复投递不再造成重复业务结果，同时保留至少一次投递带来的可靠性。","结论体现权衡：允许重复传输，但保证业务只生效一次。"]]},
  consistency:{title:"放款回调超时：调用方“不知道到底成功没有”",steps:[
    ["问题","资金通道请求超时，借款系统未拿到明确结果，但资金侧可能已经受理，直接重试存在重复放款风险。","这是典型“不确定状态”。"],
    ["原因","网络超时只说明调用结果未知，并不能证明远端执行失败。","这句话非常适合写进论文。"],
    ["方案","使用业务唯一流水号、状态机、幂等接口和主动查询/异步回调共同确认最终状态。","先保证可识别，再谈补偿。"],
    ["实施","请求前生成全局业务流水，资金侧按流水幂等受理；超时后进入处理中，后台任务主动查询结果。","不要在超时后盲目重发。"],
    ["异常","长时间未知则进入对账和人工核查通道，核心资金状态以资金与账务权威记录为依据。","金融系统要有最终兜底。"],
    ["效果","避免重复放款，同时使异常链路能够自动收敛到明确终态。","效果不仅是性能，更重要是资金正确性。"]]},
  cascade:{title:"下游服务变慢：同步调用链出现级联故障",steps:[
    ["问题","外部服务响应变慢，占满业务线程和连接池，导致上游多个接口同时超时。","描述故障如何扩散。"],
    ["原因","同步链路过长，超时配置不合理，缺少隔离、熔断和降级。","根因是缺少韧性设计。"],
    ["方案","设置分层超时、线程/连接隔离、熔断和可控降级，对非核心流程异步化。","不要只写一个熔断器。"],
    ["实施","按依赖重要度配置超时预算，核心和非核心资源池隔离，失败率达到阈值触发熔断。","体现系统化治理。"],
    ["异常","熔断期间返回缓存/默认值或提示稍后重试，并通过监控告警自动观察恢复窗口。","降级要说明业务语义。"],
    ["效果","局部慢服务不再拖垮整个调用链，故障影响范围被限制在可控边界。","关键词：故障隔离。"]]}
};

const assembler={
 scenes:["额度查询高峰","借款申请链路","放款结果同步","贷后通知处理"],
 problems:["数据库读压力过高","同步调用链过长","跨服务状态不一致","重复消费导致业务重复执行"],
 solutions:["引入分布式缓存并建立差异化 TTL","使用消息队列异步解耦并削峰","通过业务流水、状态机和最终一致性方案协调","通过业务唯一键和幂等表保证重复执行安全"],
 guards:["短超时 + 限流 + 降级 + 监控","重试 + 死信队列 + 补偿任务","主动查询 + 对账 + 人工兜底","告警 + 重试上限 + 异常隔离"]
};

const quizzes=[
 {tag:"理论",q:"理论段最稳定的五步顺序是什么？",o:["定义→组成→机制→边界→适配","问题→原因→方案→实施→效果","背景→角色→问题→效果→结尾"],a:0,e:"理论部分先证明你懂原理，再说明为什么适合项目。"},
 {tag:"实践",q:"实践段里最能体现“架构师视角”的环节通常是哪一个？",o:["只列出用了什么组件","异常治理与方案权衡","重复定义技术名词"],a:1,e:"高分实践不仅写正常流程，还要说明失败怎么办、为什么这样取舍。"},
 {tag:"一致性",q:"一次远程放款请求超时，最准确的判断是？",o:["肯定失败，可以立即重试","肯定成功，只是回包丢了","结果未知，需要依赖幂等标识和后续确认"],a:2,e:"网络超时只代表调用方没有拿到结果，不能推出远端一定失败。"},
 {tag:"缓存",q:"核心账务余额是否适合只以缓存值作为最终判断？",o:["适合，速度最快","不适合，应以权威数据源为准","只要 TTL 足够短就可以"],a:1,e:"缓存可提升读取性能，但核心资金和账务事实仍需权威系统确认。"},
 {tag:"MQ",q:"采用至少一次投递后，消费者必须重点补什么能力？",o:["幂等","更长超时","更大的消息体"],a:0,e:"至少一次语义允许重复投递，所以业务侧必须保证重复执行安全。"}
];

const $=s=>document.querySelector(s);
const fill=(el,items,map=x=>x)=>{el.innerHTML=items.map((x,i)=>`<option value="${i}">${map(x)}</option>`).join("")};

const topicSel=$("#theoryTopic"),track=$("#theoryTrack"),stage=$("#theoryStage"),prompt=$("#theoryPrompt"),reveal=$("#theoryReveal");
Object.entries(theoryTopics).forEach(([k,v])=>topicSel.insertAdjacentHTML("beforeend",`<option value="${k}">${v.name}</option>`));
let theoryIndex=0,showHook=false;
function renderTheory(){const data=theoryTopics[topicSel.value]||theoryTopics.cache;track.innerHTML=data.steps.map((s,i)=>`<button class="theory-node ${i===theoryIndex?'active':''}" data-i="${i}"><span class="num">0${i+1}</span>${s.t}</button>`).join("");const s=data.steps[theoryIndex];stage.innerHTML=`<h3>${s.t}：${s.q}</h3><p>${s.a}</p>${showHook?`<div class="hook"><b>记忆钩子：</b>${s.hook}</div>`:""}`;prompt.textContent=`“${s.q}”`;reveal.textContent=showHook?"隐藏记忆钩子":"显示记忆钩子";track.querySelectorAll("button").forEach(b=>b.onclick=()=>{theoryIndex=+b.dataset.i;showHook=false;renderTheory()})}
topicSel.onchange=()=>{theoryIndex=0;showHook=false;renderTheory()};reveal.onclick=()=>{showHook=!showHook;renderTheory()};renderTheory();

const scenarioSel=$("#scenarioSelect"),chain=$("#evidenceChain"),caseCard=$("#caseCard"),caseTitle=$("#caseTitle"),bar=$("#caseProgressBar");
Object.entries(scenarios).forEach(([k,v])=>scenarioSel.insertAdjacentHTML("beforeend",`<option value="${k}">${v.title}</option>`));
let evIndex=0;
function renderCase(){const c=scenarios[scenarioSel.value]||scenarios.hotkey;caseTitle.textContent=c.title;chain.innerHTML=c.steps.map((s,i)=>`<div class="evidence-step ${i<evIndex?'done':''} ${i===evIndex?'active':''}"><div class="circle">${i<evIndex?'✓':i+1}</div>${s[0]}</div>`).join("");const s=c.steps[evIndex];caseCard.innerHTML=`<span class="clue">STEP ${evIndex+1} · ${s[0]}</span><h3>${s[1]}</h3><div class="write-line"><b>论文写作提醒：</b>${s[2]}</div>`;bar.style.width=`${((evIndex+1)/c.steps.length)*100}%`;$("#prevEvidence").disabled=evIndex===0;$("#nextEvidence").textContent=evIndex===c.steps.length-1?"重新演练 ↻":"下一步 →"}
scenarioSel.onchange=()=>{evIndex=0;renderCase()};$("#prevEvidence").onclick=()=>{if(evIndex>0)evIndex--;renderCase()};$("#nextEvidence").onclick=()=>{const max=scenarios[scenarioSel.value].steps.length-1;evIndex=evIndex>=max?0:evIndex+1;renderCase()};renderCase();

fill($("#asmScene"),assembler.scenes);fill($("#asmProblem"),assembler.problems);fill($("#asmSolution"),assembler.solutions);fill($("#asmGuard"),assembler.guards);
$("#assembleBtn").onclick=()=>{const s=assembler.scenes[+$("#asmScene").value],p=assembler.problems[+$("#asmProblem").value],sol=assembler.solutions[+$("#asmSolution").value],g=assembler.guards[+$("#asmGuard").value];$("#assembledText").textContent=`首先，在${s}场景下，原系统存在${p}的问题。我们分析认为，该问题不仅影响接口响应效率，也可能在业务高峰期放大为系统稳定性风险。针对这一问题，我在架构设计中采用“${sol}”的方案，并结合现有业务边界对调用流程和关键组件进行了改造。同时，为避免局部故障继续扩散，系统增加了${g}机制。改造后，该场景下的处理过程更加稳定，系统的性能、可靠性和故障恢复能力均得到改善。`;};
$("#copyAssembled").onclick=async()=>{await navigator.clipboard.writeText($("#assembledText").textContent);$("#copyAssembled").textContent="已复制 ✓";setTimeout(()=>$("#copyAssembled").textContent="复制文本",1200)};

let quizIndex=0,score=0,answered=false;$("#total").textContent=quizzes.length;
function renderQuiz(){answered=false;const q=quizzes[quizIndex];$("#quizTag").textContent=q.tag;$("#quizQuestion").textContent=q.q;$("#quizExplain").hidden=true;$("#nextQuiz").disabled=true;$("#quizOptions").innerHTML=q.o.map((x,i)=>`<button class="quiz-option" data-i="${i}">${x}</button>`).join("");$("#quizOptions").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const i=+b.dataset.i;if(i===q.a){score++;b.classList.add("correct")}else{b.classList.add("wrong");$("#quizOptions").children[q.a].classList.add("correct")}$("#score").textContent=score;$("#quizExplain").textContent=q.e;$("#quizExplain").hidden=false;$("#nextQuiz").disabled=false})}
$("#nextQuiz").onclick=()=>{quizIndex=(quizIndex+1)%quizzes.length;if(quizIndex===0)score=0;$("#score").textContent=score;renderQuiz()};renderQuiz();

const root=document.documentElement;const mode=localStorage.getItem("interactive-theme")||"dark";if(mode==="light")root.classList.add("light");$("#themeBtn").onclick=()=>{root.classList.toggle("light");localStorage.setItem("interactive-theme",root.classList.contains("light")?"light":"dark")};