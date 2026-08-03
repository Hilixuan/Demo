window.GQ = {};

GQ.users = {
  "pm01": { name: "顾晓岚", role: "申报顾问", dept: "项目部" },
  "pm02": { name: "陈志远", role: "项目经理", dept: "项目部" },
  "admin": { name: "赵敏", role: "系统管理员", dept: "数字化部" }
};

GQ.nav = [
  { id: "home", title: "工作台", icon: "home", route: "#/home" },
  { id: "qa", title: "AI智库", icon: "spark", route: "#/qa" },
  { id: "kb", title: "知识库管理", icon: "book", route: "#/kb" },
  { id: "m02", title: "产业雷达", icon: "radar", route: "#/industry-config" },
  {
    id: "m03", title: "客户开发", icon: "users", route: "#/companies",
    children: [
      { id: "companies", title: "企业筛选", route: "#/companies" },
      { id: "evaluate", title: "项目评估", route: "#/evaluate" }
    ]
  },
  {
    id: "m04", title: "文书智写", icon: "file", route: "#/materials"
  },
  {
    id: "m05", title: "答辩准备", icon: "ppt", route: "#/ppt",
    children: [
      { id: "ppt", title: "答辩PPT", route: "#/ppt" },
      { id: "defense", title: "模拟答辩", route: "#/defense" }
    ]
  },
  {
    id: "m06", title: "系统设置", icon: "settings", route: "#/accounts",
    children: [
      { id: "accounts", title: "账号管理", route: "#/accounts" },
      { id: "permission", title: "权限管理", route: "#/permission" }
    ]
  }
];

GQ.notifications = [
  { id: 1, level: "red", title: "《XX市技术改造专项》材料缺口 4 项", text: "苏州智造精密装备有限公司 · 材料管理", time: "10 分钟前" },
  { id: 2, level: "yellow", title: "企业筛选 AI 建议 3 家企业进入访谈", text: "客户开发 · 企业洞察Agent", time: "32 分钟前" },
  { id: 3, level: "blue", title: "《先进制造业设备更新》申报文书预评审完成", text: "文书智写 · AI预评审 88 分", time: "1 小时前" },
  { id: 4, level: "yellow", title: "答辩演练待确认复盘记录", text: "答辩准备 · 专家问答演练", time: "2 小时前" },
  { id: 5, level: "blue", title: "产业雷达今日新增资讯 26 条", text: "新能源电池 · 重点提醒 3 条", time: "今早 08:30" },
  { id: 6, level: "red", title: "账号安全策略建议更新", text: "系统设置 · 密码有效期即将到期", time: "昨天" }
];

GQ.dashboard = {
  kpis: [
    { label: "今日申报任务", value: "18", delta: "+4", up: true, icon: "clipboard" },
    { label: "进行中项目", value: "36", delta: "+2", up: true, icon: "briefcase" },
    { label: "待确认 Agent 建议", value: "9", delta: "-3", up: true, icon: "spark" },
    { label: "本月生成文书", value: "47", delta: "+18%", up: true, icon: "file" }
  ],
  pipeline: [
    { label: "线索筛选", count: 128, active: true },
    { label: "项目评估", count: 42, active: true },
    { label: "待核实问题", count: 19, active: true },
    { label: "材料管理", count: 36, active: true },
    { label: "文书生成", count: 24, active: true },
    { label: "答辩演练", count: 11, active: false }
  ],
  todos: [
    { id: 1, module: "文书智写", level: "yellow", text: "确认《苏州智造设备更新专项申报书》AI 预评审结果", time: "截止 今天 17:00" },
    { id: 2, module: "客户开发", level: "blue", text: "审核企业洞察 Agent 推荐的 3 家候选企业", time: "截止 今天 18:00" },
    { id: 3, module: "材料管理", level: "red", text: "催收常州锂航 4 项缺失材料（设备发票）", time: "截止 明天 12:00" },
    { id: 4, module: "答辩准备", level: "yellow", text: "确认《先进制造业答辩PPT》骨架结构", time: "截止 明天 15:00" },
    { id: 5, module: "产业雷达", level: "blue", text: "确认新能源电池产业 3 条重点变化入库", time: "截止 明天 18:00" }
  ],
  agents: [
    { name: "智库 Agent", desc: "知识问答 · 记忆 · 档案查询", calls: 126, avg: "1.8s", status: "正常", icon: "book" },
    { name: "产业洞察 Agent", desc: "资讯跟踪 · 行业剖析", calls: 64, avg: "2.4s", status: "正常", icon: "radar" },
    { name: "企业洞察 Agent", desc: "企业画像 · 政策匹配", calls: 88, avg: "3.1s", status: "正常", icon: "users" },
    { name: "申报材料 Agent", desc: "文书生成 · 材料核验 · 质检", calls: 47, avg: "4.6s", status: "繁忙", icon: "file" },
    { name: "答辩支持 Agent", desc: "PPT 生成 · 问答演练", calls: 21, avg: "2.9s", status: "正常", icon: "ppt" },
    { name: "项目权限 Agent", desc: "账号 · 权限 · 审计", calls: 512, avg: "0.4s", status: "正常", icon: "shield" }
  ]
};

GQ.kbStats = [
  { label: "文档总数", value: "1,286", icon: "database" },
  { label: "政策库", value: "342", icon: "book" },
  { label: "项目库", value: "418", icon: "briefcase" },
  { label: "企业资料", value: "356", icon: "users" },
  { label: "历史案例", value: "126", icon: "folder" },
  { label: "内部经验", value: "44", icon: "spark" }
];

GQ.kbProjects = [
  { id: "proj-tech", name: "技术改造专项", desc: "设备更新与技改项目知识空间", count: 3 },
  { id: "proj-liangxin", name: "两新专项", desc: "大规模设备更新与以旧换新", count: 2 },
  { id: "proj-bio", name: "生物医药专项", desc: "创新药与医疗器械申报", count: 1 }
];

GQ.kbLibraries = [
  { id: "policy", name: "政策库", icon: "book", locked: true, desc: "政策文件、申报指南与评分标准，加密锁展示", count: 8 },
  { id: "enterprise", name: "企业资料", icon: "users", locked: false, desc: "企业画像、备案项目与证照材料", count: 6 },
  { id: "external", name: "外部资料", icon: "external", locked: false, desc: "公开政策、新闻与行业报告", count: 12 },
  { id: "history", name: "历史沉淀", icon: "folder", locked: false, desc: "历史案例、申报书样本与复盘", count: 5 },
  { id: "industry-news", name: "产业资讯", icon: "radar", locked: false, desc: "产业政策、技术动态与行业新闻", count: 9 },
  { id: "private", name: "个人库", icon: "lock", locked: true, desc: "个人草稿与内部经验，仅本人可见", count: 3 }
];

GQ.kbLibraryData = {
  policy: {
    folders: ["2026年度政策", "设备更新", "评分标准"],
    docs: [
      { name: "2026年工业领域设备更新和技术改造实施方案", type: "政策", keywords: ["设备更新", "技术改造"], folder: "设备更新", updated: "2026-07-28 14:20", by: "赵敏" },
      { name: "XX市制造业高质量发展专项资金申报指南", type: "政策", keywords: ["专项资金"], folder: "2026年度政策", updated: "2026-07-26 10:05", by: "赵敏" },
      { name: "两新专项申报口径问答汇总", type: "政策", keywords: ["两新", "申报口径"], folder: "2026年度政策", updated: "2026-07-15 16:40", by: "顾晓岚" },
      { name: "技术改造专项评分标准（2026版）", type: "标准", keywords: ["评分标准"], folder: "评分标准", updated: "2026-07-10 09:12", by: "陈志远" }
    ]
  },
  enterprise: {
    folders: ["苏州智造", "常州锂航", "已归档"],
    docs: [
      { name: "苏州智造精密装备有限公司资料包", type: "企业画像", keywords: ["数控装备"], folder: "苏州智造", updated: "2026-07-25 11:30", by: "顾晓岚" },
      { name: "苏州智造项目备案表及投资凭证", type: "备案项目", keywords: ["备案", "投资"], folder: "苏州智造", updated: "2026-07-24 15:18", by: "顾晓岚" },
      { name: "常州锂航新能源科技有限公司备案项目", type: "企业画像", keywords: ["锂电", "正极材料"], folder: "常州锂航", updated: "2026-07-12 17:02", by: "陈志远" }
    ]
  },
  external: {
    folders: ["政策公开信息", "行业新闻", "研究报告"],
    docs: [
      { name: "国家发展改革委设备更新政策解读（2026-07）", type: "外部政策", keywords: ["设备更新"], folder: "政策公开信息", updated: "2026-07-30 18:00", by: "产业洞察Agent" },
      { name: "动力电池回收利用专项支持政策原文", type: "外部政策", keywords: ["动力电池", "回收"], folder: "政策公开信息", updated: "2026-08-01 08:20", by: "产业洞察Agent" },
      { name: "2026 高端装备行业趋势报告（公开版）", type: "行业报告", keywords: ["高端装备"], folder: "研究报告", updated: "2026-07-22 09:40", by: "顾晓岚" }
    ]
  },
  history: {
    folders: ["优秀申报书", "答辩复盘", "访谈纪要"],
    docs: [
      { name: "2025年技术改造专项申报书（优秀样本）", type: "申报书样本", keywords: ["样本", "技改"], folder: "优秀申报书", updated: "2026-07-20 14:00", by: "王璐" },
      { name: "苏州智造答辩复盘记录", type: "复盘", keywords: ["答辩", "复盘"], folder: "答辩复盘", updated: "2026-07-19 10:30", by: "顾晓岚" },
      { name: "常州锂航首次访谈纪要", type: "访谈纪要", keywords: ["访谈"], folder: "访谈纪要", updated: "2026-07-08 16:22", by: "陈志远" }
    ]
  },
  private: {
    folders: ["我的草稿", "个人经验"],
    docs: [
      { name: "两新专项材料口径笔记", type: "内部经验", keywords: ["两新", "笔记"], folder: "个人经验", updated: "2026-07-29 20:15", by: "顾晓岚" },
      { name: "答辩提问应对草稿 v2", type: "草稿", keywords: ["答辩"], folder: "我的草稿", updated: "2026-07-27 22:40", by: "顾晓岚" }
    ]
  }
};

GQ.kbDocs = [
  { id: "KB-2026-118", name: "2026年工业领域设备更新和技术改造实施方案", type: "政策库", tags: ["设备更新", "技术改造"], level: "公开", version: "v3", status: "已生效", updated: "2026-07-28", size: "2.4 MB" },
  { id: "KB-2026-119", name: "XX市制造业高质量发展专项资金申报指南", type: "政策库", tags: ["专项资金"], level: "公开", version: "v2", status: "已生效", updated: "2026-07-26", size: "1.8 MB" },
  { id: "KB-2026-204", name: "苏州智造精密装备有限公司资料包", type: "企业资料", tags: ["企业画像"], level: "机密", version: "v1", status: "已生效", updated: "2026-07-25", size: "86 MB" },
  { id: "KB-2026-301", name: "2025年技术改造专项申报书（优秀样本）", type: "历史案例", tags: ["申报书", "样本"], level: "内部", version: "v5", status: "已失效", updated: "2026-07-20", size: "12 MB" },
  { id: "KB-2026-402", name: "企业访谈经验手册（2026版）", type: "内部经验", tags: ["访谈", "经验"], level: "内部", version: "v2", status: "已生效", updated: "2026-07-18", size: "3.1 MB" },
  { id: "KB-2026-105", name: "两新政策申报口径问答汇总", type: "政策库", tags: ["两新", "问答"], level: "公开", version: "v6", status: "已生效", updated: "2026-07-15", size: "980 KB" },
  { id: "KB-2026-207", name: "常州锂航新能源科技有限公司备案项目", type: "企业资料", tags: ["备案项目"], level: "机密", version: "v1", status: "待审核", updated: "2026-07-12", size: "5.6 MB" },
  { id: "KB-2026-110", name: "生物医药产业政策汇编（2026H1）", type: "政策库", tags: ["生物医药"], level: "公开", version: "v1", status: "已生效", updated: "2026-07-10", size: "4.2 MB" }
];

GQ.qaSuggestions = [
  "XX市技术改造专项对设备投资额有什么要求？",
  "苏州智造精密装备有限公司符合哪些政策方向？",
  "两新专项申报需要准备哪些证明材料？",
  "近三年同类项目申报通过率如何？"
];

GQ.qaChats = [
  { id: "c1", title: "技术改造专项 · 设备更新问答", project: "技术改造专项", time: "今天 14:22", msgs: 6 },
  { id: "c2", title: "两新专项 · 材料口径确认", project: "两新专项", time: "今天 10:05", msgs: 4 },
  { id: "c3", title: "生物医药 · 创新器械审查", project: "生物医药专项", time: "昨天 17:12", msgs: 8 },
  { id: "c4", title: "常州锂航 · 申报可行性", project: "技术改造专项", time: "07-31 16:40", msgs: 5 }
];

GQ.qaAnswer = {
  text: "根据本地政策库与历史案例，XX市技术改造专项的主要条件包括：1）项目固定资产投资不低于 500 万元，其中设备购置投资占比不低于 60%；2）企业须为独立法人且正常经营满 2 年；3）项目已完成备案并在建设期内。苏州智造精密装备有限公司当前备案项目投资 8,600 万元，设备购置 6,200 万元，占比 72%，符合投资额与设备占比要求；但项目开工日期为 2026-03-12，需在申报截止前完成投资凭证归集。",
  localCites: [
    { file: "2026年工业领域设备更新和技术改造实施方案", pos: "第 12 页 · 第三章 2.1", level: "公开" },
    { file: "XX市制造业高质量发展专项资金申报指南", pos: "第 8 页 · 申报条件", level: "公开" },
    { file: "苏州智造精密装备有限公司资料包", pos: "企业备案表 · 表 3", level: "机密" }
  ],
  externalCites: [
    { file: "国家发展改革委 2026-07 公开新闻", pos: "官网 · 政策解读", level: "外部" }
  ],
  actions: ["生成项目评估报告", "保存到公文包", "查看原文"]
};

GQ.reportTemplates = [
  { id: "r1", name: "产业数据分析报告", scope: "政策库 / 产业资讯 / 企业清单", format: "Word · 标准版式" },
  { id: "r2", name: "企业信息分析报告", scope: "企业资料 / 授权外部信息", format: "Word · 标准版式" },
  { id: "r3", name: "项目评估简报", scope: "企业资料 / 政策库 / 历史案例", format: "Word · 一页简报" }
];

GQ.traceRecords = [
  { id: "T-260801-01", question: "苏州智造是否符合XX市技改专项条件？", answer: "符合投资额、设备占比与备案要求，需补齐开工日期证明。", cites: 3, time: "2026-08-01 14:22", user: "顾晓岚", status: "已保存" },
  { id: "T-260801-02", question: "两新专项需准备哪些证明材料？", answer: "营业执照、备案证、设备合同发票、环评批复等 8 类材料。", cites: 2, time: "2026-08-01 13:05", user: "陈志远", status: "已保存" },
  { id: "T-260731-03", question: "新能源电池行业近三个月政策变化？", answer: "新增 3 项补贴政策、2 项技术标准征求意见稿。", cites: 4, time: "2026-07-31 18:40", user: "顾晓岚", status: "已保存" },
  { id: "T-260731-04", question: "历史同类项目申报通过率？", answer: "2025 年同类项目平均通过率约 76%，材料完整性影响最大。", cites: 2, time: "2026-07-31 16:12", user: "王璐", status: "草稿" }
];

GQ.industries = [
  { id: "bio", name: "生物医药", keywords: ["创新药", "医疗器械", "临床试验", "GMP"], sources: "国家药监局、省卫健委、行业媒体", freq: "每日 2 次", status: "运行中", lastRun: "08:30", today: 18 },
  { id: "chem", name: "化工新材料", keywords: ["新材料", "绿色化工", "循环经济"], sources: "工信部、行业协会、重点园区", freq: "每日 1 次", status: "运行中", lastRun: "08:00", today: 22 },
  { id: "newenergy", name: "新能源电池", keywords: ["动力电池", "储能", "钠离子电池", "回收"], sources: "工信部、科技部、企业公告", freq: "每日 3 次", status: "运行中", lastRun: "07:45", today: 26 },
  { id: "equip", name: "高端装备", keywords: ["智能制造", "工业母机", "机器人", "数控"], sources: "工信部、装备工业协会", freq: "每日 1 次", status: "已暂停", lastRun: "07-29", today: 0 }
];

GQ.news = [
  { id: 1, date: "2026-08-01", type: "政策", industry: "新能源电池", title: "XX省发布动力电池回收利用专项支持政策", source: "省工信厅官网", time: "08:15", tags: ["回收利用", "专项支持"], fav: false, important: true },
  { id: 2, date: "2026-08-01", type: "技术", industry: "生物医药", title: "新型小核酸药物完成 II 期临床入组", source: "医药经济报", time: "09:40", tags: ["小核酸", "临床"], fav: false, important: false },
  { id: 3, date: "2026-07-31", type: "政策", industry: "化工新材料", title: "绿色化工园区认定办法（征求意见稿）发布", source: "工信部", time: "17:20", tags: ["绿色化工", "认定"], fav: true, important: true },
  { id: 4, date: "2026-07-31", type: "新闻", industry: "高端装备", title: "XX机床集团发布五轴联动加工中心新品", source: "装备工业协会", time: "15:05", tags: ["工业母机", "新品"], fav: false, important: false },
  { id: 5, date: "2026-07-30", type: "政策", industry: "新能源电池", title: "储能电站安全规范征求意见", source: "国家能源局", time: "11:30", tags: ["储能", "安全规范"], fav: false, important: true },
  { id: 6, date: "2026-07-30", type: "技术", industry: "化工新材料", title: "万吨级生物基尼龙生产线投产", source: "行业周刊", time: "10:00", tags: ["生物基", "新材料"], fav: true, important: false },
  { id: 7, date: "2026-07-29", type: "政策", industry: "生物医药", title: "创新医疗器械特别审查程序更新", source: "国家药监局", time: "16:45", tags: ["器械", "审查"], fav: false, important: true },
  { id: 8, date: "2026-07-29", type: "新闻", industry: "新能源电池", title: "头部电池企业公布固态电池量产时间表", source: "企业公告", time: "09:10", tags: ["固态电池"], fav: false, important: false }
];

GQ.alerts = [
  { id: 1, level: "high", industry: "新能源电池", title: "动力电池回收专项支持政策发布", reason: "与 3 家目标企业备案项目方向高度相关", action: "建议转入产业知识库并关联企业筛选", time: "今日 08:20" },
  { id: 2, level: "medium", industry: "化工新材料", title: "绿色化工园区认定办法征求意见", reason: "区域内 2 个园区可能申报", action: "建议纳入政策跟踪并生成解读摘要", time: "今日 09:05" },
  { id: 3, level: "high", industry: "生物医药", title: "创新医疗器械特别审查程序更新", reason: "材料要求变化，可能影响 1 个在报项目", action: "建议人工确认并更新材料清单", time: "昨日 17:10" },
  { id: 4, level: "low", industry: "高端装备", title: "高端装备产业月度统计口径调整", reason: "统计口径变化，不影响当前申报", action: "仅记录归档", time: "昨日 15:30" }
];

GQ.knowledgeItems = [
  { id: 1, title: "动力电池回收利用专项支持政策要点", industry: "新能源电池", chain: "回收利用", type: "政策", confirmedBy: "顾晓岚", time: "今日 09:10", used: 4 },
  { id: 2, title: "绿色化工园区认定基础条件", industry: "化工新材料", chain: "绿色化工", type: "政策", confirmedBy: "陈志远", time: "昨日 18:20", used: 2 },
  { id: 3, title: "创新医疗器械特别审查材料变化", industry: "生物医药", chain: "器械注册", type: "政策", confirmedBy: "王璐", time: "昨日 17:40", used: 6 },
  { id: 4, title: "头部企业固态电池量产节奏整理", industry: "新能源电池", chain: "技术前沿", type: "技术", confirmedBy: "顾晓岚", time: "07-29", used: 3 },
  { id: 5, title: "万吨级生物基尼龙产业链机会", industry: "化工新材料", chain: "新材料", type: "技术", confirmedBy: "顾晓岚", time: "07-28", used: 1 }
];

GQ.companies = [
  { id: "C01", name: "苏州智造精密装备有限公司", region: "苏州", industry: "高端装备", projectType: "技术改造", invest: 8600, status: "在建", score: 92, risk: "低", brief: "数控机床核心零部件制造，设备购置 6,200 万元", evidence: "备案表 + 官网 + 企查查", follow: true,
    dims: [ { k: "区域适配", w: 20, s: 96 }, { k: "行业契合", w: 25, s: 94 }, { k: "项目类型", w: 20, s: 90 }, { k: "投资规模", w: 15, s: 88 }, { k: "政策方向", w: 20, s: 92 } ] },
  { id: "C02", name: "常州锂航新能源科技有限公司", region: "常州", industry: "新能源电池", projectType: "新建", invest: 15200, status: "备案", score: 88, risk: "中", brief: "锂电正极材料产线，含回收利用方向", evidence: "备案表 + 企业官网", follow: true,
    dims: [ { k: "区域适配", w: 20, s: 90 }, { k: "行业契合", w: 25, s: 92 }, { k: "项目类型", w: 20, s: 84 }, { k: "投资规模", w: 15, s: 95 }, { k: "政策方向", w: 20, s: 82 } ] },
  { id: "C03", name: "江苏晶材新材料有限公司", region: "南通", industry: "化工新材料", projectType: "技改扩建", invest: 6800, status: "在建", score: 85, risk: "中", brief: "生物基尼龙新材料，绿色化工方向", evidence: "备案表 + 环评公示", follow: true,
    dims: [ { k: "区域适配", w: 20, s: 88 }, { k: "行业契合", w: 25, s: 90 }, { k: "项目类型", w: 20, s: 82 }, { k: "投资规模", w: 15, s: 80 }, { k: "政策方向", w: 20, s: 86 } ] },
  { id: "C04", name: "杭州启源生物科技有限公司", region: "杭州", industry: "生物医药", projectType: "新建", invest: 12000, status: "备案", score: 81, risk: "高", brief: "小核酸药物研发与中试平台，临床进度待核实", evidence: "备案表 + 公开新闻", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 86 }, { k: "行业契合", w: 25, s: 88 }, { k: "项目类型", w: 20, s: 78 }, { k: "投资规模", w: 15, s: 90 }, { k: "政策方向", w: 20, s: 70 } ] },
  { id: "C05", name: "浙江绿能新能源科技有限公司", region: "湖州", industry: "新能源电池", projectType: "新建", invest: 9600, status: "在建", score: 79, risk: "中", brief: "储能系统集成，政策匹配需补充回收环节", evidence: "备案表", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 84 }, { k: "行业契合", w: 25, s: 82 }, { k: "项目类型", w: 20, s: 76 }, { k: "投资规模", w: 15, s: 86 }, { k: "政策方向", w: 20, s: 72 } ] },
  { id: "C06", name: "南京拓普新材料有限公司", region: "南京", industry: "化工新材料", projectType: "技术改造", invest: 4200, status: "竣工", score: 74, risk: "高", brief: "传统化工产线升级，绿色指标待补强", evidence: "备案表 + 企查查", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 82 }, { k: "行业契合", w: 25, s: 70 }, { k: "项目类型", w: 20, s: 80 }, { k: "投资规模", w: 15, s: 66 }, { k: "政策方向", w: 20, s: 72 } ] },
  { id: "C07", name: "无锡云帆智能装备有限公司", region: "无锡", industry: "高端装备", projectType: "技术改造", invest: 5300, status: "在建", score: 71, risk: "中", brief: "工业机器人集成应用，投资规模偏小", evidence: "备案表", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 80 }, { k: "行业契合", w: 25, s: 76 }, { k: "项目类型", w: 20, s: 74 }, { k: "投资规模", w: 15, s: 58 }, { k: "政策方向", w: 20, s: 68 } ] },
  { id: "C08", name: "安徽恒瑞化工材料有限公司", region: "合肥", industry: "化工新材料", projectType: "新建", invest: 11000, status: "备案", score: 68, risk: "高", brief: "精细化学品产线，环评与能耗指标待核实", evidence: "备案表", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 72 }, { k: "行业契合", w: 25, s: 74 }, { k: "项目类型", w: 20, s: 68 }, { k: "投资规模", w: 15, s: 84 }, { k: "政策方向", w: 20, s: 52 } ] },
  { id: "C09", name: "宁波海工智能装备有限公司", region: "宁波", industry: "高端装备", projectType: "技术改造", invest: 7100, status: "在建", score: 76, risk: "中", brief: "海工装备焊接自动化改造", evidence: "备案表 + 官网", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 78 }, { k: "行业契合", w: 25, s: 80 }, { k: "项目类型", w: 20, s: 76 }, { k: "投资规模", w: 15, s: 72 }, { k: "政策方向", w: 20, s: 74 } ] },
  { id: "C10", name: "上海赛因生物医药科技有限公司", region: "上海", industry: "生物医药", projectType: "新建", invest: 18000, status: "备案", score: 84, risk: "中", brief: "创新医疗器械产业化基地", evidence: "备案表 + 企查查 + 官网", follow: false,
    dims: [ { k: "区域适配", w: 20, s: 82 }, { k: "行业契合", w: 25, s: 90 }, { k: "项目类型", w: 20, s: 80 }, { k: "投资规模", w: 15, s: 92 }, { k: "政策方向", w: 20, s: 78 } ] }
];

GQ.policies = [
  { id: "P1", name: "XX市制造业高质量发展专项资金", type: "专项资金", deadline: "2026-09-30" },
  { id: "P2", name: "2026年工业领域设备更新和技术改造", type: "设备更新", deadline: "2026-09-15" },
  { id: "P3", name: "两新专项（大规模设备更新与消费品以旧换新）", type: "两新专项", deadline: "2026-10-20" }
];

GQ.evalReport = {
  company: "苏州智造精密装备有限公司",
  policy: "2026年工业领域设备更新和技术改造",
  score: 92,
  level: "建议申报",
  conditions: [
    { cond: "固定资产投资不低于 500 万元", status: "匹配", evidence: "备案投资 8,600 万元", conf: "高", manual: false },
    { cond: "设备购置投资占比不低于 60%", status: "匹配", evidence: "设备购置 6,200 万元，占比 72%", conf: "高", manual: false },
    { cond: "项目已完成备案", status: "匹配", evidence: "备案编号 WX-2026-0312", conf: "高", manual: false },
    { cond: "开工时间在政策有效期内", status: "待补充", evidence: "备案显示开工 2026-03-12，需提供开工证明", conf: "中", manual: true },
    { cond: "上年度营业收入不低于 2,000 万元", status: "待补充", evidence: "2025 审计报告未入库", conf: "低", manual: true }
  ],
  gaps: ["2025 年审计报告 / 财务报表", "项目开工证明", "设备购置合同及发票清单", "环评批复或豁免说明"],
  risks: [
    { text: "开工日期证明材料缺失，存在时效性风险", level: "高" },
    { text: "设备发票开票时间需覆盖 2026 年申报周期", level: "中" },
    { text: "企业信用报告未做最终核查", level: "低" }
  ]
};

GQ.interview = {
  company: "苏州智造精密装备有限公司",
  policy: "2026年工业领域设备更新和技术改造",
  profile: "数控机床核心零部件制造企业，成立于 2019 年，员工 186 人，主营高精度主轴与转台部件，客户覆盖头部机床厂商。",
  mainBusiness: "高精度主轴、数控转台、精密工装的设计与制造；2025 年营收约 5,200 万元。",
  projectBase: "备案项目为年产 3 万件精密主轴技术改造项目，总投资 8,600 万元，建设周期 2026-03 至 2027-06。",
  matchPoints: ["设备购置占比 72%，满足专项门槛", "属于工业母机核心零部件，政策鼓励方向", "项目处于在建期，符合申报窗口"],
  questions: [
    { q: "2025 年度审计报告是否已完成？营业收入是否达到 2,000 万元门槛？", why: "评估报告待补充项" },
    { q: "设备采购合同是否全部签订？发票进度如何？", why: "决定设备投资认定基数" },
    { q: "项目开工时间证明能否提供？是否有延期风险？", why: "影响申报时效性" },
    { q: "是否有环评批复或豁免说明？", why: "材料清单必备项" }
  ],
  gaps: ["2025 年审计报告", "开工证明", "设备发票清单", "环评批复"]
};

GQ.materials = [
  { name: "企业营业执照", format: "PDF/JPG", required: "是", valid: "有效期内", provided: "营业执照2026.pdf", status: "已具备", note: "原件扫描清晰", basis: "命中文件名：营业执照2026.pdf" },
  { name: "项目备案证", format: "PDF", required: "是", valid: "无", provided: "备案证.pdf", status: "已具备", note: "", basis: "命中文件名：备案证.pdf" },
  { name: "固定资产投资凭证", format: "Excel/PDF", required: "是", valid: "2026年度", provided: "投资凭证汇总.xlsx", status: "需人工确认", note: "金额与备案口径需核对", basis: "内容比对：金额口径需人工核对" },
  { name: "设备购置合同及发票", format: "PDF（多份）", required: "是", valid: "2026-01 后", provided: "—", status: "缺失", note: "已签订 4 份合同，发票待归集", basis: "目录扫描未命中合同/发票文件" },
  { name: "环评批复", format: "PDF", required: "是", valid: "有效期内", provided: "环评批复.pdf", status: "疑似过期", note: "批复日期 2022-09，需确认", basis: "有效期规则：批复日期超 3 年" },
  { name: "2025 年审计报告", format: "PDF", required: "是", valid: "2025 年度", provided: "—", status: "缺失", note: "企业尚未出具", basis: "目录扫描未命中审计报告" },
  { name: "项目开工证明", format: "PDF/照片", required: "是", valid: "无", provided: "开工照片_20260312.zip", status: "疑似不合规", note: "照片无时间水印，需补证明", basis: "文件名命中，内容校验缺时间水印" },
  { name: "专利及技术说明", format: "PDF/Word", required: "否", valid: "无", provided: "专利清单.pdf", status: "已具备", note: "", basis: "命中文件名：专利清单.pdf" }
];

GQ.applications = [
  {
    id: "mkd-2026",
    year: "2026",
    company: "华东某动力科技有限公司",
    shortName: "当前企业",
    type: "国债两新",
    policy: "2026年工业重点领域设备更新改造项目",
    progress: 72,
    owner: "顾晓岚",
    updated: "2026-08-02 17:20",
    status: "资料核验中",
    completeness: 78,
    score: 86,
    alert: "项目资料缺失：部分设备缺照片，合同/发票/付款回单口径待核对",
    stagnation: false,
    summary: "围绕设备更新、淘汰老旧设备和产线效率提升，申报国债两新设备更新专项。"
  },
  {
    id: "szzzao-2026",
    year: "2026",
    company: "华东某精密装备有限公司",
    shortName: "对比企业A",
    type: "国债两新",
    policy: "2026年工业领域设备更新和技术改造",
    progress: 58,
    owner: "陈志远",
    updated: "2026-07-29 10:30",
    status: "文书初稿",
    completeness: 64,
    score: 82,
    alert: "项目进度停滞30天未更新，审计报告与设备发票清单未补齐",
    stagnation: true,
    summary: "高精度主轴技改项目，设备购置占比高，需补齐资金口径与发票证据。"
  },
  {
    id: "czlh-2025",
    year: "2025",
    company: "华东某新能源科技有限公司",
    shortName: "对比企业B",
    type: "国债两新",
    policy: "大规模设备更新与消费品以旧换新专项",
    progress: 91,
    owner: "王璐",
    updated: "2025-12-18 14:45",
    status: "智能评分",
    completeness: 92,
    score: 90,
    alert: "评分意见待人工确认",
    stagnation: false,
    summary: "新能源电池产线升级项目，材料基本齐备，进入终版评分复核。"
  }
];

GQ.enterpriseFiles = [
  { id: "f01", group: "申报附件", name: "项目情况汇总表_脱敏示例.xlsx", type: "Excel", size: "128 KB", status: "已识别", note: "项目投资与设备清单主表" },
  { id: "f02", group: "申报附件", name: "企业承诺书_脱敏示例.docx", type: "Word", size: "46 KB", status: "已识别", note: "承诺主体与申报企业一致" },
  { id: "f03", group: "申报附件", name: "现场核查情况表_脱敏示例.docx", type: "Word", size: "58 KB", status: "待核对", note: "现场核查日期未填写" },
  { id: "f04", group: "设备合同/发票/照片", name: "设备证据索引表_脱敏示例.xlsx", type: "Excel", size: "92 KB", status: "已识别", note: "作为设备证据索引表" },
  { id: "f05", group: "设备合同/发票/照片", name: "设备A_合同发票包_缺现场照片.docx", type: "Word", size: "2.1 MB", status: "缺照片", note: "命中文件名缺设备照片" },
  { id: "f06", group: "设备合同/发票/照片", name: "设备B_合并付款凭证_金额待核.docx", type: "Word", size: "2.8 MB", status: "金额异常", note: "付款金额与合同/发票口径不一致" },
  { id: "f07", group: "设备合同/发票/照片", name: "设备C_使用地点待核_缺照片.docx", type: "Word", size: "2.6 MB", status: "需人工确认", note: "使用地点与申报主体需核实" },
  { id: "f08", group: "淘汰设备证明", name: "淘汰设备明细及现场照片汇总_脱敏示例.docx", type: "Word", size: "5.4 MB", status: "已识别", note: "支撑以旧换新和淘汰落后设备" }
];

GQ.materialInsights = [
  { id: "miss-photo", level: "高", title: "缺失资料", text: "设备A、设备C等证据包缺少现场照片，影响设备真实性证明。" },
  { id: "amount-conflict", level: "高", title: "金额逻辑矛盾", text: "设备B存在合并付款且金额差异，需拆分合同、发票、付款回单口径。" },
  { id: "site-check", level: "中", title: "主体/地点待核实", text: "部分设备备注为异地使用，需确认是否纳入当前企业本次申报范围。" },
  { id: "seal-missing", level: "中", title: "附件完整度", text: "现场核查情况表缺核查日期，第三方机构使用情况表需补盖章页。" }
];

GQ.liangxinOutline = [
  { id: "base", title: "一、项目单位基本情况", completeness: 92, missing: [], content: "当前申报企业具备设备更新申报主体资格，主营动力部件制造与精密加工，近年围绕自动化产线持续投入。" },
  { id: "need", title: "二、项目建设背景与必要性", completeness: 88, missing: ["需补充淘汰设备与新增设备效率对比"], content: "项目聚焦设备老化、加工效率不足和单位能耗偏高等问题，通过设备更新提升产能稳定性与产品一致性。" },
  { id: "plan", title: "三、建设内容与设备更新方案", completeness: 76, missing: ["部分设备缺现场照片", "设备购置合同与发票编号需补齐"], content: "项目拟更新数控加工、检测、抛光、起重等关键设备，形成从加工、检测到转运的连续化生产能力。" },
  { id: "fund", title: "四、投资构成与资金筹措", completeness: 68, missing: ["合并付款需拆分", "多付 2000 元需说明", "银行付款回单未完全归集"], content: "项目投资以设备购置和配套改造为主，资金来源包括企业自有资金和银行授信，需按申报口径统一合同、发票与付款金额。" },
  { id: "green", title: "五、节能降碳与安全环保", completeness: 72, missing: ["节能测算表", "安全环保合规说明"], content: "设备更新后预计提升单位产出效率，降低老旧设备维护频次，并改善现场安全和能耗管理水平。" },
  { id: "benefit", title: "六、实施计划与预期效益", completeness: 84, missing: ["产能爬坡测算依据"], content: "项目按设备采购、安装调试、试运行、验收四阶段推进，建成后预计提升生产效率并增强订单交付能力。" },
  { id: "appendix", title: "七、附件与证明材料", completeness: 61, missing: ["现场核查日期", "部分盖章页", "设备照片缺口清单"], content: "附件包括项目情况汇总表、企业承诺书、现场核查表、设备合同发票照片和第三方机构使用情况表等。" }
];

GQ.qcChecks = [
  { name: "数据一致性", status: "通过" },
  { name: "政策条件覆盖", status: "需确认" },
  { name: "证据引用", status: "通过" },
  { name: "行文逻辑", status: "建议修改" },
  { name: "格式规范", status: "通过" }
];

GQ.docOutline = [
  { id: 1, title: "第一章 项目单位基本情况", words: "620", status: "已完成", content: "苏州智造精密装备有限公司成立于 2019 年，注册资本 3,000 万元，主营高精度主轴、数控转台及精密工装的设计与制造，是国家级高新技术企业。2025 年实现营业收入约 5,200 万元，研发投入占比 8.6%，现有员工 186 人，其中研发人员占比 32%。" },
  { id: 2, title: "第二章 项目建设内容与投资构成", words: "880", status: "已完成", content: "本项目为年产 3 万件精密主轴技术改造项目，总投资 8,600 万元，其中固定资产投资 7,800 万元，设备购置投资 6,200 万元，占比 72%。建设内容包括新建精密加工车间、购置五轴加工中心与在线检测设备 26 台套，并部署 MES 数字化系统。" },
  { id: 3, title: "第三章 技术方案与先进性", words: "760", status: "已完成", content: "项目采用高精度主轴动平衡与热补偿控制技术，核心指标对标进口同类产品：主轴回转精度 0.5μm、温升控制 8℃ 以内。项目建成后将形成年产 3 万件精密主轴产能，填补区域高端机床核心零部件配套缺口。" },
  { id: 4, title: "第四章 资金筹措与财务分析", words: "540", status: "已完成", content: "项目资金中企业自有资金 5,400 万元，银行贷款 3,200 万元，计划申请专项补助。项目达产后预计年新增产值 1.2 亿元，新增利润 2,300 万元，投资回收期约 4.8 年。" },
  { id: 5, title: "第五章 实施计划与进度安排", words: "430", status: "已完成", content: "项目于 2026 年 3 月开工，已完成厂房改造与 12 台设备采购。计划 2026 年 10 月完成设备安装调试，2027 年 3 月试生产，2027 年 6 月竣工验收。" },
  { id: 6, title: "第六章 预期效益与风险应对", words: "510", status: "已完成", content: "项目预期带动区域高端装备产业链协同发展，预计新增就业 80 人。主要风险为设备交付延期与订单波动，已通过分阶段采购、签订锁价协议和多元化客户结构进行应对。" }
];

GQ.reviewResult = {
  total: 88,
  dims: [
    { name: "政策契合度", score: 92, note: "投资与设备占比充分匹配" },
    { name: "材料完整性", score: 78, note: "审计报告、发票清单缺失" },
    { name: "证据支撑度", score: 85, note: "多数结论有依据，开工证明待补" },
    { name: "行文逻辑", score: 88, note: "章节衔接顺畅" },
    { name: "格式规范", score: 96, note: "符合模板要求" }
  ],
  issues: [
    { level: "必须修改", pos: "第四章 · 资金筹措", text: "自有资金与贷款合计 8,600 万元，与总投资口径不一致，需核对", suggest: "核对资金来源明细后修正" },
    { level: "建议修改", pos: "第二章 · 设备清单", text: "设备购置占比 72% 的计算未列明口径", suggest: "补充设备清单汇总表" },
    { level: "需人工确认", pos: "第六章 · 风险应对", text: "“订单波动”风险未量化", suggest: "补充近三年订单与产能利用率数据" },
    { level: "建议修改", pos: "第一章 · 企业概况", text: "高新技术企业证书有效期未标注", suggest: "补充证书编号与有效期" }
  ]
};

GQ.qc = {
  batch: "QC-20260801-03",
  original: "项目总投资 8,600 万元，其中自有资金 5,400 万元、银行贷款 3,200 万元，申请专项补助资金 1,200 万元。",
  revised: "项目总投资 8,600 万元，其中企业自有资金 5,400 万元、银行贷款 3,200 万元。本次拟申请专项补助资金 1,200 万元，资金来源合计与总投资口径一致。",
  diff: [
    { type: "new", text: "本次拟申请专项补助资金 1,200 万元" },
    { type: "orig", text: "申请专项补助资金 1,200 万元" },
    { type: "new", text: "，资金来源合计与总投资口径一致。" }
  ],
  records: [
    { time: "2026-08-01 15:20", user: "申报材料 Agent", action: "定位口径不一致问题（第四章）", level: "必须修改" },
    { time: "2026-08-01 15:21", user: "顾晓岚", action: "授权修改并生成校订版 v1.2", level: "人工授权" },
    { time: "2026-08-01 15:22", user: "申报材料 Agent", action: "完成格式复检，通过", level: "正常" }
  ]
};

GQ.ppt = {
  slides: [
    { title: "项目背景与必要性", points: ["高端机床核心零部件国产化缺口", "区域产业链配套升级需求", "企业产能与工艺升级诉求"] },
    { title: "建设内容", points: ["年产 3 万件精密主轴技术改造", "新建精密加工车间 8,000㎡", "购置设备 26 台套"] },
    { title: "技术亮点", points: ["主轴回转精度 0.5μm", "热补偿控制与在线检测", "对标进口，成本降低 30%"] },
    { title: "资金需求", points: ["总投资 8,600 万元", "自有 5,400 万 + 贷款 3,200 万", "申请专项补助 1,200 万元"] },
    { title: "实施计划", points: ["2026.03 开工 · 已完成厂房改造", "2026.10 设备安装调试", "2027.06 竣工验收"] },
    { title: "预期效益", points: ["新增年产值 1.2 亿元", "新增利润 2,300 万元", "新增就业 80 人"] },
    { title: "风险应对", points: ["设备交付延期 → 分阶段采购", "订单波动 → 多元化客户", "资金压力 → 银行授信保障"] }
  ],
  notes: "第 3 页技术亮点建议用对比表展示精度指标；第 4 页资金需求需与审计口径一致；答辩时强调国产替代与区域配套价值。",
  questions: ["设备精度检测标准依据是什么？", "6,200 万元设备购置的合同与发票是否齐备？", "与进口设备相比成本优势如何测算？", "项目建成后产能消化路径是什么？"]
};

GQ.defense = [
  { id: 1, dim: "项目真实性", question: "如何证明项目已实际开工并完成部分投资？", sample: "可提供开工日期证明、设备采购合同、安装现场影像与投资凭证台账。" },
  { id: 2, dim: "资金合理性", question: "自有资金与银行贷款的比例如何确定？是否存在资金缺口？", sample: "自有资金 62.8%，贷款 37.2%，已有银行授信意向函，资金计划分三年投入。" },
  { id: 3, dim: "技术先进性", question: "0.5μm 主轴精度的检测方法与对标依据是什么？", sample: "采用 ISO 230 标准检测，对标国内头部企业公开指标与进口样本实测数据。" },
  { id: 4, dim: "实施可行性", question: "设备交付周期 2026 年 10 月前能否保证？", sample: "已签订 4 份采购合同，其中 12 台设备已完成签约付款，余量已与供应商确认排产。" },
  { id: 5, dim: "预期效益", question: "新增产值 1.2 亿元的依据是什么？", sample: "按已锁定订单 4,800 万元与产能爬坡测算，参考同类产线达产数据。" },
  { id: 6, dim: "材料完整性", question: "环评批复是否仍然有效？", sample: "原批复为 2022 年，已提请企业核实并准备重新报批或出具豁免说明。" }
];

GQ.accounts = [
  { name: "顾晓岚", account: "pm01", dept: "项目部", role: "申报顾问", scope: "苏州智造、常州锂航等 6 家", status: "启用", last: "今日 14:22" },
  { name: "陈志远", account: "pm02", dept: "项目部", role: "项目经理", scope: "全部项目（12 个）", status: "启用", last: "今日 13:05" },
  { name: "赵敏", account: "admin", dept: "数字化部", role: "系统管理员", scope: "全系统", status: "启用", last: "今日 11:40" },
  { name: "王璐", account: "pm03", dept: "项目部", role: "申报顾问", scope: "生物医药方向 4 家", status: "启用", last: "昨日 17:10" },
  { name: "李晨", account: "mkt01", dept: "市场部", role: "市场人员", scope: "商机筛选视图", status: "启用", last: "昨日 15:02" },
  { name: "周琳", account: "pm04", dept: "项目部", role: "申报顾问", scope: "化工新材料方向 3 家", status: "停用", last: "07-25 09:30" },
  { name: "孙浩", account: "mkt02", dept: "市场部", role: "市场人员", scope: "商机筛选视图", status: "启用", last: "07-24 16:48" },
  { name: "吴倩", account: "fin01", dept: "财务部", role: "财务复核", scope: "项目财务数据", status: "启用", last: "07-23 14:20" }
];

GQ.roleMatrix = {
  roles: ["系统管理员", "项目经理", "申报顾问", "市场人员", "财务复核"],
  perms: [
    { name: "工作台", value: [1, 1, 1, 1, 1] },
    { name: "AI智库", value: [1, 1, 1, 1, 1] },
    { name: "知识库管理", value: [1, 1, 1, 0, 0] },
    { name: "客户开发", value: [1, 1, 1, 1, 0] },
    { name: "文书撰写", sub: ["全部项目", "个人项目"], value: [1, 1, 1, 0, 0] },
    { name: "答辩准备", value: [1, 1, 1, 0, 0] },
    { name: "系统设置", sub: ["账号管理", "权限管理"], value: [1, 0, 0, 0, 0] }
  ]
};

GQ.audits = [
  { time: "2026-08-01 14:22", user: "顾晓岚", action: "智能问答", object: "苏州智造 · 技改条件", result: "成功", ip: "192.168.10.26", type: "查询" },
  { time: "2026-08-01 14:25", user: "顾晓岚", action: "导出申请", object: "项目评估报告", result: "待审批", ip: "192.168.10.26", type: "导出" },
  { time: "2026-08-01 13:05", user: "陈志远", action: "查看机密资料", object: "常州锂航 · 财务资料包", result: "已授权", ip: "192.168.10.31", type: "访问" },
  { time: "2026-08-01 11:40", user: "赵敏", action: "权限变更", object: "周琳账号停用", result: "成功", ip: "192.168.10.5", type: "管理" },
  { time: "2026-08-01 09:12", user: "系统", action: "异常登录提醒", object: "mkt01 · 异地 IP", result: "已拦截", ip: "203.0.113.44", type: "安全" },
  { time: "2026-07-31 18:40", user: "顾晓岚", action: "保存公文包", object: "新能源电池政策解读", result: "成功", ip: "192.168.10.26", type: "知识" },
  { time: "2026-07-31 16:12", user: "王璐", action: "AI 评审", object: "启源生物 · 申报书 v0.9", result: "成功", ip: "192.168.10.42", type: "AI" }
];

GQ.security = [
  { name: "密码复杂度", desc: "不少于 10 位，含大小写字母与数字", value: true },
  { name: "登录有效期", desc: "会话 24 小时后失效，可配置", value: "24 小时" },
  { name: "二次验证", desc: "管理员与高敏操作启用动态验证码", value: true },
  { name: "异常登录提醒", desc: "异地或夜间登录触发提醒与拦截", value: true },
  { name: "账号锁定", desc: "连续 5 次失败锁定 30 分钟", value: true },
  { name: "导出审批", desc: "机密资料与申报文书导出需管理员审批", value: true },
  { name: "管理员审批", desc: "账号创建、权限变更、停用需管理员确认", value: true }
];

/* ===== 文书智写 PRD 需求标注 ===== */
GQ.prdDocs = [
  { id: "prd-01", num: 1, view: "projects", attach: "page", type: "feature", priority: "P0", title: "以项目为中心的工作台组织", desc: "文书智写以企业申报项目为中心组织资料、文书生成、AI 调优与智能评分；项目按年份拆分，并按更新时间倒序展示，支持新增企业项目。", accept: ["进入文书智写默认展示项目管理页，项目按年份分组且按更新时间倒序", "新增项目后可在列表中看到该项目并进入对应工作台", "项目卡片展示申报类型、政策、负责人、更新时间和项目进度"] },
  { id: "prd-02", num: 2, view: "projects", attach: "page", type: "feature", priority: "P1", title: "项目告警与进度跟踪", desc: "项目卡片展示资料完整度与智能评分；AI 告警信息浮层集中展示资料缺失、进度停滞、金额口径矛盾等项目风险。", accept: ["每个项目卡片展示资料完整度与智能评分", "存在告警的项目在 AI 告警浮层中展示对应风险条目", "告警浮层支持展开与收起"] },
  { id: "prd-03", num: 3, view: "projects", attach: "page", type: "feature", priority: "P1", title: "归档与只读控制", desc: "项目归档后进入只读状态，仅可查看详情；支持重启制作恢复编辑、调优与评分操作。", accept: ["归档后展示只读横幅，编辑类按钮禁用", "点击重启制作后恢复可编辑状态", "归档与重启状态在工作台内可见"] },
  { id: "prd-04", num: 4, view: "projects", attach: "page", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "项目进度智能汇总", desc: "申报材料 Agent 自动汇总项目进度、资料完整度与智能评分，并生成项目摘要文案，辅助申报顾问快速判断项目状态。", accept: ["Agent 汇总的项目进度、完整度与评分和项目卡片一致", "摘要文案两句话内说明项目定位与当前状态", "演示中点击项目卡片直接进入对应工作台"] },
  { id: "prd-05", num: 5, view: "files", attach: "files-main", type: "feature", priority: "P0", title: "企业文件资料库", desc: "企业资料按申报附件、设备合同/发票/照片、淘汰设备证明等目录分类展示，支持上传、AI 识别、查看与删除。", accept: ["文件列表展示名称、类型、大小、状态与识别说明", "支持按目录分组浏览", "上传或 AI 识别后可更新文件状态"] },
  { id: "prd-06", num: 6, view: "files", attach: "files-ai", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "AI 资料识别与风险提示", desc: "申报材料 Agent 扫描文件目录，识别缺失资料、金额逻辑矛盾、主体/地点待核实与附件完整度问题，输出建议并支持标记已解决。", accept: ["点击 AI 识别后展示缺失、矛盾、待核实等洞察条目", "每条洞察可标记已解决并从工作清单移除", "识别结论包含文件名命中、内容比对或有效期规则等判定依据"] },
  { id: "prd-07", num: 7, view: "writer", attach: "writer-outline", type: "feature", priority: "P0", title: "两新文书一级目录", desc: "按参考模板提炼申报书大纲，逐章展示资料完整度与缺失项，支持选中章节查看当前资料状态。", accept: ["一级目录按章节列出并展示完整度百分比", "完整度不足的章节展示缺失资料清单", "点击章节可切换当前章节资料与缺口信息"] },
  { id: "prd-08", num: 8, view: "writer", attach: "writer-doc", type: "feature", priority: "P0", title: "对话式文书生成", desc: "申报顾问输入生成要求后，系统结合专项政策、企业资料包与文书模板生成申报书初稿，并写入实时草稿缓存。", accept: ["生成前可设置或上传政策、资料包与模板", "生成过程展示步骤进度", "生成后展示文书初稿、章节字数与资料缺口标注"] },
  { id: "prd-09", num: 9, view: "writer", attach: "writer-outline", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "章节资料缺口检测", desc: "申报材料 Agent 逐章校验资料完整度并标注缺失资料项，为文书生成提供完整性输入。", accept: ["每个章节展示 Agent 判定的完整度", "缺失项以红色标签展示在对应章节", "判定依据支持查看（文件名、内容比对、有效期规则）"] },
  { id: "prd-10", num: 10, view: "writer", attach: "writer-doc", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "文书主体 AI 生成", desc: "申报材料 Agent 读取企业资料库、匹配两新申报模板、生成文书主体并标注证据缺口，草稿实时缓存。", accept: ["生成结果包含六章正文与参考片段", "资料缺口以标签形式标注", "未存档时继续微调会覆盖当前草稿"] },
  { id: "prd-11", num: 11, view: "writer", attach: "writer-doc", type: "feature", priority: "P1", title: "文书编辑、存档与版本管理", desc: "支持正文编辑、选择参考文件、发送调优要求、存档快照、版本历史与导出 Word。", accept: ["支持对文书草稿进行人工编辑", "存档后进入历史记录并生成版本号", "可导出 Word，导出前执行权限校验"] },
  { id: "prd-12", num: 12, view: "tune", attach: "tune-compare", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "雷同片段横向对比", desc: "申报材料 Agent 扫描段落相似度、企业特色缺口与通用化表达，并与项目库其他文书交叉验证，提示雷同风险。", accept: ["每条提示包含雷同等级、章节、相似度与修改建议", "雷同片段与对比项目可见", "Agent 建议可直接定位到对应段落"] },
  { id: "prd-13", num: 13, view: "tune", attach: "tune-main", type: "feature", priority: "P1", title: "定位调优与人工确认修改", desc: "对 Agent 提出的雷同或调优建议，可定位到具体段落，并由人工确认后应用修改，修改内容写入草稿。", accept: ["定位后高亮对应章节段落", "点击人工确认修改后更新草稿并提示", "归档只读状态下按钮禁用"] },
  { id: "prd-14", num: 14, view: "tune", attach: "tune-main", type: "agent", priority: "P1", agent: "申报材料 Agent", title: "对话式局部微调", desc: "申报顾问输入局部调优要求后，申报材料 Agent 更新对应章节内容，避免整篇重写。", accept: ["输入微调要求后可更新草稿对应内容", "Agent 回复说明调整要点", "未保存时后续操作覆盖草稿"] },
  { id: "prd-15", num: 15, view: "score", attach: "score-ai", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "AI 智能评分", desc: "申报材料 Agent 按政策契合度、材料完整性、证据支撑度、行文逻辑、格式规范五维对文书评分，输出综合评估报告与短板说明。", accept: ["展示总分与五维得分", "报告说明当前文书短板", "评分结果仅作参考，最终以人工评审为准"] },
  { id: "prd-16", num: 16, view: "score", attach: "score-proof", type: "agent", priority: "P0", agent: "申报材料 Agent", title: "AI 全文校对", desc: "AI 校对锁定逻辑错误、前后矛盾与数据口径风险，按必须修改、建议修改、需人工确认分级输出修改建议。", accept: ["每条问题包含级别、位置、问题描述与建议", "问题清单固定高度滚动浏览", "问题处理完成后展示清空态"] },
  { id: "prd-17", num: 17, view: "score", attach: "score-main", type: "feature", priority: "P1", title: "人工确认修改与收尾", desc: "对 AI 校对问题支持手动修改、针对提示微调或同意修改；全部处理后导出文档并归档项目。", accept: ["每条校对建议提供手动修改、针对微调、同意修改三种处理", "处理后条目从问题列表移除", "全部处理后展示完成态并支持导出与归档"] }
];
