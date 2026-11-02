// Generate compact, flat SVG paths from Natural Earth's public-domain
// ne_110m_admin_0_countries.geojson. Usage: node scripts/generate-world-map.mjs input.geojson
import { readFile, writeFile } from "node:fs/promises";

const input = process.argv[2];
if (!input) throw new Error("Pass a Natural Earth countries GeoJSON file.");

const source = JSON.parse(await readFile(input, "utf8"));
const project = ([longitude, latitude]) => [
  ((longitude + 180) * 1000) / 360,
  ((90 - latitude) * 500) / 180,
];

const polygonPath = (rings) =>
  rings
    .map((ring) =>
      ring
        .map((point, index) => {
          const [x, y] = project(point);
          return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join("") + "Z",
    )
    .join("");

const countries = source.features
  .filter((feature) => feature.properties.ADM0_A3 !== "ATA")
  .map((feature) => {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;
    return {
      id: feature.properties.ADM0_A3,
      name: feature.properties.NAME,
      path: polygons.map(polygonPath).join(""),
    };
  });

const output = `/* Generated from Natural Earth 1:110m Admin 0 countries (public domain).\n * Source: https://github.com/nvkelso/natural-earth-vector\n * Regenerate with: node scripts/generate-world-map.mjs <GeoJSON path>\n */\nexport interface MapCountry { id: string; name: string; path: string }\nexport const worldMap: MapCountry[] = ${JSON.stringify(countries)};\n`;

await writeFile(new URL("../src/data/worldMap.ts", import.meta.url), output);
console.log(`Wrote ${countries.length} country outlines.`);
