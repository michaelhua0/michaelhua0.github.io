import { siteIdentity } from "./routeMetadata.js";

export const site = {
  ...siteIdentity,
  role: "Student researcher · Software developer · Documentary filmmaker",
  contact: {
    email: "michaelhua2009@gmail.com",
  },
};

/** The two biographical paragraphs shared by Home and About. */
export const bio: string[] = [
  "I am a student at Cranbrook Schools whose work connects computer science, scientific research, and historical inquiry. I develop artificial intelligence systems for hyperspectral and medical imaging, build software that translates research into practical tools, and produce documentary projects grounded in historical research.",
  "I received a First Place Grand Award at Regeneron ISEF and recognition from the National Junior Science and Humanities Symposium. Outside the lab, I compete in saber fencing at the national level and serve as co-president of the Association of Chinese Americans Teen Volunteer Council (ACA TVC).",
];
