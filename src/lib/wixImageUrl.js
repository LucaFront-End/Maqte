// =============================================================
// Wix Image URL Helper
//
// Wix stores images in a proprietary format: wix:image://v1/{mediaId}/{filename}
// This helper converts them to standard HTTP URLs via wixstatic.com CDN.
// =============================================================

/**
 * Convert a Wix internal image URL to a standard HTTP URL.
 *
 * @param {string | undefined | null} wixImageUrl — The image URL from Wix product data
 * @param {number} [width]  — Optional resize width
 * @param {number} [height] — Optional resize height
 * @returns {string | null}  — HTTP URL or null if invalid
 */
export function getWixImageUrl(wixImageUrl, width, height) {
  if (!wixImageUrl) return null;

  // Already a standard HTTP URL — return as-is
  if (wixImageUrl.startsWith("http")) {
    return wixImageUrl;
  }

  // Wix internal format: wix:image://v1/{mediaId}/{filename}#originWidth=...
  if (wixImageUrl.startsWith("wix:image://")) {
    const match = wixImageUrl.match(/wix:image:\/\/v1\/([^/]+)\//);
    if (match && match[1]) {
      const mediaId = match[1];
      let url = `https://static.wixstatic.com/media/${mediaId}`;

      // Optional resizing via Wix media API
      if (width || height) {
        const w = width || "";
        const h = height || "";
        url += `/v1/fill/w_${w},h_${h}/image.jpg`;
      }

      return url;
    }
  }

  return null;
}

/**
 * Extract the main product image URL from a Wix product object.
 *
 * @param {object} product — Wix product object
 * @returns {string | null} — HTTP image URL
 */
export function getProductImageUrl(product) {
  if (!product) return null;

  // Try mainMedia first
  const mainImage = product.media?.mainMedia?.image?.url;
  if (mainImage) return getWixImageUrl(mainImage) || mainImage;

  // Fallback to first media item
  const firstItem = product.media?.items?.[0]?.image?.url;
  if (firstItem) return getWixImageUrl(firstItem) || firstItem;

  return null;
}

/**
 * Get all product image URLs from a Wix product object.
 *
 * @param {object} product — Wix product object
 * @returns {string[]} — Array of HTTP image URLs
 */
export function getAllProductImages(product) {
  if (!product?.media?.items) return [];

  return product.media.items
    .filter((item) => item.image?.url)
    .map((item) => getWixImageUrl(item.image.url) || item.image.url);
}
