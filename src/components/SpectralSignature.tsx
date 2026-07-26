import { bandOf, type Domain } from "../data/spectrum";
import "./spectralsignature.css";

/* ============================================================
   SpectralSignature — a project's identity mark on the spine.

   Renders one marker from the existing domain map. No simulated
   peaks or per-project measurements are drawn.
   ============================================================ */

const NM_MIN = 400;
const NM_MAX = 700;
const SPAN = NM_MAX - NM_MIN;

export default function SpectralSignature({
  domain,
  showLabel = false,
  className = "",
}: {
  domain: Domain;
  showLabel?: boolean;
  className?: string;
}) {
  const band = bandOf(domain);
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
        <span className="spectral-sig__label">{band.label}</span>
      )}
    </span>
  );
}
