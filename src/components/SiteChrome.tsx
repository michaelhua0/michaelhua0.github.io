import { useEffect, useRef } from "react";
import "./chrome.css";

/* Instrument shell: viewfinder crop-marks at the corners and a live
   scroll readout on the right edge. Decorative and inert (pointer-events
   none); the readout reports genuine scroll position, not decoration. */
export default function SiteChrome() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!fill || !pct) return;
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      pct.textContent = String(Math.round(p * 100)).padStart(2, "0");
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="chrome" aria-hidden="true">
      <span className="chrome__crop chrome__crop--tl" />
      <span className="chrome__crop chrome__crop--tr" />
      <span className="chrome__crop chrome__crop--bl" />
      <span className="chrome__crop chrome__crop--br" />

      <div className="chrome__gauge">
        <span className="chrome__gauge-label">SCROLL</span>
        <div className="chrome__gauge-track">
          <div className="chrome__gauge-fill" ref={fillRef} />
        </div>
        <span className="chrome__gauge-pct">
          <span ref={pctRef}>00</span>%
        </span>
      </div>
    </div>
  );
}
