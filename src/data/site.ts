import { siteIdentity } from "./routeMetadata.js";

export const site = {
  ...siteIdentity,
  role: "Student researcher · Software developer · Documentary filmmaker",
};

/** The two biographical paragraphs shared by Home and About. */
export const bio: string[] = [
  "Michael Hua is a student at Cranbrook Schools whose work connects computer science, scientific research, and historical inquiry. He develops artificial intelligence systems for hyperspectral and medical imaging, builds software that translates research into practical tools, and produces documentary projects grounded in historical research.",
  "Michael received a First Place Grand Award at Regeneron ISEF and recognition from the National Junior Science and Humanities Symposium. Outside the lab, he competes in saber fencing at the national level and serves as co-president of the Association of Chinese Americans Teen Volunteer Council (ACA TVC).",
];
