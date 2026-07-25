import { useEffect, useRef } from "react";
import "./homeglobe.css";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type GlobeView = Coordinates;
type GeoPoint = readonly [longitude: number, latitude: number];
type ViewPoint = { x: number; y: number; z: number };

const HOME_GLOBE_SETTINGS = {
  michigan: {
    latitude: 44.3,
    longitude: -85.6,
    label: "Michigan · Home",
  },
  initialView: {
    latitude: 12,
    longitude: -18,
  },
  finalView: {
    latitude: 44.3,
    longitude: -85.6,
  },
  mobileBreakpoint: 760,
  gridInterval: 30,
  radiusScale: 0.37,
  scrollSmoothing: 0.14,
} as const;

/* Deliberately simplified silhouettes: enough geography to read as a world
   map while staying consistent with the site's instrument-like visual voice. */
const LANDMASSES: GeoPoint[][] = [
  [
    [-168, 72], [-148, 70], [-136, 58], [-127, 50], [-124, 40], [-116, 31],
    [-103, 23], [-93, 18], [-84, 10], [-78, 20], [-82, 26], [-79, 34],
    [-71, 43], [-60, 48], [-66, 55], [-79, 59], [-86, 67], [-110, 73],
  ],
  [
    [-81, 12], [-72, 10], [-62, 5], [-52, -2], [-46, -15], [-52, -30],
    [-60, -43], [-70, -53], [-75, -38], [-79, -18],
  ],
  [
    [-10, 36], [0, 43], [10, 45], [18, 55], [10, 62], [20, 70],
    [38, 69], [45, 58], [35, 48], [28, 40], [12, 36],
  ],
  [
    [-18, 34], [-5, 37], [12, 35], [30, 31], [40, 12], [47, -12],
    [35, -25], [22, -35], [10, -34], [1, -22], [-8, 2], [-16, 18],
  ],
  [
    [35, 74], [68, 72], [100, 76], [132, 70], [160, 62], [175, 52],
    [151, 45], [142, 36], [124, 28], [108, 8], [91, 8], [78, 20],
    [63, 25], [48, 31], [38, 48],
  ],
  [
    [112, -11], [129, -13], [143, -10], [153, -24], [145, -39],
    [126, -35], [114, -25],
  ],
  [
    [-54, 82], [-28, 79], [-20, 68], [-42, 59], [-58, 66],
  ],
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (from: number, to: number, value: number) => {
  const progress = clamp((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
};

function withAlpha(color: string, alpha: number) {
  const value = color.trim();
  const hex = value.match(/^#([\da-f]{6})$/i);
  if (hex) {
    const number = Number.parseInt(hex[1], 16);
    return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
  }

  const rgb = value.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  return value;
}

function project(point: Coordinates, view: GlobeView): ViewPoint {
  const latitude = toRadians(point.latitude);
  const viewLatitude = toRadians(view.latitude);
  const longitudeDelta = toRadians(point.longitude - view.longitude);
  const cosLatitude = Math.cos(latitude);

  return {
    x: cosLatitude * Math.sin(longitudeDelta),
    y:
      Math.cos(viewLatitude) * Math.sin(latitude) -
      Math.sin(viewLatitude) * cosLatitude * Math.cos(longitudeDelta),
    z:
      Math.sin(viewLatitude) * Math.sin(latitude) +
      Math.cos(viewLatitude) * cosLatitude * Math.cos(longitudeDelta),
  };
}

function densify(contour: GeoPoint[], stepsPerEdge = 5) {
  const points: Coordinates[] = [];
  contour.forEach(([longitude, latitude], index) => {
    const [nextLongitude, nextLatitude] = contour[(index + 1) % contour.length];
    let longitudeDelta = nextLongitude - longitude;
    if (longitudeDelta > 180) longitudeDelta -= 360;
    if (longitudeDelta < -180) longitudeDelta += 360;

    for (let step = 0; step < stepsPerEdge; step += 1) {
      const progress = step / stepsPerEdge;
      points.push({
        longitude: longitude + longitudeDelta * progress,
        latitude: mix(latitude, nextLatitude, progress),
      });
    }
  });
  return points;
}

function clipToFront(points: ViewPoint[]) {
  const clipped: ViewPoint[] = [];
  points.forEach((current, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const currentVisible = current.z >= 0;
    const previousVisible = previous.z >= 0;

    if (currentVisible !== previousVisible) {
      const progress = previous.z / (previous.z - current.z);
      clipped.push({
        x: mix(previous.x, current.x, progress),
        y: mix(previous.y, current.y, progress),
        z: 0,
      });
    }
    if (currentVisible) clipped.push(current);
  });
  return clipped;
}

export default function HomeGlobe() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const sectionStyles = getComputedStyle(section);
    const token = (name: string, fallback: string) =>
      sectionStyles.getPropertyValue(name).trim() || fallback;
    const colors = {
      background: token("--bg", "#080b11"),
      surface: token("--surface-2", "#10151f"),
      border: token("--border-strong", "#2a3444"),
      grid: token("--text-faint", "#8793a4"),
      land: token("--text-soft", "#b2bdcb"),
      accent: token("--research", "#21b7a6"),
      accentBright: token("--research-bright", "#45e2ce"),
      text: token("--text", "#eef2f7"),
    };
    const monoFont = token(
      "--font-mono",
      'ui-monospace, "SFMono-Regular", Menlo, monospace',
    );

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia(
      `(max-width: ${HOME_GLOBE_SETTINGS.mobileBreakpoint}px)`,
    );
    let canvasWidth = 1;
    let canvasHeight = 1;
    let deviceScale = 1;

    const drawVisibleLine = (
      coordinates: Coordinates[],
      view: GlobeView,
      centerX: number,
      centerY: number,
      radius: number,
    ) => {
      context.beginPath();
      let drawing = false;
      coordinates.forEach((coordinate) => {
        const point = project(coordinate, view);
        if (point.z < 0) {
          drawing = false;
          return;
        }
        const x = centerX + point.x * radius;
        const y = centerY - point.y * radius;
        if (!drawing) {
          context.moveTo(x, y);
          drawing = true;
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    };

    const draw = (progress: number) => {
      const easedProgress = smoothstep(0, 1, progress);
      const view = {
        latitude: mix(
          HOME_GLOBE_SETTINGS.initialView.latitude,
          HOME_GLOBE_SETTINGS.finalView.latitude,
          easedProgress,
        ),
        longitude: mix(
          HOME_GLOBE_SETTINGS.initialView.longitude,
          HOME_GLOBE_SETTINGS.finalView.longitude,
          easedProgress,
        ),
      };

      context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const centerX = canvasWidth * 0.5;
      const centerY = canvasHeight * 0.49;
      const radius =
        Math.min(canvasWidth, canvasHeight) * HOME_GLOBE_SETTINGS.radiusScale;

      const glow = context.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.2,
        radius * 0.08,
        centerX,
        centerY,
        radius * 1.28,
      );
      glow.addColorStop(0, withAlpha(colors.accentBright, 0.16));
      glow.addColorStop(0.58, withAlpha(colors.accent, 0.055));
      glow.addColorStop(1, withAlpha(colors.background, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.22);
      context.strokeStyle = withAlpha(colors.accentBright, 0.16);
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.18, radius * 0.34, 0, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      const sphere = context.createRadialGradient(
        centerX - radius * 0.32,
        centerY - radius * 0.34,
        radius * 0.05,
        centerX,
        centerY,
        radius,
      );
      sphere.addColorStop(0, withAlpha(colors.accent, 0.13));
      sphere.addColorStop(0.5, colors.surface);
      sphere.addColorStop(1, colors.background);
      context.fillStyle = sphere;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.clip();

      context.strokeStyle = withAlpha(colors.grid, 0.24);
      context.lineWidth = 0.75;
      for (
        let latitude = -60;
        latitude <= 60;
        latitude += HOME_GLOBE_SETTINGS.gridInterval
      ) {
        const line: Coordinates[] = [];
        for (let longitude = -180; longitude <= 180; longitude += 2) {
          line.push({ latitude, longitude });
        }
        drawVisibleLine(line, view, centerX, centerY, radius);
      }
      for (
        let longitude = -180;
        longitude < 180;
        longitude += HOME_GLOBE_SETTINGS.gridInterval
      ) {
        const line: Coordinates[] = [];
        for (let latitude = -90; latitude <= 90; latitude += 2) {
          line.push({ latitude, longitude });
        }
        drawVisibleLine(line, view, centerX, centerY, radius);
      }

      LANDMASSES.forEach((landmass) => {
        const points = densify(landmass).map((coordinate) => project(coordinate, view));
        const visible = clipToFront(points);
        if (visible.length < 3) return;

        context.beginPath();
        visible.forEach((point, index) => {
          const x = centerX + point.x * radius;
          const y = centerY - point.y * radius;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.closePath();
        context.fillStyle = withAlpha(colors.land, 0.18);
        context.strokeStyle = withAlpha(colors.land, 0.5);
        context.lineWidth = 1;
        context.fill();
        context.stroke();
      });

      context.restore();

      context.strokeStyle = withAlpha(colors.border, 0.95);
      context.lineWidth = 1.25;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.stroke();

      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.22);
      context.strokeStyle = withAlpha(colors.accentBright, 0.44);
      context.lineWidth = 1.25;
      context.beginPath();
      context.ellipse(
        0,
        0,
        radius * 1.18,
        radius * 0.34,
        0,
        Math.PI * (0.1 + easedProgress * 0.42),
        Math.PI * (0.48 + easedProgress * 0.7),
      );
      context.stroke();
      context.restore();

      const home = project(HOME_GLOBE_SETTINGS.michigan, view);
      const markerStrength = smoothstep(0.48, 0.88, easedProgress) * clamp(home.z * 2);
      if (markerStrength > 0.01) {
        const markerX = centerX + home.x * radius;
        const markerY = centerY - home.y * radius;
        const emphasis = smoothstep(0.76, 1, easedProgress);

        context.strokeStyle = withAlpha(colors.accentBright, markerStrength * 0.75);
        context.lineWidth = 1.25;
        context.beginPath();
        context.arc(markerX, markerY, 7 + emphasis * 7, 0, Math.PI * 2);
        context.stroke();

        context.fillStyle = withAlpha(colors.accentBright, markerStrength);
        context.beginPath();
        context.arc(markerX, markerY, 3.2, 0, Math.PI * 2);
        context.fill();

        if (emphasis > 0.08) {
          const labelX = markerX + 17;
          const labelY = markerY - 14;
          context.font = `500 10px ${monoFont}`;
          context.textBaseline = "middle";
          const labelWidth = context.measureText(HOME_GLOBE_SETTINGS.michigan.label).width;
          context.fillStyle = withAlpha(colors.background, emphasis * 0.82);
          context.fillRect(labelX - 7, labelY - 10, labelWidth + 14, 20);
          context.strokeStyle = withAlpha(colors.accentBright, emphasis * 0.34);
          context.strokeRect(labelX - 7, labelY - 10, labelWidth + 14, 20);
          context.fillStyle = withAlpha(colors.text, emphasis);
          context.fillText(HOME_GLOBE_SETTINGS.michigan.label, labelX, labelY + 0.5);
        }
      }

      section.style.setProperty("--globe-progress", easedProgress.toFixed(4));
    };

    const render = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const difference = target - current;
      const next =
        Math.abs(difference) < 0.001
          ? target
          : current + difference * HOME_GLOBE_SETTINGS.scrollSmoothing;
      currentProgressRef.current = next;
      draw(next);

      if (next !== target) animationFrameRef.current = requestAnimationFrame(render);
      else animationFrameRef.current = 0;
    };

    const requestDraw = () => {
      if (!animationFrameRef.current) animationFrameRef.current = requestAnimationFrame(render);
    };

    const updateProgress = () => {
      if (reducedMotion.matches || compactLayout.matches) {
        targetProgressRef.current = 1;
        currentProgressRef.current = 1;
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
        draw(1);
        return;
      } else {
        const rect = section.getBoundingClientRect();
        const stickyTop =
          Number.parseFloat(rootStyles.getPropertyValue("--nav-h")) || 0;
        const travel = Math.max(1, section.offsetHeight - (window.innerHeight - stickyTop));
        targetProgressRef.current = clamp((stickyTop - rect.top) / travel);
      }
      requestDraw();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = Math.max(1, rect.width);
      canvasHeight = Math.max(1, rect.height);
      canvas.width = Math.round(canvasWidth * deviceScale);
      canvas.height = Math.round(canvasHeight * deviceScale);
      updateProgress();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", updateProgress);
    compactLayout.addEventListener("change", updateProgress);
    resize();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", updateProgress);
      compactLayout.removeEventListener("change", updateProgress);
    };
  }, []);

  return (
    <section ref={sectionRef} className="home-globe" aria-labelledby="home-globe-title">
      <div className="container home-globe__stage">
        <div className="home-globe__copy">
          <span className="home-globe__kicker">Home coordinates · 44.3° N, 85.6° W</span>
          <h2 id="home-globe-title">
            From Michigan,
            <em> looking outward.</em>
          </h2>
          <p>
            A fixed point on a wider map—where research, community, and curiosity begin.
          </p>
          <div className="home-globe__progress" aria-hidden="true">
            <span />
          </div>
          <span className="home-globe__instruction">Scroll to locate home</span>
        </div>

        <figure className="home-globe__figure">
          <canvas
            ref={canvasRef}
            className="home-globe__canvas"
            role="img"
            aria-label="A stylized globe rotating from a world view to Michigan at 44.3 degrees north and 85.6 degrees west."
          >
            Stylized globe centered on Michigan.
          </canvas>
          <figcaption>
            <span>World view</span>
            <span aria-hidden="true">→</span>
            <span>Michigan · Home</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
