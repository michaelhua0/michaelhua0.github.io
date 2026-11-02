/** Winkel Tripel projection, centered on Greenwich, in a 1000 × 500 SVG. */
const DEG = Math.PI / 180;
const SCALE = 183;
const CENTER_X = 500;
const CENTER_Y = 288;
const STANDARD_PARALLEL_COS = 2 / Math.PI;

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 500;

export function projectLocation(longitude: number, latitude: number): [number, number] {
  const lambda = longitude * DEG;
  const phi = latitude * DEG;
  const alpha = Math.acos(Math.max(-1, Math.min(1, Math.cos(phi) * Math.cos(lambda / 2))));
  const sinc = alpha === 0 ? 1 : Math.sin(alpha) / alpha;
  const aitoffX = (2 * Math.cos(phi) * Math.sin(lambda / 2)) / sinc;
  const aitoffY = Math.sin(phi) / sinc;
  const x = (aitoffX + lambda * STANDARD_PARALLEL_COS) / 2;
  const y = (aitoffY + phi) / 2;
  return [CENTER_X + x * SCALE, CENTER_Y - y * SCALE];
}

/** Reproject the original Natural Earth equirectangular country paths. */
export function projectCountryPath(path: string): string {
  return path.replace(/([ML])(-?[\d.]+) (-?[\d.]+)/g, (_, command: string, x: string, y: string) => {
    const longitude = Number(x) * 0.36 - 180;
    const latitude = 90 - Number(y) * 0.36;
    const [projectedX, projectedY] = projectLocation(longitude, latitude);
    return `${command}${projectedX.toFixed(1)} ${projectedY.toFixed(1)}`;
  });
}

export function graticulePath(fixed: "latitude" | "longitude", value: number): string {
  const points: string[] = [];
  if (fixed === "latitude") {
    for (let longitude = -180; longitude <= 180; longitude += 5) {
      const [x, y] = projectLocation(longitude, value);
      points.push(`${points.length ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  } else {
    for (let latitude = -60; latitude <= 85; latitude += 5) {
      const [x, y] = projectLocation(value, latitude);
      points.push(`${points.length ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }
  return points.join("");
}
