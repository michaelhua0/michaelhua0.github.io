import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import SectionHead from "../components/SectionHead";
import ProjectCard from "../components/ProjectCard";
import { bio, site } from "../data/site";
import { projects } from "../data/projects";
import { publications } from "../data/publications";
import "./home.css";

const sheet: [string, string][] = [
  ["Field", "Computer vision · Hyperspectral imaging"],
  ["Institution", "Cranbrook Schools"],
  ["Also", "Documentary film · Saber fencing"],
  ["Based", "Bloomfield Hills, Michigan"],
];

const directory = [
  { to: "/about", label: "About", desc: "Background, research interests & service", note: "profile" },
  { to: "/portfolio", label: "Portfolio", desc: "Research, software & documentary work", note: `${projects.length} projects` },
  { to: "/publications", label: "Publications", desc: "Peer-reviewed & competition papers", note: `${publications.length} papers` },
];

export default function Home() {
  const peek = projects.slice(0, 3);

  return (
    <>
      <SEO title={site.name} path="/" />
      <Hero />

      <div className="home-body">
        {/* Profile — an abstract with a data sheet in the margin */}
        <section id="explore" className="section container home-profile" aria-labelledby="profile-h">
          <SectionHead
            mark={<span className="spectral-tick" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>}
            title="Profile"
            note="Bloomfield Hills · MI"
            titleId="profile-h"
          />
          <div className="home-profile__grid">
            <dl className="datasheet">
              {sheet.map(([k, v]) => (
                <div className="datasheet__row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="home-profile__abstract">
              {bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <Link to="/about" className="btn">
                Full profile <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Directory — a ruled index, not a card wall */}
        <section className="section--tight container home-dir" aria-labelledby="dir-h">
          <SectionHead title="Directory" note={`${directory.length} sections`} titleId="dir-h" />
          <nav className="dir" aria-label="Site sections">
            {directory.map((d) => (
              <Link key={d.to} to={d.to} className="dir__row">
                <span className="dir__label">{d.label}</span>
                <span className="dir__desc">{d.desc}</span>
                <span className="dir__note">{d.note}</span>
                <span className="dir__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </section>

        {/* Selected work — figures */}
        <section className="section container home-work" aria-labelledby="work-h">
          <SectionHead
            title="Selected work"
            note={`${projects.length} total`}
            titleId="work-h"
          />
          <div className="home-work__grid">
            {peek.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
          <Link to="/portfolio" className="home-work__all">
            All projects <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
