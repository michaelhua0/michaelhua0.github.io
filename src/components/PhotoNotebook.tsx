import { imageUrl } from "../lib/images";
import "./photonotebook.css";

export interface NotebookPhoto {
  label: string;
  note: string;
  src?: string;
  alt?: string;
}

export default function PhotoNotebook({
  title,
  tone,
  photos,
}: {
  title: string;
  tone: "community" | "fencing" | "travel";
  photos: NotebookPhoto[];
}) {
  return (
    <div className={`photo-notebook photo-notebook--${tone}`}>
      <div className="photo-notebook__heading">
        <h3>{title}</h3>
        <span className="readout">More photographs to come</span>
      </div>
      <div className="photo-notebook__grid">
        {photos.map((photo, index) => (
          <figure className="photo-notebook__item" key={photo.label}>
            <div className="photo-notebook__frame">
              {photo.src ? (
                <img src={imageUrl(photo.src)} alt={photo.alt ?? photo.label} loading="lazy" decoding="async" />
              ) : (
                <div className="photo-notebook__empty" role="img" aria-label={`Photo placeholder: ${photo.label}`}>
                  <span className="photo-notebook__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="photo-notebook__crosshair" aria-hidden="true" />
                  <span className="photo-notebook__awaiting readout">Photo coming soon</span>
                </div>
              )}
            </div>
            <figcaption>
              <strong>{photo.label}</strong>
              <span>{photo.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
