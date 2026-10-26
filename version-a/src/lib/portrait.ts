/**
 * The homepage portrait. To swap in a different photo, change `src` (and the
 * crop in `position`). Set `duotone` to false to show the photo in its own
 * colours, which suits a casual portrait that already fits the palette.
 */
export const portrait = {
  src: "/images/graduation/graduation.jpg",
  alt: "Mohammed in graduation gown and cap, holding a rolled certificate.",
  width: 2848,
  height: 4288,
  position: "50% 0%",
  duotone: true,
} as const;

/** The graduation photograph used as the centrepiece of the Education chapter. */
export const graduation = {
  src: "/images/graduation/graduation.jpg",
  alt: "Mohammed Bin Shamlan in graduation dress, holding a diploma.",
  width: 2848,
  height: 4288,
  position: "50% 20%",
} as const;
