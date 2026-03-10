/**
 * Centralized server-side API helpers.
 * These run at build time (SSG) or on the edge (SSR) — never shipped to the browser.
 * Every function returns plain JSON; Astro pages pass data as props to components.
 */

import { API_URL } from './constants';

// ─── Generic fetcher ────────────────────────────────────────────────
async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

// ─── Packages & Folders ─────────────────────────────────────────────
export async function getPackages() {
  return apiFetch('/packages/');
}

export async function getPackagesByCompany(companySlug: string) {
  return apiFetch(`/packages/${companySlug}/`);
}

export async function getPackageDetail(companySlug: string, folderSlug: string) {
  return apiFetch(`/packages/${companySlug}/${folderSlug}/`);
}

// ─── Static Content ─────────────────────────────────────────────────
export async function getStaticContent(slug: string) {
  return apiFetch(`/static-content/${slug}/`);
}

// ─── Featured Offers ────────────────────────────────────────────────
export async function getFeaturedOffers() {
  return apiFetch('/featured-offers/');
}

export async function getFeaturedOffer(id: number | string) {
  return apiFetch(`/featured-offers/${id}/`);
}

export async function getFeaturedOffersByPackage() {
  return apiFetch('/featured-offers/by-package/');
}

export async function getFeaturedOfferBySlug(slug: string) {
  return apiFetch(`/featured-offers/by-slug/${slug}/`);
}

// ─── Website Settings ───────────────────────────────────────────────
export async function getWebsiteSettings() {
  return apiFetch('/website-settings/');
}

export async function getGlobalHeadCode() {
  return apiFetch('/website-settings/global-head-code/');
}

// ─── Reviews ────────────────────────────────────────────────────────
export async function getReviews() {
  return apiFetch('/reviews/');
}

// ─── Blogs ──────────────────────────────────────────────────────────
export async function getBlogPosts() {
  return apiFetch('/blog/');
}

export async function getBlogPost(slug: string) {
  return apiFetch(`/blog/${slug}/`);
}

export async function getBlogCategories() {
  return apiFetch('/blog/categories/');
}

// ─── Companies ──────────────────────────────────────────────────────
export async function getCompanies() {
  return apiFetch('/companies/');
}

export async function getCompany(slug: string) {
  return apiFetch(`/companies/${slug}/`);
}

// ─── Cards (Why Book / Services) ────────────────────────────────────
export async function getCards() {
  return apiFetch('/cards/');
}

// ─── Contact ────────────────────────────────────────────────────────
export async function submitContactForm(data: Record<string, unknown>) {
  return apiFetch('/contact/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Newsletter ─────────────────────────────────────────────────────
export async function subscribeNewsletter(email: string) {
  return apiFetch('/newsletter/subscribe/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// ─── Similar Packages ───────────────────────────────────────────────
export async function getSimilarPackages() {
  return apiFetch('/similar-packages/');
}

// ─── Recommended Services ───────────────────────────────────────────
export async function getRecommendedServices() {
  return apiFetch('/recommended-services/');
}

// ─── Content Blocks ─────────────────────────────────────────────────
export async function getContentBlock(pageSlug: string) {
  return apiFetch(`/content-blocks/?page=${pageSlug}`);
}

// ─── Promo Banners ──────────────────────────────────────────────────
export async function getPromoBanners() {
  return apiFetch('/promo-banners/');
}
