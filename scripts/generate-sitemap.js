/**
 * Dynamic Sitemap Generator
 * This script fetches dynamic routes from the backend API and generates a complete sitemap.xml
 * Run this script before building for production to include all dynamic package URLs.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://www.sightseeingroma.com';
const API_URL = 'https://api.sightseeingroma.com'; // Production API URL

// Static routes with their priorities and change frequencies
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/compare-tickets', priority: 0.9, changefreq: 'daily' },
  { path: '/aboutus', priority: 0.7, changefreq: 'monthly' },
  { path: '/agentpoints', priority: 0.7, changefreq: 'monthly' },
  { path: '/offer', priority: 0.8, changefreq: 'weekly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
  { path: '/returnPolicy', priority: 0.5, changefreq: 'yearly' },
  { path: '/refund', priority: 0.5, changefreq: 'yearly' },
  { path: '/login', priority: 0.6, changefreq: 'monthly' },
  { path: '/registation', priority: 0.6, changefreq: 'monthly' },
  { path: '/forgot-password', priority: 0.4, changefreq: 'yearly' },
];

// Routes to exclude from sitemap (private/user-specific pages)
const excludedRoutes = [
  '/analytics',
  '/yourticket',
  '/profile',
  '/success',
  '/cancel',
  '/checkout',
  '/payment-return',
  '/reset-password',
  '/reset-success',
  '/test',
];

/**
 * Fetch dynamic routes from backend API
 */
async function fetchDynamicRoutes() {
  const dynamicRoutes = [];

  try {
    // Fetch all bus packages
    console.log('📦 Fetching bus packages...');
    const packagesResponse = await fetch(`${API_URL}/packages/`);
    
    if (packagesResponse.ok) {
      const packagesData = await packagesResponse.json();
      
      if (packagesData.bus_data && Array.isArray(packagesData.bus_data)) {
        packagesData.bus_data.forEach(pkg => {
          // Add manage booking URLs for each package
          if (pkg.package_tag) {
            // Determine status - use E9 if duration exists, otherwise E8
            const status = pkg.duration ? 'E9' : 'E8';
            dynamicRoutes.push({
              path: `/manageBookings/${status}/${pkg.package_tag}`,
              priority: 0.8,
              changefreq: 'weekly',
              lastmod: pkg.updated_at || new Date().toISOString(),
            });
          }
        });
        console.log(`   ✅ Found ${packagesData.bus_data.length} packages, added ${dynamicRoutes.length} routes`);
      }
    } else {
      console.log('   ⚠️ Could not fetch packages, continuing with static routes only');
    }
  } catch (error) {
    console.log(`   ⚠️ API not available: ${error.message}`);
    console.log('   Continuing with static routes only...');
  }

  try {
    // Fetch ticket folders/companies
    console.log('🏢 Fetching companies...');
    const foldersResponse = await fetch(`${API_URL}/ticket-folders/`);
    
    if (foldersResponse.ok) {
      const foldersData = await foldersResponse.json();
      
      if (foldersData.data && Array.isArray(foldersData.data)) {
        foldersData.data.forEach(folder => {
          if (folder.company_slug) {
            dynamicRoutes.push({
              path: `/company-packages/${folder.company_slug}`,
              priority: 0.8,
              changefreq: 'weekly',
            });
            
            // Also add bus route if company name exists
            if (folder.company_name) {
              dynamicRoutes.push({
                path: `/bus/${folder.company_slug}/${encodeURIComponent(folder.company_name)}`,
                priority: 0.8,
                changefreq: 'weekly',
              });
            }
          }
        });
        console.log(`   ✅ Found ${foldersData.data.length} companies`);
      }
    } else {
      console.log('   ⚠️ Could not fetch companies');
    }
  } catch (error) {
    console.log(`   ⚠️ Could not fetch companies: ${error.message}`);
  }

  return dynamicRoutes;
}

/**
 * Generate XML sitemap content
 */
function generateSitemapXML(routes) {
  const today = new Date().toISOString().split('T')[0];
  
  const urlEntries = routes.map(route => {
    const lastmod = route.lastmod ? route.lastmod.split('T')[0] : today;
    return `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt() {
  return `# Robots.txt for ${BASE_URL}
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Disallow private/user-specific pages
${excludedRoutes.map(route => `Disallow: ${route}`).join('\n')}
Disallow: /verify/
Disallow: /success/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
`;
}

/**
 * Main function
 */
async function main() {
  console.log('🗺️  Sitemap Generator for SightseeingRoma');
  console.log('=========================================\n');

  // Fetch dynamic routes
  const dynamicRoutes = await fetchDynamicRoutes();

  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Remove duplicates based on path
  const uniqueRoutes = allRoutes.filter((route, index, self) =>
    index === self.findIndex(r => r.path === route.path)
  );

  console.log(`\n📊 Total unique routes: ${uniqueRoutes.length}`);

  // Generate sitemap XML
  const sitemapXML = generateSitemapXML(uniqueRoutes);
  
  // Write sitemap to public folder
  const publicDir = path.resolve(__dirname, '../public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemapXML, 'utf-8');
  console.log(`✅ Sitemap written to: ${sitemapPath}`);

  // Generate and write robots.txt
  const robotsTxt = generateRobotsTxt();
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
  console.log(`✅ Robots.txt written to: ${robotsPath}`);

  console.log('\n🎉 Sitemap generation complete!\n');
}

// Run the script
main().catch(console.error);
