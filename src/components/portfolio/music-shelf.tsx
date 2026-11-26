"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { artists, type Artist } from "@/lib/music";
import { useHydrated } from "@/lib/use-hydrated";

const tones = ["paper", "rose", "ink", "blue"] as const;

function RecordLabel({ artist }: { artist: Artist }) {
  return (
    <>
      <span className="vb-mu-vinyl" aria-hidden="true">
        {artist.image ? (
          <Image src={artist.image.src} alt="" fill sizes="144px" className="vb-mu-photo" />
        ) : null}
      </span>
      <span className="vb-mu-name">{artist.name}</span>
    </>
  );
}

export function MusicShelf() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const discs = useRef<(HTMLButtonElement | null)[]>([]);
  const shelf = useRef<HTMLUListElement>(null);
  const hydrated = useHydrated();

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!shelf.current) return;
    const columns = Number(getComputedStyle(shelf.current).getPropertyValue("--music-columns"));
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index + columns,
      ArrowUp: index - columns,
      Home: 0,
      End: artists.length - 1,
    };
    if (!(event.key in moves)) return;

    event.preventDefault();
    const next = moves[event.key];
    if (next >= 0 && next < artists.length) discs.current[next]?.focus();
  }

  return (
    <ul ref={shelf} className="vb-mu-shelf" role="list" aria-label="Favourite artists">
      {artists.map((artist, index) => (
        <li key={artist.name}>
          {hydrated ? (
            <button
              ref={(node) => {
                discs.current[index] = node;
              }}
              type="button"
              className="vb-mu-disc"
              data-tone={tones[index % tones.length]}
              aria-pressed={playing === index}
              tabIndex={focus === index ? 0 : -1}
              onFocus={() => setFocus(index)}
              onClick={() => setPlaying((current) => current === index ? null : index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <RecordLabel artist={artist} />
            </button>
          ) : (
            <span className="vb-mu-disc" data-tone={tones[index % tones.length]}>
              <RecordLabel artist={artist} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
