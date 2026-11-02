import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import WorldMap from "../components/WorldMap";
import { countryGoal, visitedCountryCodes } from "../data/travel";
import { pageMetadata } from "../data/routeMetadata.js";
import "./acrosstheglobe.css";

const bostonPhotos: NotebookPhoto[] = [
  { label: "Around Boston" },
  { label: "A day off" },
  { label: "BU RISE" },
];

export default function AcrossTheGlobe() {
  const visitedCount = visitedCountryCodes.length;

  return (
    <div className="travel-page">
      <SEO {...pageMetadata.travel} />
      <header className="travel-header container">
        <h1>Across the Globe</h1>
      </header>

      <div className="travel-content container">
        <section className="travel-atlas" aria-labelledby="travel-atlas-title">
          <div className="travel-atlas__top">
            <h2 id="travel-atlas-title">Where I&apos;ve been</h2>
            <p className="travel-atlas__count" aria-label="Countries traveled to">
              {visitedCount > 0 ? visitedCount : "—"} / {countryGoal} countries
            </p>
          </div>
          <p className="travel-atlas__intro">I want to visit every country someday. I like keeping a record of the places I&apos;ve been along the way.</p>
          <div className="travel-map"><WorldMap /></div>
        </section>

        <section className="travel-entry" aria-labelledby="boston-title">
          <div className="travel-entry__name">
            <h2 id="boston-title">Boston, 2026</h2>
          </div>
          <div className="travel-entry__body">
            <p>
              BU RISE took me to Boston for summer 2026. I spent weekdays on a computer
              vision project at Boston University and my free time getting to know the
              city. Staying for a summer let me explore at my own pace.
            </p>
            <Link to="/portfolio/chemosensory-grounding">My BU RISE research ↗</Link>
            <PhotoNotebook ariaLabel="Boston photos" photos={bostonPhotos} />
          </div>
        </section>
      </div>
    </div>
  );
}
