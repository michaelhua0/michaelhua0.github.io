import SEO from "../components/SEO";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import { pageMetadata } from "../data/routeMetadata.js";
import "./activities.css";

const communityPhotos: NotebookPhoto[] = [
  { label: "Curtis Chin book talk", note: "The people and the evening behind the program" },
  { label: "Threads of Belonging", note: "A story in the making" },
  { label: "TVC in action", note: "A year of showing up together" },
];

const fencingPhotos: NotebookPhoto[] = [
  { label: "On the strip", note: "Competition day" },
  { label: "Between bouts", note: "The quieter side of a tournament" },
  { label: "The team", note: "People who make the long days fun" },
];

export default function Activities() {
  return (
    <div className="activities-page">
      <SEO {...pageMetadata.activities} />

      <header className="activities-hero">
        <div className="container activities-hero__inner">
          <span className="readout activities-hero__eyebrow">Activities / beyond the lab</span>
          <h1>
            The hours <em>outside</em> the lab.
          </h1>
          <div className="activities-hero__bottom">
            <p>
              I spend some of them building a place for other students to serve. I spend
              others learning to think faster on a fencing strip.
            </p>
            <div className="activities-hero__index readout" aria-label="Page sections">
              <a href="#community">01 / Community</a>
              <a href="#fencing">02 / Fencing</a>
            </div>
          </div>
        </div>
      </header>

      <section id="community" className="activities-community" aria-labelledby="community-title">
        <div className="container">
          <div className="activities-section-head">
            <span className="readout">01 / Association of Chinese Americans</span>
            <span className="activities-section-head__line" aria-hidden="true" />
            <span className="readout">Teen Volunteer Council</span>
          </div>

          <div className="activities-community__intro">
            <div>
              <h2 id="community-title">A place to show up for each other.</h2>
              <p className="activities-community__role readout">Co-President · Technology Director</p>
            </div>
            <div className="activities-community__copy">
              <p>
                At ACA&apos;s Teen Volunteer Council, I help students turn a good intention
                into an event people can walk into. That means planning the year with
                fellow volunteers, keeping our website useful, and making room for the
                next person who wants to take part.
              </p>
              <p>
                I joined in 2023. Since then, I&apos;ve helped lead a council of more than
                100 teen volunteers across a calendar of service and cultural programs.
                The work has given me a much wider idea of what it means to build
                something for a community.
              </p>
              <p>
                Some days that community fills a room; at our Lunar New Year celebration,
                it fills a venue with more than 3,000 guests. I also helped move TVC&apos;s
                website to its own domain, then kept the information people need to
                volunteer, join a program, or find an event easy to reach.
              </p>
              <a className="activities-text-link" href="https://www.acatvc.org/about-us" target="_blank" rel="noopener noreferrer">
                Visit ACA TVC <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="activities-community__notes" aria-label="ACA TVC at a glance">
            <div><strong>100+</strong><span>teen volunteers</span></div>
            <div><strong>300+</strong><span>hours I&apos;ve contributed</span></div>
            <div><strong>11</strong><span>students in video workshops</span></div>
          </div>

          <div className="activities-stories">
            <article className="activities-story activities-story--feature">
              <span className="readout">A recent evening / October 2026</span>
              <h3>At the microphone with Curtis Chin</h3>
              <p>
                I helped plan ACA TVC&apos;s book talk with Curtis Chin, then served as an
                MC for the event. His memoir, <em>Everything I Learned, I Learned in a
                Chinese Restaurant</em>, opened a conversation about growing up Chinese
                American in Detroit. I loved helping bring that conversation into a
                room where students and older generations could hear it together.
              </p>
              <a href="https://www.michiganhumanities.org/event/great-michigan-read-partner-event-madison-heights/" target="_blank" rel="noopener noreferrer">
                About the book talk <span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="activities-story">
              <span className="readout">An ongoing project / oral history</span>
              <h3>Threads of Belonging</h3>
              <p>
                I direct a student-led series recording Chinese American elders&apos;
                stories of immigration, identity, and community. To prepare our crew,
                I led workshops for 11 students on the research and production skills
                behind an interview: finding the right questions, listening closely,
                filming, and editing with care.
              </p>
            </article>
          </div>

          <PhotoNotebook title="From the community" tone="community" photos={communityPhotos} />
        </div>
      </section>

      <section id="fencing" className="activities-fencing" aria-labelledby="fencing-title">
        <div className="container">
          <div className="activities-section-head activities-section-head--light">
            <span className="readout">02 / Fencing</span>
            <span className="activities-section-head__line" aria-hidden="true" />
            <span className="readout">Practice / distance / decision</span>
          </div>
          <div className="activities-fencing__intro">
            <div className="activities-fencing__mark" aria-label="C rating">
              <span className="readout">National rating</span>
              <strong>C</strong>
            </div>
            <div>
              <h2 id="fencing-title">One touch at a time.</h2>
              <p>
                I&apos;m a C-rated fencer who competes at the national level. Fencing
                asks me to read distance, commit to a decision, and adjust in a
                fraction of a second. Then I go back to practice and work on the
                same movement again.
              </p>
              <p>
                I like the clarity of it. A bout gives immediate feedback, and the
                people beside the strip make the long tournament days worth keeping.
              </p>
            </div>
          </div>
          <PhotoNotebook title="From the strip" tone="fencing" photos={fencingPhotos} />
        </div>
      </section>
    </div>
  );
}
