# Logo — n̂

The site mark is **n̂**: a custom lowercase **n** wearing a small posterior as its hat.

- **The concept.** `n̂` is statistical notation for *an estimate under uncertainty* — and **n** is for
  Nils (and for *normal*). The hat is a real Gaussian. The letter's outer stems ease out with a concave
  sweep into flat terminals, so the two feet splay like the **tails of a larger Gaussian** beneath the
  letter: a small distribution above, a big implied one below.
- **The construction.** Everything is drawn on a 120-unit grid from the `PARAMS` block. The `n` is a
  single filled contour (outer edge flares, inner edge stays vertical); the hat is a sampled Gaussian
  `exp(−z²⁄2)` closed to its baseline. No fonts — the letter is a path.

## Files

| File | What it is |
|------|------------|
| `generate.py` | **Canonical source.** Holds `PARAMS` and writes the SVGs. Run `python3 generate.py`. |
| `logo.js` | Browser mirror of the geometry, used by `lab.html`. Keep in sync with `generate.py`. |
| `lab.html` | **Refinement lab** — drag sliders to explore; copies values / SVG back out. |
| `favicon.svg` | Primary asset: navy ground, white mark. Referenced by `../index.html`. |
| `mark-dark.svg` | White mark, transparent background (for dark grounds). |
| `mark-light.svg` | Navy mark, transparent background (for light grounds / print). |

## Colours

- Navy `#1f4e79` (the site `--accent`)
- White `#ffffff`

## To refine

1. Open `lab.html` in a browser and adjust the parameters until it's right.
2. Copy the changed numbers into `PARAMS` in **both** `generate.py` and `logo.js`.
3. Run `python3 generate.py` to rebuild `favicon.svg`, `mark-dark.svg`, `mark-light.svg`.

## To use

- **Favicon:** `<link rel="icon" type="image/svg+xml" href="logo/favicon.svg">` (already wired in `index.html`).
- **QR codes:** use `favicon.svg` as the centre image — the solid navy square gives the quiet contrast a
  scanner needs. For a light QR, `mark-light.svg` on the code's own white works too.

Locked parameters (long-tail feet): `n.fl = 6`, `n.foot = 63`.
