"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { keepDialogTab } from "@/lib/dialog";
import { useHydrated } from "@/lib/use-hydrated";

/*
 * Courses and certificates: a frame wall. Four certificates hang from one
 * picture rail on a deep green wall, each in a cream mat with a small wall
 * label beneath it. Picking a frame opens the full document in the dialog.
 * The wall holds courses and job simulations.
 */

const listed = certificates.filter((item) => item.id !== "05" && item.image);
// Newest first, so the most recent course hangs first.
const frames = [...listed].reverse();

const plain: Record<string, { title: string; what: string }> = {
  "01": { title: "Building a website", what: "Practice project" },
  "02": { title: "Software development", what: "Practice project" },
  "03": { title: "Finding reliable sources", what: "University course" },
  "04": { title: "App interface design", what: "UX/UI course" },
};

function Frame({
  item,
  hydrated,
  onOpen,
}: {
  item: Certificate;
  hydrated: boolean;
  onOpen: (item: Certificate, from: HTMLElement) => void;
}) {
  const image = item.image;
  if (!image) return null;
  const copy = plain[item.id] ?? { title: item.name, what: "Certificate" };
  const body = (
    <>
      <span className="vb-frame-cord" aria-hidden="true" />
      <span className="vb-frame-glass" aria-hidden="true">
        <span className="vb-frame-mat">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 22vw, 46vw"
          />
        </span>
      </span>
      <span className="vb-frame-label">
        <span className="vb-frame-title">{copy.title}</span>
        <span className="vb-frame-meta">
          {copy.what} · {item.organisation}
        </span>
      </span>
    </>
  );

  if (hydrated) {
    return (
      <button
        type="button"
        className="vb-frame"
        aria-haspopup="dialog"
        onClick={(event) => onOpen(item, event.currentTarget)}
      >
        {body}
      </button>
    );
  }
  const file = item.href ?? image.src;
  return (
    <a href={file} className="vb-frame" target="_blank" rel="noreferrer">
      {body}
      <span className="vb-sr"> (opens in a new tab)</span>
    </a>
  );
}

export function Certs() {
  const hydrated = useHydrated();
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const openIndex = frames.findIndex((item) => item.id === openId);
  const current = frames[openIndex];
  const isOpen = Boolean(current);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    if (isOpen && !node.open) node.showModal();
    if (!isOpen && node.open) node.close();
  }, [isOpen]);

  function open(item: Certificate, from: HTMLElement) {
    opener.current = from;
    setOpenId(item.id);
  }

  function step(direction: 1 | -1) {
    const next = frames[(openIndex + direction + frames.length) % frames.length];
    setOpenId(next.id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    keepDialogTab(event);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  return (
    <section id="certificates" className="vb-certs vb-certs-wall" aria-labelledby="certs-title">
      <div className="vb-certs-head">
        <h2 id="certs-title" className="vb-certs-title">Courses and certificates</h2>
      </div>
      <ul className="vb-certs-frames" aria-label="Certificates">
        {frames.map((item) => (
          <li key={item.id} className="vb-certs-slot">
            <Frame item={item} hydrated={hydrated} onOpen={open} />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="vb-dialog"
        aria-labelledby="certs-dialog-title"
        onClose={() => {
          setOpenId(null);
          opener.current?.focus();
        }}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpenId(null);
        }}
      >
        {current?.image ? (
          <div className="vb-dialog-body">
            <header className="vb-dialog-head">
              <div>
                <h3 id="certs-dialog-title">{current.name}</h3>
                <p>{current.organisation}</p>
              </div>
              <button
                type="button"
                className="vb-btn vb-btn-quiet"
                onClick={() => setOpenId(null)}
              >
                Close
              </button>
            </header>
            <Image
              key={current.id}
              src={current.image.src}
              alt={`Certificate: ${current.name}, ${current.organisation}`}
              width={current.image.width}
              height={current.image.height}
              sizes="(max-width: 900px) 94vw, 1000px"
              className="vb-dialog-img"
            />
            <footer className="vb-dialog-foot">
              <div className="vb-dialog-step">
                <button type="button" onClick={() => step(-1)}>Previous</button>
                <span role="status">
                  {openIndex + 1} of {frames.length}
                  <span className="vb-sr">: {current.name}</span>
                </span>
                <button type="button" onClick={() => step(1)}>Next</button>
              </div>
              {current.href ? (
                <a href={current.href} target="_blank" rel="noreferrer">
                  {current.href.endsWith(".pdf") ? "Open original PDF" : "Open original image"}
                  <span className="vb-sr"> (opens in a new tab)</span>
                </a>
              ) : null}
            </footer>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
