# Michael Hua — Personal Research Portfolio

A standalone, production-ready portfolio site, migrated off Google Sites.
Built with Vite + React 19 + TypeScript and React Router.

**Live site:** https://michaelhua0.github.io/

## Design

**"Spectral Field."** A discrete spectral scale encodes category — teal/green for
AI & research, amber for history — used as data marks rather than a gradient
wash. Display type is *Spectral*, body is *IBM Plex Sans*, labels use
*IBM Plex Mono*. A dark constellation hero flows into a light editorial reading
surface, tied together by a recurring spectral-tick divider.

The homepage signature is the **Research Constellation**: a Canvas 2D knowledge
graph around "Michael Hua" whose About / Portfolio / Publications nodes are real,
focusable navigation links, surrounded by the topics his work touches
(AI, ML, computer vision, hyperspectral imaging, transformers, 3D segmentation,
app development, STEM, history). It responds to pointer/touch with parallax and
attraction, respects `prefers-reduced-motion` (static fallback), and pauses when
off-screen.

## Run locally

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

Use Node.js 22.

## Add your images

Image slots show an on-theme generated graphic until you drop in the real files.
Put your original photos/screenshots in `public/images/` using the filenames
listed in `public/images/README.md` (e.g. `aigro.jpg`, `about-1.jpg`). No code
changes needed — they swap in automatically.

## Project structure

```
src/
  data/           Content as structured data (verbatim from the source site)
    projects.ts     6 portfolio projects, in order
    publications.ts 3 publications
    site.ts         bio + metadata
  components/      Reusable, data-driven UI
    ResearchConstellation.tsx   the homepage canvas graph
    Nav / Footer / Layout       shell + routing
    SmartImage / GeneratedArt   images with on-theme fallback
    YouTubeEmbed                lazy, responsive video
    RichBlocks                  renders the project content model
  pages/          Home, About, Portfolio, Publications, ProjectDetail, NotFound
public/
  images/         drop your originals here
  favicon.svg     monogram
scripts/
  build-pages.mjs creates the GitHub Pages route fallback
.github/
  workflows/      builds and deploys the site on every push to main
```

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages whenever `main` is
updated. The generated `404.html` keeps client-side routes such as `/about` and
`/portfolio` working when opened directly.

## Content

All names, dates, awards, titles, descriptions, links, and YouTube IDs are taken
verbatim from the original site. Editing content means editing the data files in
`src/data/` — no markup duplication.
