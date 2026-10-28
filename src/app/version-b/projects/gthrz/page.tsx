import type { Metadata } from "next";
import Link from "next/link";
import { VersionBCase } from "@/components/version-b/case-shell";
import { GthrzPlanner } from "@/components/version-b/gthrz-planner";
import { GthrzPrivacy } from "@/components/version-b/gthrz-privacy";
import { GthrzStory } from "@/components/version-b/gthrz-story";
import { PhoneShot } from "@/components/version-b/phone-shot";
import { Reveal } from "@/components/version-b/reveal";
import { gthrzRepo, gthrzShots } from "@/lib/gthrz";

export const metadata: Metadata = {
  title: "Gthrz — Mohammed Bin Shamlan",
  description:
    "Case study for Gthrz, a privacy-first mobile event planning application.",
};

const tech = ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"];

const features = [
  "Event creation and management",
  "RSVP approval",
  "Event capacity",
  "Privacy controls for guest names and photos",
  "Delayed location reveal",
  "Guest management, including shared lists",
];

export default function GthrzCaseStudyPage() {
  return (
    <VersionBCase bleed>
      <GthrzStory />
      <GthrzPrivacy />

      <section className="vb-gg" aria-labelledby="gg-title">
        <div className="vb-gg-phones">
          <PhoneShot
            className="vb-gg-lead-shot"
            src={gthrzShots.detailsMore.src}
            alt={gthrzShots.detailsMore.alt}
            caption="Lineup and guest claims"
            width={gthrzShots.detailsMore.width}
            height={gthrzShots.detailsMore.height}
            sizes="(max-width: 900px) 52vw, 300px"
          />
          <PhoneShot
            className="vb-gg-second-shot"
            src={gthrzShots.profile.src}
            alt={gthrzShots.profile.alt}
            caption="Saved and created events"
            width={gthrzShots.profile.width}
            height={gthrzShots.profile.height}
            sizes="(max-width: 900px) 40vw, 230px"
          />
        </div>
        <Reveal className="vb-gg-copy">
          <h2 id="gg-title" className="vb-gg-title">
            What it does
          </h2>
          <ul className="vb-gg-list">
            {features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="vb-gg-note">
            The screens also include Discover, join-with-code, and the Smart
            Planner.
          </p>
        </Reveal>
      </section>

      <GthrzPlanner />

      <section className="vb-gx" aria-labelledby="gx-title">
        <Reveal className="vb-gx-stack">
          <h2 id="gx-title" className="vb-gx-title">
            Built with
          </h2>
          <p className="vb-gx-body">
            The client is React Native with Expo and TypeScript. Data is stored
            with Supabase and PostgreSQL.
          </p>
          <ul className="vb-gx-tech">
            {tech.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a
            href={gthrzRepo}
            className="vb-gx-repo"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </Reveal>
        <Reveal className="vb-gx-next" delay={0.08}>
          <Link href="/version-b/projects/amanah" className="vb-gx-link">
            <span className="vb-gx-hint">Next project</span>
            <span className="vb-gx-name">Amanah</span>
            <span className="vb-gx-status">In development</span>
          </Link>
          <Link href="/version-b#work" className="vb-gx-back">
            Back to selected work
          </Link>
        </Reveal>
      </section>
    </VersionBCase>
  );
}
