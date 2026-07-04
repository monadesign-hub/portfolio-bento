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
      { name: "San Francisco", lat: 37.77, lon: -122.42, color: "#ffcf5c", home: true },
      { name: "New York", lat: 40.71, lon: -74.0, color: "#ff7a6b" },
      { name: "London", lat: 51.5, lon: -0.12, color: "#6be7a6" },
      { name: "Tokyo", lat: 35.68, lon: 139.69, color: "#b58cff" },
      { name: "Singapore", lat: 1.35, lon: 103.8, color: "#5fc8ff" },
    ];
    const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

    let rot = params.get("grot") ? parseFloat(params.get("grot")) : 1.1;
    // project a unit-sphere point → {px,py,z} with current spin + fixed tilt
    function project(x, y, z, cosR, sinR, R, cx, cy) {
      const xr = x * cosR - z * sinR, zr = x * sinR + z * cosR;
      const Y = y * cosT - zr * sinT, Z = y * sinT + zr * cosT;
      return { px: cx + xr * R, py: cy - Y * R, z: Z };
    }

    function frame() {
      const w = cv.width, h = cv.height, R = Math.min(w, h) * 0.44, cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      if (!reduce) rot += 0.0022;
      const cosR = Math.cos(rot), sinR = Math.sin(rot);
      const dark = document.documentElement.dataset.theme === "dark";
      const base = dark ? "255,255,255" : "24,24,28";

      // atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.06);
      glow.addColorStop(0, "rgba(120,150,255,0)");
      glow.addColorStop(1, dark ? "rgba(120,150,255,0.10)" : "rgba(90,120,220,0.08)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, 7); ctx.fill();

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
      // land dots (front hemisphere, square "pixel" look, depth-faded)
      for (const d of dots) {
        const q = project(d[0], d[1], d[2], cosR, sinR, R, cx, cy);
        if (q.z <= 0.02) continue;
        const a = Math.min(1, 0.34 + q.z * 0.62);
        const s = 1.0 + q.z * 1.5;
        ctx.fillStyle = `rgba(${base},${a})`;
        ctx.fillRect(q.px - s / 2, q.py - s / 2, s, s);
      }
      // rim
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.38)";
      ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();

      // city markers + labels
      ctx.font = "500 14px -apple-system, Inter, sans-serif";
      ctx.textBaseline = "middle";
      for (const c of cities) {
        const [x, y, z] = toXYZ(c.lat, c.lon);
        const q = project(x, y, z, cosR, sinR, R, cx, cy);
        if (q.z <= 0) continue;
        const a = Math.min(1, Math.max(0, (q.z - 0.03) / 0.28));
        if (a <= 0) continue;
        const rr = c.home ? 3.6 : 3;
        ctx.fillStyle = hexA(c.color, a);
        ctx.beginPath(); ctx.arc(q.px, q.py, rr, 0, 7); ctx.fill();
        ctx.strokeStyle = hexA(c.color, a * 0.55); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(q.px, q.py, rr + 3.5, 0, 7); ctx.stroke();
        ctx.fillStyle = hexA(c.color, a);
        ctx.fillText(c.name, q.px + rr + 7, q.py);
      }
      requestAnimationFrame(frame);
    }
    frame();
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
