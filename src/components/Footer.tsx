import { Link } from "react-router-dom";
import CTISCameraMark from "./CTISCameraMark";
import ContactLinks from "./ContactLinks";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <CTISCameraMark className="footer__mark" />
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <Link className="mono-copy" to="/">Home</Link>
          <Link className="mono-copy" to="/about">About</Link>
          <Link className="mono-copy" to="/portfolio">Portfolio</Link>
          <Link className="mono-copy" to="/publications">Publications</Link>
          <a
            className="mono-copy"
            href="https://www.youtube.com/@HistorysTrigger"
            target="_blank"
            rel="noopener noreferrer"
          >
            History's Trigger
          </a>
        </nav>
        <div className="footer__contact">
          <p className="footer__label readout readout--quiet">Contact</p>
          <ContactLinks className="footer__contacts" />
        </div>
        <p className="footer__meta mono-copy">© {year} Michael Hua</p>
      </div>
    </footer>
  );
}
