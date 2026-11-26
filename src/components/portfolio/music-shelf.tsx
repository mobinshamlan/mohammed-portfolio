import Image from "next/image";
import { artists } from "@/lib/music";

const tones = ["paper", "rose", "ink", "blue"] as const;

export function MusicShelf() {
  return (
    <ul className="vb-mu-shelf" role="list" aria-label="Favourite artists">
      {artists.map((artist, index) => (
        <li key={artist.name} className="vb-mu-disc" data-tone={tones[index % tones.length]}>
          <span className="vb-mu-vinyl" aria-hidden="true">
            {artist.image ? (
              <Image src={artist.image.src} alt="" fill sizes="112px" className="vb-mu-photo" />
            ) : null}
          </span>
          <span className="vb-mu-name">{artist.name}</span>
        </li>
      ))}
    </ul>
  );
}
