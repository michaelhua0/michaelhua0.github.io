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
      "Multi-scale Knowledge Transfer Vision Transformer for 3D vessel shape segmentation",
    journal: "Computers & Graphics Volume 122, August 2024",
    links: [
      {
        label: "Publication",
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0097849324001110#preview-section-cited-by",
      },
      {
        label: "Full paper",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "This paper presents a Multi-scale Knowledge Transfer Convolutional Transformer that achieves state-of-the-art accuracy in 3D brain vessel segmentation from in-vivo MRI, advancing early diagnosis and treatment of terminal brain disorders.",
      "This paper was published in the peer-reviewed journal Computers and Graphics. This paper was also part of my 2024 Research Project that qualified to the 2024 Regeneron International Science and Engineering Fair (ISEF) and National Junior Science and Humanities Symposium (JSHS) competition. I also participated in the Shape Modeling International (SMI) conference held in Detroit, Michigan, from July 12th to July 14th, presenting this paper to professionals and researchers in corresponding fields.",
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
        label: "Full paper",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "This paper presents a novel multimodal spatial-spectral-temporal transformer for analyzing complex hyperspectral data, enabling the construction of a highly accurate statistical growth model that supports precision control in vertical farming and advances urban agriculture applications.",
      "This paper was submitted to the 2025 National Junior Science and Humanities Symposium (JSHS) competition. I qualified as a National JSHS finalist from the 2025 Michigan JSHS competition, placing 5th in the state.",
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
        label: "Full paper",
        href: "https://drive.google.com/drive/u/0/folders/1qHb3ACtxRcbW1AObT_0jHse8wstzY_bM",
      },
    ],
    copy: [
      "This historical paper, including a process paper and annotated bibliography, was submitted along with my National History Day Documentary. It explores how America built its food and drug safety system by balancing consumer rights with government and corporate responsibilities. Through stories of early scandals, reformers like Dr. Wiley, and the fight for the 1906 Food and Drug Act, I show how protecting public health became a shared responsibility that still shapes our lives today.",
      "This was was submitted to 2025 National History Day after qualifying from 2025 Michigan History Day along with my published documentary. My documentary, process paper, and annotated bibliography earned me the special award \u201CBest Use of Economic History\u201D and the grand award \u201CTop Two Documentary\u201D within the Michigan competition.",
    ],
  },
];
