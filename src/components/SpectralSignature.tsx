import { useMemo } from "react";
import { SPECTRUM_RAMP, bandOf, type Domain } from "../data/spectrum";
import "./spectralsignature.css";

/* ============================================================
   SpectralSignature — a project's identity mark on the spine.

   Renders the 400–700 nm axis with a deterministic set of faint
   "emission lines" (seeded from the slug, so every project has a
   unique fingerprint) and one bright marker at the project's
   domain wavelength. The same mark rides the card, the detail
   header, and — later — the publications index, tying every
   surface to one coordinate system.
   ============================================================ */

const NM_MIN = 400;
const NM_MAX = 700;
const SPAN = NM_MAX - NM_MIN;

/** Deterministic 0..1 stream from a string seed (mulberry-style). */
function seededStream(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function hexLerp(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** Sample the spectral ramp at t in [0,1]. */
function rampAt(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (SPECTRUM_RAMP.length - 1);
  const i = Math.floor(x);
  return hexLerp(SPECTRUM_RAMP[i], SPECTRUM_RAMP[i + 1], x - i);
}

export default function SpectralSignature({
  domain,
  seed,
  showLabel = false,
  className = "",
}: {
  domain: Domain;
  seed: string;
  showLabel?: boolean;
  className?: string;
}) {
  const band = bandOf(domain);

  const lines = useMemo(() => {
    const rnd = seededStream(seed);
    const count = 5 + Math.floor(rnd() * 3); // 5–7 emission lines
    return Array.from({ length: count }, () => {
      const nm = NM_MIN + 18 + rnd() * (SPAN - 36);
      return { nm, h: 5 + rnd() * 8, o: 0.28 + rnd() * 0.34 };
    });
  }, [seed]);

  const markX = band.nm - NM_MIN;

  return (
    <span
      className={`spectral-sig ${className}`}
      style={{ ["--sig-color" as string]: band.color }}
      aria-hidden="true"
    >
      <svg
        className="spectral-sig__svg"
        viewBox={`0 0 ${SPAN} 40`}
        preserveAspectRatio="none"
        role="presentation"
      >
        {/* baseline axis */}
        <line x1="0" y1="34" x2={SPAN} y2="34" className="spectral-sig__axis" />
        {/* 50 nm ticks */}
        {[450, 500, 550, 600, 650].map((nm) => (
          <line
            key={nm}
            x1={nm - NM_MIN}
            y1="32"
            x2={nm - NM_MIN}
            y2="36"
            className="spectral-sig__tick"
          />
        ))}
        {/* seeded emission lines — the fingerprint */}
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.nm - NM_MIN}
            y1={34 - l.h}
            x2={l.nm - NM_MIN}
            y2="34"
            stroke={rampAt((l.nm - NM_MIN) / SPAN)}
            strokeOpacity={l.o}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* the domain marker — bright, glowing */}
        <line
          x1={markX}
          y1="34"
          x2={markX}
          y2="6"
          className="spectral-sig__mark-glow"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={markX}
          y1="34"
          x2={markX}
          y2="6"
          className="spectral-sig__mark"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={markX} cy="6" r="2.4" className="spectral-sig__dot" />
      </svg>
      {showLabel && (
        <span className="spectral-sig__label">
          λ{band.nm} · BAND&nbsp;{band.n}
        </span>
      )}
    </span>
  );
}
