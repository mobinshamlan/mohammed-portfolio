import Image from "next/image";
import type { CSSProperties } from "react";
import { certificates } from "@/lib/certificates";
import { childhood, degree } from "@/lib/portrait";
import { projectById, type ProjectId } from "@/lib/projects";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { SectionTitle } from "./section-title";
import { RouteMap } from "./story-map";
import { RouteStop } from "./story-route";

const eid = certificates.find((item) => item.id === "05");

const homeWork: { id: ProjectId; use: string }[] = [
  { id: "tammeni", use: "School updates for parents" },
  { id: "kashta", use: "Finding a place to camp" },
  { id: "naqah", use: "Checking in on a ranch" },
];

export function Story() {
  return (
    <section id="about" className="vb-story" aria-labelledby="about-title">
      <SectionTitle id="about-title" en="Where I come from." />

      <RouteMap>
        <RouteStop id="story-home" kind="home" place="Saudi Arabia" when="Where I grew up">
          <Image
            className="vb-route-child"
            src={childhood.src}
            alt={childhood.alt}
            width={childhood.width}
            height={childhood.height}
            sizes="(min-width: 1024px) 16rem, (min-width: 600px) 9rem, 7rem"
          />
        </RouteStop>

        <RouteStop id="story-brighton" kind="brighton" place="Brighton" when="About six months">
          <p className="vb-route-line">I moved to England to study English.</p>
        </RouteStop>

        <RouteStop id="journey" kind="london" place="London" when="2022–2026">
          <p className="vb-route-grant">
            I studied on a Saudi government scholarship, through the Imdad pathway.
          </p>
          <ul className="vb-route-facts">
            <li>
              <span className="vb-route-year">2022–23</span>
              <span>Prepared for university at Kaplan International College London.</span>
            </li>
            <li>
              <span className="vb-route-year">2023–26</span>
              <span>
                <strong>Computer science at Queen Mary University of London.</strong>{" "}
                Graduated in July 2026 with upper second-class honours (2:1).
              </span>
            </li>
            <li>
              <span className="vb-route-year">2026</span>
              <span>Volunteered at the London Saudi Club’s Eid celebration.</span>
            </li>
          </ul>
          <div className="vb-route-keep">
            <DocumentViewer
              triggerClassName="vb-route-doc"
              src={degree.src}
              width={degree.width}
              height={degree.height}
              alt={degree.alt}
              title="Degree certificate"
              subtitle="Computer science, Queen Mary University of London"
              href={degree.src}
            >
              <span className="vb-route-doc-img" aria-hidden="true">
                <Image
                  src={degree.src}
                  alt=""
                  width={degree.width}
                  height={degree.height}
                  sizes="4rem"
                />
              </span>
              <span className="vb-route-doc-cap">Degree certificate</span>
            </DocumentViewer>
            {eid?.image ? (
              <DocumentViewer
                triggerClassName="vb-route-doc"
                src={eid.image.src}
                width={eid.image.width}
                height={eid.image.height}
                alt={`Certificate: ${eid.name}, ${eid.organisation}`}
                title="Eid volunteering certificate"
                subtitle={eid.organisation}
                href={eid.href ?? eid.image.src}
              >
                <span className="vb-route-doc-img" aria-hidden="true">
                  <Image
                    src={eid.image.src}
                    alt=""
                    width={eid.image.width}
                    height={eid.image.height}
                    sizes="8rem"
                  />
                </span>
                <span className="vb-route-doc-cap">Eid volunteering</span>
              </DocumentViewer>
            ) : null}
          </div>
        </RouteStop>

        <RouteStop id="story-now" kind="return" place="Back home" when="Saudi Arabia · 2026">
          <p className="vb-route-line">
            At Tuwaiq Academy’s AI bootcamp, I’m learning to give AI clearer instructions
            and check its answers.
          </p>
          <p className="vb-route-built">What I build for life here</p>
          <ul className="vb-route-work">
            {homeWork.map(({ id, use }) => {
              const project = projectById[id];
              return (
                <li key={id}>
                  <a
                    className="vb-route-chip"
                    href={`#${id}`}
                    style={
                      { "--chip": project.field, "--chip-ink": project.fieldInk } as CSSProperties
                    }
                  >
                    <span className="vb-route-swatch" lang="ar" dir="rtl" aria-hidden="true">
                      {project.arabic}
                    </span>
                    <span className="vb-route-chip-text">
                      <strong>{project.name}</strong>
                      <span>{use}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </RouteStop>
      </RouteMap>

      <details className="vb-details vb-story-music">
        <summary className="vb-details-summary">What I listen to</summary>
        <div className="vb-details-body">
          <MusicShelf />
        </div>
      </details>
    </section>
  );
}
