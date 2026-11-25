"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { certificates, type Certificate } from "@/lib/certificates";
import { publicUrl } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { SectionTitle } from "./section-title";

// The Eid volunteering certificate already sits beside its milestone in the London story.
const listed = certificates.filter((item) => item.id !== "05");
const previewable = listed.filter((item) => item.image);

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
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

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

  function open(item: Certificate, from: HTMLElement) {
    opener.current = from;
    setOpenId(item.id);
  }

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
    <section id="certificates" className="vb-certs vb-certs-compact" aria-labelledby="certs-title">
      <SectionTitle id="certs-title" en="Certificates." ar="الشهادات" />

      <ul className="vb-certs-rows">
        {listed.map((item) => (
          <li key={item.id}>
            {hydrated && item.image ? (
              <button
                type="button"
                className="vb-cert"
                aria-haspopup="dialog"
                onClick={(event) => open(item, event.currentTarget)}
              >
                <CertRow item={item} />
              </button>
            ) : fileOf(item) ? (
              <a
                href={publicUrl(fileOf(item) ?? "")}
                className="vb-cert"
                target="_blank"
                rel="noreferrer"
              >
                <CertRow item={item} />
              </a>
            ) : (
              <div className="vb-cert">
                <CertRow item={item} />
              </div>
            )}
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

/** One line per certificate: a small copy of the page, the title, who issued it, and when. */
function CertRow({ item }: { item: Certificate }) {
  return (
    <>
      <span className="vb-cert-thumb" aria-hidden="true">
        {item.image ? (
          <Image
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            sizes="4.5rem"
          />
        ) : null}
      </span>
      <span className="vb-cert-name">{item.name}</span>
      <span className="vb-cert-issuer">{item.organisation}</span>
      <span className="vb-cert-date">{item.completed ?? ""}</span>
    </>
  );
}
