import type { KeyboardEvent } from "react";
import { placeToStop, usPlaces } from "../data/travel";
import { usStatePaths } from "../data/usStatePaths";

const visited = new Set([...usPlaces, "District of Columbia"]);

export default function UsStatesMap({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  function onStateKey(event: KeyboardEvent<SVGPathElement>, stopId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(stopId);
    }
  }

  return (
    <div className="travel-us-map" role="group" aria-label="United States map showing visited states">
      <div className="travel-us-map__heading">
        <h3>States I&apos;ve visited</h3>
        <span>{usPlaces.length - 1} states + Washington, DC</span>
      </div>
      <div className="travel-us-map__canvas">
        <svg viewBox="0 0 1000 550" role="group" aria-label="United States with visited states highlighted, including Alaska and Hawaii in separate insets">
          {usStatePaths.map((state) => {
            const stopId = placeToStop[state.name];
            const isVisited = visited.has(state.name);
            return (
              <path
                key={state.code}
                d={state.path}
                className={`travel-us-map__state${isVisited ? " is-visited" : ""}${stopId ? " has-photos" : ""}${selectedId === stopId ? " is-selected" : ""}`}
                fillRule="evenodd"
                onClick={stopId ? () => onSelect(stopId) : undefined}
                onKeyDown={stopId ? (event) => onStateKey(event, stopId) : undefined}
                role={stopId ? "button" : undefined}
                tabIndex={stopId ? 0 : undefined}
                aria-label={stopId ? `Show photos from ${state.name}` : undefined}
              >
                <title>{state.name}{isVisited ? " · visited" : ""}{stopId ? " · photos available" : ""}</title>
              </path>
            );
          })}
          <circle className="travel-us-map__dc" cx="731.9" cy="193.8" r="3.2"><title>Washington, DC · visited</title></circle>
          <text x="30" y="427" className="travel-us-map__label">Alaska</text>
          <text x="335" y="452" className="travel-us-map__label">Hawaii</text>
          <text x="742" y="198" className="travel-us-map__label travel-us-map__label--dc">DC</text>
        </svg>
      </div>
    </div>
  );
}
