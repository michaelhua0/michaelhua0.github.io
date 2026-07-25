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
    alt: "Michael Hua in fencing gear holding a saber",
    caption: "Saber fencing",
    meta: "Portrait",
  },
  {
    src: "gallery/moments-collage-1.jpg",
    alt: "Michael Hua presenting a brain vessel segmentation research poster",
    caption: "Research presentation",
    meta: "Computer vision",
  },
  {
    src: "gallery/moments-collage-1.jpg",
    alt: "Michael Hua presenting his research in a lecture hall",
    caption: "Research talk",
    meta: "Presentation",
  },
  {
    src: "gallery/moments-collage-1.jpg",
    alt: "Michael Hua standing beside his hyperspectral imaging research poster",
    caption: "Poster session",
    meta: "Hyperspectral imaging",
  },
  {
    src: "gallery/moments-collage-2.jpg",
    alt: "Michael Hua with friends at Regeneron ISEF",
    caption: "Regeneron ISEF",
    meta: "Friends",
  },
  {
    src: "gallery/moments-collage-2.jpg",
    alt: "Michael Hua holding his Michigan History Day National Finalist award",
    caption: "Michigan History Day",
    meta: "National Finalist",
  },
  {
    src: "gallery/moments-collage-2.jpg",
    alt: "Michael Hua and two friends posing with playful props at JSHS",
    caption: "JSHS with friends",
    meta: "Competition day",
  },
];

export type HomePhotoCrop =
  | "fencing"
  | "brain-poster"
  | "research-talk"
  | "msst-poster"
  | "isef-group"
  | "history-award"
  | "jshs-friends";

export type HomeGalleryItem =
  | {
      kind: "photo";
      id: string;
      photo: GalleryPhoto;
      layout:
        | "feature"
        | "candid"
        | "portrait-left"
        | "research-wide"
        | "talk-wide"
        | "portrait-right"
        | "tile-left"
        | "tile-center"
        | "tile-right";
      crop?: HomePhotoCrop;
    }
  | {
      kind: "placeholder";
      title: string;
      note: string;
      layout: "left" | "right";
    };

export const homeGalleryItems: HomeGalleryItem[] = [
  { kind: "photo", id: "isef-selfie", photo: isef2026Photos[3], layout: "feature" },
  { kind: "photo", id: "acm-award", photo: isef2026Photos[0], layout: "candid" },
  {
    kind: "photo",
    id: "fencing",
    photo: momentsPhotos[0],
    layout: "portrait-left",
    crop: "fencing",
  },
  {
    kind: "photo",
    id: "brain-poster",
    photo: momentsPhotos[1],
    layout: "research-wide",
    crop: "brain-poster",
  },
  {
    kind: "photo",
    id: "research-talk",
    photo: momentsPhotos[2],
    layout: "talk-wide",
    crop: "research-talk",
  },
  {
    kind: "photo",
    id: "msst-poster",
    photo: momentsPhotos[3],
    layout: "portrait-right",
    crop: "msst-poster",
  },
  {
    kind: "photo",
    id: "isef-group",
    photo: momentsPhotos[4],
    layout: "tile-left",
    crop: "isef-group",
  },
  {
    kind: "photo",
    id: "history-award",
    photo: momentsPhotos[5],
    layout: "tile-center",
    crop: "history-award",
  },
  {
    kind: "photo",
    id: "jshs-friends",
    photo: momentsPhotos[6],
    layout: "tile-right",
    crop: "jshs-friends",
  },
  {
    kind: "placeholder",
    title: "The next candid",
    note: "Reserved for an unplanned, genuinely good moment.",
    layout: "left",
  },
  {
    kind: "placeholder",
    title: "More soon",
    note: "A place for travel, fencing, friends, and work in progress.",
    layout: "right",
  },
];
