import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { publications } from "../data/publications";
import "./publications.css";

export default function Publications() {
  return (
    <>
      <SEO
        title="Publications"
        path="/publications"
        description="Peer-reviewed research and competition papers by Michael Hua in computer vision, hyperspectral imaging, and history."
      />
      <PageHeader eyebrow="Research Papers" title="Publications and Competition Papers">
        <p>
          Peer-reviewed research, technical manuscripts, and historical scholarship with links to
          published articles and project materials.
        </p>
      </PageHeader>

      <section className="section--tight">
        <div className="container pubs">
          {publications.map((pub, i) => (
            <Reveal key={pub.id} delay={i * 70}>
              <article
                id={pub.id}
                className={`pub cat-${pub.category}`}
              >
                <div className="pub__index" aria-hidden="true">
                  {String(pub.index).padStart(2, "0")}
                </div>
                <div className="pub__main">
                  <h2 className="pub__title long-title">{pub.title}</h2>
                  {pub.journal && <p className="pub__journal">{pub.journal}</p>}

                  <div className="pub__copy">
                    {pub.copy.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="pub__links">
                    {pub.links.map((l, i) => (
                      <a
                        key={i}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        {l.label}
                        <span className="arrow" aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
                <figure className="pub__figure">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${pub.image}`}
                    alt={pub.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
