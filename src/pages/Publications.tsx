import { useState } from "react";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { publications } from "../data/publications";
import { pageMetadata } from "../data/routeMetadata.js";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./publications.css";

function PublicationFigure({
  image,
  imageSources,
  imageAlt,
  priority,
}: {
  image: string;
  imageSources?: { src: string; width: number }[];
  imageAlt: string;
  priority: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="pub__figure">
      <img
        className={loaded ? "is-loaded" : ""}
        src={imageUrl(image)}
        srcSet={imageSrcSet(imageSources)}
        sizes="(max-width: 620px) 100vw, (max-width: 900px) 190px, 260px"
        alt={imageAlt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </figure>
  );
}

export default function Publications() {
  return (
    <>
      <SEO {...pageMetadata.publications} />
      <PageHeader eyebrow="Research Papers" title="Publications and Competition Papers">
        <p>
          Peer-reviewed research, technical manuscripts, and historical scholarship with links to
          published articles and project materials.
        </p>
      </PageHeader>

      <section className="section--tight">
        <div className="container pubs">
          {publications.length > 0 ? (
            publications.map((pub, i) => (
              <Reveal
                key={pub.id}
                as="article"
                id={pub.id}
                className={`pub cat-${pub.category}`}
                delay={i * 70}
              >
                <div className="pub__index readout readout--strong" aria-hidden="true">
                  <span className="pub__index-label readout readout--quiet">Ref</span>
                  {String(pub.index).padStart(2, "0")}
                </div>
                <div className="pub__main">
                  <h2 className="pub__title long-title">{pub.title}</h2>
                  {pub.journal && (
                    <p className="pub__journal mono-copy mono-copy--strong">
                      {pub.journal}
                    </p>
                  )}

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
                        className="btn readout"
                      >
                        <span className="btn__label">
                          {l.label}
                          <span className="arrow" aria-hidden="true">↗</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <PublicationFigure
                  image={pub.image}
                  imageSources={pub.imageSources}
                  imageAlt={pub.imageAlt}
                  priority={i === 0}
                />
              </Reveal>
            ))
          ) : (
            <p className="empty-state">No publications are available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
