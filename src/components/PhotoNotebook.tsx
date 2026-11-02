import type { CSSProperties } from "react";
import { notebookImageSizes } from "../data/notebookImageSizes";
import { imageUrl } from "../lib/images";
import "./photonotebook.css";

export interface NotebookPhoto {
  label: string;
  src?: string;
  alt?: string;
  rotateClockwise?: boolean;
}

export default function PhotoNotebook({
  ariaLabel,
  photos,
  featureFirst = false,
  stablePair = false,
  eager = false,
}: {
  ariaLabel: string;
  photos: NotebookPhoto[];
  featureFirst?: boolean;
  stablePair?: boolean;
  eager?: boolean;
}) {
  const featured = featureFirst && photos.length > 1;
  const pairRatios = stablePair && photos.length === 2 ? photos.map((photo) => {
    const dimensions = photo.src ? notebookImageSizes[photo.src] : undefined;
    if (!dimensions) return 1;
    return photo.rotateClockwise ? dimensions.height / dimensions.width : dimensions.width / dimensions.height;
  }) : undefined;
  const pairStyle = pairRatios ? {
    "--photo-pair-first": `${pairRatios[0]}fr`,
    "--photo-pair-second": `${pairRatios[1]}fr`,
  } as CSSProperties : undefined;

  function renderPhoto(photo: NotebookPhoto) {
    const dimensions = photo.src ? notebookImageSizes[photo.src] : undefined;
    const rotatedStyle = photo.rotateClockwise && dimensions ? {
      aspectRatio: `${dimensions.height} / ${dimensions.width}`,
      "--photo-rotate-width": `${dimensions.width / dimensions.height * 100}%`,
    } as CSSProperties : undefined;
    return (
      <figure className={`photo-notebook__item${photo.rotateClockwise ? " photo-notebook__item--rotated" : ""}`} key={photo.src ?? photo.label} style={rotatedStyle}>
        {photo.src && <img src={imageUrl(photo.src)} alt={photo.alt ?? photo.label} width={dimensions?.width} height={dimensions?.height} loading={eager ? "eager" : "lazy"} decoding={eager ? "sync" : "async"} />}
      </figure>
    );
  }

  return (
    <div className={`photo-notebook photo-notebook--${featured ? "featured" : photos.length === 1 ? "single" : photos.length === 2 || photos.length === 4 ? "pair" : "collage"}${stablePair ? " photo-notebook--stable-pair" : ""}`} role="group" aria-label={ariaLabel}>
      <div className="photo-notebook__grid" style={pairStyle}>
        {featured ? <>
          {renderPhoto(photos[0])}
          <div className="photo-notebook__support">{photos.slice(1).map(renderPhoto)}</div>
        </> : photos.map(renderPhoto)}
      </div>
    </div>
  );
}
