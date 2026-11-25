import Image from "next/image";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { JumpLink } from "./jump-link";
import { fieldStyle, projects } from "@/lib/projects";

/** The six products, in the order the Work chapter shows them. */
const work = projects.filter((project) => project.id !== "experiment");

/**
 * The opening is about the person: the name in both scripts on one shared
 * rule, a portrait, one sentence on what he builds, and the way into the work.
 */
export function Hero() {
  return (
    <section id="home" className="vb-open" aria-labelledby="hero-title">
      <div className="vb-open-copy">
        <h1 id="hero-title" className="vb-open-name" data-rise="1">
          <span className="vb-open-en">
            <span>Mohammed</span> <span>Bin&nbsp;Shamlan</span>
          </span>
          <span className="vb-open-ar" lang="ar" dir="rtl">
            محمد بن شملان
          </span>
        </h1>

        <p className="vb-open-lead" data-rise="2">
          Software developer in Riyadh. I build Arabic-first AI for everyday Saudi life: a ranch
          that phones its owner, school news by call, a planner for a night in the desert.
        </p>

        <div className="vb-open-actions" data-rise="3">
          <JumpLink to="work" className="vb-btn">
            See the six products
          </JumpLink>
          <JumpLink to="about" className="vb-link">
            My story
          </JumpLink>
          <JumpLink to="contact" className="vb-link">
            Email me
          </JumpLink>
        </div>

        <p className="vb-open-status" data-rise="3">
          <span className="vb-hero-dot" aria-hidden="true" />
          {contact.status}
        </p>
      </div>

      <figure className="vb-open-portrait" data-rise="2">
        <span className="vb-open-frame">
          <Image
            src={graduation.src}
            alt={graduation.alt}
            width={graduation.width}
            height={graduation.height}
            sizes="(max-width: 899px) 40vw, 30vw"
            priority
            className="vb-open-img"
          />
        </span>
        <figcaption>
          Graduation, Queen Mary University of London, July 2026.{" "}
          <span lang="ar">لندن ← الرياض</span>
        </figcaption>
      </figure>

      <nav className="vb-open-work" aria-label="The six products">
        <ol className="vb-open-work-list">
          {work.map((project) => (
            <li key={project.id} style={fieldStyle(project)}>
              <JumpLink to={project.id} className="vb-open-tile">
                <span className="vb-open-swatch" aria-hidden="true" />
                <span className="vb-open-tile-name">{project.name}</span>
                {project.arabic ? (
                  <span className="vb-open-tile-ar" lang="ar">
                    {project.arabic}
                  </span>
                ) : null}
              </JumpLink>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
