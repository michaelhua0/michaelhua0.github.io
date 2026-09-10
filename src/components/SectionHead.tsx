import type { ReactNode } from "react";

/* Shared heading and a static divider. */
export default function SectionHead({
  title,
  note,
  id,
  titleId,
}: {
  title: ReactNode;
  note?: ReactNode;
  id?: string;
  titleId?: string;
}) {
  return (
    <div id={id} className="sec-head">
      <div className="sec-head__row">
        <h2 id={titleId} className="sec-head__title">
          {title}
        </h2>
        {note !== undefined && (
          <span className="sec-head__note readout readout--quiet">{note}</span>
        )}
      </div>
      <span className="sec-head__rule" aria-hidden="true" />
    </div>
  );
}
