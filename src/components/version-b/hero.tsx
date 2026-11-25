"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact } from "@/lib/contact";
import { callScript } from "@/lib/naqah-call";
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

/** A real artifact on the first screen: what one Naqah call turns into. Simulated sample. */
function HeroArtifact() {
  const worker = callScript.find((l) => l.kind === "worker");
  const facts = callScript.filter((l) => l.kind === "fact").slice(0, 3);
  return (
    <div className="vb-hero-art" data-ui="">
      <p className="vb-hero-art-label">
        From a Naqah call to the owner&rsquo;s summary. Simulated sample.
      </p>
      <div className="vb-hero-art-grid">
        <div className="vb-hero-art-worker">
          <span className="vb-hero-art-who">Worker, 5:40 pm</span>
          {worker && worker.kind === "worker" ? (
            <>
              <span lang="ar">{worker.ar}</span>
              <span className="vb-hero-art-en">{worker.en}</span>
            </>
          ) : null}
        </div>
        <ul className="vb-hero-art-facts" aria-label="Facts kept">
          {facts.map((fact, i) =>
            fact.kind === "fact" ? (
              <li key={i} data-flag={fact.flag ? "true" : undefined}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </li>
            ) : null,
          )}
        </ul>
      </div>
      <p className="vb-hero-art-owner">
        <strong>Owner, 7:00 pm</strong> Wadha has not drunk since morning. Feed arrived.{" "}
        <Link href="#naqah-demo" className="vb-link">
          Play the full call, 15 s
        </Link>
      </p>
    </div>
  );
}

export function VersionBHero() {
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
        <p className="vb-hero-proof" data-rise="3">
          Lead contributor on Naqah, a live investor MVP. Four of my five AI
          products are live.
        </p>
        <div className="vb-hero-actions" data-rise="4">
          <Link href="#work" className="vb-btn">
            View work
          </Link>
          <span className="vb-hero-secondary">
            <Link href="#naqah-demo" className="vb-link">
              Play the Naqah call
            </Link>
            <Link href="#contact" className="vb-link">
              Get in touch
            </Link>
          </span>
        </div>
        <p className="vb-hero-status" data-rise="5">
          <span className="vb-hero-dot" aria-hidden="true" />
          {contact.status}
        </p>
      </div>

      <figure className="vb-hero-sky" data-open="1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sky.src1000}
          srcSet={`${sky.src640} 640w, ${sky.src1000} 1000w, ${sky.src} 1067w`}
          sizes="(max-width: 899px) 100vw, 40vw"
          alt={sky.alt}
          width={sky.width}
          height={sky.height}
          fetchPriority="high"
          decoding="async"
          className="vb-hero-sky-img"
        />
        <figcaption className="vb-hero-sky-cap">
          The sky over AlUla. Photo: Saudi Press Agency.
        </figcaption>
      </figure>

      <div className="vb-hero-strip" data-rise="6">
        <HeroArtifact />
        <TonightStrip />
      </div>
    </section>
  );
}
