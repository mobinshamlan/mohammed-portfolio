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
  /** How each project used them, opened on demand. */
  notes?: JobNote[];
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
      "Open-Meteo and SunCalc",
    ],
    notes: [
      {
        project: "seet",
        text: "Claude replies through tools the server runs, so every price and date comes from the database. Only the payment callback can confirm a booking.",
      },
      {
        project: "kashta",
        text: "Code ranks the camping sites from seven nights of Open-Meteo forecast and SunCalc moonlight. Llama turns a trip into settings that must parse against a Zod schema, then explains the ranking; a sentence with a number not in the forecast is cut.",
      },
      {
        project: "amanah",
        text: "Gemini compares lost and found reports privately and suggests matches. Staff approve or reject each one.",
      },
    ],
  },
  {
    id: "calls",
    title: "Phone calls in Arabic",
    line: "A real call on an ordinary phone, with a live voice that listens and speaks in Arabic.",
    tools: ["Twilio Voice", "OpenAI Realtime voice", "Python"],
    notes: [
      {
        project: "naqah",
        text: "Phones the ranch worker at the owner's chosen time, asks one question at a time and keeps the answers, never the audio.",
      },
      {
        project: "tammeni",
        text: "Lulwa calls a parent at the time they chose, then answers follow-ups only from that child's record. The voice service is Python, on Railway.",
      },
    ],
  },
  {
    id: "data",
    title: "Private data, database rules",
    line: "Postgres decides who can read a record and when a booking is allowed, not the app.",
    tools: [
      "Supabase",
      "PostgreSQL and row-level security",
      "Postgres triggers and locks",
      "Webhooks and signatures",
      "SQL",
      "FastAPI",
    ],
    notes: [
      { project: "naqah", text: "Supabase Auth and row-level security keep one ranch to one owner." },
      {
        project: "tammeni",
        text: "Row-level security scopes every record to the parent. A FastAPI service serves the demo's fictional school data.",
      },
      {
        project: "seet",
        text: "A Postgres trigger under a per-workspace lock refuses a second hold on the same slot. The WhatsApp webhook checks its signature before anything is read.",
      },
      { project: "amanah", text: "Row-level security scopes every report to its organisation." },
      {
        project: "gthrz",
        text: "Row-level security enforces each event's privacy: the address now or later, guest names and photos on or off.",
      },
    ],
  },
  {
    id: "web",
    title: "Arabic-first web apps",
    line: "Right to left from the start, in Saudi Arabic, on Vercel. TypeScript throughout, the phone app too.",
    tools: ["Next.js", "React", "Tailwind CSS", "Arabic-first, RTL interfaces", "zustand", "TypeScript", "Vercel and Railway"],
  },
  {
    id: "mobile",
    title: "A phone app",
    line: "iPhone and Android, for private events: the host approves guests and decides when the address shows.",
    tools: ["React Native and Expo"],
  },
  {
    id: "tests",
    title: "Tests that run",
    line: "Vitest covers Naqah's question flow; Playwright walks the owner's website end to end.",
    tools: ["Vitest", "Playwright"],
    tests: true,
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

// Every skill used in a project belongs to one job, so nothing in skills.ts goes missing here.
for (const item of allSkills) {
  if (item.projects?.length && !jobs.some((job) => job.tools.includes(item.name))) {
    throw new Error(`skills.ts lists "${item.name}" in a project, but no toolkit job names it.`);
  }
}

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
