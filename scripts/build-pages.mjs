import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  pageMetadata,
  projectMetadata,
  siteIdentity,
} from "../src/data/routeMetadata.js";

const dist = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", dist), "utf8");
const shareImage = `${siteIdentity.url}${siteIdentity.shareImagePath}`;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function renderMetadata({ title, description, path }) {
  const fullTitle =
    title === siteIdentity.name ? siteIdentity.name : `${title} | ${siteIdentity.name}`;
  const url = `${siteIdentity.url}${path}`;
  const metadata = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${escapeHtml(siteIdentity.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(shareImage)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(shareImage)}" />`,
  ].join("\n    ");

  return template
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    )
    .replace("</head>", `    ${metadata}\n  </head>`);
}

const projectRoutes = Object.values(projectMetadata).map((project) => ({
  title: project.detailTitle,
  description: project.teaser,
  path: `/portfolio/${project.slug}`,
}));
const routes = [...Object.values(pageMetadata), ...projectRoutes];

await Promise.all(
  routes.map(async (route) => {
    const output =
      route.path === "/"
        ? new URL("index.html", dist)
        : new URL(`${route.path.slice(1)}/index.html`, dist);
    await mkdir(new URL("./", output), { recursive: true });
    await writeFile(output, renderMetadata(route));
  }),
);

await writeFile(new URL("404.html", dist), renderMetadata(pageMetadata.home));
