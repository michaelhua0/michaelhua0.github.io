import { site } from "../data/site";
import "./contactlinks.css";

/** Contact as two named links. The address and handle are carried by the href,
    not printed on the page, so the block stays two words wide wherever it sits. */
export default function ContactLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <ul className={`contact-list ${className}`}>
      <li>
        <a
          className="contact-list__item"
          href={`mailto:${site.contact.email}`}
          aria-label="Email Michael Hua"
        >
          Email
        </a>
      </li>
      <li>
        <a
          className="contact-list__item"
          href={site.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Michael Hua on LinkedIn (opens in a new tab)"
        >
          LinkedIn
        </a>
      </li>
    </ul>
  );
}
