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

export const momentsPhotos: GalleryPhoto[] = [
  {
    src: "gallery/moments-collage-1.jpg",
    alt: "A collage of Michael fencing, presenting research posters, and speaking about his work",
    caption: "Posters, presentations, and a little saber fencing",
    meta: "Selected moments",
  },
  {
    src: "gallery/moments-collage-2.jpg",
    alt: "A collage of Michael with friends at ISEF and JSHS and receiving history recognition",
    caption: "Competition days are better with good company",
    meta: "Friends · Research · History",
  },
];

export type HomeGalleryItem =
  | {
      kind: "photo";
      photo: GalleryPhoto;
      layout: "feature" | "candid" | "secondary" | "panorama" | "strip";
    }
  | {
      kind: "placeholder";
      title: string;
      note: string;
      layout: "small" | "wide";
    };

export const homeGalleryItems: HomeGalleryItem[] = [
  { kind: "photo", photo: isef2026Photos[3], layout: "feature" },
  { kind: "photo", photo: isef2026Photos[0], layout: "candid" },
  { kind: "photo", photo: momentsPhotos[0], layout: "panorama" },
  { kind: "photo", photo: isef2026Photos[1], layout: "secondary" },
  {
    kind: "placeholder",
    title: "The next candid",
    note: "Reserved for an unplanned, genuinely good moment.",
    layout: "small",
  },
  {
    kind: "placeholder",
    title: "More soon",
    note: "A place for travel, fencing, friends, and work in progress.",
    layout: "wide",
  },
  { kind: "photo", photo: momentsPhotos[1], layout: "strip" },
];
