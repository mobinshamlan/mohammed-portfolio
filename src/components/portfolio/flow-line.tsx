"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One line through the Work chapter: it leaves the foot of each product's
 * picture, crosses the seam between chapters and enters the next picture,
 * drawing itself as the page scrolls. Decorative; wide screens only.
 */
export function FlowLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const [shape, setShape] = useState<{ d: string; w: number; h: number } | null>(null);

  // Build the path from where the pictures actually sit.
  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) return;

    function build() {
      if (!work || window.innerWidth < 900) {
        setShape(null);
        return;
      }
      const box = work.getBoundingClientRect();
      const visuals = Array.from(work.querySelectorAll<HTMLElement>(".vb-proj-visual"));
      const points = visuals.map((node) => {
        const r = node.getBoundingClientRect();
        const chapter = node.closest(".vb-proj");
        const section = chapter?.getBoundingClientRect();
        const head = chapter?.querySelector(".vb-proj-head")?.getBoundingClientRect();
        const foot = chapter?.querySelector(".vb-proj-foot")?.getBoundingClientRect();
        // Text stacked above or below the picture: the line keeps to its side instead.
        const above = !!head && head.bottom <= r.top + 1 && head.right > r.left && head.left < r.right;
        const below = !!foot && foot.top >= r.bottom - 1 && foot.right > r.left && foot.left < r.right;
        const side = r.left - box.left - 28;
        const midY = r.top + r.height / 2 - box.top;
        return {
          entry: above ? { x: side, y: midY } : { x: r.left + r.width / 2 - box.left, y: r.top - box.top - 24 },
          exit: below ? { x: side, y: midY } : { x: r.left + r.width / 2 - box.left, y: r.bottom - box.top + 24 },
          seam: section ? section.bottom - box.top : r.bottom - box.top,
        };
      });
      if (points.length < 2) return;
      let d = "";
      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i];
        const b = points[i + 1];
        const mid = a.seam;
        d += ` M ${a.exit.x} ${a.exit.y} L ${a.exit.x} ${Math.max(a.exit.y, mid - 90)}`;
        d += ` C ${a.exit.x} ${mid - 20}, ${b.entry.x} ${mid - 60}, ${b.entry.x} ${Math.min(b.entry.y, mid + 120)}`;
        d += ` L ${b.entry.x} ${b.entry.y}`;
      }
      const last = points[points.length - 1];
      d += ` M ${last.exit.x} ${last.exit.y} L ${last.exit.x} ${last.seam - 40}`;
      d = d.trim();
      setShape({ d, w: box.width, h: work.offsetHeight });
    }

    build();
    const observer = new ResizeObserver(build);
    observer.observe(work);
    window.addEventListener("resize", build);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  // Draw it up to the point level with the lower part of the screen.
  useEffect(() => {
    const line = path.current;
    const dot = head.current;
    const frame = svg.current;
    if (!shape || !line || !dot || !frame) return;
    const total = line.getTotalLength();
    line.style.strokeDasharray = `${total}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.strokeDashoffset = "0";
      dot.style.opacity = "0";
      return;
    }

    // Sample once: how far along the line each height is reached.
    const samples: { len: number; y: number }[] = [];
    let reach = 0;
    for (let len = 0; len <= total; len += 12) {
      const p = line.getPointAtLength(len);
      reach = Math.max(reach, p.y);
      samples.push({ len, y: reach });
    }

    let raf = 0;
    function update() {
      raf = 0;
      if (!line || !dot || !frame) return;
      const target = window.innerHeight * 0.62 - frame.getBoundingClientRect().top;
      let len = 0;
      for (const s of samples) {
        if (s.y > target) break;
        len = s.len;
      }
      line.style.strokeDashoffset = `${total - len}`;
      const p = line.getPointAtLength(len);
      dot.setAttribute("cx", `${p.x}`);
      dot.setAttribute("cy", `${p.y}`);
      dot.style.opacity = len > 0 && len < total - 12 ? "1" : "0";
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
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
      <path d={shape.d} className="vb-flow-ghost" />
      <path ref={path} d={shape.d} className="vb-flow-line" />
      <circle ref={head} r="6" className="vb-flow-head" />
    </svg>
  );
}
