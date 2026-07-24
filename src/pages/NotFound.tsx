import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "./notfound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <SEO title="Not found" />
      <div className="container notfound__inner">
        <span className="spectral-tick" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </span>
        <p className="notfound__code">404</p>
        <h1 className="notfound__title">This page drifted off the graph</h1>
        <p className="notfound__lead">The page you're looking for doesn't exist.</p>
        <div className="notfound__links">
          <Link to="/" className="btn btn--primary">Back to home</Link>
          <Link to="/portfolio" className="btn">View portfolio</Link>
        </div>
      </div>
    </div>
  );
}
