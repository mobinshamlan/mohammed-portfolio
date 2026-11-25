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
    src: publicUrl("/images/projects/gthrz/welcome.jpg"),
    alt: "Gthrz welcome screen with Get started and Log in.",
    caption: "Welcome",
    ...phone,
  },
  home: {
    src: publicUrl("/images/projects/gthrz/home.jpg"),
    alt: "Gthrz home screen with upcoming events and create controls.",
    caption: "Home",
    ...phone,
  },
  discover: {
    src: publicUrl("/images/projects/gthrz/discover.jpg"),
    alt: "Gthrz Discover screen browsing public events.",
    caption: "Discover",
    ...phone,
  },
  events: {
    src: publicUrl("/images/projects/gthrz/events.jpg"),
    alt: "Gthrz Events screen showing hosted and pending gatherings.",
    caption: "Events",
    ...phone,
  },
  details: {
    src: publicUrl("/images/projects/gthrz/event-details.jpg"),
    alt: "Gthrz event details with delayed location reveal, capacity, and RSVP approval.",
    caption: "Event details",
    ...phone,
  },
  detailsMore: {
    src: publicUrl("/images/projects/gthrz/event-details2.jpg"),
    alt: "Gthrz event details continued, with lineup and guest claims.",
    caption: "Guest planning",
    ...phone,
  },
  create: {
    src: publicUrl("/images/projects/gthrz/create-event.jpg"),
    alt: "Gthrz new event form for title, time, and category.",
    caption: "Create event",
    ...phone,
  },
  privacy: {
    src: publicUrl("/images/projects/gthrz/create-event-settings.jpg"),
    alt: "Gthrz privacy settings for location reveal, guest names, and photos.",
    caption: "Privacy controls",
    ...phone,
  },
  plannerStart: {
    src: publicUrl("/images/projects/gthrz/ai-planner-start.jpg"),
    alt: "Gthrz Smart Planner prompt to generate an event plan.",
    caption: "Smart Planner",
    width: 446,
    height: 236,
    variant: "card",
  },
  plannerPrompt: {
    src: publicUrl("/images/projects/gthrz/ai-planner-prompt.jpg"),
    alt: "Gthrz Smart Planner with a written event description.",
    caption: "Planner prompt",
    width: 446,
    height: 355,
    variant: "card",
  },
  plannerSuggestions: {
    src: publicUrl("/images/projects/gthrz/ai-planner-suggestions.jpg"),
    alt: "Gthrz Smart Planner suggestions applied to an event draft.",
    caption: "Planner suggestions",
    width: 446,
    height: 331,
    variant: "card",
  },
  profile: {
    src: publicUrl("/images/projects/gthrz/Profile.jpg"),
    alt: "Gthrz profile with saved events and events created.",
    caption: "Profile",
    ...phone,
  },
} as const satisfies Record<string, GthrzShot>;

/**
 * What a guest can read at each state, for an event whose host chose
 * "reveal the address later" and left guest names on. Title, time and
 * category are always visible; row-level security enforces the rest.
 */
export const gthrzVisibility = {
  columns: ["Address", "Exact pin", "Guest list"],
  rows: [
    { state: "Discovered", values: [false, false, false] },
    { state: "Requested", values: [false, false, false] },
    { state: "Approved", values: [true, false, true] },
    { state: "Revealed by host", values: [true, true, true] },
  ],
} as const;
