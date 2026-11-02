import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import WorldMap from "../components/WorldMap";
import { countryGoal, visitedCountryCodes } from "../data/travel";
import { pageMetadata } from "../data/routeMetadata.js";
import "./acrosstheglobe.css";

const bostonPhotos: NotebookPhoto[] = [
  { label: "First impressions", note: "A Boston frame from the summer" },
  { label: "Between research days", note: "A moment away from the lab" },
  { label: "A place to remember", note: "One for the travel notebook" },
];

export default function AcrossTheGlobe() {
  const visitedCount = visitedCountryCodes.length;

  return (
    <div className="travel-page">
      <SEO {...pageMetadata.travel} />

      <header className="travel-hero">
        <div className="container travel-hero__inner">
          <div className="travel-hero__copy">
            <span className="readout">Across the Globe / travel notebook</span>
            <h1>There&apos;s more <em>out there.</em></h1>
            <p>
              I&apos;d like to see all 195 countries someday. For now, I&apos;m
              keeping the places I visit, the people I meet, and the little
              details that stay with me long after I get home.
            </p>
          </div>
          <div className="travel-hero__stamp" aria-hidden="true">
            <span>MICHAEL&apos;S</span>
            <strong>FIELD<br />NOTES</strong>
            <span>EST. SOMEWHERE IN MOTION</span>
          </div>
        </div>
      </header>

      <section className="travel-atlas" aria-labelledby="atlas-title">
        <div className="container">
          <div className="travel-atlas__top">
            <div>
              <span className="readout">The long game / a flat map</span>
              <h2 id="atlas-title">Places on the page.</h2>
            </div>
            <div className="travel-atlas__counter" aria-label="Countries traveled to">
              <strong>{visitedCount > 0 ? visitedCount : "—"}<span> / {countryGoal}</span></strong>
              <span className="readout">Countries visited</span>
            </div>
          </div>
          <div className="travel-map">
            <div className="travel-map__corner travel-map__corner--top readout">180° W / 180° E</div>
            <WorldMap />
            <div className="travel-map__bottom">
              <span className="readout">Boston is the first stop in this notebook.</span>
              <span className="travel-map__legend readout"><i aria-hidden="true" /> Countries visited</span>
            </div>
          </div>
          <p className="travel-atlas__footnote">
            I&apos;ll color in the countries as I add them to this log. The goal counts the
            <a href="https://www.un.org/en/model-united-nations/un-glance" target="_blank" rel="noopener noreferrer"> 193 UN member states and two observer states</a>.
            Map outlines: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>.
          </p>
        </div>
      </section>

      <section className="travel-boston" aria-labelledby="boston-title">
        <div className="container">
          <div className="travel-boston__feature">
            <div className="travel-boston__ticket" aria-hidden="true">
              <span className="readout">No. 001 / recent stop</span>
              <strong>BOS</strong>
              <span className="readout">Summer 2026 · Massachusetts</span>
            </div>
            <div className="travel-boston__copy">
              <span className="readout">The first postcard</span>
              <h2 id="boston-title">A summer in Boston.</h2>
              <p>
                BU RISE brought me to Boston for a summer of computer vision
                research. I&apos;m saving a space here for the other half of that
                trip: the city beyond my workday and the moments I want to
                remember from it.
              </p>
              <Link to="/portfolio/chemosensory-grounding" className="travel-boston__link">
                The research side of my summer <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <PhotoNotebook title="Boston, in pictures" tone="travel" photos={bostonPhotos} />
        </div>
      </section>
    </div>
  );
}
