import { visitedCountryCodes } from "../data/travel";
import { worldMap } from "../data/worldMap";

const visited = new Set(visitedCountryCodes);

export default function WorldMap() {
  return (
    <svg
      className="travel-map__svg"
      viewBox="0 12 1000 415"
      role="img"
      aria-label={
        visited.size > 0
          ? `Flat world map with ${visited.size} visited countries highlighted`
          : "Flat world map; visited countries will be highlighted as the travel log is filled in"
      }
    >
      <g className="travel-map__grid" aria-hidden="true">
        {[125, 250, 375].map((y) => <path key={`h${y}`} d={`M0 ${y}H1000`} />)}
        {[250, 500, 750].map((x) => <path key={`v${x}`} d={`M${x} 0V500`} />)}
      </g>
      <g className="travel-map__land">
        {worldMap.map((country) => (
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
      <g className="travel-map__boston" aria-hidden="true">
        <circle cx="303" cy="132" r="9" />
        <circle cx="303" cy="132" r="3.5" />
        <path d="M311 128 L339 103 H431" />
        <text x="343" y="97">BOSTON / 2026</text>
      </g>
    </svg>
  );
}
