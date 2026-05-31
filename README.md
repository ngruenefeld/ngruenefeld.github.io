# n.grnfld.me

Personal website for Nils Grünefeld. Plain HTML/CSS/JS — no build step, no
dependencies. Hosted on GitHub Pages.

## Updating the site

**Edit [`content.js`](content.js) — that's the only file you need to touch.**

It holds all the text: your name, bio, research interests, news, publications,
and links. Each item has comments explaining what it is. To update:

1. Open `content.js`.
2. Change the text between the backticks `` `like this` ``.
   - **Recurring links** (people, groups, institutions) are handled centrally:
     add the phrase + URL once to the `links` map, then just write the phrase
     in your text — every occurrence is linked automatically and stays
     consistent. No `<a>` tags needed for those.
   - One-off links inside text: `<a href="https://...">link text</a>`
   - To add a news item or paper, copy an existing `{ ... }` block, paste it,
     and edit it. Keep the commas between blocks. Newest news goes at the top.
3. Save, then commit and push:
   ```
   git add content.js
   git commit -m "Update content"
   git push
   ```
   GitHub Pages republishes the site within a minute or two.

To preview locally before pushing, just open `index.html` in your browser.

### Adding a photo

- Drop an image in this folder (e.g. `photo.jpg`) and set
  `photo: \`photo.jpg\`` in `content.js`. Leave it empty to show your initials.

### Contact / social links

The links shown at the top of the page (under your name) come from the
`contactLinks` list in `content.js`. Add, remove, or reorder them there.

## The other files (you usually won't touch these)

| File         | What it does                                              |
|--------------|-----------------------------------------------------------|
| `content.js` | **Your content.** Edit this.                              |
| `index.html` | Page structure / skeleton.                                |
| `style.css`  | All styling (colors, fonts, layout, dark mode).           |
| `app.js`     | Renders `content.js`, theme toggle, animated background.  |
| `CNAME`      | Custom domain (`n.grnfld.me`). Don't change.              |

The animated background and conference-deadline calendar (`nlpnorth_deadlines.ics`)
are unrelated to your page content.
