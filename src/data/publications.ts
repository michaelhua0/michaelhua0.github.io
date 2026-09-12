import type { ResponsiveImageSource } from "../lib/images";

export interface Publication {
  id: string;
  index: number;
  title: string;
  category: "research" | "history";
  journal?: string;
  image: string;
  imageSources?: ResponsiveImageSource[];
  imageAlt: string;
  links: { label: string; href: string }[];
  copy: string[];
}

export const publications: Publication[] = [
  {
    id: "vessel-transformer",
    index: 1,
    category: "research",
    title:
      "Multi-scale Knowledge Transfer Vision Transformer for 3D Vessel Shape Segmentation",
    journal: "Computers & Graphics, Volume 122, August 2024",
    image: "publication-vessel-transformer.webp",
    imageSources: [
      { src: "publication-vessel-transformer-464.webp", width: 464 },
      { src: "publication-vessel-transformer.webp", width: 928 },
    ],
    imageAlt: "First page of the vessel shape segmentation paper in Computers and Graphics",
    links: [
      {
        label: "Journal article",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0097849324001110#preview-section-cited-by",
      },
      {
        label: "Manuscript",
        href: `${import.meta.env.BASE_URL}documents/vessel-transformer-2024.pdf`,
      },
    ],
    copy: [
      "This peer-reviewed paper presents a Multi-Scale Knowledge Transfer Convolutional Transformer for 3D cerebral-vessel segmentation in in vivo MRI. The architecture combines convolutional feature extraction, transformer encoders, and cross-scale knowledge transfer to improve segmentation at lower image resolutions. The method supports vascular visualization and quantitative analysis in medical-imaging research.",
      "I developed this work for my 2024 research project, which qualified for Regeneron ISEF and the National Junior Science and Humanities Symposium. I presented the paper at Shape Modeling International in Detroit in July 2024 to expert researchers in computer vision and graphics.",
    ],
  },
  {
    id: "msst-paper",
    index: 2,
    category: "research",
    title:
      "MSST Transformer: A Novel Multimodal Spatial-Spectral-Temporal Transformer for Time-series Hyperspectral Imaging in Plant Growth Modeling",
    image: "publication-msst.png",
    imageAlt: "Title page of the MSST Transformer competition paper",
    links: [
      {
        label: "Manuscript",
        href: `${import.meta.env.BASE_URL}documents/msst-transformer-2025.pdf`,
      },
    ],
    copy: [
      "This paper introduces a multimodal spatial-spectral-temporal transformer for plant-growth modeling. The model integrates hyperspectral imagery, environmental light measurements, and longitudinal features to estimate biomass and characterize early growth under different conditions. The work supports precision control in vertical farming and other urban-agriculture systems.",
      "I submitted the paper to the 2025 Junior Science and Humanities Symposium. The project placed fifth at Michigan JSHS and advanced to the National JSHS competition.",
    ],
  },
  {
    id: "chemosensory-grounding",
    index: 3,
    category: "research",
    title:
      "Enabling and Scaling Chemosensory Grounding in Egocentric Infant Video via a Dual-Memory Human-in-the-Loop Deep Learning Framework",
    image: "publication-chemosensory-928.webp",
    imageSources: [
      { src: "publication-chemosensory-464.webp", width: 464 },
      { src: "publication-chemosensory-928.webp", width: 928 },
    ],
    imageAlt: "Title page of the chemosensory grounding manuscript",
    links: [
      {
        label: "Manuscript",
        href: `${import.meta.env.BASE_URL}documents/chemosensory-grounding-2026.pdf`,
      },
    ],
    copy: [
      "This paper extends developmentally grounded vision-language learning to taste and smell, the two senses that egocentric infant datasets leave unrecorded. It introduces a five-field annotation schema that captures the observable context and motion consistent with a chemosensory event, then scales it with a dual-memory human-in-the-loop framework: an interpretable rule bank distilled from expert corrections, a MiniLM index of past prediction errors, and reward-weighted LoRA updates that carry reviewer feedback back into the model. A 500-clip manual audit reports 78.5 percent accuracy and 80.7 F1 against 65.3 percent and 64.7 for the frozen annotator, and the pipeline expands a few hundred expert-reviewed clips into a verified corpus of 20,000.",
      "The research behind the paper comes from my work at Boston University under Dr. Boqing Gong and Dr. Kate Saenko during the BU RISE Summer Program. I submitted the manuscript to the 2026 Junior Science and Humanities Symposium recognition program, where it received a $550 award and a Meta Quest 3S.",
    ],
  },
  {
    id: "nhd-paper",
    index: 4,
    category: "history",
    title:
      "Protecting the Public: The Uphill Battles for Consumer Rights through the Expansion of Responsibilities",
    image: "nhd-paper.png",
    imageAlt: "Title page of the National History Day process paper about the 1906 Food and Drug Act",
    links: [
      {
        label: "Research paper",
        href: `${import.meta.env.BASE_URL}documents/nhd-2025-food-and-drug-act.pdf`,
      },
    ],
    copy: [
      "I wrote this historical paper alongside my National History Day documentary, process paper, and annotated bibliography. I examine how early public-health scandals, reformers such as Dr. Harvey Wiley, and competing ideas of corporate and federal responsibility shaped the 1906 Food and Drug Act. The project connects that legislative struggle to the consumer-protection system that followed.",
      "Michigan History Day judges recognized the documentary and supporting research with the Best Use of Economic History award and the Top Two Documentary grand award. The project then advanced to the 2025 National History Day competition.",
    ],
  },
  {
    id: "nhd-2026-paper",
    index: 5,
    category: "history",
    title: "From Munitions to Speech: The Crypto Wars and the Fight for Digital Freedom",
    image: "nhd-2026-paper-928.webp",
    imageSources: [
      { src: "nhd-2026-paper-464.webp", width: 464 },
      { src: "nhd-2026-paper-928.webp", width: 928 },
    ],
    imageAlt: "Title page of my 2026 National History Day process paper on the Crypto Wars",
    links: [
      {
        label: "Research paper",
        href: `${import.meta.env.BASE_URL}documents/nhd-2026-crypto-wars.pdf`,
      },
    ],
    copy: [
      "I wrote this process paper and annotated bibliography for my 2026 National History Day documentary on the Crypto Wars. I explain how I researched the dispute over civilian encryption, from public-key cryptography and PGP to the Clipper Chip and court challenges over code as speech.",
      "I drew on technical publications, government records, and competing arguments about privacy and national security. The bibliography also documents my interview with PGP creator Phil Zimmermann, who discussed his reasons for releasing the software.",
    ],
  },
];
