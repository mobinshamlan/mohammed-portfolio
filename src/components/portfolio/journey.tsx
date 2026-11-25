import Image from "next/image";
import { degree } from "@/lib/portrait";
import { DocumentViewer } from "./document-viewer";
import { Reveal } from "./reveal";

type Chapter = {
  place: string;
  arabic: string;
  years: string;
  title: string;
  lines: string[];
  now?: boolean;
  award?: boolean;
};

const chapters: Chapter[] = [
  {
    place: "Brighton",
    arabic: "برايتون",
    years: "",
    title: "Learning the language.",
    lines: ["English language studies, about six months by the sea, then a move to London."],
  },
  {
    place: "London",
    arabic: "لندن",
    years: "2022–2026",
    title: "The foundation, then the degree.",
    lines: [
      "Kaplan International College London, 2022–2023: Foundation Certificate for Science and Engineering.",
      "Queen Mary University of London, 2023–2026: BSc (Hons) Computer Science, Upper Second-Class Honours (2:1), graduated July 2026.",
      "Custodian of the Two Holy Mosques Scholarship Program, Imdad track.",
    ],
    award: true,
  },
  {
    place: "Saudi Arabia",
    arabic: "السعودية",
    years: "2026",
    title: "Building with AI.",
    lines: [
      "Tuwaiq Academy, AI Fundamentals Bootcamp using Meta tools.",
      "Four projects built so far: Naqah, Tammeni, Seet and Kashta.",
    ],
    now: true,
  },
  {
    place: "Next",
    arabic: "القادم",
    years: "",
    title: "A first role in software engineering and AI.",
    lines: [
      "Looking for a team in Saudi Arabia that ships Arabic-first products and takes AI seriously enough to keep it honest.",
    ],
  },
];

export function Journey() {
  return (
    <section id="journey" className="vb-journey" aria-labelledby="journey-title">
      <div className="vb-journey-head">
        <Reveal>
          <h2 id="journey-title" className="vb-section-head">
            The road here.
          </h2>
        </Reveal>
      </div>

      <ol className="vb-chapters">
        {chapters.map((chapter) => (
          <li
            key={chapter.title}
            className="vb-chapter"
            data-now={chapter.now ? "true" : undefined}
          >
            <Reveal className="vb-chapter-place">
              <span className="vb-chapter-city">{chapter.place}</span>
              <span className="vb-chapter-arabic" lang="ar">
                {chapter.arabic}
              </span>
            </Reveal>
            <Reveal delay={0.08} className="vb-chapter-copy">
              {chapter.years ? (
                <p className="vb-chapter-years">
                  {chapter.years}
                  {chapter.now ? <span className="vb-chapter-now">Now</span> : null}
                </p>
              ) : null}
              <h3 className="vb-chapter-title">{chapter.title}</h3>
              {chapter.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {chapter.award ? (
                <div className="vb-award">
                  <DocumentViewer
                    triggerClassName="vb-award-trigger"
                    src={degree.src}
                    width={degree.width}
                    height={degree.height}
                    alt={degree.alt}
                    title="Degree certificate"
                    subtitle="BSc Computer Science (Hons), Queen Mary University of London"
                    href={degree.src}
                  >
                    <span className="vb-award-doc" aria-hidden="true">
                      <Image
                        src={degree.src}
                        alt=""
                        width={degree.width}
                        height={degree.height}
                        sizes="7rem"
                      />
                    </span>
                    <span className="vb-award-text">
                      <span className="vb-award-title">Degree awarded, 9 July 2026</span>
                      <span className="vb-award-cta">View the certificate</span>
                    </span>
                  </DocumentViewer>
                </div>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
