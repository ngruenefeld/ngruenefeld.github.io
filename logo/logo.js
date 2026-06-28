/* logo.js — browser mirror of generate.py for the n̂ mark.
   Keep PARAMS / geometry in sync with generate.py (that script is canonical for
   the exported SVG files; this one drives lab.html for live refinement). */
(function (global) {
  const PARAMS = {
    grid: 120,
    pad: 13,
    n: { B: 90, sO: 58, sI: 60, lO: 36, lI: 50, rI: 70, rO: 84, aO: 36, aI: 54, kc: 8, fl: 6, foot: 63 },
    hat: { cx: 60, sig: 8, base: 36, h: 14, span: 2.5, samples: 64, taper: 0.62 },
    color: { navy: "#1f4e79", white: "#ffffff" },
  };

  function fit(P) {
    const g = P.grid, n = P.n, h = P.hat;
    const x0 = n.lO - n.fl, y0 = h.base - h.h, x1 = n.rO + n.fl, y1 = n.B;
    const s = (g - 2 * P.pad) / Math.max(x1 - x0, y1 - y0);
    return `translate(${g / 2} ${g / 2}) scale(${+s.toFixed(4)}) translate(${+(-(x0 + x1) / 2).toFixed(3)} ${+(-(y0 + y1) / 2).toFixed(3)})`;
  }

  function nPath(n) {
    const fl = n.fl, foot = n.foot, k = n.B - n.kc;
    const { B, sO, sI, lO, lI, rI, rO, aO, aI } = n;
    return `M${lO - fl} ${B} `
      + `Q${lO} ${k} ${lO} ${foot} L${lO} ${sO} `
      + `C${lO} ${aO} ${rO} ${aO} ${rO} ${sO} `
      + `L${rO} ${foot} Q${rO} ${k} ${rO + fl} ${B} `
      + `L${rI} ${B} L${rI} ${sI} `
      + `C${rI} ${aI} ${lI} ${aI} ${lI} ${sI} `
      + `L${lI} ${B} Z`;
  }

  // tapered Gaussian: outer curve out, scaled-down inner curve back — points at each tail
  function hatPath(h) {
    const { cx, sig, base, h: H, span, samples, taper } = h, top = [], inn = [];
    for (let i = 0; i <= samples; i++) {
      const x = cx - span * sig + 2 * span * sig * (i / samples);
      const e = Math.exp(-0.5 * ((x - cx) / sig) ** 2);
      top.push([+x.toFixed(2), +(base - H * e).toFixed(2)]);
      inn.push([+x.toFixed(2), +(base - taper * H * e).toFixed(2)]);
    }
    return "M" + top.map(p => p[0] + " " + p[1]).join(" L")
      + " L" + inn.reverse().map(p => p[0] + " " + p[1]).join(" L") + " Z";
  }

  // svg({ bg, fg, params, size }) → full SVG markup string
  function svg(opts = {}) {
    const P = opts.params || PARAMS, g = P.grid, size = opts.size || g;
    const fg = opts.fg || P.color.white, bg = opts.bg || null;
    const rect = bg ? `<rect width="${g}" height="${g}" fill="${bg}"/>` : "";
    const t = P.pad != null ? ` transform="${fit(P)}"` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g} ${g}" width="${size}" height="${size}"`
      + ` shape-rendering="geometricPrecision" role="img" aria-label="Nils Grünefeld">`
      + `<title>Nils Grünefeld — n̂</title>${rect}`
      + `<g${t}><path d="${nPath(P.n)}" fill="${fg}"/>`
      + `<path d="${hatPath(P.hat)}" fill="${fg}"/></g></svg>`;
  }

  global.Logo = { PARAMS, nPath, hatPath, svg };
})(typeof window !== "undefined" ? window : globalThis);
