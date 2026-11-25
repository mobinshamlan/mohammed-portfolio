import Image from "next/image";
import { certificates } from "@/lib/certificates";
import { childhood, degree, graduation } from "@/lib/portrait";
import { ChapterMark } from "./chapter-mark";
import { Collapsible } from "./collapsible";
import { DocumentViewer } from "./document-viewer";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";
import { StoryRoute } from "./story-route";

const eid = certificates.find((item) => item.id === "05");

/** Where I come from: Saudi Arabia, Brighton, four years in London, and home again. */
export function Story() {
  return (
    <section id="about" className="vb-story" aria-labelledby="about-title">
      <header className="vb-story-head">
        <ChapterMark n={2} en="Where I come from" ar="من وين أنا" />
        <Reveal>
          <h2 id="about-title" className="vb-section-head">
            Where I come from.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="vb-lead">
            Raised in Saudi Arabia, trained in London, back home building for
            the life I know: family, school, the desert, the ranch.
          </p>
        </Reveal>
      </header>

      <StoryRoute />

      <div className="vb-story-start">
        {/* Stop 1: where it begins. */}
        <article id="story-home" className="vb-story-stop vb-story-origin" aria-labelledby="story-home-title">
          <figure className="vb-story-photo vb-story-child">
            <Image
              src={childhood.src}
              alt={childhood.alt}
              width={childhood.width}
              height={childhood.height}
              sizes="(max-width: 899px) 44vw, 15rem"
              style={{ objectPosition: "50% 30%" }}
            />
            <figcaption>Saudi Arabia, early days.</figcaption>
          </figure>
          <Reveal className="vb-story-copy">
            <p className="vb-story-when">Early days</p>
            <h3 id="story-home-title" className="vb-story-place">
              Saudi Arabia
              <span lang="ar" dir="rtl">
                السعودية
              </span>
            </h3>
            <p>Where I grew up.</p>
          </Reveal>
        </article>

        {/* Stop 2: a short stop by the sea. */}
        <article id="story-brighton" className="vb-story-stop vb-story-brighton" aria-labelledby="story-brighton-title">
          <Reveal className="vb-story-copy">
            <p className="vb-story-when">About six months</p>
            <h3 id="story-brighton-title" className="vb-story-place vb-story-place-sm">
              Brighton
              <span lang="ar" dir="rtl">
                برايتون
              </span>
            </h3>
            <p>English language studies by the sea, before London.</p>
          </Reveal>
        </article>
      </div>

      {/* Stop 3: London, the longest and fullest stop. */}
      <article id="journey" className="vb-story-london" aria-labelledby="story-london-title">
        <div className="vb-story-london-head">
          <p className="vb-story-when">2022–2026 · Four years</p>
          <h3 id="story-london-title" className="vb-story-place vb-story-place-xl">
            London
            <span lang="ar" dir="rtl">
              لندن
            </span>
          </h3>
          <p className="vb-story-fund">
            Funded by the Custodian of the Two Holy Mosques Scholarship Program,
            Imdad track.
          </p>
        </div>

        <ol className="vb-story-years">
          <li>
            <Reveal className="vb-story-year">
              <p className="vb-story-when">2022–2023</p>
              <h4>Kaplan International College London</h4>
              <p>Foundation Certificate for Science and Engineering.</p>
            </Reveal>
          </li>
          <li>
            <Reveal className="vb-story-year">
              <p className="vb-story-when">2023–2026</p>
              <h4>Queen Mary University of London</h4>
              <p>BSc (Hons) Computer Science, Upper Second-Class Honours (2:1).</p>
            </Reveal>
          </li>
          <li className="vb-story-proved">
            <Reveal className="vb-story-year">
              <p className="vb-story-when">2026 · Volunteering</p>
              <h4>With the Saudi community in London</h4>
              <p>
                Helped support and organise the London Saudi Club&rsquo;s Eid
                al-Fitr 2026 event, under the patronage of the Saudi Cultural
                Bureau in the UK.
              </p>
              <p>
                Volunteered at the Language Intelligence Conference 2026 at the
                Saudi Cultural Bureau in London.
              </p>
            </Reveal>
            {eid?.image ? (
              <DocumentViewer
                triggerClassName="vb-story-artifact vb-story-artifact-eid"
                src={eid.image.src}
                width={eid.image.width}
                height={eid.image.height}
                alt={`Certificate: ${eid.name}, ${eid.organisation}`}
                title="Volunteer certificate"
                subtitle={eid.organisation}
                href={eid.href ?? eid.image.src}
              >
                <span className="vb-story-artifact-img" aria-hidden="true">
                  <Image
                    src={eid.image.src}
                    alt=""
                    width={eid.image.width}
                    height={eid.image.height}
                    sizes="(max-width: 899px) 92vw, 28rem"
                  />
                </span>
                <span className="vb-story-doc-text">
                  <span className="vb-story-doc-title">Eid al-Fitr 2026 thank-you certificate</span>
                  <span className="vb-story-doc-cta">View the certificate</span>
                </span>
              </DocumentViewer>
            ) : null}
          </li>
          <li className="vb-story-proved vb-story-milestone">
            <Reveal className="vb-story-year">
              <p className="vb-story-when">July 2026</p>
              <h4>Graduated</h4>
              <p>Degree awarded on 9 July 2026.</p>
              <figure className="vb-story-photo vb-story-grad">
                <Image
                  src={graduation.src}
                  alt={graduation.alt}
                  width={graduation.width}
                  height={graduation.height}
                  sizes="7rem"
                  style={{ objectPosition: "50% 22%" }}
                />
                <figcaption>Graduation day, London, 2026.</figcaption>
              </figure>
            </Reveal>
            <DocumentViewer
              triggerClassName="vb-story-artifact vb-story-artifact-degree"
              src={degree.src}
              width={degree.width}
              height={degree.height}
              alt={degree.alt}
              title="Degree certificate"
              subtitle="BSc Computer Science (Hons), Queen Mary University of London"
              href={degree.src}
            >
              <span className="vb-story-artifact-img" aria-hidden="true">
                <Image
                  src={degree.src}
                  alt=""
                  width={degree.width}
                  height={degree.height}
                  sizes="(max-width: 899px) 60vw, 17rem"
                />
              </span>
              <span className="vb-story-doc-text">
                <span className="vb-story-doc-title">Degree certificate, Queen Mary University of London</span>
                <span className="vb-story-doc-cta">View the certificate</span>
              </span>
            </DocumentViewer>
          </li>
        </ol>
      </article>

      <div className="vb-story-end">
        {/* Stop 4: home again. */}
        <article id="story-now" className="vb-story-stop vb-story-now" aria-labelledby="story-now-title">
          <Reveal className="vb-story-copy">
            <p className="vb-story-when">
              2026 <span className="vb-story-now-tag">Now</span>
            </p>
            <h3 id="story-now-title" className="vb-story-place">
              Back in Saudi Arabia
              <span lang="ar" dir="rtl">
                السعودية
              </span>
            </h3>
            <p>Tuwaiq Academy, AI Fundamentals Bootcamp using Meta tools.</p>
            <p>
              Six products built in 2026: Naqah, Tammeni, Seet, Kashta, Amanah
              and Gthrz.
            </p>
            <a className="vb-story-link" href="#work">
              See the work
            </a>
          </Reveal>
        </article>

        <article className="vb-story-stop vb-story-next" aria-labelledby="story-next-title">
          <Reveal className="vb-story-copy">
            <p className="vb-story-when">Next</p>
            <h3 id="story-next-title" className="vb-story-next-title">
              A first role in software engineering and AI.
            </h3>
            <p>With a team in Saudi Arabia that ships Arabic-first products.</p>
          </Reveal>
        </article>
      </div>

      <div className="vb-story-off">
        <Reveal className="vb-story-values">
          <p className="vb-story-values-line">
            I like products that do one job well and say so plainly: Arabic
            first, with AI inside only where it earns its place.
          </p>
          <p className="vb-muted">
            Off the keyboard: music, a round of Call of Duty: Black Ops 4, and
            a kashta (a desert night out) when the forecast is right.
          </p>
        </Reveal>
        <div className="vb-story-music">
          <Collapsible summary={<h3 className="vb-story-music-title">On repeat: twelve artists</h3>}>
            <MusicShelf />
          </Collapsible>
        </div>
      </div>
    </section>
  );
}
