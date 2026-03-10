/**
 * No-op shim for react-helmet-async.
 *
 * In the Astro architecture, all SEO meta tags are handled by the Astro
 * layouts (<head> in BaseLayout.astro). Legacy React components that use
 * <Helmet> will simply render nothing — their children are ignored.
 *
 * Aliased via Vite: 'react-helmet-async' → this file
 */

// Helmet: renders its children as-is (they'll be invisible in <body> anyway
// since <title>, <meta>, <link>, <script> inside body are harmless)
// But to be safe, render nothing.
export function Helmet({ children }) {
  return null;
}

// HelmetProvider: just passes through children
export function HelmetProvider({ children }) {
  return children;
}

// HelmetData: no-op
export class HelmetData {
  constructor() {}
}

export default { Helmet, HelmetProvider, HelmetData };
