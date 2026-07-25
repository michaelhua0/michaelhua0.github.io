export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
  meta: string;
}

export const isef2026Photos: GalleryPhoto[] = [
  {
    src: "gallery/isef-acm-award-2026.jpg",
    alt: "Michael Hua and fellow ACM Special Award recipients onstage at Regeneron ISEF 2026",
    caption: "ACM Special Award recipients",
    meta: "Regeneron ISEF · 2026",
  },
  {
    src: "gallery/isef-midjourney-award-2026.jpg",
    alt: "Michael Hua and fellow Midjourney Special Award recipients onstage at Regeneron ISEF 2026",
    caption: "Midjourney Special Award recipients",
    meta: "Regeneron ISEF · 2026",
  },
  {
    src: "gallery/isef-midjourney-stage-2026.jpg",
    alt: "A second view of the Midjourney Special Award recipients at Regeneron ISEF 2026",
    caption: "One more from the award stage",
    meta: "Phoenix · May 2026",
  },
  {
    src: "gallery/isef-midjourney-selfie-2026.jpg",
    alt: "Michael Hua taking a lighthearted selfie with a Midjourney representative at Regeneron ISEF 2026",
    caption: "A quick photo after the ceremony",
    meta: "Phoenix · May 2026",
  },
];

/* Candid moments. Each is its own tightly-cropped file, so the gallery grid
   stays clean and new photos can simply be appended. */
export const momentsPhotos: GalleryPhoto[] = [
  {
    src: "gallery/moment-fencing.jpg",
    alt: "Michael Hua in fencing gear holding a saber",
    caption: "Saber fencing",
    meta: "Portrait",
  },
  {
    src: "gallery/moment-isef-group.jpg",
    alt: "Michael Hua with friends beneath the Regeneron ISEF welcome sign",
    caption: "Regeneron ISEF",
    meta: "With friends",
  },
  {
    src: "gallery/moment-brain-poster.jpg",
    alt: "Michael Hua presenting his brain vessel segmentation research poster",
    caption: "Brain vessel segmentation",
    meta: "Poster session",
  },
  {
    src: "gallery/moment-history-award.jpg",
    alt: "Michael Hua holding his Michigan History Day National Finalist award",
    caption: "Michigan History Day",
    meta: "National Finalist",
  },
  {
    src: "gallery/moment-research-talk.jpg",
    alt: "Michael Hua presenting his research to an audience in a lecture hall",
    caption: "Research talk",
    meta: "Presentation",
  },
  {
    src: "gallery/moment-jshs-friends.jpg",
    alt: "Michael Hua and two friends posing with playful props at JSHS",
    caption: "JSHS with friends",
    meta: "Competition day",
  },
  {
    src: "gallery/moment-msst-poster.jpg",
    alt: "Michael Hua standing beside his hyperspectral imaging research poster",
    caption: "Hyperspectral imaging",
    meta: "Poster session",
  },
];

/* The Home gallery is a single flat, uniform grid. Order interleaves subjects
   for visual variety; append new GalleryPhoto entries and the grid reflows. */
export const homeGalleryItems: GalleryPhoto[] = [
  momentsPhotos[0], // fencing
  momentsPhotos[1], // isef group
  momentsPhotos[2], // brain poster
  momentsPhotos[3], // history award
  momentsPhotos[4], // research talk
  momentsPhotos[5], // jshs friends
  momentsPhotos[6], // msst poster
  isef2026Photos[0], // acm award
  isef2026Photos[3], // midjourney selfie
  isef2026Photos[1], // midjourney award
  isef2026Photos[2], // midjourney stage
];
