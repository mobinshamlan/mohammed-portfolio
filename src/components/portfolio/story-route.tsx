import type { ReactNode } from "react";

type StopKind = "home" | "brighton" | "london" | "return";

export function RouteStop({
  id,
  kind,
  place,
  when,
  children,
}: {
  id: string;
  kind: StopKind;
  place: string;
  when: string;
  children: ReactNode;
}) {
  return (
    <li id={id} className="vb-route-stop" data-kind={kind}>
      <span className="vb-route-pin" aria-hidden="true" />
      <header className="vb-route-head">
        <h3 className="vb-route-place">{place}</h3>
        <p className="vb-route-when">{when}</p>
      </header>
      {children}
    </li>
  );
}
