import type { ReactNode } from "react";

type StopKind = "home" | "london" | "return";

/**
 * One milestone on the route. The artefact (a photo, a certificate, the products)
 * sits beside the words so each stop is recognised by what it left behind.
 */
export function RouteStop({
  id,
  kind,
  place,
  when,
  art,
  children,
}: {
  id: string;
  kind: StopKind;
  place: string;
  when: string;
  art: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li id={id} className="vb-route-stop" data-kind={kind}>
      <span className="vb-route-pin" aria-hidden="true" />
      <header className="vb-route-head">
        <h3 className="vb-route-place">{place}</h3>
        <p className="vb-route-when">{when}</p>
      </header>
      <div className="vb-route-art">{art}</div>
      <div className="vb-route-body">{children}</div>
    </li>
  );
}
