import { Collapsible } from "./collapsible";
import { RouteStory } from "./journey";
import { MusicShelf } from "./music-shelf";
import { Reveal } from "./reveal";

/** Where I come from and the road here, told as one story around a map. */
export function About() {
  return (
    <section id="about" className="vb-about vb-story" aria-labelledby="about-title">
      <div className="vb-story-intro">
        <Reveal>
          <h2 id="about-title" className="vb-section-head">
            Where I come from.
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="vb-story-copy">
          <p className="vb-lead">
            Raised in Saudi Arabia, trained in London, back home building for the life I know: family,
            school, the desert, the ranch.
          </p>
          <p>
            I like products that do one job well and say so plainly: Arabic first, with AI inside only
            where it earns its place.
          </p>
        </Reveal>
      </div>

      <RouteStory />

      <div className="vb-story-off">
        <p className="vb-story-off-line">
          <strong>Off the keyboard:</strong> music, a round of Call of Duty: Black Ops 4, and a kashta
          when the forecast is right.
        </p>
        <Collapsible summary={<h3 className="vb-story-off-title">On repeat: twelve artists</h3>}>
          <MusicShelf />
        </Collapsible>
      </div>
    </section>
  );
}
