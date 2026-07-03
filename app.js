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

  /* date + clock text ---------------------------------------- */
  const today = $("#today");
  const introClock = $("#intro-clock");
  const fmtDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  function tickText() {
    const d = new Date();
    if (today) today.textContent = fmtDate.format(d);
    if (introClock) introClock.textContent = d.toLocaleTimeString("en-US", { hour12: false });
  }
  tickText(); setInterval(tickText, 1000);

  /* typewriter ----------------------------------------------- */
  const tw = $("#typewriter");
  const words = ["AI-native products", "fintech systems", "human-centered tools", "design systems"];
  if (tw && !reduce) {
    let wi = 0, ci = 0, deleting = false;
    tw.textContent = "";
    const step = () => {
      const w = words[wi];
      ci += deleting ? -1 : 1;
      tw.textContent = w.slice(0, ci);
      let delay = deleting ? 45 : 85;
      if (!deleting && ci === w.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
      setTimeout(step, delay);
    };
    setTimeout(step, 900);
  }

  /* ---------- dot globe ---------- */
  (function globe() {
    const cv = $("#globe"); if (!cv) return;
    const ctx = cv.getContext("2d");
    const cityEl = $("#globe-city");
    const cities = [
      { name: "San Francisco", lat: 37.77, lon: -122.42 },
      { name: "New York", lat: 40.71, lon: -74.0 },
      { name: "Shanghai", lat: 31.23, lon: 121.47 },
      { name: "London", lat: 51.5, lon: -0.12 },
    ];
    let ci = 0;
    const dots = [];
    // fibonacci sphere
    const N = 620;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = Math.PI * (3 - Math.sqrt(5)) * i;
      dots.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    const toXYZ = (lat, lon) => {
      const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
      return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)];
    };
    let rot = 0;
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ff5c35";
    function frame() {
      const w = cv.width, h = cv.height, R = Math.min(w, h) * 0.42, cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      rot += reduce ? 0 : 0.0025;
      const cosR = Math.cos(rot), sinR = Math.sin(rot);
      const dark = document.documentElement.dataset.theme === "dark";
      const base = dark ? "255,255,255" : "20,20,25";
      for (const [x, y, z] of dots) {
        const xr = x * cosR - z * sinR, zr = x * sinR + z * cosR;
        const depth = (zr + 1) / 2;               // 0 back .. 1 front
        const px = cx + xr * R, py = cy - y * R;
        const a = 0.12 + depth * 0.6;
        ctx.fillStyle = `rgba(${base},${a})`;
        ctx.beginPath(); ctx.arc(px, py, 0.7 + depth * 1.1, 0, 7); ctx.fill();
      }
      // active city marker
      const c = cities[ci];
      let [mx, my, mz] = toXYZ(c.lat, c.lon);
      const mxr = mx * cosR - mz * sinR, mzr = mx * sinR + mz * cosR;
      if (mzr > -0.15) {
        const px = cx + mxr * R, py = cy - my * R;
        const pulse = reduce ? 3 : 3 + Math.sin(rot * 12) * 1.6;
        ctx.fillStyle = accent();
        ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill();
        ctx.strokeStyle = accent(); ctx.globalAlpha = .5; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(px, py, pulse + 3, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
      }
      requestAnimationFrame(frame);
    }
    frame();
    setInterval(() => {
      ci = (ci + 1) % cities.length;
      if (cityEl) { cityEl.style.opacity = 0; setTimeout(() => { cityEl.textContent = cities[ci].name; cityEl.style.opacity = 1; }, 250); }
    }, 3200);
    if (cityEl) cityEl.style.transition = "opacity .3s ease";
  })();

  /* ---------- analog clock ---------- */
  (function clock() {
    const cv = $("#clock"); if (!cv) return;
    const ctx = cv.getContext("2d");
    function draw() {
      const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.42;
      const cs = getComputedStyle(document.documentElement);
      const text = cs.getPropertyValue("--text").trim();
      const muted = cs.getPropertyValue("--faint").trim();
      const accent = cs.getPropertyValue("--accent").trim();
      ctx.clearRect(0, 0, w, h);
      // face
      ctx.strokeStyle = cs.getPropertyValue("--line-hi").trim(); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      // ticks
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        const r1 = R * 0.86, r2 = R * (i % 3 === 0 ? 0.72 : 0.8);
        ctx.strokeStyle = muted; ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1);
        ctx.lineTo(cx + Math.sin(a) * r2, cy - Math.cos(a) * r2);
        ctx.stroke();
      }
      const d = new Date();
      const hh = d.getHours() % 12, mm = d.getMinutes(), ss = d.getSeconds(), ms = d.getMilliseconds();
      const hand = (ang, len, wdt, col) => {
        ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.sin(ang) * len, cy - Math.cos(ang) * len); ctx.stroke();
      };
      hand((hh + mm / 60) * Math.PI / 6, R * 0.48, 3.5, text);
      hand((mm + ss / 60) * Math.PI / 30, R * 0.68, 2.5, text);
      const sa = reduce ? ss * Math.PI / 30 : (ss + ms / 1000) * Math.PI / 30;
      hand(sa, R * 0.74, 1.4, accent);
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 7); ctx.fill();
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ---------- radar / skill graph ---------- */
  (function radar() {
    const svg = $("#radar"); if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    const axes = [
      { label: "AI Design", v: 0.95 },
      { label: "Fintech", v: 0.88 },
      { label: "Systems", v: 0.82 },
      { label: "Research", v: 0.78 },
      { label: "Full-stack", v: 0.85 },
    ];
    const cx = 100, cy = 104, R = 66, n = axes.length;
    const pt = (i, r) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    const mk = (name, attrs) => { const e = document.createElementNS(NS, name); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
    // rings
    for (let ring = 1; ring <= 3; ring++) {
      const pts = axes.map((_, i) => pt(i, R * ring / 3).join(",")).join(" ");
      svg.appendChild(mk("polygon", { points: pts, fill: "none", stroke: "var(--line)", "stroke-width": 1 }));
    }
    // spokes + labels
    axes.forEach((ax, i) => {
      const [x, y] = pt(i, R);
      svg.appendChild(mk("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "var(--line)", "stroke-width": 1 }));
      const [lx, ly] = pt(i, R + 14);
      const t = mk("text", { x: lx, y: ly, fill: "var(--muted)", "font-size": 7.5, "text-anchor": lx < cx - 5 ? "end" : lx > cx + 5 ? "start" : "middle", "dominant-baseline": "middle" });
      t.textContent = ax.label; t.setAttribute("font-family", "Inter, sans-serif");
      svg.appendChild(t);
    });
    // data polygon (animated)
    const full = axes.map((ax, i) => pt(i, R * ax.v).join(",")).join(" ");
    const zero = axes.map((_, i) => pt(i, 0.001).join(",")).join(" ");
    const poly = mk("polygon", { points: reduce ? full : zero, fill: "color-mix(in srgb, var(--accent) 22%, transparent)", stroke: "var(--accent)", "stroke-width": 1.5, "stroke-linejoin": "round" });
    svg.appendChild(poly);
    const verts = axes.map((ax, i) => { const [x, y] = pt(i, R * ax.v); const c = mk("circle", { cx: x, cy: y, r: 2.4, fill: "var(--accent)", opacity: reduce ? 1 : 0 }); svg.appendChild(c); return c; });
    if (!reduce) {
      const io = new IntersectionObserver((es) => {
        es.forEach(e => {
          if (!e.isIntersecting) return;
          poly.setAttribute("points", full);
          poly.style.transition = "all 1s cubic-bezier(.22,.61,.36,1)";
          verts.forEach((c, i) => setTimeout(() => c.style.transition = "opacity .4s ease", 0) || setTimeout(() => c.setAttribute("opacity", 1), 500 + i * 60));
          io.disconnect();
        });
      }, { threshold: .4 });
      io.observe(svg);
    }
  })();

  /* ---------- count-up stats ---------- */
  (function counters() {
    const nums = $$(".stat-num");
    const run = (el) => {
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
    $$(".card, .work-card").forEach(el => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ---------- theme toggle ---------- */
  $("#mode-toggle")?.addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  });

  /* ---------- view switch (dashboard / work) ---------- */
  const views = { dashboard: $("#view-dashboard"), work: $("#view-work") };
  $$(".seg").forEach(seg => seg.addEventListener("click", () => {
    const v = seg.dataset.view;
    $$(".seg").forEach(s => s.classList.toggle("is-active", s === seg));
    for (const key in views) {
      const on = key === v;
      views[key].classList.toggle("is-active", on);
      views[key].hidden = !on;
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }));
  if (params.get("view") === "work") $('.seg[data-view="work"]')?.click();

  /* ---------- work filters ---------- */
  const cards = $$(".work-card");
  $$(".pill").forEach(pill => pill.addEventListener("click", () => {
    const f = pill.dataset.filter;
    $$(".pill").forEach(p => p.classList.toggle("is-active", p === pill));
    cards.forEach(c => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
  }));

})();
