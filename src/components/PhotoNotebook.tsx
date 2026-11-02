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
  photos,
}: {
  title: string;
  photos: NotebookPhoto[];
}) {
  return (
    <div className="photo-notebook">
      <div className="photo-notebook__heading">
        <h3>{title}</h3>
        <span className="readout">More photographs to come</span>
      </div>
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
