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
        description="Michael Hua's publications, including peer-reviewed and competition papers."
      />
      <PageHeader eyebrow="Papers" title="Michael Hua's Publications" />

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
            </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
