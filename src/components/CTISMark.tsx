import "./ctismark.css";

export default function CTISMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ctis-mark ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="ctis-mark__frame"
        d="M17 5h30l12 12v30L47 59H17L5 47V17Z"
      />

      <g className="ctis-mark__rays">
        <path d="M32 32 19 19M32 32V18M32 32l13-13M32 32H18M32 32h14M32 32 19 45M32 32v14M32 32l13 13" />
      </g>

      <g className="ctis-mark__orders">
        <rect className="ctis-mark__order ctis-mark__order--violet" x="16" y="16" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--blue" x="29" y="15" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--teal" x="42" y="16" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--green" x="15" y="29" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--amber" x="43" y="29" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--red" x="16" y="42" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--amber" x="29" y="43" width="6" height="6" rx="1.5" />
        <rect className="ctis-mark__order ctis-mark__order--violet" x="42" y="42" width="6" height="6" rx="1.5" />
      </g>

      <circle className="ctis-mark__lens" cx="32" cy="32" r="9.5" />
      <circle className="ctis-mark__aperture" cx="32" cy="32" r="5" />
      <circle className="ctis-mark__glint" cx="29.7" cy="29.2" r="1.5" />
    </svg>
  );
}
