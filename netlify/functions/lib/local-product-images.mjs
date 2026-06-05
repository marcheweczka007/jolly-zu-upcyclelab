import manifest from "./shop-images-manifest.mjs";

/**
 * Gallery paths served from public/shop-images/{stripeProductId}/.
 * Relative URLs work on localhost and production.
 * @param {string} stripeProductId
 * @returns {string[] | null}
 */
export function localGalleryUrls(stripeProductId) {
  const urls = manifest[stripeProductId];
  if (!Array.isArray(urls) || urls.length === 0) return null;
  return urls.slice(0, 8);
}
