export const siteIdentity = {
  name: "Michael Hua",
  url: "https://michaelhua0.github.io",
  // TODO(owner): supply 1200×630 public/images/og-default.jpg
  shareImagePath: "/images/og-default.jpg",
  description:
    "I am a student researcher and software developer whose work spans artificial intelligence, hyperspectral imaging, medical computer vision, and documentary history.",
};

export const pageMetadata = {
  home: {
    title: siteIdentity.name,
    path: "/",
    description: siteIdentity.description,
  },
  about: {
    title: "About",
    path: "/about",
    description:
      "I am a student researcher, software developer, documentary filmmaker, saber fencer, and ACA TVC co-president.",
  },
  portfolio: {
    title: "Portfolio",
    path: "/portfolio",
    description: "Explore my selected research, software, and documentary projects.",
  },
  publications: {
    title: "Publications",
    path: "/publications",
    description:
      "Explore my peer-reviewed research and competition papers in computer vision, hyperspectral imaging, and history.",
  },
};

export const projectMetadata = {
  decodingLight: {
    slug: "decoding-light",
    cardTitle: "Decoding Light With Physics-Aware AI",
    detailTitle: "Decoding Light With Physics-Aware AI",
    teaser:
      "A low-cost imaging spectrometer and physics-aware transformer for high-fidelity hyperspectral reconstruction.",
  },
  brainVesselSegmentation: {
    slug: "brain-vessel-segmentation",
    cardTitle:
      "Novel Multi-Scale Knowledge Transfer Convolutional Transformer for 3D Brain Vessel Segmentation",
    detailTitle:
      "Novel Multi-Scale Knowledge Transfer Transformer for 3D Brain Vessel Segmentation",
    teaser:
      "A hybrid convolutional transformer for segmenting cerebral vasculature in 3D in vivo MRI.",
  },
  msstTransformer: {
    slug: "msst-transformer",
    cardTitle:
      "Novel Multimodal Spatial-Spectral-Temporal Transformer for Hyperspectral Imaging in Plant Growth Modeling",
    detailTitle: "Novel MSST Transformer for Hyperspectral Imaging in Plant Growth Modeling",
    teaser:
      "A multimodal transformer that estimates plant growth from hyperspectral imagery, environmental measurements, and temporal data.",
  },
  aigro: {
    slug: "aigro",
    cardTitle: "AIGRO: AI-Assisted Cultivation",
    detailTitle: "AIGRO",
    teaser:
      "A mobile cultivation platform that connects environmental sensors, predictive growth models, and automated controls.",
  },
  nationalHistoryDay: {
    slug: "national-history-day",
    cardTitle: "From Poison to Protection: The 1906 Food and Drug Act",
    detailTitle: "From Poison to Protection: The 1906 Food and Drug Act",
    teaser:
      "A documentary and historical study of the reform movement that produced the 1906 Food and Drug Act.",
  },
  historysTrigger: {
    slug: "historys-trigger",
    cardTitle: "History's Trigger",
    detailTitle: "History's Trigger: Documentary History",
    teaser:
      "An independent documentary series about political assassinations and their historical consequences.",
  },
};
