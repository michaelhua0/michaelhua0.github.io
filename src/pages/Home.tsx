import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import SectionHead from "../components/SectionHead";
import ProjectCard from "../components/ProjectCard";
import HomeGallery from "../components/HomeGallery";
import { bio } from "../data/site";
import { projects } from "../data/projects";
import { pageMetadata } from "../data/routeMetadata.js";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./home.css";

const profileNotes: [string, string][] = [
  ["Current focus", "Physics-aware AI for computational imaging"],
  ["Working across", "Computer vision, hyperspectral sensing, and medical AI"],
  ["Beyond research", "Documentary history, saber fencing, and community service"],
];

const additionalRecognition = [
  {
    logo: "logos/acm.jpg",
    logoWidth: 900,
    logoHeight: 900,
    title: "ACM Special Award",
  },
  {
    logo: "logos/midjourney.svg",
    logoWidth: 698,
    logoHeight: 583,
    title: "Midjourney Special Award",
  },
];

export default function Home() {
  const peek = projects.slice(0, 3);
  const [portraitMissing, setPortraitMissing] = useState(false);

  return (
    <>
      <SEO {...pageMetadata.home} />
      <Hero />

      <div className="home-body">
        <section
          id="explore"
          className="section home-profile"
          aria-labelledby="profile-h"
        >
          <div className="container">
            <SectionHead title="Who I am" titleId="profile-h" />

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
                      sizes="(max-width: 620px) 100vw, (max-width: 900px) 82vw, 38vw"
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
                <div className="home-profile__abstract">
                  <p>{bio[0]}</p>
                  <p>
                    I am most interested in the point where a research idea becomes something
                    another person can test, use, or learn from. Away from my desk, I compete in
                    saber fencing at the national level and serve as co-president of
                    the Association of Chinese Americans Teen Volunteer Council (ACA TVC).
                  </p>
                </div>

                <dl className="home-profile__notes">
                  {profileNotes.map(([label, value]) => (
                    <div className="home-profile__note" key={label}>
                      <dt className="readout">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                <Link to="/about" className="btn readout home-profile__cta">
                  <span className="btn__label">
                    More about Michael <span className="arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section home-recognition"
          aria-labelledby="recognition-h"
        >
          <div className="container">
            <SectionHead title="Recognition" titleId="recognition-h" />
            <div className="home-recognition__grid">
              <div className="home-recognition__feature">
                <div className="home-recognition__feature-logo">
                  <img
                    src={imageUrl("logos/regeneron-isef.webp")}
                    alt=""
                    width="720"
                    height="405"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="readout">
                  Regeneron ISEF 2026, Robotics and Intelligent Machines
                </p>
                <h3>First Place Grand Award</h3>
              </div>
              <ul className="home-recognition__additional">
                {additionalRecognition.map((award) => (
                  <li key={award.title}>
                    <span className="home-recognition__logo" aria-hidden="true">
                      <img
                        src={imageUrl(award.logo)}
                        alt=""
                        width={award.logoWidth}
                        height={award.logoHeight}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="home-recognition__award">
                      <span className="home-recognition__award-title">{award.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
                  <ProjectCard key={p.slug} project={p} priority={i === 0} />
                ))}
              </div>
              <Link to="/portfolio" className="home-work__all readout">
                All projects <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <p className="empty-state">No projects are available yet.</p>
          )}
        </section>

        <HomeGallery />
      </div>
    </>
  );
}
