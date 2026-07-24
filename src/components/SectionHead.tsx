import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

/* The shared section-header system: a serif title and an optional readout,
   sitting on a rule that draws itself in when scrolled into view. */
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
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} id={id} className={`sec-head ${inView ? "is-in" : ""}`}>
      <div className="sec-head__row">
        <h2 id={titleId} className="sec-head__title">
          {title}
        </h2>
        {note !== undefined && <span className="sec-head__note">{note}</span>}
      </div>
      <span className="sec-head__rule" aria-hidden="true" />
    </div>
  );
}
