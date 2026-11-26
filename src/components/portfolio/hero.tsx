import Image from "next/image";
import type { CSSProperties } from "react";
import { graduation } from "@/lib/portrait";
import { projects } from "@/lib/projects";
import { publicUrl } from "@/lib/site";
import { JumpLink } from "./jump-link";

/** The graduation portrait lifted off its studio backdrop, sized for the opening. */
const cutout = {
  src: publicUrl("/images/graduation/hero-cutout-sm.webp"),
  width: 384,
  height: 700,
} as const;

/**
 * The opening says who and what, and nothing else. The small figure stands
 * in the night at the right; from the ribbon on his diploma one red thread
 * drops under the dune, the same thread that later sews the six products
 * together. The six marks on the button are those products, each in its
 * own field colour.
 */
export function Hero() {
  return (
    <section id="home" className="vb-open" aria-labelledby="hero-title">
      <h1 id="hero-title" className="vb-open-name" data-rise="1">
        <span>Mohammed</span> <span>Bin&nbsp;Shamlan</span>
      </h1>

      <p className="vb-open-role" data-rise="2">
        Software &amp; AI product developer
      </p>

      <div className="vb-open-actions" data-rise="3">
        <JumpLink to="work" className="vb-btn vb-open-go">
          See my work
          <span className="vb-open-six" aria-hidden="true">
            {projects.map((project) => (
              <span key={project.id} style={{ "--six": project.field } as CSSProperties} />
            ))}
          </span>
        </JumpLink>
      </div>

      <figure
        className="vb-open-figure"
        data-rise="2"
        style={{ "--cutout": `url(${cutout.src})` } as CSSProperties}
      >
        <span className="vb-open-light" aria-hidden="true" />
        <Image
          src={cutout.src}
          alt={graduation.alt}
          width={cutout.width}
          height={cutout.height}
          sizes="(max-width: 899px) 7.5rem, 12rem"
          priority
          className="vb-open-img"
        />
        <span className="vb-open-grain" aria-hidden="true" />
        <span className="vb-open-thread" aria-hidden="true" />
      </figure>
    </section>
  );
}
