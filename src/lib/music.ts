/**
 * Favourite artists, in the order they appear on the shelf.
 * Add `image` to show a photo on the record instead of the typographic disc.
 */
export type Artist = {
  name: string;
  image?: {
    src: string;
    /** Photographer or source, shown to screen readers and on hover. */
    credit?: string;
  };
};

export const artists: Artist[] = [
  { name: "Lana Del Rey" },
  { name: "TV Girl" },
  { name: "The Smiths" },
  { name: "The Cure" },
  { name: "Cigarettes After Sex" },
  { name: "Mac DeMarco" },
  { name: "Jeff Buckley" },
  { name: "Current Joys" },
  { name: "Ramy Sabry" },
  { name: "Ramy Gamal" },
  { name: "Abdul Majeed Abdullah" },
  { name: "Rashed Al-Majed" },
];
