import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { projects } from "../data/projects";
import "./portfolio.css";

export default function Portfolio() {
  return (
    <>
      <SEO
        title="Portfolio"
        path="/portfolio"
        description="Selected research, software, and documentary projects by Michael Hua."
      />
      <PageHeader eyebrow="Selected Work" title="Research and Creative Portfolio">
        <p className="portfolio__note">
          Explore work in artificial intelligence, hyperspectral imaging, software development,
          and documentary history. Select a project to review its methods, results, and supporting
          materials.
        </p>
      </PageHeader>

      <section className="section--tight">
        <div className="container">
          <div className="portfolio__grid">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 80}>
                <ProjectCard project={p} index={i} titleAs="h2" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
