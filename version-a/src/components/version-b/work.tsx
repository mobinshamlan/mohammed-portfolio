import Image from "next/image";
import Link from "next/link";
import { gthrzShots } from "@/lib/gthrz";
import { AmanahArt } from "./amanah-art";

const gthrzTech = [
  "React Native",
  "Expo",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
];
const amanahTech = ["Next.js", "TypeScript", "Tailwind CSS"];

export const projects = [
  {
    id: "gthrz",
    name: "Gthrz",
    href: "/version-b/projects/gthrz",
    lead: "Privacy-first mobile event planning application.",
    tech: gthrzTech,
  },
  {
    id: "amanah",
    name: "Amanah",
    href: "/version-b/projects/amanah",
    lead: "AI-assisted lost-and-found application for institutions.",
    tech: amanahTech,
    status: "In development",
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

function Phone({
  shot,
  className,
  sizes,
}: {
  shot: { src: string; alt: string; width: number; height: number };
  className: string;
  sizes: string;
}) {
  return (
    <div className={`vb-wk-phone ${className}`}>
      <Image
        src={shot.src}
        alt=""
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        className="vb-wk-phone-img"
      />
    </div>
  );
}

export function GthrzCluster({ sizes }: { sizes: string }) {
  return (
    <div className="vb-wk-cluster" aria-hidden="true">
      <Phone shot={gthrzShots.details} className="vb-wk-p-left" sizes={sizes} />
      <Phone
        shot={gthrzShots.discover}
        className="vb-wk-p-right"
        sizes={sizes}
      />
      <Phone shot={gthrzShots.home} className="vb-wk-p-main" sizes={sizes} />
    </div>
  );
}

/** Mobile layout for Selected Work: one poster per project. */
export function WorkPosters() {
  return (
    <div className="vb-wk-posters">
      <Link href={projects[0].href} className="vb-wk-poster vb-wk-poster-gthrz">
        <span className="vb-wk-poster-name">Gthrz</span>
        <span className="vb-wk-poster-lead">{projects[0].lead}</span>
        <GthrzCluster sizes="45vw" />
      </Link>
      <Link
        href={projects[1].href}
        className="vb-wk-poster vb-wk-poster-amanah"
      >
        <span className="vb-wk-poster-name">Amanah</span>
        <span className="vb-wk-sr">In development</span>
        <span className="vb-wk-poster-lead">{projects[1].lead}</span>
        <span className="vb-wk-poster-art">
          <AmanahArt />
        </span>
      </Link>
    </div>
  );
}
