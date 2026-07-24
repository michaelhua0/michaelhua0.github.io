import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import RichBlocks from "../components/RichBlocks";
import SmartImage from "../components/SmartImage";
import { getProject, projects } from "../data/projects";
import NotFound from "./NotFound";
import "./projectdetail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug ?? "");

  if (!project) return <NotFound />;

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  const leadsWithVideo = project.body[0]?.kind === "video";

  return (
    <div className={`project cat-${project.category}`}>
      <SEO
        title={project.detailTitle}
        path={`/portfolio/${project.slug}`}
        description={project.teaser}
      />

      <div className="container project__inner">
        <nav className="project__crumbs" aria-label="Breadcrumb">
          <Link to="/portfolio">Portfolio</Link>
          <span aria-hidden="true">/</span>
          <span className="project__crumb-current">{project.detailTitle}</span>
        </nav>

        <header className="project__header">
          <span className="project__tag">
            <span className="project__cat-dot" aria-hidden="true" />
            {project.tag}
          </span>
          <h1 className="project__title long-title">{project.detailTitle}</h1>
        </header>

        {!leadsWithVideo && (
          <div className="project__lead">
            <SmartImage
              src={project.image}
              alt={project.detailTitle}
              motif={project.motif}
              ratio="16 / 9"
            />
          </div>
        )}

        <div className="project__body">
          <RichBlocks blocks={project.body} />
        </div>

        <nav className="project__pager" aria-label="More projects">
          {prev ? (
            <Link to={`/portfolio/${prev.slug}`} className="project__pager-link project__pager-prev">
              <span className="project__pager-dir" aria-hidden="true">← Previous</span>
              <span className="project__pager-name">{prev.cardTitle}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/portfolio/${next.slug}`} className="project__pager-link project__pager-next">
              <span className="project__pager-dir" aria-hidden="true">Next →</span>
              <span className="project__pager-name">{next.cardTitle}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
