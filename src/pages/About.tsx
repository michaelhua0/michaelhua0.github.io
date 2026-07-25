import { useState } from "react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import { bio } from "../data/site";
import "./about.css";

export default function About() {
  const [portraitMissing, setPortraitMissing] = useState(false);
  const portraitUrl = `${import.meta.env.BASE_URL}images/about-portrait.jpg`;

  return (
    <>
      <SEO
        title="About"
        path="/about"
        description="Michael Hua is a student researcher, software developer, documentary filmmaker, saber fencer, and ACA TVC co-president."
      />
      <PageHeader eyebrow="Profile" title="About me" />

      <section className="section about">
        <div className="container about__grid">
          <figure className="about__portrait">
            {portraitMissing ? (
              <div className="about__portrait-placeholder" role="img" aria-label="Future portrait of Michael Hua">
                <span className="about__portrait-mark" aria-hidden="true">MH</span>
                <div>
                  <p>Portrait reserved</p>
                  <span>Red backdrop · light blue suit</span>
                </div>
              </div>
            ) : (
              <img
                src={portraitUrl}
                alt="Michael Hua wearing a light blue suit against a red background"
                onError={() => setPortraitMissing(true)}
                decoding="async"
              />
            )}
            <figcaption>Michael Hua</figcaption>
          </figure>

          <div className="about__copy">
            <h2 className="about__heading">Research, technology, and historical inquiry</h2>
            {bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
