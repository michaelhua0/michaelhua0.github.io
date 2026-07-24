import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { bio, site } from "../data/site";
import { projects } from "../data/projects";
import "./home.css";

const destinations = [
  {
    to: "/about",
    label: "About",
    blurb: "The person behind the research — student, fencer, and volunteer.",
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    blurb: "AI research, an app, a documentary, and a YouTube channel.",
  },
  {
    to: "/publications",
    label: "Publications",
    blurb: "Peer-reviewed and competition papers, with full text.",
  },
];

export default function Home() {
  const peek = projects.slice(0, 3);

  return (
    <>
      <SEO title={site.name} path="/" />
      <Hero />

      {/* About Me intro */}
      <section id="explore" className="section home-intro" aria-labelledby="about-me-heading">
        <div className="container home-intro__grid">
          <div className="home-intro__label">
            <span className="spectral-tick" aria-hidden="true">
              <i /><i /><i /><i /><i /><i />
            </span>
            <h2 id="about-me-heading" className="home-intro__heading">
              About Me
            </h2>
          </div>
          <div className="home-intro__copy">
            {bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <Link to="/about" className="btn">
              More about Michael <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Three destinations */}
      <section className="section--tight home-dest" aria-label="Explore the site">
        <div className="container">
          <div className="home-dest__grid">
            {destinations.map((d, i) => (
              <Reveal key={d.to} delay={i * 80} className="home-dest__cell">
              <Link to={d.to} className="home-dest__card">
                <span className="home-dest__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="home-dest__title">{d.label}</h3>
                <p className="home-dest__blurb">{d.blurb}</p>
                <span className="home-dest__cta" aria-hidden="true">
                  Enter <span className="arrow">→</span>
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work peek */}
      <section className="section home-work" aria-labelledby="selected-work-heading">
        <div className="container">
          <div className="home-work__head">
            <h2 id="selected-work-heading">Selected work</h2>
            <Link to="/portfolio" className="home-work__all">
              All projects <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="home-work__grid">
            {peek.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
