"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { childhood, degree, graduation } from "@/lib/portrait";
import { DocumentViewer } from "./document-viewer";

const ease = [0.16, 1, 0.3, 1] as const;

type Point = { x: number; y: number };

type Route = {
  height: number;
  total: number;
  ys: number[];
  lens: number[];
  nodeLens: number[];
};

const SAMPLES = 260;

function curve(from: Point, to: Point) {
  const mid = (to.y - from.y) / 2;
  return `C ${from.x} ${from.y + mid} ${to.x} ${to.y - mid} ${to.x} ${to.y}`;
}

/** The childhood photograph as a faded archive print, with its grade always on. */
function ArchivePhoto() {
  return (
    <div className="vb-ed-archive">
      <Image
        src={childhood.src}
        alt={childhood.alt}
        width={childhood.width}
        height={childhood.height}
        sizes="(max-width: 900px) 70vw, 20rem"
        className="vb-ed-child-img"
      />
      <span className="vb-ed-vintage" aria-hidden="true">
        <Image
          src={childhood.src}
          alt=""
          width={childhood.width}
          height={childhood.height}
          sizes="(max-width: 900px) 70vw, 20rem"
          className="vb-ed-child-img vb-ed-vintage-img"
        />
        <span className="vb-ed-vintage-wine" />
        <span className="vb-ed-vintage-beige" />
        <span className="vb-ed-vintage-grain" />
      </span>
    </div>
  );
}

export function VersionBJourney() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const solid = useRef<SVGPathElement>(null);
  const dashed = useRef<SVGPathElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const traveller = useRef<SVGCircleElement>(null);
  const tail = useRef<SVGPathElement>(null);
  const fade = useRef<SVGLinearGradientElement>(null);
  const route = useRef<Route | null>(null);
  const photo = useRef<HTMLDivElement>(null);
  const award = useRef<HTMLDivElement>(null);
  const awardSeen = useInView(award, { once: true, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.6", "end 0.6"],
  });
  const { scrollYProgress: photoScroll } = useScroll({
    target: photo,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(photoScroll, [0, 1], ["6%", "-6%"]);

  // One scroll progress drives the whole prologue, so the word, the photograph
  // and the start of the route read as a single movement.
  const origin = useRef<HTMLLIElement>(null);
  const { scrollYProgress: originScroll } = useScroll({
    target: origin,
    offset: ["start 0.92", "end 0.45"],
  });
  const { scrollYProgress: originDrift } = useScroll({
    target: origin,
    offset: ["start end", "end start"],
  });
  const wordOpacity = useTransform(originScroll, [0, 0.5], [0, 1]);
  const wordShift = useTransform(originScroll, [0, 0.6], ["6%", "0%"]);
  const childClip = useTransform(
    originScroll,
    [0.06, 0.5],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const childFocus = useTransform(
    originScroll,
    [0.1, 0.68],
    ["blur(9px) brightness(0.72)", "blur(0px) brightness(1)"],
  );
  const childDrift = useTransform(originDrift, [0, 1], ["14px", "-14px"]);

  const update = useCallback((progress: number) => {
    const data = route.current;
    const path = reveal.current;
    if (!data || !path) {
      return;
    }

    const tipY = progress * data.height;
    let low = 0;
    let high = data.ys.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (data.ys[mid] < tipY) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    const length = progress >= 1 ? data.total : data.lens[low];

    path.style.strokeDashoffset = String(data.total - length);

    const dot = traveller.current;
    if (dot) {
      const at = path.getPointAtLength(length);
      dot.setAttribute("cx", String(at.x));
      dot.setAttribute("cy", String(at.y));
      dot.style.opacity = progress > 0 && progress < 1 ? "1" : "0";
    }

    const root = section.current;
    root
      ?.querySelectorAll<HTMLElement>("[data-ed-node]")
      .forEach((node, index) => {
        node.dataset.lit =
          length >= data.nodeLens[index] - 2 ? "true" : "false";
      });
    root
      ?.querySelectorAll<HTMLElement>("[data-ed-ch]")
      .forEach((chapter, index) => {
        chapter.dataset.lit =
          length >= data.nodeLens[index] - 2 ? "true" : "false";
      });
  }, []);

  const measure = useCallback(() => {
    const root = section.current;
    const trail = reveal.current;
    if (!root || !trail) {
      return;
    }
    const nodeEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ed-node]"),
    );
    const endEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ed-end]"),
    );
    if (nodeEls.length < 5 || endEls.length < 5) {
      return;
    }

    const box = root.getBoundingClientRect();
    const centre = (el: HTMLElement): Point => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
      };
    };

    const stops = nodeEls.map(centre);
    const bottoms = endEls.map(centre);
    // The route leaves the childhood photograph, runs out to the gutter, then down.
    const startEl = root.querySelector<HTMLElement>("[data-ed-start]");
    let head = `M ${stops[0].x} ${stops[0].y - 56}`;
    if (startEl) {
      const r = startEl.getBoundingClientRect();
      const px = r.left - box.left;
      const py = r.top - box.top + r.height * 0.5;
      const gap = px - stops[0].x;
      const round = Math.min(14, gap - 1);
      head =
        round > 2
          ? `M ${px} ${py} H ${stops[0].x + round} Q ${stops[0].x} ${py} ${stops[0].x} ${py + round}`
          : `M ${stops[0].x} ${py}`;
    }

    let solidPath = `${head} L ${stops[0].x} ${stops[0].y} L ${bottoms[0].x} ${bottoms[0].y}`;
    solidPath += ` ${curve(bottoms[0], stops[1])} L ${bottoms[1].x} ${bottoms[1].y}`;
    solidPath += ` ${curve(bottoms[1], stops[2])} L ${bottoms[2].x} ${bottoms[2].y}`;
    const dashedPath = `${curve(bottoms[2], stops[3])} L ${bottoms[3].x} ${bottoms[3].y} ${curve(bottoms[3], stops[4])}`;
    // The route does not end: a short dotted tail runs on and fades out.
    const tailLength = Math.max(24, Math.min(90, box.height - stops[4].y - 12));
    const tailPath = `L ${stops[4].x} ${stops[4].y + tailLength}`;

    svg.current?.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    solid.current?.setAttribute("d", solidPath);
    dashed.current?.setAttribute(
      "d",
      `M ${bottoms[2].x} ${bottoms[2].y} ${dashedPath}`,
    );
    tail.current?.setAttribute(
      "d",
      `M ${stops[4].x} ${stops[4].y} ${tailPath}`,
    );
    fade.current?.setAttribute("x1", String(stops[4].x));
    fade.current?.setAttribute("x2", String(stops[4].x));
    fade.current?.setAttribute("y1", String(stops[4].y));
    fade.current?.setAttribute("y2", String(stops[4].y + tailLength));
    trail.setAttribute("d", `${solidPath} ${dashedPath} ${tailPath}`);

    const total = trail.getTotalLength();
    const ys: number[] = [];
    const lens: number[] = [];
    for (let i = 0; i <= SAMPLES; i += 1) {
      const length = (total * i) / SAMPLES;
      ys.push(trail.getPointAtLength(length).y);
      lens.push(length);
    }

    const lengthAt = (y: number) => {
      const index = ys.findIndex((value) => value >= y);
      return index < 0 ? total : lens[index];
    };

    trail.style.strokeDasharray = String(total);
    route.current = {
      height: box.height,
      total,
      ys,
      lens,
      nodeLens: stops.map((point) => lengthAt(point.y)),
    };
    root.dataset.ready = "true";
    update(reduceMotion ? 1 : scrollYProgress.get());
  }, [reduceMotion, scrollYProgress, update]);

  useEffect(() => {
    const root = section.current;
    if (!root) {
      return;
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!reduceMotion) {
      update(progress);
    }
  });

  return (
    <section
      id="education"
      ref={section}
      className="vb-ed"
      aria-labelledby="ed-title"
    >
      <svg
        ref={svg}
        className="vb-ed-route"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            ref={fade}
            id="vb-ed-fade"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#d9b8ba" stopOpacity="1" />
            <stop offset="1" stopColor="#d9b8ba" stopOpacity="0" />
          </linearGradient>
          <mask id="vb-ed-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <path ref={reveal} className="vb-ed-reveal" />
          </mask>
        </defs>
        <g mask="url(#vb-ed-mask)">
          <path ref={solid} className="vb-ed-solid" />
          <path ref={dashed} className="vb-ed-dashed" />
          <path ref={tail} className="vb-ed-tail" />
        </g>
        <circle ref={traveller} className="vb-ed-traveller" r="7" />
      </svg>

      <header className="vb-ed-head">
        <p className="vb-kicker">03 / Education</p>
        <h2 id="ed-title" className="vb-ed-title">
          Four chapters.
        </h2>
        <p className="vb-ed-sub">Two countries. One journey.</p>
      </header>

      <ol className="vb-ed-chapters">
        <li ref={origin} className="vb-ed-prologue">
          <motion.span
            className="vb-ed-origin"
            aria-hidden="true"
            style={{ opacity: wordOpacity, x: wordShift }}
          >
            <span>Saudi</span>
            <span>Arabia</span>
          </motion.span>

          <figure className="vb-ed-child">
            <div data-ed-start="" className="vb-ed-child-anchor">
              <motion.div
                className="vb-ed-child-drift"
                style={{ y: childDrift }}
              >
                <motion.div
                  className="vb-ed-child-frame"
                  style={{ clipPath: childClip }}
                >
                  <motion.div
                    className="vb-ed-child-focus"
                    style={{ filter: childFocus }}
                  >
                    <ArchivePhoto />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            <figcaption className="vb-ed-child-cap">
              <span className="vb-ed-child-lead">Where it all began.</span>
              <span className="vb-ed-child-place">Saudi Arabia</span>
            </figcaption>
          </figure>
        </li>

        <li className="vb-ed-place vb-ed-brighton">
          <span className="vb-ed-city" aria-hidden="true">
            Brighton
          </span>
          <article data-ed-ch="" className="vb-ed-ch">
            <span data-ed-node="" className="vb-ed-node" aria-hidden="true" />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>01</span> Brighton, United Kingdom
              </p>
              <h3 className="vb-ed-lead">Learning the language.</h3>
              <p className="vb-ed-name">English Language Studies</p>
              <p>About six months in Brighton.</p>
              <p>Then a move to London for the next stage of study.</p>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>
        </li>

        <li className="vb-ed-place vb-ed-london">
          <div className="vb-ed-city-track" aria-hidden="true">
            <span className="vb-ed-city">London</span>
          </div>

          <article data-ed-ch="" className="vb-ed-ch vb-ed-kaplan">
            <span data-ed-node="" className="vb-ed-node" aria-hidden="true" />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>02</span> London, United Kingdom
              </p>
              <h3 className="vb-ed-lead">Building the foundation.</h3>
              <p className="vb-ed-years">2022–2023</p>
              <p className="vb-ed-name">Kaplan International College London</p>
              <p>Foundation Certificate for Science and Engineering.</p>
              <p>Preparation for undergraduate study in London.</p>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>

          <article data-ed-ch="" className="vb-ed-ch vb-ed-qmul">
            <span data-ed-node="" className="vb-ed-node" aria-hidden="true" />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>03</span> London, United Kingdom
              </p>
              <h3 className="vb-ed-lead">The university years.</h3>
              <p className="vb-ed-years">2023–2026</p>
              <p className="vb-ed-name">Queen Mary University of London</p>
              <p className="vb-ed-degree">BSc (Hons) Computer Science</p>
              <p>Graduated in 2026.</p>
              <p className="vb-ed-scholar">
                Custodian of the Two Holy Mosques Scholarship Program — Imdad
                Track
              </p>
            </div>

            <motion.figure
              className="vb-ed-photo"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                ref={photo}
                className="vb-ed-photo-frame"
                variants={{
                  hidden: { clipPath: "inset(100% 0 0 0)" },
                  shown: { clipPath: "inset(0% 0 0 0)" },
                }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 1.2, ease }
                }
              >
                <motion.div className="vb-ed-photo-move" style={{ y: photoY }}>
                  <Image
                    src={graduation.src}
                    alt={graduation.alt}
                    width={graduation.width}
                    height={graduation.height}
                    sizes="(max-width: 900px) 80vw, 30vw"
                    className="vb-ed-photo-img"
                    style={{ objectPosition: graduation.position }}
                  />
                </motion.div>
                <span className="vb-ed-photo-bar" aria-hidden="true" />
              </motion.div>
              <figcaption className="vb-ed-caption">
                Graduation, London.
              </figcaption>
            </motion.figure>

            {/* The award closes the university chapter before the route moves on. */}
            <div
              ref={award}
              className="vb-ed-award"
              data-seen={awardSeen ? "true" : "false"}
            >
              <DocumentViewer
                triggerClassName="vb-ed-award-trigger"
                triggerLabel="View degree certificate"
                src={degree.src}
                width={degree.width}
                height={degree.height}
                alt={degree.alt}
                title="Degree certificate"
                subtitle="BSc Computer Science (Hons), Queen Mary University of London"
                href={degree.src}
              >
                <span className="vb-ed-award-stack" aria-hidden="true">
                  <span className="vb-ed-award-under" />
                  <Image
                    src={degree.src}
                    alt=""
                    width={degree.width}
                    height={degree.height}
                    sizes="9rem"
                    className="vb-ed-award-doc"
                  />
                </span>
                <span className="vb-ed-award-copy">
                  <span className="vb-ed-award-title">Degree awarded.</span>
                  <span className="vb-ed-award-meta">
                    BSc (Hons) Computer Science, 9 July 2026
                  </span>
                  <span className="vb-ed-award-cta">
                    View certificate <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </DocumentViewer>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>
        </li>

        <li className="vb-ed-place vb-ed-riyadh">
          <span className="vb-ed-city" aria-hidden="true">
            Riyadh
          </span>
          <article data-ed-ch="" className="vb-ed-ch vb-ed-learning">
            <span
              data-ed-node=""
              className="vb-ed-node vb-ed-node-now"
              aria-hidden="true"
            />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>04</span> Riyadh, Saudi Arabia
              </p>
              <h3 className="vb-ed-lead">Currently learning.</h3>
              <p className="vb-ed-years">2026</p>
              <p className="vb-ed-name">Tuwaiq Academy</p>
              <p>AI Fundamentals Bootcamp using Meta Tools.</p>
              <p className="vb-ed-now">Currently attending</p>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>

          <article data-ed-ch="" className="vb-ed-ch vb-ed-future">
            <span
              data-ed-node=""
              className="vb-ed-node vb-ed-node-future"
              aria-hidden="true"
            />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>05</span> What comes next
              </p>
              <h3 className="vb-ed-lead">The next chapter.</h3>
              <p className="vb-ed-degree">Software Engineering &amp; AI</p>
              <p className="vb-ed-goal">
                Seeking my first professional opportunity in software
                engineering while continuing to explore AI.
              </p>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>
        </li>
      </ol>
    </section>
  );
}
