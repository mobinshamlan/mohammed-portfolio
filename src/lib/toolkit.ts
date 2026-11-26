import { projectById, projects, type ProjectId } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

export type ToolkitProjectId = Exclude<ProjectId, "experiment">;

function isWorkChapter(id: ProjectId): id is ToolkitProjectId {
  return id !== "experiment";
}

export const toolkitProjects = projects.map(({ id }) => id).filter(isWorkChapter);

const projectEvidence = new Map(
  skillGroups.flatMap(({ skills }) =>
    skills.map(({ name, projects = [] }) => [name, projects.filter(isWorkChapter)] as const),
  ),
);

function tool<Mark extends string>(
  name: string,
  mark: Mark,
  usedIn: readonly ToolkitProjectId[],
) {
  return { name, mark, projects: usedIn };
}

function skill<Mark extends string>(name: string, mark: Mark, evidence = name) {
  return tool(name, mark, projectEvidence.get(evidence) ?? []);
}

function stackTool<Mark extends string>(name: string, mark: Mark) {
  return tool(name, mark, toolkitProjects.filter((id) => projectById[id].stack.includes(name)));
}

const vercelProjects = toolkitProjects.filter((id) =>
  projectById[id].links.some(({ href }) => /^https:\/\/[^/]+\.vercel\.app(?:\/|$)/.test(href)),
);

export const toolkitGroups = [
  {
    title: "AI & messaging",
    tools: [
      skill("OpenAI Realtime", "openai", "OpenAI Realtime voice"),
      skill("Twilio Voice", "twilio"),
      skill("Anthropic Claude", "claude", "Anthropic Claude with tools"),
      skill("Google Gemini", "gemini"),
      skill("Llama 4 Scout", "llama", "Llama 4 Scout on Cloudflare Workers AI"),
      stackTool("WhatsApp Cloud API", "whatsapp"),
    ],
  },
  {
    title: "Web interfaces",
    tools: [
      skill("Next.js", "next"),
      skill("React", "react"),
      skill("TypeScript", "typescript"),
      skill("Tailwind CSS", "tailwind"),
    ],
  },
  {
    title: "Phone apps",
    tools: [
      skill("React Native", "react", "React Native and Expo"),
      skill("Expo", "expo", "React Native and Expo"),
    ],
  },
  {
    title: "Servers & data",
    tools: [
      skill("Supabase", "supabase"),
      skill("PostgreSQL", "postgres", "PostgreSQL and row-level security"),
      skill("SQL", "sql"),
      skill("Python", "python"),
      skill("FastAPI", "fastapi"),
      skill("Open-Meteo", "weather", "Open-Meteo and SunCalc"),
    ],
  },
  {
    title: "Testing & hosting",
    tools: [
      skill("Vitest", "vitest"),
      skill("Playwright", "playwright"),
      tool("Vercel", "vercel", vercelProjects),
      stackTool("Railway", "railway"),
    ],
  },
].map((group) => ({
  ...group,
  tools: group.tools.filter(({ projects }) => projects.length > 0),
}));

export type ToolkitMark = (typeof toolkitGroups)[number]["tools"][number]["mark"];
