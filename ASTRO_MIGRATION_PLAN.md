# Astro Migration Plan — SightseeingRoma Frontend

> **Goal:** Migrate the entire React/Vite SPA to Astro 6 with SSR/SSG, deploy on Node.js host (Cloudflare Pages pending picomatch fix). Target FCP < 1s, LCP < 1s, Performance 90+.
>
> **Date Created:** March 10, 2026  
> **Last Updated:** March 11, 2026  
> **Branch:** `astro`

---

## 🎉 Migration Status: COMPLETE

| Phase | Description | Status | Commit |
|-------|-------------|--------|--------|
| 1 | Astro Project Scaffold | ✅ Done | `5f0fbf6f` |
| 2 | Shared Foundation (Layout, Navbar, Footer) | ✅ Done | `6f247fba` |
| 3 | Homepage (SSG) | ✅ Done | `52e695ce` |
| 4 | SEO-Critical Public Pages (SSG) | ✅ Done | `215aa358` |
| 5 | Dynamic Public Pages (SSR) | ✅ Done | `f2299c0b` |
| 6 | Auth & User Pages (Client Islands) | ✅ Done | `3aec1607` |
| 7 | Admin Pages (Client Islands) | ✅ Done | `a062932f` |
| 8 | Global Concerns (SEO, Headers, Robots) | ✅ Done | `a062932f` |
| 9 | Production Build (Node Adapter) | ✅ Done | `0dd79a2e` |
| 10 | Legacy Cleanup | ✅ Done | `0dd79a2e` |

### Build Stats
- **Build time:** ~20 seconds
- **Static pages:** 12 pre-rendered
- **SSR pages:** 20+ server-rendered on demand
- **All routes verified:** 30+ URLs returning correct status codes

### Performance (Production, localhost)
| Page | TTFB | Size | Type |
|------|------|------|------|
| `/` (Homepage) | **3ms** | 56KB | Static (SSG) |
| `/about-us` | **1.7ms** | 37KB | Static (SSG) |
| `/login` | **1.4ms** | 10KB | Static shell + island |
| `/blogs` | 2.2s | 34KB | SSR (API-bound) |
| `/featured-offers` | 0.6s | 33KB | SSR (API-bound) |
| `/checkout` | 0.2s | 19KB | SSR shell + island |

### Architecture
- **Astro 6.0.0** with `output: 'static'`, per-page SSR via `export const prerender = false`
- **@astrojs/node@10.0.0** standalone mode adapter (production)
- **@astrojs/react@5.0.0** for React islands (`client:visible`, `client:idle`, `client:media`, `client:load`)
- **Vite aliases:** `react-router-dom` → router-shim.jsx, `react-helmet-async` → helmet-shim.jsx
- **Build output:** `dist/client/` (static) + `dist/server/entry.mjs` (SSR)
- **Run:** `HOST=0.0.0.0 PORT=4322 node dist/server/entry.mjs`

### Known Issues
1. **@astrojs/cloudflare blocked:** picomatch CJS `require()` crashes in Workerd runtime. Using Node adapter as interim. Monitor astro-cloudflare releases.
2. **SSR page TTFB:** Dominated by backend API response time, not Astro overhead. Consider edge caching or `stale-while-revalidate`.
3. **`prop-types` warning:** Harmless console warnings from legacy components during SSR. Cosmetic only.

---

## Table of Contents

1. [Current Architecture Snapshot](#1-current-architecture-snapshot)
2. [Target Architecture](#2-target-architecture)
3. [Rendering Strategy Per Page](#3-rendering-strategy-per-page)
4. [Phase 0 — Pre-Migration Prep](#phase-0--pre-migration-prep)
5. [Phase 1 — Astro Project Scaffold](#phase-1--astro-project-scaffold)
6. [Phase 2 — Shared Foundation (Layout, Navbar, Footer)](#phase-2--shared-foundation)
7. [Phase 3 — Homepage (SSG, Highest Priority)](#phase-3--homepage)
8. [Phase 4 — SEO-Critical Public Pages (SSG)](#phase-4--seo-critical-public-pages)
9. [Phase 5 — Dynamic Public Pages (SSR)](#phase-5--dynamic-public-pages)
10. [Phase 6 — Auth & User Pages (Client-Only)](#phase-6--auth--user-pages)
11. [Phase 7 — Admin/Editor Pages (Client-Only)](#phase-7--admineditor-pages)
12. [Phase 8 — Global Concerns (SEO, Analytics, Sitemap)](#phase-8--global-concerns)
13. [Phase 9 — Cloudflare Deployment](#phase-9--cloudflare-deployment)
14. [Phase 10 — Cleanup & Verification](#phase-10--cleanup--verification)
15. [API Endpoint Catalogue](#api-endpoint-catalogue)
16. [Component Migration Map](#component-migration-map)
17. [Files to Delete (React Patches)](#files-to-delete)
18. [Risk Register](#risk-register)

---

## 1. Current Architecture Snapshot

| Aspect | Current |
|--------|---------|
| Framework | React 18.2 + Vite 7.3 (SPA) |
| Routing | react-router-dom v6 (createBrowserRouter, 30+ routes) |
| Styling | Tailwind CSS 3.4 + DaisyUI 4.12 + tailwindcss-animate |
| UI Library | shadcn/ui (Radix Dialog, Slot) + custom components |
| SEO | react-helmet-async (client-side, invisible to crawlers) |
| State | React Context (ActiveOffers, Auth, ResetPassword) |
| Auth | JWT (localStorage access/refresh tokens) |
| Payments | Stripe (Embedded Checkout) |
| Admin CMS | EditPanelSheet (Monaco editor, media library) |
| Hosting | Netlify (static dist/ upload) |
| Backend | Django REST Framework at `api.sightseeingroma.com` |
| Performance Patches | LazySection, deferredFetch, Suspense boundaries, Early Hints, preloads |

### Current Dependencies (to keep/replace/drop)
| Dependency | Keep | Replace | Drop | Notes |
|------------|------|---------|------|-------|
| react, react-dom | ✅ | | | Astro React integration |
| react-router-dom | | | ✅ | Astro file-based routing |
| react-helmet-async | | | ✅ | Astro `<head>` in layouts |
| tailwindcss + daisyui | ✅ | | | @astrojs/tailwind |
| @stripe/react-stripe-js | ✅ | | | Client island |
| @monaco-editor/react | ✅ | | | Admin client island |
| chart.js, react-chartjs-2 | ✅ | | | Admin client island |
| react-icons | ✅ | | | Used everywhere |
| axios | ✅ | | | Minimal usage (axiosSecure) |
| firebase | ✅ | | | Keep if used for auth |
| date-fns | ✅ | | | Date formatting |
| react-hot-toast | ✅ | | | Client islands |
| react-date-range | ✅ | | | TicketCard client island |
| lucide-react | ✅ | | | Icons in UI components |
| class-variance-authority | ✅ | | | shadcn/ui |
| clsx, tailwind-merge | ✅ | | | shadcn/ui |
| react-spinners | | | ✅ | Replace with CSS |
| react-syntax-highlighter | ✅ | | | Admin: blog code blocks |
| body-parser | | | ✅ | Not used in frontend |
| react-google-charts | ✅ | | | Analytics page |
| query-string | | | ✅ | Use native URLSearchParams |
| prop-types | | | ✅ | Not needed |

---

## 2. Target Architecture

```
Astro 5.x + React 18 (islands)
├── SSG (Static) — Pre-built HTML at build time
│   ├── Homepage (data fetched at build, revalidated via Cloudflare)
│   ├── About Us, Terms, Return Policy, Refund
│   └── Agent Points
├── SSR (Server-Rendered) — On-demand at the edge
│   ├── /blog/:slug (dynamic content)
│   ├── /company-packages/:slug
│   ├── /bus/:companySlug/:companyName
│   ├── /featured-offers
│   ├── /blogs (paginated)
│   └── /compare-tickets
├── Client Islands (React, hydrated on browser)
│   ├── SectionNav (scroll spy)
│   ├── Services (tabs, filters)
│   ├── TicketCard (date picker, counter, checkout)
│   ├── Stripe Checkout
│   ├── Auth forms (Login, Register, Reset Password)
│   ├── Admin panels (EditPanelSheet, FeaturedOffersManager)
│   ├── Navbar mobile menu
│   └── Newsletter form, Contact form
└── Cloudflare Pages (SSR adapter)
```

### Key Astro Principles Applied
1. **Zero JS by default** — Astro ships HTML+CSS. React only loads where `client:*` is specified.
2. **Server-first data fetching** — API calls happen on the server (build or edge), never blocking the browser.
3. **Islands architecture** — Interactive components hydrate independently, not as a monolith.
4. **`<head>` is real HTML** — SEO meta tags, Open Graph, schema.org are in the actual HTML response. No more react-helmet.

---

## 3. Rendering Strategy Per Page

| Route | Current | Target | Reason |
|-------|---------|--------|--------|
| `/` (Home) | SPA + client fetch | **SSG** | Most critical for SEO. Data changes rarely. Rebuild on webhook or schedule. |
| `/aboutus`, `/about-us` | SPA + client fetch | **SSG** | Static content page |
| `/terms` | SPA + client fetch | **SSG** | Static content page |
| `/returnPolicy` | SPA + client fetch | **SSG** | Static content page |
| `/refund` | SPA + client fetch | **SSG** | Static content page |
| `/agentpoints` | SPA + client fetch | **SSG** | Static content page |
| `/offer` | SPA + client fetch | **SSG** | Offer listing, rebuild on webhook |
| `/featured-offers`, `/featured-today`, `/rome-sightseeing-deals` | SPA + client fetch | **SSR** | Dynamic offers with timers |
| `/bus/:companySlug/:companyName` | SPA + client fetch | **SSR** | Dynamic route, SEO important |
| `/company-packages/:companySlug` | SPA + client fetch | **SSR** | Dynamic route, SEO important |
| `/compare-tickets` | SPA + client fetch | **SSR** | Dynamic data |
| `/blogs` | SPA + client fetch | **SSR** | Paginated, SEO critical |
| `/blog/:slug` | SPA + client fetch | **SSR** | SEO critical, dynamic content |
| `/viewsimilar/:hours/:company` | SPA + client fetch | **SSR** | Dynamic route |
| `/login` | SPA (client-only) | **Client island** | Auth form, no SEO value |
| `/registation` | SPA (client-only) | **Client island** | Auth form, no SEO value |
| `/forgot-password` | SPA (client-only) | **Client island** | Auth flow |
| `/reset-password` | SPA (client-only) | **Client island** | Auth flow |
| `/reset-success` | SPA (client-only) | **Client island** | Auth flow |
| `/profile` | SPA (auth required) | **Client island** | Protected, no SEO value |
| `/yourticket` | SPA (auth required) | **Client island** | Protected, no SEO value |
| `/manageBookings/:status/:id` | SPA (client-only) | **Client island** | Protected, no SEO value |
| `/checkout` | SPA (Stripe) | **Client island** | Payment, no SEO value |
| `/payment-return` | SPA (Stripe) | **Client island** | Payment callback |
| `/success` | SPA (client-only) | **Client island** | Payment result |
| `/success/:unique_id/` | SPA (client-only) | **Client island** | Payment result |
| `/cancel` | SPA (client-only) | **Client island** | Payment result |
| `/verify/:code/` | SPA (client-only) | **Client island** | Ticket verification |
| `/analytics` | SPA (admin) | **Client island** | Admin only |
| `/blog-analytics` | SPA (admin) | **Client island** | Admin only |
| `/sitemap.xml` | Proxy to backend | **SSR** | Proxy or generate at build |
| `*` (404) | SPA | **SSG** | Static 404 page |

---

## Phase 0 — Pre-Migration Prep

### Task 0.1: Back up current code
- Ensure the `development` branch has all latest changes committed
- The `astro` branch will be the migration branch

### Task 0.2: Document all backend API endpoints
- [See API Endpoint Catalogue below](#api-endpoint-catalogue)
- Verify CORS on backend allows Cloudflare Pages origin
- Ensure backend returns proper `Cache-Control` headers for SSG/SSR

### Task 0.3: Verify backend CORS for Cloudflare
- Current CORS allows Netlify. Need to add Cloudflare Pages domain.
- Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in Django `settings.py`

### Task 0.4: Set up environment variables
- `PUBLIC_API_URL` = `https://api.sightseeingroma.com`
- `PUBLIC_SITE_URL` = `https://www.sightseeingroma.com`
- `STRIPE_PUBLISHABLE_KEY` (for client)
- Cloudflare env vars for any server-side secrets

---

## Phase 1 — Astro Project Scaffold

### Task 1.1: Initialize Astro project
```bash
npm create astro@latest sightseeingroma-astro
```
- Choose: Empty project, TypeScript (strict or relaxed — recommend relaxed for migration speed)
- Output: `hybrid` (enables both SSG and SSR per-page)

### Task 1.2: Install integrations
```bash
npx astro add react tailwind cloudflare
```
- `@astrojs/react` — React islands support
- `@astrojs/tailwind` — Tailwind CSS integration
- `@astrojs/cloudflare` — SSR adapter for Cloudflare Pages

### Task 1.3: Install shared dependencies
```bash
npm install react-icons react-hot-toast date-fns clsx tailwind-merge class-variance-authority @stripe/react-stripe-js @stripe/stripe-js lucide-react
npm install -D daisyui tailwindcss-animate
```

### Task 1.4: Configure Tailwind
- Copy `tailwind.config.js` from current project
- Update `content` paths to `./src/**/*.{astro,html,js,jsx,ts,tsx}`
- Keep DaisyUI, tailwindcss-animate plugins
- Copy `src/index.css` → `src/styles/global.css`

### Task 1.5: Configure Astro (`astro.config.mjs`)
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',          // SSG by default, opt-in SSR per page
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),  // We import global.css manually
  ],
  site: 'https://www.sightseeingroma.com',
  vite: {
    ssr: {
      external: ['node:buffer'],  // Cloudflare compat
    },
  },
});
```

### Task 1.6: Set up project structure
```
src/
├── components/          # React components (islands)
│   ├── ui/              # shadcn/ui components
│   ├── Hero/
│   ├── Services/
│   ├── Navbar/
│   ├── Footer/
│   ├── ...
├── layouts/
│   ├── BaseLayout.astro     # <html>, <head>, Navbar, Footer, Toaster
│   ├── AuthLayout.astro     # Minimal layout for login/register
│   └── AdminLayout.astro    # Layout for analytics pages
├── pages/
│   ├── index.astro          # Homepage (SSG)
│   ├── about-us.astro       # (SSG)
│   ├── terms.astro          # (SSG)
│   ├── ...
│   ├── blog/
│   │   ├── index.astro      # Blog listing (SSR)
│   │   └── [slug].astro     # Blog detail (SSR)
│   ├── bus/
│   │   └── [...slug].astro  # /bus/:company/:name (SSR)
│   ├── company-packages/
│   │   └── [slug].astro     # (SSR)
│   └── api/                 # Optional: proxy endpoints
├── lib/
│   ├── api.ts               # Centralized fetch helpers for backend
│   └── constants.ts         # baseUrl, baseUrlHashless, etc.
├── styles/
│   └── global.css           # Tailwind + custom CSS
└── assets/                  # Static images (processed by Astro)
    ├── HeroImageWebP.webp
    ├── Logo.webp
    └── ...
```

### Task 1.7: Copy static assets
- Copy `src/assets/` → new `src/assets/`
- Copy `public/` → new `public/` (images, JSON data files, robots.txt)
- Copy `public/robots.txt` (update sitemap URL if needed)

---

## Phase 2 — Shared Foundation

### Task 2.1: Create `src/lib/constants.ts`
```typescript
export const API_URL = import.meta.env.PUBLIC_API_URL || 'https://api.sightseeingroma.com';
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.sightseeingroma.com';
```
- Replaces `baseUrl`, `baseUrlHashless`, `baseMediaUrl` from `Utilities.jsx`

### Task 2.2: Create `src/lib/api.ts` — Server-side fetch helpers
```typescript
import { API_URL } from './constants';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}/${endpoint}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Typed helpers for common endpoints
export async function getPackages() { return fetchAPI('packages/'); }
export async function getStaticContent(slug: string) { return fetchAPI(`static-content/${slug}/`); }
export async function getFeaturedOffers() { return fetchAPI('featured-offers/'); }
export async function getWebsiteSettings() { return fetchAPI('website-settings/'); }
export async function getReviews() { return fetchAPI('reviews/'); }
export async function getCards() { return fetchAPI('api/cards/'); }
export async function getBlogPosts(params?: string) { return fetchAPI(`blog/posts/?${params || ''}`); }
export async function getBlogPost(slug: string) { return fetchAPI(`blog/posts/${slug}/`); }
export async function getFeaturedOffersByPackage() { return fetchAPI('featured-offers/by-package/'); }
export async function getGlobalHeadCode() { return fetchAPI('website-settings/global-head-code/'); }
```
- **This is the key change.** These run on the SERVER at build time (SSG) or request time (SSR). No client-side fetch waterfalls.

### Task 2.3: Create `BaseLayout.astro`
- Pure HTML `<head>` with SEO meta tags passed as props
- Google Fonts (preconnect + stylesheet)
- GTM snippet (deferred)
- Global CSS import
- Navbar (Astro component with React island for mobile menu)
- `<slot />` for page content
- Footer (Astro component with React island for newsletter form)
- Toaster (React `client:idle`)
- **No react-helmet-async, no HelmetProvider, no Helmet**

### Task 2.4: Migrate Navbar
- **Astro wrapper** (`Navbar.astro`): Static HTML for desktop nav links, logo
- **React island** (`NavbarMobile.jsx`): Mobile hamburger menu with `client:media="(max-width: 1023px)"`
  - Only hydrates on mobile devices — zero JS on desktop
- Remove: `useNavigate` → use `<a href>` for all nav links
- Remove: `useEditorCheck` from Navbar (move admin toolbar to a separate `client:idle` island)
- Keep: Logo image (Astro `<Image>` for automatic optimization)

### Task 2.5: Migrate Footer
- **Astro wrapper** (`Footer.astro`): Fetch data server-side, render static HTML
  - `const packages = await getPackages();` (in frontmatter)
  - `const settings = await getWebsiteSettings();`
- **React island** (`NewsletterForm.jsx`): Just the email form with `client:visible`
- Remove: `deferredFetch`, `Link` from react-router → `<a href>`

### Task 2.6: Copy UI components (shadcn/ui)
- Copy `src/components/ui/` as-is (button.jsx, sheet.jsx, etc.)
- These are used within React islands, no changes needed

---

## Phase 3 — Homepage (SSG, Highest Priority)

> This is the most impactful page for SEO and performance. All data is fetched at build time.

### Task 3.1: Create `src/pages/index.astro`
```astro
---
// This runs at BUILD TIME (SSG)
import BaseLayout from '../layouts/BaseLayout.astro';
import { getStaticContent, getPackages, getFeaturedOffers, getReviews, getCards, getWebsiteSettings, getFeaturedOffersByPackage } from '../lib/api';

// Parallel server-side data fetching — all at build time
const [staticContent, packages, featuredOffers, reviews, cards, settings, offersByPackage] = await Promise.all([
  getStaticContent('home-page'),
  getPackages(),
  getFeaturedOffers(),
  getReviews(),
  getCards(),
  getWebsiteSettings(),
  getFeaturedOffersByPackage(),
]);

const pageData = staticContent?.page;
const seoTitle = pageData?.meta_title || 'Book Rome Sightseeing Tickets | Hop-on Hop-off Bus Tours';
const seoDescription = pageData?.meta_description || 'Explore Rome with our hop-on hop-off bus tours';
---

<BaseLayout title={seoTitle} description={seoDescription} schema={pageData?.schema_json}>
  <!-- Hero: Pure HTML + static image, zero JS -->
  <Hero />

  <!-- SectionNav: needs scroll spy → React island -->
  <SectionNav client:visible />

  <!-- Services: needs tabs/filters → React island, but HTML shell rendered server-side -->
  <Services client:visible packages={packages} offersByPackage={offersByPackage} />

  <!-- FeaturedToday: Static at build time if offers exist -->
  {featuredOffers?.data?.length > 0 && <FeaturedToday offers={featuredOffers.data} />}

  <!-- WhyBook: Pure static HTML, no JS needed -->
  <WhyBook />

  <!-- FinalCTA: Pure static HTML -->
  <FinalCTA />

  <!-- Reviews: Server-rendered HTML, no client JS needed -->
  <CustomerReviews reviews={reviews} />

  <!-- etc. -->
</BaseLayout>
```

### Task 3.2: Migrate Hero component
- **Convert to Astro component** (`Hero.astro`) — it's all static content now
- Hero image: Use Astro `<Image>` with `loading="eager"` for automatic format optimization (avif/webp)
- Trust Card: Pure HTML, no JS
- HeroFeaturedOffer: Remove entirely (data is in the build, render server-side)
- Buttons: Use `<a href="#tickets">` instead of `scrollIntoView` JS
- **Result: Hero sends ZERO JavaScript to the browser**

### Task 3.3: Migrate SectionNav
- Keep as React component with `client:visible`
- Replace `useNavigate` with `window.location.hash` or native `scrollIntoView`
- Scroll spy logic stays in React

### Task 3.4: Migrate Services
- Keep as React component with `client:visible`
- **Pass `packages` data as prop** from the Astro page (already fetched server-side)
- Remove the `useEffect` fetch — data comes from props
- Tabs, filters, sorting remain client-side interactive
- Cards render immediately (no loading spinner — data is already there)

### Task 3.5: Migrate remaining Home sections
| Component | Strategy | JS Shipped? |
|-----------|----------|-------------|
| Hero | Astro component | **0 KB** |
| SectionNav | React `client:visible` | ~2 KB |
| Services | React `client:visible` (data via props) | ~15 KB |
| FeaturedToday | Astro component (build-time data) | **0 KB** |
| WhyBook | Astro component | **0 KB** |
| FinalCTA | Astro component | **0 KB** |
| CustomerReviews | Astro component (build-time data) | **0 KB** |
| PromoBanner | Astro component (build-time data) | **0 KB** |
| RecommendedServices | Astro component (build-time data) | **0 KB** |
| Work | Astro component | **0 KB** |
| Contact | Astro + React form `client:visible` | ~3 KB |

### Task 3.6: Remove all React performance patches from Home
- Delete: `LazySection`, `Suspense` wrappers, `deferredFetch` usage
- Delete: `HeroFeaturedOffer.jsx` (no longer needed — server-rendered)
- Delete: Early Hints plugin from vite config (Astro handles this)
- Delete: `window.__HERO_PRELOAD` inline script from index.html

---

## Phase 4 — SEO-Critical Public Pages (SSG)

> These pages have static content managed via the CMS. Data fetched at build time.

### Task 4.1: About Us (`/aboutus`, `/about-us`)
- Create `src/pages/about-us.astro` + redirect from `/aboutus`
- Fetch `getStaticContent('about-us')` + `getWebsiteSettings()` in frontmatter
- Convert component to Astro template
- EditPanel → `client:idle` island (only loads for editors)

### Task 4.2: Terms & Conditions (`/terms`)
- Create `src/pages/terms.astro`
- Fetch `getStaticContent('terms-conditions')` + `getWebsiteSettings()`
- Pure HTML render, Edit button as `client:idle` island

### Task 4.3: Return Policy (`/returnPolicy`)
- Create `src/pages/returnPolicy.astro` (keep URL for backward compat)
- Fetch `getStaticContent('return-policy')` + `getWebsiteSettings()`

### Task 4.4: Refund (`/refund`)
- Create `src/pages/refund.astro`
- Fetch `getStaticContent('refund-policy')` + `getWebsiteSettings()`

### Task 4.5: Agent Points (`/agentpoints`)
- Create `src/pages/agentpoints.astro`
- Fetch `getStaticContent('agent-point')`
- Map section, form → `client:visible` React island

### Task 4.6: Offer Page (`/offer`)
- Create `src/pages/offer.astro`
- Fetch `getStaticContent('offer')` + offer data

### Task 4.7: 404 Page
- Create `src/pages/404.astro`
- Pure static HTML

### Task 4.8: Set up redirects for URL aliases
- `/aboutus` → `/about-us` (301 redirect)
- `/featured-today` → `/featured-offers`
- `/rome-sightseeing-deals` → `/featured-offers`

---

## Phase 5 — Dynamic Public Pages (SSR)

> These pages have dynamic content that changes frequently. Rendered on the edge at request time.

### Task 5.1: Blog Listing (`/blogs`)
- Create `src/pages/blogs.astro` with `export const prerender = false;`
- Fetch blog posts with pagination params from URL
- Server-render the listing, pass to Astro template

### Task 5.2: Blog Detail (`/blog/:slug`)
- Create `src/pages/blog/[slug].astro` with `export const prerender = false;`
- Fetch blog post by slug in frontmatter
- Full SEO: title, description, OG tags, schema.org from blog data
- Blog content rendered server-side (no client JS for content)
- Blog tracking → `client:idle` React island

### Task 5.3: Company Packages (`/company-packages/:slug`)
- Create `src/pages/company-packages/[slug].astro` with SSR
- Fetch packages + cards + static content by slug
- TicketCard → React `client:visible` island (date picker, counter, checkout)

### Task 5.4: Bus Company Page (`/bus/:companySlug/:companyName`)
- Create `src/pages/bus/[...slug].astro` with SSR
- Parse company slug and name from params

### Task 5.5: Featured Offers (`/featured-offers`)
- Create `src/pages/featured-offers.astro` with SSR
- Fetch live offers, render server-side
- Countdown timers → React `client:visible` island
- Handle `/featured-today` and `/rome-sightseeing-deals` as redirects

### Task 5.6: Ticket Comparison (`/compare-tickets`)
- Create `src/pages/compare-tickets.astro` with SSR
- Fetch all packages, render comparison table server-side
- Filters → React `client:visible` island

### Task 5.7: View Similar (`/viewsimilar/:hours/:company`)
- Create `src/pages/viewsimilar/[...slug].astro` with SSR

---

## Phase 6 — Auth & User Pages (Client-Only)

> These pages require authentication and have no SEO value. They are thin Astro shells wrapping React islands.

### Task 6.1: Login (`/login`)
- Create `src/pages/login.astro`
- Render `<LoginForm client:load />` — full React island
- Use `AuthLayout.astro` (minimal, no footer)

### Task 6.2: Registration (`/registation`)
- Create `src/pages/registation.astro`
- Render `<RegistrationForm client:load />`

### Task 6.3: Password Reset Flow
- `/forgot-password` → `src/pages/forgot-password.astro`
- `/reset-password` → `src/pages/reset-password.astro`
- `/reset-success` → `src/pages/reset-success.astro`
- Each wraps respective React component with `client:load`
- Migrate `ResetPasswordContext` to a simpler approach (prop drilling or Nanostores)

### Task 6.4: Profile (`/profile`)
- Create `src/pages/profile.astro`
- Auth check: Redirect to `/login` if no token (check on server or client)
- Render `<ProfilePage client:load />`

### Task 6.5: Your Tickets (`/yourticket`)
- Create `src/pages/yourticket.astro`
- Auth required, full React island

### Task 6.6: Manage Bookings (`/manageBookings/:status/:id`)
- Create `src/pages/manageBookings/[...slug].astro`
- Full React island for booking management

### Task 6.7: Stripe Checkout Flow
- `/checkout` → `<EmbeddedCheckout client:load />`
- `/payment-return` → `<PaymentReturn client:load />`
- `/success` → `<PaymentSuccess client:load />`
- `/success/:unique_id/` → `<Success client:load />`
- `/cancel/` → `<PaymentCancel client:load />`

### Task 6.8: Ticket Verification (`/verify/:code/`)
- Create `src/pages/verify/[code].astro`
- Full React island

---

## Phase 7 — Admin/Editor Pages (Client-Only)

### Task 7.1: Analytics (`/analytics`)
- Create `src/pages/analytics.astro`
- Auth + superuser check
- Full React island with `client:load`

### Task 7.2: Blog Analytics (`/blog-analytics`)
- Create `src/pages/blog-analytics.astro`
- Full React island

### Task 7.3: EditPanelSheet (cross-page admin toolbar)
- Create a shared `<EditorToolbar client:idle />` React island
- Conditionally rendered in `BaseLayout.astro` based on a client-side auth check
- Loads lazily — won't affect visitor performance at all

---

## Phase 8 — Global Concerns

### Task 8.1: SEO — Replace react-helmet with Astro `<head>`
- All SEO meta tags are now in the Astro layout's `<head>` section
- Props: `title`, `description`, `keywords`, `ogImage`, `schema`, `canonicalUrl`
- Schema.org JSON-LD rendered as `<script type="application/ld+json">`
- Canonical URL generated from `Astro.url`

### Task 8.2: GlobalSEO / Head Code Injection
- Fetch `global-head-code` server-side in `BaseLayout.astro`
- Inject directly into `<head>` as raw HTML using `<Fragment set:html={headCode} />`
- No more client-side DOM manipulation

### Task 8.3: Sitemap
- Use `@astrojs/sitemap` integration
- Configure in `astro.config.mjs` with custom pages
- Or proxy to backend: Cloudflare Pages `_redirects` rule

### Task 8.4: Analytics & Activity Tracking
- GTM: Deferred script in `BaseLayout.astro` `<head>` (same as current)
- `activityTracker.js`: Keep as client-side utility, import in React islands
- `useBlogTracking`: Keep as React hook, used in blog detail island

### Task 8.5: robots.txt
- Copy `public/robots.txt` as-is
- Update sitemap URL if needed

### Task 8.6: Auth State Management
- Replace `AuthContext` / `useAuth` with **Nanostores** (tiny, framework-agnostic)
- Auth state persists in localStorage, synced to nanostore
- Or: Keep simple localStorage checks (current approach minus Context)
- `useEditorCheck` → client-side utility, called in React islands
- `seAuthenticate` → client-side utility

---

## Phase 9 — Cloudflare Deployment

### Task 9.1: Configure Cloudflare Pages
- Connect GitHub repo (astro branch)
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `PUBLIC_API_URL`, etc.

### Task 9.2: Configure `_redirects`
```
/aboutus /about-us 301
/featured-today /featured-offers 301
/rome-sightseeing-deals /featured-offers 301
/sitemap.xml https://api.sightseeingroma.com/sitemap.xml 200
```

### Task 9.3: Configure `_headers`
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Task 9.4: Update backend CORS
- Add Cloudflare Pages domain to `CORS_ALLOWED_ORIGINS`
- Add to `ALLOWED_HOSTS`
- Test API access from Cloudflare edge

### Task 9.5: DNS & Domain Setup
- Point `www.sightseeingroma.com` to Cloudflare Pages
- Set up custom domain in Cloudflare Pages dashboard
- SSL auto-provisioned by Cloudflare

### Task 9.6: Set up build hooks (optional)
- Cloudflare Pages deploy hooks to trigger rebuild on content changes
- Backend webhook on content update → trigger Cloudflare rebuild (for SSG pages)

---

## Phase 10 — Cleanup & Verification

### Task 10.1: Delete React-only files no longer needed
- [See Files to Delete section below](#files-to-delete)

### Task 10.2: Lighthouse audit
- Target: FCP < 1s, LCP < 1s, Performance 90+, SEO 100
- Test on mobile throttled 4G

### Task 10.3: Verify all routes return correct HTML
- SSG pages: Check HTML source for meta tags, content
- SSR pages: Verify dynamic content renders
- Client islands: Verify interactivity works after hydration

### Task 10.4: Test all user flows
- Ticket booking (browse → select → date → checkout → payment)
- Blog reading
- Auth (login → profile → manage bookings)
- Admin (edit content, manage offers)

### Task 10.5: Verify SEO
- Google Search Console: Submit new sitemap
- Test with Google's Rich Results Test
- Verify structured data (schema.org)
- Check all Open Graph tags render in HTML source

---

## API Endpoint Catalogue

| Endpoint | Used By | Rendering | Server-Fetch? |
|----------|---------|-----------|---------------|
| `GET /packages/` | Services, Footer, CompanyThroughCard, TicketComparison, Ticket, TicketTypeSearch | SSG/SSR | ✅ Build/Edge |
| `GET /static-content/{slug}/` | Home, AboutUs, Terms, Refund, ReturnPolicy, AgentPoint, Offer, CompanyThroughCard, Companies, YourTickets | SSG/SSR | ✅ Build/Edge |
| `GET /featured-offers/` | FeaturedToday, FeaturedOffer, PromoBanner, HeroFeaturedOffer | SSG/SSR | ✅ Build/Edge |
| `GET /featured-offers/by-package/` | useActiveOffers (offer badges on cards) | SSG/SSR | ✅ Build/Edge |
| `GET /website-settings/` | Footer, Contact, AboutUs, Terms, Refund, ReturnPolicy | SSG/SSR | ✅ Build/Edge |
| `GET /website-settings/global-head-code/` | GlobalSEO | SSG | ✅ Build |
| `GET /reviews/` | CustomerReviews | SSG | ✅ Build |
| `GET /api/cards/` | RecommendedServices, CompanyThroughCard | SSG/SSR | ✅ Build/Edge |
| `GET /blog/posts/` | Blogs | SSR | ✅ Edge |
| `GET /blog/posts/{slug}/` | BlogDetail | SSR | ✅ Edge |
| `GET /partner-logos` | HeroBottom | SSG | ✅ Build |
| `POST /create-checkout-session/` | stripeCheckout | Client | ❌ Browser |
| `POST /newsletter/subscribe/` | Footer | Client | ❌ Browser |
| `POST /api/token/verify/` | seAuthenticate | Client | ❌ Browser |
| `GET /check-editor/` | useEditorCheck | Client | ❌ Browser |
| `GET /check-superuser/` | useSuperUser | Client | ❌ Browser |
| `GET /dashboard/` | YourTickets | Client | ❌ Browser |
| `GET /profile/` | Profile | Client | ❌ Browser |
| `POST /profile/update/` | ProfileInfo | Client | ❌ Browser |
| `GET /profile/statistics/` | PurchaseStats | Client | ❌ Browser |
| `POST /profile/change-password/` | ChangePassword | Client | ❌ Browser |
| `GET /analytics/` | Analytics | Client | ❌ Browser |
| `GET /blog-conversion-stats/` | BlogConversionStats | Client | ❌ Browser |
| `GET /authenticate/{code}/` | ProcessTicketsV2 | Client | ❌ Browser |
| `GET /claim/{code}/{agent}/{agentCode}/` | ProcessTicketsV2 | Client | ❌ Browser |
| `GET /success/{unique_id}/` | Success | Client | ❌ Browser |
| `POST /track-activity/` | activityTracker | Client | ❌ Browser |
| `POST /init-visitor-tracking/` | useBlogTracking | Client | ❌ Browser |
| `POST /track-blog-visit/` | useBlogTracking | Client | ❌ Browser |
| `POST /track-ticket-visit/` | useBlogTracking | Client | ❌ Browser |
| `POST /track-payment-initiate/` | useBlogTracking | Client | ❌ Browser |
| `POST /track-payment-complete/` | useBlogTracking | Client | ❌ Browser |
| `POST /track-payment-cancel/` | useBlogTracking | Client | ❌ Browser |
| Admin: `POST /pages/{slug}/update/` | EditPanelSheet | Client | ❌ Browser |
| Admin: `POST /pages/create/` | EditPanelSheet | Client | ❌ Browser |
| Admin: `GET/POST/PUT/DELETE /featured-offers/*` | FeaturedOffersManager | Client | ❌ Browser |
| Admin: `POST /upload-media/` | FeaturedOffersManager | Client | ❌ Browser |
| Admin: `GET/POST/PUT/DELETE /partner-logos/*` | PartnerLogosManager | Client | ❌ Browser |
| Admin: `POST /blog/posts/{slug}/update/` | BlogEditPanelSheet | Client | ❌ Browser |
| Admin: `POST /edit-content/{tag}/` | useStaticContent | Client | ❌ Browser |
| Admin: `POST /page-image/{tag}/update/` | useStaticContent | Client | ❌ Browser |

---

## Component Migration Map

### Convert to Astro Components (0 JS shipped)
| React Component | Astro Component | Notes |
|----------------|-----------------|-------|
| `Hero.jsx` | `Hero.astro` | Static image + text, no interactivity |
| `WhyBook.jsx` | `WhyBook.astro` | Pure content |
| `FinalCTA.jsx` | `FinalCTA.astro` | Simple button → `<a>` |
| `Work.jsx` | `Work.astro` | Pure content |
| `FeaturedToday.jsx` | `FeaturedToday.astro` | Data passed from page |
| `CustomerReviews.jsx` | `CustomerReviews.astro` | Data passed from page |
| `PromoBanner.jsx` | `PromoBanner.astro` | Data passed from page |
| `RecommendedServices.jsx` | `RecommendedServices.astro` | Data passed from page |
| `OptimizedImage.jsx` | Astro `<Image>` | Built-in optimization |
| `Loader.jsx` | CSS spinner | No React needed |
| `SEO.jsx` | Part of `BaseLayout.astro` `<head>` | Eliminated |
| `GlobalSEO.jsx` | Part of `BaseLayout.astro` `<head>` | Eliminated |
| `HelmetWrapper.jsx` | Eliminated | Props in layout |
| `LazySection.jsx` | Eliminated | Not needed with SSG/SSR |
| `RequireAuth.jsx` | Middleware or client check | Simplified |

### Keep as React Islands (interactive)
| Component | Hydration Directive | Notes |
|-----------|-------------------|-------|
| `SectionNav.jsx` | `client:visible` | Scroll spy |
| `Services.jsx` + `Card.jsx` | `client:visible` | Tabs, filters (data via props) |
| `TicketCard.jsx` | `client:visible` | Date picker, counter, checkout |
| `NavbarMobile.jsx` (extracted) | `client:media="(max-width:1023px)"` | Mobile menu only |
| `Contact.jsx` form part | `client:visible` | Contact form |
| `NewsletterForm.jsx` (extracted) | `client:visible` | Email subscribe |
| `CountdownTimer.jsx` | `client:visible` | Featured offer timers |
| `DateSelector.jsx` | `client:visible` | Date picking |
| `TicketCounter.jsx` | `client:visible` | +/- counter |
| `EmailModal.jsx` | `client:idle` | Modal |
| `Login.jsx` | `client:load` | Auth form |
| `Regi.jsx` | `client:load` | Auth form |
| `ResetPassword/*.jsx` | `client:load` | Auth flow |
| `Profile/*.jsx` | `client:load` | Protected page |
| `ManageBooking*.jsx` | `client:load` | Protected page |
| `EmbeddedCheckout.jsx` | `client:load` | Stripe |
| `EditPanelSheet.jsx` | `client:idle` | Admin only |
| `FeaturedOffersManager.jsx` | `client:idle` | Admin only |
| `MediaLibraryModal.jsx` | `client:idle` | Admin only |
| `ImageUploadModal.jsx` | `client:idle` | Admin only |
| `Analytics.jsx` | `client:load` | Admin dashboard |
| `BlogConversionStats.jsx` | `client:load` | Admin dashboard |
| `EditContentModal.jsx` | `client:idle` | Admin CMS |
| `TicketComparison.jsx` (filters) | `client:visible` | Interactive table |

---

## Files to Delete

These files are React SPA infrastructure or performance patches that are unnecessary in Astro:

```
src/main.jsx                          # Astro has its own entry
src/App.jsx                           # No app shell needed
src/routes/Routes.jsx                 # File-based routing
src/Layouts/Main.jsx                  # Replaced by BaseLayout.astro
src/Components/LazySection.jsx        # Not needed (SSG/SSR)
src/Components/GlobalSEO.jsx          # Moved to layout <head>
src/Components/SEO/SEO.jsx            # Moved to layout <head>
src/Components/RequireAuth.jsx        # Simplified to middleware/redirect
src/utilities/HelmetWrapper.jsx       # Eliminated
src/utilities/deferredFetch.js        # Not needed (server fetch)
src/utilities/scrollToTop.js          # CSS scroll-behavior: smooth
src/hooks/useActiveOffers.jsx         # Data fetched server-side via props
src/hooks/useLazyFetch.js             # Not needed
src/Components/OptimizedImage/        # Astro <Image> replaces this
src/Components/Hero/HeroFeaturedOffer.jsx  # Server-rendered now
index.html                            # Astro generates HTML
vite.config.js                        # Astro has its own config
netlify.toml                          # Replaced by Cloudflare config
public/_headers                       # Cloudflare _headers
public/_redirects                     # Cloudflare _redirects
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Backend CORS blocks Cloudflare edge | Medium | High | Update CORS before deploying. Test with staging domain first. |
| Stripe Embedded Checkout doesn't work in island | Low | High | Stripe React SDK works fine in islands. Test early in Phase 6. |
| SSG pages show stale data | Medium | Medium | Set up Cloudflare deploy hooks. Or use ISR (Incremental Static Regeneration) if Cloudflare supports it, else use SSR with `cache-control`. |
| Dynamic routes miss edge cases | Medium | Medium | Map all routes carefully. Add redirect rules for old URL patterns. |
| Firebase auth breaks | Low | Medium | Check if Firebase is actually used (may be vestigial). Test auth flow. |
| `class` vs `className` in Astro templates | Medium | Low | Astro uses `class`. React islands keep `className`. Careful in migration. |
| CSS conflicts between Astro and React | Low | Low | Same Tailwind config. Test visual parity. |
| Build time increases with SSG pages | Low | Low | Only ~10 SSG pages. Build should be fast. |
| Admin editor features break | Medium | Medium | Admin features are 100% client-side React islands — minimal risk. |
| SEO regressions during migration | Medium | High | Deploy to staging first. Compare HTML output with Google Cache. |

---

## Expected Performance After Migration

| Metric | Current (React SPA) | Target (Astro SSG) | Why |
|--------|---------------------|--------------------|-----|
| FCP | 2.0s | **< 0.5s** | HTML arrives pre-rendered, no JS needed for first paint |
| LCP | 5.2s | **< 1.0s** | Hero image in static HTML, no API waterfall |
| TBI | 130ms | **< 50ms** | Minimal JS on page (only islands) |
| CLS | 0 | **0** | Server-rendered layout is stable |
| Speed Index | 5.2s | **< 1.5s** | Content visible immediately |
| JS Bundle (Home) | ~280 KB (gzipped) | **< 30 KB** | Only SectionNav + Services islands load |
| Time to Interactive | ~4s | **< 1.5s** | Islands hydrate independently |

---

## Execution Order Summary

```
Phase 0: Pre-migration prep (CORS, env vars, backup)          → ~1 hour
Phase 1: Astro scaffold + config                               → ~2 hours
Phase 2: Layout, Navbar, Footer                                → ~4 hours
Phase 3: Homepage (THE BIG WIN)                                → ~6 hours
Phase 4: Static content pages (About, Terms, etc.)             → ~4 hours
Phase 5: Dynamic pages (Blogs, Companies, Offers)              → ~8 hours
Phase 6: Auth & user pages                                     → ~6 hours
Phase 7: Admin pages                                           → ~4 hours
Phase 8: Global SEO, analytics, sitemap                        → ~2 hours
Phase 9: Cloudflare deployment                                 → ~2 hours
Phase 10: Testing & cleanup                                    → ~4 hours
                                                        TOTAL: ~43 hours
```

---

> **Ready to begin on your signal.** We'll start with Phase 0 + Phase 1 (scaffold), then proceed phase by phase, testing each milestone before moving on.
