/**
 * Vite plugin that inlines critical CSS and defers the full stylesheet.
 *
 * How it works:
 * 1. After Vite builds the bundle, it reads the generated CSS file.
 * 2. It extracts a small subset of "critical" CSS: CSS custom properties,
 *    Tailwind preflight/base reset, body/font styles, and the navbar class.
 *    These are the styles needed to render the initial viewport before React
 *    boots (preventing FOUC / layout shift).
 * 3. It inlines that critical CSS as a <style> block in <head>.
 * 4. It converts the full CSS <link rel="stylesheet"> to a non-render-blocking
 *    pattern using media="print" + onload="this.media='all'", with a <noscript>
 *    fallback.
 *
 * Result: The browser can start painting immediately with the critical styles
 * instead of waiting for the full 47KB CSS to download and parse.
 */

/**
 * Extract critical CSS rules from the full stylesheet.
 * We grab:
 * - The :root block with CSS custom properties (theme colors, radius, etc.)
 * - Tailwind preflight/base resets (*, ::before, ::after, html, body)
 * - The body font-family rule
 * - Core layout utilities needed by the shell (flex, relative, w-full, etc.)
 * - The .navbar class (DaisyUI component used in the persistent Navbar)
 * - The .bg-background and .text-foreground rules (applied to <body>)
 */
function extractCriticalCSS(fullCSS) {
  const critical = [];

  // 1. CSS custom properties (:root blocks)
  // Match ALL :root { ... } blocks — there are multiple (DaisyUI fallbacks + theme + custom vars)
  const rootMatches = fullCSS.matchAll(/:root\s*\{[^}]+\}/g);
  for (const m of rootMatches) {
    critical.push(m[0]);
  }

  // 2. Tailwind preflight resets — the key universal box-sizing reset
  // There are two *,:before,:after blocks: one with CSS vars, one with box-sizing
  const universalMatches = fullCSS.matchAll(/\*\s*,\s*:?:?before\s*,\s*:?:?after\s*\{[^}]+\}/g);
  for (const m of universalMatches) {
    critical.push(m[0]);
  }
  // :before,:after content reset
  const beforeAfterMatches = fullCSS.matchAll(/:?:?before\s*,\s*:?:?after\s*\{[^}]+\}/g);
  for (const m of beforeAfterMatches) {
    // Skip if already captured as part of *,:before,:after
    if (!m[0].startsWith('*')) critical.push(m[0]);
  }
  // ::backdrop and html rules
  const singlePatterns = [
    /::backdrop\s*\{[^}]+\}/,
    /html\s*(?:,\s*:host\s*)?\{[^}]+\}/,
  ];
  for (const pat of singlePatterns) {
    const m = fullCSS.match(pat);
    if (m) critical.push(m[0]);
  }

  // 3. Body styles (margin reset, bg/text color, font-family)
  // There are multiple body{} rules in the built CSS; grab key ones
  const bodyMatches = fullCSS.matchAll(/body\s*\{[^}]+\}/g);
  for (const m of bodyMatches) {
    const rule = m[0];
    // Include rules for: reset (margin/line-height), bg/color, font-family, z-index
    if (/margin|background-color|font-family|line-height:inherit|z-index/.test(rule)) {
      critical.push(rule);
    }
  }

  // 4. Tailwind @layer base body rule
  // .bg-background applies via @apply in index.css
  const bgBg = fullCSS.match(/\.bg-background\{[^}]+\}/);
  if (bgBg) critical.push(bgBg[0]);
  const textFg = fullCSS.match(/\.text-foreground\{[^}]+\}/);
  if (textFg) critical.push(textFg[0]);

  // 5. .navbar component (DaisyUI) — persistent across all pages
  const navbarBase = fullCSS.match(/\.navbar\{[^}]+\}/);
  if (navbarBase) critical.push(navbarBase[0]);

  // 6. Core layout utility classes used in the app shell / above-fold
  const coreUtilities = [
    '.flex{', '.items-center{', '.justify-between{', '.justify-center{',
    '.relative{', '.absolute{', '.fixed{', '.sticky{',
    '.w-full{', '.h-full{', '.hidden{', '.block{',
    '.overflow-hidden{', '.z-50{', '.z-40{', '.z-10{',
    '.inset-0{', '.min-h-screen{',
    '.container{', '.mx-auto{',
    '.text-white{', '.text-center{',
    '.bg-white{', '.bg-black{', '.bg-transparent{',
    '.font-bold{', '.font-medium{', '.font-semibold{',
    '.text-sm{', '.text-base{', '.text-lg{', '.text-xl{',
    '.p-4{', '.px-4{', '.py-3\\.5{',
    '.gap-2{', '.gap-3{', '.gap-4{',
    '.transition{', '.transition-all{', '.transition-colors{',
    '.duration-300{', '.duration-200{',
    '.rounded-lg{', '.rounded-xl{', '.rounded-full{',
    '.shadow-lg{', '.shadow-2xl{',
    '.object-cover{', '.border-border{',
  ];

  for (const prefix of coreUtilities) {
    // Find the complete rule: .class-name{...}
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match from the prefix to the next closing brace
    const re = new RegExp(escaped.replace(/\\\{$/, '') + '\\{[^}]+\\}');
    const m = fullCSS.match(re);
    if (m) critical.push(m[0]);
  }

  // 7. @layer base rules: * { @apply border-border } and body { @apply bg-background text-foreground }
  const borderBorder = fullCSS.match(/\.border-border\{[^}]+\}/);
  if (borderBorder) critical.push(borderBorder[0]);

  // Deduplicate
  const seen = new Set();
  const deduped = critical.filter(rule => {
    if (seen.has(rule)) return false;
    seen.add(rule);
    return true;
  });

  return deduped.join('');
}

export default function criticalCSSPlugin() {
  return {
    name: 'vite-plugin-critical-css',
    enforce: 'post',
    apply: 'build',

    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html;

        // Find the CSS asset in the bundle
        let cssContent = '';
        let cssFileName = '';
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (fileName.endsWith('.css') && asset.type === 'asset') {
            cssContent = typeof asset.source === 'string'
              ? asset.source
              : new TextDecoder().decode(asset.source);
            cssFileName = fileName;
            break;
          }
        }

        if (!cssContent || !cssFileName) {
          console.warn('[critical-css] No CSS asset found in bundle');
          return html;
        }

        // Extract critical CSS
        const criticalCSS = extractCriticalCSS(cssContent);
        const criticalSize = (criticalCSS.length / 1024).toFixed(1);
        const fullSize = (cssContent.length / 1024).toFixed(1);
        console.log(`[critical-css] Inlined ${criticalSize}KB critical CSS (full: ${fullSize}KB)`);

        // Build the inline style block
        const inlineStyle = `<style>${criticalCSS}</style>`;

        // Build the deferred stylesheet link with noscript fallback
        const cssHref = `/${cssFileName}`;
        const deferredLink = `<link rel="stylesheet" href="${cssHref}" media="print" onload="this.media='all'" crossorigin>` +
          `<noscript><link rel="stylesheet" href="${cssHref}" crossorigin></noscript>`;

        // Replace the original render-blocking <link rel="stylesheet" ...css> with our version
        const cssLinkRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/[^"]+\.css"\s*>/;
        if (cssLinkRegex.test(html)) {
          html = html.replace(cssLinkRegex, `${inlineStyle}\n  ${deferredLink}`);
        } else {
          // Try alternative pattern
          const altRegex = /<link\s+rel="stylesheet"\s+href="\/assets\/[^"]+\.css"[^>]*>/;
          if (altRegex.test(html)) {
            html = html.replace(altRegex, `${inlineStyle}\n  ${deferredLink}`);
          } else {
            console.warn('[critical-css] Could not find CSS link tag to replace');
          }
        }

        // Remove modulepreload for heavy chunks that are not needed on initial page load
        // (Monaco editor is only used on admin/editing pages)
        html = html.replace(/<link\s+rel="modulepreload"\s+crossorigin\s+href="\/assets\/vendor-monaco[^"]*\.js"\s*>\n?\s*/g, '');

        // Remove modulepreload for other heavy admin-only chunks
        html = html.replace(/<link\s+rel="modulepreload"\s+crossorigin\s+href="\/assets\/vendor-charts[^"]*\.js"\s*>\n?\s*/g, '');
        html = html.replace(/<link\s+rel="modulepreload"\s+crossorigin\s+href="\/assets\/vendor-syntax[^"]*\.js"\s*>\n?\s*/g, '');

        return html;
      },
    },
  };
}
