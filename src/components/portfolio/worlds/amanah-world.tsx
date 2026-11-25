import Image from "next/image";
import { fieldStyle, type Project } from "@/lib/projects";
import { AmanahClaimDemo } from "../demos/amanah-claim";
import { Reveal } from "../reveal";
import { Head, Links, Proof } from "../world-parts";

export function AmanahWorld({ project }: { project: Project }) {
  const shot = project.cover;

  return (
    <section
      id={project.id}
      className="pw-world pw-amanah"
      style={fieldStyle(project)}
      aria-labelledby={`proj-${project.id}`}
    >
      <div className="pw-inner pw-amanah-top">
        <Head project={project} />
        <Reveal className="pw-amanah-tag-wrap">
          <div className="pw-amanah-tag">
            <p lang="ar" dir="rtl">{project.arabicTagline}</p>
            <p className="pw-amanah-tag-details"><span>Simulated</span> · Item: Umbrella</p>
            <ul className="pw-amanah-tag-details">
              <li>Found items stay private</li>
              <li>Gemini suggests a match</li>
              <li>Staff approve hand-over</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="pw-amanah-counter">
        <div className="pw-inner pw-amanah-desk">
          <AmanahClaimDemo compact />
          <div className="pw-amanah-screen">
            <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} />
          </div>
        </div>
      </div>

      <div className="pw-amanah-cabinet">
        <div className="pw-inner pw-foot">
          <Proof project={project} />
          <Links project={project} />
        </div>
      </div>
    </section>
  );
}
