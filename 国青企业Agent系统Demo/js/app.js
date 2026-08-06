/* 国青企业 Agent 系统 · 一阶段可交互 Demo */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const state = {
    user: null,
    route: "home",
    evalCompany: "C01",
    qaCites: [],
    qaConv: "c1",
    kbProject: "proj-tech",
    kbLib: null,
    kbFolder: null,
    industryFilter: "全部",
    industryType: "全部",
    industryName: "全部",
    newsFav: new Set(GQ.news.filter(n => n.fav).map(n => n.id)),
    alertsDone: new Set(),
    docRefined: false,
    materialConfirmed: false,
    applicationId: null,
    applicationTab: "files",
    activeOutline: "base",
    alertCollapsed: false,
    aiScanDone: false,
    resolvedInsights: new Set(),
    docGenerated: false,
    locatedTarget: null,
    archivedApps: new Set(),
    scoreResolved: new Set(),
    appSnapshots: [],
    scoreCollapsed: false,
    qcChecked: false,
    qcApproved: false,
    qcIssueState: {},
    expandedNav: new Set(),
    docVersions: [],
    evalHistory: [
      { id: 1, companyId: "C01", company: "苏州智造精密装备有限公司", policy: "2026年工业领域设备更新和技术改造", score: 92, level: "建议申报", time: "2026-08-01 14:22", approved: true, approvedBy: "顾晓岚", approvedAt: "2026-08-01 15:30" },
      { id: 2, companyId: "C02", company: "常州锂航新能源科技有限公司", policy: "两新专项（大规模设备更新与消费品以旧换新）", score: 88, level: "建议申报", time: "2026-08-01 13:05", approved: false },
      { id: 3, companyId: "C04", company: "杭州启源生物科技有限公司", policy: "XX市制造业高质量发展专项资金", score: 81, level: "需补充材料", time: "2026-07-31 16:12", approved: false }
    ],
    pptActive: 0,
    defenseCurrent: null,
    accounts: GQ.accounts.slice(),
    security: GQ.security.map(s => Object.assign({}, s)),
    customRoles: [],
    editRoleIdx: -1,
    candidateIds: new Set(["C01", "C02", "C03"])
  };

  const AGENT_MARKS = {
    projectAlert: {
      title: "项目进度与资料告警",
      agent: "项目权限Agent + 申报材料Agent",
      desc: "项目权限Agent负责项目可见范围、项目分配和进度状态；申报材料Agent联动材料齐备度，触发资料缺失严重、进度停滞等告警。",
      input: "项目主数据、项目成员关系、申报进度、材料状态、告警记录。",
      output: "项目告警、进度异常提示、资料缺失提醒、项目状态联动结果。",
      acceptance: "项目运营人员可查看全部项目；技术人员仅可见本人负责项目；进度停滞/材料缺失严重可自动告警；全部操作有权限校验与审计。"
    },
    materialUpload: {
      title: "企业资料上传与目录索引",
      agent: "申报材料Agent + 项目权限Agent",
      desc: "申报材料Agent读取企业资料包或本地目录索引，识别合同、发票、付款回单、设备照片、申报附件等资料；项目权限Agent控制资料读取和导出权限。",
      input: "企业资料文件夹、知识库企业资料包、材料需求文件/模板、政策材料要求。",
      output: "文件分类、元数据抽取结果、材料入库状态、资料维护留痕。",
      acceptance: "支持按目录索引导入资料；仅项目成员可访问；企业资料读取、下载、导出需权限校验；人工修改记录操作人。"
    },
    materialScan: {
      title: "Agent资料识别",
      agent: "申报材料Agent",
      desc: "扫描企业资料并进行OCR/解析、文件分类、数据清洗、脏数据识别、缺失资料提示和逻辑矛盾检测。",
      input: "企业资料文件、材料需求清单、政策材料要求、人工已解决记录。",
      output: "已具备/缺失/疑似不合规/疑似过期/需人工确认状态，判定依据和个人工作清单。",
      acceptance: "每条识别结果需展示判定依据；点击已解决只移出个人工作清单，若资料未实际补齐，下次AI识别仍会重新提示。"
    },
    chapterOutline: {
      title: "章节资料完整度检查",
      agent: "申报材料Agent + 智库Agent",
      desc: "根据两新专项模板、评分标准和企业资料，生成文书一级目录，逐章检查写作所需资料完整度和缺失数据类型。",
      input: "企业资料包、专项政策模板、文书模板、评分标准、历史样本。",
      output: "章节大纲、每章完整度、资料缺口、需人工确认项。",
      acceptance: "能基于材料包和模板生成提纲；每章显示完整度和缺失资料；缺失资料可点击查看；无依据内容不得写成事实。"
    },
    docGenerate: {
      title: "两新文书生成",
      agent: "申报材料Agent",
      desc: "执行解析企业资料、政策条件映射、生成提纲、章节草稿、附件匹配和资料缺口标注，生成文书主体内容。",
      input: "材料管理已确认的企业资料包、专项政策模板、评分标准、历史样本和用户生成要求。",
      output: "申报文书初稿、附件清单、问题清单、资料缺口标注、实时缓存草稿。",
      acceptance: "生成过程需有AI动效和进度；生成后文书主体可查看；未手动存档时持续覆盖当前草稿；定稿版本可追溯。"
    },
    docRealtime: {
      title: "文书实时校验与版本留痕",
      agent: "申报材料Agent + 项目权限Agent",
      desc: "对当前草稿进行实时校验、缓存和版本管理；导出、存档、历史记录等动作需权限校验并留痕。",
      input: "最新文书草稿、章节缺口、用户微调记录、版本快照。",
      output: "实时草稿、手动存档版本、历史记录、导出文档。",
      acceptance: "点击存档才生成历史快照；未存档修改覆盖最新草稿；导出需权限校验并记录审计。"
    },
    writerChat: {
      title: "对话式文书微调",
      agent: "申报材料Agent + 智库Agent",
      desc: "围绕当前文书草稿和参考文件执行局部改写、章节补强、数值口径说明和证据引用补充。",
      input: "当前草稿、选中参考文件、用户调优要求、政策/评分标准和历史样本。",
      output: "候选改写建议、局部更新后的草稿、引用依据和操作记录。",
      acceptance: "支持对话微调；输出建议需围绕当前文书和已选资料；重要修改需人工确认后覆盖当前草稿。"
    },
    locateTune: {
      title: "定位调优",
      agent: "申报材料Agent",
      desc: "支持定位某个段落、数值、图表或章节，并只对定位范围生成修改建议，避免影响整篇文书结构。",
      input: "定位目标、当前文书草稿、用户修改说明、相关证据材料。",
      output: "定位高亮、局部修改建议、覆盖后的当前草稿。",
      acceptance: "能定位到章节/段落/数值/图表；Agent仅对定位范围生成建议；修改需人工确认。"
    },
    compareSelect: {
      title: "横向比对文本选择",
      agent: "申报材料Agent + 项目权限Agent",
      desc: "从知识库企业资料库中多选授权文本，作为同机构文书横向比对样本；项目权限Agent控制跨企业比对范围和脱敏展示。",
      input: "企业资料库文本、历史申报文书、历史案例、企业画像和授权范围。",
      output: "已选比对文本、可用横向比对样本、脱敏比对范围。",
      acceptance: "横向比对需先选择授权文本；敏感数据脱敏显示；无权限企业资料不可参与比对。"
    },
    aiTune: {
      title: "同质化检测与特色增强",
      agent: "申报材料Agent",
      desc: "读取当前文书章节、表格、指标、附件引用和关键事实，识别与其他文书相似度过高的段落，并提示差异化修改方向。",
      input: "当前文书草稿、已选横向比对文本、政策细则、企业资料和历史样本。",
      output: "高相似段落、相似度、风险等级、企业特色补强建议、定位入口。",
      acceptance: "能识别高相似段落并定位到章节；给出原因与风险等级；自动修改需人工授权；二次差异化校验通过后可流转。"
    },
    score: {
      title: "AI评分",
      agent: "申报材料Agent + 智库Agent",
      desc: "根据评分标准对文书进行综合评分，结合政策细则和历史案例输出优劣势、综合评估报告和优化建议。",
      input: "文书终稿、评分标准、政策细则、企业资料、历史案例。",
      output: "综合得分、维度得分、优势/劣势、优化建议和综合评估报告。",
      acceptance: "能按评分标准综合评分；各维度得分可展示；修改建议需有依据；评分批次可追溯。"
    },
    proofread: {
      title: "AI校对",
      agent: "申报材料Agent",
      desc: "对全文执行数据一致性、政策条件覆盖、证据引用、行文逻辑和格式规范校验，定位到章节、表格或附件。",
      input: "文书终稿、附件材料、政策评分细则、企业数据和项目资料库。",
      output: "建议修改条数、问题位置、风险等级、原因说明、候选修改建议。",
      acceptance: "校对问题需定位到具体位置；建议有原因和风险等级；只允许对单条提示进行授权修改或提示级微调。"
    },
    archive: {
      title: "导出与归档",
      agent: "项目权限Agent + 申报材料Agent",
      desc: "项目权限Agent负责导出审批、归档权限和审计；申报材料Agent关联文书版本、材料清单与质检批次。",
      input: "最终文书、评分/校对结果、材料清单、质检批次、归档动作。",
      output: "导出文档、归档项目、只读项目详情、重启制作入口。",
      acceptance: "导出和归档需权限校验并留痕；归档后项目进度100%且不可操作；支持重新启动制作。"
    }
  };

  const AGENT_PRD_MARKS = {
    material: {
      title: "材料核验 Agent",
      agent: "2. 材料核验 Agent",
      role: "申报材料的智能鉴定师，负责上传解析、清洗比对和缺口识别。",
      capabilities: ["多格式解析", "元数据抽取", "材料清单比对", "缺口识别", "材料包快照"],
      input: "上传材料包（文件列表 + 项目信息）。包括材料包上传（多格式文件列表）+ 项目 ID、按项目类型匹配的材料需求清单、OCR 低置信度确认结果、材料齐备确认指令。",
      output: "材料核验比对报告（整体状态 + 逐项状态 + 补充清单）或材料包快照。",
      collaboration: "低置信度 OCR / 疑似不合规由人工逐条确认；材料齐备确认由人工最终确认，防漏检。",
      quality: "OCR 文本提取准确率 ≥ 95%；材料状态判断准确率 ≥ 90%；缺失项识别召回率 ≥ 98%；单次核验平均耗时 ≤ 2 分钟。"
    },
    writer: {
      title: "文书生成 Agent",
      agent: "3. 文书生成 Agent",
      role: "基于材料包和政策模板的申报文书智能写作师。",
      capabilities: ["模板匹配", "覆盖度分析", "提纲预览", "初稿生成", "章节级对话微调", "版本管理"],
      input: "“材料就绪”信号 + 材料包快照 ID + 项目类型 + 申报需求。还包括提纲确认、章节级修改指令、保留版本指令、评审不通过 + 问题清单。",
      output: "章节模板框架 + 覆盖度分析报告 + 提纲预览 + 初稿正文（含材料来源引用和置信度标注）。",
      collaboration: "提纲确认、初稿审阅、版本保留由人工确认；缺口决策由人工判断补充材料还是放宽要求；对话微调超过 5 轮未定稿时建议保留版本或重写。",
      quality: "评分要点覆盖率 ≥ 95%；材料来源可溯源率 ≥ 90%；编造数据（幻觉率）≤ 2%；人工修改率 ≤ 20%；初稿生成耗时 ≤ 5 分钟。"
    },
    qc: {
      title: "调优质检 Agent",
      agent: "4. 调优质检 Agent",
      role: "申报文书的全面质检师，在 AI 评审前执行基础合规校验，拦截低质量文稿。",
      capabilities: ["五类校验", "横向比对", "差异性检测", "校订版生成"],
      input: "文书初稿（含章节结构和内容）+ 同批次其他企业文书（脱敏后）。还包括历史高分文书、校订版生成授权。",
      output: "结构化质检报告（五类校验结果 + 横向比对结果 + 差异性检测结果 + 问题清单 + 修改建议）。",
      collaboration: "质检报告输出问题清单 + 修改建议，不设通过/不通过判定；人工逐条确认是否采纳；校订版生成必须人工授权；横向比对阈值可人工调整。",
      quality: "问题定位到章节/段落/表格/附件；修改建议有原因和风险等级；校订版保留原稿只读备份 + 批注 + 修订记录。"
    },
    review: {
      title: "AI 评审 Agent",
      agent: "5. AI 评审 Agent",
      role: "模拟评审专家的角色，按《评分标准》对文书逐维度打分，输出问题清单和调优建议。",
      capabilities: ["评分标准解析", "多维度打分", "扣分原因生成", "问题清单分级", "调优建议定位"],
      input: "质检验通过的文书 + 对应项目类型的评分标准（各维度权重与细则）。还包括评分标准、人工确认反馈、历史评审样本。",
      output: "多维打分报告（逐维度分数 + 扣分原因 + 综合得分）+ 问题清单（按严重程度分级）+ 调优建议（定位到章节段落）。",
      collaboration: "评审结果仅作为辅助决策；问题清单和调优建议需要人工确认后再进入修改或定稿流程。",
      quality: "按评分标准逐维度给分；扣分原因可解释；调优建议定位到章节段落；评分批次与依据可追溯。"
    }
  };

  const AGENT_MARK_ALIASES = {
    materialUpload: "material",
    docGenerate: "writer",
    qcEntry: "qc",
    score: "review"
  };

  /* ===== 图标 ===== */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    book: '<path d="M4 4h10a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M17 7h3v13H7"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 12l5-3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    ppt: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 12h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    spark: '<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M15 7l3 3M18 4l3 3"/>',
    bar: '<path d="M3 3v18h18"/><path d="M7 15v3M12 9v9M17 5v13"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.spark) + "</svg>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ===== 通用反馈 ===== */
  function toast(msg, type) {
    const box = document.createElement("div");
    box.className = "toast " + (type || "");
    box.innerHTML = icon(type === "success" ? "check" : type === "error" ? "alert" : "spark") + "<span>" + esc(msg) + "</span>";
    $("#toast-root").appendChild(box);
    setTimeout(() => { box.style.opacity = "0"; box.style.transition = "opacity .25s"; setTimeout(() => box.remove(), 260); }, 2600);
  }

  function modal(title, sub, body, foot) {
    $("#modal-root").innerHTML =
      '<div class="modal-mask" data-close="modal"><div class="modal">' +
      '<div class="modal-head"><div><div class="modal-title">' + title + '</div><div class="modal-sub">' + (sub || "") + "</div></div>" +
      '<button class="icon-btn" data-close="modal" aria-label="关闭">' + icon("x") + "</button></div>" +
      "<div>" + body + "</div>" +
      (foot ? '<div class="modal-foot">' + foot + "</div>" : "") +
      "</div></div>";
  }

  function closeModal() { $("#modal-root").innerHTML = ""; }

  function drawer(title, sub, body, foot) {
    $("#drawer-root").innerHTML =
      '<div class="drawer-mask" data-close="drawer"></div>' +
      '<div class="drawer"><div class="drawer-head"><div><div class="modal-title">' + title + '</div><div class="modal-sub">' + (sub || "") + "</div></div>" +
      '<button class="icon-btn" data-close="drawer" aria-label="关闭">' + icon("x") + "</button></div>" +
      '<div class="drawer-body">' + body + "</div>" +
      (foot ? '<div class="drawer-foot">' + foot + "</div>" : "") +
      "</div>";
  }

  function closeDrawer() { $("#drawer-root").innerHTML = ""; }

  function st(text) {
    const t = String(text || "");
    let cls = "tag-gray";
    if (/生效|完成|正常|具备|成功|匹配|运行中|启用|通过|已读|低/.test(t)) cls = "tag-green";
    else if (/确认|待审|进行中|补充|草稿|繁忙|过期|不合规|中/.test(t)) cls = "tag-yellow";
    else if (/缺失|失败|拦截|异常|停用|高|必须|风险/.test(t)) cls = "tag-red";
    else if (/建议|信息|新建|公开|内部|备案/.test(t)) cls = "tag-blue";
    return '<span class="tag ' + cls + '">' + esc(t) + "</span>";
  }

  function agentMark(id) {
    if (!AGENT_MARK_ALIASES[id]) return "";
    return '<button class="agent-mark-dot" data-action="agent-mark" data-mark="' + esc(id) + '" title="查看 Agent PRD" aria-label="查看 Agent PRD"></button>';
  }

  function agentTitle(text, id) {
    return '<span class="agent-title-mark"><span>' + esc(text) + '</span>' + agentMark(id) + '</span>';
  }

  function agentMarkModal(id) {
    const m = AGENT_PRD_MARKS[AGENT_MARK_ALIASES[id]];
    if (!m) return;
    const caps = m.capabilities.map(x => '<span class="agent-cap-chip">' + esc(x) + '</span>').join("");
    drawer(m.title, m.agent,
      '<div class="agent-spec">' +
      '<div class="agent-spec-hero"><div class="agent-spec-dot"></div><div><b>角色定位</b><p>' + esc(m.role) + '</p></div></div>' +
      '<div class="agent-spec-section"><b>核心能力</b><div class="agent-cap-list">' + caps + '</div></div>' +
      '<div class="agent-spec-grid">' +
      '<div><b>输入</b><p>' + esc(m.input) + '</p></div>' +
      '<div><b>输出</b><p>' + esc(m.output) + '</p></div>' +
      '</div>' +
      '<div class="agent-spec-accept"><b>人机协同</b><p>' + esc(m.collaboration) + '</p></div>' +
      '<div class="agent-spec-accept"><b>质量要求</b><p>' + esc(m.quality) + '</p></div>' +
      '</div>',
      '<button class="btn btn-primary" data-close="drawer">我知道了</button>');
  }

  /* ===== 流程动画 ===== */
  function runFlow(container, steps, finalHtml, stepMs) {
    let i = 0;
    container.innerHTML = '<div class="agent-steps"><span class="spin"></span><span class="flow-text">' + esc(steps[0]) + "</span></div>";
    const tick = setInterval(() => {
      i += 1;
      if (i < steps.length) {
        const el = container.querySelector(".flow-text");
        if (el) el.textContent = steps[i];
      } else {
        clearInterval(tick);
        container.innerHTML = finalHtml;
      }
    }, stepMs || 620);
  }

  /* ===== 路由与导航 ===== */
  function findPage(route) {
    const routeHash = route && route.indexOf("#/") === 0 ? route : "#/" + route;
    for (const group of GQ.nav) {
      if (group.route === routeHash) return { group, page: group, parent: null };
      if (group.id === "m02" && routeHash.indexOf("#/industry-") === 0) return { group, page: group, parent: null };
      if (group.children) {
        const p = group.children.find(c => c.route === routeHash);
        if (p) return { group, page: p, parent: group };
      }
    }
    return null;
  }

  function go(route) {
    location.hash = route;
  }

  function renderNav() {
    const nav = $("#side-nav");
    const route = state.route;
    const routeHash = route && route.indexOf("#/") === 0 ? route : "#/" + route;
    let html = "";
    for (const group of GQ.nav) {
      const hasKids = group.children && group.children.length;
      const activeParent = hasKids ? group.children.some(c => c.route === routeHash) : (group.route === routeHash || (group.id === "m02" && routeHash.indexOf("#/industry-") === 0));
      const open = (activeParent || state.expandedNav.has(group.id)) ? " open" : "";
      html += '<div class="nav-group">';
      if (hasKids) {
        html += '<button class="nav-item' + (activeParent ? " active" : "") + '" data-nav="' + group.id + '">' + icon(group.icon) + "<span>" + group.title + "</span>" + icon("chevron", "nav-chevron" + open) + "</button>";
        html += '<div class="nav-sub' + open + '" id="nav-sub-' + group.id + '">';
        for (const c of group.children) {
          if (c.hidden) continue;
          html += '<button class="nav-sub-item' + (c.route === routeHash ? " active" : "") + '" data-route="' + c.route + '">' + esc(c.title) + "</button>";
        }
        html += "</div>";
      } else {
        html += '<button class="nav-item' + (activeParent ? " active" : "") + '" data-route="' + group.route + '">' + icon(group.icon) + "<span>" + group.title + "</span></button>";
      }
      html += "</div>";
    }
    nav.innerHTML = html;
  }

  function crumbText() {
    const found = findPage(state.route);
    if (!found) return "工作台";
    if (!found.parent) return found.group.title;
    return found.parent.title + " / " + found.page.title;
  }

  function renderView() {
    const view = $("#view");
    $("#crumb").textContent = crumbText();
    switch (state.route) {
      case "home": view.innerHTML = viewHome(); break;
      case "kb": view.innerHTML = viewKB(); break;
      case "qa": view.innerHTML = viewQA(); break;
      case "report": view.innerHTML = viewReport(); break;
      case "trace": view.innerHTML = viewTrace(); break;
      case "industry-config": view.innerHTML = viewIndustryConfig(); break;
      case "industry-timeline": view.innerHTML = viewIndustryTimeline(); break;
      case "industry-alert": go("#/industry-config"); return;
      case "industry-pool": go("#/industry-config"); return;
      case "companies": view.innerHTML = viewCompanies(); break;
      case "evaluate": view.innerHTML = viewEvaluate(); break;
      case "interview": go("#/evaluate"); return;
      case "materials": view.innerHTML = viewMaterials(); break;
      case "doc": state.applicationTab = "writer"; view.innerHTML = viewMaterials(); break;
      case "review": state.applicationTab = "score"; view.innerHTML = viewMaterials(); break;
      case "qc": state.applicationTab = "tune"; view.innerHTML = viewMaterials(); break;
      case "ppt": view.innerHTML = viewPPT(); break;
      case "defense": view.innerHTML = viewDefense(); break;
      case "accounts": view.innerHTML = viewAccounts(); break;
      case "permission": view.innerHTML = viewPermission(); break;
      case "audit": view.innerHTML = viewAudit(); break;
      case "security": view.innerHTML = viewSecurity(); break;
      default: view.innerHTML = viewHome();
    }
    renderNav();
    $("#sidebar").classList.remove("open");
    window.scrollTo(0, 0);
  }

  /* ===== 页面组件 ===== */
  function pageHead(title, sub, actions) {
    return '<div class="page-head"><div><div class="page-title">' + title + '</div><div class="page-sub">' + sub + "</div></div>" +
      '<div class="ai-pulse-strip" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      (actions ? '<div class="page-actions">' + actions + "</div>" : "") + "</div>";
  }

  function kpiCards(items) {
    return '<div class="kpi-row">' + items.map(k =>
      '<div class="kpi"><div class="kpi-ico">' + icon(k.icon) + "</div><div class=\"kpi-meta\">" +
      '<div class="kpi-label">' + esc(k.label) + '</div><div class="kpi-value">' + esc(k.value) + '</div>' +
      (k.delta ? '<div class="kpi-delta ' + (k.up ? "up" : "down") + '">' + icon(k.up ? "chevron" : "chevron") + esc(k.delta) + " 较上周</div>" : "") +
      "</div></div>").join("") + "</div>";
  }

  function lineSvg(values, labels, color) {
    const w = 560, h = 150, pad = 26;
    const max = Math.max.apply(null, values) * 1.15;
    const pts = values.map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (values.length - 1);
      const y = h - pad - (v / max) * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = line + " L" + (w - pad) + " " + (h - pad) + " L" + pad + " " + (h - pad) + " Z";
    const dots = pts.map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff" stroke="' + (color || "#1a73e8") + '" stroke-width="2"/>').join("");
    const xs = labels.map((l, i) => '<text x="' + pts[i][0] + '" y="' + (h - 6) + '" font-size="11" fill="#94a3b8" text-anchor="middle">' + l + "</text>").join("");
    return '<svg viewBox="0 0 ' + w + " " + h + '" style="width:100%;height:auto">' +
      '<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (color || "#1a73e8") + '" stop-opacity=".18"/><stop offset="1" stop-color="' + (color || "#1a73e8") + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#lg)"/><path d="' + line + '" fill="none" stroke="' + (color || "#1a73e8") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' + dots + xs +
      "</svg>";
  }

  function ring(score, color) {
    const c = color || "#1a73e8";
    return '<div class="score-ring" style="background:conic-gradient(' + c + " " + score * 3.6 + 'deg, #e2e8f0 0deg)"><div class="ring-inner"><b>' + score + '</b><span>综合评分</span></div></div>';
  }

  /* ===== 工作台 ===== */
  function viewHome() {
    const d = GQ.dashboard;
    const week = [32, 41, 38, 52, 47, 61, 58];
    const weekLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const pipeline = d.pipeline.map((p, i) => {
      const cls = i < 5 ? "done" : (p.active ? "active" : "");
      return '<div class="pstep ' + cls + '"><div class="pstep-ico">' + (i < 5 ? icon("check") : (i + 1)) + '</div><div class="pstep-label">' + p.label + '<br><b>' + p.count + "</b></div></div>";
    }).join("");
    const todos = d.todos.map(t =>
      '<div class="drop-item"><span class="dot ' + (t.level === "red" ? "dot-red" : t.level === "yellow" ? "dot-yellow" : "dot-blue") + '"></span><div><b>' + esc(t.module) + " · " + esc(t.text) + '</b><span>需人工确认</span><time>' + esc(t.time) + '</time></div><button class="btn btn-outline btn-sm" data-action="todo-go" data-text="' + esc(t.text) + '">处理</button></div>').join("");
    const agents = d.agents.map(a => {
      const busy = a.status !== "正常";
      const cls = busy ? "orange" : "green";
      return '<div class="agent-card">' +
        '<div class="agent-ico' + (busy ? " agent-busy" : "") + '">' + icon(a.icon) + '</div>' +
        '<div class="agent-meta"><b>' + esc(a.name) + '</b><span>' + esc(a.desc) + '</span>' +
        '<span class="agent-stats">今日调用 <b>' + a.calls + '</b> 次 · 平均 ' + a.avg + '</span></div>' +
        '<div class="agent-badge agent-badge-' + cls + '"><span class="dot dot-' + cls + '"></span>' + esc(a.status) + '</div>' +
        '</div>';
    }).join("");
    const totalCalls = d.agents.reduce((s, a) => s + a.calls, 0);
    const agentSummary = '<div class="agent-summary">' +
      '<span><b>' + d.agents.length + '</b> Agent</span>' +
      '<span><span class="dot dot-green"></span>' + d.agents.filter(a => a.status === "正常").length + ' 正常</span>' +
      '<span><span class="dot dot-yellow"></span>' + d.agents.filter(a => a.status !== "正常").length + ' 繁忙</span>' +
      '<span>总调用 <b>' + totalCalls + '</b></span></div>';
    return pageHead("工作台", "今日申报任务 18 项，9 条 Agent 建议待人工确认；关键业务链路运行正常。",
      '<button class="btn btn-primary" data-route="#/qa">' + icon("spark") + "开始智能问答</button>") +
      kpiCards(d.kpis) +
      '<div class="section"><div class="card"><div class="card-head"><div><div class="card-title">申报业务闭环</div><div class="card-sub">从线索筛选到答辩演练的完整交付链路</div></div><span class="chip chip-blue">实时数据</span></div>' +
      '<div class="progress-steps">' + pipeline + "</div></div></div>" +
      '<div class="grid-2 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">待人工确认</div><div class="card-sub">Agent 已给出建议，等待你确认后继续</div></div><button class="btn btn-outline btn-sm" data-route="#/audit">全部</button></div>' + todos + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">Agent 运行状态</div><div class="card-sub">今日 07:00 至当前 · 6 个智能体协同运行</div></div>' + agentSummary + '</div><div class="grid-2" style="gap:12px">' + agents + "</div></div>" +
      "</div>" +
      '<div class="grid-2-1 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">知识调用趋势</div><div class="card-sub">近 7 日智能问答与报告生成调用量</div></div></div>' + lineSvg(week, weekLabels) + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">产业情报</div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">重点变化</div><div class="qa-text">新能源电池回收专项政策发布，建议关联 3 家目标企业。</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">风险提醒</div><div class="qa-text" style="border-color:#fecaca">常州锂航材料缺口 4 项，其中设备发票需尽快催收。</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">待定稿</div><div class="qa-text">《苏州智造设备更新申报书》v1.2 预评审 88 分，待你确认。</div></div>' +
      "</div></div>";
  }

  /* ===== 万智中枢 ===== */
  function viewKB() {
    if (state.kbLib) return viewKBLibrary();
    const publicIds = ["enterprise", "external", "history", "industry-news"];
    const privateIds = ["private"];
    const encryptedIds = ["policy"];
    const libCard = (l, encrypted) =>
      '<div class="card hoverable kb-lib" data-action="' + (encrypted ? "kb-locked" : "kb-open") + '" data-id="' + l.id + '">' +
      '<div class="kb-lib-head"><div class="kpi-ico">' + icon(l.icon) + "</div><div>" +
      '<div class="card-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + esc(l.name) +
      (l.locked ? '<span class="tag tag-blue tag-plain">' + icon("lock") + "加密</span>" : "") + "</div>" +
      '<div class="card-sub">' + esc(l.desc) + "</div></div></div>" +
      '<div class="kb-lib-foot"><span class="chip chip-blue">' + l.count + ' 个文档</span><span class="link">' + (encrypted ? "不可查看" : "进入维护") + "</span></div></div>";
    const getLib = id => GQ.kbLibraries.find(x => x.id === id);
    const publicLibs = publicIds.map(id => { const l = getLib(id); return l ? libCard(l, false) : ""; }).join("");
    const privateLibs = privateIds.map(id => { const l = getLib(id); return l ? libCard(l, false) : ""; }).join("");
    const encryptedLibs = encryptedIds.map(id => { const l = getLib(id); return l ? libCard(l, true) : ""; }).join("");
    return pageHead("知识库管理", "知识库按分区管理，可点击进入每个分区维护内容；每个分区内支持新建文件夹与文档维护。") +
      '<div class="card"><div class="card-head"><div><div class="card-title">公开库</div><div class="card-sub">共享知识，全员可查看与维护</div></div></div>' +
      '<div class="grid-3">' + publicLibs + "</div></div>" +
      '<div class="card" style="margin-top:16px"><div class="card-head"><div><div class="card-title">私有库</div><div class="card-sub">个人维护，仅本人可见</div></div><button class="btn btn-outline btn-sm" data-action="kb-add-private">' + icon("plus") + "添加库</button></div>" +
      '<div class="grid-3">' + privateLibs + "</div></div>" +
      '<div class="card" style="margin-top:16px"><div class="card-head"><div><div class="card-title">加密库</div><div class="card-sub">机密知识，权限受限</div></div></div>' +
      '<div class="grid-3">' + encryptedLibs + "</div></div>";
  }

  function viewKBLibrary() {
    const lib = GQ.kbLibraries.find(l => l.id === state.kbLib);
    if (!lib) return viewKB();
    const data = GQ.kbLibraryData[lib.id];
    const current = GQ.kbProjects.find(p => p.id === state.kbProject);
    const docs = data.docs.filter(d => !state.kbFolder || d.folder === state.kbFolder);
    const rows = docs.map(d =>
      "<tr><td><b>" + esc(d.name) + "</b></td><td>" + st(d.type) + "</td><td>" + d.keywords.map(k => '<span class="chip">' + k + "</span>").join(" ") + "</td>" +
      '<td style="white-space:nowrap">' + esc(d.updated) + "</td><td>" + esc(d.by) + "</td>" +
      '<td style="white-space:nowrap"><span class="link" data-action="kb-doc-view" data-name="' + esc(d.name) + '">查看</span> · <span class="link" data-action="kb-download">下载</span></td></tr>').join("");
    const folders = data.folders.map(f =>
      '<button class="folder-chip' + (state.kbFolder === f ? " active" : "") + '" data-action="kb-folder" data-name="' + esc(f) + '">' + icon("folder") + esc(f) + "</button>").join("");
    return pageHead("知识库管理 · " + lib.name, current.name + " 项目空间 · 支持分区内容维护与文件夹管理",
      '<button class="btn btn-outline" data-action="kb-back">' + icon("chevron") + "返回分区</button>" +
      '<button class="btn btn-outline" data-action="kb-new-folder">' + icon("folder") + "新建文件夹</button>" +
      '<button class="btn btn-primary" data-action="kb-upload">' + icon("upload") + "上传资料</button>") +
      '<div class="grid-2-1 section"><div class="card"><div class="card-head"><div><div class="card-title">文件夹</div><div class="card-sub">点击文件夹查看该目录下的最新数据</div></div>' +
      (lib.locked ? '<span class="tag tag-blue tag-plain">' + icon("lock") + "已加密</span>" : "") + "</div>" +
      '<div class="folder-row">' + folders + "</div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">分区概览</div><div class="card-sub">' + esc(lib.desc) + "</div></div></div>" +
      '<div class="qa-block"><div class="qa-block-title">文档数量</div><div class="qa-text">' + data.docs.length + " 个文档 · " + data.folders.length + " 个文件夹</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">维护权限</div><div class="qa-text">' + (lib.locked ? "加密库，需要权限校验后方可访问与维护" : "项目成员可维护，操作留痕") + "</div></div></div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">最新数据</div><div class="card-sub">字段：文档名称 / 类型 / 关键词 / 更新时间 / 更新人</div></div>' +
      '<input class="input" style="width:240px" placeholder="搜索文档名称 / 关键词" data-action="kb-search"></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>文档名称</th><th>类型</th><th>关键词</th><th>更新时间</th><th>更新人</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function viewQA() {
    const convs = GQ.qaChats.map(c =>
      '<button class="qa-conv' + (state.qaConv === c.id ? " active" : "") + '" data-action="qa-conv" data-id="' + c.id + '">' +
      '<div class="qa-conv-meta"><b>' + esc(c.title) + "</b></div></button>").join("");
    const suggests = GQ.qaSuggestions.map(s => '<button class="suggest-chip" data-action="qa-suggest" data-q="' + esc(s) + '">' + esc(s) + "</button>").join("");
    return pageHead("AI智库", "类智能体对话界面：左侧按项目展示对话记录并可发起新对话，右侧进行知识问答，回答带引用来源并区分本地/外部依据。") +
      '<div class="qa-layout"><div class="card qa-side">' +
      '<div class="card-head compact-head"><div><div class="card-title">对话记录</div></div></div>' +
      '<button class="btn btn-primary btn-block qa-new-btn" data-action="qa-new">' + icon("plus") + "新对话</button>" +
      '<div class="qa-conv-list">' + convs + "</div></div>" +
      '<div class="card qa-main"><div class="card-head">' +
      '<div style="display:flex;align-items:center;gap:12px"><div class="ai-writer-logo">' + icon("spark") + '</div><div><div class="card-title">AI智库 · 智库对话</div><div class="card-sub">权限校验 → 本地检索 → 引用回答 → 建议动作</div></div></div>' +
      '<span class="chip chip-blue">当前项目：技术改造专项</span></div>' +
      '<div class="qa-scope-row"><span class="qa-scope-label">知识范围</span>' +
      ["政策库", "企业资料", "外部资料", "历史沉淀", "私有库"].map(s => '<label style="display:flex;gap:6px;align-items:center;font-size:13px"><input type="checkbox" checked> ' + s + "</label>").join("") + "</div>" +
      '<div class="chat-box" id="qa-chat">' +
      '<div class="msg agent"><div class="msg-avatar">智</div><div class="msg-body">你好，我是 AI智库。已接入政策库、企业资料库、历史案例与内部经验。点击左侧对话记录切换项目对话，或发起新对话后直接提问。</div></div>' +
      "</div>" +
      '<div class="chat-suggests">' + suggests + "</div>" +
      '<div class="chat-input qa-chat-input"><textarea class="input" id="qa-input" rows="3" placeholder="输入你的问题，例如：XX市技改专项对设备投资额有什么要求？"></textarea>' +
      '<button class="qa-send-btn" data-action="qa-ask" title="发送提问" aria-label="发送提问">' + icon("send") + "</button></div></div></div>";
  }

  function askQA(question) {
    const chat = $("#qa-chat");
    const input = $("#qa-input");
    if (!question) question = input ? input.value.trim() : "";
    if (!question) { toast("请输入问题", "warning"); return; }
    if (input) input.value = "";
    chat.insertAdjacentHTML("beforeend", '<div class="msg user"><div class="msg-avatar">顾</div><div class="msg-body">' + esc(question) + "</div></div>");
    const busy = document.createElement("div");
    busy.className = "agent-steps";
    busy.innerHTML = '<span class="spin"></span><span class="flow-text">权限校验…</span>';
    chat.appendChild(busy);
    chat.scrollTop = chat.scrollHeight;
    const steps = ["权限校验通过", "正在检索本地知识库", "比对政策条件与案例", "生成引用回答"];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      if (i < steps.length) { busy.querySelector(".flow-text").textContent = steps[i]; chat.scrollTop = chat.scrollHeight; }
      else {
        clearInterval(tick);
        busy.remove();
        const a = GQ.qaAnswer;
        const cites = a.localCites.map((c, idx) => '<button class="cite-chip" data-action="cite-open" data-idx="' + idx + '">' + icon("file") + esc(c.file) + " · " + esc(c.pos) + "</button>").join("");
        const ext = a.externalCites.map((c, idx) => '<button class="cite-chip" data-action="cite-open" data-idx="ext-' + idx + '">' + icon("external") + esc(c.file) + "</button>").join("");
        state.qaCites = a.localCites.concat(a.externalCites.map(c => Object.assign({}, c, { ext: true })));
        chat.insertAdjacentHTML("beforeend",
          '<div class="msg agent"><div class="msg-avatar">智</div><div class="msg-body"><b style="color:#1557b0">' + esc(question) + "</b><br><br>" +
          esc(a.text) +
          '<div class="cite-row">' + cites + ext + "</div>" +
          '<div style="margin-top:8px">' + st("本地依据") + " " + st("外部依据") + "</div>" +
          '<div class="msg-actions">' +
          '<button class="btn btn-outline btn-sm" data-route="#/report">' + icon("file") + "生成报告</button>" +
          '<button class="btn btn-outline btn-sm" data-action="qa-save">' + icon("briefcase") + "保存到公文包</button>" +
          '<button class="btn btn-outline btn-sm" data-action="cite-source">' + icon("eye") + "查看原文</button></div></div></div>");
        const citesEl = $("#qa-cites");
        if (citesEl) citesEl.innerHTML = a.localCites.map(c => '<div class="qa-text" style="margin-bottom:8px"><b>' + esc(c.file) + '</b><br><span style="color:#64748b">' + esc(c.pos) + " · " + esc(c.level) + "</span></div>").join("") +
          a.externalCites.map(c => '<div class="qa-text" style="margin-bottom:8px"><b>' + esc(c.file) + '</b><br><span style="color:#64748b">外部公开来源</span></div>').join("");
        chat.scrollTop = chat.scrollHeight;
      }
    }, 620);
  }

  function viewReport() {
    return pageHead("报告生成", "在授权范围内选取本地知识库资料生成分析报告，输出区分本地依据与外部依据，并支持指定格式导出。",
      '<button class="btn btn-outline" data-action="report-history">' + icon("clock") + "报告历史</button>") +
      '<div class="grid-2"><div class="card"><div class="card-head"><div><div class="card-title">生成设置</div><div class="card-sub">选择模板、知识范围与输出格式</div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">报告模板</div><select class="select" id="report-template">' +
      GQ.reportTemplates.map((r, i) => '<option value="' + i + '">' + esc(r.name) + "</option>").join("") + "</select></div>" +
      '<div class="qa-block"><div class="qa-block-title">知识范围</div><div class="form-grid" style="gap:8px">' +
      ["政策库", "项目库", "企业资料", "产业资讯", "历史案例"].map(s => '<label style="display:flex;gap:6px;align-items:center;font-size:13px"><input type="checkbox" checked> ' + s + "</label>").join("") +
      "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">项目空间 / 企业范围</div><select class="select"><option>技术改造专项 · 全部企业</option><option>苏州智造精密装备有限公司</option><option>常州锂航新能源科技有限公司</option></select></div>' +
      '<div class="qa-block"><div class="qa-block-title">输出格式</div><div class="filter-bar" style="margin-bottom:0;padding:0;border:none;background:none">' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="fmt" checked> Word</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="fmt"> PDF</label>' +
      '<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="fmt"> 一页简报</label></div></div>' +
      '<button class="btn btn-primary btn-block" data-action="report-run">' + icon("spark") + "生成报告</button></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">报告预览</div><div class="card-sub">生成后可导出 Word / PDF</div></div></div><div id="report-result">' +
      '<div class="empty">' + icon("file") + "<div>选择模板后点击生成报告<br>系统将展示带引用来源的报告草稿</div></div></div></div></div>";
  }

  function runReport() {
    const box = $("#report-result");
    const name = $("#report-template") ? GQ.reportTemplates[+$("#report-template").value].name : "产业数据分析报告";
    runFlow(box, ["权限校验通过", "检索本地知识库", "调用产业资讯与企业画像", "按模板生成报告草稿"], 
      '<div class="doc-preview"><h3>' + esc(name) + "（草稿）</h3>" +
      "<p><b>一、政策环境</b>：2026 年工业领域设备更新和技术改造政策延续设备投资补贴方向，重点支持工业母机、新能源与高端装备。<span class=\"cite\">[依据：2026年工业领域设备更新和技术改造实施方案 P12]</span></p>" +
      "<p><b>二、企业机会</b>：区域内 3 家高端装备企业设备购置占比高于 60%，其中苏州智造精密装备有限公司匹配度最高（92 分）。<span class=\"cite\">[依据：企业备案项目库 · 企业画像]</span></p>" +
      "<p><b>三、风险提示</b>：2 家企业缺少 2025 年度审计报告，需在申报前补齐。<span class=\"cite\">[依据：材料管理比对结果 QC-20260801-03]</span></p>" +
      '<div class="msg-actions"><button class="btn btn-outline btn-sm" data-action="export-word">' + icon("download") + "导出 Word</button>" +
      '<button class="btn btn-outline btn-sm" data-action="export-pdf">' + icon("download") + "导出 PDF</button>" +
          '<button class="btn btn-outline btn-sm" data-action="qa-save">' + icon("briefcase") + "保存报告</button></div></div>");
  }

  function viewTrace() {
    const rows = GQ.traceRecords.map(r =>
      '<tr data-action="trace-open" data-id="' + r.id + '" style="cursor:pointer"><td>' + esc(r.id) + "</td>" +
      "<td>" + esc(r.question) + "</td><td>" + esc(r.answer) + "</td>" +
      '<td class="num">' + r.cites + "</td><td>" + esc(r.user) + "</td><td>" + esc(r.time) + "</td><td>" + st(r.status) + "</td></tr>").join("");
    return pageHead("来源追溯", "所有 Agent 回答与报告均可追溯至引用文件、章节/页码或数据表位置，便于复核与审计。",
      '<button class="btn btn-outline" data-action="trace-export">' + icon("download") + "导出追溯记录</button>") +
      '<div class="card"><div class="card-head"><div><div class="card-title">回答记录</div><div class="card-sub">点击记录查看引用来源链</div></div>' +
      '<input class="input" style="width:260px" placeholder="搜索问题 / 文件 / 用户" data-action="trace-search"></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>记录编号</th><th>问题</th><th>回答摘要</th><th>引用数</th><th>用户</th><th>时间</th><th>状态</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function traceDetail(id) {
    const r = GQ.traceRecords.find(x => x.id === id) || GQ.traceRecords[0];
    drawer("来源追溯 · " + r.id, "回答链路与审计信息",
      '<div class="qa-block"><div class="qa-block-title">问题</div><div class="qa-text">' + esc(r.question) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">回答</div><div class="qa-text">' + esc(r.answer) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">引用来源</div>' +
      '<div class="qa-text" style="margin-bottom:8px"><b>2026年工业领域设备更新和技术改造实施方案</b><br>第 12 页 · 第三章 2.1 · 公开</div>' +
      '<div class="qa-text" style="margin-bottom:8px"><b>苏州智造精密装备有限公司资料包</b><br>企业备案表 · 表 3 · 机密</div>' +
      '<div class="qa-text"><b>外部公开来源</b><br>国家发展改革委官网 · 2026-07 政策解读</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">原文片段</div><div class="qa-text" style="background:#fff7ed">“项目固定资产投资不低于 500 万元，其中设备购置投资占比不低于 60%……”</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">审计信息</div><div class="qa-text">' + esc(r.user) + " · " + esc(r.time) + " · 已通过权限校验 · 操作已留痕</div></div>",
      '<button class="btn btn-outline" data-close="drawer">关闭</button><button class="btn btn-primary" data-action="qa-save">' + icon("briefcase") + "保存记录</button>");
  }

  /* ===== 产业雷达 ===== */
  function viewIndustryConfig() {
    const cards = GQ.industries.map(ind => {
      const indNews = GQ.news.filter(n => n.industry === ind.name).slice(0, 3);
      const newsItems = indNews.map(n =>
        '<div class="ind-news-item"><span class="ind-news-tag">' + n.type + '</span><span class="ind-news-title">' + esc(n.title) + '</span></div>'
      ).join("");
      const alert = ind.today > 0 ? '<div class="ind-alert"><span class="dot dot-red"></span>新增 ' + ind.today + ' 条 · ' + esc(ind.lastRun) + '</div>' : '<div class="ind-alert ind-alert-none">暂无新消息</div>';
      return '<div class="card hoverable industry-card" data-action="industry-open" data-id="' + ind.id + '">' +
        '<div class="card-head"><div><div class="card-title">' + esc(ind.name) + '</div><div class="card-sub">关键词：' + ind.keywords.join("、") + '</div></div>' + st(ind.status) + "</div>" +
        alert +
        (newsItems ? '<div class="ind-news-list">' + newsItems + "</div>" : '<div class="ind-news-empty">暂无资讯</div>') +
        '<div class="ind-enter">点击进入详情 →</div></div>';
    }).join("");
    return pageHead("产业雷达", "跟踪重点产业领域的政策、技术与新闻动态，系统自动抓取并分类去重。",
      '<button class="btn btn-primary" data-action="industry-add">' + icon("plus") + "新增产业</button>") +
      '<div class="grid-2 section">' + cards + "</div>";
  }

  function industryModal(id) {
    const ind = GQ.industries.find(x => x.id === id);
    const body = ind ?
      '<div class="form-grid"><label class="field"><span>产业名称</span><input class="input" value="' + esc(ind.name) + '"></label>' +
      '<label class="field"><span>抓取频率</span><select class="select"><option>每日 1 次</option><option selected>每日 2 次</option><option>每日 3 次</option></select></label></div>' +
      '<label class="field" style="margin-top:14px"><span>关键词（逗号分隔）</span><input class="input" value="' + esc(ind.keywords.join("，")) + '"></label>' +
      '<label class="field" style="margin-top:14px"><span>来源</span><input class="input" value="' + esc(ind.sources) + '"></label>' :
      '<div class="form-grid"><label class="field"><span>产业名称</span><input class="input" placeholder="如：低空经济"></label>' +
      '<label class="field"><span>抓取频率</span><select class="select"><option>每日 1 次</option><option>每日 2 次</option></select></label></div>' +
      '<label class="field" style="margin-top:14px"><span>关键词（逗号分隔）</span><input class="input" placeholder="低空飞行，无人机，eVTOL"></label>';
    modal("编辑产业配置", ind ? ind.name : "新增重点产业",
      body,
      '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="industry-save">保存配置</button>');
  }

  function viewIndustryTimeline() {
    const currentIndustry = GQ.industries.find(ind => ind.name === state.industryName);
    const list = GQ.news.filter(n =>
      (state.industryType === "全部" || n.type === state.industryType) &&
      (state.industryName === "全部" || n.industry === state.industryName));
    const dates = [...new Set(list.map(n => n.date))];
    const items = dates.map(date => {
      const day = list.filter(n => n.date === date).map(n => {
        const faved = state.newsFav.has(n.id);
        return '<div class="card hoverable" style="margin-bottom:12px"><div class="card-head"><div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          st(n.type) + st(n.industry) + (n.important ? st("重点") : "") + "</div>" +
          '<div class="card-title" style="margin-top:8px">' + esc(n.title) + '</div>' +
          '<div class="card-sub">' + esc(n.source) + " · " + esc(n.time) + " · 来源已留痕</div></div>" +
          '<button class="icon-btn' + (faved ? " active" : "") + '" data-action="news-fav" data-id="' + n.id + '" title="收藏">' + icon(faved ? "check" : "star") + "</button></div>" +
          '<div style="margin-bottom:10px">' + n.tags.map(t => '<span class="chip">' + t + "</span>").join(" ") + "</div>" +
          '<div class="page-actions"><button class="btn btn-outline btn-sm" data-action="news-note" data-id="' + n.id + '">' + icon("edit") + "备注</button>" +
          '<button class="btn btn-outline btn-sm" data-action="news-source">' + icon("external") + "查看来源</button></div></div>";
      }).join("");
      return '<div class="tl-item"><div class="tl-date">' + date + "</div>" + day + "</div>";
    }).join("");
    return pageHead((currentIndustry ? currentIndustry.name + " · " : "") + "资讯时间线", "按产业链环节展示政策、技术与新闻变化，支持收藏、备注与人工确认。",
      '<button class="btn btn-outline" data-route="#/industry-config">' + icon("chevron") + "返回产业雷达</button>") +
      '<div class="filter-bar"><div class="field"><span>资讯类型</span><select class="select" data-action="industry-filter"><option>全部</option><option>政策</option><option>技术</option><option>新闻</option></select></div>' +
      '<div class="field"><span>重点产业</span><select class="select" data-action="industry-filter2"><option>全部</option><option>生物医药</option><option>化工新材料</option><option>新能源电池</option><option>高端装备</option></select></div>' +
      '<button class="btn btn-outline" data-action="industry-filter-reset">重置</button></div>' +
      '<div class="timeline">' + items + "</div>";
  }

  function viewIndustryAlert() {
    const alerts = GQ.alerts.filter(a => !state.alertsDone.has(a.id));
    const cards = alerts.map(a =>
      '<div class="card hoverable section"><div class="card-head"><div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      st(a.level === "high" ? "高风险" : a.level === "medium" ? "需确认" : "信息") + st(a.industry) + "</div>" +
      '<div class="card-title" style="margin-top:8px">' + esc(a.title) + '</div>' +
      '<div class="card-sub">' + esc(a.time) + "</div></div>" +
      '<button class="icon-btn" data-action="alert-read" data-id="' + a.id + '" title="标记已读">' + icon("check") + "</button></div>" +
      '<div class="qa-block"><div class="qa-block-title">识别原因</div><div class="qa-text">' + esc(a.reason) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">建议动作</div><div class="qa-text" style="background:#f0f9ff">' + esc(a.action) + "</div></div>" +
      '<div class="page-actions"><button class="btn btn-primary btn-sm" data-action="alert-pool" data-id="' + a.id + '">' + icon("database") + "转入产业知识库</button>" +
      '<button class="btn btn-outline btn-sm" data-action="alert-link">' + icon("users") + "关联企业筛选</button></div></div>").join("");
    return pageHead("重点提醒", "每日动态信息提醒与重点变化摘要，人工确认后沉淀为可复用的产业知识。") +
      '<div class="grid-3 section">' +
      '<div class="kpi"><div class="kpi-ico">' + icon("radar") + '</div><div class="kpi-meta"><div class="kpi-label">今日新增资讯</div><div class="kpi-value">66</div></div></div>' +
      '<div class="kpi"><div class="kpi-ico">' + icon("alert") + '</div><div class="kpi-meta"><div class="kpi-label">待确认重点变化</div><div class="kpi-value">' + alerts.length + "</div></div></div>" +
      '<div class="kpi"><div class="kpi-ico">' + icon("database") + '</div><div class="kpi-meta"><div class="kpi-label">本月已沉淀</div><div class="kpi-value">38</div></div></div></div>' +
      (alerts.length ? cards : '<div class="card"><div class="empty">' + icon("check") + "<div>所有重点变化已处理</div></div></div>");
  }

  function viewIndustryPool() {
    const cards = GQ.knowledgeItems.map(k =>
      '<div class="card hoverable"><div class="card-head"><div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + st(k.industry) + st(k.type) + "</div>" +
      '<div class="card-title" style="margin-top:8px">' + esc(k.title) + '</div>' +
      '<div class="card-sub">' + esc(k.chain) + " · 确认人 " + esc(k.confirmedBy) + " · " + esc(k.time) + "</div></div>" +
      '<span class="chip chip-blue">被引用 ' + k.used + " 次</span></div>" +
      '<div class="page-actions"><button class="btn btn-outline btn-sm" data-action="pool-view" data-id="' + k.id + '">' + icon("eye") + "查看</button>" +
      '<button class="btn btn-outline btn-sm" data-action="pool-use">' + icon("target") + "用于企业筛选</button></div></div>").join("");
    return pageHead("资讯沉淀", "经人工确认的重要资讯沉淀为产业知识库条目，供企业筛选、项目评估和政策匹配引用。") +
      '<div class="filter-bar"><div class="field"><span>产业</span><select class="select"><option>全部</option><option>生物医药</option><option>化工新材料</option><option>新能源电池</option><option>高端装备</option></select></div>' +
      '<div class="field"><span>关键词</span><input class="input" placeholder="搜索沉淀条目"></div>' +
      '<button class="btn btn-outline">查询</button></div>' +
      '<div class="grid-2">' + cards + "</div>";
  }

  /* ===== 客户开发 ===== */
  function companyFiltered() {
    return GQ.companies.slice();
  }

  function viewCompanies() {
    const recommended = companyFiltered().slice(0, 3);
    const candidates = GQ.companies.filter(c => state.candidateIds.has(c.id));
    const filterChips = ["高端装备", "新能源电池", "技术改造", "国债两新", "设备购置投资占比高", "在建/备案项目", "投资额 500 万以上", "近三年信用正常", "材料证据较完整"];
    const recommendRows = recommended.map(c =>
      '<div class="agent-company-row"><div><b>' + esc(c.name) + '</b><span>' + esc(c.region) + " / " + esc(c.industry) + " · " + esc(c.projectType) + " · 投资额 " + c.invest.toLocaleString() + " 万元</span></div>" +
      '<div class="agent-company-score"><b>' + c.score + '</b><span>匹配分</span></div><div class="page-actions"><button class="btn btn-outline btn-sm" data-action="company-view" data-id="' + c.id + '">查看详情</button>' +
      '<button class="btn btn-primary btn-sm" data-action="company-add-candidate" data-id="' + c.id + '">' + (state.candidateIds.has(c.id) ? "已加入" : "加入候选") + "</button></div></div>").join("");
    const candidateRows = candidates.map(c =>
      "<tr><td><b>" + esc(c.name) + '</b><div style="font-size:12px;color:#64748b">' + c.id + "</div></td>" +
      "<td>" + esc(c.region) + " / " + esc(c.industry) + "</td><td>" + esc(c.projectType) + "</td>" +
      '<td class="num">' + c.invest.toLocaleString() + "</td><td>" + st(c.status) + "</td>" +
      '<td style="min-width:150px"><div style="display:flex;align-items:center;gap:8px"><b class="num">' + c.score + '</b><div class="bar" style="flex:1"><i style="width:' + c.score + '%"></i></div></div></td>' +
      "<td>" + st(c.risk + "风险") + "</td><td>" + esc(c.evidence) + "</td>" +
      '<td style="white-space:nowrap"><span class="link" data-action="company-view" data-id="' + c.id + '">查看详情</span> · <span class="link" data-action="company-eval" data-id="' + c.id + '">评估</span></td></tr>').join("");
    return pageHead("企业筛选", "通过对话与固定条件组合筛选国债两新潜在申报企业，Agent 返回推荐清单并加入候选。") +
      '<div class="company-agent-panel card section"><div class="card-head"><div style="display:flex;align-items:center;gap:12px"><div class="ai-writer-logo">' + icon("spark") + '</div><div><div class="card-title">企业筛选 Agent</div><div class="card-sub">固定筛选条件 + 对话问答，面向国债两新企业筛选标准</div></div></div><span class="chip chip-blue">推荐 ' + recommended.length + ' 家</span></div>' +
      '<div class="company-filter-chips">' + filterChips.map(x => '<button class="filter-pill" data-action="company-filter">' + esc(x) + "</button>").join("") + '</div>' +
      '<div class="chat-input company-agent-input"><textarea class="input" rows="2" placeholder="输入筛选要求，例如：筛选设备更新方向、在建项目、投资额较高且证据链较完整的企业"></textarea><button class="qa-send-btn" data-action="company-filter" title="筛选" aria-label="筛选">' + icon("send") + '</button></div>' +
      '<div class="ai-line"><span></span><b>Agent 已结合行业、项目类型、建设状态、投资规模和政策方向返回企业清单</b></div><div class="agent-company-list">' + recommendRows + "</div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">已加入候选的企业清单</div><div class="card-sub">点击“评估”进入项目评估页面，继续完成立项判断</div></div><span class="chip chip-blue">候选 ' + candidates.length + ' 家</span></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>企业</th><th>区域/行业</th><th>项目类型</th><th>投资额(万元)</th><th>建设状态</th><th>匹配评分</th><th>风险</th><th>证据来源</th><th>操作</th></tr></thead><tbody>' + candidateRows + "</tbody></table></div></div>";
  }

  function companyDrawer(id) {
    const c = GQ.companies.find(x => x.id === id);
    if (!c) return;
    const dims = c.dims.map(d =>
      '<div class="qa-block"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span>' + d.k + ' <span style="color:#94a3b8">权重 ' + d.w + "%</span></span><b>" + d.s + "</b></div>" +
      '<div class="bar"><i style="width:' + d.s + '%"></i></div></div>').join("");
    drawer("企业画像 · " + c.name, c.id + " · 企业洞察 Agent",
      '<div style="display:flex;gap:20px;align-items:center;margin-bottom:18px">' + ring(c.score) +
      '<div><div style="font-size:15px;font-weight:700">' + esc(c.name) + '</div><div style="font-size:13px;color:#64748b;margin-top:4px">' + esc(c.region) + " · " + esc(c.industry) + " · " + esc(c.projectType) + '</div><div style="margin-top:8px">' + st(c.status) + " " + st(c.risk + "风险") + "</div></div></div>" +
      '<div class="qa-block"><div class="qa-block-title">画像摘要</div><div class="qa-text">' + esc(c.brief) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">评分维度</div>' + dims + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">证据来源</div><div class="qa-text">' + esc(c.evidence) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">建议动作</div><div class="qa-text" style="background:#f0f9ff">评分与证据齐备，建议进入项目评估；访谈时重点核实审计报告与开工日期。</div></div>',
      '<button class="btn btn-outline" data-close="drawer">关闭</button>' +
      '<button class="btn btn-primary" data-action="company-eval" data-id="' + c.id + '">进入项目评估</button>');
  }

  function companyImportModal() {
    modal("导入企业备案清单", "支持 Excel / CSV，系统将完成字段识别、清洗、去重与历史版本叠加",
      '<div style="border:1px dashed #c7d7f7;border-radius:8px;padding:36px;text-align:center;color:#64748b;background:#f8fbff">' + icon("upload", "active") +
      '<div style="margin-top:10px"><b style="color:#1a73e8">点击选择文件或拖拽到此处</b><br><span style="font-size:12px">示例：企业备案项目清单_2026Q2.xlsx · 最大 20MB</span></div></div>' +
      '<div class="qa-block" style="margin-top:14px"><div class="qa-block-title">导入字段映射</div><div class="qa-text">企业名称 → 统一社会信用代码 → 区域 → 行业 → 项目类型 → 投资额 → 建设状态 → 备案编号（自动匹配）</div></div>',
      '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="company-import-run">导入并清洗</button>');
  }

  function runCompanyImport() {
    const mask = $(".modal-mask");
    if (mask) mask.querySelector(".modal").innerHTML =
      '<div class="modal-title" style="margin-bottom:12px">正在导入与清洗</div><div class="agent-steps"><span class="spin"></span><span class="flow-text">解析 Excel 字段…</span></div>' +
      '<div class="qa-block" style="margin-top:14px"><div class="qa-block-title">清洗规则</div><div class="qa-text">去重 3 条 · 补全区域 12 条 · 修正投资额格式 5 条 · 标记异常 2 条</div></div>';
    setTimeout(() => {
      if (mask) mask.querySelector(".modal").innerHTML =
        '<div style="display:flex;gap:14px;align-items:center;margin-bottom:14px"><div class="kpi-ico">' + icon("check") + '</div><div><div class="modal-title">导入完成</div><div class="modal-sub">新增企业 18 家，更新 7 家，去重 3 条；2 条异常需人工处理</div></div></div>' +
        '<div class="qa-block"><div class="qa-block-title">异常记录</div><div class="qa-text">宁波 XX 机械：投资额单位缺失，已标记待人工确认<br>常州 XX 能源：备案编号重复，已去重</div></div>';
      toast("企业清单导入并清洗完成", "success");
    }, 1800);
  }

  function viewEvaluate() {
    return pageHead("项目评估", "自动生成企业项目评估报告：政策条件逐项匹配、申报建议、材料缺口与风险提示，每项判断标注依据与置信度。",
      '<button class="btn btn-outline" data-action="eval-history">' + icon("clock") + "评估记录</button>" +
      '<button class="btn btn-outline" data-action="eval-export">' + icon("download") + "导出评估报告</button>") +
      '<div class="grid-1-2"><div class="card"><div class="card-head"><div><div class="card-title">评估企业信息</div><div class="card-sub">填写评估信息与评估侧重点</div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">企业名称</div><select class="select" id="eval-company">' +
      GQ.companies.map(c => '<option value="' + c.id + '">' + esc(c.name) + "</option>").join("") + "</select></div>" +
      '<div class="qa-block"><div class="qa-block-title">目标政策 · 从政策库选择</div><select class="select" id="eval-policy">' +
      GQ.policies.map(p => '<option>' + esc(p.name) + "</option>").join("") + "</select></div>" +
      '<div class="qa-block"><div class="doc-field-head"><div class="qa-block-title">企业材料（非必填）</div>' +
      '<div class="seg"><button class="seg-btn active" data-action="doc-source" data-target="eval-mat-kb">从知识库选择</button><button class="seg-btn" data-action="doc-source" data-target="eval-mat-local">从本地上传</button></div></div>' +
      '<div id="eval-mat-kb"><select class="select"><option>企业资料包（默认知识库）</option><option>备案项目与投资凭证</option><option>财务与资质资料</option></select></div>' +
      '<div id="eval-mat-local" class="hidden"><div class="empty" style="padding:12px">' + icon("upload") + '<span style="font-size:13px">点击上传企业材料（本地）</span></div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">评估维度（侧重点）</div><textarea class="input" id="eval-focus" rows="3" placeholder="填写评估的侧重点，例如：重点评估设备购置合规性、财务指标、政策契合度…"></textarea></div>' +
      '<button class="btn btn-primary btn-block" data-action="eval-run">' + icon("spark") + "生成评估报告</button></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">评估结果</div><div class="card-sub">申报评估 Agent · 评估口径统一</div></div></div><div id="eval-result">' +
      '<div class="empty">' + icon("clipboard") + "<div>选择企业与政策后生成评估报告<br>低置信结论将标记人工确认</div></div></div></div></div>";
  }

  function runEvaluate() {
    const box = $("#eval-result");
    const sel = $("#eval-company");
    state.evalCompany = sel ? sel.value : "C01";
    const c = GQ.companies.find(x => x.id === state.evalCompany);
    const r = GQ.evalReport;
    let rec = state.evalHistory.find(x => x.companyId === c.id);
    if (rec) {
      rec.policy = r.policy; rec.score = r.score; rec.level = r.level; rec.time = "2026-08-02 15:35";
    } else {
      state.evalHistory.unshift({ id: Date.now(), companyId: c.id, company: c.name, policy: r.policy, score: r.score, level: r.level, time: "2026-08-02 15:35", approved: false });
    }
    const resultHtml =
      '<div style="display:flex;gap:20px;align-items:center;margin-bottom:16px">' + ring(r.score) +
      '<div><div class="card-title">' + esc(c.name) + '</div><div class="card-sub">' + esc(r.policy) + " · " + st(r.level) + "</div>" +
      '<div style="margin-top:8px">' + st("依据来源") + st("低置信人工确认") + "</div></div></div>" +
      '<div class="qa-block"><div class="qa-block-title">政策条件逐项匹配</div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>政策条件</th><th>状态</th><th>依据</th><th>置信度</th><th>人工确认</th></tr></thead><tbody>' +
      r.conditions.map(x => "<tr><td>" + esc(x.cond) + "</td><td>" + st(x.status) + "</td><td>" + esc(x.evidence) + "</td><td>" + st(x.conf) + "</td><td>" + (x.manual ? st("需确认") : "—") + "</td></tr>").join("") +
      "</tbody></table></div></div>" +
      '<div class="qa-block"><div class="qa-block-title">材料缺口</div><div>' + r.gaps.map(g => '<span class="chip" style="background:#fee2e2;color:#ef4444">' + g + "</span>").join(" ") + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">风险提示</div>' + r.risks.map(x => '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">' + st(x.level + "风险") + "<span>" + esc(x.text) + "</span></div>").join("") + "</div>" +
      '<div class="page-actions"><button class="btn btn-primary" data-action="eval-confirm">' + icon("check") + "人工确认立项</button>" +
      '<button class="btn btn-outline" data-action="eval-interview">' + icon("chat") + "生成待核实问题</button>" +
      '<button class="btn btn-outline" data-action="eval-export">' + icon("download") + "导出报告</button></div>";
    const reportHtml = evalReportHtml(c, r);
    runEvalAnalysis(box,
      '<div class="tabs" style="margin-bottom:14px"><button class="tab active" data-action="eval-tab" data-mode="result">评估结果</button><button class="tab" data-action="eval-tab" data-mode="report">分析报告</button></div>' +
      '<div id="eval-result-view">' + resultHtml + "</div>" +
      '<div id="eval-report-view" class="hidden">' + reportHtml + "</div>");
  }

  function runEvalAnalysis(box, doneHtml) {
    const steps = ["正在分析企业资料", "正在搜索企业经营信息", "正在分析政策匹配度", "正在比对政策条件与评分项", "正在生成评估报告"];
    box.innerHTML =
      '<div class="eval-anim"><div class="eval-radar"><div class="eval-ring r1"></div><div class="eval-ring r2"></div><div class="eval-core">' + icon("target") + '</div></div>' +
      '<div class="eval-step" id="eval-step">' + steps[0] + "</div>" +
      '<div class="eval-progress"><i id="eval-progress-bar"></i></div>' +
      '<div class="eval-dims">' + ["企业资料", "经营信息", "政策匹配", "条件比对"].map((d, i) => '<span class="eval-dim" id="eval-dim-' + i + '">' + d + "</span>").join("") + "</div></div>";
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      const stepEl = $("#eval-step");
      if (i < steps.length && stepEl) stepEl.textContent = steps[i];
      const bar = $("#eval-progress-bar");
      if (bar) bar.style.width = Math.min(100, Math.round((i / steps.length) * 100)) + "%";
      $$(".eval-dim").forEach((d, idx) => d.classList.toggle("done", idx < i));
      if (i >= steps.length) {
        clearInterval(tick);
        box.innerHTML = doneHtml;
      }
    }, 620);
  }

  function viewInterview() {
    return pageHead("访谈准备", "结合企业资料、授权外部信息与政策要求生成访谈简报，无法确认内容明确标记为待访谈核实。",
      '<button class="btn btn-outline" data-action="interview-export">' + icon("download") + "导出访谈简报</button>") +
      '<div class="grid-1-2"><div class="card"><div class="card-head"><div><div class="card-title">访谈设置</div><div class="card-sub">选择企业、目标政策与访谈模板</div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">企业</div><select class="select" id="interview-company">' +
      GQ.companies.map(c => '<option value="' + c.id + '">' + esc(c.name) + "</option>").join("") + "</select></div>" +
      '<div class="qa-block"><div class="qa-block-title">目标政策</div><select class="select"><option>2026年工业领域设备更新和技术改造</option><option>两新专项</option></select></div>' +
      '<div class="qa-block"><div class="qa-block-title">访谈模板</div><select class="select"><option>标准访谈简报（企业+政策+待核实）</option><option>首次接洽简报</option></select></div>' +
      '<button class="btn btn-primary btn-block" data-action="interview-run">' + icon("spark") + "生成访谈准备资料</button></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">访谈简报</div><div class="card-sub">企业洞察 Agent + 申报评估 Agent</div></div></div><div id="interview-result">' +
      '<div class="empty">' + icon("users") + "<div>生成访谈简报后展示企业概况、待核实问题与资料缺口</div></div></div></div></div>";
  }

  function runInterview() {
    const box = $("#interview-result");
    const sel = $("#interview-company");
    const c = GQ.companies.find(x => x.id === (sel ? sel.value : "C01"));
    const r = GQ.interview;
    runFlow(box, ["权限校验通过", "读取企业资料包", "补充官网与企查查授权信息", "比对政策要求生成访谈问题"], 
      '<div class="card-title" style="margin-bottom:4px">' + esc(c.name) + " · 访谈准备资料</div>" +
      '<div class="card-sub" style="margin-bottom:12px">' + esc(r.policy) + " · " + st("待访谈核实") + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">企业基本情况</div><div class="qa-text">' + esc(r.profile) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">主营业务与项目基础</div><div class="qa-text">' + esc(r.mainBusiness) + "<br><br>" + esc(r.projectBase) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">政策匹配点</div>' + r.matchPoints.map(p => '<div style="display:flex;gap:8px;margin-bottom:4px">' + st("匹配") + "<span>" + esc(p) + "</span></div>").join("") + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">待核实问题</div>' + r.questions.map((q, i) =>
        '<div style="border:1px solid #fde68a;background:#fffbeb;border-radius:8px;padding:10px 12px;margin-bottom:8px"><b>' + (i + 1) + ". " + esc(q.q) + '</b><div style="font-size:12px;color:#d97706;margin-top:4px">原因：' + esc(q.why) + "</div></div>").join("") + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">资料缺口</div><div>' + r.gaps.map(g => '<span class="chip" style="background:#fee2e2;color:#ef4444">' + g + "</span>").join(" ") + "</div></div>" +
      '<div class="page-actions"><button class="btn btn-outline" data-action="interview-export">' + icon("download") + "按模板导出</button>" +
      '<button class="btn btn-primary" data-action="interview-memo">' + icon("edit") + "回写访谈纪要</button></div>");
  }

  /* ===== 文书智写 ===== */
  function viewMaterials() {
    const stats = { "已具备": 3, "缺失": 2, "疑似不合规": 1, "疑似过期": 1, "需人工确认": 1 };
    const rows = GQ.materials.map(m =>
      "<tr><td><b>" + esc(m.name) + "</b></td><td>" + esc(m.format) + "</td><td>" + (m.required === "是" ? st("必填") : "选填") + "</td><td>" + esc(m.valid) + "</td>" +
      "<td>" + (m.provided === "—" ? '<span style="color:#94a3b8">未提供</span>' : esc(m.provided)) + "</td><td>" + st(m.status) + "</td><td>" + esc(m.basis) + "</td><td>" + esc(m.note) + "</td>" +
      '<td class="link" data-action="material-view" data-name="' + esc(m.name) + '">查看</td></tr>').join("");
    return pageHead("材料管理", "解析材料需求文件并与企业资料自动比对，输出带判定依据的状态；材料确认齐备后可流转文书制作。",
      '<button class="btn btn-primary" data-action="material-upload">' + icon("upload") + "上传材料需求文件</button>" +
      '<button class="btn btn-outline" data-action="material-scan">' + icon("folder") + "扫描企业文件夹</button>" +
      '<button class="btn btn-outline" data-action="material-list">' + icon("clipboard") + "生成补充清单</button>" +
      '<button class="btn btn-outline" data-action="material-confirm">' + icon("check") + "确认材料包可用</button>" +
      '<button class="btn btn-primary" data-action="material-to-doc">' + icon("file") + "进入文书制作</button>") +
      '<div class="grid-3 section">' + Object.keys(stats).map(k =>
        '<div class="kpi"><div class="kpi-ico">' + icon(k === "已具备" ? "check" : "alert") + '</div><div class="kpi-meta"><div class="kpi-label">' + k + '</div><div class="kpi-value">' + stats[k] + "</div></div></div>").join("") + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">资料比对结果</div><div class="card-sub">苏州智造精密装备有限公司 · 2026年工业领域设备更新和技术改造</div></div>' +
      (state.materialConfirmed ? st("可用于文书制作") : '<span class="chip chip-blue">材料包待确认</span>') + "</div>" +
      '<div class="table-wrap"><table class="table"><thead><tr><th>材料名称</th><th>需求格式</th><th>必填</th><th>有效期</th><th>企业已提供</th><th>状态</th><th>判定依据</th><th>说明</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function materialListModal() {
    const items = GQ.materials.filter(m => m.status !== "已具备");
    modal("材料补充清单", "按材料名称、责任人、紧急程度与补充说明整理，支持催收跟进",
      '<div class="table-wrap"><table class="table"><thead><tr><th>材料名称</th><th>责任人</th><th>紧急程度</th><th>补充说明</th></tr></thead><tbody>' +
      items.map((m, i) => "<tr><td>" + esc(m.name) + '</td><td>企业对接人（待分配）</td><td>' + st(i < 2 ? "高" : "中") + "</td><td>" + esc(m.note || "请在 3 个工作日内补充") + "</td></tr>").join("") +
      "</tbody></table></div>" +
      '<div class="qa-block" style="margin-top:14px"><div class="qa-block-title">催收文案</div><div class="qa-text">您好，贵司《2026年工业领域设备更新和技术改造专项》申报材料尚缺：' + items.map(m => m.name).join("、") + '，请于 3 个工作日内提供，感谢配合。</div></div>',
      '<button class="btn btn-outline" data-action="material-copy">' + icon("clipboard") + "复制催收文案</button>" +
      '<button class="btn btn-outline" data-close="modal">关闭</button><button class="btn btn-primary" data-action="material-export">导出清单</button>');
  }

  function docSettingsHtml() {
    return '<div class="qa-block"><div class="doc-field-head"><div class="qa-block-title">专项政策</div>' +
      '<div class="seg"><button class="seg-btn active" data-action="doc-source" data-target="doc-policy-kb">从知识库选择</button><button class="seg-btn" data-action="doc-source" data-target="doc-policy-local">从本地上传</button></div></div>' +
      '<div id="doc-policy-kb" style="margin-top:8px"><select class="select" id="doc-policy">' +
      GQ.policies.map(p => '<option>' + esc(p.name) + "</option>").join("") + "</select></div>" +
      '<div id="doc-policy-local" class="hidden"><div class="empty" style="padding:12px">' + icon("upload") + '<span style="font-size:13px">点击选择政策文件（本地）</span></div></div></div>' +
      '<div class="qa-block"><div class="doc-field-head"><div class="qa-block-title">企业资料包</div>' +
      '<div class="seg"><button class="seg-btn active" data-action="doc-source" data-target="doc-company-kb">从知识库选择</button><button class="seg-btn" data-action="doc-source" data-target="doc-company-local">从本地上传</button></div></div>' +
      '<div id="doc-company-kb" style="margin-top:8px"><select class="select" id="doc-company">' +
      GQ.companies.map(c => '<option>' + esc(c.name) + "</option>").join("") + "</select></div>" +
      '<div id="doc-company-local" class="hidden"><div class="empty" style="padding:12px">' + icon("upload") + '<span style="font-size:13px">点击选择企业资料包（本地）</span></div></div></div>' +
      '<div class="qa-block"><div class="doc-field-head"><div class="qa-block-title">文书模板</div>' +
      '<div class="seg"><button class="seg-btn active" data-action="doc-source" data-target="doc-template-kb">从知识库选择</button><button class="seg-btn" data-action="doc-source" data-target="doc-template-local">从本地上传</button></div></div>' +
      '<div id="doc-template-kb" style="margin-top:8px"><select class="select" id="doc-template"><option>两新专项申报书标准模板 v3</option><option>技改专项申报书模板 v2</option></select></div>' +
      '<div id="doc-template-local" class="hidden"><div class="empty" style="padding:12px">' + icon("upload") + '<span style="font-size:13px">点击选择文书模板（本地）</span></div></div></div>' +
      '<div class="qa-block"><div class="doc-field-head"><div class="qa-block-title">参考资料</div></div>' +
      '<label style="display:flex;gap:6px;align-items:center;font-size:13px"><input type="checkbox" checked> <span class="link" data-action="doc-standard">评分标准（点击查看）</span></label></div>';
  }

  function viewDoc() {
    return pageHead("文书制作", "围绕“两新”等专项政策生成申报文书初稿：设置资料后以对话方式输入生成要求，资料可从知识库选择或本地上传。",
      '<button class="btn btn-outline" data-action="doc-version">' + icon("clock") + "版本历史</button>") +
      '<div class="grid-2"><div class="card"><div class="card-head">' +
      '<div style="display:flex;align-items:center;gap:12px"><div class="ai-writer-logo">' + icon("file") + "</div><div>" +
      '<div class="card-title">AI写手 · 文书生成</div><div class="card-sub">申报材料 Agent · 对话式生成</div></div></div></div>' +
      '<div id="doc-settings">' +
      (state.materialConfirmed
        ? '<div class="notice-banner">' + icon("check") + '<span>已引用材料管理确认的材料包（苏州智造资料包），材料齐备度 3/8，缺口 5 项。</span></div>'
        : '<div class="notice-banner">' + icon("alert") + '<span>材料包尚未确认，建议先在「材料管理」确认材料齐备后生成文书。</span></div>') +
      docSettingsHtml() + "</div>" +
      '<div class="doc-chat"><div class="chat-box" id="doc-chat" style="min-height:120px"></div>' +
      '<div class="doc-composer"><textarea class="input" id="doc-prompt" rows="5" placeholder="输入生成要求，例如：突出技术先进性对比，资金测算与审计口径一致"></textarea>' +
      '<button class="icon-btn doc-attach-btn" data-action="doc-attach" title="添加文件">' + icon("paperclip") + "</button>" +
      '<button class="btn btn-primary doc-send-btn" data-action="doc-run" title="开始生成">' + icon("send") + "</button></div></div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">文书预览</div><div class="card-sub">申报材料 Agent · 按章节 / 全文切换</div></div></div><div id="doc-result">' +
      '<div class="empty">' + icon("file") + "<div>完成设置后，在对话框输入生成要求并开始生成</div></div></div></div></div>";
  }

  function docResultHtml(company, policy) {
    const fullText = GQ.docOutline.map(ch => "<h3>" + esc(ch.title) + "</h3><p>" + esc(ch.content) + "</p>").join("");
    return '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
      '<div><div class="card-title">' + esc(company) + " · 申报书初稿 v1.0</div>" +
      '<div class="card-sub">' + esc(policy) + " · 共 6 章 3,740 字</div></div>" +
      st("已标注资料缺口") + "</div>" +
      '<div class="tabs" style="margin-bottom:12px"><button class="tab active" data-action="doc-preview-tab" data-mode="chapter">按章节</button><button class="tab" data-action="doc-preview-tab" data-mode="full">全文</button></div>' +
      '<div id="doc-chapter-view">' + GQ.docOutline.map(ch =>
        '<div style="border:1px solid var(--border);border-radius:8px;margin-bottom:8px;overflow:hidden"><button class="nav-item" style="width:100%" data-action="doc-chapter" data-id="' + ch.id + '">' +
        '<span style="flex:1;text-align:left">' + esc(ch.title) + " · " + ch.words + " 字</span>" + st(ch.status) + icon("chevron", "nav-chevron") + "</button>" +
        '<div class="doc-preview" style="display:none;border:none;border-top:1px solid var(--border);border-radius:0" id="doc-ch-' + ch.id + '">' + esc(ch.content) + "</div></div>").join("") + "</div>" +
      '<div id="doc-full-view" class="hidden"><div class="doc-preview">' + fullText + "</div></div>" +
      '<div class="qa-block" style="margin-top:12px"><div class="qa-block-title">资料缺口</div><div>' +
      ["2025 年审计报告", "设备发票清单", "环评批复有效期"].map(g => '<span class="chip" style="background:#fee2e2;color:#ef4444">' + g + "</span>").join(" ") + "</div></div>" +
      '<div class="page-actions" style="margin-top:12px"><button class="btn btn-outline" data-action="doc-save-version">' + icon("clock") + "保留版本</button>" +
      '<button class="btn btn-outline" data-action="doc-export">' + icon("download") + "导出 Word</button>" +
      '<button class="btn btn-outline" data-action="doc-export">' + icon("download") + "导出 PDF</button>" +
      '<button class="btn btn-primary" data-action="doc-review"><span class="reviewer-logo">' + icon("radar") + '</span>AI评审官</button>' +
      '<button class="btn btn-outline" data-action="doc-to-qc">' + icon("check") + "转入质量控制</button></div>";
  }

  function runDoc() {
    const chat = $("#doc-chat");
    const box = $("#doc-result");
    const company = $("#doc-company") ? $("#doc-company").value : "苏州智造精密装备有限公司";
    const policy = $("#doc-policy") ? $("#doc-policy").value : "2026年工业领域设备更新和技术改造";
    const template = $("#doc-template") ? $("#doc-template").value : "两新专项申报书标准模板 v3";
    const prompt = $("#doc-prompt") ? $("#doc-prompt").value.trim() : "";
    if (chat) {
      if (prompt) chat.insertAdjacentHTML("beforeend", '<div class="msg user"><div class="msg-avatar">顾</div><div class="msg-body">' + esc(prompt) + "</div></div>");
      const busy = document.createElement("div");
      busy.className = "agent-steps";
      busy.innerHTML = '<span class="spin"></span><span class="flow-text">读取设置项与资料来源…</span>';
      chat.appendChild(busy);
      chat.scrollTop = chat.scrollHeight;
    }
    const steps = ["读取设置项与资料来源", "解析企业资料与字段映射", "生成章节提纲", "生成章节草稿", "匹配证明附件", "标注资料缺口"];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      if (i < steps.length && chat) {
        const t = chat.querySelector(".flow-text");
        if (t) { t.textContent = steps[i]; chat.scrollTop = chat.scrollHeight; }
      } else {
        clearInterval(tick);
        if (chat) { const b = chat.querySelector(".agent-steps"); if (b) b.remove(); }
        box.innerHTML = docResultHtml(company, policy);
        const settingsBox = $("#doc-settings");
        if (settingsBox) settingsBox.classList.add("hidden");
        if (chat) {
          chat.innerHTML =
            '<div class="msg user"><div class="msg-avatar">顾</div><div class="msg-body">' + (prompt ? esc(prompt) : "按默认要求生成文书初稿") + "</div></div>" +
            '<div class="msg agent"><div class="msg-avatar">写</div><div class="msg-body"><b style="color:#1557b0">文书初稿已生成</b>：共 6 章 3,740 字，已按《评分标准》标注 3 项资料缺口，可在右侧按章节或全文查看。</div></div>' +
            '<div class="doc-file-summary"><div class="qa-block-title">已选资料</div>' +
            '<div class="qa-text">专项政策：' + esc(policy) + "<br>企业资料包：" + esc(company) + "<br>文书模板：" + esc(template) + "<br>资料来源：知识库选择（演示）</div></div>";
          chat.scrollTop = chat.scrollHeight;
        }
        const promptEl = $("#doc-prompt");
        if (promptEl) { promptEl.value = ""; promptEl.placeholder = "输入微调要求，例如：第三章突出技术先进性对比"; }
        const sendBtn = $(".doc-send-btn");
        if (sendBtn) sendBtn.dataset.action = "doc-refine";
        const hint = $(".doc-composer-hint");
        if (hint) hint.textContent = "微调对话框 · 可继续修改文书内容";
        if (chat) chat.scrollTop = chat.scrollHeight;
      }
    }, 600);
  }

  function runReviewerEffect() {
    modal("AI评审官", "正在按《评分标准》对申报文书进行动态打分",
      '<div class="reviewer-effect"><div class="reviewer-ring"><div class="reviewer-ring-inner"><b id="reviewer-score">0</b><span>综合评分</span></div></div>' +
      '<div class="reviewer-dims">正在校验政策契合度 / 材料完整性 / 证据支撑度…</div></div>',
      "");
    let score = 0;
    const tick = setInterval(() => {
      score += Math.max(1, Math.round((88 - score) / 5));
      const el = $("#reviewer-score");
      if (el) el.textContent = Math.min(88, score);
      if (score >= 88) {
        clearInterval(tick);
        const box = $(".reviewer-effect");
        if (box) box.innerHTML = '<div style="display:flex;align-items:center;gap:12px;justify-content:center;padding:22px 0"><div class="kpi-ico">' + icon("check") + '</div><div><div class="modal-title">评审完成</div><div class="modal-sub">综合评分 88 分 · 问题清单已生成</div></div></div>';
        setTimeout(() => { closeModal(); go("#/review"); }, 900);
      }
    }, 140);
  }

  function viewReview() {
    const r = GQ.reviewResult;
    return pageHead("AI评审官", "结合《评分标准》对申报文书进行评审打分并输出调优建议；结果仅作参考，最终以人工评审为准。",
      '<button class="btn btn-outline" data-action="review-export">' + icon("download") + "导出评审单</button>") +
      '<div class="grid-2-1"><div class="card"><div class="card-head"><div><div class="card-title">评审概览</div><div class="card-sub">苏州智造精密装备有限公司 · 申报书 v1.2 · 2026年工业领域设备更新和技术改造</div></div></div>' +
      '<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">' + ring(r.total) +
      '<div style="flex:1;min-width:240px">' + r.dims.map(d =>
        '<div class="qa-block" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>' + d.name + '</span><b>' + d.score + '</b></div><div class="bar"><i style="width:' + d.score + '%"></i></div><div style="font-size:12px;color:#64748b;margin-top:2px">' + d.note + "</div></div>").join("") + "</div></div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">问题清单</div><div class="card-sub">按严重程度标注并定位到章节</div></div></div>' +
      r.issues.map(x => '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px">' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">' + st(x.level) + '<b style="font-size:13px">' + esc(x.pos) + "</b></div>" +
      '<div style="font-size:13px">' + esc(x.text) + '</div><div style="font-size:12px;color:#1557b0;margin-top:4px">建议：' + esc(x.suggest) + "</div></div>").join("") + "</div></div>";
  }

  function viewQC() {
    const q = GQ.qc;
    const diffHtml = q.diff.map(d => '<span class="' + (d.type === "new" ? "diff-new" : "diff-orig") + '">' + esc(d.text) + "</span>").join("");
    const checks = GQ.qcChecks.map(c => '<div class="qa-block" style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:13px">' + esc(c.name) + "</b>" + st(state.qcChecked ? c.status : "待校验") + "</div></div>").join("");
    const issues = GQ.reviewResult.issues.map((x, i) => {
      const s = state.qcIssueState[i];
      return '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px">' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">' + st(x.level) + '<b style="font-size:13px">' + esc(x.pos) + "</b>" + (s ? st(s === "confirmed" ? "已确认" : "已驳回") : "") + "</div>" +
        '<div style="font-size:13px">' + esc(x.text) + '</div><div style="font-size:12px;color:#1557b0;margin-top:4px">建议：' + esc(x.suggest) + "</div>" +
        '<div class="page-actions" style="margin-top:8px"><button class="btn btn-outline btn-sm" data-action="qc-issue" data-idx="' + i + '" data-act="confirmed">确认采纳</button>' +
        '<button class="btn btn-outline btn-sm" data-action="qc-issue" data-idx="' + i + '" data-act="rejected">驳回</button></div></div>';
    }).join("");
    return pageHead("质量控制", "承接文书制作定稿，执行数据一致性、政策条件覆盖、证据引用、行文逻辑与格式五类校验，人工授权后生成校订版。",
      '<button class="btn btn-outline" data-action="qc-authorize">' + icon("edit") + "授权修改</button>" +
      '<button class="btn btn-outline" data-action="qc-export">' + icon("download") + "导出校订版</button>" +
      '<button class="btn btn-primary" data-action="qc-finish">' + icon("check") + "完成质检</button>" +
      '<button class="btn btn-outline" data-action="qc-to-ppt">' + icon("ppt") + "进入答辩准备</button>") +
      '<div class="grid-2 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">质检设置</div><div class="card-sub">默认承接文书制作定稿版本</div></div>' + st(state.qcApproved ? "已质检" : "质检中") + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">待质检文书</div><select class="select"><option>苏州智造 · 申报书定稿 v1.2（承接文书制作）</option><option>上传外部文书</option></select></div>' +
      '<div class="qa-block"><div class="qa-block-title">校验范围</div><div class="qa-text">数据一致性 / 政策条件覆盖 / 证据引用 / 行文逻辑 / 格式规范</div></div>' +
      '<button class="btn btn-primary btn-block" data-action="qc-run">' + icon("spark") + "开始质检</button></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">五类校验</div><div class="card-sub">问题按严重程度分级并定位到章节/表格/附件</div></div></div><div id="qc-checks">' + checks + "</div></div></div>" +
      '<div class="grid-2 section"><div class="card"><div class="card-head"><div><div class="card-title">原文 · 第四章资金筹措</div><div class="card-sub">' + esc(q.batch) + " · 原稿只读</div></div></div>" +
      '<div class="qa-text">' + esc(q.original) + "</div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">校订版 · v1.2</div><div class="card-sub">' + st("已授权修改") + " · 修订留痕</div></div></div>" +
      '<div class="qa-text">' + diffHtml + "</div></div></div>" +
      '<div class="grid-2 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">问题清单</div><div class="card-sub">逐条确认或驳回修改建议</div></div></div>' + issues + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">修订记录</div><div class="card-sub">原稿备份、授权记录与复核确认可追溯</div></div></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>时间</th><th>操作者</th><th>动作</th><th>级别</th></tr></thead><tbody>' +
      q.records.map(r => "<tr><td>" + esc(r.time) + "</td><td>" + esc(r.user) + "</td><td>" + esc(r.action) + "</td><td>" + st(r.level) + "</td></tr>").join("") +
      "</tbody></table></div></div></div>";
  }

  /* ===== 文书智写 · 项目工作台覆盖版 ===== */
  function currentApplication() {
    return GQ.applications.find(a => a.id === state.applicationId) || GQ.applications[0];
  }

  function appArchived(app) {
    return !!(app && state.archivedApps.has(app.id));
  }

  function appProgress(app) {
    return appArchived(app) ? 100 : app.progress;
  }

  function appStatus(app) {
    return appArchived(app) ? "已归档" : app.status;
  }

  function viewMaterials() {
    if (!state.applicationId) return viewApplicationProjects();
    return viewApplicationWorkspace();
  }

  function viewApplicationProjects() {
    const grouped = GQ.applications.reduce((acc, item) => {
      (acc[item.year] || (acc[item.year] = [])).push(item);
      return acc;
    }, {});
    const alerts = GQ.applications.filter(a => a.alert).map(a =>
      '<div class="app-alert-item"><span class="dot ' + (a.stagnation ? "dot-red" : "dot-yellow") + '"></span><span><b>' + esc(a.company) + '</b> ' + esc(a.alert) + "</span></div>").join("");
    const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map(year =>
      '<div class="app-year"><div class="app-year-title">' + esc(year) + ' 年申报项目</div><div class="app-project-grid">' +
      grouped[year].sort((a, b) => b.updated.localeCompare(a.updated)).map(app =>
        '<button class="app-project-card" data-action="app-open" data-id="' + app.id + '">' +
        '<div class="app-project-head"><div><div class="app-company">' + esc(app.company) + '</div><div class="card-sub">' + esc(app.policy) + '</div></div>' + st(appStatus(app)) + '</div>' +
        '<div class="app-project-meta"><span>' + esc(app.type) + '</span><span>负责人：' + esc(app.owner) + '</span><span>更新：' + esc(app.updated) + '</span></div>' +
        '<div class="app-progress-line"><div><b>' + appProgress(app) + '%</b><span>项目进度</span></div><div class="bar"><i style="width:' + appProgress(app) + '%"></i></div></div>' +
        '<div class="app-card-foot"><span>资料完整度 ' + app.completeness + '%</span><span>智能评分 ' + app.score + '</span></div>' +
        '<div class="app-summary">' + esc(app.summary) + '</div></button>').join("") +
      '</div></div>').join("");
    return pageHead("项目管理", "文书智写以企业申报项目为中心组织资料、文书生成、AI调优与智能评分；项目按年份拆分，并按更新时间倒序展示。",
      '<button class="btn btn-primary" data-action="app-new-project">' + icon("plus") + "新增企业项目</button>") +
      '<div class="app-alert-float ' + (state.alertCollapsed ? "collapsed" : "") + '">' +
      '<button class="app-alert-toggle" data-action="app-toggle-alert">' + icon(state.alertCollapsed ? "bell" : "x") + '</button>' +
      (state.alertCollapsed
        ? '<div class="app-alert-mini"><div class="ai-orbit tiny"><b>AI</b></div><span>告警 3</span></div>'
        : '<div class="app-alert-float-body"><div class="ai-orbit tiny"><b>AI</b></div><div><div class="app-alert-title">' + agentTitle("AI告警信息", "projectAlert") + '</div>' + alerts + '</div></div>') +
      '</div>' + years;
  }

  function viewApplicationWorkspace() {
    const app = currentApplication();
    const readonly = appArchived(app);
    const tabs = [
      ["files", "企业资料库"],
      ["writer", "文书智写"],
      ["tune", "AI调优"],
      ["score", "智能评分"]
    ].map(t => '<button class="tab ' + (state.applicationTab === t[0] ? "active" : "") + '" data-action="app-tab" data-tab="' + t[0] + '">' + t[1] + "</button>").join("");
    const body = state.applicationTab === "files" ? viewEnterpriseFiles(app)
      : state.applicationTab === "writer" ? viewSmartWriter(app)
      : state.applicationTab === "tune" ? viewAiTuneV2(app)
      : viewSmartScoreV2(app);
    const topActions = state.applicationTab === "score"
      ? '<div class="score-global-actions">' + agentMark("archive") + '<button class="btn btn-outline btn-sm" data-action="app-export-doc">' + icon("download") + '导出文档</button><button class="btn btn-primary btn-sm" data-action="app-archive"' + (readonly ? " disabled" : "") + '>' + icon("lock") + '归档项目</button></div>'
      : "";
    return '<div class="app-workspace-head">' +
      '<div class="page-actions"><button class="btn btn-outline btn-sm" data-action="app-back">' + icon("chevron") + "返回项目管理</button>" +
      (readonly ? '<button class="btn btn-primary btn-sm" data-action="app-restart">' + icon("refresh") + '重启制作</button>' : "") + '</div>' +
      '<div class="app-workspace-title"><div><div class="page-title">' + esc(app.company) + '</div><div class="page-sub">' + esc(app.type) + " · " + esc(app.policy) + " · 负责人：" + esc(app.owner) + '</div></div>' +
      '<div class="app-top-progress"><span>项目进度 ' + appProgress(app) + '%</span><div class="bar"><i style="width:' + appProgress(app) + '%"></i></div>' + topActions + '</div></div>' +
      '<div class="tabs app-main-tabs">' + tabs + '</div></div>' +
      (readonly ? '<div class="readonly-banner">' + icon("lock") + '<div><b>项目已归档，只读查看</b><span>当前详情不可继续编辑、调优或修改评分；重启制作后恢复操作。</span></div></div>' : "") +
      body;
  }

  function viewEnterpriseFiles(app) {
    const readonly = appArchived(app);
    const rows = GQ.enterpriseFiles.map(f =>
      "<tr><td><b>" + esc(f.name) + '</b><div style="font-size:12px;color:#64748b">' + esc(f.group) + "</div></td><td>" + esc(f.type) + "</td><td>" + esc(f.size) + "</td><td>" + st(f.status) + "</td><td>" + esc(f.note) + "</td>" +
      '<td style="white-space:nowrap"><span class="link" data-action="material-view" data-name="' + esc(f.name) + '">查看</span> · <span class="link" data-action="app-delete-file" data-id="' + f.id + '">删除</span></td></tr>').join("");
    return '<div class="grid-2-1 app-section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">' + agentTitle("企业文件资料", "materialUpload") + '</div><div class="card-sub">资料已按申报附件、设备证据、淘汰设备证明等目录分类展示</div></div>' +
      '<div class="page-actions">' + agentMark("materialScan") + '<button class="btn btn-primary btn-sm" data-action="app-upload"' + (readonly ? " disabled" : "") + '>' + icon("upload") + "上传</button><button class=\"btn btn-outline btn-sm\" data-action=\"app-scan\"" + (readonly ? " disabled" : "") + ">" + icon("spark") + "AI识别</button></div></div>" +
      '<div class="table-wrap"><table class="table"><thead><tr><th>文件</th><th>类型</th><th>大小</th><th>状态</th><th>识别说明</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>" +
      '<div class="card ai-side-panel"><div class="card-head"><div><div class="card-title">' + agentTitle("Agent 资料识别", "materialScan") + '</div><div class="card-sub">缺失资料、逻辑矛盾与证据链检测</div></div>' + st(state.aiScanDone ? "识别完成" : "待识别") + '</div>' +
      '<div class="ai-orbit"><span></span><i></i><b>AI</b></div>' +
      '<div id="app-scan-result">' + (state.aiScanDone ? insightHtml() : '<div class="empty" style="padding:18px">' + icon("spark") + '<div>点击 AI识别 后展示资料缺失与矛盾检测结果</div></div>') + '</div></div></div>';
  }

  function insightHtml() {
    const items = GQ.materialInsights.filter(i => !state.resolvedInsights.has(i.id));
    if (!items.length) return '<div class="empty" style="padding:18px">' + icon("check") + '<div>个人工作清单已清空<br>再次 AI识别会重新按资料现状扫描</div></div>';
    return items.map(i =>
      '<div class="ai-insight"><div class="ai-insight-head">' + st(i.level) + '<b>' + esc(i.title) + '</b></div><div>' + esc(i.text) + '</div>' +
      '<div class="page-actions" style="margin-top:8px"><button class="btn btn-outline btn-sm" data-action="app-resolve-insight" data-id="' + i.id + '">' + icon("check") + '已解决</button></div></div>').join("");
  }

  function outlineStatus(ch) {
    if (ch.completeness >= 85) return "资料较完整";
    if (ch.completeness >= 70) return "需补充";
    return "资料缺口";
  }

  function docTopActions(readonly) {
    return '<div class="doc-top-actions">' + agentMark("docRealtime") + '<button class="btn btn-outline btn-sm" data-action="doc-save-version"' + (readonly ? " disabled" : "") + '>' + icon("clock") + '存档</button>' +
      '<button class="btn btn-outline btn-sm" data-action="app-history">' + icon("clipboard") + '历史记录</button>' +
      '<button class="btn btn-outline btn-sm" data-action="doc-export">' + icon("download") + '导出 Word</button>' +
      agentMark("locateTune") + '<button class="icon-btn locate-top-btn" title="定位调优" aria-label="定位调优" data-action="app-locate" data-target="选择文书段落进行定位调优"' + (readonly ? " disabled" : "") + '>' + icon("target") + '</button></div>';
  }

  function aiDocChip() {
    return '<span class="ai-doc-chip"><i></i>AI实时校验</span>';
  }

  function viewSmartWriter(app) {
    const readonly = appArchived(app);
    const active = GQ.liangxinOutline.find(ch => ch.id === state.activeOutline) || GQ.liangxinOutline[0];
    const outline = GQ.liangxinOutline.map(ch =>
      '<button class="outline-row ' + (state.activeOutline === ch.id ? "active" : "") + '" data-action="app-chapter" data-id="' + ch.id + '">' +
      (ch.missing.length ? '<span class="outline-badge" data-action="app-gap-detail" data-id="' + ch.id + '">' + ch.missing.length + '</span>' : "") +
      '<div><b>' + esc(ch.title) + '</b><span>' + outlineStatus(ch) + " · 完整度 " + ch.completeness + '%</span></div><div class="mini-bar"><i style="width:' + ch.completeness + '%"></i></div></button>').join("");
    const gaps = active.missing.length ? active.missing.map(g => '<span class="chip" style="background:#fee2e2;color:#ef4444">' + esc(g) + "</span>").join(" ") : '<span class="chip" style="background:#d1fae5;color:#059669">当前章节资料完整</span>';
    return '<div class="grid-1-2 app-section writer-layout">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">' + agentTitle("两新文书一级目录", "chapterOutline") + '</div><div class="card-sub">根据参考模板提炼为演示大纲，逐章检查资料完整度</div></div></div>' +
      '<div class="outline-list">' + outline + '</div>' +
      '<div class="qa-block" style="margin-top:16px"><div class="qa-block-title">当前章节缺失资料</div><div>' + gaps + '</div></div>' +
      '<div class="marked-action-row"><button class="btn btn-primary btn-block" data-action="app-generate-doc"' + (readonly ? " disabled" : "") + '>' + icon("spark") + (state.docGenerated ? "重新生成文书" : "生成文书") + '</button>' + agentMark("docGenerate") + '</div></div>' +
      '<div class="card writer-doc-card"><div class="card-head"><div><div class="card-title">' + agentTitle("文书主体内容", "docRealtime") + " " + aiDocChip() + '</div><div class="card-sub">' + esc(app.shortName) + ' · 国债两新申报书 · ' + (state.docGenerated ? "最新草稿实时缓存" : "待生成") + '</div></div>' + docTopActions(readonly) + '</div>' +
      '<div id="app-doc-panel">' + (state.docGenerated ? docDraftHtml(app) : docWaitingHtml(active)) + '</div>' + writerBottomChat(readonly) + '</div></div>';
  }

  function docWaitingHtml(active) {
    return '<div class="empty">' + icon("file") + '<div>当前选中：' + esc(active.title) + '<br>完整度 ' + active.completeness + '%，可先查看缺失资料，也可直接生成演示文书</div></div>';
  }

  function sampleReportSections() {
    return [
      { title: "第一章 项目总述", text: "本项目围绕既有生产体系中的关键工序设备更新展开，重点淘汰低效、高耗、稳定性不足的旧设备，新增硫化、成型、定型、破胶等先进装备，并配套保温设施和生产数据采集能力。项目建设边界清晰，资金投向集中，改造目标聚焦高端化、智能化、绿色化和本质安全提升。", cite: "参考片段：项目总投入 6000 万元，备案产能年产 3000 万条，建设内容以设备更新和配套提升为主。" },
      { title: "第二章 公司实施基础", text: "示例企业长期从事轮胎研发、生产和销售，已形成覆盖内外胎生产、质量检测、市场销售和售后服务的经营体系。企业具备较完整的产品系列、较成熟的客户网络和稳定的生产组织能力，现有研发、设备、质量、信息化、安全和财务管理队伍可参与设备选型、安装调试、工艺参数固化、质量验证和绩效跟踪。", cite: "参考片段：项目不重新建立完整工厂体系，而是在现有厂区、公辅条件和生产组织基础上完成关键设备替换。" },
      { title: "第三章 项目建设内容", text: "轮胎制造过程对材料配比、胶料处理、胎胚成型、定型保持、硫化温压时控制、成品检测和批次追溯均有较高要求。传统低效设备在运行年限、控制精度、能耗水平、维护频次和安全防护方面逐步显现短板，容易造成批次波动、返修返工、能源浪费和现场管理压力。", cite: "参考片段：新增设备有利于把生产经验转化为可记录、可控制、可追溯的生产参数。" },
      { title: "第四章 投资估算与资金筹措", text: "项目投资主要用于生产装备购置、配套设施完善和数字化管理能力建设。已投入金额、后续付款计划和财务年度计划应与合同履约、设备到货、安装验收和资产入账进度保持一致，形成合同、发票、付款记录、验收资料和财务台账相互印证的资金证明链条。", cite: "参考片段：资金口径需与备案总投入、合同履约和设备到货节点保持一致。" },
      { title: "第五章 节能降碳与绩效效果", text: "新增设备投用后，项目将在生产效率、质量稳定、能源利用、安全防护和管理精细化方面形成综合效果。硫化设备更新有利于提高温度、压力和时间控制稳定性，成型设备更新有利于提升胎胚尺寸一致性，MES 和数据采集能力能够把设备运行、生产批次、质量检测、仓储流转和异常处置纳入统一记录。", cite: "参考片段：项目可按月汇总产量、能耗、质量和安全数据，为资金审核和后评价提供支撑。" },
      { title: "第六章 风险控制与附件证明", text: "项目实施过程中，应围绕设备采购、到货、安装调试、试运行、验收和资产入账建立全过程管理台账。新增设备资料包括采购合同、发票、付款记录、技术协议、到货验收记录和资产入账凭证；淘汰设备资料包括旧设备明细、原始采购凭证、处置或报废手续及现场照片。", cite: "参考片段：通过上述资料，项目建设内容、资金支付、设备状态和绩效结果能够形成前后衔接的证明链条。" }
    ];
  }

  function docDraftHtml(app) {
    return '<div class="doc-preview app-doc-preview">' +
      sampleReportSections().map((ch, idx) => '<section id="doc-sec-sample-' + idx + '" class="' + (state.locatedTarget && state.locatedTarget.includes(ch.title.slice(0, 3)) ? "located" : "") + '">' +
      '<h3>' + esc(ch.title) + '</h3><p>' + esc(ch.text) + '</p><p class="cite">' + esc(ch.cite) + '</p></section>').join("") +
      '<div class="app-doc-foot">示例文书节选自设备更新申请书整理稿，并已做演示化改写。未手动存档时，后续微调会覆盖当前草稿。</div></div>';
  }

  function writerBottomChat(readonly) {
    return '<div class="writer-bottom-chat">' + agentMark("writerChat") + '<button class="btn btn-outline btn-sm" data-action="app-reference-file"' + (readonly ? " disabled" : "") + '>' + icon("paperclip") + '选择参考文件</button>' +
      '<input class="input" id="writer-chat-input" placeholder="输入调优要求，例如：按参考文件补充设备真实性说明，或调整第四章资金口径"' + (readonly ? " disabled" : "") + '>' +
      '<button class="btn btn-primary" data-action="app-writer-chat"' + (readonly ? " disabled" : "") + '>' + icon("send") + '发送调优</button></div>';
  }

  function runAppDocGenerate() {
    const panel = $("#app-doc-panel");
    if (!panel) return;
    panel.innerHTML = '<div class="ai-generate"><div class="eval-radar"><span class="eval-ring r1"></span><span class="eval-ring r2"></span><div class="eval-core">' + icon("spark") + '</div></div><div class="eval-step" id="app-gen-step">读取企业资料库</div><div class="eval-progress"><i id="app-gen-bar"></i></div><div class="card-sub">预计等待 38 秒 · 演示加速中</div></div>';
    const steps = ["读取企业资料库", "匹配两新申报模板", "校验章节资料完整度", "生成文书主体", "标注证据缺口", "写入实时草稿缓存"];
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      const s = $("#app-gen-step");
      const b = $("#app-gen-bar");
      if (s) s.textContent = steps[Math.min(i, steps.length - 1)];
      if (b) b.style.width = Math.min(100, (i + 1) * 17) + "%";
      if (i >= steps.length - 1) {
        clearInterval(tick);
        state.docGenerated = true;
        panel.innerHTML = docDraftHtml(currentApplication());
        toast("文书已生成，最新草稿已实时缓存", "success");
      }
    }, 520);
  }

  function tuneSimilarityData() {
    return [
      { level: "高", chapter: "二、项目建设背景与必要性", target: "设备老化、效率不足、单位能耗偏高", compare: "对比企业A / 对比企业B", similarity: 86, advice: "加入当前企业动力部件精密加工、连续化转运和客户交付约束，避免通用设备更新表述。" },
      { level: "中", chapter: "三、建设内容与设备更新方案", target: "更新数控加工、检测、抛光、起重等关键设备", compare: "对比企业A", similarity: 72, advice: "补充设备A/B/C的工序位置、产线瓶颈和新增质量追溯能力。" },
      { level: "中", chapter: "五、节能降碳与安全环保", target: "降低老旧设备维护频次，改善现场安全和能耗管理", compare: "对比企业B", similarity: 68, advice: "加入企业现有能耗基线、预计单件能耗下降和安全联锁改造。" }
    ];
  }

  function docEditorHtml(readonly) {
    return '<textarea class="input doc-edit-area" ' + (readonly ? "readonly" : "") + '>' + sampleReportSections().map(ch => ch.title + "\n" + ch.text).join("\n\n") + '</textarea>';
  }

  function viewAiTuneV2(app) {
    const readonly = appArchived(app);
    const compare = tuneSimilarityData().map((x, i) =>
      '<div class="similarity-card"><div class="similarity-head"><div>' + st(x.level) + '<b>' + esc(x.chapter) + '</b></div><span>' + x.similarity + '%</span></div>' +
      '<div class="similarity-meter"><i style="width:' + x.similarity + '%"></i></div><p><b>雷同片段：</b>' + esc(x.target) + '</p><p><b>横向对比：</b>' + esc(x.compare) + '</p>' +
      '<div class="ai-suggestion">' + icon("spark") + '<span>' + esc(x.advice) + '</span></div><div class="page-actions">' + agentMark("aiTune") + '<button class="btn btn-outline btn-sm" data-action="app-locate" data-target="' + esc(x.chapter) + '"' + (readonly ? " disabled" : "") + '>' + icon("target") + '定位</button><button class="btn btn-primary btn-sm" data-action="app-tune-apply" data-id="' + i + '"' + (readonly ? " disabled" : "") + '>人工确认修改</button></div></div>').join("");
    return '<div class="tune-workbench app-section"><div class="card"><div class="card-head"><div><div class="card-title">' + agentTitle("当前企业文书草稿", "aiTune") + " " + aiDocChip() + '</div><div class="card-sub">读取文书智写最新草稿，支持人工手动调整</div></div>' + docTopActions(readonly) + '</div><div class="ai-line"><span></span><b>Agent 正在扫描段落相似度、企业特色缺口和通用化表达</b></div>' + docEditorHtml(readonly) +
      '<div class="writer-bottom-chat tune-inline-chat">' + agentMark("writerChat") + '<button class="btn btn-outline btn-sm" data-action="app-reference-file"' + (readonly ? " disabled" : "") + '>' + icon("paperclip") + '选择参考文件</button><input class="input" id="tune-input" placeholder="输入局部调优要求，例如：降低同质化、强化当前企业特色"' + (readonly ? " disabled" : "") + '><button class="btn btn-primary" data-action="app-refine"' + (readonly ? " disabled" : "") + '>' + icon("send") + '微调</button></div></div>' +
      '<div class="tune-side"><div class="card"><div class="card-head"><div><div class="card-title">' + agentTitle("项目库横向对比", "qcEntry") + '</div><div class="card-sub">先从知识库「企业资料库」多选文本，再进行同机构文书交叉验证</div></div><div class="ai-orbit tiny"><b>AI</b></div></div>' +
      '<div class="marked-action-row"><button class="btn btn-outline btn-block compare-select-btn" data-action="app-select-compare-text"' + (readonly ? " disabled" : "") + '>' + icon("database") + '选择企业资料库文本</button>' + agentMark("compareSelect") + '</div>' +
      '<div class="compare-source-note"><b>已选文本：</b>企业资料库 / 历史申报文书 / 设备更新类章节片段 3 条</div>' + compare + '</div></div></div>';
  }

  function maskCompanyForReport(c) {
    const map = {
      "高端装备": "华东某智能装备企业",
      "新能源电池": "华东某新能源材料企业",
      "化工新材料": "华东某新材料企业",
      "生物医药": "华东某生物医药企业"
    };
    return map[c.industry] || "华东某制造业企业";
  }

  function evalReportHtml(c, r) {
    const masked = maskCompanyForReport(c);
    const area = c.region ? c.region + "及周边产业集聚区" : "华东区域产业集聚区";
    const projectName = c.projectType + "与设备更新项目";
    const implementer = masked + "（脱敏）";
    const score = r.score || c.score;
    const deviceInvest = Math.round((c.invest || 8600) * 0.72);
    const gapText = (r.gaps || []).join("、") || "审计报告、开工证明等材料需进一步核验";
    return '<div class="doc-preview eval-report-scroll"><article class="eval-report-paper">' +
      '<h2 class="eval-report-title">中央预算内资金申报初步评估建议</h2>' +
      '<p class="eval-report-intro">在充分了解' + esc(masked) + '公开信息、项目备案资料及现有申报材料后，申报评估 Agent 对其拟申报项目进行了初步评估。鉴于当前详细财务资料和部分佐证文件仍需补充，本报告仅作为申报可行性研判与后续尽调清单参考。</p>' +
      '<table class="eval-report-table eval-report-meta"><tbody>' +
      '<tr><th>企业简称</th><td>' + esc(masked) + '</td><th>所在区域</th><td>' + esc(area) + '</td></tr>' +
      '<tr><th>所属行业</th><td>' + esc(c.industry) + '</td><th>项目类型</th><td>' + esc(c.projectType) + '</td></tr>' +
      '<tr><th>建设状态</th><td>' + esc(c.status) + '</td><th>初步评分</th><td>' + score + ' 分</td></tr>' +
      '</tbody></table>' +
      '<section class="eval-report-section"><h4>一、企业简介</h4>' +
      '<p>' + esc(masked) + '位于' + esc(area) + '，主营业务聚焦' + esc(c.industry) + '相关产品研发、生产与配套服务。根据现有企业画像和公开资料，该企业具备较稳定的生产经营基础，项目方向与区域产业链补链、强链和设备更新政策导向具有一定匹配度。</p>' +
      '<p>目前可见资料显示，企业具备项目备案、设备购置计划及部分投资凭证，后续仍需结合审计报告、完税证明、设备合同发票和项目开工资料进一步核验其申报主体资格与财务承载能力。</p>' +
      '</section>' +
      '<section class="eval-report-section"><h4>二、企业财务状况</h4>' +
      '<p>受限于当前资料完整度，财务评估以企业提供的摘要信息和知识库材料为基础。初步判断企业投资规模与设备购置金额达到政策申报门槛，但收入规模、资产负债情况及现金流稳定性仍需通过最新年度审计报告、银行流水或授信文件补充确认。</p>' +
      '<p class="eval-report-note">需重点补充：' + esc(gapText) + '。低置信结论应由项目经理或财务复核人员进行人工确认。</p>' +
      '</section>' +
      '<section class="eval-report-section"><h4>三、企业新建项目情况</h4>' +
      '<table class="eval-report-table"><thead><tr><th>建设地点</th><th>项目名称</th><th>实施单位</th><th>项目介绍</th><th>项目投资/万元</th><th>备注</th></tr></thead><tbody>' +
      '<tr><td>' + esc(area) + '</td><td>' + esc(projectName) + '</td><td>' + esc(implementer) + '</td><td>' + esc(c.brief) + '。项目拟通过关键设备购置、产线改造和数字化管理能力提升，改善生产效率、质量稳定性与能耗水平。</td><td>' + esc(String(c.invest || 0)) + '</td><td>设备购置约 ' + esc(String(deviceInvest)) + ' 万元，需补齐合同、发票及付款凭证口径。</td></tr>' +
      '</tbody></table>' +
      '<p>从项目建设内容看，该项目与设备更新、技术改造和制造业高质量发展方向具有较强关联；但申报材料中涉及建设进度、设备真实性、投资支付闭环的证据链仍需进一步固化。</p>' +
      '</section>' +
      '<section class="eval-report-section"><h4>四、产业发展现状与趋势分析</h4>' +
      '<p>' + esc(c.industry) + '领域当前呈现智能化、绿色化和国产化替代并行推进的趋势。政策侧持续鼓励企业以先进设备更新带动产能结构优化，以数字化系统提升生产组织效率，并对节能降耗、质量追溯和安全生产提出更高要求。</p>' +
      '<p>结合项目描述，企业拟投设备及配套系统能够支撑关键工序效率提升，对区域产业链稳定和企业产品竞争力提升具备积极意义，建议在正式申报文本中进一步强化技术先进性、设备必要性和项目绩效指标。</p>' +
      '</section>' +
      '<section class="eval-report-section"><h4>五、初步评估结论与申报建议</h4>' +
      '<p>综合政策条件、项目投资规模、设备购置比例和材料完整度，本项目初步评估得分为 <b>' + score + ' 分</b>，结论为：' + esc(r.level) + '。<span class="cite">[依据：政策条件逐项匹配结果]</span></p>' +
      '<p>建议先完成材料缺口补正与低置信事项人工复核，再进入正式申报文书撰写阶段。重点核验事项包括开工证明、审计报告、设备合同/发票/付款回单一致性及项目备案内容与实际建设内容一致性。<span class="cite">[依据：材料比对 QC-20260801-03]</span></p>' +
      '</section>' +
      '</article></div>';
  }

  function scoreProofItems() {
    return [
      { id: "p1", level: "必须修改", pos: "四、投资构成与资金筹措", text: "合同、发票、付款回单存在合并付款口径，金额差异需最终说明。", suggest: "授权后补充“差异金额待企业付款说明确认”的限定表述。" },
      { id: "p2", level: "建议修改", pos: "三、建设内容与设备更新方案", text: "部分设备缺现场照片，设备真实性证明仍不完整。", suggest: "增加设备照片补充清单，并将当前结论标注为待核验。" },
      { id: "p3", level: "需人工确认", pos: "五、节能降碳与安全环保", text: "节能测算缺少基准年数据，预计降耗比例依据不足。", suggest: "保留节能方向，删除未有依据的精确比例。" },
      { id: "p4", level: "建议修改", pos: "全文表述", text: "多处使用通用化表达，企业特色与技术改造必要性关联不够强。", suggest: "仅针对提示段落微调，不进行整篇重写。" }
    ];
  }

  function viewSmartScoreV2(app) {
    const readonly = appArchived(app);
    const proof = scoreProofItems().filter(x => !state.scoreResolved.has(x.id));
    const proofHtml = proof.length ? proof.map(x =>
      '<div class="proof-card"><div class="score-issue"><div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + st(x.level) + '<b>' + esc(x.pos) + '</b></div><p>' + esc(x.text) + '</p><span>建议：' + esc(x.suggest) + '</span></div></div><div class="page-actions">' + agentMark("proofread") + '<button class="btn btn-outline btn-sm" data-action="app-score-manual" data-id="' + x.id + '"' + (readonly ? " disabled" : "") + '>' + icon("edit") + '手动修改</button><button class="btn btn-outline btn-sm" data-action="app-score-chat" data-id="' + x.id + '"' + (readonly ? " disabled" : "") + '>' + icon("chat") + '针对提示微调</button><button class="btn btn-primary btn-sm" data-action="app-score-fix" data-id="' + x.id + '"' + (readonly ? " disabled" : "") + '>' + icon("check") + '同意修改</button></div></div>').join("") : '<div class="empty">' + icon("check") + '<div>全文最终校对问题已处理，可导出并归档项目</div></div>';
    return '<div class="score-workbench app-section"><div class="card writer-doc-card"><div class="card-head"><div><div class="card-title">文书终稿预览 ' + aiDocChip() + '</div><div class="card-sub">用于评分和全文校对的最新草稿</div></div>' + docTopActions(readonly) + '</div><div class="doc-preview app-doc-preview score-doc-preview">' +
      sampleReportSections().map((ch, idx) => '<section id="score-doc-sec-' + idx + '"><h3>' + esc(ch.title) + '</h3><p>' + esc(ch.text) + '</p><p class="cite">' + esc(ch.cite) + '</p></section>').join("") + '</div></div>' +
      '<div class="score-side"><div class="card score-ai-card ' + (state.scoreCollapsed ? "collapsed" : "") + '"><div class="card-head"><div><div class="card-title">' + agentTitle("AI评分", "score") + '</div><div class="card-sub">可收起查看，综合得分 88</div></div><button class="btn btn-outline btn-sm" data-action="app-toggle-score">' + (state.scoreCollapsed ? "展开" : "收起") + '</button></div>' +
      (state.scoreCollapsed ? "" : '<div class="score-hero compact"><div class="score-ring-wrap">' + ring(88, "#1a73e8") + '<div class="ai-scan-beam"></div></div><div class="score-report"><h3>综合评估报告</h3><p>当前文书综合得分 88 分，政策契合度和格式规范表现较好；短板集中在材料完整性、资金口径一致性、节能测算依据和企业特色表达。</p></div></div><div class="chart-bars compact"><div><span>政策契合</span><i style="width:92%"></i><b>92</b></div><div><span>材料完整</span><i style="width:78%"></i><b>78</b></div><div><span>证据支撑</span><i style="width:85%"></i><b>85</b></div><div><span>行文逻辑</span><i style="width:88%"></i><b>88</b></div><div><span>格式规范</span><i style="width:96%"></i><b>96</b></div></div>') + '</div>' +
      '<div class="card score-proof-panel"><div class="card-head"><div><div class="card-title">' + agentTitle("AI校对", "proofread") + '</div><div class="card-sub">建议修改 ' + proof.length + ' 条 · 固定高度滚动</div></div><div class="ai-orbit tiny"><b>AI</b></div></div><div class="ai-line"><span></span><b>校对光标正在锁定逻辑错误、前后矛盾和数据口径风险</b></div><div class="proof-scroll">' + proofHtml + '</div></div></div></div>';
  }

  /* ===== 答辩准备 ===== */
  function viewPPT() {
    const slides = GQ.ppt.slides.map((s, i) =>
      '<div class="slide-card' + (i === state.pptActive ? " active" : "") + '" data-action="ppt-select" data-id="' + i + '">' +
      '<div class="slide-thumb"><i></i><i></i><i></i><i></i></div><div class="slide-name">' + (i + 1) + ". " + esc(s.title) + "</div></div>").join("");
    return pageHead("答辩PPT", "基于申报书与企业资料生成答辩 PPT 骨架和成稿，支持引用企业模板、演讲备注与对话微调。",
      '<button class="btn btn-outline" data-action="ppt-template">' + icon("upload") + "上传品牌模板</button>" +
      '<button class="btn btn-primary" data-action="ppt-export">' + icon("download") + "导出 PPTX</button>") +
      '<div class="grid-2-1"><div class="card"><div class="card-head"><div><div class="card-title">PPT 骨架</div><div class="card-sub">答辩支持 Agent 已提取 7 页结构，点击页面查看内容</div></div></div>' +
      '<div class="slide-grid">' + slides + "</div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">页面详情</div><div class="card-sub">演讲备注与答辩要点</div></div></div><div id="ppt-preview">' + pptPreviewHtml() + "</div></div></div>";
  }

  function pptPreviewHtml() {
    const s = GQ.ppt.slides[state.pptActive];
    return '<div class="doc-preview" style="margin-bottom:12px"><h3 style="font-size:16px;color:#153b7a">' + esc(s.title) + "</h3>" +
      s.points.map(p => "<p>· " + esc(p) + "</p>").join("") + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">演讲备注</div><div class="qa-text">' + esc(GQ.ppt.notes) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">可能被问问题</div>' + GQ.ppt.questions.map(q => '<div style="font-size:13px;padding:4px 0">· ' + esc(q) + "</div>").join("") + "</div>" +
      '<div class="chat-input"><input class="input" id="ppt-refine-input" placeholder="对话微调，例如：第三页增加国产替代对比表">' +
      '<button class="btn btn-primary" data-action="ppt-refine">' + icon("send") + "微调</button></div>";
  }

  function viewDefense() {
    return pageHead("模拟答辩", "按评分维度、项目真实性、资金合理性、技术先进性与实施可行性生成专家问题，模拟回答并输出薄弱点与补强建议。",
      '<button class="btn btn-outline" data-action="defense-start">' + icon("refresh") + "重新开始演练</button>") +
      '<div class="grid-2"><div class="card"><div class="card-head"><div><div class="card-title">专家问题</div><div class="card-sub">评分细则：' + esc(GQ.policies[1].name) + "</div></div></div>" +
      '<div id="defense-questions">' + GQ.defense.map(d =>
        '<div class="card hoverable" style="margin-bottom:10px;box-shadow:none"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">' + st(d.dim) + "</div>" +
        '<b style="font-size:14px">' + esc(d.question) + '</b><div style="font-size:12px;color:#64748b;margin-top:4px">参考回答提示：' + esc(d.sample) + "</div>" +
        '<button class="btn btn-outline btn-sm" style="margin-top:10px" data-action="defense-pick" data-id="' + d.id + '">' + icon("chat") + "我来回答</button></div>").join("") + "</div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">模拟回答与点评</div><div class="card-sub">答辩支持 Agent</div></div></div><div id="defense-area">' +
      '<div class="empty">' + icon("chat") + "<div>选择一道专家问题开始模拟回答<br>提交后 Agent 将点评薄弱点并给出参考回答</div></div></div></div></div>";
  }

  function defensePick(id) {
    const d = GQ.defense.find(x => x.id === id);
    state.defenseCurrent = d;
    $("#defense-area").innerHTML =
      '<div class="qa-block"><div class="qa-block-title">' + st(d.dim) + " · 专家提问</div>" +
      '<div class="qa-text" style="background:#f0f9ff;border-color:#bfdbfe">' + esc(d.question) + "</div></div>" +
      '<label class="field"><span>我的回答</span><textarea class="input" id="defense-answer" rows="5" placeholder="输入你的模拟回答…"></textarea></label>' +
      '<button class="btn btn-primary btn-block" style="margin-top:12px" data-action="defense-submit">' + icon("send") + "提交回答并点评</button>";
  }

  function defenseSubmit() {
    const d = state.defenseCurrent;
    const answer = $("#defense-answer") ? $("#defense-answer").value.trim() : "";
    if (!d) { toast("请先选择一道专家问题", "warning"); return; }
    const area = $("#defense-area");
    area.innerHTML = '<div class="agent-steps"><span class="spin"></span><span class="flow-text">正在按评分点点评回答…</span></div>';
    setTimeout(() => {
      area.innerHTML =
        '<div class="qa-block"><div class="qa-block-title">你的回答</div><div class="qa-text">' + (answer || "（未填写，按示例回答点评）") + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">薄弱点</div><div class="qa-text" style="background:#fffbeb;border-color:#fde68a">回答缺少量化依据，建议补充检测标准、合同金额或第三方证明。</div></div>' +
        '<div class="qa-block"><div class="qa-block-title">参考回答</div><div class="qa-text">' + esc(d.sample) + "</div></div>" +
        '<div class="qa-block"><div class="qa-block-title">补强材料建议</div><div>' +
        ['检测报告（ISO 230）', '设备采购合同摘要', '银行授信意向函'].map(g => '<span class="chip" style="background:#d1fae5;color:#059669">' + g + "</span>").join(" ") + "</div></div>" +
        '<div class="page-actions" style="margin-top:12px"><button class="btn btn-primary" data-action="defense-save">' + icon("check") + "保存复盘记录</button>" +
        '<button class="btn btn-outline" data-action="defense-next">' + icon("refresh") + "下一题</button></div>";
    }, 1200);
  }

  /* ===== 系统设置 ===== */
  function viewAccounts() {
    const rows = state.accounts.map(a =>
      "<tr><td><b>" + esc(a.name) + '</b><div style="font-size:12px;color:#64748b">' + esc(a.account) + "</div></td>" +
      "<td>" + esc(a.dept) + "</td><td>" + st(a.role) + "</td><td>" + esc(a.scope) + "</td><td>" + st(a.status) + "</td>" +
      "<td>" + esc(a.last) + "</td><td style=\"white-space:nowrap\"><span class=\"link\" data-action=\"account-edit\" data-id=\"" + a.account + '">编辑</span> · ' +
      '<span class="link" data-action="account-toggle" data-id="' + a.account + '">' + (a.status === "启用" ? "停用" : "启用") + "</span></td></tr>").join("");
    return pageHead("账号管理", "企业内部工作人员账号统一管理：创建、启用、停用、角色、部门与项目范围授权。",
      '<button class="btn btn-primary" data-action="account-add">' + icon("plus") + "创建账号</button>") +
      '<div class="card"><div class="card-head"><div><div class="card-title">账号列表</div><div class="card-sub">账号停用即时生效，权限变更自动留痕</div></div>' +
      '<input class="input" style="width:240px" placeholder="搜索姓名 / 账号 / 部门"></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>姓名 / 账号</th><th>部门</th><th>角色</th><th>项目范围</th><th>状态</th><th>最近登录</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function accountModal() {
    modal("创建账号", "创建后账号默认启用，项目范围由管理员后续调整",
      '<div class="form-grid"><label class="field"><span>姓名</span><input class="input" placeholder="如：钱进"></label>' +
      '<label class="field"><span>账号</span><input class="input" placeholder="如：pm05"></label>' +
      '<label class="field"><span>部门</span><select class="select"><option>项目部</option><option>市场部</option><option>数字化部</option><option>财务部</option></select></label>' +
      '<label class="field"><span>角色</span><select class="select"><option>申报顾问</option><option>项目经理</option><option>市场人员</option><option>财务复核</option></select></label></div>' +
      '<label class="field" style="margin-top:14px"><span>项目范围</span><input class="input" placeholder="如：生物医药方向 2 家"></label>',
      '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="account-save">保存</button>');
  }

  function viewPermission() {
    const m = GQ.roleMatrix;
    const customRoles = state.customRoles || [];
    const allRoles = [...m.roles, ...customRoles];
    const perms = m.perms;
    const renderRow = (p, vals) => {
      const cells = allRoles.map((r, ri) => "<td>" + (vals[ri] ? '<span style="color:#1a73e8;font-weight:700">✓</span>' : '<span style="color:#cbd5e1">—</span>') + "</td>").join("");
      if (p.sub && p.sub.length) {
        return p.sub.map((sub, idx) =>
          "<tr>" +
          (idx === 0 ? '<td rowspan="' + p.sub.length + '"><b>' + esc(p.name) + "</b></td>" : "") +
          '<td style="font-size:12px;color:var(--text-2)">' + esc(sub) + "</td>" +
          cells +
          "</tr>").join("");
      }
      return "<tr><td colspan=\"2\"><b>" + esc(p.name) + "</b></td>" + cells + "</tr>";
    };
    const matrixRows = perms.map(p => {
      const vals = allRoles.map((r, ri) => {
        const bi = m.roles.indexOf(r);
        if (bi >= 0) return p.value[bi];
        const cr = customRoles[ri - m.roles.length];
        return cr ? (cr.perms[perms.indexOf(p)] || 0) : 0;
      });
      return renderRow(p, vals);
    }).join("");
    return pageHead("权限管理", "按角色、部门、项目成员与客户归属控制查看、编辑、下载、导出与删除权限。") +
      '<div class="section"><div class="card"><div class="card-head"><div><div class="card-title">角色权限矩阵</div><div class="card-sub">RBAC + 项目/客户归属授权</div></div>' +
      '<button class="btn btn-outline btn-sm" data-action="perm-add-role">' + icon("plus") + "新增角色</button></div>" +
      '<div class="table-wrap"><table class="table"><thead><tr><th style="min-width:100px">权限项</th><th style="min-width:80px">子项</th>' +
      allRoles.map(r => '<th class="role-th" data-action="perm-edit-role" data-role="' + esc(r) + '" style="cursor:pointer">' + esc(r) + '</th>').join("") + "</tr></thead><tbody>" + matrixRows + "</tbody></table></div></div></div>";
  }

  function viewAudit() {
    const rows = GQ.audits.map(a =>
      "<tr><td>" + esc(a.time) + "</td><td>" + esc(a.user) + "</td><td>" + esc(a.action) + "</td><td>" + esc(a.object) + "</td>" +
      "<td>" + st(a.result) + "</td><td>" + esc(a.ip) + "</td><td>" + st(a.type) + "</td>" +
      '<td class="link" data-action="audit-detail" data-id="' + esc(a.time) + '">详情</td></tr>').join("");
    return pageHead("审计记录", "高敏资料访问、下载与导出均保留审计记录，支持按用户、项目、企业、文件维度查询。",
      '<button class="btn btn-outline" data-action="audit-export">' + icon("download") + "导出审计日志</button>") +
      '<div class="filter-bar">' +
      '<div class="field"><span>操作类型</span><select class="select"><option>全部</option><option>访问</option><option>查询</option><option>导出</option><option>管理</option><option>安全</option><option>AI</option></select></div>' +
      '<div class="field"><span>结果</span><select class="select"><option>全部</option><option>成功</option><option>已拦截</option><option>待审批</option></select></div>' +
      '<div class="field"><span>用户</span><input class="input" placeholder="输入用户姓名"></div>' +
      '<button class="btn btn-primary">查询</button></div>' +
      '<div class="card"><div class="card-head"><div><div class="card-title">操作审计</div><div class="card-sub">审计日志防篡改</div></div>' + st("记录完整") + "</div>" +
      '<div class="table-wrap"><table class="table"><thead><tr><th>时间</th><th>用户</th><th>动作</th><th>对象</th><th>结果</th><th>IP</th><th>类型</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function auditDetail(time) {
    const a = GQ.audits.find(x => x.time === time);
    drawer("审计详情", a.time,
      '<div class="qa-block"><div class="qa-block-title">操作者</div><div class="qa-text">' + esc(a.user) + " · " + esc(a.ip) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">动作与对象</div><div class="qa-text">' + esc(a.action) + " → " + esc(a.object) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">结果</div><div class="qa-text">' + esc(a.result) + " · 类型：" + esc(a.type) + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">上下文</div><div class="qa-text">会话令牌已校验 · 权限规则命中 · 操作留痕哈希已记录</div></div>',
      '<button class="btn btn-outline" data-close="drawer">关闭</button>');
  }

  function viewSecurity() {
    const rows = state.security.map((s, i) =>
      '<div class="setting-row"><div><b>' + esc(s.name) + '</b><span>' + esc(s.desc) + "</span></div>" +
      (typeof s.value === "boolean"
        ? '<button class="switch' + (s.value ? " on" : "") + '" data-action="security-toggle" data-id="' + i + '" role="switch" aria-checked="' + s.value + '"></button>'
        : '<select class="select" style="width:150px" data-action="security-select" data-id="' + i + '"><option' + (s.value === "24 小时" ? " selected" : "") + '>24 小时</option><option' + (s.value === "12 小时" ? " selected" : "") + '>12 小时</option><option' + (s.value === "7 天" ? " selected" : "") + '>7 天</option></select>') + "</div>").join("");
    return pageHead("安全策略", "密码规则、登录有效期、二次验证、异常登录提醒、账号锁定与导出审批统一配置。",
      '<button class="btn btn-primary" data-action="security-save">' + icon("check") + "保存策略</button>") +
      '<div class="grid-2"><div class="card"><div class="card-head"><div><div class="card-title">访问安全</div><div class="card-sub">本地化部署环境默认开启</div></div></div>' + rows + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">当前安全态势</div><div class="card-sub">近 30 天</div></div></div>' +
      '<div class="grid-3" style="gap:12px">' +
      '<div class="kpi" style="padding:12px"><div class="kpi-ico">' + icon("shield") + '</div><div class="kpi-meta"><div class="kpi-label">异常登录拦截</div><div class="kpi-value">3</div></div></div>' +
      '<div class="kpi" style="padding:12px"><div class="kpi-ico">' + icon("key") + '</div><div class="kpi-meta"><div class="kpi-label">导出审批</div><div class="kpi-value">12</div></div></div>' +
      '<div class="kpi" style="padding:12px"><div class="kpi-ico">' + icon("lock") + '</div><div class="kpi-meta"><div class="kpi-label">账号锁定</div><div class="kpi-value">1</div></div></div></div>' +
      '<div class="qa-block" style="margin-top:12px"><div class="qa-block-title">建议</div><div class="qa-text">10 月申报高峰前建议完成全量压测、账号巡检与导出审批演练。</div></div></div></div>';
  }

  /* ===== 事件绑定 ===== */
  function bindLogin() {
    const btn = $("#login-btn");
    if (btn) {
      btn.addEventListener("click", doLogin);
    }
    $$(".role-chip").forEach(chip => chip.addEventListener("click", () => {
      $$(".role-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      $("#login-role").value = chip.dataset.role;
    }));
  }

  function doLogin() {
    const account = ($("#login-account")?.value || "").trim() || "pm01";
    const pwd = $("#login-password")?.value || "";
    const role = ($("#login-role")?.value || "申报顾问");
    const u = Object.assign({}, GQ.users[account] || { name: account === "admin" ? "赵敏" : "顾晓岚", dept: "项目部" }, { role });
    const btn = $("#login-btn");
    if (!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="spin" style="width:15px;height:15px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin .8s linear infinite"></span> 正在登录…';
    setTimeout(() => {
      state.user = u;
      $("#login-view").classList.add("hidden");
      $("#app-shell").classList.remove("hidden");
      document.body.classList.remove("login-mode");
      $("#side-user-name").textContent = u.name;
      $("#side-user-role").textContent = u.role;
      $("#top-user-name").textContent = u.name;
      $("#top-user-role").textContent = u.role;
      $("#side-avatar").textContent = u.name.slice(0, 1);
      $("#top-avatar").textContent = u.name.slice(0, 1);
      const r = (location.hash || "#/home").replace("#/", "") || "home";
      state.route = r;
      renderView();
      toast("欢迎回来，" + u.name + "（" + u.role + "）", "success");
    }, 300);
  }

  function uploadMaterialModal(title, sub, okAction, okText) {
    modal(title || "上传资料", sub || "支持上传资料窗口与本地文件夹目录索引两种方式",
      '<div class="qa-block"><div class="qa-block-title">上传资料的窗口</div>' +
      '<div class="folder-index-upload" style="margin-top:8px">' + icon("upload") +
      '<div><b>点击选择资料文件</b><span>支持 PDF / Word / Excel / 图片等资料批量导入</span></div></div></div>' +
      '<div class="qa-block" style="margin-top:14px"><div class="qa-block-title">从本地文件夹目录索引</div>' +
      '<label class="field" style="margin-top:8px"><span>索引地址</span><input class="input" id="folder-index-path" placeholder="添加索引地址，例如：D:\\项目资料\\企业资料包"></label>' +
      '<div class="folder-index-upload" style="margin-top:10px">' + icon("folder") +
      '<div><b>添加本地文件夹目录索引</b><span>系统将按目录索引分类合同、发票、付款回单、设备照片与申报附件</span></div></div></div>',
      '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="' + okAction + '">' + (okText || "上传并解析") + "</button>");
  }

  function renderNotifications() {
    $("#notify-list").innerHTML = GQ.notifications.map(n =>
      '<div class="drop-item"><span class="dot ' + (n.level === "red" ? "dot-red" : n.level === "yellow" ? "dot-yellow" : "dot-blue") + '"></span><div><b>' + esc(n.title) + '</b><span>' + esc(n.text) + "</span><time>" + esc(n.time) + "</time></div></div>").join("");
  }

  function openSearch(q) {
    const pages = [];
    for (const g of GQ.nav) {
      if (g.children) g.children.filter(c => !c.hidden).forEach(c => pages.push({ title: g.title + " · " + c.title, route: c.route }));
      else pages.push({ title: g.title, route: g.route });
    }
    const matchedPages = pages.filter(p => !q || p.title.includes(q));
    const matchedCos = GQ.companies.filter(c => !q || c.name.includes(q) || c.industry.includes(q) || c.region.includes(q)).slice(0, 5);
    const matchedPols = GQ.policies.filter(p => !q || p.name.includes(q));
    const body =
      '<div class="qa-block"><div class="qa-block-title">功能页面</div>' +
      (matchedPages.length ? matchedPages.slice(0, 8).map(p => '<div style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="color:#1a73e8">' + icon("file") + "</span><span class=\"link\" data-route=\"" + p.route + '">' + esc(p.title) + "</span></div>").join("") : '<div style="color:#94a3b8;font-size:13px">未找到匹配页面</div>') + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">企业</div>' +
      (matchedCos.length ? matchedCos.map(c => '<div style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="color:#64748b">' + icon("users") + '</span><span class="link" data-action="company-view" data-id="' + c.id + '">' + esc(c.name) + " · " + c.score + " 分</span></div>").join("") : '<div style="color:#94a3b8;font-size:13px">未找到匹配企业</div>') + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">政策</div>' +
      (matchedPols.length ? matchedPols.map(p => '<div style="padding:6px 0"><span class="link" data-route="#/evaluate">' + esc(p.name) + "</span></div>").join("") : '<div style="color:#94a3b8;font-size:13px">未找到匹配政策</div>') + "</div>";
    modal("全局搜索", q ? "关键词：" + esc(q) : "搜索功能、企业、政策、文档",
      body,
      '<button class="btn btn-outline" data-close="modal">关闭</button>');
  }

  /* 动作分发（视图、弹窗、抽屉共用） */
  function handleAction(action, el) {
    switch (action) {
      case "agent-mark":
        agentMarkModal(el.dataset.mark);
        break;
      case "app-open":
        state.applicationId = el.dataset.id || "mkd-2026";
        state.applicationTab = "files";
        renderView();
        break;
      case "app-back":
        state.applicationId = null;
        state.applicationTab = "files";
        renderView();
        break;
      case "app-tab":
        state.applicationTab = el.dataset.tab || "files";
        renderView();
        break;
      case "app-toggle-alert":
        state.alertCollapsed = !state.alertCollapsed;
        renderView();
        break;
      case "app-new-project":
        modal("新增企业项目", "创建后进入项目管理，并指定唯一技术人员负责资料核对与技术口径确认",
          '<div class="form-grid"><label class="field"><span>企业名称</span><input class="input" placeholder="请输入企业名称"></label>' +
          '<label class="field"><span>申报项目类型</span><select class="select"><option>国债两新</option><option>设备更新</option><option>技术改造</option></select></label></div>' +
          '<label class="field" style="margin-top:14px"><span>项目描述</span><textarea class="input" rows="4" placeholder="说明项目建设内容、设备更新范围、申报目标等"></textarea></label>' +
          '<label class="field" style="margin-top:14px"><span>技术人员</span><select class="select">' +
          GQ.accounts.filter(a => a.status === "启用" && a.dept === "项目部").map(a => '<option>' + esc(a.name) + " · " + esc(a.role) + "</option>").join("") +
          '</select></label>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="app-new-project-save">创建项目</button>');
        break;
      case "app-new-project-save":
        closeModal();
        toast("企业项目已创建，资料目录索引已进入解析队列（演示）", "success");
        break;
      case "app-upload":
        uploadMaterialModal("上传企业资料", "上传资料的窗口，可补充本地文件夹目录索引地址", "app-upload-ok", "导入并识别");
        break;
      case "app-upload-ok":
        closeModal();
        state.aiScanDone = true;
        toast("企业资料已导入，Agent 已完成初步识别", "success");
        renderView();
        break;
      case "app-scan": {
        const box = $("#app-scan-result");
        state.resolvedInsights = new Set();
        if (box) runFlow(box, ["扫描文件目录", "抽取合同/发票/照片元数据", "比对设备索引表", "识别缺失资料与逻辑矛盾"], insightHtml());
        state.aiScanDone = true;
        break;
      }
      case "app-resolve-insight": {
        state.resolvedInsights.add(el.dataset.id);
        const panel = $("#app-scan-result");
        if (panel) panel.innerHTML = insightHtml();
        toast("已从个人工作清单移除；下次 AI 识别会按资料现状重新判断", "success");
        break;
      }
      case "app-delete-file":
        toast("文件已从当前资料包移除（演示，不删除本地文件）", "success");
        break;
      case "app-select-compare-text":
        modal("选择企业资料库文本", "从知识库的企业资料库中多选文本片段，作为横向比对样本",
          '<div class="qa-block"><div class="qa-block-title">企业资料库 / 可比对文本</div>' +
          [
            ["历史申报文书", "项目建设背景与必要性 · 设备更新类通用表述"],
            ["企业资料包", "设备清单与技术参数 · 数控加工/检测/转运工序"],
            ["历史案例", "节能降碳与安全环保 · 能耗基线和绩效口径"],
            ["企业画像", "主营业务与产线特色 · 客户交付与质量体系"]
          ].map((x, i) => '<label class="setting-row compare-text-option"><div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div><input type="checkbox" ' + (i < 3 ? "checked" : "") + "></label>").join("") +
          '</div>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="app-compare-text-ok">开始比对</button>');
        break;
      case "app-compare-text-ok":
        closeModal();
        toast("已选择企业资料库文本，开始进行横向比对", "success");
        break;
      case "app-chapter":
        state.activeOutline = el.dataset.id || "base";
        renderView();
        break;
      case "app-gap-detail": {
        const ch = GQ.liangxinOutline.find(x => x.id === el.dataset.id);
        if (!ch) break;
        modal("缺失资料", ch.title,
          ch.missing.length ? '<div class="qa-block"><div class="qa-block-title">需补充资料</div>' + ch.missing.map(g => '<div class="qa-text" style="margin-bottom:8px">' + esc(g) + '</div>').join("") + '</div>' : '<div class="empty">' + icon("check") + '<div>当前章节资料完整</div></div>',
          '<button class="btn btn-outline" data-close="modal">关闭</button>');
        break;
      }
      case "app-generate-doc":
        runAppDocGenerate();
        break;
      case "app-reference-file":
        modal("选择参考文件", "调优对话将优先参考所选模板、政策或企业证明材料",
          '<div class="table-wrap"><table class="table"><thead><tr><th>参考文件</th><th>用途</th><th>状态</th></tr></thead><tbody><tr><td>两新申报模板_脱敏示例.docx</td><td>章节结构与行文口径</td><td>' + st("已选择") + '</td></tr><tr><td>设备更新政策摘录.pdf</td><td>政策依据</td><td>' + st("可选择") + '</td></tr><tr><td>设备证据索引表_脱敏示例.xlsx</td><td>设备与金额校验</td><td>' + st("可选择") + '</td></tr></tbody></table></div>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-close="modal">确认选择</button>');
        break;
      case "app-history": {
        const rows = [{ name: "最新草稿记录", time: "2026-08-03 09:18", note: state.docRefined ? "已覆盖最新调优结果" : "实时缓存，未生成新版本" }, { name: "存档 V1", time: "2026-08-02 17:42", note: "材料核验前初稿留存" }].concat(state.appSnapshots);
        modal("历史记录", "查看当前文书的所有存档和最新草稿记录",
          '<div class="table-wrap"><table class="table"><thead><tr><th>记录名称</th><th>时间</th><th>说明</th><th>操作</th></tr></thead><tbody>' + rows.map(r => '<tr><td><b>' + esc(r.name) + '</b></td><td>' + esc(r.time) + '</td><td>' + esc(r.note) + '</td><td><span class="link">查看</span></td></tr>').join("") + '</tbody></table></div>',
          '<button class="btn btn-outline" data-close="modal">关闭</button>');
        break;
      }
      case "app-writer-chat":
        toast("已按底部对话要求生成局部调优建议，并等待人工确认（演示）", "success");
        break;
      case "app-locate":
        state.locatedTarget = el.dataset.target || "当前定位内容";
        modal("定位调优", state.locatedTarget,
          '<div class="qa-block"><div class="qa-block-title">已定位内容</div><div class="qa-text">' + esc(state.locatedTarget) + '</div></div>' +
          '<label class="field" style="margin-top:14px"><span>修改要求</span><textarea class="input" rows="5" placeholder="写下这里要怎么改，例如：补充设备真实性说明、调整金额口径、强化企业特色表述"></textarea></label>' +
          '<div class="agent-steps" style="margin-top:14px"><span class="spin"></span><span class="flow-text">Agent 将仅对当前定位段落生成修改建议，等待人工确认后覆盖当前草稿</span></div>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="app-locate-apply">应用修改</button>');
        break;
      case "app-locate-apply":
        closeModal();
        state.docRefined = true;
        toast("定位内容已按人工确认应用，当前最新草稿已覆盖更新", "success");
        break;
      case "app-tune-apply":
        state.docRefined = true;
        toast("已确认同质化修正建议，并覆盖最新草稿", "success");
        renderView();
        break;
      case "app-snapshot":
        state.appSnapshots.unshift({ name: "手动快照 V" + (state.appSnapshots.length + 2), time: "2026-08-03 09:" + String(20 + state.appSnapshots.length).padStart(2, "0"), note: "人工保存的差异化调优版本" });
        toast("已保存手动快照", "success");
        renderView();
        break;
      case "app-score-fix":
        state.scoreResolved.add(el.dataset.id);
        toast("已人工授权修改该提示，当前草稿已覆盖更新", "success");
        renderView();
        break;
      case "app-score-manual":
        modal("手动修改", "仅修改当前提示项，不开放全文对话式重写",
          '<textarea class="input" rows="6" placeholder="输入人工修改后的表述"></textarea>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="app-score-fix" data-id="' + el.dataset.id + '">保存修改</button>');
        break;
      case "app-score-chat":
        modal("针对提示微调", "Agent 只围绕当前提示生成候选改写",
          '<div class="chat-box compact-chat"><div class="msg agent"><div class="msg-avatar">校</div><div class="msg-body">请描述这条提示希望如何处理，我会生成局部候选文本，等待人工授权。</div></div></div><div class="chat-input"><input class="input" placeholder="例如：弱化精确比例，改为待补充测算依据"><button class="btn btn-primary" data-action="app-score-fix" data-id="' + el.dataset.id + '">' + icon("check") + '授权应用</button></div>',
          '<button class="btn btn-outline" data-close="modal">关闭</button>');
        break;
      case "app-toggle-score":
        state.scoreCollapsed = !state.scoreCollapsed;
        renderView();
        break;
      case "app-export-doc":
        toast("文档已导出（演示）", "success");
        break;
      case "app-archive":
        state.archivedApps.add(currentApplication().id);
        toast("项目已归档，首页进度更新为 100%", "success");
        renderView();
        break;
      case "app-restart":
        state.archivedApps.delete(currentApplication().id);
        state.applicationTab = "writer";
        toast("项目已重启制作，恢复可操作状态", "success");
        renderView();
        break;
      case "todo-go": go("#/qa"); break;
      case "kb-view":
        drawer("文档详情", el.dataset.id,
          '<div class="qa-block"><div class="qa-block-title">文档信息</div><div class="qa-text">已通过权限校验 · 文档级/项目级权限生效 · 可查看原文</div></div>' +
          '<div class="qa-block"><div class="qa-block-title">预览</div><div class="doc-preview"><h3>文档预览</h3><p>系统仅展示授权范围内内容；机密资料默认脱敏显示。</p></div></div>',
          '<button class="btn btn-outline" data-close="drawer">关闭</button>');
        break;
      case "kb-project": state.kbProject = el.dataset.id; state.kbLib = null; state.kbFolder = null; renderView(); break;
      case "kb-open": state.kbLib = el.dataset.id; state.kbFolder = null; renderView(); break;
      case "kb-back": state.kbLib = null; state.kbFolder = null; renderView(); break;
      case "kb-folder": state.kbFolder = (state.kbFolder === el.dataset.name ? null : el.dataset.name); renderView(); break;
      case "kb-new-folder":
        modal("新建文件夹", "在当前知识库分区中创建文件夹",
          '<label class="field"><span>文件夹名称</span><input class="input" id="kb-folder-name" placeholder="例如：2026年度政策"></label>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="kb-folder-save">创建</button>');
        break;
      case "kb-folder-save": {
        const input = $("#kb-folder-name");
        const name = input ? input.value.trim() : "";
        if (!name) { toast("请输入文件夹名称", "warning"); break; }
        const data = GQ.kbLibraryData[state.kbLib];
        if (data && !data.folders.includes(name)) data.folders.push(name);
        closeModal();
        state.kbFolder = name;
        renderView();
        toast("文件夹已创建：" + name, "success");
        break;
      }
      case "kb-doc-view":
        drawer("文档详情", el.dataset.name,
          '<div class="qa-block"><div class="qa-block-title">文档名称</div><div class="qa-text">' + esc(el.dataset.name) + "</div></div>" +
          '<div class="qa-block"><div class="qa-block-title">维护信息</div><div class="qa-text">所属分区：' + esc((GQ.kbLibraries.find(l => l.id === state.kbLib) || {}).name || "") + " · 更新人与更新时间已记录</div></div>" +
          '<div class="qa-block"><div class="qa-block-title">权限</div><div class="qa-text">' + (state.kbLib === "policy" || state.kbLib === "private" ? "加密库，访问需权限校验并留痕" : "项目成员可查看，操作留痕") + "</div></div>",
          '<button class="btn btn-outline" data-close="drawer">关闭</button>');
        break;
      case "kb-download": toast("文档已加入下载任务（演示）", "success"); break;
      case "kb-upload":
        uploadMaterialModal("上传资料", "上传资料的窗口，可补充本地文件夹目录索引地址", "kb-upload-run", "上传并解析");
        break;
      case "kb-upload-run": {
        const mask = $(".modal-mask");
        if (mask) mask.querySelector(".modal").innerHTML = '<div class="agent-steps"><span class="spin"></span><span class="flow-text">上传中… 文件解析 → OCR → 文本切分 → Embedding</span></div>';
        setTimeout(() => { closeModal(); toast("文件已上传并完成向量化", "success"); }, 1600);
        break;
      }
      case "kb-batch": toast("批量导入演示：已选择 12 个文件，开始解析入库", "success"); break;
      case "kb-locked": toast("机密库 不可查看", "warn"); break;
      case "kb-add-private":
        modal("添加私有库", "创建个人私有知识库",
          '<label class="field"><span>库名称</span><input class="input" placeholder="如：我的项目草稿"></label>' +
          '<label class="field" style="margin-top:14px"><span>库描述</span><textarea class="input" rows="3" placeholder="描述这个库的用途和内容范围"></textarea></label>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="kb-add-save">创建</button>');
        break;
      case "kb-add-save": closeModal(); toast("私有库已创建", "success"); break;
      case "qa-suggest": askQA(el.dataset.q); break;
      case "qa-ask": askQA(); break;
      case "qa-new": {
        state.qaConv = null;
        const chat = $("#qa-chat");
        if (chat) chat.innerHTML = '<div class="msg agent"><div class="msg-avatar">智</div><div class="msg-body">已开启新对话，输入问题开始吧。</div></div>';
        toast("已发起新对话", "success");
        break;
      }
      case "qa-conv": {
        state.qaConv = el.dataset.id;
        const c = GQ.qaChats.find(x => x.id === el.dataset.id);
        const chat = $("#qa-chat");
        if (chat) chat.innerHTML = '<div class="msg agent"><div class="msg-avatar">智</div><div class="msg-body">已切换到「' + esc(c.title) + '」，项目空间：' + esc(c.project) + "，可继续提问。</div></div>";
        $$(".qa-conv").forEach(b => b.classList.toggle("active", b.dataset.id === el.dataset.id));
        break;
      }
      case "qa-save": toast("已保存到公文包 / 历史记录", "success"); break;
      case "cite-open": {
        const idx = el.dataset.idx;
        const c = state.qaCites[+idx] || state.qaCites[0];
        if (c) drawer("引用来源", c.file,
          '<div class="qa-block"><div class="qa-block-title">文件</div><div class="qa-text">' + esc(c.file) + "</div></div>" +
          '<div class="qa-block"><div class="qa-block-title">原文位置</div><div class="qa-text">' + esc(c.pos || "官网公开页面") + "</div></div>" +
          '<div class="qa-block"><div class="qa-block-title">原文片段</div><div class="qa-text" style="background:#f0f9ff">“项目固定资产投资不低于 500 万元，其中设备购置投资占比不低于 60%……”</div></div>',
          '<button class="btn btn-outline" data-close="drawer">关闭</button>');
        break;
      }
      case "cite-source": toast("已打开原文阅读器（演示）", "info"); break;
      case "report-run": runReport(); break;
      case "report-history": modal("报告历史", "最近生成的报告草稿",
        GQ.reportTemplates.map((r, i) => '<div class="setting-row"><div><b>' + esc(r.name) + '</b><span>生成于 2026-08-0' + (i + 1) + " · 引用来源已校验</span></div><button class=\"btn btn-outline btn-sm\" data-close=\"modal\">查看</button></div>").join(""),
        '<button class="btn btn-outline" data-close="modal">关闭</button>'); break;
      case "export-word": toast("已生成 Word 文档（演示下载）", "success"); break;
      case "export-pdf": toast("已生成 PDF 文档（演示下载）", "success"); break;
      case "trace-open": traceDetail(el.dataset.id); break;
      case "trace-export": toast("追溯记录已导出（演示）", "success"); break;
      case "industry-edit": industryModal(el.dataset.id); break;
      case "industry-add": industryModal(null); break;
      case "industry-save": closeModal(); toast("产业配置已保存", "success"); break;
      case "industry-toggle": toast(el.dataset.id === "equip" ? "高端装备产业已启动" : "已暂停抓取（演示）", "success"); break;
      case "industry-open": {
        const ind = GQ.industries.find(x => x.id === el.dataset.id);
        state.industryName = ind ? ind.name : "全部";
        state.industryType = "全部";
        go("#/industry-timeline");
        break;
      }
      case "news-fav": {
        const id = +el.dataset.id;
        state.newsFav.has(id) ? state.newsFav.delete(id) : state.newsFav.add(id);
        renderView();
        break;
      }
      case "news-note": modal("资讯备注", "备注仅项目成员可见",
        '<textarea class="input" rows="4" placeholder="记录你的判断或关联企业…"></textarea>',
        '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="qa-save">保存备注</button>'); break;
      case "news-source": drawer("信息来源", "公开来源 · URL 与采集时间留痕",
        '<div class="qa-block"><div class="qa-block-title">来源</div><div class="qa-text">政府官网 / 授权媒体（演示地址）</div></div>' +
        '<div class="qa-block"><div class="qa-block-title">采集信息</div><div class="qa-text">采集时间 2026-08-01 · 来源校验通过 · 已去重</div></div>',
        '<button class="btn btn-outline" data-close="drawer">关闭</button>'); break;
      case "industry-filter": state.industryType = el.value; renderView(); break;
      case "industry-filter2": state.industryName = el.value; renderView(); break;
      case "industry-filter-reset": state.industryType = "全部"; state.industryName = "全部"; renderView(); break;
      case "alert-read": state.alertsDone.add(+el.dataset.id); renderView(); toast("已标记已读", "success"); break;
      case "alert-pool": state.alertsDone.add(+el.dataset.id); renderView(); toast("已转入产业知识库", "success"); break;
      case "alert-link": go("#/companies"); break;
      case "pool-view": drawer("产业知识条目", "人工确认后沉淀",
        '<div class="qa-block"><div class="qa-block-title">内容</div><div class="qa-text">已沉淀的政策要点与技术趋势，可在企业筛选、项目评估中引用。</div></div>' +
        '<div class="qa-block"><div class="qa-block-title">引用记录</div><div class="qa-text">被企业画像引用 4 次 · 评估报告引用 2 次</div></div>',
        '<button class="btn btn-outline" data-close="drawer">关闭</button>'); break;
      case "pool-use": go("#/companies"); break;
      case "company-view": closeModal(); companyDrawer(el.dataset.id); break;
      case "company-eval": {
        const id = el.dataset.id;
        state.evalCompany = id;
        closeDrawer();
        go("#/evaluate");
        setTimeout(() => { const sel = $("#eval-company"); if (sel) { sel.value = id; } runEvaluate(); }, 120);
        break;
      }
      case "company-follow": toast(el.dataset.id + " 已转入跟进池", "success"); break;
      case "company-add-candidate":
        state.candidateIds.add(el.dataset.id);
        renderView();
        toast("已加入候选企业清单", "success");
        break;
      case "company-import": companyImportModal(); break;
      case "company-import-run": runCompanyImport(); break;
      case "company-export": toast("候选企业清单已导出（演示）", "success"); break;
      case "company-filter": toast("已按筛选条件重新计算匹配评分（演示）", "success"); break;
      case "company-reset": renderView(); break;
      case "eval-run": runEvaluate(); break;
      case "eval-tab": {
        const mode = el.dataset.mode;
        const resultView = $("#eval-result-view");
        const reportView = $("#eval-report-view");
        if (!resultView || !reportView) break;
        const isResult = mode === "result";
        resultView.classList.toggle("hidden", !isResult);
        reportView.classList.toggle("hidden", isResult);
        $$('.tab[data-action="eval-tab"]').forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
        break;
      }
      case "eval-history": {
        const rows = state.evalHistory.map(h =>
          "<tr><td><b>" + esc(h.company) + "</b></td><td>" + esc(h.policy) + '</td><td class="num">' + h.score + "</td><td>" + st(h.level) + "</td><td>" + esc(h.time) + "</td>" +
          "<td>" + (h.approved ? st("已立项") + '<div style="font-size:12px;color:#64748b;margin-top:2px">立项人：' + esc(h.approvedBy) + "<br>立项时间：" + esc(h.approvedAt) + "</div>" : st("未立项")) + "</td>" +
          '<td style="white-space:nowrap"><span class="link" data-action="eval-history-view" data-id="' + h.id + '">查看报告</span>' +
          (h.approved ? ' · <span class="link" data-action="eval-history-cancel" data-id="' + h.id + '">取消立项</span>' : "") + "</td></tr>").join("");
        drawer("评估记录", "所有评估过的企业均保留记录，已立项企业展示立项人与立项时间",
          '<div class="table-wrap"><table class="table"><thead><tr><th>企业</th><th>目标政策</th><th>评分</th><th>结论</th><th>评估时间</th><th>立项状态</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div>",
          '<button class="btn btn-outline" data-close="drawer">关闭</button>');
        break;
      }
      case "eval-history-view": {
        const h = state.evalHistory.find(x => x.id === +el.dataset.id);
        if (!h) break;
        closeDrawer();
        state.evalCompany = h.companyId;
        go("#/evaluate");
        setTimeout(() => { const sel = $("#eval-company"); if (sel) sel.value = h.companyId; runEvaluate(); }, 120);
        break;
      }
      case "eval-history-cancel": {
        const h = state.evalHistory.find(x => x.id === +el.dataset.id);
        if (h) { h.approved = false; h.approvedBy = ""; h.approvedAt = ""; toast("已取消立项并写入决策记录", "success"); }
        closeDrawer();
        handleAction("eval-history", el);
        break;
      }
      case "eval-confirm": modal("人工确认立项", "立项决策由人工完成，Agent 仅提供评估建议",
        '<div class="qa-block"><div class="qa-block-title">评估结论</div><div class="qa-text">建议申报，综合评分 92，存在 2 项待补充材料。</div></div>' +
        '<label class="field" style="margin-top:12px"><span>确认意见</span><textarea class="input" rows="3" placeholder="填写立项确认意见…"></textarea></label>',
        '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="eval-confirm-ok">确认立项</button>'); break;
      case "eval-confirm-ok": {
        closeModal();
        const c = GQ.companies.find(x => x.id === state.evalCompany);
        const now = "2026-08-02 15:40";
        const who = (state.user || {}).name || "顾晓岚";
        let rec = state.evalHistory.find(x => x.companyId === state.evalCompany);
        if (rec) { rec.approved = true; rec.approvedBy = who; rec.approvedAt = now; }
        else if (c) { state.evalHistory.unshift({ id: Date.now(), companyId: c.id, company: c.name, policy: GQ.evalReport.policy, score: GQ.evalReport.score, level: GQ.evalReport.level, time: now, approved: true, approvedBy: who, approvedAt: now }); }
        toast("已确认立项并写入决策记录，立项人：" + who, "success");
        break;
      }
      case "eval-interview": toast("已在项目评估结果中生成待核实问题清单（演示）", "success"); break;
      case "eval-export": toast("评估报告已导出（演示）", "success"); break;
      case "interview-run": runInterview(); break;
      case "interview-export": toast("访谈简报已按模板导出（演示）", "success"); break;
      case "interview-memo": modal("回写访谈纪要", "纪要修改留痕，待核实内容不得作为已确认事实",
        '<textarea class="input" rows="6" placeholder="填写访谈纪要…"></textarea>',
        '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="qa-save">保存纪要</button>'); break;
      case "material-upload": modal("上传材料需求文件", "系统将识别材料名称、格式、必填、有效期与特殊说明",
        '<div style="border:1px dashed #c7d7f7;border-radius:8px;padding:28px;text-align:center;color:#64748b;background:#f8fbff">' + icon("upload") + "<div style=\"margin-top:8px\">点击选择《材料需求清单》文件</div></div>",
        '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="material-upload-run">上传并解析</button>'); break;
      case "material-upload-run": {
        const mask = $(".modal-mask");
        if (mask) mask.querySelector(".modal").innerHTML = '<div class="agent-steps"><span class="spin"></span><span class="flow-text">解析材料清单 → 抽取必填与有效期规则</span></div>';
        setTimeout(() => { closeModal(); toast("材料需求解析完成，已更新比对结果", "success"); }, 1500);
        break;
      }
      case "material-scan": {
        const box = $(".table-wrap");
        if (box) box.innerHTML = '<div class="agent-steps" style="margin:16px"><span class="spin"></span><span class="flow-text">扫描本地文件夹 → 识别文件类型 → 抽取元数据</span></div>';
        setTimeout(() => { renderView(); toast("目录扫描与材料比对完成", "success"); }, 1600);
        break;
      }
      case "material-list": materialListModal(); break;
      case "material-export": toast("材料补充清单已导出（演示）", "success"); break;
      case "material-copy": toast("催收文案已复制到剪贴板（演示）", "success"); break;
      case "material-confirm": state.materialConfirmed = true; toast("材料包已标记「可用于文书制作」", "success"); renderView(); break;
      case "material-to-doc": go("#/doc"); break;
      case "material-view": drawer("文件详情", el.dataset.name,
        '<div class="qa-block"><div class="qa-block-title">文件</div><div class="qa-text">' + esc(el.dataset.name) + "</div></div>" +
        '<div class="qa-block"><div class="qa-block-title">权限</div><div class="qa-text">仅项目成员可见 · 证照类文件脱敏预览</div></div>',
        '<button class="btn btn-outline" data-close="drawer">关闭</button>'); break;
      case "doc-settings-toggle": {
        const body = $("#doc-settings");
        if (!body) break;
        body.classList.toggle("hidden");
        const label = $("#doc-settings-label");
        if (label) label.textContent = body.classList.contains("hidden") ? "展开设置" : "收起设置";
        break;
      }
      case "doc-source": {
        const target = el.dataset.target;
        const group = target.replace(/-(kb|local)$/, "");
        $$('.seg-btn[data-target^="' + group + '"]').forEach(b => b.classList.toggle("active", b.dataset.target === target));
        const kb = $("#" + group + "-kb");
        const local = $("#" + group + "-local");
        if (kb) kb.classList.toggle("hidden", target !== group + "-kb");
        if (local) local.classList.toggle("hidden", target !== group + "-local");
        break;
      }
      case "doc-run": runDoc(); break;
      case "doc-chapter": {
        const ch = $("#doc-ch-" + el.dataset.id);
        if (ch) ch.style.display = ch.style.display === "none" ? "block" : "none";
        break;
      }
      case "doc-refine": {
        const input = $("#doc-refine-input") || $("#doc-prompt");
        const v = input ? input.value.trim() : "";
        const ch3 = $("#doc-ch-3");
        if (ch3) ch3.innerHTML = esc(ch3.textContent.trim() + "（已按对话要求调整：突出技术先进性对比与国产替代价值。" + (v ? " 调整要点：" + v : "") + "）");
        const chat = $("#doc-chat");
        if (chat && v) chat.insertAdjacentHTML("beforeend", '<div class="msg user"><div class="msg-avatar">顾</div><div class="msg-body">' + esc(v) + "</div></div>" + '<div class="msg agent"><div class="msg-avatar">写</div><div class="msg-body">已按微调要求更新第三章内容。</div></div>');
        if (input) input.value = "";
        toast("已按微调要求更新第三章内容", "success");
        break;
      }
      case "doc-standard": modal("评分标准", "两新专项申报文书评审评分标准",
        '<div class="qa-text" style="margin-bottom:8px"><b>一、政策契合度（20%）</b><br>申报方向与专项政策支持范围一致，指标明确。</div>' +
        '<div class="qa-text" style="margin-bottom:8px"><b>二、材料完整性（20%）</b><br>必备材料齐备、格式正确、有效期符合要求。</div>' +
        '<div class="qa-text" style="margin-bottom:8px"><b>三、证据支撑度（25%）</b><br>关键结论有合同、发票、检测报告等依据。</div>' +
        '<div class="qa-text" style="margin-bottom:8px"><b>四、行文逻辑（20%）</b><br>章节衔接清晰，口径一致。</div>' +
        '<div class="qa-text"><b>五、格式规范（15%）</b><br>符合模板版式与排版要求。</div>',
        '<button class="btn btn-outline" data-close="modal">关闭</button>'); break;
      case "doc-attach": toast("已添加本地文件作为参考（演示）", "success"); break;
      case "doc-preview-tab": {
        const mode = el.dataset.mode;
        const chapterView = $("#doc-chapter-view");
        const fullView = $("#doc-full-view");
        if (!chapterView || !fullView) break;
        const isChapter = mode === "chapter";
        chapterView.classList.toggle("hidden", !isChapter);
        fullView.classList.toggle("hidden", isChapter);
        $$('.tab[data-action="doc-preview-tab"]').forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
        break;
      }
      case "doc-export": toast("申报文书已导出（演示）", "success"); break;
      case "doc-to-qc": go("#/qc"); break;
      case "doc-version": {
        const list = state.docVersions.length ? state.docVersions.map(v =>
          '<div class="setting-row"><div><b>' + esc(v.label) + '</b><span>' + esc(v.time) + " · " + esc(v.note) + "</span></div>" + st("已留存") + "</div>").join("")
          : '<div class="empty">' + icon("clock") + "<div>尚未保留版本<br>点击「保留版本」后加入版本历史</div></div>";
        modal("版本历史", "未点击「保留版本」的文书不会进入版本历史，可持续调优",
          list,
          '<button class="btn btn-outline" data-close="modal">关闭</button>');
        break;
      }
      case "doc-save-version": {
        const v = state.docVersions.length + 1;
        state.docVersions.push({ label: "v1." + v, time: "2026-08-02 15:30", note: "文书版本已保留，可继续调优" });
        state.appSnapshots.unshift({ name: "存档 V" + (state.appSnapshots.length + 2), time: "2026-08-03 09:" + String(24 + state.appSnapshots.length).padStart(2, "0"), note: "人工存档版本，可在历史记录查看" });
        toast("已存档并加入历史记录", "success");
        break;
      }
      case "doc-review": runReviewerEffect(); break;
      case "review-export": toast("评审单已导出（演示）", "success"); break;
      case "qc-run": {
        const box = $("#qc-checks");
        if (!box) break;
        runFlow(box, ["解析文书章节与指标", "数据一致性比对", "政策条件覆盖校验", "证据引用核验", "行文逻辑与格式校验"], '<div class="qa-text" style="color:#64748b">校验完成，请在问题清单中逐条确认或驳回。</div>');
        state.qcChecked = true;
        setTimeout(() => renderView(), 3400);
        break;
      }
      case "qc-issue": {
        const idx = el.dataset.idx;
        state.qcIssueState[idx] = el.dataset.act;
        toast(el.dataset.act === "confirmed" ? "已确认采纳该修改建议" : "已驳回该修改建议", "success");
        renderView();
        break;
      }
      case "qc-finish": state.qcApproved = true; toast("质检完成，文书状态已更新为「已质检」", "success"); renderView(); break;
      case "qc-to-ppt": go("#/ppt"); break;
      case "qc-authorize": closeDrawer(); toast("已授权修改，生成校订版 v1.2（演示）", "success"); break;
      case "qc-export": toast("校订版已导出并留痕（演示）", "success"); break;
      case "ppt-select": state.pptActive = +el.dataset.id; $("#ppt-preview").innerHTML = pptPreviewHtml(); $$(".slide-card").forEach(c => c.classList.toggle("active", +c.dataset.id === state.pptActive)); break;
      case "ppt-template": toast("已上传企业品牌模板（演示）", "success"); break;
      case "ppt-export": toast("答辩 PPT 已导出 PPTX（演示）", "success"); break;
      case "ppt-refine": {
        const input = $("#ppt-refine-input");
        const v = input ? input.value.trim() : "";
        toast("已按微调要求更新当前页：" + (v || "补充国产替代对比表"), "success");
        input.value = "";
        break;
      }
      case "defense-start": state.defenseCurrent = null; $("#defense-area").innerHTML = '<div class="empty">' + icon("chat") + "<div>选择一道专家问题开始模拟回答</div></div>"; toast("已重置演练", "success"); break;
      case "defense-pick": defensePick(+el.dataset.id); break;
      case "defense-submit": defenseSubmit(); break;
      case "defense-save": toast("复盘记录已保存并脱敏入库", "success"); break;
      case "defense-next": renderView(); break;
      case "account-add": accountModal(); break;
      case "account-edit": accountModal(); break;
      case "account-toggle": {
        const a = state.accounts.find(x => x.account === el.dataset.id);
        if (a) { a.status = a.status === "启用" ? "停用" : "启用"; toast("账号状态已更新：" + a.status, "success"); renderView(); }
        break;
      }
      case "account-save": closeModal(); toast("账号已创建并发送初始密码（演示）", "success"); break;
      case "permission-save": toast("权限配置已保存并即时生效", "success"); break;
      case "perm-add-role": {
        const perms = GQ.roleMatrix.perms.map(p => p.name);
        const checkboxes = perms.map(pn =>
          '<label style="display:flex;gap:8px;align-items:center;font-size:13px;padding:6px 0">' +
          '<input type="checkbox" class="perm-check">' + esc(pn) + '</label>').join("");
        modal("新增角色", "填写角色名称并勾选权限项",
          '<label class="field"><span>角色名称</span><input class="input" id="perm-role-name" placeholder="如：运营专员"></label>' +
          '<div style="margin-top:14px"><b style="font-size:13px">权限项</b></div><div style="margin-top:8px">' + checkboxes + "</div>",
          '<button class="btn btn-outline btn-sm" data-action="perm-add-confirm">' + icon("check") + '确认创建</button><button class="btn btn-outline" data-close="modal">取消</button>');
        break;
      }
      case "perm-add-confirm": {
        const nameInput = document.getElementById("perm-role-name");
        const name = nameInput ? nameInput.value.trim() : "";
        if (!name) { toast("请输入角色名称", "warn"); break; }
        const checks = document.querySelectorAll(".perm-check");
        const vals = Array.from(checks).map(c => c.checked ? 1 : 0);
        state.customRoles.push({ name, perms: vals });
        state.editRoleIdx = -1;
        closeModal();
        toast("角色「" + name + "」已创建", "success");
        renderView();
        break;
      }
      case "perm-edit-role": {
        const roleName = el.dataset.role;
        const isCustom = GQ.roleMatrix.roles.indexOf(roleName) < 0;
        if (!isCustom) { toast("内置角色不可编辑", "warn"); break; }
        const crIdx = state.customRoles.findIndex(r => r.name === roleName);
        if (crIdx < 0) break;
        state.editRoleIdx = crIdx;
        const cr = state.customRoles[crIdx];
        const perms = GQ.roleMatrix.perms;
        const checkboxes = perms.map((p, i) =>
          '<label style="display:flex;gap:8px;align-items:center;font-size:13px;padding:6px 0">' +
          '<input type="checkbox" class="perm-edit-check"' + (cr.perms[i] ? " checked" : "") + '>' + esc(p.name) + '</label>').join("");
        modal("编辑角色 · " + esc(roleName), "修改权限项或删除此角色",
          '<label class="field"><span>角色名称</span><input class="input" id="perm-edit-name" value="' + esc(roleName) + '"></label>' +
          '<div style="margin-top:14px"><b style="font-size:13px">权限项</b></div><div style="margin-top:8px">' + checkboxes + "</div>",
          '<button class="btn btn-outline btn-sm" data-action="perm-edit-confirm">' + icon("check") + '保存修改</button>' +
          '<button class="btn btn-outline btn-sm" style="color:#e8364f;border-color:#e8364f" data-action="perm-delete-role" data-role="' + esc(roleName) + '">' + icon("trash") + '删除角色</button>' +
          '<button class="btn btn-outline" data-close="modal">取消</button>');
        break;
      }
      case "perm-edit-confirm": {
        const idx = state.editRoleIdx;
        if (idx < 0) break;
        const nameInput = document.getElementById("perm-edit-name");
        const newName = nameInput ? nameInput.value.trim() : "";
        if (!newName) { toast("角色名称不能为空", "warn"); break; }
        const checks = document.querySelectorAll(".perm-edit-check");
        const vals = Array.from(checks).map(c => c.checked ? 1 : 0);
        state.customRoles[idx].name = newName;
        state.customRoles[idx].perms = vals;
        state.editRoleIdx = -1;
        closeModal();
        toast("角色「" + newName + "」已更新", "success");
        renderView();
        break;
      }
      case "perm-delete-role": {
        const roleName = el.dataset.role;
        const idx = state.customRoles.findIndex(r => r.name === roleName);
        if (idx < 0) break;
        state.customRoles.splice(idx, 1);
        state.editRoleIdx = -1;
        closeModal();
        toast("角色「" + roleName + "」已删除", "success");
        renderView();
        break;
      }
      case "audit-detail": auditDetail(el.dataset.id); break;
      case "audit-export": toast("审计日志已导出（演示）", "success"); break;
      case "security-toggle": {
        const i = +el.dataset.id;
        state.security[i].value = !state.security[i].value;
        renderView();
        break;
      }
      case "security-save": toast("安全策略已保存", "success"); break;
    }
  }

  /* 视图级点击委托 */
  $("#view").addEventListener("click", e => {
    const el = e.target.closest("[data-action],[data-route]");
    if (!el) return;
    const action = el.dataset.action;
    const route = el.dataset.route;
    if (route) { e.stopPropagation(); go(route); return; }
    e.stopPropagation();
    handleAction(action, el);
  });

  /* 视图内 select 变更 */
  $("#view").addEventListener("change", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "industry-filter") { state.industryType = el.value; renderView(); }
    else if (action === "industry-filter2") { state.industryName = el.value; renderView(); }
    else if (action === "security-select") {
      const i = +el.dataset.id;
      state.security[i].value = el.value;
    }
  });

  /* 视图内表格搜索（回车过滤） */
  $("#view").addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const t = e.target;
    if (t.dataset.action !== "kb-search" && t.dataset.action !== "trace-search") return;
    const q = t.value.trim();
    let shown = 0;
    $$("#view .table tbody tr").forEach(tr => {
      const hit = !q || tr.textContent.includes(q);
      tr.style.display = hit ? "" : "none";
      if (hit) shown += 1;
    });
    toast(q ? "已过滤出 " + shown + " 条结果（演示）" : "已显示全部记录", "info");
  });

  /* 全局事件：侧边栏、弹窗、抽屉 */
  document.addEventListener("click", e => {
    const closer = e.target.closest("[data-close]");
    if (closer) { if (closer.dataset.close === "modal") closeModal(); else closeDrawer(); return; }
    const inView = e.target.closest("#view");
    if (inView) {
      const routeEl = e.target.closest("[data-route]");
      if (routeEl && inView.contains(routeEl)) { go(routeEl.dataset.route); return; }
      const actEl = e.target.closest("[data-action]");
      if (actEl && inView.contains(actEl)) { handleAction(actEl.dataset.action, actEl); return; }
    }
    if (!inView) {
      const routeEl = e.target.closest("[data-route]");
      if (routeEl) {
        go(routeEl.dataset.route);
        const found = findPage(routeEl.dataset.route);
        if (found && found.parent) state.expandedNav.add(found.parent.id);
        closeModal();
        closeDrawer();
        $("#notify-dropdown").classList.add("hidden");
        return;
      }
      const navEl = e.target.closest("[data-nav]");
      if (navEl) {
        const id = navEl.dataset.nav;
        const sub = $("#nav-sub-" + id);
        if (sub) {
          sub.classList.toggle("open");
          sub.classList.contains("open") ? state.expandedNav.add(id) : state.expandedNav.delete(id);
        }
        const ch = navEl.querySelector(".nav-chevron");
        if (ch) ch.classList.toggle("open");
        $("#sidebar").classList.remove("open");
        return;
      }
      const actEl = e.target.closest("[data-action]");
      if (actEl) handleAction(actEl.dataset.action, actEl);
    }
    if (!e.target.closest("#notify-btn") && !e.target.closest("#notify-dropdown")) $("#notify-dropdown").classList.add("hidden");
  });

  $("#notify-btn").addEventListener("click", e => {
    e.stopPropagation();
    const d = $("#notify-dropdown");
    d.classList.toggle("hidden");
  });

  $("#logout-btn").addEventListener("click", () => {
    modal("退出登录", "确认退出当前演示账号？",
      '<div class="qa-text">会话将结束，未保存的演示状态不会影响正式数据。</div>',
      '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="logout-ok">退出</button>');
  });

  document.addEventListener("click", e => {
    if (e.target.closest('[data-action="logout-ok"]')) {
      closeModal();
      $("#app-shell").classList.add("hidden");
      $("#login-view").classList.remove("hidden");
      document.body.classList.add("login-mode");
      const btn = $("#login-btn");
      btn.disabled = false;
      btn.innerHTML = '<span>登录系统</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      state.route = "home";
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    }
  });

  $("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  const searchBtn = $("#search-btn");
  if (searchBtn) searchBtn.addEventListener("click", () => { const inp = $("#global-search"); if (inp) openSearch(inp.value.trim()); });
  const searchInput = $("#global-search");
  if (searchInput) searchInput.addEventListener("keydown", e => { if (e.key === "Enter") openSearch(e.target.value.trim()); });
  const aiOrb = $("#ai-orb");
  if (aiOrb) aiOrb.addEventListener("click", () => {
    location.hash = "#/qa";
    toast("智库助手已就绪，可输入问题或需求", "info");
  });

  window.addEventListener("hashchange", () => {
    if ($("#app-shell").classList.contains("hidden")) return;
    const r = (location.hash || "#/home").replace("#/", "") || "home";
    state.route = r;
    renderView();
  });

  /* 初始化 */
  document.body.classList.add("login-mode");
  renderNotifications();
  bindLogin();
  const params = new URLSearchParams(location.search);
  if (params.get("auto") === "1") doLogin();
})();
