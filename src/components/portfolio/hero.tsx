import Image from "next/image";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { JumpLink } from "./jump-link";

/**
 * The opening is about the person: the name, one line on what he builds, the
 * way into the work, and the portrait melting into the night behind it.
 */
export function Hero() {
  return (
    <section id="home" className="vb-open" aria-labelledby="hero-title">
      <div className="vb-open-copy">
        <h1 id="hero-title" className="vb-open-name" data-rise="1">
          <span>Mohammed</span> <span>Bin&nbsp;Shamlan</span>
        </h1>

        <p className="vb-open-lead" data-rise="2">
          I build Arabic-first AI products for everyday Saudi life.
        </p>

        <p className="vb-open-meta" data-rise="2">
          Software developer in Riyadh · Computer Science, Queen Mary University of London, 2026
        </p>

        <div className="vb-open-actions" data-rise="3">
          <JumpLink to="work" className="vb-btn">
            See my work
          </JumpLink>
          <a href={`mailto:${contact.email}`} className="vb-link">
            Email me
          </a>
        </div>

        <p className="vb-open-status" data-rise="3">
          <span className="vb-hero-dot" aria-hidden="true" />
          {contact.status}
        </p>
      </div>

      <figure className="vb-open-portrait" data-rise="2">
        <span className="vb-open-glow" aria-hidden="true" />
        <Image
          src={graduation.src}
          alt={graduation.alt}
          width={graduation.width}
          height={graduation.height}
          sizes="(max-width: 899px) 90vw, 40vw"
          priority
          className="vb-open-img"
        />
      </figure>
    </section>
  );
}
