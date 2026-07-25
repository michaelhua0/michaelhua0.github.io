/* Portfolio content is stored as structured data so pages stay data-driven. */
import type { GalleryPhoto } from "./photos";
import { isef2026Photos } from "./photos";

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
  /** Use contain for diagrams, logos, and document pages that should remain uncropped. */
  imageFit?: "cover" | "contain";
  /** Preserve a source image's native proportions when a standard landscape frame would add bars. */
  imageRatio?: string;
  /** Optional backdrop used when a contained image does not fill its frame. */
  imageBackground?: string;
  /** Motif used for the generated fallback art. */
  motif: "spectral" | "vessel" | "point-cloud" | "app" | "documentary" | "channel";
  /** Optional photographs shown on the dedicated project page. */
  gallery?: GalleryPhoto[];
  body: Block[];
}

/** Convenience: a plain paragraph with no links. */
const p = (text: string): Block => ({ kind: "paragraph", segments: [{ text }] });

export const projects: Project[] = [
  {
    slug: "decoding-light",
    category: "research",
    tag: "Hyperspectral imaging · Physics-aware AI",
    cardTitle: "Decoding Light With Physics-Aware AI",
    detailTitle: "Decoding Light With Physics-Aware AI",
    teaser:
      "A low-cost imaging spectrometer and physics-aware transformer for high-fidelity hyperspectral reconstruction.",
    image: "decoding-light.jpg",
    imageFit: "contain",
    imageRatio: "928 / 826",
    motif: "spectral",
    gallery: isef2026Photos,
    body: [
      p(
        "I developed a low-cost Computed Tomography Imaging Spectrometer (CTIS) that captures zero-order, first-order, and diagonal diffraction patterns. The simplified hardware reduces the cost of hyperspectral imaging, but it also creates an underdetermined inverse problem with fewer measurements than unknown spectral values.",
      ),
      p(
        "I addressed this inverse problem with the Physics-Aware Spatial-Spectral (PASS) Transformer. PASS combines physics-based backprojection with learned reconstruction and encodes diffraction and point-spread-function physics within its attention mechanisms. The model recovers information from the null space of CTIS measurements, separates overlapping spectral components, and constrains its output against hallucinated structures.",
      ),
      p(
        "PASS uses forward consistency with the CTIS imaging model as its training signal, which removes the need for costly ground-truth hyperspectral data. My experiments showed higher reconstruction fidelity than existing methods. I validated the integrated hardware and AI system in food-allergy detection, plant-stress monitoring, and environmental-contamination analysis.",
      ),
      { kind: "subheading", text: "Awards" },
      {
        kind: "note",
        text:
          "First Place Grand Award in Robotics and Intelligent Machines · ACM Special Award · Midjourney Special Award",
      },
      {
        kind: "links",
        items: [
          {
            label: "Official ISEF project page",
            href: "https://isef.net/project/robo035-decoding-light-with-physics-aware-ai",
            primary: true,
          },
        ],
      },
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
    teaser:
      "A hybrid convolutional transformer for segmenting cerebral vasculature in 3D in vivo MRI.",
    image: "brain-vessel.png",
    imageFit: "contain",
    motif: "vessel",
    body: [
      p(
        "I developed a Multi-Scale Knowledge Transfer Convolutional Transformer for automated segmentation of cerebral vasculature in 3D in vivo MRI. The model integrates convolutional feature extraction and transformer encoders within a U-Net architecture. A knowledge-transfer mechanism shares structural information across image scales and improves performance on lower-resolution volumes. Comparative experiments showed higher segmentation accuracy than existing methods, with applications in vascular visualization and quantitative analysis.",
      ),
      p(
        "The project qualified for the 2024 Regeneron International Science and Engineering Fair and the National Junior Science and Humanities Symposium after regional competition at SEFMD and Michigan JSHS.",
      ),
      p(
        "The links below include the official ISEF record, regional fair materials, the associated publication, and citation data.",
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
          "Michael J. Hua, Junjie Wu, and Zichun Zhong. \u201CMulti-scale Knowledge Transfer Vision Transformer for 3D vessel shape segmentation.\u201D Computers & Graphics 122 (2024).",
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
    teaser:
      "A multimodal transformer that estimates plant growth from hyperspectral imagery, environmental measurements, and temporal data.",
    image: "msst.png",
    imageFit: "contain",
    motif: "spectral",
    body: [
      p(
        "I designed a multimodal spatial-spectral-temporal transformer that combines hyperspectral imagery, environmental light conditions, and longitudinal measurements. The architecture models spatial-spectral relationships within each observation and temporal changes across observations. It predicts biomass and quantifies how early plant growth responds to environmental conditions, with applications in precision-controlled agriculture and vertical farming.",
      ),
      p(
        "The project placed fifth at the 2025 Michigan Junior Science and Humanities Symposium and advanced to the National JSHS competition. The link below contains the materials submitted to the Science and Engineering Fair of Metro Detroit.",
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
    tag: "Mobile application · Physical AI",
    cardTitle: "AIGRO: AI-Assisted Cultivation",
    detailTitle: "AIGRO",
    teaser:
      "A mobile cultivation platform that connects environmental sensors, predictive growth models, and automated controls.",
    image: "aigro.png",
    imageFit: "contain",
    motif: "app",
    body: [
      { kind: "video", id: "CRbAQMoCaJg", title: "AIGRO" },
      {
        kind: "paragraph",
        segments: [
          {
            text:
              "I developed AIGRO for data-informed plant care in indoor gardens and vertical farms. The application adapts models from my ",
          },
          {
            text: "MSST transformer research project",
            href: "/portfolio/msst-transformer",
            internal: true,
          },
          {
            text:
              " for mobile deployment. It combines environmental sensor data, predictive growth modeling, and automated controls within a single cultivation platform.",
          },
        ],
      },
      p(
        "I submitted AIGRO to the 2025 Congressional App Challenge.",
      ),
    ],
  },
  {
    slug: "national-history-day",
    category: "history",
    tag: "2025 National History Day · Documentary",
    cardTitle: "From Poison to Protection: The 1906 Food and Drug Act",
    detailTitle: "From Poison to Protection: The 1906 Food and Drug Act",
    teaser:
      "A documentary and historical study of the reform movement that produced the 1906 Food and Drug Act.",
    image: "nhd.jpg",
    motif: "documentary",
    body: [
      {
        kind: "video",
        id: "iYgWE6qBokk",
        title: "From Poison to Protection: The 1906 Food and Drug Act",
      },
      p(
        "I examined how reformers, federal officials, and industry leaders contested responsibility for food and drug safety in the United States. The documentary traces early public-health scandals, the work of Dr. Harvey Wiley, and the legislative struggle that produced the 1906 Food and Drug Act. It places modern consumer protections within the political and economic debates that shaped their development.",
      ),
      p(
        "At the 2025 Michigan History Day competition, the project received the Best Use of Economic History award and the Top Two Documentary grand award. It then advanced to the National History Day competition.",
      ),
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
    tag: "Historical research · Documentary filmmaking",
    cardTitle: "History's Trigger",
    detailTitle: "History's Trigger: Documentary History",
    teaser:
      "An independent documentary series about political assassinations and their historical consequences.",
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
        "I created History's Trigger as an independent documentary channel. Each episode examines a political assassination through the people involved, the motives behind the attack, its political context, and its long-term consequences. I write each script from historical research and use documentary film to connect individual acts of violence with changes in governments, movements, and public life.",
      ),
      p(
        "The channel gives me a public format for independent historical research, scriptwriting, narration, and film production.",
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
