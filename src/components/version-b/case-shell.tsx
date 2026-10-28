import type { ReactNode } from "react";
import { VersionBFooter } from "./contact";
import { VersionBNav } from "./nav";

export function VersionBCase({
  children,
  bleed = false,
}: {
  children: ReactNode;
  bleed?: boolean;
}) {
  return (
    <>
      <a href="#case" className="vb-skip">
        Skip to content
      </a>
      <VersionBNav />
      <main id="case" className={bleed ? "vb-case vb-case-bleed" : "vb-case"}>
        {children}
      </main>
      <VersionBFooter />
    </>
  );
}
