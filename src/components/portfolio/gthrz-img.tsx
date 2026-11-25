import type { GthrzShot } from "@/lib/gthrz";

/**
 * A Gthrz phone capture with a 240 px variant beside the 455 px original, so
 * small frames do not download the full image. Cards (PNG) have one size.
 */
export function GthrzImg({
  shot,
  sizes,
  priority = false,
  className,
  decorative = false,
}: {
  shot: GthrzShot;
  sizes: string;
  priority?: boolean;
  className?: string;
  decorative?: boolean;
}) {
  const small = shot.src.endsWith(".jpg") ? shot.src.replace(/\.jpg$/, "-240.jpg") : null;
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
      className={className}
    />
  );
}
