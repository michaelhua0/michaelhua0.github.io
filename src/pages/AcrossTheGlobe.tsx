import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import PhotoNotebook, { type NotebookPhoto } from "../components/PhotoNotebook";
import WorldMap from "../components/WorldMap";
import { countryGoal, visitedCountryCodes } from "../data/travel";
import { pageMetadata } from "../data/routeMetadata.js";
import "./acrosstheglobe.css";

const bostonPhotos: NotebookPhoto[] = [
  { label: "Around Boston", note: "Summer 2026" },
  { label: "A day off", note: "Summer 2026" },
  { label: "BU RISE", note: "Summer 2026" },
];

export default function AcrossTheGlobe() {
  const visitedCount = visitedCountryCodes.length;

  return (
    <div className="travel-page">
      <SEO {...pageMetadata.travel} />
      <PageHeader eyebrow="Travel" title="Across the Globe">
        <p>I&apos;d like to visit every country someday. I&apos;m keeping track here, one trip at a time.</p>
      </PageHeader>

      <div className="container travel-content">
        <section className="travel-section" aria-labelledby="atlas-title">
          <div className="travel-section__heading">
            <h2 id="atlas-title">Where I&apos;ve been</h2>
            <p className="travel-count" aria-label="Countries traveled to">
              {visitedCount > 0 ? visitedCount : "—"} / {countryGoal} countries
            </p>
          </div>
          <div className="travel-map">
            <WorldMap />
          </div>
          <p className="travel-map__note">
            {visitedCount === 0
              ? "I'll mark countries on the map once I've added my travel list. Boston is pinned for now."
              : "Countries I've visited are marked in green. Boston is pinned as my most recent trip."}
          </p>
          <p className="travel-map__source">
            The total uses <a href="https://www.un.org/en/model-united-nations/un-glance" target="_blank" rel="noopener noreferrer">193 UN member states and two observer states</a>. Map outlines from <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>.
          </p>
        </section>

        <section className="travel-section travel-boston" aria-labelledby="boston-title">
          <p className="travel-boston__label">Most recent trip · Summer 2026</p>
          <h2 id="boston-title">Boston, Massachusetts</h2>
          <div className="travel-boston__copy">
            <p>
              I spent the summer in Boston for BU RISE, working on a computer vision
              project at Boston University. I&apos;ll add photos from my time in the city
              here. The research project has its own page in my portfolio.
            </p>
            <Link to="/portfolio/chemosensory-grounding">Read about my BU RISE research ↗</Link>
          </div>
          <PhotoNotebook title="Boston photos" photos={bostonPhotos} />
        </section>
      </div>
    </div>
  );
}
