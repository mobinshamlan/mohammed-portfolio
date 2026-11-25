"use client";

import { useEffect, useRef } from "react";

/*
 * The line of moments, drawn through the whole page. It leaves Tonight's line
 * in the hero, runs down the margin, becomes the Work Line and Seet's
 * held → deposit → confirmed line, and bends across each chapter in the space
 * above its heading. Inside a project's field it takes that project's accent.
 *
 * The path is measured from the page (never per frame) and drawn as you
 * scroll: each colour zone is its own path, so a frame only repaints the zone
 * being drawn. Reduced motion shows it fully drawn; without JavaScript there
 * is no thread and nothing else changes. Decorative, so aria-hidden.
 */

type Pt = [number, number];
type Seg = { d: string; x0: number; y0: number; x1: number; y1: number; len: number; flat: boolean };
type Zone = { top: number; color: string };
type Piece = { d: string; color: string; start: number; len: number };
type Node = { x: number; y: number; at: number; color: string };

const DESKTOP = 900;
const HEAD = 0.72; // the drawing tip follows this fraction of the viewport

export function Thread({ variant = "home" }: { variant?: "home" | "case" }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const root = host?.parentElement;
    if (!host || !root) {
      return;
    }
    const svg = host.querySelector("svg")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paths: SVGPathElement[] = [];
    let dots: SVGCircleElement[] = [];
    let pieces: Piece[] = [];
    let nodes: Node[] = [];
    let keys: [number, number][] = []; // [trigger y, drawn length]
    let total = 0;
    let drawn = -1;
    let frame = 0;

    function measure() {
      frame = 0;
      const built = variant === "case" ? buildCase(root!) : build(root!);
      if (!built) {
        svg.replaceChildren();
        pieces = [];
        return;
      }
      ({ pieces, nodes, keys, total } = built);
      const ns = "http://www.w3.org/2000/svg";
      paths = pieces.map((piece) => {
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", piece.d);
        path.setAttribute("pathLength", String(piece.len));
        path.setAttribute("stroke", piece.color);
        path.style.strokeDasharray = `${piece.len} ${piece.len + 1}`;
        return path;
      });
      dots = nodes.map((node) => {
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", String(node.x));
        dot.setAttribute("cy", String(node.y));
        dot.setAttribute("r", "5");
        dot.setAttribute("fill", node.color);
        return dot;
      });
      svg.replaceChildren(...paths, ...dots);
      drawn = -1;
      paint();
    }

    function paint() {
      frame = 0;
      if (!pieces.length) {
        return;
      }
      const end = document.documentElement.scrollHeight - window.innerHeight - 4;
      const length =
        reduce.matches || window.scrollY >= end ? total : lookup(keys, window.scrollY + window.innerHeight * HEAD);
      if (Math.abs(length - drawn) < 0.5) {
        return;
      }
      drawn = length;
      pieces.forEach((piece, i) => {
        const shown = Math.min(piece.len, Math.max(0, length - piece.start));
        const offset = String(piece.len - shown);
        if (paths[i].style.strokeDashoffset !== offset) {
          paths[i].style.strokeDashoffset = offset;
        }
      });
      nodes.forEach((node, i) => {
        const on = length >= node.at ? "true" : "false";
        if (dots[i].dataset.on !== on) {
          dots[i].dataset.on = on;
        }
      });
    }

    const schedule = (fn: () => void) => () => {
      if (!frame) {
        frame = requestAnimationFrame(fn);
      }
    };
    const onScroll = schedule(paint);
    const onLayout = schedule(measure);

    measure();
    const observer = new ResizeObserver(onLayout);
    observer.observe(root);
    document.fonts?.ready.then(onLayout);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    reduce.addEventListener("change", onLayout);
    host.dataset.ready = "true";
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayout);
      reduce.removeEventListener("change", onLayout);
    };
  }, [variant]);

  return (
    <div ref={wrap} className="vb-thread" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" focusable="false" />
    </div>
  );
}

/* ---------- Measuring the route ---------- */

/** Boxes relative to the thread's root, and the queries the routes share. */
function measuring(root: HTMLElement) {
  const base = root.getBoundingClientRect();
  const box = (el: Element | null) => {
    if (!el) {
      return null;
    }
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) {
      return null;
    }
    return { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top, cx: r.left - base.left + r.width / 2, cy: r.top - base.top + r.height / 2 };
  };
  const q = (sel: string) => root.querySelector(sel);
  const qa = (sel: string) => [...root.querySelectorAll(sel)].map(box).filter((b) => b !== null);
  return { box, q, qa };
}

function build(root: HTMLElement) {
  const { box, q, qa } = measuring(root);

  const width = root.clientWidth;
  const inner = q(".vb-proj-inner");
  const gutter = inner ? parseFloat(getComputedStyle(inner).paddingLeft) : 16;
  const night = getComputedStyle(root).getPropertyValue("--ember").trim() || "#e9a24a";
  const xL = Math.round(gutter / 2);
  const xR = Math.round(width - gutter / 2);
  const desktop = width >= DESKTOP;

  const hero = box(q(".vb-hero"));
  const footer = box(q(".vb-footer"));
  if (!hero || !footer) {
    return null;
  }

  // Colour zones: night by default, each project's field in its accent.
  const zones: Zone[] = [{ top: -Infinity, color: night }];
  const fields = [...root.querySelectorAll<HTMLElement>(".vb-proj")];
  fields.forEach((el) => {
    const b = box(el);
    if (!b) {
      return;
    }
    zones.push({ top: b.top, color: getComputedStyle(el).getPropertyValue("--accent").trim() || night });
    zones.push({ top: b.bottom, color: night });
  });
  zones.sort((a, b) => a.top - b.top);

  // A section's top padding: where the thread may cross the page.
  const seam = (sel: string) => {
    const el = q(sel);
    const b = box(el);
    if (!el || !b) {
      return null;
    }
    const target = el.matches(".vb-proj") ? el.querySelector(".vb-proj-inner")! : el;
    const pad = parseFloat(getComputedStyle(target).paddingTop) || 64;
    return Math.round(b.top + Math.min(pad * 0.45, 64));
  };

  const pts: Pt[] = [];
  const marks: Pt[] = []; // points where a moment dot sits

  if (!desktop) {
    // Phones: one rail down the left edge, a dot where each project begins.
    pts.push([xL, hero.bottom - 24], [xL, footer.top + 48]);
    fields.forEach((el) => {
      const b = box(el);
      if (b) {
        marks.push([xL, b.top + 28]);
      }
    });
  } else {
    let side: "L" | "R" = "L";
    const x = () => (side === "L" ? xL : xR);
    const cross = (y: number | null) => {
      if (y === null) {
        return;
      }
      pts.push([x(), y]);
      side = side === "L" ? "R" : "L";
      pts.push([x(), y]);
    };

    // Tonight's line in the hero: the thread starts at its first moment.
    const tonight = qa(".vb-hero-strip .vb-dayline-dot");
    if (tonight.length) {
      pts.push([tonight[0].cx, tonight[0].cy], [xL, tonight[0].cy]);
      marks.push([tonight[0].cx, tonight[0].cy]);
    } else {
      pts.push([xL, hero.bottom - 48]);
    }

    // The Work Line: the thread runs along it, from its first point to past its last.
    const work = qa(".vb-workline-dot");
    if (work.length) {
      const y = work[0].cy;
      pts.push([xL, y]);
      side = "R";
      pts.push([xR, y]);
    }

    // Seet: cross above it, then become its held → deposit → confirmed line.
    const seet = q('.vb-proj[data-id="seet"]');
    const seetDots = qa('.vb-proj[data-id="seet"] .vb-proj-states .vb-dayline-dot');
    const seetBox = box(seet);
    const states = box(q('.vb-proj[data-id="seet"] .vb-proj-states'));
    const art = box(q('.vb-proj[data-id="seet"] .vb-proj-art'));
    if (seetBox && seetDots.length && states && art && art.left > states.right + 24) {
      cross(seam('.vb-proj[data-id="seet"]'));
      const y = seetDots[0].cy;
      const gap = Math.round((states.right + art.left) / 2);
      const content = Math.max(...qa('.vb-proj[data-id="seet"] .vb-proj-inner > *').map((b) => b.bottom));
      const next = box(seet!.nextElementSibling);
      const below = Math.round((content + Math.min(seetBox.bottom, next?.top ?? Infinity)) / 2);
      pts.push([xL, y], [gap, y], [gap, below], [xR, below]);
      side = "R";
    }

    // The chapters after the work: bend across above About, Skills and Contact.
    for (const sel of ["#about", "#skills", "#contact"]) {
      cross(seam(sel));
    }

    // Into the footer: the line ends on the name.
    const name = box(q(".vb-footer-name"));
    const endY = Math.round(name ? name.top - 28 : footer.top + 56);
    pts.push([x(), endY], [gutter, endY]);
    marks.push([gutter, endY]);
  }

  const segs = route(pts, desktop ? 40 : 0);
  if (!segs.length) {
    return null;
  }
  // On desktop, a moment where the thread enters each field on its rail.
  if (desktop) {
    fields.forEach((el) => {
      const b = box(el);
      const seg = b && segs.find((s) => !s.flat && s.x0 === s.x1 && s.y0 <= b.top + 72 && s.y1 >= b.top + 72);
      if (b && seg && el.dataset.id !== "seet") {
        marks.push([seg.x0, b.top + 72]);
      }
    });
  }
  return slice(segs, zones, marks);
}

/*
 * A case study: the line leaves the project's name in the hero, runs down the
 * margin past each chapter's heading (a moment at each), crosses the page
 * above the decision and again above the screens, and hands over to the next
 * project, ending on its "Next" label. In the hero it takes the accent; on the
 * night it takes the project's own colour (--thread on the case main); in the
 * previous and next fields, theirs. Phones get a single rail on the left.
 */
function buildCase(root: HTMLElement) {
  const { box, q } = measuring(root);
  const main = q(".vb-case");
  const hero = q(".vb-case-hero");
  const nav = q(".vb-case-next");
  const heroBox = box(hero);
  const navBox = box(nav);
  const label = box(q(".vb-case-next-link:last-child > span:first-child"));
  if (!main || !hero || !nav || !heroBox || !navBox || !label) {
    return null;
  }

  const width = root.clientWidth;
  const gutter = parseFloat(getComputedStyle(hero).paddingLeft) || 16;
  const night = getComputedStyle(main).getPropertyValue("--thread").trim() || "#e9a24a";
  const accentOf = (el: Element) => getComputedStyle(el).getPropertyValue("--accent").trim() || night;
  const xL = Math.round(gutter / 2);
  const xR = Math.round(width - gutter / 2);
  const desktop = width >= DESKTOP;

  // Colour zones: the hero and the two neighbour fields carry their accents.
  // The body's rounded top rises over the hero, so the night begins at its edge.
  const body = box(hero.nextElementSibling);
  const zones: Zone[] = [{ top: -Infinity, color: accentOf(hero) }, { top: body?.top ?? heroBox.bottom, color: night }];
  for (const link of nav.querySelectorAll(".vb-case-next-link")) {
    const b = box(link);
    if (b) {
      zones.push({ top: b.top, color: accentOf(link) });
    }
  }
  zones.sort((a, b) => a.top - b.top);

  // Where each chapter's heading sits, ignoring any entrance transform still waiting.
  const layoutTop = (el: HTMLElement) => {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== root) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return node === root ? y : null;
  };
  const headings: number[] = [];
  for (const section of main.querySelectorAll<HTMLElement>(":scope > section")) {
    const h = section.querySelector<HTMLElement>("h2");
    const top = h && h.offsetHeight ? layoutTop(h) : null;
    if (h && top !== null) {
      headings.push(Math.round(top + Math.min(h.offsetHeight, 48) / 2));
    }
  }

  const name = box(q(".vb-case-name"));
  const startY = Math.round(name ? name.top + Math.min(name.bottom - name.top, 120) / 2 : heroBox.top + 48);
  const endY = Math.round(label.cy);
  const pts: Pt[] = [];
  const marks: Pt[] = [];

  if (!desktop) {
    pts.push([xL, startY], [xL, endY]);
    marks.push([xL, startY], [xL, endY]);
    headings.forEach((y) => marks.push([xL, y]));
  } else {
    let side: "L" | "R" = "L";
    const x = () => (side === "L" ? xL : xR);
    const cross = (sel: string) => {
      const el = q(sel);
      const b = box(el);
      if (!el || !b) {
        return;
      }
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 64;
      const y = Math.round(b.top + Math.min(pad * 0.45, 64));
      pts.push([x(), y]);
      side = side === "L" ? "R" : "L";
      pts.push([x(), y]);
    };

    // From beside the name, down the margin.
    pts.push([xL, startY]);
    marks.push([xL, startY]);
    cross(".vb-case > .vb-case-decision");
    cross(".vb-case > .vb-case-screens");
    // Hand over above the neighbours, and end on "Next" at the right.
    if (side === "L") {
      const y = Math.round(navBox.top - Math.min(48, gutter));
      pts.push([xL, y], [xR, y]);
    }
    pts.push([xR, endY]);
    marks.push([xR, endY]);
  }

  const segs = route(pts, desktop ? 40 : 0);
  if (!segs.length) {
    return null;
  }
  // On desktop, a moment on the rail beside each chapter heading.
  if (desktop) {
    headings.forEach((y) => {
      const seg = segs.find((s) => !s.flat && s.x0 === s.x1 && Math.min(s.y0, s.y1) <= y && Math.max(s.y0, s.y1) >= y);
      if (seg) {
        marks.push([seg.x0, y]);
      }
    });
  }
  return slice(segs, zones, marks);
}

/* ---------- Geometry ---------- */

/** An orthogonal polyline with rounded corners, as line and quarter-arc segments. */
function route(input: Pt[], radius: number): Seg[] {
  const pts = input.filter((p, i) => i === 0 || Math.hypot(p[0] - input[i - 1][0], p[1] - input[i - 1][1]) > 0.5);
  const segs: Seg[] = [];
  let cur: Pt = pts[0];
  const line = (to: Pt) => {
    const len = Math.hypot(to[0] - cur[0], to[1] - cur[1]);
    if (len > 0.1) {
      segs.push({ d: `L${r1(to[0])} ${r1(to[1])}`, x0: cur[0], y0: cur[1], x1: to[0], y1: to[1], len, flat: Math.abs(to[1] - cur[1]) < 0.5 });
    }
    cur = to;
  };
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[i + 1];
    if (!next) {
      line(p);
      break;
    }
    const inLen = Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const outLen = Math.hypot(next[0] - p[0], next[1] - p[1]);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    if (r < 1) {
      line(p);
      continue;
    }
    const din: Pt = [(p[0] - pts[i - 1][0]) / inLen, (p[1] - pts[i - 1][1]) / inLen];
    const dout: Pt = [(next[0] - p[0]) / outLen, (next[1] - p[1]) / outLen];
    line([p[0] - din[0] * r, p[1] - din[1] * r]);
    const to: Pt = [p[0] + dout[0] * r, p[1] + dout[1] * r];
    const sweep = din[0] * dout[1] - din[1] * dout[0] > 0 ? 1 : 0;
    segs.push({ d: `A${r1(r)} ${r1(r)} 0 0 ${sweep} ${r1(to[0])} ${r1(to[1])}`, x0: cur[0], y0: cur[1], x1: to[0], y1: to[1], len: (Math.PI * r) / 2, flat: false });
    cur = to;
  }
  return segs;
}

/** Split the route into colour zones and build the scroll → length keys. */
function slice(segs: Seg[], zones: Zone[], marks: Pt[]) {
  const zoneOf = (y: number) => {
    let color = zones[0].color;
    for (const z of zones) {
      if (y >= z.top) {
        color = z.color;
      }
    }
    return color;
  };

  // Split vertical lines where they cross a zone edge.
  const parts: Seg[] = [];
  for (const s of segs) {
    const edges = zones
      .map((z) => z.top)
      .filter((t) => s.d.startsWith("L") && !s.flat && t > Math.min(s.y0, s.y1) + 1 && t < Math.max(s.y0, s.y1) - 1)
      .sort((a, b) => a - b);
    if (!edges.length) {
      parts.push(s);
      continue;
    }
    let y0 = s.y0;
    for (const t of [...edges, s.y1]) {
      parts.push({ ...s, d: `L${r1(s.x1)} ${r1(t)}`, y0, y1: t, len: Math.abs(t - y0) });
      y0 = t;
    }
  }

  const pieces: Piece[] = [];
  const keys: [number, number][] = [];
  let at = 0;
  for (const s of parts) {
    const color = zoneOf((s.y0 + s.y1) / 2);
    const last = pieces[pieces.length - 1];
    if (last && last.color === color) {
      last.d += s.d;
      last.len += s.len;
    } else {
      pieces.push({ d: `M${r1(s.x0)} ${r1(s.y0)}${s.d}`, color, start: at, len: s.len });
    }
    // A crossing draws over a short stretch of scroll just before its height.
    const lead = s.flat ? Math.min(220, Math.max(60, s.len * 0.25)) : 0;
    keys.push([s.y0 - lead, at]);
    at += s.len;
    keys.push([s.y1, at]);
  }
  // Keep triggers in order: a crossing pulls the stretch before it forward.
  for (let i = keys.length - 2; i >= 0; i--) {
    keys[i][0] = Math.min(keys[i][0], keys[i + 1][0]);
  }

  const nodes: Node[] = marks.map(([x, y]) => {
    let best = 0;
    let bestD = Infinity;
    let run = 0;
    for (const s of parts) {
      for (const [px, py, l] of [[s.x0, s.y0, run], [s.x1, s.y1, run + s.len]]) {
        const d = Math.hypot(px - x, py - y);
        if (d < bestD) {
          bestD = d;
          best = l;
        }
      }
      // On a vertical rail the point may sit inside a segment.
      if (!s.flat && Math.abs(s.x0 - x) < 1 && y > Math.min(s.y0, s.y1) && y < Math.max(s.y0, s.y1)) {
        best = run + Math.abs(y - s.y0);
        bestD = 0;
      }
      run += s.len;
    }
    return { x, y, at: best, color: zoneOf(y) };
  });

  return { pieces, nodes, keys, total: at };
}

function lookup(keys: [number, number][], y: number) {
  if (y <= keys[0][0]) {
    return keys[0][1];
  }
  for (let i = 1; i < keys.length; i++) {
    const [t1, l1] = keys[i];
    if (y <= t1) {
      const [t0, l0] = keys[i - 1];
      return t1 === t0 ? l1 : l0 + ((y - t0) / (t1 - t0)) * (l1 - l0);
    }
  }
  return keys[keys.length - 1][1];
}

function r1(n: number) {
  return Math.round(n * 10) / 10;
}
