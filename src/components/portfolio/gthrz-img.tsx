import type { GthrzShot } from "@/lib/gthrz";

/**
 * A Gthrz phone capture with a 240 px variant beside the 455 px original, so
 * small frames do not download the full image. Cards have one size. The
 * captures carry their own bezel, with transparent corners, so they render bare.
 */
export function GthrzImg({
  shot,
  sizes,
  priority = false,
  decorative = false,
}: {
  shot: GthrzShot;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const small = shot.variant === "card" ? null : shot.src.replace(/\.webp$/, "-240.webp");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shot.src}
      srcSet={small ? `${small} 240w, ${shot.src} ${shot.width}w` : undefined}
      sizes={small ? sizes : undefined}
      alt={decorative ? "" : shot.alt}
      width={shot.width}
      height={shot.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
