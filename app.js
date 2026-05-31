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

  /* ----------------------------------------------- animated background field */
  function setupBackground() {
    const canvas = $("#bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, dpr, nodes = [], spacing, linkDist;
    const rand = (a, b) => a + Math.random() * (b - a);

    // Navy in light mode, soft blue in dark mode — matches the site accent.
    const rgb = () =>
      document.documentElement.dataset.theme === "dark" ? "143,179,217" : "31,78,121";

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // sparser field: spacing scales with screen area, capped low for a calm look
      spacing = Math.max(130, Math.sqrt((w * h) / 70));
      linkDist = spacing * 1.4;

      const count = Math.round((w * h) / (spacing * spacing));
      nodes = [];
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const s = rand(0.04, 0.12); // slow drift speed (px/frame)
        nodes.push({ x: rand(0, w), y: rand(0, h), vx: Math.cos(a) * s, vy: Math.sin(a) * s });
      }
    }

    function step() {
      const m = linkDist; // wrap margin so links don't pop in/out at the edges
      for (const n of nodes) {
        // gentle brownian steering — dots wander freely through space, no home
        n.vx += rand(-0.002, 0.002);
        n.vy += rand(-0.002, 0.002);
        // hold speed in a slow band so they neither freeze nor race
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 0.14) { n.vx = n.vx / sp * 0.14; n.vy = n.vy / sp * 0.14; }
        else if (sp < 0.03) { const k = 0.03 / (sp || 1); n.vx *= k; n.vy *= k; }
        n.x += n.vx;
        n.y += n.vy;
        // wrap around the edges so dots travel across the whole page
        if (n.x < -m) n.x = w + m; else if (n.x > w + m) n.x = -m;
        if (n.y < -m) n.y = h + m; else if (n.y > h + m) n.y = -m;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const c = rgb();

      // links: fade out with distance, so connections form and break as dots drift
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.22;
            ctx.strokeStyle = "rgba(" + c + "," + alpha.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.fillStyle = "rgba(" + c + ",0.6)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!document.hidden) { step(); draw(); }
      requestAnimationFrame(loop);
    }

    build();
    if (reduce) draw(); else loop();

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { build(); if (reduce) draw(); }, 200);
    });
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    renderContent();
    setupTheme();
    setupBackground();
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
