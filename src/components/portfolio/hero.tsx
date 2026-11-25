import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/contact";
import { graduation } from "@/lib/portrait";
import { projects } from "@/lib/projects";
import { SaduBand } from "./sadu";

/** Each live project's passing tests: a passing CI run where one exists, else the tests themselves. */
const testSources = projects.flatMap((project) => {
  const tests = project.proof.evidence?.find((item) => item.kind === "tests");
  if (!tests) return [];
  return [{ id: project.id, name: project.name, href: tests.run?.href ?? tests.source.href }];
});

const naqahOutcome = projects.find((project) => project.id === "naqah")?.proof.outcome;

/*
 * The opening is about the maker: who he is, what he is doing now, and where
 * to go next. The portrait stands on his own woven band, which carries on
 * into the work.
 */
export function Hero() {
  return (
    <section id="home" className="vb-hero" aria-labelledby="hero-title">
      <div className="vb-hero-inner">
        <h1 id="hero-title" className="vb-hero-title" data-rise="1">
          <span className="vb-hero-name">Mohammed Bin&nbsp;Shamlan</span>
          <span className="vb-hero-arabic" lang="ar">
            محمد بن شملان
          </span>
        </h1>

        <figure className="vb-hero-portrait" data-rise="2">
          <SaduBand variant="maker" size="s" orient="down" className="vb-hero-selvedge" />
          <Image
            src={graduation.src}
            alt={graduation.alt}
            width={graduation.width}
            height={graduation.height}
            sizes="(max-width: 899px) 36vw, 34vw"
            priority
          />
        </figure>

        <div className="vb-hero-copy">
          <p className="vb-hero-role" data-rise="2">
            Software developer in Saudi Arabia, building Arabic-first AI products.
          </p>

          <dl className="vb-hero-now" data-rise="3">
            <div>
              <dt>Now</dt>
              <dd>AI Fundamentals Bootcamp at Tuwaiq Academy</dd>
            </div>
            <div>
              <dt>2026</dt>
              <dd>BSc (Hons) Computer Science, Queen Mary University of London</dd>
            </div>
          </dl>

          <p className="vb-hero-status" data-rise="3">
            <span className="vb-hero-dot" aria-hidden="true" />
            {contact.status}
          </p>

          {naqahOutcome ? (
            <p className="vb-hero-outcome" data-rise="4">
              {naqahOutcome.text}{" "}
              <a href={naqahOutcome.source.href} className="vb-hero-proof-link" target="_blank" rel="noreferrer">
                {naqahOutcome.source.label}
              </a>
              , {naqahOutcome.date}.
            </p>
          ) : null}

          <div className="vb-hero-actions" data-rise="4">
            <Link href="#work" className="vb-btn">
              See my work
            </Link>
            <Link href="#contact" className="vb-btn vb-btn-quiet">
              Contact
            </Link>
          </div>

          {/* One compact, sourced line; the counts and check dates live on each case page. */}
          <p className="vb-hero-proof" data-rise="5">
            Lead contributor on Naqah ·{" "}
            <a
              href="https://github.com/justAbdulaziz10/Naqah/commits/main"
              className="vb-hero-proof-link"
              target="_blank"
              rel="noreferrer"
            >
              128 of 209 commits
            </a>{" "}
            · tests passing in {testSources.length} public repos:{" "}
            {testSources.map((item, index) => (
              <span key={item.id}>
                {index > 0 ? ", " : null}
                <a href={item.href} className="vb-hero-proof-link" target="_blank" rel="noreferrer">
                  {item.name}
                  <span className="vb-sr"> tests</span>
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
      <SaduBand variant="maker" className="vb-hero-band" />
    </section>
  );
}
