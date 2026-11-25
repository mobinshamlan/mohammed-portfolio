"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { appPath, publicUrl } from "@/lib/site";

type Side = "a" | "b";

type Shot = { src: string; width: number; height: number };

type Version = {
  side: Side;
  href: string;
  kicker: string;
  title: string;
  blurb: string;
  cta: string;
  desktop: Shot;
  mobile: Shot;
};

const versions: Version[] = [
  {
    side: "a",
    href: "/version-a",
    kicker: "Version A",
    title: "The first draft.",
    blurb: "Built from a single, simple prompt, and kept exactly as it came out.",
    cta: "Open Version A",
    desktop: {
      src: publicUrl("/images/landing/a-desktop.jpg"),
      width: 800,
      height: 2137,
    },
    mobile: {
      src: publicUrl("/images/landing/a-mobile.jpg"),
      width: 300,
      height: 3275,
    },
  },
  {
    side: "b",
    href: "/",
    kicker: "Version B",
    title: "The portfolio you came from.",
    blurb:
      "Built through structured prompts, a design direction and rounds of refinement. It is now the site itself.",
    cta: "Open Version B",
    desktop: {
      src: publicUrl("/images/landing/b-desktop.jpg"),
      width: 800,
      height: 3333,
    },
    mobile: {
      src: publicUrl("/images/landing/b-mobile.jpg"),
      width: 300,
      height: 4615,
    },
  },
];

type Leaving = {
  side: Side;
  href: string;
  src: string;
  view: DOMRect;
  image: DOMRect;
  go: boolean;
};

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Eases a window's tilt and page scroll toward the pointer. */
function useTilt(ref: React.RefObject<HTMLElement | null>) {
  const target = useRef({ x: 0, y: 0, scrub: 0 });
  const current = useRef({ x: 0, y: 0, scrub: 0 });
  const frame = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  function loop() {
    const node = ref.current;
    if (!node) {
      return;
    }
    const t = target.current;
    const c = current.current;
    const still = reduced.current;
    c.x += (t.x - c.x) * (still ? 0 : 0.1);
    c.y += (t.y - c.y) * (still ? 0 : 0.1);
    c.scrub += (t.scrub - c.scrub) * (still ? 1 : 0.08);
    node.style.setProperty("--ry", `${c.x * 7}deg`);
    node.style.setProperty("--rx", `${-c.y * 5}deg`);
    node.style.setProperty("--scrub", c.scrub.toFixed(4));
    const settled = still
      ? true
      : Math.abs(t.x - c.x) +
          Math.abs(t.y - c.y) +
          Math.abs(t.scrub - c.scrub) <
        0.002;
    frame.current = settled ? 0 : requestAnimationFrame(loop);
  }

  function aim(x: number, y: number, scrub: number) {
    target.current = reduced.current ? { x: 0, y: 0, scrub } : { x, y, scrub };
    if (!frame.current) {
      frame.current = requestAnimationFrame(loop);
    }
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return aim;
}

function Showcase({
  version,
  hovered,
  onHover,
  onOpen,
}: {
  version: Version;
  hovered: Side | null;
  onHover: (side: Side | null) => void;
  onOpen: (
    event: React.MouseEvent,
    version: Version,
    window: HTMLElement,
  ) => void;
}) {
  const window = useRef<HTMLAnchorElement>(null);
  const aim = useTilt(window);
  const { side } = version;

  // Phones have no pointer, so each frame scrolls its page once as it arrives.
  useEffect(() => {
    const node = window.current;
    if (!node || !globalThis.matchMedia("(max-width: 759px)").matches) {
      return;
    }
    if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aim(0, 0, side === "b" ? 0.5 : 0.35);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [aim, side]);

  function move(event: React.PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    aim(x - 0.5, y - 0.5, Math.min(1, Math.max(0, y)));
    onHover(side);
  }

  function leave() {
    aim(0, 0, 0);
    onHover(null);
  }

  return (
    <article
      className={`vl-cell vl-cell-${side}`}
      data-hover={hovered === side}
    >
      <Link
        ref={window}
        href={version.href}
        className={`vl-win vl-win-${side}`}
        tabIndex={-1}
        aria-hidden="true"
        onPointerMove={move}
        onPointerLeave={leave}
        onClick={(event) => onOpen(event, version, event.currentTarget)}
      >
        <span className="vl-win-bar">
          <span className="vl-win-dots" aria-hidden="true" />
          <span className="vl-win-url">{version.href}</span>
        </span>
        <span className="vl-win-view">
          {/* One picture per version: the browser downloads only the variant it shows. */}
          <picture>
            <source media="(max-width: 759px)" srcSet={version.mobile.src} />
            <img
              src={version.desktop.src}
              alt=""
              width={version.desktop.width}
              height={version.desktop.height}
              className="vl-shot"
              decoding="async"
            />
          </picture>
        </span>
      </Link>

      <div className="vl-label">
        <p className="vl-kicker">{version.kicker}</p>
        <h2 className="vl-label-title">{version.title}</h2>
        <p className="vl-label-blurb">{version.blurb}</p>
        <Link
          href={version.href}
          className="vl-cta"
          onFocus={() => {
            onHover(side);
            aim(0, 0, 0.3);
          }}
          onBlur={() => {
            onHover(null);
            aim(0, 0, 0);
          }}
          onClick={(event) => {
            const node = window.current;
            if (node) {
              onOpen(event, version, node);
            }
          }}
        >
          {version.cta} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

const milestones = [
  {
    title: "A design brief",
    text: "Palette, type and an editorial direction, set before anything was built.",
  },
  {
    title: "Selected work",
    text: "Projects as an index and a stage, not a list.",
  },
  {
    title: "Case studies",
    text: "Each product told with its own screens, the decision that shaped it, and working links.",
  },
  {
    title: "A redesign",
    text: "A desert-night identity, Arabic names set right to left, and six products added as they were built.",
  },
  {
    title: "The route",
    text: "Education as a journey from Saudi Arabia to Brighton, London and back home.",
  },
  {
    title: "The details",
    text: "Skills with evidence, certificates as documents, a contact form with real states.",
  },
];

function Evolution() {
  const root = useRef<HTMLElement>(null);
  // null until hydration: the milestones show by default and animate only once JS can reveal them.
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (node.getBoundingClientRect().top < window.innerHeight) {
      return;
    }
    setSeen(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      className="vl-ev"
      data-seen={seen === null ? undefined : seen}
      aria-labelledby="ev-title"
    >
      <div className="vl-ev-head">
        <p className="vl-kicker">How they evolved</p>
        <h2 id="ev-title" className="vl-ev-title">
          One prompt. Then a process.
        </h2>
      </div>

      <div className="vl-lane vl-lane-a">
        <p className="vl-lane-name">Version A</p>
        <div className="vl-track">
          <span className="vl-line vl-line-a" aria-hidden="true" />
          <div className="vl-step" style={{ "--i": 0 } as Vars}>
            <span className="vl-dot" aria-hidden="true" />
            <h3>One prompt, one pass</h3>
            <p>
              A complete portfolio in a single go: About, Education, Skills,
              Projects, Interests and Contact.
            </p>
          </div>
        </div>
      </div>

      <div className="vl-lane vl-lane-b">
        <p className="vl-lane-name">Version B</p>
        <ol className="vl-track vl-track-b">
          <li className="vl-line vl-line-b" aria-hidden="true" />
          {milestones.map((item, index) => (
            <li
              key={item.title}
              className="vl-step"
              style={{ "--i": index + 1 } as Vars}
            >
              <span className="vl-dot" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="vl-method">
          Each step followed the same loop: propose a direction, approve it,
          build it, then check it in the browser.
        </p>
      </div>
    </section>
  );
}

export function Landing() {
  const router = useRouter();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<Side | null>(null);
  const [leaving, setLeaving] = useState<Leaving | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);

  // Once the route has changed the curtain has done its job. Clear it, so the
  // back button never finds it still raised.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (appPath(pathname) !== "/experiment" && leaving) {
      setLeaving(null);
    }
  }

  // Warm the full-size previews so the open transition never waits on a download.
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 759px)").matches;
    const warm = () =>
      versions.forEach((version) => {
        const image = new window.Image();
        image.src = publicUrl(phone ? version.mobile.src : version.desktop.src);
      });
    const id = window.setTimeout(warm, 1800);
    return () => window.clearTimeout(id);
  }, []);

  // Coming back from the browser history can restore this page with the curtain still up.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setLeaving(null);
      }
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  useEffect(() => {
    if (!leaving) {
      return;
    }
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setLeaving((state) => (state ? { ...state, go: true } : state)),
      ),
    );
    const timer = window.setTimeout(() => router.push(leaving.href), 580);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [leaving?.href, router]); // eslint-disable-line react-hooks/exhaustive-deps

  function open(event: React.MouseEvent, version: Version, node: HTMLElement) {
    const modified =
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (modified || reduced) {
      return;
    }
    const view = node.querySelector<HTMLElement>(".vl-win-view");
    const shot = node.querySelector<HTMLElement>(".vl-shot");
    if (!view || !shot) {
      return;
    }
    event.preventDefault();
    const mobile = window.matchMedia("(max-width: 759px)").matches;
    setLeaving({
      side: version.side,
      href: version.href,
      src: mobile ? version.mobile.src : version.desktop.src,
      view: view.getBoundingClientRect(),
      image: shot.getBoundingClientRect(),
      go: false,
    });
  }

  const curtainStyle: Vars | undefined = leaving
    ? {
        "--cl": `${leaving.view.left}px`,
        "--ct": `${leaving.view.top}px`,
        "--cr": `${window.innerWidth - leaving.view.right}px`,
        "--cb": `${window.innerHeight - leaving.view.bottom}px`,
        "--il": `${leaving.image.left}px`,
        "--it": `${leaving.image.top}px`,
        "--is": leaving.image.width / window.innerWidth,
      }
    : undefined;

  return (
    <>
      <main className="vl-main">
        <header className="vl-head">
          <p className="vl-eyebrow">
            <Link href="/">Mohammed Bin Shamlan</Link>
            <span>Prompt experiment / 2026</span>
          </p>
          <h1 className="vl-title">
            <span>One brief.</span>
            <span>Two prompts.</span>
          </h1>
          <p className="vl-intro">
            The same portfolio, built twice. Version A came from one simple
            prompt and is kept as it was. Version B came from structured
            prompts, a design direction and rounds of refinement, and became
            the site you arrived from. Open either, or compare both.
          </p>
        </header>

        <div className="vl-stage" data-hover={hovered ?? undefined}>
          {versions.map((version) => (
            <Showcase
              key={version.side}
              version={version}
              hovered={hovered}
              onHover={setHovered}
              onOpen={open}
            />
          ))}
        </div>

        <Evolution />

        <nav className="vl-end" aria-label="Choose a version">
          <p className="vl-kicker">Where to start</p>
          <ul>
            {versions.map((version) => (
              <li key={version.side}>
                <Link href={version.href} className="vl-end-row">
                  <span className="vl-end-name">{version.kicker}</span>
                  <span className="vl-end-title">{version.title}</span>
                  <span className="vl-end-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="vl-foot">
          <p>
            <Link href="/">Mohammed Bin Shamlan</Link>
          </p>
          <p>Prompt experiment / 2026</p>
        </footer>
      </main>

      {leaving ? (
        <div
          className={`vl-curtain vl-curtain-${leaving.side}`}
          data-go={leaving.go}
          style={curtainStyle}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicUrl(leaving.src)} alt="" className="vl-curtain-img" />
        </div>
      ) : null}
    </>
  );
}
