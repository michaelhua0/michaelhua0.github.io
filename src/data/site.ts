export const site = {
  name: "Michael Hua",
  role: "Student researcher · Software developer · Documentary filmmaker",
  url: "https://michaelhua0.github.io",
  description:
    "Michael Hua is a student researcher and software developer whose work spans artificial intelligence, hyperspectral imaging, medical computer vision, and documentary history.",
};

/** The two biographical paragraphs shared by Home and About. */
export const bio: string[] = [
  "Michael Hua is a student at Cranbrook Schools whose work connects computer science, scientific research, and historical inquiry. He develops artificial intelligence systems for hyperspectral and medical imaging, builds software that translates research into practical tools, and produces documentary projects grounded in historical research.",
  "His research has earned a First Place Grand Award at Regeneron ISEF and recognition from the National Junior Science and Humanities Symposium. Outside his academic work, Michael competes in saber fencing at the national level and volunteers in his community.",
];

/** About-page photos. Drop files into /public/images; missing ones fall back to generated art. */
export const aboutPhotos = [
  { src: "about-1.jpg", alt: "Michael Hua", motif: "point-cloud" as const },
  { src: "about-2.jpg", alt: "Michael Hua", motif: "spectral" as const },
  { src: "about-3.jpg", alt: "Michael Hua", motif: "vessel" as const },
];
