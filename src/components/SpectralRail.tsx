import { useEffect, useRef, useState } from "react";
import { SPECTRUM_RAMP } from "../data/spectrum";
import "./spectralrail.css";

/* ============================================================
   SpectralRail — the instrument spine. A fixed wavelength ruler
   in the left page margin that maps scroll progress onto the
   400–700 nm spectrum: the marker slides down the ramp and reads
   out the current wavelength as you move through the page. It
   lives in the outer margin (desktop only) so it never overlaps
   content, and is decorative (aria-hidden) — a persistent sense
   of "where on the spectrum am I."
   ============================================================ */

const NM_MIN = 400;
const NM_MAX = 700;

function hexLerp(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
function rampAt(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (SPECTRUM_RAMP.length - 1);
  const i = Math.floor(x);
  return hexLerp(SPECTRUM_RAMP[i], SPECTRUM_RAMP[i + 1], x - i);
}

const TRACK = `linear-gradient(180deg, ${SPECTRUM_RAMP.join(", ")})`;

export default function SpectralRail() {
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const nm = Math.round(NM_MIN + p * (NM_MAX - NM_MIN));
  const color = rampAt(p);

  return (
    <div className="rail" aria-hidden="true">
      <span className="rail__cap rail__cap--top">{NM_MIN}</span>
      <div className="rail__track" style={{ backgroundImage: TRACK }}>
        <span
          className="rail__marker"
          style={{ top: `${p * 100}%`, ["--rail-color" as string]: color }}
        >
          <span className="rail__readout">λ{nm}</span>
        </span>
      </div>
      <span className="rail__cap rail__cap--bot">{NM_MAX}</span>
      <span className="rail__unit">nm</span>
    </div>
  );
}
