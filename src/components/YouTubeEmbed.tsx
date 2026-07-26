import { useState } from "react";
import "./youtube.css";

interface Props {
  id: string;
  title: string;
}

/** Lazy facade: shows the thumbnail until the user chooses to play,
 *  so pages load fast and no third-party iframe runs until requested. */
export default function YouTubeEmbed({ id, title }: Props) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <figure className="yt">
      <div className="yt__frame">
        {active ? (
          <iframe
            className="yt__iframe"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="yt__facade"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            style={{ backgroundImage: `url(${thumb})` }}
          >
            <span className="yt__play" aria-hidden="true">
              <svg viewBox="0 0 68 48" width="68" height="48">
                <path
                  d="M66.5 7.7c-.8-3-2.5-4.7-5.4-5.5C55.5 1 34 1 34 1S12.5 1 6.9 2.2c-2.9.8-4.6 2.5-5.4 5.5C0 13.3 0 24 0 24s0 10.7 1.5 16.3c.8 3 2.5 4.7 5.4 5.5C12.5 47 34 47 34 47s21.5 0 27.1-1.2c2.9-.8 4.6-2.5 5.4-5.5C68 34.7 68 24 68 24s0-10.7-1.5-16.3z"
                  fill="var(--video-red)"
                />
                <path d="M27 34l18-10-18-10z" fill="var(--white)" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="yt__caption mono-copy">{title}</figcaption>
    </figure>
  );
}
