# Images

Drop your original images from the Google Site into **this folder** using the
exact filenames below. Until a file exists, the site shows an on-theme
“Image unavailable” state rather than substituting generated artwork.

## Filenames the site looks for

Project cards / detail pages:

| File | Used for |
| --- | --- |
| `decoding-light.jpg` | Decoding Light |
| `brain-vessel.png` | Novel Multi-Scale Knowledge Transfer Transformer (3D Brain Vessel Segmentation) |
| `msst.webp` | Novel MSST Transformer (Hyperspectral Imaging in Plant Growth Modeling) |
| `aigro.webp` | AIGRO |
| `nhd.jpg` | 2025 National History Day |
| `historys-trigger.jpg` | History's Trigger |

Publication and competition paper previews:

| File | Used for |
| --- | --- |
| `publication-vessel-transformer.webp` | Computers & Graphics vessel-segmentation paper |
| `publication-msst.png` | MSST competition paper |
| `nhd-paper.png` | National History Day process paper |

About page photos:

| File | Used for |
| --- | --- |
| `about-portrait.webp` | About — red-background portrait in the light blue suit (vertical, ~3:4) |

Gallery photos are stored in `public/images/gallery/`. The homepage includes two
intentional placeholders, so future candid images can be added without changing
the overall composition.

Award logos are stored in `public/images/logos/`. `regeneron-isef.webp` is an
optimized copy of the logo supplied in the official
[Society for Science media kit](https://www.societyforscience.org/isef-2024-media-kit/).

## How to get the originals from Google Sites

1. Open your Google Site.
2. Right-click each image → **Open image in new tab** (or **Save image as…**).
3. Save it here with the matching filename above.

`.jpg`, `.png`, and `.webp` all work — just keep the base name (e.g. `aigro.png`
is fine if you update the extension in `src/data/projects.ts`, otherwise rename
to `aigro.jpg`). `.webp` is recommended for smaller files.

## Social sharing

TODO(owner): supply a genuine `og-default.jpg` image at 1200×630. The metadata
is already wired to `public/images/og-default.jpg`; do not substitute generated art.
