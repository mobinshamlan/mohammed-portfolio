import Image from "next/image";
import type { CSSProperties } from "react";
import { childhood, degree } from "@/lib/portrait";
import { projectById, type ProjectId } from "@/lib/projects";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { SectionTitle } from "./section-title";
import { RouteMap } from "./story-map";
import { RouteStop } from "./story-route";

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
        <RouteStop
          id="story-home"
          kind="home"
          place="Saudi Arabia"
          when="Where I grew up"
          art={
            <Image
              className="vb-route-child"
              src={childhood.src}
              alt={childhood.alt}
              width={childhood.width}
              height={childhood.height}
              sizes="(min-width: 1024px) 18rem, (min-width: 600px) 9rem, 7rem"
            />
          }
        >
          <p className="vb-route-line">
            Everything I build starts with the people and daily life I grew up around.
          </p>
        </RouteStop>

        <RouteStop
          id="journey"
          kind="london"
          place="London"
          when="2022–2026"
          art={
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
                  sizes="(min-width: 1024px) 11rem, 6rem"
                />
              </span>
              <span className="vb-route-doc-cap">Open the degree certificate</span>
            </DocumentViewer>
          }
        >
          <p className="vb-route-line">
            <strong>BSc Computer Science, Queen Mary University of London.</strong> Graduated
            July 2026, on a full Saudi government scholarship.
          </p>
          <p className="vb-route-note">
            Before that: six months of English in Brighton and a foundation year at Kaplan
            International College London.
          </p>
        </RouteStop>

        <RouteStop
          id="story-now"
          kind="return"
          place="Back home"
          when="Riyadh · 2026"
          art={
            <ul className="vb-route-work" aria-label="Products built for life in Saudi Arabia">
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
          }
        >
          <p className="vb-route-line">
            Now in Tuwaiq Academy’s AI bootcamp, learning to brief AI clearly and check its
            answers, while building products for life here.
          </p>
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
