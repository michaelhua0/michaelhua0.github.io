import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PhotoNotebook from "../components/PhotoNotebook";
import WorldMap from "../components/WorldMap";
import { outsidePlaces, placeToStop, travelStops, usPlaces } from "../data/travel";
import { pageMetadata } from "../data/routeMetadata.js";
import "./acrosstheglobe.css";

export default function AcrossTheGlobe() {
  const [selectedId, setSelectedId] = useState("japan");
  const photoPanel = useRef<HTMLDivElement>(null);
  const selectedStop = travelStops.find((stop) => stop.id === selectedId) ?? travelStops[0];
  const boston = travelStops[0];

  function selectStop(id: string) {
    setSelectedId(id);
    window.requestAnimationFrame(() => photoPanel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  function placeList(places: string[]) {
    return (
      <div className="travel-places__list">
        {places.map((place) => {
          const stopId = placeToStop[place];
          return stopId ? (
            <button key={place} type="button" className={`travel-places__item has-photos${selectedId === stopId ? " is-selected" : ""}`} onClick={() => selectStop(stopId)} aria-pressed={selectedId === stopId}>
              {place}<span aria-hidden="true">↗</span>
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
        <h1>Across the Globe</h1>
      </header>

      <div className="travel-content container">
        <section className="travel-atlas" aria-labelledby="travel-atlas-title">
          <div className="travel-atlas__top">
            <h2 id="travel-atlas-title">Where I&apos;ve been</h2>
            <p className="travel-atlas__count">{usPlaces.length + outsidePlaces.length} places listed</p>
          </div>
          <p className="travel-atlas__intro">I want to visit every country someday. Select a dot or a place name to see photos from that trip. The other places are part of the record too.</p>
          <div className="travel-map"><WorldMap selectedId={selectedId} onSelect={selectStop} /></div>
          <p className="travel-map__legend"><span className="travel-map__legend-visited" /> Visited <span className="travel-map__legend-photo" /> Photos available</p>

          <div className="travel-photo-stop" ref={photoPanel} aria-live="polite">
            <div className="travel-photo-stop__heading">
              <div>
                <p className="travel-photo-stop__eyebrow">Photo stop</p>
                <h3>{selectedStop.label}</h3>
                <p>{selectedStop.detail}</p>
              </div>
              <span>{selectedStop.photos.length} {selectedStop.photos.length === 1 ? "photo" : "photos"}</span>
            </div>
            <PhotoNotebook ariaLabel={`${selectedStop.label} photos`} photos={selectedStop.photos} />
          </div>

          <div className="travel-places" aria-label="Places visited">
            <section aria-labelledby="travel-us-title">
              <div className="travel-places__heading"><h3 id="travel-us-title">United States</h3><span>Michigan is home</span></div>
              {placeList(usPlaces)}
              <button type="button" className={`travel-places__extra${selectedId === "southwest" ? " is-selected" : ""}`} onClick={() => selectStop("southwest")} aria-pressed={selectedId === "southwest"}>American Southwest canyon photos ↗</button>
            </section>
            <section aria-labelledby="travel-world-title">
              <div className="travel-places__heading"><h3 id="travel-world-title">Countries &amp; territories</h3><span>Beyond the states</span></div>
              {placeList(outsidePlaces)}
              <button type="button" className={`travel-places__extra${selectedId === "wuxi" ? " is-selected" : ""}`} onClick={() => selectStop("wuxi")} aria-pressed={selectedId === "wuxi"}>Wuxi fencing photos ↗</button>
            </section>
          </div>
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
            <PhotoNotebook ariaLabel="Boston photos" photos={boston.photos} />
          </div>
        </section>
      </div>
    </div>
  );
}
