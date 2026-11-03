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

const fencingPhotoRows: GalleryPhoto[][] = [
  [
    { src: "notebook/trs01741.webp", alt: "Michael in fencing gear pointing his saber toward the camera" },
    { src: "notebook/screenshot-2026-11-03-at-12-13-16-am.webp", alt: "Michael refereeing a fencing bout at an event" },
    { src: "notebook/japanfencing.webp", alt: "Fencers competing in Japan" },
  ],
  [
    { src: "notebook/fencingcomp.webp", alt: "Michael and other fencers at a competition" },
    { src: "notebook/fencingteam.webp", alt: "Michael with his fencing teammates" },
    { src: "notebook/wuxichinafencing.webp", alt: "Michael at a fencing event in Wuxi, China" },
  ],
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
            <div className="activities-entry__overview">
              <div className="activities-entry__copy">
                <p>
                  Since 2023, I’ve volunteered with the Association of Chinese Americans’ Teen
                  Volunteer Council (ACA TVC), where I now serve as co-president and technology
                  director. I help lead more than 100 teen volunteers in community service and
                  cultural events, including ACA’s Lunar New Year celebration, which draws over
                  3,000 attendees.
                </p>
                <p>
                  Beyond my 300+ volunteer hours, I’ve helped reorganize TVC’s website, moving
                  it to its own domain and making upcoming events and volunteer opportunities
                  easier to find. I also initiated <em>Threads of Belonging</em>, an oral-history
                  documentary series preserving the experiences of Chinese American elders. For
                  its first episode, I interviewed members of ACA’s gardening team and produced
                  short films exploring their lives and connections to the local community.
                </p>
              </div>
              <JustifiedGallery ariaLabel="ACA TVC community photos" rows={communityPhotoRows} />
            </div>

            <div className="activities-entry__stories">
              <article>
                <h3>Curtis Chin Book Talk</h3>
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

        <section id="fencing" className="activities-entry activities-entry--fencing" aria-labelledby="fencing-title">
          <div className="activities-entry__name">
            <h2 id="fencing-title">Fencing</h2>
          </div>
          <div className="activities-entry__body">
            <div className="activities-entry__copy">
              <p>
                I compete nationally in saber fencing and hold a C rating. I&apos;ve qualified
                for the Junior Olympics three times, earned two regional bronze medals, and
                placed 11th at the 2025 Wuxi International Circuit in China. I&apos;ve also
                attended fencing camps in Massachusetts, Italy, and Japan, where I&apos;ve had
                the opportunity to train with fencers whose styles differ from those I
                regularly encounter.
              </p>
              <p>
                Outside my own competitions, I serve as a regional referee and strip-coach
                younger fencers at national tournaments. Refereeing requires me to evaluate
                exchanges from a different perspective, while coaching gives me the chance
                to help other fencers recognize mistakes and make adjustments between bouts.
              </p>
            </div>
            <JustifiedGallery ariaLabel="Fencing photos" rows={fencingPhotoRows} />
          </div>
        </section>
      </div>
    </div>
  );
}
