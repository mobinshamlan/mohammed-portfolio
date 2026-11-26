import Image from "next/image";
import type { CSSProperties } from "react";
import { certificates } from "@/lib/certificates";
import { childhood, degree } from "@/lib/portrait";
import { projects, type ProjectId } from "@/lib/projects";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { SectionTitle } from "./section-title";
import { RouteMap } from "./story-map";
import { RouteStop } from "./story-route";

const eid = certificates.find((item) => item.id === "05");

/** The life at home each product is built for, in each product's own colour. */
const homeWork: { id: ProjectId; life: string }[] = [
  { id: "tammeni", life: "School and family" },
  { id: "kashta", life: "The desert" },
  { id: "naqah", life: "The ranch" },
];

/** Where I come from: Saudi Arabia, Brighton, four years in London, and home again. */
export function Story() {
  return (
    <section id="about" className="vb-story" aria-labelledby="about-title">
      <SectionTitle id="about-title" en="Where I come from." />

      <RouteMap>
        <ol className="vb-route" aria-label="From Saudi Arabia to London and home again">
          <RouteStop id="story-home" kind="home" en="Saudi Arabia" when="Where I grew up">
            <Image
              className="vb-route-child"
              src={childhood.src}
              alt={childhood.alt}
              width={childhood.width}
              height={childhood.height}
              sizes="(min-width: 1100px) 12rem, 7rem"
              style={{ objectPosition: "50% 30%" }}
            />
          </RouteStop>

          <RouteStop id="story-brighton" kind="short" en="Brighton" when="About six months">
            <p className="vb-route-line">English language studies.</p>
          </RouteStop>

          <RouteStop
            id="journey"
            kind="long"
            en="London"
            when="2022–2026"
            aside={
              <div className="vb-route-keep">
                <DocumentViewer
                  triggerClassName="vb-route-doc"
                  src={degree.src}
                  width={degree.width}
                  height={degree.height}
                  alt={degree.alt}
                  title="Degree certificate"
                  subtitle="BSc Computer Science (Hons), Queen Mary University of London"
                  href={degree.src}
                >
                  <span className="vb-route-doc-img" aria-hidden="true">
                    <Image
                      src={degree.src}
                      alt=""
                      width={degree.width}
                      height={degree.height}
                      sizes="7rem"
                    />
                  </span>
                  <span className="vb-route-doc-cap">Degree</span>
                </DocumentViewer>
                {eid?.image ? (
                  <DocumentViewer
                    triggerClassName="vb-route-doc"
                    src={eid.image.src}
                    width={eid.image.width}
                    height={eid.image.height}
                    alt={`Certificate: ${eid.name}, ${eid.organisation}`}
                    title="Volunteer certificate"
                    subtitle={eid.organisation}
                    href={eid.href ?? eid.image.src}
                  >
                    <span className="vb-route-doc-img" aria-hidden="true">
                      <Image
                        src={eid.image.src}
                        alt=""
                        width={eid.image.width}
                        height={eid.image.height}
                        sizes="10rem"
                      />
                    </span>
                    <span className="vb-route-doc-cap">Eid volunteer</span>
                  </DocumentViewer>
                ) : null}
              </div>
            }
          >
            <p className="vb-route-grant">
              On the Custodian of the Two Holy Mosques Scholarship, Imdad track.
            </p>
            <ul className="vb-route-facts">
              <li>
                <span className="vb-route-year">2022–23</span>
                <span>Foundation year, Kaplan International College London</span>
              </li>
              <li>
                <span className="vb-route-year">2023–26</span>
                <span>
                  <strong>BSc Computer Science, Queen Mary University of London</strong> 2:1,
                  graduated July 2026
                </span>
              </li>
              <li>
                <span className="vb-route-year">2026</span>
                <span>Volunteer, London Saudi Club Eid al-Fitr</span>
              </li>
            </ul>
          </RouteStop>

          <RouteStop
            id="story-now"
            kind="now"
            en="Home again"
            when={
              <>
                <span className="vb-route-now-tag">Now</span> 2026
              </>
            }
          >
            <p className="vb-route-line">Tuwaiq Academy, AI Fundamentals Bootcamp.</p>
            <p className="vb-route-built">What I build for life here</p>
            <ul className="vb-route-work">
              {homeWork.map(({ id, life }) => {
                const project = projects.find((item) => item.id === id);
                if (!project) {
                  return null;
                }
                return (
                  <li key={id}>
                    <a
                      className="vb-route-chip"
                      href={`#${id}`}
                      style={
                        { "--chip": project.field, "--chip-ink": project.fieldInk } as CSSProperties
                      }
                    >
                      <span className="vb-route-swatch" lang="ar" dir="rtl">
                        {project.arabic}
                      </span>
                      <span className="vb-route-chip-text">
                        <strong>{project.name}</strong>
                        {life}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </RouteStop>

          <RouteStop id="story-next" kind="next" en="Next" when="A first role">
            <p className="vb-route-line">In software or AI engineering.</p>
          </RouteStop>
        </ol>
      </RouteMap>

      {/* Always starts closed; the shelf is a side note, not part of the route. */}
      <details className="vb-details vb-story-music">
        <summary className="vb-details-summary">On repeat: twelve artists</summary>
        <div className="vb-details-body">
          <MusicShelf />
        </div>
      </details>
    </section>
  );
}
