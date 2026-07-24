/* All portfolio content, verbatim from the source site.
   Stored as structured data so pages stay data-driven. */

export type Category = "research" | "history";

/** A run of text that may carry a single link (internal or external). */
export interface Segment {
  text: string;
  href?: string;
  internal?: boolean;
}

export type Block =
  | { kind: "paragraph"; segments: Segment[] }
  | { kind: "subheading"; text: string }
  | { kind: "note"; text: string }
  | { kind: "citation"; text: string }
  | { kind: "video"; id: string; title?: string }
  | { kind: "links"; items: LinkItem[] };

export interface LinkItem {
  label: string;
  href: string;
  internal?: boolean;
  primary?: boolean;
}

export interface Project {
  slug: string;
  category: Category;
  /** Short label shown on the card and detail eyebrow. */
  tag: string;
  /** Title used on the Portfolio index card. */
  cardTitle: string;
  /** Title used on the dedicated detail page. */
  detailTitle: string;
  /** One-line teaser for the card. */
  teaser: string;
  /** Local image file (dropped into /public/images). Falls back to generated art. */
  image: string;
  /** Motif used for the generated fallback art. */
  motif: "spectral" | "vessel" | "point-cloud" | "app" | "documentary" | "channel";
  body: Block[];
}

/** Convenience: a plain paragraph with no links. */
const p = (text: string): Block => ({ kind: "paragraph", segments: [{ text }] });

export const projects: Project[] = [
  {
    slug: "decoding-light",
    category: "research",
    tag: "Hyperspectral imaging · Self-supervised AI",
    cardTitle: "Decoding Light: Physics-Aware Self-Supervised AI for Low-Cost HSI",
    detailTitle: "Decoding Light: Physics-Aware Self-Supervised AI for Low-Cost HSI",
    teaser: "Physics-aware self-supervised AI for low-cost hyperspectral imaging.",
    image: "decoding-light.jpg",
    motif: "spectral",
    body: [
      { kind: "note", text: "Project page in development. Further information is forthcoming." },
    ],
  },
  {
    slug: "brain-vessel-segmentation",
    category: "research",
    tag: "Computer vision · Medical imaging",
    cardTitle:
      "Novel Multi-Scale Knowledge Transfer Convolutional Transformer for 3D Brain Vessel Segmentation",
    detailTitle:
      "Novel Multi-Scale Knowledge Transfer Transformer for 3D Brain Vessel Segmentation",
    teaser: "A convolutional Transformer for 3D brain-vessel segmentation from in-vivo MRI.",
    image: "brain-vessel.jpg",
    motif: "vessel",
    body: [
      p(
        "In this project, I developed a novel Multi-scale Knowledge Transfer Convolutional Transformer to improve 3D brain-vessel segmentation from in-vivo MRI. The model combines convolutional layers and Transformer encoders within a U-net architecture and integrates a novel knowledge transfer mechanism to enhance performance on lower-resolution images. It outperforms existing methods and enables more accurate vessel segmentation and visualization for diagnosis and research.",
      ),
      p(
        "This project was submitted to 2024 JSHS and SEFMD (ISEF-qualifying regional fair), and it qualified for both National JSHS and Regeneron ISEF!",
      ),
      p(
        "The project materials submitted to the 2024 Science and Engineering Fair of Metro Detroit (SEFMD) are linked below.",
      ),
      {
        kind: "links",
        items: [
          {
            label: "2024 ISEF project",
            href: "https://isef.net/project/robo068-novel-multi-scale-knowledge-transfer-transformer",
          },
          {
            label: "SEFMD project materials",
            href: "https://drive.google.com/drive/u/0/folders/17MW22gyS_MX25a3H6RtyMFJayWr6E0fb",
          },
          { label: "Publications", href: "/publications", internal: true },
          {
            label: "Google Scholar citations",
            href: "https://scholar.google.com/scholar?cites=11514999127037796195&as_sdt=80000005&sciodt=0,23&hl=en",
          },
        ],
      },
      {
        kind: "citation",
        text:
          "Michael J. Hua, Junjie Wu, and Zichun Zhong, \u201CMulti-scale Knowledge Transfer Vision Transformer for 3D vessel shape segmentation,\u201D Computers & Graphics, Vol. 122, 2024 (\u201C5 citations to date according to google scholar\u201D).",
      },
    ],
  },
  {
    slug: "msst-transformer",
    category: "research",
    tag: "Hyperspectral imaging · Transformers",
    cardTitle:
      "Novel Multimodal Spatial-Spectral-Temporal Transformer for Hyperspectral Imaging in Plant Growth Modeling",
    detailTitle: "Novel MSST Transformer for Hyperspectral Imaging in Plant Growth Modeling",
    teaser: "A spatial-spectral-temporal transformer modeling plant growth from hyperspectral data.",
    image: "msst.jpg",
    motif: "spectral",
    body: [
      p(
        "I developed a multimodal spatial-spectral-temporal transformer that models plant growth by integrating hyperspectral images, environmental light conditions, and time-series features. By capturing global spatial-spectral patterns and their temporal evolution, the system accurately predicts biomass outcomes and reveals how environmental factors impact early plant development. It enables advances in precision and urban agriculture.",
      ),
      p(
        "The project materials submitted to the 2025 Science and Engineering Fair of Metro Detroit (SEFMD) are linked below.",
      ),
      {
        kind: "links",
        items: [
          {
            label: "Project materials",
            href: "https://drive.google.com/drive/u/0/folders/1pGKzoeXDfcZIDKExegHi9g3J_DiZm9jl",
            primary: true,
          },
        ],
      },
    ],
  },
  {
    slug: "aigro",
    category: "research",
    tag: "App development · Physical AI",
    cardTitle: "AIGRO app",
    detailTitle: "AIGRO",
    teaser: "A smart cultivation app linking real-world sensors to a physical AI growth system.",
    image: "aigro.jpg",
    motif: "app",
    body: [
      { kind: "video", id: "CRbAQMoCaJg", title: "AIGRO" },
      {
        kind: "paragraph",
        segments: [
          {
            text:
              "AIGro is a smart cultivation app I built to bring reliable, efficient, data-driven plant care to indoor gardens and vertical farms. It links real-world sensors to a physical AI system that learns, understands, predicts, and refines growing conditions to create the most optimal environment for plant. The AI models were mainly designed in my ",
          },
          {
            text: "MSST transformer research project",
            href: "/portfolio/msst-transformer",
            internal: true,
          },
          {
            text:
              " and converted to mobile-compatible forms. AIGRO combines real-world environmental sensing, adaptive AI growth modeling, and autonomous controls into one system.",
          },
        ],
      },
      p(
        "My developed application was submitted to the 2025 Congressional App Challenge for judging. (Results pending)",
      ),
    ],
  },
  {
    slug: "national-history-day",
    category: "history",
    tag: "2025 National History Day · Documentary",
    cardTitle: "2025 NHD; The 1906 Food and Drug Act",
    detailTitle: "2025 National History Day Research Project",
    teaser: "From Poison to Protection: how America built its food and drug safety system.",
    image: "nhd.jpg",
    motif: "documentary",
    body: [
      {
        kind: "video",
        id: "iYgWE6qBokk",
        title: "From Poison to Protection: The 1906 Food and Drug Act",
      },
      p(
        "My project explores how America built its food and drug safety system by balancing consumer rights with government and corporate responsibilities. Through stories of early scandals, reformers like Dr. Wiley, and the fight for the 1906 Food and Drug Act, I show how protecting public health became a shared responsibility that still shapes our lives today.",
      ),
      p("My NHD Project's submitted materials are linked below."),
      {
        kind: "links",
        items: [
          { label: "NHD paper", href: "/publications#nhd-paper", internal: true, primary: true },
        ],
      },
    ],
  },
  {
    slug: "historys-trigger",
    category: "history",
    tag: "YouTube · Documentary filmmaking",
    cardTitle: "History's Trigger YouTube Channel",
    detailTitle: "My YouTube Channel: History's Trigger",
    teaser: "A student-run documentary channel on the assassinations that changed history.",
    image: "historys-trigger.jpg",
    motif: "channel",
    body: [
      {
        kind: "links",
        items: [
          {
            label: "Visit History's Trigger on YouTube",
            href: "https://www.youtube.com/@HistorysTrigger",
            primary: true,
          },
        ],
      },
      p(
        "My \u201CHistory's Trigger\u201D channel is a student-run, film/ documentary-based YouTube Channel, which explores the major assassinations that changed the course of history. Each episode dives into the people involved, the motives behind the attacks, and how one violent moment could reshape nations and ideologies. My channel revisits the events that left a lasting mark on the world with engaging storytelling and in-depth research.",
      ),
      p(
        "This passion project fulfilled one of my childhood goals of having my own YouTube channel! (Although not for video games as I had hoped)",
      ),
      { kind: "subheading", text: "Episodes" },
      {
        kind: "video",
        id: "1MS3odUXTxg",
        title: "Stalin's Final Opponent Silenced: The Assassination of Leon Trotsky",
      },
      {
        kind: "video",
        id: "EePPTLbAMiE",
        title:
          "Turning the Tide of China's Nationalist Revolution: The Assassination of Liao Zhong Kai",
      },
      {
        kind: "video",
        id: "uXrWLcgq5fA",
        title: "The Assassination of Shinzo Abe: A Moment that Moved a Nation",
      },
    ],
  },
];

export const getProject = (slug: string) => projects.find((x) => x.slug === slug);
