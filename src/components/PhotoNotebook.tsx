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
}: {
  ariaLabel: string;
  photos: NotebookPhoto[];
}) {
  return (
    <div className="photo-notebook" role="group" aria-label={ariaLabel}>
      <div className="photo-notebook__grid">
        {photos.map((photo) => (
          <figure className="photo-notebook__item" key={photo.label}>
            <div className="photo-notebook__frame">
              {photo.src ? (
                <img src={imageUrl(photo.src)} alt={photo.alt ?? photo.label} loading="lazy" decoding="async" />
              ) : (
                <div className="photo-notebook__empty" role="img" aria-label={`Photo placeholder: ${photo.label}`}>
                  Photo to be added
                </div>
              )}
            </div>
            <figcaption>{photo.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
