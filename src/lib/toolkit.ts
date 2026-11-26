import type { ProjectId } from "@/lib/projects";
import { skillGroups } from "@/lib/skills";

type Capability = {
  title: string;
  example: string;
  project: ProjectId;
};

export const toolkit: readonly Capability[] = [
  {
    title: "Voice assistants",
    example: "Turn camel ranch calls into daily reports.",
    project: "naqah",
  },
  {
    title: "Scheduled alerts",
    example: "Let parents schedule school calls or texts.",
    project: "tammeni",
  },
  {
    title: "Booking systems",
    example: "Book influencer ads over WhatsApp.",
    project: "seet",
  },
  {
    title: "Forecast analysis",
    example: "Rank camping nights by wind and dust.",
    project: "kashta",
  },
  {
    title: "Web apps",
    example: "Track lost items through private links.",
    project: "amanah",
  },
  {
    title: "iPhone & Android apps",
    example: "Show event addresses to approved guests.",
    project: "gthrz",
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

const toolGroupLabels: Record<string, string> = {
  Languages: "Programming languages",
  "Web and mobile": "Websites and apps",
  "Backend and data": "Data and accounts",
  AI: "AI and phone calls",
  "Tools and testing": "Automated testing",
};

export const toolkitTools = skillGroups.flatMap(({ title, skills }) => {
  const names = skills
    .filter(({ name, projects }) => projects?.length && selectedTools.has(name))
    .map(({ name }) => name);

  return names.length ? [{ title: toolGroupLabels[title] ?? title, names }] : [];
});
