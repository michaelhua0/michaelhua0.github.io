import type { InterleavedBufferAttribute } from "three";
import type { LineGeometry } from "three/addons/lines/LineGeometry.js";

// LineGeometry.setPositions allocates new interleaved buffers. Keep the buffers
// created during scene setup and update their contents while the camera moves.
export function updateCameraLightPath(geometry: LineGeometry, points: readonly number[]) {
  const start = geometry.getAttribute("instanceStart") as InterleavedBufferAttribute;
  const end = geometry.getAttribute("instanceEnd") as InterleavedBufferAttribute;
  for (let i = 0; i < start.count; i++) {
    const offset = i * 3;
    start.setXYZ(i, points[offset], points[offset + 1], points[offset + 2]);
    end.setXYZ(i, points[offset + 3], points[offset + 4], points[offset + 5]);
  }
  start.data.needsUpdate = true;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
}
