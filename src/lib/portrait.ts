import { publicUrl } from "@/lib/site";

/**
 * The homepage portrait. To swap in a different photo, change `src` (and the
 * crop in `position`). Set `duotone` to false to show the photo in its own
 * colours, which suits a casual portrait that already fits the palette.
 *
 * Paths go through publicUrl because unoptimized next/image does not add basePath.
 */
export const portrait = {
  src: publicUrl("/images/graduation/graduation.jpg"),
  alt: "Mohammed in graduation gown and cap, holding a rolled certificate.",
  width: 2848,
  height: 4288,
  position: "50% 0%",
  duotone: true,
} as const;

/** The graduation photograph used as the centrepiece of the Education chapter. */
export const graduation = {
  src: publicUrl("/images/graduation/graduation.jpg"),
  alt: "Mohammed Bin Shamlan in graduation dress, holding a diploma.",
  width: 2848,
  height: 4288,
  position: "50% 20%",
} as const;

/** The childhood photograph that opens the Education route. Shown in its own colours. */
export const childhood = {
  src: publicUrl("/images/childhood/childhood.jpg"),
  alt: "Mohammed as a child, wearing a white thobe and a red-and-white shemagh with a black agal.",
  width: 900,
  height: 1125,
} as const;

/**
 * Display copy of the QMUL award. The classification line is covered in this copy
 * only; the original document is not published.
 */
export const degree = {
  src: publicUrl("/images/education/degree-certificate.jpg"),
  width: 1131,
  height: 1600,
  alt: "Queen Mary University of London award certificate, Bachelor of Science with Honours in Computer Science. The classification is omitted from this display copy.",
} as const;
