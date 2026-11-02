import type { MouseEvent } from "react";
import { travelStops, visitedCountryCodes } from "../data/travel";
import { worldMap } from "../data/worldMap";
import { MAP_HEIGHT, MAP_WIDTH, graticulePath, projectCountryPath, projectLocation } from "../lib/mapProjection";

const visited = new Set(visitedCountryCodes);
const projectedCountries = worldMap.map((country) => ({ ...country, path: projectCountryPath(country.path) }));
const latitudeLines = [-60, -30, 0, 30, 60].map((latitude) => graticulePath("latitude", latitude));
const longitudeLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((longitude) => graticulePath("longitude", longitude));
// These visited places are smaller than the country outlines at 1:110m scale.
const smallVisitedPlaces = [
  { name: "Maldives", longitude: 73.2, latitude: 3.2 },
  { name: "Singapore", longitude: 103.85, latitude: 1.3 },
  { name: "Hong Kong", longitude: 114.16, latitude: 22.31 },
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
        <g className="travel-map__graticule" aria-hidden="true">
          {latitudeLines.map((path, index) => <path key={`latitude-${index}`} d={path} />)}
          {longitudeLines.map((path, index) => <path key={`longitude-${index}`} d={path} />)}
        </g>
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
            return <circle key={place.name} cx={x} cy={y} r="2.8"><title>{place.name} · visited</title></circle>;
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
