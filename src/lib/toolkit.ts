import type { ProjectId } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

type Capability = {
  title: string;
  example: string;
  project: ProjectId;
};

export const toolkit: readonly Capability[] = [
  {
    title: "Phone calls in Arabic",
    example: "Collect daily ranch updates.",
    project: "naqah",
  },
  {
    title: "AI assistants",
    example: "Quote prices and check dates.",
    project: "seet",
  },
  {
    title: "Websites in Arabic",
    example: "Report and track lost items.",
    project: "amanah",
  },
  {
    title: "Keep records private",
    example: "Show parents only their child’s school records.",
    project: "tammeni",
  },
  {
    title: "iPhone & Android apps",
    example: "Only approved guests see the address.",
    project: "gthrz",
  },
  {
    title: "Checks before launch",
    example: "Check how weather affects campsite scores.",
    project: "kashta",
  },
];

const selectedTools = new Set([
  "TypeScript",
  "Python",
  "SQL",
  "Next.js",
  "React",
  "React Native and Expo",
  "Tailwind CSS",
  "FastAPI",
  "Supabase",
  "PostgreSQL and row-level security",
  "OpenAI Realtime voice",
  "Twilio Voice",
  "Anthropic Claude with tools",
  "Google Gemini",
  "Llama 4 Scout on Cloudflare Workers AI",
  "Vitest",
  "Playwright",
]);

export const toolkitTools = skillGroups.flatMap(({ title, skills }) => {
  const names = skills
    .filter(({ name, projects }) => projects?.length && selectedTools.has(name))
    .map(({ name }) => name);

  return names.length ? [{ title, names }] : [];
});
