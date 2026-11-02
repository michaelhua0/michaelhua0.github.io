import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import { pageMetadata } from "../data/routeMetadata.js";
import "./activities.css";

const communityPhotos: NotebookPhoto[] = [
  { label: "Curtis Chin book talk", note: "October 2026" },
  { label: "Threads of Belonging", note: "Oral history project" },
  { label: "ACA TVC volunteers", note: "Community events" },
];

const fencingPhotos: NotebookPhoto[] = [
  { label: "At a tournament", note: "Competition" },
  { label: "At practice", note: "Training" },
  { label: "With my team", note: "Fencing" },
];

export default function Activities() {
  return (
    <div className="activities-page">
      <SEO {...pageMetadata.activities} />
      <PageHeader eyebrow="Outside the lab" title="Activities">
        <p>I volunteer with ACA&apos;s Teen Volunteer Council and fence competitively.</p>
      </PageHeader>

      <div className="container activities-content">
        <section id="community" className="activities-section" aria-labelledby="community-title">
          <div className="activities-section__heading">
            <h2 id="community-title">ACA Teen Volunteer Council</h2>
            <p>Co-President and Technology Director · 2023–present</p>
          </div>

          <div className="activities-prose">
            <p>
              I joined the Association of Chinese Americans&apos; Teen Volunteer Council in
              2023. I now help lead more than 100 teen volunteers through service and
              cultural events throughout the year. Our Lunar New Year celebration brings
              in more than 3,000 guests. I&apos;ve contributed over 300 volunteer hours so far.
            </p>
            <p>
              I also helped move the TVC website to its own domain. I keep the event
              calendar and information for volunteers and directors up to date, so people
              can find what they need before they show up.
            </p>
          </div>

          <div className="activities-details">
            <article>
              <h3>Curtis Chin book talk</h3>
              <p>
                In October 2026, I helped plan a book talk with Curtis Chin and was an MC
                at the event. The conversation centered on his memoir, <cite>Everything
                I Learned, I Learned in a Chinese Restaurant</cite>, and his experience
                growing up Chinese American in Detroit.
              </p>
              <a href="https://www.michiganhumanities.org/event/great-michigan-read-partner-event-madison-heights/" target="_blank" rel="noopener noreferrer">
                Event details ↗
              </a>
            </article>
            <article>
              <h3>Threads of Belonging</h3>
              <p>
                I direct this oral history series about Chinese American elders&apos;
                experiences with immigration, identity, and community. I taught 11 student
                volunteers how to research a subject, prepare interview questions, film,
                and edit the conversations.
              </p>
            </article>
          </div>

          <a className="activities-external-link" href="https://www.acatvc.org/about-us" target="_blank" rel="noopener noreferrer">
            Visit ACA TVC ↗
          </a>
          <PhotoNotebook title="ACA TVC photos" photos={communityPhotos} />
        </section>

        <section id="fencing" className="activities-section" aria-labelledby="fencing-title">
          <div className="activities-section__heading">
            <h2 id="fencing-title">Fencing</h2>
            <p>National C rating</p>
          </div>
          <div className="activities-prose">
            <p>
              I fence saber and hold a national C rating. I like the quick decisions in a
              bout, but most of my time in the sport is spent practicing footwork and
              timing. Tournaments give me a chance to see what I need to work on next.
            </p>
          </div>
          <PhotoNotebook title="Fencing photos" photos={fencingPhotos} />
        </section>
      </div>
    </div>
  );
}
