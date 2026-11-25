import Link from "next/link";
import type { Project } from "@/lib/projects";
import { KashtaScoreDemo } from "../demos/kashta-score";
import { Reveal } from "../reveal";

const starPositions = [
  [62, 129], [130, 70], [202, 180], [281, 97],
  [364, 52], [443, 179], [522, 92], [587, 153],
  [32, 224], [160, 275], [246, 58], [326, 233],
  [395, 128], [478, 263], [556, 209], [605, 63],
];

export function KashtaWorld({ project }: { project: Project }) {
  const titleId = `proj-${project.id}`;
  const evidence = project.proof.evidence ?? [];

  return (
    <section id={project.id} className="pw-kashta" aria-labelledby={titleId}>
      <div className="pw-kashta-sky" aria-hidden="true">
        {[false, true].map((extra) => (
          <svg key={String(extra)} viewBox="0 0 640 300" preserveAspectRatio="none">
            {starPositions.slice(extra ? 8 : 0, extra ? 16 : 8).map(([x, y], index) => (
              <circle key={x} cx={x} cy={y} r={index % 4 === 1 ? 1 : 0.55} />
            ))}
          </svg>
        ))}
      </div>
      <div className="pw-inner pw-kashta-layout">
        <header className="pw-head">
          <p className="pw-kind">{project.kind} · {project.dates}</p>
          <h3 id={titleId} className="pw-name">
            {project.name}{" "}
            {project.arabic ? <span lang="ar" dir="rtl">{project.arabic}</span> : null}
          </h3>
          <p className="pw-pitch">{project.tagline}</p>
        </header>

        <Reveal className="pw-kashta-gauge">
          <KashtaScoreDemo compact />
        </Reveal>

        <footer className="pw-foot">
          <p className="pw-status">{project.statusChip}</p>
          {evidence.length > 0 ? (
            <details className="pw-evidence">
              <summary>
                {evidence.map((item) => (
                  <span key={item.kind}>
                    <strong>{item.value}</strong>{" "}
                    {item.kind === "scope" ? "camping sites" : item.kind}
                  </span>
                ))}
              </summary>
              <ul className="pw-evidence-list">
                {evidence.map((item) => (
                  <li key={item.kind}>
                    <p><strong>{item.value}</strong> {item.label}</p>
                    <p>
                      <a href={item.source.href}>{item.source.label}</a>
                      {" · Checked "}{item.checked}
                    </p>
                    {item.run ? <a href={item.run.href}>Passing CI run · {item.run.date}</a> : null}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <p className="pw-contribution">{project.contribution}</p>
          <ul className="pw-links">
            {project.links.map(({ href, label }) => (
              <li key={href}><Link href={href} prefetch={false}>{label}</Link></li>
            ))}
            <li><Link href={project.href ?? `/projects/${project.id}`} prefetch={false}>Read the case study</Link></li>
          </ul>
          {project.linkNote ? <p>{project.linkNote}</p> : null}
        </footer>
      </div>
    </section>
  );
}
