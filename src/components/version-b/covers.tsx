import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { gthrzShots } from "@/lib/gthrz";
import { projects, type Project } from "@/lib/projects";
import { SeetChat } from "./artifacts";
import { CallDemo } from "./call-demo";
import { DeviceFrame } from "./device-frame";
import { Reveal } from "./reveal";
import { WorkLine } from "./workline";

export function fieldVars(project: Project) {
  return {
    "--field": project.field,
    "--field-ink": project.fieldInk,
    "--field-muted": project.fieldMuted,
    "--accent": project.accent,
  } as CSSProperties;
}

export function projectHref(project: Project) {
  return project.href ?? `/projects/${project.id}`;
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <ul className="vb-cover-links">
      {project.links.map((link) =>
        link.href.startsWith("/") ? (
          <li key={link.href}>
            <Link href={link.href} className="vb-link">
              {link.label}
            </Link>
          </li>
        ) : (
          <li key={link.href}>
            <a href={link.href} className="vb-link" target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ),
      )}
      {project.linkNote ? <li className="vb-cover-linknote">{project.linkNote}</li> : null}
    </ul>
  );
}

function Cover({ project }: { project: Project }) {
  const href = projectHref(project);
  return (
    <article
      className="vb-cover"
      style={fieldVars(project)}
      data-light={project.light ? "true" : undefined}
      data-id={project.id}
    >
      <div className="vb-cover-inner">
        <div className="vb-cover-copy">
          <Reveal>
            <h3 className="vb-cover-name">
              <Link href={href} prefetch={false}>
                {project.name}
                {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
              </Link>
            </h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="vb-cover-tagline">{project.tagline}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <dl className="vb-cover-facts">
              <div>
                <dt>When</dt>
                <dd>{project.dates}</dd>
              </div>
              <div className="vb-cover-fact-wide">
                <dt>My part</dt>
                <dd>{project.contribution}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>{project.stack.slice(0, 4).join(", ")}</dd>
              </div>
            </dl>
            <div className="vb-cover-actions">
              <div className="vb-cover-cta">
                <Link href={href} prefetch={false} className="vb-btn vb-btn-field">
                  Read the case study
                </Link>
                <span className="vb-chip">{project.statusChip}</span>
              </div>
              <ProjectLinks project={project} />
            </div>
          </Reveal>
        </div>

        <div className="vb-cover-art">
          {project.id === "naqah" ? (
            <CallDemo compact id="naqah-demo" />
          ) : project.id === "seet" ? (
            <SeetChat compact />
          ) : project.id === "tammeni" ? (
            <div className="vb-cover-phones vb-cover-phones-2" aria-hidden="true">
              {project.screens
                .filter((shot) => shot.frame === "phone")
                .slice(0, 2)
                .map((shot) => (
                  <div key={shot.src} className="vb-phone vb-phone-sm" data-ui="">
                    <span className="vb-phone-notch" />
                    <Image
                      src={shot.src}
                      alt=""
                      width={shot.width}
                      height={shot.height}
                      sizes="(max-width: 900px) 44vw, 260px"
                      className="vb-phone-img"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <>
              <DeviceFrame
                shot={project.cover}
                sizes="(max-width: 900px) 100vw, 58vw"
                className="vb-cover-window"
                label={project.links[0]?.href.replace("https://", "")}
              />
              {project.coverPhone ? (
                <DeviceFrame
                  shot={project.coverPhone}
                  sizes="(max-width: 900px) 34vw, 180px"
                  className="vb-cover-phone"
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/** The rest of the work: one row each, with a still of the product. */
function IndexRow({ project }: { project: Project }) {
  const href = projectHref(project);
  const gthrz = project.id === "gthrz";
  return (
    <li className="vb-index-row" style={fieldVars(project)}>
      <Link href={href} prefetch={false} className="vb-index-still" aria-hidden="true" tabIndex={-1}>
        {gthrz ? (
          <span className="vb-index-phones">
            {[gthrzShots.home, gthrzShots.details].map((shot) => (
              <Image
                key={shot.src}
                src={shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                sizes="120px"
              />
            ))}
          </span>
        ) : (
          <Image
            src={project.cover.src}
            alt=""
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 900px) 100vw, 360px"
            className="vb-index-img"
          />
        )}
      </Link>
      <div className="vb-index-copy">
        <h3 className="vb-index-name">
          <Link href={href} prefetch={false}>
            {project.name}
            {project.arabic ? <span lang="ar">{project.arabic}</span> : null}
          </Link>
        </h3>
        <p className="vb-index-tagline">{project.tagline}</p>
        <p className="vb-index-meta">
          <span className="vb-chip">{project.statusChip}</span> {project.dates}.{" "}
          {project.contribution}
        </p>
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}

export function VersionBCovers() {
  const flagship = projects.filter((project) => project.flagship);
  const [first, ...otherFlagships] = flagship;
  const rest = projects.filter((project) => !project.flagship);
  return (
    <section id="work" className="vb-work" aria-labelledby="work-title">
      <div className="vb-work-head">
        <Reveal>
          <h2 id="work-title" className="vb-section-head">
            Three products to start with.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="vb-lead vb-work-lead">
            A ranch, a school and an ads inbox, each run by a voice or a chat
            that keeps to the facts.{" "}
            <Link href="#all-projects" className="vb-link vb-work-all">
              All seven projects on one line
            </Link>
          </p>
        </Reveal>
      </div>
      <Cover project={first} />
      <WorkLine />
      {otherFlagships.map((project) => (
        <Cover key={project.id} project={project} />
      ))}

      <div className="vb-index" id="more-work">
        <Reveal>
          <h2 className="vb-section-head vb-index-head">And four more.</h2>
        </Reveal>
        <ol className="vb-index-list">
          {rest.map((project) => (
            <IndexRow key={project.id} project={project} />
          ))}
        </ol>
      </div>
    </section>
  );
}
