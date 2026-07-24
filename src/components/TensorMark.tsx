import "./tensormark.css";

export default function TensorMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`tensor-mark ${className}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <g className="tensor-mark__faces">
        <path className="tensor-mark__face tensor-mark__face--top" d="M32 6 56 19 32 32 8 19Z" />
        <path className="tensor-mark__face tensor-mark__face--left" d="M8 19 32 32v26L8 45Z" />
        <path className="tensor-mark__face tensor-mark__face--right" d="M32 32 56 19v26L32 58Z" />
      </g>

      <g className="tensor-mark__grid">
        <path d="M20 12.5 44 25.5M44 12.5 20 25.5" />
        <path d="M20 25.5v26M8 32l24 13" />
        <path d="M44 25.5v26M56 32 32 45" />
      </g>

      <g className="tensor-mark__edges">
        <path d="M32 6 56 19v26L32 58 8 45V19Z" />
        <path d="M8 19 32 32l24-13M32 32v26" />
      </g>

      <g className="tensor-mark__core">
        <path className="tensor-mark__core-face tensor-mark__core-face--top" d="m32 25.5 6.5 3.5-6.5 3.5-6.5-3.5Z" />
        <path className="tensor-mark__core-face tensor-mark__core-face--left" d="m25.5 29 6.5 3.5v7L25.5 36Z" />
        <path className="tensor-mark__core-face tensor-mark__core-face--right" d="m32 32.5 6.5-3.5v7L32 39.5Z" />
      </g>
    </svg>
  );
}
