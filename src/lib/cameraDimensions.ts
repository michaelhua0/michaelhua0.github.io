// Millimetres. Michael confirmed the reported 7.5-inch length includes the
// protruding lens. The focal lengths come from his hardware slide. Unmeasured
// lengths below are estimates for the illustration, not manufacturing data.
export const cameraDimensions = {
  overall: { length: 7.5 * 25.4, height: 3.75 * 25.4, depth: 2.75 * 25.4 },
  lensProtrusion: 40,
  wall: 1.5,
  imaging: { focalLength: 35, principalPlane: -65, diameter: 33 },
  aperture: { width: 30, height: 40, opening: 3 },
  collimating: { focalLength: 100, diameter: 25.4, thickness: 4 },
  grating: { distanceAfterCollimator: 10, width: 40, height: 48 },
  reimaging: { focalLength: 3.04, distanceAfterGrating: 7.5, diameter: 5, thickness: 1.2 },
  // Camera Module 2 is an estimate based on the slide's 3.04 mm focal length.
  // https://www.raspberrypi.com/documentation/accessories/camera.html
  sensor: { boardWidth: 25, boardHeight: 24, activeWidth: 3.68, activeHeight: 2.76 },
  // Representative Model B outline; board revision and internal mounting are
  // illustrative until measured. All dimensions share the same mm scale.
  computer: { length: 85, width: 56, thickness: 1.6, centerX: 20, centerY: -33, ribbonWidth: 16 },
} as const;

export const mm = (value: number) => value / 30;
const d = cameraDimensions;
// Thin-lens, distant-scene estimate. Principal planes are not lens surfaces;
// measured back focus and object distance would refine these positions.
const aperture = d.imaging.principalPlane + d.imaging.focalLength;
const collimator = aperture + d.collimating.focalLength;
const grating = collimator + d.grating.distanceAfterCollimator;
const reimaging = grating + d.reimaging.distanceAfterGrating;
export const cameraOpticalPositions = {
  aperture, collimator, grating, reimaging,
  sensor: reimaging + d.reimaging.focalLength,
};
export const cameraEnclosure = {
  front: -d.overall.length / 2 + d.lensProtrusion,
  rear: d.overall.length / 2,
  length: d.overall.length - d.lensProtrusion,
  center: d.lensProtrusion / 2,
};
