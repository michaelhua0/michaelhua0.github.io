import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { projects } from "../data/projects";
import { pageMetadata } from "../data/routeMetadata.js";
import "./portfolio.css";

export default function Portfolio() {
  return (
    <>
      <SEO {...pageMetadata.portfolio} />
      <PageHeader eyebrow="Selected Work" title="Research and Creative Portfolio">
        <ul className="portfolio__legend" aria-label="Project categories">
          <li>
            <span className="portfolio__legend-mark portfolio__legend-mark--research" />
            Research and software
          </li>
          <li>
            <span className="portfolio__legend-mark portfolio__legend-mark--history" />
            History and documentary
          </li>
        </ul>
      </PageHeader>

      <section className="section--tight">
        <div className="container">
          {projects.length > 0 ? (
            <div className="portfolio__grid">
              {projects.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 80}>
                  <ProjectCard project={p} priority={i === 0} titleAs="h2" />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="empty-state">No projects are available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
