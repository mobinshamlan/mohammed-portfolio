import type { ReactNode } from "react";

type StopKind = "home" | "short" | "long" | "now" | "next";

/**
 * One stop on the route. Each stop draws its own stretch of the line, so the
 * stops placed side by side (or stacked on phones) read as one journey: a
 * dotted line while travelling, a thick accent line for the years in London,
 * a faint line for what comes next.
 */
export function RouteStop({
  id,
  kind,
  en,
  ar,
  when,
  children,
}: {
  id?: string;
  kind: StopKind;
  en: ReactNode;
  ar?: string;
  when: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li id={id} className="vb-route-stop" data-kind={kind}>
      <span className="vb-route-pin" aria-hidden="true" />
      <p className="vb-route-when">{when}</p>
      <h3 className="vb-route-place">
        {en}
        {ar ? (
          <span lang="ar" dir="rtl">
            {ar}
          </span>
        ) : null}
      </h3>
      {children}
    </li>
  );
}
