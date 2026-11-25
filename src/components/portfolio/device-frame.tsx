import Image from "next/image";
import type { Shot } from "@/lib/projects";

/**
 * A screenshot in a drawn device: a browser window or a phone. Flat shapes,
 * square corners on the window, rounded on the phone; the picture carries the colour.
 */
export function DeviceFrame({
  shot,
  sizes,
  priority = false,
  className = "",
  label,
  plate = false,
}: {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** A URL or caption to print in the browser bar. */
  label?: string;
  /** Show a browser screenshot standing behind a dune at night, with no window chrome. */
  plate?: boolean;
}) {
  if (shot.frame === "phone") {
    return (
      <figure className={`vb-phone ${className}`} data-ui="">
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes={sizes}
          priority={priority}
          className="vb-phone-img"
        />
        {shot.caption ? (
          <figcaption className="vb-frame-cap">{shot.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  if (plate) {
    return (
      <figure className={`vb-plate ${className}`} data-ui="">
        <span className="vb-plate-sky">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes={sizes}
            priority={priority}
            className="vb-plate-img"
          />
        </span>
        {shot.caption || label ? (
          <figcaption className="vb-frame-cap">
            {label ? <span className="vb-plate-where">{label}</span> : null}
            {shot.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={`vb-window ${className}`} data-ui="">
      <span className="vb-window-bar" aria-hidden="true">
        <span className="vb-window-dots" />
        {label ? <span className="vb-window-url">{label}</span> : null}
      </span>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        priority={priority}
        className="vb-window-img"
      />
      {shot.caption ? (
        <figcaption className="vb-frame-cap">{shot.caption}</figcaption>
      ) : null}
    </figure>
  );
}
