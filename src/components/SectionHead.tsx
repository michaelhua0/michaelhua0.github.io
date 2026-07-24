import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

/* The single section-header system: an optional mark/index, a serif title,
   and an optional right-aligned readout, sitting on a rule that draws itself
   in when scrolled into view. */
export default function SectionHead({
  mark,
  title,
  note,
  id,
  titleId,
}: {
  mark?: ReactNode;
  title: ReactNode;
  note?: ReactNode;
  id?: string;
  titleId?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} id={id} className={`sec-head ${inView ? "is-in" : ""}`}>
      <div className="sec-head__row">
        {mark !== undefined && <span className="sec-head__mark">{mark}</span>}
        <h2 id={titleId} className="sec-head__title">
          {title}
        </h2>
        {note !== undefined && <span className="sec-head__note">{note}</span>}
      </div>
      <span className="sec-head__rule" aria-hidden="true" />
    </div>
  );
}
