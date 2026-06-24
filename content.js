/* ============================================================================
   YOUR WEBSITE CONTENT  —  this is the only file you need to edit.
   ----------------------------------------------------------------------------
   How to edit:
     • Change the text between the backticks `like this`.
     • To add a link inside text, write:  <a href="https://...">link text</a>
     • To add a news item / paper / link, copy an existing { ... } block,
       paste it, and edit it. Keep the commas between blocks.
     • Newest news goes at the TOP of the list.
   Save the file and refresh the page to see your changes.
   ============================================================================ */

window.SITE = {

  /* ---------- Header & hero ---------- */
  name: `Nils Grünefeld`,
  role: `DDSA PhD Fellow · Uncertainty Quantification`,

  // Optional profile photo. Put an image in this folder (e.g. photo.jpg) and
  // set:  photo: `photo.jpg`   — leave empty to show your initials instead.
  photo: `image.png`,

  // The short affiliation line under your name. A URL is optional — if you omit
  // it, the address is taken from the "links" shortcuts below.
  affiliation: [
    { text: `NLPnorth` },
    { text: `IT University of Copenhagen` },
    { text: `Pioneer Centre for AI` }
  ],

  // One-sentence summary shown in the hero (HTML links allowed).
  tagline: `I research <strong>uncertainty quantification in machine learning</strong>, developing efficient methods to quantify predictive uncertainty and turn it into calibrated signals, with a focus on natural language processing.`,

  // A short personal motto, shown quietly in italics in the footer. Leave empty to hide it.
  motto: `One day I will find the right model, and it will be simple.`,

  /* ---------- Link shortcuts -------------------------------------------------
     Any phrase listed here becomes a link automatically, everywhere it appears
     in your text (tagline, about, news, publications) and in the affiliation
     line above. Just write the phrase normally — no <a> tags needed — and keep
     each URL in this one place.  Format:   "Exact phrase": `https://…`
     --------------------------------------------------------------------------- */
  links: {
    "NLPnorth": `https://nlpnorth.github.io/`,
    "IT University of Copenhagen": `https://itu.dk/`,
    "Pioneer Centre for AI": `https://www.aicentre.dk/`,
    "Pioneer Centre for Artificial Intelligence": `https://www.aicentre.dk/`,
    "Christian Hardmeier": `https://christianhardmeier.rax.ch/`,
    "Jes Frellsen": `https://frellsen.org/`,
    "Danish Data Science Academy": `https://ddsa.dk/`,
    "Barbara Plank": `https://bplank.github.io/`,
    "MaiNLP": `https://mainlp.github.io/`,
    "LMU Munich": `https://www.lmu.de/en/`,
    "Bertram Højer": `https://bertramhojer.github.io/`,
    "Philipp Mondorf": `https://pmmon.github.io/`,
    "Anna Rogers": `https://annargrs.github.io/`,
    "Stefan Heinrich": `https://stefanheinrich.net/`,
    "TMLR": `https://jmlr.org/tmlr/`,
  },

  /* ---------- About ---------- */
  // Each backtick string is one paragraph. Add or remove paragraphs freely.
  about: [
    `I'm a PhD Fellow in the NLPnorth group at the IT University of Copenhagen, affiliated with the Pioneer Centre for Artificial Intelligence and supervised by Christian Hardmeier and Jes Frellsen. My research asks how to quantify a model's uncertainty, how to validate that the estimates are calibrated and meaningful, and how to communicate them to the people who rely on its output.`,
    `Before joining ITU, I completed my MSc in Computational Linguistics at LMU Munich. My research is supported by a Danish Data Science Academy PhD fellowship.`
  ],

  // Short bullet list shown in the sidebar.
  interests: [
    `Bayesian Machine Learning`,
    `Uncertainty Quantification`,
    `LLM Reasoning`,
    `AI Interpretability`,
  ],

  /* ---------- News (newest first) ---------- */
  news: [
    { date: `Jun 2026`, text: `<a href="https://arxiv.org/abs/2603.29466">An Isotropic Approach to Efficient Uncertainty Quantification with Gradient Norms</a> was selected for an oral presentation at the Symposium on Probabilistic Machine Learning (ProbML 2026).` },
    { date: `May 2026`, text: `I'll be presenting <a href="https://arxiv.org/abs/2605.07776">Tracing Uncertainty in Language Model “Reasoning”</a> and <a href="https://arxiv.org/abs/2603.29466">An Isotropic Approach to Efficient Uncertainty Quantification with Gradient Norms</a> at the <a href="https://fdgm-workshop.github.io/FDGM_ICML2026/">FoGen</a> workshop at ICML 2026.` },
    { date: `May 2026`, text: `<a href="https://arxiv.org/abs/2603.29466">An Isotropic Approach to Efficient Uncertainty Quantification with Gradient Norms</a> was accepted at the Symposium on Probabilistic Machine Learning (ProbML 2026).` },
    { date: `May 2026`, text: `New preprint — <a href="https://arxiv.org/abs/2605.07776">Tracing Uncertainty in Language Model “Reasoning”</a> is out on arXiv.` },
    { date: `Mar 2026`, text: `New preprint — <a href="https://arxiv.org/abs/2603.29466">An Isotropic Approach to Efficient Uncertainty Quantification with Gradient Norms</a> is out on arXiv.` },
    { date: `Oct 2025`, text: `Started my PhD with the NLPnorth group at the IT University of Copenhagen.` },
    { date: `Sep 2025`, text: `Completed my MSc in Computational Linguistics at LMU Munich, with my thesis titled “Estimating Uncertainty in Natural Language Processing,” supervised by Barbara Plank and Silvia Casola in the MaiNLP group.` },
    { date: `Jun 2025`, text: `Awarded a Danish Data Science Academy PhD fellowship.` }
  ],

  /* ---------- Publications ---------- */
  // For each paper: year, title, authors (put your own name in <strong>…</strong>),
  // venue, and any number of links (label + url).
  publications: [
    {
      year: `2026`,
      title: `Tracing Uncertainty in Language Model “Reasoning”`,
      authors: `<strong>Nils Grünefeld</strong>, Bertram Højer, Philipp Mondorf, Barbara Plank, Anna Rogers, Christian Hardmeier, Stefan Heinrich, Jes Frellsen`,
      venue: `Preprint, under review`,
      links: [
        { label: `arXiv`, url: `https://arxiv.org/abs/2605.07776` },
        { label: `PDF`, url: `https://arxiv.org/pdf/2605.07776` }
      ]
    },
    {
      year: `2026`,
      title: `An Isotropic Approach to Efficient Uncertainty Quantification with Gradient Norms`,
      authors: `<strong>Nils Grünefeld</strong>, Jes Frellsen, Christian Hardmeier`,
      venue: `Symposium on Probabilistic Machine Learning (ProbML 2026)`,
      links: [
        { label: `arXiv`, url: `https://arxiv.org/abs/2603.29466` },
        { label: `PDF`, url: `https://arxiv.org/pdf/2603.29466` },
      ]
    }
  ],

  // Small note shown under the "Publications" heading (HTML allowed; leave empty to hide).
  // pubsNote: `See also my <a href="https://arxiv.org/a/grunefeld_n_1">arXiv</a> and <a href="https://scholar.google.com/citations?user=sG390YIAAAAJ&hl=en&oi=ao">Google Scholar</a> profiles.`,

  /* ---------- Service ---------- */
  // Reviewing, organizing, and committee roles. One entry per line (HTML allowed).
  // Remove all entries (or leave the list empty) to hide the section entirely.
  service: [
    `Reviewer, Computational Linguistics`,
    `Reviewer, Transactions on Machine Learning Research (TMLR)`
  ],

  /* ---------- Contact / social links (shown at the top, under your name) ---------- */
  contactLinks: [
    { label: `Email`, url: `mailto:nilgr@itu.dk` },
    { label: `Google Scholar`, url: `https://scholar.google.com/citations?user=sG390YIAAAAJ&hl=en&oi=ao` },
    { label: `GitHub`, url: `https://github.com/ngruenefeld` },
    { label: `LinkedIn`, url: `https://www.linkedin.com/in/ngruenefeld/` },
    { label: `Pure`, url: `https://pure.itu.dk/en/persons/nils-cornelius-gr%C3%BCnefeld/` }
  ]
};
