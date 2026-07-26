import { site } from "../data/site";
import "./contactlinks.css";

const contactItems = [
  { key: "email", label: "Email" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "scholar", label: "Google Scholar" },
  { key: "cvHref", label: "CV (PDF)" },
] as const;

type ContactKey = (typeof contactItems)[number]["key"];

function contactHref(key: ContactKey, value: string) {
  return key === "email" ? `mailto:${value}` : value;
}

export default function ContactLinks({
  items,
  className = "",
}: {
  items?: ContactKey[];
  className?: string;
}) {
  const visibleItems = items
    ? contactItems.filter((item) => items.includes(item.key))
    : contactItems;

  return (
    <ul className={`contact-list ${className}`}>
      {visibleItems.map(({ key, label }) => {
        const value = site.contact[key];
        const pending = value.startsWith("TODO(owner):");
        const external = key !== "email" && /^https?:\/\//.test(value);

        return (
          <li key={key}>
            {pending ? (
              <span className="contact-list__item contact-list__item--pending">
                <span className="contact-list__label">{label}</span>
                <span className="contact-list__value">{value}</span>
              </span>
            ) : (
              <a
                className="contact-list__item"
                href={contactHref(key, value)}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span className="contact-list__label">{label}</span>
                <span className="contact-list__value">
                  {key === "email" ? value : label}
                </span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
