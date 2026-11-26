"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One stitched thread through the Work chapter, like the seam of a Sadu
 * weave, in the red of the graduation ribbon. It picks up where the thread
 * from the opening leaves off, sweeps from each product's try-it to the next
 * and ties a small knot when it arrives; the chapter's try-it brightens as the
 * knot lands. The drawing follows the scroll with a little ease. Decorative;
 * wide screens only, fully drawn under reduced motion.
 */

type Point = { x: number; y: number };

type Stop = {
  chapter: HTMLElement;
  entry: Point;
  exit: Point;
  seam: number;
  textTop: number;
  textBottom: number;
};

type Shape = { d: string; w: number; h: number; knots: Point[] };

/** How far the drawn end trails the scroll target each frame (0..1). */
const EASE = 0.16;

export function FlowLine() {
  const svg = useRef<SVGSVGElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const knots = useRef<(SVGGElement | null)[]>([]);
  const [shape, setShape] = useState<Shape | null>(null);

  // Build the path from where the try-its actually sit.
  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) return;

    function build() {
      if (!work) return;
      if (window.innerWidth < 900) {
        work.dataset.flow = "off";
        setShape(null);
        return;
      }
      const box = work.getBoundingClientRect();
      const chapters = Array.from(work.querySelectorAll<HTMLElement>(".vb-proj"));
      const stops: Stop[] = [];
      for (const chapter of chapters) {
        const node = chapter.querySelector<HTMLElement>(".vb-proj-visual");
        if (!node) continue;
        const r = node.getBoundingClientRect();
        const section = chapter.getBoundingClientRect();
        const headBox = chapter.querySelector(".vb-proj-head")?.getBoundingClientRect();
        const foot = chapter.querySelector(".vb-proj-foot")?.getBoundingClientRect();
        const overlaps = (t?: DOMRect) => !!t && t.right > r.left && t.left < r.right;
        // Text stacked above or below the try-it: the thread keeps to the outer margin instead.
        const above = overlaps(headBox) && (headBox as DOMRect).bottom <= r.top + 1;
        const below = overlaps(foot) && (foot as DOMRect).top >= r.bottom - 1;
        const onRight = r.left + r.width / 2 > box.left + box.width / 2;
        // Kept inside the viewport so the needle's halo never widens the page.
        const side = onRight
          ? Math.min(r.right - box.left + 28, box.width - 16)
          : Math.max(r.left - box.left - 28, 16);
        const centre = r.left + r.width / 2 - box.left;
        const midY = r.top + r.height / 2 - box.top;
        stops.push({
          chapter,
          // Under a full-width head the thread comes down the outer margin and
          // ties level with the try-it's top corner, then goes under it.
          entry: above ? { x: side, y: r.top - box.top - 14 } : { x: centre, y: r.top - box.top - 24 },
          exit: below ? { x: side, y: midY } : { x: centre, y: r.bottom - box.top + 24 },
          seam: section.bottom - box.top,
          textTop: Math.min(headBox?.top ?? Infinity, foot?.top ?? Infinity) - box.top,
          textBottom: Math.max(headBox?.bottom ?? -Infinity, foot?.bottom ?? -Infinity) - box.top,
        });
      }
      if (stops.length < 2) return;

      const f = (n: number) => Math.round(n * 10) / 10;
      let d = "";

      // The opening's thread drops in from above; the seam continues it straight
      // down onto the first try-it when it lands over it, or sweeps across to it.
      const thread = document.querySelector(".vb-open-thread")?.getBoundingClientRect();
      const first = stops[0];
      // The opening clips its thread at its own edge, which is where Work begins.
      if (thread && thread.bottom - box.top >= -1) {
        const tx = thread.left + thread.width / 2 - box.left;
        const ty = 0;
        const visual = first.chapter.querySelector<HTMLElement>(".vb-proj-visual")?.getBoundingClientRect();
        if (visual && tx > visual.left - box.left + 48 && tx < visual.right - box.left - 48 && first.entry.y > ty) {
          first.entry = { x: tx, y: first.entry.y };
          d += `M ${f(tx)} ${f(ty)} L ${f(tx)} ${f(first.entry.y)}`;
        } else {
          const k = Math.max(40, (first.entry.y - ty) * 0.6);
          d += `M ${f(tx)} ${f(ty)} C ${f(tx)} ${f(ty + k)}, ${f(first.entry.x)} ${f(first.entry.y - k)}, ${f(first.entry.x)} ${f(first.entry.y)}`;
        }
      }

      // Between chapters: straight down from the try-it, one long sweep across
      // the seam where there is no text, then straight down onto the next.
      for (let i = 0; i < stops.length - 1; i += 1) {
        const a = stops[i];
        const b = stops[i + 1];
        let c0 = Math.max(a.exit.y + 16, a.textBottom + 28, a.seam - 130);
        let c1 = Math.min(b.entry.y - 16, b.textTop - 28, a.seam + 170);
        if (c1 < c0 + 60) c1 = Math.min(c0 + 60, b.entry.y - 8);
        if (c1 <= c0) {
          c0 = a.exit.y;
          c1 = b.entry.y;
        }
        const k = (c1 - c0) * 0.62;
        d += ` M ${f(a.exit.x)} ${f(a.exit.y)}`;
        if (c0 > a.exit.y) d += ` L ${f(a.exit.x)} ${f(c0)}`;
        d += ` C ${f(a.exit.x)} ${f(c0 + k)}, ${f(b.entry.x)} ${f(c1 - k)}, ${f(b.entry.x)} ${f(c1)}`;
        if (b.entry.y > c1) d += ` L ${f(b.entry.x)} ${f(b.entry.y)}`;
      }
      const last = stops[stops.length - 1];
      d += ` M ${f(last.exit.x)} ${f(last.exit.y)} L ${f(last.exit.x)} ${f(last.seam - 40)}`;

      work.dataset.flow = "on";
      const next: Shape = { d: d.trim(), w: box.width, h: work.offsetHeight, knots: stops.map((s) => s.entry) };
      // A resize that moved nothing keeps the drawn thread where it is.
      setShape((prev) => (prev && prev.d === next.d && prev.w === next.w && prev.h === next.h ? prev : next));
    }

    build();
    const observer = new ResizeObserver(build);
    observer.observe(work);
    window.addEventListener("resize", build);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", build);
      delete work.dataset.flow;
    };
  }, []);

  // Draw it, with a little lag, up to the point level with the lower part of the screen.
  useEffect(() => {
    const line = reveal.current;
    const needle = head.current;
    const frame = svg.current;
    if (!shape || !line || !needle || !frame) return;
    const work = frame.parentElement;
    const chapters = Array.from(work?.querySelectorAll<HTMLElement>(".vb-proj") ?? []);
    const marks = knots.current.slice(0, shape.knots.length);
    const total = line.getTotalLength();
    line.style.strokeDasharray = `${total}`;

    // Sample once: how far down the page each length reaches, and where each knot sits.
    const samples: { len: number; y: number }[] = [];
    const knotAt = shape.knots.map(() => total);
    const knotGap = shape.knots.map(() => Infinity);
    let reach = 0;
    for (let len = 0; len <= total; len += 8) {
      const p = line.getPointAtLength(len);
      reach = Math.max(reach, p.y);
      samples.push({ len, y: reach });
      shape.knots.forEach((k, i) => {
        const gap = Math.abs(p.x - k.x) + Math.abs(p.y - k.y);
        if (gap < knotGap[i]) {
          knotGap[i] = gap;
          knotAt[i] = len;
        }
      });
    }

    const tied: boolean[] = shape.knots.map(() => false);
    function setTied(i: number, on: boolean) {
      if (tied[i] === on) return;
      tied[i] = on;
      const mark = marks[i];
      if (mark) mark.dataset.tied = on ? "true" : "false";
      // The knot unties as the thread is drawn back, but a try-it once lit stays lit.
      const chapter = chapters[i];
      if (chapter && on) chapter.dataset.sewn = "true";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.strokeDashoffset = "0";
      needle.style.opacity = "0";
      shape.knots.forEach((_, i) => setTied(i, true));
      return;
    }

    let raf = 0;
    let drawn = 0;
    function apply(len: number) {
      if (!line || !needle) return;
      line.style.strokeDashoffset = `${total - len}`;
      const p = line.getPointAtLength(len);
      needle.style.transform = `translate(${p.x}px, ${p.y}px)`;
      needle.style.opacity = len > 4 && len < total - 12 ? "1" : "0";
      knotAt.forEach((at, i) => setTied(i, len >= at - 3));
    }
    function target() {
      if (!frame) return 0;
      const y = window.innerHeight * 0.62 - frame.getBoundingClientRect().top;
      let len = 0;
      for (const s of samples) {
        if (s.y > y) break;
        len = s.len;
      }
      return len;
    }
    function tick() {
      raf = 0;
      const goal = target();
      const gap = goal - drawn;
      drawn = Math.abs(gap) < 0.6 ? goal : drawn + gap * EASE;
      apply(drawn);
      if (drawn !== goal) raf = requestAnimationFrame(tick);
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    drawn = target();
    apply(drawn);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [shape]);

  if (!shape) return null;
  return (
    <svg
      ref={svg}
      className="vb-flow"
      width={shape.w}
      height={shape.h}
      viewBox={`0 0 ${shape.w} ${shape.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id="vb-flow-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={shape.w} height={shape.h}>
          <path ref={reveal} d={shape.d} className="vb-flow-reveal" />
        </mask>
      </defs>
      <path d={shape.d} className="vb-flow-ghost" />
      <path d={shape.d} className="vb-flow-line" mask="url(#vb-flow-mask)" />
      {shape.knots.map((knot, i) => (
        <g
          key={`${knot.x}-${knot.y}`}
          ref={(node) => {
            knots.current[i] = node;
          }}
          className="vb-flow-knot"
          transform={`translate(${knot.x} ${knot.y})`}
        >
          <circle className="vb-flow-knot-ring" r="8" />
          <rect className="vb-flow-knot-mark" x="-4.5" y="-4.5" width="9" height="9" />
        </g>
      ))}
      <g ref={head} className="vb-flow-head">
        <circle className="vb-flow-head-halo" r="9" />
        <rect x="-5" y="-5" width="10" height="10" className="vb-flow-head-mark" />
      </g>
    </svg>
  );
}
