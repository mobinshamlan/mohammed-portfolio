import Image from "next/image";
import type { CSSProperties } from "react";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { projects } from "@/lib/projects";
import { publicUrl } from "@/lib/site";
import { JumpLink } from "./jump-link";

/** The graduation portrait lifted off its studio backdrop, cropped to the figure. */
const cutout = {
  src: publicUrl("/images/graduation/hero-cutout.png"),
  width: 620,
  height: 1130,
} as const;

/**
 * The opening is about the person: the name set across the gown, one line on
 * what he builds, and the way into the work. The six marks on the button are
 * the six products below, each in its own field colour.
 */
export function Hero() {
  return (
    <section id="home" className="vb-open" aria-labelledby="hero-title">
      <h1 id="hero-title" className="vb-open-name" data-rise="1">
        <span>Mohammed</span> <span>Bin&nbsp;Shamlan</span>
      </h1>

      <div className="vb-open-say" data-rise="2">
        <p className="vb-open-lead">I build Arabic-first AI products for everyday Saudi life.</p>
        <p className="vb-open-meta">
          Software developer in Riyadh · Computer Science, Queen Mary University of London, 2026
        </p>
      </div>

      <div className="vb-open-actions" data-rise="3">
        <JumpLink to="work" className="vb-btn vb-open-go">
          See my work
          <span className="vb-open-six" aria-hidden="true">
            {projects.map((project) => (
              <span key={project.id} style={{ "--six": project.field } as CSSProperties} />
            ))}
          </span>
        </JumpLink>
        <a href={`mailto:${contact.email}`} className="vb-link">
          Email me
        </a>
      </div>

      <p className="vb-open-status" data-rise="3">
        <span className="vb-hero-dot" aria-hidden="true" />
        {contact.status}
      </p>

      <figure className="vb-open-portrait" data-rise="2">
        <span className="vb-open-glow" aria-hidden="true" />
        <Image
          src={cutout.src}
          alt={graduation.alt}
          width={cutout.width}
          height={cutout.height}
          sizes="(max-width: 899px) 70vw, 34rem"
          priority
          className="vb-open-img"
        />
      </figure>
    </section>
  );
}
