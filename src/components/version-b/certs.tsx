"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { Reveal } from "./reveal";

const previewable = certificates.filter((item) => item.image);

function meta(item: Certificate) {
  return item.completed
    ? `${item.organisation}, ${item.completed}`
    : item.organisation;
}

export function VersionBCerts() {
  const [hover, setHover] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  const openIndex = previewable.findIndex((item) => item.id === openId);
  const current = openIndex >= 0 ? previewable[openIndex] : null;

  useEffect(() => {
    const node = dialog.current;
    if (!node) {
      return;
    }
    if (openId && !node.open) {
      node.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!openId && node.open) {
      node.close();
    }
    if (!openId) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  // Keep the "1 of N" counter in step with the swipe row on phones.
  useEffect(() => {
    const track = rail.current;
    if (!track) {
      return;
    }
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSlide(slides.indexOf(entry.target as HTMLElement));
          }
        });
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function step(direction: 1 | -1) {
    const next =
      previewable[
        (openIndex + direction + previewable.length) % previewable.length
      ];
    setOpenId(next.id);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") {
      step(1);
    }
    if (event.key === "ArrowLeft") {
      step(-1);
    }
  }

  return (
    <section id="certifications" className="vb-cf" aria-labelledby="cf-title">
      <div className="vb-cf-side">
        <Reveal>
          <p className="vb-kicker">05 / Certifications</p>
          <h2 id="cf-title" className="vb-cf-title">
            Beyond the classroom.
          </h2>
        </Reveal>

        <ol className="vb-cf-index">
          {certificates.map((item) => (
            <li key={item.id} data-active={hover === item.id}>
              {item.image ? (
                <button
                  type="button"
                  className="vb-cf-row"
                  onMouseEnter={() => setHover(item.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(item.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setOpenId(item.id)}
                >
                  <span className="vb-cf-num">{item.id}</span>
                  <span className="vb-cf-text">
                    <span className="vb-cf-name">{item.name}</span>
                    <span className="vb-cf-meta">{meta(item)}</span>
                    {item.note ? (
                      <span className="vb-cf-note">{item.note}</span>
                    ) : null}
                  </span>
                  <span className="vb-cf-open" aria-hidden="true">
                    View
                  </span>
                </button>
              ) : (
                <div className="vb-cf-row vb-cf-row-static">
                  <span className="vb-cf-num">{item.id}</span>
                  <span className="vb-cf-text">
                    <span className="vb-cf-name">{item.name}</span>
                    <span className="vb-cf-meta">{meta(item)}</span>
                    {item.note ? (
                      <span className="vb-cf-note">{item.note}</span>
                    ) : null}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <p className="vb-cf-aside">
          Separately, I volunteered at the Language Intelligence Conference
          2026, held at the Saudi Cultural Bureau in London. There is no
          certificate for this.
        </p>
      </div>

      <div className="vb-cf-stage" data-hover={hover ? "true" : undefined}>
        {previewable.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`vb-cf-sheet vb-cf-s${index + 1}`}
            data-active={hover === item.id}
            aria-label={`Open certificate: ${item.name}`}
            onMouseEnter={() => setHover(item.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(item.id)}
            onBlur={() => setHover(null)}
            onClick={() => setOpenId(item.id)}
          >
            {item.image ? (
              <Image
                src={item.image.src}
                alt=""
                width={item.image.width}
                height={item.image.height}
                sizes="(max-width: 900px) 0px, 440px"
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="vb-cf-phone">
        <div ref={rail} className="vb-cf-rail">
          {previewable.map((item) => (
            <figure key={item.id} data-slide="" className="vb-cf-slide">
              <button
                type="button"
                className="vb-cf-slide-open"
                aria-label={`Open certificate: ${item.name}`}
                onClick={() => setOpenId(item.id)}
              >
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt=""
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(max-width: 900px) 82vw, 0px"
                  />
                ) : null}
              </button>
              <figcaption>
                <span className="vb-cf-name">{item.name}</span>
                <span className="vb-cf-meta">{meta(item)}</span>
                {item.note ? (
                  <span className="vb-cf-note">{item.note}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="vb-cf-count" aria-hidden="true">
          {slide + 1} of {previewable.length}
        </p>
      </div>

      <dialog
        ref={dialog}
        className="vb-cf-dialog"
        aria-labelledby="cf-dialog-title"
        onClose={() => setOpenId(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setOpenId(null);
          }
        }}
      >
        {current && current.image ? (
          <div className="vb-cf-dialog-body">
            <header className="vb-cf-dialog-head">
              <div>
                <h3 id="cf-dialog-title">{current.name}</h3>
                <p>{meta(current)}</p>
              </div>
              <button
                type="button"
                className="vb-cf-close"
                onClick={() => setOpenId(null)}
              >
                Close
              </button>
            </header>
            <Image
              key={current.id}
              src={current.image.src}
              alt={`Certificate: ${current.name}, ${meta(current)}`}
              width={current.image.width}
              height={current.image.height}
              sizes="(max-width: 900px) 94vw, 1000px"
              className="vb-cf-full"
            />
            <footer className="vb-cf-dialog-foot">
              <div className="vb-cf-step">
                <button type="button" onClick={() => step(-1)}>
                  Previous
                </button>
                <span aria-hidden="true">
                  {openIndex + 1} of {previewable.length}
                </span>
                <button type="button" onClick={() => step(1)}>
                  Next
                </button>
              </div>
              {current.href ? (
                <a href={current.href} target="_blank" rel="noreferrer">
                  {current.href.endsWith(".pdf")
                    ? "Open the original PDF"
                    : "Open the image in a new tab"}
                </a>
              ) : null}
            </footer>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
