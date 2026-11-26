import type { ReactNode } from "react";

type StopKind = "home" | "london" | "return";

/** A small plane for the leg that leaves this stop. Decorative; the words carry the route. */
function Plane() {
  return (
    <svg className="vb-route-plane" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M21.6 11.2 14 8.7V3.2a2 2 0 0 0-4 0v5.5l-7.6 2.5a.8.8 0 0 0-.5.8v1.4a.6.6 0 0 0 .8.6L10 12.4v4.3l-2 1.5v1.6a.5.5 0 0 0 .6.5l3.4-1 3.4 1a.5.5 0 0 0 .6-.5v-1.6l-2-1.5v-4.3l7.3 1.6a.6.6 0 0 0 .8-.6V12a.8.8 0 0 0-.5-.8Z"
      />
    </svg>
  );
}

/**
 * One stop on the route. The airport code is the typographic mark of the place,
 * the artefact (a photo, a certificate, the products) is what the stop left behind.
 * Each stop except the last draws the leg to the next one.
 */
export function RouteStop({
  id,
  kind,
  code,
  place,
  when,
  flyToNext,
  art,
  children,
}: {
  id: string;
  kind: StopKind;
  code: string;
  place: string;
  when: string;
  flyToNext?: boolean;
  art: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li id={id} className="vb-route-stop" data-kind={kind}>
      <span className="vb-route-pin" aria-hidden="true" />
      {flyToNext ? (
        <span className="vb-route-leg" aria-hidden="true">
          <svg className="vb-route-arc" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path d="M0 23 Q50 -14 100 23" vectorEffect="non-scaling-stroke" pathLength={100} />
          </svg>
          <span className="vb-route-flight"><Plane /></span>
        </span>
      ) : null}
      <header className="vb-route-head">
        <span className="vb-route-code" aria-hidden="true">
          {code}
        </span>
        <h3 className="vb-route-place">{place}</h3>
        <p className="vb-route-when">{when}</p>
      </header>
      {children ? <div className="vb-route-body">{children}</div> : null}
      <div className="vb-route-art">{art}</div>
    </li>
  );
}
