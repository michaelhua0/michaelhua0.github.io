import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import SmartImage from "./SmartImage";
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
  return (
    <article className={`pcard cat-${project.category}`}>
      <Link to={`/portfolio/${project.slug}`} className="pcard__link">
        <div className="pcard__media">
          <SmartImage
            src={project.image}
            alt={project.cardTitle}
            motif={project.motif}
            ratio="16 / 10"
          />
          <span className="pcard__num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="pcard__body">
          <span className="pcard__tag">
            <span className="pcard__cat-dot" aria-hidden="true" />
            {project.tag}
          </span>
          <Title className="pcard__title long-title">{project.cardTitle}</Title>
          <p className="pcard__teaser">{project.teaser}</p>
          <span className="pcard__cta" aria-hidden="true">
            View project <span className="arrow">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
