"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { publicUrl } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { Collapsible } from "./collapsible";
import { Reveal } from "./reveal";

const previewable = certificates.filter((item) => item.image);

function meta(item: Certificate) {
  return item.completed
    ? `${item.organisation}, ${item.completed}`
    : item.organisation;
}

/** The file a certificate opens without JavaScript: the PDF, else its preview. */
function fileOf(item: Certificate) {
  return item.href ?? item.image?.src ?? null;
}

export function Certs() {
  const hydrated = useHydrated();
  const [hover, setHover] = useState<string | null>(previewable[0]?.id ?? null);
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const openIndex = previewable.findIndex((item) => item.id === openId);
  const current = openIndex >= 0 ? previewable[openIndex] : null;
  const shown = previewable.find((item) => item.id === hover) ?? previewable[0];

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

  function step(direction: 1 | -1) {
    const next =
      previewable[(openIndex + direction + previewable.length) % previewable.length];
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
    <section id="certificates" className="vb-certs" aria-labelledby="certs-title">
      <div className="vb-certs-side">
        <Reveal>
          <h2 id="certs-title" className="vb-section-head">
            Beyond the degree.
          </h2>
        </Reveal>
        <Collapsible summary={<span className="vb-certs-summary">All five certificates</span>}>
        <ul className="vb-certs-list">
          {certificates.map((item) => (
            <li key={item.id} data-active={hover === item.id ? "true" : undefined}>
              {hydrated && item.image ? (
                <button
                  type="button"
                  className="vb-certs-row"
                  onMouseEnter={() => setHover(item.id)}
                  onFocus={() => setHover(item.id)}
                  onClick={() => setOpenId(item.id)}
                >
                  <CertRow item={item} />
                </button>
              ) : fileOf(item) ? (
                <a
                  href={publicUrl(fileOf(item) ?? "")}
                  className="vb-certs-row"
                  target="_blank"
                  rel="noreferrer"
                >
                  <CertRow item={item} />
                </a>
              ) : (
                <div className="vb-certs-row">
                  <CertRow item={item} />
                </div>
              )}
            </li>
          ))}
        </ul>
        </Collapsible>
        <p className="vb-certs-aside">
          I also volunteered at the Language Intelligence Conference 2026 at the
          Saudi Cultural Bureau in London. No certificate for that one.
        </p>
      </div>

      <div className="vb-certs-stage">
        {shown?.image && !hydrated ? (
          <a
            href={publicUrl(fileOf(shown) ?? "")}
            className="vb-certs-sheet"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={shown.image.src}
              alt=""
              width={shown.image.width}
              height={shown.image.height}
              sizes="(max-width: 900px) 92vw, 46vw"
            />
            <span className="vb-certs-sheet-cap">{shown.name}</span>
          </a>
        ) : shown?.image ? (
          <button
            type="button"
            className="vb-certs-sheet"
            aria-label={`Open certificate: ${shown.name}`}
            onClick={() => setOpenId(shown.id)}
          >
            <Image
              key={shown.id}
              src={shown.image.src}
              alt=""
              width={shown.image.width}
              height={shown.image.height}
              sizes="(max-width: 900px) 92vw, 46vw"
            />
            <span className="vb-certs-sheet-cap">{shown.name}</span>
          </button>
        ) : null}
      </div>

      <dialog
        ref={dialog}
        className="vb-dialog"
        aria-labelledby="certs-dialog-title"
        onClose={() => setOpenId(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setOpenId(null);
          }
        }}
      >
        {current && current.image ? (
          <div className="vb-dialog-body">
            <header className="vb-dialog-head">
              <div>
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
                <a href={publicUrl(current.href)} target="_blank" rel="noreferrer">
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

function CertRow({ item }: { item: Certificate }) {
  return (
    <>
      <span className="vb-certs-name">{item.name}</span>
      <span className="vb-certs-meta">{meta(item)}</span>
      {item.note ? <span className="vb-certs-note">{item.note}</span> : null}
    </>
  );
}
