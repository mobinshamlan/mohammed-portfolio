import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { AmanahClaimDemo } from "../demos/amanah-claim";
import { Reveal } from "../reveal";

export function AmanahWorld({ project }: { project: Project }) {
  const titleId = `proj-${project.id}`;
  const evidence = project.proof.evidence ?? [];
  const shot = project.cover;

  return (
    <section id={project.id} className="pw-amanah" aria-labelledby={titleId}>
      <div className="pw-inner pw-amanah-top">
        <header className="pw-head">
          <p className="pw-kind">{project.kind} · {project.dates}</p>
          <h3 id={titleId} className="pw-name">
            <span>{project.name}</span>{" "}
            {project.arabic ? <span lang="ar" dir="rtl">{project.arabic}</span> : null}
          </h3>
          <p className="pw-pitch">{project.tagline}</p>
        </header>
        <Reveal className="pw-amanah-tag-wrap">
          <div className="pw-amanah-tag">
            <p lang="ar" dir="rtl">{project.arabicTagline}</p>
            <p className="pw-amanah-tag-details"><span>Simulated</span> · Item: Umbrella</p>
            <ul className="pw-amanah-tag-details">
              <li>Found items stay private</li>
              <li>Gemini suggests a match</li>
              <li>Staff approve hand-over</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="pw-amanah-counter">
        <div className="pw-inner pw-amanah-desk">
          <AmanahClaimDemo compact />
          <div className="pw-amanah-screen">
            <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
          </div>
        </div>
      </div>

      <footer className="pw-amanah-cabinet">
        <div className="pw-inner pw-foot">
          <p className="pw-status">{project.statusChip}</p>
          {evidence.length > 0 ? (
            <details className="pw-evidence">
              <summary>
                {evidence.map((item) => (
                  <span key={item.kind}><strong>{item.value}</strong> {item.kind}</span>
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
                    {item.kind === "tests" && !item.run ? <p>Counted locally from a fresh clone.</p> : null}
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
        </div>
      </footer>
    </section>
  );
}
