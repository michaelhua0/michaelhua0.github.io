import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "./notfound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <SEO title="Not found" />
      <div className="container notfound__inner">
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">Page not found</h1>
        <p className="notfound__lead">
          The address may be incorrect, or the page may have moved.
        </p>
        <div className="notfound__links">
          <Link to="/" className="btn btn--primary">
            <span className="btn__label">Return home</span>
          </Link>
          <Link to="/portfolio" className="btn">
            <span className="btn__label">Browse projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
