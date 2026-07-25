import { useState } from "react";
import GeneratedArt from "./GeneratedArt";

type Motif = "spectral" | "vessel" | "point-cloud" | "app" | "documentary" | "channel";

interface Props {
  /** File name inside /public/images, e.g. "aigro.jpg" */
  src: string;
  alt: string;
  motif: Motif;
  className?: string;
  /** aspect ratio, e.g. "16 / 10" */
  ratio?: string;
  /** Preserve the complete image for diagrams, logos, and document pages. */
  fit?: "cover" | "contain";
  /** Background shown around a contained image. */
  imageBackground?: string;
}

/**
 * Renders the real photo/screenshot once you place it in /public/images.
 * Until then (or if it fails to load) it shows a themed scientific graphic —
 * never stock photos or AI-generated people.
 */
export default function SmartImage({
  src,
  alt,
  motif,
  className,
  ratio = "16 / 10",
  fit = "cover",
  imageBackground,
}: Props) {
  const [failed, setFailed] = useState(false);
  const url = `${import.meta.env.BASE_URL}images/${src}`;
  const frameBackground =
    imageBackground ?? (fit === "contain" ? "#f4f3ef" : "var(--ink-2)");

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        background: frameBackground,
        borderRadius: "inherit",
      }}
    >
      {failed ? (
        <GeneratedArt motif={motif} seed={src} />
      ) : (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            display: "block",
            background: frameBackground,
          }}
        />
      )}
    </div>
  );
}
