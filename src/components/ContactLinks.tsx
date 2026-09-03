import { site } from "../data/site";
import "./contactlinks.css";

export default function ContactLinks({
  className = "",
}: {
  className?: string;
}) {
  const email = site.contact.email;
  const linkedin = site.contact.linkedin;

  return (
    <ul className={`contact-list ${className}`}>
      <li>
        <a className="contact-list__item" href={`mailto:${email}`}>
          <span className="contact-list__label readout readout--quiet">Email</span>
          <span className="contact-list__value">{email}</span>
        </a>
      </li>
      <li>
        <a
          className="contact-list__item"
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-list__label readout readout--quiet">LinkedIn</span>
          <span className="contact-list__value">michael-hua-392731364</span>
        </a>
      </li>
    </ul>
  );
}
