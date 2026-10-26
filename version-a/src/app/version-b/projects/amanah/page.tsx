import type { Metadata } from "next";
import Link from "next/link";
import { VersionBCase } from "@/components/version-b/case-shell";
import { Reveal } from "@/components/version-b/reveal";

export const metadata: Metadata = {
  title: "AMANAH — Mohammed Bin Shamlan",
  description:
    "Case study for AMANAH, an AI-assisted lost-and-found web application for institutions.",
};

const tech = ["Next.js", "TypeScript", "Tailwind CSS"];

const planned = [
  "Report a lost belonging",
  "Report a found belonging",
  "Suggest possible matches between reports",
  "Keep personal details protected during matching",
];

export default function AmanahCaseStudyPage() {
  return (
    <VersionBCase>
      <p className="vb-kicker">
        <Link href="/version-b#work" className="vb-crumb">
          Work
        </Link>
        {" / "}
        AMANAH
      </p>
      <h1 className="vb-case-title">Amanah</h1>
      <p className="vb-status">In development</p>
      <p className="vb-project-lead">
        An AI-assisted lost-and-found web application for institutions.
      </p>
      <ul className="vb-tech">
        {tech.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="vb-case-hero">
        <div className="vb-amanah-mark vb-amanah-case">
          <span className="vb-amanah-letter" aria-hidden="true">
            A
          </span>
          <p className="vb-amanah-meta">02 / In development</p>
          <p className="vb-amanah-word">Amanah</p>
          <p className="vb-amanah-sub">Lost &amp; found, with care.</p>
          <p className="vb-amanah-foot">Interface screenshots will be added here.</p>
        </div>
      </div>

      <section className="vb-case-block">
        <h2>The problem</h2>
        <p>
          Institutions often receive lost and found items without a clear,
          private way to reconnect them with the right people. Public boards
          and informal chats can expose more personal detail than necessary.
        </p>
      </section>

      <section className="vb-case-block">
        <h2>Proposed solution</h2>
        <p>
          AMANAH is a web application for reporting lost or found belongings.
          Matching is intended to help identify possible pairs while keeping
          personal details protected.
        </p>
      </section>

      <section className="vb-case-block">
        <h2>Key features</h2>
        <p className="vb-note">Planned. Not presented as completed work.</p>
        <ul className="vb-feature-list">
          {planned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="vb-case-block">
        <h2>Technologies</h2>
        <ul className="vb-tech">
          {tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="vb-case-block">
        <h2>Visual gallery</h2>
        <p className="vb-note">
          Product screenshots are not available yet. They can be placed here
          when the interface is ready to show.
        </p>
      </section>

      <section className="vb-case-block">
        <h2>Technical approach</h2>
        <p>
          The project is being built as a Next.js, TypeScript, and Tailwind CSS
          web application.
        </p>
        <p className="vb-note">
          Notes on data, matching, and privacy implementation can be added here.
        </p>
      </section>

      <section className="vb-case-block">
        <h2>Challenges and learnings</h2>
        <p className="vb-note">
          Notes on the hardest problems, and what they taught, can be added
          here.
        </p>
      </section>

      <Reveal>
        <Link href="/version-b#work" className="vb-text-link">
          Back to selected work
        </Link>
      </Reveal>
    </VersionBCase>
  );
}
