import { fieldStyle, type Project } from "@/lib/projects";
import { KashtaScoreDemo } from "../demos/kashta-score";
import { Reveal } from "../reveal";
import { Head, Links, Proof } from "../world-parts";

const starPositions = [
  [62, 129], [130, 70], [202, 180], [281, 97],
  [364, 52], [443, 179], [522, 92], [587, 153],
  [32, 224], [160, 275], [246, 58], [326, 233],
  [395, 128], [478, 263], [556, 209], [605, 63],
];

export function KashtaWorld({ project }: { project: Project }) {
  return (
    <section
      id={project.id}
      className="pw-world pw-kashta"
      style={fieldStyle(project)}
      aria-labelledby={`proj-${project.id}`}
    >
      <div className="pw-kashta-sky" aria-hidden="true">
        {[false, true].map((extra) => (
          <svg key={String(extra)} viewBox="0 0 640 300" preserveAspectRatio="none">
            {starPositions.slice(extra ? 8 : 0, extra ? 16 : 8).map(([x, y], index) => (
              <circle key={x} cx={x} cy={y} r={index % 4 === 1 ? 1 : 0.55} />
            ))}
          </svg>
        ))}
      </div>
      <div className="pw-inner pw-kashta-layout">
        <Head project={project} />

        <Reveal className="pw-kashta-gauge" delay={0.07}>
          <KashtaScoreDemo compact />
        </Reveal>

        <div className="pw-foot">
          <Proof project={project} />
          <Links project={project} />
        </div>
      </div>
    </section>
  );
}
