"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { portfolio } from "../../../data/portfolio";
import { contact } from "@/lib/contact";
import { portrait } from "@/lib/portrait";
import { publicUrl } from "@/lib/site";
import { AmanahArt } from "./amanah-art";
import { Reveal } from "./reveal";
import { GthrzCluster, WorkPosters, projects, type ProjectId } from "./work";

const ease = [0.16, 1, 0.3, 1] as const;

type Active = "portrait" | ProjectId;

const nameLines = [
  { text: "Mohammed", className: "" },
  { text: "Bin", className: "vb-cv-bin" },
  { text: "Shamlan", className: "" },
] as const;

const studied = portfolio.education[0];
const current = portfolio.education[1];

function NameLines({ instant }: { instant: boolean }) {
  return (
    <>
      {nameLines.map((line, index) => (
        <motion.span
          key={line.text}
          className={line.className}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: 0.9, delay: 0.15 + index * 0.1, ease }
          }
        >
          {line.text}
        </motion.span>
      ))}
    </>
  );
}

export function VersionBCover() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Active>("portrait");
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const items = useRef<Record<ProjectId, HTMLAnchorElement | null>>({
    gthrz: null,
    amanah: null,
  });
  const frame = useRef(0);

  // On wide screens the frame follows the scroll: portrait, then each project.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 960px)");
    if (!wide.matches || !hero.current) {
      return;
    }

    const targets = new Map<Element, Active>([[hero.current, "portrait"]]);
    (Object.keys(items.current) as ProjectId[]).forEach((id) => {
      const node = items.current[id];
      if (node) {
        targets.set(node, id);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const next = targets.get(entry.target);
          if (entry.isIntersecting && next) {
            setActive(next);
          }
        });
      },
      { rootMargin: "-28% 0px -52% 0px" },
    );
    targets.forEach((_, node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const node = root.current;
    if (!node || event.pointerType !== "mouse" || frame.current) {
      return;
    }
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const box = node.getBoundingClientRect();
      node.style.setProperty(
        "--mx",
        String(((clientX - box.left) / box.width) * 2 - 1),
      );
      node.style.setProperty(
        "--my",
        String(
          Math.max(-1, Math.min(1, (clientY / window.innerHeight) * 2 - 1)),
        ),
      );
    });
  }

  function release() {
    root.current?.style.setProperty("--mx", "0");
    root.current?.style.setProperty("--my", "0");
  }

  return (
    <div
      ref={root}
      className="vb-cv"
      onPointerMove={track}
      onPointerLeave={release}
    >
      <div className="vb-cv-left">
        <header id="home" ref={hero} className="vb-cv-hero">
          <p className="vb-kicker vb-cv-kicker">Portfolio / 2026</p>
          <h1 className="vb-cv-name" aria-label={portfolio.name}>
            <span className="vb-cv-name-ink" aria-hidden="true">
              <NameLines instant={!!reduceMotion} />
            </span>
            <span className="vb-cv-name-paper" aria-hidden="true">
              <NameLines instant={!!reduceMotion} />
            </span>
          </h1>

          <motion.div
            className="vb-cv-intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.5, ease }
            }
          >
            <p className="vb-cv-role">{portfolio.title}</p>
            <p className="vb-cv-open">{contact.status}</p>

            <nav className="vb-cv-path" aria-label="Start here">
              {contact.cv.href ? (
                <a
                  href={publicUrl(contact.cv.href)}
                  download
                  className="vb-cv-path-main"
                >
                  Download CV
                </a>
              ) : (
                <span
                  className="vb-cv-path-main vb-cv-path-off"
                  aria-disabled="true"
                >
                  Download CV
                  <span className="vb-cv-soon">Coming soon</span>
                </span>
              )}
              <Link href="#contact">Get in touch</Link>
              <a href={contact.github.href} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>

            <p className="vb-cv-lead">
              Computer Science graduate. Building thoughtful digital products
              through software, creativity, and emerging technologies.
            </p>

            <dl className="vb-cv-facts">
              <div>
                <dt>Studied</dt>
                <dd>
                  <Link href="#education">
                    {studied.qualification}, {studied.institution}
                  </Link>
                  <span>{studied.period}</span>
                </dd>
              </div>
              <div>
                <dt>Now</dt>
                <dd>
                  <Link href="#education">
                    {current.qualification}, {current.institution}
                  </Link>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{portfolio.location}</dd>
              </div>
            </dl>
          </motion.div>
        </header>

        <section id="work" className="vb-cv-work" aria-labelledby="work-title">
          <Reveal>
            <p className="vb-kicker">01 / Work</p>
            <h2 id="work-title" className="vb-section-title">
              Selected work.
            </h2>
          </Reveal>

          <ol className="vb-wk-index">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={project.href}
                  ref={(node) => {
                    items.current[project.id] = node;
                  }}
                  className="vb-wk-item"
                  data-active={active === project.id}
                  onMouseEnter={() => setActive(project.id)}
                  onFocus={() => setActive(project.id)}
                >
                  <span className="vb-wk-name">
                    {project.name}
                    <span className="vb-wk-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                  <span className="vb-wk-lead">{project.lead}</span>
                  <span className="vb-wk-meta">
                    {"status" in project ? (
                      <span className="vb-wk-status">{project.status}</span>
                    ) : null}
                    {project.tech.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <WorkPosters />
        </section>
      </div>

      <div className="vb-cv-right">
        <motion.div
          className="vb-cv-frame"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 1.1, delay: 0.1, ease }
          }
        >
          <div
            className="vb-wk-panel vb-cv-portrait"
            data-active={active === "portrait"}
          >
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(max-width: 960px) 100vw, 46vw"
              priority
              className="vb-cv-photo"
              data-duotone={portrait.duotone}
              style={{ objectPosition: portrait.position }}
            />
            <span className="vb-cv-bar" aria-hidden="true" />
          </div>

          <Link
            href={projects[0].href}
            tabIndex={-1}
            aria-hidden="true"
            className="vb-wk-panel vb-wk-panel-gthrz"
            data-active={active === "gthrz"}
          >
            <span className="vb-wk-glyph" aria-hidden="true">
              G
            </span>
            <GthrzCluster sizes="(max-width: 1100px) 22vw, 300px" />
            <span className="vb-wk-open">Open case study ↗</span>
          </Link>
          <Link
            href={projects[1].href}
            tabIndex={-1}
            aria-hidden="true"
            className="vb-wk-panel vb-wk-panel-amanah"
            data-active={active === "amanah"}
          >
            <AmanahArt />
            <span className="vb-wk-open">Open case study ↗</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
