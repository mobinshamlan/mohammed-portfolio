"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { artists } from "@/lib/music";
import { useHydrated } from "@/lib/use-hydrated";

const tones = ["paper", "rose", "ink", "beige"] as const;

/** The artists as a strip of records. Pick one to set it spinning. */
export function MusicShelf() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const discs = useRef<(HTMLButtonElement | null)[]>([]);
  const hydrated = useHydrated();

  function move(to: number) {
    const next = Math.max(0, Math.min(artists.length - 1, to));
    setFocus(next);
    discs.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: artists.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      move(moves[event.key]);
    }
  }

  return (
    <div className="vb-mu" role="group" aria-label="Favourite artists">
      <ul className="vb-mu-shelf">
        {artists.map((artist, index) => (
          <li
            key={artist.name}
            className="vb-mu-slot"
            style={{ "--i": index } as React.CSSProperties}
          >
            {hydrated ? (
              <button
                ref={(node) => {
                  discs.current[index] = node;
                }}
                type="button"
                className="vb-mu-disc"
                data-tone={tones[index % tones.length]}
                data-photo={artist.image ? "true" : undefined}
                data-playing={playing === index}
                aria-pressed={playing === index}
                tabIndex={focus === index ? 0 : -1}
                onFocus={() => setFocus(index)}
                onClick={() => setPlaying(playing === index ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {artist.image ? (
                  <Image src={artist.image.src} alt="" fill sizes="88px" className="vb-mu-photo" />
                ) : null}
                <span className="vb-mu-sheen" aria-hidden="true" />
                <span className="vb-mu-name">{artist.name}</span>
              </button>
            ) : (
              <span
                className="vb-mu-disc"
                data-tone={tones[index % tones.length]}
                data-photo={artist.image ? "true" : undefined}
              >
                {artist.image ? (
                  <Image src={artist.image.src} alt="" fill sizes="88px" className="vb-mu-photo" />
                ) : null}
                <span className="vb-mu-sheen" aria-hidden="true" />
                <span className="vb-mu-name">{artist.name}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
