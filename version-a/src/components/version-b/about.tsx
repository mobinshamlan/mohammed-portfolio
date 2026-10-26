"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";

type Interest = {
  id: string;
  label: string;
  mark: ReactNode;
  /** Content shown when the interest opens. Wide panels push the others into spines. */
  panel?: ReactNode;
};

// Each mark is a quiet line drawing, not a claim about taste. They draw once
// when the interest opens.
const interests: Interest[] = [
  {
    id: "music",
    label: "Music",
    panel: <MusicShelf />,
    mark: (
      <>
        <path pathLength={1} d="M14 96V64" />
        <path pathLength={1} d="M34 96V34" />
        <path pathLength={1} d="M54 96V52" />
        <path pathLength={1} d="M74 96V20" />
        <path pathLength={1} d="M94 96V58" />
        <path pathLength={1} d="M114 96V76" />
        <path pathLength={1} d="M6 100H122" />
      </>
    ),
  },
  {
    id: "gaming",
    label: "Gaming",
    mark: (
      <>
        <path pathLength={1} d="M10 100H34V80H58V60H82V40H106V20" />
        <path pathLength={1} d="M82 100H118" />
        <rect pathLength={1} x="96" y="6" width="14" height="14" />
      </>
    ),
  },
  {
    id: "photography",
    label: "Photo\u00adgraphy",
    mark: (
      <>
        <path pathLength={1} d="M10 34V10H34" />
        <path pathLength={1} d="M94 10H118V34" />
        <path pathLength={1} d="M118 78V102H94" />
        <path pathLength={1} d="M34 102H10V78" />
        <circle pathLength={1} cx="64" cy="56" r="18" />
        <path pathLength={1} d="M64 44V68M52 56H76" />
      </>
    ),
  },
  {
    id: "fashion",
    label: "Fashion",
    mark: (
      <>
        <circle pathLength={1} cx="64" cy="56" r="34" />
        <circle pathLength={1} cx="64" cy="56" r="22" />
        <path pathLength={1} d="M56 48h.01M72 48h.01M56 64h.01M72 64h.01" />
        <path
          pathLength={1}

          d="M6 100C30 84 46 112 64 100S98 84 122 100"
        />
      </>
    ),
  },
  {
    id: "design",
    label: "Creative design",
    mark: (
      <>
        <path pathLength={1} d="M14 90C30 10 90 110 112 24" />
        <path pathLength={1} d="M14 90L40 40M112 24L88 76" />
        <rect pathLength={1} x="9" y="85" width="10" height="10" />
        <rect pathLength={1} x="107" y="19" width="10" height="10" />
        <circle pathLength={1} cx="40" cy="40" r="4" />
        <circle pathLength={1} cx="88" cy="76" r="4" />
      </>
    ),
  },
];

export function VersionBAbout() {
  const [open, setOpen] = useState<string | null>(null);
  const lastPointer = useRef("mouse");
  const panelId = useId();
  const wide = interests.some((item) => item.id === open && item.panel);

  return (
    <section id="about" className="vb-ab" aria-labelledby="about-title">
      <Reveal>
        <p className="vb-kicker">02 / About</p>
        <h2 id="about-title" className="vb-ab-sr">
          About
        </h2>
        <p className="vb-ab-statement">
          Mohammed Bin Shamlan is a software developer exploring AI engineering.
        </p>
      </Reveal>

      <div className="vb-ab-body">
        <Reveal className="vb-ab-copy" delay={0.08}>
          <p>
            He studied computer science and is interested in making useful
            digital products through software, creativity, and emerging
            technologies.
          </p>
          <p>
            Outside of code: music, gaming, photography, and an eye for fashion
            and creative design.
          </p>
          <p className="vb-ab-community">
            Since 2026 he has volunteered at community events run by the
            Cultural Bureau of the Royal Embassy of Saudi Arabia in London,
            helping with guest registration and logistics.
          </p>
        </Reveal>

        <ul
          className="vb-ab-index"
          data-wide={wide || undefined}
          onMouseLeave={() => setOpen(null)}
        >
          {interests.map((item) => {
            const isOpen = open === item.id;
            return (
              <li
                key={item.id}
                className="vb-ab-item"
                data-open={isOpen}
                data-wide={item.panel ? "true" : undefined}
              >
                <button
                  type="button"
                  className="vb-ab-trigger"
                  aria-expanded={isOpen}
                  aria-controls={
                    item.panel ? `${panelId}-${item.id}` : undefined
                  }
                  onPointerDown={(event) => {
                    lastPointer.current = event.pointerType;
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      setOpen(item.id);
                    }
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) {
                      setOpen(item.id);
                    }
                  }}
                  onClick={(event) => {
                    // A mouse click confirms what hovering already opened.
                    const fromMouse =
                      lastPointer.current === "mouse" && event.detail > 0;
                    setOpen(fromMouse ? item.id : isOpen ? null : item.id);
                  }}
                >
                  <span className="vb-ab-name">{item.label}</span>
                  <svg
                    className="vb-ab-mark"
                    viewBox="0 0 128 112"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {item.mark}
                  </svg>
                </button>
                {item.panel ? (
                  <div
                    id={`${panelId}-${item.id}`}
                    className="vb-ab-panel"
                    hidden={!isOpen}
                  >
                    {item.panel}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
