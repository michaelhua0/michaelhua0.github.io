import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { projects } from "../data/projects";
import "./portfolio.css";

export default function Portfolio() {
  return (
    <>
      <SEO title="Portfolio" path="/portfolio" description="Michael Hua's research, app, and documentary projects." />
      <PageHeader eyebrow="Projects" title="Portfolio">
        <p className="portfolio__note">
          Note: Please click the corresponding image or text for each project to get redirected to
          its dedicated project page!
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
