import { useState } from "react";
import GeneratedArt from "./GeneratedArt";
import {
  imageSrcSet,
  imageUrl,
  type ResponsiveImageSource,
} from "../lib/images";

type Motif = "spectral" | "vessel" | "point-cloud" | "app" | "documentary" | "channel";

interface Props {
  /** File name inside /public/images, e.g. "aigro.webp" */
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
  /** Optional responsive variants of the same real image. */
  sources?: ResponsiveImageSource[];
  /** Load eagerly when the image is a likely LCP candidate. */
  priority?: boolean;
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
  sources,
  priority = false,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  const loaded = loadedSrc === src;
  const url = imageUrl(src);
  const loadedBackground =
    imageBackground ?? (fit === "contain" ? "var(--figure-mat)" : "var(--ink-2)");

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        background: "var(--surface-2)",
        borderRadius: "inherit",
      }}
    >
      {failed ? (
        <GeneratedArt motif={motif} seed={src} alt={alt} />
      ) : (
        <img
          src={url}
          srcSet={imageSrcSet(sources)}
          sizes={sources ? "(max-width: 760px) 100vw, 50vw" : undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            display: "block",
            background: loadedBackground,
            opacity: loaded ? 1 : 0,
            transition: "opacity var(--dur-1) var(--ease-out)",
          }}
        />
      )}
    </div>
  );
}
