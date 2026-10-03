import { LatheGeometry, Vector2 } from "three";

// An illustrative positive plano-convex element, revolved around the optical
// X axis. Real camera objectives may contain several elements; these profiles
// show optical function rather than claim a measured compound prescription.
export function createCameraLensGeometry(radius: number, thickness: number, convexDirection: 1 | -1, curvatureRadius?: number) {
  const sag = curvatureRadius && curvatureRadius > radius
    ? curvatureRadius - Math.sqrt(curvatureRadius ** 2 - radius ** 2)
    : thickness * .65;
  const depth = Math.min(sag, thickness * .85);
  const curvature = (radius ** 2 + depth ** 2) / (2 * depth);
  const profile = [new Vector2(0, -thickness / 2), new Vector2(radius, -thickness / 2)];
  for (let i = 0; i <= 32; i++) {
    const r = radius * (1 - i / 32);
    const x = thickness / 2 - (curvature - Math.sqrt(curvature ** 2 - r ** 2));
    profile.push(new Vector2(r, x));
  }
  const geometry = new LatheGeometry(profile, 64);
  geometry.rotateZ(-convexDirection * Math.PI / 2);
  return geometry;
}

// Only the separated illustration enlarges the small re-imaging objective.
export const reimagingDisplayDiameter = 22;
