import type { ReactNode } from "react";

type StopKind = "home" | "short" | "long" | "now" | "next";

/**
 * One stop on the route: the place, when, and what happened there. Each stop
 * owns its stretch of the rail and its pin: across the top on wide screens,
 * down the left edge on phones.
 */
export function RouteStop({
  id,
  kind,
  en,
  when,
  aside,
  children,
}: {
  id?: string;
  kind: StopKind;
  en: ReactNode;
  when: ReactNode;
  /** Shown beside the place name where there is room, such as certificates. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li id={id} className="vb-route-stop" data-kind={kind}>
      <span className="vb-route-pin" aria-hidden="true" />
      <div className="vb-route-head">
        <div>
          <h3 className="vb-route-place">
            {en}
          </h3>
          <p className="vb-route-when">{when}</p>
        </div>
        {aside}
      </div>
      {children}
    </li>
  );
}
