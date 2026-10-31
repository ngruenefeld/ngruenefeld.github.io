# n.grnfld.me

Source for [n.grnfld.me](https://n.grnfld.me) — the personal academic website
and CV of Nils Grünefeld (PhD fellow, NLPnorth / IT University of Copenhagen;
uncertainty quantification in machine learning). Published with GitHub Pages
from `main`.

## Layout

| Path | What it is |
|------|------------|
| `index.html`, `style.css`, `app.js` | The site. Plain HTML/CSS/JS — no build step, no dependencies. `app.js` renders the content, handles the theme toggle, and draws the background: a figure axis in each margin with marginal posteriors growing out of it (a horizontal masthead band on narrow screens). |
| `content.js` | All site content — bio, news, publications, service, links. Editing guide: [`docs/editing.md`](docs/editing.md). |
| `cv/` | The CV. `cv.tex` on [Awesome-CV](https://github.com/posquit0/Awesome-CV) (class vendored as `awesome-cv.cls`), built with LuaLaTeX. `cv.pdf` is committed and served at [`/cv/cv.pdf`](https://n.grnfld.me/cv/cv.pdf). |
| `logo/` | The n̂ mark used as favicon and nav mark. `generate.py` holds the parameters and writes the SVGs; `lab.html` is a live refinement tool. See [`logo/README.md`](logo/README.md). |
| `CNAME` | Custom domain for GitHub Pages. |
| `nlpnorth_deadlines.ics` | Conference-deadline calendar, refreshed by an automated weekly commit. Unrelated to the site. |

## Site

Preview locally by opening `index.html` in a browser; there is nothing to
install or run. Pushing to `main` publishes the site within a minute or two.

## CV

Requires a full TeX Live (2026 recommended) with `lualatex`, `latexmk`,
`fontawesome6`, and the Source Sans 3 and Roboto font packages — all included
in a standard full installation.

```
cd cv && latexmk && latexmk -c
```

`latexmkrc` selects LuaLaTeX; `-c` removes the auxiliary files. Commit both
`cv.tex` and the regenerated `cv.pdf`.

## Logo

```
python3 logo/generate.py
```

rebuilds `favicon.svg`, `mark-light.svg` and `mark-dark.svg` from the
parameters in `generate.py` (mirrored in `logo.js` for the lab).

## Credits

- CV template: [Awesome-CV](https://github.com/posquit0/Awesome-CV) by Claud D.
  Park and contributors, LaTeX Project Public License 1.3c. Fonts Source Sans 3
  (Adobe) and Roboto (Google) via TeX Live.
- Site fonts: Plus Jakarta Sans and Inter via Google Fonts.
