import SectionHead from "./SectionHead";
import { homeGalleryItems } from "../data/photos";
import "./homegallery.css";

export default function HomeGallery() {
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
            const photoUrl = `${import.meta.env.BASE_URL}images/${photo.src}`;
            return (
              <li key={photo.src} className="home-gallery__photo">
                <img src={photoUrl} alt={photo.alt} loading="lazy" decoding="async" />
                <span className="home-gallery__cap">
                  <span className="home-gallery__cap-title">{photo.caption}</span>
                  <span className="home-gallery__cap-meta">{photo.meta}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
