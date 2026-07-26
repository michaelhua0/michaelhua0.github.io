export interface RouteMetadata {
  title: string;
  path: string;
  description: string;
}

export interface ProjectMetadata {
  slug: string;
  cardTitle: string;
  detailTitle: string;
  teaser: string;
}

export const siteIdentity: {
  name: string;
  url: string;
  shareImagePath: string;
  description: string;
};

export const pageMetadata: {
  home: RouteMetadata;
  about: RouteMetadata;
  portfolio: RouteMetadata;
  publications: RouteMetadata;
};

export const projectMetadata: {
  decodingLight: ProjectMetadata;
  brainVesselSegmentation: ProjectMetadata;
  msstTransformer: ProjectMetadata;
  aigro: ProjectMetadata;
  nationalHistoryDay: ProjectMetadata;
  historysTrigger: ProjectMetadata;
};
