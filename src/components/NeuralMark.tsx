import "./neuralmark.css";

export default function NeuralMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`neural-mark ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="neural-mark__frame" x="8" y="8" width="48" height="48" rx="13" />

      <g className="neural-mark__pins">
        <path d="M20 4v4M32 4v4M44 4v4M20 56v4M32 56v4M44 56v4" />
        <path d="M4 20h4M4 32h4M4 44h4M56 20h4M56 32h4M56 44h4" />
      </g>

      <g className="neural-mark__connections">
        <path d="M18 21 31 17 46 25M18 21l13 7 15-3M18 32l13-4 15-3" />
        <path d="M18 32l13 6 15 1M18 43l13-5 15 1M18 43l13 5 15-9" />
      </g>

      <path className="neural-mark__signal" d="M18 32 31 28 46 25" />

      <g className="neural-mark__inputs">
        <circle className="neural-mark__node" cx="18" cy="21" r="2.5" />
        <circle className="neural-mark__node neural-mark__node--active" cx="18" cy="32" r="3" />
        <circle className="neural-mark__node" cx="18" cy="43" r="2.5" />
      </g>

      <g className="neural-mark__latent">
        <rect className="neural-mark__node" x="28.5" y="14.5" width="5" height="5" rx="1.2" transform="rotate(45 31 17)" />
        <rect className="neural-mark__node neural-mark__node--active" x="28" y="25" width="6" height="6" rx="1.4" transform="rotate(45 31 28)" />
        <rect className="neural-mark__node" x="28.5" y="35.5" width="5" height="5" rx="1.2" transform="rotate(45 31 38)" />
        <rect className="neural-mark__node" x="28.5" y="45.5" width="5" height="5" rx="1.2" transform="rotate(45 31 48)" />
      </g>

      <g className="neural-mark__outputs">
        <rect className="neural-mark__node neural-mark__node--active" x="43" y="22" width="6" height="6" rx="2" />
        <rect className="neural-mark__node" x="43.5" y="36.5" width="5" height="5" rx="1.6" />
      </g>
    </svg>
  );
}
