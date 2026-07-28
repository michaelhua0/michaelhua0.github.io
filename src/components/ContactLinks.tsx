import { site } from "../data/site";
import "./contactlinks.css";

export default function ContactLinks({
  className = "",
}: {
  className?: string;
}) {
  const email = site.contact.email;

  return (
    <ul className={`contact-list ${className}`}>
      <li>
        <a className="contact-list__item" href={`mailto:${email}`}>
          <span className="contact-list__label readout readout--quiet">Email</span>
          <span className="contact-list__value">{email}</span>
        </a>
      </li>
    </ul>
  );
}
