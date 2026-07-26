import { useState } from "react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import { bio } from "../data/site";
import { pageMetadata } from "../data/routeMetadata.js";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./about.css";

export default function About() {
  const [portraitMissing, setPortraitMissing] = useState(false);
  const portraitUrl = imageUrl("about-portrait.webp");

  return (
    <>
      <SEO {...pageMetadata.about} />
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
                srcSet={imageSrcSet([
                  { src: "about-portrait-466.webp", width: 466 },
                  { src: "about-portrait.webp", width: 932 },
                ])}
                sizes="(max-width: 720px) 100vw, 42vw"
                alt="Michael Hua wearing a light blue suit against a red background"
                onError={() => setPortraitMissing(true)}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )}
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
