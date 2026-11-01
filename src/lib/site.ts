/** GitHub Pages project site lives under this path. Keep in sync with next.config.ts. */
export const BASE_PATH = "/mohammed-portfolio";

/**
 * Prefix a public-folder or downloaded file URL. Do not use this on next/link
 * hrefs or next/image src — those already receive basePath from Next.js.
 */
export function publicUrl(path: string) {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("mailto:")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === BASE_PATH || normalized.startsWith(`${BASE_PATH}/`)) {
    return normalized;
  }

  return `${BASE_PATH}${normalized}`;
}

/** Strip a trailing slash so route checks still work with trailingSlash: true. */
export function appPath(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "") || "/";
}
