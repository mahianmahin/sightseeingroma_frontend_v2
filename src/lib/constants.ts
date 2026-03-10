// Centralized constants — replaces Utilities.jsx baseUrl/baseUrlHashless/baseMediaUrl
// Use PUBLIC_ prefix so these are available in both server and client code

export const API_URL = import.meta.env.PUBLIC_API_URL || 'https://api.sightseeingroma.com';
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.sightseeingroma.com';

// Backward-compatible aliases for React components that still use the old names
export const baseUrl = `${API_URL}/`;
export const baseUrlHashless = API_URL;
export const baseMediaUrl = `${API_URL}/media/`;
