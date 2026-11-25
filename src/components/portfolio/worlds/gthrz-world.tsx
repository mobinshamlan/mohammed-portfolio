import { gthrzShots } from "@/lib/gthrz";
import { fieldStyle, type Project } from "@/lib/projects";
import { GthrzStatesDemo } from "../demos/gthrz-states";
import { GthrzImg } from "../gthrz-img";
import { Reveal } from "../reveal";
import { Head, Links, Proof } from "../world-parts";

export function GthrzWorld({ project }: { project: Project }) {
  return (
    <section
      id={project.id}
      className="pw-world pw-gthrz"
      style={fieldStyle(project)}
      aria-labelledby={`proj-${project.id}`}
    >
      <div className="pw-inner pw-gthrz-layout">
        <Head project={project} />

        <div className="pw-gthrz-stage">
          <div className="pw-gthrz-invite">
            <GthrzStatesDemo compact />
          </div>
          <Reveal className="pw-gthrz-stub">
            <p>Only approved guests see the exact location, when the host reveals it.</p>
          </Reveal>
          <div className="pw-gthrz-screens">
            <figure className="pw-gthrz-details">
              <GthrzImg shot={gthrzShots.details} sizes="(max-width: 849px) 104px, 190px" />
              <figcaption>{gthrzShots.details.caption}</figcaption>
            </figure>
            <figure className="pw-gthrz-planner">
              <GthrzImg shot={gthrzShots.plannerSuggestions} sizes="220px" />
              <figcaption>{gthrzShots.plannerSuggestions.caption}</figcaption>
            </figure>
          </div>
        </div>

        <div className="pw-foot">
          <Proof project={project} />
          <Links project={project} />
        </div>
      </div>
    </section>
  );
}
