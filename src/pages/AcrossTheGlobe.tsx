import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PhotoNotebook from "../components/PhotoNotebook";
import WorldMap from "../components/WorldMap";
import UsStatesMap from "../components/UsStatesMap";
import { outsidePlaces, placeToStop, travelStops, usPlaces } from "../data/travel";
import { pageMetadata } from "../data/routeMetadata.js";
import "./acrosstheglobe.css";

export default function AcrossTheGlobe() {
  const [selectedId, setSelectedId] = useState("japan");
  const photoPanel = useRef<HTMLDivElement>(null);
  const bostonSection = useRef<HTMLElement>(null);
  const selectedStop = travelStops.find((stop) => stop.id === selectedId) ?? travelStops[0];
  const boston = travelStops[0];

  function selectStop(id: string) {
    setSelectedId(id);
    window.requestAnimationFrame(() => {
      const target = id === "boston" ? bostonSection.current : photoPanel.current;
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function placeList(places: string[]) {
    return (
      <div className="travel-places__list">
        {places.map((place) => {
          const stopId = placeToStop[place];
          return stopId ? (
            <button key={place} type="button" className={`travel-places__item has-photos${selectedId === stopId ? " is-selected" : ""}`} onClick={() => selectStop(stopId)} aria-pressed={selectedId === stopId}>
              {place}
            </button>
          ) : <span key={place} className="travel-places__item" aria-label={`${place}, visited; photos coming later`}>{place}</span>;
        })}
      </div>
    );
  }

  return (
    <div className="travel-page">
      <SEO {...pageMetadata.travel} />
      <header className="travel-header container">
        <h1>Around the World</h1>
      </header>

      <div className="travel-content container">
        <section className="travel-entry" ref={bostonSection} aria-labelledby="boston-title">
          <div className="travel-entry__name">
            <h2 id="boston-title">BU RISE 2026</h2>
            <span>Boston, Massachusetts</span>
          </div>
          <div className="travel-entry__body">
            <p>
              In the summer of 2026, I traveled to Boston for a summer research opportunity, BU RISE. I spent weekdays working on a computer
              vision project at Boston University. In my free time, I had the opportunity to get to know the
              city. Staying for a summer let me explore at my own pace, which was something I really enjoyed.
              My favorite part was trying all the new restaurants with my friends!
            </p>
            <Link to="/portfolio/chemosensory-grounding">My BU RISE research</Link>
            <PhotoNotebook ariaLabel="Boston photos" photos={boston.photos} eager />
          </div>
        </section>

        <section className="travel-atlas" aria-labelledby="travel-atlas-title">
          <div className="travel-atlas__top">
            <h2 id="travel-atlas-title">Where I&apos;ve been</h2>
            <p className="travel-atlas__count">{usPlaces.length + outsidePlaces.length} places listed</p>
          </div>
          <p className="travel-atlas__intro">I hope I can visit every country someday!</p>
          <div className="travel-map"><WorldMap selectedId={selectedId} onSelect={selectStop} /></div>
          <p className="travel-map__legend"><span className="travel-map__legend-visited" /> Visited <span className="travel-map__legend-photo" /> Photos available</p>
          <UsStatesMap selectedId={selectedId} onSelect={selectStop} />

          {selectedId !== "boston" && <div className="travel-photo-stop" ref={photoPanel} aria-live="polite">
            <div className="travel-photo-stop__heading">
              <h3>{selectedStop.label}</h3>
            </div>
            <PhotoNotebook ariaLabel={`${selectedStop.label} photos`} photos={selectedStop.photos} />
          </div>}

          <div className="travel-places" aria-label="Places visited">
            <section aria-labelledby="travel-us-title">
              <div className="travel-places__heading"><h3 id="travel-us-title">United States</h3><span>Michigan is home</span></div>
              {placeList(usPlaces)}
            </section>
            <section aria-labelledby="travel-world-title">
              <div className="travel-places__heading"><h3 id="travel-world-title">Countries &amp; territories</h3><span>Beyond the states</span></div>
              {placeList(outsidePlaces)}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
