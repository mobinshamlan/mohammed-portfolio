import type { Metadata } from "next";
import { CasePage } from "@/components/portfolio/case-study";
import { DocumentViewer } from "@/components/portfolio/document-viewer";
import { GthrzPlanner } from "@/components/portfolio/gthrz-planner";
import { GthrzImg } from "@/components/portfolio/gthrz-img";
import { GthrzPrivacy } from "@/components/portfolio/gthrz-privacy";
import { Reveal } from "@/components/portfolio/reveal";
import { gthrzShots } from "@/lib/gthrz";
import { projectById } from "@/lib/projects";

const project = projectById.gthrz;

export const metadata: Metadata = {
  title: "Gthrz",
  description: project.tagline,
};

const heroShots = [gthrzShots.details, gthrzShots.home, gthrzShots.discover];
const gallery = [
  gthrzShots.welcome,
  gthrzShots.events,
  gthrzShots.create,
  gthrzShots.detailsMore,
  gthrzShots.profile,
];

function Phones() {
  return (
    <div className="vb-case-phones">
      {heroShots.map((shot, index) => (
        <figure key={shot.src} className="vb-capture" data-ui="">
          <GthrzImg shot={shot} sizes="(max-width: 899px) 17rem, 230px" priority={index === 1} />
        </figure>
      ))}
    </div>
  );
}

export default function GthrzCaseStudyPage() {
  return (
    <CasePage project={project} art={<Phones />}>
      <GthrzPrivacy />
      <GthrzPlanner />
      <section className="vb-case-section vb-case-screens" aria-labelledby="gthrz-screens">
        <Reveal>
          <h2 id="gthrz-screens" className="vb-case-h2">
            Screens from the app
          </h2>
        </Reveal>
        <div className="vb-screens vb-screens-phones">
          {gallery.map((shot, index) => (
            <Reveal key={shot.src} delay={index * 0.05} className="vb-screen vb-screen-phone">
              <DocumentViewer
                triggerClassName="vb-gallery-shot"
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                title={shot.caption}
                href={shot.src}
              >
                <span className="vb-capture" data-ui="">
                  <GthrzImg shot={shot} sizes="(max-width: 899px) 44vw, 220px" decorative />
                </span>
                <span className="vb-gallery-label">
                  <span><span className="vb-sr">Enlarge </span>{shot.caption}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M14 4h6v6M20 4l-6 6M10 20H4v-6m0 6 6-6" />
                  </svg>
                </span>
              </DocumentViewer>
            </Reveal>
          ))}
        </div>
      </section>
    </CasePage>
  );
}
