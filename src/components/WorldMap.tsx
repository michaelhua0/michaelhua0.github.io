import { travelStops, visitedCountryCodes } from "../data/travel";
import { worldMap } from "../data/worldMap";

const visited = new Set(visitedCountryCodes);
const pinOffsets: Record<string, [number, number]> = {
  boston: [11, -10], "new-york": [-11, 10], arizona: [-11, 10], southwest: [11, -10],
  shanghai: [13, -10], wuxi: [-13, 10], macao: [-8, 10],
};

export default function WorldMap({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="travel-map__canvas">
      <svg className="travel-map__svg" viewBox="0 12 1000 415" role="img" aria-label="World map with visited countries and regions highlighted">
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
      </svg>
      <div className="travel-map__pins" aria-label="Places with photos">
        {travelStops.map((stop) => {
          const x = ((stop.longitude + 180) / 360) * 100;
          const y = (((90 - stop.latitude) / 180) * 500 - 12) / 415 * 100;
          const [offsetX, offsetY] = pinOffsets[stop.id] ?? [0, 0];
          return (
            <button
              key={stop.id}
              type="button"
              className={`travel-map__pin${selectedId === stop.id ? " is-selected" : ""}`}
              style={{ left: `calc(${x}% + ${offsetX}px)`, top: `calc(${y}% + ${offsetY}px)` }}
              onClick={() => onSelect(stop.id)}
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
