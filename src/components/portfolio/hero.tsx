"use client";

import Link from "next/link";
import { contact } from "@/lib/contact";
import { callScript } from "@/lib/naqah-call";
import { EVIDENCE_CHECKED, projects } from "@/lib/projects";
import { Horizon, Moon, NightMark } from "./sky";

/** The horizon at sunset: tonight's moon in the sky, the sun going down behind the far dune. */
function HeroSky() {
  return (
    <div className="vb-hero-horizon" aria-hidden="true">
      <Moon className="vb-moon vb-hero-moon" size={96} />
      <span className="vb-hero-sun" />
      <Horizon />
    </div>
  );
}

/**
 * The opening's visual: one Naqah call turning into facts and an owner alert.
 * Quote → the fact it supports → the alert, on the line of moments. Simulated sample.
 */
function HeroArtifact() {
  const worker = callScript.find((l) => l.kind === "worker");
  const fact = callScript.find((l) => l.kind === "fact" && l.flag);
  return (
    <div className="vb-hero-art" data-ui="">
      <p className="vb-hero-art-label">One answer on a Naqah call. Simulated sample.</p>
      <ol className="vb-hero-steps">
        <li className="vb-hero-step">
          <span className="vb-hero-step-time">5:40 pm</span>
          <span className="vb-hero-step-who">The worker answers</span>
          {worker && worker.kind === "worker" ? (
            <>
              <span className="vb-hero-step-ar" lang="ar">
                {worker.ar}
              </span>
              <span className="vb-hero-step-en vb-hero-step-gloss">{worker.en}</span>
            </>
          ) : null}
        </li>
        <li className="vb-hero-step">
          <span className="vb-hero-step-time">5:44 pm</span>
          <span className="vb-hero-step-who">Saved as a record, audio discarded</span>
          {fact && fact.kind === "fact" ? (
            <span className="vb-hero-step-fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </span>
          ) : null}
        </li>
        <li className="vb-hero-step" data-alert="true">
          <span className="vb-hero-step-time">7:00 pm</span>
          <span className="vb-hero-step-who">The owner is alerted</span>
          <span className="vb-hero-step-en vb-hero-step-owner">
            Wadha has not drunk since morning.
          </span>
        </li>
      </ol>
      <Link href="#naqah-demo" className="vb-link vb-hero-art-link">
        Play the full call, 15 s
      </Link>
    </div>
  );
}

/** Each live project's passing test count: linked to a passing CI run where one exists, else to the tests. */
const testCounts = projects.flatMap((project) => {
  const tests = project.proof.evidence?.find((item) => item.kind === "tests");
  if (!tests) return [];
  return [
    {
      id: project.id,
      name: project.name,
      value: tests.value,
      href: tests.run?.href ?? tests.source.href,
      how: tests.run ? `CI ${tests.run.date.replace(/ \d{4}$/, "")}` : "local",
    },
  ];
});

const naqahOutcome = projects.find((project) => project.id === "naqah")?.proof.outcome;

/** The checked numbers beside the opening's visual, each linked to where it can be checked. */
function HeroEvidence() {
  return (
    <div className="vb-hero-evidence">
      <p className="vb-hero-evidence-head">
        Tests passing in the public repos. CI links a passing GitHub run; local was counted on a
        fresh clone, {EVIDENCE_CHECKED}.
      </p>
      <ul className="vb-hero-evidence-list">
        {testCounts.map((item) => (
          <li key={item.id}>
            <a href={item.href} className="vb-hero-evidence-link" target="_blank" rel="noreferrer">
              <b>{item.name}</b> <strong>{item.value}</strong> <span>{item.how}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="vb-hero" aria-labelledby="hero-title">
      <div className="vb-hero-copy">
        <NightMark part="sunset" className="vb-hero-hour" />
        <h1 id="hero-title" className="vb-hero-title" data-rise="1">
          <span className="vb-hero-name">Mohammed Bin&nbsp;Shamlan</span> builds Arabic-first AI for
          real Saudi life.
        </h1>
        <p className="vb-hero-role" data-rise="2">
          Software developer in Saudi Arabia.
          <span lang="ar">أبني منتجات ذكاء اصطناعي، بالعربي أولاً، لحياة سعودية حقيقية</span>
        </p>
        {naqahOutcome ? (
          <p className="vb-hero-outcome" data-rise="3">
            {naqahOutcome.text}{" "}
            <a href={naqahOutcome.source.href} className="vb-hero-proof-link" target="_blank" rel="noreferrer">
              {naqahOutcome.source.label}
            </a>
            , {naqahOutcome.date}.
          </p>
        ) : null}
        <p className="vb-hero-proof" data-rise="3">
          Lead contributor on Naqah, an investor MVP:{" "}
          <a
            href="https://github.com/justAbdulaziz10/Naqah/commits/main"
            className="vb-hero-proof-link"
            target="_blank"
            rel="noreferrer"
          >
            128 of its 209 commits
          </a>
          , 5&ndash;13 November 2026.
        </p>
        <div className="vb-hero-actions" data-rise="4">
          <Link href="#work" className="vb-btn">
            View work
          </Link>
          <Link href="#contact" className="vb-link vb-hero-secondary">
            Get in touch
          </Link>
        </div>
        <p className="vb-hero-status" data-rise="5">
          <span className="vb-hero-dot" aria-hidden="true" />
          {contact.status}
        </p>
      </div>

      <div className="vb-hero-visual" data-rise="3">
        <HeroArtifact />
        <HeroEvidence />
      </div>

      <HeroSky />
    </section>
  );
}
