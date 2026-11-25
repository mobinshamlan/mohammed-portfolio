import Image from "next/image";
import { certificates } from "@/lib/certificates";
import { childhood, degree } from "@/lib/portrait";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";
import { RouteStop } from "./story-route";

const eid = certificates.find((item) => item.id === "05");

/** Where I come from: Saudi Arabia, Brighton, four years in London, and home again. */
export function Story() {
  return (
    <section id="about" className="vb-story" aria-labelledby="about-title">
      <header className="vb-story-head">
        <SectionTitle id="about-title" en="Where I come from." ar="من وين أنا" />
        <Reveal delay={0.08}>
          <p className="vb-lead">
            Raised in Saudi Arabia, trained in London, back home building for
            the life I know: family, school, the desert, the ranch.
          </p>
        </Reveal>
      </header>

      {/* One route, left to right on wide screens and top to bottom on phones. */}
      <ol className="vb-route" aria-label="The route, stop by stop">
        <RouteStop id="story-home" kind="home" en="Saudi Arabia" ar="السعودية" when="Early days">
          <figure className="vb-route-child">
            <Image
              src={childhood.src}
              alt={childhood.alt}
              width={childhood.width}
              height={childhood.height}
              sizes="7rem"
              style={{ objectPosition: "50% 30%" }}
            />
            <figcaption>Where I grew up.</figcaption>
          </figure>
        </RouteStop>

        <RouteStop id="story-brighton" kind="short" en="Brighton" ar="برايتون" when="About six months">
          <p className="vb-route-line">English language studies by the sea.</p>
        </RouteStop>

        <RouteStop id="journey" kind="long" en="London" ar="لندن" when="2022–2026 · Four years">
          <p className="vb-route-line">
            Custodian of the Two Holy Mosques Scholarship, Imdad track.
          </p>
          <ul className="vb-route-facts">
            <li>
              <span className="vb-route-year">2022–23</span>
              <span>
                <strong>Kaplan International College London</strong>
                Foundation Certificate, Science and Engineering
              </span>
            </li>
            <li>
              <span className="vb-route-year">2023–26</span>
              <span>
                <strong>Queen Mary University of London</strong>
                BSc (Hons) Computer Science, 2:1. Degree awarded 9 July 2026.
              </span>
            </li>
            <li>
              <span className="vb-route-year">2026</span>
              <span>
                <strong>Volunteering</strong>
                London Saudi Club Eid al-Fitr event, and the Language
                Intelligence Conference at the Saudi Cultural Bureau.
              </span>
            </li>
          </ul>

          <div className="vb-route-keep">
            <DocumentViewer
              triggerClassName="vb-route-thumb vb-route-doc"
              src={degree.src}
              width={degree.width}
              height={degree.height}
              alt={degree.alt}
              title="Degree certificate"
              subtitle="BSc Computer Science (Hons), Queen Mary University of London"
              href={degree.src}
            >
              <span className="vb-route-thumb-img" aria-hidden="true">
                <Image
                  src={degree.src}
                  alt=""
                  width={degree.width}
                  height={degree.height}
                  sizes="8rem"
                  style={{ objectPosition: "50% 0%" }}
                />
              </span>
              <span className="vb-route-doc-cap">Degree certificate</span>
            </DocumentViewer>
            {eid?.image ? (
              <DocumentViewer
                triggerClassName="vb-route-thumb vb-route-doc"
                src={eid.image.src}
                width={eid.image.width}
                height={eid.image.height}
                alt={`Certificate: ${eid.name}, ${eid.organisation}`}
                title="Volunteer certificate"
                subtitle={eid.organisation}
                href={eid.href ?? eid.image.src}
              >
                <span className="vb-route-thumb-img" aria-hidden="true">
                  <Image
                    src={eid.image.src}
                    alt=""
                    width={eid.image.width}
                    height={eid.image.height}
                    sizes="8rem"
                  />
                </span>
                <span className="vb-route-doc-cap">Eid volunteer certificate</span>
              </DocumentViewer>
            ) : null}
          </div>
        </RouteStop>

        <RouteStop
          id="story-now"
          kind="now"
          en="Back in Saudi Arabia"
          ar="السعودية"
          when={
            <>
              <span className="vb-route-now-tag">Now</span> 2026
            </>
          }
        >
          <p className="vb-route-line">Tuwaiq Academy, AI Fundamentals Bootcamp.</p>
          <p className="vb-route-line">Six products built in 2026.</p>
          <a className="vb-route-link" href="#work">
            See the work
          </a>
        </RouteStop>

        <RouteStop id="story-next" kind="next" en="A first role" when="Next">
          <p className="vb-route-line">
            In software engineering and AI, with a team in Saudi Arabia.
          </p>
        </RouteStop>
      </ol>

      <div className="vb-story-off">
        <p className="vb-muted">
          I like products that do one job well and say so plainly. Off the
          keyboard: music, a round of Call of Duty: Black Ops 4, and a kashta
          (a desert night out) when the forecast is right.
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
