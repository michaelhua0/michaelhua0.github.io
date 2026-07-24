import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import SmartImage from "../components/SmartImage";
import { bio, aboutPhotos } from "../data/site";
import "./about.css";

export default function About() {
  return (
    <>
      <SEO title="About" path="/about" description="About Michael Hua." />
      <PageHeader eyebrow="Michael Hua" title="About Me" />

      <section className="section about">
        <div className="container about__grid">
          <div className="about__copy">
            <h2 className="about__heading">About Michael Hua</h2>
            {bio.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="about__gallery" aria-label="Photographs of Michael Hua">
            {aboutPhotos.map((photo, i) => (
              <figure key={i} className={`about__photo about__photo--${i + 1}`}>
                <SmartImage
                  src={photo.src}
                  alt={photo.alt}
                  motif={photo.motif}
                  ratio={i === 0 ? "4 / 5" : "1 / 1"}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
