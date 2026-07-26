import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import SmartImage from "./SmartImage";
import SpectralSignature from "./SpectralSignature";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./projectcard.css";

export default function ProjectCard({
  project,
  index,
  titleAs = "h3",
}: {
  project: Project;
  index: number;
  titleAs?: "h2" | "h3";
}) {
  const Title = titleAs;
  const { ref, inView } = useInView<HTMLAnchorElement>();
  const fig = `FIG.${String(index + 1).padStart(2, "0")}`;
  const reducedMotion = usePrefersReducedMotion();

  return (
    <article className={`pcard cat-${project.category}`}>
      <Link ref={ref} to={`/portfolio/${project.slug}`} className="pcard__link">
        <div
          className={`pcard__media figure figure__ticks scan ${reducedMotion ? "" : "is-armed"} ${inView ? "is-shown" : ""}`}
          style={{ aspectRatio: project.imageRatio ?? "16 / 10" }}
        >
          <div className="scan__media">
            <SmartImage
              src={project.image}
              alt={project.cardTitle}
              motif={project.motif}
              ratio={project.imageRatio ?? "16 / 10"}
              fit={project.imageFit}
              imageBackground={project.imageBackground}
              sources={project.imageSources}
              priority={index === 0}
            />
          </div>
          <span className="scan__line" aria-hidden="true" />
          <span className="pcard__fig" aria-hidden="true">{fig}</span>
        </div>

        <div className="pcard__body">
          <span className="pcard__sig-row">
            <SpectralSignature domain={project.domain} seed={project.slug} className="pcard__sig" />
            <span className="pcard__tag">{project.tag}</span>
          </span>
          <Title className="pcard__title long-title">{project.cardTitle}</Title>
          <p className="pcard__teaser">{project.teaser}</p>
          <span className="pcard__cta" aria-hidden="true">
            Open figure <span className="arrow">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
