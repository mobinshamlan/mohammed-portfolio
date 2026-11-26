import Image from "next/image";
import type { CSSProperties } from "react";
import { childhood, degree } from "@/lib/portrait";
import { projectById, type ProjectId } from "@/lib/projects";
import { DocumentViewer } from "./document-viewer";
import { JumpLink } from "./jump-link";
import { MusicShelf } from "./music-shelf";
import { SectionTitle } from "./section-title";
import { RouteMap } from "./story-map";
import { RouteStop } from "./story-route";

const homeWork: { id: ProjectId; use: string }[] = [
  { id: "tammeni", use: "School updates for parents" },
  { id: "kashta", use: "Finding a place to camp" },
  { id: "naqah", use: "Daily updates for ranch owners" },
];

export function Story() {
  return (
    <section id="about" className="vb-story" aria-labelledby="about-title">
      <SectionTitle id="about-title" en="Where I come from" />

      <RouteMap>
        <RouteStop
          id="story-home"
          kind="home"
          code="RUH"
          place="Riyadh"
          when="Where I grew up"
          flyToNext
          art={
            <Image
              className="vb-route-child"
              src={childhood.src}
              alt={childhood.alt}
              width={childhood.width}
              height={childhood.height}
              sizes="(min-width: 1024px) 14rem, (min-width: 600px) 10rem, 7.5rem"
            />
          }
        />

        <RouteStop
          id="journey"
          kind="london"
          code="LHR"
          place="London"
          when="University"
          flyToNext
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
                  sizes="(min-width: 1024px) 6rem, 4.5rem"
                />
              </span>
              <span className="vb-route-doc-cap">View degree certificate</span>
            </DocumentViewer>
          }
        >
          <p className="vb-route-line">
            I earned a <strong>BSc in computer science</strong> at Queen Mary University of London on a full Saudi government scholarship.
          </p>
          <p className="vb-route-note">
            Before university, I studied English in Brighton for six months and completed a
            foundation year at Kaplan International College London.
          </p>
        </RouteStop>

        <RouteStop
          id="story-now"
          kind="return"
          code="RUH"
          place="Back to Riyadh"
          when="Tuwaiq Academy"
          art={
            <ul className="vb-route-work" aria-label="Products built for life in Saudi Arabia">
              {homeWork.map(({ id, use }) => {
                const project = projectById[id];
                return (
                  <li key={id}>
                    <JumpLink
                      className="vb-route-chip"
                      to={id}
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
                    </JumpLink>
                  </li>
                );
              })}
            </ul>
          }
        >
          <p className="vb-route-line">
            At the AI bootcamp, I’m building products for everyday life in Saudi Arabia.
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
