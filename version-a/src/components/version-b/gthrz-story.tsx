"use client";

import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { gthrzShots } from "@/lib/gthrz";

const tech = ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL"];

const copySteps = [
  {
    title: "The problem",
    body: "Private gatherings need a way to invite people, manage who can attend, and keep location and guest details from spreading too early. Public event tools often expose more than a host wants to share.",
    shot: gthrzShots.discover,
  },
  {
    title: "The solution",
    body: "Gthrz is a mobile app for creating and running events with host control. Guests can request to join, hosts can approve RSVPs, and location can stay hidden until the host chooses to reveal it.",
    shot: gthrzShots.events,
  },
  {
    title: "Built around the host",
    body: "Start from a title, a time and a category. Capacity, approval and privacy settings live in the same form.",
    shot: gthrzShots.create,
  },
] as const;

const screens = [gthrzShots.welcome, ...copySteps.map((item) => item.shot)];

// Scroll progress at which each step takes over.
const stepAt = [0.1, 0.4, 0.7];

function stepFor(progress: number) {
  return stepAt.filter((edge) => progress >= edge).length;
}

export function GthrzStory() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  // Scroll progress drives CSS variables directly so the parallax never
  // re-renders React; only the step index lives in state.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setStep(stepFor(progress));
    const node = stage.current;
    if (!node) {
      return;
    }
    if (!reduceMotion) {
      node.style.setProperty("--p", String(Math.min(progress / stepAt[0], 1)));
      node.style.setProperty("--rail", String(progress));
    }
  });

  return (
    <div ref={track} className="vb-gs">
      <div
        ref={stage}
        className="vb-gs-stage"
        data-step={step}
      >
        <h1 className="vb-gs-word">Gthrz</h1>

        <div className="vb-gs-phones" aria-hidden="true">
          <div className="vb-gs-side vb-gs-left">
            <Image
              src={gthrzShots.home.src}
              alt=""
              width={gthrzShots.home.width}
              height={gthrzShots.home.height}
              sizes="(max-width: 900px) 40vw, 240px"
              priority
            />
          </div>
          <div className="vb-gs-side vb-gs-right">
            <Image
              src={gthrzShots.events.src}
              alt=""
              width={gthrzShots.events.width}
              height={gthrzShots.events.height}
              sizes="(max-width: 900px) 40vw, 240px"
              priority
            />
          </div>
          <div className="vb-gs-main">
            {screens.map((shot, index) => (
              <Image
                key={shot.src}
                src={shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                sizes="(max-width: 900px) 62vw, 340px"
                priority={index === 0}
                data-on={step === index}
              />
            ))}
          </div>
        </div>

        <div className="vb-gs-fade" />

        <div className="vb-gs-copy">
          <div className="vb-gs-block vb-gs-intro" data-on={step === 0}>
            <p className="vb-gs-crumb">
              <Link
                href="/version-b#work"
                className="vb-crumb"
                tabIndex={step === 0 ? 0 : -1}
              >
                Work
              </Link>
              {" / "}
              Gthrz
            </p>
            <p className="vb-gs-lead">
              A privacy-first mobile event planning application.
            </p>
            <ul className="vb-gs-tech">
              {tech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {copySteps.map((item, index) => (
            <div
              key={item.title}
              className="vb-gs-block"
              data-on={step === index + 1}
            >
              <h2 className="vb-gs-title">{item.title}</h2>
              <p className="vb-gs-body">{item.body}</p>
            </div>
          ))}
        </div>

        <span className="vb-gs-rail" aria-hidden="true" />
      </div>
      <div className="vb-gs-travel" aria-hidden="true" />
    </div>
  );
}
