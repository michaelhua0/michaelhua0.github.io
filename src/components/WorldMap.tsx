import type { MouseEvent } from "react";
import { travelStops, visitedCountryCodes } from "../data/travel";
import { worldMap } from "../data/worldMap";
import { MAP_HEIGHT, MAP_WIDTH, projectCountryPath, projectLocation } from "../lib/mapProjection";

const visited = new Set(visitedCountryCodes);
const projectedCountries = worldMap.map((country) => ({ ...country, path: projectCountryPath(country.path) }));
// These countries are too small to appear in the 1:110m country outlines.
// Anchor the markers at Singapore's center and Malé rather than at map pixels.
const smallVisitedPlaces = [
  { name: "Maldives", longitude: 73.50972, latitude: 4.17417 },
  { name: "Singapore", longitude: 103.8198, latitude: 1.3521 },
  { name: "Hong Kong", longitude: 114.1694, latitude: 22.3193 },
];

export default function WorldMap({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  function selectPin(event: MouseEvent<HTMLButtonElement>, id: string) {
    if (event.detail === 0) {
      onSelect(id);
      return;
    }
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) return onSelect(id);
    const clickX = event.clientX - bounds.left;
    const clickY = event.clientY - bounds.top;
    // Nearby cities may share a hit area. Select the geographically closest dot.
    const nearest = travelStops.reduce((best, stop) => {
      const [x, y] = projectLocation(stop.longitude, stop.latitude);
      const distance = Math.hypot(clickX - x / MAP_WIDTH * bounds.width, clickY - y / MAP_HEIGHT * bounds.height);
      return distance < best.distance ? { id: stop.id, distance } : best;
    }, { id, distance: Infinity });
    onSelect(nearest.id);
  }

  return (
    <div className="travel-map__canvas">
      <svg className="travel-map__svg" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label="World map with visited countries and regions highlighted">
        <rect className="travel-map__ocean" width={MAP_WIDTH} height={MAP_HEIGHT} />
        <g className="travel-map__land">
          {projectedCountries.map((country) => (
            <path
              key={country.id}
              d={country.path}
              className={visited.has(country.id) ? "travel-map__country is-visited" : "travel-map__country"}
              fillRule="evenodd"
            >
              <title>{country.name}{visited.has(country.id) ? " · visited" : ""}</title>
            </path>
          ))}
        </g>
        <g className="travel-map__small-places" aria-hidden="true">
          {smallVisitedPlaces.map((place) => {
            const [x, y] = projectLocation(place.longitude, place.latitude);
            return <circle key={place.name} cx={x} cy={y} r="3.2"><title>{place.name} · visited</title></circle>;
          })}
        </g>
      </svg>
      <div className="travel-map__pins" role="group" aria-label="Places with photos">
        {travelStops.map((stop) => {
          const [x, y] = projectLocation(stop.longitude, stop.latitude);
          return (
            <button
              key={stop.id}
              type="button"
              className={`travel-map__pin${selectedId === stop.id ? " is-selected" : ""}`}
              style={{ left: `${x / MAP_WIDTH * 100}%`, top: `${y / MAP_HEIGHT * 100}%` }}
              onClick={(event) => selectPin(event, stop.id)}
              aria-label={`Show photos from ${stop.label}`}
              aria-pressed={selectedId === stop.id}
              data-label={stop.label}
              title={stop.label}
            ><span /></button>
          );
        })}
      </div>
    </div>
  );
}
