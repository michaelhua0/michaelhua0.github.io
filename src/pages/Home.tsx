import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import SectionHead from "../components/SectionHead";
import ProjectCard from "../components/ProjectCard";
import HomeGallery from "../components/HomeGallery";
import { bio } from "../data/site";
import { projects } from "../data/projects";
import { publications } from "../data/publications";
import { pageMetadata } from "../data/routeMetadata.js";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./home.css";

const profileNotes: [string, string][] = [
  ["Current focus", "Physics-aware AI for computational imaging"],
  ["Working across", "Computer vision · Hyperspectral sensing · Medical AI"],
  ["Beyond research", "Documentary history · Saber fencing · Community service"],
];

const recognition = [
  {
    mark: "1st",
    title: "Grand Award",
    note: "Regeneron ISEF · Robotics and Intelligent Machines",
  },
  {
    mark: "ACM",
    logo: "logos/acm.jpg",
    logoAlt: "ACM",
    title: "ACM Special Award",
    note: "Regeneron ISEF · Computing research",
  },
  {
    mark: "MJ",
    logo: "logos/midjourney.svg",
    logoAlt: "Midjourney",
    title: "Midjourney Special Award",
    note: "Regeneron ISEF",
  },
];

const directory = [
  { to: "/about", label: "About", desc: "Background, research interests & service", note: "profile" },
  { to: "/portfolio", label: "Portfolio", desc: "Research, software & documentary work", note: `${projects.length} projects` },
  { to: "/publications", label: "Publications", desc: "Peer-reviewed & competition papers", note: `${publications.length} papers` },
];

export default function Home() {
  const peek = projects.slice(0, 3);
  const [portraitMissing, setPortraitMissing] = useState(false);

  return (
    <>
      <SEO {...pageMetadata.home} />
      <Hero />

      <div className="home-body">
        <section id="explore" className="section home-profile" aria-labelledby="profile-h">
          <div className="container">
            <SectionHead
              title="Profile"
              note="Bloomfield Hills · MI"
              titleId="profile-h"
            />

            <div className="home-profile__spread">
              <figure className="home-profile__portrait">
                <div className="home-profile__portrait-frame">
                  {portraitMissing ? (
                    <div
                      className="home-profile__portrait-placeholder"
                      role="img"
                      aria-label="Portrait unavailable"
                    >
                      <span aria-hidden="true">MH</span>
                    </div>
                  ) : (
                    <img
                      src={imageUrl("about-portrait.webp")}
                      srcSet={imageSrcSet([
                        { src: "about-portrait-466.webp", width: 466 },
                        { src: "about-portrait.webp", width: 932 },
                      ])}
                      sizes="(max-width: 860px) 82vw, 38vw"
                      alt="Michael Hua wearing a light blue suit against a red background"
                      width="932"
                      height="1200"
                      loading="lazy"
                      decoding="async"
                      onError={() => setPortraitMissing(true)}
                    />
                  )}
                </div>
              </figure>

              <div className="home-profile__content">
                <p className="home-profile__kicker">Researcher · Developer · Storyteller</p>
                <h3 className="home-profile__statement">
                  Michael builds systems that reveal what conventional images leave{" "}
                  <em>hidden.</em>
                </h3>

                <div className="home-profile__abstract">
                  <p>{bio[0]}</p>
                  <p>
                    He is most interested in the point where a research idea becomes something
                    another person can test, use, or learn from. Away from his desk, Michael
                    competes in saber fencing at the national level and serves as co-president of
                    the Association of Chinese Americans Teen Volunteer Council (ACA TVC).
                  </p>
                </div>

                <dl className="home-profile__notes">
                  {profileNotes.map(([label, value]) => (
                    <div className="home-profile__note" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                <Link to="/about" className="btn home-profile__cta">
                  <span className="btn__label">
                    More about Michael <span className="arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              </div>
            </div>

            <aside className="home-profile__recognition" aria-labelledby="recognition-h">
              <div className="home-profile__recognition-head">
                <h3 id="recognition-h">Selected recognition</h3>
                <span>Regeneron ISEF · 2026</span>
              </div>
              <ol>
                {recognition.map((award) => (
                  <li key={`${award.mark}-${award.note}`}>
                    {award.logo ? (
                      <span className="home-profile__reco-logo">
                        <img
                          src={`${import.meta.env.BASE_URL}images/${award.logo}`}
                          alt={award.logoAlt}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    ) : (
                      <strong>{award.mark}</strong>
                    )}
                    <div>
                      <span>{award.title}</span>
                      <small>{award.note}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="section container home-work" aria-labelledby="work-h">
          <SectionHead
            title="Selected work"
            note={`${projects.length} total`}
            titleId="work-h"
          />
          {peek.length > 0 ? (
            <>
              <div className="home-work__grid">
                {peek.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={i} />
                ))}
              </div>
              <Link to="/portfolio" className="home-work__all">
                All projects <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <p className="empty-state">No projects are available yet.</p>
          )}
        </section>

        <HomeGallery />

        <section className="section--tight container home-dir" aria-labelledby="dir-h">
          <SectionHead title="Keep exploring" note={`${directory.length} sections`} titleId="dir-h" />
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
      </div>
    </>
  );
}
