import Image from "next/image";
import { certificates, volunteering, type Certificate } from "@/lib/certificates";
import { DocumentViewer } from "./document-viewer";

function meta(item: Certificate) {
  return item.completed ? `${item.organisation}, ${item.completed}` : item.organisation;
}

/** A certificate card: opens the viewer once the page runs, links to the file before. */
function CertCard({ item, className }: { item: Certificate; className: string }) {
  return (
    <DocumentViewer
      triggerClassName={className}
      src={item.image.src}
      width={item.image.width}
      height={item.image.height}
      alt={`Certificate: ${item.name}, ${meta(item)}`}
      title={item.name}
      subtitle={meta(item)}
      href={item.href}
    >
      <span className="cr-card-thumb" aria-hidden="true">
        <Image src={item.thumb} alt="" width={560} height={350} loading="lazy" />
      </span>
      <span className="cr-card-text">
        <span className="cr-card-issuer">{item.organisation}</span>
        <span className="cr-card-title">{item.name}</span>
        {item.completed ? <span className="cr-card-date">{item.completed}</span> : null}
      </span>
    </DocumentViewer>
  );
}

export function Certs() {
  const record = volunteering.certificate;
  return (
    <section id="certificates" className="vb-certs cr-certs" aria-labelledby="certs-title">
      <div className="cr-certs-head">
        <h2 id="certs-title" className="vb-section-head cr-head">
          Beyond the degree.
        </h2>
        <p className="cr-certs-lead">
Most relevant first. Open one to see the original.
        </p>
      </div>

      <ul className="cr-cards" aria-label="Certificates">
        {certificates.map((item) => (
          <li key={item.id}>
            <CertCard item={item} className="cr-card" />
          </li>
        ))}
      </ul>

      <div className="cr-volunteer">
        <h3 className="cr-volunteer-title">Volunteering</h3>
        <CertCard item={record} className="cr-card cr-card-row" />
        <div className="cr-volunteer-notes">
          <p>{record.note}</p>
          {volunteering.notes.map((note) => (
            <p key={note.name}>
              Also volunteered at the <strong>{note.name}</strong>, {note.place}.{" "}
              {note.note}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
