# Editing the site content

All of the site's text lives in [`content.js`](../content.js): name, bio,
research interests, news, publications, service, and links. Nothing else needs
to change for a content update.

## Making a change

1. Open `content.js`. Each field has a comment explaining what it is.
2. Edit the text between the backticks `` `like this` ``.
   - **Recurring links** (people, groups, institutions) are handled centrally:
     add the phrase and URL once to the `links` map, then just write the phrase
     in any text — every occurrence is linked automatically and stays
     consistent. No `<a>` tags needed for those.
   - One-off links inside text: `<a href="https://...">link text</a>`.
   - To add a news item or paper, copy an existing `{ ... }` block, paste it,
     and edit it. Keep the commas between blocks. Newest news goes at the top.
3. Preview by opening `index.html` in a browser, then commit and push:
   ```
   git add content.js
   git commit -m "Update content"
   git push
   ```
   GitHub Pages republishes within a minute or two.

## Photo

Drop an image in the repo root (e.g. `photo.jpg`) and set
`photo: \`photo.jpg\`` in `content.js`. Leave it empty to show initials instead.

## Contact / social links

The links under the name in the hero come from the `contactLinks` list in
`content.js`. Add, remove, or reorder them there. The `CV` entry points at
`cv/cv.pdf` — see the README for how to rebuild it.

## Motto

The short line under the tagline comes from `motto` in `content.js`. Leave it
empty to hide it.
