import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./nav.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/publications", label: "Publications" },
];

export default function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Trap-lite: close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header className={`nav ${transparent ? "nav--transparent" : "nav--solid"}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Michael Hua — home">
          <span className="nav__mono" aria-hidden="true">
            <span className="spectral-tick">
              <i /><i /><i /><i /><i /><i />
            </span>
          </span>
          <span className="nav__name">Michael Hua</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={`nav__burger ${open ? "is-open" : ""}`} aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`nav__mobile ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              ref={i === 0 ? firstLinkRef : undefined}
              className={({ isActive }) => `nav__mobile-link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
