import SEO from "../components/SEO";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import { pageMetadata } from "../data/routeMetadata.js";
import "./activities.css";

const communityPhotos: NotebookPhoto[] = [
  { label: "Curtis Chin book talk" },
  { label: "Threads of Belonging" },
  { label: "ACA TVC volunteers" },
];

const fencingPhotos: NotebookPhoto[] = [
  { label: "At a tournament" },
  { label: "At practice" },
  { label: "With my team" },
];

export default function Activities() {
  return (
    <div className="activities-page">
      <SEO {...pageMetadata.activities} />
      <header className="activities-header container">
        <h1>Activities</h1>
      </header>

      <div className="activities-content container">
        <section id="community" className="activities-entry" aria-labelledby="community-title">
          <div className="activities-entry__name">
            <h2 id="community-title">ACA Teen Volunteer Council</h2>
          </div>
          <div className="activities-entry__body">
            <p>
              I joined ACA&apos;s Teen Volunteer Council in 2023 and now serve as its
              co-president and technology director. I help coordinate more than 100 teen
              volunteers across our service events. One is ACA&apos;s Lunar New Year
              celebration, which brings in more than 3,000 people.
            </p>
            <p>
              I&apos;ve volunteered more than 300 hours with TVC. I also helped move our
              website to its own domain and keep the event calendar and volunteer
              information current.
            </p>

            <div className="activities-entry__stories">
              <article>
                <h3>Curtis Chin book talk</h3>
                <p>
                  I helped plan ACA TVC&apos;s October 2026 book talk with Curtis Chin and
                  was an MC that evening. He spoke about his memoir, <cite>Everything I
                  Learned, I Learned in a Chinese Restaurant</cite>, and growing up
                  Chinese American in Detroit.
                </p>
                <a href="https://www.michiganhumanities.org/event/great-michigan-read-partner-event-madison-heights/" target="_blank" rel="noopener noreferrer">About the event ↗</a>
              </article>
              <article>
                <h3>Threads of Belonging</h3>
                <p>
                  I direct this oral history series about Chinese American elders. I
                  taught 11 students how to research subjects, interview elders, film,
                  and edit the videos.
                </p>
              </article>
            </div>

            <a className="activities-entry__link" href="https://www.acatvc.org/about-us" target="_blank" rel="noopener noreferrer">ACA TVC website ↗</a>
            <PhotoNotebook ariaLabel="ACA TVC photos" photos={communityPhotos} />
          </div>
        </section>

        <section id="fencing" className="activities-entry" aria-labelledby="fencing-title">
          <div className="activities-entry__name">
            <h2 id="fencing-title">Fencing</h2>
          </div>
          <div className="activities-entry__body">
            <p>
              I fence saber and hold a national C rating. I like making decisions under
              pressure in a bout, then going back to practice to work on the moments I
              got wrong.
            </p>
            <PhotoNotebook ariaLabel="Fencing photos" photos={fencingPhotos} />
          </div>
        </section>
      </div>
    </div>
  );
}
