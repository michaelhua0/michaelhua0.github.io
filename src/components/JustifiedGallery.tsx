import { notebookImageSizes } from "../data/notebookImageSizes";
import { imageUrl } from "../lib/images";
import "./justifiedgallery.css";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

export default function JustifiedGallery({ ariaLabel, rows }: { ariaLabel: string; rows: GalleryPhoto[][] }) {
  return (
    <div className="justified-gallery" role="group" aria-label={ariaLabel}>
      {rows.map((row, index) => (
        <div className="justified-gallery__row" key={index}>
          {row.map((photo) => {
            const dimensions = notebookImageSizes[photo.src];
            return (
              <figure className="justified-gallery__item" key={photo.src} style={{ flexGrow: dimensions ? dimensions.width / dimensions.height : 1 }}>
                <img
                  src={imageUrl(photo.src)}
                  alt={photo.alt}
                  width={dimensions?.width}
                  height={dimensions?.height}
                  loading="eager"
                  decoding="sync"
                />
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}
