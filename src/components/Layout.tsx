import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import ScanTransition from "./ScanTransition";
import SpectralRail from "./SpectralRail";

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Scroll to top on navigation, or focus a hash target if present.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (el instanceof HTMLElement) {
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScanTransition />
      <SpectralRail />
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
