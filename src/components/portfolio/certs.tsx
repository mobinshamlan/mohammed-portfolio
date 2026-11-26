"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { useHydrated } from "@/lib/use-hydrated";

// The Eid volunteering certificate sits with the London story.
const listed = certificates.filter((item) => item.id !== "05");
const featured = listed.find((item) => item.id === "04");
const more = listed.filter((item) => item !== featured);
const previewable = [...(featured ? [featured] : []), ...more].filter((item) => item.image);

const plainNames: Record<string, string> = {
  "01": "Website-building practice project",
  "02": "Software development practice project",
  "03": "Finding and evaluating sources",
  "04": "Designing how apps look and work",
};

function meta(item: Certificate) {
  return item.completed ? `${item.organisation} · ${item.completed}` : item.organisation;
}

function CertificateLink({
  item,
  hydrated,
  onOpen,
}: {
  item: Certificate;
  hydrated: boolean;
  onOpen: (item: Certificate, from: HTMLElement) => void;
}) {
  const file = item.href ?? item.image?.src;
  const label = (
    <>
      {item.image ? (
        <span className="vb-cert-thumb" aria-hidden="true">
          <Image
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            sizes="(min-width: 900px) 8rem, 4.5rem"
          />
        </span>
      ) : null}
      <span className="vb-cert-text">
        <span className="vb-cert-name">{plainNames[item.id] ?? item.name}</span>
        <span className="vb-cert-issuer">{meta(item)}</span>
      </span>
    </>
  );

  if (hydrated && item.image) {
    return (
      <button
        type="button"
        className="vb-cert"
        aria-haspopup="dialog"
        onClick={(event) => onOpen(item, event.currentTarget)}
      >
        {label}
        <span className="vb-cert-arrow" aria-hidden="true" />
      </button>
    );
  }
  if (file) {
    return (
      <a href={file} className="vb-cert" target="_blank" rel="noreferrer">
        {label}
        <span className="vb-cert-arrow" aria-hidden="true" />
        <span className="vb-sr"> (opens in a new tab)</span>
      </a>
    );
  }
  return <div className="vb-cert">{label}</div>;
}

export function Certs() {
  const hydrated = useHydrated();
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const openIndex = previewable.findIndex((item) => item.id === openId);
  const current = previewable[openIndex];
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
    const next =
      previewable[(openIndex + direction + previewable.length) % previewable.length];
    setOpenId(next.id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  return (
    <section id="certificates" className="vb-certs vb-certs-compact" aria-labelledby="certs-title">
      <h2 id="certs-title" className="vb-certs-title">Courses and certificates.</h2>
      <div className="vb-certs-archive">
        {featured ? (
          <div className="vb-certs-feature">
            <CertificateLink item={featured} hydrated={hydrated} onOpen={open} />
          </div>
        ) : null}
        <details className="vb-certs-more">
          <summary className="vb-certs-more-summary">
            {more.length} more certificates
          </summary>
          <ul className="vb-certs-rows">
            {more.map((item) => (
              <li key={item.id}>
                <CertificateLink item={item} hydrated={hydrated} onOpen={open} />
              </li>
            ))}
          </ul>
        </details>
      </div>

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
                <span aria-hidden="true">{openIndex + 1} of {previewable.length}</span>
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
