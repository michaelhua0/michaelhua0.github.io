/* Portfolio content is stored as structured data so pages stay data-driven. */
import type { ResponsiveImageSource } from "../lib/images";
import type { GalleryPhoto } from "./photos";
import { isef2026Photos } from "./photos";
import { projectMetadata } from "./routeMetadata.js";
import type { Domain } from "./spectrum";

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
  /** Finer spectral domain — places the project on the 400–700 nm spine. */
  domain: Domain;
  /** Short label shown on the card and detail eyebrow. */
  tag: string;
  /** Title used on the Portfolio index card. */
  cardTitle: string;
  /** Title used on the dedicated detail page. */
  detailTitle: string;
  /** One-line teaser for the card. */
  teaser: string;
  /** Local image file inside /public/images. */
  image: string;
  /** Describes the image itself without repeating the adjacent project title. */
  imageAlt: string;
  /** Optional responsive variants of the same real image. */
  imageSources?: ResponsiveImageSource[];
  /** Use the scan reveal only for images that show technical evidence resolving. */
  scanReveal?: boolean;
  /** Use contain for diagrams, logos, and document pages that should remain uncropped. */
  imageFit?: "cover" | "contain";
  /** Preserve a source image's native proportions when a standard landscape frame would add bars. */
  imageRatio?: string;
  /** Optional backdrop used when a contained image does not fill its frame. */
  imageBackground?: string;
  /** Optional photographs shown on the dedicated project page. */
  gallery?: GalleryPhoto[];
  body: Block[];
}

/** Convenience: a plain paragraph with no links. */
const p = (text: string): Block => ({ kind: "paragraph", segments: [{ text }] });

export const projects: Project[] = [
  {
    ...projectMetadata.decodingLight,
    category: "research",
    domain: "hyperspectral",
    tag: "Hyperspectral imaging · Physics-aware AI",
    image: "decoding-light.jpg",
    imageAlt:
      "A camera beside a laptop showing a spectral curve, with a multicolored cube in front",
    imageFit: "contain",
    imageRatio: "928 / 826",
    scanReveal: true,
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
    ...projectMetadata.brainVesselSegmentation,
    category: "research",
    domain: "medical",
    tag: "Computer vision · Medical imaging",
    image: "brain-vessel.png",
    imageAlt:
      "Diagram of a multiscale convolutional transformer with 3D brain-vessel visualizations",
    imageFit: "contain",
    scanReveal: true,
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
    ...projectMetadata.msstTransformer,
    category: "research",
    domain: "hyperspectral",
    tag: "Hyperspectral imaging · Transformers",
    image: "msst.webp",
    imageAlt:
      "Diagram of the multimodal spatial-spectral-temporal transformer architecture",
    imageSources: [
      { src: "msst-560.webp", width: 560 },
      { src: "msst.webp", width: 1126 },
    ],
    imageFit: "contain",
    scanReveal: true,
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
    ...projectMetadata.aigro,
    category: "research",
    domain: "physical-ai",
    tag: "Mobile application · Physical AI",
    image: "aigro.webp",
    imageAlt:
      "Green app icon with a plant, microchip, rainbow spectrum, and white wordmark",
    imageSources: [
      { src: "aigro-366.webp", width: 366 },
      { src: "aigro.webp", width: 732 },
    ],
    imageFit: "contain",
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
    ...projectMetadata.nationalHistoryDay,
    category: "history",
    domain: "history",
    tag: "2025 National History Day · Documentary",
    image: "nhd.jpg",
    imageAlt:
      "Two archival photographs of a man, including one beside laboratory equipment",
    imageRatio: "16 / 9",
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
    ...projectMetadata.historysTrigger,
    category: "history",
    domain: "history",
    tag: "Historical research · Documentary filmmaking",
    image: "historys-trigger.jpg",
    imageAlt: "Red and black collage of layered newspaper clippings",
    imageFit: "contain",
    imageRatio: "16 / 9",
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
