/**
 * useActiveOffers.jsx — Pure utility helpers for offer data.
 *
 * ALL offer data is fetched SERVER-SIDE in index.astro and passed as props
 * through Services → Card. No client-side API fetch happens here.
 */

/**
 * Check if a package has an active offer.
 * @param {Record<string, any>} activeOffers — server-provided offers-by-package map
 * @param {string} packageTag — the package identifier to look up
 * @returns {object|null} — the offer object or null
 */
export const getOfferForPackage = (activeOffers, packageTag) => {
    if (!activeOffers || !packageTag) return null;
    return activeOffers[packageTag] || null;
};

export default getOfferForPackage;
