import "./ctiscameramark.css";

export default function CTISCameraMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ctis-camera-mark ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="ctis-camera-mark__flash-glow" cx="47" cy="10" r="10" />
      <g className="ctis-camera-mark__flash-burst">
        <path d="M47 1V-2M56 4l3-3M59 11h4M38 4l-3-3M35 11h-4" />
      </g>

      <g className="ctis-camera-mark__camera">
        <g className="ctis-camera-mark__flash-unit">
          <path className="ctis-camera-mark__flash-neck" d="M43 19v-3h8v3" />
          <rect className="ctis-camera-mark__flash-housing" x="39" y="7" width="16" height="10" />
          <rect className="ctis-camera-mark__flash-panel" x="42" y="9.5" width="10" height="5" />
        </g>

        <g className="ctis-camera-mark__body">
          <path className="ctis-camera-mark__body-shell" d="M10 23l7-7h30l7 7v27l-5 5H15l-5-5Z" />
          <path className="ctis-camera-mark__top-plane" d="m10 23 7-7h30l7 7Z" />
          <path className="ctis-camera-mark__side-plane" d="M47 16l7 7v27l-5 5h-2Z" />
          <circle className="ctis-camera-mark__status-light" cx="17" cy="25" r="1.7" />
          <path className="ctis-camera-mark__control" d="M21 19h8M44 21h4" />
        </g>

        <g className="ctis-camera-mark__optics">
          <circle className="ctis-camera-mark__lens-outer" cx="32" cy="37" r="13.5" />
          <circle className="ctis-camera-mark__lens-ring" cx="32" cy="37" r="10" />
          <g className="ctis-camera-mark__aperture">
            <path d="m32 28.5 7.4 4.25v8.5L32 45.5l-7.4-4.25v-8.5Z" />
            <circle cx="32" cy="37" r="3.2" />
          </g>
          <g className="ctis-camera-mark__diffraction">
            <rect className="ctis-camera-mark__order ctis-camera-mark__order--violet" x="27" y="31" width="3.5" height="3.5" />
            <rect className="ctis-camera-mark__order ctis-camera-mark__order--teal" x="30.25" y="35.25" width="3.5" height="3.5" />
            <rect className="ctis-camera-mark__order ctis-camera-mark__order--amber" x="34" y="39.5" width="3.5" height="3.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}
