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
    security: GQ.security.map(s => Object.assign({}, s))
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
    for (const group of GQ.nav) {
      if (group.route === route) return { group, page: group, parent: null };
      if (group.children) {
        const p = group.children.find(c => c.route === route);
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
    let html = "";
    for (const group of GQ.nav) {
      const hasKids = group.children && group.children.length;
      const activeParent = hasKids ? group.children.some(c => c.route === route) : group.route === route;
      const open = (activeParent || state.expandedNav.has(group.id)) ? " open" : "";
      html += '<div class="nav-group">';
      if (hasKids) {
        html += '<button class="nav-item' + (activeParent ? " active" : "") + '" data-nav="' + group.id + '">' + icon(group.icon) + "<span>" + group.title + "</span>" + icon("chevron", "nav-chevron" + open) + "</button>";
        html += '<div class="nav-sub' + open + '" id="nav-sub-' + group.id + '">';
        for (const c of group.children) {
          if (c.hidden) continue;
          html += '<button class="nav-sub-item' + (c.route === route ? " active" : "") + '" data-route="' + c.route + '">' + esc(c.title) + "</button>";
        }
        html += "</div>";
      } else {
        html += '<button class="nav-item' + (group.route === route ? " active" : "") + '" data-route="' + group.route + '">' + icon(group.icon) + "<span>" + group.title + "</span></button>";
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
      case "industry-alert": view.innerHTML = viewIndustryAlert(); break;
      case "industry-pool": view.innerHTML = viewIndustryPool(); break;
      case "companies": view.innerHTML = viewCompanies(); break;
      case "evaluate": view.innerHTML = viewEvaluate(); break;
      case "interview": view.innerHTML = viewInterview(); break;
      case "materials": view.innerHTML = viewMaterials(); break;
      case "doc": view.innerHTML = viewDoc(); break;
      case "review": view.innerHTML = viewReview(); break;
      case "qc": view.innerHTML = viewQC(); break;
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
    const agents = d.agents.map(a =>
      '<div class="agent-card"><div class="agent-ico">' + icon(a.icon) + '</div><div class="agent-meta"><b>' + esc(a.name) + '</b><span>' + esc(a.desc) + '</span><span>今日调用 ' + a.calls + " 次 · 平均 " + a.avg + "</span></div>" + st(a.status) + "</div>").join("");
    return pageHead("工作台", "今日申报任务 18 项，9 条 Agent 建议待人工确认；关键业务链路运行正常。",
      '<button class="btn btn-primary" data-route="#/qa">' + icon("spark") + "开始智能问答</button>") +
      kpiCards(d.kpis) +
      '<div class="section"><div class="card"><div class="card-head"><div><div class="card-title">申报业务闭环</div><div class="card-sub">从线索筛选到答辩演练的完整交付链路</div></div><span class="chip chip-blue">实时数据</span></div>' +
      '<div class="progress-steps">' + pipeline + "</div></div></div>" +
      '<div class="grid-2 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">待人工确认</div><div class="card-sub">Agent 已给出建议，等待你确认后继续</div></div><button class="btn btn-outline btn-sm" data-route="#/audit">全部</button></div>' + todos + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">Agent 运行状态</div><div class="card-sub">今日 07:00 至当前</div></div></div><div class="grid-2" style="gap:12px">' + agents + "</div></div>" +
      "</div>" +
      '<div class="grid-2-1 section">' +
      '<div class="card"><div class="card-head"><div><div class="card-title">知识调用趋势</div><div class="card-sub">近 7 日智能问答与报告生成调用量</div></div></div>' + lineSvg(week, weekLabels) + "</div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">今日要点</div></div></div>' +
      '<div class="qa-block"><div class="qa-block-title">重点变化</div><div class="qa-text">新能源电池回收专项政策发布，建议关联 3 家目标企业。</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">风险提醒</div><div class="qa-text" style="border-color:#fecaca">常州锂航材料缺口 4 项，其中设备发票需尽快催收。</div></div>' +
      '<div class="qa-block"><div class="qa-block-title">待定稿</div><div class="qa-text">《苏州智造设备更新申报书》v1.2 预评审 88 分，待你确认。</div></div>' +
      "</div></div>";
  }

  /* ===== 万智中枢 ===== */
  function viewKB() {
    if (state.kbLib) return viewKBLibrary();
    const projects = GQ.kbProjects.map(p =>
      '<button class="btn ' + (state.kbProject === p.id ? "btn-primary" : "btn-outline") + ' btn-sm" data-action="kb-project" data-id="' + p.id + '">' + esc(p.name) + " · " + p.count + " 个库</button>").join("");
    const libs = GQ.kbLibraries.map(l =>
      '<div class="card hoverable kb-lib" data-action="kb-open" data-id="' + l.id + '">' +
      '<div class="kb-lib-head"><div class="kpi-ico">' + icon(l.icon) + "</div><div>" +
      '<div class="card-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' + esc(l.name) +
      (l.locked ? '<span class="tag tag-blue tag-plain">' + icon("lock") + "加密</span>" : "") + "</div>" +
      '<div class="card-sub">' + esc(l.desc) + "</div></div></div>" +
      '<div class="kb-lib-foot"><span class="chip chip-blue">' + l.count + " 个文档</span><span class=\"link\">进入维护</span></div></div>").join("");
    const current = GQ.kbProjects.find(p => p.id === state.kbProject);
    return pageHead("知识库管理", "知识库按项目分区管理，可点击进入每个分区维护内容；每个分区内支持新建文件夹与文档维护。",
      '<button class="btn btn-outline" data-action="kb-batch">' + icon("folder") + "批量导入</button>") +
      '<div class="card section"><div class="card-head"><div><div class="card-title">项目分区</div><div class="card-sub">当前：' + esc(current.name) + " · " + esc(current.desc) + '</div></div><div class="page-actions">' + projects + "</div></div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">知识库分区</div><div class="card-sub">点击进入分区维护知识库内容，可自行添加文件夹</div></div></div>' +
      '<div class="grid-3">' + libs + "</div></div>";
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
      '<button class="btn btn-primary" data-action="kb-upload">' + icon("upload") + "上传文件</button>") +
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
      '<div class="qa-conv-ico">' + icon("chat") + '</div><div class="qa-conv-meta"><b>' + esc(c.title) + '</b><span>' + esc(c.project) + " · " + esc(c.time) + " · " + c.msgs + " 条</span></div></button>").join("");
    const suggests = GQ.qaSuggestions.map(s => '<button class="suggest-chip" data-action="qa-suggest" data-q="' + esc(s) + '">' + esc(s) + "</button>").join("");
    return pageHead("AI智库", "类智能体对话界面：左侧按项目展示对话记录并可发起新对话，右侧进行知识问答，回答带引用来源并区分本地/外部依据。") +
      '<div class="qa-layout"><div class="card qa-side">' +
      '<div class="card-head"><div><div class="card-title">对话记录</div><div class="card-sub">按项目分区管理</div></div></div>' +
      '<button class="btn btn-primary btn-block" style="margin-bottom:12px" data-action="qa-new">' + icon("plus") + "发起新对话</button>" +
      '<div class="qa-conv-list">' + convs + "</div></div>" +
      '<div class="card qa-main"><div class="card-head">' +
      '<div style="display:flex;align-items:center;gap:12px"><div class="ai-writer-logo">' + icon("spark") + '</div><div><div class="card-title">AI智库 · 智库对话</div><div class="card-sub">权限校验 → 本地检索 → 引用回答 → 建议动作</div></div></div>' +
      '<span class="chip chip-blue">当前项目：技术改造专项</span></div>' +
      '<div class="qa-scope-row"><span class="qa-scope-label">知识范围</span>' +
      ["政策库", "企业资料", "外部资料", "历史沉淀", "私有库"].map(s => '<label style="display:flex;gap:6px;align-items:center;font-size:13px"><input type="checkbox" checked> ' + s + "</label>").join("") + "</div>" +
      '<div class="chat-box" id="qa-chat" style="max-height:440px">' +
      '<div class="msg agent"><div class="msg-avatar">智</div><div class="msg-body">你好，我是 AI智库。已接入政策库、企业资料库、历史案例与内部经验。点击左侧对话记录切换项目对话，或发起新对话后直接提问。</div></div>' +
      "</div>" +
      '<div class="chat-suggests">' + suggests + "</div>" +
      '<div class="chat-input"><textarea class="input" id="qa-input" rows="3" placeholder="输入你的问题，例如：XX市技改专项对设备投资额有什么要求？"></textarea>' +
      '<button class="btn btn-primary" data-action="qa-ask">' + icon("send") + "提问</button></div></div></div>";
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
    const cards = GQ.industries.map(ind =>
      '<div class="card hoverable"><div class="card-head"><div><div class="card-title">' + esc(ind.name) + '</div><div class="card-sub">今日新增 ' + ind.today + " 条 · 上次抓取 " + esc(ind.lastRun) + "</div></div>" + st(ind.status) + "</div>" +
      '<div class="qa-block"><div class="qa-block-title">关键词</div><div>' + ind.keywords.map(k => '<span class="chip chip-blue">' + k + "</span>").join(" ") + "</div></div>" +
      '<div class="qa-block"><div class="qa-block-title">来源</div><div class="qa-text">' + esc(ind.sources) + "</div></div>" +
      '<div class="qa-block" style="margin-bottom:12px"><div class="qa-block-title">抓取频率</div><span class="chip">' + esc(ind.freq) + "</span></div>" +
      '<div class="page-actions"><button class="btn btn-outline btn-sm" data-action="industry-edit" data-id="' + ind.id + '">' + icon("edit") + "编辑</button>" +
      '<button class="btn btn-outline btn-sm" data-action="industry-toggle" data-id="' + ind.id + '">' + icon("refresh") + (ind.status === "运行中" ? "暂停" : "启动") + "</button></div></div>").join("");
    return pageHead("产业配置", "配置重点产业领域、关键词、政策源与新闻源，系统按频率定时抓取并自动分类去重。",
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
    return pageHead("资讯时间线", "按产业链环节展示政策、技术与新闻变化，支持收藏、备注与人工确认。") +
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
    const rows = companyFiltered().map(c =>
      "<tr><td><b>" + esc(c.name) + '</b><div style="font-size:12px;color:#64748b">' + c.id + "</div></td>" +
      "<td>" + esc(c.region) + " / " + esc(c.industry) + "</td><td>" + esc(c.projectType) + "</td>" +
      '<td class="num">' + c.invest.toLocaleString() + "</td><td>" + st(c.status) + "</td>" +
      '<td style="min-width:150px"><div style="display:flex;align-items:center;gap:8px"><b class="num">' + c.score + "</b><div class=\"bar\" style=\"flex:1\"><i style=\"width:" + c.score + "%\"></i></div></div></td>" +
      "<td>" + st(c.risk + "风险") + "</td><td>" + esc(c.brief) + "</td><td>" + esc(c.evidence) + "</td>" +
      '<td style="white-space:nowrap"><span class="link" data-action="company-view" data-id="' + c.id + '">画像</span> · ' +
      '<span class="link" data-action="company-eval" data-id="' + c.id + '">评估</span> · ' +
      '<span class="link" data-action="company-follow" data-id="' + c.id + '">' + (c.follow ? "已跟进" : "转跟进") + "</span></td></tr>").join("");
    const high = GQ.companies.filter(c => c.score >= 85).length;
    return pageHead("企业筛选", "补全企业画像，按区域、行业、投资额与政策方向测算匹配度，输出候选清单。") +
      '<div class="notice-banner">' + icon("database") + '<span>企业项目备案清单：默认选中知识库的《企业项目备案清单》数据全局统一，使用人可修改，修改后其他人可见。</span></div>' +
      '<div class="grid-3 section">' +
      '<div class="kpi"><div class="kpi-ico">' + icon("users") + '</div><div class="kpi-meta"><div class="kpi-label">候选企业</div><div class="kpi-value">' + GQ.companies.length + "</div></div></div>" +
      '<div class="kpi"><div class="kpi-ico">' + icon("target") + '</div><div class="kpi-meta"><div class="kpi-label">高匹配（≥85）</div><div class="kpi-value">' + high + "</div></div></div>" +
      '<div class="kpi"><div class="kpi-ico">' + icon("alert") + '</div><div class="kpi-meta"><div class="kpi-label">存在风险提示</div><div class="kpi-value">6</div></div></div></div>' +
      '<div class="filter-bar">' +
      '<div class="field"><span>区域</span><select class="select"><option>全部</option><option>苏州</option><option>常州</option><option>南京</option><option>杭州</option></select></div>' +
      '<div class="field"><span>行业</span><select class="select"><option>全部</option><option>高端装备</option><option>新能源电池</option><option>化工新材料</option><option>生物医药</option></select></div>' +
      '<div class="field"><span>项目类型</span><select class="select"><option>全部</option><option>技术改造</option><option>新建</option><option>技改扩建</option></select></div>' +
      '<div class="field"><span>最低匹配分</span><select class="select"><option>不限</option><option>≥ 70</option><option>≥ 80</option><option>≥ 90</option></select></div>' +
      '<div class="field"><span>政策方向</span><select class="select"><option>设备更新与技改</option><option>两新专项</option><option>专项资金</option></select></div>' +
      '<button class="btn btn-primary" data-action="company-filter">查询</button><button class="btn btn-outline" data-action="company-reset">重置</button></div>' +
      '<div class="card"><div class="card-head"><div><div class="card-title">企业候选清单</div><div class="card-sub">评分包含区域适配、行业契合、项目类型、投资规模与政策方向五个维度</div></div></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>企业</th><th>区域/行业</th><th>项目类型</th><th>投资额(万元)</th><th>建设状态</th><th>匹配评分</th><th>风险</th><th>画像摘要</th><th>证据来源</th><th>操作</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
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
      '<button class="btn btn-outline" data-action="eval-interview">' + icon("chat") + "发起访谈准备</button>" +
      '<button class="btn btn-outline" data-action="eval-export">' + icon("download") + "导出报告</button></div>";
    const reportHtml =
      '<div class="doc-preview"><h3>' + esc(c.name) + " · 项目评估分析报告</h3>" +
      '<p><b>一、评估结论</b>：' + esc(r.level) + "，综合评分 " + r.score + " 分。<span class=\"cite\">[依据：政策条件逐项匹配结果]</span></p>" +
      '<p><b>二、政策契合分析</b>：项目投资与设备购置占比满足专项门槛，属于政策鼓励方向。<span class="cite">[依据：2026年工业领域设备更新实施方案 P12]</span></p>' +
      '<p><b>三、风险与缺口</b>：审计报告与开工证明待补充，环评批复需核实。<span class="cite">[依据：材料比对 QC-20260801-03]</span></p>' +
      '<p><b>四、建议</b>：补齐材料后建议申报，立项决策由人工确认。</p></div>';
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
    const rows = m.perms.map(p =>
      "<tr><td><b>" + esc(p.name) + "</b></td>" + p.value.map(v => "<td>" + (v ? '<span style="color:#1a73e8;font-weight:700">✓</span>' : '<span style="color:#cbd5e1">—</span>') + "</td>").join("") + "</tr>").join("");
    return pageHead("权限管理", "按角色、部门、项目成员与客户归属控制查看、编辑、下载、导出与删除权限。",
      '<button class="btn btn-primary" data-action="permission-save">' + icon("check") + "保存权限配置</button>") +
      '<div class="grid-2"><div class="card"><div class="card-head"><div><div class="card-title">角色权限矩阵</div><div class="card-sub">RBAC + 项目/客户归属授权</div></div></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>权限项</th>' + m.roles.map(r => "<th>" + esc(r) + "</th>").join("") + "</tr></thead><tbody>" + rows + "</tbody></table></div></div>" +
      '<div class="card"><div class="card-head"><div><div class="card-title">资料分级</div><div class="card-sub">机密数据默认最小可见</div></div></div>' +
      [["公开", "政策、新闻与行业公开资料；全员可见", "tag-green"], ["内部", "历史案例与内部经验；按部门可见", "tag-blue"], ["机密", "企业资料、财务与申报文书；按项目授权，访问审计、导出审批", "tag-red"]].map(x =>
        '<div class="setting-row"><div><b>' + x[0] + '</b><span>' + x[1] + "</span></div>" + st(x[0]) + "</div>").join("") +
      '<div class="qa-block" style="margin-top:12px"><div class="qa-block-title">客户归属规则</div><div class="qa-text">销售/项目角色按客户归属与部门范围访问；跨项目默认不可见；人员调岗或离职时管理员回收权限并保留历史审计。</div></div></div></div>';
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
    $("#login-btn").addEventListener("click", doLogin);
    $$(".role-chip").forEach(chip => chip.addEventListener("click", () => {
      $$(".role-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      $("#login-role").value = chip.dataset.role;
    }));
  }

  function doLogin() {
    const account = $("#login-account").value.trim();
    const pwd = $("#login-password").value;
    const role = $("#login-role").value;
    const u = Object.assign({}, GQ.users[account] || { name: account === "admin" ? "赵敏" : "顾晓岚", dept: "项目部" }, { role });
    if (!pwd) { toast("请输入密码", "warning"); return; }
    const btn = $("#login-btn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spin" style="width:15px;height:15px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;display:inline-block;animation:spin .8s linear infinite"></span> 正在登录…';
    setTimeout(() => {
      state.user = u;
      $("#login-view").classList.add("hidden");
      $("#app-shell").classList.remove("hidden");
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
    }, 900);
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
        modal("上传文件", "支持 PDF / Word / Excel / 图片 OCR，上传后自动解析并打权限标签",
          '<div style="border:1px dashed #c7d7f7;border-radius:8px;padding:32px;text-align:center;color:#64748b;background:#f8fbff">' + icon("upload") +
          '<div style="margin-top:10px"><b style="color:#1a73e8">点击选择文件</b><br><span style="font-size:12px">最多 20 个文件，单个不超过 50MB</span></div></div>' +
          '<div class="form-grid" style="margin-top:14px"><label class="field"><span>资料类型</span><select class="select"><option>政策库</option><option>企业资料</option><option>历史案例</option><option>内部经验</option></select></label>' +
          '<label class="field"><span>权限级别</span><select class="select"><option>公开</option><option>内部</option><option>机密</option></select></label></div>',
          '<button class="btn btn-outline" data-close="modal">取消</button><button class="btn btn-primary" data-action="kb-upload-run">上传并解析</button>');
        break;
      case "kb-upload-run": {
        const mask = $(".modal-mask");
        if (mask) mask.querySelector(".modal").innerHTML = '<div class="agent-steps"><span class="spin"></span><span class="flow-text">上传中… 文件解析 → OCR → 文本切分 → Embedding</span></div>';
        setTimeout(() => { closeModal(); toast("文件已上传并完成向量化", "success"); }, 1600);
        break;
      }
      case "kb-batch": toast("批量导入演示：已选择 12 个文件，开始解析入库", "success"); break;
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
      case "eval-interview": go("#/interview"); break;
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
        toast("版本 v1." + v + " 已保留并加入版本历史", "success");
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
    if (route) { go(route); return; }
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
    if (closer) { if (closer.dataset.close === "modal") closeModal(); else closeDrawer(); }
    const inView = e.target.closest("#view");
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
      const btn = $("#login-btn");
      btn.disabled = false;
      btn.textContent = "登录系统";
      state.route = "home";
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    }
  });

  $("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#search-btn").addEventListener("click", () => openSearch($("#global-search").value.trim()));
  $("#global-search").addEventListener("keydown", e => { if (e.key === "Enter") openSearch(e.target.value.trim()); });

  window.addEventListener("hashchange", () => {
    if ($("#app-shell").classList.contains("hidden")) return;
    const r = (location.hash || "#/home").replace("#/", "") || "home";
    state.route = r;
    renderView();
  });

  /* 初始化 */
  renderNotifications();
  bindLogin();
  const params = new URLSearchParams(location.search);
  if (params.get("auto") === "1") doLogin();
})();
