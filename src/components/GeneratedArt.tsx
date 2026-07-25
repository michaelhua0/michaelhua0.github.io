import { useMemo } from "react";
import { SPECTRUM_RAMP } from "../data/spectrum";

type Motif = "spectral" | "vessel" | "point-cloud" | "app" | "documentary" | "channel";

/** Tiny seeded PRNG so art is deterministic per seed. */
function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const hash = (str: string) =>
  Array.from(str).reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7);

// Draws from the one canonical spectral ramp (mirrors the CSS --band-* tokens).
const bands = SPECTRUM_RAMP;

export default function GeneratedArt({
  motif,
  seed = "seed",
}: {
  motif: Motif;
  seed?: string;
}) {
  const rng = useMemo(() => makeRng(hash(seed) || 1), [seed]);
  const W = 800;
  const H = 600;

  const content = useMemo(() => {
    switch (motif) {
      case "spectral": {
        // Stacked hyperspectral bands sliced like a datacube.
        const rows = 16;
        return (
          <g>
            {Array.from({ length: rows }).map((_, i) => {
              const y = (H / rows) * i;
              const c = bands[i % bands.length];
              const w = W * (0.55 + rng() * 0.45);
              return (
                <rect
                  key={i}
                  x={0}
                  y={y + 2}
                  width={w}
                  height={H / rows - 4}
                  fill={c}
                  opacity={0.14 + (i / rows) * 0.5}
                  rx={2}
                />
              );
            })}
          </g>
        );
      }
      case "vessel": {
        // Branching vessel network from a root.
        const paths: React.ReactNode[] = [];
        const branch = (
          x: number,
          y: number,
          angle: number,
          len: number,
          depth: number,
          key: string,
        ) => {
          if (depth === 0 || len < 8) return;
          const nx = x + Math.cos(angle) * len;
          const ny = y + Math.sin(angle) * len;
          paths.push(
            <line
              key={key}
              x1={x}
              y1={y}
              x2={nx}
              y2={ny}
              stroke={bands[2]}
              strokeWidth={depth * 0.9}
              strokeLinecap="round"
              opacity={0.35 + depth * 0.09}
            />,
          );
          paths.push(<circle key={key + "n"} cx={nx} cy={ny} r={depth * 0.7} fill={bands[3]} opacity={0.5} />);
          branch(nx, ny, angle - (0.3 + rng() * 0.4), len * 0.78, depth - 1, key + "L");
          branch(nx, ny, angle + (0.3 + rng() * 0.4), len * 0.78, depth - 1, key + "R");
        };
        branch(W * 0.15, H * 0.85, -0.9, 130, 6, "root");
        branch(W * 0.85, H * 0.2, 2.2, 110, 5, "root2");
        return <g>{paths}</g>;
      }
      case "point-cloud": {
        // Points condensing toward a soft centroid.
        const pts = Array.from({ length: 260 });
        return (
          <g>
            {pts.map((_, i) => {
              const a = rng() * Math.PI * 2;
              const r = Math.pow(rng(), 0.6) * 260;
              const cx = W / 2 + Math.cos(a) * r;
              const cy = H / 2 + Math.sin(a) * r * 0.8;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={0.8 + rng() * 2.4}
                  fill={bands[(i % bands.length)]}
                  opacity={0.35 + rng() * 0.5}
                />
              );
            })}
          </g>
        );
      }
      case "app": {
        // Sensor-linked device schematic.
        const nodes = Array.from({ length: 7 }).map(() => ({
          x: 120 + rng() * (W - 240),
          y: 90 + rng() * (H - 180),
        }));
        return (
          <g>
            <rect x={W / 2 - 90} y={H / 2 - 150} width={180} height={300} rx={22} fill="none" stroke={bands[2]} strokeWidth={3} opacity={0.8} />
            <rect x={W / 2 - 74} y={H / 2 - 126} width={148} height={230} rx={8} fill={bands[2]} opacity={0.12} />
            {nodes.map((n, i) => (
              <g key={i}>
                <line x1={W / 2} y1={H / 2} x2={n.x} y2={n.y} stroke={bands[3]} strokeWidth={1.5} opacity={0.4} />
                <circle cx={n.x} cy={n.y} r={7} fill={bands[i % 2 ? 3 : 4]} opacity={0.85} />
              </g>
            ))}
          </g>
        );
      }
      case "documentary":
      case "channel": {
        // Archival film strip.
        const frames = 5;
        const fw = (W - 80) / frames;
        return (
          <g>
            <rect x={0} y={H / 2 - 130} width={W} height={260} fill={bands[4]} opacity={0.1} />
            {Array.from({ length: frames }).map((_, i) => (
              <rect
                key={i}
                x={40 + i * fw + 8}
                y={H / 2 - 90}
                width={fw - 16}
                height={180}
                rx={6}
                fill="none"
                stroke={bands[4]}
                strokeWidth={2}
                opacity={0.7}
              />
            ))}
            {/* perforations */}
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={"p" + i}>
                <rect x={20 + i * (W / 20)} y={H / 2 - 122} width={14} height={10} rx={2} fill={bands[5]} opacity={0.5} />
                <rect x={20 + i * (W / 20)} y={H / 2 + 112} width={14} height={10} rx={2} fill={bands[5]} opacity={0.5} />
              </g>
            ))}
            {motif === "channel" && (
              <g>
                <circle cx={W / 2} cy={H / 2} r={46} fill={bands[5]} opacity={0.9} />
                <path d={`M ${W / 2 - 14} ${H / 2 - 22} L ${W / 2 + 26} ${H / 2} L ${W / 2 - 14} ${H / 2 + 22} Z`} fill="#fff" />
              </g>
            )}
          </g>
        );
      }
    }
  }, [motif, rng]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="img"
      aria-hidden="true"
      style={{ display: "block", background: "var(--ink-2)" }}
    >
      {content}
    </svg>
  );
}
