import { EVIDENCE_CHECKED, projects, type ProjectId } from "@/lib/projects";
import { skillGroups, type Skill } from "@/lib/skills";

/**
 * The toolkit, grouped by the job the tools did. Tool names must match
 * src/lib/skills.ts, which says where each one was used; every note below
 * restates a step, decision or proof in src/lib/projects.ts.
 */

export type JobNote = { project: ProjectId; text: string };

export type Job = {
  id: string;
  title: string;
  /** What I did with these tools, in one plain line. */
  line: string;
  /** Names from skills.ts. */
  tools: string[];
  /** How each project used them, for the jobs that deserve the detail. */
  notes?: JobNote[];
  /** Larger on wide screens. */
  wide?: boolean;
  /** Show the checked test counts from projects.ts. */
  tests?: boolean;
};

const jobs: Job[] = [
  {
    id: "ai",
    title: "AI kept on a leash",
    line: "The model suggests, drafts or explains. Code, the database or a person makes the decision.",
    tools: [
      "Guarding model output with schemas",
      "Zod",
      "Llama 4 Scout on Cloudflare Workers AI",
      "Anthropic Claude with tools",
      "Google Gemini",
    ],
    notes: [
      {
        project: "kashta",
        text: "Code computes the Kashta Score. Llama turns a trip into settings that must parse against a Zod schema, then explains the ranking; a sentence with a number not in the forecast is cut.",
      },
      {
        project: "seet",
        text: "Claude replies through tools the server runs, so every price and date comes from the database. Only the payment callback can confirm a booking.",
      },
      {
        project: "amanah",
        text: "Gemini compares lost and found reports privately and suggests matches. Staff approve or reject each one.",
      },
    ],
    wide: true,
  },
  {
    id: "calls",
    title: "Phone calls in Arabic",
    line: "A real call on an ordinary phone, with a live voice that listens and speaks in Arabic.",
    tools: ["Twilio Voice", "OpenAI Realtime voice"],
    notes: [
      {
        project: "naqah",
        text: "Phones the ranch worker at the owner's chosen time, asks one question at a time and keeps the answers, never the audio.",
      },
      {
        project: "tammeni",
        text: "Lulwa calls a parent at the time they chose, then answers follow-ups only from that child's record.",
      },
    ],
  },
  {
    id: "private",
    title: "Data that stays private",
    line: "Row-level security in Postgres decides who can read a record, not the app: one ranch per owner, one parent's children, one organisation's reports, a host's guests.",
    tools: ["Supabase", "PostgreSQL and row-level security"],
  },
  {
    id: "rules",
    title: "Rules the database enforces",
    line: "Booking rules sit in a Postgres trigger under a per-workspace lock, so two holds on one slot cannot both succeed. The WhatsApp webhook checks its signature before anything is read.",
    tools: ["Postgres triggers and locks", "Webhooks and signatures"],
  },
  {
    id: "arabic",
    title: "Arabic-first interfaces",
    line: "Web apps laid out right to left from the start, in Saudi Arabic, with English alongside where it helps.",
    tools: ["Next.js", "React", "Tailwind CSS", "Arabic-first, RTL interfaces", "zustand"],
  },
  {
    id: "tests",
    title: "Tests that run",
    line: "Vitest covers Naqah's question flow and Playwright walks the owner's website end to end.",
    tools: ["Vitest", "Playwright"],
    tests: true,
    wide: true,
  },
  {
    id: "forecast",
    title: "Forecasts turned into a score",
    line: "Seven nights of forecast and moonlight for every camping site in one call, cached for 30 minutes, then ranked by code.",
    tools: ["Open-Meteo and SunCalc"],
  },
  {
    id: "mobile",
    title: "A phone app",
    line: "An iPhone and Android app for private events: guests request to join, the host approves, and the address stays hidden until the host reveals it.",
    tools: ["React Native and Expo"],
  },
  {
    id: "ship",
    title: "Typed, queried and shipped",
    line: "TypeScript across the apps, SQL where the data lives, the web apps on Vercel and Tammeni's Python voice service on Railway, next to a FastAPI service for its demo school data.",
    tools: ["TypeScript", "SQL", "Vercel and Railway", "Python", "FastAPI"],
    wide: true,
  },
];

const allSkills = skillGroups.flatMap((group) => group.skills);

function skill(name: string): Skill {
  const found = allSkills.find((item) => item.name === name);
  if (!found) {
    throw new Error(`Toolkit names "${name}", which is not in skills.ts.`);
  }
  return found;
}

export type Tool = { name: string; projects: ProjectId[] };

export type ResolvedJob = Omit<Job, "tools"> & {
  tools: Tool[];
  /** Every project these tools, notes or tests touched, in portfolio order. */
  projects: ProjectId[];
  testCounts: { project: ProjectId; value: string; label: string }[];
};

const order = projects.map((project) => project.id);

function testCounts(job: Job) {
  if (!job.tests) {
    return [];
  }
  return projects.flatMap((project) =>
    (project.proof.evidence ?? [])
      .filter((item) => item.kind === "tests")
      .map((item) => ({ project: project.id, value: item.value, label: item.label })),
  );
}

export const toolkit: ResolvedJob[] = jobs.map((job) => {
  const tools = job.tools.map((name) => ({ name, projects: skill(name).projects ?? [] }));
  const counts = testCounts(job);
  const touched = new Set<ProjectId>([
    ...tools.flatMap((tool) => tool.projects),
    ...(job.notes ?? []).map((note) => note.project),
    ...counts.map((count) => count.project),
  ]);
  return {
    ...job,
    tools,
    testCounts: counts,
    projects: order.filter((id) => touched.has(id)),
  };
});

/** Projects that appear in the toolkit, in portfolio order, for the filter. */
export const toolkitProjects = order.filter((id) => toolkit.some((job) => job.projects.includes(id)));

export const testsChecked = EVIDENCE_CHECKED;

/** The rest of skills.ts: studied, on the CV, or still being learned. */
export const studied = {
  learning: allSkills.filter((item) => item.learning).map((item) => item.name),
  groups: skillGroups
    .map((group) => ({
      title: group.title,
      skills: group.skills
        .filter((item) => !item.learning && !(item.projects && item.projects.length > 0))
        .map((item) => item.name),
    }))
    .filter((group) => group.skills.length > 0),
};
