import { notebookImageSizes } from "../data/notebookImageSizes";
import { imageUrl } from "../lib/images";
import "./photonotebook.css";

export interface NotebookPhoto {
  label: string;
  src?: string;
  alt?: string;
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
  function renderPhoto(photo: NotebookPhoto) {
    const dimensions = photo.src ? notebookImageSizes[photo.src] : undefined;
    return (
      <figure className="photo-notebook__item" key={photo.src ?? photo.label}>
        {photo.src && <img src={imageUrl(photo.src)} alt={photo.alt ?? photo.label} width={dimensions?.width} height={dimensions?.height} loading={eager ? "eager" : "lazy"} decoding={eager ? "sync" : "async"} />}
      </figure>
    );
  }

  return (
    <div className={`photo-notebook photo-notebook--${featured ? "featured" : photos.length === 1 ? "single" : photos.length === 2 || photos.length === 4 ? "pair" : "collage"}${stablePair ? " photo-notebook--stable-pair" : ""}`} role="group" aria-label={ariaLabel}>
      <div className="photo-notebook__grid">
        {featured ? <>
          {renderPhoto(photos[0])}
          <div className="photo-notebook__support">{photos.slice(1).map(renderPhoto)}</div>
        </> : photos.map(renderPhoto)}
      </div>
    </div>
  );
}
