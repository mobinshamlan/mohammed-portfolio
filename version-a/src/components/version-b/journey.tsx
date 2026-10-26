"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { graduation } from "@/lib/portrait";

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

export function VersionBJourney() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const solid = useRef<SVGPathElement>(null);
  const dashed = useRef<SVGPathElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const traveller = useRef<SVGCircleElement>(null);
  const route = useRef<Route | null>(null);
  const photo = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.6", "end 0.6"],
  });
  const { scrollYProgress: photoScroll } = useScroll({
    target: photo,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(photoScroll, [0, 1], ["6%", "-6%"]);

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
    if (nodeEls.length < 4 || endEls.length < 4) {
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
    const start = { x: stops[0].x, y: stops[0].y - 56 };

    let solidPath = `M ${start.x} ${start.y} L ${stops[0].x} ${stops[0].y} L ${bottoms[0].x} ${bottoms[0].y}`;
    solidPath += ` ${curve(bottoms[0], stops[1])} L ${bottoms[1].x} ${bottoms[1].y}`;
    solidPath += ` ${curve(bottoms[1], stops[2])} L ${bottoms[2].x} ${bottoms[2].y}`;
    const dashedPath = `${curve(bottoms[2], stops[3])} L ${bottoms[3].x} ${bottoms[3].y}`;

    svg.current?.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    solid.current?.setAttribute("d", solidPath);
    dashed.current?.setAttribute(
      "d",
      `M ${bottoms[2].x} ${bottoms[2].y} ${dashedPath}`,
    );
    trail.setAttribute("d", `${solidPath} ${dashedPath}`);

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
          <mask id="vb-ed-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <path ref={reveal} className="vb-ed-reveal" />
          </mask>
        </defs>
        <g mask="url(#vb-ed-mask)">
          <path ref={solid} className="vb-ed-solid" />
          <path ref={dashed} className="vb-ed-dashed" />
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
              <h3 className="vb-ed-lead">Where it started.</h3>
              <p className="vb-ed-name">English Language Studies</p>
              <p>Approximately six months.</p>
              <p>I studied English in Brighton before moving to London.</p>
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
              <p>The beginning of the academic journey in London.</p>
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
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>
        </li>

        <li className="vb-ed-place vb-ed-riyadh">
          <span className="vb-ed-city" aria-hidden="true">
            Riyadh
          </span>
          <article data-ed-ch="" className="vb-ed-ch">
            <span
              data-ed-node=""
              className="vb-ed-node vb-ed-node-now"
              aria-hidden="true"
            />
            <div className="vb-ed-copy">
              <p className="vb-ed-meta">
                <span>04</span> Riyadh, Saudi Arabia
              </p>
              <h3 className="vb-ed-lead">The next chapter.</h3>
              <p className="vb-ed-years">2026</p>
              <p className="vb-ed-name">Tuwaiq Academy</p>
              <p>AI Fundamentals Bootcamp using Meta Tools</p>
              <p className="vb-ed-now">Currently attending</p>
              <p>A move into AI engineering.</p>
            </div>
            <span data-ed-end="" className="vb-ed-end" aria-hidden="true" />
          </article>
        </li>
      </ol>
    </section>
  );
}
