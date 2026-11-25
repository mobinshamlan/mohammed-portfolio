import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { fieldStyle, projects } from "@/lib/projects";

const naqahOutcome = projects.find((project) => project.id === "naqah")?.proof.outcome;

/** Two words each: what the product is about, for the shelf of tabs. */
const subjects: Record<string, string> = {
  naqah: "ranch calls",
  tammeni: "school news",
  seet: "ad bookings",
  kashta: "desert nights",
  amanah: "lost and found",
  gthrz: "private parties",
};

const shelf = projects.filter((project) => project.id in subjects);

/*
 * The opening is about him: his name in both scripts, what he does, what he
 * is doing now, and the graduation photograph. The shelf at the foot is the
 * first look at the work: one tab in each product's own colours.
 */
export function Hero() {
  return (
    <section id="home" className="vb-hero" aria-labelledby="hero-title">
      <div className="vb-hero-inner">
        <figure className="vb-hero-portrait" data-rise="1">
          <Image
            src={graduation.src}
            alt={graduation.alt}
            width={graduation.width}
            height={graduation.height}
            sizes="(max-width: 899px) 100vw, 40vw"
            priority
          />
          <figcaption>Graduation, Queen Mary University of London, 2026</figcaption>
        </figure>

        <div className="vb-hero-copy">
          <h1 id="hero-title" className="vb-hero-title" data-rise="1">
            <span className="vb-hero-name">Mohammed Bin&nbsp;Shamlan</span>
            <span className="vb-hero-arabic" lang="ar">
              محمد بن شملان
            </span>
          </h1>

          <p className="vb-hero-role" data-rise="2">
            Software developer in Saudi Arabia building Arabic-first AI products.
          </p>

          <p className="vb-hero-status" data-rise="2">
            <span className="vb-hero-dot" aria-hidden="true" />
            {contact.status}
          </p>

          {naqahOutcome ? (
            <p className="vb-hero-outcome" data-rise="3">
              {naqahOutcome.text}{" "}
              <a href={naqahOutcome.source.href} target="_blank" rel="noreferrer">
                {naqahOutcome.source.label}
              </a>
              , {naqahOutcome.date}.
            </p>
          ) : null}

          <div className="vb-hero-actions" data-rise="3">
            <Link href="#work" className="vb-btn">
              See my work
            </Link>
            <Link href="#contact" className="vb-hero-contact">
              Contact
            </Link>
          </div>

          <dl className="vb-hero-now" data-rise="4">
            <div>
              <dt>Now</dt>
              <dd>AI Fundamentals Bootcamp at Tuwaiq Academy</dd>
            </div>
            <div>
              <dt>Graduated</dt>
              <dd>BSc (Hons) Computer Science, Queen Mary University of London, 2026</dd>
            </div>
          </dl>
        </div>

        <nav className="vb-shelf" aria-label="The six products" data-rise="5">
          <p className="vb-shelf-title" id="shelf-title">
            Six products, each in its own world
          </p>
          <ul aria-labelledby="shelf-title">
            {shelf.map((project) => (
              <li key={project.id} data-id={project.id} style={fieldStyle(project)}>
                <a href={`#${project.id}`}>
                  <span className="vb-shelf-name">{project.name}</span>
                  <span className="vb-shelf-subject">{subjects[project.id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
