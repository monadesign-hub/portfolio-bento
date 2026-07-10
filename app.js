/* ============================================================
   Mona Wang · Bento Dashboard — interactions
   ============================================================ */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* initial state from URL (?theme=light&view=work) ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get("theme") === "light") document.documentElement.dataset.theme = "light";

  /* stagger card entrance ------------------------------------ */
  $$(".card").forEach((c, i) => c.style.setProperty("--i", i));

  /* ---------- bilingual dictionary (EN / 中文) ---------- */
  const I18N = {
    en: {
      "role": "Product Design Engineer",
      "intro.prefix": "I design &amp; ship ",
      "intro.blurb": "I bring fintech & AI products to life end-to-end — from research and systems to full-stack vibe-coding. I push boundaries, take risks, and infuse narrative into the work.",
      "label.basedIn": "Based in",
      "globe.city": "San Francisco Bay Area",
      "label.contact": "Contact",
      "contact.email": "Email", "contact.copy": "Copy",
      "contact.phone": "Phone",
      "contact.resume": "Résumé", "contact.view": "View ↗",
      "contact.location": "Location", "contact.locVal": "SF Bay Area",
      "label.about": "About me",
      "logo.caption": "Love crafting,<br/>where design thinking meets AI, from problem framing to pixel-perfect product solutions.",
      "label.impact": "Real impact",
      "stat.award": "iF Design Award", "stat.audience": "Global audience",
      "stat.seminars": "Design seminars led", "stat.shipped": "Shipped products",
      "label.skills": "Skill sets",
      "role.ai": "AI Product Design Thinking",
      "role.ds": "Pixel Perfect Design System",
      "role.fs": "Full-Stack Vibe Coding Deployment",
      "label.mode": "Mode",
      "label.now": "Now building",
      "now.title": "Aria — AI Underwriting Agent",
      "now.sub": "Human-AI Collaboration · Complex Data Workflow",
      "label.trusted": "Trusted by",
      "work.title": "Selected work",
      "nav.case": "Case Study Deep-Dives",
      "nav.launched": "Launched Products",
      "nav.vibe": "AI Vibe-Coded Tools",
      "wg.case.sub": "End-to-end product stories — research to shipped craft",
      "wf.aria": "Aria — AI Agent Loan Underwriting",
      "wf.people": "People & Entities — Data & Role Mapping",
      "cta.case": "Case study",
      "comp.title": "Core Product Design Competencies",
      "comp.sub": "Where I go deep — AI, workflows, systems, research",
      "comp.ai": "AI Native Design", "comp.workflow": "Complex Workflow",
      "comp.system": "Design System", "comp.research": "Mixed Method Research",
      "wg.launched.sub": "Shipped, in-production, powering real teams",
      "wf.supernova": "Supernova — Aperture Lending Platform",
      "cta.visit": "Visit site",
      "wf.harvard": "Harvard University — Immersive Museum",
      "wf.kaihua": "Kaihua Monastery — Immersive Digital Temple",
      "wf.fintech": "Fintech Learning — Investor Comparison Tool",
      "wg.vibe.sub": "Self-built AI web tools, shipped fast",
      "wf.fieldnotes": "Field Notes — AI Events Journal",
      "cta.use": "Use the tool",
      "wf.notebook": "Visual Notebook — Design Inspiration",
      "wf.jobs": "SF Design Jobs — Live Job Board",
      "wf.w3craft": "W3Craft — Fintech & Web3 Design Reference",
      "dock.dashboard": "About Me", "dock.work": "Work",
      "launch.poster": "Harvard CAMLab — Event Poster Series",
      "launch.moma": "MoMA Art Guide — Interactive Art History",
      "launch.mhouse": "MHouse Chicago — Beverage E-Commerce",
      "launch.health": "Mental Health — Therapy Booking App",
      "tw": ["AI-native products", "fintech systems", "human-centered tools", "design systems"],
    },
    zh: {
      "role": "产品设计工程师",
      "intro.prefix": "我设计并交付 ",
      "intro.blurb": "我端到端地打造金融科技与 AI 产品——从用户研究、系统设计到全栈氛围编码。我勇于突破、敢于冒险，并为作品注入叙事。",
      "label.basedIn": "所在地",
      "globe.city": "旧金山湾区",
      "label.contact": "联系方式",
      "contact.email": "邮箱", "contact.copy": "复制",
      "contact.phone": "电话",
      "contact.resume": "简历", "contact.view": "查看 ↗",
      "contact.location": "位置", "contact.locVal": "旧金山湾区",
      "label.about": "关于我",
      "logo.caption": "热爱匠心打磨，<br/>让设计思维与 AI 相遇，从问题定义到像素级完美的产品方案。",
      "label.impact": "真实影响力",
      "stat.award": "iF 设计奖", "stat.audience": "全球用户",
      "stat.seminars": "主讲设计讲座", "stat.shipped": "上线产品",
      "label.skills": "技能领域",
      "role.ai": "AI 产品设计思维",
      "role.ds": "像素级设计系统",
      "role.fs": "全栈氛围编码部署",
      "label.mode": "模式",
      "label.now": "正在打造",
      "now.title": "Aria — AI Agent 银行信贷系统",
      "now.sub": "人机协作 · 复杂数据工作流",
      "label.trusted": "合作信任",
      "work.title": "精选作品",
      "nav.case": "案例深度剖析",
      "nav.launched": "已上线产品",
      "nav.vibe": "AI Vibe-Coded Tools",
      "wg.case.sub": "端到端的产品故事——从研究到上线打磨",
      "wf.aria": "Aria — AI 智能体贷款承保",
      "wf.people": "人物与实体 — 数据与角色映射",
      "cta.case": "案例研究",
      "comp.title": "核心产品设计能力",
      "comp.sub": "我深耕的领域——AI、工作流、系统、研究",
      "comp.ai": "AI 原生设计", "comp.workflow": "复杂工作流",
      "comp.system": "设计系统", "comp.research": "混合方法研究",
      "wg.launched.sub": "已上线投产，服务真实团队",
      "wf.supernova": "Supernova — Aperture 借贷平台",
      "cta.visit": "访问网站",
      "wf.harvard": "哈佛大学 — 沉浸式博物馆",
      "wf.kaihua": "开化寺 — 沉浸式数字庙宇",
      "wf.fintech": "金融科技学习 — 投资者对比工具",
      "wg.vibe.sub": "自主打造的 AI 网页工具，快速上线",
      "wf.fieldnotes": "Field Notes — AI 活动手记",
      "cta.use": "使用工具",
      "wf.notebook": "Visual Notebook — 设计灵感库",
      "wf.jobs": "SF Design Jobs — 实时招聘看板",
      "wf.w3craft": "W3Craft — 金融科技与 Web3 设计参考",
      "dock.dashboard": "个人简介", "dock.work": "作品",
      "launch.poster": "哈佛 CAMLab — 活动海报系列",
      "launch.moma": "MoMA 艺术导览 — 互动艺术史",
      "launch.mhouse": "MHouse 芝加哥 — 酒饮电商",
      "launch.health": "心理健康 — 心理咨询预约应用",
      "tw": ["AI 原生产品", "金融科技系统", "以人为本的工具", "设计系统"],
    },
  };
  let LANG = params.get("lang") || localStorage.getItem("lang") || "en";
  if (LANG !== "zh") LANG = "en";

  /* date + clock text ---------------------------------------- */
  const today = $("#today");
  const introClock = $("#intro-clock");
  let fmtDate = new Intl.DateTimeFormat(LANG === "zh" ? "zh-CN" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  function tickText() {
    const d = new Date();
    if (today) today.textContent = fmtDate.format(d);
    if (introClock) introClock.textContent = d.toLocaleTimeString("en-US", { hour12: false });
  }
  tickText(); setInterval(tickText, 1000);

  /* typewriter (lang-aware) ---------------------------------- */
  const tw = $("#typewriter");
  let twWords = I18N[LANG].tw;
  let wi = 0, ci = 0, deleting = false;
  if (tw && !reduce) {
    tw.textContent = "";
    const step = () => {
      const w = twWords[wi % twWords.length];
      ci += deleting ? -1 : 1;
      if (ci < 0) ci = 0;
      tw.textContent = w.slice(0, ci);
      let delay = deleting ? 45 : 85;
      if (!deleting && ci >= w.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % twWords.length; delay = 320; }
      setTimeout(step, delay);
    };
    setTimeout(step, 900);
  } else if (tw) {
    tw.textContent = twWords[0];
  }

  /* ---------- apply language ---------- */
  function applyLang(lang) {
    LANG = lang === "zh" ? "zh" : "en";
    localStorage.setItem("lang", LANG);
    document.documentElement.lang = LANG;
    const dict = I18N[LANG];
    $$("[data-i18n]").forEach(el => {
      const v = dict[el.getAttribute("data-i18n")];
      if (v == null) return;
      if (v.indexOf("<") !== -1 || v.indexOf("&") !== -1) el.innerHTML = v;
      else el.textContent = v;
    });
    fmtDate = new Intl.DateTimeFormat(LANG === "zh" ? "zh-CN" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    tickText();
    twWords = dict.tw;
    wi = 0; ci = 0; deleting = false;
    if (tw && reduce) tw.textContent = twWords[0];
    $$(".lang-toggle").forEach(lt => lt.dataset.lang = LANG);
  }

  /* ---------- dotted land globe (equirectangular land mask) ---------- */
  (function globe() {
    const cv = $("#globe"); if (!cv) return;
    const ctx = cv.getContext("2d");
    const LM = window.GLOBE_LANDMASK;
    const TILT = 0.36;                       // axis tilt toward viewer
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    // decode bitpacked land mask
    let isLand = () => false;
    if (LM && LM.bits) {
      const bin = atob(LM.bits);
      isLand = (ix, iy) => {
        const idx = iy * LM.w + ix;
        return (bin.charCodeAt(idx >> 3) >> (7 - (idx & 7))) & 1;
      };
    }
    // build land dots on a lat/lon grid
    const dots = [];
    const stepLat = 2.1, stepLon = 2.1;
    for (let lat = -84; lat <= 84; lat += stepLat) {
      for (let lon = -180; lon < 180; lon += stepLon) {
        const u = ((lon + 180) / 360 * LM.w) | 0;
        const v = ((90 - lat) / 180 * LM.h) | 0;
        if (v < 0 || v >= LM.h || !isLand(Math.min(u, LM.w - 1), v)) continue;
        const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
        dots.push([Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]);
      }
    }
    // graticule sample points (parallels + meridians)
    const grid = [];
    const toXYZ = (lat, lon) => { const a = lat * Math.PI / 180, o = lon * Math.PI / 180; return [Math.cos(a) * Math.cos(o), Math.sin(a), Math.cos(a) * Math.sin(o)]; };
    for (let lat = -60; lat <= 60; lat += 30) { const line = []; for (let lon = -180; lon <= 180; lon += 5) line.push(toXYZ(lat, lon)); grid.push(line); }
    for (let lon = -180; lon < 180; lon += 30) { const line = []; for (let lat = -84; lat <= 84; lat += 5) line.push(toXYZ(lat, lon)); grid.push(line); }

    const cities = [
      { name: "San Francisco", lat: 37.77, lon: -122.42, color: "#75A8FF", home: true },
      { name: "New York", lat: 40.71, lon: -74.0, color: "#e6e7ee", dy: 0 },
      { name: "Boston", lat: 42.36, lon: -71.06, color: "#e6e7ee", dy: -11 },
      { name: "Chicago", lat: 41.88, lon: -87.63, color: "#e6e7ee", dy: 12 },
      { name: "Milan", lat: 45.46, lon: 9.19, color: "#e6e7ee", dy: 0 },
      { name: "Beijing", lat: 39.90, lon: 116.40, color: "#e6e7ee", dy: 0 },
    ];
    const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
    // brand gradient for the landmass dots (blue → cyan → purple)
    const GC1 = [117, 168, 255], GC2 = [95, 200, 255], GC3 = [158, 140, 255];
    const gmix = (t) => {
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const a = t < 0.5 ? GC1 : GC2, b = t < 0.5 ? GC2 : GC3, u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    };

    let rot = params.get("grot") ? parseFloat(params.get("grot")) : 3.1;
    // project a unit-sphere point → {px,py,z} with current spin + fixed tilt
    function project(x, y, z, cosR, sinR, R, cx, cy) {
      const xr = x * cosR - z * sinR, zr = x * sinR + z * cosR;
      const Y = y * cosT - zr * sinT, Z = y * sinT + zr * cosT;
      return { px: cx + xr * R, py: cy - Y * R, z: Z };
    }

    function frame() {
      const w = cv.width, h = cv.height, R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      if (!reduce) rot += 0.0022;
      const cosR = Math.cos(rot), sinR = Math.sin(rot);
      const dark = document.documentElement.dataset.theme === "dark";
      const base = dark ? "255,255,255" : "24,24,28";

      // outer glow halo — radiates OUTSIDE the sphere, fading to the card
      const outerR = Math.min(w, h) * 0.5;
      const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, outerR);
      halo.addColorStop(0, "rgba(117,168,255,0)");
      halo.addColorStop(0.32, dark ? "rgba(117,168,255,0.26)" : "rgba(117,168,255,0.16)");
      halo.addColorStop(0.66, dark ? "rgba(158,140,255,0.15)" : "rgba(158,140,255,0.10)");
      halo.addColorStop(1, "rgba(158,140,255,0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, 7); ctx.fill();

      // graticule (front hemisphere only)
      ctx.lineWidth = 1;
      for (const line of grid) {
        let prev = null;
        for (const p of line) {
          const q = project(p[0], p[1], p[2], cosR, sinR, R, cx, cy);
          if (prev && prev.z > 0 && q.z > 0) {
            ctx.strokeStyle = `rgba(${base},${0.05 + Math.min(prev.z, q.z) * 0.06})`;
            ctx.beginPath(); ctx.moveTo(prev.px, prev.py); ctx.lineTo(q.px, q.py); ctx.stroke();
          }
          prev = q;
        }
      }
      // land dots — brand-gradient glow, front hemisphere, depth-faded
      for (const d of dots) {
        const q = project(d[0], d[1], d[2], cosR, sinR, R, cx, cy);
        if (q.z <= 0.02) continue;
        const a = Math.min(1, 0.34 + q.z * 0.62);
        const s = 1.0 + q.z * 1.5;
        let [cr, cg, cb] = gmix((q.py - (cy - R)) / (2 * R));   // vertical blue→cyan→purple
        if (!dark) { cr *= 0.6; cg *= 0.6; cb *= 0.64; }         // deepen for light bg
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a})`;
        ctx.fillRect(q.px - s / 2, q.py - s / 2, s, s);
      }
      // colorful atmosphere over the sphere (dark only)
      if (dark) {
        const cg2 = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.15, cx, cy, R * 1.02);
        cg2.addColorStop(0, "rgba(95,200,255,0.09)");
        cg2.addColorStop(0.55, "rgba(117,168,255,0.06)");
        cg2.addColorStop(1, "rgba(158,140,255,0.12)");
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = cg2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
        ctx.restore();
      }
      // rim
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.38)";
      ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();

      // city markers + labels (SF = branding-blue highlight)
      ctx.textBaseline = "middle";
      for (const c of cities) {
        const [x, y, z] = toXYZ(c.lat, c.lon);
        const q = project(x, y, z, cosR, sinR, R, cx, cy);
        if (q.z <= 0) continue;
        const a = Math.min(1, Math.max(0, (q.z - 0.03) / 0.28));
        if (a <= 0) continue;
        if (c.home) {
          ctx.save(); ctx.shadowColor = c.color; ctx.shadowBlur = 14;
          ctx.fillStyle = hexA(c.color, a);
          ctx.beginPath(); ctx.arc(q.px, q.py, 4.2, 0, 7); ctx.fill();
          ctx.restore();
          const pulse = reduce ? 8 : 8 + Math.sin(rot * 9) * 2.6;
          ctx.strokeStyle = hexA(c.color, a * 0.5); ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(q.px, q.py, pulse, 0, 7); ctx.stroke();
          ctx.font = "600 14px -apple-system, Inter, sans-serif";
          ctx.fillStyle = hexA(c.color, a);
          ctx.fillText(c.name, q.px + 11, q.py);
        } else {
          ctx.fillStyle = hexA(c.color, a * 0.9);
          ctx.beginPath(); ctx.arc(q.px, q.py, 2.4, 0, 7); ctx.fill();
          ctx.font = "500 12px -apple-system, Inter, sans-serif";
          ctx.fillStyle = hexA(c.color, a * 0.82);
          ctx.fillText(c.name, q.px + 6, q.py + (c.dy || 0));
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- count-up stats ---------- */
  (function counters() {
    const nums = $$(".stat-num");
    const run = (el) => {
      if (el.dataset.count == null) return;              // static value (e.g. a year) — leave as-is
      const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 1200, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------- liquid-glass cursor sheen ---------- */
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    $$(".card, .work-feature").forEach(el => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ---------- theme toggle ---------- */
  const toggleTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  };
  $("#mode-toggle")?.addEventListener("click", toggleTheme);
  $$(".js-mode-toggle").forEach(b => b.addEventListener("click", toggleTheme));

  /* ---------- work section nav (smooth scroll) ---------- */
  $$(".work-nav a").forEach(link => link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    const target = id && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }));

  /* ---------- deep-link: ?view=work jumps to the work section ---------- */
  if (params.get("view") === "work") {
    requestAnimationFrame(() => $("#view-work")?.scrollIntoView({ behavior: "auto", block: "start" }));
  }

  /* ---------- language toggle (floating + inline, kept in sync) ---------- */
  $$(".lang-toggle").forEach(lt => lt.addEventListener("click", () => applyLang(LANG === "en" ? "zh" : "en")));
  $$(".lang-seg").forEach(s => s.addEventListener("click", (e) => {
    e.stopPropagation();
    applyLang(s.dataset.lang);
  }));
  applyLang(LANG);

  /* ---------- work filters ---------- */
  const cards = $$(".work-card, .work-feature");
  $$(".pill").forEach(pill => pill.addEventListener("click", () => {
    const f = pill.dataset.filter;
    $$(".pill").forEach(p => p.classList.toggle("is-active", p === pill));
    cards.forEach(c => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
  }));

})();
