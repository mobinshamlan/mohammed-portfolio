"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { useHydrated } from "@/lib/use-hydrated";

/*
 * Courses and certificates: four sheets of paper laid on a cream desk. Each
 * sheet is the real page-one of the certificate, large enough to recognise,
 * and opens the full document in the dialog. The Eid volunteering certificate
 * sits with the London story, so it is not listed here.
 */

const listed = certificates.filter((item) => item.id !== "05" && item.image);
// Newest first, so the most recent course leads the desk.
const sheets = [...listed].reverse();

const plain: Record<string, { title: string; what: string }> = {
  "01": { title: "Building a website", what: "Practice project" },
  "02": { title: "Software development", what: "Practice project" },
  "03": { title: "Finding and judging sources", what: "University course" },
  "04": { title: "Designing how apps look and work", what: "UX/UI course" },
};

function meta(item: Certificate) {
  return item.completed ? `${item.organisation} · ${item.completed}` : item.organisation;
}

function Sheet({
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
      <span className="vb-sheet-paper" aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          sizes="(min-width: 1100px) 22vw, (min-width: 640px) 44vw, 46vw"
        />
      </span>
      <span className="vb-sheet-text">
        <span className="vb-sheet-what">{copy.what}</span>
        <span className="vb-sheet-title">{copy.title}</span>
        <span className="vb-sheet-meta">{meta(item)}</span>
        <span className="vb-sheet-open">
          Open certificate
          <span aria-hidden="true"> →</span>
        </span>
      </span>
    </>
  );

  if (hydrated) {
    return (
      <button
        type="button"
        className="vb-sheet"
        aria-haspopup="dialog"
        aria-label={`Open certificate: ${copy.title}, ${meta(item)}`}
        onClick={(event) => onOpen(item, event.currentTarget)}
      >
        {body}
      </button>
    );
  }
  const file = item.href ?? image.src;
  return (
    <a href={file} className="vb-sheet" target="_blank" rel="noreferrer">
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

  const openIndex = sheets.findIndex((item) => item.id === openId);
  const current = sheets[openIndex];
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
    const next = sheets[(openIndex + direction + sheets.length) % sheets.length];
    setOpenId(next.id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  return (
    <section id="certificates" className="vb-certs vb-certs-desk" aria-labelledby="certs-title">
      <div className="vb-certs-head">
        <h2 id="certs-title" className="vb-certs-title">Courses and certificates.</h2>
        <p className="vb-certs-lead">
          Four short courses beside the degree. Tap a sheet to read the original.
        </p>
      </div>
      <ul className="vb-certs-desktop" aria-label="Certificates">
        {sheets.map((item, index) => (
          <li key={item.id} className="vb-certs-slot" style={{ "--n": index } as React.CSSProperties}>
            <Sheet item={item} hydrated={hydrated} onOpen={open} />
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
              <div aria-live="polite">
                <h3 id="certs-dialog-title">{current.name}</h3>
                <p>{meta(current)}</p>
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
              alt={`Certificate: ${current.name}, ${meta(current)}`}
              width={current.image.width}
              height={current.image.height}
              sizes="(max-width: 900px) 94vw, 1000px"
              className="vb-dialog-img"
            />
            <footer className="vb-dialog-foot">
              <div className="vb-dialog-step">
                <button type="button" onClick={() => step(-1)}>Previous</button>
                <span aria-hidden="true">{openIndex + 1} of {sheets.length}</span>
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
