/* ============================================================================
   Site code — renders content.js into the page, runs the theme toggle and the
   animated background. You normally do NOT need to edit this file; all your
   content lives in content.js.
   ============================================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- helpers */
  const $ = (sel) => document.querySelector(sel);
  function fillText(sel, value) { const el = $(sel); if (el) el.textContent = value || ""; }
  function fillHTML(sel, value) { const el = $(sel); if (el) el.innerHTML = value || ""; }

  // Wrap every occurrence of a "links" phrase in an <a>, walking text nodes so
  // we never touch existing links or HTML attributes. Longer phrases win.
  function autoLink(root, map) {
    if (!root || !map || !document.createTreeWalker) return;
    const phrases = Object.keys(map).filter(Boolean).sort((a, b) => b.length - a.length);
    if (!phrases.length) return;
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // (^|non-word) before the phrase, non-word after — keeps whole-word matches
    // without lookbehind (for older-browser support).
    const re = new RegExp("(^|[^A-Za-z0-9_])(" + phrases.map(esc).join("|") + ")(?![A-Za-z0-9_])", "g");

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (let p = node.parentNode; p && p !== root; p = p.parentNode) {
          if (p.tagName === "A") return NodeFilter.FILTER_REJECT; // already linked
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);

    for (const node of nodes) {
      const text = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) continue;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = re.exec(text))) {
        const phrase = m[2];
        const start = m.index + m[1].length; // skip the boundary char
        if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        const a = document.createElement("a");
        a.href = map[phrase];
        a.textContent = phrase;
        frag.appendChild(a);
        last = start + phrase.length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  /* ----------------------------------------------------- render content.js */
  function renderContent() {
    const S = window.SITE || {};
    const initials = (S.name || "")
      .trim().split(/\s+/).map((w) => w[0] || "").slice(0, 2).join("").toUpperCase();

    // Header / hero / footer text
    fillText("#brand-mark", initials);
    fillText("#brand-name", S.name);
    fillText("#hero-name", S.name);
    fillText("#hero-role", S.role);
    fillHTML("#hero-tagline", S.tagline);
    fillText("#footer-name", S.name);
    if (S.name) document.title = S.name;

    // Avatar: profile photo if given, otherwise initials
    const avatar = $("#avatar");
    if (avatar) {
      if (S.photo) {
        avatar.textContent = "";
        avatar.classList.add("avatar--photo");
        avatar.style.backgroundImage = `url("${S.photo}")`;
      } else {
        avatar.textContent = initials;
      }
    }

    // Affiliation line (URL falls back to the central "links" shortcuts)
    const aff = (S.affiliation || [])
      .map((a) => {
        const url = a.url || (S.links && S.links[a.text]);
        return url ? `<a href="${url}">${a.text}</a>` : a.text;
      })
      .join(" · ");
    fillHTML("#hero-affil", aff);

    // Contact / social links (shown in the hero, under the name)
    fillHTML("#hero-links", (S.contactLinks || [])
      .map((l) => `<li><a href="${l.url}">${l.label}</a></li>`).join(""));

    // About
    fillHTML("#about-text", (S.about || []).map((p) => `<p>${p}</p>`).join(""));
    fillHTML("#interests", (S.interests || []).map((i) => `<li>${i}</li>`).join(""));

    // News
    fillHTML("#news-list", (S.news || []).map((n) =>
      `<li class="news__item"><span class="news__date">${n.date || ""}</span>` +
      `<span class="news__body">${n.text || ""}</span></li>`
    ).join(""));

    // Publications
    fillHTML("#pubs", (S.publications || []).map((p) => {
      const links = (p.links || [])
        .map((l) => `<a href="${l.url}">${l.label}</a>`).join("");
      return `<li class="pub card"><div class="pub__year">${p.year || ""}</div>` +
        `<div class="pub__body">` +
        `<h3 class="pub__title">${p.title || ""}</h3>` +
        `<p class="pub__authors">${p.authors || ""}</p>` +
        (p.venue ? `<p class="pub__venue">${p.venue}</p>` : "") +
        (links ? `<p class="pub__links">${links}</p>` : "") +
        `</div></li>`;
    }).join(""));

    const note = $("#pubs-note");
    if (note) { if (S.pubsNote) note.innerHTML = S.pubsNote; else note.style.display = "none"; }

    // Service (hide the whole section if there are no entries)
    const service = S.service || [];
    fillHTML("#service-list", service.map((s) => `<li>${s}</li>`).join(""));
    const serviceSection = $("#service");
    if (serviceSection && !service.length) serviceSection.style.display = "none";

    // Turn the central link shortcuts into real links wherever they appear.
    autoLink($("main"), S.links || {});
  }

  /* ----------------------------------------------------------- theme toggle */
  function setupTheme() {
    const toggle = $("#theme-toggle");
    if (!toggle) return;
    const icon = toggle.querySelector(".theme-toggle__icon");
    const sync = () => {
      if (icon) icon.textContent =
        document.documentElement.dataset.theme === "dark" ? "☀️" : "🌙";
    };
    sync();
    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      sync();
    });
  }

  /* ------------------------------------------------------ figure axis (both) */
  // The content sits inside a figure: a vertical axis line in each margin with a
  // column of marginal posteriors that GROW OUT of it into the gutter and pinch
  // back to it. The look is chosen by `opt.layout` below — "big" (few·large) is
  // the keeper; "even" / "organic" are other static variants and "gp" is an
  // animated Gaussian process (a ±σ band swelling out of the axis), all kept so
  // we can revisit. Anchored to the content so it scrolls; both gutters drawn;
  // hides on narrow margins.
  function setupFigureAxis() {
    const canvas = $("#bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Chosen look: "big" (few · large). The others are kept so we can revisit —
    // change this to "even", "organic", or "gp" (the animated Gaussian process).
    const opt = { layout: "big" };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Navy in light mode, soft blue in dark mode — matches the site accent.
    const rgb = () =>
      document.documentElement.dataset.theme === "dark" ? "143,179,217" : "31,78,121";
    // axis lines = the figure frame; opaque, matching var(--border) (header/footer)
    const frame = () =>
      document.documentElement.dataset.theme === "dark" ? "41,48,58" : "228,230,234";

    const hash = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
    // smooth value noise → organic, non-repetitive GP samples
    const noiseR = [];
    for (let i = 0; i < 512; i++) noiseR.push(Math.random() * 2 - 1);
    const noise = (x) => {
      const xi = Math.floor(x), f = x - xi, s = f * f * (3 - 2 * f);
      const a = noiseR[((xi % 512) + 512) % 512], b = noiseR[(((xi + 1) % 512) + 512) % 512];
      return a + (b - a) * s;
    };
    const fbm = (x) => (noise(x) + 0.5 * noise(x * 2.3 + 17)) / 1.5;

    // posterior shapes for the static layouts; finish() zeroes the tails so every
    // bump pinches back to the axis at its ends. width = spread, amp = reach.
    const finish = (o) => { o.edge = Math.max(o.f(-1), o.f(1)); o.norm = (o.peak - o.edge) || 1; return o; };
    const uni = (width, amp) => finish({ amp, peak: 1, f: (v) => Math.exp(-0.5 * (v / width) ** 2) });
    const bi = (width, sep, wt, amp) => {
      const f = (v) => Math.exp(-0.5 * ((v - sep) / width) ** 2) + wt * Math.exp(-0.5 * ((v + sep) / width) ** 2);
      let peak = 1e-6;
      for (let v = -1; v <= 1; v += 0.02) peak = Math.max(peak, f(v));
      return finish({ amp, peak, f });
    };
    const POOL = [uni(0.30, 0.62), uni(0.20, 1.00), bi(0.28, 0.42, 0.85, 0.85),
    uni(0.42, 0.50), uni(0.34, 0.72), bi(0.30, 0.45, 0.80, 0.78)];
    const LAYOUT_CFG = {
      even: { slot: 150, over: 0.92 },
      organic: { slot: 150, over: 0.92, organic: true },
      big: { slot: 240, over: 1.15 },
    };

    let w, h, dpr, t = 0, raf = 0, scrollPending = false;

    // a marginal posterior, growing out of the axis at baseX and pinching back to
    // it at yc ± halfH
    function drawDist(baseX, sign, depth, c, yc, halfH, shape) {
      const STEP = 3, eff = depth * shape.amp, yLo = yc - halfH, yHi = yc + halfH;
      const nd = (v) => Math.max(0, shape.f(v) - shape.edge) / shape.norm;
      const pts = [];
      for (let y = yLo; y <= yHi + 0.0001; y += STEP) pts.push([baseX + sign * eff * nd((y - yc) / halfH), y]);
      ctx.beginPath(); ctx.moveTo(baseX, pts[0][1]);
      for (const [x, y] of pts) ctx.lineTo(x, y);
      ctx.lineTo(baseX, pts[pts.length - 1][1]); ctx.closePath();
      ctx.fillStyle = "rgba(" + c + ",0.09)"; ctx.fill();
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = "rgba(" + c + ",0.55)"; ctx.lineWidth = 1; ctx.stroke();
    }

    // even / organic / few·large: a column of bumps over the content band
    function placements(scrollY, docTop, docBottom) {
      const cfg = LAYOUT_CFG[opt.layout] || LAYOUT_CFG.even, sp = cfg.slot, out = [];
      const band = Math.max(1, docBottom - docTop), n = Math.max(1, Math.round(band / sp)), s = band / n;
      for (let i = 0; i < n; i++) {
        let yc = docTop + s * (i + 0.5), halfH = s * cfg.over;
        if (cfg.organic) { yc += (hash(i) - 0.5) * s * 0.7; halfH = s * (0.7 + hash(i + 9) * 0.6); }
        const sy = yc - scrollY;
        if (sy < -s || sy > h + s) continue;
        out.push({ yc: sy, halfH, si: i % POOL.length });
      }
      return out;
    }

    // gp: an actual GP posterior growing out of the axis (which is the mean, 0).
    // The ±σ band is the real posterior std from an RBF kernel — smooth, with
    // rounded waists at the (fixed, non-uniformly spaced) observations thanks to a
    // little observation noise. The animation is the posterior samples re-drawing.
    function drawGP(baseX, sign, depth, c, scrollY, docTop, navH, botY, seed) {
      const spacing = 220, ell = 75, nz = 0.03, STEP = 5, sigma0 = depth * 0.45;
      // observations laid out with cumulative random gaps (uneven but never collide), fixed (scroll only)
      const obs = [];
      const gapOf = (j) => spacing * (0.4 + 1.2 * hash(j * 1.7 + seed + 3.1));  // gap before obs j ∈ [0.4,1.6]·spacing
      const iLo = Math.floor((scrollY + navH - docTop) / spacing) - 3;
      const iHi = Math.ceil((scrollY + botY - docTop) / spacing) + 3;
      let py = docTop + spacing * 0.5 - scrollY;             // position of obs iLo (cumulative from obs 0)
      if (iLo >= 0) for (let j = 1; j <= iLo; j++) py += gapOf(j);
      else for (let j = iLo + 1; j <= 0; j++) py -= gapOf(j);
      for (let i = iLo; i <= iHi; i++) { obs.push(py); py += gapOf(i + 1); }
      const N = obs.length;
      if (!N) return;
      const k = (a, b) => Math.exp(-((a - b) * (a - b)) / (2 * ell * ell));

      // Cholesky of the kernel matrix K (Kᵢⱼ = k(oᵢ,oⱼ) + noise·δ): K = L·Lᵀ
      const L = [];
      for (let i = 0; i < N; i++) {
        L.push(new Array(N).fill(0));
        for (let j = 0; j <= i; j++) {
          let sum = k(obs[i], obs[j]) + (i === j ? nz : 0);
          for (let m = 0; m < j; m++) sum -= L[i][m] * L[j][m];
          L[i][j] = i === j ? Math.sqrt(Math.max(1e-9, sum)) : sum / L[j][j];
        }
      }
      // posterior std (mean = 0 = the axis): σ(y) = sigma0·√(1 − |L⁻¹k*|²)
      const wv = new Array(N);
      const ys = [], sg = [];
      for (let y = navH; y <= botY + 0.5; y += STEP) {
        let dot = 0;
        for (let i = 0; i < N; i++) {
          let s = k(y, obs[i]);
          for (let m = 0; m < i; m++) s -= L[i][m] * wv[m];
          wv[i] = s / L[i][i];
          dot += wv[i] * wv[i];
        }
        ys.push(y); sg.push(sigma0 * Math.sqrt(Math.max(0, 1 - dot)));
      }
      const M = ys.length;

      const band = (kk, alpha) => {                          // one-sided ±kσ envelope, out of the axis
        ctx.beginPath(); ctx.moveTo(baseX, ys[0]);
        for (let i = 0; i < M; i++) ctx.lineTo(baseX + sign * sg[i] * kk, ys[i]);
        ctx.lineTo(baseX, ys[M - 1]); ctx.closePath();
        ctx.fillStyle = "rgba(" + c + "," + alpha + ")"; ctx.fill();
      };
      band(2, 0.05);
      band(1, 0.06);

      ctx.lineWidth = 1;                                     // posterior samples — slowly re-draw (the animation)
      for (let s = 0; s < 4; s++) {
        ctx.beginPath();
        for (let i = 0; i < M; i++) {
          const mag = sg[i] * (1 + 0.8 * fbm((ys[i] + scrollY) * 0.011 + s * 23.3 + seed + t * 0.0026));
          const x = baseX + sign * Math.max(0, mag);
          if (i === 0) ctx.moveTo(x, ys[i]); else ctx.lineTo(x, ys[i]);
        }
        ctx.strokeStyle = "rgba(" + c + ",0.16)"; ctx.stroke();
      }

      ctx.fillStyle = "rgba(" + c + ",0.72)";                // observations (fixed, on the axis = the mean)
      for (const oy of obs) {
        if (oy < navH - 4 || oy > botY + 4) continue;
        ctx.beginPath(); ctx.arc(baseX, oy, 2.6, 0, Math.PI * 2); ctx.fill();
      }
    }

    function render() {
      ctx.clearRect(0, 0, w, h);
      const gutter = (w - 880) / 2;
      if (gutter < 120) return;                          // margins too narrow → no figure
      const scrollY = window.scrollY || 0;
      const nav = document.querySelector(".nav");
      const main = document.querySelector("main");
      const footer = document.querySelector(".footer");
      const navH = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
      const docTop = main ? main.getBoundingClientRect().top + scrollY : 0;
      const docBottom = footer ? footer.getBoundingClientRect().top + scrollY : docTop + h;
      const botY = footer ? Math.min(h, footer.getBoundingClientRect().top) : h;
      if (botY <= navH) return;
      const c = rgb();
      const depth = Math.min(gutter - 34, 132);
      const lX = Math.round(gutter - 20), rX = Math.round(w - (gutter - 20));

      const gp = opt.layout === "gp";
      const axes = () => {                                 // the figure frame, opaque like the borders
        ctx.strokeStyle = "rgb(" + frame() + ")"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lX, navH); ctx.lineTo(lX, botY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rX, navH); ctx.lineTo(rX, botY); ctx.stroke();
      };
      if (gp) axes();                                      // GP: under, so its observation dots sit on top

      ctx.save();
      ctx.beginPath(); ctx.rect(0, navH, w, botY - navH); ctx.clip();   // between header and footer
      if (gp) {
        drawGP(lX, -1, depth, c, scrollY, docTop, navH, botY, 0);
        drawGP(rX, 1, depth, c, scrollY, docTop, navH, botY, 100);
      } else {
        for (const p of placements(scrollY, docTop, docBottom)) {
          drawDist(lX, -1, depth, c, p.yc, p.halfH, POOL[p.si % POOL.length]);
          drawDist(rX, 1, depth, c, p.yc, p.halfH, POOL[(p.si + 3) % POOL.length]);
        }
      }
      ctx.restore();
      if (!gp) axes();                                     // bumps: on top, so their ends tuck under the line
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }
    // only "gp" animates; the static layouts redraw on scroll / resize / theme
    function loop() { t++; if (!document.hidden) render(); raf = requestAnimationFrame(loop); }
    function startStop() {
      const animate = opt.layout === "gp" && !reduce;
      if (animate && !raf) raf = requestAnimationFrame(loop);
      else if (!animate && raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    resize(); startStop();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener("scroll", () => {
      if (opt.layout === "gp" || scrollPending) return;   // the gp loop already redraws every frame
      scrollPending = true;
      requestAnimationFrame(() => { scrollPending = false; render(); });
    }, { passive: true });
    new MutationObserver(render).observe(document.documentElement,
      { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    renderContent();
    setupTheme();
    setupFigureAxis();
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
