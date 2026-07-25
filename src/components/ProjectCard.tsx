import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import SmartImage from "./SmartImage";
import SpectralSignature from "./SpectralSignature";
import { useInView } from "../hooks/useInView";
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

  // Arm the wipe only once JS runs and motion is allowed.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setArmed(true);
  }, []);

  return (
    <article className={`pcard cat-${project.category}`}>
      <Link ref={ref} to={`/portfolio/${project.slug}`} className="pcard__link">
        <div
          className={`pcard__media figure figure__ticks scan ${armed ? "is-armed" : ""} ${inView ? "is-shown" : ""}`}
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
            />
            {project.cardMedia === "video" && (
              <span className="pcard__video-mark" aria-hidden="true">
                <svg viewBox="0 0 68 48" width="68" height="48">
                  <path
                    d="M66.5 7.7c-.8-3-2.5-4.7-5.4-5.5C55.5 1 34 1 34 1S12.5 1 6.9 2.2c-2.9.8-4.6 2.5-5.4 5.5C0 13.3 0 24 0 24s0 10.7 1.5 16.3c.8 3 2.5 4.7 5.4 5.5C12.5 47 34 47 34 47s21.5 0 27.1-1.2c2.9-.8 4.6-2.5 5.4-5.5C68 34.7 68 24 68 24s0-10.7-1.5-16.3z"
                    fill="#e5484d"
                  />
                  <path d="M27 34l18-10-18-10z" fill="#fff" />
                </svg>
              </span>
            )}
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
