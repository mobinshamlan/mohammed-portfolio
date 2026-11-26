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
  /** How each project used them. The first matching note is the example shown by default. */
  notes?: JobNote[];
  /** Which project's example to show first. Defaults to the first note. */
  lead?: ProjectId;
  /** Show the checked test counts from projects.ts. */
  tests?: boolean;
};

const jobs: Job[] = [
  {
    id: "ai",
    title: "AI that helps people decide",
    line: "Draft replies, explain choices and suggest matches, with facts checked before a booking or match is confirmed.",
    lead: "kashta",
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
        text: "Seet reads prices and dates from the creator’s records. A booking is confirmed when the payment provider reports that the deposit arrived.",
      },
      {
        project: "kashta",
        text: "Kashta compares sites using seven nights of weather and moonlight. AI explains the results, and the app removes any numbers it can’t verify.",
      },
      {
        project: "amanah",
        text: "AI suggests which lost and found reports go together. Staff check the match before the item is handed back.",
      },
    ],
  },
  {
    id: "calls",
    title: "Phone calls in Arabic",
    line: "Give families and ranch workers a way to get or share updates in Arabic over an ordinary phone call.",
    lead: "naqah",
    tools: ["Twilio Voice", "OpenAI Realtime voice", "Python"],
    notes: [
      {
        project: "naqah",
        text: "Naqah calls the ranch worker at the time the owner chooses. It saves the answers and discards the audio.",
      },
      {
        project: "tammeni",
        text: "Lulwa calls parents when they choose and answers questions using their own child’s records.",
      },
    ],
  },
  {
    id: "data",
    title: "Protect private information",
    line: "Give people access only to the records they’re allowed to see, such as school updates for their own children.",
    lead: "tammeni",
    tools: [
      "Supabase",
      "PostgreSQL and row-level security",
      "Postgres triggers and locks",
      "Webhooks and signatures",
      "SQL",
      "FastAPI",
    ],
    notes: [
      { project: "naqah", text: "Ranch owners see records for their own ranch." },
      {
        project: "tammeni",
        text: "Parents can only see their own child’s records. The demo uses fictional school records.",
      },
      {
        project: "seet",
        text: "Seet avoids double-bookings and checks that messages really came through WhatsApp.",
      },
      { project: "amanah", text: "Each organisation can only see its own lost and found reports." },
      {
        project: "gthrz",
        text: "Hosts choose when to share the address and whether guests can see names or photos.",
      },
    ],
  },
  {
    id: "web",
    title: "Websites for Arabic readers",
    line: "Build websites in Saudi Arabic with layouts that read naturally from right to left.",
    tools: ["Next.js", "React", "Tailwind CSS", "Arabic-first, RTL interfaces", "zustand", "TypeScript", "Vercel and Railway"],
    lead: "amanah",
    notes: [
      {
        project: "amanah",
        text: "Amanah works in Arabic, right to left, and in English. A guided demo follows a lost blue umbrella.",
      },
      {
        project: "naqah",
        text: "Naqah’s owner website is in Arabic, with the day’s call drawn as a timeline.",
      },
      {
        project: "kashta",
        text: "Kashta is Arabic-first. You describe the trip in your own words, in Arabic or English.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Apps for iPhone and Android",
    line: "Build for both phones, like an event app where hosts approve guests and choose when to share the address.",
    tools: ["React Native and Expo"],
    lead: "gthrz",
    notes: [
      {
        project: "gthrz",
        text: "Gthrz is one app for both phones. Privacy is set per event: address now or later, guest names and photos on or off.",
      },
    ],
  },
  {
    id: "tests",
    title: "Catch problems before release",
    line: "Automate checks that repeat tasks like answering Naqah’s questions or reviewing updates on the owner’s website.",
    tools: ["Vitest", "Playwright"],
    lead: "naqah",
    notes: [
      {
        project: "naqah",
        text: "Naqah’s checks run the call’s questions and the owner’s website before each release.",
      },
    ],
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
  testCounts: { project: ProjectId; value: string }[];
};

const order = projects.map((project) => project.id);

function testCounts(job: Job) {
  if (!job.tests) {
    return [];
  }
  return projects.flatMap((project) =>
    (project.proof.evidence ?? [])
      .filter((item) => item.kind === "tests")
      .map((item) => ({ project: project.id, value: item.value })),
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
