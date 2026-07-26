import { useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import Nav from "./Nav";
import Footer from "./Footer";

const SCROLL_POSITIONS_KEY = "mh:scroll-positions";

function readScrollPositions(): Record<string, [number, number]> {
  try {
    const stored = sessionStorage.getItem(SCROLL_POSITIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveScrollPosition(key: string) {
  try {
    const positions = readScrollPositions();
    positions[key] = [window.scrollX, window.scrollY];
    sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
}

export default function Layout() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const reducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const save = () => saveScrollPosition(key);
    window.addEventListener("pagehide", save);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
    };
  }, [key]);

  // Scroll to top on navigation, or focus a hash target if present.
  useLayoutEffect(() => {
    if (hash) {
      try {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({
            behavior: reducedMotionRef.current ? "instant" : "smooth",
            block: "start",
          });
          if (el instanceof HTMLElement) {
            el.setAttribute("tabindex", "-1");
            el.focus({ preventScroll: true });
          }
          return;
        }
      } catch {
        // Invalid fragments (including a bare "#") fall back to the page top.
      }
    }
    const saved = navigationType === "POP" ? readScrollPositions()[key] : undefined;
    window.scrollTo({
      top: saved?.[1] ?? 0,
      left: saved?.[0] ?? 0,
      behavior: "instant",
    });
  }, [hash, key, navigationType, pathname]);

  return (
    <>
      <a href="#main" className="skip-link readout readout--strong">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="reading-surface">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
