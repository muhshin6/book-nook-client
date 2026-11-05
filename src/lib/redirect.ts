const SAFE_FALLBACK = "/";

/**
 * Returns a same-origin path that is safe to use as a post-login redirect.
 * External URLs and protocol-relative paths fall back to the home page.
 */
export function getSafeNextPath(
  value: string | null | undefined,
  fallback = SAFE_FALLBACK
): string {
  if (!value) return fallback;

  const candidate = value.trim();

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  try {
    const base = new URL("http://booknook.local");
    const url = new URL(candidate, base);

    if (url.origin !== base.origin) {
      return fallback;
    }

    if (
      url.pathname === "/login" ||
      url.pathname === "/register" ||
      url.pathname === "/forgot-password" ||
      url.pathname === "/reset-password"
    ) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function buildLoginPath(next: string): string {
  return `/login?next=${encodeURIComponent(getSafeNextPath(next))}`;
}
