import SEO from "../components/SEO";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import JustifiedGallery, { type GalleryPhoto } from "../components/JustifiedGallery";
import { pageMetadata } from "../data/routeMetadata.js";
import "./activities.css";

const communityPhotoRows: GalleryPhoto[][] = [
  [
    { src: "notebook/acawork.webp", alt: "ACA volunteers leading a paper cutting activity" },
    { src: "notebook/img_1107.webp", alt: "ACA volunteers and community members holding a garden harvest" },
  ],
  [
    { src: "notebook/img_9840.webp", alt: "ACA teen volunteers together in a community room" },
    { src: "notebook/acawork2.webp", alt: "Families and volunteers at an ACA community event" },
  ],
];

const curtisPhotoRows: GalleryPhoto[][] = [
  [
    { src: "notebook/curtisbookeventfinal.webp", alt: "Poster for An Evening with Curtis Chin" },
    { src: "notebook/4i0a4921.webp", alt: "Attendees at the Curtis Chin book talk" },
  ],
  [
    { src: "notebook/4i0a4930.webp", alt: "Curtis Chin speaking to attendees at the book talk" },
    { src: "notebook/4i0a4944.webp", alt: "ACA teen volunteers and Curtis Chin together after the book talk" },
  ],
];

const threadsPhotos: NotebookPhoto[] = [
  { src: "notebook/img_0890.webp", label: "At the community garden", alt: "Michael with the gardening team outside the Chueh Hom Memorial Garden greenhouse" },
];

const fencingPhotos: NotebookPhoto[] = [
  { src: "notebook/trs01741.webp", label: "Saber portrait", alt: "Michael in fencing gear holding a saber" },
  { src: "notebook/fencingcomp.webp", label: "At a tournament", alt: "Michael and other fencers at a competition" },
  { src: "notebook/fencingteam.webp", label: "With my team", alt: "Michael with his fencing teammates" },
  { src: "notebook/japanfencing.webp", label: "Fencing in Japan", alt: "Fencers competing in Japan" },
  { src: "notebook/wuxichinafencing.webp", label: "Fencing in Wuxi", alt: "Michael at a fencing event in Wuxi, China" },
];

export default function Activities() {
  return (
    <div className="activities-page">
      <SEO {...pageMetadata.activities} />
      <header className="activities-header container">
        <h1>Activities</h1>
      </header>

      <div className="activities-content container">
        <section id="community" className="activities-entry activities-entry--community" aria-labelledby="community-title">
          <div className="activities-entry__name">
            <h2 id="community-title">ACA Teen Volunteer Council</h2>
            <a className="activities-entry__link" href="https://www.acatvc.org/about-us" target="_blank" rel="noopener noreferrer">ACA TVC website</a>
          </div>
          <div className="activities-entry__body">
            <p>
              ACA TVC has been part of my week since 2023. I&apos;m now its co-president
              and technology director, working with more than 100 teen volunteers on
              service and cultural events. Some are small; our Lunar New Year
              celebration brings in more than 3,000 people.
            </p>
            <p>
              I&apos;ve put in more than 300 hours, including work people don&apos;t see at
              an event. I helped move our website to its own domain, and I keep the
              calendar and volunteer information current so someone new can find a way in.
            </p>
            <JustifiedGallery ariaLabel="ACA TVC community photos" rows={communityPhotoRows} />

            <div className="activities-entry__stories">
              <article>
                <h3>Curtis Chin book talk</h3>
                <p>
                  Our October 2026 book talk with Curtis Chin was one of my favorite TVC
                  events. I helped plan it and emceed the evening. I especially liked
                  hearing him speak about growing up Chinese American in Detroit and the
                  stories behind his memoir, <cite>Everything I Learned, I Learned in a
                  Chinese Restaurant</cite>.
                </p>
                <a href="https://www.michiganhumanities.org/event/great-michigan-read-partner-event-madison-heights/" target="_blank" rel="noopener noreferrer">About the event</a>
                <JustifiedGallery ariaLabel="Curtis Chin book talk photos" rows={curtisPhotoRows} />
              </article>
              <article>
                <h3>Threads of Belonging</h3>
                <p>
                  Directing this series lets me bring filmmaking into community work.
                  Our student crew records Chinese American elders sharing their
                  experiences with immigration, identity, and community. I led
                  workshops for 11 students on researching, interviewing, filming,
                  and editing those stories.
                </p>
                <PhotoNotebook ariaLabel="Threads of Belonging community photo" photos={threadsPhotos} eager />
              </article>
            </div>

          </div>
        </section>

        <section id="fencing" className="activities-entry" aria-labelledby="fencing-title">
          <div className="activities-entry__name">
            <h2 id="fencing-title">Fencing</h2>
          </div>
          <div className="activities-entry__body">
            <p>
              I fence saber and hold a national C rating. A bout can turn on a step
              taken too soon or a decision made a beat too late. I like going back to
              practice with one of those moments in mind and seeing what changes next time.
            </p>
            <p>
              I&apos;ve trained at fencing camps in Massachusetts, Italy, and Japan.
              Fencing people I haven&apos;t met before makes me pay attention to their
              distance and timing from the first exchange. I also placed 11th at an
              international circuit event in Wuxi, China.
            </p>
            <PhotoNotebook ariaLabel="Fencing photos" photos={fencingPhotos} featureFirst />
          </div>
        </section>
      </div>
    </div>
  );
}
