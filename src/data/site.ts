export const site = {
  name: "Michael Hua",
  role: "Student researcher · App developer · Documentary creator",
  url: "https://michaelhua.example", // update to your deployed domain
  description:
    "Michael Hua — interdisciplinary student researcher in computer science, app developer, national STEM competition winner, and award-winning documentary creator.",
};

/** The two biographical paragraphs, shared by Home and About (verbatim). */
export const bio: string[] = [
  "Michael Hua is currently a Junior at Cranbrook Schools. He is an interdisciplinary student passionate about connecting science, history, and community impact. Michael is a student researcher in computer science, app developer, winner in national STEM competitions, and award-winning documentary creator.",
  "In his free time, Michael enjoys playing the sport of fencing. He is a national-level saber fencer and an active volunteer dedicated to community service.",
];

/** About-page photos. Drop files into /public/images; missing ones fall back to generated art. */
export const aboutPhotos = [
  { src: "about-1.jpg", alt: "Michael Hua", motif: "point-cloud" as const },
  { src: "about-2.jpg", alt: "Michael Hua", motif: "spectral" as const },
  { src: "about-3.jpg", alt: "Michael Hua", motif: "vessel" as const },
];
