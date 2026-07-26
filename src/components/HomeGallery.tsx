import SectionHead from "./SectionHead";
import { homeGalleryItems } from "../data/photos";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./homegallery.css";

export default function HomeGallery() {
  if (homeGalleryItems.length === 0) return null;

  return (
    <section className="section home-gallery" aria-labelledby="gallery-h">
      <div className="container">
        <SectionHead
          title="Life between projects"
          note={`${homeGalleryItems.length} frames`}
          titleId="gallery-h"
        />
        <p className="home-gallery__intro">
          Research shapes the work. Friends, travel, competitions, and the occasional chaotic
          photo shape everything around it.
        </p>

        <ul className="home-gallery__grid">
          {homeGalleryItems.map((photo) => {
            return (
              <li key={photo.src} className="home-gallery__item">
                <figure className="home-gallery__photo">
                  <img
                    src={imageUrl(photo.src)}
                    srcSet={imageSrcSet(photo.sources)}
                    sizes="(max-width: 680px) 44vw, 240px"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
