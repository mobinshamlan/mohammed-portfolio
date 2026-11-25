import type { Metadata } from "next";
import Image from "next/image";
import { CasePage } from "@/components/version-b/case-study";
import { GthrzPlanner } from "@/components/version-b/gthrz-planner";
import { GthrzPrivacy } from "@/components/version-b/gthrz-privacy";
import { Reveal } from "@/components/version-b/reveal";
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
    <div className="vb-cover-phones vb-case-phones">
      {heroShots.map((shot, index) => (
        <figure key={shot.src} className="vb-phone vb-phone-sm" data-ui="">
          <span className="vb-phone-notch" aria-hidden="true" />
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 900px) 30vw, 230px"
            priority={index === 1}
            className="vb-phone-img"
          />
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
            Screens
          </h2>
        </Reveal>
        <div className="vb-screens vb-screens-phones">
          {gallery.map((shot, index) => (
            <Reveal key={shot.src} delay={index * 0.05} className="vb-screen vb-screen-phone">
              <figure className="vb-phone" data-ui="">
                <span className="vb-phone-notch" aria-hidden="true" />
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 900px) 44vw, 220px"
                  className="vb-phone-img"
                />
                <figcaption className="vb-frame-cap">{shot.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </CasePage>
  );
}
