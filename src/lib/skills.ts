import type { ProjectId } from "@/lib/projects";

/**
 * Skills with evidence. `projects` lists where each one was used, checked
 * against the repositories. `training` marks skills studied during the
 * completed Tuwaiq Academy AI Bootcamp.
 * A skill with neither is listed on the CV or from the QMUL degree.
 */

export type Skill = {
  name: string;
  projects?: ProjectId[];
  training?: boolean;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      {
        name: "TypeScript",
        projects: ["naqah", "tammeni", "seet", "kashta", "amanah", "gthrz"],
      },
      { name: "JavaScript" },
      { name: "Python", projects: ["tammeni"] },
      { name: "SQL", projects: ["naqah", "seet", "amanah", "gthrz"] },
      { name: "Java" },
      { name: "C++" },
    ],
  },
  {
    title: "Web and mobile",
    skills: [
      {
        name: "Next.js",
        projects: ["naqah", "tammeni", "seet", "kashta", "amanah"],
      },
      { name: "React", projects: ["naqah", "tammeni", "seet", "kashta", "amanah"] },
      { name: "React Native and Expo", projects: ["gthrz"] },
      {
        name: "Tailwind CSS",
        projects: ["naqah", "tammeni", "kashta", "amanah"],
      },
      { name: "Arabic and right-to-left interfaces", projects: ["naqah", "tammeni", "seet", "kashta", "amanah"] },
      { name: "zustand", projects: ["naqah"] },
      { name: "Zod", projects: ["kashta"] },
    ],
  },
  {
    title: "Backend and data",
    skills: [
      {
        name: "Supabase",
        projects: ["naqah", "tammeni", "seet", "amanah", "gthrz"],
      },
      {
        name: "PostgreSQL and row-level security",
        projects: ["naqah", "tammeni", "seet", "amanah", "gthrz"],
      },
      { name: "Postgres triggers and locks", projects: ["seet"] },
      { name: "FastAPI", projects: ["tammeni"] },
      { name: "Webhooks and signatures", projects: ["seet"] },
      { name: "Open-Meteo and SunCalc", projects: ["kashta"] },
      { name: "Vercel and Railway", projects: ["naqah", "tammeni", "seet", "amanah"] },
    ],
  },
  {
    title: "AI",
    skills: [
      { name: "OpenAI Realtime voice", projects: ["naqah", "tammeni"] },
      { name: "Twilio Voice", projects: ["naqah", "tammeni"] },
      { name: "Anthropic Claude with tools", projects: ["seet"] },
      { name: "Google Gemini", projects: ["amanah"] },
      { name: "Llama 4 Scout on Cloudflare Workers AI", projects: ["kashta"] },
      { name: "Guarding model output with schemas", projects: ["kashta", "seet"] },
      { name: "Prompt engineering", training: true },
      { name: "AI evaluation", training: true },
    ],
  },
  {
    title: "Tools and testing",
    skills: [
      { name: "Git and GitHub" },
      { name: "Vitest", projects: ["naqah"] },
      { name: "Playwright", projects: ["naqah"] },
      { name: "Figma" },
      { name: "Debugging" },
    ],
  },
  {
    title: "Coursework at QMUL",
    skills: [
      { name: "Object-oriented programming" },
      { name: "Algorithms and data structures" },
      { name: "Database systems" },
      { name: "Software engineering" },
      { name: "Operating systems" },
      { name: "Networks" },
      { name: "Web technology" },
    ],
  },
];
