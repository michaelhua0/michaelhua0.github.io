import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import SmartImage from "./SmartImage";
import SpectralSignature from "./SpectralSignature";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./projectcard.css";

export default function ProjectCard({
  project,
  priority = false,
  titleAs = "h3",
}: {
  project: Project;
  priority?: boolean;
  titleAs?: "h2" | "h3";
}) {
  const Title = titleAs;
  const { ref, inView } = useInView<HTMLAnchorElement>();
  const reducedMotion = usePrefersReducedMotion();
  const scanEnabled = project.scanReveal === true;

  return (
    <article className={`pcard cat-${project.category}`}>
      <Link ref={ref} to={`/portfolio/${project.slug}`} className="pcard__link">
        <div
          className={`pcard__media figure ${scanEnabled ? "scan" : ""} ${scanEnabled && !reducedMotion ? "is-armed" : ""} ${scanEnabled && inView ? "is-shown" : ""}`}
          style={{ aspectRatio: project.imageRatio ?? "16 / 10" }}
        >
          <div className={scanEnabled ? "scan__media" : "pcard__media-inner"}>
            <SmartImage
              src={project.image}
              alt={project.imageAlt}
              motif={project.motif}
              ratio={project.imageRatio ?? "16 / 10"}
              fit={project.imageFit}
              imageBackground={project.imageBackground}
              sources={project.imageSources}
              priority={priority}
            />
          </div>
          {scanEnabled && <span className="scan__line" aria-hidden="true" />}
        </div>

        <div className="pcard__body">
          <span className="pcard__sig-row">
            <SpectralSignature domain={project.domain} className="pcard__sig" />
            <span className="pcard__tag readout readout--quiet">{project.tag}</span>
          </span>
          <Title className="pcard__title long-title">{project.cardTitle}</Title>
          <p className="pcard__teaser">{project.teaser}</p>
          <span className="pcard__cta readout" aria-hidden="true">
            View project <span className="arrow">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
