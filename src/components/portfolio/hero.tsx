"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact } from "@/lib/contact";
import { callScript } from "@/lib/naqah-call";
import { EVIDENCE_CHECKED, projects } from "@/lib/projects";
import { publicUrl } from "@/lib/site";
import { tonightInRiyadh, type Tonight } from "@/lib/riyadh";
import { DayLine } from "./dayline";

const sky = {
  src: publicUrl("/images/projects/credits/alula-night-sky.jpg"),
  src640: publicUrl("/images/projects/credits/alula-night-sky-640.jpg"),
  src1000: publicUrl("/images/projects/credits/alula-night-sky-1000.jpg"),
  alt: "The Milky Way seen through a gap between two sandstone cliffs at night in AlUla, Saudi Arabia.",
  width: 1067,
  height: 1600,
};

/** The moon drawn from its real phase: a dark disc and the lit part. */
function Moon({ phase, illumination }: { phase: number; illumination: number }) {
  const waxing = phase < 0.5;
  const r = 16;
  const k = Math.cos(phase * 2 * Math.PI);
  const tx = Math.abs(k) * r;
  const outer = `M 18 2 A ${r} ${r} 0 0 1 18 34`;
  const inner = k >= 0 ? `A ${tx} ${r} 0 0 0 18 2` : `A ${tx} ${r} 0 0 1 18 2`;
  return (
    <svg
      className="vb-moon"
      viewBox="0 0 36 36"
      width="36"
      height="36"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="18" r={r} className="vb-moon-dark" />
      <path
        d={`${outer} ${inner} Z`}
        className="vb-moon-lit"
        style={{ opacity: Math.max(0.15, illumination) }}
        transform={waxing ? undefined : "scale(-1,1) translate(-36,0)"}
      />
    </svg>
  );
}

/** Tonight in Riyadh, Kashta's forecast city: time, sun and moon computed in the browser. */
function TonightStrip() {
  const [tonight, setTonight] = useState<Tonight | null>(null);

  useEffect(() => {
    const tick = () => setTonight(tonightInRiyadh());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const percent = tonight ? Math.round(tonight.moon.illumination * 100) : null;
  const moments = tonight
    ? [
        { time: tonight.sunset, label: "Sun sets" },
        { time: tonight.time, label: tonight.night ? "Now, night" : "Now, day" },
        { time: tonight.sunrise, label: "Sun rises" },
      ]
    : [
        { time: "--:--", label: "Sun sets" },
        { time: "--:--", label: "Now" },
        { time: "--:--", label: "Sun rises" },
      ];

  return (
    <div className="vb-tonight" aria-live="polite">
      <div className="vb-tonight-moon">
        {tonight ? (
          <Moon phase={tonight.moon.phase} illumination={tonight.moon.illumination} />
        ) : (
          <span className="vb-moon" aria-hidden="true" />
        )}
        <p>
          <strong>Tonight in Riyadh</strong>
          <span>
            {tonight ? `${tonight.moon.name}, ${percent}% lit.` : "Reading the sky."}{" "}
            Computed here from the date, for Kashta&rsquo;s forecast city.{" "}
            <Link href="/projects/kashta#how-title" prefetch={false} className="vb-tonight-link">
              How Kashta scores a night
            </Link>
          </span>
        </p>
      </div>
      <DayLine moments={moments} active={1} label="Riyadh tonight" />
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
          <span className="vb-hero-step-dot" aria-hidden="true" />
          <span className="vb-hero-step-who">The worker answers, 5:40 pm</span>
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
          <span className="vb-hero-step-dot" aria-hidden="true" />
          <span className="vb-hero-step-who">Saved as a record, audio discarded</span>
          {fact && fact.kind === "fact" ? (
            <span className="vb-hero-step-fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </span>
          ) : null}
        </li>
        <li className="vb-hero-step">
          <span className="vb-hero-step-dot" aria-hidden="true" />
          <span className="vb-hero-step-who">The owner is alerted, 7:00 pm</span>
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
        <h1 id="hero-title" className="vb-hero-title" data-rise="1">
          Mohammed Bin&nbsp;Shamlan
        </h1>
        <p className="vb-hero-role" data-rise="2">
          Software developer in Saudi Arabia. I build Arabic-first AI products
          for real Saudi life.
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

      <div className="vb-hero-strip" data-rise="6">
        <TonightStrip />
        <figure className="vb-hero-sky">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sky.src640}
            srcSet={`${sky.src640} 640w, ${sky.src1000} 1000w`}
            sizes="(max-width: 899px) 100vw, 30vw"
            alt={sky.alt}
            width={sky.width}
            height={sky.height}
            loading="lazy"
            decoding="async"
            className="vb-hero-sky-img"
          />
          <figcaption className="vb-hero-sky-cap">
            The sky over AlUla. Photo: Saudi Press Agency.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
