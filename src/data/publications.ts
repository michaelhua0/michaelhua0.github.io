export interface Publication {
  id: string;
  index: number;
  title: string;
  category: "research" | "history";
  journal?: string;
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
    links: [
      {
        label: "Journal article",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0097849324001110#preview-section-cited-by",
      },
      {
        label: "Manuscript",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "This peer-reviewed paper presents a Multi-Scale Knowledge Transfer Convolutional Transformer for 3D cerebral-vessel segmentation in in vivo MRI. The architecture combines convolutional feature extraction, transformer encoders, and cross-scale knowledge transfer to improve segmentation at lower image resolutions. The method supports vascular visualization and quantitative analysis in medical-imaging research.",
      "I developed this work for my 2024 research project, which qualified for Regeneron ISEF and the National Junior Science and Humanities Symposium. I presented the paper at Shape Modeling International in Detroit in July 2024 to researchers in computer graphics and medical imaging.",
    ],
  },
  {
    id: "msst-paper",
    index: 2,
    category: "research",
    title:
      "MSST Transformer: A Novel Multimodal Spatial-Spectral-Temporal Transformer for Time-series Hyperspectral Imaging in Plant Growth Modeling",
    links: [
      {
        label: "Manuscript",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "This paper introduces a multimodal spatial-spectral-temporal transformer for plant-growth modeling. The model integrates hyperspectral imagery, environmental light measurements, and longitudinal features to estimate biomass and characterize early growth under different conditions. The work supports precision control in vertical farming and other urban-agriculture systems.",
      "I submitted the paper to the 2025 Junior Science and Humanities Symposium. The project placed fifth at Michigan JSHS and advanced to the National JSHS competition.",
    ],
  },
  {
    id: "nhd-paper",
    index: 3,
    category: "history",
    title:
      "Protecting the Public: The Uphill Battles for Consumer Rights through the Expansion of Responsibilities",
    links: [
      {
        label: "Research paper",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "I wrote this historical paper alongside my National History Day documentary, process paper, and annotated bibliography. I examine how early public-health scandals, reformers such as Dr. Harvey Wiley, and competing ideas of corporate and federal responsibility shaped the 1906 Food and Drug Act. The project connects that legislative struggle to the consumer-protection system that followed.",
      "Michigan History Day judges recognized the documentary and supporting research with the Best Use of Economic History award and the Top Two Documentary grand award. The project then advanced to the 2025 National History Day competition.",
    ],
  },
];
