import { Link } from "react-router-dom";
import CTISMark from "./CTISMark";
import "./footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <CTISMark className="footer__mark" />
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/publications">Publications</Link>
          <a href="https://www.youtube.com/@HistorysTrigger" target="_blank" rel="noopener noreferrer">
            History's Trigger
          </a>
        </nav>
        <p className="footer__meta">© {year} Michael Hua</p>
      </div>
    </footer>
  );
}
