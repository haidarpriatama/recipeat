export const DEFAULT_RECIPE_IMAGE = "";

export function getSafeImageSrc(src, fallback = DEFAULT_RECIPE_IMAGE) {
  if (typeof src !== "string") {
    return fallback;
  }

  const normalizedSrc = src.trim();

  if (!normalizedSrc) {
    return fallback;
  }

  if (normalizedSrc.startsWith("//")) {
    return `https:${normalizedSrc}`;
  }

  if (normalizedSrc.startsWith("/")) {
    return normalizedSrc;
  }

  try {
    const { protocol } = new URL(normalizedSrc);

    if (protocol === "https:" || protocol === "http:") {
      return normalizedSrc;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
