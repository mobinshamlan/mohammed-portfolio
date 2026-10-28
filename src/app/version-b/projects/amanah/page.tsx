import type { Metadata } from "next";
import Link from "next/link";
import { AmanahArt } from "@/components/version-b/amanah-art";
import { VersionBCase } from "@/components/version-b/case-shell";
import { Reveal } from "@/components/version-b/reveal";

export const metadata: Metadata = {
  title: "AMANAH — Mohammed Bin Shamlan",
  description:
    "Case study for AMANAH, an AI-assisted lost-and-found web application for institutions.",
};

const tech = ["Next.js", "TypeScript", "Tailwind CSS"];

const planned = [
  {
    name: "Report a lost belonging",
    detail: "A person describes what they lost so staff can look for a match.",
  },
  {
    name: "Report a found belonging",
    detail: "A finder logs an item without putting it on a public board.",
  },
  {
    name: "Suggest possible matches",
    detail: "The application is intended to pair similar lost and found reports.",
  },
  {
    name: "Protect personal details",
    detail:
      "Matching should work without exposing more contact information than needed.",
  },
];

export default function AmanahCaseStudyPage() {
  return (
    <VersionBCase>
      <div className="vb-am">
        <header className="vb-am-head">
          <p className="vb-kicker">
            <Link href="/version-b#work" className="vb-crumb">
              Work
            </Link>
            {" / "}
            AMANAH
          </p>
          <p className="vb-status">In development</p>
          <h1 className="vb-case-title">Amanah</h1>
          <p className="vb-project-lead">
            An AI-assisted lost-and-found web application for institutions.
          </p>
          <ul className="vb-tech">
            {tech.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </header>

        <div className="vb-am-stage" aria-hidden="true">
          <AmanahArt />
        </div>
      </div>

      <div className="vb-am-split">
        <section className="vb-case-block">
          <h2>The problem</h2>
          <p>
            Institutions often collect lost and found items without a private
            way to reconnect them with the right people. Noticeboards, group
            chats, and informal lists can show more personal detail than the
            situation needs.
          </p>
        </section>

        <section className="vb-case-block">
          <h2>What it is</h2>
          <p>
            AMANAH is a web application for reporting lost or found belongings
            inside an institution. It is intended to suggest possible matches
            while keeping personal details protected. The product is in
            development, so this page describes the plan rather than a finished
            interface.
          </p>
        </section>
      </div>

      <section className="vb-case-block vb-am-plan">
        <h2>Planned features</h2>
        <p className="vb-note">Not presented as completed work.</p>
        <ol className="vb-am-list">
          {planned.map((item, index) => (
            <li key={item.name}>
              <span className="vb-am-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="vb-am-feat">
                <span className="vb-am-feat-name">{item.name}</span>
                <span className="vb-am-feat-detail">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="vb-case-block">
        <h2>How it is being built</h2>
        <p>
          The application is a Next.js, TypeScript, and Tailwind CSS web
          project. Screenshots and a public repository will be added when they
          are ready to share.
        </p>
      </section>

      <Reveal>
        <div className="vb-am-next">
          <Link href="/version-b/projects/gthrz" className="vb-am-prev">
            <span>Previous project</span>
            <strong>Gthrz</strong>
          </Link>
          <Link href="/version-b#work" className="vb-text-link">
            Back to selected work
          </Link>
        </div>
      </Reveal>
    </VersionBCase>
  );
}
