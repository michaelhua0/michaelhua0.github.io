import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import RichBlocks from "../components/RichBlocks";
import SmartImage from "../components/SmartImage";
import SpectralSignature from "../components/SpectralSignature";
import { getProject, projects } from "../data/projects";
import { imageSrcSet, imageUrl } from "../lib/images";
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
          <SpectralSignature
            domain={project.domain}
            showLabel
            className="spectral-sig--lg project__sig"
          />
        </header>

        {!leadsWithVideo && (
          <div className="project__lead">
            <SmartImage
              src={project.image}
              alt={project.imageAlt}
              motif={project.motif}
              ratio={project.imageRatio ?? "16 / 9"}
              fit={project.imageFit}
              imageBackground={project.imageBackground}
              sources={project.imageSources}
              priority
            />
          </div>
        )}

        <div className="project__body">
          <RichBlocks blocks={project.body} />
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <section className="project__gallery" aria-labelledby="project-gallery-title">
            <header className="project__gallery-head">
              <div>
                <span className="project__gallery-kicker">Photo journal</span>
                <h2 id="project-gallery-title">Regeneron ISEF 2026</h2>
              </div>
              <p>Recognition, people, and a few moments beyond the project board.</p>
            </header>
            <div className="project__gallery-grid">
              {project.gallery.map((photo) => (
                <figure key={photo.src} className="project__gallery-photo">
                  <img
                    src={imageUrl(photo.src)}
                    srcSet={imageSrcSet(photo.sources)}
                    sizes="(max-width: 640px) 100vw, 600px"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

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
