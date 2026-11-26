import Image from "next/image";
import type { CSSProperties } from "react";
import { certificates } from "@/lib/certificates";
import { childhood, degree } from "@/lib/portrait";
import { projects, type ProjectId } from "@/lib/projects";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";
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
      <header className="vb-story-head">
        <SectionTitle id="about-title" en="Where I come from." />
        <Reveal delay={0.08}>
          <p className="vb-lead">Home, four years in London, and home again.</p>
        </Reveal>
      </header>

      <RouteMap>
        <ol className="vb-route" aria-label="The route, stop by stop">
          <RouteStop
            id="story-home"
            kind="home"
            en="Saudi Arabia"
            when="Where I grew up"
            aside={
              <Image
                className="vb-route-child"
                src={childhood.src}
                alt={childhood.alt}
                width={childhood.width}
                height={childhood.height}
                sizes="(min-width: 1100px) 12rem, 7rem"
                style={{ objectPosition: "50% 30%" }}
              />
            }
          />

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
                      sizes="5rem"
                      style={{ objectPosition: "50% 0%" }}
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
                        sizes="9rem"
                      />
                    </span>
                    <span className="vb-route-doc-cap">Eid volunteer</span>
                  </DocumentViewer>
                ) : null}
              </div>
            }
          >
            <p className="vb-route-line">
              Custodian of the Two Holy Mosques Scholarship, Imdad track.
            </p>
            <ul className="vb-route-facts">
              <li>
                <span className="vb-route-year">2022–23</span>
                <span>
                  <strong>Kaplan International College London</strong> Foundation,
                  Science and Engineering
                </span>
              </li>
              <li>
                <span className="vb-route-year">2023–26</span>
                <span>
                  <strong>Queen Mary University of London</strong> BSc Computer
                  Science, 2:1, awarded 9 July 2026
                </span>
              </li>
              <li>
                <span className="vb-route-year">2026</span>
                <span>
                  <strong>Volunteer</strong> London Saudi Club Eid al-Fitr, and the
                  Language Intelligence Conference
                </span>
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

      <div className="vb-story-off">
        <p className="vb-muted">
          Off the keyboard: music, Call of Duty: Black Ops 4, and a kashta (a
          desert night out) when the forecast is right.
        </p>
        {/* Always starts closed; the shelf is a side note, not part of the route. */}
        <details className="vb-details vb-story-music">
          <summary className="vb-details-summary">On repeat: twelve artists</summary>
          <div className="vb-details-body">
            <MusicShelf />
          </div>
        </details>
      </div>
    </section>
  );
}
