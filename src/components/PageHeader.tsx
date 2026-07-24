import type { ReactNode } from "react";
import "./pageheader.css";

export default function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="pageheader">
      <div className="container">
        {eyebrow && (
          <div className="pageheader__eyebrow">
            <span className="eyebrow" style={{ margin: 0 }}>{eyebrow}</span>
          </div>
        )}
        <h1 className="pageheader__title long-title">{title}</h1>
        {children && <div className="pageheader__lead">{children}</div>}
      </div>
    </header>
  );
}
