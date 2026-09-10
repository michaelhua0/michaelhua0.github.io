// The navigation, copy, and model all use the same animation milestones.
export const cameraTimeline = {
  openingStart: 0.14,
  openingEnd: 0.38,
  separationStart: 0.38,
  separationEnd: 0.60,
  sensorStart: 0.84,
  sensorEnd: 0.96,
  opticsPose: 0.72,
  readingInterval: 0.65,
  length: 1.65,
} as const;

export const cameraChapters = [
  { label: "Camera", position: 0 },
  { label: "Optics", position: cameraTimeline.opticsPose + cameraTimeline.readingInterval / 2 },
  { label: "Sensor", position: cameraTimeline.length },
] as const;

// A slower reading interval, with strictly positive velocity throughout.
// Hermite segments match velocity at their joins; there is no held pose.
export function cameraPoseAt(position: number) {
  const stops = [0, 0.6, 1.37, cameraTimeline.length];
  const poses = [0, 0.6, 0.84, 1];
  const slopes = [1, 0.5, 0.4, 0.7];
  if (position <= 0) return 0;
  if (position >= cameraTimeline.length) return 1;
  const i = stops.findIndex((start, index) => index < stops.length - 1 && position >= start && position < stops[index + 1]);
  const span = stops[i + 1] - stops[i];
  const t = (position - stops[i]) / span;
  return (2 * t ** 3 - 3 * t ** 2 + 1) * poses[i]
    + (t ** 3 - 2 * t ** 2 + t) * span * slopes[i]
    + (-2 * t ** 3 + 3 * t ** 2) * poses[i + 1]
    + (t ** 3 - t ** 2) * span * slopes[i + 1];
}

// The scene continues moving through the page during the reading interval.
// Move it at a quarter of the page's speed, then restore the final framing.
export function cameraFlowOffset(position: number) {
  const { opticsPose, readingInterval } = cameraTimeline;
  const pose = cameraPoseAt(position);
  const finish = Math.max(0, Math.min(1, (pose - opticsPose) / (1 - opticsPose)));
  const ease = finish * finish * (3 - 2 * finish);
  return (position - pose) * 0.75 + readingInterval * 0.25 * ease;
}

export function cameraChapterAt(position: number) {
  const progress = cameraPoseAt(position);
  if (progress < cameraTimeline.openingStart) return 0;
  return progress < cameraTimeline.sensorStart ? 1 : 2;
}
