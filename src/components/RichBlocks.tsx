import { Link } from "react-router-dom";
import type { Block, Segment, LinkItem } from "../data/projects";
import YouTubeEmbed from "./YouTubeEmbed";
import "./richblocks.css";

function InlineSegment({ seg }: { seg: Segment }) {
  if (!seg.href) return <>{seg.text}</>;
  if (seg.internal) {
    return (
      <Link to={seg.href} className="rb-inline">
        {seg.text}
      </Link>
    );
  }
  return (
    <a href={seg.href} target="_blank" rel="noopener noreferrer" className="rb-inline">
      {seg.text}
    </a>
  );
}

function LinkButton({ item }: { item: LinkItem }) {
  const cls = `btn readout ${item.primary ? "btn--primary" : ""}`;
  const arrow = <span className="arrow" aria-hidden="true">→</span>;
  if (item.internal) {
    return (
      <Link to={item.href} className={cls}>
        <span className="btn__label">
          {item.label} {arrow}
        </span>
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
      <span className="btn__label">
        {item.label}
        <span className="arrow" aria-hidden="true">↗</span>
      </span>
    </a>
  );
}

export default function RichBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="rb">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "paragraph":
            return (
              <p key={i} className="rb-p">
                {b.segments.map((s, j) => (
                  <InlineSegment key={j} seg={s} />
                ))}
              </p>
            );
          case "subheading":
            return (
              <h2 key={i} className="rb-sub">
                {b.text}
              </h2>
            );
          case "note":
            return (
              <p key={i} className="rb-note mono-copy mono-copy--strong">
                <span className="rb-note__label readout readout--quiet">Note</span>
                {b.text}
              </p>
            );
          case "citation":
            return (
              <blockquote key={i} className="rb-cite">
                {b.text}
              </blockquote>
            );
          case "video":
            return <YouTubeEmbed key={i} id={b.id} title={b.title ?? "Video"} />;
          case "links":
            return (
              <div key={i} className="rb-links">
                {b.items.map((it, j) => (
                  <LinkButton key={j} item={it} />
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
