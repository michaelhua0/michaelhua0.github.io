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
        <section className="travel-atlas" aria-label="Travel map">
          <div className="travel-atlas__top">
            <p>I&apos;d like to visit every country someday.</p>
            <p className="travel-atlas__count" aria-label="Countries traveled to">
              {visitedCount > 0 ? visitedCount : "—"} / {countryGoal} countries
            </p>
          </div>
          <div className="travel-map"><WorldMap /></div>
          {visitedCount === 0 && <p className="travel-atlas__note">I haven&apos;t added my country list yet. Boston is pinned on the map for now.</p>}
          <p className="travel-atlas__source">
            The total counts <a href="https://www.un.org/en/model-united-nations/un-glance" target="_blank" rel="noopener noreferrer">193 UN member states and two observer states</a>. Map data from <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>.
          </p>
        </section>

        <section className="travel-entry" aria-labelledby="boston-title">
          <div className="travel-entry__name">
            <h2 id="boston-title">Boston, 2026</h2>
          </div>
          <div className="travel-entry__body">
            <p>
              My latest trip was to Boston for BU RISE. I spent the summer working on a
              computer vision project at Boston University and got to see the city
              between research days. I&apos;ll add photos from the trip here.
            </p>
            <Link to="/portfolio/chemosensory-grounding">My BU RISE research ↗</Link>
            <PhotoNotebook ariaLabel="Boston photos" photos={bostonPhotos} />
          </div>
        </section>
      </div>
    </div>
  );
}
