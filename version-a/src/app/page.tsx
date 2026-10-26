import type { Metadata } from "next";
import Link from "next/link";
import { ExperimentShell } from "@/components/experiment-shell";

export const metadata: Metadata = {
  title: "Portfolio experiment",
  description:
    "An exploration of how different prompts shape the same personal portfolio.",
};

const panels = [
  {
    href: "/version-a",
    marker: "01 / VERSION A",
    title: "THE FIRST DRAFT.",
    description: "Created using a simple prompt.",
    cta: "EXPLORE VERSION A",
    className: "experiment-panel",
  },
  {
    href: "/version-b",
    marker: "02 / VERSION B",
    title: "THE CREATIVE DIRECTION.",
    description:
      "Created using structured prompts, intentional design, and iterative refinement.",
    cta: "EXPLORE VERSION B",
    className: "experiment-panel experiment-panel-b",
  },
] as const;

export default function HomePage() {
  return (
    <ExperimentShell className="experiment-home">
      <header className="px-6 pb-12 pt-14 md:px-12 md:pb-10 md:pt-14">
        <p className="experiment-kicker">
          MOHAMMED BIN SHAMLAN
          <span className="mt-2 block">PORTFOLIO EXPERIMENT / 2026</span>
        </p>
        <h1 className="display experiment-title mt-8">
          ONE PERSON.
          <span className="block">TWO EXPERIENCES.</span>
        </h1>
        <p className="mt-8 max-w-[34ch] text-lg leading-8 md:text-xl">
          An exploration of how different prompts shape the same personal
          portfolio.
        </p>
      </header>
      <div className="experiment-panels">
        {panels.map((panel) => (
          <Link key={panel.href} href={panel.href} className={panel.className}>
            <p className="experiment-kicker">{panel.marker}</p>
            <div>
              <h2 className="display">{panel.title}</h2>
              <p className="experiment-copy">{panel.description}</p>
            </div>
            <span className="experiment-cta">
              {panel.cta} <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </ExperimentShell>
  );
}
