// Monotone cubic interpolation keeps position and velocity continuous between
// layout stops, without overshooting the space reserved for the sensor image.
function curve(position: number, stops: readonly number[], values: readonly number[]) {
  const last = stops.length - 1;
  if (position <= stops[0]) return values[0];
  if (position >= stops[last]) return values[last];
  const slopes = values.slice(1).map((value, i) => (value - values[i]) / (stops[i + 1] - stops[i]));
  const tangent = (index: number) => {
    if (index === 0 || index === last) return 0;
    const left = slopes[index - 1], right = slopes[index];
    return left * right <= 0 ? 0 : 2 * left * right / (left + right);
  };
  const index = stops.findIndex((stop, i) => i < last && position < stops[i + 1] && position >= stop);
  const span = stops[index + 1] - stops[index];
  const t = (position - stops[index]) / span;
  return (2 * t ** 3 - 3 * t ** 2 + 1) * values[index]
    + (t ** 3 - 2 * t ** 2 + t) * span * tangent(index)
    + (-2 * t ** 3 + 3 * t ** 2) * values[index + 1]
    + (t ** 3 - t ** 2) * span * tangent(index + 1);
}

export function cameraMotionAt(pose: number, width: number, height: number) {
  if (width <= 700) {
    const short = height <= 700;
    const stops = [0, 0.4, short ? 0.72 : 0.7, 1];
    return {
      x: 0,
      y: curve(pose, stops, short ? [0, 310, 475, 540] : [0, 43, 64, 67]),
      unit: short ? "px" : "svh",
      scale: curve(pose, stops, [1.02, 1.08, 1.12, 1.12]),
      notes: curve(pose, [0, 0.3, 0.6, 1], [0, -20, -20, 0]) * height / 100,
    };
  }
  const tablet = width <= 1000;
  const stops = [0, 0.4, 0.65, 1];
  return {
    x: curve(pose, stops, tablet ? [17, 10, 0, 0] : [20, 13, 0, 0]),
    y: curve(pose, stops, [0, 43, 69, 81]),
    unit: "svh",
    scale: curve(pose, stops, tablet ? [0.72, 0.95, 1.03, 1.03] : [0.85, 0.98, 1.03, 1.03]),
    notes: 0,
  };
}
