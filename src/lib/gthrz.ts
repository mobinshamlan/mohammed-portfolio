import { publicUrl } from "@/lib/site";

export type GthrzShot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  variant?: "phone" | "card";
};

const phone = { width: 455, height: 952 } as const;

export const gthrzShots = {
  welcome: {
    src: publicUrl("/images/projects/gthrz/welcome.webp"),
    alt: "Gthrz welcome screen with Get started and Log in.",
    caption: "Welcome",
    ...phone,
  },
  home: {
    src: publicUrl("/images/projects/gthrz/home.webp"),
    alt: "Gthrz home screen with upcoming events and a button to create an event.",
    caption: "Home",
    ...phone,
  },
  discover: {
    src: publicUrl("/images/projects/gthrz/discover.webp"),
    alt: "Gthrz Discover screen showing public events.",
    caption: "Discover",
    ...phone,
  },
  events: {
    src: publicUrl("/images/projects/gthrz/events.webp"),
    alt: "Gthrz Events screen showing hosted and pending gatherings.",
    caption: "Events",
    ...phone,
  },
  details: {
    src: publicUrl("/images/projects/gthrz/event-details.webp"),
    alt: "Gthrz event details showing when the address is shared and whether guests need approval.",
    caption: "Event details",
    ...phone,
  },
  detailsMore: {
    src: publicUrl("/images/projects/gthrz/event-details2.webp"),
    alt: "Gthrz event page showing the lineup and what guests are bringing.",
    caption: "Guest planning",
    ...phone,
  },
  create: {
    src: publicUrl("/images/projects/gthrz/create-event.webp"),
    alt: "Gthrz new event form for title, time, and category.",
    caption: "Create event",
    ...phone,
  },
  privacy: {
    src: publicUrl("/images/projects/gthrz/create-event-settings.webp"),
    alt: "Gthrz settings for sharing the address, guest names and photos.",
    caption: "Privacy controls",
    ...phone,
  },
  plannerStart: {
    src: publicUrl("/images/projects/gthrz/ai-planner-start.webp"),
    alt: "Gthrz Smart Planner prompt to generate an event plan.",
    caption: "Smart Planner",
    width: 446,
    height: 236,
    variant: "card",
  },
  plannerPrompt: {
    src: publicUrl("/images/projects/gthrz/ai-planner-prompt.webp"),
    alt: "Gthrz Smart Planner with a written event description.",
    caption: "Planner prompt",
    width: 446,
    height: 355,
    variant: "card",
  },
  plannerSuggestions: {
    src: publicUrl("/images/projects/gthrz/ai-planner-suggestions.webp"),
    alt: "Gthrz Smart Planner suggestions applied to an event draft.",
    caption: "Planner suggestions",
    width: 446,
    height: 331,
    variant: "card",
  },
  profile: {
    src: publicUrl("/images/projects/gthrz/Profile.webp"),
    alt: "Gthrz profile with saved and hosted events.",
    caption: "Profile",
    ...phone,
  },
} as const satisfies Record<string, GthrzShot>;

/**
 * What a guest can read at each state, for an event whose host chose
 * "reveal the address later" and left guest names on. Title, time and
 * category are always visible. The database checks access to the other details.
 */
export const gthrzVisibility = {
  columns: ["Area", "Exact address", "Guest list"],
  rows: [
    { state: "Event found", values: [false, false, false] },
    { state: "Request sent", values: [false, false, false] },
    { state: "Approved", values: [true, false, true] },
    { state: "Address shared", values: [true, true, true] },
  ],
} as const;
