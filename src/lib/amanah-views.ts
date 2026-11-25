/** One Amanah match as each side sees it: staff decide, the claimant proves ownership privately. */
export const amanahViews = [
  {
    who: "Staff see",
    items: [
      { text: "Both reports, lost and found" },
      { text: "Gemini’s suggested match" },
      { text: "The answers; approve or reject, logged" },
    ],
  },
  {
    who: "The claimant sees",
    items: [
      { text: "Their own report, on a private link" },
      { text: "One question:", ar: "وش لون المقبض؟" },
      { text: "Never the finder’s report" },
    ],
  },
] as const;
