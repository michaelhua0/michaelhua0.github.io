// The webfont ships the latin subset, which has no U+2197. iOS therefore fell
// back to Apple Color Emoji and drew a blue emoji arrow. Draw it instead.
export default function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `icon-arrow ${className}` : "icon-arrow"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.2 11.8 11.8 4.2" />
      <path d="M5.5 4.2h6.3v6.3" />
    </svg>
  );
}
