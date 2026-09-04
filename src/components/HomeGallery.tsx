import { homeGalleryItems } from "../data/photos";
import { imageSrcSet, imageUrl } from "../lib/images";
import "./homegallery.css";

export default function HomeGallery() {
  if (homeGalleryItems.length === 0) return null;

  return (
    <section className="section home-gallery" aria-label="Photo gallery">
      <div className="container">
        <ul className="home-gallery__grid">
          {homeGalleryItems.map((photo) => {
            return (
              <li key={photo.src} className="home-gallery__item">
                <figure className="home-gallery__photo">
                  <img
                    src={imageUrl(photo.src)}
                    srcSet={imageSrcSet(photo.sources)}
                    sizes="(max-width: 620px) 42vw, 204px"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
