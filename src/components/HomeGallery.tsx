import SectionHead from "./SectionHead";
import { homeGalleryItems } from "../data/photos";
import "./homegallery.css";

export default function HomeGallery() {
  return (
    <section className="section home-gallery" aria-labelledby="gallery-h">
      <div className="container">
        <SectionHead title="Life between projects" note="A few recent frames" titleId="gallery-h" />
        <p className="home-gallery__intro">
          Research shapes the work. Friends, travel, competitions, and the occasional chaotic
          photo shape everything around it.
        </p>

        <div className="home-gallery__grid">
          {homeGalleryItems.map((item) => {
            if (item.kind === "placeholder") {
              return (
                <figure
                  key={item.title}
                  className={`home-gallery__placeholder home-gallery__placeholder--${item.layout}`}
                >
                  <span className="home-gallery__plus" aria-hidden="true">+</span>
                  <figcaption>
                    <p>{item.title}</p>
                    <span>{item.note}</span>
                  </figcaption>
                </figure>
              );
            }

            const photoUrl = `${import.meta.env.BASE_URL}images/${item.photo.src}`;
            const cropClass = item.crop
              ? ` home-gallery__photo--crop home-gallery__crop--${item.crop}`
              : "";

            return (
              <figure
                key={item.id}
                className={`home-gallery__photo home-gallery__photo--${item.layout}${cropClass}`}
              >
                <div className="home-gallery__media">
                  <img
                    src={photoUrl}
                    alt={item.photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
