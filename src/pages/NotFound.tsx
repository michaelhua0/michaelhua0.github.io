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
          <Link to="/" className="btn btn--primary">Return home</Link>
          <Link to="/portfolio" className="btn">Browse projects</Link>
        </div>
      </div>
    </div>
  );
}
