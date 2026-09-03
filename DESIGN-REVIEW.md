# Design Review — michaelhua.dev portfolio

Reviewed 2026-07-26 against commit `0b13b3f`. Stack: React 19 + Vite +
react-router-dom 7, static site, dark "Instrument" design system.

**This file is the complete design review and remediation plan. It is self-contained — an agent
picking it up needs no other context.** Findings are cited as `file:line` relative to the repo
root. Every claim was verified against source, build output, or computed WCAG math; nothing here
is inferred from a screenshot, because no browser automation was available during the review.

**Read order — do not skip the first two sections:**

1. **AUDIENCE** — who this site is for, and six hard guardrails on what not to change.
2. **INPUTS REQUIRED FROM THE OWNER** — the never-fabricate rule and the `TODO(owner)` convention.
3. **Design Specificity Verdict** — *why* the surface problems exist and why the fix order matters.
4. **The Plan** — start at *Execution order*, which overrides the move numbering.
5. **Appendix A** — ten further in-scope findings that are not covered by the six moves.
6. **Appendix B** — how to verify your work.

The score tables, Priority Issues, Persona Red Flags, and Minor Observations are supporting
evidence for the plan, not separate work items.

**Priority key:** P0 blocking · P1 major, fix before shipping · P2 minor · P3 polish.

**Resolved findings** keep their original text for the record and are prefixed
`**[RESOLVED — <date>]**` with a one-line note on what shipped. Do not re-open them.

**One-line summary of the diagnosis:** the site ships its signature *gestures* — spectral glyphs,
scan sweeps, HUD telemetry, corner ticks, invented `λ`/`FIG`/`REF`/`BAND` coordinate systems —
without the data or the key those gestures would need to mean anything. To a general reader that
reads as decoration pretending to be instrumentation, which is the specific texture people
recognize as machine-generated. The fix is to delete the simulation, not to add more of it.

---

# AUDIENCE — read this before changing anything

This section overrides any inference you would otherwise draw from the codebase, from
`PRODUCT.md`, or from the density of technical content in `src/data/projects.ts`.

**Primary audience: the general public.** Friends, family, community contacts, people who
followed a shared link from a text message or social post, and non-specialist visitors who want
to know who Michael is and what he's made. Assume a phone, a cellular connection, no domain
knowledge, and a short attention span. Optimize the homepage, the shared-link preview, the
mobile experience, and the photo/personal material for this reader.

**Secondary audience: academic and professional evaluators** — a research mentor, a professor, a
science-fair judge, an admissions reader, a recruiter. **Rare but real, and high-stakes when they
do arrive.** They must be able to find rigorous material and follow it all the way down.

## The rule this implies

**Design the front door for the general reader. Keep the technical depth intact behind it.**

The homepage and first scroll should be legible to someone with no background. The deep
material — Publications, project detail pages, papers, methods, citations — stays complete,
accurate, and reachable. Reduce *jargon on the surface*, never *substance underneath*.

## Hard guardrails — do NOT do these

These are the failure modes most likely to result from a well-meaning "make it general-audience"
pass. Every one of them would make the site worse:

1. **Do not delete, merge, shorten, or simplify `src/pages/Publications.tsx` or
   `src/data/publications.ts`.** Publications is the single best-executed page on the site (see
   *What's Working*). It is the secondary audience's destination. Leave its structure alone.
2. **Do not remove or soften factual credentials.** The Regeneron ISEF First Place Grand Award,
   the *Computers & Graphics* paper, the JSHS recognition, venue names, dates, and the Google
   Scholar link all stay. ISEF First Place is legible and impressive to a *general* reader too —
   promote it, do not bury or hedge it.
3. **Do not strip technical explanation from project detail pages.** `projects.ts:78-84`
   explains CTIS, the underdetermined inverse problem, and forward consistency in plain sentences
   a non-specialist can actually follow. That is the target register — keep it. Detail pages are
   allowed to be technical; that is what they are for.
4. **Do not dumb down the writing.** The problem is never that a word is technical; it is that a
   *label* is a coordinate with no key (`λ470 · BAND 01`) or a number with no referent (`FIG.01`).
   Remove unexplained notation. Keep real terminology, explained.
5. **Do not remove the WebGL hero or the CTIS camera mark.** Neither requires any knowledge to
   enjoy. They are the two elements no other site could use, and they work on every audience.
6. **Do not add a spec sheet, datasheet rail, metrics table, or BibTeX block to the homepage.**
   Earlier planning documents proposed a "datasheet spec-rail"; for this audience mix that
   belongs on detail pages at most, and is optional even there.

## What this re-ranks

Relative to a review that assumed an academic-first audience:

- **Downgraded:** unquantified research claims (`projects.ts:84, :120`) — a general reader will
  not audit *"higher fidelity than existing methods."* Still worth one concrete number per
  project for texture, but no longer blocking. Same for the buried *Computers & Graphics*
  citation and the method name (`PASS Transformer`) being absent from cards.
- **Upgraded:** the blank social-share card (`og:image` missing repo-wide) — this audience
  *arrives through shared links*. Also everything mobile: image payload, touch targets, the
  un-dimensioned gallery reflow, and the auto-cycling hero band that has no touch pause.
- **Upgraded:** the personal/photo material ("Life between projects"), currently at ~75% scroll
  depth. It is the only place the person appears rather than the résumé, and for this audience it
  may be the most important section on the page.
- **Unchanged:** every bug, and the entire type/token/motion cleanup. Mechanical inconsistency
  and gratuitous motion read as machine-authored to *any* viewer regardless of background, so
  Moves 3, 4 and 5 are not softened by the audience reframing at all.

---

# INPUTS REQUIRED FROM THE OWNER — and the never-fabricate rule

Some work in this plan needs values that do not exist in the repository. **You cannot derive
them, and you must not invent them.**

## The rule

> **Never fabricate a metric, a benchmark result, a citation, a date, an award, an affiliation, a
> contact detail, a URL, or a photo caption.** If a value is required and not present in the
> repository, write `TODO(owner): <what is needed>` in the code or content, implement everything
> around it so the structure is complete and renders correctly, and list it in your summary.
> A visible `TODO(owner)` is a success. A plausible invented value is a failure, and it is worse
> than leaving the work undone.

This rule is not boilerplate. This site already ships fabricated scientific data as decoration —
`SpectralSignature.tsx:63-68` generates spectral emission peaks from a hash of the URL slug — and
removing that is one of the plan's goals. Do not replace it with a different invention.

## Inputs, and how to proceed without them

| Needed for | Missing value | What to do |
|---|---|---|
| **Move 2 item 3** — contact (P0) | Email, GitHub URL, LinkedIn URL, CV PDF | **Owner has confirmed: leave as TODO.** Build the full contact section, the `site.ts` shape, the footer column, and the About placement. Populate with `TODO(owner)` strings, e.g. `email: "TODO(owner): email address"`. The section must render without layout breakage while the values are placeholders — do not hide it behind a conditional. Do not guess an address from the repo, the git config, or the domain. |
| **Move 6 item 3** — share cards (P0) | A real Open Graph image | Wire `og:image` and `twitter:image` in `SEO.tsx` and the prerender step, pointing at `public/images/og-default.jpg` at **1200×630**. If you cannot produce a genuine image, do **not** generate a synthetic or AI-illustrated one: leave `TODO(owner): supply 1200×630 og-default.jpg` and note it. An existing real photo cropped to 1200×630 is acceptable and preferable to a placeholder. |
| **Move 1 item 1** — optional metrics | Real numbers for `projects.ts:84`, `:120` | **Do not add numbers.** Leave both sentences exactly as they are, or replace the comparative phrasing with a non-comparative factual description of what was built. Never write a percentage, a dataset name, or a baseline that is not already in the repo. |
| **Move 2 item 5** — photo captions | Michael's words for the 10 candid photos | Build the caption slot in `HomeGallery.tsx` and `data/photos.ts` and leave `TODO(owner)` per photo. Do **not** write captions from the alt text — alt text describes; captions carry voice, and only the owner has it. |
| **Move 2 item 6** — homepage sequence | — | The target order is specified. If you believe a different order is better, implement the specified one and raise the alternative in your summary rather than substituting it. |

## Editorial decisions that are the owner's, not yours

Implement what is written; if you disagree, note it in your summary instead of deviating:
splitting content between Home's Profile section and the About page; which of the three
inconsistent role triads survives (see Appendix A9); whether the *Computers & Graphics* citation
appears anywhere on the homepage; and any change to the wording of a factual credential.

---

Method: tri-agent (A: design review · B: deterministic detector/build · C: interaction feel). Browser visualization unavailable — no automation tool exposed, no local playwright/puppeteer, none installed. All findings are source-, build-, and math-derived; no rendered-pixel evidence.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 2 | Hero band flips `is-active` on a 3400ms timer (Hero.tsx:361-368) using the identical treatment as `:hover`/`:focus-visible` — a status signal reflecting nothing. No loading state anywhere: 5 of 6 project figures flash a `#f4f3ef` near-white rectangle on a near-black page until decode (SmartImage.tsx:36-37); clicking play yields a black box for 1-2s (YouTubeEmbed.tsx:31). |
| 2 | Match system / real world | 2 | "Open figure →" on all 6 cards including a YouTube channel (ProjectCard.tsx:57). FIG.01 / REF 01 / BAND 01 / NOTE / ERR — five invented numbering systems, none cross-referenced. |
| 3 | User control and freedom | 2 | Auto-cycle pauses only on `onMouseEnter` — no touch equivalent (WCAG 2.2.2). `behavior:"auto"` (Layout.tsx:22) resolves to `scroll-behavior:smooth` (global.css:79), so every route change animates a scroll through the new page. No scroll restoration on Back. |
| 4 | Consistency and standards | 1 | Systemic. `--read-*` remapped by `.home-body`/`.project`/`.about` but not Portfolio/Publications/PageHeader/Footer — the same ProjectCard renders `--text-soft:#d2dae4` on Home and `#b2bdcb` on Portfolio. 15 mono sizes, 10 uppercase tracking values, 17 durations, 9 breakpoints, 92 distinct stray colors. |
| 5 | Error prevention | 3 | Nothing destructive. Deduction: NotFound.tsx:8 omits `path`, so every 404 emits `canonical=https://michaelhua0.github.io`. |
| 6 | Recognition rather than recall | 2 | Teal=research / amber=history with no legend anywhere; three parallel numbering systems; `λ470 · BAND 01` shipped while the readable key in spectrum.ts:47-52 is never rendered. |
| 7 | Flexibility and efficiency | n/a | Single-visit static portfolio; no repeat workflow to accelerate. |
| 8 | Aesthetic and minimalist design | 2 | Same domain triad restated 5× on Home; 4 copies of site nav on one page; 7 separate teal-glow ornaments; author-confessed "tech texture" HUD (Hero.tsx:382). The two white sponsor logos are the highest-contrast objects on the page at 19.05:1. |
| 9 | Error recovery | 3 | 404 is the best-written surface. Deductions: the canonical bug; SmartImage.tsx:50-51 silently substitutes invented abstract art for a missing figure, and GeneratedArt.tsx:182-183 carries `role="img"` + `aria-hidden="true"` so the alt text is destroyed. |
| 10 | Help and documentation | n/a | No feature set to document. |
| **Total** | | **17/32** | **53% — Acceptable, bottom edge** |

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | 13/13 contrast pairs pass AA; alt 8/8; one h1 per route, no skipped levels; focus coverage complete; reduced-motion handled in 4 subsystems in both CSS and JS, all verified to leave content visible. Defects: `.nav__toggle` 36px (the only mobile nav control), `.footer__nav a` ~17px, `.yt__facade` focus ring clipped by `overflow:hidden`, no focus return on menu close, blanket `0.001ms` reduced-motion kill. |
| 2 | Performance | 2 | 102kB gzip code, every listener/observer cleaned up, WebGL IO+visibility gated with DPR cap and full teardown, YouTube is a real facade. Against that: 3.12MB of images on `/` alone, 0 webp/avif, 0 srcset, `scanSweep` animates `left` ×9, `getBoundingClientRect()` on every pointermove, resize undebounced (reallocates the GL backing store), no code splitting. |
| 3 | Responsive | 2 | 9 ad-hoc breakpoints, no `--bp-*` token; nav collapses at 760 while the hero band collapses at 720. `.hero__way-desc` truncates "Peer-reviewed and competition pap…" across the entire 720-1200px range (hero.css:271-279). ~640px of dead space beside the Home portrait at 900-1200px. `.project__gallery-photo--N` hardcoded for N=1..4 against a 3-item array. |
| 4 | Theming | 2 | Token system is real and widely used, then contradicted: 115 color literals / 92 distinct outside `:root` (hero.css alone 47); `--radius:0px` broken by `nav.css:36 border-radius:12px` on the brand; `--research`/`--history` base tokens dead; zero duration tokens; zero type-scale tokens. |
| 5 | Implementation integrity | 1 | Detector clean on `src/`, but verified by hand: `.readout` and `.meta` — the two utilities the design system exists to provide — are used by zero components; `.pub:focus-visible` styles an element that can never receive focus; `.hero__way-arrow` transitions opacity 1→1; `.hero__word--accent` changes `#f5f8fb`→`#f6f9fc`; `home.css:319-331` is a dead "first card is bigger" override whose declarations match the base rule. |
| **Total** | | **10/20** | **Acceptable — significant work needed** |

## Design Specificity Verdict

**The site ships the signature gestures before the data that would make them mean anything. That inversion is the vibecoded signal — not the animation count.**

Two elements could not be lifted into any other product. The hero is a spectrometer in GLSL: `BANDS = 6.0` (Hero.tsx:30), a domain-warped FBM field quantized into exactly those six bands (:91-93), a six-stop violet→ember ramp (:73-89), dark absorption seams carved at every band boundary (:132-136), and R/G/B sampled at radial offsets around the pointer so the cursor performs literal chromatic dispersion (:111-121). The CTIS mark puts three offset diffraction-order squares inside the lens (CTISCameraMark.tsx:38-42) — the zero-order/first-order/diagonal pattern described in projects.ts:78, as a monogram.

Everything else asserts instrumentation without carrying any. The "measurement grid" (global.css:104-115) is vertical lines only, at a spacing tied to no column count, no `--page-max`, no `--gutter`, computing to 1.049:1 against `--bg` and 1.006:1 under `.home-body` — the system's signature texture is mathematically below the visibility threshold. The corner HUD reads `SPECTRAL FIELD / λ 400–700 nm` with the code comment saying it out loud: "tech texture" (Hero.tsx:382). Each project card carries 5-7 "emission lines" whose wavelengths come from a PRNG seeded on the URL slug (SpectralSignature.tsx:63-68), drawn on a real 400-700nm axis with real 50nm ticks. (Originally flagged as a credibility risk with expert readers; under the general-public brief the verdict is simpler and no softer — it is unreadable notation that costs every visitor something and pays none of them back, so it goes.) Corner crop ticks appear on figures, again on project leads at 11px instead of 9px, and glowing teal hairlines appear on publication figures and the portrait frame — seven separate ornaments, none encoding anything.

Meanwhile projects.ts:84 claims "higher reconstruction fidelity than existing methods" and :120 "higher segmentation accuracy than existing methods" with **no number, no baseline, no dataset, no metric anywhere on the site**. The space where the measurement belongs is occupied by randomly generated emission lines.

Below the hero, the composition is category-default: centered page headers with eyebrows → a symmetric 2×3 card grid → a two-column portrait/bio spread → a masonry photo wall → a link directory → a hairline footer.

This maps exactly onto the approved phased plan: Phase 2 (signature gestures — spectral glyph, site-wide scan, spine) shipped, Phase 3 (the structured data those gestures bind to — year/spec/awards/citation) did not. The gestures are running against nothing.

## What's Working — protect these

**The hero earns its cost, technically and conceptually.** The interaction *is* the research rather than a metaphor for it, and it is engineered honestly: IntersectionObserver + `visibilitychange` gating, DPR clamped to 1.75, a single composed static frame under reduced motion, a `webglcontextlost` handler with CSS fallback, and complete GL teardown.

**Publications is a bibliography, not a card grid.** `REF 01` + serif title + a real venue string ("Computers & Graphics, Volume 122, August 2024") + the actual first page of the paper at `object-fit:contain` on paper-white in a 4/5 frame. The figure is evidence, not decoration. And the deep link lands: `scroll-margin-top: calc(var(--nav-h) + 24px)` plus a `:target` highlight means `/publications#nhd-paper` works — most portfolios get this wrong. This is the one page where the instrument metaphor is fully earned, because the mono labels index real records.

**The engineering discipline is above the bar and should not be touched.** Every one of 8 listeners and 3 observers is cleaned up; reveals fire once and disconnect (no re-trigger on scroll-up); reduced motion is handled in four subsystems in both CSS and JS with content verified visible; nothing anywhere is hidden behind hover; `aria-hidden` discipline on decorative elements is exemplary; YouTube is a genuine facade — no third-party iframe until click; easing is 94% tokenized with no `linear` and no bare `ease`; aspect ratios reserved on 8 of 9 media types.

## Priority Issues

**[P0] No contact path exists anywhere on the site.** Grepping `src/` and `index.html` for `mailto|linkedin|github|resume|cv|contact|scholar` returns one hit: a Google Scholar *citations query* buried in projects.ts:142. Nav has 4 items, no contact (Nav.tsx:6-11). Footer has 5 links, none reachable-by (Footer.tsx:13-21). No email, no LinkedIn, no GitHub, no CV. PRODUCT.md:11 states visitors are "looking for background before a conversation, interview, or reference" — every path on the site terminates in a dead end. *Fix:* add `contact` to site.ts; make it the closing section of Home in place of "Keep exploring"; add to footer and About.
*Suggested command:* /impeccable shape

**[P0] Unexplained notation is the site's main jargon barrier, and some of it is fabricated.** Four invented labelling systems ship with no key anywhere: `λ470 · BAND 01` (SpectralSignature.tsx:133), `FIG.01` (ProjectCard.tsx:20, derived from array index — renaming a project renumbers every figure), `REF 01` (publications.css:32), `NOTE`/`ERR`. The readable key already exists in the data and is never rendered: spectrum.ts:47-52 stores `"Medical · Computer vision"`, `"Hyperspectral imaging"`, `"Physical AI · Software"`, `"History · Documentary"`. Separately, the emission lines drawn on each card's 400-700nm axis are **fabricated** — SpectralSignature.tsx:63-68 hashes the URL slug through a PRNG. *Fix for a general audience:* render `band.label` instead of `λ{nm} · BAND {n}` — words, not coordinates. Delete `seededStream` and the `lines` memo; keep the single domain-mapped marker. Drop `FIG.01` entirely. Keep `REF 01` on Publications, where it indexes real records. Also fix `"MJ"` as an award mark (Home.tsx:35), which is opaque to everyone, and `"Open figure →"` on all six cards (ProjectCard.tsx:57) including a YouTube channel and a phone app.
*Suggested command:* /impeccable clarify

**[P0] Every shared link renders a blank preview card.** `og:image` and `twitter:image` are absent repo-wide while SEO.tsx:23 sets `twitter:card=summary_large_image`. Because `scripts/build-pages.mjs` only copies `index.html` → `404.html` with no prerendering, SEO.tsx runs client-side only, so every route also ships the same static `<title>Michael Hua</title>` and one generic description. *Why this is P0 for this audience specifically:* the primary audience arrives through links pasted into texts, group chats, and social posts. Every one of those currently previews as a blank rectangle with a generic title. *Fix:* author a real OG image (1200×630), wire `og:image`/`twitter:image` in SEO.tsx, and prerender per-route `<title>`/description/`og:*` at build time in `scripts/build-pages.mjs`.
*Suggested command:* /impeccable harden

**[P0] Evidence is buried under assertion on the homepage.** The largest type on Home is a third-person aphorism at up to 4.5rem ("Michael builds systems that reveal what conventional images leave hidden.", Home.tsx:80-82) on a site that is first-person everywhere else. The ISEF First Place Grand Award renders at up to 2.15rem inside an **unlabelled** `<aside>` (Home.tsx:109), flanked by two white sponsor logos whose 19.05:1 contrast makes them the first fixation in the row — the eye lands on Midjourney. *Fix:* delete the aphorism (it is corporate bio-speak in the third person, which reads as ghostwritten to a general reader); promote recognition to a titled section directly below the hero with **the award itself** as the display line, spelled out in plain words — "First Place Grand Award · Regeneron ISEF 2026" needs no domain knowledge to land. Demote the sponsor logos to `--text-faint` mono text or drop them. *Audience note:* the *Computers & Graphics* citation should be **reachable** from here but should not be the display line — set it as a quieter secondary reference, not the headline.
*Suggested command:* /impeccable layout

**[P0] The signature button interaction is invisible in 3 of 4 contexts, and turns its own label near-black.** `.btn::before { z-index: -1 }` (global.css:260) sits on a `.btn` that is `position:relative; z-index:auto` — not a stacking context, no `isolation`. The teal fill escapes to the root stacking context and paints beneath every section background. On `.btn--primary` its own opaque background covers it (100% invisible). On Home's only CTA, `.home-profile`'s opaque background covers it (100% invisible) — and `.btn:hover { color: #04140f }` still fires, so "More about Michael" turns near-black text on a dark surface on hover. On Publications the 55%-opaque `.pub:hover` background muddies it to a computed 3.31:1. Where it does work, the label darkens over 0.3s while the fill sweeps over 0.4s, so the right half of every label is dark-on-dark at t≈150ms. The codebase already uses `isolation: isolate` correctly five times — including at hero.css:180 and home.css:397 — and missed the one component that needed it.
*Suggested command:* /impeccable polish

**[P1] Zero `:active` states exist in the entire codebase.** `grep -rn ":active" src/` returns nothing. All 18 interactive classes have hover, most have focus, none acknowledges a press — on a site whose design system calls its buttons "sharp instrument controls". Four of those targets are `<Link>`s that trigger a route change which then smooth-scrolls, so perceived latency between mousedown and any visual change is the full navigation flight.
*Suggested command:* /impeccable animate

**[P1] Motion is doing hierarchy's job — 9 of 16 motions are unmotivated.** The auto-cycling wayfinding highlight (Hero.tsx:176, 361-368) spotlights one of three primary destinations every 3.4s forever, with the exact treatment used for `:hover` and `:focus-visible`, so it is indistinguishable from real state; `onMouseEnter` writes the hovered index into `active`, so on mouse-out the highlight resumes crawling from wherever your cursor last was, in your peripheral vision, caused by something you did seconds ago; touch never pauses it; each tick fires six simultaneous 300-450ms transitions including a three-inset-shadow paint. The code comment calls it "animated wayfinding into the site" — animation used because the layout is not trusted to lead. Around it: a 1.8s five-step hero entrance cascade whose last arrival is the decorative HUD; word-level stagger with inline magic delays on a two-word name; `heroDrift` running a 22s infinite `blur(26px)` loop on precisely the GPUs that just failed WebGL; 850ms for a 1px divider to draw; scale(1.015) over 550ms and scale(1.025) over 600ms, both below perceptual threshold; and hover effects on two non-interactive elements that promise a click nothing handles.
*Suggested command:* /impeccable quieter

**[P1] The design system is a comment at the top of a stylesheet.** `.readout` (global.css:156) and `.meta` (:170) — the two utilities the "instrument voice" exists to provide — are used by zero components. The system file contradicts itself in 14 lines: `.readout` is `0.16em` and `.eyebrow`, its own declared alias, is `0.18em`. Every label was hand-typed instead, producing 15 mono sizes in a 0.62-0.95rem band and 10 uppercase tracking values for one role. Zero duration tokens against 17 literal durations; zero type-scale tokens; nine breakpoints. At 0.62rem uppercase, 0.06em versus 0.20em is the label's entire character — this mechanical inconsistency *is* the texture that reads as machine-authored.
*Suggested command:* /impeccable extract

**[P1] Two token worlds, applied to some pages and not others, splitting a single component.** `--read-*` is remapped by `.home-body`, `.project`, `.about` and not by Portfolio, Publications, PageHeader, Footer, NotFound. On About, PageHeader renders *outside* the remap (About.tsx:18 vs :20), so the h1 is `#eef2f7` and the h2 forty pixels below is `#f7f9fc`. Two palettes, one page.
*Suggested command:* /impeccable polish

**[P1] The category color encodes the site's entire positioning, breaks in five places, and has no legend.** `--cat` correctly flips amber for `cat-history`, but five shared rules hardcode `--research-bright`: figure ticks (global.css:288), the scan line (:304-305), project-lead ticks (projectdetail.css:69), the Home row hover wash (home.css:306), the portrait rule (home.css:95). So a history project gets an amber tag, teal ticks, a teal sweep, and a teal hover. Nothing on any page states what either color means. PRODUCT.md:19 identifies research↔history as the whole positioning.
*Suggested command:* /impeccable colorize

**[P1] Route changes smooth-scroll through the newly rendered page.** `behavior: "auto"` (Layout.tsx:22) means "use the computed `scroll-behavior`" per CSSOM-View — not instant — and global.css:79 sets `smooth`. So navigation renders the new page at the old scroll offset, then animates upward through unfamiliar content, tripping every Reveal observer on the way. Because global.css:82 forces `auto` under reduced motion, the bug is invisible when testing with reduced motion on. Back/Forward also loses position entirely (Layout.tsx:10-23 forces top:0 on every pathname change).
*Suggested command:* /impeccable optimize

**[P0 for this audience] 3.12MB of images on the homepage against 102kB gzip of code.** 4.56MB deployed total, 0 webp/avif, 0 srcset, no `fetchpriority` on the LCP image. Two gallery photos are 1800px wide for a column that is at most 240px. The 10 gallery images carry no `width`/`height` and `height:auto` inside a CSS-columns masonry, so each decode repacks all ten and shifts the following section — while the user is scrolling through it. Dimensions are known on disk (678×292 to 585×899, a 3.6× ratio spread). *Raised from P1:* a general audience means phones on cellular, so payload and the reflow-under-the-thumb are front-line, not hygiene.
*Suggested command:* /impeccable optimize

**[P1] The personal material — the thing this audience came for — is at ~75% scroll depth.** "Life between projects" (HomeGallery.tsx) is 10 real candid photos in a true masonry that preserves aspect ratios, under the best heading on the site. It is the **only** place Michael appears as a person rather than as a résumé. It currently sits below the hero, the profile/bio spread, the awards aside, and Selected Work. *Fix:* move it up the homepage sequence for the primary audience — a defensible order is Hero → Recognition (P0 above) → Selected work → **Life between projects** → Profile/bio → Contact. Also give the photos captions: today they have no click handler, no `<a>`, no caption and no keyboard path, yet `homegallery.css:69-72` scales them on hover as if they were interactive.
*Suggested command:* /impeccable layout

**[RESOLVED — 2026-09-03]** Google Fonts is gone; Newsreader ships self-hosted as a
variable face (`wght 200 800`, `global.css:11-18`) and no `560`/`520`/`480` weight remains in the
codebase — only 400/500/600/700, all inside the axis. The swap-to-Georgia-bold flash is closed by
the metric-matched fallback at `global.css:41-64`. Original finding: **[P1] `font-weight: 560` is inert at 9 sites.** The Google Fonts URL requests discrete weights (`wght@0,9..144,400;500;600;700`), so the response returns static faces pinned to 400/500/600/700 — not a variable range. Every `560` resolves to 600, every `520` to 500, every `480` to 400. Fix is one character class: `wght@0,9..144,400..700`. Separately, during swap those weights snap to Georgia bold, so every heading on the site flashes noticeably bolder than final.
*Suggested command:* /impeccable typeset

**[P2] The Reveal wrapper produces a double hairline between every publication.** Each `.pub` is the only child of its own `.reveal` div, so `.pub:last-child` (publications.css:16) matches every publication — its `border-bottom` lands directly above the next row's `border-top` with no margin collapse. A 2px double rule between all rows, on a design system whose stated identity is "depth from hairlines and light, not shadow". The same wrapper also makes `/publications#msst-paper` land 20px off target, because the scroll position is computed from the `translateY(20px)` box.
*Suggested command:* /impeccable polish

**[P2] `.hero__way-desc` truncates mid-word across every common laptop width.** `white-space:nowrap; text-overflow:ellipsis` (hero.css:271-279), released only below 720px. At 1200px the text column computes to ~250px against ~248px of content, so destination 02 renders "Peer-reviewed and competition pap…" from 720px to 1200px while 01 and 03 fit — asymmetric truncation in the site's primary wayfinding.
*Suggested command:* /impeccable adapt

**[P2] The video play button has no visible focus ring.** `.yt__facade` is `inset:0` inside `.yt__frame { overflow:hidden }`, so the global `outline-offset:3px` draws the ring outside the frame where it is clipped entirely. It is the only real `<button>` in the content area. Separately, `.hero__way:focus-visible` uses `#93e8dc` — a second focus color — inset, over a live WebGL field that is bright teal in places, so focus visibility varies over time.
*Suggested command:* /impeccable polish

## Persona Red Flags

Ordered by audience weight. The first three are the primary audience and carry the most weight;
the fourth is the secondary audience and is included because its failures are real, not because
it should drive design decisions.

**PRIMARY — the shared-link visitor (a friend, a relative, a classmate's parent).** Receives a
link in a text. **The preview is a blank card with the title "Michael Hua"** and a generic
description — `og:image` is absent repo-wide. Taps through on a phone over cellular and downloads
3.12MB of images. The hero fills the viewport with `min-height: calc(100svh - var(--nav-h))` plus
the destination band, and there is **no scroll cue** that anything is below (hero.css:1-13). The
band's three rows auto-cycle forever with **no touch pause** (Hero.tsx:361-368 — `paused` is
driven only by mouse and focus events), so something blinks on a timer while they read. Scrolls
to the bio and meets a 4.5rem third-person sentence about Michael. Reaches the awards row, which
has no section head, so a First Place Grand Award reads as a footnote to a portrait — beside a
Midjourney logo at 19.05:1, the brightest thing in the row. Reaches the photos — the part they
actually wanted — at ~75% scroll depth, and they reflow under the thumb as each un-dimensioned
lazy image decodes. Wants to reply "this is great, how do I reach him" — **no contact exists.**

**Jordan (first-timer):** the destination band starts flipping states on a timer and Jordan waits to see whether something is loading. The section head reads "Profile" with the readout "Bloomfield Hills · MI" where a summary belongs. The 4.5rem third-person sentence on an otherwise first-person site reads as written by someone else. The awards row has no section head, so a First Place Grand Award reads as a footnote to the portrait. Jordan decides he likes this person and wants to email him — nothing exists.

**Riley (stress tester):** hovers the brand and gets the best animation on the site; tabs to it and gets nothing (hover-only, no `:focus-visible`). Hovers a Publications button: 3.31:1. Visits `/portfolio/nope`: gets 404 content that declares itself canonical to the homepage. Resizes to 900px: ~700px of void beside the portrait. Blocks images: figures silently become invented abstract art indistinguishable from real results. Enables reduced motion: passes cleanly. Kills JS: content stays visible.

**Casey (distracted mobile):** the hero band becomes three stacked full-width rows that still auto-cycle, with no hover to pause and no pause control. `min-height: calc(100svh - var(--nav-h))` plus the band leaves no scroll cue that anything is below. The menu toggle is 36px tall — the only mobile nav control. The gallery reflows under the thumb as each un-dimensioned lazy image decodes. **This persona now carries nearly as much weight as the primary above:** general audience means phones.

**SECONDARY, low weight — ISEF-caliber mentor / admissions reader, 90 seconds.** Included for
completeness; **do not let this persona drive homepage decisions.** 0-10s a shader and a name, no
affiliation or field. 10-30s the aphorism, then the first real specific ("Physics-aware AI for
computational imaging") at 0.7rem mono beside a 4.5rem slogan. 30-45s the awards aside — visually
fourth in its own unlabelled section, next to a Midjourney logo. 45-70s real titles and precise
teasers, but "Physics-Aware Spatial-Spectral (PASS) Transformer" appears only on the detail page.
70-90s needs the paper; the only routes from Home are a directory row and the footer.
**Historical disqualifier, now downgraded:** the unquantified comparative claims at projects.ts:84
and :120 with generated emission lines where a number should be. *For this audience mix, the
right response is narrow:* keep the deep pages complete and easy to reach from the homepage
(Publications should be one obvious click, not a footer link), and add one real number per
project **on the detail page only** if the data exists. Do not restructure the homepage for this
reader, and do not add a metrics table anywhere.

## Minor Observations

`.pub:hover` lights a whole publication row as if clickable when only inner buttons are; `.pub:focus-visible` styles an element that can never receive focus. `.home-gallery__photo:hover` scales 10 photos that have no click handler, no `<a>`, no caption, no keyboard path. `.home-work__all` explicitly removes its underline on hover, leaving a 4px arrow nudge as the sole affordance on the "All projects →" CTA, at 18px tall with no padding. `.dir__desc { text-align:center }` centers the middle cell of a left-flush four-cell row. `.sec-head__rule`'s `transform-origin` is `left` globally and overridden to `center` twice, so two of Home's four identical rules draw from the left and two from the middle — under left-flush titles. `.nav__toggle` has no hover state at all. `heroDrift` animates the WebGL *fallback* perpetually. `About` is strictly poorer than the Home section linking to it, with the same portrait and the same alt string. `About.tsx:26-29` ships a production note to visitors: "Portrait reserved / Red backdrop · light blue suit". `Layout.tsx:12` calls `document.querySelector(hash)` unguarded — a bare `#` throws `SyntaxError`, and with no error boundary in App.tsx React unmounts the root. Five separate non-reactive `matchMedia` reads instead of one subscribed hook. `og:image` and `twitter:image` are absent repo-wide while `twitter:card=summary_large_image` is set, so every share renders a blank card — and because nothing prerenders, every route ships the same static `<title>Michael Hua</title>`.

---

# The Plan — 6 moves

Each move is independently shippable. Verify each with `npm run build` (tsc + vite) and
`npm run lint` before committing.

## Execution order (revised for a general-public primary audience)

**Do them in this order, not in the numbered order below.** The numbering is retained so the
issue list above stays cross-referenceable, but the audience reframing changed the priority:

| Do | Move | Why it moved |
|---|---|---|
| 1st | **Move 6** items 1–4 + **Move 5** | Share cards, image payload, mobile touch targets, and the six real bugs. This is what the primary audience actually hits: a blank preview, 3.12MB on cellular, a 36px tap target, and a CTA whose label goes near-black on hover. Highest impact, lowest risk, no design debate. |
| 2nd | **Move 2** | Re-rank the homepage — with the audience-revised sequence in Move 2 item 6. |
| 3rd | **Move 1**, reduced scope | **Delete the simulated instrumentation. Do not build the datasheet/metrics half.** See the scope note at the head of Move 1. |
| 4th | **Move 4** | Cut ~60% of the motion, add `:active`. |
| 5th | **Move 3** | Token consolidation. Invisible to visitors, but it is what stops the code reading as machine-authored — and it makes every later change cheaper. |

Everything in Moves 3, 4 and 5 is audience-independent and fully in scope as written.

## Move 1 — Delete the simulated instrumentation (reduced scope)

> **SCOPE CHANGE — read before starting this move.** This move originally had two halves: delete
> the fake instrumentation, *and* add real measurement data to fill the gap. **For a
> general-public primary audience, only the first half is in scope.** Do items 2–7 below. Item 1
> (structured `metric`/`baseline`/`dataset` fields and a spec rail) is **downgraded to optional,
> detail-page-only**, and must not touch the homepage. A general reader will not audit a
> reconstruction-fidelity claim; adding a metrics table to serve a rare visitor would cost the
> common one. Deleting notation with no key helps *both* audiences, so that part stays.

1. **OPTIONAL / DETAIL-PAGE ONLY — do this last, or not at all.** If real numbers exist, replace
   the unquantified claims at `projects.ts:84` ("higher reconstruction fidelity than existing
   methods") and `projects.ts:120` ("higher segmentation accuracy than existing methods") with the
   actual delta, in the existing prose sentences. **Do not add `metric`/`baseline`/`dataset`
   fields, a spec rail, a datasheet, or a metrics table**, and do not surface any of this on the
   homepage — see the scope note above. A single number inside a sentence a general reader can
   follow is the entire goal here.
2. **Bind `SpectralSignature` to real data or delete its fabrication.**
   `src/components/SpectralSignature.tsx:62-69` generates 5–7 "emission lines" from a PRNG seeded
   on the URL slug and draws them on a real 400–700nm axis with real 50nm ticks. Either plot the
   actual CTIS band centers, or delete `seededStream` and the `lines` memo entirely and keep only
   the single domain-mapped marker.
3. **Render `band.label` — words, not coordinates.** `src/data/spectrum.ts:47-52` already stores
   `"Medical · Computer vision"`, `"Hyperspectral imaging"`, `"Physical AI · Software"`,
   `"History · Documentary"`. `SpectralSignature.tsx:133` ships `λ{band.nm} · BAND {band.n}` and
   never renders `label` — an invented coordinate system with its key deliberately withheld.
   **For a general audience, render the label and drop the wavelength entirely.** Same reasoning
   applies to `FIG.01` (`ProjectCard.tsx:20`), which is derived from array index and means nothing
   to anyone — delete it. Keep `REF 01` on Publications, where it indexes real records for the
   secondary audience.
4. **Delete the fake HUD.** `src/components/Hero.tsx:382-386` — hardcoded `SPECTRAL FIELD` /
   `λ 400–700 nm`, faded in last at t=1.8s. The code comment already calls it "tech texture".
   Also remove `.hero__hud*` from `src/components/hero.css:60-75, 315`.
5. **Make the measurement grid real or remove it.** `src/styles/global.css:104-115`. Today:
   vertical lines only, spacing `clamp(80px,12vw,160px)` tied to no column count / `--page-max` /
   `--gutter`, computing to 1.049:1 on `--bg` and 1.006:1 under `.home-body`. Either raise
   `--grid-line` until it is genuinely visible *and* re-derive its spacing from the layout so the
   page actually aligns to it, or delete the layer.
6. **Cut 4 of the 7 glow ornaments:** `.figure__ticks` (`global.css:282-293`),
   `.project__lead::before/::after` (`projectdetail.css:64-75` — the same brackets again at 11px
   instead of 9px), `.pub__figure::before` (`publications.css:67-77`),
   `.home-profile__portrait-frame::after` (`home.css:87-97`). Keep `.scan` only where something
   genuinely resolves; it currently sweeps a YouTube channel banner and a phone screenshot.
7. **Fix the category encoding and give it a legend.** Replace every hardcoded
   `--research-bright` in shared code with `var(--cat, var(--accent))`:
   `global.css:288`, `global.css:304-305`, `projectdetail.css:69`, `home.css:306`, `home.css:95`.
   A history project currently gets an amber tag with teal ticks, a teal sweep, and a teal hover.
   Then add a two-item legend to the Portfolio header, which currently carries filler copy
   (`Portfolio.tsx:18-21`), and consider grouping/ordering the grid by category.

## Move 2 — Re-rank the homepage on evidence, and give the site an ending

1. **Delete the 4.5rem aphorism.** `src/pages/Home.tsx:80-82` +
   `.home-profile__statement` (`home.css:125-131`). It is the only third-person sentence on a
   first-person site, it is the largest type on the page, and at `max-width: 13ch` a
   73-character sentence rags to 7–9 lines past Chrome's `text-wrap: balance` cap.
2. **Promote recognition to a titled section directly below the hero.** The ISEF First Place
   Grand Award currently renders at up to 2.15rem (`home.css:228`) inside an unlabelled `<aside>`
   (`Home.tsx:109`). Make the award the display line; set the *Computers & Graphics* citation
   beside it as a second column. Demote the two white sponsor logos (`home.css:239-247`, the
   highest-contrast objects on the page at 19.05:1) to `--text-faint` mono text, or drop them.
3. **Replace "Keep exploring" with contact.** `Home.tsx:158-170` is currently a duplicate of the
   nav — the fourth copy of site navigation on one page — occupying the closing slot. Add
   `contact: { email, github, linkedin, scholar, cvHref }` to `src/data/site.ts` and render one
   line, three links, one CV PDF. Add a contact column to `Footer.tsx:9-21` and the email to
   About's body. **The values are `TODO(owner)` — see the Inputs section. Build the complete
   structure with placeholder strings; do not invent an address and do not conditionally hide the
   section while it is unpopulated.**
4. **Fix the Home spread's dead space.** `home.css:61-63` — `align-items: start` with a 4/5
   portrait in a `0.82fr` column leaves roughly 640px of void beside the notes and awards at
   900–1200px. `about.css:15-17` already solves this with `position: sticky`; use the same
   solution rather than two answers to one problem.
5. **Copy cleanup.** Cut the domain-triad restatements from five to one (`site.ts:3`,
   `Hero.tsx:410`, `Home.tsx:78`, `Home.tsx:14`, `Home.tsx:42`). Pick one role triad — three
   mutually inconsistent versions ship today. Rename "Open figure →" (`ProjectCard.tsx:57`),
   which is on all six cards including a YouTube channel and a mobile app. Remove the production
   note rendered to visitors at `About.tsx:26-29` ("Portrait reserved / Red backdrop · light blue
   suit"). Fix the alt text at `ProjectCard.tsx:38` and `ProjectDetail.tsx:55`, which repeat the
   adjacent visible heading verbatim.
6. **Re-sequence the homepage for the primary audience.** Current order: Hero → Profile (bio +
   awards buried inside it) → Selected work → Life between projects → Keep exploring. Target
   order: **Hero → Recognition (titled, award as the display line) → Selected work → Life between
   projects → Profile/bio → Contact.** The rationale: the general reader wants "who is this and
   what has he made" before "here is a bio," the photos are what they came for and should not be
   at 75% depth, and the site must end on a way to reach him rather than a duplicate of the nav.
   Keep the *Publications* link prominent in the nav so the secondary audience still lands in one
   click — it must not degrade to a footer-only route.

## Move 3 — Collapse the hand-typed layer into tokens

This barely changes how the site looks. It changes whether it reads as authored. Highest
"not-vibecoded" return per line changed.

1. **Three mono steps, not 15 sizes × 10 trackings.** Add to `:root`:
   `--mono-xs: .68rem` / `.16em`, `--mono-s: .74rem` / `.12em`, `--mono-m: .82rem` / `.08em`.
   Make `.readout` (`global.css:156`) the only mono-label class, with `--strong`/`--quiet`
   variants. Delete `.eyebrow` (`:164`) and `.meta` (`:170`) — all three are currently used by
   **zero** components — and delete every per-component `font-family: var(--font-mono)` block,
   pointing them at the class instead. Note the system contradicts itself in 14 lines today:
   `.readout` is `0.16em` and `.eyebrow`, its own declared alias, is `0.18em`.
2. **Four duration tokens, not 17 literals.** Add beside `--ease`/`--ease-out`
   (`global.css:74-75`): `--dur-1: 120ms` (color/opacity), `--dur-2: 200ms` (hover surfaces,
   arrows), `--dur-3: 320ms` (fills, entrances), `--dur-4: 520ms` (deliberate reveals). Both
   existing easings are decelerate-only, so hover-*out* also decelerates and reads as lag — add
   `--ease-snap: cubic-bezier(0.2, 0, 0, 1)` for hover-in and press, and keep `--ease-out` for
   entrances only. Then retime every duration over 400ms on a hover path:
   `homegallery.css:58` (600ms), `publications.css:85` (550ms),
   `ctiscameramark.css:129/133/137/141/145/149` (620–680ms, plus three raw `ease-out` curves that
   should be `var(--ease)`), `hero.css:190-193` (400ms + a three-inset-shadow paint channel that
   should be dropped), `hero.css:218` (450ms), `global.css:213` (850ms for a 1px divider),
   `global.css:259` (400ms).
3. **One palette.** Apply the `--read-*` reading palette once at `<main>` in `Layout.tsx:31` and
   delete all three per-page remaps (`home.css:8-12`, `projectdetail.css:4-7`, `about.css:2-4`).
   Today the same `ProjectCard` renders `--text-soft: #d2dae4` on Home and `#b2bdcb` on
   Portfolio, and About's h1 is a different white from the h2 forty pixels below it because
   `PageHeader` renders outside the remap (`About.tsx:18` vs `:20`).
4. **Four breakpoints, not nine.** Current set: 560/620/640/680/700/720/760/860/900 — six of
   them inside a 160px band, with no `--bp-*` token. The nav collapses at 760 while the hero band
   collapses at 720, leaving a 40px window where a desktop 3-column band coexists with a
   hamburger. Pick 4, define them once, migrate all 15 media queries.
5. **Honor `--radius: 0px`.** `nav.css:36` sets `border-radius: 12px` on `.nav__brand` — the
   most-seen element on the site contradicting the design system's own token. Also `nav.css:73,
   100` (2px) and the `rx` values in `CTISCameraMark.tsx:19-41` and `GeneratedArt.tsx`.
6. **Pull the 115 stray color literals (92 distinct) into tokens.** `hero.css` alone holds 47.
   `#3fe0cc` ×4, `#93e8dc`, `#a9eee4`, `#80dfd1` and eight alpha variants of
   `rgba(69,226,206,…)` are all `color-mix()` on `--research-bright`. Six near-black surfaces
   (`#05070d`, `#04050a`, `#0f1a2b`, `#10202f`, `#06121a`, `#0d1119`) sit outside the surface
   ramp. `#04140f` (button-on-accent ink) and `#f4f3ef` (figure mat) are cross-file constants
   with no token. `about.css` carries an entire undeclared red sub-palette. Also: `--research`
   and `--history` base tokens are effectively dead (referenced once and zero times), and
   `<meta name="theme-color" content="#090c12">` in `index.html:7` does not match `--bg #080b11`.

## Move 4 — Cut motion by ~60%, and add the one thing missing everywhere

Nine of sixteen motions are unmotivated. Keep five.

**Keep:** the WebGL shader; the CTIS shutter sequence (`ctiscameramark.css:128-190`) — but give it
a `:focus-visible` trigger, since today only a mouse user hovering a 39px logo will ever see the
best-authored 620ms on the site; the button scan fill (once Move 5 fixes it); the section rule
(retimed to `--dur-4`, with the two `transform-origin: center` overrides at `homegallery.css:23`
and `home.css:380` deleted so all four Home rules draw the same direction); the directory row wash.

**Delete:**
- **The auto-cycling wayfinding highlight.** `Hero.tsx:176` (`CYCLE_MS`), `:359-368` (the
  interval and the `active`/`paused` state), `:428` (`${i === active ? "is-active" : ""}`),
  `:419-422, 429-430` (the pause/`setActive` handlers), and the `.is-active` selectors at
  `hero.css:199, 220, 239, 290`. It spotlights one of three primary destinations every 3.4s
  forever with the exact treatment used for `:hover`/`:focus-visible`, so it is indistinguishable
  from real state; `onMouseEnter` writes the hovered index into `active`, so on mouse-out the
  highlight resumes crawling from wherever the cursor last was; touch never pauses it (WCAG
  2.2.2); each tick fires six simultaneous 300–450ms transitions. If a "current" indicator is
  wanted, bind `.is-active` to the actual route.
- **The hero entrance cascade.** `hero.css:68, 92, 126, 141` + the inline
  `animationDelay: "0.05s"` / `"0.18s"` at `Hero.tsx:401, 404` — five staggered on-load fades
  totalling 1.8s, including word-level stagger on a two-word name, with magic numbers as inline
  styles. Nothing is loading.
- **`heroDrift`.** `hero.css:37-52` — a 22s `infinite alternate` translate+scale on three
  `blur(26px)` radial gradients, running perpetually on precisely the GPUs that just failed to
  create a WebGL context. `Hero.tsx:300-306` already knows how to render a static composed frame.
- **Sub-perceptual hover effects:** `publications.css:85-87` (`scale(1.015)` over 550ms on a
  748KB PNG), `homegallery.css:58, 69-72` (`scale(1.025)` + `saturate(1.04)` over 600ms),
  `projectcard.css:33-34` (4–5% filter deltas via a non-composited repaint).
- **`.dir__label`'s `translateX(10px)`** (`home.css:423, 430`) — a 2.2rem heading skating 10px
  sideways on hover, while the row fill and the arrow already say the same thing.
- **Hover states on non-interactive elements:** `.pub:hover { background }`
  (`publications.css:18`) lights a whole publication row as if clickable when only inner buttons
  are; `.pub:focus-visible` (`:19`) styles an `<article>` that can never receive focus;
  `.home-gallery__photo:hover img` (`homegallery.css:69-72`) promises a lightbox on 10 photos
  with no click handler, no `<a>`, and no keyboard path.
- **Dead channels:** `.hero__way-arrow`'s `opacity` transition, which runs between `1` and `1`
  (`hero.css:286, 288, 293`); `backdrop-filter` in the nav's transition list (`nav.css:6`) —
  `none` → `blur(14px)` is not smoothly interpolable, so it is a no-op that forces a re-blur for
  350ms.

**Add — there are currently zero `:active` states in the entire codebase.** All 18 interactive
classes have hover, most have focus, none acknowledges a press, on a site whose design system
calls its buttons "sharp instrument controls". Add once in `global.css` after `:138`:

```css
.btn:active, .pcard__link:active, .dir__row:active, .hero__way:active,
.project__pager-link:active, .nav__link:active, .nav__mobile-link:active,
.nav__toggle:active, .footer__nav a:active, .yt__facade:active {
  transform: translateY(1px);
  transition-duration: 60ms;
}
.btn:active { filter: brightness(0.92); }
```

Also add a hover state to `.nav__toggle` (`nav.css:88-94` has none — it is the only mobile nav
control), and restore a real hover affordance to `.home-work__all`, which explicitly removes its
own underline (`home.css:351-353`) leaving a 4px arrow nudge as the sole feedback.

## Move 5 — Fix the six real bugs

1. **`isolation: isolate` on `.btn`** (`global.css:239`), then `::before { z-index: 0 }` with the
   label above it. Today `::before { z-index: -1 }` on a `position: relative; z-index: auto`
   element is not a stacking context, so the teal fill escapes to the root and paints beneath
   every section background: 100% invisible on `.btn--primary` (its own opaque background covers
   it) and on Home's only CTA (`.home-profile`'s opaque background covers it) — where
   `.btn:hover { color: #04140f }` still fires, turning the label near-black on a dark surface —
   and muddied to a computed **3.31:1** on Publications, where the 55%-opaque `.pub:hover`
   background paints over it. The codebase already uses `isolation: isolate` correctly five times
   (`hero.css:10, 155, 180`, `home.css:73, 397`) and missed the one component that needed it.
   Then retime so the fill always leads the text color, removing the ~100ms flicker where the
   right half of every label is dark-on-dark: `global.css:250` →
   `border-color var(--dur-2) var(--ease), color 160ms var(--ease) 100ms`; `:259` →
   `transform 220ms var(--ease-out)`.
2. **`behavior: "instant"`** at `Layout.tsx:22`, and delete `html { scroll-behavior: smooth }` at
   `global.css:79`. Per CSSOM-View, `behavior: "auto"` means "use the computed `scroll-behavior`",
   not instant — so every route change renders the new page at the old scroll offset and then
   animates upward through unfamiliar content, tripping every `Reveal` observer on the way. The
   only in-page anchor that needs smooth already requests it explicitly at `Layout.tsx:14`. Note
   this bug is invisible when testing with reduced motion on, because `global.css:82` forces
   `auto` there. Separately, Back/Forward loses scroll position entirely (`Layout.tsx:10-23`
   forces `top: 0` on every pathname change) — a `sessionStorage` position map keyed on
   `location.key` would fix it.
3. **The double hairline between every publication.** Each `.pub` is the only child of its own
   `Reveal` wrapper `<div>`, so `.pub:last-child` (`publications.css:16`) matches *every*
   publication and its `border-bottom` lands directly above the next row's `border-top` with no
   margin collapse — a 2px double rule between all rows, on a design system whose stated identity
   is the single hairline. Quick fix: `.pubs > *:last-child .pub { … }`. Better: give `Reveal` an
   `as` prop so it renders the `<article>` itself instead of adding a wrapper, which also fixes
   the deep link landing 20px off target (the scroll position is computed from the
   `translateY(20px)` box).
4. **`width`/`height` on the 10 gallery images.** `HomeGallery.tsx:24` +
   `homegallery.css:55-56` — un-dimensioned lazy images with `height: auto` inside a CSS-columns
   masonry, so each decode repacks all ten items and shifts the following section while the user
   is scrolling through it. Aspect ratios span 3.6× (678×292 to 585×899). Add `w`/`h` to
   `GalleryPhoto` in `src/data/photos.ts` and emit them.
5. **[RESOLVED — 2026-09-03]** No Google Fonts URL remains; Newsreader is a self-hosted
   variable face, Fraunces and JetBrains Mono are gone, and both stacks now carry
   metric-matched `size-adjust` fallbacks (`global.css:41-64`), so swap no longer reflows.
   *Original finding:* **`wght@0,9..144,400..700`** in the `index.html:13` Google Fonts URL. The current
   semicolon-separated discrete weights return static faces pinned to 400/500/600/700, so
   `font-weight: 560` is **inert at 9 sites** (`global.css:120, 191, 272`, `projectcard.css:71`,
   `richblocks.css:15`, `home.css:128, 229, 418`, `publications.css:38`), resolving to 600;
   `520`→500 and `480`→400 likewise. Also consider trimming unused weights (Fraunces 400 and 700
   are requested and never used) and adding a metric-matched `size-adjust` fallback — during swap
   the non-standard weights snap to Georgia bold, so every heading flashes noticeably bolder than
   final.
6. **Focus rings.** `.yt__facade` is `inset: 0` inside `.yt__frame { overflow: hidden }`
   (`youtube.css:8, 22-23`), so the global `outline-offset: 3px` ring is clipped away entirely on
   the only real `<button>` in the content area — add
   `.yt__facade:focus-visible { outline: 2px solid var(--focus); outline-offset: -4px }`. And
   unify `.hero__way:focus-visible`'s `#93e8dc` (`hero.css:206`) to `var(--focus)`: it is a
   second focus color, drawn inset over a live WebGL field that is bright teal in places, so
   focus visibility varies over time.

## Move 6 — Assets, sharing, and hardening

> **DO THIS MOVE FIRST.** Items 1–4 were originally ranked as hygiene against an academic-first
> audience. For a general-public audience they are the highest-impact work on the entire list:
> a blank share-link preview, 3.12MB of images on cellular, a near-white flash on every card, and
> sub-44px tap targets are exactly what the primary visitor experiences.

1. **Images are ~97% of page weight.** 4.56MB deployed; 3.12MB on `/` alone against 102kB gzip of
   code. Zero webp/avif, zero `srcset`, no `fetchpriority` on the LCP image. Resize the two
   1800×1200 gallery photos (648KB, 476KB) to ~720px for a column that is at most 240px, and
   convert the three photographic PNGs out of PNG: `publication-vessel-transformer.png` (748KB),
   `msst.png` (544KB), `aigro.png` (236KB).
2. **Stop the near-white flash.** `SmartImage.tsx:36-37` applies `#f4f3ef` to the wrapper for the
   5 of 6 projects using `imageFit: "contain"`, so large near-white rectangles hold on the
   near-black page until each lazy image decodes — and the 900ms scan wipe ceremoniously reveals
   an empty white box. Use `var(--surface-2)` on the wrapper, apply the light mat only to the
   loaded `<img>` (`:64`), and add `onLoad` → opacity 0→1. Same at `publications.css:65`.
3. **Every shared link renders a blank card.** `og:image` and `twitter:image` are absent
   repo-wide while `SEO.tsx:23` sets `twitter:card=summary_large_image`. And because
   `scripts/build-pages.mjs` only copies `index.html` → `404.html` with no prerendering, every
   route ships the same static `<title>Michael Hua</title>` and one generic description —
   `SEO.tsx` runs client-side only. *Fix:* wire `og:image`/`twitter:image` in `SEO.tsx` at
   `public/images/og-default.jpg` (**1200×630**), and extend `scripts/build-pages.mjs` — currently
   6 lines that only `copyFile` `index.html` → `404.html` — to emit per-route `<title>`,
   description, and `og:*` tags at build time for `/`, `/portfolio`, `/publications`, `/about`, and
   each `/portfolio/:slug`. The per-route metadata already exists in `SEO.tsx` and the data files;
   it just never reaches the static HTML. **The image asset itself is a `TODO(owner)` — see the
   Inputs section. Do not generate a synthetic one.**
4. **Touch targets.** `.nav__toggle` is 36px tall (`nav.css:88-95`) and is the only mobile
   navigation control; `.footer__nav a` is ~21px with zero padding (`footer.css:32-38`);
   `.home-work__all` is ~20px (`home.css:338-348`) and is the "All projects →" CTA;
   `.btn` is ~40px. Raise to ≥44px.
5. **Hardening.** Wrap `Layout.tsx:12`'s `document.querySelector(hash)` in a try/catch — a URL
   ending in a bare `#` throws `SyntaxError`, and with no error boundary in `App.tsx` React
   unmounts the root and the user gets a blank page. Add that error boundary. Drop
   `aria-hidden="true"` from `GeneratedArt.tsx:182-183`, which currently coexists with
   `role="img"` so the error path replaces a described `<img>` with content invisible to
   assistive tech, destroying the alt text. Add an `onError` fallback to the homepage portrait
   (`Home.tsx:66-73`), which has none while the identical About portrait does. Replace the five
   non-reactive `matchMedia` reads (`useInView.ts:14`, `Reveal.tsx:19`, `ProjectCard.tsx:25`,
   `Hero.tsx:200, 362`) with one subscribed `usePrefersReducedMotion()` hook.
6. **Hero shader cost.** `Hero.tsx:326-330` — `onVis` calls `startLoop()` whenever the tab
   regains focus even when the hero is scrolled out of view, so returning to a tab parked at the
   bottom of Home restarts the shader permanently; track the IntersectionObserver state and gate
   on it. `Hero.tsx:259-264` calls `getBoundingClientRect()` on **every** `pointermove` across a
   full-viewport surface while a 45-noise-op/pixel shader runs — cache the rect in `resize()`,
   which already computes it at `:243`, and add `{ passive: true }` to the three pointer
   listeners. Debounce `onResize` (`:315`) to a rAF — it currently reallocates the WebGL backing
   store on every event, including mobile URL-bar show/hide. And `@keyframes scanSweep`
   (`global.css:308-314`) animates `left: 0 → 100%`, forcing layout every frame across up to 9
   instances — use `transform: translateX()`.

---

---

# Appendix A — Additional verified findings

These were verified during the review but appear above only inside a score-table cell or a prose
paragraph, so a reader working from the six moves would miss them. **All are in scope.** Fold them
into whichever move they belong to (noted per item).

**A1. The hero is misaligned with the rest of the page by 4px. — Move 3**
`--gutter: clamp(20px, 4.5vw, 56px)` (`global.css:69`), but `hero.css:81` uses
`clamp(22px, 5vw, 56px)`, and so do `--wayfind-gutter` (`hero.css:152`) and the mobile menu
(`nav.css:117`). At an 800px viewport the container gutter computes to 36px and the hero's to 40px,
so **the hero title's left edge and the nav brand's left edge sit 4px apart across roughly the
entire 440–1244px range**, and on mobile the menu links are indented 4px past the brand directly
above them. *Fix:* delete the three bespoke clamps and use `var(--gutter)` everywhere.

**A2. The project-detail gallery has a hardcoded per-index layout against a variable array. — Move 5**
`projectdetail.css:128-137` defines `.project__gallery-photo--1` through `--4` on a 12-column grid,
but `isef2026Photos` (`photos.ts:6-19`) has **3** items. `--3` gets `grid-column: 1 / span 5`, so
columns 6–12 of row 2 are empty — a 7-column hole. Adding a 5th photo yields no rule at all and it
falls to `auto`, breaking the composition. *Fix:* replace the per-index rules with a layout that
works for any count (an `auto-fit` grid, or `:nth-child` patterns that cycle).

**A3. Vestigial selectors from prior iterations. — Move 3**
Dead code that is a strong "iteratively machine-edited" fingerprint. Delete all of it:
`home.css:319-331` — a `.pcard:nth-child(1)` "first card is bigger" override whose declarations are
**identical to the base rule beside it**; `projectdetail.css:165-166` — the second selector is a
strict subset of the first; `hero.css:71` — `.hero__hud--tl`, the only modifier of a set whose
`--tr`/`--br` siblings never existed (removed anyway by Move 1); `hero.css:162` +
`hero.css:305` — `opacity: 1` plus an `animation: none` reset on an element with no animation;
`hero.css:128-131` — `.hero__word--accent` sets `#f6f9fc` against the parent's `#f5f8fb` (visually
identical) and `-0.045em` against `-0.035em`, so **the two words of the name have different
tracking**; `publications.css:19` — `.pub:focus-visible` on an `<article>` that can never receive
focus.

**A4. Seven bespoke grid ratios and four vertical rhythms, no shared scale. — Move 3**
Grids: `minmax(280px,0.82fr) minmax(0,1.18fr)` (`home.css:61`),
`minmax(170px,0.6fr) minmax(0,1.4fr)` (`:186`), `minmax(116px,0.36fr) minmax(0,1fr)` (`:158`),
`minmax(230px,0.7fr) minmax(0,1.3fr)` (`:295`),
`minmax(140px,0.5fr) minmax(0,1.4fr) auto auto` (`:388`),
`64px minmax(0,1fr) minmax(220px,0.48fr)` (`publications.css:9`),
`minmax(0,1fr) minmax(240px,0.7fr)` (`projectdetail.css:87`). Rhythms: `.section`
`clamp(72,10vw,132)` / `.section--tight` `clamp(48,6vw,84)` (`global.css:152-153`), `.pageheader`
`clamp(72,11vw,148)` (`pageheader.css:3-4`), `.project__inner` `clamp(60,8vw,112)`
(`projectdetail.css:12-13`), `.notfound` `clamp(88,16vw,184)` (`notfound.css:1`). *Fix:* one
spacing scale in `:root`; reduce the grid ratios to a small reusable set. Credit where due: every
grid correctly uses `minmax(0, …)` on the flexible track, which prevents the classic blowout —
preserve that.

**A5. Interior pages open centered while Home is left-flush, and the "one system" is overridden three ways. — Move 2**
`pageheader.css:6-11` sets `align-items: center; text-align: center`, so Portfolio, Publications
and About all open on a different axis from Home. `SectionHead` — whose own comment at
`global.css:180` claims "one deliberate system, reused everywhere" — is overridden by
`home.css:366-372` (flex column, centered), `homegallery.css:10-14` (flex, `space-between`, plus
`transform-origin: center` on the rule under a left-flush title), and carries **three different
title sizes**: 3.4rem (`home.css:56`), 3.5rem (`:277`), 3.7rem italic (`homegallery.css:16-19`).
Also `home.css:436` — `.dir__desc { text-align: center }` centers the middle cell of a left-flush
four-cell row, which is an outright error. *Fix:* pick one axis per page type, one title ramp, and
delete the overrides.

**A6. Six `measure` values; the token is used three times. — Move 3**
`--measure: 68ch` (`global.css:67`) is honored at `pageheader.css:35`, `richblocks.css:1`,
`publications.css:52`. Everything else invents its own: `48ch` (`homegallery.css:26`), `52ch`
(`hero.css:135`), `58ch` (`about.css:89`), `60ch` (`home.css:140`), `62ch` (`portfolio.css:6`),
`28ch` (`home.css:321`). At the wide end `.rb-p` is `1.14rem / 1.78 / 68ch` ≈ **76 characters per
line**, above the 45–75 comfort band. *Fix:* two tokens — a prose measure (~66ch) and a lede
measure (~52ch) — and use them.

**A7. [RESOLVED — 2026-09-03] Three type families, and one of them may be redundant.**
Settled the way this finding pointed: Fraunces was dropped and Newsreader now carries both display
and prose (`--font-display` and `--font-body` are the same stack, `global.css:115-116`), with IBM
Plex Mono replacing JetBrains Mono as the instrument voice. Two families, no unused weights.
*Residual, needs a binary:* the italic is **not** loaded, so `.hero__lede em`, `.rb-cite`, and
`.about__portrait-mark` (7rem) render a synthesized oblique. *Original finding:*
Fraunces (display serif) + Newsreader (reading serif) + JetBrains Mono. The mono is fully justified
by the concept. **Fraunces + Newsreader is the weak seam:** their roles overlap, and `.rb-cite`
(body serif italic, `richblocks.css:47-49`) and `.pub__title` (display serif) read as the same
voice at different sizes. Fraunces already loads an `opsz 9..144` range and could carry body copy at
`opsz ~18`, removing a family and collapsing the ambiguity. Also: **Fraunces 400 and 700 are
requested in the font URL and never used** — the highest display weight in the codebase is 650
(`hero.css:264`). *Action:* drop the unused weights from the URL regardless (that part is
unambiguous); raise dropping Newsreader as a proposal rather than doing it unilaterally.

**A8. No empty states anywhere. — Move 5**
`Home.tsx:47` `projects.slice(0,3)` with an empty array renders `.home-work__grid` as a lone
`border-top` hairline (`home.css:284`) with a live "All projects →" link to an empty page.
`Publications.tsx:24` renders nothing. `HomeGallery.tsx:20` renders the section head and intro with
`note="0 frames"` — a header describing nothing. `ProjectDetail.tsx:68` is the one place that
guards correctly (`project.gallery && length > 0`) — copy that pattern.

**A9. Three mutually inconsistent role triads, and mixed grammatical person. — Move 2 item 5**
The triads: `"Student researcher · Software developer · Documentary filmmaker"` (`site.ts:3`),
`"Researcher · Developer · Storyteller"` (`Home.tsx:78`), and a third implied by `profileNotes`
(`Home.tsx:12-16`). **Pick one — this is the owner's call** (note that *"Storyteller"* is the
softest and most cliché word on the site). Voice: the site is first person in `Hero.tsx:410` and in
every project body, and third person in `site.ts:11-12`, `Home.tsx:80-82`, and `Home.tsx:88-91`.
*Fix:* first person throughout; the 4.5rem third-person aphorism is deleted by Move 2 item 1
anyway.

**A10. About is strictly poorer than the Home section that links to it. — Move 2**
About renders `PageHeader` + one h2 + `bio[0..1]` + `about-portrait.jpg` with the **same alt string**
as Home (`About.tsx:34` vs `Home.tsx:69`). Home's Profile already contains `bio[0]`, a second
paragraph, a 3-row `<dl>`, and the awards — so `"More about Michael →"` (`Home.tsx:104`) **demotes
the visitor**, and the site's only photo of its subject appears twice with identical alt text.
*Fix:* give About the material Home does not carry (fencing / ACA TVC / service, a dated timeline,
the contact block), reduce Home's Profile to one paragraph, and either crop About's portrait
differently or drop the duplicate. **The content split is the owner's call — see Inputs.**

---

# Appendix B — How to verify

1. **`npm run build`** (`tsc -b && vite build && node scripts/build-pages.mjs`) and **`npm run
   lint`** (oxlint) must both stay at **zero errors and zero warnings** — that is the current state,
   so any new output is a regression you introduced.
2. **This review contains no rendered-pixel evidence.** No browser automation was available, so
   every layout claim was computed from CSS. Before and after changing them, **look at the page**
   at 390px, 768px, 1024px, and 1440px. The claims most worth confirming visually: the ~640px of
   dead space beside the Home portrait at 900–1200px (Move 2 item 4), the `.hero__way-desc`
   truncation across 720–1200px (Move 5 area), the 4px hero/nav gutter offset (A1), and the
   7-column hole in the project gallery (A2).
3. **Check the states, not just the happy path:** keyboard-only tab through each page with visible
   focus; `prefers-reduced-motion: reduce` enabled (content must stay visible — it currently does,
   in all four motion subsystems; do not regress this); a slow-network throttle to watch image
   loading; and `/portfolio/does-not-exist` for the 404 path.
4. **Do not regress the things listed under *What's Working*.** In particular: the WebGL lifecycle
   gating and teardown, the YouTube facade, the reveal-once-and-disconnect behavior, listener
   cleanup, and `aria-hidden` discipline on decorative elements. All were verified clean.
5. **Report every `TODO(owner)` you leave**, and every item you chose not to do, with the reason.

---

# Open questions for the owner (not for the implementing agent to decide)

1. If the shader were deleted tomorrow, what on this site would still be unmistakably about
   hyperspectral imaging? Today: the camera mark and one project title.
2. The strongest sentence available is "First Place Grand Award — Regeneron ISEF 2026, Robotics &
   Intelligent Machines." It is currently 2.15rem in an unlabelled aside next to a Midjourney
   logo. What does the homepage look like if that is the largest type and the shader is second?
3. The ten candid photos are the only place the person appears rather than the résumé, and they
   are the last thing before the footer. For an audience of friends, family, and community, should
   they be much earlier — and do they want captions?
4. Four copies of the site's own navigation, zero ways to contact its subject. What is the next
   action wanted from a family member, a classmate, and (occasionally) a recruiter — and where
   does each one take it?
5. What is at 100% scroll depth that a visitor would screenshot or forward? Right now: a duplicate
   table of contents and a copyright line. This matters more than it looks: the primary audience
   arrives through shared links, so the site's shareable moment is load-bearing.
6. Every project claims to beat existing methods and not one shows a number (`projects.ts:84`,
   `:120`). Downgraded under the general-public brief, but still open: is there one real figure per
   project you'd want in the prose on the detail page?
