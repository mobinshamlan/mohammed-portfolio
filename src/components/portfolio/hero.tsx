import Image from "next/image";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { publicUrl } from "@/lib/site";
import { JumpLink } from "./jump-link";

/** The graduation portrait lifted off its studio backdrop, sized for the opening. */
const cutout = {
  src: publicUrl("/images/graduation/hero-cutout-sm.webp"),
  width: 384,
  height: 700,
} as const;

export function Hero() {
  return (
    <section id="home" className="vb-open" aria-labelledby="hero-title">
      <h1 id="hero-title" className="vb-open-name" data-rise="1">
        <span>Mohammed</span> <span>Bin&nbsp;Shamlan</span>
      </h1>

      <p className="vb-open-role" data-rise="2">
        Software &amp; AI product developer
        <span className="vb-open-status">{contact.status}</span>
      </p>

      <div className="vb-open-actions" data-rise="3">
        <JumpLink to="work" className="vb-btn vb-open-go">
          See my work
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
            <path d="M10 4v12m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </JumpLink>
      </div>

      <figure className="vb-open-figure" data-rise="2">
        <span className="vb-open-light" aria-hidden="true" />
        <Image
          src={cutout.src}
          alt={graduation.alt}
          width={cutout.width}
          height={cutout.height}
          sizes="(max-width: 899px) 7.5rem, 12rem"
          preload
          className="vb-open-img"
        />
        <svg
          className="vb-open-thread"
          viewBox="0 0 120 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M 41 0 C 42 3 56 3 60 7 C 64 10 59 12 60 15 L 60 100" />
        </svg>
      </figure>
    </section>
  );
}
