import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/site";
import "./hero.css";

/* ============================================================
   Hero — content composed over the shared FieldCanvas scene.
   A large stacked wordmark anchors the lower-left; a compact
   auto-cycling wayfinder to the side draws the eye into the
   site's sections and reacts magnetically to the pointer.
   ============================================================ */

const DESTS = [
  { to: "/portfolio", n: "01", label: "Portfolio", desc: "Research, software & film" },
  { to: "/publications", n: "02", label: "Publications", desc: "Peer-reviewed papers" },
  { to: "/about", n: "03", label: "About", desc: "Background & interests" },
];
const CYCLE_MS = 3400;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % DESTS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, active]);

  const magnetic = window.matchMedia?.("(hover: hover)").matches &&
    !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onWayMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 7;
    el.style.setProperty("--mx", mx.toFixed(1) + "px");
    el.style.setProperty("--my", my.toFixed(1) + "px");
  };
  const onWayLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--mx", "0px");
    e.currentTarget.style.setProperty("--my", "0px");
  };

  const [first, last] = site.name.split(" ");
  const roleParts = site.role.split("·").map((s) => s.trim());

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__top container">
        <p className="hero__eyebrow">
          <span className="spectral-tick" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
          <span className="hero__eyebrow-text">
            {roleParts.map((r, i) => (
              <span key={r}>
                {r}
                {i < roleParts.length - 1 && <b aria-hidden="true"> / </b>}
              </span>
            ))}
          </span>
        </p>
        <div className="hero__coords" aria-hidden="true">
          <span>42.5764° N</span>
          <span>83.2432° W</span>
        </div>
      </div>

      <div className="hero__bottom container">
        <h1 className="hero__wordmark">
          <span className="hero__word" style={{ animationDelay: "0.05s" }}>
            {first}
          </span>
          <span className="hero__word hero__word--accent" style={{ animationDelay: "0.16s" }}>
            {last}
            <b className="hero__star" aria-hidden="true">*</b>
          </span>
        </h1>

        <div className="hero__aside">
          <p className="hero__lede">
            Computer-vision &amp; hyperspectral-imaging research, software that ships, and
            award-winning documentary film.
          </p>

          <nav
            className="hero__wayfind"
            aria-label="Explore the site"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {DESTS.map((d, i) => (
              <Link
                key={d.to}
                to={d.to}
                className={`hero__way ${i === active ? "is-active" : ""}`}
                onPointerMove={onWayMove}
                onPointerLeave={onWayLeave}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="hero__way-n" aria-hidden="true">
                  {d.n}
                </span>
                <span className="hero__way-text">
                  <span className="hero__way-label">{d.label}</span>
                  <span className="hero__way-desc">{d.desc}</span>
                </span>
                <span className="hero__way-arrow" aria-hidden="true">
                  →
                </span>
                {i === active && (
                  <span key={active} className="hero__way-prog" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <a href="#explore" className="hero__scroll" aria-label="Scroll to explore">
        <span>Scroll</span>
        <svg viewBox="0 0 16 24" width="12" height="18" aria-hidden="true">
          <path
            d="M8 2v18M2 14l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
