const VINTED_IMAGE_RE =
  /https:\/\/images\d*\.vinted\.net\/t\/([^/]+)\/f800\/(\d+)\.webp\?[^"'\s<>\\]*/g;

/** Strip JSON escape artifacts (e.g. trailing `\` before `"`) from scraped URLs. */
export function sanitizeImageUrl(url) {
  if (!url?.trim()) return "";
  return url.trim().replace(/\\+$/, "");
}

/** Profile / seller avatars often use a different upload timestamp than listing photos. */
function isLikelyAvatar(photoId, timestamp, listingTimestamps) {
  if (photoId.includes("00ffa") && timestamp === "1775561927") return true;
  if (listingTimestamps.size > 0 && !listingTimestamps.has(timestamp)) {
    return timestamp.length === 10 && Number(timestamp) < 1_700_000_000;
  }
  return false;
}

/**
 * Extract up to 8 full-size listing photos from a Vinted item page HTML.
 * @param {string} html
 * @returns {string[]}
 */
export function scrapeVintedImages(html) {
  const matches = [...html.matchAll(VINTED_IMAGE_RE)];
  if (matches.length === 0) return [];

  const timestampCounts = new Map();
  for (const m of matches) {
    const ts = m[2];
    timestampCounts.set(ts, (timestampCounts.get(ts) ?? 0) + 1);
  }

  const listingTimestamps = new Set(
    [...timestampCounts.entries()]
      .filter(([, count]) => count >= 2)
      .map(([ts]) => ts),
  );
  if (listingTimestamps.size === 0) {
    const top = [...timestampCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) listingTimestamps.add(top[0]);
  }

  const byPhotoId = new Map();
  for (const m of matches) {
    const photoId = m[1];
    const timestamp = m[2];
    if (isLikelyAvatar(photoId, timestamp, listingTimestamps)) continue;
    if (listingTimestamps.size > 0 && !listingTimestamps.has(timestamp)) continue;
    byPhotoId.set(photoId, sanitizeImageUrl(m[0]));
  }

  return [...byPhotoId.values()].filter(Boolean).slice(0, 8);
}

export async function fetchVintedListingHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-GB,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Vinted returned ${res.status} for ${url}`);
  }

  return res.text();
}
