#!/usr/bin/env python3
"""
Canonical generator for the n-hat (n̂) logo.

The mark is a custom lowercase ``n`` drawn as a filled contour — its outer stems
ease out with a concave sweep into flat terminals, like the tails of a Gaussian —
wearing a small posterior as its hat: the statistician's n̂, an estimate under
uncertainty. Both the letter and the hat are built from the PARAMS below.

Refine by editing PARAMS, then run ``python3 generate.py`` to rebuild the SVGs.
Keep PARAMS in sync with ``logo.js`` (the browser mirror used by ``lab.html``).
"""
import math
from pathlib import Path

PARAMS = {
    "grid": 120,                       # viewBox is 0 0 grid grid
    "pad": 13,                         # margin from mark bbox to the square edge (binding dimension)
    "n": {                             # the letter, in grid units
        "B": 90,   "sO": 58, "sI": 60, # baseline; outer / inner archspring heights
        "lO": 36,  "lI": 50,           # left stem: outer / inner x
        "rI": 70,  "rO": 84,           # right stem: inner / outer x  (stem width 14)
        "aO": 36,  "aI": 54,           # arch control y: outer (top) / inner (underside)
        "kc": 8,                       # concave-ease control: distance above baseline
        "fl": 6,                       # foot splay — how far the OUTER edge flares
        "foot": 63,                    # where the flare begins up the stem (lower y = longer sweep)
    },
    "hat": {                           # the posterior, a real Gaussian — drawn as a tapered outline
        "cx": 60, "sig": 8, "base": 36, "h": 14, "span": 2.5, "samples": 64,
        "taper": 0.62,                 # inner curve as a fraction of height; ribbon points at the tails
    },
    "color": {"navy": "#1f4e79", "white": "#ffffff"},
}


def n_path(P):
    g = P["n"]; fl, foot, k = g["fl"], g["foot"], g["B"] - g["kc"]
    B, sO, sI = g["B"], g["sO"], g["sI"]
    lO, lI, rI, rO, aO, aI = g["lO"], g["lI"], g["rI"], g["rO"], g["aO"], g["aI"]
    return (
        f"M{lO-fl} {B} "
        f"Q{lO} {k} {lO} {foot} L{lO} {sO} "          # left-outer: concave flare, then straight stem
        f"C{lO} {aO} {rO} {aO} {rO} {sO} "            # outer arch
        f"L{rO} {foot} Q{rO} {k} {rO+fl} {B} "        # right-outer: stem, then flare out
        f"L{rI} {B} L{rI} {sI} "                      # right foot flat · right-inner straight up
        f"C{rI} {aI} {lI} {aI} {lI} {sI} "            # inner arch (underside)
        f"L{lI} {B} Z"                                # left-inner straight down · left foot flat
    )


def hat_path(P):
    """Tapered Gaussian: outer curve out, scaled-down inner curve back — meets to a point at each tail."""
    h = P["hat"]; cx, sig, base, H, span, n, s = (
        h["cx"], h["sig"], h["base"], h["h"], h["span"], h["samples"], h["taper"])
    top, inn = [], []
    for i in range(n + 1):
        x = cx - span * sig + 2 * span * sig * (i / n)
        e = math.exp(-0.5 * ((x - cx) / sig) ** 2)
        top.append((round(x, 2), round(base - H * e, 2)))
        inn.append((round(x, 2), round(base - s * H * e, 2)))
    return ("M" + " L".join(f"{x} {y}" for x, y in top)
            + " L" + " L".join(f"{x} {y}" for x, y in reversed(inn)) + " Z")


def bbox(P):
    """Tight bounds of the drawn mark: feet are the x-extremes, hat peak & baseline the y-extremes."""
    n, h = P["n"], P["hat"]
    return (n["lO"] - n["fl"], h["base"] - h["h"], n["rO"] + n["fl"], n["B"])


def fit(P):
    """Transform that scales the mark's bbox to sit `pad` from each edge, centred in the square."""
    g = P["grid"]; x0, y0, x1, y1 = bbox(P)
    s = (g - 2 * P["pad"]) / max(x1 - x0, y1 - y0)
    return (f'translate({g/2} {g/2}) scale({round(s, 4)}) '
            f'translate({round(-(x0 + x1) / 2, 3)} {round(-(y0 + y1) / 2, 3)})')


def svg(P, *, bg=None, fg="#ffffff"):
    g = P["grid"]
    rect = f'\n  <rect width="{g}" height="{g}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {g} {g}" width="{g}" height="{g}"'
        f' role="img" aria-label="Nils Grünefeld">'
        f'\n  <title>Nils Grünefeld — n̂</title>{rect}'
        f'\n  <g transform="{fit(P)}">'
        f'\n    <path d="{n_path(P)}" fill="{fg}"/>'
        f'\n    <path d="{hat_path(P)}" fill="{fg}"/>'
        f'\n  </g>'
        f'\n</svg>\n'
    )


if __name__ == "__main__":
    here = Path(__file__).parent
    navy, white = PARAMS["color"]["navy"], PARAMS["color"]["white"]
    files = {
        "favicon.svg":    svg(PARAMS, bg=navy, fg=white),  # primary: navy square, white mark
        "mark-dark.svg":  svg(PARAMS, bg=None, fg=white),  # white mark, transparent (for dark grounds)
        "mark-light.svg": svg(PARAMS, bg=None, fg=navy),   # navy mark, transparent (for light grounds)
    }
    for name, content in files.items():
        (here / name).write_text(content, encoding="utf-8")
        print(f"wrote {name} ({len(content)} bytes)")
