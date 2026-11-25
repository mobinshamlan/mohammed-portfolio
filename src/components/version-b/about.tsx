import Image from "next/image";
import { childhood, graduation } from "@/lib/portrait";
import { Collapsible } from "./collapsible";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";

export function VersionBAbout() {
  return (
    <section id="about" className="vb-about" aria-labelledby="about-title">
      <div className="vb-about-grid">
        <div className="vb-about-copy">
          <Reveal>
            <h2 id="about-title" className="vb-section-head">
              Where I come from.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="vb-lead">
              I grew up in Saudi Arabia, studied computer science in London,
              and came home to build software for the life I know:
              family, school, the desert, the ranch.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="vb-about-body">
              <p>
                I like products that do one job well and say so plainly. Most of
                what I build now is Arabic first, with AI inside only where it
                earns its place: a voice on a phone call, a match suggested to a
                person who decides, an explanation of a number that code already
                computed.
              </p>
              <p>
                Off the keyboard: music, a round of Call of Duty: Black Ops 4,
                and a kashta when the forecast is right.
              </p>
            </div>
          </Reveal>
        </div>

        <figure className="vb-about-photo vb-about-child">
          <Image
            src={childhood.src}
            alt={childhood.alt}
            width={childhood.width}
            height={childhood.height}
            sizes="(max-width: 900px) 60vw, 24vw"
            className="vb-about-img"
          />
          <figcaption>Saudi Arabia, early days.</figcaption>
        </figure>
        <figure className="vb-about-photo vb-about-grad">
          <Image
            src={graduation.src}
            alt={graduation.alt}
            width={graduation.width}
            height={graduation.height}
            sizes="(max-width: 900px) 70vw, 28vw"
            className="vb-about-img"
            style={{ objectPosition: graduation.position }}
          />
          <figcaption>Graduation, London, 2026.</figcaption>
        </figure>
      </div>

      <div className="vb-about-music">
        <Collapsible summary={<h3 className="vb-about-music-title">On repeat: twelve artists</h3>}>
          <MusicShelf />
        </Collapsible>
      </div>
    </section>
  );
}
