/**
 * Shared portfolio content for Mohammed Bin Shamlan.
 * Version A imports this module. A later version can import it as well.
 */

export const portfolio = {
  name: "Mohammed Bin Shamlan",
  title: "Software & AI product developer",
  location: "Saudi Arabia",
  summary:
    "Mohammed Bin Shamlan is a software and AI product developer in Saudi Arabia, open to work. He studied computer science at Queen Mary University of London and completed the AI Bootcamp using Meta tools at Tuwaiq Academy.",
  education: [
    {
      qualification: "BSc Computer Science (Hons)",
      institution: "Queen Mary University of London",
      period: "Graduated in 2026",
      detail: "",
      status: "completed",
    },
    {
      qualification: "AI Bootcamp",
      institution: "Tuwaiq Academy",
      period: "18 Oct – 12 Nov 2026",
      detail: "Completed using Meta tools.",
      status: "completed",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React Native",
    "Next.js",
    "Supabase",
    "PostgreSQL",
    "Git and GitHub",
  ],
  projects: [
    {
      name: "Gthrz",
      summary:
        "A privacy-first mobile event planning application built using React Native, Expo, TypeScript, and Supabase.",
    },
    {
      name: "AMANAH",
      summary:
        "An AI-assisted lost-and-found web application project using Next.js and TypeScript.",
    },
  ],
  interests: [
    "Software development",
    "Artificial intelligence",
    "Music",
    "Gaming",
    "Photography",
  ],
  contact: {
    introduction: "Write about a project, a role, or a question.",
  },
} as const;

export type Portfolio = typeof portfolio;
