"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { ImageReveal } from "./reveal";

type PhoneShotProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  expandable?: boolean;
  width?: number;
  height?: number;
  variant?: "phone" | "card";
};

export function PhoneShot({
  src,
  alt,
  caption,
  className = "",
  sizes = "(max-width: 700px) 42vw, 180px",
  priority = false,
  expandable = true,
  width = 455,
  height = 952,
  variant = "phone",
}: PhoneShotProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const card = variant === "card";

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className="vb-shot-img"
    />
  );

  return (
    <>
      <figure className={`vb-shot ${card ? "vb-card-shot" : ""} ${className}`}>
        <ImageReveal>
          {expandable ? (
            <button
              type="button"
              className="vb-shot-open"
              onClick={() => setOpen(true)}
              aria-label={`Enlarge screenshot${caption ? `: ${caption}` : ""}`}
            >
              {image}
            </button>
          ) : (
            image
          )}
        </ImageReveal>
        {caption ? <figcaption className="vb-shot-cap">{caption}</figcaption> : null}
      </figure>

      {open ? (
        <div
          className="vb-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <p id={titleId} className="vb-lightbox-title">
            {caption ?? "Screenshot"}
          </p>
          <button
            type="button"
            className="vb-lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}
          >
            Close
          </button>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`vb-lightbox-img${card ? " vb-lightbox-card" : ""}`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
