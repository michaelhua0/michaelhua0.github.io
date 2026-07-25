import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./scantransition.css";

/* ============================================================
   ScanTransition — the pushbroom sensor sweeping the frame on
   every navigation. A single bright scanline crosses the
   viewport once when the route changes: the site's signature
   "acquiring the next page" gesture. Skips the first paint and
   honors reduced-motion.
   ============================================================ */

export default function ScanTransition() {
  const { pathname } = useLocation();
  const [run, setRun] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRun((n) => n + 1);
  }, [pathname]);

  if (run === 0) return null;

  return (
    <div className="scanfx" aria-hidden="true">
      {/* keyed so the one-shot animation replays on each navigation */}
      <span key={run} className="scanfx__line" />
    </div>
  );
}
