import type { ReactNode } from "react";

type StopKind = "home" | "short" | "long" | "now" | "next";

/**
 * One stop on the route: the place, when, and what happened there. On wide
 * screens the stop hangs from its point on the arc (see RouteMap); on phones
 * the stops stack along a rail, each with its own pin.
 */
export function RouteStop({
  id,
  kind,
  en,
  ar,
  when,
  aside,
  children,
}: {
  id?: string;
  kind: StopKind;
  en: ReactNode;
  ar?: string;
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
            {ar ? (
              <span lang="ar" dir="rtl">
                {ar}
              </span>
            ) : null}
          </h3>
          <p className="vb-route-when">{when}</p>
        </div>
        {aside}
      </div>
      {children}
    </li>
  );
}
