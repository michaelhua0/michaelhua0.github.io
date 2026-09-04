import type { ResponsiveImageSource } from "../lib/images";

export interface GalleryPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  sources?: ResponsiveImageSource[];
}

const gallerySources = (name: string, fullWidth: number): ResponsiveImageSource[] => {
  const widths = [360, 720, fullWidth].filter(
    (width, index, values) => width <= fullWidth && values.indexOf(width) === index,
  );
  return widths.map((width) => ({
    src: `gallery/${name}${width === fullWidth ? "" : `-${width}`}.webp`,
    width,
  }));
};

export const isef2026Photos: GalleryPhoto[] = [
  {
    src: "gallery/isef-acm-award-2026.webp",
    sources: gallerySources("isef-acm-award-2026", 1200),
    width: 1200,
    height: 800,
    alt: "Michael Hua and fellow ACM Special Award recipients onstage at Regeneron ISEF 2026",
  },
  {
    src: "gallery/isef-midjourney-award-2026.webp",
    sources: gallerySources("isef-midjourney-award-2026", 1200),
    width: 1200,
    height: 800,
    alt: "Michael Hua and fellow Midjourney Special Award recipients onstage at Regeneron ISEF 2026",
  },
  {
    src: "gallery/isef-midjourney-selfie-2026.webp",
    sources: gallerySources("isef-midjourney-selfie-2026", 1200),
    width: 1200,
    height: 900,
    alt: "Michael Hua taking a lighthearted selfie with a Midjourney representative at Regeneron ISEF 2026",
  },
];

/* Candid moments. Each is its own tightly-cropped file, so the gallery grid
   stays clean and new photos can simply be appended. */
export const momentsPhotos: GalleryPhoto[] = [
  {
    src: "gallery/moment-fencing.webp",
    sources: gallerySources("moment-fencing", 585),
    width: 585,
    height: 899,
    alt: "Michael Hua in fencing gear holding a saber",
  },
  {
    src: "gallery/moment-isef-group.webp",
    sources: gallerySources("moment-isef-group", 605),
    width: 605,
    height: 465,
    alt: "Michael Hua with friends beneath the Regeneron ISEF welcome sign",
  },
  {
    src: "gallery/moment-brain-poster.webp",
    sources: gallerySources("moment-brain-poster", 553),
    width: 553,
    height: 429,
    alt: "Michael Hua presenting his brain vessel segmentation research poster",
  },
  {
    src: "gallery/moment-history-award.webp",
    sources: gallerySources("moment-history-award", 420),
    width: 420,
    height: 465,
    alt: "Michael Hua holding his Michigan History Day National Finalist award",
  },
  {
    src: "gallery/moment-research-talk.webp",
    sources: gallerySources("moment-research-talk", 492),
    width: 492,
    height: 255,
    alt: "Michael Hua presenting his research to an audience in a lecture hall",
  },
  {
    src: "gallery/moment-jshs-friends.webp",
    sources: gallerySources("moment-jshs-friends", 566),
    width: 566,
    height: 419,
    alt: "Michael Hua and two friends posing with playful props at JSHS",
  },
  {
    src: "gallery/moment-msst-poster.webp",
    sources: gallerySources("moment-msst-poster", 619),
    width: 619,
    height: 678,
    alt: "Michael Hua standing beside his hyperspectral imaging research poster",
  },
];

/* The Home gallery uses a masonry layout that preserves each photo's aspect
   ratio. Order interleaves subjects for visual variety. */
export const homeGalleryItems: GalleryPhoto[] = [
  momentsPhotos[0], // fencing
  momentsPhotos[1], // isef group
  momentsPhotos[2], // brain poster
  momentsPhotos[3], // history award
  momentsPhotos[4], // research talk
  momentsPhotos[5], // jshs friends
  momentsPhotos[6], // msst poster
  isef2026Photos[0], // acm award
  isef2026Photos[2], // midjourney selfie
  isef2026Photos[1], // midjourney award
];
